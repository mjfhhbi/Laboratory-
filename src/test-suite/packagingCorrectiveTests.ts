/**
 * Food Science AI - Independent Packaging Corrective Verification Suite
 * Phase 6 - Part 52 Post-Audit Corrective Verification (28 Tests)
 *
 * Explicit Test Taxonomy (no test duplicating engine code counts as Scientific Validation):
 * - 'Numerical / Analytical Cross-Check (Software-Tested)'
 * - 'Boundary / Integrity / Diagnostic Check (Software-Tested)'
 * - 'Regulatory Rule Logic Check (EU/ISO Reference)'
 */

import {
  calculatePackagingShelfLife,
  calculateWvtr,
  calculateOtr,
  calculateLaminateBarrier,
  calculateMigrationAssessment,
  calculateFickianDiffusion
} from '../lib/packaging/packagingEngine';

export type TestTaxonomyClass =
  | 'Numerical / Analytical Cross-Check (Software-Tested)'
  | 'Boundary / Integrity / Diagnostic Check (Software-Tested)'
  | 'Regulatory Rule Logic Check (EU/ISO Reference)';

export interface CorrectiveTestResult {
  id: number;
  title: string;
  category: string;
  testClassification: TestTaxonomyClass;
  units: string;
  inputs: Record<string, any>;
  referenceValue: any;
  engineValue: any;
  absoluteDiff: number | null;
  relativeDiffPercent: number | null;
  tolerance: string;
  passed: boolean;
  notes: string;
}

