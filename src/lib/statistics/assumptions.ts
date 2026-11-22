/**
 * Food Science AI - Statistical Assumptions & Decision Engine
 * Normality Tests (Shapiro-Wilk / D'Agostino-Pearson),
 * Homogeneity of Variances (Levene / Brown-Forsythe),
 * Design Suitability Audit & Interactive Clarification Questions.
 */

import { 
  StatisticalDataset, 
  AssumptionVerificationReport, 
  NormalityTestResult, 
  HomogeneityTestResult 
} from '../../types/statistics';
import { calculateDescriptiveStats } from './descriptiveStats';
import { fDistributionPValue, chiSquarePValue, standardNormalCDF, inverseNormalCDF } from './distributions';

/**
 * Shapiro-Wilk Normality Test Approximation (Royston Algorithm)
 */
export function testNormalityShapiroWilk(values: number[]): NormalityTestResult {
  const n = values.length;
  if (n < 3) {
    return {
      testName: 'Shapiro-Wilk',
      statistic: 1.0,
      criticalOrW: 1.0,
      pValue: 1.0,
      isNormal: true,
      interpretationFa: 'تعداد نمونه برای آزمون شاپیرو-ویلک ناکافی است (حداقل ۳ نمونه لازم است).'
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  
  // Total Sum of Squares
  let ss = 0;
  for (const x of sorted) {
    ss += (x - mean) * (x - mean);
  }

  if (ss === 0) {
    return {
      testName: 'Shapiro-Wilk',
      statistic: 1.0,
      criticalOrW: 1.0,
      pValue: 1.0,
      isNormal: true,
      interpretationFa: 'واریانس داده‌ها صفر است (همه مقادیر یکسانند).'
    };
  }

  // Generate standard normal expected order statistics (m_i)
  const m: number[] = [];
  for (let i = 1; i <= n; i++) {
    // Blom's plotting position: (i - 3/8) / (n + 1/4)
    const p = (i - 0.375) / (n + 0.25);
    // Accurate normal quantile via Acklam inverse normal CDF
    m.push(inverseNormalCDF(p));
  }

  let mSumSq = 0;
  for (const mi of m) {
    mSumSq += mi * mi;
  }
  const mNorm = Math.sqrt(mSumSq);

  // Weights a_i
  const a: number[] = m.map((mi) => mi / mNorm);

  // Numerator: (sum(a_i * x_i))^2
  let b = 0;
  for (let i = 0; i < n; i++) {
    b += a[i] * sorted[i];
  }

  const w = (b * b) / ss;
  const boundedW = Math.max(0, Math.min(1.0, w));

  // Royston p-value transformation for W
  let z = 0;
  if (n === 3) {
    z = (Math.log(1 - boundedW) + 0.999) / 0.741;
  } else if (n <= 11) {
    const mu = 0.544 - 0.39978 * n + 0.025054 * n * n - 0.0006714 * n * n * n;
    const sigma = Math.exp(1.3822 - 0.77857 * n + 0.062767 * n * n - 0.0020322 * n * n * n);
    z = (Math.log(1 - boundedW) - mu) / sigma;
  } else {
    // For n > 11
    const logN = Math.log(n);
    const mu = -1.2725 + 1.0521 * (logN - Math.log(logN));
    const sigma = 1.0308 - 0.26758 * (logN + 2 / logN);
    z = (Math.log(1 - boundedW) - mu) / sigma;
  }

  // p-value is upper tail of standard normal
  const pValue = Math.max(0.0001, Math.min(1.0, 1.0 - standardNormalCDF(z)));
  const isNormal = pValue > 0.05;

  return {
    testName: 'Shapiro-Wilk',
    statistic: Number(boundedW.toFixed(4)),
    criticalOrW: 0.05,
    pValue: Number(pValue.toFixed(4)),
    isNormal,
    interpretationFa: isNormal
      ? `توزیع نرمال داده‌ها تأیید می‌شود (W = ${boundedW.toFixed(3)}، p = ${pValue.toFixed(3)} > 0.05).`
      : `داده‌ها به طور معنادار از توزیع نرمال انحراف دارند (W = ${boundedW.toFixed(3)}، p = ${pValue.toFixed(3)} ≤ 0.05).`
  };
}

/**
 * Levene's Test (Brown-Forsythe robust variant using median deviations)
 * for testing equality of variances across k treatment groups.
 */
export function testHomogeneityLevene(groupsData: number[][]): HomogeneityTestResult {
  const k = groupsData.length;
  if (k < 2) {
    return {
      testName: "Levene's Test",
      statistic: 0,
      df1: 0,
      df2: 0,
      pValue: 1.0,
      isHomogeneous: true,
      interpretationFa: 'برای آزمون همگنی واریانس‌ها حداقل دو گروه نیاز است.'
    };
  }

  // Compute medians for each group
  const groupMedians = groupsData.map((vals) => {
    if (vals.length === 0) return 0;
    const s = [...vals].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
  });

  // Transform data: z_ij = |y_ij - median_i|
  const zGroups: number[][] = [];
  let totalN = 0;
  const zMeans: number[] = [];
  let grandZSum = 0;

  for (let i = 0; i < k; i++) {
    const med = groupMedians[i];
    const zGroup = groupsData[i].map((y) => Math.abs(y - med));
    zGroups.push(zGroup);
    totalN += zGroup.length;

    const zSum = zGroup.reduce((a, b) => a + b, 0);
    grandZSum += zSum;
    zMeans.push(zGroup.length > 0 ? zSum / zGroup.length : 0);
  }

  const grandZMean = totalN > 0 ? grandZSum / totalN : 0;

  // Numerator Sum of Squares (Between groups)
  let ssBetween = 0;
  for (let i = 0; i < k; i++) {
    const ni = zGroups[i].length;
    const diff = zMeans[i] - grandZMean;
    ssBetween += ni * diff * diff;
  }

  // Denominator Sum of Squares (Within groups)
  let ssWithin = 0;
  for (let i = 0; i < k; i++) {
    for (const z of zGroups[i]) {
      const diff = z - zMeans[i];
      ssWithin += diff * diff;
    }
  }

  const df1 = k - 1;
  const df2 = totalN - k;

  if (df1 <= 0 || df2 <= 0 || ssWithin === 0) {
    return {
      testName: "Levene's Test",
      statistic: 0,
      df1: Math.max(1, df1),
      df2: Math.max(1, df2),
      pValue: 1.0,
      isHomogeneous: true,
      interpretationFa: 'واریانس‌های درون‌گروهی صفر یا تعداد درجات آزادی ناکافی است.'
    };
  }

  const msBetween = ssBetween / df1;
  const msWithin = ssWithin / df2;
  const fStat = msBetween / msWithin;
  const pValue = fDistributionPValue(fStat, df1, df2);

  const isHomogeneous = pValue > 0.05;

  return {
    testName: "Levene's Test",
    statistic: Number(fStat.toFixed(4)),
    df1,
    df2,
    pValue: Number(pValue.toFixed(4)),
    isHomogeneous,
    interpretationFa: isHomogeneous
      ? `واریانس گروه‌ها همگن است (Levene F = ${fStat.toFixed(3)}، p = ${pValue.toFixed(3)} > 0.05). شرط برابری واریانس‌ها برقرار است.`
      : `هشدار: واریانس گروه‌ها ناهمگن است (Levene F = ${fStat.toFixed(3)}، p = ${pValue.toFixed(3)} ≤ 0.05). فرض برابری واریانس‌ها نقض شده است.`
  };
}

/**
 * Comprehensive Statistical Assumptions Audit for a Dataset
 */
export function auditStatisticalAssumptions(
  dataset: StatisticalDataset
): AssumptionVerificationReport {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  const normalityPerGroup: Record<string, NormalityTestResult> = {};

  const validGroupData: number[][] = [];
  const allResiduals: number[] = [];
  let minReps = 999999;
  let maxReps = 0;

  dataset.groups.forEach((g) => {
    const stats = calculateDescriptiveStats(g.replicates, g.name);
    const validVals = g.replicates
      .filter((r) => r.rawValue !== null && !isNaN(r.rawValue) && !r.isExcluded)
      .map((r) => r.rawValue as number);

    if (validVals.length > 0) {
      validGroupData.push(validVals);
      minReps = Math.min(minReps, validVals.length);
      maxReps = Math.max(maxReps, validVals.length);

      // Residuals: e_ij = y_ij - mean_i
      validVals.forEach((v) => {
        allResiduals.push(v - stats.mean);
      });

      // Normality per group (if n >= 3)
      normalityPerGroup[g.id] = testNormalityShapiroWilk(validVals);
    }
  });

  if (minReps === 999999) minReps = 0;

  // 1. Overall Normality on Residuals
  const normalityOverall = testNormalityShapiroWilk(allResiduals);

  // 2. Homogeneity of Variances across groups
  const homogeneity = testHomogeneityLevene(validGroupData);

  // 3. Sample Size Evaluation
  const isBalanced = minReps === maxReps && minReps > 0;
  const isAdequate = minReps >= 3;

  if (!isAdequate) {
    warnings.push(
      `حداقل تکرار در یکی از گروه‌ها کمتر از ۳ است (${minReps} تکرار). آزمون ANOVA پارامتریک نیازمند حداقل ۳ تکرار برای محاسبه معتبر واریانس خطا است.`
    );
    recommendations.push(
      'برای دستیابی به توان آماری استاندارد در آزمایش‌های صنایع غذایی، توصیه می‌شود تکرارها حداقل ۳ (ترجیحاً تکرار زیستی/تکنیکی سه‌گانه) ثبت شود.'
    );
  }

  if (!isBalanced && validGroupData.length > 1) {
    warnings.push(
      'طرح آزمایش نامتعادل (Unbalanced) است (تعداد تکرار در تمام گروه‌ها یکسان نیست). در صورت ناهمگنی واریانس‌ها، حساسیت آزمون افزایش می‌یابد.'
    );
  }

  // Check Normality
  if (!normalityOverall.isNormal) {
    warnings.push(
      'باقی‌مانده‌های مدل (Residuals) از توزیع نرمال پیروی نمی‌کنند (آزمون شاپیرو-ویلک، p ≤ 0.05).'
    );
    recommendations.push(
      'پیشنهاد می‌شود از تبدیل داده (مانند Logarithm در بار میکروبی، یا Box-Cox) استفاده نمایید یا آزمون ناپارامتریک Kruskal-Wallis را اجرا کنید.'
    );
  }

  // Check Homogeneity
  if (!homogeneity.isHomogeneous) {
    warnings.push(
      'واریانس گروه‌های آزمایشی همگن نیست (آزمون لون، p ≤ 0.05). یکی از اساسی‌ترین فرضیات ANOVA نقض گردیده است.'
    );
    recommendations.push(
      'در صورت ناهمگنی واریانس‌ها، نتایج ANOVA استاندارد غیرمعتبر خواهد بود. پیشنهاد می‌شود از تصحیح ولچ (Welch ANOVA) یا آزمون‌های ناپارامتریک استفاده شود.'
    );
  }

  // Interactive Clarification Questions
  const clarificationQuestions = [
    {
      id: 'independence',
      questionFa: 'آیا واحدهای آزمایش (نمونه‌ها) کاملاً مستقل از یکدیگر آماده‌سازی و سنجش شده‌اند؟',
      helpFa: 'آیا هر داده از ظرف/بسته مجزا اندازه‌گیری شده، یا اندازه‌گیری مکرر روی یک نمونه در زمان‌های مختلف است؟',
      options: [
        {
          value: 'fully_independent',
          labelFa: 'بله، نمونه‌ها کاملاً مستقل هستند (طرح کاملاً تصادفی CRD)',
          statisticalImpactFa: 'فرضیه استقلال مشاهدات برقرار است.'
        },
        {
          value: 'repeated_measures',
          labelFa: 'خیر، اندازه‌گیری در طول زمان روی یک نمونه است (طرح اندازه‌گیری مکرر)',
          statisticalImpactFa: 'باید از Repeated Measures ANOVA یا Mixed Model استفاده شود.'
        },
        {
          value: 'blocked',
          labelFa: 'نمونه‌ها در روزها یا ران‌های مختلف آزمایشگاهی بلوک‌بندی شده‌اند',
          statisticalImpactFa: 'باید از طرح بلوک‌های کامل تصادفی (RCBD) استفاده شود.'
        }
      ]
    },
    {
      id: 'scale_type',
      questionFa: 'نوع متغیر پاسخ در چه مقیاسی ثبت شده است؟',
      helpFa: 'مقیاس‌های کمی پیوسته برای آزمون‌های پارامتریک و مقیاس‌های رتبه‌ای برای ناپارامتریک استفاده می‌شوند.',
      options: [
        {
          value: 'continuous_ratio',
          labelFa: 'کمی پیوسته با صفر مطلق (مانند وزن، غلظت، عدد پراکسید، اسیدیته)',
          statisticalImpactFa: 'مناسب برای ANOVA و رگرسیون خطی.'
        },
        {
          value: 'log_microbial',
          labelFa: 'شمارش لگاریتمی میکروبی (Log CFU/g یا CFU/mL)',
          statisticalImpactFa: 'مناسب برای تحلیل پارامتریک (توزیع میکروبی لگاریتمی نرمال).'
        },
        {
          value: 'ordinal_sensory',
          labelFa: 'رتبه‌ای هدونیک ارزیابی حسی (مقیاس ۱ تا ۹ هدونیک حسی)',
          statisticalImpactFa: 'اگر داده‌ها پیوسته فرض نشوند، آزمون کروسکال-والیس ارجح است.'
        }
      ]
    }
  ];

  // Overall Validity Status
  let overallStatus: 'valid' | 'warning' | 'invalid' = 'valid';
  let summaryFa = 'تمامی مفروضات اولیه (توزیع نرمال باقیمانده‌ها، همگنی واریانس‌ها و کفایت تکرارها) برقرار است و نتایج آزمون تحلیل واریانس (ANOVA) معتبر اعلام می‌شود.';

  if (!homogeneity.isHomogeneous || !normalityOverall.isNormal) {
    overallStatus = 'invalid';
    summaryFa = 'هشدار علمی مهم: مفروضات بنیادی تحلیل آماری (همگنی واریانس‌ها یا نرمال بودن) نقض شده است. نتیجه آزمون ANOVA پارامتریک بدون اعمال تبدیل یا آزمون ناپارامتریک معتبر نخواهد بود.';
  } else if (!isAdequate || !isBalanced) {
    overallStatus = 'warning';
    summaryFa = 'مفروضات ریاضی نسبتاً برقرار است، اما به دلیل تعداد اندک تکرارها یا نامتعادل بودن طرح، احتیاط در تعمیم نتایج ضروری است.';
  }

  return {
    overallStatus,
    summaryFa,
    normalityOverall,
    normalityPerGroup,
    homogeneity,
    sampleSizeEvaluation: {
      minReplicates: minReps,
      maxReplicates: maxReps,
      isBalanced,
      isAdequate,
      warningFa: !isAdequate ? 'حداقل ۳ تکرار برای اعتبار خطای تجربی الزامی است.' : undefined
    },
    warnings,
    recommendations,
    requiresClarification: dataset.designType === 'repeated_measures' || !dataset.userClarifications?.independence,
    clarificationQuestions
  };
}
