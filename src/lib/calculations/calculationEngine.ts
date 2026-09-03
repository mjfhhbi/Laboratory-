/**
 * Food Science AI - Calculation Engine & Laboratory Error Control
 * Part 9 of 10
 * 
 * Standalone, pure, fully traceable calculation engine with:
 * - Direct execution of standard food science formulas (Moisture, Ash, Protein, Fat, Dilution, Acidity, Peroxide, Salt)
 * - Extensible custom formula builder & safe expression evaluator
 * - Statistical analysis (Mean, Variance, StdDev, %RSD, SE, 95% Confidence Interval, Dixon Q-test, Outlier detection)
 * - Complete Unit Conversion engine across physical & chemical laboratory dimensions
 * - Sanity & Range validation with non-destructive domain warnings
 * - Strict Scientific Truth mandate: Never guess constants or acceptance limits; explicit traceability for every calculation step.
 */

import {
  FormulaDefinition,
  CalculationResult,
  CalculationOptions,
  StatisticalSummary,
  CustomFormulaRecord
} from '../../types/calculations';

import { convertUnit, getUnitsByCategory, LAB_UNITS, ConversionResult } from './unitConverter';
import { calculateStatistics } from './statisticalEngine';
import { evaluateExpression, tokenize, parseToRpn } from './expressionEvaluator';
import { DEFAULT_FOOD_FORMULAS, formatScientificNumber } from './foodFormulas';
import {
  getFormulaById,
  getAllFormulas,
  saveCustomFormula,
  deleteCustomFormula,
  loadCustomFormulasFromStorage,
  validateFormulaExpression
} from './formulaRegistry';

export {
  convertUnit,
  getUnitsByCategory,
  LAB_UNITS,
  calculateStatistics,
  evaluateExpression,
  tokenize,
  parseToRpn,
  DEFAULT_FOOD_FORMULAS,
  formatScientificNumber,
  getFormulaById,
  getAllFormulas,
  saveCustomFormula,
  deleteCustomFormula,
  loadCustomFormulasFromStorage,
  validateFormulaExpression
};

export type { ConversionResult };

/**
 * Execute a calculation on a registered formula with input normalization and unit verification
 */
export function runFormulaCalculation(
  formulaId: string,
  rawInputs: Record<string, number | undefined>,
  options: CalculationOptions = {}
): CalculationResult {
  const formula = getFormulaById(formulaId);
  if (!formula) {
    return {
      success: false,
      value: null,
      formattedValue: '-',
      unit: '',
      decimals: options.decimals ?? 2,
      isScientificallyValid: false,
      trace: [],
      warnings: ['فرمول درخواستی در سامانه یافت نشد.'],
      errors: [`فرمول با شناسه '${formulaId}' موجود نیست.`],
      evaluatedAt: new Date().toISOString()
    };
  }

  // Convert inputs if inputUnits are provided
  const normalizedInputs: Record<string, number | undefined> = { ...rawInputs };

  if (options.inputUnits && formula.variables) {
    for (const v of formula.variables) {
      const userUnit = options.inputUnits[v.id] || options.inputUnits[v.symbol];
      const rawVal = rawInputs[v.id] ?? rawInputs[v.symbol];

      if (rawVal !== undefined && userUnit && userUnit !== v.defaultUnit) {
        const conv = convertUnit(rawVal, userUnit, v.defaultUnit);
        if (conv.success) {
          normalizedInputs[v.id] = conv.value;
          normalizedInputs[v.symbol] = conv.value;
        }
      }
    }
  }

  return formula.execute(normalizedInputs, options);
}

/**
 * Self-Test Suite for Calculation Engine
 * Validates mathematical precision, bounds checks, unit conversions, and domain rules.
 */
export interface SelfTestResult {
  testId: string;
  nameFa: string;
  category: string;
  passed: boolean;
  expected: string;
  actual: string;
  detailsFa: string;
  durationMs: number;
}

