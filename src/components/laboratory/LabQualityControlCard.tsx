/**
 * Food Science AI - Laboratory Quality Control Execution Card
 * 
 * Interactive QC recording and evaluation during experiment execution:
 * 1. Displays all configured QC items (Blank, Control Sample, Duplicate, Replicate,
 *    Calibration Check, Recovery, Reference Material).
 * 2. Records QC measured values and operator observations.
 * 3. Dynamically calculates Pass / Fail / Unknown.
 * 4. Shows the exact scientific justification for each status.
 * 5. If no Acceptance Criteria is specified by the source, explicitly outputs "قابل ارزیابی نیست".
 * 6. Never invents or generates fictional acceptance limits.
 */

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Info,
  Scale,
  FlaskConical,
  Droplet,
  Copy,
  Layers,
  Gauge,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  FileText
} from 'lucide-react';
import { LabSession } from '../../types/laboratory';
import {
  ExperimentQCItem,
  LabSessionQCData,
  QC_CONTROL_TYPES_META,
  QCControlType,
  QCItemStatus
} from '../../types/qualityControl';
import { evaluateQCItem, evaluateSessionQC, extractQCItemsFromExperiment } from '../../lib/qc/experimentQCEngine';

interface LabQualityControlCardProps {
  session: LabSession;
  onUpdateQCData: (qcData: LabSessionQCData) => void;
  onProceed?: () => void;
  onBack?: () => void;
}

