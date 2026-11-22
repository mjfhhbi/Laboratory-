/**
 * Food Science AI - Batch Scaling, Costing & Economics View
 * Part 28 of 30: Scale-up, Process Yield, Losses, Multi-Unit Conversions,
 * Editable Unit Costs, Packaging, Utilities, Labor, Overhead, COGS,
 * Unit Cost, Profit Margins, Error Prevention Guardrails & Step-by-Step Traceability.
 */

import React, { useState, useMemo } from 'react';
import {
  Scale,
  Calculator,
  Layers,
  Zap,
  Users,
  Factory,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  FileText,
  Copy,
  Check,
  Plus,
  Trash2,
  Info,
  Sliders,
  Percent,
  ArrowUpRight,
  PieChart,
  ShieldCheck,
  X
} from 'lucide-react';
import {
  FormulationVersion,
  FormulationIngredient,
  ScaleUnit,
  PackagingCostItem,
  EnergyUtilityCosts,
  LaborCosts,
  OverheadCosts,
  ProcessingMaintenanceCost,
  UnitPackagingSpec
} from '../../types/foodProduct';
import {
  calculateComprehensiveBatchScaleAndCost,
  getDefaultBatchScaleInput,
  BatchCalculationInput
} from '../../lib/products/scaleAndCostEngine';

interface BatchScalingCostingViewProps {
  activeFormulation: FormulationVersion;
  projectCategory?: string;
  onUpdateIngredients?: (updatedIngredients: FormulationIngredient[]) => void;
  onAutoBalanceFormulation?: () => void;
}

