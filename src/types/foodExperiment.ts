/**
 * Food Science AI - Food Science & Engineering Laboratory Experiments Domain Types
 * 
 * Strict schema for Food Science Laboratory Experiments across 15 Specialized Domains:
 * Food Chemistry, Microbiology, Food Physics, Quality Control, Sensory Evaluation,
 * Food Analysis, Packaging, Oils & Fats, Dairy, Cereals, Meat & Meat Products,
 * Beverages, Fruits & Vegetables, Canned Foods, and Other Food Products.
 */

import { ScientificSource, SourceCitation } from './knowledgeBase';

export type ExperimentVerificationStatus =
  | 'verified_standard'
  | 'peer_reviewed'
  | 'academic_textbook'
  | 'unverified_pending_review';

export type ReliabilityGrade =
  | 'grade_a'
  | 'grade_b'
  | 'grade_c'
  | 'grade_d';

export const VERIFICATION_STATUS_META: Record<ExperimentVerificationStatus, {
  labelFa: string;
  badgeColor: string;
  descriptionFa: string;
}> = {
  verified_standard: {
    labelFa: 'استاندارد ملی/بین‌المللی تاییدشده',
    badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    descriptionFa: 'روش رسمی و الزام‌آور تدوین‌شده توسط سازمان‌های استاندارد'
  },
  peer_reviewed: {
    labelFa: 'مقاله ژورنال داوری‌شده',
    badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    descriptionFa: 'پروتکل مستخرج از ژورنال‌های معتبر بین‌المللی با نمایه معتبر'
  },
  academic_textbook: {
    labelFa: 'کتاب مرجع دانشگاهی',
    badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    descriptionFa: 'دستورالعمل آموزشی مندرج در کتاب‌ها و هندبوک‌های مرجع'
  },
  unverified_pending_review: {
    labelFa: 'پیش‌نویس در انتظار استعلام',
    badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    descriptionFa: 'پروتکل تجربی فاقد ارجاع قطعی نیازمند صحه‌گذاری'
  }
};

export const RELIABILITY_GRADES: Record<ReliabilityGrade, {
  labelFa: string;
  color: string;
  descriptionFa: string;
}> = {
  grade_a: {
    labelFa: 'گرید A (بسیار معتبر)',
    color: '#059669',
    descriptionFa: 'استاندارد ملی یا بین‌المللی دارای شماره ثبت رسمی'
  },
  grade_b: {
    labelFa: 'گرید B (معتبر علمی)',
    color: '#2563eb',
    descriptionFa: 'مقاله معتبر علمی پژوهشی با متدولوژی اثبات‌شده'
  },
  grade_c: {
    labelFa: 'گرید C (متوسط)',
    color: '#4f46e5',
    descriptionFa: 'کتاب مرجع دانشگاهی یا بولتن معتبر فنی'
  },
  grade_d: {
    labelFa: 'گرید D (تجربی)',
    color: '#d97706',
    descriptionFa: 'پروتکل تجربی یا گزارش غیررسمی'
  }
};

/**
 * 15 Specialized Food Science Experiment Domains (حوزه‌های ۱۵ گانه آزمایشگاهی)
 */
export type ExperimentDomain =
  | 'food_chemistry'        // شیمی مواد غذایی
  | 'microbiology'          // میکروبیولوژی مواد غذایی
  | 'food_physics'          // فیزیک و رئولوژی مواد غذایی
  | 'quality_control'       // کنترل کیفیت و تضمین کیفیت (QC/QA)
  | 'sensory_evaluation'    // آزمون‌های حسی و ارزیابی ارگانولپتیک
  | 'food_analysis'         // تجزیه مواد غذایی و آنالیز تقریبی (Proximate Analysis)
  | 'packaging'             // بسته‌بندی و آزمون‌های مواد بسته‌بندی
  | 'oils_fats'             // روغن‌ها و چربی‌های خوراکی
  | 'dairy'                 // شیر و فرآورده‌های لبنی
  | 'cereals'               // غلات، آرد و فرآورده‌های آردی
  | 'meat_products'         // گوشت، فرآورده‌های گوشتی و شیلات
  | 'beverages'             // نوشیدنی‌ها، آبمیوه‌ها و آب آشامیدنی
  | 'fruits_vegetables'     // میوه، سبزی و فرآورده‌های باغبانی
  | 'canned_foods'          // کنسروها و صنایع بسته‌بندی حرارتی
  | 'other_food_products';  // سایر محصولات غذایی و فرمولاسیون‌های نوین

