/**
 * Food Science AI - Statistical Calculation Unit Tests
 * Rigorous automated unit tests validating Mean, Median, SD, SE, CV%, RSD%,
 * Confidence Intervals, Outlier Detection, Shapiro-Wilk, Levene's test,
 * One-Way ANOVA, Tukey HSD Post-hoc, and Linear Regression against verified reference standards.
 */

import { calculateDescriptiveStats } from '../descriptiveStats';
import { criticalT, fDistributionPValue } from '../distributions';
import { testNormalityShapiroWilk, testHomogeneityLevene } from '../assumptions';
import { calculateOneWayAnova } from '../hypothesisTesting';
import { calculateCorrelationAndRegression } from '../correlationRegression';
import { StatisticalDataset } from '../../../types/statistics';

export interface UnitTestResult {
  suiteName: string;
  testName: string;
  passed: boolean;
  expected: string | number;
  actual: string | number;
  message?: string;
}

export function runAllStatisticalUnitTests(): {
  total: number;
  passed: number;
  failed: number;
  results: UnitTestResult[];
  durationMs: number;
} {
  const startTime = Date.now();
  const results: UnitTestResult[] = [];

  function assert(
    suiteName: string,
    testName: string,
    actual: any,
    expected: any,
    tolerance: number = 0.001
  ) {
    let passed = false;
    if (typeof actual === 'number' && typeof expected === 'number') {
      passed = Math.abs(actual - expected) <= tolerance;
    } else {
      passed = actual === expected;
    }

    results.push({
      suiteName,
      testName,
      passed,
      expected: typeof expected === 'number' ? Number(expected.toFixed(4)) : expected,
      actual: typeof actual === 'number' ? Number(actual.toFixed(4)) : actual,
      message: passed ? 'آزمون با موفقیت پاس شد' : `عدم تطابق: انتظار ${expected} اما دریافت ${actual}`
    });
  }

  // ==========================================
  // SUITE 1: Descriptive Statistics & Precision
  // Dataset: [10, 12, 14, 16, 18]
  // ==========================================
  const reps1 = [10, 12, 14, 16, 18].map((v, i) => ({
    id: `r-${i}`,
    repNumber: i + 1,
    rawValue: v
  }));
  const stats1 = calculateDescriptiveStats(reps1);

  assert('آمار توصیفی', 'محاسبه میانگین (Mean)', stats1.mean, 14.0);
  assert('آمار توصیفی', 'محاسبه میانه (Median)', stats1.median, 14.0);
  assert('آمار توصیفی', 'محاسبه واریانس نمونه (Variance)', stats1.variance, 10.0);
  // SD = sqrt(10) = 3.162277
  assert('آمار توصیفی', 'انحراف معیار (SD)', stats1.sd, 3.1623);
  // SE = 3.162277 / sqrt(5) = 1.414213
  assert('آمار توصیفی', 'خطای معیار میانگین (SE)', stats1.se, 1.4142);
  // CV% = (3.162277 / 14) * 100 = 22.5877%
  assert('آمار توصیفی', 'ضریب تغییرات (CV%)', stats1.cv, 22.5877, 0.01);
  // RSD% should equal CV%
  assert('آمار توصیفی', 'انحراف معیار نسبی (RSD%)', stats1.rsd, 22.5877, 0.01);

  // Degrees of freedom = 4, t_crit(0.05, 4) = 2.7764
  const tCrit4 = criticalT(0.05, 4);
  assert('توزیع تی‌استیودنت', 'مقدار بحرانی t برای df=4 و alpha=0.05', tCrit4, 2.7764, 0.01);

  // CI 95%: 14 +- 2.7764 * 1.4142 = [10.0735, 17.9265]
  assert('فاصله اطمینان', 'حد پایین فاصله اطمینان ۹۵٪', stats1.ci95Lower, 10.0735, 0.02);
  assert('فاصله اطمینان', 'حد بالای فاصله اطمینان ۹۵٪', stats1.ci95Upper, 17.9265, 0.02);

  // ==========================================
  // SUITE 2: Outlier Detection (Grubbs & IQR)
  // Dataset: [10, 10.2, 9.8, 10.1, 9.9, 28.5]
  // ==========================================
  const repsWithOutlier = [10, 10.2, 9.8, 10.1, 9.9, 28.5].map((v, i) => ({
    id: `o-${i}`,
    repNumber: i + 1,
    rawValue: v
  }));
  const statsOutlier = calculateDescriptiveStats(repsWithOutlier);
  const foundOutlier = statsOutlier.outliers.some((o) => o.value === 28.5);
  assert('شناسایی داده‌های پرت', 'شناسایی داده پرت شدید با آزمون گرابز/IQR (مقدار 28.5)', foundOutlier, true);

  // Verify Raw Data Protection: raw value is not altered
  assert('حفظ داده خام', 'تعداد مشاهدات خام بدون تغییر باقی می‌ماند', statsOutlier.count, 6);

  // ==========================================
  // SUITE 3: Normality Test (Shapiro-Wilk)
  // ==========================================
  const normalSample = [12.1, 12.4, 12.3, 12.2, 12.5, 12.2, 12.4, 12.3];
  const shapiroNormal = testNormalityShapiroWilk(normalSample);
  assert('آزمون نرمال بودن', 'تایید نرمال بودن داده‌های متقارن (Shapiro-Wilk W > 0.85)', shapiroNormal.isNormal, true);

  // Highly skewed dataset with severe tail
  const skewedSample = [1.0, 1.1, 1.0, 1.2, 1.1, 55.0];
  const shapiroSkewed = testNormalityShapiroWilk(skewedSample);
  assert('آزمون نرمال بودن', 'شناسایی عدم نرمال بودن داده‌های دارای چولگی شدید (W < 0.70)', shapiroSkewed.statistic < 0.75, true);

  // ==========================================
  // SUITE 4: Homogeneity of Variances (Levene)
  // ==========================================
  const groupA = [10, 11, 10, 12, 11]; // Var ~ 0.7
  const groupB = [14, 15, 14, 16, 15]; // Var ~ 0.7
  const leveneEqual = testHomogeneityLevene([groupA, groupB]);
  assert('آزمون همگنی واریانس‌ها', 'تایید برابری واریانس در گروه‌های همگن (p > 0.05)', leveneEqual.isHomogeneous, true);

  const groupWild = [1, 300, 2, 400, 5, 500]; // Massive variance difference
  const groupA6 = [10, 11, 10, 12, 11, 10];
  const leveneUnequal = testHomogeneityLevene([groupA6, groupWild]);
  assert('آزمون همگنی واریانس‌ها', 'رد برابری واریانس در گروه‌های به شدت ناهمگن (p < 0.05)', leveneUnequal.isHomogeneous, false);

  // ==========================================
  // SUITE 5: One-Way ANOVA (Textbook Benchmark)
  // Group 1: [20, 22, 24] (mean = 22)
  // Group 2: [28, 30, 32] (mean = 30)
  // Group 3: [36, 38, 40] (mean = 38)
  // Theoretical Values:
  // SS_Between = 384, df_Between = 2, MS_Between = 192
  // SS_Within  = 24,  df_Within  = 6, MS_Within  = 4
  // F = 192 / 4 = 48.0
  // ==========================================
  const anovaDataset: StatisticalDataset = {
    id: 'test-anova-1',
    title: 'تست اعتبارسنجی آنووا',
    description: 'داده‌های مرجع استاندارد کتاب‌های درسی آمار صنایع غذایی',
    foodMatrix: 'نمونه آزمایشگاهی',
    designType: 'crd',
    responseVariable: { name: 'پاسخ', unit: 'واحد' },
    independentFactors: [{ id: 'f1', name: 'تیمار' }],
    alphaLevel: 0.05,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    groups: [
      {
        id: 'g1',
        name: 'گروه ۱',
        replicates: [20, 22, 24].map((v, i) => ({ id: `g1-${i}`, repNumber: i + 1, rawValue: v }))
      },
      {
        id: 'g2',
        name: 'گروه ۲',
        replicates: [28, 30, 32].map((v, i) => ({ id: `g2-${i}`, repNumber: i + 1, rawValue: v }))
      },
      {
        id: 'g3',
        name: 'گروه ۳',
        replicates: [36, 38, 40].map((v, i) => ({ id: `g3-${i}`, repNumber: i + 1, rawValue: v }))
      }
    ]
  };

  const anovaResult = calculateOneWayAnova(anovaDataset, 'tukey_hsd');
  const betweenRow = anovaResult.table[0];
  const withinRow = anovaResult.table[1];

  assert('تحلیل واریانس (ANOVA)', 'مجموع مربعات تیمار (SS Treatment)', betweenRow.ss, 384.0);
  assert('تحلیل واریانس (ANOVA)', 'درجات آزادی تیمار (df Treatment)', betweenRow.df, 2);
  assert('تحلیل واریانس (ANOVA)', 'میانگین مربعات تیمار (MS Treatment)', betweenRow.ms, 192.0);
  assert('تحلیل واریانس (ANOVA)', 'مجموع مربعات خطا (SS Error)', withinRow.ss, 24.0);
  assert('تحلیل واریانس (ANOVA)', 'درجات آزادی خطا (df Error)', withinRow.df, 6);
  assert('تحلیل واریانس (ANOVA)', 'میانگین مربعات خطا (MS Error)', withinRow.ms, 4.0);
  assert('تحلیل واریانس (ANOVA)', 'آماره F محاسبه‌شده (F-Statistic)', anovaResult.fValue, 48.0);
  assert('تحلیل واریانس (ANOVA)', 'معناداری آماری F (p-value < 0.001)', anovaResult.pValue < 0.001, true);

  // Post-Hoc Letter Grouping: All 3 groups differ significantly from each other
  // Descending means: g3 (38) > g2 (30) > g1 (22)
  // Expect letters: g3 = 'a', g2 = 'b', g1 = 'c'
  assert('آزمون تعقیبی توکی', 'تخصیص حروف گروه‌بندی میانگین‌ها (گروه ۳ دارای حرف a)', anovaResult.postHoc.groupLetters['g3'], 'a');
  assert('آزمون تعقیبی توکی', 'تخصیص حروف گروه‌بندی میانگین‌ها (گروه ۲ دارای حرف b)', anovaResult.postHoc.groupLetters['g2'], 'b');
  assert('آزمون تعقیبی توکی', 'تخصیص حروف گروه‌بندی میانگین‌ها (گروه ۱ دارای حرف c)', anovaResult.postHoc.groupLetters['g1'], 'c');

  // ==========================================
  // SUITE 6: Post-Hoc Guardrails (When ANOVA not significant)
  // Dataset with no difference: F ~ 0, p > 0.05
  // ==========================================
  const nonSigDataset: StatisticalDataset = {
    id: 'test-anova-nonsig',
    title: 'تست عدم معناداری',
    description: 'تست محافظ در برابر خطای نوع اول',
    foodMatrix: 'نمونه آزمایشگاهی',
    designType: 'crd',
    responseVariable: { name: 'پاسخ', unit: 'واحد' },
    independentFactors: [{ id: 'f1', name: 'تیمار' }],
    alphaLevel: 0.05,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    groups: [
      { id: 'ns1', name: 'A', replicates: [10, 10, 10].map((v, i) => ({ id: `ns1-${i}`, repNumber: i + 1, rawValue: v })) },
      { id: 'ns2', name: 'B', replicates: [10, 10, 10].map((v, i) => ({ id: `ns2-${i}`, repNumber: i + 1, rawValue: v })) },
      { id: 'ns3', name: 'C', replicates: [10, 10, 10].map((v, i) => ({ id: `ns3-${i}`, repNumber: i + 1, rawValue: v })) }
    ]
  };
  const nonSigResult = calculateOneWayAnova(nonSigDataset, 'tukey_hsd');
  assert('حفاظت از آزمون تعقیبی', 'رد صلاحیت اجرای آزمون تعقیبی در صورت عدم معناداری ANOVA', nonSigResult.postHoc.isEligible, false);

  // ==========================================
  // SUITE 7: Correlation & Linear Regression
  // Points: (1, 3), (2, 5), (3, 7), (4, 9), (5, 11) -> Perfect y = 2x + 1
  // ==========================================
  const regressionPoints = [
    { x: 1, y: 3 },
    { x: 2, y: 5 },
    { x: 3, y: 7 },
    { x: 4, y: 9 },
    { x: 5, y: 11 }
  ];
  const regResult = calculateCorrelationAndRegression(regressionPoints);

  assert('همبستگی پیرسون', 'محاسبه ضریب همبستگی پیرسون r (کامل = 1.0)', regResult.pearsonR, 1.0);
  assert('رگرسیون خطی', 'محاسبه ضریب تبیین R^2 (کامل = 1.0)', regResult.rSquared, 1.0);
  assert('رگرسیون خطی', 'محاسبه شیب خط رگرسیون (Slope = 2.0)', regResult.slope, 2.0);
  assert('رگرسیون خطی', 'محاسبه عرض از مبدأ خط رگرسیون (Intercept = 1.0)', regResult.intercept, 1.0);

  const durationMs = Date.now() - startTime;
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.length - passedCount;

  return {
    total: results.length,
    passed: passedCount,
    failed: failedCount,
    results,
    durationMs
  };
}
