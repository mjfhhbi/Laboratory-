/**
 * Food Science AI - Food Standards Management Domain Types
 * 
 * Strict schema for Food Industry Standards (National Iranian Standards INSO vs International Standards),
 * test methods, required equipment, reagents, procedures, calculations, acceptable limits,
 * safety warnings, and verified scientific source linking.
 */

import { ScientificSource, SourceCitation, VerificationStatus } from './knowledgeBase';

/**
 * Standard Jurisdiction (Strictly separates Iranian National vs International/Foreign)
 */
export type StandardJurisdiction =
  | 'iranian_national'       // استانداردهای ملی ایران (INSO / ISIRI)
  | 'international_foreign'; // استانداردهای بین‌المللی و خارجی (Codex, ISO, FDA, EFSA, AOAC, etc.)

/**
 * Food Industry Scope & Sectors
 */
export type FoodStandardSector =
  | 'dairy'                 // فرآورده‌های شیری و لبنیات
  | 'cereals_bakery'        // غلات، آرد، نان و فرآورده‌های آردی
  | 'meat_protein'          // گوشت، فرآورده‌های پروتئینی، طیور و شیلات
  | 'oils_fats'             // روغن‌ها، چربی‌های خوراکی و دانه‌های روغنی
  | 'beverages'             // نوشیدنی‌ها، آبمیوه، کنسانتره و آب بسته‌بندی
  | 'canning_preserves'     // کنسروسازی، کمپوت، شوریجات و ترشیجات
  | 'sugar_confectionery'   // قند، شکر، کاکائو، شکلات و شیرینی‌پزی
  | 'spices_condiments'     // ادویه‌جات، چاشنی‌ها، سس‌ها و نمک
  | 'microbiology_hygiene'  // میکروبیولوژی، بهداشت و مسمومیت‌های غذایی
  | 'packaging_labeling'    // بسته‌بندی، برچسب‌گذاری و ظروف در تماس با غذا
  | 'general_sampling'      // روش‌های عمومی نمونه‌برداری، آزمون و واژه‌شناسی
  | 'other';                // سایر حوزه‌های تخصصی

export interface FoodStandardSectorMeta {
  id: FoodStandardSector;
  titleFa: string;
  titleEn: string;
  badgeColor: string;
}

