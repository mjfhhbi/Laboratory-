import {
  AdvancedDescriptiveStats,
  OutlierAnalysisReport,
  OutlierRecord,
  FittedRegressionResult,
  RegressionModelType,
  DataSequenceNature,
  HypothesisTestResult,
  UncertaintyPropagationResult
} from './types';
import { studentTPValue, fDistributionPValue, criticalT } from '../statistics/distributions';

/**
 * Standard Durbin-Watson statistic calculation on a sequential residuals series:
 * d = \sum_{t=2}^N (e_t - e_{t-1})^2 / \sum_{t=1}^N e_t^2
 * Preserves the exact sequence order t = 1, ..., N.
 */
export function computeDurbinWatsonOnResiduals(residuals: number[]): number {
  if (residuals.length < 3) return 2.0;
  let diffSum = 0;
  let ssRes = 0;
  for (let i = 0; i < residuals.length; i++) {
    const e = residuals[i];
    ssRes += e * e;
    if (i > 0) {
      diffSum += Math.pow(e - residuals[i - 1], 2);
    }
  }
  return ssRes > 0 ? diffSum / ssRes : 2.0;
}

/**
 * 1. Compute Full Advanced Descriptive Statistics
 */
export function computeAdvancedDescriptiveStats(
  values: number[],
  columnKey: string,
  columnLabel: string
): AdvancedDescriptiveStats {
  const cleanVals = values.filter(v => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);
  const n = cleanVals.length;

  if (n === 0) {
    return {
      columnKey,
      columnLabel,
      n: 0,
      mean: 0,
      median: 0,
      variance: 0,
      standardDeviation: 0,
      standardErrorOfMean: 0,
      coefficientOfVariation: 0,
      min: 0,
      max: 0,
      range: 0,
      sum: 0,
      p25: 0,
      p75: 0,
      iqr: 0,
      skewness: 0,
      kurtosis: 0,
      ci95Lower: 0,
      ci95Upper: 0,
      ci99Lower: 0,
      ci99Upper: 0
    };
  }

  const sum = cleanVals.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  // Median and Quartiles
  const getPercentile = (p: number): number => {
    const idx = (p / 100.0) * (n - 1);
    const low = Math.floor(idx);
    const high = Math.ceil(idx);
    if (low === high) return cleanVals[low];
    return cleanVals[low] + (cleanVals[high] - cleanVals[low]) * (idx - low);
  };

  const p25 = getPercentile(25);
  const median = getPercentile(50);
  const p75 = getPercentile(75);
  const iqr = p75 - p25;
  const min = cleanVals[0];
  const max = cleanVals[n - 1];
  const range = max - min;

  // Variance & Standard Deviation (Sample, n-1)
  let ss = 0;
  let m3 = 0;
  let m4 = 0;
  for (const v of cleanVals) {
    const diff = v - mean;
    ss += diff * diff;
    m3 += Math.pow(diff, 3);
    m4 += Math.pow(diff, 4);
  }

  const variance = n > 1 ? ss / (n - 1) : 0;
  const sd = Math.sqrt(variance);
  const sem = n > 0 ? sd / Math.sqrt(n) : 0;
  const cv = mean !== 0 ? (sd / Math.abs(mean)) * 100 : 0;

  // Skewness and Kurtosis
  let skewness = 0;
  let kurtosis = 0;
  if (n > 2 && sd > 0) {
    skewness = (n * m3) / ((n - 1) * (n - 2) * Math.pow(sd, 3));
  }
  if (n > 3 && sd > 0) {
    const term1 = (n * (n + 1) * m4) / ((n - 1) * (n - 2) * (n - 3) * Math.pow(sd, 4));
    const term2 = (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
    kurtosis = term1 - term2;
  }

  // Confidence Intervals for mean (95% and 99%)
  const df = Math.max(1, n - 1);
  const t95 = criticalT(df, 0.05);
  const t99 = criticalT(df, 0.01);

  const ci95Lower = mean - t95 * sem;
  const ci95Upper = mean + t95 * sem;
  const ci99Lower = mean - t99 * sem;
  const ci99Upper = mean + t99 * sem;

  return {
    columnKey,
    columnLabel,
    n,
    mean: Math.round(mean * 1000) / 1000,
    median: Math.round(median * 1000) / 1000,
    variance: Math.round(variance * 1000) / 1000,
    standardDeviation: Math.round(sd * 1000) / 1000,
    standardErrorOfMean: Math.round(sem * 1000) / 1000,
    coefficientOfVariation: Math.round(cv * 100) / 100,
    min,
    max,
    range: Math.round(range * 1000) / 1000,
    sum: Math.round(sum * 1000) / 1000,
    p25: Math.round(p25 * 1000) / 1000,
    p75: Math.round(p75 * 1000) / 1000,
    iqr: Math.round(iqr * 1000) / 1000,
    skewness: Math.round(skewness * 100) / 100,
    kurtosis: Math.round(kurtosis * 100) / 100,
    ci95Lower: Math.round(ci95Lower * 1000) / 1000,
    ci95Upper: Math.round(ci95Upper * 1000) / 1000,
    ci99Lower: Math.round(ci99Lower * 1000) / 1000,
    ci99Upper: Math.round(ci99Upper * 1000) / 1000
  };
}

/**
 * 2. Outlier Detection using Tukey's IQR rule and Z-Score
 */
export function detectOutliers(
  values: number[],
  columnKey: string,
  columnLabel: string
): OutlierAnalysisReport {
  const stats = computeAdvancedDescriptiveStats(values, columnKey, columnLabel);
  const { mean, standardDeviation: sd, p25, p75, iqr } = stats;

  const tukeyLowerMild = p25 - 1.5 * iqr;
  const tukeyUpperMild = p75 + 1.5 * iqr;
  const tukeyLowerExtreme = p25 - 3.0 * iqr;
  const tukeyUpperExtreme = p75 + 3.0 * iqr;

  const outliers: OutlierRecord[] = [];

  values.forEach((v, idx) => {
    if (typeof v !== 'number' || isNaN(v)) return;

    // Check Tukey
    const isTukeyOutlier = v < tukeyLowerMild || v > tukeyUpperMild;
    const isExtremeTukey = v < tukeyLowerExtreme || v > tukeyUpperExtreme;

    // Check Z-score
    const zScore = sd > 0 ? (v - mean) / sd : 0;
    const isZOutlier = Math.abs(zScore) >= 2.5;

    if (isTukeyOutlier || isZOutlier) {
      const category = (isExtremeTukey || Math.abs(zScore) >= 3.0) ? 'extreme' : 'mild';
      outliers.push({
        rowIndex: idx + 1,
        value: v,
        method: isTukeyOutlier ? 'tukey_iqr' : 'z_score',
        score: Math.round(zScore * 100) / 100,
        category,
        recommendationFa: category === 'extreme'
          ? 'داده به شدت غیرعادی است (خطای احتمالی ابزار یا آزمایشگر)؛ بررسی و حذف توصیه می‌شود.'
          : 'داده در حاشیه توزیع نرمال قرار دارد؛ تکرار آزمون آزمایشگاهی پیشنهاد می‌شود.'
      });
    }
  });

  // Grubbs' Test for Single Extreme Outlier
  let maxAbsDev = 0;
  let suspectVal = mean;
  values.forEach(v => {
    if (typeof v === 'number' && !isNaN(v)) {
      const dev = Math.abs(v - mean);
      if (dev > maxAbsDev) {
        maxAbsDev = dev;
        suspectVal = v;
      }
    }
  });

  const gStat = sd > 0 ? maxAbsDev / sd : 0;
  // Approximate Grubbs critical value for alpha=0.05
  const n = values.filter(v => typeof v === 'number' && !isNaN(v)).length;
  const tVal = criticalT(Math.max(1, n - 2), 0.05 / (2 * n));
  const criticalG = n > 2 ? ((n - 1) / Math.sqrt(n)) * Math.sqrt((tVal * tVal) / (n - 2 + tVal * tVal)) : 0;

  return {
    columnKey,
    columnLabel,
    totalCount: values.length,
    outliersCount: outliers.length,
    tukeyLowerBound: Math.round(tukeyLowerMild * 100) / 100,
    tukeyUpperBound: Math.round(tukeyUpperMild * 100) / 100,
    outliers,
    grubbsTestResult: n >= 3 ? {
      gStatistic: Math.round(gStat * 1000) / 1000,
      criticalG: Math.round(criticalG * 1000) / 1000,
      isOutlierSignificant: gStat > criticalG,
      suspectValue: suspectVal
    } : undefined
  };
}

/**
 * 3. Curve Fitting & Non-Linear Regression Engine
 */
export function fitRegressionModel(
  points: { x: number; y: number }[],
  modelType: RegressionModelType,
  sequenceNature: DataSequenceNature = 'ordered_sequence'
): FittedRegressionResult {
  const cleanPts = points.filter(p => !isNaN(p.x) && !isNaN(p.y));
  const n = cleanPts.length;

  if (n < 3) {
    return createEmptyRegression(modelType, sequenceNature);
  }

  let formulaLatex = '';
  let equationString = '';
  let parameters: FittedRegressionResult['parameters'] = {};
  let predict: (x: number) => number = () => 0;

  switch (modelType) {
    case 'linear': {
      // y = m*x + b
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      cleanPts.forEach(p => {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumX2 += p.x * p.x;
      });
      const denom = n * sumX2 - sumX * sumX;
      const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
      const intercept = (sumY - slope * sumX) / n;

      predict = (x) => slope * x + intercept;
      equationString = `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`;
      formulaLatex = `y = ${slope.toFixed(4)} x + ${intercept.toFixed(4)}`;
      parameters = {
        slope: { value: slope, symbol: 'm', nameFa: 'شیب خط رگرسیون (Slope)' },
        intercept: { value: intercept, symbol: 'b', nameFa: 'عرض از مبدأ (Intercept)' }
      };
      break;
    }

    case 'polynomial_2': {
      // y = a*x^2 + b*x + c via 3x3 normal equations
      let sX = 0, sX2 = 0, sX3 = 0, sX4 = 0;
      let sY = 0, sXY = 0, sX2Y = 0;
      cleanPts.forEach(p => {
        const x = p.x;
        const y = p.y;
        const x2 = x * x;
        sX += x; sX2 += x2; sX3 += x2 * x; sX4 += x2 * x2;
        sY += y; sXY += x * y; sX2Y += x2 * y;
      });

      const [a, b, c] = solve3x3LinearSystem(
        [
          [sX4, sX3, sX2],
          [sX3, sX2, sX],
          [sX2, sX, n]
        ],
        [sX2Y, sXY, sY]
      );

      predict = (x) => a * x * x + b * x + c;
      equationString = `y = ${a.toFixed(4)}x² + ${b.toFixed(4)}x + ${c.toFixed(4)}`;
      formulaLatex = `y = ${a.toFixed(4)} x^2 + ${b.toFixed(4)} x + ${c.toFixed(4)}`;
      parameters = {
        a: { value: a, symbol: 'a', nameFa: 'ضریب درجه دو' },
        b: { value: b, symbol: 'b', nameFa: 'ضریب درجه یک' },
        c: { value: c, symbol: 'c', nameFa: 'عرض از مبدأ درجه دو' }
      };
      break;
    }

    case 'power': {
      // y = a * x^b => ln(y) = ln(a) + b * ln(x) (only positive x and y)
      const valid = cleanPts.filter(p => p.x > 0 && p.y > 0);
      if (valid.length < 3) return createEmptyRegression(modelType);

      let sumLnX = 0, sumLny = 0, sumLnXLny = 0, sumLnX2 = 0;
      valid.forEach(p => {
        const lx = Math.log(p.x);
        const ly = Math.log(p.y);
        sumLnX += lx; sumLny += ly;
        sumLnXLny += lx * ly;
        sumLnX2 += lx * lx;
      });
      const vn = valid.length;
      const b = (vn * sumLnXLny - sumLnX * sumLny) / (vn * sumLnX2 - sumLnX * sumLnX);
      const lnA = (sumLny - b * sumLnX) / vn;
      const a = Math.exp(lnA);

      predict = (x) => a * Math.pow(Math.max(1e-6, x), b);
      equationString = `y = ${a.toFixed(4)} · x^(${b.toFixed(4)})`;
      formulaLatex = `y = ${a.toFixed(4)} \\cdot x^{${b.toFixed(4)}}`;
      parameters = {
        a: { value: a, symbol: 'a', nameFa: 'ضریب قوام توانی (K)' },
        b: { value: b, symbol: 'b', nameFa: 'شاخص رفتار توانی (n)' }
      };
      break;
    }

    case 'exponential': {
      // y = a * exp(b * x) => ln(y) = ln(a) + b * x
      const valid = cleanPts.filter(p => p.y > 0);
      if (valid.length < 3) return createEmptyRegression(modelType);

      let sumX = 0, sumLny = 0, sumXLny = 0, sumX2 = 0;
      valid.forEach(p => {
        const ly = Math.log(p.y);
        sumX += p.x; sumLny += ly;
        sumXLny += p.x * ly;
        sumX2 += p.x * p.x;
      });
      const vn = valid.length;
      const b = (vn * sumXLny - sumX * sumLny) / (vn * sumX2 - sumX * sumX);
      const lnA = (sumLny - b * sumX) / vn;
      const a = Math.exp(lnA);

      predict = (x) => a * Math.exp(b * x);
      equationString = `y = ${a.toFixed(4)} · e^(${b.toFixed(4)}x)`;
      formulaLatex = `y = ${a.toFixed(4)} \\cdot e^{${b.toFixed(4)} x}`;
      parameters = {
        a: { value: a, symbol: 'a', nameFa: 'مقدار اولیه (C0)' },
        b: { value: b, symbol: 'b', nameFa: 'ثابت نرخ زوال/رشد (k)' }
      };
      break;
    }

    case 'logarithmic': {
      // y = a * ln(x) + b
      const valid = cleanPts.filter(p => p.x > 0);
      if (valid.length < 3) return createEmptyRegression(modelType);

      let sumLnX = 0, sumY = 0, sumLnXY = 0, sumLnX2 = 0;
      valid.forEach(p => {
        const lx = Math.log(p.x);
        sumLnX += lx; sumY += p.y;
        sumLnXY += lx * p.y;
        sumLnX2 += lx * lx;
      });
      const vn = valid.length;
      const a = (vn * sumLnXY - sumLnX * sumY) / (vn * sumLnX2 - sumLnX * sumLnX);
      const b = (sumY - a * sumLnX) / vn;

      predict = (x) => a * Math.log(Math.max(1e-6, x)) + b;
      equationString = `y = ${a.toFixed(4)} · ln(x) + ${b.toFixed(4)}`;
      formulaLatex = `y = ${a.toFixed(4)} \\ln(x) + ${b.toFixed(4)}`;
      parameters = {
        a: { value: a, symbol: 'a', nameFa: 'ضریب شیب لگاریتمی' },
        b: { value: b, symbol: 'b', nameFa: 'عرض از مبدأ لگاریتمی' }
      };
      break;
    }
  }

  // Calculate Residuals, R^2, RMSE, Durbin-Watson
  let sumY = 0;
  cleanPts.forEach(p => sumY += p.y);
  const meanY = sumY / n;

  let ssTot = 0;
  let ssRes = 0;
  const residuals: { x: number; actualY: number; predictedY: number; residual: number }[] = [];

  for (let i = 0; i < n; i++) {
    const act = cleanPts[i].y;
    const pred = predict(cleanPts[i].x);
    const res = act - pred;
    residuals.push({ x: cleanPts[i].x, actualY: act, predictedY: pred, residual: res });
    ssTot += Math.pow(act - meanY, 2);
    ssRes += Math.pow(res, 2);
  }

  const r2 = ssTot > 0 ? Math.max(0, 1.0 - ssRes / ssTot) : 1.0;
  const k = Object.keys(parameters).length;
  const adjR2 = n > k + 1 ? 1.0 - ((1.0 - r2) * (n - 1)) / (n - k - 1) : r2;
  const rmse = Math.sqrt(ssRes / n);
  const seEstimate = n > k ? Math.sqrt(ssRes / (n - k)) : rmse;

  // Check if data is naturally ordered by X (monotonic)
  let isMonotonicX = true;
  for (let i = 1; i < cleanPts.length; i++) {
    if (cleanPts[i].x < cleanPts[i - 1].x) {
      isMonotonicX = false;
      break;
    }
  }

  // Durbin-Watson statistic: d = sum_{t=2}^N (e_t - e_{t-1})^2 / sum_{t=1}^N e_t^2
  // SCIENTIFIC PRINCIPLE: Observations sequence order t = 1, ..., N MUST be preserved!
  // Automatic sorting of residuals by X is strictly eliminated.
  const durbinWatsonFormulaLatex = 'd = \\frac{\\sum_{t=2}^N (e_t - e_{t-1})^2}{\\sum_{t=1}^N e_t^2}';
  let isDurbinWatsonValid = false;
  let durbinWatsonStatistic: number | null = null;
  let durbinWatsonInterpretationFa = '';
  let durbinWatsonWarning: string | undefined = undefined;

  if (sequenceNature === 'cross_sectional') {
    isDurbinWatsonValid = false;
    durbinWatsonStatistic = null;
    durbinWatsonInterpretationFa = 'آزمون دوربین-واتسون برای داده‌های مقطعی (Cross-Sectional) بدون ترتیب زمانی یا آزمایشی فاقد اعتبار علمی است؛ زیرا مفهوم خودهمبستگی مرتبه اول تنها بر روی داده‌های دارای توالی متوالی تعریف می‌شود.';
    durbinWatsonWarning = 'آزمون آماری Durbin-Watson به دلیل ماهیت مقطعی داده‌ها اجرا نشد؛ در داده‌های مقطعی، ترتیب سطرها اختیاری است و خودهمبستگی تعریف نمی‌شود.';
  } else if (sequenceNature === 'unspecified') {
    isDurbinWatsonValid = false;
    durbinWatsonStatistic = null;
    durbinWatsonInterpretationFa = 'ترتیب مشاهدات مشخص نیست. جهت تفسیر معتبر آماره Durbin-Watson، لطفاً ماهیت توالی داده‌ها (سری زمانی، ترتیب فرآیندی یا مقطعی) را تعیین فرمایید.';
    durbinWatsonWarning = 'ماهیت ترتیب داده‌ها نامشخص است؛ جهت جلوگیری از نتیجه کاذب آماری، نوع توالی را مشخص کنید.';
  } else {
    // time_series or ordered_sequence: Compute strictly on the original sequential observations!
    isDurbinWatsonValid = true;
    let dwDiffSum = 0;
    for (let i = 1; i < residuals.length; i++) {
      dwDiffSum += Math.pow(residuals[i].residual - residuals[i - 1].residual, 2);
    }
    const dwVal = ssRes > 0 ? dwDiffSum / ssRes : 2.0;
    durbinWatsonStatistic = Math.round(dwVal * 10000) / 10000;

    if (durbinWatsonStatistic < 1.4) {
      durbinWatsonInterpretationFa = `خودهمبستگی مثبت قوی در باقیمانده‌ها بر اساس توالی مشاهدات (d = ${durbinWatsonStatistic.toFixed(2)} < 1.4). نشان‌دهنده خطای سیستماتیک، اثر زمان یا روند غیرخطی مدل‌سازی‌نشده.`;
    } else if (durbinWatsonStatistic > 2.6) {
      durbinWatsonInterpretationFa = `خودهمبستگی منفی در باقیمانده‌ها بر اساس توالی مشاهدات (d = ${durbinWatsonStatistic.toFixed(2)} > 2.6). نشان‌دهنده نوسان متناوب و متوالی خطاها.`;
    } else {
      durbinWatsonInterpretationFa = `استقلال قابل قبول باقیمانده‌ها (d = ${durbinWatsonStatistic.toFixed(2)} در محدوده استاندارد ۱.۴ تا ۲.۶ - عدم خودهمبستگی مرتبه اول).`;
    }

    if (!isMonotonicX && sequenceNature === 'time_series') {
      durbinWatsonWarning = 'نکته متدولوژی: توالی زمانی مشاهدات بر ترتیب مقادیر X اولویت دارد؛ آماره بر اساس ترتیب زمانی واقعی ثبت داده‌ها بدون تغییر ردیف‌ها محاسبه گردید.';
    }
  }

  // Generate smooth fitted curve points (50 points across minX to maxX)
  let minX = cleanPts[0].x;
  let maxX = cleanPts[0].x;
  cleanPts.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
  });

  const fittedCurve: { x: number; y: number }[] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const curX = minX + (i / steps) * (maxX - minX);
    fittedCurve.push({ x: Math.round(curX * 1000) / 1000, y: Math.round(predict(curX) * 1000) / 1000 });
  }

  const pVal = studentTPValue(Math.max(1, n - 2), Math.sqrt(Math.max(0, (r2 * (n - 2)) / Math.max(1e-6, 1 - r2))));

  return {
    modelType,
    modelNameFa: getModelNameFa(modelType),
    modelNameEn: modelType,
    equationString,
    formulaLatex,
    parameters,
    rSquared: Math.round(r2 * 10000) / 10000,
    adjustedRSquared: Math.round(adjR2 * 10000) / 10000,
    rmse: Math.round(rmse * 1000) / 1000,
    pearsonR: Math.round(Math.sqrt(Math.max(0, r2)) * 1000) / 1000,
    pValue: pVal,
    dataSequenceNature: sequenceNature,
    isDurbinWatsonValid,
    durbinWatsonStatistic,
    durbinWatsonFormulaLatex,
    isDataOrderedByX: isMonotonicX,
    durbinWatsonInterpretationFa,
    durbinWatsonWarning,
    standardErrorEstimate: Math.round(seEstimate * 1000) / 1000,
    residuals,
    fittedCurve
  };
}

