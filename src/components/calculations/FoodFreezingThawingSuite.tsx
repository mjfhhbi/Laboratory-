import React, { useState, useMemo } from 'react';
import { 
  Snowflake, 
  Flame, 
  Activity, 
  Layers, 
  Sliders, 
  Play, 
  Copy, 
  Check, 
  BookOpen, 
  ShieldCheck, 
  Info, 
  TrendingDown, 
  Clock, 
  Sparkles,
  ArrowRight,
  Maximize2,
  Box,
  Circle,
  HelpCircle
} from 'lucide-react';
import { 
  BENCHMARK_FOOD_MATERIALS, 
  getBenchmarkFoodById 
} from '../../lib/freezing/benchmarkFoodData';
import { 
  computeFreezingAndThawing 
} from '../../lib/freezing/freezingEngine';
import { generateScipyFreezingScript } from '../../lib/freezing/scipyFreezingScript';
import { 
  FoodGeometryType, 
  ConvectionMode, 
  FreezingProcessInputs, 
  FoodThermalProperties 
} from '../../lib/freezing/types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';
import { usePythonEngine } from '../../lib/python/usePythonEngine';

type ActiveSubTab = 
  | 'times_models' 
  | 'thawing_process' 
  | 'thermal_history_curve' 
  | 'calculation_steps' 
  | 'sensitivity_analysis' 
  | 'scipy_sandbox';

