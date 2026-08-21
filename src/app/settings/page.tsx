import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { OnlineStatusBadge } from '../../components/common/OnlineStatusBadge';
import { StorageStatusCard } from '../../components/common/StorageStatusCard';
import { PwaInstallPrompt } from '../../components/common/PwaInstallPrompt';
import { useOnlineStatus } from '../../lib/useOnlineStatus';
import { useTheme } from '../../lib/theme';
import { getUserSettings, saveUserSettings } from '../../lib/storage';
import { UserSettings } from '../../types';
import {
  Sun,
  Globe,
  Wifi,
  HardDrive,
  CheckCircle2,
  Database,
  Smartphone,
  Save,
  Layers,
  Sparkles
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const { theme } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getUserSettings().then(setSettings).catch(console.error);
  }, []);

  const handleToggle = async (key: keyof Pick<UserSettings, 'autoSaveHistory' | 'offlineCacheEnabled' | 'offlineDataSync'>) => {
    if (!settings) return;
    const updated = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(updated);
    await saveUserSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="تنظیمات سیستم و قابلیت‌های آفلاین"
        englishTitle="/settings"
        description="مدیریت پوسته، ذخیره‌سازی محلی IndexedDB، تنظیمات PWA و ترجیحات کاربری سامانه Food Science AI"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'تنظیمات سیستم و آفلاین' }
        ]}
      />

      {/* PWA Install Banner if applicable */}
      <PwaInstallPrompt />

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تنظیمات با موفقیت در پایگاه داده محلی (IndexedDB) ذخیره شد.</span>
        </div>
      )}

      {/* Top Section: Local Database Status & Operations */}
      <StorageStatusCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Offline & Cache Preferences */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                پیکربندی حالت آفلاین و حافظه
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                کنترل ذخیره‌سازی خودکار در IndexedDB و Service Worker
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div>
                <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  ذخیره خودکار تاریخچه گفتگوها
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  ثبت پیام‌ها و مکالمات در دیتابیس محلی دستگاه
                </div>
              </div>
              <button
                onClick={() => handleToggle('autoSaveHistory')}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  settings?.autoSaveHistory ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    settings?.autoSaveHistory ? '-translate-x-4.5' : '-translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div>
                <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  کش فایلهای ضروری برنامه (Service Worker)
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  امکان اجرای کامل برنامه بدون نیاز به اینترنت
                </div>
              </div>
              <button
                onClick={() => handleToggle('offlineCacheEnabled')}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  settings?.offlineCacheEnabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    settings?.offlineCacheEnabled ? '-translate-x-4.5' : '-translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div>
                <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  آمادگی پایگاه دانش آفلاین (Knowledge Base)
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  کش استانداردها، فرمول‌ها و متدهای آزمایشگاهی
                </div>
              </div>
              <button
                onClick={() => handleToggle('offlineDataSync')}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  settings?.offlineDataSync ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    settings?.offlineDataSync ? '-translate-x-4.5' : '-translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Theme Settings Card */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                پوسته و تم ظاهری
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                تغییر بین حالت روشن، تاریک و پیرو تنظیمات سیستم عامل
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                حالت فعال فعلی:
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {theme === 'light' ? 'روشن (Light)' : theme === 'dark' ? 'تاریک (Dark)' : 'پیرو سیستم (System)'}
              </span>
            </div>

            <div className="flex justify-end">
              <ThemeToggle compact={false} />
            </div>
          </div>
        </div>

        {/* Network & Connectivity Status Card */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                وضعیت اتصال و شبکه
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                پایش لحظه‌ای اتصال اینترنت و Service Worker
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                وضعیت اتصال مرورگر:
              </span>
              <OnlineStatusBadge showLabel={true} />
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg text-xs text-stone-600 dark:text-stone-400 leading-relaxed border border-stone-200/80 dark:border-stone-700/60">
              {isOnline
                ? 'سامانه به شبکه متصل است و تمامی منابع کش‌شده محلی آماده کار بدون وقفه هستند.'
                : 'ارتباط اینترنت قطع است. کلیه صفحات، فرم‌ها و پایگاه داده در حالت آفلاین محلی (PWA) در دسترس شما قرار دارند.'}
            </div>
          </div>
        </div>

        {/* System Architecture Info */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                مشخصات ساختار نرم‌افزاری
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                وضعیت فاز جاری و متادیتای سیستم آفلاین
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
              <span>فاز توسعه جاری:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">قسمت ۳ از ۱۰ (PWA & Offline System)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
              <span>موتور دیتابیس محلی:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">IndexedDB (FoodScienceAI_Storage)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
              <span>سرویس‌ورکر (SW):</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">Active & Registered (/sw.js)</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span>آمادگی پایگاه دانش آفلاین:</span>
              <span className="font-mono text-stone-800 dark:text-stone-200" dir="ltr">Ready for Phase 4+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
