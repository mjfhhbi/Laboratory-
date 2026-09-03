/**
 * Food Science AI - Food Microbiology Domain Types
 * 
 * Strict schema for Food Microbiology Tests, Microorganisms, Culture Media,
 * Sampling & Dilution, Colony Counting (ISO 7218), MPN Tables, Quality Control (ISO 11133),
 * Biosafety (BSL-1 / BSL-2) and Troubleshooting.
 */

import { ScientificSource, SourceCitation } from './knowledgeBase';
import { ExperimentVerificationStatus, ReliabilityGrade } from './foodExperiment';
import { LabSession } from './laboratory';

export type MicrobialCategory =
  | 'indicator'       // شاخص‌های بهداشتی (بار کل، کلی‌فرم، انتروباکتریاسه)
  | 'pathogen'        // پاتوژن‌ها و بیماری‌زاها (سالمونلا، لیستریا، استاف، کلستریدیوم، باسیلوس)
  | 'spoilage'        // میکروارگانیسم‌های فساد (کپک، مخمر، سودوموناس، اسید لاکتیک)
  | 'probiotic'       // پروبیوتیک‌ها و باکتری‌های آغازگر (لاکتوباسیلوس، بیفیدوباکتریوم)
  | 'toxin_producer'; // تولیدکنندگان توکسین (مایکوتوکسین، انتروتوکسین استافیلوکوکی)

export type InoculationMethod =
  | 'pour_plate'           // کشت پورپلیت (مخلوط در عمق - ۱ میلی‌لیتر)
  | 'spread_plate'         // کشت سطحی (پخش سطحی - ۰.۱ میلی‌لیتر)
  | 'membrane_filtration'  // فیلتراسیون غشایی (آب و نوشیدنی‌ها)
  | 'mpn_3_tubes'          // بیشترین تعداد محتمل ۳ لوله‌ای (MPN)
  | 'mpn_5_tubes'          // بیشترین تعداد محتمل ۵ لوله‌ای (MPN)
  | 'streak_plate'         // کشت خطی (جداسازی و خالص‌سازی)
  | 'presence_absence';    // آزمون حضور / عدم حضور در ۲۵ گرم (Qualitative P/A)

export type GramStainType = 'gram_positive' | 'gram_negative' | 'not_applicable' | 'variable';
export type MorphologyType = 'bacillus' | 'coccus' | 'coccobacillus' | 'spirillum' | 'yeast_cell' | 'mold_hyphae';
export type OxygenRequirement = 'obligate_aerobe' | 'facultative_anaerobe' | 'obligate_anaerobe' | 'microaerophilic' | 'aerotolerant';
export type BiosafetyLevel = 'BSL-1' | 'BSL-2' | 'BSL-3';

export interface MicrobialTestEquipment {
  nameFa: string;
  nameEn: string;
  specification: string;
  calibrationReq?: string;
  biosafetyRole?: string;
}

export interface MicrobialTestMedia {
  mediaCode: string; // e.g. PCA, VRBA, BP, XLD
  nameFa: string;
  nameEn: string;
  role: 'primary_plating' | 'pre_enrichment' | 'selective_enrichment' | 'differential' | 'confirmation' | 'diluent';
  incubationTemp: string; // e.g. "30 ± 1 °C"
  incubationTime: string; // e.g. "72 ± 3 h"
  atmosphere: 'aerobic' | 'anaerobic' | 'microaerophilic';
  pHAt25C?: string;
  autoclaveParams?: string;
}

export interface BiochemicalConfirmation {
  testNameFa: string;
  testNameEn: string;
  principle: string;
  positiveReaction: string;
  negativeReaction: string;
  expectedForTarget: 'positive' | 'negative' | 'variable';
  standardReference?: string;
}

export interface MicrobialProcedureStep {
  stepNumber: number;
  phase: 'sampling' | 'preparation' | 'dilution' | 'inoculation' | 'incubation' | 'counting' | 'confirmation' | 'reporting';
  titleFa: string;
  descriptionFa: string;
  criticalTemperature?: string;
  criticalTime?: string;
  criticalWarning?: string;
}

export interface MicrobialCalculationRule {
  formulaName: string;
  formulaExpression: string; // LaTeX or ISO 7218 text
  countingRangeMin: number; // e.g. 15 or 30 or 10
  countingRangeMax: number; // e.g. 300 or 150
  volumePlatedMl: number; // 1.0 or 0.1
  unitResult: string; // CFU/g, CFU/mL, MPN/g, P/A in 25g
  roundingRule: string; // ISO 7218 2 significant figures
  zeroResultReporting: string; // "< 10 CFU/g" or "< 1 CFU/mL"
}

export interface MicrobialQualityControl {
  positiveControlStrain: string; // e.g. "Escherichia coli ATCC 25922"
  negativeControlStrain?: string; // e.g. "Pseudomonas aeruginosa ATCC 27853"
  mediaSterilityBlank: boolean;
  diluentSterilityBlank: boolean;
  airSedimentationLimit?: string;
  productivityIndexMin?: number; // ISO 11133 (e.g. 0.70)
}

