/**
 * Food Science AI - Comprehensive Verified Food Microbiology Knowledge Base & Datasets
 * 
 * Compliant with ISO 4833, ISO 4832, ISO 4831, ISO 16649, ISO 6888, ISO 6579, ISO 11290,
 * ISO 21527, ISO 7932, ISO 7937, ISO 21528, ISO 6887, ISO 7218, ISO 11133,
 * INSO 5272, INSO 2946, INSO 6806, INSO 1810, INSO 7794, INSO 997, INSO 2324, INSO 2197, INSO 2394.
 */

import { 
  MicrobialTest, 
  MicroorganismProfile, 
  CultureMediaItem, 
  MicrobiologyEquipmentItem,
  MPNTableResult,
  MicrobiologyTroubleshootingItem
} from '../types/microbiology';

export const MICROBIAL_TESTS_DATABASE: MicrobialTest[] = [
  {
    id: 'mb-tpc-01',
    code: 'MB-TPC-01',
    titleFa: 'شمارش کلی میکروارگانیسم‌ها در ۳۰ درجه سلسیوس (Total Viable Count / APC)',
    titleEn: 'Enumeration of Microorganisms - Colony Count at 30 °C (Pour Plate)',
    category: 'indicator',
    targetOrganism: 'میکروارگانیسم‌های مزوفیل هوازی (Mesophilic Aerobic Flora)',
    targetOrganismEn: 'Mesophilic Aerobic Microorganisms',
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 5272-1',
      title: 'میکروبیولوژی زنجیره غذایی - روش افقی برای شمارش میکروارگانیسم‌ها - قسمت ۱: شمارش کلنی در ۳۰ درجه سلسیوس به روش پورپلیت',
      publicationYear: '1394 (تجدیدنظر اول)',
      versionStatus: 'active_current'
    },
    secondaryStandards: [
      {
        organization: 'ISO',
        standardNumber: 'ISO 4833-1:2013/Amd 1:2022',
        title: 'Microbiology of the food chain — Horizontal method for the enumeration of microorganisms — Part 1: Colony count at 30 °C by the pour plate technique'
      },
      {
        organization: 'FDA_BAM',
        standardNumber: 'BAM Chapter 3',
        title: 'Aerobic Plate Count'
      }
    ],
    scopeFa: 'کلیه فرآورده‌های غذایی، خوراک دام و طیور، و نمونه‌های محیطی در زنجیره تولید مواد غذایی',
    principleFa: 'مخلوط کردن ۱ میلی‌لیتر از رقت‌های متوالی اعشاری با محیط کشت پلیت کانت آگار (PCA) مذاب خنک‌شده تا ۴۴-۴۷ درجه سلسیوس در پلیت پتری، انکوباسیون در دمای ۳۰±۱ درجه سلسیوس به مدت ۷۲±۳ ساعت و شمارش کلیه کلنی‌های تشکیل‌شده.',
    inoculationMethod: 'pour_plate',
    biosafetyLevel: 'BSL-1',
    requiredEquipment: [
      { nameFa: 'انکوباتور ۳۰ درجه سلسیوس', nameEn: 'Incubator 30 °C', specification: 'دقت دمایی ±۱.۰ درجه سلسیوس با پایش پیوسته دما', calibrationReq: 'کالیبراسیون سالانه و ثبت روزانه دما' },
      { nameFa: 'دستگاه استومیکر (هموژنایزر ضربه‌ای)', nameEn: 'Stomacher / Paddle Homogenizer', specification: 'سرعت ۲۳۰ دور در دقیقه با کیسه‌های فیلتردار استریل' },
      { nameFa: 'بن‌ماری آب گرم ۴۴ تا ۴۷ درجه', nameEn: 'Water Bath 44-47 °C', specification: 'برای نگهداری آگار ذوب شده قبل از ریختن در پلیت' },
      { nameFa: 'ترازوی دیجیتال آزمایشگاهی', nameEn: 'Precision Balance', specification: 'دقت ۰.۰۱ گرم برای توزین نمونه و رقیق‌کننده' },
      { nameFa: 'میکروپیپت و سرسمپلر استریل', nameEn: 'Micropipettes', specification: 'حجم ۱۰۰۰ میکرولیتر با خطای کالیبراسیون کمتر از ۱٪' },
      { nameFa: 'کلنی کانتر (شمارنده کلنی)', nameEn: 'Colony Counter', specification: 'مجهز به لوپ بزرگ‌نمایی و روشنایی زمینه تیره' }
    ],
    requiredMedia: [
      {
        mediaCode: 'PCA',
        nameFa: 'محیط پلیت کانت آگار (Plate Count Agar)',
        nameEn: 'Plate Count Agar (PCA)',
        role: 'primary_plating',
        incubationTemp: '30 ± 1 °C',
        incubationTime: '72 ± 3 h',
        atmosphere: 'aerobic',
        pHAt25C: '7.0 ± 0.2',
        autoclaveParams: '121 °C به مدت 15 دقیقه'
      },
      {
        mediaCode: 'BPW',
        nameFa: 'آب پپتونه بافری (Buffered Peptone Water) یا رقیق‌کننده حداکثر بازیافت (MRD)',
        nameEn: 'Buffered Peptone Water (BPW) / Maximum Recovery Diluent (MRD)',
        role: 'diluent',
        incubationTemp: 'محیط آزمایشگاه',
        incubationTime: 'حداکثر 45 دقیقه نگهداری',
        atmosphere: 'aerobic',
        pHAt25C: '7.0 ± 0.2'
      }
    ],
    samplePreparation: {
      matrixType: 'general',
      testPortionSize: '۱۰ یا ۲۵ گرم / میلی‌لیتر نمونه',
      diluentName: 'آب پپتونه بافری (BPW) یا پپتون واتر ۰.۱٪ یا پپتون سالین (MRD)',
      homogenizationMethod: 'استومیکر به مدت ۱ الی ۲ دقیقه در کیسه استریل',
      holdingTimeLimit: 'حداکثر ۴۵ دقیقه بین تهیه سوسپانسیون اولیه و تلقیح در پلیت (ISO 7218)'
    },
    dilutionProtocol: {
      initialDilutionRatio: '10^-1 (1:10 - یعنی ۱۰ گرم نمونه + ۹۰ میلی‌لیتر رقیق‌کننده)',
      serialSteps: ['10^-1', '10^-2', '10^-3', '10^-4', '10^-5', '10^-6'],
      pipettingTechnique: 'انتقال ۱ میلی‌لیتر با پیپت یا سرسمپلر نو برای هر مرحله رقت به ۹ میلی‌لیتر رقیق‌کننده استریل',
      mixingTechnique: 'مخلوط کردن کامل با ورتکس به مدت ۵ تا ۱۰ ثانیه قبل از هر انتقال'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        phase: 'preparation',
        titleFa: 'توزین و آماده‌سازی سوسپانسیون اولیه (۱۰⁻¹)',
        descriptionFa: 'مقدار ۲۵ گرم از نمونه را به صورت آسپتیک وزن کرده و با ۲۲۵ میلی‌لیتر رقیق‌کننده استریل در کیسه استومیکر مخلوط و به مدت ۱ الی ۲ دقیقه همگن کنید.',
        criticalTemperature: 'دمای محیط ۲۰-۲۵ درجه',
        criticalTime: '۱-۲ دقیقه'
      },
      {
        stepNumber: 2,
        phase: 'dilution',
        titleFa: 'تهیه رقت‌های متوالی اعشاری',
        descriptionFa: 'از سوسپانسیون اولیه، ۱ میلی‌لیتر برداشته و به لوله حاوی ۹ میلی‌لیتر رقیق‌کننده منتقل کنید (رقت ۱۰⁻²). لوله را ورتکس کرده و این کار را تا رقت مورد نظر تکرار نمایید.',
        criticalTime: 'حداکثر ۴۵ دقیقه تا زمان کشت',
        criticalWarning: 'برای هر مرحله رقت از سرسمپلر یا پیپت استریل جدید استفاده کنید.'
      },
      {
        stepNumber: 3,
        phase: 'inoculation',
        titleFa: 'تلقیح در پلیت‌های پتری (روش پورپلیت)',
        descriptionFa: 'از هر رقت انتخابی، دقیقاً ۱ میلی‌لیتر به مرکز دو پلیت پتری استریل (کشت دوبل) منتقل نمایید. یک پلیت شاهد منفی (بدون نمونه) نیز در نظر بگیرید.',
        criticalWarning: 'از حداقل دو رقت متوالی برای هر آزمون استفاده شود.'
      },
      {
        stepNumber: 4,
        phase: 'inoculation',
        titleFa: 'افزودن محیط کشت PCA مذاب و مخلوط کردن',
        descriptionFa: 'حدود ۱۲ تا ۱۵ میلی‌لیتر محیط PCA خنک شده در بن‌ماری ۴۴ تا ۴۷ درجه را به هر پلیت اضافه کرده و با حرکات آرام ۸ انگلیسی (فیگور ۸) کاملاً با نمونه مخلوط کنید. اجازه دهید آگار کاملاً ببندد.',
        criticalTemperature: '۴۴ تا ۴۷ درجه سلسیوس',
        criticalWarning: 'دمای آگار نباید بالاتر از ۴۸ درجه باشد چون میکروارگانیسم‌ها را از بین می‌برد؛ و نباید کمتر از ۴۳ درجه باشد چون قبل از مخلوط شدن می‌بندد.'
      },
      {
        stepNumber: 5,
        phase: 'incubation',
        titleFa: 'گرمخانه‌گذاری (انکوباسیون)',
        descriptionFa: 'پلیت‌ها را به صورت وارونه (درب پلیت به سمت پایین) در انکوباتور با دمای ۳۰ ± ۱ درجه سلسیوس به مدت ۷۲ ± ۳ ساعت قرار دهید. انباشتن بیش از ۶ پلیت روی هم مجاز نیست.',
        criticalTemperature: '30 ± 1 °C',
        criticalTime: '72 ± 3 h'
      },
      {
        stepNumber: 6,
        phase: 'counting',
        titleFa: 'شمارش کلنی‌ها و ثبت نتایج',
        descriptionFa: 'پلیت‌های حاوی ۱۵ تا ۳۰۰ کلنی را با کلنی‌کانتر شمارش کنید. در صورت وجود کلنی‌های گسترده (Spreader) قوانین ISO 7218 را اعمال نمایید.',
        criticalWarning: 'پلیت‌های دارای بیش از ۳۰۰ کلنی غیرقابل شمارش (TNTC) محسوب می‌شوند.'
      }
    ],
    calculationRules: {
      formulaName: 'میانگین موزون مطابق استاندارد ISO 7218 / INSO 5272-1',
      formulaExpression: 'N = \\frac{\\sum C}{V \\times (n_1 + 0.1 n_2) \\times d}',
      countingRangeMin: 15,
      countingRangeMax: 300,
      volumePlatedMl: 1.0,
      unitResult: 'CFU/g یا CFU/mL',
      roundingRule: 'گرد کردن نتیجه به دو رقم با معنی مطابق استاندارد ISO 7218',
      zeroResultReporting: 'کمتر از 10 CFU/g (یا کمتر از 1 CFU/mL در صورت استفاده از نمونه خالص)'
    },
    qualityControl: {
      positiveControlStrain: 'Escherichia coli ATCC 25922 و Bacillus subtilis ATCC 6633',
      negativeControlStrain: 'پلیت شاهد محیط کشت (بدون تلقیح) - رشد صفر',
      mediaSterilityBlank: true,
      diluentSterilityBlank: true,
      airSedimentationLimit: 'حداکثر کمتر از ۱۵ کلنی در پلیت باز طی ۱۵ دقیقه کار زیر هود',
      productivityIndexMin: 0.70
    },
    commonErrors: [
      {
        errorTitle: 'شوک حرارتی و مرگ باکتری‌ها به دلیل داغ بودن آگار',
        rootCause: 'ریختن آگار با دمای بالای ۴۸ درجه بر روی نمونه',
        prevention: 'کنترل دقیق دمای بن‌ماری و اندازه‌گیری دمای شیشه حاوی آگار قبل از ریختن'
      },
      {
        errorTitle: 'انعقاد ناهمگن آگار و کلوخه‌شدن نمونه',
        rootCause: 'سرد شدن آگار به زیر ۴۳ درجه قبل از ریختن در پلیت یا عدم اختلاط مناسب',
        prevention: 'انجام اختلاط فیگور ۸ بلافاصله پس از ریختن آگار و حفظ آگار در بن‌ماری ۴۵ درجه'
      },
      {
        errorTitle: 'گسترش کلنی‌های رونده (Spreading Colonies)',
        rootCause: 'وجود رطوبت اضافی روی سطح آگار یا انکوباسیون در شرایط رطوبت بیش از حد',
        prevention: 'اجازه دهید پلیت‌ها پس از بستن آگار کاملاً سفت شوند و در صورت نیاز لایه پوششی نازک اضافه کنید'
      }
    ],
    safetyNotes: [
      'رعایت اصول عمومی ایمنی زیستی سطح ۱ (BSL-1)',
      'استفاده از روپوش آزمایشگاهی، دستکش یکبار مصرف و عینک ایمنی',
      'اتوکلاو کردن کلیه پلیت‌های کشت داده شده در دمای ۱۲۱ درجه به مدت حداقل ۳۰ دقیقه قبل از دفع'
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    isVerified: true,
    tags: ['بار میکروبی', 'شمارش کل', 'PCA', 'ISO 4833', 'INSO 5272', 'پورپلیت']
  },
  {
    id: 'mb-coliform-02',
    code: 'MB-COL-02',
    titleFa: 'شمارش کلی‌فرم‌ها به روش شمارش کلنی در ۳۰ یا ۳۷ درجه (VRBA)',
    titleEn: 'Enumeration of Coliforms - Colony Count Technique (VRBA with Overlay)',
    category: 'indicator',
    targetOrganism: 'باکتری‌های کلی‌فرم (Coliform Bacteria: لکتوز مثبت، گرم منفی، اکسیداز منفی)',
    targetOrganismEn: 'Coliforms (Escherichia, Enterobacter, Klebsiella, Citrobacter)',
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 2946-1',
      title: 'میکروبیولوژی مواد غذایی و خوراک دام - روش جامع شمارش کلی‌فرم‌ها - قسمت ۱: روش شمارش کلنی',
      publicationYear: '1394',
      versionStatus: 'active_current'
    },
    secondaryStandards: [
      {
        organization: 'ISO',
        standardNumber: 'ISO 4832:2006',
        title: 'Microbiology of food and animal feeding stuffs — Horizontal method for the enumeration of coliforms — Colony-count technique'
      }
    ],
    scopeFa: 'فرآورده‌های شیری، گوشتی، کنسروی، آبمیوه‌ها، غلات و محیط‌های تولید غذا',
    principleFa: 'کشت پورپلیت ۱ میلی‌لیتر از رقت‌های نمونه در محیط ویولت رد بایل آگار (VRBA) همراه با یک لایه پوششی (Overlay) از همان محیط برای ایجاد شرایط نیمه‌بی‌هوازی، انکوباسیون در دمای ۳۰ یا ۳۷ درجه به مدت ۲۴ ساعت، شمارش کلنی‌های ارغوانی مایل به قرمز با قطر حداقل ۰.۵ میلی‌متر با هاله رسوب املاح صفراوی.',
    inoculationMethod: 'pour_plate',
    biosafetyLevel: 'BSL-1',
    requiredEquipment: [
      { nameFa: 'انکوباتور ۳۰ یا ۳۷ درجه سلسیوس', nameEn: 'Incubator 30/37 °C', specification: 'دقت دمایی ±۱.۰ درجه سلسیوس' },
      { nameFa: 'بن‌ماری آب گرم ۴۴ تا ۴۷ درجه', nameEn: 'Water Bath', specification: 'برای نگهداری آگار VRBA' },
      { nameFa: 'لوپ میکروبیولوژی و شعله بونزن', nameEn: 'Inoculation Loop & Bunsen Burner', specification: 'برای آزمون‌های تایید اکسیداز و تخمیر لاکتوز' }
    ],
    requiredMedia: [
      {
        mediaCode: 'VRBA',
        nameFa: 'محیط ویولت رد بایل آگار (Violet Red Bile Agar)',
        nameEn: 'Violet Red Bile Lactose Agar (VRBA)',
        role: 'primary_plating',
        incubationTemp: '30 ± 1 °C یا 37 ± 1 °C',
        incubationTime: '24 ± 2 h',
        atmosphere: 'aerobic',
        pHAt25C: '7.4 ± 0.2',
        autoclaveParams: 'عدم اتوکلاو - فقط جوشاندن تا ۱۰۰ درجه به مدت ۲ دقیقه'
      },
      {
        mediaCode: 'BGBLB',
        nameFa: 'آبگوشت بریلیانت گرین بایل ۲٪ (BGLB Broth)',
        nameEn: 'Brilliant Green Bile Lactose Broth 2%',
        role: 'confirmation',
        incubationTemp: '30 یا 37 ± 1 °C',
        incubationTime: '24-48 h با لوله دورهام',
        atmosphere: 'aerobic',
        pHAt25C: '7.2 ± 0.2'
      }
    ],
    samplePreparation: {
      matrixType: 'general',
      testPortionSize: '۱۰ یا ۲۵ گرم',
      diluentName: 'آب پپتونه بافری (BPW) یا محلول رقیق‌کننده MRD',
      homogenizationMethod: 'استومیکر ۱ تا ۲ دقیقه',
      holdingTimeLimit: 'حداکثر ۴۵ دقیقه'
    },
    dilutionProtocol: {
      initialDilutionRatio: '10^-1 (1:10)',
      serialSteps: ['10^-1', '10^-2', '10^-3', '10^-4'],
      pipettingTechnique: 'انتقال ۱ میلی‌لیتر با پیپت استریل',
      mixingTechnique: 'ورتکس ۵ ثانیه'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        phase: 'inoculation',
        titleFa: 'تلقیح نمونه و افزودن لایه اول VRBA',
        descriptionFa: '۱ میلی‌لیتر از هر رقت را در پلیت‌های پتری دوگانه ریخته و ۱۰ تا ۱۲ میلی‌لیتر محیط VRBA مذاب خنک‌شده در دمای ۴۴-۴۷ درجه اضافه کرده و مخلوط کنید.',
        criticalTemperature: '۴۴ تا ۴۷ درجه'
      },
      {
        stepNumber: 2,
        phase: 'inoculation',
        titleFa: 'افزودن لایه پوششی (Overlay)',
        descriptionFa: 'پس از سفت شدن کامل لایه اول، حدود ۴ الی ۵ میلی‌لیتر محیط VRBA دیگر به صورت لایه پوششی بر روی سطح آگار بریزید تا از تشکیل کلنی‌های گسترده جلوگیری شده و شرایط نیمه‌بی‌هوازی ایجاد شود.',
        criticalWarning: 'لایه پوششی در آزمون کلی‌فرم الزامی است.'
      },
      {
        stepNumber: 3,
        phase: 'incubation',
        titleFa: 'گرمخانه‌گذاری',
        descriptionFa: 'پلیت‌ها را وارونه در انکوباتور ۳۰ یا ۳۷ درجه سلسیوس به مدت ۲۴ ± ۲ ساعت قرار دهید.',
        criticalTemperature: '۳۰ یا ۳۷ درجه سلسیوس',
        criticalTime: '۲۴ ساعت'
      },
      {
        stepNumber: 4,
        phase: 'counting',
        titleFa: 'شمارش کلنی‌های مشخصه کلی‌فرم',
        descriptionFa: 'کلنی‌های به رنگ قرمز ارغوانی با قطر ۰.۵ میلی‌متر یا بزرگتر که توسط ناحیه رسوب نمک‌های صفراوی احاطه شده‌اند، شمارش می‌شوند (پلیت‌های بین ۱۵ تا ۱۵۰ کلنی).',
        criticalWarning: 'کلنی‌های بی‌رنگ یا سوزنی بدون هاله کلی‌فرم محسوب نمی‌شوند.'
      },
      {
        stepNumber: 5,
        phase: 'confirmation',
        titleFa: 'آزمون تایید بیوشیمیایی (در صورت لزوم)',
        descriptionFa: 'از ۵ کلنی مشخصه، به لوله‌های حاوی آبگوشت BGBLB با لوله درهام تلقیح کرده و پس از ۲۴ ساعت در ۳۰/۳۷ درجه، تشکیل گاز در لوله دورهام را بررسی کنید.',
        criticalTime: '۲۴ تا ۴۸ ساعت'
      }
    ],
    confirmationTests: [
      {
        testNameFa: 'آزمون تولید گاز در آبگوشت بریلیانت گرین بایل (BGBLB)',
        testNameEn: 'Gas Production in Brilliant Green Bile Lactose Broth',
        principle: 'تخمیر لاکتوز همراه با تولید گاز در حضور املاح صفراوی و مهارکننده‌های باکتری‌های گرم مثبت',
        positiveReaction: 'تشکیل حباب گاز در حداقل یک‌دهم حجم لوله درهام و کدر شدن محیط',
        negativeReaction: 'عدم تولید گاز در لوله درهام پس از ۴۸ ساعت',
        expectedForTarget: 'positive',
        standardReference: 'ISO 4832 / INSO 2946-1'
      }
    ],
    calculationRules: {
      formulaName: 'محاسبه کلی‌فرم بر حسب CFU/g یا CFU/mL مطابق ISO 7218',
      formulaExpression: 'N = \\frac{\\sum C}{V \\times (n_1 + 0.1 n_2) \\times d}',
      countingRangeMin: 15,
      countingRangeMax: 150,
      volumePlatedMl: 1.0,
      unitResult: 'CFU/g یا CFU/mL',
      roundingRule: 'گرد کردن به دو رقم با معنی',
      zeroResultReporting: '< 10 CFU/g'
    },
    qualityControl: {
      positiveControlStrain: 'Escherichia coli ATCC 25922 (کلنی ارغوانی با هاله) یا Enterobacter aerogenes ATCC 13048',
      negativeControlStrain: 'Enterococcus faecalis ATCC 29212 (مهار کامل) یا Pseudomonas aeruginosa ATCC 27853 (کلنی بی‌رنگ)',
      mediaSterilityBlank: true,
      diluentSterilityBlank: true,
      productivityIndexMin: 0.70
    },
    commonErrors: [
      {
        errorTitle: 'جوشاندن بیش از حد محیط VRBA',
        rootCause: 'حرارت دادن طولانی و جوشاندن مکرر باعث تخریب املاح صفراوی و قند لاکتوز می‌شود',
        prevention: 'محیط VRBA را اتوکلاو نکنید؛ فقط تا جوش آمدن حرارت دهید و بلافاصله خنک کنید'
      },
      {
        errorTitle: 'فراموش کردن لایه پوششی (Overlay)',
        rootCause: 'عدم افزودن ۵ میلی‌لیتر آگار رویی باعث رشد میکروارگانیسم‌های غیرهدف و عدم تفکیک هاله صفراوی می‌شود',
        prevention: 'همواره لایه پوششی نازک اضافه نمایید'
      }
    ],
    safetyNotes: [
      'رعایت شرایط آسپتیک و کار زیر هود لامینار فلو',
      'اتوکلاو کردن پسماندهای بیولوژیک در دمای ۱۲۱ درجه به مدت ۳۰ دقیقه'
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    isVerified: true,
    tags: ['کلی‌فرم', 'VRBA', 'INSO 2946', 'ISO 4832', 'شاخص بهداشتی']
  },
  {
    id: 'mb-ecoli-03',
    code: 'MB-ECO-03',
    titleFa: 'شمارش اشرشیا کلی بتاگلوکورونیداز مثبت در ۴۴ درجه (TBX Agar)',
    titleEn: 'Enumeration of beta-glucuronidase-positive Escherichia coli (TBX Agar at 44 °C)',
    category: 'indicator',
    targetOrganism: 'اشرشیا کلی بتا-گلوکورونیداز مثبت (β-glucuronidase positive E. coli)',
    targetOrganismEn: 'Escherichia coli',
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 2946-3',
      title: 'میکروبیولوژی زنجیره غذایی - روش افقی شمارش اشرشیاکلی بتا-گلوکورونیداز مثبت - قسمت ۲: روش شمارش کلنی در ۴۴ درجه با استفاده از ۵-برومو-۴-کلرو-۳-ایندولیل بتا-D-گلوکورونید',
      publicationYear: '1397',
      versionStatus: 'active_current'
    },
    secondaryStandards: [
      {
        organization: 'ISO',
        standardNumber: 'ISO 16649-2:2001',
        title: 'Microbiology of food and animal feeding stuffs — Horizontal method for the enumeration of beta-glucuronidase-positive Escherichia coli — Part 2: Colony-count technique at 44 degrees C using 5-bromo-4-chloro-3-indolyl beta-D-glucuronide'
      }
    ],
    scopeFa: 'مواد غذایی، گوشت، فرآورده‌های خام دامی، غذاهای دریایی، سبزیجات و آب',
    principleFa: 'کشت پورپلیت با محیط ترپتون بایل زایلورونید آگار (TBX) حاوی سوبسترای کروموژنیک BCIG. آنزیم بتاگلوکورونیداز موجود در اشرشیا کلی سوبسترا را هیدرولیز کرده و کلنی‌های مشخصه آبی یا سبز-آبی تولید می‌کند. انکوباسیون در دمای انتخابی ۴۴±۱ درجه انجام می‌شود.',
    inoculationMethod: 'pour_plate',
    biosafetyLevel: 'BSL-1',
    requiredEquipment: [
      { nameFa: 'انکوباتور دقیق ۴۴ درجه سلسیوس', nameEn: 'Incubator 44 °C', specification: 'دقت بالا با نوسان کمتر از ±۰.۵ درجه سلسیوس' },
      { nameFa: 'بن‌ماری آب گرم ۴۴ تا ۴۷ درجه', nameEn: 'Water Bath', specification: 'نگهداری محیط TBX مذاب' }
    ],
    requiredMedia: [
      {
        mediaCode: 'TBX',
        nameFa: 'محیط تریپتون بایل گلوکورونید آگار (TBX Agar)',
        nameEn: 'Tryptone Bile X-glucuronide Agar (TBX)',
        role: 'primary_plating',
        incubationTemp: '44 ± 1 °C (یا 4 ساعت در 37°C سپس 44°C)',
        incubationTime: '18 - 24 h',
        atmosphere: 'aerobic',
        pHAt25C: '7.2 ± 0.2',
        autoclaveParams: '121 °C به مدت 15 دقیقه'
      }
    ],
    samplePreparation: {
      matrixType: 'general',
      testPortionSize: '۱۰ یا ۲۵ گرم',
      diluentName: 'آب پپتونه بافری (BPW) یا پپتون سالین ۰.۱٪',
      homogenizationMethod: 'استومیکر ۲ دقیقه',
      holdingTimeLimit: 'حداکثر ۴۵ دقیقه'
    },
    dilutionProtocol: {
      initialDilutionRatio: '10^-1',
      serialSteps: ['10^-1', '10^-2', '10^-3'],
      pipettingTechnique: 'انتقال ۱ میلی‌لیتر آسپتیک',
      mixingTechnique: 'ورتکس کامل'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        phase: 'inoculation',
        titleFa: 'تلقیح در پلیت پتری',
        descriptionFa: '۱ میلی‌لیتر از رقت‌های تهیه شده را به دو پلیت پتری منتقل کرده و حدود ۱۵ میلی‌لیتر محیط TBX با دمای ۴۴-۴۷ درجه اضافه کنید و خوب مخلوط نمایید.',
        criticalTemperature: '۴۴ تا ۴۷ درجه'
      },
      {
        stepNumber: 2,
        phase: 'incubation',
        titleFa: 'گرمخانه‌گذاری احیا و تفکیک (Resuscitation & Incubation)',
        descriptionFa: 'طبق استاندارد، می‌توان پلیت‌ها را ابتدا ۴ ساعت در دمای ۳۷ درجه قرار داد تا سلول‌های آسیب‌دیده احیا شوند، سپس به مدت ۱۸ تا ۲۴ ساعت به انکوباتور ۴۴±۱ درجه منتقل نمود.',
        criticalTemperature: '44 ± 1 °C',
        criticalTime: '۱۸ الی ۲۴ ساعت'
      },
      {
        stepNumber: 3,
        phase: 'counting',
        titleFa: 'شمارش کلنی‌های مشخصه آبی/سبز-آبی',
        descriptionFa: 'کلیه کلنی‌های آبی یا سبز-آبی مشخصه آنزیم بتا-گلوکورونیداز را در پلیت‌های حاوی ۱۵ تا ۱۵۰ کلنی شمارش نمایید.',
        criticalWarning: 'کلنی‌های سفید یا کرم رنگ فاقد آنزیم بوده و نباید شمارش شوند (به استثنای سویه پاتوژن O157:H7 که بتاگلوکورونیداز منفی است).'
      }
    ],
    calculationRules: {
      formulaName: 'محاسبه CFU/g بر اساس میانگین موزون ISO 7218',
      formulaExpression: 'N = \\frac{\\sum C}{V \\times (n_1 + 0.1 n_2) \\times d}',
      countingRangeMin: 15,
      countingRangeMax: 150,
      volumePlatedMl: 1.0,
      unitResult: 'CFU/g یا CFU/mL',
      roundingRule: 'گرد کردن به دو رقم با معنی',
      zeroResultReporting: '< 10 CFU/g'
    },
    qualityControl: {
      positiveControlStrain: 'Escherichia coli ATCC 25922 (کلنی‌های آبی مشخصه)',
      negativeControlStrain: 'Pseudomonas aeruginosa ATCC 27853 (کلنی‌های بی‌رنگ/کرم) یا Enterococcus faecalis (مهار رشد)',
      mediaSterilityBlank: true,
      diluentSterilityBlank: true
    },
    commonErrors: [
      {
        errorTitle: 'افزایش دمای انکوباتور بالاتر از ۴۵ درجه',
        rootCause: 'دمای بالای ۴۵ درجه سلسیوس باعث مهار رشد حتی سویه‌های حساس اشرشیا کلی می‌شود',
        prevention: 'کالیبراسیون منظم ترمومتر انکوباتور و استفاده از سیستم ثبت پیوسته دما (Data Logger)'
      }
    ],
    safetyNotes: [
      'کار در هود بیولوژیک کلاس ۲ در صورت مشکوک بودن به سویه‌های پاتوژن روده',
      'ضدعفونی کلیه سطوح با الکل ۷۰٪ قبل و بعد از کار'
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    isVerified: true,
    tags: ['اشرشیا کلی', 'TBX', 'E. coli', 'INSO 2946-3', 'ISO 16649-2', 'کروموژنیک']
  },
  {
    id: 'mb-staph-04',
    code: 'MB-STA-04',
    titleFa: 'شمارش استافیلوکوکوس‌های کواگولاز مثبت (استافیلوکوکوس اورئوس) در برد پارکر',
    titleEn: 'Enumeration of Coagulase-positive Staphylococci (Staphylococcus aureus) on Baird-Parker Agar',
    category: 'pathogen',
    targetOrganism: 'استافیلوکوکوس اورئوس و استاف‌های کواگولاز مثبت (S. aureus, S. intermedius)',
    targetOrganismEn: 'Staphylococcus aureus / Coagulase-Positive Staphylococci',
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 6806-1',
      title: 'میکروبیولوژی مواد غذایی و خوراک دام - روش جامع شمارش استافیلوکوک‌های کواگولاز مثبت (استافیلوکوکوس اورئوس و سایر گونه‌ها) - قسمت ۱: روش استفاده از محیط برد پارکر آگار',
      publicationYear: '1386',
      versionStatus: 'active_current'
    },
    secondaryStandards: [
      {
        organization: 'ISO',
        standardNumber: 'ISO 6888-1:2021',
        title: 'Microbiology of the food chain — Horizontal method for the enumeration of coagulase-positive staphylococci — Part 1: Technique using Baird-Parker agar medium'
      }
    ],
    scopeFa: 'فرآورده‌های لبنی (پنیر، بستنی، خامه)، گوشتی، شیرینی‌های خامه‌ای، سالادها و غذاهای آماده مصرف',
    principleFa: 'کشت سطحی (Spread plate) مقدار ۰.۱ میلی‌لیتر از رقت‌ها بر روی پلیت‌های از پیش خشک‌شده برد-پارکر حاوی زرده تخم‌مرغ و تلوریت پتاسیم، انکوباسیون در ۳۷ درجه به مدت ۲۴ تا ۴۸ ساعت، شناسایی کلنی‌های سیاه براق با هاله شفاف و ناحیه کدر (رسوب اسیدهای چرب)، و تایید قطعی با آزمون کواگولاز پلاسما خرگوش.',
    inoculationMethod: 'spread_plate',
    biosafetyLevel: 'BSL-2',
    requiredEquipment: [
      { nameFa: 'انکوباتور ۳۷ درجه سلسیوس', nameEn: 'Incubator 37 °C', specification: 'دقت ±۱.۰ درجه' },
      { nameFa: 'میله شیشه‌ای پخش‌کننده استریل (L-shaped Spreader)', nameEn: 'Glass Spreader', specification: 'پخش یکنواخت ۰.۱ میلی‌لیتر روی آگار' },
      { nameFa: 'بن‌ماری ۳۷ درجه برای آزمون کواگولاز', nameEn: 'Water Bath 37 °C', specification: 'برای انکوباسیون لوله‌های پلاسما' }
    ],
    requiredMedia: [
      {
        mediaCode: 'Baird-Parker',
        nameFa: 'محیط برد پارکر آگار همراه با امولسیون زرده تخم‌مرغ و تلوریت پتاسیم (EYT)',
        nameEn: 'Baird-Parker Agar with Egg Yolk Tellurite Emulsion',
        role: 'primary_plating',
        incubationTemp: '37 ± 1 °C',
        incubationTime: '24-48 h',
        atmosphere: 'aerobic',
        pHAt25C: '7.2 ± 0.2',
        autoclaveParams: 'پایه آگار ۱۲۱ درجه ۱۵ دقیقه؛ امولسیون زرده تخم‌مرغ تلوریت پس از خنک شدن تا ۴۷ درجه اضافه شود'
      },
      {
        mediaCode: 'BHI',
        nameFa: 'آبگوشت برین هارت اینفیوژن (Brain Heart Infusion Broth)',
        nameEn: 'Brain Heart Infusion Broth (BHI)',
        role: 'confirmation',
        incubationTemp: '37 ± 1 °C',
        incubationTime: '24 h',
        atmosphere: 'aerobic'
      },
      {
        mediaCode: 'RPP',
        nameFa: 'پلاسمای خرگوش حاوی EDTA',
        nameEn: 'Rabbit Plasma with EDTA',
        role: 'confirmation',
        incubationTemp: '37 ± 1 °C',
        incubationTime: '۴ تا ۲۴ ساعت در بن‌ماری',
        atmosphere: 'aerobic'
      }
    ],
    samplePreparation: {
      matrixType: 'general',
      testPortionSize: '۱۰ یا ۲۵ گرم',
      diluentName: 'آب پپتونه بافری (BPW) یا پپتون واتر ۰.۱٪',
      homogenizationMethod: 'استومیکر ۲ دقیقه',
      holdingTimeLimit: 'حداکثر ۴۵ دقیقه'
    },
    dilutionProtocol: {
      initialDilutionRatio: '10^-1',
      serialSteps: ['10^-1', '10^-2', '10^-3', '10^-4'],
      pipettingTechnique: 'برداشت دقیق ۰.۱ میلی‌لیتر و تلقیح سطحی',
      mixingTechnique: 'پخش با لوله پخش‌کننده شیشه‌ای ال شکل تا جذب کامل در سطح آگار'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        phase: 'preparation',
        titleFa: 'آماده‌سازی و خشک کردن سطح پلیت‌های برد پارکر',
        descriptionFa: 'پلیت‌های برد پارکر حاوی زرده تخم‌مرغ و تلوریت را قبل از تلقیح، به مدت ۳۰ دقیقه در هود یا انکوباتور نیمه‌باز بگذارید تا رطوبت سطحی آن‌ها کاملاً تبخیر شود.',
        criticalWarning: 'رطوبت سطح باعث روان شدن کلنی‌ها و از بین رفتن هاله تشخیصی زرده تخم‌مرغ می‌شود.'
      },
      {
        stepNumber: 2,
        phase: 'inoculation',
        titleFa: 'کشت سطحی (Spread Plate)',
        descriptionFa: 'مقدار ۰.۱ میلی‌لیتر از هر رقت را روی سطح پلیت ریخته و با پخش‌کننده شیشه‌ای استریل به سرعت و به طور یکنواخت در تمام سطح پخش کنید. بگذارید قطرات به مدت ۱۵ دقیقه جذب شوند.',
        criticalWarning: 'حجم تلقیح در روش کشت سطحی ۰.۱ میلی‌لیتر است (ضریب رقت در ۱۰ ضرب می‌شود).'
      },
      {
        stepNumber: 3,
        phase: 'incubation',
        titleFa: 'گرمخانه‌گذاری',
        descriptionFa: 'پلیت‌ها را به صورت وارونه در انکوباتور ۳۷ ± ۱ درجه سلسیوس به مدت ۲۴ ساعت و سپس در صورت لزوم تا ۴۸ ساعت قرار دهید.',
        criticalTemperature: '37 ± 1 °C',
        criticalTime: '۲۴ تا ۴۸ ساعت'
      },
      {
        stepNumber: 4,
        phase: 'counting',
        titleFa: 'بررسی مرفولوژی و شمارش کلنی‌های مشخصه',
        descriptionFa: 'کلنی‌های مشخصه (تیپیک): سیاه یا خاکستری تیره، براق، محدب با قطر ۱-۱.۵ میلی‌متر، احاطه شده توسط هاله شفاف (پروتئولیز) و حلقه داخلی کدر (لسیتیناز). کلنی‌های غیرمشخصه (آتیپیک): سیاه براق بدون هاله شفاف.',
        criticalWarning: 'هر دو نوع کلنی تیپیک و آتیپیک باید در آزمون کواگولاز تایید شوند.'
      },
      {
        stepNumber: 5,
        phase: 'confirmation',
        titleFa: 'آزمون تایید کواگولاز لوله‌ای (Tube Coagulase Test)',
        descriptionFa: 'از هر پلیت، حداقل ۵ کلنی را به لوله‌های BHI تلقیح و ۲۴ ساعت در ۳۷ درجه گرما دهید. سپس ۰.۱ میلی‌لیتر از کشت BHI را با ۰.۳ میلی‌لیتر پلاسمای خرگوش در لوله استریل مخلوط کرده و در بن‌ماری ۳۷ درجه انکوبه کنید. لوله را در ساعات ۱، ۲، ۳، ۴ و ۲۴ از نظر تشکیل لخته ژله‌ای بررسی نمایید.',
        criticalTemperature: '37 °C بن‌ماری',
        criticalTime: '۱ الی ۲۴ ساعت'
      }
    ],
    confirmationTests: [
      {
        testNameFa: 'آزمون کواگولاز پلاسما خرگوش',
        testNameEn: 'Rabbit Plasma Coagulase Test',
        principle: 'آنزیم آزاد کواگولاز استافیلوکوکوس با فاکتور واکنش‌دهنده با کواگولاز (CRF) در پلاسما ترکیب شده و فیبرینوژن را به لخته فیبرین تبدیل می‌کند.',
        positiveReaction: 'تشکیل لخته کامل ژله‌ای (درجه ۳ یا ۴) که حتی با کج کردن لوله شکل خود را حفظ کند',
        negativeReaction: 'مایع ماندن کامل پلاسما بدون هیچگونه لخته پس از ۲۴ ساعت',
        expectedForTarget: 'positive',
        standardReference: 'INSO 6806-1 / ISO 6888-1'
      }
    ],
    calculationRules: {
      formulaName: 'محاسبه کواگولاز مثبت‌ها بر اساس نسبت کلنی‌های تاییدشده کواگولاز',
      formulaExpression: 'N = \\frac{\\sum a}{\\sum b} \\times \\frac{\\sum C}{V \\times (n_1 + 0.1 n_2) \\times d}',
      countingRangeMin: 15,
      countingRangeMax: 150,
      volumePlatedMl: 0.1,
      unitResult: 'CFU/g یا CFU/mL',
      roundingRule: 'گرد کردن به دو رقم با معنی',
      zeroResultReporting: '< 100 CFU/g (با تلقیح ۰.۱ میلی‌لیتر از رقت ۱۰⁻¹)'
    },
    qualityControl: {
      positiveControlStrain: 'Staphylococcus aureus ATCC 6538 یا ATCC 25923 (کواگولاز مثبت، هاله شفاف روی BP)',
      negativeControlStrain: 'Staphylococcus epidermidis ATCC 12228 (کواگولاز منفی، کلنی سیاه بدون هاله)',
      mediaSterilityBlank: true,
      diluentSterilityBlank: true
    },
    commonErrors: [
      {
        errorTitle: 'انحلال لخته کواگولاز در اثر فیبرینولیزین پس از ۲۴ ساعت',
        rootCause: 'برخی سویه‌های اورئوس آنزیم فیبرینولیزین تولید می‌کنند که لخته را پس از تشکیل حل می‌کند',
        prevention: 'بررسی لوله پلاسما در فواصل ساعتی ۱، ۲، ۳ و ۴ ساعت الزامی است و نباید تنها به قرائت ۲۴ ساعته اکتفا کرد'
      },
      {
        errorTitle: 'افزودن امولسیون زرده تخم‌مرغ به آگار داغ',
        rootCause: 'دمای بالای ۵۰ درجه باعث لخته شدن پروتئین‌های تخم‌مرغ و کدر شدن کامل محیط می‌شود',
        prevention: 'دمای پایه آگار باید قبل از افزودن زرده تخم‌مرغ دقیقاً به ۴۵-۴۷ درجه برسد'
      }
    ],
    safetyNotes: [
      'ایمنی زیستی سطح ۲ (BSL-2) به دلیل پتانسیل تولید انتروتوکسین‌های مقاوم به حرارت',
      'پرهیز اکید از پیپت کردن با دهان و استفاده از هود بیولوژیک کلاس ۲'
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    isVerified: true,
    tags: ['استافیلوکوکوس اورئوس', 'Baird Parker', 'کواگولاز', 'INSO 6806', 'ISO 6888', 'پاتوژن']
  },
  {
    id: 'mb-salmonella-05',
    code: 'MB-SAL-05',
    titleFa: 'جستجو و شناسایی سالمونلا در ۲۵ گرم نمونه (Detection of Salmonella spp.)',
    titleEn: 'Detection of Salmonella spp. in 25g Food Sample (Horizontal Method)',
    category: 'pathogen',
    targetOrganism: 'سالمونلا انتریکا (Salmonella enterica subsp. enterica)',
    targetOrganismEn: 'Salmonella spp.',
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 1810-1',
      title: 'میکروبیولوژی زنجیره غذایی - روش افقی برای شناسایی، شمارش و سرولوژی سالمونلا - قسمت ۱: شناسایی سالمونلا گونه‌ها',
      publicationYear: '1397 (تجدیدنظر سوم)',
      versionStatus: 'active_current'
    },
    secondaryStandards: [
      {
        organization: 'ISO',
        standardNumber: 'ISO 6579-1:2017/Amd 1:2020',
        title: 'Microbiology of the food chain — Horizontal method for the detection, enumeration and serotyping of Salmonella — Part 1: Detection of Salmonella spp.'
      },
      {
        organization: 'FDA_BAM',
        standardNumber: 'BAM Chapter 5',
        title: 'Salmonella'
      }
    ],
    scopeFa: 'تمام گروه‌های مواد غذایی، خوراک دام، تخم‌مرغ، گوشت و مرغ، شیر خشک، شکلات و نمونه‌های محیطی',
    principleFa: 'پروتکل استاندارد ۴ مرحله‌ای: ۱. پیش‌غنی‌سازی غیرانتخابی در BPW (۳۷ درجه، ۱۸ ساعت)؛ ۲. غنی‌سازی انتخابی در RVS (۴۱.۵ درجه) و MKTTn (۳۷ درجه)؛ ۳. جداسازی در محیط‌های انتخابی-افتراقی XLD و محیط دوم (مانند BGA یا HE یا کروموژنیک)؛ ۴. تایید بیوشیمیایی (TSI، اوره، سیمون سیترات) و سرولوژیکی (آنتی‌سرم پلی‌والان O و H).',
    inoculationMethod: 'presence_absence',
    biosafetyLevel: 'BSL-2',
    requiredEquipment: [
      { nameFa: 'انکوباتور ۳۷ درجه و ۴۱.۵ درجه سلسیوس', nameEn: 'Incubators 37 °C & 41.5 °C', specification: 'انکوباتور یا بن‌ماری دقیق ۴۱.۵ ± ۰.۵ درجه برای RVS' },
      { nameFa: 'استومیکر و کیسه‌های استریل', nameEn: 'Stomacher', specification: 'همگن‌سازی ۲۵ گرم در ۲۲۵ میلی‌لیتر' },
      { nameFa: 'هود بیولوژیک کلاس ۲ (BSC Class II)', nameEn: 'Biosafety Cabinet Class II', specification: 'محافظت اپراتور و محیط' }
    ],
    requiredMedia: [
      {
        mediaCode: 'BPW',
        nameFa: 'آب پپتونه بافری (Buffered Peptone Water)',
        nameEn: 'Buffered Peptone Water (BPW)',
        role: 'pre_enrichment',
        incubationTemp: '34-38 °C (معمولاً 37 ± 1 °C)',
        incubationTime: '18 ± 2 h',
        atmosphere: 'aerobic',
        pHAt25C: '7.0 ± 0.2'
      },
      {
        mediaCode: 'RVS',
        nameFa: 'آبگوشت راپاپورت واسیلیادیس سویا (RVS Broth)',
        nameEn: 'Rappaport-Vassiliadis Soya Peptone Broth (RVS)',
        role: 'selective_enrichment',
        incubationTemp: '41.5 ± 1.0 °C',
        incubationTime: '24 ± 3 h',
        atmosphere: 'aerobic'
      },
      {
        mediaCode: 'MKTTn',
        nameFa: 'آبگوشت مولر کافمن تتراشنات نووبیوسین (MKTTn Broth)',
        nameEn: 'Muller-Kauffmann Tetrathionate-Novobiocin Broth',
        role: 'selective_enrichment',
        incubationTemp: '37 ± 1 °C',
        incubationTime: '24 ± 3 h',
        atmosphere: 'aerobic'
      },
      {
        mediaCode: 'XLD',
        nameFa: 'محیط گزیلوز لایزین دزوکسی کولات آگار (XLD Agar)',
        nameEn: 'Xylose Lysine Deoxycholate Agar (XLD)',
        role: 'primary_plating',
        incubationTemp: '37 ± 1 °C',
        incubationTime: '24 ± 3 h',
        atmosphere: 'aerobic',
        pHAt25C: '7.4 ± 0.2'
      },
      {
        mediaCode: 'TSI',
        nameFa: 'محیط تریپل شوگر آیرون آگار (Triple Sugar Iron Agar)',
        nameEn: 'Triple Sugar Iron Agar (TSI)',
        role: 'confirmation',
        incubationTemp: '37 ± 1 °C',
        incubationTime: '24 h',
        atmosphere: 'aerobic'
      },
      {
        mediaCode: 'Urea',
        nameFa: 'محیط اوره آگار / آبگوشت اوره کریستنسن',
        nameEn: 'Urea Agar / Christensen Broth',
        role: 'confirmation',
        incubationTemp: '37 ± 1 °C',
        incubationTime: '24 h',
        atmosphere: 'aerobic'
      }
    ],
    samplePreparation: {
      matrixType: 'general',
      testPortionSize: '۲۵ گرم یا میلی‌لیتر (یا ۳۷۵ گرم برای کامپوزیت پودر شیر/شکلات)',
      diluentName: 'آب پپتونه بافری (BPW) در نسبت ۱ به ۱۰ (۲۲۵ میلی‌لیتر)',
      homogenizationMethod: 'استومیکر ۲ دقیقه',
      holdingTimeLimit: 'بلافاصله پس از آماده‌سازی انکوبه شود'
    },
    dilutionProtocol: {
      initialDilutionRatio: '1:10 در BPW',
      serialSteps: ['پیش‌غنی‌سازی در BPW', 'انتقال ۰.۱ میلی‌لیتر به ۱۰ میلی‌لیتر RVS', 'انتقال ۱ میلی‌لیتر به ۱۰ میلی‌لیتر MKTTn'],
      pipettingTechnique: 'انتقال آسپتیک دقیق',
      mixingTechnique: 'تکان دادن آرام لوله‌ها'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        phase: 'preparation',
        titleFa: 'مرحله ۱: پیش‌غنی‌سازی غیرانتخابی در BPW',
        descriptionFa: 'مقدار ۲۵ گرم از نمونه را به ۲۲۵ میلی‌لیتر BPW استریل اضافه کرده، همگن نموده و به مدت ۱۸ ± ۲ ساعت در دمای ۳۴ تا ۳۸ درجه (۳۷ درجه) انکوبه کنید.',
        criticalTemperature: '37 ± 1 °C',
        criticalTime: '18 ± 2 h'
      },
      {
        stepNumber: 2,
        phase: 'dilution',
        titleFa: 'مرحله ۲: غنی‌سازی انتخابی در دو محیط RVS و MKTTn',
        descriptionFa: 'مقدار ۰.۱ میلی‌لیتر از کشت BPW را به ۱۰ میلی‌لیتر براث RVS (انکوباسیون در ۴۱.۵ درجه به مدت ۲۴ ساعت) و مقدار ۱ میلی‌لیتر از BPW را به ۱۰ میلی‌لیتر براث MKTTn (انکوباسیون در ۳۷ درجه به مدت ۲۴ ساعت) منتقل کنید.',
        criticalTemperature: 'RVS: 41.5 ± 1 °C | MKTTn: 37 ± 1 °C',
        criticalTime: '24 ± 3 h',
        criticalWarning: 'رعایت دقیق دمای ۴۱.۵ درجه برای RVS بسیار حیاتی است.'
      },
      {
        stepNumber: 3,
        phase: 'inoculation',
        titleFa: 'مرحله ۳: جداسازی در محیط‌های انتخابی (XLD و محیط دوم)',
        descriptionFa: 'از هر یک از لوله‌های RVS و MKTTn به صورت خطی بر روی پلیت‌های XLD و محیط انتخابی دوم (مانند BGA یا سالمونلا کروموژنیک) کشت داده و پلیت‌ها را به مدت ۲۴ ساعت در ۳۷ درجه انکوبه کنید.',
        criticalTemperature: '37 ± 1 °C',
        criticalTime: '24 ± 3 h'
      },
      {
        stepNumber: 4,
        phase: 'counting',
        titleFa: 'بررسی مرفولوژی کلنی‌ها روی XLD',
        descriptionFa: 'کلنی‌های مشخصه سالمونلا در XLD: کلنی‌های صورتی-قرمز شفاف با مرکز سیاه (تولید H2S). سویه‌های فاقد H2S به رنگ صورتی براق با هاله قرمز دیده می‌شوند.',
        criticalWarning: 'کلنی‌های زرد رنگ متعلق به باکتری‌های تخمیرکننده لاکتوز/ساکاروز بوده و سالمونلا نیستند.'
      },
      {
        stepNumber: 5,
        phase: 'confirmation',
        titleFa: 'مرحله ۴: تایید بیوشیمیایی و سرولوژیکی',
        descriptionFa: 'تلقح به شیب و عمق لوله TSI (پاسخ تیپیک: ته زرد (اسیدی/تخمیر گلوکز)، شیب قرمز (قلیایی/عدم تخمیر لاکتوز)، تشکیل گاز و سیاه شدن به دلیل H2S). آزمون اوره (منفی/عدم تغییر رنگ صورتی). آزمون آگلوتیناسیون با آنتی‌سرم سالمونلا O پلی‌والان.',
        criticalTime: '24 h'
      }
    ],
    confirmationTests: [
      {
        testNameFa: 'آزمون تریپل شوگر آیرون (TSI Agar)',
        testNameEn: 'Triple Sugar Iron (TSI) Test',
        principle: 'بررسی تخمیر گلوکز، لاکتوز، ساکاروز، تولید گاز و تولید سولفید هیدروژن (H2S)',
        positiveReaction: 'عمق زرد (اسید)، شیب قرمز (قلیایی)، تولید گاز (+) و رسوب سیاه سولفید آهن (+)',
        negativeReaction: 'شیب زرد (تخمیر لاکتوز/ساکاروز) یا کل لوله قرمز',
        expectedForTarget: 'positive',
        standardReference: 'INSO 1810-1 / ISO 6579-1'
      },
      {
        testNameFa: 'آزمون هیدرولیز اوره (Urea Test)',
        testNameEn: 'Urease Hydrolysis Test',
        principle: 'سالمونلا فاقد آنزیم اوره‌آز است و نمی‌تواند اوره را به آمونیاک تبدیل کند',
        positiveReaction: 'تغییر رنگ به ارغوانی تند (اوره‌آز مثبت - نشان‌دهنده غیر سالمونلا مانند پروتئوس)',
        negativeReaction: 'باقی ماندن به رنگ زرد/نارنجی اصلی (اوره‌آز منفی - مشخصه سالمونلا)',
        expectedForTarget: 'negative',
        standardReference: 'INSO 1810-1 / ISO 6579-1'
      },
      {
        testNameFa: 'آزمون آگلوتیناسیون سرولوژیک (Serological Agglutination)',
        testNameEn: 'Slide Agglutination with Polyvalent O/H Antisera',
        principle: 'واکنش متقابل آنتی‌ژن‌های سوماتیک دیواره سلولی (O) و تاژکی (H) سالمونلا با آنتی‌بادی‌های اختصاصی',
        positiveReaction: 'تشکیل سریع دانه‌های آگلوتیناسیون در کمتر از ۶۰ ثانیه روی لام',
        negativeReaction: 'سوسپانسیون یکنواخت و شیری بدون دانه‌دانه شدن',
        expectedForTarget: 'positive',
        standardReference: 'INSO 1810-1'
      }
    ],
    calculationRules: {
      formulaName: 'گزارش کیفی حضور یا عدم حضور در ۲۵ گرم',
      formulaExpression: 'Presence / Absence in 25 g',
      countingRangeMin: 0,
      countingRangeMax: 0,
      volumePlatedMl: 25.0,
      unitResult: 'حضور / عدم حضور در ۲۵ گرم (Detected / Not Detected in 25g)',
      roundingRule: 'کیفی (صفر یا یک)',
      zeroResultReporting: 'عدم حضور در ۲۵ گرم (Not Detected in 25g)'
    },
    qualityControl: {
      positiveControlStrain: 'Salmonella enterica subsp. enterica serovar Typhimurium ATCC 14028 یا Enteritidis ATCC 13076',
      negativeControlStrain: 'Escherichia coli ATCC 25922 یا Pseudomonas aeruginosa ATCC 27853',
      mediaSterilityBlank: true,
      diluentSterilityBlank: true
    },
    commonErrors: [
      {
        errorTitle: 'اشتباه گرفتن پروتئوس با سالمونلا',
        rootCause: 'پروتئوس میرابیلیس روی XLD کلنی‌های سیاه رنگ با هاله قرمز تولید می‌کند و رفتار مشابه سالمونلا دارد',
        prevention: 'انجام آزمون اوره الزامی است؛ پروتئوس به سرعت در کمتر از ۲ تا ۴ ساعت اوره‌آز مثبت (صورتی تند) می‌شود در حالی که سالمونلا قطعا منفی است'
      },
      {
        errorTitle: 'انحراف دمایی انکوباتور RVS از ۴۱.۵ درجه',
        rootCause: 'دمای زیر ۴۱ درجه اجازه رشد رقبای کلی‌فرمی را می‌دهد و دمای بالای ۴۲.۵ درجه سالمونلا را مهار می‌کند',
        prevention: 'استفاده از حمام آب گرم سیرکوله‌دار کالیبره شده با دقت ±۰.۲ درجه'
      }
    ],
    safetyNotes: [
      'ایمنی زیستی سطح ۲ (BSL-2) الزامی است - سالمونلا عامل گاستروانتریت شدید و تب تیفوئید است',
      'تمام مراحل انتقال غنی‌سازی باید زیر هود بیولوژیک کلاس ۲ انجام شود',
      'اتوکلاو کردن کلیه ضایعات در ۱۲۱ درجه به مدت ۶۰ دقیقه قبل از دفع'
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    isVerified: true,
    tags: ['سالمونلا', 'Salmonella', 'INSO 1810', 'ISO 6579', 'پاتوژن', 'XLD', 'BSL-2']
  },
  {
    id: 'mb-yeast-mold-06',
    code: 'MB-YM-06',
    titleFa: 'شمارش مخمرها و کپک‌ها در دمای ۲۵ درجه (DRBC و DG18)',
    titleEn: 'Enumeration of Yeasts and Molds (DRBC for aw > 0.95 and DG18 for aw <= 0.95)',
    category: 'spoilage',
    targetOrganism: 'کپک‌ها و مخمرهای فرآورده‌های غذایی (Yeasts and Molds)',
    targetOrganismEn: 'Yeasts & Molds',
    primaryStandard: {
      organization: 'INSO',
      standardNumber: 'INSO 997-1 / INSO 997-2',
      title: 'میکروبیولوژی مواد غذایی و خوراک دام - روش جامع شمارش مخمرها و کپک‌ها - قسمت ۱: فرآورده‌های با فعالیت آبی بالاتر از ۰.۹۵ و قسمت ۲: فعالیت آبی کمتر یا مساوی ۰.۹۵',
      publicationYear: '1387',
      versionStatus: 'active_current'
    },
    secondaryStandards: [
      {
        organization: 'ISO',
        standardNumber: 'ISO 21527-1:2008 & ISO 21527-2:2008',
        title: 'Microbiology of food and animal feeding stuffs — Horizontal method for the enumeration of yeasts and moulds — Part 1: Colony count technique in products with water activity greater than 0,95 / Part 2: aw less than or equal to 0,95'
      }
    ],
    scopeFa: 'تمام مواد غذایی (فرآورده‌های مرطوب در DRBC و خشک/آردی/خشکبار/شیرینی در DG18)',
    principleFa: 'کشت سطحی (Spread plate) مقدار ۰.۱ میلی‌لیتر بر روی محیط دیکلوران رز بنگال کلرامفنیکل آگار (DRBC برای aw > 0.95) یا دیکلوران گلیسرول ۱۸٪ آگار (DG18 برای مواد با رطوبت پایین و خشکبار aw <= 0.95)، انکوباسیون در ۲۵±۱ درجه به مدت ۵ تا ۷ روز در تاریکی، و شمارش مجزای کلنی‌های مخمر و میسلیوم‌های کپک.',
    inoculationMethod: 'spread_plate',
    biosafetyLevel: 'BSL-1',
    requiredEquipment: [
      { nameFa: 'انکوباتور ۲۵ درجه سلسیوس', nameEn: 'Incubator 25 °C', specification: 'بدون فن قوی جهت جلوگیری از پخش اسپورها' },
      { nameFa: 'میله پخش‌کننده شیشه‌ای L شکل', nameEn: 'Glass Spreader', specification: 'کشت سطحی ۰.۱ میلی‌لیتر' },
      { nameFa: 'استریومیکروسکوپ یا لوپ', nameEn: 'Stereomicroscope / Magnifier', specification: 'تشخیص کلنی‌های مخمر از اسپورهای ریز کپک' }
    ],
    requiredMedia: [
      {
        mediaCode: 'DRBC',
        nameFa: 'محیط دیکلوران رز بنگال کلرامفنیکل آگار (DRBC Agar)',
        nameEn: 'Dichloran Rose Bengal Chloramphenicol Agar (DRBC)',
        role: 'primary_plating',
        incubationTemp: '25 ± 1 °C در تاریکی',
        incubationTime: '5 روز (تا 7 روز)',
        atmosphere: 'aerobic',
        pHAt25C: '5.6 ± 0.2',
        autoclaveParams: '121 °C به مدت 15 دقیقه (حفاظت از نور مستقیم)'
      },
      {
        mediaCode: 'DG18',
        nameFa: 'محیط دیکلوران ۱۸٪ گلیسرول آگار (DG18 Agar)',
        nameEn: 'Dichloran 18% Glycerol Agar (DG18)',
        role: 'primary_plating',
        incubationTemp: '25 ± 1 °C',
        incubationTime: '5-7 روز',
        atmosphere: 'aerobic',
        pHAt25C: '5.6 ± 0.2'
      }
    ],
    samplePreparation: {
      matrixType: 'general',
      testPortionSize: '۱۰ یا ۲۵ گرم',
      diluentName: 'پپتون واتر ۰.۱٪ یا آب پپتونه بافری (برای DG18 ترجیحا پپتون واتر حاوی گلیسرول)',
      homogenizationMethod: 'استومیکر ۲ دقیقه',
      holdingTimeLimit: 'حداکثر ۳۰ دقیقه'
    },
    dilutionProtocol: {
      initialDilutionRatio: '10^-1',
      serialSteps: ['10^-1', '10^-2', '10^-3', '10^-4'],
      pipettingTechnique: 'انتقال ۰.۱ میلی‌لیتر روی سطح آگار خشک',
      mixingTechnique: 'پخش یکنواخت با پخش‌کننده'
    },
    procedureSteps: [
      {
        stepNumber: 1,
        phase: 'preparation',
        titleFa: 'انتخاب محیط کشت بر اساس فعالیت آبی (aw) نمونه',
        descriptionFa: 'اگر فعالیت آبی نمونه بالاتر از ۰.۹۵ است (مانند گوشت، شیر، ماست، میوه، سبزی) از محیط DRBC و اگر فعالیت آبی ۰.۹۵ یا کمتر است (مانند آرد، مغزها، ادویه، میوه خشک، کیک) منحصراً از محیط DG18 استفاده کنید.',
        criticalWarning: 'استفاده از DRBC برای نمونه‌های خشک باعث مرگ قارچ‌های گزروفیلیک (خشکی‌پسند) به دلیل شوک اسمزی می‌شود.'
      },
      {
        stepNumber: 2,
        phase: 'inoculation',
        titleFa: 'کشت سطحی (Spread Plate)',
        descriptionFa: 'مقدار ۰.۱ میلی‌لیتر از رقت‌ها را روی سطح پلیت‌ها ریخته و با پخش‌کننده شیشه‌ای پخش کنید.',
        criticalWarning: 'از روش پورپلیت استفاده نکنید زیرا گرمای آگار مذاب اسپورهای حساس قارچی را از بین می‌برد.'
      },
      {
        stepNumber: 3,
        phase: 'incubation',
        titleFa: 'گرمخانه‌گذاری در تاریکی',
        descriptionFa: 'پلیت‌ها را به صورت روبه‌بالا (وارونه نکنید تا اسپورها بر روی درب نریزند) در دمای ۲۵ ± ۱ درجه به مدت ۵ روز در تاریکی انکوبه کنید.',
        criticalTemperature: '25 ± 1 °C',
        criticalTime: '۵ تا ۷ روز',
        criticalWarning: 'محیط DRBC به نور حساس است؛ فتواکسیداسیون رز بنگال ترکیبات سمی ضد قارچ تولید می‌کند.'
      },
      {
        stepNumber: 4,
        phase: 'counting',
        titleFa: 'شمارش تفکیکی کلنی‌های مخمر و میسلیوم کپک',
        descriptionFa: 'پلیت‌های حاوی ۱۰ تا ۱۵۰ کلنی را در روز پنجم شمارش کنید. مخمرها به صورت کلنی‌های برجسته، نرم، براق با لبه صاف و کپک‌ها به صورت کلنی‌های کرکی، پنبه‌ای یا پودری رشته‌ای با اسپورهای رنگی تفکیک می‌شوند.',
        criticalWarning: 'در روزهای ۲ یا ۳ پلیت‌ها را اجمالاً نگاه کنید تا در صورت وجود کپک‌های سریع‌الرشد (Mucor) قبل از پوشاندن سطح پلیت شمارش شوند.'
      }
    ],
    calculationRules: {
      formulaName: 'محاسبه شمارش مخمر و کپک بر اساس ISO 7218',
      formulaExpression: 'N = \\frac{\\sum C}{V \\times (n_1 + 0.1 n_2) \\times d}',
      countingRangeMin: 10,
      countingRangeMax: 150,
      volumePlatedMl: 0.1,
      unitResult: 'CFU/g یا CFU/mL',
      roundingRule: 'گرد کردن به دو رقم با معنی',
      zeroResultReporting: '< 100 CFU/g (با تلقیح ۰.۱ میلی‌لیتر از رقت ۱۰⁻¹)'
    },
    qualityControl: {
      positiveControlStrain: 'Saccharomyces cerevisiae ATCC 9763 (مخمر) و Aspergillus brasiliensis ATCC 16404 (کپک)',
      negativeControlStrain: 'Escherichia coli ATCC 25922 (مهار کامل توسط کلرامفنیکل)',
      mediaSterilityBlank: true,
      diluentSterilityBlank: true
    },
    commonErrors: [
      {
        errorTitle: 'وارونه قرار دادن پلیت‌های کپک در انکوباتور',
        rootCause: 'باعث ریزش اسپورهای هوازی بر روی درب پلیت و پخش ثانویه روی سطح آگار می‌شود',
        prevention: 'پلیت‌های شمارش قارچی باید به صورت درب رو به بالا انکوبه شوند'
      },
      {
        errorTitle: 'قرار دادن محیط DRBC در معرض نور مستقیم مهتابی یا آفتاب',
        rootCause: 'رز بنگال در اثر نور تجزیه شده و بازدارنده‌های شدید برای رشد قارچ‌ها ایجاد می‌کند',
        prevention: 'نگهداری پلیت‌ها و انکوباسیون در تاریکی کامل'
      }
    ],
    safetyNotes: [
      'از بو کردن پلیت‌های باز کپک اکیداً خودداری کنید (خطر آلرژی و استنشاق اسپور و مایکوتوکسین)',
      'باز کردن پلیت‌های حاوی کپک ترجیحاً زیر هود لامینار فلو انجام شود'
    ],
    verificationStatus: 'verified_standard',
    reliabilityGrade: 'grade_a',
    isVerified: true,
    tags: ['کپک و مخمر', 'DRBC', 'DG18', 'ISO 21527', 'INSO 997', 'فساد قارچی']
  }
];

