import React, { useEffect, useState } from 'react';
import {
  subscribeToInstallPrompt,
  subscribeToSwUpdate,
  promptInstallApp,
  applySwUpdate,
  isRunningStandalone,
  isIosSafariDevice
} from '../../lib/pwa';
import { Download, Check, Smartphone, RefreshCw, Share2 } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    setIsInstalled(isRunningStandalone());
    setIsIos(isIosSafariDevice());
    const unsubInstall = subscribeToInstallPrompt((available) => {
      setCanInstall(available);
    });
    const unsubUpdate = subscribeToSwUpdate((available) => {
      setHasUpdate(available);
    });
    return () => {
      unsubInstall();
      unsubUpdate();
    };
  }, []);

  const handleInstallClick = async () => {
    setInstalling(true);
    try {
      const accepted = await promptInstallApp();
      if (accepted) {
        setCanInstall(false);
        setIsInstalled(true);
      }
    } finally {
      setInstalling(false);
    }
  };

  const handleApplyUpdate = async () => {
    setUpdating(true);
    try {
      await applySwUpdate();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-3">
      {hasUpdate && (
        <div className="bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-100 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">نسخه جدید برنامه آماده است.</span>{' '}
              <span className="text-amber-800 dark:text-amber-200">
                به‌روزرسانی بدون حذف داده‌های IndexedDB و بدون دانلود مجدد بسته‌های پایتون انجام می‌شود.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleApplyUpdate}
            disabled={updating}
            className="min-h-[40px] px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${updating ? 'animate-spin' : ''}`} />
            <span>{updating ? 'در حال اعمال...' : 'به‌روزرسانی فوری'}</span>
          </button>
        </div>
      )}

      {isInstalled ? (
        <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 font-medium">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>اجرا در حالت مستقل اپلیکیشن (PWA Standalone)</span>
        </div>
      ) : canInstall ? (
        <div className="bg-gradient-to-l from-emerald-800 to-teal-800 text-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-emerald-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Smartphone className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm flex flex-wrap items-center gap-2">
                <span>نصب اپلیکیشن روی دستگاه (PWA / اندروید)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-700/80 rounded border border-emerald-600">
                  بدون نیاز به دانلود مجدد
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 mt-0.5">
                اجرای تمام‌صفحه مستقل، آیکون اختصاصی روی صفحه اصلی و کارکرد آفلاین محاسبات و پایتون علمی
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInstallClick}
            disabled={installing}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs rounded-lg transition-colors shadow-xs shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{installing ? 'در حال آماده‌سازی...' : 'نصب روی دستگاه'}</span>
          </button>
        </div>
      ) : isIos ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-semibold">
              <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>نصب اپلیکیشن در iOS / Safari</span>
            </div>
            <button
              type="button"
              onClick={() => setShowIosGuide((v) => !v)}
              className="min-h-[36px] px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg font-semibold"
            >
              {showIosGuide ? 'بستن راهنما' : 'مشاهده راهنما'}
            </button>
          </div>
          {showIosGuide && (
            <p className="mt-2 text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
              در مرورگر Safari دکمه اشتراک‌گذاری (Share) را لمس کرده و گزینه «Add to Home Screen» را انتخاب نمایید تا برنامه با حالت تمام‌صفحه Standalone نصب شود.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};
