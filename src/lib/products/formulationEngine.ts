/**
 * Food Science AI - Formulation & Scaling Engine
 * Accurate stoichiometric and compositional calculations for food product development
 */

import {
  FormulationIngredient,
  FormulationVersion,
  ScaleConversionResult,
  IngredientFunction
} from '../../types/foodProduct';

export const INGREDIENT_FUNCTION_LABELS: Record<IngredientFunction, { titleFa: string; color: string }> = {
  solvent_base: { titleFa: 'پایه حلال / آب / شیر', color: 'blue' },
  protein_source: { titleFa: 'منبع پروتئین', color: 'emerald' },
  fat_lipid: { titleFa: 'روغن و چربی', color: 'amber' },
  carbohydrate_sugar: { titleFa: 'شیرین‌کننده و قند', color: 'orange' },
  stabilizer_hydrocolloid: { titleFa: 'پایدارکننده و هیدروکلوئید', color: 'purple' },
  emulsifier: { titleFa: 'امولسیفایر', color: 'pink' },
  acidulant_ph: { titleFa: 'اسیدولانت و تنظیم‌کننده pH', color: 'red' },
  preservative_antioxidant: { titleFa: 'نگه‌دارنده و آنتی‌اکسیدان', color: 'teal' },
  flavor_aroma: { titleFa: 'طعم‌دهنده و اسانس', color: 'indigo' },
  colorant: { titleFa: 'رنگ خوراکی', color: 'rose' },
  fortifier_vitamin: { titleFa: 'ریز‌مغذی و فراسودمند', color: 'cyan' },
  salt_mineral: { titleFa: 'نمک و مواد معدنی', color: 'stone' },
  other: { titleFa: 'سایر افزودنی‌ها', color: 'gray' }
};

/**
 * Calculates total percentage, dry matter, Brix and estimated batch cost for a formulation
 */
export function calculateFormulationSummary(ingredients: FormulationIngredient[]): {
  totalPercentage: number;
  totalDryMatterPercent: number;
  estimatedBrix: number;
  estimatedCostPerKg: number;
  is100Percent: boolean;
  differenceFrom100: number;
  warnings: string[];
  categoryBreakdown: Array<{ category: IngredientFunction; labelFa: string; percentage: number; color: string }>;
} {
  let totalPercentage = 0;
  let totalDryMatterPercent = 0;
  let estimatedBrix = 0;
  let totalCostFor100Kg = 0;
  const categoryTotals: Partial<Record<IngredientFunction, number>> = {};

  for (const ing of ingredients) {
    const pct = Number(ing.percentage) || 0;
    totalPercentage += pct;

    // Dry matter contribution: (% ingredient * % dry matter of that ingredient) / 100
    const dm = ing.dryMatterPercent !== undefined ? Number(ing.dryMatterPercent) : 100;
    totalDryMatterPercent += (pct * dm) / 100;

    // Brix contribution
    if (ing.brixContribution !== undefined) {
      estimatedBrix += (pct * Number(ing.brixContribution)) / 100;
    } else if (ing.category === 'carbohydrate_sugar') {
      // Sugars contribute ~100% of their dry weight to Brix
      estimatedBrix += (pct * dm) / 100;
    }

    // Cost contribution
    if (ing.costPerKg) {
      totalCostFor100Kg += pct * Number(ing.costPerKg);
    }

    categoryTotals[ing.category] = (categoryTotals[ing.category] || 0) + pct;
  }

  // Rounding to 3 decimal places for stability
  totalPercentage = Math.round(totalPercentage * 1000) / 1000;
  totalDryMatterPercent = Math.round(totalDryMatterPercent * 100) / 100;
  estimatedBrix = Math.round(estimatedBrix * 100) / 100;
  
  const estimatedCostPerKg = totalPercentage > 0
    ? Math.round((totalCostFor100Kg / totalPercentage) * 100) / 100
    : 0;

  const differenceFrom100 = Math.round((totalPercentage - 100) * 1000) / 1000;
  const is100Percent = Math.abs(differenceFrom100) < 0.001;

  const warnings: string[] = [];
  if (ingredients.length === 0) {
    warnings.push('فرمولاسیون فاقد هرگونه ماده اولیه است.');
  } else if (!is100Percent) {
    if (differenceFrom100 > 0) {
      warnings.push(`مجموع درصدهای فرمولاسیون ${totalPercentage}% است (${Math.abs(differenceFrom100)}% بیشتر از ۱۰۰٪). فرمول باید دقیقاً ۱۰۰.۰۰٪ باشد.`);
    } else {
      warnings.push(`مجموع درصدهای فرمولاسیون ${totalPercentage}% است (${Math.abs(differenceFrom100)}% کمتر از ۱۰۰٪). فرمول باید دقیقاً ۱۰۰.۰۰٪ باشد.`);
    }
  }

  // Category breakdown list
  const categoryBreakdown = Object.entries(categoryTotals).map(([cat, pct]) => {
    const categoryKey = cat as IngredientFunction;
    const meta = INGREDIENT_FUNCTION_LABELS[categoryKey] || { titleFa: 'نامشخص', color: 'gray' };
    return {
      category: categoryKey,
      labelFa: meta.titleFa,
      percentage: Math.round((pct as number) * 100) / 100,
      color: meta.color
    };
  }).sort((a, b) => b.percentage - a.percentage);

  return {
    totalPercentage,
    totalDryMatterPercent,
    estimatedBrix,
    estimatedCostPerKg,
    is100Percent,
    differenceFrom100,
    warnings,
    categoryBreakdown
  };
}

