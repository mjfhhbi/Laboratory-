/**
 * Seed Research & Thesis Projects for Food Science & Engineering
 * Rigorous, academic, and industrial R&D templates with verified references
 */

import { ResearchProject } from '../types/research';

export const SEED_RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: 'proj-active-pkg-nanotech-01',
    title: 'ارزیابی خواص نانوبیوکامپوزیت کیتوزان حاوی نانوذرات اکسید روی (ZnO) و اسانس آویشن شیرازی در بهبود ماندگاری فیله قزل‌آلای رنگین‌کمان',
    englishTitle: 'Evaluation of chitosan nanocomposite active films incorporating zinc oxide nanoparticles and Zataria multiflora Boiss essential oil for shelf-life extension of rainbow trout fillets',
    academicLevel: 'master',
    category: 'food_nanotechnology',
    createdAt: '2024-03-01T10:00:00.000Z',
    updatedAt: '2024-03-15T14:30:00.000Z',
    status: 'proposal_ready',
    problemStatement: 'فساد سریع اسیدهای چرب غیراشباع امگا-۳ و فعالیت باکتری‌های روانگرا (Pseudomonas spp. و Shewanella putrefaciens) در فیله ماهی قزل‌آلا در دمای یخچال، زمان ماندگاری این محصول را به کمتر از ۵ الی ۶ روز محدود می‌کند. مصرف نگهدارنده‌های شیمیایی به دلیل خطرات سلامت با مقاومت مصرف‌کنندگان مواجه است. بسته‌بندی فعال زیست‌تخریب‌پذیر مبتنی بر بیوپلیمرهای دریایی با آزادسازی کنترل‌شده ترکیبات ضدمیکروبی و نانوذرات نیمه‌هادی، می‌تواند مانع اکسیداسیون چربی و تخریب پروتئین‌ها گردد.',
    researchQuestions: [
      'آیا ترکیب نانوذرات اکسید روی و اسانس آویشن شیرازی در فیلم کیتوزان دارای اثر هم‌افزایی (Synergistic) بر کاهش نفوذپذیری بخار آب (WVP) است؟',
      'چه نسبتی از این دو عامل بدون تداخل در خواص ارگانولپتیک، شاخص TVB-N فیله ماهی را تا روز شانزدهم زیر حد مجاز ۲۵ میلی‌گرم ازت در ۱۰۰ گرم نگاه می‌دارد؟',
      'کینتیک اکسیداسیون لیپیدها (شاخص‌های PV و TBA) در مقایسه با فیلم‌های پلی‌اتیلنی متداول چگونه تغییر می‌یابد؟'
    ],
    objectives: {
      mainObjective: 'سنتز، مشخصه‌یابی فیزیکوشیمیایی و ارزیابی کارایی فیلم نانوکامپوزیت فعال کیتوزان/ZnO/اسانس آویشن در به تأخیر انداختن فساد میکروبی و شیمیایی فیله قزل‌آلا.',
      specificObjectives: [
        'تعیین ویژگی‌های ممانعتی و مکانیکی فیلم (نفوذپذیری بخار آب WVP، مقاومت کششی TS و ازدیاد طول تا نقطه شکست EB)',
        'بررسی رهایش ترکیبات فنولی تیمول و کارواکرول در شبیه‌سازهای غذایی',
        'پایش پارامترهای اکسیداسیون شامل عدد پراکسید (PV) و تیوباربیتوریک اسید (TBA) در فواصل ۴ روزه',
        'شمارش کل باکتری‌های هوازی مزوفیل (TVC) و سرمادوست (PTC)',
        'ارزیابی حسی ویژگی‌های فیله ماهی با آزمون هدونیک ۵ نقطه‌ای'
      ]
    },
    hypotheses: {
      nullHypothesis: 'افزودن نانوذرات ZnO و اسانس آویشن شیرازی به ماتریکس کیتوزان هیچ تأثیر معنی‌داری (p > 0.05) بر نرخ اکسیداسیون چربی و بار میکروبی فیله ماهی ندارد.',
      alternativeHypothesis: 'فیلم نانوبیوکامپوزیت حاوی ۱٪ نانوذرات ZnO و ۱٪ اسانس آویشن به صورت معنی‌داری (p < 0.05) زمان ماندگاری فیله قزل‌آلا را در دمای ۴ درجه سلسیوس از ۶ روز به ۱۶ روز افزایش می‌دهد.'
    },
    variables: [
      {
        id: 'var-1',
        name: 'غلظت اسانس آویشن شیرازی',
        type: 'independent',
        unit: 'درصد وزنی/حجمی (% w/v)',
        levelsOrRange: '۰، ۰.۵، ۱.۰، ۱.۵ درصد',
        description: 'اسانس استخراج‌شده با روش تقطیر با آب (کلونجر) و آنالیز با GC-MS'
      },
      {
        id: 'var-2',
        name: 'غلظت نانوذرات ZnO',
        type: 'independent',
        unit: 'درصد وزنی بر پایه کیتوزان (% w/w)',
        levelsOrRange: '۰، ۱.۰، ۲.۰ درصد',
        description: 'نانوذرات اکسید روی با اندازه متوسط ۳۰ تا ۵۰ نانومتر'
      },
      {
        id: 'var-3',
        name: 'زمان نگهداری در یخچال',
        type: 'independent',
        unit: 'روز (Day)',
        levelsOrRange: 'روزهای ۰، ۴، ۸، ۱۲، ۱۶',
        description: 'پایش تغییرات در فواصل ۴ روزه'
      },
      {
        id: 'var-4',
        name: 'عدد پراکسید (Peroxide Value)',
        type: 'dependent',
        unit: 'meq O2/kg fat',
        measurementMethod: 'تیتراسیون یدومتری بر اساس استاندارد AOAC 965.33',
        description: 'سنجش شاخص اکسیداسیون اولیه لیپیدها'
      },
      {
        id: 'var-5',
        name: 'اسید تیوباربیتوریک (TBA)',
        type: 'dependent',
        unit: 'mg malondialdehyde/kg',
        measurementMethod: 'طیف‌سنجی با اسپکتروفتومتر در طول موج ۵۳۲ نانومتر',
        description: 'سنجش شاخص اکسیداسیون ثانویه و مالون‌دی‌آلدئید'
      },
      {
        id: 'var-6',
        name: 'بازهای نیتروژنی فرار کل (TVB-N)',
        type: 'dependent',
        unit: 'mg N/100g',
        measurementMethod: 'تقطیر با بخار آب دستگاه کجلدال بر اساس روش Conway',
        description: 'شاخص تجزیه پروتئین و فساد باکتریایی'
      },
      {
        id: 'var-7',
        name: 'دمای نگهداری فیله‌ها',
        type: 'control',
        unit: 'درجه سلسیوس (°C)',
        levelsOrRange: '۴ ± ۰.۵ °C',
        description: 'کنترل دقیق در انکوباتور یخچال‌دار با دیتالاگر حرارتی'
      },
      {
        id: 'var-8',
        name: 'ضخامت فیلم پلیمری',
        type: 'control',
        unit: 'میکرومتر (μm)',
        levelsOrRange: '۶۵ ± ۵ μm',
        measurementMethod: 'میکرومتر دیجیتال با دقت ۰.۰۰۱ میلی‌متر در ۱۰ نقطه'
      }
    ],
    populationAndSample: {
      targetMatrix: 'فیله تازه ماهی قزل‌آلای رنگین‌کمان پرورشی (Oncorhynchus mykiss)',
      sampleSize: '۴۵ قطعه فیله با وزن تقریبی ۱۰۰ ± ۵ گرم',
      samplingMethod: 'نمونه‌برداری تصادفی بلوک‌بندی شده از استخر پرورش استاندارد با زنجیره سرمایش پیوسته',
      storageConditions: 'بسته‌بندی در فیلم‌های تولیدی، نگهداری در تاریکی در انکوباتور دمای ۴ درجه سلسیوس'
    },
    researchMethodology: {
      designType: 'طرح فاکتوریل بر پایه بلوک‌های کامل تصادفی (RCBD) در ۳ تکرار مستقل',
      samplingTimeline: 'روزهای ۰، ۴، ۸، ۱۲ و ۱۶ نگهداری در دمای ۴ درجه',
      dataAnalysisMethod: 'آنالیز واریانس دوطرفه و سه‌طرفه (ANOVA) با نرم‌افزار SAS یا SPSS نسخه ۲۶ و مقایسه میانگین‌ها با آزمون دانکن در سطح معنی‌داری p < 0.05',
      experimentalDesign: {
        designType: 'factorial',
        designNameFa: 'طرح فاکتوریل کامل ۳ عاملی (اسانس × نانوذره × زمان)',
        factorsCount: 3,
        factorsSummary: 'اسانس (۴ سطح) × نانوذره ZnO (۳ سطح) × زمان نگهداری (۵ نقطه زمانی)',
        responsesSummary: '۶ پاسخ شامل PV, TBA, TVB-N, TVC, WVP, Overall Acceptability',
        totalRuns: 60,
        replications: 3,
        statisticalModelFa: 'Y_ijkl = μ + α_i + β_j + γ_k + (αβ)_ij + (αγ)_ik + (βγ)_jk + (αβγ)_ijk + ε_ijkl',
        softwareRecommended: 'Design-Expert 13 / SAS 9.4',
        anovaProcedureFa: 'بررسی نرمال بودن مانده‌ها با آزمون شاپیرو-ویلک و بررسی همگنی واریانس‌ها با آزمون لون (Levene)'
      }
    },
    experimentalProcedures: `۱. تهیه فیلم: حل کردن ۲ گرم کیتوزان با درجه استیل‌زدایی متوسط در ۱۰۰ میلی‌لیتر اسید استیک ۱٪، اختلاط با همزن مغناطیسی به مدت ۴ ساعت.
۲. افزودن نانوذرات ZnO: سونیکاسیون با پروب اولتراسونیک (۲۰ کیلوهرتز، توان ۲۰۰ وات) به مدت ۱۵ دقیقه جهت دستیابی به سوسپانسیون یکنواخت و جلوگیری از تجمع نانوذرات (Agglomeration).
۳. افزودن گلیسرول به عنوان نرم‌کننده (Plasticizer) به میزان ۰.۷۵ میلی‌لیتر به ازای هر گرم پلیمر و سپس افزودن اسانس آویشن با امولسیفایر توئین ۸۰ (۰.۲٪ v/v).
۴. حلال‌ریزی (Casting) در پتری‌دیش‌های تفلونی و خشک‌کردن در دمای ۲۵ درجه سلسیوس به مدت ۴۸ ساعت.
۵. آماده‌سازی فیله‌های قزل‌آلا، بسته‌بندی، دوخت حرارتی و انتقال به انکوباتور ۴ درجه.
۶. اندازه‌گیری TVB-N با روش تقطیر و تیتراسیون اسید بوریک ۲٪ با اسید سولفوریک ۰.۰۱ نرمال.
۷. آزمون عدد پراکسید با روش یدومتری استاندارد AOAC 965.33.`,
    literatureReview: [
      {
        id: 'lit-1',
        title: 'روش رسمی AOAC برای تعیین عدد پراکسید در روغن‌ها و چربی‌های خوراکی',
        authors: ['AOAC International'],
        year: '2019',
        sourceType: 'aoac_method',
        doiOrStandardNo: 'AOAC Official Method 965.33',
        foodMatrix: 'روغن استخراج‌شده از بافت عضلانی ماهی',
        methodology: 'تیتراسیون ید آزادشده با تیوسولفات سدیم در حضور چسب نشاسته',
        keyVariables: 'عدد پراکسید اولیه، زمان واکنش در تاریکی',
        findings: 'روش مبنا و استاندارد طلایی پایش اکسیداسیون چربی اولیه در آبزیان با حد بحرانی ۵ میلی‌اکی‌والان بر کیلوگرم.',
        limitations: 'حساسیت به نور و اکسیژن محیط؛ لزوم انجام در تاریکی مطلق.',
        isVerifiedAuthentic: true,
        sourceRegistryId: 'src-aoac-965-33',
        citationText: 'AOAC Official Method 965.33 (2019). Peroxide Value of Oils and Fats.'
      },
      {
        id: 'lit-2',
        title: 'شیر و فرآورده‌های آن و ماتریکس‌های حیوانی - ویژگی‌های میکروبیولوژی',
        authors: ['کمیته ملی استاندارد میکروبیولوژی مواد غذایی'],
        year: '1398',
        sourceType: 'inso_standard',
        doiOrStandardNo: 'INSO 2408:1398',
        foodMatrix: 'محصولات پروتئینی و بافت‌های حیوانی',
        methodology: 'کشت پورپلیت در محیط Plate Count Agar (PCA) انکوباسیون ۳۰ درجه برای ۳ روز',
        keyVariables: 'شمارش کل باکتری‌های هوازی (TVC) و کلی‌فرم‌ها',
        findings: 'سقف مجاز بار میکروبی کل در آبزیان تازه حداکثر log 6.0 CFU/g تعیین گردیده است.',
        limitations: 'روش‌های سنتی کشت نیازمند ۷۲ ساعت انکوباسیون هستند و وضعیت زنده‌مانی باکتری‌های VBNC را نشان نمی‌دهند.',
        isVerifiedAuthentic: true,
        sourceRegistryId: 'src-inso-2408',
        citationText: 'سازمان ملی استاندارد ایران (۱۳۹۸). استاندارد ملی شماره ۲۴۰۸.'
      },
      {
        id: 'lit-3',
        title: 'سینتیک تخریب حرارتی ترکیبات پلی‌فنولی و آنتی‌اکسیدانی در سامانه‌های فرآوری',
        authors: ['García-Villanova, R.', 'Gómez-Caravaca, A. M.', 'Verardo, V.'],
        year: '2021',
        sourceType: 'scientific_paper',
        doiOrStandardNo: '10.1016/j.foodchem.2021.129450',
        foodMatrix: 'ترکیبات فنولی و فلاونوئیدها',
        methodology: 'کروماتوگرافی مایع با کارایی بالا متصل به آشکارساز آرایه دیودی (HPLC-DAD)',
        keyVariables: 'نرخ تخریب کینتیکی درجه یک، انرژی فعال‌سازی آرنیوس',
        findings: 'پوشش‌های بیوپلیمری می‌توانند اتلاف اکسیداتیو ترکیبات فنولی را تا ۴۵٪ کاهش دهند.',
        limitations: 'تأثیر متقابل ماتریکس لیپیدی بر ضریب نفوذ ترکیبات فنولی مدل‌سازی نشده بود.',
        isVerifiedAuthentic: true,
        sourceRegistryId: 'src-paper-foodchem-2021',
        citationText: 'García-Villanova et al. (2021). Food Chemistry, 129450.'
      }
    ],
    results: 'فیلم‌های حاوی ۱٪ نانوذرات اکسید روی و ۱٪ اسانس آویشن شیرازی، نرخ نفوذپذیری بخار آب (WVP) را به میزان ۳۸٪ نسبت به فیلم شاهد کیتوزان کاهش دادند. در روز ۱۶ نگهداری، شاخص TVB-N در نمونه‌های بسته‌بندی شده با نانوبیوکامپوزیت معادل ۱۹.۸ میلی‌گرم ازت در ۱۰۰ گرم ثبت شد که به طور معنی‌داری کمتر از حد فساد (۲۵ میلی‌گرم) و بسیار پایین‌تر از تیمار شاهد (۴۱.۵ میلی‌گرم) در روز ۸ بود.',
    discussion: 'کاهش نرخ تشکیل پراکسید ناشی از خاصیت مهارکنندگی رادیکال‌های آزاد توسط ترکیبات تیمول و کارواکرول موجود در اسانس آویشن است. نانوذرات ZnO به عنوان مسدودکننده‌های فیزیکی در ماتریکس کیتوزان، مسیر نفوذ اکسیژن و رطوبت را پرپیچ‌وخم (Tortuous Path) نموده و از طریق ایجاد تنش اکسیداتیو در غشای باکتری‌ها از طریق تولید گونه‌های فعال اکسیژن (ROS)، رشد باکتری‌های فسادزا را به تأخیر انداختند.',
    conclusion: 'بسته‌بندی فعال زیستی متشکل از نانوکامپوزیت کیتوزان/ZnO/اسانس آویشن توانایی افزایش عمر ماندگاری فیله قزل‌آلا را تا حدود ۱۶ روز در دمای یخچال بدون تغییر نامطلوب در ویژگی‌های حسی دارا می‌باشد و می‌تواند جایگزین ایمنی برای فیلم‌های پلاستیکی غیرتخریب‌پذیر باشد.',
    weaknessesAndLimitations: [
      {
        id: 'weak-1',
        aspect: 'instrumental_validation',
        aspectTitleFa: 'آزمون مهاجرت نانوذرات روی (Zn Migration)',
        severity: 'critical',
        identifiedIssueFa: 'میزان نشت و مهاجرت احتمالی یون‌های Zn2+ یا نانوذرات اکسید روی از لایه فیلم به بافت مرطوب فیله ماهی بر اساس موازین ایمنی غذایی EFSA سنجیده نشده است.',
        correctiveRecommendationFa: 'انجام آزمون مهاجرت کلی و اختصاصی روی با دستگاه جذب اتمی (AAS) یا طیف‌سنج پلاسمای جفت‌شده القایی (ICP-MS) در شبیه‌سازهای غذایی بر پایه استاندارد EN 1186.',
        scientificReference: 'EFSA Panel on Food Contact Materials, 2020'
      },
      {
        id: 'weak-2',
        aspect: 'sensory_panel_bias',
        aspectTitleFa: 'حجم پانل ارزیابی حسی',
        severity: 'moderate',
        identifiedIssueFa: 'آزمون پذیرش حسی فقط توسط پانل کوچک ۱۰ نفره انجام شده که از نظر آزمون‌های مصرف‌کننده (Consumer Test) اعتبار تعمیم‌دهی پایینی دارد.',
        correctiveRecommendationFa: 'افزایش تعداد ارزیاب‌ها به حداقل ۳۰ تا ۵۰ نفر غیرآموزش‌دیده برای آزمون پذیرش کلی (Acceptance Test) به موازات پانل تخصصی ۱۰ نفره آزمون توصیفی (QDA).'
      }
    ],
    suggestedExperiments: [
      {
        id: 'exp-sug-1',
        category: 'spectroscopic_chromatography',
        categoryTitleFa: 'طیف‌سنجی نوری و کینتیک رهایش',
        testNameFa: 'آنالیز رهایش اسانس با اسپکتروفتومتری UV-Vis',
        testNameEn: 'Controlled Release Kinetics of Essential Oil',
        standardReference: 'روش کینتیکی Korsmeyer-Peppas',
        recommendedEquipment: 'اسپکتروفتومتر دوپرتو UV-Vis با سیستم دمایی پلوتیه',
        processConditions: 'شبیه‌ساز اتانول ۵۰٪ در دمای ۴ و ۲۵ درجه سلسیوس',
        targetParameter: 'ضریب انتشار (Diffusion Coefficient) و توان رهایش n',
        justificationFa: 'مشخص شدن مکانیزم نفوذ اسانس (Fickian یا غیر فیکی) برای تعیین عمر مفید بسته‌بندی فعال.'
      },
      {
        id: 'exp-sug-2',
        category: 'rheological_texture',
        categoryTitleFa: 'بافت‌سنجی مکانیکی',
        testNameFa: 'آزمون پروفایل بافت (TPA) عضله ماهی',
        testNameEn: 'Texture Profile Analysis (TPA) of Fish Muscle',
        standardReference: 'ISO 11036 / دستگاهی',
        recommendedEquipment: 'دستگاه بافت‌سنج (Texture Analyzer) با پروب استوانه‌ای P/36R',
        processConditions: 'تست دو مرحله‌ای با فشردگی ۵۰٪ در سرعت ۱ میلی‌متر بر ثانیه',
        targetParameter: 'سختی (Hardness)، چسبندگی (Cohesiveness) و جهندگی (Springiness)',
        justificationFa: 'پایش حفظ ساختار میوفیبریلی و جلوگیری از نرمی عضله بر اثر فعالیت پروتئولیتیک اتولیتیک و باکتریایی.'
      }
    ],
    tags: ['نانوبیوتکنولوژی', 'بسته‌بندی فعال', 'کیتوزان', 'قزل‌آلا', 'اسانس آویشن', 'ZnO']
  },
  {
    id: 'proj-dairy-synbiotic-02',
    title: 'بهینه‌سازی فرمولاسیون ماست همزده سین‌بیوتیک کم‌چرب با استفاده از اینولین و صمغ دانه بارهنگ به روش سطح پاسخ (RSM)',
    englishTitle: 'Optimization of low-fat synbiotic stirred yogurt formulation using inulin and Plantago major seed gum by Response Surface Methodology (RSM)',
    academicLevel: 'master',
    category: 'dairy',
    createdAt: '2024-02-10T09:00:00.000Z',
    updatedAt: '2024-03-12T11:00:00.000Z',
    status: 'proposal_ready',
    problemStatement: 'حذف یا کاهش چربی در ماست به افت شدید قوام، افزایش پدیده آب‌اندازی (Syneresis) و کاهش رضایت حسی می‌انجامد. استفاده از پری‌بیوتیک‌های زنجیره‌بلند نظیر اینولین در کنار هیدروکلوئیدهای بومی نظیر صمغ دانه بارهنگ می‌تواند به عنوان جایگزین چربی عمل نموده و همزمان بقای سویه‌های پروبیوتیک مانند Bifidobacterium lactis را در طول زمان نگهداری در یخچال تضمین کند.',
    researchQuestions: [
      'چه ترکیبی از اینولین و صمغ بارهنگ می‌تواند کمترین میزان آب‌اندازی و بیشترین ویسکوزیته ظاهری را بدون ایجاد طعم گچی ایجاد کند؟',
      'آیا هیدروکلوئید بارهنگ اثر محافظتی در برابر تنش اسیدی بر بقای بیفیدوباکتریوم دارد؟'
    ],
    objectives: {
      mainObjective: 'بهینه‌سازی غلظت اینولین و صمغ بارهنگ در ماست کم‌چرب سین‌بیوتیک و بررسی ماندگاری و بقای باکتری پروبیوتیک طی ۲۸ روز.',
      specificObjectives: [
        'مدل‌سازی سینرزیس و ویسکوزیته ظاهری با طرح آماری سطح پاسخ (CCD)',
        'پایش شمارش باکتری‌های پروبیوتیک در روزهای ۱، ۷، ۱۴، ۲۱ و ۲۸ بر اساس استاندارد INSO 19579',
        'ارزیابی رفتارهای رئولوژیکی جریان (مدل هرشل-بالکلی و قانون توان)'
      ]
    },
    hypotheses: {
      nullHypothesis: 'افزودن اینولین و صمغ بارهنگ تأثیری بر ویسکوزیته و بقای پروبیوتیک در ماست کم‌چرب ندارد.',
      alternativeHypothesis: 'برهمکنش هم‌افزای اینولین (۱.۵٪) و صمغ بارهنگ (۰.۱۵٪) باعث کاهش بیش از ۶۰ درصدی آب‌اندازی و حفظ جمعیت پروبیوتیک در حد استاندارد (> 10^7 CFU/g) می‌شود.'
    },
    variables: [
      {
        id: 'v-d-1',
        name: 'غلظت اینولین',
        type: 'independent',
        unit: 'درصد وزنی (% w/w)',
        levelsOrRange: '۰.۵ الی ۲.۵ درصد',
        description: 'اینولین با درجه پلیمریزاسیون بالا (DP > 23)'
      },
      {
        id: 'v-d-2',
        name: 'غلظت صمغ دانه بارهنگ',
        type: 'independent',
        unit: 'درصد وزنی (% w/w)',
        levelsOrRange: '۰.۰۵ الی ۰.۲۵ درصد',
        description: 'صمغ استخراج‌شده به روش هیدروترمال و خشک‌شده در آون تحت خلاء'
      },
      {
        id: 'v-d-3',
        name: 'میزان آب‌اندازی (Syneresis)',
        type: 'dependent',
        unit: 'درصد (%)',
        measurementMethod: 'سانتریفیوژ نمونه در ۳۰۰۰ دور به مدت ۱۵ دقیقه در ۴ درجه',
        description: 'سنجش خروج سرم از ژل کازئین'
      },
      {
        id: 'v-d-4',
        name: 'بقای بیفیدوباکتریوم لاکتیس',
        type: 'dependent',
        unit: 'log CFU/g',
        measurementMethod: 'کشت در محیط اختصاصی TOS-MUP آگار در شرایط بی‌هوازی',
        description: 'حداقل حد استاندارد کدکس 10^6 و ترجیحاً 10^7 CFU/g'
      }
    ],
    populationAndSample: {
      targetMatrix: 'شیر گاو پاستوریزه کم‌چرب (۱.۰٪ چربی و ماده خشک بدون چربی ۸.۵٪)',
      sampleSize: '۱۳ تیمار فرمولاسیونی با ۳ تکرار برای آزمون‌ها',
      samplingMethod: 'تولید ماست در شرایط بهداشتی پایلوت لبنی با استارتر تجاری YC-X11',
      storageConditions: 'نگهداری در ظروف پلی‌پروپیلنی در دمای ۴ درجه سلسیوس'
    },
    researchMethodology: {
      designType: 'طرح مرکب مرکزی چرخش‌پذیر (Central Composite Rotatable Design - CCRD)',
      samplingTimeline: 'روزهای ۱، ۷، ۱۴، ۲۱ و ۲۸ نگهداری',
      dataAnalysisMethod: 'برازش مدل چندجمله‌ای درجه دو و بهینه‌سازی عددی بر اساس تابع مطلوبیت (Desirability Function)',
      experimentalDesign: {
        designType: 'rsm_ccd',
        designNameFa: 'طرح مرکب مرکزی (CCD) با ۲ فاکتور در ۵ سطح',
        factorsCount: 2,
        factorsSummary: 'اینولین (۵ سطح) و صمغ بارهنگ (۵ سطح)',
        responsesSummary: 'آب‌اندازی، ویسکوزیته ظاهری، اسیدیته دورنیک، بقای پروبیوتیک، پذیرش حسی',
        totalRuns: 13,
        replications: 5,
        statisticalModelFa: 'Y = β0 + β1X1 + β2X2 + β11X1^2 + β22X2^2 + β12X1X2',
        softwareRecommended: 'Design-Expert 13',
        anovaProcedureFa: 'آنالیز رگرسیون گام‌به‌گام و بررسی عدم برازش (Lack of Fit)'
      }
    },
    experimentalProcedures: 'آماده‌سازی شیر کم‌چرب، افزودن صمغ و اینولین در دمای ۵۵ درجه با همزن مکانیکی، هموژنیزاسیون در فشار ۱۵۰ بار، پاستوریزاسیون حرارتی در ۹۰ درجه به مدت ۵ دقیقه، خنک‌سازی تا ۴۲ درجه، تلقیح کشت ماست و پروبیوتیک، گرم‌خانه‌گذاری تا رسیدن به pH معادل ۴.۶۰، خنک‌سازی و نگهداری.',
    literatureReview: [
      {
        id: 'lit-d-1',
        title: 'شیر پاستوریزه و ویژگی‌های شیمیایی و فیزیکی فرآورده‌های شیری',
        authors: ['سازمان ملی استاندارد ایران (INSO)'],
        year: '1394',
        sourceType: 'inso_standard',
        doiOrStandardNo: 'INSO 2406:1394',
        foodMatrix: 'شیر گاو فرآوری‌شده',
        methodology: 'روش‌های رسمی تعیین چربی ژربر، اسیدیته دورنیک و ماده خشک تام',
        keyVariables: 'چربی، اسیدیته، ماده خشک بدون چربی',
        findings: 'حداقل ماده خشک بدون چربی برای پایه تولید ماست استاندارد الزامی است.',
        limitations: 'تعریف فرمولاسیون‌های تغلیظ‌شده با فیبرهای پری‌بیوتیک در آن قید نشده است.',
        isVerifiedAuthentic: true,
        sourceRegistryId: 'src-inso-2406',
        citationText: 'استاندارد ملی ایران شماره ۲۴۰۶ (۱۳۹۴).'
      }
    ],
    results: 'نقطه بهینه فرمولاسیون در غلظت ۱.۸٪ اینولین و ۰.۱۲٪ صمغ بارهنگ به دست آمد. در این نقطه، میزان آب‌اندازی از ۳۲٪ در نمونه شاهد به کمتر از ۱۱٪ کاهش یافت و جمعیت بیفیدوباکتریوم لاکتیس پس از ۲۸ روز نگهداری در حد مطلوب 7.4 log CFU/g حفظ گردید.',
    discussion: 'اینولین با تشکیل میکروکریستال‌های شبکه‌ای مشابه گلبول‌های چربی عمل کرده و احساس دهانی خامه‌ای را بازسازی می‌کند. صمغ بارهنگ با اتصال قوی به فاز آبی آزاد و تشکیل کمپلکس الکترواستاتیک با میسل‌های کازئین، ماتریکس سه بعدی ژل را پایدار می‌نماید.',
    conclusion: 'تلفیق اینولین و صمغ بارهنگ به عنوان پایدارکننده طبیعی و جایگزین چربی، امکان تولید ماست سین‌بیوتیک تجاری با ویژگی‌های حسی ممتاز و ماندگاری ۲۸ روزه را فراهم می‌آورد.',
    weaknessesAndLimitations: [
      {
        id: 'w-d-1',
        aspect: 'kinetic_modeling',
        aspectTitleFa: 'مدل‌سازی کینتیک مرگ پروبیوتیک',
        severity: 'moderate',
        identifiedIssueFa: 'کینتیک افت جمعیت پروبیوتیک در طول ۲۸ روز با مدل‌های خطی یا غیرخطی نظیر مدل ویبل (Weibull) شبیه‌سازی نشده است.',
        correctiveRecommendationFa: 'محاسبه پارامترهای کینتیکی و زمان نیمه‌عمر بقا با برازش مدل Weibull.'
      }
    ],
    suggestedExperiments: [
      {
        id: 'exp-d-1',
        category: 'rheological_texture',
        categoryTitleFa: 'رئومتری پیشرفته',
        testNameFa: 'رئومتری نوسانی دینامیک (SAOS)',
        testNameEn: 'Small Amplitude Oscillatory Shear Rheology',
        standardReference: 'روش استاندارد بین‌المللی رئومتری ژل‌های پروتئینی',
        recommendedEquipment: 'رئومتر تنش-کنترل (Stress-Controlled Rheometer) با هندسه Cone & Plate',
        processConditions: 'سنجش مدول ذخیره G و مدول افت G در کرنش خطی ۰.۵٪ و فرکانس ۰.۱ تا ۱۰ هرتز',
        targetParameter: 'مدول الاستیک G prime و تانژانت افت tan delta',
        justificationFa: 'تعیین دقیق مقاومت شبکه ساختاری ژل ماست و رفتار ویسکوالاستیک در تنش‌های برشی.'
      }
    ],
    tags: ['لبنیات', 'ماست سین‌بیوتیک', 'پروبیوتیک', 'اینولین', 'صمغ بارهنگ', 'RSM']
  }
];
