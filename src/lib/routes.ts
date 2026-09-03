import { NavItem, QuickAccessItem } from '../types';

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    title: 'داشبورد اصلی',
    englishTitle: 'Dashboard',
    path: '/',
    iconName: 'LayoutDashboard',
    description: 'نمای کلی سامانه و دسترسی به کلیه بخش‌های هوش مصنوعی صنایع غذایی',
    category: 'core',
    phase: 1
  },
  {
    id: 'chat',
    title: 'چت هوشمند',
    englishTitle: 'Smart AI Chat',
    path: '/chat',
    iconName: 'MessageSquare',
    description: 'مشاوره تخصصی فرمولاسیون، فناوری فرآوری و عیب‌یابی خطوط تولید',
    category: 'core',
    phase: 3
  },
  {
    id: 'laboratory',
    title: 'آزمایشگاه تخصصی',
    englishTitle: 'Laboratory',
    path: '/laboratory',
    iconName: 'FlaskConical',
    description: 'ثبت، ارزیابی و آنالیزهای میکروبی، شیمیایی و حسی مواد غذایی',
    category: 'lab',
    phase: 4
  },
  {
    id: 'experiments',
    title: 'مدیریت آزمایش‌ها',
    englishTitle: 'Experiments & Trials',
    path: '/experiments',
    iconName: 'TestTubes',
    description: 'پروتکل‌های آزمون، طراحی آزمایش‌ها (DoE) و لاگ‌های تست',
    category: 'lab',
    phase: 5
  },
  {
    id: 'standards',
    title: 'استانداردها',
    englishTitle: 'Standards (INSO & Codex)',
    path: '/standards',
    iconName: 'ShieldCheck',
    description: 'پایگاه استانداردهای ملی ایران، کدکس بین‌المللی و الزامات بهداشتی',
    category: 'knowledge',
    phase: 6
  },
  {
    id: 'products',
    title: 'محصولات و فرمولاسیون',
    englishTitle: 'Products & Formulation',
    path: '/products',
    iconName: 'Boxes',
    description: 'طراحی فرمولاسیون صنعتی، بالانس درصد مواد و مدیریت محصول',
    category: 'core',
    phase: 7
  },
  {
    id: 'calculations',
    title: 'محاسبات مهندسی',
    englishTitle: 'Calculations & Unit Ops',
    path: '/calculations',
    iconName: 'Calculator',
    description: 'محاسبات ارزش غذایی، فعالیت آبی (aw)، مربع پیرسون و فرایندهای حرارتی',
    category: 'core',
    phase: 8
  },
  {
    id: 'equipment',
    title: 'تجهیزات و دستگاه‌ها',
    englishTitle: 'Equipment & Metrology',
    path: '/equipment',
    iconName: 'Wrench',
    description: 'کاتالوگ تجهیزات آزمایشگاهی، دستورالعمل کاربری (SOP) و کالیبراسیون',
    category: 'lab',
    phase: 9
  },
  {
    id: 'reagents',
    title: 'مواد و محلول‌سازی',
    englishTitle: 'Reagents & Solutions',
    path: '/reagents',
    iconName: 'Pipette',
    description: 'بانک مواد شیمیایی، برگه‌های ایمنی SDS، رفرنس‌های CAS و محاسبات محلول‌سازی دقیق',
    category: 'lab',
    phase: 13
  },
  {
    id: 'troubleshooting',
    title: 'عیب‌یابی آزمایشگاهی',
    englishTitle: 'Laboratory Troubleshooting',
    path: '/troubleshooting',
    iconName: 'AlertTriangle',
    description: 'سیستم استنتاجی ریشه‌یابی خطاهای آزمایشگاه، علل، نشانه‌ها، اقدام اصلاحی و CAPA',
    category: 'lab',
    phase: 15
  },
  {
    id: 'microbiology',
    title: 'میکروبیولوژی مواد غذایی',
    englishTitle: 'Food Microbiology',
    path: '/microbiology',
    iconName: 'Microscope',
    description: 'بانک آزمون‌های میکروبی، میکروارگانیسم‌ها، محیط‌های کشت، رقت‌سازی، شمارش، MPN و کنترل کیفیت',
    category: 'lab',
    phase: 16
  },
  {
    id: 'food-chemistry',
    title: 'شیمی و آنالیز مواد غذایی',
    englishTitle: 'Food Chemistry & Analysis',
    path: '/food-chemistry',
    iconName: 'Atom',
    description: 'آزمون‌های شیمیایی، ترکیبات اصلی (رطوبت، خاکستر، پروتئین، چربی، فیبر، قندها، اسیدیته، نمک، بریکس، رنگدانه‌ها و آنتی‌اکسیدان‌ها)',
    category: 'lab',
    phase: 17
  },
  {
    id: 'quality-control',
    title: 'کنترل و تضمین کیفیت (QA/QC)',
    englishTitle: 'Quality Control & QA',
    path: '/quality-control',
    iconName: 'ShieldCheck',
    description: 'مدیریت نمونه‌ها، بهمن‌ها، ردیابی کالیبراسیون و معرف، حدود مجاز استاندارد، نمودار شوهارت، تحلیل روند SPC و مدیریت CAPA',
    category: 'lab',
    phase: 18
  },
  {
    id: 'sources',
    title: 'منابع علمی',
    englishTitle: 'Scientific Sources',
    path: '/sources',
    iconName: 'BookOpen',
    description: 'مقالات علمی معتبر، کتاب‌های مرجع صنایع غذایی و پایگاه دانش',
    category: 'knowledge',
    phase: 10
  },
  {
    id: 'settings',
    title: 'تنظیمات سیستم',
    englishTitle: 'System Settings',
    path: '/settings',
    iconName: 'Settings',
    description: 'پیکربندی محیط، زبان، پوسته و ترجیحات کاربری',
    category: 'system'
  }
];

