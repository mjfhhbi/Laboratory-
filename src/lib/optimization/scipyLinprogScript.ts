import { FormulationProblem } from './types';

/**
 * Generate a complete, standalone Python / SciPy script using scipy.optimize.linprog(method='highs')
 * for Least-Cost Formulation (LCF) optimization.
 */
export function generateScipyLinprogScript(problem: FormulationProblem): string {
  const ingredients = problem.ingredients;
  const constraints = problem.constraints;
  const n = ingredients.length;

  const ingNamesList = ingredients.map(ing => `"${ing.nameEn}"`).join(', ');
  const ingCostsList = ingredients.map(ing => (ing.costPerKg / 100.0).toFixed(4)).join(', ');
  const boundsList = ingredients.map(ing => `(${ing.minPercent}, ${ing.maxPercent})`).join(', ');

  // Build A_ub and b_ub lines
  const ubRows: string[] = [];
  const ubRhs: string[] = [];
  const ubDescriptions: string[] = [];

  constraints.forEach(c => {
    const getNutrientVal = (ing: typeof ingredients[0]): number => {
      switch (c.nutrientKey) {
        case 'protein': return ing.proteinPercent;
        case 'fat': return ing.fatPercent;
        case 'moisture': return ing.moisturePercent;
        case 'ash': return ing.ashPercent;
        case 'carbohydrate': return ing.carbohydratePercent;
        case 'sodium': return ing.sodiumMgPer100g;
        default: return 0;
      }
    };

    const vals = ingredients.map(getNutrientVal);

    if (c.minValue !== undefined) {
      // sum(val * x) >= minValue * 100  -->  -sum(val * x) <= -minValue * 100
      const negVals = vals.map(v => (-v).toFixed(3)).join(', ');
      ubRows.push(`    [${negVals}]`);
      ubRhs.push(`-${(c.minValue * 100).toFixed(2)}`);
      ubDescriptions.push(`Min ${c.nameEn} >= ${c.minValue}%`);
    }

    if (c.maxValue !== undefined) {
      // sum(val * x) <= maxValue * 100
      const posVals = vals.map(v => v.toFixed(3)).join(', ');
      ubRows.push(`    [${posVals}]`);
      ubRhs.push(`${(c.maxValue * 100).toFixed(2)}`);
      ubDescriptions.push(`Max ${c.nameEn} <= ${c.maxValue}%`);
    }
  });

  return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Food Science AI - Least-Cost Formulation (LCF) Optimizer
Using SciPy Linear Programming: scipy.optimize.linprog (HiGHS Simplex Solver)

Problem: ${problem.nameEn}
Standard Reference: ${problem.standardReference}
"""

import numpy as np
from scipy.optimize import linprog

# -------------------------------------------------------------
# 1. Formulation Ingredients & Unit Costs
# -------------------------------------------------------------
ingredient_names = [${ingNamesList}]
# Cost coefficient c_j (cost per 1% in finished product):
c = np.array([${ingCostsList}])

# Ingredient usage bounds: (min_percent, max_percent)
bounds = [
  ${boundsList}
]

# -------------------------------------------------------------
# 2. Linear Constraints
# -------------------------------------------------------------
# Equality Constraint (Mass Balance: sum of all ingredients = 100%)
A_eq = np.array([
    [${new Array(n).fill('1.0').join(', ')}]
])
b_eq = np.array([100.0])

# Inequality Constraints (A_ub * x <= b_ub)
A_ub = np.array([
${ubRows.join(',\n')}
])

b_ub = np.array([
    ${ubRhs.join(', ')}
])

print("=================================================================")
print("  LEAST-COST FORMULATION (LCF) - SCIPY HIGHS OPTIMIZER")
print("=================================================================")
print("Problem: ${problem.nameEn}")
print(f"Number of Ingredients: {len(ingredient_names)}")
print(f"Number of Inequality Constraints: {len(b_ub)}")
print("-----------------------------------------------------------------")

# -------------------------------------------------------------
# 3. Solve Linear Programming Problem using HiGHS
# -------------------------------------------------------------
res = linprog(
    c=c,
    A_ub=A_ub,
    b_ub=b_ub,
    A_eq=A_eq,
    b_eq=b_eq,
    bounds=bounds,
    method='highs'
)

# -------------------------------------------------------------
# 4. Display Results & Sensitivity Analysis
# -------------------------------------------------------------
if res.success:
    x_opt = res.x
    total_cost_per_kg = res.fun
    print(f"\\nOPTIMIZATION STATUS: SUCCESS (Optimal Recipe Found)")
    print(f"Total Cost: {total_cost_per_kg:,.0f} ${problem.ingredients[0]?.costCurrency || 'Toman'}/kg")
    print(f"Batch Cost (for ${problem.batchSizeKg} kg): {total_cost_per_kg * ${problem.batchSizeKg}:,.0f} ${problem.ingredients[0]?.costCurrency || 'Toman'}")
    print(f"Simplex Iterations: {res.nit}")
    print("\\n--- OPTIMAL RECIPE SHARE ---")
    print(f"{'Ingredient':<35} | {'Share (%)':>10} | {'Qty (kg)':>10} | {'Cost/kg Share':>14}")
    print("-" * 75)
    for name, share, cost_unit in zip(ingredient_names, x_opt, c):
        qty = (share / 100.0) * ${problem.batchSizeKg}
        cost_contrib = share * cost_unit
        if share > 0.001:
            print(f"{name:<35} | {share:>9.2f}% | {qty:>9.2f}kg | {cost_contrib:>14,.0f}")

    print("-" * 75)
    print(f"{'TOTAL MASS BALANCE':<35} | {np.sum(x_opt):>9.2f}% | {${problem.batchSizeKg}:>9.2f}kg | {total_cost_per_kg:>14,.0f}")
else:
    print(f"\\nOPTIMIZATION FAILED: {res.message}")
    print("The linear programming problem is infeasible or unbounded.")
    print("Check for conflicting nutritional standards or overly restrictive ingredient bounds.")

print("=================================================================")
`;
}
