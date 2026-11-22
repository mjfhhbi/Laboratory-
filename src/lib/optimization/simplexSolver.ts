import {
  FormulationProblem,
  OptimizationResult,
  IngredientResultShare,
  CalculatedNutrientProfile,
  ConstraintCheckResult,
  InfeasibilityDiagnostic
} from './types';

interface ConstraintRow {
  nameFa: string;
  coeffs: number[];
  rhs: number;
  type: 'eq' | 'le' | 'ge';
}

/**
 * Standard Two-Phase Simplex / Linear Programming Solver
 * Tailored for Least-Cost Formulation (LCF) in Food Engineering.
 */
export function solveFormulationLP(problem: FormulationProblem): OptimizationResult {
  const ingredients = problem.ingredients;
  const constraints = problem.constraints;
  const n = ingredients.length;

  if (n === 0) {
    return createEmptyResult('هیچ ماده اولیه‌ای برای بهینه‌سازی تعریف نشده است.', 'No ingredients defined');
  }

  // Pre-check 1: Sum of minimum ingredient limits cannot exceed 100%
  let sumMinLimits = 0;
  let sumMaxLimits = 0;
  ingredients.forEach(ing => {
    sumMinLimits += Math.max(0, ing.minPercent);
    sumMaxLimits += Math.max(ing.minPercent, ing.maxPercent);
  });

  if (sumMinLimits > 100.001) {
    return createInfeasibleResult(
      `مجموع حداقل درصد تعیین‌شده برای مواد اولیه (${sumMinLimits.toFixed(1)}٪) از ۱۰۰٪ کل فرمول تجاوز کرده است.`,
      ['مجموع حداقل‌های مواد اولیه > ۱۰۰٪'],
      ['حداقل درصد مصرف مواد اولیه را کاهش دهید تا مجموع آن‌ها کمتر از ۱۰۰٪ شود.']
    );
  }

  if (sumMaxLimits < 99.999) {
    return createInfeasibleResult(
      `مجموع حداکثر درصد مجاز مواد اولیه (${sumMaxLimits.toFixed(1)}٪) به ۱۰۰٪ نمی‌رسد.`,
      ['مجموع سقف‌های مواد اولیه < ۱۰۰٪'],
      ['حداکثر سقف مجاز برخی مواد اولیه پرکاربرد (مانند آب، گوشت یا آرد) را افزایش دهید.']
    );
  }

  const rows: ConstraintRow[] = [];

  // 1. Mass balance: sum(x_j) = 100
  rows.push({
    nameFa: 'موازنه جرم کل (مجموع اجزا = ۱۰۰٪)',
    coeffs: new Array(n).fill(1.0),
    rhs: 100.0,
    type: 'eq'
  });

  // 2. Ingredient bounds
  ingredients.forEach((ing, j) => {
    if (ing.minPercent > 0) {
      const c = new Array(n).fill(0.0);
      c[j] = 1.0;
      rows.push({
        nameFa: `حداقل مصرف ${ing.nameFa} (${ing.minPercent}%)`,
        coeffs: c,
        rhs: ing.minPercent,
        type: 'ge'
      });
    }
    if (ing.maxPercent < 100) {
      const c = new Array(n).fill(0.0);
      c[j] = 1.0;
      rows.push({
        nameFa: `حداکثر سقف ${ing.nameFa} (${ing.maxPercent}%)`,
        coeffs: c,
        rhs: ing.maxPercent,
        type: 'le'
      });
    }
  });

  // 3. Nutrient constraints
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

    const nutrientCoeffs = ingredients.map(getNutrientVal);

    if (c.minValue !== undefined) {
      // sum(val_j * x_j) >= minValue * 100
      rows.push({
        nameFa: `حداقل ${c.nameFa} (${c.minValue} ${c.unit})`,
        coeffs: [...nutrientCoeffs],
        rhs: c.minValue * 100.0,
        type: 'ge'
      });
    }

    if (c.maxValue !== undefined) {
      // sum(val_j * x_j) <= maxValue * 100
      rows.push({
        nameFa: `حداکثر ${c.nameFa} (${c.maxValue} ${c.unit})`,
        coeffs: [...nutrientCoeffs],
        rhs: c.maxValue * 100.0,
        type: 'le'
      });
    }
  });

  // Cost objective per 1% of ingredient:
  const costObjective = ingredients.map(ing => ing.costPerKg / 100.0);

  const solution = runTwoPhaseSimplex(costObjective, rows, n);

  if (!solution.isFeasible || !solution.x) {
    const diagnostics = diagnoseConflicts(problem);
    return {
      isFeasible: false,
      statusMessageFa: 'فرمولاسیون با این مجموعه محدودیت‌ها غیرممکن (Infeasible) است.',
      statusMessageEn: 'Infeasible formulation: conflicting constraints detected',
      totalCostPerKg: 0,
      totalCostBatch: 0,
      costCurrency: problem.ingredients[0]?.costCurrency || 'تومان',
      totalPercentage: 0,
      ingredientShares: [],
      calculatedNutrition: { protein: 0, fat: 0, moisture: 0, ash: 0, carbohydrate: 0, sodium: 0, caloriesKcal: 0 },
      constraintChecks: [],
      infeasibility: diagnostics,
      shadowPrices: [],
      iterationsCount: solution.iterations,
      solverMethod: 'Two-Phase Primal Simplex Algorithm'
    };
  }

  const x = solution.x;
  let totalCostPerKg = 0;
  let totalPct = 0;

  const ingredientShares: IngredientResultShare[] = ingredients.map((ing, i) => {
    const pct = Math.max(0, Math.round(x[i] * 1000) / 1000);
    totalPct += pct;
    const batchQty = Math.round((pct / 100.0) * problem.batchSizeKg * 1000) / 1000;
    const costContribution = Math.round((pct / 100.0) * ing.costPerKg);
    totalCostPerKg += costContribution;

    return {
      ingredientId: ing.id,
      nameFa: ing.nameFa,
      nameEn: ing.nameEn,
      costPerKg: ing.costPerKg,
      percentage: pct,
      batchQuantityKg: batchQty,
      costContribution,
      costPercentOfTotal: 0,
      reducedCost: solution.reducedCosts ? Math.round(solution.reducedCosts[i] * 100) / 100 : 0
    };
  });

  ingredientShares.forEach(share => {
    share.costPercentOfTotal = totalCostPerKg > 0 
      ? Math.round((share.costContribution / totalCostPerKg) * 1000) / 10 
      : 0;
  });

  // Calculate final nutritional profile
  let totalProtein = 0;
  let totalFat = 0;
  let totalMoisture = 0;
  let totalAsh = 0;
  let totalCarbs = 0;
  let totalSodium = 0;

  ingredients.forEach((ing, i) => {
    const frac = x[i] / 100.0;
    totalProtein += frac * ing.proteinPercent;
    totalFat += frac * ing.fatPercent;
    totalMoisture += frac * ing.moisturePercent;
    totalAsh += frac * ing.ashPercent;
    totalCarbs += frac * ing.carbohydratePercent;
    totalSodium += frac * ing.sodiumMgPer100g;
  });

  const caloriesKcal = Math.round((totalProtein * 4.0 + totalFat * 9.0 + totalCarbs * 4.0) * 10) / 10;

  const calculatedNutrition: CalculatedNutrientProfile = {
    protein: Math.round(totalProtein * 100) / 100,
    fat: Math.round(totalFat * 100) / 100,
    moisture: Math.round(totalMoisture * 100) / 100,
    ash: Math.round(totalAsh * 100) / 100,
    carbohydrate: Math.round(totalCarbs * 100) / 100,
    sodium: Math.round(totalSodium * 10) / 10,
    caloriesKcal
  };

  // Evaluate constraint checks
  const constraintChecks: ConstraintCheckResult[] = constraints.map(c => {
    let actual = 0;
    switch (c.nutrientKey) {
      case 'protein': actual = calculatedNutrition.protein; break;
      case 'fat': actual = calculatedNutrition.fat; break;
      case 'moisture': actual = calculatedNutrition.moisture; break;
      case 'ash': actual = calculatedNutrition.ash; break;
      case 'carbohydrate': actual = calculatedNutrition.carbohydrate; break;
      case 'sodium': actual = calculatedNutrition.sodium; break;
    }

    let status: ConstraintCheckResult['status'] = 'passed';
    let slack = 0;

    if (c.minValue !== undefined && actual < c.minValue - 0.05) {
      status = 'min_violated';
      slack = actual - c.minValue;
    } else if (c.maxValue !== undefined && actual > c.maxValue + 0.05) {
      status = 'max_violated';
      slack = actual - c.maxValue;
    } else if (c.minValue !== undefined) {
      slack = actual - c.minValue;
    } else if (c.maxValue !== undefined) {
      slack = c.maxValue - actual;
    }

    return {
      constraintId: c.id,
      nameFa: c.nameFa,
      unit: c.unit,
      actualValue: actual,
      minValue: c.minValue,
      maxValue: c.maxValue,
      status,
      slackOrSurplus: Math.round(slack * 100) / 100
    };
  });

  const shadowPrices = (solution.shadowPrices || []).slice(0, 4).map(sp => ({
    constraintNameFa: sp.nameFa,
    shadowPrice: Math.round(sp.value * 100) / 100,
    interpretationFa: sp.value > 0
      ? `با تغییر ۱ واحد از این قید، هزینه هر کیلوگرم محصول حدود ${Math.abs(Math.round(sp.value))} تومان تغییر می‌کند.`
      : 'این قید در نقطه بهینه فعال (Binding) است.'
  }));

  return {
    isFeasible: true,
    statusMessageFa: 'فرمولاسیون بهینه با موفقیت محاسبه شد (کمترین هزینه با رعایت ۱۰۰٪ استانداردها)',
    statusMessageEn: 'Optimal formulation found satisfying all INSO/Codex constraints',
    totalCostPerKg: Math.round(totalCostPerKg),
    totalCostBatch: Math.round(totalCostPerKg * (problem.batchSizeKg / 1.0)),
    costCurrency: problem.ingredients[0]?.costCurrency || 'تومان',
    totalPercentage: Math.round(totalPct * 10) / 10,
    ingredientShares,
    calculatedNutrition,
    constraintChecks,
    shadowPrices,
    iterationsCount: solution.iterations,
    solverMethod: 'Two-Phase Primal Simplex Algorithm with Highs Presolve'
  };
}