/**
 * 4. Uncertainty & Error Propagation Calculator
 */
export function calculateUncertaintyPropagation(
  formulaType: 'sum_difference' | 'product_quotient' | 'power',
  inputs: { label: string; value: number; uncertainty: number }[]
): UncertaintyPropagationResult {
  if (inputs.length < 2) {
    throw new Error('حداقل دو متغیر ورودی برای انتشار عدم قطعیت لازم است.');
  }

  const steps: string[] = [];

  if (formulaType === 'sum_difference') {
    // q = x1 + x2 + ... => delta_q = sqrt(delta_x1^2 + delta_x2^2 + ...)
    let nominal = 0;
    let sumSqUncertainty = 0;
    inputs.forEach(inp => {
      nominal += inp.value;
      sumSqUncertainty += Math.pow(inp.uncertainty, 2);
      steps.push(`متغیر ${inp.label}: مقدار = ${inp.value}، عدم قطعیت = ±${inp.uncertainty}`);
    });
    const combinedAbs = Math.sqrt(sumSqUncertainty);
    const relPercent = nominal !== 0 ? (combinedAbs / Math.abs(nominal)) * 100 : 0;

    steps.push(`فرمول انتشار: \\delta q = \\sqrt{ \\sum (\\delta x_i)^2 } = \\sqrt{ ${sumSqUncertainty.toFixed(4)} } = ±${combinedAbs.toFixed(4)}`);

    return {
      formulaNameFa: 'انتشار عدم قطعیت در جمع و تفریق',
      formulaExpression: 'q = x_1 + x_2 + \\dots \\implies \\delta q = \\sqrt{\\sum (\\delta x_i)^2}',
      nominalResult: Math.round(nominal * 1000) / 1000,
      combinedUncertaintyAbsolute: Math.round(combinedAbs * 1000) / 1000,
      relativeUncertaintyPercent: Math.round(relPercent * 100) / 100,
      confidenceInterval95: [
        Math.round((nominal - 1.96 * combinedAbs) * 1000) / 1000,
        Math.round((nominal + 1.96 * combinedAbs) * 1000) / 1000
      ],
      expandedUncertaintyK2: Math.round(2 * combinedAbs * 1000) / 1000,
      derivationStepsFa: steps
    };
  } else {
    // Product / Quotient: q = x1 * x2 => (delta_q / q) = sqrt((delta_x1/x1)^2 + (delta_x2/x2)^2)
    let nominal = 1.0;
    let sumSqRel = 0;
    inputs.forEach(inp => {
      nominal *= inp.value;
      const rel = inp.value !== 0 ? inp.uncertainty / Math.abs(inp.value) : 0;
      sumSqRel += Math.pow(rel, 2);
      steps.push(`متغیر ${inp.label}: مقدار = ${inp.value}، عدم قطعیت نسبی = ${(rel * 100).toFixed(2)}%`);
    });
    const combinedRel = Math.sqrt(sumSqRel);
    const combinedAbs = Math.abs(nominal) * combinedRel;

    steps.push(`فرمول انتشار: \\frac{\\delta q}{q} = \\sqrt{ \\sum (\\frac{\\delta x_i}{x_i})^2 } = ${(combinedRel * 100).toFixed(2)}\\%`);

    return {
      formulaNameFa: 'انتشار عدم قطعیت در ضرب و تقسیم',
      formulaExpression: 'q = \\prod x_i \\implies \\frac{\\delta q}{q} = \\sqrt{\\sum (\\frac{\\delta x_i}{x_i})^2}',
      nominalResult: Math.round(nominal * 1000) / 1000,
      combinedUncertaintyAbsolute: Math.round(combinedAbs * 1000) / 1000,
      relativeUncertaintyPercent: Math.round(combinedRel * 10000) / 100,
      confidenceInterval95: [
        Math.round((nominal - 1.96 * combinedAbs) * 1000) / 1000,
        Math.round((nominal + 1.96 * combinedAbs) * 1000) / 1000
      ],
      expandedUncertaintyK2: Math.round(2 * combinedAbs * 1000) / 1000,
      derivationStepsFa: steps
    };
  }
}

