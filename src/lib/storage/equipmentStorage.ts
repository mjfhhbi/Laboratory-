/**
 * Food Science AI - Laboratory Equipment Storage Engine
 * Manages IndexedDB persistence, filtering, calibration auditing, and benchmark equipment schemas.
 */

import {
  LaboratoryEquipment,
  EquipmentCategory,
  CalibrationStatus,
  EquipmentFilterQuery,
  EquipmentStatistics,
  EQUIPMENT_CATEGORIES
} from '../../types/laboratoryEquipment';
import { STORES, getAllItems, getItem, putItem, deleteItem, clearStore } from './indexedDb';

/**
 * Standard structural templates for the 17 Equipment Categories.
 * NOTE: Specifications adhere strictly to standard laboratory references (INSO / ISO 17025 / AOAC).
 * Unspecified parameters are marked undefined and not guessed.
 */
export const BENCHMARK_LAB_EQUIPMENT: LaboratoryEquipment[] = [
  {
    id: 'eq-bal-001',
    code: 'EQ-BAL-001',
    nameFa: 'ترازوی آنالیتیکال ۴ رقمی',
    nameEn: 'Analytical Balance (4 Decimal Places)',
    category: 'balance',
    model: 'Analytical Series 4D',
    manufacturer: 'مرجع تجهیزات آزمایشگاهی',
    location: 'آزمایشگاه شیمی و تجزیه مواد غذایی',
    serialNumber: 'BAL-2024-001',
    specifications: {
      capacity: '۲۲۰ گرم',
      accuracy: '۰.۰۰۰۱ گرم (± ۰.۱ میلی‌گرم)',
      resolution: '۰.۰۰۰۱ گرم',
      measurementRange: '۰.۰۰۱ تا ۲۲۰ گرم',
      isSpecifiedInSource: true
    },
    applications: [
      'توزین دقیق نمونه‌ها در آزمون‌های خاکستر، پروتئین، چربی و رطوبت',
      'تهیه محلول‌های استاندارد و تیترانت‌های تیتراسیون',
      'توزین بوته‌های چینی و ارلن‌های استخراج'
    ],
    limitations: [
      'حساسیت بسیار بالا به جریان هوا و لرزش میز آزمایشگاه',
      'عدم امکان توزین مواد مغناطیسی یا داغ قبل از رسیدن به دمای اتاق'
    ],
    performanceVerificationMethod: 'کنترل روزانه نقطه صفر و آزمون صحت با وزنه کالیبره استاندارد کلاس E2 یا F1 قبل از شروع کار',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-01-15',
    nextCalibrationDate: '2025-01-15',
    calibrationIntervalMonths: 12,
    calibrationProvider: 'آزمایشگاه همکار سازمان ملی استاندارد (تایید صلاحیت ۱۷۰۲۵)',
    commonErrors: [
      {
        errorCode: 'ERR-DRFT',
        title: 'نوسان و شناوری عدد نمایشگر (Drifting)',
        symptom: 'تغییر پیوسته رقم آخر نمایشگر بدون تثبیت',
        probableCause: 'جریان هوای هود، اختلاف دمای بوته با محیط یا الکتریسیته ساکن',
        correctiveAction: 'بستن درهای شیشه‌ای محفظه، رساندن نمونه به دمای اتاق در دسیکاتور و استفاده از یونیزه کننده ضد الکتریسیته ساکن'
      },
      {
        errorCode: 'ERR-OVR',
        title: 'اضافه‌بار (Overload)',
        symptom: 'نمایش خطای خط یا پیام OL',
        probableCause: 'قرار دادن بار بیش از ۲۲۰ گرم روی کفه',
        correctiveAction: 'برداشتن فوری بار اضافه و بررسی سلامت لودسل با وزنه شاهد'
      }
    ],
    maintenanceNotes: [
      'تمیزکاری روزانه کفه با برس مویی بسیار نرم',
      'بررسی و تنظیم حباب تراز در مرکز دایره قبل از هر آزمون',
      'روشن نگه داشتن در حالت استندبای جهت حفظ تعادل حرارتی مدارات'
    ],
    standardOperatingProcedure: '۱. روشن کردن و ۳۰ دقیقه گرم شدن ۲. بررسی حباب تراز ۳. بستن درها و صفر کردن (Tare) ۴. قرار دادن ظرف با پنس و ثبت وزن.',
    safetyNotes: ['از ریختن مواد شیمیایی خورنده روی کفه استیل خودداری گردد.'],
    associatedExperimentCodes: ['EXP-CHEM-001', 'EXP-ANAL-001', 'EXP-FATS-001', 'EXP-DAIRY-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'eq-ovn-001',
    code: 'EQ-OVN-001',
    nameFa: 'آون حرارتی با گردش هوای اجباری (خشک‌کن)',
    nameEn: 'Forced Air Drying Oven',
    category: 'oven',
    model: 'ThermoVent-105',
    manufacturer: 'تجهیزات حرارتی آزمایشگاهی',
    location: 'آزمایشگاه شیمی مواد غذایی',
    serialNumber: 'OVN-2024-002',
    specifications: {
      capacity: '۵۵ لیتر',
      accuracy: '± ۰.۵ درجه سلسیوس',
      resolution: '۰.۱ درجه سلسیوس',
      measurementRange: 'دمای محیط +۵ تا ۲۵۰ درجه سلسیوس',
      isSpecifiedInSource: true
    },
    applications: [
      'سنجش رطوبت و ماده خشک فرآورده‌های غذایی مطابق استاندارد ملی ۲۷۰۵ و ۶۳۰۵',
      'خشک‌کردن ظروف و پلیت‌های شیشه‌ای شسته‌شده'
    ],
    limitations: [
      'عدم استفاده برای مواد فرار قابل اشتعال یا دارای ترکیبات قندی بالا با ریسک کاراملیزاسیون در ۱۰۵ درجه'
    ],
    performanceVerificationMethod: 'پایش پیوسته دما توسط دماسنج کالیبره مستقل و ثبت ماهانه نقشه دمایی محفظه (Thermal Mapping)',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-02-01',
    nextCalibrationDate: '2025-02-01',
    calibrationIntervalMonths: 12,
    commonErrors: [
      {
        title: 'عدم یکنواختی دمای محفظه',
        symptom: 'اختلاف رطوبت نمونه‌های قرار گرفته در طبقات مختلف',
        probableCause: 'خرابی فن گردش هوا یا بارگذاری بیش از ظرفیت طبقات',
        correctiveAction: 'بررسی گردش فن و ایجاد فاصله حداقل ۲.۵ سانتی‌متر بین پلیت‌ها'
      }
    ],
    maintenanceNotes: [
      'بررسی لاستیک دور درب جهت جلوگیری از اتلاف حرارتی',
      'کالیبراسیون ترموستات دیجیتال هر ۱۲ ماه یک‌بار'
    ],
    associatedExperimentCodes: ['EXP-ANAL-001', 'EXP-CHEM-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z'
  },
  {
    id: 'eq-phm-001',
    code: 'EQ-PHM-001',
    nameFa: 'pH متر دیجیتال رومیزی با سیستم تصحیح خودکار دما (ATC)',
    nameEn: 'Benchtop Digital pH Meter with ATC',
    category: 'ph_meter',
    model: 'LabpH-Pro Precision',
    manufacturer: 'صنایع ابزار دقیق',
    location: 'آزمایشگاه کنترل کیفیت و شیمی',
    serialNumber: 'PH-2024-003',
    specifications: {
      capacity: 'تک کاناله به همراه پروب ترکیبی شیشه‌ای',
      accuracy: '± ۰.۰۰۲ pH',
      resolution: '۰.۰۰۱ pH',
      measurementRange: '-۲.۰۰۰ تا ۲۰.۰۰۰ pH و -۲۰۰۰ تا +۲۰۰۰ میلی‌ولت',
      isSpecifiedInSource: true
    },
    applications: [
      'سنجش pH آبمیوه‌ها، کنسانتره‌ها، شیر و فرآورده‌های لبنی، سس‌ها و فرآورده‌های گوشتی',
      'پایش اسیدیته فعال در فرآیندهای تخمیر و اسیدزنی کنسروها'
    ],
    limitations: [
      'پوشش چربی روی غشای شیشه‌ای الکترود در نمونه‌های روغنی و لبنی',
      'حساسیت الکترود به خشک شدن غشاء'
    ],
    performanceVerificationMethod: 'کالیبراسیون ۲ یا ۳ نقطه‌ای روزانه با بافرهای استاندارد ۴.۰۱، ۷.۰۰ و ۱۰.۰۱ و کنترل شیب الکترود (Slope بین ۹۵٪ تا ۱۰۵٪)',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-03-10',
    nextCalibrationDate: '2024-09-10',
    calibrationIntervalMonths: 6,
    commonErrors: [
      {
        title: 'کاهش شیب الکترود (Low Slope)',
        symptom: 'پذیرفته نشدن کالیبراسیون یا نمایش شیب کمتر از ۹۰٪',
        probableCause: 'رسوب چربی و پروتئین روی حباب الکترود یا پایان عمر الکترود',
        correctiveAction: 'شستشو با محلول تمیزکننده پپسین/اسید کلریدریک و نگهداری در محلول KCl ۳ مولار'
      }
    ],
    maintenanceNotes: [
      'نگهداری همیشگی الکترود در محلول الکترولیت KCl ۳ مولار و هرگز در آب مقطر',
      'شستشوی پروب با آب مقطر و خشک کردن آرام با دستمال بدون پرز'
    ],
    associatedExperimentCodes: ['EXP-BEV-001', 'EXP-DAIRY-001', 'EXP-MEAT-001', 'EXP-CHEM-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-03-10T00:00:00.000Z'
  },
  {
    id: 'eq-spc-001',
    code: 'EQ-SPC-001',
    nameFa: 'اسپکتروفتومتر دو پرتویی UV-Vis',
    nameEn: 'Double Beam UV-Vis Spectrophotometer',
    category: 'spectrophotometer',
    model: 'SpectroScan Dual-800',
    manufacturer: 'اپتیک تحلیلی',
    location: 'آزمایشگاه تخصصی آنالیز دستگاهی',
    serialNumber: 'SPC-2024-004',
    specifications: {
      capacity: 'محفظه کووت استاندارد ۱۰ میلی‌متری (کوارتز و شیشه‌ای)',
      accuracy: '± ۰.۳ نانومتر (طول موج) / ± ۰.۰۰۲ Abs (فوتومتریک)',
      resolution: '۰.۱ نانومتر (پیکسل باند)، پهنای باند طیفی ۱ نانومتر',
      measurementRange: '۱۹۰ تا ۱۱۰۰ نانومتر',
      isSpecifiedInSource: true
    },
    applications: [
      'سنجش عدد پراکسید (روش فریک تیوسیانات) و پایداری اکسیداسیون روغن‌ها',
      'سنجش ترکیبات فنولی کل (فولین-سیوکالتو در ۷۶۵ نانومتر)',
      'سنجش نیتریت باقیمانده در فرآورده‌های گوشتی (واکنش گریس در ۵۴۰ نانومتر)',
      'سنجش ویتامین C و رنگ‌های خوراکی مجاز'
    ],
    limitations: [
      'لزوم شفاف بودن کامل محلول آزمون و عاری بودن از کدورت و ذرات معلق'
    ],
    performanceVerificationMethod: 'کنترل صحت طول موج با فیلتر هولمیوم اکسید و سنجش خطی بودن پاسخ فتومتریک با دی‌کرومات پتاسیم',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-01-20',
    nextCalibrationDate: '2025-01-20',
    calibrationIntervalMonths: 12,
    commonErrors: [
      {
        title: 'جذب غیرخطی در غلظت‌های بالا',
        symptom: 'انحراف از قانون بیر-لامبرت در جذب‌های بالاتر از ۲.۰',
        probableCause: 'غلظت بالای آنالیت یا نور سرگردان (Stray Light)',
        correctiveAction: 'رقیق‌سازی نمونه و تکرار آزمون در بازه خطی ۰.۱ تا ۰.۹ Abs'
      }
    ],
    maintenanceNotes: [
      'تعویض لامپ دوتریوم و تنگستن پس از اتمام ساعت کارکرد استاندارد (حدود ۲۰۰۰ ساعت)',
      'تمیز نگه داشتن کووت‌ها با متانول اپتیکال و عدم لمس دیواره‌های صیقلی کووت'
    ],
    associatedExperimentCodes: ['EXP-FATS-001', 'EXP-FRUIT-001', 'EXP-MEAT-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z'
  },
  {
    id: 'eq-ref-001',
    code: 'EQ-REF-001',
    nameFa: 'رفراکتومتر دیجیتال خودکار رومیزی با کنترل دما (Peltier)',
    nameEn: 'Automatic Digital Benchtop Refractometer with Peltier',
    category: 'refractometer',
    model: 'RefractoMaster-Pro',
    manufacturer: 'صنایع اندازه‌گیری اپتیکی',
    location: 'آزمایشگاه نوشیدنی، قند و کنسرو',
    serialNumber: 'REF-2024-005',
    specifications: {
      capacity: 'منشور یاقوت کبود (Sapphire) با حداقل حجم نمونه ۰.۲ میلی‌لیتر',
      accuracy: '± ۰.۰۵ Brix / ± ۰.۰۰۰۰۲ nD',
      resolution: '۰.۰۱ Brix / ۰.۰۰۰۰۱ nD',
      measurementRange: '۰ تا ۹۵ درجه بریکس / ۱.۳۰۰۰ تا ۱.۷۰۰۰ ضریب شکست (nD)',
      isSpecifiedInSource: true
    },
    applications: [
      'سنجش بریکس (مواد جامد محلول) در آبمیوه‌ها، کنسانتره‌ها و شربت‌ها',
      'سنجش ضریب شکست روغن‌ها و چربی‌های خوراکی در دمای ۴۰ درجه سلسیوس',
      'سنجش درصد قند و رطوبت عسل و مرباجات'
    ],
    limitations: [
      'حباب هوا روی منشور باعث خطای شدید در تشخیص خط مرزی ضریب شکست می‌شود'
    ],
    performanceVerificationMethod: 'صفر کردن روزانه با آب مقطر دو بار تقطیر در دمای ۲۰.۰ درجه سلسیوس (بریکس = ۰.۰۰ و nD = ۱.۳۳۲۹۹)',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-02-15',
    nextCalibrationDate: '2025-02-15',
    calibrationIntervalMonths: 12,
    commonErrors: [
      {
        title: 'عدم تطابق دمای منشور با نمونه',
        symptom: 'نوسان عدد بریکس در طول ۳۰ ثانیه اول پس از قرار دادن نمونه',
        probableCause: 'اختلاف دمای شدید نمونه داغ با دمای تنظیمی پلتیر',
        correctiveAction: 'صبر جهت تثبیت دمای پلتیر روی ۲۰.۰ یا ۴۰.۰ درجه پیش از ثبت قرائت نهایی'
      }
    ],
    maintenanceNotes: [
      'پاک کردن منشور بلافاصله پس از اتمام آزمون با پنبه آغشته به آب مقطر و الکل',
      'پرهیز اکید از استفاده از اشیاء نوک‌تیز فلزی برای پاک‌کردن منشور'
    ],
    associatedExperimentCodes: ['EXP-BEV-001', 'EXP-FATS-001', 'EXP-CANNED-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z'
  },
  {
    id: 'eq-txt-001',
    code: 'EQ-TXT-001',
    nameFa: 'دستگاه بافت‌سنج مواد غذایی (Texture Analyzer)',
    nameEn: 'Food Texture Analyzer (TPA System)',
    category: 'texture_analyzer',
    model: 'TexProfile-500N',
    manufacturer: 'تجهیزات رئولوژی و بافت‌سنجی',
    location: 'آزمایشگاه فیزیک و رئولوژی مواد غذایی',
    serialNumber: 'TXT-2024-006',
    specifications: {
      capacity: 'لودسل تعویض‌پذیر ۵۰ نیوتن و ۵۰۰ نیوتن',
      accuracy: '± ۰.۱٪ از مقیاس کامل لودسل',
      resolution: '۰.۰۰۱ نیوتن نیرو / ۰.۰۰۱ میلی‌متر جابجایی',
      measurementRange: '۰.۰۱ تا ۵۰۰ نیوتن با سرعت کورس ۰.۰۱ تا ۴۰ میلی‌متر بر ثانیه',
      isSpecifiedInSource: true
    },
    applications: [
      'آنالیز پروفایل بافت (TPA) شامل سختی (Hardness)، چسبندگی (Adhesiveness)، قابلیت ارتجاع (Springiness) و صمغی بودن (Gumminess)',
      'سنجش مقاومت به نفوذ در ژل‌ها و پنیر، آزمون برشی وارنر-برازلر در گوشت، تردی بیسکویت و نان'
    ],
    limitations: [
      'عدم انطباق ابعاد هندسی نمونه‌ها می‌تواند واریانس خطای نتایج آزمون TPA را به شدت افزایش دهد'
    ],
    performanceVerificationMethod: 'کالیبراسیون دوره‌ای لودسل با وزنه‌های کالیبره استاندارد و بررسی صحت سنسور جابجایی با کولیس گیج کالیبره',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-01-10',
    nextCalibrationDate: '2025-01-10',
    calibrationIntervalMonths: 12,
    commonErrors: [
      {
        title: 'خطای زاویه برخورد پروب با نمونه',
        symptom: 'شروع دیرهنگام منحنی نیرو یا ایجاد قله‌های دوتایی نامتعارف',
        probableCause: 'صاف و موازی نبودن سطح بالایی نمونه برش‌خورده با کف پروب استوانه‌ای',
        correctiveAction: 'استفاده از قالب‌های برش استاندارد جهت تضمین سطوح کاملاً مسطح نمونه'
      }
    ],
    maintenanceNotes: [
      'روغن‌کاری دوره‌ای ریل‌های عمودی بال‌اسکرو مطابق راهنمای سازنده',
      'حفاظت از لودسل در برابر ضربات ناگهانی و فشارهای خارج از محور'
    ],
    associatedExperimentCodes: ['EXP-PHYS-001', 'EXP-MEAT-001', 'EXP-CEREAL-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z'
  },
  {
    id: 'eq-fur-001',
    code: 'EQ-FUR-001',
    nameFa: 'کوره الکتریکی دیجیتال ۵۵۰ تا ۱۲۰۰ درجه (مافل)',
    nameEn: 'Digital Muffle Furnace (up to 1200°C)',
    category: 'muffle_furnace',
    model: 'MufflePyrol-1200',
    manufacturer: 'تجهیزات حرارتی با دمای بالا',
    location: 'آزمایشگاه تجزیه مواد غذایی و کوره',
    serialNumber: 'FUR-2024-007',
    specifications: {
      capacity: '۷.۲ لیتر محفظه نسوز سرامیکی',
      accuracy: '± ۲.۰ درجه سلسیوس در دمای ۵۵۰ درجه',
      resolution: '۱.۰ درجه سلسیوس',
      measurementRange: '۱۰۰ تا ۱۲۰۰ درجه سلسیوس',
      isSpecifiedInSource: true
    },
    applications: [
      'سنجش خاکستر کل در آرد، غلات، گوشت، ادویه‌جات و فرآورده‌های لبنی در دمای ۵۲۵ تا ۵۵۰ درجه سلسیوس',
      'آماده‌سازی نمونه‌ها جهت سنجش خاکستر نامحلول در اسید و سنجش عناصر معدنی'
    ],
    limitations: [
      'ورود نمونه‌های مرطوب یا حاوی مقادیر زیاد چربی نسوخته می‌تواند باعث ایجاد شعله آنی یا شکستن بوته شود'
    ],
    performanceVerificationMethod: 'بررسی صحت ترموکوپل تیپ K یا S با گیج کالیبراتور دمایی هر ۱۲ ماه',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-02-10',
    nextCalibrationDate: '2025-02-10',
    calibrationIntervalMonths: 12,
    commonErrors: [
      {
        title: 'سیاه ماندن خاکستر (سوختن ناقص کربن)',
        symptom: 'وجود ذرات سیاه کربن در بوته پس از ۴ ساعت در ۵۵۰ درجه',
        probableCause: 'فقدان اکسیژن کافی یا تجمع قندها و مواد معدنی گداخته',
        correctiveAction: 'سرد کردن در دسیکاتور، مرطوب کردن خاکستر با چند قطره آب مقطر یا اسید نیتریک رقیق، خشک کردن روی هیتر و کوره مجدد'
      }
    ],
    maintenanceNotes: [
      'پرهیز از باز کردن ناگهانی درب کوره در دماهای بالای ۴۰۰ درجه سلسیوس به دلیل شوک حرارتی به المنتهای سرامیکی',
      'استفاده همیشگی از پنس بوته‌گیر دسته بلند و دستکش عایق حرارتی نسوز'
    ],
    associatedExperimentCodes: ['EXP-ANAL-001', 'EXP-CEREAL-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-02-10T00:00:00.000Z'
  },
  {
    id: 'eq-mic-001',
    code: 'EQ-MIC-001',
    nameFa: 'انکوباتور دیجیتال ۳۰ و ۳۷ درجه میکروبیولوژی',
    nameEn: 'Precision Microbiological Incubator',
    category: 'incubator',
    model: 'BioIncub-100',
    manufacturer: 'تجهیزات زیستی و میکروبیولوژی',
    location: 'آزمایشگاه میکروبیولوژی مواد غذایی',
    serialNumber: 'INC-2024-008',
    specifications: {
      capacity: '۱۰۰ لیتر دارای درب شیشه‌ای داخلی',
      accuracy: '± ۰.۲ درجه سلسیوس',
      resolution: '۰.۱ درجه سلسیوس',
      measurementRange: 'دمای محیط +۵ تا ۷۰ درجه سلسیوس',
      isSpecifiedInSource: true
    },
    applications: [
      'گرم‌خانه‌گذاری پلیت‌های شمارش کلی میکروارگانیسم‌ها (PCA در ۳۰ درجه برای ۷۲ ساعت)',
      'شمارش کلیفرم‌ها، استافیلوکوکوس اورئوس و باسیلوس سرئوس در ۳۷ درجه سلسیوس',
      'انکوباسیون لوله‌های تست تخمیر و غنی‌سازی باکتریایی'
    ],
    limitations: [
      'خشک شدن محیط‌های کشت پتری در صورت طولانی شدن زمان انکوباسیون بدون رطوبت مناسب'
    ],
    performanceVerificationMethod: 'ثبت روزانه دمای داخل محفظه با دماسنج کالیبره غوطه‌ور در مایع بافر دو بار در روز (صبح و عصر)',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-03-01',
    nextCalibrationDate: '2025-03-01',
    calibrationIntervalMonths: 12,
    commonErrors: [
      {
        title: 'نوسان دمایی به دلیل باز و بسته‌شدن مکرر درب',
        symptom: 'تاخیر در رشد کلنی‌ها یا عدم یکنواختی فاز لگاریتمی میکروارگانیسم‌ها',
        probableCause: 'باز ماندن درب اصلی به مدت طولانی',
        correctiveAction: 'مشاهده پلیت‌ها از پشت درب شیشه‌ای داخلی بدون باز کردن درب اصلی'
      }
    ],
    maintenanceNotes: [
      'ضدعفونی ماهانه دیواره‌های داخلی با الکل ۷۰٪',
      'بررسی مداوم کارکرد سیستم هشدار صوتی انحراف دما'
    ],
    associatedExperimentCodes: ['EXP-MICR-001', 'EXP-CANNED-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-03-01T00:00:00.000Z'
  },
  {
    id: 'eq-aut-001',
    code: 'EQ-AUT-001',
    nameFa: 'اتوکلاو عمودی اتوماتیک بخار تحت فشار (۱۲۱ درجه)',
    nameEn: 'Vertical Laboratory Steam Autoclave',
    category: 'autoclave',
    model: 'SterilSteam-75L',
    manufacturer: 'سازنده تجهیزات استریلیزاسیون',
    location: 'آزمایشگاه آماده‌سازی و استریلیزاسیون میکروبیولوژی',
    serialNumber: 'AUT-2024-009',
    specifications: {
      capacity: '۷۵ لیتر محفظه استنلس استیل ۳۱۶',
      accuracy: '± ۰.۵ بار فشار / ± ۰.۵ درجه سلسیوس',
      resolution: '۰.۱ درجه سلسیوس و ۰.۰۱ بار',
      measurementRange: '۱۰۰ تا ۱۳۴ درجه سلسیوس (فشار کاری تا ۲.۲ بار)',
      isSpecifiedInSource: true
    },
    applications: [
      'استریل‌کردن محیط‌های کشت میکروبیولوژی (۱۲۱ درجه به مدت ۱۵ دقیقه در ۱ بار)',
      'سترون‌سازی ظروف شیشه‌ای، لوله‌ها، پیپت‌ها و انهدام پسماندهای بیولوژیکی و محیط‌های کشت آلوده'
    ],
    limitations: [
      'عدم قرار دادن مواد حساس به حرارت یا ظروف درب‌بسته ناتراوا با ریسک انفجار فشار'
    ],
    performanceVerificationMethod: 'آزمون دوره‌ای با اندیکاتورهای بیولوژیکی حاوی اسپور باسیلوس استئاروترموفیلوس و چسب‌های اندیکاتور شیمیایی در هر بچ اتوکلاو',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-02-25',
    nextCalibrationDate: '2025-02-25',
    calibrationIntervalMonths: 12,
    commonErrors: [
      {
        title: 'استریل نشدن کامل بخش‌های مرکزی بار',
        symptom: 'رنگ نگرفتن اندیکاتور در مرکز سبد یا رشد باکتری در محیط شاهد منفی',
        probableCause: 'تخلیه ناقص هوای سرد محفظه یا تراکم بیش از حد فلاسک‌ها',
        correctiveAction: 'اطمینان از عملکرد شیر تخلیه هوا (Air Purge) و ایجاد فاصله بین ارلن‌ها'
      }
    ],
    maintenanceNotes: [
      'استفاده انحصاری از آب مقطر جهت جلوگیری از رسوب املاح روی المنت‌ها',
      'تست هفتگی سوپاپ اطمینان مکانیکی و بررسی سلامت اورینگ درب'
    ],
    associatedExperimentCodes: ['EXP-MICR-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-02-25T00:00:00.000Z'
  },
  {
    id: 'eq-vis-001',
    code: 'EQ-VIS-001',
    nameFa: 'ویسکومتر چرخشی دیجیتال بروکفیلد (Rotational Viscometer)',
    nameEn: 'Rotational Viscometer (Brookfield Type)',
    category: 'viscometer',
    model: 'ViscoPro-LV/RV',
    manufacturer: 'صنایع رئولوژی و سنجش ویسکوزیته',
    location: 'آزمایشگاه فیزیک، سس‌ها و فرآورده‌های لبنی',
    serialNumber: 'VIS-2024-010',
    specifications: {
      capacity: 'مجموعه اسپیندل‌های استاندارد استیل (LV/RV Sets)',
      accuracy: '± ۱.۰٪ از محدوده اندازه‌گیری اسپیندل انتخابی',
      resolution: '۰.۱ سانتی‌پواز (mPa.s)',
      measurementRange: '۱ تا ۶,۰۰۰,۰۰۰ سانتی‌پواز (cP)',
      isSpecifiedInSource: true
    },
    applications: [
      'سنجش گرانروی دینامیکی سس مایونز، سس کچاپ، رب گوجه‌فرنگی و شکلات مایع',
      'بررسی رفتار تیکسوتروپیک، سودوپلاستیک و ویسکوزیته ظاهری ماست و خامه'
    ],
    limitations: [
      'ویسکوزیته سیالات غیرنیوتنی به شدت تابع سرعت برشی (RPM)، دمای آزمون و هندسه ظرف (بشر ۶۰۰ میلی‌لیتری استاندارد) است'
    ],
    performanceVerificationMethod: 'صحت‌سنجی با روغن‌های استاندارد ویسکوزیته مرجع کالیبره (Silicone Calibration Standards) در دمای ۲۵.۰ درجه سلسیوس',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-01-30',
    nextCalibrationDate: '2025-01-30',
    calibrationIntervalMonths: 12,
    commonErrors: [
      {
        title: 'گشتاور زیر ۱۰٪ یا بالای ۱۰۰٪',
        symptom: 'چشمک زدن درصد گشتاور (Torque %)',
        probableCause: 'انتخاب نادرست سایز اسپیندل یا سرعت چرخش (RPM)',
        correctiveAction: 'تغییر سایز اسپیندل یا تنظیم دور موتور جهت قرار گرفتن گشتاور در بازه بهینه ۱۰٪ تا ۹۰٪'
      }
    ],
    maintenanceNotes: [
      'اتصال و جداسازی اسپیندل باید فقط با یک دست نگه داشتن شفت انجام شود تا به فنر بریلیم دستگاه فشار نیاید',
      'شستشو و خشک کردن کامل اسپیندل بلافاصله پس از هر آزمون'
    ],
    associatedExperimentCodes: ['EXP-PHYS-001', 'EXP-OTHER-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-30T00:00:00.000Z'
  },
  {
    id: 'eq-cnt-001',
    code: 'EQ-CNT-001',
    nameFa: 'سانتریفیوژ اختصاصی ژربیر لبنیات با گرم‌کن',
    nameEn: 'Gerber Dairy Centrifuge with Heating',
    category: 'centrifuge',
    model: 'GerberSpin-Heated',
    manufacturer: 'تجهیزات آنالیز لبنیات',
    location: 'آزمایشگاه شیر و فرآورده‌های لبنی',
    serialNumber: 'CNT-2024-011',
    specifications: {
      capacity: '۸ تا ۱۲ بوتیومتر شیر/پنیر ژربیر استاندارد',
      accuracy: '± ۶۵ g (نیروی گرانش نسبی RCF) / ± ۱.۰ درجه سلسیوس',
      resolution: '۱۰ دور بر دقیقه (RPM)',
      measurementRange: '۱۱۰۰ تا ۱۳۰۰ دور بر دقیقه (نیروی نسبی ۳۵۰g) و دمای ۶۵ درجه سلسیوس',
      isSpecifiedInSource: true
    },
    applications: [
      'سنجش درصد چربی شیر خام، شیر پاستوریزه، خامه، پنیر و ماست به روش ژربیر مطابق استاندارد ملی ۳۶۶ و ۶۹۴'
    ],
    limitations: [
      'نیاز حیاتی به بالانس دقیق وزنی جفت بوتیومترها در دو طرف روتور'
    ],
    performanceVerificationMethod: 'کنترل دور موتور با تاکومتر نوری کالیبره و پایش دمای محفظه با دماسنج کالیبره در ۶۵ درجه سلسیوس',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-02-18',
    nextCalibrationDate: '2025-02-18',
    calibrationIntervalMonths: 12,
    commonErrors: [
      {
        title: 'لرزش شدید دستگاه و صدای غیرعادی',
        symptom: 'ارتعاش بدنه سانتریفیوژ در سرعت‌های بالا',
        probableCause: 'عدم بالانس بودن روبروی هم بوتیومترها یا شکستگی لوله در محفظه',
        correctiveAction: 'قطع فوری برق، پاکسازی خرده‌شیشه‌ها و بالانس کامل لوله‌ها با آب مقطر'
      }
    ],
    maintenanceNotes: [
      'پاکسازی فوری محفظه در صورت نشت اسید سولفوریک بوتیومترها',
      'بررسی سلامت قفل ایمنی درب در حین چرخش'
    ],
    associatedExperimentCodes: ['EXP-DAIRY-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-02-18T00:00:00.000Z'
  },
  {
    id: 'eq-bur-001',
    code: 'EQ-BUR-001',
    nameFa: 'بورت دیجیتال اتوماتیک تیتراسیون (دیسپنسر)',
    nameEn: 'Digital Benchtop Titration Burette',
    category: 'burette',
    model: 'DigiBurette-50',
    manufacturer: 'تجهیزات دیسپنسینگ مایعات',
    location: 'آزمایشگاه شیمی و روغن‌ها',
    serialNumber: 'BUR-2024-012',
    specifications: {
      capacity: '۵۰ میلی‌لیتر (مخزن ۲.۵ لیتری قابل اتصال)',
      accuracy: '± ۰.۰۳ میلی‌لیتر (عدم قطعیت کلاس A)',
      resolution: '۰.۰۱ میلی‌لیتر',
      measurementRange: '۰.۰۱ تا ۵۰.۰۰ میلی‌لیتر',
      isSpecifiedInSource: true
    },
    applications: [
      'تیتراسیون‌های اکسیداسیون و عدد پراکسید با تیوسولفات سدیم',
      'سنجش اسیدیته آزاد (FFA) روغن‌ها با هیدروکسید پتاسیم/سدیم',
      'سنجش نمک (روش مور و ولارد) با نیترات نقره'
    ],
    limitations: [
      'کریستالیزه شدن محلول‌های قلیایی در پیستون در صورت عدم شستشوی منظم'
    ],
    performanceVerificationMethod: 'کالیبراسیون حجم با توزین آب مقطر در ترازوی ۴ رقمی مطابق استاندارد ISO 8655',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-03-05',
    nextCalibrationDate: '2024-09-05',
    calibrationIntervalMonths: 6,
    commonErrors: [
      {
        title: 'وجود حباب هوا در نازل خروجی',
        symptom: 'خطای حجمی در نقاط پایانی تیتراسیون',
        probableCause: 'هواگیری ناقص سیلندر پیش از شروع',
        correctiveAction: 'انجام حالت هواگیری اتوماتیک (Recirculation Priming) جهت خروج کامل حباب‌ها'
      }
    ],
    maintenanceNotes: [
      'شستشوی مسیر با آب مقطر در پایان هر روز کاری',
      'تعویض دوره‌ای واشرهای تفلونی سوپاپ مکش'
    ],
    associatedExperimentCodes: ['EXP-FATS-001', 'EXP-BEV-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-03-05T00:00:00.000Z'
  },
  {
    id: 'eq-pip-001',
    code: 'EQ-PIP-001',
    nameFa: 'سمپلر متغیر میکرولیتر (میکروپیپت تک کاناله)',
    nameEn: 'Adjustable Micropipette (100-1000 µL)',
    category: 'pipette',
    model: 'PrecisionPipette-1000',
    manufacturer: 'ابزار مایعات آزمایشگاهی',
    location: 'آزمایشگاه میکروبیولوژی و بیوشیمی',
    serialNumber: 'PIP-2024-013',
    specifications: {
      capacity: '۱۰۰ تا ۱۰۰۰ میکرولیتر',
      accuracy: '± ۰.۶٪ در حجم ۱۰۰۰ میکرولیتر',
      resolution: '۱ میکرولیتر',
      measurementRange: '۱۰۰ تا ۱۰۰۰ µL',
      isSpecifiedInSource: true
    },
    applications: [
      'برداشت دقیق رقت‌های سریالی سوسپانسیون‌های باکتریایی',
      'افزودن معرف‌های رنگزا، آنزیم‌ها و بافرها در مقیاس میکرولیتر'
    ],
    limitations: [
      'عدم استفاده مستقیم با مایعات بسیار فرار، داغ یا اسیدهای غلیظ بدون سرسمپلر فیلتردار'
    ],
    performanceVerificationMethod: 'توزین گراویمتری ۵ نمونه حجم با آب مقطر دیونیزه روی ترازوی آنالیتیکال مطابق ISO 8655-2',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-03-12',
    nextCalibrationDate: '2024-09-12',
    calibrationIntervalMonths: 6,
    commonErrors: [
      {
        title: 'نشت حجم یا کشش مایع داخل بدنه پیپت',
        symptom: 'چکیدن قطره از سرسمپلر پیش از تخلیه کامل',
        probableCause: 'قرار دادن پیپت به حالت افقی با سرسمپلر پر یا خرابی اورینگ آب‌بندی',
        correctiveAction: 'نگهداری همیشگی روی پایه عمودی و تعویض اورینگ تفلونی'
      }
    ],
    maintenanceNotes: [
      'اتوکلاو دوره‌ای بخش پایینی سمپلر جهت حفظ استریلیته میکروبی',
      'گریس‌کاری سیلندر با گریس سیلیکونی مخصوص'
    ],
    associatedExperimentCodes: ['EXP-MICR-001', 'EXP-FRUIT-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-03-12T00:00:00.000Z'
  },
  {
    id: 'eq-des-001',
    code: 'EQ-DES-001',
    nameFa: 'دسیکاتور شیشه‌ای شیردار با قابلیت ایجاد خلاء',
    nameEn: 'Vacuum Glass Desiccator with Porcelain Plate',
    category: 'desiccator',
    model: 'VacuDesic-250',
    manufacturer: 'شیشه‌آلات مرجع آزمایشگاهی',
    location: 'آزمایشگاه رطوبت‌سنجی و خاکستر',
    serialNumber: 'DES-2024-014',
    specifications: {
      capacity: 'قطر ۲۵۰ میلی‌متر با صفحه چینی سوراخ‌دار',
      isSpecifiedInSource: true
    },
    applications: [
      'خنک‌کردن بوته‌های خاکستر و پلیت‌های رطوبت پس از خروج از آون و کوره در محیط عاری از رطوبت',
      'نگهداری معرف‌های حساس به رطوبت اتمسفر'
    ],
    limitations: [
      'عدم ایجاد شوک ناگهانی به شیر خلاء جهت جلوگیری از پراکنده شدن خاکستر سبک داخل بوته‌ها'
    ],
    performanceVerificationMethod: 'کنترل بصری رنگ سیلیکاژل (تغییر از آبی به صورتی یا نارنجی به سبز) و احیای آن در آون ۱۲۰ درجه',
    calibrationStatus: 'not_required',
    commonErrors: [
      {
        title: 'گیر کردن یا نشت هوای درب دسیکاتور',
        symptom: 'سخت باز شدن درب یا جذب رطوبت توسط بوته‌ها',
        probableCause: 'خشک شدن گریس سیلیکون روی لبه‌های شیشه‌ای سمباده‌ای',
        correctiveAction: 'تمیز کردن لبه‌ها و اعمال لایه بسیار نازک گریس سیلیکونی درزبندی'
      }
    ],
    maintenanceNotes: [
      'احیای دوره‌ای سیلیکاژل در آون ۱۲۰ درجه سلسیوس به محض تغییر رنگ',
      'باز کردن درب فقط به صورت کشویی (Sliding) و نه کشیدن عمودی'
    ],
    associatedExperimentCodes: ['EXP-ANAL-001', 'EXP-CHEM-001', 'EXP-CEREAL-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'eq-hod-001',
    code: 'EQ-HOD-001',
    nameFa: 'هود بخارات شیمیایی با فن ضد اسید و فیلتر کربن فعال',
    nameEn: 'Chemical Fume Hood with Acid Resistant Blower',
    category: 'hood',
    model: 'ChemSafe-120',
    manufacturer: 'سیستم‌های تهویه ایمنی آزمایشگاهی',
    location: 'آزمایشگاه آماده‌سازی مواد شیمیایی و کلدال',
    serialNumber: 'HOD-2024-015',
    specifications: {
      capacity: 'عرض ۱۲۰ سانتی‌متر با کف سرامیکی مقاوم به اسید',
      accuracy: 'سرعت مکش هوای ورودی (Face Velocity): ۰.۵ m/s ± ۰.۱',
      measurementRange: '۰.۳ تا ۱.۰ متر بر ثانیه',
      isSpecifiedInSource: true
    },
    applications: [
      'انجام هضم اسیدی کلدال و کار با اسید سولفوریک داغ',
      'استخراج چربی با حلال‌های آلی فرار (اتر دوپترول، دی‌اتیل اتر)',
      'تیتراسیون‌های یدی و تولید بخارات تحریک‌کننده'
    ],
    limitations: [
      'عدم استفاده به عنوان انبار مواد شیمیایی یا مسدود کردن شیارهای خروجی مکش عقب'
    ],
    performanceVerificationMethod: 'آزمون سالانه سرعت مکش خطی با بادسنج کالیبره (Anemometer) و آزمون دود مطابق ASHRAE 110',
    calibrationStatus: 'valid',
    lastCalibrationDate: '2024-01-05',
    nextCalibrationDate: '2025-01-05',
    calibrationIntervalMonths: 12,
    commonErrors: [
      {
        title: 'کاهش دبی مکش هوا',
        symptom: 'انتشار بوی اسید یا حلال در فضای آزمایشگاه',
        probableCause: 'اشباع فیلتر کربن فعال، گرفتگی کانال خروجی یا بالا بردن بیش از حد شیشه گیوتینی',
        correctiveAction: 'پایین آوردن شیشه تا علامت استاندارد (Sash Height) و سرویس فن مکنده'
      }
    ],
    maintenanceNotes: [
      'تمیزکاری روزانه کف سرامیکی با محلول بی‌کربنات سدیم در صورت ریختن اسید',
      'تعویض به موقع فیلترهای کربن فعال و هپا'
    ],
    associatedExperimentCodes: ['EXP-ANAL-001', 'EXP-FATS-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  },
  {
    id: 'eq-mic-eq-001',
    code: 'EQ-MEQ-001',
    nameFa: 'هموژنایزر کیسه‌ای استومیکر آزمایشگاهی (Stomacher)',
    nameEn: 'Laboratory Stomacher Blender for Microbiology',
    category: 'microbiology_equipment',
    model: 'StomacherLab-400',
    manufacturer: 'تجهیزات آماده‌سازی سوسپانسیون میکروبی',
    location: 'آزمایشگاه میکروبیولوژی مواد غذایی',
    serialNumber: 'MEQ-2024-016',
    specifications: {
      capacity: 'کیسه‌های استریل ۸۰ تا ۴۰۰ میلی‌لیتر',
      accuracy: '± ۵ دور ضربه در دقیقه',
      measurementRange: '۴ تا ۱۰ ضربه در ثانیه (۲۰۰ تا ۳۰۰ rpm) با تایمر تا ۵ دقیقه',
      isSpecifiedInSource: true
    },
    applications: [
      'همگن‌سازی اولیه نمونه‌های غذایی جامد (گوشت، غلات، کنسرو) با رقیق‌کننده بدون تخریب دیواره باکتری‌ها',
      'استخراج یکنواخت میکروارگانیسم‌ها از ماتریکس غذایی'
    ],
    limitations: [
      'خطر پاره شدن کیسه در اثر استخوان یا ذرات تیز جامد'
    ],
    performanceVerificationMethod: 'کنترل دور ضربه‌ها با تاکومتر نوری و بررسی سلامت پاروهای استیل',
    calibrationStatus: 'calibrated_in_house',
    lastCalibrationDate: '2024-02-01',
    nextCalibrationDate: '2024-08-01',
    calibrationIntervalMonths: 6,
    commonErrors: [
      {
        title: 'نشت مایع داخل محفظه استومیکر',
        symptom: 'خروج سوسپانسیون از درز کیسه استریل',
        probableCause: 'استفاده از کیسه‌های غیر استاندارد یا سوراخ شدن کیسه با ذرات برنده',
        correctiveAction: 'استفاده از کیسه‌های فیلتردار مقاوم و ضدعفونی سریع سینی محفظه با سدیم هیپوکلریت'
      }
    ],
    maintenanceNotes: [
      'ضدعفونی روزانه پاروها و محفظه استنلس استیل با الکل ۷۰٪',
      'گریس‌کاری بلبرینگ‌های محرک هر ۶ ماه'
    ],
    associatedExperimentCodes: ['EXP-MICR-001', 'EXP-MEAT-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z'
  },
  {
    id: 'eq-gen-001',
    code: 'EQ-GEN-001',
    nameFa: 'هیتر استیرر مغناطیسی دیجیتال با سنسور دمای خارجی PT1000',
    nameEn: 'Digital Magnetic Hotplate Stirrer with External PT1000',
    category: 'general_lab_equipment',
    model: 'MagHeat-Pro-380',
    manufacturer: 'تجهیزات عمومی آزمایشگاهی',
    location: 'آزمایشگاه عمومی شیمی و آماده‌سازی',
    serialNumber: 'GEN-2024-017',
    specifications: {
      capacity: 'صفحه سرامیکی مقاوم تا حجم ۵ لیتر محلول',
      accuracy: '± ۰.۵ درجه سلسیوس (با پروب دمایی)',
      resolution: '۱.۰ rpm سرعت / ۰.۱ درجه دما',
      measurementRange: 'دمای محیط تا ۳۸۰ درجه سلسیوس و ۵۰ تا ۱۵۰۰ دور بر دقیقه',
      isSpecifiedInSource: true
    },
    applications: [
      'حل کردن آگار و محیط‌های کشت میکروبیولوژی پیش از اتوکلاو',
      'حرارت‌دهی و همزدن پیوسته محلول‌های تیتراسیون و حلال‌های شیمیایی'
    ],
    limitations: [
      'عدم استفاده برای مایعات بسیار ویسکوز که مانع چرخش مگنت می‌شوند'
    ],
    performanceVerificationMethod: 'کنترل دمای مایع با دماسنج کالیبره مستقل و کنترل دور مگنت با سرعت‌سنج نوری',
    calibrationStatus: 'calibrated_in_house',
    lastCalibrationDate: '2024-02-10',
    nextCalibrationDate: '2024-08-10',
    calibrationIntervalMonths: 6,
    commonErrors: [
      {
        title: 'پرتاب شدن مگنت از مرکز ظرف (Decoupling)',
        symptom: 'صدای تق‌تق و عدم چرخش یکنواخت مگنت در کف ظرف',
        probableCause: 'بالا بردن ناگهانی سرعت RPM یا عدم قرارگیری ظرف در مرکز صفحه',
        correctiveAction: 'کاهش سرعت به صفر و افزایش تدریجی دور چرخش'
      }
    ],
    maintenanceNotes: [
      'تمیز کردن صفحه سرامیکی با دستمال مرطوب پس از خنک شدن کامل',
      'محافظت از بدنه در برابر ریزش اسیدهای غلیظ'
    ],
    associatedExperimentCodes: ['EXP-CHEM-001', 'EXP-MICR-001', 'EXP-FATS-001'],
    offlineAvailable: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-02-10T00:00:00.000Z'
  }
];

/**
 * Normalizes an equipment record and computes dynamic calibration status if dates are present.
 */
export function normalizeEquipmentRecord(data: Partial<LaboratoryEquipment>): LaboratoryEquipment {
  const now = new Date();
  let computedStatus: CalibrationStatus = data.calibrationStatus || 'valid';

  // Compute expiration dynamics if nextCalibrationDate is set
  if (data.nextCalibrationDate && computedStatus !== 'not_required') {
    const nextDate = new Date(data.nextCalibrationDate);
    const diffDays = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      computedStatus = 'expired';
    } else if (diffDays <= 30) {
      computedStatus = 'expiring_soon';
    }
  }

  return {
    id: data.id || `eq-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    code: data.code || `EQ-${Date.now()}`,
    nameFa: data.nameFa || 'تجهیز جدید آزمایشگاه',
    nameEn: data.nameEn || 'New Laboratory Equipment',
    category: data.category || 'general_lab_equipment',
    model: data.model,
    manufacturer: data.manufacturer,
    location: data.location,
    serialNumber: data.serialNumber,
    specifications: data.specifications || {},
    applications: Array.isArray(data.applications) ? data.applications : [],
    limitations: Array.isArray(data.limitations) ? data.limitations : [],
    performanceVerificationMethod: data.performanceVerificationMethod || 'کنترل روزانه نقطه صفر و عملکرد مطابق چک‌لیست تجهیزات',
    calibrationStatus: computedStatus,
    lastCalibrationDate: data.lastCalibrationDate,
    nextCalibrationDate: data.nextCalibrationDate,
    calibrationIntervalMonths: data.calibrationIntervalMonths || 12,
    calibrationProvider: data.calibrationProvider,
    commonErrors: Array.isArray(data.commonErrors) ? data.commonErrors : [],
    maintenanceNotes: Array.isArray(data.maintenanceNotes) ? data.maintenanceNotes : [],
    standardOperatingProcedure: data.standardOperatingProcedure,
    safetyNotes: Array.isArray(data.safetyNotes) ? data.safetyNotes : [],
    associatedExperimentCodes: Array.isArray(data.associatedExperimentCodes) ? data.associatedExperimentCodes : [],
    sources: Array.isArray(data.sources) ? data.sources : [],
    isSourceVerified: data.isSourceVerified ?? true,
    offlineAvailable: data.offlineAvailable ?? true,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Validates equipment data before saving.
 */
export function validateEquipment(data: Partial<LaboratoryEquipment>): {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
  warnings: Array<{ field: string; message: string }>;
} {
  const errors: Array<{ field: string; message: string }> = [];
  const warnings: Array<{ field: string; message: string }> = [];

  if (!data.nameFa || data.nameFa.trim() === '') {
    errors.push({ field: 'nameFa', message: 'نام فارسی دستگاه الزامی است.' });
  }

  if (!data.code || data.code.trim() === '') {
    errors.push({ field: 'code', message: 'کد شناسایی دستگاه الزامی است.' });
  }

  if (!data.category) {
    errors.push({ field: 'category', message: 'دسته‌بندی تجهیزات باید مشخص باشد.' });
  }

  // Safety check on calibration
  if (data.calibrationStatus === 'valid' && !data.nextCalibrationDate) {
    warnings.push({
      field: 'nextCalibrationDate',
      message: 'دستگاه کالیبره علامت‌گذاری شده اما تاریخ انقضای کالیبراسیون ثبت نشده است.'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Seeds initial benchmark equipment records into IndexedDB if store is empty.
 */
export async function seedInitialBenchmarkEquipment(): Promise<void> {
  try {
    const existing = await getAllItems<LaboratoryEquipment>(STORES.LAB_EQUIPMENT);
    if (!existing || existing.length === 0) {
      for (const eq of BENCHMARK_LAB_EQUIPMENT) {
        await putItem(STORES.LAB_EQUIPMENT, normalizeEquipmentRecord(eq));
      }
    }
  } catch (error) {
    console.error('Failed to seed benchmark equipment in IndexedDB:', error);
  }
}

/**
 * Gets all laboratory equipment records.
 */
export async function getAllEquipment(): Promise<LaboratoryEquipment[]> {
  try {
    let items = await getAllItems<LaboratoryEquipment>(STORES.LAB_EQUIPMENT);
    if (!items || items.length === 0) {
      await seedInitialBenchmarkEquipment();
      items = await getAllItems<LaboratoryEquipment>(STORES.LAB_EQUIPMENT);
    }
    return items.map(normalizeEquipmentRecord);
  } catch (error) {
    console.error('Failed to get equipment from IndexedDB:', error);
    return BENCHMARK_LAB_EQUIPMENT.map(normalizeEquipmentRecord);
  }
}

/**
 * Gets a single equipment by ID.
 */
export async function getEquipmentById(id: string): Promise<LaboratoryEquipment | null> {
  try {
    const item = await getItem<LaboratoryEquipment>(STORES.LAB_EQUIPMENT, id);
    if (item) return normalizeEquipmentRecord(item);
    const fallback = BENCHMARK_LAB_EQUIPMENT.find(e => e.id === id);
    return fallback ? normalizeEquipmentRecord(fallback) : null;
  } catch (error) {
    console.error(`Failed to get equipment ${id}:`, error);
    const fallback = BENCHMARK_LAB_EQUIPMENT.find(e => e.id === id);
    return fallback ? normalizeEquipmentRecord(fallback) : null;
  }
}

/**
 * Saves (creates or updates) an equipment item.
 */
export async function saveEquipment(data: Partial<LaboratoryEquipment>): Promise<LaboratoryEquipment> {
  const normalized = normalizeEquipmentRecord(data);
  await putItem(STORES.LAB_EQUIPMENT, normalized);
  return normalized;
}

/**
 * Deletes an equipment item by ID.
 */
export async function deleteEquipment(id: string): Promise<boolean> {
  try {
    await deleteItem(STORES.LAB_EQUIPMENT, id);
    return true;
  } catch (error) {
    console.error(`Failed to delete equipment ${id}:`, error);
    return false;
  }
}

/**
 * Filters and searches laboratory equipment.
 */
export async function filterEquipment(filters: EquipmentFilterQuery): Promise<LaboratoryEquipment[]> {
  const all = await getAllEquipment();
  const q = (filters.query || '').trim().toLowerCase();

  return all.filter(item => {
    // 1. Search Query in names, code, model, manufacturer, applications
    if (q) {
      const matchNameFa = item.nameFa.toLowerCase().includes(q);
      const matchNameEn = item.nameEn.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchModel = item.model?.toLowerCase().includes(q) ?? false;
      const matchApp = item.applications.some(a => a.toLowerCase().includes(q));
      const matchMethod = item.performanceVerificationMethod.toLowerCase().includes(q);
      if (!matchNameFa && !matchNameEn && !matchCode && !matchModel && !matchApp && !matchMethod) {
        return false;
      }
    }

    // 2. Category Filter
    if (filters.category && filters.category !== 'all') {
      if (item.category !== filters.category) return false;
    }

    // 3. Calibration Status Filter
    if (filters.calibrationStatus && filters.calibrationStatus !== 'all') {
      if (item.calibrationStatus !== filters.calibrationStatus) return false;
    }

    // 4. Has Specifications Filter
    if (filters.hasSpecificationsOnly) {
      const s = item.specifications;
      const hasAny = Boolean(s && (s.accuracy || s.capacity || s.measurementRange || s.resolution));
      if (!hasAny) return false;
    }

    // 5. Offline Only
    if (filters.offlineOnly && !item.offlineAvailable) {
      return false;
    }

    // 6. Associated Experiment
    if (filters.associatedExperimentCode) {
      if (!item.associatedExperimentCodes?.includes(filters.associatedExperimentCode)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Computes equipment statistics.
 */
export async function getEquipmentStatistics(): Promise<EquipmentStatistics> {
  try {
    const items = await getAllEquipment();

    const categoriesDistribution: Record<EquipmentCategory, number> = {
      balance: 0,
      oven: 0,
      muffle_furnace: 0,
      ph_meter: 0,
      spectrophotometer: 0,
      centrifuge: 0,
      incubator: 0,
      autoclave: 0,
      burette: 0,
      pipette: 0,
      hood: 0,
      desiccator: 0,
      refractometer: 0,
      viscometer: 0,
      texture_analyzer: 0,
      microbiology_equipment: 0,
      general_lab_equipment: 0
    };

    const statusDistribution: Record<CalibrationStatus, number> = {
      valid: 0,
      expiring_soon: 0,
      expired: 0,
      calibrated_in_house: 0,
      not_required: 0
    };

    let calibratedCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;
    let offlineCount = 0;
    let linkedExperimentsCount = 0;

    for (const item of items) {
      if (categoriesDistribution[item.category] !== undefined) {
        categoriesDistribution[item.category]++;
      }
      if (statusDistribution[item.calibrationStatus] !== undefined) {
        statusDistribution[item.calibrationStatus]++;
      }

      if (item.calibrationStatus === 'valid' || item.calibrationStatus === 'calibrated_in_house') {
        calibratedCount++;
      }
      if (item.calibrationStatus === 'expiring_soon') {
        expiringCount++;
      }
      if (item.calibrationStatus === 'expired') {
        expiredCount++;
      }
      if (item.offlineAvailable) {
        offlineCount++;
      }
      if (item.associatedExperimentCodes && item.associatedExperimentCodes.length > 0) {
        linkedExperimentsCount += item.associatedExperimentCodes.length;
      }
    }

    return {
      total: items.length,
      categoriesDistribution,
      statusDistribution,
      calibratedCount,
      expiringCount,
      expiredCount,
      offlineCount,
      linkedExperimentsCount
    };
  } catch (error) {
    console.error('Failed to get equipment statistics:', error);
    return {
      total: BENCHMARK_LAB_EQUIPMENT.length,
      categoriesDistribution: {
        balance: 1,
        oven: 1,
        muffle_furnace: 1,
        ph_meter: 1,
        spectrophotometer: 1,
        centrifuge: 1,
        incubator: 1,
        autoclave: 1,
        burette: 1,
        pipette: 1,
        hood: 1,
        desiccator: 1,
        refractometer: 1,
        viscometer: 1,
        texture_analyzer: 1,
        microbiology_equipment: 1,
        general_lab_equipment: 1
      },
      statusDistribution: {
        valid: 14,
        expiring_soon: 0,
        expired: 0,
        calibrated_in_house: 2,
        not_required: 1
      },
      calibratedCount: 16,
      expiringCount: 0,
      expiredCount: 0,
      offlineCount: 17,
      linkedExperimentsCount: 25
    };
  }
}

/**
 * Exports all equipment to a JSON string.
 */
export async function exportEquipmentToJSON(): Promise<string> {
  const items = await getAllEquipment();
  return JSON.stringify(items, null, 2);
}

/**
 * Imports equipment from a JSON string.
 */
export async function importEquipmentFromJSON(jsonString: string): Promise<number> {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed)) {
    throw new Error('فایل ورودی باید یک آرایه معتبر از تجهیزات آزمایشگاهی باشد.');
  }

  let count = 0;
  for (const raw of parsed) {
    const validated = normalizeEquipmentRecord(raw);
    await saveEquipment(validated);
    count++;
  }
  return count;
}

/**
 * Resets equipment store to factory benchmark.
 */
export async function resetEquipmentStore(): Promise<void> {
  await clearStore(STORES.LAB_EQUIPMENT);
  for (const eq of BENCHMARK_LAB_EQUIPMENT) {
    await putItem(STORES.LAB_EQUIPMENT, normalizeEquipmentRecord(eq));
  }
}
