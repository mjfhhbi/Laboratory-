/**
 * Food Science AI - Lab Step Execution Card
 * Enhanced for authentic laboratory workflow execution (Part 34 of 40):
 * - Step & replicate progress bars
 * - Real-time measurement logging: Time, Temperature, Weight, Volume, Equipment used
 * - Operator notes & Error/anomaly logging
 * - Anti-hallucination / Anti-guess toggle (allows skipping with documented reason)
 * - Strict step validation before advancing with clear error explanations
 * - Save & Continue persistence support
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Info,
  Check,
  Thermometer,
  Scale,
  Pipette,
  Timer,
  Hash,
  Eye,
  Percent,
  FlaskConical,
  FileText,
  Binary,
  Cpu,
  Save,
  Gauge,
  Plus,
  RefreshCw,
  Clock
} from 'lucide-react';
import {
  LabSession,
  LabStepDefinition,
  LabStepRunData,
  LabParameterDefinition,
  LabParameterType,
  LabLoggedError
} from '../../types/laboratory';
import { validateStepRun, PARAM_TYPE_LABELS } from '../../lib/laboratory/validationEngine';

interface LabStepExecutionCardProps {
  session: LabSession;
  step: LabStepDefinition;
  stepRunData?: LabStepRunData;
  onParameterChange: (paramId: string, value: any, unit: string) => void;
  onVerificationToggle: (verified: boolean) => void;
  onNotesChange: (notes: string) => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onCompleteReplicate: () => void;
  onFieldUpdate?: (fieldName: keyof LabStepRunData, value: any) => void;
  onSelectReplicate?: (replicateNumber: number) => void;
  onSaveAndContinue?: () => void;
}

export const LabStepExecutionCard: React.FC<LabStepExecutionCardProps> = ({
  session,
  step,
  stepRunData,
  onParameterChange,
  onVerificationToggle,
  onNotesChange,
  onPreviousStep,
  onNextStep,
  onCompleteReplicate,
  onFieldUpdate,
  onSelectReplicate,
  onSaveAndContinue
}) => {
  const [newErrorText, setNewErrorText] = useState('');
  const isFirstStep = step.stepNumber === 1;
  const isLastStep = step.stepNumber === session.steps.length;

  const currentReplicate = session.replicates.find(
    (r) => r.replicateNumber === session.currentReplicateNumber
  );

  // Validate current step execution
  const validation = validateStepRun(step, stepRunData, session.standardSnapshot);

  const handleFieldChange = (field: keyof LabStepRunData, val: any) => {
    if (onFieldUpdate) {
      onFieldUpdate(field, val);
    }
  };

  const handleAddError = () => {
    if (!newErrorText.trim()) return;
    const currentErrors = stepRunData?.loggedErrors || [];
    const newErr: LabLoggedError = {
      id: `err_${Date.now()}`,
      errorText: newErrorText.trim(),
      severity: 'warning',
      loggedAt: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };
    handleFieldChange('loggedErrors', [...currentErrors, newErr]);
    setNewErrorText('');
  };

  const getParamIcon = (type: LabParameterType) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="w-4 h-4 text-rose-500" />;
      case 'mass_weight':
        return <Scale className="w-4 h-4 text-indigo-500" />;
      case 'volume':
        return <Pipette className="w-4 h-4 text-cyan-500" />;
      case 'time_duration':
        return <Timer className="w-4 h-4 text-amber-500" />;
      case 'ph_level':
        return <FlaskConical className="w-4 h-4 text-emerald-500" />;
      case 'refractive_index':
        return <Eye className="w-4 h-4 text-purple-500" />;
      case 'percentage':
        return <Percent className="w-4 h-4 text-blue-500" />;
      case 'absorbance':
        return <Hash className="w-4 h-4 text-teal-500" />;
      case 'count_cfu':
        return <Binary className="w-4 h-4 text-pink-500" />;
      case 'text_observation':
        return <FileText className="w-4 h-4 text-stone-500" />;
      default:
        return <Hash className="w-4 h-4 text-stone-500" />;
    }
  };

  const stepProgressPercent = Math.round((step.stepNumber / session.steps.length) * 100);

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden mb-6">
      {/* 1. Step & Replicate Linear Progress Bar */}
      <div className="px-6 pt-3.5 pb-2.5 bg-stone-50/70 dark:bg-stone-850/60 border-b border-stone-200 dark:border-stone-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800 dark:text-stone-200">
              پیشرفت گام‌های آزمون: مرحله {step.stepNumber} از {session.steps.length}
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              {stepProgressPercent}٪
            </span>
          </div>

          {/* Replicate Indicator & Quick Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-500 hidden sm:inline">تکرار جاری:</span>
            <div className="flex items-center gap-1">
              {session.replicates.map((r) => (
                <button
                  key={r.replicateNumber}
                  type="button"
                  onClick={() => onSelectReplicate && onSelectReplicate(r.replicateNumber)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded transition-all ${
                    r.replicateNumber === session.currentReplicateNumber
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300'
                  }`}
                  title={r.title}
                >
                  R{r.replicateNumber}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${stepProgressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Step Title Header */}
      <div className="px-6 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs">
            {step.stepNumber}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {step.titleFa}
              </h2>
              {step.titleEn && (
                <span className="text-xs font-mono text-stone-400 dark:text-stone-500 hidden sm:inline">
                  ({step.titleEn})
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              مرحله {step.stepNumber} از {session.steps.length} — {currentReplicate?.title || `تکرار ${session.currentReplicateNumber}`}
            </p>
          </div>
        </div>

        {/* Verification Status Pill */}
        <div>
          {stepRunData?.isVerified ? (
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              بازبینی و تأیید شده
            </span>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
              در انتظار تأیید
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Step Description & Instructions */}
        <div>
          {step.descriptionFa && (
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-3">
              {step.descriptionFa}
            </p>
          )}

          {step.instructions && step.instructions.length > 0 && (
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block mb-2">
                دستورالعمل اجرایی این مرحله:
              </span>
              <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 list-disc list-inside">
                {step.instructions.map((inst, i) => (
                  <li key={i} className="leading-relaxed">{inst}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Safety Warnings & Critical Points */}
        {step.safetyWarnings && step.safetyWarnings.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block mb-1">هشدار ایمنی و خطاهای مداخله‌گر:</span>
                <ul className="space-y-1 list-disc list-inside">
                  {step.safetyWarnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. Real-Time Data Logging Panel (زمان، دما، وزن، حجم، تجهیزات) */}
        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-2">
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-600" />
              <span>ثبت مستقیم متغیرهای آزمایشگاهی این گام (Live Data Entry):</span>
            </span>
            <span className="text-[11px] text-stone-400">
              ثبت زمان، دما، وزن، حجم و تجهیزات استفاده‌شده
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Time */}
            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5 text-amber-500" /> زمان:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleFieldChange(
                      'recordedTime',
                      new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    )
                  }
                  className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  ثبت اکنون
                </button>
              </label>
              <input
                type="text"
                value={stepRunData?.recordedTime || ''}
                onChange={(e) => handleFieldChange('recordedTime', e.target.value)}
                placeholder="مثلاً: ۱۴:۲۵:۱۰"
                className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-mono"
              />
            </div>

            {/* 2. Temperature */}
            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span>دما (°C):</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={stepRunData?.recordedTemperature ?? ''}
                onChange={(e) => handleFieldChange('recordedTemperature', e.target.value)}
                placeholder="مثلاً: ۲۳.۵"
                className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-mono"
              />
            </div>

            {/* 3. Weight */}
            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-indigo-500" />
                <span>وزن (g):</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={stepRunData?.recordedWeight ?? ''}
                onChange={(e) => handleFieldChange('recordedWeight', e.target.value)}
                placeholder="مثلاً: ۵.۰۰۴"
                className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-mono"
              />
            </div>

            {/* 4. Volume */}
            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1 flex items-center gap-1">
                <Pipette className="w-3.5 h-3.5 text-cyan-500" />
                <span>حجم (mL):</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={stepRunData?.recordedVolume ?? ''}
                onChange={(e) => handleFieldChange('recordedVolume', e.target.value)}
                placeholder="مثلاً: ۱۰.۵"
                className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-mono"
              />
            </div>
          </div>

          {/* Equipment Used Selection */}
          {step.equipmentUsed && step.equipmentUsed.length > 0 && (
            <div className="pt-1 border-t border-stone-200/50 dark:border-stone-800">
              <span className="text-[11px] text-stone-500 block mb-1.5 font-semibold">
                تجهیزات استفاده‌شده در این گام:
              </span>
              <div className="flex flex-wrap gap-2">
                {step.equipmentUsed.map((eqName, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1.5 font-mono"
                  >
                    <Cpu className="w-3 h-3 text-emerald-600" />
                    <span>{eqName}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Dynamic Protocol Parameters Section */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-600" />
              <span>پارامترهای محاسباتی اختصاصی استاندارد</span>
            </h3>
            <span className="text-xs text-stone-400">
              واحد و نوع داده مورد انتظار بر اساس استاندارد مرجع
            </span>
          </div>

          {step.parameters.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-1">
              در این مرحله پارامتر تحلیلی خاصی تعریف نشده است؛ صرفاً متغیرهای محیطی/وزنی فوق را ثبت کرده و تأیید فرمایید.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step.parameters.map((param) => {
                const recorded = stepRunData?.parameterValues[param.id];
                const value = recorded ? recorded.value : '';
                const typeMeta = PARAM_TYPE_LABELS[param.paramType] || PARAM_TYPE_LABELS.numeric;

                return (
                  <div
                    key={param.id}
                    className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                        {getParamIcon(param.paramType)}
                        <span>{param.nameFa}</span>
                        {param.required && <span className="text-rose-500 font-bold">*</span>}
                      </label>

                      {/* Type and Unit badge */}
                      <span className="text-[11px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono">
                        {typeMeta.fa} {param.expectedUnit ? `[${param.expectedUnit}]` : ''}
                      </span>
                    </div>

                    {/* Standard limit badge if exists */}
                    {param.expectedLimitText && (
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded mb-2 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1 font-mono">
                        <Info className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>حد مجاز استاندارد: <strong>{param.expectedLimitText}</strong></span>
                      </div>
                    )}

                    {/* Input Field based on Param Type */}
                    {param.paramType === 'boolean_detected' ? (
                      <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                          <input
                            type="radio"
                            name={param.id}
                            checked={value === true}
                            onChange={() => onParameterChange(param.id, true, param.expectedUnit)}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>مشاهده / مثبت (+)</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                          <input
                            type="radio"
                            name={param.id}
                            checked={value === false}
                            onChange={() => onParameterChange(param.id, false, param.expectedUnit)}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>عدم مشاهده / منفی (-)</span>
                        </label>
                      </div>
                    ) : param.paramType === 'text_observation' ? (
                      <textarea
                        rows={2}
                        value={value}
                        onChange={(e) => onParameterChange(param.id, e.target.value, param.expectedUnit)}
                        placeholder={param.placeholder || 'توضیحات و مشاهدات آزمون...'}
                        className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={value}
                          onChange={(e) => onParameterChange(param.id, e.target.value, param.expectedUnit)}
                          placeholder={param.placeholder || 'مقدار اندازه‌گیری‌شده'}
                          className="w-full text-xs p-2.5 pl-14 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono"
                        />
                        {param.expectedUnit && (
                          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                            {param.expectedUnit}
                          </div>
                        )}
                      </div>
                    )}

                    {param.helpText && (
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                        {param.helpText}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Anti-Hallucination & Skip Without Guessing */}
        <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-stone-200">
            <input
              type="checkbox"
              checked={stepRunData?.skippedWithoutGuessing || false}
              onChange={(e) => handleFieldChange('skippedWithoutGuessing', e.target.checked)}
              className="rounded text-emerald-600 w-4 h-4 cursor-pointer"
            />
            <span>عدم نیاز به اندازه‌گیری در این مرحله / ثبت بدون حدس زدن (No-Guess Mode)</span>
          </label>

          {stepRunData?.skippedWithoutGuessing && (
            <div className="pr-6 space-y-1 pt-1">
              <input
                type="text"
                value={stepRunData?.skipReason || ''}
                onChange={(e) => handleFieldChange('skipReason', e.target.value)}
                placeholder="دلیل عدم اندازه‌گیری را به وضوح وارد کنید (مثال: کنترل چشمی انجام شد یا نمونه فاقد فاز روغنی بود)..."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
              />
              <span className="text-[10px] text-stone-400 block">
                توضیح شما در ممیزی کیفیت ثبت می‌شود و سیستم از اجبار به حدس زدن عدد خودداری می‌کند.
              </span>
            </div>
          )}
        </div>

        {/* 6. Error & Anomaly Logging */}
        <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
          <span className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>ثبت خطا یا انحراف غیرمنتظره در طول آزمون (Error / Anomaly Logging):</span>
          </span>

          <div className="flex gap-2">
            <input
              type="text"
              value={newErrorText}
              onChange={(e) => setNewErrorText(e.target.value)}
              placeholder="ثبت رخداد غیرعادی (مثال: ایجاد حباب در بورت، شوک حرارتی، ناپایداری معرف)..."
              className="flex-1 text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
            />
            <button
              type="button"
              onClick={handleAddError}
              className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0"
            >
              ثبت خطا
            </button>
          </div>

          {stepRunData?.loggedErrors && stepRunData.loggedErrors.length > 0 && (
            <ul className="space-y-1 pt-1">
              {stepRunData.loggedErrors.map((err) => (
                <li
                  key={err.id}
                  className="text-xs p-2 rounded-lg bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-center justify-between"
                >
                  <span>{err.errorText}</span>
                  <span className="text-[10px] font-mono text-stone-400">{err.loggedAt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 7. Step Validation Warnings and Blocking Errors Banners */}
        {validation.blockingReasons.length > 0 && !stepRunData?.skippedWithoutGuessing && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200 space-y-2">
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <span className="font-bold block mb-1">
                  خطاهای اعتبارسنجی (قبل از عبور از این مرحله باید برطرف شوند):
                </span>
                <ul className="space-y-1 list-disc list-inside">
                  {validation.blockingReasons.map((reason, i) => (
                    <li key={i} className="leading-relaxed">{reason}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-[11px] text-stone-600 dark:text-stone-400 pt-1 border-t border-rose-200/50 dark:border-rose-900/50">
              💡 <strong>تذکر مهم:</strong> هیچ کاربری مجبور به حدس زدن عدد نیست. اگر این مرحله بدون اندازه‌گیری سپری شده، گزینه «عدم نیاز به اندازه‌گیری در این مرحله» را تیک بزنید.
            </div>
          </div>
        )}

        {validation.warnings.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block mb-1">هشدارهای استاندارد و بازرسی:</span>
                <ul className="space-y-1 list-disc list-inside">
                  {validation.warnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 8. Step Verification Sign-Off Checkbox */}
        <div className="pt-2">
          <label
            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
              stepRunData?.isVerified
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <input
              type="checkbox"
              checked={stepRunData?.isVerified || false}
              onChange={(e) => onVerificationToggle(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 dark:border-stone-700 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">
                تأیید و امضای مرحله توسط کارشناس آزمون:
              </span>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {step.verificationPromptFa ||
                  'این مرحله طبق استاندارد مرجع به صورت کامل اجرا شده و داده‌های ثبت‌شده توسط اپراتور تأیید می‌گردد.'}
              </p>
            </div>
          </label>
        </div>

        {/* 9. Operator Step Notes */}
        <div>
          <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-stone-400" />
            <span>یادداشت‌های اختصاصی اپراتور در این گام (Operator Notes):</span>
          </label>
          <input
            type="text"
            value={stepRunData?.stepNotes || ''}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="هرگونه مشاهده جانبی، تغییر رنگ، پایداری محلول یا رفتار فیزیکی نمونه..."
            className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* 10. Step Navigation Footer & Save & Continue */}
      <div className="px-6 py-4 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPreviousStep}
          disabled={isFirstStep}
          className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            isFirstStep
              ? 'opacity-40 cursor-not-allowed text-stone-400 dark:text-stone-600'
              : 'bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>مرحله قبلی</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {onSaveAndContinue && (
            <button
              type="button"
              onClick={onSaveAndContinue}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-emerald-600" />
              <span>ذخیره (Save)</span>
            </button>
          )}

          {isLastStep ? (
            <button
              type="button"
              onClick={onCompleteReplicate}
              disabled={!validation.canAdvanceToNext && !stepRunData?.skippedWithoutGuessing}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors ${
                validation.canAdvanceToNext || stepRunData?.skippedWithoutGuessing
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>تکمیل این تکرار و ثبت نتیجه</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextStep}
              disabled={!validation.canAdvanceToNext && !stepRunData?.skippedWithoutGuessing}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors ${
                validation.canAdvanceToNext || stepRunData?.skippedWithoutGuessing
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              <span>مرحله بعدی</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
