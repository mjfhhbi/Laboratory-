import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  HelpCircle, 
  CheckCircle2, 
  Sliders, 
  ScatterChart as ScatterIcon,
  Layers
} from 'lucide-react';
import { StatisticalDataset } from '../../types/statistics';
import { calculateCorrelationAndRegression, DataPointXY } from '../../lib/statistics/correlationRegression';
import { calculateDescriptiveStats } from '../../lib/statistics/descriptiveStats';

interface CorrelationRegressionSectionProps {
  dataset: StatisticalDataset;
}

export const CorrelationRegressionSection: React.FC<CorrelationRegressionSectionProps> = ({
  dataset
}) => {
  // Extract pairs of (X, Y)
  // Options:
  // 1. If treatments have numerical labels (e.g. 40, 60, 80, 100 °C or Days 1, 3, 5, 7) -> use treatment numerical value as X and replicate values as Y!
  // 2. Or sequential index (1, 2, 3...)
  const [useSequentialX, setUseSequentialX] = useState<boolean>(false);

  const points: DataPointXY[] = useMemo(() => {
    const list: DataPointXY[] = [];

    dataset.groups.forEach((g, gIdx) => {
      // Try parsing treatment label or name to number
      let xVal = gIdx + 1;
      if (!useSequentialX) {
        const numMatch = (g.treatmentLabel || g.name).match(/[-+]?[0-9]*\.?[0-9]+/);
        if (numMatch) {
          const parsed = parseFloat(numMatch[0]);
          if (!isNaN(parsed)) {
            xVal = parsed;
          }
        }
      }

      g.replicates.forEach((r) => {
        if (r.rawValue !== null && !isNaN(r.rawValue) && !r.isExcluded) {
          list.push({
            x: xVal,
            y: r.rawValue
          });
        }
      });
    });

    return list;
  }, [dataset, useSequentialX]);

  const analysis = useMemo(() => {
    return calculateCorrelationAndRegression(points);
  }, [points]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-5 p-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            تحلیل همبستگی و رگرسیون خطی (Correlation & Linear Regression)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            محاسبه ضرایب همبستگی پیرسون و اسپیرمن، معادله خط رگرسیون OLS و ارزیابی نیکویی برازش مدل
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="text-slate-600 font-medium">نحوه تعیین متغیر مستقل (X):</label>
          <select
            value={useSequentialX ? 'seq' : 'numeric'}
            onChange={(e) => setUseSequentialX(e.target.value === 'seq')}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="numeric">استخراج عدد از نام تیمار (دما، غلظت، زمان)</option>
            <option value="seq">شماره ترتیبی تیمارها (۱، ۲، ۳...)</option>
          </select>
        </div>
      </div>

      {points.length < 3 ? (
        <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
          برای محاسبه همبستگی و رگرسیون حداقل به ۳ نقطه داده معتبر نیاز است.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Regression Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Pearson r */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[11px] text-slate-500 block">ضریب همبستگی پیرسون (r):</span>
              <strong className="text-base font-mono text-emerald-700">{analysis.pearsonR}</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">
                {Math.abs(analysis.pearsonR) > 0.8
                  ? 'همبستگی بسیار قوی'
                  : Math.abs(analysis.pearsonR) > 0.5
                  ? 'همبستگی متوسط'
                  : 'همبستگی ضعیف'}
              </span>
            </div>

            {/* Spearman rho */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[11px] text-slate-500 block">همبستگی رتبه‌ای اسپیرمن (ρ):</span>
              <strong className="text-base font-mono text-indigo-700">{analysis.spearmanRho}</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">ناپارامتریک، مقاوم در برابر اریب</span>
            </div>

            {/* R-Squared */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[11px] text-slate-500 block">ضریب تبیین (R²):</span>
              <strong className="text-base font-mono text-blue-700">
                {(analysis.rSquared * 100).toFixed(1)}%
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                تعدیل‌شده: {(analysis.adjustedRSquared * 100).toFixed(1)}%
              </span>
            </div>

            {/* p-value */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[11px] text-slate-500 block">معناداری رگرسیون (P-value):</span>
              <strong
                className={`text-base font-mono ${
                  analysis.isSignificant ? 'text-emerald-700' : 'text-slate-700'
                }`}
              >
                {analysis.pValue < 0.0001 ? '< 0.0001' : analysis.pValue}
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {analysis.isSignificant ? 'رابطه خطی معنی‌دار است' : 'رابطه معنی‌دار نیست'}
              </span>
            </div>
          </div>

          {/* Regression Equation Box */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/60 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-900 block">معادله خط رگرسیون برآورد شده:</span>
              <div className="text-lg font-mono font-bold text-emerald-800 dir-ltr text-right inline-block">
                {analysis.equation}
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-0.5 text-right font-mono">
              <div>شیب خط (Slope m): {analysis.slope} ± {analysis.slopeSE} (p = {analysis.slopePValue})</div>
              <div>عرض از مبدأ (Intercept b): {analysis.intercept} ± {analysis.interceptSE}</div>
              <div>خطای معیار برآورد (Syx): {analysis.standardErrorOfEstimate}</div>
            </div>
          </div>

          {/* Simple ASCII / Visual scatter representation */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-bold">جدول باقیمانده‌ها و مقادیر پیش‌بینی‌شده مدل (Residuals):</span>
              <span className="text-slate-400 font-mono text-[11px]">N = {points.length} مشاهدات</span>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 font-semibold text-slate-600">
                    <th className="py-2 px-3 text-center">مشاهده</th>
                    <th className="py-2 px-3 text-center">متغیر X</th>
                    <th className="py-2 px-3 text-center">مقدار واقعی Y</th>
                    <th className="py-2 px-3 text-center">مقدار پیش‌بینی (Ŷ)</th>
                    <th className="py-2 px-3 text-center">باقیمانده (e = Y - Ŷ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-center">
                  {analysis.residuals.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-1.5 px-3 text-slate-700">{r.x}</td>
                      <td className="py-1.5 px-3 font-semibold text-slate-800">{r.y}</td>
                      <td className="py-1.5 px-3 text-indigo-700">{r.yPred}</td>
                      <td
                        className={`py-1.5 px-3 font-bold ${
                          Math.abs(r.residual) > analysis.standardErrorOfEstimate * 2
                            ? 'text-rose-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {r.residual > 0 ? `+${r.residual}` : r.residual}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
