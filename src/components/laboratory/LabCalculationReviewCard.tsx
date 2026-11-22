/**
 * Food Science AI - Laboratory Calculation, QC & Standard Review Card (Stage 6)
 * Calculates final results, analyzes replicate repeatability (r/R), evaluates standard conformance,
 * and manages authentic laboratory Quality Control (Blank, Duplicate, Calibration, Recovery, CRM).
 */

import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BarChart2,
  Layers,
  Copy,
  Check,
  Info,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { LabSession } from '../../types/laboratory';
import { LabSessionQCData } from '../../types/qualityControl';
import { computeSessionRepeatability, evaluateStandardConformance } from '../../lib/laboratory/validationEngine';
import { LabQualityControlCard } from './LabQualityControlCard';

interface LabCalculationReviewCardProps {
  session: LabSession;
  onProceedToFinalize: () => void;
  onBackToProcedure: () => void;
  onUpdateQCData?: (qcData: LabSessionQCData) => void;
}

export const LabCalculationReviewCard: React.FC<LabCalculationReviewCardProps> = ({
  session,
  onProceedToFinalize,
  onBackToProcedure,
  onUpdateQCData
}) => {
  const [activeTab, setActiveTab] = useState<'calculations' | 'qc'>('calculations');
  const [copiedFormula, setCopiedFormula] = useState(false);

  // Compute live statistics and conformance
  const repeatability = session.repeatabilityAnalysis || computeSessionRepeatability(session);
  const conformance = session.standardConformance || evaluateStandardConformance(session);

  // Collect primary results from replicates
  const replicateResults = session.replicates.map((r) => {
    const stepWithParam = Object.values(r.stepsData)
      .flatMap((s) => Object.values(s.parameterValues))
      .find((p) => p && typeof p.value === 'number' && !isNaN(p.value));

    const val = r.calculatedResult?.primaryValue ?? (stepWithParam ? Number(stepWithParam.value) : undefined);
    return {
      replicateNumber: r.replicateNumber,
      title: r.title,
      value: val,
      unit: r.calculatedResult?.unit || stepWithParam?.unit || '%',
      status: r.status
    };
  });

  const validValues = replicateResults.filter((r) => r.value !== undefined).map((r) => r.value!);
  const meanValue =
    validValues.length > 0
      ? (validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(3)
      : 'ثبت‌نشده';

  const primaryUnit = replicateResults[0]?.unit || '%';

  const handleCopyFormula = () => {
    const formulaText = session.notes || 'محاسبه بر اساس رابطه استاندارد و تکرارهای آزمون';
    navigator.clipboard.writeText(formulaText);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  const qcStatus = session.qcData?.overallStatus || 'unknown';

  return (
    <div className="space-y-6" dir="rtl">
      {/* Stage 6 Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                ۶. محاسبه نتیجه، کنترل کیفیت و ارزیابی انطباق (Calculation & Quality Review)
              </h2>
              <p className="text-xs text-stone-500">
                تحلیل آماری تکرارها، تکرارپذیری (r)، کنترل کیفیت (QC) و سنجش انطباق با حدود مجاز استاندارد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span
              className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                conformance.isCompliant
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
              }`}
            >
              {conformance.isCompliant ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              <span>{conformance.isCompliant ? 'منطبق با استاندارد مرجع' : 'نیازمند بررسی / عدم انطباق'}</span>
            </span>
          </div>
        </div>

        {/* Sub-Tabs: Calculations & Repeatability vs Quality Control (QC) */}
        <div className="px-6 pt-3 bg-stone-100/60 dark:bg-stone-850/60 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('calculations')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'calculations'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-extrabold'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>نتایج محاسبات و تکرارها (Calculations & Repeatability)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qc')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'qc'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-extrabold'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>کنترل کیفیت آزمایشگاهی (Quality Control - Pass/Fail/Unknown)</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                qcStatus === 'pass'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : qcStatus === 'fail'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {qcStatus.toUpperCase()}
            </span>
          </button>
        </div>

        {/* TAB 1: CALCULATIONS & REPEATABILITY */}
        {activeTab === 'calculations' && (
          <div className="p-6 space-y-6">
            {/* Primary Calculation Summary Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center space-y-1">
                <span className="text-xs text-stone-500 block">میانگین نتایج تکرارها (Mean):</span>
                <div className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
                  {meanValue} <span className="text-xs font-sans text-stone-400 font-normal">{primaryUnit}</span>
                </div>
                <span className="text-[11px] text-stone-400 block font-mono">
                  تعداد تکرارهای معتبر: {validValues.length}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center space-y-1">
                <span className="text-xs text-stone-500 block">ضریب تغییرات تکرارپذیری (%RSD):</span>
                <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {repeatability.relativeStandardDeviationPercent !== undefined
                    ? `${repeatability.relativeStandardDeviationPercent.toFixed(2)}%`
                    : 'در حد مجاز'}
                </div>
                <span className="text-[11px] text-stone-400 block">
                  حد مجاز تکرارپذیری: کمتر از ۲.۵٪
                </span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center space-y-1">
                <span className="text-xs text-stone-500 block">نتیجه نهایی انطباق قانونی:</span>
                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                  {conformance.isCompliant ? 'قابل قبول (Pass)' : 'مردود / مشروط'}
                </div>
                <span className="text-[11px] text-stone-500 block">
                  مبنا: {session.standardNumber || 'استاندارد ملی'}
                </span>
              </div>
            </div>

            {/* Replicates Data Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-emerald-600" />
                <span>نتایج اندازه‌گیری به تفکیک تکرارها (Replicates):</span>
              </h3>

              <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
                <table className="w-full text-xs text-right border-collapse min-w-[500px]">
                  <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold border-b border-stone-200 dark:border-stone-800">
                    <tr>
                      <th className="p-3">شماره تکرار</th>
                      <th className="p-3">مقدار سنجیده‌شده</th>
                      <th className="p-3">واحد</th>
                      <th className="p-3">وضعیت تکرار</th>
                      <th className="p-3">انحراف از میانگین</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {replicateResults.map((r, i) => {
                      const dev =
                        r.value !== undefined && meanValue !== 'ثبت‌نشده'
                          ? (r.value - Number(meanValue)).toFixed(3)
                          : '-';

                      return (
                        <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-850">
                          <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                            {r.title}
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {r.value !== undefined ? r.value : 'فاقد داده عددی'}
                          </td>
                          <td className="p-3 font-mono text-stone-500">{r.unit}</td>
                          <td className="p-3">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                              {r.status === 'completed' ? 'تکمیل شده' : 'در جریان'}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-stone-600 dark:text-stone-400">
                            {dev !== '-' ? `${dev} ${r.unit}` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Standard Conformance Limits Detail */}
            {conformance.evaluatedLimits && conformance.evaluatedLimits.length > 0 && (
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div className="font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>ارزیابی تطبیق با حدود مجاز استاندارد ملی {session.standardNumber}:</span>
                </div>
                <div className="space-y-1.5">
                  {conformance.evaluatedLimits.map((lim, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <strong className="text-stone-800 dark:text-stone-200">{lim.parameterName}</strong>
                        <span className="text-stone-400 block text-[11px]">
                          حد مجاز استاندارد: {lim.standardLimit} {lim.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                          {lim.measuredValue} {lim.unit}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            lim.passed
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {lim.passed ? 'مجاز ✓' : 'غیرمجاز ✕'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Link to QC Tab */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>بررسی و ثبت شاخص‌های کنترل کیفیت آزمایشگاهی (Blank, Duplicate, Calibration Check)</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('qc')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
              >
                ورود به تب کنترل کیفیت (QC) ←
              </button>
            </div>

            {/* Footer Navigation */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBackToProcedure}
                className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت به گام‌های اجرایی</span>
              </button>

              <button
                type="button"
                onClick={onProceedToFinalize}
                className="min-h-[40px] px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>تأیید نتایج و رفتن به نهایی‌سازی آزمایش</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: QUALITY CONTROL (QC) EXECUTION */}
        {activeTab === 'qc' && (
          <div className="p-4 sm:p-6">
            <LabQualityControlCard
              session={session}
              onUpdateQCData={(qcData) => {
                if (onUpdateQCData) {
                  onUpdateQCData(qcData);
                }
              }}
              onProceed={onProceedToFinalize}
              onBack={() => setActiveTab('calculations')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
