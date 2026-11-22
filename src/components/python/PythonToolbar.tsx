import React from 'react';
import { WorkerEngineStatus } from '../../lib/python/types';
import {
  Play,
  Square,
  RotateCcw,
  Download,
  FolderOpen,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface PythonToolbarProps {
  status: WorkerEngineStatus;
  timeoutSeconds: number;
  onTimeoutChange: (seconds: number) => void;
  onRun: () => void;
  onStop: () => void;
  onResetNamespace: () => void;
  onOpenTemplates: () => void;
  onDownload: () => void;
}

export const PythonToolbar: React.FC<PythonToolbarProps> = ({
  status,
  timeoutSeconds,
  onTimeoutChange,
  onRun,
  onStop,
  onResetNamespace,
  onOpenTemplates,
  onDownload
}) => {
  const isRunning = status === 'running';
  const isInitializing = status === 'initializing';

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
      {/* Right side: Execution Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRun}
          disabled={isRunning || isInitializing}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
          title="اجرای کد پایتون (Ctrl + Enter)"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>در حال اجرا...</span>
            </>
          ) : isInitializing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>بارگذاری WASM...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>اجرای کد Python</span>
            </>
          )}
        </button>

        {isRunning && (
          <button
            onClick={onStop}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
            title="توقف اضطراری اجرای کد و آزادسازی حافظه"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>توقف اضطراری</span>
          </button>
        )}

        <div className="h-6 w-px bg-stone-200 dark:border-stone-800 mx-1 hidden sm:block"></div>

        {/* Timeout Selector */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
          <Clock className="w-3.5 h-3.5" />
          <span className="hidden md:inline">محدودیت زمان:</span>
          <select
            value={timeoutSeconds}
            onChange={(e) => onTimeoutChange(Number(e.target.value))}
            className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-800 dark:text-stone-200 focus:outline-hidden"
            dir="ltr"
          >
            <option value={5}>5s</option>
            <option value={10}>10s</option>
            <option value={20}>20s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
          </select>
        </div>
      </div>

      {/* Left side: Management & Engine Status */}
      <div className="flex items-center gap-2">
        {/* Engine status indicator */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'ready'
                ? 'bg-emerald-500'
                : status === 'running'
                ? 'bg-amber-500 animate-pulse'
                : status === 'initializing'
                ? 'bg-blue-500 animate-spin'
                : status === 'error'
                ? 'bg-rose-500'
                : 'bg-stone-400'
            }`}
          ></span>
          <span className="text-stone-700 dark:text-stone-300">
            {status === 'ready'
              ? 'موتور Pyodide آماده'
              : status === 'running'
              ? 'در حال پردازش...'
              : status === 'initializing'
              ? 'بارگذاری اولیه...'
              : status === 'error'
              ? 'خطا در بارگذاری'
              : 'متوقف شده'}
          </span>
        </div>

        {/* Templates & Scripts Manager */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>الگوها و اسکریپت‌ها</span>
        </button>

        {/* Reset namespace */}
        <button
          onClick={onResetNamespace}
          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title="بازنشانی متغیرهای سراسری پایتون"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Download .py script */}
        <button
          onClick={onDownload}
          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title="دانلود فایل اسکریپت پایتون (.py)"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
