/**
 * Food Science AI - Unified Scientific Source & Confidence Domain Types
 * 
 * Strict Domain Schema for Source Management System (Part 20 of 20):
 * - 10 Core Scientific Source Types (INSO, ISO, AOAC, Codex, Papers, Books, Lab Manuals, SDS, Academic, Regulatory)
 * - 4 Confidence Levels (Verified, Source-backed, Partially supported, Unverified)
 * - Mandatory fields: Title, Type, Author/Org, Year, Edition, Standard Number, Country, URL, PDF, Access Date, Confidence, Notes
 * - Scientific integrity, conflict/discrepancy tracking, and cross-module linkages.
 */

export type ScientificSourceType =
  | 'scientific_paper'     // مقاله علمی پژوهشی داوری‌شده (Peer-reviewed Journal Paper)
  | 'reference_book'       // کتاب مرجع تخصصی دانشگاهی (Reference Textbook)
  | 'inso_standard'        // استاندارد ملی ایران (INSO / ISIRI)
  | 'iso_standard'         // استاندارد بین‌المللی ایزو (ISO)
  | 'aoac_method'          // روش رسمی آزمون (AOAC Official Method)
  | 'codex_standard'       // استاندارد کمیسیون بین‌المللی کدکس (Codex Alimentarius)
  | 'lecture_handout'      // جزوه آموزشی دانشگاهی و پمفلت (Course Lecture Handout)
  | 'lab_file'             // فایل، پروتکل و گزارش آزمایشگاهی (Lab File / Protocol / Log)
  | 'lab_manual'           // راهنمای آزمایشگاهی و دستورالعمل SOP (Laboratory Manual / SOP)
  | 'sds'                  // برگه اطلاعات ایمنی مواد شیمیایی (Safety Data Sheet - SDS)
  | 'academic_thesis'      // منبع دانشگاهی و پایان‌نامه پژوهشی (Academic Thesis / Dissertation)
  | 'official_regulatory'; // منبع رسمی سازمانی و نظارتی (FDA, EFSA, WHO, IFDA)

export type ScientificConfidenceLevel =
  | 'verified'              // تأییدشده رسمی (Verified) - استاندارد ملی یا قانون مصوب رسمی
  | 'source_backed'         // دارای منبع معتبر (Source-backed) - کتب مرجع، روش‌های AOAC یا مقالات ISI با داده قطعی
  | 'partially_supported'   // پشتیبانی جزئی (Partially supported) - تخمین‌های تجربی یا نیازمند آزمون تکمیلی
  | 'unverified';           // فاقد منبع معتبر (Unverified) - هشدار عدم قطعیت علمی

export interface SourceTypeMeta {
  id: ScientificSourceType;
  titleFa: string;
  titleEn: string;
  iconName: string;
  badgeColor: string;
  description: string;
  defaultJurisdiction: 'national' | 'international' | 'academic' | 'regulatory';
}