/**
 * Normalizes all ingredients to hit exactly 100.00%
 * If a solvent/base ingredient is selected, it absorbs the remainder.
 * Otherwise, scales all ingredients proportionally.
 */
export function normalizeIngredientsTo100Percent(
  ingredients: FormulationIngredient[],
  solventIngredientId?: string
): FormulationIngredient[] {
  if (ingredients.length === 0) return [];

  const currentSum = ingredients.reduce((sum, ing) => sum + (Number(ing.percentage) || 0), 0);
  if (currentSum <= 0) return ingredients;

  // Case 1: Adjust target solvent/water
  if (solventIngredientId) {
    const solventIndex = ingredients.findIndex(ing => ing.id === solventIngredientId);
    if (solventIndex !== -1) {
      const otherSum = ingredients
        .filter((_, idx) => idx !== solventIndex)
        .reduce((sum, ing) => sum + (Number(ing.percentage) || 0), 0);
      
      const newSolventPct = Math.max(0, Math.round((100 - otherSum) * 1000) / 1000);
      
      return ingredients.map((ing, idx) => {
        if (idx === solventIndex) {
          return { ...ing, percentage: newSolventPct };
        }
        return ing;
      });
    }
  }

  // Case 2: Proportional scaling
  const scaleFactor = 100 / currentSum;
  return ingredients.map(ing => {
    const scaled = Math.round((Number(ing.percentage) * scaleFactor) * 1000) / 1000;
    return { ...ing, percentage: scaled };
  });
}

/**
 * Calculates Batch Weight, scaling from grams to tons, including process loss factors
 */
export function calculateBatchScaling(
  ingredients: FormulationIngredient[],
  targetBatchWeightKg: number,
  processLossPercent: number = 0
): ScaleConversionResult {
  const targetKg = Math.max(0.001, targetBatchWeightKg);
  const lossPct = Math.max(0, Math.min(50, processLossPercent));
  
  // Total formulation input weight required to achieve target net output after shrinkage/loss
  const rawInputBatchKg = lossPct > 0
    ? targetKg / (1 - lossPct / 100)
    : targetKg;
  
  const processLossKg = rawInputBatchKg - targetKg;

  const currentSummary = calculateFormulationSummary(ingredients);
  const sumPercent = currentSummary.totalPercentage > 0 ? currentSummary.totalPercentage : 100;

  let totalBatchCost = 0;

  const scaledIngredients = ingredients.map(ing => {
    const pct = Number(ing.percentage) || 0;
    // Normalize percentage against total formulation sum
    const normalizedShare = pct / sumPercent;
    const requiredWeightKg = normalizedShare * rawInputBatchKg;

    let unit = 'kg';
    let formatted = '';

    if (requiredWeightKg < 0.001) {
      // Milligrams
      unit = 'mg';
      formatted = (requiredWeightKg * 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 });
    } else if (requiredWeightKg < 1) {
      // Grams
      unit = 'g';
      formatted = (requiredWeightKg * 1000).toLocaleString('fa-IR', { maximumFractionDigits: 2 });
    } else if (requiredWeightKg >= 1000) {
      // Tons
      unit = 'تن';
      formatted = (requiredWeightKg / 1000).toLocaleString('fa-IR', { maximumFractionDigits: 3 });
    } else {
      // Kilograms
      unit = 'kg';
      formatted = requiredWeightKg.toLocaleString('fa-IR', { maximumFractionDigits: 3 });
    }

    const cost = ing.costPerKg ? requiredWeightKg * Number(ing.costPerKg) : 0;
    totalBatchCost += cost;

    return {
      id: ing.id,
      nameFa: ing.nameFa,
      percentage: pct,
      requiredWeightKg: Math.round(requiredWeightKg * 10000) / 10000,
      requiredWeightFormatted: formatted,
      unit,
      estimatedCost: Math.round(cost)
    };
  });

  const costPerKg = targetKg > 0 ? Math.round(totalBatchCost / targetKg) : 0;

  return {
    targetBatchWeightKg: Math.round(targetKg * 1000) / 1000,
    effectiveNetWeightKg: Math.round(targetKg * 1000) / 1000,
    processLossKg: Math.round(processLossKg * 1000) / 1000,
    ingredients: scaledIngredients,
    totalBatchCost: Math.round(totalBatchCost),
    costPerKg
  };
}

