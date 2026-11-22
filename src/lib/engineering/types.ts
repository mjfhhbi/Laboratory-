/**
 * Advanced M.Sc. Food Engineering & Applied Mathematics Engine Types
 * References:
 * - Toledo: Fundamentals of Food Process Engineering (3rd & 4th Ed.)
 * - Singh & Heldman: Introduction to Food Engineering (5th Ed.)
 * - Geankoplis: Transport Processes and Separation Process Principles (4th Ed.)
 * - Bird, Stewart, Lightfoot: Transport Phenomena (2nd Ed.)
 * - Chapra & Canale: Numerical Methods for Engineers (7th Ed.)
 */

export type MscTopicCategory =
  | 'calculus_ode_pde'          // حساب دیفرانسیل، انتگرال و معادلات دیفرانسیل
  | 'linear_algebra_matrices'   // جبر خطی، ماتریس‌ها و دستگاه معادلات
  | 'nonlinear_root_finding'    // حل معادلات غیرخطی (نیوتن-رافسون و دونیم‌سازی)
  | 'numerical_methods'         // محاسبات عددی، درونیابی و تحلیل خطا
  | 'optimization_regression'   // بهینه‌سازی سیمپلکس و رگرسیون غیرخطی
  | 'mass_energy_balance'       // موازنه جرم و انرژی و اواپراتور
  | 'heat_transfer_freezing'    // انتقال حرارت و انجماد پلانک
  | 'fluid_mechanics_rheology'  // مکانیک سیالات و رئولوژی لوله‌ها
  | 'thermodynamics_drying';    // ترمودینامیک و سایکرومتری هوای مرطوب

export interface VariableDefinition {
  name: string;
  symbol: string;
  unit: string;
  dimension: string; // e.g. [M][L]^-1[T]^-2 for Pa
  description: string;
  defaultValue: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

export interface CalculationStep {
  stepNumber: number;
  title: string;
  formulaLatex: string;
  substitutionLatex: string;
  resultLatex: string;
  notes?: string;
}

export interface DimensionalAudit {
  isConsistent: boolean;
  lhsDimension: string;
  rhsDimension: string;
  notes: string;
}

export interface NumericalErrorInfo {
  methodName: string;
  orderOfAccuracy: string; // e.g. O(h^2), O(h^4), Quadratic
  estimatedError?: string;
  conditionNumber?: number;
  iterationCount?: number;
  tolerance: number;
  limitations: string[];
}

export interface ScientificCitation {
  authors: string;
  title: string;
  publisherOrJournal: string;
  year: number;
  chapterOrPage: string;
  equationNumber?: string;
}

export interface MscSolutionResult {
  problemId: string;
  problemTitle: string;
  topicCategory: MscTopicCategory;
  primaryFormulaLatex: string;
  substitutionLatex: string;
  steps: CalculationStep[];
  finalResult: {
    value: number | string;
    displayFormatted: string;
    unit: string;
    significantDigits: number;
  };
  dimensionalAudit: DimensionalAudit;
  errorReport: NumericalErrorInfo;
  scientificCitation: ScientificCitation;
  sympyPythonCode: string;
  iterationTable?: Array<Record<string, number | string>>;
}

export interface MscEngineeringProblem {
  id: string;
  title: string;
  topicCategory: MscTopicCategory;
  summaryDescription: string;
  governingEquationLatex: string;
  variables: VariableDefinition[];
  solve: (inputs: Record<string, number>) => MscSolutionResult;
  generateSympyScript: (inputs: Record<string, number>) => string;
}
