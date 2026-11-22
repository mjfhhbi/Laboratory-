import React from 'react';
import { Sigma, HelpCircle, AlertCircle, Check } from 'lucide-react';
import { StatisticalDataset, DescriptiveStats } from '../../types/statistics';

interface DescriptiveStatsTableProps {
  dataset: StatisticalDataset;
  statsMap: Record<string, DescriptiveStats>;
}

export const DescriptiveStatsTable: React.FC<DescriptiveStatsTableProps> = ({ dataset, statsMap }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sigma className="w-4 h-4 text-emerald-600" />
            جدول جامع آمار توصیفی (Descriptive Statistics)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            محاسبه دقیق پارامترهای مرکزی، پراکندگی، فاصله اطمینان و خطای آزمایش
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="py-3 px-4 min-w-[140px]">تیمار آزمایشی</th>
              <th className="py-3 px-3 text-center">تعداد (N)</th>
              <th className="py-3 px-3 text-center">معتبر / حذف‌شده</th>
              <th className="py-3 px-3 text-center bg-emerald-50/50 text-emerald-900">میانگین (Mean)</th>
              <th className="py-3 px-3 text-center">میانه (Median)</th>
              <th className="py-3 px-3 text-center bg-blue-50/40 text-blue-900">انحراف معیار (SD)</th>
              <th className="py-3 px-3 text-center">خطای معیار (SE)</th>
              <th className="py-3 px-3 text-center bg-amber-50/40 text-amber-900">CV% / RSD%</th>
              <th className="py-3 px-4 text-center min-w-[150px]">فاصله اطمینان ۹۵٪</th>
              <th className="py-3 px-3 text-center">دامنه (Min - Max)</th>
              <th className="py-3 px-3 text-center">داده‌های پرت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {dataset.groups.map((group) => {
              const s = statsMap[group.id];
              if (!s) return null;

              return (
                <tr key={group.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">
                    <span className="font-bold text-slate-700 ml-1.5">{group.treatmentLabel || 'T'}:</span>
                    {group.name}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600">{s.count}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-emerald-700 font-semibold">{s.validCount}</span>
                    {s.excludedCount > 0 && (
                      <span className="text-rose-500 font-semibold text-[10px] mr-1">
                        (-{s.excludedCount})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-700 bg-emerald-50/30">
                    {s.validCount > 0 ? s.mean.toFixed(3) : '-'}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-700">
                    {s.validCount > 0 ? s.median.toFixed(3) : '-'}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-blue-700 bg-blue-50/20">
                    {s.validCount > 1 ? s.sd.toFixed(3) : '-'}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600">
                    {s.validCount > 1 ? s.se.toFixed(3) : '-'}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-amber-800 bg-amber-50/20">
                    {s.validCount > 1 ? `${s.cv.toFixed(2)}%` : '-'}
                  </td>
                  <td className="py-3 px-4 text-center text-[11px] text-slate-600 font-sans">
                    {s.validCount > 1 ? (
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                        [{s.ci95Lower.toFixed(2)}, {s.ci95Upper.toFixed(2)}]
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-3 text-center text-[11px] text-slate-500">
                    {s.validCount > 0 ? `${s.min.toFixed(2)} - ${s.max.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {s.outliers.length > 0 ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800"
                        title={s.outliers.map((o) => `تکرار ${o.replicateNumber}: ${o.value} (${o.testMethod})`).join(', ')}
                      >
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        {s.outliers.length} مورد
                      </span>
                    ) : (
                      <span className="text-slate-300 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Explanatory footer for Food Science Research Metrics */}
      <div className="p-4 bg-slate-50/60 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap gap-x-6 gap-y-2">
        <span><strong>CV% (ضریب تغییرات):</strong> معرف یکنواختی داده‌های آزمایشگاهی (در استانداردهای شیمیایی و میکروبی غذایی معمولاً CV &lt; 5% مطلوب است).</span>
        <span><strong>RSD%:</strong> برابر با انحراف معیار نسبی (Relative Standard Deviation).</span>
        <span><strong>CI 95%:</strong> فاصله اطمینان میانگین واقعی جامعه در سطح ۹۵ درصد با استفاده از توزیع تی‌استیودنت.</span>
      </div>
    </div>
  );
};