export const SCIENTIFIC_SOURCE_TYPES: Record<ScientificSourceType, SourceTypeMeta> = {
  inso_standard: {
    id: 'inso_standard',
    titleFa: 'استاندارد ملی ایران (INSO)',
    titleEn: 'National Iranian Standard',
    iconName: 'ShieldCheck',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    description: 'استانداردهای اجباری و تشویقی مصوب سازمان ملی استاندارد ایران (ISIRI/INSO)',
    defaultJurisdiction: 'national'
  },
  iso_standard: {
    id: 'iso_standard',
    titleFa: 'استاندارد بین‌المللی (ISO)',
    titleEn: 'International Organization for Standardization',
    iconName: 'Globe',
    badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    description: 'استانداردهای بین‌المللی مدیریت ایمنی غذا (ISO 22000) و روش‌های آزمون میکروبی و شیمیایی',
    defaultJurisdiction: 'international'
  },
  aoac_method: {
    id: 'aoac_method',
    titleFa: 'روش رسمی آزمون (AOAC)',
    titleEn: 'AOAC Official Methods of Analysis',
    iconName: 'FlaskConical',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    description: 'روش‌های معتبر و بین‌المللی ارزیابی شیمیایی و فیزیکی مواد غذایی (AOAC International)',
    defaultJurisdiction: 'international'
  },
  codex_standard: {
    id: 'codex_standard',
    titleFa: 'استاندارد کدکس غذایی (Codex)',
    titleEn: 'Codex Alimentarius (FAO/WHO)',
    iconName: 'Scale',
    badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    description: 'استانداردهای تجارت جهانی غذا و حدود افزودنی‌ها و آلاینده‌های کمیسیون مشترک فائو و سازمان جهانی بهداشت',
    defaultJurisdiction: 'international'
  },
  scientific_paper: {
    id: 'scientific_paper',
    titleFa: 'مقاله علمی پژوهشی (ISI / Journal)',
    titleEn: 'Peer-reviewed Journal Article',
    iconName: 'FileText',
    badgeColor: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    description: 'مقاله‌های داوری‌شده در نشریات معتبر بین‌المللی (Food Chemistry, JFE, LWT و غیره) با شناسه DOI',
    defaultJurisdiction: 'academic'
  },
  reference_book: {
    id: 'reference_book',
    titleFa: 'کتاب مرجع دانشگاهی (Textbook)',
    titleEn: 'Academic Reference Textbook',
    iconName: 'BookOpen',
    badgeColor: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800',
    description: 'کتاب‌های پایه مهندسی و شیمی مواد غذایی دارای شابک رسمی (Fennema, Heldman, Toledo, Jay)',
    defaultJurisdiction: 'academic'
  },
  lecture_handout: {
    id: 'lecture_handout',
    titleFa: 'جزوه آموزشی و پمفلت (Handout)',
    titleEn: 'Course Lecture Handout / Notes',
    iconName: 'FileSpreadsheet',
    badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    description: 'جزوات درسی، پمفلت‌های آموزشی تخصصی دانشگاهی و خلاصه‌های معتبر علمی',
    defaultJurisdiction: 'academic'
  },
  lab_file: {
    id: 'lab_file',
    titleFa: 'فایل و گزارش آزمایشگاهی (Lab File)',
    titleEn: 'Laboratory File / Report / Log',
    iconName: 'FlaskRound',
    badgeColor: 'bg-lime-100 dark:bg-lime-950 text-lime-800 dark:text-lime-300 border-lime-300 dark:border-lime-800',
    description: 'گزارش‌های مستند نتایج آزمون، لاگ‌شیت‌های آزمایشگاهی، تاییدیه‌های کالیبراسیون و فایل‌های داده',
    defaultJurisdiction: 'regulatory'
  },
  lab_manual: {
    id: 'lab_manual',
    titleFa: 'راهنمای آزمایشگاهی و روش اجرایی (SOP)',
    titleEn: 'Laboratory Manual / SOP',
    iconName: 'ClipboardList',
    badgeColor: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
    description: 'دستورالعمل‌های مدون کنترل کیفیت آزمایشگاه، کتابچه FDA-BAM و روش‌های استاندارد کاربری تجهیزات',
    defaultJurisdiction: 'regulatory'
  },
  sds: {
    id: 'sds',
    titleFa: 'برگه اطلاعات ایمنی مواد شیمیایی (SDS)',
    titleEn: 'Safety Data Sheet (SDS/MSDS)',
    iconName: 'AlertTriangle',
    badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    description: 'برگه‌های ایمنی و سمیّت مواد شیمیایی، معرف‌های آزمایشگاهی، شوینده‌ها و ضدعفونی‌کننده‌ها (GHS)',
    defaultJurisdiction: 'regulatory'
  },
  academic_thesis: {
    id: 'academic_thesis',
    titleFa: 'منبع دانشگاهی و پایان‌نامه (Thesis)',
    titleEn: 'Academic Thesis / Dissertation',
    iconName: 'GraduationCap',
    badgeColor: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700',
    description: 'پایان‌نامه‌ها و طرح‌های پژوهشی تصویب‌شده در دانشکده‌های معتبر صنایع غذایی و کشاورزی',
    defaultJurisdiction: 'academic'
  },
  official_regulatory: {
    id: 'official_regulatory',
    titleFa: 'منبع رسمی سازمانی و نظارتی (Regulatory)',
    titleEn: 'Official Regulatory Document (IFDA/FDA/EFSA)',
    iconName: 'Building2',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700',
    description: 'آیین‌نامه‌ها، دستورالعمل‌های فنی و بخشنامه‌های سازمان غذا و دارو (IFDA)، سازمان غذا و داروی آمریکا (FDA) و EFSA',
    defaultJurisdiction: 'regulatory'
  }
};

