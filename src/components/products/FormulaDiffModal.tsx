/**
 * Food Science AI - Formula Version Diff & Change Tracking Modal
 * Shows precisely what changed between two formulation versions:
 * Added ingredients, removed ingredients, modified percentages (with Delta Δ),
 * physicochemical impact (Dry Matter, Brix), batch cost difference, and allergen profile changes.
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  ArrowLeftRight,
  Plus,
  Minus,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';
import { FormulationVersion, ProductDevelopmentProject } from '../../types/foodProduct';
import { computeFormulationDiff, IngredientDiffItem } from '../../lib/products/formulationDiffEngine';

interface FormulaDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProductDevelopmentProject;
  initialBaseVersionId?: string;
  initialTargetVersionId?: string;
}

export const FormulaDiffModal: React.FC<FormulaDiffModalProps> = ({
  isOpen,
  onClose,
  project,
  initialBaseVersionId,
  initialTargetVersionId
}) => {
  const formulations = project.formulations;

  // Default selection: Formula v1 (or baseline) vs Formula v2 (or latest)
  const defaultBaseId = initialBaseVersionId || formulations[0]?.id || '';
  const defaultTargetId =
    initialTargetVersionId ||
    (formulations.length > 1 ? formulations[1].id : formulations[0]?.id) ||
    '';

  const [baseId, setBaseId] = useState<string>(defaultBaseId);
  const [targetId, setTargetId] = useState<string>(defaultTargetId);
  const [filterStatus, setFilterStatus] = useState<'all' | 'changed' | 'added' | 'removed' | 'modified'>('all');

  const baseVersion = useMemo(
    () => formulations.find((f) => f.id === baseId) || formulations[0],
    [formulations, baseId]
  );

  const targetVersion = useMemo(
    () => formulations.find((f) => f.id === targetId) || (formulations[1] ?? formulations[0]),
    [formulations, targetId]
  );

  const diffResult = useMemo(() => {
    if (!baseVersion || !targetVersion) return null;
    return computeFormulationDiff(baseVersion, targetVersion);
  }, [baseVersion, targetVersion]);

  if (!isOpen || !diffResult || formulations.length === 0) return null;

  // Swap versions
  const handleSwap = () => {
    const temp = baseId;
    setBaseId(targetId);
    setTargetId(temp);
  };

  const filteredItems = diffResult.items.filter((item) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'changed') return item.status !== 'unchanged';
    return item.status === filterStatus;
  });

  const { changeHighlights, metricDeltas } = diffResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                  تحلیل و مقایسه تغییرات بین دو نسخه فرمولاسیون (Formula Diff)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  ردیابی تغییرات (Δ)
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                شناسایی دقیق اقلام اضافه شده، حذف شده، تغییرات درصدی، اثر بر ماده خشک و صرفه‌جویی اقتصادی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version Selectors Bar */}
        <div className="p-4 bg-stone-100/70 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Base Version */}
            <div className="flex-1 w-full flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400 shrink-0">
                نسخه مبدأ (پایه):
              </span>
              <select
                value={baseId}
                onChange={(e) => setBaseId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {formulations.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.versionCode} {f.isBaseline ? '(مرجع اصلی)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors shrink-0"
              title="جابجایی نسخه مبدأ و مقصد"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            {/* Target Version */}
            <div className="flex-1 w-full flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400 shrink-0">
                نسخه مقایسه (مقصد):
              </span>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {formulations.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.versionCode} {f.isBaseline ? '(مرجع اصلی)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Executive Summary Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  خلاصه تغییرات ایجادشده:
                </h4>
                <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed font-medium">
                  {diffResult.executiveSummaryFa}
                </p>
                {targetVersion.changeLogSummary && (
                  <div className="mt-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/60 text-[11px] text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold">یادداشت ثبت نسخه: </span>
                    {targetVersion.changeLogSummary}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metric Comparison KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Added & Removed Items */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
              <span className="text-[11px] font-medium text-stone-500 block mb-1">
                تغییر در اقلام فرمولاسیون
              </span>
              <div className="flex items-center justify-center gap-2 text-sm font-black font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <Plus className="w-3.5 h-3.5" />
                  {changeHighlights.addedCount} اضافه
                </span>
                <span className="text-stone-300 dark:text-stone-600">|</span>
                <span className="text-red-600 dark:text-red-400 flex items-center gap-0.5">
                  <Minus className="w-3.5 h-3.5" />
                  {changeHighlights.removedCount} حذف
                </span>
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">
                {changeHighlights.modifiedCount} جزء با درصد تغییریافته
              </span>
            </div>

            {/* Dry Matter Delta */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
              <span className="text-[11px] font-medium text-stone-500 block mb-1">
                ماده خشک کل (Dry Matter)
              </span>
              <div className="text-base font-black font-mono text-stone-900 dark:text-stone-100">
                {metricDeltas.targetDryMatter}%
              </div>
              <div
                className={`text-[11px] font-bold font-mono mt-0.5 flex items-center justify-center gap-1 ${
                  metricDeltas.deltaDryMatter > 0
                    ? 'text-emerald-600'
                    : metricDeltas.deltaDryMatter < 0
                    ? 'text-amber-600'
                    : 'text-stone-400'
                }`}
              >
                <span>
                  {metricDeltas.deltaDryMatter > 0 ? '+' : ''}
                  {metricDeltas.deltaDryMatter}% Δ
                </span>
                <span className="text-[10px] text-stone-400 font-sans">
                  (قبلی: {metricDeltas.baseDryMatter}%)
                </span>
              </div>
            </div>

            {/* Brix Delta */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
              <span className="text-[11px] font-medium text-stone-500 block mb-1">
                بریکس تخمینی (°Brix)
              </span>
              <div className="text-base font-black font-mono text-stone-900 dark:text-stone-100">
                {metricDeltas.targetBrix}°
              </div>
              <div
                className={`text-[11px] font-bold font-mono mt-0.5 ${
                  metricDeltas.deltaBrix >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-500'
                }`}
              >
                {metricDeltas.deltaBrix > 0 ? '+' : ''}
                {metricDeltas.deltaBrix}° Δ
                <span className="text-[10px] text-stone-400 font-sans mr-1">
                  (قبلی: {metricDeltas.baseBrix}°)
                </span>
              </div>
            </div>

            {/* Cost per kg Delta */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
              <span className="text-[11px] font-medium text-stone-500 block mb-1">
                بهای مواد اولیه (هر کیلوگرم)
              </span>
              <div className="text-base font-black font-mono text-stone-900 dark:text-stone-100">
                {metricDeltas.targetCostPerKg > 0
                  ? `${metricDeltas.targetCostPerKg.toLocaleString('fa-IR')} تومان`
                  : 'تعریف‌نشده'}
              </div>
              {metricDeltas.baseCostPerKg > 0 && (
                <div
                  className={`text-[11px] font-bold font-mono mt-0.5 flex items-center justify-center gap-1 ${
                    metricDeltas.costChangePercent < 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : metricDeltas.costChangePercent > 0
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-stone-400'
                  }`}
                >
                  {metricDeltas.costChangePercent < 0 ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : metricDeltas.costChangePercent > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : null}
                  <span>
                    {metricDeltas.costChangePercent > 0 ? '+' : ''}
                    {metricDeltas.costChangePercent}%
                  </span>
                  <span className="text-[10px] font-sans text-stone-400">
                    ({metricDeltas.costChangePercent < 0 ? 'صرفه‌جویی' : 'افزایش'})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Filter Status Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-stone-500 font-medium ml-1">فیلتر اجزا:</span>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                همه اقلام ({diffResult.items.length})
              </button>
              <button
                onClick={() => setFilterStatus('changed')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === 'changed'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                فقط اقلام تغییریافته (
                {changeHighlights.addedCount + changeHighlights.removedCount + changeHighlights.modifiedCount})
              </button>
              <button
                onClick={() => setFilterStatus('added')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === 'added'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                }`}
              >
                افزوده شده ({changeHighlights.addedCount})
              </button>
              <button
                onClick={() => setFilterStatus('modified')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === 'modified'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                }`}
              >
                تغییر درصد ({changeHighlights.modifiedCount})
              </button>
              <button
                onClick={() => setFilterStatus('removed')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === 'removed'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100'
                }`}
              >
                حذف شده ({changeHighlights.removedCount})
              </button>
            </div>

            <div className="text-[11px] text-stone-500 font-mono">
              تعداد اجزای نسخه مبدأ: {baseVersion.ingredients.length} | نسخه مقصد:{' '}
              {targetVersion.ingredients.length}
            </div>
          </div>

          {/* Detailed Diff Table */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="p-3 w-32">وضعیت تغییر</th>
                    <th className="p-3">نام ماده اولیه</th>
                    <th className="p-3 w-36">نقش ساختاری</th>
                    <th className="p-3 w-28 text-center font-mono">
                      {baseVersion.versionCode}
                    </th>
                    <th className="p-3 w-10 text-center"></th>
                    <th className="p-3 w-28 text-center font-mono">
                      {targetVersion.versionCode}
                    </th>
                    <th className="p-3 w-36 text-center font-mono">اختلاف (Delta Δ)</th>
                    <th className="p-3">توضیحات و یادداشت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {filteredItems.map((item) => {
                    const isAdded = item.status === 'added';
                    const isRemoved = item.status === 'removed';
                    const isModified = item.status === 'modified';
                    const isUnchanged = item.status === 'unchanged';

                    return (
                      <tr
                        key={item.id + item.nameFa}
                        className={`transition-colors ${
                          isAdded
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                            : isRemoved
                            ? 'bg-red-50/50 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/30'
                            : isModified
                            ? 'bg-amber-50/40 dark:bg-amber-950/15 hover:bg-amber-50 dark:hover:bg-amber-950/25'
                            : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                        }`}
                      >
                        {/* Status Badge */}
                        <td className="p-3">
                          {isAdded && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                              <Plus className="w-3.5 h-3.5" />
                              <span>اضافه شد</span>
                            </span>
                          )}
                          {isRemoved && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">
                              <Minus className="w-3.5 h-3.5" />
                              <span>حذف گردید</span>
                            </span>
                          )}
                          {isModified && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                              <span>تغییر درصد</span>
                            </span>
                          )}
                          {isUnchanged && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                              <CheckCircle2 className="w-3 h-3 text-stone-400" />
                              <span>بدون تغییر</span>
                            </span>
                          )}
                        </td>

                        {/* Name */}
                        <td className="p-3">
                          <span
                            className={`font-semibold text-xs ${
                              isRemoved
                                ? 'line-through text-stone-400 dark:text-stone-500'
                                : 'text-stone-900 dark:text-stone-100'
                            }`}
                          >
                            {item.nameFa}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="p-3 text-stone-600 dark:text-stone-400 text-[11px]">
                          {item.categoryLabelFa}
                        </td>

                        {/* Base Percentage */}
                        <td className="p-3 text-center font-mono font-medium text-stone-700 dark:text-stone-300">
                          {item.basePercentage !== null
                            ? `${item.basePercentage.toFixed(2)}%`
                            : '—'}
                        </td>

                        {/* Direction Arrow */}
                        <td className="p-3 text-center text-stone-400">
                          <ArrowLeftRight className="w-3 h-3 mx-auto" />
                        </td>

                        {/* Target Percentage */}
                        <td className="p-3 text-center font-mono font-bold text-stone-900 dark:text-stone-100">
                          {item.targetPercentage !== null
                            ? `${item.targetPercentage.toFixed(2)}%`
                            : '—'}
                        </td>

                        {/* Delta */}
                        <td className="p-3 text-center font-mono font-bold">
                          {isAdded && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              +{item.deltaPercentage.toFixed(2)}%
                            </span>
                          )}
                          {isRemoved && (
                            <span className="text-red-600 dark:text-red-400">
                              {item.deltaPercentage.toFixed(2)}%
                            </span>
                          )}
                          {isModified && (
                            <span
                              className={
                                item.deltaPercentage > 0
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-amber-600 dark:text-amber-400'
                              }
                            >
                              {item.deltaPercentage > 0 ? '+' : ''}
                              {item.deltaPercentage.toFixed(2)}%
                              {item.percentageChangeRatio !== null && (
                                <span className="text-[10px] text-stone-400 mr-1 block font-sans">
                                  ({item.percentageChangeRatio > 0 ? '+' : ''}
                                  {item.percentageChangeRatio}%)
                                </span>
                              )}
                            </span>
                          )}
                          {isUnchanged && <span className="text-stone-400">۰.۰۰٪</span>}
                        </td>

                        {/* Notes */}
                        <td className="p-3 text-[11px] text-stone-500 max-w-xs truncate">
                          {item.notes || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
            <span className="font-bold">پروژه:</span> {project.productNameFa}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 transition-colors"
          >
            بستن پنجره مقایسه
          </button>
        </div>
      </div>
    </div>
  );
};
