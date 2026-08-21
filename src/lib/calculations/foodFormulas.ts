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
  nameFa: 'درصد رطوبت و ماده خشک (روش آون)',
  nameEn: 'Moisture & Dry Matter Content (Oven Drying)',
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
      required: true
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
      required: true
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
      required: true
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
    const errors: string[] = [];

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
      noteFa: `ماده خشک حاصل: ${dryMatterPercent.toFixed(decimals)}%`
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
// 2. ASH CONTENT (% Ash / درصد خاکستر کل)
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
      required: true
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
      required: true
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
      required: true
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
      errors.push('خطای بحرانی: جرم بعد از کوره (M₂) از بوته خالی (M₀) کمتر است (کاهش غیرممکن وزن بوته)!');
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
// 3. CRUDE PROTEIN (% Protein - Kjeldahl / درصد پروتئین خام)
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
      nameEn: 'Titrant Volume for Sample',
      descriptionFa: 'میلی‌لیتر اسید سولفوریک یا کلریدریک مصرف شده برای نمونه',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml'],
      min: 0,
      required: true
    },
    {
      id: 'vb',
      symbol: 'V_b',
      nameFa: 'حجم اسید مصرفی برای تیتر شاهد (V_blank)',
      nameEn: 'Titrant Volume for Blank',
      descriptionFa: 'میلی‌لیتر اسید مصرف شده در آزمون شاهد بدون نمونه',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml'],
      min: 0,
      defaultValue: 0.1,
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
      required: true
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

    if (m_sample <= 0) {
      errors.push('جرم نمونه باید مقداری مثبت و بزرگتر از صفر باشد.');
    }

    if (n_acid <= 0) {
      errors.push('نرمالیته اسید باید مقداری مثبت باشد.');
    }

    if (vs < vb) {
      warnings.push('هشدار غیرعادی: حجم مصرفی نمونه (Vs) کمتر از حجم شاهد (Vb) است! این وضعیت منجر به نتیجه منفی نیتروژن می‌شود و نشان‌دهنده خطای آزمایشگاهی است.');
    }

    if (vs - vb > 50) {
      warnings.push('حجم اسید مصرفی بیش از ۵۰ میلی‌لیتر است؛ برای دقت بالاتر توصیه می‌شود از بورت با ظرفیت مناسب یا رقت دقیق‌تر استفاده شود.');
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
    const nitrogenEquiv = 0.014007; // Grams of N neutralized by 1 meq of acid
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
      noteFa: 'اکی‌والان نیتروژن = ۰.۰۱۴۰۰۷ گرم در هر میلی‌اکی‌والان'
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
// 4. FAT CONTENT (% Fat - Soxhlet / درصد چربی سوکسله)
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
      required: true
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
      required: true
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
      required: true
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

    const fatWeight = m2 - m1;
    const fatPct = (fatWeight / m_sample) * 100;

    if (fatPct > 100) {
      errors.push(`خطای غیرممکن فیزیکی: درصد چربی به دست آمده (${fatPct.toFixed(2)}%) بیشتر از ۱۰۰٪ است! لطفا وزن‌های ثبت‌شده را بررسی کنید.`);
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
// 5. DILUTION & CONCENTRATION (رقت و غلظت C1V1 = C2V2)
// -------------------------------------------------------------
export const DILUTION_FORMULA: FormulaDefinition = {
  id: 'dilution_c1v1',
  nameFa: 'معادله رقت و غلظت محلول‌ها (C₁V₁ = C₂V₂)',
  nameEn: 'Solution Dilution & Concentration (C₁V₁ = C₂V₂)',
  category: 'solutions_dilution',
  standardReference: 'اصول شیمی تجزیه و محاسبات آزمایشگاهی (Skoog & West Analytical Chem)',
  expressionLatex: 'C_1 V_1 = C_2 V_2 \\implies V_1 = \\frac{C_2 V_2}{C_1} \\quad \\text{یا} \\quad C_2 = \\frac{C_1 V_1}{V_2}',
  expressionDisplay: 'غلظت اولیه × حجم اولیه = غلظت نهایی × حجم نهایی',
  outputUnit: 'ml',
  defaultDecimals: 2,
  scientificNotesFa: 'قانون بقای جرم در رقت: تعداد مول یا جرم ماده حل‌شونده در فرآیند رقیق‌سازی ثابت می‌ماند.',
  variables: [
    {
      id: 'c1',
      symbol: 'C₁',
      nameFa: 'غلظت محلول اولیه / غلیظ (مادر)',
      nameEn: 'Stock Solution Concentration',
      descriptionFa: 'غلظت استوک (مثلاً M، N، % یا mg/L)',
      category: 'concentration',
      defaultUnit: 'mol_l',
      allowedUnits: ['mol_l', 'normality', 'g_l', 'mg_l', 'pct_w_v', 'ppm'],
      min: 0.000001,
      required: true
    },
    {
      id: 'c2',
      symbol: 'C₂',
      nameFa: 'غلظت مطلوب محلول نهایی (رقیق)',
      nameEn: 'Target Final Concentration',
      descriptionFa: 'غلظت مورد نیاز محلول رقیق شده',
      category: 'concentration',
      defaultUnit: 'mol_l',
      allowedUnits: ['mol_l', 'normality', 'g_l', 'mg_l', 'pct_w_v', 'ppm'],
      min: 0.000001,
      required: true
    },
    {
      id: 'v2',
      symbol: 'V₂',
      nameFa: 'حجم نهایی محلول رقیق مورد نیاز',
      nameEn: 'Total Final Volume',
      descriptionFa: 'حجم بالن ژوژه یا ظرف مقصد برای تهیه محلول',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml', 'l', 'ul'],
      min: 0.001,
      required: true
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { c1, c2, v2 } = inputs;

    if (c1 === undefined || c2 === undefined || v2 === undefined) {
      errors.push('برای محاسبه حجم برداشت (V₁)، مقادیر C₁، C₂ و V₂ الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (c1 <= 0 || c2 <= 0 || v2 <= 0) {
      errors.push('تمامی مقادیر غلظت و حجم باید اعدادی مثبت و بزرگتر از صفر باشند.');
    }

    if (c2 > c1) {
      warnings.push('هشدار رقیق‌سازی: غلظت مقصد (C₂) از غلظت محلول اولیه (C₁) بیشتر است! این نشان‌دهنده غلیظ‌سازی است نه رقیق‌سازی.');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { c1, c2, v2 } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = DILUTION_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: 'mL',
        decimals,
        standardReference: DILUTION_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const v1 = (c2! * v2!) / c1!;
    const solventVolume = Math.max(0, v2! - v1);
    const dilutionFactor = c1! / c2!;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه ضریب رقت (Dilution Factor - DF)',
      expression: 'DF = \\frac{C_1}{C_2} = \\frac{V_2}{V_1}',
      substitutedExpression: `${c1} / ${c2}`,
      intermediateValue: dilutionFactor.toFixed(2),
      unit: 'X',
      noteFa: `محلول باید به نسبت ۱ به ${dilutionFactor.toFixed(2)} رقیق گردد.`
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه حجم محلول اولیه مورد نیاز برای برداشت (V₁)',
      expression: 'V_1 = \\frac{C_2 \\times V_2}{C_1}',
      substitutedExpression: `(${c2} \\times ${v2}) / ${c1}`,
      intermediateValue: v1.toFixed(4),
      unit: 'mL',
      noteFa: `برداشت ${v1.toFixed(decimals)} میلی‌لیتر از محلول با غلظت ${c1}`
    });

    trace.push({
      stepNumber: 3,
      titleFa: 'محاسبه حجم حلال افزوده (آب مقطر)',
      expression: 'V_{solvent} = V_2 - V_1',
      substitutedExpression: `${v2} - ${v1.toFixed(4)}`,
      intermediateValue: solventVolume.toFixed(4),
      unit: 'mL',
      noteFa: `افزودن حلال تا رسیدن به خط نشان بالن ${v2} میلی‌لیتری`
    });

    return {
      success: true,
      value: v1,
      formattedValue: formatScientificNumber(v1, decimals),
      unit: 'mL',
      decimals,
      standardReference: DILUTION_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        v1VolumeMl: v1,
        solventVolumeMl: solventVolume,
        dilutionFactor: dilutionFactor
      }
    };
  }
};

// -------------------------------------------------------------
// 6. TITRATABLE ACIDITY (% Acidity / درصد اسیدیته قابل تیتر)
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
      required: true
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
      required: true
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
    // Dornic degree for dairy (1 °D = 0.01% Lactic acid = 0.1 mL NaOH 0.1N in 10 mL milk)
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
// 7. PEROXIDE VALUE (POV / عدد پراکسید روغن)
// -------------------------------------------------------------
export const PEROXIDE_VALUE_FORMULA: FormulaDefinition = {
  id: 'peroxide_value',
  nameFa: 'عدد پراکسید روغن و چربی (روش تیتر با تیوسولفات سدیم)',
  nameEn: 'Peroxide Value (POV - Meq O₂ / kg)',
  category: 'titration_chemistry',
  standardReference: 'استاندارد ملی ایران ۴۱۷۹ / AOAC 965.33 / ISO 3960',
  standardReferenceDocId: 'INSO-4179',
  expressionLatex: '\\text{POV} = \\frac{(V_s - V_b) \\times N_{\\text{thio}} \\times 1000}{M_{\\text{fat}}}',
  expressionDisplay: 'عدد پراکسید = ((حجم تیوسولفات نمونه - حجم تیوسولفات شاهد) × نرمالیته تیوسولفات × ۱۰۰۰) / وزن چربی',
  outputUnit: 'meq O₂/kg',
  defaultDecimals: 2,
  scientificNotesFa: 'پراکسیدهای موجود در روغن پتاسیم یدید را به ید آزاد اکسید می‌کنند. ید آزاد شده با تیوسولفات سدیم در حضور نشاسته تیتر می‌شود.',
  variables: [
    {
      id: 'vs',
      symbol: 'V_s',
      nameFa: 'حجم تیوسولفات مصرفی نمونه (میلی‌لیتر)',
      nameEn: 'Titrant Volume for Sample (mL)',
      descriptionFa: 'میلی‌لیتر سدیم تیوسولفات 0.01N یا 0.002N مصرف شده برای نمونه',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml'],
      min: 0,
      required: true
    },
    {
      id: 'vb',
      symbol: 'V_b',
      nameFa: 'حجم تیوسولفات مصرفی شاهد (میلی‌لیتر)',
      nameEn: 'Titrant Volume for Blank (mL)',
      descriptionFa: 'حجم مصرفی در آزمون شاهد بدون روغن',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml'],
      min: 0,
      defaultValue: 0.05,
      required: true
    },
    {
      id: 'n_thio',
      symbol: 'N_{thio}',
      nameFa: 'نرمالیته محلول تیوسولفات سدیم (Na₂S₂O₃)',
      nameEn: 'Normality of Na₂S₂O₃ Solution',
      descriptionFa: 'نرمالیته استاندارد تیوسولفات (معمولاً 0.01 N یا 0.002 N)',
      category: 'concentration',
      defaultUnit: 'normality',
      allowedUnits: ['normality'],
      min: 0.0001,
      defaultValue: 0.01,
      required: true
    },
    {
      id: 'm_fat',
      symbol: 'M_{fat}',
      nameFa: 'جرم روغن یا چربی وزن شده (گرم)',
      nameEn: 'Sample Fat Mass (g)',
      descriptionFa: 'وزن روغن برداشته شده در ارلن درب‌دار (حدود ۵ گرم)',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g'],
      min: 0.01,
      required: true
    }
  ],
  validateInputs: (inputs) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { vs, vb, n_thio, m_fat } = inputs;

    if (vs === undefined || vb === undefined || n_thio === undefined || m_fat === undefined) {
      errors.push('تمامی مقادیر Vs, Vb, N_thio و M_fat برای محاسبه عدد پراکسید الزامی هستند.');
      return { valid: false, errors, warnings };
    }

    if (m_fat <= 0 || n_thio <= 0) {
      errors.push('جرم روغن و نرمالیته تیوسولفات باید مقادیر مثبت باشند.');
    }

    if (vs < vb) {
      warnings.push('حجم تیوسولفات نمونه کمتر از شاهد است؛ نتیجه عدد پراکسید صفر گزارش می‌شود.');
    }

    return { valid: errors.length === 0, errors, warnings };
  },
  execute: (inputs, options = {}) => {
    const decimals = options.decimals ?? 2;
    const { vs, vb, n_thio, m_fat } = inputs;
    const trace: CalculationTraceStep[] = [];
    const warnings: string[] = [];

    const validation = PEROXIDE_VALUE_FORMULA.validateInputs(inputs);
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        success: false,
        value: null,
        formattedValue: '-',
        unit: 'meq O₂/kg',
        decimals,
        standardReference: PEROXIDE_VALUE_FORMULA.standardReference,
        isScientificallyValid: false,
        trace: [],
        warnings,
        errors: validation.errors,
        evaluatedAt: new Date().toISOString()
      };
    }

    const netVolume = Math.max(0, vs! - vb!);
    const pov = (netVolume * n_thio! * 1000) / m_fat!;

    trace.push({
      stepNumber: 1,
      titleFa: 'محاسبه حجم خالص تیوسولفات واکنش داده با ید آزاد',
      expression: 'V_{net} = V_s - V_b',
      substitutedExpression: `${vs} - ${vb}`,
      intermediateValue: netVolume.toFixed(3),
      unit: 'mL',
      noteFa: 'حجم کسر شده شاهد'
    });

    trace.push({
      stepNumber: 2,
      titleFa: 'محاسبه عدد پراکسید بر حسب میلی‌اکی‌والان اکسیژن بر کیلوگرم',
      expression: '\\text{POV} = \\frac{V_{net} \\times N_{thio} \\times 1000}{M_{fat}}',
      substitutedExpression: `(${netVolume.toFixed(3)} \\times ${n_thio} \\times 1000) / ${m_fat}`,
      intermediateValue: pov.toFixed(4),
      unit: 'meq O₂/kg',
      noteFa: pov > 10 
        ? 'هشدار: عدد پراکسید بالاتر از ۱۰ نشان‌دهنده فساد اکسیداتیو پیشرفته و نامطلوب است.'
        : 'عدد پراکسید در محدوده نرمال کیفی است.'
    });

    if (pov > 10) {
      warnings.push(`عدد پراکسید محاسبه‌شده (${pov.toFixed(2)} meq/kg) از حد استاندارد روغن‌های خوراکی تازه (حداکثر ۱۰-۵) فراتر رفته است.`);
    }

    trace.push({
      stepNumber: 3,
      titleFa: 'گرد کردن نهایی بر اساس اعشار گزارش‌دهی',
      expression: `\\text{Round}(\\text{POV}, ${decimals})`,
      substitutedExpression: `Round(${pov.toFixed(4)}, ${decimals})`,
      intermediateValue: formatScientificNumber(pov, decimals),
      unit: 'meq O₂/kg',
      noteFa: `گزارش نهایی با ${decimals} رقم اعشار`
    });

    return {
      success: true,
      value: pov,
      formattedValue: formatScientificNumber(pov, decimals),
      unit: 'meq O₂/kg',
      decimals,
      standardReference: PEROXIDE_VALUE_FORMULA.standardReference,
      isScientificallyValid: true,
      trace,
      warnings,
      errors: [],
      evaluatedAt: new Date().toISOString(),
      metadata: {
        povValue: pov,
        netVolumeMl: netVolume
      }
    };
  }
};

