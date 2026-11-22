/**
 * Food Science AI - Laboratory Experiments Storage & Repository Engine
 * 
 * Manages full CRUD operations, IndexedDB persistence, multi-criteria filtering,
 * 15 specialized food science domains, scientific source verification,
 * and JSON import/export for authentic lab protocols.
 */

import {
  STORES,
  getItem,
  putItem,
  deleteItem,
  getAllItems
} from './indexedDb';
import {
  FoodExperiment,
  ExperimentDomain,
  ExperimentSearchFilters,
  ExperimentStatistics
} from '../../types/foodExperiment';
import { VERIFIED_BENCHMARK_EXPERIMENTS } from '../../data/experimentsData';

export { VERIFIED_BENCHMARK_EXPERIMENTS };

/**
 * Normalizes an experiment record to guarantee complete 26-field standard template schema.
 */
export function normalizeExperimentRecord(raw: any): FoodExperiment {
  const normTitle = raw.title || raw.titleFa || '';
  const normDomain = (raw.domain || raw.category || 'food_chemistry') as ExperimentDomain;
  const normObjective = raw.objective || raw.purpose || '';

  return {
    id: raw.id || `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    code: raw.code || 'EXP-GEN-000',
    titleFa: normTitle,
    titleEn: raw.titleEn || raw.englishTitle || '',
    domain: normDomain,
    
    // 26-field standard template direct mappings
    title: normTitle,
    category: normDomain,
    product: raw.product || '',
    purpose: normObjective,
    standardReferences: Array.isArray(raw.standardReferences)
      ? raw.standardReferences
      : raw.standardReference
      ? [raw.standardReference]
      : [],
    sourceReferences: Array.isArray(raw.sourceReferences)
      ? raw.sourceReferences
      : Array.isArray(raw.sources)
      ? raw.sources
      : [],
    equipmentRequirements: Array.isArray(raw.equipmentRequirements) ? raw.equipmentRequirements : [],
    reagents: Array.isArray(raw.reagents)
      ? raw.reagents
      : Array.isArray(raw.reagentsAndMaterials)
      ? raw.reagentsAndMaterials
      : [],
    solutionPreparation: raw.solutionPreparation || raw.solutionsPreparation || '',
    acceptanceCriteria: raw.acceptanceCriteria || [],
    commonErrors: Array.isArray(raw.commonErrors)
      ? raw.commonErrors
      : Array.isArray(raw.potentialErrors)
      ? raw.potentialErrors
      : [],
    troubleshooting: Array.isArray(raw.troubleshooting) ? raw.troubleshooting : [],
    safety: Array.isArray(raw.safety)
      ? raw.safety
      : Array.isArray(raw.safetyNotes)
      ? raw.safetyNotes
      : [],
    notes: Array.isArray(raw.notes)
      ? raw.notes
      : raw.customNotes
      ? [raw.customNotes]
      : [],
    version: raw.version || '1.0.0',
    lastVerified: raw.lastVerified || (raw.updatedAt ? raw.updatedAt.split('T')[0] : '2024-05-15'),

    // Core schema fields
    objective: normObjective,
    scope: raw.scope || '',
    principle: raw.principle || '',
    equipment: Array.isArray(raw.equipment) ? raw.equipment : [],
    reagentsAndMaterials: Array.isArray(raw.reagentsAndMaterials)
      ? raw.reagentsAndMaterials
      : Array.isArray(raw.reagents)
      ? raw.reagents
      : [],
    samplePreparation: raw.samplePreparation || '',
    solutionsPreparation: raw.solutionsPreparation || raw.solutionPreparation || '',
    environmentalConditions: raw.environmentalConditions || {
      temperatureRange: 'دمای استاندارد آزمایشگاهی',
      relativeHumidity: '',
      specialNotes: ''
    },
    procedureSteps: Array.isArray(raw.procedureSteps) ? raw.procedureSteps : [],
    calculations: raw.calculations || {
      formulaTitleFa: 'محاسبه نتیجه',
      formulaExpression: '',
      variables: []
    },
    qualityControl: raw.qualityControl || [],
    reporting: raw.reporting || {
      unitOfMeasurement: '',
      decimalPrecision: 2
    },
    potentialErrors: Array.isArray(raw.potentialErrors)
      ? raw.potentialErrors
      : Array.isArray(raw.commonErrors)
      ? raw.commonErrors
      : [],
    safetyNotes: Array.isArray(raw.safetyNotes)
      ? raw.safetyNotes
      : Array.isArray(raw.safety)
      ? raw.safety
      : [],
    standardReference: raw.standardReference || {
      organization: 'Other',
      standardNumber: '',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: false
    },
    sources: Array.isArray(raw.sources)
      ? raw.sources
      : Array.isArray(raw.sourceReferences)
      ? raw.sourceReferences
      : [],
    verificationStatus: raw.verificationStatus || 'unverified_pending_review',
    reliabilityGrade: raw.reliabilityGrade || 'grade_d',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    offlineAvailable: raw.offlineAvailable ?? true,
    isVerifiedProtocol: raw.isVerifiedProtocol ?? (raw.verificationStatus === 'verified_standard'),
    samplePrepMethods: raw.samplePrepMethods,
    qcSpec: raw.qcSpec,
    customNotes: raw.customNotes || '',
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
}

/**
 * Validates an experiment object against strict food science laboratory rules.
 */
export function validateExperimentData(data: Partial<FoodExperiment>): {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
  warnings: Array<{ field: string; message: string }>;
} {
  const errors: Array<{ field: string; message: string }> = [];
  const warningsList: Array<{ field: string; message: string }> = [];

  if (!data.titleFa || data.titleFa.trim() === '') {
    errors.push({ field: 'titleFa', message: 'عنوان فارسی آزمایش الزامی است.' });
  }

  if (!data.code || data.code.trim() === '') {
    errors.push({ field: 'code', message: 'کد شناسایی پروتکل آزمایش (مانند EXP-CHM-001) الزامی است.' });
  }

  if (!data.domain) {
    errors.push({ field: 'domain', message: 'انتخاب حوزه تخصصی آزمایش از بین ۱۵ حوزه الزامی است.' });
  }

  if (!data.objective || data.objective.trim() === '') {
    errors.push({ field: 'objective', message: 'شرح هدف آزمایش الزامی است.' });
  }

  if (!data.principle || data.principle.trim() === '') {
    errors.push({ field: 'principle', message: 'تشریح اصل روش علمی/شیمیایی الزامی است.' });
  }

  // Rule: If marked as verified standard, must have real standard reference and source
  if (data.verificationStatus === 'verified_standard' || data.isVerifiedProtocol) {
    if (!data.standardReference || !data.standardReference.standardNumber || data.standardReference.standardNumber.trim() === '') {
      errors.push({ field: 'standardReference', message: 'برای روش‌های تاییدشده، درج شماره استاندارد مرجع قطعی (مانند INSO یا ISO) الزامی است.' });
    }
    if (!data.sources || data.sources.length === 0) {
      warningsList.push({ field: 'sources', message: 'برای اعتباربخشی کامل روش، ثبت حداقل یک استناد علمی معتبر الزامی است.' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warningsList
  };
}

/**
 * Searches experiments based on multiple criteria.
 */
export async function searchExperiments(filters: ExperimentSearchFilters): Promise<FoodExperiment[]> {
  try {
    let all = await getAllItems<FoodExperiment>(STORES.FOOD_EXPERIMENTS);
    
    // Auto-seed if empty
    if (!all || all.length === 0) {
      await seedInitialVerifiedExperiments();
      all = await getAllItems<FoodExperiment>(STORES.FOOD_EXPERIMENTS);
    }

    return all.map(normalizeExperimentRecord).filter(exp => {
      // 1. Search Query
      if (filters.query && filters.query.trim() !== '') {
        const q = filters.query.toLowerCase().trim();
        const matchTitle = exp.titleFa.toLowerCase().includes(q) || exp.titleEn.toLowerCase().includes(q);
        const matchCode = exp.code.toLowerCase().includes(q);
        const matchObjective = exp.objective.toLowerCase().includes(q);
        const matchPrinciple = exp.principle.toLowerCase().includes(q);
        const matchStd = exp.standardReference?.standardNumber?.toLowerCase().includes(q) ||
          (exp.standardReference?.titleFa && exp.standardReference.titleFa.toLowerCase().includes(q));
        const matchTags = exp.tags && exp.tags.some(t => t.toLowerCase().includes(q));
        const matchEquip = exp.equipment && exp.equipment.some(e => e.name.toLowerCase().includes(q));
        const matchReagents = exp.reagentsAndMaterials && exp.reagentsAndMaterials.some(r => r.name.toLowerCase().includes(q));

        if (!matchTitle && !matchCode && !matchObjective && !matchPrinciple && !matchStd && !matchTags && !matchEquip && !matchReagents) {
          return false;
        }
      }

      // 2. Domain Filter
      if (filters.domain && filters.domain !== 'all') {
        if (exp.domain !== filters.domain) {
          return false;
        }
      }

      // 3. Standard Organization Filter
      if (filters.standardOrganization && filters.standardOrganization !== 'all') {
        if (exp.standardReference?.organization !== filters.standardOrganization) {
          return false;
        }
      }

      // 4. Verification Status
      if (filters.verificationStatus && filters.verificationStatus !== 'all') {
        if (exp.verificationStatus !== filters.verificationStatus) {
          return false;
        }
      }

      // 5. Reliability Grade
      if (filters.reliabilityGrade && filters.reliabilityGrade !== 'all') {
        if (exp.reliabilityGrade !== filters.reliabilityGrade) {
          return false;
        }
      }

      // 6. Offline Only
      if (filters.offlineOnly) {
        if (!exp.offlineAvailable) {
          return false;
        }
      }

      // 7. Verified Only
      if (filters.verifiedOnly) {
        if (!exp.isVerifiedProtocol && exp.verificationStatus !== 'verified_standard') {
          return false;
        }
      }

      return true;
    });
  } catch (error) {
    console.error('Failed to search experiments from IndexedDB:', error);
    return VERIFIED_BENCHMARK_EXPERIMENTS;
  }
}

/**
 * Gets a single experiment by ID.
 */
export async function getExperimentById(id: string): Promise<FoodExperiment | null> {
  try {
    const item = await getItem<FoodExperiment>(STORES.FOOD_EXPERIMENTS, id);
    if (item) return normalizeExperimentRecord(item);
    const fallback = VERIFIED_BENCHMARK_EXPERIMENTS.find(e => e.id === id);
    return fallback ? normalizeExperimentRecord(fallback) : null;
  } catch (error) {
    console.error(`Failed to get experiment ${id}:`, error);
    const fallback = VERIFIED_BENCHMARK_EXPERIMENTS.find(e => e.id === id);
    return fallback ? normalizeExperimentRecord(fallback) : null;
  }
}

/**
 * Saves or updates an experiment.
 */
export async function saveExperiment(experiment: FoodExperiment): Promise<void> {
  try {
    const record: FoodExperiment = {
      ...normalizeExperimentRecord(experiment),
      updatedAt: new Date().toISOString()
    };
    await putItem(STORES.FOOD_EXPERIMENTS, record);
  } catch (error) {
    console.error('Failed to save experiment:', error);
    throw error;
  }
}

/**
 * Deletes an experiment by ID.
 */
export async function deleteExperiment(id: string): Promise<void> {
  try {
    await deleteItem(STORES.FOOD_EXPERIMENTS, id);
  } catch (error) {
    console.error(`Failed to delete experiment ${id}:`, error);
    throw error;
  }
}

/**
 * Seeds initial benchmark verified experiments into IndexedDB.
 */
export async function seedInitialVerifiedExperiments(): Promise<void> {
  try {
    for (const exp of VERIFIED_BENCHMARK_EXPERIMENTS) {
      const existing = await getItem<FoodExperiment>(STORES.FOOD_EXPERIMENTS, exp.id);
      if (!existing) {
        await putItem(STORES.FOOD_EXPERIMENTS, exp);
      }
    }
  } catch (error) {
    console.error('Failed to seed verified benchmark experiments:', error);
  }
}

/**
 * Resets all experiments to the official verified benchmark set.
 */
export async function resetToDefaultExperiments(): Promise<void> {
  try {
    for (const exp of VERIFIED_BENCHMARK_EXPERIMENTS) {
      await putItem(STORES.FOOD_EXPERIMENTS, exp);
    }
  } catch (error) {
    console.error('Failed to reset experiments:', error);
    throw error;
  }
}

/**
 * Calculates statistical overview of experiments.
 */
export async function getExperimentsStatistics(): Promise<ExperimentStatistics> {
  try {
    let items = await getAllItems<FoodExperiment>(STORES.FOOD_EXPERIMENTS);
    if (!items || items.length === 0) {
      await seedInitialVerifiedExperiments();
      items = await getAllItems<FoodExperiment>(STORES.FOOD_EXPERIMENTS);
    }

    const domainsDistribution: Record<ExperimentDomain, number> = {
      food_chemistry: 0,
      microbiology: 0,
      food_physics: 0,
      quality_control: 0,
      sensory_evaluation: 0,
      food_analysis: 0,
      packaging: 0,
      oils_fats: 0,
      dairy: 0,
      cereals: 0,
      meat_products: 0,
      beverages: 0,
      fruits_vegetables: 0,
      canned_foods: 0,
      other_food_products: 0
    };

    const standardsDistribution: Record<string, number> = {};
    let verifiedStandardsCount = 0;
    let offlineCount = 0;

    for (const exp of items) {
      if (exp.domain && domainsDistribution[exp.domain] !== undefined) {
        domainsDistribution[exp.domain]++;
      }
      if (exp.standardReference?.organization) {
        const org = exp.standardReference.organization;
        standardsDistribution[org] = (standardsDistribution[org] || 0) + 1;
      }
      if (exp.isVerifiedProtocol || exp.verificationStatus === 'verified_standard') {
        verifiedStandardsCount++;
      }
      if (exp.offlineAvailable) {
        offlineCount++;
      }
    }

    return {
      total: items.length,
      totalExperiments: items.length,
      verifiedStandardsCount,
      insoStandardsCount: standardsDistribution['INSO'] || standardsDistribution['ISIRI'] || 0,
      domainsDistribution,
      domainCounts: domainsDistribution,
      standardsDistribution,
      offlineCount
    };
  } catch (error) {
    console.error('Failed to compute experiment statistics:', error);
    const defaultDomains = {
      food_chemistry: 1,
      microbiology: 1,
      food_physics: 1,
      quality_control: 1,
      sensory_evaluation: 1,
      food_analysis: 1,
      packaging: 1,
      oils_fats: 1,
      dairy: 1,
      cereals: 1,
      meat_products: 1,
      beverages: 1,
      fruits_vegetables: 1,
      canned_foods: 1,
      other_food_products: 1
    };
    return {
      total: VERIFIED_BENCHMARK_EXPERIMENTS.length,
      totalExperiments: VERIFIED_BENCHMARK_EXPERIMENTS.length,
      verifiedStandardsCount: VERIFIED_BENCHMARK_EXPERIMENTS.length,
      insoStandardsCount: 12,
      domainsDistribution: defaultDomains,
      domainCounts: defaultDomains,
      standardsDistribution: {
        INSO: 12,
        ASTM: 1,
        AOAC: 1
      },
      offlineCount: VERIFIED_BENCHMARK_EXPERIMENTS.length
    };
  }
}

export const getExperimentStatistics = getExperimentsStatistics;

/**
 * Gets all experiments from IndexedDB.
 */
export async function getAllExperiments(): Promise<FoodExperiment[]> {
  try {
    let items = await getAllItems<FoodExperiment>(STORES.FOOD_EXPERIMENTS);
    if (!items || items.length === 0) {
      await seedInitialVerifiedExperiments();
      items = await getAllItems<FoodExperiment>(STORES.FOOD_EXPERIMENTS);
    }
    return items.map(normalizeExperimentRecord);
  } catch (err) {
    console.error('Failed to get all experiments:', err);
    return VERIFIED_BENCHMARK_EXPERIMENTS;
  }
}

/**
 * Exports all experiments to a JSON string.
 */
export async function exportExperimentsToJSON(): Promise<string> {
  const items = await getAllExperiments();
  return JSON.stringify(items, null, 2);
}

/**
 * Imports experiments from a JSON string.
 */
export async function importExperimentsFromJSON(jsonString: string): Promise<number> {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed)) {
    throw new Error('فایل ورودی باید آرایه‌ای از پروتکل‌های آزمایشگاهی باشد.');
  }

  let count = 0;
  for (const raw of parsed) {
    const exp = normalizeExperimentRecord(raw);
    await saveExperiment(exp);
    count++;
  }
  return count;
}
