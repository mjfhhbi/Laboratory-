/**
 * Food Science AI - Standard Declarative Calculators Configuration
 * 
 * Strict Scientific Truth:
 * All formulas are derived strictly from recognized standard references:
 * - INSO (Institute of Standards and Industrial Research of Iran)
 * - AOAC International (Official Methods of Analysis)
 * - ISO (International Organization for Standardization)
 * - Codex Alimentarius (FAO/WHO Food Standards)
 * - IUPAC (International Union of Pure and Applied Chemistry)
 * - ICUMSA (International Commission for Uniform Methods of Sugar Analysis)
 * - AOCS (American Oil Chemists' Society)
 */

export interface FormulaConfigVariable {
  id: string;
  symbol: string;
  nameFa: string;
  nameEn: string;
  descriptionFa: string;
  category: 'mass' | 'volume' | 'temperature' | 'concentration' | 'pressure' | 'time' | 'percent' | 'dimensionless';
  defaultUnit: string;
  allowedUnits: string[];
  min?: number;
  max?: number;
  step?: number;
  required: boolean;
  defaultValue?: number;
  options?: { label: string; value: number; description?: string }[];
}

export interface FormulaConfigMetadata {
  id: string;
  nameFa: string;
  nameEn: string;
  category: 
    | 'proximate_analysis' 
    | 'titration_chemistry' 
    | 'solutions_dilution' 
    | 'physical_chemical' 
    | 'process_engineering'
    | 'statistical';
  standardReference: string;
  standardReferenceDocId?: string;
  expressionLatex: string;
  expressionDisplay: string;
  outputUnit: string;
  defaultDecimals: number;
  scientificNotesFa: string;
  principlesFa?: string;
  limitationsFa?: string;
  variables: FormulaConfigVariable[];
}

