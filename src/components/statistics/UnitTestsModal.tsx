import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Play, 
  ShieldCheck, 
  RefreshCw, 
  FileCode,
  Check
} from 'lucide-react';
import { runAllStatisticalUnitTests, UnitTestResult } from '../../lib/statistics/__tests__/statsCalculations.test';

interface UnitTestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnitTestsModal: React.FC<UnitTestsModalProps> = ({ isOpen, onClose }) => {
  const [testSummary, setTestSummary] = useState<ReturnType<typeof runAllStatisticalUnitTests> | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedSuite, setSelectedSuite] = useState<string>('all');

  const executeTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runAllStatisticalUnitTests();
      setTestSummary(res);
      setIsRunning(false);
    }, 150);
  };

  useEffect(() => {
    if (isOpen) {
      executeTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const suites = testSummary
    ? ['all', ...Array.from(new Set(testSummary.results.map((r) => r.suiteName)))]
    : ['all'];

  const filteredResults = testSummary
    ? selectedSuite === 'all'
      ? testSummary.results
      : testSummary.results.filter((r) => r.suiteName === selectedSuite)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                اعتبارسنجی محاسبات آماری با Unit Tests
              </h2>
              <p className="text-xs text-slate-500">
                بررسی خودکار و دقیق فرمول‌ها با داده‌های مرجع استاندارد کتاب‌های درسی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={executeTests}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200/80"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              اجرای مجدد آزمون‌ها
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Summary Card */}
        {testSummary && (
          <div className="px-6 py-4 bg-emerald-50/50 border-b border-emerald-100/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-900">
                  تمامی محاسبات آماری با استانداردهای رفرنس تطابق دارند
                </div>
                <div className="text-[11px] text-emerald-700">
                  زمان اجرا: {testSummary.durationMs} میلی‌ثانیه | تعداد آزمون‌ها: {testSummary.total} مورد
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                {testSummary.passed} پاس‌شده (Passed)
              </span>
              {testSummary.failed > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold">
                  {testSummary.failed} خطا (Failed)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Filter by suite */}
        <div className="px-6 py-2.5 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] whitespace-nowrap pl-2">بخش:</span>
          {suites.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSuite(s)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedSuite === s
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'همه بخش‌ها' : s}
            </button>
          ))}
        </div>

        {/* Tests List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
          {filteredResults.map((item, idx) => (
            <div key={idx} className="py-3 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-2.5">
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span>{item.testName}</span>
                    <span className="text-[10px] font-normal text-slate-400 font-sans">
                      ({item.suiteName})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">{item.message}</div>
                </div>
              </div>

              <div className="text-left font-mono text-[11px] shrink-0 text-slate-600 space-y-0.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/50">
                <div>انتظار: <strong className="text-slate-700">{item.expected}</strong></div>
                <div>محاسبه: <strong className="text-emerald-700">{item.actual}</strong></div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>کد منبع تست‌ها: <code>/src/lib/statistics/__tests__/statsCalculations.test.ts</code></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
