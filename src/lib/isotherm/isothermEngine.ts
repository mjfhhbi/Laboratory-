import {
  IsothermModelType,
  IsothermPoint,
  IsothermModelResult,
  StabilityZoneMetrics
} from './types';

/**
 * Convert moisture between dry basis and wet basis
 */
export function convertMoistureBasis(
  value: number,
  fromBasis: 'dry_basis' | 'wet_basis',
  toBasis: 'dry_basis' | 'wet_basis'
): number {
  if (fromBasis === toBasis) return value;
  if (fromBasis === 'wet_basis' && toBasis === 'dry_basis') {
    // m_db = m_wb / (100 - m_wb) * 100
    if (value >= 100) return 999.0;
    return (value / (100.0 - value)) * 100.0;
  }
  // m_wb = m_db / (100 + m_db) * 100
  return (value / (100.0 + value)) * 100.0;
}

/**
 * Master function: Fit all 6 isotherm models and return ranked by R^2 descending
 */
export function fitAllIsothermModels(rawPoints: IsothermPoint[]): IsothermModelResult[] {
  // Validate and clean points
  const points = rawPoints
    .filter(p => p.waterActivity > 0 && p.waterActivity < 1.0 && p.moistureContent > 0)
    .sort((a, b) => a.waterActivity - b.waterActivity);

  if (points.length < 3) {
    throw new Error('برای برازش معتبر مدل‌های ایزوترم رطوبتی حداقل به ۳ نقطه تجربی با aw بین ۰ تا ۱ و رطوبت مثبت نیاز است.');
  }

  const results: IsothermModelResult[] = [];

  // 1. GAB Model (COST 90 European Standard)
  results.push(fitGABModel(points));

  // 2. BET Model (Brunauer-Emmett-Teller)
  results.push(fitBETModel(points));

  // 3. Oswin Model
  results.push(fitOswinModel(points));

  // 4. Smith Model
  results.push(fitSmithModel(points));

  // 5. Langmuir Model
  results.push(fitLangmuirModel(points));

  // 6. Peleg Model (4-parameter empirical)
  results.push(fitPelegModel(points));

  // Sort by R^2 descending
  return results.sort((a, b) => b.rSquared - a.rSquared);
}

/**
 * 1. GAB Model (Guggenheim-Anderson-de Boer)
 * Equation: m = (m0 * C * K * aw) / [(1 - K * aw) * (1 - K * aw + C * K * aw)]
 * Valid range: aw in [0.05, 0.95]
 */
