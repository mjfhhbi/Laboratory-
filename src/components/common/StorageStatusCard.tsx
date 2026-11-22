import React, { useEffect, useRef, useState } from 'react';
import {
  getStorageStatistics,
  requestPersistentStorage,
  exportOfflineBackup,
  importOfflineBackup,
  clearAllOfflineData
} from '../../lib/storage';
import {
  precacheAllScientificPackages,
  getOfflinePackagesSummary,
  clearScientificPackagesCache,
  OfflinePackagesSummary,
  PrecacheProgress,
  TOTAL_PYODIDE_BYTES
} from '../../lib/pwa';
import { StorageStats } from '../../types';
import {
  HardDrive,
  Database,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  PackageCheck,
  AlertTriangle
} from 'lucide-react';

const PACKAGE_LABELS: Array<{ key: string; label: string; approxMb: string }> = [
  { key: 'core', label: 'هسته Pyodide WASM', approxMb: '10.1 MB' },
  { key: 'stdlib', label: 'کتابخانه استاندارد پایتون', approxMb: '2.3 MB' },
  { key: 'openblas', label: 'OpenBLAS / LAPACK', approxMb: '6.1 MB' },
  { key: 'numpy', label: 'NumPy 1.26.4', approxMb: '12.0 MB' },
  { key: 'scipy', label: 'SciPy 1.12.0', approxMb: '47.1 MB' },
  { key: 'sympy', label: 'SymPy 1.12', approxMb: '15.8 MB' },
  { key: 'pandas', label: 'Pandas 2.2.0', approxMb: '23.8 MB' },
  { key: 'matplotlib', label: 'Matplotlib 3.5.2', approxMb: '15.7 MB' }
];

