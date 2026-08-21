import React from 'react';
import { useOnlineStatus } from '../../lib/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';

interface OnlineStatusBadgeProps {
  showLabel?: boolean;
}

export const OnlineStatusBadge: React.FC<OnlineStatusBadgeProps> = ({ showLabel = true }) => {
  const { isOnline } = useOnlineStatus();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
        isOnline
          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
      }`}
      title={isOnline ? 'سامانه متصل است (Online)' : 'سامانه در وضعیت آفلاین است (Offline)'}
    >
      <span className="relative flex h-2 w-2">
        {isOnline ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        )}
      </span>

      {isOnline ? (
        <Wifi className="w-3.5 h-3.5 opacity-80" />
      ) : (
        <WifiOff className="w-3.5 h-3.5 opacity-80" />
      )}

      {showLabel && (
        <span className="text-[11px] font-semibold">
          {isOnline ? 'آنلاین' : 'آفلاین'}
        </span>
      )}
    </div>
  );
};