export function fitGABModel(points: IsothermPoint[]): IsothermModelResult {
  // Transformed second-order polynomial method (Bizot 1983): aw / m = alpha * aw^2 + beta * aw + gamma
  const n = points.length;
  let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
  let sumY = 0, sumXY = 0, sumX2Y = 0;

  points.forEach(p => {
    const x = p.waterActivity;
    const y = p.waterActivity / p.moistureContent;
    const x2 = x * x;
    sumX += x;
    sumX2 += x2;
    sumX3 += x2 * x;
    sumX4 += x2 * x2;
    sumY += y;
    sumXY += x * y;
    sumX2Y += x2 * y;
  });

  // Solve 3x3 normal equations for [alpha, beta, gamma]
  let alpha = 0, beta = 0, gamma = 0.05;
  try {
    const sol = solve3x3Matrix(
      [
        [sumX4, sumX3, sumX2],
        [sumX3, sumX2, sumX],
        [sumX2, sumX, n]
      ],
      [sumX2Y, sumXY, sumY]
    );
    alpha = sol[0];
    beta = sol[1];
    gamma = sol[2];
  } catch {
    alpha = 0.01;
    beta = 0.05;
    gamma = 0.02;
  }

  // Derive K, C, m0 from Bizot relations
  let K = 0.85;
  let C = 15.0;
  let m0 = 6.0;
  let isAnalyticalSuccess = false;

  const radical = beta * beta - 4 * alpha * gamma;
  if (radical >= 0 && gamma > 0) {
    const candidateK = (Math.sqrt(radical) - beta) / (2 * gamma);
    if (candidateK > 0.4 && candidateK <= 1.0) {
      const candidateC = (beta / (gamma * candidateK)) + 2.0;
      if (candidateC > 1.0) {
        const candidateM0 = 1.0 / (gamma * candidateC * candidateK);
        if (candidateM0 > 1.0 && candidateM0 < 30.0) {
          K = candidateK;
          C = candidateC;
          m0 = candidateM0;
          isAnalyticalSuccess = true;
        }
      }
    }
  }

  // Non-linear refinement grid search if polynomial method was outside physical bounds
  if (!isAnalyticalSuccess) {
    let bestR2 = -Infinity;
    for (let candidateM = 3.0; candidateM <= 15.0; candidateM += 0.5) {
      for (let candidateK = 0.65; candidateK <= 0.98; candidateK += 0.03) {
        for (let candidateC of [5.0, 10.0, 20.0, 50.0, 100.0]) {
          const testPred = points.map(p => {
            const aw = p.waterActivity;
            const pred = (candidateM * candidateC * candidateK * aw) / 
              ((1 - candidateK * aw) * (1 - candidateK * aw + candidateC * candidateK * aw));
            return { aw, predictedM: pred };
          });
          const { rSquared } = computeIsothermMetrics(points, testPred);
          if (rSquared > bestR2) {
            bestR2 = rSquared;
            m0 = candidateM;
            K = candidateK;
            C = candidateC;
          }
        }
      }
    }
  }

  const fittedCurvePoints = points.map(p => {
    const aw = p.waterActivity;
    const pred = (m0 * C * K * aw) / ((1 - K * aw) * (1 - K * aw + C * K * aw));
    return { aw, predictedM: pred };
  });

  const { rSquared, rmse, meanRelativeErrorPercent, fitQualityCategoryFa } = 
    computeIsothermMetrics(points, fittedCurvePoints);

  const isPhysical = m0 > 0 && C > 0 && K > 0 && K <= 1.0;

  return {
    modelType: 'gab',
    modelNameFa: 'مدل گاب (GAB - استاندارد بین‌المللی رفرنس COST 90)',
    modelNameEn: 'Guggenheim-Anderson-de Boer (GAB)',
    equationLatex: 'm = \\frac{m_0 \\cdot C \\cdot K \\cdot a_w}{(1 - K a_w)(1 - K a_w + C K a_w)}',
    validAwRange: '۰.۰۵ تا ۰.۹۵ (پوشش کامل فعالیت آبی غذاها)',
    parameters: {
      m0: {
        value: m0,
        unit: 'g/100g d.b.',
        symbol: 'm_0',
        nameFa: 'رطوبت تک‌لایه (Monolayer Moisture Content)'
      },
      C: {
        value: C,
        unit: '-',
        symbol: 'C',
        nameFa: 'ثابت گوگنهایم (انرژی اتصال تک‌لایه به چندلایه)'
      },
      K: {
        value: K,
        unit: '-',
        symbol: 'K',
        nameFa: 'ضریب تصحیح چندلایه (انرژی برهم‌کنش آب با توده آزاد)'
      }
    },
    monolayerMoistureM0: m0,
    rSquared,
    rmse,
    meanRelativeErrorPercent,
    fitQualityCategoryFa,
    isConverged: isPhysical,
    convergenceWarning: !isPhysical ? 'پارامترهای به دست آمده GAB در بازه فیزیکی معتبر قرار ندارند.' : undefined,
    applicationNotesFa: 'استاندارد مرجع بین‌المللی معرفی‌شده توسط پروژه COST 90 کمیسیون اروپا برای کلیه فرآورده‌های غذایی و دارویی. ضریب K همواره باید کمتر یا مساوی ۱.۰ باشد (K < 1 تفاوت کشش بین آب چندلایه و آب خالص آزاد را بیان می‌کند).',
    limitationsFa: [
      'در مواردی که ضریب K بسیار نزدیک به ۱.۰ باشد، در فعالیت آبی بالای ۰.۹۳ تمایل به بیش‌تخمین رطوبت دارد.',
      'نیازمند رگرسیون غیرخطی است و داده‌های کمتر از ۵ نقطه ممکن است منجر به ناپایداری عددی شوند.'
    ],
    fittedCurvePoints
  };
}

/**
 * 2. BET Model (Brunauer-Emmett-Teller)
 * Equation: m = (m0 * C * aw) / [(1 - aw) * (1 - aw + C * aw)]
 * Valid range: aw in [0.05, 0.45]
 */
