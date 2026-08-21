import { StatisticalSummary, CalculationTraceStep } from '../../types/calculations';

// Critical values of Student's t distribution for 95% confidence level (two-tailed, df = n - 1)
const STUDENT_T_95: Record<number, number> = {
  1: 12.706,
  2: 4.303,
  3: 3.182,
  4: 2.776,
  5: 2.571,
  6: 2.447,
  7: 2.365,
  8: 2.306,
  9: 2.262,
  10: 2.228,
  15: 2.131,
  20: 2.086,
  25: 2.060,
  30: 2.042,
  40: 2.021,
  60: 2.000,
  100: 1.984,
  1000: 1.960
};

function getStudentTCritical95(df: number): number {
  if (df <= 0) return 1.96;
  if (STUDENT_T_95[df]) return STUDENT_T_95[df];
  
  // Linear interpolation for nearest keys
  const keys = Object.keys(STUDENT_T_95).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < keys.length - 1; i++) {
    if (df >= keys[i] && df <= keys[i + 1]) {
      const k1 = keys[i];
      const k2 = keys[i + 1];
      const v1 = STUDENT_T_95[k1];
      const v2 = STUDENT_T_95[k2];
      return v1 + ((df - k1) / (k2 - k1)) * (v2 - v1);
    }
  }
  return 1.96; // asymptotic limit for large n
}

// Dixon Q-test 90% confidence critical values (n=3 to 10)
const DIXON_Q_90: Record<number, number> = {
  3: 0.941,
  4: 0.765,
  5: 0.642,
  6: 0.560,
  7: 0.507,
  8: 0.468,
  9: 0.437,
  10: 0.412
};