export const MICROORGANISMS_DATABASE: MicroorganismProfile[] = [
  {
    id: 'mo-ecoli',
    scientificName: 'Escherichia coli',
    nameFa: 'اشرشیا کلی',
    family: 'Enterobacteriaceae',
    category: 'indicator',
    morphology: 'bacillus',
    gramStain: 'gram_negative',
    sporeForming: false,
    motility: true,
    oxygenRequirement: 'facultative_anaerobe',
    optimumTemperatureC: 37,
    temperatureRangeC: { min: 7, opt: 37, max: 46 },
    optimumPh: 7.0,
    phRange: { min: 4.4, opt: 7.0, max: 9.0 },
    minimumAw: 0.95,
    maximumSaltTolerancePercent: 6.5,
    foodSafetySignificanceFa: 'شاخص قطعی آلودگی مدفوعی و عدم رعایت بهداشت فردی یا فرآیندی در خطوط تولید. سویه‌های پاتوژن روده (STEC/EHEC نظیر O157:H7) عامل کولیت هموراژیک و سندروم همولیتیک یورمیک (HUS) هستند.',
    commonFoodSources: ['گوشت چرخ‌کرده نیم‌پز', 'شیر خام و پنیر غیرپاستوریزه', 'آب آلوده', 'سبزیجات تازه آبیاری شده با فاضلاب'],
    spoilageOrIllnessCharacteristics: 'تولید گاز و اسید در فرآورده‌ها، کرامپ‌های شدید شکمی، اسهال آبکی یا خونی',
    incubationPeriodAndSymptoms: 'دوره کمون ۳ الی ۸ روز؛ تب ملایم، دل‌پیچه، اسهال شدید',
    heatResistanceDValue: 'D_60°C = 0.1 - 0.5 min (به حرارت پاستوریزاسیون بسیار حساس است)',
    toxinProduction: 'شیگاتوکسین (Stx1, Stx2) در سویه‌های STEC',
    biochemicalProfile: {
      catalase: 'positive',
      oxidase: 'negative',
      indole: 'positive',
      methylRed: 'positive',
      vogesProskauer: 'negative',
      citrate: 'negative',
      urease: 'negative',
      h2sProduction: 'negative',
      gasFromGlucose: 'positive',
      betaGlucuronidase: 'positive'
    },
    typicalStandardsLimits: [
      { foodCategory: 'فرآورده‌های گوشتی حرارت‌دیده', standardRef: 'INSO 2394', limitDescription: 'm = منفی در ۱ گرم (یا کمتر از ۱۰ CFU/g)' },
      { foodCategory: 'شیر پاستوریزه', standardRef: 'INSO 2394', limitDescription: 'منفی در ۱ میلی‌لیتر' },
      { foodCategory: 'آب آشامیدنی بسته‌بندی', standardRef: 'INSO 1053', limitDescription: 'صفر در ۲۵۰ میلی‌لیتر' }
    ],
    referenceStrains: ['ATCC 25922 (کنترل کیفیت عمومی)', 'ATCC 8739 (آزمون‌های دارویی)', 'NCTC 12900 (سویه غیرتوکسین‌زای O157:H7)']
  },
  {
    id: 'mo-salmonella',
    scientificName: 'Salmonella enterica',
    nameFa: 'سالمونلا انتریکا',
    family: 'Enterobacteriaceae',
    category: 'pathogen',
    morphology: 'bacillus',
    gramStain: 'gram_negative',
    sporeForming: false,
    motility: true,
    oxygenRequirement: 'facultative_anaerobe',
    optimumTemperatureC: 37,
    temperatureRangeC: { min: 5.2, opt: 37, max: 46.2 },
    optimumPh: 7.2,
    phRange: { min: 3.8, opt: 7.2, max: 9.5 },
    minimumAw: 0.94,
    maximumSaltTolerancePercent: 8.0,
    foodSafetySignificanceFa: 'یکی از شایع‌ترین عوامل مسمومیت‌های غذایی در جهان. دوز عفونت‌زایی بسیار پایینی دارد (گاهی کمتر از ۱۰ تا ۱۰۰ باکتری). مقاومت بالایی در برابر خشکی در شکلات، پودر شیر و مغزها دارد.',
    commonFoodSources: ['تخم‌مرغ و فرآورده‌های تخم‌مرغی', 'گوشت مرغ و بوقلمون', 'شیر خشک', 'شکلات', 'کره بادام‌زمینی'],
    spoilageOrIllnessCharacteristics: 'سالمونلوزیس: گاستروانتریت، تب، استفراغ، اسهال، سردرد',
    incubationPeriodAndSymptoms: '۶ الی ۷۲ ساعت (معمولاً ۱۲ تا ۳۶ ساعت)؛ علائم ۴ تا ۷ روز ادامه می‌یابد',
    heatResistanceDValue: 'D_60°C = 1 - 3 min در ماتریس‌های آبی؛ در شکلات و چربی D_70°C به چندین ساعت می‌رسد!',
    toxinProduction: 'انتروتوکسین و اندوتوکسین LPS دیواره',
    biochemicalProfile: {
      catalase: 'positive',
      oxidase: 'negative',
      indole: 'negative',
      methylRed: 'positive',
      vogesProskauer: 'negative',
      citrate: 'positive',
      urease: 'negative',
      h2sProduction: 'positive',
      gasFromGlucose: 'positive'
    },
    typicalStandardsLimits: [
      { foodCategory: 'کلیه مواد غذایی آماده مصرف (RTE)', standardRef: 'INSO 2394', limitDescription: 'عدم حضور در ۲۵ گرم (n=5, c=0, m=0)' },
      { foodCategory: 'شیر خشک نوزاد', standardRef: 'INSO 2394 / Codex', limitDescription: 'عدم حضور در ۳۷۵ گرم (n=10, c=0, m=0)' }
    ],
    referenceStrains: ['ATCC 14028 (S. Typhimurium)', 'ATCC 13076 (S. Enteritidis)']
  },
  {
    id: 'mo-staph',
    scientificName: 'Staphylococcus aureus',
    nameFa: 'استافیلوکوکوس اورئوس',
    family: 'Staphylococcaceae',
    category: 'pathogen',
    morphology: 'coccus',
    gramStain: 'gram_positive',
    sporeForming: false,
    motility: false,
    oxygenRequirement: 'facultative_anaerobe',
    optimumTemperatureC: 37,
    temperatureRangeC: { min: 7, opt: 37, max: 48 },
    optimumPh: 7.0,
    phRange: { min: 4.0, opt: 7.0, max: 10.0 },
    minimumAw: 0.83, // بسیار مقاوم به خشکی و شوری
    maximumSaltTolerancePercent: 20.0, // تحمل نمک بسیار بالا
    foodSafetySignificanceFa: 'بومی پوست و مخاط بینی انسان (۵۰٪ افراد ناقل هستند). در تعداد بالاتر از ۱۰⁵ CFU/g انتروتوکسین‌های فوق‌العاده مقاوم به حرارت (SE A تا E) تولید می‌کند که با پخت خانگی و پاستوریزاسیون تخریب نمی‌شوند.',
    commonFoodSources: ['شیرینی‌های خامه‌ای و دسرهای قنادی', 'سالاد الویه و ساندویچ‌های سرد', 'پنیرهای سنتی شور', 'گوشت‌های پخته دستکاری شده'],
    spoilageOrIllnessCharacteristics: 'مسمومیت حاد ناشی از سم از پیش تشکیل شده: تهوع و استفراغ شدید پرتابی، انقباضات شکمی، معمولا بدون تب',
    incubationPeriodAndSymptoms: 'کمون بسیار سریع ۳۰ دقیقه تا ۶ ساعت (میانگین ۲ الی ۴ ساعت)',
    heatResistanceDValue: 'باکتری D_60°C = 0.5 - 2 min؛ اما انتروتوکسین حرارت ۱۰۰ درجه را تا ۳۰ دقیقه تحمل می‌کند!',
    toxinProduction: 'انتروتوکسین‌های استافیلوکوکی A, B, C, D, E',
    biochemicalProfile: {
      catalase: 'positive',
      oxidase: 'negative',
      coagulase: 'positive',
      betaGlucuronidase: 'negative'
    },
    typicalStandardsLimits: [
      { foodCategory: 'شیرینی خامه‌ای', standardRef: 'INSO 2394', limitDescription: 'm = کمتر از 10 CFU/g (M = 100 CFU/g)' },
      { foodCategory: 'پنیر رسیده در آب‌نمک', standardRef: 'INSO 2394', limitDescription: 'm = 100 CFU/g, M = 1000 CFU/g' }
    ],
    referenceStrains: ['ATCC 6538 (سویه تست استاندارد)', 'ATCC 25923 (سویه حساس)']
  },
  {
    id: 'mo-listeria',
    scientificName: 'Listeria monocytogenes',
    nameFa: 'لیستریا مونوسیتوژنز',
    family: 'Listeriaceae',
    category: 'pathogen',
    morphology: 'bacillus',
    gramStain: 'gram_positive',
    sporeForming: false,
    motility: true, // متحرک چتری در ۲۲-۲۵ درجه، غیرمتحرک در ۳۷ درجه
    oxygenRequirement: 'facultative_anaerobe',
    optimumTemperatureC: 37,
    temperatureRangeC: { min: -0.4, opt: 37, max: 45 }, // سایکروتروفیک (رشد در دمای یخچال)
    optimumPh: 7.0,
    phRange: { min: 4.3, opt: 7.0, max: 9.6 },
    minimumAw: 0.92,
    maximumSaltTolerancePercent: 12.0,
    foodSafetySignificanceFa: 'پاتوژن سرماست (سایکروتروف) که در دمای یخچال ۴ درجه تکثیر می‌یابد. در بیوفیلم‌های کف کارخانه‌ها پایدار است. در زنان باردار باعث سقط جنین و در افراد مسن مننژیت کشنده ایجاد می‌کند (میزان مرگ‌ومیر ۲۰ تا ۳۰٪).',
    commonFoodSources: ['پنیرهای نرم با پوسته رسیده', 'سوسیس، کالباس و گوشت‌های آماده مصرف (RTE)', 'ماهی دودی', 'شیر غیرپاستوریزه'],
    spoilageOrIllnessCharacteristics: 'لیستریوزیس: علائم شبه آنفولانزا، مننژیت، سپتی‌سمی، سقط جنین',
    incubationPeriodAndSymptoms: 'دوره کمون طولانی از ۳ روز تا ۷۰ روز (میانگین ۳ هفته)',
    heatResistanceDValue: 'D_70°C = 0.1 - 0.3 min (به پاستوریزاسیون حساس است)',
    toxinProduction: 'لیستریولیزین O (همولیزین)',
    biochemicalProfile: {
      catalase: 'positive',
      oxidase: 'negative',
      vogesProskauer: 'positive',
      methylRed: 'positive',
      urease: 'negative',
      h2sProduction: 'negative'
    },
    typicalStandardsLimits: [
      { foodCategory: 'غذاهای آماده مصرف برای نوزادان و مصارف خاص پزشکی', standardRef: 'INSO 2394 / Codex', limitDescription: 'عدم حضور در ۲۵ گرم (n=10, c=0)' },
      { foodCategory: 'سایر غذاهای آماده مصرف RTE قادر به رشد لیستریا', standardRef: 'INSO 2394', limitDescription: 'عدم حضور در ۲۵ گرم در زمان خروج از کارخانه' }
    ],
    referenceStrains: ['ATCC 19115', 'ATCC 13932', 'NCTC 11994']
  },
  {
    id: 'mo-cereus',
    scientificName: 'Bacillus cereus',
    nameFa: 'باسیلوس سرئوس',
    family: 'Bacillaceae',
    category: 'pathogen',
    morphology: 'bacillus',
    gramStain: 'gram_positive',
    sporeForming: true, // اسپوردار هوازی
    motility: true,
    oxygenRequirement: 'facultative_anaerobe',
    optimumTemperatureC: 30,
    temperatureRangeC: { min: 4, opt: 30, max: 50 },
    optimumPh: 7.0,
    phRange: { min: 4.5, opt: 7.0, max: 9.3 },
    minimumAw: 0.92,
    maximumSaltTolerancePercent: 10.0,
    foodSafetySignificanceFa: 'اسپورهای این باکتری در برابر پخت برنج و حبوبات زنده می‌مانند و با نگهداری غذا در دمای محیط جوانه می‌زنند. دو سندروم ایجاد می‌کند: ۱. سندروم تهوع‌زا (Emetic) ناشی از سرولید مقاوم به حرارت در برنج؛ ۲. سندروم اسهالی ناشی از انتروتوکسین حساس به حرارت در گوشت و سس‌ها.',
    commonFoodSources: ['برنج پخته شده نگهداری شده در دمای اتاق', 'پاستا و غذاهای نشاسته‌ای', 'ادویه‌جات', 'شیر و دسرهای نشاسته‌ای'],
    spoilageOrIllnessCharacteristics: 'سندروم تهوع‌آور (کمون ۱-۵ ساعت) یا سندروم اسهالی (کمون ۸-۱۶ ساعت)',
    incubationPeriodAndSymptoms: 'سندروم استفراغی: ۱ تا ۵ ساعت؛ سندروم اسهالی: ۸ تا ۱۶ ساعت',
    heatResistanceDValue: 'اسپورها D_95°C = 2 - 36 min؛ توکسین سرولید در ۱۲۱ درجه ۹۰ دقیقه مقاومت می‌کند!',
    toxinProduction: 'سرولید (Cereulide - امتیک مقاوم به حرارت) و انتروتوکسین‌های Hbl و Nhe (اسهالی)',
    biochemicalProfile: {
      catalase: 'positive',
      oxidase: 'variable',
      vogesProskauer: 'positive'
    },
    typicalStandardsLimits: [
      { foodCategory: 'غذای کودک پایه غلات', standardRef: 'INSO 2394', limitDescription: 'm = کمتر از 50 CFU/g (M = 500 CFU/g)' },
      { foodCategory: 'برنج پخته و فرآورده‌های پاستا', standardRef: 'INSO 2394', limitDescription: 'm = 100 CFU/g, M = 1000 CFU/g' }
    ],
    referenceStrains: ['ATCC 11778', 'ATCC 14579']
  },
  {
    id: 'mo-clostridium',
    scientificName: 'Clostridium perfringens',
    nameFa: 'کلستریدیوم پرفرنژنس',
    family: 'Clostridiaceae',
    category: 'pathogen',
    morphology: 'bacillus',
    gramStain: 'gram_positive',
    sporeForming: true, // اسپوردار بی‌هوازی
    motility: false,
    oxygenRequirement: 'obligate_anaerobe',
    optimumTemperatureC: 43, // زمان دو برابر شدن فوق‌العاده کوتاه (۱۰ دقیقه در ۴۳ درجه)
    temperatureRangeC: { min: 12, opt: 43, max: 50 },
    optimumPh: 7.2,
    phRange: { min: 5.0, opt: 7.2, max: 8.5 },
    minimumAw: 0.93,
    maximumSaltTolerancePercent: 6.0,
    foodSafetySignificanceFa: 'باکتری بی‌هوازی اسپوردار با سرعت رشد فوق‌العاده در خورش‌ها و غذاهای گوشتی غلیظ دیگ‌های بزرگ که به آرامی خنک می‌شوند. در روده انسان در حین اسپورولاسیون انتروتوکسین (CPE) ترشح می‌کند.',
    commonFoodSources: ['خورش‌ها و آبگوشت‌های دیگی بزرگ', 'گوشت و مرغ پخته نگهداری شده در دمای ولرم (۲۰-۵۰ درجه)', 'سس‌های گوشتی'],
    spoilageOrIllnessCharacteristics: 'دردهای شکمی شدید، گاز و نفخ زیاد، اسهال شدید آبکی بدون تب یا استفراغ',
    incubationPeriodAndSymptoms: '۸ الی ۲۴ ساعت (میانگین ۱۰ تا ۱۲ ساعت)',
    heatResistanceDValue: 'اسپورها D_100°C = 0.5 - 30 min (بسیار مقاوم به جوشاندن)',
    toxinProduction: 'انتروتوکسین کلستریدیوم پرفرنژنس (CPE)',
    biochemicalProfile: {
      catalase: 'negative',
      oxidase: 'negative',
      h2sProduction: 'positive'
    },
    typicalStandardsLimits: [
      { foodCategory: 'فرآورده‌های گوشتی پخته آماده مصرف', standardRef: 'INSO 2394', limitDescription: 'm = کمتر از 10 CFU/g (M = 100 CFU/g)' }
    ],
    referenceStrains: ['ATCC 13124']
  }
];

