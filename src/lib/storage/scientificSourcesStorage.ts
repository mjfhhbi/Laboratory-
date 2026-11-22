/**
 * Food Science AI - Unified Scientific Sources Storage & Linkage Engine
 * Part 20 of 20 - Source Management System
 */

import { STORES, getItem, putItem, deleteItem, getAllItems } from './indexedDb';
import { 
  UnifiedScientificSource, 
  ScientificSourceType, 
  ScientificConfidenceLevel,
  ScientificDiscrepancy 
} from '../../types/scientificSource';
import { 
  MASTER_SCIENTIFIC_SOURCES, 
  SCIENTIFIC_DISCREPANCIES_DATABASE,
  findSourceByStandardNumber 
} from '../../data/scientificSourcesRegistry';

const DISCREPANCIES_KEY = 'foodscience_scientific_discrepancies';

/**
 * Initializes and fetches all scientific sources from IndexedDB.
 * If IndexedDB has no sources, seeds with the MASTER_SCIENTIFIC_SOURCES registry.
 */
export async function getAllUnifiedSources(): Promise<UnifiedScientificSource[]> {
  try {
    const existing = await getAllItems<UnifiedScientificSource>(STORES.SCIENTIFIC_SOURCES);
    
    if (!existing || existing.length === 0) {
      // Seed initial verified scientific sources
      for (const src of MASTER_SCIENTIFIC_SOURCES) {
        await putItem<UnifiedScientificSource>(STORES.SCIENTIFIC_SOURCES, src);
      }
      return [...MASTER_SCIENTIFIC_SOURCES];
    }

    // Merge any missing master sources
    const existingIds = new Set(existing.map((s) => s.id));
    const missing = MASTER_SCIENTIFIC_SOURCES.filter((s) => !existingIds.has(s.id));
    
    if (missing.length > 0) {
      for (const m of missing) {
        await putItem<UnifiedScientificSource>(STORES.SCIENTIFIC_SOURCES, m);
        existing.push(m);
      }
    }

    return existing.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.error('Failed to get unified scientific sources from storage:', err);
    return [...MASTER_SCIENTIFIC_SOURCES];
  }
}

export async function getUnifiedSourceById(id: string): Promise<UnifiedScientificSource | null> {
  const src = await getItem<UnifiedScientificSource>(STORES.SCIENTIFIC_SOURCES, id);
  if (src) return src;
  return MASTER_SCIENTIFIC_SOURCES.find((s) => s.id === id) || null;
}

export async function saveUnifiedSource(source: UnifiedScientificSource): Promise<UnifiedScientificSource> {
  const normalized: UnifiedScientificSource = {
    ...source,
    updatedAt: new Date().toISOString()
  };
  await putItem<UnifiedScientificSource>(STORES.SCIENTIFIC_SOURCES, normalized);
  return normalized;
}

export async function createUnifiedSource(
  params: Omit<UnifiedScientificSource, 'id' | 'createdAt' | 'updatedAt'>
): Promise<UnifiedScientificSource> {
  const id = 'src_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();

  const newSource: UnifiedScientificSource = {
    ...params,
    id,
    createdAt: now,
    updatedAt: now,
    linkedEntities: params.linkedEntities || {
      testMethodsCount: 0,
      formulasCount: 0,
      limitsCount: 0,
      productsCount: 0
    }
  };

  await putItem<UnifiedScientificSource>(STORES.SCIENTIFIC_SOURCES, newSource);
  return newSource;
}

export async function deleteUnifiedSource(id: string): Promise<void> {
  await deleteItem(STORES.SCIENTIFIC_SOURCES, id);
}

/**
 * Discrepancy Records Management
 */
export async function getAllDiscrepancies(): Promise<ScientificDiscrepancy[]> {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DISCREPANCIES_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return [...SCIENTIFIC_DISCREPANCIES_DATABASE];
}

export async function saveDiscrepancy(discrepancy: ScientificDiscrepancy): Promise<void> {
  const list = await getAllDiscrepancies();
  const idx = list.findIndex((d) => d.id === discrepancy.id);
  if (idx >= 0) {
    list[idx] = discrepancy;
  } else {
    list.unshift(discrepancy);
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(DISCREPANCIES_KEY, JSON.stringify(list));
  }
}

/**
 * Resolves or searches sources matching a scientific query, standard number, or citation
 */
export async function searchUnifiedSources(query: string): Promise<UnifiedScientificSource[]> {
  const all = await getAllUnifiedSources();
  if (!query || !query.trim()) return all;

  const q = query.toLowerCase().trim();
  return all.filter((s) => {
    return (
      s.title.toLowerCase().includes(q) ||
      (s.englishTitle && s.englishTitle.toLowerCase().includes(q)) ||
      s.authorOrOrganization.toLowerCase().includes(q) ||
      (s.standardNumber && s.standardNumber.toLowerCase().includes(q)) ||
      s.country.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q)) ||
      (s.notes && s.notes.toLowerCase().includes(q))
    );
  });
}

/**
 * Filter sources by Source Type and/or Confidence Level
 */
export async function filterUnifiedSources(filters: {
  sourceType?: ScientificSourceType | 'all';
  confidenceLevel?: ScientificConfidenceLevel | 'all';
  query?: string;
}): Promise<UnifiedScientificSource[]> {
  let list = await getAllUnifiedSources();

  if (filters.sourceType && filters.sourceType !== 'all') {
    list = list.filter((s) => s.sourceType === filters.sourceType);
  }

  if (filters.confidenceLevel && filters.confidenceLevel !== 'all') {
    list = list.filter((s) => s.confidenceLevel === filters.confidenceLevel);
  }

  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    list = list.filter((s) => {
      return (
        s.title.toLowerCase().includes(q) ||
        (s.englishTitle && s.englishTitle.toLowerCase().includes(q)) ||
        s.authorOrOrganization.toLowerCase().includes(q) ||
        (s.standardNumber && s.standardNumber.toLowerCase().includes(q)) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  return list;
}
