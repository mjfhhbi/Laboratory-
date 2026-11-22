import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Clock, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  BookOpen, 
  Play, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Layers, 
  TrendingDown, 
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  BENCHMARK_MICROORGANISMS, 
  BENCHMARK_PENETRATION_PROFILES, 
  getMicroorganismById, 
  getPenetrationProfileById 
} from '../../lib/thermal/benchmarkData';
import { 
  calculateDValue, 
  calculateZValue, 
  calculateFValue, 
  integrateThermalHistory, 
  calculateCookValue,
  calculateThermalDeathTime,
  computeBigelowLethalRate
} from '../../lib/thermal/thermalKineticsEngine';
import { generateThermalScipyScript } from '../../lib/thermal/scipyScriptGenerator';
import { TimeTemperaturePoint } from '../../lib/thermal/types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';
import { usePythonEngine } from '../../lib/python/usePythonEngine';

type ActiveSubTab = 'kinetics_dzf' | 'penetration_bigelow' | 'tdt_cook_value' | 'scipy_runner';

export const ThermalProcessingSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveSubTab>('penetration_bigelow');

  // Selected Microorganism
  const [selectedOrganismId, setSelectedOrganismId] = useState<string>('c_botulinum');
  const selectedOrganism = useMemo(() => {
    return getMicroorganismById(selectedOrganismId) || BENCHMARK_MICROORGANISMS[0];
  }, [selectedOrganismId]);

  // D-value State
  const [n0Input, setN0Input] = useState<number>(1000000); // 10^6
  const [ntInput, setNtInput] = useState<number>(1);       // 10^0
  const [dProcessTime, setDProcessTime] = useState<number>(1.26);

  // z-value State
  const [temp1Input, setTemp1Input] = useState<number>(111.1);
  const [d1Input, setD1Input] = useState<number>(2.10);
  const [temp2Input, setTemp2Input] = useState<number>(121.1);
  const [d2Input, setD2Input] = useState<number>(0.21);

  // F-value Target
  const [targetLogReduction, setTargetLogReduction] = useState<number>(12.0);

  // Kinetic Order Comparison
  const [inactivationOrder, setInactivationOrder] = useState<'order_1' | 'order_0'>('order_1');

  // Penetration Profile State
  const [selectedProfileId, setSelectedProfileId] = useState<string>('canned_puree_retort');
  const [penetrationPoints, setPenetrationPoints] = useState<TimeTemperaturePoint[]>(() => {
    const prof = getPenetrationProfileById('canned_puree_retort');
    return prof ? [...prof.points] : [];
  });

  const [tRefInput, setTRefInput] = useState<number>(121.1);
  const [zValInput, setZValInput] = useState<number>(10.0);
  const [targetFInput, setTargetFInput] = useState<number>(2.52);

  // TDT & Equivalent Process Temperature
  const [equivalentTargetTemp, setEquivalentTargetTemp] = useState<number>(115.0);

  // Python Engine Integration
  const { runCode, status: pyStatus, outputChunks, clearOutput } = usePythonEngine();
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Handle Preset Profile Change
  const handleSelectProfilePreset = (profileId: string) => {
    setSelectedProfileId(profileId);
    const prof = getPenetrationProfileById(profileId);
    if (prof) {
      setPenetrationPoints([...prof.points]);
      const matchedOrg = getMicroorganismById(prof.targetOrganismId);
      if (matchedOrg) {
        setSelectedOrganismId(matchedOrg.id);
        setTRefInput(matchedOrg.referenceTemperatureC);
        setZValInput(matchedOrg.zValueNominal);
        setTargetFInput(matchedOrg.dValueRefNominal * matchedOrg.recommendedLogReduction);
      }
    }
  };

  // Synchronize organism changes
  const handleSelectOrganism = (orgId: string) => {
    setSelectedOrganismId(orgId);
    const org = getMicroorganismById(orgId);
    if (org) {
      setTRefInput(org.referenceTemperatureC);
      setZValInput(org.zValueNominal);
      setD2Input(org.dValueRefNominal);
      setD1Input(org.dValueRefNominal * 10);
      setTemp2Input(org.referenceTemperatureC);
      setTemp1Input(org.referenceTemperatureC - org.zValueNominal);
      setTargetLogReduction(org.recommendedLogReduction);
      setTargetFInput(org.dValueRefNominal * org.recommendedLogReduction);
    }
  };

  // Calculations
  const dResult = useMemo(() => {
    try {
      return calculateDValue(n0Input, ntInput, dProcessTime);
    } catch {
      return null;
    }
  }, [n0Input, ntInput, dProcessTime]);

  const zResult = useMemo(() => {
    try {
      return calculateZValue(temp1Input, d1Input, temp2Input, d2Input);
    } catch {
      return null;
    }
  }, [temp1Input, d1Input, temp2Input, d2Input]);

  const fResult = useMemo(() => {
    try {
      return calculateFValue(
        dResult?.dValue || selectedOrganism.dValueRefNominal,
        targetLogReduction,
        tRefInput,
        zValInput,
        selectedOrganism.nameScientific
      );
    } catch {
      return null;
    }
  }, [dResult, targetLogReduction, tRefInput, zValInput, selectedOrganism]);

  const integrationResult = useMemo(() => {
    try {
      return integrateThermalHistory(
        penetrationPoints,
        tRefInput,
        zValInput,
        targetFInput,
        selectedOrganism.nameScientific
      );
    } catch {
      return null;
    }
  }, [penetrationPoints, tRefInput, zValInput, targetFInput, selectedOrganism]);

  const cookValueResult = useMemo(() => {
    if (!integrationResult) return null;
    return calculateCookValue(penetrationPoints, integrationResult.totalFValueTrapezoidal);
  }, [penetrationPoints, integrationResult]);

  const tdtResult = useMemo(() => {
    const fRef = integrationResult?.totalFValueTrapezoidal || fResult?.fValue || 2.52;
    return calculateThermalDeathTime(fRef, equivalentTargetTemp, tRefInput, zValInput);
  }, [integrationResult, fResult, equivalentTargetTemp, tRefInput, zValInput]);

  // Points modification handlers
  const handleAddPoint = () => {
    const lastPoint = penetrationPoints[penetrationPoints.length - 1];
    const newTime = lastPoint ? lastPoint.timeMinutes + 5.0 : 0.0;
    const newTemp = lastPoint ? Math.max(20, lastPoint.temperatureC - 10) : 25.0;
    setPenetrationPoints([...penetrationPoints, { timeMinutes: newTime, temperatureC: newTemp }]);
  };

  const handleRemovePoint = (index: number) => {
    if (penetrationPoints.length <= 2) return;
    setPenetrationPoints(penetrationPoints.filter((_, idx) => idx !== index));
  };

  const handleUpdatePoint = (index: number, field: 'timeMinutes' | 'temperatureC', val: number) => {
    const updated = [...penetrationPoints];
    updated[index] = { ...updated[index], [field]: val };
    setPenetrationPoints(updated);
  };

  // Run SciPy script in WebWorker
  const activeScipyCode = useMemo(() => {
    return generateThermalScipyScript(
      penetrationPoints,
      tRefInput,
      zValInput,
      selectedOrganism.nameScientific
    );
  }, [penetrationPoints, tRefInput, zValInput, selectedOrganism]);

  const handleExecuteScipy = () => {
    clearOutput();
    runCode(activeScipyCode);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. Legal / Biological Safety Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-sm text-amber-900 dark:text-amber-100">
            <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <span>اطلاعیه ایمنی زیستی و صحه‌گذاری فرآیندهای حرارتی (Process Authority Validation)</span>
            </h4>
            <p className="leading-relaxed">
              محاسبات کینتیکی و مقادیر کشندگی حرارتی ($F_0, D, z$) ارائه شده در این ماژول بر پایه مدل‌های ریاضیاتی و ترموباکتریولوژی معتبر (*Toledo, Stumbo, Pflug*) است. برای کاربردهای صنعتی و بسته‌بندی غذاهای کم‌اسید و اسیدی، این مقادیر باید از طریق <strong>آزمون‌های تجربی نفوذ حرارت (Heat Penetration Studies)</strong> با حسگرهای دمایی کالیبره، آزمون‌های چالش میکروبی (Microbial Challenge) و تأیید کتبی مراجع ذی‌صلاح نظارتی (سازمان غذا و دارو و سازمان ملی استاندارد) اعتبارسنجی شوند.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tabs Navigation */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-1.5 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('penetration_bigelow')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'penetration_bigelow'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>انتگرال‌گیری نفوذ حرارت و مدل Bigelow</span>
          </button>

          <button
            onClick={() => setActiveTab('kinetics_dzf')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'kinetics_dzf'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>کینتیک تخریب و مقادیر D, z, F</span>
          </button>

          <button
            onClick={() => setActiveTab('tdt_cook_value')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'tdt_cook_value'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>زمان مرگ حرارتی (TDT) و ارزش پخت (C0)</span>
          </button>

          <button
            onClick={() => setActiveTab('scipy_runner')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'scipy_runner'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>اجرای کدهای تخصصی با SciPy و NumPy</span>
          </button>
        </div>
      </div>

      {/* 3. Global Benchmark Microorganism Selector Bar */}
      <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">بانک مراجع معتبر بین‌المللی</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">ICMSF / USDA / Toledo</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-white">
              انتخاب میکروارگانیسم یا آنزیم هدف برای ارزیابی فرآیند
            </h3>
          </div>

          <div className="w-full md:w-96">
            <select
              value={selectedOrganismId}
              onChange={(e) => handleSelectOrganism(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs sm:text-sm font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            >
              {BENCHMARK_MICROORGANISMS.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.nameFa} (D={org.dValueRefNominal} min @ {org.referenceTemperatureC}°C)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Organism Card Summary */}
        <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400 block mb-0.5">نام علمی لاتین</span>
            <span className="font-mono font-bold text-stone-800 dark:text-stone-200 italic truncate block">
              {selectedOrganism.nameScientific}
            </span>
          </div>

          <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400 block mb-0.5">D-value مرجع ({selectedOrganism.referenceTemperatureC}°C)</span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
              {selectedOrganism.dValueRefNominal.toFixed(2)} دقیقه
            </span>
          </div>

          <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400 block mb-0.5">ثابت مقاومت حرارتی z-value</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {selectedOrganism.zValueNominal.toFixed(1)} °C
            </span>
          </div>

          <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400 block mb-0.5">کاهش لگاریتمی هدف</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {selectedOrganism.recommendedLogReduction}D سیکل
            </span>
          </div>
        </div>

        <div className="mt-2.5 text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
          <span><strong>منبع علمی:</strong> {selectedOrganism.citation.authors} ({selectedOrganism.citation.year}) — {selectedOrganism.citation.title}</span>
          <span className="hidden sm:inline-block text-stone-500">{selectedOrganism.targetFoodOrMatrix}</span>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: INTEGRATION & BIGELOW (PENETRATION HISTORY)
          ========================================================================= */}
      {activeTab === 'penetration_bigelow' && (
        <div className="space-y-6">
          {/* Preset Selector */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-600" />
                  <span>پروفایل‌های نفوذ حرارت معتبر صنعتی (Heat Penetration Curves)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  پروفایل‌های حسگر ترموکوپل در نقطه سرد محصول (Cold Spot) از منابع مرجع مهندسی فرآیند
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-500">انتخاب پروفایل پیش‌فرض:</span>
                <select
                  value={selectedProfileId}
                  onChange={(e) => handleSelectProfilePreset(e.target.value)}
                  className="px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-800 dark:text-stone-200"
                >
                  {BENCHMARK_PENETRATION_PROFILES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titleFa}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Integration Results Banner */}
            {integrationResult && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className={`p-4 rounded-xl border ${
                  integrationResult.isProcessAdequate 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60' 
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700/60'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">کشندگی تجمعی کل (F₀)</span>
                    {integrationResult.isProcessAdequate ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" /> فرآیند ایمن
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300 font-bold text-xs">
                        <ShieldAlert className="w-4 h-4" /> ناکافی
                      </span>
                    )}
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-stone-900 dark:text-white">
                    {integrationResult.totalFValueTrapezoidal.toFixed(3)}
                    <span className="text-xs font-normal text-stone-500 mr-1.5">min</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    حداقل استاندارد لازم: {integrationResult.targetFRequired.toFixed(2)} min ({integrationResult.lethalitySafetyMarginPercent >= 0 ? '+' : ''}{integrationResult.lethalitySafetyMarginPercent.toFixed(1)}% حاشیه ایمنی)
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">روش سیمپسون (Simpson 1/3)</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-indigo-700 dark:text-indigo-400">
                    {integrationResult.totalFValueSimpson.toFixed(3)}
                    <span className="text-xs font-normal text-stone-500 mr-1.5">min</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    خطای عددی برش: {integrationResult.differencePercent.toFixed(3)}% اختلاف
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">حداکثر دمای نقطه سرد</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-600 dark:text-amber-400">
                    {integrationResult.maxTemperatureC.toFixed(1)}
                    <span className="text-xs font-normal text-stone-500 mr-1.5">°C</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    مدت کل فرآیند: {integrationResult.totalTimeMinutes.toFixed(1)} دقیقه
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">سهم فازهای گرمایش و سرمایش</span>
                  <div className="text-xs space-y-1 font-mono text-stone-700 dark:text-stone-300">
                    <div>گرمایش CUT: {(integrationResult.heatingPhaseLethality / Math.max(0.001, integrationResult.totalFValueTrapezoidal) * 100).toFixed(1)}%</div>
                    <div>نگهداری: {(integrationResult.holdingPhaseLethality / Math.max(0.001, integrationResult.totalFValueTrapezoidal) * 100).toFixed(1)}%</div>
                    <div>سردسازی: {(integrationResult.coolingPhaseLethality / Math.max(0.001, integrationResult.totalFValueTrapezoidal) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Chart Visualizations (SVG) */}
          {integrationResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Temperature vs Time */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-600" />
                    <span>منحنی تاریخچه دمایی نقطه سرد T(t)</span>
                  </h5>
                  <span className="text-xs font-mono text-stone-500">دما (°C) بر حسب زمان (min)</span>
                </div>

                <div className="h-64 w-full bg-stone-50 dark:bg-stone-950/60 rounded-xl p-3 border border-stone-200 dark:border-stone-800 relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="#e5e7eb" strokeDasharray="3 3" />
                    <line x1="40" y1="70" x2="480" y2="70" stroke="#e5e7eb" strokeDasharray="3 3" />
                    <line x1="40" y1="120" x2="480" y2="120" stroke="#e5e7eb" strokeDasharray="3 3" />
                    <line x1="40" y1="170" x2="480" y2="170" stroke="#e5e7eb" strokeDasharray="3 3" />
                    
                    {/* 121.1°C Reference Line */}
                    <line x1="40" y1="35" x2="480" y2="35" stroke="#f43f5e" strokeDasharray="4 4" strokeWidth="1.5" />
                    <text x="485" y="38" fontSize="9" fill="#f43f5e" textAnchor="end">121.1°C</text>

                    {/* Temperature Polyline */}
                    {(() => {
                      const maxTime = Math.max(...penetrationPoints.map(p => p.timeMinutes));
                      const maxTemp = 140;
                      const minTemp = 0;
                      const pointsStr = penetrationPoints.map(p => {
                        const x = 40 + (p.timeMinutes / Math.max(1, maxTime)) * 430;
                        const y = 190 - ((p.temperatureC - minTemp) / (maxTemp - minTemp)) * 170;
                        return `${x},${y}`;
                      }).join(' ');

                      return (
                        <polyline
                          fill="none"
                          stroke="#e11d48"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={pointsStr}
                        />
                      );
                    })()}

                    {/* Data Points */}
                    {penetrationPoints.map((p, idx) => {
                      const maxTime = Math.max(...penetrationPoints.map(pt => pt.timeMinutes));
                      const x = 40 + (p.timeMinutes / Math.max(1, maxTime)) * 430;
                      const y = 190 - (p.temperatureC / 140) * 170;
                      return (
                        <circle key={idx} cx={x} cy={y} r="3.5" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
                      );
                    })}

                    {/* Axis Labels */}
                    <text x="35" y="25" fontSize="10" fill="#6b7280" textAnchor="end">130°</text>
                    <text x="35" y="75" fontSize="10" fill="#6b7280" textAnchor="end">95°</text>
                    <text x="35" y="125" fontSize="10" fill="#6b7280" textAnchor="end">60°</text>
                    <text x="35" y="175" fontSize="10" fill="#6b7280" textAnchor="end">25°</text>
                    <text x="260" y="210" fontSize="10" fill="#6b7280" textAnchor="middle">زمان کل (دقیقه)</text>
                  </svg>
                </div>
              </div>

              {/* Chart 2: Bigelow Lethal Rate & Cumulative F0 */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    <span>نرخ کشندگی بیگلو L(t) و سطح زیر منحنی کشندگی</span>
                  </h5>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">L = 10^((T-121.1)/10)</span>
                </div>

                <div className="h-64 w-full bg-stone-50 dark:bg-stone-950/60 rounded-xl p-3 border border-stone-200 dark:border-stone-800 relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                    {/* Grid */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="#e5e7eb" strokeDasharray="3 3" />
                    <line x1="40" y1="100" x2="480" y2="100" stroke="#e5e7eb" strokeDasharray="3 3" />
                    <line x1="40" y1="180" x2="480" y2="180" stroke="#9ca3af" />

                    {(() => {
                      const maxTime = Math.max(...penetrationPoints.map(p => p.timeMinutes));
                      const maxL = Math.max(1.2, ...integrationResult.pointsWithLethality.map(p => p.lethalRate ?? 0));
                      
                      // Area path for shaded integration
                      let areaPath = `M 40 180 `;
                      integrationResult.pointsWithLethality.forEach(p => {
                        const x = 40 + (p.timeMinutes / Math.max(1, maxTime)) * 430;
                        const y = 180 - ((p.lethalRate ?? 0) / maxL) * 160;
                        areaPath += `L ${x} ${y} `;
                      });
                      areaPath += `L 470 180 Z`;

                      const linePoints = integrationResult.pointsWithLethality.map(p => {
                        const x = 40 + (p.timeMinutes / Math.max(1, maxTime)) * 430;
                        const y = 180 - ((p.lethalRate ?? 0) / maxL) * 160;
                        return `${x},${y}`;
                      }).join(' ');

                      return (
                        <>
                          <path d={areaPath} fill="rgba(16, 185, 129, 0.2)" />
                          <polyline fill="none" stroke="#10b981" strokeWidth="2.5" points={linePoints} />
                        </>
                      );
                    })()}

                    <text x="35" y="25" fontSize="10" fill="#6b7280" textAnchor="end">1.0</text>
                    <text x="35" y="105" fontSize="10" fill="#6b7280" textAnchor="end">0.5</text>
                    <text x="35" y="180" fontSize="10" fill="#6b7280" textAnchor="end">0.0</text>
                    <text x="260" y="208" fontSize="10" fill="#10b981" textAnchor="middle" fontWeight="bold">سطح زیر منحنی برابر با کشندگی کل F₀ است</text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Table: Time-Temperature Data Points Editor */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  <span>جدول نقاط ثبت‌شده نفوذ حرارت (دما - زمان)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  امکان ویرایش مستقیم مقادیر، افزودن ردیف‌های آزمون و محاسبه بلادرنگ نرخ کشندگی Bigelow
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddPoint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن ردیف داده</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 font-semibold">
                  <tr>
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3">زمان (دقیقه)</th>
                    <th className="p-3">دمای حسگر (°C)</th>
                    <th className="p-3">نرخ کشندگی L = 10^((T-Tref)/z)</th>
                    <th className="p-3">کشندگی تجمعی F (دقیقه)</th>
                    <th className="p-3 w-16 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-mono">
                  {penetrationPoints.map((pt, idx) => {
                    const lRate = computeBigelowLethalRate(pt.temperatureC, tRefInput, zValInput);
                    const cumF = integrationResult?.pointsWithLethality[idx]?.cumulativeLethality ?? 0;
                    return (
                      <tr key={idx} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40">
                        <td className="p-3 text-center text-stone-400 font-sans">{idx + 1}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.5"
                            value={pt.timeMinutes}
                            onChange={(e) => handleUpdatePoint(idx, 'timeMinutes', parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.5"
                            value={pt.temperatureC}
                            onChange={(e) => handleUpdatePoint(idx, 'temperatureC', parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                          />
                        </td>
                        <td className="p-3 font-bold text-stone-700 dark:text-stone-300">
                          {lRate.toFixed(5)}
                        </td>
                        <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                          {cumF.toFixed(4)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleRemovePoint(idx)}
                            disabled={penetrationPoints.length <= 2}
                            className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md disabled:opacity-30"
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

            {/* Assumptions and Limitations Audit */}
            {integrationResult && (
              <div className="bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 rounded-xl p-4 text-xs space-y-2">
                <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-stone-600" />
                  <span>فرضیات حاکم و محدودیت‌های روش انتگرال‌گیری جنرال (General Method Assumptions)</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-400">
                  {integrationResult.assumptions.map((asm, idx) => (
                    <li key={idx}>{asm}</li>
                  ))}
                  {integrationResult.limitations.map((lim, idx) => (
                    <li key={`lim-${idx}`} className="text-amber-700 dark:text-amber-400 font-medium">{lim}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: KINETICS (D, z, F) & ORDER 1 VS ORDER 0 MODELS
          ========================================================================= */}
      {activeTab === 'kinetics_dzf' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: D-value Calculator */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <span>محاسبه D-value</span>
                </h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600">زمان کاهش ده‌برابری</span>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                مدت زمان در دمای معین برای کاهش ۹۰ درصدی جمعیت اسپور یا باکتری (یک سیکل لگاریتمی).
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1">جمعیت اولیه (N₀)</label>
                  <input
                    type="number"
                    value={n0Input}
                    onChange={(e) => setN0Input(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1">جمعیت باقیمانده (Nt)</label>
                  <input
                    type="number"
                    value={ntInput}
                    onChange={(e) => setNtInput(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1">مدت زمان فرآیند (دقیقه)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dProcessTime}
                    onChange={(e) => setDProcessTime(parseFloat(e.target.value) || 0.1)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              {dResult && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">مقدار محاسبه‌شده D:</span>
                    <span className="text-xl font-mono font-bold text-rose-700 dark:text-rose-400">
                      {dResult.dValue.toFixed(3)} دقیقه
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400">
                    کاهش لگاریتمی: {dResult.logReduction.toFixed(2)} سیکل لگاریتمی | k₁ = {dResult.k1Constant.toFixed(3)} min⁻¹
                  </div>
                </div>
              )}
            </div>

            {/* Box 2: z-value Calculator */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-indigo-600" />
                  <span>محاسبه z-value</span>
                </h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">ثابت مقاومت حرارتی</span>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                میزان تغییر دمای لازم بر حسب سانتی‌گراد جهت تغییر ده برابری در مقدار D.
              </p>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-600 dark:text-stone-400 mb-1">دمای ۱ (T₁ °C)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={temp1Input}
                      onChange={(e) => setTemp1Input(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 dark:text-stone-400 mb-1">مقدار D₁ (دقیقه)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={d1Input}
                      onChange={(e) => setD1Input(parseFloat(e.target.value) || 0.1)}
                      className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-600 dark:text-stone-400 mb-1">دمای ۲ (T₂ °C)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={temp2Input}
                      onChange={(e) => setTemp2Input(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 dark:text-stone-400 mb-1">مقدار D₂ (دقیقه)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={d2Input}
                      onChange={(e) => setD2Input(parseFloat(e.target.value) || 0.1)}
                      className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {zResult && (
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">مقدار محاسبه‌شده z:</span>
                    <span className="text-xl font-mono font-bold text-indigo-700 dark:text-indigo-400">
                      {zResult.zValue.toFixed(2)} °C
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400">
                    شیب خط مقاومت حرارتی: {(-1.0 / zResult.zValue).toFixed(4)}
                  </div>
                </div>
              )}
            </div>

            {/* Box 3: F-value & 12D Cook Target */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>محاسبه F-value فرآیند</span>
                </h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">کشندگی کل هدف</span>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                معادل کل زمان فرآیند در دمای مرجع برای دستیابی به تعداد سیکل‌های لگاریتمی کاهش معین (F = m × D_ref).
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1">تعداد کاهش لگاریتمی هدف (m)</label>
                  <input
                    type="number"
                    step="1"
                    value={targetLogReduction}
                    onChange={(e) => setTargetLogReduction(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>

                <div className="text-stone-500 text-[11px] space-y-1">
                  <div>• برای کنسروهای کم‌اسید (بوتولینوم): 12D Cook الزامی است.</div>
                  <div>• برای آبمیوه‌های اسیدی (HACCP): 5D پاستوریزاسیون الزامی است.</div>
                  <div>• برای تخم‌مرغ مایع و مرغ (سالمونلا): 7D الزامی است.</div>
                </div>
              </div>

              {fResult && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">مقدار F لازم (F₀):</span>
                    <span className="text-xl font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {fResult.fValue.toFixed(3)} دقیقه
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400">
                    در دمای مرجع {fResult.referenceTemperatureC}°C با z={fResult.zValueC}°C
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Model Distinction & Scientific Justification: Order 1 vs Order 0 */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span>تمایز مدل‌های کینتیکی تخریب: کینتیک درجه اول (Order 1) در برابر درجه صفر (Order 0)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  بررسی دامنه کاربرد فیزیکوشیمیایی و بیولوژیکی مدل‌ها در فرآیندهای نگهداری مواد غذایی
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInactivationOrder('order_1')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    inactivationOrder === 'order_1'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  کینتیک درجه اول (میکروبی)
                </button>
                <button
                  onClick={() => setInactivationOrder('order_0')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    inactivationOrder === 'order_0'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  کینتیک درجه صفر (قهوه‌ای شدن / کیفیت)
                </button>
              </div>
            </div>

            {inactivationOrder === 'order_1' ? (
              <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>کینتیک تخریب درجه اول (First-Order Microbial Inactivation Kinetics)</span>
                </div>
                <div className="overflow-x-auto py-1">
                  <KaTeXRenderer expression="\frac{dN}{dt} = -k_1 N \iff \ln\left(\frac{N(t)}{N_0}\right) = -k_1 t \iff \log_{10}\left(\frac{N(t)}{N_0}\right) = -\frac{t}{D}" displayMode={true} />
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  <strong>چرا برای میکروارگانیسم‌ها کینتیک درجه ۱ معتبر است؟</strong> در یک محیط همگن، هر سلول باکتریایی یا اسپور دارای احتمال مرگ مستقل بر اثر تخریب حرارتی پروتئین‌های ضروری یا ساختار DNA است. به همین دلیل نرخ مرگ و میر ($dN/dt$) متناسب با تعداد سلول‌های زنده در همان لحظه ($N$) است و نمودار بقا به صورت خط مستقیم نیمه‌لگاریتمی با شیب $-1/D$ خواهد بود.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>کینتیک درجه صفر (Zero-Order Reaction Kinetics) — فقط برای واکنش‌های کیفیت</span>
                </div>
                <div className="overflow-x-auto py-1">
                  <KaTeXRenderer expression="\frac{dC}{dt} = -k_0 \iff C(t) = C_0 - k_0 t" displayMode={true} />
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  <strong>عدم انطباق با مرگ سلولی میکروب‌ها:</strong> کینتیک درجه صفر به این معنی است که سرعت تخریب مستقل از غلظت باقی‌مانده است. این مدل <strong>به هیچ عنوان</strong> برای تخریب میکروبی کاربرد علمی ندارد، زیرا منجر به صفر شدن آنی و منفی شدن جمعیت‌های بیولوژیکی می‌شود. موارد استفاده معتبر درجه صفر فقط منحصر به:
                </p>
                <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 space-y-1">
                  <li>واکنش‌های قهوه‌ای شدن غیرآنزیمی مایلارد (تشکیل رنگدانه‌های ملانوئیدین در آبمیوه یا شیر خشک).</li>
                  <li>اکسیداسیون چربی‌ها در فاز خطی اولیه.</li>
                  <li>تجزیه برخی ویتامین‌ها در شرایط اشباع غلظت کاتالیزورها.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: TDT & COOK VALUE (QUALITY VS STERILIZATION OPTIMIZATION)
          ========================================================================= */}
      {activeTab === 'tdt_cook_value' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TDT Calculator */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>زمان مرگ حرارتی (Thermal Death Time - TDT) و معادل‌سازی دما</span>
              </h4>

              <p className="text-xs text-stone-500 leading-relaxed">
                محاسبه زمان لازم در دماهای مختلف اتوکلاو جهت ارائه کشندگی معادل با دمای استاندارد ۱۲۱.۱ درجه سانتی‌گراد.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1">دمای عملیاتی مورد نظر اتوکلاو (°C)</label>
                  <input
                    type="number"
                    step="1"
                    value={equivalentTargetTemp}
                    onChange={(e) => setEquivalentTargetTemp(parseFloat(e.target.value) || 100)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">زمان مرگ حرارتی در {equivalentTargetTemp}°C:</span>
                    <span className="text-xl font-mono font-bold text-indigo-700 dark:text-indigo-400">
                      {tdtResult.tdtMinutes.toFixed(2)} دقیقه
                    </span>
                  </div>
                  <div className="overflow-x-auto text-[11px] pt-1">
                    <KaTeXRenderer expression={tdtResult.formulaLatex} displayMode={false} />
                  </div>
                </div>
              </div>
            </div>

            {/* Cook Value C0 Optimization */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600" />
                <span>ارزش پخت (Cook Value C₀) و حفظ ویتامین B1 (تیامین)</span>
              </h4>

              <p className="text-xs text-stone-500 leading-relaxed">
                ارزیابی اثرات نامطلوب پخت و حرارت بیش از حد بر بافت و تخریب ویتامین‌ها با مرجع ۱۰۰ درجه سانتی‌گراد و z=33°C.
              </p>

              {cookValueResult && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-700 dark:text-stone-300">مقدار Cook Value (C₀):</span>
                      <span className="text-xl font-mono font-bold text-amber-700 dark:text-amber-400">
                        {cookValueResult.c0CookValueQuality.toFixed(2)} min
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-700 dark:text-stone-300">درصد باقیمانده تیامین (ویتامین B1):</span>
                      <span className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {cookValueResult.nutrientRetentionPercentThiamine.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                    <strong>تفسیر مهندسی فرآیند:</strong> {cookValueResult.optimizationRationaleFa}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: SCIPY & NUMPY WEBWORKER EXECUTION
          ========================================================================= */}
      {activeTab === 'scipy_runner' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <Play className="w-5 h-5 text-emerald-600" />
                  <span>اجرای واقعی اسکریپت در وب‌ورکر پس‌زمینه با SciPy و NumPy</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  کد پایتون زیر با متغیرهای فعلی نفوذ حرارت ساخته شده و با ماژول scipy.integrate.simpson اجرا می‌شود.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(activeScipyCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-200"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'کپی شد' : 'کپی کد Python'}</span>
                </button>

                <button
                  onClick={handleExecuteScipy}
                  disabled={pyStatus === 'running' || pyStatus === 'initializing'}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>
                    {pyStatus === 'running' ? 'در حال اجرا...' : pyStatus === 'initializing' ? 'بارگذاری Pyodide...' : 'اجرای SciPy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Python Code Display */}
            <div className="rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-900 text-stone-100 font-mono text-xs p-4 overflow-x-auto max-h-72" dir="ltr">
              <pre>{activeScipyCode}</pre>
            </div>

            {/* WebWorker Console Output */}
            {outputChunks.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>خروجی ترمینال محاسباتی SciPy (خروجی مستقیم پایتون):</span>
                  </span>
                  <button
                    onClick={clearOutput}
                    className="text-[11px] text-stone-400 hover:text-stone-200"
                  >
                    پاک کردن لاگ
                  </button>
                </div>

                <div className="rounded-xl border border-emerald-900/50 bg-black text-emerald-400 font-mono text-xs p-4 overflow-x-auto" dir="ltr">
                  <pre>{outputChunks.map(c => c.text).join('')}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
