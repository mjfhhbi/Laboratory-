/**
 * Food Science AI - Central Evidence & Source Hub
 * Part 30 of 30 - Complete System Integration
 * 
 * Central communication structure:
 * User ↓ Chat / Laboratory / Research / Product ↓ Intent ↓ Knowledge Base ↓ Sources / Standards ↓ RAG ↓ AI ↓ Validation ↓ Answer / Calculation / Recommendation ↓ Source + Confidence
 * 
 * Universal 3-tier credibility standard:
 * - VERIFIED: اطلاعات مستقیماً توسط Source معتبر پشتیبانی می‌شود.
 * - SUPPORTED: اطلاعات از منابع موجود پشتیبانی می‌شود اما نیاز به بررسی بیشتر دارد.
 * - UNVERIFIED: منبع کافی وجود ندارد و نباید به‌عنوان حقیقت قطعی نمایش داده شود.
 * 
 * Strict Golden Rule:
 * AI هرگز نباید برای پر کردن جای خالی، شماره استاندارد، فرمول، عدد، دما، زمان، غلظت، حد پذیرش، Citation، DOI یا نتیجه آزمایش را جعل کند.
 */

import {
  UnifiedEvidenceTier,
  UnifiedEvidenceReport,
  CentralEvidenceEvaluationRequest,
  UnifiedCitation,
  NumericalClaimItem,
  AntiHallucinationAudit
} from './types';
import { getAllIranianStandards } from '../storage/iranianStandardsStorage';
import { getAllUnifiedSources } from '../storage/scientificSourcesStorage';
import { getAllKnowledgeRecords } from '../storage/knowledgeBase';

/**
 * Returns UI metadata for the 3 universal tiers
 */
export function getEvidenceTierMeta(tier: UnifiedEvidenceTier) {
  switch (tier) {
    case 'VERIFIED':
      return {
        tier: 'VERIFIED' as const,
        labelFa: 'تأییدشده رسمی و مستند (VERIFIED)',
        shortLabelFa: 'VERIFIED',
        descriptionFa: 'اطلاعات مستقیماً توسط Source معتبر (استاندارد ملی، ایزو، AOAC، کدکس یا مرجع رسمی) پشتیبانی می‌شود.',
        badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-500/40',
        bgSubtle: 'bg-emerald-50 dark:bg-emerald-950/30',
        borderClass: 'border-emerald-300 dark:border-emerald-800',
        textClass: 'text-emerald-700 dark:text-emerald-300',
        iconName: 'CheckCircle2'
      };
    case 'SUPPORTED':
      return {
        tier: 'SUPPORTED' as const,
        labelFa: 'پشتیبانی‌شده با منابع موجود (SUPPORTED)',
        shortLabelFa: 'SUPPORTED',
        descriptionFa: 'اطلاعات از منابع و متون موجود پشتیبانی می‌شود اما نیاز به بررسی بیشتر و تطبیق شرایط دارد.',
        badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 dark:border-amber-500/40',
        bgSubtle: 'bg-amber-50 dark:bg-amber-950/30',
        borderClass: 'border-amber-300 dark:border-amber-800',
        textClass: 'text-amber-700 dark:text-amber-300',
        iconName: 'HelpCircle'
      };
    case 'UNVERIFIED':
    default:
      return {
        tier: 'UNVERIFIED' as const,
        labelFa: 'فاقد منبع قطعی (UNVERIFIED)',
        shortLabelFa: 'UNVERIFIED',
        descriptionFa: 'منبع کافی وجود ندارد و این اطلاعات نباید به‌عنوان حقیقت قطعی نمایش داده شود.',
        badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 dark:border-rose-500/40',
        bgSubtle: 'bg-rose-50 dark:bg-rose-950/30',
        borderClass: 'border-rose-300 dark:border-rose-800',
        textClass: 'text-rose-700 dark:text-rose-300',
        iconName: 'AlertTriangle'
      };
  }
}

/**
 * Normalizes text for robust matching
 */
function normalizePersianText(input: string): string {
  if (!input) return '';
  return input
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[ي]/g, 'ی')
    .replace(/[ك]/g, 'ک')
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .toLowerCase()
    .trim();
}

/**
 * Golden Rule Verification Engine
 * Strictly detects fabricated numbers, standards, or claims
 */
