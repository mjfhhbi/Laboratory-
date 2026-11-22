import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { OnlineStatusBadge } from '../../components/common/OnlineStatusBadge';
import { StorageStatusCard } from '../../components/common/StorageStatusCard';
import { PwaInstallPrompt } from '../../components/common/PwaInstallPrompt';
import { useOnlineStatus } from '../../lib/useOnlineStatus';
import { useTheme } from '../../lib/theme';
import { getUserSettings, saveUserSettings } from '../../lib/storage';
import {
  getServiceWorkerRuntimeStatus,
  checkForSwUpdate,
  applySwUpdate,
  isRunningStandalone,
  ServiceWorkerRuntimeStatus
} from '../../lib/pwa';
import { UserSettings } from '../../types';
import {
  Sun,
  Wifi,
  HardDrive,
  CheckCircle2,
  Database,
  Smartphone,
  RefreshCw,
  CloudOff,
  WifiOff
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const { theme } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [swStatus, setSwStatus] = useState<ServiceWorkerRuntimeStatus | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadRuntimeStatus = async () => {
    setStandalone(isRunningStandalone());
    const status = await getServiceWorkerRuntimeStatus().catch(() => null);
    if (status) setSwStatus(status);
  };

  useEffect(() => {
    getUserSettings().then(setSettings).catch(console.error);
    loadRuntimeStatus();
  }, []);

  const handleToggle = async (
    key: keyof Pick<UserSettings, 'autoSaveHistory' | 'offlineCacheEnabled' | 'offlineDataSync'>
  ) => {
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

  const handleCheckUpdate = async () => {
    setCheckingUpdate(true);
    setUpdateMsg(null);
    try {
      const hasUpdate = await checkForSwUpdate();
      await loadRuntimeStatus();
      if (hasUpdate) {
        setUpdateMsg('نسخه جدید یافت شد و آماده اعمال بدون حذف داده‌های کاربری یا بسته‌های پایتون است.');
      } else {
        setUpdateMsg('برنامه و پوسته آفلاین به آخرین نسخه به‌روز هستند.');
      }
    } catch {
      setUpdateMsg('بررسی به‌روزرسانی در حالت آفلاین امکان‌پذیر نیست.');
    } finally {
      setCheckingUpdate(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="تنظیمات سیستم، PWA و قابلیت‌های آفلاین"
        englishTitle="/settings"
        description="مدیریت پوسته، ۱۸ مخزن IndexedDB، کش بسته‌های NumPy/SciPy، به‌روزرسانی امن و نصب اندروید/PWA"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'تنظیمات سیستم و آفلاین' }
        ]}
      />

      {/* PWA Install & Update Banner */}
      <PwaInstallPrompt />

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تنظیمات با موفقیت در پایگاه داده محلی (IndexedDB) ذخیره شد.</span>
        </div>
      )}

      {/* Local Database Status & Scientific Package Cache */}
      <StorageStatusCard />

      {/* Explicit Offline vs Online Capability Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                قابلیت‌های کاملاً آفلاین (اجرا روی دستگاه)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                پس از بارگذاری اولیه یا کش شدن، بدون نیاز به اینترنت اجرا می‌شوند
              </p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300 leading-relaxed list-disc pr-5">
            <li>محیط محاسبات علمی پایتون (Pyodide WebAssembly با NumPy، SciPy و SymPy)</li>
            <li>محاسبات مهندسی فرآیند، ایزوترم‌های رطوبتی، فرآیند حرارتی، رئولوژی و انجماد پلانک</li>
            <li>موتور بسته‌بندی، نفوذ‌پذیری WVTR/OTR، مهاجرت اختصاصی SML و پیش‌بینی ماندگاری</li>
            <li>گردش کار آزمایشگاه دیجیتال، ثبت آزمایش‌ها، کنترل کیفیت (SPC) و استانداردهای INSO</li>
            <li>مشاهده، جستجو و پشتیبان‌گیری تمام مکالمات و پروژه‌های ثبت‌شده در IndexedDB</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <CloudOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                قابلیت‌های نیازمند اتصال اینترنت و سرور
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                برای حفظ صداقت علمی، پاسخ هوش مصنوعی بدون اتصال تولید یا شبیه‌سازی نمی‌شود
              </p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300 leading-relaxed list-disc pr-5">
            <li>ارسال پرسش جدید به دستیار هوشمند چت و دریافت پاسخ استریمینگ Google Gemini</li>
            <li>دریافت فایل‌ها یا به‌روزرسانی نسخه جدید اپلیکیشن از سرور</li>
          </ul>

          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed flex items-start gap-2">
            <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              در صورت قطع اینترنت، پیام‌های قبلی در چت قابل مرور باقی می‌مانند و ارسال پیام جدید با راهنمای واضح متوقف می‌شود.
            </span>
          </div>
        </div>
      </div>

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
                type="button"
                aria-label="ذخیره خودکار تاریخچه گفتگوها"
                onClick={() => handleToggle('autoSaveHistory')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings?.autoSaveHistory ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings?.autoSaveHistory ? '-translate-x-6' : '-translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div>
                <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  کش فایل‌های ضروری برنامه (Service Worker)
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  امکان اجرای کامل برنامه بدون نیاز به اینترنت
                </div>
              </div>
              <button
                type="button"
                aria-label="کش فایل‌های ضروری برنامه"
                onClick={() => handleToggle('offlineCacheEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings?.offlineCacheEnabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings?.offlineCacheEnabled ? '-translate-x-6' : '-translate-x-1'
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
                type="button"
                aria-label="آمادگی پایگاه دانش آفلاین"
                onClick={() => handleToggle('offlineDataSync')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings?.offlineDataSync ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings?.offlineDataSync ? '-translate-x-6' : '-translate-x-1'
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
                پایش لحظه‌ای اتصال اینترنت و وضعیت واقعی Service Worker
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
                ? 'سامانه به شبکه متصل است و تمامی ماژول‌های محلی و سرویسی آنلاین آماده هستند.'
                : 'ارتباط اینترنت قطع است. صفحات برنامه، محاسبات مهندسی، محیط Python/SciPy و داده‌های IndexedDB در دسترس هستند (چت آنلاین Gemini موقتاً غیرفعال است).'}
            </div>
          </div>
        </div>

        {/* System Architecture & Android Info */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                ساختار آفلاین، به‌روزرسانی و نسخه اندروید
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                وضعیت واقعی Service Worker و بسته‌بندی یکپارچه Web / PWA / TWA Android
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
              <span>حالت اجرا (Display Mode):</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {standalone ? 'اپلیکیشن مستقل (Standalone PWA)' : 'مرورگر وب (Browser Tab)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
              <span>وضعیت سرویس‌ورکر / باندل:</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400" dir="ltr">
                {swStatus
                  ? `${swStatus.state} (controlling=${swStatus.controlling ? 'yes' : 'no'})`
                  : 'checking...'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
              <span>کش پوسته / پایتون:</span>
              <span className="font-mono text-stone-800 dark:text-stone-200" dir="ltr">
                {swStatus ? `${swStatus.appCacheName} + ${swStatus.pyodideCacheName}` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span>نسخه یکپارچه اندروید:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-stone-800 dark:text-stone-200">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Capacitor Android (بسته آفلاین) + PWA</span>
              </span>
            </div>
          </div>

          {updateMsg && (
            <div className="mt-3 p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-700 dark:text-stone-300">
              {updateMsg}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCheckUpdate}
              disabled={checkingUpdate || !isOnline}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingUpdate ? 'animate-spin' : ''}`} />
              <span>{checkingUpdate ? 'در حال بررسی...' : 'بررسی به‌روزرسانی نسخه'}</span>
            </button>

            {swStatus?.state === 'waiting_update' && (
              <button
                type="button"
                onClick={() => applySwUpdate()}
                className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg"
              >
                <span>اعمال به‌روزرسانی آماده</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
