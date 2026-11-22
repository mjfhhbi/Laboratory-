import {
  DValueCalculationResult,
  ZValueCalculationResult,
  FValueCalculationResult,
  ThermalIntegrationResult,
  TimeTemperaturePoint,
  CookValueResult,
  ThermalProcessCategory,
  InputTimeUnit,
  ProcessTimeDiscretizationConfig
} from './types';

export interface ProcessDiscretizationStandard {
  category: ThermalProcessCategory;
  nameFa: string;
  criticalGapThresholdMinutes: number; // max allowable gap before high error warning
  adequateGapThresholdMinutes: number; // threshold for adequate sampling
  recommendedTimeStepSeconds: number;
  typicalDurationRangeFa: string;
  scientificCitation: string;
  regulatoryStandardFa: string;
}

export const PROCESS_DISCRETIZATION_STANDARDS: Record<ThermalProcessCategory, ProcessDiscretizationStandard> = {
  uht_aseptic: {
    category: 'uht_aseptic',
    nameFa: 'استریلیزاسیون دمای بسیار بالا (UHT اسپتیک)',
    criticalGapThresholdMinutes: 1.5 / 60.0, // 1.5 seconds (0.025 min)
    adequateGapThresholdMinutes: 0.5 / 60.0, // 0.5 seconds
    recommendedTimeStepSeconds: 0.2,
    typicalDurationRangeFa: '۲ الی ۱۵ ثانیه (۱۳۵ تا ۱۵۰ درجه سلسیوس)',
    scientificCitation: 'Lewis, M., & Heppell, N. (2000). Continuous Thermal Processing of Foods, Aspen Publishers.',
    regulatoryStandardFa: 'پیشنهاد مهندسی نرم‌افزار / آستانه هشدار شکاف زمانی؛ در شیب‌های شدید (>۲۰°C/s)، فاصله بیش از ۱.۵ ثانیه خطای ذوزنقه‌ای را به شدت تشدید می‌کند (تضمین‌کننده دقت نهایی نیست).'
  },
  htst: {
    category: 'htst',
    nameFa: 'پاستوریزاسیون دمای بالا زمان کوتاه (HTST)',
    criticalGapThresholdMinutes: 5.0 / 60.0, // 5.0 seconds (0.0833 min)
    adequateGapThresholdMinutes: 2.0 / 60.0, // 2.0 seconds
    recommendedTimeStepSeconds: 1.0,
    typicalDurationRangeFa: '۱۵ الی ۳۰ ثانیه (۷۲ تا ۸۵ درجه سلسیوس)',
    scientificCitation: 'Toledo, R.T. (2007). Fundamentals of Food Process Engineering (3rd Ed.), Ch. 7; FDA PMO (2019).',
    regulatoryStandardFa: 'توصیه مهندسی بر پایه زمان اقامت لوله نگهداری FDA PMO؛ آستانه ۵ ثانیه سقف هشدار شکاف است و دقت بهینه نیازمند گام ۱ ثانیه است.'
  },
  continuous_tube: {
    category: 'continuous_tube',
    nameFa: 'فرآیند پیوسته لوله‌ای / مبدل حرارتی جریان پیوسته',
    criticalGapThresholdMinutes: 20.0 / 60.0, // 20.0 seconds (0.333 min)
    adequateGapThresholdMinutes: 8.0 / 60.0, // 8.0 seconds
    recommendedTimeStepSeconds: 5.0,
    typicalDurationRangeFa: '۳۰ ثانیه الی ۵ دقیقه',
    scientificCitation: 'Holdsworth, S.D., & Simpson, R. (2008). Thermal Processing of Packaged Foods (2nd Ed.). Springer.',
    regulatoryStandardFa: 'پارامتر پیشنهادی مهندسی نرم‌افزار بر پایه روابط جریان لوله‌ای؛ استاندارد الزام‌آور قانونی با این مقدار وجود ندارد.'
  },
  batch_retort: {
    category: 'batch_retort',
    nameFa: 'اتوکلاو صنعتی دسته‌ای سنتی (Batch Still Retort)',
    criticalGapThresholdMinutes: 5.0, // 5.0 minutes
    adequateGapThresholdMinutes: 2.0, // 2.0 minutes
    recommendedTimeStepSeconds: 60.0,
    typicalDurationRangeFa: '۲۰ الی ۱۲۰ دقیقه (۱۱۵ تا ۱۲۵ درجه سلسیوس)',
    scientificCitation: 'Stumbo, C.R. (1973). Thermobacteriology, Academic Press; US FDA 21 CFR §113.83; IFTPS Protocol (1992).',
    regulatoryStandardFa: 'آستانه هشدار انحراف زمانی؛ فاصله ثبت صنعتی طبق پروتکل IFTPS حداکثر ۱ دقیقه توصیه می‌شود و ۵ دقیقه سقف هشدار خطای عددی است.'
  },
  in_container: {
    category: 'in_container',
    nameFa: 'استریلیزاسیون درون بسته‌بندی با اینرسی بالا (In-Container)',
    criticalGapThresholdMinutes: 5.0, // 5.0 minutes
    adequateGapThresholdMinutes: 2.0, // 2.0 minutes
    recommendedTimeStepSeconds: 60.0,
    typicalDurationRangeFa: '۳۰ الی ۱۸۰ دقیقه',
    scientificCitation: 'Ball, C.O., & Olson, F.C.W. (1957). Sterilization in Food Technology. McGraw-Hill.',
    regulatoryStandardFa: 'پارامتر پیشنهادی مهندسی نرم‌افزار برای قوطی‌های با انتقال حرارت هدایتی کند (آستانه هشدار).'
  }
};