export interface ExperimentDomainMeta {
  id: ExperimentDomain;
  titleFa: string;
  titleEn: string;
  description: string;
  badgeColor: string;
  color: string;
  iconName: string;
}

export const EXPERIMENT_DOMAINS: Record<ExperimentDomain, ExperimentDomainMeta> = {
  food_chemistry: {
    id: 'food_chemistry',
    titleFa: 'شیمی مواد غذایی',
    titleEn: 'Food Chemistry',
    description: 'واکنش‌های شیمیایی، اکسیداسیون، کاراملیزاسیون، قهوه‌ای‌شدن میلارد و سینتیک تخریب بیوشیمیایی',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    color: '#059669',
    iconName: 'FlaskConical'
  },
  microbiology: {
    id: 'microbiology',
    titleFa: 'میکروبیولوژی',
    titleEn: 'Food Microbiology',
    description: 'شمارش میکروارگانیسم‌ها، کپک، مخمر، باکتری‌های پاتوژن و شاخص‌های بهداشتی',
    badgeColor: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    color: '#0d9488',
    iconName: 'Microscope'
  },
  food_physics: {
    id: 'food_physics',
    titleFa: 'فیزیک مواد غذایی',
    titleEn: 'Food Physics & Rheology',
    description: 'رئولوژی، ویسکوزیته، بافت‌سنجی (TPA)، فعالیت آبی (aw) و خواص حرارتی/اپتیکی',
    badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    color: '#2563eb',
    iconName: 'Activity'
  },
  quality_control: {
    id: 'quality_control',
    titleFa: 'کنترل کیفیت',
    titleEn: 'Quality Control & QA',
    description: 'نمونه‌برداری آماری، انطباق با حدود استاندارد، آزمون‌های سریع و صحه‌گذاری خطوط تولید',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    color: '#4f46e5',
    iconName: 'ShieldCheck'
  },
  sensory_evaluation: {
    id: 'sensory_evaluation',
    titleFa: 'آزمون‌های حسی',
    titleEn: 'Sensory Evaluation',
    description: 'آزمون‌های مثلثی، هدونیک ۹ نقطه‌ای، پروفایل توصیفی (QDA) و ارزیابی پانلیست‌ها',
    badgeColor: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    color: '#7c3aed',
    iconName: 'Eye'
  },
  food_analysis: {
    id: 'food_analysis',
    titleFa: 'تجزیه مواد غذایی',
    titleEn: 'Proximate & Instrumental Analysis',
    description: 'سنجش رطوبت، پروتئین خام (کلدال)، چربی کل (سوکسله/ژربیر)، خاکستر، فیبر و کربوهیدرات',
    badgeColor: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    color: '#0891b2',
    iconName: 'TestTubes'
  },
  packaging: {
    id: 'packaging',
    titleFa: 'بسته‌بندی',
    titleEn: 'Food Packaging',
    description: 'مهاجرت کلی و اختصاصی، نفوذپذیری گازها (WVTR/OTR)، استحکام دوخت و آزمون‌های لفاف‌ها',
    badgeColor: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    color: '#0284c7',
    iconName: 'Package'
  },
  oils_fats: {
    id: 'oils_fats',
    titleFa: 'روغن‌ها و چربی‌ها',
    titleEn: 'Oils & Fats',
    description: 'عدد پراکسید، اسیدیته آزاد (FFA)، عدد یدی، صابونی، ضریب شکست، پایداری اکسیداتیو (Rancimat)',
    badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    color: '#d97706',
    iconName: 'Droplets'
  },
  dairy: {
    id: 'dairy',
    titleFa: 'لبنیات',
    titleEn: 'Dairy Products',
    description: 'درصد چربی (ژربیر/موجونیر)، ماده خشک بدون چربی (SNF)، آزمون فسفاتاز، دانسیته و اسیدیته درنیک',
    badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    color: '#3b82f6',
    iconName: 'Milk'
  },
  cereals: {
    id: 'cereals',
    titleFa: 'غلات',
    titleEn: 'Cereals & Flour',
    description: 'گلوتن مرطوب/شاخص گلوتن، عدد فالینگ، فارینوگراف، اکستنسوگراف و خاکستر نامحلول در اسید',
    badgeColor: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    color: '#ca8a04',
    iconName: 'Wheat'
  },
  meat_products: {
    id: 'meat_products',
    titleFa: 'گوشت و فرآورده‌های گوشتی',
    titleEn: 'Meat & Protein Products',
    description: 'میزان کلاژن/هیدروکسی پرولین، فسفات افزوده، نیتریت/نیترات باقیمانده، ظرفیت نگهداری آب (WHC)',
    badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    color: '#e11d48',
    iconName: 'Beef'
  },
  beverages: {
    id: 'beverages',
    titleFa: 'نوشیدنی‌ها',
    titleEn: 'Beverages & Juices',
    description: 'بریکس (مواد جامد محلول)، اسیدیته کل بر حسب اسید سیتریک، نسبت بریکس/اسیدیته، فرمالین ایندکس',
    badgeColor: 'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    color: '#8b5cf6',
    iconName: 'CupSoda'
  },
  fruits_vegetables: {
    id: 'fruits_vegetables',
    titleFa: 'میوه و سبزی',
    titleEn: 'Fruits & Vegetables',
    description: 'ویتامین C (تیتراسیون با رنگزا)، ترکیبات فنولی کل (فولین سیوکالتو)، سنجش پکتین و فعالیت آنزیمی',
    badgeColor: 'bg-lime-100 dark:bg-lime-950 text-lime-800 dark:text-lime-300 border-lime-200 dark:border-lime-800',
    color: '#65a30d',
    iconName: 'Apple'
  },
  canned_foods: {
    id: 'canned_foods',
    titleFa: 'کنسروها',
    titleEn: 'Canned Foods & Preserves',
    description: 'خلاء قوطی، فضای خالی (Headspace)، وزن آبکش، آزمون‌های کنترل دوخت مضاعف (Double Seam) و انکوباسیون',
    badgeColor: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    color: '#ea580c',
    iconName: 'Archive'
  },
  other_food_products: {
    id: 'other_food_products',
    titleFa: 'سایر محصولات غذایی',
    titleEn: 'Other Food Products',
    description: 'چاشنی‌ها، سس‌ها، هیدروکلوئیدها، فرآورده‌های قنادی، شیرین‌کننده‌ها و ارزیابی‌های اختصاصی',
    badgeColor: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    color: '#78716c',
    iconName: 'Layers'
  }
};