export const BatchScalingCostingView: React.FC<BatchScalingCostingViewProps> = ({
  activeFormulation,
  projectCategory = 'dairy',
  onUpdateIngredients,
  onAutoBalanceFormulation
}) => {
  // Initialize calculation state with customizable defaults
  const [calculationInput, setCalculationInput] = useState<BatchCalculationInput>(() =>
    getDefaultBatchScaleInput(activeFormulation.ingredients, projectCategory)
  );

  // Synchronize ingredients if external activeFormulation changes
  React.useEffect(() => {
    setCalculationInput((prev) => ({
      ...prev,
      ingredients: activeFormulation.ingredients
    }));
  }, [activeFormulation.ingredients]);

  // Modal for Step-by-Step Calculation Trace
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);
  const [copiedTrace, setCopiedTrace] = useState(false);

  // Active sub-tab inside Economics view
  const [activeSubTab, setActiveSubTab] = useState<
    'scale_yield' | 'raw_materials' | 'packaging' | 'operations' | 'cogs_summary' | 'pricing'
  >('scale_yield');

  // Compute live scaling, costing and trace results reactively
  const model = useMemo(() => {
    return calculateComprehensiveBatchScaleAndCost(calculationInput);
  }, [calculationInput]);

  // Handler helpers for editable fields
  const handleUpdateTargetValue = (val: number) => {
    setCalculationInput((prev) => ({ ...prev, targetValue: Math.max(0, val) }));
  };

  const handleUpdateTargetUnit = (unit: ScaleUnit) => {
    setCalculationInput((prev) => ({ ...prev, targetUnit: unit }));
  };

  const handleUpdateScaleMode = (mode: 'target_output_net' | 'target_input_gross' | 'target_units_count') => {
    setCalculationInput((prev) => ({ ...prev, scaleMode: mode }));
  };

  const handleUpdateLossField = (field: keyof typeof calculationInput.lossBreakdown, val: number) => {
    setCalculationInput((prev) => {
      const updatedLoss = {
        ...prev.lossBreakdown,
        [field]: Math.max(0, Math.min(100, val))
      };
      const total =
        updatedLoss.evaporationLossPercent +
        updatedLoss.equipmentHoldUpPercent +
        updatedLoss.fillingSpillagePercent +
        updatedLoss.packagingRejectPercent;
      return {
        ...prev,
        lossBreakdown: {
          ...updatedLoss,
          totalLossPercent: Math.round(total * 100) / 100,
          calculatedYieldPercent: Math.max(0, Math.round((100 - total) * 100) / 100)
        }
      };
    });
  };

  const handleUpdateUnitSpec = (field: keyof UnitPackagingSpec, val: any) => {
    setCalculationInput((prev) => ({
      ...prev,
      unitSpec: {
        ...prev.unitSpec,
        [field]: val
      }
    }));
  };

  const handleIngredientCostChange = (ingId: string, newCostPerKg: number) => {
    const updatedIngredients = calculationInput.ingredients.map((ing) => {
      if (ing.id === ingId) {
        return { ...ing, costPerKg: Math.max(0, newCostPerKg) };
      }
      return ing;
    });

    setCalculationInput((prev) => ({
      ...prev,
      ingredients: updatedIngredients
    }));

    if (onUpdateIngredients) {
      onUpdateIngredients(updatedIngredients);
    }
  };

  const handleAddPackagingItem = () => {
    const newItem: PackagingCostItem = {
      id: `pkg_${Date.now()}`,
      nameFa: 'قلم بسته‌بندی جدید',
      itemType: 'other',
      unit: 'عدد',
      unitsPerFinishedProduct: 1,
      unitCost: 0,
      scrapRejectPercent: 1.0,
      totalQuantityRequired: 0,
      totalCost: 0,
      costPerFinishedUnit: 0
    };
    setCalculationInput((prev) => ({
      ...prev,
      packagingItems: [...prev.packagingItems, newItem]
    }));
  };

  const handleUpdatePackagingItem = (id: string, field: keyof PackagingCostItem, val: any) => {
    setCalculationInput((prev) => ({
      ...prev,
      packagingItems: prev.packagingItems.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: val };
        }
        return item;
      })
    }));
  };

  const handleDeletePackagingItem = (id: string) => {
    setCalculationInput((prev) => ({
      ...prev,
      packagingItems: prev.packagingItems.filter((i) => i.id !== id)
    }));
  };

  const handleUpdateUtilityField = (field: keyof EnergyUtilityCosts, val: number) => {
    setCalculationInput((prev) => ({
      ...prev,
      utilityCosts: {
        ...prev.utilityCosts,
        [field]: Math.max(0, val)
      }
    }));
  };

  const handleUpdateLaborField = (field: keyof LaborCosts, val: number) => {
    setCalculationInput((prev) => ({
      ...prev,
      laborCosts: {
        ...prev.laborCosts,
        [field]: Math.max(0, val)
      }
    }));
  };

  const handleUpdateOverheadField = (field: keyof OverheadCosts, val: any) => {
    setCalculationInput((prev) => ({
      ...prev,
      overheadCosts: {
        ...prev.overheadCosts,
        [field]: val
      }
    }));
  };

  const handleUpdateProcessingField = (field: keyof ProcessingMaintenanceCost, val: number) => {
    setCalculationInput((prev) => ({
      ...prev,
      processingCosts: {
        ...prev.processingCosts,
        [field]: Math.max(0, val)
      }
    }));
  };

  const handleUpdatePricingSetting = (
    field: keyof typeof calculationInput.pricingSettings,
    val: number
  ) => {
    setCalculationInput((prev) => ({
      ...prev,
      pricingSettings: {
        ...prev.pricingSettings,
        [field]: Math.max(0, val)
      }
    }));
  };

  // Copy calculation trace to clipboard
  const handleCopyTraceReport = () => {
    const reportLines = [
      `=== گزارش ردیابی محاسبات مهندسی و بهای تمام‌شده (Scale-up & Cost Audit) ===`,
      `نسخه فرمولاسیون: ${activeFormulation.versionCode}`,
      `تاریخ گزارش: ${new Date().toLocaleDateString('fa-IR')}`,
      `وزن خالص خروجی: ${model.netSaleableWeightKg.toLocaleString('fa-IR')} kg | وزن ناخالص ورودی: ${model.grossInputWeightKg.toLocaleString('fa-IR')} kg`,
      `ضریب مقیاس (Scale Factor): ${model.scaleFactor.toLocaleString('fa-IR')}X`,
      `راندمان فرآیند (Yield): ${model.lossBreakdown.calculatedYieldPercent}% (افت کل: ${model.lossBreakdown.totalLossPercent}%)`,
      `تعداد بسته‌های سالم: ${model.totalFinishedUnits.toLocaleString('fa-IR')} عدد (${model.unitSpec.unitNetContent} ${model.unitSpec.unitContentUnit})`,
      `بهای تمام‌شده کل بچ (COGS): ${model.economics.totalCogsBatchCost.toLocaleString('fa-IR')} تومان`,
      `هزینه تمام‌شده هر بسته: ${model.economics.costPerFinishedUnit.toLocaleString('fa-IR')} تومان`,
      `قیمت فروش درب کارخانه: ${model.pricing.exFactoryPricePerUnit.toLocaleString('fa-IR')} تومان (سود کارخانه: ${model.pricing.targetProfitMarginPercent}%)`,
      `قیمت درج‌شده روی جلد مصرف‌کننده (CRP): ${model.pricing.consumerRetailPrice.toLocaleString('fa-IR')} تومان`,
      ``,
      `--- مراحل گام‌به‌گام ردیابی (Calculation Steps) ---`,
      ...model.calculationTrace.map((step) => {
        return [
          `[گام ${step.stepNumber} - ${step.categoryFa}] ${step.titleFa}`,
          `فرمول: ${step.formulaDescription}`,
          `ورودی‌ها: ${step.inputsDescription}`,
          step.intermediateValues
            ? Object.entries(step.intermediateValues)
                .map(([k, v]) => `  • ${k}: ${v}`)
                .join('\n')
            : '',
          `نتیجه: ${step.resultDescription} => ${step.resultValue}`,
          `----------------------------------------------------`
        ]
          .filter(Boolean)
          .join('\n');
      })
    ];

    navigator.clipboard.writeText(reportLines.join('\n'));
    setCopiedTrace(true);
    setTimeout(() => setCopiedTrace(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Core Scaling KPIs & Trace Action */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                سیستم مهندسی Scale-up و بهای تمام‌شده
              </span>
              <span className="text-xs text-stone-300 font-mono">
                Formula: {activeFormulation.versionCode}
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tight">
              مقیاس‌گذاری صنعتی، راندمان، محاسبه بهای تمام‌شده (COGS) و اقتصاد محصول
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
              تبدیل فرمول از آزمایشگاهی به پایلوت و تولید صنعتی با محاسبه دقیق ضریب مقیاس، تفکیک
              ضایعات، هزینه‌های بسته بندی، انرژی، دستمزد، سربار کارخانه و حاشیه سود.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setIsTraceModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-2 backdrop-blur-sm transition-all shadow-sm"
              title="مشاهده گزارش ردیابی گام‌به‌گام فرمول‌ها و محاسبات"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>ردیابی محاسبات (Trace Log)</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-white/10 text-center">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-stone-300 block">ضریب مقیاس (Scale Factor)</span>
            <span className="text-sm font-black font-mono text-emerald-300">
              {model.scaleFactor.toLocaleString('fa-IR')}X
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-stone-300 block">راندمان تولید (Yield)</span>
            <span className="text-sm font-black font-mono text-teal-300">
              {model.lossBreakdown.calculatedYieldPercent}%
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-stone-300 block">وزن ناخالص ورودی بچ</span>
            <span className="text-sm font-black font-mono text-amber-300">
              {model.grossInputWeightKg.toLocaleString('fa-IR')} kg
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-stone-300 block">واحدهای سالم قابل فروش</span>
            <span className="text-sm font-black font-mono text-cyan-300">
              {model.totalFinishedUnits.toLocaleString('fa-IR')} عدد
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-stone-300 block">قیمت تمام‌شده هر بسته</span>
            <span className="text-sm font-black font-mono text-emerald-400">
              {model.economics.costPerFinishedUnit.toLocaleString('fa-IR')} تومان
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-stone-300 block">قیمت مصرف‌کننده (CRP)</span>
            <span className="text-sm font-black font-mono text-yellow-300">
              {model.pricing.consumerRetailPrice.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        </div>
      </div>

      {/* Validation Warnings / Error Guardrails */}
      {model.validationErrors.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 space-y-1 text-xs">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>خطای اعتبارسنجی در پارامترهای مقیاس‌گذاری یا فرمول:</span>
          </div>
          <ul className="list-disc list-inside pr-4 space-y-0.5">
            {model.validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {model.validationWarnings.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>هشدارهای مهندسی و استوکیومتری:</span>
            </div>
            <ul className="list-disc list-inside pr-4 space-y-0.5">
              {model.validationWarnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
          {onAutoBalanceFormulation && (
            <button
              onClick={onAutoBalanceFormulation}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
            >
              تعدیل و بالانس خودکار به ۱۰۰٪
            </button>
          )}
        </div>
      )}

      {/* Section Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto">
        {[
          { key: 'scale_yield', label: '۱. مقیاس و راندمان (Scale & Yield)', icon: Scale },
          { key: 'raw_materials', label: '۲. مواد اولیه و توزین (Raw Materials)', icon: Layers },
          { key: 'packaging', label: '۳. ملزومات بسته‌بندی (Packaging)', icon: Package },
          { key: 'operations', label: '۴. فرآوری، انرژی و دستمزد (Operations)', icon: Zap },
          { key: 'cogs_summary', label: '۵. بهای تمام‌شده (COGS Summary)', icon: Factory },
          { key: 'pricing', label: '۶. حاشیه سود و قیمت مصرف‌کننده (Pricing)', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: SCALE UP, BATCH TARGET & YIELD / LOSSES */}
      {activeSubTab === 'scale_yield' && (
        <div className="space-y-6">
          {/* Target Batch Size Configuration */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  تنظیم مقیاس هدف بچ و تبدیل فرمول آزمایشگاهی (Batch Scaling Setup)
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-mono">
                فرمول مبنا: {model.baseFormulaWeightKg} kg
              </span>
            </div>

            {/* Quick Preset Buttons: Lab -> Pilot -> Industrial */}
            <div>
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-2">
                مقیاس‌های آماده مهندسی صنایع غذایی (Quick Scale Presets):
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: 'آزمایشگاهی: 500g', val: 0.5, unit: 'kg' as ScaleUnit },
                  { label: 'آزمایشگاهی: 1kg', val: 1, unit: 'kg' as ScaleUnit },
                  { label: 'پایلوت پلنت: 25kg', val: 25, unit: 'kg' as ScaleUnit },
                  { label: 'پایلوت پلنت: 100kg', val: 100, unit: 'kg' as ScaleUnit },
                  { label: 'صنعتی: 500kg', val: 500, unit: 'kg' as ScaleUnit },
                  { label: 'تولید انبوه: 1,000kg (1 Ton)', val: 1000, unit: 'kg' as ScaleUnit },
                  { label: 'تولید پیوسته: 5,000kg (5 Ton)', val: 5000, unit: 'kg' as ScaleUnit }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleUpdateTargetValue(preset.val);
                      handleUpdateTargetUnit(preset.unit);
                      handleUpdateScaleMode('target_output_net');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                      calculationInput.targetValue === preset.val && calculationInput.targetUnit === preset.unit
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale Mode & Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {/* Scale Mode */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  مبنای تعیین اندازه بچ:
                </label>
                <select
                  value={calculationInput.scaleMode}
                  onChange={(e) => handleUpdateScaleMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="target_output_net">وزن خالص خروجی سالم (Net Saleable Output)</option>
                  <option value="target_input_gross">وزن ناخالص کل ورودی به تانک (Gross Input)</option>
                  <option value="target_units_count">تعداد کل بسته‌های نهایی (Units Count)</option>
                </select>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  {calculationInput.scaleMode === 'target_output_net'
                    ? 'وزن ورودی با احتساب ضایعات افزایش می‌یابد.'
                    : calculationInput.scaleMode === 'target_input_gross'
                    ? 'محصول خروجی با کسر ضایعات محاسبه می‌شود.'
                    : 'ورودی بر اساس وزن بسته‌ها و ضایعات تنظیم می‌شود.'}
                </span>
              </div>

              {/* Target Value Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  مقدار عددی مقیاس (Editable):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.001"
                  value={calculationInput.targetValue}
                  onChange={(e) => handleUpdateTargetValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Target Unit Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  واحد اندازه‌گیری مقیاس:
                </label>
                <select
                  value={calculationInput.targetUnit}
                  onChange={(e) => handleUpdateTargetUnit(e.target.value as ScaleUnit)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                >
                  <option value="kg">کیلوگرم (kg)</option>
                  <option value="g">گرم (g)</option>
                  <option value="L">لیتر (L)</option>
                  <option value="mL">میلی‌لیتر (mL)</option>
                  <option value="unit_count">تعداد بسته / قوطی (عدد)</option>
                  <option value="pack">تعداد کارتن مادر (بسته)</option>
                </select>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  تبدیل خودکار با دانسیته به وزن استاندارد
                </span>
              </div>

              {/* Liquid Density Converter */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  دانسیته محصول (Density ρ در g/mL):
                </label>
                <input
                  type="number"
                  step="0.005"
                  min="0.5"
                  max="2.5"
                  value={calculationInput.unitSpec.densityGperMl}
                  onChange={(e) =>
                    handleUpdateUnitSpec('densityGperMl', parseFloat(e.target.value) || 1.0)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  دوغ: ۱.۰۳ | آبمیوه: ۱.۰۵ | سس: ۱.۱۲ | روغن: ۰.۹۲
                </span>
              </div>
            </div>
          </div>

          {/* Process Losses & Yield Management Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  راندمان فرآیند و تفکیک ضایعات خط تولید (Process Losses & Yield)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 dark:text-stone-400">راندمان کل:</span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-black font-mono bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  {model.lossBreakdown.calculatedYieldPercent}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Evaporation Loss */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  افت تبخیر و حرارتی (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={calculationInput.lossBreakdown.evaporationLossPercent}
                  onChange={(e) =>
                    handleUpdateLossField('evaporationLossPercent', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-stone-500 block">پاستوریزاسیون، پخت و تغلیظ</span>
              </div>

              {/* Hold-up Loss */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  ماند در تانک و لوله‌کشی (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={calculationInput.lossBreakdown.equipmentHoldUpPercent}
                  onChange={(e) =>
                    handleUpdateLossField('equipmentHoldUpPercent', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-stone-500 block">رسوب به دیواره مخزن، لوله‌ها و فیلتر</span>
              </div>

              {/* Filling Spillage */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  ریزش خط پرکنی و درزبندی (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  value={calculationInput.lossBreakdown.fillingSpillagePercent}
                  onChange={(e) =>
                    handleUpdateLossField('fillingSpillagePercent', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-stone-500 block">سرریز نازل‌ها و تنظیم اولیه فیلر</span>
              </div>

              {/* Packaging Reject */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  ظروف و بسته‌های معیوب خط (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  value={calculationInput.lossBreakdown.packagingRejectPercent}
                  onChange={(e) =>
                    handleUpdateLossField('packagingRejectPercent', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-stone-500 block">عدم سیل کامل، دفرمه شدن ظرف</span>
              </div>
            </div>

            {/* Mass Balance Summary Bar */}
            <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <span className="text-stone-500 block text-[11px]">ورودی ناخالص مواد اولیه:</span>
                  <span className="font-bold font-mono text-stone-900 dark:text-stone-100 text-sm">
                    {model.grossInputWeightKg.toLocaleString('fa-IR')} kg
                  </span>
                </div>
                <div className="text-stone-400 font-bold text-lg">−</div>
                <div>
                  <span className="text-stone-500 block text-[11px]">مجموع ضایعات فرآیندی:</span>
                  <span className="font-bold font-mono text-red-600 dark:text-red-400 text-sm">
                    {model.lossBreakdown.totalLossKg.toLocaleString('fa-IR')} kg ({model.lossBreakdown.totalLossPercent}%)
                  </span>
                </div>
                <div className="text-stone-400 font-bold text-lg">=</div>
                <div>
                  <span className="text-stone-500 block text-[11px]">خروجی سالم قابل فروش:</span>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                    {model.netSaleableWeightKg.toLocaleString('fa-IR')} kg ({model.lossBreakdown.calculatedYieldPercent}%)
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] text-stone-500 block">ضریب مقیاس (Scale Factor):</span>
                <span className="text-base font-black font-mono text-emerald-700 dark:text-emerald-300">
                  {model.scaleFactor.toLocaleString('fa-IR')}X
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: RAW MATERIALS INGREDIENTS WEIGHING & COSTING */}
      {activeSubTab === 'raw_materials' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  دستور توزین مواد اولیه در مقیاس {model.grossInputWeightKg.toLocaleString('fa-IR')} کیلوگرم
                </h3>
              </div>
              <div className="text-xs text-stone-600 dark:text-stone-400 font-mono">
                جمع هزینه مواد: <span className="font-bold text-emerald-600 dark:text-emerald-400">{model.economics.rawMaterialsTotalCost.toLocaleString('fa-IR')}</span> تومان
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="p-3 w-10 text-center">#</th>
                    <th className="p-3">نام ماده اولیه</th>
                    <th className="p-3 w-24 text-center">درصد فرمول (%)</th>
                    <th className="p-3 w-36 text-center">وزن ناخالص مورد نیاز</th>
                    <th className="p-3 w-20 text-center">واحد</th>
                    <th className="p-3 w-36 text-center">قیمت هر کیلو (تومان - Editable)</th>
                    <th className="p-3 w-36 text-center">هزینه در این بچ (تومان)</th>
                    <th className="p-3 w-20 text-center">سهم هزینه (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {model.ingredients.map((ing, idx) => (
                    <tr key={ing.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                      <td className="p-3 text-center text-stone-500 font-mono">{idx + 1}</td>
                      <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                        {ing.nameFa}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-stone-700 dark:text-stone-300">
                        {ing.percentage.toFixed(2)}%
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {ing.formattedAmount}
                      </td>
                      <td className="p-3 text-center font-mono text-stone-600 dark:text-stone-400">
                        {ing.displayUnit}
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="100"
                          min="0"
                          value={ing.costPerKg}
                          onChange={(e) =>
                            handleIngredientCostChange(ing.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 text-center font-mono font-bold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-stone-900 dark:text-stone-100">
                        {ing.totalCostInBatch.toLocaleString('fa-IR')}
                      </td>
                      <td className="p-3 text-center font-mono text-stone-500">
                        {ing.costContributionPercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-stone-50/80 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-semibold">
              <span className="text-stone-600 dark:text-stone-400">
                مجموع بهای کل مواد اولیه ورودی به این بچ:
              </span>
              <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                {model.economics.rawMaterialsTotalCost.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PACKAGING ECONOMICS */}
      {activeSubTab === 'packaging' && (
        <div className="space-y-6">
          {/* Packaging Unit Specs Setup */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  مشخصات بسته‌بندی اولیه و ثانویه (Package Unit Specification)
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                تعداد بسته‌های تولیدی: {model.totalFinishedUnits.toLocaleString('fa-IR')} عدد
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  مقدار خالص محتوی هر بسته (Net Content):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={calculationInput.unitSpec.unitNetContent}
                    onChange={(e) =>
                      handleUpdateUnitSpec('unitNetContent', parseFloat(e.target.value) || 1)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold"
                  />
                  <select
                    value={calculationInput.unitSpec.unitContentUnit}
                    onChange={(e) => handleUpdateUnitSpec('unitContentUnit', e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono"
                  >
                    <option value="mL">mL (میلی‌لیتر)</option>
                    <option value="g">g (گرم)</option>
                    <option value="L">L (لیتر)</option>
                    <option value="kg">kg (کیلوگرم)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  تعداد بسته در هر کارتن مادر (Master Carton Units):
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={calculationInput.unitSpec.unitsPerMasterCarton}
                  onChange={(e) =>
                    handleUpdateUnitSpec('unitsPerMasterCarton', parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  نیاز به {model.totalMasterCartons.toLocaleString('fa-IR')} کارتن برای کل بچ
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 flex flex-col justify-center text-center">
                <span className="text-xs text-cyan-800 dark:text-cyan-300 font-semibold mb-0.5">
                  هزینه بسته‌بندی به ازای هر عدد محصول:
                </span>
                <span className="text-base font-black font-mono text-cyan-700 dark:text-cyan-300">
                  {model.totalFinishedUnits > 0
                    ? `${(model.economics.packagingTotalCost / model.totalFinishedUnits).toFixed(0)} تومان`
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Packaging Items Table */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                جدول اقلام بسته‌بندی اولیه، ثانویه و تجمیعی (Packaging BOM)
              </h3>
              <button
                onClick={handleAddPackagingItem}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن جزء بسته‌بندی</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="p-3">نام قلم بسته‌بندی</th>
                    <th className="p-3 w-28 text-center">واحد</th>
                    <th className="p-3 w-32 text-center">مصرف در هر محصول</th>
                    <th className="p-3 w-28 text-center">پرت خط (%)</th>
                    <th className="p-3 w-36 text-center">قیمت واحد (تومان - Editable)</th>
                    <th className="p-3 w-32 text-center">تعداد کل بچ</th>
                    <th className="p-3 w-36 text-center">هزینه کل (تومان)</th>
                    <th className="p-3 w-12 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {model.packagingItems.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                      <td className="p-3">
                        <input
                          type="text"
                          value={pkg.nameFa}
                          onChange={(e) => handleUpdatePackagingItem(pkg.id, 'nameFa', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <select
                          value={pkg.unit}
                          onChange={(e) => handleUpdatePackagingItem(pkg.id, 'unit', e.target.value)}
                          className="px-2 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                        >
                          <option value="عدد">عدد</option>
                          <option value="بسته">بسته</option>
                          <option value="رول">رول</option>
                          <option value="متر">متر</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0.001"
                          value={pkg.unitsPerFinishedProduct}
                          onChange={(e) =>
                            handleUpdatePackagingItem(
                              pkg.id,
                              'unitsPerFinishedProduct',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="50"
                          value={pkg.scrapRejectPercent}
                          onChange={(e) =>
                            handleUpdatePackagingItem(
                              pkg.id,
                              'scrapRejectPercent',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="50"
                          min="0"
                          value={pkg.unitCost}
                          onChange={(e) =>
                            handleUpdatePackagingItem(pkg.id, 'unitCost', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 text-center font-mono font-bold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-cyan-600 dark:text-cyan-400"
                        />
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-stone-700 dark:text-stone-300">
                        {pkg.totalQuantityRequired.toLocaleString('fa-IR')}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-stone-900 dark:text-stone-100">
                        {pkg.totalCost.toLocaleString('fa-IR')}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeletePackagingItem(pkg.id)}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="حذف قلم"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-stone-50/80 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-semibold">
              <span className="text-stone-600 dark:text-stone-400">
                جمع کل بهای ملزومات بسته‌بندی برای این بچ:
              </span>
              <span className="font-mono text-base font-black text-cyan-600 dark:text-cyan-400">
                {model.economics.packagingTotalCost.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: OPERATIONS, UTILITIES, LABOR, PROCESSING & OVERHEAD */}
      {activeSubTab === 'operations' && (
        <div className="space-y-6">
          {/* Energy & Utilities Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  هزینه‌های انرژی و تأسیسات یوتیلیتی (Utilities & Energy Costs)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                مجموع: {model.economics.energyUtilityTotalCost.toLocaleString('fa-IR')} تومان
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Electricity */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  برق مصرفی (kWh و تعرفه):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="10"
                    min="0"
                    placeholder="کیلووات‌ساعت"
                    value={calculationInput.utilityCosts.electricityKwh}
                    onChange={(e) =>
                      handleUpdateUtilityField('electricityKwh', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                  <input
                    type="number"
                    step="100"
                    min="0"
                    placeholder="تومان/kWh"
                    value={calculationInput.utilityCosts.electricityRatePerKwh}
                    onChange={(e) =>
                      handleUpdateUtilityField('electricityRatePerKwh', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                </div>
                <span className="text-[10px] text-stone-500 block">
                  هزینه: {(calculationInput.utilityCosts.electricityKwh * calculationInput.utilityCosts.electricityRatePerKwh).toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Natural Gas */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  گاز مشعل و دیگ (m³ و تعرفه):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="5"
                    min="0"
                    placeholder="متر مکعب"
                    value={calculationInput.utilityCosts.gasCubicMeters}
                    onChange={(e) =>
                      handleUpdateUtilityField('gasCubicMeters', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                  <input
                    type="number"
                    step="200"
                    min="0"
                    placeholder="تومان/m³"
                    value={calculationInput.utilityCosts.gasRatePerCubicMeter}
                    onChange={(e) =>
                      handleUpdateUtilityField('gasRatePerCubicMeter', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                </div>
                <span className="text-[10px] text-stone-500 block">
                  هزینه: {(calculationInput.utilityCosts.gasCubicMeters * calculationInput.utilityCosts.gasRatePerCubicMeter).toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Industrial Steam */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  بخار بویلر (Ton و تعرفه):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="تن بخار"
                    value={calculationInput.utilityCosts.steamTons}
                    onChange={(e) =>
                      handleUpdateUtilityField('steamTons', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                  <input
                    type="number"
                    step="50000"
                    min="0"
                    placeholder="تومان/تن"
                    value={calculationInput.utilityCosts.steamRatePerTon}
                    onChange={(e) =>
                      handleUpdateUtilityField('steamRatePerTon', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                </div>
                <span className="text-[10px] text-stone-500 block">
                  هزینه: {(calculationInput.utilityCosts.steamTons * calculationInput.utilityCosts.steamRatePerTon).toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Process Water & Wastewater */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  آب RO و صنعتی (m³ و تعرفه):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="متر مکعب"
                    value={calculationInput.utilityCosts.waterCubicMeters}
                    onChange={(e) =>
                      handleUpdateUtilityField('waterCubicMeters', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                  <input
                    type="number"
                    step="5000"
                    min="0"
                    placeholder="تومان/m³"
                    value={calculationInput.utilityCosts.waterRatePerCubicMeter}
                    onChange={(e) =>
                      handleUpdateUtilityField('waterRatePerCubicMeter', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                </div>
                <span className="text-[10px] text-stone-500 block">
                  هزینه: {(calculationInput.utilityCosts.waterCubicMeters * calculationInput.utilityCosts.waterRatePerCubicMeter).toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>
          </div>

          {/* Labor & Processing Maintenance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Labor Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    نیروی انسانی و اپراتورهای خط (Direct Labor)
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {model.economics.laborTotalCost.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-600 dark:text-stone-400 block mb-1">
                      تعداد اپراتور:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={calculationInput.laborCosts.operatorCount}
                      onChange={(e) =>
                        handleUpdateLaborField('operatorCount', parseInt(e.target.value) || 1)
                      }
                      className="w-full px-2 py-1 text-center font-mono font-bold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-600 dark:text-stone-400 block mb-1">
                      ساعت کار بچ:
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={calculationInput.laborCosts.hoursPerBatch}
                      onChange={(e) =>
                        handleUpdateLaborField('hoursPerBatch', parseFloat(e.target.value) || 1)
                      }
                      className="w-full px-2 py-1 text-center font-mono font-bold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-600 dark:text-stone-400 block mb-1">
                      نرخ ساعتی (تومان):
                    </label>
                    <input
                      type="number"
                      step="5000"
                      min="0"
                      value={calculationInput.laborCosts.hourlyWageRate}
                      onChange={(e) =>
                        handleUpdateLaborField('hourlyWageRate', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 text-center font-mono font-bold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 block">ساعات تکنسین QC:</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={calculationInput.laborCosts.qaTechnicianHours}
                      onChange={(e) =>
                        handleUpdateLaborField('qaTechnicianHours', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">نرخ تکنسین QC (تومان):</span>
                    <input
                      type="number"
                      step="5000"
                      min="0"
                      value={calculationInput.laborCosts.qaHourlyRate}
                      onChange={(e) =>
                        handleUpdateLaborField('qaHourlyRate', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Overhead & Processing Maintenance */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Factory className="w-5 h-5 text-purple-500" />
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    سربار کارخانه و فرآوری (Overheads & CIP)
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {(model.economics.overheadTotalCost + model.economics.processingTotalCost).toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-stone-600 dark:text-stone-400 block mb-1">
                    نحوه تخصیص سربار کارخانه:
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={calculationInput.overheadCosts.mode}
                      onChange={(e) => handleUpdateOverheadField('mode', e.target.value as any)}
                      className="px-2 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                    >
                      <option value="percentage_of_direct">درصدی از هزینه‌های مستقیم</option>
                      <option value="fixed_per_batch">مبلغ ثابت به ازای هر بچ</option>
                    </select>

                    {calculationInput.overheadCosts.mode === 'percentage_of_direct' ? (
                      <div className="flex items-center gap-1 w-32">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="50"
                          value={calculationInput.overheadCosts.overheadRatePercent}
                          onChange={(e) =>
                            handleUpdateOverheadField('overheadRatePercent', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                        />
                        <span className="text-xs">%</span>
                      </div>
                    ) : (
                      <input
                        type="number"
                        step="50000"
                        min="0"
                        value={calculationInput.overheadCosts.fixedOverheadAmount}
                        onChange={(e) =>
                          handleUpdateOverheadField('fixedOverheadAmount', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-stone-500 block mb-1">
                      شستشو و CIP خط (تومان):
                    </label>
                    <input
                      type="number"
                      step="10000"
                      min="0"
                      value={calculationInput.processingCosts.maintenanceCleaningCipCost}
                      onChange={(e) =>
                        handleUpdateProcessingField('maintenanceCleaningCipCost', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 block mb-1">
                      استهلاک خط و فیلترها:
                    </label>
                    <input
                      type="number"
                      step="10000"
                      min="0"
                      value={calculationInput.processingCosts.lineWearTearCost}
                      onChange={(e) =>
                        handleUpdateProcessingField('lineWearTearCost', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: COGS SUMMARY & COST STRUCTURE BREAKDOWN */}
      {activeSubTab === 'cogs_summary' && (
        <div className="space-y-6">
          {/* Main COGS Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center shadow-sm">
              <span className="text-xs text-stone-500 block mb-1">
                بهای تمام‌شده کل بچ (Total Batch COGS):
              </span>
              <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {model.economics.totalCogsBatchCost.toLocaleString('fa-IR')}
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">تومان برای کل بچ</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center shadow-sm">
              <span className="text-xs text-stone-500 block mb-1">
                قیمت تمام‌شده هر کیلوگرم محصول نهایی:
              </span>
              <span className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
                {model.economics.costPerKgNet.toLocaleString('fa-IR')}
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">تومان به ازای هر کیلو خالص</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center shadow-sm">
              <span className="text-xs text-stone-500 block mb-1">
                بهای تمام‌شده هر بسته محصول (Cost per Unit):
              </span>
              <span className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">
                {model.economics.costPerFinishedUnit.toLocaleString('fa-IR')}
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">
                تومان به ازای بسته {model.unitSpec.unitNetContent} {model.unitSpec.unitContentUnit}
              </span>
            </div>
          </div>

          {/* Visual Cost Allocation Progress Bar */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>ترکیب سهم هزینه‌ها در قیمت تمام‌شده (Cost Structure Shares)</span>
            </h3>

            {/* Stacked bar */}
            <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${model.economics.costShares.rawMaterialsPercent}%` }}
                className="bg-emerald-600 transition-all"
                title={`مواد اولیه: ${model.economics.costShares.rawMaterialsPercent}%`}
              />
              <div
                style={{ width: `${model.economics.costShares.packagingPercent}%` }}
                className="bg-cyan-500 transition-all"
                title={`بسته‌بندی: ${model.economics.costShares.packagingPercent}%`}
              />
              <div
                style={{ width: `${model.economics.costShares.energyPercent}%` }}
                className="bg-amber-500 transition-all"
                title={`انرژی: ${model.economics.costShares.energyPercent}%`}
              />
              <div
                style={{ width: `${model.economics.costShares.laborPercent}%` }}
                className="bg-indigo-500 transition-all"
                title={`نیروی انسانی: ${model.economics.costShares.laborPercent}%`}
              />
              <div
                style={{ width: `${model.economics.costShares.overheadPercent}%` }}
                className="bg-purple-500 transition-all"
                title={`سربار کارخانه: ${model.economics.costShares.overheadPercent}%`}
              />
              <div
                style={{ width: `${model.economics.costShares.processingPercent}%` }}
                className="bg-stone-400 transition-all"
                title={`فرآوری: ${model.economics.costShares.processingPercent}%`}
              />
            </div>

            {/* Detailed Cost Breakdown Table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  <span>مواد اولیه</span>
                </div>
                <div className="mt-1 font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                  {model.economics.costShares.rawMaterialsPercent}%
                </div>
                <span className="text-[10px] text-stone-500 font-mono">
                  {model.economics.rawMaterialsTotalCost.toLocaleString('fa-IR')} ت
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                  <span>بسته‌بندی</span>
                </div>
                <div className="mt-1 font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                  {model.economics.costShares.packagingPercent}%
                </div>
                <span className="text-[10px] text-stone-500 font-mono">
                  {model.economics.packagingTotalCost.toLocaleString('fa-IR')} ت
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span>انرژی</span>
                </div>
                <div className="mt-1 font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                  {model.economics.costShares.energyPercent}%
                </div>
                <span className="text-[10px] text-stone-500 font-mono">
                  {model.economics.energyUtilityTotalCost.toLocaleString('fa-IR')} ت
                </span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 dark:text-indigo-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                  <span>دستمزد</span>
                </div>
                <div className="mt-1 font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                  {model.economics.costShares.laborPercent}%
                </div>
                <span className="text-[10px] text-stone-500 font-mono">
                  {model.economics.laborTotalCost.toLocaleString('fa-IR')} ت
                </span>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 dark:text-purple-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                  <span>سربار</span>
                </div>
                <div className="mt-1 font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                  {model.economics.costShares.overheadPercent}%
                </div>
                <span className="text-[10px] text-stone-500 font-mono">
                  {model.economics.overheadTotalCost.toLocaleString('fa-IR')} ت
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400 inline-block" />
                  <span>فرآوری و CIP</span>
                </div>
                <div className="mt-1 font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                  {model.economics.costShares.processingPercent}%
                </div>
                <span className="text-[10px] text-stone-500 font-mono">
                  {model.economics.processingTotalCost.toLocaleString('fa-IR')} ت
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: PROFIT MARGIN, PRICING & MARKET ECONOMICS */}
      {activeSubTab === 'pricing' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  استراتژی قیمت‌گذاری چندسطحی و سودآوری زنجیره توزیع
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                مبنا: بهای تمام‌شده هر واحد {model.economics.costPerFinishedUnit.toLocaleString('fa-IR')} تومان
              </span>
            </div>

            {/* Editable Margins Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  حاشیه سود هدف کارخانه (Profit Margin %):
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="90"
                    value={calculationInput.pricingSettings.targetProfitMarginPercent}
                    onChange={(e) =>
                      handleUpdatePricingSetting('targetProfitMarginPercent', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold text-center"
                  />
                  <span className="text-xs font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  مارجین شرکت پخش / توزیع‌کننده (%):
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="50"
                    value={calculationInput.pricingSettings.distributorMarginPercent}
                    onChange={(e) =>
                      handleUpdatePricingSetting('distributorMarginPercent', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold text-center"
                  />
                  <span className="text-xs font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  مارجین خرده‌فروشی / سوپرمارکت (%):
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="50"
                    value={calculationInput.pricingSettings.retailerMarginPercent}
                    onChange={(e) =>
                      handleUpdatePricingSetting('retailerMarginPercent', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold text-center"
                  />
                  <span className="text-xs font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  مالیات بر ارزش افزوده (VAT %):
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="30"
                    value={calculationInput.pricingSettings.vatPercent}
                    onChange={(e) =>
                      handleUpdatePricingSetting('vatPercent', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold text-center"
                  />
                  <span className="text-xs font-bold">%</span>
                </div>
              </div>
            </div>

            {/* Price Ladder (Waterfall View) */}
            <div className="space-y-3 pt-3">
              <h4 className="text-xs font-bold text-stone-600 dark:text-stone-400">
                نردبان قیمت‌گذاری از تولید تا مصرف‌کننده (Supply Chain Pricing Ladder):
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Level 1: Unit COGS */}
                <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-[11px] text-stone-500 block">۱. بهای تمام‌شده واحد</span>
                  <div className="text-base font-black font-mono text-stone-800 dark:text-stone-200">
                    {model.economics.costPerFinishedUnit.toLocaleString('fa-IR')}
                  </div>
                  <span className="text-[10px] text-stone-500 block">تومان / بسته</span>
                </div>

                {/* Level 2: Ex-Factory Price */}
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1">
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block font-bold">
                    ۲. فروش درب کارخانه
                  </span>
                  <div className="text-base font-black font-mono text-emerald-700 dark:text-emerald-300">
                    {model.pricing.exFactoryPricePerUnit.toLocaleString('fa-IR')}
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                    سود واحد: {model.pricing.grossProfitPerUnit.toLocaleString('fa-IR')} ت
                  </span>
                </div>

                {/* Level 3: Distributor Price */}
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
                  <span className="text-[11px] text-blue-800 dark:text-blue-300 block font-bold">
                    ۳. تحویل به مغازه (پخش)
                  </span>
                  <div className="text-base font-black font-mono text-blue-700 dark:text-blue-300">
                    {model.pricing.distributorPricePerUnit.toLocaleString('fa-IR')}
                  </div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 block">
                    مارجین پخش: {calculationInput.pricingSettings.distributorMarginPercent}%
                  </span>
                </div>

                {/* Level 4: Pre-VAT Retail */}
                <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
                  <span className="text-[11px] text-purple-800 dark:text-purple-300 block font-bold">
                    ۴. مغازه (بدون مالیات)
                  </span>
                  <div className="text-base font-black font-mono text-purple-700 dark:text-purple-300">
                    {model.pricing.consumerPricePreVat.toLocaleString('fa-IR')}
                  </div>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 block">
                    سود مغازه: {calculationInput.pricingSettings.retailerMarginPercent}%
                  </span>
                </div>

                {/* Level 5: Final CRP with VAT */}
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600 space-y-1">
                  <span className="text-[11px] text-amber-900 dark:text-amber-300 block font-black">
                    ۵. قیمت مصرف‌کننده (CRP)
                  </span>
                  <div className="text-lg font-black font-mono text-amber-800 dark:text-amber-200">
                    {model.pricing.consumerRetailPrice.toLocaleString('fa-IR')}
                  </div>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 block">
                    شامل {calculationInput.pricingSettings.vatPercent}% ارزش افزوده
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATION TRACEABILITY AUDIT MODAL */}
      {isTraceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-stone-100">
                    ردیابی گام‌به‌گام فرمول و محاسبات (Calculation Trace Log & Audit Trail)
                  </h3>
                  <span className="text-xs text-stone-500 font-mono">
                    فرمول فعال: {activeFormulation.versionCode} | مقیاس: {model.netSaleableWeightKg.toLocaleString('fa-IR')} kg
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyTraceReport}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {copiedTrace ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTrace ? 'کپی شد' : 'کپی کل گزارش'}</span>
                </button>

                <button
                  onClick={() => setIsTraceModalOpen(false)}
                  className="p-1.5 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content: Step by step trace cards */}
            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                این گزارش جهت قابلیت ممیزی و دفاع علمی از محاسبات مقیاس‌گذاری و اقتصادی در کمیته‌های
                R&D و طرح‌های توجیهی صنعتی تهیه شده است و روابط ریاضی حاکم بر هر مرحله را مستند می‌سازد.
              </p>

              <div className="space-y-3">
                {model.calculationTrace.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-stone-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold font-mono text-[11px] flex items-center justify-center">
                          {step.stepNumber}
                        </span>
                        <span className="font-bold text-stone-900 dark:text-stone-100">
                          {step.titleFa}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-stone-200/70 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                          {step.categoryFa}
                        </span>
                      </div>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {step.resultValue}
                      </span>
                    </div>

                    <div className="space-y-1 text-stone-700 dark:text-stone-300">
                      <div>
                        <span className="font-semibold text-stone-500">فرمول ریاضی: </span>
                        <span className="font-mono text-stone-800 dark:text-stone-200 dir-ltr inline-block">
                          {step.formulaDescription}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-stone-500">پارامترهای ورودی: </span>
                        <span>{step.inputsDescription}</span>
                      </div>
                    </div>

                    {step.intermediateValues && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-700/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {Object.entries(step.intermediateValues).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-stone-500">{key}:</span>
                            <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-1 text-emerald-700 dark:text-emerald-300 font-medium">
                      ✓ {step.resultDescription}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-end">
              <button
                onClick={() => setIsTraceModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
