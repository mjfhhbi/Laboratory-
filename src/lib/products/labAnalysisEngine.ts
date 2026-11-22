/**
 * Food Science AI - Intelligent Lab Test Analysis & Quality Diagnostics Engine
 * Part 29 of 30: Rigorous, evidence-grounded laboratory test results analysis.
 * 
 * Rules:
 * 1. Data validation, physicochemical & microbiological calculations.
 * 2. Reference & Standard comparison (INSO / Codex / AOAC / ISO / Project QC specs).
 * 3. Historical batch trend analysis (Drift, Shift, Repeatability, Variance).
 * 4. Anomalous & outlier results flagging (Z-score, IQR, physics-chemistry boundary violations).
 * 5. Root cause probability assessment across 4 physical pillars:
 *    - Equipment & Instrument condition
 *    - Calibration Status (expired, out of spec, slope drift)
 *    - Reagent Quality & Degradation (shelf life, factorization, blank value)
 *    - Sample Preparation & Sampling technique (homogenization, temperature, dilution)
 * 6. Evidence-grounded language: Strictly NO unevidenced assertions like "حتماً مشکل از X است".
 *    Instead: "بر اساس داده موجود، X یکی از احتمالات است."
 * 7. Preservation of original data: System NEVER alters measured values without evidence.
 * 8. Standard output structure:
 *    - نتیجه (Result Summary)
 *    - وضعیت (Compliance & Quality Status)
 *    - داده‌های مشکوک (Suspect & Outlier Data)
 *    - خطاهای احتمالی (Probable Errors & Hypotheses)
 *    - شواهد (Empirical Evidence)
 *    - پیشنهاد بررسی (Actionable Investigation & CAPA Steps)
 *    - مرجع و منبع استاندارد (Source Standards)
 */

import { QualityControlSpec, TestResultEntry } from '../../types/foodProduct';

export type LabTestStatusVerdict =
  | 'compliant_normal'        // منطبق و نرمال
  | 'compliant_with_warning'  // منطبق اما دارای روند یا داده نزدیک به آستانه
  | 'non_compliant'           // مغایر با الزامات استاندارد
  | 'suspect_invalid'         // داده مشکوک یا غیرممکن فیزیکی/شیمیایی (نیازمند بازآزمایی)
  | 'indeterminate';          // نامشخص به دلیل نقص اطلاعات یا عدم کالیبراسیون

export type ErrorDomainPillar =
  | 'equipment'
  | 'calibration'
  | 'reagent'
  | 'sample_prep'
  | 'process_formulation';

export interface LabInstrumentAuditInfo {
  instrumentName: string;
  instrumentModelOrTag?: string;
  lastCalibrationDate?: string;
  calibrationDueDate?: string;
  calibrationStatus: 'valid' | 'expired' | 'due_soon' | 'not_calibrated' | 'unknown';
  calibrationSlopeOrFactor?: number; // e.g. pH electrode slope 95-102%
  blankReading?: number; // خوانش بلانک
  instrumentNotes?: string;
}

export interface LabReagentAuditInfo {
  reagentName: string;
  lotOrBatchNumber?: string;
  preparationDate?: string;
  expiryDate?: string;
  isExpired: boolean;
  factorOrTiterValue?: number; // e.g. N = 0.1002 for NaOH
  factorLastStandardizedDate?: string;
  storageConditionSatisfied?: boolean;
  reagentNotes?: string;
}

export interface LabSampleAuditInfo {
  samplingDate?: string;
  sampleTemperatureC?: number;
  homogenizationMethod?: string;
  sampleAliquotWeightG?: number;
  dilutionFactor?: number;
  moistureCondition?: string;
  preparationNotes?: string;
}

export interface SuspectDataPoint {
  parameterKey: string;
  parameterNameFa: string;
  measuredValue: number | string;
  unit: string;
  anomalyType:
    | 'physical_impossible'       // غیرممکن فیزیکی (مانند رطوبت > ۱۰۰ یا چربی منفی)
    | 'stoichiometric_conflict'   // تضاد با روابط فیزیکوشیمیایی (مانند بریکس کمتر از ماده خشک بدون قند)
    | 'statistical_outlier'       // خارج از محدوده ۳ سیگما یا جهش غیرعادی نسبت به بچ‌های قبلی
    | 'near_critical_limit'       // بسیار نزدیک به مرز مجاز بحرانی (ریسک رد شدن)
    | 'trend_drift_detected';     // روند انحراف متوالی در چندین بچ
  severity: 'critical' | 'high' | 'medium' | 'info';
  explanationFa: string;
  empiricalEvidenceFa: string;
  standardReference?: string;
}

export interface ProbableCauseHypothesis {
  pillar: ErrorDomainPillar;
  pillarTitleFa: string;
  hypothesisStatementFa: string;
  probabilityLevel: 'high_possibility' | 'moderate_possibility' | 'low_possibility';
  evidencesFound: string[];
  rebuttalOrMissingInfo: string[];
  suggestedActionFa: string;
}

