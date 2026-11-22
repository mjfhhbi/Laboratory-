/**
 * Types and interfaces for Food Heat Transfer, Freezing & Thawing Engineering
 */

export type FoodGeometryType = 'slab' | 'cylinder' | 'sphere' | 'brick';

export type FreezingModelType = 'plank' | 'cleland_earle' | 'pham';

export type ConvectionMode = 
  | 'air_blast' 
  | 'still_air' 
  | 'plate_freezer' 
  | 'immersion_brine' 
  | 'cryogenic_nitrogen' 
  | 'custom';

export interface FoodThermalProperties {
  id: string;
  nameFa: string;
  nameEn: string;
  category: 'meat_poultry' | 'fish_seafood' | 'fruits_vegetables' | 'bakery' | 'dairy';
  moistureFraction: number; // 0 to 1 (e.g. 0.74 = 74%)
  initialFreezingPointTif: number; // °C, usually -0.5 to -4.5 °C
  latentHeatDeltaH: number; // kJ/kg (e.g. 247 kJ/kg)
  densityUnfrozen: number; // kg/m3 (e.g. 1050)
  densityFrozen: number; // kg/m3 (e.g. 980)
  thermalConductivityUnfrozen: number; // W/(m·K), ku ~ 0.45 - 0.55
  thermalConductivityFrozen: number; // W/(m·K), kf ~ 1.2 - 2.2
  specificHeatUnfrozen: number; // kJ/(kg·K), cpu ~ 3.2 - 4.0
  specificHeatFrozen: number; // kJ/(kg·K), cpf ~ 1.7 - 2.2
  literatureSource: string;
  descriptionFa: string;
}

export interface FreezingProcessInputs {
  geometry: FoodGeometryType;
  // Dimensions in meters:
  thicknessOrDiameterM: number; // 'a' (thickness of slab, diameter of cylinder/sphere, smallest dimension of brick)
  widthM?: number;              // 'b' (for brick geometry)
  lengthM?: number;             // 'c' (for brick geometry)
  
  // Operating temperatures in °C:
  initialTemperatureTi: number;     // Ti e.g. +10 °C to +25 °C
  ambientMediumTemperatureTa: number; // Ta e.g. -35 °C in blast freezer
  targetCenterTemperatureTc: number;  // Tc e.g. -18 °C
  
  // Convection conditions:
  convectionMode: ConvectionMode;
  airVelocityMs?: number;        // v in m/s (e.g. 3.0 to 6.0 m/s for blast freezer)
  heatTransferCoefficientH: number; // W/(m2·K), either user-entered or calculated
  includeRadiation: boolean;
  surfaceEmissivity?: number;   // default 0.90
  
  // Food properties:
  properties: FoodThermalProperties;
}

export interface DimensionlessNumbers {
  biotNumberFrozen: number;   // Bi = h * Lc / kf
  biotNumberUnfrozen: number; // Bi = h * Lc / ku
  fourierNumber: number;      // Fo = alpha * t / Lc^2
  prandtlNumberAir?: number;  // Pr for air ~ 0.71
  reynoldsNumberAir?: number; // Re = v * L / nu_air
  nusseltNumberAir?: number;  // Nu = h * L / k_air
  plankNumber: number;        // Pk = cpu * (Ti - Tif) / DeltaH
  stefanNumber: number;       // Ste = cpf * (Tif - Ta) / DeltaH
  characteristicDimensionM: number; // Lc = Volume / Surface Area
}

export interface FreezingCalculationStep {
  stepNumber: number;
  titleFa: string;
  titleEn: string;
  formulaLatex: string;
  substitutionFa: string;
  resultFa: string;
  notesFa?: string;
}

export interface TemperatureTimePoint {
  timeMinutes: number;
  centerTemperatureC: number;
  surfaceTemperatureC: number;
  averageTemperatureC: number;
  stageNameFa: 'پیش‌سرمایش' | 'تغییر فاز و انجماد' | 'فوق‌سرمایش عمیق';
}

export interface SensitivityPoint {
  factorNameFa: string;
  factorNameEn: string;
  baselineValue: number;
  unit: string;
  scenarios: {
    percentageChange: number; // e.g. -30%, -15%, 0%, +15%, +30%
    parameterValue: number;
    freezingTimeMinutes: number;
    differenceMinutes: number;
  }[];
}

export interface FreezingThawingResults {
  // Freezing times in minutes:
  plankFreezingTimeMinutes: number;
  clelandEarleFreezingTimeMinutes: number;
  phamFreezingTimeMinutes: number;
  
  // Stage breakdown (based on Cleland/Pham):
  stage1PrecoolingMinutes: number;
  stage2PhaseChangeMinutes: number;
  stage3SubcoolingMinutes: number;
  totalFreezingTimeMinutes: number;
  totalFreezingTimeHours: number;
  
  // Thawing analysis:
  thawingTimeMinutes: number;
  thawingTimeHours: number;
  thawingToFreezingRatio: number; // Typically 1.5 - 3.5x
  thawingExplanationFa: string;
  
  // Heat fluxes and energies:
  totalHeatExtractedKjPerKg: number;
  totalHeatExtractedKjPerBatch: number; // for specified mass
  averageFreezingRateCmPerHour: number; // cm/h, determines crystal size
  freezingCategoryFa: 'انجماد فوق‌سریع (کریستال‌های ریز درون‌سلولی)' | 'انجماد سریع صنعتی' | 'انجماد کند (آسیب به بافت سلولی)';
  
  // Convective heat transfer details:
  calculatedHConvection: number;
  calculatedHRadiation: number;
  effectiveTotalH: number;
  
  dimensionlessNumbers: DimensionlessNumbers;
  calculationSteps: FreezingCalculationStep[];
  temperatureCurve: TemperatureTimePoint[];
  sensitivityAnalysis: SensitivityPoint[];
  
  // Physical assumptions & warnings:
  assumptionsFa: string[];
  limitationsFa: string[];
}
