/**
 * Laboratory Solution Preparation and Calculation Engine Component
 * Food Science AI Lab Suite - Part 13
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChemicalReagent,
  ConcentrationUnit,
  VolumeUnit,
  SolutionCalculationParams,
  SolutionCalculationResult,
  PreparedSolution
} from '../../types/chemicalReagent';
import {
  calculateSolutionPreparation,
  COMMON_SOLUTION_PRESETS
} from '../../lib/calculations/solutionCalculator';
import { GhsBadge } from './GhsBadge';
import {
  Calculator,
  Pipette,
  Beaker,
  AlertTriangle,
  CheckCircle2,
  BookmarkPlus,
  RefreshCw,
  Info,
  ShieldAlert,
  Flame,
  FileCheck,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';

interface SolutionCalculatorViewProps {
  reagents: ChemicalReagent[];
  initialReagent?: ChemicalReagent | null;
  onRegisterSolution: (solutionData: Partial<PreparedSolution>) => void;
}

export const SolutionCalculatorView: React.FC<SolutionCalculatorViewProps> = ({
  reagents,
  initialReagent,
  onRegisterSolution
}) => {
  // Selected reagent
  const [selectedReagentId, setSelectedReagentId] = useState<string>(
    initialReagent?.id || (reagents.length > 0 ? reagents[0].id : '')
  );

  // Form parameters
  const [targetConcentration, setTargetConcentration] = useState<number>(0.1);
  const [concentrationUnit, setConcentrationUnit] = useState<ConcentrationUnit>('M');
  const [finalVolume, setFinalVolume] = useState<number>(1000);
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>('mL');
  const [customPurity, setCustomPurity] = useState<number | undefined>(undefined);
  const [customDensity, setCustomDensity] = useState<number | undefined>(undefined);
  const [solvent, setSolvent] = useState<string>('آب مقطر دیونیزه (عاری از CO2 برای بازها)');
  const [preparedBy, setPreparedBy] = useState<string>('کارشناس کنترل کیفیت');
  const [storageLocation, setStorageLocation] = useState<string>('قفسه محلول‌های فعال آزمایشگاه');

  // Update selected reagent if initialReagent changes
  useEffect(() => {
    if (initialReagent) {
      setSelectedReagentId(initialReagent.id);
      // Auto-set sensible defaults
      if (initialReagent.valenceOrEquivalents && initialReagent.valenceOrEquivalents > 1) {
        setConcentrationUnit('N');
      }
    }
  }, [initialReagent]);

  const selectedReagent = useMemo(() => {
    return reagents.find(r => r.id === selectedReagentId) || reagents[0] || null;
  }, [reagents, selectedReagentId]);

  // Set default custom purity/density when reagent changes
  useEffect(() => {
    if (selectedReagent) {
      setCustomPurity(selectedReagent.purityPercentage);
      setCustomDensity(selectedReagent.density);
    }
  }, [selectedReagent]);

  // Real-time calculation calculation
  const calculationResult: SolutionCalculationResult | null = useMemo(() => {
    if (!selectedReagent || targetConcentration <= 0 || finalVolume <= 0) {
      return null;
    }

    const params: SolutionCalculationParams = {
      reagent: selectedReagent,
      targetConcentration,
      concentrationUnit,
      finalVolume,
      volumeUnit,
      customPurity,
      customDensity,
      solvent
    };

    return calculateSolutionPreparation(params);
  }, [selectedReagent, targetConcentration, concentrationUnit, finalVolume, volumeUnit, customPurity, customDensity, solvent]);

  // Handle Preset selection
  const handleApplyPreset = (preset: typeof COMMON_SOLUTION_PRESETS[0]) => {
    // Find reagent
    const matchedReagent = reagents.find(r => r.id === preset.reagentId || r.chemicalFormula === preset.reagentFormula);
    if (matchedReagent) {
      setSelectedReagentId(matchedReagent.id);
      setTargetConcentration(preset.targetConcentration);
      setConcentrationUnit(preset.concentrationUnit);
      setFinalVolume(preset.finalVolume);
      setVolumeUnit(preset.volumeUnit);
      if (preset.suggestedSolvent) {
        setSolvent(preset.suggestedSolvent);
      }
    }
  };

  const handleRegister = () => {
    if (!selectedReagent || !calculationResult) return;

    const solPayload: Partial<PreparedSolution> = {
      title: `محلول ${selectedReagent.name} ${targetConcentration} ${concentrationUnit}`,
      reagentId: selectedReagent.id,
      reagentName: selectedReagent.name,
      reagentFormula: selectedReagent.chemicalFormula,
      targetConcentration,
      concentrationUnit,
      actualConcentration: targetConcentration,
      standardizationFactor: 1.0000,
      finalVolume,
      volumeUnit,
      solvent,
      requiredAmount: calculationResult.requiredAmount,
      requiredAmountUnit: calculationResult.requiredAmountUnit,
      calculationFormula: calculationResult.formulaUsed,
      calculationSteps: calculationResult.steps,
      safetyWarnings: calculationResult.safetyAlerts,
      preparationDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      preparedBy,
      standardizedWith: calculationResult.standardizationGuide?.titrantOrPrimaryStandard,
      storageLocation,
      status: 'active'
    };

    onRegisterSolution(solPayload);
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets Bar */}
      <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>پروتکل‌های پرکاربرد صنایع غذایی (پریست‌های آماده):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_SOLUTION_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span className="font-bold text-emerald-700 dark:text-emerald-400" dir="ltr">{preset.reagentFormula} {preset.targetConcentration} {preset.concentrationUnit}</span>
              <span className="text-stone-500 text-[11px]">({preset.applicationFa})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Parameters Input (Left/Right) & Live Calculation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs p-5 space-y-4">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
              <Pipette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>تنظیمات و متغیرهای محلول‌سازی</span>
            </h3>

            {/* Reagent Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                ماده شیمیایی اولیه (Reagent / Solute) <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedReagentId}
                onChange={(e) => setSelectedReagentId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {reagents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.chemicalFormula}) - خلوص {r.purityPercentage}%
                  </option>
                ))}
              </select>
            </div>

            {/* Target Concentration & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  غلظت موردنظر <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.0001"
                  required
                  value={targetConcentration}
                  onChange={(e) => setTargetConcentration(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  واحد غلظت
                </label>
                <select
                  value={concentrationUnit}
                  onChange={(e) => setConcentrationUnit(e.target.value as ConcentrationUnit)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                >
                  <option value="M">M (مولار - Molarity)</option>
                  <option value="N">N (نرمال - Normality)</option>
                  <option value="w/v%">w/v% (درصد وزنی/حجمی)</option>
                  <option value="v/v%">v/v% (درصد حجمی/حجمی)</option>
                  <option value="w/w%">w/w% (درصد وزنی/وزنی)</option>
                  <option value="g/L">g/L (گرم بر لیتر)</option>
                  <option value="mg/L">mg/L (میلی‌گرم بر لیتر)</option>
                  <option value="ppm">ppm (قسمت در میلیون)</option>
                  <option value="mM">mM (میلی‌مولار)</option>
                </select>
              </div>
            </div>

            {/* Final Volume & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  حجم نهایی محلول <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={finalVolume}
                  onChange={(e) => setFinalVolume(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  واحد حجم
                </label>
                <select
                  value={volumeUnit}
                  onChange={(e) => setVolumeUnit(e.target.value as VolumeUnit)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                >
                  <option value="mL">mL (میلی‌لیتر)</option>
                  <option value="L">L (لیتر)</option>
                </select>
              </div>
            </div>

            {/* Custom Purity & Density Adjusters */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-700/70 space-y-2.5">
              <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>تطبیق با برچسب ظرف آزمایشگاه:</span>
                <span className="text-[10px] text-stone-400 font-normal">در صورت تفاوت با انبار</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-stone-500 dark:text-stone-400 mb-0.5">
                    خلوص ظرف (Assay %)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="100"
                    value={customPurity ?? selectedReagent?.purityPercentage ?? 100}
                    onChange={(e) => setCustomPurity(parseFloat(e.target.value) || 100)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 dark:text-stone-400 mb-0.5">
                    چگالی ظرف (g/mL)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="فقط مایعات"
                    value={customDensity ?? selectedReagent?.density ?? ''}
                    onChange={(e) => setCustomDensity(e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Solvent Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                حلال مصرفی (Solvent)
              </label>
              <input
                type="text"
                value={solvent}
                onChange={(e) => setSolvent(e.target.value)}
                placeholder="آب مقطر دیونیزه..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quick Selected Reagent Identity Card */}
          {selectedReagent && (
            <div className="p-4 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 dark:text-stone-100">{selectedReagent.name}</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400" dir="ltr">{selectedReagent.chemicalFormula}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-400">
                <div>وزن مولکولی: <span className="font-mono font-bold text-stone-800 dark:text-stone-200" dir="ltr">{selectedReagent.molecularWeight} g/mol</span></div>
                <div>ظرفیت n: <span className="font-mono font-bold text-stone-800 dark:text-stone-200" dir="ltr">{selectedReagent.valenceOrEquivalents || 1}</span></div>
                <div>CAS: <span className="font-mono text-stone-800 dark:text-stone-200" dir="ltr">{selectedReagent.casNumber}</span></div>
                <div>منبع CAS: <span className="truncate text-stone-700 dark:text-stone-300" title={selectedReagent.casSource}>{selectedReagent.casSource}</span></div>
              </div>
              {selectedReagent.hazards.ghsPictograms.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1 border-t border-stone-200/60 dark:border-stone-700/60 flex-wrap">
                  <span className="text-[10px] text-stone-400">خطرات:</span>
                  {selectedReagent.hazards.ghsPictograms.map(code => (
                    <GhsBadge key={code} code={code} size="sm" />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Calculation Results & Step-by-Step Instructions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {calculationResult ? (
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs p-6 space-y-6">
              {/* Massive Output Amount Highlight Box */}
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500 dark:border-emerald-600 text-center space-y-2">
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  مقدار ماده موردنیاز جهت تهیه محلول ({calculationResult.isLiquidDilution ? 'حجم اسید/مایع اولیه' : 'جرم ماده جامد خالص'}):
                </div>

                <div className="flex items-baseline justify-center gap-2 font-mono font-black text-3xl sm:text-4xl text-emerald-900 dark:text-emerald-100" dir="ltr">
                  <span>{calculationResult.formattedAmount}</span>
                  <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{calculationResult.requiredAmountUnit}</span>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-300">
                  از {selectedReagent?.name} با خلوص {calculationResult.purityUsed}% {calculationResult.densityUsed ? `و دانسیته ${calculationResult.densityUsed} g/mL` : ''}
                </div>
              </div>

              {/* Formula & Calculation Logic Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>فرمول محاسباتی استاندارد (Calculation Formula)</span>
                </h4>

                <div className="p-3.5 rounded-xl bg-stone-900 text-emerald-300 font-mono text-xs border border-stone-800 shadow-inner overflow-x-auto" dir="ltr">
                  <code>{calculationResult.formulaUsed}</code>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {calculationResult.formulaExplanation}
                </div>
              </div>

              {/* Step-by-Step Laboratory Preparation Steps */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>مراحل گام‌به‌گام آماده‌سازی محلول (Preparation SOP)</span>
                </h4>

                <div className="space-y-2.5">
                  {calculationResult.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/80 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-700 dark:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="font-bold text-stone-900 dark:text-stone-100">
                          {step.title}
                        </div>
                        <div className="text-stone-700 dark:text-stone-300 leading-relaxed">
                          {step.explanation}
                        </div>
                        {step.safetyTip && (
                          <div className="text-amber-800 dark:text-amber-300 text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded border border-amber-200 dark:border-amber-900/60 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{step.safetyTip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Alerts Specific to This Preparation */}
              {calculationResult.safetyAlerts.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2">
                  <div className="font-bold text-xs text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>هشدارهای ایمنی ویژه محلول‌سازی (Safety Warnings):</span>
                  </div>
                  <ul className="space-y-1 text-xs text-rose-950 dark:text-rose-200">
                    {calculationResult.safetyAlerts.map((alert, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{alert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Standardization Guide (if available for NaOH, HCl, AgNO3, etc.) */}
              {calculationResult.standardizationGuide && (
                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2 text-xs">
                  <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>دستورالعمل استانداردسازی و تعیین فاکتور F:</span>
                  </div>
                  <div className="text-stone-800 dark:text-stone-200 space-y-1">
                    <div>
                      <span className="font-semibold text-indigo-900 dark:text-indigo-300">ماده استاندارد اولیه: </span>
                      <span>{calculationResult.standardizationGuide.titrantOrPrimaryStandard}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-indigo-900 dark:text-indigo-300">شناساگر معرف: </span>
                      <span>{calculationResult.standardizationGuide.indicator}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-indigo-900 dark:text-indigo-300">روش تیتراسیون: </span>
                      <span>{calculationResult.standardizationGuide.methodDescription}</span>
                    </div>
                    <div className="font-mono text-emerald-800 dark:text-emerald-300 pt-1" dir="ltr">
                      فرمول فاکتور: {calculationResult.standardizationGuide.formula}
                    </div>
                  </div>
                </div>
              )}

              {/* Registration Action Bar */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="نام کارشناس تهیه‌کننده"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 flex-1 sm:w-44"
                  />
                  <input
                    type="text"
                    placeholder="محل نگهداری محلول"
                    value={storageLocation}
                    onChange={(e) => setStorageLocation(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 flex-1 sm:w-48"
                  />
                </div>

                <button
                  onClick={handleRegister}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>ثبت در دفترچه محلول‌های آزمایشگاه</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
              لطفاً مقادیر معتبر غلظت و حجم را وارد نمایید.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
