/**
 * Food Science AI - RAG (Retrieval-Augmented Generation) Architecture Types
 * Part 23 of 30 - Specialized Food Science RAG Engine
 * 
 * Flow:
 * Question -> Intent Detection -> Knowledge Base Search -> Source Retrieval -> 
 * Relevant Chunks -> Evidence Validation -> AI -> Answer + Sources
 */

import { ScientificSourceType, ScientificConfidenceLevel } from '../../types/scientificSource';

export type RagSearchMode = 'hybrid' | 'semantic' | 'keyword';

export type RagIntentType = 
  | 'standard_compliance'      // انطباق با استاندارد و حدود مجاز قانونی
  | 'test_method'              // روش آزمون و پروتکل آزمایشگاهی (SOP)
  | 'formulation_calculation'  // محاسبات مهندسی، سینتیک حرارتی و فرمولاسیون
  | 'troubleshooting_defect'   // عیب‌یابی، فساد میکروبی و نقص‌های کیفی
  | 'product_specification'    // مشخصات محصول، طبقه‌بندی و مواد اولیه
  | 'general_query';           // سوال عمومی صنایع غذایی

export interface RagIntentResult {
  type: RagIntentType;
  labelFa: string;
  confidence: number;
  extractedKeywords: string[];
  targetProduct?: string;
  targetExperiment?: string;
  targetStandard?: string;
  targetReagentOrDevice?: string;
}

export type RagPriorityPreset = 'standards_first' | 'academic_first' | 'official_first' | 'custom';

export interface RagSourcePriorityWeights {
  inso_standard: number;       // استاندارد ملی ایران
  iso_standard: number;        // استاندارد بین‌المللی ایزو
  aoac_method: number;         // روش رسمی AOAC
  codex_standard: number;      // استاندارد کدکس
  official_regulatory: number; // مراجع رسمی و نظارتی (IFDA/FDA)
  scientific_paper: number;    // مقالات علمی پژوهشی
  reference_book: number;      // کتب مرجع دانشگاهی
  lab_manual: number;          // راهنماهای آزمایشگاهی
  lecture_handout: number;     // جزوات و پمفلت‌ها
  lab_file: number;            // گزارش‌های آزمایشگاهی
  sds: number;                 // برگه اطلاعات ایمنی
}

export interface RagFilterConfig {
  sourceTypes?: ScientificSourceType[];
  productFilter?: string;
  experimentFilter?: string;
  standardFilter?: string;
  minConfidence?: ScientificConfidenceLevel | 'all';
  requireHumanVerifiedOcr?: boolean;
  enableVersionAwareness?: boolean;
}

export interface RagConfig {
  enabled: boolean;
  searchMode: RagSearchMode;
  hybridAlpha: number; // 0 (pure keyword) to 1 (pure semantic), default 0.55
  priorityPreset: RagPriorityPreset;
  priorityWeights: RagSourcePriorityWeights;
  filters: RagFilterConfig;
  minEvidenceScore: number; // default 35
  topKChunks: number;       // default 6
}

export interface RagRankedChunk {
  id: string;
  sourceId: string;
  sourceTitle: string;
  sourceType: ScientificSourceType;
  standardNumber?: string;
  pageNumber?: number;
  sectionHeading?: string;
  text: string;
  characterCount: number;
  keywordScore: number;  // 0 to 1
  semanticScore: number; // 0 to 1
  hybridScore: number;   // 0 to 1
  priorityMultiplier: number;
  finalRankScore: number; // hybridScore * priorityMultiplier
  isOcr?: boolean;
  isVerified?: boolean;
  sourceConfidence: ScientificConfidenceLevel;
  tags?: string[];
  matchedTerms?: string[];
  versionNotice?: string;
}

export type RagEvidenceLevel = 'sufficient' | 'partial' | 'insufficient';

export type RagGroundingStrategy = 'grounded_verified' | 'cautious_partial' | 'unverified_warning';

export interface RagEvidenceValidationResult {
  score: number; // 0 to 100
  level: RagEvidenceLevel;
  tier: 'VERIFIED' | 'SUPPORTED' | 'UNVERIFIED';
  strategy: RagGroundingStrategy;
  missingFactors: string[];
  hasAuthoritativeStandard: boolean;
  hasNumericalLimits: boolean;
  hasExactTestMethod: boolean;
  hasHumanVerifiedSource: boolean;
  rationaleFa: string;
  warningNoticeFa?: string;
  versionAlerts: Array<{
    standardNumber: string;
    status: string;
    replacedBy?: string;
    warningFa: string;
  }>;
}

export interface RagCitedSourceItem {
  id: string;
  title: string;
  standardNumber?: string;
  sourceType: string;
  year?: string;
  authorOrOrganization?: string;
  hasPdf?: boolean;
  pdfDocumentId?: string;
  pageNumber?: number;
  snippet?: string;
  confidenceLevel: ScientificConfidenceLevel;
  isOcr?: boolean;
  isOcrVerified?: boolean;
}

export interface RagPipelineTrace {
  step1_question: string;
  step2_intent: RagIntentResult;
  step3_searchMode: RagSearchMode;
  step4_retrievedSourcesCount: number;
  step5_rankedChunks: Array<{
    id: string;
    title: string;
    standardNumber?: string;
    pageNumber?: number;
    score: number;
    type: string;
  }>;
  step6_evidenceValidation: RagEvidenceValidationResult;
  step7_groundingStrategy: RagGroundingStrategy;
  executionTimeMs: number;
}

export interface RagPipelineResult {
  query: string;
  intent: RagIntentResult;
  rankedChunks: RagRankedChunk[];
  citedSources: RagCitedSourceItem[];
  evidenceValidation: RagEvidenceValidationResult;
  groundingPromptAugmentation: string;
  augmentedSystemInstruction: string;
  trace: RagPipelineTrace;
}
