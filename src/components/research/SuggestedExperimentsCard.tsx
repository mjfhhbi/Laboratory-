import React from 'react';
import { SuggestedExperiment } from '../../types/research';
import { FlaskConical, Sparkles, Plus, CheckCircle2, Wrench, ShieldCheck } from 'lucide-react';

interface SuggestedExperimentsCardProps {
  experiments: SuggestedExperiment[];
  onAutoSuggestAI: () => void;
  readOnly?: boolean;
}

export const SuggestedExperimentsCard: React.FC<SuggestedExperimentsCardProps> = ({
  experiments,
  onAutoSuggestAI,
  readOnly = false
}) => {
  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              پروتکل‌ها و آزمایش‌های پیشنهادی برای پروژه (Lab Test Protocols)
            </h3>
            {experiments.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {experiments.length} آزمون
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            تست‌های فیزیکوشیمیایی، دستگاهی، بافت‌سنجی و میکروبی با مراجع رسمی استاندارد و شرایط اجرایی
          </p>
        </div>

        {!readOnly && (
          <button
            onClick={onAutoSuggestAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>پیشنهاد آزمون‌های تکمیلی (AI)</span>
          </button>
        )}
      </div>

      <div className="p-4">
        {experiments.length === 0 ? (
          <div className="p-6 text-center">
            <FlaskConical className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
            <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
              هنوز پروتکل آزمایشی پیشنهاد نشده است
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
              با انتخاب دکمه بالا، هوش مصنوعی متناسب با ماتریکس ماده غذایی و متغیرهای تعریف‌شده، آزمون‌های استاندارد AOAC، INSO و دستگاهی مورد نیاز را پیشنهاد می‌دهد.
            </p>
            {!readOnly && (
              <button
                onClick={onAutoSuggestAI}
                className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                تولید پیشنهادات آزمایشگاهی
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {experiments.map((exp) => (
              <div
                key={exp.id}
                className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 flex flex-col justify-between text-xs space-y-2.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {exp.testNameFa}
                      </div>
                      <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 mt-0.5" dir="ltr">
                        {exp.testNameEn}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 shrink-0">
                      {exp.categoryTitleFa}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>مرجع متد: </span>
                      <span className="font-mono">{exp.standardReference}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                      <Wrench className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                      <span>دستگاه / تجهیزات: </span>
                      <span className="font-semibold">{exp.recommendedEquipment}</span>
                    </div>

                    <div className="text-stone-600 dark:text-stone-400">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">شرایط فرآیند: </span>
                      <span>{exp.processConditions}</span>
                    </div>

                    <div className="text-stone-600 dark:text-stone-400">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">شاخص خروجی: </span>
                      <span className="font-mono text-indigo-700 dark:text-indigo-300">{exp.targetParameter}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                  <span className="font-bold text-stone-800 dark:text-stone-200">ضرورت علمی: </span>
                  {exp.justificationFa}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