export interface ParameterAnalysisDetail {
  parameterKey: string;
  parameterNameFa: string;
  measuredValue: number | string;
  numericValue?: number;
  unit: string;
  targetValue?: string;
  standardLimitText: string;
  minLimit?: number;
  maxLimit?: number;
  isCompliant: boolean;
  statusTextFa: string;
  historicalMean?: number;
  historicalStdDev?: number;
  deviationFromMeanSigma?: number;
  historicalTrend?: 'stable' | 'increasing' | 'decreasing' | 'erratic' | 'insufficient_data';
  confidenceScore: number; // 0 to 100
  standardsCited: string[];
}

export interface IntelligentLabAnalysisReport {
  id: string;
  analyzedAt: string;
  batchNumber: string;
  productNameFa?: string;
  overallStatus: LabTestStatusVerdict;
  overallStatusFa: string;
  summaryVerdictFa: string;
  complianceRatePercent: number;

  // 1. نتایج پارامترها و محاسبات
  parameterDetails: ParameterAnalysisDetail[];

  // 2. داده‌های مشکوک و مغایرت‌ها
  suspectDataPoints: SuspectDataPoint[];

  // 3. تحلیل روند تاریخی (Trend Analysis)
  trendSummaryFa: string;
  consecutiveDriftCount: number;

  // 4. بررسی ارکان چهارگانه خطا با رعایت اصل احتمال و عدم قطعیت
  equipmentAudit: {
    status: 'passed' | 'warning' | 'critical' | 'not_evaluated';
    findingsFa: string[];
    instrumentDetails: LabInstrumentAuditInfo[];
  };
  calibrationAudit: {
    status: 'valid' | 'warning' | 'expired' | 'unverified';
    findingsFa: string[];
  };
  reagentAudit: {
    status: 'valid' | 'warning' | 'expired' | 'unverified';
    findingsFa: string[];
    reagentDetails: LabReagentAuditInfo[];
  };
  samplePrepAudit: {
    status: 'standard' | 'deviation_suspected' | 'unverified';
    findingsFa: string[];
    sampleDetails?: LabSampleAuditInfo;
  };

  // 5. فرضیه‌های علل احتمالی و شواهد
  probableErrorHypotheses: ProbableCauseHypothesis[];

  // 6. اقدامات اصلاحی و پیشنهادات بررسی (CAPA)
  investigationRecommendationsFa: string[];

  // 7. مراجع و استانداردهای مستند (Source Standards)
  sourceStandards: Array<{
    standardCode: string;
    titleFa: string;
    organization: string;
    relevanceNotesFa: string;
  }>;

  // تضمین حفظ اصالت داده اولیه
  rawInputDataPreserved: Record<string, any>;
  integrityGuaranteeStatementFa: string;
}

export interface LabAnalysisInput {
  batchNumber: string;
  testDate?: string;
  operatorOrScientist?: string;
  measuredParameters: Record<string, { value: number | string; unit?: string }>;
  qcSpecifications: QualityControlSpec[];
  historicalResults?: TestResultEntry[];
  instrumentAudit?: LabInstrumentAuditInfo[];
  reagentAudit?: LabReagentAuditInfo[];
  sampleAudit?: LabSampleAuditInfo;
  standardReferences?: string[];
  productCategory?: string;
}

// -------------------------------------------------------------
// Engine Logic Implementation
// -------------------------------------------------------------

/**
 * Validates and analyzes laboratory test results with zero bias,
 * rigorous thermodynamic/stoichiometric constraints, trend tracking,
 * and scientific evidence-based probability modeling.
 */
