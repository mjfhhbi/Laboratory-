import {
  RheologyModelType,
  ShearDataPoint,
  ModelFittingResult,
  PipeFlowInputs,
  PipeFlowResult
} from './types';

/**
 * Fit all 5 rheological models to experimental shear rate vs shear stress data
 */
export function fitAllRheologicalModels(rawPoints: ShearDataPoint[]): ModelFittingResult[] {
  // Sort points by shear rate ascending and filter valid points
  const points = rawPoints
    .filter(p => p.shearRate > 0 && p.shearStress > 0)
    .sort((a, b) => a.shearRate - b.shearRate);

  if (points.length < 3) {
    throw new Error('برای برازش معتبر مدل‌های رئولوژی حداقل به ۳ نقطه تجربی معتبر (با نرخ برش و تنش مثبت) نیاز است.');
  }

  const results: ModelFittingResult[] = [];

  // 1. Newtonian Model: \tau = \mu * \dot{\gamma}
  results.push(fitNewtonianModel(points));

  // 2. Power Law (Ostwald-de Waele): \tau = K * \dot{\gamma}^n
  results.push(fitPowerLawModel(points));

  // 3. Bingham Plastic Model: \tau = \tau_0 + \mu_p * \dot{\gamma}
  results.push(fitBinghamModel(points));

  // 4. Casson Model: \sqrt{\tau} = \sqrt{\tau_{0c}} + \sqrt{\mu_c} * \sqrt{\dot{\gamma}}
  results.push(fitCassonModel(points));

  // 5. Herschel-Bulkley Model: \tau = \tau_0 + K * \dot{\gamma}^n
  results.push(fitHerschelBulkleyModel(points));

  // Sort by R^2 descending so the best fitting model is ranked first
  return results.sort((a, b) => b.rSquared - a.rSquared);
}

/**
 * 1. Newtonian Model Fitting: \tau = \mu * \dot{\gamma}
 */
export function fitNewtonianModel(points: ShearDataPoint[]): ModelFittingResult {
  let sumXY = 0;
  let sumX2 = 0;
  let sumY = 0;

  points.forEach(p => {
    sumXY += p.shearRate * p.shearStress;
    sumX2 += p.shearRate * p.shearRate;
    sumY += p.shearStress;
  });

  const mu = sumX2 > 0 ? sumXY / sumX2 : 0.001;
  const isPhysical = mu > 0;

  const fittedStressPoints = points.map(p => {
    const predStress = mu * p.shearRate;
    return {
      shearRate: p.shearRate,
      predictedStress: predStress,
      predictedViscosity: mu
    };
  });

  const { rSquared, rmse } = computeFitMetrics(points, fittedStressPoints);

  return {
    modelType: 'newtonian',
    modelNameFa: 'مدل نیوتنی (Newtonian)',
    modelNameEn: 'Newtonian Fluid',
    equationLatex: '\\tau = \\mu \\cdot \\dot{\\gamma}',
    apparentViscosityLatex: '\\eta_a = \\mu = \\text{const}',
    parameters: {
      mu: {
        value: mu,
        unit: 'Pa·s',
        symbol: '\\mu',
        nameFa: 'ویسکوزیته دینامیکی (Dynamic Viscosity)'
      }
    },
    rSquared,
    rmse,
    isConverged: isPhysical,
    convergenceWarning: !isPhysical ? 'مقدار ویسکوزیته محاسبه‌شده نامنفی نیست.' : undefined,
    flowBehaviorCategoryFa: 'نیوتنی (مستقل از نرخ برش)',
    applicationNotesFa: 'مناسب برای آب، شیر کم‌چرب، روغن‌های گیاهی تصفیه‌شده، محلول‌های قندی شفاف، سرکه و نوشیدنی‌های گازدار شفاف.',
    limitationsFa: [
      'تنها برای سیالات فاقد ماکرومولکول‌های طویل، زنجیره‌های پلیمری یا سوسپانسیون‌های متراکم کاربرد دارد.',
      'قادر به توصیف رقیق‌شوندگی برشی (Shear-thinning) یا تنش تسلیم نیست.'
    ],
    fittedStressPoints
  };
}

/**
 * 2. Power Law / Ostwald-de Waele Model: \tau = K * \dot{\gamma}^n
 */
