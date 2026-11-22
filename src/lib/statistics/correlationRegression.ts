/**
 * Food Science AI - Correlation and Linear Regression Engine
 * Pearson's r, Spearman's rho, Ordinary Least Squares (OLS) Linear Regression,
 * R^2, Adjusted R^2, ANOVA for Regression, Confidence Intervals and Residuals.
 */

import { CorrelationRegressionAnalysis } from '../../types/statistics';
import { studentTPValue, fDistributionPValue, criticalT } from './distributions';

export interface DataPointXY {
  x: number;
  y: number;
}

export function calculateCorrelationAndRegression(
  points: DataPointXY[]
): CorrelationRegressionAnalysis {
  const n = points.length;

  if (n < 3) {
    return {
      pearsonR: 0,
      spearmanRho: 0,
      rSquared: 0,
      adjustedRSquared: 0,
      pValue: 1.0,
      isSignificant: false,
      tStatistic: 0,
      df: 1,
      ci95Lower: 0,
      ci95Upper: 0,
      slope: 0,
      intercept: 0,
      slopeSE: 0,
      interceptSE: 0,
      slopePValue: 1.0,
      interceptPValue: 1.0,
      standardErrorOfEstimate: 0,
      equation: 'y = 0x + 0',
      fStatistic: 0,
      fPValue: 1.0,
      residuals: []
    };
  }

  // 1. Means of X and Y
  let sumX = 0;
  let sumY = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  // 2. Sum of Squares and Cross Products
  let ssX = 0;
  let ssY = 0;
  let spXY = 0;

  for (const p of points) {
    const dx = p.x - meanX;
    const dy = p.y - meanY;
    ssX += dx * dx;
    ssY += dy * dy;
    spXY += dx * dy;
  }

  // Pearson Correlation Coefficient r
  let pearsonR = 0;
  if (ssX > 0 && ssY > 0) {
    pearsonR = spXY / Math.sqrt(ssX * ssY);
    // Bound to [-1, 1]
    pearsonR = Math.max(-1, Math.min(1, pearsonR));
  }

  const rSquared = pearsonR * pearsonR;
  const df = n - 2;

  // t-statistic for Pearson r: t = r * sqrt((n - 2) / (1 - r^2))
  let tStat = 0;
  let pValue = 1.0;
  if (Math.abs(pearsonR) < 1.0 && df > 0) {
    tStat = pearsonR * Math.sqrt(df / (1.0 - rSquared));
    pValue = studentTPValue(tStat, df);
  } else if (Math.abs(pearsonR) >= 1.0) {
    tStat = 999.0;
    pValue = 0.00001;
  }

  // 95% Confidence Interval for Pearson r (Fisher's z transformation)
  let ci95Lower = pearsonR;
  let ci95Upper = pearsonR;
  if (Math.abs(pearsonR) < 0.9999 && n > 3) {
    const z = 0.5 * Math.log((1 + pearsonR) / (1 - pearsonR));
    const seZ = 1 / Math.sqrt(n - 3);
    const zCrit = 1.95996; // 95% normal critical
    const zLow = z - zCrit * seZ;
    const zHigh = z + zCrit * seZ;
    ci95Lower = (Math.exp(2 * zLow) - 1) / (Math.exp(2 * zLow) + 1);
    ci95Upper = (Math.exp(2 * zHigh) - 1) / (Math.exp(2 * zHigh) + 1);
  }

  // 3. Spearman's Rank Correlation Rho
  const spearmanRho = calculateSpearmanRho(points);

  // 4. OLS Linear Regression: y = slope * x + intercept
  let slope = 0;
  let intercept = 0;
  if (ssX > 0) {
    slope = spXY / ssX;
    intercept = meanY - slope * meanX;
  }

  // Residuals: e_i = y_i - y_hat_i
  let ssResidual = 0;
  let ssRegression = 0;
  const residuals: Array<{ x: number; y: number; yPred: number; residual: number }> = [];

  for (const p of points) {
    const yPred = slope * p.x + intercept;
    const res = p.y - yPred;
    ssResidual += res * res;
    const regDiff = yPred - meanY;
    ssRegression += regDiff * regDiff;
    residuals.push({
      x: p.x,
      y: p.y,
      yPred: Number(yPred.toFixed(4)),
      residual: Number(res.toFixed(4))
    });
  }

  // Standard Error of Regression
  const standardErrorOfEstimate = df > 0 ? Math.sqrt(ssResidual / df) : 0;

  // Standard Errors of Slope and Intercept
  const slopeSE = ssX > 0 && df > 0 ? standardErrorOfEstimate / Math.sqrt(ssX) : 0;
  const interceptSE = ssX > 0 && df > 0
    ? standardErrorOfEstimate * Math.sqrt(1 / n + (meanX * meanX) / ssX)
    : 0;

  // Slope and Intercept p-values
  const slopeT = slopeSE > 0 ? slope / slopeSE : 0;
  const slopePValue = df > 0 ? studentTPValue(slopeT, df) : 1.0;
  const interceptT = interceptSE > 0 ? intercept / interceptSE : 0;
  const interceptPValue = df > 0 ? studentTPValue(interceptT, df) : 1.0;

  // F-statistic for Regression
  const msRegression = ssRegression; // df = 1
  const msResidual = df > 0 ? ssResidual / df : 0;
  const fStatistic = msResidual > 0 ? msRegression / msResidual : 0;
  const fPValue = df > 0 ? fDistributionPValue(fStatistic, 1, df) : 1.0;

  // Adjusted R^2
  const adjustedRSquared = df > 0 ? 1 - ((1 - rSquared) * (n - 1)) / df : rSquared;

  // Formatted Equation
  const sign = intercept >= 0 ? '+' : '-';
  const equation = `y = ${slope.toFixed(4)}x ${sign} ${Math.abs(intercept).toFixed(4)}`;

  return {
    pearsonR: Number(pearsonR.toFixed(4)),
    spearmanRho: Number(spearmanRho.toFixed(4)),
    rSquared: Number(rSquared.toFixed(4)),
    adjustedRSquared: Number(adjustedRSquared.toFixed(4)),
    pValue: Number(pValue.toFixed(4)),
    isSignificant: pValue < 0.05,
    tStatistic: Number(tStat.toFixed(4)),
    df,
    ci95Lower: Number(ci95Lower.toFixed(4)),
    ci95Upper: Number(ci95Upper.toFixed(4)),
    slope: Number(slope.toFixed(4)),
    intercept: Number(intercept.toFixed(4)),
    slopeSE: Number(slopeSE.toFixed(4)),
    interceptSE: Number(interceptSE.toFixed(4)),
    slopePValue: Number(slopePValue.toFixed(4)),
    interceptPValue: Number(interceptPValue.toFixed(4)),
    standardErrorOfEstimate: Number(standardErrorOfEstimate.toFixed(4)),
    equation,
    fStatistic: Number(fStatistic.toFixed(4)),
    fPValue: Number(fPValue.toFixed(4)),
    residuals
  };
}