export const CULTURE_MEDIA_DATABASE: CultureMediaItem[] = [
  {
    id: 'cm-pca',
    code: 'PCA',
    nameFa: 'پلیت کانت آگار (Plate Count Agar / Standard Methods Agar)',
    nameEn: 'Plate Count Agar (PCA)',
    mediaType: 'non_selective',
    physicalForm: 'dehydrated_powder',
    formulaGPerLiter: [
      { ingredientFa: 'پپتون کازئین (ترپتون)', ingredientEn: 'Enzymatic Digest of Casein (Tryptone)', amountGrams: 5.0 },
      { ingredientFa: 'عصاره مخمر (Yeast Extract)', ingredientEn: 'Yeast Extract', amountGrams: 2.5 },
      { ingredientFa: 'گلوکز (دکستروز)', ingredientEn: 'D-Glucose', amountGrams: 1.0 },
      { ingredientFa: 'آگار آگار میکروبیولوژی', ingredientEn: 'Agar', amountGrams: 15.0 }
    ],
    totalGramsPerLiter: 23.5,
    preparationInstructionsFa: 'مقدار ۲۳.۵ گرم پودر را در ۱۰۰۰ میلی‌لیتر آب مقطر دیونیزه حل کرده، به آرامی حرارت دهید تا آگار کاملاً شفاف و حل شود. سپس در ظروف مناسب توزیع کرده و در اتوکلاو استریل نمایید.',
    autoclaveParameters: {
      temperatureC: 121,
      pressurePsi: 15,
      timeMinutes: 15,
      requiresAutoclave: true
    },
    finalPhAt25C: '7.0 ± 0.2',
    storageConditions: {
      powderStorage: 'دمای ۱۰ تا ۳۰ درجه، درب کاملاً بسته و در محیط خشک',
      preparedMediaStorage: 'دمای ۲ تا ۸ درجه سلسیوس در کیسه‌های پلی‌اتیلنی بسته',
      shelfLifePreparedPlates: 'حداکثر ۱ ماه در یخچال'
    },
    qualityControlStrains: [
      {
        strainName: 'Escherichia coli',
        strainNumber: 'ATCC 25922 / WDCM 00013',
        expectedReaction: 'رشد خوب (PR >= 0.70)',
        growthCriteria: 'productive_PR_ge_0.7'
      },
      {
        strainName: 'Bacillus subtilis',
        strainNumber: 'ATCC 6633 / WDCM 00003',
        expectedReaction: 'رشد عالی (PR >= 0.70)',
        growthCriteria: 'productive_PR_ge_0.7'
      },
      {
        strainName: 'Staphylococcus aureus',
        strainNumber: 'ATCC 6538 / WDCM 00032',
        expectedReaction: 'رشد مطلوب (PR >= 0.70)',
        growthCriteria: 'productive_PR_ge_0.7'
      }
    ],
    standardReferences: ['INSO 5272-1', 'ISO 4833-1', 'ISO 11133']
  },
  {
    id: 'cm-vrba',
    code: 'VRBA',
    nameFa: 'ویولت رد بایل آگار (Violet Red Bile Lactose Agar)',
    nameEn: 'Violet Red Bile Agar (VRBA)',
    mediaType: 'selective',
    physicalForm: 'dehydrated_powder',
    formulaGPerLiter: [
      { ingredientFa: 'پپتون مخمر و گوشت', ingredientEn: 'Peptone', amountGrams: 7.0 },
      { ingredientFa: 'عصاره مخمر', ingredientEn: 'Yeast Extract', amountGrams: 3.0 },
      { ingredientFa: 'لاکتوز', ingredientEn: 'Lactose', amountGrams: 10.0 },
      { ingredientFa: 'املاح صفراوی شماره ۳ (Bile Salts No. 3)', ingredientEn: 'Bile Salts No. 3', amountGrams: 1.5 },
      { ingredientFa: 'کلرید سدیم (NaCl)', ingredientEn: 'Sodium Chloride', amountGrams: 5.0 },
      { ingredientFa: 'نوترال رد (Neutral Red)', ingredientEn: 'Neutral Red', amountGrams: 0.03 },
      { ingredientFa: 'کریستال ویولت', ingredientEn: 'Crystal Violet', amountGrams: 0.002 },
      { ingredientFa: 'آگار', ingredientEn: 'Agar', amountGrams: 15.0 }
    ],
    totalGramsPerLiter: 41.5,
    preparationInstructionsFa: 'مقدار ۴۱.۵ گرم پودر را در ۱ لیتر آب مقطر سوسپانسیون کرده، حرارت دهید تا به جوش آید و به مدت ۲ دقیقه به آرامی بجوشد تا کاملاً حل شود. هرگز این محیط را در اتوکلاو قرار ندهید! پس از جوشاندن تا ۴۵-۴۷ درجه خنک کرده و استفاده کنید.',
    autoclaveParameters: {
      temperatureC: 100,
      pressurePsi: 0,
      timeMinutes: 2,
      requiresAutoclave: false,
      specialHeatingNote: 'عدم اتوکلاو - فقط ۲ دقیقه جوشاندن روی هیتر استیرر'
    },
    finalPhAt25C: '7.4 ± 0.2',
    storageConditions: {
      powderStorage: 'دمای محیط، محافظت از نور و رطوبت',
      preparedMediaStorage: 'به صورت تازه مصرف شود (حداکثر ۴ ساعت پس از تهیه)',
      shelfLifePreparedPlates: 'پلیت‌های آماده حداکثر تا ۲۴ ساعت در یخچال قابل نگهداری است'
    },
    qualityControlStrains: [
      {
        strainName: 'Escherichia coli',
        strainNumber: 'ATCC 25922',
        expectedReaction: 'کلنی‌های قرمز ارغوانی با هاله رسوب صفراوی',
        growthCriteria: 'characteristic_colonies'
      },
      {
        strainName: 'Enterococcus faecalis',
        strainNumber: 'ATCC 29212',
        expectedReaction: 'مهار کامل رشد (عدم رشد)',
        growthCriteria: 'selective_inhibited'
      }
    ],
    standardReferences: ['INSO 2946-1', 'ISO 4832', 'ISO 11133']
  },
  {
    id: 'cm-bp-agar',
    code: 'BP-Agar',
    nameFa: 'برد پارکر آگار (Baird-Parker Agar Base)',
    nameEn: 'Baird-Parker Agar Base',
    mediaType: 'selective',
    physicalForm: 'dehydrated_powder',
    formulaGPerLiter: [
      { ingredientFa: 'پپتون کازئین', ingredientEn: 'Pancreatic Digest of Casein', amountGrams: 10.0 },
      { ingredientFa: 'عصاره گوشت (Beef Extract)', ingredientEn: 'Beef Extract', amountGrams: 5.0 },
      { ingredientFa: 'عصاره مخمر', ingredientEn: 'Yeast Extract', amountGrams: 1.0 },
      { ingredientFa: 'پیروات سدیم (Sodium Pyruvate)', ingredientEn: 'Sodium Pyruvate', amountGrams: 10.0 },
      { ingredientFa: 'گلیسین (Glycine)', ingredientEn: 'Glycine', amountGrams: 12.0 },
      { ingredientFa: 'کلرید لیتیم (Lithium Chloride)', ingredientEn: 'Lithium Chloride', amountGrams: 5.0 },
      { ingredientFa: 'آگار', ingredientEn: 'Agar', amountGrams: 20.0 }
    ],
    totalGramsPerLiter: 63.0,
    preparationInstructionsFa: 'مقدار ۶۳.۰ گرم پایه پودر را در ۹۵۰ میلی‌لیتر آب مقطر حل کرده و در دمای ۱۲۱ درجه به مدت ۱۵ دقیقه اتوکلاو نمایید. اجازه دهید تا دمای ۴۵ تا ۴۷ درجه خنک شود، سپس ۵۰ میلی‌لیتر امولسیون استریل زرده تخم‌مرغ تلوریت (EYT) اضافه کرده و به آرامی مخلوط کنید و در پلیت‌ها بریزید.',
    autoclaveParameters: {
      temperatureC: 121,
      pressurePsi: 15,
      timeMinutes: 15,
      requiresAutoclave: true,
      specialHeatingNote: 'مکمل زرده تخم‌مرغ تلوریت پس از اتوکلاو و خنک‌سازی تا ۴۵ درجه اضافه می‌شود'
    },
    finalPhAt25C: '7.2 ± 0.2',
    storageConditions: {
      powderStorage: 'دمای محیط، خشک و تاریک',
      preparedMediaStorage: '۲ تا ۸ درجه سلسیوس در کیسه پلاستیکی مات',
      shelfLifePreparedPlates: 'حداکثر ۲ هفته در یخچال'
    },
    selectiveSupplements: [
      {
        supplementName: 'امولسیون زرده تخم‌مرغ و تلوریت پتاسیم (Egg Yolk Tellurite Emulsion)',
        concentrationPerLiter: '50 mL / Liter',
        additionTime: 'after_cooling_45C',
        purpose: 'تلوریت پتاسیم عامل انتخابی و رنگ سیاه کلنی، زرده تخم‌مرغ سوبسترای لسیتیناز و لیپاز'
      }
    ],
    qualityControlStrains: [
      {
        strainName: 'Staphylococcus aureus',
        strainNumber: 'ATCC 6538',
        expectedReaction: 'کلنی سیاه براق با هاله شفاف و حلقه کدر رسوبی',
        growthCriteria: 'characteristic_colonies'
      },
      {
        strainName: 'Staphylococcus epidermidis',
        strainNumber: 'ATCC 12228',
        expectedReaction: 'کلنی سیاه/خاکستری بدون هاله شفاف',
        growthCriteria: 'characteristic_colonies'
      },
      {
        strainName: 'Escherichia coli',
        strainNumber: 'ATCC 25922',
        expectedReaction: 'مهار کامل توسط کلرید لیتیم و تلوریت',
        growthCriteria: 'selective_inhibited'
      }
    ],
    standardReferences: ['INSO 6806-1', 'ISO 6888-1', 'ISO 11133']
  },
  {
    id: 'cm-xld',
    code: 'XLD',
    nameFa: 'گزیلوز لایزین دزوکسی کولات آگار (Xylose Lysine Deoxycholate Agar)',
    nameEn: 'Xylose Lysine Deoxycholate Agar (XLD)',
    mediaType: 'differential',
    physicalForm: 'dehydrated_powder',
    formulaGPerLiter: [
      { ingredientFa: 'عصاره مخمر', ingredientEn: 'Yeast Extract', amountGrams: 3.0 },
      { ingredientFa: 'L-لایزین (L-Lysine)', ingredientEn: 'L-Lysine', amountGrams: 5.0 },
      { ingredientFa: 'گزیلوز (Xylose)', ingredientEn: 'Xylose', amountGrams: 3.75 },
      { ingredientFa: 'لاکتوز', ingredientEn: 'Lactose', amountGrams: 7.5 },
      { ingredientFa: 'ساکاروز (Sucrose)', ingredientEn: 'Sucrose', amountGrams: 7.5 },
      { ingredientFa: 'دزوکسی کولات سدیم (Sodium Deoxycholate)', ingredientEn: 'Sodium Deoxycholate', amountGrams: 1.0 },
      { ingredientFa: 'کلرید سدیم', ingredientEn: 'Sodium Chloride', amountGrams: 5.0 },
      { ingredientFa: 'تیوسولفات سدیم (Sodium Thiosulfate)', ingredientEn: 'Sodium Thiosulfate', amountGrams: 6.8 },
      { ingredientFa: 'سیترات آمونیوم آهن (Ferric Ammonium Citrate)', ingredientEn: 'Ferric Ammonium Citrate', amountGrams: 0.8 },
      { ingredientFa: 'فنل رد (Phenol Red)', ingredientEn: 'Phenol Red', amountGrams: 0.08 },
      { ingredientFa: 'آگار', ingredientEn: 'Agar', amountGrams: 14.5 }
    ],
    totalGramsPerLiter: 55.0,
    preparationInstructionsFa: 'مقدار ۵۵.۰ گرم پودر را در ۱۰۰۰ میلی‌لیتر آب مقطر ریخته، مرتب هم بزنید و روی شعله حرارت دهید تا به جوش آید. به محض جوش آمدن شعله را خاموش کنید. اتوکلاو نکنید و بیش از حد حرارت ندهید زیرا سدیم دزوکسی‌کولات رسوب می‌کند. تا ۵۰ درجه خنک کرده و در پلیت‌ها بریزید.',
    autoclaveParameters: {
      temperatureC: 100,
      pressurePsi: 0,
      timeMinutes: 1,
      requiresAutoclave: false,
      specialHeatingNote: 'هرگز اتوکلاو نشود - حرارت بیش از حد معرف‌های H2S را تخریب می‌کند'
    },
    finalPhAt25C: '7.4 ± 0.2',
    storageConditions: {
      powderStorage: 'دمای محیط، خشک و تاریک',
      preparedMediaStorage: '۲ تا ۸ درجه در کیسه‌های مات',
      shelfLifePreparedPlates: 'حداکثر ۱ هفته'
    },
    qualityControlStrains: [
      {
        strainName: 'Salmonella Typhimurium',
        strainNumber: 'ATCC 14028',
        expectedReaction: 'کلنی‌های قرمز/صورتی با مرکز سیاه (تولید H2S)',
        growthCriteria: 'characteristic_colonies'
      },
      {
        strainName: 'Shigella flexneri',
        strainNumber: 'ATCC 12022',
        expectedReaction: 'کلنی‌های قرمز شفاف بدون مرکز سیاه',
        growthCriteria: 'characteristic_colonies'
      },
      {
        strainName: 'Escherichia coli',
        strainNumber: 'ATCC 25922',
        expectedReaction: 'کلنی‌های زرد رنگ مات (تخمیر لاکتوز/ساکاروز) یا رشد مهارشده',
        growthCriteria: 'characteristic_colonies'
      },
      {
        strainName: 'Enterococcus faecalis',
        strainNumber: 'ATCC 29212',
        expectedReaction: 'مهار کامل رشد',
        growthCriteria: 'selective_inhibited'
      }
    ],
    standardReferences: ['INSO 1810-1', 'ISO 6579-1', 'ISO 11133']
  },
  {
    id: 'cm-drbc',
    code: 'DRBC',
    nameFa: 'دیکلوران رز بنگال کلرامفنیکل آگار (DRBC Agar)',
    nameEn: 'Dichloran Rose Bengal Chloramphenicol Agar (DRBC)',
    mediaType: 'selective',
    physicalForm: 'dehydrated_powder',
    formulaGPerLiter: [
      { ingredientFa: 'پپتون آنزیمی', ingredientEn: 'Enzymatic Digest of Animal Tissues', amountGrams: 5.0 },
      { ingredientFa: 'گلوکز', ingredientEn: 'D-Glucose', amountGrams: 10.0 },
      { ingredientFa: 'پتاسیم دی‌هیدروژن فسفات (KH2PO4)', ingredientEn: 'Potassium Dihydrogen Phosphate', amountGrams: 1.0 },
      { ingredientFa: 'سولفات منیزیم (MgSO4.7H2O)', ingredientEn: 'Magnesium Sulfate', amountGrams: 0.5 },
      { ingredientFa: 'دیکلوران (Dichloran)', ingredientEn: 'Dichloran', amountGrams: 0.002 },
      { ingredientFa: 'رز بنگال (Rose Bengal)', ingredientEn: 'Rose Bengal', amountGrams: 0.025 },
      { ingredientFa: 'کلرامفنیکل (Chloramphenicol)', ingredientEn: 'Chloramphenicol', amountGrams: 0.1 },
      { ingredientFa: 'آگار', ingredientEn: 'Agar', amountGrams: 15.0 }
    ],
    totalGramsPerLiter: 31.6,
    preparationInstructionsFa: 'مقدار ۳۱.۶ گرم پودر را در ۱۰۰۰ میلی‌لیتر آب حل کرده و در دمای ۱۲۱ درجه به مدت ۱۵ دقیقه اتوکلاو کنید. بلافاصله پس از اتوکلاو در بن‌ماری ۴۵-۴۷ درجه قرار دهید و در پلیت‌ها بریزید. در تمام مراحل از تابش نور مستقیم به محیط خودداری نمایید.',
    autoclaveParameters: {
      temperatureC: 121,
      pressurePsi: 15,
      timeMinutes: 15,
      requiresAutoclave: true,
      specialHeatingNote: 'حفاظت در برابر نور بسیار حیاتی است'
    },
    finalPhAt25C: '5.6 ± 0.2',
    storageConditions: {
      powderStorage: 'دمای محیط در ظرف مات و دربسته',
      preparedMediaStorage: '۲ تا ۸ درجه در کیسه‌های کاملاً مات تیره',
      shelfLifePreparedPlates: 'حداکثر ۱ ماه در تاریکی'
    },
    qualityControlStrains: [
      {
        strainName: 'Saccharomyces cerevisiae',
        strainNumber: 'ATCC 9763',
        expectedReaction: 'کلنی‌های گرد صورتی خوش‌رنگ (PR >= 0.70)',
        growthCriteria: 'productive_PR_ge_0.7'
      },
      {
        strainName: 'Aspergillus brasiliensis',
        strainNumber: 'ATCC 16404',
        expectedReaction: 'میسلیوم‌های محدود شده با اسپورزایی سیاه',
        growthCriteria: 'characteristic_colonies'
      },
      {
        strainName: 'Escherichia coli / Bacillus subtilis',
        strainNumber: 'ATCC 25922 / ATCC 6633',
        expectedReaction: 'مهار کامل باکتری‌ها توسط کلرامفنیکل',
        growthCriteria: 'selective_inhibited'
      }
    ],
    standardReferences: ['INSO 997-1', 'ISO 21527-1', 'ISO 11133']
  }
];

