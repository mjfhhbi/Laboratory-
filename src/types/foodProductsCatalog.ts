/**
 * Food Science AI - Comprehensive Food Products Catalog Domain Types
 * Part 19 of 20 - Food Products Database with Strict Relational Architecture:
 * Product ← Tests ← Standards ← Sources
 */

export type FoodCatalogCategory =
  | 'dairy'             // لبنیات
  | 'meat'              // گوشت
  | 'cereals'           // غلات
  | 'bread'             // نان
  | 'biscuits'          // بیسکویت
  | 'beverages'         // نوشیدنی
  | 'oils_fats'         // روغن و چربی
  | 'canned_foods'      // کنسرو
  | 'jams'              // مربا
  | 'honey'             // عسل
  | 'chocolate'         // شکلات
  | 'ice_cream'         // بستنی
  | 'fruits_vegetables' // میوه و سبزی
  | 'pulses_legumes'    // حبوبات
  | 'spices'            // ادویه
  | 'water'             // آب
  | 'other_products';   // سایر محصولات

export interface FoodCategoryMeta {
  id: FoodCatalogCategory;
  nameFa: string;
  nameEn: string;
  iconName: string;
  color: string;
  badgeBg: string;
  description: string;
}

export type TestCategoryType = 'physical' | 'chemical' | 'microbial' | 'sensory';

export interface RelationalSource {
  id: string;
  titleFa: string;
  titleEn: string;
  issuingBodyOrAuthors: string;
  publicationYear: string;
  documentType: 'national_standard' | 'international_standard' | 'scientific_reference' | 'codex_standard';
  citationCode: string;
  officialReferenceOrUrl: string;
  verificationStatus: 'verified_official' | 'peer_reviewed';
}

export interface CatalogRelatedStandard {
  id: string;
  standardNumber: string; // e.g. "INSO 2406" or "Codex Stan 206"
  organization: 'INSO' | 'Codex' | 'ISO' | 'FDA';
  titleFa: string;
  titleEn: string;
  publicationYear: string;
  status: 'active_mandatory' | 'active_recommended' | 'under_revision';
  scopeFa: string;
  sourceId: string; // Foreign key pointing to RelationalSource
  coverageType: 'general_specifications' | 'microbiological_criteria' | 'test_methods' | 'packaging_labeling';
}

export interface ProductTestSpecification {
  id: string;
  code: string;
  category: TestCategoryType;
  nameFa: string;
  nameEn: string;
  parameterAnalyte: string;
  unit?: string;
  // Quantitative or Qualitative limits
  minLimit?: number;
  maxLimit?: number;
  targetValue?: number;
  textLimitFa?: string; // e.g. "منفی در ۲۵ گرم" or "طبیعی و عاری از هرگونه بوی نامطبوع"
  methodFa: string;
  frequency: 'in_line' | 'each_batch' | 'daily' | 'periodic' | 'raw_intake';
  standardId: string; // Foreign key pointing to CatalogRelatedStandard
  sourceId: string;   // Foreign key pointing to RelationalSource
  criticality: 'critical_safety' | 'major_quality' | 'standard_compliance';
  notesFa?: string;
}

export interface ProductRawMaterial {
  id: string;
  nameFa: string;
  nameEn: string;
  role: string;
  typicalPercentageRange: string; // e.g. "85 - 90 %"
  qualityCriteriaFa: string;
  isAllergenic: boolean;
  allergenType?: string;
  standardReference?: string;
}

export interface ManufacturingProcessStep {
  stepNumber: number;
  nameFa: string;
  nameEn: string;
  criticalParameters: string; // e.g. "دما: ۷۵ الی ۸۰ درجه، زمان: ۱۵ الی ۲۰ ثانیه"
  equipmentFa: string;
  ccpOrCqP?: 'CCP' | 'OPRP' | 'CP';
  descriptionFa: string;
}

export interface ProductEquipmentSpec {
  id: string;
  nameFa: string;
  nameEn: string;
  roleInProcessOrLab: 'production' | 'laboratory_qc' | 'pilot';
  keySpecificationFa: string;
  maintenanceAndCalibration: string;
}

export interface ProductStorageCondition {
  temperatureRangeFa: string;
  relativeHumidityRangeFa: string;
  lightingProtectionFa: string;
  stackingLimitsFa: string;
  specialPrecautionsFa: string;
}

export interface ProductPackagingSpec {
  primaryPackagingMaterialFa: string;
  secondaryPackagingMaterialFa: string;
  barrierPropertiesFa: string;
  modifiedAtmospherePackaging?: string; // MAP gas composition or vacuum
  headspaceVolumeFa?: string;
  hermeticSealTestFa: string;
  complianceStandard?: string;
}

export interface ProductShelfLifeSpec {
  shelfLifeDurationFa: string; // e.g. "۵ روز در یخچال (۴ درجه)" or "۲۴ ماه در دمای محیط"
  primaryDeteriorationMechanism: string; // e.g. "اکسیداسیون چربی"، "فعالیت باکتری‌های اسپورزا"، "بیاتی نشاسته"
  criticalLimitAtEndOfShelfLife: string;
  acceleratedTestingParameters?: string;
}

export interface FoodCatalogProduct {
  id: string;
  code: string;
  nameFa: string;
  nameEn: string;
  commercialNameFa: string;
  category: FoodCatalogCategory;
  descriptionFa: string;
  commercialFormsFa: string[];
  physicalStateFa: 'liquid' | 'semi_solid' | 'solid' | 'powder' | 'viscous_paste' | 'emulsion';
  targetMatrix: string;
  
  // General Specifications
  keyCharacteristicsFa: {
    phTypical?: string;
    brixTypical?: string;
    moisturePercent?: string;
    fatPercent?: string;
    proteinPercent?: string;
    ashPercent?: string;
    saltPercent?: string;
    waterActivityTypical?: string;
    appearanceColorFa: string;
  };

  // Relational references
  rawMaterials: ProductRawMaterial[];
  processSteps: ManufacturingProcessStep[];
  requiredEquipment: ProductEquipmentSpec[];
  storageConditions: ProductStorageCondition;
  packagingSpecs: ProductPackagingSpec;
  shelfLifeSpecs: ProductShelfLifeSpec;
  
  // Strict Relational: Product ← Tests ← Standards ← Sources
  standards: CatalogRelatedStandard[];
  tests: ProductTestSpecification[];
  sources: RelationalSource[];

  tags: string[];
}

// Aliases for convenience and backward compatibility
export type ProductCategoryKey = FoodCatalogCategory;
export type TestCategory = TestCategoryType;
export type ProcessStep = ManufacturingProcessStep;
export type RawMaterialIngredient = ProductRawMaterial;
export type CatalogEquipmentItem = ProductEquipmentSpec;
