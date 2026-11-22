/**
 * Unit Tests for Intelligent Lab Test Analysis Engine (Part 29 of 30)
 * Validates:
 * - Data validation & impossible physical values (e.g. moisture > 100%, negative fat, pH > 14)
 * - Reference standard & QC spec compliance
 * - Trend evaluation & drift detection
 * - 4-pillar root cause hypothesis (Equipment, Calibration, Reagents, Sample Preparation)
 * - Evidence-grounded phrasing without absolute blame assertions
 * - Non-destructive raw data preservation
 * - Standard output structure (Result, Status, Suspect Data, Probable Errors, Evidence, Suggestions, Sources)
 */

import {
  analyzeIntelligentLabTest,
  LabAnalysisInput
} from '../src/lib/products/labAnalysisEngine';
import { QualityControlSpec, TestResultEntry } from '../src/types/foodProduct';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- RUNNING UNIT TESTS FOR INTELLIGENT LAB ANALYSIS ENGINE ---');

// Mock QC Specifications
const mockQcSpecs: QualityControlSpec[] = [
  {
    id: 'qc_ph',
    parameterNameFa: 'pH (اسیدیته فعال)',
    parameterType: 'physicochemical',
    unit: 'pH',
    targetValue: '4.2',
    minAcceptableLimit: 4.0,
    maxAcceptableLimit: 4.5,
    standardReference: 'INSO 2852',
    testingMethod: 'پتانسیومتری با الکترود شیشه‌ای کالیبره'
  },
  {
    id: 'qc_fat',
    parameterNameFa: 'درصد چربی (Fat %)',
    parameterType: 'physicochemical',
    unit: '%',
    targetValue: '1.5',
    minAcceptableLimit: 1.4,
    maxAcceptableLimit: 1.8,
    standardReference: 'INSO 366',
    testingMethod: 'روش ژربر اسیدبوتیرومتری'
  },
  {
    id: 'qc_moisture',
    parameterNameFa: 'درصد رطوبت (Moisture %)',
    parameterType: 'physicochemical',
    unit: '%',
    targetValue: '88.0',
    minAcceptableLimit: 85.0,
    maxAcceptableLimit: 91.0,
    standardReference: 'INSO 2705',
    testingMethod: 'آون هوای داغ ۱۰۵ درجه تا وزن ثابت'
  }
];

// Test 1: Normal Compliant Run
{
  const input: LabAnalysisInput = {
    batchNumber: 'BATCH-2026-001',
    measuredParameters: {
      'pH (اسیدیته فعال)': { value: 4.25, unit: 'pH' },
      'درصد چربی (Fat %)': { value: 1.55, unit: '%' },
      'درصد رطوبت (Moisture %)': { value: 87.5, unit: '%' }
    },
    qcSpecifications: mockQcSpecs,
    instrumentAudit: [
      {
        instrumentName: 'pH متر دیجیتال Mettler Toledo',
        calibrationStatus: 'valid',
        calibrationSlopeOrFactor: 98.5
      }
    ],
    reagentAudit: [
      {
        reagentName: 'بافر استاندارد pH 4.01 و 7.00',
        isExpired: false
      }
    ],
    sampleAudit: {
      sampleTemperatureC: 22.0,
      homogenizationMethod: 'هموژنایزر آزمایشگاهی Ultra-Turrax'
    }
  };

  const report = analyzeIntelligentLabTest(input);

  assert(report.overallStatus === 'compliant_normal', `Expected compliant_normal, got ${report.overallStatus}`);
  assert(report.complianceRatePercent === 100, `Expected 100% compliance, got ${report.complianceRatePercent}`);
  assert(report.suspectDataPoints.length === 0, `Expected 0 suspect data points, got ${report.suspectDataPoints.length}`);
  assert(report.rawInputDataPreserved['درصد چربی (Fat %)'].value === 1.55, 'Preserved raw input data faithfully');
}

// Test 2: Detection of Physical Impossibilities (Moisture > 100%, pH > 14)
{
  const input: LabAnalysisInput = {
    batchNumber: 'BATCH-ERR-002',
    measuredParameters: {
      'pH (اسیدیته فعال)': { value: 15.2, unit: 'pH' }, // Impossible pH!
      'درصد رطوبت (Moisture %)': { value: 112.0, unit: '%' }, // Impossible Moisture!
      'درصد چربی (Fat %)': { value: -0.5, unit: '%' } // Impossible Fat!
    },
    qcSpecifications: mockQcSpecs
  };

  const report = analyzeIntelligentLabTest(input);

  assert(report.overallStatus === 'suspect_invalid', `Expected suspect_invalid, got ${report.overallStatus}`);
  assert(report.suspectDataPoints.length >= 3, `Expected at least 3 critical suspect points, got ${report.suspectDataPoints.length}`);

  const impossiblePoints = report.suspectDataPoints.filter((s) => s.anomalyType === 'physical_impossible');
  assert(impossiblePoints.length >= 3, `Expected physical_impossible points, got ${impossiblePoints.length}`);

  // System must NEVER modify input data silently
  assert(report.parameterDetails.find((p) => p.parameterNameFa.includes('رطوبت'))?.measuredValue === 112.0, 'Raw value was NOT modified');
}