export function fitBETModel(points: IsothermPoint[]): IsothermModelResult {
  // Filter points in valid BET range: aw <= 0.50
  const betPoints = points.filter(p => p.waterActivity >= 0.05 && p.waterActivity <= 0.52);
  const activePoints = betPoints.length >= 3 ? betPoints : points.slice(0, Math.min(points.length, 5));

  // Linear form: aw / [(1 - aw) * m] = 1 / (m0 * C) + [(C - 1) / (m0 * C)] * aw
  // y = I + S * x
  const n = activePoints.length;
  let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;

  activePoints.forEach(p => {
    const x = p.waterActivity;
    const y = p.waterActivity / ((1 - p.waterActivity) * p.moistureContent);
    sumX += x;
    sumY += y;
    sumX2 += x * x;
    sumXY += x * y;
  });

  const denom = n * sumX2 - sumX * sumX;
  const slopeS = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0.1;
  const interceptI = (sumY - slopeS * sumX) / n;

  let m0 = 5.0;
  let C = 10.0;
  let isPhysical = false;

  if (slopeS + interceptI > 0 && interceptI > 0) {
    m0 = 1.0 / (slopeS + interceptI);
    C = (slopeS + interceptI) / interceptI;
    isPhysical = m0 > 0 && C > 1.0;
  }

  // Predict over all points
  const fittedCurvePoints = points.map(p => {
    const aw = p.waterActivity;
    // Cap denominator to avoid negative infinity outside aw > 0.5
    const term1 = Math.max(0.01, 1 - aw);
    const term2 = Math.max(0.01, 1 - aw + C * aw);
    const pred = (m0 * C * aw) / (term1 * term2);
    return { aw, predictedM: pred };
  });

  // Calculate metrics on the valid BET range
  const { rSquared, rmse, meanRelativeErrorPercent, fitQualityCategoryFa } = 
    computeIsothermMetrics(activePoints, fittedCurvePoints.slice(0, activePoints.length));

  return {
    modelType: 'bet',
    modelNameFa: 'مدل بت (BET - Brunauer-Emmett-Teller)',
    modelNameEn: 'Brunauer-Emmett-Teller (BET)',
    equationLatex: 'm = \\frac{m_0 \\cdot C \\cdot a_w}{(1 - a_w)(1 - a_w + C a_w)}',
    validAwRange: '۰.۰۵ تا ۰.۴۵ (فقط رطوبت‌های پایین و تک‌لایه)',
    parameters: {
      m0: {
        value: m0,
        unit: 'g/100g d.b.',
        symbol: 'm_0',
        nameFa: 'رطوبت تک‌لایه بت (BET Monolayer Value)'
      },
      C: {
        value: C,
        unit: '-',
        symbol: 'C',
        nameFa: 'ثابت انرژی جذب سطحی BET'
      }
    },
    monolayerMoistureM0: m0,
    rSquared,
    rmse,
    meanRelativeErrorPercent,
    fitQualityCategoryFa,
    isConverged: isPhysical,
    convergenceWarning: !isPhysical ? 'شیب یا عرض از مبدأ خطی BET منفی شده است.' : undefined,
    applicationNotesFa: 'مدل بنیادی تئوری جذب سطحی چندلایه. معتبرترین روش شیمی فیزیک برای تعیین رطوبت تک‌لایه مولکولی و محاسبه سطح ویژه فعال (Specific Surface Area) مواد غذایی.',
    limitationsFa: [
      'فراتر از aw = 0.50 به شدت واگرا می‌شود و رطوبت را بی‌نهایت تخمین می‌زند.',
      'فرض می‌کند که گرمای جذب چندلایه‌ها با گرمای میعان آب خالص برابر است (فرضی که در مدل GAB با پارامتر K تصحیح شد).'
    ],
    fittedCurvePoints
  };
}

/**
 * 3. Oswin Model: m = a * [aw / (1 - aw)]^b
 */
