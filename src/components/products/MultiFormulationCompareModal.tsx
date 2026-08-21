/**
 * Food Science AI - Multi-Formulation Comparison Matrix Modal
 */

import React, { useState } from 'react';
import {
  X,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileSpreadsheet,
  Copy,
  ChevronDown
} from 'lucide-react';
import { ProductDevelopmentProject, FormulationVersion } from '../../types/foodProduct';
import {
  buildMultiFormulationComparisonMatrix,
  calculateFormulationSummary,
  INGREDIENT_FUNCTION_LABELS
} from '../../lib/products/formulationEngine';

interface MultiFormulationCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProductDevelopmentProject;
}

export const MultiFormulationCompareModal: React.FC<MultiFormulationCompareModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>(
    project.formulations.map((f) => f.id)
  );

  if (!isOpen) return null;

  const formulationsToCompare = project.formulations.filter((f) =>
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

  return (
    <div
      id="multi-formulation-compare-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="w-full max-w-5xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 my-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 px-6 py-4 bg-stone-50 dark:bg-stone-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                ماتریس مقایسه پهلوبه‌پهلوی فرمولاسیون‌ها
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
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

        {/* Version Filter Bar */}
        <div className="px-6 py-3 bg-stone-100/70 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              نسخه‌های انتخابی برای مقایسه:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {project.formulations.map((form) => {
                const isSelected = selectedVersionIds.includes(form.id);
                return (
                  <button
                    key={form.id}
                    onClick={() => toggleVersionSelection(form.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
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
          </div>

          <div className="text-xs text-stone-500">
            تعداد فرمول‌های در حال مقایسه: {formulationsToCompare.length}
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
          {formulationsToCompare.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              حداقل یک نسخه فرمولاسیون را برای مقایسه انتخاب کنید.
            </div>
          ) : (
            <div className="min-w-[600px] space-y-6">
              {/* Summary KPIs Row */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  شاخص‌های ترکیبی و اقتصادی کلیدی
                </h4>
                <div className="overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-700">
                      <tr>
                        <th className="p-3 w-1/3">شاخص عملکردی</th>
                        {formulationsToCompare.map((f) => (
                          <th key={f.id} className="p-3 text-center border-r border-stone-200 dark:border-stone-700">
                            {f.versionCode}
                            {f.isBaseline && (
                              <span className="block text-[10px] text-emerald-600 font-normal">
                                (نسخه مرجع)
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

              {/* Ingredients Composition Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  مقایسه جزئیات درصد مواد اولیه (%)
                </h4>
                <div className="overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700">
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

        {/* Footer */}
        <div className="border-t border-stone-200 dark:border-stone-800 px-6 py-4 bg-stone-50 dark:bg-stone-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
          >
            بستن ماتریس مقایسه
          </button>
        </div>
      </div>
    </div>
  );
};
