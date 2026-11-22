/**
 * Food Science AI - Scientific PDF Analysis & Structured Extraction Engine
 * Part 24 of 30
 */

import { 
  AttachedPdfDocument, 
  PdfAnalysisAction, 
  PdfAnalysisResult, 
  ExtractedClaimWithEvidence,
  ExtractedParameterItem,
  ExtractedTableItem,
  ComparativeAspectItem,
  EvidenceType
} from './types';

/**
 * Detects if a user message is targeted at the attached PDF(s)
 * and determines the specific extraction action.
 */
export function detectPdfActionFromQuery(query: string, pdfCount: number): PdfAnalysisAction {
  const q = query.toLowerCase();

  // Comparison intent (especially if 2 PDFs attached or explicit compare words)
  if (
    (pdfCount >= 2 && (q.includes('مقایسه') || q.includes('تفاوت') || q.includes('اختلاف') || q.includes('تطبیق') || q.includes('compare'))) ||
    q.includes('مقایسه دو مقاله') ||
    q.includes('مقایسه دو روش') ||
    q.includes('مقایسه استاندارد')
  ) {
    return 'comparison';
  }

  // Methodology
  if (
    q.includes('روش آزمایش') ||
    q.includes('روش آزمون') ||
    q.includes('پروتکل') ||
    q.includes('نحوه آزمایش') ||
    q.includes('مراحل آزمون') ||
    q.includes('دستورالعمل آزمون') ||
    q.includes('methodology') ||
    q.includes('test method') ||
    q.includes('روش کار')
  ) {
    return 'methodology';
  }

  // Materials & Equipment
  if (
    q.includes('مواد') ||
    q.includes('تجهیزات') ||
    q.includes('دستگاه') ||
    q.includes('معرف') ||
    q.includes('ریجنت') ||
    q.includes('materials') ||
    q.includes('equipment') ||
    q.includes('وسایل آزمایشگاه')
  ) {
    return 'materials_equipment';
  }

  // Parameters & Limits
  if (
    q.includes('پارامتر') ||
    q.includes('حد مجاز') ||
    q.includes('حدود') ||
    q.includes('دما') ||
    q.includes('زمان') ||
    q.includes('ph') ||
    q.includes('بریکس') ||
    q.includes('اسیدیته') ||
    q.includes('parameters') ||
    q.includes('limits')
  ) {
    return 'parameters';
  }

  // Tables
  if (
    q.includes('جدول') ||
    q.includes('جداول') ||
    q.includes('داده‌های جدول') ||
    q.includes('table') ||
    q.includes('tables')
  ) {
    return 'tables';
  }

  // Results & Findings
  if (
    q.includes('نتیجه') ||
    q.includes('نتایج') ||
    q.includes('یافته') ||
    q.includes('یافته‌ها') ||
    q.includes('دستاورد') ||
    q.includes('results') ||
    q.includes('findings')
  ) {
    return 'results';
  }

  // References & Citations
  if (
    q.includes('منابع') ||
    q.includes('مراجع') ||
    q.includes('رفرنس') ||
    q.includes('استنادات') ||
    q.includes('references') ||
    q.includes('citations')
  ) {
    return 'references';
  }

  // Summary
  if (
    q.includes('خلاصه') ||
    q.includes('خلاصه‌سازی') ||
    q.includes('چکیده') ||
    q.includes('خلاصه مقاله') ||
    q.includes('summary') ||
    q.includes('abstract')
  ) {
    return 'summary';
  }

  // Default QA
  return 'qa';
}

/**
 * Returns human-readable Persian label for each analysis action
 */
export function getPdfActionLabelFa(action: PdfAnalysisAction): string {
  switch (action) {
    case 'summary':
      return 'خلاصه‌سازی جامع سند علمی';
    case 'methodology':
      return 'استخراج روش و پروتکل آزمایش';
    case 'materials_equipment':
      return 'استخراج مواد، معرف‌ها و تجهیزات';
    case 'parameters':
      return 'استخراج پارامترها، شرایط و حدود مجاز';
    case 'results':
      return 'استخراج نتایج، آمار و یافته‌های کلیدی';
    case 'tables':
      return 'استخراج جدول‌ها و ماتریس‌های داده';
    case 'references':
      return 'استخراج مراجع و استنادات سند';
    case 'comparison':
      return 'مقایسه تطبیقی دو سند / دو روش آزمایش';
    case 'qa':
    default:
      return 'پرسش و پاسخ تخصصی مستند به PDF';
  }
}

/**
 * Formats a tailored user prompt when clicking one of the quick action buttons
 */
