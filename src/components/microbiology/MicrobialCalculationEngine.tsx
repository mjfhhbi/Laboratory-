import React, { useState } from 'react';
import { 
  Calculator, 
  Layers, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Plus, 
  Trash2, 
  RefreshCw, 
  HelpCircle, 
  ShieldCheck,
  Table,
  Binary,
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { PlateCountReplicateInput, ISO7218CalculationResult, MPNTableResult } from '../../types/microbiology';
import { calculateISO7218PlateCount, calculateMPN3Tube } from '../../lib/storage/microbiologyStorage';

type TabType = 'iso7218_cfu' | 'mpn_calculator' | 'dilution_planner';

export const MicrobialCalculationEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('iso7218_cfu');

  // --- ISO 7218 State ---
  const [volumePlated, setVolumePlated] = useState<number>(1.0); // 1.0mL pour, 0.1mL spread
  const [minCountLimit, setMinCountLimit] = useState<number>(15);
  const [maxCountLimit, setMaxCountLimit] = useState<number>(300);
  const [replicates, setReplicates] = useState<PlateCountReplicateInput[]>([
    { dilutionFactor: -2, dilutionLabel: '10⁻²', plate1Count: 168, plate2Count: 172, isExcluded: false },
    { dilutionFactor: -3, dilutionLabel: '10⁻³', plate1Count: 18, plate2Count: 22, isExcluded: false },
    { dilutionFactor: -4, dilutionLabel: '10⁻⁴', plate1Count: 2, plate2Count: 1, isExcluded: false }
  ]);

  // --- MPN State ---
  const [positivesD1, setPositivesD1] = useState<number>(3);
  const [positivesD2, setPositivesD2] = useState<number>(1);
  const [positivesD3, setPositivesD3] = useState<number>(0);
  const [initialInoculum, setInitialInoculum] = useState<number>(0.1); // 0.1g standard

  // --- Dilution Planner State ---
  const [sampleWeightGrams, setSampleWeightGrams] = useState<number>(25);
  const [diluentVolumeMl, setDiluentVolumeMl] = useState<number>(225);
  const [estimatedInitialLoad, setEstimatedInitialLoad] = useState<number>(500000); // 5 x 10^5

  // Calculations
  const isoResult: ISO7218CalculationResult = calculateISO7218PlateCount(
    replicates,
    volumePlated,
    minCountLimit,
    maxCountLimit
  );

  const mpnResult: MPNTableResult = calculateMPN3Tube(
    positivesD1,
    positivesD2,
    positivesD3,
    initialInoculum
  );

  const handleUpdateReplicate = (index: number, field: keyof PlateCountReplicateInput, value: any) => {
    setReplicates(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddDilutionRow = () => {
    const nextDilution = -(replicates.length + 1);
    setReplicates(prev => [
      ...prev,
      {
        dilutionFactor: nextDilution,
        dilutionLabel: `10⁻${Math.abs(nextDilution)}`,
        plate1Count: 0,
        plate2Count: 0,
        isExcluded: false
      }
    ]);
  };

  const handleRemoveDilutionRow = (index: number) => {
    if (replicates.length <= 1) return;
    setReplicates(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 text-right">
      {/* Tab Selectors */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('iso7218_cfu')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'iso7218_cfu'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>محاسبه شمارش کلنی میانگین موزون (ISO 7218 CFU/g)</span>
        </button>

        <button
          onClick={() => setActiveTab('mpn_calculator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'mpn_calculator'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Binary className="w-4 h-4" />
          <span>محاسبه بیشترین تعداد محتمل (MPN 3-Tube Table)</span>
        </button>

        <button
          onClick={() => setActiveTab('dilution_planner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'dilution_planner'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>طراح و شبیه‌ساز رقت‌سازی متوالی (Serial Dilution)</span>
        </button>
      </div>

      {/* ----------------- TAB 1: ISO 7218 CFU/G CALCULATOR ----------------- */}
      {activeTab === 'iso7218_cfu' && (
        <div className="space-y-6">
          {/* Method Info Banner */}
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>فرمول استاندارد میانگین موزون ISO 7218:2007 (بند ۹-۳-۵)</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300">
                فرمول استاندارد: <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300" dir="ltr">N = ∑C / [ V × (n₁ + 0.1 n₂) × d ]</span> | گرد کردن الزامی به ۲ رقم با معنی
              </p>
            </div>

            {/* Inoculation Settings */}
            <div className="flex items-center gap-3 bg-white dark:bg-stone-900 p-2 rounded-xl border border-stone-200 dark:border-stone-800">
              <div className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">روش کشت:</div>
              <button
                type="button"
                onClick={() => setVolumePlated(1.0)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  volumePlated === 1.0 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                }`}
              >
                آمیخته پورپلیت (1.0 mL)
              </button>
              <button
                type="button"
                onClick={() => setVolumePlated(0.1)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  volumePlated === 0.1 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                }`}
              >
                سطحی اسپردپلیت (0.1 mL)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input Replicates Table */}
            <div className="lg:col-span-7 space-y-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-emerald-600" />
                  <span>جدول ثبت تعداد کلنی‌ها در رقت‌های متوالی (۲ تکرار به ازای هر رقت)</span>
                </h4>

                <button
                  type="button"
                  onClick={handleAddDilutionRow}
                  className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-stone-700 dark:text-stone-300 hover:text-emerald-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 border border-stone-200 dark:border-stone-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن رقت</span>
                </button>
              </div>

              <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold text-center w-20">فاکتور رقت</th>
                      <th className="py-2.5 px-3 font-semibold text-center">پلیت ۱ (تکرار ۱)</th>
                      <th className="py-2.5 px-3 font-semibold text-center">پلیت ۲ (تکرار ۲)</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-24">میانگین</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-24">وضعیت رنج</th>
                      <th className="py-2.5 px-3 text-center w-12">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {replicates.map((rep, idx) => {
                      const avg = (rep.plate1Count + rep.plate2Count) / 2;
                      const isInRange = avg >= minCountLimit && avg <= maxCountLimit;
                      const isLow = avg < minCountLimit;
                      const isHigh = avg > maxCountLimit;

                      return (
                        <tr key={idx} className={rep.isExcluded ? 'opacity-40 bg-stone-100 dark:bg-stone-800/40' : 'hover:bg-stone-50/50'}>
                          <td className="py-2.5 px-3 font-mono font-bold text-center text-emerald-800 dark:text-emerald-300">
                            {rep.dilutionLabel}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="2000"
                              value={rep.plate1Count}
                              onChange={(e) => handleUpdateReplicate(idx, 'plate1Count', Math.max(0, Number(e.target.value) || 0))}
                              className="w-20 px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-center font-mono font-bold text-xs"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="2000"
                              value={rep.plate2Count}
                              onChange={(e) => handleUpdateReplicate(idx, 'plate2Count', Math.max(0, Number(e.target.value) || 0))}
                              className="w-20 px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-center font-mono font-bold text-xs"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-mono text-center font-semibold text-stone-800 dark:text-stone-200">
                            {avg}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isInRange
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : isHigh
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {isInRange ? 'قابل شمارش' : isHigh ? 'بیش از حد' : 'کمتر از حد'}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveDilutionRow(idx)}
                              disabled={replicates.length <= 1}
                              className="p-1 text-stone-400 hover:text-rose-600 transition-colors disabled:opacity-20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Range settings tweak */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
                <span>محدوده شمارش معتبر پلیت:</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px]">حداقل:</span>
                  <input
                    type="number"
                    value={minCountLimit}
                    onChange={(e) => setMinCountLimit(Number(e.target.value) || 15)}
                    className="w-14 px-1.5 py-0.5 border border-stone-200 dark:border-stone-700 rounded text-center font-mono"
                  />
                  <span className="text-[11px]">حداکثر:</span>
                  <input
                    type="number"
                    value={maxCountLimit}
                    onChange={(e) => setMaxCountLimit(Number(e.target.value) || 300)}
                    className="w-14 px-1.5 py-0.5 border border-stone-200 dark:border-stone-700 rounded text-center font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Calculation Result & Formula Details */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-2xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    نتیجه نهایی شمارش (Reported Count)
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md text-emerald-100">
                    ISO 7218
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-black font-mono tracking-tight text-white" dir="ltr">
                    {isoResult.reportedResultString}
                  </div>
                  <div className="text-xs text-emerald-200 font-mono">
                    Log₁₀ = {isoResult.log10CFU} log CFU/g
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl space-y-1 text-xs border border-white/10">
                  <div className="font-semibold text-emerald-100 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    تفسیر انطباق و نحوه محاسبه:
                  </div>
                  <p className="text-[11px] text-emerald-50 leading-relaxed">
                    {isoResult.evaluationNote}
                  </p>
                </div>
              </div>

              {/* Step by Step Breakdown */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-3 shadow-xs text-xs">
                <h4 className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>تفکیک پارامترهای فرمول میانگین موزون</span>
                </h4>

                <div className="space-y-2 text-stone-600 dark:text-stone-300">
                  <div className="flex items-center justify-between">
                    <span>مجموع کلنی‌های شمارش‌شده (∑C):</span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-100">{isoResult.formulaDetails.sumOfColonies}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>حجم مایع تلقیح‌شده (V):</span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-100">{isoResult.formulaDetails.volumePlated} mL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>تعداد پلیت‌های رقت اول (n₁) و دوم (n₂):</span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-100">n₁={isoResult.formulaDetails.n1Count}, n₂={isoResult.formulaDetails.n2Count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>فاکتور رقت مبنا (d):</span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-100">{isoResult.formulaDetails.primaryDilutionFactor}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-1.5">
                    <span>مخرج کل فرمول [V × (n₁ + 0.1n₂) × d]:</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{isoResult.formulaDetails.denominator.toExponential(3)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: MPN 3-TUBE CALCULATOR ----------------- */}
      {activeTab === 'mpn_calculator' && (
        <div className="space-y-6">
          <div className="p-4 bg-teal-50/60 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold">
                <Binary className="w-4 h-4 text-teal-600" />
                <span>شمارش به روش بیشترین تعداد محتمل (MPN - Most Probable Number)</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300">
                محاسبه شاخص آماری بر مبنای جدول آماری هاسکینز (Hoskins) و استاندارد ISO 7218 / ISO 4831 با ۳ لوله در هر رقت.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-stone-900 p-2 rounded-xl border border-stone-200 dark:border-stone-800">
              <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">میزان تلقیح مبنا:</span>
              <select
                value={initialInoculum}
                onChange={(e) => setInitialInoculum(Number(e.target.value))}
                className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1 font-mono text-xs text-stone-800 dark:text-stone-200"
              >
                <option value={0.1}>0.1 g / 0.01 g / 0.001 g (استاندارد)</option>
                <option value={1.0}>1.0 g / 0.1 g / 0.01 g</option>
                <option value={10.0}>10 g / 1.0 g / 0.1 g (آب آشامیدنی)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* 3 Tube Input Controls */}
            <div className="md:col-span-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5 shadow-xs">
              <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-3">
                <FlaskConical className="w-4 h-4 text-teal-600" />
                <span>تعداد لوله‌های مثبت (تولید گاز / اسید / کدورت)</span>
              </h4>

              <div className="space-y-4">
                {/* Tube 1 */}
                <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/60 dark:border-stone-700">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">رقت اول (0.1 g نمونه)</span>
                    <p className="text-[11px] text-stone-500">لوله ۱، ۲ و ۳ در لوریل سولفات براث</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPositivesD1(n)}
                        className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                          positivesD1 === n
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tube 2 */}
                <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/60 dark:border-stone-700">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">رقت دوم (0.01 g نمونه)</span>
                    <p className="text-[11px] text-stone-500">لوله ۱، ۲ و ۳ در رقت ۱۰⁻²</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPositivesD2(n)}
                        className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                          positivesD2 === n
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tube 3 */}
                <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/60 dark:border-stone-700">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">رقت سوم (0.001 g نمونه)</span>
                    <p className="text-[11px] text-stone-500">لوله ۱، ۲ و ۳ در رقت ۱۰⁻³</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPositivesD3(n)}
                        className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                          positivesD3 === n
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* MPN Output Display */}
            <div className="md:col-span-6 space-y-4">
              <div className="bg-gradient-to-br from-teal-800 to-cyan-900 text-white rounded-2xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-200 flex items-center gap-1.5">
                    <Binary className="w-4 h-4" />
                    کد ترکیب لوله‌های مثبت
                  </span>
                  <span className="font-mono text-lg font-bold bg-white/10 px-3 py-0.5 rounded-lg border border-white/20">
                    {mpnResult.combinationOfPositives}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-black font-mono tracking-tight text-white" dir="ltr">
                    {mpnResult.mpnValue} <span className="text-sm font-normal text-teal-200">{mpnResult.unit}</span>
                  </div>
                  <div className="text-xs text-teal-200 font-mono">
                    دامنه اطمینان ۹۵٪: {mpnResult.confidenceInterval95.lower} تا {mpnResult.confidenceInterval95.upper} {mpnResult.unit}
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl space-y-1 text-xs border border-white/10">
                  <div className="font-semibold text-teal-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    رده احتمال آماری:
                  </div>
                  <p className="text-[11px] text-teal-50">
                    {mpnResult.probabilityCategory === 'category_1_normal'
                      ? 'رده ۱ (بسیار محتمل و کاملاً استاندارد)'
                      : mpnResult.probabilityCategory === 'category_2_less_likely'
                      ? 'رده ۲ (کمتر محتمل - احتمال خطای رقت‌سازی)'
                      : 'رده ۳ (غیرقابل قبول آماری - احتمال خطای شدید)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 3: DILUTION SCHEME PLANNER ----------------- */}
      {activeTab === 'dilution_planner' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>طراحی رقت‌سازی دهدهی (Decimal Serial Dilution - ISO 6887-1)</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300">
                آماده‌سازی سوسپانسیون اولیه ۱:۱۰ و رقت‌های متوالی در بافر پپتون واتر یا سالین پپتون. حداکثر زمان مجاز بین آماده‌سازی و کشت: ۴۵ دقیقه.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-6 shadow-xs">
            {/* Input params */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-stone-700 dark:text-stone-300">وزن نمونه آزمایه (g یا mL):</label>
                <input
                  type="number"
                  value={sampleWeightGrams}
                  onChange={(e) => {
                    const w = Number(e.target.value) || 25;
                    setSampleWeightGrams(w);
                    setDiluentVolumeMl(w * 9);
                  }}
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-stone-700 dark:text-stone-300">حجم رقیق‌کننده اولیه (mL بافر):</label>
                <input
                  type="number"
                  value={diluentVolumeMl}
                  readOnly
                  className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono font-bold text-stone-600 dark:text-stone-300"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-stone-700 dark:text-stone-300">تخمین بار میکروبی فرآورده (CFU/g):</label>
                <input
                  type="number"
                  value={estimatedInitialLoad}
                  onChange={(e) => setEstimatedInitialLoad(Number(e.target.value) || 1000)}
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Visual Tube Dilution Flow */}
            <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
              <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">
                شبیه‌ساز گام‌به‌گام رقت‌ها و پیش‌بینی کلنی در پلیت (۱ mL پورپلیت):
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((exp) => {
                  const factor = Math.pow(10, -exp);
                  const expectedCount = Math.round(estimatedInitialLoad * factor);
                  const isIdeal = expectedCount >= 15 && expectedCount <= 300;
                  const isOver = expectedCount > 300;

                  return (
                    <div
                      key={exp}
                      className={`p-3 rounded-xl border text-center space-y-2 ${
                        isIdeal
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-500/20'
                          : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <div className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300">
                        رقت 10⁻{exp}
                      </div>

                      <div className="py-2">
                        <div className="w-8 h-12 mx-auto rounded-b-xl border-2 border-stone-400 bg-emerald-100/40 dark:bg-emerald-900/30 flex items-end justify-center pb-1">
                          <span className="text-[9px] font-mono font-bold text-emerald-800 dark:text-emerald-300">9 mL</span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-[10px] text-stone-500">پیش‌بینی کلنی:</div>
                        <div className={`font-mono text-xs font-bold ${
                          isIdeal ? 'text-emerald-700 dark:text-emerald-400' : isOver ? 'text-rose-600' : 'text-stone-500'
                        }`}>
                          {isOver ? '> 300 (TNTC)' : expectedCount}
                        </div>
                        <div className="text-[9px]">
                          {isIdeal ? '✅ رنج هدف' : isOver ? '⚠️ متراکم' : 'کم‌شمار'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
