/**
 * Food Science AI - Laboratory Sample Preparation Card (Stage 4 of Digital Lab Workflow)
 * 
 * Strict 5-Stage Sequential Architecture:
 * Sample ↓ Sampling ↓ Preparation ↓ Conditioning ↓ Analysis
 * 
 * Manages all 13 standard sample preparation parameters:
 * Sample Type, Sample Amount, Sampling Method, Containers, Preliminary Prep,
 * Homogenization, Dilution, Filtration, Extraction, Storage Conditions, Storage Time,
 * Temperature, and Critical Warnings.
 * 
 * Strictly separated from the main SOP procedure.
 */

import React, { useState } from 'react';
import {
  Package,
  Boxes,
  Scissors,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Eye,
  Info,
  Layers,
  FileText,
  Clock,
  Droplet,
  Filter,
  FlaskConical,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { LabSession, LabSamplePrepData } from '../../types/laboratory';
import { SAMPLE_PREP_STAGES, SamplePrepStageId } from '../../types/samplePreparation';

interface LabSamplePrepCardProps {
  session: LabSession;
  onUpdateSamplePrep: (data: Partial<LabSamplePrepData>) => void;
  onProceedToProcedure: () => void;
  onBackToReagents: () => void;
}

export const LabSamplePrepCard: React.FC<LabSamplePrepCardProps> = ({
  session,
  onUpdateSamplePrep,
  onProceedToProcedure,
  onBackToReagents
}) => {
  const prepData = session.samplePrepData || {
    isPrepared: false,
    selectedMethodId: 'method-default',
    selectedMethodTitle: 'روش استاندارد آماده‌سازی',
    sampleType: session.sampleName || '',
    sampleWeightGrams: '',
    sampleVolumeMl: '',
    containerUsed: 'ظرف شیشه‌ای کهربایی درپیچ‌دار استاندارد',
    appearanceObservation: '',
    homogenizationTool: 'آسیاب آزمایشگاهی / هموژنایزر دور متغیر',
    dilutionFactor: '1',
    filtrationUsed: 'بدون فیلتراسیون (نمونه مستقیم)',
    extractionUsed: 'بدون استخراج حلال',
    storageTemperatureRecorded: '۲۰ الی ۲۵ درجه سلسیوس',
    notes: ''
  };

  // State for all 13 parameters
  const [sampleTypeInput, setSampleTypeInput] = useState<string>(
    prepData.sampleType || session.sampleName || ''
  );
  const [weightInput, setWeightInput] = useState<string>(
    prepData.sampleWeightGrams ? String(prepData.sampleWeightGrams) : ''
  );
  const [samplingMethodInput, setSamplingMethodInput] = useState<string>(
    'نمونه‌برداری تصادفی بر اساس طرح نمونه‌برداری بهر استاندارد و اختلاط به عنوان آزمایه نماینده'
  );
  const [containerInput, setContainerInput] = useState<string>(
    prepData.containerUsed || 'ظرف شیشه‌ای در پیچ‌دار کهربایی تمیز و خشک'
  );
  const [preliminaryPrepInput, setPreliminaryPrepInput] = useState<string>(
    'حذف ناخالصی‌های سطحی، پاک‌سازی فیزیکی و رساندن به دمای یکنواخت آزمایشگاه'
  );
  const [toolInput, setToolInput] = useState<string>(
    prepData.homogenizationTool || 'آسیاب آزمایشگاهی / هموژنایزر تیغه‌ای'
  );
  const [dilutionFactorInput, setDilutionFactorInput] = useState<string>(
    prepData.dilutionFactor ? String(prepData.dilutionFactor) : '1'
  );
  const [diluentInput, setDiluentInput] = useState<string>('بدون رقت‌سازی (مستقیم)');
  const [filtrationInput, setFiltrationInput] = useState<string>(
    prepData.filtrationUsed || 'بدون نیاز به صاف کردن'
  );
  const [extractionInput, setExtractionInput] = useState<string>(
    prepData.extractionUsed || 'بدون نیاز به استخراج فاز'
  );
  const [storageConditionsInput, setStorageConditionsInput] = useState<string>(
    'محیط خشک، دور از تابش نور مستقیم و رطوبت محیطی'
  );
  const [storageTimeInput, setStorageTimeInput] = useState<string>(
    'انجام بلافاصله آزمون (حداکثر تا ۲ ساعت)'
  );
  const [temperatureInput, setTemperatureInput] = useState<string>(
    prepData.storageTemperatureRecorded || '۲۰ الی ۲۵ درجه سلسیوس'
  );
  const [appearanceInput, setAppearanceInput] = useState<string>(
    prepData.appearanceObservation || ''
  );
  const [notesInput, setNotesInput] = useState<string>(prepData.notes || '');

  // Stepwise stage completion check
  const [stagesVerified, setStagesVerified] = useState<Record<SamplePrepStageId, boolean>>({
    sample: Boolean(weightInput || prepData.sampleWeightGrams),
    sampling: true,
    preparation: Boolean(toolInput),
    conditioning: true,
    analysis: Boolean(prepData.isPrepared)
  });

  const [activeStageTab, setActiveStageTab] = useState<SamplePrepStageId>('sample');
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleStageVerified = (stageId: SamplePrepStageId) => {
    setStagesVerified((prev) => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const handleSaveAndConfirm = () => {
    // Strict Validation: Ensure required preparation parameters are filled
    if (!weightInput.trim()) {
      setValidationError('لطفاً مقدار یا وزن نمونه برداشته‌شده را وارد نمایید. آزمون بدون ثبت مقدار اولیه آزمایه قابل اجرا نیست.');
      setActiveStageTab('sample');
      return;
    }

    if (!containerInput.trim()) {
      setValidationError('لطفاً ظرف نمونه‌برداری و نگهداری را مشخص کنید.');
      setActiveStageTab('sampling');
      return;
    }

    if (!toolInput.trim()) {
      setValidationError('لطفاً ابزار یا نحوه همگن‌سازی نمونه را ثبت نمایید.');
      setActiveStageTab('preparation');
      return;
    }

    setValidationError(null);

    onUpdateSamplePrep({
      isPrepared: true,
      preparedAt: new Date().toISOString(),
      sampleType: sampleTypeInput,
      sampleWeightGrams: weightInput,
      containerUsed: containerInput,
      appearanceObservation: appearanceInput,
      homogenizationTool: toolInput,
      dilutionFactor: dilutionFactorInput,
      filtrationUsed: filtrationInput,
      extractionUsed: extractionInput,
      storageTemperatureRecorded: temperatureInput,
      notes: notesInput,
      stageCompletionStatus: {
        sample: true,
        sampling: true,
        preparation: true,
        conditioning: true,
        analysis: true
      }
    });

    onProceedToProcedure();
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xs overflow-hidden mb-6" dir="rtl">
      {/* Header */}
      <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                ۴. سیستم آماده‌سازی نمونه (Sample Preparation Pipeline)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                مرحله ۴ از ۷ ورک‌فلو
              </span>
            </div>
            <p className="text-xs text-stone-500">
              فرآیند ۵ مرحله‌ای: Sample ↓ Sampling ↓ Preparation ↓ Conditioning ↓ Analysis
            </p>
          </div>
        </div>

        <span
          className={`text-xs px-3 py-1.5 rounded-xl font-bold self-start sm:self-center ${
            prepData.isPrepared
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
          }`}
        >
          {prepData.isPrepared ? 'آماده‌سازی تایید شد ✓' : 'در انتظار تایید مراحل'}
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Process Separation Callout */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/20 dark:border-amber-700/40 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="block font-bold text-amber-900 dark:text-amber-200">
              حفاظت از استقلال مرحله آماده‌سازی (Sample Preparation vs SOP Procedure):
            </strong>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
              آماده‌سازی آزمایه یک مرحله پیش‌نیاز، کاملاً مستقل از روش آزمون اصلی است. پس از تایید ۵ مرحله این بخش، نمونه پایدارشده به مرحله ۵ (روش انجام آزمون تحلیلی) تحویل داده می‌شود.
            </p>
          </div>
        </div>

        {/* 5-Stage Stepper Navigation Bar */}
        <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(SAMPLE_PREP_STAGES) as SamplePrepStageId[]).map((stageKey, idx) => {
              const meta = SAMPLE_PREP_STAGES[stageKey];
              const isSelected = activeStageTab === stageKey;
              const isDone = stagesVerified[stageKey];

              return (
                <button
                  key={stageKey}
                  type="button"
                  onClick={() => setActiveStageTab(stageKey)}
                  className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 min-h-[52px] ${
                    isSelected
                      ? 'bg-white dark:bg-stone-800 border-amber-500 shadow-2xs ring-2 ring-amber-500/20'
                      : 'bg-white/60 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:bg-white text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 font-mono ${
                        isDone ? 'bg-emerald-600' : 'bg-stone-400'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="text-[11px] font-bold text-stone-900 dark:text-stone-100 truncate">
                        {meta.titleFa.split(' ')[0]}
                      </div>
                      <div className="text-[9px] text-stone-400 font-mono uppercase truncate">
                        {meta.titleEn.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                  {idx < 4 && (
                    <span className="text-stone-300 dark:text-stone-600 text-xs hidden sm:inline">
                      ←
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Interactive Parameter Cards based on 5 Stages */}
        <div className="space-y-4">
          {/* STAGE 1: SAMPLE */}
          {activeStageTab === 'sample' && (
            <div className="p-5 rounded-2xl bg-sky-50/30 dark:bg-sky-950/10 border border-sky-200 dark:border-sky-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-sky-100 dark:border-sky-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-sky-600" />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      مرحله ۱: نوع و مقدار نمونه (Sample Matrix & Amount)
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      شناسایی ماتریس آزمایه، مقدار وزنی یا حجمی، و تلورانس توزین
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-sky-800 dark:text-sky-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stagesVerified.sample}
                    onChange={() => toggleStageVerified('sample')}
                    className="rounded border-sky-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>تأیید فاز نمونه</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Sample Type */}
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-800 dark:text-stone-200 block">
                    نوع نمونه و ماتریس غذایی (Sample Type):
                  </label>
                  <input
                    type="text"
                    value={sampleTypeInput}
                    onChange={(e) => setSampleTypeInput(e.target.value)}
                    placeholder="مثلاً: شیر پاستوریزه کم‌چرب، روغن آفتابگردان، آرد گندم..."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Sample Amount / Weight */}
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    <Scale className="w-4 h-4 text-indigo-500" />
                    <span>مقدار دقیق نمونه آزمایه (گرم یا میلی‌لیتر):</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={weightInput}
                      onChange={(e) => {
                        setWeightInput(e.target.value);
                        if (e.target.value) {
                          setStagesVerified((p) => ({ ...p, sample: true }));
                        }
                      }}
                      placeholder="مثلاً: ۵.۰۰۲ یا ۱۰.۰۰۰"
                      className="w-full text-xs p-2.5 pl-14 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-mono outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-bold text-stone-400">
                      g / mL
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500 block">
                    رواداری کالیبراسیون ترازو: ± ۰.۰۰۱ گرم
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: SAMPLING */}
          {activeStageTab === 'sampling' && (
            <div className="p-5 rounded-2xl bg-teal-50/30 dark:bg-teal-950/10 border border-teal-200 dark:border-teal-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-teal-100 dark:border-teal-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-teal-600" />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      مرحله ۲: نحوه نمونه‌برداری و ظروف (Sampling & Containers)
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      ثبت پروتکل نمونه‌برداری نماینده و ظروف استاندارد نگهداری
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-teal-800 dark:text-teal-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stagesVerified.sampling}
                    onChange={() => toggleStageVerified('sampling')}
                    className="rounded border-teal-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>تأیید فاز نمونه‌برداری</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Sampling Protocol */}
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-800 dark:text-stone-200 block">
                    نحوه نمونه‌برداری (Sampling Protocol):
                  </label>
                  <input
                    type="text"
                    value={samplingMethodInput}
                    onChange={(e) => setSamplingMethodInput(e.target.value)}
                    placeholder="روش نمونه‌برداری از بهر یا خط تولید..."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Containers */}
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-800 dark:text-stone-200 block">
                    ظروف نگهداری و نمونه‌برداری (Containers):
                  </label>
                  <input
                    type="text"
                    value={containerInput}
                    onChange={(e) => setContainerInput(e.target.value)}
                    placeholder="ظروف شیشه‌ای کهربایی، ظروف استریل هوابند..."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: PREPARATION */}
          {activeStageTab === 'preparation' && (
            <div className="p-5 rounded-2xl bg-amber-50/30 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-100 dark:border-amber-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      مرحله ۳: عملیات آماده‌سازی، همگن‌سازی، رقیق‌سازی، فیلتراسیون و استخراج
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      ثبت ابزار یکنواخت‌سازی، ضرایب رقت، نوع صافی و تکنیک‌های استخراج
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stagesVerified.preparation}
                    onChange={() => toggleStageVerified('preparation')}
                    className="rounded border-amber-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>تأیید عملیات آماده‌سازی</span>
                </label>
              </div>

              <div className="space-y-4 text-xs">
                {/* Preliminary Prep & Homogenization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-800 dark:text-stone-200 block">
                      آماده‌سازی اولیه (Preliminary Prep):
                    </label>
                    <input
                      type="text"
                      value={preliminaryPrepInput}
                      onChange={(e) => setPreliminaryPrepInput(e.target.value)}
                      placeholder="جداسازی ضایعات، شستشو، ذوب ملایم در بن‌ماری..."
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-800 dark:text-stone-200 block">
                      ابزار و نحوه همگن‌سازی (Homogenization Tool):
                    </label>
                    <input
                      type="text"
                      value={toolInput}
                      onChange={(e) => setToolInput(e.target.value)}
                      placeholder="آسیاب آزمایشگاهی، استومیکر، همزن مغناطیسی..."
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Dilution, Filtration, Extraction Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Dilution */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-sky-500" />
                      <span>رقیق‌سازی (Dilution):</span>
                    </span>
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">فاکتور رقت (F):</span>
                      <input
                        type="text"
                        value={dilutionFactorInput}
                        onChange={(e) => setDilutionFactorInput(e.target.value)}
                        placeholder="۱ (بدون رقت)، ۱۰، ۱۰۰..."
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                      />
                    </div>
                  </div>

                  {/* Filtration */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-indigo-500" />
                      <span>فیلتراسیون (Filtration):</span>
                    </span>
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">نوع صافی / سانتریفیوژ:</span>
                      <input
                        type="text"
                        value={filtrationInput}
                        onChange={(e) => setFiltrationInput(e.target.value)}
                        placeholder="واتمن ۴۲، فیلتر سرنگی ۰.۴۵ میکرون..."
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                      />
                    </div>
                  </div>

                  {/* Extraction */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-purple-500" />
                      <span>استخراج (Extraction):</span>
                    </span>
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">حلال و تکنیک استخراج:</span>
                      <input
                        type="text"
                        value={extractionInput}
                        onChange={(e) => setExtractionInput(e.target.value)}
                        placeholder="دی‌اتیل اتر، سوکسله، بدون استخراج..."
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: CONDITIONING */}
          {activeStageTab === 'conditioning' && (
            <div className="p-5 rounded-2xl bg-violet-50/30 dark:bg-violet-950/10 border border-violet-200 dark:border-violet-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-violet-100 dark:border-violet-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-violet-600" />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      مرحله ۴: شرایط نگهداری، زمان نگهداری و دما (Conditioning)
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      پایدارسازی دما و محیط نمونه پیش از ورود به فاز اندازه‌گیری
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-violet-800 dark:text-violet-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stagesVerified.conditioning}
                    onChange={() => toggleStageVerified('conditioning')}
                    className="rounded border-violet-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>تأیید فاز نگهداری و تطابق</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Storage Conditions */}
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-800 dark:text-stone-200 block">
                    شرایط نگهداری (Storage Conditions):
                  </label>
                  <input
                    type="text"
                    value={storageConditionsInput}
                    onChange={(e) => setStorageConditionsInput(e.target.value)}
                    placeholder="محیط تاریک و خشک، دسیکاتور..."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {/* Storage Time */}
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>زمان نگهداری و ماند (Holding Time):</span>
                  </label>
                  <input
                    type="text"
                    value={storageTimeInput}
                    onChange={(e) => setStorageTimeInput(e.target.value)}
                    placeholder="حداکثر ۲ ساعت، آزمون فوری..."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {/* Temperature */}
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    <span>دمای نمونه و محیط (Temperature):</span>
                  </label>
                  <input
                    type="text"
                    value={temperatureInput}
                    onChange={(e) => setTemperatureInput(e.target.value)}
                    placeholder="۲۰ الی ۲۵ درجه سلسیوس"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STAGE 5: ANALYSIS HANDOVER */}
          {activeStageTab === 'analysis' && (
            <div className="p-5 rounded-2xl bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/50 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      مرحله ۵: تحویل به آنالیز و معیارهای آمادگی (Analysis Handover)
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      ارزیابی ارگانولپتیک نهایی و تایید انتقال به گام‌های اجرایی آزمون (Procedure)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Organoleptic Observations */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2">
                  <label className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-500" />
                    <span>مشاهدات ارگانولپتیک، رنگ، بو و ظاهر نمونه قبل از آزمون:</span>
                  </label>
                  <input
                    type="text"
                    value={appearanceInput}
                    onChange={(e) => setAppearanceInput(e.target.value)}
                    placeholder="مثال: مایع زلال، رنگ زرد کهربایی، فاقد بوی ترشیدگی، یکنواخت و بدون فاز جداگانه..."
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Operator Notes */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2">
                  <label className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-stone-500" />
                    <span>یادداشت‌های اختصاصی اپراتور در آماده‌سازی:</span>
                  </label>
                  <textarea
                    rows={2}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="توضیحات تکمیلی در خصوص رفتار آزمایه، شرایط توزین یا نکات خاص..."
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Navigation Between the 5 Stages */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 text-[11px]">جابجایی بین فازهای آماده‌سازی:</span>
            <div className="flex items-center gap-1">
              {(Object.keys(SAMPLE_PREP_STAGES) as SamplePrepStageId[]).map((stageKey, i) => (
                <button
                  key={stageKey}
                  type="button"
                  onClick={() => setActiveStageTab(stageKey)}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono transition-colors ${
                    activeStageTab === stageKey
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <span className="text-[11px] font-mono text-stone-400">
            {weightInput ? `وزن: ${weightInput}g` : 'توزین انجام نشده'}
          </span>
        </div>

        {/* Footer Actions: Back to Reagents OR Proceed to Procedure */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToReagents}
            className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به بررسی معرف‌ها</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndConfirm}
            className="min-h-[42px] px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>تأیید نهایی ۵ مرحله آماده‌سازی و ورود به مراحل روش آزمون (Procedure)</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