export function fitPowerLawModel(points: ShearDataPoint[]): ModelFittingResult {
  const lnPoints = points.map(p => ({
    x: Math.log(p.shearRate),
    y: Math.log(p.shearStress)
  }));

  const nPts = lnPoints.length;
  let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;
  lnPoints.forEach(p => {
    sumX += p.x;
    sumY += p.y;
    sumX2 += p.x * p.x;
    sumXY += p.x * p.y;
  });

  const denom = (nPts * sumX2 - sumX * sumX);
  const n = denom !== 0 ? (nPts * sumXY - sumX * sumY) / denom : 1.0;
  const lnK = (sumY - n * sumX) / nPts;
  const K = Math.exp(lnK);

  const isPhysical = K > 0 && n > 0 && n < 3.0;

  const fittedStressPoints = points.map(p => {
    const predStress = K * Math.pow(p.shearRate, n);
    return {
      shearRate: p.shearRate,
      predictedStress: predStress,
      predictedViscosity: p.shearRate > 0 ? predStress / p.shearRate : K
    };
  });

  const { rSquared, rmse } = computeFitMetrics(points, fittedStressPoints);

  const behaviorCategory = n < 0.98 
    ? 'شبه‌پلاستیک (رقیق‌شونده با برش / Shear-Thinning)' 
    : n > 1.02 
      ? 'اتساعی (غلیظ‌شونده با برش / Shear-Thickening)' 
      : 'نیوتنی (مستقل از نرخ برش)';

  return {
    modelType: 'power_law',
    modelNameFa: 'مدل قانون توان (Power Law / Ostwald-de Waele)',
    modelNameEn: 'Ostwald-de Waele Power Law',
    equationLatex: '\\tau = K \\cdot \\dot{\\gamma}^n',
    apparentViscosityLatex: '\\eta_a = K \\cdot \\dot{\\gamma}^{n - 1}',
    parameters: {
      K: {
        value: K,
        unit: 'Pa·sⁿ',
        symbol: 'K',
        nameFa: 'شاخص قوام (Consistency Coefficient)'
      },
      n: {
        value: n,
        unit: '-',
        symbol: 'n',
        nameFa: 'شاخص رفتار جریان (Flow Behavior Index)'
      }
    },
    rSquared,
    rmse,
    isConverged: isPhysical,
    convergenceWarning: !isPhysical ? 'پارامترهای به دست آمده در بازه فیزیکی قرار ندارند.' : undefined,
    flowBehaviorCategoryFa: behaviorCategory,
    applicationNotesFa: 'متداول‌ترین مدل برای پوره میوه‌ها (پوره سیب، هلو، موز)، کنسانتره‌های آبمیوه، محلول‌های صمغ (زانتان، گوار، کربوکسی متیل سلولز) و سس‌های با قوام ملایم.',
    limitationsFa: [
      'در نرخ‌های برش نزدیک به صفر (سکون)، ویسکوزیته ظاهری به سمت بی‌نهایت میل می‌کند (در صورتی که n < 1 باشد) که از نظر فیزیکی غیرواقعی است.',
      'وجود تنش تسلیم اولیه (Yield Stress) را در محاسبات لحاظ نمی‌کند.'
    ],
    fittedStressPoints
  };
}

/**
 * 3. Bingham Plastic Model: \tau = \tau_0 + \mu_p * \dot{\gamma}
 */