export function calculateStatistics(
  rawValues: number[],
  referenceValue?: number,
  unit: string = ''
): StatisticalSummary {
  const warnings: string[] = [];
  const errors: string[] = [];
  const trace: CalculationTraceStep[] = [];

  // Filter out NaNs or non-finite numbers
  const validValues = rawValues.filter(v => typeof v === 'number' && !isNaN(v) && isFinite(v));

  if (validValues.length === 0) {
    errors.push('هیچ داده معتبری برای محاسبات آماری ارائه نشده است.');
    return {
      count: 0,
      rawValues: [],
      sum: 0,
      mean: 0,
      variance: 0,
      stdDev: 0,
      rsdPercent: 0,
      stdError: 0,
      min: 0,
      max: 0,
      range: 0,
      median: 0,
      referenceValue,
      confidenceInterval95: { lower: 0, upper: 0, marginOfError: 0 },
      outliers: [],
      trace: [],
      warnings,
      errors
    };
  }

  const n = validValues.length;
  if (n < 2) {
    warnings.push('تعداد تکرارها ۱ است؛ انحراف معیار و فاصله اطمینان بر اساس نمونه تکی قابل محاسبه نیست.');
  }

  // 1. Sum and Mean
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  trace.push({
    stepNumber: 1,
    titleFa: 'محاسبه میانگین حسابی (Arithmetic Mean)',
    expression: '\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}',
    substitutedExpression: `(${validValues.join(' + ')}) / ${n}`,
    intermediateValue: mean.toFixed(4),
    unit,
    noteFa: `مجموع ${sum.toFixed(4)} تقسیم بر ${n} تکرار`
  });

  // 2. Variance and Standard Deviation
  let variance = 0;
  let stdDev = 0;
  let stdError = 0;
  let rsdPercent = 0;

  if (n > 1) {
    const sumSquaredDiffs = validValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    variance = sumSquaredDiffs / (n - 1);
    stdDev = Math.sqrt(variance);
    stdError = stdDev / Math.sqrt(n);
    rsdPercent = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0;

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه انحراف معیار نمونه (Sample Standard Deviation - s)',
      expression: 's = \\sqrt{\\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n - 1}}',
      substitutedExpression: `\\sqrt{ (${validValues.map(v => `(${v} - ${mean.toFixed(3)})^2`).join(' + ')}) / (${n} - 1) }`,
      intermediateValue: stdDev.toFixed(4),
      unit,
      noteFa: `واریانس نمونه: ${variance.toFixed(6)}`
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه انحراف معیار نسبی (Relative Standard Deviation - %RSD / CV)',
      expression: '\\%RSD = \\frac{s}{|\\bar{x}|} \\times 100\\%',
      substitutedExpression: `(${stdDev.toFixed(4)} / ${Math.abs(mean).toFixed(4)}) \\times 100`,
      intermediateValue: rsdPercent.toFixed(2),
      unit: '%',
      noteFa: rsdPercent > 5 
        ? 'هشدار: RSD بیشتر از ۵٪ نشان‌دهنده پراکندگی و عدم تکرارپذیری مطلوب در آزمون است.'
        : 'میزان تکرارپذیری آزمون در محدوده قابل قبول قرار دارد.'
    });

    if (rsdPercent > 5) {
      warnings.push(`انحراف معیار نسبی (${rsdPercent.toFixed(2)}%) بالا است و نشان‌دهنده عدم تکرارپذیری دقیق میان تکرارها می‌باشد.`);
    }
  }

  // 3. Min, Max, Range, Median
  const sorted = [...validValues].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  let median = 0;
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    median = sorted[mid];
  } else {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  }

  trace.push({
    stepNumber: 4,
    titleFa: 'دامنه تغییرات و میانه (Range & Median)',
    expression: 'Range = x_{max} - x_{min}',
    substitutedExpression: `${max} - ${min}`,
    intermediateValue: range.toFixed(4),
    unit,
    noteFa: `میانه: ${median.toFixed(4)} | کمینه: ${min} | بیشینه: ${max}`
  });

  // 4. 95% Confidence Interval
  let lower = mean;
  let upper = mean;
  let marginOfError = 0;

  if (n > 1) {
    const tCrit = getStudentTCritical95(n - 1);
    marginOfError = tCrit * stdError;
    lower = mean - marginOfError;
    upper = mean + marginOfError;

    trace.push({
      stepNumber: 5,
      titleFa: 'فاصله اطمینان ۹۵٪ (95% Confidence Interval)',
      expression: 'CI_{95\\%} = \\bar{x} \\pm t_{crit} \\times \\frac{s}{\\sqrt{n}}',
      substitutedExpression: `${mean.toFixed(4)} \\pm (${tCrit.toFixed(3)} \\times ${stdError.toFixed(4)})`,
      intermediateValue: `[${lower.toFixed(3)}, ${upper.toFixed(3)}]`,
      unit,
      noteFa: `t بحرانی (درجه آزادی ${n - 1}): ${tCrit.toFixed(3)} | خطای استاندارد (SE): ${stdError.toFixed(4)}`
    });
  }

  // 5. Percent Error against reference value (if provided)
  let errorPercentAgainstRef: number | undefined;
  if (referenceValue !== undefined && !isNaN(referenceValue) && referenceValue !== 0) {
    errorPercentAgainstRef = (Math.abs(mean - referenceValue) / Math.abs(referenceValue)) * 100;

    trace.push({
      stepNumber: 6,
      titleFa: 'محاسبه درصد خطای آزمون نسبت به مقدار مرجع/استاندارد',
      expression: '\\%Error = \\frac{|\\bar{x} - \\mu_{ref}|}{|\\mu_{ref}|} \\times 100\\%',
      substitutedExpression: `(|${mean.toFixed(4)} - ${referenceValue}| / |${referenceValue}|) \\times 100`,
      intermediateValue: errorPercentAgainstRef.toFixed(2),
      unit: '%',
      noteFa: `مقدار مرجع استاندارد: ${referenceValue} ${unit}`
    });

    if (errorPercentAgainstRef > 10) {
      warnings.push(`درصد خطای آزمون (${errorPercentAgainstRef.toFixed(2)}%) نسبت به مقدار مرجع (${referenceValue}) بالا است.`);
    }
  }

  // 6. Outlier detection (Dixon Q-test for n=3..10)
  const outliers: { value: number; index: number; test: string; noteFa: string }[] = [];
  if (n >= 3 && n <= 10 && range > 0) {
    const qCrit = DIXON_Q_90[n];
    
    // Check lowest value
    const qLow = (sorted[1] - sorted[0]) / range;
    if (qLow > qCrit) {
      const origIndex = validValues.indexOf(sorted[0]);
      outliers.push({
        value: sorted[0],
        index: origIndex,
        test: `Dixon Q-Test (Q_calc=${qLow.toFixed(3)} > Q_crit=${qCrit})`,
        noteFa: `داده ${sorted[0]} با سطح اطمینان ۹۰٪ پرت (Outlier) شناسایی شد.`
      });
      warnings.push(`هشدار آزمون دیکسون: داده پرت با مقدار ${sorted[0]} شناسایی شد (Q_calc=${qLow.toFixed(3)}). داده به‌صورت خودکار حذف نشده است.`);
    }

    // Check highest value
    const qHigh = (sorted[n - 1] - sorted[n - 2]) / range;
    if (qHigh > qCrit) {
      const origIndex = validValues.indexOf(sorted[n - 1]);
      outliers.push({
        value: sorted[n - 1],
        index: origIndex,
        test: `Dixon Q-Test (Q_calc=${qHigh.toFixed(3)} > Q_crit=${qCrit})`,
        noteFa: `داده ${sorted[n - 1]} با سطح اطمینان ۹۰٪ پرت (Outlier) شناسایی شد.`
      });
      warnings.push(`هشدار آزمون دیکسون: داده پرت با مقدار ${sorted[n - 1]} شناسایی شد (Q_calc=${qHigh.toFixed(3)}). داده به‌صورت خودکار حذف نشده است.`);
    }
  }

  return {
    count: n,
    rawValues: validValues,
    sum,
    mean,
    variance,
    stdDev,
    rsdPercent,
    stdError,
    min,
    max,
    range,
    median,
    referenceValue,
    errorPercentAgainstRef,
    confidenceInterval95: {
      lower,
      upper,
      marginOfError
    },
    outliers,
    trace,
    warnings,
    errors
  };
}