export const StorageStatusCard: React.FC = () => {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [pkgSummary, setPkgSummary] = useState<OfflinePackagesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [persisting, setPersisting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [cachingPackages, setCachingPackages] = useState(false);
  const [progress, setProgress] = useState<PrecacheProgress | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [data, pkgData] = await Promise.all([
        getStorageStatistics(),
        getOfflinePackagesSummary().catch(() => null)
      ]);
      setStats(data);
      if (pkgData) setPkgSummary(pkgData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(i >= 2 ? 2 : 1) + ' ' + sizes[i];
  };

  const formatMbDecimal = (bytes: number) => {
    return `${(bytes / 1_000_000).toFixed(2)} MB`;
  };

  const handleRequestPersistence = async () => {
    setPersisting(true);
    try {
      const granted = await requestPersistentStorage();
      setFeedback(
        granted
          ? 'مجوز ذخیره‌سازی پایدار (Persistent Storage) توسط مرورگر تأیید شد.'
          : 'ذخیره‌سازی به عنوان حافظه استاندارد مرورگر مدیریت می‌شود.'
      );
      await fetchStats();
    } finally {
      setPersisting(false);
    }
  };

  const handlePrecacheScientificPackages = async () => {
    setCachingPackages(true);
    setProgress({
      currentFile: 'آماده‌سازی...',
      completedFiles: 0,
      totalFiles: 22,
      downloadedBytes: pkgSummary?.totalCachedBytes || 0,
      totalBytes: TOTAL_PYODIDE_BYTES,
      percent: pkgSummary
        ? Math.round((pkgSummary.totalCachedBytes / TOTAL_PYODIDE_BYTES) * 100)
        : 0
    });

    try {
      const result = await precacheAllScientificPackages((p) => {
        setProgress(p);
      });
      if (result.success) {
        setFeedback(
          `تمام ${result.cachedCount} فایل موتور پایتون، NumPy و SciPy (${formatMbDecimal(result.downloadedBytes || TOTAL_PYODIDE_BYTES)}) برای اجرای آفلاین کش شدند.`
        );
      } else {
        setFeedback(
          result.errorFa ||
            `کش ناقص بود (${result.cachedCount} از ${result.totalAssets} فایل ذخیره شد).`
        );
      }
      await fetchStats();
    } catch {
      setFeedback('خطا در ذخیره‌سازی آفلاین بسته‌های علمی پایتون.');
    } finally {
      setCachingPackages(false);
    }
  };

  const handleClearPyodideCache = async () => {
    await clearScientificPackagesCache();
    setFeedback('کش بسته‌های پایتون پاک شد. داده‌های کاربری IndexedDB دست‌نخورده باقی ماندند.');
    await fetchStats();
  };

  const handleExportBackup = async () => {
    try {
      const jsonString = await exportOfflineBackup();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `food_science_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setFeedback('نسخه پشتیبان کامل از تمامی ۱۸ مخزن IndexedDB دانلود شد.');
    } catch {
      setFeedback('خطا در دریافت نسخه پشتیبان.');
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const { restoredRecords } = await importOfflineBackup(text);
      setFeedback(`بازیابی با موفقیت انجام شد (${restoredRecords} رکورد به IndexedDB بازگردانده شد).`);
      await fetchStats();
    } catch {
      setFeedback('خطا در خواندن یا بازیابی فایل پشتیبان JSON.');
    } finally {
      event.target.value = '';
    }
  };

  const handleClearData = async () => {
    setClearing(true);
    try {
      await clearAllOfflineData();
      setConfirmReset(false);
      await fetchStats();
      setFeedback('داده‌های محلی دیتابیس IndexedDB پاکسازی و بازنشانی شدند.');
    } finally {
      setClearing(false);
    }
  };

  const cachedFiles = pkgSummary?.cachedFilesCount ?? 0;
  const totalFiles = pkgSummary?.totalFilesCount ?? 22;
  const cachedBytes = pkgSummary?.totalCachedBytes ?? 0;
  const totalBytes = pkgSummary?.totalRequiredBytes ?? TOTAL_PYODIDE_BYTES;
  const cachePercent = totalBytes > 0 ? Math.min(100, Math.round((cachedBytes / totalBytes) * 100)) : 0;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              پایگاه داده محلی (IndexedDB) و حافظه آفلاین پایتون
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              پایش ۱۸ مخزن داده کاربری، پشتیبان‌گیری و وضعیت کش بسته‌های علمی
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title="به‌روزرسانی آمار"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs rounded-lg flex items-center justify-between gap-2 border border-stone-200 dark:border-stone-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="px-2 py-1 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs"
          >
            بستن
          </button>
        </div>
      )}

      {stats ? (
        <div className="space-y-5">
          {/* Storage Quota Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-stone-600 dark:text-stone-400 font-medium">
                کل فضای اشغال‌شده مرورگر (IndexedDB + CacheStorage):
              </span>
              <span className="font-mono tabular-nums text-stone-800 dark:text-stone-200 font-semibold" dir="ltr">
                {formatBytes(stats.usageBytes)} / {stats.quotaBytes > 0 ? formatBytes(stats.quotaBytes) : 'نامحدود'}
              </span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(Math.min(stats.usagePercentage || 0, 100), stats.usageBytes > 0 ? 2 : 0)}%` }}
              />
            </div>
          </div>

          {/* IndexedDB 18-store Counts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div className="text-[11px] text-stone-500 dark:text-stone-400">مخازن فعال</div>
              <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5 font-mono tabular-nums">
                {stats.activeStoresCount}
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div className="text-[11px] text-stone-500 dark:text-stone-400">کل رکوردها</div>
              <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5 font-mono tabular-nums">
                {stats.totalRecordsCount}
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div className="text-[11px] text-stone-500 dark:text-stone-400">گفتگو / پیام</div>
              <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5 font-mono tabular-nums">
                {stats.conversationsCount} / {stats.messagesCount}
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div className="text-[11px] text-stone-500 dark:text-stone-400">پایگاه دانش</div>
              <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5 font-mono tabular-nums">
                {stats.knowledgeItemsCount}
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div className="text-[11px] text-stone-500 dark:text-stone-400">ماندگاری داده</div>
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                {stats.isPersisted ? 'پایدار (Persisted)' : 'استاندارد'}
              </div>
            </div>
          </div>

          {/* Offline Scientific Packages (Pyodide + NumPy + SciPy) Panel */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  بسته‌های علمی پایتون آفلاین (Pyodide 0.26.4 + NumPy + SciPy)
                </span>
              </div>
              <span className="text-xs font-mono tabular-nums font-semibold text-stone-700 dark:text-stone-300" dir="ltr">
                {cachingPackages && progress
                  ? `${progress.percent}% · ${formatMbDecimal(progress.downloadedBytes)} / ${formatMbDecimal(progress.totalBytes)} (${progress.completedFiles}/${progress.totalFiles})`
                  : `${cachePercent}% · ${formatMbDecimal(cachedBytes)} / ${formatMbDecimal(totalBytes)} (${cachedFiles}/${totalFiles} فایل)`}
              </span>
            </div>

            {/* Live Download / Cached Progress Bar */}
            <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-200"
                style={{
                  width: `${cachingPackages && progress ? progress.percent : cachePercent}%`
                }}
              />
            </div>

            {cachingPackages && progress && (
              <div className="text-[11px] text-stone-600 dark:text-stone-400 font-mono truncate" dir="ltr">
                Caching: {progress.currentFile} ({progress.percent}%)
              </div>
            )}

            {/* Per-Package Readiness Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {PACKAGE_LABELS.map((item) => {
                const entry = pkgSummary?.packagesStatus?.[item.key];
                const isCached = Boolean(entry?.cached);
                return (
                  <div
                    key={item.key}
                    className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-[11px]"
                  >
                    <div className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                      {item.label}
                    </div>
                    <div className="flex items-center justify-between mt-1 font-mono tabular-nums">
                      <span className={isCached ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-stone-400'}>
                        {isCached ? '● آماده آفلاین' : '○ کش‌نشده'}
                      </span>
                      <span className="text-stone-500 dark:text-stone-400" dir="ltr">
                        {entry?.sizeBytes ? formatMbDecimal(entry.sizeBytes) : item.approxMb}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
              کش بسته‌های پایتون در مخزن مجزای <span className="font-mono" dir="ltr">food-science-pyodide-v0.26.4</span> نگهداری می‌شود و هنگام به‌روزرسانی یا نصب مجدد اپلیکیشن نیازی به دانلود دوباره آنها نخواهد بود.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={handlePrecacheScientificPackages}
              disabled={cachingPackages}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              <HardDrive className={`w-4 h-4 ${cachingPackages ? 'animate-pulse' : ''}`} />
              <span>
                {cachingPackages
                  ? `در حال دانلود و کش (${progress?.percent ?? 0}%)...`
                  : cachedFiles === totalFiles
                  ? 'بررسی و تکمیل کش NumPy و SciPy (۱۰۰٪)'
                  : 'دانلود و کش آفلاین NumPy و SciPy'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleExportBackup}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-lg transition-colors border border-stone-200 dark:border-stone-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>پشتیبان‌گیری (Export JSON)</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-lg transition-colors border border-stone-200 dark:border-stone-700"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>بازیابی پشتیبان (Import JSON)</span>
            </button>

            {!stats.isPersisted && (
              <button
                type="button"
                onClick={handleRequestPersistence}
                disabled={persisting}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800/60"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>درخواست مجوز ماندگاری دائم</span>
              </button>
            )}

            {cachedFiles > 0 && (
              <button
                type="button"
                onClick={handleClearPyodideCache}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-lg transition-colors border border-stone-200 dark:border-stone-700"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>پاکسازی کش پایتون</span>
              </button>
            )}

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-semibold rounded-lg transition-colors border border-rose-200 dark:border-rose-800/60 mr-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>بازنشانی دیتابیس</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 mr-auto bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 rounded-lg p-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="text-rose-800 dark:text-rose-200 font-semibold">حذف تمام داده‌های کاربری؟</span>
                <button
                  type="button"
                  onClick={handleClearData}
                  disabled={clearing}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded font-bold"
                >
                  {clearing ? '...' : 'تأیید'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded border border-stone-300 dark:border-stone-700"
                >
                  انصراف
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-stone-500">
          در حال بارگذاری اطلاعات پایگاه داده...
        </div>
      )}
    </div>
  );
};