export function fitBinghamModel(points: ShearDataPoint[]): ModelFittingResult {
  const nPts = points.length;
  let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;
  points.forEach(p => {
    sumX += p.shearRate;
    sumY += p.shearStress;
    sumX2 += p.shearRate * p.shearRate;
    sumXY += p.shearRate * p.shearStress;
  });

  const denom = (nPts * sumX2 - sumX * sumX);
  const mu_p = denom !== 0 ? (nPts * sumXY - sumX * sumY) / denom : 0.01;
  const tau_0 = Math.max(0, (sumY - mu_p * sumX) / nPts);

  const isPhysical = mu_p > 0;

  const fittedStressPoints = points.map(p => {
    const predStress = tau_0 + mu_p * p.shearRate;
    return {
      shearRate: p.shearRate,
      predictedStress: predStress,
      predictedViscosity: p.shearRate > 0 ? predStress / p.shearRate : mu_p
    };
  });

  const { rSquared, rmse } = computeFitMetrics(points, fittedStressPoints);

  return {
    modelType: 'bingham_plastic',
    modelNameFa: 'مدل پلاستیک بینگهام (Bingham Plastic)',
    modelNameEn: 'Bingham Plastic',
    equationLatex: '\\tau = \\tau_0 + \\mu_p \\cdot \\dot{\\gamma} \\quad (\\text{for } \\tau > \\tau_0)',
    apparentViscosityLatex: '\\eta_a = \\frac{\\tau_0}{\\dot{\\gamma}} + \\mu_p',
    parameters: {
      tau_0: {
        value: tau_0,
        unit: 'Pa',
        symbol: '\\tau_0',
        nameFa: 'تنش تسلیم بینگهام (Yield Stress)'
      },
      mu_p: {
        value: mu_p,
        unit: 'Pa·s',
        symbol: '\\mu_p',
        nameFa: 'ویسکوزیته پلاستیک (Plastic Viscosity)'
      }
    },
    rSquared,
    rmse,
    isConverged: isPhysical,
    convergenceWarning: !isPhysical ? 'ویسکوزیته پلاستیک منفی به دست آمده است.' : undefined,
    flowBehaviorCategoryFa: 'پلاستیک با تنش تسلیم (Bingham / Herschel-Bulkley / Casson)',
    applicationNotesFa: 'مناسب برای سس خردل، خمیردندان، برخی مایونزهای صنعتی، مارگارین و لجن‌های غلیظ فرآیندی که پس از شروع جریان، رفتار تقریباً خطی نشان می‌دهند.',
    limitationsFa: [
      'فرض می‌کند که سیال پس از تسلیم کاملاً نیوتنی رفتار می‌کند، در حالی که بیشتر مواد غذایی پس از تسلیم نیز رقیق‌شونده برشی (Shear-thinning) هستند.',
      'در نرخ‌های برش میانی تمایل به بیش‌تخمین تنش برش دارد.'
    ],
    fittedStressPoints
  };
}

/**
 * 4. Casson Model: \sqrt{\tau} = \sqrt{\tau_{0c}} + \sqrt{\mu_c} * \sqrt{\dot{\gamma}}
 */
export function fitCassonModel(points: ShearDataPoint[]): ModelFittingResult {
  const sqrtPoints = points.map(p => ({
    x: Math.sqrt(p.shearRate),
    y: Math.sqrt(p.shearStress)
  }));

  const nPts = sqrtPoints.length;
  let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;
  sqrtPoints.forEach(p => {
    sumX += p.x;
    sumY += p.y;
    sumX2 += p.x * p.x;
    sumXY += p.x * p.y;
  });

  const denom = (nPts * sumX2 - sumX * sumX);
  const sqrt_muc = denom !== 0 ? (nPts * sumXY - sumX * sumY) / denom : 0.1;
  const sqrt_tau0c = Math.max(0, (sumY - sqrt_muc * sumX) / nPts);

  const tau_0c = Math.pow(sqrt_tau0c, 2);
  const mu_c = Math.pow(Math.max(0, sqrt_muc), 2);

  const isPhysical = mu_c > 0 && tau_0c >= 0;

  const fittedStressPoints = points.map(p => {
    const sqrtPred = sqrt_tau0c + Math.sqrt(mu_c) * Math.sqrt(p.shearRate);
    const predStress = Math.pow(sqrtPred, 2);
    return {
      shearRate: p.shearRate,
      predictedStress: predStress,
      predictedViscosity: p.shearRate > 0 ? predStress / p.shearRate : mu_c
    };
  });

  const { rSquared, rmse } = computeFitMetrics(points, fittedStressPoints);

  return {
    modelType: 'casson',
    modelNameFa: 'مدل کاسون (Casson Model - استاندارد رسمی شکلات)',
    modelNameEn: 'Casson Model (IOCCC / ICA Standard)',
    equationLatex: '\\sqrt{\\tau} = \\sqrt{\\tau_{0c}} + \\sqrt{\\mu_c} \\cdot \\sqrt{\\dot{\\gamma}}',
    apparentViscosityLatex: '\\eta_a = \\left( \\sqrt{\\frac{\\tau_{0c}}{\\dot{\\gamma}}} + \\sqrt{\\mu_c} \\right)^2',
    parameters: {
      tau_0c: {
        value: tau_0c,
        unit: 'Pa',
        symbol: '\\tau_{0c}',
        nameFa: 'تنش تسلیم کاسون (Casson Yield Stress)'
      },
      mu_c: {
        value: mu_c,
        unit: 'Pa·s',
        symbol: '\\mu_c',
        nameFa: 'ویسکوزیته پلاستیک کاسون (Casson Plastic Viscosity)'
      }
    },
    rSquared,
    rmse,
    isConverged: isPhysical,
    convergenceWarning: !isPhysical ? 'پارامترهای رادیکالی کاسون غیرفیزیکی هستند.' : undefined,
    flowBehaviorCategoryFa: 'پلاستیک با تنش تسلیم (Bingham / Herschel-Bulkley / Casson)',
    applicationNotesFa: 'استاندارد رسمی بین‌المللی انجمن تولیدکنندگان شکلات و شیرینی (IOCCC / ICA Method 46) برای ارزیابی رئولوژی شکلات مذاب، پوشش‌های شکلاتی، خون و فرآورده‌های ژلاتینی.',
    limitationsFa: [
      'دامنه اعتبارسنجی استاندارد برای شکلات معمولاً در محدوده نرخ برش ۵ تا ۶۰ ثانیه به توان منفی یک (s⁻¹) تعریف شده است.',
      'در سیالاتی که رقیق‌شوندگی شدید با توان کمتر از ۰.۳ دارند ممکن است خطای انحنا ایجاد کند.'
    ],
    fittedStressPoints
  };
}

