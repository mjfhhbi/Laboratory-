import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ErrorBar, 
  LineChart, 
  Line, 
  ScatterChart, 
  Scatter, 
  Legend 
} from 'recharts';
import { BarChart2, TrendingUp, Sliders } from 'lucide-react';
import { StatisticalDataset, DescriptiveStats, AnovaAnalysisResult } from '../../types/statistics';

interface ScientificChartsProps {
  dataset: StatisticalDataset;
  statsMap: Record<string, DescriptiveStats>;
  anovaResult?: AnovaAnalysisResult;
}

export const ScientificCharts: React.FC<ScientificChartsProps> = ({
  dataset,
  statsMap,
  anovaResult
}) => {
  const [errorBarType, setErrorBarType] = useState<'sd' | 'se'>('sd');
  const [chartType, setChartType] = useState<'bar' | 'scatter_line'>('bar');

  // Prepare data for Bar chart with error bars
  const barChartData = dataset.groups.map((g) => {
    const s = statsMap[g.id];
    const letter = anovaResult?.postHoc.groupLetters[g.id] || '';
    const errValue = s ? (errorBarType === 'sd' ? s.sd : s.se) : 0;

    return {
      name: g.treatmentLabel ? `${g.treatmentLabel}: ${g.name}` : g.name,
      shortName: g.treatmentLabel || g.name,
      mean: s ? Number(s.mean.toFixed(3)) : 0,
      error: Number(errValue.toFixed(3)),
      sd: s ? Number(s.sd.toFixed(3)) : 0,
      se: s ? Number(s.se.toFixed(3)) : 0,
      cv: s ? Number(s.cv.toFixed(2)) : 0,
      letter
    };
  });

  // Prepare scatter / individual replicate points
  const scatterPoints: Array<{ xName: string; value: number; repNum: number }> = [];
  dataset.groups.forEach((g) => {
    g.replicates.forEach((r) => {
      if (r.rawValue !== null && !isNaN(r.rawValue) && !r.isExcluded) {
        scatterPoints.push({
          xName: g.treatmentLabel || g.name,
          value: r.rawValue,
          repNum: r.repNumber
        });
      }
    });
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-5 p-6">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            نمودارهای علمی و بصری‌سازی نتایج آزمایش (Scientific Visualizations)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            نمودار ستونی استاندارد با میله‌های خطا (Error Bars) و برچسب‌های حروف مقایسه میانگین‌ها
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Error Bar Type Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setErrorBarType('sd')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                errorBarType === 'sd'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              میله خطا: Mean ± SD
            </button>
            <button
              type="button"
              onClick={() => setErrorBarType('se')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                errorBarType === 'se'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              میله خطا: Mean ± SE
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barChartData}
            margin={{ top: 25, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="shortName"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              label={{
                value: `${dataset.responseVariable.name} (${dataset.responseVariable.unit || ''})`,
                angle: -90,
                position: 'insideLeft',
                fontSize: 11,
                fill: '#64748B',
                offset: 10
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl space-y-1">
                      <p className="font-bold text-emerald-400">{data.name}</p>
                      <p>
                        میانگین: <strong className="font-mono">{data.mean}</strong> {dataset.responseVariable.unit}
                      </p>
                      <p>
                        انحراف معیار (SD): <strong className="font-mono">±{data.sd}</strong>
                      </p>
                      <p>
                        خطای معیار (SE): <strong className="font-mono">±{data.se}</strong>
                      </p>
                      <p>
                        ضریب تغییرات: <strong className="font-mono">{data.cv}%</strong>
                      </p>
                      {data.letter && (
                        <p className="pt-1 border-t border-slate-700 text-amber-300 font-bold">
                          گروه‌بندی توکی: {data.letter}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="mean"
              fill="#059669"
              radius={[6, 6, 0, 0]}
              label={({ x, y, width, value, index }: any) => {
                const item = barChartData[index];
                if (!item) return null;
                const letter = item.letter;
                const xPos = Number(x) + Number(width) / 2;
                const yPos = Number(y) - 10;
                return (
                  <text
                    x={xPos}
                    y={yPos}
                    fill="#0F172A"
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {letter ? `${value} ${letter}` : value}
                  </text>
                );
              }}
            >
              <ErrorBar dataKey="error" width={4} strokeWidth={1.5} stroke="#047857" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Caption */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 leading-normal flex items-center justify-between">
        <span>
          <strong>توضیح نمودار:</strong> ارتفاع هر ستون نشان‌دهنده میانگین تیمار و میله‌های عمودی نشان‌دهنده {errorBarType === 'sd' ? 'انحراف معیار (SD)' : 'خطای معیار (SE)'} هستند. حروف انگلیسی بالای هر ستون نمایانگر گروه‌بندی آماری آزمون تعقیبی توکی (Tukey's HSD) در سطح احتمال ۵ درصد می‌باشند.
        </span>
      </div>
    </div>
  );
};
