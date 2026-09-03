/**
 * Food Science AI - Laboratory Equipment & Instrument System Schema
 * Specialized for Food Analysis, Microbiology, Rheology, Proximate Analysis and Quality Control.
 */

import { SourceCitation } from './knowledgeBase';

/**
 * 17 Standard Categories of Food Science Laboratory Equipment
 */
export type EquipmentCategory =
  | 'balance'                // ترازو
  | 'oven'                   // آون
  | 'muffle_furnace'         // کوره
  | 'ph_meter'               // pH متر
  | 'spectrophotometer'      // اسپکتروفتومتر
  | 'centrifuge'             // سانتریفیوژ
  | 'incubator'              // انکوباتور
  | 'autoclave'              // اتوکلاو
  | 'burette'                // بورت
  | 'pipette'                // پیپت
  | 'hood'                   // هود
  | 'desiccator'             // دسیکاتور
  | 'refractometer'          // رفراکتومتر
  | 'viscometer'             // ویسکومتر
  | 'texture_analyzer'       // دستگاه بافت‌سنج
  | 'microbiology_equipment' // تجهیزات میکروبیولوژی
  | 'general_lab_equipment'; // تجهیزات عمومی آزمایشگاه

export interface EquipmentCategoryMeta {
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  badgeColor: string;
  color: string;
  iconName: string;
}

