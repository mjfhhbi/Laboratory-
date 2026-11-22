/**
 * Food Science AI - Laboratory Reagents & Solutions Check Card (Stage 3)
 * Rigorously checks chemical reagents, grade/purity, solution preparation,
 * standardization, and safety/hazard handling.
 */

import React from 'react';
import {
  FlaskConical,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Info,
  Droplet,
  Flame,
  Check,
  Plus
} from 'lucide-react';
import { LabSession } from '../../types/laboratory';

interface LabReagentsCheckCardProps {
  session: LabSession;
  onToggleReagentCheck: (reagId: string) => void;
  onMarkAllReagentsChecked: () => void;
  onProceedToSamplePrep: () => void;
  onBackToCalibration: () => void;
}

export const LabReagentsCheckCard: React.FC<LabReagentsCheckCardProps> = ({
  session,
  onToggleReagentCheck,
  onMarkAllReagentsChecked,
  onProceedToSamplePrep,
  onBackToCalibration
}) => {
  const totalReagents = session.reagentsAndChemicals.length;
  const verifiedReagentsCount = session.reagentsAndChemicals.filter((r) => r.isPrepared).length;
  const allVerified = totalReagents > 0 ? verifiedReagentsCount === totalReagents : true;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden mb-6">
      {/* Header */}
      <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              ۳. بررسی معرف‌ها، محلول‌ها و ایمنی مواد (Reagents & Solutions)
            </h2>
            <p className="text-xs text-stone-500">
              بررسی خلوص آنالیتیکال (AR)، فاکتور نرمالیته محلول‌ها، شناساگرها و برگه‌های ایمنی (MSDS)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold ${
              allVerified
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
            }`}
          >
            {verifiedReagentsCount} از {totalReagents} معرف آماده
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Verification Guideline Banner */}
        <div className="p-4 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/60 text-xs space-y-1.5 text-cyan-950 dark:text-cyan-200">
          <div className="font-bold flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>دستورالعمل کنترل کیفی معرف‌ها و تیتراسیون (INSO / ISO 17025):</span>
          </div>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
            کلیه محلول‌های استاندارد تیترانت (مانند هیدروکسید پتاسیم یا تیوسولفات سدیم) باید دارای فاکتور نرمالیته معین و تاریخ ساخت معتبر باشند. در صورت بروز هرگونه کدورت یا تغییر فاز در معرف‌ها، باید مجدداً تهیه یا استانداردسازی شوند.
          </p>
        </div>

        {/* Reagents Check-List Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-cyan-600" />
              <span>فهرست معرف‌ها و مواد شیمیایی مورد نیاز آزمون:</span>
            </h3>

            {totalReagents > 0 && !allVerified && (
              <button
                type="button"
                onClick={onMarkAllReagentsChecked}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
              >
                تأیید یکجای کیفیت و آماده‌سازی کلیه معرف‌ها
              </button>
            )}
          </div>

          {totalReagents === 0 ? (
            <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 dark:bg-stone-850 rounded-xl">
              معرف شیمیایی ویژه‌ای برای این آزمون ثبت نشده است (آزمون فیزیکی یا ارگانولپتیک).
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {session.reagentsAndChemicals.map((reag) => (
                <div
                  key={reag.id}
                  onClick={() => onToggleReagentCheck(reag.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    reag.isPrepared
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={reag.isPrepared}
                    onChange={() => onToggleReagentCheck(reag.id)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0 cursor-pointer"
                  />

                  <div className="flex-1 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-stone-900 dark:text-stone-100 font-bold">
                        {reag.name}
                      </strong>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          reag.isPrepared
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {reag.isPrepared ? 'آماده و تاییدشده' : 'نیازمند بررسی'}
                      </span>
                    </div>

                    <p className="text-stone-500 dark:text-stone-400 text-[11px] leading-relaxed">
                      {reag.gradeOrConcentration || 'درجه آنالیتیکال (Analytical Reagent Grade - AR)'}
                      {reag.safetyInfo ? ` · نکات ایمنی: ${reag.safetyInfo}` : ' · طبق برگه ایمنی MSDS نگهداری شود.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Safety & Chemical Handling Box */}
        <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs space-y-2">
          <div className="font-bold flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span>نکات ایمنی آزمایشگاهی (Laboratory Safety & GLP):</span>
          </div>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
            استفاده از روپوش آزمایشگاهی، دستکش نیتریل و عینک حفاظتی هنگام کار با حلال‌های آلی (مانند اتانول، دی‌اتیل‌اتر) و محلول‌های قلیایی الزامی است. حلال‌های فرار باید زیر هود شیمیایی تهویه‌دار استفاده گردند.
          </p>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToCalibration}
            className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به تجهیزات و کالیبراسیون</span>
          </button>

          <button
            type="button"
            onClick={onProceedToSamplePrep}
            className="min-h-[40px] px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>ادامه به آماده‌سازی نمونه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
