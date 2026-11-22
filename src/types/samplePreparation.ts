/**
 * Food Science AI - Sample Preparation Types & Pipeline Architecture
 * Standardized 5-stage sample preparation structure:
 * Sample ↓ Sampling ↓ Preparation ↓ Conditioning ↓ Analysis
 * Strictly separated from the analytical procedure.
 */

export type SamplePrepStageId =
  | 'sample'         // ۱. مشخصات و مقدار نمونه
  | 'sampling'       // ۲. نمونه‌برداری و ظروف
  | 'preparation'    // ۳. آماده‌سازی فیزیکی و شیمیایی (همگن‌سازی، رقیق‌سازی، فیلتراسیون، استخراج)
  | 'conditioning'   // ۴. شرایط نگهداری، زمان، دما و تطابق
  | 'analysis';      // ۵. تحویل به آزمون و معیارهای پذیرش

export interface SamplePrepStageMeta {
  id: SamplePrepStageId;
  stepNumber: number;
  titleFa: string;
  titleEn: string;
  shortDescription: string;
  iconName: string;
  color: string;
}

export const SAMPLE_PREP_STAGES: Record<SamplePrepStageId, SamplePrepStageMeta> = {
  sample: {
    id: 'sample',
    stepNumber: 1,
    titleFa: 'نمونه هدف (Sample)',
    titleEn: 'Sample Matrix & Quantity',
    shortDescription: 'تعریف ماتریس، حالت فیزیکی، مقدار آزمایه و حدود رواداری',
    iconName: 'Package',
    color: '#0284c7' // sky-600
  },
  sampling: {
    id: 'sampling',
    stepNumber: 2,
    titleFa: 'نمونه‌برداری و ظروف (Sampling)',
    titleEn: 'Sampling & Containers',
    shortDescription: 'پروتکل نمونه‌برداری نماینده، استاندارد مرجع نمونه‌برداری و ظروف مجاز',
    iconName: 'Boxes',
    color: '#0d9488' // teal-600
  },
  preparation: {
    id: 'preparation',
    stepNumber: 3,
    titleFa: 'عملیات آماده‌سازی (Preparation)',
    titleEn: 'Preparation & Homogenization',
    shortDescription: 'آماده‌سازی اولیه، همگن‌سازی، رقیق‌سازی، فیلتراسیون و استخراج فاز',
    iconName: 'Scissors',
    color: '#d97706' // amber-600
  },
  conditioning: {
    id: 'conditioning',
    stepNumber: 4,
    titleFa: 'تطابق و نگهداری (Conditioning)',
    titleEn: 'Conditioning & Storage',
    shortDescription: 'شرایط، زمان ماند، دما و پایدارسازی پیش از آزمون',
    iconName: 'Thermometer',
    color: '#7c3aed' // violet-600
  },
  analysis: {
    id: 'analysis',
    stepNumber: 5,
    titleFa: 'تحویل به آنالیز (Analysis Handover)',
    titleEn: 'Analysis Handover & Readiness',
    shortDescription: 'انتقال نمونه آماده به مرحله اجرای آزمون اصلی (Procedure)',
    iconName: 'CheckCircle2',
    color: '#059669' // emerald-600
  }
};

/**
 * Stage 1: Sample Matrix & Amount
 */
export interface SamplePrepSampleStage {
  sampleType: string;                 // نوع نمونه (شیر خام، روغن سرخ‌کردنی، سوسیس، آرد گندم و...)
  physicalState?: 'liquid' | 'solid' | 'semi_solid' | 'powder' | 'emulsion' | 'viscous';
  sampleAmount: string;               // مقدار نمونه (مثلاً ۵.۰۰ گرم، ۱۰ میلی‌لیتر)
  tolerance?: string;                 // تلورانس مجاز توزین یا اندازه‌گیری (مثلاً ± ۰.۰۰۱ گرم)
  moistureContentGuide?: string;      // راهنمای محتوای رطوبتی در صورت نیاز
  matrixNotes?: string;               // نکات تکمیلی ماتریس
}

/**
 * Stage 2: Sampling Protocol & Containers
 */
export interface SamplePrepSamplingStage {
  samplingMethod: string;             // نحوه نمونه‌برداری (تصادفی طبق جدول اعداد تصادفی، بهر، نمونه نماینده)
  samplingStandardRef?: string;       // استاندارد اختصاصی نمونه‌برداری (مثلاً INSO 419, ISO 707)
  containers: string[];               // ظروف نگهداری و نمونه‌برداری (شیشه‌ای در پیچ‌دار کهربایی، ارلن مایر پلی‌پروپیلن)
  preservationProtocol?: string;      // محافظت از نمونه حین ترابری و انتقال
  samplingPrecautions?: string;       // هشدارهای پیشگیری از آلودگی نمونه
}

/**
 * Stage 3: Preparation, Homogenization, Dilution, Filtration, Extraction
 */
export interface SamplePrepDilutionSpec {
  required: boolean;
  diluent?: string;                   // حلال رقیق‌کننده (آب مقطر دیونیزه بدون گاز، بافر پپتون آب)
  dilutionRatio?: string;             // نسبت رقت‌سازی (مثلاً ۱:۱۰، ۱۰ به ۱۰۰)
  dilutionFactor?: number | string;   // فاکتور عددی رقت (F)
  procedureNotes?: string;            // نحوه انجام دقیق رقت‌سازی
}

