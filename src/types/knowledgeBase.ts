/**
 * Food Science AI - Knowledge Base Types & Schema Definitions
 * 
 * Strict Domain Model for Food Science & Engineering Knowledge Base:
 * 10 Core Categories, Scientific Source Linking, Verification Badges, Offline Support,
 * and Import/Export Schemas.
 */

export type KnowledgeCategory =
  | 'experiments'           // آزمایش‌ها و تست‌های آزمایشگاهی
  | 'standards'             // استانداردهای ملی و بین‌المللی (INSO, Codex, ISO, FDA)
  | 'food_products'         // فرآورده‌ها و گروه‌های محصولات غذایی
  | 'raw_materials'         // مواد اولیه، افزودنی‌ها و هیدروکلوئیدها
  | 'equipment'             // تجهیزات و دستگاه‌های فرآوری و آزمایشگاهی
  | 'test_methods'          // روش‌های آزمون و پروتکل‌های SOP
  | 'formulas'              // فرمول‌ها، روابط سینتیکی و محاسبات مهندسی
  | 'common_errors'         // خطاهای رایج و راهنماهای عیب‌یابی (Troubleshooting)
  | 'scientific_definitions' // تعاریف، اصطلاحات علمی و واژه‌نامه تخصصی
  | 'references';           // منابع، کتب مرجع و مقالات علمی

export interface KnowledgeCategoryMeta {
  id: KnowledgeCategory;
  titleFa: string;
  titleEn: string;
  description: string;
  iconName: string;
  accentColor: 'emerald' | 'blue' | 'amber' | 'violet' | 'rose' | 'teal' | 'indigo' | 'cyan' | 'orange' | 'stone';
}

export const KNOWLEDGE_CATEGORIES_META: Record<KnowledgeCategory, KnowledgeCategoryMeta> = {
  experiments: {
    id: 'experiments',
    titleFa: 'آزمایش‌ها و آزمون‌ها',
    titleEn: 'Experiments & Lab Tests',
    description: 'پروتکل‌های آزمایشگاهی، طراحی آزمایشات فرآوری (DoE) و ارزیابی‌های تجربی',
    iconName: 'FlaskConical',
    accentColor: 'emerald'
  },
  standards: {
    id: 'standards',
    titleFa: 'استانداردها',
    titleEn: 'Standards (INSO / Codex / ISO)',
    description: 'استانداردهای ملی ایران، کدکس بین‌المللی، حدود مجاز و الزامات قانونی',
    iconName: 'ShieldCheck',
    accentColor: 'amber'
  },
  food_products: {
    id: 'food_products',
    titleFa: 'محصولات غذایی',
    titleEn: 'Food Products',
    description: 'مشخصات گروه‌های فرآورده‌های غذایی، شرایط نگهداری و ویژگی‌های کیفی',
    iconName: 'Boxes',
    accentColor: 'teal'
  },
  raw_materials: {
    id: 'raw_materials',
    titleFa: 'مواد اولیه و افزودنی‌ها',
    titleEn: 'Raw Materials & Ingredients',
    description: 'ویژگی‌های عملکردی هیدروکلوئیدها، امولسیفایرها، پایدارکننده‌ها و ترکیبات پایه',
    iconName: 'Layers',
    accentColor: 'violet'
  },
  equipment: {
    id: 'equipment',
    titleFa: 'تجهیزات و دستگاه‌ها',
    titleEn: 'Equipment & Metrology',
    description: 'دستگاه‌های آزمایشگاهی و خطوط فرآوری، مشخصات فنی و کالیبراسیون',
    iconName: 'Wrench',
    accentColor: 'cyan'
  },
  test_methods: {
    id: 'test_methods',
    titleFa: 'روش‌های آزمون',
    titleEn: 'Test Methods (SOP / AOAC)',
    description: 'دستورالعمل‌های آزمون شیمیایی، میکروبیولوژی و دستگاهی معتبر',
    iconName: 'CheckSquare',
    accentColor: 'indigo'
  },
  formulas: {
    id: 'formulas',
    titleFa: 'فرمول‌ها و معادلات',
    titleEn: 'Formulas & Equations',
    description: 'روابط ریاضی، سینتیک غیرفعال‌سازی حرارتی، رئولوژی و موازنه‌های جرمی/انرژی',
    iconName: 'Calculator',
    accentColor: 'blue'
  },
  common_errors: {
    id: 'common_errors',
    titleFa: 'خطاهای رایج و عیب‌یابی',
    titleEn: 'Common Errors & Troubleshooting',
    description: 'عیب‌یابی خطوط تولید، نقایص بافتی/حسی و خطاهای رایج در آزمون‌های آزمایشگاهی',
    iconName: 'AlertTriangle',
    accentColor: 'rose'
  },
  scientific_definitions: {
    id: 'scientific_definitions',
    titleFa: 'تعاریف و واژه‌نامه علمی',
    titleEn: 'Scientific Definitions & Glossary',
    description: 'تعاریف دقیق اصطلاحات مهندسی، بیوشیمی و فناوری مواد غذایی',
    iconName: 'BookMarked',
    accentColor: 'orange'
  },
  references: {
    id: 'references',
    titleFa: 'منابع و مراجع علمی',
    titleEn: 'References & Literature',
    description: 'کتاب‌های مرجع دانشگاهی، مقالات ISI و پایگاه‌های علمی معتبر',
    iconName: 'BookOpen',
    accentColor: 'stone'
  }
};

