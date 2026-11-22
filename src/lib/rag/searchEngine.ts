/**
 * Food Science AI - Multi-Modal RAG Search & Ranking Engine
 * Part 23 of 30 - Semantic, Keyword & Hybrid Search with Source Priority & Version Awareness
 */

import { RagConfig, RagRankedChunk, RagIntentResult } from './types';
import { normalizePersianText } from './intentDetector';
import { getAllStoredPdfs } from '../storage/pdfDocumentStorage';
import { getAllKnowledgeRecords } from '../storage/knowledgeBase';
import { getAllUnifiedSources } from '../storage/scientificSourcesStorage';
import { getAllIranianStandards } from '../storage/iranianStandardsStorage';
import { ScientificSourceType, ScientificConfidenceLevel, UnifiedScientificSource } from '../../types/scientificSource';
import { IranianStandard } from '../../types/iranianStandard';

// Domain thesaurus for semantic food science concept expansion
const FOOD_SCIENCE_CONCEPT_MAP: Record<string, string[]> = {
  'شیر': ['لبنیات', 'شیر پاستوریزه', 'لاکتوز', 'کازئین', 'چربی شیر', 'اسیدیته دورنیک', 'پاستوریزاسیون', 'milk', 'dairy', 'inso 2406'],
  'ماست': ['دوغ', 'تخمیر', 'اسید لاکتیک', 'استارتر', 'لاکتوباسیلوس', 'سینرزیس', 'آب اندازی', 'yogurt'],
  'دوغ': ['ماست', 'نمک', 'اسیدیته', 'تخمیر', 'گازدار', 'doogh', 'inso 2453'],
  'پنیر': ['لخته', 'مایه پنیر', 'رنت', 'فتا', 'اولترافیلتراسیون', 'نمک سود', 'آب پنیر', 'cheese', 'inso 2344'],
  'روغن': ['چربی', 'پراکسید', 'اکسیداسیون', 'اندیس اسیدی', 'اندیس ید', 'روغن مایع', 'روغن سرخ کردنی', 'اسید چرب آزاد', 'oil', 'lipid'],
  'رب': ['گوجه', 'بریکس', 'لیکوپن', 'کپک هاوارد', 'اسیدیته', 'پاستوریزاسیون', 'tomato paste', 'inso 761'],
  'آرد': ['گندم', 'گلوتن', 'خاکستر', 'رطوبت', 'نشاسته', 'سبوس', 'flour', 'inso 103'],
  'اسیدیته': ['ph', 'تیتراسیون', 'سود', 'هیدروکسید سدیم', 'فنل فتالئین', 'درجه دورنیک', 'acidity', 'titration'],
  'چربی': ['ژربیر', 'بوتیلومتر', 'رز گاتلیب', 'سوکسله', 'اسید سولفوریک', 'آمیل الکل', 'fat'],
  'بریکس': ['رفراکتومتر', 'ماده خشک محلول', 'شکست سنج', 'قند', 'brix', 'refractometer'],
  'پراکسید': ['اکسیداسیون', 'پراکسید هیدروژن', 'تیوسولفات', 'یدومتری', 'فساد اکسیداتیو', 'peroxide value', 'pv'],
  'پروتئین': ['کجلدال', 'ازت', 'هضم', 'تقطیر', 'اسید بوریک', 'protein', 'kjeldahl'],
  'میکروبی': ['کلی فرم', 'اشرشیا کلی', 'سالمونلا', 'پلیت کانت', 'محیط کشت', 'پتری دیش', 'microbiology']
};

/**
 * Calculates Token-Based Keyword Match Score (0 to 1)
 */
