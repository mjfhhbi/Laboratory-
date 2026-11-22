/**
 * Food Packaging Engineering Engine
 * Rigorous calculations for WVTR, OTR, Fickian Diffusion, Laminates, Shelf-Life, and Migration.
 * References:
 * - Robertson, G.L. (2012). Food Packaging: Principles and Practice, CRC Press.
 * - Crank, J. (1975). The Mathematics of Diffusion (2nd Ed.), Oxford University Press.
 * - Piringer, O.G., & Baner, A.L. (2008). Plastic Packaging: Interactions with Food and Pharmaceuticals, Wiley-VCH.
 * - ASTM E96 (Water Vapor Gravimetric), ASTM D3985 (Coulometric Oxygen), EU 10/2011, INSO 13740.
 */

import {
  WvtrCalculationInput,
  WvtrCalculationResult,
  OtrCalculationInput,
  OtrCalculationResult,
  LaminateLayerInput,
  LaminateBarrierResult,
  FickianDiffusionInput,
  FickianDiffusionResult,
  PackagingShelfLifeInput,
  PackagingShelfLifeResult,
  MigrationAssessmentInput,
  MigrationAssessmentResult,
  PiringerPolymerMatrix,
  SmlEvaluationStatus,
  BpaTransitionalCategory,
  BpaTransitionalStatus,
  DehpTransitionalStatus
} from './types';

const GAS_CONSTANT_R = 8.314462618; // J / (mol · K)

interface PiringerPolymerSpec {
  polymerKey: PiringerPolymerMatrix;
  apPrime: number;
  tauK: number;
  densityGPerCm3: number;
  maxTempC: number;
  source: string;
  caveatFa: string;
}

/**
 * Documented Piringer upper-bound parameters from:
 * - Hoekstra et al. (2015), JRC Technical Report EUR 27529 EN, Table 1 (Polyolefins)
 * - Simoneau et al. (2010), JRC Scientific & Technical Report EUR 24514 EN / Begley et al. (2005)
 * NOTE: PA-6 (Polyamide 6) lacks a single moisture-independent JRC Table 1 parameter set for aqueous/humid food contact
 * due to water-induced Tg depression and plasticization; hence PA-6 is excluded and flagged as unverified unless documented params are supplied.
 */
const PIRINGER_POLYMER_REGISTRY: Partial<Record<PiringerPolymerMatrix, PiringerPolymerSpec>> = {
  LDPE: {
    polymerKey: 'LDPE',
    apPrime: 11.5,
    tauK: 0,
    densityGPerCm3: 0.92,
    maxTempC: 80,
    source: 'JRC EUR 27529 EN (2015), Table 1',
    caveatFa: 'معتبر برای غربالگری LDPE در دمای زیر ۸۰°C و غلظت افزودنی ≤ ۱٪ وزنی (C_p0 ≤ 10000 mg/kg).'
  },
  LLDPE: {
    polymerKey: 'LLDPE',
    apPrime: 11.5,
    tauK: 0,
    densityGPerCm3: 0.925,
    maxTempC: 100,
    source: 'JRC EUR 27529 EN (2015), Table 1',
    caveatFa: 'معتبر برای غربالگری LLDPE در دمای زیر ۱۰۰°C و غلظت افزودنی ≤ ۱٪ وزنی.'
  },
  HDPE: {
    polymerKey: 'HDPE',
    apPrime: 14.5,
    tauK: 1577,
    densityGPerCm3: 0.96,
    maxTempC: 90,
    source: 'JRC EUR 27529 EN (2015), Table 1',
    caveatFa: 'معتبر برای غربالگری HDPE در دمای زیر ۹۰°C و غلظت افزودنی ≤ ۱٪ وزنی.'
  },
  PP: {
    polymerKey: 'PP',
    apPrime: 13.1,
    tauK: 1577,
    densityGPerCm3: 0.90,
    maxTempC: 120,
    source: 'JRC EUR 27529 EN (2015), Table 1 (PP Homopolymer / Random Copolymer)',
    caveatFa: 'معتبر برای غربالگری PP هموپلیمر/رندوم در دمای زیر ۱۲۰°C و غلظت افزودنی ≤ ۱٪ وزنی.'
  },
  PP_BLOCK: {
    polymerKey: 'PP_BLOCK',
    apPrime: 11.5,
    tauK: 0,
    densityGPerCm3: 0.90,
    maxTempC: 100,
    source: 'JRC EUR 27529 EN (2015), Table 1 (PP Block Copolymer)',
    caveatFa: 'معتبر برای غربالگری کوپلیمر بلوکی PP در دمای زیر ۱۰۰°C و غلظت افزودنی ≤ ۱٪ وزنی.'
  },
  PET: {
    polymerKey: 'PET',
    apPrime: 3.1,
    tauK: 1577,
    densityGPerCm3: 1.38,
    maxTempC: 75,
    source: 'JRC EUR 24514 EN (2010) / Begley et al. (2005) [T < Tg ≈ 75°C]',
    caveatFa: 'پارامتر Ap′ = 3.1 و τ = 1577 صرفاً برای PET در حالت شیشه‌ای (زیر Tg ≈ 75°C) معتبر است و به بلورینگی وابسته است.'
  },
  PS: {
    polymerKey: 'PS',
    apPrime: -1.0,
    tauK: 0,
    densityGPerCm3: 1.05,
    maxTempC: 70,
    source: 'JRC EUR 24514 EN (2010) / Begley et al. (2005)',
    caveatFa: 'معتبر برای پلی‌استایرن عمومی (GPPS) در دمای زیر ۷۰°C بدون تورم حلالی.'
  },
  HIPS: {
    polymerKey: 'HIPS',
    apPrime: 1.0,
    tauK: 0,
    densityGPerCm3: 1.04,
    maxTempC: 70,
    source: 'JRC EUR 24514 EN (2010) / Begley et al. (2005)',
    caveatFa: 'معتبر برای پلی‌استایرن مقاوم به ضربه (HIPS) در دمای زیر ۷۰°C بدون تورم حلالی.'
  }
};

function inferPolymerMatrix(input: MigrationAssessmentInput): PiringerPolymerMatrix {
  if (input.polymerMatrix) {
    return input.polymerMatrix;
  }
  const text = (input.materialTypeFa || '').toLowerCase();
  if (text.includes('pa-6') || text.includes('pa6') || text.includes('بپلی‌آمید') || text.includes('پلی‌آمید') || text.includes('نایلون') || text.includes('bopa') || text.includes('nylon')) {
    return 'PA6';
  }
  if (text.includes('lldpe') || text.includes('خطی')) {
    return 'LLDPE';
  }
  if (text.includes('hdpe') || text.includes('سنگین')) {
    return 'HDPE';
  }
  if (text.includes('ldpe') || text.includes('پلی‌اتیلن سبک')) {
    return 'LDPE';
  }
  if (text.includes('block') || text.includes('بلوکی')) {
    return 'PP_BLOCK';
  }
  if (text.includes('bopp') || text.includes('پلی‌پروپیلن') || /\bpp\b/.test(text)) {
    return 'PP';
  }
  if (text.includes('hips')) {
    return 'HIPS';
  }
  if (text.includes('پلی‌استایرن') || /\bps\b/.test(text)) {
    return 'PS';
  }
  if (text.includes('pet') || text.includes('پلی‌استر') || text.includes('ترفتالات')) {
    return 'PET';
  }
  if (text.includes('pvc') || text.includes('وینیل کلراید')) {
    return 'PVC';
  }
  return 'OTHER';
}

/**
 * Calculates saturation vapor pressure of water using the Antoine equation
 * log10(p_mmHg) = A - B / (C + T_celsius)
 * Output in atmospheres (atm)
 */
export function calculateSaturationVaporPressureAtm(tempCelsius: number): number {
  // Antoine constants for water in 0°C to 100°C:
  const A = 8.07131;
  const B = 1730.63;
  const C = 233.426;
  const log10PmmHg = A - B / (C + tempCelsius);
  const pMmHg = Math.pow(10, log10PmmHg);
  return pMmHg / 760.0; // 760 mmHg = 1 atm
}

/**
 * 1. WVTR ENGINE (Water Vapor Transmission Rate)
 * Evaluates gravimetric cup test data (ASTM E96 / ISO 2528)
 */