export const FOOD_STANDARD_SECTORS: Record<FoodStandardSector, FoodStandardSectorMeta> = {
  dairy: {
    id: 'dairy',
    titleFa: 'شیر و فرآورده‌های لبنی',
    titleEn: 'Dairy & Milk Products',
    badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  cereals_bakery: {
    id: 'cereals_bakery',
    titleFa: 'غلات، آرد و فرآورده‌های آردی',
    titleEn: 'Cereals, Flour & Bakery',
    badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  meat_protein: {
    id: 'meat_protein',
    titleFa: 'گوشت، پروتئین و شیلات',
    titleEn: 'Meat, Protein & Seafood',
    badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  },
  oils_fats: {
    id: 'oils_fats',
    titleFa: 'روغن‌ها و چربی‌های خوراکی',
    titleEn: 'Edible Oils & Fats',
    badgeColor: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
  },
  beverages: {
    id: 'beverages',
    titleFa: 'نوشیدنی‌ها، آبمیوه و آب',
    titleEn: 'Beverages, Juices & Water',
    badgeColor: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
  },
  canning_preserves: {
    id: 'canning_preserves',
    titleFa: 'کنسروسازی و ترشیجات',
    titleEn: 'Canned Foods & Preserves',
    badgeColor: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800'
  },
  sugar_confectionery: {
    id: 'sugar_confectionery',
    titleFa: 'قند، شکر، شیرینی و شکلات',
    titleEn: 'Sugar & Confectionery',
    badgeColor: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  spices_condiments: {
    id: 'spices_condiments',
    titleFa: 'ادویه، چاشنی‌ها و سس‌ها',
    titleEn: 'Spices & Condiments',
    badgeColor: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
  },
  microbiology_hygiene: {
    id: 'microbiology_hygiene',
    titleFa: 'میکروبیولوژی، بهداشت و سموم',
    titleEn: 'Microbiology & Food Safety',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  packaging_labeling: {
    id: 'packaging_labeling',
    titleFa: 'بسته‌بندی و برچسب‌گذاری',
    titleEn: 'Packaging & Labeling',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  },
  general_sampling: {
    id: 'general_sampling',
    titleFa: 'نمونه‌برداری و روش‌های عمومی',
    titleEn: 'Sampling & General Methods',
    badgeColor: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700'
  },
  other: {
    id: 'other',
    titleFa: 'سایر حوزه‌ها',
    titleEn: 'Other Food Sectors',
    badgeColor: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
  }
};

/**
 * Standard Status
 */
export type StandardLifecycleStatus =
  | 'active'          // معتبر و جاری
  | 'under_revision'  // در دست بازنگری / تجدیدنظر
  | 'withdrawn'       // ابطال‌شده / منسوخ
  | 'draft';          // پیش‌نویس اولیه

/**
 * Structured Acceptable Limit / Specification Requirement
 */
export interface AcceptableLimitSpecification {
  id: string;
  parameterNameFa: string;
  parameterNameEn?: string;
  limitSpecification: string; // e.g. "حداقل ۳.۲", "حداکثر ۱۰ mg/kg", "منفی در ۲۵ گرم"
  unit?: string;               // e.g. "درصد وزنی", "mg/kg", "CFU/g", "°Brix"
  tolerance?: string;          // e.g. "±۰.۱"
  testMethodRef?: string;      // e.g. "بند ۶.۲ همین استاندارد" یا "AOAC 942.15"
  notes?: string;
}

/**
 * Food Standard Core Schema
 */
export interface FoodStandard {
  id: string;
  
  // 1. Jurisdiction & Classification
  jurisdiction: StandardJurisdiction; // Strict separation: iranian_national vs international_foreign
  country: string;                    // e.g. "ایران", "بین‌المللی", "ایالات متحده آمریکا", "اتحادیه اروپا"
  issuingOrganization: string;        // e.g. "سازمان ملی استاندارد ایران (INSO)", "کمیسیون کدکس (Codex)", "ISO", "FDA"
  
  // 2. Identification
  standardNumber: string;             // Mandatory for Iran (e.g. INSO 2406, Codex Stan 87-1981, ISO 22000:2018)
  titleFa: string;                    // عنوان فارسی استاندارد
  titleEn?: string;                   // عنوان انگلیسی استاندارد
  revisionAndYear: string;            // Mandatory for Iran (e.g. "تجدیدنظر دوم - ۱۳۹۸", "2021 Amendment")
  lifecycleStatus: StandardLifecycleStatus;
  sector: FoodStandardSector;
  
  // 3. Technical Core Sections
  scopeOfApplication: string;         // دامنه کاربرد و هدف استاندارد
  testMethod: string;                 // روش آزمون مرجع
  requiredEquipment: string[];        // تجهیزات و دستگاه‌های موردنیاز
  reagentsAndChemicals: string[];     // مواد، معرف‌ها، بافرها و محلول‌های استاندارد
  testConditions: string;             // شرایط محیطی و آزمون (دما، رطوبت، کالیبراسیون و...)
  testProcedure: string;              // مراحل گام‌به‌گام اجرای آزمون
  calculationsAndFormulas: string;    // محاسبات و فرمول‌ها (پشتیبانی از LaTeX)
  acceptableLimits: AcceptableLimitSpecification[]; // محدوده‌های مجاز و مشخصات فیزیکوشیمیایی/میکروبی
  errorsAndSafetyWarnings: string;    // خطاها، هشدارهای ایمنی و عوامل مداخله‌گر
  
  // 4. Scientific Verification & Citations
  verificationStatus: VerificationStatus;
  sources: SourceCitation[];          // Must have at least 1 verified source to be official_regulatory or verified_with_source
  
  // 5. Metadata
  tags: string[];
  offlineAvailable: boolean;
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
    authorOrImportSource?: string;
    schemaVersion: string;
  };
}

/**
 * Filter and Search criteria for Standards
 */
export interface FoodStandardSearchFilters {
  query?: string;
  jurisdiction?: StandardJurisdiction | 'all';
  sector?: FoodStandardSector | 'all';
  issuingOrganization?: string;
  lifecycleStatus?: StandardLifecycleStatus | 'all';
  verificationStatus?: VerificationStatus | 'all';
  hasAcceptableLimitsOnly?: boolean;
  offlineOnly?: boolean;
}

/**
 * Validation Result for Food Standard data
 */
export interface FoodStandardValidationResult {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
  warnings: Array<{ field: string; message: string }>;
}

/**
 * Bundle for Standards Import & Export
 */
export interface FoodStandardsBundle {
  bundleVersion: '1.0';
  exportedAt: string;
  application: 'Food Science AI';
  schemaVersion: '2.0.0';
  jurisdictionFilter?: StandardJurisdiction | 'all';
  sources: ScientificSource[];
  standards: FoodStandard[];
}
