/**
 * Types and interfaces for Food Formulation Optimization & Linear Programming Engine
 */

export interface FormulationIngredient {
  id: string;
  nameFa: string;
  nameEn: string;
  categoryFa: 'گوشت و پروتئین' | 'روغن و چربی' | 'غلات و نشاسته' | 'شیرین‌کننده' | 'امولسیفایر و صمغ' | 'افزودنی و نمک' | 'آب و مایعات' | 'لبنیات';
  
  // Cost per unit (Tomans/kg or Currency/kg) with timestamp
  costPerKg: number;
  costCurrency: string;
  priceDate: string; // YYYY-MM-DD
  
  // Proximate composition (g / 100g or %)
  proteinPercent: number;
  fatPercent: number;
  moisturePercent: number;
  ashPercent: number;
  carbohydratePercent: number;
  sodiumMgPer100g: number;
  
  // Usage bounds in formula (0 to 100%)
  minPercent: number;
  maxPercent: number;
  
  // Literature or database source
  compositionSource: string;
  notesFa?: string;
}

export type ConstraintNutrientKey = 
  | 'protein' 
  | 'fat' 
  | 'moisture' 
  | 'ash' 
  | 'carbohydrate' 
  | 'sodium';

export interface FormulationNutrientConstraint {
  id: string;
  nutrientKey: ConstraintNutrientKey;
  nameFa: string;
  nameEn: string;
  unit: '%' | 'mg/100g';
  minValue?: number; // Minimum required
  maxValue?: number; // Maximum allowed
  standardSourceFa: string; // INSO, Codex, USDA
  isMandatory: boolean;
}

export interface FormulationProblem {
  id: string;
  nameFa: string;
  nameEn: string;
  batchSizeKg: number; // e.g. 100 kg
  categoryFa: string;
  ingredients: FormulationIngredient[];
  constraints: FormulationNutrientConstraint[];
  targetLossPercent?: number; // Evaporation / cooking yield loss
  standardReference: string;
  descriptionFa: string;
}

export interface IngredientResultShare {
  ingredientId: string;
  nameFa: string;
  nameEn: string;
  costPerKg: number;
  percentage: number; // 0 to 100%
  batchQuantityKg: number; // in kg for batchSizeKg
  costContribution: number; // cost per kg contribution
  costPercentOfTotal: number;
  reducedCost?: number; // Shadow cost in LP
}

export interface CalculatedNutrientProfile {
  protein: number;
  fat: number;
  moisture: number;
  ash: number;
  carbohydrate: number;
  sodium: number; // mg/100g
  caloriesKcal: number; // Atwater factors: 4*protein + 9*fat + 4*carb
}

export interface ConstraintCheckResult {
  constraintId: string;
  nameFa: string;
  unit: string;
  actualValue: number;
  minValue?: number;
  maxValue?: number;
  status: 'passed' | 'min_violated' | 'max_violated';
  slackOrSurplus: number;
  shadowPrice?: number; // Dual variable ($/unit change in constraint bound)
}

export interface InfeasibilityDiagnostic {
  isFeasible: boolean;
  failureReasonFa?: string;
  conflictingConstraints: string[];
  suggestedCorrectionsFa: string[];
}

export interface OptimizationResult {
  isFeasible: boolean;
  statusMessageFa: string;
  statusMessageEn: string;
  totalCostPerKg: number;
  totalCostBatch: number;
  costCurrency: string;
  totalPercentage: number; // Should equal 100%
  
  ingredientShares: IngredientResultShare[];
  calculatedNutrition: CalculatedNutrientProfile;
  constraintChecks: ConstraintCheckResult[];
  
  infeasibility?: InfeasibilityDiagnostic;
  
  // Sensitivity Analysis
  shadowPrices: {
    constraintNameFa: string;
    shadowPrice: number;
    interpretationFa: string;
  }[];
  
  iterationsCount: number;
  solverMethod: string;
}

export interface SavedFormulation {
  id: string;
  title: string;
  problemId: string;
  dateSaved: string;
  totalCostPerKg: number;
  calculatedNutrition: CalculatedNutrientProfile;
  ingredientShares: IngredientResultShare[];
}