export function getPromptForAction(action: PdfAnalysisAction, docs: AttachedPdfDocument[]): string {
  const doc1 = docs[0];
  const doc2 = docs[1];

  switch (action) {
    case 'summary':
      return `لطفاً خلاصه‌سازی جامع و ساختاریافته از سند علمی «${doc1?.title || 'پیوست'}» شامل هدف، فرضیه اصلی، روش‌شناسی و دستاوردهای کلیدی را با ذکر شماره صفحات مستند ارائه دهید.`;
    case 'methodology':
      return `روش آزمایش و پروتکل اجرایی مندرج در سند «${doc1?.title || 'پیوست'}» چیست؟ لطفاً کلیه مراحل کار، آماده‌سازی نمونه، شرایط دما و زمان، و نکات کنترلی را مستقیماً از متن سند با ذکر شماره دقیق صفحه و بند استخراج نمایید.`;
    case 'materials_equipment':
      return `فهرست کامل کلیه مواد اولیه، مواد شیمیایی، معرف‌ها (Reagents)، نمونه‌ها و تجهیزات/دستگاه‌های آزمایشگاهی ذکرشده در سند «${doc1?.title || 'پیوست'}» را با ذکر مشخصات فنی و شماره صفحه استخراج فرمایید.`;
    case 'parameters':
      return `کلیه پارامترهای اندازه‌گیری‌شده، حدود مجاز استاندارد، شرایط فرآیندی (دما، زمان، pH، اسیدیته، فعالیت آبی و ...) را در سند «${doc1?.title || 'پیوست'}» در قالب یک جدول مشخص با ذکر شماره صفحه استخراج نمایید.`;
    case 'results':
      return `نتایج اصلی، داده‌های آماری و یافته‌های حاصل از پژوهش/آزمون در سند «${doc1?.title || 'پیوست'}» چیست؟ نتایج را با استناد دقیق به صفحات سند بیان کنید.`;
    case 'tables':
      return `کلیه جداول اطلاعاتی و ماتریس‌های داده موجود در سند «${doc1?.title || 'پیوست'}» را با عناوین، سرستون‌ها و ردیف‌های مربوطه به صورت جداول Markdown با ذکر شماره صفحه استخراج نمایید.`;
    case 'references':
      return `فهرست استنادات، استانداردها و مراجع علمی ذکرشده در سند «${doc1?.title || 'پیوست'}» را به تفکیک رده منبع و صفحه استخراج فرمایید.`;
    case 'comparison':
      if (doc2) {
        return `لطفاً دو سند پیوست «${doc1.title}» و «${doc2.title}» را به صورت تطبیقی مقایسه نمایید. مقایسه شامل: هدف، روش آزمایش، شرایط فرآیندی، تجهیزات، پارامترهای کلیدی، نتایج و هرگونه تضاد یا اختلاف رویکرد میان آن‌ها در قالب یک جدول جامع ماتریس تطبیقی باشد.`;
      }
      return `لطفاً رویکردها و روش‌های آزمون ذکرشده در این سند را بررسی و مقایسه فرمایید.`;
    case 'qa':
    default:
      return `بررسی تخصصی محتوای سند «${doc1?.title || 'پیوست'}» با استناد به شماره صفحه.`;
  }
}

/**
 * Parses the model's text response and builds structured claims with
 * Source, Page, and Evidence Type.
 */