// -------------------------------------------------------------
// 8. SALT CONTENT BY MOHR TITRATION (% NaCl / درصد نمک)
// -------------------------------------------------------------
export const SALT_MOHR_FORMULA: FormulaDefinition = {
  id: 'salt_mohr',
  nameFa: 'درصد کلرید سدیم / نمک طعام (روش تیتراسیون موهر با نیترات نقره)',
  nameEn: 'Sodium Chloride (Salt) Content (Mohr Titration Method)',
  category: 'titration_chemistry',
  standardReference: 'استاندارد ملی ایران ۱۸۰۷ و ۲۶۸۵ / AOAC 960.29 / ISO 1841-1',
  standardReferenceDocId: 'INSO-1807',
  expressionLatex: '\\% \\text{NaCl} = \\frac{(V_s - V_b) \\times N_{\\text{AgNO}_3} \\times 0.05844 \\times 100}{M_{\\text{sample}}}',
  expressionDisplay: 'درصد نمک = (((حجم نیترات نقره نمونه - حجم شاهد) × نرمالیته نیترات نقره × ۰.۰۵۸۴۴ × ۱۰۰) / وزن نمونه)',
  outputUnit: '%',
  defaultDecimals: 2,
  scientificNotesFa: 'یون‌های کلرید با نیترات نقره استاندارد در حضور شناساگر کرومات پتاسیم تا تشکیل رسوب قهوه‌ای آجری کرومات نقره تیتر می‌شوند.',
  variables: [
    {
      id: 'vs',
      symbol: 'V_s',
      nameFa: 'حجم نیترات نقره مصرفی برای نمونه (میلی‌لیتر)',
      nameEn: 'AgNO₃ Volume for Sample (mL)',
      descriptionFa: 'میلی‌لیتر محلول AgNO₃ استاندارد مصرف شده در تیتراسیون',
      category: 'volume',
      defaultUnit: 'ml',
      allowedUnits: ['ml'],
      min: 0,
      required: true
    },
    {
      id: 'vb',
      symbol: 'V_b',
      nameFa: 'حجم نیترات نقره مصرفی برای شاهد (میلی‌لیتر)',
      nameEn: 'AgNO₃ Volume for Blank (mL)',
      descriptionFa: 'حجم مصرفی برای آزمون شاهد بدون کلرید',
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
      nameFa: 'نرمالیته محلول نیترات نقره',
      nameEn: 'Normality of AgNO₃ Solution',
      descriptionFa: 'نرمالیته استاندارد (معمولاً 0.1N)',
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
      nameFa: 'جرم نمونه آزمایشی برداشته شده (گرم)',
      nameEn: 'Sample Mass (g)',
      descriptionFa: 'جرم عصاره یا نمونه اولیه ماده غذایی (پنیر، دوغ، ترشی و ...)',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g'],
      min: 0.001,
      required: true
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

export const DEFAULT_FOOD_FORMULAS: Record<string, FormulaDefinition> = {
  moisture_oven: MOISTURE_FORMULA,
  ash_furnace: ASH_FORMULA,
  protein_kjeldahl: PROTEIN_KJELDAHL_FORMULA,
  fat_soxhlet: FAT_SOXHLET_FORMULA,
  dilution_c1v1: DILUTION_FORMULA,
  titratable_acidity: ACIDITY_FORMULA,
  peroxide_value: PEROXIDE_VALUE_FORMULA,
  salt_mohr: SALT_MOHR_FORMULA
};
