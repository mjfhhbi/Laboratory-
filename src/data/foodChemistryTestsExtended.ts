import { FoodChemistryTest } from '../types/foodChemistry';

export const FOOD_CHEMISTRY_TESTS_EXTENDED: FoodChemistryTest[] = [
  // 8. CRUDE FIBER & TOTAL DIETARY FIBER (TDF)
  {
    id: 'chem-fiber-tdf',
    code: 'CHEM-FBR-01',
    analyteFa: 'فیبر رژیمی کل و فیبر خام (Total Dietary Fiber & Crude Fiber)',
    analyteEn: 'Total Dietary Fiber by Enzymatic-Gravimetric Method & Crude Fiber',
    titleFa: 'تعیین فیبر رژیمی کل (TDF) به روش آنزیمی-وزن‌سنجی و فیبر خام',
    titleEn: 'Determination of Total Dietary Fiber (TDF) and Crude Fiber in Foods',
    category: 'proximate_fiber',
    sectorCompatibility: ['cereal', 'bakery', 'fruits_veg', 'confectionery'],
    objectiveFa: 'اندازه‌گیری دقیق پلی‌ساکاریدهای غیرنشاسته‌ای و لیگنین جهت درج در جدول حقایق تغذیه‌ای و کنترل کیفیت غلات.',
    chemicalPrincipleFa: 'روش آنزیمی-وزن‌سنجی (AOAC 991.43): هضم پی‌درپی نشاسته و پروتئین نمونه چربی‌گیری‌شده با آنزیم‌های آلفا-آمیلاز مقاوم به حرارت، پروتئاز و آمیلوگلوکوزیداز در دما و pH کنترل‌شده، رسوب‌دهی فیبرهای محلول با اتانول ۹۵٪، فیلتراسیون، توزین باقیمانده و تصحیح مقادیر پروتئین باقیمانده (کجلدال) و خاکستر (کوره ۵۲۵ درجه).',
    samplePreparation: {
      homogenizationProtocolFa: 'آسیاب تا اندازه ذرات کمتر از ۰.۳ میلی‌متر و چربی‌گیری با پترولیوم اتر در صورت چربی بالای ۵٪.',
      sampleMassOrVolume: '۱.۰۰۰۰ گرم با دقت ۰.۰۰۰۱ گرم (دو سری تکرار)',
      storageBeforeAnalysis: 'دسیکاتور'
    },
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 12437',
      year: '1390',
      titleFa: 'فرآورده‌های غذایی - تعیین فیبر رژیمی کل به روش آنزیمی-وزن‌سنجی',
      titleEn: 'Food Products - Determination of Total Dietary Fiber by Enzymatic-Gravimetric Method',
      scopeAndMatrix: 'غلات، نان، حبوبات، میوه‌ها و فرآورده‌های غذایی غنی‌شده با فیبر',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'AOAC',
        standardNumber: 'AOAC 991.43',
        titleFa: 'فیبر رژیمی کل، محلول و نامحلول در غذاها',
        titleEn: 'Total, Soluble, and Insoluble Dietary Fiber in Foods',
        scopeAndMatrix: 'General Food Products'
      },
      {
        organization: 'AOAC',
        standardNumber: 'AOAC 978.10',
        titleFa: 'فیبر خام به روش ونده (Weende Crude Fiber)',
        titleEn: 'Fiber (Crude) in Animal Feed and Flour',
        scopeAndMatrix: 'Animal Feed and Grains'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'fbr-alt-crude',
        methodNameFa: 'فیبر خام به روش ونده (Weende Crude Fiber Method)',
        methodNameEn: 'Weende Crude Fiber by Acid & Alkali Digestion',
        principleFa: 'هضم متوالی نمونه چربی‌گیری‌شده با اسید سولفوریک رقیق ۱.۲۵٪ و سدیم هیدروکسید ۱.۲۵٪ جوشان، فیلتراسیون و توزین قبل و بعد از کوره ۵۵۰ درجه.',
        applicableMatrixes: ['خوراک دام و طیور', 'سبوس خام', 'غلات و آرد سنتی'],
        standardReferences: [{ organization: 'INSO', standardNumber: 'INSO 3105', titleFa: 'تعیین فیبر خام به روش ونده', titleEn: 'Crude Fiber Determination', scopeAndMatrix: 'Feed and Grains' }],
        advantagesFa: ['هزینه کم و عدم نیاز به کیت آنزیمی گران‌قیمت'],
        limitationsFa: ['تخریب و حذف بخشی از همی‌سلولز و کل فیبرهای محلول (دست کم گرفتن مقدار واقعی فیبر)'],
        analysisTime: '۳ ساعت'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-enzymes-tdf',
        nameFa: 'کیت آنزیمی TDF (آلفا-آمیلاز مقاوم به حرارت، پروتئاز و آمیلوگلوکوزیداز)',
        nameEn: 'Dietary Fiber Assay Enzyme Kit (Termamyl, Protease, AMG)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'آنزیم‌های با خلوص بالا فاقد فعالیت سلولازی'
      },
      {
        id: 'rg-ethanol-95',
        nameFa: 'اتانول ۹۵٪ و ۷۸٪ حجمی/حجمی',
        nameEn: 'Ethanol 95% and 78% (v/v)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حلال رسوب‌دهنده پلی‌ساکاریدهای محلول'
      },
      {
        id: 'rg-celite',
        nameFa: 'کمک‌صافی خاک دیاتومه (Celite 545 اسیدشویی‌شده)',
        nameEn: 'Acid-Washed Celite 545 Filter Aid',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'تکلیس‌شده در کوره ۵۲۵ درجه'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-fiber-analyzer',
        nameFa: 'سیستم فیلتراسیون و هضم آنزیمی فیبر رژیمی',
        nameEn: 'Dietary Fiber Filtration and Digestion System',
        specification: 'حمام آب شیکردار ترموستات در دمای ۶۰ و ۱۰۰ درجه، بوته‌های بوخنر شیشه‌ای شات با تخلخل G2'
      },
      {
        id: 'eq-muffle-525',
        nameFa: 'کوره الکتریکی ۵۲۵ درجه',
        nameEn: 'Muffle Furnace at 525°C'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'هضم آنزیمی سه‌مرحله‌ای نمونه',
        instructionFa: 'یک گرم نمونه چربی‌گیری‌شده را در بافر فسفات pH=6.0 سوسپانسیون کرده، با آلفا-آمیلاز در ۹۵-۱۰۰ درجه به مدت ۳۰ دقیقه، سپس با پروتئاز در ۶۰ درجه (pH=7.5) به مدت ۳۰ دقیقه و در نهایت با آمیلوگلوکوزیداز در ۶۰ درجه (pH=4.5) به مدت ۳۰ دقیقه هضم کنید.',
        criticalTimeOrTemp: '۹۵ درجه ۳۰ دقیقه، سپس ۶۰ درجه'
      },
      {
        stepNumber: 2,
        titleFa: 'رسوب‌دهی با اتانول و فیلتراسیون',
        instructionFa: 'چهار برابر حجم مخلوط اتانول ۹۵٪ گرم (۶۰ درجه) اضافه کرده و اجازه دهید ۱ ساعت رسوب فیبر تشکیل شود. مخلوط را از بوته شیشه‌ای حاوی سلیت عبور داده و با اتانول و استون شستشو دهید.',
        criticalTimeOrTemp: '۱ ساعت رسوب‌دهی'
      },
      {
        stepNumber: 3,
        titleFa: 'خشک کردن، توزین و تصحیح پروتئین و خاکستر',
        instructionFa: 'بوته را در آون ۱۰۵ درجه خشک و وزن کنید (R). یک سری از تکرارها را برای سنجش پروتئین به روش کجلدال (P) و سری دیگر را برای خاکستر در کوره ۵۲۵ درجه (A) آنالیز کنید. آزمون بلانک آنزیم‌ها را نیز به همین ترتیب محاسبه کنید (B).',
        criticalTimeOrTemp: '۱۰۵ درجه و کوره ۵۲۵ درجه'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{TDF (\\%)} = \\frac{\\frac{R_1 + R_2}{2} - P - A - B}{\\frac{m_1 + m_2}{2}} \\times 100',
      formulaDescriptionFa: 'درصد فیبر رژیمی کل = ((میانگین وزن باقیمانده خشک منهای پروتئین منهای خاکستر منهای بلانک آنزیم‌ها) تقسیم بر میانگین وزن نمونه اولیه) ضربدر ۱۰۰',
      variables: [
        { symbol: 'R_avg', descriptionFa: 'میانگین وزن باقیمانده فیبر خشک در دو تکرار (گرم)', unit: 'g', defaultValue: 0.1250 },
        { symbol: 'P', descriptionFa: 'وزن پروتئین موجود در باقیمانده (گرم)', unit: 'g', defaultValue: 0.0120 },
        { symbol: 'A', descriptionFa: 'وزن خاکستر موجود در باقیمانده (گرم)', unit: 'g', defaultValue: 0.0080 },
        { symbol: 'B', descriptionFa: 'وزن باقیمانده بلانک معرف‌ها و آنزیم‌ها (گرم)', unit: 'g', defaultValue: 0.0040 },
        { symbol: 'm_avg', descriptionFa: 'میانگین وزن نمونه اولیه (گرم)', unit: 'g', defaultValue: 1.0000 }
      ],
      unitResult: '% (g/100g)',
      significantFigures: 2,
      roundingRuleFa: 'گرد کردن به دو رقم اعشار',
      acceptableRSDPercent: 3.0
    },
    qualityControl: {
      reagentBlankRequirementFa: 'اجرای کامل بلانک شاهد حاوی آنزیم‌ها و بافرها بدون نمونه جهت محاسبه وزن پروتئین و خاکستر خود آنزیم‌ها.',
      certifiedReferenceMaterialCRM: 'استفاده از نمونه استاندارد کلوئیدی ذرت یا بتاگلوکان استاندارد با TDF گواهی‌شده.',
      expectedRecoveryRangePercent: { min: 95.0, max: 105.0 },
      repeatabilityLimit_r: 'اختلاف دو تکرار همزمان نباید از ۵٪ میانگین بیشتر شود.',
      criticalControlCheckpoints: [
        'کنترل دقیق pH در هر مرحله از افزودن آنزیم‌ها',
        'تست عدم وجود فعالیت کاتالیتیکی سلولازی در آنزیم‌ها با استفاده از نمونه سلولز استاندارد'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'گرفتگی شدید و کند شدن فیلتراسیون در بوته شات گلاس',
        probableCausesFa: ['عدم توزیع یکنواخت خاک دیاتومه (Celite) یا هضم ناقص نشاسته'],
        investigationStepsFa: ['بررسی دمای حمام آب در مرحله اول هضم (باید بالای ۹۵ درجه باشد)'],
        correctiveAndPreventiveActionFa: 'شستشوی بوته با آب جوش، اطمینان از عملکرد آلفا-آمیلاز و اعمال خلاء ملایم و یکنواخت.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'هضم آنزیمی و فیلتراسیون',
        descriptionFa: 'ثبت وزن اولیه نمونه و باقیمانده خشک',
        instructions: [
          'یک گرم نمونه را وزن کرده و مراحل هضم با سه آنزیم را انجام دهید (m).',
          'رسوب را فیلتر کرده و پس از خشک‌کردن در آون ۱۰۵ درجه وزن باقیمانده را ثبت کنید (R).'
        ],
        equipmentUsed: ['سیستم هضم فیبر', 'آون ۱۰۵ درجه', 'ترازوی ۴ رقم'],
        reagentsUsed: ['کیت آنزیمی TDF', 'اتانول ۹۵٪', 'سلیت ۵۴۵'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'm', nameFa: 'وزن نمونه اولیه (m)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 0.5, maxValue: 2.0, decimalPrecision: 4 },
          { id: 'R', nameFa: 'وزن باقیمانده رسوب فیبر (R)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 0.01, maxValue: 1.0, decimalPrecision: 4 }
        ]
      },
      {
        stepNumber: 2,
        titleFa: 'تصحیح پروتئین و خاکستر باقیمانده',
        descriptionFa: 'ثبت مقادیر پروتئین و خاکستر باقیمانده',
        instructions: [
          'پروتئین باقیمانده را به روش کجلدال اندازه‌گیری و ثبت کنید (P).',
          'خاکستر باقیمانده را با کوره ۵۲۵ درجه اندازه‌گیری و ثبت کنید (A).',
          'مقدار بلانک شاهد را نیز ثبت فرمایید (B).'
        ],
        equipmentUsed: ['دستگاه کجلدال', 'کوره ۵۲۵ درجه'],
        reagentsUsed: [],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'P', nameFa: 'وزن پروتئین در رسوب (P)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 0.0, maxValue: 0.2, decimalPrecision: 4 },
          { id: 'A', nameFa: 'وزن خاکستر در رسوب (A)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 0.0, maxValue: 0.2, decimalPrecision: 4 },
          { id: 'B', nameFa: 'وزن بلانک معرف‌ها (B)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 0.0, maxValue: 0.1, decimalPrecision: 4 }
        ]
      }
    ]
  },

  // 9. REDUCING & TOTAL SUGARS (LANE-EYNON)
  {
    id: 'chem-sugars-lane-eynon',
    code: 'CHEM-SGR-01',
    analyteFa: 'قندهای احیاکننده و قند کل (Reducing & Total Invert Sugars)',
    analyteEn: 'Reducing and Total Sugars by Lane-Eynon Copper Reduction Titration',
    titleFa: 'تعیین قندهای احیاکننده و قند کل به روش مس‌سنجی لین-آینون (Lane-Eynon)',
    titleEn: 'Determination of Reducing and Total Invert Sugars by Lane-Eynon Method',
    category: 'carbohydrates_sugars',
    sectorCompatibility: ['confectionery', 'beverages', 'fruits_veg', 'dairy', 'bakery'],
    objectiveFa: 'اندازه‌گیری درصد قندهای احیاکننده مستقیم (گلوکز، فروکتوز، لاکتوز، مالتوز) و قند کل پس از وارون‌سازی اسیدی (انورت کردن ساکارز).',
    chemicalPrincipleFa: 'احیای یون‌های مس دو ظرفیتی آبی‌رنگ محلول فهلینگ (Fehling A & B شامل سولفات مس و تارترات سدیم پتاسیم در محیط قلیایی) به اکسید مس یک ظرفیتی رسوب قرمز آجری (Cu2O) در دمای جوش. نقطه پایانی با بیرنگ شدن شناساگر متیلن بلو در حالت جوش کامل مشخص می‌گردد.',
    samplePreparation: {
      homogenizationProtocolFa: 'عصاره‌گیری قند با آب مقطر در حمام آب گرم و شفاف‌سازی با استات روی و فروسیانید پتاسیم (معرف‌های کارز ۱ و ۲ - Carrez Solutions) جهت رسوب پروتئین‌ها و رنگ‌ها.',
      pretreatmentNotesFa: 'برای قند کل: وارون‌سازی اسیدی با اسید کلریدریک غلیظ در حمام آب گرم ۶۸-۷۰ درجه به مدت ۵ دقیقه و سپس خنثی‌سازی با سدیم هیدروکسید.',
      sampleMassOrVolume: '۵.۰۰۰ تا ۱۰.۰۰۰ گرم رقیق‌شده در بالن ۲۵۰ میلی‌لیتر',
      storageBeforeAnalysis: 'دمای ۴ درجه'
    },
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 3005',
      year: '1393',
      titleFa: 'فرآورده‌های غذایی و قنادی - تعیین قندهای احیاکننده و کل به روش لین-آینون',
      titleEn: 'Food Products - Determination of Reducing and Total Sugars - Lane and Eynon',
      scopeAndMatrix: 'آبمیوه‌ها، عسل، مربا، بیسکویت، شکلات و نبات',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'AOAC',
        standardNumber: 'AOAC 923.09',
        titleFa: 'قندهای احیاکننده در غذاها به روش لین-آینون',
        titleEn: 'Invert Sugar in Sugars and Syrups - Lane-Eynon General Volumetric Method',
        scopeAndMatrix: 'Syrups, Sugars, Jams'
      },
      {
        organization: 'ISO',
        standardNumber: 'ISO 5377:1981',
        titleFa: 'فرآورده‌های نشاسته‌ای - تعیین قندهای احیاکننده به روش لوف-شورل',
        titleEn: 'Starch hydrolysis products - Determination of reducing power',
        scopeAndMatrix: 'Glucose syrups'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'sgr-alt-polarimeter',
        methodNameFa: 'پلاریمتری ساکارز (Polarimetric Sucrose Assay)',
        methodNameEn: 'Polarimetry for Sucrose (ICUMSA GS2/3-1)',
        principleFa: 'اندازه‌گیری زاویه چرخش نور پلاریزه ناشی از محلول شفاف قند در لوله پلاریمتر در طول موج ۵۸۹.۳ نانومتر (خط D سدیم).',
        applicableMatrixes: ['شکر سفید', 'نبات', 'شکر خام و نیشکر'],
        standardReferences: [{ organization: 'INSO', standardNumber: 'INSO 3006', titleFa: 'تعیین ساکارز به روش پلاریمتری', titleEn: 'Sucrose by Polarimetry', scopeAndMatrix: 'Sugar' }],
        advantagesFa: ['بسیار سریع و بدون نیاز به تیتراسیون جوشان'],
        limitationsFa: ['تداخل شدید در حضور سایر قندهای فعال نوری'],
        analysisTime: '۵ دقیقه'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-fehling-ab',
        nameFa: 'محلول‌های فهلینگ A (سولفات مس) و فهلینگ B (تارترات قلیایی)',
        nameEn: 'Fehling Solutions A (CuSO4) and B (Alkaline Potassium Sodium Tartrate)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'فهلینگ A: ۶۹.۲۸ گرم سولفات مس در ۱ لیتر؛ فهلینگ B: ۳۴۶ گرم تارترات سدیم پتاسیم و ۱۰۰ گرم سود در ۱ لیتر'
      },
      {
        id: 'rg-carrez',
        nameFa: 'معرف‌های شفاف‌ساز کارز ۱ و کارز ۲ (Carrez I & II)',
        nameEn: 'Carrez Clarification Solutions I (Zinc Acetate) & II (Potassium Ferrocyanide)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'کارز ۱: ۲۱.۹ گرم زینک استات + ۳ میلی‌لیتر اسید استیک در ۱۰۰ میلی‌لیتر؛ کارز ۲: ۱۰.۶ گرم پتاسیم فروسیانید در ۱۰۰ میلی‌لیتر'
      },
      {
        id: 'rg-methylene-blue',
        nameFa: 'شناساگر متیلن بلو ۰.۲٪ در آب مقطر',
        nameEn: 'Methylene Blue Indicator 0.2%',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حل کردن ۰.۲ گرم در ۱۰۰ میلی‌لیتر آب'
      },
      {
        id: 'rg-invert-sugar-std',
        nameFa: 'محلول استاندارد قند انورت ۰.۵٪ (Invert Sugar Standard)',
        nameEn: 'Standard Invert Sugar Solution 0.500%',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'تهیه شده از ساکارز خالص آنالیتیکال با خلوص ۹۹.۹٪'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-hotplate-lane',
        nameFa: 'هیتر برقی آزمایشگاهی با کنترل دقیق جوش',
        nameEn: 'Laboratory Electric Hotplate for Boiling Titration',
        specification: 'تثبیت جوش مداوم بدون تاخیر'
      },
      {
        id: 'eq-burette-lane',
        nameFa: 'بورت تیتراسیون ۵۰ میلی‌لیتر با نوک باریک کشیده',
        nameEn: 'Titration Burette 50 mL with Extended Offset Tip'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'استانداردسازی و تعیین فاکتور فهلینگ',
        instructionFa: '۵ میلی‌لیتر فهلینگ A و ۵ میلی‌لیتر فهلینگ B را در ارلن مخلوط کرده، به جوش آورید و با محلول استاندارد قند انورت ۰.۵٪ در حضور ۳ قطره متیلن بلو تا بی‌رنگ شدن رنگ آبی و ظهور رسوب قرمز آجری تیتر کنید و فاکتور (F) را ثبت کنید.',
        criticalTimeOrTemp: 'جوش مداوم در تمام طول تیتراسیون'
      },
      {
        stepNumber: 2,
        titleFa: 'تیتراسیون قند احیاکننده مستقیم نمونه',
        instructionFa: '۱۰ میلی‌لیتر محلول فهلینگ مخلوط را در ارلن به جوش آورده و با عصاره شفاف‌شده نمونه در بورت تا تغییر رنگ متیلن بلو تیتر کنید (V1).',
        criticalTimeOrTemp: 'حفظ جوش آرام'
      },
      {
        stepNumber: 3,
        titleFa: 'انورت‌سازی اسیدی و تیتراسیون قند کل',
        instructionFa: '۵۰ میلی‌لیتر از عصاره نمونه را با ۵ میلی‌لیتر اسید کلریدریک غلیظ در حمام آب گرم ۶۸ درجه به مدت ۵ دقیقه قرار داده، خنک کرده و با سود خنثی کنید و به حجم ۱۰۰ برسانید. تیتراسیون فهلینگ را تکرار کنید (V2).',
        criticalTimeOrTemp: '۶۸-۷۰ درجه به مدت ۵ دقیقه'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{Reducing Sugar (\\%)} = \\frac{F \\times V_{\\text{total}} \\times 100}{V_1 \\times m \\times 1000}',
      formulaDescriptionFa: 'درصد قند احیاکننده = (فاکتور فهلینگ F (میلی‌گرم قند) ضربدر حجم کل عصاره) تقسیم بر (حجم مصرفی عصاره در تیتراسیون V1 ضربدر وزن نمونه اولیه ضربدر ۱۰)',
      variables: [
        { symbol: 'F', descriptionFa: 'فاکتور فهلینگ (میلی‌گرم قند انورت معادل ۱۰ میلی‌لیتر فهلینگ)', unit: 'mg', defaultValue: 51.2 },
        { symbol: 'V1', descriptionFa: 'حجم عصاره مصرفی در تیتراسیون قند مستقیم (mL)', unit: 'mL', defaultValue: 16.40 },
        { symbol: 'V2', descriptionFa: 'حجم عصاره مصرفی در تیتراسیون قند کل انورت‌شده (mL)', unit: 'mL', defaultValue: 8.20 },
        { symbol: 'V_total', descriptionFa: 'حجم بالن رقیق‌سازی اولیه نمونه (mL)', unit: 'mL', defaultValue: 250 },
        { symbol: 'm', descriptionFa: 'وزن نمونه اولیه (گرم)', unit: 'g', defaultValue: 5.000 }
      ],
      unitResult: '% (g/100g)',
      significantFigures: 2,
      roundingRuleFa: 'گرد کردن به دو رقم اعشار',
      acceptableRSDPercent: 1.5
    },
    qualityControl: {
      reagentBlankRequirementFa: 'استانداردسازی روزانه مخلوط فهلینگ با محلول استاندارد قند انورت جهت تعیین فاکتور F.',
      expectedRecoveryRangePercent: { min: 98.0, max: 102.0 },
      repeatabilityLimit_r: 'اختلاف دو تکرار همزمان نباید بیش از ۰.۲ گرم در ۱۰۰ گرم باشد.',
      criticalControlCheckpoints: [
        'حفظ وضعیت جوش مداوم در زمان افزودن قطرات قند از بورت (اکسیژن هوا مس را مجدداً اکسید می‌کند)'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'برگشت مجدد رنگ آبی متیلن بلو پس از چند ثانیه از قطع شعله',
        probableCausesFa: ['اکسیداسیون مجدد اکسید مس یک‌ظرفیتی توسط اکسیژن هوای محیط'],
        investigationStepsFa: ['تیتراسیون در دهانه ارلن در حال خروج بخار'],
        correctiveAndPreventiveActionFa: 'نقطه پایانی را دقیقاً در حالت جوش فعال و پیش از خاموش کردن هیتر ثبت کنید.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'تیتراسیون قند احیاکننده مستقیم',
        descriptionFa: 'ثبت حجم مصرفی عصاره برای قند مستقیم',
        instructions: [
          '۱۰ میلی‌لیتر فهلینگ A+B را جوشانده و با عصاره نمونه تیتر کنید (V1).',
          'فاکتور فهلینگ استاندارد را وارد نمایید (F).'
        ],
        equipmentUsed: ['بورت تیتراسیون', 'هیتر برقی جوشان'],
        reagentsUsed: ['محلول‌های فهلینگ A و B', 'متیلن بلو ۰.۲٪'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'V1', nameFa: 'حجم مصرفی قند احیاکننده (V1)', paramType: 'volume', expectedUnit: 'mL', required: true, minValue: 1.0, maxValue: 50.0, decimalPrecision: 2 },
          { id: 'F', nameFa: 'فاکتور استاندارد فهلینگ (F)', paramType: 'numeric', expectedUnit: 'mg', required: true, minValue: 45.0, maxValue: 55.0, defaultValue: 51.2 }
        ]
      },
      {
        stepNumber: 2,
        titleFa: 'تیتراسیون قند کل پس از وارون‌سازی (Inversion)',
        descriptionFa: 'ثبت حجم مصرفی برای قند کل',
        instructions: [
          'پس از هیدرولیز اسیدی و خنثی‌سازی، تیتراسیون قند کل را انجام دهید (V2).'
        ],
        equipmentUsed: ['بورت تیتراسیون'],
        reagentsUsed: ['اسید کلریدریک', 'سود خنثی‌ساز'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'V2', nameFa: 'حجم مصرفی قند کل انورت‌شده (V2)', paramType: 'volume', expectedUnit: 'mL', required: true, minValue: 1.0, maxValue: 50.0, decimalPrecision: 2 }
        ]
      }
    ]
  },

  // 10. ANTHOCYANINS PIGMENT (pH DIFFERENTIAL)
  {
    id: 'chem-pigments-anthocyanins',
    code: 'CHEM-PGM-01',
    analyteFa: 'رنگدانه‌های آنتوسیانین کل (Total Monomeric Anthocyanins)',
    analyteEn: 'Total Monomeric Anthocyanin Pigment by pH Differential Spectrophotometry',
    titleFa: 'تعیین رنگدانه‌های آنتوسیانین به روش اسپکتروفتومتری تفاضلی pH',
    titleEn: 'Determination of Total Monomeric Anthocyanin by pH Differential Method',
    category: 'pigments_colorants',
    sectorCompatibility: ['fruits_veg', 'beverages', 'confectionery'],
    objectiveFa: 'اندازه‌گیری غلظت رنگدانه‌های آنتوسیانین مونومریک در میوه‌های قرمز-بنفش (انار، آلبالو، توت‌فرنگی، انگور قرمز) و آبمیوه‌ها بر حسب سیانیدین-۳-گلوکوزید.',
    chemicalPrincipleFa: 'روش تفاضلی AOAC 2005.02: رنگدانه‌های آنتوسیانین در pH = 1.0 به فرم کاتیون اکزونیوم رنگی (Flavylium cation) با حداکثر جذب نوری در ۵۲۰ نانومتر وجود دارند، در حالی که در pH = 4.5 به فرم همی‌استال کربینول بدون رنگ (Hemiacetal) تبدیل می‌شوند. تفاضل جذب نوری در ۵۲۰ و ۷۰۰ نانومتر در این دو pH مستقیماً متناسب با غلظت آنتوسیانین خالص است.',
    samplePreparation: {
      homogenizationProtocolFa: 'عصاره‌گیری با متانول/اتانول اسیدی‌شده (حاوی ۰.۱٪ HCl) یا سانتریفیوژ آبمیوه در ۴۰۰۰ دور به مدت ۱۵ دقیقه.',
      sampleMassOrVolume: '۲ الی ۵ میلی‌لیتر عصاره شفاف',
      storageBeforeAnalysis: 'ظرف تیره در فریزر منفی ۲۰ درجه دور از نور'
    },
    primaryStandard: {
      organization: 'AOAC',
      standardNumber: 'AOAC 2005.02',
      year: '2005',
      titleFa: 'رنگدانه‌های آنتوسیانین مونومریک کل در آبمیوه‌ها، نوشیدنی‌ها و محصولات طبیعی',
      titleEn: 'Total Monomeric Anthocyanin Pigment Content of Fruit Juices, Beverages, Natural Colorants',
      scopeAndMatrix: 'Fruit juices, Red wine, Berry concentrates',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'INSO',
        standardNumber: 'INSO 5568',
        titleFa: 'آبمیوه‌ها و فرآورده‌های میوه - تعیین رنگدانه‌ها',
        titleEn: 'Fruit Juices - Determination of Anthocyanin Pigments',
        scopeAndMatrix: 'Fruit Juices'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'pgm-alt-hplc',
        methodNameFa: 'کروماتوگرافی مایع با کارایی بالا (HPLC-DAD)',
        methodNameEn: 'HPLC with Diode Array Detector (DAD) at 520 nm',
        principleFa: 'تفکیک اختصاصی انواع آنتوسیانین‌ها (سیانیدین، دلفینیدین، پلارگونیدین، مالویدین و پئونیدین) با ستون C18 فاز معکوس.',
        applicableMatrixes: ['کنسانتره انار و آلبالو', 'عصاره‌های دارویی گیاهی'],
        standardReferences: [{ organization: 'ISO', standardNumber: 'ISO 13496', titleFa: 'آنالیز HPLC آنتوسیانین‌ها', titleEn: 'Anthocyanins by HPLC', scopeAndMatrix: 'Plant extracts' }],
        advantagesFa: ['شناسایی پروفایل انگشت‌نگاری و تشخیص تقلب افزودن رنگ سنتزی یا آب انگور به آب انار'],
        limitationsFa: ['هزینه بالا و زمان آنالیز طولانی'],
        analysisTime: '۳۰ دقیقه'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-buffer-ph1',
        nameFa: 'بافر پتاسیم کلرید pH = 1.0 (0.025 M KCl)',
        nameEn: 'Potassium Chloride Buffer pH 1.0 (0.025 M)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حل کردن ۱.۸۶ گرم KCl در ۹۸۰ میلی‌لیتر آب، تنظیم pH روی ۱.۰ ± ۰.۰۵ با HCl'
      },
      {
        id: 'rg-buffer-ph45',
        nameFa: 'بافر سدیم استات pH = 4.5 (0.4 M CH3COONa)',
        nameEn: 'Sodium Acetate Buffer pH 4.5 (0.4 M)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حل کردن ۵۴.۴۳ گرم سدیم استات تری‌هیدرات در ۹۶۰ میلی‌لیتر آب، تنظیم pH روی ۴.۵ ± ۰.۰۵ با اسید استیک'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-spectrophotometer-uv',
        nameFa: 'اسپکتروفتومتر UV-Vis دو پرتویی با کووت‌های کوارتز ۱ سانتی‌متر',
        nameEn: 'Double-Beam UV-Visible Spectrophotometer with Quartz Cuvettes (1 cm)',
        specification: 'دقت طول موج ± ۰.۵ نانومتر، فتومتریک ۰.۰۰۱ Abs',
        operatingTempOrParam: 'طول موج‌های ۵۲۰ و ۷۰۰ نانومتر'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'رقیق‌سازی نمونه در بافرهای pH 1.0 و pH 4.5',
        instructionFa: 'یک حجم مشخص از عصاره شفاف (مثلاً ۱ میلی‌لیتر) را در بالن ۱۰ میلی‌لیتر با بافر pH=1.0 به حجم برسانید. همین مقدار را در بالن دیگری با بافر pH=4.5 به حجم برسانید (فاکتور رقت DF = 10).',
        criticalTimeOrTemp: '۱۵ دقیقه قرارگیری در تاریکی در دمای اتاق'
      },
      {
        stepNumber: 2,
        titleFa: 'قرائت جذب نوری در ۵۲۰ و ۷۰۰ نانومتر',
        instructionFa: 'جذب نوری هر دو محلول را در طول موج ۵۲۰ نانومتر (پیک جذبی فلاویلیوم) و ۷۰۰ نانومتر (تصحیح ماتی و کدورت) در برابر کووت بلانک آب مقطر اندازه‌گیری کنید.',
        criticalTimeOrTemp: 'اندازه‌گیری ظرف ۲۰ تا ۵۰ دقیقه پس از رقیق‌سازی'
      }
    ],
    calculationRules: {
      formulaLatex: 'A = (A_{520} - A_{700})_{\\text{pH 1.0}} - (A_{520} - A_{700})_{\\text{pH 4.5}}, \\quad \\text{Anthocyanin (mg/L)} = \\frac{A \\times MW \\times DF \\times 1000}{\\epsilon \\times l}',
      formulaDescriptionFa: 'غلظت آنتوسیانین (mg/L) = (جذب نوری خالص A ضربدر وزن مولکولی ۴۴۹.۲ ضربدر ضریب رقت DF ضربدر ۱۰۰۰) تقسیم بر (ضریب خاموشی مولی ۲۶۹۰۰ ضربدر طول مسیر کووت ۱ سانتی‌متر)',
      variables: [
        { symbol: 'A520_pH1', descriptionFa: 'جذب نوری در ۵۲۰ نانومتر در بافر pH=1.0', unit: 'Abs', defaultValue: 0.852 },
        { symbol: 'A700_pH1', descriptionFa: 'جذب نوری در ۷۰۰ نانومتر در بافر pH=1.0 (کدورت)', unit: 'Abs', defaultValue: 0.024 },
        { symbol: 'A520_pH45', descriptionFa: 'جذب نوری در ۵۲۰ نانومتر در بافر pH=4.5', unit: 'Abs', defaultValue: 0.120 },
        { symbol: 'A700_pH45', descriptionFa: 'جذب نوری در ۷۰۰ نانومتر در بافر pH=4.5 (کدورت)', unit: 'Abs', defaultValue: 0.022 },
        { symbol: 'DF', descriptionFa: 'فاکتور رقت‌سازی (Dilution Factor)', unit: 'Factor', defaultValue: 10 },
        { symbol: 'MW', descriptionFa: 'وزن مولکولی سیانیدین-۳-گلوکوزید (Cyanidin-3-glucoside)', unit: 'g/mol', defaultValue: 449.2 },
        { symbol: 'Epsilon', descriptionFa: 'ضریب جذب مولی مولی (Molar Absorptivity)', unit: 'L/mol.cm', defaultValue: 26900 }
      ],
      unitResult: 'mg/L (Cyanidin-3-glucoside equivalents)',
      significantFigures: 1,
      roundingRuleFa: 'گرد کردن به یک رقم اعشار',
      acceptableRSDPercent: 2.0
    },
    qualityControl: {
      reagentBlankRequirementFa: 'صفر کردن اسپکتروفتومتر با آب مقطر در هر دو طول موج ۵۲۰ و ۷۰۰ نانومتر.',
      expectedRecoveryRangePercent: { min: 96.0, max: 104.0 },
      repeatabilityLimit_r: 'اختلاف دو تکرار نباید از ۳٪ فراتر رود.',
      criticalControlCheckpoints: [
        'نگهداری لوله‌ها در تاریکی در فاصله بین آماده‌سازی و قرائت',
        'اطمینان از قرار داشتن جذب نوری خوانده‌شده در دامنه خطی ۰.۲ تا ۱.۲'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'جذب نوری بالاتر از ۱.۵ در طول موج ۵۲۰ نانومتر',
        probableCausesFa: ['غلظت بسیار بالای رنگدانه و خروج از دامنه خطی قانون بیر-لامبرت'],
        investigationStepsFa: ['بررسی شدت رنگ محلول رقیق‌شده'],
        correctiveAndPreventiveActionFa: 'افزایش ضریب رقت (مثلاً DF=20 یا DF=50) با بافرهای مربوطه تا قرارگیری جذب بین ۰.۲ تا ۰.۸.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'قرائت جذب نوری در pH 1.0 و pH 4.5',
        descriptionFa: 'ثبت جذب‌های اسپکتروفتومتری',
        instructions: [
          'جذب نمونه در pH=1.0 را در ۵۲۰ و ۷۰۰ نانومتر ثبت کنید.',
          'جذب نمونه در pH=4.5 را در ۵۲۰ و ۷۰۰ نانومتر ثبت کنید.'
        ],
        equipmentUsed: ['اسپکتروفتومتر UV-Vis'],
        reagentsUsed: ['بافر pH 1.0', 'بافر pH 4.5'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'A520_pH1', nameFa: 'جذب ۵۲۰nm در pH=1.0', paramType: 'absorbance', expectedUnit: 'Abs', required: true, minValue: 0.05, maxValue: 2.0, decimalPrecision: 3 },
          { id: 'A700_pH1', nameFa: 'جذب ۷۰۰nm در pH=1.0', paramType: 'absorbance', expectedUnit: 'Abs', required: true, minValue: 0.0, maxValue: 0.2, decimalPrecision: 3 },
          { id: 'A520_pH45', nameFa: 'جذب ۵۲۰nm در pH=4.5', paramType: 'absorbance', expectedUnit: 'Abs', required: true, minValue: 0.0, maxValue: 1.0, decimalPrecision: 3 },
          { id: 'A700_pH45', nameFa: 'جذب ۷۰۰nm در pH=4.5', paramType: 'absorbance', expectedUnit: 'Abs', required: true, minValue: 0.0, maxValue: 0.2, decimalPrecision: 3 },
          { id: 'DF', nameFa: 'ضریب رقت (DF)', paramType: 'numeric', expectedUnit: 'Factor', required: true, minValue: 1, maxValue: 500, defaultValue: 10 }
        ]
      }
    ]
  },

  // 11. ANTIOXIDANTS & PHENOLICS (FOLIN-CIOCALTEU & DPPH)
  {
    id: 'chem-antioxidants-folin',
    code: 'CHEM-AOX-01',
    analyteFa: 'ترکیبات فنولی کل و فعالیت آنتی‌اکسیدانی (TPC & DPPH)',
    analyteEn: 'Total Phenolic Content by Folin-Ciocalteu & DPPH Radical Scavenging',
    titleFa: 'تعیین فنول کل به روش فولین-سیوکالتو و مهار رادیکال آزاد DPPH',
    titleEn: 'Determination of Total Phenolics (Folin-Ciocalteu) and DPPH Assay',
    category: 'antioxidants_phenolics',
    sectorCompatibility: ['beverages', 'fruits_veg', 'spices', 'confectionery'],
    objectiveFa: 'سنجش ظرفیت آنتی‌اکسیدانی و غلظت ترکیبات پلی‌فنولی بر حسب اکی‌والان اسید گالیک (GAE mg/g) و درصد مهار رادیکال آزاد DPPH.',
    chemicalPrincipleFa: 'روش فولین-سیوکالتو (Folin-Ciocalteu): احیای کمپلکس فسفومولیبدیک-فسفوتونگستیک زردرنگ توسط ترکیبات فنولی در محیط قلیایی (سدیم کربنات ۷.۵٪) به کمپلکس اکسید مولیبدن-تنگستن آبی‌رنگ با حداکثر جذب نوری در ۷۶۵ نانومتر. روش DPPH: بیرنگ شدن رادیکال پایدار بنفش DPPH در ۵۱۷ نانومتر در اثر جذب هیدروژن از آنتی‌اکسیدان‌ها.',
    samplePreparation: {
      homogenizationProtocolFa: 'عصاره‌گیری با متانول ۸۰٪ در حمام التراسونیک به مدت ۳۰ دقیقه در دمای زیر ۴۰ درجه و فیلتراسیون با فیلتر ۰.۴۵ میکرون.',
      sampleMassOrVolume: '۱.۰۰۰ گرم در ۲۵ میلی‌لیتر حلال',
      storageBeforeAnalysis: 'فریزر منفی ۲۰ درجه در تاریکی'
    },
    primaryStandard: {
      organization: 'ISO',
      standardNumber: 'ISO 14502-1:2005',
      year: '2005',
      titleFa: 'تعیین مواد فنولی کل در چای به روش اسپکتروفتومتری فولین-سیوکالتو',
      titleEn: 'Determination of substances characteristic of green and black tea - Total polyphenols by Folin-Ciocalteu',
      scopeAndMatrix: 'Tea, Herbal infusions, Plant extracts',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'AOAC',
        standardNumber: 'AOAC Official Method 2012.23',
        titleFa: 'ظرفیت آنتی‌اکسیدانی کل محصولات غذایی',
        titleEn: 'Total Antioxidant Capacity in Food Products',
        scopeAndMatrix: 'Food and Beverages'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'aox-alt-dpph',
        methodNameFa: 'مهار رادیکال آزاد دی‌فنیل پیکریل هیدرازیل (DPPH Assay)',
        methodNameEn: 'DPPH Free Radical Scavenging Assay (% Inhibition & IC50)',
        principleFa: 'اندازه‌گیری افت جذب نوری محلول متانولی ۰.۱ میلی‌مولار DPPH در طول موج ۵۱۷ نانومتر پس از ۳۰ دقیقه انکوباسیون در تاریکی.',
        applicableMatrixes: ['اسانس‌های گیاهی', 'روغن‌های غنی از توکوفرول', 'عصاره ادویه‌جات'],
        standardReferences: [{ organization: 'AOAC', standardNumber: 'AOAC 2012.23', titleFa: 'سنجش DPPH', titleEn: 'DPPH Radical Assay', scopeAndMatrix: 'Antioxidants' }],
        advantagesFa: ['سریع‌ترین و معتبرترین روش غربالگری ظرفیت جاروب رادیکال‌های آزاد'],
        limitationsFa: ['حساسیت شدید معرف DPPH به نور و حرارت'],
        analysisTime: '۳۰ دقیقه'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-folin',
        nameFa: 'معرف فولین-سیوکالتو رقیق‌شده ۱:۱۰ (Folin-Ciocalteu Reagent 1N)',
        nameEn: 'Folin-Ciocalteu Phenol Reagent (1:10 dilution in water)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'رقیق‌سازی ۱ حجم معرف تجاری ۲ نرمال با ۹ حجم آب مقطر'
      },
      {
        id: 'rg-na2co3-75',
        nameFa: 'محلول سدیم کربنات ۷.۵٪ (Na2CO3)',
        nameEn: 'Sodium Carbonate Solution 7.5% (w/v)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حل کردن ۷.۵ گرم سدیم کربنات بی‌آب در ۱۰۰ میلی‌لیتر آب'
      },
      {
        id: 'rg-gallic-acid',
        nameFa: 'اسید گالیک استاندارد (Gallic Acid Standard)',
        nameEn: 'Gallic Acid Standard (0 to 100 mg/L)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'تهیه منحنی کالیبراسیون استاندارد'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-spec-765',
        nameFa: 'اسپکتروفتومتر مرئی با طول موج ۷۶۵ نانومتر',
        nameEn: 'Spectrophotometer at 765 nm & 517 nm',
        specification: 'کووت‌های پلی‌استایرن یا شیشه‌ای ۱ سانتی‌متر'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'واکنش رنگ‌زایی فولین-سیوکالتو',
        instructionFa: '۰.۵ میلی‌لیتر از عصاره رقیق‌شده را در لوله آزمایش ریخته، ۲.۵ میلی‌لیتر معرف فولین ۱۰٪ اضافه کنید و پس از ۵ دقیقه، ۲.۰ میلی‌لیتر محلول سدیم کربنات ۷.۵٪ بیفزایید. لوله را به مدت ۳۰ دقیقه در حمام آب ۴۰ درجه (یا ۹۰ دقیقه در دمای اتاق در تاریکی) قرار دهید.',
        criticalTimeOrTemp: '۳۰ دقیقه در ۴۰ درجه در تاریکی'
      },
      {
        stepNumber: 2,
        titleFa: 'قرائت جذب نوری در ۷۶۵ نانومتر',
        instructionFa: 'جذب نوری رنگ آبی تشکیل‌شده را در طول موج ۷۶۵ نانومتر در برابر بلانک شاهد (آب مقطر به جای نمونه) قرائت کنید.',
        criticalTimeOrTemp: 'طول موج ۷۶۵ nm'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{TPC (mg GAE/g)} = \\frac{C_{\\text{curve}} \\times V_{\\text{extract}} \\times DF}{m \\times 1000}',
      formulaDescriptionFa: 'فنول کل (میلی‌گرم اسید گالیک بر گرم ماده خشک) = (غلظت خوانده‌شده از منحنی کالیبراسیون C (mg/L) ضربدر حجم عصاره اولیه (L) ضربدر ضریب رقت DF) تقسیم بر وزن نمونه خشک (گرم)',
      variables: [
        { symbol: 'Abs765', descriptionFa: 'جذب نوری خوانده‌شده در ۷۶۵ نانومتر', unit: 'Abs', defaultValue: 0.485 },
        { symbol: 'Slope', descriptionFa: 'شیب منحنی کالیبراسیون اسید گالیک (Slope)', unit: '1/(mg/L)', defaultValue: 0.0095 },
        { symbol: 'Intercept', descriptionFa: 'عرض از مبدا منحنی کالیبراسیون (Intercept)', unit: 'Abs', defaultValue: 0.015 },
        { symbol: 'V_ext', descriptionFa: 'حجم عصاره اولیه (mL)', unit: 'mL', defaultValue: 25 },
        { symbol: 'm', descriptionFa: 'وزن نمونه (گرم)', unit: 'g', defaultValue: 1.000 }
      ],
      unitResult: 'mg GAE/g sample',
      significantFigures: 2,
      roundingRuleFa: 'گرد کردن به دو رقم اعشار',
      acceptableRSDPercent: 2.5
    },
    qualityControl: {
      reagentBlankRequirementFa: 'تهیه بلانک با تمام معرف‌ها و خوانش جذب نوری صفر در ۷۶۵ نانومتر.',
      certifiedReferenceMaterialCRM: 'منحنی استاندارد اسید گالیک با ضریب همبستگی R2 بالای ۰.۹۹۵.',
      expectedRecoveryRangePercent: { min: 95.0, max: 105.0 },
      repeatabilityLimit_r: 'اختلاف دو تکرار نباید از ۴٪ فراتر رود.',
      criticalControlCheckpoints: [
        'رعایت دقیق زمان انکوباسیون در تاریکی برای تمام لوله‌ها'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'تشکیل رسوب سفید شیری در لوله پس از افزودن سدیم کربنات',
        probableCausesFa: ['سرد بودن محلول سدیم کربنات یا غلظت بیش از حد نمک'],
        investigationStepsFa: ['گرم کردن ملایم لوله تا ۳۵ درجه'],
        correctiveAndPreventiveActionFa: 'استفاده از سدیم کربنات کاملاً محلول و همزدن سریع بلافاصله پس از افزودن.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'سنجش جذب نوری فولین-سیوکالتو در ۷۶۵nm',
        descriptionFa: 'ثبت جذب نوری کمپلکس آبی',
        instructions: [
          'جذب نمونه در ۷۶۵ نانومتر را در برابر بلانک شاهد ثبت کنید (Abs765).'
        ],
        equipmentUsed: ['اسپکتروفتومتر'],
        reagentsUsed: ['معرف فولین-سیوکالتو', 'سدیم کربنات ۷.۵٪'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'Abs765', nameFa: 'جذب نوری در ۷۶۵ نانومتر', paramType: 'absorbance', expectedUnit: 'Abs', required: true, minValue: 0.05, maxValue: 1.5, decimalPrecision: 3 }
        ]
      }
    ]
  },

  // 12. PEROXIDE VALUE (PV)
  {
    id: 'chem-lipids-peroxide',
    code: 'CHEM-LPD-01',
    analyteFa: 'عدد پراکسید چربی‌ها و روغن‌ها (Peroxide Value / PV)',
    analyteEn: 'Peroxide Value in Fats and Oils by Iodometric Titration',
    titleFa: 'تعیین عدد پراکسید در روغن‌ها و چربی‌های خوراکی به روش یدومتری',
    titleEn: 'Determination of Peroxide Value in Edible Fats and Oils (ISO 3960)',
    category: 'lipids_quality',
    sectorCompatibility: ['cereal', 'meat', 'bakery', 'confectionery', 'dairy'],
    objectiveFa: 'سنجش میزان محصولات اولیه اکسیداسیون لیپیدها (هیدروپراکسیدها) جهت ارزیابی تازگی، ترشیدگی و فساد اکسیداتیو روغن‌ها.',
    chemicalPrincipleFa: 'واکنش هیدروپراکسیدهای موجود در روغن با یون‌های یدید (پتاسیم یدید KI) در محیط اسیدی (اسید استیک گلاسیال و ایزواکتان/کلروفرم) و آزادسازی ید عنصری (I2). ید آزادشده با محلول استاندارد سدیم تیوسولفات (0.01 N Na2S2O3) در حضور شناساگر چسب نشاسته تیتر می‌شود.',
    samplePreparation: {
      homogenizationProtocolFa: 'مخلوط کردن روغن بدون حباب هوا؛ در صورت وجود رطوبت، خشک‌کردن با سدیم سولفات بی‌آب.',
      sampleMassOrVolume: '۵.۰۰۰ گرم با دقت ۰.۰۰۱ گرم',
      storageBeforeAnalysis: 'ظرف تیره دور از نور و اکسیژن در دمای خنک'
    },
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 4179',
      year: '1393',
      titleFa: 'روغن‌ها و چربی‌های خوراکی - تعیین عدد پراکسید (روش یدومتری)',
      titleEn: 'Animal and Vegetable Fats and Oils - Determination of Peroxide Value',
      scopeAndMatrix: 'تمام روغن‌های نباتی مایع، کره، مارگارین و روغن‌های سرخ‌کردنی',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'ISO',
        standardNumber: 'ISO 3960:2017',
        titleFa: 'چربی‌ها و روغن‌های حیوانی و نباتی - تعیین عدد پراکسید',
        titleEn: 'Animal and vegetable fats and oils - Determination of peroxide value',
        scopeAndMatrix: 'Fats and Oils'
      },
      {
        organization: 'AOCS',
        standardNumber: 'AOCS Method Cd 8b-90',
        titleFa: 'روش رسمی AOCS برای عدد پراکسید با اسید استیک و ایزواکتان',
        titleEn: 'Peroxide Value Acetic Acid-Isooctane Method',
        scopeAndMatrix: 'Edible Fats'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'lpd-alt-ferric',
        methodNameFa: 'روش اسپکتروفتومتری فریک تیوسیانات (Ferric Thiocyanate Method)',
        methodNameEn: 'Ferric Thiocyanate Spectrophotometric Method for Low PV',
        principleFa: 'اکسیداسیون یون Fe2+ به Fe3+ توسط هیدروپراکسیدها و تشکیل کمپلکس قرمز فریک تیوسیانات با جذب در ۵۰۰ نانومتر.',
        applicableMatrixes: ['روغن‌های با پراکسید بسیار ناچیز (< ۰.۱ meq/kg)', 'لیپیدهای استخراج شده از مواد غذایی کم‌چرب'],
        standardReferences: [{ organization: 'IDF', standardNumber: 'IDF Standard 74A', titleFa: 'پراکسید در چربی شیر', titleEn: 'Peroxide in Anhydrous Milk Fat', scopeAndMatrix: 'Milk fat' }],
        advantagesFa: ['حساسیت فوق‌العاده بالا برای مقادیر بسیار اندک پراکسید'],
        limitationsFa: ['تداخل حلال‌های اکسیدشده'],
        analysisTime: '۱۰ دقیقه'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-solvent-pv',
        nameFa: 'مخلوط حلال اسید استیک گلاسیال و ایزواکتان (نسبت ۳ به ۲ حجمی)',
        nameEn: 'Acetic Acid Glacial - Isooctane Solvent Mixture (3:2 v/v)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حلال خالص عاری از ترکیبات اکسیدکننده'
      },
      {
        id: 'rg-ki-sat',
        nameFa: 'محلول اشباع پتاسیم یدید تازه (Saturated Potassium Iodide KI)',
        nameEn: 'Saturated Potassium Iodide Solution (freshly prepared)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حل کردن نمک KI در آب مقطر جوشیده بدون اکسیژن تا اشباع کامل، بدون وجود رنگ زرد آزاد'
      },
      {
        id: 'rg-na2s2o3-001',
        nameFa: 'محلول استاندارد سدیم تیوسولفات ۰.۰۱ نرمال (0.0100 N Na2S2O3)',
        nameEn: 'Standard Sodium Thiosulfate Solution 0.0100 N',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'کالیبره شده با پتاسیم یدات استاندارد اولیه'
      },
      {
        id: 'rg-starch-ind',
        nameFa: 'شناساگر چسب نشاسته ۱٪ تازه',
        nameEn: 'Starch Indicator Solution 1% (freshly prepared)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'جوشاندن ۱ گرم نشاسته محلول در ۱۰۰ میلی‌لیتر آب'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-flask-pv',
        nameFa: 'ارلن مایر یدومتری ۲۵۰ میلی‌لیتر با درپوش سمباده‌ای شیشه‌ای',
        nameEn: 'Iodine Flask 250 mL with Ground Glass Stopper',
        specification: 'هوابندی کامل جهت جلوگیری از نفوذ اکسیژن هوا'
      },
      {
        id: 'eq-microburette',
        nameFa: 'میکروبورت دیجیتال یا شیشه‌ای ۱۰ میلی‌لیتر با دقت ۰.۰۱ mL',
        nameEn: 'Microburette 10 mL (0.01 mL divisions)'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'توزین نمونه و حل کردن در حلال',
        instructionFa: 'حدود ۵ گرم روغن را در ارلن یدومتری وزن کنید (m). ۵۰ میلی‌لیتر از مخلوط اسید استیک و ایزواکتان به آن اضافه کرده و بچرخانید تا کاملاً حل شود.',
        criticalTimeOrTemp: 'توزین با دقت ۰.۰۰۱ گرم'
      },
      {
        stepNumber: 2,
        titleFa: 'افزودن پتاسیم یدید اشباع و واکنش در تاریکی',
        instructionFa: '۰.۵ میلی‌لیتر محلول اشباع پتاسیم یدید اضافه کرده، فوراً درب ارلن را بسته و به مدت ۱ دقیقه به شدت تکان دهید. سپس دقیقاً ۱ دقیقه در تاریکی قرار دهید.',
        criticalTimeOrTemp: 'دقیقاً ۶۰ ثانیه در تاریکی'
      },
      {
        stepNumber: 3,
        titleFa: 'افزودن آب و تیتراسیون با تیوسولفات',
        instructionFa: '۳۰ میلی‌لیتر آب مقطر اضافه کرده و با محلول سدیم تیوسولفات ۰.۰۱ نرمال تیتر کنید تا رنگ زرد کم‌رنگ شود. ۰.۵ میلی‌لیتر چسب نشاسته اضافه کرده (رنگ آبی تیره تشکیل می‌شود) و تیتراسیون را تا ناپدید شدن کامل رنگ آبی ادامه دهید (Vs). یک آزمون بلانک شاهد را نیز همزمان تیتر فرمایید (Vb).',
        criticalTimeOrTemp: 'ناپدید شدن کامل رنگ آبی'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{PV (meq } \\text{O}_2\\text{/kg)} = \\frac{(V_s - V_b) \\times N_{\\text{Thio}} \\times 1000}{m}',
      formulaDescriptionFa: 'عدد پراکسید (میلی‌اکی‌والان اکسیژن فعال در هر کیلوگرم چربی) = ((حجم تیوسولفات مصرفی نمونه منهای بلانک) ضربدر نرمالیته تیوسولفات ضربدر ۱۰۰۰) تقسیم بر وزن نمونه (گرم)',
      variables: [
        { symbol: 'Vs', descriptionFa: 'حجم سدیم تیوسولفات مصرفی برای نمونه (mL)', unit: 'mL', defaultValue: 1.85 },
        { symbol: 'Vb', descriptionFa: 'حجم سدیم تیوسولفات مصرفی برای بلانک شاهد (mL)', unit: 'mL', defaultValue: 0.05 },
        { symbol: 'NThio', descriptionFa: 'نرمالیته دقیق محلول سدیم تیوسولفات (N)', unit: 'N', defaultValue: 0.0100 },
        { symbol: 'm', descriptionFa: 'وزن روغن اولیه (گرم)', unit: 'g', defaultValue: 5.000 }
      ],
      unitResult: 'meq O2/kg fat',
      significantFigures: 2,
      roundingRuleFa: 'گرد کردن به دو رقم اعشار',
      acceptableRSDPercent: 2.0
    },
    qualityControl: {
      reagentBlankRequirementFa: 'آزمون شاهد بلانک نباید بیش از ۰.۱ میلی‌لیتر تیوسولفات ۰.۰۱ نرمال مصرف کند.',
      expectedRecoveryRangePercent: { min: 98.0, max: 102.0 },
      repeatabilityLimit_r: 'اختلاف دو تکرار همزمان در PV کمتر از ۱۰ نباید از ۰.۲ meq/kg بیشتر شود.',
      criticalControlCheckpoints: [
        'تازگی کامل پتاسیم یدید (عدم وجود ید آزاد زرد رنگ)',
        'رعایت دقیق زمان ۶۰ ثانیه در تاریکی'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'مصرف بالای تیوسولفات در آزمون شاهد بلانک (> ۰.۱۵ mL)',
        probableCausesFa: ['اکسیداسیون پتاسیم یدید بر اثر نور یا وجود پراکسید در اسید استیک'],
        investigationStepsFa: ['تهیه مجدد پتاسیم یدید تازه'],
        correctiveAndPreventiveActionFa: 'استفاده از پتاسیم یدید تازه در آب جوشیده سرد و نگهداری اسید استیک در شیشه تیره.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'توزین نمونه و تیتراسیون یدومتری',
        descriptionFa: 'ثبت حجم‌های تیتراسیون تیوسولفات',
        instructions: [
          '۵ گرم روغن را وزن کنید (m).',
          'معرف‌ها را افزوده و با سدیم تیوسولفات ۰.۰۱ نرمال با شناساگر نشاسته تیتر کنید (Vs).',
          'بلانک شاهد را نیز ثبت فرمایید (Vb).'
        ],
        equipmentUsed: ['ارلن یدومتری', 'میکروبورت دیجیتال'],
        reagentsUsed: ['مخلوط اسید استیک-ایزواکتان', 'پتاسیم یدید اشباع', 'سدیم تیوسولفات ۰.۰۱ نرمال', 'چسب نشاسته'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'm', nameFa: 'وزن روغن (m)', paramType: 'mass_weight', expectedUnit: 'g', required: true, minValue: 1.0, maxValue: 10.0, decimalPrecision: 3 },
          { id: 'Vs', nameFa: 'حجم تیوسولفات مصرفی نمونه (Vs)', paramType: 'volume', expectedUnit: 'mL', required: true, minValue: 0.05, maxValue: 25.0, decimalPrecision: 2 },
          { id: 'Vb', nameFa: 'حجم تیوسولفات بلانک شاهد (Vb)', paramType: 'volume', expectedUnit: 'mL', required: true, minValue: 0.0, maxValue: 0.5, decimalPrecision: 2 },
          { id: 'NThio', nameFa: 'نرمالیته سدیم تیوسولفات (N)', paramType: 'numeric', expectedUnit: 'N', required: true, minValue: 0.005, maxValue: 0.05, defaultValue: 0.0100 }
        ]
      }
    ]
  },

  // 13. VITAMIN C (ASCORBIC ACID BY 2,6-DCPIP)
  {
    id: 'chem-vitamins-ascorbic',
    code: 'CHEM-VIT-01',
    analyteFa: 'ویتامین ث / اسید آسکوربیک (Vitamin C / L-Ascorbic Acid)',
    analyteEn: 'Vitamin C by 2,6-Dichlorophenolindophenol (DCPIP) Visual Titration',
    titleFa: 'تعیین ویتامین ث (اسید آسکوربیک) به روش تیتراسیون با ۲و۶-دی‌کلروفنل‌ایندوفنل (DCPIP)',
    titleEn: 'Determination of Vitamin C (Ascorbic Acid) by 2,6-DCPIP Titration Method',
    category: 'vitamins_preservatives',
    sectorCompatibility: ['fruits_veg', 'beverages', 'confectionery'],
    objectiveFa: 'اندازه‌گیری دقیق ویتامین C فعال در آبمیوه‌ها، کنسانتره، مکمل‌ها و فرآورده‌های غنی‌شده.',
    chemicalPrincipleFa: 'اکسیداسیون اسید آسکوربیک به اسید دهیدروآسکوربیک توسط معرف رنگی ۲و۶-دی‌کلروفنل‌ایندوفنل (DCPIP) آبی‌رنگ. در محیط اسیدی (اسید متافسفریک)، معرف به رنگ صورتی است و با واکنش با اسید آسکوربیک بی‌رنگ می‌شود. در نقطه پایانی تیتراسیون، اولین قطره اضافی معرف، رنگ صورتی کم‌رنگ پایدار به مدت ۱۵ ثانیه ایجاد می‌کند.',
    samplePreparation: {
      homogenizationProtocolFa: 'استخراج فوری با محلول اسید متافسفریک ۳٪ و اسید استیک ۸٪ (MPA-Acetic Acid) جهت تثبیت ویتامین C و مهار آنزیم آسکوربات اکسیداز.',
      sampleMassOrVolume: '۱۰.۰۰ تا ۵۰.۰۰ میلی‌لیتر یا گرم',
      storageBeforeAnalysis: 'انجام فوری آزمون دور از نور و گرما'
    },
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 5569',
      year: '1393',
      titleFa: 'آبمیوه‌ها و فرآورده‌های میوه - تعیین اسید آسکوربیک به روش تیترومتری',
      titleEn: 'Fruit Juices - Determination of Ascorbic Acid by Titrimetry',
      scopeAndMatrix: 'آب مرکبات، آبمیوه‌ها، شربت و پوره میوه',
      isPrimaryNationalStandard: true
    },
    secondaryStandards: [
      {
        organization: 'AOAC',
        standardNumber: 'AOAC 967.21',
        titleFa: 'اسید آسکوربیک در فرآورده‌های ویتامینی به روش ۲و۶-دی‌کلروفنل‌ایندوفنل',
        titleEn: 'Ascorbic Acid in Vitamin Preparations and Juices - 2,6-Dichloroindophenol Method',
        scopeAndMatrix: 'Juices and Vitamin Fortified Foods'
      }
    ],
    alternativeMethods: [
      {
        methodId: 'vit-alt-hplc',
        methodNameFa: 'کروماتوگرافی مایع با کارایی بالا (HPLC-UV)',
        methodNameEn: 'HPLC with UV Detection at 245 nm',
        principleFa: 'جداسازی ایزوکراتیک اسید آسکوربیک روی ستون C18 فاز معکوس با فاز متحرک آبی اسیدی.',
        applicableMatrixes: ['غذاهای پیچیده با رنگ تیره شدید', 'شیر خشک نوزاد'],
        standardReferences: [{ organization: 'ISO', standardNumber: 'ISO 14524', titleFa: 'ویتامین C به روش HPLC', titleEn: 'Vitamin C by HPLC', scopeAndMatrix: 'Infant formulas' }],
        advantagesFa: ['عدم تداخل رنگ‌های طبیعی میوه و دی‌اکسید گوگرد'],
        limitationsFa: ['نیاز به تجهیزات کروماتوگرافی گران‌قیمت'],
        analysisTime: '۱۵ دقیقه'
      }
    ],
    requiredReagents: [
      {
        id: 'rg-dcpip',
        nameFa: 'محلول استاندارد رنگی ۲و۶-دی‌کلروفنل‌ایندوفنل (2,6-DCPIP)',
        nameEn: 'Standard 2,6-Dichlorophenolindophenol Dye Solution',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حل کردن ۵۰ میلی‌گرم پودر DCPIP و ۴۲ میلی‌گرم سدیم بی‌کربنات در ۲۰۰ میلی‌لیتر آب گرم'
      },
      {
        id: 'rg-mpa-acid',
        nameFa: 'محلول استخراج اسید متافسفریک-اسید استیک (HPO3-HOAc)',
        nameEn: 'Metaphosphoric Acid - Acetic Acid Extracting Solution (3% HPO3 / 8% HOAc)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'حل کردن ۳۰ گرم اسید متافسفریک و ۸۰ میلی‌لیتر اسید استیک گلاسیال در ۱ لیتر آب'
      },
      {
        id: 'rg-ascorbic-std',
        nameFa: 'محلول استاندارد اسید آسکوربیک مرجع ۱ میلی‌گرم در میلی‌لیتر',
        nameEn: 'Standard L-Ascorbic Acid Reference Solution (1.00 mg/mL)',
        grade: 'Analytical (AR)',
        preparationProtocolFa: 'تهیه تازه در محلول اسید متافسفریک'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-microburette-vit',
        nameFa: 'میکروبورت ۱۰ یا ۲۵ میلی‌لیتر با دقت ۰.۰۱ mL',
        nameEn: 'Precision Titration Microburette 10 mL'
      }
    ],
    proceduralSteps: [
      {
        stepNumber: 1,
        titleFa: 'استانداردسازی معرف رنگی DCPIP',
        instructionFa: '۵ میلی‌لیتر از محلول استاندارد اسید آسکوربیک (حاوی ۵.۰ میلی‌گرم ویتامین C) را با ۵ میلی‌لیتر محلول اسید متافسفریک مخلوط کرده و با معرف DCPIP تا ظهور رنگ صورتی کم‌رنگ پایدار به مدت ۱۵ ثانیه تیتر کنید و فاکتور تیترانت (F) را بر حسب میلی‌گرم ویتامین C در هر میلی‌لیتر معرف محاسبه فرمایید.',
        criticalTimeOrTemp: 'پایداری رنگ صورتی به مدت ۱۵ ثانیه'
      },
      {
        stepNumber: 2,
        titleFa: 'استخراج و تیتراسیون نمونه آزمایه',
        instructionFa: 'حجم مشخصی از نمونه آبمیوه (مثلاً ۱۰ میلی‌لیتر) را با حجم مساوی اسید متافسفریک مخلوط کرده، صاف نموده و ۱۰ میلی‌لیتر از عصاره صاف‌شده را بلافاصله با محلول استاندارد DCPIP تا رنگ صورتی پایدار تیتر کنید (Vs). بلانک شاهد اسید را نیز تیتر کنید (Vb).',
        criticalTimeOrTemp: 'تیتراسیون سریع جهت جلوگیری از اکسیداسیون هوایی'
      }
    ],
    calculationRules: {
      formulaLatex: '\\text{Vitamin C (mg/100mL)} = \\frac{(V_s - V_b) \\times F \\times V_{\\text{total}} \\times 100}{V_{\\text{aliquot}} \\times V_{\\text{sample}}}',
      formulaDescriptionFa: 'غلظت ویتامین ث (mg/100mL) = ((حجم معرف مصرفی نمونه منهای بلانک) ضربدر فاکتور معرف F ضربدر حجم کل عصاره ضربدر ۱۰۰) تقسیم بر (حجم نمونه برداشتی ضربدر حجم قطعه تیترشده)',
      variables: [
        { symbol: 'Vs', descriptionFa: 'حجم معرف DCPIP مصرفی نمونه (mL)', unit: 'mL', defaultValue: 6.80 },
        { symbol: 'Vb', descriptionFa: 'حجم معرف DCPIP مصرفی بلانک شاهد (mL)', unit: 'mL', defaultValue: 0.10 },
        { symbol: 'F', descriptionFa: 'فاکتور معرف DCPIP (میلی‌گرم ویتامین C معادل ۱ میلی‌لیتر رنگ)', unit: 'mg/mL', defaultValue: 0.250 },
        { symbol: 'Vsample', descriptionFa: 'حجم نمونه اولیه (mL)', unit: 'mL', defaultValue: 10.0 }
      ],
      unitResult: 'mg/100mL (or mg/100g)',
      significantFigures: 1,
      roundingRuleFa: 'گرد کردن به یک رقم اعشار',
      acceptableRSDPercent: 1.5
    },
    qualityControl: {
      reagentBlankRequirementFa: 'تیتراسیون بلانک محلول اسید متافسفریک با DCPIP جهت تصحیح حجم نقطه پایانی.',
      certifiedReferenceMaterialCRM: 'استاندارد اسید L-آسکوربیک با خلوص ۹۹.۸٪ تازه تهیه شده.',
      expectedRecoveryRangePercent: { min: 98.0, max: 102.0 },
      repeatabilityLimit_r: 'اختلاف دو تکرار نباید از ۱.۰ میلی‌گرم در ۱۰۰ میلی‌لیتر بیشتر شود.',
      criticalControlCheckpoints: [
        'سرعت در اجرای تیتراسیون و محافظت کامل در برابر نور و فلزات سنگین (مس و آهن)'
      ]
    },
    troubleshooting: [
      {
        symptomFa: 'محو شدن تدریجی رنگ صورتی بعد از ۱۵ ثانیه',
        probableCausesFa: ['واکنش کند سایر ترکیبات احیاکننده غیر از اسید آسکوربیک'],
        investigationStepsFa: ['ثبت نقطه پایانی دقیقاً در ثانیه ۱۵'],
        correctiveAndPreventiveActionFa: 'نقطه پایانی استاندارد بین ۱۰ تا ۱۵ ثانیه ثبت شود و تیتراسیون بیش از حد ادامه نیابد.'
      }
    ],
    structuredStepsForLabEngine: [
      {
        stepNumber: 1,
        titleFa: 'تیتراسیون با معرف ۲و۶-دی‌کلروفنل‌ایندوفنل (DCPIP)',
        descriptionFa: 'ثبت حجم مصرفی معرف رنگی',
        instructions: [
          'عصاره تثبیت‌شده را با DCPIP تا رنگ صورتی پایدار تیتر کنید (Vs).',
          'حجم بلانک شاهد (Vb) و فاکتور معرف (F) را ثبت نمایید.'
        ],
        equipmentUsed: ['میکروبورت'],
        reagentsUsed: ['معرف رنگی DCPIP', 'اسید متافسفریک ۳٪'],
        requiresVerificationBeforeNext: true,
        parameters: [
          { id: 'Vs', nameFa: 'حجم DCPIP مصرفی نمونه (Vs)', paramType: 'volume', expectedUnit: 'mL', required: true, minValue: 0.1, maxValue: 25.0, decimalPrecision: 2 },
          { id: 'Vb', nameFa: 'حجم DCPIP بلانک (Vb)', paramType: 'volume', expectedUnit: 'mL', required: true, minValue: 0.0, maxValue: 0.5, decimalPrecision: 2 },
          { id: 'F', nameFa: 'فاکتور معرف DCPIP (mg/mL)', paramType: 'numeric', expectedUnit: 'mg/mL', required: true, minValue: 0.1, maxValue: 0.5, defaultValue: 0.250 }
        ]
      }
    ]
  }
];
