/**
 * Food Science AI - Multi-Formulation Comparison Matrix & Diff Inspector Modal
 * Shows:
 * 1. What changed between two versions (Added, Removed, Modified %, Delta physicochemical & cost).
 * 2. Full Side-by-Side Matrix across Formula v1, v2, v3, etc.
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Layers,
  ArrowLeftRight,
  Plus,
  Minus,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Info,
  Scale
} from 'lucide-react';
import { ProductDevelopmentProject, FormulationVersion } from '../../types/foodProduct';
import {
  buildMultiFormulationComparisonMatrix,
  INGREDIENT_FUNCTION_LABELS
} from '../../lib/products/formulationEngine';
import { computeFormulationDiff } from '../../lib/products/formulationDiffEngine';

interface MultiFormulationCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProductDevelopmentProject;
  initialBaseVersionId?: string;
  initialTargetVersionId?: string;
}

export const MultiFormulationCompareModal: React.FC<MultiFormulationCompareModalProps> = ({
  isOpen,
  onClose,
  project,
  initialBaseVersionId,
  initialTargetVersionId
}) => {
  const formulations = project.formulations;

  const [activeTab, setActiveTab] = useState<'diff' | 'matrix'>('diff');

  // Matrix selection
  const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>(
    formulations.map((f) => f.id)
  );

  // Diff selection
  const [baseId, setBaseId] = useState<string>(
    initialBaseVersionId || formulations[0]?.id || ''
  );
  const [targetId, setTargetId] = useState<string>(
    initialTargetVersionId || (formulations.length > 1 ? formulations[1].id : formulations[0]?.id) || ''
  );
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

  if (!isOpen) return null;

  const formulationsToCompare = formulations.filter((f) =>
    selectedVersionIds.includes(f.id)
  );
  const matrix = buildMultiFormulationComparisonMatrix(formulationsToCompare);

  const toggleVersionSelection = (id: string) => {
    if (selectedVersionIds.includes(id)) {
      if (selectedVersionIds.length > 1) {
        setSelectedVersionIds(selectedVersionIds.filter((v) => v !== id));
      }
    } else {
      setSelectedVersionIds([...selectedVersionIds, id]);
    }
  };

  const handleSwapDiff = () => {
    const temp = baseId;
    setBaseId(targetId);
    setTargetId(temp);
  };

  const filteredDiffItems = diffResult
    ? diffResult.items.filter((item) => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'changed') return item.status !== 'unchanged';
        return item.status === filterStatus;
      })
    : [];

  return (
    <div
      id="multi-formulation-compare-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 px-6 py-4 bg-stone-50 dark:bg-stone-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                  سامانه مقایسه و ردیابی تغییرات نسخه‌های فرمولاسیون
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                  Formula v1 / v2 / v3
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                پروژه: {project.productNameFa} ({project.code})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-800/40 shrink-0">
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'diff'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>ردیابی دقیق تفاوت‌های دو نسخه (چه چیزی تغییر کرده است؟)</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'matrix'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ماتریس مقایسه همزمان تمام نسخه‌ها ({formulations.length} نسخه)</span>
          </button>
        </div>

        {/* TAB 1: FORMULA DIFF (What changed between two versions) */}
        {activeTab === 'diff' && diffResult && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Version Selectors Bar */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex-1 w-full flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400 shrink-0">
                  نسخه مبدأ (پایه):
                </span>
                <select
                  value={baseId}
                  onChange={(e) => setBaseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {formulations.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.versionCode} {f.isBaseline ? '(مرجع)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSwapDiff}
                className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors shrink-0"
                title="جابجایی دو نسخه"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>

              <div className="flex-1 w-full flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400 shrink-0">
                  نسخه مقایسه (مقصد):
                </span>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {formulations.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.versionCode} {f.isBaseline ? '(مرجع)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Executive Summary Card */}
            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-200/60 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div className="flex-1 text-right">
                  <h4 className="text-xs font-bold text-purple-900 dark:text-purple-200 mb-1">
                    آنالیز تغییرات ایجادشده بین {baseVersion.versionCode} و {targetVersion.versionCode}:
                  </h4>
                  <p className="text-xs text-purple-950 dark:text-purple-100 leading-relaxed font-medium">
                    {diffResult.executiveSummaryFa}
                  </p>
                  {targetVersion.changeLogSummary && (
                    <div className="mt-2 pt-2 border-t border-purple-200/60 dark:border-purple-900/60 text-[11px] text-purple-800 dark:text-purple-300">
                      <span className="font-bold">یادداشت ثبت نسخه: </span>
                      {targetVersion.changeLogSummary}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Metric Comparison Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[11px] text-stone-500 block mb-1">تغییر در اقلام</span>
                <div className="flex items-center justify-center gap-2 text-sm font-black font-mono">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <Plus className="w-3.5 h-3.5" />
                    {diffResult.changeHighlights.addedCount} اضافه
                  </span>
                  <span className="text-stone-300 dark:text-stone-600">|</span>
                  <span className="text-red-600 dark:text-red-400 flex items-center gap-0.5">
                    <Minus className="w-3.5 h-3.5" />
                    {diffResult.changeHighlights.removedCount} حذف
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  {diffResult.changeHighlights.modifiedCount} جزء تغییر درصد
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[11px] text-stone-500 block mb-1">ماده خشک کل (Dry Matter)</span>
                <div className="text-base font-black font-mono text-stone-900 dark:text-stone-100">
                  {diffResult.metricDeltas.targetDryMatter}%
                </div>
                <div className="text-[11px] font-bold font-mono text-purple-600 dark:text-purple-400 mt-0.5">
                  {diffResult.metricDeltas.deltaDryMatter > 0 ? '+' : ''}
                  {diffResult.metricDeltas.deltaDryMatter}% Δ
                  <span className="text-[10px] text-stone-400 font-sans mr-1">
                    (مبدأ: {diffResult.metricDeltas.baseDryMatter}%)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[11px] text-stone-500 block mb-1">بریکس (°Brix)</span>
                <div className="text-base font-black font-mono text-stone-900 dark:text-stone-100">
                  {diffResult.metricDeltas.targetBrix}°
                </div>
                <div className="text-[11px] font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {diffResult.metricDeltas.deltaBrix > 0 ? '+' : ''}
                  {diffResult.metricDeltas.deltaBrix}° Δ
                  <span className="text-[10px] text-stone-400 font-sans mr-1">
                    (مبدأ: {diffResult.metricDeltas.baseBrix}°)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[11px] text-stone-500 block mb-1">بهای مواد اولیه (هر کیلو)</span>
                <div className="text-base font-black font-mono text-stone-900 dark:text-stone-100">
                  {diffResult.metricDeltas.targetCostPerKg > 0
                    ? `${diffResult.metricDeltas.targetCostPerKg.toLocaleString('fa-IR')} ت`
                    : '—'}
                </div>
                {diffResult.metricDeltas.baseCostPerKg > 0 && (
                  <div
                    className={`text-[11px] font-bold font-mono mt-0.5 flex items-center justify-center gap-1 ${
                      diffResult.metricDeltas.costChangePercent < 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : diffResult.metricDeltas.costChangePercent > 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-stone-400'
                    }`}
                  >
                    {diffResult.metricDeltas.costChangePercent < 0 ? (
                      <TrendingDown className="w-3.5 h-3.5" />
                    ) : diffResult.metricDeltas.costChangePercent > 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : null}
                    <span>
                      {diffResult.metricDeltas.costChangePercent > 0 ? '+' : ''}
                      {diffResult.metricDeltas.costChangePercent}%
                    </span>
                    <span className="text-[10px] font-sans text-stone-400">
                      ({diffResult.metricDeltas.costChangePercent < 0 ? 'صرفه‌جویی' : 'افزایش'})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
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
                  همه ({diffResult.items.length})
                </button>
                <button
                  onClick={() => setFilterStatus('changed')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    filterStatus === 'changed'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  فقط تغییریافته (
                  {diffResult.changeHighlights.addedCount +
                    diffResult.changeHighlights.removedCount +
                    diffResult.changeHighlights.modifiedCount}
                  )
                </button>
                <button
                  onClick={() => setFilterStatus('added')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    filterStatus === 'added'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  افزوده ({diffResult.changeHighlights.addedCount})
                </button>
                <button
                  onClick={() => setFilterStatus('modified')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    filterStatus === 'modified'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  تغییر درصد ({diffResult.changeHighlights.modifiedCount})
                </button>
                <button
                  onClick={() => setFilterStatus('removed')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    filterStatus === 'removed'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                  }`}
                >
                  حذف شده ({diffResult.changeHighlights.removedCount})
                </button>
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
                      <th className="p-3 w-28 text-center font-mono">{baseVersion.versionCode}</th>
                      <th className="p-3 w-10 text-center"></th>
                      <th className="p-3 w-28 text-center font-mono">{targetVersion.versionCode}</th>
                      <th className="p-3 w-36 text-center font-mono">اختلاف (Delta Δ)</th>
                      <th className="p-3">توضیحات و مشخصات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    {filteredDiffItems.map((item) => {
                      const isAdded = item.status === 'added';
                      const isRemoved = item.status === 'removed';
                      const isModified = item.status === 'modified';
                      const isUnchanged = item.status === 'unchanged';

                      return (
                        <tr
                          key={item.id + item.nameFa}
                          className={`transition-colors ${
                            isAdded
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                              : isRemoved
                              ? 'bg-red-50/50 dark:bg-red-950/20'
                              : isModified
                              ? 'bg-amber-50/40 dark:bg-amber-950/15'
                              : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                          }`}
                        >
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

                          <td className="p-3 text-stone-600 dark:text-stone-400 text-[11px]">
                            {item.categoryLabelFa}
                          </td>

                          <td className="p-3 text-center font-mono font-medium text-stone-700 dark:text-stone-300">
                            {item.basePercentage !== null ? `${item.basePercentage.toFixed(2)}%` : '—'}
                          </td>

                          <td className="p-3 text-center text-stone-400">
                            <ArrowLeftRight className="w-3 h-3 mx-auto" />
                          </td>

                          <td className="p-3 text-center font-mono font-bold text-stone-900 dark:text-stone-100">
                            {item.targetPercentage !== null ? `${item.targetPercentage.toFixed(2)}%` : '—'}
                          </td>

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
        )}

        {/* TAB 2: SIDE-BY-SIDE MATRIX */}
        {activeTab === 'matrix' && (
          <div className="flex-1 overflow-x-auto overflow-y-auto p-6 space-y-6">
            {/* Version Filter Bar */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  انتخاب نسخه‌ها برای مقایسه:
                </span>
                {formulations.map((form) => {
                  const isSelected = selectedVersionIds.includes(form.id);
                  return (
                    <button
                      key={form.id}
                      onClick={() => toggleVersionSelection(form.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700'
                      }`}
                    >
                      {form.versionCode}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-stone-500">
                در حال مقایسه {formulationsToCompare.length} نسخه
              </div>
            </div>

            {formulationsToCompare.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                حداقل یک نسخه را برای مقایسه انتخاب کنید.
              </div>
            ) : (
              <div className="min-w-[600px] space-y-6">
                {/* Summary KPIs Row */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    شاخص‌های ترکیبی و اقتصادی
                  </h4>
                  <div className="overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-700">
                        <tr>
                          <th className="p-3 w-1/3">شاخص عملکردی</th>
                          {formulationsToCompare.map((f) => (
                            <th key={f.id} className="p-3 text-center border-r border-stone-200 dark:border-stone-700">
                              {f.versionCode}
                              {f.isBaseline && (
                                <span className="block text-[10px] text-emerald-600 font-normal">
                                  (مرجع اصلی)
                                </span>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                        {matrix.summaryMetrics.map((metric, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? 'bg-white dark:bg-stone-900' : 'bg-stone-50/50 dark:bg-stone-800/30'}
                          >
                            <td className="p-3 font-medium text-stone-900 dark:text-stone-100">
                              {metric.metricNameFa}
                            </td>
                            {formulationsToCompare.map((f) => (
                              <td
                                key={f.id}
                                className="p-3 text-center font-semibold text-stone-800 dark:text-stone-200 border-r border-stone-200 dark:border-stone-800"
                              >
                                {metric.valuesByVersionId[f.id]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Ingredients Matrix */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    مقایسه ماتریسی درصد مواد اولیه (%)
                  </h4>
                  <div className="overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-700">
                        <tr>
                          <th className="p-3">ماده اولیه</th>
                          <th className="p-3">نقش و عملکرد</th>
                          {formulationsToCompare.map((f) => (
                            <th key={f.id} className="p-3 text-center border-r border-stone-200 dark:border-stone-700">
                              {f.versionCode}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                        {matrix.comparisonRows.map((row, idx) => {
                          const funcMeta = INGREDIENT_FUNCTION_LABELS[row.category] || {
                            titleFa: row.category,
                            color: 'stone'
                          };
                          return (
                            <tr
                              key={idx}
                              className={
                                idx % 2 === 0
                                  ? 'bg-white dark:bg-stone-900'
                                  : 'bg-stone-50/50 dark:bg-stone-800/30'
                              }
                            >
                              <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                                {row.nameFa}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                                  {funcMeta.titleFa}
                                </span>
                              </td>
                              {formulationsToCompare.map((f) => {
                                const val = row.valuesByVersionId[f.id];
                                return (
                                  <td
                                    key={f.id}
                                    className="p-3 text-center border-r border-stone-200 dark:border-stone-800"
                                  >
                                    {val !== null ? (
                                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                                        {val.toFixed(2)}%
                                      </span>
                                    ) : (
                                      <span className="text-stone-300 dark:text-stone-700 font-mono">
                                        —
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-stone-200 dark:border-stone-800 px-6 py-4 bg-stone-50 dark:bg-stone-900/80 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-500">
            توسعه محصول صنایع غذایی — سیستم مقایسه فرمولاسیون
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 transition-colors"
          >
            بستن پنجره مقایسه
          </button>
        </div>
      </div>
    </div>
  );
};
