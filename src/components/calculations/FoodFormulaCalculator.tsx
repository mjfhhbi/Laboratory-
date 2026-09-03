import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Copy, 
  Check, 
  Layers,
  ArrowRight,
  Sparkles,
  Sliders,
  Scale
} from 'lucide-react';
import { 
  DEFAULT_FOOD_FORMULAS 
} from '../../lib/calculations/foodFormulas';
import { 
  runFormulaCalculation, 
  getAllFormulas 
} from '../../lib/calculations/calculationEngine';
import { FormulaDefinition, CalculationResult } from '../../types/calculations';

export const FoodFormulaCalculator: React.FC = () => {
  const allFormulas = useMemo(() => getAllFormulas(), []);
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('moisture_oven');
  const [inputs, setInputs] = useState<Record<string, number | undefined>>({
    m0: 20.1542,
    m1: 25.1542,
    m2: 24.4042
  });
  const [inputUnits, setInputUnits] = useState<Record<string, string>>({});
  const [decimals, setDecimals] = useState<number>(2);
  const [sigFigs, setSigFigs] = useState<number | undefined>(undefined);
  const [precisionMode, setPrecisionMode] = useState<'decimals' | 'sigFigs'>('decimals');
  const [showTrace, setShowTrace] = useState<boolean>(true);
  const [copiedTrace, setCopiedTrace] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentFormula = useMemo<FormulaDefinition | undefined>(() => {
    return allFormulas.find(f => f.id === selectedFormulaId) || DEFAULT_FOOD_FORMULAS[selectedFormulaId];
  }, [allFormulas, selectedFormulaId]);

  // When formula changes, initialize default values
  const handleSelectFormula = (formula: FormulaDefinition) => {
    setSelectedFormulaId(formula.id);
    setDecimals(formula.defaultDecimals || 2);
    setSigFigs(undefined);
    setPrecisionMode('decimals');
    
    const initialInputs: Record<string, number | undefined> = {};
    const initialUnits: Record<string, string> = {};

    formula.variables.forEach(v => {
      initialInputs[v.id] = v.defaultValue;
      initialUnits[v.id] = v.defaultUnit;
    });

    if (formula.constants) {
      formula.constants.forEach(c => {
        initialInputs[c.id] = c.value;
      });
    }

    setInputs(initialInputs);
    setInputUnits(initialUnits);
  };

  const handleInputChange = (id: string, valStr: string) => {
    const parsed = valStr === '' ? undefined : parseFloat(valStr);
    setInputs(prev => ({ ...prev, [id]: parsed }));
  };

  const handleUnitChange = (id: string, unit: string) => {
    setInputUnits(prev => ({ ...prev, [id]: unit }));
  };

  const handleResetInputs = () => {
    if (currentFormula) {
      handleSelectFormula(currentFormula);
    }
  };

  // Run calculation
  const result = useMemo<CalculationResult | null>(() => {
    if (!currentFormula) return null;
    return runFormulaCalculation(selectedFormulaId, inputs, {
      decimals,
      significantFigures: precisionMode === 'sigFigs' ? sigFigs : undefined,
      inputUnits
    });
  }, [currentFormula, selectedFormulaId, inputs, decimals, sigFigs, precisionMode, inputUnits]);

  const filteredFormulas = useMemo(() => {
    if (selectedCategory === 'all') return allFormulas;
    return allFormulas.filter(f => f.category === selectedCategory);
  }, [allFormulas, selectedCategory]);

  const handleCopyTrace = () => {
    if (!result || !currentFormula) return;
    const text = [
      `گزارش محاسبات آزمایشگاهی: ${currentFormula.nameFa}`,
      `استاندارد مرجع: ${currentFormula.standardReference}`,
      `فرمول: ${currentFormula.expressionDisplay}`,
      `نتیجه نهایی: ${result.formattedValue} ${result.unit}`,
      `دقت: ${precisionMode === 'sigFigs' ? `${sigFigs} رقم معنی‌دار` : `${decimals} رقم اعشار`}`,
      `تأییدیه علمی: ${result.isScientificallyValid ? 'معتبر و دارای رفرنس استاندارد' : 'فاقد استناد رسمی'}`,
      '--- مراحل محاسبه و ردپای ریاضی (Trace) ---',
      ...result.trace.map(t => `گام ${t.stepNumber} [${t.titleFa}]: ${t.expression} => ${t.substitutedExpression} = ${t.intermediateValue} ${t.unit}`)
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedTrace(true);
    setTimeout(() => setCopiedTrace(false), 2000);
  };

  return (
    <div className="space-y-6" id="food-formula-calculator-container">
      {/* Category Pills & Formula Selection */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-stone-800 dark:text-stone-100 text-sm">
              بانک ماشین‌حساب‌ها و فرمول‌های معتبر صنایع غذایی
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              همه ({allFormulas.length})
            </button>
            <button
              onClick={() => setSelectedCategory('proximate_analysis')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedCategory === 'proximate_analysis'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              آنالیز تقریب
            </button>
            <button
              onClick={() => setSelectedCategory('solutions_dilution')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedCategory === 'solutions_dilution'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              غلظت، رقت و محلول‌سازی
            </button>
            <button
              onClick={() => setSelectedCategory('titration_chemistry')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedCategory === 'titration_chemistry'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              تیتراسیون و اسیدیته
            </button>
            <button
              onClick={() => setSelectedCategory('physical_chemical')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedCategory === 'physical_chemical'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              فیزیکوشیمی و بریکس
            </button>
            <button
              onClick={() => setSelectedCategory('process_engineering')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedCategory === 'process_engineering'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              راندمان و مهندسی فرآیند
            </button>
            <button
              onClick={() => setSelectedCategory('statistical')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedCategory === 'statistical'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              صحه‌گذاری و ریکاوری
            </button>
          </div>
        </div>

        {/* Formula Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-3 max-h-72 overflow-y-auto p-1">
          {filteredFormulas.map((formula) => {
            const isSelected = formula.id === selectedFormulaId;
            return (
              <button
                key={formula.id}
                onClick={() => handleSelectFormula(formula)}
                className={`text-right p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-stone-500 dark:text-stone-400 bg-stone-200/70 dark:bg-stone-700 px-1.5 py-0.5 rounded">
                      {formula.outputUnit || '-'}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <h4 className="font-semibold text-xs leading-tight mb-1 text-stone-900 dark:text-stone-100">
                    {formula.nameFa}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 font-mono text-left dir-ltr">
                    {formula.nameEn}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="truncate max-w-[140px]">{formula.standardReference.split('/')[0]}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">انتخاب</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Calculation Workspace */}
      {currentFormula && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Inputs & Variables) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Formula Header & Reference Card */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {currentFormula.nameFa}
                    </h3>
                    <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      استاندارد معتبر
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {currentFormula.nameEn}
                  </p>
                </div>

                <button
                  onClick={handleResetInputs}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 border border-stone-200 dark:border-stone-700 px-2.5 py-1.5 rounded-lg transition-colors"
                  title="بازنشانی مقادیر به حالت پیش‌فرض"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  بازنشانی
                </button>
              </div>

              {/* Standard Reference Info Box */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-lg p-3 border border-stone-200 dark:border-stone-700/80 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-medium">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>مرجع استاندارد ملی و بین‌المللی:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    {currentFormula.standardReference}
                  </span>
                </div>
                {currentFormula.scientificNotesFa && (
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed pr-5">
                    {currentFormula.scientificNotesFa}
                  </p>
                )}
              </div>

              {/* Formula Expression Box */}
              <div className="bg-emerald-950 text-emerald-100 rounded-lg p-3 font-mono text-center text-sm shadow-inner dir-ltr">
                <div className="text-xs text-emerald-400 mb-1 font-sans text-right dir-rtl">فرمول محاسباتی:</div>
                <div className="font-bold tracking-wide text-emerald-200">
                  {currentFormula.expressionDisplay}
                </div>
              </div>
            </div>

            {/* Input Variables Form */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  مقادیر و پارامترهای ورودی آزمایش
                </h4>

                {/* Precision & Significant Figures Controls */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg">
                    <button
                      onClick={() => setPrecisionMode('decimals')}
                      className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                        precisionMode === 'decimals'
                          ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                          : 'text-stone-500'
                      }`}
                    >
                      اعشار
                    </button>
                    <button
                      onClick={() => {
                        setPrecisionMode('sigFigs');
                        if (!sigFigs) setSigFigs(3);
                      }}
                      className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                        precisionMode === 'sigFigs'
                          ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                          : 'text-stone-500'
                      }`}
                    >
                      ارقام معنی‌دار
                    </button>
                  </div>

                  {precisionMode === 'decimals' ? (
                    <select
                      value={decimals}
                      onChange={(e) => setDecimals(Number(e.target.value))}
                      className="bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-xs text-stone-800 dark:text-stone-200 font-semibold"
                    >
                      <option value={1}>۱ رقم اعشار</option>
                      <option value={2}>۲ رقم اعشار (استاندارد)</option>
                      <option value={3}>۳ رقم اعشار</option>
                      <option value={4}>۴ رقم اعشار (دقیق)</option>
                      <option value={6}>۶ رقم اعشار</option>
                    </select>
                  ) : (
                    <select
                      value={sigFigs || 3}
                      onChange={(e) => setSigFigs(Number(e.target.value))}
                      className="bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-xs text-stone-800 dark:text-stone-200 font-semibold"
                    >
                      <option value={2}>۲ رقم معنی‌دار (Sig Figs)</option>
                      <option value={3}>۳ رقم معنی‌دار</option>
                      <option value={4}>۴ رقم معنی‌دار</option>
                      <option value={5}>۵ رقم معنی‌دار</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="space-y-3.5">
                {currentFormula.variables.map((variable) => {
                  const currentVal = inputs[variable.id];
                  const currentUnit = inputUnits[variable.id] || variable.defaultUnit;

                  return (
                    <div
                      key={variable.id}
                      className="bg-stone-50/70 dark:bg-stone-800/40 p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-700/80 transition-all hover:border-emerald-300 dark:hover:border-emerald-700 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                          <span className="font-mono bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded text-xs">
                            {variable.symbol}
                          </span>
                          <span>{variable.nameFa}</span>
                          {variable.required && <span className="text-rose-500">*</span>}
                        </label>
                        {variable.descriptionFa && (
                          <span className="text-[11px] text-stone-500 dark:text-stone-400">
                            {variable.descriptionFa}
                          </span>
                        )}
                      </div>

                      {/* Dropdown Options for discrete choices (e.g. Kjeldahl F-factor, Acid meq) */}
                      {variable.options && variable.options.length > 0 ? (
                        <div className="space-y-1.5">
                          <select
                            value={currentVal !== undefined ? currentVal : variable.defaultValue}
                            onChange={(e) => handleInputChange(variable.id, e.target.value)}
                            className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-800 dark:text-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            {variable.options.map(opt => (
                              <option key={opt.label} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="any"
                            value={currentVal !== undefined ? currentVal : ''}
                            onChange={(e) => handleInputChange(variable.id, e.target.value)}
                            placeholder={`مثلاً ${variable.defaultValue ?? '0.000'}`}
                            className="flex-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-900 dark:text-stone-100 font-mono text-left dir-ltr focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          />

                          {variable.allowedUnits && variable.allowedUnits.length > 1 ? (
                            <select
                              value={currentUnit}
                              onChange={(e) => handleUnitChange(variable.id, e.target.value)}
                              className="bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-2 text-xs text-stone-700 dark:text-stone-300 font-medium"
                            >
                              {variable.allowedUnits.map(u => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-3 py-2 rounded-lg text-xs font-mono font-medium border border-stone-300 dark:border-stone-700">
                              {variable.defaultUnit}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (Result Card & Traceability) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Primary Result Display Card */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  نتیجه محاسبه آزمایشگاهی
                </span>
                {result?.isScientificallyValid ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-medium">
                    <Check className="w-3 h-3" />
                    نتیجه استاندارد معتبر
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    نیازمند بازبینی
                  </span>
                )}
              </div>

              {result?.success ? (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-stone-900 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-6 text-center space-y-2">
                  <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                    {currentFormula.nameFa}
                  </div>
                  <div className="flex items-baseline justify-center gap-2 font-mono flex-wrap">
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-300 tracking-tight">
                      {result.formattedValue}
                    </span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {result.unit}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 pt-1">
                    {precisionMode === 'sigFigs' 
                      ? `دقت: ${sigFigs} رقم معنی‌دار` 
                      : `دقت: ${result.decimals} رقم اعشار`}
                  </div>
                </div>
              ) : (
                <div className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 text-center text-stone-500">
                  <Calculator className="w-8 h-8 mx-auto mb-2 text-stone-400 opacity-60" />
                  <p className="text-sm font-medium">لطفاً مقادیر ورودی را تکمیل فرمایید</p>
                  <p className="text-xs text-stone-400 mt-1">محاسبه بلافاصله پس از تکمیل ورودی‌ها انجام می‌شود.</p>
                </div>
              )}

              {/* Warnings Box */}
              {result && result.warnings.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>هشدار کنترل کیفیت و دامنه داده:</span>
                  </div>
                  <ul className="space-y-1 pr-5 text-xs text-amber-900 dark:text-amber-300 leading-relaxed list-disc">
                    {result.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Errors Box */}
              {result && result.errors.length > 0 && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-200">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>خطاهای ورودی و منطقی:</span>
                  </div>
                  <ul className="space-y-1 pr-5 text-xs text-rose-900 dark:text-rose-300 leading-relaxed list-disc">
                    {result.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Traceability Actions */}
              {result && result.trace.length > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={() => setShowTrace(!showTrace)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-emerald-600 transition-colors"
                  >
                    {showTrace ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>ردپای محاسبات و مراحل حل (Trace Log)</span>
                  </button>

                  <button
                    onClick={handleCopyTrace}
                    className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 border border-stone-200 dark:border-stone-700 px-2 py-1 rounded transition-colors"
                  >
                    {copiedTrace ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">کپی شد</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کپی گزارش</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Trace Steps Breakdown Accordion */}
            {showTrace && result && result.trace.length > 0 && (
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 border-b border-stone-100 dark:border-stone-800 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>شفافیت کامل محاسباتی (Audit Trail & Step Reductions)</span>
                </div>

                <div className="space-y-3">
                  {result.trace.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="bg-stone-50 dark:bg-stone-800/60 rounded-lg p-3 border border-stone-200/70 dark:border-stone-700 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          گام {step.stepNumber}: {step.titleFa}
                        </span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded font-bold">
                          {step.intermediateValue} {step.unit}
                        </span>
                      </div>

                      <div className="bg-stone-100 dark:bg-stone-900 p-2 rounded font-mono text-[11px] text-stone-700 dark:text-stone-300 dir-ltr text-left overflow-x-auto">
                        <div>{step.expression}</div>
                        <div className="text-emerald-600 dark:text-emerald-400 mt-0.5">
                          ↳ {step.substitutedExpression}
                        </div>
                      </div>

                      {step.noteFa && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          یادداشت: {step.noteFa}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
