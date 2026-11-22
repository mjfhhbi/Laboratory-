import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Layers, 
  DollarSign, 
  Scale, 
  Sliders, 
  Play, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  BookmarkCheck, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ArrowRightLeft, 
  Activity, 
  BookOpen, 
  Calendar,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { 
  BENCHMARK_FORMULATION_PROBLEMS, 
  getBenchmarkProblemById 
} from '../../lib/optimization/benchmarkFormulations';
import { 
  solveFormulationLP 
} from '../../lib/optimization/simplexSolver';
import { 
  generateScipyLinprogScript 
} from '../../lib/optimization/scipyLinprogScript';
import { 
  FormulationProblem, 
  FormulationIngredient, 
  FormulationNutrientConstraint, 
  SavedFormulation 
} from '../../lib/optimization/types';
import { usePythonEngine } from '../../lib/python/usePythonEngine';

type ActiveSubTab = 
  | 'optimal_recipe' 
  | 'ingredients_editor' 
  | 'constraints_editor' 
  | 'sensitivity' 
  | 'comparison' 
  | 'scipy_sandbox';

export const FormulationOptimizerSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveSubTab>('optimal_recipe');

  // Selected Benchmark Problem
  const [selectedProblemId, setSelectedProblemId] = useState<string>('sausage_60_inso2303');
  const baseProblem = useMemo(() => {
    return getBenchmarkProblemById(selectedProblemId) || BENCHMARK_FORMULATION_PROBLEMS[0];
  }, [selectedProblemId]);

  // Working problem state (fully editable by user)
  const [currentProblem, setCurrentProblem] = useState<FormulationProblem>(() => ({
    ...baseProblem,
    ingredients: baseProblem.ingredients.map(ing => ({ ...ing })),
    constraints: baseProblem.constraints.map(c => ({ ...c }))
  }));

  // Batch size input
  const [batchSizeKg, setBatchSizeKg] = useState<number>(100);

  // Saved formulations for side-by-side comparison
  const [savedFormulations, setSavedFormulations] = useState<SavedFormulation[]>([]);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Python Engine execution
  const { runCode, status: pyStatus, outputChunks, clearOutput } = usePythonEngine();
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Reset to benchmark preset
  const handlePresetSelect = (problemId: string) => {
    setSelectedProblemId(problemId);
    const found = getBenchmarkProblemById(problemId);
    if (found) {
      setCurrentProblem({
        ...found,
        ingredients: found.ingredients.map(ing => ({ ...ing })),
        constraints: found.constraints.map(c => ({ ...c }))
      });
      setBatchSizeKg(found.batchSizeKg);
    }
  };

  // Run Simplex LP Optimization Engine
  const optimizationResult = useMemo(() => {
    return solveFormulationLP({
      ...currentProblem,
      batchSizeKg
    });
  }, [currentProblem, batchSizeKg]);

  // Generate Python SciPy Code
  const generatedPythonScript = useMemo(() => {
    return generateScipyLinprogScript({
      ...currentProblem,
      batchSizeKg
    });
  }, [currentProblem, batchSizeKg]);

  // Copy code handler
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedPythonScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Run Python in WebWorker
  const handleRunPython = () => {
    runCode(generatedPythonScript);
  };

  // Save current formulation
  const handleSaveFormulation = () => {
    if (!optimizationResult.isFeasible) return;
    const newSaved: SavedFormulation = {
      id: `saved_${Date.now()}`,
      title: `${currentProblem.nameFa} (${new Date().toLocaleDateString('fa-IR')})`,
      problemId: currentProblem.id,
      dateSaved: new Date().toISOString().split('T')[0],
      totalCostPerKg: optimizationResult.totalCostPerKg,
      calculatedNutrition: { ...optimizationResult.calculatedNutrition },
      ingredientShares: optimizationResult.ingredientShares.map(s => ({ ...s }))
    };
    setSavedFormulations(prev => [newSaved, ...prev]);
    setSavedSuccessMsg('فرمولاسیون با موفقیت در حافظه محلی ذخیره شد.');
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  // Update ingredient property
  const handleUpdateIngredient = (idx: number, field: keyof FormulationIngredient, value: any) => {
    setCurrentProblem(prev => {
      const updated = [...prev.ingredients];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, ingredients: updated };
    });
  };

  // Add new blank ingredient
  const handleAddIngredient = () => {
    const newIng: FormulationIngredient = {
      id: `custom_ing_${Date.now()}`,
      nameFa: 'ماده اولیه جدید',
      nameEn: 'New Custom Ingredient',
      categoryFa: 'افزودنی و نمک',
      costPerKg: 50000,
      costCurrency: 'تومان',
      priceDate: new Date().toISOString().split('T')[0],
      proteinPercent: 0,
      fatPercent: 0,
      moisturePercent: 10,
      ashPercent: 1,
      carbohydratePercent: 0,
      sodiumMgPer100g: 0,
      minPercent: 0,
      maxPercent: 20,
      compositionSource: 'ورودی کاربر'
    };
    setCurrentProblem(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIng]
    }));
  };

  // Remove ingredient
  const handleRemoveIngredient = (idx: number) => {
    if (currentProblem.ingredients.length <= 2) {
      alert('حداقل دو ماده اولیه برای حل برنامه‌ریزی خطی لازم است.');
      return;
    }
    setCurrentProblem(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== idx)
    }));
  };

  // Update constraint property
  const handleUpdateConstraint = (idx: number, field: keyof FormulationNutrientConstraint, value: any) => {
    setCurrentProblem(prev => {
      const updated = [...prev.constraints];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, constraints: updated };
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-stone-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 -ml-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>موتور بهینه‌سازی فرمولاسیون کمترین هزینه (Least-Cost Formulation LP)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              بهینه‌سازی فرمولاسیون صنایع غذایی با برنامه‌ریزی خطی (Linear Programming) و سیمپلکس
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              حداقل‌سازی هزینه تمام‌شده فرمولاسیون با رعایت ۱۰۰٪ استانداردهای ملی ایران (INSO) و کدکس بین‌المللی،
              موازنه جرم دقیق اجزا، تحلیل امکان‌پذیری و شناسایی قیود متناقض و بهینه‌سازی موازی با حلگر HiGHS در پایتون
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              حلگر سیمپلکس دو فازی
            </span>
          </div>
        </div>
      </div>

      {/* Preset Problem Selector & Batch Controls */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 whitespace-nowrap">
            انتخاب محصول و استاندارد مرجع:
          </label>
          <select
            value={selectedProblemId}
            onChange={(e) => handlePresetSelect(e.target.value)}
            className="bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto"
          >
            {BENCHMARK_FORMULATION_PROBLEMS.map(p => (
              <option key={p.id} value={p.id}>
                {p.nameFa}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 whitespace-nowrap">
            اندازه بچ تولید (Batch Size):
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              max="50000"
              value={batchSizeKg}
              onChange={(e) => setBatchSizeKg(Math.max(1, parseFloat(e.target.value) || 1))}
              className="w-24 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-center"
            />
            <span className="text-xs text-stone-500 font-mono">kg</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-1.5 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'optimal_recipe', labelFa: 'فرمولاسیون بهینه و ترکیب نهایی', icon: Scale },
            { id: 'ingredients_editor', labelFa: 'بانک و قیمت مواد اولیه', icon: DollarSign },
            { id: 'constraints_editor', labelFa: 'محدودیت‌های استاندارد و تغذیه‌ای', icon: ShieldCheck },
            { id: 'sensitivity', labelFa: 'تحلیل حساسیت و قیمت‌های سایه', icon: Sliders },
            { id: 'comparison', labelFa: 'مقایسه فرمول‌های ذخیره‌شده', icon: ArrowRightLeft },
            { id: 'scipy_sandbox', labelFa: 'کد پایتون و SciPy Linprog', icon: Play }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveSubTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
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

      {/* Save Success Alert */}
      {savedSuccessMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* =========================================================================
          TAB 1: OPTIMAL RECIPE & NUTRITIONAL PROFILE
          ========================================================================= */}
      {activeTab === 'optimal_recipe' && (
        <div className="space-y-6">
          {/* Status Alert if Infeasible */}
          {!optimizationResult.isFeasible && optimizationResult.infeasibility && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>فرمولاسیون غیرممکن (Infeasible): قیود متناقض شناسایی شدند!</span>
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                {optimizationResult.infeasibility.failureReasonFa}
              </p>
              
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="font-semibold text-rose-900 dark:text-rose-100">دلایل تعارض و تناقض:</div>
                <ul className="list-disc list-inside space-y-1 text-rose-800 dark:text-rose-300 pr-2">
                  {optimizationResult.infeasibility.conflictingConstraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="font-semibold text-stone-800 dark:text-stone-200">پیشنهادات اصلاحی حلگر:</div>
                <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300 pr-2">
                  {optimizationResult.infeasibility.suggestedCorrectionsFa.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {optimizationResult.isFeasible && (
            <>
              {/* Primary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-100/70 dark:from-emerald-950/40 dark:to-stone-900 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4">
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    قیمت تمام‌شده هر کیلوگرم:
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-900 dark:text-emerald-100 mt-1">
                    {optimizationResult.totalCostPerKg.toLocaleString('fa-IR')}
                    <span className="text-xs font-normal mr-1">{optimizationResult.costCurrency}</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    کمترین هزینه ممکن با رعایت ۱۰۰٪ قیود
                  </div>
                </div>

                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4">
                  <div className="text-[11px] font-semibold text-stone-500">
                    هزینه کل به ازای بچ {batchSizeKg} کیلویی:
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-stone-800 dark:text-stone-200 mt-1">
                    {(optimizationResult.totalCostBatch / 1000000).toFixed(2)}
                    <span className="text-xs font-normal mr-1">میلیون تومان</span>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
                    {optimizationResult.totalCostBatch.toLocaleString('fa-IR')} تومان
                  </div>
                </div>

                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4">
                  <div className="text-[11px] font-semibold text-stone-500">
                    موازنه جرم کل اجزا:
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-stone-800 dark:text-stone-200 mt-1">
                    {optimizationResult.totalPercentage.toFixed(1)}%
                    <span className="text-xs font-normal text-emerald-600 mr-1">✓ متعادل</span>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    تعداد تکرار سیمپلکس: {optimizationResult.iterationsCount}
                  </div>
                </div>

                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="text-[11px] font-semibold text-stone-500">
                    ذخیره و ثبت فرمولاسیون:
                  </div>
                  <button
                    onClick={handleSaveFormulation}
                    className="w-full mt-2 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>ذخیره جهت مقایسه</span>
                  </button>
                </div>
              </div>

              {/* Recipe Table */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-emerald-600" />
                      ترکیب بهینه فرمولاسیون و مقادیر بچ تولید ({batchSizeKg} kg)
                    </h3>
                    <p className="text-xs text-stone-500">
                      محاسبه دقیق سهم درصدی، وزن مورد نیاز در بچ و سهم هزینه هر ماده اولیه
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 text-[11px]">
                        <th className="py-2.5 px-3 font-semibold">ماده اولیه</th>
                        <th className="py-2.5 px-3 font-semibold">قیمت واحد</th>
                        <th className="py-2.5 px-3 font-semibold">درصد در فرمول (%)</th>
                        <th className="py-2.5 px-3 font-semibold">مقدار در بچ ({batchSizeKg} kg)</th>
                        <th className="py-2.5 px-3 font-semibold">سهم هزینه در هر kg</th>
                        <th className="py-2.5 px-3 font-semibold">درصد از کل هزینه</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                      {optimizationResult.ingredientShares.map((share, idx) => {
                        const isUsed = share.percentage > 0.01;
                        return (
                          <tr 
                            key={idx}
                            className={isUsed ? 'hover:bg-stone-50/80 dark:hover:bg-stone-800/40' : 'opacity-40 bg-stone-50/40'}
                          >
                            <td className="py-2.5 px-3 font-sans font-bold text-stone-800 dark:text-stone-200">
                              {share.nameFa}
                              {!isUsed && <span className="text-[10px] text-stone-400 mr-2 font-normal">(مصرف نشده)</span>}
                            </td>
                            <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400">
                              {share.costPerKg.toLocaleString('fa-IR')}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-emerald-800 dark:text-emerald-300">
                              {share.percentage.toFixed(2)}%
                            </td>
                            <td className="py-2.5 px-3 font-bold text-stone-900 dark:text-stone-100">
                              {share.batchQuantityKg.toFixed(2)} kg
                            </td>
                            <td className="py-2.5 px-3 text-stone-700 dark:text-stone-300">
                              {share.costContribution.toLocaleString('fa-IR')} تومان
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-emerald-600 h-full rounded-full" 
                                    style={{ width: `${Math.min(100, share.costPercentOfTotal)}%` }} 
                                  />
                                </div>
                                <span className="text-stone-600 dark:text-stone-400 text-[11px]">{share.costPercentOfTotal.toFixed(1)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-stone-300 dark:border-stone-700 font-bold bg-stone-50/80 dark:bg-stone-800/50">
                        <td className="py-3 px-3 font-sans">مجموع کل فرمولاسیون</td>
                        <td className="py-3 px-3">-</td>
                        <td className="py-3 px-3 font-mono text-emerald-700 dark:text-emerald-400">
                          {optimizationResult.totalPercentage.toFixed(2)}%
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {batchSizeKg.toFixed(2)} kg
                        </td>
                        <td className="py-3 px-3 font-mono text-emerald-800 dark:text-emerald-200">
                          {optimizationResult.totalCostPerKg.toLocaleString('fa-IR')} تومان
                        </td>
                        <td className="py-3 px-3 font-mono">۱۰۰٪</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Nutritional Profile Verification Card */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      آنالیز تقریبی و اعتبارسنجی استانداردهای تغذیه‌ای و قانونی
                    </h3>
                    <p className="text-xs text-stone-500">
                      مقایسه ارزش غذایی محاسبه‌شده فرمول نهایی با حدود الزامی استاندارد {currentProblem.standardReference}
                    </p>
                  </div>
                  <div className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400">
                    انرژی: {optimizationResult.calculatedNutrition.caloriesKcal} kcal / 100g
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {optimizationResult.constraintChecks.map((check) => {
                    const isPassed = check.status === 'passed';
                    return (
                      <div 
                        key={check.constraintId}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isPassed 
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50' 
                            : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {check.nameFa}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isPassed 
                              ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isPassed ? 'مطابق استاندارد' : 'مغایر با حد مجاز'}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between mt-2 font-mono">
                          <span className="text-lg font-black text-stone-900 dark:text-stone-100">
                            {check.actualValue.toFixed(2)}
                            <span className="text-xs font-normal text-stone-500 mr-1">{check.unit}</span>
                          </span>

                          <span className="text-xs text-stone-500">
                            {check.minValue !== undefined && `حداقل: ${check.minValue} `}
                            {check.maxValue !== undefined && `حداکثر: ${check.maxValue}`}
                          </span>
                        </div>

                        <div className="text-[10px] text-stone-400 mt-1 font-mono">
                          فاصله تا حد بحرانی (Slack): {check.slackOrSurplus > 0 ? `+${check.slackOrSurplus}` : check.slackOrSurplus} {check.unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: INGREDIENTS & PRICES EDITOR
          ========================================================================= */}
      {activeTab === 'ingredients_editor' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                بانک مواد اولیه، قیمت‌های روز و ترکیبات تقریبی (Proximate Analysis)
              </h3>
              <p className="text-xs text-stone-500">
                تعریف درصد پروتئین، چربی، رطوبت، نشاسته، نمک و محدوده حداقل و حداکثر مجاز مصرف
              </p>
            </div>

            <button
              onClick={handleAddIngredient}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن ماده اولیه جدید</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 text-[11px]">
                  <th className="py-2 px-2.5 font-semibold min-w-[140px]">نام ماده اولیه</th>
                  <th className="py-2 px-2.5 font-semibold min-w-[100px]">قیمت (تومان/kg)</th>
                  <th className="py-2 px-2 font-semibold">تاریخ قیمت</th>
                  <th className="py-2 px-2 font-semibold">پروتئین %</th>
                  <th className="py-2 px-2 font-semibold">چربی %</th>
                  <th className="py-2 px-2 font-semibold">رطوبت %</th>
                  <th className="py-2 px-2 font-semibold">خاکستر %</th>
                  <th className="py-2 px-2 font-semibold">کربوهیدرات %</th>
                  <th className="py-2 px-2 font-semibold">سدیم (mg)</th>
                  <th className="py-2 px-2 font-semibold">حداقل %</th>
                  <th className="py-2 px-2 font-semibold">حداکثر %</th>
                  <th className="py-2 px-2 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                {currentProblem.ingredients.map((ing, idx) => (
                  <tr key={ing.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30">
                    <td className="py-2 px-2.5">
                      <input
                        type="text"
                        value={ing.nameFa}
                        onChange={(e) => handleUpdateIngredient(idx, 'nameFa', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-stone-300 focus:border-emerald-500 font-sans font-bold text-stone-800 dark:text-stone-200 px-1 py-0.5 text-xs focus:outline-hidden"
                      />
                    </td>
                    <td className="py-2 px-2.5">
                      <input
                        type="number"
                        value={ing.costPerKg}
                        onChange={(e) => handleUpdateIngredient(idx, 'costPerKg', parseFloat(e.target.value) || 0)}
                        className="w-24 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md px-1.5 py-1 text-xs font-mono"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="date"
                        value={ing.priceDate}
                        onChange={(e) => handleUpdateIngredient(idx, 'priceDate', e.target.value)}
                        className="bg-transparent text-[10px] text-stone-500 border border-stone-200 dark:border-stone-700 rounded px-1 py-0.5"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        value={ing.proteinPercent}
                        onChange={(e) => handleUpdateIngredient(idx, 'proteinPercent', parseFloat(e.target.value) || 0)}
                        className="w-14 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded px-1 py-0.5 text-xs"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        value={ing.fatPercent}
                        onChange={(e) => handleUpdateIngredient(idx, 'fatPercent', parseFloat(e.target.value) || 0)}
                        className="w-14 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded px-1 py-0.5 text-xs"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        value={ing.moisturePercent}
                        onChange={(e) => handleUpdateIngredient(idx, 'moisturePercent', parseFloat(e.target.value) || 0)}
                        className="w-14 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded px-1 py-0.5 text-xs"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        value={ing.ashPercent}
                        onChange={(e) => handleUpdateIngredient(idx, 'ashPercent', parseFloat(e.target.value) || 0)}
                        className="w-14 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded px-1 py-0.5 text-xs"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        value={ing.carbohydratePercent}
                        onChange={(e) => handleUpdateIngredient(idx, 'carbohydratePercent', parseFloat(e.target.value) || 0)}
                        className="w-14 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded px-1 py-0.5 text-xs"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={ing.sodiumMgPer100g}
                        onChange={(e) => handleUpdateIngredient(idx, 'sodiumMgPer100g', parseFloat(e.target.value) || 0)}
                        className="w-16 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded px-1 py-0.5 text-xs"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.5"
                        value={ing.minPercent}
                        onChange={(e) => handleUpdateIngredient(idx, 'minPercent', parseFloat(e.target.value) || 0)}
                        className="w-14 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded px-1 py-0.5 text-xs font-bold text-amber-700"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.5"
                        value={ing.maxPercent}
                        onChange={(e) => handleUpdateIngredient(idx, 'maxPercent', parseFloat(e.target.value) || 100)}
                        className="w-14 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded px-1 py-0.5 text-xs font-bold text-cyan-700"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleRemoveIngredient(idx)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                        title="حذف ماده"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: NUTRITIONAL & REGULATORY CONSTRAINTS EDITOR
          ========================================================================= */}
      {activeTab === 'constraints_editor' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              محدودیت‌های استاندارد ملی ایران (INSO) و ضوابط کدکس
            </h3>
            <p className="text-xs text-stone-500">
              مرجع استاندارد: {currentProblem.standardReference}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentProblem.constraints.map((c, idx) => (
              <div 
                key={c.id}
                className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200">
                    {c.nameFa}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {c.nutrientKey} ({c.unit})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">حداقل مجاز (Min):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={c.minValue ?? ''}
                      placeholder="بدون حد"
                      onChange={(e) => handleUpdateConstraint(
                        idx, 
                        'minValue', 
                        e.target.value === '' ? undefined : parseFloat(e.target.value)
                      )}
                      className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-1.5 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">حداکثر مجاز (Max):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={c.maxValue ?? ''}
                      placeholder="بدون حد"
                      onChange={(e) => handleUpdateConstraint(
                        idx, 
                        'maxValue', 
                        e.target.value === '' ? undefined : parseFloat(e.target.value)
                      )}
                      className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-1.5 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-stone-500 dark:text-stone-400">
                  <span className="font-semibold">مرجع قانونی: </span>
                  {c.standardSourceFa}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: SENSITIVITY ANALYSIS & SHADOW PRICES
          ========================================================================= */}
      {activeTab === 'sensitivity' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-5">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-600" />
              تحلیل حساسیت، قیمت‌های سایه (Shadow Prices) و هزینه کاهش‌یافته (Reduced Costs)
            </h3>
            <p className="text-xs text-stone-500">
              ارزیابی اثر تغییر قیمت مواد اولیه یا تعدیل استانداردهای تغذیه‌ای بر هزینه تمام‌شده هر کیلوگرم محصول
            </p>
          </div>

          {/* Shadow Prices of Constraints */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">
              قیمت‌های سایه قیود فعال استاندارد (Dual Variables):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {optimizationResult.shadowPrices.length > 0 ? (
                optimizationResult.shadowPrices.map((sp, idx) => (
                  <div key={idx} className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-stone-800 dark:text-stone-200">{sp.constraintNameFa}</span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-400">
                        {sp.shadowPrice.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                      {sp.interpretationFa}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-stone-500 p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl col-span-2">
                  قیود در وضعیت متعادل آزاد قرار دارند و هیچ قیدی در آستانه بحرانی هزینه قرار ندارد.
                </div>
              )}
            </div>
          </div>

          {/* Reduced Costs of Excluded Ingredients */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">
              هزینه کاهش‌یافته مواد اولیه مصرف‌نشده (Reduced Costs):
            </h4>
            <p className="text-[11px] text-stone-500">
              این شاخص نشان می‌دهد که قیمت هر کیلوگرم از ماده اولیه مصرف‌نشده چقدر باید ارزان‌تر شود تا ورود آن به فرمول توجیه اقتصادی پیدا کند.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 text-[11px]">
                    <th className="py-2 px-3 font-semibold">ماده اولیه</th>
                    <th className="py-2 px-3 font-semibold">وضعیت در فرمول</th>
                    <th className="py-2 px-3 font-semibold">قیمت فعلی</th>
                    <th className="py-2 px-3 font-semibold">کاهش قیمت مورد نیاز (Reduced Cost)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                  {optimizationResult.ingredientShares.map((ing, idx) => {
                    const isUsed = ing.percentage > 0.01;
                    return (
                      <tr key={idx} className={isUsed ? 'bg-emerald-50/20' : ''}>
                        <td className="py-2.5 px-3 font-sans font-bold text-stone-800 dark:text-stone-200">
                          {ing.nameFa}
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          {isUsed ? (
                            <span className="text-emerald-700 font-semibold">مصرف در فرمول ({ing.percentage.toFixed(1)}%)</span>
                          ) : (
                            <span className="text-stone-400">مصرف نشده (گران)</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400">
                          {ing.costPerKg.toLocaleString('fa-IR')} تومان
                        </td>
                        <td className="py-2.5 px-3 font-bold text-rose-700 dark:text-rose-400">
                          {isUsed ? '۰ (در نقطه بهینه)' : `${Math.abs(Math.round(ing.reducedCost || 0)).toLocaleString('fa-IR')} تومان`}
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
          TAB 5: SAVED FORMULATIONS COMPARISON
          ========================================================================= */}
      {activeTab === 'comparison' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                مقایسه فرمولاسیون‌های ذخیره‌شده و تحلیل اختلاف هزینه و ارزش غذایی
              </h3>
              <p className="text-xs text-stone-500">
                مقایسه سناریوهای مختلف قیمت مواد اولیه، تغییر استانداردها یا تغییر درصدهای پایه
              </p>
            </div>
            {savedFormulations.length > 0 && (
              <button
                onClick={() => setSavedFormulations([])}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>پاک کردن تمام فرمول‌ها</span>
              </button>
            )}
          </div>

          {savedFormulations.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-500 text-xs">
              هنوز فرمولی ذخیره نشده است. در تب "فرمولاسیون بهینه" دکمه "ذخیره جهت مقایسه" را بزنید.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 text-[11px]">
                    <th className="py-2 px-3 font-semibold">عنوان فرمولاسیون</th>
                    <th className="py-2 px-3 font-semibold">تاریخ ذخیره</th>
                    <th className="py-2 px-3 font-semibold">قیمت تمام‌شده (تومان/kg)</th>
                    <th className="py-2 px-3 font-semibold">پروتئین %</th>
                    <th className="py-2 px-3 font-semibold">چربی %</th>
                    <th className="py-2 px-3 font-semibold">رطوبت %</th>
                    <th className="py-2 px-3 font-semibold">انرژی (kcal)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                  {savedFormulations.map((sf) => (
                    <tr key={sf.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                      <td className="py-2.5 px-3 font-sans font-bold text-stone-800 dark:text-stone-200">
                        {sf.title}
                      </td>
                      <td className="py-2.5 px-3 text-stone-500 font-sans">
                        {sf.dateSaved}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-800 dark:text-emerald-300">
                        {sf.totalCostPerKg.toLocaleString('fa-IR')}
                      </td>
                      <td className="py-2.5 px-3">{sf.calculatedNutrition.protein.toFixed(1)}%</td>
                      <td className="py-2.5 px-3">{sf.calculatedNutrition.fat.toFixed(1)}%</td>
                      <td className="py-2.5 px-3">{sf.calculatedNutrition.moisture.toFixed(1)}%</td>
                      <td className="py-2.5 px-3">{sf.calculatedNutrition.caloriesKcal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 6: SCIPY & PYTHON WEBWORKER EXECUTION
          ========================================================================= */}
      {activeTab === 'scipy_sandbox' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Play className="w-4 h-4 text-emerald-600" />
                اجرای حلگر سیمپلکس HiGHS با ماژول scipy.optimize.linprog در پایتون
              </h3>
              <p className="text-[11px] text-stone-500">
                کد پایتون خودکفا برای بهینه‌سازی فرمولاسیون با الگوریتم HiGHS Primal-Dual Simplex در وب‌ورکر مرورگر
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'کپی شد' : 'کپی کد Python'}</span>
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

          {/* WebWorker Console Output */}
          {outputChunks.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>خروجی ترمینال پایتون و حلگر HiGHS:</span>
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
    </div>
  );
};
