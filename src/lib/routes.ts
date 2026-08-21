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
