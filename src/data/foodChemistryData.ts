import { 
  FoodChemistryTest, 
  MajorFoodComponentProfile 
} from '../types/foodChemistry';
import { FOOD_CHEMISTRY_TESTS_DATABASE } from './foodChemistryTests';
import { FOOD_CHEMISTRY_TESTS_EXTENDED } from './foodChemistryTestsExtended';

export const ALL_FOOD_CHEMISTRY_TESTS: FoodChemistryTest[] = [
  ...FOOD_CHEMISTRY_TESTS_DATABASE,
  ...FOOD_CHEMISTRY_TESTS_EXTENDED
];

export const FOOD_CHEMISTRY_CATEGORIES = [
  { id: 'all', labelFa: 'همه آزمون‌های شیمیایی', count: ALL_FOOD_CHEMISTRY_TESTS.length },
  { id: 'proximate_moisture', labelFa: 'رطوبت و ماده خشک (Moisture)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'proximate_moisture').length },
  { id: 'proximate_ash', labelFa: 'خاکستر و املاح معدنی (Ash)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'proximate_ash').length },
  { id: 'proximate_protein', labelFa: 'پروتئین خام و ازت (Protein)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'proximate_protein').length },
  { id: 'proximate_fat', labelFa: 'چربی و لیپیدها (Fat/Lipids)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'proximate_fat').length },
  { id: 'proximate_fiber', labelFa: 'فیبر رژیمی و فیبر خام (Fiber)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'proximate_fiber').length },
  { id: 'carbohydrates_sugars', labelFa: 'قندها و کربوهیدرات (Sugars)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'carbohydrates_sugars').length },
  { id: 'acidity_ph', labelFa: 'اسیدیته و pH (Acidity)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'acidity_ph').length },
  { id: 'minerals_salts', labelFa: 'نمک و مواد معدنی (Salt/NaCl)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'minerals_salts').length },
  { id: 'refractometry_density', labelFa: 'بریکس و دانسیته (Brix/Density)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'refractometry_density').length },
  { id: 'pigments_colorants', labelFa: 'رنگدانه‌ها و آنتوسیانین (Pigments)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'pigments_colorants').length },
  { id: 'antioxidants_phenolics', labelFa: 'آنتی‌اکسیدان‌ها و فنول (Antioxidants)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'antioxidants_phenolics').length },
  { id: 'lipids_quality', labelFa: 'کیفیت روغن و عدد پراکسید (PV)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'lipids_quality').length },
  { id: 'vitamins_preservatives', labelFa: 'ویتامین‌ها و نگهدارنده‌ها (Vitamins)', count: ALL_FOOD_CHEMISTRY_TESTS.filter(t => t.category === 'vitamins_preservatives').length },
];

export const FOOD_INDUSTRY_SECTORS = [
  { id: 'all', nameFa: 'همه صنایع غذایی', icon: 'Layers' },
  { id: 'dairy', nameFa: 'صنایع لبنی و فرآورده‌های شیری', icon: 'Milk' },
  { id: 'cereal', nameFa: 'صنایع آرد، غلات و ماکارونی', icon: 'Wheat' },
  { id: 'meat', nameFa: 'گوشت، مرغ و فرآورده‌های شیلاتی', icon: 'Beef' },
  { id: 'fruits_veg', nameFa: 'کنسرو، آبمیوه، کمپوت و سبزیجات', icon: 'Apple' },
  { id: 'confectionery', nameFa: 'صنایع قند، شکلات، شیرینی و عسل', icon: 'Cookie' },
  { id: 'beverages', nameFa: 'نوشیدنی‌ها، عصاره‌ها و چای', icon: 'Coffee' },
  { id: 'spices', nameFa: 'ادویه‌جات، چاشنی‌ها و سس‌ها', icon: 'Sparkles' },
  { id: 'bakery', nameFa: 'صنایع نان و نانوایی صنعتی', icon: 'Flame' }
];

export const MAJOR_FOOD_COMPONENTS_DATA: MajorFoodComponentProfile[] = [
  {
    id: 'comp-moisture',
    componentFa: 'رطوبت و ماده خشک (Moisture & Total Solids)',
    componentEn: 'Moisture and Dry Matter',
    definitionFa: 'مقدار آب آزاد، پیوندی و محبوس در ساختار ماتریکس ماده غذایی که مستقیماً بر ماندگاری، فعالیت آبی (aw)، بافت و خواص میکروبیولوژیکی اثرگذار است.',
    nutritionalRoleFa: 'محیط انجام واکنش‌های متابولیک و بیوشیمیایی، انتقال املاح و حلالیت مواد مغذی بدون ارزش کالریک مستقیم.',
    caloricValueKcalPerGram: 0,
    standardAnalyticalMethods: [
      { methodNameFa: 'روش خشک‌کردن با آون هوای داغ (۱۰۵ درجه)', standardCode: 'AOAC 925.10 / INSO 2705', speedVsAccuracy: 'مرجع استاندارد، دقت بالا (۳ تا ۵ ساعت)' },
      { methodNameFa: 'آون تحت خلاء (۷۰ درجه برای مواد پرقند)', standardCode: 'AOAC 934.06 / INSO 5689', speedVsAccuracy: 'جلوگیری از کاراملیزاسیون قندها' },
      { methodNameFa: 'تیتراسیون کارل فیشر (Karl Fischer)', standardCode: 'ISO 8534 / AOAC 2001.12', speedVsAccuracy: 'سریع و دقیق برای رطوبت‌های بسیار ناچیز (< ۱٪)' },
      { methodNameFa: 'رطوبت‌سنج سریع تابشی هالوژنی', standardCode: 'In-line QA / QC', speedVsAccuracy: 'بسیار سریع (۵ تا ۱۰ دقیقه)' }
    ],
    typicalRangesInFoods: [
      { foodCategory: 'میوه‌ها و سبزیجات تازه', typicalRange: '۸۰٪ الی ۹۵٪' },
      { foodCategory: 'شیر خام و لبنیات مایع', typicalRange: '۸۷٪ الی ۸۹٪' },
      { foodCategory: 'گوشت و فرآورده‌های پروتئینی', typicalRange: '۶۰٪ الی ۷۵٪' },
      { foodCategory: 'نان، آرد و غلات', typicalRange: '۱۰٪ الی ۱۴٪' },
      { foodCategory: 'روغن‌های خوراکی و چربی‌ها', typicalRange: '< ۰.۱٪' }
    ],
    chemistryAndInteractionsFa: 'آب در سه فرم پیوندی (تک‌لایه BET)، آب مویینه (چندلایه) و آب آزاد توده‌ای وجود دارد. آب آزاد محرک اصلی فساد میکروبی و واکنش‌های آنزیمی است.',
    keyQualityFactors: ['کنترل کلوخه شدن پودرها', 'مهار فساد کپکی', 'حفظ تردی و بافت']
  },
  {
    id: 'comp-ash',
    componentFa: 'خاکستر کل و مواد معدنی (Total Ash & Minerals)',
    componentEn: 'Total Ash and Inorganic Residue',
    definitionFa: 'باقیمانده معدنی و غیرآلی حاصل از سوزاندن کامل و اکسیداسیون ترکیبات آلی ماده غذایی در کوره آزمایشگاهی در دمای ۵۰۰ الی ۵۵۰ درجه سلسیوس.',
    nutritionalRoleFa: 'تامین عناصر ضروری کلان (کلسیم، منیزیم، سدیم، پتاسیم، فسفر) و عناصر کمیاب (آهن، روی، مس، سلنیوم).',
    caloricValueKcalPerGram: 0,
    standardAnalyticalMethods: [
      { methodNameFa: 'سوزاندن خشک در کوره الکتریکی (۵۵۰ درجه)', standardCode: 'AOAC 923.03 / INSO 2706', speedVsAccuracy: 'روش مرجع، زمان‌بر (۴ تا ۶ ساعت)' },
      { methodNameFa: 'خاکستر نامحلول در اسید (شن و سیلیس)', standardCode: 'INSO 3003 / ISO 763', speedVsAccuracy: 'شاخص سنجش ناخالصی خاک و گل' },
      { methodNameFa: 'طیف‌سنجی جذب اتمی (AAS / ICP-OES)', standardCode: 'AOAC 999.11', speedVsAccuracy: 'آنالیز عناصر معدنی با دقت ppb' }
    ],
    typicalRangesInFoods: [
      { foodCategory: 'آرد و غلات کامل', typicalRange: '۰.۵٪ الی ۲.۰٪' },
      { foodCategory: 'شیر و فرآورده‌های شیری', typicalRange: '۰.۷٪ الی ۱.۵٪' },
      { foodCategory: 'میوه‌ها و آبمیوه‌ها', typicalRange: '۰.۲٪ الی ۰.۶٪' },
      { foodCategory: 'ادویه‌ها و چاشنی‌ها', typicalRange: '۳.۰٪ الی ۸.۰٪' }
    ],
    chemistryAndInteractionsFa: 'خاکستر شامل اکسیدها، سولفات‌ها، فسفات‌ها، کلریدها و کربنات‌های فلزی است. دمای بالاتر از ۵۵۰ درجه ممکن است باعث تبخیر کلریدهای فرار (NaCl و KCl) شود.',
    keyQualityFactors: ['ارزیابی درجه استخراج آرد گندم', 'تعیین تقلبات افزودن خاک و شن', 'ارزیابی ارزش معدنی']
  },
  {
    id: 'comp-protein',
    componentFa: 'پروتئین خام و اسیدهای آمینه (Crude Protein)',
    componentEn: 'Crude Protein and Amino Acids',
    definitionFa: 'پلیمرهای پیچیده تشکیل‌شده از اسیدهای آمینه متصل با پیوندهای پپتیدی، حاوی به طور متوسط ۱۶٪ ازت ساختاری.',
    nutritionalRoleFa: 'رشد و ترمیم بافت‌ها، سنتز آنزیم‌ها، هورمون‌ها، ایمونوگلوبولین‌ها و حفظ فشار اسمزی خون.',
    caloricValueKcalPerGram: 4.0,
    standardAnalyticalMethods: [
      { methodNameFa: 'روش هضم، تقطیر و تیتراسیون کجلدال (Kjeldahl)', standardCode: 'AOAC 991.20 / INSO 19052', speedVsAccuracy: 'روش مرجع جهانی برای پروتئین کل' },
      { methodNameFa: 'روش احتراق دوماس (Dumas Combustion)', standardCode: 'ISO 16634 / AOAC 992.23', speedVsAccuracy: 'سریع، خودکار و بدون پسماند شیمیایی سمی' },
      { methodNameFa: 'روش رنگ‌سنجی بیوره و برادفورد (Biuret / Bradford)', standardCode: 'Colorimetric Assay', speedVsAccuracy: 'مخصوص پروتئین‌های محلول و بیوشیمی' }
    ],
    typicalRangesInFoods: [
      { foodCategory: 'گوشت، مرغ و ماهی', typicalRange: '۱۸٪ الی ۲۴٪' },
      { foodCategory: 'سویا و حبوبات خشک', typicalRange: '۲۰٪ الی ۴۰٪' },
      { foodCategory: 'پنیرهای سخت و رسیده‌شده', typicalRange: '۲۲٪ الی ۳۰٪' },
      { foodCategory: 'تخم مرغ کامل', typicalRange: '۱۲٪ الی ۱۳٪' },
      { foodCategory: 'آرد گندم و ماکارونی', typicalRange: '۱۰٪ الی ۱۴٪' },
      { foodCategory: 'شیر گاو تازه', typicalRange: '۳.۰٪ الی ۳.۵٪' }
    ],
    chemistryAndInteractionsFa: 'در روش کجلدال ازت کل اندازه‌گیری شده و با اعمال ضریب تبدیل مناسب (لبنیات: ۶.۳۸، آرد گندم: ۵.۷۰، سویا: ۵.۸۰، استاندارد عمومی: ۶.۲۵) پروتئین خام محاسبه می‌گردد.',
    keyQualityFactors: ['شاخص ارزش تغذیه‌ای', 'تشکیل شبکه گلوتن در نان‌پزی', 'خواص امولسیون‌کنندگی و تشکیل ژل']
  },
  {
    id: 'comp-fat',
    componentFa: 'چربی کل و لیپیدها (Total Fat & Lipids)',
    componentEn: 'Total Fat and Triglycerides',
    definitionFa: 'تری‌گلیسریدها، فسفولیپیدها، استرول‌ها و اسیدهای چرب آزاد که در حلال‌های آلی غیرقطبی (پترولیوم اتر، دی‌اتیل اتر، هگزان) محلول هستند.',
    nutritionalRoleFa: 'غنی‌ترین منبع تامین انرژی، ناقل ویتامین‌های محلول در چربی (A, D, E, K)، تامین اسیدهای چرب ضروری (امگا ۳ و ۶) و ایجاد طعم و احساس دهانی.',
    caloricValueKcalPerGram: 9.0,
    standardAnalyticalMethods: [
      { methodNameFa: 'استخراج مداوم با سوکسله (Soxhlet Extraction)', standardCode: 'AOAC 920.39 / INSO 3001', speedVsAccuracy: 'روش مرجع استاندارد برای نمونه‌های خشک' },
      { methodNameFa: 'بوتیرومتری ژربر برای شیر و لبنیات (Gerber)', standardCode: 'ISO 2446 / INSO 366', speedVsAccuracy: 'روش سریع و دقیق با اسید سولفوریک و ایزوآمیل الکل' },
      { methodNameFa: 'روش هیدرولیز اسیدی وایبول-اشتولت (Weibull-Stoldt)', standardCode: 'ISO 1443 / AOAC 922.06', speedVsAccuracy: 'آزادسازی چربی‌های پیوندی در نان، گوشت و سس‌ها' },
      { methodNameFa: 'روش رز-گاتلیب و موجونیر (Rose-Gottlieb)', standardCode: 'AOAC 905.02 / ISO 1211', speedVsAccuracy: 'مرجع لبنیات با دی‌اتیل اتر و آمونیاک' }
    ],
    typicalRangesInFoods: [
      { foodCategory: 'روغن‌های مایع نباتی و کره', typicalRange: '۸۰٪ الی ۱۰۰٪' },
      { foodCategory: 'سس مایونز و درسیگ‌ها', typicalRange: '۴۰٪ الی ۷۵٪' },
      { foodCategory: 'شکلات و مغزهای آجیلی', typicalRange: '۳۰٪ الی ۶۰٪' },
      { foodCategory: 'پنیرهای پرچرب', typicalRange: '۲۰٪ الی ۳۵٪' },
      { foodCategory: 'شیر خام استاندارد', typicalRange: '۳.۰٪ الی ۴.۰٪' }
    ],
    chemistryAndInteractionsFa: 'چربی‌های پیوند شده به پروتئین‌ها یا نشاسته نیازمند هیدرولیز اولیه با اسید یا باز هستند تا استخراج با حلال به صورت ۱۰۰٪ کامل انجام شود.',
    keyQualityFactors: ['پایداری در برابر اکسیداسیون و ترشیدگی', 'احساس دهانی و بافت', 'نقطه ذوب و فرمولاسیون روغن']
  },
  {
    id: 'comp-fiber',
    componentFa: 'فیبر خام و فیبر رژیمی کل (Dietary Fiber)',
    componentEn: 'Crude Fiber and Total Dietary Fiber',
    definitionFa: 'پلی‌ساکاریدهای غیرنشاسته‌ای و لیگنین موجود در دیواره سلولی گیاهان که در برابر آنزیم‌های گوارشی روده باریک انسان مقاوم هستند.',
    nutritionalRoleFa: 'تسهیل حرکات دودی روده، کاهش کلسترول LDL خون، تعدیل ترشح انسولین و ایجاد اثرات پری‌بیوتیکی برای میکروبیوتای روده.',
    caloricValueKcalPerGram: 2.0,
    standardAnalyticalMethods: [
      { methodNameFa: 'فیبر رژیمی کل (TDF) به روش آنزیمی-وزن‌سنجی', standardCode: 'AOAC 991.43 / 985.29 / INSO 12437', speedVsAccuracy: 'مرجع برچسب‌گذاری ارزش تغذیه‌ای نوین' },
      { methodNameFa: 'فیبر خام به روش ونده (Weende Crude Fiber)', standardCode: 'AOAC 978.10 / INSO 3105', speedVsAccuracy: 'هضم با اسید و باز رقیق (استاندارد خوراک دام و غلات)' }
    ],
    typicalRangesInFoods: [
      { foodCategory: 'سبوس گندم و جو دوسر', typicalRange: '۱۵٪ الی ۴۵٪' },
      { foodCategory: 'حبوبات خشک (لوبیا، نخود، عدس)', typicalRange: '۱۵٪ الی ۲۵٪' },
      { foodCategory: 'میوه‌های خشک و تازه با پوست', typicalRange: '۲.۰٪ الی ۱۰.۰٪' },
      { foodCategory: 'سبزیجات برگ‌دار', typicalRange: '۲.۰٪ الی ۵.۰٪' }
    ],
    chemistryAndInteractionsFa: 'شامل فیبرهای محلول (پکتین، بتاگلوکان، صمغ‌ها) و نامحلول (سلولز، همی‌سلولز، لیگنین) است. در روش آنزیمی از سه آنزیم آلفا-آمیلاز مقاوم به حرارت، پروتئاز و آمیلوگلوکوزیداز استفاده می‌شود.',
    keyQualityFactors: ['خواص جذب آب و ویسکوزیته', 'جایگزین چربی در محصولات رژیمی', 'ادعاهای سلامت‌بخش روی برچسب']
  },
  {
    id: 'comp-carbohydrates',
    componentFa: 'کربوهیدرات‌ها و قندها (Carbohydrates & Sugars)',
    componentEn: 'Total Carbohydrates and Sugars',
    definitionFa: 'منوساکاریدها (گلوکز، فروکتوز)، دی‌ساکاریدها (ساکارز، لاکتوز، مالتوز) و پلی‌ساکاریدها (نشاسته و گلیکوژن) که منبع اولیه تامین انرژی سلولی هستند.',
    nutritionalRoleFa: 'تامین سریع و اولیه انرژی مورد نیاز سیستم عصبی مرکزی، مغز و ماهیچه‌ها.',
    caloricValueKcalPerGram: 4.0,
    standardAnalyticalMethods: [
      { methodNameFa: 'کربوهیدرات کل به روش تفاضلی (By Difference)', standardCode: 'FAO / Codex Guidelines', speedVsAccuracy: '۱۰۰ منهای مجموع (رطوبت + پروتئین + چربی + خاکستر)' },
      { methodNameFa: 'قندهای احیاکننده به روش مس-تیرومتری لین-آینون', standardCode: 'AOAC 923.09 / INSO 3005', speedVsAccuracy: 'تیتراسیون با معرف فهلینگ و متیلن بلو' },
      { methodNameFa: 'کروماتوگرافی مایع با کارایی بالا (HPLC-RID)', standardCode: 'ISO 22662 / AOAC 977.20', speedVsAccuracy: 'تفکیک دقیق همزمان گلوکز، فروکتوز، ساکارز و لاکتوز' }
    ],
    typicalRangesInFoods: [
      { foodCategory: 'شکر سفید و قند تصفیه شده', typicalRange: '۹۹.۵٪ الی ۹۹.۹٪' },
      { foodCategory: 'برنج، ماکارونی و آرد غلات', typicalRange: '۷۰٪ الی ۸۰٪' },
      { foodCategory: 'عسل طبیعی و شربت‌ها', typicalRange: '۷۵٪ الی ۸۲٪' },
      { foodCategory: 'نان‌های سنتی و فانتزی', typicalRange: '۴۵٪ الی ۵۵٪' }
    ],
    chemistryAndInteractionsFa: 'قندهای احیاکننده در مجاورت اسیدهای آمینه و حرارت وارد واکنش قهوه‌ای‌شدن مایلارد (Maillard Reaction) شده و آروما و رنگ طلایی-قهوه‌ای پخت را تولید می‌کنند.',
    keyQualityFactors: ['شاخص گلیسمی (GI)', 'شیرینی نسبی و اسمولالیته', 'تشکیل ویسکوزیته با نشاسته ژلاتینه']
  }
];
