import React, { useEffect, useState } from 'react';
import { useOnlineStatus } from '../../lib/useOnlineStatus';
import { WifiOff, Wifi, HardDrive, CheckCircle2, X } from 'lucide-react';

export const OfflineAlertBanner: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnectedAlert, setShowReconnectedAlert] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setDismissed(false);
    } else if (wasOffline) {
      setShowReconnectedAlert(true);
      const timer = setTimeout(() => {
        setShowReconnectedAlert(false);
        setWasOffline(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // If reconnected
  if (showReconnectedAlert && isOnline) {
    return (
      <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/70 rounded-xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 transition-all shadow-xs animate-fadeIn">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-200/80 dark:bg-emerald-800/80 rounded-lg text-emerald-800 dark:text-emerald-200">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">اتصال شبکه برقرار شد!</span>
            <span className="mr-2 text-emerald-700 dark:text-emerald-300">
              سامانه اکنون در حالت آنلاین است و کلیه اطلاعات با دیتابیس محلی همگام هستند.
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowReconnectedAlert(false)}
          className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50 rounded-md"
          aria-label="بستن اعلان"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // If currently offline
  if (!isOnline && !dismissed) {
    return (
      <div className="mb-4 p-3.5 bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/60 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shadow-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 bg-amber-200/80 dark:bg-amber-800/80 rounded-lg text-amber-800 dark:text-amber-200 shrink-0 mt-0.5 sm:mt-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold">حالت آفلاین فعال است (Offline Mode)</span>
              <span className="px-1.5 py-0.2 bg-amber-200/80 dark:bg-amber-800/60 text-[10px] font-mono rounded">
                IndexedDB Active
              </span>
            </div>
            <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
              ارتباط اینترنت قطع است، اما دسترسی به صفحات، تنظیمات، مکالمات و پایگاه دانش محلی بدون اختلال ادامه دارد.
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-amber-700 dark:text-amber-400 hover:bg-amber-200/60 dark:hover:bg-amber-800/50 rounded-md shrink-0 mr-2"
          aria-label="بستن پیام"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return null;
};
