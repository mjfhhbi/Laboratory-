import React, { useState, useMemo, useEffect } from 'react';
import { 
  AlertTriangle, 
  FlaskConical, 
  Layers, 
  Scale, 
  Flame, 
  Clock, 
  Pipette, 
  Cpu, 
  Calculator, 
  ShieldAlert, 
  Archive, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Sliders, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  Check, 
  Wrench, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { 
  LAB_ERROR_CATEGORIES, 
  LAB_TEST_STAGES, 
  LabErrorCategory, 
  LabTestStage, 
  DiagnosedLabError, 
  LabTroubleshootingSession 
} from '../../types/troubleshooting';
import { 
  EXPERIMENT_TROUBLESHOOT_TEMPLATES, 
  ExperimentTroubleshootTemplate 
} from '../../data/troubleshootingKnowledgeBase';
import { 
  runLaboratoryDiagnosis, 
  detectLabNumericalAnomalies 
} from '../../lib/troubleshooting/diagnosticEngine';
import { putItem, STORES } from '../../lib/storage/indexedDb';

interface Props {
  onSessionSaved?: (session: LabTroubleshootingSession) => void;
  initialSession?: LabTroubleshootingSession | null;
}

export const LabTroubleshootingWizard: React.FC<Props> = ({ onSessionSaved, initialSession }) => {
  // 1. Experiment Selection
  const [selectedExpId, setSelectedExpId] = useState<string>(initialSession?.experimentId || 'moisture_oven');
  
  // 2. Stage Selection
  const [selectedStage, setSelectedStage] = useState<LabTestStage>(initialSession?.stage || 'cooling_desiccator');
  
  // 3. User Narrative & Symptoms
  const [userNarrative, setUserNarrative] = useState<string>(initialSession?.userActionDescription || '');
  const [selectedSymptomTags, setSelectedSymptomTags] = useState<string[]>(initialSession?.selectedSymptomTags || ['wt_increase']);

  // 4. Equipment List
  const [equipmentList, setEquipmentList] = useState<{
    nameFa: string;
    calibrationStatus: 'valid' | 'expired' | 'uncalibrated' | 'unknown';
    notes?: string;
  }[]>(() => {
    if (initialSession?.equipmentUsed && initialSession.equipmentUsed.length > 0) {
      return initialSession.equipmentUsed.map(eq => ({
        nameFa: eq.nameFa,
        calibrationStatus: (eq.calibrationStatus || 'valid') as 'valid' | 'expired' | 'uncalibrated' | 'unknown',
        notes: eq.notes
      }));
    }
    return [
      { nameFa: 'ترازوی تحلیلی ۴ رقم اعشار (0.1mg)', calibrationStatus: 'valid', notes: 'کالیبراسیون دوره‌ای فعال' },
      { nameFa: 'دسیکاتور با سیلیکاژل', calibrationStatus: 'unknown', notes: 'سیلیکاژل نیاز به بازبینی دارد' },
      { nameFa: 'آون الکتریکی آزمایشگاهی ۱۰۵ درجه', calibrationStatus: 'valid', notes: 'دما روی ۱۰۳ تنظیم شده است' }
    ];
  });
  const [newEquipmentName, setNewEquipmentName] = useState<string>('');

  // 5. Numerical Inputs
  const [numericalValues, setNumericalValues] = useState<Record<string, number | undefined>>(() => {
    if (initialSession?.recordedValues) {
      const init: Record<string, number | undefined> = {};
      Object.entries(initialSession.recordedValues).forEach(([k, v]) => {
        init[k] = typeof v.value === 'number' ? v.value : parseFloat(v.value as string);
      });
      return init;
    }
    return {
      m0: 20.1542,
      m1: 25.1542,
      m2: 25.1842, // Anomaly: M2 > M1 to trigger realistic failure mode
      oven_temp: 103,
      drying_time: 4
    };
  });

  // 6. Interactive Questions Answered
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string>>(initialSession?.answeredQuestions || {});

  // 7. Expanded Error Card
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);

  // 8. CAPA Modal / Report State
  const [showCapaForm, setShowCapaForm] = useState<boolean>(false);
  const [investigatorName, setInvestigatorName] = useState<string>('کارشناس کنترل کیفیت شیمیایی');
  const [ncrNumber, setNcrNumber] = useState<string>(`NCR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  const [capaSavedSuccess, setCapaSavedSuccess] = useState<boolean>(false);

  // Find current template
  const currentTemplate = useMemo<ExperimentTroubleshootTemplate>(() => {
    return (
      EXPERIMENT_TROUBLESHOOT_TEMPLATES.find(t => t.id === selectedExpId) ||
      EXPERIMENT_TROUBLESHOOT_TEMPLATES[0]
    );
  }, [selectedExpId]);

  // When experiment changes, update defaults
  const handleSelectExperiment = (exp: ExperimentTroubleshootTemplate) => {
    setSelectedExpId(exp.id);
    setSelectedStage(exp.stages[0] || 'sampling_homogenization');
    setSelectedSymptomTags([]);
    setUserNarrative('');
    setAnsweredQuestions({});

    // Populate default numerical inputs
    const defaults: Record<string, number | undefined> = {};
    exp.numericalParameters.forEach(p => {
      defaults[p.key] = p.defaultValue;
    });
    setNumericalValues(defaults);

    // Populate default equipment
    setEquipmentList(exp.commonEquipment.map(eq => ({
      nameFa: eq,
      calibrationStatus: 'valid'
    })));
  };

  // Toggle symptom tag
  const handleToggleSymptom = (tagId: string) => {
    setSelectedSymptomTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  // Numerical value change
  const handleNumericalChange = (key: string, valStr: string) => {
    const parsed = valStr === '' ? undefined : parseFloat(valStr);
    setNumericalValues(prev => ({ ...prev, [key]: parsed }));
  };

  // Equipment actions
  const handleAddEquipment = () => {
    if (!newEquipmentName.trim()) return;
    setEquipmentList(prev => [
      ...prev,
      { nameFa: newEquipmentName.trim(), calibrationStatus: 'valid' }
    ]);
    setNewEquipmentName('');
  };

  const handleRemoveEquipment = (index: number) => {
    setEquipmentList(prev => prev.filter((_, i) => i !== index));
  };

  const handleEquipmentCalibChange = (index: number, status: 'valid' | 'expired' | 'uncalibrated' | 'unknown') => {
    setEquipmentList(prev => prev.map((eq, i) => i === index ? { ...eq, calibrationStatus: status } : eq));
  };

  // Run Diagnostic Engine
  const diagnosticResult = useMemo(() => {
    return runLaboratoryDiagnosis({
      experimentId: selectedExpId,
      stage: selectedStage,
      userNarrative,
      selectedSymptomIds: selectedSymptomTags,
      equipmentList,
      numericalValues,
      answeredQuestions
    });
  }, [selectedExpId, selectedStage, userNarrative, selectedSymptomTags, equipmentList, numericalValues, answeredQuestions]);

  // Set default expanded error
  useEffect(() => {
    if (diagnosticResult.primaryError && !expandedErrorId) {
      setExpandedErrorId(diagnosticResult.primaryError.id);
    }
  }, [diagnosticResult.primaryError, expandedErrorId]);

  // Handle Question Option Selection
  const handleAnswerQuestion = (qId: string, optId: string) => {
    setAnsweredQuestions(prev => ({
      ...prev,
      [qId]: optId
    }));
  };

  // Save CAPA / Investigation Session
  const handleSaveInvestigation = async () => {
    const sessionRecord: LabTroubleshootingSession = {
      id: initialSession?.id || `SESSION-${Date.now()}`,
      createdAt: initialSession?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: `عیب‌یابی: ${currentTemplate.nameFa} (${LAB_TEST_STAGES[selectedStage]?.nameFa})`,
      experimentId: selectedExpId,
      experimentNameFa: currentTemplate.nameFa,
      experimentStandardCode: currentTemplate.standardReference,
      stage: selectedStage,
      userActionDescription: userNarrative,
      observedSymptom: selectedSymptomTags.join(', '),
      selectedSymptomTags,
      equipmentUsed: equipmentList,
      recordedValues: Object.fromEntries(
        Object.entries(numericalValues).map(([k, v]) => [
          k,
          {
            labelFa: currentTemplate.numericalParameters.find(p => p.key === k)?.labelFa || k,
            value: v !== undefined ? v : '',
            unit: currentTemplate.numericalParameters.find(p => p.key === k)?.unit
          }
        ])
      ),
      answeredQuestions,
      diagnosedErrors: diagnosticResult.rankedErrors,
      primaryError: diagnosticResult.primaryError || undefined,
      status: showCapaForm ? 'capa_generated' : 'analyzed',
      capaRecord: showCapaForm && diagnosticResult.primaryError ? {
        ncrNumber,
        investigatorName,
        rootCauseSummary: diagnosticResult.primaryError.probableCauseFa,
        immediateActionTaken: diagnosticResult.primaryError.correctiveActionFa,
        preventiveActionPlan: diagnosticResult.primaryError.preventiveActionFa,
        targetCompletionDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
        verificationSignOff: 'مدیر کنترل کیفیت و تضمین کیفیت (QA/QC)',
        status: 'open'
      } : undefined
    };

    try {
      await putItem(STORES.KNOWLEDGE_BASE, {
        id: sessionRecord.id,
        category: 'common_errors',
        title: sessionRecord.title,
        englishTitle: `Lab Troubleshooting: ${currentTemplate.nameEn}`,
        content: JSON.stringify(sessionRecord),
        version: '1.0.0',
        tags: ['troubleshooting', selectedExpId, selectedStage, sessionRecord.primaryError?.category || 'error'],
        offlineAvailable: true,
        updatedAt: sessionRecord.updatedAt
      });
      setCapaSavedSuccess(true);
      if (onSessionSaved) onSessionSaved(sessionRecord);
      setTimeout(() => setCapaSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save session', e);
    }
  };

  return (
    <div className="space-y-6" id="lab-troubleshooting-wizard">
      {/* Top Banner & Science Guard */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white rounded-2xl p-5 shadow-sm border border-stone-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">
                سامانه هوشمند عیب‌یابی و ریشه‌یابی خطاهای آزمایشگاهی (Laboratory Troubleshooting)
              </h2>
            </div>
            <p className="text-xs text-stone-300 max-w-3xl leading-relaxed">
              ریشه‌یابی مبتنی بر استانداردهای مرجع (ISO 17025, AOAC, INSO)، تحلیل ناهنجاری‌های عددی و صدور اقدام اصلاحی و پیشگیرانه (CAPA).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-stone-800/80 border border-stone-700/80 px-3 py-2 rounded-xl text-left font-mono text-xs">
              <div className="text-[10px] text-stone-400 uppercase font-sans">تطابق با استاندارد</div>
              <div className="text-emerald-400 font-bold">ISO 17025 Cl. 7.10</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Inputs & Investigation, Right = Diagnosed Root Causes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Data Logging & Investigation Steps (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* STEP 1: Experiment Picker */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>گام ۱: انتخاب آزمون یا پروتکل آزمایشگاهی مورد بررسی</span>
              </label>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                {currentTemplate.standardReference.split('/')[0]}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {EXPERIMENT_TROUBLESHOOT_TEMPLATES.map(exp => {
                const isSelected = exp.id === selectedExpId;
                return (
                  <button
                    key={exp.id}
                    onClick={() => handleSelectExperiment(exp)}
                    className={`text-right p-2.5 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold ring-2 ring-emerald-500/20'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="font-semibold line-clamp-1">{exp.nameFa}</div>
                    <div className="text-[10px] text-stone-400 font-mono line-clamp-1 mt-0.5 dir-ltr text-left">
                      {exp.nameEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Stage Selection */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs space-y-3">
            <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>گام ۲: انتخاب مرحله‌ای که مشکل یا رفتار غیرعادی در آن رخ داده است</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentTemplate.stages.map(stgKey => {
                const meta = LAB_TEST_STAGES[stgKey];
                if (!meta) return null;
                const isSelected = selectedStage === stgKey;
                return (
                  <button
                    key={stgKey}
                    onClick={() => setSelectedStage(stgKey)}
                    className={`text-right p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs font-semibold'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span className="font-semibold">{meta.nameFa}</span>
                    <span className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                      {meta.descriptionFa}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: User Action & Symptoms */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs space-y-3">
            <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>گام ۳: ثبت رخداد و نشانه‌های بالینی مشاهده‌شده در آزمایشگاه</span>
            </label>

            {/* Quick Symptom Presets */}
            {currentTemplate.symptomPresets.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  نشانه‌های رایج برای آزمون انتخابی (روی موارد مشاهده‌شده کلیک کنید):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentTemplate.symptomPresets.map(preset => {
                    const isChecked = selectedSymptomTags.includes(preset.id);
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleToggleSymptom(preset.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-right flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-950 dark:text-amber-200 font-semibold'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-300'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isChecked ? 'bg-amber-500' : 'bg-stone-300'}`} />
                        <span>{preset.labelFa}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Narrative Input */}
            <div className="space-y-1">
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                شرح دقیق چیزی که کاربر انجام داده یا تغییرات مشاهده‌شده:
              </div>
              <textarea
                value={userNarrative}
                onChange={e => setUserNarrative(e.target.value)}
                placeholder="مثال: پلیت‌ها پس از ۴ ساعت آون ۱۰۳ درجه خارج شدند و بعد از ۲۰ دقیقه در دسیکاتور وزن‌کشی شدند، اما روی ترازو وزن نمونه به جای کاهش افزایش یافت..."
                rows={3}
                className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl p-3 text-xs text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* STEP 4: Equipment Used */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>گام ۴: ثبت تجهیزات استفاده‌شده و وضعیت کالیبراسیون</span>
              </label>
            </div>

            <div className="space-y-2">
              {equipmentList.map((eq, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{eq.nameFa}</span>
                    {eq.notes && <span className="text-[10px] text-stone-400">({eq.notes})</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={eq.calibrationStatus}
                      onChange={e => handleEquipmentCalibChange(idx, e.target.value as any)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded border outline-none ${
                        eq.calibrationStatus === 'valid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                          : eq.calibrationStatus === 'expired'
                          ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      <option value="valid">کالیبره معتبر</option>
                      <option value="expired">کالیبراسیون منقضی</option>
                      <option value="uncalibrated">فاقد کالیبراسیون</option>
                      <option value="unknown">نامشخص / نیاز به بررسی</option>
                    </select>

                    <button
                      onClick={() => handleRemoveEquipment(idx)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded"
                      title="حذف دستگاه"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newEquipmentName}
                  onChange={e => setNewEquipmentName(e.target.value)}
                  placeholder="افزودن دستگاه دیگر (مثلاً پی‌اچ متر، بورت، بن‌ماری...)"
                  className="flex-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-800 dark:text-stone-200 outline-none"
                  onKeyDown={e => e.key === 'Enter' && handleAddEquipment()}
                />
                <button
                  type="button"
                  onClick={handleAddEquipment}
                  className="px-3 py-1.5 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-stone-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  افزودن
                </button>
              </div>
            </div>
          </div>

          {/* STEP 5: Numerical Data & Lab Inputs */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>گام ۵: ثبت مقدارهای واردشده و داده‌های عددی آزمایشگاه</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentTemplate.numericalParameters.map(param => {
                const currentVal = numericalValues[param.key];
                return (
                  <div
                    key={param.key}
                    className="bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">{param.labelFa}</span>
                      {param.unit && <span className="font-mono text-stone-400 text-[11px]">{param.unit}</span>}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={currentVal !== undefined ? currentVal : ''}
                      onChange={e => handleNumericalChange(param.key, e.target.value)}
                      placeholder={param.placeholder || `مثلاً ${param.defaultValue ?? '0.00'}`}
                      className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-xs font-mono dir-ltr text-left outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {param.descriptionFa && (
                      <p className="text-[10px] text-stone-400">{param.descriptionFa}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Numerical Anomaly Alerts */}
            {diagnosticResult.detectedNumericalAnomalies.length > 0 && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>ناهنجاری‌های ریاضی و فیزیکی شناسایی‌شده در داده‌ها:</span>
                </div>
                <ul className="pr-5 text-xs text-rose-900 dark:text-rose-200 list-disc space-y-1 leading-relaxed">
                  {diagnosticResult.detectedNumericalAnomalies.map((ano, i) => (
                    <li key={i}>{ano}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Diagnostic Outcomes & Root Cause Trees (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Diagnostic Confidence Summary Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                سطح اطمینان و قطعیت علمی
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${diagnosticResult.overallConfidence.badgeClass}`}>
                {diagnosticResult.overallConfidence.percentage}٪ تطابق
              </span>
            </div>

            <div className="bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700/80 space-y-1.5">
              <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{diagnosticResult.overallConfidence.labelFa}</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {diagnosticResult.analysisSummaryFa}
              </p>
            </div>

            {/* Interactive Clarification Questions */}
            {diagnosticResult.followUpQuestions.length > 0 && (
              <div className="border-t border-stone-200 dark:border-stone-800 pt-3 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>پرسش‌های تکمیلی برای قطعیت عیب‌یابی:</span>
                </div>

                {diagnosticResult.followUpQuestions.map(q => (
                  <div key={q.id} className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-3 space-y-2">
                    <p className="text-xs font-semibold text-amber-950 dark:text-amber-100 leading-snug">
                      {q.questionFa}
                    </p>
                    <div className="space-y-1.5">
                      {q.options.map(opt => {
                        const isSelected = answeredQuestions[q.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleAnswerQuestion(q.id, opt.id)}
                            className={`w-full text-right p-2 rounded-lg text-xs transition-all flex items-start justify-between gap-2 border ${
                              isSelected
                                ? 'bg-amber-600 text-white border-amber-600 font-semibold shadow-xs'
                                : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-amber-300'
                            }`}
                          >
                            <div>
                              <div>{opt.labelFa}</div>
                              {opt.descriptionFa && (
                                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                                  {opt.descriptionFa}
                                </div>
                              )}
                            </div>
                            {isSelected && <Check className="w-4 h-4 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ranked Diagnosed Errors List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>خطاهای احتمالی رتبه‌بندی شده ({diagnosticResult.rankedErrors.length} مورد)</span>
              </h3>
            </div>

            {diagnosticResult.rankedErrors.map((err, rankIdx) => {
              const isExpanded = expandedErrorId === err.id;
              const catMeta = LAB_ERROR_CATEGORIES[err.category];

              return (
                <div
                  key={err.id}
                  className={`bg-white dark:bg-stone-900 border rounded-xl shadow-xs transition-all overflow-hidden ${
                    rankIdx === 0
                      ? 'border-emerald-500/80 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 dark:border-stone-800'
                  }`}
                >
                  {/* Card Header */}
                  <div
                    onClick={() => setExpandedErrorId(isExpanded ? null : err.id)}
                    className="p-4 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          رتبه #{rankIdx + 1} ({err.relevanceScore}٪ تطابق)
                        </span>
                        {catMeta && (
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${catMeta.badgeColor}`}>
                            {catMeta.nameFa}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug">
                        {err.titleFa}
                      </h4>
                    </div>

                    <button className="text-stone-400 hover:text-stone-700 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Body: 5 Pillars & Standard Source */}
                  {isExpanded && (
                    <div className="p-4 pt-0 space-y-3.5 border-t border-stone-100 dark:border-stone-800 text-xs">
                      {/* 1. Probable Cause */}
                      <div className="space-y-1">
                        <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>علت احتمالی ریشه‌ای (Probable Root Cause):</span>
                        </div>
                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed pr-4">
                          {err.probableCauseFa}
                        </p>
                      </div>

                      {/* 2. Symptom */}
                      <div className="space-y-1">
                        <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>نشانه و علامت آزمایشگاهی (Symptom):</span>
                        </div>
                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed pr-4">
                          {err.symptomFa}
                        </p>
                      </div>

                      {/* 3. Diagnostic Investigation */}
                      <div className="space-y-1">
                        <div className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1">
                          <Search className="w-3.5 h-3.5 text-blue-600" />
                          <span>روش بررسی و آزمون تشخیصی (Diagnostic Method):</span>
                        </div>
                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed pr-4">
                          {err.diagnosticMethodFa}
                        </p>
                      </div>

                      {/* 4. Corrective Action */}
                      <div className="space-y-1">
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>اقدام اصلاحی فوری (Immediate Corrective Action):</span>
                        </div>
                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed pr-4 bg-emerald-50/60 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                          {err.correctiveActionFa}
                        </p>
                      </div>

                      {/* 5. Preventive Action */}
                      <div className="space-y-1">
                        <div className="font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>روش پیشگیری درازمدت (Long-term Preventive Action):</span>
                        </div>
                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed pr-4">
                          {err.preventiveActionFa}
                        </p>
                      </div>

                      {/* MANDATORY SOURCE CARD */}
                      <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                            <span>منبع و استاندارد مرجع (Mandatory Source):</span>
                          </span>
                          <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                            {err.source.standardCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                          {err.source.fullCitation}
                        </p>
                        {err.source.clauseOrPage && (
                          <div className="text-[10px] text-stone-500 font-mono">
                            ارجاع بند: {err.source.clauseOrPage}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions: Save to Log & Generate CAPA Report */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                مستندسازی و صدور برگه عدم انطباق (ISO 17025)
              </span>
              {capaSavedSuccess && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  با موفقیت ذخیره شد
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowCapaForm(!showCapaForm)}
                className="flex-1 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>{showCapaForm ? 'بستن فرم CAPA' : 'صدور گزارش عدم انطباق و CAPA'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveInvestigation}
                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 transition-all flex items-center gap-1.5"
              >
                <Archive className="w-4 h-4" />
                <span>ذخیره در پرونده آزمایشگاه</span>
              </button>
            </div>

            {/* CAPA Form Accordion */}
            {showCapaForm && diagnosticResult.primaryError && (
              <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-500 font-medium">شماره عدم انطباق (NCR):</label>
                    <input
                      type="text"
                      value={ncrNumber}
                      onChange={e => setNcrNumber(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 font-medium">کارشناس پیگیری‌کننده:</label>
                    <input
                      type="text"
                      value={investigatorName}
                      onChange={e => setInvestigatorName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>

                <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-lg border border-stone-200 dark:border-stone-700 space-y-1">
                  <div className="font-bold text-stone-800 dark:text-stone-200">
                    خلاصه اقدام اصلاحی و پیشگیرانه (CAPA Summary):
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300">
                    اقدام فوری: {diagnosticResult.primaryError.correctiveActionFa}
                  </p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300">
                    پیشگیری: {diagnosticResult.primaryError.preventiveActionFa}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveInvestigation}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs"
                >
                  ثبت نهایی و تایید برگه عدم انطباق (Sign-off)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
