import { DiagnosedLabError, LabTestStage } from '../types/troubleshooting';

export interface ExperimentTroubleshootTemplate {
  id: string;
  nameFa: string;
  nameEn: string;
  category: string;
  standardReference: string;
  stages: LabTestStage[];
  commonEquipment: string[];
  numericalParameters: {
    key: string;
    labelFa: string;
    unit?: string;
    defaultValue?: number;
    placeholder?: string;
    descriptionFa?: string;
  }[];
  symptomPresets: {
    id: string;
    labelFa: string;
    stage: LabTestStage;
    descriptionFa: string;
  }[];
}

/**
 * Standard experiments supported in the troubleshooting system
 */
export const EXPERIMENT_TROUBLESHOOT_TEMPLATES: ExperimentTroubleshootTemplate[] = [
  {
    id: 'moisture_oven',
    nameFa: 'درصد رطوبت (روش آون الکتریکی ۱۰۵-۱۰۲ درجه)',
    nameEn: 'Moisture Content (Oven Drying Method)',
    category: 'proximate_analysis',
    standardReference: 'INSO 2406 / AOAC 925.10 / ISO 712',
    stages: [
      'sampling_homogenization',
      'preparation_weighing',
      'digestion_reaction',
      'cooling_desiccator',
      'calculation_reporting'
    ],
    commonEquipment: [
      'ترازوی تحلیلی ۴ رقم اعشار (Analytical Balance 0.1mg)',
      'آون الکتریکی با فن سیرکولاسیون (Laboratory Drying Oven 105°C)',
      'دسیکاتور با سیلیکاژل فعال و گریس واکیوم (Desiccator with Active Silica Gel)',
      'پلیت یا پودقه توزین شیشه‌ای/آلومینیومی با درب (Moisture Dish with Lid)'
    ],
    numericalParameters: [
      { key: 'm0', labelFa: 'جرم ظرف خالی (M₀)', unit: 'g', defaultValue: 20.1542, descriptionFa: 'وزن ظرف خالی تثبیت شده' },
      { key: 'm1', labelFa: 'جرم ظرف + نمونه قبل از آون (M₁)', unit: 'g', defaultValue: 25.1542, descriptionFa: 'وزن قبل از خشک‌کردن' },
      { key: 'm2', labelFa: 'جرم ظرف + نمونه بعد از آون (M₂)', unit: 'g', defaultValue: 24.4042, descriptionFa: 'وزن پس از آون و دسیکاتور' },
      { key: 'oven_temp', labelFa: 'دمای تنظیمی آون', unit: '°C', defaultValue: 103, descriptionFa: 'دمای کاری محفظه آون' },
      { key: 'drying_time', labelFa: 'مدت زمان آون‌گذاری', unit: 'hours', defaultValue: 4, descriptionFa: 'ساعت ماندگاری در آون' }
    ],
    symptomPresets: [
      { id: 'wt_increase', stage: 'cooling_desiccator', labelFa: 'افزایش وزن نمونه بعد از خروج از آون و توزین در تکرارها (M2 > M1 یا ناپایداری وزن)', descriptionFa: 'جرم نمونه پس از آون به جای کاهش وزن، افزایش نشان می‌دهد یا روی ترازو بالا می‌رود.' },
      { id: 'charring_crust', stage: 'digestion_reaction', labelFa: 'قهوه‌ای شدن شدید، پوسته بستن سطح نمونه یا بوی سوختگی (Maillard & Case Hardening)', descriptionFa: 'تشکیل لایه غیرقابل نفوذ در سطح یا سوختن ترکیبات حساس به حرارت' },
      { id: 'replicate_diff', stage: 'calculation_reporting', labelFa: 'اختلاف بیش از حد مجاز بین دو تکرار آزمون (RSD > 0.2%)', descriptionFa: 'عدم تطابق نتایج تکرارها فراتر از حد مجاز استاندارد ملی' },
      { id: 'balance_drift', stage: 'preparation_weighing', labelFa: 'پرش و رانش ارقام ترازوی تحلیلی حین توزین پلیت', descriptionFa: 'عدم ثبات نمایشگر ترازو حین خواندن وزن ظرف' }
    ]
  },
  {
    id: 'protein_kjeldahl',
    nameFa: 'درصد پروتئین خام (روش هضم و تقطیر کجلدال)',
    nameEn: 'Crude Protein (Kjeldahl Digestion & Distillation)',
    category: 'proximate_analysis',
    standardReference: 'INSO 639 / AOAC 991.20 / ISO 8968-1',
    stages: [
      'sampling_homogenization',
      'preparation_weighing',
      'digestion_reaction',
      'distillation_extraction',
      'titration_endpoint',
      'calculation_reporting'
    ],
    commonEquipment: [
      'دستگاه هضم کجلدال آلومینیومی با اسکرابر بخارات (Kjeldahl Digestion Block)',
      'سیستم تقطیر خودکار/نیمه‌خودکار کجلدال با بخار (Steam Distillation Unit)',
      'بورت دیجیتال یا پیستون‌دار ۰.۰۱ میلی‌لیتر (Digital Burette 0.01 mL)',
      'ترازوی تحلیلی کالیبره (Analytical Balance 0.1mg)'
    ],
    numericalParameters: [
      { key: 'sample_mass', labelFa: 'جرم نمونه وزن‌شده', unit: 'g', defaultValue: 2.0000 },
      { key: 'vs', labelFa: 'حجم اسید مصرفی نمونه (Vs)', unit: 'mL', defaultValue: 16.40 },
      { key: 'vb', labelFa: 'حجم اسید مصرفی شاهد (Vb)', unit: 'mL', defaultValue: 0.15 },
      { key: 'n_acid', labelFa: 'نرمالیته اسید تیترکننده', unit: 'N', defaultValue: 0.1000 },
      { key: 'f_factor', labelFa: 'ضریب تبدیل نیتروژن (F)', defaultValue: 6.25 }
    ],
    symptomPresets: [
      { id: 'black_digest', stage: 'digestion_reaction', labelFa: 'سیاه ماندن محلول هضم و عدم شفاف شدن به رنگ سبز زمردی/آبی روشن پس از ۲ ساعت', descriptionFa: 'هضم ناقص مواد آلی و هیدروکربن‌ها توسط اسید سولفوریک' },
      { id: 'high_blank', stage: 'titration_endpoint', labelFa: 'حجم تیتر بسیار بالای آزمون شاهد بدون نمونه (Vb > 0.5 mL)', descriptionFa: 'آلودگی شدید معرف‌ها یا آب مقطر به ترکیبات آمونیاکی' },
      { id: 'low_recovery', stage: 'calculation_reporting', labelFa: 'درصد بازیافت پایین روی استاندارد سولفات آمونیوم یا تریپتوفان (< 98%)', descriptionFa: 'اتلاف آمونیاک ناشی از نشتی در حین تقطیر یا حرارت‌دهی ناقص' },
      { id: 'foaming_boiling', stage: 'digestion_reaction', labelFa: 'کف کردن شدید و بالا آمدن نمونه از لوله هضم به سمت منیفولد', descriptionFa: 'واکنش شدید کربوهیدرات‌ها و چربی با اسید غلیظ در دمای بالا' },
      { id: 'early_color_change', stage: 'distillation_extraction', labelFa: 'تغییر رنگ فوری اسید بوریک قبل از شروع تقطیر بخار', descriptionFa: 'آلودگی ارلن گیرنده یا نشت سود سوزآور از والو تقطیر' }
    ]
  },
  {
    id: 'fat_soxhlet',
    nameFa: 'درصد چربی خام (روش استخراج پیوسته سوکسله با حلال)',
    nameEn: 'Crude Fat Content (Soxhlet Solvent Extraction)',
    category: 'proximate_analysis',
    standardReference: 'INSO 1993 / AOAC 920.39 / ISO 1443',
    stages: [
      'sampling_homogenization',
      'preparation_weighing',
      'distillation_extraction',
      'cooling_desiccator',
      'calculation_reporting'
    ],
    commonEquipment: [
      'دستگاه استخراج سوکسله شیشه‌ای با مبرد و بالن (Soxhlet Extraction Glassware)',
      'حمام حرارتی یا منتل برقی ضدجرقه (Explosion-Proof Heating Mantle)',
      'کارتوش استخراج سلولزی بدون چربی (Fat-Free Extraction Thimble)',
      'آون خشک‌کن بالن (Drying Oven 102°C)'
    ],
    numericalParameters: [
      { key: 'm_sample', labelFa: 'جرم نمونه در کارتوش', unit: 'g', defaultValue: 5.0000 },
      { key: 'm1_flask', labelFa: 'جرم بالن خالی خشک‌شده', unit: 'g', defaultValue: 98.4520 },
      { key: 'm2_fat', labelFa: 'جرم بالن + چربی پس از تبخیر حلال', unit: 'g', defaultValue: 98.8020 },
      { key: 'siphon_rate', labelFa: 'تعداد سیفون در ساعت', unit: 'cycles/hr', defaultValue: 6 }
    ],
    symptomPresets: [
      { id: 'solvent_dark_burn', stage: 'distillation_extraction', labelFa: 'تیره شدن و سوختن چربی داخل بالن همراه با بوی تند اکسیداسیون', descriptionFa: 'حرارت بیش از حد حمام یا تمام شدن حلال و خشک شدن بالن' },
      { id: 'low_fat_yield', stage: 'distillation_extraction', labelFa: 'راندمان چربی به دست آمده بسیار کمتر از حد انتظار فرمولاسیون', descriptionFa: 'خشک نبودن نمونه قبل از استخراج، اندازه ذرات درشت یا سرعت ناکافی سیفون' },
      { id: 'solvent_odor', stage: 'cooling_desiccator', labelFa: 'استشمام بوی حلال پترولیوم اتر از بالن پس از خروج از آون و کاهش وزن مستمر', descriptionFa: 'عدم تبخیر و خشک شدن کامل حلال باقیمانده در بالن قبل از توزین نهایی' }
    ]
  },
  {
    id: 'fat_gerber',
    nameFa: 'درصد چربی شیر و لبنیات (روش اسیدبوتیرومتری ژربر)',
    nameEn: 'Fat Content in Milk & Dairy (Gerber Butyrometer Method)',
    category: 'dairy_testing',
    standardReference: 'INSO 366 / ISO 2446 / AOAC 2000.18',
    stages: [
      'preparation_weighing',
      'digestion_reaction',
      'distillation_extraction',
      'instrumental_reading',
      'calculation_reporting'
    ],
    commonEquipment: [
      'بوتیرومتر کالیبره ژربر شیر با درپوش لاستیکی (Gerber Butyrometer)',
      'سانتریفیوژ اختصاصی ژرber با گرمکن ۶۵ درجه (Gerber Heated Centrifuge 1100 RPM)',
      'حمام آب گرم ۶۵ درجه سلسیوس (Water Bath 65°C)',
      'دیسپنسر اتوماتیک اسید سولفوریک d=1.820 و ایزوآمیل الکل'
    ],
    numericalParameters: [
      { key: 'milk_volume', labelFa: 'حجم شیر پیپت‌شده', unit: 'mL', defaultValue: 10.75 },
      { key: 'acid_density', labelFa: 'چگالی اسید سولفوریک', unit: 'g/cm³', defaultValue: 1.820 },
      { key: 'centrifuge_temp', labelFa: 'دمای حمام/سانتریفیوژ', unit: '°C', defaultValue: 65 },
      { key: 'fat_reading', labelFa: 'قرائت ستون چربی', unit: '%', defaultValue: 3.20 }
    ],
    symptomPresets: [
      { id: 'charred_plug', stage: 'digestion_reaction', labelFa: 'تشکیل لایه سیاه سوخته در پایین ستون چربی و عدم تفکیک شفاف', descriptionFa: 'چگالی بالای اسید سولفوریک یا اختلاط ناگهانی و داغ شدن موضعی شیر با اسید' },
      { id: 'cloudy_column', stage: 'distillation_extraction', labelFa: 'ستون چربی کدر و حاوی ذرات سفید لخته کازئین حل نشده', descriptionFa: 'ضعیف بودن اسید، دمای پایین حمام آب یا اختلاط ناکافی بوتیرومتر' },
      { id: 'reading_parallax', stage: 'instrumental_reading', labelFa: 'خطای قرائت ستون چربی به علت خطای انکسار یا تنظیم نبودن انتهای ستون روی صفر', descriptionFa: 'تنظیم نبودن منیسک پایینی ستون چربی بر روی خطوط نشانه بوتیرومتر' }
    ]
  },
  {
    id: 'ash_muffle',
    nameFa: 'درصد خاکستر کل (روش کوره مافل الکتریکی ۵۵۰ درجه)',
    nameEn: 'Total Ash Content (Muffle Furnace 550°C)',
    category: 'proximate_analysis',
    standardReference: 'INSO 5626 / AOAC 923.03 / ISO 2171',
    stages: [
      'preparation_weighing',
      'digestion_reaction',
      'cooling_desiccator',
      'calculation_reporting'
    ],
    commonEquipment: [
      'کوره مافل الکتریکی با کنترلر دیجیتال دما (Muffle Furnace 550°C)',
      'بوته پودقه چینی یا پلاتینی با درب (Porcelain Crucible)',
      'ترازوی تحلیلی کالیبره (Analytical Balance 0.1mg)',
      'شعله بنسن یا هیتر اولیه پیش‌خاکسترگیری (Bunsen Burner / Hot Plate)'
    ],
    numericalParameters: [
      { key: 'm0', labelFa: 'جرم بوته خالی تثبیت شده', unit: 'g', defaultValue: 18.5021 },
      { key: 'm1', labelFa: 'جرم بوته + نمونه قبل از کوره', unit: 'g', defaultValue: 23.5021 },
      { key: 'm2', labelFa: 'جرم بوته + خاکستر بعد از کوره', unit: 'g', defaultValue: 18.5771 },
      { key: 'furnace_temp', labelFa: 'دمای کوره', unit: '°C', defaultValue: 550 }
    ],
    symptomPresets: [
      { id: 'black_carbon_specks', stage: 'digestion_reaction', labelFa: 'باقیماندن ذرات سیاه کربن در خاکستر پس از ۴ ساعت کوره ۵۵۰ درجه', descriptionFa: 'اکسیداسیون ناقص مواد آلی یا احاطه کربن توسط نمک‌های ذوب شده' },
      { id: 'spattering_pop', stage: 'digestion_reaction', labelFa: 'پاشش و پرتاب شدن نمونه به دیواره‌های کوره حین حرارت‌دهی اولیه (Sample Spattering)', descriptionFa: 'قرار دادن مستقیم نمونه مرطوب یا حاوی چربی بالا در کوره بدون پیش‌سوزاندن' },
      { id: 'crucible_breakage', stage: 'cooling_desiccator', labelFa: 'ترک خوردن یا خرد شدن بوته چینی حین انتقال از کوره به دسیکاتور', descriptionFa: 'شوک حرارتی ناشی از انتقال بوته در دمای بالای ۲۰۰ درجه مستقیماً به محیط یا دسیکاتور سرد' }
    ]
  },
  {
    id: 'titratable_acidity',
    nameFa: 'اسیدیته قابل تیتر و pH (روش تیتراسیون اسید-باز با سود)',
    nameEn: 'Titratable Acidity & pH Measurement',
    category: 'titration_chemistry',
    standardReference: 'INSO 2852 / AOAC 942.15 / ISO 750',
    stages: [
      'sampling_homogenization',
      'preparation_weighing',
      'titration_endpoint',
      'instrumental_reading',
      'calculation_reporting'
    ],
    commonEquipment: [
      'بورت شیشه‌ای یا دیجیتال با دقت ۰.۰۵ میلی‌لیتر (Burette 25mL / 50mL)',
      'دستگاه pH متر کالیبره با الکترود شیشه‌ای ترکیبی (pH Meter with ATC)',
      'محلول استاندارد هیدروکسید سدیم ۰.۱ نرمال فاکتوردار (Standard 0.1N NaOH)',
      'معرف فنل‌فتالئین ۱٪ در اتانول ۹۶ درجه'
    ],
    numericalParameters: [
      { key: 'v_naoh', labelFa: 'حجم سود مصرفی نمونه', unit: 'mL', defaultValue: 4.20 },
      { key: 'n_naoh', labelFa: 'نرمالیته سود استاندارد', unit: 'N', defaultValue: 0.1000 },
      { key: 'sample_mass', labelFa: 'وزن یا حجم نمونه', unit: 'g', defaultValue: 10.00 },
      { key: 'acid_factor', labelFa: 'فاکتور میلی‌اکی‌والان اسید', defaultValue: 0.090 }
    ],
    symptomPresets: [
      { id: 'fading_pink', stage: 'titration_endpoint', labelFa: 'محو شدن سریع رنگ صورتی فنل‌فتالئین پس از ۵ تا ۱۰ ثانیه (Fading Pink Endpoint)', descriptionFa: 'جذب دی‌اکسید کربن هوا توسط محلول قلیایی و تولید اسید کربنیک' },
      { id: 'ph_drift', stage: 'instrumental_reading', labelFa: 'پرش و رانش مداوم قرائت pH متر و عدم ثبات عدد روی نمایشگر', descriptionFa: 'خشک شدن حباب شیشه‌ای الکترود، گرفتگی دیافراگم سرامیکی یا انقضای بافرهای کالیبراسیون' },
      { id: 'naoh_titer_change', stage: 'preparation_weighing', labelFa: 'کاهش تدریجی غلظت و تغییر فاکتور محلول سود استاندارد با گذشت زمان', descriptionFa: 'جذب گاز CO2 از هوای آزمایشگاه و تشکیل کربنات سدیم نامحلول در بورت' }
    ]
  },
  {
    id: 'salt_mohr',
    nameFa: 'درصد نمک طعام (روش تیتراسیون رسوبی مور با نیترات نقره)',
    nameEn: 'Salt (% NaCl) by Mohr Precipitation Titration',
    category: 'titration_chemistry',
    standardReference: 'INSO 1807 / AOAC 935.47 / ISO 1738',
    stages: [
      'preparation_weighing',
      'titration_endpoint',
      'calculation_reporting'
    ],
    commonEquipment: [
      'بورت کهربایی یا تیره برای نیترات نقره (Amber Burette 0.1N AgNO3)',
      'محلول شناساگر کرومات پتاسیم ۵٪ (5% K2CrO4 Indicator)',
      'همزن مغناطیسی با مگنت با روکش تفلون (Magnetic Stirrer)'
    ],
    numericalParameters: [
      { key: 'vs', labelFa: 'حجم مصرفی نیترات نقره نمونه', unit: 'mL', defaultValue: 8.60 },
      { key: 'vb', labelFa: 'حجم مصرفی آزمون شاهد (بلانک)', unit: 'mL', defaultValue: 0.10 },
      { key: 'n_agno3', labelFa: 'نرمالیته نیترات نقره', unit: 'N', defaultValue: 0.1000 },
      { key: 'sample_mass', labelFa: 'جرم نمونه', unit: 'g', defaultValue: 5.00 }
    ],
    symptomPresets: [
      { id: 'no_red_precipitate', stage: 'titration_endpoint', labelFa: 'عدم تشکیل رسوب قرمز-آجری کرومات نقره و قرمز نشدن نقطه پایانی', descriptionFa: 'اسیدی بودن شدید نمونه که باعث تبدیل کرومات به دی‌کرومات و انحلال رسوب می‌شود' },
      { id: 'high_blank_salt', stage: 'calculation_reporting', labelFa: 'حجم بالای شاهد آب مقطر (Vb > 0.3 mL) یا کدر بودن آب اولیه', descriptionFa: 'آلودگی آب مقطر یا ظروف آزمایشگاه به یون کلرید' }
    ]
  },
  {
    id: 'microbiology_culture',
    nameFa: 'شمارش کلی میکروبی و کلی‌فرم‌ها (روش کشت پورپلیت و انکوباسیون)',
    nameEn: 'Total Plate Count & Coliforms (Pour Plate Method)',
    category: 'microbiology',
    standardReference: 'INSO 5272-1 / ISO 4833 / ISO 7218 / Compendium 5th Ed.',
    stages: [
      'sampling_homogenization',
      'preparation_weighing',
      'digestion_reaction',
      'instrumental_reading',
      'storage_preservation'
    ],
    commonEquipment: [
      'دستگاه استریل‌کننده اتوکلاو (Autoclave 121°C 15psi)',
      'انکوباتور دقیق میکروبیولوژی با کنترل دما ±۰.۵ درجه (Incubator 30°C / 37°C)',
      'هود لامینار فلو کلاس II با لامپ UV (Laminar Flow Hood)',
      'کلنی کانتر دیجیتال با ذره‌بین و قلم حساس به فشار (Colony Counter)'
    ],
    numericalParameters: [
      { key: 'incubation_temp', labelFa: 'دمای انکوباتور', unit: '°C', defaultValue: 30 },
      { key: 'incubation_time', labelFa: 'مدت زمان انکوباسیون', unit: 'hours', defaultValue: 48 },
      { key: 'colony_count', labelFa: 'شمارش کلنی در رقت معتبر', unit: 'CFU', defaultValue: 145 },
      { key: 'dilution_factor', labelFa: 'ضریب رقت پلیت', defaultValue: 100 }
    ],
    symptomPresets: [
      { id: 'spreader_agar', stage: 'instrumental_reading', labelFa: 'رشد لایه‌ای و پخش‌شونده باکتری روی تمام سطح پلیت (Spreader Colonies)', descriptionFa: 'وجود قطرات آب تقطیرشده روی درب پلیت یا مرطوب بودن سطح آگار حین ریختن' },
      { id: 'blank_plate_colonies', stage: 'instrumental_reading', labelFa: 'رشد کلنی در پلیت شاهد منفی (Negative Control Contamination)', descriptionFa: 'آلودگی هوا، عدم استریل بودن محیط کشت، سرپیپت یا بافر رقت‌ساز' },
      { id: 'agar_thermal_shock', stage: 'digestion_reaction', labelFa: 'کاهش غیرطبیعی شمارش کلنی نسبت به انتظار یا پلیت‌های بدون رشد', descriptionFa: 'ریختن آگار مذاب در دمای بالاتر از ۵۰ درجه که باعث شوک حرارتی و مرگ باکتری‌ها شده است' }
    ]
  },
  {
    id: 'peroxide_value',
    nameFa: 'عدد پراکسید روغن‌ها و چربی‌ها (روش یدومتری با تیوسولفات)',
    nameEn: 'Peroxide Value in Fats and Oils (Iodometric Titration)',
    category: 'oils_and_fats',
    standardReference: 'INSO 4179 / AOAC 965.33 / ISO 3960 / AOCS Cd 8b-90',
    stages: [
      'preparation_weighing',
      'digestion_reaction',
      'titration_endpoint',
      'calculation_reporting'
    ],
    commonEquipment: [
      'ارلن مایر ۲۵۰ میلی‌لیتر درپیچ‌دار (Iodine Flask with Stopper)',
      'بورت اتوماتیک ۵ یا ۱۰ میلی‌لیتر با دقت ۰.۰۱ (Microburette 0.01N Thiosulfate)',
      'ترازوی تحلیلی (Analytical Balance)',
      'زمان‌سنج آزمایشگاهی (Digital Timer 60s)'
    ],
    numericalParameters: [
      { key: 'vs', labelFa: 'حجم تیوسولفات سدیم نمونه', unit: 'mL', defaultValue: 2.40 },
      { key: 'vb', labelFa: 'حجم تیوسولفات سدیم شاهد (Blank)', unit: 'mL', defaultValue: 0.05 },
      { key: 'n_thio', labelFa: 'نرمالیته دقیق تیوسولفات', unit: 'N', defaultValue: 0.0100 },
      { key: 'fat_mass', labelFa: 'وزن روغن یا چربی', unit: 'g', defaultValue: 5.00 }
    ],
    symptomPresets: [
      { id: 'premature_iodine', stage: 'digestion_reaction', labelFa: 'آزاد شدن خودبخودی ید و تیره شدن محلول شاهد حتی بدون وجود روغن (High Blank)', descriptionFa: 'اکسیداسیون یدید توسط اکسیژن هوا یا نور خورشید و ناخالصی اسید استیک گلاسیال' },
      { id: 'endpoint_return', stage: 'titration_endpoint', labelFa: 'برگشت مجدد رنگ آبی تیره چسب نشاسته بلافاصله پس از بی‌رنگ شدن تیتر', descriptionFa: 'آزاد شدن تدریجی ید باقیمانده در فاز حلال کلروفرم به علت اختلاط ناکافی' }
    ]
  }
];

