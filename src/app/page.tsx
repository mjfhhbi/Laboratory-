import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { QUICK_ACCESS_ITEMS } from '../lib/routes';
import { QuickAccessCard } from '../components/common/QuickAccessCard';
import { StatCard } from '../components/common/StatCard';
import { PwaInstallPrompt } from '../components/common/PwaInstallPrompt';
import { getStorageStatistics } from '../lib/storage';
import { StorageStats } from '../types';
import {
  FlaskConical,
  Calculator,
  Terminal,
  ArrowLeft,
  LayoutGrid,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<StorageStats | null>(null);

  useEffect(() => {
    getStorageStatistics().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Workspace Header */}
      <PageHeader
        title="میز کار مهندسی و علوم صنایع غذایی"
        englishTitle="Food Science & Engineering Workspace"
        description="سامانه یکپارچه پردازش، شبیه‌سازی کینتیک، آزمایشگاه دیجیتال، استانداردهای ملی و فرمولاسیون صنعتی با پشتیبانی کامل آفلاین"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/laboratory"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
            >
              <FlaskConical className="w-4 h-4" />
              <span>شروع آزمایش جدید</span>
            </Link>
            <Link
              to="/python"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-lg transition-colors"
            >
              <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>محیط Python</span>
            </Link>
          </div>
        }
      />

      {/* PWA Install Banner */}
      <PwaInstallPrompt />

      {/* Engineering System Status (Minimal, Zero Clutter) */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              وضعیت زیرساخت علمی و مهندسی سامانه
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              ذخیره‌سازی ۱۰۰٪ محلی، عدم وابستگی به سرور در شرایط آفلاین و موتور تحلیلی فعال
            </p>
          </div>

          <Link
            to="/settings"
            className="flex items-center gap-1 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors self-start md:self-auto"
          >
            <span>مدیریت پایگاه داده و تنظیمات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Clean Engineering Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4">
          <StatCard
            label="معماری کلاینت PWA"
            value="فعال و آماده"
            subtext="Service Worker Caching"
            iconName="Smartphone"
            statusVariant="emerald"
          />
          <StatCard
            label="پایگاه محلی IndexedDB"
            value={`${stats?.activeStoresCount ?? 18} مخزن فعال`}
            subtext={stats ? `${stats.totalRecordsCount} رکورد ذخیره‌شده محلی` : 'ذخیره آزمون‌ها و استانداردها'}
            iconName="Database"
            statusVariant="blue"
          />
          <StatCard
            label="موتور محاسبات مهندسی"
            value="RPN & Analytical"
            subtext="بدون eval، اعتبارسنجی عددی"
            iconName="Calculator"
            statusVariant="stone"
          />
          <StatCard
            label="محیط محاسباتی Python"
            value="Kinetic Models Ready"
            subtext="کینتیک، GAB، رئولوژی، F₀"
            iconName="Terminal"
            statusVariant="amber"
          />
        </div>
      </div>

      {/* Primary 10 Architectural Pillars Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              ارکان ده‌گانه سامانه تخصصی صنایع غذایی
            </h3>
          </div>

          <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400" dir="ltr">
            10 Functional Modules · Offline Ready
          </span>
        </div>

        {/* 10 Quick Access Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {QUICK_ACCESS_ITEMS.map((item) => (
            <QuickAccessCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
