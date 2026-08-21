/**
 * Food Science AI - Lab Step Execution Card
 * Interactive execution of experiment steps with live validation, expected types/units,
 * safety warnings, operator sign-off check, and step-by-step progression.
 */

import React from 'react';
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
  Binary
} from 'lucide-react';
import {
  LabSession,
  LabStepDefinition,
  LabStepRunData,
  LabParameterDefinition,
  LabParameterType
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
  onCompleteReplicate
}) => {
  const isFirstStep = step.stepNumber === 1;
  const isLastStep = step.stepNumber === session.steps.length;

  const currentReplicate = session.replicates.find(
    (r) => r.replicateNumber === session.currentReplicateNumber
  );

  // Validate current step execution
  const validation = validateStepRun(step, stepRunData, session.standardSnapshot);

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

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Step Header */}
      <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm shadow-xs">
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
            <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
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
          <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200">
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

        {/* Dynamic Parameters Input Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-600" />
              ثبت مقادیر و پارامترهای اندازه‌گیری‌شده
            </h3>
            <span className="text-xs text-stone-400">
              واحد و نوع داده مورد انتظار برای هر شاخص معین است
            </span>
          </div>

          {step.parameters.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-2">
              در این مرحله نیازی به ثبت عدد خاصی نیست؛ صرفاً دستورالعمل را اجرا کرده و تأیید نمایید.
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
                        نوع: {typeMeta.fa} {param.expectedUnit ? `[${param.expectedUnit}]` : ''}
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

        {/* Step Validation Warnings and Errors Banners */}
        {validation.errors.length > 0 && (
          <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200">
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block mb-1">خطاهای ورودی (مانع از رفتن به مرحله بعد):</span>
                <ul className="space-y-1 list-disc list-inside">
                  {validation.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {validation.warnings.length > 0 && (
          <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200">
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

        {/* Step Verification Sign-Off Checkbox */}
        {/* Requirement: هر مرحله باید قبل از رفتن به مرحله بعد قابل بررسی باشد. */}
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
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 dark:border-stone-700 w-4 h-4"
            />
            <div className="flex-1 text-xs">
              <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">
                تأیید و بازبینی اپراتور آزمایشگاه:
              </span>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {step.verificationPromptFa ||
                  'این مرحله مطابق استاندارد به دقت انجام شد و صحت مقادیر ثبت‌شده توسط کارشناس تأیید می‌گردد.'}
              </p>
            </div>
          </label>
        </div>

        {/* Operator Step Notes */}
        <div>
          <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
            یادداشت اختیاری برای این مرحله:
          </label>
          <input
            type="text"
            value={stepRunData?.stepNotes || ''}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="هرگونه مشاهده جانبی، تغییر معرف یا رفتار خاص نمونه..."
            className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Step Navigation Footer */}
      <div className="px-6 py-4 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPreviousStep}
          disabled={isFirstStep}
          className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            isFirstStep
              ? 'opacity-40 cursor-not-allowed text-stone-400 dark:text-stone-600'
              : 'bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ArrowRight className="w-3.5 h-3.5" />
          مرحله قبلی
        </button>

        <div className="flex items-center gap-2">
          {!validation.canAdvanceToNext && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 hidden sm:inline">
              جهت ادامه، تکمیل ورودی‌ها و علامت زدن تأیید الزامی است.
            </span>
          )}

          {isLastStep ? (
            <button
              type="button"
              onClick={onCompleteReplicate}
              disabled={!validation.canAdvanceToNext}
              className={`px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors ${
                validation.canAdvanceToNext
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              تأیید و تکمیل این تکرار
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextStep}
              disabled={!validation.canAdvanceToNext}
              className={`px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors ${
                validation.canAdvanceToNext
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
