/**
 * Food Science AI - Food Product Development & Design Domain Types
 * Part 10 of 10 - Product Formulation, Process Engineering & Shelf-Life System
 */

export type ProductCategory =
  | 'dairy'             // لبنیات و بستنی
  | 'beverage'          // نوشیدنی‌ها و آبمیوه‌ها
  | 'bakery_cereal'     // غلات، آرد و نان
  | 'meat_poultry'      // فرآورده‌های گوشتی و پروتئینی
  | 'sauces_condiments' // سس‌ها، چاشنی‌ها و درای درسینگ
  | 'confectionery'     // قنادی، شکلات و شیرینی
  | 'oils_fats'         // روغن‌ها و چربی‌های خوراکی
  | 'canned_preserved'  // کنسروها و ترشیجات
  | 'snacks_extruded'   // تنقلات و فرآورده‌های اکسترود شده
  | 'functional_food';  // فرآورده‌های فراسودمند و رژیمی

export type ProductTargetObjective =
  | 'low_fat'           // کم‌چرب / کاهش چربی
  | 'sugar_reduced'     // کاهش یا حذف قند
  | 'high_protein'      // غنی‌شده با پروتئین
  | 'gluten_free'       // فاقد گلوتن
  | 'clean_label'       // برچسب پاک (بدون نگه‌دارنده مصنوعی)
  | 'texture_optimized' // بهبود بافت و قوام
  | 'shelf_life_ext'    // افزایش زمان ماندگاری
  | 'cost_reduction'    // بهینه‌سازی قیمت تمام‌شده
  | 'novel_formulation' // توسعه محصول کاملاً نوین
  | 'standard_matching';// تطابق با استاندارد ملی / رقبا

export type ProductionScale = 'lab' | 'pilot' | 'industrial';

export type IngredientFunction =
  | 'solvent_base'      // پایه حلال / آب / شیر مایع
  | 'protein_source'    // منبع پروتئین
  | 'fat_lipid'         // چربی و روغن
  | 'carbohydrate_sugar'// قند و کربوهیدرات ساده
  | 'stabilizer_hydrocolloid' // هیدروکلوئید و قوام‌دهنده (زانتان، گوار، کاراگینان...)
  | 'emulsifier'        // امولسیفایر (لسیتین، مونو و دی‌گلیسیرید...)
  | 'acidulant_ph'      // اسیدولانت و تنظیم‌کننده اسیدیته (سیتریک، لاکتیک...)
  | 'preservative_antioxidant' // آنتی‌اکسیدان و نگه‌دارنده مجاز
  | 'flavor_aroma'      // طعم‌دهنده و اسانس
  | 'colorant'          // رنگ خوراکی طبیعی / مجاز
  | 'fortifier_vitamin' // ریزمغذی و پروبیوتیک / پری‌بیوتیک
  | 'salt_mineral'      // نمک و مواد معدنی
  | 'other';

export interface FormulationIngredient {
  id: string;
  nameFa: string;
  nameEn?: string;
  category: IngredientFunction;
  percentage: number; // e.g. 12.50%
  dryMatterPercent?: number; // % ماده خشک (e.g. 100% for sugar, 12% for milk)
  brixContribution?: number; // سهم در بریکس
  costPerKg?: number; // قیمت هر کیلوگرم به ریال / تومان
  supplierOrGrade?: string; // گرید خوراکی / تأمین‌کننده
  insNumber?: string; // کد INS یا E-number
  allergens?: string[]; // آلرژن‌ها (شیر، گلوتن، سویا...)
  notes?: string;
}

