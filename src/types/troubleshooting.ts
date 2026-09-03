import { ScientificSource, SourceCitation } from './knowledgeBase';

/**
 * 11 Mandatory Error Categories in Food Science Laboratory Troubleshooting
 */
export type LabErrorCategory =
  | 'sampling_error'            // خطای نمونه‌برداری
  | 'weighing_error'            // خطای توزین
  | 'equipment_error'           // خطای دستگاه
  | 'calibration_error'         // خطای کالیبراسیون
  | 'reagent_error'             // خطای معرف
  | 'temperature_error'         // خطای دما
  | 'time_error'                // خطای زمان
  | 'calculation_error'         // خطای محاسبه
  | 'operator_error'            // خطای اپراتور
  | 'contamination'             // آلودگی
  | 'sample_storage_error';     // خطای نگهداری نمونه

export interface ErrorCategoryMeta {
  id: LabErrorCategory;
  nameFa: string;
  nameEn: string;
  badgeColor: string;
  iconName: string;
  descriptionFa: string;
}

export const LAB_ERROR_CATEGORIES: Record<LabErrorCategory, ErrorCategoryMeta> = {
  sampling_error: {
    id: 'sampling_error',
    nameFa: 'خطای نمونه‌برداری',
    nameEn: 'Sampling Error',
    badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 border-amber-300 dark:border-amber-800',
    iconName: 'Boxes',
    descriptionFa: 'عدم یکنواختی، نمونه‌برداری غیرنماینده، ناهمگنی ماتریس یا جدایش فازی'
  },
  weighing_error: {
    id: 'weighing_error',
    nameFa: 'خطای توزین',
    nameEn: 'Weighing Error',
    badgeColor: 'bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-200 border-blue-300 dark:border-blue-800',
    iconName: 'Scale',
    descriptionFa: 'رانش ترازوی تحلیلی، الکتریسیته ساکن، جریان هوا، توزین ظرف گرم یا جذب رطوبت'
  },
  equipment_error: {
    id: 'equipment_error',
    nameFa: 'خطای دستگاه',
    nameEn: 'Equipment & Instrument Error',
    badgeColor: 'bg-rose-100 text-rose-900 dark:bg-rose-950/70 dark:text-rose-200 border-rose-300 dark:border-rose-800',
    iconName: 'Wrench',
    descriptionFa: 'نقص قطعات مکانیکی/الکترونیکی، نشتی سیستم خلاء، نوسان المنت، سوختگی لامپ دوتریوم'
  },
  calibration_error: {
    id: 'calibration_error',
    nameFa: 'خطای کالیبراسیون',
    nameEn: 'Calibration Error',
    badgeColor: 'bg-purple-100 text-purple-900 dark:bg-purple-950/70 dark:text-purple-200 border-purple-300 dark:border-purple-800',
    iconName: 'Sliders',
    descriptionFa: 'انقضای کالیبراسیون بورت/پیپت/ترازو، استفاده از استانداردهای کالیبراسیون نامعتبر یا شیب نادرست سنسور'
  },
  reagent_error: {
    id: 'reagent_error',
    nameFa: 'خطای معرف و مواد شیمیایی',
    nameEn: 'Reagent & Chemical Error',
    badgeColor: 'bg-teal-100 text-teal-900 dark:bg-teal-950/70 dark:text-teal-200 border-teal-300 dark:border-teal-800',
    iconName: 'Pipette',
    descriptionFa: 'فساد معرف، تغییر فاکتور نرمالیته تیترانت، انقضای آب مقطر دیونیزه یا خلوص ناکافی حلال'
  },
  temperature_error: {
    id: 'temperature_error',
    nameFa: 'خطای دما',
    nameEn: 'Temperature Error',
    badgeColor: 'bg-orange-100 text-orange-900 dark:bg-orange-950/70 dark:text-orange-200 border-orange-300 dark:border-orange-800',
    iconName: 'Flame',
    descriptionFa: 'عدم یکنواختی دمای آون/کوره/انکوباتور، خطای سنسور حرارتی یا عدم تصحیح دمایی بریکس'
  },
  time_error: {
    id: 'time_error',
    nameFa: 'خطای زمان و سینتیک',
    nameEn: 'Time & Kinetic Error',
    badgeColor: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950/70 dark:text-cyan-200 border-cyan-300 dark:border-cyan-800',
    iconName: 'Clock',
    descriptionFa: 'کافی نبودن زمان هضم/استخراج، طولانی شدن ماندگاری رنگ سنجی یا انکوباسیون خارج از بازه'
  },
  calculation_error: {
    id: 'calculation_error',
    nameFa: 'خطای محاسبه و فاکتور',
    nameEn: 'Calculation & Factor Error',
    badgeColor: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800',
    iconName: 'Calculator',
    descriptionFa: 'اشتباه در ضریب تبدیل نیتروژن (F)، عدم کسر بلانک، عدم اعمال فاکتور رقت (DF) یا خطای گردکردن'
  },
  operator_error: {
    id: 'operator_error',
    nameFa: 'خطای اپراتور و متدولوژی',
    nameEn: 'Operator & Handling Error',
    badgeColor: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950/70 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800',
    iconName: 'UserCheck',
    descriptionFa: 'خطای پارالاکس در خواندن بورت، سرعت نامناسب تیتراسیون، عدم رعایت ایمنی یا سوءبرداشت از SOP'
  },
  contamination: {
    id: 'contamination',
    nameFa: 'آلودگی و تداخل شیمیایی/میکروبی',
    nameEn: 'Contamination & Matrix Interference',
    badgeColor: 'bg-rose-200 text-rose-950 dark:bg-rose-950/80 dark:text-rose-200 border-rose-400 dark:border-rose-700',
    iconName: 'ShieldAlert',
    descriptionFa: 'آلودگی ظروف شیشه‌ای با شوینده، حضور یون‌های مزاحم، آلودگی متقاطع محیط کشت یا بخارات آزمایشگاه'
  },
  sample_storage_error: {
    id: 'sample_storage_error',
    nameFa: 'خطای نگهداری و ترابری نمونه',
    nameEn: 'Sample Preservation & Storage Error',
    badgeColor: 'bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-200 border-stone-400 dark:border-stone-700',
    iconName: 'Archive',
    descriptionFa: 'جذب/دفع رطوبت در بسته‌بندی نامناسب، اکسیداسیون چربی در مجاورت نور یا رشد میکروبی حین انتقال'
  }
};