function calculateKeywordScore(
  queryTokens: string[],
  docTitle: string,
  docText: string,
  standardNumber?: string,
  tags?: string[]
): { score: number; matchedTerms: string[] } {
  if (queryTokens.length === 0) return { score: 0, matchedTerms: [] };

  const normTitle = normalizePersianText(docTitle);
  const normText = normalizePersianText(docText);
  const normStd = standardNumber ? normalizePersianText(standardNumber) : '';
  const normTags = (tags || []).map((t) => normalizePersianText(t)).join(' ');

  let matches = 0;
  let bonus = 0;
  const matchedTerms: string[] = [];

  for (const token of queryTokens) {
    if (token.length < 2) continue;
    let foundInItem = false;

    // Exact Match in Standard Number (huge bonus for compliance)
    if (normStd && normStd.includes(token)) {
      bonus += 0.45;
      foundInItem = true;
    }

    // Match in Title (high priority)
    if (normTitle.includes(token)) {
      matches += 2.0;
      foundInItem = true;
    }

    // Match in Tags
    if (normTags.includes(token)) {
      matches += 1.5;
      foundInItem = true;
    }

    // Match in Body Text
    if (normText.includes(token)) {
      matches += 1.0;
      foundInItem = true;
    }

    if (foundInItem) {
      matchedTerms.push(token);
    }
  }

  const rawScore = (matches / (queryTokens.length * 2)) + bonus;
  return {
    score: Math.min(1, Math.max(0, rawScore)),
    matchedTerms
  };
}

/**
 * Calculates Semantic Concept Similarity Score (0 to 1)
 */
function calculateSemanticScore(
  query: string,
  intent: RagIntentResult,
  docTitle: string,
  docText: string,
  tags?: string[]
): number {
  const normQuery = normalizePersianText(query);
  const combinedDoc = normalizePersianText(`${docTitle} ${docText} ${(tags || []).join(' ')}`);

  let semanticMatches = 0;
  let totalConceptsEvaluated = 0;

  // 1. Intent entity matching
  if (intent.targetProduct) {
    totalConceptsEvaluated += 2;
    if (combinedDoc.includes(normalizePersianText(intent.targetProduct))) {
      semanticMatches += 2;
    }
  }

  if (intent.targetExperiment) {
    totalConceptsEvaluated += 2;
    if (combinedDoc.includes(normalizePersianText(intent.targetExperiment))) {
      semanticMatches += 2;
    }
  }

  if (intent.targetStandard) {
    totalConceptsEvaluated += 3;
    if (combinedDoc.includes(normalizePersianText(intent.targetStandard))) {
      semanticMatches += 3;
    }
  }

  // 2. Thesaurus Semantic Expansion
  for (const [keyConcept, relatedConcepts] of Object.entries(FOOD_SCIENCE_CONCEPT_MAP)) {
    const normKey = normalizePersianText(keyConcept);
    if (normQuery.includes(normKey)) {
      totalConceptsEvaluated += 1;
      let conceptHit = false;

      if (combinedDoc.includes(normKey)) {
        conceptHit = true;
      } else {
        for (const rel of relatedConcepts) {
          if (combinedDoc.includes(normalizePersianText(rel))) {
            conceptHit = true;
            break;
          }
        }
      }

      if (conceptHit) {
        semanticMatches += 1;
      }
    }
  }

  // Fallback if no specific food concept in query
  if (totalConceptsEvaluated === 0) {
    // Character 3-gram cosine similarity approximation
    const queryNgrams = getCharacterNgrams(normQuery, 3);
    const docNgrams = getCharacterNgrams(combinedDoc.slice(0, 500), 3);
    let intersection = 0;
    for (const ng of queryNgrams) {
      if (docNgrams.has(ng)) intersection++;
    }
    return queryNgrams.size > 0 ? Math.min(1, (intersection * 2) / (queryNgrams.size + Math.min(150, docNgrams.size))) : 0;
  }

  return Math.min(1, semanticMatches / totalConceptsEvaluated);
}

function getCharacterNgrams(text: string, n: number): Set<string> {
  const set = new Set<string>();
  const clean = text.replace(/\s+/g, '');
  for (let i = 0; i <= clean.length - n; i++) {
    set.add(clean.substring(i, i + n));
  }
  return set;
}

/**
 * Searches and Ranks chunks across Knowledge Base, PDF Documents, and Iranian Standards
 */