export interface FormulationVersion {
  id: string;
  versionCode: string; // e.g. "Formula v1 (مرجع)", "Formula v2", "Formula v3"
  versionNumber?: number; // 1, 2, 3...
  title: string;
  description?: string;
  isBaseline: boolean; // آیا فرمول مرجع است
  changeLogSummary?: string; // خلاصه تغییرات این نسخه نسبت به نسخه قبل
  baseVersionId?: string; // شناسه نسخه مبنایی که این نسخه از آن اشتقاق یافته
  isAiGenerated?: boolean; // آیا پیشنهاد هوش مصنوعی بوده است
  aiPreliminaryNotice?: string; // علامتگذاری به عنوان «پیشنهاد اولیه»
  scientificSources?: Array<{
    title: string;
    code?: string;
    organization?: string;
    claim: string;
    relevance?: string;
  }>;
  ingredients: FormulationIngredient[];
  totalPercentage: number; // جمع درصدها (باید ۱۰۰٪ باشد)
  totalDryMatterPercent: number; // درصد ماده خشک کل
  estimatedBrix?: number; // بریکس تخمینی
  estimatedCostPerKg?: number; // هزینه تمام‌شده مواد اولیه در هر کیلوگرم
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessStage {
  id: string;
  stepNumber: number;
  stageNameFa: string;
  stageNameEn?: string;
  descriptionFa: string;
  temperatureC?: number | string; // e.g. 72-75 or 4
  durationMinutes?: number | string; // e.g. 15 or "15 s"
  equipmentRequired: string[]; // e.g. ["هموژنایزر دو مرحله‌ای", "تانک دوجداره استیل"]
  criticalParameters?: {
    pressureBar?: number | string;
    rpmOrShear?: string;
    targetPh?: number | string;
    vacuumMbar?: number | string;
  };
  criticalControlPoint: boolean; // آیا نقطه کنترل بحرانی (CCP) است؟
  controlInstructionsFa?: string;
}

export interface PackagingSpec {
  packageTypeFa: string; // e.g. بطری PET، پاکت تتراپک، قوطی فلزی لاک‌دار، پاکت متالایز وکیوم
  packagingMaterial: string; // e.g. Multilayer aseptic paperboard / EVOH / PE
  barrierProperties: {
    oxygenBarrier: 'low' | 'medium' | 'high' | 'ultra_high';
    moistureBarrier: 'low' | 'medium' | 'high' | 'ultra_high';
    lightProtection: 'transparent' | 'amber' | 'opaque_full';
  };
  atmosphere: 'normal_air' | 'vacuum' | 'map_n2_co2' | 'aseptic_hot_fill';
  netQuantity: string; // e.g. "250 mL", "900 g"
  storageInstructionsFa: string; // e.g. در دمای ۴ تا ۸ درجه سانتی‌گراد در یخچال نگهداری شود
  targetStorageTemperature: string; // e.g. "4°C - 8°C"
  targetStorageHumidity?: string; // e.g. "RH < 60%"
  targetShelfLifeDays: number; // e.g. 21 days, 180 days
}

export interface QualityControlSpec {
  id: string;
  parameterNameFa: string;
  parameterType: 'physicochemical' | 'microbiological' | 'sensory' | 'rheological';
  unit: string;
  targetValue: string;
  minAcceptableLimit?: number | string;
  maxAcceptableLimit?: number | string;
  standardReference?: string; // e.g. "INSO 2852", "AOAC 991.20"
  testingMethod: string;
  isCriticalForSafety?: boolean;
}

export interface ShelfLifeStudyPoint {
  id: string;
  day: number; // e.g. 0, 7, 14, 21, 45, 90
  conditionType: 'real_time' | 'accelerated_37C' | 'accelerated_45C';
  targetParameters: string[];
  acceptanceCriteria: string;
}

export interface PotentialDefectAndTroubleshooting {
  id: string;
  defectNameFa: string;
  defectCategory: 'texture' | 'stability_phase' | 'oxidation_flavor' | 'microbial' | 'color_appearance';
  possibleCausesFa: string[];
  formulationRemediesFa: string[];
  processRemediesFa: string[];
}

export interface TestResultEntry {
  id: string;
  trialDate: string;
  formulationVersionId: string;
  batchNumber: string;
  scale: ProductionScale;
  batchSizeKg: number;
  measuredParameters: Record<string, { value: number | string; unit?: string; conforms: boolean }>;
  sensoryScores?: {
    appearance: number; // 1-9
    texture: number;    // 1-9
    flavor: number;     // 1-9
    aroma: number;      // 1-9
    overallLiking: number; // 1-9
    panelNotes?: string;
  };
  overallVerdict: 'passed' | 'marginal' | 'failed' | 'needs_reformulation';
  operatorOrScientist: string;
  conclusionsAndNextSteps?: string;
  // Intelligent Lab Analysis (Part 29)
  intelligentAnalysis?: import('../lib/products/labAnalysisEngine').IntelligentLabAnalysisReport;
  instrumentAudit?: import('../lib/products/labAnalysisEngine').LabInstrumentAuditInfo[];
  reagentAudit?: import('../lib/products/labAnalysisEngine').LabReagentAuditInfo[];
  sampleAudit?: import('../lib/products/labAnalysisEngine').LabSampleAuditInfo;
}

export interface ProductDevelopmentProject {
  id: string;
  code: string; // e.g. "PRD-2026-001"
  productNameFa: string;
  productNameEn?: string;
  category: ProductCategory;
  targetObjectives: ProductTargetObjective[];
  executiveSummaryFa: string;
  productIdea?: string; // ایده محصول، نوآوری و ارزش تمایز بازار
  targetSpecifications?: {
    targetPh?: string;
    targetBrix?: string;
    targetMoisturePercent?: string;
    targetFatPercent?: string;
    targetProteinPercent?: string;
    targetTextureProfile?: string;
    targetShelfLifeDays?: number;
    sensoryGoals?: string;
    microbiologicalLimits?: string;
  };
  targetConsumerProfile?: string; // e.g. کودکان، ورزشکاران، بیماران سلیاک، عموم مصرف‌کنندگان
  standardReferences: string[]; // e.g. ["INSO 2852 (دوغ)", "Codex Stan 243"]

