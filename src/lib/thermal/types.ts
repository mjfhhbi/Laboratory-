/**
 * Thermal Processing & Microbial Destruction Kinetics Types
 * 
 * References:
 * - Toledo, R.T. (2007). Fundamentals of Food Process Engineering (3rd Ed.), Chapter 7: Thermal Processing.
 * - Stumbo, C.R. (1973). Thermobacteriology in Food Processing (2nd Ed.), Academic Press.
 * - Singh, R.P., & Heldman, D.R. (2014). Introduction to Food Engineering (5th Ed.), Chapter 5.
 * - Pflug, I.J. (2003). Microbiology and Engineering of Sterilization Processes.
 * - FDA Center for Food Safety and Applied Nutrition: Fish and Fishery Products / Acidified and Low-Acid Canned Foods.
 */

export type InactivationOrder = 'order_1' | 'order_0';

export interface ReferenceMicroorganism {
  id: string;
  nameScientific: string;
  nameFa: string;
  targetFoodOrMatrix: string;
  riskCategory: 'pathogen_spore' | 'pathogen_vegetative' | 'spoilage_thermophile' | 'spoilage_mesophile' | 'enzyme_indicator' | 'quality_nutrient';
  referenceTemperatureC: number;
  dValueRefMin: number;
  dValueRefMax: number;
  dValueRefNominal: number; // minutes
  zValueNominal: number;    // °C
  recommendedLogReduction: number; // e.g. 12 for C. botulinum, 5 for juice pasteurization, 7 for poultry Salmonella
  citation: {
    authors: string;
    title: string;
    year: number;
    source: string;
  };
  notesFa: string;
}

export interface TimeTemperaturePoint {
  timeMinutes: number;
  temperatureC: number;
  lethalRate?: number;     // L = 10^((T - Tref)/z)
  cumulativeLethality?: number; // F(t)
}

export interface ThermalPenetrationProfile {
  id: string;
  titleFa: string;
  processType: 'still_retort' | 'agitating_retort' | 'htst_plate' | 'hot_fill' | 'aseptic_uht';
  containerType: string;
  productName: string;
  targetOrganismId: string;
  retortOrMediumTempC: number;
  initialTempC: number;
  points: TimeTemperaturePoint[];
  descriptionFa: string;
  referenceSource: string;
}

export interface DValueCalculationResult {
  dValue: number; // minutes
  initialCountN0: number;
  survivorCountNt: number;
  processTimeMinutes: number;
  logReduction: number;
  k1Constant: number; // min^-1, k1 = ln(10) / D
  regressionR2?: number;
  formulaLatex: string;
  substitutionLatex: string;
}

export interface ZValueCalculationResult {
  zValue: number; // °C
  temp1C: number;
  dValue1Min: number;
  temp2C: number;
  dValue2Min: number;
  regressionR2?: number;
  formulaLatex: string;
  substitutionLatex: string;
}

export interface FValueCalculationResult {
  fValue: number; // minutes at reference temperature
  targetLogReduction: number;
  referenceDValue: number;
  referenceTemperatureC: number;
  zValueC: number;
  targetMicroorganism: string;
  isBotulinumCook12D: boolean;
  formulaLatex: string;
  substitutionLatex: string;
}

export type ThermalProcessCategory = 
  | 'batch_retort'       // اتوکلاو دسته‌ای و سنتی (In-container Canning / Still Retort)
  | 'continuous_tube'    // پاستوریزاتور/استریلیزاتور پیوسته لوله‌ای (Continuous Flow)
  | 'htst'               // پاستوریزاسیون دمای بالا زمان کوتاه (HTST: 72-85°C, 15-30s)
  | 'uht_aseptic'        // استریلیزاسیون دمای فوق‌العاده بالا اسپتیک (UHT: 135-150°C, 2-10s)
  | 'in_container';      // حرارت‌دهی درون بسته‌بندی با اینرسی حرارتی بالا

export type InputTimeUnit = 'seconds' | 'minutes' | 'hours';

export interface ProcessTimeDiscretizationConfig {
  processCategory?: ThermalProcessCategory;
  inputTimeUnit?: InputTimeUnit;
  customMaxAllowedGapMinutes?: number;
}

export interface ThermalIntegrationResult {
  totalFValueTrapezoidal: number; // minutes
  totalFValueSimpson: number;     // minutes
  differencePercent: number;      // numerical error estimation
  processCategory: ThermalProcessCategory;
  inputTimeUnit: InputTimeUnit;
  criticalGapThresholdMinutes: number;
  maxTimeStepMinutes: number;     // Max dt between recorded points
  meanTimeStepMinutes: number;    // Average dt
  maxTempRateOfChangeCPerMin: number; // Max |dT/dt|
  timeDiscretizationQuality: 'excellent' | 'adequate' | 'large_gap_warning';
  discretizationWarningFa?: string;
  sensitivityNvsHalfNPercent: number; // Sensitivity to point density
  physicalSensorResolutionToleranceMin: number; // e.g. ±0.05 min
  f0ReportedRounded: number;      // Realistic decimal precision
  selectedIntegrationMethod: 'trapezoidal' | 'simpson_100_resampled';
  heatingPhaseLethality: number;
  holdingPhaseLethality: number;
  coolingPhaseLethality: number;
  totalTimeMinutes: number;
  maxTemperatureC: number;
  referenceTemperatureC: number;
  zValueC: number;
  targetOrganismName: string;
  targetFRequired: number;
  isProcessAdequate: boolean;
  lethalitySafetyMarginPercent: number;
  pointsWithLethality: TimeTemperaturePoint[];
  assumptions: string[];
  limitations: string[];
}

export interface CookValueResult {
  f0MicrobialLethality: number; // minutes (z = 10°C, Tref = 121.1°C)
  c0CookValueQuality: number;   // minutes (z = 33°C, Tref = 100°C)
  nutrientRetentionPercentThiamine: number;
  optimizationRationaleFa: string;
}