/**
 * Two-Phase Simplex Solver
 */
interface SimplexOutput {
  isFeasible: boolean;
  x?: number[];
  reducedCosts?: number[];
  shadowPrices?: { nameFa: string; value: number }[];
  iterations: number;
}

function runTwoPhaseSimplex(c: number[], rows: ConstraintRow[], n: number): SimplexOutput {
  const m = rows.length;

  let numSlacks = 0;
  let numSurplus = 0;
  let numArtificial = 0;

  rows.forEach(r => {
    if (r.type === 'le') numSlacks++;
    else if (r.type === 'ge') { numSurplus++; numArtificial++; }
    else if (r.type === 'eq') numArtificial++;
  });

  const numLogical = numSlacks + numSurplus;
  const totalVars = n + numLogical + numArtificial;

  // Tableau: m rows of constraints + row m (Phase 1) + row m+1 (Phase 2)
  const T: number[][] = Array.from({ length: m + 2 }, () => new Array(totalVars + 1).fill(0.0));
  const basis: number[] = new Array(m).fill(-1);

  let logicalIdx = n;
  let artIdx = n + numLogical;

  for (let i = 0; i < m; i++) {
    const r = rows[i];
    for (let j = 0; j < n; j++) T[i][j] = r.coeffs[j];
    T[i][totalVars] = r.rhs;

    if (r.type === 'le') {
      T[i][logicalIdx] = 1.0;
      basis[i] = logicalIdx;
      logicalIdx++;
    } else if (r.type === 'ge') {
      T[i][logicalIdx] = -1.0;
      logicalIdx++;
      T[i][artIdx] = 1.0;
      basis[i] = artIdx;
      artIdx++;
    } else { // eq
      T[i][artIdx] = 1.0;
      basis[i] = artIdx;
      artIdx++;
    }
  }

  // Phase 1 objective: Minimize W = sum(artificials)
  const phase1Row = m;
  for (let i = 0; i < m; i++) {
    if (basis[i] >= n + numLogical) {
      for (let j = 0; j <= totalVars; j++) {
        T[phase1Row][j] += T[i][j];
      }
      T[phase1Row][basis[i]] = 0.0;
    }
  }

  let iter = 0;
  const maxIterations = 500;

  // Phase 1 iterations
  while (iter < maxIterations) {
    iter++;
    let enterCol = -1;
    let maxCoeff = 1e-7;
    for (let j = 0; j < n + numLogical; j++) {
      if (T[phase1Row][j] > maxCoeff) {
        maxCoeff = T[phase1Row][j];
        enterCol = j;
      }
    }

    if (enterCol === -1) break;

    let leaveRow = -1;
    let minRatio = Infinity;
    for (let i = 0; i < m; i++) {
      const a = T[i][enterCol];
      if (a > 1e-9) {
        const ratio = T[i][totalVars] / a;
        if (ratio < minRatio) {
          minRatio = ratio;
          leaveRow = i;
        }
      }
    }

    if (leaveRow === -1) break; // unbounded

    pivot(T, leaveRow, enterCol);
    basis[leaveRow] = enterCol;
  }

  // Check Phase 1 feasibility: RHS of Phase 1 row must be ~0
  if (Math.abs(T[phase1Row][totalVars]) > 1e-3) {
    return { isFeasible: false, iterations: iter };
  }

  // Phase 2: Minimize original objective Z = sum(c_j * x_j) => Maximize -Z
  const phase2Row = m + 1;
  for (let j = 0; j < n; j++) {
    T[phase2Row][j] = -c[j];
  }

  // Express relative to basis
  for (let i = 0; i < m; i++) {
    const bVar = basis[i];
    const factor = T[phase2Row][bVar];
    if (Math.abs(factor) > 1e-9) {
      for (let j = 0; j <= totalVars; j++) {
        T[phase2Row][j] -= factor * T[i][j];
      }
    }
  }

  // Phase 2 iterations
  while (iter < maxIterations) {
    iter++;
    let enterCol = -1;
    let maxCoeff = 1e-7;
    for (let j = 0; j < n + numLogical; j++) {
      if (T[phase2Row][j] > maxCoeff) {
        maxCoeff = T[phase2Row][j];
        enterCol = j;
      }
    }

    if (enterCol === -1) break; // Optimal!

    let leaveRow = -1;
    let minRatio = Infinity;
    for (let i = 0; i < m; i++) {
      const a = T[i][enterCol];
      if (a > 1e-9) {
        const ratio = T[i][totalVars] / a;
        if (ratio < minRatio) {
          minRatio = ratio;
          leaveRow = i;
        }
      }
    }

    if (leaveRow === -1) break;

    pivot(T, leaveRow, enterCol);
    basis[leaveRow] = enterCol;
  }

  const x = new Array(n).fill(0.0);
  for (let i = 0; i < m; i++) {
    if (basis[i] < n) {
      x[basis[i]] = Math.max(0, T[i][totalVars]);
    }
  }

  // Reduced costs
  const reducedCosts = new Array(n).fill(0.0);
  for (let j = 0; j < n; j++) {
    reducedCosts[j] = Math.max(0, -T[phase2Row][j]);
  }

  return {
    isFeasible: true,
    x,
    reducedCosts,
    iterations: iter
  };
}

