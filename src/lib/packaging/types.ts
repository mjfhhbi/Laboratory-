/**
 * Food Packaging Engineering Types & Specifications
 * Based on ASTM, ISO, INSO, and EU 10/2011 Standards
 */

export type BarrierLevel = 'ultra_high' | 'high' | 'medium' | 'low' | 'breathable';

export type FoodSimulantType = 
  | 'simulant_A'  // 10% Ethanol (aqueous foods)
  | 'simulant_B'  // 3% Acetic Acid (acidic foods, pH < 4.5)
  | 'simulant_C'  // 20% Ethanol (alcoholic foods up to 20%)
  | 'simulant_D1' // 50% Ethanol (alcoholic foods > 20%, dairy)
  | 'simulant_D2' // Vegetable oil / Isooctane (fatty foods)
  | 'simulant_E';  // Poly(2,6-diphenyl-p-phenylene oxide) - Tenax (dry foods)

export interface PackagingMaterialRecord {
  id: string;
  nameFa: string;
  nameEn: string;
  acronym: string;
  category: 'polyolefin' | 'polyester' | 'polyamide' | 'vinyl_copolymer' | 'cellulosic' | 'metallic' | 'laminate';
  densityGPerCm3: number;
  typicalThicknessRangeMicrons: [number, number];
  
  // Permeability properties (normalized to 1 mm or 25.4 µm / 1 mil)
  // O2 Permeability: cm³ · mm / (m² · day · atm) at 23°C, 0% RH
  oxygenPermeabilityMm: number;
  
  // Water Vapor Permeability: g · mm / (m² · day) at 37.8°C, 90% RH
  waterVaporPermeabilityMm: number;
  
  // Activation energies for Arrhenius temperature effect (kJ/mol)
  activationEnergyO2KjPerMol: number;
  activationEnergyH2OKjPerMol: number;
  
  oxygenBarrierLevel: BarrierLevel;
  waterVaporBarrierLevel: BarrierLevel;
  
  testConditionsFa: string;
  measurementStandards: string[]; // e.g. ['ASTM D3985', 'ISO 15105-2', 'INSO 13740']
  literatureCitations: string[];
  notesFa: string;
  isFoodContactApproved: boolean;
  isMultilayer: boolean;
}

export interface WvtrCalculationInput {
  massChangeDataPoints: { timeHours: number; massGrams: number }[];
  exposedAreaM2: number;
  thicknessMicrons: number;
  testTemperatureC: number;
  relativeHumidityHighSidePercent: number;
  relativeHumidityLowSidePercent: number;
  testCupMethod?: 'desiccant_dry_cup' | 'water_wet_cup';
}

export interface WvtrCalculationResult {
  wvtrGPerM2Day: number;
  wvtrGPer100In2Day: number;
  wvtrKgPerM2Second: number;
  slopeGramsPerHour: number;
  rSquared: number;
  permeanceGPerM2DayAtm: number;
  permeabilityGMmPerM2DayAtm: number;
  saturationVaporPressureAtm: number;
  deltaPressureVaporAtm: number;
  formulaLatex: string;
  substitutionLatex: string;
  dimensionsAuditFa: string;
  testCupMethod: 'desiccant_dry_cup' | 'water_wet_cup';
  isSlopeConsistent: boolean;
  outlierPoints: { pointIndex: number; timeHours: number; massGrams: number; residual: number; isOutlier: boolean }[];
  outlierCount: number;
  totalPointsCount: number;
  outlierWarningFa?: string;
  outlierDiagnostics: {
    detectionMethodFa: string;
    thresholdRule: string;
    rmseGrams: number;
    statisticalLimitationFa: string;
    autoDeleted: false;
  };
}

export interface OtrCalculationInput {
  oxygenPermeabilityMm: number; // material permeability: cm³ · mm / (m² · day · atm)
  thicknessMicrons: number;
  exposedAreaM2: number;
  temperatureC: number;
  referenceTemperatureC?: number;
  activationEnergyO2KjPerMol?: number;
  oxygenPartialPressureDiffAtm?: number; // typically 0.21 atm for air vs 0% interior
  relativeHumidityPercent?: number;
  isRhSensitiveMaterial?: boolean;
  rhEmpiricalDataPoints?: { rhPercent: number; permeabilityMm: number }[];
}

export interface OtrCalculationResult {
  otrCm3PerM2Day: number;
  otrCcPer100In2Day: number;
  oxygenFluxMolPerM2Second: number;
  permeanceCm3PerM2DayAtm: number;
  actualPermeabilityAtTemp: number;
  temperatureFactor: number;
  dailyOxygenTransmissionTotalCm3: number;
  formulaLatex: string;
  substitutionLatex: string;
  arrheniusLatex: string;
  rhCorrectionApplied?: boolean;
  rhModelStatus?:
    | 'calibrated_data_only'
    | 'unverified_insufficient_calibration'
    | 'unverified_extrapolation'
    | 'unverified_missing_data'
    | 'not_applicable';
  rhWarningFa?: string;
  rhModelCaveatFa?: string;
  rhValidRangePercent?: [number, number];
  rhCalibrationPointsCount?: number;
  fittedRhModelLatex?: string;
}

