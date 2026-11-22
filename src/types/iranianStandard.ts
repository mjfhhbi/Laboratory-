/**
 * Food Science AI - Iranian National Standards Domain Schema (INSO / ISIRI)
 * Part 21 of 30: Professional & Manageable Iranian Food Standards Management System
 * 
 * Strict Schema Rules:
 * 1. No guessing of standard numbers (شماره استاندارد را حدس نزن).
 * 2. No synthetic or invented standards (استاندارد ساختگی ایجاد نکن).
 * 3. Never display obsolete/withdrawn standards as current (استاندارد منسوخ را به‌عنوان استاندارد جاری نمایش نده).
 * 4. If status is indeterminate or unverified, display as "نیازمند بررسی" (Needs Review).
 * 5. Respect copyright: Do NOT duplicate full copyright text; manage scopes, limits, tests, formulas, equipment & verified source citations.
 * 6. Historical immutability: When a standard is revised, past test results must retain their locked snapshot.
 */

export type IranianStandardStatus =
  | 'valid'         // معتبر (جاری و دارای وجاهت قانونی)
  | 'obsolete'      // منسوخ (ابطال‌شده و فاقد اعتبار اجرایی)
  | 'superseded'    // جایگزین‌شده (توسط ویرایش جدیدتر یا استاندارد جدیدتر ملغی شده)
  | 'needs_review'; // نیازمند بررسی (در دست بازنگری، استعلام حقوقی یا پیش‌نویس غیرقطعی)

export const IRANIAN_STANDARD_STATUS_CONFIG: Record<
  IranianStandardStatus,
  {
    labelFa: string;
    labelEn: string;
    badgeClass: string;
    dotClass: string;
    descriptionFa: string;
  }
> = {
  valid: {
    labelFa: 'معتبر',
    labelEn: 'Valid / Current',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    dotClass: 'bg-emerald-500',
    descriptionFa: 'استاندارد ملی مصوب، جاری و دارای وجاهت کامل قانونی در آزمون‌های کنترل کیفیت مواد غذایی'
  },
  obsolete: {
    labelFa: 'منسوخ',
    labelEn: 'Obsolete / Withdrawn',
    badgeClass: 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    dotClass: 'bg-rose-500',
    descriptionFa: 'استاندارد منسوخ‌شده و ابطال‌شده توسط سازمان ملی استاندارد ایران؛ استناد به عنوان استاندارد جاری ممنوع است'
  },
  superseded: {
    labelFa: 'جایگزین‌شده',
    labelEn: 'Superseded',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    dotClass: 'bg-amber-500',
    descriptionFa: 'این استاندارد با نسخه جدیدتر یا استاندارد جامع دیگری جایگزین گردیده است'
  },
  needs_review: {
    labelFa: 'نیازمند بررسی',
    labelEn: 'Needs Review',
    badgeClass: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700',
    dotClass: 'bg-stone-500',
    descriptionFa: 'وضعیت حقوقی، ویرایش جاری یا شمول استاندارد در دست استعلام از سامانه رسمی سازمان ملی استاندارد است'
  }
};

export type IranianProductGroup =
  | 'dairy'
  | 'cereals_bakery'
  | 'oils_fats'
  | 'meat_protein'
  | 'beverages'
  | 'canning_preserves'
  | 'sugar_confectionery'
  | 'spices_condiments'
  | 'microbiology_hygiene'
  | 'packaging_labeling'
  | 'general_methods'
  | 'other';

export const IRANIAN_PRODUCT_GROUPS_CONFIG: Record<
  IranianProductGroup,
  {
    id: IranianProductGroup;
    titleFa: string;
    titleEn: string;
    badgeColor: string;
  }
