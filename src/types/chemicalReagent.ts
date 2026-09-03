/**
 * Chemical Reagents, Indicators & Solution Preparation Types
 * Part 13 of 20 - Food Science AI Lab Suite
 */

export type ReagentGrade =
  | 'analytical' // Analytical Reagent (AR / GR) - >99%
  | 'laboratory' // Laboratory Reagent (LR)
  | 'hplc' // HPLC / Spectroscopic Grade
  | 'food_usp' // Food / USP / FCC Grade
  | 'technical' // Technical / Industrial Grade
  | 'primary_standard'; // Primary Standard (NIST / CRM traceable)

export type ChemicalFamily =
  | 'acid'
  | 'base'
  | 'salt'
  | 'indicator'
  | 'organic_solvent'
  | 'buffer'
  | 'stain'
  | 'enzyme_biochemical'
  | 'standard_solution';

export type GhsPictogramCode =
  | 'GHS01' // Explosive
  | 'GHS02' // Flammable
  | 'GHS03' // Oxidizer
  | 'GHS04' // Gas Cylinder
  | 'GHS05' // Corrosive
  | 'GHS06' // Acute Toxicity (Fatal/Toxic)
  | 'GHS07' // Irritant / Harmful
  | 'GHS08' // Health Hazard / Carcinogen
  | 'GHS09'; // Environmental Hazard

export type ConcentrationUnit =
  | 'M' // Molar (mol/L)
  | 'N' // Normal (eq/L)
  | 'w/v%' // Weight/Volume percent (g/100mL)
  | 'v/v%' // Volume/Volume percent (mL/100mL)
  | 'w/w%' // Weight/Weight percent (g/100g)
  | 'ppm' // Parts per million (mg/L or mg/kg)
  | 'g/L' // Grams per Liter
  | 'mg/L' // Milligrams per Liter
  | 'mM'; // Millimolar (mmol/L)

export interface StorageConditionInfo {
  temperature: string; // e.g. "15-25°C (محیط)", "2-8°C (یخچال)", "-20°C"
  lightSensitive: boolean;
  hygroscopic: boolean;
  flammableCabinetRequired: boolean;
  desiccatorRequired: boolean;
  specialNotes: string;
}

export interface ChemicalHazardInfo {
  ghsPictograms: GhsPictogramCode[];
  signalWord: 'Danger' | 'Warning' | 'None';
  hazardStatements: string[]; // H-statements
  precautionaryStatements: string[]; // P-statements
  nfpaRating?: {
    health: number; // 0 - 4
    flammability: number; // 0 - 4
    instability: number; // 0 - 4
    special?: 'OX' | 'W' | 'SA' | 'COR' | 'ALK' | 'ACID';
  };
  isVerifiedHazard: boolean;
}

export interface ChemicalSafetyNotes {
  ppeRequired: string[]; // e.g. دستکش نیتریل، عینک محافظ، هود شیمیایی
  firstAid: {
    eyeContact: string;
    skinContact: string;
    inhalation: string;
    ingestion: string;
  };
  handlingPrecautions: string[];
  spillResponse: string;
  incompatibleWith: string[];
  exothermicWarning?: string;
}

export interface SdsReference {
  publisherOrSource: string; // e.g. "Merck KGaA Safety Data Sheet", "PubChem CID 14798", "Sigma-Aldrich"
  sdsCodeOrNumber: string;
  revisionDate: string;
  verified: boolean;
  safetyDisclaimer?: string;
}

export type PhysicalState = 'solid' | 'liquid' | 'powder' | 'crystals' | 'solution';

export type VolumeUnit = 'mL' | 'L';

export interface AssociatedExperimentLink {
  experimentId?: string;
  experimentName: string;
  standardCode?: string; // e.g. INSO 2852, AOAC 920.39, ISO 4833
  role: 'titrant' | 'indicator' | 'solvent' | 'buffer' | 'catalyst' | 'digestive_acid' | 'extractant' | 'culture_medium_additive' | 'standard' | 'base';
  rolePersian: string;
  notes?: string;
}