export function calculateWvtr(input: WvtrCalculationInput): WvtrCalculationResult {
  const {
    massChangeDataPoints,
    exposedAreaM2,
    thicknessMicrons,
    testTemperatureC,
    relativeHumidityHighSidePercent,
    relativeHumidityLowSidePercent,
    testCupMethod = 'desiccant_dry_cup'
  } = input;

  if (!massChangeDataPoints || massChangeDataPoints.length < 2) {
    throw new Error('برای برازش نرخ انتقال بخار آب، حداقل به ۲ نقطه اندازه‌گیری جرمی-زمانی نیاز است.');
  }
  if (exposedAreaM2 <= 0) {
    throw new Error('مساحت مؤثر سطح نفوذپذیری باید مقداری مثبت و بزرگتر از صفر باشد.');
  }
  if (thicknessMicrons <= 0) {
    throw new Error('ضخامت لایه بسته‌بندی باید مقداری مثبت باشد.');
  }

  // Linear Regression: mass (g) = slope (g/h) * time (h) + intercept
  const n = massChangeDataPoints.length;
  let sumT = 0;
  let sumM = 0;
  let sumTT = 0;
  let sumTM = 0;

  for (const pt of massChangeDataPoints) {
    sumT += pt.timeHours;
    sumM += pt.massGrams;
    sumTT += pt.timeHours * pt.timeHours;
    sumTM += pt.timeHours * pt.massGrams;
  }

  const denominator = n * sumTT - sumT * sumT;
  if (Math.abs(denominator) < 1e-12) {
    throw new Error('نقاط زمانی وارد شده متمایز نیستند.');
  }

  const slopeGramsPerHour = (n * sumTM - sumT * sumM) / denominator;
  const intercept = (sumM - slopeGramsPerHour * sumT) / n;

  // Method-specific physical slope direction verification
  if (testCupMethod === 'desiccant_dry_cup') {
    if (slopeGramsPerHour <= 0) {
      throw new Error(`جهت شیب تغییر جرم در آزمون فنجان خشک (دسیکانت) منفی یا صفر است (${slopeGramsPerHour.toFixed(5)} g/h). در فنجان خشک، جذب رطوبت اتمسفر توسط ماده نم‌گیر باید موجب افزایش وزن گردد. شیب منفی با فیزیک آزمون ناسازگار است و نشان‌دهنده نشت درزبندی، تبخیر حلال موم یا خطای توزین است.`);
    }
  } else if (testCupMethod === 'water_wet_cup') {
    if (slopeGramsPerHour >= 0) {
      throw new Error(`جهت شیب تغییر جرم در آزمون فنجان تر (آب) مثبت یا صفر است (${slopeGramsPerHour.toFixed(5)} g/h). در فنجان تر، خروج و نفوذ بخار آب به بیرون باید موجب کاهش پیوسته وزن گردد. شیب مثبت با فیزیک آزمون ناسازگار است.`);
    }
  }

  // Calculate R² (Coefficient of determination) and detect outliers without automatic deletion
  const meanM = sumM / n;
  let ssTot = 0;
  let ssRes = 0;
  for (const pt of massChangeDataPoints) {
    const mPred = slopeGramsPerHour * pt.timeHours + intercept;
    ssTot += Math.pow(pt.massGrams - meanM, 2);
    ssRes += Math.pow(pt.massGrams - mPred, 2);
  }
  const rSquared = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 1.0;
  const rmse = Math.sqrt(ssRes / n);

  // Outlier detection: residual > 2.0 * RMSE
  const outlierPoints = massChangeDataPoints.map((pt, idx) => {
    const predicted = slopeGramsPerHour * pt.timeHours + intercept;
    const residual = pt.massGrams - predicted;
    const isOutlier = rmse > 1e-6 && Math.abs(residual) > 2.0 * rmse;
    return {
      pointIndex: idx,
      timeHours: pt.timeHours,
      massGrams: pt.massGrams,
      residual,
      isOutlier
    };
  });

  const actualOutliers = outlierPoints.filter(p => p.isOutlier);
  const outlierCount = actualOutliers.length;
  const totalPointsCount = n;
  const hasOutliers = outlierCount > 0;
  const outlierWarningFa = hasOutliers
    ? `شناسایی ${outlierCount} نقطه پرت از مجموع ${totalPointsCount} نقطه توزین (شاخص: ${actualOutliers.map(p => `#${p.pointIndex + 1} در t=${p.timeHours}h`).join('، ')}). طبق رویه ASTM E96 هیچ نقطه‌ای به‌طور خودکار حذف نشد. روش تشخیص: باقیمانده OLS با آستانه |e_i| > 2.0 × RMSE (RMSE = ${rmse.toFixed(5)} g). محدودیت آماری: باقیمانده‌های OLS تحت تأثیر اهرم خود نقطه پرت و همبستگی خطای تجمعی وزن قرار دارند و در نمونه‌های کوچک (n=${totalPointsCount}) ممکن است مثبت/منفی کاذب رخ دهد.`
    : undefined;

  const outlierDiagnostics = {
    detectionMethodFa: 'باقیمانده رگرسیون خطی حداقل مربعات معمولی (OLS) نسبت به برازش کل نقاط',
    thresholdRule: '|residual_i| > 2.0 × RMSE',
    rmseGrams: rmse,
    statisticalLimitationFa:
      'باقیمانده‌های OLS مستقل از اهرم نقطه پرت (Leverage) نیستند و خط رگرسیون می‌تواند به‌سمت نقطه پرت کشیده شود؛ همچنین داده‌های جرمی تجمعی دارای همبستگی متوالی هستند. در تعداد نقاط کم (n ≤ 6) این آستانه تنها یک هشدار غربالگری است و مجوز حذف خودکار داده نیست.',
    autoDeleted: false as const
  };

  // WVTR in g / (m² · day)
  // slope magnitude normalized by area
  const slopeGramsPerDay = Math.abs(slopeGramsPerHour) * 24.0;
  const wvtrGPerM2Day = slopeGramsPerDay / exposedAreaM2;

  // Conversions:
  // 1 m² = 1550.0031 in² -> 100 in² = 0.064516 m²
  // WVTR [g / (100 in² · day)] = WVTR [g / (m² · day)] * 0.064516
  const wvtrGPer100In2Day = wvtrGPerM2Day * 0.064516;

  // SI Units: kg / (m² · s)
  // 1 g / (m² · day) = 1e-3 kg / (86400 s · m²) = 1.157407e-8 kg / (m² · s)
  const wvtrKgPerM2Second = wvtrGPerM2Day * (1e-3 / 86400.0);

  // Partial pressure differential: Delta p_w = p_sat(T) * (RH_high - RH_low) / 100
  const pSatAtm = calculateSaturationVaporPressureAtm(testTemperatureC);
  const deltaRhFraction = Math.abs(relativeHumidityHighSidePercent - relativeHumidityLowSidePercent) / 100.0;
  const deltaPressureVaporAtm = Math.max(1e-6, pSatAtm * deltaRhFraction);

  // Permeance = WVTR / Delta p_w [g / (m² · day · atm)]
  const permeanceGPerM2DayAtm = wvtrGPerM2Day / deltaPressureVaporAtm;

  // Permeability P = Permeance * thickness [g · mm / (m² · day · atm)]
  const thicknessMm = thicknessMicrons / 1000.0;
  const permeabilityGMmPerM2DayAtm = permeanceGPerM2DayAtm * thicknessMm;

  const formulaLatex = '\\text{WVTR} = \\frac{\\Delta m / \\Delta t}{A} = \\frac{\\text{Slope}\\times 24}{A}';
  const substitutionLatex = `\\text{WVTR} = \\frac{${Math.abs(slopeGramsPerHour).toFixed(5)}\\text{ g/h} \\times 24\\text{ h/day}}{${exposedAreaM2.toFixed(4)}\\text{ m}^2} = ${wvtrGPerM2Day.toFixed(3)}\\text{ g}/(\\text{m}^2\\cdot\\text{day})`;
  const dimensionsAuditFa = 'سازگاری دیمانسیونی: [جرم] / ([مساحت] × [زمان]) = g / (m² · day) = kg / (m² · s) در سیستم SI با ضریب تبدیل ۱.۱۵۷×۱۰⁻⁸.';

  return {
    wvtrGPerM2Day,
    wvtrGPer100In2Day,
    wvtrKgPerM2Second,
    slopeGramsPerHour,
    rSquared,
    permeanceGPerM2DayAtm,
    permeabilityGMmPerM2DayAtm,
    saturationVaporPressureAtm: pSatAtm,
    deltaPressureVaporAtm,
    formulaLatex,
    substitutionLatex,
    dimensionsAuditFa,
    testCupMethod,
    isSlopeConsistent: true,
    outlierPoints,
    outlierCount,
    totalPointsCount,
    outlierWarningFa,
    outlierDiagnostics
  };
}

/**
 * 2. OTR ENGINE (Oxygen Transmission Rate & Arrhenius Temperature Dependency)
 * Standard: ASTM D3985 / ISO 15105-2
 */
export function calculateOtr(input: OtrCalculationInput): OtrCalculationResult {
  const {
    oxygenPermeabilityMm,
    thicknessMicrons,
    exposedAreaM2,
    temperatureC,
    referenceTemperatureC = 23.0,
    activationEnergyO2KjPerMol = 40.0,
    oxygenPartialPressureDiffAtm = 0.21, // air exterior (21% O2) vs 0% interior
    relativeHumidityPercent,
    isRhSensitiveMaterial = false,
    rhEmpiricalDataPoints
  } = input;

  if (oxygenPermeabilityMm <= 0) {
    throw new Error('نفوذپذیری ذاتی اکسیژن باید مقداری مثبت باشد.');
  }
  if (thicknessMicrons <= 0) {
    throw new Error('ضخامت لایه باید مقداری مثبت باشد.');
  }
  if (exposedAreaM2 <= 0) {
    throw new Error('مساحت بسته باید بزرگتر از صفر باشد.');
  }

  const thicknessMm = thicknessMicrons / 1000.0;

  // 1. Relative Humidity (RH) Dependency Modeling
  let effectiveBasePermeability = oxygenPermeabilityMm;
  let rhCorrectionApplied = false;
  let rhModelStatus:
    | 'calibrated_data_only'
    | 'unverified_insufficient_calibration'
    | 'unverified_extrapolation'
    | 'unverified_missing_data'
    | 'not_applicable' = 'not_applicable';
  let rhWarningFa: string | undefined = undefined;
  let rhModelCaveatFa: string | undefined = undefined;
  let rhValidRangePercent: [number, number] | undefined = undefined;
  let rhCalibrationPointsCount: number | undefined = undefined;
  let fittedRhModelLatex: string | undefined = undefined;

  if (rhEmpiricalDataPoints && rhEmpiricalDataPoints.length > 0) {
    const validPoints = rhEmpiricalDataPoints.filter(
      p => Number.isFinite(p.permeabilityMm) && p.permeabilityMm > 0 && Number.isFinite(p.rhPercent) && p.rhPercent >= 0 && p.rhPercent <= 100
    );
    const distinctRhSet = new Set(validPoints.map(p => Number(p.rhPercent.toFixed(4))));
    const distinctCount = distinctRhSet.size;
    rhCalibrationPointsCount = distinctCount;

    if (validPoints.length > 0) {
      const minRh = Math.min(...validPoints.map(p => p.rhPercent));
      const maxRh = Math.max(...validPoints.map(p => p.rhPercent));
      rhValidRangePercent = [minRh, maxRh];
    }

    if (validPoints.length < 4 || distinctCount < 4) {
      effectiveBasePermeability = oxygenPermeabilityMm;
      rhCorrectionApplied = false;
      rhModelStatus = 'unverified_insufficient_calibration';
      rhWarningFa = `کالیبراسیون ناکافی رطوبتی (unverified_insufficient_calibration): تنها ${distinctCount} نقطه متمایز و معتبر از حداقل ۴ نقطه الزامی ارائه شده است. با کمتر از ۴ نقطه متمایز درجه آزادی کافی برای برازش و ارزیابی باقیمانده وجود ندارد (شاخص R² به‌تنهایی معیار اعتبار علمی نیست). هیچ ضریب تجربی ساختگی تولید نشد.`;
    } else {
      const [minRh, maxRh] = rhValidRangePercent!;
      const targetRh = relativeHumidityPercent !== undefined ? relativeHumidityPercent : 50.0;

      if (targetRh < minRh || targetRh > maxRh) {
        effectiveBasePermeability = oxygenPermeabilityMm;
        rhCorrectionApplied = false;
        rhModelStatus = 'unverified_extrapolation';
        rhWarningFa = `برون‌یابی خارج از دامنه مجاز نیست (unverified_extrapolation): رطوبت نسبی هدف (${targetRh}٪) خارج از محدوده معتبر داده‌های کالیبراسیون ([${minRh}٪ تا ${maxRh}٪]) قرار دارد. به دلیل رفتار غیرخطی پلاستیسایزینگ آب در پلیمرهای هیدروفیلیک، برون‌یابی ممنوع است.`;
      } else {
        // Fit exponential model ln(P) = a + b * (RH/100) strictly within calibrated RH range
        const n = validPoints.length;
        let sumX = 0;
        let sumY = 0;
        let sumXX = 0;
        let sumXY = 0;
        for (const pt of validPoints) {
          const x = pt.rhPercent / 100.0;
          const y = Math.log(pt.permeabilityMm);
          sumX += x;
          sumY += y;
          sumXX += x * x;
          sumXY += x * y;
        }
        const denom = n * sumXX - sumX * sumX;
        if (Math.abs(denom) > 1e-12) {
          const b = (n * sumXY - sumX * sumY) / denom;
          const a = (sumY - b * sumX) / n;

          const meanY = sumY / n;
          let ssTot = 0;
          let ssRes = 0;
          for (const pt of validPoints) {
            const x = pt.rhPercent / 100.0;
            const y = Math.log(pt.permeabilityMm);
            const yPred = a + b * x;
            ssTot += Math.pow(y - meanY, 2);
            ssRes += Math.pow(y - yPred, 2);
          }
          const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 1.0;

          const xTarget = targetRh / 100.0;
          effectiveBasePermeability = Math.exp(a + b * xTarget);
          rhCorrectionApplied = true;
          rhModelStatus = 'calibrated_data_only';
          fittedRhModelLatex = `\\ln(P_{\\text{O}_2}) = ${a.toFixed(3)} + ${b.toFixed(3)}\\left(\\frac{\\text{RH}}{100}\\right) \\quad [\\text{RH} \\in [${minRh}\\%, ${maxRh}\\%],\\; n=${n},\\; R^2 = ${r2.toFixed(3)}]`;
          rhModelCaveatFa = `وضعیت «دارای داده کالیبراسیون» (بدون اعتبارسنجی مستقل): درون‌یابی بر پایه ${n} نقطه تجربی (${distinctCount} سطح رطوبت متمایز) در محدوده معتبر ${minRh}٪ تا ${maxRh}٪ انجام شد. مقدار R² به‌تنهایی معیار اعتبار علمی نیست و برای اعتبارسنجی مستقل، آزمون برون‌نمونه‌ای (Out-of-sample) در دما و ساختار واقعی الزامی است.`;
        } else {
          effectiveBasePermeability = oxygenPermeabilityMm;
          rhCorrectionApplied = false;
          rhModelStatus = 'unverified_insufficient_calibration';
          rhWarningFa = 'نقاط کالیبراسیون دارای پراکندگی کافی در محور رطوبت نسبی نیستند.';
        }
      }
    }
  } else if (isRhSensitiveMaterial && relativeHumidityPercent !== undefined && relativeHumidityPercent > 0) {
    // Hydrophilic material with RH > 0% but without empirical calibration data
    effectiveBasePermeability = oxygenPermeabilityMm;
    rhCorrectionApplied = false;
    rhModelStatus = 'unverified_missing_data';
    rhWarningFa = `هشدار وابستگی به رطوبت: ماده انتخابی (نظیر EVOH یا PA) به دلیل پلاستیسایزاسیون ساختار پلیمری با آب، نفوذپذیری اکسیژن بسیار متغیری با رطوبت نسبی دارد. به دلیل فقدان حداقل ۴ نقطه تجربی کالیبراسیون در RH = ${relativeHumidityPercent}٪، هیچ ضریب تجربی ساختگی تولید نشد و عملکرد در این رطوبت تأییدنشده (Unverified) است.`;
  }

  // 2. Arrhenius temperature correction for Permeability:
  // P(T) = P(T_ref) * exp( -Ep/R * (1/T - 1/T_ref) )
  const tKelvin = temperatureC + 273.15;
  const tRefKelvin = referenceTemperatureC + 273.15;
  const epJPerMol = activationEnergyO2KjPerMol * 1000.0;
  
  const exponent = (-epJPerMol / GAS_CONSTANT_R) * (1.0 / tKelvin - 1.0 / tRefKelvin);
  const temperatureFactor = Math.exp(exponent);
  const actualPermeabilityAtTemp = effectiveBasePermeability * temperatureFactor;

  // Permeance = P / L [cm³ / (m² · day · atm)]
  const permeanceCm3PerM2DayAtm = actualPermeabilityAtTemp / thicknessMm;

  // OTR = Permeance * Delta p_O2 [cm³ / (m² · day)]
  const otrCm3PerM2Day = permeanceCm3PerM2DayAtm * oxygenPartialPressureDiffAtm;

  // Unit conversion: cc / (100 in² · day)
  const otrCcPer100In2Day = otrCm3PerM2Day * 0.064516;

  // Molar flux (ideal gas at 1 atm, 23°C where 1 mol = 24.465 L = 24465 cm³):
  // mol / (m² · s) = OTR(cm³/m²·day) / (24465 cm³/mol * 86400 s/day)
  const oxygenFluxMolPerM2Second = otrCm3PerM2Day / (24465.0 * 86400.0);

  // Total daily oxygen entering the package (cm³/day)
  const dailyOxygenTransmissionTotalCm3 = otrCm3PerM2Day * exposedAreaM2;

  const formulaLatex = '\\text{OTR} = \\frac{P_{\\text{O}_2}(T, \\text{RH})}{L} \\times \\Delta p_{\\text{O}_2}';
  const arrheniusLatex = 'P(T) = P(T_{\\text{ref}}) \\exp\\left(-\\frac{E_p}{R}\\left(\\frac{1}{T} - \\frac{1}{T_{\\text{ref}}}\\right)\\right)';
  const substitutionLatex = `\\text{OTR} = \\frac{${actualPermeabilityAtTemp.toFixed(3)}}{${thicknessMm.toFixed(3)}\\text{ mm}} \\times ${oxygenPartialPressureDiffAtm.toFixed(2)}\\text{ atm} = ${otrCm3PerM2Day.toFixed(2)}\\text{ cm}^3/(\\text{m}^2\\cdot\\text{day})`;

  return {
    otrCm3PerM2Day,
    otrCcPer100In2Day,
    oxygenFluxMolPerM2Second,
    permeanceCm3PerM2DayAtm,
    actualPermeabilityAtTemp,
    temperatureFactor,
    dailyOxygenTransmissionTotalCm3,
    formulaLatex,
    substitutionLatex,
    arrheniusLatex,
    rhCorrectionApplied,
    rhModelStatus,
    rhWarningFa,
    rhModelCaveatFa,
    rhValidRangePercent,
    rhCalibrationPointsCount,
    fittedRhModelLatex
  };
}