// Test 3: Calibration Expiration & Equipment Drift Investigation
{
  const input: LabAnalysisInput = {
    batchNumber: 'BATCH-CAL-003',
    measuredParameters: {
      'pH (اسیدیته فعال)': { value: 4.8, unit: 'pH' } // Out of spec (max 4.5)
    },
    qcSpecifications: mockQcSpecs,
    instrumentAudit: [
      {
        instrumentName: 'pH متر رومیزی',
        calibrationStatus: 'expired',
        calibrationDueDate: '1402/11/01',
        calibrationSlopeOrFactor: 86.0 // Degraded slope
      }
    ]
  };

  const report = analyzeIntelligentLabTest(input);

  assert(report.calibrationAudit.status === 'expired', `Expected calibration status expired, got ${report.calibrationAudit.status}`);
  assert(report.probableErrorHypotheses.some((h) => h.pillar === 'calibration'), 'Calibration hypothesis created');

  // Verify non-dogmatic language: "یکی از احتمالات است" instead of "حتماً مشکل از"
  const calHypothesis = report.probableErrorHypotheses.find((h) => h.pillar === 'calibration');
  assert(
    calHypothesis?.hypothesisStatementFa.includes('یکی از احتمالات') === true,
    'Hypothesis uses probabilistic scientific phrasing ("یکی از احتمالات است")'
  );
  assert(
    !calHypothesis?.hypothesisStatementFa.includes('حتماً مشکل از'),
    'Forbidden assertion "حتماً مشکل از" is strictly absent'
  );
}

// Test 4: Historical Trend & Drift Detection
{
  const historicalResults: TestResultEntry[] = [
    {
      id: 'h1',
      trialDate: '2026-03-01',
      formulationVersionId: 'v1',
      batchNumber: 'B-01',
      scale: 'pilot',
      batchSizeKg: 10,
      measuredParameters: { 'pH (اسیدیته فعال)': { value: 4.05, conforms: true } },
      overallVerdict: 'passed',
      operatorOrScientist: 'Dr. Test'
    },
    {
      id: 'h2',
      trialDate: '2026-03-02',
      formulationVersionId: 'v1',
      batchNumber: 'B-02',
      scale: 'pilot',
      batchSizeKg: 10,
      measuredParameters: { 'pH (اسیدیته فعال)': { value: 4.15, conforms: true } },
      overallVerdict: 'passed',
      operatorOrScientist: 'Dr. Test'
    },
    {
      id: 'h3',
      trialDate: '2026-03-03',
      formulationVersionId: 'v1',
      batchNumber: 'B-03',
      scale: 'pilot',
      batchSizeKg: 10,
      measuredParameters: { 'pH (اسیدیته فعال)': { value: 4.30, conforms: true } },
      overallVerdict: 'passed',
      operatorOrScientist: 'Dr. Test'
    }
  ];

  const input: LabAnalysisInput = {
    batchNumber: 'B-04',
    measuredParameters: {
      'pH (اسیدیته فعال)': { value: 4.45, unit: 'pH' } // Continuing upward trend!
    },
    qcSpecifications: mockQcSpecs,
    historicalResults
  };

  const report = analyzeIntelligentLabTest(input);
  const phDetail = report.parameterDetails.find((p) => p.parameterNameFa.includes('pH'));

  assert(phDetail?.historicalTrend === 'increasing', `Expected increasing trend, got ${phDetail?.historicalTrend}`);
  assert(report.trendSummaryFa.includes('انحراف جهت‌دار') || report.trendSummaryFa.includes('Drift'), 'Trend drift detected in summary');
}

// Test 5: Reagent Expiration & Blank Reading Warning
{
  const input: LabAnalysisInput = {
    batchNumber: 'B-REAG-05',
    measuredParameters: {
      'درصد چربی (Fat %)': { value: 2.1, unit: '%' } // High
    },
    qcSpecifications: mockQcSpecs,
    reagentAudit: [
      {
        reagentName: 'اسید سولفوریک ژربر دانسیته ۱.۸۲',
        isExpired: true,
        expiryDate: '1402/08/20'
      }
    ],
    sampleAudit: {
      sampleTemperatureC: 35 // High sample temp!
    }
  };

  const report = analyzeIntelligentLabTest(input);

  assert(report.reagentAudit.status === 'expired', 'Reagent status marked as expired');
  assert(report.samplePrepAudit.status === 'deviation_suspected', 'Sample preparation marked as deviation suspected due to temperature');
  assert(report.investigationRecommendationsFa.length >= 3, 'Actionable CAPA recommendations provided');
  assert(report.sourceStandards.length > 0, 'Source standards cited in output');
}

console.log('🎉 ALL UNIT TESTS FOR LAB ANALYSIS ENGINE PASSED WITH ZERO ERRORS!');
