/**
 * Food Science AI - Food Chemistry & Analysis Domain Types
 * Strict schema for food chemical testing, proximate analysis, spectroscopic assays,
 * titration protocols, standard references (INSO / AOAC / ISO / AOCS), and lab engine execution.
 */

import { FoodStandardSector } from './foodStandard';
import { LabStepDefinition, LabSession } from './laboratory';

export type FoodChemistryCategory = 
  | 'proximate_moisture'
  | 'proximate_ash'
  | 'proximate_protein'
  | 'proximate_fat'
  | 'proximate_fiber'
  | 'carbohydrates_sugars'
  | 'acidity_ph'
  | 'salt_minerals'
  | 'minerals_salts'
  | 'refractometry_density'
  | 'pigments_colorants'
  | 'antioxidants_phenolics'
  | 'lipids_quality'
  | 'vitamins_preservatives';

export type FoodChemicalSector = 
  | FoodStandardSector
  | 'dairy'
  | 'cereal'
  | 'cereals_bakery'
  | 'meat'
  | 'meat_protein'
  | 'oils_fats'
  | 'fruits_veg'
  | 'canning_preserves'
  | 'confectionery'
  | 'sugar_confectionery'
  | 'beverages'
  | 'spices'
  | 'spices_condiments'
  | 'bakery'
  | 'other';

export type StandardOrganization = 'INSO' | 'AOAC' | 'ISO' | 'AOCS' | 'IDF' | 'IUPAC' | 'Codex' | 'AACC';

export interface ChemicalMethodReference {
  organization: StandardOrganization;
  standardNumber: string;
  year?: string;
  titleFa: string;
  titleEn: string;
  scopeAndMatrix: string;
  isPrimaryNationalStandard?: boolean;
}

export interface ReagentRequirement {
  id: string;
  nameFa: string;
  nameEn: string;
  casNumber?: string;
  grade: 'Analytical (AR)' | 'HPLC Grade' | 'USP/BP' | 'Technical' | 'Pure';
  concentration?: string;
  preparationProtocolFa: string;
  safetyHazardFa?: string;
  storageRequirement?: string;
}

export interface EquipmentRequirement {
  id: string;
  nameFa: string;
  nameEn: string;
  specification?: string;
  calibrationRequirement?: string;
  operatingTempOrParam?: string;
}

export interface ChemicalAlternativeMethod {
  methodId: string;
  methodNameFa: string;
  methodNameEn: string;
  principleFa: string;
  applicableMatrixes: string[];
  standardReferences: ChemicalMethodReference[];
  advantagesFa: string[];
  limitationsFa: string[];
  detectionLimit?: string;
  analysisTime: string;
}

export interface ChemicalCalculationRule {
  formulaLatex: string;
  formulaDescriptionFa: string;
  variables: {
    symbol: string;
    descriptionFa: string;
    unit: string;
    defaultValue?: number;
    minValue?: number;
    maxValue?: number;
  }[];
  conversionFactors?: {
    matrix: string;
    factorName: string;
    factorValue: number;
    sourceStandard: string;
  }[];
  unitResult: string;
  significantFigures: number;
  roundingRuleFa: string;
  acceptableRSDPercent: number; // Maximum allowable %RSD (repeatability)
}

export interface ChemicalQualityControl {
  reagentBlankRequirementFa: string;
  sampleBlankRequirementFa?: string;
  certifiedReferenceMaterialCRM?: string;
  expectedRecoveryRangePercent: {
    min: number;
    max: number;
  };
  repeatabilityLimit_r: string; // Difference between duplicate determinations
  reproducibilityLimit_R?: string;
  criticalControlCheckpoints: string[];
}

export interface ChemicalTroubleshootingCase {
  symptomFa: string;
  probableCausesFa: string[];
  investigationStepsFa: string[];
  correctiveAndPreventiveActionFa: string;
}

export interface FoodChemistryTest {
  id: string;
  code: string; // e.g. "CHEM-MST-01", "CHEM-PROT-01"
  analyteFa: string;
  analyteEn: string;
  titleFa: string;
  titleEn: string;
  category: FoodChemistryCategory;
  sectorCompatibility: FoodChemicalSector[];
  
  objectiveFa: string;
  chemicalPrincipleFa: string;
  
  samplePreparation: {
    homogenizationProtocolFa: string;
    pretreatmentNotesFa?: string;
    sampleMassOrVolume: string;
    storageBeforeAnalysis: string;
  };
  
  primaryStandard: ChemicalMethodReference;
  secondaryStandards: ChemicalMethodReference[];
  alternativeMethods: ChemicalAlternativeMethod[];
  
  requiredReagents: ReagentRequirement[];
  requiredEquipment: EquipmentRequirement[];
  
  proceduralSteps: {
    stepNumber: number;
    titleFa: string;
    instructionFa: string;
    criticalTimeOrTemp?: string;
    safetyPrecautionsFa?: string;
  }[];
  
  calculationRules: ChemicalCalculationRule;
  qualityControl: ChemicalQualityControl;
  troubleshooting: ChemicalTroubleshootingCase[];
  
  structuredStepsForLabEngine: LabStepDefinition[];
}

export interface MajorFoodComponentProfile {
  id: string;
  componentFa: string;
  componentEn: string;
  definitionFa: string;
  nutritionalRoleFa: string;
  caloricValueKcalPerGram: number;
  standardAnalyticalMethods: {
    methodNameFa: string;
    standardCode: string;
    speedVsAccuracy: string;
  }[];
  typicalRangesInFoods: {
    foodCategory: string;
    typicalRange: string;
    regulatoryNotes?: string;
  }[];
  chemistryAndInteractionsFa: string;
  keyQualityFactors: string[];
}
