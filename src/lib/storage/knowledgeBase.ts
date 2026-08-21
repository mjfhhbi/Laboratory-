/**
 * Food Science AI - Knowledge Base Storage Repository
 * 
 * Provides typed, offline-ready operations for 10-category Knowledge Base Records,
 * Scientific Source linking, verification status auditing, search/filter queries,
 * and JSON Bundle Import/Export.
 */

import {
  STORES,
  getItem,
  putItem,
  deleteItem,
  getAllItems,
  getByIndex,
  countItems,
  clearStore
} from './indexedDb';
import {
  KnowledgeBaseRecord,
  ScientificSource,
  KnowledgeCategory,
  KnowledgeSearchFilters,
  KnowledgeValidationResult,
  KnowledgeBaseBundle,
  VerificationStatus
} from '../../types/knowledgeBase';

// ==========================================
// 1. Scientific Sources Repository
// ==========================================

export async function getAllSources(): Promise<ScientificSource[]> {
  try {
    const list = await getAllItems<ScientificSource>(STORES.SCIENTIFIC_SOURCES);
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    console.error('Failed to get scientific sources:', error);
    return [];
  }
}

export async function getSourceById(id: string): Promise<ScientificSource | null> {
  return getItem<ScientificSource>(STORES.SCIENTIFIC_SOURCES, id);
}

export async function saveSource(source: ScientificSource): Promise<ScientificSource> {
  const normalized: ScientificSource = {
    ...source,
    updatedAt: new Date().toISOString()
  };
  await putItem<ScientificSource>(STORES.SCIENTIFIC_SOURCES, normalized);
  return normalized;
}

