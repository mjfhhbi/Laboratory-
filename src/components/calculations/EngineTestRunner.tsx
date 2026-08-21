import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ShieldCheck, 
  Cpu, 
  Clock, 
  Layers, 
  Check 
} from 'lucide-react';
import { runCalculationEngineSelfTests, SelfTestResult } from '../../lib/calculations/calculationEngine';

export const EngineTestRunner: React.FC = () => {
  const [suiteResult, setSuiteResult] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: SelfTestResult[];
  } | null>(null);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const executeTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runCalculationEngineSelfTests();
      setSuiteResult(res);
      setIsRunning(false);
    }, 150);
  };

  useEffect(() => {
    executeTests();
  }, []);

  const categories = suiteResult
    ? Array.from(new Set(suiteResult.results.map(r => r.category)))
    : [];

  const filteredResults = suiteResult
    ? selectedCategory === 'all'
      ? suiteResult.results
      : suiteResult.results.filter(r => r.category === selectedCategory)
    : [];

  return (
    <div className="space-y-6" id="engine-test-runner-container">
      {/* Header & Stats Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                مرکز آزمون‌های خودکار و صحت‌سنجی موتور محاسبات (Unit Self-Test Suite)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                اجرای زنده مجموعه تست‌های واحد بر روی فرمول‌های شیمی غذا، موتور آمار، مبدل واحد و ارزیاب درختی عبارات
              </p>
            </div>
          </div>

          <button
            onClick={executeTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition-all shadow-xs disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>در حال اجرا...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>اجرای مجدد آزمون‌ها</span>
              </>
            )}
          </button>
        </div>

        {/* Overall Status Banner */}
        {suiteResult && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold block">
                  آزمون‌های موفق (Passed)
                </span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-200 font-mono">
                  {suiteResult.passed} / {suiteResult.total}
                </span>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-600 dark:text-stone-400 font-semibold block">
                  آزمون‌های ناموفق (Failed)
                </span>
                <span className="text-2xl font-black text-stone-800 dark:text-stone-200 font-mono">
                  {suiteResult.failed}
                </span>
              </div>
              <XCircle className={`w-8 h-8 ${suiteResult.failed > 0 ? 'text-rose-500' : 'text-stone-300'}`} />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-800 dark:text-blue-300 font-semibold block">
                  ضریب پوشش و سلامت (Coverage)
                </span>
                <span className="text-2xl font-black text-blue-700 dark:text-blue-200 font-mono">
                  {Math.round((suiteResult.passed / (suiteResult.total || 1)) * 100)}%
                </span>
              </div>
              <Cpu className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        )}
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }`}
          >
            همه بخش‌ها ({suiteResult?.total})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {cat} ({suiteResult?.results.filter(r => r.category === cat).length})
            </button>
          ))}
        </div>
      )}

      {/* Tests Results List */}
      <div className="space-y-3">
        {filteredResults.map((test) => (
          <div
            key={test.testId}
            className={`p-4 bg-white dark:bg-stone-900 rounded-xl border shadow-xs transition-all space-y-2 ${
              test.passed
                ? 'border-emerald-200 dark:border-emerald-900/60'
                : 'border-rose-300 dark:border-rose-900 bg-rose-50/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {test.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>{test.nameFa}</span>
                    <span className="font-mono font-normal text-[10px] text-stone-400">
                      [{test.testId}]
                    </span>
                  </h4>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {test.detailsFa}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                  {test.durationMs} ms
                </span>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                  test.passed
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                }`}>
                  {test.passed ? 'موفق' : 'ناموفق'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2 bg-stone-50 dark:bg-stone-800/50 rounded border border-stone-200/60 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                <span className="font-sans text-[10px] text-stone-400 block">مقدار مورد انتظار (Expected):</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{test.expected}</span>
              </div>

              <div className="p-2 bg-stone-50 dark:bg-stone-800/50 rounded border border-stone-200/60 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                <span className="font-sans text-[10px] text-stone-400 block">مقدار خروجی واقعی (Actual Output):</span>
                <span className="font-bold">{test.actual}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
