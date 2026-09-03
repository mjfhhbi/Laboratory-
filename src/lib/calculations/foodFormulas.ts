import { FormulaDefinition, CalculationResult, CalculationOptions, CalculationTraceStep } from '../../types/calculations';
import { convertUnit } from './unitConverter';

/**
 * Format a number with exact decimal control
 */
export function formatScientificNumber(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '-';
  return val.toFixed(decimals);
}

// -------------------------------------------------------------
// 1. MOISTURE CONTENT (% Moisture / درصد رطوبت)
// -------------------------------------------------------------
export const MOISTURE_FORMULA: FormulaDefinition = {
  id: 'moisture_oven',
  nameFa: 'درصد رطوبت (روش آون الکتریکی ۱۰۵-۱۰۲ درجه)',
  nameEn: 'Moisture Content (Oven Drying Method)',
  category: 'proximate_analysis',
  standardReference: 'استاندارد ملی ایران ۲۴۰۶ و ۵۶۲۴ / AOAC 925.10 / ISO 712',
  standardReferenceDocId: 'INSO-2406',
  expressionLatex: '\\% \\text{Moisture} = \\frac{M_1 - M_2}{M_1 - M_0} \\times 100',
  expressionDisplay: 'درصد رطوبت = ((وزن قبل از آون - وزن بعد از آون) / (وزن قبل از آون - وزن ظرف خالی)) × ۱۰۰',
  outputUnit: '%',
  defaultDecimals: 2,
  scientificNotesFa: 'در این روش نمونه در دمای ۱۰۵-۱۰۲ درجه سلسیوس تا رسیدن به وزن ثابت خشک می‌شود. اختلاف وزن قبل و بعد از خشک کردن معرف مقدار آب تبخیر شده است.',
  variables: [
    {
      id: 'm0',
      symbol: 'M₀',
      nameFa: 'جرم ظرف خالی خشک‌شده (تار)',
      nameEn: 'Tare Mass of Empty Dried Dish',
      descriptionFa: 'جرم پلیت یا پودقه خالی پس از تثبیت وزن در دسیکاتور',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 20.1542
    },
    {
      id: 'm1',
      symbol: 'M₁',
      nameFa: 'جرم ظرف + نمونه قبل از خشک‌کردن',
      nameEn: 'Mass of Dish + Sample Before Drying',
      descriptionFa: 'جرم ظرف به همراه نمونه مرطوب وزن شده قبل از قرارگیری در آون',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 25.1542
    },
    {
      id: 'm2',
      symbol: 'M₂',
      nameFa: 'جرم ظرف + نمونه بعد از خشک‌کردن',
      nameEn: 'Mass of Dish + Sample After Drying',
      descriptionFa: 'جرم ظرف و نمونه خشک شده پس از خنک شدن در دسیکاتور',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 24.4042
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m0, m1, m2 } = inputs;

    if (m0 === undefined || m1 === undefined || m2 === undefined) {
      errors.push('تمامی مقادیر M₀ (ظرف خالی)، M₁ (قبل از آون) و M₂ (بعد از آون) الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m0 <= 0 || m1 <= 0 || m2 <= 0) {
      errors.push('مقادیر جرم باید اعدادی مثبت و بزرگتر از صفر باشند.');
    }

    if (m1 <= m0) {
      errors.push('خطای ورودی: جرم ظرف + نمونه (M₁) باید از جرم ظرف خالی (M₀) بیشتر باشد (جرم نمونه نمی‌تواند صفر یا منفی باشد).');
    }

    if (m2 < m0) {
      errors.push('خطای نامعقول: جرم نهایی بعد از خشک‌کردن (M₂) از جرم ظرف خالی (M₀) کمتر است!');
    }

    if (m2 > m1) {
      warnings.push('هشدار غیرمنطقی: جرم بعد از آون‌گذاری (M₂) از جرم قبل از آون (M₁) بیشتر است (+ افزایش وزن!). این نشان‌دهنده خطای توزین یا جذب رطوبت حین خروج از آون است.');
    }

    const sampleWeight = m1 - m0;
    if (sampleWeight < 1) {
      warnings.push(`جرم نمونه اولیه (${sampleWeight.toFixed(3)} گرم) کم است؛ بر اساس استاندارد توصیه می‌شود حداقل ۲ تا ۵ گرم نمونه برداشته شود.`);
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { m0, m1, m2 } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = MOISTURE_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '%',
        decimals,
        standardReference: MOISTURE_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const sampleWeight = m1! - m0!;
    const lostWaterWeight = m1! - m2!;
    const moisturePercent = (lostWaterWeight / sampleWeight) * 100;
    const dryMatterPercent = 100 - moisturePercent;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه جرم اولیه نمونه مرطوب',
      expression: 'M_{sample} = M_1 - M_0',
      substitutedExpression: `${m1} - ${m0}`,
      intermediateValue: sampleWeight.toFixed(4),
      unit: 'g',
      noteFa: 'وزن خالص نمونه آزمایشی قبل از حرارت‌دهی'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه جرم آب تبخیر شده (کاهش وزن)',
      expression: '\\Delta M = M_1 - M_2',
      substitutedExpression: `${m1} - ${m2}`,
      intermediateValue: lostWaterWeight.toFixed(4),
      unit: 'g',
      noteFa: 'مقدار آب از دست رفته حین حرارت‌دهی'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه درصد رطوبت بر پایه تر (Wet Basis)',
      expression: '\\% \\text{Moisture} = \\frac{\\Delta M}{M_{sample}} \\times 100',
      substitutedExpression: `(${lostWaterWeight.toFixed(4)} / ${sampleWeight.toFixed(4)}) \\times 100`,
      intermediateValue: moisturePercent.toFixed(4),
      unit: '%',
      noteFa: `ماده خشک متناظر: ${dryMatterPercent.toFixed(decimals)}%`
    });

    trace.push({
      stepNumber: 4,
      titleFa: 'اعمال قاعده گردکردن و کنترل اعشار استاندارد',
      expression: `\\text{Round}(\\% \\text{Moisture}, ${decimals})`,
      substitutedExpression: `Round(${moisturePercent.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(moisturePercent, decimals),
      unit: '%',
      noteFa: `نتیجه نهایی بر اساس استاندارد با ${decimals} رقم اعشار ثبت شد.`
    });

    return {
      success: true,
      value: moisturePercent,
      formattedValue: formatScientificNumber(moisturePercent, decimals),
      unit: '%',
      decimals,
      standardReference: MOISTURE_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        sampleWeightGrams: sampleWeight,
        lostWaterGrams: lostWaterWeight,
        dryMatterPercent: dryMatterPercent
      }
    };
  }
};

// -------------------------------------------------------------
// 2. DRY MATTER / TOTAL SOLIDS (% Dry Matter / درصد ماده خشک)
// -------------------------------------------------------------
export const DRY_MATTER_FORMULA: FormulaDefinition = {
  id: 'dry_matter_calc',
  nameFa: 'درصد ماده خشک و بریکس جامدات (Total Solids / Dry Matter %)',
  nameEn: 'Total Solids & Dry Matter Content (%)',
  category: 'proximate_analysis',
  standardReference: 'استاندارد ملی ایران ۱۷۵۳ و ۶۳۷ / AOAC 925.09 / ISO 6731',
  standardReferenceDocId: 'INSO-1753',
  expressionLatex: '\\% \\text{Dry Matter} = \\frac{M_2 - M_0}{M_1 - M_0} \\times 100 = 100 - \\% \\text{Moisture}',
  expressionDisplay: 'درصد ماده خشک = ((وزن ظرف و نمونه خشک - وزن ظرف خالی) / (وزن ظرف و نمونه تر - وزن ظرف خالی)) × ۱۰۰',
  outputUnit: '% DM',
  defaultDecimals: 2,
  scientificNotesFa: 'ماده خشک کل (Total Solids) نشان‌دهنده مقدار کلیه ترکیبات غیر فرار (پروتئین، چربی، کربوهیدرات، مواد معدنی) موجود در ماده غذایی پس از حذف کامل رطوبت آزاد است.',
  variables: [
    {
      id: 'm0',
      symbol: 'M₀',
      nameFa: 'جرم ظرف یا پلیت خالی خشک‌شده (تار)',
      nameEn: 'Tare Mass of Empty Dish (g)',
      descriptionFa: 'جرم ظرف خالی پس از تثبیت وزن',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 20.0000
    },
    {
      id: 'm1',
      symbol: 'M₁',
      nameFa: 'جرم ظرف + نمونه اولیه مرطوب',
      nameEn: 'Mass of Dish + Fresh Sample (g)',
      descriptionFa: 'جرم ظرف حاوی نمونه قبل از آون‌گذاری',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 25.0000
    },
    {
      id: 'm2',
      symbol: 'M₂',
      nameFa: 'جرم ظرف + باقیمانده خشک پس از آون',
      nameEn: 'Mass of Dish + Dried Residue (g)',
      descriptionFa: 'جرم ظرف حاوی ماده خشک بعد از خشک‌کردن کامل',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 20.6250
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m0, m1, m2 } = inputs;

    if (m0 === undefined || m1 === undefined || m2 === undefined) {
      errors.push('تمامی مقادیر M₀، M₁ و M₂ الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m0 <= 0 || m1 <= 0 || m2 <= 0) {
      errors.push('مقادیر باید مثبت باشند.');
    }

    if (m1 <= m0) {
      errors.push('جرم ظرف با نمونه تر (M₁) باید از ظرف خالی (M₀) بیشتر باشد.');
    }

    if (m2 < m0) {
      errors.push('جرم بعد از آون (M₂) از ظرف خالی کمتر است.');
    }

    if (m2 > m1) {
      errors.push('جرم خشک (M₂) نمی‌تواند بیشتر از جرم مرطوب (M₁) باشد.');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { m0, m1, m2 } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = DRY_MATTER_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '% DM',
        decimals,
        standardReference: DRY_MATTER_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const sampleWeight = m1! - m0!;
    const dryWeight = m2! - m0!;
    const dryMatterPercent = (dryWeight / sampleWeight) * 100;
    const moisturePercent = 100 - dryMatterPercent;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه جرم نمونه اولیه تر',
      expression: 'M_{fresh} = M_1 - M_0',
      substitutedExpression: `${m1} - ${m0}`,
      intermediateValue: sampleWeight.toFixed(4),
      unit: 'g',
      noteFa: 'جرم خالص نمونه برداشته شده'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه جرم باقیمانده ماده خشک',
      expression: 'M_{dry} = M_2 - M_0',
      substitutedExpression: `${m2} - ${m0}`,
      intermediateValue: dryWeight.toFixed(4),
      unit: 'g',
      noteFa: 'جرم ترکیبات غیر فرار باقیمانده'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه درصد ماده خشک (% Total Solids)',
      expression: '\\% \\text{Dry Matter} = \\frac{M_{dry}}{M_{fresh}} \\times 100',
      substitutedExpression: `(${dryWeight.toFixed(4)} / ${sampleWeight.toFixed(4)}) \\times 100`,
      intermediateValue: dryMatterPercent.toFixed(4),
      unit: '% DM',
      noteFa: `رطوبت متناظر: ${moisturePercent.toFixed(decimals)}%`
    });

    trace.push({
      stepNumber: 4,
      titleFa: 'گرد کردن نهایی بر اساس استاندارد',
      expression: `\\text{Round}(\\% \\text{Dry Matter}, ${decimals})`,
      substitutedExpression: `Round(${dryMatterPercent.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(dryMatterPercent, decimals),
      unit: '% DM',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: dryMatterPercent,
      formattedValue: formatScientificNumber(dryMatterPercent, decimals),
      unit: '% DM',
      decimals,
      standardReference: DRY_MATTER_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        dryMatterPercent,
        moisturePercent,
        dryWeightGrams: dryWeight,
        sampleWeightGrams: sampleWeight
      }
    };
  }
};

// -------------------------------------------------------------
// 3. TOTAL ASH (% Ash / درصد خاکستر کل)
// -------------------------------------------------------------
export const ASH_FORMULA: FormulaDefinition = {
  id: 'ash_furnace',
  nameFa: 'درصد خاکستر کل (روش کوره الکتریکی ۵۵۰ درجه)',
  nameEn: 'Total Ash Content (Muffle Furnace 550°C)',
  category: 'proximate_analysis',
  standardReference: 'استاندارد ملی ایران ۵۶۲۶ و ۲۶۸۵ / AOAC 923.03 / ISO 2171',
  standardReferenceDocId: 'INSO-5626',
  expressionLatex: '\\% \\text{Ash} = \\frac{M_2 - M_0}{M_1 - M_0} \\times 100',
  expressionDisplay: 'درصد خاکستر = ((وزن بوته بعد از کوره - وزن بوته خالی) / (وزن بوته قبل از کوره - وزن بوته خالی)) × ۱۰۰',
  outputUnit: '%',
  defaultDecimals: 2,
  scientificNotesFa: 'نمونه در بوته چینی یا پلاتینی در کوره ۵۵۰ درجه سانتی‌گراد سوزانده می‌شود تا کلیه مواد آلی اکسید شده و خاکستر سفید یا خاکستری برجای ماند.',
  variables: [
    {
      id: 'm0',
      symbol: 'M₀',
      nameFa: 'جرم بوته خالی تثبیت‌شده',
      nameEn: 'Tare Mass of Empty Crucible',
      descriptionFa: 'جرم بوته پودقه پس از سوختن و سرد شدن در دسیکاتور',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 18.5021
    },
    {
      id: 'm1',
      symbol: 'M₁',
      nameFa: 'جرم بوته + نمونه قبل از سوزاندن',
      nameEn: 'Mass of Crucible + Sample Before Ashing',
      descriptionFa: 'جرم بوته حاوی نمونه وزن شده قبل از قرارگیری در کوره',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 23.5021
    },
    {
      id: 'm2',
      symbol: 'M₂',
      nameFa: 'جرم بوته + خاکستر بعد از کوره',
      nameEn: 'Mass of Crucible + Ash After Ignition',
      descriptionFa: 'جرم بوته به همراه خاکستر تثبیت شده پس از کوره و دسیکاتور',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 18.5771
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m0, m1, m2 } = inputs;

    if (m0 === undefined || m1 === undefined || m2 === undefined) {
      errors.push('تمامی پارامترهای توزین M₀، M₁ و M₂ برای آزمون خاکستر الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m0 <= 0 || m1 <= 0 || m2 <= 0) {
      errors.push('مقادیر اوزان باید مثبت باشند.');
    }

    if (m1 <= m0) {
      errors.push('جرم بوته با نمونه (M₁) باید از بوته خالی (M₀) بیشتر باشد.');
    }

    if (m2 < m0) {
      errors.push('خطای بحرانی: جرم بعد از کوره (M₂) از بوته خالی (M₀) کمتر است!');
    }

    if (m2 >= m1) {
      errors.push('خطای غیرمنطقی: جرم خاکستر (M₂) نمی‌تواند مساوی یا بیشتر از جرم نمونه نسوخته (M₁) باشد!');
    }

    const sampleWeight = m1 - m0;
    const ashWeight = m2 - m0;
    const ashPct = (ashWeight / sampleWeight) * 100;

    if (ashPct > 25) {
      warnings.push(`درصد خاکستر به دست آمده (${ashPct.toFixed(2)}%) بسیار بالا است. برای فرآورده‌های غذایی معمول، خاکستر معمولاً زیر ۱۰٪ است (مگر در نمک و ادویه‌جات خاص).`);
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { m0, m1, m2 } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = ASH_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '%',
        decimals,
        standardReference: ASH_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const sampleWeight = m1! - m0!;
    const ashWeight = m2! - m0!;
    const ashPercent = (ashWeight / sampleWeight) * 100;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه جرم نمونه ورودی',
      expression: 'M_{sample} = M_1 - M_0',
      substitutedExpression: `${m1} - ${m0}`,
      intermediateValue: sampleWeight.toFixed(4),
      unit: 'g',
      noteFa: 'وزن خالص ماده غذایی برداشته شده'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه جرم باقیمانده خاکستر معدنی',
      expression: 'M_{ash} = M_2 - M_0',
      substitutedExpression: `${m2} - ${m0}`,
      intermediateValue: ashWeight.toFixed(4),
      unit: 'g',
      noteFa: 'جرم اکسیدها و املاح معدنی نسوخته'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه درصد خاکستر کل',
      expression: '\\% \\text{Ash} = \\frac{M_{ash}}{M_{sample}} \\times 100',
      substitutedExpression: `(${ashWeight.toFixed(4)} / ${sampleWeight.toFixed(4)}) \\times 100`,
      intermediateValue: ashPercent.toFixed(4),
      unit: '%',
      noteFa: 'درصد وزنی مواد معدنی در نمونه'
    });

    trace.push({
      stepNumber: 4,
      titleFa: 'گرد کردن نتیجه بر اساس اعشار گزارش‌دهی',
      expression: `\\text{Round}(\\% \\text{Ash}, ${decimals})`,
      substitutedExpression: `Round(${ashPercent.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(ashPercent, decimals),
      unit: '%',
      noteFa: `گزارش نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: ashPercent,
      formattedValue: formatScientificNumber(ashPercent, decimals),
      unit: '%',
      decimals,
      standardReference: ASH_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        sampleWeightGrams: sampleWeight,
        ashWeightGrams: ashWeight
      }
    };
  }
};

// -------------------------------------------------------------
// 4. CRUDE PROTEIN (Kjeldahl Method / پروتئین کلدال)
// -------------------------------------------------------------
export const PROTEIN_KJELDAHL_FORMULA: FormulaDefinition = {
  id: 'protein_kjeldahl',
  nameFa: 'درصد پروتئین خام (روش کجلدال و ضریب تبدیل نیتروژن)',
  nameEn: 'Crude Protein Content (Kjeldahl Method)',
  category: 'proximate_analysis',
  standardReference: 'استاندارد ملی ایران ۶۳۹ / AOAC 991.20 / ISO 8968-1',
  standardReferenceDocId: 'INSO-639',
  expressionLatex: '\\% \\text{Protein} = \\frac{(V_s - V_b) \\times N_{\\text{acid}} \\times 0.014007 \\times 100}{M_{\\text{sample}}} \\times F',
  expressionDisplay: 'درصد پروتئین = (((حجم اسید نمونه - حجم اسید شاهد) × نرمالیته اسید × ۰.۰۱۴۰۰۷ × ۱۰۰) / وزن نمونه) × ضریب تبدیل نیتروژن',
  outputUnit: '%',
  defaultDecimals: 2,
  scientificNotesFa: 'نیتروژن آلی توسط اسید سولفوریک غلیظ هضم شده و به سولفات آمونیوم تبدیل می‌شود. پس از تقطیر قلیایی با اسید بوریک، آمونیاک آزاد شده با اسید استاندارد تیتر می‌شود.',
  variables: [
    {
      id: 'vs',
      symbol: 'V_s',
      nameFa: 'حجم اسید مصرفی برای تیتر نمونه (V_sample)',
      nameEn: 'Titrant Volume for Sample (mL)',
      descriptionFa: 'میلی‌لیتر اسید سولفوریک یا کلریدریک مصرف شده برای نمونه',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml'],
      min: 0,
      required: true,
      defaultValue: 16.4
    },
    {
      id: 'vb',
      symbol: 'V_b',
      nameFa: 'حجم اسید مصرفی برای تیتر شاهد (V_blank)',
      nameEn: 'Titrant Volume for Blank (mL)',
      descriptionFa: 'میلی‌لیتر اسید مصرف شده در آزمون شاهد بدون نمونه',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml'],
      min: 0,
      defaultValue: 0.15,
      required: true
    },
    {
      id: 'n_acid',
      symbol: 'N_{acid}',
      nameFa: 'نرمالیته دقیق محلول اسید تیترکننده',
      nameEn: 'Normality of Standard Acid Solution',
      descriptionFa: 'نرمالیته فاکتوردار اسید استاندارد (مثلاً 0.1N یا 0.05N)',
      category: 'concentration',
      defaultUnit: 'normality',
      allowedUnits: ['normality', 'mol_l'],
      min: 0.001,
      max: 2,
      defaultValue: 0.1,
      required: true
    },
    {
      id: 'm_sample',
      symbol: 'M_{sample}',
      nameFa: 'جرم نمونه وزن شده (گرم)',
      nameEn: 'Sample Weight (g)',
      descriptionFa: 'جرم پودر یا مایع برداشته شده برای هضم کجلدال',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      min: 0.001,
      required: true,
      defaultValue: 2.000
    }
  ],
  constants: [
    {
      id: 'f_factor',
      symbol: 'F',
      nameFa: 'ضریب تبدیل نیتروژن به پروتئین (Nitrogen Conversion Factor)',
      nameEn: 'Nitrogen-to-Protein Factor',
      value: 6.25,
      descriptionFa: 'ضریب استاندارد بر اساس نوع فرآورده غذایی',
      options: [
        { labelFa: 'عمومی، گوشت و فرآورده‌های دامی (F = 6.25)', value: 6.25, noteFa: 'استاندارد عمومی صنایع غذایی' },
        { labelFa: 'شیر و فرآورده‌های لبنی (F = 6.38)', value: 6.38, noteFa: 'استاندارد INSO 639 و ISO 8968' },
        { labelFa: 'گندم، آرد و غلات نانوایی (F = 5.70)', value: 5.70, noteFa: 'استاندارد آرد و غلات' },
        { labelFa: 'برنج و فرآورده‌های برنج (F = 5.95)', value: 5.95, noteFa: 'استاندارد برنج' },
        { labelFa: 'سویا و پروتئین گیاهی سویا (F = 5.71)', value: 5.71, noteFa: 'فرآورده‌های سویا' },
        { labelFa: 'بادام و مغزهای آجیلی (F = 5.18)', value: 5.18, noteFa: 'مغزهای خوراکی' },
        { labelFa: 'ژلاتین خوراکی (F = 5.55)', value: 5.55, noteFa: 'ژلاتین و کلاژن' }
      ]
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { vs, vb, n_acid, m_sample } = inputs;

    if (vs === undefined || vb === undefined || n_acid === undefined || m_sample === undefined) {
      errors.push('تمامی مقادیر تیتر (Vs, Vb)، نرمالیته اسید و جرم نمونه الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m_sample <= 0 || n_acid <= 0) {
      errors.push('جرم نمونه و نرمالیته اسید باید مثبت باشند.');
    }

    if (vs < vb) {
      warnings.push('هشدار: حجم مصرفی نمونه (Vs) کمتر از حجم شاهد (Vb) است (نیتروژن منفی).');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { vs, vb, n_acid, m_sample } = inputs;
    const factor = inputs['f_factor'] ?? 6.25;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = PROTEIN_KJELDAHL_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '%',
        decimals,
        standardReference: PROTEIN_KJELDAHL_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const netVolume = Math.max(0, vs! - vb!);
    const nitrogenEquiv = 0.014007; // g of N per meq of acid
    const nitrogenPercent = (netVolume * n_acid! * nitrogenEquiv * 100) / m_sample!;
    const proteinPercent = nitrogenPercent * factor;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه حجم خالص اسید مصرفی برای نیتروژن نمونه',
      expression: 'V_{net} = V_s - V_b',
      substitutedExpression: `${vs} - ${vb}`,
      intermediateValue: netVolume.toFixed(3),
      unit: 'mL',
      noteFa: `کسر حجم شاهد (${vb} mL) از حجم نمونه (${vs} mL)`
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه درصد نیتروژن کل (Total Nitrogen %)',
      expression: '\\% N = \\frac{V_{net} \\times N_{acid} \\times 0.014007 \\times 100}{M_{sample}}',
      substitutedExpression: `(${netVolume.toFixed(3)} \\times ${n_acid} \\times 0.014007 \\times 100) / ${m_sample}`,
      intermediateValue: nitrogenPercent.toFixed(4),
      unit: '%',
      noteFa: 'اکی‌والان نیتروژن = ۰.۰۱۴۰۰۷ گرم'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه درصد پروتئین خام با ضریب تبدیل',
      expression: '\\% \\text{Protein} = \\% N \\times F',
      substitutedExpression: `${nitrogenPercent.toFixed(4)} \\times ${factor}`,
      intermediateValue: proteinPercent.toFixed(4),
      unit: '%',
      noteFa: `ضریب تبدیل انتخابی: ${factor}`
    });

    trace.push({
      stepNumber: 4,
      titleFa: 'گرد کردن نتیجه بر اساس ضوابط کنترل کیفیت',
      expression: `\\text{Round}(\\% \\text{Protein}, ${decimals})`,
      substitutedExpression: `Round(${proteinPercent.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(proteinPercent, decimals),
      unit: '%',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: proteinPercent,
      formattedValue: formatScientificNumber(proteinPercent, decimals),
      unit: '%',
      decimals,
      standardReference: PROTEIN_KJELDAHL_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        nitrogenPercent,
        conversionFactor: factor,
        netVolumeMl: netVolume
      }
    };
  }
};

// -------------------------------------------------------------
// 5. CRUDE FAT (% Fat - Soxhlet / چربی سوکسله)
// -------------------------------------------------------------
export const FAT_SOXHLET_FORMULA: FormulaDefinition = {
  id: 'fat_soxhlet',
  nameFa: 'درصد چربی خام (روش استخراج سوکسله با حلال)',
  nameEn: 'Crude Fat Content (Soxhlet Solvent Extraction)',
  category: 'proximate_analysis',
  standardReference: 'استاندارد ملی ایران ۱۹۹۳ / AOAC 920.39 / ISO 1443',
  standardReferenceDocId: 'INSO-1993',
  expressionLatex: '\\% \\text{Fat} = \\frac{M_2 - M_1}{M_{\\text{sample}}} \\times 100',
  expressionDisplay: 'درصد چربی = ((وزن بالن با چربی - وزن بالن خالی) / وزن نمونه) × ۱۰۰',
  outputUnit: '%',
  defaultDecimals: 2,
  scientificNotesFa: 'چربی آزاد نمونه پس از خشک شدن توسط حلال آلی (پترولیوم اتر یا دی‌اتیل اتر) در دستگاه سوکسله استخراج شده و پس از تبخیر حلال و خشک‌کردن بالن در ۱۰۲ درجه توزین می‌گردد.',
  variables: [
    {
      id: 'm1',
      symbol: 'M₁',
      nameFa: 'جرم بالن خالی خشک‌شده با سنگ جوش (گرم)',
      nameEn: 'Tare Mass of Empty Dried Flask',
      descriptionFa: 'جرم بالن استخراج قبل از شروع سوکسله',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g'],
      min: 0.0001,
      required: true,
      defaultValue: 98.4520
    },
    {
      id: 'm2',
      symbol: 'M₂',
      nameFa: 'جرم بالن + چربی استخراج شده بعد از تبخیر حلال',
      nameEn: 'Mass of Flask + Extracted Fat',
      descriptionFa: 'جرم بالن حاوی چربی خشک شده در آون و خنک شده در دسیکاتور',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g'],
      min: 0.0001,
      required: true,
      defaultValue: 98.8020
    },
    {
      id: 'm_sample',
      symbol: 'M_{sample}',
      nameFa: 'جرم نمونه اولیه وزن شده در کارتوش (گرم)',
      nameEn: 'Initial Sample Mass in Thimble (g)',
      descriptionFa: 'وزن خالص ماده غذایی برداشته شده برای استخراج',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g'],
      min: 0.0001,
      required: true,
      defaultValue: 5.000
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m1, m2, m_sample } = inputs;

    if (m1 === undefined || m2 === undefined || m_sample === undefined) {
      errors.push('تمامی پارامترهای جرم بالن خالی (M₁)، بالن با چربی (M₂) و جرم نمونه الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m_sample <= 0 || m1 <= 0 || m2 <= 0) {
      errors.push('مقادیر اوزان باید مثبت باشند.');
    }

    if (m2 < m1) {
      errors.push('خطای ناممکن: جرم بالن حاوی چربی (M₂) از جرم بالن خالی (M₁) کمتر است!');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { m1, m2, m_sample } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = FAT_SOXHLET_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '%',
        decimals,
        standardReference: FAT_SOXHLET_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const fatWeight = m2! - m1!;
    const fatPercent = (fatWeight / m_sample!) * 100;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه جرم چربی استخراج شده',
      expression: 'M_{fat} = M_2 - M_1',
      substitutedExpression: `${m2} - ${m1}`,
      intermediateValue: fatWeight.toFixed(4),
      unit: 'g',
      noteFa: 'وزن چربی استخراج شده با حلال'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه درصد چربی در نمونه',
      expression: '\\% \\text{Fat} = \\frac{M_{fat}}{M_{sample}} \\times 100',
      substitutedExpression: `(${fatWeight.toFixed(4)} / ${m_sample}) \\times 100`,
      intermediateValue: fatPercent.toFixed(4),
      unit: '%',
      noteFa: 'درصد چربی بر پایه وزن تر نمونه'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'گرد کردن بر اساس تعداد اعشار مجاز',
      expression: `\\text{Round}(\\% \\text{Fat}, ${decimals})`,
      substitutedExpression: `Round(${fatPercent.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(fatPercent, decimals),
      unit: '%',
      noteFa: `گزارش نتیجه با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: fatPercent,
      formattedValue: formatScientificNumber(fatPercent, decimals),
      unit: '%',
      decimals,
      standardReference: FAT_SOXHLET_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        fatWeightGrams: fatWeight,
        sampleWeightGrams: m_sample
      }
    };
  }
};

// -------------------------------------------------------------
// 6. CRUDE FIBER (Weende Method / فیبر خام روش وندی)
// -------------------------------------------------------------
export const CRUDE_FIBER_FORMULA: FormulaDefinition = {
  id: 'crude_fiber_weende',
  nameFa: 'درصد فیبر خام (روش استاندارد وِندی با هضم اسیدی و قلیایی)',
  nameEn: 'Crude Fiber Content (Weende Digestion Method)',
  category: 'proximate_analysis',
  standardReference: 'استاندارد ملی ایران ۳۱۶ / AOAC 962.09 / ISO 6865',
  standardReferenceDocId: 'INSO-316',
  expressionLatex: '\\% \\text{Crude Fiber} = \\frac{M_1 - M_2}{M_{\\text{sample}}} \\times 100',
  expressionDisplay: 'درصد فیبر خام = ((وزن باقیمانده خشک پس از هضم - وزن خاکستر پس از کوره ۵۵۰°) / وزن نمونه) × ۱۰۰',
  outputUnit: '%',
  defaultDecimals: 2,
  scientificNotesFa: 'نمونه چربی‌گیری شده ابتدا به مدت ۳۰ دقیقه با اسید سولفوریک ۱.۲۵٪ و سپس ۳۰ دقیقه با هیدروکسید سدیم ۱.۲۵٪ جوشانده و هضم می‌شود. باقیمانده روی بوته فیلتر خشک شده (M1) و سپس در کوره ۵۵۰ درجه سوزانده می‌شود (M2). اختلاف وزن معرف فیبر خام است.',
  variables: [
    {
      id: 'm1',
      symbol: 'M₁',
      nameFa: 'جرم بوته گوده + باقیمانده خشک پس از هضم (آون ۱۳۰ درجه)',
      nameEn: 'Mass of Crucible + Dried Residue after Acid/Alkali Digestion (g)',
      descriptionFa: 'جرم بوته گوچ/فیلتر به همراه باقیمانده آلی و معدنی پس از شستشو و آون',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g'],
      min: 0.0001,
      required: true,
      defaultValue: 32.4150
    },
    {
      id: 'm2',
      symbol: 'M₂',
      nameFa: 'جرم بوته گوده + خاکستر باقیمانده بعد از کوره ۵۵۰ درجه',
      nameEn: 'Mass of Crucible + Ash Residue after Muffle Furnace 550°C (g)',
      descriptionFa: 'جرم بوته و خاکستر پس از سوختن فیبر در کوره',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g'],
      min: 0.0001,
      required: true,
      defaultValue: 32.3650
    },
    {
      id: 'm_sample',
      symbol: 'M_{sample}',
      nameFa: 'جرم نمونه اولیه وزن شده (گرم)',
      nameEn: 'Initial Sample Weight (g)',
      descriptionFa: 'جرم نمونه اولیه قبل از هضم (معمولاً ۱ تا ۲ گرم)',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g'],
      min: 0.0001,
      required: true,
      defaultValue: 2.0000
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m1, m2, m_sample } = inputs;

    if (m1 === undefined || m2 === undefined || m_sample === undefined) {
      errors.push('تمامی مقادیر M₁، M₂ و M_sample برای آزمون فیبر الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m_sample <= 0 || m1 <= 0 || m2 <= 0) {
      errors.push('مقادیر باید مثبت باشند.');
    }

    if (m1 < m2) {
      errors.push('خطای غیرمنطقی: وزن قبل از کوره (M₁) از وزن بعد از کوره (M₂) کمتر است!');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { m1, m2, m_sample } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = CRUDE_FIBER_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '%',
        decimals,
        standardReference: CRUDE_FIBER_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const fiberLoss = m1! - m2!;
    const crudeFiberPercent = (fiberLoss / m_sample!) * 100;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه جرم مواد آلی فیبری سوزانده‌شده',
      expression: '\\Delta M_{\\text{fiber}} = M_1 - M_2',
      substitutedExpression: `${m1} - ${m2}`,
      intermediateValue: fiberLoss.toFixed(4),
      unit: 'g',
      noteFa: 'کاهش وزن حین سوزاندن در ۵۵۰ درجه'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه درصد فیبر خام در ماده غذایی',
      expression: '\\% \\text{Crude Fiber} = \\frac{\\Delta M_{\\text{fiber}}}{M_{\\text{sample}}} \\times 100',
      substitutedExpression: `(${fiberLoss.toFixed(4)} / ${m_sample}) \\times 100`,
      intermediateValue: crudeFiberPercent.toFixed(4),
      unit: '%',
      noteFa: 'درصد فیبر خام بر مبنای وزن اولیه'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'گرد کردن نهایی',
      expression: `\\text{Round}(\\% \\text{Crude Fiber}, ${decimals})`,
      substitutedExpression: `Round(${crudeFiberPercent.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(crudeFiberPercent, decimals),
      unit: '%',
      noteFa: `گزارش نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: crudeFiberPercent,
      formattedValue: formatScientificNumber(crudeFiberPercent, decimals),
      unit: '%',
      decimals,
      standardReference: CRUDE_FIBER_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        fiberLossGrams: fiberLoss,
        sampleWeightGrams: m_sample
      }
    };
  }
};

// -------------------------------------------------------------
// 7. TOTAL CARBOHYDRATE BY DIFFERENCE & CALORIES (FAO / تفاضل)
// -------------------------------------------------------------
export const CARBOHYDRATE_DIFFERENCE_FORMULA: FormulaDefinition = {
  id: 'carbohydrate_by_difference',
  nameFa: 'کربوهیدرات کل به روش تفاضل و انرژی متابولیکی (FAO / Atwater)',
  nameEn: 'Total Carbohydrate by Difference & Energy Value (FAO / Atwater Factors)',
  category: 'proximate_analysis',
  standardReference: 'سازمان خواربار و کشاورزی ملل متحد (FAO Food & Nutrition Paper 77) / استاندارد ملی ایران ۵۶۲۴',
  standardReferenceDocId: 'FAO-FNP-77',
  expressionLatex: '\\% \\text{Carb} = 100 - (\\% \\text{Moisture} + \\% \\text{Protein} + \\% \\text{Fat} + \\% \\text{Ash})',
  expressionDisplay: 'درصد کربوهیدرات کل = ۱۰۰ - (درصد رطوبت + درصد پروتئین + درصد چربی + درصد خاکستر)',
  outputUnit: '%',
  defaultDecimals: 2,
  scientificNotesFa: 'روش استاندارد بین‌المللی FAO برای محاسبه کربوهیدرات کل. انرژی کل با استفاده از ضرایب عمومی آت‌واتر (Atwater): ۴ کیلوکالری بر گرم برای پروتئین و کربوهیدرات، و ۹ کیلوکالری بر گرم برای چربی محاسبه می‌شود.',
  variables: [
    {
      id: 'pct_moisture',
      symbol: '\\% \\text{Moisture}',
      nameFa: 'درصد رطوبت (% Moisture)',
      nameEn: 'Moisture Percentage (%)',
      descriptionFa: 'درصد رطوبت به دست آمده از آزمون آون',
      category: 'percent',
      defaultUnit: 'percent',
      allowedUnits: ['percent'],
      min: 0,
      max: 100,
      required: true,
      defaultValue: 12.5
    },
    {
      id: 'pct_protein',
      symbol: '\\% \\text{Protein}',
      nameFa: 'درصد پروتئین خام (% Protein)',
      nameEn: 'Crude Protein Percentage (%)',
      descriptionFa: 'درصد پروتئین به دست آمده از آزمون کجلدال',
      category: 'percent',
      defaultUnit: 'percent',
      allowedUnits: ['percent'],
      min: 0,
      max: 100,
      required: true,
      defaultValue: 10.2
    },
    {
      id: 'pct_fat',
      symbol: '\\% \\text{Fat}',
      nameFa: 'درصد چربی خام (% Fat)',
      nameEn: 'Crude Fat Percentage (%)',
      descriptionFa: 'درصد چربی استخراج شده با سوکسله یا ژربر',
      category: 'percent',
      defaultUnit: 'percent',
      allowedUnits: ['percent'],
      min: 0,
      max: 100,
      required: true,
      defaultValue: 4.8
    },
    {
      id: 'pct_ash',
      symbol: '\\% \\text{Ash}',
      nameFa: 'درصد خاکستر کل (% Ash)',
      nameEn: 'Total Ash Percentage (%)',
      descriptionFa: 'درصد مواد معدنی نسوخته در کوره ۵۵۰ درجه',
      category: 'percent',
      defaultUnit: 'percent',
      allowedUnits: ['percent'],
      min: 0,
      max: 100,
      required: true,
      defaultValue: 1.5
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { pct_moisture, pct_protein, pct_fat, pct_ash } = inputs;

    if (pct_moisture === undefined || pct_protein === undefined || pct_fat === undefined || pct_ash === undefined) {
      errors.push('تمامی چهار فاکتور آنالیز تقریبی (رطوبت، پروتئین، چربی، خاکستر) الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (pct_moisture < 0 || pct_protein < 0 || pct_fat < 0 || pct_ash < 0) {
      errors.push('درصدهای اجزای تقریب نمی‌توانند منفی باشند.');
    }

    const sum = pct_moisture + pct_protein + pct_fat + pct_ash;
    if (sum > 100) {
      errors.push(`خطای مجموع تقریب: مجموع چهار جزء (${sum.toFixed(2)}%) از ۱۰۰٪ بیشتر است! کربوهیدرات منفی می‌شود.`);
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { pct_moisture, pct_protein, pct_fat, pct_ash } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = CARBOHYDRATE_DIFFERENCE_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '%',
        decimals,
        standardReference: CARBOHYDRATE_DIFFERENCE_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const sumOther = pct_moisture! + pct_protein! + pct_fat! + pct_ash!;
    const carbohydrate = 100 - sumOther;
    const kcalPer100g = (pct_protein! * 4) + (carbohydrate * 4) + (pct_fat! * 9);
    const kjPer100g = kcalPer100g * 4.184;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه مجموع اجزای تعیین‌شده (رطوبت + پروتئین + چربی + خاکستر)',
      expression: '\\sum \\text{Proximate} = \\% \\text{Moisture} + \\% \\text{Protein} + \\% \\text{Fat} + \\% \\text{Ash}',
      substitutedExpression: `${pct_moisture} + ${pct_protein} + ${pct_fat} + ${pct_ash}`,
      intermediateValue: sumOther.toFixed(2),
      unit: '%',
      noteFa: 'مجموع درصد اجزای آنالیز شده'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه درصد کربوهیدرات کل به روش تفاضل',
      expression: '\\% \\text{Carbohydrate} = 100 - \\sum \\text{Proximate}',
      substitutedExpression: `100 - ${sumOther.toFixed(2)}`,
      intermediateValue: carbohydrate.toFixed(4),
      unit: '%',
      noteFa: 'درصد کربوهیدرات کل در ۱۰۰ گرم ماده غذایی'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه ارزش انرژی‌زایی بر مبنای ضرایب استاندارد آت‌واتر (Atwater)',
      expression: '\\text{Energy} = (4 \\times \\text{Protein}) + (4 \\times \\text{Carb}) + (9 \\times \\text{Fat})',
      substitutedExpression: `(4 \\times ${pct_protein}) + (4 \\times ${carbohydrate.toFixed(2)}) + (9 \\times ${pct_fat})`,
      intermediateValue: kcalPer100g.toFixed(1),
      unit: 'kcal / 100g',
      noteFa: `معادل ${kjPer100g.toFixed(1)} kJ در ۱۰۰ گرم`
    });

    trace.push({
      stepNumber: 4,
      titleFa: 'گرد کردن نهایی',
      expression: `\\text{Round}(\\% \\text{Carb}, ${decimals})`,
      substitutedExpression: `Round(${carbohydrate.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(carbohydrate, decimals),
      unit: '%',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: carbohydrate,
      formattedValue: formatScientificNumber(carbohydrate, decimals),
      unit: '%',
      decimals,
      standardReference: CARBOHYDRATE_DIFFERENCE_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        carbohydratePercent: carbohydrate,
        energyKcalPer100g: kcalPer100g,
        energyKjPer100g: kjPer100g
      }
    };
  }
};

// -------------------------------------------------------------
// 8. TITRATABLE ACIDITY (اسیدیته قابل تیتر)
// -------------------------------------------------------------
export const ACIDITY_FORMULA: FormulaDefinition = {
  id: 'titratable_acidity',
  nameFa: 'درصد اسیدیته قابل تیتر (تیتراسیون با هیدروکسید سدیم)',
  nameEn: 'Titratable Acidity (% TA)',
  category: 'titration_chemistry',
  standardReference: 'استاندارد ملی ایران ۲۸۵۲ و ۱۶۸ / AOAC 942.15 / ISO 750',
  standardReferenceDocId: 'INSO-2852',
  expressionLatex: '\\% \\text{Acidity} = \\frac{V_{\\text{NaOH}} \\times N_{\\text{NaOH}} \\times \\text{Meq.Factor} \\times 100}{M_{\\text{sample}}}',
  expressionDisplay: 'درصد اسیدیته = ((حجم سود مصرفی × نرمالیته سود × فاکتور اکی‌والان اسید × ۱۰۰) / وزن نمونه)',
  outputUnit: '%',
  defaultDecimals: 3,
  scientificNotesFa: 'اسیدهای آلی نمونه با محلول سود استاندارد در حضور معرف فنل‌فتالئین تا ظهور رنگ صورتی کم‌رنگ پایدار (pH = 8.1 - 8.3) تیتر می‌شوند.',
  variables: [
    {
      id: 'v_naoh',
      symbol: 'V_{NaOH}',
      nameFa: 'حجم محلول سود مصرفی در تیتراسیون (میلی‌لیتر)',
      nameEn: 'Volume of Titrated NaOH Solution (mL)',
      descriptionFa: 'میلی‌لیتر سود 0.1 نرمال مصرف شده از بورت تا نقطه پایانی',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml'],
      min: 0,
      required: true,
      defaultValue: 4.2
    },
    {
      id: 'n_naoh',
      symbol: 'N_{NaOH}',
      nameFa: 'نرمالیته محلول هیدروکسید سدیم',
      nameEn: 'Normality of NaOH Solution',
      descriptionFa: 'نرمالیته استاندارد (معمولاً 0.1 N)',
      category: 'concentration',
      defaultUnit: 'normality',
      allowedUnits: ['normality'],
      min: 0.001,
      defaultValue: 0.1,
      required: true
    },
    {
      id: 'm_sample',
      symbol: 'M_{sample}',
      nameFa: 'جرم یا حجم نمونه آزمایشی (گرم / میلی‌لیتر)',
      nameEn: 'Sample Weight or Volume',
      descriptionFa: 'مقدار نمونه برداشته شده (مثلاً ۱۰ گرم شیر یا آبمیوه)',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'ml'],
      min: 0.001,
      required: true,
      defaultValue: 10.0
    }
  ],
  constants: [
    {
      id: 'acid_factor',
      symbol: 'Meq',
      nameFa: 'فاکتور میلی‌اکی‌والان اسید غالب (Milli-equivalent Factor)',
      nameEn: 'Acid Milliequivalent Factor',
      value: 0.090,
      descriptionFa: 'گرم اسید خنثی شده توسط ۱ میلی‌لیتر سود ۱ نرمال',
      options: [
        { labelFa: 'اسید لاکتیک - شیر و فرآورده‌های لبنی (۰.۰۹۰)', value: 0.090, noteFa: 'اسید غالب در فرآورده‌های تخمیری لبنی' },
        { labelFa: 'اسید سیتریک بدون آب - مرکبات و آبمیوه‌ها (۰.۰۶۴)', value: 0.064, noteFa: 'اسید غالب در مرکبات و گوجه‌فرنگی' },
        { labelFa: 'اسید استیک - سرکه و ترشیجات (۰.۰۶۰)', value: 0.060, noteFa: 'اسید غالب در سرکه' },
        { labelFa: 'اسید مالیک - سیب و آب سیب (۰.۰۶۷)', value: 0.067, noteFa: 'اسید غالب در سیب و گلابی' },
        { labelFa: 'اسید تارتاریک - انگور و آبغوره (۰.۰۷۵)', value: 0.075, noteFa: 'اسید غالب در انگور' },
        { labelFa: 'اسید اولئیک - اسیدیته روغن‌ها و چربی‌ها (۰.۲۸۲)', value: 0.282, noteFa: 'شاخص اسیدیته اسیدهای چرب آزاد FFA' }
      ]
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { v_naoh, n_naoh, m_sample } = inputs;

    if (v_naoh === undefined || n_naoh === undefined || m_sample === undefined) {
      errors.push('تمامی پارامترهای حجم سود، نرمالیته و جرم نمونه الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m_sample <= 0 || n_naoh <= 0) {
      errors.push('جرم نمونه و نرمالیته سود باید مثبت باشند.');
    }

    if (v_naoh < 0) {
      errors.push('حجم سود نمی‌تواند منفی باشد.');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 3;
    const { v_naoh, n_naoh, m_sample } = inputs;
    const acidFactor = inputs['acid_factor'] ?? 0.090;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = ACIDITY_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '%',
        decimals,
        standardReference: ACIDITY_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const acidityPercent = (v_naoh! * n_naoh! * acidFactor * 100) / m_sample!;
    const dornicDegree = (v_naoh! * 10) / (m_sample! / 10);

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه میلی‌اکی‌والان اسید خنثی‌شده',
      expression: '\\text{meq} = V_{\\text{NaOH}} \\times N_{\\text{NaOH}}',
      substitutedExpression: `${v_naoh} \\times ${n_naoh}`,
      intermediateValue: (v_naoh! * n_naoh!).toFixed(4),
      unit: 'meq',
      noteFa: 'میزان قلیای خالص واکنش داده'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه درصد وزنی اسیدیته بر حسب اسید غالب',
      expression: '\\% \\text{Acidity} = \\frac{\\text{meq} \\times \\text{Meq.Factor} \\times 100}{M_{sample}}',
      substitutedExpression: `(${v_naoh} \\times ${n_naoh} \\times ${acidFactor} \\times 100) / ${m_sample}`,
      intermediateValue: acidityPercent.toFixed(4),
      unit: '%',
      noteFa: `فاکتور اکی‌والان اسید: ${acidFactor}`
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'گرد کردن بر اساس استاندارد آزمایشگاهی',
      expression: `\\text{Round}(\\% \\text{Acidity}, ${decimals})`,
      substitutedExpression: `Round(${acidityPercent.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(acidityPercent, decimals),
      unit: '%',
      noteFa: `معادل درجه دورنیک (°D) برای لبنیات: ${dornicDegree.toFixed(1)} °D`
    });

    return {
      success: true,
      value: acidityPercent,
      formattedValue: formatScientificNumber(acidityPercent, decimals),
      unit: '%',
      decimals,
      standardReference: ACIDITY_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        acidityPercent,
        dornicDegree,
        acidFactor
      }
    };
  }
};

// -------------------------------------------------------------
// 9. SALT CONTENT (% NaCl - Mohr Titration / نمک طعام)
// -------------------------------------------------------------
export const SALT_MOHR_FORMULA: FormulaDefinition = {
  id: 'salt_mohr',
  nameFa: 'درصد نمک طعام / کلرید سدیم (روش تیتراسیون مور با نیترات نقره)',
  nameEn: 'Salt Content (% NaCl - Mohr Method)',
  category: 'titration_chemistry',
  standardReference: 'استاندارد ملی ایران ۱۸۰۷ / AOAC 935.47 / ISO 1841-1',
  standardReferenceDocId: 'INSO-1807',
  expressionLatex: '\\% \\text{NaCl} = \\frac{(V_s - V_b) \\times N_{\\text{AgNO}_3} \\times 0.05844 \\times 100}{M_{\\text{sample}}}',
  expressionDisplay: 'درصد نمک = (((حجم نیترات نقره نمونه - حجم شاهد) × نرمالیته نیترات نقره × ۰.۰۵۸۴۴ × ۱۰۰) / وزن نمونه)',
  outputUnit: '%',
  defaultDecimals: 2,
  scientificNotesFa: 'یون‌های کلرید با نیترات نقره در حضور معرف کرومات پتاسیم واکنش داده و رسوب سفید کلرید نقره تشکیل می‌دهند. پس از پایان کلرید، اولین قطره اضافی نقره با کرومات رسوب قهوه‌ای-قرمز رنگ کرومات نقره ایجاد می‌کند.',
  variables: [
    {
      id: 'vs',
      symbol: 'V_s',
      nameFa: 'حجم نیترات نقره مصرفی برای نمونه (میلی‌لیتر)',
      nameEn: 'Titrant Volume for Sample (mL)',
      descriptionFa: 'میلی‌لیتر AgNO3 0.1 N مصرف شده تا ظهور رنگ آجری پایدار',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml'],
      min: 0,
      required: true,
      defaultValue: 8.6
    },
    {
      id: 'vb',
      symbol: 'V_b',
      nameFa: 'حجم نیترات نقره مصرفی شاهد (میلی‌لیتر)',
      nameEn: 'Titrant Volume for Blank (mL)',
      descriptionFa: 'حجم مصرفی آزمون شاهد آب مقطر و معرف',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml'],
      min: 0,
      defaultValue: 0.1,
      required: true
    },
    {
      id: 'n_agno3',
      symbol: 'N_{\\text{AgNO}_3}',
      nameFa: 'نرمالیته محلول نیترات نقره (AgNO₃)',
      nameEn: 'Normality of AgNO₃ Solution',
      descriptionFa: 'نرمالیته استاندارد (معمولاً 0.1 N)',
      category: 'concentration',
      defaultUnit: 'normality',
      allowedUnits: ['normality'],
      min: 0.001,
      defaultValue: 0.1,
      required: true
    },
    {
      id: 'm_sample',
      symbol: 'M_{sample}',
      nameFa: 'جرم نمونه وزن شده (گرم)',
      nameEn: 'Sample Mass (g)',
      descriptionFa: 'وزن ماده غذایی (مانند پنیر، کنسرو، ترشی، فرآورده گوشتی)',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g'],
      min: 0.001,
      required: true,
      defaultValue: 5.00
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { vs, vb, n_agno3, m_sample } = inputs;

    if (vs === undefined || vb === undefined || n_agno3 === undefined || m_sample === undefined) {
      errors.push('تمامی پارامترهای حجم نیترات نقره، نرمالیته و جرم نمونه الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m_sample <= 0 || n_agno3 <= 0) {
      errors.push('جرم نمونه و نرمالیته باید مثبت باشند.');
    }

    if (vs < vb) {
      warnings.push('حجم نیترات نقره نمونه کمتر از شاهد است؛ نتیجه صفر گزارش خواهد شد.');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { vs, vb, n_agno3, m_sample } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = SALT_MOHR_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '%',
        decimals,
        standardReference: SALT_MOHR_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const netVolume = Math.max(0, vs! - vb!);
    const naclMeq = 0.05844; // Grams of NaCl per meq (MW = 58.44 g/mol)
    const saltPercent = (netVolume * n_agno3! * naclMeq * 100) / m_sample!;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه حجم خالص نیترات نقره مصرف شده',
      expression: 'V_{net} = V_s - V_b',
      substitutedExpression: `${vs} - ${vb}`,
      intermediateValue: netVolume.toFixed(3),
      unit: 'mL',
      noteFa: 'حجم کسر شده شاهد'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه درصد وزنی کلرید سدیم (% NaCl)',
      expression: '\\% \\text{NaCl} = \\frac{V_{net} \\times N_{\\text{AgNO}_3} \\times 0.05844 \\times 100}{M_{sample}}',
      substitutedExpression: `(${netVolume.toFixed(3)} \\times ${n_agno3} \\times 0.05844 \\times 100) / ${m_sample}`,
      intermediateValue: saltPercent.toFixed(4),
      unit: '%',
      noteFa: 'اکی‌والان کلرید سدیم = ۰.۰۵۸۴۴ گرم'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'گرد کردن نهایی بر اساس استاندارد گزارش‌دهی',
      expression: `\\text{Round}(\\% \\text{NaCl}, ${decimals})`,
      substitutedExpression: `Round(${saltPercent.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(saltPercent, decimals),
      unit: '%',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: saltPercent,
      formattedValue: formatScientificNumber(saltPercent, decimals),
      unit: '%',
      decimals,
      standardReference: SALT_MOHR_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        saltPercent,
        netVolumeMl: netVolume
      }
    };
  }
};

// -------------------------------------------------------------
// 10. BRIX & TEMPERATURE CORRECTION (بریکس و تصحیح دمایی)
// -------------------------------------------------------------
export const BRIX_CORRECTION_FORMULA: FormulaDefinition = {
  id: 'brix_temperature_correction',
  nameFa: 'درجه بریکس و تصحیح دمایی رفراکتومتر (Brix & Temp Correction to 20°C)',
  nameEn: 'Refractometric Brix & Temperature Correction (ICUMSA / AOAC 932.12)',
  category: 'physical_chemical',
  standardReference: 'کمیسیون بین‌المللی روش‌های یکنواخت آنالیز شکر (ICUMSA SPS-3 2000) / AOAC 932.12 / استاندارد ملی ایران ۳۰۸۴',
  standardReferenceDocId: 'ICUMSA-SPS-3',
  expressionLatex: '\\text{Brix}_{20^\\circ\\text{C}} = \\text{Brix}_{\\text{obs}} + (T - 20) \\times (0.0007 \\times \\text{Brix}_{\\text{obs}} + 0.06)',
  expressionDisplay: 'بریکس تصحیح شده در ۲۰ درجه = بریکس خوانده‌شده + (دما - ۲۰) × (۰.۰۰۰۷ × بریکس + ۰.۰۶)',
  outputUnit: '°Brix',
  defaultDecimals: 2,
  scientificNotesFa: 'ضریب شکست محلول‌های قندی به شدت تابع دما است. دمای مرجع استاندارد ۲۰ درجه سانتی‌گراد است. اگر قرائت در دمایی غیر از ۲۰ درجه انجام شود، تصحیح دمایی طبق جداول رسمی ICUMSA الزامی است.',
  variables: [
    {
      id: 'brix_obs',
      symbol: '\\text{Brix}_{\\text{obs}}',
      nameFa: 'درجه بریکس خوانده‌شده از رفرکتومتر (°Brix)',
      nameEn: 'Observed Refractometer Brix',
      descriptionFa: 'درصد مواد جامد محلول خوانده شده از چشمی یا نمایشگر دیجیتال',
      category: 'dimensionless',
      defaultUnit: 'unitless',
      allowedUnits: ['unitless', 'percent'],
      min: 0,
      max: 95,
      required: true,
      defaultValue: 18.5
    },
    {
      id: 'temperature',
      symbol: 'T',
      nameFa: 'دمای نمونه حین قرائت (سلسیوس - °C)',
      nameEn: 'Sample Temperature (°C)',
      descriptionFa: 'دمای محیط یا نمونه بر حسب درجه سانتی‌گراد',
      category: 'temperature',
      defaultUnit: 'c',
      allowedUnits: ['c', 'f'],
      min: 5,
      max: 60,
      required: true,
      defaultValue: 26.0
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { brix_obs, temperature } = inputs;

    if (brix_obs === undefined || temperature === undefined) {
      errors.push('ورود بریکس خوانده شده و دمای آزمون الزامی است.');
      return { valid: false, errors, warnings };
    }

    if (brix_obs < 0 || brix_obs > 100) {
      errors.push('درجه بریکس باید بین ۰ تا ۱۰۰ باشد.');
    }

    if (temperature < 5 || temperature > 50) {
      warnings.push('دمای اندازه‌گیری خارج از بازه استاندارد ۵ تا ۵۰ درجه سانتی‌گراد است؛ دقت تصحیح ممکن است کاهش یابد.');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { brix_obs, temperature } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = BRIX_CORRECTION_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '°Brix',
        decimals,
        standardReference: BRIX_CORRECTION_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const deltaT = temperature! - 20.0;
    // ICUMSA / AOAC Temperature correction approximation
    const correctionFactor = deltaT * (0.0007 * brix_obs! + 0.06);
    const correctedBrix = Math.max(0, brix_obs! + correctionFactor);

    // Approximate specific gravity at 20/20°C: SG ≈ 1 + (Brix / (258.6 - (Brix / 258.2) * 227.1))
    const sg = 1 + (correctedBrix / (258.6 - (correctedBrix / 258.2) * 227.1));
    const solubleSolidsGramsPerL = (correctedBrix / 100) * sg * 1000;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه انحراف دما از دمای مرجع ۲۰ درجه (ΔT)',
      expression: '\\Delta T = T_{\\text{measured}} - 20^\\circ\\text{C}',
      substitutedExpression: `${temperature} - 20`,
      intermediateValue: deltaT.toFixed(1),
      unit: '°C',
      noteFa: deltaT >= 0 ? `دمای نمونه ${deltaT.toFixed(1)} درجه گرم‌تر از مرجع است (ضریب افزایشی)` : `دمای نمونه ${Math.abs(deltaT).toFixed(1)} درجه سردتر از مرجع است (ضریب کاهشی)`
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه فاکتور تصحیح دمایی ICUMSA',
      expression: '\\Delta \\text{Brix} = \\Delta T \\times (0.0007 \\times \\text{Brix}_{\\text{obs}} + 0.06)',
      substitutedExpression: `${deltaT.toFixed(1)} \\times (0.0007 \\times ${brix_obs} + 0.06)`,
      intermediateValue: correctionFactor >= 0 ? `+${correctionFactor.toFixed(3)}` : correctionFactor.toFixed(3),
      unit: '°Brix',
      noteFa: 'فاکتور تصحیح شکست نور'
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه بریکس تصحیح‌شده در ۲۰ درجه سانتی‌گراد',
      expression: '\\text{Brix}_{20^\\circ\\text{C}} = \\text{Brix}_{\\text{obs}} + \\Delta \\text{Brix}',
      substitutedExpression: `${brix_obs} + (${correctionFactor.toFixed(3)})`,
      intermediateValue: correctedBrix.toFixed(4),
      unit: '°Brix',
      noteFa: `چگالی نسبی تخمینی (SG): ${sg.toFixed(4)} | ماده محلول: ${solubleSolidsGramsPerL.toFixed(1)} g/L`
    });

    trace.push({
      stepNumber: 4,
      titleFa: 'گرد کردن نهایی بر اساس استاندارد',
      expression: `\\text{Round}(\\text{Brix}_{20^\\circ\\text{C}}, ${decimals})`,
      substitutedExpression: `Round(${correctedBrix.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(correctedBrix, decimals),
      unit: '°Brix',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: correctedBrix,
      formattedValue: formatScientificNumber(correctedBrix, decimals),
      unit: '°Brix',
      decimals,
      standardReference: BRIX_CORRECTION_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        observedBrix: brix_obs,
        temperatureC: temperature,
        tempCorrection: correctionFactor,
        correctedBrix,
        approximateSpecificGravity: sg,
        totalSolubleSolidsGPerL: solubleSolidsGramsPerL
      }
    };
  }
};

// -------------------------------------------------------------
// 11. PROCESS / EXTRACTION YIELD (% Yield / راندمان استخراج و فرآوری)
// -------------------------------------------------------------
export const YIELD_FORMULA: FormulaDefinition = {
  id: 'process_yield',
  nameFa: 'راندمان استخراج و بازده فرآوری (% Process / Extraction Yield)',
  nameEn: 'Process & Extraction Yield Percentage (%)',
  category: 'process_engineering',
  standardReference: 'Food Process Engineering (Heldman & Singh) / Unit Operations in Food Processing (Fellows)',
  standardReferenceDocId: 'FOOD-ENG-YIELD',
  expressionLatex: '\\% \\text{Yield} = \\frac{M_{\\text{final product}}}{M_{\\text{raw material}}} \\times 100 = \\frac{M_{\\text{extracted analyte}}}{M_{\\text{theoretical maximum}}} \\times 100',
  expressionDisplay: 'درصد راندمان = (جرم محصول یا عصاره نهایی / جرم ماده اولیه ورودی) × ۱۰۰',
  outputUnit: '%',
  defaultDecimals: 2,
  scientificNotesFa: 'شاخص ارزیابی کارایی فرآیندهای صنعتی و پایلوت مانند روغن‌کشی، عصاره‌گیری، پنیرسازی، و کنسانتره‌سازی. نسبت خروجی مطلوب به ورودی خام.',
  variables: [
    {
      id: 'm_product',
      symbol: 'M_{\\text{product}}',
      nameFa: 'جرم محصول تولیدی یا عصاره نهایی (kg یا g)',
      nameEn: 'Mass of Final Product or Extract (kg or g)',
      descriptionFa: 'مقدار خروجی واقعی تولید شده',
      category: 'mass',
      defaultUnit: 'kg',
      allowedUnits: ['kg', 'g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 18.5
    },
    {
      id: 'm_raw',
      symbol: 'M_{\\text{raw}}',
      nameFa: 'جرم ماده اولیه ورودی یا خوراک (kg یا g)',
      nameEn: 'Mass of Initial Raw Material (kg or g)',
      descriptionFa: 'مقدار ورودی اولیه خام قبل از فرآوری',
      category: 'mass',
      defaultUnit: 'kg',
      allowedUnits: ['kg', 'g', 'mg'],
      min: 0.0001,
      required: true,
      defaultValue: 100.0
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m_product, m_raw } = inputs;

    if (m_product === undefined || m_raw === undefined) {
      errors.push('ورود مقادیر محصول نهایی و ماده اولیه ورودی الزامی است.');
      return { valid: false, errors, warnings };
    }

    if (m_product <= 0 || m_raw <= 0) {
      errors.push('مقادیر باید اعدادی مثبت باشند.');
    }

    if (m_product > m_raw) {
      warnings.push('جرم محصول نهایی از ماده اولیه ورودی بیشتر است (ممکن است آب، شکر یا حلال افزوده شده باشد).');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { m_product, m_raw } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = YIELD_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '%',
        decimals,
        standardReference: YIELD_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const yieldPercent = (m_product! / m_raw!) * 100;
    const lossPercent = Math.max(0, 100 - yieldPercent);

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه نسبت محصول به خوراک ورودی',
      expression: '\\text{Ratio} = \\frac{M_{\\text{product}}}{M_{\\text{raw}}}',
      substitutedExpression: `${m_product} / ${m_raw}`,
      intermediateValue: (m_product! / m_raw!).toFixed(4),
      unit: 'ratio',
      noteFa: 'کسر جرمی بازیابی شده'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه راندمان استخراج / تولید درصدی (% Yield)',
      expression: '\\% \\text{Yield} = \\text{Ratio} \\times 100',
      substitutedExpression: `(${m_product} / ${m_raw}) \\times 100`,
      intermediateValue: yieldPercent.toFixed(4),
      unit: '%',
      noteFa: `افت فرآیندی (Process Loss): ${lossPercent.toFixed(decimals)}%`
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'گرد کردن نهایی',
      expression: `\\text{Round}(\\% \\text{Yield}, ${decimals})`,
      substitutedExpression: `Round(${yieldPercent.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(yieldPercent, decimals),
      unit: '%',
      noteFa: `نتیجه با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: yieldPercent,
      formattedValue: formatScientificNumber(yieldPercent, decimals),
      unit: '%',
      decimals,
      standardReference: YIELD_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        yieldPercent,
        lossPercent
      }
    };
  }
};

// -------------------------------------------------------------
// 12. ANALYTICAL SPIKE RECOVERY (% Recovery / درصد بازیابی در کنترل کیفیت)
// -------------------------------------------------------------
export const SPIKE_RECOVERY_FORMULA: FormulaDefinition = {
  id: 'spike_recovery',
  nameFa: 'درصد بازیابی در آزمون اسپایک (Analytical Spike Recovery % - QC Validation)',
  nameEn: 'Analytical Spike Recovery Percentage (Method Validation)',
  category: 'physical_chemical',
  standardReference: 'دستورالعمل صحه‌گذاری روش‌های آزمون AOAC / راهنمای یوراکم (EURACHEM Guide) / ISO/IEC 17025',
  standardReferenceDocId: 'AOAC-VAL-REC',
  expressionLatex: '\\% \\text{Recovery} = \\frac{C_{\\text{spiked}} - C_{\\text{unspiked}}}{C_{\\text{added}}} \\times 100',
  expressionDisplay: 'درصد بازیابی = ((غلظت نمونه اسپایک‌شده - غلظت نمونه پایه) / غلظت استاندارد افزوده شده) × ۱۰۰',
  outputUnit: '%',
  defaultDecimals: 2,
  scientificNotesFa: 'شاخص کلیدی در اعتبارسنجی روش‌های آزمون شیمیایی و کنترل خطای سیستماتیک (Recovery Bias). طبق راهنمای AOAC، برای مقادیر عمده بازیابی ۹۵-۱۰۵٪ و برای سطوح ردپا (ppm/ppb) بازیابی ۸۰-۱۱۰٪ قابل قبول است.',
  variables: [
    {
      id: 'c_spiked',
      symbol: 'C_{\\text{spiked}}',
      nameFa: 'غلظت اندازه‌گیری‌شده در نمونه اسپایک‌شده (Spiked Sample Concentration)',
      nameEn: 'Measured Spiked Sample Concentration',
      descriptionFa: 'نتیجه آزمون نمونه پس از افزودن مقدار معین استاندارد',
      category: 'concentration',
      defaultUnit: 'ppm',
      allowedUnits: ['ppm', 'ppb', 'mg_l', 'g_l', 'percent'],
      min: 0,
      required: true,
      defaultValue: 9.8
    },
    {
      id: 'c_unspiked',
      symbol: 'C_{\\text{unspiked}}',
      nameFa: 'غلظت آنالیت در نمونه پایه و اصلی (Unspiked Sample Concentration)',
      nameEn: 'Unspiked Base Sample Concentration',
      descriptionFa: 'نتیجه آزمون نمونه طبیعی قبل از افزودن استاندارد (اگر صفر باشد نمونه شاهد است)',
      category: 'concentration',
      defaultUnit: 'ppm',
      allowedUnits: ['ppm', 'ppb', 'mg_l', 'g_l', 'percent'],
      min: 0,
      defaultValue: 1.2,
      required: true
    },
    {
      id: 'c_added',
      symbol: 'C_{\\text{added}}',
      nameFa: 'مقدار غلظت افزوده شده استاندارد (Nominal Added / Fortified Concentration)',
      nameEn: 'True Added Spike Concentration',
      descriptionFa: 'غلظت تئوری استاندارد خالصی که عمداً به نمونه اضافه شده',
      category: 'concentration',
      defaultUnit: 'ppm',
      allowedUnits: ['ppm', 'ppb', 'mg_l', 'g_l', 'percent'],
      min: 0.000001,
      required: true,
      defaultValue: 9.0
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { c_spiked, c_unspiked, c_added } = inputs;

    if (c_spiked === undefined || c_unspiked === undefined || c_added === undefined) {
      errors.push('تمامی پارامترهای غلظت اسپایک، غلظت پایه و غلظت افزوده الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (c_added <= 0) {
      errors.push('غلظت افزوده شده استاندارد باید مقداری مثبت باشد.');
    }

    if (c_spiked < c_unspiked) {
      warnings.push('هشدار اعتبارسنجی: غلظت اسپایک‌شده از غلظت نمونه اولیه کمتر است (بازیابی منفی یا تداخل شدید ماتریس).');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { c_spiked, c_unspiked, c_added } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = SPIKE_RECOVERY_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: '%',
        decimals,
        standardReference: SPIKE_RECOVERY_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const netFound = c_spiked! - c_unspiked!;
    const recoveryPercent = (netFound / c_added!) * 100;

    let qcStatusFa = 'مطلوب و در محدوده استاندارد (Acceptable)';
    if (recoveryPercent < 80) {
      qcStatusFa = 'کمتر از حد مجاز (Low Recovery / خطای منفی)';
      warnings.push(`درصد بازیابی (${recoveryPercent.toFixed(1)}%) کمتر از حد استاندارد ۸۰٪ است؛ بررسی تداخل ماتریس و اتلاف استخراج ضروری است.`);
    } else if (recoveryPercent > 120) {
      qcStatusFa = 'بیشتر از حد مجاز (High Recovery / خطای مثبت)';
      warnings.push(`درصد بازیابی (${recoveryPercent.toFixed(1)}%) بیش از ۱۲۰٪ است؛ آلودگی یا افزایش سیگنال بررسی شود.`);
    }

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه مقدار خالص آنالیت بازیافت‌شده',
      expression: 'C_{\\text{found}} = C_{\\text{spiked}} - C_{\\text{unspiked}}',
      substitutedExpression: `${c_spiked} - ${c_unspiked}`,
      intermediateValue: netFound.toFixed(4),
      unit: 'ppm',
      noteFa: 'افزایش واقعی غلظت ناشی از اسپایک'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه درصد بازیابی استاندارد (% Recovery)',
      expression: '\\% \\text{Recovery} = \\frac{C_{\\text{found}}}{C_{\\text{added}}} \\times 100',
      substitutedExpression: `(${netFound.toFixed(4)} / ${c_added}) \\times 100`,
      intermediateValue: recoveryPercent.toFixed(4),
      unit: '%',
      noteFa: `وضعیت کنترل کیفیت: ${qcStatusFa}`
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'گرد کردن نهایی',
      expression: `\\text{Round}(\\% \\text{Recovery}, ${decimals})`,
      substitutedExpression: `Round(${recoveryPercent.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(recoveryPercent, decimals),
      unit: '%',
      noteFa: `نتیجه با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: recoveryPercent,
      formattedValue: formatScientificNumber(recoveryPercent, decimals),
      unit: '%',
      decimals,
      standardReference: SPIKE_RECOVERY_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        recoveryPercent,
        netFound,
        qcStatus: qcStatusFa
      }
    };
  }
};

// -------------------------------------------------------------
// 13. MASS BALANCE & EVAPORATIVE CONCENTRATION (تغلیظ و تراز جرم)
// -------------------------------------------------------------
export const MASS_BALANCE_CONCENTRATION_FORMULA: FormulaDefinition = {
  id: 'mass_balance_concentration',
  nameFa: 'تغلیظ، تبخیر و تراز جرم مواد جامد (Evaporation & Mass Balance)',
  nameEn: 'Evaporation, Concentration & Solids Mass Balance',
  category: 'process_engineering',
  standardReference: 'اصول مهندسی صنایع غذایی (Singh & Heldman, Introduction to Food Engineering) / Fellows',
  standardReferenceDocId: 'FOOD-ENG-MASSBAL',
  expressionLatex: 'M_1 \\times S_1 = M_2 \\times S_2 \\implies M_2 = M_1 \\times \\frac{S_1}{S_2}, \\quad W_{\\text{water evaporated}} = M_1 - M_2',
  expressionDisplay: 'جرم ورودی × درصد ماده خشک ورودی = جرم کنسانتره × درصد ماده خشک کنسانتره',
  outputUnit: 'kg',
  defaultDecimals: 2,
  scientificNotesFa: 'قانون بقای جرم ماده خشک (Solids Conservation) در فرآیندهای تبخیر، اواپراتور تحت خلاء، و تولید رب، شیر غلیظ شده و آبمیوه کنسانتره.',
  variables: [
    {
      id: 'm1_feed',
      symbol: 'M_1',
      nameFa: 'جرم یا دبی خوراک اولیه ورودی (kg)',
      nameEn: 'Initial Feed Mass / Flow Rate (kg)',
      descriptionFa: 'جرم ماده اولیه رقیق ورودی به دستگاه تغلیظ‌کننده',
      category: 'mass',
      defaultUnit: 'kg',
      allowedUnits: ['kg', 'ton', 'g'],
      min: 0.001,
      required: true,
      defaultValue: 1000.0
    },
    {
      id: 's1_feed',
      symbol: 'S_1',
      nameFa: 'درصد ماده خشک یا بریکس خوراک ورودی (% یا °Brix)',
      nameEn: 'Initial Solids / Brix (% or °Brix)',
      descriptionFa: 'بریکس یا ماده خشک مایع رقیق (مثلاً گوجه‌فرنگی ۵٪)',
      category: 'percent',
      defaultUnit: 'percent',
      allowedUnits: ['percent', 'unitless'],
      min: 0.1,
      max: 90,
      required: true,
      defaultValue: 5.0
    },
    {
      id: 's2_target',
      symbol: 'S_2',
      nameFa: 'درصد ماده خشک یا بریکس نهایی کنسانتره (% یا °Brix)',
      nameEn: 'Target Final Solids / Brix (% or °Brix)',
      descriptionFa: 'بریکس مطلوب محصول تغلیظ‌شده (مثلاً رب گوجه ۲۸٪)',
      category: 'percent',
      defaultUnit: 'percent',
      allowedUnits: ['percent', 'unitless'],
      min: 0.1,
      max: 95,
      required: true,
      defaultValue: 28.0
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { m1_feed, s1_feed, s2_target } = inputs;

    if (m1_feed === undefined || s1_feed === undefined || s2_target === undefined) {
      errors.push('تمامی پارامترهای جرم ورودی، بریکس اولیه و بریکس هدف الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m1_feed <= 0 || s1_feed <= 0 || s2_target <= 0) {
      errors.push('مقادیر باید مثبت باشند.');
    }

    if (s1_feed >= s2_target) {
      errors.push('خطای فرآیند تغلیظ: بریکس هدف نهایی (S₂) باید از بریکس اولیه (S₁) بیشتر باشد (در غیر این صورت رقیق‌سازی است).');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { m1_feed, s1_feed, s2_target } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = MASS_BALANCE_CONCENTRATION_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: 'kg',
        decimals,
        standardReference: MASS_BALANCE_CONCENTRATION_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const totalSolidsKg = m1_feed! * (s1_feed! / 100);
    const m2Concentrate = (m1_feed! * s1_feed!) / s2_target!;
    const waterEvaporated = m1_feed! - m2Concentrate;
    const concentrationRatio = s2_target! / s1_feed!;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه جرم خالص ماده خشک ورودی (تراز ماده خشک ثابت)',
      expression: 'M_{\\text{solids}} = M_1 \\times \\left(\\frac{S_1}{100}\\right)',
      substitutedExpression: `${m1_feed} \\times (${s1_feed} / 100)`,
      intermediateValue: totalSolidsKg.toFixed(2),
      unit: 'kg solids',
      noteFa: 'جرم ماده خشک بدون تغییر در فرآیند تبخیر'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه جرم نهایی محصول کنسانتره (M₂)',
      expression: 'M_2 = \\frac{M_1 \\times S_1}{S_2}',
      substitutedExpression: `(${m1_feed} \\times ${s1_feed}) / ${s2_target}`,
      intermediateValue: m2Concentrate.toFixed(2),
      unit: 'kg',
      noteFa: `نسبت تغلیظ (Concentration Factor): ${concentrationRatio.toFixed(2)}X`
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه جرم آب تبخیر شده در اواپراتور',
      expression: 'W_{\\text{evaporated}} = M_1 - M_2',
      substitutedExpression: `${m1_feed} - ${m2Concentrate.toFixed(2)}`,
      intermediateValue: waterEvaporated.toFixed(2),
      unit: 'kg water',
      noteFa: 'میزان بخار آب خروجی از سیستم'
    });

    trace.push({
      stepNumber: 4,
      titleFa: 'گرد کردن نهایی',
      expression: `\\text{Round}(M_2, ${decimals})`,
      substitutedExpression: `Round(${m2Concentrate.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(m2Concentrate, decimals),
      unit: 'kg',
      noteFa: `نتیجه نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: m2Concentrate,
      formattedValue: formatScientificNumber(m2Concentrate, decimals),
      unit: 'kg',
      decimals,
      standardReference: MASS_BALANCE_CONCENTRATION_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        concentrateMassKg: m2Concentrate,
        waterEvaporatedKg: waterEvaporated,
        concentrationRatio,
        totalSolidsKg
      }
    };
  }
};

// -------------------------------------------------------------
// DEFAULT EXPORTS FOR REGISTRY
// -------------------------------------------------------------
export const DEFAULT_FOOD_FORMULAS: Record<string, FormulaDefinition> = {
  moisture_oven: MOISTURE_FORMULA,
  dry_matter_calc: DRY_MATTER_FORMULA,
  ash_furnace: ASH_FORMULA,
  protein_kjeldahl: PROTEIN_KJELDAHL_FORMULA,
  fat_soxhlet: FAT_SOXHLET_FORMULA,
  crude_fiber_weende: CRUDE_FIBER_FORMULA,
  carbohydrate_by_difference: CARBOHYDRATE_DIFFERENCE_FORMULA,
  titratable_acidity: ACIDITY_FORMULA,
  salt_mohr: SALT_MOHR_FORMULA,
  brix_temperature_correction: BRIX_CORRECTION_FORMULA,
  process_yield: YIELD_FORMULA,
  spike_recovery: SPIKE_RECOVERY_FORMULA,
  mass_balance_concentration: MASS_BALANCE_CONCENTRATION_FORMULA
};