/**
 * Verified Comprehensive Troubleshooting Rules Database with Mandatory Scientific Sources
 */
export const VERIFIED_LAB_ERRORS_DATABASE: DiagnosedLabError[] = [
  // -------------------------------------------------------------
  // MOISTURE CONTENT FAILURE MODES
  // -------------------------------------------------------------
  {
    id: 'ERR_MOIST_01_DESICCATOR_SILICA_EXHAUST',
    titleFa: 'اشباع رطوبتی سیلیکاژل دسیکاتور و جذب رطوبت اتمسفر حین سردسازی',
    titleEn: 'Exhausted Silica Gel in Desiccator & Atmospheric Moisture Absorption',
    category: 'equipment_error',
    stage: 'cooling_desiccator',
    relevanceScore: 95,
    confidence: {
      level: 'high',
      percentage: 92,
      labelFa: 'سطح اطمینان بالا (تطابق کامل شواهد فیزیکی)',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'افزایش وزن نمونه یا رانش صعودی ارقام ترازو بلافاصله پس از خروج از دسیکاتور، نشانه قطعی جذب بخار آب ناشی از سیلیکاژل غیرفعال است.'
    },
    symptomFa: 'وزن ظرف و نمونه (M2) پس از آون و سردسازی افزایش یافته یا حین قرارگیری روی کفه ترازو به سرعت صعود می‌کند (+۰.۰۰۱g در دقیقه).',
    probableCauseFa: 'سیلیکاژل موجود در کف دسیکاتور به دلیل جذب آب اشباع شده (تغییر رنگ از آبی به صورتی یا از نارنجی به بی‌رنگ) و رطوبت نسبی داخل محفظه دسیکاتور بالا رفته است.',
    diagnosticMethodFa: '۱. بررسی بصری رنگ سیلیکاژل در کف محفظه. ۲. قرار دادن یک رطوبت‌سنج کوچک داخل دسیکاتور (باید RH < 10% باشد). ۳. توزین مجدد یک پلیت خالی خشک در فواصل ۲ دقیقه‌ای روی ترازو.',
    correctiveActionFa: 'پلیت‌ها را مجدداً به مدت ۶۰ دقیقه در آون ۱۰۳ درجه قرار دهید. سیلیکاژل‌های مرطوب را در آون ۱۶۰-۱۵۰ درجه به مدت ۳ ساعت احیا نمایید تا رنگ اولیه احیا شود. لبه‌های سمباده‌ای دسیکاتور را با گریس سیلیکونی هوابندی کنید.',
    preventiveActionFa: 'تدوین برنامه منظم هفتگی برای بررسی رنگ و احیای حرارتی سیلیکاژل بر اساس الزامات استاندارد ISO 17025 و باز نکردن درب دسیکاتور بیش از ۵ ثانیه حین جابجایی.',
    source: {
      standardCode: 'INSO 2406 / ISO 712 / AOAC 925.10 / Eurachem QA Guide',
      titleFa: 'استاندارد ملی ایران ۲۴۰۶ و راهنمای تضمین کیفیت در شیمی تجزیه Eurachem',
      fullCitation: 'Eurachem / CITAC Guide: Quality Assurance for Research and Development and Non-routine Analysis (2021) & AOAC Official Methods of Analysis (21st Ed.), Appendix E.',
      yearOrEdition: '2021 / 21st Edition',
      organization: 'AOAC International & INSO & Eurachem',
      clauseOrPage: 'Section 4.1.2 Dessicator Maintenance & Moisture Control',
      urlOrRefId: 'AOAC-925.10'
    },
    triggerKeywords: ['افزایش وزن', 'دسیکاتور', 'سیلیکاژل', 'رانش وزن', 'ترازو', 'جذب رطوبت', 'wt_increase', 'balance_drift']
  },
  {
    id: 'ERR_MOIST_02_CASE_HARDENING_SUGAR_CHAR',
    titleFa: 'پوسته بستن سطح نمونه (Case Hardening) و حبس رطوبت یا کاراملیزاسیون',
    titleEn: 'Case Hardening & Sugar Caramelization at High Oven Temperature',
    category: 'temperature_error',
    stage: 'digestion_reaction',
    relevanceScore: 90,
    confidence: {
      level: 'high',
      percentage: 88,
      labelFa: 'سطح اطمینان بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'قهوه‌ای شدن و تشکیل پوسته سطحی چرمی در فرآورده‌های قندی/نشاسته‌ای مانع خروج آب و سبب تخریب حرارتی قندها می‌شود.'
    },
    symptomFa: 'سطح نمونه در پلیت قهوه‌ای تیره تا سیاه شده، بوی کارامل یا سوختگی استشمام می‌شود و با ادامه آون‌گذاری کاهش وزن متوقف نمی‌شود (تخریب مداوم قندها).',
    probableCauseFa: '۱. دمای آون بالاتر از ۱۰۵ درجه کالیبره نشده است. ۲. نمونه حاوی قندهای احیاکننده بالا (مربا، عسل، خرما) بدون ماسه دریایی خنثی پهن شده و پوسته غیرقابل نفوذ تشکیل داده است.',
    diagnosticMethodFa: '۱. کالیبراسیون سنسور دمای آون با ترمومتر کالیبره مرجع در نقاط مختلف سینی. ۲. بررسی وجود ماسه سیلیسی اسیدشویی شده در آزمون فرآورده‌های چسبناک و مایع.',
    correctiveActionFa: 'آزمون را با استفاده از ۲۵ گرم ماسه دریایی کوارتز اسیدشویی و میله شیشه‌ای کوچک تکرار کنید تا سطح تماس افزایش یابد. در صورت وجود قند بالا، از روش آون تحت خلاء (Vacuum Oven) در دمای ۷۰ درجه و فشار کمتر از ۱۰۰ میلی‌بار استفاده شود.',
    preventiveActionFa: 'رعایت دقیق استاندارد INSO 1753 و روش AOAC 925.45 برای فرآورده‌های شکری و قنادی با آون تحت خلاء.',
    source: {
      standardCode: 'INSO 1753 / AOAC 925.45 / ISO 6731',
      titleFa: 'استاندارد ملی ایران ۱۷۵۳ - فرآورده‌های با قند بالا - تعیین ماده خشک و رطوبت',
      fullCitation: 'AOAC Official Method 925.45: Moisture in Sugars and Sugar Products (Vacuum Oven Method).',
      yearOrEdition: '2023',
      organization: 'AOAC International',
      clauseOrPage: 'Method 925.45 B (Sand Dilution Procedure)'
    },
    triggerKeywords: ['قهوه‌ای', 'سوختگی', 'کارامل', 'پوسته', 'قند', 'عسل', 'مربا', 'charring_crust']
  },
  {
    id: 'ERR_MOIST_03_HOT_WEIGHING_CONVECTION',
    titleFa: 'توزین پلیت گرم قبل از همدما شدن با محیط و ایجاد جریان همرفت حرارتی',
    titleEn: 'Weighing Hot Crucibles/Dishes & Thermal Convection Force Error',
    category: 'weighing_error',
    stage: 'preparation_weighing',
    relevanceScore: 92,
    confidence: {
      level: 'high',
      percentage: 90,
      labelFa: 'سطح اطمینان بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'هوای گرم اطراف ظرف با چگالی کمتر بالا رفته و نیروی بالابرنده آیرودینامیک ایجاد می‌کند که عدد ترازو را کمتر از واقعیت نشان می‌دهد.'
    },
    symptomFa: 'وزن خوانده شده روی ترازو کمتر از مقدار واقعی ثبت می‌شود و با گذشت ثانیه‌ها به آرامی افزایش می‌یابد تا ثابت شود.',
    probableCauseFa: 'خارج کردن پلیت از آون یا کوره و قرار دادن مستقیم آن روی کفه ترازو با زمان ماندگاری کمتر از ۳۰ دقیقه در دسیکاتور.',
    diagnosticMethodFa: 'لمس دمای بدنه دسیکاتور یا پودقه؛ مقایسه دو وزن‌کشی با فاصله ۱۰ دقیقه در دمای اتاق ۲۲ درجه.',
    correctiveActionFa: 'پلیت را دقیقاً به مدت ۳۰ تا ۴۵ دقیقه در دسیکاتور در دمای ۲۲±۲ درجه اتاق آزمایشگاه قرار دهید تا کاملاً همدما با محیط شود سپس توزین کنید.',
    preventiveActionFa: 'نصب تایمر آزمایشگاهی اختصاصی برای زمان خنک‌سازی دسیکاتور و عدم توزین هیچ ظرفی بالاتر از دمای محیط طبق دستورالعمل OIML R 76-1.',
    source: {
      standardCode: 'OIML R 76-1 / ASTM E898 / ISO 17025:2017 Clause 6.4',
      titleFa: 'سازمان بین‌المللی اندازه‌شناسی قانونی OIML R 76-1 و راهنمای توزین تحلیلی ASTM',
      fullCitation: 'OIML R 76-1: Non-automatic weighing instruments & ASTM E898: Standard Practice for Testing Top-Loading and Analytical Balances.',
      yearOrEdition: '2020',
      organization: 'OIML / ASTM International',
      clauseOrPage: 'Section 8.2 Thermal Stability in Micro-weighing'
    },
    triggerKeywords: ['گرم', 'داغ', 'پرش وزن', 'همرفت', 'خنک شدن', 'ترازو', 'balance_drift']
  },

  // -------------------------------------------------------------
  // KJELDAHL CRUDE PROTEIN FAILURE MODES
  // -------------------------------------------------------------
  {
    id: 'ERR_KJEL_01_AMMONIA_LOSS_DISTILLATION_LEAK',
    titleFa: 'نشتی بخار آمونیاک حین تقطیر یا گرم شدن ارلن گیرنده اسید بوریک',
    titleEn: 'Ammonia Vapor Leakage During Distillation or Overheating Receiver',
    category: 'equipment_error',
    stage: 'distillation_extraction',
    relevanceScore: 96,
    confidence: {
      level: 'high',
      percentage: 94,
      labelFa: 'سطح اطمینان بسیار بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'پایین بودن راندمان بازیافت روی نمونه‌های استاندارد آمونیوم سولفات به علت تبخیر و عدم به دام افتادن گاز NH3 در اسید بوریک گرم.'
    },
    symptomFa: 'درصد پروتئین به دست آمده به مراتب کمتر از مقدار واقعی است؛ استشمام بوی آمونیاک در اطراف دستگاه؛ بازیافت استاندارد سولفات آمونیوم کمتر از ۹۸٪.',
    probableCauseFa: '۱. فرسودگی یا پارگی واشر اورینگ لاستیکی محل اتصال لوله هضم به دستگاه تقطیر. ۲. دمای مایع جمع‌آوری شده در ارلن اسید بوریک از ۲۵ درجه فراتر رفته (به علت عدم کارکرد مناسب کندانسور و آب سرد). ۳. انتهای لوله مبرد داخل محلول اسید بوریک غوطه‌ور نبوده است.',
    diagnosticMethodFa: '۱. اجرای تست صحه‌گذاری با ۱۰۰ میلی‌گرم سولفات آمونیوم استاندارد ۹۹.۹٪ (باید بازیافت ۲۱.۲ ± ۰.۲ درصد نیتروژن بدهد). ۲. اندازه‌گیری دمای خروجی مبرد با دماسنج (باید کمتر از ۲۵°C باشد).',
    correctiveActionFa: 'تعویض واشرهای اتصالات شیشه‌ای؛ تنظیم جریان آب سرد مبرد به گونه‌ای که تقطیر سرد باشد؛ اطمینان از قرار گرفتن کامل نازل خروجی مبرد در عمق محلول اسید بوریک تا لحظه پایانی.',
    preventiveActionFa: 'اجرای تست روزانه بازیابی (Recovery Test) با نمک آمونیوم استاندارد قبل از شروع آنالیز نمونه‌های اصلی طبق استاندارد AOAC 991.20.',
    source: {
      standardCode: 'INSO 639 / AOAC 991.20 / ISO 8968-1 / IDF 20-1',
      titleFa: 'استاندارد ملی ایران ۶۳۹ و روش رسمی AOAC 991.20 - تعیین نیتروژن کجلدال',
      fullCitation: 'AOAC Official Method 991.20: Nitrogen (Crude Protein) in Milk - Kjeldahl Steam Distillation Protocol.',
      yearOrEdition: '2022',
      organization: 'AOAC International / International Dairy Federation (IDF)',
      clauseOrPage: 'Clause 991.20.C Distillation Assembly & QC Checks'
    },
    triggerKeywords: ['پروتئین کم', 'بازیافت کم', 'آمونیاک', 'تقطیر', 'نشتی', 'اسید بوریک', 'low_recovery']
  },
  {
    id: 'ERR_KJEL_02_INCOMPLETE_DIGESTION_BLACK',
    titleFa: 'هضم ناقص مواد آلی به علت کمبود کاتالیزور، دمای پایین یا زمان کوتاه',
    titleEn: 'Incomplete Digestion Due to Catalyst Deficiency or Low Block Temperature',
    category: 'time_error',
    stage: 'digestion_reaction',
    relevanceScore: 92,
    confidence: {
      level: 'high',
      percentage: 91,
      labelFa: 'سطح اطمینان بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'سیاه ماندن محلول یا رسوب ذرات دوده نشان‌دهنده عدم تبدیل کامل نیتروژن آلی اسیدهای آمینه به سولفات آمونیوم است.'
    },
    symptomFa: 'محلول داخل لوله کجلدال پس از ۶۰ دقیقه هنوز قهوه‌ای تیره یا سیاه کدر است و به رنگ سبز زمردی شفاف و زلال تبدیل نشده است.',
    probableCauseFa: '۱. دمای بلوک هضم به ۴۲۰-۴۱۰ درجه نرسیده است. ۲. مقدار قرص کاتالیزور (سولفات پتاسیم و سولفات مس K2SO4/CuSO4) کافی نبوده تا نقطه جوش اسید را بالا ببرد. ۳. نسبت اسید سولفوریک به ماده خشک نمونه کم بوده و اسید حین واکنش تبخیر شده است.',
    diagnosticMethodFa: '۱. بررسی دمای بلوک حرارتی با سنسور کالیبره. ۲. بررسی شفافیت محلول و جوشش آرام اسید غلیظ.',
    correctiveActionFa: '۵ میلی‌لیتر دیگر اسید سولفوریک غلیظ ۹۸٪ و یک قرص کاتالیزور به لوله اضافه نموده و هضم را در دمای ۴۲۰ درجه به مدت ۴۵ دقیقه دیگر پس از شفاف شدن ادامه دهید.',
    preventiveActionFa: 'رعایت نسبت استاندارد ۱۲ تا ۱۵ میلی‌لیتر اسید سولفوریک و ۳.۵ گرم سولفات پتاسیم به ازای هر ۱ گرم ماده خشک طبق SOP استاندارد.',
    source: {
      standardCode: 'INSO 639 / ISO 8968-1 / AOAC 991.20',
      titleFa: 'استاندارد ملی ایران ۶۳۹ و روش ISO 8968-1 برای هضم کجلدال',
      fullCitation: 'ISO 8968-1:2014 / IDF 020-1: Milk and milk products - Determination of nitrogen content - Part 1: Kjeldahl principle and crude protein calculation.',
      yearOrEdition: '2014 (Confirmed 2021)',
      organization: 'International Organization for Standardization (ISO)',
      clauseOrPage: 'Section 8.2 Digestion Parameters & Temperature Profiling'
    },
    triggerKeywords: ['سیاه', 'هضم ناقص', 'سبز نشدن', 'کاتالیزور', 'اسید سولفوریک', 'دمای هضم', 'black_digest']
  },
  {
    id: 'ERR_KJEL_03_CONTAMINATED_REAGENTS_HIGH_BLANK',
    titleFa: 'آلودگی معرف‌ها یا آب مقطر به یون آمونیوم و بالا رفتن حجم شاهد (Blank)',
    titleEn: 'Reagent Contamination with Ammonia/Nitrate Yielding High Blank Titre',
    category: 'contamination',
    stage: 'titration_endpoint',
    relevanceScore: 94,
    confidence: {
      level: 'high',
      percentage: 89,
      labelFa: 'سطح اطمینان بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'مصرف اسید تیترکننده در بلانک بدون نمونه بالاتر از ۰.۲ میلی‌لیتر نشانه ورود نیتروژن خارجی از معرف‌ها، آب یا هوای محیط است.'
    },
    symptomFa: 'حجم اسید مصرفی برای تیتر شاهد (Vb) بیش از ۰.۳ تا ۰.۵ میلی‌لیتر است و در صورت کسر از نمونه، خطای منفی شدید ایجاد می‌کند.',
    probableCauseFa: '۱. استفاده از آب مقطر بی‌کیفیت یا آلوده به ترکیبات آمونیاکی. ۲. آلودگی هیدروکسید سدیم یا اسید سولفوریک به نیترات/آمونیاک. ۳. جذب بخارات آمونیاک از هوای آزمایشگاه حین نگهداری معرف‌ها.',
    diagnosticMethodFa: 'اجرای تست مجزای بلانک آب، بلانک اسید و بلانک سود برای تفکیک منبع آلودگی.',
    correctiveActionFa: 'تعویض آب مقطر با آب دیونیزه گرید ۱ با هدایت کمتر از ۱ میکروزیمنس؛ استفاده از اسید سولفوریک گرید فوق خالص (GR for Analysis Nitrogen-Free)؛ تعویض محلول سود.',
    preventiveActionFa: 'جداسازی انبار مواد آمونیاکی از فضای آزمایشگاه و درپوش‌گذاری محکم کلیه بطری‌های اسید بوریک و آب دیونیزه.',
    source: {
      standardCode: 'AOAC Appendix E / ISO 17025 Clause 7.7 / INSO 639',
      titleFa: 'الزامات صحه‌گذاری روش‌های شیمی تجزیه AOAC و کنترل کیفیت ISO 17025',
      fullCitation: 'AOAC Guidelines for Single-Laboratory Validation of Chemical Methods for Dietary Supplements and Botanicals (Blank Control Limits).',
      yearOrEdition: '2020',
      organization: 'AOAC International',
      clauseOrPage: 'Section 4.3 Reagent Blank Acceptance Criteria (Max 0.15 mL 0.1N)'
    },
    triggerKeywords: ['شاهد', 'بلانک بالا', 'آلودگی', 'آب مقطر', 'آمونیاک', 'high_blank']
  },

  // -------------------------------------------------------------
  // CRUDE FAT (SOXHLET & GERBER) FAILURE MODES
  // -------------------------------------------------------------
  {
    id: 'ERR_FAT_01_WET_SAMPLE_EXTRACTION_FAILURE',
    titleFa: 'استخراج چربی از نمونه مرطوب بدون خشک‌کردن اولیه و نفوذناپذیری حلال',
    titleEn: 'Solvent Extraction on Wet Sample Causing Channeling & Hydrophobic Repulsion',
    category: 'sampling_error',
    stage: 'sampling_homogenization',
    relevanceScore: 93,
    confidence: {
      level: 'high',
      percentage: 90,
      labelFa: 'سطح اطمینان بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'حلال‌های غیرقطبی پترولیوم اتر و دی‌اتیل اتر توانایی نفوذ به بافت‌های محتوی آب را ندارند و راندمان استخراج به شدت افت می‌کند.'
    },
    symptomFa: 'درصد چربی به دست آمده بسیار کمتر از مقدار واقعی است (مثلاً ۵٪ به جای ۱۸٪)؛ گلوله‌ای شدن نمونه داخل کارتوش.',
    probableCauseFa: 'قرار دادن مستقیم نمونه مرطوب (مانند گوشت، سس، پنیر) داخل کارتوش سوکسله بدون خشک‌کردن مقدماتی در آون یا مخلوط کردن با سولفات سدیم بدون آب (Na2SO4).',
    diagnosticMethodFa: 'بررسی رطوبت نمونه قبل از استخراج؛ بررسی وجود رطوبت در داخل کارتوش پس از پایان استخراج.',
    correctiveActionFa: 'نمونه را ابتدا با نسبت ۱ به ۵ با پودر سولفات سدیم بی‌آب یا ماسه کوارتز در هاون بسایید و در آون ۸۰ درجه خشک کنید تا کاملاً پودری و خشک شود سپس در کارتوش سوکسله قرار دهید.',
    preventiveActionFa: 'رعایت دقیق الزام پیش‌خشک‌کردن (Pre-drying Step) در استانداردهای INSO 1993 و AOAC 920.39 برای کلیه نمونه‌های غذایی با رطوبت بالای ۵٪.',
    source: {
      standardCode: 'INSO 1993 / AOAC 920.39 / ISO 1443',
      titleFa: 'استاندارد ملی ایران ۱۹۹۳ و روش بین‌المللی ISO 1443 برای استخراج چربی',
      fullCitation: 'ISO 1443: Meat and meat products - Determination of total fat content (Reference method with acid hydrolysis and pre-drying).',
      yearOrEdition: '2021',
      organization: 'ISO / INSO',
      clauseOrPage: 'Section 7.1 Sample Pre-treatment & Dehydration'
    },
    triggerKeywords: ['چربی کم', 'نمونه مرطوب', 'سوکسله', 'پترولیوم اتر', 'کارتوش', 'low_fat_yield']
  },
  {
    id: 'ERR_FAT_02_GERBER_CHARRED_PLUG',
    titleFa: 'سوختن و شار زدن ستون چربی در آزمون ژربر به علت غلظت بالای اسید یا ریزش مستقیم',
    titleEn: 'Charred Dark Plug in Gerber Butyrometer Due to Direct Acid Contact / High SG',
    category: 'operator_error',
    stage: 'digestion_reaction',
    relevanceScore: 95,
    confidence: {
      level: 'high',
      percentage: 93,
      labelFa: 'سطح اطمینان بسیار بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'اسید سولفوریک غلیظ در تماس مستقیم با شیر بدون ایجاد فاز محافظ، پروتئین‌ها و قند لاکتوز را سوزانده و لخته کربنی سیاه تشکیل می‌دهد.'
    },
    symptomFa: 'انتهای ستون چربی در بوتیرومتر دارای پلاگ سیاه یا لخته تیره چسبناک است و خط مرزی با فاز مایع تفکیک نمی‌شود.',
    probableCauseFa: '۱. ریختن سریع شیر روی اسید سولفوریک به جای سر دادن آرام از دیواره لوله با زاویه ۴۵ درجه. ۲. چگالی اسید سولفوریک بیش از ۱.۸۲۵ گرم بر سانتی‌متر مکعب بوده است. ۳. تکان دادن خشن و ناگهانی بوتیرومتر به جای وارونه‌سازی آرام در داخل شیکر محافظ.',
    diagnosticMethodFa: 'اندازه‌گیری چگالی اسید با هیدرومتر استاندارد در دمای ۲۰ درجه (باید ۱.۸۲۰ تا ۱.۸۲۵ باشد).',
    correctiveActionFa: 'آزمون را تجدید کنید: ابتدا ۱۰ میلی‌لیتر اسید سولفوریک با چگالی دقیق ۱.۸۲۰ در بوتیرومتر ریخته، ۱۰.۷۵ میلی‌لیتر شیر را بسیار آرام از دیواره لوله هدایت کنید تا دو فاز مجزا تشکیل شود، سپس ۱ میلی‌لیتر ایزوآمیل الکل افزوده، درپوش را محکم کرده و با احتیاط وارونه کنید.',
    preventiveActionFa: 'استفاده از دیسپنسرهای کالیبره اتوماتیک با نازل زاویه‌دار و بررسی ماهانه دانسیته اسید طبق ISO 2446.',
    source: {
      standardCode: 'INSO 366 / ISO 2446 / AOAC 2000.18',
      titleFa: 'استاندارد ملی ایران ۳۶۶ و روش ISO 2446 - تعیین چربی شیر به روش ژربر',
      fullCitation: 'ISO 2446:2008 (IDF 226:2008): Milk - Determination of fat content - Gerber butyrometric method.',
      yearOrEdition: '2008 (Reconfirmed 2020)',
      organization: 'International Dairy Federation / ISO',
      clauseOrPage: 'Section 6.3 Reagent Preparation & Sulfuric Acid SG Control'
    },
    triggerKeywords: ['ژربر', 'بوتیرومتر', 'سیاه', 'سوخته', 'اسید سولفوریک', 'شیر', 'charred_plug']
  },

  // -------------------------------------------------------------
  // TOTAL ASH & MINERALS FAILURE MODES
  // -------------------------------------------------------------
  {
    id: 'ERR_ASH_01_CARBON_OCCLUSION_FURNACE',
    titleFa: 'احاطه کربن توسط نمک‌های مذاب و سفید نشدن خاکستر در دمای ۵۵۰ درجه',
    titleEn: 'Carbon Occlusion by Molten Salts & Incomplete Ashing at 550°C',
    category: 'temperature_error',
    stage: 'digestion_reaction',
    relevanceScore: 91,
    confidence: {
      level: 'high',
      percentage: 89,
      labelFa: 'سطح اطمینان بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'در محصولات حاوی املاح بالا (مانند رب گوجه، پنیر، سویا)، کلریدهای سدیم و پتاسیم در ۵۵۰ درجه ذوب شده و ذرات کربن را محبوس می‌کنند.'
    },
    symptomFa: 'پس از گذشت ۴ ساعت در کوره ۵۵۰ درجه، خاکستر هنوز خاکستری تیره یا دارای ذرات کربن سیاه نسوخته است.',
    probableCauseFa: 'ذوب شدن نمک‌های معدنی و ایجاد لایه محافظ شیشه‌ای که مانع نفوذ اکسیژن هوا به باقیمانده‌های کربن آلی می‌شود.',
    diagnosticMethodFa: 'مشاهده بصری لکه‌های سیاه در بستر سفید؛ وزن‌کشی‌های متوالی با اختلاف بیش از ۱ میلی‌گرم.',
    correctiveActionFa: 'بوته را از کوره خارج کرده و پس از سرد شدن، با چند قطره آب مقطر یا اسید نیتریک رقیق ۱:۱ خاکستر را مرطوب کنید، روی هیتر تبخیر کرده و مجدداً به مدت ۳۰ دقیقه در کوره ۵۵۰ درجه قرار دهید تا کربن کاملاً اکسید و سفید شود.',
    preventiveActionFa: 'انجام پیش‌سوزاندن (Pre-ashing) روی شعله ملایم بنسن زیر هود تا خروج کامل دود سیاه قبل از انتقال بوته به کوره مافل طبق INSO 5626.',
    source: {
      standardCode: 'INSO 5626 / AOAC 923.03 / ISO 2171',
      titleFa: 'استاندارد ملی ایران ۵۶۲۶ و روش AOAC 923.03 - تعیین خاکستر کل',
      fullCitation: 'AOAC Official Method 923.03: Ash of Flour (Direct Method & Nitric Acid Wetting Step for Refractory Carbon).',
      yearOrEdition: '2021',
      organization: 'AOAC International',
      clauseOrPage: 'Section 32.1.05 Ashing Protocol for High Mineral Matrix'
    },
    triggerKeywords: ['خاکستر سیاه', 'کربن', 'کوره ۵۵۰', 'سفید نشدن', 'نمک', 'black_carbon_specks']
  },

  // -------------------------------------------------------------
  // TITRATION, pH & REAGENTS FAILURE MODES
  // -------------------------------------------------------------
  {
    id: 'ERR_TITR_01_CO2_ABSORPTION_NAOH_TITER',
    titleFa: 'کربناته شدن محلول هیدروکسید سدیم و تغییر فاکتور نرمالیته به علت جذب CO2',
    titleEn: 'Carbonate Contamination of Sodium Hydroxide Standard via Atmospheric CO2',
    category: 'reagent_error',
    stage: 'titration_endpoint',
    relevanceScore: 94,
    confidence: {
      level: 'high',
      percentage: 92,
      labelFa: 'سطح اطمینان بسیار بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'گاز دی‌اکسید کربن اتمسفر با سود واکنش داده و کربنات سدیم می‌سازد که باعث محو شدن سریع رنگ فنل‌فتالئین و خطای تیتراسیون می‌شود.'
    },
    symptomFa: 'رنگ صورتی نقطه پایانی تیتراسیون فنل‌فتالئین پس از چند ثانیه به سرعت محو می‌شود؛ فاکتور سود در طول هفته کاهش می‌یابد.',
    probableCauseFa: 'عدم تجهیز مخزن بورت یا بطری نگهداری سود ۰.۱ نرمال به لوله محافظ جاذب CO2 (سودالایم / کربوسورب) و ورود مداوم هوای بازدم و اتمسفر به محلول.',
    diagnosticMethodFa: 'تیتراسیون استانداردسازی سود با محلول پتاسیم هیدروژن فتالات (KHP) گرید استاندارد اولیه با دو شناساگر فنل‌فتالئین و متیل اورانژ.',
    correctiveActionFa: 'محلول سود را تعویض کرده و طبق فارماکوپه با آب مقطر جوشیده و سرد شده (عاری از CO2) آماده‌سازی نمایید. فاکتور دقیق را با KHP تثبیت کنید.',
    preventiveActionFa: 'نصب لوله محافظ حاوی گرانول‌های سودالایم (Soda-lime Trap) در مسیر هوای ورودی بورت اتوماتیک طبق ASTM E200.',
    source: {
      standardCode: 'ASTM E200 / IUPAC Orange Book / INSO 2852',
      titleFa: 'استاندارد ASTM E200 - تهیه، استانداردسازی و نگهداری محلول‌های شیمیایی حجمی',
      fullCitation: 'ASTM E200-19: Standard Practice for Preparation, Standardization, and Storage of Standard and Reagent Solutions for Chemical Analysis.',
      yearOrEdition: '2019 (Reapproved 2024)',
      organization: 'ASTM International',
      clauseOrPage: 'Section 14: Sodium Hydroxide 0.1N Carbonate-Free Solutions'
    },
    triggerKeywords: ['صورتی محو', 'فنل فتالئین', 'سود', 'دی اکسید کربن', 'فاکتور سود', 'fading_pink', 'naoh_titer_change']
  },
  {
    id: 'ERR_TITR_02_PH_ELECTRODE_FOULING_DRIFT',
    titleFa: 'آلودگی دیافراگم سرامیکی الکترود pH با چربی/پروتئین و کندی پاسخ‌دهی',
    titleEn: 'pH Glass Electrode Diaphragm Clogging with Protein/Fat & Slope Degradation',
    category: 'calibration_error',
    stage: 'instrumental_reading',
    relevanceScore: 93,
    confidence: {
      level: 'high',
      percentage: 90,
      labelFa: 'سطح اطمینان بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'رسوب فیلم چربی شیر یا پپتیدهای پروتئینی روی حباب شیشه‌ای و جانکشن مرجع، پتانسیل نامتقارن الکترود را به هم می‌زند.'
    },
    symptomFa: 'رانش مداوم عدد pH روی نمایشگر، تاخیر بیش از ۶۰ ثانیه برای تثبیت قرائت و خطای کالیبراسیون با بافرهای ۴ و ۷ (شیب شیب کمتر از ۹۲٪).',
    probableCauseFa: '۱. آلودگی جانکشن متخلخل الکترود به لایه‌های چربی و پروتئین نمونه‌های غذایی. ۲. خشک شدن الکترود یا نگهداری در آب مقطر به جای محلول KCl ۳ مولار.',
    diagnosticMethodFa: '۱. بررسی شیب کالیبراسیون (Slope Efficiency) در دستگاه pH متر (باید بین ۹۵ تا ۱۰۲ درصد باشد). ۲. بررسی تمیزی حباب شیشه‌ای زیر نور.',
    correctiveActionFa: 'الکترود را به مدت ۱۵ دقیقه در محلول پاک‌کننده پپسین-اسید کلریدریک (۰.۱M HCl + 0.5% Pepsin) برای حذف پروتئین و سپس با اتانول برای حذف چربی شستشو دهید. سپس حداقل ۲ ساعت در محلول 3M KCl فعال‌سازی نمایید.',
    preventiveActionFa: 'شستشوی کامل الکترود با آب دیونیزه و خشک کردن با دستمال لنز بدون کشیدن روی شیشه پس از هر آزمون، و نگهداری همیشگی در محلول 3M KCl طبق IUPAC Recommendations.',
    source: {
      standardCode: 'IUPAC Recommendations 2002 / ISO 10523 / INSO 10523',
      titleFa: 'توصیه‌نامه رسمی آیوپاک IUPAC 2002 برای اندازه‌گیری دقیق pH در سامانه‌های آبی',
      fullCitation: 'IUPAC Pure and Applied Chemistry, Vol. 74, No. 11, pp. 2169-2200: Measurement of pH. Definition, Standards, and Procedures.',
      yearOrEdition: '2002 (Revalidated)',
      organization: 'IUPAC Analytical Chemistry Division',
      clauseOrPage: 'Section 5: Electrode Maintenance, Junction Cleaning & Calibration Slope'
    },
    triggerKeywords: ['پی اچ متر', 'pH رانش', 'الکترود کثیف', 'کالیبراسیون pH', 'شیب الکترود', 'ph_drift']
  },

  // -------------------------------------------------------------
  // MICROBIOLOGY CONTAMINATION & CULTURE FAILURE MODES
  // -------------------------------------------------------------
  {
    id: 'ERR_MICRO_01_AGAR_THERMAL_DEATH',
    titleFa: 'ریختن آگار مذاب در دمای بالاتر از ۵۰ درجه و ایجاد شوک حرارتی مرگبار بر باکتری‌ها',
    titleEn: 'Pouring Melted Agar at >50°C Causing Thermal Inactivation of Target Microbes',
    category: 'temperature_error',
    stage: 'digestion_reaction',
    relevanceScore: 96,
    confidence: {
      level: 'high',
      percentage: 95,
      labelFa: 'سطح اطمینان بسیار بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'باکتری‌های مزوفیل و به ویژه میکروارگانیسم‌های آسیب‌دیده ساب‌لتال در دمای بالای ۴۸ درجه دچار دناتوراسیون پروتئینی شده و رشد نمی‌کنند.'
    },
    symptomFa: 'عدم رشد کلنی یا کاهش ۱۰ تا ۱۰۰ برابری شمارش میکروبی در روش پورپلیت در مقایسه با روش کشت سطحی (Spread Plate).',
    probableCauseFa: 'عدم کنترل دمای ارلن محیط کشت پس از اتوکلاو یا بن‌ماری و ریختن آگار با دمای بالاتر از ۵۰-۴۸ درجه روی سوسپانسیون میکروبی داخل پلیت.',
    diagnosticMethodFa: 'اندازه‌گیری دمای محیط کشت داخل بن‌ماری با دماسنج کالیبره قبل از پورپلیت (باید بین ۴۴ تا ۴۷ درجه سلسیوس باشد).',
    correctiveActionFa: 'ارلن محیط کشت مذاب را ابتدا به مدت حداقل ۳۰ دقیقه در حمام آب گرم ۴۵ ± ۱ درجه قرار دهید تا تمام حجم ارلن کاملاً به دمای ۴۵ درجه برسد، سپس اقدام به پلیت‌ریزی نمایید.',
    preventiveActionFa: 'استفاده از سیستم کنترل دمای پیوسته در حمام بن‌ماری و مانیتورینگ دمای محیط کشت با دماسنج شاهد طبق استاندارد ISO 7218 و ISO 4833.',
    source: {
      standardCode: 'INSO 5272-1 / ISO 4833-1 / ISO 7218',
      titleFa: 'استاندارد ملی ایران ۵۲۷۲ و الزامات عمومی میکروبیولوژی مواد غذایی ISO 7218',
      fullCitation: 'ISO 7218:2007/Amd 1:2013: Microbiology of food and animal feeding stuffs - General requirements and guidance for microbiological examinations.',
      yearOrEdition: '2013',
      organization: 'International Organization for Standardization (ISO)',
      clauseOrPage: 'Section 9.2.2.3 Pour Plate Temperature Limits (44°C to 47°C)'
    },
    triggerKeywords: ['آگار داغ', 'پورپلیت', 'شمارش کم', 'مرگ باکتری', 'بن ماری', 'میکروبی', 'agar_thermal_shock']
  },
  {
    id: 'ERR_MICRO_02_CONDENSATION_SPREADER',
    titleFa: 'ریزش قطرات آب تقطیرشده از درب پلیت و ایجاد کلنی‌های پخش‌شونده اسپردر',
    titleEn: 'Lid Condensation Droplets Dripping on Agar Causing Spreader Colonies',
    category: 'sample_storage_error',
    stage: 'instrumental_reading',
    relevanceScore: 92,
    confidence: {
      level: 'high',
      percentage: 90,
      labelFa: 'سطح اطمینان بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'تجمع آب روی درب پلیت و چکیدن آن روی سطح آگار باعث شناور شدن باکتری‌ها و تشکیل فیلم یکنواخت غیرقابل شمارش می‌شود.'
    },
    symptomFa: 'رشد لایه‌ای پیوسته، چسبنده و مات روی تمام یا نیمی از پلیت که امکان تفکیک و شمارش کلنی‌های منفرد را غیرممکن می‌سازد.',
    probableCauseFa: '۱. انکوباسیون پلیت‌ها به صورت مستقیم (درب رو به بالا) به جای وارونه (Inverted). ۲. قرار دادن پلیت‌های داغ مستقیماً در انکوباتور سرد.',
    diagnosticMethodFa: 'بررسی جهت قرارگیری پلیت‌ها در طبقات انکوباتور.',
    correctiveActionFa: 'پس از بسته شدن و ژله‌ای شدن کامل آگار، پلیت‌ها را حتماً به صورت وارونه (درب پلیت در پایین) در انکوباتور قرار دهید. در صورت لزوم درب پلیت‌ها را قبل از انکوباسیون چند دقیقه زیر هود باز بگذارید تا رطوبت اضافی تبخیر شود.',
    preventiveActionFa: 'آموزش اپراتورها در خصوص قاعده الزامی وارونه‌گذاری کلیه پلیت‌های کشت میکروبی طبق ISO 7218.',
    source: {
      standardCode: 'ISO 7218 / Compendium 5th Edition / INSO 5272',
      titleFa: 'کتاب مرجع روش‌های آزمون میکروبی مواد غذایی APHA Compendium',
      fullCitation: 'Compendium of Methods for the Microbiological Examination of Foods (5th Edition), Chapter 8: Plating Techniques and Incubation Rules.',
      yearOrEdition: '5th Edition',
      organization: 'American Public Health Association (APHA)',
      clauseOrPage: 'Section 8.4 Incubation Orientation & Spreader Prevention'
    },
    triggerKeywords: ['اسپردر', 'پخش شونده', 'قطرات آب', 'پلیت وارونه', 'انکوباتور', 'spreader_agar']
  },

  // -------------------------------------------------------------
  // PEROXIDE VALUE & OIL OXIDATION FAILURE MODES
  // -------------------------------------------------------------
  {
    id: 'ERR_PEROX_01_AIR_OXIDATION_BLANK',
    titleFa: 'اکسیداسیون یدید توسط اکسیژن هوا و نور خورشید و خطای بلانک بالا',
    titleEn: 'Atmospheric Oxygen Oxidation of Potassium Iodide in Strong Acid & High Blank',
    category: 'reagent_error',
    stage: 'digestion_reaction',
    relevanceScore: 94,
    confidence: {
      level: 'high',
      percentage: 91,
      labelFa: 'سطح اطمینان بالا',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      rationaleFa: 'یون یدید در محیط اسیدی اسید استیک در مجاورت نور و اکسیژن هوا به سرعت به ید مولکولی I2 اکسید می‌شود.'
    },
    symptomFa: 'محلول آزمون شاهد بدون روغن پس از ۱ دقیقه به رنگ زرد پررنگ درمی‌آید و بیش از ۰.۱ میلی‌لیتر تیوسولفات مصرف می‌کند.',
    probableCauseFa: '۱. انجام آزمون زیر نور مستقیم آفتاب یا روشنایی شدید. ۲. باز ماندن درب ارلن در ۶۰ ثانیه زمان واکنش در تاریکی. ۳. ناخالصی پراکسیدی در حلال اسید استیک گلاسیال یا کلروفرم.',
    diagnosticMethodFa: 'اجرای تیتراسیون بلانک در تاریکی مطلق (مصرف تیوسولفات ۰.۰۱N باید کمتر از ۰.۰۵ میلی‌لیتر باشد).',
    correctiveActionFa: 'ارلن را بلافاصله پس از افزودن ۰.۵ میلی‌لیتر محلول اشباع یدید پتاسیم درپوش گذاشته، دقیقاً ۱ دقیقه در تاریکی مطلق (داخل کمد تاریک) قرار دهید و بلافاصله با آب مقطر رقیق کنید تا واکنش متوقف شود.',
    preventiveActionFa: 'استفاده از ارلن‌های یدومتری شیشه‌ای تیره کهربایی و حلال‌های عاری از پراکسید طبق استاندارد AOCS Cd 8b-90.',
    source: {
      standardCode: 'INSO 4179 / AOCS Cd 8b-90 / ISO 3960 / AOAC 965.33',
      titleFa: 'استاندارد ملی ایران ۴۱۷۹ و روش رسمی AOCS Cd 8b-90 برای عدد پراکسید',
      fullCitation: 'AOCS Official Method Cd 8b-90: Peroxide Value - Acetic Acid-Isooctane Method (Dark Reaction Protocol).',
      yearOrEdition: '2022',
      organization: 'American Oil Chemists\' Society (AOCS)',
      clauseOrPage: 'Section 4: Dark Incubation & Blank Verification (< 0.1 mL)'
    },
    triggerKeywords: ['پراکسید', 'ید', 'روغن', 'تیوسولفات', 'تاریکی', 'بلانک پراکسید', 'premature_iodine']
  }
];
