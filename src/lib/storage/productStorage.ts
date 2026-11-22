/**
 * Food Science AI - Food Product Development Storage Service
 * Manages persistence of formulation projects, versions, pilot test logs, and scaling models in IndexedDB.
 * Completely functional in Offline Mode.
 */

import { executeTx, STORES, getAllItems, getItem, putItem, deleteItem } from './indexedDb';
import {
  ProductDevelopmentProject,
  FormulationVersion,
  FormulationIngredient,
  ProcessStage,
  PackagingSpec,
  QualityControlSpec,
  ShelfLifeStudyPoint,
  PotentialDefectAndTroubleshooting,
  TestResultEntry
} from '../../types/foodProduct';
import { calculateFormulationSummary } from '../products/formulationEngine';

/**
 * Standard reference template projects preloaded into IndexedDB if the store is empty
 */
const SEED_PROJECTS: ProductDevelopmentProject[] = [
  {
    id: 'prd_seed_probiotic_doogh',
    code: 'PRD-DAIRY-001',
    productNameFa: 'دوغ پروبیوتیک نعنایی بدون گاز عملگرا',
    productNameEn: 'Functional Mint Probiotic Stirred Doogh',
    category: 'dairy',
    targetObjectives: ['clean_label', 'novel_formulation', 'shelf_life_ext', 'texture_optimized'],
    executiveSummaryFa: 'توسعه فرمولاسیون صنعتی دوغ پروبیوتیک بدون گاز غنی‌شده با باکتری‌های پروبیوتیک پایدار و پکتین با متوکسیل بالا (HMP) جهت جلوگیری از رسوب کازئین و پدیده سینرسیس (دوفاز شدن) در طول دوره ماندگاری ۲۱ روزه یخچال.',
    productIdea: 'تولید دوغ بدون گاز عملگرا با استفاده از سویه‌های پروبیوتیک ثبت‌شده و فیبر پری‌بیوتیک جهت ارتقای سلامت میکروبیوم روده بدون ایجاد اسیدیته بیش از حد یا سرم‌اندازی در طول زنجیره سرما.',
    targetSpecifications: {
      targetPh: '3.90 - 4.15',
      targetBrix: '3.2 - 3.5° Brix',
      targetMoisturePercent: '94.5 - 95.5%',
      targetFatPercent: '0.50 - 0.70%',
      targetProteinPercent: 'حداقل 1.20% (INSO 2852)',
      targetTextureProfile: 'یکنواخت، تک‌فاز، بدون ذرات شنی، ویسکوزیته ظاهری 18-25 mPa.s',
      targetShelfLifeDays: 21,
      sensoryGoals: 'طعم نعنایی باطراوت، اسیدیته ملایم، پس‌مزه مطبوع، عدم وجود طعم ترش زننده یا گچی',
      microbiologicalLimits: 'پروبیوتیک زنده حداقل 10^7 CFU/g، کپک و مخمر کمتر از 10 CFU/ml (استاندارد ۲۸۵۲)'
    },
    targetConsumerProfile: 'عموم مصرف‌کنندگان، علاقه‌مندان به سلامت گوارش، ورزشکاران و کودکان',
    standardReferences: ['استاندارد ملی ایران ۲۸۵۲ (دوغ - ویژگی‌ها و روش‌های آزمون)', 'استاندارد ملی ایران ۱۶۳۲۳ (فرآورده‌های پروبیوتیک)'],
    productionScale: 'pilot',
    standardBatchSizeKg: 100,
    processLossFactorPercent: 2.0,
    activeFormulationId: 'form_doogh_v1',
    formulations: [
      {
        id: 'form_doogh_v1',
        versionCode: 'Formula v1 (مرجع - پکتین HMP)',
        versionNumber: 1,
        title: 'فرمولاسیون پایه با پایدارکننده پکتین',
        description: 'فرمول استاندارد با ماست ست و پکتین متوکسیل بالا برای جلوگیری از سرم‌اندازی در pH اسیدی',
        isBaseline: true,
        changeLogSummary: 'نسخه مرجع پایه اولیه پروژه با استفاده از پکتین HMP به عنوان پایدارکننده اصلی.',
        ingredients: [
          {
            id: 'ing_d1',
            nameFa: 'ماست پاستوریزه کم‌چرب (۱.۵٪ چربی)',
            nameEn: 'Pasteurized Low-Fat Yogurt',
            category: 'solvent_base',
            percentage: 35.0,
            dryMatterPercent: 11.5,
            costPerKg: 38000,
            notes: 'اسیدیته ۹۰ تا ۹۵ درجه دورنیک'
          },
          {
            id: 'ing_d2',
            nameFa: 'آب تصفیه شده RO (اسمز معکوس)',
            nameEn: 'Purified RO Water',
            category: 'solvent_base',
            percentage: 63.35,
            dryMatterPercent: 0,
            costPerKg: 500,
            notes: 'سختی کل کمتر از ۵۰ ppm'
          },
          {
            id: 'ing_d3',
            nameFa: 'نمک طعام تصفیه شده یددار خوراکی',
            nameEn: 'Refined Table Salt',
            category: 'salt_mineral',
            percentage: 0.70,
            dryMatterPercent: 100,
            costPerKg: 12000,
            insNumber: 'INS 500'
          },
          {
            id: 'ing_d4',
            nameFa: 'پایدارکننده پکتین با متوکسیل بالا (HMP)',
            nameEn: 'High Methoxyl Pectin (HMP)',
            category: 'stabilizer_hydrocolloid',
            percentage: 0.40,
            dryMatterPercent: 95,
            costPerKg: 850000,
            insNumber: 'INS 440',
            notes: 'پوشش‌دهی میسل‌های کازئین در pH کمتر از ۴.۲'
          },
          {
            id: 'ing_d5',
            nameFa: 'عصاره هیدروالکلی طبیعی نعناع فلفلی',
            nameEn: 'Natural Peppermint Extract',
            category: 'flavor_aroma',
            percentage: 0.03,
            dryMatterPercent: 15,
            costPerKg: 1200000,
            notes: 'حاوی منتول استانداردشده'
          },
          {
            id: 'ing_d6',
            nameFa: 'کشت لیوفیلیزه پروبیوتیک (L. rhamnosus GG + B. lactis)',
            nameEn: 'Probiotic Culture Freeze-Dried',
            category: 'fortifier_vitamin',
            percentage: 0.02,
            dryMatterPercent: 100,
            costPerKg: 4500000,
            notes: 'تعداد باکتری فعال حداقل 10^11 CFU/g'
          }
        ],
        totalPercentage: 100.0,
        totalDryMatterPercent: 4.88,
        estimatedBrix: 3.2,
        estimatedCostPerKg: 17800,
        notes: 'مجموع درصدها ۱۰۰.۰۰٪ دقیق است.',
        createdAt: '2026-08-15T09:00:00.000Z',
        updatedAt: '2026-08-15T09:00:00.000Z'
      },
      {
        id: 'form_doogh_v2',
        versionCode: 'Formula v2 (آزمایشی - پایدارکننده دوگانه زانتان + ژلان)',
        versionNumber: 2,
        title: 'فرمول آزمایشی با شبکه هیدروکلوئیدی دوگانه',
        description: 'جایگزینی پکتین با ترکیب زانتان و ژلان برای کاهش هزینه و بهبود ویسکوزیته در دهان',
        isBaseline: false,
        baseVersionId: 'form_doogh_v1',
        changeLogSummary: 'حذف پکتین HMP و جایگزینی با ترکیب هم‌افزای زانتان (۰.۱۲٪) و ژلان LA (۰.۰۸٪)؛ کاهش ۱۳.۵٪ در بهای تمام‌شده مواد اولیه.',
        ingredients: [
          {
            id: 'ing_d2_1',
            nameFa: 'ماست پاستوریزه کم‌چرب (۱.۵٪ چربی)',
            category: 'solvent_base',
            percentage: 33.0,
            dryMatterPercent: 11.5,
            costPerKg: 38000
          },
          {
            id: 'ing_d2_2',
            nameFa: 'آب تصفیه شده RO',
            category: 'solvent_base',
            percentage: 65.55,
            dryMatterPercent: 0,
            costPerKg: 500
          },
          {
            id: 'ing_d2_3',
            nameFa: 'نمک طعام تصفیه شده',
            category: 'salt_mineral',
            percentage: 0.70,
            dryMatterPercent: 100,
            costPerKg: 12000
          },
          {
            id: 'ing_d2_4',
            nameFa: 'صمغ زانتان گرید دارویی-خوراکی (Xanthan Gum)',
            category: 'stabilizer_hydrocolloid',
            percentage: 0.12,
            dryMatterPercent: 92,
            costPerKg: 420000,
            insNumber: 'INS 415'
          },
          {
            id: 'ing_d2_5',
            nameFa: 'صمغ ژلان با آسیل پایین (Gellan Gum LA)',
            category: 'stabilizer_hydrocolloid',
            percentage: 0.08,
            dryMatterPercent: 90,
            costPerKg: 950000,
            insNumber: 'INS 418'
          },
          {
            id: 'ing_d2_6',
            nameFa: 'عصاره هیدروالکلی طبیعی نعناع فلفلی',
            category: 'flavor_aroma',
            percentage: 0.03,
            dryMatterPercent: 15,
            costPerKg: 1200000
          },
          {
            id: 'ing_d2_7',
            nameFa: 'کشت لیوفیلیزه پروبیوتیک',
            category: 'fortifier_vitamin',
            percentage: 0.02,
            dryMatterPercent: 100,
            costPerKg: 4500000
          }
        ],
        totalPercentage: 100.0,
        totalDryMatterPercent: 4.68,
        estimatedBrix: 3.0,
        estimatedCostPerKg: 15400,
        notes: 'هزینه تمام‌شده مواد اولیه ۱۳.۵٪ کاهش یافته است.',
        createdAt: '2026-08-16T11:20:00.000Z',
        updatedAt: '2026-08-16T11:20:00.000Z'
      },
      {
        id: 'form_doogh_v3',
        versionCode: 'Formula v3 (بهینه صنعتی - اینولین پری‌بیوتیک و استویا Reb-A)',
        versionNumber: 3,
        title: 'فرمولاسیون سین‌بیوتیک ارتقایافته با اینولین و پکتین بهینه',
        description: 'غنی‌سازی با فیبر پری‌بیوتیک ریشه کاسنی و تعدیل پکتین برای دستیابی به بافت مخملی و افزایش ماندگاری به ۳۰ روز',
        isBaseline: false,
        baseVersionId: 'form_doogh_v1',
        changeLogSummary: 'افزودن ۱.۵۰٪ اینولین پری‌بیوتیک به عنوان فیبر محلول و بهبوددهنده حس دهانی، تعدیل پکتین به ۰.۳۵٪، کاهش نمک به ۰.۶۵٪ و افزایش بریکس به ۳.۸°.',
        ingredients: [
          {
            id: 'ing_d3_1',
            nameFa: 'ماست پاستوریزه کم‌چرب (۱.۵٪ چربی)',
            category: 'solvent_base',
            percentage: 35.0,
            dryMatterPercent: 11.5,
            costPerKg: 38000
          },
          {
            id: 'ing_d3_2',
            nameFa: 'آب تصفیه شده RO',
            category: 'solvent_base',
            percentage: 62.45,
            dryMatterPercent: 0,
            costPerKg: 500
          },
          {
            id: 'ing_d3_3',
            nameFa: 'فیبر پری‌بیوتیک اینولین خوراکی (Inulin HD)',
            category: 'carbohydrate_sugar',
            percentage: 1.50,
            dryMatterPercent: 96,
            brixContribution: 80,
            costPerKg: 320000,
            notes: 'پری‌بیوتیک سینرژیک با سویه‌های پروبیوتیک'
          },
          {
            id: 'ing_d3_4',
            nameFa: 'نمک طعام تصفیه شده یددار',
            category: 'salt_mineral',
            percentage: 0.65,
            dryMatterPercent: 100,
            costPerKg: 12000
          },
          {
            id: 'ing_d3_5',
            nameFa: 'پایدارکننده پکتین با متوکسیل بالا (HMP)',
            category: 'stabilizer_hydrocolloid',
            percentage: 0.35,
            dryMatterPercent: 95,
            costPerKg: 850000,
            insNumber: 'INS 440'
          },
          {
            id: 'ing_d3_6',
            nameFa: 'عصاره هیدروالکلی طبیعی نعناع فلفلی',
            category: 'flavor_aroma',
            percentage: 0.03,
            dryMatterPercent: 15,
            costPerKg: 1200000
          },
          {
            id: 'ing_d3_7',
            nameFa: 'کشت لیوفیلیزه پروبیوتیک',
            category: 'fortifier_vitamin',
            percentage: 0.02,
            dryMatterPercent: 100,
            costPerKg: 4500000
          }
        ],
        totalPercentage: 100.0,
        totalDryMatterPercent: 6.13,
        estimatedBrix: 3.8,
        estimatedCostPerKg: 19800,
        notes: 'بافت خامه‌ای بسیار باکیفیت و ارتقای ارزش تغذیه‌ای محصول با برچسب سین‌بیوتیک (Synbiotic)',
        createdAt: '2026-08-18T14:30:00.000Z',
        updatedAt: '2026-08-18T14:30:00.000Z'
      }
    ],
    processStages: [
      {
        id: 'stg_1',
        stepNumber: 1,
        stageNameFa: 'آماده‌سازی محلول پایدارکننده',
        stageNameEn: 'Stabilizer Hydration & Dissolution',
        descriptionFa: 'حل کردن پکتین در بخشی از آب داغ (۶۵ تا ۷۰ درجه سانتی‌گراد) با دور همزن بالا (۱۵۰۰ RPM) به مدت ۱۰ دقیقه جهت هیدراتاسیون کامل زنجیره‌های پلیمری.',
        temperatureC: '65 - 70',
        durationMinutes: 15,
        equipmentRequired: ['میکسر برشی بالا (High Shear Mixer)', 'تانک دوجداره استنلس استیل ۳۱۶'],
        criticalParameters: { rpmOrShear: '1500 RPM', pressureBar: 1 },
        criticalControlPoint: false,
        controlInstructionsFa: 'اطمینان از عدم تشکیل کلوخه (Fish-eye) در محلول پکتین'
      },
      {
        id: 'stg_2',
        stepNumber: 2,
        stageNameFa: 'اختلاط ماست، آب و نمک',
        stageNameEn: 'Batch Blending & Dilution',
        descriptionFa: 'ترکیب ماست کم‌چرب با آب باقیمانده و نمک و افزودن محلول پکتین آماده‌شده تحت همزدن مداوم و آرام.',
        temperatureC: '15 - 20',
        durationMinutes: 20,
        equipmentRequired: ['تانک فرمولاسیون با پروانه پارویی', 'پمپ سانتریفوژ بهداشتی'],
        criticalParameters: { targetPh: '4.0 - 4.2' },
        criticalControlPoint: false
      },
      {
        id: 'stg_3',
        stepNumber: 3,
        stageNameFa: 'هموژنیزاسیون دو مرحله‌ای',
        stageNameEn: 'Two-Stage Homogenization',
        descriptionFa: 'عبور مخلوط از هموژنایزر فشار بالا جهت یکنواخت‌سازی اندازه ذرات کازئین و کمپلکس هیدروکلوئیدی و جلوگیری از رسوب فاز جامد.',
        temperatureC: '60 - 65',
        durationMinutes: 30,
        equipmentRequired: ['هموژنایزر پیستونی دو مرحله‌ای'],
        criticalParameters: { pressureBar: '150 bar (مرحله ۱: ۱۲۰ بار / مرحله ۲: ۳۰ بار)' },
        criticalControlPoint: true,
        controlInstructionsFa: 'فشار هموژنیزاسیون نباید از ۱۴۰ بار کمتر شود تا یکنواختی بافت حفظ گردد.'
      },
      {
        id: 'stg_4',
        stepNumber: 4,
        stageNameFa: 'پاستوریزاسیون حرارتی مداوم',
        stageNameEn: 'Continuous Thermal Pasteurization',
        descriptionFa: 'پاستوریزاسیون دوغ در سیستم مبدل حرارتی صفحه‌ای جهت غیرفعال‌سازی میکروارگانیسم‌های بیماری‌زا و غیرفعال‌سازی مخمرهای فاسدکننده.',
        temperatureC: 75,
        durationMinutes: '15 ثانیه',
        equipmentRequired: ['پاستوریزاتور صفحه‌ای مداوم (PHE)', 'تانک نگهداری تعادلی'],
        criticalParameters: { pressureBar: 3 },
        criticalControlPoint: true,
        controlInstructionsFa: 'دما بین ۷۴ تا ۷۶ درجه سانتی‌گراد و زمان توقف حداقل ۱۵ ثانیه باشد.'
      },
      {
        id: 'stg_5',
        stepNumber: 5,
        stageNameFa: 'خنک‌سازی سریع و افزودن طعم‌دهنده و پروبیوتیک',
        stageNameEn: 'Cooling, Flavoring & Aseptic Inoculation',
        descriptionFa: 'خنک‌سازی سریع تا دمای زیر ۱۰ درجه سانتی‌گراد در بخش بازیابی حرارت و افزودن عصاره نعناع و باکتری‌های پروبیوتیک زنده تحت شرایط کاملاً استریل.',
        temperatureC: '4 - 8',
        durationMinutes: 15,
        equipmentRequired: ['چیلر آب سرد', 'تانک نگهداری آسپتیک مجهز به فیلتر هوای HEPA'],
        criticalControlPoint: true,
        controlInstructionsFa: 'دما برای حفظ حیات باکتری‌های پروبیوتیک حتماً باید زیر ۲۰ درجه باشد.'
      },
      {
        id: 'stg_6',
        stepNumber: 6,
        stageNameFa: 'پرکنی، درب‌بندی و سیل حرارتی',
        stageNameEn: 'Filling & Induction Sealing',
        descriptionFa: 'پرکنی در بطری‌های PET در محیط کابین فوق‌العاده تمیز (Ultra-clean) و فویل‌سیل حرارتی درب بطری.',
        temperatureC: 4,
        durationMinutes: 20,
        equipmentRequired: ['دستگاه پرکن روتاری بطری', 'سیستم سیل القایی فویل آلومینیوم'],
        criticalControlPoint: false
      }
    ],
    packaging: {
      packageTypeFa: 'بطری پلی‌اتیلن ترفتالات (PET) با پیگمنت سفید مات',
      packagingMaterial: 'PET حاوی جاذب UV و لایه سدگر اکسیژن',
      barrierProperties: {
        oxygenBarrier: 'high',
        moistureBarrier: 'high',
        lightProtection: 'amber'
      },
      atmosphere: 'normal_air',
      netQuantity: '1000 mL (۱ لیتر)',
      storageInstructionsFa: 'در دمای یخچال (۴ تا ۸ درجه سانتی‌گراد) نگهداری شود. قبل از مصرف تکان دهید.',
      targetStorageTemperature: '4°C - 8°C',
      targetShelfLifeDays: 21
    },
    qcSpecifications: [
      {
        id: 'qc_1',
        parameterNameFa: 'اسیدیته قابل تیتر (بر حسب اسید لاکتیک)',
        parameterType: 'physicochemical',
        unit: '% w/w',
        targetValue: '0.45',
        minAcceptableLimit: 0.35,
        maxAcceptableLimit: 0.55,
        standardReference: 'INSO 2852',
        testingMethod: 'تیتراسیون با سود ۰.۱ نرمال در حضور فنل‌فتالئین'
      },
      {
        id: 'qc_2',
        parameterNameFa: 'شاخص pH',
        parameterType: 'physicochemical',
        unit: 'pH',
        targetValue: '4.05',
        minAcceptableLimit: 3.90,
        maxAcceptableLimit: 4.20,
        standardReference: 'INSO 2852',
        testingMethod: 'الکترود شیشه‌ای کالیبره شده در ۲۰ درجه'
      },
      {
        id: 'qc_3',
        parameterNameFa: 'درصد ماده خشک بدون چربی (SNF)',
        parameterType: 'physicochemical',
        unit: '%',
        targetValue: '3.80',
        minAcceptableLimit: 3.20,
        standardReference: 'INSO 2852',
        testingMethod: 'روش وزنی آون ۱۰۲ درجه'
      },
      {
        id: 'qc_4',
        parameterNameFa: 'پایداری سرم و درصد آب‌اندازی (Syneresis)',
        parameterType: 'rheological',
        unit: '%',
        targetValue: '< 3.0',
        maxAcceptableLimit: 5.0,
        testingMethod: 'سانتریفوژ ۳۰۰۰ RPM به مدت ۱۰ دقیقه و اندازه‌گیری حجم سرم رویی'
      },
      {
        id: 'qc_5',
        parameterNameFa: 'شمارش باکتری‌های زنده پروبیوتیک (Viable Count)',
        parameterType: 'microbiological',
        unit: 'CFU/mL',
        targetValue: '>= 1.0 x 10^7',
        minAcceptableLimit: '1.0 x 10^6',
        standardReference: 'INSO 16323',
        testingMethod: 'کشت در محیط اختصاصی MRS-Bile آگار در شرایط بی‌هوازی'
      },
      {
        id: 'qc_6',
        parameterNameFa: 'شمارش کپک و مخمر',
        parameterType: 'microbiological',
        unit: 'CFU/mL',
        targetValue: '< 10',
        maxAcceptableLimit: 50,
        standardReference: 'INSO 2852',
        testingMethod: 'کشت در محیط YGC آگار در دمای ۲۵ درجه'
      }
    ],
    shelfLifeProtocol: [
      {
        id: 'sl_0',
        day: 0,
        conditionType: 'real_time',
        targetParameters: ['pH', 'اسیدیته', 'تعداد پروبیوتیک', 'ارزیابی حسی'],
        acceptanceCriteria: 'انطباق کامل با مشخصات QC روز صفر'
      },
      {
        id: 'sl_7',
        day: 7,
        conditionType: 'real_time',
        targetParameters: ['آب‌اندازی %', 'pH', 'شمارش پروبیوتیک'],
        acceptanceCriteria: 'آب‌اندازی کمتر از ۳٪، پروبیوتیک > 10^7'
      },
      {
        id: 'sl_14',
        day: 14,
        conditionType: 'real_time',
        targetParameters: ['pH', 'اسیدیته', 'شمارش کپک و مخمر', 'طعم و بو'],
        acceptanceCriteria: 'عدم بادکردگی بطری، عدم تغییر طعم نعناع'
      },
      {
        id: 'sl_21',
        day: 21,
        conditionType: 'real_time',
        targetParameters: ['کلیه پارامترهای QC نهایی'],
        acceptanceCriteria: 'شمارش پروبیوتیک حداقل 10^6 CFU/mL، آب‌اندازی < 5%'
      }
    ],
    troubleshootingGuide: [
      {
        id: 'tb_1',
        defectNameFa: 'رسوب کازئین و دوفاز شدن شدید (Serum Separation)',
        defectCategory: 'stability_phase',
        possibleCausesFa: [
          'عدم هیدراتاسیون کامل پکتین پیش از اختلاط با ماست',
          'افت فشار هموژنیزاسیون به کمتر از ۱۰۰ بار',
          'اسیدیته بسیار بالا (pH کمتر از ۳.۸) که بار الکتریکی کازئین را خنثی کرده است'
        ],
        formulationRemediesFa: [
          'افزایش دوز پکتین از ۰.۴۰٪ به ۰.۴۵٪',
          'افزودن ۰.۰۵٪ صمغ زانتان به عنوان هم‌افزا (Synergist)'
        ],
        processRemediesFa: [
          'افزایش دمای انحلال پکتین به ۷۰ درجه و زمان هیدراتاسیون به ۲۰ دقیقه',
          'بررسی کالیبراسیون و گیج فشار هموژنایزر پیستونی'
        ]
      },
      {
        id: 'tb_2',
        defectNameFa: 'بادکردگی بطری و گازدار شدن ناخواسته',
        defectCategory: 'microbial',
        possibleCausesFa: [
          'آلودگی ثانویه با مخمرهای مقاوم به اسید در خط پرکنی',
          'نقص در دمای پاستوریزاتور صفحه‌ای (افت دما به زیر ۷۰ درجه)',
          'نگهداری محصول در دمای بالای ۱۰ درجه در زنجیره توزیع'
        ],
        formulationRemediesFa: [
          'استفاده از عصاره‌های طبیعی ضدمیکروبی دارای پروانه‌های بهداشتی'
        ],
        processRemediesFa: [
          'اجرای پروتکل CIP و شستشوی اسیدی/بازی خط پرکنی و نازل‌ها با سود ۲٪ و اسید نیتریک ۱٪',
          'بررسی سیستم کنترل خودکار دمای پاستوریزاتور (Divert Valve)'
        ]
      }
    ],
    testResults: [
      {
        id: 'tr_01',
        trialDate: '2026-08-18',
        formulationVersionId: 'form_doogh_v1',
        batchNumber: 'BATCH-PILOT-2026-08A',
        scale: 'pilot',
        batchSizeKg: 100,
        measuredParameters: {
          qc_1: { value: 0.44, unit: '%', conforms: true },
          qc_2: { value: 4.02, unit: 'pH', conforms: true },
          qc_3: { value: 3.82, unit: '%', conforms: true },
          qc_4: { value: 1.8, unit: '%', conforms: true },
          qc_5: { value: '3.2 x 10^7', unit: 'CFU/mL', conforms: true },
          qc_6: { value: '< 10', unit: 'CFU/mL', conforms: true }
        },
        sensoryScores: {
          appearance: 8.8,
          texture: 8.5,
          flavor: 9.0,
          aroma: 8.7,
          overallLiking: 8.8,
          panelNotes: 'طعم نعناع کاملاً طبیعی و ملایم، بدون تلخی، احساس دهانی مطلوب و یکنواخت.'
        },
        overallVerdict: 'passed',
        operatorOrScientist: 'دکتر علیرضا رستمی (متخصص فرمولاسیون لبنیات)',
        conclusionsAndNextSteps: 'فرمول F-01 کلیه حدود کیفی و حسی را پوشش داد. نمونه‌ها وارد آزمون ماندگاری ۲۱ روزه شدند.'
      }
    ],
    status: 'pilot_trials',
    leadFoodScientist: 'دکتر علیرضا رستمی',
    createdAt: '2026-08-15T08:30:00.000Z',
    updatedAt: '2026-08-18T14:45:00.000Z',
    isOfflineAvailable: true
  },
  {
    id: 'prd_seed_low_fat_mayo',
    code: 'PRD-SAUCE-002',
    productNameFa: 'سس مایونز کم‌چرب پایدار با استبیلایزر هیدروکلوئیدی',
    productNameEn: 'Reduced-Fat Emulsified Mayonnaise Dressing (30% Oil)',
    category: 'sauces_condiments',
    targetObjectives: ['low_fat', 'cost_reduction', 'texture_optimized'],
    executiveSummaryFa: 'طراحی سس مایونز رژیمی با ۳۰٪ روغن (کاهش ۶۰٪ چربی نسبت به مایونز استاندارد ۷۵٪ چربی) با استفاده از نشاسته اصلاح‌شده و شبکه متقاطع صمغ گزانتان و گوار جهت تقلید کامل بافت کرمی و رفتار ویسکوالاستیک.',
    targetConsumerProfile: 'افراد دارای رژیم‌های کنترل وزن، بیماران قلبی-عروقی و دوستداران تغذیه سالم',
    standardReferences: ['استاندارد ملی ایران ۲۴۵۴ (سس مایونز و سس‌های سالاد - ویژگی‌ها)'],
    productionScale: 'pilot',
    standardBatchSizeKg: 50,
    processLossFactorPercent: 1.5,
    activeFormulationId: 'form_mayo_v1',
    formulations: [
      {
        id: 'form_mayo_v1',
        versionCode: 'F-01 (پایه ۳۰٪ چربی)',
        title: 'مایونز کم‌چرب با نشاسته مودیفای و گزانتان',
        description: 'امولسیون روغن در آب پایدار با سیستم جایگزین چربی بر پایه کربوهیدرات',
        isBaseline: true,
        ingredients: [
          {
            id: 'ing_m1',
            nameFa: 'آب تصفیه شده دیونیزه',
            category: 'solvent_base',
            percentage: 50.80,
            dryMatterPercent: 0,
            costPerKg: 500
          },
          {
            id: 'ing_m2',
            nameFa: 'روغن آفتابگردان تصفیه شده خوراکی',
            category: 'fat_lipid',
            percentage: 30.00,
            dryMatterPercent: 100,
            costPerKg: 75000,
            notes: 'پراکسید کمتر از ۱ meq O2/kg'
          },
          {
            id: 'ing_m3',
            nameFa: 'نشاسته اصلاح‌شده پری‌ژلاتینیزه (مودیفای)',
            category: 'stabilizer_hydrocolloid',
            percentage: 6.50,
            dryMatterPercent: 88,
            costPerKg: 180000,
            insNumber: 'INS 1422',
            notes: 'مقاوم به برش مکانیکی و اسید'
          },
          {
            id: 'ing_m4',
            nameFa: 'زرده تخم‌مرغ پاستوریزه مایع',
            category: 'emulsifier',
            percentage: 4.50,
            dryMatterPercent: 48,
            costPerKg: 140000,
            notes: 'تأمین لسیتین طبیعی'
          },
          {
            id: 'ing_m5',
            nameFa: 'سرکه تقطیری سفید (اسیدیته ۵٪)',
            category: 'acidulant_ph',
            percentage: 4.00,
            dryMatterPercent: 5,
            costPerKg: 15000
          },
          {
            id: 'ing_m6',
            nameFa: 'شکر سفید تصفیه شده',
            category: 'carbohydrate_sugar',
            percentage: 1.50,
            dryMatterPercent: 100,
            costPerKg: 35000
          },
          {
            id: 'ing_m7',
            nameFa: 'نمک طعام خوراکی تصفیه شده',
            category: 'salt_mineral',
            percentage: 1.20,
            dryMatterPercent: 100,
            costPerKg: 12000
          },
          {
            id: 'ing_m8',
            nameFa: 'پودر خردل دیژون استاندارد',
            category: 'flavor_aroma',
            percentage: 0.80,
            dryMatterPercent: 92,
            costPerKg: 280000
          },
          {
            id: 'ing_m9',
            nameFa: 'صمغ گزانتان (Xanthan Gum 200 Mesh)',
            category: 'stabilizer_hydrocolloid',
            percentage: 0.40,
            dryMatterPercent: 92,
            costPerKg: 420000,
            insNumber: 'INS 415'
          },
          {
            id: 'ing_m10',
            nameFa: 'صمغ گوار هیدروکلریدی (Guar Gum)',
            category: 'stabilizer_hydrocolloid',
            percentage: 0.15,
            dryMatterPercent: 90,
            costPerKg: 340000,
            insNumber: 'INS 412'
          },
          {
            id: 'ing_m11',
            nameFa: 'اسید سیتریک آنهیدروز خوراکی',
            category: 'acidulant_ph',
            percentage: 0.10,
            dryMatterPercent: 100,
            costPerKg: 85000,
            insNumber: 'INS 330'
          },
          {
            id: 'ing_m12',
            nameFa: 'بنزوات سدیم و سوربات پتاسیم مجاز',
            category: 'preservative_antioxidant',
            percentage: 0.05,
            dryMatterPercent: 100,
            costPerKg: 240000,
            insNumber: 'INS 202/211'
          }
        ],
        totalPercentage: 100.0,
        totalDryMatterPercent: 41.20,
        estimatedBrix: 8.5,
        estimatedCostPerKg: 42300,
        notes: 'مجموع درصدها ۱۰۰.۰۰٪ دقیق است.',
        createdAt: '2026-08-10T10:00:00.000Z',
        updatedAt: '2026-08-10T10:00:00.000Z'
      }
    ],
    processStages: [
      {
        id: 'stg_m1',
        stepNumber: 1,
        stageNameFa: 'هیدراتاسیون نشاسته و هیدروکلوئیدها در فاز آبی',
        stageNameEn: 'Aqueous Phase Prep & Hydrocolloid Hydration',
        descriptionFa: 'حل کردن نشاسته مودیفای، گزانتان، گوار، شکر و نمک در آب در تانک توربینی با دور بالا (۲۵۰۰ RPM) تا ژل یکنواخت و بدون گره حاصل شود.',
        temperatureC: '40 - 45',
        durationMinutes: 20,
        equipmentRequired: ['میکسر هموژنایزر تحت خلاء (Vacuum Homogenizer Mixer)'],
        criticalControlPoint: false
      },
      {
        id: 'stg_m2',
        stepNumber: 2,
        stageNameFa: 'افزودن زرده تخم‌مرغ و امولسیون‌سازی مداوم روغن',
        stageNameEn: 'Egg Inoculation & Slow Oil Dosing Emulsification',
        descriptionFa: 'افزودن زرده تخم‌مرغ و سپس تزریق قطره‌ای و پیوسته روغن تحت خلأ منفی ۰.۶ بار و برش مکانیکی بسیار بالا جهت تشکیل قطرات ریز امولسیون.',
        temperatureC: '20 - 25',
        durationMinutes: 25,
        equipmentRequired: ['میکسر روتور-استاتور برش بالا (Rotor-Stator High Shear)'],
        criticalParameters: { vacuumMbar: 600, rpmOrShear: '3000 RPM' },
        criticalControlPoint: true,
        controlInstructionsFa: 'روغن باید به تدریج وارد شود تا شکست امولسیون رخ ندهد.'
      },
      {
        id: 'stg_m3',
        stepNumber: 3,
        stageNameFa: 'تنظیم اسیدیته و افزودن سرکه و ادویه‌جات',
        stageNameEn: 'Acidification & Flavor Finalization',
        descriptionFa: 'افزودن سرکه، پودر خردل، اسید سیتریک و نگهدارنده‌ها در انتهای فرآیند جهت رسیدن به pH ایمن کمتر از ۳.۸.',
        temperatureC: 22,
        durationMinutes: 10,
        equipmentRequired: ['میکسر وکیوم'],
        criticalParameters: { targetPh: '3.6 - 3.8' },
        criticalControlPoint: true
      },
      {
        id: 'stg_m4',
        stepNumber: 4,
        stageNameFa: 'دی‌هوادهی و بسته‌بندی در جار و ساشه',
        stageNameEn: 'Deaeration & Packaging',
        descriptionFa: 'حذف حباب‌های هوای محبوس تحت خلأ بالا (-0.8 bar) جهت جلوگیری از اکسیداسیون و پرکنی در ظروف دربسته.',
        temperatureC: 20,
        durationMinutes: 15,
        equipmentRequired: ['دستگاه پرکن سس پیستونی تحت خلاء'],
        criticalControlPoint: false
      }
    ],
    packaging: {
      packageTypeFa: 'جار شیشه‌ای با درب فلزی تویست‌آف و ساشه متالایز',
      packagingMaterial: 'شیشه بوروسیلیکات / فویل چندلایه PET/ALU/PE',
      barrierProperties: {
        oxygenBarrier: 'ultra_high',
        moistureBarrier: 'ultra_high',
        lightProtection: 'opaque_full'
      },
      atmosphere: 'vacuum',
      netQuantity: '450 g',
      storageInstructionsFa: 'در جای خشک، خنک و دور از نور مستقیم آفتاب نگهداری شود. پس از باز شدن در یخچال نگهداری گردد.',
      targetStorageTemperature: '15°C - 25°C',
      targetShelfLifeDays: 180
    },
    qcSpecifications: [
      {
        id: 'qc_m1',
        parameterNameFa: 'درصد چربی کل (Total Fat %)',
        parameterType: 'physicochemical',
        unit: '%',
        targetValue: '30.0',
        minAcceptableLimit: 28.0,
        maxAcceptableLimit: 32.0,
        standardReference: 'INSO 2454',
        testingMethod: 'روش اسید بوتیرومتری گربر یا ژربلی'
      },
      {
        id: 'qc_m2',
        parameterNameFa: 'شاخص pH محصول',
        parameterType: 'physicochemical',
        unit: 'pH',
        targetValue: '3.65',
        minAcceptableLimit: 3.50,
        maxAcceptableLimit: 3.80,
        standardReference: 'INSO 2454',
        testingMethod: 'pH متر دیجیتال کالیبره'
      },
      {
        id: 'qc_m3',
        parameterNameFa: 'پایداری امولسیون تحت گریز از مرکز (Emulsion Stability)',
        parameterType: 'rheological',
        unit: '%',
        targetValue: '>= 98.0',
        minAcceptableLimit: 95.0,
        testingMethod: 'سانتریفوژ در ۴۰۰۰ RPM به مدت ۳۰ دقیقه در ۵۰ درجه'
      },
      {
        id: 'qc_m4',
        parameterNameFa: 'ویسکوزیته بروکفیلد (Brookfield Viscosity)',
        parameterType: 'rheological',
        unit: 'cP',
        targetValue: '48000',
        minAcceptableLimit: 40000,
        maxAcceptableLimit: 60000,
        testingMethod: 'ویسکومتر بروکفیلد با اسپیندل Helipath T-F در دور ۵ RPM'
      }
    ],
    shelfLifeProtocol: [
      {
        id: 'sl_m0',
        day: 0,
        conditionType: 'real_time',
        targetParameters: ['ویسکوزیته', 'pH', 'پایداری امولسیون'],
        acceptanceCriteria: 'پایداری امولسیون بالای ۹۸٪'
      },
      {
        id: 'sl_m30',
        day: 30,
        conditionType: 'accelerated_37C',
        targetParameters: ['عدد پراکسید', 'ویسکوزیته', 'رنگ و طعم'],
        acceptanceCriteria: 'پراکسید کمتر از ۲ meq/kg'
      },
      {
        id: 'sl_m90',
        day: 90,
        conditionType: 'real_time',
        targetParameters: ['کلیه آزمون‌های شیمیایی و میکروبی'],
        acceptanceCriteria: 'عدم دوفاز شدن و طعم تند اکسیداسیون'
      }
    ],
    troubleshootingGuide: [
      {
        id: 'tb_m1',
        defectNameFa: 'شکست امولسیون و روغنی شدن سطح سس (Oil Separation)',
        defectCategory: 'stability_phase',
        possibleCausesFa: [
          'افزودن سریع روغن در ابتدای فرآیند پیش از شکل‌گیری هسته‌های اولیه امولسیون',
          'دمای بالای بچ (بیش از ۳۵ درجه) در هنگام برش مکانیکی',
          'نسبت ناکافی زرده تخم‌مرغ یا تخریب لسیتین'
        ],
        formulationRemediesFa: [
          'افزایش درصد زرده تخم‌مرغ از ۴.۵٪ به ۵.۰٪',
          'افزایش صمغ گزانتان به ۰.۴۵٪ برای افزایش ویسکوزیته فاز پیوسته'
        ],
        processRemediesFa: [
          'کاهش دبی تزریق روغن و روشن کردن سیستم سرمایش تانک وکیوم',
          'کنترل دور روتور-استاتور برای جلوگیری از تنش حرارتی موضعی'
        ]
      }
    ],
    testResults: [],
    status: 'formulation_design',
    leadFoodScientist: 'مهندس سارا نیک‌پیام (محقق توسعه فرمولاسیون سس و چاشنی)',
    createdAt: '2026-08-10T09:15:00.000Z',
    updatedAt: '2026-08-12T16:20:00.000Z',
    isOfflineAvailable: true
  }
];

