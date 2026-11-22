/**
 * Food Science AI - Descriptive Statistics Engine
 * Mean, Median, Variance, SD, SE, CV%, RSD%, Confidence Intervals (95% & 99%),
 * Quartiles, IQR, Skewness, Kurtosis, and Multi-Method Outlier Detection (Grubbs & IQR & Dixon).
 */

import { RawReplicate, DescriptiveStats, OutlierPoint } from '../../types/statistics';
import { criticalT, grubbsCriticalValue, DIXON_Q_CRITICAL_95 } from './distributions';

export function calculateDescriptiveStats(
  replicates: RawReplicate[],
  groupName: string = 'گروه'
): DescriptiveStats {
  const totalCount = replicates.length;
  // Filter for valid, non-excluded numerical entries
  const validItems = replicates.filter(
    (r) => r.rawValue !== null && !isNaN(r.rawValue) && !r.isExcluded
  );
  const excludedCount = replicates.filter((r) => r.isExcluded).length;
  const values = validItems.map((r) => r.rawValue as number);
  const validCount = values.length;

  if (validCount === 0) {
    return {
      count: totalCount,
      validCount: 0,
      excludedCount,
      sum: 0,
      mean: 0,
      median: 0,
      variance: 0,
      sd: 0,
      se: 0,
      cv: 0,
      rsd: 0,
      ci95Lower: 0,
      ci95Upper: 0,
      ci99Lower: 0,
      ci99Upper: 0,
      min: 0,
      max: 0,
      range: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      skewness: 0,
      kurtosis: 0,
      outliers: []
    };
  }

  // Sorted values for percentiles and median
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  // Sum and Mean
  const sum = values.reduce((acc, v) => acc + v, 0);
  const mean = sum / validCount;

  // Median
  let median = 0;
  const mid = Math.floor(validCount / 2);
  if (validCount % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }

  // Quartiles (Tukey's hinges)
  const q1 = getPercentile(sorted, 0.25);
  const q3 = getPercentile(sorted, 0.75);
  const iqr = q3 - q1;

  // Sample Variance & Standard Deviation (df = n - 1)
  let sumSqDiff = 0;
  let m3 = 0;
  let m4 = 0;
  for (const v of values) {
    const diff = v - mean;
    sumSqDiff += diff * diff;
    m3 += diff * diff * diff;
    m4 += diff * diff * diff * diff;
  }

  const variance = validCount > 1 ? sumSqDiff / (validCount - 1) : 0;
  const sd = Math.sqrt(variance);

  // Standard Error of the Mean (SE = s / sqrt(n))
  const se = validCount > 0 ? sd / Math.sqrt(validCount) : 0;

  // Coefficient of Variation (CV% = (s / mean) * 100) & RSD%
  const cv = mean !== 0 ? (sd / Math.abs(mean)) * 100 : 0;
  const rsd = cv;

  // Confidence Intervals (exact Student-t distribution)
  let ci95Lower = mean;
  let ci95Upper = mean;
  let ci99Lower = mean;
  let ci99Upper = mean;

  if (validCount > 1) {
    const df = validCount - 1;
    const t95 = criticalT(0.05, df);
    const t99 = criticalT(0.01, df);

    ci95Lower = mean - t95 * se;
    ci95Upper = mean + t95 * se;
    ci99Lower = mean - t99 * se;
    ci99Upper = mean + t99 * se;
  }

  // Sample Skewness (Fisher-Pearson adjusted)
  let skewness = 0;
  if (validCount >= 3 && sd > 0) {
    skewness = (validCount * m3) / ((validCount - 1) * (validCount - 2) * Math.pow(sd, 3));
  }

  // Sample Excess Kurtosis (Fisher adjusted)
  let kurtosis = 0;
  if (validCount >= 4 && sd > 0) {
    const term1 = (validCount * (validCount + 1) * m4) / ((validCount - 1) * (validCount - 2) * (validCount - 3) * Math.pow(sd, 4));
    const term2 = (3 * Math.pow(validCount - 1, 2)) / ((validCount - 2) * (validCount - 3));
    kurtosis = term1 - term2;
  }

  // Outlier Detection (Grubbs' Test & IQR Rule & Dixon Q)
  const outliers: OutlierPoint[] = [];

  // 1. IQR Rule
  const lowerInnerFence = q1 - 1.5 * iqr;
  const upperInnerFence = q3 + 1.5 * iqr;
  const lowerOuterFence = q1 - 3.0 * iqr;
  const upperOuterFence = q3 + 3.0 * iqr;

  // Check each replicate (including currently excluded ones for diagnostic visibility)
  replicates.forEach((rep) => {
    if (rep.rawValue === null || isNaN(rep.rawValue)) return;
    const val = rep.rawValue;

    let isOutlier = false;
    let severity: 'mild' | 'extreme' = 'mild';

    if (val < lowerOuterFence || val > upperOuterFence) {
      isOutlier = true;
      severity = 'extreme';
    } else if (val < lowerInnerFence || val > upperInnerFence) {
      isOutlier = true;
      severity = 'mild';
    }

    if (isOutlier) {
      outliers.push({
        groupName,
        replicateNumber: rep.repNumber,
        value: val,
        testMethod: 'iqr',
        score: Math.abs(val - median) / (iqr || 1),
        criticalValue: 1.5,
        isSignificant: true,
        type: severity,
        actionTaken: rep.isExcluded ? 'excluded_by_user' : 'kept'
      });
    }
  });

  // 2. Grubbs' Test (for validCount >= 3)
  if (validCount >= 3 && sd > 0) {
    const gCrit = grubbsCriticalValue(validCount, 0.05);
    let maxG = -1;
    let maxVal = values[0];
    let maxRepIndex = 1;

    validItems.forEach((item) => {
      const g = Math.abs((item.rawValue as number) - mean) / sd;
      if (g > maxG) {
        maxG = g;
        maxVal = item.rawValue as number;
        maxRepIndex = item.repNumber;
      }
    });

    if (maxG > gCrit) {
      // Avoid duplicate report if already identified by IQR
      const existing = outliers.find((o) => o.replicateNumber === maxRepIndex);
      if (!existing) {
        outliers.push({
          groupName,
          replicateNumber: maxRepIndex,
          value: maxVal,
          testMethod: 'grubbs',
          score: maxG,
          criticalValue: gCrit,
          isSignificant: true,
          type: 'extreme',
          actionTaken: 'kept'
        });
      }
    }
  }

  // 3. Dixon's Q test for 3 <= validCount <= 10 (Triplicates / small food lab samples)
  if (validCount >= 3 && validCount <= 10 && range > 0) {
    const qCrit = DIXON_Q_CRITICAL_95[validCount];
    if (qCrit) {
      const qLow = (sorted[1] - sorted[0]) / range;
      const qHigh = (sorted[sorted.length - 1] - sorted[sorted.length - 2]) / range;

      if (qLow > qCrit) {
        const rep = validItems.find((r) => r.rawValue === sorted[0]);
        if (rep && !outliers.some((o) => o.replicateNumber === rep.repNumber)) {
          outliers.push({
            groupName,
            replicateNumber: rep.repNumber,
            value: sorted[0],
            testMethod: 'dixon',
            score: qLow,
            criticalValue: qCrit,
            isSignificant: true,
            type: 'mild',
            actionTaken: rep.isExcluded ? 'excluded_by_user' : 'kept'
          });
        }
      }

      if (qHigh > qCrit) {
        const rep = validItems.find((r) => r.rawValue === sorted[sorted.length - 1]);
        if (rep && !outliers.some((o) => o.replicateNumber === rep.repNumber)) {
          outliers.push({
            groupName,
            replicateNumber: rep.repNumber,
            value: sorted[sorted.length - 1],
            testMethod: 'dixon',
            score: qHigh,
            criticalValue: qCrit,
            isSignificant: true,
            type: 'mild',
            actionTaken: rep.isExcluded ? 'excluded_by_user' : 'kept'
          });
        }
      }
    }
  }

  return {
    count: totalCount,
    validCount,
    excludedCount,
    sum,
    mean,
    median,
    variance,
    sd,
    se,
    cv,
    rsd,
    ci95Lower,
    ci95Upper,
    ci99Lower,
    ci99Upper,
    min,
    max,
    range,
    q1,
    q3,
    iqr,
    skewness,
    kurtosis,
    outliers
  };
}

function getPercentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];

  const index = p * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) {
    return sorted[lower];
  }
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}
