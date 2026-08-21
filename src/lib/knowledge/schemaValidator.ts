/**
 * Food Science AI - Knowledge Base Schema Validator & Template Generator
 * 
 * Validates data integrity, enforces source association, and provides standard
 * JSON schema definitions for importing datasets into the 10 Knowledge Base categories.
 */

import {
  KnowledgeBaseBundle,
  KnowledgeBaseRecord,
  ScientificSource,
  KnowledgeCategory,
  KNOWLEDGE_CATEGORIES_META
} from '../../types/knowledgeBase';

export interface ValidationReport {
  valid: boolean;
  totalRecords: number;
  totalSources: number;
  errors: string[];
  warnings: string[];
  categoryBreakdown: Record<string, number>;
}

export function validateKnowledgeBundle(bundle: unknown): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const categoryBreakdown: Record<string, number> = {};

  if (!bundle || typeof bundle !== 'object') {
    return {
      valid: false,
      totalRecords: 0,
      totalSources: 0,
      errors: ['فایل ورودی یک آبجکت معتبر JSON نیست.'],
      warnings: [],
      categoryBreakdown: {}
    };
  }

  const b = bundle as Partial<KnowledgeBaseBundle>;

  const sources = Array.isArray(b.sources) ? b.sources : [];
  const records = Array.isArray(b.records) ? b.records : [];

  const sourceIds = new Set<string>();

  // 1. Validate Sources
  sources.forEach((src, idx) => {
    if (!src.id || typeof src.id !== 'string') {
      errors.push(`منبع ردیف ${idx + 1}: شناسه یکتا (id) الزامی است.`);
    } else {
      sourceIds.add(src.id);
    }

    if (!src.title || typeof src.title !== 'string') {
      errors.push(`منبع ردیف ${idx + 1} (${src.id || 'بدون ID'}): عنوان منبع (title) الزامی است.`);
    }

    if (!src.organizationOrPublisher || typeof src.organizationOrPublisher !== 'string') {
      errors.push(`منبع ردیف ${idx + 1} (${src.id || 'بدون ID'}): ناشر یا سازمان ناظر الزامی است.`);
    }
  });

  // 2. Validate Records
  records.forEach((rec, idx) => {
    const recId = rec.id || `ردیف ${idx + 1}`;

    if (!rec.title || typeof rec.title !== 'string') {
      errors.push(`رکورد ${recId}: عنوان رکورد الزامی است.`);
    }

    if (!rec.category || !(rec.category in KNOWLEDGE_CATEGORIES_META)) {
      errors.push(`رکورد ${recId}: دسته‌بندی «${rec.category}» نامعتبر است.`);
    } else {
      categoryBreakdown[rec.category] = (categoryBreakdown[rec.category] || 0) + 1;
    }

    if (!rec.summary || typeof rec.summary !== 'string') {
      errors.push(`رکورد ${recId}: خلاصه رکورد الزامی است.`);
    }

    // Source Citation Validation
    const citations = Array.isArray(rec.sources) ? rec.sources : [];
    if (citations.length === 0) {
      if (rec.verificationStatus === 'verified_with_source' || rec.verificationStatus === 'official_regulatory') {
        errors.push(
          `رکورد ${recId} به عنوان «تأییدشده» ثبت شده ولی هیچ منبع علمی معتبری به آن متصل نشده است.`
        );
      } else {
        warnings.push(`رکورد ${recId} بدون منبع است و به عنوان «در انتظار بررسی» ذخیره می‌شود.`);
      }
    } else {
      citations.forEach((c) => {
        if (!sourceIds.has(c.sourceId)) {
          warnings.push(
            `رکورد ${recId}: منبع با شناسه «${c.sourceId}» در لیست منابع این بسته موجود نیست (شاید در پایگاه محلی ذخیره شده باشد).`
          );
        }
      });
    }
  });

  return {
    valid: errors.length === 0,
    totalRecords: records.length,
    totalSources: sources.length,
    errors,
    warnings,
    categoryBreakdown
  };
}

/**
 * Generates an empty Schema Template Bundle that can be filled by users
 * without including any fake standard numbers or fabricated data.
 */
export function generateEmptyKnowledgeTemplate(): string {
  const template: KnowledgeBaseBundle = {
    bundleVersion: '1.0',
    exportedAt: new Date().toISOString(),
    application: 'Food Science AI',
    schemaVersion: '2.0.0',
    description: 'قالب خام ورود اطلاعات استانداردها و دانش تخصصی صنایع غذایی',
    sources: [
      {
        id: 'src_sample_template_id',
        title: 'عنوان منبع مرجع (مثال: استاندارد ملی ایران / نشریه علمی / کتاب مرجع)',
        englishTitle: 'Reference Title in English',
        authors: ['نام نویسندگان یا سازمان تدوین‌کننده'],
        publicationType: 'official_standard_body',
        organizationOrPublisher: 'سازمان ملی استاندارد ایران / Codex / ISO',
        yearOrEdition: 'سال انتشار یا ویرایش',
        codeOrIdentifier: 'شماره رسمی استاندارد یا DOI یا ISBN',
        urlOrAccessLink: 'https://...',
        reliabilityGrade: 'A_official_standard',
        description: 'توضیحات تکمیلی پیرامون دامنه کاربرد منبع',
        tags: ['استاندارد', 'مرجع'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    records: [
      {
        id: 'kbr_sample_template_id',
        category: 'standards',
        subCategory: 'میکروبیولوژی / شیمیایی / فرآوری',
        title: 'عنوان مستند علمی یا استاندارد',
        englishTitle: 'Document Title in English',
        codeOrIdentifier: 'کد یا شناسه مستند (مثلاً INSO-XXX)',
        summary: 'چکیده و خلاصه هدف از تدوین این رکورد علمی',
        content: `### شرح علمی و الزامات فنی\n\nاین بخش با فرمت Markdown نوشته شده و از فرمول‌های ریاضی و جداول استاندارد پشتیبانی می‌کند.\n\n$$\\Delta E = \\sqrt{\\Delta L^2 + \\Delta a^2 + \\Delta b^2}$$\n\n| پارامتر | واحد | حد مجاز |\n| :--- | :--- | :--- |\n| اسیدیته | درصد | طبق جدول استاندارد |`,
        tags: ['کنترل کیفیت', 'فرمولاسیون', 'آزمایشگاه'],
        applicableFoodCategories: ['لبنیات', 'نوشیدنی‌ها', 'آرد و نان'],
        verificationStatus: 'verified_with_source',
        sources: [
          {
            sourceId: 'src_sample_template_id',
            sourceTitle: 'عنوان منبع مرجع',
            codeOrIdentifier: 'شماره رسمی',
            sectionOrChapter: 'بند ۴-۲',
            pageNumber: 'صفحه ۱۲',
            tableOrFigure: 'جدول شماره ۱',
            directQuoteOrExcerpt: 'متن ارجاع مستقیم یا حدود تعیین‌شده در منبع'
          }
        ],
        parameters: [
          {
            key: 'acidity_max',
            label: 'حداکثر اسیدیته مجاز',
            englishLabel: 'Max Acidity',
            value: 'مطابق منبع',
            unit: '%',
            tolerance: '±0.02',
            testMethodRef: 'کد روش آزمون استاندارد',
            notes: 'یادداشت فنی و شرایط آزمون'
          }
        ],
        relatedRecordIds: [],
        offlineAvailable: true,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: '1.0.0',
          authorOrImportSource: 'قالب ورودی استاندارد',
          schemaVersion: '2.0.0'
        }
      }
    ]
  };

  return JSON.stringify(template, null, 2);
}