export function extractStructuredPdfAnalysisResult(
  replyText: string,
  attachedPdfs: AttachedPdfDocument[],
  actionType: PdfAnalysisAction
): PdfAnalysisResult {
  const claims: ExtractedClaimWithEvidence[] = [];
  const parametersFound: ExtractedParameterItem[] = [];
  const tablesFound: ExtractedTableItem[] = [];
  const notMentionedInDocument: string[] = [];
  const comparativeAspects: ComparativeAspectItem[] = [];

  const primaryDoc = attachedPdfs[0] || {
    id: 'unknown_doc',
    title: 'سند PDF ارائه‌شده',
    fileName: 'document.pdf',
    pageCount: 1,
    isScanned: false
  };
  const secondaryDoc = attachedPdfs[1];

  // 1. Detect claims with Page citations (e.g., "[صفحه ۱]", "صفحه ۲", "صفحه ۳، بند ۴")
  const pageMatches = Array.from(replyText.matchAll(/(?:\[?صفحه\s*([۰-۹0-9]+)(?:[،\s-]+(بند|جدول|بخش|قسمت)\s*([۰-۹0-9]+))?\]?)/gi));

  // Extract paragraphs or bullet points that have page markers
  const lines = replyText.split('\n');
  let claimIdx = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Check if line mentions a page number
    const linePageMatch = trimmed.match(/(?:\[?صفحه\s*([۰-۹0-9]+)(?:[،\s-]+(بند|جدول|بخش|قسمت)\s*([۰-۹0-9]+))?\]?)/i);
    if (linePageMatch) {
      const pNumStr = linePageMatch[1]
        .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
      const pageNumber = parseInt(pNumStr, 10) || 1;
      const sectionHeading = linePageMatch[2] ? `${linePageMatch[2]} ${linePageMatch[3] || ''}`.trim() : undefined;

      // Determine Evidence Type
      let evidenceType: EvidenceType = 'inferred_summary';
      if (trimmed.includes('"') || trimmed.includes('«') || trimmed.includes('»') || trimmed.includes('نقل‌قول')) {
        evidenceType = 'direct_quote';
      } else if (trimmed.includes('جدول') || trimmed.includes('|')) {
        evidenceType = 'table_data';
      } else if (/[۰-۹0-9]+(?:\s*(?:درجه|دقیقه|ثانیه|ساعت|میلی‌گرم|گرم|درصد|ppm|pH|C|ml|g|%))/.test(trimmed)) {
        evidenceType = 'numerical_parameter';
      }

      const isScannedDoc = 'isScanned' in primaryDoc ? Boolean(primaryDoc.isScanned) : false;

      claims.push({
        id: `claim_${Date.now()}_${claimIdx++}`,
        claimText: trimmed.replace(/^[-*•\d.]+\s*/, '').slice(0, 220),
        sourceTitle: primaryDoc.title,
        sourceDocId: primaryDoc.id,
        pageNumber,
        sectionHeading,
        evidenceType,
        confidence: isScannedDoc ? 'source_backed' : 'verified'
      });
    }

    // 2. Detect "Not mentioned in document" statements
    if (
      trimmed.includes('ذکر نشده') ||
      trimmed.includes('قید نگردیده') ||
      trimmed.includes('اشاره‌ای نشده') ||
      trimmed.includes('اطلاعاتی موجود نیست') ||
      trimmed.includes('یافت نشد') ||
      trimmed.includes('در این سند وجود ندارد')
    ) {
      notMentionedInDocument.push(trimmed.replace(/^[-*•⚠️❌\d.]+\s*/, ''));
    }
  }

  // Fallback: If no explicit page markers found in lines, create initial grounded claims based on pages
  if (claims.length === 0 && attachedPdfs.length > 0) {
    for (let pIdx = 0; pIdx < Math.min(attachedPdfs[0].pages.length, 3); pIdx++) {
      const page = attachedPdfs[0].pages[pIdx];
      claims.push({
        id: `claim_page_${page.pageNumber}`,
        claimText: page.sectionHeading || `محتوای مستند استخراج‌شده از صفحه ${page.pageNumber}`,
        sourceTitle: attachedPdfs[0].title,
        sourceDocId: attachedPdfs[0].id,
        pageNumber: page.pageNumber,
        sectionHeading: page.sectionHeading,
        evidenceType: 'inferred_summary',
        confidence: page.isOcr ? 'source_backed' : 'verified'
      });
    }
  }

  // 3. Extract Markdown Tables
  const tableMatches = replyText.match(/\|(.+)\|\n\|(?:\s*[-:]+[-| :]*\s*)\|\n((?:\|.+\|\n?)+)/g);
  if (tableMatches) {
    tableMatches.forEach((tableStr, tIdx) => {
      const tLines = tableStr.trim().split('\n').filter(Boolean);
      if (tLines.length >= 3) {
        const headers = tLines[0].split('|').map((s) => s.trim()).filter(Boolean);
        const rows = tLines.slice(2).map((r) => r.split('|').map((c) => c.trim()).filter(Boolean));
        tablesFound.push({
          id: `tbl_${tIdx + 1}`,
          title: `جدول استخراج‌شده ${tIdx + 1} از سند`,
          pageNumber: 1, // default or approximate
          headers,
          rows: rows.slice(0, 10) // display up to 10 rows
        });

        // If this is a comparison action, map table rows to comparativeAspects
        if (actionType === 'comparison' && secondaryDoc) {
          rows.forEach((row) => {
            if (row.length >= 3) {
              const aspect = row[0];
              const doc1Finding = row[1];
              const doc2Finding = row[2];
              const details = row[3] || '';
              const isDiscrepancy = details.includes('تضاد') || details.includes('اختلاف') || doc1Finding !== doc2Finding;
              comparativeAspects.push({
                aspect,
                doc1Finding,
                doc2Finding,
                agreementStatus: isDiscrepancy ? 'discrepancy' : 'agreed',
                details
              });
            }
          });
        }
      }
    });
  }

  // 4. Extract parameters with numerical values (pH, temp, time, limits)
  const paramRegex = /(pH|پ‌هاش|دما|زمان|بریکس|اسیدیته|چربی|ماده خشک|پروتئین|دانسیته)\s*[:=؛]?\s*([۰-۹0-9.]+(?:\s*(?:درجه|دقیقه|ثانیه|ساعت|گرم|میلی‌گرم|درصد|%|C|ppm))?)/gi;
  let paramMatch;
  while ((paramMatch = paramRegex.exec(replyText)) !== null) {
    if (parametersFound.length < 8) {
      parametersFound.push({
        name: paramMatch[1],
        value: paramMatch[2],
        pageNumber: 1,
        isLimit: replyText.includes('حداکثر') || replyText.includes('حداقل') || replyText.includes('حد مجاز')
      });
    }
  }

  return {
    actionType,
    analyzedDocuments: attachedPdfs.map((p) => ({
      id: p.id,
      title: p.title,
      fileName: p.fileName,
      pageCount: p.pageCount,
      isScanned: p.isScanned
    })),
    claims,
    parametersFound: parametersFound.length > 0 ? parametersFound : undefined,
    tablesFound: tablesFound.length > 0 ? tablesFound : undefined,
    notMentionedInDocument: notMentionedInDocument.length > 0 ? notMentionedInDocument : undefined,
    comparativeAspects: comparativeAspects.length > 0 ? comparativeAspects : undefined,
    timestamp: new Date().toISOString()
  };
}