export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: 'chat',
    title: 'چت هوشمند',
    englishTitle: 'Smart AI Assistant',
    path: '/chat',
    iconName: 'MessageSquare',
    description: 'مشاوره تخصصی فرمولاسیون، فناوری فرآوری و پاسخ‌دهی به چالش‌های خط تولید',
    category: 'core',
    accentColor: 'emerald',
    badge: 'هسته هوشمند'
  },
  {
    id: 'laboratory',
    title: 'آزمایشگاه تخصصی',
    englishTitle: 'Specialized Lab',
    path: '/laboratory',
    iconName: 'FlaskConical',
    description: 'ثبت، ارزیابی و آنالیزهای میکروبیولوژی، فیزیکوشیمیایی و ارگانولپتیک',
    category: 'lab',
    accentColor: 'teal',
    badge: 'کنترل کیفیت'
  },
  {
    id: 'experiments',
    title: 'مدیریت آزمایش‌ها',
    englishTitle: 'Experimental Trials',
    path: '/experiments',
    iconName: 'TestTubes',
    description: 'پروتکل‌های استاندارد آزمون، طراحی آزمایشات صنعتی و ثبت گزارش‌های تجربی',
    category: 'lab',
    accentColor: 'cyan',
    badge: 'پروتکل‌ها'
  },
  {
    id: 'standards',
    title: 'استانداردهای غذایی',
    englishTitle: 'National & Codex Standards',
    path: '/standards',
    iconName: 'ShieldCheck',
    description: 'پایگاه استانداردهای ملی ایران (INSO)، کدکس بین‌المللی، حدود مجاز و مقررات بهداشتی',
    category: 'knowledge',
    accentColor: 'amber',
    badge: 'مرجع استاندارد'
  },
  {
    id: 'products',
    title: 'محصولات و فرمولاسیون',
    englishTitle: 'Product Formulation',
    path: '/products',
    iconName: 'Boxes',
    description: 'طراحی فرمولاسیون، بالانس مواد خشک، افزودنی‌ها و بهینه‌سازی بافت و طعم',
    category: 'core',
    accentColor: 'indigo',
    badge: 'فرمولاسیون'
  },
  {
    id: 'calculations',
    title: 'محاسبات مهندسی',
    englishTitle: 'Engineering Calculators',
    path: '/calculations',
    iconName: 'Calculator',
    description: 'محاسبات ارزش غذایی، فعالیت آبی، مربع پیرسون و پاستوریزاسیون/استریلیزاسیون',
    category: 'core',
    accentColor: 'blue',
    badge: 'محاسبات تخصصی'
  },
  {
    id: 'equipment',
    title: 'تجهیزات و دستگاه‌ها',
    englishTitle: 'Lab Equipment & SOPs',
    path: '/equipment',
    iconName: 'Wrench',
    description: 'کاتالوگ تجهیزات آزمایشگاهی، دستورالعمل‌های کار با دستگاه و پایش کالیبراسیون',
    category: 'lab',
    accentColor: 'rose',
    badge: 'تجهیزات'
  },
  {
    id: 'reagents',
    title: 'مواد و محلول‌سازی',
    englishTitle: 'Reagents & Solution Prep',
    path: '/reagents',
    iconName: 'Pipette',
    description: 'بانک معرف‌ها، محاسبات غلظت و حجم، پروتکل‌های استانداردسازی و چاپ لیبل GHS',
    category: 'lab',
    accentColor: 'emerald',
    badge: 'محلول‌سازی'
  },
  {
    id: 'troubleshooting',
    title: 'عیب‌یابی آزمایشگاهی',
    englishTitle: 'Lab Troubleshooting & CAPA',
    path: '/troubleshooting',
    iconName: 'AlertTriangle',
    description: 'ریشه‌یابی علمی خطاها در ۱۱ دسته‌بندی با استناد به مراجع استاندارد و اقدامات اصلاحی',
    category: 'lab',
    accentColor: 'rose',
    badge: 'ISO 17025'
  },
  {
    id: 'microbiology',
    title: 'میکروبیولوژی مواد غذایی',
    englishTitle: 'Food Microbiology Lab',
    path: '/microbiology',
    iconName: 'Microscope',
    description: 'بانک جامع آزمون‌ها، محیط‌های کشت، رقت‌سازی، شمارش ISO 7218، جداول MPN و کنترل کیفیت',
    category: 'lab',
    accentColor: 'teal',
    badge: 'میکروبیولوژی'
  },
  {
    id: 'food-chemistry',
    title: 'شیمی مواد غذایی',
    englishTitle: 'Food Chemistry & Analysis',
    path: '/food-chemistry',
    iconName: 'Atom',
    description: 'آزمون‌های شیمیایی استاندارد INSO/AOAC: پروتئین، چربی، رطوبت، فیبر، اسیدیته، نمک، بریکس، رنگدانه‌ها و آنتی‌اکسیدان‌ها',
    category: 'lab',
    accentColor: 'indigo',
    badge: 'شیمی و آنالیز'
  },
  {
    id: 'quality-control',
    title: 'کنترل و تضمین کیفیت',
    englishTitle: 'QA/QC Management',
    path: '/quality-control',
    iconName: 'ShieldCheck',
    description: 'پایش بهمن و نمونه‌ها، ثبت تکرارها، ردیابی کالیبراسیون، نمودار شوهارت، SPC و اقدامات اصلاحی (CAPA)',
    category: 'lab',
    accentColor: 'blue',
    badge: 'قسمت ۱۸ (QA/QC)'
  },
  {
    id: 'sources',
    title: 'منابع علمی و مقالات',
    englishTitle: 'Scientific Literature',
    path: '/sources',
    iconName: 'BookOpen',
    description: 'مجلات و مقالات معتبر، مراجع دانشگاهی صنایع غذایی و مستندات فنی',
    category: 'knowledge',
    accentColor: 'violet',
    badge: 'دانشنامه'
  }
];