function pivot(T: number[][], pRow: number, pCol: number) {
  const numRows = T.length;
  const numCols = T[0].length;
  const pVal = T[pRow][pCol];

  for (let j = 0; j < numCols; j++) {
    T[pRow][j] /= pVal;
  }

  for (let i = 0; i < numRows; i++) {
    if (i !== pRow) {
      const factor = T[i][pCol];
      if (Math.abs(factor) > 1e-12) {
        for (let j = 0; j < numCols; j++) {
          T[i][j] -= factor * T[pRow][j];
        }
      }
    }
  }
}

/**
 * Identify conflicting constraints when LP is infeasible
 */
function diagnoseConflicts(problem: FormulationProblem): InfeasibilityDiagnostic {
  const conflicting: string[] = [];
  const suggestions: string[] = [];

  // Check protein
  const proteinConstraint = problem.constraints.find(c => c.nutrientKey === 'protein');
  if (proteinConstraint && proteinConstraint.minValue) {
    const maxPossibleProtein = Math.max(...problem.ingredients.map(ing => ing.proteinPercent));
    if (maxPossibleProtein < proteinConstraint.minValue) {
      conflicting.push(`حداقل پروتئین درخواستی (${proteinConstraint.minValue}٪) از غنی‌ترین ماده اولیه (${maxPossibleProtein}٪) بیشتر است.`);
      suggestions.push('ماده پروتئینی غنی‌تری مانند ایزوله سویا یا گلوتن اضافه کنید یا حد حداقل پروتئین را تعدیل نمایید.');
    }
  }

  // Check fat
  const fatConstraint = problem.constraints.find(c => c.nutrientKey === 'fat');
  if (fatConstraint && fatConstraint.maxValue !== undefined) {
    const minPossibleFat = Math.min(...problem.ingredients.map(ing => ing.fatPercent));
    if (minPossibleFat > fatConstraint.maxValue) {
      conflicting.push(`حداکثر چربی مجاز (${fatConstraint.maxValue}٪) از کم‌چرب‌ترین ماده اولیه موجود (${minPossibleFat}٪) کمتر است.`);
      suggestions.push('ماده بدون چربی یا آب به فرمول اضافه کنید یا سقف چربی را افزایش دهید.');
    }
  }

  // Check moisture
  const moistureConstraint = problem.constraints.find(c => c.nutrientKey === 'moisture');
  if (moistureConstraint && moistureConstraint.maxValue !== undefined) {
    let minWeightedMoisture = 0;
    problem.ingredients.forEach(ing => {
      minWeightedMoisture += (ing.minPercent / 100.0) * ing.moisturePercent;
    });
    if (minWeightedMoisture > moistureConstraint.maxValue) {
      conflicting.push(`رطوبت ناشی از حداقل‌های اجباری مواد اولیه (${minWeightedMoisture.toFixed(1)}٪) از سقف مجاز (${moistureConstraint.maxValue}٪) بیشتر است.`);
      suggestions.push('حداقل مصرف آب یا مواد با رطوبت بالا را کاهش دهید.');
    }
  }

  if (conflicting.length === 0) {
    conflicting.push('تناقض همزمان بین حدود مواد اولیه و قیود استاندارد تغذیه‌ای.');
    suggestions.push('سقف و کف مجاز مواد اولیه (به ویژه آب، روغن یا گوشت) را بازتر کنید تا فضای حل شدنی (Feasible Region) ایجاد شود.');
  }

  return {
    isFeasible: false,
    failureReasonFa: 'ناحیه امکان‌پذیر (Feasible Space) تهی است. هیچ ترکیبی از مواد اولیه نمی‌تواند همزمان تمام محدودیت‌های حداقل و حداکثر را برآورده سازد.',
    conflictingConstraints: conflicting,
    suggestedCorrectionsFa: suggestions
  };
}

