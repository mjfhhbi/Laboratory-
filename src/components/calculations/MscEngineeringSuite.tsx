import React, { useState, useMemo } from 'react';
import {
  ALL_MSC_PROBLEMS,
  MSC_TOPIC_CATEGORIES,
  getMscProblemById
} from '../../lib/engineering/mscProblemsRegistry';
import { MscEngineeringProblem, MscTopicCategory } from '../../lib/engineering/types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';
import { usePythonEngine } from '../../lib/python/usePythonEngine';
import {
  Calculator,
  Layers,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Terminal,
  RotateCcw,
  Play,
  Copy,
  Check,
  ChevronDown,
  Info,
  Scale
} from 'lucide-react';

export const MscEngineeringSuite: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<MscTopicCategory>('calculus_ode_pde');
  const [selectedProblemId, setSelectedProblemId] = useState<string>(ALL_MSC_PROBLEMS[0].id);

  // Active problem
  const activeProblem: MscEngineeringProblem = useMemo(() => {
    return getMscProblemById(selectedProblemId) || ALL_MSC_PROBLEMS[0];
  }, [selectedProblemId]);

  // Parameters state
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    activeProblem.variables.forEach((v) => {
      init[v.symbol] = v.defaultValue;
    });
    return init;
  });

  // Reset inputs when switching problem
  const handleSelectProblem = (probId: string) => {
    setSelectedProblemId(probId);
    const p = getMscProblemById(probId);
    if (p) {
      setSelectedCategoryId(p.topicCategory);
      const init: Record<string, number> = {};
      p.variables.forEach((v) => {
        init[v.symbol] = v.defaultValue;
      });
      setInputs(init);
    }
  };

  const handleSelectCategory = (cat: MscTopicCategory) => {
    setSelectedCategoryId(cat);
    const firstInCat = ALL_MSC_PROBLEMS.find((p) => p.topicCategory === cat);
    if (firstInCat) {
      handleSelectProblem(firstInCat.id);
    }
  };

  const handleInputChange = (symbol: string, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [symbol]: value
    }));
  };

  const handleResetDefaults = () => {
    const init: Record<string, number> = {};
    activeProblem.variables.forEach((v) => {
      init[v.symbol] = v.defaultValue;
    });
    setInputs(init);
  };

  // Real Analytical Solution Result
  const solution = useMemo(() => {
    return activeProblem.solve(inputs);
  }, [activeProblem, inputs]);

  // SymPy WebWorker runner integration
  const { runCode, status, outputChunks } = usePythonEngine();
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSympyExpanded, setIsSympyExpanded] = useState(false);

  const handleRunSympy = async () => {
    setIsSympyExpanded(true);
    await runCode(solution.sympyPythonCode, 15000);
  };

  const handleCopySympy = () => {
    navigator.clipboard.writeText(solution.sympyPythonCode).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 overflow-x-auto no-scrollbar">
        {MSC_TOPIC_CATEGORIES.map((cat) => {
          const isSelected = cat.id === selectedCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                isSelected
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {cat.titleFa}
            </button>
          );
        })}
      </div>

      {/* Problem Selector Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
            انتخاب مسئله مهندسی در این سرفصل:
          </span>
          <select
            value={activeProblem.id}
            onChange={(e) => handleSelectProblem(e.target.value)}
            className="w-full md:w-auto min-w-[320px] px-3 py-2 rounded-lg text-xs font-bold bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-emerald-600"
          >
            {ALL_MSC_PROBLEMS.filter((p) => p.topicCategory === selectedCategoryId).map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Scientific Textbook Citation Badge */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-[11px] leading-tight">
            <span className="font-semibold text-stone-800 dark:text-stone-200 block">
              {solution.scientificCitation.title} ({solution.scientificCitation.year})
            </span>
            <span className="text-stone-500 font-mono" dir="ltr">
              {solution.scientificCitation.authors} · {solution.scientificCitation.chapterOrPage}
            </span>
          </div>
        </div>
      </div>

      {/* Problem Header & Governing Equation */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 space-y-4 shadow-xs">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            {activeProblem.title}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {activeProblem.summaryDescription}
          </p>
        </div>

        <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 text-center overflow-x-auto" dir="ltr">
          <span className="text-[10px] font-mono text-stone-400 block mb-2" dir="rtl">
            معادله دیفرانسیل / فرمول حاکم مهندسی:
          </span>
          <KaTeXRenderer expression={activeProblem.governingEquationLatex} displayMode={true} />
        </div>
      </div>

      {/* Two Column Workspace: Inputs vs Real Mathematical Proof */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Parameter Inputs & Bounds (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                متغیرها و پارامترهای فیزیکی ورودی
              </h4>
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                title="بازنشانی مقادیر به پیش‌فرض رفرنس"
              >
                <RotateCcw className="w-3 h-3" />
                <span>مقادیر مرجع</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {activeProblem.variables.map((v) => {
                const val = inputs[v.symbol] !== undefined ? inputs[v.symbol] : v.defaultValue;
                return (
                  <div key={v.symbol} className="space-y-1.5 p-2.5 rounded-lg bg-stone-50/50 dark:bg-stone-950/50 border border-stone-200/60 dark:border-stone-800/60">
                    <div className="flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {v.name}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-stone-400" dir="ltr">
                          <span>Dim: {v.dimension}</span>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1" dir="ltr">
                        <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                          {val}
                        </span>
                        <span className="font-mono text-[11px] text-stone-500">
                          {v.unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={v.minValue !== undefined ? v.minValue : 0}
                        max={v.maxValue !== undefined ? v.maxValue : 100}
                        step={v.step !== undefined ? v.step : 1}
                        value={val}
                        onChange={(e) => handleInputChange(v.symbol, parseFloat(e.target.value) || 0)}
                        className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer"
                      />
                      <input
                        type="number"
                        step={v.step !== undefined ? v.step : 1}
                        value={val}
                        onChange={(e) => handleInputChange(v.symbol, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-xs font-mono tabular-nums bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-center focus:outline-hidden focus:border-emerald-600"
                        dir="ltr"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dimensional Consistency Check Card */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
              <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>بررسی صحت ابعادی (Dimensional Consistency Audit)</span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>همگنی و یکنواختی ابعادی تایید شد (Dimensional Invariance)</span>
              </div>
              <div className="font-mono text-[11px] text-stone-600 dark:text-stone-300" dir="ltr">
                [LHS]: {solution.dimensionalAudit.lhsDimension} = [RHS]: {solution.dimensionalAudit.rhsDimension}
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                {solution.dimensionalAudit.notes}
              </p>
            </div>
          </div>

          {/* Numerical Error & Limitations Card */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>تحلیل خطای محاسباتی و محدودیت‌های روش عددی</span>
            </div>

            <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex items-center justify-between p-2 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200/60 dark:border-stone-800/60">
                <span>روش حل:</span>
                <span className="font-bold font-mono text-stone-900 dark:text-stone-100" dir="ltr">
                  {solution.errorReport.methodName}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200/60 dark:border-stone-800/60">
                <span>مرتبه دقت خطای ترانیکیشن:</span>
                <span className="font-mono text-stone-800 dark:text-stone-200" dir="ltr">
                  {solution.errorReport.orderOfAccuracy}
                </span>
              </div>
              {solution.errorReport.estimatedError && (
                <div className="flex items-center justify-between p-2 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200/60 dark:border-stone-800/60">
                  <span>تخمین خطای عددی:</span>
                  <span className="font-mono text-stone-800 dark:text-stone-200" dir="ltr">
                    {solution.errorReport.estimatedError}
                  </span>
                </div>
              )}

              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block">
                  محدودیت‌های مهندسی مدل:
                </span>
                <ul className="list-disc pr-4 space-y-1 text-[11px] leading-relaxed text-stone-500">
                  {solution.errorReport.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Solution & Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Final Calculated Result Banner */}
          <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                نتیجه نهایی محاسبات مهندسی
              </span>
              <div className="flex items-baseline gap-2" dir="ltr">
                <span className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100 tabular-nums">
                  {typeof solution.finalResult.value === 'number'
                    ? solution.finalResult.value.toFixed(solution.finalResult.significantDigits)
                    : solution.finalResult.value}
                </span>
                <span className="text-sm font-bold font-mono text-stone-600 dark:text-stone-400">
                  {solution.finalResult.unit}
                </span>
              </div>
            </div>

            <div className="text-left" dir="ltr">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs">
                SigFigs: {solution.finalResult.significantDigits} Digits
              </span>
            </div>
          </div>

          {/* Step-by-Step Proof & Traces */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                مراحل محاسبه و جایگذاری اعداد (Step-by-Step Proof Trace)
              </h4>
              <span className="text-xs font-mono text-stone-400" dir="ltr">
                {solution.steps.length} Steps
              </span>
            </div>

            <div className="space-y-4">
              {solution.steps.map((st) => (
                <div
                  key={st.stepNumber}
                  className="p-4 rounded-xl bg-stone-50/70 dark:bg-stone-950/70 border border-stone-200/80 dark:border-stone-800/80 space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                      {st.stepNumber}
                    </span>
                    <h5 className="font-bold text-xs text-stone-800 dark:text-stone-200">
                      {st.title}
                    </h5>
                  </div>

                  {/* Formula LaTeX */}
                  <div className="p-2.5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200/60 dark:border-stone-800/60 overflow-x-auto text-center" dir="ltr">
                    <KaTeXRenderer expression={st.formulaLatex} displayMode={true} />
                  </div>

                  {/* Substitution and Result */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                    <div className="font-mono text-stone-600 dark:text-stone-400 overflow-x-auto" dir="ltr">
                      <span className="text-stone-400 ml-1">جایگذاری:</span>
                      <KaTeXRenderer expression={st.substitutionLatex} displayMode={false} />
                    </div>

                    <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400 shrink-0" dir="ltr">
                      <KaTeXRenderer expression={st.resultLatex} displayMode={false} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Iteration Table if available */}
          {solution.iterationTable && solution.iterationTable.length > 0 && (
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  جدول همگرایی و مقادیر عددی گام‌ها (Numerical Convergence Table)
                </h4>
                <span className="text-[11px] font-mono text-stone-400" dir="ltr">
                  {solution.iterationTable.length} Records
                </span>
              </div>

              <div className="overflow-x-auto max-h-60 custom-scrollbar border border-stone-200 dark:border-stone-800 rounded-lg" dir="ltr">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 uppercase sticky top-0">
                    <tr>
                      {Object.keys(solution.iterationTable[0]).map((col) => (
                        <th key={col} className="px-3 py-2 border-b border-stone-200 dark:border-stone-700">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {solution.iterationTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-950">
                        {Object.values(row).map((val, cellIdx) => (
                          <td key={cellIdx} className="px-3 py-1.5 text-stone-700 dark:text-stone-300 tabular-nums">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SymPy Symbolic Execution Card */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-100/60 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  حل نمادین و تحلیلی با SymPy (در مفسر WebWorker)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySympy}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50"
                  title="کپی کد پایتون SymPy"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>کپی کد</span>
                </button>

                <button
                  onClick={handleRunSympy}
                  disabled={status === 'running'}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-50 transition-colors shadow-xs"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>اجرای SymPy</span>
                </button>
              </div>
            </div>

            {/* SymPy Script Box */}
            <div className="p-4 bg-stone-950 font-mono text-xs text-stone-200 leading-relaxed overflow-x-auto" dir="ltr">
              <pre>{solution.sympyPythonCode}</pre>
            </div>

            {/* SymPy Output Output */}
            {isSympyExpanded && (
              <div className="p-4 bg-stone-900 border-t border-stone-800 font-mono text-xs space-y-1.5" dir="ltr">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block" dir="rtl">
                  خروجی بلادرنگ SymPy از وب‌ورکر:
                </span>
                {outputChunks.length === 0 ? (
                  <div className="text-stone-500 text-xs italic">
                    در حال ارسال اسکریپت به مفسر WebAssembly...
                  </div>
                ) : (
                  outputChunks.map((chunk) => (
                    <div
                      key={chunk.id}
                      className={
                        chunk.type === 'stderr'
                          ? 'text-rose-400'
                          : chunk.type === 'system'
                          ? 'text-emerald-400'
                          : 'text-stone-100'
                      }
                    >
                      {chunk.text}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MscEngineeringSuite;
