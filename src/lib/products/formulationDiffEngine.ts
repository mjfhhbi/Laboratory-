/**
 * Food Science AI - Formulation Diff & Version Comparison Engine
 * Computes exact stoichiometric, compositional, economic, and allergen changes
 * between two formulation versions (e.g. Formula v1 vs Formula v2 vs Formula v3).
 */

import { FormulationIngredient, FormulationVersion, IngredientFunction } from '../../types/foodProduct';
import { calculateFormulationSummary, INGREDIENT_FUNCTION_LABELS } from './formulationEngine';

export type IngredientDiffStatus = 'added' | 'removed' | 'modified' | 'unchanged';

export interface IngredientDiffItem {
  id: string;
  nameFa: string;
  category: IngredientFunction;
  categoryLabelFa: string;
  status: IngredientDiffStatus;
  basePercentage: number | null;
  targetPercentage: number | null;
  deltaPercentage: number; // target - base
  percentageChangeRatio: number | null; // ((target - base) / base) * 100
  baseDryMatterPercent?: number;
  targetDryMatterPercent?: number;
  baseCostPerKg?: number;
  targetCostPerKg?: number;
  notes?: string;
}

export interface FormulationVersionDiffResult {
  baseVersion: {
    id: string;
    versionCode: string;
    title: string;
  };
  targetVersion: {
    id: string;
    versionCode: string;
    title: string;
  };
  executiveSummaryFa: string;
  changeHighlights: {
    addedCount: number;
    removedCount: number;
    modifiedCount: number;
    unchangedCount: number;
    totalCountTarget: number;
  };
  metricDeltas: {
    totalPercentageDelta: number;
    baseDryMatter: number;
    targetDryMatter: number;
    deltaDryMatter: number;
    baseBrix: number;
    targetBrix: number;
    deltaBrix: number;
    baseCostPerKg: number;
    targetCostPerKg: number;
    deltaCostPerKg: number;
    costChangePercent: number; // e.g. -12.5% (savings)
  };
  items: IngredientDiffItem[];
  allergenChanges: {
    addedAllergens: string[];
    removedAllergens: string[];
  };
}

/**
 * Normalizes an ingredient name for robust comparison
 */
function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
}

/**
 * Computes deep diff between two formulation versions
 */
