/**
 * Verified Benchmark Laboratory Reagents & Chemicals Dataset
 * Food Science AI Lab Suite - Part 13
 * All CAS numbers, Molecular Weights, Densities, and Safety Data are strictly referenced from
 * authentic international repositories (PubChem, Merck Index, Sigma-Aldrich SDS, NIST, ISO & INSO Standards).
 */

import { ChemicalReagent } from '../types/chemicalReagent';

export const BENCHMARK_CHEMICAL_REAGENTS: ChemicalReagent[] = [
  {
    id: 'reagent-naoh-01',
    name: 'سدیم هیدروکسید (سود کاستیک / سود سوزآور)',
    englishName: 'Sodium Hydroxide Pellets',
    scientificName: 'Sodium Hydroxide (IUPAC: Sodium oxidanide)',
    chemicalFormula: 'NaOH',
    casNumber: '1310-73-2',
    casSource: 'PubChem CID 14798 / Merck KGaA Index 106498',
    family: 'base',
    molecularWeight: 39.997,
    density: 2.13,
    valenceOrEquivalents: 1,
    grade: 'analytical',
    purityPercentage: 99.0,
    physicalState: 'solid',
    storageConditions: {
      temperature: '15-25°C (محیط آزمایشگاه)',
      lightSensitive: false,
      hygroscopic: true,
      flammableCabinetRequired: false,
      desiccatorRequired: true,
      specialNotes: 'بسیار جاذب رطوبت و دی‌اکسید کربن هوا (تشکیل کربنات سدیم). درب ظرف باید فوراً و محکم بسته شود.'
    },
    preparationDate: '2026-01-10',
    expiryDate: '2029-01-10',
    lotNumber: 'M-NAOH-2026-AR',
    hazards: {
      ghsPictograms: ['GHS05'],
      signalWord: 'Danger',
      hazardStatements: [
        'H314: سبب سوختگی شدید پوست و آسیب جبران‌ناپذیر به چشم می‌شود.',
        'H290: ممکن است برای فلزات خورنده باشد.'
      ],
      precautionaryStatements: [
        'P280: استفاده از دستکش محافظ، لباس کار و عینک محافظ چشم/صورت الزامی است.',
        'P301+P330+P331: در صورت بلعیدن: دهان را شستشو دهید و از ایجاد استفراغ خودداری کنید.',
        'P305+P351+P338: در صورت تماس با چشم: چند دقیقه با احتیاط با آب فراوان شستشو دهید.'
      ],
      nfpaRating: { health: 3, flammability: 0, instability: 1, special: 'ALK' },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش نیتریل ضخیم یا نئوپرن', 'عینک ایمنی گاگل مقاوم به پاشش شیمیایی', 'شیلد محافظ صورت در مقادیر بالا', 'روپوش پنبه‌ای آزمایشگاهی'],
      firstAid: {
        eyeContact: 'حداقل ۱۵ تا ۲۰ دقیقه با آب روان در ایستگاه دوش/چشم‌شوی شستشو داده و بلافاصله به پزشک مراجعه شود.',
        skinContact: 'لباس‌های آلوده فوراً خارج شده و پوست حداقل ۱۵ دقیقه با آب سرد فراوان شستشو داده شود.',
        inhalation: 'فرد مصدوم به هوای آزاد منتقل شود و استراحت کند.',
        ingestion: 'هرگز مصدوم را وادار به استفراغ نکنید. در صورت هوشیاری به فرد آب بخورانید و فوراً با اورژانس تماس بگیرید.'
      },
      handlingPrecautions: [
        'انحلال پرک‌های هیدروکسید سدیم در آب به شدت گرمازا (Exothermic) است.',
        'همیشه پرک‌ها را به آرامی به آب اضافه کنید و ظرف را در حمام خنک‌کننده نگه دارید.',
        'از ظروف شیشه‌ای پیرکس بوروسیلیکات مقاوم به شوک حرارتی استفاده شود.'
      ],
      spillResponse: 'با احتیاط گرد و غبار ایجاد نشود، ماده جامد جمع‌آوری شود یا با محلول رقیق اسید استیک یا سیتریک اسید با احتیاط خنثی گردد.',
      incompatibleWith: ['اسیدهای قوی', 'فلزات سبک نظیر آلومینیوم، روی و قلع (تولید گاز هیدروژن انفجاری)', 'حلال‌های کلره'],
      exothermicWarning: 'گرمادهی شدید هنگام انحلال با آب مقطر'
    },
    sdsReference: {
      publisherOrSource: 'Merck KGaA Safety Data Sheet / PubChem Compound',
      sdsCodeOrNumber: 'Merck SDS No. 106498 (EC No. 215-185-5)',
      revisionDate: '2025-06-15',
      verified: true,
      safetyDisclaimer: 'بر اساس برگه اطلاعات ایمنی رسمی مرک و سازمان بین‌المللی ایمنی مواد شیمیایی (ICSC 0360).'
    },
    associatedExperiments: [
      {
        experimentName: 'اندازه‌گیری اسیدیته قابل تیتر در شیر و لبنیات (درجه دورنیک / درصد اسید لاکتیک)',
        standardCode: 'INSO 2852 / IDF 150',
        role: 'titrant',
        rolePersian: 'تیترانت اصلی قلیایی (محلول ۰.۱ نرمال یا N/9 دورنیک)',
        notes: 'محلول ۰.۱ نرمال باید مرتباً با پتاسیم هیدروژن فتالات (KHP) فاکتورگیری شود.'
      },
      {
        experimentName: 'تعیین عدد اسیدی و اسیدهای چرب آزاد (FFA) در روغن‌ها و چربی‌های خوراکی',
        standardCode: 'INSO 4178 / AOCS Ca 5a-40',
        role: 'titrant',
        rolePersian: 'تیترانت قلیایی در حلال اتانول:دی‌اتیل‌اتر',
        notes: 'محلول ۰.۱ نرمال سود اتانولی یا آبی'
      },
      {
        experimentName: 'سنجش پروتئین خام به روش کلدال (بخش تقطیر و آزادسازی آمونیاک)',
        standardCode: 'AOAC 920.87 / INSO 19052',
        role: 'base',
        rolePersian: 'محلول غلیظ ۴۰٪ تا ۵۰٪ سود برای قلیایی کردن هضم و رهایش NH3',
        notes: 'افزایش سود غلیظ به لوله هضم تا پیدایش رنگ قهوه‌ای تیره'
      }
    ],
    stockQuantity: { amount: 1500, unit: 'g', location: 'کابینت نگهداری بازها - قفسه B1', minAlertLevel: 300 },
    notes: 'ماده اولیه اصلی تهیه محلول‌های تیترانت ۰.۱N و ۰.۰۱N در کنترل کیفیت صنایع غذایی.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-hcl-02',
    name: 'اسید کلریدریک ۳۷٪ (هیدروکلریک اسید غلیظ)',
    englishName: 'Hydrochloric Acid 37% Fuming',
    scientificName: 'Hydrogen Chloride Aqueous Solution (IUPAC: Chlorane)',
    chemicalFormula: 'HCl',
    casNumber: '7647-01-0',
    casSource: 'PubChem CID 313 / Merck SDS 100317',
    family: 'acid',
    molecularWeight: 36.46,
    density: 1.19,
    valenceOrEquivalents: 1,
    grade: 'analytical',
    purityPercentage: 37.0,
    physicalState: 'liquid',
    storageConditions: {
      temperature: '15-25°C (محیط خنک و دارای تهویه)',
      lightSensitive: false,
      hygroscopic: false,
      flammableCabinetRequired: false,
      desiccatorRequired: false,
      specialNotes: 'در کابینت ضد اسید دارای سیستم مکش یا هود اسیدی نگهداری شود. در مجاورت مواد قلیایی و اکسیدکننده‌ها قرار نگیرد.'
    },
    preparationDate: '2026-02-01',
    expiryDate: '2029-02-01',
    lotNumber: 'M-HCL37-2026-GR',
    hazards: {
      ghsPictograms: ['GHS05', 'GHS07'],
      signalWord: 'Danger',
      hazardStatements: [
        'H314: سبب سوختگی شدید پوست و آسیب جدی به چشم می‌شود.',
        'H335: ممکن است سبب تحریک شدید دستگاه تنفسی گردد.',
        'H290: برای فلزات به شدت خورنده است.'
      ],
      precautionaryStatements: [
        'P260: از استنشاق گاز/مه/بخارات اسید خودداری فرمایید.',
        'P280: از دستکش محافظ نیتریل/بوتیل، لباس مقاوم به اسید و عینک محافظ استفاده کنید.',
        'P304+P340: در صورت استنشاق: فرد را به هوای آزاد منتقل کنید.',
        'P305+P351+P338: در صورت تماس با چشم: دقایقی با احتیاط با آب شستشو دهید.'
      ],
      nfpaRating: { health: 3, flammability: 0, instability: 1, special: 'ACID' },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش بوتیل یا نیتریل ضخیم آزمایشگاهی', 'عینک گاگل ضد پاشش اسیدی', 'ماسک تنفسی با فیلتر بخارات اسیدی (Acid Gas Cartridge)', 'کار الزامی در هود شیمیایی'],
      firstAid: {
        eyeContact: 'فورا چشم را حداقل ۲۰ دقیقه با آب سرد فراوان شستشو داده و به پزشک متخصص اورژانس ارجاع شود.',
        skinContact: 'لباس‌های آلوده را درآورده و موضع را با مقادیر زیاد آب و سپس صابون ملایم شستشو دهید.',
        inhalation: 'فرد فورا به هوای آزاد منتقل شود. در صورت تنگی نفس از اکسیژن استفاده شده و به پزشک ارجاع شود.',
        ingestion: 'از وادار کردن به استفراغ اکیداً اجتناب شود. دهان با آب شسته شود و سریعاً تحت مراقبت درمانی قرار گیرد.'
      },
      handlingPrecautions: [
        'همیشه زیر هود بخارات روشن و فعال درب بطری باز شود.',
        'اسید به آب افزوده شود، نه آب به اسید!',
        'از پیپت کردن با دهان اکیداً خودداری شود؛ فقط از پیپت‌پرکن (پوار) استاندارد استفاده گردد.'
      ],
      spillResponse: 'با بی‌کربنات سدیم (جوش شیرین) یا پودر آهک به آرامی خنثی شده و با خاک دیاتومه یا پد جاذب اسید جمع‌آوری شود.',
      incompatibleWith: ['بازها و آمین‌ها', 'فلزات (تولید گاز هیدروژن مشتعل‌شونده)', 'پرمنگنات‌ها و پرکلرات‌ها (تولید گاز سمی کلر Cl2)'],
      exothermicWarning: 'گرمادهی متوسط در رقت‌سازی با آب'
    },
    sdsReference: {
      publisherOrSource: 'Merck Millipore Safety Data Sheet / PubChem',
      sdsCodeOrNumber: 'Merck SDS No. 100317 (EC No. 231-595-7)',
      revisionDate: '2025-08-10',
      verified: true,
      safetyDisclaimer: 'بر مبنای استاندارد سیستم هماهنگ جهانی (GHS) و NIOSH Pocket Guide.'
    },
    associatedExperiments: [
      {
        experimentName: 'سنجش خاکستر نامحلول در اسید (Acid Insoluble Ash) در ادویه‌جات و آرد',
        standardCode: 'INSO 1253 / ISO 930',
        role: 'digestive_acid',
        rolePersian: 'حل کردن نمک‌های کربناته و باقی گذاشتن سیلیس و سیلیکات‌ها',
        notes: 'محلول رقیق HCl ۱۰٪ یا ۴ نرمال'
      },
      {
        experimentName: 'هضم نمونه در آزمون کلسیم، آهن و مواد معدنی',
        standardCode: 'AOAC 999.11 / INSO 1307',
        role: 'solvent',
        rolePersian: 'انحلال خاکستر و عصاره‌گیری اسیدی عناصر',
        notes: 'اسید با درجه خلوص آنالیتیکال فاقد فلزات سنگین'
      },
      {
        experimentName: 'تیتراسیون برگشتی قلیائیت کل و سنجش پروتئین در گیرنده اسید بوریک',
        standardCode: 'AOAC 928.08',
        role: 'titrant',
        rolePersian: 'محلول استاندارد ۰.۱ نرمال هیدروکلریک اسید',
        notes: 'استانداردسازی با پودر سدیم کربنات خالص'
      }
    ],
    stockQuantity: { amount: 2500, unit: 'mL', location: 'کابینت ضد اسید زیر هود - قفسه A1', minAlertLevel: 500 },
    notes: 'مایع بی‌رنگ تا زرد بسیار کم‌رنگ با بوی تند و زننده دودزا.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-h2so4-03',
    name: 'اسید سولفوریک ۹۸٪ (سولفوریک اسید غلیظ)',
    englishName: 'Sulfuric Acid 95-98% for Analysis',
    scientificName: 'Sulfuric Acid (IUPAC: Dihydrogen sulfate)',
    chemicalFormula: 'H2SO4',
    casNumber: '7664-93-9',
    casSource: 'PubChem CID 1118 / Merck SDS 100731',
    family: 'acid',
    molecularWeight: 98.08,
    density: 1.84,
    valenceOrEquivalents: 2,
    grade: 'analytical',
    purityPercentage: 98.0,
    physicalState: 'liquid',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: false,
      hygroscopic: true,
      flammableCabinetRequired: false,
      desiccatorRequired: false,
      specialNotes: 'بسیار جاذب آب. دور از مواد آلی، شکر، کاغذ و بازها در کابینت اسیدی نگهداری شود.'
    },
    preparationDate: '2026-01-15',
    expiryDate: '2029-01-15',
    lotNumber: 'M-H2SO4-2026-AR',
    hazards: {
      ghsPictograms: ['GHS05'],
      signalWord: 'Danger',
      hazardStatements: [
        'H314: سبب سوختگی‌های بسیار عمیق و شدید پوست و نابینایی فوری چشم می‌شود.',
        'H290: برای اکثر فلزات خورنده است.'
      ],
      precautionaryStatements: [
        'P280: الزام استفاده از دستکش بلند مقاوم شیمیایی، گاگل ایمنی و شیلد صورت.',
        'P301+P330+P331: در صورت بلع: دهان شسته شود؛ استفراغ نکنید.',
        'P303+P361+P353: تماس با پوست: فورا تمام لباس‌های آلوده خارج شده و با آب فراوان شسته شود.'
      ],
      nfpaRating: { health: 3, flammability: 0, instability: 2, special: 'W' },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش ضخیم نئوپرن/بوتیل', 'عینک محافظ دوجداره + شیلد صورت', 'پیش‌بند لاستیکی مقاوم به اسید', 'هود اختصاصی اسید'],
      firstAid: {
        eyeContact: 'شستشوی اضطراری با جریان مداوم آب به مدت حداقل ۲۰ تا ۳۰ دقیقه و انتقال سریع به بیمارستان.',
        skinContact: 'شستشوی فوری با جریان آب سرد فراوان (اسید سولفوریک آب‌گیر است و گرما آزاد می‌کند، حجم آب باید بسیار زیاد باشد).',
        inhalation: 'انتقال سریع به هوای آزاد و تماس فوری با خدمات درمانی.',
        ingestion: 'دهان را با آب بشویید؛ هرگز شیر یا اسید/باز برای خنثی‌سازی ندهید؛ انتقال به اورژانس.'
      },
      handlingPrecautions: [
        'قانون قطعی: هرگز به اسید سولفوریک غلیظ آب اضافه نکنید! (خطر فوران و انفجار بخار آب داغ).',
        'همیشه اسید را با دقت و قطره‌قطره در راستای دیواره ظرف به آب اضافه کنید.',
        'دمای محلول حین رقت‌سازی ممکن است از ۸۰ درجه سانتی‌گراد فراتر رود؛ از حمام یخ استفاده شود.'
      ],
      spillResponse: 'با پودر خنثی‌کننده تجاری اسید یا مخلوط سدیم بی‌کربنات/خاکستر خنثی شده و با مواد غیرآلی جمع‌آوری شود.',
      incompatibleWith: ['آب (واکنش گرمازای مهیب در مقادیر کم آب)', 'ترکیبات آلی و قندها (آب‌گیری شدید و تبدیل به کربن)', 'بازهای قوی', 'فلزات'],
      exothermicWarning: 'واکنش فوق‌العاده گرمازا با آب همراه با افزایش آنی دما'
    },
    sdsReference: {
      publisherOrSource: 'Merck KGaA Safety Data Sheet / Sigma-Aldrich',
      sdsCodeOrNumber: 'Merck SDS No. 100731 (CAS 7664-93-9)',
      revisionDate: '2025-09-01',
      verified: true,
      safetyDisclaimer: 'برگرفته از اسناد معتبر انجمن سلطنتی شیمی (RSC) و مرک.'
    },
    associatedExperiments: [
      {
        experimentName: 'سنجش چربی شیر و فرآورده‌های شیری به روش ژربر (Gerber Method)',
        standardCode: 'INSO 366 / ISO 2446',
        role: 'digestive_acid',
        rolePersian: 'اسید ژربر با دانسیته ۱.۸۲ تا ۱.۸۲۵ جهت هضم پروتئین‌های شیر و آزادسازی گلبول‌های چربی',
        notes: 'دقت بسیار بالا در پیپت کردن ۱۰ میلی‌لیتر اسید با پیپت خودکار ژربر'
      },
      {
        experimentName: 'هضم نمونه در آزمون پروتئین کلدال (Kjeldahl Digestion)',
        standardCode: 'AOAC 984.13 / INSO 19052',
        role: 'digestive_acid',
        rolePersian: 'اکسیداسیون و هضم ترکیبات آلی در حضور کاتالیزور مس/سلنیوم در دمای ۴۲۰ درجه',
        notes: 'استفاده از اسید سولفوریک ۹۸٪ فاقد نیتروژن'
      }
    ],
    stockQuantity: { amount: 3000, unit: 'mL', location: 'کابینت اختصاصی ضد اسید - طبقه زیرین B2', minAlertLevel: 1000 },
    notes: 'مایع روغنی، بی‌رنگ، بسیار سنگین و چگال با قدرت دهیدراتاسیون فوق‌العاده بالا.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-phenolphthalein-04',
    name: 'شناساگر فنل‌فتالئین (محلول معرف ۱٪)',
    englishName: 'Phenolphthalein Indicator 1%',
    scientificName: '3,3-Bis(4-hydroxyphenyl)-2-benzofuran-1(3H)-one',
    chemicalFormula: 'C20H14O4',
    casNumber: '77-09-8',
    casSource: 'PubChem CID 4764 / Merck SDS 107233',
    family: 'indicator',
    molecularWeight: 318.32,
    density: 1.277,
    grade: 'analytical',
    purityPercentage: 99.0,
    physicalState: 'powder',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: true,
      hygroscopic: false,
      flammableCabinetRequired: false,
      desiccatorRequired: false,
      specialNotes: 'در شیشه کهربایی کدر و دور از تابش مستقیم خورشید نگهداری شود. محلول ۱٪ در اتانول ۹۵٪ تهیه می‌شود.'
    },
    preparationDate: '2026-01-20',
    expiryDate: '2030-01-20',
    lotNumber: 'M-PHPH-2026-IND',
    hazards: {
      ghsPictograms: ['GHS08'],
      signalWord: 'Danger',
      hazardStatements: [
        'H350: ممکن است سبب ایجاد سرطان شود (در مقادیر بالا و مصارف خوراکی دارویی قدیمی).',
        'H341: مشکوک به ایجاد جهش ژنتیکی.'
      ],
      precautionaryStatements: [
        'P201: قبل از استفاده، دستورالعمل‌های اختصاصی را مطالعه کنید.',
        'P280: استفاده از دستکش و لباس کار آزمایشگاهی.',
        'P308+P313: در صورت قرار گرفتن در معرض، پیگیری پزشکی انجام شود.'
      ],
      nfpaRating: { health: 2, flammability: 1, instability: 0 },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش نیتریل یکبار مصرف', 'عینک ایمنی', 'روپوش کار'],
      firstAid: {
        eyeContact: 'چشم‌ها را با آب جاری به مدت ۱۰ دقیقه شستشو دهید.',
        skinContact: 'پوست را با آب و صابون شستشو دهید.',
        inhalation: 'به هوای باز منتقل شود.',
        ingestion: 'دهان را با آب شستشو داده و به پزشک مراجعه شود.'
      },
      handlingPrecautions: [
        'از استنشاق پودر خشک هنگام توزین خودداری شود.',
        'محلول الکلی به دلیل وجود اتانول قابل اشتعال است.'
      ],
      spillResponse: 'پودر با دستمال مرطوب جمع‌آوری شود؛ محلول ریخته شده با پد جاذب جمع و در سطل پسماند شیمیایی تخلیه گردد.',
      incompatibleWith: ['اکسیدکننده‌های بسیار قوی'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'Merck KGaA / ECHA REACH Registered Substance',
      sdsCodeOrNumber: 'Merck SDS No. 107233 (EC No. 201-004-7)',
      revisionDate: '2025-05-20',
      verified: true,
      safetyDisclaimer: 'بر اساس آخرین رده‌بندی ECHA و IARC.'
    },
    associatedExperiments: [
      {
        experimentName: 'اندازه‌گیری اسیدیته کل در آبمیوه‌ها، کنسانتره و نوشیدنی‌ها',
        standardCode: 'INSO 2685 / IFU Method No. 3',
        role: 'indicator',
        rolePersian: 'شناساگر محدوده pH 8.2 (بی‌رنگ) تا 10.0 (صورتی ارغوانی)',
        notes: 'نقطه پایانی: پیدایش رنگ صورتی ملایم پایدار به مدت ۳۰ ثانیه'
      },
      {
        experimentName: 'تعیین اسیدیته شیر به روش دورنیک',
        standardCode: 'INSO 2852',
        role: 'indicator',
        rolePersian: 'شناساگر اسیدیته با مصرف ۲ تا ۳ قطره به ازای ۱۰ میلی‌لیتر شیر',
        notes: 'در شیر، نقطه پایانی صورتی بسیار محو در زمینه سفید شیر است.'
      }
    ],
    stockQuantity: { amount: 250, unit: 'g', location: 'کابینت شناساگرها - قفسه C1', minAlertLevel: 50 },
    notes: 'پودر سفید تا کرم بسیار روشن؛ حلالیت در اتانول عالی و در آب بسیار کم.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-cuso4-05',
    name: 'سولفات مس ۵ آبه (کات کبود خالص)',
    englishName: 'Copper(II) Sulfate Pentahydrate AR',
    scientificName: 'Copper(II) sulfate pentahydrate (IUPAC: Copper(2+) sulfate pentahydrate)',
    chemicalFormula: 'CuSO4·5H2O',
    casNumber: '7758-99-8',
    casSource: 'PubChem CID 24463 / Merck SDS 102790',
    family: 'salt',
    molecularWeight: 249.68,
    density: 2.284,
    grade: 'analytical',
    purityPercentage: 99.5,
    physicalState: 'crystals',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: false,
      hygroscopic: false,
      flammableCabinetRequired: false,
      desiccatorRequired: false,
      specialNotes: 'در ظروف دربسته به دور از رطوبت و گرما نگهداری شود.'
    },
    preparationDate: '2026-01-10',
    expiryDate: '2031-01-10',
    lotNumber: 'M-CUSO4-2026-AR',
    hazards: {
      ghsPictograms: ['GHS07', 'GHS09', 'GHS05'],
      signalWord: 'Danger',
      hazardStatements: [
        'H302: در صورت بلعیدن زیان‌آور است.',
        'H318: سبب آسیب جدی و جبران‌ناپذیر به چشم می‌شود.',
        'H410: برای آبزیان فوق‌العاده سمی با اثرات طولانی‌مدت.'
      ],
      precautionaryStatements: [
        'P273: از رهاسازی در محیط زیست اکیداً خودداری شود.',
        'P280: استفاده از دستکش و عینک ایمنی.',
        'P305+P351+P338: در صورت تماس با چشم با احتیاط با آب شسته شود.'
      ],
      nfpaRating: { health: 2, flammability: 0, instability: 0 },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش نیتریل', 'عینک محافظ چشم', 'روپوش کار'],
      firstAid: {
        eyeContact: 'شستشوی فوری چشم‌ها با آب فراوان به مدت ۱۵ دقیقه و ویزیت چشم‌پزشک.',
        skinContact: 'با آب و صابون فراوان شسته شود.',
        inhalation: 'هوای تازه و استراحت.',
        ingestion: 'دهان شسته شود؛ فورا به مرکز درمان مسمومیت ارجاع شود.'
      },
      handlingPrecautions: ['از ریختن پسماندهای حاوی مس در فاضلاب شهری اجتناب کنید (جمع‌آوری در گالن پسماند فلزات سنگین).'],
      spillResponse: 'کریستال‌ها به صورت خشک جاروب شده و در ظرف پسماند خطرناک فلزات سنگین بسته‌بندی گردد.',
      incompatibleWith: ['استیلن', 'آهن و منیزیم فلزی', 'عوامل احیاکننده قوی'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'Merck Millipore SDS / PubChem',
      sdsCodeOrNumber: 'Merck SDS No. 102790 (EC No. 231-847-6)',
      revisionDate: '2025-07-12',
      verified: true,
      safetyDisclaimer: 'منطبق بر ضوابط مدیریت پسماندهای حاوی فلزات سنگین EPA و سازمان حفاظت محیط زیست.'
    },
    associatedExperiments: [
      {
        experimentName: 'معرف فهلینگ A برای سنجش قندهای احیاکننده (Fehling A Reagent)',
        standardCode: 'AOAC 923.09 / INSO 2552',
        role: 'catalyst',
        rolePersian: 'جزء اصلی معرف فهلینگ A (محلول ۶۹.۲۸ گرم سولفات مس در ۱ لیتر آب مقطر)',
        notes: 'در واکنش با قندهای احیاکننده در حضور فهلینگ B رسوب قرمز آجری Cu2O تشکیل می‌دهد.'
      },
      {
        experimentName: 'قرص کاتالیزور آزمون پروتئین کلدال (Kjeldahl Catalyst Tablet)',
        standardCode: 'AOAC 984.13',
        role: 'catalyst',
        rolePersian: 'کاتالیزور تسریع هضم پروتئین همراه با سولفات پتاسیم',
        notes: 'افزایش دمای جوش اسید سولفوریک و تسریع اکسیداسیون کربن'
      }
    ],
    stockQuantity: { amount: 1000, unit: 'g', location: 'کابینت نمک‌های معدنی - قفسه D2', minAlertLevel: 200 },
    notes: 'کریستال‌های آبی لاجوردی درخشان بسیار مشخص و پایدار.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-rochelle-salt-06',
    name: 'تارترات مضاعف سدیم و پتاسیم (نمک روشل)',
    englishName: 'Potassium Sodium Tartrate Tetrahydrate (Rochelle Salt)',
    scientificName: 'Potassium sodium (2R,3R)-2,3-dihydroxybutanedioate tetrahydrate',
    chemicalFormula: 'KNaC4H4O6·4H2O',
    casNumber: '6381-59-5',
    casSource: 'PubChem CID 9855836 / Merck SDS 108087',
    family: 'salt',
    molecularWeight: 282.22,
    density: 1.79,
    grade: 'analytical',
    purityPercentage: 99.0,
    physicalState: 'crystals',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: false,
      hygroscopic: false,
      flammableCabinetRequired: false,
      desiccatorRequired: false,
      specialNotes: 'در دمای متعارف آزمایشگاه در ظروف بسته نگهداری شود.'
    },
    preparationDate: '2026-01-10',
    expiryDate: '2031-01-10',
    lotNumber: 'M-ROCH-2026-GR',
    hazards: {
      ghsPictograms: [],
      signalWord: 'None',
      hazardStatements: ['ماده بر اساس معیارهای GHS به عنوان ماده خطرناک طبقه‌بندی نمی‌شود.'],
      precautionaryStatements: ['P262: از تماس با چشم و پوست پرهیز شود.'],
      nfpaRating: { health: 0, flammability: 1, instability: 0 },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش آزمایشگاهی', 'عینک ایمنی عمومی', 'روپوش کار'],
      firstAid: {
        eyeContact: 'با آب شستشو داده شود.',
        skinContact: 'با آب و صابون شسته شود.',
        inhalation: 'استنشاق هوای آزاد.',
        ingestion: 'نوشیدن آب در صورت بروز ناراحتی.'
      },
      handlingPrecautions: ['رعایت بهداشت عمومی کار در آزمایشگاه.'],
      spillResponse: 'با جاروب دستی جمع‌آوری و با آب تمیز شود.',
      incompatibleWith: ['اکسیدکننده‌های قوی'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'Merck KGaA SDS / PubChem',
      sdsCodeOrNumber: 'Merck SDS No. 108087 (EC No. 206-156-8)',
      revisionDate: '2025-04-18',
      verified: true,
      safetyDisclaimer: 'نمک بدون سمیت حاد، بی‌خطر در شرایط معمول آزمایشگاهی.'
    },
    associatedExperiments: [
      {
        experimentName: 'معرف فهلینگ B برای سنجش قندهای کل و احیاکننده به روش لین-اینون',
        standardCode: 'AOAC 923.09 / INSO 2552',
        role: 'buffer',
        rolePersian: 'کمپلکس‌کننده یون مس (II) در محیط به شدت قلیایی سود جهت ممانعت از رسوب Cu(OH)2',
        notes: 'مخلوط ۳۴۶ گرم نمک روشل + ۱۰۰ گرم NaOH در ۱ لیتر آب مقطر'
      }
    ],
    stockQuantity: { amount: 1000, unit: 'g', location: 'کابینت نمک‌های آلی - قفسه D1', minAlertLevel: 200 },
    notes: 'کریستال‌های شفاف بی‌رنگ، پایدار و محلول در آب.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-iodine-07',
    name: 'ید کریستال خالص (Iodine Resublimed)',
    englishName: 'Iodine Resublimed for Analysis',
    scientificName: 'Molecular Iodine (IUPAC: Diiodine)',
    chemicalFormula: 'I2',
    casNumber: '7553-56-2',
    casSource: 'PubChem CID 807 / Merck SDS 104761',
    family: 'indicator',
    molecularWeight: 253.81,
    density: 4.93,
    valenceOrEquivalents: 2,
    grade: 'analytical',
    purityPercentage: 99.8,
    physicalState: 'crystals',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: true,
      hygroscopic: false,
      flammableCabinetRequired: false,
      desiccatorRequired: false,
      specialNotes: 'تصعید شونده (Subliming). بخارات ید خورنده و فرار هستند. در ظروف شیشه‌ای قهوه‌ای تیره با درب محکم سنباده‌ای یا تفلونی نگهداری شود.'
    },
    preparationDate: '2026-02-05',
    expiryDate: '2030-02-05',
    lotNumber: 'M-IOD-2026-AR',
    hazards: {
      ghsPictograms: ['GHS07', 'GHS08', 'GHS09'],
      signalWord: 'Danger',
      hazardStatements: [
        'H312+H332: در تماس با پوست یا استنشاق زیان‌آور است.',
        'H315: سبب تحریک پوستی می‌شود.',
        'H319: سبب تحریک شدید چشمی می‌شود.',
        'H372: در اثر تماس مکرر یا طولانی به غده تیروئید آسیب می‌رساند.',
        'H400: برای محیط زیست و جانداران آبزی فوق‌العاده سمی است.'
      ],
      precautionaryStatements: [
        'P273: از رهاسازی در محیط زیست خودداری شود.',
        'P280: دستکش نیتریل و عینک محافظ استفاده شود.',
        'P302+P352: در صورت تماس با پوست با آب و صابون فراوان شسته شود.'
      ],
      nfpaRating: { health: 3, flammability: 0, instability: 0, special: 'OX' },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش نیتریل', 'عینک محافظ', 'ماسک تنفسی با فیلتر هالوژن‌ها در صورت کار خارج از هود'],
      firstAid: {
        eyeContact: 'شستشوی چشم با آب روان به مدت ۱۵ دقیقه و مراجعه به پزشک.',
        skinContact: 'شستشو با محلول رقیق سدیم تیوسولفات جهت بی‌رنگ کردن لکه ید و سپس آب و صابون.',
        inhalation: 'انتقال به هوای آزاد.',
        ingestion: 'دادن محلول نشاسته یا تیوسولفات سدیم خوراکی و مراجعه به اورژانس.'
      },
      handlingPrecautions: [
        'برای حل کردن ید در آب، الزامی است از پتاسیم یدید (KI) استفاده شود تا کمپلکس محلول تری‌یدید I3(-) تشکیل گردد.',
        'روی ترازوهای فلزی وزن نشود زیرا بخارات آن سبب زنگ‌زدگی فوری فلزات می‌شود.'
      ],
      spillResponse: 'محلول تیوسولفات سدیم روی لکه‌های ریخته شده اسپری شود تا ید احیا و بی‌رنگ گردد، سپس با دستمال پاک شود.',
      incompatibleWith: ['آمونیاک (تولید تری‌یدید نیتروژن NI3 به شدت انفجاری تماسی!)', 'فلزات پودری', 'مواد احیاکننده قوی'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'Merck KGaA Safety Data Sheet / PubChem',
      sdsCodeOrNumber: 'Merck SDS No. 104761 (EC No. 231-442-4)',
      revisionDate: '2025-08-15',
      verified: true,
      safetyDisclaimer: 'مطابق الزامات ایمنی ترکیبات هالوژنه ICSC 0167.'
    },
    associatedExperiments: [
      {
        experimentName: 'شناسایی و آزمون کیفی نشاسته در فرآورده‌های گوشتی، لبنی و سس‌ها (Lugol / Iodine Test)',
        standardCode: 'INSO 2174 / AOAC 925.56',
        role: 'indicator',
        rolePersian: 'تشکیل کمپلکس آبی متمایل به بنفش تیره یا سیاه در حضور نشاسته',
        notes: 'محلول لوگول (Lugol Solution: حاوی ۱٪ ید و ۲٪ پتاسیم یدید)'
      },
      {
        experimentName: 'تعیین عدد یدی روغن‌ها و چربی‌های خوراکی (Iodine Value به روش هانوس/ویجز)',
        standardCode: 'INSO 4888 / AOCS Cd 1d-92',
        role: 'titrant',
        rolePersian: 'معرف هالوژناسیون پیوندهای دوگانه اسیدهای چرب غیراشباع',
        notes: 'تیتراسیون برگشتی با سدیم تیوسولفات ۰.۱ نرمال'
      }
    ],
    stockQuantity: { amount: 500, unit: 'g', location: 'کابینت مواد اکسیدکننده/هالوژن - قفسه C2', minAlertLevel: 100 },
    notes: 'پولک‌های تیره خاکستری متمایل به بنفش براق با جلای فلزی و بوی نافذ کلر/ید.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-thiosulfate-08',
    name: 'سدیم تیوسولفات ۵ آبه',
    englishName: 'Sodium Thiosulfate Pentahydrate for Analysis',
    scientificName: 'Sodium thiosulfate pentahydrate',
    chemicalFormula: 'Na2S2O3·5H2O',
    casNumber: '10102-17-7',
    casSource: 'PubChem CID 24477 / Merck SDS 106516',
    family: 'salt',
    molecularWeight: 248.18,
    density: 1.73,
    valenceOrEquivalents: 1,
    grade: 'analytical',
    purityPercentage: 99.5,
    physicalState: 'crystals',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: true,
      hygroscopic: false,
      flammableCabinetRequired: false,
      desiccatorRequired: false,
      specialNotes: 'محلول آن در اثر نور و باکتری‌های تجزیه‌کننده گوگرد ناپایدار می‌شود. افزودن حدود ۰.۱ گرم کربنات سدیم (Na2CO3) در هر لیتر به عنوان پایدارکننده توصیه می‌شود.'
    },
    preparationDate: '2026-01-25',
    expiryDate: '2030-01-25',
    lotNumber: 'M-NA2S2O3-2026-AR',
    hazards: {
      ghsPictograms: [],
      signalWord: 'None',
      hazardStatements: ['ماده غیرخطرناک طبق طبقه‌بندی GHS.'],
      precautionaryStatements: ['P262: از تماس با چشم‌ها خودداری شود.'],
      nfpaRating: { health: 1, flammability: 0, instability: 0 },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش لاتکس/نیتریل', 'عینک ایمنی', 'روپوش کار'],
      firstAid: {
        eyeContact: 'شستشو با آب روان.',
        skinContact: 'شستشو با آب و صابون.',
        inhalation: 'هوای تازه.',
        ingestion: 'نوشیدن آب.'
      },
      handlingPrecautions: ['محلول آبی تازه تهیه شود یا فاکتور آن هفتگی با پتاسیم دی‌کرومات یا پتاسیم یدات بررسی گردد.'],
      spillResponse: 'جاروب خشک و شستشوی محل با آب.',
      incompatibleWith: ['اسیدهای قوی (تجزیه و آزادسازی رسوب کلوئیدی زرد گوگرد و گاز محرک SO2)', 'اکسیدکننده‌های قوی'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'Merck KGaA Safety Data Sheet / PubChem',
      sdsCodeOrNumber: 'Merck SDS No. 106516 (EC No. 231-867-5)',
      revisionDate: '2025-06-01',
      verified: true,
      safetyDisclaimer: 'نمک پایدار و بی‌خطر با کاربرد وسیع در یدومتری صنایع غذایی.'
    },
    associatedExperiments: [
      {
        experimentName: 'تعیین عدد پراکسید (Peroxide Value - PV) در روغن‌ها، چربی‌ها و چیپس/آجیل',
        standardCode: 'INSO 4179 / AOCS Cd 8b-90 / ISO 3960',
        role: 'titrant',
        rolePersian: 'تیترانت اصلی یدومتری (محلول ۰.۰۱ یا ۰.۰۰۲ نرمال سدیم تیوسولفات)',
        notes: 'تیتراسیون ید آزاد شده از هیدروپراکسیدها در مجاورت شناساگر چسب نشاسته'
      },
      {
        experimentName: 'اندازه‌گیری گاز دی‌اکسید گوگرد (SO2) باقیمانده در میوه‌های خشک و ترشیجات',
        standardCode: 'INSO 2634 / Monier-Williams Method',
        role: 'titrant',
        rolePersian: 'تیترانت اندازه‌گیری ید در تیتراسیون یدومتری معکوس',
        notes: 'محلول ۰.۰۱ نرمال'
      }
    ],
    stockQuantity: { amount: 1500, unit: 'g', location: 'کابینت نمک‌ها - قفسه B3', minAlertLevel: 250 },
    notes: 'کریستال‌های منشوری شفاف و بی‌رنگ، محلول در آب، فاقد بوی خاص.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-kmno4-09',
    name: 'پتاسیم پرمنگنات (پرمنگنات پتاسیم خالص)',
    englishName: 'Potassium Permanganate for Analysis',
    scientificName: 'Potassium manganate(VII)',
    chemicalFormula: 'KMnO4',
    casNumber: '7722-64-7',
    casSource: 'PubChem CID 516875 / Merck SDS 105082',
    family: 'salt',
    molecularWeight: 158.03,
    density: 2.70,
    valenceOrEquivalents: 5,
    grade: 'analytical',
    purityPercentage: 99.0,
    physicalState: 'crystals',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: true,
      hygroscopic: false,
      flammableCabinetRequired: false,
      desiccatorRequired: false,
      specialNotes: 'اکسیدکننده قوی. حتماً دور از مواد آلی، کاغذ، الکل‌ها، حلال‌ها و گلیسرین در کابینت مواد اکسیدکننده نگهداری شود.'
    },
    preparationDate: '2026-01-10',
    expiryDate: '2031-01-10',
    lotNumber: 'M-KMNO4-2026-AR',
    hazards: {
      ghsPictograms: ['GHS03', 'GHS07', 'GHS08', 'GHS09'],
      signalWord: 'Danger',
      hazardStatements: [
        'H272: اکسیدکننده؛ ممکن است آتش‌سوزی را تشدید کند.',
        'H302: در صورت بلعیدن زیان‌آور است.',
        'H314: سبب سوختگی پوستی و آسیب شدید چشمی می‌شود.',
        'H361d: مشکوک به آسیب به جنین.',
        'H410: برای آبزیان فوق‌العاده سمی با اثرات پایدار.'
      ],
      precautionaryStatements: [
        'P210: دور از گرما، سطوح داغ، جرقه‌ها و مواد احتراق‌پذیر نگهداری شود.',
        'P273: از رهاسازی در محیط زیست خودداری گردد.',
        'P280: استفاده از دستکش و عینک محافظ.'
      ],
      nfpaRating: { health: 2, flammability: 0, instability: 0, special: 'OX' },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش نیتریل', 'عینک ایمنی گاگل', 'روپوش کار'],
      firstAid: {
        eyeContact: 'شستشوی چشم با مقادیر فراوان آب به مدت حداقل ۱۵ دقیقه.',
        skinContact: 'شستشو با آب فراوان (لکه‌های قهوه‌ای رنگ دی‌اکسید منگنز با محلول رقیق اسید اگزالیک یا بی‌سولفیت سدیم پاک می‌شوند).',
        inhalation: 'هوای تازه و استراحت.',
        ingestion: 'شستشوی دهان و مراجعه فوری به پزشک.'
      },
      handlingPrecautions: [
        'تماس پرمنگنات جامد با گلیسرین یا اسید سولفوریک غلیظ سبب اشتعال خودبه‌خودی و انفجار می‌گردد.',
        'محلول استاندارد پرمنگنات باید در بطری شیشه‌ای قهوه‌ای تیره (کهربایی) و دور از نور نگهداری شود.'
      ],
      spillResponse: 'با محلول رقیق بی‌سولفیت سدیم یا پراکسید هیدروژن اسیدی خنثی شده و با پد غیرآلی جمع‌آوری شود.',
      incompatibleWith: ['گلیسرین', 'الکل‌ها', 'اسید سولفوریک غلیظ (تشکیل انیدرید منگنز هفت Mn2O7 انفجاری)', 'مواد کاهنده قوی'],
      exothermicWarning: 'واکنش گرمازا و خطرناک با مواد آلی غلیظ'
    },
    sdsReference: {
      publisherOrSource: 'Merck KGaA Safety Data Sheet / PubChem',
      sdsCodeOrNumber: 'Merck SDS No. 105082 (EC No. 231-760-3)',
      revisionDate: '2025-07-25',
      verified: true,
      safetyDisclaimer: 'بر اساس SDS رسمی مرک و آژانس مواد شیمیایی اروپا (ECHA).'
    },
    associatedExperiments: [
      {
        experimentName: 'سنجش ماده آلی و اکسیژن‌خواهی شیمیایی (COD / Permanganate Index) در آب کارخانجات صنایع غذایی',
        standardCode: 'INSO 1053 / ISO 8467',
        role: 'titrant',
        rolePersian: 'اکسیدکننده استاندارد ۰.۰۱ نرمال جهت اکسیداسیون مواد آلی در دمای ۱۰۰ درجه',
        notes: 'محلول خود شناساگر است (نقطه پایانی با ایجاد رنگ صورتی بسیار ملایم تعیین می‌شود)'
      },
      {
        experimentName: 'اندازه‌گیری مقدار کلسیم در شیر و مواد غذایی به روش تیتراسیون پرمنگناتومیری اگزالات',
        standardCode: 'AOAC 945.43',
        role: 'titrant',
        rolePersian: 'تیتراسیون اگزالات کلسیم حل شده در اسید سولفوریک داغ',
        notes: 'محلول ۰.۰۵ یا ۰.۰۲ نرمال'
      }
    ],
    stockQuantity: { amount: 500, unit: 'g', location: 'کابینت اختصاصی مواد اکسیدکننده - قفسه E1', minAlertLevel: 100 },
    notes: 'کریستال‌های سوزنی‌شکل ارغوانی تیره و بنفش متالیک با قدرت اکسیداسیون بسیار بالا.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-agno3-10',
    name: 'نیترات نقره خالص (Silver Nitrate AR)',
    englishName: 'Silver Nitrate Crystal for Analysis',
    scientificName: 'Silver(I) nitrate',
    chemicalFormula: 'AgNO3',
    casNumber: '7761-88-8',
    casSource: 'PubChem CID 24470 / Merck SDS 101512',
    family: 'salt',
    molecularWeight: 169.87,
    density: 4.35,
    valenceOrEquivalents: 1,
    grade: 'analytical',
    purityPercentage: 99.8,
    physicalState: 'crystals',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: true,
      hygroscopic: false,
      flammableCabinetRequired: false,
      desiccatorRequired: false,
      specialNotes: 'فوق‌العاده حساس به نور (تبدیل یون نقره به نقره فلزی سیاه رنگ). در بطری‌های شیشه‌ای کهربایی تیره مات و قفل‌دار نگهداری شود.'
    },
    preparationDate: '2026-01-10',
    expiryDate: '2030-01-10',
    lotNumber: 'M-AGNO3-2026-AR',
    hazards: {
      ghsPictograms: ['GHS03', 'GHS05', 'GHS09'],
      signalWord: 'Danger',
      hazardStatements: [
        'H272: ممکن است سبب تشدید آتش‌سوزی شود (اکسیدکننده).',
        'H314: سبب سوختگی شدید پوست و لکه‌های سیاه ماندگار روی بافت می‌شود.',
        'H410: برای آبزیان و محیط زیست به شدت کشنده و سمی است.'
      ],
      precautionaryStatements: [
        'P273: از رهاسازی در محیط زیست خودداری شود.',
        'P280: استفاده از دستکش، روپوش و عینک ایمنی.',
        'P305+P351+P338: در صورت تماس با چشم با احتیاط با آب شسته شود.'
      ],
      nfpaRating: { health: 3, flammability: 0, instability: 0, special: 'OX' },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش نیتریل', 'عینک محافظ چشم', 'روپوش کار'],
      firstAid: {
        eyeContact: 'شستشوی چشم با آب فراوان به مدت حداقل ۱۵ دقیقه و مراجعه به چشم‌پزشک.',
        skinContact: 'شستشو با آب فراوان و محلول رقیق نمک طعام (NaCl) برای تشکیل رسوب غیرسمی کلرید نقره.',
        inhalation: 'هوای تازه و استراحت.',
        ingestion: 'نوشیدن آب نمک ملایم جهت رسوب دادن نقره به شکل AgCl و مراجعه فوری به پزشک.'
      },
      handlingPrecautions: [
        'تماس محلول با پوست در اثر نور خورشید لکه‌های قهوه‌ای/سیاه نقره فلزی بر جای می‌گذارد که روزها پاک نمی‌شود.',
        'پسماندهای نقره گران‌بها و سمی هستند؛ باید در ظرف پسماند نقره برای بازیافت جمع‌آوری گردند.'
      ],
      spillResponse: 'محل با محلول نمک طعام (NaCl) شسته شود تا نقره به صورت کلرید نقره رسوب کند و سپس جمع‌آوری شود.',
      incompatibleWith: ['اتانول در محیط اسیدی (تشکیل فومینات نقره به شدت انفجاری!)', 'آمونیاک غلیظ (تشکیل نقره انفجاری در اثر تبخیر)', 'مواد کاهنده'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'Merck Millipore SDS / PubChem',
      sdsCodeOrNumber: 'Merck SDS No. 101512 (EC No. 231-853-9)',
      revisionDate: '2025-08-01',
      verified: true,
      safetyDisclaimer: 'بر مبنای استانداردهای بین‌المللی متدولوژی آرژانتومتری و SDS مرک.'
    },
    associatedExperiments: [
      {
        experimentName: 'تعیین مقدار نمک طعام (کلرید سدیم NaCl) در پنیر، سس، چیپس، کنسرو و فرآورده‌های گوشتی (روش موهر)',
        standardCode: 'INSO 1808 / AOAC 960.29 / ISO 1841',
        role: 'titrant',
        rolePersian: 'تیترانت رسوبی ۰.۱ نرمال نیترات نقره در حضور شناساگر پتاسیم کرومات ۵٪',
        notes: 'تشکیل رسوب سفید کلرید نقره و در نقطه پایانی ظهور رسوب قرمز آجری کرومات نقره'
      },
      {
        experimentName: 'سنجش کلرید به روش ولهارد (Volhard Back Titration) در نمونه‌های اسیدی',
        standardCode: 'AOAC 935.43',
        role: 'titrant',
        rolePersian: 'تیترانت آرژانتومتری و رسوب‌دهی کلرید با نیترات نقره اضافی',
        notes: 'تیتراسیون برگشتی نقره اضافی با محلول پتاسیم یا آمونیوم تیوسیانات در حضور زاج آهن'
      }
    ],
    stockQuantity: { amount: 250, unit: 'g', location: 'کابینت قفل‌دار مواد گران‌قیمت/حساس به نور - قفسه F1', minAlertLevel: 50 },
    notes: 'کریستال‌های بی‌رنگ، شفاف و براق، سنگین و بدون بو.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-k2cro4-11',
    name: 'شناساگر پتاسیم کرومات ۵٪ (محلول زرد رنگ موهر)',
    englishName: 'Potassium Chromate Indicator AR',
    scientificName: 'Potassium chromate(VI)',
    chemicalFormula: 'K2CrO4',
    casNumber: '7789-00-6',
    casSource: 'PubChem CID 24597 / Merck SDS 104952',
    family: 'indicator',
    molecularWeight: 194.19,
    density: 2.73,
    grade: 'analytical',
    purityPercentage: 99.5,
    physicalState: 'crystals',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: false,
      hygroscopic: false,
      flammableCabinetRequired: false,
      desiccatorRequired: false,
      specialNotes: 'ماده حاوی کروم شش ظرفیتی (Cr VI). در ظروف ایمن و برچسب‌دار با احتیاط کامل نگهداری شود.'
    },
    preparationDate: '2026-01-10',
    expiryDate: '2031-01-10',
    lotNumber: 'M-K2CRO4-2026-IND',
    hazards: {
      ghsPictograms: ['GHS07', 'GHS08', 'GHS09'],
      signalWord: 'Danger',
      hazardStatements: [
        'H350i: ممکن است در اثر استنشاق سبب سرطان شود.',
        'H340: ممکن است سبب نقص‌های ژنتیکی گردد.',
        'H315: سبب تحریک پوستی و حساسیت آلرژیک می‌شود.',
        'H410: برای آبزیان بسیار سمی با اثرات طولانی‌مدت.'
      ],
      precautionaryStatements: [
        'P201: دستورالعمل‌های کار با مواد سرطان‌زا مطالعه شود.',
        'P273: از رهاسازی در محیط زیست اجتناب گردد.',
        'P280: الزام دستکش محافظ و عینک ایمنی.'
      ],
      nfpaRating: { health: 3, flammability: 0, instability: 0 },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش نیتریل ضخیم', 'عینک محافظ چشم', 'روپوش کار', 'ماسک ضد گردوغبار هپا حین توزین'],
      firstAid: {
        eyeContact: 'شستشوی چشم با آب فراوان به مدت حداقل ۱۵ دقیقه.',
        skinContact: 'شستشوی کامل پوست با آب و صابون.',
        inhalation: 'هوای تازه و استراحت.',
        ingestion: 'مراجعه فوری به مرکز فوریت‌های پزشکی.'
      },
      handlingPrecautions: ['از ایجاد گرد و غبار پودر خشک پرهیز شود؛ ترجیحاً محلول ۵٪ آماده با رعایت ایمنی استفاده گردد.'],
      spillResponse: 'پسماندهای حاوی کروم ۶ ظرفیتی باید ابتدا با بی‌سولفیت به کروم ۳ کاهیده و سپس رسوب داده شوند.',
      incompatibleWith: ['مواد کاهنده قوی', 'حلال‌های آلی قابل اشتعال'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'Merck KGaA Safety Data Sheet / ECHA REACH SVHC',
      sdsCodeOrNumber: 'Merck SDS No. 104952 (EC No. 232-140-5)',
      revisionDate: '2025-05-15',
      verified: true,
      safetyDisclaimer: 'ترکیب حاوی کروم ۶ ظرفیتی؛ ملزم به رعایت پروتکل‌های کار با مواد با هشدار ویژه ECHA.'
    },
    associatedExperiments: [
      {
        experimentName: 'شناساگر تیتراسیون نمک (کلرید سدیم) به روش موهر در مواد غذایی',
        standardCode: 'INSO 1808 / AOAC 960.29',
        role: 'indicator',
        rolePersian: 'شناساگر نقطه پایانی با ایجاد رسوب قرمز آجری کرومات نقره (Ag2CrO4)',
        notes: 'مصرف ۱ میلی‌لیتر از محلول ۵٪ به ازای هر تیتراسیون در pH خنثی یا کمی قلیایی (6.5 تا 9.0)'
      }
    ],
    stockQuantity: { amount: 250, unit: 'g', location: 'کابینت اختصاصی فلزات سنگین/کروم - قفسه F2', minAlertLevel: 50 },
    notes: 'پودر کریستالی به رنگ زرد لیمویی روشن و بسیار پایدار.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-ethanol-12',
    name: 'اتانول ۹۶٪ (اتیل الکل گرید خلوص بالا)',
    englishName: 'Ethanol 96% Vol. for Analysis (Absolute/Rectified)',
    scientificName: 'Ethanol (IUPAC: Ethanol)',
    chemicalFormula: 'C2H5OH',
    casNumber: '64-17-5',
    casSource: 'PubChem CID 702 / Merck SDS 100971',
    family: 'organic_solvent',
    molecularWeight: 46.07,
    density: 0.806,
    grade: 'analytical',
    purityPercentage: 96.0,
    physicalState: 'liquid',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: false,
      hygroscopic: true,
      flammableCabinetRequired: true,
      desiccatorRequired: false,
      specialNotes: 'مایع به شدت قابل اشتعال. الزام نگهداری در کابینت ضد حریق و ضد انفجار (Flammables Cabinet) با برچسب مشخص.'
    },
    preparationDate: '2026-02-01',
    expiryDate: '2029-02-01',
    lotNumber: 'M-ETOH-2026-AR',
    hazards: {
      ghsPictograms: ['GHS02', 'GHS07'],
      signalWord: 'Danger',
      hazardStatements: [
        'H225: مایع و بخارات بسیار قابل اشتعال.',
        'H319: سبب تحریک شدید چشمی می‌شود.'
      ],
      precautionaryStatements: [
        'P210: دور از گرما، سطوح داغ، جرقه‌ها و شعله باز نگهداری شود. استعمال دخانیات ممنوع.',
        'P233: درب ظرف محکم بسته نگه داشته شود.',
        'P305+P351+P338: در صورت تماس با چشم با احتیاط با آب شستشو داده شود.'
      ],
      nfpaRating: { health: 1, flammability: 3, instability: 0 },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش نیتریل', 'عینک محافظ چشم', 'روپوش کار'],
      firstAid: {
        eyeContact: 'شستشو با آب به مدت ۱۰ دقیقه.',
        skinContact: 'شستشو با آب و صابون.',
        inhalation: 'هوای تازه.',
        ingestion: 'دهان شسته شود.'
      },
      handlingPrecautions: ['از کار در مجاورت شعله چراغ بونزن یا هیترهای برقی غیرضدجرقه اکیداً اجتناب شود.'],
      spillResponse: 'منابع احتراق خاموش شوند؛ با پدهای جاذب حلال جمع‌آوری گردد.',
      incompatibleWith: ['اکسیدکننده‌های قوی', 'فلزات قلیایی', 'پراکسیدها'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'Merck Millipore SDS / PubChem',
      sdsCodeOrNumber: 'Merck SDS No. 100971 (EC No. 200-578-6)',
      revisionDate: '2025-06-20',
      verified: true,
      safetyDisclaimer: 'بر اساس آخرین استانداردهای NFPA 30 و OSHA Flammable Liquids.'
    },
    associatedExperiments: [
      {
        experimentName: 'تهیه شناساگرهای آزمایشگاهی (فنل‌فتالئین، متیل رد، برموکروزول سبز)',
        standardCode: 'INSO Standards Suite',
        role: 'solvent',
        rolePersian: 'حلال اصلی تهیه محلول‌های شناساگر pH',
        notes: 'محلول ۱٪ یا ۰.۱٪ در اتانول ۹۵٪ خنثی شده'
      },
      {
        experimentName: 'سنجش اسیدهای چرب آزاد (FFA) و عدد اسیدی روغن‌ها',
        standardCode: 'INSO 4178 / AOCS Ca 5a-40',
        role: 'solvent',
        rolePersian: 'حلال استخراج اسیدهای چرب آزاد (اتانول خنثی شده با سود در حضور فنل‌فتالئین)',
        notes: 'خنثی‌سازی دقیق اتانول قبل از تیتراسیون نمونه الزامی است.'
      },
      {
        experimentName: 'آزمون الکل و پایداری حرارتی شیر خام (Alcohol Test)',
        standardCode: 'INSO 2852',
        role: 'solvent',
        rolePersian: 'اتانول ۶۸٪ تا ۷۲٪ برای آزمون انعقاد و کیفیت بهداشتی شیر در سکوی دریافت',
        notes: 'مخلوط حجم‌های مساوی شیر و اتانول ۶۸٪'
      }
    ],
    stockQuantity: { amount: 5000, unit: 'mL', location: 'کابینت ضد حریق و انفجار - طبقه بالا S1', minAlertLevel: 1000 },
    notes: 'مایع زلال و شفاف با بوی مطبوع مشخص، اختلاط‌پذیر با آب در تمام نسبت‌ها.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-petroleum-ether-13',
    name: 'پترولیوم اتر ۴۰-۶۰ درجه سانتی‌گراد',
    englishName: 'Petroleum Benzin boiling range 40-60°C for Analysis',
    scientificName: 'Petroleum Ether (Hydrocarbons, C5-C6 rich)',
    chemicalFormula: 'C5H12 - C6H14 mixture',
    casNumber: '64742-49-0',
    casSource: 'Merck SDS 101775 / PubChem',
    family: 'organic_solvent',
    molecularWeight: 86.18,
    density: 0.653,
    grade: 'analytical',
    purityPercentage: 99.0,
    physicalState: 'liquid',
    storageConditions: {
      temperature: '15-20°C (محیط خنک)',
      lightSensitive: false,
      hygroscopic: false,
      flammableCabinetRequired: true,
      desiccatorRequired: false,
      specialNotes: 'فوق‌العاده فرار و با نقطه اشتعال منفی ۴۰ درجه سانتی‌گراد! در کابینت ضد حریق استاندارد و دارای تهویه نگهداری شود.'
    },
    preparationDate: '2026-01-15',
    expiryDate: '2029-01-15',
    lotNumber: 'M-PETET-2026-AR',
    hazards: {
      ghsPictograms: ['GHS02', 'GHS07', 'GHS08', 'GHS09'],
      signalWord: 'Danger',
      hazardStatements: [
        'H224: مایع و بخارات فوق‌العاده قابل اشتعال.',
        'H304: در صورت بلعیدن و ورود به مجاری تنفسی می‌تواند کشنده باشد.',
        'H315: سبب تحریک پوستی می‌شود.',
        'H336: ممکن است سبب خواب‌آلودگی یا سرگیجه شود.',
        'H411: برای آبزیان سمی با اثرات طولانی‌مدت.'
      ],
      precautionaryStatements: [
        'P210: دور از حرارت، جرقه و شعله باز نگهداری شود.',
        'P273: از رهاسازی در محیط زیست خودداری شود.',
        'P301+P310: در صورت بلع فورا با مرکز سم‌شناسی تماس گرفته شود. استفراغ ایجاد نشود!'
      ],
      nfpaRating: { health: 1, flammability: 4, instability: 0 },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش نیتریل مقاوم به حلال‌های هیدروکربنی', 'عینک گاگل ضد حلال', 'هود با استاندارد ضدانفجار (Explosion Proof)'],
      firstAid: {
        eyeContact: 'شستشو با آب فراوان.',
        skinContact: 'شستشو با آب و صابون.',
        inhalation: 'هوای تازه و اکسیژن در صورت نیاز.',
        ingestion: 'هرگز ایجاد استفراغ نکنید (خطر ورود به ریه و پنومونی شیمیایی حاد)؛ اعزام فوری به اورژانس.'
      },
      handlingPrecautions: [
        'دستگاه سوکسله و حمام آب گرم باید حتماً در زیر هود شیمیایی فعال کار کنند.',
        'از هیترهای المنتی باز استفاده نشود؛ فقط حمام آب گرم بن‌ماری ترموستاتیک.'
      ],
      spillResponse: 'قطع فوری تمام منابع برق و جرقه؛ جمع‌آوری با پودر یا پدهای جاذب حلال‌های غیرقطبی.',
      incompatibleWith: ['اکسیدکننده‌های قوی', 'هالوژن‌ها'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'Merck Millipore SDS / PubChem',
      sdsCodeOrNumber: 'Merck SDS No. 101775 (EC No. 931-254-9)',
      revisionDate: '2025-07-30',
      verified: true,
      safetyDisclaimer: 'منطبق بر استانداردهای استخراج لیپیدها در آزمون‌های کنترل کیفیت AOAC و ISO.'
    },
    associatedExperiments: [
      {
        experimentName: 'اندازه‌گیری چربی خام (Crude Fat) به روش استخراج مداوم سوکسله (Soxhlet Method)',
        standardCode: 'INSO 1805 / AOAC 920.39 / ISO 1443',
        role: 'extractant',
        rolePersian: 'حلال غیرقطبی استاندارد استخراج چربی‌ها و تری‌گلیسریدها در دمای جوش پایین (۴۰ تا ۶۰ درجه)',
        notes: 'استخراج به مدت ۴ تا ۶ ساعت در کارتریج استخراج سوکسله'
      }
    ],
    stockQuantity: { amount: 4000, unit: 'mL', location: 'کابینت ضد حریق حلال‌های آلی - طبقه وسط S2', minAlertLevel: 1000 },
    notes: 'مایع شفاف فرار و فرابین با بوی بنزین مانند ملایم.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-khp-14',
    name: 'پتاسیم هیدروژن فتالات (KHP - استاندارد اولیه خالص)',
    englishName: 'Potassium Hydrogen Phthalate Primary Standard AR',
    scientificName: 'Potassium hydrogen phthalate (IUPAC: Potassium hydrogen benzene-1,2-dicarboxylate)',
    chemicalFormula: 'C8H5KO4',
    casNumber: '877-24-7',
    casSource: 'PubChem CID 13533 / NIST SRM 84k / Merck SDS 104886',
    family: 'salt',
    molecularWeight: 204.22,
    density: 1.636,
    valenceOrEquivalents: 1,
    grade: 'primary_standard',
    purityPercentage: 99.95,
    physicalState: 'crystals',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: false,
      hygroscopic: false,
      flammableCabinetRequired: false,
      desiccatorRequired: true,
      specialNotes: 'قبل از استفاده به مدت ۲ ساعت در آون ۱۰۵ درجه سانتی‌گراد خشک شده و در دسیکاتور خنک شود.'
    },
    preparationDate: '2026-01-05',
    expiryDate: '2031-01-05',
    lotNumber: 'NIST-KHP-2026-PS',
    hazards: {
      ghsPictograms: [],
      signalWord: 'None',
      hazardStatements: ['ماده غیرخطرناک طبق ضوابط سیستم هماهنگ جهانی GHS.'],
      precautionaryStatements: ['P262: از تماس با چشم‌ها خودداری شود.'],
      nfpaRating: { health: 1, flammability: 0, instability: 0 },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش آزمایشگاهی', 'عینک محافظ', 'روپوش کار'],
      firstAid: {
        eyeContact: 'شستشو با آب روان.',
        skinContact: 'شستشو با آب و صابون.',
        inhalation: 'هوای تازه.',
        ingestion: 'نوشیدن آب.'
      },
      handlingPrecautions: ['به عنوان استاندارد اولیه، خلوص و عدم آلودگی آن بالاترین اولویت را دارد.'],
      spillResponse: 'جاروب خشک و تمیز کردن سطح.',
      incompatibleWith: ['اکسیدکننده‌های قوی'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'NIST / Merck KGaA Safety Data Sheet',
      sdsCodeOrNumber: 'Merck SDS No. 104886 (EC No. 212-889-4)',
      revisionDate: '2025-04-10',
      verified: true,
      safetyDisclaimer: 'استاندارد اولیه مرجع متولوژی شیمیایی با قابلیت ردیابی NIST (Traceable to SRM 84k).'
    },
    associatedExperiments: [
      {
        experimentName: 'استانداردسازی و تعیین فاکتور تیتر محلول‌های سود (NaOH 0.1 N Titration Factor)',
        standardCode: 'INSO 2852 / AOAC 936.16',
        role: 'standard',
        rolePersian: 'استاندارد اولیه کالیبراسیون و فاکتورگیری تیترانت هیدروکسید سدیم با شناساگر فنل‌فتالئین',
        notes: 'توزین حدود ۰.۴ تا ۰.۵ گرم KHP با دقت ۰.۰۰۰۱ گرم روی ترازوی آنالیتیکال ۴ رقمی'
      },
      {
        experimentName: 'کالیبراسیون بافر مرجع pH 4.005 در دمای ۲۵ درجه',
        standardCode: 'IUPAC Primary pH Standards',
        role: 'buffer',
        rolePersian: 'تهیه محلول بافر مرجع اولیه ۰.۰۵ مولال با pH دقیق ۴.۰۰۵',
        notes: '۱۰.۱۲ گرم KHP حل شده در ۱ لیتر آب مقطر بدون دی‌اکسید کربن'
      }
    ],
    stockQuantity: { amount: 500, unit: 'g', location: 'کابینت استانداردهای اولیه (Primary Standards) - قفسه A0', minAlertLevel: 100 },
    notes: 'پودر کریستالی سفید و براق بسیار پایدار، بدون آب تبلور، غیرجاذب رطوبت.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-acetic-acid-15',
    name: 'اسید استیک گلاسیال ۹۹.۸٪ (استیک اسید خالص یخی)',
    englishName: 'Acetic Acid Glacial 99.8% for Analysis',
    scientificName: 'Ethanoic acid (IUPAC: Ethanoic acid)',
    chemicalFormula: 'CH3COOH',
    casNumber: '64-19-7',
    casSource: 'PubChem CID 176 / Merck SDS 100063',
    family: 'acid',
    molecularWeight: 60.05,
    density: 1.05,
    valenceOrEquivalents: 1,
    grade: 'analytical',
    purityPercentage: 99.8,
    physicalState: 'liquid',
    storageConditions: {
      temperature: '17-25°C (در دمای زیر ۱۶.۶ درجه سانتی‌گراد منجمد و بلوری می‌شود)',
      lightSensitive: false,
      hygroscopic: true,
      flammableCabinetRequired: true,
      desiccatorRequired: false,
      specialNotes: 'در کابینت اسیدهای آلی قابل اشتعال نگهداری شود. در زمستان اگر جامد شد در حمام آب ملایم گرم شود.'
    },
    preparationDate: '2026-01-20',
    expiryDate: '2029-01-20',
    lotNumber: 'M-HAC-2026-AR',
    hazards: {
      ghsPictograms: ['GHS02', 'GHS05'],
      signalWord: 'Danger',
      hazardStatements: [
        'H226: مایع و بخار قابل اشتعال.',
        'H314: سبب سوختگی شدید پوست و آسیب جدی به چشم می‌شود.'
      ],
      precautionaryStatements: [
        'P210: دور از حرارت و شعله باز نگهداری شود.',
        'P280: دستکش نیتریل/بوتیل و عینک ایمنی استفاده گردد.',
        'P305+P351+P338: در صورت تماس با چشم با احتیاط با آب شستشو داده شود.'
      ],
      nfpaRating: { health: 3, flammability: 2, instability: 0 },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش نیتریل یا بوتیل', 'عینک محافظ چشم', 'هود فعال با بوی زننده تند سرکه‌ای'],
      firstAid: {
        eyeContact: 'شستشوی چشم‌ها با آب فراوان به مدت ۱۵ دقیقه و مراجعه به پزشک.',
        skinContact: 'شستشوی پوست با آب و صابون.',
        inhalation: 'هوای تازه و استراحت.',
        ingestion: 'دهان شسته شود؛ از استفراغ خودداری گردد.'
      },
      handlingPrecautions: ['بخارات اسید استیک به شدت اشک‌آور و سوزاننده مخاط بینی هستند؛ حتماً در زیر هود کار شود.'],
      spillResponse: 'خنثی‌سازی با محلول بی‌کربنات سدیم و جمع‌آوری با پد جاذب.',
      incompatibleWith: ['بازهای قوی', 'اکسیدکننده‌های قوی نظیر اسید کرومیک و پرمنگنات‌ها', 'فلزات'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'Merck Millipore Safety Data Sheet / PubChem',
      sdsCodeOrNumber: 'Merck SDS No. 100063 (EC No. 200-580-7)',
      revisionDate: '2025-07-15',
      verified: true,
      safetyDisclaimer: 'بر اساس الزامات طبقه‌بندی مواد خورنده و اشتعال‌پذیر GHS و OSHA.'
    },
    associatedExperiments: [
      {
        experimentName: 'مخلوط حلال در تعیین عدد پراکسید روغن‌ها (Isooctane : Acetic Acid 2:3)',
        standardCode: 'INSO 4179 / ISO 3960',
        role: 'solvent',
        rolePersian: 'حلال قطبی اسیدی برای انحلال چربی و تسریع واکنش رهایش ید از پتاسیم یدید',
        notes: 'ترکیب ۳۰ میلی‌لیتر اسید استیک گلاسیال + ۲۰ میلی‌لیتر ایزواکتان/کلروفرم'
      }
    ],
    stockQuantity: { amount: 2500, unit: 'mL', location: 'کابینت اسیدهای آلی / اشتعال‌پذیر - قفسه B2', minAlertLevel: 500 },
    notes: 'مایع شفاف و بی‌رنگ با بوی نافذ و شدید سرکه که در دمای زیر ۱۶.۶ درجه سانتی‌گراد یخ می‌زند.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reagent-isoamyl-alcohol-16',
    name: 'ایزوآمیل الکل ژربر (۳-متیل-۱-بوتانول)',
    englishName: 'Isoamyl Alcohol for Gerber Method (3-Methyl-1-butanol)',
    scientificName: '3-Methylbutan-1-ol',
    chemicalFormula: 'C5H12O',
    casNumber: '123-51-3',
    casSource: 'PubChem CID 31260 / Merck SDS 100979',
    family: 'organic_solvent',
    molecularWeight: 88.15,
    density: 0.81,
    grade: 'analytical',
    purityPercentage: 98.5,
    physicalState: 'liquid',
    storageConditions: {
      temperature: '15-25°C',
      lightSensitive: false,
      hygroscopic: false,
      flammableCabinetRequired: true,
      desiccatorRequired: false,
      specialNotes: 'باید کاملاً عاری از روغن و چربی ثانویه باشد (Oil-free for Gerber test).'
    },
    preparationDate: '2026-01-20',
    expiryDate: '2029-01-20',
    lotNumber: 'M-ISOAM-2026-GER',
    hazards: {
      ghsPictograms: ['GHS02', 'GHS07'],
      signalWord: 'Warning',
      hazardStatements: [
        'H226: مایع و بخار قابل اشتعال.',
        'H332: در اثر استنشاق زیان‌آور است.',
        'H315: سبب تحریک پوستی می‌شود.',
        'H318: سبب آسیب جدی به چشم می‌شود.',
        'H335: ممکن است سبب تحریک مجاری تنفسی گردد.'
      ],
      precautionaryStatements: [
        'P210: دور از حرارت و شعله باز نگهداری شود.',
        'P280: استفاده از عینک و دستکش محافظ.',
        'P305+P351+P338: شستشوی چشم با آب در صورت تماس.'
      ],
      nfpaRating: { health: 2, flammability: 2, instability: 0 },
      isVerifiedHazard: true
    },
    safetyNotes: {
      ppeRequired: ['دستکش نیتریل', 'عینک محافظ چشم', 'کار در هود آزمایشگاهی'],
      firstAid: {
        eyeContact: 'شستشوی چشم با آب فراوان به مدت ۱۵ دقیقه.',
        skinContact: 'شستشوی موضع با آب و صابون.',
        inhalation: 'هوای تازه و استراحت.',
        ingestion: 'دهان شسته شود؛ به پزشک مراجعه گردد.'
      },
      handlingPrecautions: ['استفاده از پیپت‌پرکن اتوماتیک ۱ میلی‌لیتری ژربر برای جلوگیری از تماس با پوست و استنشاق.'],
      spillResponse: 'جمع‌آوری با پد جاذب حلال.',
      incompatibleWith: ['اکسیدکننده‌های قوی', 'اسیدهای معدنی غلیظ (واکنش شدید استری‌شدن و گرما)'],
      exothermicWarning: undefined
    },
    sdsReference: {
      publisherOrSource: 'Merck KGaA Safety Data Sheet / PubChem',
      sdsCodeOrNumber: 'Merck SDS No. 100979 (EC No. 204-633-5)',
      revisionDate: '2025-06-18',
      verified: true,
      safetyDisclaimer: 'منطبق بر الزامات استاندارد بین‌المللی ISO 2446 و INSO 366 برای چربی‌سنجی ژربر.'
    },
    associatedExperiments: [
      {
        experimentName: 'سنجش چربی شیر به روش ژربر (Gerber Milk Fat Test)',
        standardCode: 'INSO 366 / ISO 2446',
        role: 'solvent',
        rolePersian: 'کاهش کشش سطحی و تسریع جداسازی فاز چربی شفاف از فاز اسیدی در لوله بوتیومتر',
        notes: 'دقیقا ۱ میلی‌لیتر ایزوآمیل الکل روی اسید سولفوریک و شیر در بوتیومتر افزوده می‌شود.'
      }
    ],
    stockQuantity: { amount: 2000, unit: 'mL', location: 'کابینت حلال‌های آلی - قفسه C3', minAlertLevel: 500 },
    notes: 'مایع بی‌رنگ و شفاف با بوی تند الکلی مشخص، نامحلول در آب و محلول در الکل و اتر.',
    isBenchmark: true,
    updatedAt: new Date().toISOString()
  }
];