export const LabQualityControlCard: React.FC<LabQualityControlCardProps> = ({
  session,
  onUpdateQCData,
  onProceed,
  onBack
}) => {
  // Resolve QC items: from session or fallback extraction
  const qcItems: ExperimentQCItem[] = useMemo(() => {
    if (session.qcItems && session.qcItems.length > 0) {
      return session.qcItems;
    }
    return extractQCItemsFromExperiment(session);
  }, [session.qcItems, session]);

  // Initial recorded values from session.qcData
  const [recordedValues, setRecordedValues] = useState<
    Record<string, { value: string; notes: string }>
  >(() => {
    const initial: Record<string, { value: string; notes: string }> = {};
    qcItems.forEach((item) => {
      const existing = session.qcData?.items?.[item.id];
      initial[item.id] = {
        value: existing?.recordedValue !== undefined ? String(existing.recordedValue) : '',
        notes: existing?.notes || ''
      };
    });
    return initial;
  });

  // Dynamically calculate evaluations for each item
  const evaluationResults = useMemo(() => {
    const inputMap: Record<string, { value?: string; notes?: string }> = {};
    Object.keys(recordedValues).forEach((id) => {
      inputMap[id] = {
        value: recordedValues[id]?.value,
        notes: recordedValues[id]?.notes
      };
    });
    return evaluateSessionQC(qcItems, inputMap);
  }, [qcItems, recordedValues]);

  const handleValueChange = (itemId: string, value: string) => {
    setRecordedValues((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        value
      }
    }));
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    setRecordedValues((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        notes
      }
    }));
  };

  const handleSaveAndSync = () => {
    onUpdateQCData(evaluationResults);
    if (onProceed) onProceed();
  };

  const getStatusBadge = (status: QCItemStatus, hasCriteria: boolean) => {
    if (!hasCriteria) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold border border-stone-200 dark:border-stone-700">
          <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
          <span>قابل ارزیابی نیست</span>
        </span>
      );
    }

    switch (status) {
      case 'pass':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pass (قبول)</span>
          </span>
        );
      case 'fail':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            <span>Fail (مردود)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Unknown (در انتظار داده)</span>
          </span>
        );
    }
  };

  const getIcon = (type: QCControlType) => {
    switch (type) {
      case 'blank':
        return <Droplet className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'control_sample':
        return <FlaskConical className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'duplicate':
        return <Copy className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'replicate':
        return <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'calibration_check':
        return <Gauge className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'recovery':
        return <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'reference_material':
        return <Award className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  const passCount = Object.values(evaluationResults.items).filter(
    (i) => i.evaluatedStatus === 'pass'
  ).length;
  const failCount = Object.values(evaluationResults.items).filter(
    (i) => i.evaluatedStatus === 'fail'
  ).length;
  const unknownCount = Object.values(evaluationResults.items).filter(
    (i) => i.evaluatedStatus === 'unknown'
  ).length;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xs overflow-hidden mb-6" dir="rtl">
      {/* Header */}
      <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                کنترل کیفیت آزمایشگاهی (Laboratory Quality Control)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                {qcItems.length} شاخص QC
              </span>
            </div>
            <p className="text-xs text-stone-500">
              ثبت نتایج بلانک، نمونه کنترل، تکرار موازی، کالیبراسیون و محاسبه خودکار وضعیت Pass / Fail / Unknown
            </p>
          </div>
        </div>

        {/* Overall QC Status */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {evaluationResults.overallStatus === 'pass' ? (
            <span className="text-xs px-3 py-1.5 rounded-xl font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>کلیه کنترل‌های کیفی تایید شد (Pass)</span>
            </span>
          ) : evaluationResults.overallStatus === 'fail' ? (
            <span className="text-xs px-3 py-1.5 rounded-xl font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>عدم انطباق در کنترل کیفیت (Fail)</span>
            </span>
          ) : (
            <span className="text-xs px-3 py-1.5 rounded-xl font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>در انتظار ثبت کامل داده‌ها</span>
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-stone-500 text-[11px] block">کل شاخص‌های کنترل کیفیت:</span>
            <div className="text-xl font-mono font-bold text-stone-900 dark:text-stone-100">
              {qcItems.length} مورد
            </div>
            <span className="text-[10px] text-stone-400">مستند بر اساس استاندارد مرجع</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
            <span className="text-emerald-800 dark:text-emerald-300 text-[11px] block font-semibold">
              منطبق (Pass):
            </span>
            <div className="text-xl font-mono font-bold text-emerald-700 dark:text-emerald-300">
              {passCount}
            </div>
            <span className="text-[10px] text-emerald-600/80">درون حدود مجاز استاندارد</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1">
            <span className="text-rose-800 dark:text-rose-300 text-[11px] block font-semibold">
              نامنطبق (Fail):
            </span>
            <div className="text-xl font-mono font-bold text-rose-700 dark:text-rose-300">
              {failCount}
            </div>
            <span className="text-[10px] text-rose-600/80">خارج از دامنه رواداری مجاز</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1">
            <span className="text-amber-800 dark:text-amber-300 text-[11px] block font-semibold">
              قابل ارزیابی نیست / ثبت‌نشده:
            </span>
            <div className="text-xl font-mono font-bold text-amber-700 dark:text-amber-300">
              {unknownCount}
            </div>
            <span className="text-[10px] text-amber-600/80">فاقد معیار مصوب یا خالی</span>
          </div>
        </div>

        {/* Informative Guidance */}
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5 text-xs">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
            نتایج آزمون‌های شاهد (Blank)، آزمون‌های تکرار موازی (Duplicate)، و کنترل دستگاهی را وارد نمایید. سیستم بلافاصله با حدود مصوب استاندارد مقایسه نموده و دلیل دقیق وضعیت را مستند می‌کند. در مواردی که معیار عددی در استاندارد مشخص نشده باشد، بدون تولید داده ساختگی، صراحتاً «قابل ارزیابی نیست» درج می‌گردد.
          </p>
        </div>

        {/* QC Items Interactive Form */}
        <div className="space-y-4">
          {qcItems.map((item) => {
            const meta = QC_CONTROL_TYPES_META[item.type];
            const hasCriteria = item.acceptanceCriteria && item.acceptanceCriteria.specified;
            const evalResult = evaluationResults.items[item.id] || {
              evaluatedStatus: 'unknown',
              evaluationReasonFa: 'داده‌ای ثبت نشده است.'
            };
            const currentVal = recordedValues[item.id]?.value || '';
            const currentNotes = recordedValues[item.id]?.notes || '';

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs space-y-4 transition-all"
              >
                {/* Header Row: Title, Icon, Source & Live Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${meta.color}15` }}
                    >
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                          {item.titleFa}
                        </h3>
                        <span
                          className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase"
                          style={{
                            backgroundColor: `${meta.color}20`,
                            color: meta.color
                          }}
                        >
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1 mt-0.5">
                        <BookOpen className="w-3 h-3" />
                        <span>منبع: {item.sourceReference}</span>
                      </div>
                    </div>
                  </div>

                  <div className="self-start sm:self-center">
                    {getStatusBadge(evalResult.evaluatedStatus, hasCriteria)}
                  </div>
                </div>

                {/* Description & Acceptance Criteria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-[11px] text-stone-500 font-semibold block">
                      شرح کنترل کیفیت:
                    </span>
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                      {item.descriptionFa}
                    </p>
                  </div>

                  {hasCriteria ? (
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                      <span className="text-[11px] text-emerald-900 dark:text-emerald-200 font-bold block flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>معیار پذیرش مصوب (Acceptance Criteria):</span>
                      </span>
                      <p className="text-emerald-950 dark:text-emerald-300 font-medium leading-relaxed">
                        {item.acceptanceCriteria.descriptionFa}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                      <span className="text-[11px] text-amber-900 dark:text-amber-200 font-bold block flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>معیار پذیرش مصوب:</span>
                      </span>
                      <p className="text-amber-900 dark:text-amber-300 text-[11px] leading-relaxed">
                        معیار پذیرش رسمی در روش/منبع مربوطه مشخص نشده است: «قابل ارزیابی نیست».
                      </p>
                    </div>
                  )}
                </div>

                {/* Measurement Input Form & Result */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  {/* Recorded Value */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                      <span>مقدار / نتیجه اندازه‌گیری‌شده این کنترل:</span>
                      {item.acceptanceCriteria.unit && (
                        <span className="text-[10px] font-mono text-stone-400">
                          واحد: {item.acceptanceCriteria.unit}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => handleValueChange(item.id, e.target.value)}
                        placeholder={
                          item.type === 'blank'
                            ? 'مثلاً ۰.۰۲ یا منفی'
                            : item.type === 'duplicate'
                            ? 'مثلاً ۰.۰۳ یا ۱.۲'
                            : 'مقدار حاصله...'
                        }
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {item.acceptanceCriteria.unit && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-bold text-stone-400">
                          {item.acceptanceCriteria.unit}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notes / Observation */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-800 dark:text-stone-200 block">
                      مشاهدات تکمیلی آنالیزور / کد نمونه:
                    </label>
                    <input
                      type="text"
                      value={currentNotes}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      placeholder="توضیحات اختیاری، شماره بچ معرف، دمای شاهد..."
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Status Rationale Callout (دلیل وضعیت) */}
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                    evalResult.evaluatedStatus === 'pass'
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                      : evalResult.evaluatedStatus === 'fail'
                      ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                      : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {evalResult.evaluatedStatus === 'pass' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : evalResult.evaluatedStatus === 'fail' ? (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Info className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <strong className="block text-[11px] font-bold">
                      تحلیل و دلیل وضعیت (Status Reason):
                    </strong>
                    <p className="leading-relaxed font-medium">
                      {evalResult.evaluationReasonFa}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>مرحله قبل</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={handleSaveAndSync}
            className="min-h-[42px] px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ثبت نهایی نتایج کنترل کیفیت و صحه‌گذاری</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
