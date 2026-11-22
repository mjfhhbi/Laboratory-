import { FoodCatalogProduct } from '../../types/foodProductsCatalog';
import { CATALOG_SOURCES_DATABASE } from './catalogSources';

export const PART2_PRODUCTS: FoodCatalogProduct[] = [
  // 7. روغن و چربی (Oils & Fats) - روغن آفتابگردان
  {
    id: 'prod-oil-sunflower-refined',
    code: 'PROD-OIL-01',
    nameFa: 'روغن آفتابگردان تصفیه‌شده خوراکی (Refined Sunflower Oil)',
    nameEn: 'Refined Edible Sunflower Seed Oil',
    commercialNameFa: 'روغن مایع خالص آفتابگردان بطری پت',
    category: 'oils_fats',
    descriptionFa: 'روغن گیاهی به دست آمده از دانه‌های روغنی آفتابگردان (Helianthus annuus L.) که مراحل صمغ‌گیری، خنثی‌سازی، رنگ‌بری، زمستانه‌کردن (Winterization) و بی‌بوسازی را طی کرده است.',
    commercialFormsFa: ['بطری شفاف PET دسته دار ۸۱۰ و ۱۳۵۰ گرمی', 'حلب فلزی ۴.۵ لیتری'],
    physicalStateFa: 'liquid',
    targetMatrix: 'تری‌گلیسیریدهای غیراشباع سرشار از اسید لینولئیک (امگا ۶) و ویتامین E طبیعی',
    keyCharacteristicsFa: {
      moisturePercent: 'حداکثر ۰.۰۵ درصد',
      fatPercent: '۹۹.۹ درصد تری‌گلیسیرید خالص',
      appearanceColorFa: 'زرد طلایی شفاف، بدون کدورت، رسوب مومی و فاقد بوی نامطبوع اکسیداسیون'
    },
    rawMaterials: [
      {
        id: 'rm-oil-sunflower-seed',
        nameFa: 'روغن خام آفتابگردان فشرده/استخراجی',
        nameEn: 'Crude Sunflower Seed Oil',
        role: 'ماده اولیه پایه استخراج چربی',
        typicalPercentageRange: '۱۰۰ ٪',
        qualityCriteriaFa: 'اسیدیته آزاد کمتر از ۲.۵٪، صمغ فسفاتیدی زیر ۱.۵٪، عدد ید ۱۱۸ الی ۱۴۵',
        isAllergenic: false,
        standardReference: 'INSO 1446'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'صمغ‌گیری با آب و اسید فسفریک (Degumming)',
        nameEn: 'Water & Acid Degumming',
        criticalParameters: 'دمای ۷۰ الی ۸۵ درجه، جداسازی سانتریفیوژی لجن فسفاتیدی',
        equipmentFa: 'میکسر استاتیک تزریق اسید و سپراتور سانتریفیوژ دیسکی پرسرعت',
        ccpOrCqP: 'CP',
        descriptionFa: 'هیدراته‌کردن فسفولیپیدها و خارج‌سازی لسیتین از فاز روغنی.'
      },
      {
        stepNumber: 2,
        nameFa: 'خنثی‌سازی شیمیایی اسیدهای چرب آزاد (Neutralization)',
        nameEn: 'Alkali Neutralization with Caustic Soda',
        criticalParameters: 'تزریق سود سوزآور دقیق، دمای ۶۵-۷۵ درجه، حذف صابون حاصل',
        equipmentFa: 'راکتور خنثی‌سازی مداوم و سپراتور جداسازی صابون (Soapstock)',
        ccpOrCqP: 'CP',
        descriptionFa: 'تبدیل اسیدهای چرب آزاد (FFA) به صابون و شستشوی کامل با آب گرم.'
      },
      {
        stepNumber: 3,
        nameFa: 'رنگ‌بری با خاک رنگ‌بر فعال (Bleaching)',
        nameEn: 'Vacuum Bleaching with Activated Bleaching Earth',
        criticalParameters: 'دمای ۱۰۵ الی ۱۱۰ درجه تحت خلاء کامل زیر ۵۰ میلی‌بار',
        equipmentFa: 'رنگ‌بر مداوم تحت خلاء (Bleacher) و فیلترهای صفحه‌ای فشاری (Niagara Filter)',
        ccpOrCqP: 'CP',
        descriptionFa: 'جذب کلروفیل و کاروتنوئیدها و تجزیه هیدروپراکسیدها روی ذرات بنتونیت فعال.'
      },
      {
        stepNumber: 4,
        nameFa: 'زمستانه‌کردن (Winterization / Dewaxing)',
        nameEn: 'Crystallization & Dewaxing',
        criticalParameters: 'سرمایش تدریجی روغن تا دمای ۵ الی ۷ درجه به مدت ۱۲ ساعت',
        equipmentFa: 'کریستالایزر کندسردشونده و فیلتر پرس‌های واکس‌گیر',
        ccpOrCqP: 'CP',
        descriptionFa: 'متبلور ساختن و فیلتراسیون استرهای موم سنگین جهت جلوگیری از کدرشدن روغن در یخچال.'
      },
      {
        stepNumber: 5,
        nameFa: 'بی‌بوسازی با تزریق بخار زنده در خلاء بالا (Deodorization)',
        nameEn: 'High-Vacuum Steam Stripping Deodorization',
        criticalParameters: 'دمای ۲۳۰ الی ۲۴۰ درجه سلسیوس، فشار خلاء زیر ۲ میلی‌بار، زمان ماند ۶۰ الی ۹۰ دقیقه',
        equipmentFa: 'برج بی‌بوساز طبقاتی استیل ضدزنگ مجهز به پمپ‌های بوستر بخار و سیستم اسکرابر',
        ccpOrCqP: 'CCP',
        descriptionFa: 'تقطیر ترکیبات فرار آلدهیدی و کتونی مولد بوی تند و آلدئیدها و کاهش پراکسید به صفر.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-oil-deod',
        nameFa: 'برج بی‌بوساز طبقاتی استیل تحت خلاء عمیق',
        nameEn: 'Continuous Deodorizing Column (2 mbar)',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'دمای ۲۴۰ درجه، تزریق بخار غیرمستقیم و مستقیم، کویل‌های خنک‌کننده نیتروژنی',
        maintenanceAndCalibration: 'بازرسی سالانه سیستم خلاء و آب‌بندی شفت‌ها'
      },
      {
        id: 'eq-oil-rancimat',
        nameFa: 'دستگاه رنسیمت پایداری اکسیداسیونی (Rancimat)',
        nameEn: 'Metrohm Rancimat Oxidation Stability Tester',
        roleInProcessOrLab: 'laboratory_qc',
        keySpecificationFa: 'دمای ۱۱۰ الی ۱۲۰ درجه، جریان هوای ۱۰ لیتر در ساعت، ثبت زمان القای اکسیداسیون (OSI)',
        maintenanceAndCalibration: 'کالیبراسیون سلول‌های هدایت‌سنجی ماهانه'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۱۵ الی ۲۵ درجه سلسیوس در انبار سرپوشیده',
      relativeHumidityRangeFa: 'حداکثر ۶۰ درصد',
      lightingProtectionFa: 'عدم قرارگیری در برابر نور مستقیم؛ استفاده از بطری‌های دارای جاذب UV یا جعبه مقوایی',
      stackingLimitsFa: 'حداکثر ۴ ردیف کارتن در پالت',
      specialPrecautionsFa: 'محافظت اکید در برابر نفوذ هوا و تماس با فلزات کاتالیزور مس و آهن.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'بطری‌های پلی‌اتیلن ترفتالات (PET) با تزریق گاز بی‌اثر نیتروژن (N2 Flushing) در فضای بالای بطری',
      secondaryPackagingMaterialFa: 'کارتن مقوایی ۵ لایه کرافت',
      barrierPropertiesFa: 'کاهش اکسیژن هداسپیس به زیر ۱.۰ درصد توسط نیتروژن مایع',
      hermeticSealTestFa: 'تست تست گشتاور و درزبندی درب فیلیپ‌تاپ اینداکشن'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۱۲ ماه از زمان تولید',
      primaryDeteriorationMechanism: 'اکسیداسیون نوری و خودبه‌خودی اتواکسیداسیون ناشی از نفوذ اکسیژن و تولید رادیکال‌های آزاد',
      criticalLimitAtEndOfShelfLife: 'عدد پراکسید حداکثر ۵.۰ meq O2/kg و اسیدیته آزاد کمتر از ۰.۲ درصد'
    },
    standards: [
      {
        id: 'std-inso-1446',
        standardNumber: 'INSO 1446',
        organization: 'INSO',
        titleFa: 'روغن آفتابگردان خوراکی تصفیه‌شده - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Refined edible sunflower oil - Specifications',
        publicationYear: '1399',
        status: 'active_mandatory',
        scopeFa: 'تعیین عدد پراکسید، اسیدیته، ضریب شکست، صابونی، رنگ لاویباند، فلزات سنگین و پروفایل اسید چرب',
        sourceId: 'src-inso-1446',
        coverageType: 'general_specifications'
      },
      {
        id: 'std-codex-210',
        standardNumber: 'Codex Stan 210',
        organization: 'Codex',
        titleFa: 'استاندارد کدکس برای روغن‌های گیاهی نامگذاری‌شده',
        titleEn: 'Codex Standard for Named Vegetable Oils (CXS 210-1999)',
        publicationYear: '1999 (Revised 2019)',
        status: 'active_recommended',
        scopeFa: 'مقررات بین‌المللی خلوص، پروفایل استرول‌ها و توکوفرول‌های طبیعی روغن آفتابگردان',
        sourceId: 'src-codex-210',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-oil-pv',
        code: 'QC-OIL-CHM-01',
        category: 'chemical',
        nameFa: 'عدد پراکسید (Peroxide Value - PV)',
        nameEn: 'Peroxide Value by Iodometric Titration',
        parameterAnalyte: 'Peroxide',
        unit: 'meq O2/kg',
        maxLimit: 2.0,
        methodFa: 'حل روغن در اسید استیک-کلروفرم و تیتراسیون ید آزادشده با تیوسولفات سدیم بر اساس INSO 1446 و AOCS Cd 8b-90',
        frequency: 'each_batch',
        standardId: 'std-inso-1446',
        sourceId: 'src-inso-1446',
        criticality: 'critical_safety',
        notesFa: 'محدوده مجاز در خروج از کارخانه حداکثر ۲.۰ است؛ پراکسید بالاتر نشانگر شروع تندشدگی اکسیداتیو است.'
      },
      {
        id: 'test-oil-ffa',
        code: 'QC-OIL-CHM-02',
        category: 'chemical',
        nameFa: 'اسیدیته آزاد بر حسب درصد اسید اولئیک (Free Fatty Acids - FFA)',
        nameEn: 'Free Fatty Acids Content as Oleic Acid',
        parameterAnalyte: 'Free Fatty Acids',
        unit: '%',
        maxLimit: 0.15,
        methodFa: 'تیتراسیون با هیدروکسید پتاسیم الکلی ۰.۱ نرمال در اتانول خنثی بر اساس INSO 1446',
        frequency: 'each_batch',
        standardId: 'std-inso-1446',
        sourceId: 'src-inso-1446',
        criticality: 'major_quality'
      },
      {
        id: 'test-oil-cold',
        code: 'QC-OIL-PHY-01',
        category: 'physical',
        nameFa: 'آزمون سرمایش (Cold Test برای زمستانه‌شدن)',
        nameEn: 'Cold Test for Cloudiness at 0 °C',
        parameterAnalyte: 'Wax Stability / Clarity',
        textLimitFa: 'شفاف و بدون هرگونه ابری‌شدگی یا رسوب پس از ۵.۵ ساعت در دمای صفر درجه سلسیوس',
        methodFa: 'قرار دادن لوله حاوی روغن در حمام یخ و آب در صفر درجه به مدت ۵.۵ ساعت مطابق AOCS Cc 11-53',
        frequency: 'each_batch',
        standardId: 'std-inso-1446',
        sourceId: 'src-inso-1446',
        criticality: 'standard_compliance'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-1446'],
      CATALOG_SOURCES_DATABASE['src-codex-210']
    ],
    tags: ['روغن', 'آفتابگردان', 'INSO 1446', 'Codex 210', 'پراکسید', 'اسیدیته', 'زمستانه']
  },

  // 8. کنسرو (Canned Foods) - کنسرو ماهی تن در روغن
  {
    id: 'prod-canned-tuna-in-oil',
    code: 'PROD-CAN-01',
    nameFa: 'کنسرو ماهی تن در روغن مایع خوراکی',
    nameEn: 'Canned Tuna in Vegetable Oil (Solid & Chunk)',
    commercialNameFa: 'کنسرو تن ماهی درجه یک تکه‌ای (چانک / سالید)',
    category: 'canned_foods',
    descriptionFa: 'گوشت پاک‌شده و بدون استخوان فیله ماهی تن (هوور، گیدر یا زرده) که پس از پخت اولیه، در قوطی فلزی به همراه روغن مایع خوراکی و نمک طعام پر شده و تحت استریلیزاسیون حرارتی تجاری قرار گرفته است.',
    commercialFormsFa: ['قوطی فلزی ایزی اوپن (کلیددار) ۱۸۰ گرمی و ۱۲۰ گرمی'],
    physicalStateFa: 'solid',
    targetMatrix: 'بافت عضلانی ماهی تن درون فاز چربی مایع استریل تجاری',
    keyCharacteristicsFa: {
      phTypical: '۵.۸۰ الی ۶.۳۰',
      proteinPercent: 'حداقل ۲۱.۰ درصد',
      fatPercent: '۱۵.۰ الی ۲۵.۰ درصد',
      saltPercent: '۱.۰ الی ۱.۸ درصد',
      appearanceColorFa: 'گوشت یکنواخت روشن تا صورتی روشن بدون سیاهی، خون‌مردگی، پوست و استخوان'
    },
    rawMaterials: [
      {
        id: 'rm-tuna-fish',
        nameFa: 'ماهی تن منجمد صنعتی (هوور یا گیدر Thunnus albacares)',
        nameEn: 'Frozen Yellowfin / Skipjack Tuna',
        role: 'ماده اولیه پروتئینی پایه',
        typicalPercentageRange: '۷۰ الی ۷۵ ٪ کل وزن قوطی',
        qualityCriteriaFa: 'هیستامین زیر ۵۰ ppm در ماهی خام، TVB-N کمتر از ۲۵ میلی‌گرم در ۱۰۰ گرم',
        isAllergenic: true,
        allergenType: 'ماهی و فرآورده‌های دریایی',
        standardReference: 'INSO 1904'
      },
      {
        id: 'rm-tuna-oil',
        nameFa: 'روغن سویا یا آفتابگردان تصفیه‌شده خوراکی',
        nameEn: 'Refined Edible Soybean / Sunflower Oil',
        role: 'محیط پرکننده روغنی و محافظ بافت',
        typicalPercentageRange: '۱۸ الی ۲۲ ٪',
        qualityCriteriaFa: 'پراکسید زیر ۱.۵ meq/kg، اسیدیته زیر ۰.۱٪',
        isAllergenic: false,
        standardReference: 'INSO 1446'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'دیفراست و پخت اولیه با بخار (Pre-cooking)',
        nameEn: 'Thawing & Steam Pre-cooking',
        criticalParameters: 'دمای ۱۰۰ الی ۱۰۴ درجه با بخار، رسیدن دمای ستون فقرات به ۶۲ درجه',
        equipmentFa: 'اتوکلاوهای پخت اولیه ماهی تن (Cooker)',
        ccpOrCqP: 'CP',
        descriptionFa: 'خروج آب اضافه و تسهیل جداسازی پوست، استخوان و عضلات تیره.'
      },
      {
        stepNumber: 2,
        nameFa: 'پاک‌سازی، فیله‌گیری و قوطی‌گذاری (Filling)',
        nameEn: 'Cleaning, Filleting & Automatic Can Filling',
        criticalParameters: 'کنترل وزن گوشت جامد (Drained Weight)، حذف عضلات تیره',
        equipmentFa: 'خط میز تمیزکاری استیل و دستگاه تن‌پکر اتوماتیک (Tuna Packer)',
        ccpOrCqP: 'CP',
        descriptionFa: 'برش قرص گوشت ماهی و قرار دادن داخل قوطی‌های لاک‌خورده بهداشتی.'
      },
      {
        stepNumber: 3,
        nameFa: 'تزریق نمک و روغن داغ و اگزاستینگ (Exhausting)',
        nameEn: 'Hot Oil Dosing & Steam Exhausting',
        criticalParameters: 'دمای روغن افزوده ۸۰ الی ۸۵ درجه، خروج گازهای هداسپیس قوطی',
        equipmentFa: 'دوزر اتوماتیک روغن و نمک و تونل اگزاست بخار',
        ccpOrCqP: 'CP',
        descriptionFa: 'ایجاد خلاء نسبی مناسب پس از سرد شدن قوطی و خارج‌کردن حباب‌های اکسیژن.'
      },
      {
        stepNumber: 4,
        nameFa: 'درب‌بندی دوتایی هرمتیک (Double Seaming)',
        nameEn: 'Hermetic Double Seaming',
        criticalParameters: 'اندازه‌گیری ابعاد درز دوگانه (ضخامت، طول، هم‌پوشانی Overlap بالای ۵۰٪)',
        equipmentFa: 'دستگاه درب‌بند اتوماتیک ۴ هد با سیستم گازفلاش',
        ccpOrCqP: 'CCP',
        descriptionFa: 'حیاتی‌ترین مرحله جهت جلوگیری از ورود هرگونه آلودگی ثانویه پس از پخت.'
      },
      {
        stepNumber: 5,
        nameFa: 'استریلیزاسیون حرارتی تجاری تحت فشار در اتوکلاو (Retort Retorting)',
        nameEn: 'Thermal Commercial Sterilization (Retort F0 Value ≥ 8.0)',
        criticalParameters: 'دما: ۱۲۱.۱ درجه سلسیوس، زمان: ۶۰ الی ۷۵ دقیقه، مقدار پخت تجاری F0 > 8.0 دقیقه',
        equipmentFa: 'اتوکلاو صنعتی مجهز به سیستم فشار متقابل هیدرولیکی (Overpressure Retort)',
        ccpOrCqP: 'CCP',
        descriptionFa: 'نابودی حتمی اسپورهای کشنده باکتری بی‌هوازی کلستریدیوم بوتولینوم.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-tuna-retort',
        nameFa: 'اتوکلاو استریلیزاسیون تحت فشار مجهز به سیستم ثبت داده و F0',
        nameEn: 'Industrial Overpressure Retort with F0 Controller',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'سیستم ثبت خودکار زمان و دما با سوپاپ‌های اطمینان مضاعف و سیستم دوش آب سرد سریع',
        maintenanceAndCalibration: 'کالیبراسیون فشارسنج و حسگرهای دما هر ۶ ماه توسط شرکت تایید صلاحیت استاندارد'
      },
      {
        id: 'eq-tuna-seam-projector',
        nameFa: 'ویدئو پروجکتور ارزیابی درز قوطی (Seam Projector)',
        nameEn: 'Automatic Double Seam Optical Inspection Projector',
        roleInProcessOrLab: 'laboratory_qc',
        keySpecificationFa: 'بزرگ‌نمایی ۵۰ برابری مقطع برش درز قوطی جهت محاسبه دقیق درصد هم‌پوشانی (Overlap)',
        maintenanceAndCalibration: 'کالیبراسیون لنز با قطعه استاندارد میکرومتر'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۱۰ الی ۲۵ درجه سلسیوس در انبار خشک و دور از نم',
      relativeHumidityRangeFa: 'حداکثر ۶۵ درصد (رطوبت بالا سبب زنگ‌زدگی درز قوطی می‌شود)',
      lightingProtectionFa: 'به دلیل فلزی بودن قوطی نیازی به محافظت نوری ندارد',
      stackingLimitsFa: 'حداکثر ۵ لایه پالت شرینک با احتیاط',
      specialPrecautionsFa: 'محافظت در برابر ضربه‌های فیزیکی که موجب فرورفتگی یا آسیب به درز دوگانه (Dent cans) می‌شود.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'قوطی فلزی تین‌پلیت (قلع‌اندود) با لاک اپوکسی-فنولیک مقاوم به مواد گوگردی (SR Lacquer)',
      secondaryPackagingMaterialFa: 'بسته‌بندی شرینک نایلونی ۲۴ عددی با سینی مقوایی',
      barrierPropertiesFa: 'نفوذناپذیری ۱۰۰٪ در برابر گازها، رطوبت و نور',
      hermeticSealTestFa: 'تست درزبندی درز مضاعف (Double seam micrometer test) و آزمون خلاء هداسپیس'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۲۴ الی ۳۶ ماه از تاریخ تولید',
      primaryDeteriorationMechanism: 'خوردگی شیمیایی جدار داخلی قوطی، نشت گاز از درز در صورت ضربه، یا فساد میکروبی ترموفیل ناشی از نقص فرآیند استریل',
      criticalLimitAtEndOfShelfLife: 'عاری از تورم (بادکردگی)، قلع محلول کمتر از ۲۵۰ ppm، آهن زیر ۱۵ ppm'
    },
    standards: [
      {
        id: 'std-inso-1904',
        standardNumber: 'INSO 1904',
        organization: 'INSO',
        titleFa: 'کنسرو ماهی تن در روغن - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Canned tuna in oil - Specifications and test methods',
        publicationYear: '1397',
        status: 'active_mandatory',
        scopeFa: 'تعیین درصد وزن آبکش، هیستامین، نمک، پروتئین، اسیدیته، قلع، سرب و آزمون استریلیته تجاری',
        sourceId: 'src-inso-1904',
        coverageType: 'general_specifications'
      },
      {
        id: 'std-codex-70',
        standardNumber: 'Codex Stan 70',
        organization: 'Codex',
        titleFa: 'استاندارد کدکس برای کنسرو ماهی تن و بونیتو',
        titleEn: 'Standard for Canned Tuna and Bonito (CXS 70-1981)',
        publicationYear: '1981 (Amended 2018)',
        status: 'active_recommended',
        scopeFa: 'مقررات بین‌المللی رده‌بندی گوشت تن (تکه‌ای، خردشده) و آلاینده هیستامین',
        sourceId: 'src-codex-70',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-tuna-histamine',
        code: 'QC-TUN-CHM-01',
        category: 'chemical',
        nameFa: 'آزمون سنجش هیستامین (Histamine by HPLC / Fluorometry)',
        nameEn: 'Histamine Content Determination',
        parameterAnalyte: 'Histamine',
        unit: 'mg/kg (ppm)',
        maxLimit: 100,
        methodFa: 'استخراج با اسید تری‌کلرواستیک و اندازه‌گیری با کروماتوگرافی مایع HPLC بر اساس INSO 1904',
        frequency: 'each_batch',
        standardId: 'std-inso-1904',
        sourceId: 'src-inso-1904',
        criticality: 'critical_safety',
        notesFa: 'سم عامل مسمومیت اسکامبروئید (Scombroid poisoning)؛ مقادیر بالای ۱۰۰ خطرناک و غیرمجاز است.'
      },
      {
        id: 'test-tuna-sterility',
        code: 'QC-TUN-MIC-01',
        category: 'microbial',
        nameFa: 'آزمون استریلیته تجاری (Commercial Sterility Incubation Test)',
        nameEn: 'Commercial Sterility Test at 30 °C & 55 °C',
        parameterAnalyte: 'Thermophilic & Mesophilic Spoilage Organisms',
        textLimitFa: 'استریل تجاری کامل (عدم بادکردگی قوطی و عدم رشد هیچ‌گونه باکتری زنده پس از انکوباسیون)',
        methodFa: 'گرمخانه‌گذاری قوطی‌ها به مدت ۱۰ روز در دمای ۳۷ درجه و دمای ۵۵ درجه سلسیوس مطابق INSO 2326',
        frequency: 'each_batch',
        standardId: 'std-inso-1904',
        sourceId: 'src-inso-1904',
        criticality: 'critical_safety'
      },
      {
        id: 'test-tuna-drain',
        code: 'QC-TUN-PHY-01',
        category: 'physical',
        nameFa: 'درصد وزن آبکش گوشت (Drained Weight Percentage)',
        nameEn: 'Drained Weight of Tuna Meat',
        parameterAnalyte: 'Drained Weight',
        unit: '%',
        minLimit: 70.0,
        methodFa: 'تخلیه روی الک استاندارد و توزین پس از ۲ دقیقه چکه‌کردن بر اساس INSO 1904',
        frequency: 'each_batch',
        standardId: 'std-inso-1904',
        sourceId: 'src-inso-1904',
        criticality: 'standard_compliance'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-1904'],
      CATALOG_SOURCES_DATABASE['src-codex-70']
    ],
    tags: ['کنسرو', 'تن ماهی', 'INSO 1904', 'Codex 70', 'استریلیزاسیون', 'هیستامین', 'درز دوبل']
  },

  // 9. مربا (Jams) - مربای توت‌فرنگی
  {
    id: 'prod-jam-strawberry',
    code: 'PROD-JAM-01',
    nameFa: 'مربای توت‌فرنگی غلیظ‌شده (Strawberry Jam)',
    nameEn: 'Concentrated Strawberry Jam & Preserve',
    commercialNameFa: 'مربای توت‌فرنگی شیشه‌ای صبحانه',
    category: 'jams',
    descriptionFa: 'فرآورده ژله‌ای حاصل از پخت میوه کامل یا قطعات توت‌فرنگی با شکر، پکتین با متوکسیل بالا (HM) و اسید سیتریک تا رسیدن به ماده خشک محلول (بریکس) حداقل ۶۵ درصد.',
    commercialFormsFa: ['شیشه جار شفاف با درب فلزی تویست‌آف (Twist-off) ۳۰۰ و ۵۰۰ گرمی'],
    physicalStateFa: 'viscous_paste',
    targetMatrix: 'شبکه ژلی هیدروکلوئیدی پکتین-قند-اسید احاطه‌کننده بافت‌های میوه توت‌فرنگی',
    keyCharacteristicsFa: {
      phTypical: '۳.۱۰ الی ۳.۴۵',
      brixTypical: 'حداقل ۶۵.۰ درجه بریکس (الزام استاندارد ملی)',
      waterActivityTypical: '۰.۷۵ الی ۰.۸۰',
      appearanceColorFa: 'قرمز یاقوتی درخشان طبیعی، قوام ژله‌ای الاستیک بدون آب‌انداختگی (سینرسیس) یا شکرک'
    },
    rawMaterials: [
      {
        id: 'rm-jam-berry',
        nameFa: 'میوه توت‌فرنگی تازه یا منجمد دم‌گیری‌شده',
        nameEn: 'Cleaned Frozen Strawberries (IQF)',
        role: 'ماده اصلی میوه‌ای تأمین‌کننده طعم و بافت',
        typicalPercentageRange: 'حداقل ۴۵ ٪ میوه در فرمول',
        qualityCriteriaFa: 'رسیده، بدون لهیدگی و پوسیدگی قارچی، رنگ قرمز مطلوب',
        isAllergenic: false,
        standardReference: 'INSO 214'
      },
      {
        id: 'rm-jam-sugar',
        nameFa: 'شکر سفید تصفیه‌شده (ساکارز)',
        nameEn: 'Refined Granulated Sugar (Sucrose)',
        role: 'شیرین‌کننده، ایجاد فشار اسمزی بالا و قوام‌دهنده ژل',
        typicalPercentageRange: '۵۰ الی ۵۵ ٪',
        qualityCriteriaFa: 'خلوص بالای ۹۹.۷٪، رنگ سنجی ایکومسا زیر ۴۵',
        isAllergenic: false,
        standardReference: 'INSO 69'
      },
      {
        id: 'rm-jam-pectin',
        nameFa: 'پکتین میوه‌ای با متوکسیل بالا (HM Pectin)',
        nameEn: 'High Methoxyl Citrus Pectin',
        role: 'تشکیل شبکه ژل متراکم در حضور قند بالای ۶۵٪ و pH زیر ۳.۴',
        typicalPercentageRange: '۰.۴ الی ۰.۸ ٪',
        qualityCriteriaFa: 'درجه ژل‌سازی ۱۵۰ USA-Sag',
        isAllergenic: false
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'پخت در دیگ تحت خلاء (Vacuum Pan Cooking)',
        nameEn: 'Vacuum Pan Concentration',
        criticalParameters: 'دما: ۶۵ الی ۷۰ درجه سلسیوس، خلاء منفی ۰.۷ الی ۰.۸ بار تا رسیدن به بریکس ۶۵',
        equipmentFa: 'دیگ پخت تحت خلاء استیل دو جداره مجهز به سنسور بریکس',
        ccpOrCqP: 'CP',
        descriptionFa: 'حفظ رنگ طبیعی توت‌فرنگی، جلوگیری از سوختگی و کاراملیزاسیون قندها و تشکیل ژل پکتین.'
      },
      {
        stepNumber: 2,
        nameFa: 'پرکنی داغ در جار شیشه‌ای و درب‌بندی بخار (Hot Filling & Steam Capping)',
        nameEn: 'Hot Filling at 85 °C & Vacuum Steam Capping',
        criticalParameters: 'دمای محصول حین پرکنی ≥ ۸۵ درجه سلسیوس، تزریق بخار زیر درب شیشه',
        equipmentFa: 'پرکن پیستونی روتاری شیشه و درب‌بند تویست‌آف با دوش بخار',
        ccpOrCqP: 'CCP',
        descriptionFa: 'استریلیزاسیون سطح داخلی شیشه و ایجاد خلاء در بالای جار پس از سردشدن (Pop-up button).'
      },
      {
        stepNumber: 3,
        nameFa: 'تونل سرمایش تدریجی آب',
        nameEn: 'Gradual Cooling Tunnel',
        criticalParameters: 'کاهش دما از ۸۵ به ۴۰ درجه طی ۳۰ دقیقه با دوش‌های آب ولرم',
        equipmentFa: 'تونل کانوایر خنک‌کننده چند منطقه‌ای',
        ccpOrCqP: 'CP',
        descriptionFa: 'جلوگیری از شوک حرارتی و شکستن شیشه‌ها و تثبیت ساختار نهایی ژل پکتین.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-jam-vac',
        nameFa: 'دیگ پخت تحت خلاء صنعتی دوجداره استیل',
        nameEn: 'Industrial Vacuum Cooking Pan with Scraper Agitator',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'حجم ۱۰۰۰ لیتر، همزن با تیغه‌های تفلونی تراشنده دیواره، کندانسور بخار خروجی',
        maintenanceAndCalibration: 'کنترل گیج خلاء و سنسورهای فشار ماهانه'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۱۵ الی ۲۵ درجه سلسیوس در محل خشک و دور از نور',
      relativeHumidityRangeFa: '۶۰ الی ۷۰ درصد',
      lightingProtectionFa: 'عدم نگهداری در معرض نور خورشید جهت پیشگیری از تغییر رنگ رنگدانه‌های آنتوسیانین به قهوه‌ای',
      stackingLimitsFa: 'حداکثر ۵ طبقه کارتن شرینک‌شده',
      specialPrecautionsFa: 'پس از باز کردن درپوش، نگهداری در یخچال (۴ درجه) ضروری است.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'شیشه کریستال شفاف بدون حباب با درب فلزی مجهز به پلاستیزول و دکمه اطمینان خلاء (Safety Button)',
      secondaryPackagingMaterialFa: 'کارتن مقوایی دسته‌دار ۱۲ عددی با جداکننده خانه‌بندی',
      barrierPropertiesFa: 'نفوذناپذیری کامل شیشه به اکسیژن و بو',
      hermeticSealTestFa: 'تست تست افت درب (فرو رفتن کلید ایمنی خلاء پس از سرد شدن)'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۱۸ الی ۲۴ ماه از تاریخ پخت',
      primaryDeteriorationMechanism: 'اکسیداسیون آنتوسیانین‌ها، آب‌انداختگی ژل (Syneresis)، یا رشد قارچ‌های اسموفیل در صورت بازماندن یا کاهش بریکس',
      criticalLimitAtEndOfShelfLife: 'بریکس حداقل ۶۵.۰، عاری از کریستال‌های شکرک و کپک'
    },
    standards: [
      {
        id: 'std-inso-214',
        standardNumber: 'INSO 214',
        organization: 'INSO',
        titleFa: 'مربا، مارمالاد و ژله میوه - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Jams, jellies and marmalades - Specifications and test methods',
        publicationYear: '1396',
        status: 'active_mandatory',
        scopeFa: 'حداقل درصد میوه، حداقل بریکس، قند احیاکننده، دی‌اکسید گوگرد، اسیدیته و آلاینده‌ها',
        sourceId: 'src-inso-214',
        coverageType: 'general_specifications'
      },
      {
        id: 'std-codex-296',
        standardNumber: 'Codex Stan 296',
        organization: 'Codex',
        titleFa: 'استاندارد کدکس برای مرباها، ژله‌ها و مارمالادها',
        titleEn: 'Codex Standard for Jams, Jellies & Marmalades (CXS 296-2009)',
        publicationYear: '2009 (Amended 2020)',
        status: 'active_recommended',
        scopeFa: 'مقررات جهانی بریکس (حداقل ۶۰ تا ۶۵٪ بسته به کشور) و مواد افزودنی مجاز پکتینی',
        sourceId: 'src-codex-296',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-jam-brix',
        code: 'QC-JAM-PHY-01',
        category: 'physical',
        nameFa: 'مواد جامد محلول (درجه بریکس در ۲۰ درجه سلسیوس)',
        nameEn: 'Soluble Solids Content (°Brix) by Refractometry',
        parameterAnalyte: 'Brix',
        unit: '°Brix',
        minLimit: 65.0,
        targetValue: 66.0,
        methodFa: 'رفراکتومتری با رفرکتومتر چشمی یا دیجیتال کالیبره بر اساس INSO 214',
        frequency: 'each_batch',
        standardId: 'std-inso-214',
        sourceId: 'src-inso-214',
        criticality: 'critical_safety',
        notesFa: 'بریکس زیر ۶۵ درصد مستعد کپک‌زدگی سریع و مغایر استاندارد اجباری ایران است.'
      },
      {
        id: 'test-jam-reducing-sugar',
        code: 'QC-JAM-CHM-01',
        category: 'chemical',
        nameFa: 'درصد قند احیاکننده قبل از وارونگی (Reducing Sugars)',
        nameEn: 'Reducing Sugars Content (Lane-Eynon)',
        parameterAnalyte: 'Invert Sugars',
        unit: '%',
        minLimit: 30.0,
        maxLimit: 45.0,
        methodFa: 'روش تیتراسیون لین-آینون با محلول‌های فهلینگ A و B بر اساس INSO 214',
        frequency: 'each_batch',
        standardId: 'std-inso-214',
        sourceId: 'src-inso-214',
        criticality: 'major_quality',
        notesFa: 'قند احیاکننده کمتر از ۳۰٪ سبب شکرک‌زدن ناشی از تبلور ساکارز و بالاتر از ۴۵٪ سبب شکرک‌زدن گلوکزی می‌شود.'
      },
      {
        id: 'test-jam-mold',
        code: 'QC-JAM-MIC-01',
        category: 'microbial',
        nameFa: 'شمارش کپک و مخمرهای اسموفیل (قنددوست)',
        nameEn: 'Osmophilic Yeast and Mold Enumeration',
        parameterAnalyte: 'Osmophilic Yeasts',
        unit: 'CFU/g',
        maxLimit: 10,
        methodFa: 'کشت در محیط گلوکز بیسکویت آگار یا DG18 به مدت ۵ روز در ۲۵ درجه بر اساس INSO 10899',
        frequency: 'each_batch',
        standardId: 'std-inso-214',
        sourceId: 'src-inso-214',
        criticality: 'critical_safety'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-214'],
      CATALOG_SOURCES_DATABASE['src-codex-296']
    ],
    tags: ['مربا', 'توت فرنگی', 'بریکس ۶۵', 'INSO 214', 'Codex 296', 'قند احیاکننده', 'پکتین']
  },

  // 10. عسل (Honey) - عسل طبیعی خالص
  {
    id: 'prod-honey-natural-pure',
    code: 'PROD-HON-01',
    nameFa: 'عسل طبیعی زنبور عسل (چندگیاه و گون)',
    nameEn: 'Pure Natural Blossom Honey (Multifloral)',
    commercialNameFa: 'عسل طبیعی خالص کوهستان بسته‌بندی شیشه‌ای',
    category: 'honey',
    descriptionFa: 'ماده شیرین طبیعی تولید شده توسط زنبور عسل (Apis mellifera) از شهد گل‌ها که زنبورها آن را جمع‌آوری، با ترشحات ویژه خود ترکیب، آبگیری و در کندو ذخیره می‌کنند.',
    commercialFormsFa: ['جار شیشه‌ای با درب آب‌بند ۵۰۰ و ۱۰۰۰ گرمی'],
    physicalStateFa: 'viscous_paste',
    targetMatrix: 'محلول فوق‌اشباع قندهای گلوکز و فروکتوز با آنزیم‌های زنده دیاستاز و اینورتاز',
    keyCharacteristicsFa: {
      phTypical: '۳.۴۰ الی ۴.۵۰',
      brixTypical: '۸۰ الی ۸۲ درجه بریکس',
      moisturePercent: 'حداکثر ۲۰.۰ درصد (ترجیحاً کمتر از ۱۸.۵٪)',
      waterActivityTypical: '۰.۵۵ الی ۰.۶۲',
      appearanceColorFa: 'کهربایی روشن تا تیره، زلال و معطر ویژه پوشش گیاهی، بدون ذرات گردوغبار و تکه‌های کندو'
    },
    rawMaterials: [
      {
        id: 'rm-honey-comb',
        nameFa: 'شان عسل طبیعی سربسته کندو',
        nameEn: 'Capped Honeycomb Frames',
        role: 'تنها جزء و ماده اولیه فرآورده',
        typicalPercentageRange: '۱۰۰ ٪',
        qualityCriteriaFa: 'ساکارز کمتر از ۵٪، هیدروکسی متیل فورفورال (HMF) کمتر از ۴۰ mg/kg، پرولین بالای ۱۸۰ mg/kg',
        isAllergenic: false,
        standardReference: 'INSO 92'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'پولک‌تراشی و استخراج گریز از مرکز (Uncapping & Extraction)',
        nameEn: 'Uncapping & Centrifugal Honey Extraction',
        criticalParameters: 'دمای محیط ۲۵ الی ۳۰ درجه سلسیوس، استخراج بدون حرارت‌دهی مستقیم',
        equipmentFa: 'دستگاه پولک‌تراش اتوماتیک و اکستراکتور رادیال استیل ۳۱۶',
        ccpOrCqP: 'CP',
        descriptionFa: 'خارج کردن عسل از حجره‌های مومی کندو توسط نیروی گریز از مرکز بدون آسیب به شان.'
      },
      {
        stepNumber: 2,
        nameFa: 'فیلتراسیون زبر و ته‌نشینی آرام (Coarse Filtration & Settling)',
        nameEn: 'Double Filtration & Gravity Clarification',
        criticalParameters: 'صاف‌کردن از توری‌های استیل ۵۰۰ و ۲۰۰ میکرون، استراحت ۴۸ ساعته در مخزن ته‌نشینی',
        equipmentFa: 'فیلتر دوپلکس استیل و تانک ته‌نشینی رسوب‌گیر عسل',
        ccpOrCqP: 'CP',
        descriptionFa: 'صعود حباب‌های ریز هوا و ذرات موم شناور به سطح عسل و کف‌گیری کامل.'
      },
      {
        stepNumber: 3,
        nameFa: 'حرارت‌دهی ملایم ضد رسوب (Liquefaction & Gentle Warming)',
        nameEn: 'Controlled Gentle Heating (< 45 °C)',
        criticalParameters: 'دمای عسل هرگز نباید از ۴۵ درجه سلسیوس فراتر رود تا آنزیم‌ها و HMF تخریب نشوند',
        equipmentFa: 'تانک ژاکت‌دار همزن‌دار با کنترل دقیق دمای آب گرم ژاکت',
        ccpOrCqP: 'CCP',
        descriptionFa: 'ذوب کریستال‌های اولیه گلوکز به منظور افزایش روانی در خط پرکنی.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-hon-hmf',
        nameFa: 'اسپکتروفتومتر UV-Vis اندازه‌گیری HMF عسل',
        nameEn: 'UV-Visible Spectrophotometer (284 & 336 nm)',
        roleInProcessOrLab: 'laboratory_qc',
        keySpecificationFa: 'روش کارنیکولوف (Winkler / White Method) با دقت ۰.۱ ppm در طول موج‌های فرابنفش',
        maintenanceAndCalibration: 'کالیبراسیون فتومتریک با فیلتر هولمیوم اکسید سالانه'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۱۵ الی ۲۲ درجه سلسیوس در محل کاملاً تاریک و خشک',
      relativeHumidityRangeFa: 'حداکثر ۶۰ درصد (عسل به شدت رطوبت‌پذیر یا نم‌گیر است)',
      lightingProtectionFa: 'حفاظت کامل در برابر نور مستقیم خورشید برای پیشگیری از افزایش HMF',
      stackingLimitsFa: 'حداکثر ۴ کارتن در پالت',
      specialPrecautionsFa: 'درب ظروف عسل باید همواره بسته و هوابند باشد تا رطوبت محیط را جذب نکند.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'ظروف شیشه‌ای بی‌اثر بهداشتی گرید غذایی با درب فلزی پیچ‌دار غیرقابل نفوذ',
      secondaryPackagingMaterialFa: 'کارتن محافظ ۶ یا ۱۲ عددی با پوشش ضربه‌گیر',
      barrierPropertiesFa: 'ممانعت مطلق از تبادل رطوبت و اکسیژن محیطی',
      hermeticSealTestFa: 'سیل آلومینیومی القایی دهانه شیشه'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۲۴ ماه در شرایط نگهداری استاندارد',
      primaryDeteriorationMechanism: 'تخریب حرارتی فروکتوز و افزایش HMF، غیرفعال‌شدن فعالیت آنزیمی دیاستاز و ترشیدگی ناشی از مخمرهای اسموفیل در رطوبت بالای ۲۰٪',
      criticalLimitAtEndOfShelfLife: 'HMF حداکثر ۴۰ mg/kg و عدد دیاستاز حداقل ۸'
    },
    standards: [
      {
        id: 'std-inso-92',
        standardNumber: 'INSO 92',
        organization: 'INSO',
        titleFa: 'عسل - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Honey - Specifications and test methods',
        publicationYear: '1392',
        status: 'active_mandatory',
        scopeFa: 'تعیین ساکارز، قندهای احیاکننده، نسبت فروکتوز به گلوکز، HMF، فعالیت دیاستاز، پرولین و رطوبت',
        sourceId: 'src-inso-92',
        coverageType: 'general_specifications'
      },
      {
        id: 'std-codex-12',
        standardNumber: 'Codex Stan 12',
        organization: 'Codex',
        titleFa: 'استاندارد کدکس برای عسل طبیعی',
        titleEn: 'Codex Standard for Honey (CXS 12-1981)',
        publicationYear: '1981 (Revised 2001, Amended 2019)',
        status: 'active_recommended',
        scopeFa: 'مقررات جهانی عدم تغذیه مصنوعی، حد ساکارز (حداکثر ۵٪) و خلوص آنزیمی عسل',
        sourceId: 'src-codex-12',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-hon-sucrose',
        code: 'QC-HON-CHM-01',
        category: 'chemical',
        nameFa: 'درصد ساکارز (سنجش شکر افزوده / تغذیه مصنوعی)',
        nameEn: 'Sucrose Content by Lane-Eynon or HPLC',
        parameterAnalyte: 'Sucrose',
        unit: '%',
        maxLimit: 5.0,
        methodFa: 'روش هیدرولیز اسیدی و اندازه‌گیری قند احیاکننده قبل و بعد از اینورژن بر اساس INSO 92',
        frequency: 'each_batch',
        standardId: 'std-inso-92',
        sourceId: 'src-inso-92',
        criticality: 'critical_safety',
        notesFa: 'ساکارز بالاتر از ۵ درصد گواهی قطعی بر تغذیه مصنوعی زنبور با شربت قند یا تقلب است.'
      },
      {
        id: 'test-hon-hmf',
        code: 'QC-HON-CHM-02',
        category: 'chemical',
        nameFa: 'هیدروکسی متیل فورفورال (HMF)',
        nameEn: 'Hydroxymethylfurfural (HMF) Content',
        parameterAnalyte: 'HMF',
        unit: 'mg/kg (ppm)',
        maxLimit: 40.0,
        methodFa: 'روش اسپکتروفتومتری وایت (White) یا HPLC فاز معکوس مطابق INSO 92',
        frequency: 'each_batch',
        standardId: 'std-inso-92',
        sourceId: 'src-inso-92',
        criticality: 'critical_safety',
        notesFa: 'شاخص تازه بودن و عدم حرارت‌دیدگی عسل؛ عسل تازه HMF نزدیک صفر دارد.'
      },
      {
        id: 'test-hon-diastase',
        code: 'QC-HON-CHM-03',
        category: 'chemical',
        nameFa: 'فعالیت آنزیم دیاستاز (عدد شاده Schade)',
        nameEn: 'Diastase Activity (Schade Scale)',
        parameterAnalyte: 'Diastase (Amylase)',
        unit: 'DN (Diastase Number)',
        minLimit: 8.0,
        methodFa: 'هیدرولیز محلول استاندارد نشاسته و اسپکتروفتومتری در ۶۶۰ نانومتر بر اساس INSO 92',
        frequency: 'each_batch',
        standardId: 'std-inso-92',
        sourceId: 'src-inso-92',
        criticality: 'major_quality',
        notesFa: 'حساس‌ترین آنزیم شهد به حرارت؛ اثبات‌کننده طبیعی بودن عسل.'
      },
      {
        id: 'test-hon-moist',
        code: 'QC-HON-PHY-01',
        category: 'physical',
        nameFa: 'درصد رطوبت عسل با رفراکتومتر عسل چیدام (Chataway Table)',
        nameEn: 'Moisture Content by Refractometry (Wedmore Method)',
        parameterAnalyte: 'Moisture',
        unit: '%',
        maxLimit: 20.0,
        methodFa: 'اندازه‌گیری ضریب شکست در ۲۰ درجه و استخراج رطوبت از جدول چاتوی مطابق INSO 92',
        frequency: 'each_batch',
        standardId: 'std-inso-92',
        sourceId: 'src-inso-92',
        criticality: 'major_quality',
        notesFa: 'رطوبت بالای ۲۰٪ به سرعت سبب تخمیر و ترشیدگی عسل توسط مخمرهای اسموفیل می‌شود.'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-92'],
      CATALOG_SOURCES_DATABASE['src-codex-12']
    ],
    tags: ['عسل', 'عسل طبیعی', 'ساکارز', 'HMF', 'دیاستاز', 'INSO 92', 'Codex 12']
  },

  // 11. شکلات (Chocolate) - شکلات تلخ و شیری
  {
    id: 'prod-choc-dark-bar',
    code: 'PROD-CHO-01',
    nameFa: 'شکلات تلخ تخته‌ای ۷۰٪ کاکائو (Dark Chocolate)',
    nameEn: '70% Cocoa Real Dark Chocolate Bar',
    commercialNameFa: 'شکلات تخته‌ای تلخ خالص پذیرایی',
    category: 'chocolate',
    descriptionFa: 'فرآورده حاصل از ترکیب دقیق لیکور کاکائو (خمیر کاکائو)، کره کاکائو خالص، شکر و لسیتین که مراحل تصفیه ذرات، کونچینگ طولانی و تمپرینگ دقیق را طی کرده است.',
    commercialFormsFa: ['تخته‌های ۸۰ و ۱۰۰ گرمی در بسته‌بندی آلومینیومی و کارتن'],
    physicalStateFa: 'solid',
    targetMatrix: 'سوسپانسیون بسیار ریز ذرات شکر و کاکائو (زیر ۲۵ میکرون) در فاز پیوسته کره کاکائو در فاز کریستالی فرم بتا V',
    keyCharacteristicsFa: {
      moisturePercent: 'حداکثر ۱.۵ درصد',
      fatPercent: 'حداقل ۳۵.۰ درصد (تماماً کره کاکائو بدون چربی‌های جانشین CBS)',
      appearanceColorFa: 'قهوه‌ای تیره براق و درخشان، شکست صوتی مشخص (Snap) در دمای ۲۰ درجه'
    },
    rawMaterials: [
      {
        id: 'rm-choc-liquor',
        nameFa: 'لیکور کاکائو خالص (جرم کاکائو Cocoa Mass)',
        nameEn: 'Pure Cocoa Liquor / Mass',
        role: 'تأمین طعم اصیل تلخ کاکائو و فلاونوئیدها',
        typicalPercentageRange: '۵۵ الی ۶۰ ٪',
        qualityCriteriaFa: 'چربی طبیعی کاکائو بین ۵۰ الی ۵۴ درصد، اسیدیته ملایم، اندازه ذرات میکرونیزه',
        isAllergenic: false,
        standardReference: 'INSO 608'
      },
      {
        id: 'rm-choc-butter',
        nameFa: 'کره کاکائو طبیعی دئودورایز (Cocoa Butter)',
        nameEn: 'Deodorized Pure Cocoa Butter',
        role: 'ایجاد ذوب دهانی لطیف در دمای بدن (۳۴-۳۶ درجه) و بافت شکننده براق',
        typicalPercentageRange: '۱۰ الی ۱۵ ٪',
        qualityCriteriaFa: 'اسیدیته زیر ۱.۵٪، عدد صابونی ۱۹۰-۲۰۰، ضریب شکست ۱.۴۵۶',
        isAllergenic: false,
        standardReference: 'INSO 608'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'تصفیه و ریزکردن ذرات در ریفاینر ۵ غلتکی (Refining)',
        nameEn: 'Five-Roll Refining',
        criticalParameters: 'کاهش اندازه ذرات به کمتر از ۲۰ الی ۲۵ میکرون (زیر آستانه زبری زبان انسان)',
        equipmentFa: 'ریفاینر هیدرولیک پنج غلتکی سرد شونده با آب',
        ccpOrCqP: 'CP',
        descriptionFa: 'پودر کردن مکانیکی ذرات شکر و کاکائو جهت رسیدن به بافت دهانی مخملی.'
      },
      {
        stepNumber: 2,
        nameFa: 'کونچینگ طولانی در دمای بالا (Conching)',
        nameEn: 'Longitudinal Dry & Wet Conching',
        criticalParameters: 'دما: ۷۵ الی ۸۵ درجه سلسیوس، زمان: ۱۲ الی ۲۴ ساعت، خروج اسیدهای فرار نامطبوع',
        equipmentFa: 'دستگاه کونچ ۴ محوره صنعتی شکلات',
        ccpOrCqP: 'CP',
        descriptionFa: 'پوشش‌دهی کامل ذرات شکر با لایه چربی، تبخیر رطوبت باقیمانده و توسعه طعم غنی شکلات.'
      },
      {
        stepNumber: 3,
        nameFa: 'تمپرینگ دقیق حرارتی چندمرحله‌ای (Tempering)',
        nameEn: 'Continuous Three-Stage Tempering',
        criticalParameters: 'سرمایش تا ۲۷ درجه جهت تشکیل کریستال‌ها، گرم‌کردن مجدد تا ۳۱.۵ درجه جهت حفظ فرم بتا V',
        equipmentFa: 'دستگاه تمپرینگ پیوسته اتوماتیک مجهز به تمپرمتر آنلاین',
        ccpOrCqP: 'CCP',
        descriptionFa: 'حذف فرم‌های کریستالی ناپایدار چربی جهت ممانعت از سفیدک‌زدن (Fat Bloom) و ایجاد جلای براق.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-choc-tempermeter',
        nameFa: 'تمپرمتر دیجیتال پرتابل شکلات (Chocolate Temper Meter)',
        nameEn: 'Sollich Chocolate Temper Meter',
        roleInProcessOrLab: 'laboratory_qc',
        keySpecificationFa: 'ثبت منحنی سرمایش ترمودینامیکی و تعیین شیب تمپر و ایندکس تمپرینگ (TI = 4-6)',
        maintenanceAndCalibration: 'کالیبراسیون ترمیستورها هر ۳ ماه'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۱۵ الی ۱۸ درجه سلسیوس (دمای بهینه شکلات)',
      relativeHumidityRangeFa: 'حداکثر ۵۰ درصد',
      lightingProtectionFa: 'عدم نگهداری در معرض نور و گرما',
      stackingLimitsFa: 'حداکثر ۶ کارتن در پالت',
      specialPrecautionsFa: 'نوسانات حرارتی محیط موجب مهاجرت کریستال‌های چربی به سطح و پدیده سفیدک چربی (Fat Bloom) می‌شود.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'فویل آلومینیوم پشت روکش‌دار طلایی/نقره‌ای جهت جلوگیری از فرار عطر',
      secondaryPackagingMaterialFa: 'جعبه مقوایی لمینت‌دار کرافت با چاپ افست بدون بو',
      barrierPropertiesFa: 'نفوذناپذیری کامل نسبت به بوهای خارجی انبار و بخار آب',
      hermeticSealTestFa: 'تست تست تاخوردگی هرمتیک فویل آلومینیوم'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۱۸ الی ۲۴ ماه برای شکلات تلخ',
      primaryDeteriorationMechanism: 'پدیده شکوفایی چربی (بلوم چربی)، اکسیداسیون چربی در معرض نور، یا جذب بوهای خارجی',
      criticalLimitAtEndOfShelfLife: 'عدد پراکسید چربی زیر ۱.۵ meq/kg، حفظ بافت شکست صوتی'
    },
    standards: [
      {
        id: 'std-inso-608',
        standardNumber: 'INSO 608',
        organization: 'INSO',
        titleFa: 'شکلات - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Chocolate - Specifications and test methods',
        publicationYear: '1398',
        status: 'active_mandatory',
        scopeFa: 'تعیین درصد کاکائو، چربی شیر، کره کاکائو، خاکستر، رطوبت و ممنوعیت چربی‌های حیوانی غیرمجاز',
        sourceId: 'src-inso-608',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-choc-fat',
        code: 'QC-CHO-CHM-01',
        category: 'chemical',
        nameFa: 'درصد چربی کل شکلات (Total Fat Content)',
        nameEn: 'Total Fat Content by Soxhlet Extraction',
        parameterAnalyte: 'Total Fat',
        unit: '%',
        minLimit: 35.0,
        methodFa: 'هضم اسیدی با HCl 4N و استخراج سوکسله با پترولیوم اتر مطابق INSO 608',
        frequency: 'each_batch',
        standardId: 'std-inso-608',
        sourceId: 'src-inso-608',
        criticality: 'major_quality'
      },
      {
        id: 'test-choc-particle',
        code: 'QC-CHO-PHY-01',
        category: 'physical',
        nameFa: 'اندازه ذرات جامد شکلات با میکرومتر دستی (Fineness by Micrometer)',
        nameEn: 'Particle Size Distribution (< 25 microns)',
        parameterAnalyte: 'Particle Size (Fineness)',
        unit: 'µm (میکرون)',
        maxLimit: 25.0,
        targetValue: 20.0,
        methodFa: 'سنجش با میکرومتر دیجیتال با دقت ۱ میکرون در روغن پارافین بر اساس INSO 608',
        frequency: 'each_batch',
        standardId: 'std-inso-608',
        sourceId: 'src-inso-608',
        criticality: 'major_quality',
        notesFa: 'ذرات بالاتر از ۳۰ میکرون حس زبری ماسه‌ای (Grittiness) زیر زبان ایجاد می‌کنند.'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-608']
    ],
    tags: ['شکلات', 'کاکائو', 'INSO 608', 'تمپرینگ', 'کره کاکائو', 'کونچینگ']
  },

  // 12. بستنی (Ice Cream) - بستنی شیری وانیلی
  {
    id: 'prod-ice-vanilla-dairy',
    code: 'PROD-ICE-01',
    nameFa: 'بستنی شیری وانیلی قالبی و چوبی (Vanilla Dairy Ice Cream)',
    nameEn: 'Vanilla Dairy Ice Cream Bar & Tub',
    commercialNameFa: 'بستنی شیری پرچرب وانیلی سنتی و صنعتی',
    category: 'ice_cream',
    descriptionFa: 'فرآورده منجمد هوادهی‌شده حاصل از پاستوریزاسیون و انجماد همزمان مخلوط شیر، خامه، شکر، شیر خشک بدون چربی و پایدارکننده‌ها که دارای حباب‌های ریز هوا و کریستال‌های بسیار ریز یخ است.',
    commercialFormsFa: ['بستنی چوبی با روکش کاکائویی', 'ظروف لیوانی و خانوادگی پلی‌پروپیلنی'],
    physicalStateFa: 'semi_solid',
    targetMatrix: 'فوم کلوئیدی پیچیده سه‌فازی شامل کریستال‌های یخ، گلبول‌های چربی نیمه‌کریستالی، حباب‌های هوا و محلول قندی فوق‌سرد',
    keyCharacteristicsFa: {
      moisturePercent: '۶۰.۰ الی ۶۵.۰ درصد',
      fatPercent: 'حداقل ۸.۰ الی ۱۰.۰ درصد چربی شیر',
      proteinPercent: 'حداقل ۳.۵ درصد',
      ashPercent: 'حدود ۰.۸ درصد',
      appearanceColorFa: 'سفید عاجی یکنواخت، بافت کرمی نرم و لطیف بدون احساس شنی و زبری کریستال یخ'
    },
    rawMaterials: [
      {
        id: 'rm-ice-cream-milk',
        nameFa: 'خامه تازه پاستوریزه ۳۰٪ و شیر تازه گاو',
        nameEn: 'Fresh Pasteurized Cream 30% & Whole Milk',
        role: 'تأمین چربی شیر، بافت نرم و مقاومت به ذوب',
        typicalPercentageRange: '۶۵ الی ۷۵ ٪',
        qualityCriteriaFa: 'اسیدیته دورنیک زیر ۱۵، عاری از هرگونه بوی ترشیدگی و اکسیداسیون',
        isAllergenic: true,
        allergenType: 'شیر و فرآورده‌های شیری',
        standardReference: 'INSO 2450'
      },
      {
        id: 'rm-ice-stabilizer',
        nameFa: 'مخلوط پایدارکننده و امولسیفایر بستنی (مونوگلیسیرید، گوار، کاراگینان)',
        nameEn: 'Ice Cream Stabilizer & Emulsifier Blend',
        role: 'کنترل رشد کریستال‌های یخ، تثبیت کف و افزایش مقاومت به آب‌شدن',
        typicalPercentageRange: '۰.۳ الی ۰.۵ ٪',
        qualityCriteriaFa: 'گرید خوراکی فاقد بو، حلالیت کامل در دمای بالای ۷۰ درجه',
        isAllergenic: false
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'آماده‌سازی مخلوط پایه (میکس بستنی) و پاستوریزاسیون',
        nameEn: 'Mix Preparation & High-Temp Pasteurization',
        criticalParameters: 'پاستوریزاسیون در ۸۰ الی ۸۳ درجه به مدت ۲۰ الی ۲۵ ثانیه',
        equipmentFa: 'تانک میکس ژاکت‌دار همزن‌دار و پاستوریزاتور صفحه‌ای استیل',
        ccpOrCqP: 'CCP',
        descriptionFa: 'حل‌کردن شکر و پایدارکننده‌ها و نابودی پاتوژن‌های بالقوه شیر.'
      },
      {
        stepNumber: 2,
        nameFa: 'هموژنیزاسیون دو مرحله‌ای فشار بالا',
        nameEn: 'Two-Stage Homogenization',
        criticalParameters: 'فشار کل: ۲۰۰ بار (مرحله اول ۱۶۰ بار، مرحله دوم ۴۰ بار)',
        equipmentFa: 'هموژنایزر فشار قوی پیستونی استیل',
        ccpOrCqP: 'CP',
        descriptionFa: 'خرد کردن گلبول‌های چربی و پوشش‌دهی آن‌ها توسط پروتئین‌های شیر جهت جلوگیری از کره‌ای‌شدن در فریزر.'
      },
      {
        stepNumber: 3,
        nameFa: 'رسیدن مخلوط بستنی در سرما (Aging)',
        nameEn: 'Mix Aging at 4 °C for 4-24 Hours',
        criticalParameters: 'دمای نگهداری ۲ الی ۴ درجه سلسیوس، زمان ماند: حداقل ۴ ساعت',
        equipmentFa: 'تانک‌های استیل نگهداری ایجینگ با همزن دور آرام',
        ccpOrCqP: 'CP',
        descriptionFa: 'کریستالیزاسیون چربی شیر و هیدراتاسیون کامل هیدروکلوئیدها و پروتئین‌ها.'
      },
      {
        stepNumber: 4,
        nameFa: 'انجماد مداوم و هوادهی در فریزر دینامیک (Continuous Freezing & Overrun)',
        nameEn: 'Dynamic Continuous Freezing with Air Injection',
        criticalParameters: 'دمای خروج بستنی: منفی ۵ الی منفی ۶ درجه، کنترل هوادهی (Overrun) بین ۸۰ الی ۱۰۰ درصد',
        equipmentFa: 'فریزر پیوسته بستنی (Continuous Freezer) با تیغه‌های تراشنده و پمپ هوا',
        ccpOrCqP: 'CP',
        descriptionFa: 'انجماد سریع آب به کریستال‌های یخ میکرونی (زیر ۳۰ میکرون) و پخش یکنواخت حباب‌های هوا.'
      },
      {
        stepNumber: 5,
        nameFa: 'سخت‌شدن انجمادی در تونل انجماد سریع (Hardening Tunnel)',
        nameEn: 'Deep Freeze Hardening Tunnel at -40 °C',
        criticalParameters: 'دمای تونل: منفی ۳۵ الی منفی ۴۰ درجه سلسیوس، رسیدن دمای مغز بستنی به منفی ۱۸ درجه',
        equipmentFa: 'تونل سریع انجماد باد وزشی (Blast Hardening Tunnel)',
        ccpOrCqP: 'CCP',
        descriptionFa: 'انجماد فوری باقیمانده آب آزاد جهت جلوگیری قطعی از رشد کریستال‌های یخ و زبری بافت.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-ice-freezer',
        nameFa: 'فریزر مداوم برودتی پیوسته بستنی با کمپرسور آمونیاک/فرئون',
        nameEn: 'Continuous Ice Cream Freezer with Scraped Surface',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'ظرفیت ۱۲۰۰ لیتر بر ساعت، سیستم تزریق هوای فیلتردار استریل با دبی‌سنج جرمی',
        maintenanceAndCalibration: 'کالیبراسیون سنسورهای فشار و جریان هوا ماهانه'
      }
    ],
    storageConditions: {
      temperatureRangeFa: 'منفی ۱۸ الی منفی ۲۵ درجه سلسیوس (زنجیره انجماد عمیق مداوم)',
      relativeHumidityRangeFa: 'بدون رطوبت نسبی آزاد',
      lightingProtectionFa: 'عدم تابش مستقیم نور خورشید و گرما',
      stackingLimitsFa: 'حداکثر ۵ ردیف کارتن در پالت در سردخانه زیر صفر',
      specialPrecautionsFa: 'نوسانات حتی ۲ درجه‌ای دما در فریزر فروشگاه موجب پدیده ذوب مجدد و بازکریستالیزاسیون کریستال‌های درشت یخ و زبری شنی بافت می‌گردد.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'کاغذ مومی / فیلم‌های پلی‌پروپیلنی چاپ‌شده فلوپک یا ظروف پلی‌پروپیلن (PP) دوجداره تزریقی',
      secondaryPackagingMaterialFa: 'کارتن سه لایه کنگره‌دار فریزری',
      barrierPropertiesFa: 'مقاومت کامل در برابر جذب بوهای نامطبوع سردخانه زیر صفر',
      hermeticSealTestFa: 'تست تست دوخت حرارتی سلفون فلوپک'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۱۲ ماه در دمای منفی ۱۸ درجه سلسیوس مداوم',
      primaryDeteriorationMechanism: 'پدیده شوک دمایی، کریستالیزاسیون مجدد لاکتوز (بافت شنی Sandiness) و از دست رفتن هوای بافت (انقباض Shrinkage)',
      criticalLimitAtEndOfShelfLife: 'فاقد کریستال‌های یخ درشت لمس‌پذیر و عدم تغییر شکل ساختار بسته'
    },
    standards: [
      {
        id: 'std-inso-2450',
        standardNumber: 'INSO 2450',
        organization: 'INSO',
        titleFa: 'بستنی - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Ice cream - Specifications and test methods',
        publicationYear: '1395',
        status: 'active_mandatory',
        scopeFa: 'تعیین درصد چربی، ماده خشک، پروتئین، اورران (میزان هوادهی)، باقیمانده میکروبی و آزمون‌های فسفاتاز',
        sourceId: 'src-inso-2450',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-ice-overrun',
        code: 'QC-ICE-PHY-01',
        category: 'physical',
        nameFa: 'درصد افزایش حجم ناشی از هوادهی (اورران Overrun)',
        nameEn: 'Overrun Percentage by Gravimetric Method',
        parameterAnalyte: 'Overrun',
        unit: '%',
        minLimit: 60.0,
        maxLimit: 100.0,
        targetValue: 80.0,
        methodFa: 'توزین حجم مشخصی از مخلوط مایع و همان حجم بستنی منجمد شده بر اساس فرمول استاندارد INSO 2450',
        frequency: 'each_batch',
        standardId: 'std-inso-2450',
        sourceId: 'src-inso-2450',
        criticality: 'major_quality',
        notesFa: 'اورران بسیار پایین سبب بافت سنگین خمیری و اورران بسیار بالا سبب احساس بافت برفی ناپایدار می‌شود.'
      },
      {
        id: 'test-ice-fat',
        code: 'QC-ICE-CHM-01',
        category: 'chemical',
        nameFa: 'درصد چربی کل بستنی شیری',
        nameEn: 'Fat Content by Gerber Method for Ice Cream',
        parameterAnalyte: 'Milk Fat',
        unit: '%',
        minLimit: 8.0,
        methodFa: 'روش بوتیرومتری ژربر با آمیل الکل و اسید سولفوریک بر اساس INSO 2450',
        frequency: 'each_batch',
        standardId: 'std-inso-2450',
        sourceId: 'src-inso-2450',
        criticality: 'standard_compliance'
      },
      {
        id: 'test-ice-coliform',
        code: 'QC-ICE-MIC-01',
        category: 'microbial',
        nameFa: 'شمارش باکتری‌های کلی‌فرم در بستنی',
        nameEn: 'Coliforms Enumeration at 30 °C',
        parameterAnalyte: 'Coliforms',
        unit: 'CFU/g',
        maxLimit: 10,
        methodFa: 'پورپلیت با محیط ویولت رد بایل آگار (VRBL) مطابق INSO 2408',
        frequency: 'each_batch',
        standardId: 'std-inso-2450',
        sourceId: 'src-inso-2450',
        criticality: 'critical_safety'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-2450']
    ],
    tags: ['بستنی', 'شیر', 'خامه', 'INSO 2450', 'اورران', 'چربی شیر', 'انجماد پیوسته']
  }
];