export const FoodFreezingThawingSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveSubTab>('times_models');

  // Selected Benchmark Food Material
  const [selectedFoodId, setSelectedFoodId] = useState<string>('lean_beef_patty');
  const baseFood = useMemo(() => {
    return getBenchmarkFoodById(selectedFoodId) || BENCHMARK_FOOD_MATERIALS[0];
  }, [selectedFoodId]);

  // Customizable Food Properties
  const [customProps, setCustomProps] = useState<FoodThermalProperties>(baseFood);

  // Synchronize when preset changes
  const handlePresetChange = (foodId: string) => {
    setSelectedFoodId(foodId);
    const found = getBenchmarkFoodById(foodId);
    if (found) {
      setCustomProps(found);
    }
  };

  // Geometry & Dimensions (in cm for user, converted to meters)
  const [geometry, setGeometry] = useState<FoodGeometryType>('slab');
  const [thicknessCm, setThicknessCm] = useState<number>(3.0);
  const [widthCm, setWidthCm] = useState<number>(6.0);
  const [lengthCm, setLengthCm] = useState<number>(10.0);

  // Operating Temperatures (°C)
  const [initialTempTi, setInitialTempTi] = useState<number>(15.0);
  const [ambientTempTa, setAmbientTempTa] = useState<number>(-35.0);
  const [targetCenterTempTc, setTargetCenterTempTc] = useState<number>(-18.0);

  // Convection & Heat Transfer
  const [convectionMode, setConvectionMode] = useState<ConvectionMode>('air_blast');
  const [airVelocityMs, setAirVelocityMs] = useState<number>(4.0);
  const [manualH, setManualH] = useState<number>(45.0);
  const [includeRadiation, setIncludeRadiation] = useState<boolean>(true);

  // Python Engine execution
  const { runCode, status: pyStatus, outputChunks, clearOutput } = usePythonEngine();
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Assemble full process inputs
  const processInputs: FreezingProcessInputs = useMemo(() => {
    return {
      geometry,
      thicknessOrDiameterM: thicknessCm / 100.0,
      widthM: widthCm / 100.0,
      lengthM: lengthCm / 100.0,
      initialTemperatureTi: initialTempTi,
      ambientMediumTemperatureTa: ambientTempTa,
      targetCenterTemperatureTc: targetCenterTempTc,
      convectionMode,
      airVelocityMs: convectionMode === 'air_blast' ? airVelocityMs : undefined,
      heatTransferCoefficientH: manualH,
      includeRadiation,
      surfaceEmissivity: 0.90,
      properties: customProps
    };
  }, [
    geometry,
    thicknessCm,
    widthCm,
    lengthCm,
    initialTempTi,
    ambientTempTa,
    targetCenterTempTc,
    convectionMode,
    airVelocityMs,
    manualH,
    includeRadiation,
    customProps
  ]);

  // Run calculation engine
  const calculationResults = useMemo(() => {
    try {
      return computeFreezingAndThawing(processInputs);
    } catch (err: any) {
      return null;
    }
  }, [processInputs]);

  // Generated Python code
  const generatedPythonScript = useMemo(() => {
    return generateScipyFreezingScript(processInputs);
  }, [processInputs]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedPythonScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleRunPython = () => {
    runCode(generatedPythonScript);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Title */}
      <div className="bg-gradient-to-r from-sky-900 via-cyan-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-cyan-800/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 -ml-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Snowflake className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span>موتور مهندسی انتقال حرارت، انجماد و ذوب مواد غذایی (Freezing & Thawing Kinetics)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              محاسبات انتقال حرارت، زمان انجماد (پلانک و کللند) و آنالیز فرآیند ذوب
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              شبیه‌سازی تحلیلی و عددی هدایت و جابجایی حرارت، حل معادلات پلانک (Plank)، کللند و ارل (Cleland & Earle) و فام (Pham)،
              محاسبه اعداد بدون بعد بیوت (Bi) و پلانک (Pk)، بررسی وارونگی هدایت حرارتی در ذوب و اجرای کدهای عددی با SciPy
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              مرجع استاندارد ASHRAE & Singh
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Panel (Left) & Results View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Configuration & Input Parameters (4 cols)   */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Preset Material Selector */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
              انتخاب ماده غذایی و خواص حرارتی مرجع:
            </label>
            <select
              value={selectedFoodId}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
            >
              {BENCHMARK_FOOD_MATERIALS.map(f => (
                <option key={f.id} value={f.id}>
                  {f.nameFa}
                </option>
              ))}
            </select>

            <div className="mt-3 p-2.5 bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-800/40 rounded-xl text-[11px] text-cyan-900 dark:text-cyan-200 leading-relaxed">
              <span className="font-bold">منبع داده: </span>
              {customProps.literatureSource}
            </div>
          </div>

          {/* Geometry & Dimensions */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
              <Box className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              هندسه و ابعاد فیزیکی محصول
            </h3>

            {/* Geometry Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'slab', labelFa: 'تخته نامحدود (Slab)', sub: 'P=1/2, R=1/8' },
                { id: 'cylinder', labelFa: 'سیلندر (Cylinder)', sub: 'P=1/4, R=1/16' },
                { id: 'sphere', labelFa: 'کره (Sphere)', sub: 'P=1/6, R=1/24' },
                { id: 'brick', labelFa: 'بلوک مستطیلی (Brick)', sub: 'ابعاد ۳‌بعدی' }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGeometry(g.id as FoodGeometryType)}
                  className={`p-2 rounded-xl text-right transition-all border text-xs ${
                    geometry === g.id
                      ? 'bg-cyan-600 text-white border-cyan-700 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="font-bold">{g.labelFa}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{g.sub}</div>
                </button>
              ))}
            </div>

            {/* Dimensions */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  {geometry === 'slab' ? 'ضخامت کل تخته (a):' : geometry === 'sphere' ? 'قطر کره (a):' : geometry === 'cylinder' ? 'قطر سیلندر (a):' : 'ضخامت کمینه (a):'}
                </span>
                <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">
                  {thicknessCm.toFixed(1)} cm
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.5"
                value={thicknessCm}
                onChange={(e) => setThicknessCm(parseFloat(e.target.value))}
                className="w-full accent-cyan-600 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
              />
            </div>

            {geometry === 'brick' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    عرض بلوک (b) [cm]:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="0.5"
                    value={widthCm}
                    onChange={(e) => setWidthCm(parseFloat(e.target.value) || 1)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    طول بلوک (c) [cm]:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(parseFloat(e.target.value) || 1)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Operating Temperatures */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
              <Flame className="w-4 h-4 text-rose-500" />
              دماهای عملیاتی فرآیند
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  دمای اولیه (Ti):
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={initialTempTi}
                    onChange={(e) => setInitialTempTi(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                  />
                  <span className="text-xs text-stone-500 font-mono">°C</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  محیط فریزر (Ta):
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={ambientTempTa}
                    onChange={(e) => setAmbientTempTa(parseFloat(e.target.value) || -35)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                  />
                  <span className="text-xs text-stone-500 font-mono">°C</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  نهایی مرکز (Tc):
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={targetCenterTempTc}
                    onChange={(e) => setTargetCenterTempTc(parseFloat(e.target.value) || -18)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                  />
                  <span className="text-xs text-stone-500 font-mono">°C</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 flex justify-between pt-1">
              <span>نقطه انجماد اولیه ماده:</span>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                Tif = {customProps.initialFreezingPointTif.toFixed(1)} °C
              </span>
            </div>
          </div>

          {/* Convection Method & Heat Transfer Coefficient */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
              <Sliders className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              شرایط انتقال حرارت جابجایی و تشعشع
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                تجهیز یا روش انجماد:
              </label>
              <select
                value={convectionMode}
                onChange={(e) => setConvectionMode(e.target.value as ConvectionMode)}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-cyan-500"
              >
                <option value="air_blast">تونل انجماد وزشی (Air Blast Freezer) — بر اساس سرعت هوا</option>
                <option value="still_air">هوای ساکن سردخانه (Still Air - h ≈ 8.5 W/m²·K)</option>
                <option value="plate_freezer">فریزر صفحه‌ای تماسی (Plate Freezer - h ≈ 350 W/m²·K)</option>
                <option value="immersion_brine">غوطه‌وری در آب‌نمک سرد (Brine Immersion - h ≈ 650 W/m²·K)</option>
                <option value="cryogenic_nitrogen">انجماد کرایوژنیک نیتروژن مایع (Cryogenic IQF - h ≈ 1100 W/m²·K)</option>
                <option value="custom">ورود دستی ضریب h (Custom Heat Transfer Coeff)</option>
              </select>
            </div>

            {convectionMode === 'air_blast' && (
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-stone-600 dark:text-stone-400">سرعت جریان هوا (v):</span>
                  <span className="font-mono font-bold text-cyan-600">{airVelocityMs.toFixed(1)} m/s</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10.0"
                  step="0.5"
                  value={airVelocityMs}
                  onChange={(e) => setAirVelocityMs(parseFloat(e.target.value))}
                  className="w-full accent-cyan-600 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {convectionMode === 'custom' && (
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  ضریب انتقال حرارت جابجایی h [W/(m²·K)]:
                </label>
                <input
                  type="number"
                  min="1"
                  max="3000"
                  value={manualH}
                  onChange={(e) => setManualH(parseFloat(e.target.value) || 10)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                />
              </div>
            )}

            {/* Radiation Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={includeRadiation}
                onChange={(e) => setIncludeRadiation(e.target.checked)}
                className="w-4 h-4 rounded-md text-cyan-600 accent-cyan-600 border-stone-300"
              />
              <span>منظور کردن انتقال حرارت تشعشعی (قانون استفان-بولتزمن با ضریب صدور ε = ۰.۹۰)</span>
            </label>
          </div>

          {/* Detailed Thermal Properties Card */}
          <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 text-xs space-y-2">
            <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-600" />
              ثابت‌های ترمودینامیکی ماده:
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono text-stone-600 dark:text-stone-400">
              <div>هدایت منجمد (kf): {customProps.thermalConductivityFrozen} W/m·K</div>
              <div>هدایت غیرمنجمد (ku): {customProps.thermalConductivityUnfrozen} W/m·K</div>
              <div>ظرفیت منجمد (cpf): {customProps.specificHeatFrozen} kJ/kg·K</div>
              <div>ظرفیت غیرمنجمد (cpu): {customProps.specificHeatUnfrozen} kJ/kg·K</div>
              <div>دانسیته منجمد (ρf): {customProps.densityFrozen} kg/m³</div>
              <div>گرمای نهان (ΔH): {customProps.latentHeatDeltaH} kJ/kg</div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Results & Scientific Engineering Views (8 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* SubTab Navigation */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-1.5 shadow-xs overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 min-w-max">
              {[
                { id: 'times_models', labelFa: 'زمان انجماد و مقایسه مدل‌ها', icon: Clock },
                { id: 'thawing_process', labelFa: 'فرآیند ذوب و وارونگی هدایت', icon: Flame },
                { id: 'thermal_history_curve', labelFa: 'منحنی دما - زمان T(t)', icon: Activity },
                { id: 'calculation_steps', labelFa: 'مراحل فرمولی محاسبات', icon: BookOpen },
                { id: 'sensitivity_analysis', labelFa: 'تحلیل حساسیت پارامترها', icon: Sliders },
                { id: 'scipy_sandbox', labelFa: 'اسکریپت پایتون و SciPy', icon: Play }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveSubTab)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-cyan-700 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.labelFa}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message if Ta >= Tif */}
          {!calculationResults && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl text-xs">
              خطای ورودی‌ها: دمای محیط انجماد (Ta) باید حتماً کمتر از نقطه انجماد اولیه ماده ({customProps.initialFreezingPointTif} °C) باشد.
            </div>
          )}

          {calculationResults && (
            <>
              {/* ===================================================== */}
              {/* TAB 1: FREEZING TIMES & MODEL COMPARISON              */}
              {/* ===================================================== */}
              {activeTab === 'times_models' && (
                <div className="space-y-5">
                  {/* Primary KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="bg-gradient-to-br from-cyan-50 to-sky-100/70 dark:from-cyan-950/40 dark:to-stone-900 border border-cyan-200 dark:border-cyan-800/60 rounded-2xl p-3.5">
                      <div className="text-[11px] font-bold text-cyan-800 dark:text-cyan-300">
                        کللند و ارل (دقیق‌ترین):
                      </div>
                      <div className="text-xl sm:text-2xl font-black font-mono text-cyan-900 dark:text-cyan-100 mt-1">
                        {calculationResults.clelandEarleFreezingTimeMinutes.toFixed(1)}
                        <span className="text-xs font-normal mr-1">دقیقه</span>
                      </div>
                      <div className="text-[10px] text-cyan-700 dark:text-cyan-400 mt-0.5">
                        معادل {calculationResults.totalFreezingTimeHours.toFixed(2)} ساعت
                      </div>
                    </div>

                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-3.5">
                      <div className="text-[11px] font-semibold text-stone-500">
                        مدل کلاسیک پلانک:
                      </div>
                      <div className="text-xl sm:text-2xl font-black font-mono text-stone-800 dark:text-stone-200 mt-1">
                        {calculationResults.plankFreezingTimeMinutes.toFixed(1)}
                        <span className="text-xs font-normal mr-1">دقیقه</span>
                      </div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                        فقط فاز نهان (کم‌تخمین)
                      </div>
                    </div>

                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-3.5">
                      <div className="text-[11px] font-semibold text-stone-500">
                        مدل استاندارد فام (Pham):
                      </div>
                      <div className="text-xl sm:text-2xl font-black font-mono text-stone-800 dark:text-stone-200 mt-1">
                        {calculationResults.phamFreezingTimeMinutes.toFixed(1)}
                        <span className="text-xs font-normal mr-1">دقیقه</span>
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        استاندارد انجمن ASHRAE
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-rose-50 to-orange-100/70 dark:from-rose-950/40 dark:to-stone-900 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-3.5">
                      <div className="text-[11px] font-bold text-rose-800 dark:text-rose-300">
                        زمان تخمینی ذوب (Thaw):
                      </div>
                      <div className="text-xl sm:text-2xl font-black font-mono text-rose-900 dark:text-rose-100 mt-1">
                        {calculationResults.thawingTimeMinutes.toFixed(1)}
                        <span className="text-xs font-normal mr-1">دقیقه</span>
                      </div>
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">
                        {calculationResults.thawingToFreezingRatio.toFixed(1)}x طولانی‌تر از انجماد
                      </div>
                    </div>
                  </div>

                  {/* 3-Stage Freezing Breakdown */}
                  <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-3">
                    <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-cyan-600" />
                        تفکیک ۳ مرحله‌ای فرآیند انجماد ماده غذایی
                      </span>
                      <span className="text-[11px] font-normal text-stone-500">
                        کل فرآیند: {calculationResults.totalFreezingTimeMinutes.toFixed(1)} دقیقه
                      </span>
                    </h3>

                    {/* Progress Bar */}
                    <div className="h-4 rounded-full overflow-hidden flex bg-stone-100 dark:bg-stone-800">
                      <div 
                        style={{ width: `${(calculationResults.stage1PrecoolingMinutes / calculationResults.totalFreezingTimeMinutes) * 100}%` }}
                        className="bg-amber-500 h-full transition-all"
                        title="مرحله ۱: پیش‌سرمایش محسوس"
                      />
                      <div 
                        style={{ width: `${(calculationResults.stage2PhaseChangeMinutes / calculationResults.totalFreezingTimeMinutes) * 100}%` }}
                        className="bg-cyan-500 h-full transition-all"
                        title="مرحله ۲: پلاتوی تغییر فاز و تشکیل بلورهای یخ"
                      />
                      <div 
                        style={{ width: `${(calculationResults.stage3SubcoolingMinutes / calculationResults.totalFreezingTimeMinutes) * 100}%` }}
                        className="bg-indigo-600 h-full transition-all"
                        title="مرحله ۳: فوق‌سرمایش و افت دما تا هدف"
                      />
                    </div>

                    {/* Stage Details Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                      <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-xl">
                        <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                          فاز ۱: پیش‌سرمایش محسوس
                        </div>
                        <div className="text-stone-600 dark:text-stone-400 text-[11px] mt-1">
                          کاهش دما از {initialTempTi} °C تا {customProps.initialFreezingPointTif} °C
                        </div>
                        <div className="font-mono font-bold text-amber-800 dark:text-amber-300 mt-1">
                          {calculationResults.stage1PrecoolingMinutes.toFixed(1)} دقیقه
                        </div>
                      </div>

                      <div className="p-3 bg-cyan-50/70 dark:bg-cyan-950/20 border border-cyan-200/60 dark:border-cyan-800/40 rounded-xl">
                        <div className="font-bold text-cyan-900 dark:text-cyan-200 flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                          فاز ۲: پلاتوی انجماد نهان
                        </div>
                        <div className="text-stone-600 dark:text-stone-400 text-[11px] mt-1">
                          خروج گرمای نهان ({customProps.latentHeatDeltaH} kJ/kg)
                        </div>
                        <div className="font-mono font-bold text-cyan-800 dark:text-cyan-300 mt-1">
                          {calculationResults.stage2PhaseChangeMinutes.toFixed(1)} دقیقه
                        </div>
                      </div>

                      <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 rounded-xl">
                        <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                          فاز ۳: فوق‌سرمایش عمیق
                        </div>
                        <div className="text-stone-600 dark:text-stone-400 text-[11px] mt-1">
                          رسیدن هسته به دمای نهایی {targetCenterTempTc} °C
                        </div>
                        <div className="font-mono font-bold text-indigo-800 dark:text-indigo-300 mt-1">
                          {calculationResults.stage3SubcoolingMinutes.toFixed(1)} دقیقه
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dimensionless Numbers & Freezing Rate */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Dimensionless Numbers Table */}
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-2.5">
                      <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
                        <ShieldCheck className="w-4 h-4 text-cyan-600" />
                        اعداد بدون بعد و شاخص‌های فیزیکی
                      </h4>
                      <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                        <div className="py-1.5 flex justify-between">
                          <span className="text-stone-600 dark:text-stone-400">عدد بیوت یخ (Bi_f):</span>
                          <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300">
                            {calculationResults.dimensionlessNumbers.biotNumberFrozen.toFixed(2)}
                            <span className="text-[10px] font-normal text-stone-400 mr-1">
                              ({calculationResults.dimensionlessNumbers.biotNumberFrozen > 0.1 ? 'گرادیان دمایی داخلی' : 'دمای یکنواخت'})
                            </span>
                          </span>
                        </div>
                        <div className="py-1.5 flex justify-between">
                          <span className="text-stone-600 dark:text-stone-400">عدد پلانک (Pk):</span>
                          <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                            {calculationResults.dimensionlessNumbers.plankNumber.toFixed(3)}
                          </span>
                        </div>
                        <div className="py-1.5 flex justify-between">
                          <span className="text-stone-600 dark:text-stone-400">عدد استفان (Ste):</span>
                          <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                            {calculationResults.dimensionlessNumbers.stefanNumber.toFixed(3)}
                          </span>
                        </div>
                        <div className="py-1.5 flex justify-between">
                          <span className="text-stone-600 dark:text-stone-400">طول مشخصه هندسی (Lc):</span>
                          <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                            {(calculationResults.dimensionlessNumbers.characteristicDimensionM * 100).toFixed(2)} cm
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Freezing Rate & Crystal Morphology */}
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-2.5">
                      <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
                        <Sparkles className="w-4 h-4 text-cyan-600" />
                        نرخ پیشروی انجماد و کیفیت ساختار بافتی
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-stone-600 dark:text-stone-400">سرعت پیشروی انجماد (v_f):</span>
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                            {calculationResults.averageFreezingRateCmPerHour.toFixed(2)} cm/h
                          </span>
                        </div>
                        <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                          <div className="font-bold text-cyan-700 dark:text-cyan-300">
                            {calculationResults.freezingCategoryFa}
                          </div>
                          <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                            {calculationResults.averageFreezingRateCmPerHour >= 5.0 
                              ? 'بلورهای یخ در داخل سلول‌ها (Intracellular) به شکل ریز و یکنواخت تشکیل شده و هیچ آسیبی به دیواره سلولی وارد نمی‌کنند (خوناب حداقل).'
                              : calculationResults.averageFreezingRateCmPerHour >= 1.0
                              ? 'انجماد با سرعت مناسب صنعتی انجام شده و بافت محصول پس از ذوب کیفیت بافتی و ارگانولپتیک مطلوبی حفظ خواهد کرد.'
                              : 'سرعت انجماد کند است؛ آب به فضای بین‌سلولی مهاجرت کرده و بلورهای درشت تشکیل می‌دهد که باعث پاره شدن غشای سلولی و خروج شدید خوناب (Drip Loss) می‌شود.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* TAB 2: THAWING PROCESS & CONDUCTIVITY INVERSION       */}
              {/* ===================================================== */}
              {activeTab === 'thawing_process' && (
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                    <Flame className="w-5 h-5 text-rose-500" />
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        تحلیل ترمودینامیکی فرآیند ذوب و وارونگی هدایت حرارتی (Thermal Conductivity Inversion)
                      </h3>
                      <p className="text-xs text-stone-500">
                        چرا ذوب کردن مواد غذایی همواره بسیار آهسته‌تر و طولانی‌تر از انجماد آن‌ها زمان می‌برد؟
                      </p>
                    </div>
                  </div>

                  {/* Contrast Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-cyan-900 dark:text-cyan-200">
                        <span>فرآیند انجماد (Freezing):</span>
                        <span className="font-mono text-cyan-700">{calculationResults.clelandEarleFreezingTimeMinutes.toFixed(1)} دقیقه</span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        لایه بیرونی تشکیل شده از <span className="font-bold text-cyan-700">یخ</span> است. 
                        هدایت حرارتی یخ بسیار بالاست:
                        <br />
                        <code className="font-mono text-xs font-bold text-cyan-800 dark:text-cyan-200">
                          k_f = {customProps.thermalConductivityFrozen} W/(m·K)
                        </code>
                        <br />
                        لایه یخ یخ‌زده گرما را به سرعت از مغز محصول به سطح بیرونی انتقال می‌دهد.
                      </p>
                    </div>

                    <div className="p-4 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-rose-900 dark:text-rose-200">
                        <span>فرآیند ذوب (Thawing):</span>
                        <span className="font-mono text-rose-700">{calculationResults.thawingTimeMinutes.toFixed(1)} دقیقه</span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        لایه بیرونی تشکیل شده از <span className="font-bold text-rose-700">آب مایع</span> است. 
                        هدایت حرارتی آب مایع بسیار پایین است:
                        <br />
                        <code className="font-mono text-xs font-bold text-rose-800 dark:text-rose-200">
                          k_u = {customProps.thermalConductivityUnfrozen} W/(m·K)
                        </code>
                        <br />
                        لایه آب ذوب‌شده مانند یک عایق حرارتی مقاومت ایجاد کرده و سرعت ورود گرما به هسته منجمد را به شدت کاهش می‌دهد.
                      </p>
                    </div>
                  </div>

                  {/* Ratio Metric */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-stone-700 dark:text-stone-300">
                      <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        نسبت زمان ذوب به انجماد:
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        در شرایط مشابه اختلاف دمای محرک و ضریب انتقال حرارت سطحی
                      </p>
                    </div>
                    <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 shrink-0">
                      {calculationResults.thawingToFreezingRatio.toFixed(2)} ×
                    </div>
                  </div>

                  {/* Detailed Explanation */}
                  <div className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed space-y-2">
                    <p className="font-semibold text-stone-800 dark:text-stone-200">
                      پیامدهای کیفی و بهداشتی در صنایع غذایی:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pr-2">
                      <li>
                        به دلیل طولانی بودن زمان ذوب، لایه سطحی ماده غذایی برای ساعت‌ها در دمای بالای صفر و منطقه خطر رشد میکروبی (دمای بالای ۴ درجه سلسیوس) باقی می‌ماند.
                      </li>
                      <li>
                        روش‌های ذوب کنترل‌شده صنعتی شامل ذوب تحت خلاء (Vacuum Thawing)، ذوب با مایکروویو و فرکانس رادیویی (Ohmic / RF Thawing) با دور زدن لایه رسانای سطحی، زمان ذوب را به کسری از دقیقه کاهش می‌دهند.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* TAB 3: THERMAL HISTORY CURVE T(t)                     */}
              {/* ===================================================== */}
              {activeTab === 'thermal_history_curve' && (
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                    <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-cyan-600" />
                      منحنی دینامیک دما بر حسب زمان فرآیند انجماد (Thermal History Curve)
                    </h3>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1 text-cyan-600">
                        <span className="w-3 h-1 bg-cyan-600 inline-block rounded-full" /> دمای مرکز (Center T)
                      </span>
                      <span className="flex items-center gap-1 text-indigo-500">
                        <span className="w-3 h-1 bg-indigo-500 inline-block rounded-full" /> دمای سطح (Surface T)
                      </span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="w-full bg-stone-50 dark:bg-stone-950/60 rounded-2xl p-4 border border-stone-200 dark:border-stone-800">
                    <svg viewBox="0 0 650 300" className="w-full h-64 sm:h-72 overflow-visible">
                      {/* Grid Lines */}
                      {[-40, -30, -20, -10, 0, 10, 20].map((t) => {
                        const y = 260 - ((t - (-40)) / (25 - (-40))) * 220;
                        return (
                          <g key={t}>
                            <line x1="50" y1={y} x2="630" y2={y} stroke="currentColor" className="text-stone-200 dark:text-stone-800" strokeDasharray="3 3" />
                            <text x="42" y={y + 4} textAnchor="end" className="text-[10px] fill-stone-400 font-mono">
                              {t}°
                            </text>
                          </g>
                        );
                      })}

                      {/* Initial Freezing Line Tif */}
                      {(() => {
                        const yTif = 260 - ((customProps.initialFreezingPointTif - (-40)) / (25 - (-40))) * 220;
                        return (
                          <g>
                            <line x1="50" y1={yTif} x2="630" y2={yTif} stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                            <text x="625" y={yTif - 6} textAnchor="end" className="text-[10px] fill-cyan-600 font-bold">
                              T_if = {customProps.initialFreezingPointTif}°C
                            </text>
                          </g>
                        );
                      })()}

                      {/* Center Temperature Path */}
                      <path
                        d={(() => {
                          const pts = calculationResults.temperatureCurve.map((p) => {
                            const x = 50 + (p.timeMinutes / calculationResults.totalFreezingTimeMinutes) * 580;
                            const y = 260 - ((p.centerTemperatureC - (-40)) / (25 - (-40))) * 220;
                            return `${x},${y}`;
                          });
                          return `M ${pts.join(' L ')}`;
                        })()}
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="2.5"
                      />

                      {/* Surface Temperature Path */}
                      <path
                        d={(() => {
                          const pts = calculationResults.temperatureCurve.map((p) => {
                            const x = 50 + (p.timeMinutes / calculationResults.totalFreezingTimeMinutes) * 580;
                            const y = 260 - ((p.surfaceTemperatureC - (-40)) / (25 - (-40))) * 220;
                            return `${x},${y}`;
                          });
                          return `M ${pts.join(' L ')}`;
                        })()}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />

                      {/* Data Point Dots on Center Curve */}
                      {calculationResults.temperatureCurve.filter((_, idx) => idx % 4 === 0).map((p, idx) => {
                        const x = 50 + (p.timeMinutes / calculationResults.totalFreezingTimeMinutes) * 580;
                        const y = 260 - ((p.centerTemperatureC - (-40)) / (25 - (-40))) * 220;
                        return (
                          <circle
                            key={idx}
                            cx={x}
                            cy={y}
                            r="4"
                            className="fill-cyan-600 stroke-white dark:stroke-stone-900"
                            strokeWidth="2"
                          />
                        );
                      })}

                      {/* X Axis Time Labels */}
                      {[0, 0.25, 0.5, 0.75, 1.0].map((frac) => {
                        const x = 50 + frac * 580;
                        const timeMin = Math.round(frac * calculationResults.totalFreezingTimeMinutes);
                        return (
                          <g key={frac}>
                            <line x1={x} y1="260" x2={x} y2="265" stroke="currentColor" className="text-stone-400" />
                            <text x={x} y="280" textAnchor="middle" className="text-[10px] fill-stone-500 font-mono">
                              {timeMin} min
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    منحنی فوق پدیده پلاتوی انجماد (Freezing Plateau) را نشان می‌دهد: در حین خروج گرمای نهان ذوب، دمای مرکز نمونه نزدیک به نقطه انجماد اولیه (T_if) ثابت می‌ماند 
                    در حالی که دمای سطح به دلیل تماس با هوای مبرد با شیب تند سقوط می‌کند.
                  </p>
                </div>
              )}

              {/* ===================================================== */}
              {/* TAB 4: STEP-BY-STEP CALCULATION BREAKDOWN            */}
              {/* ===================================================== */}
              {activeTab === 'calculation_steps' && (
                <div className="space-y-4">
                  {calculationResults.calculationSteps.map((step) => (
                    <div 
                      key={step.stepNumber}
                      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-cyan-700 text-white font-mono font-bold text-xs flex items-center justify-center">
                            {step.stepNumber}
                          </span>
                          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                            {step.titleFa}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400">{step.titleEn}</span>
                      </div>

                      {/* Formula */}
                      <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl overflow-x-auto text-center" dir="ltr">
                        <KaTeXRenderer expression={step.formulaLatex} displayMode={true} />
                      </div>

                      {/* Substitution & Result */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl">
                          <span className="text-stone-500 text-[11px] block mb-1">جایگذاری مقادیر:</span>
                          <div className="font-mono text-stone-700 dark:text-stone-300 overflow-x-auto" dir="ltr">
                            <KaTeXRenderer expression={step.substitutionFa} displayMode={false} />
                          </div>
                        </div>

                        <div className="p-2.5 bg-cyan-50/70 dark:bg-cyan-950/20 border border-cyan-200/60 dark:border-cyan-800/40 rounded-xl">
                          <span className="text-cyan-800 dark:text-cyan-300 text-[11px] block mb-1">نتیجه محاسبه:</span>
                          <div className="font-mono font-bold text-cyan-900 dark:text-cyan-200 overflow-x-auto" dir="ltr">
                            <KaTeXRenderer expression={step.resultFa} displayMode={false} />
                          </div>
                        </div>
                      </div>

                      {step.notesFa && (
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 bg-stone-50/50 dark:bg-stone-800/30 p-2 rounded-lg">
                          <span className="font-bold">نکته مهندسی: </span>
                          {step.notesFa}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ===================================================== */}
              {/* TAB 5: SENSITIVITY ANALYSIS                           */}
              {/* ===================================================== */}
              {activeTab === 'sensitivity_analysis' && (
                <div className="space-y-4">
                  {calculationResults.sensitivityAnalysis.map((sen, idx) => (
                    <div 
                      key={idx}
                      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                          تحلیل حساسیت: {sen.factorNameFa}
                        </span>
                        <span className="text-xs font-mono text-cyan-700 dark:text-cyan-300 font-semibold">
                          مقدار پایه: {sen.baselineValue} {sen.unit}
                        </span>
                      </div>

                      {/* Scenarios Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs">
                          <thead>
                            <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 text-[11px]">
                              <th className="py-2 px-3 font-semibold">درصد تغییر</th>
                              <th className="py-2 px-3 font-semibold">مقدار پارامتر</th>
                              <th className="py-2 px-3 font-semibold">زمان انجماد</th>
                              <th className="py-2 px-3 font-semibold">اختلاف با حالت پایه</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                            {sen.scenarios.map((sc, sIdx) => {
                              const isBaseline = sc.percentageChange === 0;
                              return (
                                <tr 
                                  key={sIdx}
                                  className={isBaseline ? 'bg-cyan-50/60 dark:bg-cyan-950/20 font-bold' : ''}
                                >
                                  <td className="py-2 px-3" dir="ltr">
                                    {sc.percentageChange > 0 ? `+${sc.percentageChange}%` : `${sc.percentageChange}%`}
                                  </td>
                                  <td className="py-2 px-3">
                                    {sc.parameterValue} {sen.unit}
                                  </td>
                                  <td className="py-2 px-3 font-bold text-cyan-800 dark:text-cyan-200">
                                    {sc.freezingTimeMinutes.toFixed(1)} min
                                  </td>
                                  <td className="py-2 px-3" dir="ltr">
                                    {sc.differenceMinutes > 0 ? `+${sc.differenceMinutes.toFixed(1)} min` : sc.differenceMinutes < 0 ? `${sc.differenceMinutes.toFixed(1)} min` : '۰ (مبنا)'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ===================================================== */}
              {/* TAB 6: PYTHON & SCIPY WEBWORKER SANDBOX               */}
              {/* ===================================================== */}
              {activeTab === 'scipy_sandbox' && (
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                        <Play className="w-4 h-4 text-emerald-600" />
                        اجرای اسکریپت محاسباتی Python و SciPy در وب‌ورکر مستقل
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        کد پایتون خودکفا برای شبیه‌سازی انجماد و ذوب بدون وقفه در رابط کاربری
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                      >
                        {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedScript ? 'کپی شد' : 'کپی کد'}</span>
                      </button>

                      <button
                        onClick={handleRunPython}
                        disabled={pyStatus === 'running' || pyStatus === 'initializing'}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{pyStatus === 'running' ? 'در حال اجرا...' : pyStatus === 'initializing' ? 'بارگذاری پایتون...' : 'اجرای کد در مرورگر'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Code Editor Preview */}
                  <div className="relative rounded-xl overflow-hidden border border-stone-300 dark:border-stone-800">
                    <pre className="p-4 bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto max-h-80 leading-relaxed text-left" dir="ltr">
                      {generatedPythonScript}
                    </pre>
                  </div>

                  {/* Output Console */}
                  {outputChunks.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                        <span>خروجی ترمینال پایتون:</span>
                        <button
                          onClick={clearOutput}
                          className="text-[11px] text-stone-400 hover:text-stone-200"
                        >
                          پاک کردن لاگ
                        </button>
                      </div>
                      <pre 
                        className="p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-60 text-left bg-stone-950 text-emerald-400 border border-stone-800"
                        dir="ltr"
                      >
                        {outputChunks.map(c => c.text).join('')}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};
