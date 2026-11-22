import React from 'react';
import { MethodologicalWeakness } from '../../types/research';
import { AlertTriangle, ShieldAlert, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface WeaknessesAuditCardProps {
  weaknesses: MethodologicalWeakness[];
  onRunAuditAI: () => void;
  readOnly?: boolean;
}

export const WeaknessesAuditCard: React.FC<WeaknessesAuditCardProps> = ({
  weaknesses,
  onRunAuditAI,
  readOnly = false
}) => {
  const criticalCount = weaknesses.filter((w) => w.severity === 'critical').length;
  const moderateCount = weaknesses.filter((w) => w.severity === 'moderate').length;

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              ممیزی نقادانه و نقاط ضعف متدولوژی (Methodological Weakness Audit)
            </h3>
            {weaknesses.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {weaknesses.length} مورد بازبینی
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            ارزیابی دقیق عدم کفایت حجم نمونه، فقدان متغیرهای کنترل، خطاهای کینتیک و تعمیم‌پذیری آزمون‌ها
          </p>
        </div>

        {!readOnly && (
          <button
            onClick={onRunAuditAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>اجرای ممیزی نقادانه با AI</span>
          </button>
        )}
      </div>

      <div className="p-4">
        {weaknesses.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
              هیچ نقص متدولوژیکی بحرانی ثبت نشده است
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
              طرح پژوهش، متغیرها و شرایط آزمایشگاهی اولیه متوازن به نظر می‌رسند. برای بررسی دقیق‌تر ممیزی توسط هوش مصنوعی، دکمه بالا را انتخاب فرمایید.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {weaknesses.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  item.severity === 'critical'
                    ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20'
                    : item.severity === 'moderate'
                    ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 ${
                        item.severity === 'critical'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    />
                    <span>{item.aspectTitleFa}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.severity === 'critical'
                        ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300'
                        : item.severity === 'moderate'
                        ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {item.severity === 'critical'
                      ? 'بحرانی (Critical)'
                      : item.severity === 'moderate'
                      ? 'متوسط (Moderate)'
                      : 'فرعی'}
                  </span>
                </div>

                <div className="space-y-2 pr-6">
                  <div>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                      اشکال شناسایی‌شده:{' '}
                    </span>
                    <span className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {item.identifiedIssueFa}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">
                        راهکار اصلاحی پیشنهادی:{' '}
                      </span>
                      <span className="text-stone-700 dark:text-stone-300 leading-relaxed">
                        {item.correctiveRecommendationFa}
                      </span>
                    </div>
                  </div>

                  {item.scientificReference && (
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 font-mono">
                      <span>مرجع الزامی:</span>
                      <span className="font-semibold text-stone-700 dark:text-stone-300">
                        {item.scientificReference}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