/**
 * Cross-tabulates formulation versions to generate a side-by-side comparison matrix
 */
export function buildMultiFormulationComparisonMatrix(formulations: FormulationVersion[]): {
  allIngredientNames: Array<{ key: string; nameFa: string; category: IngredientFunction }>;
  comparisonRows: Array<{
    nameFa: string;
    category: IngredientFunction;
    valuesByVersionId: Record<string, number | null>; // percentage
  }>;
  summaryMetrics: Array<{
    metricNameFa: string;
    valuesByVersionId: Record<string, string | number>;
  }>;
} {
  const ingredientMap = new Map<string, { nameFa: string; category: IngredientFunction }>();

  // Collect all unique ingredients
  for (const form of formulations) {
    for (const ing of form.ingredients) {
      const key = ing.nameFa.trim().toLowerCase();
      if (!ingredientMap.has(key)) {
        ingredientMap.set(key, { nameFa: ing.nameFa, category: ing.category });
      }
    }
  }

  const allIngredientNames = Array.from(ingredientMap.entries()).map(([key, val]) => ({
    key,
    nameFa: val.nameFa,
    category: val.category
  }));

  const comparisonRows = allIngredientNames.map(ingMeta => {
    const valuesByVersionId: Record<string, number | null> = {};

    for (const form of formulations) {
      const found = form.ingredients.find(i => i.nameFa.trim().toLowerCase() === ingMeta.key);
      valuesByVersionId[form.id] = found ? Number(found.percentage) : null;
    }

    return {
      nameFa: ingMeta.nameFa,
      category: ingMeta.category,
      valuesByVersionId
    };
  });

  // Summary row metrics
  const summaryMetrics = [
    {
      metricNameFa: 'مجموع درصد مواد (%)',
      valuesByVersionId: Object.fromEntries(
        formulations.map(f => [f.id, `${calculateFormulationSummary(f.ingredients).totalPercentage}%`])
      )
    },
    {
      metricNameFa: 'ماده خشک کل (Dry Matter %)',
      valuesByVersionId: Object.fromEntries(
        formulations.map(f => [f.id, `${calculateFormulationSummary(f.ingredients).totalDryMatterPercent}%`])
      )
    },
    {
      metricNameFa: 'بریکس تخمینی (°Brix)',
      valuesByVersionId: Object.fromEntries(
        formulations.map(f => [f.id, `${calculateFormulationSummary(f.ingredients).estimatedBrix}°`])
      )
    },
    {
      metricNameFa: 'تعداد کل اجزای فرمول',
      valuesByVersionId: Object.fromEntries(
        formulations.map(f => [f.id, f.ingredients.length])
      )
    },
    {
      metricNameFa: 'هزینه تخمینی مواد (هر کیلوگرم)',
      valuesByVersionId: Object.fromEntries(
        formulations.map(f => {
          const cost = calculateFormulationSummary(f.ingredients).estimatedCostPerKg;
          return [f.id, cost > 0 ? `${cost.toLocaleString('fa-IR')} تومان` : 'تعریف‌نشده'];
        })
      )
    }
  ];

  return {
    allIngredientNames,
    comparisonRows,
    summaryMetrics
  };
}
