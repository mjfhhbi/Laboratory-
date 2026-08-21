import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { QUICK_ACCESS_ITEMS } from '../lib/routes';
import { QuickAccessCard } from '../components/common/QuickAccessCard';
import { StatCard } from '../components/common/StatCard';
import { PwaInstallPrompt } from '../components/common/PwaInstallPrompt';
import { getStorageStatistics } from '../lib/storage';
import { StorageStats } from '../types';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Activity,
  Info,
  LayoutGrid,
  Database,
  Wifi,
  Smartphone,
  HardDrive
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<StorageStats | null>(null);

  useEffect(() => {
    getStorageStatistics().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="داشبورد سامانه هوش مصنوعی صنایع غذایی"
        englishTitle="Food Science AI Dashboard"
        description="مرکز یکپارچه دسترسی به دستیار هوشمند، آزمایشگاه کنترل کیفیت، پایگاه استانداردها، فرمولاسیون و محاسبات مهندسی با پشتیبانی کامل آفلاین"
        badgeText="بخش ۳: سیستم آفلاین و PWA"
      />

      {/* PWA Install Banner */}
      <PwaInstallPrompt />

      {/* System Status & Architecture Overview Banner */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100 dark:border-stone-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                پلتفرم هوشمند صنایع غذایی با معماری مقاوم آفلاین (Offline First)
              </h2>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
              این سامانه با استفاده از سرویس‌ورکر (Service Worker)، وب‌اپ مانیفست (PWA) و پایگاه داده محلی IndexedDB طراحی شده است تا دسترسی به تمامی صفحات، گفتگوها، تنظیمات و پایگاه دانش حتی بدون اینترنت به طور پایدار تضمین شود.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>فاز ۳ فعال (PWA & Offline)</span>
            </div>
            <Link
              to="/settings"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-lg transition-colors border border-stone-200 dark:border-stone-700"
            >
              <span>تنظیمات و پایگاه داده</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Key Architecture Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5">
          <StatCard
            label="وضعیت وب‌اپلیکیشن (PWA)"
            value="Service Worker Active"
            subtext="Cache-First App Shell"
            iconName="Smartphone"
            statusVariant="emerald"
          />
          <StatCard
            label="پایگاه داده محلی (IndexedDB)"
            value={`${stats ? stats.conversationsCount + stats.knowledgeItemsCount : '4+'} رکورد محلی`}
            subtext="Settings, Chats, Knowledge"
            iconName="Database"
            statusVariant="blue"
          />
          <StatCard
            label="پایش ارتباط زنده شبکه"
            value="Realtime Listener"
            subtext="Online / Offline Auto-Detect"
            iconName="Wifi"
            statusVariant="amber"
          />
          <StatCard
            label="پایگاه دانش آفلاین"
            value="آماده استانداردها"
            subtext="Offline-Ready Schema"
            iconName="Layers"
            statusVariant="stone"
          />
        </div>
      </div>

      {/* Quick Access Cards Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                کارت‌های دسترسی سریع به ماژول‌های سامانه
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              تمامی ماژول‌ها دارای ساختار کش‌شده و در حالت آفلاین در دسترس هستند
            </p>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-md border border-stone-200 dark:border-stone-700/60 self-start sm:self-auto" dir="ltr">
            Offline Ready (8 Modules)
          </span>
        </div>

        {/* 8 Quick Access Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACCESS_ITEMS.map((item) => (
            <QuickAccessCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Architecture & Engineering Guidelines Notice */}
      <div className="p-4 rounded-xl bg-stone-100/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-stone-600 dark:text-stone-400">
          <p className="font-semibold text-stone-800 dark:text-stone-200">
            معماری پایگاه داده محلی و قابلیت استفاده آفلاین پایگاه دانش
          </p>
          <p className="leading-relaxed">
            در این فاز ساختار داده‌های محلی IndexedDB به صورت مستقل در <code className="font-mono text-emerald-700 dark:text-emerald-400">src/lib/storage</code> پیاده‌سازی شده است. جداول تنظیمات، مکالمات، صف همگام‌سازی و پایگاه دانش (شامل استانداردهای INSO و روش‌های آزمون AOAC) با پشتیبانی کامل از کارکرد آفلاین آماده‌سازی شده‌اند.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
