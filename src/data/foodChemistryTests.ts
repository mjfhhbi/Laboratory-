import { FoodChemistryTest } from '../types/foodChemistry';

export const FOOD_CHEMISTRY_TESTS_DATABASE: FoodChemistryTest[] = [
  // 1. MOISTURE
  {
    id: 'chem-moisture-oven',
    code: 'CHEM-MST-01',
    analyteFa: 'رطوبت و ماده خشک (Moisture & Total Solids)',
    analyteEn: 'Moisture and Dry Matter by Air Oven',
    titleFa: 'تعیین رطوبت و ماده خشک به روش خشک‌کردن در آون هوای داغ (۱۰۵ درجه)',
    titleEn: 'Determination of Moisture by Air-Oven Drying Method at 105°C',
    category: 'proximate_moisture',
    sectorCompatibility: ['dairy', 'cereal', 'meat', 'bakery', 'confectionery', 'spices'],
    objectiveFa: 'اندازه‌گیری درصد رطوبت و باقیمانده ماده خشک جهت انطباق با حدود استاندارد، ارزیابی کیفیت بافت و پیش‌بینی ماندگاری ماتریکس غذایی.',
    chemicalPrincipleFa: 'تبخیر آب آزاد و بخشی از آب پیوندی نمونه تحت دمای کنترل‌شده ۱۰۵ ± ۲ درجه سلسیوس در فشار اتمسفریک تا رسیدن به وزن ثابت (Constant Weight). تفاوت وزن قبل و بعد از آون‌گذاری نشان‌دهنده مقدار رطوبت تبخیر شده است.',
    samplePreparation: {
      homogenizationProtocolFa: 'آسیاب کردن نمونه جامد در آسیاب آزمایشگاهی دربسته با اندازه ذرات کمتر از ۱ میلی‌متر، یا میکس یکنواخت نمونه‌های خمیری و مایع.',
      pretreatmentNotesFa: 'برای نمونه‌های چرب یا شیرین مایع، مخلوط کردن با ماسه سیلیسی اسیدشوی‌شده تکلیس‌شده (Acid-washed Calcined Sand) و میله شیشه‌ای جهت جلوگیری از تشکیل لایه پوسته سطحی (Crust formation).',
      sampleMassOrVolume: '۳.۰۰۰ الی ۵.۰۰۰ گرم با دقت ۰.۰۰۰۱ گرم (ترازوی ۴ رقم)',
      storageBeforeAnalysis: 'ظرف دربسته هوابندی شده بدون تماس با رطوبت محیط'
    },
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 2705',
      year: '1393',
      titleFa: 'فرآورده‌های غذایی و کشاورزی - تعیین رطوبت به روش آون',
      titleEn: 'Food and Agricultural Products - Determination of Moisture Content',
      scopeAndMatrix: 'غلات، آرد، محصولات نانوایی، شیر خشک، خوراک دام و محصولات غذایی عمومی',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'AOAC',
        standardNumber: 'AOAC 925.10',
        titleFa: 'روش رسمی AOAC برای رطوبت در آرد و غلات',
        titleEn: 'Solids (Total) and Moisture in Flour - Air Oven Method at 130°C / 105°C',
        scopeAndMatrix: 'Flour, Cereals and Bakery Products'
      },
      {
        organization: 'ISO',
        standardNumber: 'ISO 712:2009',
        titleFa: 'غلات و فرآورده‌های غلات - تعیین رطوبت (روش مرجع)',
        titleEn: 'Cereals and cereal products - Determination of moisture content',
        scopeAndMatrix: 'Grains and flours'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'mst-alt-vacuum',
        methodNameFa: 'آون تحت خلاء (Vacuum Oven Method)',
        methodNameEn: 'Vacuum Oven at 70°C (<100 mmHg)',
        principleFa: 'خشک کردن در دمای ملایم ۷۰ درجه و فشار کاهش یافته زیر ۱۰۰ میلی‌متر جیوه به منظور جلوگیری از تجزیه و کاراملیزاسیون قندها در مربا، عسل، شربت و میوه خشک.',
        applicableMatrixes: ['عسل', 'مرباجات', 'میوه‌های خشک', 'شکلات', 'کنسانتره آبمیوه'],
        standardReferences: [{ organization: 'AOAC', standardNumber: 'AOAC 934.06', titleFa: 'رطوبت در میوه‌های خشک', titleEn: 'Moisture in Dried Fruits', scopeAndMatrix: 'Sugar rich products' }],
        advantagesFa: ['جلوگیری از واکنش‌های قهوه‌ای‌شدن ناشی از حرارت بالا', 'دقت فوق‌العاده برای محصولات قندی'],
        limitationsFa: ['نیاز به پمپ و گیج خلاء دقیق'],
        analysisTime: '۶ تا ۱۲ ساعت'
      },
      {
        methodId: 'mst-alt-kf',
        methodNameFa: 'تیتراسیون کولومتری / ولومتری کارل فیشر (Karl Fischer Titration)',
        methodNameEn: 'Karl Fischer Volumetric / Coulometric Titration',
        principleFa: 'واکنش استوکیومتری آب با ید و دی‌اکسید گوگرد در حضور حلال پیریدین/ایمیدازول و متانول.',
        applicableMatrixes: ['روغن‌ها و چربی‌های خوراکی', 'شکلات', 'شیرینی و شکلات کم‌رطوبت', 'پودرهای دارویی و غذایی'],
        standardReferences: [{ organization: 'ISO', standardNumber: 'ISO 8534:2016', titleFa: 'چربی‌ها و روغن‌های حیوانی و نباتی - تعیین آب به روش کارل فیشر', titleEn: 'Animal and vegetable fats and oils - Determination of water content', scopeAndMatrix: 'Fats and Oils' }],
        advantagesFa: ['اندازه‌گیری اختصاصی مولکول آب (H2O)', 'سرعت بسیار بالا (چند دقیقه)', 'حساسیت در حد ppm'],
        limitationsFa: ['هزینه بالای معرف‌های سمی کارل فیشر', 'تداخل ترکیبات آلدئیدی و کتونی'],
        analysisTime: '۳ الی ۵ دقیقه'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-sand',
        nameFa: 'ماسه سیلیسی اسیدشوی‌شده تکلیس‌شده',
        nameEn: 'Acid-Washed Calcined Silica Sand',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'شستشو با اسید کلریدریک رقیق، شستشو با آب مقطر تا خنثی شدن، و حرارت دادن در کوره ۵۵۰ درجه به مدت ۲ ساعت.',
        safetyHazardFa: 'فاقد سمیت، جلوگیری از استنشاق گرد و غبار'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-oven',
        nameFa: 'آون الکتریکی با فن سیرکولاسیون هوای گرم',
        nameEn: 'Forced Air Convection Laboratory Oven',
        specification: 'دقت دمایی ± ۱ درجه سلسیوس، دامنه کاری تا ۲۰۰ درجه',
        calibrationRequirement: 'کالیبراسیون سالانه ۹ نقطه‌ای سنسور دما',
        operatingTempOrParam: '۱۰۵ ± ۲ °C'
      },
      {
        id: 'eq-desiccator',
        nameFa: 'دسیکاتور آزمایشگاهی دارای سیلیکاژل فعال',
        nameEn: 'Glass Vacuum Desiccator with Blue Silica Gel',
        specification: 'درزبندی با وازلین یا گریس سیلیکون، سیلیکاژل آبی‌رنگ خشک',
        calibrationRequirement: 'تعویض یا احیای سیلیکاژل در صورت تغییر رنگ به صورتی'
      },
      {
        id: 'eq-balance-4d',
        nameFa: 'ترازوی آنالیتیکال ۴ رقم اعشار',
        nameEn: 'Analytical Balance (0.0001 g)',
        specification: 'دقت ۰.۱ میلی‌گرم (۰.۰۰۰۱ گرم)',
        calibrationRequirement: 'کالیبراسیون روزانه با وزنه استاندارد کلاس E2'
      },
      {
        id: 'eq-dish',
        nameFa: 'پلیت رطوبت آلومینیومی / شیشه‌ای درب‌دار',
        nameEn: 'Moisture Weighing Dish with Close-Fitting Lid',
        specification: 'قطر ۵ الی ۷ سانتی‌متر، مقاوم به حرارت ۱۰۵ درجه'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'خشک کردن و توزین ظرف خالی (توزین تا وزن ثابت)',
        instructionFa: 'ظرف رطوبت فلزی/شیشه‌ای به همراه درب باز را به مدت ۱ ساعت در آون ۱۰۵ درجه قرار دهید. درب را گذاشته، با پنس به دسیکاتور منتقل کرده و پس از ۳۰ دقیقه خنک شدن در دمای اتاق، با ترازوی ۴ رقم وزن کنید (m0).',
        criticalTimeOrTemp: '۱۰۵ درجه به مدت ۶۰ دقیقه در آون، ۳۰ دقیقه در دسیکاتور'
      },
      {
        stepNumber: 2,
        titleFa: 'توزین نمونه آزمایه',
        instructionFa: 'حدود ۳ تا ۵ گرم از نمونه همگن‌شده را بلافاصله درون ظرف ریخته و درب آن را بگذارید و وزن دقیق (m1) را ثبت کنید.',
        criticalTimeOrTemp: 'توزین سریع جهت جلوگیری از تبادل رطوبت با هوا'
      },
      {
        stepNumber: 3,
        titleFa: 'آون‌گذاری و تبخیر رطوبت',
        instructionFa: 'درب ظرف را نیمه‌باز کرده یا در زیر ظرف قرار داده و آن را به مدت حداقل ۳ الی ۴ ساعت در آون با دمای ۱۰۵ ± ۲ درجه سلسیوس قرار دهید.',
        criticalTimeOrTemp: '۱۰۵ ± ۲ °C به مدت ۴ ساعت'
      },
      {
        stepNumber: 4,
        titleFa: 'خنک‌سازی در دسیکاتور و توزین نهایی',
        instructionFa: 'درب ظرف را بسته، ظرف را با انبرک به دسیکاتور منتقل کرده و به مدت ۳۰ الی ۴۵ دقیقه تا رسیدن به دمای محیط خنک نموده و وزن کنید (m2). ظرف را ۳۰ دقیقه دیگر در آون قرار داده و تکرار کنید تا اختلاف دو توزین متوالی کمتر از ۰.۰۰۱ گرم شود.',
        criticalTimeOrTemp: 'توزین ثانویه تا اختلاف < ۰.۰۰۱ گرم'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{Moisture (\\%)} = \\frac{m_1 - m_2}{m_1 - m_0} \\times 100',
      formulaDescriptionFa: 'درصد رطوبت = ((وزن ظرف با نمونه قبل از آون - وزن ظرف با نمونه خشک شده بعد از آون) تقسیم بر (وزن ظرف با نمونه قبل از آون - وزن ظرف خالی تار شده)) ضربدر ۱۰۰',
      variables: [
        { symbol: 'm0', descriptionFa: 'وزن ظرف خالی خشک شده تا وزن ثابت (گرم)', unit: 'g', defaultValue: 25.4321 },
        { symbol: 'm1', descriptionFa: 'وزن ظرف + نمونه تر قبل از آون‌گذاری (گرم)', unit: 'g', defaultValue: 30.4321 },
        { symbol: 'm2', descriptionFa: 'وزن ظرف + نمونه خشک بعد از آون‌گذاری نهایی (گرم)', unit: 'g', defaultValue: 29.8071 }
      ],
      unitResult: '% (g/100g)',
      significantFigures: 2,
      roundingRuleFa: 'گرد کردن به دو رقم اعشار طبق استاندارد ISO 80000-1',
      acceptableRSDPercent: 1.5
    },
    qualityControl: {
      reagentBlankRequirementFa: 'آزمون شاهد خالی (Blank Dish) در هر بچ آزمون جهت اطمینان از عدم تغییر وزن ظرف.',
      certifiedReferenceMaterialCRM: 'استفاده از نمونه آرد مرجع استاندارد CRM با رطوبت گواهی‌شده ۱۳.۵ ± ۰.۲ ٪',
      expectedRecoveryRangePercent: { min: 98.0, max: 102.0 },
      repeatabilityLimit_r: 'اختلاف بین دو آزمون همزمان تکرارپذیر نباید از ۰.۱۵ گرم در ۱۰۰ گرم فراتر رود.',
      criticalControlCheckpoints: [
        'اطمینان از کارکرد صحیح سیلیکاژل دسیکاتور (عدم جذب رطوبت هوا توسط نمونه خشک شده)',
        'استفاده حتمی از انبرک پنس فلزی و عدم لمس مستقیم ظروف با دست',
        'کنترل دمای یکنواخت در تمام طبقات آون'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'افزایش غیرعادی وزن در مرحله دوم آون‌گذاری (Over-weighting)',
        probableCausesFa: ['جذب رطوبت هوا به دلیل اشباع شدن سیلیکاژل دسیکاتور', 'روغن و گریس بیش از حد روی لبه دسیکاتور', 'اکسیداسیون چربی‌های غیر اشباع در نمونه‌های روغنی'],
        investigationStepsFa: ['بررسی رنگ سیلیکاژل', 'تست با ظرف خالی شاهد'],
        correctiveAndPreventiveActionFa: 'احیای سیلیکاژل در آون ۱۸۰ درجه تا آبی شدن کامل؛ استفاده از آون خلاء برای نمونه‌های با چربی غیراشباع بالا.'
      },
      {
        symptomFa: 'سوختن و قهوه‌ای شدن تیره نمونه در آون ۱۰۵ درجه',
        probableCausesFa: ['وجود قندهای احیاکننده و انجام واکنش کاراملیزاسیون/مایلارد در دمای بالای ۱۰۰ درجه'],
        investigationStepsFa: ['بررسی میزان قند نمونه'],
        correctiveAndPreventiveActionFa: 'تغییر متد به روش آون خلاء (Vacuum Oven) در دمای ۷۰ درجه سلسیوس طبق استاندارد AOAC 934.06.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'توزین ظرف خالی و آماده‌سازی نمونه',
        descriptionFa: 'توزین ظرف رطوبت خشک شده و نمونه تر',
        instructions: [
          'ظرف رطوبت را که قبلاً تا وزن ثابت خشک شده از دسیکاتور خارج کرده و با ترازوی آنالیتیکال وزن کنید (m0).',
          'حدود ۳ الی ۵ گرم از نمونه یکنواخت‌شده را درون ظرف بریزید و وزن دقیق ظرف + نمونه را ثبت کنید (m1).'
        ],
        equipmentUsed: ['ترازوی آنالیتیکال ۴ رقم', 'پلیت رطوبت آلومینیومی', 'دسیکاتور'],
        reagentsUsed: [],
        requiresVerificationBeforeNext: true,
        verificationPromptFa: 'آیا نمونه کاملاً یکنواخت بوده و وزن اولیه سریعاً ثبت گردید؟',
        parameters: [
          { id: 'm0', nameFa: 'وزن ظرف خالی خشک شده (m0)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 5, maxValue: 100, decimalPrecision: 4 },
          { id: 'm1', nameFa: 'وزن ظرف + نمونه قبل از آون (m1)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 6, maxValue: 110, decimalPrecision: 4 }
        ]
      },
      {
        stepNumber: 2,
        titleFa: 'آون‌گذاری و ثبت وزن خشک نهایی',
        descriptionFa: 'حرارت‌دهی در آون ۱۰۵ درجه و توزین بعد از خنک شدن در دسیکاتور',
        instructions: [
          'ظرف را به مدت ۴ ساعت در آون ۱۰۵ ± ۲ درجه سلسیوس قرار دهید.',
          'ظرف را به مدت ۳۰ دقیقه در دسیکاتور قرار دهید تا به دمای محیط برسد.',
          'وزن نهایی ظرف + نمونه خشک را با ترازوی ۴ رقم ثبت کنید (m2).'
        ],
        equipmentUsed: ['آون الکتریکی ۱۰۵ درجه', 'دسیکاتور با سیلیکاژل', 'ترازوی آنالیتیکال ۴ رقم'],
        reagentsUsed: [],
        requiresVerificationBeforeNext: true,
        verificationPromptFa: 'آیا ظرف در دسیکاتور کاملاً خنک شد و ترازوی ۴ رقم پایدار بود؟',
        parameters: [
          { id: 'm2', nameFa: 'وزن ظرف + نمونه خشک بعد از آون (m2)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 5, maxValue: 105, decimalPrecision: 4 }
        ]
      }
    ]
  },

  // 2. TOTAL ASH
  {
    id: 'chem-ash-furnace',
    code: 'CHEM-ASH-01',
    analyteFa: 'خاکستر کل و مواد معدنی (Total Ash & Inorganic Residue)',
    analyteEn: 'Total Ash by Muffle Furnace at 550°C',
    titleFa: 'تعیین خاکستر کل به روش سوزاندن در کوره الکتریکی (۵۵۰ درجه)',
    titleEn: 'Determination of Total Ash in Food by Muffle Furnace at 550°C',
    category: 'proximate_ash',
    sectorCompatibility: ['cereal', 'dairy', 'meat', 'bakery', 'confectionery', 'spices', 'fruits_veg'],
    objectiveFa: 'اندازه‌گیری کل مواد معدنی و عناصر غیرآلی ماده غذایی جهت ارزیابی خلوص، تشخیص تقلبات و انطباق با استاندارد ملی.',
    chemicalPrincipleFa: 'سوزاندن و اکسیداسیون حرارتی کامل ماده آلی در کوره الکتریکی مافل با دمای ۵۵۰ ± ۱۰ درجه سلسیوس تا تبدیل تمام کربن به CO2 و باقی ماندن خاکستر سفید/خاکستری روشن عاری از ذرات سیاه کربنی.',
    samplePreparation: {
      homogenizationProtocolFa: 'آسیاب کردن نمونه با اندازه ذرات همگن.',
      pretreatmentNotesFa: 'برای نمونه‌های مایع و شیرین، پیش‌خشک کردن در حمام بن‌ماری یا هیتر حرارتی و کربونیزه کردن ملایم (Charring) با چراغ بونزن یا هیتر برقی تا قطع کامل دود قبل از انتقال به کوره مافل.',
      sampleMassOrVolume: '۲.۰۰۰ الی ۵.۰۰۰ گرم با دقت ۰.۰۰۰۱ گرم',
      storageBeforeAnalysis: 'ظرف دربسته'
    },
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 2706',
      year: '1393',
      titleFa: 'فرآورده‌های غذایی و کشاورزی - تعیین خاکستر کل',
      titleEn: 'Food and Agricultural Products - Determination of Total Ash',
      scopeAndMatrix: 'تمام فرآورده‌های غذایی، غلات، آرد، گوشت و لبنیات',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'AOAC',
        standardNumber: 'AOAC 923.03',
        titleFa: 'خاکستر آرد غلات به روش کوره ۵۵۰ درجه',
        titleEn: 'Ash of Flour - Direct Method at 550°C',
        scopeAndMatrix: 'Flour and Grain products'
      },
      {
        organization: 'ISO',
        standardNumber: 'ISO 2171:2007',
        titleFa: 'غلات، حبوبات و فرآورده‌های جانبی - تعیین خاکستر',
        titleEn: 'Cereals, pulses and by-products - Determination of ash yield',
        scopeAndMatrix: 'Cereals and pulses'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'ash-alt-insoluble',
        methodNameFa: 'خاکستر نامحلول در اسید کلریدریک (Acid-Insoluble Ash / Sand Content)',
        methodNameEn: 'Acid Insoluble Ash (Sand & Silica Impurities)',
        principleFa: 'حل کردن خاکستر کل در اسید کلریدریک رقیق ۱۰٪، جوشاندن، عبور از کاغذ صافی بدون خاکستر و سوزاندن مجدد در کوره ۵۵۰ درجه جهت تعیین میزان شن، خاک و ناخالصی‌های سیلیسی.',
        applicableMatrixes: ['ادویه‌ها و گیاهان دارویی', 'سبزیجات خشک', 'میوه خشک و خرما', 'زعفران', 'خوراک دام'],
        standardReferences: [{ organization: 'INSO', standardNumber: 'INSO 3003', titleFa: 'ادویه و چاشنی‌ها - تعیین خاکستر نامحلول در اسید', titleEn: 'Spices and condiments - Determination of acid-insoluble ash', scopeAndMatrix: 'Spices' }],
        advantagesFa: ['تشخیص مستقیم تقلب یا آلودگی خاکی در ادویه و پودرهای گیاهی'],
        limitationsFa: ['مرحله اضافی فیلتراسیون و جوشاندن با اسید سمی'],
        analysisTime: '۲ ساعت پس از خاکستر کل'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-water-purified',
        nameFa: 'آب مقطر دیونیزه درجه ۱',
        nameEn: 'Ultrapure Deionized Water',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'آب دیونیزه با هدایت کمتر از ۱ میکروزیمنس',
        safetyHazardFa: 'فاقد سمیت'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-furnace',
        nameFa: 'کوره الکتریکی آزمایشگاهی (مافل)',
        nameEn: 'Muffle Furnace with Programmable PID Controller',
        specification: 'توانایی تامین دمای ۵۵۰ ± ۱۰ درجه سلسیوس، کنترلر دمایی دقیق',
        calibrationRequirement: 'کالیبراسیون سنسور ترموکوپل تیپ K',
        operatingTempOrParam: '۵۵۰ ± ۱۰ °C'
      },
      {
        id: 'eq-crucible',
        nameFa: 'بوته چینی یا پلاتینی (Crucible)',
        nameEn: 'Porcelain / Platinum Ashing Crucible',
        specification: 'حجم ۳۰ تا ۵۰ میلی‌لیتر، مقاوم به شوک حرارتی تا ۱۰۰۰ درجه'
      },
      {
        id: 'eq-desiccator-ash',
        nameFa: 'دسیکاتور با سیلیکاژل',
        nameEn: 'Laboratory Desiccator with Silica Gel',
        specification: 'خنک کردن بدون جذب رطوبت'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'تکلیس و توزین بوته خالی تا وزن ثابت',
        instructionFa: 'بوته چینی را به مدت ۱ ساعت در کوره مافل با دمای ۵۵۰ درجه قرار دهید. پس از رسیدن دمای کوره به زیر ۲۰۰ درجه، بوته را با انبر به دسیکاتور منتقل کرده و پس از ۴۵ دقیقه وزن دقیق آن را ثبت کنید (m0).',
        criticalTimeOrTemp: '۵۵۰ درجه در کوره، ۴۵ دقیقه در دسیکاتور'
      },
      {
        stepNumber: 2,
        titleFa: 'توزین نمونه و کربونیزه کردن اولیه (دودزدایی)',
        instructionFa: 'حدود ۳ تا ۵ گرم نمونه را درون بوته ریخته و وزن کنید (m1). بوته را روی هیتر برقی یا چراغ گاز زیر هود قرار داده و به آرامی حرارت دهید تا دود و کف فروکش کرده و نمونه کاملاً بسوزد و به رنگ سیاه زغالی درآید.',
        criticalTimeOrTemp: 'حرارت ملایم روی شعله/هیتر تا قطع کامل دود'
      },
      {
        stepNumber: 3,
        titleFa: 'سوزاندن نهایی در کوره مافل',
        instructionFa: 'بوته را درون کوره مافل قرار داده و دما را روی ۵۵۰ ± ۱۰ درجه تنظیم کنید. سوزاندن را به مدت ۴ تا ۶ ساعت ادامه دهید تا خاکستر کاملاً سفید متمایل به خاکستری روشن و عاری از لکه‌های سیاه کربنی شود.',
        criticalTimeOrTemp: '۵۵۰ ± ۱۰ °C به مدت ۴ الی ۶ ساعت'
      },
      {
        stepNumber: 4,
        titleFa: 'خنک کردن و توزین خاکستر نهایی',
        instructionFa: 'پس از خنک شدن نسبی کوره، بوته را با پنس به دسیکاتور منتقل کرده و پس از ۴۵ دقیقه در ترازوی ۴ رقم وزن کنید (m2).',
        criticalTimeOrTemp: '۴۵ دقیقه در دسیکاتور'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{Total Ash (\\%)} = \\frac{m_2 - m_0}{m_1 - m_0} \\times 100',
      formulaDescriptionFa: 'درصد خاکستر کل = ((وزن بوته با خاکستر نهایی بعد از کوره - وزن بوته خالی تکلیس‌شده) تقسیم بر (وزن بوته با نمونه تر قبل از کوره - وزن بوته خالی)) ضربدر ۱۰۰',
      variables: [
        { symbol: 'm0', descriptionFa: 'وزن بوته خالی تکلیس‌شده (گرم)', unit: 'g', defaultValue: 32.1152 },
        { symbol: 'm1', descriptionFa: 'وزن بوته + نمونه اولیه قبل از کوره (گرم)', unit: 'g', defaultValue: 35.1152 },
        { symbol: 'm2', descriptionFa: 'وزن بوته + خاکستر سفید نهایی (گرم)', unit: 'g', defaultValue: 32.1602 }
      ],
      unitResult: '% (g/100g)',
      significantFigures: 2,
      roundingRuleFa: 'گرد کردن به دو رقم اعشار طبق ISO 80000-1',
      acceptableRSDPercent: 2.0
    },
    qualityControl: {
      reagentBlankRequirementFa: 'سوزاندن بوته خالی شاهد در کوره.',
      expectedRecoveryRangePercent: { min: 98.5, max: 101.5 },
      repeatabilityLimit_r: 'اختلاف بین دو نتیجه همزمان نباید بیش از ۰.۰۵ گرم در ۱۰۰ گرم باشد.',
      criticalControlCheckpoints: [
        'عدم افزایش دمای کوره به بالای ۶۰۰ درجه جهت جلوگیری از تبخیر کلریدها (NaCl و KCl)',
        'کربنیزه کردن کامل روی هیتر قبل از کوره تا مانع از پاشش ذرات به دیواره کوره شود'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'باقی ماندن ذرات سیاه کربنی در خاکستر پس از چند ساعت کوره',
        probableCausesFa: ['کربن به دام افتاده درون اکسیدهای غیرقابل نفوذ به اکسیژن'],
        investigationStepsFa: ['بررسی رنگ خاکستر'],
        correctiveAndPreventiveActionFa: 'پس از خنک شدن، چند قطره آب مقطر یا اسید نیتریک رقیق به خاکستر اضافه کرده، روی هیتر خشک نموده و مجدداً ۱ ساعت در کوره ۵۵۰ درجه قرار دهید.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'توزین بوته و نمونه تر',
        descriptionFa: 'ثبت وزن بوته خالی و نمونه اولیه',
        instructions: [
          'بوته چینی تکلیس‌شده را از دسیکاتور خارج کرده و با ترازوی ۴ رقم وزن کنید (m0).',
          'حدود ۳ تا ۵ گرم نمونه را وزن نموده و وزن بوته + نمونه را ثبت فرمایید (m1).'
        ],
        equipmentUsed: ['ترازوی آنالیتیکال ۴ رقم', 'بوته چینی'],
        reagentsUsed: [],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'm0', nameFa: 'وزن بوته خالی (m0)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 10, maxValue: 80, decimalPrecision: 4 },
          { id: 'm1', nameFa: 'وزن بوته + نمونه (m1)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 11, maxValue: 90, decimalPrecision: 4 }
        ]
      },
      {
        stepNumber: 2,
        titleFa: 'کربونیزاسیون اولیه و سوزاندن در کوره مافل',
        descriptionFa: 'سوزاندن در ۵۵۰ درجه و توزین خاکستر نهایی',
        instructions: [
          'نمونه را روی هیتر تا قطع دود کربنیزه کرده و سپس ۴ ساعت در کوره ۵۵۰ درجه قرار دهید.',
          'بوته را در دسیکاتور خنک کرده و وزن بوته + خاکستر سفید را ثبت کنید (m2).'
        ],
        equipmentUsed: ['کوره الکتریکی ۵۵۰ درجه', 'دسیکاتور', 'ترازوی ۴ رقم'],
        reagentsUsed: [],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'm2', nameFa: 'وزن بوته + خاکستر نهایی (m2)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 10, maxValue: 85, decimalPrecision: 4 }
        ]
      }
    ]
  },

  // 3. CRUDE PROTEIN (KJELDAHL)
  {
    id: 'chem-protein-kjeldahl',
    code: 'CHEM-PROT-01',
    analyteFa: 'پروتئین خام (Crude Protein / Total Nitrogen)',
    analyteEn: 'Crude Protein by Kjeldahl Nitrogen Digestion & Titration',
    titleFa: 'تعیین پروتئین خام به روش هضم، تقطیر و تیتراسیون کجلدال (Kjeldahl)',
    titleEn: 'Determination of Crude Protein by Kjeldahl Method',
    category: 'proximate_protein',
    sectorCompatibility: ['dairy', 'cereal', 'meat', 'bakery', 'confectionery'],
    objectiveFa: 'اندازه‌گیری مقدار ازت کل آلی و تبدیل آن به پروتئین خام با اعمال ضرایب اختصاصی ماتریس ماده غذایی.',
    chemicalPrincipleFa: '۱. هضم (Digestion): تبدیل ازت آلی پروتئین به سولفات آمونیوم (NH4)2SO4 با اسید سولفوریک غلیظ در حضور کاتالیزور (سولفات مس و سولفات پتاسیم) در دمای ۴۲۰ درجه. ۲. تقطیر (Distillation): قلیایی کردن با سدیم هیدروکسید و آزاد شدن گاز آمونیاک و جذب در اسید بوریک. ۳. تیتراسیون (Titration): خنثی‌سازی بورات آمونیوم با اسید کلریدریک/سولفوریک استاندارد با حضور معرف تشخیصی رنگی.',
    samplePreparation: {
      homogenizationProtocolFa: 'آسیاب همگن با عبور از الک ۰.۵ میلی‌متر.',
      sampleMassOrVolume: '۰.۵۰۰ الی ۱.۰۰۰ گرم با دقت ۰.۰۰۰۱ گرم',
      storageBeforeAnalysis: 'ظرف دربسته'
    },
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 19052',
      year: '1393',
      titleFa: 'فرآورده‌های غذایی - تعیین مقدار ازت کل به روش کجلدال',
      titleEn: 'Food Products - Determination of Total Nitrogen Content by Kjeldahl',
      scopeAndMatrix: 'انواع مواد غذایی، لبنیات، غلات، گوشت و خوراک',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'AOAC',
        standardNumber: 'AOAC 991.20',
        titleFa: 'پروتئین در شیر به روش کجلدال',
        titleEn: 'Nitrogen (Total) in Milk - Kjeldahl Methods',
        scopeAndMatrix: 'Dairy Products'
      },
      {
        organization: 'ISO',
        standardNumber: 'ISO 8968-1:2014',
        titleFa: 'شیر و فرآورده‌های شیری - تعیین مقدار نیتروژن (بخش ۱: کجلدال)',
        titleEn: 'Milk and milk products - Determination of nitrogen content',
        scopeAndMatrix: 'Milk and Dairy'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'prot-alt-dumas',
        methodNameFa: 'روش احتراق دوماس (Dumas Combustion Method)',
        methodNameEn: 'Dumas High-Temperature Combustion',
        principleFa: 'سوزاندن کامل نمونه در اکسیژن خالص در دمای ۱۰۰۰ درجه، احیای اکسیدهای نیتروژن به گاز N2 و اندازه‌گیری با دتکتور هدایت حرارتی (TCD).',
        applicableMatrixes: ['غلات', 'آرد و خوراک دام', 'شیر خشک', 'دانه‌های روغنی'],
        standardReferences: [{ organization: 'ISO', standardNumber: 'ISO 16634-1:2008', titleFa: 'تعیین ازت به روش دوماس', titleEn: 'Food products - Determination of total nitrogen by combustion', scopeAndMatrix: 'Cereals and food' }],
        advantagesFa: ['بسیار سریع (۳ تا ۴ دقیقه)', 'کاملاً خودکار و بدون نیاز به اسید سولفوریک غلیظ و خطرناک'],
        limitationsFa: ['هزینه بالای دستگاه و گاز هلیوم و اکسیژن خلوص بالا'],
        analysisTime: '۴ دقیقه'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-h2so4',
        nameFa: 'اسید سولفوریک غلیظ ۹۸٪ (H2SO4)',
        nameEn: 'Sulfuric Acid 98% (Nitrogen-free)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'خالص و بدون ازت',
        safetyHazardFa: 'بسیار خورنده و سوزاننده؛ کار زیر هود با دستکش نیتریل ضد اسید'
      },
      {
        id: 'rg-catalyst',
        nameFa: 'قرص کاتالیزور کجلدال (CuSO4 + K2SO4)',
        nameEn: 'Kjeldahl Catalyst Tablets',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'نسبت ۱:۱۰ مس سولفات به پتاسیم سولفات جهت افزایش نقطه جوش'
      },
      {
        id: 'rg-naoh-32',
        nameFa: 'محلول سدیم هیدروکسید ۳۲٪ الی ۴۰٪ (NaOH)',
        nameEn: 'Sodium Hydroxide Solution 32-40%',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حل کردن ۴۰۰ گرم سود جامد در آب مقطر و رساندن به ۱۰۰۰ میلی‌لیتر'
      },
      {
        id: 'rg-boric-acid',
        nameFa: 'اسید بوریک ۴٪ حاوی معرف تاشیرو (Tashiro Indicator)',
        nameEn: 'Boric Acid 4% with Mixed Indicator (Methyl Red + Bromocresol Green)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حل کردن ۴۰ گرم اسید بوریک در آب گرم، افزودن متیل رد و بروموکرزول گرین'
      },
      {
        id: 'rg-hcl-titrant',
        nameFa: 'محلول استاندارد اسید کلریدریک ۰.۱ نرمال (0.1 N HCl)',
        nameEn: 'Standard Hydrochloric Acid 0.1000 N',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'کالیبره شده با سدیم کربنات استاندارد اولیه با ۴ رقم اعشار'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-kjeldahl-digester',
        nameFa: 'بلوک هضم حرارتی کجلدال با سیستم خنثی‌ساز گاز (Scrubber)',
        nameEn: 'Kjeldahl Digestion Block with Fume Neutralizer',
        specification: 'دما تا ۴۵۰ درجه، لوله‌های هضم ۲۵۰ یا ۵۰۰ میلی‌لیتر',
        operatingTempOrParam: '۴۲۰ °C'
      },
      {
        id: 'eq-kjeldahl-distiller',
        nameFa: 'دستگاه تقطیر با بخار آب کجلدال (Steam Distillation Unit)',
        nameEn: 'Automatic Steam Distillation Unit',
        specification: 'تزریق خودکار آب، سود و اسید بوریک'
      },
      {
        id: 'eq-burette',
        nameFa: 'بورت دیجیتال یا شیشه‌ای ۵۰ میلی‌لیتر با دقت ۰.۰۱ mL',
        nameEn: 'Digital Titration Burette (0.01 mL accuracy)',
        specification: 'کلاس A با فاکتور دقیق'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'هضم نمونه (Digestion)',
        instructionFa: 'حدود ۰.۵ الی ۱.۰ گرم نمونه وزن شده را به همراه یک عدد قرص کاتالیزور و ۱۵ میلی‌لیتر اسید سولفوریک غلیظ درون لوله کجلدال بریزید. در بلوک هضم با دمای ۴۲۰ درجه به مدت ۶۰ تا ۹۰ دقیقه قرار دهید تا محلول کاملاً شفاف و سبز-آبی روشن شود.',
        criticalTimeOrTemp: '۴۲۰ °C به مدت ۶۰ الی ۹۰ دقیقه'
      },
      {
        stepNumber: 2,
        titleFa: 'تقطیر با بخار (Distillation)',
        instructionFa: 'پس از خنک شدن لوله هضم، ۵۰ میلی‌لیتر آب مقطر و ۵۰ میلی‌لیتر سود ۴۰٪ به آن اضافه کرده و بخاردهی را آغاز کنید. آمونیاک تقطیر شده را در ارلن حاوی ۲۵ میلی‌لیتر اسید بوریک ۴٪ با معرف جمع‌آوری کنید (حداقل ۱۵۰ میلی‌لیتر میعانات).',
        criticalTimeOrTemp: 'تقطیر تا جمع‌آوری ۱۵۰ میلی‌لیتر میعانات'
      },
      {
        stepNumber: 3,
        titleFa: 'تیتراسیون (Titration)',
        instructionFa: 'محلول جمع‌آوری شده در اسید بوریک را با اسید کلریدریک ۰.۱ نرمال استاندارد تیتر کنید تا رنگ محلول از سبز به بنفش/صورتی تغییر یابد (Vs). همزمان یک نمونه بلانک بدون ماده غذایی را به همین ترتیب تیتر کنید (Vb).',
        criticalTimeOrTemp: 'تیتراسیون تا تغییر رنگ شفاف'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{Crude Protein (\\%)} = \\frac{(V_s - V_b) \\times N_{\\text{HCl}} \\times 1.4007 \\times F}{m}',
      formulaDescriptionFa: 'درصد پروتئین = ((حجم مصرفی اسید برای نمونه منهای حجم مصرفی برای بلانک) ضربدر نرمالیته دقیق اسید ضربدر ۱.۴۰۰۷ ضربدر ضریب تبدیل نیتروژن به پروتئین F) تقسیم بر وزن نمونه (گرم)',
      variables: [
        { symbol: 'Vs', descriptionFa: 'حجم اسید مصرفی در تیتراسیون نمونه (mL)', unit: 'mL', defaultValue: 14.50 },
        { symbol: 'Vb', descriptionFa: 'حجم اسید مصرفی در تیتراسیون بلانک شاهد (mL)', unit: 'mL', defaultValue: 0.15 },
        { symbol: 'NHCl', descriptionFa: 'نرمالیته دقیق محلول اسید هیدروکلریک (N)', unit: 'N', defaultValue: 0.1000 },
        { symbol: 'm', descriptionFa: 'وزن نمونه وزن شده در لوله هضم (گرم)', unit: 'g', defaultValue: 1.0000 },
        { symbol: 'F', descriptionFa: 'ضریب تبدیل ازت به پروتئین (Conversion Factor)', unit: 'Factor', defaultValue: 6.25 }
      ],
      conversionFactors: [
        { matrix: 'شیر و تمام فرآورده‌های لبنی', factorName: 'لبنیات', factorValue: 6.38, sourceStandard: 'ISO 8968-1 / INSO 19052' },
        { matrix: 'آرد گندم، ماکارونی و نان', factorName: 'غلات و گندم', factorValue: 5.70, sourceStandard: 'AOAC 920.87 / INSO 19052' },
        { matrix: 'سویا و پروتئین ایزوله سویا', factorName: 'سویا', factorValue: 5.80, sourceStandard: 'AOAC / USDA' },
        { matrix: 'گوشت، تخم مرغ، خوراک و استاندارد عمومی', factorName: 'استاندارد عمومی', factorValue: 6.25, sourceStandard: 'Codex / INSO 19052' },
        { matrix: 'برنج و فرآورده‌های برنجی', factorName: 'برنج', factorValue: 5.95, sourceStandard: 'FAO' }
      ],
      unitResult: '% (g/100g)',
      significantFigures: 2,
      roundingRuleFa: 'گرد کردن به دو رقم اعشار طبق استاندارد',
      acceptableRSDPercent: 1.0
    },
    qualityControl: {
      reagentBlankRequirementFa: 'انجام آزمون شاهد کامل (Reagent Blank) با تمام معرف‌ها و اسید سولفوریک بدون نمونه (حجم بلانک نباید از ۰.۳ میلی‌لیتر تجاوز کند).',
      certifiedReferenceMaterialCRM: 'تست بازیافت استاندارد با استفاده از سولفات آمونیوم خالص یا استانیلید (Acetanilide CRM با بازیافت ۹۹.۰ تا ۱۰۱.۰ درصد).',
      expectedRecoveryRangePercent: { min: 99.0, max: 101.0 },
      repeatabilityLimit_r: 'اختلاف نتایج تکرارپذیری در نمونه یکسان نباید از ۰.۱۵٪ تجاوز نماید.',
      criticalControlCheckpoints: [
        'اطمینان از هضم کامل و عدم وجود هرگونه نقطه سیاه در دیواره لوله کجلدال',
        'اطمینان از قلیایی شدن کامل در تقطیر (رنگ محلول با سود باید سیاه-قهوه‌ای تیره شود)'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'بازیافت پایین ازت در نمونه استاندارد سولفات آمونیوم (< ۹۸٪)',
        probableCausesFa: ['نشتی آمونیاک از اتصالات دستگاه تقطیر', 'عدم غوطه‌وری نوک کندانسور در اسید بوریک در ابتدای تقطیر', 'ناکافی بودن زمان هضم'],
        investigationStepsFa: ['تست نشت‌یابی سیستم با تست آمونیوم سولفات'],
        correctiveAndPreventiveActionFa: 'بررسی لوله‌های سیلیکونی دستگاه تقطیر، تعویض درزبندی‌ها و غوطه‌وری کامل لوله گیرنده در اسید بوریک.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'توزین نمونه و افزودن معرف‌های هضم',
        descriptionFa: 'آماده‌سازی لوله هضم کجلدال',
        instructions: [
          'حدود ۰.۵ الی ۱.۰ گرم نمونه آسیاب‌شده را وزن کرده و به لوله هضم منتقل کنید (m).',
          'یک عدد قرص کاتالیزور و ۱۵ میلی‌لیتر اسید سولفوریک غلیظ به لوله اضافه کنید.'
        ],
        equipmentUsed: ['ترازوی آنالیتیکال ۴ رقم', 'لوله هضم کجلدال'],
        reagentsUsed: ['اسید سولفوریک غلیظ ۹۸٪', 'قرص کاتالیزور کجلدال'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'm', nameFa: 'وزن نمونه اولیه (m)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 0.2, maxValue: 2.0, decimalPrecision: 4 }
        ]
      },
      {
        stepNumber: 2,
        titleFa: 'تقطیر و تیتراسیون اسید-باز',
        descriptionFa: 'ثبت حجم‌های تیتراسیون نمونه و شاهد',
        instructions: [
          'پس از هضم و خنک شدن، تقطیر با بخار و سود ۴۰٪ را در ۲۵ میلی‌لیتر اسید بوریک ۴٪ انجام دهید.',
          'ارلن گیرنده را با اسید کلریدریک ۰.۱ نرمال تا ظهور رنگ بنفش تیتر کنید (Vs).',
          'یک بلانک شاهد را نیز تیتر نمایید (Vb).'
        ],
        equipmentUsed: ['دستگاه تقطیر کجلدال', 'بورت تیتراسیون دیجیتال'],
        reagentsUsed: ['سدیم هیدروکسید ۴۰٪', 'اسید بوریک ۴٪ با معرف', 'اسید هیدروکلریک ۰.۱ نرمال استاندارد'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'Vs', nameFa: 'حجم اسید مصرفی نمونه (Vs)', paramType: 'volume', expectedUnit: 'mL', required: true, minValue: 0.1, maxValue: 50.0, decimalPrecision: 2 },
          { id: 'Vb', nameFa: 'حجم اسید مصرفی شاهد بلانک (Vb)', paramType: 'volume', expectedUnit: 'mL', required: true, minValue: 0.0, maxValue: 1.0, decimalPrecision: 2 },
          { id: 'NHCl', nameFa: 'نرمالیته دقیق اسید کلریدریک (N)', paramType: 'numeric', expectedUnit: 'N', required: true, minValue: 0.05, maxValue: 0.2, defaultValue: 0.1000 }
        ]
      }
    ]
  },

  // 4. TOTAL FAT (SOXHLET)
  {
    id: 'chem-fat-soxhlet',
    code: 'CHEM-FAT-01',
    analyteFa: 'چربی کل (Total Fat / Crude Lipids)',
    analyteEn: 'Crude Fat by Continuous Soxhlet Solvent Extraction',
    titleFa: 'تعیین چربی کل به روش استخراج مداوم با سوکسله (Soxhlet)',
    titleEn: 'Determination of Crude Fat by Soxhlet Extraction Method',
    category: 'proximate_fat',
    sectorCompatibility: ['cereal', 'meat', 'bakery', 'confectionery', 'spices', 'fruits_veg'],
    objectiveFa: 'استخراج کامل لیپیدها، تری‌گلیسریدها و اسیدهای چرب آزاد از ماتریکس غذایی خشک با حلال آلی غیرقطبی.',
    chemicalPrincipleFa: 'حلال آلی فرار (پترولیوم اتر نقطه جوش ۴۰-۶۰ درجه یا دی‌اتیل اتر) در بالن به جوش آمده، بخارات آن در مبرد کندانس شده و قطرات حلال تازه روی کارتریج سلولزی حاوی نمونه می‌ریزد. با پر شدن محفظه سوکسله، سیفون انجام شده و چربی به بالن منتقل می‌گردد. پس از اتمام استخراج، حلال تقطیر و بازیابی شده و چربی باقیمانده توزین می‌شود.',
    samplePreparation: {
      homogenizationProtocolFa: 'آسیاب کردن نمونه خشک با اندازه ذرات ریز.',
      pretreatmentNotesFa: 'نمونه باید کاملاً خشک باشد (رطوبت مانع نفوذ حلال غیرقطبی می‌شود). برای نمونه‌های نانوایی، نشاسته‌ای و گوشتی، هیدرولیز اسیدی اولیه (Weibull-Stoldt) جهت آزادسازی چربی‌های پیوند یافته با پروتئین و کربوهیدرات الزامی است.',
      sampleMassOrVolume: '۳.۰۰۰ الی ۵.۰۰۰ گرم با دقت ۰.۰۰۰۱ گرم درون کارتوش سلولزی',
      storageBeforeAnalysis: 'دسیکاتور'
    },
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 3001',
      year: '1393',
      titleFa: 'فرآورده‌های غذایی و کشاورزی - تعیین چربی خام به روش سوکسله',
      titleEn: 'Food and Agricultural Products - Determination of Crude Fat by Soxhlet',
      scopeAndMatrix: 'غلات، دانه‌های روغنی، خوراک دام، بیسکویت، کیک و ادویه',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'AOAC',
        standardNumber: 'AOAC 920.39',
        titleFa: 'چربی (خام) در خوراک و غلات',
        titleEn: 'Fat (Crude) or Ether Extract in Animal Feed and Cereals',
        scopeAndMatrix: 'Feeds, Cereals, Grains'
      },
      {
        organization: 'ISO',
        standardNumber: 'ISO 1443:1973',
        titleFa: 'گوشت و فرآورده‌های گوشتی - تعیین چربی کل (هیدرولیز اسیدی و سوکسله)',
        titleEn: 'Meat and meat products - Determination of total fat content',
        scopeAndMatrix: 'Meat and Meat Products'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'fat-alt-gerber',
        methodNameFa: 'روش بوتیرومتری ژربر برای لبنیات (Gerber Butyrometer Method)',
        methodNameEn: 'Gerber Centrifugal Acid Digestion for Milk & Dairy',
        principleFa: 'حل کردن پروتئین‌های شیر با اسید سولفوریک غلیظ (وزن مخصوص ۱.۸۲) در حضور ایزوآمیل الکل و جداسازی ستون چربی مایع با سانتریفیوژ در دمای ۶۵ درجه در بوتیرومتر مدرج.',
        applicableMatrixes: ['شیر خام', 'شیر پاستوریزه و استریل', 'خامه', 'دوغ و ماست', 'پنیر'],
        standardReferences: [{ organization: 'INSO', standardNumber: 'INSO 366', titleFa: 'شیر و فرآورده‌های آن - تعیین چربی به روش ژربر', titleEn: 'Milk and Milk Products - Determination of Fat Content by Gerber', scopeAndMatrix: 'Dairy' }],
        advantagesFa: ['بسیار سریع (کمتر از ۱۵ دقیقه)', 'مناسب برای خط تولید و کنترل کیفیت آنلاین'],
        limitationsFa: ['مخصوص ماتریس‌های لبنی مایع و نیمه‌جامد', 'خطرات کار با اسید سولفوریک داغ'],
        analysisTime: '۱۵ دقیقه'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-pet-ether',
        nameFa: 'پترولیوم اتر درجه خلوص آنالیتیکال (دامنه جوش ۴۰ الی ۶۰ درجه)',
        nameEn: 'Petroleum Ether AR (boiling range 40-60°C)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حلال بدون باقیمانده تبخیر',
        safetyHazardFa: 'بسیار اشتعال‌پذیر و فرار؛ اکیداً دور از شعله مستقیم و در حمام آب گرم استفاده شود'
      },
      {
        id: 'rg-cotton',
        nameFa: 'پنبه هیدروفیله چربی‌گیری‌شده',
        nameEn: 'Defatted Cotton Wool',
        grade: 'Pure',
        preparationProtocolFa: 'استخراج شده با پترولیوم اتر به مدت ۲ ساعت'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-soxhlet-apparatus',
        nameFa: 'دستگاه استخراج سوکسله شیشه‌ای (بالن، محفظه سیفون، مبرد)',
        nameEn: 'Glass Soxhlet Extraction Apparatus (Flask, Extractor, Allihn Condenser)',
        specification: 'بالن ته گرد ۲۵۰ میلی‌لیتر، اتصالات سمباده‌ای استاندارد'
      },
      {
        id: 'eq-heating-mantle',
        nameFa: 'منتل حرارتی الکتریکی ایمن یا حمام آب بن‌ماری',
        nameEn: 'Explosion-Proof Multi-Position Heating Mantle',
        specification: 'کنترل دمای متغیر جهت تنظیم سرعت سیفون (۴ الی ۶ سیفون در ساعت)'
      },
      {
        id: 'eq-thimble',
        nameFa: 'کارتوش سلولزی استخراج (Extraction Thimble)',
        nameEn: 'Cellulose Extraction Thimble (30x100 mm)',
        specification: 'عاری از چربی، نفوذپذیر به حلال'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'خشک کردن و توزین بالن خالی',
        instructionFa: 'بالن استخراج را به همراه چند عدد پرل شیشه‌ای ضد جوش در آون ۱۰۵ درجه به مدت ۱ ساعت خشک کرده، در دسیکاتور خنک کنید و با ترازوی ۴ رقم وزن کنید (m0).',
        criticalTimeOrTemp: '۱۰۵ درجه به مدت ۶۰ دقیقه، ۳۰ دقیقه در دسیکاتور'
      },
      {
        stepNumber: 2,
        titleFa: 'توزین نمونه و بسته‌بندی در کارتوش',
        instructionFa: 'حدود ۳ تا ۵ گرم از نمونه کاملاً خشک‌شده را وزن کرده (m)، درون کارتوش سلولزی بریزید و روی آن را با پنبه چربی‌گیری‌شده بپوشانید.',
        criticalTimeOrTemp: 'استفاده از نمونه کاملاً خشک'
      },
      {
        stepNumber: 3,
        titleFa: 'استخراج چربی با سوکسله',
        instructionFa: 'کارتوش را درون محفظه سوکسله قرار دهید. حدود ۱۵۰ میلی‌لیتر پترولیوم اتر به بالن اضافه کرده و سیستم مبرد آب سرد را برقرار کنید. حرارت را طوری تنظیم کنید که ۴ الی ۶ بار در هر ساعت عمل سیفون انجام شود. استخراج را به مدت ۴ الی ۶ ساعت ادامه دهید.',
        criticalTimeOrTemp: '۴ تا ۶ ساعت استخراج مداوم'
      },
      {
        stepNumber: 4,
        titleFa: 'تقطیر حلال، خشک‌کردن بالن و توزین نهایی',
        instructionFa: 'حلال را با تقطیر بازیابی نموده، بالن حاوی چربی را به مدت ۱ ساعت در آون ۱۰۵ درجه قرار دهید تا آخرین آثار حلال تبخیر شود. سپس در دسیکاتور خنک کرده و وزن کنید (m1).',
        criticalTimeOrTemp: '۱۰۵ درجه به مدت ۶۰ دقیقه'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{Crude Fat (\\%)} = \\frac{m_1 - m_0}{m} \\times 100',
      formulaDescriptionFa: 'درصد چربی خام = ((وزن بالن با چربی استخراج شده - وزن بالن خالی اولیه) تقسیم بر وزن نمونه تر اولیه) ضربدر ۱۰۰',
      variables: [
        { symbol: 'm0', descriptionFa: 'وزن بالن خالی خشک شده (گرم)', unit: 'g', defaultValue: 112.4512 },
        { symbol: 'm1', descriptionFa: 'وزن بالن + چربی استخراج شده خشک (گرم)', unit: 'g', defaultValue: 112.8712 },
        { symbol: 'm', descriptionFa: 'وزن نمونه اولیه وزن شده در کارتوش (گرم)', unit: 'g', defaultValue: 5.0000 }
      ],
      unitResult: '% (g/100g)',
      significantFigures: 2,
      roundingRuleFa: 'گرد کردن به دو رقم اعشار طبق ISO 80000-1',
      acceptableRSDPercent: 1.5
    },
    qualityControl: {
      reagentBlankRequirementFa: 'تقطیر حجم مساوی از حلال خالص جهت اطمینان از عدم وجود باقیمانده روغنی غیرفرار در حلال.',
      expectedRecoveryRangePercent: { min: 98.0, max: 102.0 },
      repeatabilityLimit_r: 'اختلاف نتایج بین دو تکرار همزمان نباید از ۰.۲ گرم در ۱۰۰ گرم تجاوز کند.',
      criticalControlCheckpoints: [
        'اطمینان از برقراری جریان آب سرد در مبرد در تمام طول آزمون',
        'اطمینان از کامل بودن سیفون‌ها و عدم برگشت زودهنگام حلال'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'استخراج ناقص چربی و درصد کمتر از حد انتظار در بیسکویت یا گوشت',
        probableCausesFa: ['چربی‌ها با پروتئین‌ها و نشاسته پیوند کمپلکس داده‌اند و با حلال غیرقطبی آزاد نمی‌شوند'],
        investigationStepsFa: ['بررسی ماهیت ماتریکس نمونه'],
        correctiveAndPreventiveActionFa: 'انجام هیدرولیز اسیدی با اسید هیدروکلریک ۴ نرمال طبق روش Weibull-Stoldt (استاندارد ISO 1443) قبل از استخراج سوکسله.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'توزین بالن خالی و نمونه',
        descriptionFa: 'آماده‌سازی بالن و کارتوش استخراج',
        instructions: [
          'بالن خشک شده را وزن کنید (m0).',
          'نمونه خشک را وزن کرده و در کارتوش قرار دهید (m).'
        ],
        equipmentUsed: ['ترازوی آنالیتیکال ۴ رقم', 'بالن استخراج سوکسله'],
        reagentsUsed: ['پترولیوم اتر'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'm0', nameFa: 'وزن بالن خالی اولیه (m0)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 50, maxValue: 250, decimalPrecision: 4 },
          { id: 'm', nameFa: 'وزن نمونه در کارتوش (m)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 1.0, maxValue: 10.0, decimalPrecision: 4 }
        ]
      },
      {
        stepNumber: 2,
        titleFa: 'استخراج و توزین چربی',
        descriptionFa: 'پایان استخراج و توزین بالن با چربی',
        instructions: [
          'پس از ۴ ساعت استخراج، حلال را تبخیر کرده و بالن را ۱ ساعت در آون ۱۰۵ درجه خشک کنید.',
          'بالن را در دسیکاتور خنک کرده و وزن نهایی را ثبت کنید (m1).'
        ],
        equipmentUsed: ['سوکسله', 'آون ۱۰۵ درجه', 'ترازوی ۴ رقم'],
        reagentsUsed: [],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'm1', nameFa: 'وزن بالن + چربی خشک (m1)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 50, maxValue: 260, decimalPrecision: 4 }
        ]
      }
    ]
  },

  // 5. TITRATABLE ACIDITY & pH
  {
    id: 'chem-acidity-titration',
    code: 'CHEM-ACD-01',
    analyteFa: 'اسیدیته قابل تیتر و pH (Titratable Acidity & pH)',
    analyteEn: 'Titratable Acidity by Standard NaOH Titration & Potentiometric pH',
    titleFa: 'تعیین اسیدیته قابل تیتر به روش خنثی‌سازی با سدیم هیدروکسید و سنجش pH',
    titleEn: 'Determination of Titratable Acidity and Potentiometric pH in Foods',
    category: 'acidity_ph',
    sectorCompatibility: ['dairy', 'beverages', 'fruits_veg', 'cereal', 'bakery', 'confectionery'],
    objectiveFa: 'سنجش میزان اسیدهای آلی کل آزاد در ماده غذایی و تعیین میزان pH به عنوان شاخص کیفیت، فساد، ترشیدگی و فعالیت آنزیمی.',
    chemicalPrincipleFa: 'خنثی‌سازی اسیدهای آلی موجود در نمونه غذایی با محلول استاندارد سدیم هیدروکسید (0.1 N NaOH) در حضور شناساگر فنل‌فتالئین (تغییر رنگ در pH = 8.2 تا 8.3 به صورتی کم‌رنگ پایدار به مدت ۳۰ ثانیه) یا به روش پتانسیومتری با الکترود شیشه‌ای pH تا نقطه خنثی pH = 8.1.',
    samplePreparation: {
      homogenizationProtocolFa: 'میکس کامل نمونه‌های مایع؛ رقیق‌سازی با آب مقطر دی‌اکسید کربن‌زدایی‌شده (جوشیده و خنک‌شده).',
      pretreatmentNotesFa: 'برای نمونه‌های رنگی تیره (آب انار، رب گوجه‌فرنگی)، استفاده از pH متر پتانسیومتری به جای شناساگر چشمی الزامی است.',
      sampleMassOrVolume: '۱۰.۰۰ الی ۲۵.۰۰ گرم یا میلی‌لیتر',
      storageBeforeAnalysis: 'یخچال ۴ درجه'
    },
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 2852',
      year: '1393',
      titleFa: 'شیر و فرآورده‌های آن - تعیین اسیدیته و pH',
      titleEn: 'Milk and Milk Products - Determination of Titratable Acidity and pH',
      scopeAndMatrix: 'شیر، ماست، دوغ، پنیر و خامه',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'AOAC',
        standardNumber: 'AOAC 942.15',
        titleFa: 'اسیدیته قابل تیتر در آبمیوه‌ها و فرآورده‌های میوه',
        titleEn: 'Acidity (Titratable) of Fruit Products',
        scopeAndMatrix: 'Fruit Juices, Tomato paste, Jams'
      },
      {
        organization: 'ISO',
        standardNumber: 'ISO 1842:1991',
        titleFa: 'فرآورده‌های میوه و سبزی - تعیین pH پتانسیومتری',
        titleEn: 'Fruit and vegetable products - Determination of pH',
        scopeAndMatrix: 'Fruits and vegetables'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'acd-alt-dornic',
        methodNameFa: 'اسیدیته به درجه دورنیک (°Dornic) در صنایع لبنی',
        methodNameEn: 'Dornic Acidity (°D) using N/9 NaOH',
        principleFa: 'تیتراسیون ۱۰ میلی‌لیتر شیر با سود N/9 (یک‌نهم نرمال). هر میلی‌لیتر سود مصرفی معادل ۱ درجه دورنیک (۰.۰۱٪ اسید لاکتیک) است.',
        applicableMatrixes: ['شیر خام', 'شیر پاستوریزه', 'دوغ'],
        standardReferences: [{ organization: 'IDF', standardNumber: 'IDF Standard 150', titleFa: 'شیر - اسیدیته دورنیک', titleEn: 'Milk - Dornic Acidity', scopeAndMatrix: 'Dairy' }],
        advantagesFa: ['خوانش مستقیم عدد اسیدیته بدون نیاز به محاسبه'],
        limitationsFa: ['منحصر به صنایع شیر'],
        analysisTime: '۲ دقیقه'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-naoh-01',
        nameFa: 'محلول استاندارد سدیم هیدروکسید ۰.۱ نرمال (0.1000 N NaOH)',
        nameEn: 'Standard Sodium Hydroxide Solution 0.1000 N',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'کالیبره شده با پتاسیم هیدروژن فتالات (KHP) استاندارد اولیه با ۴ رقم اعشار',
        storageRequirement: 'ظرف پلی‌اتیلنی مجهز به لوله جاذب CO2 (سودالایم)'
      },
      {
        id: 'rg-phenolphthalein',
        nameFa: 'شناساگر فنل‌فتالئین ۱٪ در اتانول ۹۶٪',
        nameEn: 'Phenolphthalein Indicator 1% in Ethanol',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حل کردن ۱.۰ گرم فنل‌فتالئین در ۱۰۰ میلی‌لیتر اتانول ۹۶٪'
      },
      {
        id: 'rg-buffers',
        nameFa: 'بافرهای کالیبراسیون pH متر (pH 4.00, 7.00, 9.21)',
        nameEn: 'Standard Buffer Solutions pH 4.00 and 7.00',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'بافرهای استاندارد معتبر با تصحیح دمایی'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-ph-meter',
        nameFa: 'pH متر دیجیتال رومیزی مجهز به پروب دمایی خودکار (ATC)',
        nameEn: 'Benchtop pH Meter with Automatic Temperature Compensation (ATC)',
        specification: 'دقت ۰.۰۱ واحد pH، کالیبراسیون دو یا سه نقطه‌ای',
        calibrationRequirement: 'کالیبراسیون روزانه با بافرهای ۴ و ۷'
      },
      {
        id: 'eq-burette-acidity',
        nameFa: 'بورت دیجیتال یا شیشه‌ای ۲۵ میلی‌لیتر با دقت ۰.۰۵ mL',
        nameEn: 'Precision Titration Burette 25 mL'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'سنجش pH اولیه نمونه',
        instructionFa: 'الکترود pH متر کالیبره‌شده را در نمونه یکنواخت‌شده با دمای ۲۰ درجه غوطه‌ور کرده و پس از پایدار شدن عدد، مقدار pH را ثبت کنید.',
        criticalTimeOrTemp: 'دمای ۲۰ ± ۱ °C'
      },
      {
        stepNumber: 2,
        titleFa: 'توزین یا برداشت حجم نمونه و رقیق‌سازی',
        instructionFa: 'مقدار ۱۰ الی ۲۵ گرم (یا میلی‌لیتر) از نمونه را در ارلن ۲۵۰ میلی‌لیتر وزن کنید (m). ۵۰ میلی‌لیتر آب مقطر بدون CO2 به آن اضافه کنید.',
        criticalTimeOrTemp: 'استفاده از آب جوشیده خنک'
      },
      {
        stepNumber: 3,
        titleFa: 'تیتراسیون با سود ۰.۱ نرمال تا نقطه پایانی',
        instructionFa: '۴ تا ۵ قطره شناساگر فنل‌فتالئین اضافه کرده و با محلول سدیم هیدروکسید ۰.۱ نرمال تیتر کنید تا رنگ صورتی کم‌رنگ به مدت ۳۰ ثانیه پایدار بماند. حجم سود مصرفی را یادداشت کنید (V).',
        criticalTimeOrTemp: 'پایداری رنگ صورتی به مدت ۳۰ ثانیه'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{Acidity (\\%)} = \\frac{V \\times N \\times M_{\\text{acid}} \\times 100}{m \\times 1000}',
      formulaDescriptionFa: 'درصد اسیدیته = (حجم سود مصرفی (mL) ضربدر نرمالیته دقیق سود ضربدر جرم اکی‌والان اسید غالب ضربدر ۱۰۰) تقسیم بر (وزن نمونه بر حسب گرم ضربدر ۱۰۰۰)',
      variables: [
        { symbol: 'V', descriptionFa: 'حجم سود مصرفی در تیتراسیون (mL)', unit: 'mL', defaultValue: 8.40 },
        { symbol: 'N', descriptionFa: 'نرمالیته دقیق محلول سدیم هیدروکسید (N)', unit: 'N', defaultValue: 0.1000 },
        { symbol: 'm', descriptionFa: 'وزن یا حجم نمونه آزمایه (گرم یا میلی‌لیتر)', unit: 'g', defaultValue: 10.000 },
        { symbol: 'M_acid', descriptionFa: 'جرم اکی‌والان اسید غالب بر حسب گرم بر اکی‌والان (Meq)', unit: 'g/eq', defaultValue: 90.08 }
      ],
      conversionFactors: [
        { matrix: 'شیر و فرآورده‌های لبنی (اسید لاکتیک)', factorName: 'اسید لاکتیک (Lactic Acid)', factorValue: 90.08, sourceStandard: 'INSO 2852' },
        { matrix: 'مرکبات، آبلیمو، آب پرتقال و رب گوجه (اسید سیتریک انیدروز)', factorName: 'اسید سیتریک (Citric Acid)', factorValue: 64.04, sourceStandard: 'AOAC 942.15' },
        { matrix: 'سرکه، ترشیجات و خیارشور (اسید استیک)', factorName: 'اسید استیک (Acetic Acid)', factorValue: 60.05, sourceStandard: 'INSO 2852' },
        { matrix: 'آب سیب و میوه‌های هسته‌دار (اسید مالیک)', factorName: 'اسید مالیک (Malic Acid)', factorValue: 67.05, sourceStandard: 'AOAC 942.15' },
        { matrix: 'آب انگور و فرآورده‌های آن (اسید تارتاریک)', factorName: 'اسید تارتاریک (Tartaric Acid)', factorValue: 75.04, sourceStandard: 'OIV / AOAC' },
        { matrix: 'روغن‌های خوراکی و چربی‌ها (اسید اولئیک)', factorName: 'اسید اولئیک (Oleic Acid)', factorValue: 282.46, sourceStandard: 'ISO 660' }
      ],
      unitResult: '% (g/100g or g/100mL)',
      significantFigures: 2,
      roundingRuleFa: 'گرد کردن به دو رقم اعشار',
      acceptableRSDPercent: 1.0
    },
    qualityControl: {
      reagentBlankRequirementFa: 'تیتراسیون ۵۰ میلی‌لیتر آب مقطر مصرفی با سود ۰.۱ نرمال جهت کسر خطای بلانک آب.',
      expectedRecoveryRangePercent: { min: 99.0, max: 101.0 },
      repeatabilityLimit_r: 'اختلاف دو تکرار همزمان نباید از ۰.۰۲٪ تجاوز نماید.',
      criticalControlCheckpoints: [
        'کنترل عدم جذب CO2 توسط محلول سود با استفاده از لوله سودالایم',
        'دقت در تشخیص ظهور اولین هاله صورتی پایدار'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'محو شدن سریع رنگ صورتی پس از چند ثانیه',
        probableCausesFa: ['جذب دی‌اکسید کربن (CO2) هوا و تشکیل اسید کربنیک'],
        investigationStepsFa: ['تیتراسیون در ارلن با دهانه باریک'],
        correctiveAndPreventiveActionFa: 'نقطه پایانی را لحظه‌ای در نظر بگیرید که رنگ صورتی کم‌رنگ حداقل ۳۰ ثانیه باقی بماند.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'سنجش pH و برداشت نمونه',
        descriptionFa: 'ثبت pH پتانسیومتری و وزن نمونه',
        instructions: [
          'مقدار pH نمونه را با الکترود کالیبره ثبت کنید.',
          'حدود ۱۰ گرم از نمونه را در ارلن وزن کنید (m).'
        ],
        equipmentUsed: ['pH متر دیجیتال', 'ترازوی آزمایشگاهی'],
        reagentsUsed: [],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'pH_val', nameFa: 'مقدار pH خوانده‌شده', paramType: 'ph_level', expectedUnit: 'pH', required: true, minValue: 1.0, maxValue: 14.0, decimalPrecision: 2 },
          { id: 'm', nameFa: 'وزن نمونه (m)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 1.0, maxValue: 50.0, decimalPrecision: 3 }
        ]
      },
      {
        stepNumber: 2,
        titleFa: 'تیتراسیون خنثی‌سازی با سود',
        descriptionFa: 'ثبت حجم سود مصرفی',
        instructions: [
          'نمونه را با ۵۰ میلی‌لیتر آب مقطر رقیق کرده و ۴ قطره فنل‌فتالئین اضافه کنید.',
          'با سدیم هیدروکسید ۰.۱ نرمال تا ظهور رنگ صورتی پایدار تیتر کنید (V).'
        ],
        equipmentUsed: ['بورت تیتراسیون'],
        reagentsUsed: ['محلول سدیم هیدروکسید ۰.۱ نرمال', 'فنل‌فتالئین ۱٪'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'V', nameFa: 'حجم سود ۰.۱ نرمال مصرفی (V)', paramType: 'volume', expectedUnit: 'mL', required: true, minValue: 0.1, maxValue: 50.0, decimalPrecision: 2 },
          { id: 'N', nameFa: 'نرمالیته سود (N)', paramType: 'numeric', expectedUnit: 'N', required: true, minValue: 0.05, maxValue: 0.2, defaultValue: 0.1000 }
        ]
      }
    ]
  },

  // 6. SALT / CHLORIDE (MOHR & VOLHARD)
  {
    id: 'chem-salt-mohr',
    code: 'CHEM-SLT-01',
    analyteFa: 'نمک و کلرید (Salt as Sodium Chloride / NaCl)',
    analyteEn: 'Salt (NaCl) by Mohr Argentometric Titration & Volhard Method',
    titleFa: 'تعیین مقدار نمک (کلرید سدیم) به روش آرژانتومتری موهر (Mohr) و ولهارد',
    titleEn: 'Determination of Sodium Chloride by Mohr & Volhard Methods',
    category: 'salt_minerals',
    sectorCompatibility: ['dairy', 'meat', 'bakery', 'confectionery', 'cereal', 'spices'],
    objectiveFa: 'اندازه‌گیری دقیق درصد کلرید سدیم (نمک طعام) در فرآورده‌های غذایی به منظور کنترل فرمولاسیون، پذیرش حسی و الزامات استاندارد.',
    chemicalPrincipleFa: 'روش موهر (Mohr): تیتراسیون مستقیم یون‌های کلرید با نیترات نقره استاندارد (0.1 N AgNO3) در محیط خنثی یا کمی قلیایی (pH 6.5 تا 9.0) در حضور شناساگر پتاسیم کرومات (K2CrO4). پس از رسوب کامل کلرید نقره سفید رنگ (AgCl)، اولین قطره اضافی نقره با کرومات واکنش داده و رسوب قرمز آجری کرومات نقره (Ag2CrO4) تشکیل می‌شود.',
    samplePreparation: {
      homogenizationProtocolFa: 'عصاره‌گیری از نمونه با آب مقطر گرم (۵۰ الی ۶۰ درجه) و همزدن شدید به مدت ۱۵ دقیقه جهت انتقال کامل یون‌های کلرید به فاز آبی.',
      pretreatmentNotesFa: 'برای پنیر، کره و گوشت: حل کردن نمونه در آب گرم یا استفاده از هضم اسید نیتریک و روش ولهارد (Volhard Back-Titration) با پتاسیم تیوسیانات.',
      sampleMassOrVolume: '۲.۰۰۰ الی ۵.۰۰۰ گرم با دقت ۰.۰۰۱ گرم',
      storageBeforeAnalysis: 'دمای اتاق'
    },
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 1808',
      year: '1393',
      titleFa: 'فرآورده‌های گوشتی - تعیین مقدار کلرید (روش مرجع)',
      titleEn: 'Meat and Meat Products - Determination of Chloride Content',
      scopeAndMatrix: 'سوسیس، کالباس، همبرگر و فرآورده‌های گوشتی',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'AOAC',
        standardNumber: 'AOAC 960.29',
        titleFa: 'نمک (کلر) در فرآورده‌های غذایی به روش آرژانتومتری',
        titleEn: 'Salt (Chlorine as Sodium Chloride) in Food',
        scopeAndMatrix: 'General Food Products'
      },
      {
        organization: 'ISO',
        standardNumber: 'ISO 1841-1:1996',
        titleFa: 'گوشت و فرآورده‌های گوشتی - تعیین مقدار کلرید (بخش ۱: روش ولهارد)',
        titleEn: 'Meat and meat products - Determination of chloride content (Volhard)',
        scopeAndMatrix: 'Meat and Meat Products'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'slt-alt-volhard',
        methodNameFa: 'روش ولهارد (Volhard Back-Titration Method)',
        methodNameEn: 'Volhard Indirect Titration with AgNO3 and KSCN in Acidic Medium',
        principleFa: 'افزودن مقدار اضافی معلوم از نیترات نقره در حضور اسید نیتریک غلیظ، فیلتراسیون رسوب AgCl و تیتراسیون برگشتی نقره اضافی با محلول پتاسیم تیوسیانات (KSCN) در حضور زاج آهن آمونیاکی (رنگ قرمز-قهوه‌ای کمپلکس Fe(SCN)2+).',
        applicableMatrixes: ['گوشت و فرآورده‌های گوشتی چرب', 'پنیرهای شور', 'خیارشور و زیتون شور'],
        standardReferences: [{ organization: 'ISO', standardNumber: 'ISO 1841-1', titleFa: 'تعیین کلرید به روش ولهارد', titleEn: 'Chloride by Volhard', scopeAndMatrix: 'Meat' }],
        advantagesFa: ['امکان انجام در محیط اسیدی شدید', 'عدم تداخل رنگ و چربی نمونه'],
        limitationsFa: ['طولانی‌تر بودن نسبت به روش موهر'],
        analysisTime: '۳۰ دقیقه'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-agno3',
        nameFa: 'محلول استاندارد نیترات نقره ۰.۱ نرمال (0.1000 N AgNO3)',
        nameEn: 'Standard Silver Nitrate Solution 0.1000 N',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'کالیبره شده با محلول استاندارد سدیم کلرید خشک شده',
        storageRequirement: 'شیشه کهربایی دور از نور مستقیم'
      },
      {
        id: 'rg-k2cro4',
        nameFa: 'شناساگر پتاسیم کرومات ۵٪ (K2CrO4)',
        nameEn: 'Potassium Chromate Indicator 5%',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حل کردن ۵.۰ گرم پتاسیم کرومات در ۱۰۰ میلی‌لیتر آب مقطر'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-burette-salt',
        nameFa: 'بورت تیتراسیون شیشه‌ای با دقت ۰.۰۵ mL',
        nameEn: 'Amber Glass Titration Burette 25 mL',
        specification: 'شیشه تیره ضد نور برای نیترات نقره'
      },
      {
        id: 'eq-balance-salt',
        nameFa: 'ترازوی آزمایشگاهی دیجیتال ۴ رقم',
        nameEn: 'Analytical Balance (0.0001 g)'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'توزین نمونه و عصاره‌گیری کلرید با آب گرم',
        instructionFa: 'حدود ۲ تا ۵ گرم نمونه را وزن کرده (m) و در بشر با ۱۰۰ میلی‌لیتر آب مقطر جوشیده مخلوط کنید. به مدت ۱۵ دقیقه روی استیرر هم بزنید تا کلرید کاملاً استخراج شود.',
        criticalTimeOrTemp: '۱۵ دقیقه همزدن در ۶۰ درجه'
      },
      {
        stepNumber: 2,
        titleFa: 'تنظیم pH و افزودن شناساگر',
        instructionFa: 'عصاره را از کاغذ صافی عبور داده و حجم آن را به مقدار مشخص (مثلاً ۲۵۰ میلی‌لیتر) برسانید یا از کل سوسپانسیون استفاده کنید. ۱ میلی‌لیتر شناساگر پتاسیم کرومات ۵٪ اضافه کنید (محیط زرد رنگ می‌شود).',
        criticalTimeOrTemp: 'بررسی خنثی بودن pH بین ۶.۵ تا ۸.۵'
      },
      {
        stepNumber: 3,
        titleFa: 'تیتراسیون با نیترات نقره تا ظهور رسوب قرمز آجری',
        instructionFa: 'با محلول نیترات نقره ۰.۱ نرمال به آرامی تیتر کنید تا رسوب سفید تشکیل شده و با اولین قطره اضافی، رنگ محلول به قرمز آجری مایل به قهوه‌ای تغییر کند و پایدار بماند (Vs). یک بلانک آب مقطر را نیز تیتر کنید (Vb).',
        criticalTimeOrTemp: 'ظهور رنگ رسوب قرمز آجری'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{NaCl (\\%)} = \\frac{(V_s - V_b) \\times N_{\\text{AgNO}_3} \\times 0.05844 \\times 100}{m}',
      formulaDescriptionFa: 'درصد نمک = ((حجم نیترات نقره مصرفی نمونه منهای حجم بلانک) ضربدر نرمالیته نیترات نقره ضربدر ۰.۰۵۸۴۴ ضربدر ۱۰۰) تقسیم بر وزن نمونه (گرم)',
      variables: [
        { symbol: 'Vs', descriptionFa: 'حجم نیترات نقره مصرفی برای نمونه (mL)', unit: 'mL', defaultValue: 6.20 },
        { symbol: 'Vb', descriptionFa: 'حجم نیترات نقره مصرفی برای بلانک شاهد (mL)', unit: 'mL', defaultValue: 0.10 },
        { symbol: 'NAgNO3', descriptionFa: 'نرمالیته دقیق محلول نیترات نقره (N)', unit: 'N', defaultValue: 0.1000 },
        { symbol: 'm', descriptionFa: 'وزن نمونه اولیه (گرم)', unit: 'g', defaultValue: 3.000 }
      ],
      unitResult: '% (g/100g)',
      significantFigures: 2,
      roundingRuleFa: 'گرد کردن به دو رقم اعشار',
      acceptableRSDPercent: 1.5
    },
    qualityControl: {
      reagentBlankRequirementFa: 'تیتراسیون بلانک آب مقطر با نیترات نقره جهت تصحیح حجم لازم برای تغییر رنگ کرومات.',
      expectedRecoveryRangePercent: { min: 98.5, max: 101.5 },
      repeatabilityLimit_r: 'اختلاف دو تکرار همزمان نباید از ۰.۰۵ گرم در ۱۰۰ گرم فراتر رود.',
      criticalControlCheckpoints: [
        'اطمینان از خنثی بودن محیط (اگر محیط اسیدی باشد رسوب کرومات نقره حل شده و نقطه پایانی تشخیص داده نمی‌شود)'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'عدم تغییر رنگ و تشکیل نشدن رسوب قرمز با وجود مصرف زیاد نیترات نقره',
        probableCausesFa: ['اسیدی بودن شدید محیط نمونه (pH < 6.0) که مانع تشکیل رسوب کرومات نقره می‌شود'],
        investigationStepsFa: ['اندازه‌گیری pH نمونه با کاغذ تورنسل یا pH متر'],
        correctiveAndPreventiveActionFa: 'تنظیم pH با افزودن مقدار کمی کلسیم کربنات (CaCO3) خالص یا سدیم بی‌کربنات تا رسیدن به pH = 7.0 تا 8.0 قبل از تیتراسیون.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'توزین نمونه و عصاره‌گیری کلرید',
        descriptionFa: 'ثبت وزن نمونه و استخراج نمک',
        instructions: [
          'حدود ۲ تا ۵ گرم نمونه را وزن کرده و در آب گرم استخراج کنید (m).',
          'عصاره را صاف کرده و ۱ میلی‌لیتر پتاسیم کرومات اضافه کنید.'
        ],
        equipmentUsed: ['ترازوی ۴ رقم', 'استیرر حرارتی'],
        reagentsUsed: ['پتاسیم کرومات ۵٪'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'm', nameFa: 'وزن نمونه (m)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 0.5, maxValue: 10.0, decimalPrecision: 3 }
        ]
      },
      {
        stepNumber: 2,
        titleFa: 'تیتراسیون با نیترات نقره',
        descriptionFa: 'ثبت حجم مصرفی تیترانت',
        instructions: [
          'با نیترات نقره ۰.۱ نرمال تا ظهور رنگ قرمز آجری تیتر کنید (Vs).',
          'بلانک آب مقطر را نیز تیتر کنید (Vb).'
        ],
        equipmentUsed: ['بورت شیشه‌ای کهربایی'],
        reagentsUsed: ['محلول استاندارد نیترات نقره ۰.۱ نرمال'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'Vs', nameFa: 'حجم نیترات نقره مصرفی نمونه (Vs)', paramType: 'volume', expectedUnit: 'mL', required: true, minValue: 0.1, maxValue: 50.0, decimalPrecision: 2 },
          { id: 'Vb', nameFa: 'حجم نیترات نقره بلانک (Vb)', paramType: 'volume', expectedUnit: 'mL', required: true, minValue: 0.0, maxValue: 1.0, decimalPrecision: 2 },
          { id: 'NAgNO3', nameFa: 'نرمالیته نیترات نقره (N)', paramType: 'numeric', expectedUnit: 'N', required: true, minValue: 0.05, maxValue: 0.2, defaultValue: 0.1000 }
        ]
      }
    ]
  },

  // 7. BRIX & REFRACTOMETRIC SOLUBLE SOLIDS
  {
    id: 'chem-brix-refractometer',
    code: 'CHEM-BRX-01',
    analyteFa: 'بریکس و مواد جامد محلول (Total Soluble Solids / °Brix)',
    analyteEn: 'Refractometric Total Soluble Solids (°Brix) at 20°C',
    titleFa: 'تعیین مواد جامد محلول (درجه بریکس) به روش رفراکتومتری در ۲۰ درجه سلسیوس',
    titleEn: 'Determination of Soluble Solids Content (°Brix) by Refractometer at 20°C',
    category: 'carbohydrates_sugars',
    sectorCompatibility: ['beverages', 'fruits_veg', 'confectionery', 'dairy'],
    objectiveFa: 'اندازه‌گیری درصد غلظت قندها و مواد جامد محلول در آبمیوه، شربت، کنسانتره، رب گوجه‌فرنگی و نوشیدنی‌ها.',
    chemicalPrincipleFa: 'اندازه‌گیری ضریب شکست نور (Refractive Index - nD) هنگام عبور از لایه نازک محلول شفاف و تبدیل آن به درصد ساکارز وزنی (گرم ساکارز در ۱۰۰ گرم محلول = درجه بریکس °Brix) در دمای مرجع ۲۰.۰ درجه سلسیوس.',
    samplePreparation: {
      homogenizationProtocolFa: 'میکس کامل نمونه؛ در صورت وجود ذرات معلق، عبور از کاغذ صافی یا سانتریفیوژ جهت شفاف‌سازی فاز مایع.',
      pretreatmentNotesFa: 'برای رب گوجه‌فرنگی و پوره میوه: فیلتراسیون قطرات سرم شفاف روی منشور رفراکتومتر.',
      sampleMassOrVolume: 'چند قطره (حدود ۰.۲ میلی‌لیتر)',
      storageBeforeAnalysis: 'دمای ۲۰ درجه'
    },
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 3146',
      year: '1393',
      titleFa: 'فرآورده‌های میوه و سبزی - تعیین مواد جامد محلول به روش انکسارسنجی (بریکس)',
      titleEn: 'Fruit and Vegetable Products - Determination of Soluble Solids Content - Refractometric Method',
      scopeAndMatrix: 'آبمیوه‌ها، کنسانتره‌ها، مربا، رب گوجه و سس‌ها',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'ISO',
        standardNumber: 'ISO 2173:2003',
        titleFa: 'فرآورده‌های میوه و سبزی - تعیین مواد جامد محلول (رفراکتومتری)',
        titleEn: 'Fruit and vegetable products - Determination of soluble solids content - Refractometric method',
        scopeAndMatrix: 'Fruit and Vegetable Products'
      },
      {
        organization: 'AOAC',
        standardNumber: 'AOAC 932.12',
        titleFa: 'مواد جامد محلول در فرآورده‌های میوه به روش بریکس',
        titleEn: 'Solids (Soluble) in Fruit Products - Refractometer Method',
        scopeAndMatrix: 'Fruit Products'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'brx-alt-digital',
        methodNameFa: 'رفراکتومتر دیجیتال با جبران خودکار دما (Digital ATC Refractometer)',
        methodNameEn: 'Digital Refractometer with Automatic Temperature Compensation (ATC)',
        principleFa: 'استفاده از سنسور نوری دیجیتال و تصحیح خودکار ضریب شکست به دمای ۲۰ درجه بر اساس جداول ICUMSA.',
        applicableMatrixes: ['خطوط تولید نوشیدنی', 'دریافت گوجه و میوه', 'عسل'],
        standardReferences: [{ organization: 'ISO', standardNumber: 'ISO 2173', titleFa: 'رفراکتومتری دیجیتال', titleEn: 'Digital Refractometry', scopeAndMatrix: 'Juices' }],
        advantagesFa: ['حذف خطای دید اپراتور', 'اعمال خودکار تصحیح دمایی'],
        limitationsFa: ['نیاز به کالیبراسیون منظم با آب مقطر'],
        analysisTime: '۳۰ ثانیه'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-water-cal',
        nameFa: 'آب مقطر دو بار تقطیر تازه (ضریب شکست ۱.۳۳۳۰ در ۲۰ درجه)',
        nameEn: 'Double Distilled Water for Refractometer Calibration',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'آب دیونیزه با بریکس ۰.۰۰ در ۲۰ درجه'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-refractometer',
        nameFa: 'رفراکتومتر Abbe یا رفراکتومتر دیجیتال آزمایشگاهی',
        nameEn: 'Precision Laboratory Refractometer (Abbe or Digital benchtop)',
        specification: 'دقت ± ۰.۰۵ °Brix، دارای منشور ترموستات‌شده در ۲۰.۰ درجه',
        operatingTempOrParam: '۲۰.۰ ± ۰.۵ °C'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'تنظیم صفر و کالیبراسیون رفراکتومتر',
        instructionFa: 'سطح منشور شیشه‌ای را با آب مقطر و دستمال نرم تمیز کنید. ۱ تا ۲ قطره آب مقطر روی منشور قرار داده و خط مرزی را روی عدد ۰.۰۰ °Brix تنظیم کنید.',
        criticalTimeOrTemp: 'دمای منشور ۲۰.۰ °C'
      },
      {
        stepNumber: 2,
        titleFa: 'قرار دادن نمونه روی منشور',
        instructionFa: 'منشور را خشک کرده، ۲ تا ۳ قطره از نمونه صاف‌شده را بدون ایجاد حباب هوا روی منشور قرار دهید و درب آن را ببندید.',
        criticalTimeOrTemp: 'عدم ایجاد حباب هوا روی منشور'
      },
      {
        stepNumber: 3,
        titleFa: 'قرائت عدد بریکس و تصحیح دمایی',
        instructionFa: 'عدد بریکس خوانده شده و دمای آزمون را یادداشت کنید. در صورت تفاوت دما با ۲۰ درجه، تصحیح دمایی استاندارد را اعمال فرمایید.',
        criticalTimeOrTemp: 'ثبت دما به همراه بریکس'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{Corrected Brix (\\%)} = \\text{Brix}_{\\text{obs}} + \\Delta T \\times C_{\\text{temp}}',
      formulaDescriptionFa: 'بریکس تصحیح‌شده در ۲۰ درجه = بریکس خوانده‌شده + فاکتور تصحیح دمایی (در صورتی که دستگاه ATC نداشته باشد)',
      variables: [
        { symbol: 'Brix_obs', descriptionFa: 'بریکس خوانده‌شده در دمای آزمون (°Brix)', unit: '°Brix', defaultValue: 12.40 },
        { symbol: 'Temp', descriptionFa: 'دمای اندازه‌گیری (°C)', unit: '°C', defaultValue: 23.5 }
      ],
      unitResult: '°Brix (% m/m)',
      significantFigures: 1,
      roundingRuleFa: 'گرد کردن به یک رقم اعشار',
      acceptableRSDPercent: 0.5
    },
    qualityControl: {
      reagentBlankRequirementFa: 'صفر کردن با آب مقطر قبل از هر سری قرائت.',
      certifiedReferenceMaterialCRM: 'محلول‌های استاندارد ساکارز گواهی‌شده (۱۰٪، ۲۰٪، ۵۰٪ بریکس).',
      expectedRecoveryRangePercent: { min: 99.5, max: 100.5 },
      repeatabilityLimit_r: 'اختلاف دو قرائت متوالی نباید از ۰.۱ °Brix تجاوز کند.',
      criticalControlCheckpoints: [
        'تمیز کردن کامل منشور با آب مقطر و خشک کردن بدون خراشیدن شیشه منشور'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'مات و تار بودن خط تفکیک نور و سایه در چشمی رفراکتومتر',
        probableCausesFa: ['وجود ذرات معلق، چربی، حباب هوا یا خراش روی منشور'],
        investigationStepsFa: ['بررسی تمیزی منشور'],
        correctiveAndPreventiveActionFa: 'فیلتراسیون بهتر نمونه و تمیز کردن سطح منشور با الکل و دستمال لنز بدون پرز.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'کالیبراسیون و قرائت بریکس',
        descriptionFa: 'تنظیم صفر و ثبت بریکس نمونه',
        instructions: [
          'منشور را با آب مقطر صفر کنید.',
          'نمونه را قرار داده و عدد بریکس و دما را ثبت کنید.'
        ],
        equipmentUsed: ['رفراکتومتر آزمایشگاهی'],
        reagentsUsed: ['آب مقطر'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'Brix_obs', nameFa: 'عدد بریکس خوانده‌شده', paramType: 'refractive_index', expectedUnit: '°Brix', required: true, minValue: 0.0, maxValue: 95.0, decimalPrecision: 2 },
          { id: 'Temp', nameFa: 'دمای منشور (°C)', paramType: 'temperature', expectedUnit: '°C', required: true, minValue: 10.0, maxValue: 40.0, defaultValue: 20.0 }
        ]
      }
    ]
  }
];
