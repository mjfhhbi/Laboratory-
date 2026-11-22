/**
 * Food Science AI - RAG Settings & Priority Configuration Storage
 * Part 23 of 30 - Customizable Source Priority & Filter Settings
 */

import { RagConfig, RagPriorityPreset, RagSourcePriorityWeights } from './types';

const RAG_SETTINGS_STORAGE_KEY = 'food_science_ai_rag_config_v1';

export const DEFAULT_PRIORITY_WEIGHTS: Record<RagPriorityPreset, RagSourcePriorityWeights> = {
  // Preset 1: استانداردهای رسمی در بالاترین اولویت (Default)
  standards_first: {
    inso_standard: 2.6,        // استاندارد ملی ایران
    iso_standard: 2.2,         // استاندارد ایزو
    aoac_method: 2.2,          // روش رسمی AOAC
    codex_standard: 2.1,       // استاندارد کدکس
    official_regulatory: 2.0,  // مراجع نظارتی رسمی (سازمان غذا و دارو)
    scientific_paper: 1.4,     // مقالات علمی پژوهشی
    reference_book: 1.3,       // کتب مرجع دانشگاهی
    lab_manual: 1.1,           // راهنماهای آزمایشگاهی
    lecture_handout: 0.9,      // جزوات آموزشی
    lab_file: 0.9,             // فایل‌های آزمایشگاهی
    sds: 0.8                   // برگه SDS
  },

  // Preset 2: کتب دانشگاهی و مقالات علمی در اولویت نخست
  academic_first: {
    scientific_paper: 2.5,
    reference_book: 2.4,
    inso_standard: 1.8,
    iso_standard: 1.8,
    aoac_method: 1.7,
    codex_standard: 1.6,
    official_regulatory: 1.5,
    lab_manual: 1.2,
    lecture_handout: 1.1,
    lab_file: 1.0,
    sds: 0.8
  },

  // Preset 3: مراجع رسمی سازمان غذا و دارو و نهادهای نظارتی
  official_first: {
    official_regulatory: 2.7,
    inso_standard: 2.4,
    codex_standard: 2.2,
    iso_standard: 2.0,
    aoac_method: 1.9,
    scientific_paper: 1.4,
    reference_book: 1.3,
    lab_manual: 1.1,
    lecture_handout: 0.9,
    lab_file: 0.9,
    sds: 0.8
  },

  // Preset 4: وزن‌های سفارشی متوازن
  custom: {
    inso_standard: 2.0,
    iso_standard: 1.9,
    aoac_method: 1.9,
    codex_standard: 1.8,
    official_regulatory: 1.8,
    scientific_paper: 1.5,
    reference_book: 1.4,
    lab_manual: 1.2,
    lecture_handout: 1.0,
    lab_file: 1.0,
    sds: 1.0
  }
};

export const DEFAULT_RAG_CONFIG: RagConfig = {
  enabled: true,
  searchMode: 'hybrid',
  hybridAlpha: 0.55, // 55% Semantic, 45% Keyword
  priorityPreset: 'standards_first',
  priorityWeights: { ...DEFAULT_PRIORITY_WEIGHTS.standards_first },
  filters: {
    sourceTypes: undefined, // all
    productFilter: undefined,
    experimentFilter: undefined,
    standardFilter: undefined,
    minConfidence: 'all',
    requireHumanVerifiedOcr: true
  },
  minEvidenceScore: 35,
  topKChunks: 6
};

/**
 * Loads RAG settings from localStorage (Primary function)
 */
export function loadRagSettings(): RagConfig {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(RAG_SETTINGS_STORAGE_KEY) : null;
    if (!raw) return { ...DEFAULT_RAG_CONFIG };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_RAG_CONFIG,
      ...parsed,
      priorityWeights: {
        ...DEFAULT_RAG_CONFIG.priorityWeights,
        ...(parsed.priorityWeights || {})
      },
      filters: {
        ...DEFAULT_RAG_CONFIG.filters,
        ...(parsed.filters || {})
      }
    };
  } catch {
    return { ...DEFAULT_RAG_CONFIG };
  }
}

/**
 * Saves RAG settings to localStorage (Primary function)
 */
export function saveRagSettings(config: RagConfig): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(RAG_SETTINGS_STORAGE_KEY, JSON.stringify(config));
    }
  } catch (err) {
    console.warn('Failed to save RAG config to localStorage:', err);
  }
}

/**
 * Resets RAG settings to default
 */
export function resetRagSettings(): RagConfig {
  saveRagSettings(DEFAULT_RAG_CONFIG);
  return { ...DEFAULT_RAG_CONFIG };
}

// Aliases for compatibility
export function getRagConfig(): RagConfig {
  return loadRagSettings();
}

export function saveRagConfig(config: RagConfig): void {
  saveRagSettings(config);
}

export function resetRagConfig(): RagConfig {
  return resetRagSettings();
}

export type RagConfiguration = RagConfig;