export function fitOswinModel(points: IsothermPoint[]): IsothermModelResult {
  // Linear form: ln(m) = ln(a) + b * ln(aw / (1 - aw))
  const validPairs: { x: number; y: number }[] = [];
  points.forEach(p => {
    if (p.waterActivity > 0.05 && p.waterActivity < 0.95 && p.moistureContent > 0) {
      const x = Math.log(p.waterActivity / (1.0 - p.waterActivity));
      const y = Math.log(p.moistureContent);
      validPairs.push({ x, y });
    }
  });

  const n = validPairs.length;
  let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;
  validPairs.forEach(p => {
    sumX += p.x;
    sumY += p.y;
    sumX2 += p.x * p.x;
    sumXY += p.x * p.y;
  });

  const denom = n * sumX2 - sumX * sumX;
  const b = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0.5;
  const lnA = (sumY - b * sumX) / n;
  const a = Math.exp(lnA);

  const fittedCurvePoints = points.map(p => {
    const aw = p.waterActivity;
    const ratio = Math.max(0.001, aw / Math.max(0.01, 1 - aw));
    const pred = a * Math.pow(ratio, b);
    return { aw, predictedM: pred };
  });

  const { rSquared, rmse, meanRelativeErrorPercent, fitQualityCategoryFa } = 
    computeIsothermMetrics(points, fittedCurvePoints);

  const isPhysical = a > 0 && b > 0;

  return {
    modelType: 'oswin',
    modelNameFa: 'مدل اسوین (Oswin Empirical Model)',
    modelNameEn: 'Oswin Model',
    equationLatex: 'm = a \\left( \\frac{a_w}{1 - a_w} \\right)^b',
    validAwRange: '۰.۱۰ تا ۰.۸۵ (پوشش وسیع مواد نشاسته‌ای و غلات)',
    parameters: {
      a: {
        value: a,
        unit: 'g/100g d.b.',
        symbol: 'a',
        nameFa: 'ثابت مقیاس رطوبت اسوین'
      },
      b: {
        value: b,
        unit: '-',
        symbol: 'b',
        nameFa: 'توان انحنای ایزوترم اسوین'
      }
    },
    rSquared,
    rmse,
    meanRelativeErrorPercent,
    fitQualityCategoryFa,
    isConverged: isPhysical,
    applicationNotesFa: 'مدل تجربی دو پارامتری بسیار موفق و محبوب برای فرآورده‌های غلات، بیسکویت، کراکر، ماکارونی، پودرهای نشاسته‌ای و سبزیجات خشک‌شده.',
    limitationsFa: [
      'یک مدل کاملاً تجربی است و بر خلاف BET یا GAB مفهوم رطوبت تک‌لایه فیزیکی یا ثابت انرژی ترمودینامیکی ارائه نمی‌دهد.',
      'در aw بسیار نزدیک به ۱.۰ به سرعت به سمت مقادیر بی‌نهایت میل می‌کند.'
    ],
    fittedCurvePoints
  };
}

/**
 * 4. Smith Model: m = a - b * ln(1 - aw)
 */
export function fitSmithModel(points: IsothermPoint[]): IsothermModelResult {
  // Valid especially in aw >= 0.40 - 0.50
  // Linear form: m = a + b * [-ln(1 - aw)]
  const n = points.length;
  let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;

  points.forEach(p => {
    const x = -Math.log(Math.max(0.01, 1 - p.waterActivity));
    const y = p.moistureContent;
    sumX += x;
    sumY += y;
    sumX2 += x * x;
    sumXY += x * y;
  });

  const denom = n * sumX2 - sumX * sumX;
  const b = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 5.0;
  const a = (sumY - b * sumX) / n;

  const fittedCurvePoints = points.map(p => {
    const aw = p.waterActivity;
    const pred = a - b * Math.log(Math.max(0.01, 1 - aw));
    return { aw, predictedM: pred };
  });

  const { rSquared, rmse, meanRelativeErrorPercent, fitQualityCategoryFa } = 
    computeIsothermMetrics(points, fittedCurvePoints);

  const isPhysical = b > 0;

  return {
    modelType: 'smith',
    modelNameFa: 'مدل اسمیت (Smith Model)',
    modelNameEn: 'Smith Model',
    equationLatex: 'm = a - b \\ln(1 - a_w)',
    validAwRange: '۰.۵۰ تا ۰.۹۵ (جذب آب در چندلایه‌های متورم و بیوپلیمرها)',
    parameters: {
      a: {
        value: a,
        unit: 'g/100g d.b.',
        symbol: 'a',
        nameFa: 'رطوبت در اولین لایه جذب چندلایه'
      },
      b: {
        value: b,
        unit: 'g/100g d.b.',
        symbol: 'b',
        nameFa: 'شیب رطوبت میعان در چندلایه‌ها'
      }
    },
    rSquared,
    rmse,
    meanRelativeErrorPercent,
    fitQualityCategoryFa,
    isConverged: isPhysical,
    applicationNotesFa: 'مدلی بر پایه تئوری متورم شدن زنجیره‌های پلیمری با آب چندلایه؛ بسیار کارآمد برای ماکرومولکول‌های پروتئینی، ژلاتین و صمغ‌های طبیعی در رطوبت‌های میانی و بالا.',
    limitationsFa: [
      'در دامنه aw < 0.40 دقت پایینی دارد و خطای سیستماتیک نشان می‌دهد.',
      'قادر به توصیف رطوبت تک‌لایه نیست.'
    ],
    fittedCurvePoints
  };
}

