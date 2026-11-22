import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

interface ChatErrorBannerProps {
  error: string | null;
  onRetry?: () => void;
  onDismiss: () => void;
}

export const ChatErrorBanner: React.FC<ChatErrorBannerProps> = ({
  error,
  onRetry,
  onDismiss
}) => {
  if (!error) return null;

  return (
    <div className="mx-4 my-2 p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-start gap-2 min-w-0">
        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <span className="leading-relaxed">{error}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-[11px] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>تلاش مجدد</span>
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 text-rose-400 hover:text-rose-700 dark:hover:text-rose-100 rounded-lg"
          title="بستن پیام خطا"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