> = {
  dairy: {
    id: 'dairy',
    titleFa: 'شیر و فرآورده‌های لبنی',
    titleEn: 'Dairy Products',
    badgeColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  cereals_bakery: {
    id: 'cereals_bakery',
    titleFa: 'غلات، آرد و فرآورده‌های آردی',
    titleEn: 'Cereals & Bakery',
    badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  oils_fats: {
    id: 'oils_fats',
    titleFa: 'روغن‌ها و چربی‌های خوراکی',
    titleEn: 'Oils & Fats',
    badgeColor: 'bg-yellow-50 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
  },
  meat_protein: {
    id: 'meat_protein',
    titleFa: 'گوشت، فرآورده‌های گوشتی و شیلات',
    titleEn: 'Meat & Seafood',
    badgeColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  },
  beverages: {
    id: 'beverages',
    titleFa: 'آبمیوه‌ها، نوشیدنی‌ها و آب',
    titleEn: 'Juices & Beverages',
    badgeColor: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
  },
  canning_preserves: {
    id: 'canning_preserves',
    titleFa: 'کنسروسازی و رب و ترشیجات',
    titleEn: 'Canned Foods & Preserves',
    badgeColor: 'bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800'
  },
  sugar_confectionery: {
    id: 'sugar_confectionery',
    titleFa: 'قند، شکر، شکلات و شیرینی',
    titleEn: 'Sugar & Confectionery',
    badgeColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  spices_condiments: {
    id: 'spices_condiments',
    titleFa: 'ادویه، چاشنی‌ها و سس‌ها',
    titleEn: 'Spices & Condiments',
    badgeColor: 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
  },
  microbiology_hygiene: {
    id: 'microbiology_hygiene',
    titleFa: 'میکروبیولوژی و بهداشت مواد غذایی',
    titleEn: 'Microbiology & Hygiene',
    badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  packaging_labeling: {
    id: 'packaging_labeling',
    titleFa: 'بسته‌بندی، ظروف و نشانه‌گذاری',
    titleEn: 'Packaging & Labeling',
    badgeColor: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  },
  general_methods: {
    id: 'general_methods',
    titleFa: 'روش‌های عمومی آزمون و نمونه‌برداری',
    titleEn: 'General Methods & Sampling',
    badgeColor: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700'
  },
  other: {
    id: 'other',
    titleFa: 'سایر فرآورده‌های کشاورزی و غذایی',
    titleEn: 'Other Food Categories',
    badgeColor: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
  }
};

export type IranianTestType =
  | 'physicochemical'          // فیزیکوشیمیایی
  | 'microbiological'          // میکروبیولوژی
  | 'rheological_sensory'      // بافت، رئولوژی و حسی
  | 'toxicology_contaminants'  // سموم، آلاینده‌ها و فلزات سنگین
  | 'sampling_preparation';    // نمونه‌برداری و آماده‌سازی

export const IRANIAN_TEST_TYPE_CONFIG: Record<
  IranianTestType,
  {
    id: IranianTestType;
    labelFa: string;
    labelEn: string;
    badgeClass: string;
  }
> = {
  physicochemical: {
    id: 'physicochemical',
    labelFa: 'فیزیکوشیمیایی',
    labelEn: 'Physicochemical',
    badgeClass: 'bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800'
  },
  microbiological: {
    id: 'microbiological',
    labelFa: 'میکروبیولوژی',
    labelEn: 'Microbiological',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  rheological_sensory: {
    id: 'rheological_sensory',
    labelFa: 'رئولوژی و حسی',
    labelEn: 'Rheology & Sensory',
    badgeClass: 'bg-violet-50 dark:bg-violet-950/70 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-800'
  },
  toxicology_contaminants: {
    id: 'toxicology_contaminants',
    labelFa: 'سم‌شناسی و آلاینده‌ها',
    labelEn: 'Toxicology & Contaminants',
    badgeClass: 'bg-red-50 dark:bg-red-950/70 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
  },
  sampling_preparation: {
    id: 'sampling_preparation',
    labelFa: 'نمونه‌برداری و آماده‌سازی',
    labelEn: 'Sampling & Preparation',
    badgeClass: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700'
  }
};

/**
 * ارتباط استاندارد با محصول
 */
export interface IranianStandardLinkedProduct {
  id: string;
  nameFa: string;
  nameEn?: string;
  category: IranianProductGroup;
  productCatalogId?: string; // Foreign key to food product catalog
  applicationNotes?: string;
}

/**
 * ارتباط استاندارد با آزمایش
 */
export interface IranianStandardLinkedTest {
  id: string;
  testNameFa: string;
  testNameEn?: string;
  testType: IranianTestType;
  standardClause?: string; // e.g. "بند ۶.۲ استاندارد"
  acceptableLimit: string;  // e.g. "حداقل ۳.۰ درصد وزنی", "حداکثر ۱۰ mg/kg"
  unit: string;             // e.g. "%", "mg/kg", "CFU/g", "°Brix"
  tolerance?: string;       // e.g. "±۰.۱"
  testMethodReference?: string; // e.g. "روش ژربر بر اساس استاندارد ۲۴۰۶"
  linkedLabProtocolId?: string; // Reference to experiment protocol if applicable
}

/**
 * ارتباط استاندارد با تجهیزات آزمایشگاهی
 */
export interface IranianStandardLinkedEquipment {
  id: string;
  equipmentNameFa: string;
  equipmentTypeFa: string;
  specifications?: string;
  equipmentCatalogId?: string;
  isMandatory: boolean;
}

/**
 * ارتباط استاندارد با روش محاسبه و فرمول‌ها
 */
export interface IranianStandardLinkedCalculation {
  id: string;
  titleFa: string;
  formulaLatexOrText: string;
  variables: Array<{
    symbol: string;
    nameFa: string;
    unit: string;
  }>;
  calculationModuleId?: string; // Link to Calculations page module
  exampleCalculationFa?: string;
}

/**
 * منبع اصلی رسمی استاندارد
 */
export interface IranianStandardOriginalSource {
  sourceId: string;
  organization: string; // e.g. "سازمان ملی استاندارد ایران (INSO / ISIRI)"
  citationCode: string; // e.g. "INSO 2406:1394"
  portalUrl: string;    // e.g. "http://standard.isiri.gov.ir/StandardView.aspx?Id=2406"
  confidenceLevel: 'verified' | 'source_backed' | 'partially_supported' | 'unverified';
  ratificationDetails: string; // e.g. "مصوب یک‌هزار و سیصد و نود و چهارمین اجلاسیه کمیته ملی خوراک"
  hasOfficialPdfReference: boolean;
}

/**
 * ثبت سوابق بازنگری و نگهداری Version و Revision
 */
export interface IranianStandardRevisionHistoryItem {
  revisionNumber: number; // 0, 1, 2, 3, 4 ...
  revisionText: string;   // e.g. "تجدیدنظر چهارم"
  year: string;           // e.g. "۱۳۹۴"
  status: IranianStandardStatus;
  changeSummaryFa: string;
  ratificationDate?: string;
  supersededByStandardNumber?: string;
}

/**
 * مدل جامع استاندارد ملی ایران (INSO / ISIRI)
 */
export interface IranianStandard {
  id: string;
  standardNumber: string; // e.g. "INSO 2406" or "ISIRI 2344"
  titleFa: string;        // عنوان فارسی رسمی
  titleEn: string;        // عنوان انگلیسی رسمی
  icsCode?: string;       // کد بین‌المللی رده‌بندی استانداردها (ICS)
  status: IranianStandardStatus;
  
  // نگهداری Version و Revision
  version: string;        // e.g. "4.0"
  revisionNumber: number; // e.g. 4
  revisionText: string;   // e.g. "تجدیدنظر چهارم"
  ratificationYear: string; // e.g. "۱۳۹۴"
  effectiveDate?: string;   // e.g. "۱۳۹۵/۰۱/۰۱"
  isMandatory: boolean;     // استاندارد اجباری vs استاندارد تشویقی
  
  // رده‌بندی‌ها
  productGroup: IranianProductGroup;
  primaryTestTypes: IranianTestType[];
  
  // دامنه کاربرد
  scopeFa: string;
  
  // ثبت استاندارد جایگزین (در صورت منسوخ یا جایگزین‌شدن)
  supersededBy?: {
    standardNumber: string;
    standardId?: string;
    titleFa?: string;
    year?: string;
    reasonFa?: string;
  };
  
  // استانداردهای پیشین که این استاندارد جایگزین آن‌ها شده است
  replaces?: Array<{
    standardNumber: string;
    standardId?: string;
    titleFa?: string;
    revision?: string;
  }>;
  
  // تاریخچه بازنگری‌ها
  revisionHistory: IranianStandardRevisionHistoryItem[];
  
  // ارتباطات چندگانه
  linkedProducts: IranianStandardLinkedProduct[];
  linkedTests: IranianStandardLinkedTest[];
  linkedEquipments: IranianStandardLinkedEquipment[];
  linkedCalculations: IranianStandardLinkedCalculation[];
  
  // نمایش Source اصلی
  originalSource: IranianStandardOriginalSource;
  
  // حفاظت از حق نشر (Copyright Notice)
  copyrightNotice: string;
  
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * ساختار تغییرناپذیر (Immutable Snapshot) برای نتایج آزمایش
 * تضمین می‌کند که با تغییر استاندارد در آینده، نتایج پیشین هرگز خراب یا مخدوش نشوند.
 */
export interface IranianStandardTestResultSnapshot {
  standardId: string;
  standardNumber: string;        // e.g. "INSO 2406"
  titleFa: string;
  version: string;               // e.g. "4.0"
  revisionNumber: number;        // e.g. 4
  revisionText: string;          // e.g. "تجدیدنظر چهارم - ۱۳۹۴"
  statusAtExecution: IranianStandardStatus;
  appliedLimit: string;          // e.g. "حداقل ۳.۰ درصد وزنی"
  formulaUsed?: string;
  isLocked: true;                // تضمین تغییرناپذیری تاریخی
  snapshotTimestamp: string;
}

export interface IranianStandardTestResult {
  id: string;
  sampleCode: string;
  sampleNameFa: string;
  batchNumber: string;
  productGroup: IranianProductGroup;
  testDate: string;
  operatorName: string;
  testNameFa: string;
  testType: IranianTestType;
  measuredValue: number | string;
  unit: string;
  verdict: 'compliant' | 'non_compliant' | 'borderline';
  verdictNotesFa: string;
  
  // اسنپ‌شات قفل‌شده نسخه استاندارد:
  appliedStandardSnapshot: IranianStandardTestResultSnapshot;
  
  notes?: string;
}

/**
 * فیلترها و معیارهای جستجوی استانداردهای ایران
 */
export interface IranianStandardsSearchFilters {
  query?: string;
  standardNumberQuery?: string;
  titleQuery?: string;
  productQuery?: string;
  testQuery?: string;
  productGroup?: IranianProductGroup | 'all';
  testType?: IranianTestType | 'all';
  status?: IranianStandardStatus | 'all';
  mandatoryOnly?: boolean;
}

/**
 * آمار کلی استانداردهای ملی ایران
 */
export interface IranianStandardsStatistics {
  total: number;
  valid: number;
  obsolete: number;
  superseded: number;
  needsReview: number;
  mandatoryCount: number;
  totalLinkedTests: number;
  totalLinkedProducts: number;
  totalTestResultsRecorded: number;
  byProductGroup: Record<IranianProductGroup, number>;
  byStatus: Record<IranianStandardStatus, number>;
}
