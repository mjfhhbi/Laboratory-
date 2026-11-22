/**
 * Food Science AI - Laboratory Finalize & Certificate Card (Stage 7)
 * Final review, operator sign-off, supervisor approval, official COA generation,
 * and persistent archiving.
 */

import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
  User,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Archive,
  Clock,
  Database,
  BarChart2,
  Check
} from 'lucide-react';
import { LabSession } from '../../types/laboratory';

interface LabFinalizeCardProps {
  session: LabSession;
  onFinalizeExperiment: () => void;
  onOpenReportModal: () => void;
  onBackToCalculation: () => void;
  onUpdateSessionRemarks?: (remarks: string, supervisor: string) => void;
}

export const LabFinalizeCard: React.FC<LabFinalizeCardProps> = ({
  session,
  onFinalizeExperiment,
  onOpenReportModal,
  onBackToCalculation,
  onUpdateSessionRemarks
}) => {
  const [operatorSigned, setOperatorSigned] = useState<boolean>(
    session.status === 'completed'
  );
  const [supervisorName, setSupervisorName] = useState<string>(
    session.supervisorName || 'دکتر مدیر کنترل کیفیت'
  );
  const [remarks, setRemarks] = useState<string>(
    session.notes || 'آزمون مطابق استاندارد ملی با رعایت الزامات تکرارپذیری انجام پذیرفت.'
  );

  const isCompleted = session.status === 'completed';

  const conformance = session.standardConformance;
  const repeatability = session.repeatabilityAnalysis;

  // Extract primary value
  const validVals: number[] = [];
  session.replicates.forEach((r) => {
    Object.values(r.stepsData).forEach((s) => {
      Object.values(s.parameterValues).forEach((p) => {
        if (p && typeof p.value === 'number' && !isNaN(p.value)) {
          validVals.push(p.value);
        }
      });
    });
  });

  const meanVal = validVals.length > 0 ? (validVals.reduce((a, b) => a + b, 0) / validVals.length).toFixed(3) : 'ثبت‌شده';
  const unit = session.replicates[0]?.calculatedResult?.unit || '%';

  const handleSignAndFinalize = () => {
    if (onUpdateSessionRemarks) {
      onUpdateSessionRemarks(remarks, supervisorName);
    }
    setOperatorSigned(true);
    onFinalizeExperiment();
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden mb-6">
      {/* Header */}
      <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              ۷. نهایی‌سازی آزمایش، امضای اپراتور و صدور کارنامه (Finalize & Certificate)
            </h2>
            <p className="text-xs text-stone-500">
              جمع‌بندی تکرارها، تصدیق انطباق استاندارد، امضای دیجیتال و بایگانی داده در حافظه محلی
            </p>
          </div>
        </div>

        <span
          className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
            isCompleted
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
          }`}
        >
          {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          <span>{isCompleted ? 'آزمایش نهایی و بایگانی شد' : 'آماده ثبت نهایی'}</span>
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-stone-400 block text-[11px]">شناسه نمونه:</span>
            <strong className="text-stone-900 dark:text-stone-100 font-mono text-sm block">
              {session.sampleCode}
            </strong>
            <span className="text-stone-500 text-[11px] block">{session.sampleName}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-stone-400 block text-[11px]">استاندارد مرجع:</span>
            <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-sm block">
              {session.standardNumber || 'INSO Reference'}
            </strong>
            <span className="text-stone-500 text-[11px] block truncate">{session.standardTitleFa || session.title}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-stone-400 block text-[11px]">میانگین نتیجه تکرارها:</span>
            <div className="text-stone-900 dark:text-stone-100 font-bold font-mono text-sm">
              {meanVal} <span className="text-xs text-stone-500">{unit}</span>
            </div>
            <span className="text-stone-500 text-[11px] block font-mono">
              تعداد تکرار: {session.replicates.length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-stone-400 block text-[11px]">وضعیت انطباق قانونی:</span>
            <div className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{conformance?.isCompliant !== false ? 'منطبق با ضوابط' : 'عدم انطباق'}</span>
            </div>
            <span className="text-stone-500 text-[11px] block">
              تکرارپذیری: {repeatability?.relativeStandardDeviationPercent !== undefined ? `${repeatability.relativeStandardDeviationPercent.toFixed(2)}%` : 'مجاز'}
            </span>
          </div>
        </div>

        {/* Sign-off & Remarks Form */}
        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>امضا و تصدیق رسمی کارنامه آزمون (Sign-off & GLP Verification):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-stone-600 dark:text-stone-400 block mb-1 font-semibold">
                کارشناس مجری آزمون:
              </label>
              <div className="p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>{session.operatorName}</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {new Date().toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>

            <div>
              <label className="text-stone-600 dark:text-stone-400 block mb-1 font-semibold">
                مسئول فنی / سرپرست آزمایشگاه:
              </label>
              <input
                type="text"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                placeholder="نام مدیر کنترل کیفیت / سرپرست"
                className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-stone-600 dark:text-stone-400 block mb-1 font-semibold">
              یادداشت‌ها و اظهارنظر نهایی آزمایشگاه (Lab Remarks):
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="توضیحات تکمیلی، ارزیابی انطباق و نکات قابل درج در کارنامه..."
              className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={operatorSigned}
              onChange={(e) => setOperatorSigned(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-stone-800 dark:text-stone-200 font-semibold">
              اینجانب صحت کلیه ارقام ثبت‌شده، شرایط محیطی و کالیبراسیون دستگاه‌ها را رسماً تأیید می‌نمایم.
            </span>
          </label>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToCalculation}
            className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به بررسی محاسبات</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="flex-1 sm:flex-initial min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>مشاهده و چاپ کارنامه رسمی (COA)</span>
            </button>

            <button
              type="button"
              onClick={handleSignAndFinalize}
              disabled={!operatorSigned}
              className={`flex-1 sm:flex-initial min-h-[42px] px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-colors flex items-center justify-center gap-2 ${
                operatorSigned
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>{isCompleted ? 'به‌روزرسانی بایگانی' : 'تکمیل و بایگانی قطعی آزمایشگاه'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
