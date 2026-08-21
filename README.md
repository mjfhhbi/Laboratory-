# Food Science AI (سامانه هوشمند علوم و صنایع غذایی)

پلتفرم جامع و تخصصی هوش مصنوعی صنایع غذایی با معماری ماژولار و رابط کاربری کاملاً فارسی و راست‌چین (RTL).

---

## 📌 وضعیت پروژه
- **فاز جاری**: قسمت ۲ از ۱۰ (سیستم رابط کاربری، ناوبری، تم روشن/تاریک و داشبورد حرفه‌ای)
- **فناوری‌ها**: React / Next-style App Router Architecture, TypeScript, Tailwind CSS, Lucide Icons, Theme Provider

---

## 🌟 قابلیت‌های پیاده‌سازی‌شده در فاز ۲
1. **Sidebar حرفه‌ای و Responsive**: دسته‌بندی موضوعی بخش‌ها (هسته، آزمایشگاه، استانداردها، سیستم)، هایلایت مسیر فعال، سازگاری کامل با حالت موبایل و تبلت.
2. **ناوبری کامل (Navigation)**: اتصال روان میان تمامی ۱۰ بخش سامانه با Breadcrumb و اندیکاتورهای هوشمند.
3. **هدر حرفه‌ای (Header)**: دارای وضعیت زنده اتصال آنلاین / آفلاین (`OnlineStatusBadge`) و سوییچ تغییر پوسته.
4. **سیستم دارک‌مود و لایت‌مود (Dark & Light Mode)**: پشتیبانی از حالت‌های روشن، تاریک و پیرو سیستم عامل با ذخیره‌سازی در `localStorage`.
5. **داشبورد حرفه‌ای و کارت‌های دسترسی سریع**: کارت‌های تعاملی و ماژولار برای ۸ بخش کلیدی:
   - چت هوشمند (`/chat`)
   - آزمایشگاه تخصصی (`/laboratory`)
   - مدیریت آزمایش‌ها (`/experiments`)
   - استانداردهای غذایی (`/standards`)
   - محصولات و فرمولاسیون (`/products`)
   - محاسبات مهندسی (`/calculations`)
   - تجهیزات و دستگاه‌ها (`/equipment`)
   - منابع علمی و مقالات (`/sources`)
6. **معماری ماژولار و کامپوننت‌های Reusable**: بدون داده‌های علمی ساختگی یا APIهای نارس، آماده برای فازهای بعدی.

---

## 📂 ساختار پوشه‌ها
```text
src/
├── app/               # صفحات اصلی سامانه
│   ├── page.tsx       # داشبورد حرفه‌ای (Dashboard)
│   ├── chat/          # دستیار چت هوشمند (/chat)
│   ├── laboratory/    # آزمایشگاه تخصصی (/laboratory)
│   ├── experiments/   # مدیریت آزمایش‌ها (/experiments)
│   ├── standards/     # استانداردهای غذایی (/standards)
│   ├── products/      # فرمولاسیون و محصولات (/products)
│   ├── calculations/  # محاسبات مهندسی (/calculations)
│   ├── equipment/     # تجهیزات و دستگاه‌ها (/equipment)
│   ├── sources/       # منابع و مقالات (/sources)
│   └── settings/      # تنظیمات و تم (/settings)
├── components/        # کامپوننت‌های ماژولار و Reusable
│   ├── common/        # QuickAccessCard, StatCard, ThemeToggle, OnlineStatusBadge, PageHeader, EmptyState, IconHelper
│   └── layout/        # AppLayout, Sidebar, Header
├── lib/               # مدیریت تم، هوک وضعیت شبکه و تعاریف مسیرها
├── types/             # تایپ‌ها و اینترفیس‌های مقیاس‌پذیر TypeScript
└── data/              # لایه متادیتای سیستم
```

---

## 🚀 دستورات اجرا و بیلد
```bash
# اجرای محیط توسعه
npm run dev

# بررسی تایپ‌ها و استانداردهای کد
npm run lint

# بیلد نهایی پروژه
npm run build
```