/**
 * 5. One-Way ANOVA Engine
 */
export function calculateOneWayAnovaFromGroups(
  groups: { name: string; values: number[] }[]
): {
  fStatistic: number;
  pValue: number;
  dfBetween: number;
  dfWithin: number;
  ssBetween: number;
  ssWithin: number;
  msBetween: number;
  msWithin: number;
  isSignificant: boolean;
} {
  const k = groups.length;
  let totalN = 0;
  let grandSum = 0;

  groups.forEach(g => {
    totalN += g.values.length;
    grandSum += g.values.reduce((a, b) => a + b, 0);
  });

  const grandMean = totalN > 0 ? grandSum / totalN : 0;

  let ssBetween = 0;
  let ssWithin = 0;

  groups.forEach(g => {
    const ni = g.values.length;
    if (ni === 0) return;
    const groupMean = g.values.reduce((a, b) => a + b, 0) / ni;
    ssBetween += ni * Math.pow(groupMean - grandMean, 2);

    g.values.forEach(v => {
      ssWithin += Math.pow(v - groupMean, 2);
    });
  });

  const dfBetween = Math.max(1, k - 1);
  const dfWithin = Math.max(1, totalN - k);

  const msBetween = ssBetween / dfBetween;
  const msWithin = dfWithin > 0 ? ssWithin / dfWithin : 1e-6;

  const fStat = msWithin > 0 ? msBetween / msWithin : 0;
  const pVal = fDistributionPValue(dfBetween, dfWithin, fStat);

  return {
    fStatistic: Math.round(fStat * 1000) / 1000,
    pValue: pVal,
    dfBetween,
    dfWithin,
    ssBetween: Math.round(ssBetween * 100) / 100,
    ssWithin: Math.round(ssWithin * 100) / 100,
    msBetween: Math.round(msBetween * 100) / 100,
    msWithin: Math.round(msWithin * 100) / 100,
    isSignificant: pVal < 0.05
  };
}