export async function searchAndRankRagChunks(
  userQuery: string,
  intent: RagIntentResult,
  config: RagConfig
): Promise<RagRankedChunk[]> {
  const normQuery = normalizePersianText(userQuery);
  const queryTokens = normQuery
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);

  const rawCandidates: RagRankedChunk[] = [];

  // Parallel fetch from all stores
  const [storedPdfs, kbRecords, sources, iranianStandards] = await Promise.all([
    getAllStoredPdfs(),
    getAllKnowledgeRecords(),
    getAllUnifiedSources(),
    getAllIranianStandards()
  ]);

  const sourceMap = new Map<string, UnifiedScientificSource>(sources.map((s) => [s.id, s]));
  const stdMap = new Map<string, IranianStandard>();
  for (const std of iranianStandards) {
    if (std.standardNumber) {
      stdMap.set(normalizePersianText(std.standardNumber), std);
    }
  }

  // 1. Ingest PDF document chunks
  for (const pdf of storedPdfs) {
    const parentSource = sourceMap.get(pdf.sourceId);
    const srcType: ScientificSourceType = (parentSource?.sourceType as ScientificSourceType) || 'inso_standard';
    const stdNum = parentSource?.standardNumber;

    for (const chunk of pdf.ragChunks) {
      // Check OCR verification requirement
      if (config.filters.requireHumanVerifiedOcr && chunk.isOcr && !chunk.isVerified) {
        // Exclude unreviewed OCR if strict flag is on
        continue;
      }

      rawCandidates.push({
        id: chunk.id,
        sourceId: chunk.sourceId,
        sourceTitle: chunk.sourceTitle || pdf.meta.title || pdf.fileName,
        sourceType: srcType,
        standardNumber: stdNum || chunk.standardNumber,
        pageNumber: chunk.pageNumber,
        sectionHeading: chunk.sectionHeading,
        text: chunk.text,
        characterCount: chunk.text.length,
        keywordScore: 0,
        semanticScore: 0,
        hybridScore: 0,
        priorityMultiplier: 1,
        finalRankScore: 0,
        isOcr: chunk.isOcr,
        isVerified: chunk.isVerified,
        sourceConfidence: parentSource?.confidenceLevel || (chunk.isVerified ? 'source_backed' : 'unverified'),
        tags: chunk.tags || parentSource?.tags || []
      });
    }
  }

  // 2. Ingest Knowledge Base records as searchable chunks
  for (const record of kbRecords) {
    const firstSource = record.sources && record.sources[0];
    const parentSource = firstSource ? sourceMap.get(firstSource.sourceId) : null;
    const srcType: ScientificSourceType = (parentSource?.sourceType as ScientificSourceType) || 'inso_standard';

    let confidence: ScientificConfidenceLevel = 'unverified';
    if (record.verificationStatus === 'official_regulatory' || record.verificationStatus === 'verified_with_source') {
      confidence = 'verified';
    } else {
      confidence = 'unverified';
    }

    const fullContent = [
      record.title,
      record.englishTitle || '',
      record.summary,
      record.content,
      (record.parameters || []).map((p) => `${p.label}: ${p.value} ${p.unit || ''}`).join(', ')
    ].join('\n');

    rawCandidates.push({
      id: `kb_${record.id}`,
      sourceId: parentSource?.id || `src_kb_${record.id}`,
      sourceTitle: parentSource?.title || record.title,
      sourceType: srcType,
      standardNumber: parentSource?.standardNumber || record.codeOrIdentifier,
      pageNumber: firstSource?.pageNumber ? parseInt(firstSource.pageNumber, 10) || undefined : undefined,
      sectionHeading: `رکورد پایگاه دانش: ${record.title}`,
      text: fullContent,
      characterCount: fullContent.length,
      keywordScore: 0,
      semanticScore: 0,
      hybridScore: 0,
      priorityMultiplier: 1,
      finalRankScore: 0,
      isOcr: false,
      isVerified: true,
      sourceConfidence: confidence,
      tags: record.tags
    });
  }

  // 3. Score and filter candidates
  const scoredChunks: RagRankedChunk[] = [];

  for (const item of rawCandidates) {
    // Filter by Source Type
    if (config.filters.sourceTypes && config.filters.sourceTypes.length > 0) {
      if (!config.filters.sourceTypes.includes(item.sourceType)) {
        continue;
      }
    }

    // Filter by Min Confidence
    if (config.filters.minConfidence && config.filters.minConfidence !== 'all') {
      if (item.sourceConfidence !== config.filters.minConfidence) {
        // Let verified pass always
        if (config.filters.minConfidence === 'source_backed' && item.sourceConfidence === 'unverified') {
          continue;
        }
      }
    }

    // Filter by Standard prefix
    if (config.filters.standardFilter && config.filters.standardFilter.trim()) {
      const qStd = normalizePersianText(config.filters.standardFilter);
      const itemStd = item.standardNumber ? normalizePersianText(item.standardNumber) : '';
      if (!itemStd.includes(qStd)) {
        continue;
      }
    }

    // Keyword Score
    const { score: kwScore, matchedTerms } = calculateKeywordScore(
      queryTokens,
      item.sourceTitle,
      item.text,
      item.standardNumber,
      item.tags
    );

    // Semantic Score
    const semScore = calculateSemanticScore(
      userQuery,
      intent,
      item.sourceTitle,
      item.text,
      item.tags
    );

    // Hybrid Score calculation
    let hybridScore = 0;
    if (config.searchMode === 'keyword') {
      hybridScore = kwScore;
    } else if (config.searchMode === 'semantic') {
      hybridScore = semScore;
    } else {
      // Hybrid mode
      const alpha = config.hybridAlpha ?? 0.55;
      hybridScore = (alpha * semScore) + ((1 - alpha) * kwScore);
    }

    // Skip completely irrelevant items
    if (hybridScore < 0.05 && kwScore < 0.08 && semScore < 0.08) {
      continue;
    }

    // Priority Multiplier from User Configuration
    const priorityMultiplier = config.priorityWeights[item.sourceType] ?? 1.0;

    // Version Awareness & Status Assessment
    let versionMultiplier = 1.0;
    let versionNotice: string | undefined;

    const isVersionAware = config.filters.enableVersionAwareness ?? true;

    if (isVersionAware && item.standardNumber) {
      const normStdNum = normalizePersianText(item.standardNumber);
      const stdRecord = stdMap.get(normStdNum);
      if (stdRecord) {
        if (stdRecord.status === 'obsolete') {
          versionMultiplier = 0.5; // Down-rank obsolete version
          const repl = stdRecord.supersededBy?.standardNumber ? ` و با استاندارد ${stdRecord.supersededBy.standardNumber} جایگزین گردیده است.` : '.';
          versionNotice = `هشدار نسخه: استاندارد ${stdRecord.standardNumber} منسوخ شده است${repl}`;
        } else if (stdRecord.status === 'superseded') {
          versionMultiplier = 0.6;
          versionNotice = `استاندارد ${stdRecord.standardNumber} جایگزین‌شده است (جایگزین: ${stdRecord.supersededBy?.standardNumber || 'نامشخص'}).`;
        } else if (stdRecord.status === 'valid') {
          versionMultiplier = 1.2; // Boost current valid national standard
        }
      }
    }

    // Final Rank Score
    const finalRankScore = hybridScore * priorityMultiplier * versionMultiplier;

    scoredChunks.push({
      ...item,
      keywordScore: Number(kwScore.toFixed(3)),
      semanticScore: Number(semScore.toFixed(3)),
      hybridScore: Number(hybridScore.toFixed(3)),
      priorityMultiplier,
      finalRankScore: Number(finalRankScore.toFixed(3)),
      matchedTerms,
      versionNotice
    });
  }

  // Sort descending by finalRankScore
  scoredChunks.sort((a, b) => b.finalRankScore - a.finalRankScore);

  // Return top K chunks
  const topK = config.topKChunks || 6;
  return scoredChunks.slice(0, topK);
}