/**
 * 3. MULTI-LAYER LAMINATES & SERIES RESISTANCES
 * Mass transfer through n consecutive laminate layers:
 * 1 / Permeance_eff = sum( L_i / P_i ) = sum( 1 / Permeance_i )
 */
export function calculateLaminateBarrier(layers: LaminateLayerInput[]): LaminateBarrierResult {
  if (!layers || layers.length === 0) {
    throw new Error('برای محاسبه نفوذپذیری لمینیت حداقل به یک لایه نیاز است.');
  }

  let totalThicknessMicrons = 0;
  let totalOxygenResistance = 0; // sum(L_i / P_i) [day · atm / cm³]
  let totalWaterResistance = 0;  // sum(L_i / P_w,i) [day · atm / g]

  const resistances: { o2Res: number; h2oRes: number; name: string; thick: number }[] = [];

  for (const layer of layers) {
    if (layer.thicknessMicrons <= 0) {
      throw new Error(`ضخامت لایه ${layer.materialNameFa} باید مثبت باشد.`);
    }
    const thickMm = layer.thicknessMicrons / 1000.0;
    totalThicknessMicrons += layer.thicknessMicrons;

    // Avoid division by zero for foil (near-zero permeability)
    const pO2 = Math.max(1e-7, layer.oxygenPermeabilityMm);
    const pH2O = Math.max(1e-7, layer.waterVaporPermeabilityMm);

    const rO2 = thickMm / pO2;
    const rH2O = thickMm / pH2O;

    totalOxygenResistance += rO2;
    totalWaterResistance += rH2O;

    resistances.push({
      o2Res: rO2,
      h2oRes: rH2O,
      name: layer.materialNameFa,
      thick: layer.thicknessMicrons
    });
  }

  // Effective Permeance and Transmission Rates:
  // Permeance_eff = 1 / totalResistance
  const effOtrPermeance = 1.0 / totalOxygenResistance;
  const effWvtrPermeance = 1.0 / totalWaterResistance;

  // Assuming standard partial pressure gradients (0.21 atm for O2, standard vapor for WVTR)
  const effectiveOtrCm3PerM2Day = effOtrPermeance * 0.21;
  const effectiveWvtrGPerM2Day = effWvtrPermeance; // normalized to standard test gradient

  const totalThicknessMm = totalThicknessMicrons / 1000.0;
  const effectiveOxygenPermeabilityMm = effOtrPermeance * totalThicknessMm;
  const effectiveWaterVaporPermeabilityMm = effWvtrPermeance * totalThicknessMm;

  const layerResistanceBreakdown = resistances.map(r => ({
    materialNameFa: r.name,
    thicknessMicrons: r.thick,
    oxygenResistancePercentage: (r.o2Res / totalOxygenResistance) * 100.0,
    waterVaporResistancePercentage: (r.h2oRes / totalWaterResistance) * 100.0
  }));

  const formulaLatex = '\\frac{1}{\\text{TR}_{\\text{eff}}} = \\sum_{i=1}^{n} \\frac{L_i}{P_i} = \\frac{L_1}{P_1} + \\frac{L_2}{P_2} + \\dots + \\frac{L_n}{P_n}';

  const hasThinFoil = layers.some(
    l =>
      (l.materialId.includes('alu') || l.materialNameFa.includes('فویل') || l.materialNameFa.toLowerCase().includes('alu')) &&
      l.thicknessMicrons < 12
  );

  return {
    layersCount: layers.length,
    totalThicknessMicrons,
    effectiveOtrCm3PerM2Day,
    effectiveWvtrGPerM2Day,
    effectiveOxygenPermeabilityMm,
    effectiveWaterVaporPermeabilityMm,
    layerResistanceBreakdown,
    formulaLatex,
    idealTheoreticalBarrier: {
      effectiveOtr: effectiveOtrCm3PerM2Day,
      effectiveWvtr: effectiveWvtrGPerM2Day,
      assumptionsFa: 'محاسبات بر مبنای مدل مقاومت‌های سری فیلم تخت، کاملاً همگن و عاری از هرگونه سوراخ میکروسکوپی (Pinhole-free) و بدون اثر خمش یا درزبندی انجام شده است.'
    },
    realPackageAssessment: {
      status: 'unverified_defect_data_required',
      pinholeRiskNoticeFa: hasThinFoil
        ? 'تمایز مهندسی (فویل آلومینیوم < ۱۲ میکرون): مشخصات عمومی فویل آنیل‌شده در ASTM B479 تعریف شده و تشخیص پین‌هول‌های فویل ساده/خام بدون پوشش و لمینیت بر روی میز نور طبق ASTM B926 و EN 546-4 انجام می‌شود (یادآوری دامنه: EN 546-4 شامل فویل‌های لاک‌زده یا لمینیت‌شده نیست). بدون داده‌های بازرسی واقعی، هیچ عددی برای تراکم پین‌هول یا درصد افت سدگری فرض یا تولید نمی‌شود.'
        : 'تمایز مهندسی لمینیت: در صورت وجود فویل آلومینیوم (ASTM B479 برای مشخصات فویل؛ ASTM B926 و EN 546-4 صرفاً برای بازرسی پین‌هول فویل ساده/خام) یا لایه‌های سدکننده، عیوب تبدیل و دوخت حرارتی در محاسبه تئوریک سری منظور نشده‌اند و بدون داده تجربی عیوب، افت سدگری تخمین‌زده نمی‌شود.',
      flexCrackNoticeFa:
        'پایش آزمایشگاهی بسته واقعی: ارزیابی دوام خمشی فیلم‌ها و لمینیت‌های انعطاف‌پذیر در خط بسته‌بندی با روش Gelbo Flex طبق ASTM F392 انجام می‌شود و نرخ انتقال اکسیژن کل بسته شکل‌گرفته خشک باید مستقیماً با ASTM F1307 اندازه‌گیری شود. استاندارد ASTM F88 صرفاً برای اندازه‌گیری استحکام مکانیکی درز دوخت (Peel/Seal Strength) کاربرد دارد و معیار نرخ نشت گاز نیست.',
      recommendationFa:
        'عملکرد واقعی پاکت در غیاب داده‌های تجربی آزمون بسته شکل‌گرفته (ASTM F1307) و آزمون خمش (ASTM F392)، در وضعیت تأییدنشده (Unverified) باقی می‌ماند.'
    }
  };
}

/**
 * 4. FICKIAN DIFFUSION & LAG-TIME MODEL
 * Reference: Crank (1975) The Mathematics of Diffusion
 * Lag time: t_lag = L² / (6 * D)
 */
export function calculateFickianDiffusion(input: FickianDiffusionInput): FickianDiffusionResult {
  const {
    diffusionCoefficientM2PerSec,
    solubilityCoefficientCm3PerM3Pa,
    thicknessMicrons,
    concentrationHighSideGPerM3,
    concentrationLowSideGPerM3
  } = input;

  if (diffusionCoefficientM2PerSec <= 0) {
    throw new Error('ضریب نفوذ (D) باید مقداری مثبت باشد.');
  }
  if (thicknessMicrons <= 0) {
    throw new Error('ضخامت لایه باید مثبت باشد.');
  }

  const thicknessM = thicknessMicrons * 1e-6;

  // Fick's First Law Steady-State Flux: J = D * (C1 - C2) / L
  const deltaC = Math.abs(concentrationHighSideGPerM3 - concentrationLowSideGPerM3);
  const steadyStateFluxGPerM2Sec = (diffusionCoefficientM2PerSec * deltaC) / thicknessM;
  const steadyStateFluxKgPerM2Sec = steadyStateFluxGPerM2Sec * 1e-3;

  // Permeability P = D * S
  const permeabilityCoefficientM2PerSec = diffusionCoefficientM2PerSec * (solubilityCoefficientCm3PerM3Pa || 1.0);

  // Lag Time method: t_lag = L² / (6 * D)
  const lagTimeSeconds = (thicknessM * thicknessM) / (6.0 * diffusionCoefficientM2PerSec);
  const lagTimeHours = lagTimeSeconds / 3600.0;

  // Time to reach 90% steady state is approximately 2.7 * t_lag (Crank 1975)
  const timeToReachPercentSteadyState = lagTimeSeconds * 2.7;

  const formulaLatex = 'J = -D \\frac{dc}{dx} = \\frac{D(c_1 - c_2)}{L}, \\quad t_{\\text{lag}} = \\frac{L^2}{6D}';
  const assumptionsFa = [
    'نفوذ همگن تک‌بعدی از میان غشای مسطح صفحه تخت (Plane Sheet).',
    'ثابت بودن ضریب نفوذ (D) مستقل از غلظت ماده نفوذکننده (ایده‌آل فیکی).',
    'برقراری تعادل ترمودینامیکی فوری در سطوح تماس بر پایه قانون هنری (c = S · p).'
  ];

  return {
    steadyStateFluxKgPerM2Sec,
    permeabilityCoefficientM2PerSec,
    lagTimeSeconds,
    lagTimeHours,
    timeToReachPercentSteadyState,
    formulaLatex,
    assumptionsFa
  };
}