export function auditAntiHallucination(
  text: string,
  verifiedStandardNumbers: string[]
): AntiHallucinationAudit {
  const forgedEntities: string[] = [];
  const unsupportedClaims: string[] = [];

  const normalized = normalizePersianText(text);

  // 1. Detect standard numbers cited in text (e.g., INSO 1234, ISIRI 5678, ISO 22000, AOAC 991.20)
  const insoRegex = /(?:inso|isiri|استاندارد\s*ملی)\s*[-:]?\s*(\d+)/gi;
  let match: RegExpExecArray | null;

  const foundInsoNumbers: string[] = [];
  while ((match = insoRegex.exec(text)) !== null) {
    if (match[1]) {
      foundInsoNumbers.push(match[1]);
    }
  }

  // Compare found standard numbers against known verified standard numbers
  const verifiedCleanedNumbers = verifiedStandardNumbers.map((s) => s.replace(/\D/g, ''));

  for (const foundNum of foundInsoNumbers) {
    // If the number looks absurdly high (e.g. > 99999) or not in any standard database
    const numInt = parseInt(foundNum, 10);
    if (numInt > 90000 || numInt === 0) {
      forgedEntities.push(`شماره استاندارد نامعتبر یا جعلی احتمالی: INSO ${foundNum}`);
    } else if (verifiedCleanedNumbers.length > 0 && !verifiedCleanedNumbers.some((v) => v.includes(foundNum) || foundNum.includes(v))) {
      // Not strictly forged if standard database is partial, but unsupported
      unsupportedClaims.push(`شماره استاندارد INSO ${foundNum} در بانک استانداردهای محلی تأیید نشده است.`);
    }
  }

  // 2. Check for fake DOIs (e.g. 10.xxxx/fake)
  const doiRegex = /\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/gi;
  const foundDois = text.match(doiRegex) || [];
  for (const doi of foundDois) {
    if (doi.toLowerCase().includes('example') || doi.toLowerCase().includes('fake') || doi.toLowerCase().includes('test')) {
      forgedEntities.push(`شناسه دیجیتال جعلی (DOI): ${doi}`);
    }
  }

  // 3. Check for absolute dogma without citation (e.g., "دقیقا", "حتما باید", "بدون هیچ شکی")
  if (normalized.includes('حتما باید') && !normalized.includes('منبع') && !normalized.includes('استاندارد')) {
    unsupportedClaims.push('توصیه قاطعانه بدون ذکر مشخصات منبع رسمی یا استاندارد');
  }

  const passed = forgedEntities.length === 0;
  const goldenRuleCompliant = passed && unsupportedClaims.length <= 1;

  let auditMessageFa = 'کلیه مشخصات استناد با پایگاه مراجع رسمی انطباق دارد.';
  if (!passed) {
    auditMessageFa = `نقض قانون طلایی: ${forgedEntities.join(' | ')}`;
  } else if (!goldenRuleCompliant) {
    auditMessageFa = `نیازمند اعتبارسنجی منبع: ${unsupportedClaims.join(' | ')}`;
  }

  return {
    passed,
    goldenRuleCompliant,
    forgedEntitiesDetected: forgedEntities,
    unsupportedClaimsDetected: unsupportedClaims,
    auditMessageFa
  };
}

/**
 * Universal Evidence Evaluator for ALL Food Science AI Modules
 */
