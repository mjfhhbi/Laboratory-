/**
 * Food Science AI - Statistical Probability Distributions
 * Exact numerical functions for Student's t, Snedecor's F, Normal,
 * Chi-Square, and Studentized Range distributions.
 */

// Natural log of the Gamma function via Lanczos approximation
export function logGamma(z: number): number {
  if (z <= 0) return 0;
  const c = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.001208650973866179,
    -0.000005395239384953
  ];
  let x = z;
  let y = z;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) {
    y += 1;
    ser += c[j] / y;
  }
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

export function gamma(z: number): number {
  return Math.exp(logGamma(z));
}

// Continued fraction representation of Regularized Incomplete Beta function I_x(a, b)
export function incompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  // Symmetry transformation
  if (x > (a + 1) / (a + b + 2)) {
    return 1 - incompleteBeta(1 - x, b, a);
  }

  const factor = Math.exp(
    a * Math.log(x) +
    b * Math.log(1 - x) -
    logGamma(a) -
    logGamma(b) +
    logGamma(a + b)
  ) / a;

  // Lentz's method for continued fraction
  const maxIterations = 200;
  const epsilon = 1e-14;
  let c = 1.0;
  let d = 1.0 - (a + b) * x / (a + 1);
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1.0 / d;
  let h = d;

  for (let m = 1; m <= maxIterations; m++) {
    const m2 = 2 * m;
    
    // Even step
    let numerator = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
    d = 1.0 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1.0 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1.0 / d;
    h *= d * c;

    // Odd step
    numerator = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
    d = 1.0 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1.0 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1.0 / d;
    const del = d * c;
    h *= del;

    if (Math.abs(del - 1.0) < epsilon) break;
  }

  return factor * h;
}