export interface ChemicalReagent {
  id: string;
  name: string; // نام فارسی (مانند هیدروکسید سدیم)
  englishName: string; // Sodium Hydroxide
  scientificName: string; // IUPAC name
  chemicalFormula: string; // NaOH
  casNumber: string; // 1310-73-2
  casSource: string; // منبع تایید شده CAS (e.g. PubChem CID 14798)
  family: ChemicalFamily;
  molecularWeight: number; // g/mol
  density?: number; // g/mL (critical for liquid acids/solvents)
  valenceOrEquivalents?: number; // ظرفیت واکنشی برای نرمالیته (e.g. H2SO4 = 2, NaOH = 1, KMnO4 = 5)
  grade: ReagentGrade;
  purityPercentage: number; // درصد خلوص (Assay)
  physicalState: 'solid' | 'liquid' | 'powder' | 'crystals' | 'solution';
  storageConditions: StorageConditionInfo;
  preparationDate?: string;
  expiryDate?: string;
  lotNumber?: string;
  hazards: ChemicalHazardInfo;
  safetyNotes: ChemicalSafetyNotes;
  sdsReference: SdsReference;
  associatedExperiments: AssociatedExperimentLink[];
  stockQuantity: {
    amount: number;
    unit: 'g' | 'kg' | 'mL' | 'L';
    location: string;
    minAlertLevel: number;
  };
  notes?: string;
  isBenchmark: boolean;
  updatedAt: string;
}

export interface CalculationStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formulaSnippet?: string;
  safetyTip?: string;
}

export interface PreparedSolution {
  id: string;
  title: string;
  reagentId: string;
  reagentName: string;
  reagentFormula: string;
  targetConcentration: number;
  concentrationUnit: ConcentrationUnit;
  actualConcentration?: number;
  standardizationFactor?: number; // Titration factor F (e.g. 1.0024)
  finalVolume: number;
  volumeUnit: 'mL' | 'L';
  solvent: string;
  requiredAmount: number;
  requiredAmountUnit: 'g' | 'mg' | 'mL';
  calculationFormula: string;
  calculationSteps: CalculationStep[];
  safetyWarnings: string[];
  preparationDate: string;
  expiryDate: string;
  preparedBy: string;
  standardizedWith?: string; // e.g. "پتاسیم هیدروژن فتالات (KHP) خشک شده در ۱۰۵ درجه"
  storageLocation: string;
  status: 'active' | 'expired' | 'depleted' | 'quarantined';
  notes?: string;
  createdAt: string;
}

export interface SolutionCalculationRequest {
  reagent: ChemicalReagent;
  targetConcentration: number;
  concentrationUnit: ConcentrationUnit;
  finalVolume: number;
  volumeUnit: 'mL' | 'L';
  solvent?: string;
  customPurity?: number;
  customDensity?: number;
  customValence?: number;
}

export type SolutionCalculationParams = SolutionCalculationRequest;

export interface SolutionCalculationResult {
  requiredAmount: number;
  requiredAmountUnit: 'g' | 'mg' | 'mL';
  formattedAmount?: string;
  molarityEquivalent: number; // M
  normalityEquivalent?: number; // N
  formulaLatex: string;
  formulaDescription: string;
  formulaUsed?: string;
  formulaExplanation?: string;
  isLiquidDilution?: boolean;
  purityUsed?: number;
  densityUsed?: number;
  steps: CalculationStep[];
  safetyAlerts: string[];
  standardizationGuide?: {
    standardPrimarySubstance?: string;
    titrantOrPrimaryStandard?: string;
    indicator: string;
    equivalentReaction?: string;
    calculationEquation?: string;
    formula?: string;
    methodDescription?: string;
    endpointColorChange?: string;
  };
}

export interface ReagentFilterQuery {
  searchTerm?: string;
  family?: ChemicalFamily | 'all';
  grade?: ReagentGrade | 'all';
  hazardPictogram?: GhsPictogramCode | 'all';
  stockStatus?: 'all' | 'in_stock' | 'low_stock' | 'expired';
  associatedExperiment?: string;
  sortBy?: 'name' | 'cas' | 'purity' | 'updatedAt' | 'stock';
  sortOrder?: 'asc' | 'desc';
}

export interface ReagentStatistics {
  totalReagents: number;
  totalPreparedSolutions: number;
  activeSolutions: number;
  expiredSolutions: number;
  familyDistribution: Record<ChemicalFamily, number>;
  gradeDistribution: Record<ReagentGrade, number>;
  hazardousCount: number;
  lowStockCount: number;
}