export interface MicrobialTest {
  id: string;
  code: string; // e.g. MB-TPC-01, MB-SALM-02, MB-STAPH-03
  titleFa: string;
  titleEn: string;
  category: MicrobialCategory;
  targetOrganism: string;
  targetOrganismEn: string;
  
  // 1. استانداردهای مرجع (تفکیک دقیق)
  primaryStandard: {
    organization: 'INSO' | 'ISIRI' | 'ISO' | 'FDA_BAM' | 'AOAC' | 'Codex' | 'APHA';
    standardNumber: string; // e.g. "INSO 5272-1", "ISO 4833-1", "FDA BAM Ch. 3"
    title: string;
    publicationYear?: string;
    versionStatus: 'active_current' | 'revised' | 'draft';
  };
  secondaryStandards?: {
    organization: string;
    standardNumber: string;
    title: string;
  }[];

  // 2. دامنه و اصل روش
  scopeFa: string;
  principleFa: string;
  inoculationMethod: InoculationMethod;

  // 3. نیازمندی‌های سخت‌افزاری و ایمنی
  biosafetyLevel: BiosafetyLevel;
  requiredEquipment: MicrobialTestEquipment[];

  // 4. محیط‌های کشت و رقیق‌کننده‌ها
  requiredMedia: MicrobialTestMedia[];

  // 5. نمونه‌برداری و آماده‌سازی (ISO 6887)
  samplePreparation: {
    matrixType: 'general' | 'solid_composite' | 'liquid' | 'powder_dairy' | 'fatty_butter' | 'frozen';
    testPortionSize: string; // e.g. "25 g or 10 g or 11 g"
    diluentName: string; // e.g. "Buffered Peptone Water (BPW)" or "0.1% Peptone"
    homogenizationMethod: string; // Stomacher 1-2 min (230 rpm) or Warring Blender
    holdingTimeLimit: string; // حداکثر زمان مجاز نگهداری رقت تا کشت (ISO 7218: حداکثر ۴۵ دقیقه)
  };

  // 6. پروتکل رقت‌سازی اعشاری (Decimal Dilution)
  dilutionProtocol: {
    initialDilutionRatio: string; // "10^-1 (1:10)"
    serialSteps: string[]; // ["10^-1", "10^-2", "10^-3", "10^-4", "10^-5"]
    pipettingTechnique: string;
    mixingTechnique: string;
  };

  // 7. مراحل گام‌به‌گام
  procedureSteps: MicrobialProcedureStep[];

  // 8. آزمون‌های تایید بیوشیمیایی (در صورت لزوم)
  confirmationTests?: BiochemicalConfirmation[];

  // 9. قوانین شمارش و محاسبات
  calculationRules: MicrobialCalculationRule;

  // 10. کنترل کیفیت و سویه‌های مرجع
  qualityControl: MicrobialQualityControl;

  // 11. خطاهای رایج و ریشه‌یابی
  commonErrors: {
    errorTitle: string;
    rootCause: string;
    prevention: string;
  }[];

  // 12. نکات حیاتی ایمنی زیستی
  safetyNotes: string[];

  // 13. وضعیت اعتبار
  verificationStatus: ExperimentVerificationStatus;
  reliabilityGrade: ReliabilityGrade;
  isVerified: boolean;
  tags: string[];
}

export interface MicroorganismProfile {
  id: string;
  scientificName: string;
  nameFa: string;
  family: string;
  category: MicrobialCategory;
  morphology: MorphologyType;
  gramStain: GramStainType;
  sporeForming: boolean;
  motility: boolean;
  oxygenRequirement: OxygenRequirement;
  
  // فیزیولوژی رشد
  optimumTemperatureC: number;
  temperatureRangeC: { min: number; opt: number; max: number };
  optimumPh: number;
  phRange: { min: number; opt: number; max: number };
  minimumAw: number; // کمترین فعالیت آبی برای رشد (aw)
  maximumSaltTolerancePercent: number; // حداکثر تحمل نمک NaCl

  // اهمیت در صنایع غذایی
  foodSafetySignificanceFa: string;
  commonFoodSources: string[];
  spoilageOrIllnessCharacteristics: string;
  incubationPeriodAndSymptoms?: string;
  heatResistanceDValue?: string; // D-value at specific temp
  toxinProduction?: string;

  // ویژگی‌های بیوشیمیایی
  biochemicalProfile: {
    catalase: 'positive' | 'negative' | 'variable';
    oxidase: 'positive' | 'negative' | 'variable';
    coagulase?: 'positive' | 'negative';
    indole?: 'positive' | 'negative';
    methylRed?: 'positive' | 'negative';
    vogesProskauer?: 'positive' | 'negative';
    citrate?: 'positive' | 'negative';
    urease?: 'positive' | 'negative';
    h2sProduction?: 'positive' | 'negative';
    gasFromGlucose?: 'positive' | 'negative';
    betaGlucuronidase?: 'positive' | 'negative';
  };

