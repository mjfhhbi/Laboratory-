import { NavItem, QuickAccessItem } from '../types';

/**
 * 10 Core Architectural Pillars for Food Science AI
 * Grouped logically with sub-items preserving all existing deep links and workflows.
 */
export const NAVIGATION_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    title: 'خانه',
    englishTitle: 'Home / Overview',
    path: '/',
    iconName: 'LayoutDashboard',
    description: 'نمای کلی سامانه، وضعیت پایگاه داده محلی و دسترسی سریع به ارکان تخصصی',
    category: 'core'
  },
  {
    id: 'chat',
    title: 'دستیار هوشمند',
    englishTitle: 'AI Assistant',
    path: '/chat',
    iconName: 'MessageSquare',
    description: 'مشاوره تخصصی فرمولاسیون، فناوری فرآوری و حل چالش‌های خط تولید',
    category: 'core'
  },
  {
    id: 'laboratory',
    title: 'آزمایشگاه',
    englishTitle: 'Digital Laboratory',
    path: '/laboratory',
    iconName: 'FlaskConical',
    description: 'گردش کار اجرای آزمون، مدیریت نمونه‌ها، شیمی، میکروبیولوژی و کالیبراسیون',
    category: 'lab',
    subItems: [
      {
        id: 'lab-workflow',
        title: 'گردش کار آزمایشگاه',
        englishTitle: 'Lab Execution',
        path: '/laboratory',
        iconName: 'FlaskConical',
        description: 'جریان ۷ مرحله‌ای اجرای آزمون و صدور برگه رسمی آنالیز'
      },
      {
        id: 'experiments',
        title: 'مدیریت آزمایش‌ها',
        englishTitle: 'Protocols & SOP',
        path: '/experiments',
        iconName: 'TestTubes',
        description: 'پروتکل‌های مرجع، آماده‌سازی نمونه و چک‌لیست تجهیزات'
      },
      {
        id: 'microbiology',
        title: 'میکروبیولوژی مواد غذایی',
        englishTitle: 'Microbiology',
        path: '/microbiology',
        iconName: 'Microscope',
        description: 'بانک آزمون‌های میکروبی، رقت‌سازی و شمارش کلنی'
      },
      {
        id: 'food-chemistry',
        title: 'شیمی و آنالیز مواد غذایی',
        englishTitle: 'Food Chemistry',
        path: '/food-chemistry',
        iconName: 'Atom',
        description: 'آزمون‌های شیمیایی (پروتئین، چربی، رطوبت، خاکستر، نمک، بریکس)'
      },
      {
        id: 'equipment',
        title: 'تجهیزات و دستگاه‌ها',
        englishTitle: 'Equipment',
        path: '/equipment',
        iconName: 'Wrench',
        description: 'شناسنامه تجهیزات آزمایشگاهی، دقت سنجش و سوابق کالیبراسیون'
      },
      {
        id: 'reagents',
        title: 'مواد و محلول‌سازی',
        englishTitle: 'Reagents & SDS',
        path: '/reagents',
        iconName: 'Pipette',
        description: 'بانک مواد شیمیایی، فرمول‌های محلول‌سازی و نکات ایمنی'
      },
      {
        id: 'troubleshooting',
        title: 'عیب‌یابی آزمایشگاهی',
        englishTitle: 'Troubleshooting & CAPA',
        path: '/troubleshooting',
        iconName: 'AlertTriangle',
        description: 'ریشه‌یابی خطاهای رایج آزمون، اقدامات اصلاحی و ریشه‌ای'
      }
    ]
  },
  {
    id: 'calculations',
    title: 'محاسبات مهندسی',
    englishTitle: 'Engineering Calculations',
    path: '/calculations',
    iconName: 'Calculator',
    description: 'موازنه جرم، ارزش تغذیه‌ای، انتقال حرارت و تحلیل آماری DoE',
    category: 'engineering',
    subItems: [
      {
        id: 'scientific-data-center',
        title: 'مرکز جامع تحلیل داده و اعتبارسنجی',
        englishTitle: 'Scientific Data & Validation Center',
        path: '/calculations/data-center',
        iconName: 'BarChart2',
        description: 'تحلیل داده‌های آزمایشگاهی، ورود CSV/Excel، رگرسیون، ANOVA، انتشار عدم قطعیت و راستی‌آزمایی SciPy'
      },
      {
        id: 'packaging-engineering',
        title: 'مهندسی بسته‌بندی، نفوذ و ماندگاری',
        englishTitle: 'Packaging Engineering & Permeability',
        path: '/calculations/packaging',
        iconName: 'Package',
        description: 'محاسبه WVTR و OTR، نفوذ فیک، چندلایه‌ها، پیش‌بینی ماندگاری و آزمون مهاجرت INSO/EU'
      },
      {
        id: 'formulation-optimization',
        title: 'بهینه‌سازی فرمولاسیون (LP و سیمپلکس)',
        englishTitle: 'Least-Cost Formulation LP',
        path: '/calculations/optimization',
        iconName: 'Scale',
        description: 'حداقل‌سازی هزینه فرمول با برنامه‌ریزی خطی، موازنه جرم و رعایت استانداردهای INSO'
      },
      {
        id: 'freezing-thawing',
        title: 'انجماد و ذوب (پلانک و کللند)',
        englishTitle: 'Freezing, Thawing & Heat Transfer',
        path: '/calculations/freezing',
        iconName: 'Snowflake',
        description: 'محاسبه زمان انجماد (Plank, Cleland, Pham)، وارونگی هدایت در ذوب و کدهای SciPy'
      },
      {
        id: 'moisture-isotherms',
        title: 'ایزوترم‌های رطوبت (GAB و BET)',
        englishTitle: 'Moisture Sorption Isotherms',
        path: '/calculations/isotherms',
        iconName: 'Droplets',
        description: 'برازش مدل‌های GAB، BET، اسوین، اسمیت، لانگمویر و پلگ و محاسبه رطوبت تک‌لایه m0'
      },
      {
        id: 'thermal-processing',
        title: 'فرآیندهای حرارتی و کینتیک میکروبی',
        englishTitle: 'Thermal Processing & Kinetics',
        path: '/calculations/thermal',
        iconName: 'Flame',
        description: 'محاسبه D و z و F، زمان مرگ حرارتی، انتگرال‌گیری جنرال بیگلو و کدهای SciPy'
      },
      {
        id: 'rheology-fluids',
        title: 'رئولوژی و مکانیک سیالات لوله',
        englishTitle: 'Rheology & Pipe Hydraulics',
        path: '/calculations/rheology',
        iconName: 'Activity',
        description: 'برازش مدل‌های نیوتنی، قانون توان، بینگهام، هرشل-بالکلی و کاسون و هیدرولیک لوله'
      },
      {
        id: 'msc-advanced',
        title: 'محاسبات پیشرفته (کارشناسی ارشد)',
        englishTitle: 'M.Sc. Advanced Engineering',
        path: '/calculations/advanced',
        iconName: 'Sigma',
        description: 'حل عددی ODE/PDE، ماتریس‌ها، نیوتن-رافسون، پلانک، اواپراتور و SymPy'
      },
      {
        id: 'calc-engine',
        title: 'ماشین‌حساب فرمول‌ها و موازنه',
        englishTitle: 'Formulas & Conversions',
        path: '/calculations',
        iconName: 'Calculator',
        description: 'محاسبه ارزش غذایی، فعالیت آبی، مربع پیرسون و فرمول‌ساز'
      },
      {
        id: 'statistics',
        title: 'طراحی آزمایش و تحلیل آماری',
        englishTitle: 'DoE & Statistics',
        path: '/statistics',
        iconName: 'Sigma',
        description: 'آمار توصیفی، آزمون t، آنالیز واریانس (ANOVA) و رگرسیون'
      }
    ]
  },
  {
    id: 'python',
    title: 'محیط برنامه‌نویسی Python',
    englishTitle: 'Python Environment',
    path: '/python',
    iconName: 'Terminal',
    description: 'مدل‌سازی کینتیک، تحلیل داده، حل معادلات و اسکریپت‌های مهندسی مواد غذایی',
    category: 'engineering'
  },
  {
    id: 'standards',
    title: 'استانداردها و منابع',
    englishTitle: 'Standards & Sources',
    path: '/standards',
    iconName: 'ShieldCheck',
    description: 'استانداردهای ملی INSO، مراجع کدکس، کاتالوگ محصولات و مقالات علمی',
    category: 'knowledge',
    subItems: [
      {
        id: 'standards-hub',
        title: 'پایگاه استانداردها',
        englishTitle: 'All Standards',
        path: '/standards',
        iconName: 'ShieldCheck',
        description: 'جستجو و تطبیق با استانداردهای ملی و بین‌المللی'
      },
      {
        id: 'standards-iran',
        title: 'استانداردهای ملی ایران (INSO)',
        englishTitle: 'INSO National Standards',
        path: '/standards/iran',
        iconName: 'ShieldAlert',
        description: 'فهرست تفصیلی استانداردهای ملی سازمان ملی استاندارد ایران'
      },
      {
        id: 'food-products',
        title: 'بانک جامع محصولات غذایی',
        englishTitle: 'Products Catalog',
        path: '/food-products',
        iconName: 'Database',
        description: 'شناسنامه فنی ۱۷ گروه اصلی صنایع غذایی و الزامات کیفی'
      },
      {
        id: 'sources',
        title: 'مراجع علمی و مقالات',
        englishTitle: 'Scientific Literature',
        path: '/sources',
        iconName: 'BookOpen',
        description: 'کتاب‌های مرجع، پایگاه مقالات معتبر و اسناد استاندارد'
      }
    ]
  },
  {
    id: 'research',
    title: 'پژوهش و پایان‌نامه',
    englishTitle: 'Research & Thesis',
    path: '/research',
    iconName: 'GraduationCap',
    description: 'ساختاربندی پروپوزال، تدوین فرضیات، متغیرهای مستقل/وابسته و پیشینه پژوهش',
    category: 'knowledge'
  },
  {
    id: 'products',
    title: 'توسعه محصولات غذایی',
    englishTitle: 'Product Development',
    path: '/products',
    iconName: 'Boxes',
    description: 'استودیوی فرمولاسیون صنعتی، بالانس درصد مواد و تحلیل قیمت تمام‌شده',
    category: 'core'
  },
  {
    id: 'quality-control',
    title: 'کنترل کیفیت',
    englishTitle: 'Quality Control (QA/QC)',
    path: '/quality-control',
    iconName: 'CheckCircle2',
    description: 'پایش بچ‌های خط تولید، نمودارهای کنترل شوهارت، ثبت انحرافات و CAPA',
    category: 'lab'
  },
  {
    id: 'settings',
    title: 'تنظیمات',
    englishTitle: 'System Settings',
    path: '/settings',
    iconName: 'Settings',
    description: 'مدیریت پایگاه داده محلی IndexedDB، پشتیبان‌گیری، پوسته و ترجیحات',
    category: 'system'
  }
];

