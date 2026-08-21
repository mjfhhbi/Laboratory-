import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Plus, 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  ArrowUpDown,
  Hash,
  Activity
} from 'lucide-react';
import { calculateStatistics } from '../../lib/calculations/statisticalEngine';
import { StatisticalSummary } from '../../types/calculations';

export const StatisticalCalculator: React.FC = () => {
  const [replicates, setReplicates] = useState<number[]>([14.25, 14.30, 14.22, 14.28, 14.35]);
  const [referenceValue, setReferenceValue] = useState<number | undefined>(14.30);
  const [unit, setUnit] = useState<string>('%');
  const [bulkInputText, setBulkInputText] = useState<string>('');
  const [showBulkInput, setShowBulkInput] = useState<boolean>(false);
  const [showTrace, setShowTrace] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Run statistics
  const stats: StatisticalSummary = useMemo(() => {
    return calculateStatistics(replicates, referenceValue, unit);
  }, [replicates, referenceValue, unit]);

  const handleAddReplicate = () => {
    const last = replicates.length > 0 ? replicates[replicates.length - 1] : 10.0;
    setReplicates([...replicates, last]);
  };

  const handleUpdateReplicate = (index: number, valStr: string) => {
    const val = parseFloat(valStr);
    const updated = [...replicates];
    updated[index] = isNaN(val) ? 0 : val;
    setReplicates(updated);
  };

  const handleRemoveReplicate = (index: number) => {
    if (replicates.length <= 1) return;
    setReplicates(replicates.filter((_, i) => i !== index));
  };

  const handleApplyBulkInput = () => {
    const parts = bulkInputText
      .split(/[\s,;\n\t]+/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => parseFloat(p))
      .filter(p => !isNaN(p));

    if (parts.length > 0) {
      setReplicates(parts);
      setShowBulkInput(false);
      setBulkInputText('');
    }
  };

  const handleReset = () => {
    setReplicates([10.2, 10.4, 10.1, 10.5, 10.3]);
    setReferenceValue(10.0);
    setUnit('%');
  };

  const handleCopyReport = () => {
    const text = [
      `=== گزارش محاسبات آماری و خطاسنجی آزمایشگاهی ===`,
      `تعداد تکرارها (N): ${stats.count}`,
      `داده‌های خام: [${stats.rawValues.join(', ')}] ${unit}`,
      `میانگین (Mean): ${stats.mean.toFixed(4)} ${unit}`,
      `انحراف معیار نمونه (s): ${stats.stdDev.toFixed(4)} ${unit}`,
      `انحراف معیار نسبی (%RSD / CV): ${stats.rsdPercent.toFixed(2)} %`,
      `خطای استاندارد میانگین (SE): ${stats.stdError.toFixed(4)} ${unit}`,
      `دامنه تغییرات (Range): ${stats.range.toFixed(4)} ${unit} (کمینه: ${stats.min} | بیشینه: ${stats.max})`,
      `میانه (Median): ${stats.median.toFixed(4)} ${unit}`,
      `فاصله اطمینان ۹۵٪: [${stats.confidenceInterval95.lower.toFixed(3)}, ${stats.confidenceInterval95.upper.toFixed(3)}] ${unit}`,
      stats.referenceValue !== undefined ? `مقدار مرجع استاندارد: ${stats.referenceValue} ${unit}` : '',
      stats.errorPercentAgainstRef !== undefined ? `درصد خطای آزمون (%Error): ${stats.errorPercentAgainstRef.toFixed(2)} %` : '',
      stats.outliers.length > 0 ? `داده‌های پرت شناسایی‌شده: ${stats.outliers.map(o => `${o.value} (${o.test})`).join('، ')}` : 'بدون داده پرت (سطح اطمینان ۹۰٪)',
      '',
      '--- مراحل تحلیلی و ردپای ریاضی ---',
      ...stats.trace.map(t => `${t.stepNumber}. ${t.titleFa}: ${t.expression} => ${t.substitutedExpression} = ${t.intermediateValue} ${t.unit}`)
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="statistical-calculator-container">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                موتور محاسبات آماری، تکرارها و کنترل خطای آزمایشگاهی
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                محاسبه Mean، انحراف معیار نمونه (s)، %RSD، خطای استاندارد (SE)، درصد خطا و آزمون داده‌های پرت (Dixon Q-Test)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBulkInput(!showBulkInput)}
              className="px-3 py-1.5 text-xs font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg transition-colors"
            >
              {showBulkInput ? 'بستن ورود دسته‌جمعی' : 'ورود دسته‌جمعی داده‌ها'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-stone-200 dark:border-stone-700 hover:bg-stone-50 text-stone-600 dark:text-stone-400 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              بازنشانی
            </button>
          </div>
        </div>

        {/* Bulk Input Drawer */}
        {showBulkInput && (
          <div className="mt-4 p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3">
            <label className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
              اعداد تکرارها را با فاصله، کاما (,) یا اینتر وارد نمایید:
            </label>
            <textarea
              rows={3}
              value={bulkInputText}
              onChange={(e) => setBulkInputText(e.target.value)}
              placeholder="مثلاً: 14.25, 14.30, 14.22, 14.28, 14.35"
              className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 text-xs font-mono dir-ltr text-left outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBulkInput(false)}
                className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 rounded"
              >
                انصراف
              </button>
              <button
                onClick={handleApplyBulkInput}
                className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-xs"
              >
                اعمال داده‌ها
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Replicates Input Table & Reference Settings */}
        <div className="lg:col-span-5 space-y-5">
          {/* Settings Box: Unit & Reference True Value */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-emerald-600" />
              تنظیمات واحد و مقدار مرجع استاندارد
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-stone-500 dark:text-stone-400 block mb-1">
                  واحد اندازه‌گیری:
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="مثلاً %، g/L، ppm"
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-center outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-500 dark:text-stone-400 block mb-1">
                  مقدار مرجع/واقعی (اختیاری):
                </label>
                <input
                  type="number"
                  step="any"
                  value={referenceValue !== undefined ? referenceValue : ''}
                  onChange={(e) => setReferenceValue(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                  placeholder="برای محاسبه %Error"
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-center outline-none"
                />
              </div>
            </div>
          </div>

          {/* Replicates Data Entry Table */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                تکرارهای آزمون ({replicates.length} نمونه)
              </h4>
              <button
                onClick={handleAddReplicate}
                className="flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
              >
                <Plus className="w-3.5 h-3.5" />
                افزودن تکرار (Replicate)
              </button>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {replicates.map((val, idx) => {
                const isOutlier = stats.outliers.some(o => o.value === val);

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between gap-3 p-2.5 rounded-lg border transition-all ${
                      isOutlier
                        ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/30'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded">
                        R{idx + 1}
                      </span>
                      {isOutlier && (
                        <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded font-medium">
                          پرت (Outlier)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                      <input
                        type="number"
                        step="any"
                        value={val}
                        onChange={(e) => handleUpdateReplicate(idx, e.target.value)}
                        className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-xs font-mono text-left dir-ltr outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-stone-400 font-mono">{unit}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveReplicate(idx)}
                      disabled={replicates.length <= 1}
                      className="p-1 text-stone-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="حذف تکرار"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Statistical Cards & Key Metrics */}
        <div className="lg:col-span-7 space-y-5">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Mean */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm text-center">
              <span className="text-[11px] font-semibold text-stone-500 block mb-1">
                میانگین حسابی (Mean)
              </span>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
                {stats.mean.toFixed(3)}
              </div>
              <span className="text-xs text-stone-400 font-mono">{unit}</span>
            </div>

            {/* Standard Deviation (s) */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm text-center">
              <span className="text-[11px] font-semibold text-stone-500 block mb-1">
                انحراف معیار نمونه (s)
              </span>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-300 font-mono">
                {stats.stdDev.toFixed(4)}
              </div>
              <span className="text-xs text-stone-400 font-mono">{unit}</span>
            </div>

            {/* %RSD / CV */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm text-center">
              <span className="text-[11px] font-semibold text-stone-500 block mb-1">
                انحراف معیار نسبی (%RSD)
              </span>
              <div className={`text-2xl font-black font-mono ${
                stats.rsdPercent <= 2 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : stats.rsdPercent <= 5 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                {stats.rsdPercent.toFixed(2)}%
              </div>
              <span className="text-[10px] text-stone-400">
                {stats.rsdPercent <= 2 ? 'تکرارپذیری عالی' : stats.rsdPercent <= 5 ? 'قابل قبول' : 'پراکندگی بالا'}
              </span>
            </div>

            {/* Percent Error against True */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm text-center">
              <span className="text-[11px] font-semibold text-stone-500 block mb-1">
                درصد خطای آزمون (%Error)
              </span>
              <div className="text-2xl font-black text-violet-700 dark:text-violet-300 font-mono">
                {stats.errorPercentAgainstRef !== undefined ? `${stats.errorPercentAgainstRef.toFixed(2)}%` : '-'}
              </div>
              <span className="text-[10px] text-stone-400">
                {stats.referenceValue !== undefined ? `نسبت به ${stats.referenceValue}` : 'مرجع نامشخص'}
              </span>
            </div>
          </div>

          {/* Detailed Statistics Table */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                جدول تحلیلی جامع شاخص‌های آماری و پراکندگی
              </h4>
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 border border-stone-200 dark:border-stone-700 px-2.5 py-1 rounded transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'کپی شد' : 'کپی خلاصه آمار'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200/80 dark:border-stone-700">
                <span className="text-stone-500 block mb-0.5">تعداد کل تکرارها (N):</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200 text-sm">
                  {stats.count}
                </span>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200/80 dark:border-stone-700">
                <span className="text-stone-500 block mb-0.5">مجموع کل (Sum):</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200 text-sm">
                  {stats.sum.toFixed(4)} {unit}
                </span>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200/80 dark:border-stone-700">
                <span className="text-stone-500 block mb-0.5">واریانس نمونه (s²):</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200 text-sm">
                  {stats.variance.toFixed(6)}
                </span>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200/80 dark:border-stone-700">
                <span className="text-stone-500 block mb-0.5">خطای استاندارد (SE = s/√n):</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200 text-sm">
                  {stats.stdError.toFixed(4)} {unit}
                </span>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200/80 dark:border-stone-700">
                <span className="text-stone-500 block mb-0.5">دامنه تغییرات (Range = Max - Min):</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200 text-sm">
                  {stats.range.toFixed(4)} {unit}
                </span>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200/80 dark:border-stone-700">
                <span className="text-stone-500 block mb-0.5">میانه داده‌ها (Median):</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200 text-sm">
                  {stats.median.toFixed(4)} {unit}
                </span>
              </div>
            </div>

            {/* 95% Confidence Interval Banner */}
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
                  فاصله اطمینان ۹۵٪ (95% Confidence Interval):
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  حد بالا و پایین جامعه آماری با حاشیه خطای ± {stats.confidenceInterval95.marginOfError.toFixed(4)}
                </span>
              </div>
              <div className="font-mono font-bold text-emerald-800 dark:text-emerald-300 text-sm bg-white dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 dir-ltr">
                [{stats.confidenceInterval95.lower.toFixed(3)}, {stats.confidenceInterval95.upper.toFixed(3)}] {unit}
              </div>
            </div>

            {/* Outliers and Warnings */}
            {stats.warnings.length > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl space-y-1 text-xs text-amber-900 dark:text-amber-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>هشدارهای آزمون کنترل کیفی و داده‌های مشکوک:</span>
                </div>
                <ul className="list-disc pr-5 space-y-0.5 leading-relaxed">
                  {stats.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Trace Steps Breakdown */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                گام‌های محاسباتی و اثبات فرمول‌ها (Mathematical Proof)
              </span>
              <button
                onClick={() => setShowTrace(!showTrace)}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
              >
                {showTrace ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>{showTrace ? 'بستن جزئیات' : 'نمایش جزئیات'}</span>
              </button>
            </div>

            {showTrace && (
              <div className="space-y-2.5">
                {stats.trace.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {step.stepNumber}. {step.titleFa}
                      </span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        {step.intermediateValue} {step.unit}
                      </span>
                    </div>

                    <div className="bg-stone-100 dark:bg-stone-900 p-2 rounded font-mono text-[11px] text-stone-700 dark:text-stone-300 dir-ltr text-left overflow-x-auto">
                      <div>{step.expression}</div>
                      <div className="text-emerald-600 dark:text-emerald-400 mt-0.5">
                        ↳ {step.substitutedExpression}
                      </div>
                    </div>

                    {step.noteFa && (
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {step.noteFa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