export const MICROBIOLOGY_EQUIPMENT_DATABASE: MicrobiologyEquipmentItem[] = [
  {
    id: 'eq-bsc-01',
    nameFa: 'هود ایمنی زیستی کلاس ۲ (Biosafety Cabinet Class II Type A2)',
    nameEn: 'Biosafety Cabinet Class II Type A2',
    category: 'containment',
    standardOperationGuideline: 'قبل از شروع کار، فن هود را روشن کرده و اجازه دهید حداقل ۱۵ دقیقه کار کند تا جریان هوای لامینار تثبیت شود. سطح میز کار را با اتانول ۷۰٪ ضدعفونی کنید. لامپ UV را در زمان حضور اپراتور خاموش نمایید. از انباشتن وسایل روی گریل‌های ورودی هوا خودداری کنید.',
    criticalParameters: 'سرعت جریان هوای رو به پایین (Inflow Velocity): 0.45 m/s ± 0.05 | راندمان فیلتر HEPA: 99.99% برای ذرات 0.3 میکرومتر',
    calibrationAndMonitoring: {
      frequency: 'سالانه یا پس از هر بار جابجایی دستگاه',
      methodFa: 'تست یکپارچگی فیلتر HEPA با آئروسل DOP/PAO و آزمون سرعت‌سنجی بادسنج حرارتی (Anemometer)',
      biologicalIndicator: 'آزمون ته‌نشینی صفحات آگار در جریان کار (Settle Plates) - کمتر از ۳ کلنی در هر ساعت',
      acceptanceCriteria: 'عدم نشتی فیلتر HEPA (< 0.01%) و جریان یکنواخت لامینار'
    },
    biosafetyRules: [
      'روشن بودن دائمی فن حین کار با پاتوژن‌ها (سالمونلا، لیستریا، استاف اورئوس)',
      'عدم استفاده از شعله گاز مداوم (ترجیحا استفاده از استریل‌کننده میکرو مادون قرمز Bacti-Cinerator جهت جلوگیری از به هم خوردن جریان لامینار)',
      'ضدعفونی کامل با الکل ۷۰٪ در پایان کار'
    ]
  },
  {
    id: 'eq-autoclave-02',
    nameFa: 'اتوکلاو عمودی آزمایشگاهی (Vertical Steam Autoclave)',
    nameEn: 'Laboratory Steam Autoclave',
    category: 'sterilization',
    standardOperationGuideline: 'استریلیزاسیون محیط‌های کشت، رقیق‌کننده‌ها و پسماندهای بیولوژیک با بخار آب تحت فشار. بارگذاری متقارن ظروف بدون بستن کامل درب شیشه‌ها (درب شیشه‌های درپیچ‌دار نیم‌دور باز باشد تا نترکد). چرخه استاندارد: ۱۲۱ درجه سلسیوس، فشار ۱۵ پوند (1.05 bar) به مدت ۱۵ تا ۲۰ دقیقه.',
    criticalParameters: 'دما: 121.0 °C تا 124.0 °C | فشار: 1.05 - 1.15 bar (15 psi) | زمان نگهداری: ۱۵ دقیقه برای محیط کشت و ۶۰ دقیقه برای پسماندهای آلوده',
    calibrationAndMonitoring: {
      frequency: 'کالیبراسیون سنسور دما و مانومتر فشار هر ۶ ماه؛ تست بیولوژیک هفتگی',
      methodFa: 'پایش همزمان با سنسور حرارتی دیتالاگر ضدآب کالیبره و نوار اندیکاتور شیمیایی کلاس ۶ (TSIs)',
      biologicalIndicator: 'آمپول اسپور ژئوباسیلوس استئاروترموفیلوس (Geobacillus stearothermophilus ATCC 7953) با دانسیته 10⁶ اسپور',
      acceptanceCriteria: 'عدم رشد باکتری اسپوردار پس از ۷۲ ساعت انکوباسیون در ۵۵ درجه (رنگ بنفش بدون تغییر زرد)'
    },
    biosafetyRules: [
      'هرگز درب اتوکلاو را قبل از رسیدن فشار به صفر و افت دما به زیر ۸۰ درجه باز نکنید (خطر انفجار و پاشش مایعات داغ)',
      'پسماندهای آلوده و محیط‌های پاتوژن کشت داده شده باید قبل از دورریز اتوکلاو شوند'
    ]
  },
  {
    id: 'eq-stomacher-03',
    nameFa: 'دستگاه هموژنایزر ضربه‌ای استومیکر (Paddle Homogenizer / Stomacher 400)',
    nameEn: 'Paddle Homogenizer (Stomacher)',
    category: 'sample_prep',
    standardOperationGuideline: 'آماده‌سازی سوسپانسیون اولیه نمونه‌های جامد با ضربات متناوب پارویی درون کیسه استریل بدون تماس مستقیم تیغه با نمونه (جلوگیری از آلودگی متقاطع). سرعت استاندارد ۲۳۰ دور بر دقیقه به مدت ۱ الی ۲ دقیقه.',
    criticalParameters: 'سرعت ضربات: ۲۳۰ ضربه بر دقیقه (۶ تا ۸ ضربه بر ثانیه) | ظرفیت: کیسه‌های ۸۰ تا ۴۰۰ میلی‌لیتر',
    calibrationAndMonitoring: {
      frequency: 'سالانه',
      methodFa: 'بررسی زمان‌سنج دیجیتال و شمارنده ضربات با تاکومتر کالیبره',
      acceptanceCriteria: 'دقت زمان‌سنجی ±۲ ثانیه'
    },
    biosafetyRules: [
      'استفاده از کیسه‌های فیلتردار برای نمونه‌های حاوی ذرات درشت (مانند گوشت و سبزیجات)',
      'ضدعفونی فوری محفظه در صورت نشتی یا سوراخ شدن کیسه'
    ]
  },
  {
    id: 'eq-incubator-04',
    nameFa: 'انکوباتور باکتریولوژی (Bacteriological Precision Incubator)',
    nameEn: 'Precision Incubator (30 °C, 37 °C, 44 °C)',
    category: 'incubation',
    standardOperationGuideline: 'گرمخانه‌گذاری پلیت‌ها و لوله‌های کشت در دمای ثابت. چیدمان پلیت‌ها با فاصله از دیواره‌ها و انباشتن حداکثر ۶ پلیت روی هم. باز و بسته کردن سریع درب شیشه‌ای داخلی برای جلوگیری از نوسان دما.',
    criticalParameters: 'نوسان دما: کمتر از ±۰.۵ درجه سلسیوس | یکنواختی دما در تمام طبقات (Thermal Mapping)',
    calibrationAndMonitoring: {
      frequency: 'کالیبراسیون سالانه دماسنج و ترمومپینگ سالانه در ۹ نقطه کابین',
      methodFa: 'پایش پیوسته دما با دیتالاگر PT100 کالیبره و دماسنج کالیبره غوطه‌ور در گلیسیرین در هر طبقه',
      acceptanceCriteria: 'انحراف دما در تمام نقاط طبقات کمتر از ±۱.۰ درجه از دمای تنظیمی'
    },
    biosafetyRules: [
      'وارونه قرار دادن تمام پلیت‌های کشت باکتریایی برای جلوگیری از چکیدن قطرات آب میعان بر روی سطح آگار'
    ]
  }
];