/**
 * Required Equipment & Instruments Item Schema
 */
export interface ExperimentEquipmentItem {
  id?: string;
  name: string;
  nameEn?: string;
  specification?: string; // مشخصات فنی دقیق (مانند دقت ۰.۰۰۰۱ گرم، محدوده حرارتی تا ۱۱۰ درجه)
  calibrationRequirement?: string; // نیازمندی کالیبراسیون
  isRequired: boolean;
}

/**
 * Required Reagents & Chemicals Schema
 */
export interface ExperimentReagentItem {
  id?: string;
  name: string;
  nameEn?: string;
  grade?: string; // درجه خلوص (AR, HPLC Grade, ACS, Pure)
  casNumber?: string;
  hazardClass?: string; // خورنده، سمی، اشتعال‌پذیر
  storageCondition?: string; // دمای نگهداری (یخچال ۴ درجه، تاریک)
}

/**
 * Standard Step in Laboratory Procedure
 */
export interface ExperimentProcedureStep {
  stepNumber: number;
  title: string;
  description: string;
  duration?: string; // زمان استاندارد آزمون
  temperature?: string; // دمای استاندارد آزمون
  criticalCaution?: string; // نکته حساس و بحرانی
}

/**
 * Calculation Variable Definition
 */
export interface CalculationVariable {
  symbol: string; // مانند m1, m0, V, N
  name: string; // جرم بالن، حجم مصرفی تیترانت
  unit: string; // g, mL, mol/L, %
  description?: string;
}

/**
 * Calculations & Formula Details Schema
 */
export interface ExperimentCalculation {
  formulaExpression: string; // فرمول متنی یا LaTeX
  formulaTitleFa: string;
  variables: CalculationVariable[];
  guidanceText?: string; // توضیح محاسبه
  exampleCalculation?: string; // نمونه عددی حل شده
}

/**
 * Environmental & Testing Conditions Schema
 */
export interface ExperimentEnvironmentalCondition {
  temperatureRange?: string; // دمای استاندارد محیط آزمون
  relativeHumidity?: string; // رطوبت نسبی مجاز
  lightCondition?: string; // حفاظت در برابر نور مستقیم
  ventilationRequirement?: string; // زیر هود شیمیایی / تهویه مطبوع
  specialNotes?: string;
}