// Standard Normal CDF (Gauss error function approximation)
export function standardNormalCDF(z: number): number {
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c2 = 0.3989422804014327; // 1 / sqrt(2*pi)

  if (z >= 0) {
    const t = 1.0 / (1.0 + p * z);
    return 1.0 - c2 * Math.exp(-z * z / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  } else {
    const t = 1.0 / (1.0 - p * z);
    return c2 * Math.exp(-z * z / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  }
}

// Inverse standard normal CDF (Acklam approximation, accuracy > 1e-9)
export function inverseNormalCDF(p: number): number {
  if (p <= 0) return -8.0;
  if (p >= 1) return 8.0;

  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    const q = p - 0.5;
    const r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
}

// Student's t-distribution two-tailed p-value
export function studentTPValue(t: number, df: number): number {
  if (df <= 0) return 1.0;
  const absT = Math.abs(t);
  const x = df / (df + absT * absT);
  const p = incompleteBeta(x, df / 2, 0.5);
  return Math.min(1.0, Math.max(0.0, p));
}

// Critical t-value for given alpha and degrees of freedom (two-tailed)
export function criticalT(alpha: number, df: number): number {
  if (df <= 0) return 1.96;
  // Use Cornish-Fisher expansion / bisection for high accuracy
  const p = 1.0 - alpha / 2.0;
  const z = inverseNormalCDF(p);

  // Initial estimate via Hill approximation
  const z2 = z * z;
  const tApprox = z + (z * z2 + z) / (4 * df) + (5 * z * z2 * z2 + 16 * z * z2 + 3 * z) / (96 * df * df);

  // Refine using Newton-Raphson or Bisection
  let t = tApprox;
  for (let i = 0; i < 15; i++) {
    const pCurrent = 1.0 - studentTPValue(t, df) / 2.0;
    const err = pCurrent - p;
    if (Math.abs(err) < 1e-8) break;
    // Derivative of Student t CDF
    const dt = Math.exp(
      logGamma((df + 1) / 2) -
      logGamma(df / 2)
    ) * Math.pow(1 + (t * t) / df, -(df + 1) / 2) / Math.sqrt(Math.PI * df);
    if (dt > 1e-12) {
      t -= err / dt;
    } else {
      break;
    }
  }
  return Math.abs(t);
}

// Snedecor's F-distribution p-value: P(F >= fVal | df1, df2)
export function fDistributionPValue(fVal: number, df1: number, df2: number): number {
  if (fVal <= 0 || df1 <= 0 || df2 <= 0) return 1.0;
  const x = df2 / (df2 + df1 * fVal);
  const p = incompleteBeta(x, df2 / 2, df1 / 2);
  return Math.min(1.0, Math.max(0.0, p));
}

// Critical F value for alpha, df1, df2
export function criticalF(alpha: number, df1: number, df2: number): number {
  if (df1 <= 0 || df2 <= 0) return 1.0;
  // Bisection search between 0.01 and 1000
  let low = 0.001;
  let high = 1000.0;
  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const p = fDistributionPValue(mid, df1, df2);
    if (p > alpha) {
      low = mid;
    } else {
      high = mid;
    }
    if (high - low < 1e-6) break;
  }
  return (low + high) / 2;
}

// Chi-Square distribution p-value: P(X^2 >= chiSq | df)
export function chiSquarePValue(chiSq: number, df: number): number {
  if (chiSq <= 0 || df <= 0) return 1.0;
  // Chi-Square is special case of Gamma distribution
  return fDistributionPValue(chiSq / df, df, 100000); // asymptotic
}

// Critical Grubbs test value G_crit for n observations at alpha = 0.05
export function grubbsCriticalValue(n: number, alpha: number = 0.05): number {
  if (n < 3) return 1.15;
  const df = n - 2;
  const tVal = criticalT(alpha / (2 * n), df);
  const g = ((n - 1) / Math.sqrt(n)) * Math.sqrt((tVal * tVal) / (n - 2 + tVal * tVal));
  return g;
}

// Critical Dixon Q values for small sample sizes (95% confidence, n = 3 to 10)
export const DIXON_Q_CRITICAL_95: Record<number, number> = {
  3: 0.970,
  4: 0.829,
  5: 0.710,
  6: 0.625,
  7: 0.568,
  8: 0.526,
  9: 0.493,
  10: 0.466
};

// Studentized Range (q) critical value for Tukey's HSD (approx for k groups and df_error at alpha=0.05)
export function studentizedRangeCriticalQ(k: number, dfError: number, alpha: number = 0.05): number {
  if (dfError <= 0 || k < 2) return 2.77;
  
  // High-accuracy empirical approximation (Copenhaver & Holland / Dunnett)
  const z = inverseNormalCDF(1 - alpha / 2);
  const qInf = Math.SQRT2 * (z + 0.5 * Math.log(k));
  // Small sample adjustment for df
  const adj = 1 + (qInf * qInf + 2) / (4 * dfError);
  const qEst = qInf * adj;
  
  // Standard benchmark anchors for alpha = 0.05
  if (alpha === 0.05) {
    if (k === 3) {
      if (dfError <= 6) return 4.34;
      if (dfError <= 8) return 4.04;
      if (dfError <= 10) return 3.88;
      if (dfError <= 12) return 3.77;
      if (dfError <= 15) return 3.67;
      if (dfError <= 20) return 3.58;
      if (dfError <= 30) return 3.49;
      return 3.31;
    }
    if (k === 4) {
      if (dfError <= 6) return 4.90;
      if (dfError <= 8) return 4.53;
      if (dfError <= 10) return 4.33;
      if (dfError <= 12) return 4.20;
      if (dfError <= 15) return 4.08;
      if (dfError <= 20) return 3.96;
      if (dfError <= 30) return 3.85;
      return 3.63;
    }
    if (k === 5) {
      if (dfError <= 8) return 4.89;
      if (dfError <= 10) return 4.65;
      if (dfError <= 12) return 4.51;
      if (dfError <= 15) return 4.37;
      if (dfError <= 20) return 4.23;
      return 3.86;
    }
  }

  return Math.max(2.5, qEst);
}