export const CONFIDENCE_LEVEL_META: Record<ScientificConfidenceLevel, {
  labelFa: string;
  labelEn: string;
  badgeClass: string;
  dotColor: string;
  description: string;
}> = {
  verified: {
    labelFa: 'تأییدشده رسمی (Verified)',
    labelEn: 'Verified',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
    description: 'مستند به استانداردهای ملی مصوب (INSO) یا اسناد قانونی نظارتی با قطعیت کامل'
  },
  source_backed: {
    labelFa: 'دارای منبع معتبر (Source-backed)',
    labelEn: 'Source-backed',
    badgeClass: 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    dotColor: 'bg-blue-500',
    description: 'مستند به کتب مرجع دانشگاهی، روش‌های رسمی AOAC یا مقالات داوری‌شده با داده‌های تجربی معتبر'
  },
  partially_supported: {
    labelFa: 'پشتیبانی جزئی (Partially supported)',
    labelEn: 'Partially supported',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    dotColor: 'bg-amber-500',
    description: 'نیازمند تطبیق آزمایشگاهی یا آزمون تکمیلی؛ مقادیر نیازمند راستی‌آزمایی با استاندارد قطعی محصول'
  },
  unverified: {
    labelFa: 'فاقد منبع / تاییدنشده (Unverified)',
    labelEn: 'Unverified',
    badgeClass: 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    dotColor: 'bg-rose-500',
    description: 'فاقد منبع علمی مدون؛ این ادعا نباید به عنوان واقعیت علمی قطعی تلقی شود'
  }
};

/**
 * Unified Scientific Source Entity
 */
