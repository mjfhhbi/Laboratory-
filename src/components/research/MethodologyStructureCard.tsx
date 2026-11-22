import React from 'react';
import { ExperimentalDesignStructure } from '../../types/research';
import { Network, Sparkles, Sliders, Cpu, BarChart3, CheckCircle2 } from 'lucide-react';

interface MethodologyStructureCardProps {
  structure?: ExperimentalDesignStructure;
  onAutoStructureAI: () => void;
  readOnly?: boolean;
}

export const MethodologyStructureCard: React.FC<MethodologyStructureCardProps> = ({
  structure,
  onAutoStructureAI,
  readOnly = false
}) => {
  if (!structure) {
    return (
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 text-center shadow-xs">
        <Network className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
        <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
          طرح آماری و متدولوژی آزمایش‌ها (DoE) هنوز پیکربندی نشده است
        </h4>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
          می‌توانید با استفاده از الگوریتم هوشمند، بهترین طرح آماری (فاکتوریل کامل، سطح پاسخ RSM، باکس-بنکن، یا بلوک‌های تصادفی) را متناسب با تعداد متغیرهای مستقل و پاسخ‌های مورد سنجش انتخاب فرمایید.
        </p>
        {!readOnly && (
          <button
            onClick={onAutoStructureAI}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            ساختاربندی هوشمند طرح آزمایش‌ها (AI DoE)
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-indigo-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                {structure.designNameFa}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                طرح آماری استاندارد
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              مدل‌سازی آماری، آنالیز واریانس (ANOVA) و آزمون‌های چنددامنه‌ای
            </p>
          </div>
        </div>

        {!readOnly && (
          <button
            onClick={onAutoStructureAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-stone-800 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 text-indigo-700 dark:text-indigo-300 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>بازتنظیم طرح با AI</span>
          </button>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-1">
            تعداد ران‌های آزمایش (Total Runs)
          </span>
          <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
            {structure.totalRuns} تست
          </span>
        </div>

        <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-1">
            تکرار در هر تیمار (Replications)
          </span>
          <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
            {structure.replications} تکرار مستقل
          </span>
        </div>

        <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-1">
            نرم‌افزار پیشنهادی (Software)
          </span>
          <span className="text-xs font-bold font-mono text-indigo-700 dark:text-indigo-400">
            {structure.softwareRecommended}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-1">
            تعداد فاکتورهای مستقل
          </span>
          <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
            {structure.factorsCount} فاکتور
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-3 text-xs">
        {/* Factors & responses summary */}
        <div className="p-3 rounded-lg bg-stone-50/70 dark:bg-stone-850/70 border border-stone-200 dark:border-stone-800 space-y-2">
          <div>
            <span className="font-bold text-stone-700 dark:text-stone-300">ترکیب فاکتورها: </span>
            <span className="text-stone-600 dark:text-stone-400">{structure.factorsSummary}</span>
          </div>
          <div>
            <span className="font-bold text-stone-700 dark:text-stone-300">پاسخ‌های مورد پایش (Responses): </span>
            <span className="text-stone-600 dark:text-stone-400">{structure.responsesSummary}</span>
          </div>
        </div>

        {/* Statistical model */}
        <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-300 mb-1 text-[11px]">
            <Cpu className="w-3.5 h-3.5" />
            <span>مدل ریاضی رگرسیون / معادله آماری (Statistical Model):</span>
          </div>
          <div className="font-mono text-[11px] text-indigo-950 dark:text-indigo-200 p-2 bg-white/70 dark:bg-stone-900/70 rounded border border-indigo-200/50 dark:border-indigo-800/50" dir="ltr">
            {structure.statisticalModelFa}
          </div>
        </div>

        {/* Anova procedures */}
        <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300 mb-1 text-[11px]">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>پروتکل آزمون آنالیز واریانس و برازش داده‌ها (ANOVA & Validation):</span>
          </div>
          <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
            {structure.anovaProcedureFa}
          </p>
        </div>
      </div>
    </div>
  );
};