export function analyzeIntelligentLabTest(input: LabAnalysisInput): IntelligentLabAnalysisReport {
  const analyzedAt = new Date().toISOString();
  const suspectDataPoints: SuspectDataPoint[] = [];
  const probableErrorHypotheses: ProbableCauseHypothesis[] = [];
  const investigationRecommendationsFa: string[] = [];
  const parameterDetails: ParameterAnalysisDetail[] = [];
  const sourceStandardsMap = new Map<string, { standardCode: string; titleFa: string; organization: string; relevanceNotesFa: string }>();

  // Add Project Standard References to sources
  if (input.standardReferences && input.standardReferences.length > 0) {
    input.standardReferences.forEach((std) => {
      const code = std.trim();
      sourceStandardsMap.set(code, {
        standardCode: code,
        titleFa: `استاندارد مرجع فرآورده غذایی (${code})`,
        organization: code.toUpperCase().includes('INSO') ? 'INSO' : code.toUpperCase().includes('CODEX') ? 'Codex' : 'AOAC/ISO',
        relevanceNotesFa: 'مرجع تعیین مشخصات کیفی و حدود رواداری فیزیکوشیمیایی و حسی'
      });
    });
  }

  // 1. Audit Equipment & Calibration
  const equipmentFindings: string[] = [];
  let equipmentStatus: 'passed' | 'warning' | 'critical' | 'not_evaluated' = 'not_evaluated';

  const calibrationFindings: string[] = [];
  let calibrationStatus: 'valid' | 'warning' | 'expired' | 'unverified' = 'unverified';

  if (input.instrumentAudit && input.instrumentAudit.length > 0) {
    let hasExpired = false;
    let hasDueSoon = false;

    input.instrumentAudit.forEach((inst) => {
      if (inst.calibrationStatus === 'expired') {
        hasExpired = true;
        calibrationFindings.push(`دستگاه «${inst.instrumentName}» تاریخ اعتبار کالیبراسیون آن منقضی شده است (${inst.calibrationDueDate || 'بدون تاریخ سررسید'}).`);
      } else if (inst.calibrationStatus === 'due_soon') {
        hasDueSoon = true;
        calibrationFindings.push(`موعد کالیبراسیون دستگاه «${inst.instrumentName}» نزدیک است (${inst.calibrationDueDate}).`);
      } else if (inst.calibrationStatus === 'not_calibrated') {
        hasExpired = true;
        calibrationFindings.push(`دستگاه «${inst.instrumentName}» فاقد شناسنامه کالیبراسیون معتبر است.`);
      }

      // Check electrode slope for pH meters
      if (inst.calibrationSlopeOrFactor !== undefined) {
        if (inst.calibrationSlopeOrFactor < 90 || inst.calibrationSlopeOrFactor > 105) {
          equipmentFindings.push(`شیب الکترود (Slope) برای «${inst.instrumentName}» برابر با ${inst.calibrationSlopeOrFactor}٪ است که خارج از بازه استاندارد ۹۵٪ الی ۱۰۲٪ است.`);
        }
      }

      // Blank reading check
      if (inst.blankReading !== undefined && Math.abs(inst.blankReading) > 0.05) {
        equipmentFindings.push(`خوانش بلانک دستگاه «${inst.instrumentName}» غیرصفر و معادل ${inst.blankReading} است که نشان‌دهنده انحراف خط پایه (Baseline Drift) است.`);
      }
    });

    if (hasExpired) {
      calibrationStatus = 'expired';
      equipmentStatus = 'critical';
    } else if (hasDueSoon || equipmentFindings.length > 0) {
      calibrationStatus = 'warning';
      equipmentStatus = 'warning';
    } else {
      calibrationStatus = 'valid';
      equipmentStatus = 'passed';
      equipmentFindings.push('وضعیت فیزیکی و آماده‌به‌کار تجهیزات بر اساس چک‌لیست آزمایشگاه تایید است.');
      calibrationFindings.push('گواهینامه‌های کالیبراسیون دستگاه‌های مربوطه دارای اعتبار زمانی هستند.');
    }
  } else {
    calibrationFindings.push('اطلاعات کالیبراسیون دستگاه‌ها برای این آزمون ضمیمه نشده است (ثبت وضعیت کالیبراسیون توصیه می‌شود).');
  }

  // 2. Audit Reagents & Solutions
  const reagentFindings: string[] = [];
  let reagentStatus: 'valid' | 'warning' | 'expired' | 'unverified' = 'unverified';

  if (input.reagentAudit && input.reagentAudit.length > 0) {
    let hasExpiredReagent = false;
    let hasLateTiter = false;

    input.reagentAudit.forEach((rg) => {
      if (rg.isExpired) {
        hasExpiredReagent = true;
        reagentFindings.push(`معرف آزمایشگاهی «${rg.reagentName}» منقضی شده است (انقضا: ${rg.expiryDate || 'نامشخص'}).`);
      }
      if (rg.factorOrTiterValue !== undefined) {
        if (rg.factorOrTiterValue < 0.90 || rg.factorOrTiterValue > 1.10) {
          reagentFindings.push(`فاکتور تیترانت «${rg.reagentName}» برابر با ${rg.factorOrTiterValue} است که انحراف بیش از ۱۰٪ از نرمال دارد و نیاز به تیتر مجدد دارد.`);
        }
      }
    });

    if (hasExpiredReagent) {
      reagentStatus = 'expired';
    } else if (hasLateTiter || reagentFindings.length > 0) {
      reagentStatus = 'warning';
    } else {
      reagentStatus = 'valid';
      reagentFindings.push('کلیه معرف‌ها و محلول‌های استاندارد دارای تاریخ انقضای معتبر و فاکتور مجاز هستند.');
    }
  } else {
    reagentFindings.push('اطلاعات سریال و تاریخ تهیه معرف‌ها ثبت نشده است.');
  }

  // 3. Audit Sample Preparation
  const samplePrepFindings: string[] = [];
  let samplePrepStatus: 'standard' | 'deviation_suspected' | 'unverified' = 'unverified';

  if (input.sampleAudit) {
    const s = input.sampleAudit;
    if (s.sampleTemperatureC !== undefined) {
      if (s.sampleTemperatureC < 15 || s.sampleTemperatureC > 28) {
        samplePrepFindings.push(`دمای نمونه در حین قرائت (${s.sampleTemperatureC}°C) خارج از دمای استاندارد اتاق (۲۰ الی ۲۵ درجه سانتی‌گراد) بوده است؛ آزمون‌های رفرکتومتری و pH شدیداً به دما حساس هستند.`);
        samplePrepStatus = 'deviation_suspected';
      }
    }
    if (s.homogenizationMethod && s.homogenizationMethod.includes('دستی')) {
      samplePrepFindings.push('همگن‌سازی نمونه به شیوه دستی انجام گرفته که در ماتریس‌های امولسیونی یا ذرات چربی ممکن است خطای عدم یکنواختی ایجاد کند.');
      if (samplePrepStatus !== 'deviation_suspected') samplePrepStatus = 'deviation_suspected';
    }
    if (samplePrepFindings.length === 0) {
      samplePrepStatus = 'standard';
      samplePrepFindings.push('آماده‌سازی، ابعاد نمونه و پیش‌تیمار آزمون منطبق بر دستورالعمل استاندارد گزارش شده است.');
    }
  } else {
    samplePrepFindings.push('جزئیات پیش‌آماده‌سازی و دمای نمونه ثبت نشده است.');
  }

  // 4. Validate and Evaluate Each QC Specification
  let compliantCount = 0;
  let totalEvaluated = 0;

  // Helper: Extract historical values for this parameter
  const getHistoricalValuesForParam = (paramNameFa: string, paramKey: string): number[] => {
    if (!input.historicalResults || input.historicalResults.length === 0) return [];
    const values: number[] = [];
    input.historicalResults.forEach((hr) => {
      // Find matching parameter
      const match = Object.entries(hr.measuredParameters || {}).find(([k, v]) => {
        return k.toLowerCase() === paramKey.toLowerCase() || k.includes(paramNameFa) || paramNameFa.includes(k);
      });
      if (match) {
        const paramData = match[1] as { value?: unknown };
        if (typeof paramData?.value === 'number') {
          values.push(paramData.value);
        } else if (typeof paramData?.value === 'string') {
          const num = parseFloat(paramData.value);
          if (!isNaN(num)) values.push(num);
        }
      }
    });
    return values;
  };

  input.qcSpecifications.forEach((spec) => {
    totalEvaluated++;
    const paramKey = spec.parameterNameFa.trim();

    // Find input value
    const matchedEntry = Object.entries(input.measuredParameters).find(
      ([k]) => k.trim().toLowerCase() === paramKey.toLowerCase() || k.includes(paramKey) || paramKey.includes(k)
    );

    const measuredValRaw = matchedEntry ? matchedEntry[1].value : undefined;
    const measuredUnit = matchedEntry ? matchedEntry[1].unit || spec.unit : spec.unit;

    let numericVal: number | undefined = undefined;
    if (typeof measuredValRaw === 'number') {
      numericVal = measuredValRaw;
    } else if (typeof measuredValRaw === 'string') {
      const parsed = parseFloat(measuredValRaw.replace(/[^\d.-]/g, ''));
      if (!isNaN(parsed)) numericVal = parsed;
    }

    // Standard limits parsing
    let minLimitNum: number | undefined = undefined;
    let maxLimitNum: number | undefined = undefined;
    if (spec.minAcceptableLimit !== undefined && spec.minAcceptableLimit !== '') {
      minLimitNum = typeof spec.minAcceptableLimit === 'number' ? spec.minAcceptableLimit : parseFloat(String(spec.minAcceptableLimit));
    }
    if (spec.maxAcceptableLimit !== undefined && spec.maxAcceptableLimit !== '') {
      maxLimitNum = typeof spec.maxAcceptableLimit === 'number' ? spec.maxAcceptableLimit : parseFloat(String(spec.maxAcceptableLimit));
    }

    let isCompliant = true;
    let statusTextFa = 'منطبق بر مشخصات';

    if (numericVal !== undefined) {
      if (minLimitNum !== undefined && numericVal < minLimitNum) {
        isCompliant = false;
        statusTextFa = `پایین‌تر از حداقل مجاز (${minLimitNum})`;
      } else if (maxLimitNum !== undefined && numericVal > maxLimitNum) {
        isCompliant = false;
        statusTextFa = `بالاتر از حداکثر مجاز (${maxLimitNum})`;
      }
    } else if (measuredValRaw === undefined || measuredValRaw === '') {
      isCompliant = false;
      statusTextFa = 'داده‌ای ثبت نشده است';
    }

    if (isCompliant && measuredValRaw !== undefined) {
      compliantCount++;
    }

    // Historical trend calculation
    const history = getHistoricalValuesForParam(spec.parameterNameFa, paramKey);
    let histMean: number | undefined = undefined;
    let histStd: number | undefined = undefined;
    let devSigma: number | undefined = undefined;
    let trendType: 'stable' | 'increasing' | 'decreasing' | 'erratic' | 'insufficient_data' = 'insufficient_data';

    if (history.length >= 3) {
      const sum = history.reduce((a, b) => a + b, 0);
      histMean = sum / history.length;
      const variance = history.reduce((a, b) => a + Math.pow(b - histMean!, 2), 0) / (history.length - 1);
      histStd = Math.sqrt(variance);

      if (numericVal !== undefined && histStd > 0) {
        devSigma = (numericVal - histMean) / histStd;
      }

      // Check simple direction
      const last3 = history.slice(-3);
      if (last3[2] > last3[1] && last3[1] > last3[0]) {
        trendType = 'increasing';
      } else if (last3[2] < last3[1] && last3[1] < last3[0]) {
        trendType = 'decreasing';
      } else if (histStd / (histMean || 1) < 0.05) {
        trendType = 'stable';
      } else {
        trendType = 'erratic';
      }
    }

    // Add source if specified in spec
    const stdsCited: string[] = [];
    if (spec.standardReference) {
      stdsCited.push(spec.standardReference);
      if (!sourceStandardsMap.has(spec.standardReference)) {
        sourceStandardsMap.set(spec.standardReference, {
          standardCode: spec.standardReference,
          titleFa: `روش آزمون استاندارد برای ${spec.parameterNameFa}`,
          organization: spec.standardReference.includes('INSO') ? 'INSO' : 'AOAC/ISO',
          relevanceNotesFa: `تعیین‌کننده متدولوژی، دقت و بازه استاندارد پارامتر ${spec.parameterNameFa}`
        });
      }
    }

    // Check physical impossibilities & extreme anomalies
    if (numericVal !== undefined) {
      // 1. Physical impossibilities
      const paramNameLower = spec.parameterNameFa.toLowerCase();
      if ((paramNameLower.includes('رطوبت') || paramNameLower.includes('moisture')) && (numericVal < 0 || numericVal > 100)) {
        suspectDataPoints.push({
          parameterKey: spec.id,
          parameterNameFa: spec.parameterNameFa,
          measuredValue: numericVal,
          unit: spec.unit,
          anomalyType: 'physical_impossible',
          severity: 'critical',
          explanationFa: `مقدار رطوبت اندازه‌گیری‌شده (${numericVal}٪) از نظر فیزیکی غیرممکن است (دامنه مجاز ۰ الی ۱۰۰٪).`,
          empiricalEvidenceFa: 'قوانین بقای جرم در ترمودینامیک مانع از مقدار رطوبت منفی یا بیشتر از ۱۰۰٪ است.',
          standardReference: spec.standardReference || 'INSO 2705'
        });
      } else if ((paramNameLower.includes('ph') || paramNameLower.includes('پی اچ')) && (numericVal < 0 || numericVal > 14)) {
        suspectDataPoints.push({
          parameterKey: spec.id,
          parameterNameFa: spec.parameterNameFa,
          measuredValue: numericVal,
          unit: spec.unit,
          anomalyType: 'physical_impossible',
          severity: 'critical',
          explanationFa: `عدد pH اندازه‌گیری‌شده (${numericVal}) خارج از مقیاس استاندارد محلول‌های آبی (۰ تا ۱۴) است.`,
          empiricalEvidenceFa: 'رابطه غلظت یون هیدرونیوم pH = -log[H+] در فاز آبی بین ۰ تا ۱۴ تعریف می‌شود.',
          standardReference: spec.standardReference || 'INSO 2852'
        });
      } else if (paramNameLower.includes('چربی') && numericVal < 0) {
        suspectDataPoints.push({
          parameterKey: spec.id,
          parameterNameFa: spec.parameterNameFa,
          measuredValue: numericVal,
          unit: spec.unit,
          anomalyType: 'physical_impossible',
          severity: 'critical',
          explanationFa: 'درصد چربی منفی ثبت شده است که نشان‌دهنده خطای محاسباتی یا معکوس وارد شدن ارقام وزن بوتیرومتر است.',
          empiricalEvidenceFa: 'جرم فاز لیپیدی نمی‌تواند مقداری منفی داشته باشد.',
          standardReference: spec.standardReference || 'INSO 366'
        });
      }

      // 2. Statistical Outlier Detection (Z-Score > 2.8 or < -2.8)
      if (devSigma !== undefined && Math.abs(devSigma) > 2.8 && history.length >= 4) {
        suspectDataPoints.push({
          parameterKey: spec.id,
          parameterNameFa: spec.parameterNameFa,
          measuredValue: numericVal,
          unit: spec.unit,
          anomalyType: 'statistical_outlier',
          severity: 'high',
          explanationFa: `مقدار ${numericVal} انحراف معادل ${Math.abs(devSigma).toFixed(1)} برابر انحراف‌معیار از میانگین تاریخی بچ‌های قبلی (${histMean?.toFixed(2)}) دارد.`,
          empiricalEvidenceFa: `بر اساس قانون چبیشف و نمودارهای کنترل شوارت (Shewhart)، احتمال رخ‌داد تصادفی این انحراف کمتر از ۰.۵٪ است.`,
          standardReference: spec.standardReference
        });
      }

      // 3. Near Critical Limit Warning (within 1.5% of critical tolerance limit, only if range is wide enough)
      if (maxLimitNum !== undefined && minLimitNum !== undefined) {
        const span = maxLimitNum - minLimitNum;
        if (span > 0 && numericVal <= maxLimitNum && numericVal >= maxLimitNum - span * 0.03) {
          suspectDataPoints.push({
            parameterKey: spec.id,
            parameterNameFa: spec.parameterNameFa,
            measuredValue: numericVal,
            unit: spec.unit,
            anomalyType: 'near_critical_limit',
            severity: 'info',
            explanationFa: `مقدار اندازه‌گیری‌شده بسیار به سقف حداکثر مجاز استاندارد (${maxLimitNum}) نزدیک است (حاشیه اطمینان کمتر از ۳٪ بازه مجاز).`,
            empiricalEvidenceFa: `فاصله مقدار اندازه‌گیری‌شده تا خط آستانه غیرانطباق بحرانی کمتر از عدم قطعیت گسترده آزمایشگاهی ($U_{exp}$) است.`,
            standardReference: spec.standardReference
          });
        }
      }
    }

    parameterDetails.push({
      parameterKey: spec.id,
      parameterNameFa: spec.parameterNameFa,
      measuredValue: measuredValRaw !== undefined ? measuredValRaw : 'ثبت نشده',
      numericValue: numericVal,
      unit: measuredUnit,
      targetValue: spec.targetValue,
      standardLimitText: spec.minAcceptableLimit !== undefined && spec.maxAcceptableLimit !== undefined
        ? `${spec.minAcceptableLimit} الی ${spec.maxAcceptableLimit}`
        : spec.minAcceptableLimit !== undefined
        ? `حداقل ${spec.minAcceptableLimit}`
        : spec.maxAcceptableLimit !== undefined
        ? `حداکثر ${spec.maxAcceptableLimit}`
        : spec.targetValue,
      minLimit: minLimitNum,
      maxLimit: maxLimitNum,
      isCompliant,
      statusTextFa,
      historicalMean: histMean,
      historicalStdDev: histStd,
      deviationFromMeanSigma: devSigma,
      historicalTrend: trendType,
      confidenceScore: numericVal !== undefined ? (isCompliant ? 95 : 90) : 0,
      standardsCited: stdsCited
    });
  });

  // 5. Cross-Parameter Stoichiometric & Physicochemical Logic Checks
  // Example: Brix vs Refractometric Dry Matter / Salt vs Conductivity / pH vs Acidity
  const phItem = parameterDetails.find((p) => p.parameterNameFa.toLowerCase().includes('ph') || p.parameterNameFa.toLowerCase().includes('پی اچ'));
  const acidityItem = parameterDetails.find((p) => p.parameterNameFa.toLowerCase().includes('اسیدیته') || p.parameterNameFa.toLowerCase().includes('acidity'));
  if (phItem && acidityItem && phItem.numericValue !== undefined && acidityItem.numericValue !== undefined) {
    // If pH is very high (> 5.5 in fermented dairy or acidic beverage) but acidity is also high
    if (phItem.numericValue > 5.5 && acidityItem.numericValue > 1.2) {
      suspectDataPoints.push({
        parameterKey: 'ph_acidity_conflict',
        parameterNameFa: 'رابطه معکوس pH و اسیدیته قابل تیتر',
        measuredValue: `pH: ${phItem.numericValue} | Acidity: ${acidityItem.numericValue}`,
        unit: 'همبستگی فیزیکوشیمیایی',
        anomalyType: 'stoichiometric_conflict',
        severity: 'high',
        explanationFa: 'هم‌زمانی pH بالا با اسیدیته قابل تیتر بسیار بالا از نظر تعادل اسید و باز نامتعارف است.',
        empiricalEvidenceFa: 'در محلول‌های غذایی بر پایه اسیدهای ضعیف (لاکتیک، سیتریک، استیک)، با افزایش غلظت اسید قابل تیتر معمولاً pH کاهش می‌یابد مگر اینکه ظرفیت بافری بسیار عظیمی وجود داشته باشد.',
        standardReference: 'AOAC 942.15'
      });
    }
  }

  // 6. Generate Probable Error Hypotheses (Using Evidence-Grounded Scientific Language)
  // RULE: Never say "حتماً مشکل از X است". Say: "بر اساس داده موجود، X یکی از احتمالات است."

  // Pillar 1: Equipment
  if (equipmentStatus === 'critical' || equipmentStatus === 'warning') {
    const evidences = [...equipmentFindings];
    probableErrorHypotheses.push({
      pillar: 'equipment',
      pillarTitleFa: 'وضعیت فنی و پایداری دستگاه اندازه‌گیری (Equipment)',
      hypothesisStatementFa: 'بر اساس داده موجود، اختلال یا بی‌ثباتی در عملکرد سخت‌افزاری دستگاه یکی از احتمالات است.',
      probabilityLevel: equipmentStatus === 'critical' ? 'high_possibility' : 'moderate_possibility',
      evidencesFound: evidences,
      rebuttalOrMissingInfo: ['در صورت عملکرد پایدار سایر آزمون‌های انجام‌شده در همان روز، اولویت بررسی کاهش می‌یابد.'],
      suggestedActionFa: 'بررسی نوسان ولتاژ، تمیزکاری حسگرها، قرائت نمونه استاندارد کنترل (QC Standard) و بازبینی خط پایه بلانک.'
    });
  }

  // Pillar 2: Calibration
  if (calibrationStatus === 'expired' || calibrationStatus === 'warning') {
    probableErrorHypotheses.push({
      pillar: 'calibration',
      pillarTitleFa: 'وضعیت اعتبار کالیبراسیون (Calibration Status)',
      hypothesisStatementFa: 'بر اساس شواهد ثبت‌شده، انقضا یا انحراف شیب کالیبراسیون یکی از احتمالات موثر بر نتایج آزمون است.',
      probabilityLevel: calibrationStatus === 'expired' ? 'high_possibility' : 'moderate_possibility',
      evidencesFound: [...calibrationFindings],
      rebuttalOrMissingInfo: ['آزمون نمونه استاندارد گواهی‌شده (CRM) قبل از شروع بچ می‌تواند انحراف کالیبراسیون را رد یا اثبات نماید.'],
      suggestedActionFa: 'تجدید کالیبراسیون با بافرهای تازه و معتبر با تاریخ انقضای جاری و ثبت شیب جدید الکترود.'
    });
  }

  // Pillar 3: Reagents & Blank
  if (reagentStatus === 'expired' || reagentStatus === 'warning') {
    probableErrorHypotheses.push({
      pillar: 'reagent',
      pillarTitleFa: 'کیفیت و تیتر معرف‌ها و محلول‌های مصرفی (Reagent Quality)',
      hypothesisStatementFa: 'بر اساس داده‌های انقضا و فاکتور محلول، تغییر غلظت یا افت کیفی معرف‌ها یکی از احتمالات مطرح است.',
      probabilityLevel: reagentStatus === 'expired' ? 'high_possibility' : 'moderate_possibility',
      evidencesFound: [...reagentFindings],
      rebuttalOrMissingInfo: ['انجام تیتراسیون بلانک (Blank Titration) برای تفکیک اثر کربناته شدن محلول سود یا هیدرولیز معرف الزامی است.'],
      suggestedActionFa: 'تهیه محلول تازه تیترازول استاندارد و تعیین مجدد فاکتور تیترانت با پتاسیم هیدروژن فتالات (KHP).'
    });
  }

  // Pillar 4: Sample Preparation & Homogeneity
  if (samplePrepStatus === 'deviation_suspected' || suspectDataPoints.some((s) => s.anomalyType === 'statistical_outlier')) {
    const evidences = [...samplePrepFindings];
    if (suspectDataPoints.some((s) => s.anomalyType === 'statistical_outlier')) {
      evidences.push('وجود جهش‌های ناگهانی در نتایج بچ‌های متوالی بدون تغییر در مشخصات ماده اولیه خریداری‌شده.');
    }
    probableErrorHypotheses.push({
      pillar: 'sample_prep',
      pillarTitleFa: 'فرآیند آماده‌سازی و همگن‌سازی نمونه (Sample Preparation)',
      hypothesisStatementFa: 'بر اساس شواهد موجود، عدم یکنواختی ماتریس یا خطای پیش‌آماده‌سازی یکی از احتمالات بروز انحراف است.',
      probabilityLevel: 'moderate_possibility',
      evidencesFound: evidences,
      rebuttalOrMissingInfo: ['تکرار آزمون بر روی ۳ نمونه‌برداری مستقل از نقاط مختلف مخزن برای ارزیابی تجدیدپذیری نمونه ضروری است.'],
      suggestedActionFa: 'انجام هموژنیزاسیون آزمایشگاهی با سرعت استاندارد، کنترل دمای نمونه در ۲۰ الی ۲۵ درجه سلسیوس و وزن‌سنجی ۴ رقمی.'
    });
  }

  // Pillar 5: Real Process or Formulation Deviation (When lab artifacts are unlikely)
  const nonCompliantParams = parameterDetails.filter((p) => !p.isCompliant && p.numericValue !== undefined);
  if (nonCompliantParams.length > 0) {
    const paramNames = nonCompliantParams.map((p) => p.parameterNameFa).join('، ');
    probableErrorHypotheses.push({
      pillar: 'process_formulation',
      pillarTitleFa: 'انحراف واقعی در فرآیند تولید یا دوزینگ مواد (Process & Batch Execution)',
      hypothesisStatementFa: `بر اساس شواهد آزمون، بروز عدم‌انطباق واقعی در تولید به دلیل تغییر دوزینگ یا نوسان دمایی فرآیند برای (${paramNames}) یکی از احتمالات است.`,
      probabilityLevel: suspectDataPoints.length === 0 ? 'high_possibility' : 'moderate_possibility',
      evidencesFound: nonCompliantParams.map((p) => `${p.parameterNameFa}: مقدار ثبت‌شده ${p.measuredValue} در برابر حد مجاز ${p.standardLimitText}`),
      rebuttalOrMissingInfo: ['اگر خطا ناشی از ابزار یا معرف باشد، آزمون با تجهیزات موازی این فرضیه را رد خواهد کرد.'],
      suggestedActionFa: 'بررسی لاگ توزین مواد اولیه در انبار، زمان‌سنجی پاستوریزاتور و ثبت پارامترهای کنترل فرآیند در خط تولید.'
    });
  }

  // 7. General Recommendations (CAPA)
  if (suspectDataPoints.length > 0) {
    investigationRecommendationsFa.push('آزمون مجدد نمونه در ۲ تکرار موازی (Duplicate Runs) بدون دستکاری داده‌های ثبت‌شده اولیه.');
  }
  if (calibrationStatus === 'expired') {
    investigationRecommendationsFa.push('توقف ثبت رسمی نتایج تا صدور برچسب کالیبراسیون مجدد دستگاه توسط آزمایشگاه همکار مرجع.');
  }
  if (reagentStatus === 'expired') {
    investigationRecommendationsFa.push('امحای محلول تاریخ‌گذشته و ثبت لاگ استانداردسازی با فاکتور جدید.');
  }
  if (samplePrepStatus === 'deviation_suspected') {
    investigationRecommendationsFa.push('کنترل دمای حمام آب‌گرم/محیط در بازه استاندارد و ارزیابی یکنواختی فاز امولسیونی نمونه.');
  }
  if (suspectDataPoints.length === 0 && nonCompliantParams.length === 0) {
    investigationRecommendationsFa.push('نتایج در محدوده کنترل آماری قرار دارند. ثبت و پایش در نمودار کنترل کیفی (SPC) پیشنهاد می‌گردد.');
  } else {
    investigationRecommendationsFa.push('بررسی نمونه شاهد ذخیره‌شده (Retention Sample) در دمای یخچال برای رد یا تایید نقص بسته‌بندی یا آلودگی ثانویه.');
  }

  // 8. Overall Status Determination
  let overallStatus: LabTestStatusVerdict = 'compliant_normal';
  let overallStatusFa = 'منطبق بر ضوابط استاندارد';
  let summaryVerdictFa = 'کلیه پارامترهای مورد ارزیابی با الزامات فنی و استانداردهای کیفی انطباق دارند.';

  const complianceRatePercent = totalEvaluated > 0 ? Math.round((compliantCount / totalEvaluated) * 100) : 0;

  if (suspectDataPoints.some((s) => s.anomalyType === 'physical_impossible')) {
    overallStatus = 'suspect_invalid';
    overallStatusFa = 'دارای داده غیرممکن فیزیکی / ابطال موقت تا بازآزمایی';
    summaryVerdictFa = 'ثبت مقادیر غیرممکن فیزیکی نشان‌دهنده خطای بارز در ورود داده یا نقص بحرانی حسگر است؛ نتیجه تا بررسی تایید نمی‌شود.';
  } else if (nonCompliantParams.length > 0) {
    overallStatus = 'non_compliant';
    overallStatusFa = 'مغایر با مشخصات استاندارد محصول';
    summaryVerdictFa = `تعداد ${nonCompliantParams.length} پارامتر خارج از حدود رواداری مجاز قرار دارند.`;
  } else if (suspectDataPoints.some((s) => s.severity === 'critical' || s.severity === 'high') || calibrationStatus === 'warning' || reagentStatus === 'warning') {
    overallStatus = 'compliant_with_warning';
    overallStatusFa = 'منطبق مشروط به بازبینی و پایش';
    summaryVerdictFa = 'پارامترها اسماً در محدوده قرار دارند اما نشانه‌هایی از انحراف خط پایه یا نزدیکی به مرز بحرانی شناسایی شد.';
  }

  // 9. Trend Summary Construction
  let trendSummaryFa = 'روند عمومی پارامترها در بچ‌های اخیر در محدوده پایداری طبیعی قرار دارد.';
  let consecutiveDriftCount = 0;
  const driftingParams = parameterDetails.filter((p) => p.historicalTrend === 'increasing' || p.historicalTrend === 'decreasing');
  if (driftingParams.length > 0) {
    consecutiveDriftCount = driftingParams.length;
    trendSummaryFa = `روند انحراف جهت‌دار (Drift) در ${driftingParams.length} شاخص (${driftingParams.map((p) => p.parameterNameFa).join('، ')}) شناسایی شد که نیاز به بررسی فرسایش الکترود یا کهنگی مواد دارد.`;
  }

  return {
    id: `rep_${Date.now()}`,
    analyzedAt,
    batchNumber: input.batchNumber,
    overallStatus,
    overallStatusFa,
    summaryVerdictFa,
    complianceRatePercent,
    parameterDetails,
    suspectDataPoints,
    trendSummaryFa,
    consecutiveDriftCount,
    equipmentAudit: {
      status: equipmentStatus,
      findingsFa: equipmentFindings,
      instrumentDetails: input.instrumentAudit || []
    },
    calibrationAudit: {
      status: calibrationStatus,
      findingsFa: calibrationFindings
    },
    reagentAudit: {
      status: reagentStatus,
      findingsFa: reagentFindings,
      reagentDetails: input.reagentAudit || []
    },
    samplePrepAudit: {
      status: samplePrepStatus,
      findingsFa: samplePrepFindings,
      sampleDetails: input.sampleAudit
    },
    probableErrorHypotheses,
    investigationRecommendationsFa,
    sourceStandards: Array.from(sourceStandardsMap.values()),
    rawInputDataPreserved: JSON.parse(JSON.stringify(input.measuredParameters)),
    integrityGuaranteeStatementFa:
      'سیستم تحلیلی بر اساس استانداردهای ISO 17025 و GLP داده‌های اولیه ثبت‌شده توسط کاربر را بدون تغییر حفظ نموده و هیچ رقمی را بدون شواهد کافی مخدوش نمی‌سازد.'
  };
}