export interface UnifiedScientificSource {
  id: string;
  title: string;                          // عنوان اصلی منبع (فارسی)
  englishTitle?: string;                  // عنوان لاتین منبع
  sourceType: ScientificSourceType;       // نوع منبع (مقاله، کتاب، استاندارد، جزوه، فایل آزمایشگاهی و...)
  authorOrOrganization: string;           // نویسنده اصلی، تدوین‌کننده یا سازمان صادرکننده
  organization?: string;                  // سازمان مرتبط (INSO, FDA, University, etc.)
  authors?: string[];                     // فهرست تکمیلی نویسندگان
  year: string;                           // سال انتشار یا تصویب (مثلاً 1401 یا 2023)
  editionOrVersion?: string;              // نسخه، ویرایش یا نوبت تجدیدنظر (مثلاً تجدیدنظر چهارم)
  standardNumber?: string;                // شماره استاندارد در صورت وجود (INSO 2406, ISO 22000, AOAC 942.15)
  doi?: string;                           // شناسه دیجیتال اشیاء در صورت وجود (DOI)
  isbn?: string;                          // شابک کتاب در صورت وجود (ISBN)
  publisher?: string;                     // ناشر یا منبع انتشار
  country: string;                        // کشور مبدا یا مرجع تصویب (ایران، بین‌المللی، آمریکا و...)
  url?: string;                           // پیوند دسترسی اینترنتی
  pdfFileName?: string;                   // نام فایل PDF در صورت وجود
  pdfUrl?: string;                        // پیوند یا مسیر دسترسی به سند PDF
  hasPdf: boolean;                        // آیا سند PDF ضمیمه یا موجود است؟
  pdfDocumentId?: string;                 // شناسه سند PDF در مخزن اسناد PDF
  pdfPageCount?: number;                  // تعداد کل صفحات PDF
  hasOcrExtracted?: boolean;              // آیا متن این سند از اسکن و با OCR استخراج شده است؟
  isOcrVerified?: boolean;                // آیا متن OCR توسط کارشناس صحه‌گذاری شده است؟
  accessDate?: string;                    // تاریخ استعلام یا اعتبارسنجی منبع
  confidenceLevel: ScientificConfidenceLevel; // وضعیت اعتبار علمی
  notes?: string;                         // توضیحات فنی و یادداشت‌های استناد
  discrepanciesNotes?: string;            // توضیحات اختلاف با سایر مراجع (در صورت تعارض)
  tags: string[];                         // برچسب‌های موضوعی
  linkedEntities?: {                      // رکوردهای متصل در سراسر پروژه
    testMethodsCount?: number;
    formulasCount?: number;
    limitsCount?: number;
    productsCount?: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * PDF Document Metadata
 */
export interface PdfDocumentMeta {
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  mimeType: string;
  pageCount: number;
  title?: string;
  author?: string;
  creator?: string;
  creationDate?: string;
  pdfVersion?: string;
  isScanned: boolean;                     // آیا فایل اسکن تصویری است؟
  scanDetectionReason?: string;
}

/**
 * Single PDF Page Content with OCR metadata
 */
export interface PdfPageContent {
  pageNumber: number;
  text: string;
  paragraphs: string[];
  extractionMethod: 'digital_text' | 'ocr_scanned' | 'manual_entry';
  isOcr: boolean;                         // آیا این صفحه از تصویر (OCR) استخراج شده؟
  ocrConfidence?: number;                 // درصد اطمینان نویسه‌خوان (0-100)
  isHumanVerified: boolean;               // آیا توسط کارشناس انسانی بازبینی و تایید شده؟
  humanVerifiedBy?: string;
  humanVerifiedAt?: string;
  sectionHeading?: string;                // سرفصل صفحه در صورت تشخیص
  linkedKnowledgeCount?: number;          // تعداد اتصال‌های این صفحه به Knowledge Base
}

/**
 * RAG Ready Document Chunk
 */
export interface RagDocumentChunk {
  id: string;
  sourceId: string;
  sourceTitle: string;
  standardNumber?: string;
  doi?: string;
  isbn?: string;
  pageNumber: number;
  chunkIndex: number;
  sectionHeading?: string;
  text: string;
  tokenCountEstimate: number;
  isOcr: boolean;
  isVerified: boolean;
  tags: string[];
  embeddingReady: boolean;
}

/**
 * Stored PDF Document in IndexedDB / App storage
 */
export interface StoredPdfDocument {
  id: string;
  sourceId: string;
  fileName: string;
  fileSize: number;
  fileDataUrl?: string;                   // Data URL for in-browser PDF rendering / download
  meta: PdfDocumentMeta;
  pages: PdfPageContent[];
  ragChunks: RagDocumentChunk[];
  uploadedAt: string;
  updatedAt: string;
}

/**
 * PDF Search Match inside extracted text
 */
export interface PdfSearchMatch {
  sourceId: string;
  sourceTitle: string;
  standardNumber?: string;
  pageNumber: number;
  sectionHeading?: string;
  snippet: string;
  matchCount: number;
  isOcr: boolean;
  isVerified: boolean;
}

/**
 * Linking PDF Excerpt to Knowledge Base
 */
export interface LinkToKnowledgePayload {
  sourceId: string;
  sourceTitle: string;
  standardNumber?: string;
  doi?: string;
  isbn?: string;
  pageNumber: number;
  sectionHeading?: string;
  selectedQuote: string;
  knowledgeCategory: string;              // e.g. 'standards', 'experiments', 'test_methods', etc.
  title: string;
  summary: string;
  verificationStatus: 'official_regulatory' | 'verified_with_source' | 'unverified_pending_review';
  isOcr: boolean;
  tags: string[];
}

/**
 * Scientific Discrepancy Record (برای نمایش صریح تفاوت میان استانداردها)
 */
export interface ScientificDiscrepancy {
  id: string;
  topicFa: string;
  topicEn: string;
  parameterName: string;
  unit: string;
  category: string;
  primarySource: {
    sourceId: string;
    sourceTitle: string;
    standardNumber: string;
    limitValue: string;
    conditions: string;
  };
  conflictingSource: {
    sourceId: string;
    sourceTitle: string;
    standardNumber: string;
    limitValue: string;
    conditions: string;
  };
  scientificExplanationFa: string;
  actionRecommendationFa: string;
}

/**
 * Cross-module Source Citation Reference
 */
export interface MasterSourceCitation {
  sourceId: string;
  citationCode?: string;
  titleFa: string;
  standardNumber?: string;
  confidenceLevel: ScientificConfidenceLevel;
  sectionOrTable?: string;
  page?: string;
  directQuote?: string;
}