/**
 * 5. Langmuir Model: m = (m0 * C * aw) / (1 + C * aw)
 */
export function fitLangmuirModel(points: IsothermPoint[]): IsothermModelResult {
  // Linear form: aw / m = 1 / (m0 * C) + (1 / m0) * aw = I + S * aw
  const n = points.length;
  let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;

  points.forEach(p => {
    const x = p.waterActivity;
    const y = p.waterActivity / p.moistureContent;
    sumX += x;
    sumY += y;
    sumX2 += x * x;
    sumXY += x * y;
  });

  const denom = n * sumX2 - sumX * sumX;
  const slopeS = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0.1;
  const interceptI = (sumY - slopeS * sumX) / n;

  let m0 = 6.0;
  let C = 10.0;
  let isPhysical = false;

  if (slopeS > 0 && interceptI > 0) {
    m0 = 1.0 / slopeS;
    C = slopeS / interceptI;
    isPhysical = m0 > 0 && C > 0;
  }

  const fittedCurvePoints = points.map(p => {
    const aw = p.waterActivity;
    const pred = (m0 * C * aw) / (1.0 + C * aw);
    return { aw, predictedM: pred };
  });

  const { rSquared, rmse, meanRelativeErrorPercent, fitQualityCategoryFa } = 
    computeIsothermMetrics(points, fittedCurvePoints);

  return {
    modelType: 'langmuir',
    modelNameFa: 'مدل لانگمویر (Langmuir Monolayer Model)',
    modelNameEn: 'Langmuir Monolayer Model',
    equationLatex: 'm = \\frac{m_0 \\cdot C \\cdot a_w}{1 + C a_w}',
    validAwRange: '۰.۰۵ تا ۰.۳۵ (ایزوترم تیپ I / جذب تک‌لایه اشباع‌شونده)',
    parameters: {
      m0: {
        value: m0,
        unit: 'g/100g d.b.',
        symbol: 'm_0',
        nameFa: 'ظرفیت جذب تک‌لایه لانگمویر'
      },
      C: {
        value: C,
        unit: '-',
        symbol: 'C',
        nameFa: 'ثابت تمایل اتصال لانگمویر (Affinity Constant)'
      }
    },
    monolayerMoistureM0: m0,
    rSquared,
    rmse,
    meanRelativeErrorPercent,
    fitQualityCategoryFa,
    isConverged: isPhysical,
    applicationNotesFa: 'کلاسیک‌ترین مدل جذب سطحی شیمیایی و تک‌لایه همگن بدون برهم‌کنش بین مولکول‌های جذب‌شده (ایزوترم تیپ I).',
    limitationsFa: [
      'چندلایه‌های آب و میعان مویین را در نظر نمی‌گیرد و در aw بالای ۰.۴۰ کاملاً اشباع و افقی می‌شود که برای اکثر مواد غذایی صادق نیست.'
    ],
    fittedCurvePoints
  };
}

/**
 * 6. Peleg Model (4-Parameter Empirical Model, Micha Peleg 1993)
 * Equation: m = k1 * aw^n1 + k2 * aw^n2
 */