export const GHS_PICTOGRAM_META: Record<GhsPictogramCode, { nameFa: string; nameEn: string; color: string; description: string }> = {
  GHS01: { nameFa: 'مواد منفجره', nameEn: 'Explosive', color: 'orange', description: 'خطر انفجار در اثر حرارت، ضربه یا اصطکاک' },
  GHS02: { nameFa: 'قابل اشتعال', nameEn: 'Flammable', color: 'red', description: 'مایعات، گازها و جامدات با قابلیت اشتعال بالا' },
  GHS03: { nameFa: 'اکسیدکننده', nameEn: 'Oxidizer', color: 'amber', description: 'تسریع‌کننده حریق در مجاورت مواد آلی و کاهنده' },
  GHS04: { nameFa: 'گازهای فشرده', nameEn: 'Compressed Gas', color: 'sky', description: 'سیلندرهای گاز تحت فشار بالا' },
  GHS05: { nameFa: 'خورنده و تاول‌زا', nameEn: 'Corrosive', color: 'rose', description: 'تخریب شدید بافت زنده، پوست، چشم و خوردگی فلزات' },
  GHS06: { nameFa: 'سمیت حاد و کشنده', nameEn: 'Toxic / Fatal', color: 'purple', description: 'خطر مسمومیت شدید یا مرگ از طریق استنشاق یا تماس' },
  GHS07: { nameFa: 'تحریک‌کننده و زیان‌آور', nameEn: 'Harmful / Irritant', color: 'yellow', description: 'سوزش مجاری تنفسی، تحریک پوستی و چشمی' },
  GHS08: { nameFa: 'خطر سیستمیک و تنفسی', nameEn: 'Health Hazard', color: 'blue', description: 'آسیب به ارگان‌های بدن، سرطان‌زایی یا جهش‌زایی' },
  GHS09: { nameFa: 'خطرناک برای محیط زیست', nameEn: 'Environmental Hazard', color: 'emerald', description: 'سمیت بالا برای آبزیان و ماندگاری در طبیعت' }
};

export const REAGENT_GRADE_META: Record<ReagentGrade, { nameFa: string; nameEn: string; color: string; description: string }> = {
  analytical: { nameFa: 'گرید آنالیتیکال (AR/GR)', nameEn: 'Analytical Reagent', color: 'emerald', description: 'خلوص بالاتر از ۹۹٪، مناسب برای تیتراسیون و آزمایش‌های دقیق' },
  primary_standard: { nameFa: 'استاندارد اولیه (Primary Std)', nameEn: 'Primary Standard', color: 'indigo', description: 'خلوص بالاتر از ۹۹.۹۵٪ با پایداری شیمیایی بسیار بالا جهت استانداردسازی' },
  hplc: { nameFa: 'گرید کروماتوگرافی (HPLC)', nameEn: 'HPLC / Spectro Grade', color: 'purple', description: 'حداکثر شفافیت نوری و خلوص بدون ذرات معلق' },
  food_usp: { nameFa: 'گرید غذایی / دارویی (USP/FCC)', nameEn: 'Food / USP Grade', color: 'teal', description: 'مطابق استانداردهای فارماکوپه و صنایع غذایی' },
  laboratory: { nameFa: 'گرید آزمایشگاهی (LR)', nameEn: 'Laboratory Reagent', color: 'blue', description: 'مناسب آزمایش‌های عمومی و کارهای تشخیصی روتین' },
  technical: { nameFa: 'گرید صنعتی (Technical)', nameEn: 'Technical Grade', color: 'stone', description: 'مناسب شستشو و سنتزهای غیرحساس' }
};

export const CHEMICAL_FAMILY_META: Record<ChemicalFamily, { nameFa: string; nameEn: string; icon: string }> = {
  acid: { nameFa: 'اسیدها', nameEn: 'Acids', icon: 'FlaskConical' },
  base: { nameFa: 'بازها و قلیاها', nameEn: 'Bases & Alkalis', icon: 'Pipette' },
  salt: { nameFa: 'نمک‌ها و کاتالیزورها', nameEn: 'Salts & Catalysts', icon: 'Boxes' },
  indicator: { nameFa: 'شناساگرها و معرف‌ها', nameEn: 'Indicators & Reagents', icon: 'Sparkles' },
  organic_solvent: { nameFa: 'حلال‌های آلی', nameEn: 'Organic Solvents', icon: 'Beaker' },
  buffer: { nameFa: 'بافرها و محلول‌های کالیبراسیون', nameEn: 'Buffers & Calibration Solutions', icon: 'ShieldCheck' },
  stain: { nameFa: 'رنگ‌های میکروسکوپی و بیوشیمی', nameEn: 'Stains & Dyes', icon: 'Layers' },
  enzyme_biochemical: { nameFa: 'آنزیم‌ها و سوبستراها', nameEn: 'Enzymes & Biochemicals', icon: 'Activity' },
  standard_solution: { nameFa: 'محلول‌های استاندارد آماده', nameEn: 'Standard Volumetric Solutions', icon: 'TestTubes' }
};
