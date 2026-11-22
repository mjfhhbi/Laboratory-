import { FoodCatalogProduct } from '../../types/foodProductsCatalog';
import { CATALOG_SOURCES_DATABASE } from './catalogSources';

export const PART1_PRODUCTS: FoodCatalogProduct[] = [
  // 1. لبنیات (Dairy) - شیر پاستوریزه
  {
    id: 'prod-dairy-milk-pasteurized',
    code: 'PROD-DAI-01',
    nameFa: 'شیر پاستوریزه گاو (کم‌چرب ۱.۵٪ و پرچرب ۳.۰٪)',
    nameEn: 'Pasteurized Cow Milk (Low-Fat 1.5% & Whole 3.0%)',
    commercialNameFa: 'شیر تازه هموژنیزه پاستوریزه بطری / تتراپک',
    category: 'dairy',
    descriptionFa: 'شیر تازه گاو که از طریق فرآیند حرارتی پاستوریزاسیون مداوم (HTST در دمای ۷۲ الی ۷۵ درجه سلسیوس به مدت ۱۵ الی ۲۰ ثانیه) فرآوری شده و بلافاصله تا دمای زیر ۴ درجه سلسیوس خنک‌سازی شده است.',
    commercialFormsFa: ['بطری پلی‌اتیلنی HDPE', 'پاکت چندلایه تتراپک', 'کیسه پلی‌اتیلنی استریل'],
    physicalStateFa: 'liquid',
    targetMatrix: 'امولسیون طبیعی روغن در آب با ساختار کلوئیدی میسل‌های کازئین',
    keyCharacteristicsFa: {
      phTypical: '۶.۶۰ الی ۶.۸۰',
      brixTypical: '۹.۵ الی ۱۰.۵ درجه بریکس',
      moisturePercent: '۸۷.۵ الی ۸۸.۵ درصد',
      fatPercent: '۱.۵۰ ± ۰.۱۰ (کم‌چرب) یا ۳.۰۰ ± ۰.۱۰ (پرچرب)',
      proteinPercent: 'حداقل ۳.۰ درصد',
      ashPercent: 'حداقل ۰.۷ درصد',
      saltPercent: 'حدود ۰.۱۴ درصد کلرید سدیم طبیعی',
      appearanceColorFa: 'سفید کدر تا متمایل به کرم روشن طبیعی، یکنواخت و عاری از ذرات معلق خارجی'
    },
    rawMaterials: [
      {
        id: 'rm-raw-milk',
        nameFa: 'شیر خام گاو درجه یک',
        nameEn: 'Raw Cow Milk Grade A',
        role: 'ماده اولیه اصلی و تنها جزء سازنده فرآورده',
        typicalPercentageRange: '۱۰۰ ٪',
        qualityCriteriaFa: 'اسیدیته دورنیک ۱۳ الی ۱۵، بار میکروبی کمتر از ۱۰۰٬۰۰۰ در میلی‌لیتر، بار سلول‌های سوماتیک کمتر از ۴۰۰٬۰۰۰، تست الکل و فسفاتاز منفی، عاری از بقایای آنتی‌بیوتیک و تقلبات',
        isAllergenic: true,
        allergenType: 'پروتئین شیر (کازئین و بتالاکتوگلوبولین) و لاکتوز',
        standardReference: 'INSO 164'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'دریافت، فیلتراسیون و بازرسی کیفی شیر خام',
        nameEn: 'Raw Milk Intake & Reception Testing',
        criticalParameters: 'دمای شیر وارده ≤ ۴.۰ درجه سلسیوس، اسیدیته ۱۴-۱۵ دورنیک',
        equipmentFa: 'پلیت کولر، فیلتر دوپلکس استیل، چیلر مخازن سیلوی دریافت',
        ccpOrCqP: 'CP',
        descriptionFa: 'پایش سریع تست آنتی‌بیوتیک، اسیدیته، الکل ۶۸ درجه، دانسیته و بار میکروبی قبل از تخلیه تانکر.'
      },
      {
        stepNumber: 2,
        nameFa: 'بوجاری گریز از مرکز، استانداردسازی چربی و کلاریفیکاسیون',
        nameEn: 'Centrifugal Clarification & Fat Standardization',
        criticalParameters: 'دمای ۵۰ الی ۵۵ درجه، راندمان جداسازی ناخالصی‌ها و گلبول‌های چربی',
        equipmentFa: 'کلاریفایر و سپراتور با سیستم خودکار تزریق خامه به شیر بدون چربی',
        ccpOrCqP: 'CP',
        descriptionFa: 'حذف لکوسیت‌ها و ذرات سلولی و تنظیم چربی شیر به ۱.۵۰٪ یا ۳.۰۰٪ توسط سپراتور آنلاین.'
      },
      {
        stepNumber: 3,
        nameFa: 'هموژنیزاسیون دو مرحله‌ای',
        nameEn: 'Two-Stage High-Pressure Homogenization',
        criticalParameters: 'فشار کل: ۱۸۰ الی ۲۰۰ بار (مرحله اول ۱۵۰-۱۷۰ بار، مرحله دوم ۳۰-۴۰ بار) در ۶۵ درجه',
        equipmentFa: 'هموژنایزر پیستونی دو مرحله‌ای فشار قوی استیل ۳۱۶',
        ccpOrCqP: 'CP',
        descriptionFa: 'کاهش اندازه گلبول‌های چربی از ۴-۱۰ میکرون به کمتر از ۱ میکرون جهت ممانعت قطعی از خامه‌بستن و دوفاز شدن.'
      },
      {
        stepNumber: 4,
        nameFa: 'پاستوریزاسیون مداوم صفحه‌ای (HTST)',
        nameEn: 'HTST Continuous Plate Pasteurization',
        criticalParameters: 'دما: ۷۲ الی ۷۵ درجه سلسیوس، زمان ماند: ۱۵ الی ۲۰ ثانیه، انحراف مجاز ±۰.۵ درجه',
        equipmentFa: 'پاستوریزاتور صفحه‌ای با بخش ریکاوری انرژی ۹۰٪ و لوله نگه‌دارنده (Holding Tube) و شیر برگشت خودکار جریان (FDV)',
        ccpOrCqP: 'CCP',
        descriptionFa: 'تضمین نابودی تمامی پاتوژن‌ها به‌ویژه کوکسیلا برنتی، مایکوباکتریوم توبرکلوزیس و لیستریا منوسایتوژنز.'
      },
      {
        stepNumber: 5,
        nameFa: 'خنک‌سازی سریع و ذخیره در تانک استریل',
        nameEn: 'Rapid Cooling & Aseptic Buffer Storage',
        criticalParameters: 'خنک‌سازی به زیر ۴ درجه سلسیوس ظرف کمتر از ۱۰ ثانیه',
        equipmentFa: 'سکشن سرمایش آیس‌واتر پاستوریزاتور، تانک ذخیره دوجداره ایزوله',
        ccpOrCqP: 'OPRP',
        descriptionFa: 'مهار کامل جوانه زدن احتمالی اسپورها و حفظ پایداری پروتئین‌ها.'
      },
      {
        stepNumber: 6,
        nameFa: 'پرکنی در شرایط بهداشتی و درب‌بندی هرمتیک',
        nameEn: 'Hygienic Bottling & Sealing',
        criticalParameters: 'فشار مثبت هوای هپا در چمبر پرکنی، دمای محصول ≤ ۴ درجه',
        equipmentFa: 'پرکن روتاری اتوماتیک بطری یا پاکت با اشعه UV درب‌ها',
        ccpOrCqP: 'CP',
        descriptionFa: 'بسته‌بندی بدون آلودگی ثانویه، تاریخ‌زنی لیزری و انتقال سریع به سردخانه.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-milk-past',
        nameFa: 'پاستوریزاتور صفحه‌ای HTST با شیر FDV اتوماتیک',
        nameEn: 'Plate Pasteurizer with Flow Diversion Valve',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'ظرفیت ۱۰٬۰۰۰ لیتر بر ساعت، سیستم بازیافت حرارتی ۹۲٪، مانیتورینگ پیوسته دما و فشار ترانسمیتر',
        maintenanceAndCalibration: 'کالیبراسیون سنسور دمای لوله نگه‌دارنده هر ۳ ماه با دماسنج کالیبره مرجع'
      },
      {
        id: 'eq-milk-homo',
        nameFa: 'هموژنایزر پیستونی دو مرحله‌ای',
        nameEn: 'Two-Stage High Pressure Homogenizer',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'حداکثر فشار ۲۵۰ بار، بلوک پیستون تنگستن کارباید با سیستم روانکاری هیدرولیک',
        maintenanceAndCalibration: 'سرویس دوره‌ای پکینگ‌ها و سوپاپ‌های فشار ماهانه'
      },
      {
        id: 'eq-milk-lactoscan',
        nameFa: 'آنالایزر فراصوت سریع شیر (میلکواسکن / لاکتواسکن)',
        nameEn: 'MilkoScan FT / Ultrasonic Milk Analyzer',
        roleInProcessOrLab: 'laboratory_qc',
        keySpecificationFa: 'اندازه‌گیری چربی، پروتئین، لاکتوز، دانسیته، نقطه انجماد و آب اضافی در ۶۰ ثانیه',
        maintenanceAndCalibration: 'کالیبراسیون هفتگی با شیرهای استاندارد مرجع کربوفر (CRM)'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۲ الی ۴ درجه سلسیوس (یخچالی زنجیره سرد مداوم)',
      relativeHumidityRangeFa: 'رطوبت نسبی ۶۵ الی ۷۵ درصد',
      lightingProtectionFa: 'عدم تابش مستقیم نور خورشید و ترجیحاً بطری‌های مات یا کارتن‌های تتراپک جهت جلوگیری از اکسیداسیون ریبوفلاوین',
      stackingLimitsFa: 'حداکثر ۵ جعبه پلاستیکی روی هم در پالت چوبی استاندارد',
      specialPrecautionsFa: 'حفظ پیوستگی کامل زنجیره سرد (Cold Chain) در زمان توزیع، حمل و فروشگاه الزامی است.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'بطری پلی‌اتیلن ترفتالات (PET) با درپوش پیچی یا پاکت چندلایه مقوایی با لایه‌های PE/Paper/PE (تتراپک)',
      secondaryPackagingMaterialFa: 'جعبه پلی‌اتیلنی بهداشتی شبکه دار یا کارتن شرینک حرارتی',
      barrierPropertiesFa: 'نفوذناپذیری نسبت به اکسیژن محیط و ممانعت از نفوذ طعم‌های فرار خارجی سردخانه',
      hermeticSealTestFa: 'تست نشتی در اتاقک خلاء ۵۰ کیلوپاسکال و تست عدم نشت جوش حرارتی در آب رنگی'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۵ الی ۷ روز در دمای ۱ تا ۴ درجه سلسیوس',
      primaryDeteriorationMechanism: 'رشد و فعالیت باکتری‌های سرمادوست اسپوردار (نظیر سودوموناس و باسیلوس سرئوس) و ترشیدگی ناشی از تولید اسید لاکتیک',
      criticalLimitAtEndOfShelfLife: 'اسیدیته حداکثر ۱۶ درجه دورنیک، بار میکروبی کمتر از ۵۰٬۰۰۰ در میلی‌لیتر، تست فسفاتاز منفی',
      acceleratedTestingParameters: 'نگهداری در دمای سوء ۸ درجه سلسیوس به عنوان آزمون تنش دمایی سردخانه'
    },
    standards: [
      {
        id: 'std-inso-2406',
        standardNumber: 'INSO 2406',
        organization: 'INSO',
        titleFa: 'شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون (استاندارد اجباری ملی)',
        titleEn: 'Pasteurized Milk - Specifications & Test Methods',
        publicationYear: '1394 (تجدیدنظر چهارم)',
        status: 'active_mandatory',
        scopeFa: 'تعیین ویژگی‌های فیزیکی، شیمیایی، چربی، اسیدیته، ماده خشک و تقلبات شیر پاستوریزه مصرفی خانوار',
        sourceId: 'src-inso-2406',
        coverageType: 'general_specifications'
      },
      {
        id: 'std-inso-2408',
        standardNumber: 'INSO 2408',
        organization: 'INSO',
        titleFa: 'شیر و فرآورده‌های آن - ویژگی‌های میکروبیولوژی (استاندارد ملی میکروبی)',
        titleEn: 'Milk and milk products - Microbiological specifications',
        publicationYear: '1398',
        status: 'active_mandatory',
        scopeFa: 'حدود مجاز شمارش کلی میکروارگانیسم‌ها، کلی‌فرم، اشرشیا کلی و عدم وجود پاتوژن‌ها',
        sourceId: 'src-inso-2408',
        coverageType: 'microbiological_criteria'
      },
      {
        id: 'std-codex-206',
        standardNumber: 'Codex Stan 206',
        organization: 'Codex',
        titleFa: 'استاندارد عمومی کدکس برای اصطلاحات و فرآورده‌های شیری',
        titleEn: 'Codex General Standard for the Use of Dairy Terms (CXS 206-1999)',
        publicationYear: '1999 (Amended 2018)',
        status: 'active_recommended',
        scopeFa: 'مقررات بین‌المللی خلوص، خاستگاه حیوانی و برچسب‌گذاری ترکیبات شیر',
        sourceId: 'src-codex-206',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      // Physical
      {
        id: 'test-milk-dens',
        code: 'QC-MLK-PHY-01',
        category: 'physical',
        nameFa: 'چگالی (دانسیته) در دمای ۲۰ درجه سلسیوس',
        nameEn: 'Density at 20 °C',
        parameterAnalyte: 'Density',
        unit: 'g/cm³',
        minLimit: 1.028,
        maxLimit: 1.034,
        methodFa: 'هیدرومتری با ترمولاکتودانسیمتر کالیبره بر اساس INSO 2406',
        frequency: 'each_batch',
        standardId: 'std-inso-2406',
        sourceId: 'src-inso-2406',
        criticality: 'major_quality',
        notesFa: 'دانسیته زیر ۱.۰۲۸ نشان‌دهنده احتمال افزودن آب به شیر است.'
      },
      {
        id: 'test-milk-freez',
        code: 'QC-MLK-PHY-02',
        category: 'physical',
        nameFa: 'نقطه انجماد (Freezing Point)',
        nameEn: 'Freezing Point by Cryoscopy',
        parameterAnalyte: 'Freezing Point Depression',
        unit: '°C',
        minLimit: -0.545,
        maxLimit: -0.520,
        methodFa: 'کرایوسکوپی ترمیستوری مطابق INSO 2406 و ISO 5764',
        frequency: 'each_batch',
        standardId: 'std-inso-2406',
        sourceId: 'src-inso-2406',
        criticality: 'critical_safety',
        notesFa: 'حساس‌ترین آزمون جهت کشف آب اضافی حتی در مقادیر کمتر از ۱ درصد.'
      },
      // Chemical
      {
        id: 'test-milk-fat',
        code: 'QC-MLK-CHM-01',
        category: 'chemical',
        nameFa: 'درصد چربی (کم‌چرب ۱.۵٪)',
        nameEn: 'Fat Content (Low Fat)',
        parameterAnalyte: 'Fat',
        unit: '%',
        minLimit: 1.40,
        maxLimit: 1.60,
        targetValue: 1.50,
        methodFa: 'روش اسید بوتیرومتری ژربر بر اساس INSO 2406',
        frequency: 'each_batch',
        standardId: 'std-inso-2406',
        sourceId: 'src-inso-2406',
        criticality: 'standard_compliance'
      },
      {
        id: 'test-milk-acid',
        code: 'QC-MLK-CHM-02',
        category: 'chemical',
        nameFa: 'اسیدیته قابل تیتر (تیتراسیون با سود ۰.۱ نرمال)',
        nameEn: 'Titratable Acidity',
        parameterAnalyte: 'Lactic Acid Acidity',
        unit: 'درجه دورنیک (°D)',
        minLimit: 14.0,
        maxLimit: 16.0,
        targetValue: 15.0,
        methodFa: 'تیتراسیون حجم‌سنجی با هیدروکسید سدیم ۰.۱ نرمال در حضور فنل‌فتالئین',
        frequency: 'each_batch',
        standardId: 'std-inso-2406',
        sourceId: 'src-inso-2406',
        criticality: 'major_quality'
      },
      {
        id: 'test-milk-phosp',
        code: 'QC-MLK-CHM-03',
        category: 'chemical',
        nameFa: 'آزمون آنزیم آلکالین فسفاتاز (ALP)',
        nameEn: 'Alkaline Phosphatase Activity',
        parameterAnalyte: 'Alkaline Phosphatase',
        textLimitFa: 'منفی (عدم مشاهده رنگ زرد ارگانوفسفره / < 350 mU/L)',
        methodFa: 'روش اسپکتروفتومتری کینتیک با سوبسترای پارانیتروفنیل فسفات',
        frequency: 'each_batch',
        standardId: 'std-inso-2406',
        sourceId: 'src-inso-2406',
        criticality: 'critical_safety',
        notesFa: 'شاخص قطعی صحت انجام فرآیند پاستوریزاسیون؛ وجود آنزیم نشانه نقص دما/زمان یا ورود شیر خام است.'
      },
      // Microbial
      {
        id: 'test-milk-tvc',
        code: 'QC-MLK-MIC-01',
        category: 'microbial',
        nameFa: 'شمارش کلی باکتری‌های مزوفیل هوازی (Total Viable Count)',
        nameEn: 'Total Viable Count at 30 °C',
        parameterAnalyte: 'Aerobic Colony Count',
        unit: 'CFU/ml',
        maxLimit: 30000,
        methodFa: 'کشت آمیخته در پلیت کانت آگار (PCA) انکوباسیون ۷۲ ساعت در ۳۰ درجه بر اساس INSO 5272',
        frequency: 'each_batch',
        standardId: 'std-inso-2408',
        sourceId: 'src-inso-2408',
        criticality: 'critical_safety'
      },
      {
        id: 'test-milk-coliform',
        code: 'QC-MLK-MIC-02',
        category: 'microbial',
        nameFa: 'شمارش باکتری‌های کلی‌فرم',
        nameEn: 'Coliforms Count',
        parameterAnalyte: 'Coliform Bacteria',
        unit: 'CFU/ml',
        maxLimit: 10,
        methodFa: 'پورپلیت با محیط VRBL آگار در ۳۰ درجه سلسیوس مطابق INSO 2408',
        frequency: 'each_batch',
        standardId: 'std-inso-2408',
        sourceId: 'src-inso-2408',
        criticality: 'critical_safety',
        notesFa: 'شاخص آلودگی ثانویه پس از پاستوریزاتور (پایپینگ، تانک یا پرکن).'
      },
      // Sensory
      {
        id: 'test-milk-sensory',
        code: 'QC-MLK-SEN-01',
        category: 'sensory',
        nameFa: 'ارزیابی حسی طعم، بو، رنگ و بافت',
        nameEn: 'Sensory Evaluation',
        parameterAnalyte: 'Sensory Profile',
        textLimitFa: 'طعم و بوی طبیعی مطبوع شیری، فاقد هرگونه طعم پختگی شدید، اکسیداسیون، ترشیدگی، علفی یا ماندگی',
        methodFa: 'ارزیابی پنل چشایی آموزش‌دیده مطابق ISO 22935 و استاندارد ملی ۲۴۰۶',
        frequency: 'each_batch',
        standardId: 'std-inso-2406',
        sourceId: 'src-inso-2406',
        criticality: 'major_quality'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-2406'],
      CATALOG_SOURCES_DATABASE['src-inso-2408'],
      CATALOG_SOURCES_DATABASE['src-codex-206']
    ],
    tags: ['لبنیات', 'شیر پاستوریزه', 'HTST', 'INSO 2406', 'INSO 2408', 'آلکالین فسفاتاز', 'Codex 206']
  },

  // 2. گوشت (Meat) - سوسیس پخته ممتاز
  {
    id: 'prod-meat-sausage-frankfurter',
    code: 'PROD-MEA-01',
    nameFa: 'سوسیس و کالباس ممتاز ۵۵٪ تا ۷۰٪ گوشت قرمز',
    nameEn: 'Premium Cooked Sausages & Frankfurters (55%-70% Meat)',
    commercialNameFa: 'سوسیس فرانکفورتر و کالباس مارتادلا ممتاز',
    category: 'meat',
    descriptionFa: 'امولسیون گوشتی پایدار متشکل از گوشت قرمز چرخ‌شده، یخ/آب، روغن خوراکی، کازئینات، نشاسته، ادویه‌جات و نمک نیتریت‌دار که در پوشش مصنوعی پر شده و پس از فرآیند پخت حرارتی و دوددهی خنک‌سازی می‌شود.',
    commercialFormsFa: ['پوشش‌های پلی‌آمیدی سوسیس', 'پوشش‌های سلولزی پوست‌کنده', 'بسته‌بندی وکیوم تحت خلاء'],
    physicalStateFa: 'solid',
    targetMatrix: 'ژل پروتئینی امولسیون روغن در آب متراکم شبکه‌ای با اتصال پروتئین‌های میوفیبریلی (اکتین و میوزین)',
    keyCharacteristicsFa: {
      phTypical: '۵.۸۰ الی ۶.۲۰',
      moisturePercent: 'حداکثر ۵۸.۰ درصد',
      fatPercent: 'حداکثر ۲۲.۰ درصد',
      proteinPercent: 'حداقل ۱۲.۰ درصد',
      ashPercent: 'حداکثر ۳.۵ درصد',
      saltPercent: 'حداکثر ۲.۰ درصد',
      appearanceColorFa: 'صورتی ملایم گوشتی یکنواخت، بافت فنری منسجم و همگن بدون حباب و ذرات استخوان'
    },
    rawMaterials: [
      {
        id: 'rm-meat-beef',
        nameFa: 'گوشت قرمز ران و قلوه‌گاه گوساله منجمد صنعتی',
        nameEn: 'Frozen Boneless Industrial Beef',
        role: 'ماده اصلی پروتئینی و بافت‌ساز',
        typicalPercentageRange: '۵۵ الی ۷۰ ٪',
        qualityCriteriaFa: 'pH بین ۵.۶ الی ۶.۰، بار میکروبی کمتر از ۵۰۰٬۰۰۰، عاری از استخوان و زردپی درشت',
        isAllergenic: false,
        standardReference: 'INSO 2303'
      },
      {
        id: 'rm-meat-nitrite',
        nameFa: 'نمک طعام حاوی نیتریت سدیم (Curing Salt)',
        nameEn: 'Sodium Nitrite Curing Salt',
        role: 'تثبیت رنگ نیتروزومیگلوبین، ایجاد طعم کیورینگ و بازدارنده باکتری کلستریدیوم بوتولینوم',
        typicalPercentageRange: '۱.۸ الی ۲.۰ ٪',
        qualityCriteriaFa: 'باقیمانده نیتریت در محصول نهایی کمتر از 120 ppm',
        isAllergenic: false,
        standardReference: 'INSO 2303'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'چرخ‌کردن گوشت و تهیه امولسیون در کاتر کاسه‌ای',
        nameEn: 'Bowl Cutter Emulsification',
        criticalParameters: 'دمای خمیر در پایان کاترزنی ≤ ۱۲ درجه سلسیوس، کنترل دور تیغه‌ها تا ۳۰۰۰ RPM',
        equipmentFa: 'کاتر کاسه‌ای تحت خلاء (Bowl Cutter) مجهز به سنسور دمایی',
        ccpOrCqP: 'CP',
        descriptionFa: 'خرد کردن گوشت با نمک و فسفات جهت حل‌شدن پروتئین‌های میوزین، سپس افزودن یخ، چربی و مواد خشک.'
      },
      {
        stepNumber: 2,
        nameFa: 'پرکنی در پوشش و کلیپس‌زنی',
        nameEn: 'Stuffing & Vacuum Clipping',
        criticalParameters: 'خلاء منفی ۰.۸۵ بار، ممانعت از ورود هوای محبوس در پوشش',
        equipmentFa: 'فیلر پیوسته تحت خلاء (Continuous Vacuum Stuffer) با کلیپس‌زن خودکار',
        ccpOrCqP: 'CP',
        descriptionFa: 'تزریق یکنواخت خمیر سوسیس در کاور پلی‌آمیدی بدون تشکیل حفره‌های هوا.'
      },
      {
        stepNumber: 3,
        nameFa: 'فرآیند پخت حرارتی در اتاق پخت و دود',
        nameEn: 'Thermal Cooking & Smoking Chamber',
        criticalParameters: 'رسیدن دمای مرکز هندسی محصول (Core Temperature) به حداقل ۷۴.۰ درجه سلسیوس به مدت ۳ دقیقه',
        equipmentFa: 'اتاق پخت و دود صنعتی تمام اتوماتیک (Smokehouse) با پراب دمایی داخل مغز گوشت',
        ccpOrCqP: 'CCP',
        descriptionFa: 'پاستوریزاسیون عمقی توده گوشتی و مهار باکتری‌های پاتوژن مزوفیل.'
      },
      {
        stepNumber: 4,
        nameFa: 'دوش آب سرد (شوک حرارتی) و انتقال به سردخانه',
        nameEn: 'Cold Water Shower & Blast Chilling',
        criticalParameters: 'کاهش سریع دمای مغز محصول به زیر ۱۰ درجه طی کمتر از ۶۰ دقیقه',
        equipmentFa: 'دوش آبسرد سردخانه‌ای و اتاقک پیش‌سرمایش سریع (Chilling Tunnel)',
        ccpOrCqP: 'OPRP',
        descriptionFa: 'جلوگیری از جوانه زدن اسپورهای مقاوم به حرارت کلستریدیوم پرفرینجنس.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-meat-cutter',
        nameFa: 'کاتر کاسه‌ای صنعتی تحت خلاء',
        nameEn: 'Industrial Vacuum Bowl Cutter',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'حجم ۳۳۰ لیتر، دور تیغه متغیر تا ۴۵۰۰ دور، شفت استیل دینامیک',
        maintenanceAndCalibration: 'تعویض و بالانس تیغه‌ها هفتگی، بررسی گیج خلاء ماهانه'
      },
      {
        id: 'eq-meat-smokehouse',
        nameFa: 'اتاق پخت و دود اتوماتیک مجهز به لاگر دمایی چندنقطه‌ای',
        nameEn: 'Microprocessor Smokehouse with Core Temperature Probes',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'ظرفیت ۲ ترولی، تزریق بخار زنده، تنظیم رطوبت نسبی تا ۹۸٪، حسگرهای PT100 کالیبره',
        maintenanceAndCalibration: 'کالیبراسیون ترموکوپل‌های مغز محصول هر ۳ ماه'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۰ الی ۴ درجه سلسیوس (یخچال مداوم)',
      relativeHumidityRangeFa: '۷۵ الی ۸۵ درصد',
      lightingProtectionFa: 'پوشش‌های دودی و تاریک مانع از اکسیداسیون رنگ نیتریتی در برابر اشعه UV ویترین',
      stackingLimitsFa: 'حداکثر ۸ بسته در سبدهای توری پلاستیکی استاندارد',
      specialPrecautionsFa: 'ممانعت از نوسان دما که منجر به تعریق داخل بسته‌های وکیوم و لزج شدن سطحی می‌گردد.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'پوشش پلی‌آمید ۵ لایه ضد بخار و اکسیژن (PA/PE) یا فیلم ترموفرمینگ وکیوم',
      secondaryPackagingMaterialFa: 'کارتن سه لایه کرافت با برچسب استاندارد و ردگیری بارکد بهمن',
      barrierPropertiesFa: 'نفوذپذیری اکسیژن زیر ۱۰ سی‌سی در مترمربع در ۲۴ ساعت',
      hermeticSealTestFa: 'تست یکپارچگی دوخت و عدم وجود نشتی هوا تحت فشار خلاء ۶۰ کیلوپاسکال'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۳۰ الی ۴۵ روز برای پوشش‌های پلی‌آمیدی در دمای ۲ الی ۴ درجه',
      primaryDeteriorationMechanism: 'اکسیداسیون چربی، رشد باکتری‌های اسید لاکتیک ایجادکننده طعم ترشیدگی و لیزشدن سطح',
      criticalLimitAtEndOfShelfLife: 'شمارش کلی کمتر از ۱۰ به توان ۵، باقیمانده نیتریت زیر 100 ppm',
      acceleratedTestingParameters: 'پایش در دمای ۸ درجه برای سنجش سناریوی سوء دمایی فروشگاه'
    },
    standards: [
      {
        id: 'std-inso-2303',
        standardNumber: 'INSO 2303',
        organization: 'INSO',
        titleFa: 'سوسیس و کالباس - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Sausages and cooked meat products - Specifications & test methods',
        publicationYear: '1397',
        status: 'active_mandatory',
        scopeFa: 'تعیین درصد گوشت، چربی، پروتئین، رطوبت، نشاسته، باقیمانده نیتریت و فسفات',
        sourceId: 'src-inso-2303',
        coverageType: 'general_specifications'
      },
      {
        id: 'std-inso-2304',
        standardNumber: 'INSO 2304',
        organization: 'INSO',
        titleFa: 'فرآورده‌های گوشتی حرارت‌دیده - ویژگی‌های میکروبیولوژی',
        titleEn: 'Heat-treated meat products - Microbiological criteria',
        publicationYear: '1399',
        status: 'active_mandatory',
        scopeFa: 'محدوده کلستریدیوم پرفرینجنس، سالمونلا، استافیلوکوکوس اورئوس کواگولاز مثبت و کلی‌فرم‌ها',
        sourceId: 'src-inso-2304',
        coverageType: 'microbiological_criteria'
      }
    ],
    tests: [
      {
        id: 'test-meat-prot',
        code: 'QC-MEA-CHM-01',
        category: 'chemical',
        nameFa: 'درصد پروتئین تام (Total Protein)',
        nameEn: 'Total Protein by Kjeldahl',
        parameterAnalyte: 'Protein',
        unit: '%',
        minLimit: 12.0,
        methodFa: 'روش کلدال تمام اتوماتیک (ضریب تبدیل ۶.۲۵) مطابق INSO 2303',
        frequency: 'each_batch',
        standardId: 'std-inso-2303',
        sourceId: 'src-inso-2303',
        criticality: 'major_quality'
      },
      {
        id: 'test-meat-nitrite',
        code: 'QC-MEA-CHM-02',
        category: 'chemical',
        nameFa: 'باقیمانده نیتریت سدیم (Residual Sodium Nitrite)',
        nameEn: 'Residual Nitrite by Griess Reagent',
        parameterAnalyte: 'Sodium Nitrite',
        unit: 'mg/kg (ppm)',
        maxLimit: 120,
        methodFa: 'روش اسپکتروفتومتری معرف گریس (Griess Reaction) در طول موج ۵۴۰ نانومتر بر اساس INSO 2303',
        frequency: 'each_batch',
        standardId: 'std-inso-2303',
        sourceId: 'src-inso-2303',
        criticality: 'critical_safety',
        notesFa: 'مقداری بالاتر از ۱۲۰ ppm مغایر قانون و تهدیدکننده سلامت مصرف‌کننده (خطر نیتروزآمین‌ها) است.'
      },
      {
        id: 'test-meat-salm',
        code: 'QC-MEA-MIC-01',
        category: 'microbial',
        nameFa: 'جستجو و شناسایی سالمونلا (Salmonella spp.)',
        nameEn: 'Detection of Salmonella',
        parameterAnalyte: 'Salmonella',
        textLimitFa: 'منفی در ۲۵ گرم (Negative in 25g)',
        methodFa: 'پیش‌غنی‌سازی در BPW، غنی‌سازی انتخابی در RVS/MKTTn، کشت روی XLD مطابق INSO 1810 و ISO 6579',
        frequency: 'each_batch',
        standardId: 'std-inso-2304',
        sourceId: 'src-inso-2304',
        criticality: 'critical_safety'
      },
      {
        id: 'test-meat-sensory',
        code: 'QC-MEA-SEN-01',
        category: 'sensory',
        nameFa: 'آزمون حسی طعم، بو و قابلیت برش‌خوری',
        nameEn: 'Sensory and Sliceability Examination',
        parameterAnalyte: 'Sensory Texture and Flavor',
        textLimitFa: 'بافت ارتجاعی بدون تکه‌شدن حین اسلایس، عدم حضور قطعات غضروف یا استخوان، طعم ادویه‌ای دودی ملایم',
        methodFa: 'برش اسلایسر ۲ میلی‌متر و آزمون هیئت ارزیاب حسی ۵ نفره',
        frequency: 'each_batch',
        standardId: 'std-inso-2303',
        sourceId: 'src-inso-2303',
        criticality: 'major_quality'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-2303'],
      CATALOG_SOURCES_DATABASE['src-inso-2304']
    ],
    tags: ['گوشت', 'سوسیس', 'کالباس', 'INSO 2303', 'نیتریت', 'پخت حرارتی', 'پروتئین']
  },

  // 3. غلات (Cereals) - آرد گندم مصارف نانوایی
  {
    id: 'prod-cereal-wheat-flour',
    code: 'PROD-CER-01',
    nameFa: 'آرد گندم خبازی (ستاره و نول)',
    nameEn: 'Wheat Flour for Bakery (Setareh & Noul Grade)',
    commercialNameFa: 'آرد گندم درجه یک خبازی و قنادی',
    category: 'cereals',
    descriptionFa: 'فرآورده حاصل از آسیاب و بوجاری دانه‌های تمیزشده گندم تریتیکوم آئستیوم که پس از جداسازی سبوس و جوانه در درصدهای استخراج معین الک‌بندی می‌شود.',
    commercialFormsFa: ['کیسه‌های پلی‌پروپیلنی (PP) ۴۰ کیلوگرمی', 'بسته‌های کاغذی خرده‌فروشی ۱ و ۲ کیلوگرمی'],
    physicalStateFa: 'powder',
    targetMatrix: 'گرانول‌های نشاسته گندم در ماتریکس پروتئین‌های گلوتن (گلیادین و گلوتنین)',
    keyCharacteristicsFa: {
      phTypical: '۶.۰۰ الی ۶.۵۰',
      moisturePercent: 'حداکثر ۱۴.۲ درصد',
      ashPercent: '۰.۶۵ الی ۰.۸۵ درصد (بر مبنای ماده خشک)',
      proteinPercent: 'حداقل ۱۱.۵ درصد',
      appearanceColorFa: 'سفید شیری تا کرم بسیار روشن، پودری نرم و یکدست عاری از کلوخه و حشرات'
    },
    rawMaterials: [
      {
        id: 'rm-cereal-wheat',
        nameFa: 'دانه گندم سخت و نیمه‌سخت تمیزشده',
        nameEn: 'Cleaned Hard & Semi-Hard Wheat Grains',
        role: 'ماده اولیه اصلی تأمین‌کننده نشاسته و گلوتن',
        typicalPercentageRange: '۱۰۰ ٪',
        qualityCriteriaFa: 'وزن هکتولیتر حداقل ۷۸ کیلوگرم، رطوبت کمتر از ۱۲٪، افت مفید کمتر از ۴٪، افت غیرمفید کمتر از ۱٪',
        isAllergenic: true,
        allergenType: 'گلوتن گندم',
        standardReference: 'INSO 104'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'بوجاری اولیه و پیشرفته با آهن‌ربا و دستگاه طبل بوجار',
        nameEn: 'Wheat Cleaning & Magnetic Separation',
        criticalParameters: 'جداسازی ۱۰۰٪ براده‌های فلزی، بذور هرز، گردوغبار و سنگ‌ریزه‌ها',
        equipmentFa: 'سپراتور مغناطیسی، دستگاه تریور بوجار و سنگ‌گیر پنوماتیک',
        ccpOrCqP: 'CP',
        descriptionFa: 'پاک‌سازی مکانیکی دانه گندم از کلیه ناخالصی‌های خشن و سبک.'
      },
      {
        stepNumber: 2,
        nameFa: 'نم‌زنی (مشروط‌کردن گندم) و خواباندن در سیلو (Conditioning/Tempering)',
        nameEn: 'Conditioning & Tempering',
        criticalParameters: 'تنظیم رطوبت دانه به ۱۵.۵ الی ۱۶.۵ درصد، زمان خواباندن: ۲۴ الی ۳۶ ساعت',
        equipmentFa: 'دستگاه نم‌زن اتوماتیک اینترنسیو و مخازن استیل سیلوهای خواب',
        ccpOrCqP: 'CP',
        descriptionFa: 'افزایش انعطاف‌پذیری سبوس جهت ممانعت از پودر شدن آن و نرم‌کردن آندوسپرم جهت آسیاب‌پذیری بهینه.'
      },
      {
        stepNumber: 3,
        nameFa: 'آسیاب غلتکی چندمرحله‌ای (Break & Reduction Rolls)',
        nameEn: 'Roller Milling & Plansifter Sifting',
        criticalParameters: 'تنظیم دقیق فاصله بین غلطک‌ها (گپ میکرومتری) و پایش حرارت آسیاب',
        equipmentFa: 'والس‌های آسیاب دوتایی و دستگاه الک مربع مسطح (Plansifter)',
        ccpOrCqP: 'CP',
        descriptionFa: 'جداسازی تدریجی ذرات آندوسپرم از سبوس و تبدیل آن به آرد ریز با اندازه ذرات زیر ۱۵۰ میکرون.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-cer-farinograph',
        nameFa: 'فارینوگراف برابندر (Brabender Farinograph)',
        nameEn: 'Brabender Farinograph-TS',
        roleInProcessOrLab: 'laboratory_qc',
        keySpecificationFa: 'اندازه‌گیری جذب آب، زمان توسعه خمیر، پایداری خمیر و درجه شل‌شدن بر حسب واحدهای برابندر (BU)',
        maintenanceAndCalibration: 'کالیبراسیون دینامومتری سالانه بر اساس استاندارد ICC'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۱۵ الی ۲۲ درجه سلسیوس',
      relativeHumidityRangeFa: 'حداکثر ۶۰ درصد',
      lightingProtectionFa: 'محیط سرپوشیده خشک و تهویه‌دار به دور از نور خورشید',
      stackingLimitsFa: 'حداکثر ۱۰ کیسه روی پالت، فاصله ۵۰ سانتی‌متر از دیوار',
      specialPrecautionsFa: 'اجرای دقیق سیستم مدیریت تلفیقی آفات (IPM) جهت پیشگیری از شپشه آرد و بید غلات.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'کیسه پلی‌پروپیلن تنفس‌پذیر بهداشتی (PP Woven Bag)',
      secondaryPackagingMaterialFa: 'بدون بسته‌بندی ثانویه (عرضه مستقیم پالتی کیسه‌ای)',
      barrierPropertiesFa: 'قابلیت تبادل رطوبتی جزئی بدون نفوذ رطوبت آزاد محیطی',
      hermeticSealTestFa: 'دوخت محکم سر کیسه با نخ پنبه‌ای نسوز'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۶ ماه از تاریخ تولید در انبار خشک و خنک',
      primaryDeteriorationMechanism: 'اکسیداسیون اسیدهای چرب آزاد جوانه (افزایش اسیدیته چربی) و هجوم آفات انباری',
      criticalLimitAtEndOfShelfLife: 'اسیدیته چربی حداکثر ۵۰ میلی‌گرم KOH در ۱۰۰ گرم ماده خشک'
    },
    standards: [
      {
        id: 'std-inso-103',
        standardNumber: 'INSO 103',
        organization: 'INSO',
        titleFa: 'آرد گندم - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Wheat flour - Specifications and test methods',
        publicationYear: '1395',
        status: 'active_mandatory',
        scopeFa: 'ویژگی‌های شیمیایی، فیزیکی، درصد خاکستر، گلوتن مرطوب و اسیدیته چربی انواع آرد گندم',
        sourceId: 'src-inso-103',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-cereal-moist',
        code: 'QC-CER-CHM-01',
        category: 'chemical',
        nameFa: 'رطوبت آرد به روش آون ۱۳۰ درجه',
        nameEn: 'Moisture by Air-Oven at 130 °C',
        parameterAnalyte: 'Moisture',
        unit: '%',
        maxLimit: 14.2,
        methodFa: 'خشک‌کردن در آون ۱۳۰ درجه به مدت ۹۰ دقیقه بر اساس INSO 2705 و INSO 103',
        frequency: 'each_batch',
        standardId: 'std-inso-103',
        sourceId: 'src-inso-103',
        criticality: 'critical_safety',
        notesFa: 'رطوبت بالاتر از ۱۴.۲٪ خطر کپک‌زدگی سریع و فعالیت مایکوتوکسین‌ها را در پی دارد.'
      },
      {
        id: 'test-cereal-ash',
        code: 'QC-CER-CHM-02',
        category: 'chemical',
        nameFa: 'خاکستر کل بر مبنای ماده خشک (Ash Content Dry Basis)',
        nameEn: 'Total Ash by Muffle Furnace at 900 °C',
        parameterAnalyte: 'Total Ash',
        unit: '%',
        minLimit: 0.65,
        maxLimit: 0.85,
        methodFa: 'سوزاندن در کوره الکتریکی تکلیس در ۹۰۰ درجه مطابق INSO 103',
        frequency: 'each_batch',
        standardId: 'std-inso-103',
        sourceId: 'src-inso-103',
        criticality: 'standard_compliance',
        notesFa: 'معیار درجه استخراج آرد و میزان تفکیک سبوس از آندوسپرم.'
      },
      {
        id: 'test-cereal-gluten',
        code: 'QC-CER-PHY-01',
        category: 'physical',
        nameFa: 'گلوتن مرطوب و ایندکس گلوتن (Wet Gluten & Gluten Index)',
        nameEn: 'Wet Gluten Content by Glutomatic',
        parameterAnalyte: 'Wet Gluten',
        unit: '%',
        minLimit: 26.0,
        methodFa: 'شستشوی مکانیکی نشاسته با محلول کلرید سدیم ۲٪ در دستگاه گلوتوماتیک بر اساس INSO 103',
        frequency: 'each_batch',
        standardId: 'std-inso-103',
        sourceId: 'src-inso-103',
        criticality: 'major_quality'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-103']
    ],
    tags: ['غلات', 'آرد گندم', 'INSO 103', 'گلوتن', 'خاکستر', 'رطوبت', 'فارینوگراف']
  },

  // 4. نان (Bread) - نان سنتی و صنعتی
  {
    id: 'prod-bread-traditional-sangak',
    code: 'PROD-BRD-01',
    nameFa: 'نان سنتی سنگک و تافتون',
    nameEn: 'Traditional Iranian Sangak & Taftoon Flatbreads',
    commercialNameFa: 'نان سنگک کامل سبوس‌دار سنتی و صنعتی',
    category: 'bread',
    descriptionFa: 'نان مسطح سنتی تولید شده از خمیر ترش طبیعی، آرد گندم با سبوس‌گیری کم (آرد کامل)، آب، نمک و مخمر که بر روی بستر سنگریزه‌های داغ کوره سنتی یا فر دوار پخته می‌شود.',
    commercialFormsFa: ['قرص نان گرم سنتی', 'بسته‌بندی اسلایس‌شده نایلونی بهداشتی'],
    physicalStateFa: 'solid',
    targetMatrix: 'شبکه اسفنجی نشاسته ژلاتینیزه و پروتئین‌های دناتوره شده گلوتن با پوسته برشته',
    keyCharacteristicsFa: {
      phTypical: '۵.۳۰ الی ۵.۸۰',
      moisturePercent: '۳۰.۰ الی ۳۵.۰ درصد',
      saltPercent: 'حداکثر ۱.۰ درصد (الزام استاندارد ملی)',
      ashPercent: 'حداکثر ۲.۵ درصد در ماده خشک',
      appearanceColorFa: 'سطح طلایی تا قهوه‌ای روشن با فرورفتگی‌های ویژه بستر سنگریزه، بافت منعطف و متخلخل'
    },
    rawMaterials: [
      {
        id: 'rm-bread-flour',
        nameFa: 'آرد گندم کامل سنگک (درصد سبوس‌گیری حدود ۷٪)',
        nameEn: 'Whole Wheat Sangak Flour',
        role: 'پایه کربوهیدراتی و ساختار نان',
        typicalPercentageRange: '۵۵ الی ۶۰ ٪ کل فرمول خمیر',
        qualityCriteriaFa: 'گلوتن مرطوب بالاتر از ۲۵٪، خاکستر بین ۱.۱ الی ۱.۴ درصد',
        isAllergenic: true,
        allergenType: 'گلوتن',
        standardReference: 'INSO 103'
      },
      {
        id: 'rm-bread-salt',
        nameFa: 'نمک خوراکی یددار تصفیه‌شده',
        nameEn: 'Refined Edible Iodized Salt',
        role: 'تقویت شبکه گلوتن و طعم‌دهی',
        typicalPercentageRange: 'حداکثر ۱.۰ ٪ بر مبنای وزن آرد',
        qualityCriteriaFa: 'خلوص کلرید سدیم بالای ۹۹.۲٪، ید ۳۰-۵۰ ppm',
        isAllergenic: false,
        standardReference: 'INSO 26'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'مخلوط‌سازی و آماده‌سازی خمیر با خمیرترش (سوردو)',
        nameEn: 'Kneading with Natural Sourdough Starter',
        criticalParameters: 'دمای خمیر ۲۶ الی ۲۸ درجه سلسیوس، هیدراتاسیون بالا (۷۵-۸۰٪ آب)',
        equipmentFa: 'خمیرگیر استیل دور متغیر',
        ccpOrCqP: 'CP',
        descriptionFa: 'افزایش الاستیسیته و اسیدی‌شدن خمیر توسط باکتری‌های اسید لاکتیک خمیرترش جهت کاهش اسید فیتیک.'
      },
      {
        stepNumber: 2,
        nameFa: 'تخمیر اولیه و نهایی (Bulk & Final Fermentation)',
        nameEn: 'Bulk Fermentation & Proofing',
        criticalParameters: 'زمان تخمیر: ۶۰ الی ۹۰ دقیقه، رطوبت نسبی ۸۰٪ در دمای ۳۰ درجه',
        equipmentFa: 'اتاقک تخمیر (پروفر) یا حوضچه سنتی تخمیر',
        ccpOrCqP: 'CP',
        descriptionFa: 'تولید گاز CO2 توسط مخمر و اسیدهای آلی توسط لاکتوباسیلوس‌ها.'
      },
      {
        stepNumber: 3,
        nameFa: 'پخت در کوره سنگریزه‌ای یا فر تونلی دوار',
        nameEn: 'Baking on Hot River Pebbles',
        criticalParameters: 'دمای سطح سنگ‌ها: ۲۵۰ الی ۲۸۰ درجه سلسیوس، زمان پخت: ۲ الی ۳ دقیقه',
        equipmentFa: 'کوره سنتی سنگک یا فر صنعتی اتوماتیک بستر سنگی',
        ccpOrCqP: 'CCP',
        descriptionFa: 'ژلاتیناسیون نشاسته، نابودی مخمرها و کاراملیزاسیون قندها در سطح نان.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-brd-oven',
        nameFa: 'کوره پخت نان با حرارت غیرمستقیم',
        nameEn: 'Indirect Heat Baking Oven',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'مشعل گازی با سیستم مبدل حرارتی، بستر سنگریزه‌ای دوار بهداشتی، بدون تماس محصولات احتراق با نان',
        maintenanceAndCalibration: 'بازرسی مشعل و سنسور دمای کوره ماهانه'
      }
    ],
    storageConditions: {
      temperatureRangeFa: 'خنک‌کردن کامل قبل از بسته‌بندی، نگهداری در دمای ۲۰ درجه یا انجماد در منفی ۱۸ درجه',
      relativeHumidityRangeFa: '۵۰ الی ۶۰ درصد',
      lightingProtectionFa: 'دور از نور مستقیم خورشید',
      stackingLimitsFa: 'حداکثر ۱۰ بسته روی هم پس از خنک‌شدن کامل',
      specialPrecautionsFa: 'هرگز نباید نان داغ را در کیسه پلاستیکی قرار داد زیرا موجب تعریق، خمیرشدن و کپک‌زدگی سریع می‌گردد.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'کیسه‌های فیلم پلی‌پروپیلن (OPP) دارای پرفراژ ریز برای خروج بخار یا فیلم پلی‌اتیلن بهداشتی',
      secondaryPackagingMaterialFa: 'سبد پلاستیکی توزیع نان نانوایی',
      barrierPropertiesFa: 'حفظ نسبی نرمی بافت بدون حبس بخار آب',
      hermeticSealTestFa: 'دوخت حرارتی یا کلیپس پلاستیکی تاریخ‌دار'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۳ الی ۴ روز در دمای محیط، ۳ ماه در حالت انجماد (-۱۸ درجه)',
      primaryDeteriorationMechanism: 'بیاتی نان ناشی از رتروگراداسیون آمیلوپکتین و رشد کپک‌های رایزوپوس و آسپرژیلوس',
      criticalLimitAtEndOfShelfLife: 'عاری از هرگونه کلنی کپک مرئی و عدم وجود اسیدیته زننده'
    },
    standards: [
      {
        id: 'std-inso-2628',
        standardNumber: 'INSO 2628',
        organization: 'INSO',
        titleFa: 'نان‌های سنتی - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Traditional breads - Specifications and test methods',
        publicationYear: '1393',
        status: 'active_mandatory',
        scopeFa: 'مقررات حد نمک (حداکثر ۱٪)، ممنوعیت جوش شیرین، رطوبت و خاکستر نان‌های سنتی',
        sourceId: 'src-inso-2628',
        coverageType: 'general_specifications'
      },
      {
        id: 'std-inso-5809',
        standardNumber: 'INSO 5809',
        organization: 'INSO',
        titleFa: 'نان - بیشینه رواداری آلاینده‌ها و باقیمانده‌ها',
        titleEn: 'Bread - Contaminants & residues limits',
        publicationYear: '1396',
        status: 'active_mandatory',
        scopeFa: 'حدود فلزات سنگین (سرب و کادمیوم) و سموم قارچی آفلاتوکسین و دئوکسی نیوالنول',
        sourceId: 'src-inso-5809',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-bread-salt',
        code: 'QC-BRD-CHM-01',
        category: 'chemical',
        nameFa: 'درصد نمک طعام در ماده خشک (Salt Content in Dry Basis)',
        nameEn: 'Sodium Chloride Content by Volhard Method',
        parameterAnalyte: 'Salt (NaCl)',
        unit: '%',
        maxLimit: 1.0,
        methodFa: 'روش تیتراسیون برگشتی ولهارد بر اساس INSO 2628',
        frequency: 'daily',
        standardId: 'std-inso-2628',
        sourceId: 'src-inso-2628',
        criticality: 'critical_safety',
        notesFa: 'کنترل دقیق استاندارد ملی جهت کاهش مصرف نمک جامعه؛ نمک بالای ۱٪ تخلف قانونی است.'
      },
      {
        id: 'test-bread-soda',
        code: 'QC-BRD-CHM-02',
        category: 'chemical',
        nameFa: 'آزمون وجود جوش شیرین (بی‌کربنات سدیم) با شناساگر فنل‌رد / بروموتیمول بلو',
        nameEn: 'Baking Soda (Sodium Bicarbonate) Test',
        parameterAnalyte: 'Sodium Bicarbonate',
        textLimitFa: 'منفی قطعی (استفاده از جوش شیرین در نان کاملاً ممنوع است)',
        methodFa: 'آزمون رنگ‌سنجی با شناساگر pH و سنجش قلیائیت خاکستر مطابق INSO 2628',
        frequency: 'each_batch',
        standardId: 'std-inso-2628',
        sourceId: 'src-inso-2628',
        criticality: 'critical_safety'
      },
      {
        id: 'test-bread-mold',
        code: 'QC-BRD-MIC-01',
        category: 'microbial',
        nameFa: 'شمارش کپک و مخمر (Yeast and Mold Count)',
        nameEn: 'Yeast & Mold Enumeration',
        parameterAnalyte: 'Mold and Yeast',
        unit: 'CFU/g',
        maxLimit: 100,
        methodFa: 'کشت در محیط YGC یا DG18 آگار در ۲۵ درجه به مدت ۵ روز بر اساس INSO 10899',
        frequency: 'periodic',
        standardId: 'std-inso-2628',
        sourceId: 'src-inso-2628',
        criticality: 'major_quality'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-2628'],
      CATALOG_SOURCES_DATABASE['src-inso-5809']
    ],
    tags: ['نان', 'سنگک', 'نان سنتی', 'INSO 2628', 'جوش شیرین', 'نمک نان', 'خمیرترش']
  },

  // 5. بیسکویت (Biscuits) - بیسکویت سخت و کرم‌دار
  {
    id: 'prod-biscuit-cream-sandwich',
    code: 'PROD-BIS-01',
    nameFa: 'بیسکویت مغزدار (کرم‌دار) و سخت',
    nameEn: 'Hard & Cream-Filled Sandwich Biscuits',
    commercialNameFa: 'بیسکویت کرم‌دار وانیلی و کاکائویی پذیرایی',
    category: 'biscuits',
    descriptionFa: 'فرآورده پخته شده ترد حاصل از خمیر آرد گندم، روغن شیرینی‌پزی، شکر، امولسیفایر و مواد پوک‌کننده مجاز که لایه‌ای از مغزی کرمی چرب بین دو پوسته ترد قرار گرفته است.',
    commercialFormsFa: ['بسته‌بندی متالایز چندتایی سلفونی', 'قوطی فلزی کادویی'],
    physicalStateFa: 'solid',
    targetMatrix: 'ماتریکس ترد و متخلخل هوازده کم‌رطوبت آرد با کریستال‌های چربی شورتنینگ',
    keyCharacteristicsFa: {
      moisturePercent: 'حداکثر ۴.۵ درصد در پوسته (کرست)',
      fatPercent: '۱۰.۰ الی ۲۰.۰ درصد (کل محصول با کرم)',
      ashPercent: 'حداکثر ۲.۰ درصد',
      saltPercent: 'حداکثر ۰.۸ درصد',
      waterActivityTypical: '۰.۲۵ الی ۰.۳۵ (بسیار پایدار در برابر رشد میکروبی)',
      appearanceColorFa: 'رنگ طلایی کهربایی یکنواخت، بافت ترد شکننده بدون سوختگی یا رنگ‌پریدگی'
    },
    rawMaterials: [
      {
        id: 'rm-bis-flour',
        nameFa: 'آرد گندم ضعیف بیسکویتی',
        nameEn: 'Soft Wheat Biscuit Flour',
        role: 'ایجاد بافت ترد بدون حالت کشسانی و انقباض خمیر',
        typicalPercentageRange: '۵۰ الی ۶۰ ٪',
        qualityCriteriaFa: 'گلوتن مرطوب ۲۲ الی ۲۴ درصد، پروتئین بین ۸.۵ الی ۹.۵ درصد',
        isAllergenic: true,
        allergenType: 'گلوتن گندم',
        standardReference: 'INSO 103'
      },
      {
        id: 'rm-bis-fat',
        nameFa: 'روغن شیرینی‌پزی هیدروژنه اصلاح‌شده (Shortening)',
        nameEn: 'Bakery Shortening & Palm Oil',
        role: 'کوتاه‌کننده رشته‌های گلوتن و تردکنندگی پوسته بیسکویت',
        typicalPercentageRange: '۱۰ الی ۱۵ ٪',
        qualityCriteriaFa: 'اندیس پراکسید زیر ۲ meq/kg، اسید چرب ترانس زیر ۲ درصد',
        isAllergenic: false,
        standardReference: 'INSO 1446'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'کرمینگ روغن و شکر و ورزدهی خمیر',
        nameEn: 'Creaming & Dough Mixing',
        criticalParameters: 'دمای خمیر ۲۲ الی ۲۵ درجه، هوادهی به فاز چربی',
        equipmentFa: 'میکسر صنعتی خمیر افقی z-blade',
        ccpOrCqP: 'CP',
        descriptionFa: 'حل‌شدن کریستال‌های شکر در روغن و آب و ایجاد بافت کرمی یکنواخت.'
      },
      {
        stepNumber: 2,
        nameFa: 'پهن‌کردن غلتکی، قالب‌زنی روتاری کاتر و سوراخ‌کاری (Docking)',
        nameEn: 'Sheeting & Rotary Cutting with Docking',
        criticalParameters: 'ضخامت یکنواخت ۳.۵ میلی‌متر، سوراخ‌کاری یکنواخت جهت خروج گاز',
        equipmentFa: 'روتری لمیناتور و روتری کاتر مجهز به سنبه‌های داکر',
        ccpOrCqP: 'CP',
        descriptionFa: 'ایجاد شکل هندسی یکنواخت و جلوگیری از تاول‌زدن بیسکویت در فر.'
      },
      {
        stepNumber: 3,
        nameFa: 'پخت در فر تونلی مداوم چند منطقه‌ای',
        nameEn: 'Multi-Zone Continuous Tunnel Oven Baking',
        criticalParameters: 'منطقه ۱: ۱۸۰ درجه (پف کردن)، منطقه ۲: ۲۱۰ درجه (رنگ‌پذیری)، منطقه ۳: ۱۴۰ درجه (خشک‌شدن)',
        equipmentFa: 'فر تونلی ۳۰ متری گازی با نوار نقاله توری استیل',
        ccpOrCqP: 'CCP',
        descriptionFa: 'پخت کامل، تبخیر رطوبت به زیر ۴.۵٪ و واکنش‌های میلار و کاراملیزاسیون.'
      },
      {
        stepNumber: 4,
        nameFa: 'خنک‌سازی آرام و مغزی‌گذاری کرم',
        nameEn: 'Cooling Conveyor & Cream Sandwiching',
        criticalParameters: 'دمای بیسکویت قبل از کرم‌زنی ≤ ۲۵ درجه سلسیوس',
        equipmentFa: 'کانوایر طولانی سرمایش محیطی و دستگاه اتوماتیک سندویچ‌کننده بیسکویت',
        ccpOrCqP: 'OPRP',
        descriptionFa: 'تزریق کرم وانیلی یا شکلاتی بین دو پوسته بدون شکستگی بیسکویت.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-bis-oven',
        nameFa: 'فر تونلی اتوماتیک سه زون پخت',
        nameEn: 'Continuous Three-Zone Tunnel Baking Oven',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'طول نوار ۳۶ متر، پایش PID دمای مشعل‌های بالا و پایین، رطوبت‌گیر قابل تنظیم',
        maintenanceAndCalibration: 'کالیبراسیون ترموکوپل‌های زون‌های پخت هر ۶ ماه'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۱۸ الی ۲۲ درجه سلسیوس (دمای خنک محیط انبار)',
      relativeHumidityRangeFa: 'حداکثر ۵۰ الی ۵۵ درصد (رطوبت بالا موجب جذب آب و از بین رفتن تردی می‌شود)',
      lightingProtectionFa: 'سلفون متالایز بازدارنده نفوذ نور به چربی‌های کرم و پوسته',
      stackingLimitsFa: 'حداکثر ۶ کارتن روی هم در پالت',
      specialPrecautionsFa: 'محافظت در برابر فشار فیزیکی جهت پیشگیری از خرد شدن و شکستگی محصول.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'فیلم دولایه پلی‌پروپیلن مرواریدی و متالایز (BOPP/VM-BOPP)',
      secondaryPackagingMaterialFa: 'کارتن مقوایی کنگره‌دار صادراتی با لمینت محافظ',
      barrierPropertiesFa: 'نفوذناپذیری بسیار بالا در برابر بخار آب (WVTR < 1.0 g/m²/day) و نور مرئی',
      hermeticSealTestFa: 'تست یکپارچگی دوخت حرارتی فلوپک'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۹ الی ۱۲ ماه در شرایط محیطی استاندارد',
      primaryDeteriorationMechanism: 'اکسیداسیون خودبه‌خودی چربی‌های فرمولاسیون (Rancidity) و بیات‌شدن و نرمی بافت',
      criticalLimitAtEndOfShelfLife: 'عدد پراکسید چربی استخراجی کمتر از ۵ meq/kg و رطوبت زیر ۵.۰ درصد'
    },
    standards: [
      {
        id: 'std-inso-2880',
        standardNumber: 'INSO 2880',
        organization: 'INSO',
        titleFa: 'بیسکویت - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Biscuits - Specifications and test methods',
        publicationYear: '1398',
        status: 'active_mandatory',
        scopeFa: 'تعیین ویژگی‌های فیزیکی، درصد چربی، رطوبت، پراکسید روغن، باقیمانده قلیایی و فلزات سنگین',
        sourceId: 'src-inso-2880',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-bis-moist',
        code: 'QC-BIS-CHM-01',
        category: 'chemical',
        nameFa: 'رطوبت بیسکویت به روش آون ۱۰۵ درجه',
        nameEn: 'Moisture Content by Oven at 105 °C',
        parameterAnalyte: 'Moisture',
        unit: '%',
        maxLimit: 4.5,
        methodFa: 'خشک‌کردن نمونه پودرشده در آون اتمسفری به مدت ۴ ساعت بر اساس INSO 2880',
        frequency: 'each_batch',
        standardId: 'std-inso-2880',
        sourceId: 'src-inso-2880',
        criticality: 'major_quality'
      },
      {
        id: 'test-bis-perox',
        code: 'QC-BIS-CHM-02',
        category: 'chemical',
        nameFa: 'عدد پراکسید چربی استخراج‌شده (Peroxide Value)',
        nameEn: 'Peroxide Value of Extracted Fat',
        parameterAnalyte: 'Peroxide Value',
        unit: 'meq O2/kg fat',
        maxLimit: 2.0,
        methodFa: 'استخراج چربی با پترولیوم اتر و تیتراسیون یدومتری با تیوسولفات سدیم مطابق INSO 2880',
        frequency: 'each_batch',
        standardId: 'std-inso-2880',
        sourceId: 'src-inso-2880',
        criticality: 'critical_safety',
        notesFa: 'شاخص اکسیداسیون اولیه روغن بیسکویت؛ عدد بالای ۲ بیانگر تندشدگی چربی است.'
      },
      {
        id: 'test-bis-sensory',
        code: 'QC-BIS-SEN-01',
        category: 'sensory',
        nameFa: 'ارزیابی شکنندگی بافت و طعم (Crispness & Flavor)',
        nameEn: 'Texture Crispness and Flavor Sensory Test',
        parameterAnalyte: 'Crispness and Flavor Profile',
        textLimitFa: 'ترد و شکننده زیر دندان بدون احساس صمغی، طعم شیرین مطلوب بدون چسبندگی به کام',
        methodFa: 'پنل چشایی حسی و تست بافت‌سنجی نفوذی با پراب تیغه‌ای (Texture Analyzer)',
        frequency: 'each_batch',
        standardId: 'std-inso-2880',
        sourceId: 'src-inso-2880',
        criticality: 'major_quality'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-2880']
    ],
    tags: ['بیسکویت', 'شیرینی', 'INSO 2880', 'ترد', 'پراکسید', 'رطوبت', 'روغن شیرینی‌پزی']
  },

  // 6. نوشیدنی (Beverages) - آبمیوه طبیعی پرتقال
  {
    id: 'prod-bev-orange-juice',
    code: 'PROD-BEV-01',
    nameFa: 'آب پرتقال ۱۰۰٪ طبیعی بازسازی‌شده از کنسانتره',
    nameEn: '100% Pure Reconstituted Orange Juice from Concentrate',
    commercialNameFa: 'آب پرتقال خالص بدون شکر افزوده پاکتی و بطری',
    category: 'beverages',
    descriptionFa: 'فرآورده زلال یا پالپ‌دار تهیه شده از رقیق‌سازی کنسانتره طبیعی پرتقال با آب تصفیه‌شده استاندارد تا رسیدن به بریکس طبیعی اولیه میوه بدون هرگونه افزودن شکر یا نگه‌دارنده مصنوعی.',
    commercialFormsFa: ['پاکت آسپتیک تتراپک چندلایه', 'بطری شفاف PET با درب هرمتیک'],
    physicalStateFa: 'liquid',
    targetMatrix: 'سوسپانسیون کلوئیدی اسیدسیتریک، قندهای مونوساکاریدی، پکتین و قطرات اسانس روغنی فلاونوئید پرتقال',
    keyCharacteristicsFa: {
      phTypical: '۳.۵۰ الی ۳.۹۰',
      brixTypical: 'حداقل ۱۱.۲ درجه بریکس (بر اساس استاندارد ملی)',
      moisturePercent: '۸۸.۰ الی ۸۹.۰ درصد',
      ashPercent: '۰.۳ الی ۰.۵ درصد',
      appearanceColorFa: 'نارنجی درخشان طبیعی ویژه آب پرتقال تازه، با پالپ معلق یکنواخت'
    },
    rawMaterials: [
      {
        id: 'rm-bev-conc',
        nameFa: 'کنسانتره پرتقال طبیعی ۶۵ درجه بریکس',
        nameEn: 'Orange Juice Concentrate 65 °Brix',
        role: 'ماده اولیه پایه تأمین‌کننده طعم، اسیدیته و مواد جامد میوه',
        typicalPercentageRange: '۱۷ الی ۱۹ ٪ وزنی',
        qualityCriteriaFa: 'بریکس ۶۵ ± ۱، اسیدیته تیترپذیر بر حسب اسیدسیتریک ۴.۰-۵.۰٪، عاری از سوختگی حرارتی',
        isAllergenic: false,
        standardReference: 'INSO 2685'
      },
      {
        id: 'rm-bev-water',
        nameFa: 'آب تصفیه‌شده اسمز معکوس (RO)',
        nameEn: 'Treated Potable Water by Reverse Osmosis',
        role: 'حلال بازسازی‌کننده کنسانتره',
        typicalPercentageRange: '۸۱ الی ۸۳ ٪',
        qualityCriteriaFa: 'TDS کمتر از ۱۰۰ ppm، کلر باقیمانده صفر، بار میکروبی صفر',
        isAllergenic: false,
        standardReference: 'INSO 1053'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'انحلال و اختلاط کنسانتره با آب در تانک استنلس استیل',
        nameEn: 'Reconstitution & Batch Blending',
        criticalParameters: 'دمای ۱۵ الی ۲۰ درجه، تنظیم بریکس آنلاین دقیق به ۱۱.۲ ± ۰.۱',
        equipmentFa: 'تانک دوجداره اختلاط استیل ۳۱۶ با همزن توربینی و رفرکتومتر آنلاین',
        ccpOrCqP: 'CP',
        descriptionFa: 'همگن‌سازی آب و کنسانتره و اضافه کردن پالپ و اسانس طبیعی پرتقال (Aroma Phase).'
      },
      {
        stepNumber: 2,
        nameFa: 'دی‌اریفیکاسیون (گاززدایی تحت خلاء)',
        nameEn: 'Vacuum Deaeration',
        criticalParameters: 'خلاء منفی ۰.۸ بار در دمای ۴۰ درجه سلسیوس',
        equipmentFa: 'دی‌اریتور مخروطی خلأ پیوسته',
        ccpOrCqP: 'CP',
        descriptionFa: 'خروج اکسیژن محلول به منظور حفظ ویتامین ث و ممانعت از قهوه‌ای‌شدن آبمیوه.'
      },
      {
        stepNumber: 3,
        nameFa: 'پاستوریزاسیون سریع حرارتی (Flash Pasteurization)',
        nameEn: 'Short-Time Plate Pasteurization',
        criticalParameters: 'دما: ۹۰ الی ۹۵ درجه سلسیوس، زمان ماند: ۱۵ الی ۳۰ ثانیه',
        equipmentFa: 'پاستوریزاتور لوله‌ای/صفحه‌ای آبمیوه با راندمان بازیافت حرارت ۸۸٪',
        ccpOrCqP: 'CCP',
        descriptionFa: 'غیرفعال‌سازی آنزیم پکتین متیل استراز (PME) و انهدام کامل مخمرها و باکتری‌های اسیددوست.'
      },
      {
        stepNumber: 4,
        nameFa: 'پرکنی آسپتیک و بسته‌بندی در شرایط استریل',
        nameEn: 'Aseptic Filling & Sealing',
        criticalParameters: 'پرکنی استریل در اتاقک بسته تحت جریان لامینار هوای فیلتر هپا',
        equipmentFa: 'دستگاه پرکن تتراپک آسپتیک اتوماتیک',
        ccpOrCqP: 'CCP',
        descriptionFa: 'تزریق محصول خنک‌شده استریل در پاکت‌های ضد نفوذ بدون نیاز به نگه‌دارنده.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-bev-refract',
        nameFa: 'رفرکتومتر دیجیتال رومیزی با تصحیح خودکار دما',
        nameEn: 'Digital Benchtop Refractometer (0-95 °Brix)',
        roleInProcessOrLab: 'laboratory_qc',
        keySpecificationFa: 'دقت ±۰.۰۱ درجه بریکس با منشور یاقوت کبود و سنسور پلتیر دمایی',
        maintenanceAndCalibration: 'کالیبراسیون روزانه با آب مقطر دو بار تقطیر در ۲۰.۰ درجه'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۴ الی ۲۵ درجه سلسیوس (انبار خشک و خنک)',
      relativeHumidityRangeFa: '۶۰ الی ۷۰ درصد',
      lightingProtectionFa: 'عدم قرارگیری در معرض تابش مستقیم آفتاب جهت محافظت از اسید اسکوربیک',
      stackingLimitsFa: 'حداکثر ۵ ردیف پالت شرینک‌شده',
      specialPrecautionsFa: 'پس از باز شدن درب بسته، حتماً در یخچال (۴ درجه) نگهداری و ظرف ۴ روز مصرف گردد.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'بسته‌بندی چندلایه آسپتیک آلومینیوم-پلی‌اتیلن-مقوا (Aseptic Carton Packaging)',
      secondaryPackagingMaterialFa: 'بسته‌های شرینک حرارتی ۱۲ تایی مقوایی',
      barrierPropertiesFa: 'نفوذناپذیری ۱۰۰٪ به نور مرئی و اشعه ماوراء بنفش و اکسیژن اتمسفر',
      hermeticSealTestFa: 'تست تست هداسپیس و عدم نفوذ گاز و نشتی جوش مافوق صوت پاکت'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۶ الی ۹ ماه در دمای محیط (در بسته‌بندی آسپتیک)',
      primaryDeteriorationMechanism: 'تجزیه و اکسیداسیون اسید اسکوربیک (ویتامین C)، واکنش قهوه‌ای‌شدن غیرآنزیمی و تغییر رنگ و افت عطر',
      criticalLimitAtEndOfShelfLife: 'ویتامین ث حداقل ۲۰۰ میلی‌گرم در لیتر، هیدروکسی متیل فورفورال (HMF) کمتر از ۲۰ میلی‌گرم در لیتر'
    },
    standards: [
      {
        id: 'std-inso-2685',
        standardNumber: 'INSO 2685',
        organization: 'INSO',
        titleFa: 'آبمیوه‌ها - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Fruit juices - Specifications and test methods',
        publicationYear: '1394',
        status: 'active_mandatory',
        scopeFa: 'حداقل بریکس، نسبت بریکس به اسید، خلوص، خاکستر، پکتین و آلاینده‌های آب پرتقال',
        sourceId: 'src-inso-2685',
        coverageType: 'general_specifications'
      },
      {
        id: 'std-codex-247',
        standardNumber: 'Codex Stan 247',
        organization: 'Codex',
        titleFa: 'استاندارد عمومی کدکس برای آبمیوه‌ها و نکتارها',
        titleEn: 'Codex General Standard for Fruit Juices & Nectars (CXS 247-2005)',
        publicationYear: '2005 (Amended 2021)',
        status: 'active_recommended',
        scopeFa: 'مقررات بین‌المللی حداقل بریکس بازسازی‌شده آب پرتقال (۱۱.۲) و عدم افزودن اسیدسیتریک و قند اضافی',
        sourceId: 'src-codex-247',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-bev-brix',
        code: 'QC-BEV-PHY-01',
        category: 'physical',
        nameFa: 'درجه بریکس در ۲۰ درجه سلسیوس (°Brix)',
        nameEn: 'Soluble Solids Content (°Brix) at 20 °C',
        parameterAnalyte: 'Refractometric Brix',
        unit: '°Brix',
        minLimit: 11.2,
        targetValue: 11.5,
        methodFa: 'رفراکتومتری مطابق استاندارد ملی INSO 2685 و کدکس ۲۴۷ با تصحیح دمایی و اسیدیته',
        frequency: 'each_batch',
        standardId: 'std-inso-2685',
        sourceId: 'src-inso-2685',
        criticality: 'critical_safety',
        notesFa: 'بریکس کمتر از ۱۱.۲ عدم انطباق قانونی و کم‌فروشی به حساب می‌آید.'
      },
      {
        id: 'test-bev-acid',
        code: 'QC-BEV-CHM-01',
        category: 'chemical',
        nameFa: 'اسیدیته کل قابل تیتر بر حسب اسید سیتریک بی‌آب',
        nameEn: 'Titratable Acidity as Anhydrous Citric Acid',
        parameterAnalyte: 'Citric Acid Acidity',
        unit: 'g/100ml',
        minLimit: 0.65,
        maxLimit: 1.20,
        methodFa: 'تیتراسیون پتانسیومتری با NaOH 0.1 N تا نقطه پایانی pH = 8.1 بر اساس INSO 2685',
        frequency: 'each_batch',
        standardId: 'std-inso-2685',
        sourceId: 'src-inso-2685',
        criticality: 'major_quality'
      },
      {
        id: 'test-bev-yeast',
        code: 'QC-BEV-MIC-01',
        category: 'microbial',
        nameFa: 'شمارش مخمرها و باکتری‌های مقاوم به اسید (الکتروفیل و اسیدوفیل)',
        nameEn: 'Acidophilic Microorganisms and Osmophilic Yeasts',
        parameterAnalyte: 'Acid-Tolerant Yeasts',
        unit: 'CFU/ml',
        maxLimit: 0,
        textLimitFa: 'منفی / صفر در ۱ میلی‌لیتر (عدم رشد در بسته‌بندی آسپتیک تجاری)',
        methodFa: 'کشت در محیط اورنج سرم آگار (OSA) در دمای ۳۰ درجه به مدت ۳ الی ۵ روز',
        frequency: 'each_batch',
        standardId: 'std-inso-2685',
        sourceId: 'src-inso-2685',
        criticality: 'critical_safety'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-2685'],
      CATALOG_SOURCES_DATABASE['src-codex-247']
    ],
    tags: ['نوشیدنی', 'آبمیوه', 'پرتقال', 'بریکس ۱۱.۲', 'INSO 2685', 'Codex 247', 'آسپتیک']
  }
];
