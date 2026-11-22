/**
 * Food Science AI - Specialized Master RAG Engine
 * Part 23 of 30 - End-to-End Specialized Retrieval-Augmented Generation Pipeline
 * 
 * Pipeline Flow:
 * Question -> Intent Detection -> Multi-Modal Search -> Source Retrieval -> 
 * Relevant Chunks Ranking -> Evidence Validation -> AI Grounding -> Answer + Sources
 */

import {
  RagConfig,
  RagPipelineResult,
  RagCitedSourceItem,
  RagPipelineTrace
} from './types';
import { getRagConfig } from './ragSettingsStorage';
import { detectRagIntent } from './intentDetector';
import { searchAndRankRagChunks } from './searchEngine';
import { validateRagEvidence } from './evidenceValidator';
import { getUnifiedSourceById } from '../storage/scientificSourcesStorage';

export async function runRagPipeline(
  userQuery: string,
  customConfig?: Partial<RagConfig>
): Promise<RagPipelineResult> {
  const startTime = Date.now();
  const baseConfig = getRagConfig();
  const config: RagConfig = {
    ...baseConfig,
    ...customConfig,
    filters: {
      ...baseConfig.filters,
      ...(customConfig?.filters || {})
    },
    priorityWeights: {
      ...baseConfig.priorityWeights,
      ...(customConfig?.priorityWeights || {})
    }
  };

  // Step 1: Query normalization
  const trimmedQuery = userQuery.trim();

  // Step 2: Intent Detection
  const intent = detectRagIntent(trimmedQuery);

  // Step 3 & 4 & 5: Multi-Store Retrieval & Ranking
  const rankedChunks = await searchAndRankRagChunks(trimmedQuery, intent, config);

  // Step 6: Evidence Validation & Integrity Check
  const evidenceValidation = validateRagEvidence(trimmedQuery, intent, rankedChunks, config);

  // Compile Cited Sources Map (Unique)
  const citedSourcesMap = new Map<string, RagCitedSourceItem>();

  for (const chunk of rankedChunks) {
    if (!citedSourcesMap.has(chunk.sourceId)) {
      citedSourcesMap.set(chunk.sourceId, {
        id: chunk.sourceId,
        title: chunk.sourceTitle,
        standardNumber: chunk.standardNumber,
        sourceType: chunk.sourceType,
        confidenceLevel: chunk.sourceConfidence,
        pageNumber: chunk.pageNumber,
        snippet: chunk.text.slice(0, 180).replace(/\n/g, ' ') + '...',
        isOcr: chunk.isOcr,
        isOcrVerified: chunk.isVerified
      });
    }
  }

  // Enrich with stored source metadata if possible
  for (const [id, item] of citedSourcesMap.entries()) {
    try {
      const dbSrc = await getUnifiedSourceById(id);
      if (dbSrc) {
        item.year = dbSrc.year;
        item.authorOrOrganization = dbSrc.authorOrOrganization;
        item.hasPdf = dbSrc.hasPdf;
        item.pdfDocumentId = dbSrc.pdfDocumentId;
      }
    } catch {
      // ignore
    }
  }

  const citedSources = Array.from(citedSourcesMap.values());

  // Step 7: Build AI Grounding Context & Prompt Augmentation
  let groundingPromptAugmentation = '';
  let augmentedSystemInstruction = '';

  const chunksContextText = rankedChunks
    .map(
      (c, idx) =>
        `[مستند ${idx + 1}] منبع: «${c.sourceTitle}»${c.standardNumber ? ` | شماره استاندارد: ${c.standardNumber}` : ''}${c.pageNumber ? ` | صفحه: ${c.pageNumber}` : ''}${c.isOcr ? ' (استخراج از تصویر OCR)' : ''}\nمحتوای مستند:\n${c.text.slice(0, 1200)}`
    )
    .join('\n\n---\n\n');

  if (evidenceValidation.strategy === 'grounded_verified') {
    augmentedSystemInstruction = `[دستورالعمل حیاتی RAG - شواهد معتبر (Verified Grounded)]:
شواهد رسمی و استاندارد ملی برای این استعلام با موفقیت در پایگاه دانش محلی بازیابی گردید.
۱. پاسخ خود را اکیداً بر اساس شواهد مستند ذیل تنظیم نمایید.
۲. شماره استاندارد دقیق (${rankedChunks[0]?.standardNumber || 'استاندارد مصوب'})، نام مأخذ و مشخصات فنی را به وضوح در متن اعلام کنید.
۳. در پایان پاسخ، فهرست مراجع مورد استفاده را مشخص نمایید.`;

    groundingPromptAugmentation = `\n\n### شواهد رسمی و مستندات بازیابی‌شده از پایگاه دانش و PDF:\n${chunksContextText}\n\nلطفاً پاسخ تخصصی را مستند به این شواهد با ذکر شماره استاندارد و حدود مجاز قانونی تدوین فرمایید.`;
  } else if (evidenceValidation.strategy === 'cautious_partial') {
    augmentedSystemInstruction = `[دستورالعمل حیاتی RAG - شواهد جزئی (Partial Evidence)]:
شواهد موجود در پایگاه دانش بخشی از مفاهیم را پوشش می‌دهند اما استاندارد رسمی قطعی یا کلیه پارامترها موجود نیست.
۱. صراحتاً در متن اعلام کنید که شواهد موجود جزئی است و فاکتورهای: (${evidenceValidation.missingFactors.join('، ')}) در دسترس نیست.
۲. اطلاعات عمومی را توضیح دهید، اما از کاربر بخواهید اطلاعات تکمیلی (نوع محصول، شرایط آزمون، یا استاندارد مد نظر) را ارائه دهد.
۳. هرگز ادعایی را به عنوان حد مجاز قطعی بدون ذکر منبع ارائه نکنید.`;

    groundingPromptAugmentation = `\n\n### شواهد جزئی بازیابی‌شده از پایگاه:\n${chunksContextText}\n\n⚠️ توجه: شواهد فوق کامل نیست. ضمن پاسخگویی به بخش‌های پشتیبانی‌شده، کمبود فاکتورها را تصریح کرده و اطلاعات تکمیلی از کاربر درخواست نمایید.`;
  } else {
    // unverified_warning
    augmentedSystemInstruction = `[دستورالعمل حیاتی RAG - کمبود منبع قطعی (Insufficient Evidence / Unverified)]:
برای این پرسش، هیچ استاندارد ملی یا مرجع معتبری در پایگاه دانش یافت نشد.
۱. حتماً در ابتدای پاسخ خود این هشدار را صریحاً درج کنید:
> ⚠️ **اعلام کمبود منبع رسمی:** برای این پرسش، استاندارد اختصاصی یا مرجع قطعی در پایگاه دانش موجود نیست.
۲. پاسخ را بر اساس مبانی عمومی علوم صنایع غذایی به صورت شفاف با برچسب **[UNVERIFIED - بدون استناد قطعی]** بیان کنید.
۳. از کاربر تقاضا کنید در صورت در اختیار داشتن فایل استاندارد یا اطلاعات دقیق‌تر محصول، آن را در بخش منابع یا آزمایشگاه ثبت نماید.`;

    groundingPromptAugmentation = `\n\n⚠️ هشدار RAG: شواهد مستند برای این سوال در پایگاه دانش یافت نشد.\nپاسخ باید با اعلام کمبود منبع قطعی، درخواست اطلاعات بیشتر، و برچسب [UNVERIFIED] تدوین گردد.`;
  }

  const executionTimeMs = Date.now() - startTime;

  const trace: RagPipelineTrace = {
    step1_question: trimmedQuery,
    step2_intent: intent,
    step3_searchMode: config.searchMode,
    step4_retrievedSourcesCount: citedSources.length,
    step5_rankedChunks: rankedChunks.map((c) => ({
      id: c.id,
      title: c.sourceTitle,
      standardNumber: c.standardNumber,
      pageNumber: c.pageNumber,
      score: c.finalRankScore,
      type: c.sourceType
    })),
    step6_evidenceValidation: evidenceValidation,
    step7_groundingStrategy: evidenceValidation.strategy,
    executionTimeMs
  };

  return {
    query: trimmedQuery,
    intent,
    rankedChunks,
    citedSources,
    evidenceValidation,
    groundingPromptAugmentation,
    augmentedSystemInstruction,
    trace
  };
}