/**
 * 5. Herschel-Bulkley Model: \tau = \tau_0 + K * \dot{\gamma}^n
 * Non-linear 3-parameter optimization via Golden-Section Scan on \tau_0
 */
export function fitHerschelBulkleyModel(points: ShearDataPoint[]): ModelFittingResult {
  const minStress = Math.min(...points.map(p => p.shearStress));
  let bestTau0 = 0;
  let bestK = 1.0;
  let bestN = 0.5;
  let bestR2 = -Infinity;

  // Scan tau0 from 0 to 0.95 * minStress
  const maxSearchTau0 = Math.max(0, minStress * 0.95);
  const steps = 60;

  for (let s = 0; s <= steps; s++) {
    const candidateTau0 = (s / steps) * maxSearchTau0;
    
    // Fit log(tau - tau0) = log(K) + n * log(gamma_dot)
    const validLnPairs: { x: number; y: number }[] = [];
    let isAllValid = true;

    for (const p of points) {
      const netStress = p.shearStress - candidateTau0;
      if (netStress <= 0.0001 || p.shearRate <= 0) {
        isAllValid = false;
        break;
      }
      validLnPairs.push({
        x: Math.log(p.shearRate),
        y: Math.log(netStress)
      });
    }

    if (!isAllValid || validLnPairs.length < 3) continue;

    const nPts = validLnPairs.length;
    let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;
    validLnPairs.forEach(pair => {
      sumX += pair.x;
      sumY += pair.y;
      sumX2 += pair.x * pair.x;
      sumXY += pair.x * pair.y;
    });

    const denom = (nPts * sumX2 - sumX * sumX);
    if (denom === 0) continue;

    const candidateN = (nPts * sumXY - sumX * sumY) / denom;
    const candidateLnK = (sumY - candidateN * sumX) / nPts;
    const candidateK = Math.exp(candidateLnK);

    if (candidateN <= 0 || candidateN > 2.5 || candidateK <= 0) continue;

    // Evaluate R2 on actual stress points
    const fitted = points.map(p => ({
      shearRate: p.shearRate,
      predictedStress: candidateTau0 + candidateK * Math.pow(p.shearRate, candidateN),
      predictedViscosity: p.shearRate > 0 
        ? (candidateTau0 + candidateK * Math.pow(p.shearRate, candidateN)) / p.shearRate 
        : candidateK
    }));

    const { rSquared } = computeFitMetrics(points, fitted);
    if (rSquared > bestR2) {
      bestR2 = rSquared;
      bestTau0 = candidateTau0;
      bestK = candidateK;
      bestN = candidateN;
    }
  }

  // Fallback to Power Law if no better yield stress found
  if (bestR2 === -Infinity || bestR2 < 0) {
    const pw = fitPowerLawModel(points);
    bestTau0 = 0;
    bestK = pw.parameters.K.value;
    bestN = pw.parameters.n.value;
  }

  const fittedStressPoints = points.map(p => {
    const predStress = bestTau0 + bestK * Math.pow(p.shearRate, bestN);
    return {
      shearRate: p.shearRate,
      predictedStress: predStress,
      predictedViscosity: p.shearRate > 0 ? predStress / p.shearRate : bestK
    };
  });

  const { rSquared, rmse } = computeFitMetrics(points, fittedStressPoints);
  const isPhysical = bestK > 0 && bestN > 0 && bestTau0 >= 0;

  return {
    modelType: 'herschel_bulkley',
    modelNameFa: 'مدل هرشل-بالکلی (Herschel-Bulkley)',
    modelNameEn: 'Herschel-Bulkley Model',
    equationLatex: '\\tau = \\tau_0 + K \\cdot \\dot{\\gamma}^n \\quad (\\text{for } \\tau > \\tau_0)',
    apparentViscosityLatex: '\\eta_a = \\frac{\\tau_0}{\\dot{\\gamma}} + K \\cdot \\dot{\\gamma}^{n - 1}',
    parameters: {
      tau_0: {
        value: bestTau0,
        unit: 'Pa',
        symbol: '\\tau_0',
        nameFa: 'تنش تسلیم ساختاری (Yield Stress)'
      },
      K: {
        value: bestK,
        unit: 'Pa·sⁿ',
        symbol: 'K',
        nameFa: 'شاخص قوام (Consistency Coefficient)'
      },
      n: {
        value: bestN,
        unit: '-',
        symbol: 'n',
        nameFa: 'شاخص رفتار جریان (Flow Behavior Index)'
      }
    },
    rSquared,
    rmse,
    isConverged: isPhysical,
    convergenceWarning: !isPhysical ? 'بهینه‌سازی هرشل-بالکلی به پارامترهای نامعتبر همگرا شد.' : undefined,
    flowBehaviorCategoryFa: 'پلاستیک با تنش تسلیم (Bingham / Herschel-Bulkley / Casson)',
    applicationNotesFa: 'جامع‌ترین و دقیق‌ترین مدل مهندسی صنایع غذایی برای سس کچاپ، رب گوجه‌فرنگی غلیظ، مایونز، پنیر خامه‌ای، پوره میوه‌های غلیظ و شکلات‌های صبحانه با ترکیب تنش تسلیم و رقیق‌شوندگی برشی.',
    limitationsFa: [
      'به دلیل داشتن ۳ پارامتر غیرخطی مستقل، در صورت کم بودن نقاط آزمایشگاهی ممکن است پدیده بیش‌برازش (Overfitting) رخ دهد.',
      'تخمین تنش تسلیم در نرخ‌های برش بسیار پایین به شدت به دقت کالیبراسیون سنسور ترانسدیوسر گشتاور رئومتر وابسته است.'
    ],
    fittedStressPoints
  };
}