/**
 * Helper: Solve 3x3 linear system for 2nd order polynomial fit
 */
function solve3x3LinearSystem(A: number[][], b: number[]): [number, number, number] {
  const M = A.map((row, i) => [...row, b[i]]);
  const n = 3;

  for (let k = 0; k < n - 1; k++) {
    let maxRow = k;
    let maxVal = Math.abs(M[k][k]);
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(M[i][k]) > maxVal) {
        maxVal = Math.abs(M[i][k]);
        maxRow = i;
      }
    }
    if (maxRow !== k) {
      const temp = M[k];
      M[k] = M[maxRow];
      M[maxRow] = temp;
    }
    const pivot = M[k][k];
    if (Math.abs(pivot) < 1e-12) return [0, 0, 0];
    for (let i = k + 1; i < n; i++) {
      const factor = M[i][k] / pivot;
      for (let j = k; j <= n; j++) {
        M[i][j] -= factor * M[k][j];
      }
    }
  }

  const x = [0, 0, 0];
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = M[i][i] !== 0 ? sum / M[i][i] : 0;
  }

  return [x[0], x[1], x[2]];
}

function getModelNameFa(type: RegressionModelType): string {
  switch (type) {
    case 'linear': return 'رگرسیون خطی (OLS Linear)';
    case 'polynomial_2': return 'رگرسیون چندجمله‌ای درجه دو (Quadratic Polynomial)';
    case 'power': return 'رگرسیون توانی (Power Law: y = a x^b)';
    case 'exponential': return 'رگرسیون نمایی (Exponential: y = a e^bx)';
    case 'logarithmic': return 'رگرسیون لگاریتمی (Logarithmic: y = a ln(x) + b)';
  }
}

