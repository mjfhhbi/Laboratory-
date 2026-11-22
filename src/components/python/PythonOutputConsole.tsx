import React, { useRef, useEffect } from 'react';
import { OutputChunk, PythonExecutionError } from '../../lib/python/types';
import { Terminal, Trash2, Copy, Check, AlertCircle, Clock } from 'lucide-react';

interface PythonOutputConsoleProps {
  outputs: OutputChunk[];
  error: PythonExecutionError | null;
  durationMs: number | null;
  isRunning: boolean;
  onClear: () => void;
  onErrorLineClick?: (line: number) => void;
}

export const PythonOutputConsole: React.FC<PythonOutputConsoleProps> = ({
  outputs,
  error,
  durationMs,
  isRunning,
  onClear,
  onErrorLineClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Auto scroll to bottom as new outputs arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [outputs, error]);

  const handleCopy = () => {
    const fullText = outputs.map((o) => o.text).join('\n');
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col h-full bg-stone-950 text-stone-200 rounded-xl border border-stone-800 overflow-hidden shadow-xs">
      {/* Console Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-stone-200">کنسول خروجی (Standard Output / Error)</span>
          {isRunning && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              در حال پردازش...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {durationMs !== null && !isRunning && (
            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-mono" dir="ltr">
              <Clock className="w-3 h-3 text-stone-500" />
              <span>{durationMs} ms</span>
            </div>
          )}

          <button
            onClick={handleCopy}
            disabled={outputs.length === 0}
            className="p-1 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-800 disabled:opacity-40 transition-colors"
            title="کپی متن خروجی"
            aria-label="کپی متن خروجی"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClear}
            disabled={outputs.length === 0 && !error}
            className="p-1 rounded text-stone-400 hover:text-rose-400 hover:bg-stone-800 disabled:opacity-40 transition-colors"
            title="پاک کردن خروجی"
            aria-label="پاک کردن خروجی"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Console Logs Area */}
      <div
        ref={containerRef}
        className="flex-1 p-3.5 font-mono text-xs overflow-auto space-y-1 custom-scrollbar leading-relaxed selection:bg-emerald-900/60 selection:text-white"
        dir="ltr"
      >
        {outputs.length === 0 && !error && !isRunning && (
          <div className="h-full flex flex-col items-center justify-center text-stone-600 text-[11px] select-none py-12">
            <Terminal className="w-8 h-8 mb-2 opacity-30 text-stone-500" />
            <p>آماده اجرا. کد پایتون را اجرا کنید تا خروجی متنی نمایش داده شود.</p>
          </div>
        )}

        {outputs.map((chunk) => {
          if (chunk.type === 'stdout') {
            return (
              <pre key={chunk.id} className="text-stone-100 whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed">
                {chunk.text}
              </pre>
            );
          }
          if (chunk.type === 'stderr') {
            return (
              <pre key={chunk.id} className="text-rose-400 whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed bg-rose-950/20 p-1 rounded border-l-2 border-rose-500">
                {chunk.text}
              </pre>
            );
          }
          if (chunk.type === 'system') {
            return (
              <div key={chunk.id} className="text-emerald-400 text-[11px] font-mono opacity-80 py-0.5 border-y border-stone-800/40 my-1">
                {chunk.text}
              </div>
            );
          }
          if (chunk.type === 'info') {
            return (
              <div key={chunk.id} className="text-cyan-400 text-[11px] font-mono opacity-80 py-0.5">
                {chunk.text}
              </div>
            );
          }
          return null;
        })}

        {/* Dedicated Error Notice if activeError exists */}
        {error && (
          <div className="mt-3 p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs font-mono space-y-1.5" dir="rtl">
            <div className="flex items-center gap-1.5 font-bold text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>خطای اجرای پایتون</span>
              {error.line && (
                <button
                  onClick={() => onErrorLineClick?.(error.line!)}
                  className="px-1.5 py-0.5 rounded bg-rose-900/60 hover:bg-rose-800 text-[10px] text-white underline cursor-pointer mr-2"
                >
                  پرش به خط {error.line}
                </button>
              )}
            </div>
            <p className="text-[11px] text-rose-200" dir="ltr">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