/**
 * Ensures initial seed food product development projects exist in IndexedDB
 */
export async function seedInitialProductProjectsIfEmpty(): Promise<void> {
  try {
    const existing = await getAllItems<ProductDevelopmentProject>(STORES.FOOD_PRODUCTS);
    if (existing.length === 0) {
      for (const proj of SEED_PROJECTS) {
        await putItem(STORES.FOOD_PRODUCTS, proj);
      }
    }
  } catch (err) {
    console.error('Error seeding initial food product projects:', err);
  }
}

/**
 * Gets all product development projects sorted by updatedAt descending
 */
export async function getAllProductProjects(): Promise<ProductDevelopmentProject[]> {
  try {
    await seedInitialProductProjectsIfEmpty();
    const items = await getAllItems<ProductDevelopmentProject>(STORES.FOOD_PRODUCTS);
    return items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.error('Failed to get product projects from IndexedDB:', err);
    return [];
  }
}

/**
 * Gets a single product project by ID
 */
export async function getProductProjectById(id: string): Promise<ProductDevelopmentProject | null> {
  try {
    const item = await getItem<ProductDevelopmentProject>(STORES.FOOD_PRODUCTS, id);
    return item || null;
  } catch (err) {
    console.error(`Failed to fetch product project ${id}:`, err);
    return null;
  }
}

