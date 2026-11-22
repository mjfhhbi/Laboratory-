/**
 * Food Science AI - Central Evidence & Source System
 * Part 30 of 30 - Universal Scientific Credibility & Anti-Hallucination Framework
 * 
 * Communication Structure:
 * User ↓ Chat / Laboratory / Research / Product ↓ Intent ↓ Knowledge Base ↓ Sources / Standards ↓ RAG ↓ AI ↓ Validation ↓ Answer / Calculation / Recommendation ↓ Source + Confidence
 * 
 * Three Universal Evidence Tiers:
 * 1. VERIFIED: اطلاعات مستقیماً توسط Source معتبر پشتیبانی می‌شود.
 * 2. SUPPORTED: اطلاعات از منابع موجود پشتیبانی می‌شود اما نیاز به بررسی بیشتر دارد.
 * 3. UNVERIFIED: منبع کافی وجود ندارد و نباید به‌عنوان حقیقت قطعی نمایش داده شود.
 * 
 * Golden Rule:
 * AI هرگز نباید برای پر کردن جای خالی، شماره استاندارد، فرمول، عدد، دما، زمان، غلظت، حد پذیرش، Citation، DOI یا نتیجه آزمایش را جعل کند.
 */

import { ScientificSourceType, ScientificConfidenceLevel } from '../../types/scientificSource';

export type UnifiedEvidenceTier = 'VERIFIED' | 'SUPPORTED' | 'UNVERIFIED';

export type CentralModuleType =
  | 'chat'
  | 'laboratory'
  | 'experiments'
  | 'equipment'
  | 'reagents'
  | 'microbiology'
  | 'food_chemistry'
  | 'qa_qc'
  | 'statistics'
  | 'research'
  | 'pdf_analysis'
  | 'product_development'
  | 'costing'
  | 'troubleshooting';

export interface UnifiedCitation {
  id: string;
  title: string;
  standardNumber?: string;
  sourceType: ScientificSourceType;
  authorOrOrg?: string;
  year?: string | number;
  doiOrUrl?: string;
  pageOrSection?: string | number;
  confidenceGrade: ScientificConfidenceLevel;
  directEvidenceSnippet?: string;
  isOcr?: boolean;
  isOcrVerified?: boolean;
}

export interface NumericalClaimItem {
  parameterName: string;
  claimedValue: number | string;
  unit?: string;
  toleranceRange?: string;
  isCompliantWithSource?: boolean;
  standardLimit?: string;
}

export interface AntiHallucinationAudit {
  passed: boolean;
  goldenRuleCompliant: boolean;
  forgedEntitiesDetected: string[];
  unsupportedClaimsDetected: string[];
  auditMessageFa: string;
}

export interface UnifiedEvidenceReport {
  tier: UnifiedEvidenceTier;
  tierLabelFa: string;
  tierDescriptionFa: string;
  credibilityScore: number; // 0 - 100
  module: CentralModuleType;
  queryOrContext: string;
  citations: UnifiedCitation[];
  numericalClaimsAudit: NumericalClaimItem[];
  verifiedClaims: string[];
  supportedCaveats: string[];
  unverifiedWarnings: string[];
  antiHallucinationAudit: AntiHallucinationAudit;
  recommendedActionFa: string;
  timestamp: string;
}

export interface CentralEvidenceEvaluationRequest {
  module: CentralModuleType;
  queryOrTopic: string;
  productCategory?: string;
  targetStandardNumber?: string;
  testMethod?: string;
  numericalData?: Array<{ name: string; value: number | string; unit?: string }>;
  inputCitations?: string[];
  textPayload?: string;
}