/**
 * 1. Compute D-value (Decimal Reduction Time)
 * D is the time in minutes at a given temperature to reduce microbial population by 90% (1 log cycle).
 * Formula: D = t / [log10(N0) - log10(Nt)]
 */
export function calculateDValue(
  initialCountN0: number,
  survivorCountNt: number,
  processTimeMinutes: number
): DValueCalculationResult {
  if (initialCountN0 <= 0 || survivorCountNt <= 0) {
    throw new Error('تعداد میکروارگانیسم اولیه و باقیمانده باید مقادیر مثبت بزرگتر از صفر باشند.');
  }
  if (survivorCountNt >= initialCountN0) {
    throw new Error('تعداد میکروارگانیسم باقیمانده (Nt) باید کمتر از مقدار اولیه (N0) باشد.');
  }
  if (processTimeMinutes <= 0) {
    throw new Error('زمان فرآیند باید مقداری مثبت باشد.');
  }

  const logN0 = Math.log10(initialCountN0);
  const logNt = Math.log10(survivorCountNt);
  const logReduction = logN0 - logNt;
  const dValue = processTimeMinutes / logReduction;
  const k1 = Math.LN10 / dValue; // k1 = 2.3026 / D

  const formulaLatex = 'D = \\frac{t}{\\log_{10}(N_0) - \\log_{10}(N_t)} = \\frac{t}{\\Delta \\log N}';
  const substitutionLatex = `D = \\frac{${processTimeMinutes.toFixed(2)}}{\\log_{10}(${initialCountN0.toExponential(2)}) - \\log_{10}(${survivorCountNt.toExponential(2)})} = \\frac{${processTimeMinutes.toFixed(2)}}{${logN0.toFixed(2)} - ${logNt.toFixed(2)}} = ${dValue.toFixed(3)}\\text{ min}`;

  return {
    dValue,
    initialCountN0,
    survivorCountNt,
    processTimeMinutes,
    logReduction,
    k1Constant: k1,
    formulaLatex,
    substitutionLatex
  };
}

/**
 * 2. Compute D-value from Linear Regression of Survivor Curve (t vs log10(N))
 * Slope = -1 / D  =>  D = -1 / Slope
 */