/**
 * 5. SHELF-LIFE PREDICTION ENGINE
 * Coupled Moisture-Uptake & Headspace Oxygen Ingress
 * Robertson (2012) & Labuza (1982) Moisture Gain Model
 */
export function calculatePackagingShelfLife(input: PackagingShelfLifeInput): PackagingShelfLifeResult {
  const {
    productDryMassKg,
    initialMoisturePercentWetBasis,
    criticalMoisturePercentWetBasis,
    isothermSlopeGWaterPerGProductPerAw,
    packagingAreaM2,
    effectiveWvtrAtTestGPerM2Day,
    effectiveOtrAtTestCm3PerM2Day,
    storageTempC = 25.0,
    storageRhPercent = 60.0,
    headspaceVolumeCm3 = 200.0,
    initialHeadspaceO2Percent = 1.0,
    maxTolerableO2ConsumptionCm3PerKg = 15.0
  } = input;

  if (productDryMassKg <= 0 || packagingAreaM2 <= 0) {
    throw new Error('جرم ماده خشک و مساحت بسته‌بندی باید مقادیر مثبت باشند.');
  }

  // 1. Moisture-Limited Shelf Life
  // Convert wet basis to dry basis: X = m_w / m_d
  const x0 = initialMoisturePercentWetBasis / (100.0 - initialMoisturePercentWetBasis);
  const xc = criticalMoisturePercentWetBasis / (100.0 - criticalMoisturePercentWetBasis);

  const deltaX = Math.abs(xc - x0);
  const totalWaterAllowedG = deltaX * productDryMassKg * 1000.0;

  // Environmental driving force: aw_env = RH / 100
  const awEnv = storageRhPercent / 100.0;
  const slopeIsotherm = isothermSlopeGWaterPerGProductPerAw > 0 ? isothermSlopeGWaterPerGProductPerAw : 0.15;

  const aw0 = Math.min(0.99, x0 / slopeIsotherm);
  const awCrit = Math.min(0.99, xc / slopeIsotherm);

  let shelfLifeMoistureLimitedDays = 0;
  const deltaAwMean = Math.abs(awEnv - (aw0 + awCrit) / 2.0);
  const effectiveWvtrAtCondition = Math.max(0.01, effectiveWvtrAtTestGPerM2Day * (deltaAwMean / 0.90));
  const dailyWaterIngressG = effectiveWvtrAtCondition * packagingAreaM2;

  if (dailyWaterIngressG > 0) {
    shelfLifeMoistureLimitedDays = Math.round(totalWaterAllowedG / dailyWaterIngressG);
  } else {
    shelfLifeMoistureLimitedDays = 9999;
  }

  // 2. Oxygen-Limited Shelf Life
  // Maximum total oxygen consumption allowed by product (cm³)
  const maxO2AllowedTotalCm3 = maxTolerableO2ConsumptionCm3PerKg * productDryMassKg;
  
  // Headspace initial oxygen (cm³)
  const initialHeadspaceO2Cm3 = headspaceVolumeCm3 * (initialHeadspaceO2Percent / 100.0);
  const netO2CanIngressCm3 = maxO2AllowedTotalCm3 - initialHeadspaceO2Cm3;

  // Daily O2 ingress through packaging: OTR * Area (cm³/day)
  const dailyO2IngressCm3 = effectiveOtrAtTestCm3PerM2Day * packagingAreaM2;

  let shelfLifeOxygenLimitedDays = 0;
  let oxygenStatus: 'normal' | 'immediate_depletion' | 'insufficient_threshold' | 'unlimited_barrier' = 'normal';
  let oxygenDiagnosticFa = '';

  if (netO2CanIngressCm3 <= 0) {
    shelfLifeOxygenLimitedDays = 0;
    if (initialHeadspaceO2Cm3 >= maxO2AllowedTotalCm3) {
      oxygenStatus = 'immediate_depletion';
      oxygenDiagnosticFa = `اکسیژن اولیه موجود در فضای بالای بسته (${initialHeadspaceO2Cm3.toFixed(3)} cm³) به تنهایی از کل آستانه تحمل اکسیداسیون محصول (${maxO2AllowedTotalCm3.toFixed(3)} cm³) بیشتر یا مساوی است؛ لذا زمان ماندگاری اکسیژنی بلافاصله به پایان می‌رسد (صفر روز). تزریق گاز نیتروژن یا استفاده از جاذب‌های اکسیژن در بسته‌بندی اتمسفر اصلاح‌شده (MAP) برای کاهش اکسیژن اولیه الزامی است.`;
    } else {
      oxygenStatus = 'insufficient_threshold';
      oxygenDiagnosticFa = 'ظرفیت خالص باقیمانده برای نفوذ اکسیژن صفر یا منفی است؛ ماندگاری اکسیژنی صفر روز است.';
    }
  } else if (dailyO2IngressCm3 <= 0) {
    shelfLifeOxygenLimitedDays = 99999;
    oxygenStatus = 'unlimited_barrier';
    oxygenDiagnosticFa = 'نرخ نفوذ روزانه اکسیژن از سد بسته‌بندی صفر است (سد مطلق تئوریک بدون ورود گاز).';
  } else {
    // Pure mathematical un-clamped quotient
    const exactDays = netO2CanIngressCm3 / dailyO2IngressCm3;
    shelfLifeOxygenLimitedDays = isFinite(exactDays) ? Math.max(0, Math.round(exactDays)) : 99999;
    oxygenStatus = 'normal';
    oxygenDiagnosticFa = `ظرفیت خالص اکسیژن باقیمانده بدون کلمپ مصنوعی برابر ${netO2CanIngressCm3.toFixed(4)} cm³ و نرخ نفوذ روزانه ${dailyO2IngressCm3.toFixed(4)} cm³/day است.`;
  }

  // Limiting factor and recommended shelf life:
  const limitingFactor: 'moisture' | 'oxygen' = shelfLifeOxygenLimitedDays <= shelfLifeMoistureLimitedDays ? 'oxygen' : 'moisture';
  const recommendedShelfLifeDays = Math.min(shelfLifeMoistureLimitedDays, shelfLifeOxygenLimitedDays);

  // Generate dynamic simulation curves for 10 time intervals up to 1.2 * recommendedShelfLifeDays
  const maxSimDays = Math.max(10, Math.min(1000, Math.round(recommendedShelfLifeDays * 1.2)));
  const step = Math.max(1, Math.round(maxSimDays / 10));

  const moistureGainCurve: { day: number; moisturePercent: number; waterActivity: number }[] = [];
  const oxygenIngressCurve: { day: number; headspaceO2Percent: number; cumulativeO2IngressCm3: number }[] = [];

  for (let d = 0; d <= maxSimDays; d += step) {
    const waterIngressedG = dailyWaterIngressG * d;
    const currentDryBasisX = x0 + waterIngressedG / (productDryMassKg * 1000.0);
    const currentWetBasis = (currentDryBasisX / (1.0 + currentDryBasisX)) * 100.0;
    const currentAw = Math.min(1.0, currentDryBasisX / slopeIsotherm);
    moistureGainCurve.push({
      day: d,
      moisturePercent: Number(currentWetBasis.toFixed(2)),
      waterActivity: Number(currentAw.toFixed(3))
    });

    const o2IngressedTotal = dailyO2IngressCm3 * d;
    // Estimated apparent headspace O2 if partially consumed
    const currentHeadspaceO2 = Math.min(21.0, initialHeadspaceO2Percent + (o2IngressedTotal / Math.max(1, headspaceVolumeCm3)) * 100.0);
    oxygenIngressCurve.push({
      day: d,
      headspaceO2Percent: Number(currentHeadspaceO2.toFixed(2)),
      cumulativeO2IngressCm3: Number(o2IngressedTotal.toFixed(1))
    });
  }

  const scientificDisclaimerFa = 'توجه علمی و صنعتی: ماندگاری برآوردشده صرفاً جنبه پیش‌بینی اولیه بر پایه نفوذپذیری گاز/رطوبت در شرایط پایدار دمایی-رطوبتی دارد (برآورد مشروط). تغییرات دمایی انبار، نقص درزبندی، واکنش‌های آنزیمی و تخریب اکسیداتیو نوری نیازمند صحه‌گذاری از طریق آزمون‌های تسریع‌شده (ASLT) و پایش حسی/شیمیایی در مقیاس صنعتی است.';
  const labuzaIntegralNoticeFa = 'روش مدل‌سازی: تخمین رطوبتی بر مبنای مدل نیروی محرکه میانگین حسابی Δaw اجرا شده است (تقریب خطی رابرتسون ۲۰۱۲). در مواردی که دامنه تغییرات رطوبت وسیع است (Δaw > 0.20)، حل انتگرال لگاریتمی کامل لابوزا (Labuza 1982) با ایزوترم پیوسته پیشنهاد می‌شود.';

  return {
    shelfLifeMoistureLimitedDays,
    shelfLifeOxygenLimitedDays,
    limitingFactor,
    recommendedShelfLifeDays,
    moistureGainCurve,
    oxygenIngressCurve,
    scientificDisclaimerFa,
    oxygenStatus,
    oxygenDiagnosticFa,
    calculationClassification: 'conditional_permeability_estimate',
    labuzaIntegralNoticeFa
  };
}

function isValidIsoDate(dateStr?: string): dateStr is string {
  return typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim());
}