export function computeFormulationDiff(
  baseFormulation: FormulationVersion,
  targetFormulation: FormulationVersion
): FormulationVersionDiffResult {
  const baseSummary = calculateFormulationSummary(baseFormulation.ingredients);
  const targetSummary = calculateFormulationSummary(targetFormulation.ingredients);

  const baseMap = new Map<string, FormulationIngredient>();
  for (const ing of baseFormulation.ingredients) {
    baseMap.set(normalizeName(ing.nameFa), ing);
  }

  const targetMap = new Map<string, FormulationIngredient>();
  for (const ing of targetFormulation.ingredients) {
    targetMap.set(normalizeName(ing.nameFa), ing);
  }

  const allKeys = Array.from(new Set([...baseMap.keys(), ...targetMap.keys()]));
  const items: IngredientDiffItem[] = [];

  let addedCount = 0;
  let removedCount = 0;
  let modifiedCount = 0;
  let unchangedCount = 0;

  for (const key of allKeys) {
    const baseIng = baseMap.get(key);
    const targetIng = targetMap.get(key);

    if (baseIng && !targetIng) {
      // Removed in target
      removedCount++;
      const cat = baseIng.category;
      items.push({
        id: baseIng.id,
        nameFa: baseIng.nameFa,
        category: cat,
        categoryLabelFa: INGREDIENT_FUNCTION_LABELS[cat]?.titleFa || 'افزودنی',
        status: 'removed',
        basePercentage: Number(baseIng.percentage) || 0,
        targetPercentage: null,
        deltaPercentage: -Number(baseIng.percentage) || 0,
        percentageChangeRatio: -100,
        baseDryMatterPercent: baseIng.dryMatterPercent,
        baseCostPerKg: baseIng.costPerKg,
        notes: baseIng.notes
      });
    } else if (!baseIng && targetIng) {
      // Added in target
      addedCount++;
      const cat = targetIng.category;
      items.push({
        id: targetIng.id,
        nameFa: targetIng.nameFa,
        category: cat,
        categoryLabelFa: INGREDIENT_FUNCTION_LABELS[cat]?.titleFa || 'افزودنی',
        status: 'added',
        basePercentage: null,
        targetPercentage: Number(targetIng.percentage) || 0,
        deltaPercentage: Number(targetIng.percentage) || 0,
        percentageChangeRatio: null,
        targetDryMatterPercent: targetIng.dryMatterPercent,
        targetCostPerKg: targetIng.costPerKg,
        notes: targetIng.notes
      });
    } else if (baseIng && targetIng) {
      // Both exist - compare percentage
      const basePct = Number(baseIng.percentage) || 0;
      const targetPct = Number(targetIng.percentage) || 0;
      const delta = Math.round((targetPct - basePct) * 1000) / 1000;
      const ratio = basePct > 0 ? Math.round(((targetPct - basePct) / basePct) * 1000) / 10 : null;

      const cat = targetIng.category;
      if (Math.abs(delta) > 0.0001) {
        modifiedCount++;
        items.push({
          id: targetIng.id,
          nameFa: targetIng.nameFa,
          category: cat,
          categoryLabelFa: INGREDIENT_FUNCTION_LABELS[cat]?.titleFa || 'افزودنی',
          status: 'modified',
          basePercentage: basePct,
          targetPercentage: targetPct,
          deltaPercentage: delta,
          percentageChangeRatio: ratio,
          baseDryMatterPercent: baseIng.dryMatterPercent,
          targetDryMatterPercent: targetIng.dryMatterPercent,
          baseCostPerKg: baseIng.costPerKg,
          targetCostPerKg: targetIng.costPerKg,
          notes: targetIng.notes || baseIng.notes
        });
      } else {
        unchangedCount++;
        items.push({
          id: targetIng.id,
          nameFa: targetIng.nameFa,
          category: cat,
          categoryLabelFa: INGREDIENT_FUNCTION_LABELS[cat]?.titleFa || 'افزودنی',
          status: 'unchanged',
          basePercentage: basePct,
          targetPercentage: targetPct,
          deltaPercentage: 0,
          percentageChangeRatio: 0,
          baseDryMatterPercent: baseIng.dryMatterPercent,
          targetDryMatterPercent: targetIng.dryMatterPercent,
          baseCostPerKg: baseIng.costPerKg,
          targetCostPerKg: targetIng.costPerKg,
          notes: targetIng.notes
        });
      }
    }
  }

  // Sort items: added first, then modified, removed, then unchanged
  const statusOrder: Record<IngredientDiffStatus, number> = {
    added: 1,
    modified: 2,
    removed: 3,
    unchanged: 4
  };
  items.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  // Metric deltas
  const deltaTotalPct = Math.round((targetSummary.totalPercentage - baseSummary.totalPercentage) * 1000) / 1000;
  const deltaDM = Math.round((targetSummary.totalDryMatterPercent - baseSummary.totalDryMatterPercent) * 100) / 100;
  const deltaBrix = Math.round((targetSummary.estimatedBrix - baseSummary.estimatedBrix) * 100) / 100;
  const deltaCost = Math.round(targetSummary.estimatedCostPerKg - baseSummary.estimatedCostPerKg);
  const costChangePercent = baseSummary.estimatedCostPerKg > 0
    ? Math.round(((targetSummary.estimatedCostPerKg - baseSummary.estimatedCostPerKg) / baseSummary.estimatedCostPerKg) * 1000) / 10
    : 0;

  // Allergen detection
  const baseAllergens = new Set<string>();
  baseFormulation.ingredients.forEach(i => i.allergens?.forEach(a => baseAllergens.add(a)));

  const targetAllergens = new Set<string>();
  targetFormulation.ingredients.forEach(i => i.allergens?.forEach(a => targetAllergens.add(a)));

  const addedAllergens = Array.from(targetAllergens).filter(a => !baseAllergens.has(a));
  const removedAllergens = Array.from(baseAllergens).filter(a => !targetAllergens.has(a));

  // Executive summary in Persian
  const summaryParts: string[] = [];
  if (addedCount > 0) summaryParts.push(`${addedCount} ماده اولیه جدید اضافه شد`);
  if (removedCount > 0) summaryParts.push(`${removedCount} ماده اولیه حذف گردید`);
  if (modifiedCount > 0) summaryParts.push(`درصد ${modifiedCount} جزء فرمولاسیون تعدیل شد`);
  if (costChangePercent < -0.1) {
    summaryParts.push(`هزینه تمام‌شده مواد اولیه ${Math.abs(costChangePercent)}٪ کاهش یافت (صرفه‌جویی)`);
  } else if (costChangePercent > 0.1) {
    summaryParts.push(`هزینه تمام‌شده مواد اولیه ${costChangePercent}٪ افزایش یافت`);
  }
  if (removedAllergens.length > 0) {
    summaryParts.push(`آلرژن‌های (${removedAllergens.join('، ')}) با موفقیت حذف شدند`);
  }

  const executiveSummaryFa = summaryParts.length > 0
    ? `در مقایسه نسخه «${targetFormulation.versionCode}» با نسخه پایه «${baseFormulation.versionCode}»: ${summaryParts.join('؛ ')}.`
    : `هیچ تفاوتی بین دو نسخه فرمولاسیون شناسایی نشد (دو نسخه کاملاً یکسان هستند).`;

  return {
    baseVersion: {
      id: baseFormulation.id,
      versionCode: baseFormulation.versionCode,
      title: baseFormulation.title
    },
    targetVersion: {
      id: targetFormulation.id,
      versionCode: targetFormulation.versionCode,
      title: targetFormulation.title
    },
    executiveSummaryFa,
    changeHighlights: {
      addedCount,
      removedCount,
      modifiedCount,
      unchangedCount,
      totalCountTarget: targetFormulation.ingredients.length
    },
    metricDeltas: {
      totalPercentageDelta: deltaTotalPct,
      baseDryMatter: baseSummary.totalDryMatterPercent,
      targetDryMatter: targetSummary.totalDryMatterPercent,
      deltaDryMatter: deltaDM,
      baseBrix: baseSummary.estimatedBrix,
      targetBrix: targetSummary.estimatedBrix,
      deltaBrix: deltaBrix,
      baseCostPerKg: baseSummary.estimatedCostPerKg,
      targetCostPerKg: targetSummary.estimatedCostPerKg,
      deltaCostPerKg: deltaCost,
      costChangePercent
    },
    items,
    allergenChanges: {
      addedAllergens,
      removedAllergens
    }
  };
}