export interface SamplePrepFiltrationSpec {
  required: boolean;
  filterType?: string;                // کاغذ صافی واتمن نمره ۴۲، فیلتر غشایی تفلونی ۰.۴۵ میکرون
  poreSize?: string;                  // اندازه منافذ (0.45µm, 0.22µm)
  centrifugationAlternative?: string; // جایگزینی با سانتریفیوژ (مثلاً ۴۰۰۰ دور بر دقیقه به مدت ۱۰ دقیقه)
  filtrationNotes?: string;
}

export interface SamplePrepExtractionSpec {
  required: boolean;
  technique?: string;                 // استخراج فاز جامد (SPE)، استخراج سوکسله، استخراج مایع-مایع
  extractingSolvent?: string;         // حلال استخراج (دی‌اتیل اتر و پترولیوم اتر، ان-هگزان)
  solventVolume?: string;             // حجم حلال مصرفی (مثلاً ۵۰ میلی‌لیتر در ۳ نوبت)
  phaseSeparationNotes?: string;      // نحوه تفکیک فازها و شستشوی فاز آبی/آلی
}

export interface SamplePrepPreparationStage {
  preliminaryPrep?: string;           // آماده‌سازی اولیه (شستشو، پوست‌گیری، بریدن ناخالصی‌ها، ذوب ملایم)
  homogenization: string;             // همگن‌سازی (آسیاب آزمایشگاهی، مخلوط‌کن با تیغه استیل، استومیکر)
  homogenizationTimeOrCycles?: string;// زمان یا تعداد دورهای همگن‌سازی
  sieveMeshSize?: string;             // سایز مش الک در مواد پودری (مثلاً عبور کامل از الک ۵۰۰ میکرون)
  dilution?: SamplePrepDilutionSpec;  // رقیق‌سازی
  filtration?: SamplePrepFiltrationSpec; // فیلتراسیون یا شفاف‌سازی
  extraction?: SamplePrepExtractionSpec; // استخراج
  reagentAdditionDuringPrep?: string; // افزودن اسید یا معرف در فاز آماده‌سازی (هضم، انحلال)
}

/**
 * Stage 4: Conditioning & Storage
 */
export interface SamplePrepConditioningStage {
  storageConditions: string;          // شرایط نگهداری (محیط تاریک و خنک، داخل دسیکاتور روی سیلیکاژل)
  storageTime: string;                // زمان نگهداری / بیشینه زمان مجاز ماند پیش از آغاز آزمون
  temperature: string;                // دمای نگهداری (یخچال ۲ تا ۴ درجه یا ۲۰ تا ۲۵ درجه سلسیوس)
  relativeHumidity?: string;          // رطوبت نسبی مجاز
  equilibrationInstructions?: string; // هم‌دمایی با دمای اتاق پیش از آزمون (مثلاً ۳۰ دقیقه در دمای ۲۰ درجه)
  protectionFromLight: boolean;       // حفاظت در برابر تابش نور مستقیم و UV
}

/**
 * Stage 5: Analysis Handover & Verification
 */
export interface SamplePrepAnalysisStage {
  handoverToProcedureNotes: string;   // نحوه تحویل نمونه آماده به شروع گام اول Procedure
  readinessVerificationCriteria: string[]; // چک‌لیست تایید آمادگی فیزیکی و شیمیایی نمونه
  preservationLimitAfterPrep: string; // حداکثر زمان پایداری نمونه آماده‌شده قبل از فساد یا تبخیر
}

/**
 * Independent Source Citation for a specific preparation method
 */
export interface SamplePrepMethodSource {
  organization: 'INSO' | 'ISIRI' | 'ISO' | 'AOAC' | 'IDF' | 'AOCS' | 'ASTM' | 'Codex' | 'Other';
  standardNumber: string;             // مثلاً INSO 4179 یا ISO 660
  clauseOrSection: string;            // مثلاً بند ۶-۱ یا بند ۷-۲
  titleFa?: string;
  titleEn?: string;
  year?: string;
  verificationStatus: 'VERIFIED' | 'SUPPORTED' | 'UNVERIFIED';
}

/**
 * Complete Sample Preparation Method Definition
 * Supports multiple independent methods per experiment (e.g., solid vs liquid vs powder).
 */
export interface SamplePrepMethod {
  id: string;
  methodTitleFa: string;             // عنوان روش (مثلاً آماده‌سازی شیر خام و مایعات یا آماده‌سازی پنیر و فرآورده‌های غلیظ)
  methodTitleEn?: string;
  applicableMatrices: string[];      // فهرست ماتریس‌های مشمول این روش
  isDefault?: boolean;
  
  // منبع علمی و استاندارد کاملاً مستقل
  source: SamplePrepMethodSource;
  
  // ۵ مرحله متوالی ساختاری:
  // Sample ↓ Sampling ↓ Preparation ↓ Conditioning ↓ Analysis
  sample: SamplePrepSampleStage;
  sampling: SamplePrepSamplingStage;
  preparation: SamplePrepPreparationStage;
  conditioning: SamplePrepConditioningStage;
  analysis: SamplePrepAnalysisStage;
  
  // هشدارها و نکات بحرانی اختصاصی این روش
  warnings: string[];
  
  // یادداشت‌های فنی و منبع
  notes?: string[];
}