/**
 * Standard Reference Entity (Strict Separation of Jurisdictions)
 */
export interface ExperimentStandardReference {
  organization: 'INSO' | 'ISIRI' | 'ISO' | 'AOAC' | 'ASTM' | 'Codex' | 'AOCS' | 'IDF' | 'Other';
  standardNumber: string; // شماره استاندارد (مانند INSO 4179, ISO 660, AOAC 920.39)
  titleFa?: string;
  titleEn?: string;
  publicationYear?: string;
  jurisdiction: 'iranian_national' | 'international_foreign';
  isOfficialAdopted: boolean; // آیا به صورت استاندارد ملی مصوب است یا بین‌المللی مرجع
  urlOrDocId?: string;
}

/**
 * Result Reporting & Repeatability Schema
 */
export interface ExperimentReporting {
  unitOfMeasurement: string; // % (w/w), mg KOH/g, mEq O2/kg, CFU/g, °Bx, pH
  decimalPrecision: number; // تعداد ارقام بامعنی / اعشار گزارش‌دهی
  repeatabilityLimit_r?: string; // حد تکرارپذیری (r) بین دو آزمون همزمان توسط یک اپراتور
  reproducibilityLimit_R?: string; // حد تجدیدپذیری (R) بین دو آزمایشگاه مختلف
  reportTemplateGuidance?: string; // نحوه نگارش نتیجه در برگه آزمون
}

/**
 * Main Laboratory Experiment Protocol Entity Schema
 */
export interface FoodExperiment {
  id: string;
  code: string; // e.g. EXP-CHM-001, EXP-MB-002, EXP-FAT-003
  titleFa: string;
  titleEn: string;
  domain: ExperimentDomain;
  
  // 1. هدف آزمایش
  objective: string;
  
  // 2. دامنه کاربرد
  scope: string;
  
  // 3. اصل روش
  principle: string;
  
  // 4. تجهیزات موردنیاز
  equipment: ExperimentEquipmentItem[];
  
  // 5. مواد و معرف‌ها
  reagentsAndMaterials: ExperimentReagentItem[];
  
  // 6. آماده‌سازی نمونه
  samplePreparation: string;
  
  // 7. آماده‌سازی محلول‌ها
  solutionsPreparation: string;
  
  // 8. شرایط محیطی
  environmentalConditions: ExperimentEnvironmentalCondition;
  
  // 9. مراحل انجام آزمایش
  procedureSteps: ExperimentProcedureStep[];
  
  // 10. محاسبات
  calculations: ExperimentCalculation;
  
  // 11. نحوه گزارش نتیجه
  reporting: ExperimentReporting;
  
  // 12. خطاهای احتمالی
  potentialErrors: string[];
  
  // 13. نکات ایمنی
  safetyNotes: string[];
  
  // 14. استاندارد مرجع (تفکیک‌شده بدون مخلوط کردن)
  standardReference: ExperimentStandardReference;
  
  // 15. منابع علمی
  sources: SourceCitation[];
  
  // 16. سطح اعتبار منبع
  verificationStatus: ExperimentVerificationStatus;
  reliabilityGrade: ReliabilityGrade;
  
  // متادیتا
  tags: string[];
  offlineAvailable: boolean;
  isVerifiedProtocol: boolean; // نشان‌دهنده استناد به رفرنس قطعی
  customNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filter Parameters for Experiment Search
 */
export interface ExperimentSearchFilters {
  query: string;
  domain: ExperimentDomain | 'all';
  standardOrganization: 'all' | 'INSO' | 'ISO' | 'AOAC' | 'ASTM' | 'Codex' | 'AOCS' | 'IDF' | 'Other';
  verificationStatus: ExperimentVerificationStatus | 'all';
  reliabilityGrade: ReliabilityGrade | 'all';
  offlineOnly: boolean;
  verifiedOnly: boolean;
}

/**
 * Statistics Overview
 */
export interface ExperimentStatistics {
  total: number;
  totalExperiments?: number;
  verifiedStandardsCount: number;
  insoStandardsCount?: number;
  domainsDistribution: Record<ExperimentDomain, number>;
  domainCounts?: Record<ExperimentDomain, number>;
  standardsDistribution: Record<string, number>;
  offlineCount: number;
}