export const FOOD_CALCULATORS_CONFIG: Record<string, FormulaConfigMetadata> = {
  // -------------------------------------------------------------
  // 1. PERCENTAGE (w/w) - درصد وزنی
  // -------------------------------------------------------------
  pct_weight_ww: {
    id: 'pct_weight_ww',
    nameFa: 'درصد وزنی/وزنی (% w/w)',
    nameEn: 'Weight Percentage (% w/w)',
    category: 'solutions_dilution',
    standardReference: 'IUPAC Gold Book / AOAC Appendix / USP General Chapter <1151>',
    standardReferenceDocId: 'IUPAC-WW',
    expressionLatex: '\\% (w/w) = \\frac{m_{\\text{solute}}}{m_{\\text{total}}} \\times 100',
    expressionDisplay: 'درصد وزنی = (جرم حل‌شونده / جرم کل محلول یا مخلوط) × ۱۰۰',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'بیانگر گرم ماده حل‌شونده در ۱۰۰ گرم محلول نهایی است. این واحد مستقل از دما بوده و چگالی بر آن تاثیری ندارد.',
    principlesFa: 'در صنایع غذایی برای فرمولاسیون شربت‌ها، نمک‌سود کردن، امولسیون‌ها و درصد چربی/قند در ماده خشک استفاده می‌شود.',
    variables: [
      {
        id: 'm_solute',
        symbol: 'm_{\\text{solute}}',
        nameFa: 'جرم جزء حل‌شونده / ماده موثره (گرم)',
        nameEn: 'Mass of Solute / Analyte (g)',
        descriptionFa: 'جرم ماده خالص اضافه شده یا اندازه‌گیری شده',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg', 'kg', 'ug', 'lb', 'oz'],
        min: 0.0001,
        defaultValue: 5.0,
        required: true
      },
      {
        id: 'm_total',
        symbol: 'm_{\\text{total}}',
        nameFa: 'جرم کل محلول یا نمونه نهایی (گرم)',
        nameEn: 'Total Mass of Solution / Sample (g)',
        descriptionFa: 'مجموع جرم حل‌شونده و حلال یا جرم کل نمونه ارسالی',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg', 'kg', 'ug', 'lb', 'oz'],
        min: 0.0001,
        defaultValue: 100.0,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 2. PERCENTAGE (v/v) - درصد حجمی
  // -------------------------------------------------------------
  pct_volume_vv: {
    id: 'pct_volume_vv',
    nameFa: 'درصد حجمی/حجمی (% v/v)',
    nameEn: 'Volume Percentage (% v/v - ABV)',
    category: 'solutions_dilution',
    standardReference: 'AOAC 920.57 / OIML R22 / ISO 488',
    standardReferenceDocId: 'AOAC-920.57',
    expressionLatex: '\\% (v/v) = \\frac{V_{\\text{solute}}}{V_{\\text{total}}} \\times 100',
    expressionDisplay: 'درصد حجمی = (حجم جزء مایع / حجم کل محلول) × ۱۰۰',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'بیانگر میلی‌لیتر جزء حل‌شده در ۱۰۰ میلی‌لیتر محلول است (نظیر الکل سنجی، درصد اسانس در عصاره‌ها و محلول‌های هیدروالکلی). به دلیل انقباض حجمی (Volume Contraction) در دمای ۲۰ درجه سانتی‌گراد تثبیت حجم الزامی است.',
    variables: [
      {
        id: 'v_solute',
        symbol: 'V_{\\text{solute}}',
        nameFa: 'حجم جزء حل‌شونده (میلی‌لیتر)',
        nameEn: 'Volume of Solute (mL)',
        descriptionFa: 'حجم مایع خالص حل‌شونده قبل از اختلاط',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml', 'l', 'ul', 'floz'],
        min: 0.001,
        defaultValue: 70.0,
        required: true
      },
      {
        id: 'v_total',
        symbol: 'V_{\\text{total}}',
        nameFa: 'حجم نهایی محلول به حجم رسیده (میلی‌لیتر)',
        nameEn: 'Total Final Volume of Solution (mL)',
        descriptionFa: 'حجم کل محلول در بالن ژوژه',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml', 'l', 'ul', 'floz'],
        min: 0.001,
        defaultValue: 100.0,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 3. PERCENTAGE (w/v) - درصد وزنی/حجمی
  // -------------------------------------------------------------
  pct_weight_volume_wv: {
    id: 'pct_weight_volume_wv',
    nameFa: 'درصد وزنی/حجمی (% w/v)',
    nameEn: 'Weight/Volume Percentage (% w/v)',
    category: 'solutions_dilution',
    standardReference: 'USP 43-NF 38 / British Pharmacopoeia / AOAC Standard Solutions',
    standardReferenceDocId: 'USP-WV',
    expressionLatex: '\\% (w/v) = \\frac{m_{\\text{solute}} (\\text{g})}{V_{\\text{total}} (\\text{mL})} \\times 100',
    expressionDisplay: 'درصد وزنی/حجمی = (جرم حل‌شونده بر حسب گرم / حجم محلول بر حسب میلی‌لیتر) × ۱۰۰',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'بیانگر گرم حل‌شونده در ۱۰۰ میلی‌لیتر محلول است. در تهیه معرف‌های تیتراسیون (فنل‌فتالئین ۱٪، معرف چسب نشاسته ۱٪ و کلرید باریم ۱۰٪) استانداردترین واحد است.',
    variables: [
      {
        id: 'm_solute',
        symbol: 'm_{\\text{solute}}',
        nameFa: 'جرم حل‌شونده (گرم)',
        nameEn: 'Mass of Solute (g)',
        descriptionFa: 'توزین ماده شیمیایی جامد',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg', 'kg'],
        min: 0.0001,
        defaultValue: 1.0,
        required: true
      },
      {
        id: 'v_total',
        symbol: 'V_{\\text{total}}',
        nameFa: 'حجم کل محلول (میلی‌لیتر)',
        nameEn: 'Total Volume of Solution (mL)',
        descriptionFa: 'حجم نهایی در بالن ژوژه پس از انحلال کامل',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml', 'l', 'ul'],
        min: 0.1,
        defaultValue: 100.0,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 4. MOLARITY (M) - غلظت مولار
  // -------------------------------------------------------------
  molarity_sol: {
    id: 'molarity_sol',
    nameFa: 'غلظت مولار (Molarity - M)',
    nameEn: 'Molarity Calculation (mol/L)',
    category: 'solutions_dilution',
    standardReference: 'IUPAC Compendium of Chemical Terminology / AOAC Appendix A',
    standardReferenceDocId: 'IUPAC-MOLAR',
    expressionLatex: 'M = \\frac{m \\times \\frac{\\text{Assay}}{100}}{MW \\times V_{\\text{L}}} = \\frac{m \\times \\text{Assay} \\times 10}{MW \\times V_{\\text{mL}}}',
    expressionDisplay: 'مولاریته = (جرم خالص حل‌شونده / جرم مولی) / حجم محلول به لیتر',
    outputUnit: 'M',
    defaultDecimals: 4,
    scientificNotesFa: 'مولاریته تعداد مول ماده حل‌شونده در یک لیتر محلول است. در این ماشین حساب خلوص ماده (Assay %) مستقیماً در محاسبات اعمال می‌شود.',
    variables: [
      {
        id: 'm_substance',
        symbol: 'm',
        nameFa: 'جرم توزین شده ماده (گرم)',
        nameEn: 'Mass of Substance Weighed (g)',
        descriptionFa: 'وزن ماده شیمیایی جامد برداشته شده',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg', 'kg'],
        min: 0.0001,
        defaultValue: 5.844,
        required: true
      },
      {
        id: 'mw',
        symbol: 'MW',
        nameFa: 'جرم مولی ماده (g/mol)',
        nameEn: 'Molecular Weight (g/mol)',
        descriptionFa: 'جرم مولکولی استاندارد از جدول تناوبی (مثلاً NaCl = 58.44، NaOH = 40.00)',
        category: 'dimensionless',
        defaultUnit: 'unitless',
        allowedUnits: ['unitless'],
        min: 1.0,
        defaultValue: 58.44,
        required: true
      },
      {
        id: 'v_solution',
        symbol: 'V',
        nameFa: 'حجم نهایی محلول (میلی‌لیتر)',
        nameEn: 'Final Solution Volume (mL)',
        descriptionFa: 'حجم نهایی به حجم رسانده شده در بالن ژوژه',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml', 'l'],
        min: 0.1,
        defaultValue: 1000.0,
        required: true
      },
      {
        id: 'assay',
        symbol: '\\text{Assay}\\%',
        nameFa: 'درصد خلوص ماده (Assay %)',
        nameEn: 'Purity Assay (%)',
        descriptionFa: 'درصد خلوص درج شده روی برچسب قوطی ماده شیمیایی',
        category: 'percent',
        defaultUnit: 'percent',
        allowedUnits: ['percent'],
        min: 0.1,
        max: 100.0,
        defaultValue: 100.0,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 5. NORMALITY (N) - غلظت نرمال
  // -------------------------------------------------------------
  normality_sol: {
    id: 'normality_sol',
    nameFa: 'غلظت نرمال (Normality - N)',
    nameEn: 'Normality Calculation (eq/L)',
    category: 'solutions_dilution',
    standardReference: 'AOAC Official Methods / ASTM E200 Standard Practice for Preparation, Standardization, and Storage of Standard and Reagent Solutions for Chemical Analysis',
    standardReferenceDocId: 'ASTM-E200',
    expressionLatex: 'N = \\frac{m \\times \\frac{\\text{Assay}}{100}}{\\text{Eq.W} \\times V_{\\text{L}}} = M \\times n',
    expressionDisplay: 'نرمالیته = (جرم خالص / وزن هم‌ارز اکی‌والان) / حجم به لیتر = مولاریته × ظرفیت واکنش',
    outputUnit: 'N',
    defaultDecimals: 4,
    scientificNotesFa: 'نرمالیته تعداد اکی‌والان گرم ماده در یک لیتر محلول است. ظرفیت واکنش (n) برای اسیدها تعداد H+ قابل تعویض، برای بازها تعداد OH- و برای اکسیداسیون/احیا تعداد الکترون‌های مبادله شده است.',
    variables: [
      {
        id: 'm_substance',
        symbol: 'm',
        nameFa: 'جرم توزین شده ماده (گرم)',
        nameEn: 'Mass of Substance (g)',
        descriptionFa: 'جرم ماده اولیه توزین شده',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg', 'kg'],
        min: 0.0001,
        defaultValue: 4.00,
        required: true
      },
      {
        id: 'mw',
        symbol: 'MW',
        nameFa: 'جرم مولی ماده (g/mol)',
        nameEn: 'Molecular Weight (g/mol)',
        descriptionFa: 'جرم فرمولی ماده (مثلاً H₂SO₄ = 98.08، H₂C₂O₄·2H₂O = 126.07)',
        category: 'dimensionless',
        defaultUnit: 'unitless',
        allowedUnits: ['unitless'],
        min: 1.0,
        defaultValue: 40.00,
        required: true
      },
      {
        id: 'valence',
        symbol: 'n',
        nameFa: 'ظرفیت واکنش / تعداد اکی‌والان در هر مول (n)',
        nameEn: 'Valence / Equivalence Factor (n)',
        descriptionFa: 'تعداد پروتون، هیدروکسید یا الکترون مبادله شده (NaOH = 1, H₂SO₄ = 2, KMnO₄ در محیط اسیدی = 5)',
        category: 'dimensionless',
        defaultUnit: 'unitless',
        allowedUnits: ['unitless'],
        min: 1,
        max: 8,
        defaultValue: 1,
        options: [
          { label: 'n = 1 (NaOH, HCl, KOH, AgNO₃, HNO₃)', value: 1 },
          { label: 'n = 2 (H₂SO₄, H₂C₂O₄ اسید اگزالیک, Na₂CO₃, Ca(OH)₂)', value: 2 },
          { label: 'n = 3 (H₃PO₄ اسید فسفریک, C₆H₈O₇ اسید سیتریک)', value: 3 },
          { label: 'n = 5 (KMnO₄ پرمنگنات پتاسیم در محیط اسیدی)', value: 5 },
          { label: 'n = 6 (K₂Cr₂O₇ دی‌کرومات پتاسیم)', value: 6 }
        ],
        required: true
      },
      {
        id: 'v_solution',
        symbol: 'V',
        nameFa: 'حجم محلول (میلی‌لیتر)',
        nameEn: 'Solution Volume (mL)',
        descriptionFa: 'حجم نهایی محلول در بالن ژوژه',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml', 'l'],
        min: 0.1,
        defaultValue: 1000.0,
        required: true
      },
      {
        id: 'assay',
        symbol: '\\text{Assay}\\%',
        nameFa: 'درصد خلوص (Assay %)',
        nameEn: 'Purity Assay (%)',
        descriptionFa: 'خلوص درج شده روی بسته‌بندی ماده',
        category: 'percent',
        defaultUnit: 'percent',
        allowedUnits: ['percent'],
        min: 0.1,
        max: 100.0,
        defaultValue: 100.0,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 6. PPM - غلظت قسمت در میلیون
  // -------------------------------------------------------------
  ppm_conc: {
    id: 'ppm_conc',
    nameFa: 'غلظت بر حسب قسمت در میلیون (ppm)',
    nameEn: 'Parts per Million (ppm - mg/kg or mg/L)',
    category: 'solutions_dilution',
    standardReference: 'EPA Method 200.7 / AOAC 999.10 / ISO 11885',
    standardReferenceDocId: 'EPA-200.7',
    expressionLatex: '\\text{ppm} = \\frac{m_{\\text{analyte}} (\\text{mg})}{M_{\\text{sample}} (\\text{kg})} = \\frac{m_{\\text{analyte}} (\\text{mg})}{V_{\\text{solution}} (\\text{L})}',
    expressionDisplay: 'ppm = مقدار آنالیت به میلی‌گرم / جرم نمونه به کیلوگرم (یا حجم محلول به لیتر)',
    outputUnit: 'ppm',
    defaultDecimals: 3,
    scientificNotesFa: '۱ ppm معادل ۱ میلی‌گرم در کیلوگرم (جامدات غذایی) یا ۱ میلی‌گرم در لیتر (محلول‌های آبی رقیق) است. برای تعیین باقیمانده سموم، فلزات سنگین، نگه‌دارنده‌ها (بنزوات، سوربات، نیتریت) و افزودنی‌ها به کار می‌رود.',
    variables: [
      {
        id: 'm_analyte_mg',
        symbol: 'm_{\\text{analyte}}',
        nameFa: 'جرم جزء آنالیت (میلی‌گرم)',
        nameEn: 'Mass of Analyte (mg)',
        descriptionFa: 'مقدار میلی‌گرم ماده اندازه‌گیری شده یا افزوده شده',
        category: 'mass',
        defaultUnit: 'mg',
        allowedUnits: ['mg', 'ug', 'g'],
        min: 0.000001,
        defaultValue: 2.5,
        required: true
      },
      {
        id: 'sample_mass_kg',
        symbol: 'M_{\\text{sample}}',
        nameFa: 'جرم یا حجم کل نمونه (کیلوگرم یا لیتر)',
        nameEn: 'Total Sample Mass / Volume (kg or L)',
        descriptionFa: 'وزن کل نمونه خوراکی برداشته شده بر حسب کیلوگرم',
        category: 'mass',
        defaultUnit: 'kg',
        allowedUnits: ['kg', 'g', 'mg'],
        min: 0.0001,
        defaultValue: 1.0,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 7. PPB - غلظت قسمت در میلیارد
  // -------------------------------------------------------------
  ppb_conc: {
    id: 'ppb_conc',
    nameFa: 'غلظت بر حسب قسمت در میلیارد (ppb)',
    nameEn: 'Parts per Billion (ppb - µg/kg or µg/L)',
    category: 'solutions_dilution',
    standardReference: 'AOAC 999.11 / ISO 17294-2 (ICP-MS) / INSO 5925 (مایکوتوکسین‌ها)',
    standardReferenceDocId: 'AOAC-999.11',
    expressionLatex: '\\text{ppb} = \\frac{m_{\\text{analyte}} (\\mu\\text{g})}{M_{\\text{sample}} (\\text{kg})} = \\text{ppm} \\times 1000',
    expressionDisplay: 'ppb = مقدار آنالیت به میکروگرم / جرم نمونه به کیلوگرم',
    outputUnit: 'ppb',
    defaultDecimals: 2,
    scientificNotesFa: '۱ ppb معادل ۱ میکروگرم در کیلوگرم است. این واحد برای آلاینده‌های بسیار سمّی مواد غذایی نظیر آفلاتوکسین B1، اکراتوکسین A، پاتولین، سرب، کادمیوم و جیوه استفاده می‌شود.',
    variables: [
      {
        id: 'm_analyte_ug',
        symbol: 'm_{\\text{analyte}}',
        nameFa: 'جرم آنالیت (میکروگرم)',
        nameEn: 'Mass of Analyte (µg)',
        descriptionFa: 'مقدار میکروگرم سم یا فلز سنگین تشخیص داده شده با HPLC یا ICP',
        category: 'mass',
        defaultUnit: 'ug',
        allowedUnits: ['ug', 'mg', 'g'],
        min: 0.00001,
        defaultValue: 5.0,
        required: true
      },
      {
        id: 'sample_mass_kg',
        symbol: 'M_{\\text{sample}}',
        nameFa: 'جرم نمونه ماده غذایی (کیلوگرم)',
        nameEn: 'Sample Mass (kg)',
        descriptionFa: 'جرم کل نمونه بر حسب کیلوگرم (مثلاً برای پسته، آرد یا شیر خشک)',
        category: 'mass',
        defaultUnit: 'kg',
        allowedUnits: ['kg', 'g'],
        min: 0.0001,
        defaultValue: 1.0,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 8. DILUTION - رقیق‌سازی محلول‌ها (C1V1 = C2V2)
  // -------------------------------------------------------------
  dilution_c1v1: {
    id: 'dilution_c1v1',
    nameFa: 'فرمول جامع رقیق‌سازی (C₁V₁ = C₂V₂)',
    nameEn: 'Universal Dilution & Dilution Factor',
    category: 'solutions_dilution',
    standardReference: 'ISO 6887-1 / AOAC General Laboratory Procedures',
    standardReferenceDocId: 'ISO-6887',
    expressionLatex: 'C_1 V_1 = C_2 V_2 \\quad \\Longrightarrow \\quad V_1 = \\frac{C_2 V_2}{C_1}, \\quad DF = \\frac{V_2}{V_1}',
    expressionDisplay: 'غلظت اولیه × حجم اولیه = غلظت ثانویه × حجم ثانویه (فاکتور رقت = حجم ثانویه / حجم اولیه)',
    outputUnit: 'mL',
    defaultDecimals: 3,
    scientificNotesFa: 'قانون بقای جرم در رقیق‌سازی محلول‌های آزمایشگاهی. حجم حلال (آب مقطر) مورد نیاز برای اضافه کردن برابر با V2 - V1 است.',
    variables: [
      {
        id: 'c1',
        symbol: 'C_1',
        nameFa: 'غلظت محلول غلیظ اولیه (Stock Concentration)',
        nameEn: 'Initial Stock Concentration (C₁)',
        descriptionFa: 'غلظت استوک غلیظ موجود در آزمایشگاه',
        category: 'concentration',
        defaultUnit: 'mol_l',
        allowedUnits: ['mol_l', 'normality', 'pct_w_v', 'pct_w_w', 'pct_v_v', 'ppm', 'g_l'],
        min: 0.00001,
        defaultValue: 1.0,
        required: true
      },
      {
        id: 'c2',
        symbol: 'C_2',
        nameFa: 'غلظت محلول رقیق مطلوب (Target Concentration)',
        nameEn: 'Target Desired Concentration (C₂)',
        descriptionFa: 'غلظت نهایی مورد نیاز برای آزمون',
        category: 'concentration',
        defaultUnit: 'mol_l',
        allowedUnits: ['mol_l', 'normality', 'pct_w_v', 'pct_w_w', 'pct_v_v', 'ppm', 'g_l'],
        min: 0.00001,
        defaultValue: 0.05,
        required: true
      },
      {
        id: 'v2',
        symbol: 'V_2',
        nameFa: 'حجم نهایی محلول رقیق مورد نیاز (میلی‌لیتر)',
        nameEn: 'Target Final Volume (V₂ - mL)',
        descriptionFa: 'حجم بالن ژوژه مقصد',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml', 'l', 'ul'],
        min: 0.1,
        defaultValue: 250.0,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 9. MOISTURE - رطوبت
  // -------------------------------------------------------------
  moisture_oven: {
    id: 'moisture_oven',
    nameFa: 'درصد رطوبت بر پایه تر (روش آون الکتریکی)',
    nameEn: 'Moisture Content (Oven Drying Method)',
    category: 'proximate_analysis',
    standardReference: 'استاندارد ملی ایران ۲۴۰۶ و ۵۶۲۴ / AOAC 925.10 / ISO 712',
    standardReferenceDocId: 'INSO-2406',
    expressionLatex: '\\% \\text{Moisture} = \\frac{M_1 - M_2}{M_1 - M_0} \\times 100',
    expressionDisplay: 'درصد رطوبت = ((وزن قبل از آون - وزن بعد از آون) / (وزن قبل از آون - وزن ظرف خالی)) × ۱۰۰',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'نمونه در دمای ۱۰۵-۱۰۲ درجه سلسیوس در آون تا رسیدن به وزن ثابت خشک می‌شود. اختلاف وزن قبل و بعد حرارت‌دهی معرف میزان رطوبت است.',
    variables: [
      {
        id: 'm0',
        symbol: 'M_0',
        nameFa: 'جرم ظرف خالی خشک‌شده (تار - گرم)',
        nameEn: 'Tare Mass of Empty Dried Dish (M₀ - g)',
        descriptionFa: 'جرم پلیت پودقه شیشه‌ای یا فلزی خالی',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 20.1542,
        required: true
      },
      {
        id: 'm1',
        symbol: 'M_1',
        nameFa: 'جرم ظرف + نمونه قبل از آون (گرم)',
        nameEn: 'Mass of Dish + Sample Before Drying (M₁ - g)',
        descriptionFa: 'جرم ظرف همراه با نمونه مرطوب وزن شده',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 25.1542,
        required: true
      },
      {
        id: 'm2',
        symbol: 'M_2',
        nameFa: 'جرم ظرف + نمونه بعد از آون (گرم)',
        nameEn: 'Mass of Dish + Sample After Drying (M₂ - g)',
        descriptionFa: 'جرم ظرف و نمونه خشک شده پس از خنک شدن در دسیکاتور',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 24.4042,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 10. DRY MATTER & TOTAL SOLIDS - ماده خشک و کل جامدات
  // -------------------------------------------------------------
  dry_matter_solids: {
    id: 'dry_matter_solids',
    nameFa: 'ماده خشک و کل جامدات (% Dry Matter / Total Solids)',
    nameEn: 'Dry Matter & Total Solids Content (% DM / TS)',
    category: 'proximate_analysis',
    standardReference: 'استاندارد ملی ایران ۶۳۷ و ۵۶۲۴ / AOAC 990.20 / ISO 6731 (IDF 21)',
    standardReferenceDocId: 'INSO-5624',
    expressionLatex: '\\% \\text{Dry Matter} = \\frac{M_2 - M_0}{M_1 - M_0} \\times 100 = 100 - \\% \\text{Moisture}',
    expressionDisplay: 'درصد ماده خشک = ((وزن ظرف و نمونه خشک - وزن ظرف خالی) / جرم نمونه اولیه) × ۱۰۰ = ۱۰۰ - درصد رطوبت',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'ماده خشک باقیمانده تمام ترکیبات مغذی و معدنی غذا پس از تبخیر کامل آب است. شاخص کیفیت شیر، کنسانتره میوه، رب گوجه و انواع فرآورده‌های غذایی.',
    variables: [
      {
        id: 'm0',
        symbol: 'M_0',
        nameFa: 'جرم ظرف خالی تثبیت‌شده (تار - گرم)',
        nameEn: 'Empty Dish Tare Mass (g)',
        descriptionFa: 'وزن ظرف خالی خشک',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 22.0150,
        required: true
      },
      {
        id: 'm1',
        symbol: 'M_1',
        nameFa: 'جرم ظرف + نمونه مرطوب اولیه (گرم)',
        nameEn: 'Dish + Initial Wet Sample Mass (g)',
        descriptionFa: 'وزن ظرف حاوی نمونه قبل از خشک‌کردن',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 27.0150,
        required: true
      },
      {
        id: 'm2',
        symbol: 'M_2',
        nameFa: 'جرم ظرف + ماده خشک باقیمانده (گرم)',
        nameEn: 'Dish + Dried Residue Mass (g)',
        descriptionFa: 'وزن تثبیت شده نهایی پس از آون و دسیکاتور',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 22.6150,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 11. ASH - خاکستر کل و خاکستر نامحلول در اسید
  // -------------------------------------------------------------
  ash_furnace: {
    id: 'ash_furnace',
    nameFa: 'درصد خاکستر کل (روش کوره ۵۵۰ درجه)',
    nameEn: 'Total Ash Content (Muffle Furnace 550°C)',
    category: 'proximate_analysis',
    standardReference: 'استاندارد ملی ایران ۵۶۲۶ و ۲۶۸۵ / AOAC 923.03 / ISO 2171',
    standardReferenceDocId: 'INSO-5626',
    expressionLatex: '\\% \\text{Ash} = \\frac{M_2 - M_0}{M_1 - M_0} \\times 100',
    expressionDisplay: 'درصد خاکستر = ((وزن بوته بعد از کوره - وزن بوته خالی) / (وزن بوته قبل از کوره - وزن بوته خالی)) × ۱۰۰',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'نمونه در بوته چینی در کوره الکتریکی ۵۵۰ درجه سانتی‌گراد تا اکسیداسیون کامل کلیه مواد آلی و برجا ماندن خاکستر معدنی سفید یا خاکستری سوزانده می‌شود.',
    variables: [
      {
        id: 'm0',
        symbol: 'M_0',
        nameFa: 'جرم بوته خالی تثبیت‌شده (گرم)',
        nameEn: 'Tare Mass of Empty Crucible (g)',
        descriptionFa: 'وزن بوته پودقه پس از کوره اولیه و دسیکاتور',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 18.5021,
        required: true
      },
      {
        id: 'm1',
        symbol: 'M_1',
        nameFa: 'جرم بوته + نمونه قبل از سوزاندن (گرم)',
        nameEn: 'Crucible + Sample Mass (g)',
        descriptionFa: 'وزن بوته حاوی نمونه آزمایشی',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 23.5021,
        required: true
      },
      {
        id: 'm2',
        symbol: 'M_2',
        nameFa: 'جرم بوته + خاکستر بعد از کوره (گرم)',
        nameEn: 'Crucible + Ash After Muffle (g)',
        descriptionFa: 'وزن بوته و خاکستر نهایی پس از سرد شدن در دسیکاتور',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 18.5771,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 12. PROTEIN - پروتئین خام به روش کلدال
  // -------------------------------------------------------------
  protein_kjeldahl: {
    id: 'protein_kjeldahl',
    nameFa: 'پروتئین خام به روش کلدال (Kjeldahl Crude Protein)',
    nameEn: 'Crude Protein Content (Kjeldahl Method)',
    category: 'proximate_analysis',
    standardReference: 'استاندارد ملی ایران ۶۳۹ و ۲۸۳۶ / AOAC 991.20 / ISO 8968-1 (IDF 20-1)',
    standardReferenceDocId: 'INSO-639',
    expressionLatex: '\\% N = \\frac{(V_s - V_b) \\times N_{\\text{acid}} \\times 1.4007}{M_{\\text{sample}}}, \\quad \\% \\text{Protein} = \\% N \\times F',
    expressionDisplay: 'درصد ازت = ((حجم اسید نمونه - حجم اسید شاهد) × نرمالیته اسید × ۱.۴۰۰۷) / وزن نمونه ، درصد پروتئین = درصد ازت × ضریب کلدال',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'روش استاندارد شامل ۳ مرحله هضم با اسید سولفوریک و کاتالیزور، تقطیر آمونیاک آزاد شده به داخل اسید بوریک و تیتراسیون با اسید کلریدریک استاندارد است.',
    variables: [
      {
        id: 'vs',
        symbol: 'V_s',
        nameFa: 'حجم اسید کلریدریک/سولفوریک مصرفی برای نمونه (میلی‌لیتر)',
        nameEn: 'Acid Titrant Volume for Sample (mL)',
        descriptionFa: 'حجم اسید استاندارد مصرف شده در تیتراسیون نمونه',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml'],
        min: 0.0,
        defaultValue: 16.4,
        required: true
      },
      {
        id: 'vb',
        symbol: 'V_b',
        nameFa: 'حجم اسید مصرفی برای آزمون شاهد Blank (میلی‌لیتر)',
        nameEn: 'Acid Titrant Volume for Blank (mL)',
        descriptionFa: 'حجم مصرفی برای آزمون بلانک بدون نمونه',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml'],
        min: 0.0,
        defaultValue: 0.15,
        required: true
      },
      {
        id: 'n_acid',
        symbol: 'N_{\\text{acid}}',
        nameFa: 'نرمالیته دقیق اسید استاندارد (N)',
        nameEn: 'Normality of Standard Acid (N)',
        descriptionFa: 'نرمالیته دقیق اسید کلریدریک 0.1N فاکتوردار',
        category: 'concentration',
        defaultUnit: 'normality',
        allowedUnits: ['normality'],
        min: 0.001,
        defaultValue: 0.1000,
        required: true
      },
      {
        id: 'm_sample',
        symbol: 'M_{\\text{sample}}',
        nameFa: 'جرم نمونه وزن شده (گرم)',
        nameEn: 'Sample Mass Weighed (g)',
        descriptionFa: 'جرم نمونه آزمایشی در لوله یا بالن کلدال',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g'],
        min: 0.0001,
        defaultValue: 2.0000,
        required: true
      },
      {
        id: 'f_factor',
        symbol: 'F',
        nameFa: 'ضریب تبدیل ازت به پروتئین (Kjeldahl Factor)',
        nameEn: 'Nitrogen-to-Protein Conversion Factor (F)',
        descriptionFa: 'ضریب اختصاصی استاندارد ملی و بین‌المللی بر مبنای نوع ماده غذایی',
        category: 'dimensionless',
        defaultUnit: 'unitless',
        allowedUnits: ['unitless'],
        min: 1.0,
        defaultValue: 6.25,
        options: [
          { label: 'عمومی و پیش‌فرض (F = 6.25)', value: 6.25, description: 'گوشت، تخم مرغ، خوراک دام و اکثر مواد غذایی' },
          { label: 'شیر و فرآورده‌های لبنی (F = 6.38)', value: 6.38, description: 'استاندارد لبنیات INSO 639 / ISO 8968' },
          { label: 'آرد گندم و گلوتن (F = 5.70)', value: 5.70, description: 'آرد سفید، ماکارونی و نان' },
          { label: 'گندم کامل و سبوس‌دار (F = 5.83)', value: 5.83, description: 'دانه گندم کامل' },
          { label: 'برنج و فرآورده‌های برنج (F = 5.95)', value: 5.95, description: 'برنج سفید و سبوس برنج' },
          { label: 'سویا و پروتئین گیاهی (F = 5.71)', value: 5.71, description: 'آرد سویا، کنجاله و ایزوله سویا' },
          { label: 'ژلاتین و کلاژن (F = 5.55)', value: 5.55, description: 'ژلاتین خوراکی' },
          { label: 'دانه جو و مالت (F = 5.83)', value: 5.83, description: 'جو و عصاره مالت' },
          { label: 'بادام زمینی و آجیل‌ها (F = 5.46)', value: 5.46, description: 'بادام زمینی و فندق' }
        ],
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 13. FAT - چربی کل (سوکسله و استخراج با حلال)
  // -------------------------------------------------------------
  fat_soxhlet: {
    id: 'fat_soxhlet',
    nameFa: 'درصد چربی خام (روش سوکسله / استخراج با حلال)',
    nameEn: 'Crude Fat Content (Soxhlet Extraction)',
    category: 'proximate_analysis',
    standardReference: 'استاندارد ملی ایران ۲۸۵۰ و ۵۶۲۵ / AOAC 920.39 / ISO 1443',
    standardReferenceDocId: 'INSO-2850',
    expressionLatex: '\\% \\text{Fat} = \\frac{M_2 - M_1}{M_{\\text{sample}}} \\times 100',
    expressionDisplay: 'درصد چربی = ((وزن بالن همراه چربی خشک - وزن بالن خالی) / جرم نمونه) × ۱۰۰',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'استخراج مداوم چربی با حلال غیرقطبی هگزان یا پترولیوم اتر در دستگاه سوکسله به مدت ۴ تا ۶ ساعت، تبخیر حلال و توزین چربی باقیمانده.',
    variables: [
      {
        id: 'm1',
        symbol: 'M_1',
        nameFa: 'جرم بالن خالی خشک و تثبیت شده (تار - گرم)',
        nameEn: 'Tare Mass of Empty Dried Flask (g)',
        descriptionFa: 'وزن بالن تقطیر قبل از استخراج چربی',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 98.4520,
        required: true
      },
      {
        id: 'm2',
        symbol: 'M_2',
        nameFa: 'جرم بالن + چربی استخراج شده پس از آون (گرم)',
        nameEn: 'Flask + Extracted Fat Mass After Drying (g)',
        descriptionFa: 'وزن بالن حاوی چربی پس از تبخیر حلال و خشک‌شدن در آون ۱۰۰ درجه',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 98.8020,
        required: true
      },
      {
        id: 'm_sample',
        symbol: 'M_{\\text{sample}}',
        nameFa: 'جرم نمونه خشک وزن شده (گرم)',
        nameEn: 'Dry Sample Mass Weighed (g)',
        descriptionFa: 'وزن نمونه برداشته شده در کارتوش استخراج',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g'],
        min: 0.0001,
        defaultValue: 5.0000,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 14. FIBER - فیبر خام به روش ویند (Weende Crude Fiber)
  // -------------------------------------------------------------
  fiber_weende: {
    id: 'fiber_weende',
    nameFa: 'فیبر خام به روش ویند (Weende Crude Fiber)',
    nameEn: 'Crude Fiber Content (Weende Digestion Method)',
    category: 'proximate_analysis',
    standardReference: 'استاندارد ملی ایران ۳۱۰۵ / AOAC 962.09 / ISO 6865',
    standardReferenceDocId: 'INSO-3105',
    expressionLatex: '\\% \\text{Crude Fiber} = \\frac{M_1 - M_2}{M_{\\text{sample}}} \\times 100',
    expressionDisplay: 'درصد فیبر خام = ((وزن بوته و رسوب فیبر بعد از آون - وزن بوته و خاکستر بعد از کوره) / وزن نمونه) × ۱۰۰',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'روش هضم دو مرحله‌ای: جوشاندن با اسید سولفوریک ۱.۲۵٪ (برای هضم نشاسته و قندها) و سپس جوشاندن با سود ۱.۲۵٪ (برای هضم پروتئین‌ها). رسوب باقیمانده سوزانده شده و افت وزن معرف فیبر خام آلی است.',
    variables: [
      {
        id: 'm1',
        symbol: 'M_1',
        nameFa: 'جرم بوته صافی + رسوب خشک شده بعد از آون ۱۳۰ درجه (گرم)',
        nameEn: 'Crucible + Dried Fiber Residue Mass (g)',
        descriptionFa: 'وزن بوته گوچ حاوی رسوب فیبر نامحلول خشک شده',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g'],
        min: 0.0001,
        defaultValue: 31.4250,
        required: true
      },
      {
        id: 'm2',
        symbol: 'M_2',
        nameFa: 'جرم بوته + خاکستر بعد از کوره ۵۵۰ درجه (گرم)',
        nameEn: 'Crucible + Ash After 550°C Furnace (g)',
        descriptionFa: 'وزن بوته پس از خاکستر کردن رسوب در کوره ۵۵۰ درجه',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g'],
        min: 0.0001,
        defaultValue: 31.3500,
        required: true
      },
      {
        id: 'm_sample',
        symbol: 'M_{\\text{sample}}',
        nameFa: 'جرم اولیه نمونه عاری از چربی (گرم)',
        nameEn: 'Defatted Sample Initial Mass (g)',
        descriptionFa: 'جرم نمونه توزین شده قبل از هضم',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g'],
        min: 0.0001,
        defaultValue: 2.0000,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 15. CARBOHYDRATE BY DIFFERENCE & ATWATER ENERGY
  // -------------------------------------------------------------
  carbohydrate_energy: {
    id: 'carbohydrate_energy',
    nameFa: 'کربوهیدرات تام به روش تفاضلی و انرژی کالری (Atwater Energy)',
    nameEn: 'Carbohydrate by Difference & Caloric Energy',
    category: 'proximate_analysis',
    standardReference: 'FAO Food and Nutrition Paper 77 / USDA / Codex Nutrition Guidelines (CAC/GL 2-1985)',
    standardReferenceDocId: 'FAO-FNP77',
    expressionLatex: '\\% \\text{Carb} = 100 - (\\% \\text{Moisture} + \\% \\text{Ash} + \\% \\text{Protein} + \\% \\text{Fat}), \\quad \\text{Energy (kcal)} = (4 \\times P) + (9 \\times F) + (4 \\times C)',
    expressionDisplay: 'کربوهیدرات = ۱۰۰ - (رطوبت + خاکستر + پروتئین + چربی) ، کالری = (۴ × پروتئین) + (۹ × چربی) + (۴ × کربوهیدرات)',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'روش رسمی فائو/کدکس برای محاسبه کربوهیدرات بر مبنای جدول ترکیبات و ضرایب استاندارد اتواتر (Atwater Specific Factors: 4 kcal/g برای پروتئین و قند، 9 kcal/g برای چربی، 2 kcal/g برای فیبر رژیمی).',
    variables: [
      {
        id: 'moisture',
        symbol: '\\% \\text{Moisture}',
        nameFa: 'درصد رطوبت نمونه (%)',
        nameEn: 'Moisture Percentage (%)',
        descriptionFa: 'درصد رطوبت به دست آمده از آزمون آون',
        category: 'percent',
        defaultUnit: 'percent',
        allowedUnits: ['percent'],
        min: 0.0,
        max: 100.0,
        defaultValue: 12.5,
        required: true
      },
      {
        id: 'ash',
        symbol: '\\% \\text{Ash}',
        nameFa: 'درصد خاکستر کل (%)',
        nameEn: 'Total Ash Percentage (%)',
        descriptionFa: 'درصد خاکستر حاصل از کوره ۵۵۰ درجه',
        category: 'percent',
        defaultUnit: 'percent',
        allowedUnits: ['percent'],
        min: 0.0,
        max: 100.0,
        defaultValue: 1.8,
        required: true
      },
      {
        id: 'protein',
        symbol: '\\% \\text{Protein}',
        nameFa: 'درصد پروتئین خام (%)',
        nameEn: 'Crude Protein Percentage (%)',
        descriptionFa: 'درصد پروتئین محاسبه شده از روش کلدال',
        category: 'percent',
        defaultUnit: 'percent',
        allowedUnits: ['percent'],
        min: 0.0,
        max: 100.0,
        defaultValue: 11.2,
        required: true
      },
      {
        id: 'fat',
        symbol: '\\% \\text{Fat}',
        nameFa: 'درصد چربی کل (%)',
        nameEn: 'Total Fat Percentage (%)',
        descriptionFa: 'درصد چربی استخراج شده با سوکسله',
        category: 'percent',
        defaultUnit: 'percent',
        allowedUnits: ['percent'],
        min: 0.0,
        max: 100.0,
        defaultValue: 4.5,
        required: true
      },
      {
        id: 'fiber',
        symbol: '\\% \\text{Fiber}',
        nameFa: 'درصد فیبر خام اختیاری (%)',
        nameEn: 'Optional Crude Fiber Percentage (%)',
        descriptionFa: 'در صورت تمایل به تفکیک کربوهیدرات در دسترس (Available Carbohydrates)',
        category: 'percent',
        defaultUnit: 'percent',
        allowedUnits: ['percent'],
        min: 0.0,
        max: 50.0,
        defaultValue: 0.0,
        required: false
      }
    ]
  },

  // -------------------------------------------------------------
  // 16. TITRATABLE ACIDITY - اسیدیته قابل تیتر
  // -------------------------------------------------------------
  titratable_acidity: {
    id: 'titratable_acidity',
    nameFa: 'اسیدیته قابل تیتر (Titratable Acidity)',
    nameEn: 'Titratable Acidity Calculation',
    category: 'titration_chemistry',
    standardReference: 'استاندارد ملی ایران ۲۸۵۲ و ۱۶۹۹ / AOAC 942.15 / ISO 750 / AOCS Cd 3d-63',
    standardReferenceDocId: 'INSO-2852',
    expressionLatex: '\\% \\text{Acidity} = \\frac{V_{\\text{NaOH}} \\times N_{\\text{NaOH}} \\times \\text{meq} \\times 100}{M_{\\text{sample}}}',
    expressionDisplay: 'درصد اسیدیته = (حجم سود × نرمالیته سود × میلی‌اکی‌والان اسید غالب × ۱۰۰) / جرم نمونه',
    outputUnit: '%',
    defaultDecimals: 3,
    scientificNotesFa: 'تیتراسیون اسیدهای آزاد با سود 0.1N تا نقطه پایانی فنل‌فتالئین (pH = 8.1 - 8.3). ضریب میلی‌اکی‌والان (meq) بسته به اسید غالب محصول انتخاب می‌شود.',
    variables: [
      {
        id: 'v_naoh',
        symbol: 'V_{\\text{NaOH}}',
        nameFa: 'حجم سود مصرف شده در تیتراسیون (میلی‌لیتر)',
        nameEn: 'Volume of NaOH Consumed (mL)',
        descriptionFa: 'حجم خوانده شده از روی بورت',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml'],
        min: 0.0,
        defaultValue: 4.2,
        required: true
      },
      {
        id: 'n_naoh',
        symbol: 'N_{\\text{NaOH}}',
        nameFa: 'نرمالیته دقیق محلول سود (N)',
        nameEn: 'Normality of NaOH Solution (N)',
        descriptionFa: 'نرمالیته استاندارد شده سود (معمولاً 0.1 N با فاکتور)',
        category: 'concentration',
        defaultUnit: 'normality',
        allowedUnits: ['normality'],
        min: 0.001,
        defaultValue: 0.1000,
        required: true
      },
      {
        id: 'm_sample',
        symbol: 'M_{\\text{sample}}',
        nameFa: 'جرم نمونه برداشته شده (گرم)',
        nameEn: 'Sample Mass Weighed (g)',
        descriptionFa: 'وزن دقیق نمونه آب‌میوه، شیر، سرکه، دوغ، روغن یا رب گوجه',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g', 'mg'],
        min: 0.0001,
        defaultValue: 10.00,
        required: true
      },
      {
        id: 'acid_factor',
        symbol: '\\text{meq}',
        nameFa: 'نوع اسید غالب و ضریب میلی‌اکی‌والان (meq factor)',
        nameEn: 'Dominant Acid Type & meq Factor',
        descriptionFa: 'ضریب وزنی معادل یک میلی‌اکی‌والان از اسید غالب',
        category: 'dimensionless',
        defaultUnit: 'unitless',
        allowedUnits: ['unitless'],
        min: 0.01,
        defaultValue: 0.09008,
        options: [
          { label: 'اسید لاکتیک (لبنیات، ماست، شیر، دوغ، ترشی‌ها - meq = 0.09008)', value: 0.09008, description: 'MW = 90.08, n = 1' },
          { label: 'اسید سیتریک بدون آب (مرکبات، آب‌لیمو، آب‌میوه، نوشابه، رب گوجه - meq = 0.06404)', value: 0.06404, description: 'MW = 192.12, n = 3' },
          { label: 'اسید سیتریک یک‌آبه (کنسانتره میوه - meq = 0.07005)', value: 0.07005, description: 'MW = 210.14, n = 3' },
          { label: 'اسید استیک (سرکه، سس‌ها، خردل - meq = 0.06005)', value: 0.06005, description: 'MW = 60.05, n = 1' },
          { label: 'اسید مالیک (سیب، گلابی، گوجه‌سبز، آلبالو - meq = 0.06705)', value: 0.06705, description: 'MW = 134.09, n = 2' },
          { label: 'اسید تارتاریک (انگور، آبغوره، سرکه بالزامیک - meq = 0.07505)', value: 0.07505, description: 'MW = 150.09, n = 2' },
          { label: 'اسید اولئیک (اسیدیته روغن‌ها و چربی‌های خوراکی - meq = 0.28246)', value: 0.28246, description: 'MW = 282.46, n = 1' }
        ],
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 17. pH & IONIC & HENDERSON-HASSELBALCH
  // -------------------------------------------------------------
  ph_ionic_calculations: {
    id: 'ph_ionic_calculations',
    nameFa: 'محاسبات یون هیدروژن، pH و بافر هندرسون-هاسلباخ',
    nameEn: 'pH, [H+], [OH-] & Henderson-Hasselbalch Buffer',
    category: 'physical_chemical',
    standardReference: 'IUPAC Recommendations / AOAC 981.12 (pH of Acidified Foods)',
    standardReferenceDocId: 'AOAC-981.12',
    expressionLatex: '\\text{pH} = -\\log_{10}[H^+] = pK_a + \\log_{10}\\left(\\frac{[A^-]}{[HA]}\\right), \\quad [H^+] = 10^{-\\text{pH}}',
    expressionDisplay: 'pH = منفی لگاریتم غلظت یون هیدروژن = pKa + لگاریتم (غلظت باز مزدوج / غلظت اسید ضعیف)',
    outputUnit: 'pH',
    defaultDecimals: 2,
    scientificNotesFa: 'کنترل دقیق اسیدیته و پایداری میکروبی مواد غذایی اسیدی شده (FDA 21 CFR 114: pH بحرانی ۴.۶ برای جلوگیری از رشد کلستریدیوم بوتولینوم).',
    variables: [
      {
        id: 'pka',
        symbol: 'pK_a',
        nameFa: 'ثابت تفکیک اسید (pKa)',
        nameEn: 'Acid Dissociation Constant (pKa)',
        descriptionFa: 'ثابت تفکیک اسید در دمای ۲۵ درجه سانتی‌گراد',
        category: 'dimensionless',
        defaultUnit: 'unitless',
        allowedUnits: ['unitless'],
        min: 0.0,
        max: 14.0,
        defaultValue: 4.76,
        options: [
          { label: 'اسید استیک / استات (pKa = 4.76)', value: 4.76 },
          { label: 'اسید سیتریک pKa1 (pKa = 3.13)', value: 3.13 },
          { label: 'اسید سیتریک pKa2 (pKa = 4.76)', value: 4.76 },
          { label: 'اسید سیتریک pKa3 (pKa = 6.40)', value: 6.40 },
          { label: 'اسید لاکتیک (pKa = 3.86)', value: 3.86 },
          { label: 'اسید سوربیک (pKa = 4.76)', value: 4.76 },
          { label: 'اسید بنزوئیک (pKa = 4.19)', value: 4.19 },
          { label: 'اسید فسفریک pKa2 (pKa = 7.20 - بافر فسفات)', value: 7.20 }
        ],
        required: true
      },
      {
        id: 'conc_base',
        symbol: '[A^-]',
        nameFa: 'غلظت باز مزدوج / نمک بافر (M)',
        nameEn: 'Conjugate Base Concentration [A⁻] (M)',
        descriptionFa: 'غلظت مولی استات سدیم، سیترات سدیم و ...',
        category: 'concentration',
        defaultUnit: 'mol_l',
        allowedUnits: ['mol_l', 'mmol_l'],
        min: 0.0001,
        defaultValue: 0.10,
        required: true
      },
      {
        id: 'conc_acid',
        symbol: '[HA]',
        nameFa: 'غلظت اسید ضعیف بافر (M)',
        nameEn: 'Weak Acid Concentration [HA] (M)',
        descriptionFa: 'غلظت مولی اسید آزاد حل نشده',
        category: 'concentration',
        defaultUnit: 'mol_l',
        allowedUnits: ['mol_l', 'mmol_l'],
        min: 0.0001,
        defaultValue: 0.10,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 18. SALT - درصد نمک طعام (روش مور و ولهارد)
  // -------------------------------------------------------------
  salt_mohr: {
    id: 'salt_mohr',
    nameFa: 'درصد نمک طعام (% NaCl - روش تیتراسیون مور)',
    nameEn: 'Salt Content (% NaCl - Mohr Argentometric Titration)',
    category: 'titration_chemistry',
    standardReference: 'استاندارد ملی ایران ۱۸۰۹ و ۶۸۵ / AOAC 960.29 / ISO 1738 (IDF 12)',
    standardReferenceDocId: 'INSO-1809',
    expressionLatex: '\\% \\text{NaCl} = \\frac{(V_s - V_b) \\times N_{\\text{AgNO}_3} \\times 0.05844 \\times 100}{M_{\\text{sample}}}',
    expressionDisplay: 'درصد نمک = ((حجم نیترات نقره نمونه - شاهد) × نرمالیته AgNO3 × ۰.۰۵۸۴۴ × ۱۰۰) / جرم نمونه',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'تیتراسیون رسوبی یون کلرید با نیترات نقره استاندارد 0.1N در حضور شناساگر کرومات پتاسیم تا ظهور رسوب قهوه‌ای آجری کرومات نقره.',
    variables: [
      {
        id: 'vs',
        symbol: 'V_s',
        nameFa: 'حجم نیترات نقره مصرفی برای نمونه (میلی‌لیتر)',
        nameEn: 'AgNO₃ Volume for Sample (mL)',
        descriptionFa: 'حجم AgNO₃ خوانده شده از بورت',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml'],
        min: 0.0,
        defaultValue: 8.6,
        required: true
      },
      {
        id: 'vb',
        symbol: 'V_b',
        nameFa: 'حجم نیترات نقره برای بلانک شاهد (میلی‌لیتر)',
        nameEn: 'AgNO₃ Volume for Blank (mL)',
        descriptionFa: 'حجم مصرفی برای آزمون شاهد آب مقطر',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml'],
        min: 0.0,
        defaultValue: 0.1,
        required: true
      },
      {
        id: 'n_agno3',
        symbol: 'N_{\\text{AgNO}_3}',
        nameFa: 'نرمالیته محلول نیترات نقره (N)',
        nameEn: 'Normality of AgNO₃ Solution (N)',
        descriptionFa: 'نرمالیته محلول استاندارد (معمولاً 0.1 N)',
        category: 'concentration',
        defaultUnit: 'normality',
        allowedUnits: ['normality'],
        min: 0.001,
        defaultValue: 0.1000,
        required: true
      },
      {
        id: 'm_sample',
        symbol: 'M_{\\text{sample}}',
        nameFa: 'جرم نمونه آزمایشی (گرم)',
        nameEn: 'Sample Mass Weighed (g)',
        descriptionFa: 'جرم برداشته شده از پنیر، ترشی، چیپس، کنسرو، سوسیس یا رب',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g'],
        min: 0.001,
        defaultValue: 5.00,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 19. BRIX - بریکس و تصحیح دمایی رفرکتومتری
  // -------------------------------------------------------------
  brix_refractometry: {
    id: 'brix_refractometry',
    nameFa: 'بریکس و تصحیح دمایی رفراکتومتری (Brix Temperature Correction)',
    nameEn: 'Refractometric Brix & Temperature Correction',
    category: 'physical_chemical',
    standardReference: 'ICUMSA SPS-3 (1998) / AOAC 932.12 / INSO 2682',
    standardReferenceDocId: 'ICUMSA-SPS3',
    expressionLatex: '\\text{Brix}_{20^\\circ\\text{C}} = \\text{Brix}_{\\text{obs}} + 0.00049 \\times (T - 20) \\times (\\text{Brix}_{\\text{obs}} + 15)',
    expressionDisplay: 'بریکس تصحیح شده = بریکس قرائت شده + ضریب تصحیح بر اساس دمای انحراف از ۲۰ درجه سلسیوس',
    outputUnit: '°Brix',
    defaultDecimals: 2,
    scientificNotesFa: 'بریکس درصد وزنی مواد جامد محلول (عمدتاً ساکارز) در محلول است. طبق استاندارد بین‌المللی ICUMSA دمای مرجع رفرکتومترها ۲۰ درجه سانتی‌گراد است و قرائت در دماهای دیگر نیازمند تصحیح دمایی است.',
    variables: [
      {
        id: 'brix_obs',
        symbol: '\\text{Brix}_{\\text{obs}}',
        nameFa: 'بریکس قرائت شده از چشمی رفراکتومتر (°Brix)',
        nameEn: 'Observed Refractometer Reading (°Brix)',
        descriptionFa: 'عدد بریکس خوانده شده در دمای جاری محیط',
        category: 'percent',
        defaultUnit: 'percent',
        allowedUnits: ['percent'],
        min: 0.0,
        max: 95.0,
        defaultValue: 28.0,
        required: true
      },
      {
        id: 'temperature',
        symbol: 'T',
        nameFa: 'دمای محیط / منشور رفرکتومتر (°C)',
        nameEn: 'Measurement Prism Temperature (°C)',
        descriptionFa: 'دمای اندازه‌گیری شده دماسنج رفرکتومتر',
        category: 'temperature',
        defaultUnit: 'c',
        allowedUnits: ['c', 'f'],
        min: 10.0,
        max: 40.0,
        defaultValue: 25.0,
        required: true
      },
      {
        id: 'dilution_factor',
        symbol: 'DF',
        nameFa: 'فاکتور رقت (در صورت رقیق‌سازی نمونه‌های غلیظ مثل رب یا عسل)',
        nameEn: 'Dilution Factor (if pre-diluted 1:1 or 1:2)',
        descriptionFa: 'نسبت کل مخلوط رقیق شده به وزن نمونه برداشته شده (برای نمونه رقیق نشده = ۱)',
        category: 'dimensionless',
        defaultUnit: 'unitless',
        allowedUnits: ['unitless'],
        min: 1.0,
        defaultValue: 1.0,
        required: false
      }
    ]
  },

  // -------------------------------------------------------------
  // 20. YIELD - راندمان تولید و استحصال فرآیندی
  // -------------------------------------------------------------
  process_yield: {
    id: 'process_yield',
    nameFa: 'راندمان تولید و استحصال فرآیندی (% Process Yield)',
    nameEn: 'Food Processing Recovery & Yield Percentage',
    category: 'process_engineering',
    standardReference: 'Codex Alimentarius Principles of Food Process Control / Food Engineering Unit Operations',
    standardReferenceDocId: 'CODEX-ENG-YIELD',
    expressionLatex: '\\% \\text{Yield} = \\frac{M_{\\text{product}}}{M_{\\text{raw}}} \\times 100, \\quad \\% \\text{Loss} = 100 - \\% \\text{Yield}',
    expressionDisplay: 'درصد راندمان = (جرم محصول نهایی سالم / جرم ماده خام اولیه ورودی) × ۱۰۰',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'محاسبه بازده خط تولید، درصد افت وزنی فرآیند (Process Loss) و موازنه جرم در مراحل پوست‌گیری، روغن‌کشی، عصاره‌گیری، پخت و خشک‌کردن.',
    variables: [
      {
        id: 'm_product',
        symbol: 'M_{\\text{product}}',
        nameFa: 'جرم محصول خروجی نهایی (کیلوگرم)',
        nameEn: 'Final Product Output Mass (kg)',
        descriptionFa: 'وزن کل محصول سالم و بسته‌بندی شده حاصل از خط',
        category: 'mass',
        defaultUnit: 'kg',
        allowedUnits: ['kg', 'ton', 'g', 'lb'],
        min: 0.001,
        defaultValue: 420.0,
        required: true
      },
      {
        id: 'm_raw',
        symbol: 'M_{\\text{raw}}',
        nameFa: 'جرم ماده خام اولیه ورودی (کیلوگرم)',
        nameEn: 'Raw Material Input Mass (kg)',
        descriptionFa: 'وزن کل ماده اولیه تحویل گرفته شده در ابتدای خط',
        category: 'mass',
        defaultUnit: 'kg',
        allowedUnits: ['kg', 'ton', 'g', 'lb'],
        min: 0.001,
        defaultValue: 500.0,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 21. ANALYTICAL RECOVERY - درصد بازیافت تحلیلی (Spike Recovery)
  // -------------------------------------------------------------
  analytical_recovery: {
    id: 'analytical_recovery',
    nameFa: 'درصد بازیافت تحلیلی در آزمون اسپایک (% Analytical Recovery)',
    nameEn: 'Analytical Spike Recovery Percentage',
    category: 'statistical',
    standardReference: 'AOAC Guidelines for Single Laboratory Validation of Chemical Methods / ISO/IEC 17025 / Eurachem Guide',
    standardReferenceDocId: 'AOAC-VAL-REC',
    expressionLatex: '\\% \\text{Recovery} = \\frac{C_{\\text{spiked}} - C_{\\text{unspiked}}}{C_{\\text{added}}} \\times 100',
    expressionDisplay: 'درصد بازیافت = ((غلظت نمونه اسپایک شده - غلظت نمونه پایه) / غلظت افزوده شده استاندارد) × ۱۰۰',
    outputUnit: '%',
    defaultDecimals: 2,
    scientificNotesFa: 'اصلی‌ترین آزمون صحه‌گذاری روش (Method Validation) برای سنجش درستی (Trueness) و اثر ماتریس نمونه (Matrix Effect). طبق استاندارد AOAC بازه قابل قبول در سطح ppm معمولاً ۸۰ تا ۱۱۰ درصد است.',
    variables: [
      {
        id: 'c_spiked',
        symbol: 'C_{\\text{spiked}}',
        nameFa: 'غلظت اندازه‌گیری شده نمونه اسپایک شده (ppm یا mg/kg)',
        nameEn: 'Measured Concentration in Spiked Sample',
        descriptionFa: 'نتیجه آنالیز دستگاهی نمونه پس از افزودن مقدار مشخص استاندارد',
        category: 'concentration',
        defaultUnit: 'ppm',
        allowedUnits: ['ppm', 'ppb', 'mg_l', 'ug_l', 'g_l'],
        min: 0.0,
        defaultValue: 9.6,
        required: true
      },
      {
        id: 'c_unspiked',
        symbol: 'C_{\\text{unspiked}}',
        nameFa: 'غلظت نمونه پایه بدون اسپایک (Unspiked Baseline)',
        nameEn: 'Baseline Concentration in Unspiked Sample',
        descriptionFa: 'غلظت طبیعی آنالیت در نمونه دست‌نخورده',
        category: 'concentration',
        defaultUnit: 'ppm',
        allowedUnits: ['ppm', 'ppb', 'mg_l', 'ug_l', 'g_l'],
        min: 0.0,
        defaultValue: 0.2,
        required: true
      },
      {
        id: 'c_added',
        symbol: 'C_{\\text{added}}',
        nameFa: 'غلظت استاندارد افزوده شده (Known Spike Added)',
        nameEn: 'Known Amount of Standard Analyte Added',
        descriptionFa: 'مقدار دقیق آنالیت خالص تلقیح شده به نمونه',
        category: 'concentration',
        defaultUnit: 'ppm',
        allowedUnits: ['ppm', 'ppb', 'mg_l', 'ug_l', 'g_l'],
        min: 0.00001,
        defaultValue: 10.0,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 22. PEARSON SQUARE - مربع پیرسون / استانداردسازی و تغلیظ
  // -------------------------------------------------------------
  pearson_square: {
    id: 'pearson_square',
    nameFa: 'مربع پیرسون و بالانس ماده (Pearson Square Food Standardization)',
    nameEn: 'Pearson Square & Mass Balance Blending',
    category: 'process_engineering',
    standardReference: 'IDF Bulletin 361 (Milk Standardization) / Food Processing Engineering Principles',
    standardReferenceDocId: 'IDF-361',
    expressionLatex: '\\text{Parts}_A = |C_T - C_B|, \\quad \\text{Parts}_B = |C_A - C_T|, \\quad M_A = M_{\\text{total}} \\times \\frac{\\text{Parts}_A}{\\text{Parts}_A + \\text{Parts}_B}',
    expressionDisplay: 'تطابق دو جزء A و B با غلظت‌های مختلف برای رسیدن به غلظت مطلوب C_T در بچ نهایی',
    outputUnit: 'kg',
    defaultDecimals: 2,
    scientificNotesFa: 'روش کلاسیک و مهندسی بالانس ماده برای استانداردسازی درصد چربی شیر، بریکس آب‌میوه‌ها، درصد چربی سوسیس و کالباس و تنظیم درصد الکل.',
    variables: [
      {
        id: 'c_a',
        symbol: 'C_A',
        nameFa: 'درصد جزء غلیظ‌تر A (مثلاً خامه ۴۰٪ یا کنسانتره)',
        nameEn: 'Concentration of Higher Stream A (%)',
        descriptionFa: 'درصد چربی یا بریکس ماده غنی‌تر',
        category: 'percent',
        defaultUnit: 'percent',
        allowedUnits: ['percent'],
        min: 0.0,
        max: 100.0,
        defaultValue: 40.0,
        required: true
      },
      {
        id: 'c_b',
        symbol: 'C_B',
        nameFa: 'درصد جزء رقیق‌تر B (مثلاً شیر پس‌چرخ ۰.۱٪ یا آب)',
        nameEn: 'Concentration of Lower Stream B (%)',
        descriptionFa: 'درصد چربی یا بریکس ماده رقیق‌تر',
        category: 'percent',
        defaultUnit: 'percent',
        allowedUnits: ['percent'],
        min: 0.0,
        max: 100.0,
        defaultValue: 0.1,
        required: true
      },
      {
        id: 'c_target',
        symbol: 'C_{\\text{target}}',
        nameFa: 'درصد هدف نهایی مورد نظر (مثلاً شیر ۳.۰٪)',
        nameEn: 'Target Desired Concentration (%)',
        descriptionFa: 'غلظت استاندارد نهایی که باید حاصل شود',
        category: 'percent',
        defaultUnit: 'percent',
        allowedUnits: ['percent'],
        min: 0.0,
        max: 100.0,
        defaultValue: 3.0,
        required: true
      },
      {
        id: 'm_total',
        symbol: 'M_{\\text{total}}',
        nameFa: 'جرم کل بچ نهایی مورد نیاز (کیلوگرم)',
        nameEn: 'Total Final Batch Mass Desired (kg)',
        descriptionFa: 'ظرفیت مخزن یا بچ تولیدی',
        category: 'mass',
        defaultUnit: 'kg',
        allowedUnits: ['kg', 'ton', 'g'],
        min: 0.1,
        defaultValue: 1000.0,
        required: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 23. PEROXIDE VALUE - عدد پراکسید روغن و چربی
  // -------------------------------------------------------------
  peroxide_value: {
    id: 'peroxide_value',
    nameFa: 'عدد پراکسید روغن‌ها و چربی‌ها (Peroxide Value - PV)',
    nameEn: 'Peroxide Value in Fats & Oils (meq O₂/kg)',
    category: 'titration_chemistry',
    standardReference: 'استاندارد ملی ایران ۴۱۷۹ / AOAC 965.33 / AOCS Cd 8b-90 / ISO 3960',
    standardReferenceDocId: 'INSO-4179',
    expressionLatex: '\\text{PV} = \\frac{(V_s - V_b) \\times N_{\\text{thio}} \\times 1000}{M_{\\text{fat}}}',
    expressionDisplay: 'عدد پراکسید = ((حجم تیوسولفات سدیم نمونه - شاهد) × نرمالیته تیوسولفات × ۱۰۰۰) / جرم روغن',
    outputUnit: 'meq O₂/kg',
    defaultDecimals: 2,
    scientificNotesFa: 'معیار سنجش فساد اکسیداتیو اولیه روغن‌ها بر اثر هیدروپراکسیدها. تیتراسیون ید آزاد شده با تیوسولفات سدیم 0.01N یا 0.002N در حضور معرف نشاسته.',
    variables: [
      {
        id: 'vs',
        symbol: 'V_s',
        nameFa: 'حجم تیوسولفات سدیم مصرفی برای نمونه (میلی‌لیتر)',
        nameEn: 'Thiosulfate Volume for Sample (mL)',
        descriptionFa: 'حجم مصرفی از بورت',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml'],
        min: 0.0,
        defaultValue: 2.4,
        required: true
      },
      {
        id: 'vb',
        symbol: 'V_b',
        nameFa: 'حجم تیوسولفات سدیم برای آزمون بلانک شاهد (میلی‌لیتر)',
        nameEn: 'Thiosulfate Volume for Blank (mL)',
        descriptionFa: 'حجم مصرفی برای شاهد بدون روغن',
        category: 'volume',
        defaultUnit: 'ml',
        allowedUnits: ['ml'],
        min: 0.0,
        defaultValue: 0.05,
        required: true
      },
      {
        id: 'n_thio',
        symbol: 'N_{\\text{thio}}',
        nameFa: 'نرمالیته محلول تیوسولفات سدیم (N)',
        nameEn: 'Normality of Na₂S₂O₃ Solution (N)',
        descriptionFa: 'نرمالیته تیوسولفات (معمولاً 0.01N یا 0.002N)',
        category: 'concentration',
        defaultUnit: 'normality',
        allowedUnits: ['normality'],
        min: 0.0001,
        defaultValue: 0.0100,
        required: true
      },
      {
        id: 'm_fat',
        symbol: 'M_{\\text{fat}}',
        nameFa: 'جرم روغن یا چربی وزن شده (گرم)',
        nameEn: 'Mass of Oil/Fat Weighed (g)',
        descriptionFa: 'وزن روغن در ارلن مایر درب‌دار سمباده‌ای',
        category: 'mass',
        defaultUnit: 'g',
        allowedUnits: ['g'],
        min: 0.001,
        defaultValue: 5.00,
        required: true
      }
    ]
  }
};
