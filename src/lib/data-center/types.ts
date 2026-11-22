/**
 * Types and interfaces for Scientific Data Analysis & Validation Center
 */

export type ColumnDataType = 'numeric' | 'categorical' | 'datetime' | 'boolean' | 'unknown';

export interface DataColumnMeta {
  key: string;
  labelFa: string;
  labelEn: string;
  dataType: ColumnDataType;
  unit?: string;
  missingCount: number;
  totalCount: number;
  minAllowed?: number;
  maxAllowed?: number;
  isPhysicalValid: boolean;
}

export interface DataValidationIssue {
  severity: 'error' | 'warning' | 'info';
  type: 'missing_values' | 'out_of_bounds' | 'type_mismatch' | 'low_sample_size' | 'normality_violation';
  columnKey: string;
  messageFa: string;
  messageEn: string;
  affectedRowIndices: number[];
  suggestionFa: string;
}

export interface DatasetValidationReport {
  isValid: boolean;
  totalRows: number;
  totalColumns: number;
  missingCellsCount: number;
  columnsMeta: DataColumnMeta[];
  issues: DataValidationIssue[];
  isRealExperimentalData: boolean;
  sourceDescriptionFa: string;
}

export interface AdvancedDescriptiveStats {
  columnKey: string;
  columnLabel: string;
  n: number;
  mean: number;
  median: number;
  mode?: number;
  variance: number;
  standardDeviation: number;
  standardErrorOfMean: number;
  coefficientOfVariation: number; // CV %
  min: number;
  max: number;
  range: number;
  sum: number;
  p25: number;
  p75: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
  ci95Lower: number;
  ci95Upper: number;
  ci99Lower: number;
  ci99Upper: number;
}

export interface OutlierRecord {
  rowIndex: number;
  value: number;
  method: 'tukey_iqr' | 'z_score' | 'grubbs';
  score: number; // Z-score value or distance from Tukey boundary
  category: 'mild' | 'extreme';
  recommendationFa: string;
}

export interface OutlierAnalysisReport {
  columnKey: string;
  columnLabel: string;
  totalCount: number;
  outliersCount: number;
  tukeyLowerBound: number;
  tukeyUpperBound: number;
  outliers: OutlierRecord[];
  grubbsTestResult?: {
    gStatistic: number;
    criticalG: number;
    isOutlierSignificant: boolean;
    suspectValue: number;
  };
}

export type RegressionModelType = 
  | 'linear' 
  | 'polynomial_2' 
  | 'power' 
  | 'exponential' 
  | 'logarithmic';

export type DataSequenceNature = 
  | 'time_series'           // سری زمانی (ترتیب زمانی قطعی)
  | 'ordered_sequence'      // داده‌های دارای توالی آزمایشی یا فرآیندی مشخص
  | 'cross_sectional'       // داده‌های مقطعی بدون ترتیب زمانی (آزمون نامعتبر)
  | 'unspecified';          // نامشخص (نیازمند تعیین توسط کاربر)

export interface FittedRegressionResult {
  modelType: RegressionModelType;
  modelNameFa: string;
  modelNameEn: string;
  equationString: string;
  formulaLatex: string;
  parameters: Record<string, { value: number; symbol: string; nameFa: string }>;
  rSquared: number;
  adjustedRSquared: number;
  rmse: number;
  pearsonR: number;
  pValue: number;
  dataSequenceNature: DataSequenceNature;
  isDurbinWatsonValid: boolean;
  durbinWatsonStatistic: number | null; // Autocorrelation of residuals (valid only for time series or ordered sequences)
  durbinWatsonFormulaLatex: string;
  isDataOrderedByX: boolean;
  durbinWatsonInterpretationFa: string;
  durbinWatsonWarning?: string;
  standardErrorEstimate: number;
  residuals: { x: number; actualY: number; predictedY: number; residual: number }[];
  fittedCurve: { x: number; y: number }[];
}

export interface HypothesisTestResult {
  testType: 'one_sample_t' | 'two_sample_t' | 'paired_t' | 'shapiro_wilk';
  testNameFa: string;
  testNameEn: string;
  nullHypothesisH0: string;
  alternativeHypothesisH1: string;
  testStatistic: number;
  statisticSymbol: 't' | 'W' | 'Z';
  degreesOfFreedom: number;
  pValue: number;
  isStatisticallySignificant: boolean; // p < 0.05
  confidenceInterval95?: [number, number];
  interpretationFa: string;
  assumptionsVerified: boolean;
}

export interface UncertaintyPropagationResult {
  formulaNameFa: string;
  formulaExpression: string;
  nominalResult: number;
  combinedUncertaintyAbsolute: number;
  relativeUncertaintyPercent: number;
  confidenceInterval95: [number, number];
  expandedUncertaintyK2: number; // k=2 (95.45% coverage)
  derivationStepsFa: string[];
}

export interface BenchmarkDatasetInfo {
  id: string;
  titleFa: string;
  titleEn: string;
  category: 'kinetics' | 'rheology' | 'analytical_chemistry' | 'quality_control';
  descriptionFa: string;
  sourceCitation: string;
  defaultXCol: string;
  defaultYCol: string;
  data: Record<string, any>[];
  units: Record<string, string>;
  isRealExperimental: boolean;
}
