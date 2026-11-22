/**
 * Scientific Source & Verification Engine
 * Core component for Part 20 of 20
 * 
 * Enforces scientific rigor, confidence level attribution, source linkage,
 * and scientific discrepancy detection across the entire Food Science AI application.
 */

import { 
  UnifiedScientificSource, 
  ScientificConfidenceLevel,
  ScientificDiscrepancy 
} from '../types/scientificSource';
import { 
  MASTER_SCIENTIFIC_SOURCES, 
  SCIENTIFIC_DISCREPANCIES_DATABASE 
} from '../data/scientificSourcesRegistry';

export interface ScientificAnalysisResult {
  confidenceLevel: ScientificConfidenceLevel;
  confidenceLabelFa: string;
  confidenceDescriptionFa: string;
  citedSources: Array<{
    id: string;
    title: string;
    standardNumber?: string;
    sourceType: string;
    year?: string;
    authorOrOrganization?: string;
    hasPdf?: boolean;
    confidenceLevel: ScientificConfidenceLevel;
  }>;
  discrepancyAlerts: Array<{
    id: string;
    topicFa: string;
    primaryStandard: string;
    conflictingStandard: string;
    summaryFa: string;
    recommendationFa: string;
  }>;
  hasVerifiedSource: boolean;
  requiresClarification: boolean;
}

/**
 * Analyzes any scientific response text (from Gemini or knowledge base)
 * and resolves corresponding sources, confidence level, and conflicting discrepancies.
 */
