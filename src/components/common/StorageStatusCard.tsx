import React, { useEffect, useState } from 'react';
import {
  getStorageStatistics,
  requestPersistentStorage,
  exportOfflineBackup,
  clearAllOfflineData
} from '../../lib/storage';
import { StorageStats } from '../../types';
import {
  HardDrive,
  Database,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const StorageStatusCard: React.FC = () => {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [persisting, setPersisting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getStorageStatistics();
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRequestPersistence = async () => {
    setPersisting(true);
    try {
      const granted = await requestPersistentStorage();
      if (granted) {
        setFeedback('مجوز ذخیره‌سازی پایدار توسط مرورگر تأیید شد.');
      } else {
        setFeedback('ذخیره‌سازی به عنوان حافظه موقت استاندارد مدیریت می‌شود.');
      }
      await fetchStats();
    } finally {
      setPersisting(false);
    }
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
      setFeedback('نسخه پشتیبان از دیتابیس محلی با موفقیت دانلود شد.');
    } catch {
      setFeedback('خطا در دریافت نسخه پشتیبان.');
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('آیا از پاکسازی تمام اطلاعات ذخیره‌شده محلی اطمینان دارید؟')) {
      return;
    }
    setClearing(true);
    try {
      await clearAllOfflineData();
      await fetchStats();
      setFeedback('حافظه محلی دیتابیس پاکسازی و بازنشانی شد.');
    } finally {
      setClearing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              پایگاه داده محلی (IndexedDB)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              وضعیت ذخیره‌سازی آفلاین و جداول داده‌ای سیستم
            </p>
          </div>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title="به‌روزرسانی آمار"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {feedback && (
        <div className="mb-3 p-2.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs rounded-lg flex items-center justify-between border border-stone-200 dark:border-stone-700">
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs"
          >
            ×
          </button>
        </div>
      )}

      {stats ? (
        <div className="space-y-4">
          {/* Storage Quota Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-stone-600 dark:text-stone-400 font-medium">
                فضای اشغال‌شده مرورگر:
              </span>
              <span className="font-mono text-stone-800 dark:text-stone-200 font-semibold" dir="ltr">
                {formatBytes(stats.usageBytes)} / {stats.quotaBytes > 0 ? formatBytes(stats.quotaBytes) : 'نامحدود'}
              </span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(stats.usagePercentage || 1, 100)}%` }}
              />
            </div>
          </div>

          {/* Counts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div className="text-[11px] text-stone-500 dark:text-stone-400">گفتگوها</div>
              <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5 font-mono">
                {stats.conversationsCount}
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div className="text-[11px] text-stone-500 dark:text-stone-400">پیام‌ها</div>
              <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5 font-mono">
                {stats.messagesCount}
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200/70 dark:border-stone-700/50">
              <div className="text-[11px] text-stone-500 dark:text-stone-400">پایگاه دانش</div>
              <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5 font-mono">
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

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-lg transition-colors border border-stone-200 dark:border-stone-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>پشتیبان‌گیری (Export JSON)</span>
            </button>

            {!stats.isPersisted && (
              <button
                onClick={handleRequestPersistence}
                disabled={persisting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800/60"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>درخواست مجوز ماندگاری دائم</span>
              </button>
            )}

            <button
              onClick={handleClearData}
              disabled={clearing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-semibold rounded-lg transition-colors border border-rose-200 dark:border-rose-800/60 mr-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>بازنشانی حافظه</span>
            </button>
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
