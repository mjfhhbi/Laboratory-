import React, { useEffect, useState } from 'react';
import { subscribeToInstallPrompt, promptInstallApp, isRunningStandalone } from '../../lib/pwa';
import { Download, Check, Sparkles, Smartphone } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    setIsInstalled(isRunningStandalone());
    const unsubscribe = subscribeToInstallPrompt((available) => {
      setCanInstall(available);
    });
    return () => unsubscribe();
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

  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
        <Check className="w-3.5 h-3.5" />
        <span>اپلیکیشن نصب‌شده (PWA Standalone)</span>
      </div>
    );
  }

  if (!canInstall) {
    return null;
  }

  return (
    <div className="bg-gradient-to-l from-emerald-800 to-teal-800 text-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-emerald-700/60">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
          <Smartphone className="w-5 h-5 text-emerald-200" />
        </div>
        <div>
          <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
            <span>نصب نسخه پیشرو اپلیکیشن (PWA)</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-700/80 rounded border border-emerald-600">
              دسترسی آفلاین
            </span>
          </div>
          <p className="text-[11px] text-emerald-100/90 mt-0.5">
            امکان اجرای مستقل بدون مرورگر، سرعت بالاتر و عملکرد کامل حتی بدون اینترنت
          </p>
        </div>
      </div>

      <button
        onClick={handleInstallClick}
        disabled={installing}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs rounded-lg transition-colors shadow-xs shrink-0"
      >
        <Download className="w-4 h-4" />
        <span>{installing ? 'در حال آماده‌سازی...' : 'نصب روی دستگاه'}</span>
      </button>
    </div>
  );
};