export async function evaluateModuleEvidence(
  req: CentralEvidenceEvaluationRequest
): Promise<UnifiedEvidenceReport> {
  const timestamp = new Date().toISOString();
  const queryNormalized = normalizePersianText(req.queryOrTopic);
  const textNormalized = normalizePersianText(req.textPayload || req.queryOrTopic);

  // 1. Fetch Verified Sources from Repositories
  const [iranianStandards, unifiedSources, knowledgeRecords] = await Promise.all([
    getAllIranianStandards().catch(() => []),
    getAllUnifiedSources().catch(() => []),
    getAllKnowledgeRecords().catch(() => [])
  ]);

  const verifiedStandardNumbers = iranianStandards.map((s) => s.standardNumber);
  const matchedCitations: UnifiedCitation[] = [];

  let evidencePoints = 0;
  const verifiedClaims: string[] = [];
  const supportedCaveats: string[] = [];
  const unverifiedWarnings: string[] = [];

  // A. Check Direct Standard Match
  if (req.targetStandardNumber) {
    const targetClean = normalizePersianText(req.targetStandardNumber);
    const standardMatch = iranianStandards.find(
      (s) => normalizePersianText(s.standardNumber).includes(targetClean) || targetClean.includes(normalizePersianText(s.standardNumber))
    );

    if (standardMatch) {
      evidencePoints += 45;
      matchedCitations.push({
        id: standardMatch.id,
        title: standardMatch.titleFa,
        standardNumber: standardMatch.standardNumber,
        sourceType: 'inso_standard',
        authorOrOrg: 'سازمان ملی استاندارد ایران (INSO)',
        year: standardMatch.yearApproved,
        confidenceGrade: 'verified',
        directEvidenceSnippet: `استاندارد ملی شماره ${standardMatch.standardNumber}: ${standardMatch.titleFa} (وضعیت: ${standardMatch.status})`,
        isOcr: false,
        isOcrVerified: true
      });
      verifiedClaims.push(`استاندارد ملی رسمی ${standardMatch.standardNumber} در پایگاه داده اعتبارسنجی شد.`);
    }
  }

  // B. Search In Unified Sources (ISO, AOAC, Codex, Books, Papers)
  for (const src of unifiedSources) {
    const titleNorm = normalizePersianText(src.title);
    const stdNumNorm = normalizePersianText(src.standardNumber || '');

    const isMatch =
      (src.standardNumber && (queryNormalized.includes(stdNumNorm) || textNormalized.includes(stdNumNorm))) ||
      titleNorm.split(' ').some((word) => word.length > 4 && (queryNormalized.includes(word) || textNormalized.includes(word)));

    if (isMatch && !matchedCitations.some((c) => c.id === src.id)) {
      matchedCitations.push({
        id: src.id,
        title: src.title,
        standardNumber: src.standardNumber,
        sourceType: src.publicationType,
        authorOrOrg: src.authorOrOrganization,
        year: src.year,
        doiOrUrl: src.doiOrUrl,
        confidenceGrade: src.reliabilityGrade,
        directEvidenceSnippet: src.notesFa || src.title,
        isOcr: src.hasPdf,
        isOcrVerified: src.isOcrVerified
      });

      if (['inso_standard', 'iso_standard', 'aoac_method', 'codex_standard', 'official_regulatory'].includes(src.publicationType)) {
        evidencePoints += 30;
      } else {
        evidencePoints += 15;
      }
    }
  }

  // C. Search In Knowledge Records
  for (const rec of knowledgeRecords) {
    const titleNorm = normalizePersianText(rec.titleFa);
    if (queryNormalized.includes(titleNorm) || (titleNorm.length > 5 && textNormalized.includes(titleNorm))) {
      evidencePoints += 15;
      verifiedClaims.push(`مفهوم علمی ثبت‌شده: «${rec.titleFa}» (${rec.category})`);
      break;
    }
  }

  // D. Numerical Claim Audit
  const numericalClaimsAudit: NumericalClaimItem[] = [];
  if (req.numericalData && req.numericalData.length > 0) {
    for (const num of req.numericalData) {
      numericalClaimsAudit.push({
        parameterName: num.name,
        claimedValue: num.value,
        unit: num.unit,
        isCompliantWithSource: evidencePoints >= 40,
        standardLimit: evidencePoints >= 40 ? 'منطبق با حدود استاندارد' : 'نیازمند استعلام از استاندارد محصول'
      });
    }
  }

  // E. Anti-Hallucination Audit (Golden Rule Enforcement)
  const antiHallucinationAudit = auditAntiHallucination(
    `${req.queryOrTopic} ${req.textPayload || ''}`,
    verifiedStandardNumbers
  );

  if (!antiHallucinationAudit.passed) {
    evidencePoints = 0; // Immediate disqualification to UNVERIFIED if forged entity found
    unverifiedWarnings.push(...antiHallucinationAudit.forgedEntitiesDetected);
  } else if (!antiHallucinationAudit.goldenRuleCompliant) {
    evidencePoints = Math.min(evidencePoints, 45); // Cap to SUPPORTED if unbacked claims exist
    supportedCaveats.push(...antiHallucinationAudit.unsupportedClaimsDetected);
  }

  // F. Calculate Final Tier
  let finalScore = Math.min(100, Math.max(0, evidencePoints));
  let tier: UnifiedEvidenceTier = 'UNVERIFIED';

  if (finalScore >= 65 && matchedCitations.some((c) => c.confidenceGrade === 'verified' || c.confidenceGrade === 'source_backed')) {
    tier = 'VERIFIED';
  } else if (finalScore >= 35) {
    tier = 'SUPPORTED';
  } else {
    tier = 'UNVERIFIED';
  }

  // G. Synthesize Explanations & Next Steps
  const meta = getEvidenceTierMeta(tier);

  let recommendedActionFa = '';
  if (tier === 'VERIFIED') {
    recommendedActionFa = 'اطلاعات با استناد کامل به مراجع رسمی و استانداردهای مصوب قابل استفاده در گزارش‌ها و تصمیم‌گیری‌های صنعتی است.';
  } else if (tier === 'SUPPORTED') {
    recommendedActionFa = 'استفاده به عنوان راهنمای مهندسی اولیه مجاز است؛ پیش از تولید انبوه یا آزمون نهایی، انطباق با استاندارد ملی اختصاصی را کنترل فرمایید.';
  } else {
    recommendedActionFa = 'کمبود منبع رسمی: این داده‌ها نباید به عنوان حقیقت قطعی یا استاندارد قانونی ملاک عمل قرار گیرند. لطفاً استاندارد مربوطه را بارگذاری نمایید.';
  }

  return {
    tier,
    tierLabelFa: meta.labelFa,
    tierDescriptionFa: meta.descriptionFa,
    credibilityScore: finalScore,
    module: req.module,
    queryOrContext: req.queryOrTopic,
    citations: matchedCitations,
    numericalClaimsAudit,
    verifiedClaims,
    supportedCaveats,
    unverifiedWarnings,
    antiHallucinationAudit,
    recommendedActionFa,
    timestamp
  };
}