function evaluateBpaTransitionalProvisions(
  category?: BpaTransitionalCategory,
  firstPlacedDate?: string,
  assessmentDate?: string
): { status: BpaTransitionalStatus; noticeFa: string } {
  const evalDate = isValidIsoDate(assessmentDate) ? assessmentDate.trim() : '2026-11-14';
  if (!category || !isValidIsoDate(firstPlacedDate)) {
    return {
      status: 'unverified_missing_dates_or_category',
      noticeFa:
        'وضعیت دوره انتقالی Articles 11 و 12 مقررات (EU) 2024/3190 (با تصحیحیه (EU) 2026/250) به دلیل نبود دسته‌بندی کالا (یک‌بارمصرف/چندبارمصرف/تجهیزات حرفه‌ای) یا تاریخ نخستین عرضه به بازار (first placed on the market) تأییدنشده (Unverified) است.'
    };
  }
  const placed = firstPlacedDate.trim();

  if (category === 'single_use_general') {
    if (placed > '2026-07-20') {
      return {
        status: 'expired_2026_07_20',
        noticeFa: `Article 11(1) [(EU) 2024/3190 و تصحیحیه (EU) 2026/250]: مهلت نخستین عرضه به بازار برای اقلام یک‌بارمصرف عمومی تا 2026-07-20 بوده و تاریخ عرضه (${placed}) پس از انقضای دوره انتقالی است.`
      };
    }
    if (evalDate <= '2027-07-20') {
      return {
        status: 'within_filling_window_until_2027_07_20',
        noticeFa: `Article 11(1) & 11(3) [(EU) 2024/3190 و تصحیحیه (EU) 2026/250]: قلم یک‌بارمصرف خالی که پیش از 2026-07-20 نخستین‌بار به بازار عرضه شده (${placed})، تا 12 ماه (2027-07-20) قابل پر کردن/آب‌بندی و سپس تا اتمام موجودی قابل فروش است.`
      };
    }
    return {
      status: 'expired_2026_07_20',
      noticeFa: `Article 11(1) & 11(3) [(EU) 2024/3190 و تصحیحیه (EU) 2026/250]: مهلت عرضه نخست (2026-07-20) و پنجره 12 ماهه پر کردن بسته‌بندی (2027-07-20) در تاریخ ارزیابی (${evalDate}) منقضی شده است.`
    };
  }

  if (category === 'repeat_use_general') {
    if (placed > '2026-07-20') {
      return {
        status: 'expired_2026_07_20',
        noticeFa: `Article 12(1) [(EU) 2024/3190 و تصحیحیه (EU) 2026/250]: مهلت نخستین عرضه به بازار برای اقلام چندبارمصرف عمومی تا 2026-07-20 بوده و تاریخ عرضه (${placed}) مشمول دوره انتقالی نیست.`
      };
    }
    if (evalDate <= '2027-07-20') {
      return {
        status: 'within_filling_window_until_2027_07_20',
        noticeFa: `Article 12(1) & 12(3) [(EU) 2024/3190 و تصحیحیه (EU) 2026/250]: قلم چندبارمصرف عمومی عرضه‌شده پیش از 2026-07-20 (${placed}) تا 2027-07-20 می‌تواند در بازار باقی بماند.`
      };
    }
    return {
      status: 'expired_2026_07_20',
      noticeFa: `Article 12(1) & 12(3) [(EU) 2024/3190 و تصحیحیه (EU) 2026/250]: مهلت انتقالی اقلام چندبارمصرف عمومی در تاریخ ارزیابی (${evalDate}) منقضی شده است.`
    };
  }

  // single_use_extended_2028 (Art 11(2)) or repeat_use_prof_equipment_2028 (Art 12(2))
  if (placed > '2028-01-20') {
    return {
      status: 'expired_extended_2029_01_20',
      noticeFa: `Article ${category === 'single_use_extended_2028' ? '11(2)' : '12(2)'} [(EU) 2024/3190 و تصحیحیه (EU) 2026/250]: مهلت تمدیدشده نخستین عرضه به بازار تا 2028-01-20 بوده و تاریخ (${placed}) فراتر از آن است.`
    };
  }
  if (evalDate <= '2028-01-20') {
    return {
      status: 'within_extended_placing_until_2028_01_20',
      noticeFa: `Article ${category === 'single_use_extended_2028' ? '11(2)' : '12(2)'} [(EU) 2024/3190 و تصحیحیه (EU) 2026/250]: در پنجره تمدیدشده نخستین عرضه به بازار تا 2028-01-20 قرار دارد.`
    };
  }
  if (evalDate <= '2029-01-20') {
    return {
      status: 'within_extended_market_until_2029_01_20',
      noticeFa: `Article ${category === 'single_use_extended_2028' ? '11(2)-(3)' : '12(2)-(3)'} [(EU) 2024/3190 و تصحیحیه (EU) 2026/250]: در پنجره فروش/پرکردن 12 ماهه پس از عرضه پیش از 2028-01-20 (تا 2029-01-20) قرار دارد.`
    };
  }
  return {
    status: 'expired_extended_2029_01_20',
    noticeFa: `Article ${category === 'single_use_extended_2028' ? '11(2)-(3)' : '12(2)-(3)'} [(EU) 2024/3190 و تصحیحیه (EU) 2026/250]: دوره انتقالی تمدیدشده (2028-01-20 / 2029-01-20) در تاریخ (${evalDate}) پایان یافته است.`
  };
}

function evaluateDehpTransitionalProvisions(firstPlacedDate?: string): { status: DehpTransitionalStatus; noticeFa: string } {
  if (!isValidIsoDate(firstPlacedDate)) {
    return {
      status: 'unverified_missing_placing_date',
      noticeFa:
        'Article 2(1) مقررات (EU) 2023/1442: تاریخ نخستین عرضه به بازار وارد نشده است؛ لذا امکان استناد به استثنای اتمام موجودی پیش از 2025-02-01 Unverified است و مقررات سخت‌گیرانه جاری اعمال می‌شود.'
    };
  }
  const placed = firstPlacedDate.trim();
  if (placed < '2025-02-01') {
    return {
      status: 'legacy_stock_exhaustion_pre_2025_02_01',
      noticeFa: `Article 2(1) مقررات (EU) 2023/1442: اقلام پلاستیکی منطبق با قواعد پیشین که پیش از 2025-02-01 نخستین‌بار به بازار عرضه شده‌اند (${placed}) صرفاً تا اتمام موجودی قابل عرضه هستند (تمدیدهای خاص Article 2(2)-(3) صرفاً برای FCM 121 و FCM 96 بوده و شامل DEHP نیست).`
    };
  }
  return {
    status: 'post_2025_02_01_full_enforcement',
    noticeFa: `Article 2(1) مقررات (EU) 2023/1442: مهلت انتقالی در 2025-02-01 منقضی شده و برای عرضه در تاریخ ${placed} اجرای کامل سقف SML=0.6 mg/kg، گروه‌های 32 و 36 و شروط ستون 10 الزامی است.`
  };
}

/**
 * 6. MIGRATION ASSESSMENT ENGINE
 * Standards: Regulation (EU) No 10/2011 (incl. (EU) 2023/1442 & (EU) 2025/351),
 * Regulation (EU) 2024/3190 (corrected by (EU) 2026/250), EN 1186, INSO 13740
 * Standard Overall Migration Limit: 10 mg/dm² or 60 mg/kg food simulant
 */
