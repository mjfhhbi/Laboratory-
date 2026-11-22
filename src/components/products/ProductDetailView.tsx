/**
 * Food Science AI - Product Project Workspace & Detail View
 * Comprehensive formulation, scaling, unit operations, packaging, QC, and trial logging workspace.
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeftRight,
  Sparkles,
  Layers,
  Scale,
  Settings,
  Package,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Plus,
  Trash2,
  Copy,
  Save,
  Check,
  Thermometer,
  Clock,
  Wrench,
  ShieldCheck,
  Activity,
  Award,
  HelpCircle,
  TrendingUp,
  Percent,
  Sliders,
  ChevronDown,
  Lightbulb,
  BookOpen,
  FileCheck,
  Microscope
} from 'lucide-react';
import {
  ProductDevelopmentProject,
  FormulationVersion,
  FormulationIngredient,
  ProcessStage,
  PackagingSpec,
  QualityControlSpec,
  ShelfLifeStudyPoint,
  PotentialDefectAndTroubleshooting,
  TestResultEntry,
  IngredientFunction,
  ProductionScale
} from '../../types/foodProduct';
import {
  calculateFormulationSummary,
  normalizeIngredientsTo100Percent,
  calculateBatchScaling,
  INGREDIENT_FUNCTION_LABELS
} from '../../lib/products/formulationEngine';
import { MultiFormulationCompareModal } from './MultiFormulationCompareModal';
import { AiProductAdvisorModal } from './AiProductAdvisorModal';
import { BatchScalingCostingView } from './BatchScalingCostingView';
import { IntelligentLabAnalysisModal } from './IntelligentLabAnalysisModal';

interface ProductDetailViewProps {
  project: ProductDevelopmentProject;
  onBack: () => void;
  onSave: (updatedProject: ProductDevelopmentProject) => void;
}

type TabType =
  | 'formulation'
  | 'scaling'
  | 'process'
  | 'packaging'
  | 'qc_shelflife'
  | 'test_trials'
  | 'troubleshooting';

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  project,
  onBack,
  onSave
}) => {
  const [currentProject, setCurrentProject] = useState<ProductDevelopmentProject>(project);
  const [activeTab, setActiveTab] = useState<TabType>('formulation');
  const [activeFormulationId, setActiveFormulationId] = useState<string>(
    project.activeFormulationId || project.formulations[0]?.id || ''
  );

  // Scaling state
  const [targetBatchWeightKg, setTargetBatchWeightKg] = useState<number>(
    project.standardBatchSizeKg || 10
  );
  const [processLossPercent, setProcessLossPercent] = useState<number>(
    project.processLossFactorPercent || 2.0
  );

  // Modals
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isLabAnalysisModalOpen, setIsLabAnalysisModalOpen] = useState(false);
  const [selectedTestResultForAnalysis, setSelectedTestResultForAnalysis] = useState<TestResultEntry | undefined>(undefined);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Active formulation
  const activeFormulation =
    currentProject.formulations.find((f) => f.id === activeFormulationId) ||
    currentProject.formulations[0];

  // Active summary
  const summary = activeFormulation
    ? calculateFormulationSummary(activeFormulation.ingredients)
    : null;

  // Save current project state
  const handleSaveAll = () => {
    onSave(currentProject);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  // Helper to update active formulation ingredients
  const updateIngredients = (newIngredients: FormulationIngredient[]) => {
    const updatedFormulations = currentProject.formulations.map((form) => {
      if (form.id === activeFormulationId) {
        const sum = calculateFormulationSummary(newIngredients);
        return {
          ...form,
          ingredients: newIngredients,
          totalPercentage: sum.totalPercentage,
          totalDryMatterPercent: sum.totalDryMatterPercent,
          estimatedBrix: sum.estimatedBrix,
          estimatedCostPerKg: sum.estimatedCostPerKg,
          updatedAt: new Date().toISOString()
        };
      }
      return form;
    });

    const updatedProj: ProductDevelopmentProject = {
      ...currentProject,
      formulations: updatedFormulations,
      updatedAt: new Date().toISOString()
    };
    setCurrentProject(updatedProj);
  };

  // Add new ingredient to active formulation
  const handleAddIngredient = () => {
    if (!activeFormulation) return;
    const newIng: FormulationIngredient = {
      id: `ing_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      nameFa: 'ماده اولیه جدید',
      category: 'other',
      percentage: 1.0,
      dryMatterPercent: 100,
      costPerKg: 0
    };
    updateIngredients([...activeFormulation.ingredients, newIng]);
  };

  // Delete ingredient from active formulation
  const handleDeleteIngredient = (id: string) => {
    if (!activeFormulation) return;
    updateIngredients(activeFormulation.ingredients.filter((i) => i.id !== id));
  };

  // Update specific ingredient property
  const handleIngredientChange = (
    id: string,
    field: keyof FormulationIngredient,
    value: any
  ) => {
    if (!activeFormulation) return;
    const updated = activeFormulation.ingredients.map((ing) => {
      if (ing.id === id) {
        return { ...ing, [field]: value };
      }
      return ing;
    });
    updateIngredients(updated);
  };

  // Auto-Balance to 100%
  const handleAutoBalance100 = () => {
    if (!activeFormulation) return;
    // Find solvent/water if available
    const solvent = activeFormulation.ingredients.find(
      (i) => i.category === 'solvent_base'
    );
    const normalized = normalizeIngredientsTo100Percent(
      activeFormulation.ingredients,
      solvent?.id
    );
    updateIngredients(normalized);
  };

  // Add new Formulation Version (Formula Versioning: Formula v1, v2, v3...)
  const handleAddNewFormulationVersion = () => {
    const versionNum = currentProject.formulations.length + 1;
    const newFormId = `form_${Date.now()}_v${versionNum}`;
    const baseIngredients = activeFormulation ? [...activeFormulation.ingredients] : [];

    const newVersion: FormulationVersion = {
      id: newFormId,
      versionCode: `Formula v${versionNum} (نسخه جدید)`,
      versionNumber: versionNum,
      title: `فرمولاسیون نسخه ${versionNum}`,
      isBaseline: false,
      baseVersionId: activeFormulation?.id,
      changeLogSummary: `ایجاد نسخه فرمولاسیون جدید شماره ${versionNum} بر پایه ${activeFormulation?.versionCode || 'فرمول اولیه'}.`,
      ingredients: baseIngredients,
      totalPercentage: 100.0,
      totalDryMatterPercent: 10.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedProj: ProductDevelopmentProject = {
      ...currentProject,
      formulations: [...currentProject.formulations, newVersion],
      activeFormulationId: newFormId
    };
    setCurrentProject(updatedProj);
    setActiveFormulationId(newFormId);
  };

  // Duplicate current formulation
  const handleDuplicateFormulation = () => {
    if (!activeFormulation) return;
    const versionNum = currentProject.formulations.length + 1;
    const newFormId = `form_${Date.now()}_copy`;
    const copy: FormulationVersion = {
      ...JSON.parse(JSON.stringify(activeFormulation)),
      id: newFormId,
      versionCode: `Formula v${versionNum} (انشعاب از ${activeFormulation.versionCode})`,
      versionNumber: versionNum,
      isBaseline: false,
      baseVersionId: activeFormulation.id,
      changeLogSummary: `تکثیر نسخه از ${activeFormulation.versionCode} جهت اصلاح درصدها و آزمون متغیرها.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedProj: ProductDevelopmentProject = {
      ...currentProject,
      formulations: [...currentProject.formulations, copy],
      activeFormulationId: newFormId
    };
    setCurrentProject(updatedProj);
    setActiveFormulationId(newFormId);
  };

  // Process Stage Handlers
  const handleAddProcessStage = () => {
    const nextStep = currentProject.processStages.length + 1;
    const newStage: ProcessStage = {
      id: `stg_${Date.now()}`,
      stepNumber: nextStep,
      stageNameFa: `مرحله ${nextStep}: عملیات حرارتی / فرآیندی`,
      descriptionFa: 'شرح فرآیند و عملیات واحد مربوطه...',
      equipmentRequired: ['تجهیزات صنعتی'],
      criticalControlPoint: false
    };
    setCurrentProject({
      ...currentProject,
      processStages: [...currentProject.processStages, newStage]
    });
  };

  const handleDeleteProcessStage = (id: string) => {
    const filtered = currentProject.processStages
      .filter((s) => s.id !== id)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setCurrentProject({
      ...currentProject,
      processStages: filtered
    });
  };

  const handleUpdateProcessStage = (id: string, field: keyof ProcessStage, value: any) => {
    const updated = currentProject.processStages.map((s) => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    });
    setCurrentProject({
      ...currentProject,
      processStages: updated
    });
  };

  // QC Handlers
  const handleAddQcSpec = () => {
    const newQc: QualityControlSpec = {
      id: `qc_${Date.now()}`,
      parameterNameFa: 'پارامتر جدید (مثلاً pH / بریکس)',
      parameterType: 'physicochemical',
      unit: '',
      targetValue: '0',
      testingMethod: 'روش استاندارد آزمایشگاهی'
    };
    setCurrentProject({
      ...currentProject,
      qcSpecifications: [...currentProject.qcSpecifications, newQc]
    });
  };

  const handleDeleteQcSpec = (id: string) => {
    setCurrentProject({
      ...currentProject,
      qcSpecifications: currentProject.qcSpecifications.filter((q) => q.id !== id)
    });
  };

  // Test Result Logging Handler
  const handleAddTestResult = () => {
    const newResult: TestResultEntry = {
      id: `tr_${Date.now()}`,
      trialDate: new Date().toISOString().split('T')[0],
      formulationVersionId: activeFormulationId,
      batchNumber: `BATCH-${Date.now().toString().slice(-4)}`,
      scale: currentProject.productionScale,
      batchSizeKg: targetBatchWeightKg,
      measuredParameters: {},
      sensoryScores: {
        appearance: 8,
        texture: 8,
        flavor: 8,
        aroma: 8,
        overallLiking: 8,
        panelNotes: 'ارزیابی حسی اولیه مطلوب است.'
      },
      overallVerdict: 'passed',
      operatorOrScientist: currentProject.leadFoodScientist,
      conclusionsAndNextSteps: 'نمونه جهت آزمون‌های پایداری ماندگاری ارسال شد.'
    };
    setCurrentProject({
      ...currentProject,
      testResults: [newResult, ...currentProject.testResults]
    });
  };

  // Batch Scaling Output Calculation
  const scalingResult = activeFormulation
    ? calculateBatchScaling(
        activeFormulation.ingredients,
        targetBatchWeightKg,
        processLossPercent
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="بازگشت به فهرست پروژه‌ها"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {currentProject.productNameFa}
              </h2>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                {currentProject.code}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              مسئول فرمولاسیون: {currentProject.leadFoodScientist}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
          <button
            id="open-ai-advisor-btn"
            onClick={() => setIsAiAdvisorOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>مشاور هوشمند فرمولاسیون</span>
          </button>

          <button
            id="open-compare-formulations-btn"
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>مقایسه فرمول‌ها</span>
          </button>

          <button
            id="save-product-project-btn"
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
          >
            {saveSuccessNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccessNotice ? 'ذخیره شد' : 'ذخیره تغییرات'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('formulation')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'formulation'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>فرمولاسیون و مواد اولیه</span>
        </button>

        <button
          onClick={() => setActiveTab('scaling')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'scaling'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Scale-up، Costing و اقتصاد محصول</span>
        </button>

        <button
          onClick={() => setActiveTab('process')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'process'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>فرآیند تولید، دما، زمان و تجهیزات</span>
        </button>

        <button
          onClick={() => setActiveTab('packaging')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'packaging'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>شرایط نگهداری و بسته‌بندی</span>
        </button>

        <button
          onClick={() => setActiveTab('qc_shelflife')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'qc_shelflife'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>کنترل کیفیت و ماندگاری</span>
        </button>

        <button
          onClick={() => setActiveTab('test_trials')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'test_trials'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>ثبت نتایج آزمون‌های واقعی</span>
        </button>

        <button
          onClick={() => setActiveTab('troubleshooting')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'troubleshooting'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>عیب‌یابی و مشکلات احتمالی</span>
        </button>
      </div>

      {/* TAB 1: FORMULATION & INGREDIENT PERCENTAGES */}
      {activeTab === 'formulation' && activeFormulation && (
        <div className="space-y-6">
          {/* Product Idea & Target Specifications Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-black text-stone-900 dark:text-stone-100">
                  ایده محصول و مشخصات هدف کیفیت (Product Idea & Target Specs)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-stone-500">
                INSO / CODEX Compliant
              </span>
            </div>

            {/* Product Idea Description */}
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50">
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 block mb-1">
                ایده نوآورانه و مفهوم محصول (Product Concept):
              </span>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {currentProject.productIdea ||
                  currentProject.executiveSummaryFa ||
                  'فرمولاسیون صنعتی غذایی با اهداف تغذیه‌ای و رئولوژیکی مشخص'}
              </p>
            </div>

            {/* Target Specifications Grid */}
            {currentProject.targetSpecifications && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 block">pH هدف:</span>
                  <span className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100">
                    {currentProject.targetSpecifications.targetPh || '۳.۹۰ - ۴.۱۵'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 block">بریکس هدف (°Brix):</span>
                  <span className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100">
                    {currentProject.targetSpecifications.targetBrix || '۳.۲ - ۳.۵°'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 block">پروتئین و چربی هدف:</span>
                  <span className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100">
                    {currentProject.targetSpecifications.targetProteinPercent || 'حداقل ۱.۲۰٪'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 block">ماندگاری هدف (Shelf Life):</span>
                  <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {currentProject.targetSpecifications.targetShelfLifeDays
                      ? `${currentProject.targetSpecifications.targetShelfLifeDays} روز`
                      : '۲۱ روز در ۴°C'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Formulation Version Selector Bar (Formula v1, Formula v2, Formula v3...) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                نسخه‌های فرمولاسیون (Versioning):
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {currentProject.formulations.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => {
                      setActiveFormulationId(form.id);
                      setCurrentProject({ ...currentProject, activeFormulationId: form.id });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      form.id === activeFormulationId
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <span>{form.versionCode}</span>
                    {form.isBaseline && (
                      <span className="text-[10px] font-normal opacity-80">(مرجع)</span>
                    )}
                    {form.isAiGenerated && (
                      <Sparkles className="w-3 h-3 text-amber-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 flex items-center gap-1.5 transition-all shadow-sm"
                title="مشاهده تفاوت‌های نسخه‌ها (چه چیزی تغییر کرده است؟)"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>ردیابی تغییرات (Diff)</span>
              </button>

              <button
                onClick={handleAddNewFormulationVersion}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>فرمول جدید</span>
              </button>
              <button
                onClick={handleDuplicateFormulation}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center gap-1 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>تکثیر این نسخه</span>
              </button>
            </div>
          </div>

          {/* AI Preliminary Proposal Badge or Change Log Summary for Active Version */}
          {activeFormulation.isAiGenerated && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2.5 text-xs">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">
                  علامت‌گذاری هوش مصنوعی: «پیشنهاد اولیه (Preliminary Proposal)»
                </span>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  {activeFormulation.aiPreliminaryNotice ||
                    'این فرمولاسیون یک پیشنهاد اولیه محاسباتی بر مبنای استانداردهای ملی و مقالات مرجع است و آزمون عملی آزمایشگاهی الزامی است.'}
                </p>
                {activeFormulation.scientificSources && activeFormulation.scientificSources.length > 0 && (
                  <div className="mt-1.5 pt-1.5 border-t border-amber-200 dark:border-amber-900/60 flex items-center gap-2 flex-wrap text-[10px]">
                    <span className="font-bold">مراجع مستند:</span>
                    {activeFormulation.scientificSources.map((s, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900 font-mono">
                        {s.code}: {s.claim}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeFormulation.changeLogSummary && !activeFormulation.isAiGenerated && (
            <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 flex items-center gap-2 text-xs">
              <span className="font-bold shrink-0">یادداشت تغییرات این نسخه:</span>
              <span className="text-stone-600 dark:text-stone-400">
                {activeFormulation.changeLogSummary}
              </span>
            </div>
          )}

          {/* Formulation KPIs Banner */}
          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                className={`p-4 rounded-2xl border text-center transition-all ${
                  summary.is100Percent
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-100'
                }`}
              >
                <span className="block text-[11px] font-medium text-stone-600 dark:text-stone-300 mb-1">
                  مجموع درصدها (%)
                </span>
                <div className="text-2xl font-black font-mono">
                  {summary.totalPercentage}%
                </div>
                <span className="block text-[10px] mt-1 font-semibold">
                  {summary.is100Percent
                    ? '✓ توازن دقیق ۱۰۰.۰۰٪'
                    : `انحراف: ${summary.differenceFrom100}%`}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center shadow-sm">
                <span className="block text-[11px] font-medium text-stone-600 dark:text-stone-300 mb-1">
                  ماده خشک کل (Dry Matter)
                </span>
                <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
                  {summary.totalDryMatterPercent}%
                </div>
                <span className="block text-[10px] text-stone-600 dark:text-stone-300 mt-1">
                  سهم وزنی ترکیبات غیرآبی
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center shadow-sm">
                <span className="block text-[11px] font-medium text-stone-600 dark:text-stone-300 mb-1">
                  بریکس تخمینی (°Brix)
                </span>
                <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
                  {summary.estimatedBrix}°
                </div>
                <span className="block text-[10px] text-stone-600 dark:text-stone-300 mt-1">
                  مواد جامد محلول قندی/محلول
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center shadow-sm">
                <span className="block text-[11px] font-medium text-stone-600 dark:text-stone-300 mb-1">
                  هزینه هر کیلوگرم مواد
                </span>
                <div className="text-xl font-bold text-stone-900 dark:text-stone-100 font-mono truncate">
                  {summary.estimatedCostPerKg > 0
                    ? `${summary.estimatedCostPerKg.toLocaleString('fa-IR')}`
                    : '—'}
                </div>
                <span className="block text-[10px] text-stone-600 dark:text-stone-300 mt-1">
                  تومان در هر کیلوگرم فرمول
                </span>
              </div>
            </div>
          )}

          {/* Warning banner if not 100% */}
          {summary && !summary.is100Percent && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{summary.warnings[0]}</span>
              </div>
              <button
                onClick={handleAutoBalance100}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
              >
                تعدیل و بالانس خودکار به ۱۰۰٪ (Auto-Balance)
              </button>
            </div>
          )}

          {/* Ingredients Table */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2 bg-stone-50/70 dark:bg-stone-800/50">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  جدول مواد اولیه و درصدهای فرمولاسیون (Ingredients Breakdown)
                </h3>
              </div>
              <button
                id="add-ingredient-btn"
                onClick={handleAddIngredient}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن ماده اولیه</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3">نام ماده اولیه</th>
                    <th className="p-3">نقش و عملکرد فنی</th>
                    <th className="p-3 w-28 text-center">درصد فرمول (%)</th>
                    <th className="p-3 w-24 text-center">ماده خشک (%)</th>
                    <th className="p-3 w-28 text-center">قیمت (تومان/kg)</th>
                    <th className="p-3">کد INS / توضیحات</th>
                    <th className="p-3 w-12 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {activeFormulation.ingredients.map((ing, idx) => (
                    <tr
                      key={ing.id}
                      className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="p-3 text-center text-stone-600 dark:text-stone-300 font-mono">
                        {idx + 1}
                      </td>

                      {/* Ingredient Name */}
                      <td className="p-3">
                        <input
                          type="text"
                          value={ing.nameFa}
                          onChange={(e) => handleIngredientChange(ing.id, 'nameFa', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="نام ماده..."
                        />
                      </td>

                      {/* Function / Role */}
                      <td className="p-3">
                        <select
                          value={ing.category}
                          onChange={(e) =>
                            handleIngredientChange(
                              ing.id,
                              'category',
                              e.target.value as IngredientFunction
                            )
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          {Object.entries(INGREDIENT_FUNCTION_LABELS).map(([key, val]) => (
                            <option key={key} value={key}>
                              {val.titleFa}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Percentage */}
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={ing.percentage}
                          onChange={(e) =>
                            handleIngredientChange(
                              ing.id,
                              'percentage',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2.5 py-1.5 text-center font-mono font-bold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </td>

                      {/* Dry Matter % */}
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={ing.dryMatterPercent ?? 100}
                          onChange={(e) =>
                            handleIngredientChange(
                              ing.id,
                              'dryMatterPercent',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1.5 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </td>

                      {/* Cost per kg */}
                      <td className="p-3">
                        <input
                          type="number"
                          step="100"
                          min="0"
                          value={ing.costPerKg ?? 0}
                          onChange={(e) =>
                            handleIngredientChange(
                              ing.id,
                              'costPerKg',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1.5 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </td>

                      {/* Notes / INS */}
                      <td className="p-3">
                        <input
                          type="text"
                          value={ing.notes || ing.insNumber || ''}
                          onChange={(e) => handleIngredientChange(ing.id, 'notes', e.target.value)}
                          placeholder="کد یا گرید..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </td>

                      {/* Delete */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteIngredient(ing.id)}
                          className="p-1 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="حذف ماده اولیه"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCALE UP, PROCESS YIELD, COSTING & PRODUCT ECONOMICS */}
      {activeTab === 'scaling' && activeFormulation && (
        <BatchScalingCostingView
          activeFormulation={activeFormulation}
          projectCategory={currentProject.category}
          onUpdateIngredients={(updatedIngredients) => {
            updateIngredients(updatedIngredients);
          }}
          onAutoBalanceFormulation={handleAutoBalance100}
        />
      )}

      {/* TAB 3: PROCESS ENGINEERING, TEMPERATURE, TIME & EQUIPMENT */}
      {activeTab === 'process' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>مراحل فرآیند تولید، دما، زمان و تجهیزات (Unit Operations)</span>
            </h3>
            <button
              onClick={handleAddProcessStage}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن مرحله فرآیندی</span>
            </button>
          </div>

          <div className="space-y-4">
            {currentProject.processStages.map((stage, idx) => (
              <div
                key={stage.id}
                className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={stage.stageNameFa}
                      onChange={(e) =>
                        handleUpdateProcessStage(stage.id, 'stageNameFa', e.target.value)
                      }
                      className="font-bold text-sm text-stone-900 dark:text-stone-100 bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-stone-700 focus:border-emerald-500 focus:outline-none px-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stage.criticalControlPoint}
                        onChange={(e) =>
                          handleUpdateProcessStage(
                            stage.id,
                            'criticalControlPoint',
                            e.target.checked
                          )
                        }
                        className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        نقطه کنترل بحرانی (CCP)
                      </span>
                    </label>

                    <button
                      onClick={() => handleDeleteProcessStage(stage.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="حذف مرحله"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Process Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-red-500" />
                      <span>دما (°C)</span>
                    </label>
                    <input
                      type="text"
                      value={stage.temperatureC ?? ''}
                      onChange={(e) =>
                        handleUpdateProcessStage(stage.id, 'temperatureC', e.target.value)
                      }
                      placeholder="مثلاً: 72 - 75"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>زمان و دوره (دقیقه / ثانیه)</span>
                    </label>
                    <input
                      type="text"
                      value={stage.durationMinutes ?? ''}
                      onChange={(e) =>
                        handleUpdateProcessStage(stage.id, 'durationMinutes', e.target.value)
                      }
                      placeholder="مثلاً: 15 ثانیه یا 30 دقیقه"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-stone-500" />
                      <span>تجهیزات خط تولید</span>
                    </label>
                    <input
                      type="text"
                      value={stage.equipmentRequired.join('، ')}
                      onChange={(e) =>
                        handleUpdateProcessStage(
                          stage.id,
                          'equipmentRequired',
                          e.target.value.split('،').map((x) => x.trim())
                        )
                      }
                      placeholder="مثلاً: هموژنایزر دو مرحله‌ای، پاستوریزاتور"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description & CCP instructions */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    شرح دستورالعمل اجرایی و ملاحظات فنی مرحله
                  </label>
                  <textarea
                    rows={2}
                    value={stage.descriptionFa}
                    onChange={(e) =>
                      handleUpdateProcessStage(stage.id, 'descriptionFa', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PACKAGING & STORAGE CONDITIONS */}
      {activeTab === 'packaging' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>مشخصات مهندسی بسته‌بندی و شرایط نگهداری محصول</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  نوع ظرف و بسته‌بندی اولیه
                </label>
                <input
                  type="text"
                  value={currentProject.packaging.packageTypeFa}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      packaging: { ...currentProject.packaging, packageTypeFa: e.target.value }
                    })
                  }
                  placeholder="مثلاً: بطری PET مات با فویل سیل القایی"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  جنس مواد پلیمری و لایه‌های ممانعت‌کننده (Barrier Material)
                </label>
                <input
                  type="text"
                  value={currentProject.packaging.packagingMaterial}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      packaging: { ...currentProject.packaging, packagingMaterial: e.target.value }
                    })
                  }
                  placeholder="مثلاً: Multi-layer PET/EVOH/PE"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  دمای بهینه نگهداری محصول
                </label>
                <input
                  type="text"
                  value={currentProject.packaging.targetStorageTemperature}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      packaging: {
                        ...currentProject.packaging,
                        targetStorageTemperature: e.target.value
                      }
                    })
                  }
                  placeholder="مثلاً: 4°C - 8°C (یخچالی)"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  زمان ماندگاری هدف (روز)
                </label>
                <input
                  type="number"
                  value={currentProject.packaging.targetShelfLifeDays}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      packaging: {
                        ...currentProject.packaging,
                        targetShelfLifeDays: parseInt(e.target.value) || 30
                      }
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                دستورالعمل نگهداری و شرایط مصرف بر روی برچسب محصول
              </label>
              <textarea
                rows={2}
                value={currentProject.packaging.storageInstructionsFa}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    packaging: {
                      ...currentProject.packaging,
                      storageInstructionsFa: e.target.value
                    }
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: QUALITY CONTROL & SHELF-LIFE SPECIFICATIONS */}
      {activeTab === 'qc_shelflife' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>مشخصات کنترل کیفیت پذیرش محصول (Acceptance QC Specs)</span>
              </h3>
              <button
                onClick={handleAddQcSpec}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن پارامتر QC</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="p-3">نام پارامتر آزمون</th>
                    <th className="p-3">نوع شاخص</th>
                    <th className="p-3 w-24 text-center">واحد</th>
                    <th className="p-3 w-28 text-center">مقدار هدف</th>
                    <th className="p-3">روش آزمون / رفرنس استاندارد</th>
                    <th className="p-3 w-12 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {currentProject.qcSpecifications.map((qc) => (
                    <tr key={qc.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                      <td className="p-3">
                        <input
                          type="text"
                          value={qc.parameterNameFa}
                          onChange={(e) => {
                            const updated = currentProject.qcSpecifications.map((q) =>
                              q.id === qc.id ? { ...q, parameterNameFa: e.target.value } : q
                            );
                            setCurrentProject({ ...currentProject, qcSpecifications: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none"
                        />
                      </td>

                      <td className="p-3">
                        <select
                          value={qc.parameterType}
                          onChange={(e) => {
                            const updated = currentProject.qcSpecifications.map((q) =>
                              q.id === qc.id
                                ? { ...q, parameterType: e.target.value as any }
                                : q
                            );
                            setCurrentProject({ ...currentProject, qcSpecifications: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none"
                        >
                          <option value="physicochemical">فیزیکوشیمیایی</option>
                          <option value="microbiological">میکروبیولوژی</option>
                          <option value="sensory">ارزیابی حسی</option>
                          <option value="rheological">رئولوژی و بافت</option>
                        </select>
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={qc.unit}
                          onChange={(e) => {
                            const updated = currentProject.qcSpecifications.map((q) =>
                              q.id === qc.id ? { ...q, unit: e.target.value } : q
                            );
                            setCurrentProject({ ...currentProject, qcSpecifications: updated });
                          }}
                          className="w-full px-2 py-1.5 text-center font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={qc.targetValue}
                          onChange={(e) => {
                            const updated = currentProject.qcSpecifications.map((q) =>
                              q.id === qc.id ? { ...q, targetValue: e.target.value } : q
                            );
                            setCurrentProject({ ...currentProject, qcSpecifications: updated });
                          }}
                          className="w-full px-2 py-1.5 text-center font-mono font-semibold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={qc.testingMethod}
                          onChange={(e) => {
                            const updated = currentProject.qcSpecifications.map((q) =>
                              q.id === qc.id ? { ...q, testingMethod: e.target.value } : q
                            );
                            setCurrentProject({ ...currentProject, qcSpecifications: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none"
                        />
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteQcSpec(qc.id)}
                          className="p-1 text-stone-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TEST RESULTS & SENSORY LOGGING */}
      {activeTab === 'test_trials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>ثبت نتایج بچ‌های آزمایشی، ارزیابی حسی و تحلیل هوشمند آزمایشگاه</span>
              </h3>
              <p className="text-xs text-stone-500">
                بررسی خطاهای چهارگانه اندازه‌گیری (تجهیزات، کالیبراسیون، معرف، آماده‌سازی) و ترندهای آماری
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedTestResultForAnalysis(undefined);
                  setIsLabAnalysisModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all"
              >
                <Microscope className="w-4 h-4" />
                <span>تحلیل هوشمند نتیجه آزمایش (Part 29)</span>
              </button>

              <button
                onClick={handleAddTestResult}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت سریع بچ</span>
              </button>
            </div>
          </div>

          {currentProject.testResults.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-500 space-y-3">
              <p>هنوز نتیجه آزمایشی برای این پروژه ثبت نشده است.</p>
              <button
                onClick={() => {
                  setSelectedTestResultForAnalysis(undefined);
                  setIsLabAnalysisModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white inline-flex items-center gap-2"
              >
                <Microscope className="w-4 h-4" />
                <span>ورود داده و تحلیل هوشمند اولین بچ</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentProject.testResults.map((tr) => (
                <div
                  key={tr.id}
                  className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg">
                        {tr.batchNumber}
                      </span>
                      <span className="text-xs text-stone-500">تاریخ: {tr.trialDate}</span>
                      <span className="text-xs text-stone-500">
                        وزن بچ: {tr.batchSizeKg} کیلوگرم
                      </span>
                      <span className="text-xs text-stone-500">
                        آزمون‌گر: {tr.operatorOrScientist}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTestResultForAnalysis(tr);
                          setIsLabAnalysisModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-purple-700 dark:text-purple-300 flex items-center gap-1 transition-colors"
                        title="مشاهده گزارش عیب‌یابی و ممیزی کالیبراسیون/معرف"
                      >
                        <Microscope className="w-3.5 h-3.5" />
                        <span>تحلیل آزمایشگاهی</span>
                      </button>

                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          tr.overallVerdict === 'passed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tr.overallVerdict === 'passed' ? 'تأیید کیفی (Passed)' : 'نیازمند اصلاح'}
                      </span>
                    </div>
                  </div>

                  {/* Intelligent Analysis Diagnostics Summary Banner */}
                  {tr.intelligentAnalysis && (
                    <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-purple-600" />
                          <span>گزارش تحلیل هوشمند کیفیت: {tr.intelligentAnalysis.overallStatusFa}</span>
                        </span>
                        <span className="font-mono text-[10px] text-stone-500">
                          نرخ انطباق: {tr.intelligentAnalysis.complianceRatePercent}٪
                        </span>
                      </div>
                      <p className="text-stone-700 dark:text-stone-300 text-xs">
                        {tr.intelligentAnalysis.summaryVerdictFa}
                      </p>

                      {/* Probable Cause Non-Dogmatic Phrasing Preview */}
                      {tr.intelligentAnalysis.probableErrorHypotheses.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-purple-100 dark:border-purple-900/60 text-[11px] text-stone-600 dark:text-stone-400">
                          <strong>تحلیل ریشه‌ای خطا: </strong>
                          {tr.intelligentAnalysis.probableErrorHypotheses[0].hypothesisStatementFa}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Measured Parameters Grid */}
                  {Object.keys(tr.measuredParameters).length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {Object.entries(tr.measuredParameters).map(([pName, pVal]) => (
                        <div
                          key={pName}
                          className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-center"
                        >
                          <span className="block text-[10px] text-stone-500 truncate">{pName}</span>
                          <span className="font-bold font-mono text-stone-900 dark:text-stone-100">
                            {pVal.value} {pVal.unit || ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {tr.sensoryScores && (
                    <div className="grid grid-cols-5 gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 text-center text-xs">
                      <div>
                        <span className="block text-[10px] text-stone-600 dark:text-stone-300">ظاهر و رنگ</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {tr.sensoryScores.appearance} / ۹
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-600 dark:text-stone-300">بافت دهانی</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {tr.sensoryScores.texture} / ۹
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-600 dark:text-stone-300">طعم و مزه</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {tr.sensoryScores.flavor} / ۹
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-600 dark:text-stone-300">عطر و بو</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {tr.sensoryScores.aroma} / ۹
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-600 dark:text-stone-300">پذیرش کلی</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {tr.sensoryScores.overallLiking} / ۹
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    <strong>یادداشت و جمع‌بندی:</strong> {tr.conclusionsAndNextSteps}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: TROUBLESHOOTING GUIDE */}
      {activeTab === 'troubleshooting' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>راهنمای عیب‌یابی، پیش‌بینی عیوب و راهکارهای مهندسی فرآیند</span>
          </h3>

          {currentProject.troubleshootingGuide.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3"
            >
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {item.defectNameFa}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 space-y-1">
                  <span className="font-bold text-red-800 dark:text-red-300 block mb-1">
                    علل ریشه‌ای احتمالی:
                  </span>
                  {item.possibleCausesFa.map((cause, idx) => (
                    <p key={idx} className="text-stone-700 dark:text-stone-300">
                      • {cause}
                    </p>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                    راهکارهای اصلاح فرمولاسیون و فرآیند:
                  </span>
                  {item.formulationRemediesFa.map((rem, idx) => (
                    <p key={idx} className="text-stone-700 dark:text-stone-300">
                      • {rem}
                    </p>
                  ))}
                  {item.processRemediesFa.map((rem, idx) => (
                    <p key={idx} className="text-stone-700 dark:text-stone-300">
                      • {rem}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {isCompareModalOpen && (
        <MultiFormulationCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          project={currentProject}
          initialBaseVersionId={currentProject.formulations[0]?.id}
          initialTargetVersionId={activeFormulation?.id}
        />
      )}

      {isAiAdvisorOpen && (
        <AiProductAdvisorModal
          isOpen={isAiAdvisorOpen}
          onClose={() => setIsAiAdvisorOpen(false)}
          project={currentProject}
          activeFormulation={activeFormulation}
          onApplyNewVersion={(newVersion) => {
            const updated = {
              ...currentProject,
              formulations: [...currentProject.formulations, newVersion],
              activeFormulationId: newVersion.id
            };
            setCurrentProject(updated);
            setActiveFormulationId(newVersion.id);
            onSave(updated);
          }}
        />
      )}

      {isLabAnalysisModalOpen && (
        <IntelligentLabAnalysisModal
          isOpen={isLabAnalysisModalOpen}
          onClose={() => {
            setIsLabAnalysisModalOpen(false);
            setSelectedTestResultForAnalysis(undefined);
          }}
          project={currentProject}
          initialTestResult={selectedTestResultForAnalysis}
          onSaveAnalysisResult={(updatedResult) => {
            const existingIdx = currentProject.testResults.findIndex((t) => t.id === updatedResult.id);
            let updatedList: TestResultEntry[];
            if (existingIdx >= 0) {
              updatedList = currentProject.testResults.map((t, i) => (i === existingIdx ? updatedResult : t));
            } else {
              updatedList = [updatedResult, ...currentProject.testResults];
            }
            const updatedProj: ProductDevelopmentProject = {
              ...currentProject,
              testResults: updatedList,
              updatedAt: new Date().toISOString()
            };
            setCurrentProject(updatedProj);
            onSave(updatedProj);
          }}
        />
      )}
    </div>
  );
};