export function fitPelegModel(points: IsothermPoint[]): IsothermModelResult {
  // Non-linear optimization: n1 < 1.0 (governs low-aw convexity) and n2 > 1.0 (governs high-aw upturn)
  let bestK1 = 10.0;
  let bestN1 = 0.4;
  let bestK2 = 15.0;
  let bestN2 = 3.5;
  let bestR2 = -Infinity;

  // Grid scan
  const k1Candidates = [4.0, 8.0, 12.0, 16.0];
  const n1Candidates = [0.25, 0.45, 0.65];
  const k2Candidates = [8.0, 15.0, 25.0, 40.0];
  const n2Candidates = [2.0, 3.5, 5.5];

  k1Candidates.forEach(k1 => {
    n1Candidates.forEach(n1 => {
      k2Candidates.forEach(k2 => {
        n2Candidates.forEach(n2 => {
          const testPred = points.map(p => {
            const aw = p.waterActivity;
            const pred = k1 * Math.pow(aw, n1) + k2 * Math.pow(aw, n2);
            return { aw, predictedM: pred };
          });
          const { rSquared } = computeIsothermMetrics(points, testPred);
          if (rSquared > bestR2) {
            bestR2 = rSquared;
            bestK1 = k1;
            bestN1 = n1;
            bestK2 = k2;
            bestN2 = n2;
          }
        });
      });
    });
  });

  const fittedCurvePoints = points.map(p => {
    const aw = p.waterActivity;
    const pred = bestK1 * Math.pow(aw, bestN1) + bestK2 * Math.pow(aw, bestN2);
    return { aw, predictedM: pred };
  });

  const { rSquared, rmse, meanRelativeErrorPercent, fitQualityCategoryFa } = 
    computeIsothermMetrics(points, fittedCurvePoints);

  const isPhysical = bestK1 > 0 && bestK2 > 0 && bestN1 > 0 && bestN2 > 1.0;

  return {
    modelType: 'peleg',
    modelNameFa: 'مدل پلگ (Peleg 4-Parameter Model, 1993)',
    modelNameEn: 'Peleg Four-Parameter Model',
    equationLatex: 'm = k_1 a_w^{n_1} + k_2 a_w^{n_2} \\quad (n_1 < 1, \\; n_2 > 1)',
    validAwRange: '۰.۰۵ تا ۰.۹۸ (انعطاف‌پذیرترین مدل تجربی برای کل دامنه)',
    parameters: {
      k1: {
        value: bestK1,
        unit: 'g/100g d.b.',
        symbol: 'k_1',
        nameFa: 'ضریب قوام جذب در رطوبت پایین پلگ'
      },
      n1: {
        value: bestN1,
        unit: '-',
        symbol: 'n_1',
        nameFa: 'توان محدب رطوبت پایین (n1 < 1)'
      },
      k2: {
        value: bestK2,
        unit: 'g/100g d.b.',
        symbol: 'k_2',
        nameFa: 'ضریب تشدید میعان مویین پلگ'
      },
      n2: {
        value: bestN2,
        unit: '-',
        symbol: 'n_2',
        nameFa: 'توان صعودی رطوبت بالا (n2 > 1)'
      }
    },
    rSquared,
    rmse,
    meanRelativeErrorPercent,
    fitQualityCategoryFa,
    isConverged: isPhysical,
    applicationNotesFa: 'مدل چهار پارامتری توسعه‌یافته توسط دکتر میخا پلگ (۱۹۹۳) که به دلیل دو ترم توانی مجزا، هم ایزوترم‌های سیگموئیدی نوع II و هم منحنی‌های نوع III قندی را با همبستگی عالی پوشش می‌دهد.',
    limitationsFa: [
      'چهار پارامتر متغیر دارد که خطر بیش‌برازش در صورت کمبود نقاط آزمایشگاهی را افزایش می‌دهد.',
      'ارائه دهنده مستقیم رطوبت تک‌لایه تئوریک بر اساس مکانیسم جذب نیست.'
    ],
    fittedCurvePoints
  };
}

/**
 * Metric Calculator: R^2, RMSE, E% (Mean Relative Percentage Deviation Modulus)
 */