/**
 * 10 Quick Access Items on Dashboard matching the main architecture
 */
export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: 'chat',
    title: 'دستیار هوشمند',
    englishTitle: 'Smart AI Assistant',
    path: '/chat',
    iconName: 'MessageSquare',
    description: 'مشاوره فرمولاسیون، پردازش حرارتی و عیب‌یابی علمی خطوط تولید',
    category: 'core',
    accentColor: 'emerald',
    badge: 'هوش مصنوعی'
  },
  {
    id: 'laboratory',
    title: 'آزمایشگاه دیجیتال',
    englishTitle: 'Digital Laboratory',
    path: '/laboratory',
    iconName: 'FlaskConical',
    description: 'گردش کار ۷ مرحله‌ای آزمون، ثبت تکرارها و صدور برگه رسمی آنالیز (COA)',
    category: 'lab',
    accentColor: 'teal',
    badge: 'گردش کار'
  },
  {
    id: 'calculations',
    title: 'محاسبات مهندسی',
    englishTitle: 'Engineering Calculators',
    path: '/calculations',
    iconName: 'Calculator',
    description: 'موازنه جرم، ارزش تغذیه‌ای، فعالیت آبی (aw)، مربع پیرسون و فرمول‌ساز',
    category: 'core',
    accentColor: 'blue',
    badge: 'مهندسی'
  },
  {
    id: 'python',
    title: 'محیط برنامه‌نویسی Python',
    englishTitle: 'Python Scientific Env',
    path: '/python',
    iconName: 'Terminal',
    description: 'مدل‌سازی کینتیک، پیش‌بینی ماندگاری و محاسبات علمی با پایتون',
    category: 'core',
    accentColor: 'cyan',
    badge: 'تحلیلی'
  },
  {
    id: 'experiments',
    title: 'مدیریت آزمایش‌ها و پروتکل‌ها',
    englishTitle: 'Experiments & SOPs',
    path: '/experiments',
    iconName: 'TestTubes',
    description: 'پروتکل‌های استاندارد آزمون، آماده‌سازی نمونه و چک‌لیست تجهیزات',
    category: 'lab',
    accentColor: 'indigo',
    badge: 'پروتکل‌ها'
  },
  {
    id: 'standards',
    title: 'استانداردها و مراجع (INSO)',
    englishTitle: 'National & Codex Standards',
    path: '/standards',
    iconName: 'ShieldCheck',
    description: 'پایگاه استانداردهای ملی ایران، کدکس بین‌المللی و حدود مجاز قانونی',
    category: 'knowledge',
    accentColor: 'amber',
    badge: 'استانداردها'
  },
  {
    id: 'research',
    title: 'پژوهش و پایان‌نامه',
    englishTitle: 'Research & Thesis Studio',
    path: '/research',
    iconName: 'GraduationCap',
    description: 'طراحی فرضیات علمی، متغیرها، طرح آزمایشی و ماتریس پیشینه پژوهش',
    category: 'knowledge',
    accentColor: 'violet',
    badge: 'پژوهش'
  },
  {
    id: 'products',
    title: 'توسعه محصولات غذایی',
    englishTitle: 'Product Formulation',
    path: '/products',
    iconName: 'Boxes',
    description: 'طراحی فرمولاسیون صنعتی، بالانس بریکس/چربی و برآورد قیمت تمام‌شده',
    category: 'core',
    accentColor: 'rose',
    badge: 'فرمولاسیون'
  },
  {
    id: 'quality-control',
    title: 'کنترل کیفیت و SPC',
    englishTitle: 'Quality Control & QA',
    path: '/quality-control',
    iconName: 'CheckCircle2',
    description: 'پایش بچ‌های خط تولید، نمودارهای کنترل شوهارت، ثبت انحرافات و اقدامات اصلاحی',
    category: 'lab',
    accentColor: 'blue',
    badge: 'کنترل خط'
  },
  {
    id: 'settings',
    title: 'تنظیمات و پایگاه داده',
    englishTitle: 'Settings & Offline Storage',
    path: '/settings',
    iconName: 'Settings',
    description: 'وضعیت کش آفلاین، ۱۸ مخزن داده محلی IndexedDB و ترجیحات سیستم',
    category: 'system',
    accentColor: 'stone',
    badge: 'پیکربندی'
  }
];