export const COMMON_MICROBIOLOGY_ERRORS: MicrobiologyTroubleshootingItem[] = [
  {
    id: 'mb-err-01',
    category: 'حرارتی و ذوب آگار',
    titleFa: 'شوک حرارتی به سلول‌های باکتریایی در روش پورپلیت (Heat Shock Lethality)',
    symptomFa: 'کاهش شدید و غیرعادی شمارش کلنی‌ها (زیرشمارش کاذب)، تشکیل حباب‌های ریز در عمق آگار یا مرگ باکتری‌های حساس سرمادوست.',
    rootCauseFa: 'ریختن محیط آگار مذاب با دمای بالاتر از ۴۷ درجه سلسیوس (مثلاً ۵۲ تا ۶۰ درجه) بر روی سوسپانسیون نمونه تلقیح‌شده.',
    investigationMethodFa: 'بررسی دمای بن‌ماری حمام آب با دماسنج کالیبره قبل از ریختن آگار، مقایسه نتایج شمارش با روش کشت سطحی (Spread Plate).',
    correctiveActionFa: 'تکرار فوری آزمون با استفاده از محیط کشت خنک‌شده تا دمای ۴۴ الی ۴۷ درجه سانتی‌گراد.',
    preventiveActionFa: 'قرار دادن ارلن آگار مذاب در بن‌ماری آب با دمای کنترل‌شده ۴۵ ± ۱ درجه به مدت حداقل ۳۰ دقیقه پیش از مصرف و کنترل دمای ارلن شاهد با دماسنج.',
    standardSource: 'ISO 7218:2007 Clause 9.2.2.3'
  },
  {
    id: 'mb-err-02',
    category: 'شمارش و کلنی‌های رونده',
    titleFa: 'رشد رونده باکتری‌های متحرک و ادغام کلنی‌ها (Spreader Colonies on PCA / VRBA)',
    symptomFa: 'تشکیل لایه فیلم‌مانند یا زنجیره‌ای از باکتری‌ها (مانند Proteus یا Bacillus) که سطح کل پلیت را پوشانده و مانع تفکیک و شمارش کلنی‌ها می‌شود.',
    rootCauseFa: 'وجود قطرات آب رطوبت و میعان بر روی سطح آگار، خشک نکردن مناسب پلیت‌های پیش‌ریخته یا تاخیر در افزودن لایه پوششی (Overlay).',
    investigationMethodFa: 'بررسی نوع پخش‌شدگی کلنی‌ها (سطحی فیلمی، لبه‌های پلیت، یا در امتداد رد آب میعان). طبق ISO 7218 اگر کلنی‌های رونده بیش از یک چهارم سطح پلیت را بپوشانند، پلیت غیرقابل شمارش است.',
    correctiveActionFa: 'استفاده از رقت بعدی که کلنی‌های مجزا دارد، یا تکرار آزمون با اضافه کردن لایه پوششی نازک (Overlay) از همان محیط یا آگار بدون ماده مغذی.',
    preventiveActionFa: 'خشک کردن سطح پلیت‌های کشت به مدت ۲۰ الی ۳۰ دقیقه در هود لامینار با درب نیمه‌باز، ریختن ۵ میلی‌لیتر لایه پوشاننده آگار (Overlay) پس از انجماد لایه اول، و انکوباسیون وارونه پلیت‌ها.',
    standardSource: 'ISO 7218:2007 Clause 10.3.1.4'
  },
  {
    id: 'mb-err-03',
    category: 'آلودگی محیطی و استریلیزاسیون',
    titleFa: 'آلودگی متقاطع هوابرد و پلیت‌های شاهد بلانک آلوده (Airborne Cross Contamination)',
    symptomFa: 'مشاهده کلنی‌های قارچی یا اسپورهای باسیلوس در پلیت‌های شاهد منفی (Sterility Blank) رقیق‌کننده یا محیط کشت تمیز.',
    rootCauseFa: 'کار کردن در محیط بدون هود لامینار یا خاموش بودن فن فیلتر HEPA، تهویه نامناسب اتاق کشت، آلودگی لوپ و سمپلر، یا نشستن ذرات گرد و غبار.',
    investigationMethodFa: 'انجام آزمون رسوب‌گذاری هوایی (Air Settle Plate Test) با قرار دادن پلیت باز PCA به مدت ۱۵ دقیقه در محیط کار و شمارش اسپورها (حداکثر استاندارد کمتر از ۱۵ کلنی در ۴ ساعت).',
    correctiveActionFa: 'باطل اعلام کردن سری آزمون، ضدعفونی کامل هود و میز کار با الکل ۷۰٪ و اشعه UV به مدت ۳۰ دقیقه، و تکرار تست‌ها با محیط‌های تازه.',
    preventiveActionFa: 'روشن کردن هود لامینار کلاس II حداقل ۱۵ دقیقه قبل از شروع کار، تست سالانه راندمان فیلتر HEPA (تست DOP)، تعویض دوره‌ای سرسمپلرهای فیلتردار و پوشیدن روپوش و دستکش استریل.',
    standardSource: 'ISO 11133:2014 Annex B'
  },
  {
    id: 'mb-err-04',
    category: 'بیوشیمیایی و تاییدی',
    titleFa: 'مثبت کاذب در آزمون کاتالاز ناشی از استفاده از لوپ نیکل-کروم (False Positive Catalase)',
    symptomFa: 'مشاهده جوشش شدید و تشکیل حباب‌های اکسیژن در غیاب آنزیم کاتالاز واقعی.',
    rootCauseFa: 'استفاده از لوپ فلزی پلاتین یا نیکل-کروم برای برداشتن کلنی و تماس آن با آب‌اکسیژنه ۳٪ (H2O2) که به عنوان کاتالیزور معدنی عمل کرده و H2O2 را تجزیه می‌کند.',
    investigationMethodFa: 'بررسی روش برداشت کلنی توسط اپراتور؛ تماس لوپ فلزی داغ یا سرد با قطره پراکسید هیدروژن.',
    correctiveActionFa: 'تکرار آزمون کاتالاز با استفاده از لوپ یکبار مصرف پلاستیکی استریل یا خلال دندان چوبی/میله شیشه‌ای.',
    preventiveActionFa: 'آموزش پرسنل بر عدم استفاده از لوپ‌های فلزی دارای ترکیبات آهن، مس یا نیکل برای آزمون کاتالاز و استفاده صرف از ابزار پلاستیکی یا شیشه‌ای استریل.',
    standardSource: 'ISO 6888-1:2021 Clause 9.5.2'
  },
  {
    id: 'mb-err-05',
    category: 'رقت‌سازی و آماده‌سازی',
    titleFa: 'تاخیر زمانی در کشت رقت‌ها فراتر از محدوده مجاز استاندارد (Dilution Holding Time Exceeded)',
    symptomFa: 'افزایش کاذب یا کاهش چشمگیر تعداد کلنی‌ها در رقت‌های آماده‌شده به دلیل رشد سریع বা مرگ سلول‌ها در رقیق‌کننده.',
    rootCauseFa: 'گذشت بیش از ۴۵ دقیقه از زمان آماده‌سازی سوسپانسیون اولیه و رقت‌های دهدهی تا زمان تلقیح و ریختن آگار.',
    investigationMethodFa: 'بررسی لاگ زمانی و ثبت ساعت اتمام رقت‌سازی و ساعت کشت پلیت‌ها در چک‌لیست آزمایشگاه.',
    correctiveActionFa: 'باطل کردن رقت‌های قبلی و آماده‌سازی مجدد سوسپانسیون از نمونه اولیه طبق روش استاندارد.',
    preventiveActionFa: 'رعایت بند استاندارد ISO 6887-1: حداکثر زمان مجاز بین اتمام آماده‌سازی سوسپانسیون اولیه و لحظه تماس با محیط کشت نهایی نباید از ۴۵ دقیقه فراتر رود (در حالت ایده‌آل کمتر از ۲۰ دقیقه).',
    standardSource: 'ISO 6887-1:2017 Clause 9.1'
  },
  {
    id: 'mb-err-06',
    category: 'محیط کشت و مکمل‌ها',
    titleFa: 'تخریب آنتی‌بیوتیک‌ها و مکمل‌های انتخابی در اثر حرارت بالا (Supplement Thermal Inactivation)',
    symptomFa: 'عدم مهار میکروارگانیسم‌های همراه و رشد شدید فلور مزاحم در محیط‌های انتخابی (مانند رشد گرم منفی‌ها در DRBC یا بلاد آگار).',
    rootCauseFa: 'افزودن مکمل‌های آنتی‌بیوتیکی حساس به حرارت (مانند کلرامفنیکل، اکسین، سیکلوهگزیمید) به محیط آگار داغ (دمای بالای ۵۰ درجه).',
    investigationMethodFa: 'اندازه‌گیری دمای محیط قبل از افزودن سوسپانسیون مکمل، تست کنترل کیفیت بهره‌وری و انتخابی بودن محیط با سویه‌های کنترل استاندارد (ISO 11133).',
    correctiveActionFa: 'ساخت بچ جدید از محیط کشت با افزودن محلول استریل فیلتر شده مکمل در دمای ۴۴ الی ۴۷ درجه.',
    preventiveActionFa: 'خنک کردن کامل محیط آگار در بن‌ماری تا دمای ۴۵ درجه سلسیوس پیش از تزریق مکمل‌های فیلتر شده و میکس یکنواخت چرخشی بدون ایجاد حباب هوا.',
    standardSource: 'ISO 11133:2014 Clause 5.3'
  }
];