export function calculateDValueFromRegression(
  timePoints: number[],
  countPoints: number[]
): DValueCalculationResult {
  if (timePoints.length !== countPoints.length || timePoints.length < 2) {
    throw new Error('برای برازش رگرسیون حداقل به ۲ نقطه تجربی معتبر زمان و شمارش نیاز است.');
  }

  const validPairs: { t: number; logN: number }[] = [];
  for (let i = 0; i < timePoints.length; i++) {
    if (countPoints[i] > 0) {
      validPairs.push({ t: timePoints[i], logN: Math.log10(countPoints[i]) });
    }
  }

  if (validPairs.length < 2) {
    throw new Error('داده‌های معتبر کافی (N > 0) برای رگرسیون لگاریتمی موجود نیست.');
  }

  const n = validPairs.length;
  let sumT = 0;
  let sumLogN = 0;
  let sumT2 = 0;
  let sumTLogN = 0;

  validPairs.forEach(p => {
    sumT += p.t;
    sumLogN += p.logN;
    sumT2 += p.t * p.t;
    sumTLogN += p.t * p.logN;
  });

  const slope = (n * sumTLogN - sumT * sumLogN) / (n * sumT2 - sumT * sumT);
  const intercept = (sumLogN - slope * sumT) / n;

  // Compute R^2
  const meanLogN = sumLogN / n;
  let ssTot = 0;
  let ssRes = 0;
  validPairs.forEach(p => {
    const fitted = slope * p.t + intercept;
    ssTot += Math.pow(p.logN - meanLogN, 2);
    ssRes += Math.pow(p.logN - fitted, 2);
  });
  const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 1.0;

  if (slope >= 0) {
    throw new Error('شیب خط بقا مثبت یا صفر است؛ تخریب حرارتی مشاهده نشد.');
  }

  const dValue = -1.0 / slope;
  const k1 = Math.LN10 / dValue;
  const totalTime = validPairs[validPairs.length - 1].t - validPairs[0].t;
  const n0Estimate = Math.pow(10, intercept);
  const ntEstimate = Math.pow(10, slope * validPairs[validPairs.length - 1].t + intercept);

  return {
    dValue,
    initialCountN0: n0Estimate,
    survivorCountNt: ntEstimate,
    processTimeMinutes: totalTime,
    logReduction: (Math.log10(n0Estimate) - Math.log10(ntEstimate)),
    k1Constant: k1,
    regressionR2: r2,
    formulaLatex: '\\text{Slope} = -\\frac{1}{D} \\implies D = -\\frac{1}{\\text{Slope}}, \\quad \\log_{10}(N) = \\log_{10}(N_0) - \\frac{t}{D}',
    substitutionLatex: `\\text{Slope} = ${slope.toFixed(4)}, \\quad D = -\\frac{1}{${slope.toFixed(4)}} = ${dValue.toFixed(3)}\\text{ min}, \\quad R^2 = ${r2.toFixed(4)}`
  };
}

/**
 * 3. Compute z-value (Thermal Resistance Constant)
 * z is the temperature change in °C required for a 10-fold change in D-value (1 log cycle of D).
 * Formula: z = (T2 - T1) / [log10(D1) - log10(D2)]
 */
export function calculateZValue(
  temp1C: number,
  dValue1Min: number,
  temp2C: number,
  dValue2Min: number
): ZValueCalculationResult {
  if (temp1C === temp2C) {
    throw new Error('دماهای T1 و T2 باید متفاوت باشند.');
  }
  if (dValue1Min <= 0 || dValue2Min <= 0) {
    throw new Error('مقادیر D باید اعدادی مثبت باشند.');
  }

  // Ensure T2 > T1 and D1 > D2 (higher temp -> lower D)
  let tLow = temp1C;
  let dHigh = dValue1Min;
  let tHigh = temp2C;
  let dLow = dValue2Min;

  if (temp1C > temp2C) {
    tLow = temp2C;
    dHigh = dValue2Min;
    tHigh = temp1C;
    dLow = dValue1Min;
  }

  const logD1 = Math.log10(dHigh);
  const logD2 = Math.log10(dLow);
  const deltaLogD = logD1 - logD2;

  if (deltaLogD <= 0) {
    throw new Error('در دمای بالاتر، زمان D باید کاهش یابد (D2 < D1).');
  }

  const zValue = (tHigh - tLow) / deltaLogD;

  const formulaLatex = 'z = \\frac{T_2 - T_1}{\\log_{10}(D_1) - \\log_{10}(D_2)} = \\frac{\\Delta T}{\\Delta \\log D}';
  const substitutionLatex = `z = \\frac{${tHigh.toFixed(1)} - ${tLow.toFixed(1)}}{\\log_{10}(${dHigh.toFixed(3)}) - \\log_{10}(${dLow.toFixed(3)})} = \\frac{${(tHigh - tLow).toFixed(1)}}{${logD1.toFixed(3)} - ${logD2.toFixed(3)}} = ${zValue.toFixed(2)}^\\circ\\text{C}`;

  return {
    zValue,
    temp1C: tLow,
    dValue1Min: dHigh,
    temp2C: tHigh,
    dValue2Min: dLow,
    formulaLatex,
    substitutionLatex
  };
}

