import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Pipette, 
  Layers, 
  TrendingUp, 
  Play, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Gauge, 
  Zap, 
  BookOpen, 
  Sliders
} from 'lucide-react';
import { 
  BENCHMARK_RHEOLOGY_DATASETS, 
  getBenchmarkRheologyDatasetById 
} from '../../lib/rheology/benchmarkRheologyData';
import { 
  fitAllRheologicalModels, 
  calculatePipeHydraulics 
} from '../../lib/rheology/rheologyEngine';
import { generateRheologyScipyScript } from '../../lib/rheology/scipyRheologyScript';
import { ShearDataPoint, PipeFlowInputs, RheologyModelType } from '../../lib/rheology/types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';
import { usePythonEngine } from '../../lib/python/usePythonEngine';

type ActiveSubTab = 'model_fitting' | 'pipe_hydraulics' | 'data_editor' | 'scipy_runner';

export const RheologyFluidMechanicsSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveSubTab>('model_fitting');

  // Selected Benchmark Dataset
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('ketchup_25c');
  const selectedDataset = useMemo(() => {
    return getBenchmarkRheologyDatasetById(selectedDatasetId) || BENCHMARK_RHEOLOGY_DATASETS[0];
  }, [selectedDatasetId]);

  // Current Experimental Data Points
  const [points, setPoints] = useState<ShearDataPoint[]>(() => {
    return selectedDataset.points.map(p => ({ ...p }));
  });

  // Selected Model for Pipe Flow calculations
  const [selectedModelType, setSelectedModelType] = useState<RheologyModelType>('herschel_bulkley');

  // Pipe Flow Inputs
  const [pipeInputs, setPipeInputs] = useState<PipeFlowInputs>({
    pipeDiameterM: 0.05,            // 50 mm (2-inch sanitary pipe)
    pipeLengthM: 35.0,              // 35 meters
    volumetricFlowRateM3h: 3.5,     // 3.5 m^3/h (~58 L/min)
    densityKgM3: 1150.0,            // 1150 kg/m^3 for ketchup
    pipeRoughnessM: 0.000045,       // Stainless steel 316L
    pumpEfficiencyPercent: 70.0,    // 70%
    staticElevationHeadM: 4.0       // 4 meters vertical lift to filling tank
  });

  // Python Engine Integration
  const { runCode, status: pyStatus, outputChunks, clearOutput } = usePythonEngine();
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Handle Dataset Preset Change
  const handleSelectDataset = (id: string) => {
    setSelectedDatasetId(id);
    const ds = getBenchmarkRheologyDatasetById(id);
    if (ds) {
      setPoints(ds.points.map(p => ({ ...p })));
      setSelectedModelType(ds.bestFittingModel);
      // Adjust density based on product category
      if (ds.id.includes('ketchup') || ds.id.includes('tomato')) {
        setPipeInputs(prev => ({ ...prev, densityKgM3: 1150 }));
      } else if (ds.id.includes('chocolate')) {
        setPipeInputs(prev => ({ ...prev, densityKgM3: 1280 }));
      } else if (ds.id.includes('olive_oil')) {
        setPipeInputs(prev => ({ ...prev, densityKgM3: 915 }));
      } else if (ds.id.includes('honey')) {
        setPipeInputs(prev => ({ ...prev, densityKgM3: 1420 }));
      } else {
        setPipeInputs(prev => ({ ...prev, densityKgM3: 1050 }));
      }
    }
  };

  // Perform Model Fitting across all 5 models
  const fittingResults = useMemo(() => {
    try {
      return fitAllRheologicalModels(points);
    } catch {
      return [];
    }
  }, [points]);

  const bestModel = useMemo(() => {
    return fittingResults[0] || null;
  }, [fittingResults]);

  const activeModelForPipe = useMemo(() => {
    return fittingResults.find(m => m.modelType === selectedModelType) || bestModel;
  }, [fittingResults, selectedModelType, bestModel]);

  // Pipe Hydraulics Calculation
  const pipeResult = useMemo(() => {
    if (!activeModelForPipe) return null;
    try {
      return calculatePipeHydraulics(pipeInputs, activeModelForPipe);
    } catch {
      return null;
    }
  }, [pipeInputs, activeModelForPipe]);

  // Points modification handlers
  const handleAddPoint = () => {
    const lastP = points[points.length - 1];
    const newRate = lastP ? lastP.shearRate + 25.0 : 10.0;
    const newStress = lastP ? lastP.shearStress + 15.0 : 10.0;
    setPoints([...points, { shearRate: newRate, shearStress: newStress }]);
  };

  const handleRemovePoint = (index: number) => {
    if (points.length <= 3) return;
    setPoints(points.filter((_, idx) => idx !== index));
  };

  const handleUpdatePoint = (index: number, field: 'shearRate' | 'shearStress', val: number) => {
    const updated = [...points];
    updated[index] = { ...updated[index], [field]: val };
    setPoints(updated);
  };

  // Python SciPy Script
  const activeScipyCode = useMemo(() => {
    return generateRheologyScipyScript(points, selectedDataset.productNameFa);
  }, [points, selectedDataset]);

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
      {/* 1. Header & Dataset Selector Bar */}
      <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">بانک داده‌های تجربی رئومتری غذا</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">DIN / ISO / Steffe</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-white">
              انتخاب سیال غذایی یا داده‌های آزمایشگاهی جهت تحلیل رئولوژیکی
            </h3>
          </div>

          <div className="w-full md:w-96">
            <select
              value={selectedDatasetId}
              onChange={(e) => handleSelectDataset(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs sm:text-sm font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            >
              {BENCHMARK_RHEOLOGY_DATASETS.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.productNameFa} ({ds.testTemperatureC}°C)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dataset Details Card */}
        <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400 block mb-0.5">سیستم اندازه‌گیری رئومتر</span>
            <span className="font-medium text-stone-800 dark:text-stone-200 truncate block">
              {selectedDataset.measuringGeometry}
            </span>
          </div>

          <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400 block mb-0.5">بهترین مدل برازش‌یافته در متون علمی</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {selectedDataset.bestFittingModel.toUpperCase()}
            </span>
          </div>

          <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400 block mb-0.5">مرجع معتبر علمی</span>
            <span className="font-mono text-stone-700 dark:text-stone-300 truncate block">
              {selectedDataset.literatureReference.authors} ({selectedDataset.literatureReference.year})
            </span>
          </div>
        </div>

        <p className="mt-2.5 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          {selectedDataset.physicalDescriptionFa}
        </p>
      </div>

      {/* 2. Sub-Tabs Navigation */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-1.5 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('model_fitting')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'model_fitting'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>برازش و مقایسه ۵ مدل رئولوژی</span>
          </button>

          <button
            onClick={() => setActiveTab('pipe_hydraulics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'pipe_hydraulics'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>مکانیک سیالات، عدد رینولدز و هیدرولیک لوله</span>
          </button>

          <button
            onClick={() => setActiveTab('data_editor')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'data_editor'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>جدول نقاط تجربی رئومتر ({points.length} نقطه)</span>
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

      {/* =========================================================================
          TAB 1: RHEOLOGY MODEL FITTING & COMPARISON MATRIX
          ========================================================================= */}
      {activeTab === 'model_fitting' && (
        <div className="space-y-6">
          {/* Best Model Summary Cards */}
          {bestModel && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white dark:bg-stone-900 border-2 border-rose-500/40 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">دقیق‌ترین مدل برازش‌یافته</span>
                <div className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 truncate">
                  {bestModel.modelNameFa}
                </div>
                <div className="text-xs font-mono text-stone-500 mt-1">
                  R² = {bestModel.rSquared.toFixed(4)} (RMSE: {bestModel.rmse.toFixed(2)} Pa)
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">شاخص رفتار جریان (n)</span>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-stone-900 dark:text-white">
                  {bestModel.parameters.n ? bestModel.parameters.n.value.toFixed(3) : '1.000'}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 truncate">
                  {bestModel.flowBehaviorCategoryFa}
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">تنش تسلیم ساختاری (τ₀)</span>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                  {bestModel.parameters.tau_0 ? bestModel.parameters.tau_0.value.toFixed(2) : bestModel.parameters.tau_0c ? bestModel.parameters.tau_0c.value.toFixed(2) : '0.00'}
                  <span className="text-xs font-normal text-stone-500 mr-1.5">Pa</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  حداقل تنش برای شروع جریان
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">شاخص قوام سیال (K)</span>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  {bestModel.parameters.K ? bestModel.parameters.K.value.toFixed(3) : bestModel.parameters.mu ? bestModel.parameters.mu.value.toFixed(3) : '1.000'}
                  <span className="text-xs font-normal text-stone-500 mr-1.5">Pa·sⁿ</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  ضریب قوام در نرخ برش ۱ s⁻¹
                </div>
              </div>
            </div>
          )}

          {/* Model Comparison Table */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-600" />
                  <span>ماتریس مقایسه دقت و رتبه‌بندی ۵ مدل رئولوژیکی (Model Ranking)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  رتبه‌بندی مدل‌ها بر اساس ضریب تبیین (R²) و خطای جذر میانگین مربعات (RMSE در پاسکال)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 font-semibold">
                  <tr>
                    <th className="p-3 text-center w-12">رتبه</th>
                    <th className="p-3">نام مدل رئولوژیکی</th>
                    <th className="p-3">معادله ساختاری</th>
                    <th className="p-3">ضریب تبیین (R²)</th>
                    <th className="p-3">خطای RMSE (Pa)</th>
                    <th className="p-3">پارامترهای به دست آمده</th>
                    <th className="p-3 text-center">وضعیت همگرایی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-mono">
                  {fittingResults.map((m, idx) => {
                    const isTop = idx === 0;
                    return (
                      <tr key={m.modelType} className={`hover:bg-stone-50/80 dark:hover:bg-stone-800/40 ${isTop ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''}`}>
                        <td className="p-3 text-center font-bold text-stone-700 dark:text-stone-300 font-sans">
                          {isTop ? '🥇 ۱' : `${idx + 1}`}
                        </td>
                        <td className="p-3 font-bold font-sans text-stone-900 dark:text-white">
                          {m.modelNameFa}
                        </td>
                        <td className="p-3 font-sans">
                          <KaTeXRenderer expression={m.equationLatex} displayMode={false} />
                        </td>
                        <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                          {m.rSquared.toFixed(4)}
                        </td>
                        <td className="p-3 text-stone-700 dark:text-stone-300">
                          {m.rmse.toFixed(3)}
                        </td>
                        <td className="p-3 font-sans text-[11px] text-stone-600 dark:text-stone-400">
                          {Object.values(m.parameters).map(p => `${p.symbol}=${p.value.toFixed(3)} ${p.unit}`).join(' | ')}
                        </td>
                        <td className="p-3 text-center font-sans">
                          {m.isConverged ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> همگرا
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                              <AlertCircle className="w-3.5 h-3.5" /> هشدار
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SVG Charts: Flow Curve & Apparent Viscosity Curve */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Flow Curve (Shear Stress vs Shear Rate) */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <span>منحنی جریان: تنش برشی بر حسب نرخ برش (Flow Curve)</span>
                </h5>
                <span className="text-xs font-mono text-stone-500">τ (Pa) vs γ̇ (s⁻¹)</span>
              </div>

              <div className="h-64 w-full bg-stone-50 dark:bg-stone-950/60 rounded-xl p-3 border border-stone-200 dark:border-stone-800 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#e5e7eb" strokeDasharray="3 3" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="#e5e7eb" strokeDasharray="3 3" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="#e5e7eb" strokeDasharray="3 3" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="#e5e7eb" strokeDasharray="3 3" />

                  {(() => {
                    const maxRate = Math.max(...points.map(p => p.shearRate));
                    const maxStress = Math.max(...points.map(p => p.shearStress)) * 1.15;

                    // Fitted Curve for Best Model
                    let fittedPath = '';
                    if (bestModel && bestModel.fittedStressPoints.length > 0) {
                      fittedPath = bestModel.fittedStressPoints.map((p, idx) => {
                        const x = 40 + (p.shearRate / Math.max(1, maxRate)) * 430;
                        const y = 190 - (p.predictedStress / Math.max(1, maxStress)) * 170;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ');
                    }

                    return (
                      <>
                        {fittedPath && (
                          <path d={fittedPath} fill="none" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="none" />
                        )}

                        {/* Experimental Data Points */}
                        {points.map((p, idx) => {
                          const x = 40 + (p.shearRate / Math.max(1, maxRate)) * 430;
                          const y = 190 - (p.shearStress / Math.max(1, maxStress)) * 170;
                          return (
                            <circle key={idx} cx={x} cy={y} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                          );
                        })}
                      </>
                    );
                  })()}

                  <text x="35" y="25" fontSize="10" fill="#6b7280" textAnchor="end">τ_max</text>
                  <text x="35" y="190" fontSize="10" fill="#6b7280" textAnchor="end">0</text>
                  <text x="260" y="210" fontSize="10" fill="#6b7280" textAnchor="middle">نرخ برش γ̇ (ثانیه به توان منفی یک)</text>
                </svg>
              </div>

              <div className="flex items-center justify-center gap-6 text-xs pt-1">
                <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  نقاط تجربی رئومتر
                </span>
                <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                  <span className="w-5 h-0.5 bg-rose-600 inline-block"></span>
                  منحنی برازش مدل برتر ({bestModel?.modelNameEn})
                </span>
              </div>
            </div>

            {/* Chart 2: Apparent Viscosity Curve (Viscosity vs Shear Rate) */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                  <Pipette className="w-4 h-4 text-indigo-600" />
                  <span>منحنی ویسکوزیته ظاهری (Viscosity Curve: η_a vs γ̇)</span>
                </h5>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">η_a = τ / γ̇ (Pa·s)</span>
              </div>

              <div className="h-64 w-full bg-stone-50 dark:bg-stone-950/60 rounded-xl p-3 border border-stone-200 dark:border-stone-800 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#e5e7eb" strokeDasharray="3 3" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="#e5e7eb" strokeDasharray="3 3" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="#e5e7eb" strokeDasharray="3 3" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="#e5e7eb" strokeDasharray="3 3" />

                  {(() => {
                    const maxRate = Math.max(...points.map(p => p.shearRate));
                    const viscValues = points.map(p => p.shearStress / Math.max(0.001, p.shearRate));
                    const maxVisc = Math.max(...viscValues) * 1.1;

                    // Curve path
                    const pathStr = points.map((p, idx) => {
                      const visc = p.shearStress / Math.max(0.001, p.shearRate);
                      const x = 40 + (p.shearRate / Math.max(1, maxRate)) * 430;
                      const y = 190 - (visc / Math.max(0.01, maxVisc)) * 170;
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ');

                    return (
                      <>
                        <path d={pathStr} fill="none" stroke="#6366f1" strokeWidth="2.5" />
                        {points.map((p, idx) => {
                          const visc = p.shearStress / Math.max(0.001, p.shearRate);
                          const x = 40 + (p.shearRate / Math.max(1, maxRate)) * 430;
                          const y = 190 - (visc / Math.max(0.01, maxVisc)) * 170;
                          return (
                            <circle key={idx} cx={x} cy={y} r="3.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
                          );
                        })}
                      </>
                    );
                  })()}

                  <text x="35" y="25" fontSize="10" fill="#6b7280" textAnchor="end">η_max</text>
                  <text x="35" y="190" fontSize="10" fill="#6b7280" textAnchor="end">0</text>
                  <text x="260" y="210" fontSize="10" fill="#6b7280" textAnchor="middle">نرخ برش γ̇ (s⁻¹)</text>
                </svg>
              </div>

              <div className="text-center text-xs text-indigo-700 dark:text-indigo-300 font-medium pt-1">
                کاهش ویسکوزیته ظاهری با افزایش نرخ برش بیانگر رفتار رقیق‌شونده با برش (Shear-Thinning) است
              </div>
            </div>
          </div>

          {/* Model Limitations & Scientific Notes */}
          {bestModel && (
            <div className="bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 rounded-xl p-4 text-xs space-y-2">
              <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-stone-600" />
                <span>ملاحظات فیزیکوشیمیایی و محدودیت‌های کاربرد مدل {bestModel.modelNameFa}</span>
              </span>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {bestModel.applicationNotesFa}
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-500 dark:text-stone-400 pt-1">
                {bestModel.limitationsFa.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: PIPE FLUID MECHANICS & HYDRAULICS (METZNER-REED & PUMP SIZING)
          ========================================================================= */}
      {activeTab === 'pipe_hydraulics' && (
        <div className="space-y-6">
          {/* Controls: Pipe Parameters and Selected Rheological Model */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-indigo-600" />
                  <span>پارامترهای خط لوله استیل و فرآیند انتقال سیال غیرنیوتنی</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  محاسبه عدد رینولدز تعمیم‌یافته متزنر-رید (Re_MR)، ضریب اصطکاک فانینگ، افت فشار و توان پمپ
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">مدل رئولوژی حاکم:</span>
                <select
                  value={selectedModelType}
                  onChange={(e) => setSelectedModelType(e.target.value as RheologyModelType)}
                  className="px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-900 dark:text-white"
                >
                  {fittingResults.map((m) => (
                    <option key={m.modelType} value={m.modelType}>
                      {m.modelNameFa} (R²={m.rSquared.toFixed(3)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">قطر داخلی لوله (D در متر)</label>
                <input
                  type="number"
                  step="0.005"
                  value={pipeInputs.pipeDiameterM}
                  onChange={(e) => setPipeInputs({ ...pipeInputs, pipeDiameterM: parseFloat(e.target.value) || 0.01 })}
                  className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                />
                <span className="text-[10px] text-stone-400">مثال: 0.05 m = 50 mm (2 اینچ)</span>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">طول معادل خط لوله (L در متر)</label>
                <input
                  type="number"
                  step="5"
                  value={pipeInputs.pipeLengthM}
                  onChange={(e) => setPipeInputs({ ...pipeInputs, pipeLengthM: parseFloat(e.target.value) || 1 })}
                  className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                />
                <span className="text-[10px] text-stone-400">شامل اتصالات و زانویی‌ها</span>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">دبی حجمی جریان (Q در m³/h)</label>
                <input
                  type="number"
                  step="0.5"
                  value={pipeInputs.volumetricFlowRateM3h}
                  onChange={(e) => setPipeInputs({ ...pipeInputs, volumetricFlowRateM3h: parseFloat(e.target.value) || 0.1 })}
                  className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                />
                <span className="text-[10px] text-stone-400">معادل {((pipeInputs.volumetricFlowRateM3h * 1000) / 60).toFixed(1)} L/min</span>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">چگالی سیال (ρ در kg/m³)</label>
                <input
                  type="number"
                  step="10"
                  value={pipeInputs.densityKgM3}
                  onChange={(e) => setPipeInputs({ ...pipeInputs, densityKgM3: parseFloat(e.target.value) || 1000 })}
                  className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                />
                <span className="text-[10px] text-stone-400">مثال: کچاپ ۱۱۵۰، شکلات ۱۲۸۰</span>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {pipeResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">عدد رینولدز تعمیم‌یافته (Re_MR)</span>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-stone-900 dark:text-white">
                  {pipeResult.generalizedReynoldsNumber.toFixed(1)}
                </div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {pipeResult.flowRegimeFa}
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">افت فشار اصطکاکی خط لوله</span>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-rose-600 dark:text-rose-400">
                  {pipeResult.frictionPressureDropKPa.toFixed(2)}
                  <span className="text-xs font-normal text-stone-500 mr-1.5">kPa</span>
                </div>
                <div className="text-xs font-mono text-stone-500 mt-1">
                  معادل {(pipeResult.frictionPressureDropPa / 100000).toFixed(3)} bar
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">سرعت میانگین جریان (v)</span>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                  {pipeResult.flowVelocityMs.toFixed(2)}
                  <span className="text-xs font-normal text-stone-500 mr-1.5">m/s</span>
                </div>
                <div className="text-xs font-mono text-stone-500 mt-1">
                  نرخ برش دیواره: {pipeResult.wallShearRateS1.toFixed(1)} s⁻¹
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">توان موتور الکتریکی پمپ</span>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-600 dark:text-amber-400">
                  {pipeResult.electricMotorPowerKW.toFixed(2)}
                  <span className="text-xs font-normal text-stone-500 mr-1.5">kW</span>
                </div>
                <div className="text-xs font-mono text-stone-500 mt-1">
                  توان هیدرولیکی: {(pipeResult.hydraulicPowerWatts / 1000).toFixed(2)} kW
                </div>
              </div>
            </div>
          )}

          {/* Step-by-Step LaTeX Equations Trace */}
          {pipeResult && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h5 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>مراحل محاسبه تحلیلی هیدرولیک لوله و جایگذاری اعداد در روابط Metzner-Reed</span>
              </h5>

              <div className="space-y-3">
                {pipeResult.equationTrace.map((eq, idx) => (
                  <div key={idx} className="bg-stone-50 dark:bg-stone-800/50 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700/60 text-xs space-y-1.5">
                    <span className="font-bold text-stone-800 dark:text-stone-200 block">
                      {idx + 1}. {eq.title}
                    </span>
                    <div className="overflow-x-auto py-1">
                      <KaTeXRenderer expression={eq.latex} displayMode={false} />
                    </div>
                    <div className="text-stone-500 font-mono text-[11px] overflow-x-auto" dir="ltr">
                      {eq.substitution}
                    </div>
                    <div className="text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[11px]" dir="ltr">
                      {eq.result}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: EXPERIMENTAL DATA POINTS EDITOR
          ========================================================================= */}
      {activeTab === 'data_editor' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  <span>ویرایشگر نقاط تجربی نرخ برش و تنش برشی (Shear Rate - Shear Stress)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  امکان ویرایش مستقیم مقادیر آزمون، افزودن ردیف‌های جدید و مشاهده ویسکوزیته ظاهری متناظر
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
                    <th className="p-3">نرخ برش γ̇ (s⁻¹)</th>
                    <th className="p-3">تنش برشی تجربی τ (Pa)</th>
                    <th className="p-3">ویسکوزیته ظاهری η_a = τ/γ̇ (Pa·s)</th>
                    <th className="p-3 w-16 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-mono">
                  {points.map((pt, idx) => {
                    const apparentVisc = pt.shearRate > 0 ? pt.shearStress / pt.shearRate : 0;
                    return (
                      <tr key={idx} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40">
                        <td className="p-3 text-center text-stone-400 font-sans">{idx + 1}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.5"
                            value={pt.shearRate}
                            onChange={(e) => handleUpdatePoint(idx, 'shearRate', parseFloat(e.target.value) || 0.1)}
                            className="w-24 px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.5"
                            value={pt.shearStress}
                            onChange={(e) => handleUpdatePoint(idx, 'shearStress', parseFloat(e.target.value) || 0.1)}
                            className="w-24 px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                          />
                        </td>
                        <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">
                          {apparentVisc.toFixed(4)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleRemovePoint(idx)}
                            disabled={points.length <= 3}
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
                  <span>اجرای برازش غیرخطی با ماژول scipy.optimize.curve_fit</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  کد پایتون زیر با الگوریتم Levenberg-Marquardt در Web Worker مرورگر بدون قفل شدن رابط کاربری اجرا می‌شود.
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
                    <span>خروجی برازش رگرسیونی SciPy:</span>
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