export interface LaminateLayerInput {
  materialId: string;
  materialNameFa: string;
  thicknessMicrons: number;
  oxygenPermeabilityMm: number;
  waterVaporPermeabilityMm: number;
}

export interface LaminateBarrierResult {
  layersCount: number;
  totalThicknessMicrons: number;
  effectiveOtrCm3PerM2Day: number;
  effectiveWvtrGPerM2Day: number;
  effectiveOxygenPermeabilityMm: number;
  effectiveWaterVaporPermeabilityMm: number;
  layerResistanceBreakdown: {
    materialNameFa: string;
    thicknessMicrons: number;
    oxygenResistancePercentage: number;
    waterVaporResistancePercentage: number;
  }[];
  formulaLatex: string;
  idealTheoreticalBarrier: {
    effectiveOtr: number;
    effectiveWvtr: number;
    assumptionsFa: string;
  };
  realPackageAssessment: {
    status: 'unverified_defect_data_required' | 'evaluated_with_defects';
    pinholeRiskNoticeFa: string;
    flexCrackNoticeFa: string;
    recommendationFa: string;
  };
}

export interface FickianDiffusionInput {
  diffusionCoefficientM2PerSec: number;
  solubilityCoefficientCm3PerM3Pa: number;
  thicknessMicrons: number;
  concentrationHighSideGPerM3: number;
  concentrationLowSideGPerM3: number;
}

export interface FickianDiffusionResult {
  steadyStateFluxKgPerM2Sec: number;
  permeabilityCoefficientM2PerSec: number;
  lagTimeSeconds: number;
  lagTimeHours: number;
  timeToReachPercentSteadyState: number; // 90% steady state
  formulaLatex: string;
  assumptionsFa: string[];
}

export interface PackagingShelfLifeInput {
  productNameFa: string;
  productDryMassKg: number;
  initialMoisturePercentWetBasis: number;
  criticalMoisturePercentWetBasis: number;
  isothermSlopeGWaterPerGProductPerAw: number; // linear isotherm approximation X = s * aw
  packagingAreaM2: number;
  effectiveWvtrAtTestGPerM2Day: number;
  effectiveOtrAtTestCm3PerM2Day: number;
  storageTempC?: number;
  storageRhPercent?: number;
  headspaceVolumeCm3?: number;
  initialHeadspaceO2Percent?: number;
  maxTolerableO2ConsumptionCm3PerKg?: number;
}

export interface PackagingShelfLifeResult {
  shelfLifeMoistureLimitedDays: number;
  shelfLifeOxygenLimitedDays: number;
  limitingFactor: 'moisture' | 'oxygen';
  recommendedShelfLifeDays: number;
  moistureGainCurve: { day: number; moisturePercent: number; waterActivity: number }[];
  oxygenIngressCurve: { day: number; headspaceO2Percent: number; cumulativeO2IngressCm3: number }[];
  scientificDisclaimerFa: string;
  oxygenStatus: 'normal' | 'immediate_depletion' | 'insufficient_threshold' | 'unlimited_barrier';
  oxygenDiagnosticFa: string;
  calculationClassification: 'conditional_permeability_estimate';
  labuzaIntegralNoticeFa: string;
}

export type PiringerPolymerMatrix =
  | 'LDPE'
  | 'LLDPE'
  | 'HDPE'
  | 'PP'
  | 'PP_BLOCK'
  | 'PET'
  | 'PS'
  | 'HIPS'
  | 'PA6'
  | 'PVC'
  | 'OTHER';

export type SmlEvaluationStatus =
  | 'screening_below_sml_unverified_lab'
  | 'screening_exceeds_sml'
  | 'prohibited_intentional_use'
  | 'restricted_conditions_violated'
  | 'derogated_requires_analytical_nd_verification'
  | 'derogated_exceeds_detection_limit'
  | 'unverified_missing_polymer_parameters'
  | 'unverified_missing_limit'
  | 'unverified_incomplete_regulatory_metadata'
  | 'unverified_article4_residual_bpa_not_modeled'
  | 'not_applicable';

export type BpaTransitionalCategory =
  | 'single_use_general'
  | 'single_use_extended_2028'
  | 'repeat_use_general'
  | 'repeat_use_prof_equipment_2028';

export type BpaTransitionalStatus =
  | 'not_applicable'
  | 'expired_2026_07_20'
  | 'within_filling_window_until_2027_07_20'
  | 'within_extended_placing_until_2028_01_20'
  | 'within_extended_market_until_2029_01_20'
  | 'expired_extended_2029_01_20'
  | 'unverified_missing_dates_or_category';

export type DehpTransitionalStatus =
  | 'not_applicable'
  | 'legacy_stock_exhaustion_pre_2025_02_01'
  | 'post_2025_02_01_full_enforcement'
  | 'unverified_missing_placing_date';