export const MPN_3_TUBE_TABLE: Record<string, MPNTableResult> = {
  '0-0-0': { combinationOfPositives: '0-0-0', mpnValue: 0.0, confidenceInterval95: { lower: 0.0, upper: 0.94 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '0-0-1': { combinationOfPositives: '0-0-1', mpnValue: 0.3, confidenceInterval95: { lower: 0.01, upper: 0.95 }, unit: 'MPN/g', probabilityCategory: 'category_2_less_likely' },
  '0-1-0': { combinationOfPositives: '0-1-0', mpnValue: 0.3, confidenceInterval95: { lower: 0.01, upper: 1.0 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '1-0-0': { combinationOfPositives: '1-0-0', mpnValue: 0.4, confidenceInterval95: { lower: 0.02, upper: 1.1 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '1-0-1': { combinationOfPositives: '1-0-1', mpnValue: 0.7, confidenceInterval95: { lower: 0.12, upper: 1.7 }, unit: 'MPN/g', probabilityCategory: 'category_2_less_likely' },
  '1-1-0': { combinationOfPositives: '1-1-0', mpnValue: 0.7, confidenceInterval95: { lower: 0.12, upper: 1.7 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '1-2-0': { combinationOfPositives: '1-2-0', mpnValue: 1.1, confidenceInterval95: { lower: 0.3, upper: 2.5 }, unit: 'MPN/g', probabilityCategory: 'category_2_less_likely' },
  '2-0-0': { combinationOfPositives: '2-0-0', mpnValue: 0.9, confidenceInterval95: { lower: 0.2, upper: 2.1 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '2-0-1': { combinationOfPositives: '2-0-1', mpnValue: 1.4, confidenceInterval95: { lower: 0.4, upper: 3.4 }, unit: 'MPN/g', probabilityCategory: 'category_2_less_likely' },
  '2-1-0': { combinationOfPositives: '2-1-0', mpnValue: 1.5, confidenceInterval95: { lower: 0.4, upper: 3.5 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '2-1-1': { combinationOfPositives: '2-1-1', mpnValue: 2.0, confidenceInterval95: { lower: 0.7, upper: 4.5 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '2-2-0': { combinationOfPositives: '2-2-0', mpnValue: 2.1, confidenceInterval95: { lower: 0.7, upper: 4.7 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '3-0-0': { combinationOfPositives: '3-0-0', mpnValue: 2.3, confidenceInterval95: { lower: 0.9, upper: 8.6 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '3-0-1': { combinationOfPositives: '3-0-1', mpnValue: 3.9, confidenceInterval95: { lower: 0.9, upper: 13.0 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '3-1-0': { combinationOfPositives: '3-1-0', mpnValue: 4.3, confidenceInterval95: { lower: 0.9, upper: 18.0 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '3-1-1': { combinationOfPositives: '3-1-1', mpnValue: 7.5, confidenceInterval95: { lower: 1.4, upper: 23.0 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '3-2-0': { combinationOfPositives: '3-2-0', mpnValue: 9.3, confidenceInterval95: { lower: 1.5, upper: 38.0 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '3-2-1': { combinationOfPositives: '3-2-1', mpnValue: 15.0, confidenceInterval95: { lower: 3.0, upper: 44.0 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '3-2-2': { combinationOfPositives: '3-2-2', mpnValue: 21.0, confidenceInterval95: { lower: 3.5, upper: 47.0 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '3-3-0': { combinationOfPositives: '3-3-0', mpnValue: 24.0, confidenceInterval95: { lower: 3.6, upper: 130.0 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '3-3-1': { combinationOfPositives: '3-3-1', mpnValue: 46.0, confidenceInterval95: { lower: 7.1, upper: 240.0 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '3-3-2': { combinationOfPositives: '3-3-2', mpnValue: 110.0, confidenceInterval95: { lower: 15.0, upper: 480.0 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' },
  '3-3-3': { combinationOfPositives: '3-3-3', mpnValue: 1100.0, confidenceInterval95: { lower: 400.0, upper: 4800.0 }, unit: 'MPN/g', probabilityCategory: 'category_1_normal' }
};