/**
 * Saves or updates a product development project
 */
export async function saveProductProject(project: ProductDevelopmentProject): Promise<void> {
  try {
    const now = new Date().toISOString();
    
    // Automatically recompute formulation summaries before saving
    const updatedFormulations = project.formulations.map(form => {
      const summary = calculateFormulationSummary(form.ingredients);
      return {
        ...form,
        totalPercentage: summary.totalPercentage,
        totalDryMatterPercent: summary.totalDryMatterPercent,
        estimatedBrix: summary.estimatedBrix,
        estimatedCostPerKg: summary.estimatedCostPerKg,
        updatedAt: now
      };
    });

    const projectToSave: ProductDevelopmentProject = {
      ...project,
      formulations: updatedFormulations,
      updatedAt: now,
      isOfflineAvailable: true
    };

    await putItem(STORES.FOOD_PRODUCTS, projectToSave);
  } catch (err) {
    console.error('Failed to save product project in IndexedDB:', err);
    throw err;
  }
}

/**
 * Deletes a product project by ID
 */
export async function deleteProductProject(id: string): Promise<void> {
  try {
    await deleteItem(STORES.FOOD_PRODUCTS, id);
  } catch (err) {
    console.error(`Failed to delete product project ${id}:`, err);
    throw err;
  }
}

