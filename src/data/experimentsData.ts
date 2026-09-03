/**
 * Food Science AI - Verified Benchmark Experiments Dataset
 * Authentic standard laboratory protocols across all 15 food science domains.
 * Sourced strictly from INSO, ISO, AOAC, ASTM, IDF, and AOCS.
 */

import { FoodExperiment } from '../types/foodExperiment';

export const VERIFIED_BENCHMARK_EXPERIMENTS: FoodExperiment[] = [
  // 1. Food Chemistry (شیمی مواد غذایی)
  {
    id: 'exp_chem_acid_value_01',
    code: 'EXP-CHM-001',
    titleFa: 'تعیین عدد اسیدی و اسیدیته آزاد در روغن‌ها و چربی‌های خوراکی',
    titleEn: 'Determination of Acid Value and Free Fatty Acids (FFA) in Edible Oils',
    domain: 'food_chemistry',
    objective: 'تعیین مقدار اسیدهای چرب آزاد حاصل از هیدرولیز تری‌گلیسریدها در نمونه روغن و چربی و ارزیابی میزان فساد هیدرولیتیک',
    scope: 'کلیه روغن‌های خام، تصفیه‌شده، چربی‌های حیوانی، نباتی و مارگارین خوراکی',
    principle: 'انحلال مقدار مشخصی از نمونه در مخلوط حلال خنثی‌شده اتانول-دی‌اتیل اتر (یا ایزوپروپانول) و تیتراسیون اسیدهای چرب آزاد با محلول هیدروکسید پتاسیم استاندارد در حضور معرف فنل‌فتالئین تا ظهور رنگ صورتی پایدار.',
    equipment: [
      { name: 'ترازوی آنالیتیکال با دقت ۰.۰۰۱ گرم', nameEn: 'Analytical Balance (0.001 g)', specification: 'دقت ±0.001g با کالیبراسیون دوره‌ای', isRequired: true },
      { name: 'بورت مدرج کالیبره ۱۰ یا ۲۵ میلی‌لیتر', nameEn: 'Calibrated Burette (10/25 mL)', specification: 'کلاس A با درجه‌بندی ۰.۰۵ میلی‌لیتر', isRequired: true },
      { name: 'ارلن مایر دهانه گشاد ۲۵۰ میلی‌لیتر', nameEn: 'Conical Flask 250 mL', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'هیدروکسید پتاسیم استاندارد ۰.۱ مولار (KOH)', nameEn: 'Standard KOH Solution (0.1 M)', grade: 'Standard Analytical Grade', hazardClass: 'خورنده', storageCondition: 'ظرف پلی‌اتیلنی در بسته دور از CO2' },
      { name: 'مخلوط حلال اتانول ۹۶٪ و دی‌اتیل اتر (۱:۱ حجمی)', nameEn: 'Ethanol 96% / Diethyl Ether (1:1 v/v)', grade: 'Analytical Reagent (AR)', hazardClass: 'اشتعال‌پذیر و فرار', storageCondition: 'کمد ضد انفجار در دمای زیر ۲۰ درجه' },
      { name: 'شناساگر فنل‌فتالئین ۱٪ در اتانول ۹۶٪', nameEn: 'Phenolphthalein Indicator 1% in Ethanol', grade: 'ACS Grade', storageCondition: 'ظرف شیشه‌ای قهوه‌ای در دمای اتاق' }
    ],
    samplePreparation: 'نمونه روغن باید کاملاً همگن، زلال و فاقد رطوبت معلق باشد. در صورت کدر بودن یا وجود رسوب، در دمای ۵۰ درجه سلسیوس ملایم گرم و از کاغذ صافی عبور داده شود.',
    solutionsPreparation: 'مخلوط حلال اتانول-اتر را قبل از استفاده با چند قطره معرف فنل‌فتالئین در مجاورت چند قطره محلول KOH تا ظهور رنگ صورتی بسیار کم‌رنگ خنثی کنید.',
    environmentalConditions: {
      temperatureRange: '۲۰ الی ۲۵ درجه سلسیوس',
      relativeHumidity: 'زیر ۶۵ درصد',
      ventilationRequirement: 'به علت حضور بخارات دی‌اتیل اتر باید زیر هود تهویه مناسب انجام شود.'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'توزین نمونه آزمون',
        description: 'بسته به میزان تقریبی اسیدیته، بین ۵ الی ۱۰ گرم از نمونه روغن را با دقت ۰.۰۰۱ گرم در ارلن مایر ۲۵۰ میلی‌لیتر وزن کنید.',
        criticalCaution: 'جرم نمونه باید متناسب با عدد اسیدی انتخاب شود تا حجم مصرفی تیترانت بین ۳ الی ۱۰ میلی‌لیتر باشد.'
      },
      {
        stepNumber: 2,
        title: 'انحلال در حلال خنثی',
        description: 'مقدار ۵۰ الی ۱۰۰ میلی‌لیتر از مخلوط حلال خنثی‌شده اتانول-اتر را به ارلن اضافه کرده و به آرامی تکان دهید تا نمونه کاملاً حل شود.'
      },
      {
        stepNumber: 3,
        title: 'افزودن شناساگر و تیتراسیون',
        description: 'تعداد ۳ الی ۵ قطره معرف فنل‌فتالئین اضافه کنید. با محلول هیدروکسید پتاسیم ۰.۱ مولار تیتر کنید تا رنگ صورتی ملایم ظاهر شود که حداقل ۱۵ ثانیه پایدار بماند.'
      }
    ],
    calculations: {
      formulaTitleFa: 'محاسبه عدد اسیدی (Acid Value) و درصد اسید اولئیک',
      formulaExpression: 'AV = (56.1 * V * c) / m | FFA% (as Oleic) = (V * c * 28.2) / m',
      variables: [
        { symbol: 'AV', name: 'عدد اسیدی', unit: 'mg KOH/g' },
        { symbol: 'V', name: 'حجم محلول KOH مصرفی', unit: 'mL' },
        { symbol: 'c', name: 'غلظت مولی واقعی محلول KOH', unit: 'mol/L' },
        { symbol: 'm', name: 'جرم نمونه روغن وزن شده', unit: 'g' },
        { symbol: '56.1', name: 'جرم مولی هیدروکسید پتاسیم (g/mol)', unit: 'g/mol' },
        { symbol: '28.2', name: 'ضریب معادل اسید اولئیک', unit: '-' }
      ]
    },
    reporting: {
      unitOfMeasurement: 'mg KOH/g یا % FFA',
      decimalPrecision: 2,
      repeatabilityLimit_r: 'اختلاف بین دو آزمون همزمان نباید از ۰.۰۵ تجاوز کند.',
      reproducibilityLimit_R: 'اختلاف بین نتایج دو آزمایشگاه مجزا نباید از ۰.۱۵ تجاوز نماید.'
    },
    potentialErrors: [
      'خنثی نکردن دقیق مخلوط حلال قبل از حل کردن نمونه',
      'تغییر فاکتور محلول هیدروکسید پتاسیم به دلیل جذب دی‌اکسید کربن هوا'
    ],
    safetyNotes: [
      'دی‌اتیل اتر به شدت فرار و قابل اشتعال است؛ از حرارت و جرقه دور نگه داشته شود.',
      'از هود شیمیایی دارای استاندارد ضد جرقه استفاده شود.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 4179 (معادل ISO 660)',
      titleFa: 'روغن‌ها و چربی‌های گیاهی و حیوانی - تعیین عدد اسیدی و اسیدیته',
      titleEn: 'Animal and vegetable fats and oils - Determination of acid value and acidity',
      publicationYear: '1393 (2014)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_4179',
        citationShort: 'استاندارد ملی ایران ۴۱۷۹',
        fullTitle: 'روغن‌ها و چربی‌های گیاهی و حیوانی - تعیین عدد اسیدی و اسیدیته',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      },
      {
        sourceId: 'src_iso_660',
        citationShort: 'ISO 660:2020',
        fullTitle: 'Animal and vegetable fats and oils — Determination of acid value and acidity',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['روغن‌ها و چربی‌ها', 'عدد اسیدی', 'FFA', 'INSO 4179', 'ISO 660'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 2. Microbiology (میکروبیولوژی)
  {
    id: 'exp_mb_total_plate_count_02',
    code: 'EXP-MB-002',
    titleFa: 'شمارش کلی میکروارگانیسم‌های مزوفیل هوازی (Total Plate Count - TPC)',
    titleEn: 'Enumeration of Culturable Microorganisms - Colony Count at 30 °C by Pour Plate Technique',
    domain: 'microbiology',
    objective: 'شمارش کمی باکتری‌ها و میکروارگانیسم‌های مزوفیل زنده در فرآورده‌های غذایی به عنوان شاخص بهداشتی و بار میکروبی اولیه',
    scope: 'کلیه مواد غذایی، خوراک دام و نمونه‌های محیطی خطوط تولید صنایع غذایی',
    principle: 'تهیه رقت‌های سریالی اعشاری از سوسپانسیون اولیه نمونه و مخلوط کردن با محیط کشت آگاردار اختصاصی (PCA) در پلیت استریل (پور پلیت) و گرماگذاری در دمای ۳۰ درجه سلسیوس به مدت ۷۲ ساعت و شمارش کلنی‌ها.',
    equipment: [
      { name: 'انکوباتور میکروبیولوژی ۳۰ ± ۱ درجه سلسیوس', nameEn: 'Microbiological Incubator', isRequired: true },
      { name: 'استومیکر یا هموژنایزر آزمایشگاهی', nameEn: 'Stomacher / Lab Blender', isRequired: true },
      { name: 'پیپت‌های استریل کالیبره یا سمپلر با سرسمپلر فیلتردار', nameEn: 'Sterile Pipettes / Micropipettes', isRequired: true },
      { name: 'پلیت‌های پتری استریل یکبار مصرف ۹۰ میلی‌متری', nameEn: 'Sterile Petri Dishes', isRequired: true },
      { name: 'حمام آب‌گرم ۴۵ درجه سلسیوس', nameEn: 'Water Bath (45 °C)', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'محیط کشت پلیت کانت آگار (PCA)', nameEn: 'Plate Count Agar (PCA)', grade: 'Microbiology Culture Medium Grade', storageCondition: 'محیط خشک دور از رطوبت' },
      { name: 'رقیق‌کننده پپتون واتر سالین (MRD)', nameEn: 'Peptone Salt Diluent', grade: 'Microbiology Grade' }
    ],
    samplePreparation: '۲۵ گرم یا میلی‌لیتر از نمونه به صورت آسپتیک وزن و با ۲۲۵ میلی‌لیتر رقیق‌کننده استریل در کیسه استومیکر به مدت ۲ دقیقه همگن می‌شود.',
    solutionsPreparation: 'محیط PCA در اتوکلاو در ۱۲۱ درجه به مدت ۱۵ دقیقه استریل و در حمام آب‌گرم ۴۵ درجه تا زمان پورپلیت نگهداری می‌شود.',
    environmentalConditions: {
      temperatureRange: 'اتاق تمیز میکروبیولوژی طبق ISO 7218',
      ventilationRequirement: 'کار زیر هود لامینار کلاس II یا در مجاورت شعله گاز'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'تهیه رقت‌های متوالی اعشاری',
        description: 'از رقت اولیه 10^-1، مقدار ۱ میلی‌لیتر برداشته و به ۹ میلی‌لیتر رقیق‌کننده استریل اضافه کنید تا رقت 10^-2 تهیه شود.'
      },
      {
        stepNumber: 2,
        title: 'کشت پورپلیت',
        description: 'از هر رقت، ۱ میلی‌لیتر در دو پلیت استریل ریخته و ۱۵ میلی‌لیتر محیط PCA مذاب در ۴۵ درجه اضافه کرده و به شکل عدد ۸ انگلیسی مخلوط کنید.'
      },
      {
        stepNumber: 3,
        title: 'گرماگذاری در انکوباتور',
        description: 'پلیت‌ها را به صورت واژگون در دمای ۳۰ ± ۱ درجه سلسیوس به مدت ۷۲ ± ۳ ساعت قرار دهید.'
      }
    ],
    calculations: {
      formulaTitleFa: 'محاسبه تعداد CFU بر اساس میانگین وزنی رقت‌ها',
      formulaExpression: 'N = sum(C) / (V * (n1 + 0.1 * n2) * d)',
      variables: [
        { symbol: 'N', name: 'تعداد کلنی بر حسب CFU/g یا CFU/mL', unit: 'CFU/g' },
        { symbol: 'sum(C)', name: 'مجموع کلنی‌های شمارش شده در پلیت‌های انتخابی معتبر (۱۵ تا ۳۰۰ کلنی)', unit: 'کلنی' },
        { symbol: 'V', name: 'حجم تلقیح در هر پلیت', unit: '1.0 mL' },
        { symbol: 'd', name: 'فاکتور اولین رقت شمارش شده', unit: '-' }
      ]
    },
    reporting: {
      unitOfMeasurement: 'CFU/g یا CFU/mL',
      decimalPrecision: 0,
      reportTemplateGuidance: 'تعداد کلنی‌ها به صورت نماد علمی با ۲ رقم بامعنی گزارش می‌شود.'
    },
    potentialErrors: [
      'دمای بالای آگار مذاب هنگام ریختن که باعث شوک حرارتی باکتری‌ها می‌شود.',
      'شمارش پلیت‌های با کمتر از ۱۵ یا بیشتر از ۳۰۰ کلنی.'
    ],
    safetyNotes: [
      'پلیت‌های مصرف شده پس از اتمام باید در دمای ۱۲۱ درجه به مدت ۳۰ دقیقه اتوکلاو و سپس امحا گردند.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 5272-1 (معادل ISO 4833-1)',
      titleFa: 'میکروبیولوژی زنجیره غذایی - شمارش میکروارگانیسم‌ها در ۳۰ درجه سلسیوس به روش پورپلیت',
      titleEn: 'Microbiology of the food chain - Horizontal method for enumeration of microorganisms - Part 1: Colony count at 30 °C',
      publicationYear: '1394 (2013)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_5272_1',
        citationShort: 'استاندارد ملی ایران ۵۲۷۲-۱',
        fullTitle: 'میکروبیولوژی مواد غذایی و خوراک دام - روش جامع شمارش میکروارگانیسم‌ها در ۳۰ درجه سلسیوس',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['میکروبیولوژی', 'TPC', 'پورپلیت', 'PCA', 'INSO 5272-1'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 3. Food Physics (فیزیک مواد غذایی)
  {
    id: 'exp_phys_water_activity_03',
    code: 'EXP-PHY-003',
    titleFa: 'تعیین فعالیت آبی (Water Activity - aw) در فرآورده‌های غذایی',
    titleEn: 'Measurement of Water Activity (aw) in Food Products by Dew Point / Electrolytic Sensors',
    domain: 'food_physics',
    objective: 'اندازه‌گیری پتانسیل آب آزاد و تعادل رطوبتی نسبی (ERH) فرآورده به منظور پیش‌بینی پایداری میکروبی و ماندگاری',
    scope: 'کلیه مواد غذایی خشک، نیمه مرطوب (IMF)، سس‌ها، پودرها و مغزها',
    principle: 'قراردادن نمونه در محفظه در بسته حسگر و رسیدن به تعادل ترمودینامیکی بین آب نمونه و فاز بخار headspace؛ سنجش فشار بخار آب از طریق نقطه شبنم آینه خنک‌شونده در دمای کنترل‌شده ۲۵ درجه سلسیوس.',
    equipment: [
      { name: 'دستگاه سنجش فعالیت آبی با آینه نوری (Chilled Mirror Dew Point)', nameEn: 'Water Activity Meter', specification: 'دقت ±0.003 aw با کنترل دمای پلتیر', isRequired: true },
      { name: 'فنجان‌های یکبار مصرف استاندارد نمونه', nameEn: 'Sample Cups', isRequired: true },
      { name: 'استانداردهای کالیبراسیون نمکی معتبر (LiCl, NaCl, K2SO4)', nameEn: 'Certified Salt Standards', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'محلول‌های استاندارد نمکی CRM', nameEn: 'Certified Reference Salt Solutions', grade: 'CRM Grade' },
      { name: 'دستمال تنظیف بدون پرز لنز', nameEn: 'Lint-free Optical Tissue', grade: 'Optical Grade' }
    ],
    samplePreparation: 'نمونه به ابعاد ریز خرد یا آسیاب شده و حداکثر تا نصف ارتفاع فنجان نمونه پر می‌شود.',
    solutionsPreparation: 'کالیبراسیون دوره‌ای دستگاه با حداقل دو استاندارد نمکی در محدوده کاری.',
    environmentalConditions: {
      temperatureRange: 'دمای محیط ۲۲ الی ۲۵ درجه سلسیوس',
      specialNotes: 'دمای نمونه باید قبل از آزمون با دمای حسگر دستگاه (25.0 °C) هم‌دما شود.'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'بررسی تمیزی حسگر و تست کالیبراسیون',
        description: 'بررسی تمیزی آینه با دستمال بدون پرز و تایید کالیبراسیون با استاندارد نمکی NaCl 0.753.'
      },
      {
        stepNumber: 2,
        title: 'تست نمونه',
        description: 'فنجان حاوی نمونه را در محفظه دستگاه قرار داده و اهرم را به حالت Read بچرخانید تا به پایداری برسد.'
      }
    ],
    calculations: {
      formulaTitleFa: 'رابطه فعالیت آبی با رطوبت نسبی تعادلی و فشار بخار',
      formulaExpression: 'aw = p / p0 = ERH% / 100',
      variables: [
        { symbol: 'aw', name: 'فعالیت آبی', unit: 'بدون بعد (0.000 تا 1.000)' },
        { symbol: 'ERH', name: 'رطوبت نسبی تعادلی', unit: '%' }
      ]
    },
    reporting: {
      unitOfMeasurement: 'بدون بعد (aw)',
      decimalPrecision: 3,
      repeatabilityLimit_r: 'اختلاف دو قرائت پیاپی نباید از 0.003 بیشتر باشد.'
    },
    potentialErrors: [
      'آلودگی سطح آینه نوری با ترکیبات فرار',
      'عدم تعادل دمایی بین نمونه و حسگر'
    ],
    safetyNotes: [
      'هنگام کار با نمک‌های کالیبراسیون از دستکش محافظ استفاده شود.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 19408 (معادل ISO 18787)',
      titleFa: 'فرآورده‌های غذایی - تعیین فعالیت آبی',
      titleEn: 'Foodstuffs - Determination of water activity',
      publicationYear: '1394 (2017)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_19408',
        citationShort: 'استاندارد ملی ایران ۱۹۴۰۸',
        fullTitle: 'فرآورده‌های غذایی - تعیین فعالیت آبی',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['فیزیک مواد غذایی', 'فعالیت آبی', 'aw', 'INSO 19408', 'ISO 18787'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 4. Quality Control (کنترل کیفیت)
  {
    id: 'exp_qc_sampling_aql_04',
    code: 'EXP-QC-004',
    titleFa: 'نمونه‌برداری پذیرشی و بازرسی انطباق آماری بر اساس حد کیفیت قابل پذیرش (AQL)',
    titleEn: 'Sampling Procedures for Inspection by Attributes - Acceptance Quality Limit (AQL)',
    domain: 'quality_control',
    objective: 'تعیین انطباق محموله و بهر تولیدی با الزامات کیفی از طریق نمونه‌برداری آماری صفت‌ها و اتخاذ تصمیم پذیرش یا رد بهر',
    scope: 'بسته‌بندی نهایی محصولات غذایی، قوطی‌های کنسرو، بطری‌ها، کارتن‌ها و اقلام ورودی مواد اولیه',
    principle: 'استخراج تعداد نمونه تصادفی ($n$) از بهر ($N$) بر اساس سطح بازرسی عمومی (General Inspection Level II) و طرح نمونه‌برداری یک مرحله‌ای نرمال (Normal Single Sampling) و مقایسه تعداد اقلام معیوب با اعداد پذیرش ($Ac$) و رد ($Re$).',
    equipment: [
      { name: 'جداول استاندارد آماری ISO 2859-1 / INSO 2863', nameEn: 'ISO 2859-1 Statistical Tables', isRequired: true },
      { name: 'جدول اعداد تصادفی یا نرم‌افزار تخصصی نمونه‌برداری تصادفی', nameEn: 'Random Number Sampling Tool', isRequired: true }
    ],
    reagentsAndMaterials: [],
    samplePreparation: 'شناسایی و تفکیک کامل بهر (Lot) تولیدی همگن بر اساس شماره بچ و تاریخ تولید.',
    solutionsPreparation: 'تعیین سطوح AQL بحرانی (Critical: 0.0)، عمده (Major: 1.5 الی 2.5) و جزئی (Minor: 4.0).',
    environmentalConditions: {
      temperatureRange: 'دمای استاندارد انبار و ایستگاه کنترل کیفیت'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'تعیین اندازه بهر و کد حرفی نمونه',
        description: 'اندازه کل بهر ($N$) را مشخص کرده و با استفاده از جدول سطح بازرسی II، کد حرفی اندازه نمونه را استخراج نمایید.'
      },
      {
        stepNumber: 2,
        title: 'برداشت تصادفی نمونه‌ها',
        description: 'تعداد $n$ نمونه را به صورت تصادفی یکنواخت از کل کارتن‌ها و پالت‌های بهر بردارید.'
      },
      {
        stepNumber: 3,
        title: 'بازرسی صفت‌ها و ثبت عیوب',
        description: 'هر نمونه را از نظر عیوب بحرانی، عمده و جزئی بازرسی کرده و تعداد کل اقلام معیوب ($d$) را شمارش کنید.'
      }
    ],
    calculations: {
      formulaTitleFa: 'قاعده تصمیم‌گیری پذیرش یا رد بهر',
      formulaExpression: 'Accept if d <= Ac | Reject if d >= Re',
      variables: [
        { symbol: 'N', name: 'اندازه کل بهر', unit: 'واحد' },
        { symbol: 'n', name: 'اندازه نمونه بازرسی شده', unit: 'واحد' },
        { symbol: 'Ac', name: 'عدد پذیرش (Acceptance Number)', unit: 'عدد' },
        { symbol: 'Re', name: 'عدد رد (Rejection Number)', unit: 'عدد' },
        { symbol: 'd', name: 'تعداد نمونه‌های معیوب مشاهده شده', unit: 'عدد' }
      ]
    },
    reporting: {
      unitOfMeasurement: 'تصمیم پذیرش (Accepted) یا رد (Rejected)',
      decimalPrecision: 0,
      reportTemplateGuidance: 'گزارش شماره بچ، اندازه بهر، اندازه نمونه، تعداد عیوب و نتیجه نهایی بازرسی.'
    },
    potentialErrors: [
      'نمونه‌برداری سوگیرانه فقط از پالت‌های در دسترس و جلویی انبار',
      'اختلاط بهرهای تولیدی ناهمگن با تاریخ‌های مختلف'
    ],
    safetyNotes: [
      'رعایت اصول ایمنی فردی و ارگونومی هنگام جابجایی کارتن‌ها در انبار.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 2863 (معادل ISO 2859-1)',
      titleFa: 'روش‌های نمونه‌برداری برای بازرسی بر اساس صفت‌ها - قسمت ۱: طرح‌های نمونه‌برداری به تفکیک AQL',
      titleEn: 'Sampling procedures for inspection by attributes - Part 1: Sampling schemes indexed by AQL for lot-by-lot inspection',
      publicationYear: '1392 (2011)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_2863',
        citationShort: 'استاندارد ملی ایران ۲۸۶۳',
        fullTitle: 'روش‌های نمونه‌برداری برای بازرسی بر اساس صفت‌ها بر مبنای AQL',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['کنترل کیفیت', 'AQL', 'نمونه‌برداری آماری', 'INSO 2863', 'ISO 2859-1'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 5. Sensory Evaluation (آزمون‌های حسی)
  {
    id: 'exp_sensory_triangle_test_05',
    code: 'EXP-SEN-005',
    titleFa: 'آزمون حسی مقایسه‌ای سه‌تایی (Triangle Test)',
    titleEn: 'Sensory Analysis - Methodology - Triangle Test for Discriminating Differences',
    domain: 'sensory_evaluation',
    objective: 'تشخیص وجود یا عدم وجود تفاوت حسی محسوس بین دو فرمولاسیون یا فرآیند تغییر یافته در محصول غذایی',
    scope: 'کلیه فرآورده‌های غذایی در زمان تغییر فرمولاسیون، تعویض ماده اولیه یا اصلاح فرآیند حرارتی',
    principle: 'ارائه سه نمونه تصادفی ۳ رقمی به صورت همزمان (دو نمونه یکسان و یک نمونه متفاوت) در وضعیت‌های متعادل ۶ گانه (AAB, ABA, BAA, BBA, BAB, ABB) به ارزیاب‌های آموزش‌دیده و انتخاب اجباری نمونه متفاوت.',
    equipment: [
      { name: 'کابین‌های آزمون حسی استاندارد ISO 8589', nameEn: 'Standard Sensory Booths', isRequired: true },
      { name: 'ظروف یکنواخت کدگذاری شده ۳ رقمی', nameEn: 'Coded Sample Containers', isRequired: true },
      { name: 'آب شستشوی دهان و نان سوخاری بی‌نمک', nameEn: 'Palate Cleansers', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'نمونه‌های فرمول مرجع (A) و فرمول آزمایشی (B)', nameEn: 'Reference (A) and Test (B) Samples', grade: 'Food Grade' }
    ],
    samplePreparation: 'ارائه نمونه‌ها در دما، حجم، ظاهر و بافت کاملاً یکنواخت با کدهای تصادفی ۳ رقمی.',
    solutionsPreparation: 'تهیه پرسشنامه‌های استاندارد ISO 4120.',
    environmentalConditions: {
      temperatureRange: '۲۰ الی ۲۲ درجه سلسیوس در اتاق بدون بو و عایق صدا'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'چیدمان سینی آزمون',
        description: 'آماده‌سازی ۳ ظرف نمونه با کد تصادفی برای هر ارزیاب به همراه آب شستشو.'
      },
      {
        stepNumber: 2,
        title: 'ارزیابی حسی و انتخاب نمونه متفاوت',
        description: 'ارزیاب از چپ به راست چشیده، دهان را شسته و نمونه متفاوت را در فرم علامت می‌زند.'
      }
    ],
    calculations: {
      formulaTitleFa: 'تحلیل آماری با آزمون توزیع دوجمله‌ای',
      formulaExpression: 'P(X >= x) = sum_{k=x}^n [ C(n,k) * (1/3)^k * (2/3)^(n-k) ]',
      variables: [
        { symbol: 'n', name: 'تعداد کل ارزیاب‌ها', unit: 'نفر' },
        { symbol: 'x', name: 'تعداد پاسخ‌های صحیح', unit: 'نفر' },
        { symbol: 'alpha', name: 'سطح معنی‌داری آماری', unit: '0.05 یا 0.01' }
      ]
    },
    reporting: {
      unitOfMeasurement: 'تعداد پاسخ صحیح / معنی‌داری آماری',
      decimalPrecision: 0,
      reportTemplateGuidance: 'تعداد کل ارزیاب‌ها، تعداد پاسخ صحیح و نتیجه‌گیری مبنی بر وجود یا عدم وجود تفاوت حسی.'
    },
    potentialErrors: [
      'تفاوت در دمای سرو نمونه‌ها یا شکل ظروف',
      'خستگی حسی ناشی از تست نمونه‌های بیش از حد در یک نوبت'
    ],
    safetyNotes: [
      'اطمینان کامل از سلامت میکروبی و عدم وجود آلرژن‌های ناشناخته برای ارزیاب‌ها.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 5694 (معادل ISO 4120)',
      titleFa: 'ارزیابی حسی - روش‌شناسی - آزمون مثلثی',
      titleEn: 'Sensory analysis - Methodology - Triangle test',
      publicationYear: '1393 (2014)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_5694',
        citationShort: 'استاندارد ملی ایران ۵۶۹۴',
        fullTitle: 'ارزیابی حسی مواد غذایی - آزمون مثلثی',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['آزمون‌های حسی', 'مثلثی', 'Triangle Test', 'INSO 5694', 'ISO 4120'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 6. Food Analysis (تجزیه مواد غذایی)
  {
    id: 'exp_food_analysis_kjeldahl_protein_06',
    code: 'EXP-ANA-006',
    titleFa: 'تعیین مقدار پروتئین خام به روش کلدال (Kjeldahl Method)',
    titleEn: 'Determination of Crude Protein Content by Kjeldahl Digestion & Distillation Method',
    domain: 'food_analysis',
    objective: 'اندازه‌گیری کل نیتروژن آلی نمونه و محاسبه درصد پروتئین خام با ضریب تبدیل اختصاصی فرآورده',
    scope: 'غلات، آرد، گوشت و فرآورده‌های گوشتی، شیر و لبنیات، خوراک دام و دانه‌های روغنی',
    principle: 'هضم با اسید سولفوریک غلیظ در ۴۲۰ درجه در حضور کاتالیزور مس-پتاسیم و تبدیل نیتروژن به سولفات آمونیوم؛ قلیایی‌سازی با سود و تقطیر آمونیاک در اسید بوریک؛ تیتراسیون اسید-باز با HCl استاندارد.',
    equipment: [
      { name: 'دستگاه هضم‌کننده بلوک حرارتی کلدال با اسکرابر', nameEn: 'Kjeldahl Digestion Block with Scrubber', isRequired: true },
      { name: 'دستگاه تقطیر با بخار آب', nameEn: 'Steam Distillation Unit', isRequired: true },
      { name: 'ترازوی آنالیتیکال ۰.۰۰۰۱ گرم', nameEn: 'Analytical Balance (0.0001 g)', isRequired: true },
      { name: 'بورت کالیبره با دقت ۰.۰۱ میلی‌لیتر', nameEn: 'Precision Burette (0.01 mL)', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'اسید سولفوریک غلیظ ۹۸٪ فاقد نیتروژن', nameEn: 'Sulfuric Acid 98%', grade: 'AR Grade', hazardClass: 'خورنده قوی' },
      { name: 'قرص کاتالیزور کلدال (CuSO4 + K2SO4)', nameEn: 'Kjeldahl Catalyst Tablets', grade: 'AR Grade' },
      { name: 'محلول هیدروکسید سدیم ۳۵٪ (NaOH)', nameEn: 'Sodium Hydroxide 35%', grade: 'AR Grade', hazardClass: 'باز قوی' },
      { name: 'اسید بوریک ۴٪ حاوی شناساگر مخلوط تاشیرو', nameEn: 'Boric Acid 4% with Tashiro Indicator', grade: 'Analytical' },
      { name: 'اسید کلریدریک ۰.۱۰۰ مولار استاندارد', nameEn: 'Standard HCl Solution (0.100 M)', grade: 'Volumetric Standard' }
    ],
    samplePreparation: 'نمونه کاملاً آسیاب شده و یکنواخت (ذرات کمتر از ۰.۵ میلی‌متر). وزن کردن ۱.۰ تا ۲.۰ گرم با دقت ۰.۰۰۰۱ گرم.',
    solutionsPreparation: 'آماده‌سازی محلول اسید بوریک ۴٪ و محلول سود ۳۵٪ و اجرای آزمون شاهد (Blank).',
    environmentalConditions: {
      temperatureRange: 'دمای محیط آزمایشگاه شیمی',
      ventilationRequirement: 'هضم فقط زیر هود مجهز به اسکرابر گازهای اسیدی انجام شود.'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'هضم نمونه',
        description: 'افزودن کاتالیزور و ۱۵ میلی‌لیتر اسید سولفوریک و حرارت در ۴۲۰ درجه تا زلال و سبز-آبی شدن کامل مایع.'
      },
      {
        stepNumber: 2,
        title: 'تقطیر با بخار',
        description: 'خنک کردن، افزودن ۵۰ میلی‌لیتر سود ۳۵٪ و تقطیر آمونیاک در ارلن حاوی ۲۵ میلی‌لیتر اسید بوریک.'
      },
      {
        stepNumber: 3,
        title: 'تیتراسیون',
        description: 'تیتراسیون ارلن با HCl 0.1M تا تغییر رنگ از سبز به صورتی خاکستری.'
      }
    ],
    calculations: {
      formulaTitleFa: 'محاسبه درصد نیتروژن و پروتئین خام',
      formulaExpression: '%N = (1.4007 * (V - V0) * c) / m | %Protein = %N * F',
      variables: [
        { symbol: '%N', name: 'درصد نیتروژن تام', unit: '%' },
        { symbol: 'V', name: 'حجم اسید مصرفی نمونه', unit: 'mL' },
        { symbol: 'V0', name: 'حجم اسید مصرفی شاهد بلانک', unit: 'mL' },
        { symbol: 'c', name: 'غلظت مولی اسید HCl', unit: 'mol/L' },
        { symbol: 'm', name: 'جرم نمونه', unit: 'g' },
        { symbol: 'F', name: 'ضریب تبدیل پروتئین (شیر: 6.38، گندم: 5.70، گوشت/عمومی: 6.25)', unit: '-' }
      ]
    },
    reporting: {
      unitOfMeasurement: '% (w/w) پروتئین خام',
      decimalPrecision: 2,
      repeatabilityLimit_r: 'اختلاف بین دو آزمون تکرار همزمان نباید از ۰.۱۵٪ تجاوز کند.'
    },
    potentialErrors: [
      'هضم ناقص ناشی از حرارت ناکافی',
      'نشت آمونیاک از رابط‌های دستگاه تقطیر'
    ],
    safetyNotes: [
      'اسید سولفوریک داغ فوق‌العاده خورنده است؛ استفاده از عینک، دستکش مقاوم و شیلد صورت الزامی است.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 19052 (معادل ISO 8968-1 / AOAC 920.87)',
      titleFa: 'شیر و فرآورده‌های آن - تعیین مقدار نیتروژن و محاسبه پروتئین خام به روش کلدال',
      titleEn: 'Milk and milk products - Determination of nitrogen content - Kjeldahl method',
      publicationYear: '1393 (2014)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_19052',
        citationShort: 'استاندارد ملی ایران ۱۹۰۵۲',
        fullTitle: 'شیر و فرآورده‌های شیری - تعیین نیتروژن تام و پروتئین خام به روش کلدال',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['تجزیه مواد غذایی', 'پروتئین خام', 'کلدال', 'Kjeldahl', 'INSO 19052', 'AOAC 920.87'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 7. Packaging (بسته‌بندی)
  {
    id: 'exp_pkg_wvtr_film_07',
    code: 'EXP-PKG-007',
    titleFa: 'تعیین نرخ انتقال بخار آب از فیلم‌های پلیمری بسته‌بندی (WVTR)',
    titleEn: 'Standard Test Methods for Water Vapor Transmission of Packaging Materials (Gravimetric Cup Method)',
    domain: 'packaging',
    objective: 'اندازه‌گیری نفوذپذیری فیلم‌های پلیمری و لمینیت‌های بسته‌بندی نسبت به رطوبت هوا جهت ارزیابی حفظ کیفیت مواد غذایی حساس به رطوبت',
    scope: 'فیلم‌های تک‌لایه، چندلایه، فویل‌های آلومینیومی و ظروف بسته‌بندی نفوذناپذیر',
    principle: 'آب‌بندی فیلم نمونه بر دهانه فنجان استاندارد حاوی ماده جاذب رطوبت (کلرید کلسیم بی‌آب) و قرار دادن در محفظه اقلیمی با دمای ۳۸ درجه و رطوبت ۹۰٪ و وزن‌سنجی فنجان در فواصل زمانی منظم تا رسیدن به شیب وزنی خطی ثابت.',
    equipment: [
      { name: 'محفظه تست شرایط اقلیمی دما و رطوبت ثابت (Chamber)', nameEn: 'Constant Climate Test Chamber', specification: 'دمای ۳۸ ± ۰.۵ درجه و رطوبت ۹۰ ± ۲ درصد', isRequired: true },
      { name: 'فنجان‌های استاندارد آلومینیومی نفوذناپذیر آزمون (Payne/ASTM Cups)', nameEn: 'ASTM Permeability Test Cups', isRequired: true },
      { name: 'ترازوی آنالیتیکال ۰.۰۰۰۱ گرم', nameEn: 'Analytical Balance (0.0001 g)', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'کلرید کلسیم بی‌آب دانه‌ای (CaCl2 Desiccant)', nameEn: 'Anhydrous Calcium Chloride', grade: 'Pure Desiccant Grade' },
      { name: 'موم درزگیر پارافین-میکروکریستالین آب‌بندی', nameEn: 'Sealing Wax (Paraffin-Microcrystalline Blend)', grade: 'Technical Grade' }
    ],
    samplePreparation: 'برش دیسک‌های بدون تاخوردگی، سوراخ یا خط و خش از فیلم با ضخامت‌سنجی دقیق در ۵ نقطه.',
    solutionsPreparation: 'خشک کردن کلرید کلسیم در آون ۲۰۰ درجه به مدت ۲ ساعت قبل از استفاده.',
    environmentalConditions: {
      temperatureRange: 'دمای محفظه آزمون: ۳۸.۰ ± ۰.۵ درجه سلسیوس',
      relativeHumidity: 'رطوبت نسبی محفظه: ۹۰.۰ ± ۲.۰ درصد'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'پر کردن فنجان و آب‌بندی با فیلم',
        description: 'ریختن کلرید کلسیم تا عمق ۶ میلی‌متری زیر لبه، قرار دادن فیلم و درزگیری کامل لبه‌ها با موم مذاب.'
      },
      {
        stepNumber: 2,
        title: 'قرار دادن در چمبر و توزین دوره‌ای',
        description: 'توزین اولیه فنجان و قرار دادن در محفظه ۳۸ درجه و ۹۰٪ رطوبت؛ توزین هر ۲۴ ساعت یکبار تا ۳ الی ۵ روز.'
      }
    ],
    calculations: {
      formulaTitleFa: 'محاسبه نرخ نفوذ بخار آب (WVTR)',
      formulaExpression: 'WVTR = (G / t) / A',
      variables: [
        { symbol: 'WVTR', name: 'نرخ انتقال بخار آب', unit: 'g / (m² · 24h)' },
        { symbol: 'G/t', name: 'شیب افزایش جرم در واحد زمان در حالت پایا', unit: 'g / 24h' },
        { symbol: 'A', name: 'مساحت سطح موثر در معرض آزمون فنجان', unit: 'm²' }
      ]
    },
    reporting: {
      unitOfMeasurement: 'g / (m² · 24h)',
      decimalPrecision: 1,
      reportTemplateGuidance: 'گزارش میانگین نرخ نفوذ به همراه دما، رطوبت نسبی و ضخامت فیلم بر حسب میکرومتر.'
    },
    potentialErrors: [
      'نقص در موم‌کشی لبه‌های فنجان و نشت رطوبت از کناره‌ها',
      'اشباع شدن کلرید کلسیم به دلیل طولانی شدن بیش از حد زمان آزمون'
    ],
    safetyNotes: [
      'مراقبت هنگام کار با موم مذاب داغ به منظور جلوگیری از سوختگی پوستی.'
    ],
    standardReference: {
      organization: 'ASTM',
      standardNumber: 'ASTM E96 / E96M (معادل ISO 2528)',
      titleFa: 'روش‌های استاندارد تعیین انتقال بخار آب از مواد بسته‌بندی',
      titleEn: 'Standard Test Methods for Gravimetric Determination of Water Vapor Transmission Rate of Materials',
      publicationYear: '2022',
      jurisdiction: 'international_foreign',
      isOfficialAdopted: false
    },
    sources: [
      {
        sourceId: 'src_astm_e96',
        citationShort: 'ASTM E96 / E96M-22',
        fullTitle: 'Standard Test Methods for Gravimetric Determination of Water Vapor Transmission Rate of Materials',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['بسته‌بندی', 'WVTR', 'نفوذپذیری بخار آب', 'ASTM E96', 'ISO 2528'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 8. Oils & Fats (روغن‌ها و چربی‌ها)
  {
    id: 'exp_fat_peroxide_value_08',
    code: 'EXP-FAT-008',
    titleFa: 'اندازه‌گیری عدد پراکسید در روغن‌ها و چربی‌های خوراکی',
    titleEn: 'Determination of Peroxide Value (PV) in Animal and Vegetable Fats and Oils (Iodometric Endpoint)',
    domain: 'oils_fats',
    objective: 'سنجش غلظت ترکیبات اولیه اکسیداسیون لیپیدی (هیدروپراکسیدها) جهت پایش تازگی و پایداری اکسیداتیو چربی‌ها',
    scope: 'انواع روغن‌های گیاهی خام و تصفیه‌شده، مارگارین، چربی‌های حیوانی و روغن‌های سرخ‌کردنی',
    principle: 'واکنش هیدروپراکسیدهای موجود در نمونه روغن با یون‌های یدید در محیط اسیدی استیک-ایزواکتان در تاریکی و آزادسازی ید مولکولی ($I_2$)؛ تیتراسیون ید با محلول تیوسولفات سدیم استاندارد در حضور معرف نشاسته.',
    equipment: [
      { name: 'ارلن‌های درب سمباده‌ای ۲۵۰ میلی‌لیتری فاقد نشتی', nameEn: 'Glass-stoppered Conical Flasks 250 mL', isRequired: true },
      { name: 'بورت میکرو کالیبره ۵ یا ۱۰ میلی‌لیتر با دقت ۰.۰۱ میلی‌لیتر', nameEn: 'Micro-Burette (0.01 mL)', isRequired: true },
      { name: 'استوانه‌های مدرج و پیپت‌های سرولوژی دقیق', nameEn: 'Graduated Cylinders & Pipettes', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'مخلوط حلال اسید استیک گلاسیال و ایزواکتان (۳:۲ حجمی)', nameEn: 'Glacial Acetic Acid / Isooctane (3:2 v/v)', grade: 'AR Grade', hazardClass: 'خورنده و اشتعال‌پذیر' },
      { name: 'محلول اشباع یدید پتاسیم تازه (KI)', nameEn: 'Saturated Potassium Iodide Solution', grade: 'AR Grade (Iodine-free)', storageCondition: 'تازه تهیه شده در تاریکی' },
      { name: 'محلول تیوسولفات سدیم ۰.۰۱ نرمال استاندارد (Na2S2O3)', nameEn: 'Standard Sodium Thiosulfate (0.01 N)', grade: 'Volumetric Standard' },
      { name: 'شناساگر محلول نشاسته ۱٪', nameEn: 'Starch Indicator Solution 1%', grade: 'Freshly Prepared' }
    ],
    samplePreparation: 'نمونه روغن باید در دمای اتاق کاملاً یکدست و زلال باشد. در صورت لزوم در دمای ۴۰ درجه گرم و از کاغذ صافی عبور داده شود.',
    solutionsPreparation: 'محلول اشباع KI باید بلافاصله قبل از آزمون آماده شود و تست عدم حضور ید آزاد با نشاسته روی آن انجام گیرد.',
    environmentalConditions: {
      temperatureRange: '۲۰ الی ۲۵ درجه سلسیوس در محیط کم‌نور و دور از تابش مستقیم خورشید',
      specialNotes: 'مرحله واکنش ید با روغن باید در تاریکی کامل (داخل کمد یا پوشش آلومینیومی) انجام گیرد.'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'توزین نمونه و افزودن حلال',
        description: 'حدود ۵.۰ گرم نمونه روغن را با دقت ۰.۰۰۱ گرم در ارلن درب سمباده‌ای وزن کرده و ۵۰ میلی‌لیتر مخلوط حلال استیک-ایزواکتان اضافه کنید تا حل شود.'
      },
      {
        stepNumber: 2,
        title: 'افزودن یدید پتاسیم و واکنش در تاریکی',
        description: 'مقدار ۰.۵ میلی‌لیتر محلول اشباع KI تازه اضافه کرده، درب ارلن را بسته و به مدت ۱ دقیقه به شدت تکان دهید؛ سپس دقیقاً ۱ دقیقه در تاریکی قرار دهید.'
      },
      {
        stepNumber: 3,
        title: 'افزودن آب و تیتراسیون با تیوسولفات',
        description: 'بلافاصله ۳۰ میلی‌لیتر آب مقطر اضافه کنید. با تیوسولفات سدیم ۰.۰۱ نرمال تیتر کنید تا رنگ زرد کم‌رنگ شود؛ سپس ۰.۵ میلی‌لیتر شناساگر نشاسته اضافه کرده و تا بی‌رنگ شدن کامل تیتر نمایید. آزمون شاهد را نیز اجرا کنید.'
      }
    ],
    calculations: {
      formulaTitleFa: 'محاسبه عدد پراکسید (PV)',
      formulaExpression: 'PV = ((V - V0) * c * 1000) / m',
      variables: [
        { symbol: 'PV', name: 'عدد پراکسید', unit: 'mEq O2 / kg' },
        { symbol: 'V', name: 'حجم تیوسولفات مصرفی برای نمونه', unit: 'mL' },
        { symbol: 'V0', name: 'حجم تیوسولفات مصرفی آزمون شاهد بلانک', unit: 'mL' },
        { symbol: 'c', name: 'غلظت نرمال واقعی تیوسولفات سدیم', unit: 'mol/L (N)' },
        { symbol: 'm', name: 'جرم نمونه روغن وزن شده', unit: 'g' }
      ]
    },
    reporting: {
      unitOfMeasurement: 'mEq O2 / kg (میلی‌اکی‌والان اکسیژن فعال در کیلوگرم روغن)',
      decimalPrecision: 2,
      repeatabilityLimit_r: 'اختلاف بین دو آزمون تکرار همزمان برای PV کمتر از ۲ نباید از ۰.۱۰ تجاوز کند.'
    },
    potentialErrors: [
      'اکسیداسیون یون یدید توسط اکسیژن هوای داخل ارلن در صورت تاخیر در تیتراسیون',
      'حضور ید آزاد در محلول اشباع KI کهنه'
    ],
    safetyNotes: [
      'اسید استیک گلاسیال به شدت خورنده و بخارات آن سوزاننده مجاری تنفسی است؛ کار فقط زیر هود انجام شود.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 4179 (معادل ISO 3960 / AOCS Cd 8b-90)',
      titleFa: 'روغن‌ها و چربی‌های گیاهی و حیوانی - تعیین عدد پراکسید به روش یدومتری',
      titleEn: 'Animal and vegetable fats and oils - Determination of peroxide value - Iodometric (visual) endpoint determination',
      publicationYear: '1393 (2017)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_4179_pv',
        citationShort: 'استاندارد ملی ایران ۴۱۷۹',
        fullTitle: 'روغن‌ها و چربی‌های گیاهی و حیوانی - تعیین عدد پراکسید',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      },
      {
        sourceId: 'src_iso_3960',
        citationShort: 'ISO 3960:2017',
        fullTitle: 'Animal and vegetable fats and oils — Determination of peroxide value — Iodometric endpoint determination',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['روغن‌ها و چربی‌ها', 'عدد پراکسید', 'PV', 'INSO 4179', 'ISO 3960', 'AOCS Cd 8b-90'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 9. Dairy (لبنیات)
  {
    id: 'exp_dairy_gerber_fat_09',
    code: 'EXP-DRY-009',
    titleFa: 'تعیین درصد چربی در شیر به روش ژربیر (Gerber Fat Method)',
    titleEn: 'Determination of Fat Content in Milk by Gerber Butyrometric Acid Method',
    domain: 'dairy',
    objective: 'سنجش سریع درصد وزنی/حجمی چربی شیر خام و پاستوریزه جهت کنترل کیفیت دریافت و استانداردسازی خط تولید',
    scope: 'شیر خام، شیر پاستوریزه، شیر استریل (UHT) و شیر بازساخته',
    principle: 'تخریب غشای گلبول‌های چربی و حل کردن پروتئین‌های شیر توسط اسید سولفوریک ویژه ژربیر؛ تسهیل جداسازی فاز چربی با الکل ایزوآمیل؛ جداسازی در ستون مدرج بوتیرومتر با نیروی گریز از مرکز در دمای ۶۵ درجه سلسیوس.',
    equipment: [
      { name: 'سانتریفوژ ویژه ژربیر مجهز به گرمکن ۶۵ درجه', nameEn: 'Gerber Centrifuge', specification: 'سرعت ۱۱۰۰ ± ۵۰ دور در دقیقه', isRequired: true },
      { name: 'بوتیرومترهای استاندارد شیر (۰ تا ۸ درصد)', nameEn: 'Gerber Milk Butyrometers (0-8%)', isRequired: true },
      { name: 'حمام آب‌گرم بن‌ماری ۶۵ ± ۲ درجه', nameEn: 'Water Bath 65 °C', isRequired: true },
      { name: 'پیپت کالیبره شیر ۱۰.۷۵ میلی‌لیتر', nameEn: 'Milk Pipette 10.75 mL', isRequired: true },
      { name: 'دیسپنسر ایمن اسید ۱۰ میلی‌لیتر و ایزوآمیل الکل ۱ میلی‌لیتر', nameEn: 'Automatic Dispensers', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'اسید سولفوریک ویژه ژربیر (چگالی ۱.۸۲۰ ± ۰.۰۰۵ در ۲۰ درجه)', nameEn: 'Gerber Sulfuric Acid', grade: 'Gerber Grade', hazardClass: 'خورنده قوی و گرمازا' },
      { name: 'الکل ایزوآمیل فاقد چربی (چگالی ۰.۸۱۱ ± ۰.۰۰۳)', nameEn: 'Amyl Alcohol Fat-free', grade: 'Gerber Grade', hazardClass: 'سمی و اشتعال‌پذیر' }
    ],
    samplePreparation: 'شیر تا دمای ۲۰ الی ۳۰ درجه ملایم گرم شده و به آرامی همگن می‌شود بدون ایجاد کف.',
    solutionsPreparation: 'بررسی عدم حضور چربی در ایزوآمیل الکل.',
    environmentalConditions: {
      temperatureRange: 'دمای محیط ۲۰ الی ۲۵ درجه سلسیوس',
      specialNotes: 'تکان دادن بوتیرومترها به دلیل دمای بالای ۸۰ درجه باید با دستکش و شیلد صورت انجام شود.'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'ریختن اسید سولفوریک',
        description: 'مقدار ۱۰.۰ میلی‌لیتر اسید سولفوریک ژربیر را در بوتیرومتر تمیز و خشک بریزید.'
      },
      {
        stepNumber: 2,
        title: 'افزودن نمونه شیر و ایزوآمیل الکل',
        description: 'مقدار ۱۰.۷۵ میلی‌لیتر شیر را به آرامی روی لایه اسید تخلیه کرده و ۱.۰ میلی‌لیتر ایزوآمیل الکل روی آن بریزید.'
      },
      {
        stepNumber: 3,
        title: 'بستن درپوش، اختلاط شدید و سانتریفوژ',
        description: 'درپوش را بسته، به شدت تکان دهید تا پروتئین‌ها حل شوند؛ سپس ۴ دقیقه در ۱۱۰۰ دور سانتریفوژ کنید.'
      },
      {
        stepNumber: 4,
        title: 'قرائت در بن‌ماری ۶۵ درجه',
        description: 'بوتیرومتر را ۵ دقیقه در بن‌ماری ۶۵ درجه قرار داده و درصد چربی را قرائت فرمایید.'
      }
    ],
    calculations: {
      formulaTitleFa: 'قرائت مستقیم درصد چربی از ستون مدرج بوتیرومتر',
      formulaExpression: 'Fat% = Direct Scale Reading (Bottom Meniscus to Interface)',
      variables: [
        { symbol: 'Fat%', name: 'درصد چربی وزنی/حجمی شیر', unit: '% (g/100mL)' }
      ]
    },
    reporting: {
      unitOfMeasurement: '% (w/v) چربی شیر',
      decimalPrecision: 2,
      repeatabilityLimit_r: 'اختلاف دو آزمون همزمان نباید از ۰.۰۵٪ تجاوز کند.'
    },
    potentialErrors: [
      'سرد شدن بوتیرومتر قبل از قرائت چربی',
      'چگالی نامناسب اسید سولفوریک'
    ],
    safetyNotes: [
      'واکنش اسید و شیر به شدت گرمازا است؛ استفاده از شیلد صورت و دستکش الزامی است.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 366 (معادل ISO 2446 / IDF 105)',
      titleFa: 'شیر و فرآورده‌های آن - تعیین مقدار چربی به روش ژربیر',
      titleEn: 'Milk - Determination of fat content - Gerber method',
      publicationYear: '1392 (2013)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_366',
        citationShort: 'استاندارد ملی ایران ۳۶۶',
        fullTitle: 'شیر و فرآورده‌های شیری - تعیین چربی به روش ژربیر',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['لبنیات', 'شیر', 'چربی ژربیر', 'Gerber', 'INSO 366', 'ISO 2446'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 10. Cereals (غلات)
  {
    id: 'exp_cer_falling_number_10',
    code: 'EXP-CER-010',
    titleFa: 'تعیین عدد فالینگ (Falling Number) جهت ارزیابی فعالیت آنزیم آلفا-آمیلاز در آرد و گندم',
    titleEn: 'Determination of the Falling Number according to Hagberg-Perten in Wheat and Flour',
    domain: 'cereals',
    objective: 'ارزیابی میزان جوانه زدگی دانه گندم و فعالیت آنزیم آلفا-آمیلاز در شکستن نشاسته جهت ارزیابی کیفیت نانوایی آرد',
    scope: 'دانه گندم، چاودار، آرد گندم، سمولینا و بهبوددهنده‌های آنزیمی نان',
    principle: 'ژلاتیناسیون سریع سوسپانسیون آرد در آب مقطر در حمام آب جوش ۱۰۰ درجه و اندازه‌گیری زمان کل (بر حسب ثانیه) لازم برای همزدن و سپس سقوط آزاد میله ویسکومتر استاندارد در ژل حاصل بر اثر فعالیت هیدرولیتیک آنزیم آلفا-آمیلاز.',
    equipment: [
      { name: 'دستگاه استاندارد فالینگ نامبر هاگبرگ-پرتن (Perten Falling Number System)', nameEn: 'Hagberg-Perten Falling Number Apparatus', specification: 'مطابق با الزامات استاندارد ISO 3093', isRequired: true },
      { name: 'لوله‌های ویسکومتر شیشه‌ای کالیبره فالینگ با میله همزن استاندارد', nameEn: 'Precision Viscometer Tubes & Stirrer', isRequired: true },
      { name: 'آسیاب آزمایشگاهی چکش‌دار با الک ۰.۸ میلی‌متر (Perten 3100/120)', nameEn: 'Laboratory Hammer Mill', isRequired: true },
      { name: 'ترازوی دیجیتال با دقت ۰.۰۱ گرم', nameEn: 'Precision Balance (0.01 g)', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'آب مقطر درجه ۳ مطابق با ISO 3696', nameEn: 'Distilled Water (Grade 3)', grade: 'Laboratory Grade' }
    ],
    samplePreparation: 'نمونه آرد باید رطوبت‌سنجی شود. وزن نمونه آرد بر مبنای رطوبت استاندارد ۱۴٪ از جدول تبدیل استاندارد استخراج می‌شود (معمولاً ۷.۰۰ گرم برای آرد با رطوبت ۱۴٪).',
    solutionsPreparation: 'تنظیم سطح آب حمام جوش و اطمینان از جوشش پایدار در ۱۰۰ درجه سلسیوس.',
    environmentalConditions: {
      temperatureRange: 'دمای محیط ۲۰ الی ۲۵ درجه سلسیوس',
      specialNotes: 'در ارتفاعات بالاتر از سطح دریا، به دلیل افت نقطه جوش آب باید از سیستم تصحیح فشار اتمسفر دستگاه استفاده شود.'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'توزین و افزودن آب',
        description: 'وزن دقیق نمونه آرد تصحیح شده بر اساس رطوبت را در لوله ویسکومتر ریخته و ۲۵.۰ میلی‌لیتر آب مقطر ۲۰ درجه اضافه کنید.'
      },
      {
        stepNumber: 2,
        title: 'همزدن شدید سوسپانسیون',
        description: 'درپوش لاستیکی را گذاشته و لوله را ۲۰ الی ۲۵ بار به شدت تکان دهید تا سوسپانسیون کاملاً یکنواخت و بدون کلوخه شود.'
      },
      {
        stepNumber: 3,
        title: 'قرار دادن در حمام جوش و شروع آزمون',
        description: 'میله همزن را داخل لوله قرار داده، درپوش را برداشته و بلافاصله لوله را در جایگاه حمام جوش دستگاه قرار داده و کلید شروع را فشار دهید.'
      }
    ],
    calculations: {
      formulaTitleFa: 'ثبت مستقیم عدد فالینگ (Falling Number)',
      formulaExpression: 'FN = t_stirring (60s) + t_falling (s)',
      variables: [
        { symbol: 'FN', name: 'عدد فالینگ بر حسب ثانیه', unit: 's' },
        { symbol: 't_stirring', name: 'زمان همزدن اتوماتیک اولیه', unit: '60 s' },
        { symbol: 't_falling', name: 'زمان سقوط میله در ژل نشاسته', unit: 's' }
      ],
      guidanceText: 'عدد فالینگ کمتر از ۲۰۰ نشان‌دهنده فعالیت بالای آمیلاز (جوانه‌زدگی) و بالای ۳۵۰ نشان‌دهنده فعالیت بسیار ضعیف آنزیمی است (محدوده ایده‌آل نانوایی: ۲۲۰ الی ۲۸۰ ثانیه).'
    },
    reporting: {
      unitOfMeasurement: 'ثانیه (s)',
      decimalPrecision: 0,
      repeatabilityLimit_r: 'اختلاف بین دو آزمون تکرار همزمان نباید از ۵٪ میانگین بیشتر باشد.'
    },
    potentialErrors: [
      'عدم تصحیح وزن آرد بر اساس رطوبت واقعی نمونه',
      'وجود کلوخه‌های حل‌نشده آرد در ته لوله ویسکومتر'
    ],
    safetyNotes: [
      'حمام آب دستگاه در دمای جوش ۱۰۰ درجه کار می‌کند؛ مراقبت در برابر بخار داغ الزامی است.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 4175 (معادل ISO 3093 / ICC 107/1)',
      titleFa: 'گندم و آرد گندم - تعیین عدد فالینگ به روش هاگبرگ - پرتن',
      titleEn: 'Wheat and wheat flour - Determination of the falling number according to Hagberg-Perten',
      publicationYear: '1392 (2009)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_4175',
        citationShort: 'استاندارد ملی ایران ۴۱۷۵',
        fullTitle: 'گندم و آرد گندم - تعیین عدد فالینگ به روش هاگبرگ-پرتن',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['غلات', 'آرد', 'عدد فالینگ', 'Falling Number', 'INSO 4175', 'ISO 3093', 'آمیلاز'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 11. Meat Products (گوشت و فرآورده‌های گوشتی)
  {
    id: 'exp_meat_soxhlet_fat_11',
    code: 'EXP-MEA-011',
    titleFa: 'اندازه‌گیری چربی کل در گوشت و فرآورده‌های گوشتی به روش سوکسله و هیدرولیز اسیدی (Weibull-Stoldt)',
    titleEn: 'Determination of Total Fat Content in Meat and Meat Products by Acid Hydrolysis & Soxhlet Extraction',
    domain: 'meat_products',
    objective: 'استخراج کمی چربی کل (چربی آزاد و متصل به پروتئین) در فرآورده‌های گوشتی نظیر سوسیس، کالباس و همبرگر',
    scope: 'گوشت تازه، گوشت چرخ‌کرده، سوسیس، کالباس، ناگت، همبرگر و فرآورده‌های خمیری پروتئینی',
    principle: 'هیدرولیز اسیدی نمونه با اسید کلریدریک جوشان ۴ مولار جهت آزادسازی چربی‌های متصل به پروتئین و کربوهیدرات؛ فیلتر کردن و خشک کردن رسوب چربی روی کاغذ صافی؛ استخراج مداوم چربی با اتر دوپترول در دستگاه عصاره‌گیر سوکسله و وزن‌سنجی چربی پس از تبخیر کامل حلال.',
    equipment: [
      { name: 'دستگاه عصاره‌گیر سوکسله (Soxhlet Extractor Unit)', nameEn: 'Soxhlet Extraction System', specification: 'حجم بالن ۲۵۰ میلی‌لیتر و مبرد رفلاکس', isRequired: true },
      { name: 'حمام آب‌گرم یا گرمکن برقی ایمن ضد انفجار (Heating Mantle)', nameEn: 'Explosion-proof Heating Unit', isRequired: true },
      { name: 'کارتوش‌های استخراج بدون چربی (Extraction Thimbles)', nameEn: 'Fat-free Cellulose Thimbles', isRequired: true },
      { name: 'آون خشک‌کن با دمای ۱۰۳ ± ۲ درجه سلسیوس', nameEn: 'Drying Oven 103 °C', isRequired: true },
      { name: 'ترازوی آنالیتیکال ۰.۰۰۰۱ گرم', nameEn: 'Analytical Balance (0.0001 g)', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'اسید کلریدریک ۴ مولار (HCl)', nameEn: 'Hydrochloric Acid (approx. 4 M)', grade: 'AR Grade', hazardClass: 'خورنده' },
      { name: 'اتر نفت یا پترولیوم اتر (دامنه جوشش ۴۰ تا ۶۰ درجه)', nameEn: 'Petroleum Ether (BP 40-60 °C)', grade: 'AR Grade', hazardClass: 'فوق‌العاده اشتعال‌پذیر و فرار' },
      { name: 'کاغذ صافی بدون خاکستر و سنگ جوش خنثی', nameEn: 'Ashless Filter Paper & Boiling Chips', grade: 'Laboratory Grade' }
    ],
    samplePreparation: 'نمونه گوشتی حداقل دوبار از چرخ‌گوشت آزمایشگاهی با منافذ ۴ میلی‌متر عبور داده شده و کاملاً همگن گردد.',
    solutionsPreparation: 'خشک کردن بالن‌های سوکسله در آون ۱۰۳ درجه و ثبت وزن ثابت (m0).',
    environmentalConditions: {
      temperatureRange: 'دمای محیط آزمایشگاه',
      ventilationRequirement: 'به دلیل بخارات پترولیوم اتر کار حتماً زیر هود ضد جرقه انجام شود.'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'هیدرولیز اسیدی',
        description: 'وزن کردن ۳ الی ۵ گرم نمونه همگن، افزودن ۵۰ میلی‌لیتر HCl 4M و جوشاندن ملایم به مدت ۶۰ دقیقه روی شعله یا هیتر.'
      },
      {
        stepNumber: 2,
        title: 'صاف کردن و خشک‌سازی رسوب',
        description: 'صاف کردن محتویات از طریق کاغذ صافی مرطوب، شستشو با آب مقطر داغ تا رفع اسیدیته و خشک کردن کاغذ صافی در آون ۱۰۳ درجه به مدت ۹۰ دقیقه.'
      },
      {
        stepNumber: 3,
        title: 'استخراج سوکسله با پترولیوم اتر',
        description: 'قرار دادن کاغذ صافی در کارتوش و استخراج در دستگاه سوکسله با پترولیوم اتر به مدت ۴ الی ۶ ساعت (حداقل ۱۵ الی ۲۰ سیکل ریزش).'
      },
      {
        stepNumber: 4,
        title: 'تبخیر حلال و توزین چربی',
        description: 'بازیابی حلال، خشک کردن بالن حاوی چربی در آون ۱۰۳ درجه به مدت ۶۰ دقیقه، خنک کردن در دسیکاتور و توزین با دقت ۰.۰۰۰۱ گرم (m1).'
      }
    ],
    calculations: {
      formulaTitleFa: 'محاسبه درصد چربی کل در نمونه گوشت',
      formulaExpression: '%Fat = ((m1 - m0) / m) * 100',
      variables: [
        { symbol: '%Fat', name: 'درصد چربی تام', unit: '%' },
        { symbol: 'm1', name: 'جرم بالن حاوی چربی استخراج شده پس از خشک‌شدن', unit: 'g' },
        { symbol: 'm0', name: 'جرم بالن خالی خشک شده اولیه', unit: 'g' },
        { symbol: 'm', name: 'جرم نمونه اولیه وزن شده', unit: 'g' }
      ]
    },
    reporting: {
      unitOfMeasurement: '% (w/w) چربی کل',
      decimalPrecision: 2,
      repeatabilityLimit_r: 'اختلاف بین دو آزمون تکرار همزمان نبیند از ۰.۳۰٪ تجاوز نماید.'
    },
    potentialErrors: [
      'خشک نشدن کامل رسوب هیدرولیز شده قبل از استخراج سوکسله (حضور آب مانع نفوذ پترولیوم اتر می‌شود)',
      'تعداد سیکل‌های ناکافی ریزش سوکسله'
    ],
    safetyNotes: [
      'پترولیوم اتر به شدت آتش‌گیر است؛ از وجود هرگونه شعله یا هیتر با المنت باز اکیداً خودداری شود.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 742 (معادل ISO 1443 / AOAC 960.39)',
      titleFa: 'گوشت و فرآورده‌های آن - تعیین مقدار چربی کل',
      titleEn: 'Meat and meat products - Determination of total fat content',
      publicationYear: '1391 (2012)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_742',
        citationShort: 'استاندارد ملی ایران ۷۴۲',
        fullTitle: 'گوشت و فرآورده‌های آن - تعیین چربی کل به روش سوکسله و هیدرولیز اسیدی',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['گوشت', 'فرآورده‌های گوشتی', 'چربی کل', 'سوکسله', 'INSO 742', 'ISO 1443'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 12. Beverages (نوشیدنی‌ها)
  {
    id: 'exp_bev_brix_refractometry_12',
    code: 'EXP-BEV-012',
    titleFa: 'تعیین مقدار مواد جامد محلول کل (بریکس - Brix) با رفراکتومتر در نوشیدنی‌ها و آبمیوه‌ها',
    titleEn: 'Determination of Soluble Solids Content in Fruit and Vegetable Juices by Refractometric Method',
    domain: 'beverages',
    objective: 'اندازه‌گیری سریع درصد وزنی قندها و مواد جامد محلول کل بر حسب درجه بریکس جهت کنترل فرمولاسیون و استاندارد آبمیوه‌ها',
    scope: 'آبمیوه‌ها، کنسانتره‌ها، نوشابه‌های گازدار، شربت‌ها و نوشیدنی‌های مالت',
    principle: 'اندازه‌گیری ضریب شکست نور نمونه در دمای مرجع ۲۰.۰ درجه سلسیوس با رفراکتومتر نوری یا دیجیتال مجهز به تصحیح خودکار دما (ATC) و تبدیل به مقیاس درجه بریکس (°Bx).',
    equipment: [
      { name: 'رفراکتومتر دیجیتال رومیزی یا دستی با دقت ۰.۰۵ درجه بریکس', nameEn: 'Digital Benchtop / Handheld Refractometer', specification: 'محدوده ۰ تا ۸۵ بریکس با تصحیح خودکار دما (ATC)', isRequired: true },
      { name: 'دستمال تنظیف بدون پرز اپتیکی', nameEn: 'Optical Cleaning Tissue', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'آب مقطر دیونیزه درجه ۱ جهت کالیبراسیون نقطه صفر', nameEn: 'Deionized Distilled Water', grade: 'Pure Grade' },
      { name: 'محلول‌های استاندارد ساکارز معتبر CRM', nameEn: 'Certified Sucrose Standard Solutions', grade: 'CRM Grade' }
    ],
    samplePreparation: 'نمونه نوشیدنی باید فاقد گاز دی‌اکسید کربن (گاززدایی شده با اولتراسونیک یا کاغذ صافی) و فاقد ذرات معلق درشت باشد.',
    solutionsPreparation: 'تنظیم نقطه صفر رفراکتومتر با آب مقطر در ۲۰ درجه سلسیوس.',
    environmentalConditions: {
      temperatureRange: 'دمای محیط ۲۰.۰ ± ۰.۵ درجه سلسیوس',
      specialNotes: 'در صورت عدم وجود حسگر ATC، ضریب تصحیح دمایی استاندارد ICUMSA اعمال گردد.'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'گاززدایی و آماده‌سازی نمونه',
        description: 'در مورد نوشیدنی‌های گازدار، نمونه را به مدت ۳ دقیقه در حمام اولتراسونیک قرار داده یا ۵ بار از کاغذ صافی عبور دهید تا حباب‌های گاز کاملاً خارج شوند.'
      },
      {
        stepNumber: 2,
        title: 'قرار دادن نمونه روی منشور و قرائت',
        description: 'سطح منشور را تمیز و خشک کنید. ۲ الی ۳ قطره نمونه روی منشور ریخته و عدد بریکس را قرائت فرمایید.'
      }
    ],
    calculations: {
      formulaTitleFa: 'تصحیح دمایی درجه بریکس در صورت نیاز',
      formulaExpression: 'Brix_20 = Brix_T + Delta(T)',
      variables: [
        { symbol: 'Brix_20', name: 'درجه بریکس تصحیح شده در دمای مرجع ۲۰ درجه', unit: '°Bx' },
        { symbol: 'Brix_T', name: 'درجه بریکس قرائت شده در دمای T', unit: '°Bx' },
        { symbol: 'Delta(T)', name: 'فاکتور تصحیح دمایی جدول استاندارد ICUMSA', unit: '°Bx' }
      ]
    },
    reporting: {
      unitOfMeasurement: 'درجه بریکس (°Bx)',
      decimalPrecision: 1,
      repeatabilityLimit_r: 'اختلاف دو قرائت پیاپی نباید از ۰.۱ بریکس بیشتر باشد.'
    },
    potentialErrors: [
      'وجود حباب‌های گاز CO2 روی سطح منشور نوری',
      'وجود خط و خش روی منشور رفراکتومتر'
    ],
    safetyNotes: [
      'از لمس منشور نوری با اجسام فلزی و تیز خودداری شود.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 2685 (معادل ISO 2173 / IFU No. 8)',
      titleFa: 'فرآورده‌های میوه و سبزی - تعیین مواد جامد محلول - روش رفراکتومتری',
      titleEn: 'Fruit and vegetable products - Determination of soluble solids content - Refractometric method',
      publicationYear: '1393 (2014)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_2685',
        citationShort: 'استاندارد ملی ایران ۲۶۸۵',
        fullTitle: 'فرآورده‌های میوه و سبزی - تعیین مواد جامد محلول به روش رفراکتومتری',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['نوشیدنی‌ها', 'آبمیوه', 'بریکس', 'Brix', 'رفراکتومتر', 'INSO 2685', 'ISO 2173'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 13. Fruits & Vegetables (میوه و سبزی)
  {
    id: 'exp_fru_ascorbic_acid_13',
    code: 'EXP-FRU-013',
    titleFa: 'سنجش مقدار ویتامین C (اسید آسکوربیک) با روش تیتراسیون ۲ و ۶ دی‌کلروفنل ایندوفنول (DCPIP)',
    titleEn: 'Determination of Vitamin C (Ascorbic Acid) in Fruits and Vegetables by 2,6-Dichlorophenolindophenol Titration',
    domain: 'fruits_vegetables',
    objective: 'اندازه‌گیری کمی مقدار اسید ال-آسکوربیک به عنوان شاخص ارزش تغذیه‌ای و پایداری فرآوری در محصولات باغبانی',
    scope: 'میوه‌های تازه، سبزیجات، پوره، کنسانتره، کمپوت و آبمیوه‌های طبیعی',
    principle: 'اکسیداسیون اسید آسکوربیک به اسید دهیدروآسکوربیک توسط معرف رنگزای ۲ و ۶ دی‌کلروفنل ایندوفنول در محیط اسیدی (اسید متافسفریک-اسید استیک) و احیای رنگزا به ترکیب بی‌رنگ؛ ظهور رنگ صورتی کم‌رنگ ناشی از مازاد رنگزا در نقطه پایانی تیتراسیون.',
    equipment: [
      { name: 'میکروبورت ۱۰ میلی‌لیتری با دقت ۰.۰۲ میلی‌لیتر', nameEn: 'Micro-Burette 10 mL', isRequired: true },
      { name: 'مخلوط‌کن و هموژنایزر آزمایشگاهی با تیغه استیل', nameEn: 'High-speed Lab Blender', isRequired: true },
      { name: 'قیف شیشه‌ای و کاغذ صافی چین‌دار سریع', nameEn: 'Glass Funnel & Rapid Filter Paper', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'محلول استخراج اسید متافسفریک ۳٪ در اسید استیک ۸٪ (HPO3-CH3COOH)', nameEn: 'Metaphosphoric Acid - Acetic Acid Extracting Solution', grade: 'AR Grade', storageCondition: 'یخچال در ظرف تیره' },
      { name: 'رنگزای ۲ و ۶ دی‌کلروفنل ایندوفنول استاندارد شده (DCPIP)', nameEn: 'Standard 2,6-Dichloroindophenol Sodium Salt Solution', grade: 'AR Analytical Standard', storageCondition: 'ظرف قهوه‌ای در دمای ۴ درجه حداکثر ۱ هفته' },
      { name: 'اسید ال-آسکوربیک استاندارد فوق‌خالص (USP/CRM)', nameEn: 'L-Ascorbic Acid Reference Standard', grade: 'CRM Grade' }
    ],
    samplePreparation: 'توزین فوری نمونه و مخلوط کردن با محلول اسید متافسفریک جهت مهار سریع آنزیم آسکوربات اکسیداز و صاف کردن سریع عصاره.',
    solutionsPreparation: 'استانداردسازی روزانه محلول رنگزای DCPIP با محلول استاندارد اسید آسکوربیک تازه.',
    environmentalConditions: {
      temperatureRange: 'دمای محیط کم‌نور و خنک',
      specialNotes: 'اسید آسکوربیک به نور و اکسیژن هوا حساس است؛ مراحل باید سریع و دور از نور شدید انجام شود.'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'استخراج و صاف کردن عصاره',
        description: 'وزن کردن ۵۰ گرم نمونه میوه، همگن‌سازی با ۱۰۰ میلی‌لیتر محلول متافسفریک، انتقال به بالن ۲۵۰ میلی‌لیتر و صاف کردن.'
      },
      {
        stepNumber: 2,
        title: 'تیتراسیون با رنگزای DCPIP',
        description: 'برداشتن ۱۰ میلی‌لیتر از عصاره صاف شده در ارلن و تیتراسیون سریع با رنگزای DCPIP تا ظهور رنگ صورتی ملایم پایدار به مدت ۱۵ ثانیه.'
      }
    ],
    calculations: {
      formulaTitleFa: 'محاسبه میزان ویتامین C بر حسب میلی‌گرم در ۱۰۰ گرم نمونه',
      formulaExpression: 'VitC (mg/100g) = ((V - V0) * F * (V_total / V_aliquot) * 100) / m',
      variables: [
        { symbol: 'VitC', name: 'میزان اسید آسکوربیک', unit: 'mg / 100g' },
        { symbol: 'V', name: 'حجم رنگزای مصرفی برای نمونه', unit: 'mL' },
        { symbol: 'V0', name: 'حجم رنگزای مصرفی آزمون شاهد بلانک', unit: 'mL' },
        { symbol: 'F', name: 'فاکتور عیار رنگزا (میلی‌گرم اسید آسکوربیک معادل ۱ میلی‌لیتر رنگزا)', unit: 'mg/mL' },
        { symbol: 'V_total', name: 'حجم کل عصاره استخراجی', unit: '250 mL' },
        { symbol: 'V_aliquot', name: 'حجم برداشته شده برای تیتراسیون', unit: '10 mL' },
        { symbol: 'm', name: 'جرم نمونه وزن شده', unit: 'g' }
      ]
    },
    reporting: {
      unitOfMeasurement: 'mg / 100g',
      decimalPrecision: 2,
      repeatabilityLimit_r: 'اختلاف بین دو آزمون تکرار نباید از ۲٪ بیشتر باشد.'
    },
    potentialErrors: [
      'تخریب آنزیمی اسید آسکوربیک در صورت تاخیر در افزودن اسید متافسفریک',
      'تغییر فاکتور رنگزا در صورت نگهداری در مجاورت نور'
    ],
    safetyNotes: [
      'اسید متافسفریک و استیک خورنده هستند؛ استفاده از دستکش الزامی است.'
    ],
    standardReference: {
      organization: 'AOAC',
      standardNumber: 'AOAC Official Method 967.21 (معادل INSO 5681)',
      titleFa: 'تعیین اسید آسکوربیک (ویتامین C) در فرآورده‌های غذایی به روش تیتراسیون ۲ و ۶ دی‌کلروفنل ایندوفنول',
      titleEn: 'AOAC 967.21 - Ascorbic Acid in Vitamin Preparations and Juices',
      publicationYear: '2019',
      jurisdiction: 'international_foreign',
      isOfficialAdopted: false
    },
    sources: [
      {
        sourceId: 'src_aoac_967_21',
        citationShort: 'AOAC Method 967.21',
        fullTitle: 'AOAC Official Method 967.21 - Ascorbic Acid in Vitamin Preparations and Juices',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['میوه و سبزی', 'ویتامین C', 'اسید آسکوربیک', 'AOAC 967.21', 'INSO 5681', 'DCPIP'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 14. Canned Foods (کنسروها)
  {
    id: 'exp_can_double_seam_14',
    code: 'EXP-CAN-014',
    titleFa: 'آزمون ارزیابی و کنترل دوخت مضاعف قوطی‌های فلزی کنسرو (Double Seam Inspection)',
    titleEn: 'Double Seam Dimensional and Visual Evaluation for Canned Food Containers',
    domain: 'canned_foods',
    objective: 'ارزیابی یکپارچگی مکانیکی، درهم‌رفتگی قلاب‌ها (Overlap) و آب‌بندی هوابند قوطی‌های فلزی جهت تضمین نفوذناپذیری میکروبی پس از فرآیند حرارتی',
    scope: 'قوطی‌های فلزی دو تکه و سه تکه کنسرو مواد غذایی، قوطی‌های رب، تن ماهی، کمپوت و گوشتی',
    principle: 'برش مقطعی و اندازه‌گیری ابعاد هندسی کلیدی دوخت مضاعف (شامل طول دوخت، ضخامت دوخت، قلاب بدنه، قلاب سر، فضای خالی و درصد هم‌پوشانی Overlap%) به وسیله میکرومتر مخصوص و پروژکتور نوری دوخت (Seam Scope / Seam Projector).',
    equipment: [
      { name: 'پروژکتور تصویری بزرگنمایی دوخت قوطی (Seam Projector/Seam Scope)', nameEn: 'Video Seam Projector System', specification: 'بزرگنمایی حداقل ۳۰ تا ۵۰ برابر مجهز به نرم‌افزار اندازه‌گیری دیجیتال', isRequired: true },
      { name: 'اره برش مقطعی دو تیغه مخصوص قوطی کنسرو (Double Blade Seam Saw)', nameEn: 'Pneumatic Seam Saw', isRequired: true },
      { name: 'میکرومتر مخصوص اندازه‌گیری ضخامت و طول دوخت (Seam Micrometer)', nameEn: 'Seam Micrometer (0.01 mm)', isRequired: true },
      { name: 'کولیس یا عمق‌سنج دیجیتال فرورفتگی سر قوطی (Countersink Gauge)', nameEn: 'Countersink Gauge (0.01 mm)', isRequired: true }
    ],
    reagentsAndMaterials: [],
    samplePreparation: 'قوطی‌های کنسرو خالی یا پر شده پس از دستگاه درب‌بندی (Seamer) با نشانه‌گذاری موقعیت اتصال بدنه (Side Seam).',
    solutionsPreparation: 'کالیبراسیون میکرومتر و پروژکتور نوری با بلوک کالیبراسیون استاندارد.',
    environmentalConditions: {
      temperatureRange: 'دمای محیط کارگاه کنترل کیفیت کنسرو'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'اندازه‌گیری‌های بیرونی بدون تخریب',
        description: 'اندازه‌گیری ضخامت دوخت ($T$)، طول دوخت ($W$) و عمق فرورفتگی سر قوطی ($C$) در ۳ نقطه با زاویه ۱۲۰ درجه با میکرومتر.'
      },
      {
        stepNumber: 2,
        title: 'برش مقطعی دوخت با اره دو تیغه',
        description: 'ایجاد برش مقطعی شعاعی در فاصله حداقل ۲۵ میلی‌متری از درز جوش بدنه.'
      },
      {
        stepNumber: 3,
        title: 'پروجکشن نوری و سنجش ابعاد داخلی',
        description: 'قرار دادن مقطع برش در پروژکتور و اندازه‌گیری طول قلاب بدنه ($BH$)، قلاب سر ($CH$)، هم‌پوشانی ($OL$) و چروکیدگی قلاب سر (Tightness Rating).'
      }
    ],
    calculations: {
      formulaTitleFa: 'محاسبه درصد هم‌پوشانی قلاب‌ها (% Overlap)',
      formulaExpression: '%Overlap = ((BH + CH + 1.1 * te - W) / (W - (2.2 * te + 1.1 * tb))) * 100',
      variables: [
        { symbol: '%Overlap', name: 'درصد هم‌پوشانی قلاب‌ها (باید بیش از ۵۵٪ باشد)', unit: '%' },
        { symbol: 'BH', name: 'طول قلاب بدنه (Body Hook)', unit: 'mm' },
        { symbol: 'CH', name: 'طول قلاب سر (Cover Hook)', unit: 'mm' },
        { symbol: 'W', name: 'طول کل دوخت (Seam Length)', unit: 'mm' },
        { symbol: 'te', name: 'ضخامت ورق سر قوطی', unit: 'mm' },
        { symbol: 'tb', name: 'ضخامت ورق بدنه قوطی', unit: 'mm' }
      ]
    },
    reporting: {
      unitOfMeasurement: 'میلی‌متر (mm) و درصد هم‌پوشانی (%)',
      decimalPrecision: 2,
      reportTemplateGuidance: 'ابعاد کامل دوخت و اعلام انطباق درصد هم‌پوشانی با حدود پذیرش استاندارد قوطی (حداقل ۵۵٪ هم‌پوشانی و فشردگی بالای ۷۰٪).'
    },
    potentialErrors: [
      'برش با تیغه کند که موجب تغییر شکل و پلیسه لبه‌های دوخت می‌شود',
      'اندازه‌گیری دقیقاً روی محل اتصال جوش بدنه به جای فاصله استاندارد'
    ],
    safetyNotes: [
      'اره برش دوخت دارای تیغه‌های دوار برنده است؛ استفاده از محافظ و عینک کارگاهی الزامی است.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 1881 (معادل USDA / Codex Packaging)',
      titleFa: 'قوطی‌های فلزی گرد برای نگهداری مواد غذایی - ویژگی‌ها و روش‌های آزمون دوخت مضاعف',
      titleEn: 'Hermetically sealed metal cans for food - Double seam requirements and test methods',
      publicationYear: '1395 (2016)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_1881',
        citationShort: 'استاندارد ملی ایران ۱۸۸۱',
        fullTitle: 'قوطی‌های فلزی کنسرو - روش‌های آزمون دوخت مضاعف',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['کنسروها', 'دوخت مضاعف', 'Double Seam', 'INSO 1881', 'قوطی فلزی'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 15. Other Food Products (سایر محصولات غذایی)
  {
    id: 'exp_oth_acid_insoluble_ash_15',
    code: 'EXP-OTH-015',
    titleFa: 'تعیین خاکستر نامحلول در اسید کلریدریک در ادویه‌ها و چاشنی‌ها (Acid-Insoluble Ash)',
    titleEn: 'Spices and Condiments - Determination of Acid-Insoluble Ash',
    domain: 'other_food_products',
    objective: 'سنجش ناخالصی‌های معدنی نامحلول (نظیر ماسه، خاک و سیلیس) در ادویه‌جات، چاشنی‌ها و سبزیجات خشک به عنوان شاخص خلوص و تقلبات',
    scope: 'ادویه‌ها، چاشنی‌ها، نمک‌ها، سس‌ها، سبزی‌های خشک و گیاهان دارویی غذایی',
    principle: 'جوشاندن خاکستر کل با محلول اسید کلریدریک ۱۰٪ (w/w)؛ صاف کردن از طریق کاغذ صافی بدون خاکستر؛ شستشو با آب داغ تا حذف کامل یون کلرید و سوزاندن مجدد کاغذ و رسوب در کوره ۵۵۰ درجه سلسیوس تا رسیدن به وزن ثابت.',
    equipment: [
      { name: 'کوره الکتریکی مافلی با کنترل دما تا ۵۵۰ ± ۲۵ درجه', nameEn: 'Muffle Furnace 550 °C', isRequired: true },
      { name: 'بوته‌های پلاتینی، سیلیکاتی یا کوارتز تمیز', nameEn: 'Platinum / Quartz Crucibles', isRequired: true },
      { name: 'حمام آب جوش بن‌ماری', nameEn: 'Boiling Water Bath', isRequired: true },
      { name: 'دسیکاتور حاوی ماده جاذب رطوبت سیلیکاژل تازه', nameEn: 'Desiccator', isRequired: true },
      { name: 'ترازوی آنالیتیکال ۴ رقم اعشار (۰.۰۰۰۱ گرم)', nameEn: 'Analytical Balance (0.0001 g)', isRequired: true }
    ],
    reagentsAndMaterials: [
      { name: 'اسید هیدروکلریک ۱۰٪ (w/w)', nameEn: 'Hydrochloric Acid Solution 10% (w/w)', grade: 'AR Grade', hazardClass: 'خورنده' },
      { name: 'محلول نیترات نقره ۰.۱ مولار (AgNO3)', nameEn: 'Silver Nitrate Solution (0.1 M)', grade: 'AR Grade' },
      { name: 'کاغذ صافی بدون خاکستر فیلتر باند آبی (Ashless Filter Paper)', nameEn: 'Ashless Quantitative Filter Paper', grade: 'Quantitative Grade' }
    ],
    samplePreparation: 'نمونه ادویه کاملاً آسیاب شده و از الک ۵۰۰ میکرومتر عبور داده می‌شود.',
    solutionsPreparation: 'تهیه محلول اسید کلریدریک ۱۰٪ و محلول نیترات نقره جهت تست کیفی رفع یون کلرید.',
    environmentalConditions: {
      temperatureRange: 'دمای محیط آزمایشگاه شیمی'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'افزودن اسید به خاکستر کل',
        description: 'به بوته حاوی خاکستر کل نمونه، ۲۵ میلی‌لیتر محلول HCl 10% اضافه کرده، شیشه ساعت روی آن گذاشته و ۱۰ دقیقه روی بن‌ماری جوش حرارت دهید.'
      },
      {
        stepNumber: 2,
        title: 'صاف کردن و شستشو',
        description: 'محتویات را از کاغذ صافی بدون خاکستر عبور داده و با آب مقطر داغ بشویید تا تست آب خروجی با قطره‌ای از محلول نیترات نقره کدر نشود (عدم وجود کلرید).'
      },
      {
        stepNumber: 3,
        title: 'خاکستر کردن نهایی در کوره',
        description: 'کاغذ صافی حاوی رسوب را در بوته اولیه قرار داده و در کوره ۵۵۰ درجه به مدت ۳ ساعت بسوزانید؛ سپس در دسیکاتور خنک و وزن کنید.'
      }
    ],
    calculations: {
      formulaTitleFa: 'محاسبه درصد خاکستر نامحلول در اسید بر حسب ماده خشک',
      formulaExpression: '%AcidInsolubleAsh = ((m2 - m1) / m) * (100 / (100 - Moisture%)) * 100',
      variables: [
        { symbol: '%AcidInsolubleAsh', name: 'درصد خاکستر نامحلول در اسید بر مبنای ماده خشک', unit: '%' },
        { symbol: 'm2', name: 'جرم بوته و خاکستر نامحلول پس از کوره', unit: 'g' },
        { symbol: 'm1', name: 'جرم بوته خالی خشک شده', unit: 'g' },
        { symbol: 'm', name: 'جرم نمونه اولیه وزن شده', unit: 'g' },
        { symbol: 'Moisture%', name: 'درصد رطوبت نمونه', unit: '%' }
      ]
    },
    reporting: {
      unitOfMeasurement: '% (w/w) بر مبنای ماده خشک',
      decimalPrecision: 2,
      repeatabilityLimit_r: 'اختلاف دو آزمون تکرار نباید از ۰.۰۵٪ بیشتر باشد.'
    },
    potentialErrors: [
      'شستشوی ناکافی با آب داغ و باقی ماندن نمک‌های کلریدی روی کاغذ صافی',
      'پاشیدن قطرات اسید هنگام جوشاندن'
    ],
    safetyNotes: [
      'هنگام خروج بوته از کوره ۵۵۰ درجه از انبرک بلند مخصوص کوره و دستکش نسوز استفاده شود.'
    ],
    standardReference: {
      organization: 'INSO',
      standardNumber: 'INSO 1254 (معادل ISO 930)',
      titleFa: 'ادویه و چاشنی - تعیین خاکستر نامحلول در اسید',
      titleEn: 'Spices and condiments - Determination of acid-insoluble ash',
      publicationYear: '1390 (2011)',
      jurisdiction: 'iranian_national',
      isOfficialAdopted: true
    },
    sources: [
      {
        sourceId: 'src_inso_1254',
        citationShort: 'استاندارد ملی ایران ۱۲۵۴',
        fullTitle: 'ادویه و چاشنی - تعیین خاکستر نامحلول در اسید',
        verificationGrade: 'grade_a',
        verificationStatus: 'verified_standard'
      }
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    tags: ['سایر محصولات غذایی', 'ادویه', 'خاکستر نامحلول', 'INSO 1254', 'ISO 930', 'چاشنی'],
    offlineAvailable: true,
    isVerifiedProtocol: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
