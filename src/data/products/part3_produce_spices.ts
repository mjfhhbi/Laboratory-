import { FoodCatalogProduct } from '../../types/foodProductsCatalog';
import { CATALOG_SOURCES_DATABASE } from './catalogSources';

export const PART3_PRODUCTS: FoodCatalogProduct[] = [
  // 13. میوه و سبزی (Fruits & Vegetables) - رب گوجه‌فرنگی
  {
    id: 'prod-fruit-veg-tomato-paste',
    code: 'PROD-VEG-01',
    nameFa: 'رب گوجه‌فرنگی تغلیظ‌شده در خلاء (Tomato Paste)',
    nameEn: 'Concentrated Tomato Paste (Hot Break & Cold Break)',
    commercialNameFa: 'رب گوجه‌فرنگی بریکس ۲۸-۳۰ قوطی فلزی و اسپتیک',
    category: 'fruits_vegetables',
    descriptionFa: 'فرآورده به دست آمده از آبگیری گوجه‌فرنگی تازه و سالم پس از جداسازی پوست و بذر و تغلیظ در دیگ‌های اواپراتور تحت خلاء مداوم با یا بدون افزودن نمک طعام استاندارد.',
    commercialFormsFa: ['قوطی فلزی ایزی اوپن ۸۰۰ گرمی لاک‌خورده', 'کیسه آسپتیک ۲۲۰ لیتری بشکه‌ای'],
    physicalStateFa: 'viscous_paste',
    targetMatrix: 'شبکه غلیظ ژلی سرشار از لیکوپن طبیعی، پکتین و مواد جامد محلول میوه گوجه‌فرنگی',
    keyCharacteristicsFa: {
      phTypical: '۴.۱۰ الی ۴.۳۵',
      brixTypical: 'حداقل ۲۸.۰ الی ۳۰.۰ درصد (بدون نمک)',
      saltPercent: 'حداکثر ۲.۰ درصد نمک افزوده خوراکی',
      ashPercent: 'حدود ۲.۵ الی ۳.۰ درصد',
      appearanceColorFa: 'قرمز زنده خوش‌رنگ طبیعی (شاخص رنگ لاویباند یا هانتر a/b بالاتر از ۱.۹)',
      waterActivityTypical: '۰.۹۰ الی ۰.۹۳'
    },
    rawMaterials: [
      {
        id: 'rm-tomato-fresh',
        nameFa: 'گوجه‌فرنگی تازه صنعتی واریته گوشتی (هیبرید)',
        nameEn: 'Processing Tomatoes (Lycopersicon esculentum)',
        role: 'ماده اولیه پایه',
        typicalPercentageRange: '۱۰۰ ٪',
        qualityCriteriaFa: 'بریکس طبیعی بالای ۴.۸، عاری از کپک‌زدگی، ترشیدگی و نارس بودن',
        isAllergenic: false,
        standardReference: 'INSO 761'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'شستشوی چند مرحله‌ای و سورتینگ روی نوار نقاله',
        nameEn: 'Flume Washing & Roller Sorting',
        criticalParameters: 'کلرزنی آب شستشو ۵-۱۰ ppm، حذف کامل گوجه‌های پوسیده و آسیب‌دیده',
        equipmentFa: 'حوضچه شستشوی حباب‌دار و نوار نقاله غلتکی بازرسی چشمی',
        ccpOrCqP: 'CP',
        descriptionFa: 'جداسازی خاک، گل و گوجه‌های دارای لکه‌های قارچی آلترناریا و پوسیدگی سیاه.'
      },
      {
        stepNumber: 2,
        nameFa: 'خردکردن و حرارت‌دهی مقدماتی هات‌بریک (Hot Break)',
        nameEn: 'Chopping & Hot Break Thermal Inactivation',
        criticalParameters: 'دمای هات‌بریک: ۹۰ الی ۹۵ درجه سلسیوس ظرف کمتر از ۳۰ ثانیه',
        equipmentFa: 'کراشر و سیستم حرارت‌دهی مبدل لوله‌ای هات‌بریک',
        ccpOrCqP: 'CCP',
        descriptionFa: 'غیرفعال‌سازی فوری آنزیم‌های تجزیه‌کننده پکتین (پلی‌گالاکتوروناز و پکتین متیل استراز) جهت ایجاد ویسکوزیته بسیار بالا در رب نهایی.'
      },
      {
        stepNumber: 3,
        nameFa: 'پالپ‌گیری و تصفیه دو مرحله‌ای (Pulper & Finisher)',
        nameEn: 'Two-Stage Turbo Pulper & Finisher',
        criticalParameters: 'سایز توری فینیشر: ۰.۴ الی ۰.۶ میلی‌متر',
        equipmentFa: 'پالپر سانتریفیوژ دوربالا و فینیشر توری استیل',
        ccpOrCqP: 'CP',
        descriptionFa: 'جداسازی ۱۰۰٪ پوست و بذر و خروج پوره یکدست و نرم گوجه‌فرنگی.'
      },
      {
        stepNumber: 4,
        nameFa: 'تغلیظ در اواپراتور چندمرحله‌ای تحت خلاء (Continuous Vacuum Evaporation)',
        nameEn: 'Multiple-Effect Falling Film Vacuum Evaporation',
        criticalParameters: 'دمای جوش ۵۵ الی ۶۵ درجه تحت خلاء، ممانعت از کاراملیزاسیون',
        equipmentFa: 'اواپراتور چند اثره (سه اثره) مجهز به سیستم بازیابی بخار MVR/TVR',
        ccpOrCqP: 'CP',
        descriptionFa: 'تبخیر سریع آب اضافی در دمای پایین جهت حفظ لیکوپن و ویتامین ث و رسیدن به بریکس ۲۸ الی ۳۰.'
      },
      {
        stepNumber: 5,
        nameFa: 'پاستوریزاسیون لوله‌ای، پرکنی داغ و درب‌بندی (Hot Fill at 90 °C)',
        nameEn: 'Tubular Pasteurization & Hermetic Seaming',
        criticalParameters: 'دما: ۹۲ الی ۹۵ درجه، پرکنی در حداقل ۸۸ درجه، چرخش قوطی برای ضدعفونی درب',
        equipmentFa: 'پاستوریزاتور لوله در لوله، پرکن پیستونی روتاری و درب‌بند قوطی فلزی',
        ccpOrCqP: 'CCP',
        descriptionFa: 'استریلیزاسیون تجاری برای مهار کپک‌ها، مخمرها و باکتری‌های اسیددوست.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-tom-howard',
        nameFa: 'اسلاید و میکروسکوپ هوارد شمارش کپک (Howard Mold Counter)',
        nameEn: 'Howard Mold Chamber & Microscope',
        roleInProcessOrLab: 'laboratory_qc',
        keySpecificationFa: 'سلول شمارش شیشه‌ای استاندارد با ضخامت خط رتیکول ۰.۱ میلی‌متر و بزرگ‌نمایی ۱۰۰ برابر',
        maintenanceAndCalibration: 'کالیبراسیون لنز و خط‌کش میکرومتر چشمی'
      },
      {
        id: 'eq-tom-bostwick',
        nameFa: 'کانسیستومتر بوست‌ویک سنجش ویسکوزیته (Bostwick Consistometer)',
        nameEn: 'Bostwick Consistometer (cm/30s)',
        roleInProcessOrLab: 'laboratory_qc',
        keySpecificationFa: 'بدنه استیل مندرج با دریچه جهشی، اندازه‌گیری میزان پیشروی خمیر در ۳۰ ثانیه در ۲۰ درجه',
        maintenanceAndCalibration: 'تراز نمودن حباب شیشه‌ای قبل از هر آزمایش'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۱۵ الی ۲۵ درجه سلسیوس در انبار سرپوشیده و خشک',
      relativeHumidityRangeFa: 'حداکثر ۶۵ درصد',
      lightingProtectionFa: 'به دلیل بسته‌بندی در قوطی فلزی محافظت نوری کامل دارد',
      stackingLimitsFa: 'حداکثر ۴ ردیف پالت',
      specialPrecautionsFa: 'پس از باز کردن قوطی، حتماً محتویات به ظرف شیشه‌ای منتقل و در یخچال نگهداری شود.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'قوطی فلزی سه تکه قلع‌اندود با پوشش داخلی لاک اپوکسی ضد اسیدسیتریک (Acid Resistant Lacquer)',
      secondaryPackagingMaterialFa: 'شرینک نایلونی ۱۲ عددی با کفی کارتن',
      barrierPropertiesFa: 'نفوذناپذیری مطلق به اکسیژن و بخار آب',
      hermeticSealTestFa: 'تست تست درزبندی میکرومتری دوبل قوطی فلزی'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۲۴ ماه از تاریخ تولید',
      primaryDeteriorationMechanism: 'خوردگی لاک داخلی در صورت وجود نقص اپوکسی، ایجاد رنگ قهوه‌ای تیره یا بادکردگی هیدروژنی',
      criticalLimitAtEndOfShelfLife: 'آهن محلول کمتر از ۱۵ ppm، قلع زیر ۱۵۰ ppm و عدد هوارد زیر ۴۰٪'
    },
    standards: [
      {
        id: 'std-inso-761',
        standardNumber: 'INSO 761',
        organization: 'INSO',
        titleFa: 'رب گوجه‌فرنگی - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Tomato paste - Specifications and test methods',
        publicationYear: '1397',
        status: 'active_mandatory',
        scopeFa: 'حداقل بریکس خالص، نسبت رنگ a/b، عدد شمارش کپک هوارد (HMC)، فلزات سنگین و قندها',
        sourceId: 'src-inso-761',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-tom-howard',
        code: 'QC-TOM-MIC-01',
        category: 'microbial',
        nameFa: 'شمارش کپک به روش هوارد (Howard Mold Count - HMC)',
        nameEn: 'Howard Mold Count (HMC)',
        parameterAnalyte: 'Mold Hyphae Percentage',
        unit: '% فیلدهای مثبت',
        maxLimit: 40.0,
        methodFa: 'رقیق‌سازی نمونه تا بریکس ۸ و بررسی ۲۵ الی ۵۰ میدان دید میکروسکوپی مطابق INSO 761 و AOAC 965.41',
        frequency: 'each_batch',
        standardId: 'std-inso-761',
        sourceId: 'src-inso-761',
        criticality: 'critical_safety',
        notesFa: 'مهم‌ترین شاخص بهداشتی کیفیت گوجه اولیه؛ عدد بالای ۴۰٪ تخلف بهداشتی و نشان‌دهنده مصرف گوجه کپک‌زده است.'
      },
      {
        id: 'test-tom-brix',
        code: 'QC-TOM-PHY-01',
        category: 'physical',
        nameFa: 'درجه بریکس خالص بدون نمک (Soluble Solids Content)',
        nameEn: 'Natural Tomato Soluble Solids (NTSS °Brix)',
        parameterAnalyte: 'Refractometric Brix',
        unit: '°Brix',
        minLimit: 28.0,
        targetValue: 29.0,
        methodFa: 'سنجش بریکس با رفرکتومتر و کسر درصد نمک اندازه‌گیری شده بر اساس INSO 761',
        frequency: 'each_batch',
        standardId: 'std-inso-761',
        sourceId: 'src-inso-761',
        criticality: 'critical_safety'
      },
      {
        id: 'test-tom-color',
        code: 'QC-TOM-PHY-02',
        category: 'physical',
        nameFa: 'شاخص رنگ (نسبت a/b هانترلب یا لاویباند)',
        nameEn: 'Color Index Ratio (a*/b*)',
        parameterAnalyte: 'Color Ratio a/b',
        minLimit: 1.85,
        targetValue: 2.05,
        methodFa: 'اسپکتروفتومتری بازتابی هانترلب (HunterLab) در طول موج مشخص بر اساس INSO 761',
        frequency: 'each_batch',
        standardId: 'std-inso-761',
        sourceId: 'src-inso-761',
        criticality: 'major_quality'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-761']
    ],
    tags: ['رب گوجه', 'میوه و سبزی', 'INSO 761', 'هوارد', 'بریکس ۲۸', 'هات بریک', 'بوست ویک']
  },

  // 14. حبوبات (Pulses & Legumes) - عدس و نخود بسته‌بندی
  {
    id: 'prod-pulse-lentils-packaged',
    code: 'PROD-PUL-01',
    nameFa: 'عدس سبز و نخود پاک‌شده و بوجاری‌شده درجه یک',
    nameEn: 'Sorted & Cleaned Green Lentils and Chickpeas',
    commercialNameFa: 'عدس سبز پاک‌شده اعلا بسته‌بندی سلوفانی',
    category: 'pulses_legumes',
    descriptionFa: 'دانه‌های پاک‌شده، سورت‌شده، پولیش‌خورده و عاری از سنگ و ناخالصی گیاه لنس کولیناریس (عدس) که در شرایط بهداشتی بسته‌بندی شده است.',
    commercialFormsFa: ['بسته سلفونی شفاف پنجره‌دار ۹۰۰ گرمی'],
    physicalStateFa: 'solid',
    targetMatrix: 'دانه‌های نشاسته‌ای-پروتئینی حبوبات خشک با پوسته سلولزی مقاوم',
    keyCharacteristicsFa: {
      moisturePercent: 'حداکثر ۱۲.۰ درصد',
      proteinPercent: '۲۲.۰ الی ۲۶.۰ درصد',
      appearanceColorFa: 'سبز مایل به قهوه‌ای طبیعی، دانه‌های درشت یکنواخت، بدون سوراخ‌شدگی آفت و چروکیدگی'
    },
    rawMaterials: [
      {
        id: 'rm-pulse-raw',
        nameFa: 'عدس سبز درشت مزارع دیم/آبی',
        nameEn: 'Raw Green Lentils (Lens culinaris)',
        role: 'ماده اولیه اصلی',
        typicalPercentageRange: '۱۰۰ ٪',
        qualityCriteriaFa: 'رطوبت زیر ۱۳٪، عاری از زنده بودن آفت، دانه‌های آسیب‌دیده زیر ۲٪',
        isAllergenic: false,
        standardReference: 'INSO 295'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'بوجاری مکانیکی و سنگ‌گیری تحت خلاء',
        nameEn: 'Mechanical Sifting & Gravity Destoning',
        criticalParameters: 'حذف ۱۰۰٪ سنگ‌ریزه‌ها، کلوخ، شیشه و فلزات',
        equipmentFa: 'دستگاه سنگ‌گیر گرانشی (Destoner) و سرندهای ارتعاشی چندطبقه',
        ccpOrCqP: 'CCP',
        descriptionFa: 'جداسازی بر اساس اختلاف چگالی و غربال‌گری سایز دانه‌ها.'
      },
      {
        stepNumber: 2,
        nameFa: 'سورتینگ نوری هوشمند (Color Sorter)',
        nameEn: 'Optical Color Sorting',
        criticalParameters: 'شناسایی و پرتاب دانه‌های لکه‌دار، سیاه، تغییررنگ‌یافته توسط باد فشرده',
        equipmentFa: 'سورتر نوری تمام اتوماتیک مجهز به دوربین‌های CCD با رزولوشن بالا',
        ccpOrCqP: 'CP',
        descriptionFa: 'ارتقای یکدستی محصول و تفکیک هرگونه دانه آفت‌زده یا معیوب.'
      },
      {
        stepNumber: 3,
        nameFa: 'پولیش و غبارگیری خشک',
        nameEn: 'Dry Polishing & Dedusting',
        criticalParameters: 'صیقل‌دادن سطح دانه‌ها بدون مصرف هرگونه ماده شیمیایی',
        equipmentFa: 'دستگاه پولیش برسی غلتکی و سیستم مکنده غبار فیلتردار',
        ccpOrCqP: 'CP',
        descriptionFa: 'درخشان‌سازی طبیعی پوست دانه و عاری‌سازی از گردوخاک.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-pul-destoner',
        nameFa: 'دستگاه سنگ‌گیر گرانشی ارتعاشی صنعتی',
        nameEn: 'Vibratory Gravity Destoner',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'ظرفیت ۲ تن در ساعت با جریان هوای تنظیم‌پذیر و شیب ارتعاشی دقیق',
        maintenanceAndCalibration: 'تخلیه مداوم محفظه سنگ و تنظیم ماهانه شیب و دمش هوا'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۱۵ الی ۲۰ درجه سلسیوس در انبار خنک، خشک و دارای تهویه',
      relativeHumidityRangeFa: 'حداکثر ۵۵ درصد',
      lightingProtectionFa: 'عدم تابش مستقیم نور شدید جهت پیشگیری از کدرشدن و قهوه‌ای‌شدن رنگ دانه',
      stackingLimitsFa: 'حداکثر ۸ بسته در کارتن، پالت‌چینی با فاصله مناسب از دیوار',
      specialPrecautionsFa: 'اجرای تدابیر دوره‌ای ضدعفونی گازدهی (فومیگاسیون فسفین) در صورت نیاز.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'فیلم پلی‌پروپیلن دولایه شفاف بیوپت (BOPP/CPP) با دوخت حرارتی عریض',
      secondaryPackagingMaterialFa: 'کارتن مقوایی ۵ لایه کرافت ۱۲ عددی',
      barrierPropertiesFa: 'مقاومت فیزیکی بالا در برابر سوراخ‌شدگی ناشی از تیزی دانه‌ها',
      hermeticSealTestFa: 'تست کشش و مقاومت دوخت'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۱۲ الی ۱۸ ماه',
      primaryDeteriorationMechanism: 'هجوم آفات انباری (سوسک‌های بروخوس حبوبات)، سفت‌شدن دانه به دلیل پیری و دیرپز شدن (Hard-to-cook defect)',
      criticalLimitAtEndOfShelfLife: 'عاری از هرگونه حشره زنده یا مرده، قابلیت پخت کامل زیر ۴۵ دقیقه'
    },
    standards: [
      {
        id: 'std-inso-295',
        standardNumber: 'INSO 295',
        organization: 'INSO',
        titleFa: 'حبوبات فرآوری و بسته‌بندی‌شده - ویژگی‌ها و روش‌های آزمون (استاندارد ملی)',
        titleEn: 'Packaged and processed pulses - Specifications and test methods',
        publicationYear: '1396',
        status: 'active_mandatory',
        scopeFa: 'مقررات حد مواد خارجی (حداکثر ۰.۱٪)، دانه‌های آفت‌زده، رطوبت، زمان پخت و آفات انباری',
        sourceId: 'src-inso-295',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-pul-impurities',
        code: 'QC-PUL-PHY-01',
        category: 'physical',
        nameFa: 'درصد ناخالصی‌ها و مواد خارجی (سنگ، کلوخ، شیشه)',
        nameEn: 'Foreign Matter & Extraneous Material Content',
        parameterAnalyte: 'Foreign Matter',
        unit: '%',
        maxLimit: 0.1,
        targetValue: 0.0,
        methodFa: 'تفکیک دستی و توزین با ترازوی ۴ رقمی آزمایشگاهی مطابق INSO 295',
        frequency: 'each_batch',
        standardId: 'std-inso-295',
        sourceId: 'src-inso-295',
        criticality: 'critical_safety',
        notesFa: 'وجود هرگونه سنگ یا شیشه خطر فیزیکی جدی برای دندان مصرف‌کننده است.'
      },
      {
        id: 'test-pul-moist',
        code: 'QC-PUL-CHM-01',
        category: 'chemical',
        nameFa: 'درصد رطوبت حبوبات به روش آون ۱۰۵ درجه',
        nameEn: 'Moisture Content by Oven Drying',
        parameterAnalyte: 'Moisture',
        unit: '%',
        maxLimit: 12.0,
        methodFa: 'آسیاب و خشک‌کردن در آون ۱۰۵ درجه به مدت ۴ ساعت بر اساس INSO 295',
        frequency: 'each_batch',
        standardId: 'std-inso-295',
        sourceId: 'src-inso-295',
        criticality: 'major_quality'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-295']
    ],
    tags: ['حبوبات', 'عدس', 'نخود', 'INSO 295', 'سنگ گیر', 'سورتینگ نوری', 'رطوبت']
  },

  // 15. ادویه (Spices) - زردچوبه ساییده خالص
  {
    id: 'prod-spice-turmeric-powder',
    code: 'PROD-SPI-01',
    nameFa: 'پودر زردچوبه خالص ساییده (Ground Turmeric)',
    nameEn: '100% Pure Ground Turmeric (Curcuma longa L.)',
    commercialNameFa: 'پودر زردچوبه ممتاز قلم ساب بسته‌بندی پت و سلفونی',
    category: 'spices',
    descriptionFa: 'فرآورده حاصل از تمیزکردن، پوست‌گیری جزئی، جوشاندن، خشک‌کردن و آسیاب کردن ریزوم‌های گیاه کورکوما لونگا بدون هرگونه رنگ افزودنی مصنوعی یا آرد و مواد پرکننده تقلباتی.',
    commercialFormsFa: ['قوطی‌های نمک‌پاشی و استوانه‌ای پت ۱۰۰ گرمی', 'کیسه‌های سلفونی وکیوم ۲۵۰ گرمی'],
    physicalStateFa: 'powder',
    targetMatrix: 'پودر سلولزی معطر گیاهی حاوی کاروتنوئید فعال کورکومین (Curcumin) و اسانس‌های روغنی تورمرون',
    keyCharacteristicsFa: {
      moisturePercent: 'حداکثر ۱۰.۰ درصد',
      ashPercent: 'حداکثر ۷.۰ درصد (خاکستر نامحلول در اسید حداکثر ۱.۰٪)',
      appearanceColorFa: 'زرد تند مایل به نارنجی درخشان، پودر نرم یکنواخت عاری از کلوخه و حشرات'
    },
    rawMaterials: [
      {
        id: 'rm-turmeric-rhizome',
        nameFa: 'ریزوم خشک زردچوبه قلم (انگشتی نظام‌آباد Grade A)',
        nameEn: 'Dried Turmeric Fingers (Curcuma longa)',
        role: 'تنها ماده اولیه طبیعی فرآورده',
        typicalPercentageRange: '۱۰۰ ٪',
        qualityCriteriaFa: 'کورکومین بالای ۳.۵٪، اسانس بالای ۴٪، بدون آلودگی به کپک و حشرات انبار',
        isAllergenic: false,
        standardReference: 'INSO 315'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'بوجاری، سنگ‌گیری و جداسازی مغناطیسی قلم‌ها',
        nameEn: 'Cleaning & Magnetic Separation of Rhizomes',
        criticalParameters: 'حذف کامل بقایای خاک مزرعه، خار و خاشاک و سنگ‌ریزه‌ها',
        equipmentFa: 'الک ارتعاشی، سنگ‌گیر پنوماتیک و مگنت آهن‌ربایی پرقدرت نئودیمیوم',
        ccpOrCqP: 'CP',
        descriptionFa: 'پاک‌سازی قلم‌های زردچوبه قبل از ورود به خط آسیاب حساس.'
      },
      {
        stepNumber: 2,
        nameFa: 'آسیاب چکشی و پین‌میل سرد تحت کنترل دما (Cryogenic / Cold Milling)',
        nameEn: 'Cold Pin-Mill Grinding (< 45 °C)',
        criticalParameters: 'دمای خروجی پودر کمتر از ۴۵ درجه سلسیوس جهت ممانعت از تبخیر اسانس‌های فرار معطر',
        equipmentFa: 'آسیاب پین‌میل پیشرفته مجهز به ژاکت خنک‌کننده آب سرد و فن مکنده سیکلون',
        ccpOrCqP: 'CP',
        descriptionFa: 'پودر کردن با حفظ کورکومین و روغن‌های فرار و جلوگیری از تیره شدن رنگ پودر.'
      },
      {
        stepNumber: 3,
        nameFa: 'الک‌بندی میکرونی و پرتودهی/استریلیزاسیون خشک',
        nameEn: 'Sifting (300 micron mesh) & Microwave / Steam Sterilization',
        criticalParameters: 'عبور ۱۰۰٪ پودر از الک شماره ۵۰ (۳۰۰ میکرون)، کنترل بار اسپورهای هوازی',
        equipmentFa: 'الک ویبره بسته استیل و سیستم پاستوریزاسیون مایکروویو ادویه',
        ccpOrCqP: 'CCP',
        descriptionFa: 'ایجاد نرمی بافت پودر و کاهش بار اسپورهای مقاوم بدون باقی گذاشتن باقیمانده شیمیایی.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-spi-pinmill',
        nameFa: 'آسیاب ضربه‌ای پین‌میل استیل ضدزنگ با روتور دوار',
        nameEn: 'Stainless Steel Pin Mill with Water Cooling Jacket',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'سرعت ۶۰۰۰ RPM، تیغه‌های ضدسایش سخت‌کاری‌شده، جداساز سیکلونی با بگ‌فیلتر',
        maintenanceAndCalibration: 'کنترل بالانس شفت و سایش پین‌ها ماهانه'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۱۵ الی ۲۲ درجه سلسیوس در انبار خشک و تاریک',
      relativeHumidityRangeFa: 'حداکثر ۵۰ درصد',
      lightingProtectionFa: 'حفاظت مطلق در برابر نور؛ نور خورشید به سرعت کورکومین را تخریب و رنگ زردچوبه را رنگ‌پریده می‌کند',
      stackingLimitsFa: 'حداکثر ۶ کارتن روی پالت',
      specialPrecautionsFa: 'بسته‌بندی باید نسبت به فرار اسانس معطر نفوذناپذیر باشد.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'فیلم‌های متالایز چندلایه پلی‌استر/آلومینیوم/پلی‌اتیلن (PET/ALU/PE) یا ظروف پت کدر',
      secondaryPackagingMaterialFa: 'کارتن سه لایه بهداشتی',
      barrierPropertiesFa: 'نفوذناپذیری ۱۰۰٪ به نور و رطوبت',
      hermeticSealTestFa: 'تست تست دوخت حرارتی فلوپک'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۱۸ الی ۲۴ ماه از تاریخ آسیاب',
      primaryDeteriorationMechanism: 'رنگ‌پریدگی ناشی از نور، فرار اسانس‌های معطر و کلوخه‌شدن در اثر رطوبت',
      criticalLimitAtEndOfShelfLife: 'کورکومین حداقل ۲.۵ درصد و اسانس فرار حداقل ۲.۵ میلی‌لیتر در ۱۰۰ گرم'
    },
    standards: [
      {
        id: 'std-inso-315',
        standardNumber: 'INSO 315',
        organization: 'INSO',
        titleFa: 'ادویه‌ها و چاشنی‌ها - زردچوبه ساییده - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Spices - Ground turmeric - Specifications and test methods',
        publicationYear: '1393',
        status: 'active_mandatory',
        scopeFa: 'تعیین درصد کورکومین، خاکستر کل، خاکستر نامحلول در اسید، اسانس فرار، رطوبت و آزمون خلوص (عدم وجود نشاسته، شن و رنگ مصنوعی)',
        sourceId: 'src-inso-315',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-spi-curcumin',
        code: 'QC-SPI-CHM-01',
        category: 'chemical',
        nameFa: 'درصد کورکومین زردچوبه (Curcumin Content)',
        nameEn: 'Curcumin Content by Spectrophotometry at 425 nm',
        parameterAnalyte: 'Curcumin',
        unit: '%',
        minLimit: 3.0,
        targetValue: 4.0,
        methodFa: 'استخراج با الکل و اسپکتروفتومتری در ۴۲۵ نانومتر بر اساس INSO 315 و ASTA 18.0',
        frequency: 'each_batch',
        standardId: 'std-inso-315',
        sourceId: 'src-inso-315',
        criticality: 'major_quality',
        notesFa: 'ماده مؤثره درمانی و رنگی اصلی زردچوبه؛ مقادیر کمتر از ۳٪ نشان‌دهنده کیفیت ضعیف یا تقلب است.'
      },
      {
        id: 'test-spi-acid-ash',
        code: 'QC-SPI-CHM-02',
        category: 'chemical',
        nameFa: 'خاکستر نامحلول در اسید (سنجش شن، خاک و سیلیکات)',
        nameEn: 'Acid-Insoluble Ash Content',
        parameterAnalyte: 'Acid-Insoluble Ash (Silica/Sand)',
        unit: '%',
        maxLimit: 1.0,
        methodFa: 'جوشاندن خاکستر در اسید کلریدریک ۱۰٪، صاف کردن، سوزاندن و توزین مطابق INSO 315',
        frequency: 'each_batch',
        standardId: 'std-inso-315',
        sourceId: 'src-inso-315',
        criticality: 'critical_safety',
        notesFa: 'آزمون کلیدی کشف آلودگی به گردوخاک و شن مزرعه.'
      },
      {
        id: 'test-spi-color-adulteration',
        code: 'QC-SPI-CHM-03',
        category: 'chemical',
        nameFa: 'آزمون جستجوی رنگ‌های مصنوعی قطران و متانیل یلو (Metanil Yellow Test)',
        nameEn: 'Detection of Artificial Dyes (Metanil Yellow / Sudan Dyes)',
        parameterAnalyte: 'Metanil Yellow & Synthetic Dyes',
        textLimitFa: 'منفی قطعی (عدم وجود هرگونه رنگ افزودنی شیمیایی)',
        methodFa: 'کروماتوگرافی لایه نازک (TLC) و تست اسید کلریدریک غلیظ بر اساس INSO 315',
        frequency: 'each_batch',
        standardId: 'std-inso-315',
        sourceId: 'src-inso-315',
        criticality: 'critical_safety',
        notesFa: 'متانیل یلو رنگ غیرمجاز صنعتی و سرطان‌زاست که در برخی زردچوبه‌های تقلبی استفاده می‌شود.'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-315']
    ],
    tags: ['ادویه', 'زردچوبه', 'کورکومین', 'INSO 315', 'خاکستر نامحلول', 'متانیل یلو', 'آسیاب سرد']
  },

  // 16. آب (Water) - آب معدنی طبیعی بسته‌بندی‌شده
  {
    id: 'prod-water-mineral-packaged',
    code: 'PROD-WAT-01',
    nameFa: 'آب معدنی طبیعی بسته‌بندی‌شده چشمه و کوهستان',
    nameEn: 'Natural Packaged Mineral Water',
    commercialNameFa: 'آب معدنی طبیعی گوارا بطری پت ۵۰۰ و ۱۵۰۰ میلی‌لیتر',
    category: 'water',
    descriptionFa: 'آب زلال به دست آمده از سفره‌های آب زیرزمینی طبیعی یا چشمه‌های محافظت‌شده که از نظر بهداشتی پاک بوده و ترکیب املاح معدنی آن در منبع دارای پایداری دائمی است و بدون هرگونه تغییر شیمیایی بسته‌بندی می‌شود.',
    commercialFormsFa: ['بطری‌های شفاف PET در حجم‌های ۰.۵ و ۱.۵ لیتری'],
    physicalStateFa: 'liquid',
    targetMatrix: 'محلول یونیزه طبیعی کاتیون‌های کلسیم، منیزیم، سدیم و آنیون‌های بی‌کربنات، سولفات و کلرید',
    keyCharacteristicsFa: {
      phTypical: '۶.۸۰ الی ۷.۸۰',
      appearanceColorFa: 'کاملاً زلال، بی‌رنگ، عاری از ذرات معلق، بی‌بو و دارای طعم گوارای طبیعی'
    },
    rawMaterials: [
      {
        id: 'rm-water-source',
        nameFa: 'آب چشمه طبیعی زیرزمینی محافظت‌شده ژئولوژیکی',
        nameEn: 'Protected Natural Spring Source',
        role: 'تنها منبع آب اولیه',
        typicalPercentageRange: '۱۰۰ ٪',
        qualityCriteriaFa: 'نیترات کمتر از ۱۰ ppm، نیتریت صفر، بار میکروبی سودوموناس و اشرشیا کلی صفر در منبع',
        isAllergenic: false,
        standardReference: 'INSO 2441'
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'انتقال بسته بهداشتی از مظهر چشمه به کارخانه',
        nameEn: 'Sanitary Enclosed Pipeline Intake',
        criticalParameters: 'خط لوله استیل ۳۱۶ کاملاً هوابند بدون تماس با هوای محیط',
        equipmentFa: 'حوضچه جمع‌آوری استیل سرچشمه و پایپینگ بهداشتی',
        ccpOrCqP: 'CP',
        descriptionFa: 'انتقال ثقلی آب بدون تغییر در ترکیبات معدنی طبیعی آن.'
      },
      {
        stepNumber: 2,
        nameFa: 'فیلتراسیون فیزیکی چند مرحله‌ای کارتریجی و شنی',
        nameEn: 'Multi-Stage Cartridge Microfiltration (5 µm & 1 µm)',
        criticalParameters: 'جداسازی ذرات ریز شنی بدون حذف املاح محلول معدنی',
        equipmentFa: 'هوزینگ‌های استیل کارتریج فیلتر پلی‌پروپیلن ۵ و ۱ میکرون',
        ccpOrCqP: 'CP',
        descriptionFa: 'زلال‌سازی کامل فیزیکی بدون استفاده از مواد منعقدکننده شیمیایی.'
      },
      {
        stepNumber: 3,
        nameFa: 'ضدعفونی با اشعه فرابنفش (UV) و فیلتراسیون غشایی ۰.۲ میکرون',
        nameEn: 'UV Disinfection & 0.2 µm Membrane Sterilization',
        criticalParameters: 'دوز UV حداقل ۴۰ میلی‌ژول بر سانتی‌متر مربع، غشای استریل سرامیکی/پلیمری',
        equipmentFa: 'سیستم استریلیزاتور فرابنفش استیل و ماژول فیلتر غشایی ۰.۲ میکرون',
        ccpOrCqP: 'CCP',
        descriptionFa: 'حذف و مهار میکروارگانیسم‌ها و کیست‌های پروتوزوآ بدون ایجاد ترکیبات جانبی شیمیایی (برخلاف کلرزنی که در آب معدنی ممنوع است).'
      },
      {
        stepNumber: 4,
        nameFa: 'پرکنی در بطری پت بادشده در خط و درب‌بندی با هوای فیلتر هپا',
        nameEn: 'Triblock Cleanroom Bottling & Capping',
        criticalParameters: 'چمبر کلین‌روم با فشار مثبت هوای کلاس ۱۰۰، بادکن بطری آنلاین',
        equipmentFa: 'دستگاه تریبلوک شستشو، پرکن و درب‌بند اتوماتیک',
        ccpOrCqP: 'OPRP',
        descriptionFa: 'پرکردن بطری‌ها در شرایط فوق‌بهداشتی جهت تضمین ماندگاری بدون نگه‌دارنده.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-wat-turbidimeter',
        nameFa: 'توربیدیمتر (کدورت‌سنج) دیجیتال آزمایشگاهی نفلومتری',
        nameEn: 'Digital Benchtop Turbidimeter (NTU)',
        roleInProcessOrLab: 'laboratory_qc',
        keySpecificationFa: 'دقت ۰.۰۱ NTU با استاندارد کالیبراسیون فورمازین',
        maintenanceAndCalibration: 'کالیبراسیون هفتگی با کیت فورمازین استاندارد'
      },
      {
        id: 'eq-wat-ec-meter',
        nameFa: 'هدایت‌سنج (EC-Meter) و سختی‌سنج دیجیتال با تصحیح دما',
        nameEn: 'Conductivity & TDS Benchtop Meter',
        roleInProcessOrLab: 'laboratory_qc',
        keySpecificationFa: 'اندازه‌گیری میکروزیمنس بر سانتی‌متر و TDS در دمای ۲۵ درجه',
        maintenanceAndCalibration: 'کالیبراسیون روزانه با محلول استاندارد KCl 0.01M'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۵ الی ۲۵ درجه سلسیوس در محل خنک و دور از گرما',
      relativeHumidityRangeFa: 'محیط تمیز بدون رطوبت بالا',
      lightingProtectionFa: 'حفاظت قطعی در برابر تابش مستقیم نور آفتاب؛ نور و گرما سبب ترشح آنتیموان از بطری پت و رشد جلبک‌های میکروسکوپی می‌شود',
      stackingLimitsFa: 'حداکثر ۲ پالت روی هم',
      specialPrecautionsFa: 'عدم قرار دادن بسته‌های آب در مجاورت مواد معطر، شوینده‌ها و سوخت‌های فسیلی (نفت و بنزین).'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'بطری پلی‌اتیلن ترفتالات (PET) گرید غذایی با درپوش پلی‌اتیلنی HDPE با کمربند پلمپ ایمنی',
      secondaryPackagingMaterialFa: 'بسته‌های شرینک ۶ و ۱۲ تایی نایلونی',
      barrierPropertiesFa: 'عدم نفوذ گردوغبار و آلودگی‌های محیطی',
      hermeticSealTestFa: 'تست تست نشتی در خلاء و گشتاور بازشدن درب بطری'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۱۲ ماه از تاریخ بسته‌بندی',
      primaryDeteriorationMechanism: 'مهاجرت مونومرهای استالدئید و آنتیموان از پت در شرایط نگهداری گرم و تغییر طعم آب',
      criticalLimitAtEndOfShelfLife: 'فاقد هرگونه طعم و بوی پلاستیک، کدورت زیر ۱ NTU، باکتری‌های شاخص صفر'
    },
    standards: [
      {
        id: 'std-inso-2441',
        standardNumber: 'INSO 2441',
        organization: 'INSO',
        titleFa: 'آب معدنی طبیعی بسته‌بندی‌شده - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Packaged natural mineral water - Specifications',
        publicationYear: '1395',
        status: 'active_mandatory',
        scopeFa: 'مقررات املاح، نیترات (حداکثر ۵۰ و برای نوزاد ۱۰ ppm)، نیتریت، فلزات سنگین، کدورت و عدم وجود سودوموناس آئروژینوزا',
        sourceId: 'src-inso-2441',
        coverageType: 'general_specifications'
      },
      {
        id: 'std-inso-6694',
        standardNumber: 'INSO 6694',
        organization: 'INSO',
        titleFa: 'آب آشامیدنی بسته‌بندی‌شده - ویژگی‌ها و روش‌های آزمون',
        titleEn: 'Packaged drinking water - Specifications and test methods',
        publicationYear: '1396',
        status: 'active_mandatory',
        scopeFa: 'مقررات ویژگی‌های فیزیکی، شیمیایی و میکروبیولوژی آب‌های آشامیدنی تصفیه‌شده',
        sourceId: 'src-inso-6694',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-wat-nitrate',
        code: 'QC-WAT-CHM-01',
        category: 'chemical',
        nameFa: 'میزان یون نیترات (NO3-)',
        nameEn: 'Nitrate Ion Content by Spectrophotometry / IC',
        parameterAnalyte: 'Nitrate',
        unit: 'mg/L (ppm)',
        maxLimit: 45.0,
        targetValue: 10.0,
        methodFa: 'روش اسپکتروفتومتری فرابنفش در ۲۲۰ و ۲۷۵ نانومتر یا کروماتوگرافی یونی بر اساس INSO 2441',
        frequency: 'each_batch',
        standardId: 'std-inso-2441',
        sourceId: 'src-inso-2441',
        criticality: 'critical_safety',
        notesFa: 'شاخص آلودگی سفره زیرزمینی به کودهای شیمیایی یا فاضلاب؛ مقادیر بالا سبب بیماری متهموگلوبینمی می‌شود.'
      },
      {
        id: 'test-wat-pseudo',
        code: 'QC-WAT-MIC-01',
        category: 'microbial',
        nameFa: 'جستجو و شمارش سودوموناس آئروژینوزا در ۲۵۰ میلی‌لیتر',
        nameEn: 'Detection of Pseudomonas aeruginosa in 250 ml',
        parameterAnalyte: 'Pseudomonas aeruginosa',
        textLimitFa: 'صفر در ۲۵۰ میلی‌لیتر (Zero in 250 ml - Negative)',
        methodFa: 'روش فیلتراسیون غشایی با فیلتر ۰.۴۵ میکرون و کشت روی سودوموناس سی ان آگار مطابق INSO 2441',
        frequency: 'each_batch',
        standardId: 'std-inso-2441',
        sourceId: 'src-inso-2441',
        criticality: 'critical_safety',
        notesFa: 'پاتوژن فرصت‌طلب شاخص در آب‌های بسته‌بندی؛ وجود آن سبب ابطال مجوز محموله می‌گردد.'
      },
      {
        id: 'test-wat-ecoli',
        code: 'QC-WAT-MIC-02',
        category: 'microbial',
        nameFa: 'شمارش اشرشیا کلی و کلی‌فرم‌ها در ۲۵۰ میلی‌لیتر',
        nameEn: 'Detection of E. coli and Coliforms in 250 ml',
        parameterAnalyte: 'E. coli & Coliforms',
        textLimitFa: 'منفی قطعی در ۲۵۰ میلی‌لیتر',
        methodFa: 'روش فیلتراسیون غشایی و کشت روی اندو آگار و مک‌کانکی بر اساس INSO 2441',
        frequency: 'each_batch',
        standardId: 'std-inso-2441',
        sourceId: 'src-inso-2441',
        criticality: 'critical_safety'
      },
      {
        id: 'test-wat-turb',
        code: 'QC-WAT-PHY-01',
        category: 'physical',
        nameFa: 'میزان کدورت آب (Turbidity)',
        nameEn: 'Turbidity by Nephelometric Method',
        parameterAnalyte: 'Turbidity',
        unit: 'NTU',
        maxLimit: 1.0,
        targetValue: 0.1,
        methodFa: 'نفلومتری با توربیدیمتر کالیبره بر اساس INSO 2441',
        frequency: 'each_batch',
        standardId: 'std-inso-2441',
        sourceId: 'src-inso-2441',
        criticality: 'major_quality'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-2441'],
      CATALOG_SOURCES_DATABASE['src-inso-6694']
    ],
    tags: ['آب معدنی', 'آب آشامیدنی', 'INSO 2441', 'INSO 6694', 'نیترات', 'سودوموناس', 'کدورت']
  },

  // 17. سایر محصولات (Other Products) - سس مایونز پرچرب
  {
    id: 'prod-other-mayonnaise-fullfat',
    code: 'PROD-OTH-01',
    nameFa: 'سس مایونز پرچرب کلاسیک (Full-Fat Mayonnaise)',
    nameEn: 'Classic Full-Fat Emulsified Mayonnaise',
    commercialNameFa: 'سس مایونز شیشه‌ای و فشاری ۶۵٪ چربی',
    category: 'other_products',
    descriptionFa: 'امولسیون نیمه‌جامد روغن در آب (O/W) تهیه شده از روغن نباتی مایع خوراکی، زرده تخم‌مرغ پاستوریزه، سرکه تقطیری، آب‌لیمو، شکر، نمک و خردل بدون استفاده از غلیظ‌کننده‌های نشاسته‌ای در فرمولاسیون اصیل.',
    commercialFormsFa: ['جار شیشه‌ای تویست‌آف ۴۵۰ و ۹۰۰ گرمی', 'بطری فشاری پلی‌پروپیلنی'],
    physicalStateFa: 'viscous_paste',
    targetMatrix: 'امولسیون فشرده با دانسیته بالا از قطرات بسیار ریز روغن (۱ الی ۵ میکرون) محصور در غشای لیسیتین و فسفوپروتئین‌های زرده تخم‌مرغ',
    keyCharacteristicsFa: {
      phTypical: '۳.۵۰ الی ۴.۱۰ (مقاوم در برابر باکتری‌های پاتوژن)',
      fatPercent: 'حداقل ۶۵.۰ درصد (سس مایونز پرچرب مطابق استاندارد ملی)',
      saltPercent: '۱.۰ الی ۱.۵ درصد',
      ashPercent: '۱.۵ الی ۲.۰ درصد',
      appearanceColorFa: 'سفید عاجی تا زرد کرمی ملایم یکدست، بافت قوام‌دار خامه‌ای براق بدون دوفاز شدن و حباب'
    },
    rawMaterials: [
      {
        id: 'rm-mayo-oil',
        nameFa: 'روغن آفتابگردان یا سویای تصفیه‌شده بی‌بو',
        nameEn: 'Refined Deodorized Sunflower / Soybean Oil',
        role: 'فاز پراکنده اصلی و عامل ویسکوزیته امولسیون',
        typicalPercentageRange: '۶۵ الی ۶۸ ٪',
        qualityCriteriaFa: 'پراکسید زیر ۱.۰ meq/kg، اسیدیته زیر ۰.۰۸٪، کلد تست مثبت',
        isAllergenic: false,
        standardReference: 'INSO 1446'
      },
      {
        id: 'rm-mayo-egg',
        nameFa: 'زرده تخم‌مرغ تازه پاستوریزه مایع',
        nameEn: 'Pasteurized Liquid Egg Yolk',
        role: 'امولسیفایر طبیعی اصلی (لسیتین و لیپوپروتئین‌های LDL)',
        typicalPercentageRange: '۶ الی ۸ ٪',
        qualityCriteriaFa: 'سالمونلا منفی، بار میکروبی کمتر از ۵۰۰۰ در گرم، تست فسفاتاز منفی',
        isAllergenic: true,
        allergenType: 'تخم‌مرغ',
        standardReference: 'INSO 2454'
      },
      {
        id: 'rm-mayo-vinegar',
        nameFa: 'سرکه تقطیری سفید خوراکی (اسید استیک ۱۱٪)',
        nameEn: 'Distilled White Vinegar (Acetic Acid 11%)',
        role: 'عامل طعم ترش، تنظیم‌کننده اسیدیته به زیر ۴.۱ و نگهدارنده بیولوژیک طبیعی',
        typicalPercentageRange: '۳ الی ۵ ٪',
        qualityCriteriaFa: 'زلال و بدون رسوب، خلوص تخمیری',
        isAllergenic: false
      }
    ],
    processSteps: [
      {
        stepNumber: 1,
        nameFa: 'آماده‌سازی فاز آبی و پروتئینی در مخزن هموژنایزر تحت خلاء',
        nameEn: 'Aqueous Phase & Egg Yolk Premixing under Vacuum',
        criticalParameters: 'خلاء منفی ۰.۶ بار جهت خروج میکروحباب‌های هوا',
        equipmentFa: 'میکسر هموژنایزر تحت خلاء مجهز به پروانه امولسیفایر روتور-استاتور',
        ccpOrCqP: 'CP',
        descriptionFa: 'مخلوط‌کردن آب، زرده تخم‌مرغ، خردل، نمک و شکر در دور ملایم.'
      },
      {
        stepNumber: 2,
        nameFa: 'تزریق تدریجی روغن تحت تنش برشی فوق‌العاده بالا (High Shear Emulsification)',
        nameEn: 'Controlled Oil Dosing & High Shear Emulsification',
        criticalParameters: 'تزریق روغن در مدت زمان دقیق، دور روتور تا ۳۰۰۰ RPM، اندازه قطرات زیر ۳ میکرون',
        equipmentFa: 'هد امولسیون‌ساز هموژنایزر درون خطی (In-line Rotor-Stator)',
        ccpOrCqP: 'CCP',
        descriptionFa: 'تبدیل روغن به تریلیون‌ها قطره میکرونی و پوشش فوری توسط لسیتین زرده تخم‌مرغ.'
      },
      {
        stepNumber: 3,
        nameFa: 'تزریق سرکه و اسیدسیتریک در انتهای فرآیند',
        nameEn: 'Final Acidification Phase',
        criticalParameters: 'رسیدن pH نهایی به زیر ۴.۰ جهت محافظت میکروبیولوژیک',
        equipmentFa: 'پمپ دوزینگ اسید به محفظه روتور',
        ccpOrCqP: 'CCP',
        descriptionFa: 'تثبیت بار الکتریکی قطرات و نابودی هرگونه باکتری پاتوژن اسیدحساس.'
      },
      {
        stepNumber: 4,
        nameFa: 'پرکنی در جار شیشه‌ای و درب‌بندی تویست‌آف با تزریق بخار',
        nameEn: 'Glass Bottling & Vacuum Twist-Off Capping',
        criticalParameters: 'درب‌بندی هوابند با واشر پلاستیزول مقاوم به چربی و اسید',
        equipmentFa: 'پرکن پیستونی مایونز و درب‌بند اتوماتیک',
        ccpOrCqP: 'CP',
        descriptionFa: 'بسته‌بندی بدون تماس با هوای آزاد برای جلوگیری از اکسیداسیون سطحی روغن.'
      }
    ],
    requiredEquipment: [
      {
        id: 'eq-mayo-shear',
        nameFa: 'دستگاه میکسر هموژنایزر تحت خلاء با روتور-استاتور برش بالا',
        nameEn: 'High-Shear Vacuum Emulsifying Mixer (FrymaKoruma type)',
        roleInProcessOrLab: 'production',
        keySpecificationFa: 'حجم ۵۰۰ لیتر، ژاکت سرمایش، پمپ خلاء رینگ مایع و روتور-استاتور متغیر تا ۳۶۰۰ دور',
        maintenanceAndCalibration: 'کنترل بالانس شفت و آب‌بندی مکانیکال سیل دوطرفه'
      }
    ],
    storageConditions: {
      temperatureRangeFa: '۴ الی ۱۲ درجه سلسیوس در جای خنک و دور از گرما (عدم انجماد)',
      relativeHumidityRangeFa: '۶۰ الی ۷۰ درصد',
      lightingProtectionFa: 'عدم قرارگیری در معرض نور خورشید و گرما جهت پیشگیری از اکسیداسیون چربی',
      stackingLimitsFa: 'حداکثر ۵ کارتن روی هم',
      specialPrecautionsFa: 'هرگز نباید مایونز یخ بزند؛ انجماد آب باعث پارگی غشای لسیتین و دوفاز شدن قطعی (شکستن امولسیون) می‌شود.'
    },
    packagingSpecs: {
      primaryPackagingMaterialFa: 'ظروف شیشه‌ای شفاف درجه یک یا بطری‌های فشاری سه لایه با مانع اکسیژن (PP/EVOH/PP)',
      secondaryPackagingMaterialFa: 'کارتن مقوایی کنگره‌دار ۱۲ تایی',
      barrierPropertiesFa: 'نفوذناپذیری در برابر اکسیژن جهت حفظ اسیدهای چرب غیراشباع روغن',
      hermeticSealTestFa: 'تست تست افت درب شیشه و آزمون خلاء'
    },
    shelfLifeSpecs: {
      shelfLifeDurationFa: '۶ الی ۹ ماه در دمای خنک محیطی (زیر ۱۸ درجه)',
      primaryDeteriorationMechanism: 'دوفاز شدن فیزیکی امولسیون (روغن انداختن)، اکسیداسیون و تندشدن چربی، رشد کپک در صورت بازماندن درب',
      criticalLimitAtEndOfShelfLife: 'عدد پراکسید چربی زیر ۲ meq/kg و پایداری امولسیون ۱۰۰٪'
    },
    standards: [
      {
        id: 'std-inso-2454',
        standardNumber: 'INSO 2454',
        organization: 'INSO',
        titleFa: 'سس مایونز و سس‌های سالاد - ویژگی‌ها و روش‌های آزمون (استاندارد ملی اجباری)',
        titleEn: 'Mayonnaise and salad dressings - Specifications and test methods',
        publicationYear: '1398',
        status: 'active_mandatory',
        scopeFa: 'حداقل چربی (۶۵٪)، حداکثر رطوبت، pH، پایداری امولسیون در حرارت و سانتریفیوژ، باقیمانده میکروبی',
        sourceId: 'src-inso-2454',
        coverageType: 'general_specifications'
      }
    ],
    tests: [
      {
        id: 'test-mayo-fat',
        code: 'QC-MAY-CHM-01',
        category: 'chemical',
        nameFa: 'درصد چربی کل سس مایونز پرچرب',
        nameEn: 'Total Fat Content by Acid Digestion & Werner-Schmid',
        parameterAnalyte: 'Total Fat',
        unit: '%',
        minLimit: 65.0,
        targetValue: 66.5,
        methodFa: 'هضم اسیدی با اسید کلریدریک و استخراج چربی با مخلوط اتر اتیلیک و پترولیوم اتر مطابق INSO 2454',
        frequency: 'each_batch',
        standardId: 'std-inso-2454',
        sourceId: 'src-inso-2454',
        criticality: 'critical_safety',
        notesFa: 'چربی زیر ۶۵٪ طبق استاندارد ملی عنوان "مایونز پرچرب" تلقی نمی‌شود و تخلف طبقه‌بندی است.'
      },
      {
        id: 'test-mayo-ph',
        code: 'QC-MAY-CHM-02',
        category: 'chemical',
        nameFa: 'اندازه‌گیری pH سس مایونز در ۲۰ درجه سلسیوس',
        nameEn: 'pH Determination at 20 °C',
        parameterAnalyte: 'pH',
        minLimit: 3.50,
        maxLimit: 4.10,
        targetValue: 3.85,
        methodFa: 'الکترود شیشه‌ای غوطه‌ور در نمونه سس با pH متر کالیبره بر اساس INSO 2454',
        frequency: 'each_batch',
        standardId: 'std-inso-2454',
        sourceId: 'src-inso-2454',
        criticality: 'critical_safety',
        notesFa: 'pH بالاتر از ۴.۱ ایمنی بیولوژیکی سس را در برابر رشد سالمونلا به خطر می‌اندازد.'
      },
      {
        id: 'test-mayo-stab',
        code: 'QC-MAY-PHY-01',
        category: 'physical',
        nameFa: 'پایداری امولسیون در اثر حرارت ۵۰ درجه (Emulsion Stability Test)',
        nameEn: 'Thermal Emulsion Stability at 50 °C',
        parameterAnalyte: 'Oil Separation / Phase Stability',
        textLimitFa: 'پایدار کامل بدون هرگونه جداسازی قطرات روغن یا دوفاز شدن پس از ۴۸ ساعت در دمای ۵۰ درجه',
        methodFa: 'قرار دادن لوله حاوی سس در گرمخانه ۵۰ درجه به مدت ۴۸ ساعت و بررسی میزان جدایی فاز روغنی مطابق INSO 2454',
        frequency: 'each_batch',
        standardId: 'std-inso-2454',
        sourceId: 'src-inso-2454',
        criticality: 'major_quality'
      }
    ],
    sources: [
      CATALOG_SOURCES_DATABASE['src-inso-2454']
    ],
    tags: ['سس مایونز', 'امولسیون', 'تخم مرغ', 'INSO 2454', 'چربی ۶۵ درصد', 'پایداری امولسیون', 'pH']
  }
];