/**
 * Duplicates an existing product project with a new ID
 */
export async function duplicateProductProject(id: string): Promise<ProductDevelopmentProject | null> {
  const original = await getProductProjectById(id);
  if (!original) return null;

  const now = new Date().toISOString();
  const newId = `prd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const duplicated: ProductDevelopmentProject = {
    ...JSON.parse(JSON.stringify(original)),
    id: newId,
    code: `${original.code}-COPY`,
    productNameFa: `${original.productNameFa} (نسخه کپی)`,
    status: 'idea_draft',
    createdAt: now,
    updatedAt: now
  };

  await saveProductProject(duplicated);
  return duplicated;
}

/**
 * Creates a brand new empty product development project with initial base structure
 */
export function createNewProductProject(options: {
  productNameFa: string;
  productNameEn?: string;
  category: ProductDevelopmentProject['category'];
  targetObjectives: ProductDevelopmentProject['targetObjectives'];
  executiveSummaryFa: string;
  leadFoodScientist: string;
  productionScale?: ProductDevelopmentProject['productionScale'];
  standardBatchSizeKg?: number;
}): ProductDevelopmentProject {
  const now = new Date().toISOString();
  const id = `prd_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const initialFormulationId = `form_${Date.now()}_base`;

  const initialFormulation: FormulationVersion = {
    id: initialFormulationId,
    versionCode: 'F-01 (پایه)',
    title: 'فرمولاسیون اولیه پایه',
    description: 'نسخه آزمایشی اولیه طراحی شده در آزمایشگاه',
    isBaseline: true,
    ingredients: [
      {
        id: `ing_${Date.now()}_1`,
        nameFa: 'آب یا ماده پایه حلال',
        category: 'solvent_base',
        percentage: 80.0,
        dryMatterPercent: 0,
        costPerKg: 1000
      },
      {
        id: `ing_${Date.now()}_2`,
        nameFa: 'ماده اصلی / فاز جامد',
        category: 'carbohydrate_sugar',
        percentage: 20.0,
        dryMatterPercent: 100,
        costPerKg: 40000
      }
    ],
    totalPercentage: 100.0,
    totalDryMatterPercent: 20.0,
    estimatedBrix: 20.0,
    estimatedCostPerKg: 8800,
    createdAt: now,
    updatedAt: now
  };

  return {
    id,
    code: `PRD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    productNameFa: options.productNameFa,
    productNameEn: options.productNameEn,
    category: options.category,
    targetObjectives: options.targetObjectives,
    executiveSummaryFa: options.executiveSummaryFa,
    standardReferences: [],
    formulations: [initialFormulation],
    activeFormulationId: initialFormulationId,
    processStages: [
      {
        id: `stg_${Date.now()}_1`,
        stepNumber: 1,
        stageNameFa: 'آماده‌سازی و توزین مواد اولیه',
        descriptionFa: 'توزین دقیق اجزای فرمولاسیون بر اساس بچ هدف و کنترل کیفیت فیزیکی مواد خام.',
        equipmentRequired: ['ترازوی دقیق صنعتی', 'مخازن توزین استیل'],
        criticalControlPoint: false
      },
      {
        id: `stg_${Date.now()}_2`,
        stepNumber: 2,
        stageNameFa: 'اختلاط و انحلال',
        descriptionFa: 'ترکیب اجزای خشک در فاز مایع تحت شرایط همزدن مناسب جهت دستیابی به مخلوط کاملاً همگن.',
        equipmentRequired: ['میکسر / بلندر مخزنی'],
        criticalControlPoint: false
      }
    ],
    productionScale: options.productionScale || 'lab',
    standardBatchSizeKg: options.standardBatchSizeKg || 5,
    processLossFactorPercent: 2.0,
    packaging: {
      packageTypeFa: 'ظروف پلی‌اتیلن بهداشتی با درب غیرقابل نفوذ',
      packagingMaterial: 'پلیمر فودگرید HDPE/PET',
      barrierProperties: {
        oxygenBarrier: 'medium',
        moistureBarrier: 'high',
        lightProtection: 'transparent'
      },
      atmosphere: 'normal_air',
      netQuantity: '500 g',
      storageInstructionsFa: 'در شرایط دمایی و رطوبتی استاندارد نگهداری شود.',
      targetStorageTemperature: '4°C - 8°C',
      targetShelfLifeDays: 30
    },
    qcSpecifications: [
      {
        id: `qc_${Date.now()}_1`,
        parameterNameFa: 'درصد ماده خشک کل (Total Solids)',
        parameterType: 'physicochemical',
        unit: '%',
        targetValue: '20.0',
        minAcceptableLimit: 18.0,
        maxAcceptableLimit: 22.0,
        testingMethod: 'روش وزنی خشک‌کردن در آون ۱۰۵ درجه'
      }
    ],
    shelfLifeProtocol: [],
    troubleshootingGuide: [],
    testResults: [],
    status: 'idea_draft',
    leadFoodScientist: options.leadFoodScientist,
    createdAt: now,
    updatedAt: now,
    isOfflineAvailable: true
  };
}