export const EQUIPMENT_CATEGORIES: Record<EquipmentCategory, EquipmentCategoryMeta> = {
  balance: {
    titleFa: 'ترازوهای آزمایشگاهی',
    titleEn: 'Analytical & Precision Balances',
    descriptionFa: 'ترازوهای آنالیتیکال، ۴ رقمی، رطوبت‌سنج و توزین دقیق جهت سنجش وزن نمونه‌ها و معرف‌ها',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    color: '#059669',
    iconName: 'Scale'
  },
  oven: {
    titleFa: 'آون آزمایشگاهی',
    titleEn: 'Drying Oven',
    descriptionFa: 'خشک‌کن حرارتی استاندارد، آون تحت خلاء جهت سنجش رطوبت و ماده خشک فرآورده‌های غذایی',
    badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    color: '#d97706',
    iconName: 'Flame'
  },
  muffle_furnace: {
    titleFa: 'کوره الکتریکی',
    titleEn: 'Muffle Furnace',
    descriptionFa: 'کوره دما بالا (تا ۱۲۰۰ درجه سلسیوس) جهت خاکسترگیری کل و سنجش مواد معدنی',
    badgeColor: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    color: '#ea580c',
    iconName: 'FlameKindling'
  },
  ph_meter: {
    titleFa: 'pH متر',
    titleEn: 'pH Meter & Electrodes',
    descriptionFa: 'دستگاه سنجش پتانسیومتری اسیدیته فعال و الکترودهای اختصاصی گوشت، شیر، میوه و مایعات',
    badgeColor: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    color: '#0891b2',
    iconName: 'Activity'
  },
  spectrophotometer: {
    titleFa: 'اسپکتروفتومتر UV-Vis',
    titleEn: 'UV-Vis Spectrophotometer',
    descriptionFa: 'طیف‌سنجی نوری مرئی و فرابنفش جهت سنجش پروتئین، رنگ‌ها، نیتریت و ترکیبات فنولی',
    badgeColor: 'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    color: '#7c3aed',
    iconName: 'Waves'
  },
  centrifuge: {
    titleFa: 'سانتریفیوژ',
    titleEn: 'Centrifuge & Gerber',
    descriptionFa: 'جداسازی فازهای مایع-جامد، سانتریفیوژ ژربیر چربی شیر و سانتریفیوژ یخچال‌دار',
    badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    color: '#2563eb',
    iconName: 'RotateCw'
  },
  incubator: {
    titleFa: 'انکوباتور',
    titleEn: 'Incubator & BOD',
    descriptionFa: 'انکوباتورهای دمای ثابت، یخچال‌دار و شیکردار جهت کشت‌های میکروبی و آزمون‌های ماندگاری',
    badgeColor: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    color: '#0d9488',
    iconName: 'ThermometerSun'
  },
  autoclave: {
    titleFa: 'اتوکلاو',
    titleEn: 'Autoclave & Steam Sterilizer',
    descriptionFa: 'استریل‌کننده بخار تحت فشار جهت آماده‌سازی محیط‌های کشت میکروبیولوژی و سترون‌سازی',
    badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    color: '#475569',
    iconName: 'ShieldAlert'
  },
  burette: {
    titleFa: 'بورت و دیسپنسر تیتراسیون',
    titleEn: 'Burette & Titration Unit',
    descriptionFa: 'ابزارهای شیشه‌ای کلاس A و دیجیتال تیتراسیون جهت اسیدیته، پراکسید، کلرید و صابونی',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    color: '#4f46e5',
    iconName: 'Pipette'
  },
  pipette: {
    titleFa: 'پیپت و سمپلر میکرولیتر',
    titleEn: 'Pipette & Micropipette',
    descriptionFa: 'پیپت‌های حجمی، مدرج، سمپلرهای متغیر و پیپتورهای اتوماتیک برای برداشت دقیق حجم',
    badgeColor: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    color: '#0284c7',
    iconName: 'Pipette'
  },
  hood: {
    titleFa: 'هود شیمیایی و لامینار فلو',
    titleEn: 'Fume Hood & Laminar Flow',
    descriptionFa: 'هودهای تهویه بخارات شیمیایی و هودهای کلاس II میکروبیولوژی برای ایمنی پرسنل و نمونه',
    badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    color: '#e11d48',
    iconName: 'Wind'
  },
  desiccator: {
    titleFa: 'دسیکاتور',
    titleEn: 'Desiccator',
    descriptionFa: 'ظروف شیشه‌ای یا خلاء حاوی رطوبت‌گیر (سیلیکاژل) برای خنک‌سازی نمونه‌های خشک و بی‌وزن کردن',
    badgeColor: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    color: '#78716c',
    iconName: 'Box'
  },
  refractometer: {
    titleFa: 'رفراکتومتر',
    titleEn: 'Refractometer (Brix & RI)',
    descriptionFa: 'دستگاه ضریب شکست و بریکس‌سنج دیجیتال/چشمی جهت شربت، عسل، روغن و آبمیوه‌ها',
    badgeColor: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    color: '#ca8a04',
    iconName: 'Search'
  },
  viscometer: {
    titleFa: 'ویسکومتر و رئومتر',
    titleEn: 'Viscometer & Rheometer',
    descriptionFa: 'سنجش ویسکوزیته دینامیکی (بروکفیلد)، رفتار جریان سس، کنسانتره و سیالات غیرنیوتنی',
    badgeColor: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    color: '#9333ea',
    iconName: 'Droplet'
  },
  texture_analyzer: {
    titleFa: 'دستگاه بافت‌سنج (Texture Analyzer)',
    titleEn: 'Texture Analyzer & TPA',
    descriptionFa: 'تحلیل پروفایل بافت غذایی (TPA)، سختی پنیر، تردی نان، کشسانی ژل و چسبندگی گوشت',
    badgeColor: 'bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-800 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800',
    color: '#c026d3',
    iconName: 'Cpu'
  },
  microbiology_equipment: {
    titleFa: 'تجهیزات تخصصی میکروبیولوژی',
    titleEn: 'Microbiology Equipment',
    descriptionFa: 'کلنی‌کانتر، استومیکر (هموژنایزر کیسه‌ای)، سرولوژی بن‌ماری، میکروسکوپ و چراغ بونزن',
    badgeColor: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    color: '#14b8a6',
    iconName: 'Microscope'
  },
  general_lab_equipment: {
    titleFa: 'تجهیزات عمومی آزمایشگاه',
    titleEn: 'General Laboratory Equipment',
    descriptionFa: 'هیتر استیرر مغناطیسی، بن‌ماری، حمام اولتراسونیک، ورتکس میکسر و خردکن‌های آزمایشگاهی',
    badgeColor: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
    color: '#52525b',
    iconName: 'Wrench'
  }
};

/**
 * Calibration Status
 */
export type CalibrationStatus =
  | 'valid'
  | 'expiring_soon'
  | 'expired'
  | 'calibrated_in_house'
  | 'not_required';

export const CALIBRATION_STATUS_META: Record<CalibrationStatus, {
  labelFa: string;
  badgeColor: string;
  descriptionFa: string;
}> = {
  valid: {
    labelFa: 'کالیبره و معتبر',
    badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    descriptionFa: 'دارای گواهینامه کالیبراسیون معتبر با برچسب تایید'
  },
  expiring_soon: {
    labelFa: 'نزدیک به انقضا (کمتر از ۳۰ روز)',
    badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    descriptionFa: 'مهلت دوره کالیبراسیون در ماه جاری به اتمام می‌رسد'
  },
  expired: {
    labelFa: 'منقضی شده / نیازمند کالیبراسیون',
    badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    descriptionFa: 'تاریخ کالیبراسیون سپری شده و استفاده از نتایج بدون تمدید مجاز نیست'
  },
  calibrated_in_house: {
    labelFa: 'صحت‌سنجی داخلی (In-house)',
    badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    descriptionFa: 'کنترل دوره‌ای با وزنه یا استانداردهای مرجع داخلی مطابق چک‌لیست'
  },
  not_required: {
    labelFa: 'عدم نیاز به کالیبراسیون دوره‌ای',
    badgeColor: 'bg-stone-50 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    descriptionFa: 'تجهیزات کمکی فاقد مقیاس اندازه‌گیری مستقیم نیازمند نگهداری عادی'
  }
};