export async function createSource(params: Omit<ScientificSource, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScientificSource> {
  const newSource: ScientificSource = {
    ...params,
    id: 'src_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await putItem<ScientificSource>(STORES.SCIENTIFIC_SOURCES, newSource);
  return newSource;
}

export async function deleteSource(id: string): Promise<void> {
  await deleteItem(STORES.SCIENTIFIC_SOURCES, id);
}

// ==========================================
// 2. Knowledge Base Records Repository
// ==========================================

export async function getAllKnowledgeRecords(): Promise<KnowledgeBaseRecord[]> {
  try {
    const list = await getAllItems<KnowledgeBaseRecord>(STORES.KNOWLEDGE_RECORDS);
    return list.sort((a, b) => new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime());
  } catch (error) {
    console.error('Failed to get knowledge records:', error);
    return [];
  }
}

export async function getKnowledgeRecordById(id: string): Promise<KnowledgeBaseRecord | null> {
  return getItem<KnowledgeBaseRecord>(STORES.KNOWLEDGE_RECORDS, id);
}

export async function getKnowledgeRecordsByCategory(category: KnowledgeCategory): Promise<KnowledgeBaseRecord[]> {
  try {
    return await getByIndex<KnowledgeBaseRecord>(STORES.KNOWLEDGE_RECORDS, 'category', category);
  } catch (error) {
    console.error(`Failed to get records for category ${category}:`, error);
    return [];
  }
}

export async function saveKnowledgeRecord(record: KnowledgeBaseRecord): Promise<KnowledgeBaseRecord> {
  // Scientific integrity check:
  // If record has no sources, it CANNOT be saved as 'verified_with_source' or 'official_regulatory'
  const hasValidSources = record.sources && Array.isArray(record.sources) && record.sources.length > 0;
  let status = record.verificationStatus;
  
  if (!hasValidSources && status === 'verified_with_source') {
    console.warn('[Scientific Integrity] Demoting record to unverified_pending_review because no sources were cited.');
    status = 'unverified_pending_review';
  }

  const normalized: KnowledgeBaseRecord = {
    ...record,
    verificationStatus: status,
    metadata: {
      ...record.metadata,
      updatedAt: new Date().toISOString(),
      schemaVersion: '2.0.0'
    }
  };

  await putItem<KnowledgeBaseRecord>(STORES.KNOWLEDGE_RECORDS, normalized);
  return normalized;
}

export async function createKnowledgeRecord(
  params: Omit<KnowledgeBaseRecord, 'id' | 'metadata'> & { authorOrImportSource?: string }
): Promise<KnowledgeBaseRecord> {
  const id = 'kbr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();

  const hasValidSources = params.sources && Array.isArray(params.sources) && params.sources.length > 0;
  let status = params.verificationStatus;
  if (!hasValidSources && status === 'verified_with_source') {
    status = 'unverified_pending_review';
  }

  const record: KnowledgeBaseRecord = {
    ...params,
    id,
    verificationStatus: status,
    offlineAvailable: params.offlineAvailable ?? true,
    metadata: {
      createdAt: now,
      updatedAt: now,
      version: '1.0.0',
      schemaVersion: '2.0.0',
      authorOrImportSource: params.authorOrImportSource || 'Food Science AI Core'
    }
  };

  await putItem<KnowledgeBaseRecord>(STORES.KNOWLEDGE_RECORDS, record);
  return record;
}

export async function deleteKnowledgeRecord(id: string): Promise<void> {
  await deleteItem(STORES.KNOWLEDGE_RECORDS, id);
}

// ==========================================
// 3. Search, Filter & Hydration Engine
// ==========================================

export async function searchKnowledgeRecords(filters: KnowledgeSearchFilters): Promise<KnowledgeBaseRecord[]> {
  const all = await getAllKnowledgeRecords();
  const q = (filters.query || '').trim().toLowerCase();

  return all.filter((record) => {
    // 1. Category Filter
    if (filters.category && filters.category !== 'all' && record.category !== filters.category) {
      return false;
    }

    // 2. Verification Status Filter
    if (filters.verificationStatus && filters.verificationStatus !== 'all' && record.verificationStatus !== filters.verificationStatus) {
      return false;
    }

    // 3. Source ID filter
    if (filters.sourceId && !record.sources.some((s) => s.sourceId === filters.sourceId)) {
      return false;
    }

    // 4. Food Category Filter
    if (filters.foodCategory && filters.foodCategory !== 'all') {
      if (!record.applicableFoodCategories || !record.applicableFoodCategories.includes(filters.foodCategory)) {
        return false;
      }
    }

    // 5. Tag Filter
    if (filters.tag && !record.tags.some((t) => t.toLowerCase() === filters.tag?.toLowerCase())) {
      return false;
    }

    // 6. Offline Only Filter
    if (filters.offlineOnly && !record.offlineAvailable) {
      return false;
    }

    // 7. Full Text Query Matching
    if (q) {
      const matchTitle = record.title.toLowerCase().includes(q);
      const matchEnTitle = record.englishTitle ? record.englishTitle.toLowerCase().includes(q) : false;
      const matchCode = record.codeOrIdentifier ? record.codeOrIdentifier.toLowerCase().includes(q) : false;
      const matchSummary = record.summary.toLowerCase().includes(q);
      const matchContent = record.content.toLowerCase().includes(q);
      const matchTags = record.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchParams = record.parameters?.some(
        (p) => p.label.toLowerCase().includes(q) || String(p.value).toLowerCase().includes(q)
      );

      if (!matchTitle && !matchEnTitle && !matchCode && !matchSummary && !matchContent && !matchTags && !matchParams) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Hydrated Record with full Scientific Source objects attached to citations
 */
export interface HydratedKnowledgeRecord extends KnowledgeBaseRecord {
  hydratedSources: Array<{
    citation: KnowledgeBaseRecord['sources'][0];
    source: ScientificSource | null;
  }>;
}

export async function getHydratedKnowledgeRecord(id: string): Promise<HydratedKnowledgeRecord | null> {
  const record = await getKnowledgeRecordById(id);
  if (!record) return null;

  const sourcesList = await getAllSources();
  const sourceMap = new Map(sourcesList.map((s) => [s.id, s]));

  const hydratedSources = record.sources.map((citation) => ({
    citation,
    source: sourceMap.get(citation.sourceId) || null
  }));

  return {
    ...record,
    hydratedSources
  };
}

/**
 * Checks if a record has scientific verification (at least one valid source)
 */
export function isRecordScientificallyVerified(record: KnowledgeBaseRecord): boolean {
  return (
    (record.verificationStatus === 'verified_with_source' || record.verificationStatus === 'official_regulatory') &&
    Array.isArray(record.sources) &&
    record.sources.length > 0
  );
}

// ==========================================
// 4. Validation, Import & Export Bundle
// ==========================================

export function validateKnowledgeRecordData(data: Partial<KnowledgeBaseRecord>): KnowledgeValidationResult {
  const errors: Array<{ field: string; message: string }> = [];
  const warnings: Array<{ field: string; message: string }> = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push({ field: 'title', message: 'عنوان رکورد الزامی است.' });
  }

  if (!data.category) {
    errors.push({ field: 'category', message: 'دسته‌بندی اصلی دانش الزامی است.' });
  }

  if (!data.summary || typeof data.summary !== 'string') {
    errors.push({ field: 'summary', message: 'خلاصه علمی رکورد الزامی است.' });
  }

  if (!data.content || typeof data.content !== 'string') {
    errors.push({ field: 'content', message: 'محتوای علمی تفصیلی رکورد الزامی است.' });
  }

  if (
    (data.verificationStatus === 'verified_with_source' || data.verificationStatus === 'official_regulatory') &&
    (!data.sources || data.sources.length === 0)
  ) {
    errors.push({
      field: 'sources',
      message: 'برای رکوردهای تأییدشده، حداقل یک ارجاع به منبع علمی معتبر الزامی است.'
    });
  }

  if (!data.sources || data.sources.length === 0) {
    warnings.push({
      field: 'sources',
      message: 'رکورد بدون منبع مستند است و با برچسب «در انتظار بررسی» ذخیره می‌شود.'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Exports complete Knowledge Base & Sources bundle as JSON string
 */
export async function exportKnowledgeBundle(): Promise<string> {
  const [sources, records] = await Promise.all([
    getAllSources(),
    getAllKnowledgeRecords()
  ]);

  const bundle: KnowledgeBaseBundle = {
    bundleVersion: '1.0',
    exportedAt: new Date().toISOString(),
    application: 'Food Science AI',
    schemaVersion: '2.0.0',
    description: 'Food Science & Engineering Knowledge Base Data Bundle',
    sources,
    records
  };

  return JSON.stringify(bundle, null, 2);
}

/**
 * Imports a Knowledge Base Bundle (validating schemas before saving)
 */
export async function importKnowledgeBundle(
  jsonString: string,
  options?: { overwrite?: boolean }
): Promise<{ success: boolean; importedRecords: number; importedSources: number; errors: string[] }> {
  const errors: string[] = [];
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { success: false, importedRecords: 0, importedSources: 0, errors: ['فرمت فایل JSON نامعتبر است.'] };
  }

  const bundle = parsed as Partial<KnowledgeBaseBundle>;

  if (!bundle.schemaVersion && !bundle.records && !bundle.sources) {
    return {
      success: false,
      importedRecords: 0,
      importedSources: 0,
      errors: ['ساختار فایل با الگوهای KnowledgeBaseBundle منطبق نمی‌باشد.']
    };
  }

  let importedSources = 0;
  let importedRecords = 0;

  // 1. Import Sources first
  if (Array.isArray(bundle.sources)) {
    for (const src of bundle.sources) {
      if (src.id && src.title && src.organizationOrPublisher) {
        try {
          await saveSource(src as ScientificSource);
          importedSources++;
        } catch (e) {
          errors.push(`خطا در ذخیره منبع ${src.id}: ${(e as Error).message}`);
        }
      }
    }
  }

  // 2. Import Records
  if (Array.isArray(bundle.records)) {
    for (const rec of bundle.records) {
      const validation = validateKnowledgeRecordData(rec as KnowledgeBaseRecord);
      if (validation.isValid) {
        try {
          await saveKnowledgeRecord(rec as KnowledgeBaseRecord);
          importedRecords++;
        } catch (e) {
          errors.push(`خطا در ذخیره رکورد ${rec.id}: ${(e as Error).message}`);
        }
      } else {
        errors.push(`اعتبارسنجی رکورد «${rec.title || 'بدون عنوان'}» ناموفق بود: ${validation.errors.map(e => e.message).join('، ')}`);
      }
    }
  }

  return {
    success: errors.length === 0 || importedRecords > 0 || importedSources > 0,
    importedRecords,
    importedSources,
    errors
  };
}

/**
 * Knowledge Base Statistics
 */
export async function getKnowledgeBaseStats(): Promise<{
  totalRecords: number;
  totalSources: number;
  byCategory: Record<KnowledgeCategory, number>;
  byVerification: Record<VerificationStatus, number>;
}> {
  const records = await getAllKnowledgeRecords();
  const sources = await getAllSources();

  const byCategory: Record<KnowledgeCategory, number> = {
    experiments: 0,
    standards: 0,
    food_products: 0,
    raw_materials: 0,
    equipment: 0,
    test_methods: 0,
    formulas: 0,
    common_errors: 0,
    scientific_definitions: 0,
    references: 0
  };

  const byVerification: Record<VerificationStatus, number> = {
    official_regulatory: 0,
    verified_with_source: 0,
    unverified_pending_review: 0
  };

  for (const r of records) {
    if (byCategory[r.category] !== undefined) {
      byCategory[r.category]++;
    }
    if (byVerification[r.verificationStatus] !== undefined) {
      byVerification[r.verificationStatus]++;
    }
  }

  return {
    totalRecords: records.length,
    totalSources: sources.length,
    byCategory,
    byVerification
  };
}