  // Formulations & Variants
  formulations: FormulationVersion[];
  activeFormulationId: string;

  // Process & Engineering
  processStages: ProcessStage[];
  productionScale: ProductionScale;
  standardBatchSizeKg: number;
  processLossFactorPercent: number; // e.g. 2.5%

  // Packaging & Shelf Life
  packaging: PackagingSpec;
  qcSpecifications: QualityControlSpec[];
  shelfLifeProtocol: ShelfLifeStudyPoint[];
  troubleshootingGuide: PotentialDefectAndTroubleshooting[];

  // Trial Test Logs
  testResults: TestResultEntry[];

  // Metadata & Status
  status: 'idea_draft' | 'formulation_design' | 'pilot_trials' | 'shelf_life_validation' | 'approved_scaled' | 'archived';
  leadFoodScientist: string;
  createdAt: string;
  updatedAt: string;
  isOfflineAvailable: boolean;
}

export interface ScaleConversionResult {
  targetBatchWeightKg: number;
  effectiveNetWeightKg: number;
  processLossKg: number;
  ingredients: Array<{
    id: string;
    nameFa: string;
    percentage: number;
    requiredWeightKg: number;
    requiredWeightFormatted: string;
    unit: string;
    estimatedCost: number;
  }>;
  totalBatchCost: number;
  costPerKg: number;
}

// -------------------------------------------------------------
// Part 28: Scale-up, Costing & Product Economics Types
// -------------------------------------------------------------

export type ScaleUnit = 'g' | 'kg' | 'mL' | 'L' | 'unit_count' | 'pack';

export interface BatchLossBreakdown {
  evaporationLossPercent: number; // درصد ضایعات تبخیر
  equipmentHoldUpPercent: number; // ماند در دیواره و لوله‌کشی
  fillingSpillagePercent: number; // ریزش و پرکنی
  packagingRejectPercent: number; // ظروف و بسته‌های معیوب
  totalLossPercent: number;       // جمع کل درصد ضایعات
  calculatedYieldPercent: number; // راندمان کلی فرآیند (100 - totalLoss)
  totalLossKg: number;           // وزن کل ضایعات به کیلوگرم
}

export interface PackagingCostItem {
  id: string;
  nameFa: string;
  itemType: 'primary_container' | 'closure_cap' | 'label' | 'secondary_carton' | 'tertiary_shrink' | 'other';
  unit: 'عدد' | 'بسته' | 'رول' | 'متر';
  unitsPerFinishedProduct: number; // تعداد مصرف به ازای هر واحد محصول نهایی
  unitCost: number;               // بهای خرید هر واحد بسته بندی (تومان - کاملاً قابل ویرایش)
  scrapRejectPercent: number;     // درصد ضایعات این قلم بسته بندی در خط
  totalQuantityRequired: number;  // تعداد کل مورد نیاز برای بچ
  totalCost: number;              // هزینه کل این قلم در بچ
  costPerFinishedUnit: number;    // هزینه این قلم به ازای هر واحد محصول
}

export interface EnergyUtilityCosts {
  electricityKwh: number;
  electricityRatePerKwh: number; // تومان/کیلووات ساعت
  gasCubicMeters: number;
  gasRatePerCubicMeter: number;  // تومان/متر مکعب
  steamTons: number;
  steamRatePerTon: number;       // تومان/تن بخار
  waterCubicMeters: number;
  waterRatePerCubicMeter: number;// تومان/متر مکعب آب صنعتی/RO
  otherUtilityCost: number;      // سایر هزینه‌های تأسیسات (هوای فشرده، تبرید، تصفیه پساب)
  totalUtilityCost: number;
}

export interface LaborCosts {
  operatorCount: number;         // تعداد اپراتورهای خط تولید
  hoursPerBatch: number;         // ساعت کارکرد برای این بچ
  hourlyWageRate: number;        // نرخ دستمزد ساعتی (تومان/نفر-ساعت)
  qaTechnicianHours: number;     // ساعت کار تکنسین کنترل کیفیت
  qaHourlyRate: number;          // نرخ تکنسین QC
  totalLaborCost: number;
}

export interface OverheadCosts {
  mode: 'percentage_of_direct' | 'fixed_per_batch';
  overheadRatePercent: number;   // درصد سربار از هزینه‌های مستقیم (تولید + مواد + بسته بندی)
  fixedOverheadAmount: number;   // مبلغ ثابت سربار به ازای هر بچ (تومان)
  totalOverheadCost: number;
}

export interface ProcessingMaintenanceCost {
  maintenanceCleaningCipCost: number; // شستشو و مواد شیمیایی CIP و ضدعفونی
  lineWearTearCost: number;           // استهلاک ابزار، فیلترها و گسکت‌ها
  totalProcessingCost: number;
}

export interface UnitPackagingSpec {
  unitNetContent: number;        // مقدار محتوی هر بسته (مثلا 250)
  unitContentUnit: 'g' | 'kg' | 'mL' | 'L'; // واحد محتوی
  densityGperMl: number;         // دانسیته محصول مایع (گرم بر میلی لیتر یا کیلوگرم بر لیتر)
  unitsPerMasterCarton: number;  // تعداد در کارتن مادر (مثلا 24 یا 12)
}

export interface PricingEconomics {
  targetProfitMarginPercent: number; // درصد حاشیه سود کارخانه
  grossProfitPerUnit: number;        // سود ناخالص هر واحد
  exFactoryPricePerUnit: number;     // قیمت فروش درب کارخانه (عمده‌فروشی اولیه)
  distributorMarginPercent: number;  // درصد سود شرکت پخش
  distributorPricePerUnit: number;   // قیمت تحویل به سوپرمارکت
  retailerMarginPercent: number;     // درصد سود مغازه‌دار / خرده‌فروش
  consumerPricePreVat: number;       // قیمت مصرف‌کننده قبل از مالیات
  vatPercent: number;                // درصد مالیات بر ارزش افزوده (VAT)
  consumerRetailPrice: number;       // قیمت نهایی مصرف‌کننده مندرج روی جلد (CRP)
}

export interface ProductScalingTraceStep {
  stepNumber: number;
  categoryFa: string;
  titleFa: string;
  formulaDescription: string;
  formulaLatex?: string;
  inputsDescription: string;
  intermediateValues?: Record<string, string | number>;
  resultDescription: string;
  resultValue: string | number;
}

export interface ScaledIngredientItem {
  id: string;
  nameFa: string;
  category: IngredientFunction;
  percentage: number;
  netRequiredKg: number;
  grossRequiredKg: number;
  formattedAmount: string;
  displayUnit: string;
  costPerKg: number;
  totalCostInBatch: number;
  costContributionPercent: number;
}

export interface BatchEconomicSummary {
  rawMaterialsTotalCost: number;
  packagingTotalCost: number;
  energyUtilityTotalCost: number;
  laborTotalCost: number;
  overheadTotalCost: number;
  processingTotalCost: number;
  totalCogsBatchCost: number;
  costPerKgNet: number;
  costPerFinishedUnit: number;
  costShares: {
    rawMaterialsPercent: number;
    packagingPercent: number;
    energyPercent: number;
    laborPercent: number;
    overheadPercent: number;
    processingPercent: number;
  };
}

export interface ComprehensiveBatchScaleModel {
  baseFormulaWeightKg: number;
  scaleMode: 'target_output_net' | 'target_input_gross' | 'target_units_count';
  targetValue: number;
  targetUnit: ScaleUnit;
  densityGperMl: number;
  scaleFactor: number;
  grossInputWeightKg: number;
  netSaleableWeightKg: number;
  lossBreakdown: BatchLossBreakdown;
  unitSpec: UnitPackagingSpec;
  totalFinishedUnits: number;
  totalMasterCartons: number;
  ingredients: ScaledIngredientItem[];
  packagingItems: PackagingCostItem[];
  utilityCosts: EnergyUtilityCosts;
  laborCosts: LaborCosts;
  overheadCosts: OverheadCosts;
  processingCosts: ProcessingMaintenanceCost;
  economics: BatchEconomicSummary;
  pricing: PricingEconomics;
  validationErrors: string[];
  validationWarnings: string[];
  calculationTrace: ProductScalingTraceStep[];
}