export function analyzeScientificResponse(
  content: string,
  userQuery: string = ''
): ScientificAnalysisResult {
  const combined = (content + ' ' + userQuery).toLowerCase();

  // 1. Identify matched sources from MASTER_SCIENTIFIC_SOURCES
  const matchedSources: UnifiedScientificSource[] = [];

  for (const src of MASTER_SCIENTIFIC_SOURCES) {
    let isMatch = false;

    // Check standard number
    if (src.standardNumber) {
      const stdNumClean = src.standardNumber.toLowerCase().replace(/[\s\-_:]/g, '');
      const contentClean = combined.replace(/[\s\-_:]/g, '');
      if (contentClean.includes(stdNumClean)) {
        isMatch = true;
      }
    }

    // Check title keywords
    if (!isMatch && src.tags && src.tags.length > 0) {
      const matchedTags = src.tags.filter((t) => combined.includes(t.toLowerCase()));
      // If 2 or more specific tags match, consider it referenced
      if (matchedTags.length >= 2) {
        isMatch = true;
      }
    }

    // Check author/organization
    if (!isMatch && src.authors) {
      for (const author of src.authors) {
        if (combined.includes(author.toLowerCase())) {
          isMatch = true;
          break;
        }
      }
    }

    // Check title substring
    if (!isMatch && src.title && combined.includes(src.title.toLowerCase().slice(0, 20))) {
      isMatch = true;
    }

    if (isMatch && !matchedSources.some((s) => s.id === src.id)) {
      matchedSources.push(src);
    }
  }

  // 2. Determine confidence level
  let confidenceLevel: ScientificConfidenceLevel = 'unverified';
  let confidenceLabelFa = 'فاقد استناد معتبر (نیاز به ارزیابی)';
  let confidenceDescriptionFa = 'این اطلاعات فاقد شماره استاندارد یا استناد قطعی به مراجع معتبر است و نباید به عنوان فکت آزمایشگاهی مطلق در نظر گرفته شود.';

  const hasInso = matchedSources.some((s) => s.sourceType === 'inso_standard');
  const hasIso = matchedSources.some((s) => s.sourceType === 'iso_standard');
  const hasAoac = matchedSources.some((s) => s.sourceType === 'aoac_method');
  const hasCodex = matchedSources.some((s) => s.sourceType === 'codex_standard');
  const hasOfficial = hasInso || hasIso || hasAoac || hasCodex;

  const hasPaperOrBook = matchedSources.some(
    (s) => s.sourceType === 'scientific_paper' || s.sourceType === 'reference_book' || s.sourceType === 'lab_manual' || s.sourceType === 'sds'
  );

  if (hasOfficial) {
    confidenceLevel = 'verified';
    confidenceLabelFa = 'تأییدشده رسمی (Verified Standard)';
    confidenceDescriptionFa = 'مستند به استانداردهای ملی و بین‌المللی مصوب (INSO / ISO / AOAC / Codex) با حدود و متدولوژی الزامی.';
  } else if (hasPaperOrBook) {
    confidenceLevel = 'source_backed';
    confidenceLabelFa = 'دارای منبع علمی معتبر (Source-backed)';
    confidenceDescriptionFa = 'مستند به کتب مرجع دانشگاهی، مقالات داوری‌شده پژوهشی و راهنماهای معتبر بین‌المللی.';
  } else if (
    combined.includes('استاندارد') ||
    combined.includes('کدکس') ||
    combined.includes('inso') ||
    combined.includes('iso') ||
    combined.includes('aoac') ||
    combined.includes('فرمول') ||
    combined.includes('حد مجاز')
  ) {
    confidenceLevel = 'partially_supported';
    confidenceLabelFa = 'پشتیبانی علمی جزئی (Partially Supported)';
    confidenceDescriptionFa = 'مفاهیم مطابق اصول علمی صنایع غذایی است اما شماره دقیق یا نسخه استاندارد به صراحت ذکر نشده است.';
  } else {
    confidenceLevel = 'unverified';
    confidenceLabelFa = 'فاقد منبع رسمی (Unverified)';
    confidenceDescriptionFa = 'داده‌ها بر مبنای تخمین‌های تئوریک ارائه شده و نیازمند انطباق با استاندارد رسمی محصول است.';
  }

  // 3. Detect known scientific discrepancies in the discussed topic
  const discrepancyAlerts: ScientificAnalysisResult['discrepancyAlerts'] = [];

  for (const disc of SCIENTIFIC_DISCREPANCIES_DATABASE) {
    let triggered = false;

    if (disc.id === 'disc-salt-cheese') {
      if (
        (combined.includes('پنیر') || combined.includes('cheese')) &&
        (combined.includes('نمک') || combined.includes('salt') || combined.includes('کلرید سدیم'))
      ) {
        triggered = true;
      }
    } else if (disc.id === 'disc-apc-incubation-temp') {
      if (
        (combined.includes('انکوباسیون') || combined.includes('پورپلیت') || combined.includes('شمارش کلی') || combined.includes('tpc') || combined.includes('apc') || combined.includes('pca')) &&
        (combined.includes('دما') || combined.includes('۳۰') || combined.includes('30') || combined.includes('۳۵') || combined.includes('35'))
      ) {
        triggered = true;
      }
    } else if (disc.id === 'disc-benzoate-beverages') {
      if (
        (combined.includes('بنزوات') || combined.includes('بنزوئیک') || combined.includes('benzoate')) &&
        (combined.includes('نوشیدنی') || combined.includes('آبمیوه') || combined.includes('beverage') || combined.includes('juice'))
      ) {
        triggered = true;
      }
    } else if (disc.id === 'disc-moisture-traditional-bread') {
      if (
        (combined.includes('نان') || combined.includes('bread') || combined.includes('سنگک') || combined.includes('بربری')) &&
        (combined.includes('رطوبت') || combined.includes('moisture'))
      ) {
        triggered = true;
      }
    }

    if (triggered) {
      discrepancyAlerts.push({
        id: disc.id,
        topicFa: disc.topicFa,
        primaryStandard: `${disc.primarySource.standardNumber} (${disc.primarySource.limitValue})`,
        conflictingStandard: `${disc.conflictingSource.standardNumber} (${disc.conflictingSource.limitValue})`,
        summaryFa: disc.scientificExplanationFa,
        recommendationFa: disc.actionRecommendationFa
      });
    }
  }

  return {
    confidenceLevel,
    confidenceLabelFa,
    confidenceDescriptionFa,
    citedSources: matchedSources.map((s) => ({
      id: s.id,
      title: s.title,
      standardNumber: s.standardNumber,
      sourceType: s.sourceType,
      year: s.year,
      authorOrOrganization: s.authorOrOrganization,
      hasPdf: s.hasPdf,
      confidenceLevel: s.confidenceLevel
    })),
    discrepancyAlerts,
    hasVerifiedSource: hasOfficial,
    requiresClarification: confidenceLevel === 'unverified'
  };
}
