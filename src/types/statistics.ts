/**
 * Food Science AI - Statistical Analysis Engine Types
 * Definitions for Datasets, Experimental Design, Descriptive Stats,
 * Normality, Homogeneity, ANOVA, Post-Hoc (Tukey/Duncan), Correlation & Regression.
 */

export type ExperimentalDesignType = 
  | 'crd'               // Completely Randomized Design (طرح کاملاً تصادفی یک‌طرفه)
  | 'rcbd'              // Randomized Complete Block Design (بلوک‌های کامل تصادفی)
  | 'factorial_2factor' // Two-Factor Factorial Design (فاکتوریل ۲ فاکتوره)
  | 'repeated_measures' // Repeated Measures / Time Series (اندازه‌گیری‌های مکرر طولی)
  | 'paired_samples';   // Paired Samples (نمونه‌های جفت‌شده قبل/بعد)

export interface RawReplicate {
  id: string;
  repNumber: number; // 1, 2, 3...
  rawValue: number | null; // Raw user value entered in UI
  isExcluded?: boolean; // If true, user explicitly excluded this value from statistical analysis
  exclusionReason?: string;
  notes?: string;
}

export interface TreatmentGroup {
  id: string;
  name: string; // e.g. "Control", "Thyme Extract 0.5%", "Thyme Extract 1.0%"
  treatmentLabel?: string; // e.g. "T1", "40°C"
  factorValues?: Record<string, string>;
  factorAValue?: string; // For 2-factor designs (e.g. "0.5%")
  factorBValue?: string; // For 2-factor designs (e.g. "4°C")
  blockId?: string; // For RCBD (e.g. "Block 1", "Block 2")
  replicates: RawReplicate[];
  color?: string;
}

export interface StatisticalDataset {
  id: string;
  title: string;
  description: string;
  foodMatrix: string; // e.g. "روغن خوراکی", "فیله ماهی", "کنسرو رب گوجه‌فرنگی"
  designType: ExperimentalDesignType;
  responseVariable: {
    name: string; // e.g. "عدد پراکسید (Peroxide Value)", "شمارش کلی باکتری‌ها (TVC)"
    unit?: string; // e.g. "meq O2/kg", "log CFU/g", "N", "mg/100g"
    symbol?: string; // e.g. "PV", "Firmness", "pH"
  };
  independentFactors: Array<{
    id: string;
    name: string; // e.g. "غلظت عصاره", "دما", "زمان نگهداری"
    unit?: string; // e.g. "%", "°C", "روز"
    levels?: string[];
  }>;
  groups: TreatmentGroup[];
  alphaLevel: number;
  pairedMode?: boolean;
  createdAt: string;
  updatedAt: string;
  userClarifications?: Record<string, string>; // Answers to interactive statistical questions
}

export interface OutlierPoint {
  groupName: string;
  replicateNumber: number;
  value: number;
  testMethod: 'grubbs' | 'iqr' | 'zscore' | 'dixon';
  score: number; // Z-score or G-score
  criticalValue: number;
  isSignificant: boolean;
  type: 'mild' | 'extreme';
  actionTaken: 'kept' | 'excluded_by_user';
}

export interface DescriptiveStats {
  count: number;
  validCount: number;
  excludedCount: number;
  sum: number;
  mean: number;
  median: number;
  variance: number;
  sd: number; // Sample Standard Deviation
  se: number; // Standard Error of Mean
  cv: number; // Coefficient of Variation (%)
  rsd: number; // Relative Standard Deviation (%) = CV
  ci95Lower: number;
  ci95Upper: number;
  ci99Lower: number;
  ci99Upper: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
  outliers: OutlierPoint[];
}

export interface NormalityTestResult {
  testName: 'Shapiro-Wilk' | "D'Agostino-Pearson" | 'Jarque-Bera';
  statistic: number;
  criticalOrW: number;
  pValue: number;
  isNormal: boolean;
  interpretationFa: string;
}

export interface HomogeneityTestResult {
  testName: "Levene's Test" | "Bartlett's Test" | "Hartley's F-max";
  statistic: number;
  df1: number;
  df2: number;
  pValue: number;
  isHomogeneous: boolean;
  interpretationFa: string;
}

export interface AssumptionVerificationReport {
  overallStatus: 'valid' | 'warning' | 'invalid';
  summaryFa: string;
  normalityOverall: NormalityTestResult;
  normalityPerGroup: Record<string, NormalityTestResult>;
  homogeneity: HomogeneityTestResult;
  sampleSizeEvaluation: {
    minReplicates: number;
    maxReplicates: number;
    isBalanced: boolean;
    isAdequate: boolean; // Replicates >= 3 per group
    warningFa?: string;
  };
  warnings: string[];
  recommendations: string[];
  requiresClarification: boolean;
  clarificationQuestions: Array<{
    id: string;
    questionFa: string;
    helpFa?: string;
    options: Array<{
      value: string;
      labelFa: string;
      statisticalImpactFa: string;
    }>;
  }>;
}

export interface AnovaSourceRow {
  sourceFa: string;
  sourceEn: string;
  ss: number;
  df: number;
  ms: number;
  f: number | null;
  pValue: number | null;
  significant: boolean;
}

export interface PairwiseComparison {
  groupA: string;
  groupB: string;
  meanA: number;
  meanB: number;
  difference: number;
  seDiff: number;
  qOrTStat: number;
  pValue: number;
  significant: boolean;
  ciLower: number;
  ciUpper: number;
}

export interface PostHocResult {
  method: 'tukey_hsd' | 'duncan' | 'lsd';
  methodNameFa: string;
  alpha: number;
  isEligible: boolean;
  ineligibleReasonFa?: string;
  groupLetters: Record<string, string>; // e.g. { "Control": "a", "T1": "b", "T2": "c" }
  comparisons: PairwiseComparison[];
}

export interface AnovaAnalysisResult {
  designType: ExperimentalDesignType;
  table: AnovaSourceRow[];
  totalSS: number;
  totalDf: number;
  fValue: number;
  pValue: number;
  isSignificant: boolean;
  etaSquared: number; // Effect size (SS_treatment / SS_total)
  omegaSquared: number; // Less biased effect size
  postHoc: PostHocResult;
  nonParametricKruskalWallis?: {
    hStatistic: number;
    df: number;
    pValue: number;
    isSignificant: boolean;
    interpretationFa: string;
  };
}

export interface CorrelationRegressionAnalysis {
  pearsonR: number;
  spearmanRho: number;
  rSquared: number;
  adjustedRSquared: number;
  pValue: number;
  isSignificant: boolean;
  tStatistic: number;
  df: number;
  ci95Lower: number;
  ci95Upper: number;
  
  // Regression
  slope: number;
  intercept: number;
  slopeSE: number;
  interceptSE: number;
  slopePValue: number;
  interceptPValue: number;
  standardErrorOfEstimate: number; // Syx
  equation: string; // "y = 1.452x + 0.120"
  fStatistic: number;
  fPValue: number;
  residuals: Array<{ x: number; y: number; yPred: number; residual: number }>;
}
