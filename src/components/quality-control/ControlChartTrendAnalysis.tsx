import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Legend
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Layers, 
  ShieldCheck, 
  Compass,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { QCTrendPoint, SpcRuleViolation, VerifiedAcceptanceLimit } from '../../types/qualityControl';
import { MILK_FAT_HISTORICAL_RUNS, VERIFIED_ACCEPTANCE_LIMITS } from '../../data/qualityControlData';

interface ControlChartTrendAnalysisProps {
  historicalRuns?: QCTrendPoint[];
  selectedLimit?: VerifiedAcceptanceLimit;
}

export const ControlChartTrendAnalysis: React.FC<ControlChartTrendAnalysisProps> = ({
  historicalRuns = MILK_FAT_HISTORICAL_RUNS,
  selectedLimit = VERIFIED_ACCEPTANCE_LIMITS[0]
}) => {
  const [selectedDatasetKey, setSelectedDatasetKey] = useState<'milk_fat' | 'tomato_brix' | 'oil_peroxide'>('milk_fat');

  // Datasets
  const datasets: Record<string, { title: string; unit: string; limit: VerifiedAcceptanceLimit; data: QCTrendPoint[] }> = {
    milk_fat: {
      title: 'شیر پاستوریزه ۳٪ چربی - درصد چربی کل (INSO 2406)',
      unit: '% w/w',
      limit: VERIFIED_ACCEPTANCE_LIMITS[0],
      data: MILK_FAT_HISTORICAL_RUNS
    },
    tomato_brix: {
      title: 'رب گوجه‌فرنگی - درجه بریکس محلول (INSO 761)',
      unit: '°Brix',
      limit: VERIFIED_ACCEPTANCE_LIMITS[3],
      data: [
        { batchNumber: 'TOM-031', sampleCode: 'SMP-T31', date: '08-10', value: 28.3, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Atago Ref' },
        { batchNumber: 'TOM-032', sampleCode: 'SMP-T32', date: '08-11', value: 28.4, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Atago Ref' },
        { batchNumber: 'TOM-033', sampleCode: 'SMP-T33', date: '08-12', value: 28.5, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Atago Ref' },
        { batchNumber: 'TOM-034', sampleCode: 'SMP-T34', date: '08-13', value: 28.6, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Atago Ref' },
        { batchNumber: 'TOM-035', sampleCode: 'SMP-T35', date: '08-14', value: 28.7, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Atago Ref' },
        { batchNumber: 'TOM-036', sampleCode: 'SMP-T36', date: '08-15', value: 28.8, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Atago Ref' },
        { batchNumber: 'TOM-037', sampleCode: 'SMP-T37', date: '08-16', value: 28.9, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Atago Ref' },
        { batchNumber: 'TOM-038', sampleCode: 'SMP-T38', date: '08-17', value: 29.1, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_warning', operator: 'علی کاظمی', equipment: 'Atago Ref' },
        { batchNumber: 'TOM-039', sampleCode: 'SMP-T39', date: '08-18', value: 29.15, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_warning', operator: 'سارا رستمی', equipment: 'Atago Ref' },
        { batchNumber: 'TOM-040', sampleCode: 'SMP-T40', date: '08-19', value: 28.7, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Atago Ref' },
        { batchNumber: 'TOM-041', sampleCode: 'SMP-T41', date: '08-20', value: 28.6, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Atago Ref' },
        { batchNumber: 'TOM-042', sampleCode: 'SMP-T42', date: '08-21', value: 28.5, mean: 28.6, ucl: 29.26, lcl: 27.94, uwl: 29.04, lwl: 28.16, usl: 30.0, lsl: 28.0, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Atago Ref' }
      ]
    },
    oil_peroxide: {
      title: 'روغن سرخ‌کردنی - عدد پراکسید (INSO 4152)',
      unit: 'meq O2/kg',
      limit: VERIFIED_ACCEPTANCE_LIMITS[5],
      data: [
        { batchNumber: 'OIL-081', sampleCode: 'SMP-O81', date: '08-01', value: 0.70, mean: 0.85, ucl: 1.39, lcl: 0.31, uwl: 1.21, lwl: 0.49, usl: 2.00, lsl: 0.0, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Metrohm Titrator' },
        { batchNumber: 'OIL-082', sampleCode: 'SMP-O82', date: '08-03', value: 0.75, mean: 0.85, ucl: 1.39, lcl: 0.31, uwl: 1.21, lwl: 0.49, usl: 2.00, lsl: 0.0, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Metrohm Titrator' },
        { batchNumber: 'OIL-083', sampleCode: 'SMP-O83', date: '08-05', value: 0.82, mean: 0.85, ucl: 1.39, lcl: 0.31, uwl: 1.21, lwl: 0.49, usl: 2.00, lsl: 0.0, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Metrohm Titrator' },
        { batchNumber: 'OIL-084', sampleCode: 'SMP-O84', date: '08-07', value: 0.90, mean: 0.85, ucl: 1.39, lcl: 0.31, uwl: 1.21, lwl: 0.49, usl: 2.00, lsl: 0.0, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Metrohm Titrator' },
        { batchNumber: 'OIL-085', sampleCode: 'SMP-O85', date: '08-09', value: 0.95, mean: 0.85, ucl: 1.39, lcl: 0.31, uwl: 1.21, lwl: 0.49, usl: 2.00, lsl: 0.0, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Metrohm Titrator' },
        { batchNumber: 'OIL-086', sampleCode: 'SMP-O86', date: '08-11', value: 1.10, mean: 0.85, ucl: 1.39, lcl: 0.31, uwl: 1.21, lwl: 0.49, usl: 2.00, lsl: 0.0, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Metrohm Titrator' },
        { batchNumber: 'OIL-087', sampleCode: 'SMP-O87', date: '08-14', value: 1.30, mean: 0.85, ucl: 1.39, lcl: 0.31, uwl: 1.21, lwl: 0.49, usl: 2.00, lsl: 0.0, status: 'in_spec_warning', operator: 'سارا رستمی', equipment: 'Metrohm Titrator' },
        { batchNumber: 'OIL-088', sampleCode: 'SMP-O88', date: '08-17', value: 2.45, mean: 0.85, ucl: 1.39, lcl: 0.31, uwl: 1.21, lwl: 0.49, usl: 2.00, lsl: 0.0, status: 'out_of_specification', operator: 'سارا رستمی', equipment: 'Metrohm Titrator' }, // OOS & OOC
        { batchNumber: 'OIL-089', sampleCode: 'SMP-O89', date: '08-20', value: 0.78, mean: 0.85, ucl: 1.39, lcl: 0.31, uwl: 1.21, lwl: 0.49, usl: 2.00, lsl: 0.0, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Metrohm Titrator' },
        { batchNumber: 'OIL-090', sampleCode: 'SMP-O90', date: '08-23', value: 0.80, mean: 0.85, ucl: 1.39, lcl: 0.31, uwl: 1.21, lwl: 0.49, usl: 2.00, lsl: 0.0, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Metrohm Titrator' }
      ]
    }
  };

  const currentDataset = datasets[selectedDatasetKey];
  const activeLimit = currentDataset.limit;
  const dataPoints = currentDataset.data;

  // Statistical calculations across the dataset
  const values = dataPoints.map(d => d.value);
  const n = values.length;
  const overallMean = n > 0 ? values.reduce((a, b) => a + b, 0) / n : 0;
  const overallSD = n > 1 
    ? Math.sqrt(values.reduce((acc, v) => acc + Math.pow(v - overallMean, 2), 0) / (n - 1))
    : 0;
  const overallRSD = overallMean > 0 ? (overallSD / overallMean) * 100 : 0;

  // Westgard & Shewhart Rules Evaluation Engine
  const evaluateWestgardRules = () => {
    const violations: { rule: string; nameFa: string; descFa: string; severity: 'critical' | 'warning'; batch: string }[] = [];

    dataPoints.forEach((pt, i) => {
      // Rule 1: 1_3s (Single point > 3SD)
      if (pt.ucl !== undefined && pt.value > pt.ucl) {
        violations.push({
          rule: '1_3s',
          nameFa: 'قاعده ۱-۳s (خروج نقطه از ۳ انحراف معیار)',
          descFa: `مقدار بهمن ${pt.batchNumber} (${pt.value}) بالاتر از خط حد کنترل فوقانی UCL (${pt.ucl}) است. نشان‌دهنده خطای تصادفی شدید یا سیستماتیک.`,
          severity: 'critical',
          batch: pt.batchNumber
        });
      } else if (pt.lcl !== undefined && pt.value < pt.lcl) {
        violations.push({
          rule: '1_3s',
          nameFa: 'قاعده ۱-۳s (خروج نقطه از -۳SD)',
          descFa: `مقدار بهمن ${pt.batchNumber} (${pt.value}) پایین‌تر از خط حد کنترل تحتانی LCL (${pt.lcl}) است.`,
          severity: 'critical',
          batch: pt.batchNumber
        });
      }

      // Rule 2: 2_2s (Two consecutive points > 2SD on same side)
      if (i > 0 && pt.uwl !== undefined) {
        const prev = dataPoints[i - 1];
        if (pt.value > pt.uwl && prev.value > (prev.uwl ?? pt.uwl)) {
          violations.push({
            rule: '2_2s',
            nameFa: 'قاعده ۲-۲s (دو نقطه متوالی فراتر از +۲SD)',
            descFa: `بهمن‌های متوالی ${prev.batchNumber} و ${pt.batchNumber} هر دو در ناحیه بالای هشدار قرار دارند. نشان‌دهنده خطای سیستماتیک در کالیبراسیون یا ماده اولیه.`,
            severity: 'critical',
            batch: pt.batchNumber
          });
        }
      }

      // Rule 3: OOS Check against authentic Standard Limit (USL / LSL)
      if (activeLimit.maxLimit !== undefined && pt.value > activeLimit.maxLimit) {
        violations.push({
          rule: 'OOS',
          nameFa: 'خروج از مشخصات استاندارد (Out-of-Specification)',
          descFa: `بهمن ${pt.batchNumber} با مقدار ${pt.value} فراتر از سقف قانونی استاندارد (${activeLimit.maxLimit} ${activeLimit.unit}) است. بهمن باید متوقف و قرنطینه گردد.`,
          severity: 'critical',
          batch: pt.batchNumber
        });
      }
    });

    // Rule 4: Trend / Drift (6 consecutive increasing points)
    for (let i = 5; i < dataPoints.length; i++) {
      let isIncreasing = true;
      for (let j = i - 5; j < i; j++) {
        if (dataPoints[j + 1].value <= dataPoints[j].value) {
          isIncreasing = false;
          break;
        }
      }
      if (isIncreasing) {
        violations.push({
          rule: 'Trend_Drift',
          nameFa: 'روند صعودی مداوم ۶ نقطه (Drift Trend)',
          descFa: `۶ بهمن متوالی منتهی به ${dataPoints[i].batchNumber} دارای شیب صعودی مداوم هستند. نشان‌دهنده دریفت تدریجی دستگاه یا تجمع رسوب/فرسایش فرآیند.`,
          severity: 'warning',
          batch: dataPoints[i].batchNumber
        });
        break;
      }
    }

    return violations;
  };

  const westgardViolations = evaluateWestgardRules();

  return (
    <div id="control-chart-trend-container" className="space-y-6">
      {/* Chart Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Header and Dataset Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                نمودار کنترل شوهارت (Shewhart Control Chart) و تحلیل روند SPC
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              پایش سری زمانی بهمن‌ها بر مبنای خطوط میانگین (X̄)، حدود هشدار (±2SD)، حدود کنترل (±3SD) و مشخصات استاندارد مرجع.
            </p>
          </div>

          {/* Dataset Switcher */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">مجموعه داده:</label>
            <select
              value={selectedDatasetKey}
              onChange={(e) => setSelectedDatasetKey(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="milk_fat">شیر پاستوریزه (درصد چربی)</option>
              <option value="tomato_brix">رب گوجه‌فرنگی (درجه بریکس)</option>
              <option value="oil_peroxide">روغن سرخ‌کردنی (عدد پراکسید)</option>
            </select>
          </div>
        </div>

        {/* Source-verified limits banner */}
        <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-900">{currentDataset.title}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-700 font-mono text-[11px]">
            {activeLimit.minLimit !== undefined && <span>LSL: {activeLimit.minLimit}</span>}
            {activeLimit.maxLimit !== undefined && <span>USL: {activeLimit.maxLimit}</span>}
            <span>مرکز (X̄): {activeLimit.historicalMean ?? overallMean.toFixed(2)}</span>
            <span>UCL (+3SD): {activeLimit.controlLimitUpper ?? (overallMean + 3 * overallSD).toFixed(2)}</span>
            <span>LCL (-3SD): {activeLimit.controlLimitLower ?? (overallMean - 3 * overallSD).toFixed(2)}</span>
          </div>
        </div>

        {/* The Visual Recharts Graph */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataPoints} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="batchNumber" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                label={{ value: 'شماره بهمن تولید (Production Batches)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#475569' }}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: `مقدار اندازه‌گیری‌شده (${currentDataset.unit})`, angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#475569' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as QCTrendPoint;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 font-mono border border-slate-700">
                        <div className="font-bold text-emerald-400">بهمن: {d.batchNumber}</div>
                        <div>مقدار: {d.value} {currentDataset.unit}</div>
                        <div className="text-slate-400">تاریخ: {d.date}</div>
                        <div className="text-slate-400">آنالیست: {d.operator}</div>
                        <div className={`font-bold ${
                          d.status === 'out_of_specification' ? 'text-rose-400' :
                          d.status === 'in_spec_warning' ? 'text-amber-400' : 'text-emerald-300'
                        }`}>
                          وضعیت: {
                            d.status === 'out_of_specification' ? 'خارج از مشخصات (OOS)' :
                            d.status === 'in_spec_warning' ? 'هشدار آماری (2SD)' : 'تحت کنترل (In-Control)'
                          }
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />

              {/* Specification Upper Limit (USL - Solid Red) */}
              {activeLimit.maxLimit !== undefined && (
                <ReferenceLine 
                  y={activeLimit.maxLimit} 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  label={{ value: `USL: ${activeLimit.maxLimit}`, fill: '#ef4444', fontSize: 10, position: 'top' }} 
                />
              )}

              {/* Specification Lower Limit (LSL - Solid Red) */}
              {activeLimit.minLimit !== undefined && (
                <ReferenceLine 
                  y={activeLimit.minLimit} 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  label={{ value: `LSL: ${activeLimit.minLimit}`, fill: '#ef4444', fontSize: 10, position: 'bottom' }} 
                />
              )}

              {/* Upper Control Limit (+3SD - Dashed Amber) */}
              <ReferenceLine 
                y={activeLimit.controlLimitUpper ?? (overallMean + 3 * overallSD)} 
                stroke="#f59e0b" 
                strokeDasharray="4 4" 
                label={{ value: `UCL (+3SD): ${activeLimit.controlLimitUpper ?? (overallMean + 3 * overallSD).toFixed(2)}`, fill: '#d97706', fontSize: 10, position: 'insideTopRight' }} 
              />

              {/* Center Mean Line (Solid Green) */}
              <ReferenceLine 
                y={activeLimit.historicalMean ?? overallMean} 
                stroke="#10b981" 
                strokeWidth={1.5}
                label={{ value: `میانگین Mean: ${activeLimit.historicalMean ?? overallMean.toFixed(2)}`, fill: '#059669', fontSize: 10, position: 'insideRight' }} 
              />

              {/* Lower Control Limit (-3SD - Dashed Amber) */}
              <ReferenceLine 
                y={activeLimit.controlLimitLower ?? (overallMean - 3 * overallSD)} 
                stroke="#f59e0b" 
                strokeDasharray="4 4" 
                label={{ value: `LCL (-3SD): ${activeLimit.controlLimitLower ?? (overallMean - 3 * overallSD).toFixed(2)}`, fill: '#d97706', fontSize: 10, position: 'insideBottomRight' }} 
              />

              {/* Data Points Line */}
              <Line 
                type="monotone" 
                dataKey="value" 
                name="مقدار اندازه‌گیری‌شده بهمن" 
                stroke="#4f46e5" 
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 1, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dataset Statistical Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center space-y-0.5">
            <span className="text-[10px] text-slate-500 block font-medium">تعداد بهمن‌های پایش‌شده</span>
            <div className="text-xl font-bold font-mono text-slate-800">{n} Batch</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center space-y-0.5">
            <span className="text-[10px] text-slate-500 block font-medium">میانگین کل (X̄)</span>
            <div className="text-xl font-bold font-mono text-emerald-600">{overallMean.toFixed(3)} {currentDataset.unit}</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center space-y-0.5">
            <span className="text-[10px] text-slate-500 block font-medium">انحراف معیار کل (s)</span>
            <div className="text-xl font-bold font-mono text-indigo-600">{overallSD.toFixed(4)}</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center space-y-0.5">
            <span className="text-[10px] text-slate-500 block font-medium">درصد پراکندگی (RSD%)</span>
            <div className="text-xl font-bold font-mono text-slate-800">{overallRSD.toFixed(2)} %</div>
          </div>
        </div>
      </div>

      {/* Westgard & SPC Rules Violations Detector Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              موتور تحلیل قواعد کنترل آماری وست‌گارد (Westgard Multi-Rule Evaluation)
            </h4>
            <p className="text-xs text-slate-500">
              ارزیابی خودکار خطاهای تصادفی، شیفت‌های کالیبراسیون و انحرافات روند در طول خط تولید.
            </p>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            westgardViolations.length === 0 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}>
            {westgardViolations.length === 0 ? 'کلیه قواعد رعایت شده (In-Control)' : `${westgardViolations.length} مورد نقض قاعده`}
          </span>
        </div>

        {westgardViolations.length > 0 ? (
          <div className="space-y-3">
            {westgardViolations.map((v, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
                  v.severity === 'critical' 
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  v.severity === 'critical' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{v.nameFa}</span>
                    <span className="font-mono px-2 py-0.5 bg-white rounded border border-slate-200 font-bold">
                      بهمن: {v.batch}
                    </span>
                  </div>
                  <p className="leading-relaxed font-medium">
                    {v.descFa}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3 text-emerald-950 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              فرآیند در حالت پایدار آماری قرار دارد. هیچ نشانه‌ای از نقض قواعد شوهارت، خطای سیستماتیک یا خروج از محدوده استاندارد یافت نشد.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