/**
 * Standard testing stages where errors can occur
 */
export type LabTestStage =
  | 'sampling_homogenization'    // ۱. نمونه‌برداری و همگن‌سازی اولیه
  | 'preparation_weighing'       // ۲. آماده‌سازی و توزین دقیق
  | 'digestion_reaction'         // ۳. هضم شیمیایی، واکنش و حرارت‌دهی
  | 'distillation_extraction'    // ۴. تقطیر، استخراج حلال یا سانتریفیوژ
  | 'titration_endpoint'         // ۵. تیتراسیون و شناسایی نقطه پایانی
  | 'instrumental_reading'       // ۶. قرائت دستگاهی، سنسور و کالیبراسیون
  | 'cooling_desiccator'         // ۷. خنک‌سازی در دسیکاتور و تثبیت وزن
  | 'calculation_reporting'      // ۸. محاسبات، کسر شاهد و گزارش‌دهی
  | 'storage_preservation';      // ۹. نگهداری و پایداری نمونه

export interface LabStageMeta {
  id: LabTestStage;
  nameFa: string;
  nameEn: string;
  descriptionFa: string;
  iconName: string;
}

export const LAB_TEST_STAGES: Record<LabTestStage, LabStageMeta> = {
  sampling_homogenization: {
    id: 'sampling_homogenization',
    nameFa: '۱. نمونه‌برداری و همگن‌سازی',
    nameEn: 'Sampling & Homogenization',
    descriptionFa: 'برداشت سهم معرف از بهر، آسیاب کردن، اختلاط و یکنواخت‌سازی بافت',
    iconName: 'Boxes'
  },
  preparation_weighing: {
    id: 'preparation_weighing',
    nameFa: '۲. آماده‌سازی، خشک‌کردن ظروف و توزین',
    nameEn: 'Preparation & Analytical Weighing',
    descriptionFa: 'شستشو، تثبیت تار ظروف و توزین با ترازوی ۴ رقمی کالیبره',
    iconName: 'Scale'
  },
  digestion_reaction: {
    id: 'digestion_reaction',
    nameFa: '۳. هضم شیمیایی، واکنش و فرآیند حرارتی',
    nameEn: 'Chemical Digestion & Heat Reaction',
    descriptionFa: 'افزایش اسید/کاتالیزور، سوزاندن در کوره ۵۵۰° یا آون ۱۰۵° و واکنش‌های فاز گرم',
    iconName: 'Flame'
  },
  distillation_extraction: {
    id: 'distillation_extraction',
    nameFa: '۴. تقطیر، استخراج حلال یا سانتریفیوژ',
    nameEn: 'Distillation, Extraction & Centrifugation',
    descriptionFa: 'تقطیر بخار کجلدال، استخراج پیوسته سوکسله یا تفکیک فاز چربی در سانتریفیوژ',
    iconName: 'FlaskConical'
  },
  titration_endpoint: {
    id: 'titration_endpoint',
    nameFa: '۵. تیتراسیون و تعیین نقطه پایانی',
    nameEn: 'Titration & Colorimetric Endpoint',
    descriptionFa: 'تیتراسیون حجمی با بورت استاندارد و تشخیص تغییر رنگ شناساگر یا پتانسیومتری',
    iconName: 'Pipette'
  },
  instrumental_reading: {
    id: 'instrumental_reading',
    nameFa: '۶. قرائت دستگاهی، سنسور و اسپکتروفتومتری',
    nameEn: 'Instrumental Measurement & Sensor Optics',
    descriptionFa: 'قرائت جذب نوری در طول موج خاص، ضریب شکست بریکس، pH سنجی یا فعالیت آبی',
    iconName: 'Cpu'
  },
  cooling_desiccator: {
    id: 'cooling_desiccator',
    nameFa: '۷. خنک‌سازی در دسیکاتور و تثبیت وزن',
    nameEn: 'Desiccator Equilibration & Weighing Back',
    descriptionFa: 'خنک کردن بوته/پلیت تا دمای اتاق در مجاورت سیلیکاژل خشک و فعال',
    iconName: 'Clock'
  },
  calculation_reporting: {
    id: 'calculation_reporting',
    nameFa: '۸. محاسبات، اعمال شاهد و گزارش‌دهی',
    nameEn: 'Calculations, Blank Subtraction & Final Report',
    descriptionFa: 'اعمال فاکتورهای استاندارد، کسر آزمون شاهد، تصحیح دما و گردکردن اعشار',
    iconName: 'Calculator'
  },
  storage_preservation: {
    id: 'storage_preservation',
    nameFa: '۹. نگهداری و پایداری نمونه آزمایشی',
    nameEn: 'Sample Preservation & Storage Conditions',
    descriptionFa: 'کنترل دما، رطوبت، نور و هوابندی ظروف نگهداری نمونه تا زمان آزمون',
    iconName: 'Archive'
  }
};