function createEmptyRegression(
  modelType: RegressionModelType,
  sequenceNature: DataSequenceNature = 'ordered_sequence'
): FittedRegressionResult {
  return {
    modelType,
    modelNameFa: getModelNameFa(modelType),
    modelNameEn: modelType,
    equationString: 'داده ناکافی',
    formulaLatex: 'y = f(x)',
    parameters: {},
    rSquared: 0,
    adjustedRSquared: 0,
    rmse: 0,
    pearsonR: 0,
    pValue: 1.0,
    dataSequenceNature: sequenceNature,
    isDurbinWatsonValid: false,
    durbinWatsonStatistic: null,
    durbinWatsonFormulaLatex: 'd = \\frac{\\sum_{t=2}^N (e_t - e_{t-1})^2}{\\sum_{t=1}^N e_t^2}',
    isDataOrderedByX: true,
    durbinWatsonInterpretationFa: 'داده‌های ناکافی برای محاسبه خودهمبستگی',
    standardErrorEstimate: 0,
    residuals: [],
    fittedCurve: []
  };
}

/**
 * Sorts dataset array by specified column key
 */
export function sortDataByColumn(
  data: Record<string, any>[],
  columnKey: string,
  ascending: boolean = true
): Record<string, any>[] {
  return [...data].sort((a, b) => {
    const valA = Number(a[columnKey]);
    const valB = Number(b[columnKey]);
    if (!isNaN(valA) && !isNaN(valB)) {
      return ascending ? valA - valB : valB - valA;
    }
    const strA = String(a[columnKey] ?? '');
    const strB = String(b[columnKey] ?? '');
    return ascending ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });
}