export function runCalculationEngineSelfTests(): {
  total: number;
  passed: number;
  failed: number;
  results: SelfTestResult[];
} {
  const results: SelfTestResult[] = [];

  const runTest = (
    testId: string,
    nameFa: string,
    category: string,
    fn: () => { passed: boolean; expected: string; actual: string; detailsFa: string }
  ) => {
    const t0 = performance.now();
    try {
      const res = fn();
      const durationMs = performance.now() - t0;
      results.push({
        testId,
        nameFa,
        category,
        passed: res.passed,
        expected: res.expected,
        actual: res.actual,
        detailsFa: res.detailsFa,
        durationMs: Math.round(durationMs * 100) / 100
      });
    } catch (err: unknown) {
      results.push({
        testId,
        nameFa,
        category,
        passed: false,
        expected: 'بدون استثنا',
        actual: `خطا: ${err instanceof Error ? err.message : String(err)}`,
        detailsFa: 'پرتاب استثنای پیش‌بینی‌نشده حین آزمون',
        durationMs: 0
      });
    }
  };

  // 1. Moisture Test (AOAC 925.10): m0=20.000g, m1=25.000g, m2=24.250g -> sample=5g, loss=0.75g -> 15.00%
  runTest('T01_MOISTURE', 'صحت محاسبه درصد رطوبت آون (AOAC 925.10)', 'آزمون‌های تقریب', () => {
    const res = runFormulaCalculation('moisture_oven', { m0: 20.0, m1: 25.0, m2: 24.25 }, { decimals: 2 });
    const passed = res.success && res.value === 15.0 && res.formattedValue === '15.00' && res.unit === '%';
    return {
      passed,
      expected: '15.00% (ماده خشک 85.00%)',
      actual: `${res.formattedValue}%`,
      detailsFa: 'بررسی صحت کسر وزن ظرف، محاسبه تلفات رطوبت و گام‌های Trace'
    };
  });

  // 2. Moisture Sanity Check (Illogical: m2 > m1)
  runTest('T02_MOISTURE_SANITY', 'تشخیص ورودی غیرمنطقی رطوبت (وزن بعد از آون > قبل از آون)', 'کنترل خطا و هشدار', () => {
    const res = runFormulaCalculation('moisture_oven', { m0: 20.0, m1: 25.0, m2: 25.5 }, { decimals: 2 });
    const passed = res.warnings.length > 0 && res.warnings.some(w => w.includes('افزایش وزن') || w.includes('بیشتر است'));
    return {
      passed,
      expected: 'تولید هشدار غیرمنطقی بودن بدون دستکاری داده ورودی',
      actual: res.warnings.join(' | '),
      detailsFa: 'سیستم نباید ورودی کاربر را خودکار عوض کند؛ باید هشدار واضح دهد.'
    };
  });

  // 3. Ash Test (AOAC 923.03): m0=15.000g, m1=20.000g, m2=15.075g -> sample=5g, ash=0.075g -> 1.50%
  runTest('T03_ASH', 'صحت محاسبه درصد خاکستر کل کوره (AOAC 923.03)', 'آزمون‌های تقریب', () => {
    const res = runFormulaCalculation('ash_furnace', { m0: 15.0, m1: 20.0, m2: 15.075 }, { decimals: 2 });
    const passed = res.success && Math.abs((res.value || 0) - 1.5) < 0.001;
    return {
      passed,
      expected: '1.50%',
      actual: `${res.formattedValue}%`,
      detailsFa: 'محاسبه املاح معدنی نسوخته در دمای ۵۵۰ درجه'
    };
  });

  // 4. Protein Kjeldahl Test: vs=18.5mL, vb=0.1mL, N=0.1N, m=2.0g, F=6.25 -> N%=1.2886% -> Protein=8.05%
  runTest('T04_PROTEIN_KJELDAHL', 'صحت محاسبه پروتئین خام کجلدال (AOAC 991.20)', 'شیمی تجزیه مواد غذایی', () => {
    const res = runFormulaCalculation('protein_kjeldahl', {
      vs: 18.5,
      vb: 0.1,
      n_acid: 0.1,
      m_sample: 2.0,
      f_factor: 6.25
    }, { decimals: 2 });
    // Net=18.4 mL * 0.1 * 0.014007 * 100 / 2 = 1.288644% N * 6.25 = 8.054% -> 8.05%
    const passed = res.success && res.formattedValue === '8.05';
    return {
      passed,
      expected: '8.05%',
      actual: `${res.formattedValue}%`,
      detailsFa: 'محاسبه حجم خالص تیترانت، نیتروژن کل و اعمال فاکتور پروتئین'
    };
  });

  // 5. Fat Soxhlet Test: m1=100.00g, m2=100.45g, m_sample=5.00g -> fat=0.45g -> 9.00%
  runTest('T05_FAT_SOXHLET', 'صحت محاسبه درصد چربی سوکسله (AOAC 920.39)', 'آزمون‌های تقریب', () => {
    const res = runFormulaCalculation('fat_soxhlet', { m1: 100.0, m2: 100.45, m_sample: 5.0 }, { decimals: 2 });
    const passed = res.success && res.formattedValue === '9.00';
    return {
      passed,
      expected: '9.00%',
      actual: `${res.formattedValue}%`,
      detailsFa: 'محاسبه چربی استخراج شده با حلال و درصد وزنی تر'
    };
  });

  // 6. Dilution Equation C1V1=C2V2: C1=10M, C2=0.5M, V2=500mL -> V1 = (0.5 * 500) / 10 = 25.00 mL
  runTest('T06_DILUTION', 'صحت معادله رقت و محلول‌سازی (C₁V₁ = C₂V₂)', 'محلول‌سازی و رقت', () => {
    const res = runFormulaCalculation('dilution_c1v1', { c1: 10, c2: 0.5, v2: 500 }, { decimals: 2 });
    const passed = res.success && res.formattedValue === '25.00' && res.unit === 'mL';
    return {
      passed,
      expected: '25.00 mL (حجم حلال: 475.00 mL، ضریب رقت: 20X)',
      actual: `${res.formattedValue} ${res.unit}`,
      detailsFa: 'محاسبه حجم برداشت استوک، آب مقطر مورد نیاز و ضریب رقت'
    };
  });

  // 7. Statistical Engine: Series [10.2, 10.4, 10.1, 10.5, 10.3] -> mean=10.30, stdDev=0.1581, RSD=1.53%
  runTest('T07_STATISTICS_REPLICATES', 'موتور آمار: محاسبه میانگین، انحراف معیار و %RSD', 'آمار آزمایشگاهی و تکرارها', () => {
    const stats = calculateStatistics([10.2, 10.4, 10.1, 10.5, 10.3], 10.0, 'g');
    const meanOk = Math.abs(stats.mean - 10.3) < 0.001;
    const stdDevOk = Math.abs(stats.stdDev - 0.1581) < 0.01;
    const rsdOk = Math.abs(stats.rsdPercent - 1.53) < 0.05;
    const errorOk = stats.errorPercentAgainstRef !== undefined && Math.abs(stats.errorPercentAgainstRef - 3.0) < 0.01;
    const passed = meanOk && stdDevOk && rsdOk && errorOk && stats.count === 5;
    return {
      passed,
      expected: 'Mean=10.30, StdDev=0.158, RSD=1.53%, Error%=3.00%',
      actual: `Mean=${stats.mean.toFixed(2)}, StdDev=${stats.stdDev.toFixed(3)}, RSD=${stats.rsdPercent.toFixed(2)}%, Error%=${stats.errorPercentAgainstRef?.toFixed(2)}%`,
      detailsFa: 'صحت محاسبات میانگین، واریانس نمونه، انحراف معیار نسبی و درصد خطا'
    };
  });

  // 8. Dixon Q-Test Outlier Detection: Series [10.0, 10.1, 10.2, 14.5] (n=4, range=4.5, qLow or qHigh for 14.5 is (14.5-10.2)/4.5 = 0.955 > 0.765)
  runTest('T08_OUTLIER_DIXON', 'تشخیص داده پرت با آزمون دیکسون (Dixon Q-Test)', 'کنترل خطا و داده پرت', () => {
    const stats = calculateStatistics([10.0, 10.1, 10.2, 14.5]);
    const passed = stats.outliers.length > 0 && stats.outliers[0].value === 14.5;
    return {
      passed,
      expected: 'شناسایی مقدار 14.5 به عنوان داده پرت با سطح اطمینان ۹۰٪',
      actual: stats.outliers.map(o => `${o.value} (${o.test})`).join(' | ') || 'هیچ',
      detailsFa: 'عدم حذف خودکار داده و گزارش اخطار در Traceability'
    };
  });

  // 9. Unit Converter: 2.5 kg -> 2500 g, 50 °F -> 10 °C
  runTest('T09_UNIT_CONVERTER', 'صحت مبدل واحدهای آزمایشگاهی (جرم و دما)', 'تبدیل واحد', () => {
    const convMass = convertUnit(2.5, 'kg', 'g');
    const convTemp = convertUnit(50, 'f', 'c');
    const passed = convMass.success && convMass.value === 2500 && convTemp.success && Math.abs(convTemp.value - 10) < 0.01;
    return {
      passed,
      expected: '2.5 kg = 2500 g | 50 °F = 10.0 °C',
      actual: `${convMass.value} ${convMass.toUnit} | ${convTemp.value.toFixed(1)} ${convTemp.toUnit}`,
      detailsFa: 'تبدیل خطی جرم و تبدیل آفین دمای فارنهایت به سلسیوس'
    };
  });

  // 10. Expression Evaluator: Safe Sandboxed AST parser (e.g. `(a + b) * sqrt(c) / 2`)
  runTest('T10_EXPRESSION_PARSER', 'صحت ارزیاب عبارات ریاضی سفارشی و درخت محاسباتی', 'فرمول‌ساز داینامیک', () => {
    const evalRes = evaluateExpression('(a + b) * sqrt(c) / 2', { a: 4, b: 6, c: 16 });
    // (4 + 6) * 4 / 2 = 10 * 4 / 2 = 20
    const passed = evalRes.result === 20;
    return {
      passed,
      expected: '20',
      actual: String(evalRes.result),
      detailsFa: 'آزمون توکنایزر، تبدیل RPN، پردازش توابع sqrt و تقدم عملگرها بدون استفاده از eval()'
    };
  });

  // 11. Crude Fiber (INSO 316 / AOAC 962.09): m1=30.500g, m2=30.400g, m_sample=2.000g -> loss=0.100g -> 5.00%
  runTest('T11_CRUDE_FIBER', 'صحت محاسبه فیبر خام روش وندی (AOAC 962.09 / INSO 316)', 'آزمون‌های تقریب', () => {
    const res = runFormulaCalculation('crude_fiber_weende', { m1: 30.500, m2: 30.400, m_sample: 2.0 }, { decimals: 2 });
    const passed = res.success && res.formattedValue === '5.00' && res.unit === '%';
    return {
      passed,
      expected: '5.00%',
      actual: `${res.formattedValue}%`,
      detailsFa: 'سوزاندن باقیمانده هضم اسیدی/قلیایی در کوره ۵۵۰ درجه'
    };
  });

  // 12. Carbohydrate by Difference & Energy (FAO): M=10%, P=12%, F=5%, A=3% -> Carb = 70.00%, Energy = (12*4)+(70*4)+(5*9) = 48+280+45 = 373 kcal/100g
  runTest('T12_CARBOHYDRATE_DIFF', 'صحت محاسبه کربوهیدرات کل به روش تفاضل و کالری آت‌واتر (FAO)', 'آنالیز تقریب و ارزش تغذیه‌ای', () => {
    const res = runFormulaCalculation('carbohydrate_by_difference', {
      pct_moisture: 10.0,
      pct_protein: 12.0,
      pct_fat: 5.0,
      pct_ash: 3.0
    }, { decimals: 2 });
    const passed = res.success && res.formattedValue === '70.00' && (res.metadata as any)?.energyKcalPer100g === 373;
    return {
      passed,
      expected: 'Carb=70.00%, Energy=373 kcal/100g',
      actual: `Carb=${res.formattedValue}%, Energy=${(res.metadata as any)?.energyKcalPer100g} kcal/100g`,
      detailsFa: 'تفاضل چهار فاکتور اصلی تقریب و محاسبه انرژی متابولیکی'
    };
  });

  // 13. Brix and Temperature Correction (ICUMSA SPS-3 / AOAC 932.12): Obs=20.0 Brix at 25°C -> deltaT=5 -> factor = 5 * (0.0007*20 + 0.06) = 5 * 0.074 = 0.37 -> Corrected = 20.37 °Brix
  runTest('T13_BRIX_CORRECTION', 'صحت تصحیح دمایی درجه بریکس رفراکتومتر (ICUMSA SPS-3)', 'خواص فیزیکوشیمیایی', () => {
    const res = runFormulaCalculation('brix_temperature_correction', { brix_obs: 20.0, temperature: 25.0 }, { decimals: 2 });
    const passed = res.success && res.formattedValue === '20.37' && res.unit === '°Brix';
    return {
      passed,
      expected: '20.37 °Brix',
      actual: `${res.formattedValue} ${res.unit}`,
      detailsFa: 'تصحیح انحراف دمای ۲۵ درجه به دمای استاندارد ۲۰ درجه'
    };
  });

  // 14. Extraction/Process Yield: product=25kg, raw=100kg -> 25.00%
  runTest('T14_PROCESS_YIELD', 'صحت محاسبه راندمان استخراج و فرآوری (% Yield)', 'مهندسی فرآیند', () => {
    const res = runFormulaCalculation('process_yield', { m_product: 25.0, m_raw: 100.0 }, { decimals: 2 });
    const passed = res.success && res.formattedValue === '25.00' && res.unit === '%';
    return {
      passed,
      expected: '25.00%',
      actual: `${res.formattedValue}%`,
      detailsFa: 'نسبت جرم محصول نهایی به خوراک ورودی اولیه'
    };
  });

  // 15. Analytical Spike Recovery (AOAC / EURACHEM): unspiked=2.0 ppm, spiked=11.8 ppm, added=10.0 ppm -> Recovery = (9.8/10.0)*100 = 98.00%
  runTest('T15_SPIKE_RECOVERY', 'صحت محاسبه درصد بازیابی اسپایک و کنترل کیفیت (AOAC / EURACHEM)', 'کنترل کیفیت شیمیایی', () => {
    const res = runFormulaCalculation('spike_recovery', { c_unspiked: 2.0, c_spiked: 11.8, c_added: 10.0 }, { decimals: 2 });
    const passed = res.success && res.formattedValue === '98.00' && res.unit === '%';
    return {
      passed,
      expected: '98.00%',
      actual: `${res.formattedValue}%`,
      detailsFa: 'ارزیابی خطای سیستماتیک و بازیابی آنالیت در ماتریس نمونه'
    };
  });

  // 16. Mass Balance Evaporative Concentration: feed=1000kg @ 5% TS, target=25% TS -> concentrate = (1000*5)/25 = 200.00 kg, water evaporated = 800 kg
  runTest('T16_MASS_BALANCE', 'صحت تراز جرم مواد جامد و تبخیر در تغلیظ (Mass Balance)', 'مهندسی فرآیند', () => {
    const res = runFormulaCalculation('mass_balance_concentration', { m1_feed: 1000.0, s1_feed: 5.0, s2_target: 25.0 }, { decimals: 2 });
    const passed = res.success && res.formattedValue === '200.00' && res.unit === 'kg' && (res.metadata as any)?.waterEvaporatedKg === 800;
    return {
      passed,
      expected: '200.00 kg کنسانتره (800 kg آب تبخیر شده)',
      actual: `${res.formattedValue} kg`,
      detailsFa: 'قانون بقای جرم ماده خشک در اواپراتور'
    };
  });

  // 17. Molarity (IUPAC): m=5.844g, MW=58.44 g/mol, V=1000 mL -> n=0.1 mol -> M = 0.1000 mol/L
  runTest('T17_MOLARITY', 'صحت محاسبه مولاریته (Molarity - M)', 'محلول‌سازی و غلظت', () => {
    const res = runFormulaCalculation('molarity_calc', { m_solute: 5.844, mw: 58.44, v_solution: 1000 }, { decimals: 4 });
    const passed = res.success && res.formattedValue === '0.1000';
    return {
      passed,
      expected: '0.1000 mol/L',
      actual: `${res.formattedValue} mol/L`,
      detailsFa: 'تبدیل جرم به مول و تقسیم بر حجم محلول'
    };
  });

  // 18. Normality: m=4.904g H2SO4, MW=98.08, n_eq=2 (EW=49.04), V=1000 mL -> eq = 0.1 -> N = 0.1000 eq/L
  runTest('T18_NORMALITY', 'صحت محاسبه نرمالیته و وزن اکی‌والان (Normality - N)', 'محلول‌سازی و غلظت', () => {
    const res = runFormulaCalculation('normality_calc', { m_solute: 4.904, mw: 98.08, n_equiv: 2, v_solution: 1000 }, { decimals: 4 });
    const passed = res.success && res.formattedValue === '0.1000';
    return {
      passed,
      expected: '0.1000 eq/L (N)',
      actual: `${res.formattedValue} N`,
      detailsFa: 'محاسبه وزن اکی‌والان و نرمالیته بر حسب ظرفیت هم‌ارزی'
    };
  });

  // 19. Parts per Million (ppm) & Parts per Billion (ppb)
  runTest('T19_PPM_PPB', 'صحت محاسبات غلظت در سطح ردپا (ppm و ppb)', 'شیمی تجزیه مقادیر بسیار اندک', () => {
    const resPpm = runFormulaCalculation('ppm_calc', { m_analyte: 5.0, m_sample: 2.0 }, { decimals: 2 }); // 5mg in 2kg -> 2.50 ppm
    const resPpb = runFormulaCalculation('ppb_calc', { m_analyte_ug: 15.0, m_sample_kg: 3.0 }, { decimals: 2 }); // 15µg in 3kg -> 5.00 ppb
    const passed = resPpm.success && resPpm.formattedValue === '2.50' && resPpb.success && resPpb.formattedValue === '5.00';
    return {
      passed,
      expected: '2.50 ppm و 5.00 ppb',
      actual: `${resPpm.formattedValue} ppm | ${resPpb.formattedValue} ppb`,
      detailsFa: 'محاسبه غلظت آنالیت در سطح ردپای آلاینده‌ها و مایکوتوکسین‌ها'
    };
  });

  // 20. pH and Henderson-Hasselbalch: pKa=4.76, [A-]=0.2, [HA]=0.1 -> pH = 4.76 + log(2) = 4.76 + 0.301 = 5.06
  runTest('T20_PH_BUFFER', 'صحت معادله بافر هندرسون-هاسلباخ (Henderson-Hasselbalch)', 'تعادل‌های شیمیایی و بافر', () => {
    const res = runFormulaCalculation('henderson_hasselbalch', { pka: 4.76, conc_base: 0.2, conc_acid: 0.1 }, { decimals: 2 });
    const passed = res.success && res.formattedValue === '5.06';
    return {
      passed,
      expected: '5.06 pH',
      actual: `${res.formattedValue} pH`,
      detailsFa: 'محاسبه pH بافر استات با نسبت ۲:۱ نمک به اسید'
    };
  });

  const passedCount = results.filter(r => r.passed).length;
  return {
    total: results.length,
    passed: passedCount,
    failed: results.length - passedCount,
    results
  };
}