export async function runPackagingCorrectiveSuite(): Promise<{
  allPassed: boolean;
  results: CorrectiveTestResult[];
  passedCount: number;
  totalCount: number;
}> {
  const results: CorrectiveTestResult[] = [];

  // --------------------------------------------------------------------------
  // TEST 1: Small Oxygen Capacity (< 1.0 cm³) - No Math.max(1.0, ...) clamp
  // --------------------------------------------------------------------------
  {
    const res = calculatePackagingShelfLife({
      productNameFa: 'پودر حساس میکرو',
      productDryMassKg: 0.05,
      initialMoisturePercentWetBasis: 2.0,
      criticalMoisturePercentWetBasis: 6.0,
      isothermSlopeGWaterPerGProductPerAw: 0.10,
      packagingAreaM2: 0.02,
      effectiveWvtrAtTestGPerM2Day: 0.1,
      effectiveOtrAtTestCm3PerM2Day: 5.0,
      storageTempC: 25,
      storageRhPercent: 50,
      headspaceVolumeCm3: 20,
      initialHeadspaceO2Percent: 0.5,
      maxTolerableO2ConsumptionCm3PerKg: 4.0
    });

    // Independent arithmetic: (0.05*4.0 - 20*0.005) / (0.02*5.0) = (0.20 - 0.10) / 0.10 = 1.0 day
    const expectedDays = 1.0;
    const actualDays = res.shelfLifeOxygenLimitedDays;
    const absDiff = Math.abs(actualDays - expectedDays);
    const relDiff = (absDiff / expectedDays) * 100;
    const passed = absDiff < 0.01 && res.oxygenStatus === 'normal';

    results.push({
      id: 1,
      title: 'محاسبه ظرفیت اکسیژن کوچک کمتر از ۱ سانتیمتر مکعب بدون کلمپ مصنوعی',
      category: 'Shelf-Life / O2 Capacity',
      testClassification: 'Numerical / Analytical Cross-Check (Software-Tested)',
      units: 'days',
      inputs: { dryMassKg: 0.05, maxTolerableCm3PerKg: 4.0, initialHeadspaceO2Percent: 0.5, areaM2: 0.02, otr: 5.0 },
      referenceValue: 1.0,
      engineValue: actualDays,
      absoluteDiff: absDiff,
      relativeDiffPercent: relDiff,
      tolerance: '±0.01 روز',
      passed,
      notes: 'ظرفیت واقعی ۰.۱۰ cm³ است و بدون کلمپ مصنوعی دقیقاً ۱.۰ روز خروجی داده شد.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 2: Zero Oxygen Capacity (= 0.0 cm³)
  // --------------------------------------------------------------------------
  {
    const res = calculatePackagingShelfLife({
      productNameFa: 'محصول در آستانه فساد اکسیداتیو',
      productDryMassKg: 0.1,
      initialMoisturePercentWetBasis: 2.0,
      criticalMoisturePercentWetBasis: 6.0,
      isothermSlopeGWaterPerGProductPerAw: 0.10,
      packagingAreaM2: 0.04,
      effectiveWvtrAtTestGPerM2Day: 1.0,
      effectiveOtrAtTestCm3PerM2Day: 10.0,
      storageTempC: 25,
      storageRhPercent: 50,
      headspaceVolumeCm3: 50,
      initialHeadspaceO2Percent: 2.0,
      maxTolerableO2ConsumptionCm3PerKg: 10.0
    });

    const passed = res.shelfLifeOxygenLimitedDays === 0 && res.oxygenStatus === 'immediate_depletion';
    results.push({
      id: 2,
      title: 'ظرفیت اکسیژن دقیقاً برابر با صفر (تطابق کامل اکسیژن اولیه با حد آستانه)',
      category: 'Shelf-Life / O2 Capacity',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'days',
      inputs: { initialO2Cm3: 1.0, maxO2Cm3: 1.0 },
      referenceValue: 0,
      engineValue: res.shelfLifeOxygenLimitedDays,
      absoluteDiff: 0,
      relativeDiffPercent: 0,
      tolerance: 'دقیقاً ۰ روز',
      passed,
      notes: 'گزارش وضعیت immediate_depletion و ماندگاری اکسیژنی برابر ۰ روز.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 3: Negative Oxygen Capacity (< 0.0 cm³)
  // --------------------------------------------------------------------------
  {
    const res = calculatePackagingShelfLife({
      productNameFa: 'محصول با اکسیژن فراتر از آستانه',
      productDryMassKg: 0.1,
      initialMoisturePercentWetBasis: 2.0,
      criticalMoisturePercentWetBasis: 6.0,
      isothermSlopeGWaterPerGProductPerAw: 0.10,
      packagingAreaM2: 0.04,
      effectiveWvtrAtTestGPerM2Day: 1.0,
      effectiveOtrAtTestCm3PerM2Day: 10.0,
      storageTempC: 25,
      storageRhPercent: 50,
      headspaceVolumeCm3: 50,
      initialHeadspaceO2Percent: 2.0,
      maxTolerableO2ConsumptionCm3PerKg: 5.0
    });

    const passed = res.shelfLifeOxygenLimitedDays === 0 && res.oxygenStatus === 'immediate_depletion';
    results.push({
      id: 3,
      title: 'ظرفیت اکسیژن منفی (اکسیژن اولیه بیشتر از حد مجاز فساد)',
      category: 'Shelf-Life / O2 Capacity',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'days',
      inputs: { initialO2Cm3: 1.0, maxO2Cm3: 0.5 },
      referenceValue: 0,
      engineValue: res.shelfLifeOxygenLimitedDays,
      absoluteDiff: 0,
      relativeDiffPercent: 0,
      tolerance: 'دقیقاً ۰ روز',
      passed,
      notes: 'بدون تقسیم منفی یا مقدار نامعتبر، بلافاصله ۰ روز گزارش شد.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 4: Initial Headspace O2 exceeding allowable threshold diagnostic
  // --------------------------------------------------------------------------
  {
    const res = calculatePackagingShelfLife({
      productNameFa: 'محصول اکسیدشده در بسته‌بندی نامناسب',
      productDryMassKg: 0.2,
      initialMoisturePercentWetBasis: 3.0,
      criticalMoisturePercentWetBasis: 7.0,
      isothermSlopeGWaterPerGProductPerAw: 0.10,
      packagingAreaM2: 0.05,
      effectiveWvtrAtTestGPerM2Day: 0.5,
      effectiveOtrAtTestCm3PerM2Day: 20.0,
      storageTempC: 25,
      storageRhPercent: 60,
      headspaceVolumeCm3: 100,
      initialHeadspaceO2Percent: 5.0,
      maxTolerableO2ConsumptionCm3PerKg: 10.0
    });

    const passed =
      res.shelfLifeOxygenLimitedDays === 0 &&
      res.oxygenDiagnosticFa !== undefined &&
      (res.oxygenDiagnosticFa.includes('بیشتر یا مساوی') || res.oxygenDiagnosticFa.includes('فضای بالای بسته'));

    results.push({
      id: 4,
      title: 'تشخیص تخصصی اکسیژن در شرایط فراتر رفتن اکسیژن اولیه از حد کل مجاز',
      category: 'Shelf-Life / O2 Capacity',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'days',
      inputs: { initialO2Cm3: 5.0, allowableO2Cm3: 2.0 },
      referenceValue: 0,
      engineValue: res.shelfLifeOxygenLimitedDays,
      absoluteDiff: 0,
      relativeDiffPercent: 0,
      tolerance: 'دقیقاً ۰ روز + پیام تشخیصی',
      passed,
      notes: res.oxygenDiagnosticFa || ''
    });
  }

  // --------------------------------------------------------------------------
  // TEST 5: Wet Cup Test (Mass Loss, slope < 0)
  // --------------------------------------------------------------------------
  {
    const res = calculateWvtr({
      massChangeDataPoints: [
        { timeHours: 0, massGrams: 50.000 },
        { timeHours: 10, massGrams: 49.970 },
        { timeHours: 20, massGrams: 49.940 },
        { timeHours: 30, massGrams: 49.910 }
      ],
      exposedAreaM2: 0.005,
      thicknessMicrons: 25,
      testTemperatureC: 38,
      relativeHumidityHighSidePercent: 100,
      relativeHumidityLowSidePercent: 10,
      testCupMethod: 'water_wet_cup'
    });

    // Independent reference: |slope| = 0.003 g/h -> 0.072 g/day / 0.005 m² = 14.4 g/(m²·day)
    const expectedWvtr = 14.4;
    const absDiff = Math.abs(res.wvtrGPerM2Day - expectedWvtr);
    const relDiff = (absDiff / expectedWvtr) * 100;
    const passed = absDiff < 0.01 && res.rSquared > 0.999;

    results.push({
      id: 5,
      title: 'آزمون فنجان تر (Wet Cup) با شیب منفی و کاهش جرم آب',
      category: 'WVTR / Gravimetric',
      testClassification: 'Numerical / Analytical Cross-Check (Software-Tested)',
      units: 'g/(m²·day)',
      inputs: { method: 'water_wet_cup', slopeGPerHour: -0.003, areaM2: 0.005 },
      referenceValue: expectedWvtr,
      engineValue: res.wvtrGPerM2Day,
      absoluteDiff: absDiff,
      relativeDiffPercent: relDiff,
      tolerance: '±0.01 g/(m²·day)',
      passed,
      notes: `کاهش جرم به نرخ نفوذ مثبت تبدیل شد: ${res.wvtrGPerM2Day.toFixed(3)} g/(m²·day)`
    });
  }

  // --------------------------------------------------------------------------
  // TEST 6: Dry Cup Test (Mass Gain, slope > 0)
  // --------------------------------------------------------------------------
  {
    const res = calculateWvtr({
      massChangeDataPoints: [
        { timeHours: 0, massGrams: 20.000 },
        { timeHours: 12, massGrams: 20.024 },
        { timeHours: 24, massGrams: 20.048 },
        { timeHours: 36, massGrams: 20.072 }
      ],
      exposedAreaM2: 0.005,
      thicknessMicrons: 30,
      testTemperatureC: 38,
      relativeHumidityHighSidePercent: 90,
      relativeHumidityLowSidePercent: 0,
      testCupMethod: 'desiccant_dry_cup'
    });

    // Independent reference: 0.002 g/h * 24 / 0.005 = 9.6 g/(m²·day)
    const expectedWvtr = 9.6;
    const absDiff = Math.abs(res.wvtrGPerM2Day - expectedWvtr);
    const relDiff = (absDiff / expectedWvtr) * 100;
    const passed = absDiff < 0.01 && res.rSquared > 0.999;

    results.push({
      id: 6,
      title: 'آزمون فنجان خشک (Dry Cup) با شیب مثبت و جذب رطوبت ماده خشک‌کن',
      category: 'WVTR / Gravimetric',
      testClassification: 'Numerical / Analytical Cross-Check (Software-Tested)',
      units: 'g/(m²·day)',
      inputs: { method: 'desiccant_dry_cup', slopeGPerHour: 0.002, areaM2: 0.005 },
      referenceValue: expectedWvtr,
      engineValue: res.wvtrGPerM2Day,
      absoluteDiff: absDiff,
      relativeDiffPercent: relDiff,
      tolerance: '±0.01 g/(m²·day)',
      passed,
      notes: `جذب رطوبت فنجان خشک: ${res.wvtrGPerM2Day.toFixed(3)} g/(m²·day)`
    });
  }

  // --------------------------------------------------------------------------
  // TEST 7: Inconsistent Slope with Cup Method
  // --------------------------------------------------------------------------
  {
    let errorCaught = false;
    let errorMessage = '';
    try {
      calculateWvtr({
        massChangeDataPoints: [
          { timeHours: 0, massGrams: 50.000 },
          { timeHours: 10, massGrams: 50.050 },
          { timeHours: 20, massGrams: 50.100 }
        ],
        exposedAreaM2: 0.005,
        thicknessMicrons: 25,
        testTemperatureC: 38,
        relativeHumidityHighSidePercent: 100,
        relativeHumidityLowSidePercent: 10,
        testCupMethod: 'water_wet_cup'
      });
    } catch (err: any) {
      errorCaught = true;
      errorMessage = err.message || '';
    }

    const passed = errorCaught && errorMessage.includes('ناسازگار');
    results.push({
      id: 7,
      title: 'اعتبارسنجی جهت شیب و توقف محاسبه در صورت تضاد روش فنجان تر با افزایش جرم',
      category: 'WVTR / Physical Integrity',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'error check',
      inputs: { method: 'water_wet_cup', massSlope: 'positive' },
      referenceValue: 'Error Thrown',
      engineValue: errorCaught ? 'Error Thrown' : 'No Error',
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'پرتاب خطای صریح',
      passed,
      notes: errorMessage
    });
  }

  // --------------------------------------------------------------------------
  // TEST 8: Outlier Detection Count Fix (exact 1 outlier out of 6, no auto-delete, limitation reported)
  // --------------------------------------------------------------------------
  {
    const res = calculateWvtr({
      massChangeDataPoints: [
        { timeHours: 0, massGrams: 10.000 },
        { timeHours: 10, massGrams: 10.020 },
        { timeHours: 20, massGrams: 10.040 },
        { timeHours: 30, massGrams: 10.120 }, // Single outlier at index 3 (residual +0.04914 g > 2*0.02213 g)
        { timeHours: 40, massGrams: 10.080 },
        { timeHours: 50, massGrams: 10.100 }
      ],
      exposedAreaM2: 0.005,
      thicknessMicrons: 30,
      testTemperatureC: 38,
      relativeHumidityHighSidePercent: 90,
      relativeHumidityLowSidePercent: 0,
      testCupMethod: 'desiccant_dry_cup'
    });

    const flaggedOutliers = res.outlierPoints.filter((p) => p.isOutlier);
    const passed =
      res.totalPointsCount === 6 &&
      res.outlierCount === 1 &&
      flaggedOutliers.length === 1 &&
      flaggedOutliers[0].pointIndex === 3 &&
      res.outlierDiagnostics.autoDeleted === false &&
      res.outlierDiagnostics.thresholdRule === '|residual_i| > 2.0 × RMSE' &&
      res.outlierDiagnostics.statisticalLimitationFa.includes('اهرم');

    results.push({
      id: 8,
      title: 'گزارش تعداد دقیق نقاط پرت (۱ نقطه از ۶ نقطه)، آستانه و محدودیت آماری بدون حذف خودکار',
      category: 'WVTR / Regression Diagnostics',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'count',
      inputs: { totalPoints: 6, perturbedIndex: 3, deltaG: 0.06 },
      referenceValue: '1 outlier (index 3) of 6 points',
      engineValue: `${res.outlierCount} outlier (index ${flaggedOutliers[0]?.pointIndex}) of ${res.totalPointsCount} points`,
      absoluteDiff: Math.abs(res.outlierCount - 1),
      relativeDiffPercent: 0,
      tolerance: 'دقیقاً ۱ نقطه پرت در شاخص ۳',
      passed,
      notes: `روش: ${res.outlierDiagnostics.detectionMethodFa} | آستانه: ${res.outlierDiagnostics.thresholdRule} | autoDeleted=${res.outlierDiagnostics.autoDeleted}`
    });
  }

  // --------------------------------------------------------------------------
  // TEST 9: Insufficient Gravimetric Data Points (< 2 points)
  // --------------------------------------------------------------------------
  {
    let errorCaught = false;
    try {
      calculateWvtr({
        massChangeDataPoints: [{ timeHours: 0, massGrams: 10.000 }],
        exposedAreaM2: 0.005,
        thicknessMicrons: 30,
        testTemperatureC: 38,
        relativeHumidityHighSidePercent: 90,
        relativeHumidityLowSidePercent: 0
      });
    } catch {
      errorCaught = true;
    }

    results.push({
      id: 9,
      title: 'اعتبارسنجی حداقل تعداد نقاط داده وزنی (حداقل ۲ نقطه برای رگرسیون خطی)',
      category: 'WVTR / Boundary Validation',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'error check',
      inputs: { pointsCount: 1 },
      referenceValue: 'Error Thrown',
      engineValue: errorCaught ? 'Error Thrown' : 'No Error',
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'توقف با خطای ورودی',
      passed: errorCaught,
      notes: 'تعداد داده‌های ناکافی برای رگرسیون خطی بلافاصله پس زده شد.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 10: EVOH OTR with 4 distinct empirical calibration points -> 'calibrated_data_only' (NOT 'verified_empirical')
  // --------------------------------------------------------------------------
  {
    // Hand-computed OLS exponential fit for:
    // RH=[0, 40, 70, 90]%, P=[0.015, 0.045, 0.160, 0.500] cm³·mm/(m²·d·atm)
    // a = -4.376400, b = 3.839536 -> at 65% RH: P(65%) = 0.152483 cm³·mm/(m²·d·atm)
    // For L = 15 µm = 0.015 mm, Δp = 0.21 atm, T = 23°C -> OTR = (0.152483 / 0.015) * 0.21 = 2.1348 cm³/(m²·d)
    const res = calculateOtr({
      oxygenPermeabilityMm: 0.015,
      thicknessMicrons: 15,
      exposedAreaM2: 0.1,
      temperatureC: 23,
      referenceTemperatureC: 23,
      activationEnergyO2KjPerMol: 35.0,
      oxygenPartialPressureDiffAtm: 0.21,
      relativeHumidityPercent: 65,
      isRhSensitiveMaterial: true,
      rhEmpiricalDataPoints: [
        { rhPercent: 0, permeabilityMm: 0.015 },
        { rhPercent: 40, permeabilityMm: 0.045 },
        { rhPercent: 70, permeabilityMm: 0.160 },
        { rhPercent: 90, permeabilityMm: 0.500 }
      ]
    });

    const expectedOtr = 2.1348;
    const absDiff = Math.abs(res.otrCm3PerM2Day - expectedOtr);
    const relDiff = (absDiff / expectedOtr) * 100;
    const passed =
      res.rhModelStatus === 'calibrated_data_only' &&
      res.rhCorrectionApplied === true &&
      res.rhValidRangePercent?.[0] === 0 &&
      res.rhValidRangePercent?.[1] === 90 &&
      absDiff < 0.01 &&
      (res.rhModelCaveatFa?.includes('اعتبارسنجی مستقل') || false);

    results.push({
      id: 10,
      title: 'مدل رطوبتی EVOH با ۴ نقطه متمایز: وضعیت calibrated_data_only و محدوده معتبر [0, 90]%',
      category: 'OTR / Hydrophilic Polymers',
      testClassification: 'Numerical / Analytical Cross-Check (Software-Tested)',
      units: 'cm³/(m²·day)',
      inputs: { polymer: 'EVOH-32', targetRhPercent: 65, empiricalPoints: '4 distinct (0,40,70,90%)' },
      referenceValue: `${expectedOtr} (calibrated_data_only)`,
      engineValue: `${res.otrCm3PerM2Day.toFixed(4)} (${res.rhModelStatus})`,
      absoluteDiff: absDiff,
      relativeDiffPercent: relDiff,
      tolerance: '±0.01 cm³/(m²·d) و وضعیت فاقد اعتبارسنجی مستقل',
      passed,
      notes: res.rhModelCaveatFa || ''
    });
  }

  // --------------------------------------------------------------------------
  // TEST 11: PA-6 with only 2 points MUST NOT verify -> unverified_insufficient_calibration
  // --------------------------------------------------------------------------
  {
    const res = calculateOtr({
      oxygenPermeabilityMm: 1.0,
      thicknessMicrons: 25,
      exposedAreaM2: 0.05,
      temperatureC: 23,
      referenceTemperatureC: 23,
      activationEnergyO2KjPerMol: 40.0,
      oxygenPartialPressureDiffAtm: 0.21,
      relativeHumidityPercent: 50,
      isRhSensitiveMaterial: true,
      rhEmpiricalDataPoints: [
        { rhPercent: 0, permeabilityMm: 1.0 },
        { rhPercent: 90, permeabilityMm: 3.5 }
      ]
    });

    const passed =
      res.rhModelStatus === 'unverified_insufficient_calibration' &&
      res.rhCorrectionApplied === false &&
      res.fittedRhModelLatex === undefined;

    results.push({
      id: 11,
      title: 'رد کالیبراسیون ۲ نقطه‌ای برای PA-6 (الزام ≥۴ نقطه متمایز، وضعیت unverified_insufficient_calibration)',
      category: 'OTR / Hydrophilic Polymers',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'status',
      inputs: { polymer: 'PA-6', rhPercent: 50, empiricalPointsCount: 2 },
      referenceValue: 'unverified_insufficient_calibration',
      engineValue: res.rhModelStatus,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'عدم برازش با ۲ نقطه و عدم اتکا به R²=1',
      passed,
      notes: res.rhWarningFa || ''
    });
  }

  // --------------------------------------------------------------------------
  // TEST 12: EVOH OTR without Empirical RH Data (unverified_missing_data)
  // --------------------------------------------------------------------------
  {
    const res = calculateOtr({
      oxygenPermeabilityMm: 0.015,
      thicknessMicrons: 15,
      exposedAreaM2: 0.1,
      temperatureC: 23,
      referenceTemperatureC: 23,
      activationEnergyO2KjPerMol: 35.0,
      oxygenPartialPressureDiffAtm: 0.21,
      relativeHumidityPercent: 80,
      isRhSensitiveMaterial: true
    });

    const passed =
      res.rhModelStatus === 'unverified_missing_data' &&
      res.rhCorrectionApplied === false &&
      res.rhWarningFa !== undefined;

    results.push({
      id: 12,
      title: 'ممانعت از ساخت ضرایب ساختگی رطوبت برای EVOH در غیاب داده‌های کالیبراسیون',
      category: 'OTR / Scientific Integrity',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'status',
      inputs: { isRhSensitive: true, rhPercent: 80, empiricalPoints: 'none' },
      referenceValue: 'unverified_missing_data',
      engineValue: res.rhModelStatus,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'وضعیت تاییدنشده بدون تولید داده ساختگی',
      passed,
      notes: res.rhWarningFa || ''
    });
  }

  // --------------------------------------------------------------------------
  // TEST 13: Ideal Aluminum Foil Theoretical Barrier
  // --------------------------------------------------------------------------
  {
    const res = calculateLaminateBarrier([
      {
        materialId: 'mat_pet',
        materialNameFa: 'PET',
        thicknessMicrons: 12,
        oxygenPermeabilityMm: 1.3,
        waterVaporPermeabilityMm: 0.5
      },
      {
        materialId: 'mat_alu_foil',
        materialNameFa: 'Alu Foil',
        thicknessMicrons: 9,
        oxygenPermeabilityMm: 0.00001,
        waterVaporPermeabilityMm: 0.00001
      },
      {
        materialId: 'mat_ldpe',
        materialNameFa: 'LDPE',
        thicknessMicrons: 50,
        oxygenPermeabilityMm: 160.0,
        waterVaporPermeabilityMm: 0.45
      }
    ]);

    // Independent series calculation:
    // R_PET = 0.012 / 1.3 = 0.00923; R_Alu = 0.009 / 1e-5 = 900.0; R_LDPE = 0.050 / 160 = 0.0003125
    // Total R = 900.00954 -> effectiveOTR = (1/900.00954)*0.21 = 0.0002333 cm³/(m²·day)
    const expectedOtr = 0.0002333;
    const absDiff = Math.abs(res.effectiveOtrCm3PerM2Day - expectedOtr);
    const relDiff = (absDiff / expectedOtr) * 100;
    const aluResistance = res.layerResistanceBreakdown.find((l) => l.materialNameFa.includes('Alu'));
    const passed = absDiff < 0.00001 && (aluResistance?.oxygenResistancePercentage || 0) > 99.9;

    results.push({
      id: 13,
      title: 'سد ایده‌آل تئوریک فویل آلومینیوم در ساختار سه‌لایه (مقاومت سری)',
      category: 'Laminates / Series Resistance',
      testClassification: 'Numerical / Analytical Cross-Check (Software-Tested)',
      units: 'cm³/(m²·day)',
      inputs: { layers: ['PET 12µm', 'Alu 9µm', 'LDPE 50µm'] },
      referenceValue: expectedOtr,
      engineValue: Number(res.effectiveOtrCm3PerM2Day.toFixed(7)),
      absoluteDiff: absDiff,
      relativeDiffPercent: relDiff,
      tolerance: '±0.00001 cm³/(m²·day)',
      passed,
      notes: `سهم مقاومت تئوریک لایه فویل: ${aluResistance?.oxygenResistancePercentage.toFixed(4)}%`
    });
  }

  // --------------------------------------------------------------------------
  // TEST 14: Foil & Laminate Standards Audit (No ASTM B209; exact scopes ASTM B479/B926/EN 546-4/F392/F1307/F88)
  // --------------------------------------------------------------------------
  {
    const res = calculateLaminateBarrier([
      {
        materialId: 'mat_pet',
        materialNameFa: 'PET',
        thicknessMicrons: 12,
        oxygenPermeabilityMm: 1.3,
        waterVaporPermeabilityMm: 0.5
      },
      {
        materialId: 'mat_alu_foil',
        materialNameFa: 'Alu Foil',
        thicknessMicrons: 9,
        oxygenPermeabilityMm: 0.00001,
        waterVaporPermeabilityMm: 0.00001
      }
    ]);

    const combinedText = `${res.realPackageAssessment.pinholeRiskNoticeFa} ${res.realPackageAssessment.flexCrackNoticeFa} ${res.realPackageAssessment.recommendationFa}`;
    const hasNoB209 = !combinedText.includes('B209');
    const hasValidStandards =
      combinedText.includes('ASTM B479') &&
      combinedText.includes('ASTM B926') &&
      combinedText.includes('EN 546-4') &&
      combinedText.includes('ASTM F392') &&
      combinedText.includes('ASTM F1307') &&
      combinedText.includes('ASTM F88') &&
      combinedText.includes('استحکام مکانیکی') &&
      combinedText.includes('نیست');

    const passed =
      res.realPackageAssessment.status === 'unverified_defect_data_required' &&
      hasNoB209 &&
      hasValidStandards;

    results.push({
      id: 14,
      title: 'حذف ASTM B209 و ارجاع صحیح استانداردهای ASTM B479/B926/EN 546-4/F392/F1307/F88 بدون عدد پین‌هول ساختگی',
      category: 'Laminates / Standards Compliance',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'standards check',
      inputs: { foilThicknessUm: 9 },
      referenceValue: 'No B209 + exact B479/B926/EN546-4/F392/F1307/F88 scopes',
      engineValue: hasNoB209 && hasValidStandards ? 'Verified Standard Scopes' : 'Invalid Citation',
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'انطباق کامل دامنه کاربرد استانداردها',
      passed,
      notes: 'ASTM F88 صرفاً برای استحکام دوخت و ASTM B926 / EN 546-4 صرفاً برای فویل ساده بدون پوشش/لمینیت تفکیک شدند.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 15: Overall Migration (OM) Statutory Compliance (<= 10 mg/dm²)
  // --------------------------------------------------------------------------
  {
    const res = calculateMigrationAssessment({
      materialTypeFa: 'فیلم پلی‌پروپیلن BOPP',
      polymerMatrix: 'PP',
      simulant: 'simulant_B',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.036 // 36 mg / 6 dm² = 6.0 mg/dm²
    });

    const passed = res.overallMigrationMgPerDm2 === 6.0 && res.isOverallMigrationCompliant === true;
    results.push({
      id: 15,
      title: 'ارزیابی مهاجرت کلی (OM) کمتر از سقف ۱۰ mg/dm² در EU 10/2011',
      category: 'Migration / EU 10/2011 OM',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'mg/dm²',
      inputs: { residueMg: 36, areaDm2: 6.0 },
      referenceValue: 6.0,
      engineValue: res.overallMigrationMgPerDm2,
      absoluteDiff: 0,
      relativeDiffPercent: 0,
      tolerance: 'دقیقاً ۶.۰ mg/dm² (سقف ۱۰ mg/dm²)',
      passed,
      notes: 'مهاجرت کلی ۶.۰ mg/dm² زیر سقف ۱۰ mg/dm² ماده ۱۲ مقررات (EU) 10/2011 است.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 16: Overall Migration (OM) Statutory Failure (> 10 mg/dm²)
  // --------------------------------------------------------------------------
  {
    const res = calculateMigrationAssessment({
      materialTypeFa: 'فیلم پلیمری غیراستاندارد',
      polymerMatrix: 'LDPE',
      simulant: 'simulant_B',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.084 // 84 mg / 6 dm² = 14.0 mg/dm²
    });

    const passed = res.overallMigrationMgPerDm2 === 14.0 && res.isOverallMigrationCompliant === false;
    results.push({
      id: 16,
      title: 'رد قانونی مهاجرت کلی در صورت عبور از سقف ۱۰ mg/dm²',
      category: 'Migration / EU 10/2011 OM',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'mg/dm²',
      inputs: { residueMg: 84, areaDm2: 6.0 },
      referenceValue: 14.0,
      engineValue: res.overallMigrationMgPerDm2,
      absoluteDiff: 0,
      relativeDiffPercent: 0,
      tolerance: 'دقیقاً ۱۴.۰ mg/dm² (غیرمنطبق)',
      passed,
      notes: 'مهاجرت کلی ۱۴.۰ mg/dm² مغایر با سقف ۱۰ mg/dm² اعلام شد.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 17: PA-6 Caprolactam MUST NOT be verified without documented PA-6 parameters
  // --------------------------------------------------------------------------
  {
    const res = calculateMigrationAssessment({
      materialTypeFa: 'فیلم پلی‌آمید ۶ (PA-6)',
      polymerMatrix: 'PA6',
      simulant: 'simulant_A',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.020,
      migrantNameFa: 'کاپرولاکتام',
      migrantMolecularWeightGPerMol: 113.16,
      initialMigrantConcentrationInPolymerMgPerKg: 50,
      smlLimitMgPerKg: 15.0,
      casNumber: '105-60-2',
      fcmNumber: '212',
      regulationVersionDate: 'Regulation (EU) No 10/2011',
      officialSourceReference: 'EU 10/2011 Annex I FCM 212 (Group Restriction 4)'
    });

    const passed =
      res.smlStatus === 'unverified_missing_polymer_parameters' &&
      res.computationalEstimationStatus === 'unverified_missing_polymer_parameters' &&
      res.isSpecificMigrationCompliant === undefined &&
      res.estimatedSpecificMigrationMgPerKg === undefined;

    results.push({
      id: 17,
      title: 'عدم تأیید انطباق کاپرولاکتام در فیلم PA-6 در غیاب پارامتر معتبر رطوبتی پلیمر',
      category: 'Migration / Piringer Polymer Integrity',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'status',
      inputs: { polymer: 'PA6', substance: 'Caprolactam', CAS: '105-60-2', FCM: '212', SML: 15.0 },
      referenceValue: 'unverified_missing_polymer_parameters',
      engineValue: res.smlStatus,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'عدم صدور تخمین و عدم تأیید انطباق',
      passed,
      notes: res.piringerParametersUsed?.applicabilityCaveatFa || ''
    });
  }

  // --------------------------------------------------------------------------
  // TEST 18: Unverified SML when Limit is Missing/Undefined
  // --------------------------------------------------------------------------
  {
    const res = calculateMigrationAssessment({
      materialTypeFa: 'فیلم پلی‌پروپیلن PP',
      polymerMatrix: 'PP',
      simulant: 'simulant_B',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.020,
      migrantNameFa: 'افزودنی جدید نامشخص',
      migrantMolecularWeightGPerMol: 300,
      initialMigrantConcentrationInPolymerMgPerKg: 50
    });

    const passed = res.smlStatus === 'unverified_missing_limit' && res.isSpecificMigrationCompliant === undefined;
    results.push({
      id: 18,
      title: 'ممانعت از اعلام انطباق در غیاب حد قانونی SML (حذف کامل ۰.۰۵ پیش‌فرض)',
      category: 'Migration / Legal Integrity',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'status',
      inputs: { polymer: 'PP', migrant: 'افزودنی نامشخص', smlLimit: undefined },
      referenceValue: 'unverified_missing_limit',
      engineValue: res.smlStatus,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'تأییدنشده بدون پیش‌فرض ۰.۰۵',
      passed,
      notes: 'بدون حد مصوب قانونی، وضعیت unverified_missing_limit صادر شد.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 19: DEHP (CAS 117-81-7, FCM 283) Group Restriction 36 per Commission Regulation (EU) 2023/1442
  // --------------------------------------------------------------------------
  {
    // Under EU 2023/1442:
    // DEHP SML = 0.6 mg/kg; Group Restriction 36 SML(T) = 0.6 mg/kg DEHP equivalents:
    // (DBP * 5) + (DIBP * 4) + (BBP * 0.1) + (DEHP * 1) <= 0.6 mg/kg
    // Test valid repeated-use non-fatty contact with co-migrants:
    // DBP=0.05, DIBP=0.05, BBP=0.10, DEHP=0.15 -> 0.25 + 0.20 + 0.01 + 0.15 = 0.61 mg/kg (> 0.60 -> exceeds Group 36!)
    const res = calculateMigrationAssessment({
      materialTypeFa: 'فیلم پلی‌اتیلن سبک چندبارمصرف',
      polymerMatrix: 'LDPE',
      simulant: 'simulant_A',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.020,
      migrantNameFa: 'دی‌اتیل‌هگزیل فتالات DEHP',
      migrantMolecularWeightGPerMol: 390.56,
      initialMigrantConcentrationInPolymerMgPerKg: 20,
      smlLimitMgPerKg: 0.6,
      smlGroupLimitMgPerKg: 0.6,
      groupRestrictionNumber: '36',
      casNumber: '117-81-7',
      fcmNumber: '283',
      regulationVersionDate: 'Commission Regulation (EU) 2023/1442',
      officialSourceReference: 'EU 10/2011 Annex I FCM 283 & Group Restriction 36',
      isRepeatedUse: true,
      isInfantOrYoungChildFood: false,
      groupCoMigrantsMgPerKg: {
        dbp: 0.05,
        dibp: 0.05,
        bbp: 0.10,
        dehp: 0.15
      }
    });

    // Independent arithmetic: 0.05*5 + 0.05*4 + 0.10*0.1 + 0.15 = 0.25 + 0.20 + 0.01 + 0.15 = 0.61 mg/kg
    const expectedEq = 0.61;
    const actualEq = res.smlDetails?.groupDehpEquivalentMgPerKg ?? -1;
    const absDiff = Math.abs(actualEq - expectedEq);
    const passed =
      absDiff < 1e-6 &&
      res.smlDetails?.smlLimitMgPerKg === 0.6 &&
      res.smlDetails?.smlGroupLimitMgPerKg === 0.6 &&
      res.smlStatus === 'screening_exceeds_sml' &&
      res.isSpecificMigrationCompliant === false;

    results.push({
      id: 19,
      title: 'ارزیابی DEHP (FCM 283) و محدودیت گروهی شماره ۳۶ معادل با 0.6 mg/kg طبق (EU) 2023/1442',
      category: 'Migration / DEHP Group Restriction 36',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'mg/kg DEHP-eq',
      inputs: { DBP: 0.05, DIBP: 0.05, BBP: 0.10, DEHP: 0.15, SML: 0.6, SML_T: 0.6, repeatedUse: true },
      referenceValue: `${expectedEq} (> 0.6 -> screening_exceeds_sml)`,
      engineValue: `${actualEq} (${res.smlStatus})`,
      absoluteDiff: absDiff,
      relativeDiffPercent: (absDiff / expectedEq) * 100,
      tolerance: '±1e-6 و رد تجمعی گروه ۳۶',
      passed,
      notes: 'فرمول وزنی سمیت (DBP×5 + DIBP×4 + BBP×0.1 + DEHP×1 = 0.61 > 0.60 mg/kg) با موفقیت تشخیص داده شد.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 20: Impossible Physical Inputs (Sanity Guard)
  // --------------------------------------------------------------------------
  {
    let negativeAreaCaught = false;
    let negativeThicknessCaught = false;

    try {
      calculateOtr({
        oxygenPermeabilityMm: 1.0,
        thicknessMicrons: -20,
        exposedAreaM2: 0.1,
        temperatureC: 25,
        referenceTemperatureC: 23,
        activationEnergyO2KjPerMol: 35.0,
        oxygenPartialPressureDiffAtm: 0.21
      });
    } catch {
      negativeThicknessCaught = true;
    }

    try {
      calculateWvtr({
        massChangeDataPoints: [
          { timeHours: 0, massGrams: 10 },
          { timeHours: 10, massGrams: 10.02 }
        ],
        exposedAreaM2: -0.005,
        thicknessMicrons: 30,
        testTemperatureC: 38,
        relativeHumidityHighSidePercent: 90,
        relativeHumidityLowSidePercent: 0
      });
    } catch {
      negativeAreaCaught = true;
    }

    const passed = negativeAreaCaught && negativeThicknessCaught;
    results.push({
      id: 20,
      title: 'اعتبارسنجی مقادیر غیرفیزیکی (مساحت و ضخامت منفی) با پرتاب خطای صریح',
      category: 'Physical Boundary Sanity',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'error check',
      inputs: { negativeArea: -0.005, negativeThickness: -20 },
      referenceValue: 'Both Errors Caught',
      engineValue: passed ? 'Both Errors Caught' : 'Missed',
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'رد کامل مقادیر غیرفیزیکی',
      passed,
      notes: 'مقادیر منفی برای مساحت و ضخامت مسدود شدند.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 21: Fickian Diffusion Lag Time Analytical Check (Crank, 1975)
  // --------------------------------------------------------------------------
  {
    // Hand-computed analytical Crank (1975) solution:
    // L = 50 µm = 5e-5 m -> L² = 2.5e-9 m², D = 1e-12 m²/s -> t_lag = L²/(6D) = 416.6667 s
    const res = calculateFickianDiffusion({
      diffusionCoefficientM2PerSec: 1e-12,
      solubilityCoefficientCm3PerM3Pa: 1.0,
      thicknessMicrons: 50,
      concentrationHighSideGPerM3: 100,
      concentrationLowSideGPerM3: 0
    });

    const expectedSeconds = 416.667;
    const absDiff = Math.abs(res.lagTimeSeconds - expectedSeconds);
    const relDiff = (absDiff / expectedSeconds) * 100;
    const passed = absDiff < 0.01;

    results.push({
      id: 21,
      title: 'تطابق تحلیلی زمان تأخیر نفوذ کرانک (Crank 1975: t_lag = L² / 6D)',
      category: 'Fickian Diffusion / Kinetics',
      testClassification: 'Numerical / Analytical Cross-Check (Software-Tested)',
      units: 'seconds',
      inputs: { L_um: 50, D_m2_s: 1e-12 },
      referenceValue: expectedSeconds,
      engineValue: res.lagTimeSeconds,
      absoluteDiff: absDiff,
      relativeDiffPercent: relDiff,
      tolerance: '±0.01 ثانیه',
      passed,
      notes: `خروجی تحلیلی: ${res.lagTimeSeconds.toFixed(3)} ثانیه (${res.lagTimeHours.toFixed(5)} ساعت)`
    });
  }

  // --------------------------------------------------------------------------
  // TEST 22: Arrhenius Temperature Scaling Check (Independent Pre-Computed Reference — No Duplicated Formula)
  // --------------------------------------------------------------------------
  {
    // Independent hand calculation:
    // T_ref = 296.15 K, T = 308.15 K, Ep = 35000 J/mol, R = 8.314462618 J/(mol·K)
    // 1/308.15 - 1/296.15 = 0.0032451728 - 0.0033766672 = -0.0001314944 K^-1
    // (-35000 / 8.314462618) * (-0.0001314944) = +0.5535320
    // P(35°C) = 1.3 * exp(0.5535320) = 1.3 * 1.7393852 = 2.26120 cm³·mm/(m²·d·atm)
    const res = calculateOtr({
      oxygenPermeabilityMm: 1.3,
      thicknessMicrons: 25,
      exposedAreaM2: 0.1,
      temperatureC: 35,
      referenceTemperatureC: 23,
      activationEnergyO2KjPerMol: 35.0,
      oxygenPartialPressureDiffAtm: 0.21
    });

    const expectedPermeability = 2.26120;
    const absDiff = Math.abs(res.actualPermeabilityAtTemp - expectedPermeability);
    const relDiff = (absDiff / expectedPermeability) * 100;
    const passed = absDiff < 0.001;

    results.push({
      id: 22,
      title: 'تصحیح دمایی آرنیوس با مقایسه مستقیم در برابر عدد مرجع مستقل',
      category: 'OTR / Temperature Scaling',
      testClassification: 'Numerical / Analytical Cross-Check (Software-Tested)',
      units: 'cm³·mm/(m²·d·atm)',
      inputs: { T_ref_C: 23, T_C: 35, Ep_kJ_mol: 35.0, P_ref: 1.3 },
      referenceValue: expectedPermeability,
      engineValue: Number(res.actualPermeabilityAtTemp.toFixed(5)),
      absoluteDiff: absDiff,
      relativeDiffPercent: relDiff,
      tolerance: '±0.001',
      passed,
      notes: 'مقایسه مستقیم در برابر مقدار محاسبه‌شده مستقل (بدون تکرار کد فرمول آرنیوس در تست).'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 23: Duplicate RH values (4 points with only 3 distinct RH%) MUST be rejected
  // --------------------------------------------------------------------------
  {
    const res = calculateOtr({
      oxygenPermeabilityMm: 0.015,
      thicknessMicrons: 15,
      exposedAreaM2: 0.1,
      temperatureC: 23,
      referenceTemperatureC: 23,
      activationEnergyO2KjPerMol: 35.0,
      oxygenPartialPressureDiffAtm: 0.21,
      relativeHumidityPercent: 60,
      isRhSensitiveMaterial: true,
      rhEmpiricalDataPoints: [
        { rhPercent: 0, permeabilityMm: 0.015 },
        { rhPercent: 0, permeabilityMm: 0.016 }, // Duplicate RH = 0%
        { rhPercent: 50, permeabilityMm: 0.060 },
        { rhPercent: 85, permeabilityMm: 0.450 }
      ]
    });

    const passed =
      res.rhModelStatus === 'unverified_insufficient_calibration' &&
      res.rhCorrectionApplied === false &&
      res.rhCalibrationPointsCount === 3;

    results.push({
      id: 23,
      title: 'تشخیص تکرار رطوبت (۴ داده اما فقط ۳ سطح متمایز RH) و الزام ۴ سطح متمایز',
      category: 'OTR / Hydrophilic Polymers',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'distinct RH count',
      inputs: { totalPoints: 4, distinctRhLevels: [0, 50, 85] },
      referenceValue: 'unverified_insufficient_calibration (3 distinct)',
      engineValue: `${res.rhModelStatus} (${res.rhCalibrationPointsCount} distinct)`,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: '۳ سطح متمایز < ۴ -> رد برازش',
      passed,
      notes: 'تکرار رطوبت ۰٪ به‌درستی به‌عنوان نقطه متمایز جدید شمرده نشد.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 24: Prohibition of Extrapolation Outside Calibrated RH Range
  // --------------------------------------------------------------------------
  {
    const res = calculateOtr({
      oxygenPermeabilityMm: 0.015,
      thicknessMicrons: 15,
      exposedAreaM2: 0.1,
      temperatureC: 23,
      referenceTemperatureC: 23,
      activationEnergyO2KjPerMol: 35.0,
      oxygenPartialPressureDiffAtm: 0.21,
      relativeHumidityPercent: 95, // Outside [20, 80]% calibrated range!
      isRhSensitiveMaterial: true,
      rhEmpiricalDataPoints: [
        { rhPercent: 20, permeabilityMm: 0.020 },
        { rhPercent: 40, permeabilityMm: 0.035 },
        { rhPercent: 60, permeabilityMm: 0.080 },
        { rhPercent: 80, permeabilityMm: 0.250 }
      ]
    });

    const passed =
      res.rhModelStatus === 'unverified_extrapolation' &&
      res.rhCorrectionApplied === false &&
      res.rhValidRangePercent?.[0] === 20 &&
      res.rhValidRangePercent?.[1] === 80;

    results.push({
      id: 24,
      title: 'ممنوعیت برون‌یابی رطوبتی خارج از بازه کالیبراسیون (RH=95% برای محدوده [20, 80]%)',
      category: 'OTR / Extrapolation Guard',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: '% RH',
      inputs: { calibratedRange: '[20, 80]%', targetRh: 95 },
      referenceValue: 'unverified_extrapolation',
      engineValue: res.rhModelStatus,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'ممانعت کامل از برون‌یابی',
      passed,
      notes: res.rhWarningFa || ''
    });
  }

  // --------------------------------------------------------------------------
  // TEST 25: BPA (CAS 80-05-7, FCM 151) under Commission Regulation (EU) 2024/3190
  // --------------------------------------------------------------------------
  {
    // 25a: Standard plastic packaging -> prohibited intentional use + warning against repealed 0.05 mg/kg
    const resGeneral = calculateMigrationAssessment({
      materialTypeFa: 'پلی‌اتیلن سبک LDPE',
      polymerMatrix: 'LDPE',
      simulant: 'simulant_B',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.010,
      migrantNameFa: 'بیسفنول آ (BPA)',
      migrantMolecularWeightGPerMol: 228.3,
      initialMigrantConcentrationInPolymerMgPerKg: 10,
      smlLimitMgPerKg: 0.05, // Repealed EU 2018/213 limit
      casNumber: '80-05-7',
      fcmNumber: '151',
      regulationVersionDate: 'Commission Regulation (EU) 2024/3190',
      officialSourceReference: '(EU) 2024/3190 repealing (EU) 2018/213',
      bpaDerogationType: 'none'
    });

    // 25b: Narrow Annex II derogation (polysulfone filtration membrane) evaluated at analytical LOD 1 µg/kg = 0.001 mg/kg
    const resDerogated = calculateMigrationAssessment({
      materialTypeFa: 'غشای فیلتراسیون',
      polymerMatrix: 'PET',
      simulant: 'simulant_A',
      testTemperatureC: 25,
      testTimeHours: 24,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.002,
      migrantNameFa: 'بیسفنول آ (BPA)',
      migrantMolecularWeightGPerMol: 228.3,
      initialMigrantConcentrationInPolymerMgPerKg: 5,
      casNumber: '80-05-7',
      fcmNumber: '151',
      regulationVersionDate: 'Commission Regulation (EU) 2024/3190 Annex II',
      officialSourceReference: '(EU) 2024/3190 Annex II Polysulfone Filtration Derogation',
      bpaDerogationType: 'polysulfone_filtration_membrane'
    });

    const warningsStr = (resGeneral.smlDetails?.conditionsOfUseWarningsFa || []).join(' ');
    const passed =
      resGeneral.smlStatus === 'prohibited_intentional_use' &&
      resGeneral.legalComplianceStatus === 'prohibited_under_eu_2024_3190' &&
      resGeneral.isSpecificMigrationCompliant === false &&
      resGeneral.smlDetails?.smlLimitMgPerKg === undefined &&
      resGeneral.smlDetails?.analyticalLodMgPerKg === 0.001 &&
      warningsStr.includes('2018/213') &&
      warningsStr.includes('2026/250') &&
      warningsStr.includes('Article 4') &&
      resDerogated.smlStatus === 'derogated_requires_analytical_nd_verification' &&
      resDerogated.smlDetails?.smlLimitMgPerKg === undefined &&
      resDerogated.smlDetails?.analyticalLodMgPerKg === 0.001 &&
      (resDerogated.smlDetails?.analyticalLodReferenceFa?.includes('SML') || false);

    results.push({
      id: 25,
      title: 'مدیریت BPA طبق (EU) 2024/3190 و (EU) 2026/250: جداسازی کامل LoD تحلیلی (0.001 mg/kg) از SML',
      category: 'Migration / BPA (EU) 2024/3190 + 2026/250',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'status & mg/kg LoD',
      inputs: { CAS: '80-05-7', FCM: '151', generalVsDerogated: ['none', 'polysulfone_filtration_membrane'] },
      referenceValue: 'prohibited_intentional_use | SML=undefined | analyticalLoD=0.001 mg/kg',
      engineValue: `${resGeneral.smlStatus} | SML=${resDerogated.smlDetails?.smlLimitMgPerKg} | LoD=${resDerogated.smlDetails?.analyticalLodMgPerKg}`,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'عدم نمایش 0.001 mg/kg به‌عنوان SML در هیچ خروجی',
      passed,
      notes: 'مقدار 0.001 mg/kg صرفاً در analyticalLodMgPerKg طبق Article 9(2)(b) ثبت شد و smlLimitMgPerKg کاملاً undefined ماند.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 26: Polymer-Dependent Piringer Model Differentiation (LDPE vs PP) & No 'verified_compliant'
  // --------------------------------------------------------------------------
  {
    // Independent JRC EUR 27529 EN calculation for Mw=300, C_p0=100 mg/kg, T=40°C (313.15 K), t=240h (864000s), S/V=6 dm²/kg:
    // LDPE (Ap'=11.5, tau=0, rho=0.92): M = 0.07789 mg/kg
    // PP (Ap'=13.1, tau=1577, rho=0.90): M = 0.01367 mg/kg
    const resLdpe = calculateMigrationAssessment({
      materialTypeFa: 'فیلم LDPE',
      polymerMatrix: 'LDPE',
      simulant: 'simulant_A',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.010,
      migrantNameFa: 'افزودنی نمونه ۳۰۰ دالتون',
      migrantMolecularWeightGPerMol: 300,
      initialMigrantConcentrationInPolymerMgPerKg: 100,
      smlLimitMgPerKg: 5.0,
      casNumber: '123-45-6',
      fcmNumber: '999',
      regulationVersionDate: 'Regulation (EU) No 10/2011',
      officialSourceReference: 'EU 10/2011 Annex I Table 1 (Verification Check)'
    });

    const resPp = calculateMigrationAssessment({
      materialTypeFa: 'فیلم PP',
      polymerMatrix: 'PP',
      simulant: 'simulant_A',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.010,
      migrantNameFa: 'افزودنی نمونه ۳۰۰ دالتون',
      migrantMolecularWeightGPerMol: 300,
      initialMigrantConcentrationInPolymerMgPerKg: 100,
      smlLimitMgPerKg: 5.0,
      casNumber: '123-45-6',
      fcmNumber: '999',
      regulationVersionDate: 'Regulation (EU) No 10/2011',
      officialSourceReference: 'EU 10/2011 Annex I Table 1 (Verification Check)'
    });

    const expectedLdpe = 0.07789;
    const expectedPp = 0.01367;
    const diffLdpe = Math.abs((resLdpe.estimatedSpecificMigrationMgPerKg ?? 0) - expectedLdpe);
    const diffPp = Math.abs((resPp.estimatedSpecificMigrationMgPerKg ?? 0) - expectedPp);

    const passed =
      diffLdpe < 0.0002 &&
      diffPp < 0.0002 &&
      resLdpe.piringerParametersUsed?.apPrime === 11.5 &&
      resPp.piringerParametersUsed?.apPrime === 13.1 &&
      resPp.piringerParametersUsed?.tauK === 1577 &&
      (resLdpe.smlStatus as string) !== 'verified_compliant' &&
      resLdpe.smlStatus === 'screening_below_sml_unverified_lab' &&
      resLdpe.legalComplianceStatus === 'requires_en1186_lab_certification';

    results.push({
      id: 26,
      title: 'تفکیک پارامترهای پیرینگر بر حسب پلیمر (LDPE در برابر PP) و عدم صدور verified_compliant',
      category: 'Migration / JRC Piringer Validation',
      testClassification: 'Numerical / Analytical Cross-Check (Software-Tested)',
      units: 'mg/kg',
      inputs: { Mw: 300, Cp0: 100, T_C: 40, t_h: 240, polymers: ['LDPE', 'PP'] },
      referenceValue: `LDPE=${expectedLdpe}, PP=${expectedPp}`,
      engineValue: `LDPE=${resLdpe.estimatedSpecificMigrationMgPerKg?.toFixed(5)}, PP=${resPp.estimatedSpecificMigrationMgPerKg?.toFixed(5)} (${resLdpe.smlStatus})`,
      absoluteDiff: diffLdpe,
      relativeDiffPercent: (diffLdpe / expectedLdpe) * 100,
      tolerance: '±0.0002 mg/kg و نیازمند تأیید آزمایشگاهی EN 1186',
      passed,
      notes: 'تخمین محاسباتی پیرینگر هرگز وضعیت verified_compliant صادر نکرد و کاملاً از تایید قانونی تفکیک شد.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 27: Legal Metadata Completeness Gate (missing CAS/FCM/source prevents legal clearance)
  // --------------------------------------------------------------------------
  {
    const res = calculateMigrationAssessment({
      materialTypeFa: 'فیلم PP',
      polymerMatrix: 'PP',
      simulant: 'simulant_A',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.015,
      migrantNameFa: 'ماده بدون اسناد رسمی',
      migrantMolecularWeightGPerMol: 150,
      initialMigrantConcentrationInPolymerMgPerKg: 50,
      smlLimitMgPerKg: 10.0
      // casNumber, fcmNumber, regulationVersionDate, officialSourceReference omitted!
    });

    const passed =
      res.computationalEstimationStatus === 'piringer_upper_bound_estimated' &&
      res.smlStatus === 'unverified_incomplete_regulatory_metadata' &&
      res.legalComplianceStatus === 'unverified_incomplete_regulatory_data';

    results.push({
      id: 27,
      title: 'جداسازی وضعیت محاسباتی از انطباق قانونی هنگام نقص شناسنامه ماده (CAS/FCM/منبع)',
      category: 'Migration / Metadata Gate',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'status pair',
      inputs: { polymer: 'PP', smlLimit: 10.0, casNumber: 'missing', fcmNumber: 'missing' },
      referenceValue: 'comp=piringer_upper_bound_estimated, legal=unverified_incomplete_regulatory_data',
      engineValue: `comp=${res.computationalEstimationStatus}, legal=${res.legalComplianceStatus}`,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'عدم تایید قانونی با وجود تخمین زیر سقف',
      passed,
      notes: 'مقدار عددی پیرینگر محاسبه شد اما وضعیت قانونی به‌درستی Unverified باقی ماند.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 28: DEHP (EU) 2023/1442 Use Conditions Violation (Fatty D2 / Single-use) & Legacy Warning
  // --------------------------------------------------------------------------
  {
    const res = calculateMigrationAssessment({
      materialTypeFa: 'فیلم پلی‌اتیلن سبک یک‌بارمصرف',
      polymerMatrix: 'LDPE',
      simulant: 'simulant_D2', // Fatty food simulant -> forbidden for DEHP!
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.010,
      migrantNameFa: 'دی‌اتیل‌هگزیل فتالات DEHP',
      migrantMolecularWeightGPerMol: 390.56,
      initialMigrantConcentrationInPolymerMgPerKg: 5,
      smlLimitMgPerKg: 1.5, // Legacy limit -> must trigger warning!
      smlGroupLimitMgPerKg: 60.0, // Legacy group limit -> must trigger warning!
      casNumber: '117-81-7',
      fcmNumber: '283',
      isRepeatedUse: false,
      isTechnicalSupportAgent: false,
      isInfantOrYoungChildFood: false
    });

    const warnings = (res.smlDetails?.conditionsOfUseWarningsFa || []).join(' ');
    const passed =
      res.smlStatus === 'restricted_conditions_violated' &&
      res.legalComplianceStatus === 'restricted_conditions_violated' &&
      res.isSpecificMigrationCompliant === false &&
      warnings.includes('1.5') &&
      warnings.includes('60') &&
      warnings.includes('D2');

    results.push({
      id: 28,
      title: 'تشخیص تخلف شروط کاربرد DEHP نرم‌کننده (شبیه‌ساز چرب D2 / یک‌بارمصرف) و توضیح گروه‌های ۳۲ و ۳۶',
      category: 'Migration / DEHP Conditions',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'status',
      inputs: { CAS: '117-81-7', simulant: 'simulant_D2', isRepeatedUse: false, isTechnicalSupportAgent: false, legacyLimits: [1.5, 60] },
      referenceValue: 'restricted_conditions_violated',
      engineValue: res.smlStatus,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'رد شروط کاربرد بند 10(a) + شفاف‌سازی هم‌زمانی گروه 32 و 36',
      passed,
      notes: warnings
    });
  }

  // --------------------------------------------------------------------------
  // TEST 29: BPA Transitional Provisions (Articles 11 & 12, (EU) 2024/3190 + (EU) 2026/250)
  // --------------------------------------------------------------------------
  {
    const baseBpa = {
      materialTypeFa: 'پوشش قوطی',
      polymerMatrix: 'PET' as const,
      simulant: 'simulant_B' as const,
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.005,
      migrantNameFa: 'بیسفنول آ (BPA)',
      casNumber: '80-05-7',
      fcmNumber: '151',
      bpaDerogationType: 'none' as const
    };

    const rWithinFilling = calculateMigrationAssessment({
      ...baseBpa,
      bpaArticleType: 'single_use_general',
      firstPlacedOnMarketDate: '2026-06-01',
      assessmentDate: '2026-11-14'
    });
    const rExpiredGeneral = calculateMigrationAssessment({
      ...baseBpa,
      bpaArticleType: 'single_use_general',
      firstPlacedOnMarketDate: '2026-08-01',
      assessmentDate: '2026-11-14'
    });
    const rProfEquip = calculateMigrationAssessment({
      ...baseBpa,
      bpaArticleType: 'repeat_use_prof_equipment_2028',
      firstPlacedOnMarketDate: '2027-01-15',
      assessmentDate: '2028-06-01'
    });
    const rMissingDate = calculateMigrationAssessment({
      ...baseBpa,
      bpaArticleType: 'single_use_general'
    });

    const passed =
      rWithinFilling.smlDetails?.bpaTransitionalStatus === 'within_filling_window_until_2027_07_20' &&
      rExpiredGeneral.smlDetails?.bpaTransitionalStatus === 'expired_2026_07_20' &&
      rProfEquip.smlDetails?.bpaTransitionalStatus === 'within_extended_market_until_2029_01_20' &&
      rMissingDate.smlDetails?.bpaTransitionalStatus === 'unverified_missing_dates_or_category';

    results.push({
      id: 29,
      title: 'ارزیابی دوره‌های انتقالی Articles 11 و 12 مقررات BPA ((EU) 2024/3190 + (EU) 2026/250)',
      category: 'Migration / BPA Transitional Provisions',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'transitional status',
      inputs: { datesChecked: ['2026-06-01', '2026-08-01', '2027-01-15', 'missing'] },
      referenceValue: 'filling_window | expired | extended_market_2029 | unverified',
      engineValue: `${rWithinFilling.smlDetails?.bpaTransitionalStatus} | ${rExpiredGeneral.smlDetails?.bpaTransitionalStatus} | ${rProfEquip.smlDetails?.bpaTransitionalStatus} | ${rMissingDate.smlDetails?.bpaTransitionalStatus}`,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'تطابق کامل با تاریخ‌های 2026-07-20، 2027-07-20، 2028-01-20 و 2029-01-20',
      passed,
      notes: 'تمامی سناریوهای مرزی و وضعیت Unverified در نبود تاریخ به درستی ارزیابی شدند.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 30: BPA Article 4 Unmodeled Residual BPA Context -> Strictly Unverified
  // --------------------------------------------------------------------------
  {
    const res = calculateMigrationAssessment({
      materialTypeFa: 'پوشش اپوکسی مبتنی بر BADGE',
      polymerMatrix: 'PET',
      simulant: 'simulant_D1',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.005,
      migrantNameFa: 'باقیمانده BPA در مشتقات BADGE',
      migrantMolecularWeightGPerMol: 228.29,
      initialMigrantConcentrationInPolymerMgPerKg: 1,
      casNumber: '80-05-7',
      isArticle4OtherBisphenolContext: true
    });

    const passed =
      res.smlStatus === 'unverified_article4_residual_bpa_not_modeled' &&
      res.legalComplianceStatus === 'unverified_article4_residual_bpa_not_modeled' &&
      res.smlDetails?.article4ResidualBpaStatus === 'unverified_not_modeled' &&
      res.smlDetails?.analyticalLodMgPerKg === 0.001 &&
      res.smlDetails?.smlLimitMgPerKg === undefined &&
      res.isSpecificMigrationCompliant === undefined;

    results.push({
      id: 30,
      title: 'حفظ وضعیت Unverified برای Article 4 (باقیمانده غیرعمدی BPA در BADGE/سایر بیسفنول‌ها)',
      category: 'Migration / BPA Article 4',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'status',
      inputs: { isArticle4OtherBisphenolContext: true },
      referenceValue: 'unverified_article4_residual_bpa_not_modeled (LoD=0.001, SML=undefined)',
      engineValue: `${res.smlStatus} (LoD=${res.smlDetails?.analyticalLodMgPerKg}, SML=${res.smlDetails?.smlLimitMgPerKg})`,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'عدم صدور تایید انطباق برای Article 4',
      passed,
      notes: res.smlDetails?.regulatoryVerdictFa || ''
    });
  }

  // --------------------------------------------------------------------------
  // TEST 31: DEHP Simultaneous & Independent Group 32 (60 mg/kg) vs Group 36 (0.6 mg/kg DEHP-eq)
  // --------------------------------------------------------------------------
  {
    // Case A: Group 36 PASSES (0.20 <= 0.6), but Group 32 FAILS (0.20 + 62.0 = 62.20 > 60.0)
    const rGroup32Fail = calculateMigrationAssessment({
      materialTypeFa: 'لوله چندبارمصرف LDPE',
      polymerMatrix: 'LDPE',
      simulant: 'simulant_A',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.010,
      migrantNameFa: 'دی‌اتیل‌هگزیل فتالات DEHP',
      migrantMolecularWeightGPerMol: 390.56,
      initialMigrantConcentrationInPolymerMgPerKg: 5,
      smlLimitMgPerKg: 0.6,
      casNumber: '117-81-7',
      fcmNumber: '283',
      isRepeatedUse: true,
      isTechnicalSupportAgent: false,
      regulationVersionDate: 'Regulation (EU) 2023/1442',
      officialSourceReference: 'EU 10/2011 Annex I FCM 283, Groups 32 & 36',
      groupCoMigrantsMgPerKg: {
        dbp: 0,
        dibp: 0,
        bbp: 0,
        dehp: 0.20,
        otherGroup32PlasticisersMgPerKg: 62.0
      }
    });

    // Case B: Group 36 passes, but otherGroup32PlasticisersMgPerKg omitted -> Unverified
    const rGroup32Missing = calculateMigrationAssessment({
      materialTypeFa: 'لوله چندبارمصرف LDPE',
      polymerMatrix: 'LDPE',
      simulant: 'simulant_A',
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.010,
      migrantNameFa: 'دی‌اتیل‌هگزیل فتالات DEHP',
      migrantMolecularWeightGPerMol: 390.56,
      initialMigrantConcentrationInPolymerMgPerKg: 5,
      smlLimitMgPerKg: 0.6,
      casNumber: '117-81-7',
      fcmNumber: '283',
      isRepeatedUse: true,
      isTechnicalSupportAgent: false,
      regulationVersionDate: 'Regulation (EU) 2023/1442',
      officialSourceReference: 'EU 10/2011 Annex I FCM 283, Groups 32 & 36',
      groupCoMigrantsMgPerKg: {
        dbp: 0,
        dibp: 0,
        bbp: 0,
        dehp: 0.20
      }
    });

    const passed =
      rGroup32Fail.smlDetails?.group36Status === 'within_limit_0_6' &&
      rGroup32Fail.smlDetails?.group32Status === 'exceeds_60' &&
      rGroup32Fail.smlDetails?.group32TotalPlasticisersMgPerKg === 62.2 &&
      rGroup32Fail.smlStatus === 'screening_exceeds_sml' &&
      rGroup32Fail.isSpecificMigrationCompliant === false &&
      rGroup32Missing.smlDetails?.group32Status === 'unverified_missing_data' &&
      rGroup32Missing.smlStatus === 'unverified_incomplete_regulatory_metadata';

    results.push({
      id: 31,
      title: 'بررسی هم‌زمان و مستقل Group 32 (سقف 60 mg/kg) و Group 36 (سقف 0.6 mg/kg) برای DEHP',
      category: 'Migration / DEHP Group 32 & 36',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'mg/kg',
      inputs: { group36Eq: 0.20, otherGroup32: [62.0, undefined] },
      referenceValue: 'exceeds_60 (even when Group 36 passes) & unverified when omitted',
      engineValue: `G36=${rGroup32Fail.smlDetails?.group36Status}, G32=${rGroup32Fail.smlDetails?.group32Status} | missing=${rGroup32Missing.smlDetails?.group32Status}`,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'استقلال کامل گروه ۳۲ و گروه ۳۶ بدون جایگزینی',
      passed,
      notes: 'حتی با قبولی گروه ۳۶، عبور مجموع نرم‌کننده‌های گروه ۳۲ از 60 mg/kg رد شد و در نبود داده سایر نرم‌کننده‌ها وضعیت Unverified صادر شد.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 32: DEHP Food Simulant D1 vs D2 Distinction (Annex III Rules)
  // --------------------------------------------------------------------------
  {
    const baseD1 = {
      materialTypeFa: 'واشر چندبارمصرف LDPE',
      polymerMatrix: 'LDPE' as const,
      simulant: 'simulant_D1' as const,
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.005,
      migrantNameFa: 'دی‌اتیل‌هگزیل فتالات DEHP',
      migrantMolecularWeightGPerMol: 390.56,
      initialMigrantConcentrationInPolymerMgPerKg: 5,
      smlLimitMgPerKg: 0.6,
      casNumber: '117-81-7',
      fcmNumber: '283',
      isRepeatedUse: true,
      isTechnicalSupportAgent: false,
      regulationVersionDate: 'Regulation (EU) 2023/1442',
      officialSourceReference: 'EU 10/2011 Annex I FCM 283 & Annex III',
      groupCoMigrantsMgPerKg: {
        dbp: 0,
        dibp: 0,
        bbp: 0,
        dehp: 0.1,
        otherGroup32PlasticisersMgPerKg: 0
      }
    };

    const rUnspecifiedD1 = calculateMigrationAssessment(baseD1);
    const rDairyD1 = calculateMigrationAssessment({ ...baseD1, d1FoodNature: 'dairy_or_emulsion_fatty' });
    const rAlcNonFattyD1 = calculateMigrationAssessment({ ...baseD1, d1FoodNature: 'alcoholic_non_fatty_gt20' });

    const passed =
      rUnspecifiedD1.smlStatus === 'unverified_incomplete_regulatory_metadata' &&
      rDairyD1.smlStatus === 'restricted_conditions_violated' &&
      rAlcNonFattyD1.smlStatus === 'screening_below_sml_unverified_lab' &&
      rAlcNonFattyD1.legalComplianceStatus === 'requires_en1186_lab_certification';

    results.push({
      id: 32,
      title: 'تفکیک شبیه‌ساز D1 از D2 برای DEHP (نامشخص=Unverified، لبنی/چرب=رد، الکلی غیرچرب=مجاز مشروط به EN 1186)',
      category: 'Migration / DEHP Simulant D1 vs D2',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'status',
      inputs: { simulant: 'simulant_D1', d1FoodNatures: ['unspecified', 'dairy_or_emulsion_fatty', 'alcoholic_non_fatty_gt20'] },
      referenceValue: 'unverified | violated | screening_below_sml_unverified_lab',
      engineValue: `${rUnspecifiedD1.smlStatus} | ${rDairyD1.smlStatus} | ${rAlcNonFattyD1.smlStatus}`,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'عدم یکسان‌سازی کورکورانه D1 و D2',
      passed,
      notes: 'D1 بدون تعیین ماهیت غذایی Unverified ماند، برای لبنیات رد شد و برای الکلی غیرچرب >20% از سد شرط کاربرد گذشت.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 33: DEHP Independent Role Evaluation (Plasticiser vs Technical Support Agent <= 0.1% w/w)
  // --------------------------------------------------------------------------
  {
    const baseRole = {
      materialTypeFa: 'فیلم LDPE',
      polymerMatrix: 'LDPE' as const,
      simulant: 'simulant_D2' as const,
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.005,
      migrantNameFa: 'دی‌اتیل‌هگزیل فتالات DEHP',
      migrantMolecularWeightGPerMol: 390.56,
      initialMigrantConcentrationInPolymerMgPerKg: 5,
      smlLimitMgPerKg: 0.6,
      casNumber: '117-81-7',
      fcmNumber: '283',
      isRepeatedUse: false,
      regulationVersionDate: 'Regulation (EU) 2023/1442',
      officialSourceReference: 'EU 10/2011 Annex I FCM 283 Column 10(b)',
      groupCoMigrantsMgPerKg: {
        dbp: 0,
        dibp: 0,
        bbp: 0,
        dehp: 0.05,
        otherGroup32PlasticisersMgPerKg: 0
      }
    };

    const rUndefinedRole = calculateMigrationAssessment(baseRole);
    const rTechOk = calculateMigrationAssessment({
      ...baseRole,
      isTechnicalSupportAgent: true,
      finalProductDehpPercentWByW: 0.08 // <= 0.1% w/w allowed under 10(b)
    });
    const rTechExceeds = calculateMigrationAssessment({
      ...baseRole,
      isTechnicalSupportAgent: true,
      finalProductDehpPercentWByW: 0.15 // > 0.1% w/w violates 10(b)
    });

    const passed =
      rUndefinedRole.smlStatus === 'unverified_incomplete_regulatory_metadata' &&
      rTechOk.smlStatus === 'screening_below_sml_unverified_lab' &&
      rTechExceeds.smlStatus === 'restricted_conditions_violated';

    results.push({
      id: 33,
      title: 'بررسی مستقل نقش DEHP: نامشخص (Unverified) در برابر کمک‌فرآیند فنی ≤0.1% w/w و >0.1% w/w',
      category: 'Migration / DEHP Role Independence',
      testClassification: 'Boundary / Integrity / Diagnostic Check (Software-Tested)',
      units: 'status & % w/w',
      inputs: { role: ['undefined', 'tech<=0.08%', 'tech=0.15%'] },
      referenceValue: 'unverified | screening_below_sml_unverified_lab | restricted_conditions_violated',
      engineValue: `${rUndefinedRole.smlStatus} | ${rTechOk.smlStatus} | ${rTechExceeds.smlStatus}`,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'تمایز کامل بند 10(a) و بند 10(b)',
      passed,
      notes: 'در غیاب تعیین نقش، وضعیت Unverified صادر شد و در کمک‌فرآیند فنی سقف 0.1% w/w مستقل از شرط غیرچرب بررسی شد.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 34: DEHP Transitional Status (1 Feb 2025) & (EU) 2025/351 Repeat-Use Notice
  // --------------------------------------------------------------------------
  {
    const baseTrans = {
      materialTypeFa: 'واشر LDPE',
      polymerMatrix: 'LDPE' as const,
      simulant: 'simulant_A' as const,
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.005,
      migrantNameFa: 'دی‌اتیل‌هگزیل فتالات DEHP',
      migrantMolecularWeightGPerMol: 390.56,
      initialMigrantConcentrationInPolymerMgPerKg: 5,
      smlLimitMgPerKg: 0.6,
      casNumber: '117-81-7',
      fcmNumber: '283',
      isRepeatedUse: true,
      isTechnicalSupportAgent: false
    };

    const rLegacy = calculateMigrationAssessment({ ...baseTrans, firstPlacedOnMarketDate: '2024-12-01' });
    const rPost = calculateMigrationAssessment({ ...baseTrans, firstPlacedOnMarketDate: '2025-03-01' });
    const rMissing = calculateMigrationAssessment(baseTrans);
    const warnings = (rPost.smlDetails?.conditionsOfUseWarningsFa || []).join(' ');

    const passed =
      rLegacy.smlDetails?.dehpTransitionalStatus === 'legacy_stock_exhaustion_pre_2025_02_01' &&
      rPost.smlDetails?.dehpTransitionalStatus === 'post_2025_02_01_full_enforcement' &&
      rMissing.smlDetails?.dehpTransitionalStatus === 'unverified_missing_placing_date' &&
      warnings.includes('2025/351');

    results.push({
      id: 34,
      title: 'بررسی دوره انتقالی (EU) 2023/1442 (2025-02-01) و الزامات (EU) 2025/351 برای چندبارمصرف',
      category: 'Migration / DEHP Transitional & 2025/351',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'status',
      inputs: { placingDates: ['2024-12-01', '2025-03-01', 'missing'], isRepeatedUse: true },
      referenceValue: 'legacy_stock | full_enforcement | unverified + 2025/351 notice',
      engineValue: `${rLegacy.smlDetails?.dehpTransitionalStatus} | ${rPost.smlDetails?.dehpTransitionalStatus} | ${rMissing.smlDetails?.dehpTransitionalStatus}`,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'انطباق با Article 2(1) از 2023/1442 و 2025/351',
      passed,
      notes: 'تاریخ پیش و پس از 1 فوریه 2025 و ارجاع خلوص/NIAS/برچسب چندبارمصرف 2025/351 تأیید شد.'
    });
  }

  // --------------------------------------------------------------------------
  // TEST 35: Caprolactam Group Restriction 4 (FCM 212 + FCM 435 <= 15 mg/kg) in PA-6
  // --------------------------------------------------------------------------
  {
    const baseCap = {
      materialTypeFa: 'فیلم پلی‌آمید ۶ (PA-6)',
      polymerMatrix: 'PA6' as const,
      simulant: 'simulant_A' as const,
      testTemperatureC: 40,
      testTimeHours: 240,
      contactAreaDm2: 6.0,
      foodVolumeKg: 1.0,
      evaporatedResidueMassGrams: 0.015,
      migrantNameFa: 'کاپرولاکتام (Caprolactam)',
      migrantMolecularWeightGPerMol: 113.16,
      initialMigrantConcentrationInPolymerMgPerKg: 100,
      smlLimitMgPerKg: 15.0,
      casNumber: '105-60-2',
      fcmNumber: '212',
      regulationVersionDate: 'Regulation (EU) No 10/2011',
      officialSourceReference: 'EU 10/2011 Annex I Table 1 & 2 (FCM 212 + FCM 435, Group 4)'
    };

    // 35a: Missing FCM 435 in PA-6 -> Unverified (both Piringer PA-6 & Group 4)
    const rMissing435 = calculateMigrationAssessment(baseCap);

    // 35b: Lab data supplied where FCM 212 (10.0) + FCM 435 (6.0) = 16.0 > 15.0 -> exceeds_15
    const rExceedsGroup4 = calculateMigrationAssessment({
      ...baseCap,
      groupCoMigrantsMgPerKg: {
        fcm212CaprolactamMgPerKg: 10.0,
        caprolactamSodiumSaltAsCaprolactamMgPerKg: 6.0
      }
    });

    // 35c: Lab data supplied where FCM 212 (9.0) + FCM 435 (5.5) = 14.5 <= 15.0 -> within_limit_15, requires EN 1186, NO Piringer fabrication!
    const rWithinGroup4 = calculateMigrationAssessment({
      ...baseCap,
      groupCoMigrantsMgPerKg: {
        fcm212CaprolactamMgPerKg: 9.0,
        caprolactamSodiumSaltAsCaprolactamMgPerKg: 5.5
      }
    });

    const passed =
      rMissing435.computationalEstimationStatus === 'unverified_missing_polymer_parameters' &&
      rMissing435.smlDetails?.group4Status === 'unverified_missing_data' &&
      rExceedsGroup4.smlDetails?.group4Status === 'exceeds_15' &&
      rExceedsGroup4.smlDetails?.group4SumAsCaprolactamMgPerKg === 16.0 &&
      rExceedsGroup4.smlStatus === 'screening_exceeds_sml' &&
      rExceedsGroup4.isSpecificMigrationCompliant === false &&
      rWithinGroup4.computationalEstimationStatus === 'unverified_missing_polymer_parameters' &&
      rWithinGroup4.smlDetails?.group4Status === 'within_limit_15' &&
      rWithinGroup4.smlDetails?.group4SumAsCaprolactamMgPerKg === 14.5 &&
      rWithinGroup4.legalComplianceStatus === 'requires_en1186_lab_certification' &&
      (rWithinGroup4.smlStatus as string) !== 'verified_compliant';

    results.push({
      id: 35,
      title: 'محدودیت گروهی ۴ کاپرولاکتام (FCM 212 + FCM 435 ≤ 15 mg/kg) در ماتریس PA-6 بدون جعل پارامتر پیرینگر',
      category: 'Migration / Caprolactam Group 4',
      testClassification: 'Regulatory Rule Logic Check (EU/ISO Reference)',
      units: 'mg/kg as caprolactam',
      inputs: { matrix: 'PA6', fcm212: [undefined, 10.0, 9.0], fcm435: [undefined, 6.0, 5.5] },
      referenceValue: 'unverified | exceeds_15 (16.0) | within_limit_15 (14.5, requires_en1186)',
      engineValue: `${rMissing435.smlDetails?.group4Status} | ${rExceedsGroup4.smlDetails?.group4SumAsCaprolactamMgPerKg} (${rExceedsGroup4.smlDetails?.group4Status}) | ${rWithinGroup4.smlDetails?.group4SumAsCaprolactamMgPerKg} (${rWithinGroup4.legalComplianceStatus})`,
      absoluteDiff: null,
      relativeDiffPercent: null,
      tolerance: 'کنترل مجموع 212+435 و حفظ Unverified در نبود داده',
      passed,
      notes: 'در نبود FCM 435 وضعیت Unverified صادر شد، جمع 16>15 رد شد و در PA-6 هیچ پارامتر پیرینگرتخمین‌زده‌ای جعل نشد.'
    });
  }

  // Print Summary
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount;

  console.log('\n======================================================');
  console.log('📦 PACKAGING CORRECTIVE VERIFICATION SUITE RESULTS');
  console.log('======================================================\n');

  for (const r of results) {
    const symbol = r.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${symbol} [Test ${r.id}] (${r.testClassification}) ${r.title}`);
    console.log(`   دسته: ${r.category} | یکا: ${r.units}`);
    console.log(`   ورودی: ${JSON.stringify(r.inputs)}`);
    console.log(`   مقدار مرجع: ${r.referenceValue} | مقدار موتور: ${r.engineValue}`);
    if (r.absoluteDiff !== null) {
      console.log(`   اختلاف مطلق: ${r.absoluteDiff.toExponential(3)} | اختلاف نسبی: ${r.relativeDiffPercent?.toFixed(3)}% (رواداری: ${r.tolerance})`);
    }
    console.log(`   نکات: ${r.notes}\n`);
  }

  console.log('------------------------------------------------------');
  console.log(`نتیجه نهایی: ${passedCount} از ${totalCount} تست پاس شد (${Math.round((passedCount / totalCount) * 100)}% موفقیت)`);
  console.log('------------------------------------------------------\n');

  return { allPassed, results, passedCount, totalCount };
}

// Direct execution when run via tsx
if (import.meta.url.endsWith('packagingCorrectiveTests.ts') || process.argv[1]?.includes('packagingCorrectiveTests')) {
  runPackagingCorrectiveSuite()
    .then((res) => {
      if (!res.allPassed) {
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Fatal error in packaging corrective tests:', err);
      process.exit(1);
    });
}