function calculateSpearmanRho(points: DataPointXY[]): number {
  const n = points.length;
  if (n < 3) return 0;

  // Rank X
  const rankedX = rankArray(points.map((p) => p.x));
  // Rank Y
  const rankedY = rankArray(points.map((p) => p.y));

  // Compute difference of ranks: d_i = R(x_i) - R(y_i)
  let sumD2 = 0;
  for (let i = 0; i < n; i++) {
    const d = rankedX[i] - rankedY[i];
    sumD2 += d * d;
  }

  // Spearman formula: rho = 1 - (6 * sum(d_i^2)) / (n * (n^2 - 1))
  const rho = 1 - (6 * sumD2) / (n * (n * n - 1));
  return Math.max(-1, Math.min(1, rho));
}

function rankArray(arr: number[]): number[] {
  const n = arr.length;
  const indexed = arr.map((val, idx) => ({ val, idx }));
  indexed.sort((a, b) => a.val - b.val);

  const ranks = new Array(n).fill(0);
  let i = 0;
  while (i < n) {
    let j = i;
    while (j < n && indexed[j].val === indexed[i].val) {
      j++;
    }
    const avgRank = (i + 1 + j) / 2;
    for (let m = i; m < j; m++) {
      ranks[indexed[m].idx] = avgRank;
    }
    i = j;
  }
  return ranks;
}