  // حدود استاندارد مرجع در ایران (INSO 2394)
  typicalStandardsLimits?: {
    foodCategory: string;
    standardRef: string;
    limitDescription: string;
  }[];

  referenceStrains: string[]; // e.g. ["ATCC 25922", "NCTC 12900"]
}

export interface CultureMediaItem {
  id: string;
  code: string; // e.g. PCA, VRBA, BPW, XLD
  nameFa: string;
  nameEn: string;
  mediaType: 'non_selective' | 'selective' | 'differential' | 'enrichment' | 'diluent' | 'confirmation';
  physicalForm: 'dehydrated_powder' | 'ready_to_use_agar' | 'broth' | 'semi_solid';
  
  // فرمولاسیون بر حسب گرم در لیتر (g/L)
  formulaGPerLiter: {
    ingredientFa: string;
    ingredientEn: string;
    amountGrams: number;
  }[];
  totalGramsPerLiter: number;

  // دستور آماده‌سازی و استریلیزاسیون
  preparationInstructionsFa: string;
  autoclaveParameters: {
    temperatureC: number;
    pressurePsi: number;
    timeMinutes: number;
    requiresAutoclave: boolean;
    specialHeatingNote?: string;
  };
  finalPhAt25C: string;
  storageConditions: {
    powderStorage: string;
    preparedMediaStorage: string;
    shelfLifePreparedPlates: string;
  };

  // مکمل‌ها و عوامل انتخابی
  selectiveSupplements?: {
    supplementName: string;
    concentrationPerLiter: string;
    additionTime: 'before_autoclave' | 'after_cooling_45C' | 'filter_sterilized';
    purpose: string;
  }[];

  // کنترل کیفیت عملکرد (ISO 11133)
  qualityControlStrains: {
    strainName: string;
    strainNumber: string; // ATCC / WDCM
    expectedReaction: string;
    growthCriteria: 'productive_PR_ge_0.7' | 'selective_inhibited' | 'characteristic_colonies';
  }[];

  standardReferences: string[];
}

export interface MicrobiologyEquipmentItem {
  id: string;
  nameFa: string;
  nameEn: string;
  category: 'sterilization' | 'incubation' | 'sample_prep' | 'containment' | 'counting_optical' | 'liquid_handling';
  standardOperationGuideline: string;
  criticalParameters: string;
  calibrationAndMonitoring: {
    frequency: string;
    methodFa: string;
    biologicalIndicator?: string; // e.g. Geobacillus stearothermophilus for autoclave
    acceptanceCriteria: string;
  };
  biosafetyRules: string[];
}

export interface SamplingPlanConfig {
  planType: '2_class' | '3_class';
  sampleNumber_n: number; // تعداد واحدهای نمونه برداشته شده (n)
  acceptanceNumber_c: number; // حداکثر تعداد نمونه مجاز بین m و M
  lowerLimit_m: number; // حد کیفیت قابل قبول (m)
  upperLimit_M?: number; // حد غیرقابل قبول و بحرانی (M)
  foodMatrixName: string;
  microbialTestCode: string;
}

export interface PlateCountReplicateInput {
  dilutionFactor: number; // e.g. 10^-1, 10^-2, 10^-3 (stored as exponent: -1, -2, -3 or 0.1, 0.01)
  dilutionLabel: string; // "10^-1"
  plate1Count: number;
  plate2Count: number;
  isExcluded?: boolean;
  exclusionReason?: string;
}

export interface ISO7218CalculationResult {
  weightedMeanCFUPerGramOrMl: number;
  log10CFU: number;
  reportedResultString: string; // e.g. "2.4 × 10⁴ CFU/g"
  isInValidRange: boolean;
  evaluationNote: string;
  formulaDetails: {
    sumOfColonies: number;
    volumePlated: number;
    n1Count: number;
    n2Count: number;
    primaryDilutionFactor: number;
    denominator: number;
  };
  repeatabilityStatus: 'compliant' | 'discrepant' | 'single_dilution_used';
}

export interface MPNTableResult {
  combinationOfPositives: string; // e.g. "3-2-0"
  mpnValue: number;
  confidenceInterval95: {
    lower: number;
    upper: number;
  };
  unit: string; // MPN/g or MPN/mL
  probabilityCategory: 'category_1_normal' | 'category_2_less_likely' | 'category_3_unacceptable';
}

export interface MicrobiologyTroubleshootingItem {
  id: string;
  category: 'حرارتی و ذوب آگار' | 'شمارش و کلنی‌های رونده' | 'آلودگی محیطی و استریلیزاسیون' | 'بیوشیمیایی و تاییدی' | 'رقت‌سازی و آماده‌سازی' | 'محیط کشت و مکمل‌ها';
  titleFa: string;
  symptomFa: string;
  rootCauseFa: string;
  investigationMethodFa: string;
  correctiveActionFa: string;
  preventiveActionFa: string;
  standardSource: string;
}
