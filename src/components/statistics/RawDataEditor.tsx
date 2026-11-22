import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  EyeOff, 
  Eye, 
  ShieldCheck, 
  Clipboard,
  Info
} from 'lucide-react';
import { StatisticalDataset, TreatmentGroup, RawReplicate } from '../../types/statistics';
import { calculateDescriptiveStats } from '../../lib/statistics/descriptiveStats';

interface RawDataEditorProps {
  dataset: StatisticalDataset;
  onChange: (updated: StatisticalDataset) => void;
}

export const RawDataEditor: React.FC<RawDataEditorProps> = ({ dataset, onChange }) => {
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [pasteModalGroup, setPasteModalGroup] = useState<TreatmentGroup | null>(null);
  const [pasteText, setPasteText] = useState<string>('');

  // Calculate stats to detect outliers in real-time
  const groupStats = dataset.groups.map((g) => calculateDescriptiveStats(g.replicates, g.name));

  // Find max replicates count across groups to structure column headers
  const maxReps = Math.max(3, ...dataset.groups.map((g) => g.replicates.length));

  const handleCellChange = (groupIndex: number, repIndex: number, rawStr: string) => {
    const updatedGroups = [...dataset.groups];
    const targetGroup = { ...updatedGroups[groupIndex] };
    const targetReps = [...targetGroup.replicates];

    let val: number | null = null;
    if (rawStr.trim() !== '') {
      const parsed = parseFloat(rawStr);
      if (!isNaN(parsed)) {
        val = parsed;
      }
    }

    if (repIndex < targetReps.length) {
      targetReps[repIndex] = {
        ...targetReps[repIndex],
        rawValue: val
      };
    } else {
      targetReps.push({
        id: `rep-${Date.now()}-${repIndex}`,
        repNumber: repIndex + 1,
        rawValue: val
      });
    }

    targetGroup.replicates = targetReps;
    updatedGroups[groupIndex] = targetGroup;

    onChange({
      ...dataset,
      groups: updatedGroups,
      updatedAt: new Date().toISOString()
    });
  };

  const toggleExcludeReplicate = (groupIndex: number, repIndex: number) => {
    const updatedGroups = [...dataset.groups];
    const targetGroup = { ...updatedGroups[groupIndex] };
    const targetReps = [...targetGroup.replicates];
    const rep = targetReps[repIndex];

    const newExcluded = !rep.isExcluded;
    targetReps[repIndex] = {
      ...rep,
      isExcluded: newExcluded,
      exclusionReason: newExcluded ? 'مستثنی‌شده توسط کاربر به عنوان داده پرت یا مشکوک' : undefined
    };

    targetGroup.replicates = targetReps;
    updatedGroups[groupIndex] = targetGroup;

    onChange({
      ...dataset,
      groups: updatedGroups,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddReplicateToAll = () => {
    const nextRepNum = maxReps + 1;
    const updatedGroups = dataset.groups.map((g) => ({
      ...g,
      replicates: [
        ...g.replicates,
        {
          id: `rep-${Date.now()}-${Math.random()}`,
          repNumber: nextRepNum,
          rawValue: null
        }
      ]
    }));

    onChange({
      ...dataset,
      groups: updatedGroups,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddTreatmentGroup = () => {
    const nextIdx = dataset.groups.length + 1;
    const newGroup: TreatmentGroup = {
      id: `grp-${Date.now()}`,
      name: `تیمار جدید ${nextIdx}`,
      treatmentLabel: `T${nextIdx}`,
      replicates: Array.from({ length: maxReps }, (_, i) => ({
        id: `rep-${Date.now()}-${i}`,
        repNumber: i + 1,
        rawValue: null
      }))
    };

    onChange({
      ...dataset,
      groups: [...dataset.groups, newGroup],
      updatedAt: new Date().toISOString()
    });
  };

  const handleRemoveTreatmentGroup = (groupIndex: number) => {
    if (dataset.groups.length <= 2) return;
    const updated = dataset.groups.filter((_, i) => i !== groupIndex);
    onChange({
      ...dataset,
      groups: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handleApplyPaste = () => {
    if (!pasteModalGroup) return;
    const tokens = pasteText
      .split(/[\s,;\t\n]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => parseFloat(t))
      .filter((n) => !isNaN(n));

    if (tokens.length === 0) {
      setPasteModalGroup(null);
      return;
    }

    const groupIndex = dataset.groups.findIndex((g) => g.id === pasteModalGroup.id);
    if (groupIndex === -1) return;

    const updatedGroups = [...dataset.groups];
    const newReps: RawReplicate[] = tokens.map((val, idx) => ({
      id: `rep-p-${Date.now()}-${idx}`,
      repNumber: idx + 1,
      rawValue: val,
      isExcluded: false
    }));

    updatedGroups[groupIndex] = {
      ...updatedGroups[groupIndex],
      replicates: newReps
    };

    onChange({
      ...dataset,
      groups: updatedGroups,
      updatedAt: new Date().toISOString()
    });

    setPasteModalGroup(null);
    setPasteText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800">ماتریس ثبت و مدیریت داده‌های خام</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <ShieldCheck className="w-3 h-3" />
              اصل حفاظت از یکپارچگی داده خام
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            متغیر وابسته: <strong className="text-slate-700">{dataset.responseVariable.name}</strong> ({dataset.responseVariable.unit || '-'}) | هر تغییر بلافاصله پردازش می‌شود.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddReplicateToAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            افزودن تکرار (R{maxReps + 1})
          </button>
          <button
            type="button"
            onClick={handleAddTreatmentGroup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            افزودن تیمار
          </button>
        </div>
      </div>

      {/* Raw Data Protection Notice */}
      <div className="px-6 py-2.5 bg-blue-50/60 border-b border-blue-100/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>حفاظت داده خام:</strong> سیستم هرگز داده‌های شما را حذف یا تغییر نمی‌دهد. داده‌های پرت (Outliers) تنها پس از انتخاب صریح شما در وضعیت «مستثنی» قرار می‌گیرند.
          </span>
        </div>
      </div>

      {/* Table of Groups and Replicates */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="py-3 px-4 w-12 text-center">کد</th>
              <th className="py-3 px-4 min-w-[180px]">نام تیمار / گروه</th>
              {Array.from({ length: maxReps }, (_, i) => (
                <th key={i} className="py-3 px-3 text-center min-w-[90px]">
                  تکرار {i + 1} (R{i + 1})
                </th>
              ))}
              <th className="py-3 px-4 text-center min-w-[140px] bg-slate-100/40">خلاصه (Mean ± SD)</th>
              <th className="py-3 px-3 text-center w-24">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {dataset.groups.map((group, gIdx) => {
              const stats = groupStats[gIdx];
              return (
                <tr key={group.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Label / Code */}
                  <td className="py-3 px-4 text-center font-bold text-slate-500 bg-slate-50/30">
                    {group.treatmentLabel || `T${gIdx + 1}`}
                  </td>

                  {/* Treatment Name (Editable) */}
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => {
                        const updated = [...dataset.groups];
                        updated[gIdx] = { ...updated[gIdx], name: e.target.value };
                        onChange({ ...dataset, groups: updated });
                      }}
                      className="w-full px-2 py-1 text-xs rounded-md border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                    />
                  </td>

                  {/* Replicate Value Inputs */}
                  {Array.from({ length: maxReps }, (_, rIdx) => {
                    const rep = group.replicates[rIdx];
                    const val = rep?.rawValue;
                    const isExcluded = rep?.isExcluded ?? false;

                    // Check if flagged as outlier by Grubbs or IQR
                    const isOutlier = stats.outliers.some(
                      (o) => o.replicateNumber === (rIdx + 1)
                    );

                    return (
                      <td key={rIdx} className="py-2 px-2 text-center relative">
                        <div className="inline-flex items-center justify-center relative">
                          <input
                            type="number"
                            step="any"
                            placeholder="-"
                            value={val !== null && val !== undefined ? val : ''}
                            onChange={(e) => handleCellChange(gIdx, rIdx, e.target.value)}
                            className={`w-20 text-center py-1.5 px-1 rounded-lg text-xs font-semibold border transition-all ${
                              isExcluded
                                ? 'bg-slate-100 text-slate-400 line-through border-slate-300'
                                : isOutlier
                                ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/20'
                                : 'bg-white text-slate-800 border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                            }`}
                          />

                          {/* Exclude / Outlier toggle icon */}
                          {val !== null && val !== undefined && (
                            <button
                              type="button"
                              onClick={() => toggleExcludeReplicate(gIdx, rIdx)}
                              title={
                                isExcluded
                                  ? 'این داده مستثنی شده است. برای بازگرداندن کلیک کنید.'
                                  : isOutlier
                                  ? 'داده پرت آماری شناسایی شد! برای مستثنی کردن کلیک کنید.'
                                  : 'مستثنی کردن این تکرار از محاسبات'
                              }
                              className={`absolute -top-1.5 -right-1.5 p-0.5 rounded-full transition-transform hover:scale-110 shadow-2xs ${
                                isExcluded
                                  ? 'bg-rose-500 text-white'
                                  : isOutlier
                                  ? 'bg-amber-500 text-white'
                                  : 'text-slate-300 hover:text-slate-600 bg-white'
                              }`}
                            >
                              {isExcluded ? (
                                <EyeOff className="w-3 h-3" />
                              ) : isOutlier ? (
                                <AlertCircle className="w-3 h-3" />
                              ) : null}
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* Summary Metric */}
                  <td className="py-3 px-4 text-center font-sans bg-slate-50/40">
                    <span className="font-bold text-slate-800">
                      {stats.validCount > 0 ? stats.mean.toFixed(2) : '-'}
                    </span>
                    <span className="text-[11px] text-slate-400 mx-1">±</span>
                    <span className="text-xs text-slate-600">
                      {stats.validCount > 1 ? stats.sd.toFixed(2) : '-'}
                    </span>
                    {stats.validCount > 1 && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        CV: {stats.cv.toFixed(1)}% | n={stats.validCount}
                      </div>
                    )}
                  </td>

                  {/* Row Operations */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1 font-sans">
                      <button
                        type="button"
                        onClick={() => {
                          setPasteModalGroup(group);
                          setPasteText(group.replicates.map((r) => r.rawValue ?? '').join('\t'));
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="پیست سریع مقادیر از اکسل یا کپی"
                      >
                        <Clipboard className="w-3.5 h-3.5" />
                      </button>
                      {dataset.groups.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTreatmentGroup(gIdx)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="حذف این تیمار"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Outlier Alert Banner if any detected */}
      {groupStats.some((s) => s.outliers.length > 0) && (
        <div className="p-4 bg-amber-50/70 border-t border-amber-200/60 flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">هشدار داده‌های پرت شناسایی شده (Outliers):</span>
            <p className="text-amber-800">
              تعداد{' '}
              {groupStats.reduce((acc, s) => acc + s.outliers.length, 0)} داده دارای انحراف معنادار از میانه گروه بر اساس آزمون‌های گرابز (Grubbs) و دامنه بین‌چارکی (IQR) است.
              می‌توانید با کلیک روی آیکون زرد هر تکرار، آن را بدون حذف از رکورد آزمایش، از آنالیز آماری مستثنی فرمایید.
            </p>
          </div>
        </div>
      )}

      {/* Paste Modal */}
      {pasteModalGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clipboard className="w-4 h-4 text-emerald-600" />
              ورود سریع داده برای {pasteModalGroup.name}
            </h4>
            <p className="text-xs text-slate-500">
              اعداد تکرارها را با فاصله، تب (از اکسل) یا کاما وارد نمایید:
            </p>
            <textarea
              rows={4}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="مثال: 42.5 43.1 41.8 42.9"
              className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPasteModalGroup(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleApplyPaste}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
              >
                ثبت تکرارها
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