export interface MigrationAssessmentInput {
  materialTypeFa: string;
  polymerMatrix?: PiringerPolymerMatrix;
  simulant: FoodSimulantType;
  testTemperatureC: number;
  testTimeHours: number;
  contactAreaDm2: number;
  foodVolumeKg?: number;
  initialSimulantMassGrams?: number;
  evaporatedResidueMassGrams: number;
  // Specific migrant parameters
  migrantNameFa?: string;
  migrantMolecularWeightGPerMol?: number;
  initialMigrantConcentrationInPolymerMgPerKg?: number;
  smlLimitMgPerKg?: number;
  fcmNumber?: string;
  casNumber?: string;
  smlGroupLimitMgPerKg?: number;
  groupRestrictionNumber?: string;
  regulationArticleRef?: string;
  regulationVersionDate?: string;
  jurisdiction?: 'EU' | 'INSO' | 'Other';
  officialSourceReference?: string;
  // Use conditions & regulatory context
  isRepeatedUse?: boolean;
  isInfantOrYoungChildFood?: boolean;
  isTechnicalSupportAgent?: boolean;
  finalProductDehpPercentWByW?: number;
  d1FoodNature?: 'unspecified' | 'alcoholic_non_fatty_gt20' | 'dairy_or_emulsion_fatty';
  bpaDerogationType?: 'none' | 'polysulfone_filtration_membrane' | 'heavy_duty_tank_gt_1000L';
  bpaArticleType?: BpaTransitionalCategory;
  isArticle4OtherBisphenolContext?: boolean;
  firstPlacedOnMarketDate?: string; // ISO YYYY-MM-DD
  assessmentDate?: string; // ISO YYYY-MM-DD (defaults to evaluation date)
  groupCoMigrantsMgPerKg?: {
    dbp?: number;
    dibp?: number;
    bbp?: number;
    dehp?: number;
    otherGroup32PlasticisersMgPerKg?: number;
    fcm212CaprolactamMgPerKg?: number;
    caprolactamSodiumSaltAsCaprolactamMgPerKg?: number; // FCM 435 expressed as caprolactam
  };
  customPiringerParams?: {
    apPrime: number;
    tauK: number;
    densityGPerCm3: number;
    maxTempC?: number;
    sourceCitation: string;
  };
}

export interface MigrationAssessmentResult {
  overallMigrationMgPerDm2: number;
  overallMigrationMgPerKgFood: number;
  isOverallMigrationCompliant: boolean;
  overallMigrationStandardLimitMgPerDm2: number; // 10 mg/dm² (EU 10/2011)
  overallMigrationStandardLimitMgPerKg: number;  // 60 mg/kg
  estimatedSpecificMigrationMgPerKg?: number;
  isSpecificMigrationCompliant?: boolean; // Mathematical screening indicator only (not EN 1186 certification)
  computationalEstimationStatus:
    | 'piringer_upper_bound_estimated'
    | 'unverified_missing_polymer_parameters'
    | 'out_of_applicability_bounds'
    | 'not_applicable';
  legalComplianceStatus:
    | 'requires_en1186_lab_certification'
    | 'non_compliant_screening_exceeded'
    | 'prohibited_under_eu_2024_3190'
    | 'derogated_subject_to_nd_1ppb'
    | 'restricted_conditions_violated'
    | 'unverified_incomplete_regulatory_data'
    | 'unverified_article4_residual_bpa_not_modeled'
    | 'unverified_inso_full_text_absent'
    | 'not_applicable';
  piringerParametersUsed?: {
    polymerKey: string;
    apPrime: number | null;
    tauK: number | null;
    polymerDensityGPerCm3: number | null;
    diffusionCoefficientM2PerSec?: number;
    parameterSource: string;
    applicabilityCaveatFa: string;
  };
  smlStatus: SmlEvaluationStatus;
  smlDetails?: {
    substanceName?: string;
    casNumber?: string;
    fcmNumber?: string;
    smlLimitMgPerKg?: number;
    analyticalLodMgPerKg?: number;
    analyticalLodReferenceFa?: string;
    smlGroupLimitMgPerKg?: number;
    groupRestrictionNumber?: string;
    groupDehpEquivalentMgPerKg?: number;
    group36Status?: 'within_limit_0_6' | 'exceeds_0_6' | 'unverified_missing_data';
    group32LimitMgPerKg?: number;
    group32TotalPlasticisersMgPerKg?: number;
    group32Status?: 'within_limit_60' | 'exceeds_60' | 'unverified_missing_data';
    group4LimitMgPerKg?: number;
    group4SumAsCaprolactamMgPerKg?: number;
    group4Status?: 'within_limit_15' | 'exceeds_15' | 'unverified_missing_data';
    bpaTransitionalStatus?: BpaTransitionalStatus;
    bpaTransitionalNoticeFa?: string;
    dehpTransitionalStatus?: DehpTransitionalStatus;
    dehpTransitionalNoticeFa?: string;
    article4ResidualBpaStatus?: 'unverified_not_modeled' | 'not_applicable';
    estimatedMigrationMgPerKg?: number;
    regulationVersionDate?: string;
    officialSourceReference?: string;
    jurisdiction?: string;
    regulatoryVerdictFa: string;
    conditionsOfUseWarningsFa?: string[];
  };
  legalStandardReference: string;
  regulatoryNoticeFa: string;
  formulaLatex: string;
}
