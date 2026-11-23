import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export type NoticeVariant = 'info' | 'success' | 'warning' | 'error';

interface ConfirmRequest {
  id: number;
  message: string;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive: boolean;
  resolve: (accepted: boolean) => void;
}

interface NoticeItem {
  id: number;
  message: string;
  variant: NoticeVariant;
}

type Listener = {
  onConfirm: (req: ConfirmRequest) => void;
  onNotice: (item: NoticeItem) => void;
};

let activeListener: Listener | null = null;
let seq = 1;

export function appConfirm(
  message: string,
  options?: {
    title?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
  }
): Promise<boolean> {
  if (!activeListener) {
    return Promise.resolve(false);
  }
  return new Promise<boolean>((resolve) => {
    activeListener!.onConfirm({
      id: seq++,
      message,
      title: options?.title || 'تأیید عملیات',
      confirmLabel: options?.confirmLabel || 'تأیید و ادامه',
      cancelLabel: options?.cancelLabel || 'انصراف',
      destructive: options?.destructive ?? true,
      resolve
    });
  });
}

export function appAlert(message: string, variant: NoticeVariant = 'warning'): void {
  if (!activeListener) return;
  activeListener.onNotice({
    id: seq++,
    message,
    variant
  });
}

export const DialogHost: React.FC = () => {
  const [confirmQueue, setConfirmQueue] = useState<ConfirmRequest[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  useEffect(() => {
    activeListener = {
      onConfirm: (req) => {
        setConfirmQueue((prev) => [...prev, req]);
      },
      onNotice: (item) => {
        setNotices((prev) => [...prev.slice(-2), item]);
        setTimeout(() => {
          setNotices((prev) => prev.filter((n) => n.id !== item.id));
        }, 4500);
      }
    };
    return () => {
      activeListener = null;
    };
  }, []);

  const currentConfirm = confirmQueue[0] || null;

  const closeConfirm = (accepted: boolean) => {
    if (!currentConfirm) return;
    currentConfirm.resolve(accepted);
    setConfirmQueue((prev) => prev.slice(1));
  };

  useEffect(() => {
    if (!currentConfirm) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeConfirm(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <>
      {/* Non-blocking RTL Toast Stack */}
      {notices.length > 0 && (
        <div
          className="fixed bottom-5 left-5 z-[110] flex flex-col gap-2 max-w-sm w-[calc(100%-2.5rem)]"
          dir="rtl"
          role="status"
          aria-live="polite"
        >
          {notices.map((n) => {
            const palette =
              n.variant === 'error'
                ? 'bg-rose-950 text-rose-50 border-rose-700'
                : n.variant === 'success'
                ? 'bg-emerald-950 text-emerald-50 border-emerald-700'
                : n.variant === 'warning'
                ? 'bg-amber-950 text-amber-50 border-amber-700'
                : 'bg-stone-900 text-stone-50 border-stone-700';

            const Icon =
              n.variant === 'success'
                ? CheckCircle2
                : n.variant === 'info'
                ? Info
                : AlertTriangle;

            return (
              <div
                key={n.id}
                className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-xs font-medium leading-relaxed ${palette}`}
              >
                <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="flex-1">{n.message}</span>
                <button
                  type="button"
                  onClick={() => setNotices((prev) => prev.filter((x) => x.id !== n.id))}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="بستن اعلان"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {currentConfirm && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-confirm-title"
          onClick={() => closeConfirm(false)}
        >
          <div
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  currentConfirm.destructive
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  id="app-confirm-title"
                  className="text-sm font-bold text-stone-900 dark:text-stone-100"
                >
                  {currentConfirm.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed">
                  {currentConfirm.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => closeConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                {currentConfirm.cancelLabel}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => closeConfirm(true)}
                className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors ${
                  currentConfirm.destructive
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                {currentConfirm.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