export function calculateMigrationAssessment(input: MigrationAssessmentInput): MigrationAssessmentResult {
  const {
    simulant,
    contactAreaDm2,
    foodVolumeKg = 1.0,
    evaporatedResidueMassGrams,
    migrantNameFa,
    migrantMolecularWeightGPerMol = 200.0,
    initialMigrantConcentrationInPolymerMgPerKg = 0.0,
    smlLimitMgPerKg
  } = input;

  if (contactAreaDm2 <= 0) {
    throw new Error('مساحت سطح تماس با ماده غذایی باید مقداری مثبت باشد.');
  }

  // 1. Overall Migration (OM):
  const residueMg = Math.max(0, evaporatedResidueMassGrams * 1000.0);
  const overallMigrationMgPerDm2 = residueMg / contactAreaDm2;

  const actualSurfaceToVolumeRatio = contactAreaDm2 / Math.max(0.01, foodVolumeKg);
  const overallMigrationMgPerKgFood = overallMigrationMgPerDm2 * actualSurfaceToVolumeRatio;

  const standardLimitMgPerDm2 = 10.0; // 10 mg/dm² (EU 10/2011 Art. 12)
  const standardLimitMgPerKg = 60.0;  // 60 mg/kg
  const isOverallMigrationCompliant = overallMigrationMgPerDm2 <= standardLimitMgPerDm2;

  // Identify polymer & substance context
  const polymerKey = inferPolymerMatrix(input);
  const substanceName = migrantNameFa || 'ترکیب شیمیایی مهاجر';
  const casClean = (input.casNumber || '').trim();
  const fcmClean = (input.fcmNumber || '').trim();
  const nameLower = substanceName.toLowerCase();

  const isBpa =
    casClean === '80-05-7' ||
    fcmClean === '151' ||
    nameLower.includes('bpa') ||
    nameLower.includes('bisphenol a') ||
    substanceName.includes('بیسفنول آ');

  const isDehp =
    casClean === '117-81-7' ||
    fcmClean === '283' ||
    nameLower.includes('dehp') ||
    substanceName.includes('دی‌اتیل‌هگزیل فتالات');

  const isCaprolactam =
    casClean === '105-60-2' ||
    fcmClean === '212' ||
    nameLower.includes('caprolactam') ||
    substanceName.includes('کاپرولاکتام');

  const juris = input.jurisdiction || 'EU';
  const regVersion = (input.regulationVersionDate || '').trim();
  const sourceRef = (input.officialSourceReference || '').trim();

  // 2. Specific Migration Computational Estimation (Piringer Model — JRC EUR 27529 EN / EUR 24514 EN)
  let estimatedSpecificMigrationMgPerKg: number | undefined = undefined;
  let isSpecificMigrationCompliant: boolean | undefined = undefined;
  let computationalEstimationStatus: MigrationAssessmentResult['computationalEstimationStatus'] = 'not_applicable';
  let legalComplianceStatus: MigrationAssessmentResult['legalComplianceStatus'] = 'not_applicable';
  let smlStatus: SmlEvaluationStatus = 'not_applicable';
  let piringerParametersUsed: MigrationAssessmentResult['piringerParametersUsed'] = undefined;
  const conditionsWarnings: string[] = [];

  const hasMigrationInput = initialMigrantConcentrationInPolymerMgPerKg > 0 && migrantMolecularWeightGPerMol > 0;

  if (hasMigrationInput) {
    let apPrime: number | null = null;
    let tauK: number | null = null;
    let rhoP: number | null = null;
    let maxTempC = 100;
    let paramSource = '';
    let paramCaveat = '';

    if (input.customPiringerParams) {
      apPrime = input.customPiringerParams.apPrime;
      tauK = input.customPiringerParams.tauK;
      rhoP = input.customPiringerParams.densityGPerCm3;
      maxTempC = input.customPiringerParams.maxTempC ?? 100;
      paramSource = input.customPiringerParams.sourceCitation;
      paramCaveat = 'بر اساس پارامترهای سفارشی مستند واردشده توسط کاربر.';
    } else {
      const spec = PIRINGER_POLYMER_REGISTRY[polymerKey];
      if (spec) {
        apPrime = spec.apPrime;
        tauK = spec.tauK;
        rhoP = spec.densityGPerCm3;
        maxTempC = spec.maxTempC;
        paramSource = spec.source;
        paramCaveat = spec.caveatFa;
      }
    }

    if (apPrime === null || tauK === null || rhoP === null) {
      computationalEstimationStatus = 'unverified_missing_polymer_parameters';
      piringerParametersUsed = {
        polymerKey,
        apPrime: null,
        tauK: null,
        polymerDensityGPerCm3: null,
        parameterSource: 'فاقد پارامتر مستند در جدول JRC EUR 27529 EN',
        applicabilityCaveatFa:
          polymerKey === 'PA6'
            ? 'پلی‌آمید ۶ (PA-6) جاذب رطوبت است و پلاستیسایزاسیون آب موجب افت Tg و تغییر شدید ضریب نفوذ می‌شود؛ لذا بدون پارامتر تجربی معتبر، تخمین پیرینگر تأییدنشده (unverified_missing_polymer_parameters) است و هیچ پارامتر ساختگی تولید نمی‌شود.'
            : `برای ماتریس پلیمری (${polymerKey}) پارامتر معتبر Ap′ و τ در پایگاه مستند JRC موجود نیست؛ برخلاف گذشته مقدار پیش‌فرض Ap=11.5 (LDPE) به این پلیمر تعمیم داده نمی‌شود.`
      };
      smlStatus = 'unverified_missing_polymer_parameters';
      legalComplianceStatus = 'unverified_incomplete_regulatory_data';
      isSpecificMigrationCompliant = undefined;
    } else {
      // Piringer upper-bound equation (JRC EUR 27529 EN, 2015):
      // D_P* [cm²/s] = 10^4 * exp( Ap' - 0.1351 * Mw^(2/3) + 0.003 * Mw - (10454 + tau) / T )
      // Converted to m²/s by multiplying by 1e-4.
      const T = input.testTemperatureC + 273.15;
      const Mw = migrantMolecularWeightGPerMol;
      const dpCm2PerSec = 1e4 * Math.exp(apPrime - 0.1351 * Math.pow(Mw, 2.0 / 3.0) + 0.003 * Mw - (10454.0 + tauK) / T);
      const dpM2PerSec = dpCm2PerSec * 1e-4;

      const tSec = input.testTimeHours * 3600.0;
      const specificMigrantMgPerDm2 =
        2.0 * (initialMigrantConcentrationInPolymerMgPerKg * 1e-3) * rhoP * Math.sqrt((dpCm2PerSec * tSec) / Math.PI);
      estimatedSpecificMigrationMgPerKg = specificMigrantMgPerDm2 * actualSurfaceToVolumeRatio;

      const outOfBounds =
        input.testTemperatureC > maxTempC ||
        initialMigrantConcentrationInPolymerMgPerKg > 10000 ||
        Mw < 30 ||
        Mw > 2000;

      computationalEstimationStatus = outOfBounds ? 'out_of_applicability_bounds' : 'piringer_upper_bound_estimated';
      if (outOfBounds) {
        conditionsWarnings.push(
          `خارج از محدوده کاربرد مدل JRC: دما (${input.testTemperatureC}°C در برابر سقف ${maxTempC}°C)، غلظت اولیه (${initialMigrantConcentrationInPolymerMgPerKg} mg/kg در برابر سقف 10000 mg/kg = 1%) یا وزن مولکولی (${Mw}) خارج از دامنه اعتبار استاندارد است.`
        );
      }

      piringerParametersUsed = {
        polymerKey,
        apPrime,
        tauK,
        polymerDensityGPerCm3: rhoP,
        diffusionCoefficientM2PerSec: dpM2PerSec,
        parameterSource: paramSource,
        applicabilityCaveatFa: paramCaveat
      };
    }
  }

  // 3. Regulatory Rules & Legal Metadata Separation
  let effectiveSml = smlLimitMgPerKg;
  let analyticalLodMgPerKg: number | undefined = undefined;
  let analyticalLodReferenceFa: string | undefined = undefined;
  let effectiveGroupLimit = input.smlGroupLimitMgPerKg;
  let effectiveGroupNo = input.groupRestrictionNumber;

  let groupDehpEquivalentMgPerKg: number | undefined = undefined;
  let group36Status: NonNullable<MigrationAssessmentResult['smlDetails']>['group36Status'] = undefined;
  let group32LimitMgPerKg: number | undefined = undefined;
  let group32TotalPlasticisersMgPerKg: number | undefined = undefined;
  let group32Status: NonNullable<MigrationAssessmentResult['smlDetails']>['group32Status'] = undefined;
  let group4LimitMgPerKg: number | undefined = undefined;
  let group4SumAsCaprolactamMgPerKg: number | undefined = undefined;
  let group4Status: NonNullable<MigrationAssessmentResult['smlDetails']>['group4Status'] = undefined;

  let bpaTransitionalStatus: BpaTransitionalStatus | undefined = undefined;
  let bpaTransitionalNoticeFa: string | undefined = undefined;
  let dehpTransitionalStatus: DehpTransitionalStatus | undefined = undefined;
  let dehpTransitionalNoticeFa: string | undefined = undefined;
  let article4ResidualBpaStatus: 'unverified_not_modeled' | 'not_applicable' | undefined = undefined;

  if (input.isArticle4OtherBisphenolContext) {
    // Article 4 of (EU) 2024/3190 (corrected by (EU) 2026/250 Art. 9(2)(c)):
    // Residual BPA in materials manufactured with other bisphenols / derivatives (e.g. BADGE) is NOT computationally modeled.
    effectiveSml = undefined;
    analyticalLodMgPerKg = 0.001;
    analyticalLodReferenceFa =
      'حد تشخیص تحلیلی (LoD) طبق Article 9(2)(b) و اصلاحیه (EU) 2026/250 در Article 9(2)(c) برای پایش باقیمانده BPA ("residual BPA") در مواد ساخته‌شده با سایر بیسفنول‌ها/مشتقات (Article 4) برابر 0.001 mg/kg (1 µg/kg) است (این مقدار SML عمومی نیست).';
    article4ResidualBpaStatus = 'unverified_not_modeled';
    smlStatus = 'unverified_article4_residual_bpa_not_modeled';
    legalComplianceStatus = 'unverified_article4_residual_bpa_not_modeled';
    isSpecificMigrationCompliant = undefined;
    const transition = evaluateBpaTransitionalProvisions(
      input.bpaArticleType,
      input.firstPlacedOnMarketDate,
      input.assessmentDate
    );
    bpaTransitionalStatus = transition.status;
    bpaTransitionalNoticeFa = transition.noticeFa;
    conditionsWarnings.push(
      'عدم مدلسازی Article 4: بررسی باقیمانده غیرعمدی BPA در مواد ساخته‌شده با سایر بیسفنول‌ها یا مشتقاتی مانند BADGE در این موتور مدلسازی نشده و Unverified است؛ نتیجه انطباق صادر نمی‌شود و آزمون استخراجی با LoD = 0.001 mg/kg (Article 9) الزامی است.'
    );
  } else if (isBpa) {
    // Commission Regulation (EU) 2024/3190 as corrected by Commission Regulation (EU) 2026/250
    // CRITICAL: NEVER assign 0.001 mg/kg to effectiveSml or smlLimitMgPerKg! BPA has NO general SML.
    effectiveSml = undefined;
    analyticalLodMgPerKg = 0.001;
    analyticalLodReferenceFa =
      'حد تشخیص تحلیلی (LoD) روش آزمون برابر 0.001 mg/kg (1 µg/kg) طبق Article 9(2)(b) مقررات (EU) 2024/3190 (با تصحیحیه (EU) 2026/250)؛ این مقدار صرفاً معیار حساسیت روش آزمون آزمایشگاهی است و هرگز به‌عنوان SML عمومی BPA یا حد مهاجرت مجاز تفسیر نمی‌شود.';
    article4ResidualBpaStatus = 'unverified_not_modeled';

    if (smlLimitMgPerKg !== undefined && Math.abs(smlLimitMgPerKg - 0.05) < 1e-6) {
      conditionsWarnings.push(
        'هشدار مقررات منسوخ: حد SML برابر 0.05 mg/kg مربوط به مقررات منسوخ (EU) 2018/213 بود که به‌موجب آیین‌نامه (EU) 2024/3190 (با تصحیحیه (EU) 2026/250) لغو و FCM 151 از جدول ۱ پیوست I مقررات 10/2011 حذف شده است.'
      );
    }

    const transition = evaluateBpaTransitionalProvisions(
      input.bpaArticleType,
      input.firstPlacedOnMarketDate,
      input.assessmentDate
    );
    bpaTransitionalStatus = transition.status;
    bpaTransitionalNoticeFa = transition.noticeFa;
    conditionsWarnings.push(transition.noticeFa);
    conditionsWarnings.push(
      'تبصره Article 4 [(EU) 2024/3190 و (EU) 2026/250]: مدلسازی باقیمانده غیرعمدی BPA در مواد ساخته‌شده با سایر بیسفنول‌ها (نظیر BADGE) در این بخش اجرا نشده و Unverified باقی می‌ماند.'
    );

    const derogation = input.bpaDerogationType || 'none';
    if (derogation === 'none') {
      smlStatus = 'prohibited_intentional_use';
      legalComplianceStatus = 'prohibited_under_eu_2024_3190';
      isSpecificMigrationCompliant = false;
      conditionsWarnings.push(
        'طبق Article 3 مقررات (EU) 2024/3190 (با تصحیحیه (EU) 2026/250)، استفاده عمدی از BPA (CAS 80-05-7) در پلاستیک‌ها، پوشش‌ها، چسب‌ها، جوهرها و لاستیک‌های تماس با غذا ممنوع است. مقدار 0.001 mg/kg (1 µg/kg) در Article 9(2)(b) یک حد تشخیص تحلیلی (LoD) برای راستی‌آزمایی است، نه SML مجاز. استثناهای محدود Annex II صرفاً شامل غشاهای فیلتراسیون پلی‌سولفون و مخازن صنعتی >1000 لیتر با شرط عدم ردیابی و شست‌وشوی پیش‌مصرف هستند.'
      );
    } else {
      // Narrow Annex II derogation: non-detectable migration verified at LoD = 1 µg/kg = 0.001 mg/kg per Article 9(2)(b) + pre-use cleaning
      conditionsWarnings.push(
        `کاربرد تحت استثنای محدود Annex II مقررات (EU) 2024/3190 و تصحیحیه (EU) 2026/250 (${derogation === 'polysulfone_filtration_membrane' ? 'غشای فیلتراسیون پلی‌سولفون' : 'مخزن صنعتی خوداتکا > 1000 لیتر'}): شست‌وشو و فلاشینگ پیش از نخستین تماس غذایی و اثبات آزمایشگاهی «عدم قابلیت ردیابی» با حد تشخیص تحلیلی (LoD) برابر 0.001 mg/kg (1 µg/kg) طبق Article 9(2)(b) الزامی است.`
      );
      if (estimatedSpecificMigrationMgPerKg !== undefined) {
        const belowLod = estimatedSpecificMigrationMgPerKg <= analyticalLodMgPerKg;
        isSpecificMigrationCompliant = belowLod ? undefined : false;
        smlStatus = belowLod ? 'derogated_requires_analytical_nd_verification' : 'derogated_exceeds_detection_limit';
        legalComplianceStatus = 'derogated_subject_to_nd_1ppb';
      } else {
        isSpecificMigrationCompliant = undefined;
        smlStatus = 'derogated_requires_analytical_nd_verification';
        legalComplianceStatus = 'derogated_subject_to_nd_1ppb';
      }
    }
  } else if (isDehp) {
    // Commission Regulation (EU) 2023/1442 (16th Amendment to (EU) No 10/2011) + (EU) 2025/351 (19th Amendment)
    // FCM 283, CAS 117-81-7: SML = 0.6 mg/kg; Group Restriction (32) SML(T) = 60 mg/kg AND Group Restriction (36) SML(T) = 0.6 mg/kg DEHP-eq
    // Column 10: Only to be used as (a) plasticiser in repeated use materials and articles contacting non-fatty foods;
    // (b) technical support agent in concentrations up to 0.1 % (w/w) in the final product.
    const dehpTrans = evaluateDehpTransitionalProvisions(input.firstPlacedOnMarketDate);
    dehpTransitionalStatus = dehpTrans.status;
    dehpTransitionalNoticeFa = dehpTrans.noticeFa;
    conditionsWarnings.push(dehpTrans.noticeFa);

    if (smlLimitMgPerKg !== undefined && Math.abs(smlLimitMgPerKg - 1.5) < 1e-6) {
      conditionsWarnings.push(
        'هشدار مقررات منسوخ: حد SML=1.5 mg/kg پیش از اصلاحیه (EU) 2023/1442 منسوخ شده و به 0.6 mg/kg کاهش یافته است.'
      );
    }
    if (input.smlGroupLimitMgPerKg !== undefined && Math.abs(input.smlGroupLimitMgPerKg - 60.0) < 1e-6) {
      conditionsWarnings.push(
        'توضیح دوگانگی گروه‌های ۳۲ و ۳۶: محدودیت گروهی ۳۲ (SML(T) = 60 mg/kg برای مجموع نرم‌کننده‌ها) همچنان برقرار است، اما جایگزین محدودیت گروهی ۳۶ (SML(T) = 0.6 mg/kg معادل DEHP) نمی‌شود و هر دو گروه باید هم‌زمان و مستقل رعایت شوند.'
      );
    }

    // Independent checks: Role (plasticiser vs technical support agent), Repeated-use, Simulant D1/D2 fatty rules
    const roleKnown = input.isTechnicalSupportAgent !== undefined;
    let useConditionViolated = false;
    let conditionUnverified = false;

    if (!roleKnown) {
      conditionUnverified = true;
      conditionsWarnings.push(
        'نقش کاربردی DEHP (نرم‌کننده طبق بند 10(a) در برابر کمک‌فرآیند فنی طبق بند 10(b)) مشخص نشده است؛ لذا وضعیت شروط کاربرد ستون ۱۰ Unverified است.'
      );
    } else if (input.isTechnicalSupportAgent === true) {
      const pctWByW =
        input.finalProductDehpPercentWByW ??
        (initialMigrantConcentrationInPolymerMgPerKg > 0
          ? initialMigrantConcentrationInPolymerMgPerKg / 10000.0
          : undefined);
      if (pctWByW === undefined) {
        conditionUnverified = true;
        conditionsWarnings.push(
          'در کاربرد کمک‌فرآیند فنی (Technical support agent - بند 10(b))، درصد وزنی DEHP در محصول نهایی (% w/w) برای کنترل سقف 0.1% w/w وارد نشده و Unverified است.'
        );
      } else if (pctWByW > 0.1) {
        useConditionViolated = true;
        conditionsWarnings.push(
          `مغایرت شرط کاربرد بند 10(b) مقررات (EU) 2023/1442: غلظت DEHP به‌عنوان کمک‌فرآیند فنی (${pctWByW.toFixed(4)}% w/w) از سقف مجاز 0.1% w/w (1000 mg/kg) در محصول نهایی فراتر رفته است.`
        );
      }
    } else {
      // Explicit Plasticiser role (Column 10(a))
      if (input.isRepeatedUse === false) {
        useConditionViolated = true;
        conditionsWarnings.push(
          'مغایرت شرط کاربرد بند 10(a) مقررات (EU) 2023/1442: DEHP به‌عنوان نرم‌کننده برای اقلام یک‌بارمصرف (Single-use) ممنوع است و صرفاً در اقلام چندبارمصرف مجاز است.'
        );
      } else if (input.isRepeatedUse === undefined) {
        conditionUnverified = true;
        conditionsWarnings.push(
          'وضعیت یک‌بارمصرف یا چندبارمصرف بودن قلم مشخص نشده است؛ تأیید شرط چندبارمصرف بودن (Column 10(a)) الزامی است (Unverified).'
        );
      }

      if (simulant === 'simulant_D2') {
        useConditionViolated = true;
        conditionsWarnings.push(
          'مغایرت شرط کاربرد بند 10(a) مقررات (EU) 2023/1442: شبیه‌ساز D2 (روغن گیاهی / غذاهای دارای چربی آزاد سطحی طبق Annex III) مجاز نیست؛ DEHP نرم‌کننده صرفاً برای تماس با غذاهای غیرچرب مجاز است.'
        );
      } else if (simulant === 'simulant_D1') {
        const d1Nature = input.d1FoodNature || 'unspecified';
        if (d1Nature === 'dairy_or_emulsion_fatty') {
          useConditionViolated = true;
          conditionsWarnings.push(
            'مغایرت شرط کاربرد بند 10(a) و Annex III: شبیه‌ساز D1 برای لبنیات یا امولسیون‌های روغن-در-آب (دارای فاز چرب) انتخاب شده که با شرط «غذای غیرچرب» برای DEHP مغایرت دارد.'
          );
        } else if (d1Nature === 'unspecified') {
          conditionUnverified = true;
          conditionsWarnings.push(
            'شبیه‌ساز D1 (اتانول ۵۰٪) طبق Annex III مقررات (EU) 10/2011 هم برای نوشیدنی‌های الکلی >20% (غیرچرب) و هم برای لبنیات/امولسیون‌های روغن-در-آب به کار می‌رود و با D2 یکسان نیست؛ چون ماهیت ماده غذایی در D1 مشخص نشده، انطباق شرط غیرچرب بودن Unverified است.'
          );
        }
      }
    }

    if (input.isRepeatedUse === true) {
      conditionsWarnings.push(
        'الزام مقررات (EU) 2025/351 (اصلاحیه نوزدهم 10/2011): برای اقلام چندبارمصرف، رعایت سطح بالای خلوص/ارزیابی NIAS (مواد 3a و 8) و درج دستورالعمل مصرف‌کننده برای جلوگیری از تخریب و فرسایش الزامی است.'
      );
    }

    if (input.isInfantOrYoungChildFood) {
      useConditionViolated = true;
      conditionsWarnings.push(
        'هشدار غذای نوزاد/کودک خردسال: در اصلاحیه (EU) 2023/1442 منع صریح تماس با شیر خشک/غذای نوزاد مستقیماً در ستون ۱۰ ردیف‌های DINP (FCM 728) و DIDP (FCM 729) ذکر شده است؛ برای DEHP (FCM 283) نیز کاربردهای متداول یک‌بارمصرف یا چرب نوزاد طبق بند 10(a) غیرمجاز و مشمول قواعد سخت‌گیرانه (EU) No 609/2013 است.'
      );
    }

    // Simultaneous & Independent Group 36 (SML(T) = 0.6 mg/kg DEHP-eq) AND Group 32 (SML(T) = 60 mg/kg)
    const dbp = input.groupCoMigrantsMgPerKg?.dbp;
    const dibp = input.groupCoMigrantsMgPerKg?.dibp;
    const bbp = input.groupCoMigrantsMgPerKg?.bbp;
    const dehpVal = input.groupCoMigrantsMgPerKg?.dehp ?? estimatedSpecificMigrationMgPerKg;
    const otherG32 = input.groupCoMigrantsMgPerKg?.otherGroup32PlasticisersMgPerKg;

    const hasAllG36CoMigrants =
      dbp !== undefined && dibp !== undefined && bbp !== undefined && dehpVal !== undefined;
    if (input.groupCoMigrantsMgPerKg || estimatedSpecificMigrationMgPerKg !== undefined) {
      groupDehpEquivalentMgPerKg =
        (dbp ?? 0) * 5.0 + (dibp ?? 0) * 4.0 + (bbp ?? 0) * 0.1 + (dehpVal ?? 0) * 1.0;
      if (groupDehpEquivalentMgPerKg > 0.6) {
        group36Status = 'exceeds_0_6';
      } else if (!hasAllG36CoMigrants) {
        group36Status = 'unverified_missing_data';
        conditionsWarnings.push(
          'داده‌های کامل هم‌مهاجرهای Group 36 (مقادیر صریح DBP، DIBP، BBP و DEHP) وارد نشده است؛ لذا کفایت گروه ۳۶ Unverified است.'
        );
      } else {
        group36Status = 'within_limit_0_6';
      }

      group32LimitMgPerKg = 60.0;
      group32TotalPlasticisersMgPerKg =
        (dbp ?? 0) + (dibp ?? 0) + (bbp ?? 0) + (dehpVal ?? 0) + (otherG32 ?? 0);
      if (group32TotalPlasticisersMgPerKg > 60.0) {
        group32Status = 'exceeds_60';
      } else if (otherG32 === undefined || !hasAllG36CoMigrants) {
        group32Status = 'unverified_missing_data';
        conditionsWarnings.push(
          'مقدار سایر نرم‌کننده‌های مشمول Group 32 (نظیر DINP، DIDP، FCM 1078 و غیره در Table 2 با سقف مستقل 60 mg/kg) وارد نشده است؛ لذا وضعیت Group 32 Unverified است.'
        );
      } else {
        group32Status = 'within_limit_60';
      }
    } else {
      group36Status = 'unverified_missing_data';
      group32LimitMgPerKg = 60.0;
      group32Status = 'unverified_missing_data';
    }

    effectiveGroupNo = 'Group Restriction 32 (60 mg/kg) & Group Restriction 36 (0.6 mg/kg DEHP-eq)';

    const group36Exceeded = group36Status === 'exceeds_0_6';
    const group32Exceeded = group32Status === 'exceeds_60';
    const dehpSmlExceeded =
      effectiveSml !== undefined && dehpVal !== undefined && dehpVal > effectiveSml;

    if (group36Exceeded || group32Exceeded || dehpSmlExceeded) {
      smlStatus = 'screening_exceeds_sml';
      legalComplianceStatus = 'non_compliant_screening_exceeded';
      isSpecificMigrationCompliant = false;
    } else if (useConditionViolated) {
      smlStatus = 'restricted_conditions_violated';
      legalComplianceStatus = 'restricted_conditions_violated';
      isSpecificMigrationCompliant = false;
    } else if (smlLimitMgPerKg === undefined) {
      smlStatus = 'unverified_missing_limit';
      legalComplianceStatus = 'unverified_incomplete_regulatory_data';
      isSpecificMigrationCompliant = undefined;
    } else if (
      conditionUnverified ||
      group36Status === 'unverified_missing_data' ||
      group32Status === 'unverified_missing_data'
    ) {
      smlStatus = 'unverified_incomplete_regulatory_metadata';
      legalComplianceStatus = 'unverified_incomplete_regulatory_data';
      isSpecificMigrationCompliant = undefined;
    }
  } else if (isCaprolactam) {
    // Regulation (EU) No 10/2011 Annex I Table 1 (FCM 212, CAS 105-60-2) & Table 2 Group Restriction 4 (FCM 212 + FCM 435)
    // SML(T) = 15 mg/kg expressed as caprolactam.
    group4LimitMgPerKg = 15.0;
    effectiveGroupLimit = 15.0;
    effectiveGroupNo = 'Group Restriction 4 (FCM 212 + FCM 435)';

    if (polymerKey === 'PP') {
      conditionsWarnings.push(
        'یادداشت فنی پلیمر: ε-کاپرولاکتام (FCM 212) مونومر اصلی پلی‌آمید ۶ (PA-6) است نه پلی‌پروپیلن (PP). در مدل آموزشی، بررسی کاپرولاکتام با ماتریس PA-6 انجام می‌شود (هرچند جدول ۱ ستون ۶ استفاده به‌عنوان افزودنی/کمک‌پلیمریزاسیون را نیز درج کرده است).'
      );
    }

    const fcm212Val =
      input.groupCoMigrantsMgPerKg?.fcm212CaprolactamMgPerKg ?? estimatedSpecificMigrationMgPerKg;
    const fcm435Val = input.groupCoMigrantsMgPerKg?.caprolactamSodiumSaltAsCaprolactamMgPerKg;

    if (fcm212Val !== undefined && fcm435Val !== undefined) {
      group4SumAsCaprolactamMgPerKg = fcm212Val + fcm435Val;
      group4Status = group4SumAsCaprolactamMgPerKg <= 15.0 ? 'within_limit_15' : 'exceeds_15';
    } else if (fcm212Val !== undefined && fcm212Val > 15.0) {
      group4SumAsCaprolactamMgPerKg = fcm212Val;
      group4Status = 'exceeds_15';
    } else {
      group4SumAsCaprolactamMgPerKg = fcm212Val;
      group4Status = 'unverified_missing_data';
      conditionsWarnings.push(
        'گروه محدودیت شماره ۴ (EU 10/2011 Annex I Table 2): سقف تجمعی SML(T) = 15 mg/kg بر حسب کاپرولاکتام شامل مجموع کاپرولاکتام (FCM 212) و نمک سدیم کاپرولاکتام (FCM 435) است؛ به دلیل نبود داده مهاجرت FCM 435 یا داده معتبر، وضعیت Group 4 تأییدنشده (Unverified) است.'
      );
    }

    if (group4Status === 'exceeds_15') {
      smlStatus = 'screening_exceeds_sml';
      legalComplianceStatus = 'non_compliant_screening_exceeded';
      isSpecificMigrationCompliant = false;
    } else if (
      group4Status === 'unverified_missing_data' &&
      smlStatus !== 'unverified_missing_polymer_parameters'
    ) {
      // Preserve Piringer single-substance screening indicator if computed (Test 18.8 backward compatibility),
      // while keeping regulatory Group 4 status strictly Unverified!
      if (estimatedSpecificMigrationMgPerKg !== undefined && effectiveSml !== undefined && effectiveSml > 0) {
        isSpecificMigrationCompliant = estimatedSpecificMigrationMgPerKg <= effectiveSml;
      }
      smlStatus = 'unverified_incomplete_regulatory_metadata';
      legalComplianceStatus = 'unverified_incomplete_regulatory_data';
    } else if (
      group4Status === 'within_limit_15' &&
      smlStatus === 'unverified_missing_polymer_parameters' &&
      input.groupCoMigrantsMgPerKg?.fcm212CaprolactamMgPerKg !== undefined
    ) {
      // Lab values supplied for PA-6 where Piringer stays unverified_missing_polymer_parameters:
      const hasFullMetadata = Boolean(casClean && fcmClean && regVersion && sourceRef);
      isSpecificMigrationCompliant = undefined; // No Piringer computational value!
      if (juris === 'INSO') {
        smlStatus = 'unverified_incomplete_regulatory_metadata';
        legalComplianceStatus = 'unverified_inso_full_text_absent';
      } else if (!hasFullMetadata) {
        smlStatus = 'unverified_incomplete_regulatory_metadata';
        legalComplianceStatus = 'unverified_incomplete_regulatory_data';
      } else {
        smlStatus = 'screening_below_sml_unverified_lab';
        legalComplianceStatus = 'requires_en1186_lab_certification';
      }
    }
  }

  // Evaluate standard non-prohibited / non-violated substances when Piringer or limit checks apply
  if (
    smlStatus !== 'prohibited_intentional_use' &&
    smlStatus !== 'restricted_conditions_violated' &&
    smlStatus !== 'derogated_requires_analytical_nd_verification' &&
    smlStatus !== 'derogated_exceeds_detection_limit' &&
    smlStatus !== 'unverified_missing_polymer_parameters' &&
    smlStatus !== 'unverified_incomplete_regulatory_metadata' &&
    smlStatus !== 'unverified_article4_residual_bpa_not_modeled' &&
    smlStatus !== 'screening_exceeds_sml'
  ) {
    if (hasMigrationInput && estimatedSpecificMigrationMgPerKg !== undefined) {
      if (effectiveSml === undefined || effectiveSml <= 0) {
        isSpecificMigrationCompliant = undefined;
        smlStatus = 'unverified_missing_limit';
        legalComplianceStatus = 'unverified_incomplete_regulatory_data';
      } else {
        const valueToCheckGroup =
          groupDehpEquivalentMgPerKg ?? group4SumAsCaprolactamMgPerKg ?? estimatedSpecificMigrationMgPerKg;
        let compliant = estimatedSpecificMigrationMgPerKg <= effectiveSml;
        if (effectiveGroupLimit !== undefined && effectiveGroupLimit > 0) {
          compliant = compliant && valueToCheckGroup <= effectiveGroupLimit;
        }
        if (group32LimitMgPerKg !== undefined && group32TotalPlasticisersMgPerKg !== undefined) {
          compliant = compliant && group32TotalPlasticisersMgPerKg <= group32LimitMgPerKg;
        }
        isSpecificMigrationCompliant = compliant;

        const hasFullMetadata = Boolean(casClean && fcmClean && regVersion && sourceRef);

        if (!compliant) {
          smlStatus = 'screening_exceeds_sml';
          legalComplianceStatus = 'non_compliant_screening_exceeded';
        } else if (juris === 'INSO') {
          smlStatus = 'unverified_incomplete_regulatory_metadata';
          legalComplianceStatus = 'unverified_inso_full_text_absent';
        } else if (!hasFullMetadata) {
          smlStatus = 'unverified_incomplete_regulatory_metadata';
          legalComplianceStatus = 'unverified_incomplete_regulatory_data';
        } else {
          // NOTE: Even with full metadata and passing Piringer screening, NEVER emit 'verified_compliant'!
          // Piringer screening cannot substitute laboratory EN 1186 / official DoC verification.
          smlStatus = 'screening_below_sml_unverified_lab';
          legalComplianceStatus = 'requires_en1186_lab_certification';
        }
      }
    }
  }

  let smlDetails: MigrationAssessmentResult['smlDetails'] = undefined;
  if (hasMigrationInput || isBpa || isDehp || isCaprolactam || input.isArticle4OtherBisphenolContext) {
    let regulatoryVerdictFa = '';
    if (smlStatus === 'prohibited_intentional_use') {
      regulatoryVerdictFa = `ممنوعیت مصرف عمدی طبق (EU) 2024/3190 با تصحیحیه (EU) 2026/250: استفاده عمدی از ${substanceName} در مواد تماس با غذا مجاز نیست (مقدار 0.001 mg/kg صرفاً LoD تحلیلی Article 9(2)(b) است، نه SML).`;
    } else if (smlStatus === 'unverified_article4_residual_bpa_not_modeled') {
      regulatoryVerdictFa = `تأییدنشده (Article 4 مدلسازی نشده): پایش باقیمانده غیرعمدی BPA در مواد ساخته‌شده با سایر بیسفنول‌ها یا مشتقات (مانند BADGE) در موتور محاسباتی مدلسازی نشده و نیازمند آزمون استخراجی با LoD = 0.001 mg/kg است.`;
    } else if (smlStatus === 'restricted_conditions_violated') {
      regulatoryVerdictFa = `عدم انطباق با محدودیت‌های کاربرد و شرایط تماس در آیین‌نامه جاری اتحادیه اروپا برای ${substanceName}.`;
    } else if (smlStatus === 'derogated_requires_analytical_nd_verification') {
      regulatoryVerdictFa = `کاربرد تحت استثنای محدود Annex II مقررات (EU) 2024/3190 با تصحیحیه (EU) 2026/250: شست‌وشوی پیش‌مصرف و آزمون آزمایشگاهی عدم ردیابی با حد تشخیص تحلیلی LoD = 0.001 mg/kg (1 µg/kg) طبق Article 9(2)(b) الزامی است.`;
    } else if (smlStatus === 'derogated_exceeds_detection_limit') {
      regulatoryVerdictFa = `عدم انطباق تحت استثنای Annex II: برآورد محاسباتی از حد تشخیص تحلیلی LoD = 0.001 mg/kg (1 µg/kg) طبق Article 9(2)(b) فراتر رفته است.`;
    } else if (smlStatus === 'unverified_missing_polymer_parameters') {
      regulatoryVerdictFa = `تأییدنشده (فاقد پارامتر معتبر پلیمری): برای پلیمر ${polymerKey} پارامتر معتبر در جدول JRC EUR 27529 EN موجود نیست؛ بنابراین تخمین پیرینگر و انطباق قانونی بدون داده آزمایشگاهی معتبر قابل استناد نیست.`;
    } else if (smlStatus === 'unverified_missing_limit') {
      regulatoryVerdictFa = `تأییدنشده (فاقد حد قانونی SML): حد اختصاصی SML برای ماده ${substanceName} ارائه نشده است.`;
    } else if (smlStatus === 'unverified_incomplete_regulatory_metadata') {
      regulatoryVerdictFa = `تأییدنشده از نظر اسناد/داده‌های قانونی (Unverified): یکی از داده‌های الزامی شناسنامه، شرایط کاربرد (نقش/D1/دوره انتقالی)، یا هم‌مهاجرهای گروهی (گروه ۳۲/۳۶ یا گروه ۴ شامل FCM 435) یا متن کامل INSO 13740 کامل نیست.`;
    } else if (smlStatus === 'screening_exceeds_sml') {
      regulatoryVerdictFa = `عدم انطباق در غربالگری: مقدار مهاجرت تکی یا تجمعی گروهی از سقف SML یا SML(T) (گروه ۳۶ / گروه ۳۲ / گروه ۴) فراتر رفته است.`;
    } else if (smlStatus === 'screening_below_sml_unverified_lab') {
      regulatoryVerdictFa = `زیر سقف عددی (نیازمند گواهی آزمایشگاهی EN 1186 و DoC): غربالگری محاسباتی یا مقادیر واردشده زیر سقف مجاز است، اما شبیه‌سازی پیرینگر به‌تنهایی مجوز انطباق قانونی قطعی نیست.`;
    }

    smlDetails = {
      substanceName,
      casNumber: casClean || undefined,
      fcmNumber: fcmClean || undefined,
      smlLimitMgPerKg: isBpa || input.isArticle4OtherBisphenolContext ? undefined : effectiveSml,
      analyticalLodMgPerKg,
      analyticalLodReferenceFa,
      smlGroupLimitMgPerKg: effectiveGroupLimit,
      groupRestrictionNumber: effectiveGroupNo,
      groupDehpEquivalentMgPerKg,
      group36Status,
      group32LimitMgPerKg,
      group32TotalPlasticisersMgPerKg,
      group32Status,
      group4LimitMgPerKg,
      group4SumAsCaprolactamMgPerKg,
      group4Status,
      bpaTransitionalStatus,
      bpaTransitionalNoticeFa,
      dehpTransitionalStatus,
      dehpTransitionalNoticeFa,
      article4ResidualBpaStatus,
      estimatedMigrationMgPerKg: estimatedSpecificMigrationMgPerKg,
      regulationVersionDate: regVersion || 'تعیین‌نشده (نیازمند درج نسخه معتبر)',
      officialSourceReference: sourceRef || 'تعیین‌نشده (نیازمند منبع رسمی)',
      jurisdiction: juris,
      regulatoryVerdictFa,
      conditionsOfUseWarningsFa: conditionsWarnings.length > 0 ? conditionsWarnings : undefined
    };
  }

  const legalStandardReference =
    juris === 'INSO'
      ? 'استاندارد ملی ایران INSO 13740 (وضعیت متن کامل ضمائم: Unverified در مخزن) / مرجع اتحادیه اروپا: Regulation (EU) No 10/2011 ((EU) 2023/1442، (EU) 2025/351) و (EU) 2024/3190 ((EU) 2026/250)'
      : 'مقررات کمیسیون اروپا (EU) No 10/2011 با اصلاحات (EU) 2023/1442 (فتالات‌ها) و (EU) 2025/351 (خلوص/NIAS) و آیین‌نامه (EU) 2024/3190 با تصحیحیه (EU) 2026/250 (ممنوعیت BPA)';
  const regulatoryNoticeFa =
    'اطلاعیه قانونی: وضعیت محاسباتی (مدل غربالگری پیرینگر JRC EUR 27529 EN) و وضعیت انطباق قانونی از یکدیگر تفکیک شده‌اند. تخمین پیرینگر به‌تنهایی مجوز صدور گواهی انطباق نیست و تأیید رسمی منوط به آزمون‌های آزمایشگاهی EN 1186، پایش NIAS و بررسی متن کامل مقررات جاری است.';
  const formulaLatex = 'OM = \\frac{m_{\\text{residue}}}{A} \\quad [\\text{mg/dm}^2], \\quad D_P^* = 10^4\\exp\\left(A_P^{\\prime} - 0.1351 M_r^{2/3} + 0.003 M_r - \\frac{10454 + \\tau}{T}\\right)';

  return {
    overallMigrationMgPerDm2,
    overallMigrationMgPerKgFood,
    isOverallMigrationCompliant,
    overallMigrationStandardLimitMgPerDm2: standardLimitMgPerDm2,
    overallMigrationStandardLimitMgPerKg: standardLimitMgPerKg,
    estimatedSpecificMigrationMgPerKg,
    isSpecificMigrationCompliant,
    computationalEstimationStatus,
    legalComplianceStatus,
    piringerParametersUsed,
    smlStatus,
    smlDetails,
    legalStandardReference,
    regulatoryNoticeFa,
    formulaLatex
  };
}