/**
 * 4. Compute F-value (Sterilization / Process Lethality Value)
 * F = D_ref * [log10(N0) - log10(Nt)] = m * D_ref
 */
export function calculateFValue(
  referenceDValueMin: number,
  targetLogReductionM: number,
  referenceTempC: number = 121.1,
  zValueC: number = 10.0,
  organismName: string = 'Clostridium botulinum'
): FValueCalculationResult {
  if (referenceDValueMin <= 0 || targetLogReductionM <= 0) {
    throw new Error('مقادیر D مرجع و تعداد سیکل‌های لگاریتمی کاهش (m) باید مثبت باشند.');
  }

  const fValue = referenceDValueMin * targetLogReductionM;
  const isBotulinumCook12D = targetLogReductionM === 12 && Math.abs(referenceTempC - 121.1) < 0.2;

  const formulaLatex = 'F_T^z = D_{T_{ref}} \\times (\\log_{10} N_0 - \\log_{10} N_t) = m \\times D_{T_{ref}}';
  const substitutionLatex = `F_{${referenceTempC.toFixed(1)}}^{${zValueC.toFixed(1)}} = ${targetLogReductionM} \\times ${referenceDValueMin.toFixed(3)}\\text{ min} = ${fValue.toFixed(3)}\\text{ min}`;

  return {
    fValue,
    targetLogReduction: targetLogReductionM,
    referenceDValue: referenceDValueMin,
    referenceTemperatureC: referenceTempC,
    zValueC,
    targetMicroorganism: organismName,
    isBotulinumCook12D,
    formulaLatex,
    substitutionLatex
  };
}

/**
 * 5. Compute Bigelow Lethal Rate at a given temperature
 * L(T) = 10^((T - Tref) / z)
 */
export function computeBigelowLethalRate(
  temperatureC: number,
  referenceTempC: number = 121.1,
  zValueC: number = 10.0
): number {
  return Math.pow(10, (temperatureC - referenceTempC) / zValueC);
}

/**
 * 6. Compute Thermal Death Time (TDT)
 * Time required at temperature T to deliver the equivalent lethality of F_ref:
 * TDT(T) = F_ref * 10^((Tref - T) / z)
 */
export function calculateThermalDeathTime(
  fRefMinutes: number,
  targetTempC: number,
  referenceTempC: number = 121.1,
  zValueC: number = 10.0
): { tdtMinutes: number; formulaLatex: string; substitutionLatex: string } {
  const tdt = fRefMinutes * Math.pow(10, (referenceTempC - targetTempC) / zValueC);
  const formulaLatex = '\\text{TDT}(T) = F_{ref} \\times 10^{\\frac{T_{ref} - T}{z}}';
  const substitutionLatex = `\\text{TDT}(${targetTempC}^\\circ\\text{C}) = ${fRefMinutes.toFixed(2)} \\times 10^{\\frac{${referenceTempC} - ${targetTempC}}{${zValueC}}} = ${tdt.toFixed(2)}\\text{ min}`;
  return { tdtMinutes: tdt, formulaLatex, substitutionLatex };
}

/**
 * 7. Integrate Product Time-Temperature History (General Method & Simpson's 1/3 Rule)
 * F_total = \int_0^t L(T(t)) dt
 */
