/**
 * Food Science AI - Evidence Validation & Integrity Engine
 * Part 23 of 30 - Strict Grounding & Evidence Sufficiency Assessment
 * 
 * Rules:
 * AI must NOT assume a text is definitive truth simply because it exists in the Knowledge Base.
 * If evidence is insufficient:
 * 1. Announce lack of definitive source (اعلام کمبود منبع)
 * 2. Request additional information from user (درخواست اطلاعات بیشتر)
 * 3. Or provide a generalized answer clearly flagged as Unverified (ارائه پاسخ عمومی با برچسب Unverified)
 */

import { RagEvidenceValidationResult, RagRankedChunk, RagIntentResult, RagConfig } from './types';
import { normalizePersianText } from './intentDetector';

export function validateRagEvidence(
  userQuery: string,
  intent: RagIntentResult,
  chunks: RagRankedChunk[],
  config: RagConfig
): RagEvidenceValidationResult {
  const missingFactors: string[] = [];
  const versionAlerts: RagEvidenceValidationResult['versionAlerts'] = [];

  if (chunks.length === 0) {
    return {
      score: 0,
      level: 'insufficient',
      tier: 'UNVERIFIED',
      strategy: 'unverified_warning',
      missingFactors: [
        'هیچ سند مرتبطی در پایگاه دانش و مخزن PDF یافت نشد.',
        'عدم وجود استاندارد ملی یا بین‌المللی متصل به پرسش.',
        'عدم ثبت روش آزمون یا مشخصات محصول در پایگاه داده.'
      ],
      hasAuthoritativeStandard: false,
      hasNumericalLimits: false,
      hasExactTestMethod: false,
      hasHumanVerifiedSource: false,
      rationaleFa: 'عدم تطابق شواهد: هیچ قطعه مستندی در پایگاه دانش محلی یافت نشد.',
      warningNoticeFa: 'کمبود منبع قطعی: برای این پرسش، هیچ استاندارد ملی یا مرجع مستندی در سامانه یافت نشد. پاسخ ارائه‌شده صرفاً بر پایه اصول عمومی صنایع غذایی بوده و دارای برچسب [UNVERIFIED] است.',
      versionAlerts: []
    };
  }

  let evidencePoints = 0;

  // 1. Authoritative Standard Check (+35 pts)
  const authoritativeChunk = chunks.find(
    (c) =>
      ['inso_standard', 'iso_standard', 'aoac_method', 'codex_standard', 'official_regulatory'].includes(c.sourceType) &&
      c.finalRankScore > 0.25
  );

  const hasAuthoritativeStandard = Boolean(authoritativeChunk);
  if (hasAuthoritativeStandard) {
    evidencePoints += 35;
  } else {
    missingFactors.push('عدم وجود استاندارد ملی رسمی (INSO) یا مرجع بین‌المللی مرتبط با این فرآورده در اسناد');
  }

  // 2. Exact Numerical Limits & Specifications Check (+25 pts)
  const combinedText = chunks.map((c) => c.text).join(' ');
  const hasNumbersOrLimits =
    /[\d٠-٩]+(?:\.[\d٠-٩]+)?\s*(?:درصد|%|میلی|گرم|g|mg|kg|ppm|cfu|dornic|ph|دقیقه|ثانیه|درجه|سلسیوس|°c)/i.test(
      combinedText
    ) ||
    combinedText.includes('حداکثر') ||
    combinedText.includes('حداقل') ||
    combinedText.includes('بیشینه') ||
    combinedText.includes('کمینه');

  if (hasNumbersOrLimits) {
    evidencePoints += 25;
  } else if (intent.type === 'standard_compliance' || intent.type === 'formulation_calculation') {
    missingFactors.push('عدم یافتن حدود عددی مشخص (بیشینه/کمینه یا واحد سنجش) در شواهد بازیابی‌شده');
  }

  // 3. Test Method / Protocol Verification (+20 pts)
  const hasTestMethod =
    combinedText.includes('روش آزمون') ||
    combinedText.includes('معرف') ||
    combinedText.includes('تیتراسیون') ||
    combinedText.includes('دستور کار') ||
    combinedText.includes('نمونه‌برداری') ||
    combinedText.includes('انکوباسیون');

  if (hasTestMethod) {
    evidencePoints += 20;
  } else if (intent.type === 'test_method') {
    missingFactors.push('پروتکل دقیق اجرایی یا شرح گام‌به‌گام روش آزمون در قطعات مستند یافت نشد');
  }

  // 4. Verification & Human Review Quality Check (+20 pts)
  const hasHumanVerified = chunks.some(
    (c) => (c.sourceConfidence === 'verified' || c.sourceConfidence === 'source_backed') && (!c.isOcr || c.isVerified)
  );

  if (hasHumanVerified) {
    evidencePoints += 20;
  } else {
    missingFactors.push('اطلاعات منحصراً از متن استخراج‌شده از تصویر (OCR) یا رکوردهای تاییدنشده تشکیل شده است');
  }

  // 5. Version Awareness & Deprecated Alert Check
  for (const chunk of chunks) {
    if (chunk.versionNotice) {
      versionAlerts.push({
        standardNumber: chunk.standardNumber || 'نامشخص',
        status: 'منسوخ یا جایگزین‌شده',
        warningFa: chunk.versionNotice
      });
      evidencePoints = Math.max(0, evidencePoints - 15);
    }
  }

  // 6. Intent-Specific Threshold Evaluation
  let finalScore = Math.min(100, Math.max(0, evidencePoints));

  // Determine Level & Strategy
  let level: RagEvidenceValidationResult['level'] = 'insufficient';
  let tier: RagEvidenceValidationResult['tier'] = 'UNVERIFIED';
  let strategy: RagEvidenceValidationResult['strategy'] = 'unverified_warning';
  let rationaleFa = '';
  let warningNoticeFa: string | undefined;

  if (finalScore >= 65 && hasAuthoritativeStandard) {
    level = 'sufficient';
    tier = 'VERIFIED';
    strategy = 'grounded_verified';
    rationaleFa = `شواهد کافی و موثق: استاندارد رسمی ${authoritativeChunk?.standardNumber || authoritativeChunk?.sourceTitle} به همراه حدود و روش آزمون معتبر یافت شد.`;
  } else if (finalScore >= (config.minEvidenceScore || 35)) {
    level = 'partial';
    tier = 'SUPPORTED';
    strategy = 'cautious_partial';
    rationaleFa = 'شواهد علمی جزئی: بخشی از مفاهیم در پایگاه دانش موجود است، اما استاندارد رسمی قطعی یا کلیه پارامترهای عددی پوشش داده نشده‌اند.';
    warningNoticeFa = `شواهد جزئی: برای این استعلام، ${missingFactors.join(' و ')} یافت نگردید. لطفاً مشخصات دقیق‌تر نمونه را وارد کرده یا استاندارد مربوطه را بررسی نمایید.`;
  } else {
    level = 'insufficient';
    tier = 'UNVERIFIED';
    strategy = 'unverified_warning';
    rationaleFa = 'کمبود شواهد قطعی: مراجع معتبر در پایگاه دانش کافی نیستند. استناد به عنوان فکت آزمایشگاهی مجاز نیست.';
    warningNoticeFa = 'اعلام کمبود منبع رسمی: مدارک موجود در پایگاه دانش برای ارائه پاسخ قطعی آزمایشگاهی کافی نیست. پاسخ زیر به صورت عمومی و با برچسب Unverified ارائه می‌گردد.';
  }

  return {
    score: finalScore,
    level,
    tier,
    strategy,
    missingFactors,
    hasAuthoritativeStandard,
    hasNumericalLimits: hasNumbersOrLimits,
    hasExactTestMethod: hasTestMethod,
    hasHumanVerifiedSource: hasHumanVerified,
    rationaleFa,
    warningNoticeFa,
    versionAlerts
  };
}