/**
 * Helper to compute R^2 and RMSE
 */
function computeFitMetrics(
  actual: ShearDataPoint[],
  predicted: { shearRate: number; predictedStress: number }[]
): { rSquared: number; rmse: number } {
  const n = actual.length;
  let sumActual = 0;
  actual.forEach(p => { sumActual += p.shearStress; });
  const meanActual = sumActual / n;

  let ssTot = 0;
  let ssRes = 0;

  for (let i = 0; i < n; i++) {
    const act = actual[i].shearStress;
    const pred = predicted[i].predictedStress;
    ssTot += Math.pow(act - meanActual, 2);
    ssRes += Math.pow(act - pred, 2);
  }

  const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 1.0;
  const rmse = Math.sqrt(ssRes / n);

  return { rSquared: r2, rmse };
}

/**
 * Pipe Hydraulics & Generalized Metzner-Reed Flow Engine
 * References: Steffe (1996), Toledo (2007), Geankoplis (2003)
 */
export function calculatePipeHydraulics(
  inputs: PipeFlowInputs,
  model: ModelFittingResult
): PipeFlowResult {
  const D = inputs.pipeDiameterM;
  const L = inputs.pipeLengthM;
  const Q_m3h = inputs.volumetricFlowRateM3h;
  const rho = inputs.densityKgM3;
  const pumpEff = inputs.pumpEfficiencyPercent / 100.0;
  const deltaZ = inputs.staticElevationHeadM;

  const Q_m3s = Q_m3h / 3600.0;
  const pipeArea = (Math.PI * D * D) / 4.0;
  const v = pipeArea > 0 ? Q_m3s / pipeArea : 0;

  // Extract model parameters
  let K = 1.0;
  let n = 1.0;
  let tau_0 = 0.0;

  if (model.modelType === 'newtonian') {
    K = model.parameters.mu.value;
    n = 1.0;
    tau_0 = 0.0;
  } else if (model.modelType === 'power_law') {
    K = model.parameters.K.value;
    n = model.parameters.n.value;
    tau_0 = 0.0;
  } else if (model.modelType === 'bingham_plastic') {
    K = model.parameters.mu_p.value;
    n = 1.0;
    tau_0 = model.parameters.tau_0.value;
  } else if (model.modelType === 'herschel_bulkley') {
    K = model.parameters.K.value;
    n = model.parameters.n.value;
    tau_0 = model.parameters.tau_0.value;
  } else if (model.modelType === 'casson') {
    K = model.parameters.mu_c.value;
    n = 1.0;
    tau_0 = model.parameters.tau_0c.value;
  }

  // Metzner-Reed generalized parameters
  const n_prime = n;
  const K_prime = K * Math.pow((3 * n + 1) / (4 * n), n);

  // Generalized Reynolds Number Re_MR
  // Re_MR = (D^n * v^(2-n) * rho) / (8^(n-1) * K')
  const numerator = Math.pow(D, n_prime) * Math.pow(v, 2 - n_prime) * rho;
  const denominator = Math.pow(8, n_prime - 1) * K_prime;
  const Re_MR = denominator > 0 ? numerator / denominator : 1.0;

  // Determine flow regime
  let regime: PipeFlowResult['flowRegimeFa'] = 'آرام (Laminar - Re < 2100)';
  if (Re_MR > 4000) {
    regime = 'مغشوش (Turbulent - Re > 4000)';
  } else if (Re_MR >= 2100) {
    regime = 'انتقالی (Transition - 2100 <= Re <= 4000)';
  }

  // Fanning friction factor f
  let f_fanning = 0.005;
  if (Re_MR < 2100) {
    f_fanning = 16.0 / Re_MR;
  } else {
    // Dodge-Metzner equation for non-Newtonian turbulent flow
    // Approx: 1 / sqrt(f) = (4.0 / n^0.75) * log10(Re_MR * f^(1 - n/2)) - (0.4 / n^1.2)
    // Smooth pipe Blasius approximation with power-law correction
    f_fanning = 0.0791 / (Math.pow(Re_MR, 0.25) * Math.pow(n, 0.15));
  }

  const f_darcy = 4.0 * f_fanning;

  // Wall Shear Rate & Wall Shear Stress
  const wallShearRate = ((3 * n + 1) / (4 * n)) * ((8 * v) / D);
  const wallShearStress = tau_0 + K * Math.pow(wallShearRate, n);
  const apparentViscosityAtWall = wallShearRate > 0 ? wallShearStress / wallShearRate : K;

  // Frictional Pressure Drop: Delta P_f = 4 * f_fanning * (L/D) * (rho * v^2 / 2)
  const dynamicPressure = (rho * v * v) / 2.0;
  const deltaP_f = 4.0 * f_fanning * (L / D) * dynamicPressure;
  const deltaP_f_kPa = deltaP_f / 1000.0;

  // Static Elevation Pressure Drop
  const g = 9.81;
  const deltaP_static = rho * g * deltaZ;
  const totalDeltaP = deltaP_f + deltaP_static;

  // Total Dynamic Head (TDH) in meters of liquid column
  const totalHeadM = (rho * g > 0) ? totalDeltaP / (rho * g) : 0;

  // Pump Power
  const hydPowerWatts = Q_m3s * totalDeltaP;
  const brakePowerWatts = pumpEff > 0 ? hydPowerWatts / pumpEff : hydPowerWatts;
  const motorMargin = 1.15; // 15% safety factor for industrial electric motors
  const electricMotorPowerKW = (brakePowerWatts * motorMargin) / 1000.0;

  const equationTrace = [
    {
      title: 'محاسبه سرعت میانگین سیال در لوله (v)',
      latex: 'v = \\frac{4 Q}{\\pi D^2}',
      substitution: `v = \\frac{4 \\times ${(Q_m3s).toFixed(6)}}{\\pi \\times (${D.toFixed(3)})^2}`,
      result: `v = ${v.toFixed(3)}\\text{ m/s}`
    },
    {
      title: 'شاخص‌های تعمیم‌یافته متزنر-رید (Metzner-Reed)',
      latex: "n' = n, \\quad K' = K \\left( \\frac{3n+1}{4n} \\right)^n",
      substitution: `K' = ${K.toFixed(4)} \\times \\left( \\frac{3(${n.toFixed(2)})+1}{4(${n.toFixed(2)})} \\right)^{${n.toFixed(2)}}`,
      result: `K' = ${K_prime.toFixed(4)}\\text{ Pa}\\cdot\\text{s}^{n'}, \\; n' = ${n_prime.toFixed(3)}`
    },
    {
      title: 'عدد رینولدز تعمیم‌یافته (Generalized Reynolds Re_MR)',
      latex: "\\text{Re}_{MR} = \\frac{D^{n'} v^{2 - n'} \\rho}{8^{n' - 1} K'}",
      substitution: `\\text{Re}_{MR} = \\frac{(${D})^{${n.toFixed(2)}} \\times (${v.toFixed(2)})^{${(2 - n).toFixed(2)}} \\times ${rho}}{8^{${(n - 1).toFixed(2)}} \\times ${K_prime.toFixed(3)}}`,
      result: `\\text{Re}_{MR} = ${Re_MR.toFixed(1)} \\implies \\text{${regime}}`
    },
    {
      title: 'افت فشار اصطکاکی در لوله (Frictional Pressure Drop)',
      latex: '\\Delta P_f = 4 f \\left( \\frac{L}{D} \\right) \\frac{\\rho v^2}{2}',
      substitution: `\\Delta P_f = 4 (${f_fanning.toFixed(5)}) \\times \\left( \\frac{${L}}{${D}} \\right) \\times \\frac{${rho} \\times (${v.toFixed(2)})^2}{2}`,
      result: `\\Delta P_f = ${deltaP_f_kPa.toFixed(2)}\\text{ kPa} \\; (${(deltaP_f / 100000).toFixed(3)}\\text{ bar})`
    },
    {
      title: 'توان هیدرولیکی و الکتروموتور پمپ (Pump Power Sizing)',
      latex: 'P_{hyd} = Q \\cdot \\Delta P_{total}, \\quad P_{motor} = \\frac{P_{hyd}}{\\eta_{pump}} \\times 1.15',
      substitution: `P_{hyd} = ${Q_m3s.toFixed(5)} \\times ${totalDeltaP.toFixed(0)}\\text{ Pa}, \\quad \\eta = ${(pumpEff * 100).toFixed(0)}\\%`,
      result: `P_{brake} = ${(brakePowerWatts / 1000).toFixed(2)}\\text{ kW} \\implies P_{motor} = ${electricMotorPowerKW.toFixed(2)}\\text{ kW}`
    }
  ];

  return {
    flowVelocityMs: v,
    volumetricFlowRateM3s: Q_m3s,
    generalizedReynoldsNumber: Re_MR,
    flowRegimeFa: regime,
    fanningFrictionFactor: f_fanning,
    darcyFrictionFactor: f_darcy,
    wallShearRateS1: wallShearRate,
    wallShearStressPa: wallShearStress,
    apparentViscosityAtWallPaS: apparentViscosityAtWall,
    frictionPressureDropPa: deltaP_f,
    frictionPressureDropKPa: deltaP_f_kPa,
    totalDynamicHeadM: totalHeadM,
    hydraulicPowerWatts: hydPowerWatts,
    brakePowerWatts: brakePowerWatts,
    electricMotorPowerKW: electricMotorPowerKW,
    equationTrace
  };
}