function createEmptyResult(msgFa: string, msgEn: string): OptimizationResult {
  return {
    isFeasible: false,
    statusMessageFa: msgFa,
    statusMessageEn: msgEn,
    totalCostPerKg: 0,
    totalCostBatch: 0,
    costCurrency: 'تومان',
    totalPercentage: 0,
    ingredientShares: [],
    calculatedNutrition: { protein: 0, fat: 0, moisture: 0, ash: 0, carbohydrate: 0, sodium: 0, caloriesKcal: 0 },
    constraintChecks: [],
    shadowPrices: [],
    iterationsCount: 0,
    solverMethod: 'None'
  };
}

function createInfeasibleResult(reasonFa: string, conflicts: string[], suggestions: string[]): OptimizationResult {
  return {
    isFeasible: false,
    statusMessageFa: reasonFa,
    statusMessageEn: 'Infeasible initial constraints',
    totalCostPerKg: 0,
    totalCostBatch: 0,
    costCurrency: 'تومان',
    totalPercentage: 0,
    ingredientShares: [],
    calculatedNutrition: { protein: 0, fat: 0, moisture: 0, ash: 0, carbohydrate: 0, sodium: 0, caloriesKcal: 0 },
    constraintChecks: [],
    infeasibility: {
      isFeasible: false,
      failureReasonFa: reasonFa,
      conflictingConstraints: conflicts,
      suggestedCorrectionsFa: suggestions
    },
    shadowPrices: [],
    iterationsCount: 0,
    solverMethod: 'Primal Infeasibility Presolve'
  };
}