/**
 * Diagnostic Confidence Levels
 */
export type DiagnosticConfidence = 'high' | 'medium' | 'low';

export interface ConfidenceRating {
  level: DiagnosticConfidence;
  percentage: number; // 0 - 100
  labelFa: string;
  badgeClass: string;
  rationaleFa: string;
}

/**
 * Diagnostic Clarification Question for Interactive Follow-up
 */
export interface DiagnosticQuestion {
  id: string;
  questionFa: string;
  questionEn?: string;
  contextFa: string;
  options: {
    id: string;
    labelFa: string;
    descriptionFa?: string;
    suggestedErrorId?: string;
    confidenceBoost?: number;
  }[];
}

/**
 * Probable Error Diagnostic Result Structure with Mandatory Sources
 */
export interface DiagnosedLabError {
  id: string;
  titleFa: string;
  titleEn: string;
  category: LabErrorCategory;
  relevanceScore: number; // 0 - 100
  confidence: ConfidenceRating;
  stage: LabTestStage;

  // The 5 Mandatory Core Pillars
  probableCauseFa: string;
  symptomFa: string;
  diagnosticMethodFa: string;
  correctiveActionFa: string;
  preventiveActionFa: string;

  // Mandatory Standard Source Citation
  source: {
    standardCode: string; // e.g. "ISO 17025:2017 Clause 7.10 / AOAC Official Methods"
    titleFa: string;
    fullCitation: string;
    yearOrEdition: string;
    organization: string;
    clauseOrPage?: string;
    urlOrRefId?: string;
  };

  // Diagnostic Indicators
  triggerKeywords: string[];
  numericalAnomaliesDetected?: string[];
  equipmentImplicated?: string[];
  followUpQuestions?: DiagnosticQuestion[];
}

/**
 * User Laboratory Incident / Troubleshooting Input Session
 */
export interface LabTroubleshootingSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;

  // 1. Experiment Details
  experimentId: string;
  experimentNameFa: string;
  experimentStandardCode?: string;

  // 2. Stage of Problem
  stage: LabTestStage;

  // 3. User Narrative & Observed Behavior
  userActionDescription: string;
  observedSymptom: string;
  selectedSymptomTags: string[];

  // 4. Equipment Used
  equipmentUsed: {
    equipmentId?: string;
    nameFa: string;
    modelOrBrand?: string;
    calibrationStatus?: 'valid' | 'expired' | 'uncalibrated' | 'unknown';
    notes?: string;
  }[];

  // 5. Numerical Inputs & Lab Data Points
  recordedValues: Record<string, {
    labelFa: string;
    value: number | string;
    unit?: string;
    expectedRange?: string;
  }>;

  // 6. Interactive Answered Questions
  answeredQuestions: Record<string, string>; // questionId -> selectedOptionId

  // 7. Results
  diagnosedErrors: DiagnosedLabError[];
  primaryError?: DiagnosedLabError;
  status: 'draft' | 'analyzed' | 'capa_generated' | 'resolved';

  // 8. CAPA / Non-Conformance Record (ISO 17025 Compliance)
  capaRecord?: {
    ncrNumber: string; // e.g. NCR-2026-0827-01
    investigatorName: string;
    rootCauseSummary: string;
    immediateActionTaken: string;
    preventiveActionPlan: string;
    targetCompletionDate: string;
    verificationSignOff: string;
    status: 'open' | 'in_progress' | 'closed';
  };
}