/**
 * Publication types for scientific sources
 */
export type SourcePublicationType =
  | 'official_standard_body'    // سازمان‌های ملی و بین‌المللی استاندارد (INSO, ISO, Codex, FDA)
  | 'peer_reviewed_journal'      // ژورنال‌های علمی داوری‌شده معتبر (Elsevier, Wiley, Springer, etc.)
  | 'academic_textbook'          // کتب مرجع دانشگاهی (Fennema, Heldman, Toledo, etc.)
  | 'official_regulation'        // آیین‌نامه‌ها و قوانین رسمی مراجع نظارتی غذا و دارو
  | 'technical_handbook'         // هندبوک‌های فنی مهندسی و صنعتی
  | 'conference_proceedings';    // مقالات همایش‌های معتبر علمی

/**
 * Reliability grade of a scientific source
 */
export type SourceReliabilityGrade =
  | 'A_official_standard'        // درجه A: استاندارد مصوب رسمی یا قانون نظارتی
  | 'B_peer_reviewed_journal'    // درجه B: مقاله ژورنال علمی پژوهشی معتبر با DOI
  | 'C_academic_textbook'        // درجه C: کتاب مرجع دانشگاهی معتبر با ISBN
  | 'D_technical_bulletin';      // درجه D: بولتن فنی معتبر صنعتی

export interface ScientificSource {
  id: string;
  title: string;
  englishTitle?: string;
  authors: string[];
  publicationType: SourcePublicationType;
  organizationOrPublisher: string;
  yearOrEdition: string;
  codeOrIdentifier?: string; // e.g. INSO 1629, DOI: 10.1016/..., ISBN: 978-0...
  urlOrAccessLink?: string;
  reliabilityGrade: SourceReliabilityGrade;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Relational citation linking a knowledge record to a specific scientific source
 */
export interface SourceCitation {
  sourceId: string;
  sourceTitle?: string;
  citationShort?: string;
  fullTitle?: string;
  verificationGrade?: string;
  verificationStatus?: string;
  year?: string;
  publisherOrJournal?: string;
  codeOrIdentifier?: string;
  sectionOrChapter?: string;
  pageNumber?: string;
  tableOrFigure?: string;
  directQuoteOrExcerpt?: string;
  verifiedByExpert?: boolean;
}

/**
 * Verification status of scientific information
 */
export type VerificationStatus =
  | 'official_regulatory'        // استاندارد یا قانون رسمی مصوب
  | 'verified_with_source'       // تأییدشده با ارجاع دقیق به منبع علمی معتبر
  | 'unverified_pending_review'; // فاقد منبع یا در انتظار بررسی (هشدار عدم استناد قطعی)

/**
 * Key-Value Parameter for structured scientific measurements
 */
export interface ScientificParameter {
  key: string;
  label: string;
  englishLabel?: string;
  value: string | number;
  unit?: string;
  tolerance?: string; // e.g. ±0.05
  testMethodRef?: string; // e.g. AOAC 942.15
  notes?: string;
}

/**
 * Core Knowledge Base Record
 */
export interface KnowledgeBaseRecord {
  id: string;
  category: KnowledgeCategory;
  subCategory?: string;
  title: string;
  englishTitle?: string;
  codeOrIdentifier?: string; // Unique code (e.g. INSO-XXX, SOP-LAB-01, FORM-EQ-04)
  summary: string;
  content: string; // Rich Markdown text with formula ($...$) and table support
  tags: string[];
  applicableFoodCategories?: string[]; // e.g. Dairy, Meat, Cereals, Bakery, Beverages, Oils, Confectionery
  verificationStatus: VerificationStatus;
  sources: SourceCitation[]; // MUST contain at least 1 valid citation for verified status
  parameters?: ScientificParameter[];
  relatedRecordIds?: string[];
  offlineAvailable: boolean;
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
    authorOrImportSource?: string;
    schemaVersion: string;
    checksum?: string;
  };
}

/**
 * Search & Filter Criteria for Knowledge Base
 */
export interface KnowledgeSearchFilters {
  query?: string;
  category?: KnowledgeCategory | 'all';
  verificationStatus?: VerificationStatus | 'all';
  foodCategory?: string;
  tag?: string;
  sourceId?: string;
  offlineOnly?: boolean;
  sortBy?: 'updatedAt' | 'title' | 'code' | 'verification';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Schema Validation Result
 */
export interface KnowledgeValidationResult {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
  warnings: Array<{ field: string; message: string }>;
}

/**
 * Data Import/Export Bundle
 */
export interface KnowledgeBaseBundle {
  bundleVersion: '1.0';
  exportedAt: string;
  application: 'Food Science AI';
  schemaVersion: '2.0.0';
  description: string;
  sources: ScientificSource[];
  records: KnowledgeBaseRecord[];
}
