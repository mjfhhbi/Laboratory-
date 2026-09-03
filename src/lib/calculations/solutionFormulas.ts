import { FormulaDefinition, CalculationResult, CalculationOptions, CalculationTraceStep } from '../../types/calculations';

export function formatScientificNumber(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '-';
  return val.toFixed(decimals);
}

// -------------------------------------------------------------
// 1. PERCENT WEIGHT/WEIGHT (% w/w)
// -------------------------------------------------------------
export const PERCENT_W_W_FORMULA: FormulaDefinition = {
  id: 'percent_w_w',
  nameFa: 'درصد وزنی/وزنی (% w/w - Mass Fraction)',
  nameEn: 'Weight-by-Weight Percentage (% w/w)',
  category: 'solutions_dilution',
  standardReference: 'IUPAC Compendium of Chemical Terminology (Gold Book) / ISO 80000-9',
  standardReferenceDocId: 'IUPAC-W-W',
  expressionLatex: '\\% (w/w) = \\frac{m_{\\text{solute}}}{m_{\\text{solution}}} \\times 100 = \\frac{m_{\\text{solute}}}{m_{\\text{solute}} + m_{\\text{solvent}}} \\times 100',
  expressionDisplay: 'درصد وزنی = (جرم حل‌شونده / جرم کل محلول) × ۱۰۰',
  outputUnit: '% w/w',
  defaultDecimals: 2,
  scientificNotesFa: 'درصد وزنی مقدار گرم ماده حل‌شونده در ۱۰۰ گرم محلول نهایی است. برخلاف درصد حجمی، درصد وزنی وابسته به دما نیست چون جرم با تغییر دما تغییر نمی‌کند.',
  variables: [
    {
      id: 'm_solute',
      symbol: 'm_{\\text{solute}}',
      nameFa: 'جرم ماده حل‌شونده (گرم)',
      nameEn: 'Solute Mass (g)',
      descriptionFa: 'جرم ماده خالص یا ترکیب شیمیایی حل‌شده',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg', 'kg'],
      min: 0.0001,
      required: true,
      defaultValue: 5.0
    },
    {
      id: 'm_solution',
      symbol: 'm_{\\text{solution}}',
      nameFa: 'جرم کل محلول نهایی (گرم)',
      nameEn: 'Total Solution Mass (g)',
      descriptionFa: 'مجموع جرم حل‌شونده و حلال (ظرف به همراه مایع منهای تار)',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg', 'kg'],
      min: 0.0001,
      required: true,
      defaultValue: 100.0
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m_solute, m_solution } = inputs;

    if (m_solute === undefined || m_solution === undefined) {
      errors.push('ورود هر دو پارامتر جرم ماده حل‌شونده و جرم کل محلول الزامی است.');
      return { valid: false, errors, warnings };
    }

    if (m_solute <= 0 || m_solution <= 0) {
      errors.push('مقادیر جرم باید اعدادی مثبت و بزرگتر از صفر باشند.');
    }

    if (m_solute > m_solution) {
      errors.push('خطای غیرمنطقی: جرم ماده حل‌شونده نمی‌تواند بیشتر از جرم کل محلول باشد.');
    }

    if (m_solute === m_solution) {
      warnings.push('جرم حل‌شونده و محلول برابر است (ماده ۱۰۰٪ خالص).');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { m_solute, m_solution } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = PERCENT_W_W_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '% w/w',
        decimals,
        standardReference: PERCENT_W_W_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const pctWW = (m_solute! / m_solution!) * 100;
    const mSolvent = m_solution! - m_solute!;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه جرم حلال مورد نیاز',
      expression: 'm_{\\text{solvent}} = m_{\\text{solution}} - m_{\\text{solute}}',
      substitutedExpression: `${m_solution} - ${m_solute}`,
      intermediateValue: mSolvent.toFixed(4),
      unit: 'g',
      noteFa: `جرم حلال افزوده شده: ${mSolvent.toFixed(decimals)} g`
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه کسر جرمی و درصد وزنی',
      expression: '\\% (w/w) = \\frac{m_{\\text{solute}}}{m_{\\text{solution}}} \\times 100',
      substitutedExpression: `(${m_solute} / ${m_solution}) \\times 100`,
      intermediateValue: pctWW.toFixed(4),
      unit: '% w/w',
      noteFa: 'کسر وزنی ماده در ۱۰۰ واحد محلول'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'گرد کردن نهایی بر اساس ارقام با معنی',
      expression: `\\text{Round}(\\% (w/w), ${decimals})`,
      substitutedExpression: `Round(${pctWW.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(pctWW, decimals),
      unit: '% w/w',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: pctWW,
      formattedValue: formatScientificNumber(pctWW, decimals),
      unit: '% w/w',
      decimals,
      standardReference: PERCENT_W_W_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        soluteGrams: m_solute,
        solutionGrams: m_solution,
        solventGrams: mSolvent
      }
    };
  }
};

// -------------------------------------------------------------
// 2. PERCENT WEIGHT/VOLUME (% w/v)
// -------------------------------------------------------------
export const PERCENT_W_V_FORMULA: FormulaDefinition = {
  id: 'percent_w_v',
  nameFa: 'درصد وزنی/حجمی (% w/v - Mass Concentration)',
  nameEn: 'Weight-by-Volume Percentage (% w/v)',
  category: 'solutions_dilution',
  standardReference: 'USP <821> / Food Chemicals Codex (FCC) / AOAC International',
  standardReferenceDocId: 'USP-W-V',
  expressionLatex: '\\% (w/v) = \\frac{m_{\\text{solute}}\\text{ (g)}}{V_{\\text{solution}}\\text{ (mL)}} \\times 100',
  expressionDisplay: 'درصد وزنی/حجمی = (جرم حل‌شونده به گرم / حجم محلول به میلی‌لیتر) × ۱۰۰',
  outputUnit: '% w/v',
  defaultDecimals: 2,
  scientificNotesFa: 'بیانگر گرم حل‌شونده جامد در هر ۱۰۰ میلی‌لیتر محلول نهایی است. در شیمی تجزیه و استانداردهای غذایی برای محلول‌های معرف و شناساگرها بسیار متداول است.',
  variables: [
    {
      id: 'm_solute',
      symbol: 'm_{\\text{solute}}',
      nameFa: 'جرم ماده حل‌شونده (گرم)',
      nameEn: 'Solute Mass (g)',
      descriptionFa: 'گرم ماده جامد توزین شده',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 10.0
    },
    {
      id: 'v_solution',
      symbol: 'V_{\\text{solution}}',
      nameFa: 'حجم نهایی محلول (میلی‌لیتر)',
      nameEn: 'Total Solution Volume (mL)',
      descriptionFa: 'حجم بالن ژوژه به حجم رسانده شده (mL)',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml', 'l'],
      min: 0.001,
      required: true,
      defaultValue: 100.0
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m_solute, v_solution } = inputs;

    if (m_solute === undefined || v_solution === undefined) {
      errors.push('ورود جرم حل‌شونده و حجم محلول الزامی است.');
      return { valid: false, errors, warnings };
    }

    if (m_solute <= 0 || v_solution <= 0) {
      errors.push('مقادیر باید مثبت و بزرگتر از صفر باشند.');
    }

    const ratio = (m_solute / v_solution) * 100;
    if (ratio > 150) {
      warnings.push(`درصد وزنی/حجمی محاسبه‌شده (${ratio.toFixed(1)}%) بسیار بالاست؛ حلالیت ماده در دمای اتاق را بررسی نمایید.`);
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { m_solute, v_solution } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = PERCENT_W_V_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '% w/v',
        decimals,
        standardReference: PERCENT_W_V_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const pctWV = (m_solute! / v_solution!) * 100;
    const gPerL = (m_solute! / v_solution!) * 1000;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه نسبت جرم به حجم (g/mL)',
      expression: '\\text{Ratio} = \\frac{m_{\\text{solute}}}{V_{\\text{solution}}}',
      substitutedExpression: `${m_solute} / ${v_solution}`,
      intermediateValue: (m_solute! / v_solution!).toFixed(5),
      unit: 'g/mL',
      noteFa: `معادل ${gPerL.toFixed(2)} g/L`
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه درصد وزنی/حجمی (% w/v)',
      expression: '\\% (w/v) = \\text{Ratio} \\times 100',
      substitutedExpression: `${(m_solute! / v_solution!).toFixed(5)} \\times 100`,
      intermediateValue: pctWV.toFixed(4),
      unit: '% w/v',
      noteFa: 'گرم حل‌شونده در ۱۰۰ میلی‌لیتر محلول'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'گرد کردن نهایی',
      expression: `\\text{Round}(\\% (w/v), ${decimals})`,
      substitutedExpression: `Round(${pctWV.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(pctWV, decimals),
      unit: '% w/v',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: pctWV,
      formattedValue: formatScientificNumber(pctWV, decimals),
      unit: '% w/v',
      decimals,
      standardReference: PERCENT_W_V_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        gPerLiter: gPerL,
        mgPerMl: (m_solute! / v_solution!) * 1000
      }
    };
  }
};

// -------------------------------------------------------------
// 3. PERCENT VOLUME/VOLUME (% v/v)
// -------------------------------------------------------------
export const PERCENT_V_V_FORMULA: FormulaDefinition = {
  id: 'percent_v_v',
  nameFa: 'درصد حجمی/حجمی (% v/v - Volume Fraction)',
  nameEn: 'Volume-by-Volume Percentage (% v/v)',
  category: 'solutions_dilution',
  standardReference: 'OIML R 22 / IUPAC Compendium / AOAC 920.57',
  standardReferenceDocId: 'OIML-R22',
  expressionLatex: '\\% (v/v) = \\frac{V_{\\text{solute}}}{V_{\\text{solution}}} \\times 100',
  expressionDisplay: 'درصد حجمی = (حجم حل‌شونده مایع / حجم کل محلول) × ۱۰۰',
  outputUnit: '% v/v',
  defaultDecimals: 2,
  scientificNotesFa: 'بیانگر میلی‌لیتر حل‌شونده مایع در ۱۰۰ میلی‌لیتر محلول نهایی است. در اندازه‌گیری الکل، اسانس‌ها و حلال‌های آلی استفاده می‌شود. به دلیل انقباض حجمی (Volume Contraction) حین اختلاط، همیشه ابتدا حل‌شونده برداشته شده و سپس با حلال به حجم رسانده می‌شود.',
  variables: [
    {
      id: 'v_solute',
      symbol: 'V_{\\text{solute}}',
      nameFa: 'حجم مایع حل‌شونده (میلی‌لیتر)',
      nameEn: 'Solute Liquid Volume (mL)',
      descriptionFa: 'حجم مایع خالص (مانند اتانول یا اسید استیک گلاسیال)',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml', 'l', 'ul'],
      min: 0.001,
      required: true,
      defaultValue: 70.0
    },
    {
      id: 'v_solution',
      symbol: 'V_{\\text{solution}}',
      nameFa: 'حجم کل محلول نهایی (میلی‌لیتر)',
      nameEn: 'Total Final Volume (mL)',
      descriptionFa: 'حجم نهایی پس از به حجم رساندن',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml', 'l'],
      min: 0.001,
      required: true,
      defaultValue: 100.0
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { v_solute, v_solution } = inputs;

    if (v_solute === undefined || v_solution === undefined) {
      errors.push('ورود هر دو حجم الزامی است.');
      return { valid: false, errors, warnings };
    }

    if (v_solute <= 0 || v_solution <= 0) {
      errors.push('مقادیر حجم باید اعدادی مثبت باشند.');
    }

    if (v_solute > v_solution) {
      errors.push('حجم مایع حل‌شونده نمی‌تواند از حجم کل محلول بیشتر باشد.');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { v_solute, v_solution } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = PERCENT_V_V_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '% v/v',
        decimals,
        standardReference: PERCENT_V_V_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const pctVV = (v_solute! / v_solution!) * 100;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه کسر حجمی و درصد حجمی/حجمی',
      expression: '\\% (v/v) = \\frac{V_{\\text{solute}}}{V_{\\text{solution}}} \\times 100',
      substitutedExpression: `(${v_solute} / ${v_solution}) \\times 100`,
      intermediateValue: pctVV.toFixed(4),
      unit: '% v/v',
      noteFa: 'میلی‌لیتر مایع در ۱۰۰ میلی‌لیتر محلول'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'گرد کردن نتیجه بر اساس استاندارد گزارش‌دهی',
      expression: `\\text{Round}(\\% (v/v), ${decimals})`,
      substitutedExpression: `Round(${pctVV.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(pctVV, decimals),
      unit: '% v/v',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: pctVV,
      formattedValue: formatScientificNumber(pctVV, decimals),
      unit: '% v/v',
      decimals,
      standardReference: PERCENT_V_V_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        soluteVolumeMl: v_solute,
        solutionVolumeMl: v_solution
      }
    };
  }
};

// -------------------------------------------------------------
// 4. MOLARITY (M / مولاریته)
// -------------------------------------------------------------
export const MOLARITY_FORMULA: FormulaDefinition = {
  id: 'molarity_calc',
  nameFa: 'غلظت مولار (Molarity - M = mol/L)',
  nameEn: 'Molar Concentration (Molarity)',
  category: 'solutions_dilution',
  standardReference: 'IUPAC Compendium of Chemical Terminology / Quantities, Units and Symbols in Physical Chemistry (Green Book)',
  standardReferenceDocId: 'IUPAC-MOL',
  expressionLatex: 'M = \\frac{n}{V_{\\text{L}}} = \\frac{m_{\\text{solute}}\\text{ (g)}}{MW\\text{ (g/mol)} \\times V_{\\text{L}}} = \\frac{m_{\\text{solute}} \\times 1000}{MW \\times V_{\\text{mL}}}',
  expressionDisplay: 'مولاریته (M) = (جرم حل‌شونده × ۱۰۰۰) / (جرم مولی × حجم محلول به میلی‌لیتر)',
  outputUnit: 'mol/L',
  defaultDecimals: 4,
  scientificNotesFa: 'مولاریته تعداد مول‌های حل‌شونده در یک لیتر محلول نهایی است. جرم مولی (MW) از جمع اوزان اتمی عناصر تشکیل‌دهنده فرمول شیمیایی به دست می‌آید.',
  variables: [
    {
      id: 'm_solute',
      symbol: 'm',
      nameFa: 'جرم ماده حل‌شونده (گرم)',
      nameEn: 'Solute Mass (g)',
      descriptionFa: 'جرم توزین شده ماده شیمیایی',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 5.844
    },
    {
      id: 'mw',
      symbol: 'MW',
      nameFa: 'جرم مولی ماده (g/mol)',
      nameEn: 'Molar Mass (g/mol)',
      descriptionFa: 'وزن مولکولی بر اساس فرمول شیمیایی (مثلاً NaCl = 58.44، NaOH = 40.00)',
      category: 'dimensionless',
      defaultUnit: 'g/mol',
      allowedUnits: ['g/mol'],
      min: 1.0,
      required: true,
      defaultValue: 58.44
    },
    {
      id: 'v_solution',
      symbol: 'V',
      nameFa: 'حجم محلول (میلی‌لیتر)',
      nameEn: 'Solution Volume (mL)',
      descriptionFa: 'حجم بالن ژوژه به حجم رسانده شده',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml', 'l'],
      min: 0.001,
      required: true,
      defaultValue: 1000.0
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m_solute, mw, v_solution } = inputs;

    if (m_solute === undefined || mw === undefined || v_solution === undefined) {
      errors.push('تمامی مقادیر جرم، جرم مولی و حجم محلول الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m_solute <= 0 || mw <= 0 || v_solution <= 0) {
      errors.push('تمامی مقادیر باید اعدادی مثبت و بزرگتر از صفر باشند.');
    }

    const mol = m_solute / mw;
    const volL = v_solution / 1000;
    const molarity = mol / volL;

    if (molarity > 20) {
      warnings.push(`غلظت مولار محاسبه‌شده (${molarity.toFixed(2)} M) بسیار بالا است و از حد اشباع اکثر ترکیبات فراتر می‌رود.`);
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 4;
    const { m_solute, mw, v_solution } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = MOLARITY_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: 'mol/L (M)',
        decimals,
        standardReference: MOLARITY_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const moles = m_solute! / mw!;
    const volumeLiters = v_solution! / 1000;
    const molarity = moles / volumeLiters;
    const millimolar = molarity * 1000;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه تعداد مول‌های ماده حل‌شونده (n)',
      expression: 'n = \\frac{m}{MW}',
      substitutedExpression: `${m_solute} / ${mw}`,
      intermediateValue: moles.toFixed(6),
      unit: 'mol',
      noteFa: `تعداد مول ماده خالص: ${moles.toFixed(5)} mol`
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'تبدیل حجم به لیتر (V_L)',
      expression: 'V_{\\text{L}} = \\frac{V_{\\text{mL}}}{1000}',
      substitutedExpression: `${v_solution} / 1000`,
      intermediateValue: volumeLiters.toFixed(4),
      unit: 'L',
      noteFa: 'حجم کل بر حسب لیتر'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه غلظت مولار (M = mol/L)',
      expression: 'M = \\frac{n}{V_{\\text{L}}}',
      substitutedExpression: `${moles.toFixed(6)} / ${volumeLiters.toFixed(4)}`,
      intermediateValue: molarity.toFixed(6),
      unit: 'M (mol/L)',
      noteFa: `معادل ${millimolar.toFixed(2)} mM`
    });

    trace.push({
      stepNumber: 4,
      titleFa: 'گرد کردن نهایی بر اساس اعشار آزمایشگاهی',
      expression: `\\text{Round}(M, ${decimals})`,
      substitutedExpression: `Round(${molarity.toFixed(6)}, ${decimals})`,
      intermediateValue: formatScientificNumber(molarity, decimals),
      unit: 'mol/L (M)',
      noteFa: `نتیجه با ${decimals} رقم اعشار ثبت شد`
    });

    return {
      success: true,
      value: molarity,
      formattedValue: formatScientificNumber(molarity, decimals),
      unit: 'mol/L (M)',
      decimals,
      standardReference: MOLARITY_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        moles,
        volumeLiters,
        millimolar
      }
    };
  }
};

// -------------------------------------------------------------
// 5. NORMALITY (N / نرمالیته)
// -------------------------------------------------------------
export const NORMALITY_FORMULA: FormulaDefinition = {
  id: 'normality_calc',
  nameFa: 'غلظت نرمال (Normality - N = eq/L)',
  nameEn: 'Normal Concentration (Normality)',
  category: 'solutions_dilution',
  standardReference: 'Skoog, West, Holler, Crouch, Fundamentals of Analytical Chemistry / ASTM E200',
  standardReferenceDocId: 'ASTM-E200',
  expressionLatex: 'N = M \\times n_{\\text{equiv}} = \\frac{m_{\\text{solute}} \\times 1000}{\\text{EW} \\times V_{\\text{mL}}} \\quad \\left(\\text{EW} = \\frac{MW}{n_{\\text{equiv}}}\\right)',
  expressionDisplay: 'نرمالیته (N) = مولاریته (M) × ظرفیت هم‌ارزی (n) = (جرم × ۱۰۰۰) / (وزن اکی‌والان × حجم mL)',
  outputUnit: 'eq/L (N)',
  defaultDecimals: 4,
  scientificNotesFa: 'نرمالیته تعداد اکی‌والان‌های حل‌شونده در یک لیتر محلول است. ظرفیت هم‌ارزی (n) در اسیدها تعداد H+ قابل تفکیک، در بازها تعداد OH- و در واکنش‌های ردوکس تعداد الکترون‌های مبادله‌شده است.',
  variables: [
    {
      id: 'm_solute',
      symbol: 'm',
      nameFa: 'جرم ماده حل‌شونده (گرم)',
      nameEn: 'Solute Mass (g)',
      descriptionFa: 'جرم توزین شده ماده',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 4.904
    },
    {
      id: 'mw',
      symbol: 'MW',
      nameFa: 'جرم مولی ماده (g/mol)',
      nameEn: 'Molar Mass (g/mol)',
      descriptionFa: 'وزن مولکولی فرمول (مثلا H2SO4 = 98.08, HCl = 36.46)',
      category: 'dimensionless',
      defaultUnit: 'g/mol',
      allowedUnits: ['g/mol'],
      min: 1.0,
      required: true,
      defaultValue: 98.08
    },
    {
      id: 'n_equiv',
      symbol: 'n_{\\text{eq}}',
      nameFa: 'ظرفیت هم‌ارزی یا والانس واکنش (Equivalence Factor)',
      nameEn: 'Equivalence Factor / Valence',
      descriptionFa: 'تعداد پروتون H+ یا الکترون مبادله شده (مثلاً برای H2SO4 برابر 2، برای HCl برابر 1، برای KMnO4 در محیط اسیدی برابر 5)',
      category: 'dimensionless',
      defaultUnit: 'eq/mol',
      allowedUnits: ['eq/mol'],
      min: 1,
      max: 10,
      required: true,
      defaultValue: 2
    },
    {
      id: 'v_solution',
      symbol: 'V',
      nameFa: 'حجم محلول (میلی‌لیتر)',
      nameEn: 'Solution Volume (mL)',
      descriptionFa: 'حجم کل محلول در بالن ژوژه',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml', 'l'],
      min: 0.001,
      required: true,
      defaultValue: 1000.0
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m_solute, mw, n_equiv, v_solution } = inputs;

    if (m_solute === undefined || mw === undefined || n_equiv === undefined || v_solution === undefined) {
      errors.push('تمامی پارامترهای جرم، جرم مولی، والانس و حجم الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m_solute <= 0 || mw <= 0 || n_equiv <= 0 || v_solution <= 0) {
      errors.push('مقادیر باید مثبت و بزرگتر از صفر باشند.');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 4;
    const { m_solute, mw, n_equiv, v_solution } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = NORMALITY_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: 'eq/L (N)',
        decimals,
        standardReference: NORMALITY_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const equivalentWeight = mw! / n_equiv!;
    const equivalents = m_solute! / equivalentWeight;
    const volumeLiters = v_solution! / 1000;
    const normality = equivalents / volumeLiters;
    const molarity = normality / n_equiv!;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه وزن اکی‌والان (Equivalent Weight - EW)',
      expression: '\\text{EW} = \\frac{MW}{n_{\\text{equiv}}}',
      substitutedExpression: `${mw} / ${n_equiv}`,
      intermediateValue: equivalentWeight.toFixed(4),
      unit: 'g/eq',
      noteFa: `وزن یک اکی‌والان گرم ماده: ${equivalentWeight.toFixed(3)} g/eq`
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه تعداد اکی‌والان‌های توزین‌شده (eq)',
      expression: '\\text{eq} = \\frac{m}{\\text{EW}}',
      substitutedExpression: `${m_solute} / ${equivalentWeight.toFixed(4)}`,
      intermediateValue: equivalents.toFixed(6),
      unit: 'eq',
      noteFa: 'تعداد اکی‌والان گرم حل‌شده'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه غلظت نرمال (N = eq/L)',
      expression: 'N = \\frac{\\text{eq}}{V_{\\text{L}}}',
      substitutedExpression: `${equivalents.toFixed(6)} / ${volumeLiters.toFixed(4)}`,
      intermediateValue: normality.toFixed(6),
      unit: 'eq/L (N)',
      noteFa: `مولاریته متناظر: M = ${molarity.toFixed(decimals)} mol/L`
    });

    trace.push({
      stepNumber: 4,
      titleFa: 'گرد کردن نهایی',
      expression: `\\text{Round}(N, ${decimals})`,
      substitutedExpression: `Round(${normality.toFixed(6)}, ${decimals})`,
      intermediateValue: formatScientificNumber(normality, decimals),
      unit: 'eq/L (N)',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: normality,
      formattedValue: formatScientificNumber(normality, decimals),
      unit: 'eq/L (N)',
      decimals,
      standardReference: NORMALITY_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        equivalentWeight,
        equivalents,
        molarity,
        normality
      }
    };
  }
};

// -------------------------------------------------------------
// 6. PARTS PER MILLION (ppm)
// -------------------------------------------------------------
export const PPM_FORMULA: FormulaDefinition = {
  id: 'ppm_calc',
  nameFa: 'غلظت بر حسب قسمت در میلیون (ppm - mg/kg یا mg/L)',
  nameEn: 'Parts Per Million Concentration (ppm)',
  category: 'solutions_dilution',
  standardReference: 'ISO 11843 / EPA Method Guidelines / AOAC Trace Analysis',
  standardReferenceDocId: 'ISO-11843-PPM',
  expressionLatex: '\\text{ppm} = \\frac{m_{\\text{analyte}}\\text{ (mg)}}{m_{\\text{sample}}\\text{ (kg)}} = \\frac{m_{\\text{analyte}}\\text{ (mg)}}{V_{\\text{solution}}\\text{ (L)}} = \\frac{m_{\\text{analyte}}\\text{ (g)}}{m_{\\text{sample}}\\text{ (g)}} \\times 10^6',
  expressionDisplay: 'ppm = (میلی‌گرم ماده آنالیت / کیلوگرم یا لیتر نمونه) = (جرم ماده به گرم / جرم نمونه به گرم) × ۱۰⁶',
  outputUnit: 'ppm (mg/kg)',
  defaultDecimals: 2,
  scientificNotesFa: 'واحد غلظت در سطح ردپا (Trace Level). در محلول‌های آبی رقیق با چگالی ۱.۰، ۱ ppm دقیقاً برابر با ۱ mg/L یا ۱ µg/mL است. در نمونه‌های جامد ۱ ppm برابر با ۱ mg/kg یا ۱ µg/g است.',
  variables: [
    {
      id: 'm_analyte',
      symbol: 'm_{\\text{analyte}}',
      nameFa: 'جرم یا مقدار آنالیت (میلی‌گرم)',
      nameEn: 'Analyte Mass (mg)',
      descriptionFa: 'مقدار ماده مورد اندازه‌گیری بر حسب میلی‌گرم',
      category: 'mass',
      defaultUnit: 'mg',
      allowedUnits: ['mg', 'ug', 'g'],
      min: 0.000001,
      required: true,
      defaultValue: 2.5
    },
    {
      id: 'm_sample',
      symbol: 'm_{\\text{sample}}',
      nameFa: 'جرم یا حجم کل نمونه (کیلوگرم یا لیتر)',
      nameEn: 'Total Sample Mass or Volume (kg / L)',
      descriptionFa: 'مقدار کل ماتریس غذایی بر حسب کیلوگرم یا لیتر',
      category: 'mass',
      defaultUnit: 'kg',
      allowedUnits: ['kg', 'g', 'l', 'ml'],
      min: 0.0001,
      required: true,
      defaultValue: 1.0
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m_analyte, m_sample } = inputs;

    if (m_analyte === undefined || m_sample === undefined) {
      errors.push('ورود هر دو پارامتر مقدار آنالیت و جرم/حجم کل نمونه الزامی است.');
      return { valid: false, errors, warnings };
    }

    if (m_analyte <= 0 || m_sample <= 0) {
      errors.push('مقادیر باید مثبت باشند.');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { m_analyte, m_sample } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = PPM_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: 'ppm',
        decimals,
        standardReference: PPM_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const ppmValue = m_analyte! / m_sample!;
    const ppbValue = ppmValue * 1000;
    const percentValue = ppmValue / 10000; // 1% = 10,000 ppm

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه نسبت غلظت در سطح ppm (mg/kg یا mg/L)',
      expression: '\\text{ppm} = \\frac{m_{\\text{analyte}}\\text{ (mg)}}{m_{\\text{sample}}\\text{ (kg)}}',
      substitutedExpression: `${m_analyte} / ${m_sample}`,
      intermediateValue: ppmValue.toFixed(4),
      unit: 'ppm',
      noteFa: 'میلی‌گرم ماده در هر کیلوگرم ماتریس'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'تبدیل به سایر واحدهای ردپا (Equivalents)',
      expression: '\\text{ppb} = \\text{ppm} \\times 1000, \\quad \\% = \\frac{\\text{ppm}}{10000}',
      substitutedExpression: `${ppmValue.toFixed(4)} \\times 1000`,
      intermediateValue: ppbValue.toFixed(1),
      unit: 'ppb',
      noteFa: `معادل ${percentValue.toFixed(6)}% وزنی`
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'گرد کردن نهایی',
      expression: `\\text{Round}(\\text{ppm}, ${decimals})`,
      substitutedExpression: `Round(${ppmValue.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(ppmValue, decimals),
      unit: 'ppm',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: ppmValue,
      formattedValue: formatScientificNumber(ppmValue, decimals),
      unit: 'ppm',
      decimals,
      standardReference: PPM_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        ppm: ppmValue,
        ppb: ppbValue,
        percent: percentValue
      }
    };
  }
};

// -------------------------------------------------------------
// 7. PARTS PER BILLION (ppb)
// -------------------------------------------------------------
export const PPB_FORMULA: FormulaDefinition = {
  id: 'ppb_calc',
  nameFa: 'غلظت بر حسب قسمت در میلیارد (ppb - µg/kg یا µg/L)',
  nameEn: 'Parts Per Billion Concentration (ppb)',
  category: 'solutions_dilution',
  standardReference: 'AOAC 999.07 / ISO 16050 (Aflatoxins and Mycotoxins in Foods)',
  standardReferenceDocId: 'ISO-16050-PPB',
  expressionLatex: '\\text{ppb} = \\frac{m_{\\text{analyte}}\\text{ (}\\mu\\text{g)}}{m_{\\text{sample}}\\text{ (kg)}} = \\frac{m_{\\text{analyte}}\\text{ (}\\mu\\text{g)}}{V_{\\text{solution}}\\text{ (L)}} = \\frac{m_{\\text{analyte}}\\text{ (g)}}{m_{\\text{sample}}\\text{ (g)}} \\times 10^9',
  expressionDisplay: 'ppb = (میکروگرم ماده آنالیت / کیلوگرم یا لیتر نمونه) = (جرم ماده به گرم / جرم نمونه به گرم) × ۱۰⁹',
  outputUnit: 'ppb (µg/kg)',
  defaultDecimals: 2,
  scientificNotesFa: 'واحد اندازه‌گیری در سطح فوق‌ردپا (Ultra-Trace Level). در صنایع غذایی برای سنجش مایکوتوکسین‌ها (مانند آفلاتوکسین B1 و M1)، فلزات سنگین (سرب، کادمیوم، آرسنیک) و باقیمانده سموم آفت‌کش استفاده می‌شود.',
  variables: [
    {
      id: 'm_analyte_ug',
      symbol: 'm_{\\text{analyte}}',
      nameFa: 'مقدار آنالیت شناسایی‌شده (میکروگرم - µg)',
      nameEn: 'Analyte Mass (µg)',
      descriptionFa: 'میکروگرم سم یا فلز سنگین در آزمون دستگاهی (HPLC/AAS/ICP-MS)',
      category: 'mass',
      defaultUnit: 'ug',
      allowedUnits: ['ug', 'ng', 'mg'],
      min: 0.000001,
      required: true,
      defaultValue: 4.0
    },
    {
      id: 'm_sample_kg',
      symbol: 'm_{\\text{sample}}',
      nameFa: 'جرم یا حجم نمونه (کیلوگرم یا لیتر)',
      nameEn: 'Total Sample Mass (kg or L)',
      descriptionFa: 'کیلوگرم نمونه غذایی آنالیز شده',
      category: 'mass',
      defaultUnit: 'kg',
      allowedUnits: ['kg', 'g', 'l'],
      min: 0.0001,
      required: true,
      defaultValue: 1.0
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m_analyte_ug, m_sample_kg } = inputs;

    if (m_analyte_ug === undefined || m_sample_kg === undefined) {
      errors.push('ورود مقادیر میکروگرم آنالیت و کیلوگرم نمونه الزامی است.');
      return { valid: false, errors, warnings };
    }

    if (m_analyte_ug <= 0 || m_sample_kg <= 0) {
      errors.push('مقادیر باید مثبت باشند.');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { m_analyte_ug, m_sample_kg } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = PPB_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: 'ppb',
        decimals,
        standardReference: PPB_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const ppbValue = m_analyte_ug! / m_sample_kg!;
    const ppmValue = ppbValue / 1000;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه غلظت در سطح ppb (µg/kg)',
      expression: '\\text{ppb} = \\frac{m_{\\text{analyte}}\\text{ (}\\mu\\text{g)}}{m_{\\text{sample}}\\text{ (kg)}}',
      substitutedExpression: `${m_analyte_ug} / ${m_sample_kg}`,
      intermediateValue: ppbValue.toFixed(4),
      unit: 'ppb (µg/kg)',
      noteFa: 'میکروگرم آلاینده در هر کیلوگرم ماده غذایی'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'تبدیل به غلظت میلی‌گرم بر کیلوگرم (ppm)',
      expression: '\\text{ppm} = \\frac{\\text{ppb}}{1000}',
      substitutedExpression: `${ppbValue.toFixed(4)} / 1000`,
      intermediateValue: ppmValue.toFixed(6),
      unit: 'ppm (mg/kg)',
      noteFa: 'معادل در مقیاس ppm'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'گرد کردن نهایی',
      expression: `\\text{Round}(\\text{ppb}, ${decimals})`,
      substitutedExpression: `Round(${ppbValue.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(ppbValue, decimals),
      unit: 'ppb',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: ppbValue,
      formattedValue: formatScientificNumber(ppbValue, decimals),
      unit: 'ppb',
      decimals,
      standardReference: PPB_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        ppb: ppbValue,
        ppm: ppmValue
      }
    };
  }
};

// -------------------------------------------------------------
// 8. pH & [H+] / [OH-] CONVERSION
// -------------------------------------------------------------
export const PH_CALCULATION_FORMULA: FormulaDefinition = {
  id: 'ph_h_concentration',
  nameFa: 'محاسبه pH، pOH و غلظت یون‌های هیدروژن [H⁺] و هیدروکسید [OH⁻]',
  nameEn: 'pH, pOH, [H⁺] and [OH⁻] Ion Concentration',
  category: 'solutions_dilution',
  standardReference: 'IUPAC Recommendations (Measurement of pH. Definition, Standards, and Procedures) / Pure Appl. Chem. 74(11)',
  standardReferenceDocId: 'IUPAC-PH-2002',
  expressionLatex: '\\text{pH} = -\\log_{10}[\\text{H}^+], \\quad [\\text{H}^+] = 10^{-\\text{pH}}, \\quad \\text{pOH} = 14.00 - \\text{pH}, \\quad [\\text{OH}^-] = 10^{-\\text{pOH}}',
  expressionDisplay: 'pH = -log[H⁺] و [H⁺] = 10^(-pH) در دمای ۲۵ درجه سانتی‌گراد',
  outputUnit: 'pH units',
  defaultDecimals: 2,
  scientificNotesFa: 'در دمای استاندارد ۲۵ درجه سانتی‌گراد (Kw = 1.0 × 10^-14)، حاصل‌ضرب یون آب [H+][OH-] = 10^-14 است. مقیاس pH معمولاً بین ۰ تا ۱۴ تعریف می‌شود.',
  variables: [
    {
      id: 'input_ph',
      symbol: 'pH',
      nameFa: 'مقدار pH خوانده‌شده از pH‌متر',
      nameEn: 'Measured pH Value',
      descriptionFa: 'عدد pH محلول یا نمونه غذایی در دمای ۲۵ درجه',
      category: 'dimensionless',
      defaultUnit: 'unitless',
      allowedUnits: ['unitless'],
      min: 0,
      max: 14,
      required: true,
      defaultValue: 4.5
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { input_ph } = inputs;

    if (input_ph === undefined) {
      errors.push('ورود عدد pH الزامی است.');
      return { valid: false, errors, warnings };
    }

    if (input_ph < 0 || input_ph > 14) {
      warnings.push('هشدار: مقدار pH خارج از بازه متداول ۰ تا ۱۴ است (محلول‌های بسیار غلیظ اسید یا باز قوی).');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { input_ph } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = PH_CALCULATION_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: 'pH',
        decimals,
        standardReference: PH_CALCULATION_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const ph = input_ph!;
    const hConcentration = Math.pow(10, -ph);
    const poh = 14.0 - ph;
    const ohConcentration = Math.pow(10, -poh);

    let natureFa = 'خنثی (Neutral)';
    if (ph < 6.8) natureFa = 'اسیدی (Acidic)';
    else if (ph > 7.2) natureFa = 'بازی / قلیایی (Alkaline)';

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه غلظت یون هیدروژن [H⁺] (مول بر لیتر)',
      expression: '[\\text{H}^+] = 10^{-\\text{pH}}',
      substitutedExpression: `10^{-${ph}}`,
      intermediateValue: hConcentration.toExponential(4),
      unit: 'mol/L',
      noteFa: `غلظت یون هیدرونیوم در محلول: ${hConcentration.toExponential(3)} M`
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه pOH در دمای ۲۵ درجه سانتی‌گراد',
      expression: '\\text{pOH} = 14.00 - \\text{pH}',
      substitutedExpression: `14.00 - ${ph}`,
      intermediateValue: poh.toFixed(decimals),
      unit: 'pOH units',
      noteFa: 'بر مبنای ثابت تفکیک آب Kw = 10^-14'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه غلظت یون هیدروکسید [OH⁻] (مول بر لیتر)',
      expression: '[\\text{OH}^-] = 10^{-\\text{pOH}}',
      substitutedExpression: `10^{-${poh.toFixed(2)}}`,
      intermediateValue: ohConcentration.toExponential(4),
      unit: 'mol/L',
      noteFa: `ماهیت محلول: ${natureFa}`
    });

    return {
      success: true,
      value: ph,
      formattedValue: formatScientificNumber(ph, decimals),
      unit: 'pH units',
      decimals,
      standardReference: PH_CALCULATION_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        ph,
        poh,
        hConcentrationMolPerL: hConcentration,
        ohConcentrationMolPerL: ohConcentration,
        nature: natureFa
      }
    };
  }
};

// -------------------------------------------------------------
// 9. HENDERSON-HASSELBALCH (Buffer Solutions / بافرها)
// -------------------------------------------------------------
export const HENDERSON_HASSELBALCH_FORMULA: FormulaDefinition = {
  id: 'henderson_hasselbalch',
  nameFa: 'معادله هندرسون-هاسلباخ برای محلول‌های بافر (Henderson-Hasselbalch)',
  nameEn: 'Henderson-Hasselbalch Buffer Equation',
  category: 'solutions_dilution',
  standardReference: 'IUPAC Gold Book / Fundamentals of Analytical Chemistry (Skoog & West)',
  standardReferenceDocId: 'IUPAC-HEND-HASS',
  expressionLatex: '\\text{pH} = \\text{p}K_a + \\log_{10}\\left(\\frac{[\\text{A}^-]}{[\\text{HA}]}\\right) = \\text{p}K_a + \\log_{10}\\left(\\frac{n_{\\text{conjugate base}}}{n_{\\text{weak acid}}}\\right)',
  expressionDisplay: 'pH = pKa + log([باز مزدوج A⁻] / [اسید ضعیف HA])',
  outputUnit: 'pH units',
  defaultDecimals: 2,
  scientificNotesFa: 'برای محاسبه دقیق pH محلول‌های بافر بیوشیمیایی و صنایع غذایی (مانند بافر سیترات، استات، و فسفات). ظرفیت بافری در محدوده pH = pKa ± 1 حداکثر است.',
  variables: [
    {
      id: 'pka',
      symbol: 'pK_a',
      nameFa: 'ثابت تفکیک اسیدی (pKa)',
      nameEn: 'Acid Dissociation Constant (pKa)',
      descriptionFa: 'ثابت تفکیک اسید ضعیف (مثلاً اسید استیک = 4.76، اسید سیتریک pKa1 = 3.13, pKa2 = 4.76, pKa3 = 6.40، بافر فسفات pKa2 = 7.20)',
      category: 'dimensionless',
      defaultUnit: 'unitless',
      allowedUnits: ['unitless'],
      min: 0,
      max: 14,
      required: true,
      defaultValue: 4.76
    },
    {
      id: 'conc_base',
      symbol: '[A^-]',
      nameFa: 'غلظت باز مزدوج یا نمک اسید (mol/L یا mol)',
      nameEn: 'Conjugate Base Concentration [A⁻]',
      descriptionFa: 'غلظت یون مزدوج (مثلاً سدیم استات در بافر استات)',
      category: 'concentration',
      defaultUnit: 'mol_l',
      allowedUnits: ['mol_l', 'g_l'],
      min: 0.00001,
      required: true,
      defaultValue: 0.1
    },
    {
      id: 'conc_acid',
      symbol: '[HA]',
      nameFa: 'غلظت اسید ضعیف حل‌نشده (mol/L یا mol)',
      nameEn: 'Weak Acid Concentration [HA]',
      descriptionFa: 'غلظت اسید دست‌نخورده (مثلاً اسید استیک در بافر استات)',
      category: 'concentration',
      defaultUnit: 'mol_l',
      allowedUnits: ['mol_l', 'g_l'],
      min: 0.00001,
      required: true,
      defaultValue: 0.1
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { pka, conc_base, conc_acid } = inputs;

    if (pka === undefined || conc_base === undefined || conc_acid === undefined) {
      errors.push('تمامی پارامترهای pKa، غلظت باز مزدوج و غلظت اسید الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (conc_base <= 0 || conc_acid <= 0) {
      errors.push('غلظت اسید و باز باید مقادیری مثبت و بزرگتر از صفر باشند.');
    }

    const ratio = conc_base / conc_acid;
    if (ratio < 0.1 || ratio > 10) {
      warnings.push('هشدار نسبت بافری: نسبت [A⁻]/[HA] خارج از بازه بهینه ۰.۱ تا ۱۰ است (pH خارج از محدوده ظرفیت بافری pKa ± 1).');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { pka, conc_base, conc_acid } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = HENDERSON_HASSELBALCH_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: 'pH units',
        decimals,
        standardReference: HENDERSON_HASSELBALCH_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const ratio = conc_base! / conc_acid!;
    const logRatio = Math.log10(ratio);
    const bufferPh = pka! + logRatio;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه نسبت غلظت باز مزدوج به اسید ضعیف',
      expression: '\\text{Ratio} = \\frac{[\\text{A}^-]}{[\\text{HA}]}',
      substitutedExpression: `${conc_base} / ${conc_acid}`,
      intermediateValue: ratio.toFixed(4),
      unit: 'ratio',
      noteFa: `نسبت مولی نمک به اسید: ${ratio.toFixed(3)}`
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه لگاریتم اعشاری نسبت غلظت‌ها',
      expression: '\\log_{10}\\left(\\frac{[\\text{A}^-]}{[\\text{HA}]}\\right)',
      substitutedExpression: `\\log_{10}(${ratio.toFixed(4)})`,
      intermediateValue: logRatio.toFixed(4),
      unit: 'log units',
      noteFa: logRatio >= 0 ? `افزایش pH به میزان +${logRatio.toFixed(3)} نسبت به pKa` : `کاهش pH به میزان ${logRatio.toFixed(3)} نسبت به pKa`
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه نهایی pH محلول بافر',
      expression: '\\text{pH} = \\text{p}K_a + \\log_{10}\\left(\\frac{[\\text{A}^-]}{[\\text{HA}]}\\right)',
      substitutedExpression: `${pka} + (${logRatio.toFixed(4)})`,
      intermediateValue: bufferPh.toFixed(4),
      unit: 'pH units',
      noteFa: `محدوده موثر بافر: ${(pka! - 1).toFixed(2)} تا ${(pka! + 1).toFixed(2)}`
    });

    trace.push({
      stepNumber: 4,
      titleFa: 'گرد کردن نهایی',
      expression: `\\text{Round}(\\text{pH}, ${decimals})`,
      substitutedExpression: `Round(${bufferPh.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(bufferPh, decimals),
      unit: 'pH units',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: bufferPh,
      formattedValue: formatScientificNumber(bufferPh, decimals),
      unit: 'pH units',
      decimals,
      standardReference: HENDERSON_HASSELBALCH_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        pka,
        ratio,
        logRatio,
        bufferPh
      }
    };
  }
};

export const SOLUTION_FORMULAS: Record<string, FormulaDefinition> = {
  percent_w_w: PERCENT_W_W_FORMULA,
  percent_w_v: PERCENT_W_V_FORMULA,
  percent_v_v: PERCENT_V_V_FORMULA,
  molarity_calc: MOLARITY_FORMULA,
  normality_calc: NORMALITY_FORMULA,
  ppm_calc: PPM_FORMULA,
  ppb_calc: PPB_FORMULA,
  ph_h_concentration: PH_CALCULATION_FORMULA,
  henderson_hasselbalch: HENDERSON_HASSELBALCH_FORMULA
};