export function integrateThermalHistory(
  rawPoints: TimeTemperaturePoint[],
  referenceTempC: number = 121.1,
  zValueC: number = 10.0,
  targetFRequired: number = 2.52,
  organismName: string = 'Clostridium botulinum',
  config?: Partial<ProcessTimeDiscretizationConfig>
): ThermalIntegrationResult {
  if (!rawPoints || rawPoints.length < 2) {
    throw new Error('برای انتگرال‌گیری نفوذ حرارتی حداقل به ۲ نقطه زمانی-دمایی نیاز است.');
  }

  const category: ThermalProcessCategory = config?.processCategory ?? 'batch_retort';
  const unit: InputTimeUnit = config?.inputTimeUnit ?? 'minutes';
  const standard = PROCESS_DISCRETIZATION_STANDARDS[category] ?? PROCESS_DISCRETIZATION_STANDARDS.batch_retort;

  const criticalGapThresholdMinutes = config?.customMaxAllowedGapMinutes !== undefined && config.customMaxAllowedGapMinutes > 0
    ? config.customMaxAllowedGapMinutes
    : standard.criticalGapThresholdMinutes;

  const adequateGapThresholdMinutes = config?.customMaxAllowedGapMinutes !== undefined && config.customMaxAllowedGapMinutes > 0
    ? config.customMaxAllowedGapMinutes * 0.4
    : standard.adequateGapThresholdMinutes;

  // Convert raw points time to minutes
  const timeFactor = unit === 'seconds' ? (1.0 / 60.0) : (unit === 'hours' ? 60.0 : 1.0);
  const normalizedPoints = rawPoints.map(p => ({
    timeMinutes: p.timeMinutes * timeFactor,
    temperatureC: p.temperatureC
  }));

  // Sort by time ascending
  const points = [...normalizedPoints].sort((a, b) => a.timeMinutes - b.timeMinutes);

  // Compute lethal rate for each point
  const pointsWithL: TimeTemperaturePoint[] = points.map(p => ({
    timeMinutes: p.timeMinutes,
    temperatureC: p.temperatureC,
    lethalRate: computeBigelowLethalRate(p.temperatureC, referenceTempC, zValueC),
    cumulativeLethality: 0
  }));

  // Find max temperature and phases
  let maxT = -Infinity;
  let maxIdx = 0;
  pointsWithL.forEach((p, idx) => {
    if (p.temperatureC > maxT) {
      maxT = p.temperatureC;
      maxIdx = idx;
    }
  });

  // Trapezoidal Integration & Rate of Change
  let totalFTrapezoidal = 0;
  let fHeating = 0;
  let fHolding = 0;
  let fCooling = 0;
  let maxRateOfChangeCPerMin = 0;

  pointsWithL[0].cumulativeLethality = 0;

  for (let i = 0; i < pointsWithL.length - 1; i++) {
    const p1 = pointsWithL[i];
    const p2 = pointsWithL[i + 1];
    const dt = p2.timeMinutes - p1.timeMinutes;
    if (dt <= 0) continue;

    const rateOfChange = Math.abs(p2.temperatureC - p1.temperatureC) / dt;
    if (rateOfChange > maxRateOfChangeCPerMin) {
      maxRateOfChangeCPerMin = rateOfChange;
    }

    const avgL = ((p1.lethalRate ?? 0) + (p2.lethalRate ?? 0)) / 2.0;
    const deltaF = avgL * dt;
    totalFTrapezoidal += deltaF;
    p2.cumulativeLethality = totalFTrapezoidal;

    // Assign to phase
    const avgTemp = (p1.temperatureC + p2.temperatureC) / 2.0;
    if (i < maxIdx && avgTemp < maxT - 1.5) {
      fHeating += deltaF;
    } else if (Math.abs(avgTemp - maxT) <= 1.5) {
      fHolding += deltaF;
    } else {
      fCooling += deltaF;
    }
  }

  // Simpson's 1/3 Rule (Resample evenly with 100 subintervals)
  const N_SIMPSON = 100;
  const tStart = points[0].timeMinutes;
  const tEnd = points[points.length - 1].timeMinutes;
  const totalDuration = tEnd - tStart;
  const h = totalDuration / N_SIMPSON;

  const getTempAtT = (t: number): number => {
    if (t <= points[0].timeMinutes) return points[0].temperatureC;
    if (t >= points[points.length - 1].timeMinutes) return points[points.length - 1].temperatureC;
    for (let i = 0; i < points.length - 1; i++) {
      if (t >= points[i].timeMinutes && t <= points[i + 1].timeMinutes) {
        const frac = (t - points[i].timeMinutes) / (points[i + 1].timeMinutes - points[i].timeMinutes);
        return points[i].temperatureC + frac * (points[i + 1].temperatureC - points[i].temperatureC);
      }
    }
    return points[points.length - 1].temperatureC;
  };

  const L0 = computeBigelowLethalRate(getTempAtT(tStart), referenceTempC, zValueC);
  const LN = computeBigelowLethalRate(getTempAtT(tEnd), referenceTempC, zValueC);
  let simpsonSum = L0 + LN;

  for (let i = 1; i < N_SIMPSON; i++) {
    const tCurrent = tStart + i * h;
    const lCurrent = computeBigelowLethalRate(getTempAtT(tCurrent), referenceTempC, zValueC);
    if (i % 2 === 1) {
      simpsonSum += 4 * lCurrent;
    } else {
      simpsonSum += 2 * lCurrent;
    }
  }
  const totalFSimpson = (h / 3.0) * simpsonSum;

  const diffPct = totalFSimpson > 0
    ? (Math.abs(totalFTrapezoidal - totalFSimpson) / totalFSimpson) * 100
    : 0;

  const isAdequate = totalFTrapezoidal >= targetFRequired;
  const safetyMargin = targetFRequired > 0
    ? ((totalFTrapezoidal - targetFRequired) / targetFRequired) * 100
    : 0;

  // Gap Analysis & Dynamic Process-Aware Discretization Audit
  const dtList: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const dt = points[i + 1].timeMinutes - points[i].timeMinutes;
    if (dt > 0) dtList.push(dt);
  }
  const maxDt = dtList.length > 0 ? Math.max(...dtList) : 0;
  const meanDt = dtList.length > 0 ? dtList.reduce((a, b) => a + b, 0) / dtList.length : 0;

  let timeDiscretizationQuality: 'excellent' | 'adequate' | 'large_gap_warning' = 'excellent';
  let discretizationWarningFa: string | undefined = undefined;

  // Format helper for gap presentation
  const formatGap = (gapMinutes: number) => {
    if (gapMinutes < 1.0) {
      return `${(gapMinutes * 60).toFixed(1)} ثانیه (${gapMinutes.toFixed(4)} دقیقه)`;
    }
    return `${gapMinutes.toFixed(2)} دقیقه`;
  };

  if (maxDt > criticalGapThresholdMinutes) {
    timeDiscretizationQuality = 'large_gap_warning';
    discretizationWarningFa = `هشدار گسسته‌سازی زمانی (${standard.nameFa} - آستانه هشدار پیشنهادی نرم‌افزار): حداکثر گام زمانی ثبت‌شده (${formatGap(maxDt)}) از آستانه هشدار مهندسی این فرآیند (${formatGap(criticalGapThresholdMinutes)}) فراتر رفته است. شیب دمایی تند موجب خطای غیرخطی انتگرال‌گیری ذوزنقه‌ای می‌شود (این آستانه تضمین‌کننده دقت نهایی نیست). مرجع پیشنهادی: ${standard.scientificCitation}. انتگرال سیمپسون ۱۰۰ گام جهت اعتبارسنجی مقایسه‌ای لحاظ شد.`;
  } else if (maxDt > adequateGapThresholdMinutes) {
    timeDiscretizationQuality = 'adequate';
  }

  // Sensitivity Analysis: compute F with half density (subsampled every 2nd point)
  let totalFSub = 0;
  if (points.length >= 4) {
    const subPoints = points.filter((_, idx) => idx % 2 === 0 || idx === points.length - 1);
    for (let i = 0; i < subPoints.length - 1; i++) {
      const dtSub = subPoints[i + 1].timeMinutes - subPoints[i].timeMinutes;
      const l1 = computeBigelowLethalRate(subPoints[i].temperatureC, referenceTempC, zValueC);
      const l2 = computeBigelowLethalRate(subPoints[i + 1].temperatureC, referenceTempC, zValueC);
      totalFSub += ((l1 + l2) / 2.0) * dtSub;
    }
  } else {
    totalFSub = totalFTrapezoidal;
  }
  const sensitivityPct = totalFTrapezoidal > 0
    ? (Math.abs(totalFTrapezoidal - totalFSub) / totalFTrapezoidal) * 100
    : 0;

  // Realistic sensor precision (sensors typically ±0.5°C => ~±5% on F0)
  const f0ReportedRounded = Math.round(totalFTrapezoidal * 100) / 100;
  const sensorToleranceMin = Math.round(Math.max(0.05, totalFTrapezoidal * 0.05) * 100) / 100;

  return {
    totalFValueTrapezoidal: totalFTrapezoidal,
    totalFValueSimpson: totalFSimpson,
    differencePercent: diffPct,
    processCategory: category,
    inputTimeUnit: unit,
    criticalGapThresholdMinutes: Math.round(criticalGapThresholdMinutes * 10000) / 10000,
    maxTimeStepMinutes: Math.round(maxDt * 10000) / 10000,
    meanTimeStepMinutes: Math.round(meanDt * 10000) / 10000,
    maxTempRateOfChangeCPerMin: Math.round(maxRateOfChangeCPerMin * 100) / 100,
    timeDiscretizationQuality,
    discretizationWarningFa,
    sensitivityNvsHalfNPercent: Math.round(sensitivityPct * 10) / 10,
    physicalSensorResolutionToleranceMin: sensorToleranceMin,
    f0ReportedRounded,
    selectedIntegrationMethod: 'trapezoidal',
    heatingPhaseLethality: fHeating,
    holdingPhaseLethality: fHolding,
    coolingPhaseLethality: fCooling,
    totalTimeMinutes: totalDuration,
    maxTemperatureC: maxT,
    referenceTemperatureC: referenceTempC,
    zValueC,
    targetOrganismName: organismName,
    targetFRequired,
    isProcessAdequate: isAdequate,
    lethalitySafetyMarginPercent: safetyMargin,
    pointsWithLethality: pointsWithL,
    assumptions: [
      `رده فرآیند: ${standard.nameFa} (${standard.regulatoryStandardFa})`,
      'مقدار z در تمامی دامنه دمایی فرآیند ثابت فرض شده است (مدل بیگلو).',
      'دماسنج یا سنسور دقیقاً در نقطه کندترین گرمایش (Cold Spot) یا انتهای لوله نگهداری قرار دارد.',
      'دقت اعلام‌شده F0 متناسب با تفکیک‌پذیری واقعی سنسورهای دمایی صنعتی گرد شده است.'
    ],
    limitations: [
      `آستانه بحرانی گام زمانی برای این فرآیند ${formatGap(criticalGapThresholdMinutes)} است (${standard.scientificCitation}).`,
      'در صورت افزایش فواصل ثبت، خطای روش عددی ذوزنقه‌ای به دلیل رفتار نمایی نرخ کشندگی بیگلو به‌شدت تشدید می‌شود.'
    ]
  };
}

