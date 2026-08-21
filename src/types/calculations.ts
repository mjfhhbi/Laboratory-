export type UnitCategory = 
  | 'mass' 
  | 'volume' 
  | 'temperature' 
  | 'concentration' 
  | 'pressure' 
  | 'time' 
  | 'percent' 
  | 'dimensionless';

export interface UnitDefinition {
  code: string;
  symbol: string;
  labelFa: string;
  labelEn: string;
  category: UnitCategory;
  baseRatio: number; // Factor to convert to base unit (e.g., 1000 for g -> mg, 1 for g -> g)
  offset?: number;    // Offset for units like temperature (e.g. °C -> K)
  descriptionFa?: string;
}

export interface FormulaVariable {
  id: string;
  symbol: string;
  nameFa: string;
  nameEn: string;
  descriptionFa?: string;
  category: UnitCategory;
  defaultUnit: string;
  allowedUnits: string[];
  min?: number;
  max?: number;
  required: boolean;
  defaultValue?: number;
  options?: { label: string; value: number; description?: string }[];
}

export interface FormulaConstantOption {
  labelFa: string;
  value: number;
  noteFa?: string;
}

export interface FormulaConstant {
  id: string;
  symbol: string;
  nameFa: string;
  nameEn: string;
  value: number;
  unit?: string;
  descriptionFa?: string;
  options?: FormulaConstantOption[];
}

export interface CalculationTraceStep {
  stepNumber: number;
  titleFa: string;
  expression: string;
  substitutedExpression: string;
  intermediateValue: number | string;
  unit: string;
  noteFa?: string;
}

export interface CalculationResult {
  success: boolean;
  value: number | null;
  formattedValue: string;
  unit: string;
  decimals: number;
  standardReference?: string;
  isScientificallyValid: boolean;
  trace: CalculationTraceStep[];
  warnings: string[];
  errors: string[];
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CalculationOptions {
  decimals?: number;
  targetUnit?: string;
  inputUnits?: Record<string, string>;
  allowUnvalidated?: boolean;
}

export type FormulaCategory = 
  | 'proximate_analysis' 
  | 'titration_chemistry' 
  | 'solutions_dilution' 
  | 'physical_chemical' 
  | 'statistical' 
  | 'custom';

export interface FormulaDefinition {
  id: string;
  nameFa: string;
  nameEn: string;
  category: FormulaCategory;
  standardReference: string;
  standardReferenceDocId?: string;
  expressionLatex: string;
  expressionDisplay: string;
  variables: FormulaVariable[];
  constants?: FormulaConstant[];
  outputUnit: string;
  defaultDecimals: number;
  scientificNotesFa?: string;
  isCustom?: boolean;
  customExpression?: string;
  execute: (inputs: Record<string, number | undefined>, options?: CalculationOptions) => CalculationResult;
  validateInputs: (inputs: Record<string, number | undefined>, inputUnits?: Record<string, string>) => { 
    valid: boolean; 
    errors: string[]; 
    warnings: string[]; 
  };
}

export interface StatisticalSummary {
  count: number;
  rawValues: number[];
  sum: number;
  mean: number;
  variance: number;
  stdDev: number;
  rsdPercent: number;
  stdError: number;
  min: number;
  max: number;
  range: number;
  median: number;
  referenceValue?: number;
  errorPercentAgainstRef?: number;
  confidenceInterval95: {
    lower: number;
    upper: number;
    marginOfError: number;
  };
  outliers: {
    value: number;
    index: number;
    test: string;
    noteFa: string;
  }[];
  trace: CalculationTraceStep[];
  warnings: string[];
  errors: string[];
}

export interface DilutionCalculationInput {
  c1?: number;
  v1?: number;
  c2?: number;
  v2?: number;
  c1Unit?: string;
  v1Unit?: string;
  c2Unit?: string;
  v2Unit?: string;
  solveFor: 'v1' | 'c2' | 'c1' | 'v2';
}

export interface CustomFormulaRecord {
  id: string;
  nameFa: string;
  nameEn: string;
  category: FormulaCategory;
  standardReference: string;
  expression: string;
  variables: FormulaVariable[];
  outputUnit: string;
  defaultDecimals: number;
  descriptionFa?: string;
  createdAt: string;
  updatedAt: string;
}