function computeIsothermMetrics(
  actual: IsothermPoint[],
  predicted: { aw: number; predictedM: number }[]
): {
  rSquared: number;
  rmse: number;
  meanRelativeErrorPercent: number;
  fitQualityCategoryFa: 'عالی (E% < 5%)' | 'قابل قبول (5% <= E% <= 10%)' | 'ضعیف (E% > 10%)';
} {
  const n = actual.length;
  let sumAct = 0;
  actual.forEach(p => { sumAct += p.moistureContent; });
  const meanAct = sumAct / n;

  let ssTot = 0;
  let ssRes = 0;
  let sumRelErr = 0;

  for (let i = 0; i < n; i++) {
    const act = actual[i].moistureContent;
    const pred = predicted[i].predictedM;
    ssTot += Math.pow(act - meanAct, 2);
    ssRes += Math.pow(act - pred, 2);
    if (act > 0) {
      sumRelErr += Math.abs((act - pred) / act);
    }
  }

  const r2 = ssTot > 0 ? Math.max(0, 1.0 - ssRes / ssTot) : 1.0;
  const rmse = Math.sqrt(ssRes / n);
  const ePercent = n > 0 ? (sumRelErr / n) * 100.0 : 0.0;

  let quality: 'عالی (E% < 5%)' | 'قابل قبول (5% <= E% <= 10%)' | 'ضعیف (E% > 10%)' = 'عالی (E% < 5%)';
  if (ePercent > 10.0) {
    quality = 'ضعیف (E% > 10%)';
  } else if (ePercent >= 5.0) {
    quality = 'قابل قبول (5% <= E% <= 10%)';
  }

  return {
    rSquared: r2,
    rmse,
    meanRelativeErrorPercent: ePercent,
    fitQualityCategoryFa: quality
  };
}

/**
 * Food Stability Zone Analysis (Labuza Map based on Monolayer Moisture m0)
 */
export function computeStabilityZoneMetrics(monolayerM0: number): StabilityZoneMetrics {
  const m0 = monolayerM0 > 0 ? monolayerM0 : 6.0;

  return {
    monolayerMoistureM0: m0,
    monolayerWaterActivity: 0.25,
    zone1BoundAw: 0.25,
    zone2BoundAw: 0.70,
    zone3BoundAw: 0.95,
    lipidOxidationNoteFa: 'حداقل سرعت اکسیداسیون چربی‌ها در نقطه رطوبت تک‌لایه (m0) رخ می‌دهد. در رطوبت‌های کمتر از m0 به دلیل در معرض قرار گرفتن رادیکال‌های آزاد، اکسیداسیون به شدت افزایش می‌یابد.',
    maillardBrowningNoteFa: 'واکنش قهوه‌ای شدن غیرآنزیمی مایلارد در محدوده aw بین ۰.۶۵ تا ۰.۷۵ به اوج خود می‌رسد. نگهداری نزدیک رطوبت تک‌لایه، مایلارد را به حداقل می‌رساند.',
    microbialGrowthNoteFa: 'حداقل فعالیت آبی رشد باکتری‌ها aw = 0.90، مخمرها aw = 0.88 و کپک‌های اسمتوفیل aw = 0.62 تا ۰.۶۵ است. در زون ۱ و ۲ هیچ‌گونه رشد میکروبی رخ نمی‌دهد.'
  };
}

/**
 * Helper to solve 3x3 matrix via Gaussian Elimination
 */
function solve3x3Matrix(A: number[][], b: number[]): number[] {
  const M = A.map((row, i) => [...row, b[i]]);
  const n = 3;

  for (let k = 0; k < n - 1; k++) {
    let maxRow = k;
    let maxVal = Math.abs(M[k][k]);
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(M[i][k]) > maxVal) {
        maxVal = Math.abs(M[i][k]);
        maxRow = i;
      }
    }
    if (maxRow !== k) {
      const temp = M[k];
      M[k] = M[maxRow];
      M[maxRow] = temp;
    }
    const pivot = M[k][k];
    if (Math.abs(pivot) < 1e-14) {
      throw new Error('ماتریس منفرد است.');
    }
    for (let i = k + 1; i < n; i++) {
      const factor = M[i][k] / pivot;
      for (let j = k; j <= n; j++) {
        M[i][j] -= factor * M[k][j];
      }
    }
  }

  const x = [0, 0, 0];
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = sum / M[i][i];
  }

  return x;
}