/**
 * 8. Cook Value (C0) & Optimization Analysis
 * Cook value measures sensory & nutritional degradation:
 * C0 = \int 10^((T - 100) / z_cook) dt, where z_cook ≈ 28 - 33°C (reference 100°C)
 * In contrast to F0 where z_microbe = 10°C (reference 121.1°C).
 */
export function calculateCookValue(
  points: TimeTemperaturePoint[],
  f0Microbial: number
): CookValueResult {
  const Z_COOK = 33.0; // °C for general cooking damage / thiamine loss
  const T_REF_COOK = 100.0; // °C

  let c0 = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dt = p2.timeMinutes - p1.timeMinutes;
    if (dt <= 0) continue;

    const lCook1 = Math.pow(10, (p1.temperatureC - T_REF_COOK) / Z_COOK);
    const lCook2 = Math.pow(10, (p2.temperatureC - T_REF_COOK) / Z_COOK);
    c0 += ((lCook1 + lCook2) / 2.0) * dt;
  }

  // Estimated Thiamine Retention (D121.1 = 150 min, z = 28.5°C)
  // Log retention = - F0_equivalent / D
  const thiamineLogLoss = f0Microbial / 150.0;
  const thiamineRetention = Math.max(0, Math.pow(10, -thiamineLogLoss) * 100);

  const rationale =
    f0Microbial > 2.5 && c0 < 50
      ? 'فرآیند در دمای بالا-زمان کوتاه (HTST) اجرا شده است؛ کشندگی میکروبی بالاست در حالی که آسیب حرارتی پخت و تخریب ویتامین حداقل است.'
      : 'فرآیند در دمای پایین‌تر با زمان طولانی‌تر اجرا شده است؛ ارزش پخت (C0) نسبتاً بالاست که منجر به نرمی بافت، تغییر رنگ و افت ویتامین‌ها می‌شود.';

  return {
    f0MicrobialLethality: f0Microbial,
    c0CookValueQuality: c0,
    nutrientRetentionPercentThiamine: thiamineRetention,
    optimizationRationaleFa: rationale
  };
}