/**
 * Technical Specification Schema
 * RULE: If a spec is not stated in source/standard, do NOT guess. Set to undefined or mark unverified.
 */
export interface EquipmentSpecification {
  measurementRange?: string; // محدوده اندازه‌گیری
  capacity?: string;         // ظرفیت
  accuracy?: string;         // دقت / عدم قطعیت
  resolution?: string;       // تفکیک‌پذیری
  powerSupply?: string;      // ولتاژ / توان الکتریکی
  operatingTemperature?: string; // دمای کاری دستگاه
  isSpecifiedInSource?: boolean; // آیا مشخصات در سورس رسمی ذکر شده؟
}

/**
 * Common Errors and Troubleshooting Schema
 */
export interface EquipmentErrorTroubleshoot {
  errorCode?: string;
  title: string;
  symptom: string;         // نشانه خرابی
  probableCause: string;   // علت احتمالی
  correctiveAction: string;// اقدام اصلاحی
}

/**
 * Laboratory Equipment Main Entity
 */
export interface LaboratoryEquipment {
  id: string;
  code: string;                          // کد شناسایی دستگاه مانند EQ-BAL-001
  nameFa: string;                        // نام فارسی
  nameEn: string;                        // نام انگلیسی
  category: EquipmentCategory;           // دسته ۱۷ گانه
  model?: string;                        // مدل دستگاه
  manufacturer?: string;                 // سازنده یا برند
  location?: string;                     // محل استقرار در آزمایشگاه
  serialNumber?: string;                 // شماره سریال
  
  // مشخصات فنی
  specifications: EquipmentSpecification;
  
  // کاربردها و محدودیت‌ها
  applications: string[];                // کاربردها در آزمون‌های مواد غذایی
  limitations: string[];                 // محدودیت‌های استفاده
  
  // کنترل عملکرد و کالیبراسیون
  performanceVerificationMethod: string; // روش کنترل عملکرد و صحت روزانه
  calibrationStatus: CalibrationStatus;  // وضعیت کالیبراسیون
  lastCalibrationDate?: string;          // تاریخ آخرین کالیبراسیون
  nextCalibrationDate?: string;          // تاریخ کالیبراسیون بعدی
  calibrationIntervalMonths?: number;    // دوره تناوب کالیبراسیون (ماه)
  calibrationProvider?: string;          // مرجع کالیبره‌کننده
  
  // خطاهای رایج و نگهداری
  commonErrors: EquipmentErrorTroubleshoot[]; // عیب‌یابی و رفع خطاها
  maintenanceNotes: string[];            // نکات نگهداری و پیشگیرانه
  standardOperatingProcedure?: string;   // خلاصه SOP کاربری دستگاه
  safetyNotes?: string[];                // الزامات ایمنی
  
  // پیوند با آزمایش‌ها
  associatedExperimentCodes?: string[];  // کدهای آزمایش‌های متصل
  
  // مراجع علمی و اصالت‌سنجی
  sources?: SourceCitation[];
  isSourceVerified?: boolean;            // آیا مستندات بر مبنای منابع رسمی ثبت شده
  
  offlineAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Equipment Filter Query Schema
 */
export interface EquipmentFilterQuery {
  query: string;
  category: EquipmentCategory | 'all';
  calibrationStatus: CalibrationStatus | 'all';
  hasSpecificationsOnly: boolean;
  offlineOnly: boolean;
  associatedExperimentCode?: string;
}

/**
 * Linked Experiment to Equipment Requirement
 * Represents: آزمایش ← تجهیزات موردنیاز ← مشخصات موردنیاز
 */
export interface ExperimentEquipmentRequirement {
  experimentId: string;
  experimentCode: string;
  experimentTitleFa: string;
  equipmentName: string;
  equipmentCategory?: EquipmentCategory;
  matchedEquipmentId?: string;
  requiredSpecification?: string;
  isSpecificationVerifiedInStandard: boolean;
  calibrationRequirement?: string;
  isRequired: boolean;
}

/**
 * Equipment Statistics Schema
 */
export interface EquipmentStatistics {
  total: number;
  categoriesDistribution: Record<EquipmentCategory, number>;
  statusDistribution: Record<CalibrationStatus, number>;
  calibratedCount: number;
  expiringCount: number;
  expiredCount: number;
  offlineCount: number;
  linkedExperimentsCount: number;
}
