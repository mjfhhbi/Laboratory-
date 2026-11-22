import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  Layers, 
  TrendingUp, 
  Play, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Download, 
  Sliders, 
  ShieldCheck, 
  Info,
  Sparkles
} from 'lucide-react';
import { 
  BENCHMARK_ISOTHERM_DATASETS, 
  getBenchmarkIsothermDatasetById 
} from '../../lib/isotherm/benchmarkIsothermData';
import { 
  fitAllIsothermModels, 
  convertMoistureBasis, 
  computeStabilityZoneMetrics 
} from '../../lib/isotherm/isothermEngine';
import { generateIsothermScipyScript } from '../../lib/isotherm/scipyIsothermScript';
import { IsothermPoint, MoistureBasis } from '../../lib/isotherm/types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';
import { usePythonEngine } from '../../lib/python/usePythonEngine';

type ActiveSubTab = 'model_fitting' | 'stability_map' | 'data_editor' | 'scipy_runner';

export const MoistureIsothermSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveSubTab>('model_fitting');

  // Selected Benchmark Dataset
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('skim_milk_powder_20c');
  const selectedDataset = useMemo(() => {
    return getBenchmarkIsothermDatasetById(selectedDatasetId) || BENCHMARK_ISOTHERM_DATASETS[0];
  }, [selectedDatasetId]);

  // Current Working Moisture Basis
  const [moistureBasis, setMoistureBasis] = useState<MoistureBasis>('dry_basis');

  // Current Experimental Data Points (stored in dry basis internally)
  const [points, setPoints] = useState<IsothermPoint[]>(() => {
    return selectedDataset.points.map(p => ({ ...p }));
  });

  // Python Engine Integration
  const { runCode, status: pyStatus, outputChunks, clearOutput } = usePythonEngine();
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Handle Dataset Preset Change
  const handleSelectDataset = (id: string) => {
    setSelectedDatasetId(id);
    const ds = getBenchmarkIsothermDatasetById(id);
    if (ds) {
      setPoints(ds.points.map(p => ({ ...p })));
      setMoistureBasis('dry_basis');
    }
  };

  // Perform Model Fitting across all 6 models
  const fittingResults = useMemo(() => {
    try {
      return fitAllIsothermModels(points);
    } catch {
      return [];
    }
  }, [points]);

  const bestModel = useMemo(() => {
    return fittingResults[0] || null;
  }, [fittingResults]);

  // Stability Zone Metrics (Labuza Map)
  const stabilityMetrics = useMemo(() => {
    const m0Candidate = bestModel?.monolayerMoistureM0 || 
      fittingResults.find(m => m.monolayerMoistureM0 !== undefined)?.monolayerMoistureM0 || 
      6.0;
    return computeStabilityZoneMetrics(m0Candidate);
  }, [bestModel, fittingResults]);

  // Points modification handlers
  const handleAddPoint = () => {
    const lastP = points[points.length - 1];
    const newAw = lastP ? Math.min(0.95, lastP.waterActivity + 0.08) : 0.2;
    const newM = lastP ? lastP.moistureContent + 3.0 : 5.0;
    setPoints([...points, { waterActivity: newAw, moistureContent: newM }]);
  };

  const handleRemovePoint = (index: number) => {
    if (points.length <= 3) return;
    setPoints(points.filter((_, idx) => idx !== index));
  };

  const handleUpdatePoint = (index: number, field: 'waterActivity' | 'moistureContent', val: number) => {
    const updated = [...points];
    updated[index] = { ...updated[index], [field]: val };
    setPoints(updated);
  };

  // Basis toggle with live values conversion
  const handleToggleBasis = (newBasis: MoistureBasis) => {
    if (newBasis === moistureBasis) return;
    const converted = points.map(p => ({
      ...p,
      moistureContent: convertMoistureBasis(p.moistureContent, moistureBasis, newBasis)
    }));
    setMoistureBasis(newBasis);
    setPoints(converted);
  };

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = 'WaterActivity_aw,EquilibriumMoisture_' + (moistureBasis === 'dry_basis' ? 'Percent_db' : 'Percent_wb');
    const rows = points.map(p => `${p.waterActivity.toFixed(3)},${p.moistureContent.toFixed(2)}`).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `isotherm_${selectedDataset.id}_${moistureBasis}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Python SciPy Script
  const activeScipyCode = useMemo(() => {
    return generateIsothermScipyScript(points, selectedDataset.productNameFa);
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
      {/* 1. Header & Benchmark Dataset Selector Bar */}
      <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">بانک ایزوترم‌های رطوبتی معتبر (COST 90 & Labuza)</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">ISO / AACC</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-white">
              انتخاب ماده غذایی جهت برازش ایزوترم‌های جذب و دفع رطوبت
            </h3>
          </div>

          <div className="w-full md:w-96">
            <select
              value={selectedDatasetId}
              onChange={(e) => handleSelectDataset(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs sm:text-sm font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            >
              {BENCHMARK_ISOTHERM_DATASETS.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.productNameFa} ({ds.temperatureC}°C)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dataset Details Card */}
        <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400 block mb-0.5">طبقه‌بندی ایزوترم</span>
            <span className="font-bold text-stone-800 dark:text-stone-200 truncate block">
              {selectedDataset.isothermTypeClassification}
            </span>
          </div>

          <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400 block mb-0.5">دمای آزمون ایزوترم</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {selectedDataset.temperatureC.toFixed(1)} °C
            </span>
          </div>

          <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400 block mb-0.5">نوع فرآیند رطوبتی</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {selectedDataset.sorptionType === 'adsorption' ? 'جذب رطوبت (Adsorption)' : 'دفع رطوبت (Desorption)'}
            </span>
          </div>

          <div className="bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400 block mb-0.5">منبع مرجع معتبر</span>
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
            <Layers className="w-4 h-4" />
            <span>برازش و مقایسه ۶ مدل ایزوترم</span>
          </button>

          <button
            onClick={() => setActiveTab('stability_map')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'stability_map'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>رطوبت تک‌لایه و نقشه پایداری نگهداری</span>
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
            <span>جدول نقاط تجربی و تبدیل مبنا ({points.length} نقطه)</span>
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
          TAB 1: ISOTHERM MODEL FITTING & RANKING MATRIX
          ========================================================================= */}
      {activeTab === 'model_fitting' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          {bestModel && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white dark:bg-stone-900 border-2 border-rose-500/40 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">دقیق‌ترین مدل برازش‌یافته</span>
                <div className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 truncate">
                  {bestModel.modelNameFa}
                </div>
                <div className="text-xs font-mono text-stone-500 mt-1">
                  R² = {bestModel.rSquared.toFixed(4)} (E% = {bestModel.meanRelativeErrorPercent.toFixed(2)}%)
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">رطوبت تک‌لایه (m₀)</span>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-stone-900 dark:text-white">
                  {bestModel.monolayerMoistureM0 ? bestModel.monolayerMoistureM0.toFixed(2) : '—'}
                  <span className="text-xs font-normal text-stone-500 mr-1.5">% d.b.</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-1 truncate">
                  حداکثر پایداری اکسیداسیون چربی
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">ضریب چندلایه (K در GAB)</span>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                  {bestModel.parameters.K ? bestModel.parameters.K.value.toFixed(3) : '—'}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  ضریب تصحیح انرژی چندلایه به آب آزاد
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">ثابت انرژی گوگنهایم/بت (C)</span>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  {bestModel.parameters.C ? bestModel.parameters.C.value.toFixed(1) : '—'}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  شاخص شدت پیوند تک‌لایه به جاذب
                </div>
              </div>
            </div>
          )}

          {/* Model Ranking Matrix */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-600" />
                  <span>ماتریس مقایسه و رتبه‌بندی ۶ مدل ایزوترم جذب رطوبت</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  ارزیابی بر اساس ضریب تبیین (R²)، خطای RMSE و درصد میانگین انحراف نسبی (E% Modulus)
                </p>
              </div>

              <div className="text-xs font-semibold px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg">
                مبنای رطوبت فعلی: {moistureBasis === 'dry_basis' ? 'پایه خشک (% d.b.)' : 'پایه تر (% w.b.)'}
              </div>
            </div>

            <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 font-semibold">
                  <tr>
                    <th className="p-3 text-center w-12">رتبه</th>
                    <th className="p-3">نام مدل ایزوترم</th>
                    <th className="p-3">معادله ریاضیاتی</th>
                    <th className="p-3">ضریب تبیین (R²)</th>
                    <th className="p-3">خطای E%</th>
                    <th className="p-3">رطوبت تک‌لایه (m₀)</th>
                    <th className="p-3">پارامترهای استخراج‌شده</th>
                    <th className="p-3 text-center">کیفیت برازش</th>
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
                          {m.meanRelativeErrorPercent.toFixed(2)}%
                        </td>
                        <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">
                          {m.monolayerMoistureM0 ? `${m.monolayerMoistureM0.toFixed(2)} %` : '—'}
                        </td>
                        <td className="p-3 font-sans text-[11px] text-stone-600 dark:text-stone-400">
                          {Object.values(m.parameters).map(p => `${p.symbol}=${p.value.toFixed(2)}`).join(' | ')}
                        </td>
                        <td className="p-3 text-center font-sans">
                          <span className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                            m.fitQualityCategoryFa.includes('عالی') 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : m.fitQualityCategoryFa.includes('قابل قبول')
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {m.fitQualityCategoryFa}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SVG Interactive Isotherm Curve */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-rose-600" />
                <span>منحنی ایزوترم رطوبتی تعادلی (Sorption Isotherm Curve: m vs a_w)</span>
              </h5>
              <span className="text-xs font-mono text-stone-500">
                m ({moistureBasis === 'dry_basis' ? 'g H2O / 100g dry solids' : '% w.b.'}) vs a_w
              </span>
            </div>

            <div className="h-72 w-full bg-stone-50 dark:bg-stone-950/60 rounded-xl p-3 border border-stone-200 dark:border-stone-800 relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 520 240" preserveAspectRatio="none">
                {/* Horizontal Grid */}
                <line x1="40" y1="20" x2="500" y2="20" stroke="#e5e7eb" strokeDasharray="3 3" />
                <line x1="40" y1="75" x2="500" y2="75" stroke="#e5e7eb" strokeDasharray="3 3" />
                <line x1="40" y1="130" x2="500" y2="130" stroke="#e5e7eb" strokeDasharray="3 3" />
                <line x1="40" y1="185" x2="500" y2="185" stroke="#e5e7eb" strokeDasharray="3 3" />

                {/* Vertical aw lines */}
                <line x1="155" y1="20" x2="155" y2="200" stroke="#f3f4f6" strokeDasharray="2 2" />
                <line x1="270" y1="20" x2="270" y2="200" stroke="#f3f4f6" strokeDasharray="2 2" />
                <line x1="385" y1="20" x2="385" y2="200" stroke="#f3f4f6" strokeDasharray="2 2" />

                {/* Monolayer m0 reference line */}
                {bestModel?.monolayerMoistureM0 && (
                  (() => {
                    const maxM = Math.max(...points.map(p => p.moistureContent)) * 1.15;
                    const yM0 = 200 - (bestModel.monolayerMoistureM0 / Math.max(1, maxM)) * 180;
                    return (
                      <>
                        <line x1="40" y1={yM0} x2="500" y2={yM0} stroke="#6366f1" strokeDasharray="4 4" strokeWidth="1.5" />
                        <text x="505" y={yM0 + 3} fontSize="9" fill="#6366f1" textAnchor="start">
                          m₀ = {bestModel.monolayerMoistureM0.toFixed(1)}%
                        </text>
                      </>
                    );
                  })()
                )}

                {(() => {
                  const maxM = Math.max(...points.map(p => p.moistureContent)) * 1.15;

                  // Best model fitted curve path
                  let fittedPath = '';
                  if (bestModel && bestModel.fittedCurvePoints.length > 0) {
                    fittedPath = bestModel.fittedCurvePoints.map((p, idx) => {
                      const x = 40 + (p.aw / 1.0) * 460;
                      const y = 200 - (p.predictedM / Math.max(1, maxM)) * 180;
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ');
                  }

                  return (
                    <>
                      {fittedPath && (
                        <path d={fittedPath} fill="none" stroke="#e11d48" strokeWidth="2.5" />
                      )}

                      {/* Experimental Points */}
                      {points.map((p, idx) => {
                        const x = 40 + (p.waterActivity / 1.0) * 460;
                        const y = 200 - (p.moistureContent / Math.max(1, maxM)) * 180;
                        return (
                          <circle key={idx} cx={x} cy={y} r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                        );
                      })}
                    </>
                  );
                })()}

                {/* Axes labels */}
                <text x="35" y="25" fontSize="10" fill="#6b7280" textAnchor="end">m_max</text>
                <text x="35" y="200" fontSize="10" fill="#6b7280" textAnchor="end">0</text>
                <text x="40" y="215" fontSize="9" fill="#6b7280" textAnchor="middle">0.0</text>
                <text x="155" y="215" fontSize="9" fill="#6b7280" textAnchor="middle">0.25</text>
                <text x="270" y="215" fontSize="9" fill="#6b7280" textAnchor="middle">0.50</text>
                <text x="385" y="215" fontSize="9" fill="#6b7280" textAnchor="middle">0.75</text>
                <text x="500" y="215" fontSize="9" fill="#6b7280" textAnchor="middle">1.0</text>
                <text x="270" y="232" fontSize="10" fill="#6b7280" textAnchor="middle">فعالیت آبی محصول (Water Activity - a_w)</text>
              </svg>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs pt-1">
              <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                نقاط تجربی آزمایشگاهی
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                <span className="w-5 h-0.5 bg-rose-600 inline-block"></span>
                منحنی برازش مدل برتر ({bestModel?.modelNameEn})
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
                <span className="w-4 h-0.5 bg-indigo-600 border-b border-dashed inline-block"></span>
                خط رطوبت تک‌لایه (m₀)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MONOLAYER MOISTURE & FOOD STABILITY MAP
          ========================================================================= */}
      {activeTab === 'stability_map' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-5">
            <div>
              <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>نقشه پایداری فرآورده غذایی بر اساس دیاگرام جامع Labuza (Food Stability Map)</span>
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                تفسیر فیزیکوشیمیایی زون‌های سه‌گانه رطوبتی، رطوبت تک‌لایه (m₀) و پایداری در برابر اکسیداسیون، مایلارد و میکروب‌ها
              </p>
            </div>

            {/* 3 Water Activity Zones Visual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 dark:text-sky-200">زون ۱: آب متصل شیمیایی</span>
                  <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400">aw &lt; 0.25</span>
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  آب پیوندیافته شدید با پیوند هیدروژنی در گروه‌های قطبی یونیزه (پروتئین‌ها و کربوهیدرات‌ها). آب غیرقابل انجماد بوده و فاقد خاصیت حل‌کنندگی است.
                </div>
                <div className="pt-2 text-[11px] font-semibold text-rose-700 dark:text-rose-400 border-t border-sky-200 dark:border-sky-800/60">
                  ⚠️ هشدار: در رطوبت‌های کمتر از m₀، سرعت اکسیداسیون چربی به شدت بالا می‌رود!
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">زون ۲: آب چندلایه (بهینه)</span>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">0.25 &lt;= aw &lt;= 0.70</span>
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  لایه دوم و سوم آب با پیوندهای هیدروژنی آب-آب. در این بازه ساختار پلاستیسیته پیدا کرده و واکنش‌های قهوه‌ای شدن غیرآنزیمی مایلارد به حداکثر می‌رسد.
                </div>
                <div className="pt-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border-t border-emerald-200 dark:border-emerald-800/60">
                  ✅ نقطه m₀ (رطوبت تک‌لایه) پایدارترین نقطه نگهداری فرآورده‌های خشک است.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">زون ۳: آب آزاد و مویین</span>
                  <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">aw &gt; 0.70</span>
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  آب آزاد محبوس در ریزحفرات و ماکروحفرات. انحلال کامل ترکیبات محلول، فعالیت شدید آنزیمی و رشد انواع میکروارگانیسم‌ها (کپک، مخمر و باکتری).
                </div>
                <div className="pt-2 text-[11px] font-semibold text-amber-800 dark:text-amber-400 border-t border-amber-200 dark:border-amber-800/60">
                  🛑 حد بحرانی: رشد کپک‌ها در aw بالای ۰.۶۵ و باکتری‌ها بالای ۰.۹۰ رخ می‌دهد.
                </div>
              </div>
            </div>

            {/* Degradation Reaction Notes */}
            <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl border border-stone-200 dark:border-stone-700/60 text-xs space-y-2.5">
              <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>تحلیل نرخ واکنش‌های زوال کیفیت بر اساس رطوبت تک‌لایه ({stabilityMetrics.monolayerMoistureM0.toFixed(2)} % d.b.)</span>
              </span>
              <ul className="list-disc list-inside space-y-1.5 text-stone-600 dark:text-stone-300">
                <li><strong>اکسیداسیون لیپیدها:</strong> {stabilityMetrics.lipidOxidationNoteFa}</li>
                <li><strong>قهوه‌ای شدن مایلارد:</strong> {stabilityMetrics.maillardBrowningNoteFa}</li>
                <li><strong>پایداری میکروبیولوژیکی:</strong> {stabilityMetrics.microbialGrowthNoteFa}</li>
                <li><strong>رفتار کلوخه‌شدن و افت تردی:</strong> {selectedDataset.criticalStabilityAwFa}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: DATA EDITOR & BASIS CONVERTER
          ========================================================================= */}
      {activeTab === 'data_editor' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  <span>ویرایشگر نقاط تجربی فعالیت آبی و رطوبت تعادلی (a_w vs Moisture)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  امکان تغییر مبنای رطوبت بین پایه خشک (% d.b.) و پایه تر (% w.b.) با تبدیل خودکار مقادیر
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Basis Switcher */}
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => handleToggleBasis('dry_basis')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      moistureBasis === 'dry_basis'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    پایه خشک (% d.b.)
                  </button>
                  <button
                    onClick={() => handleToggleBasis('wet_basis')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      moistureBasis === 'wet_basis'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    پایه تر (% w.b.)
                  </button>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>خروجی CSV</span>
                </button>

                <button
                  onClick={handleAddPoint}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن نقطه</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 font-semibold">
                  <tr>
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3">فعالیت آبی (Water Activity - a_w)</th>
                    <th className="p-3">رطوبت تعادلی ({moistureBasis === 'dry_basis' ? '% d.b. (g/100g)' : '% w.b.'})</th>
                    <th className="p-3">رطوبت در مبنای مقابل ({moistureBasis === 'dry_basis' ? '% w.b.' : '% d.b.'})</th>
                    <th className="p-3 w-16 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-mono">
                  {points.map((pt, idx) => {
                    const oppositeBasisVal = convertMoistureBasis(
                      pt.moistureContent,
                      moistureBasis,
                      moistureBasis === 'dry_basis' ? 'wet_basis' : 'dry_basis'
                    );
                    return (
                      <tr key={idx} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40">
                        <td className="p-3 text-center text-stone-400 font-sans">{idx + 1}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max="0.99"
                            value={pt.waterActivity}
                            onChange={(e) => handleUpdatePoint(idx, 'waterActivity', parseFloat(e.target.value) || 0.1)}
                            className="w-28 px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={pt.moistureContent}
                            onChange={(e) => handleUpdatePoint(idx, 'moistureContent', parseFloat(e.target.value) || 0.1)}
                            className="w-28 px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                          />
                        </td>
                        <td className="p-3 font-bold text-stone-600 dark:text-stone-300">
                          {oppositeBasisVal.toFixed(2)} %
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
                  <span>اجرای برازش ایزوترم‌ها با ماژول scipy.optimize.curve_fit</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  کد پایتون زیر با الگوریتم غیرخطی لونبرگ-مارکوارت در Web Worker مرورگر بدون قفل شدن رابط کاربری اجرا می‌شود.
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
                    <Droplets className="w-4 h-4 text-emerald-600" />
                    <span>خروجی برازش ایزوترم‌ها با SciPy (خروجی مستقیم پایتون):</span>
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
