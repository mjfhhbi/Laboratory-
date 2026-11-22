/**
 * Food Science AI - Laboratory Workflow Stepper & Progress Navigation
 * 
 * Visualizes the 7 sequential stages of laboratory experiment execution:
 * 1. Start & Objective (شروع و هدف)
 * 2. Equipment & Calibration (بررسی تجهیزات و کالیبراسیون)
 * 3. Reagents & Solutions (بررسی معرف‌ها و محلول‌ها)
 * 4. Sample Preparation (آماده‌سازی نمونه)
 * 5. Step-by-Step Procedure (اجرای گام‌به‌گام و ورود داده)
 * 6. Calculation & Review (محاسبه و ارزیابی نتیجه)
 * 7. Finalize & Certificate (نهایی‌سازی آزمایش)
 */

import React from 'react';
import {
  Target,
  Cpu,
  FlaskConical,
  Scissors,
  ListOrdered,
  Calculator,
  Award,
  CheckCircle2,
  Clock,
  Database,
  Save,
  Check
} from 'lucide-react';
import { LabSession, LabWorkflowStage } from '../../types/laboratory';

interface LabWorkflowStepperProps {
  session: LabSession;
  currentStage: LabWorkflowStage;
  onSelectStage: (stage: LabWorkflowStage) => void;
  onSaveAndContinue: () => void;
  isSaving?: boolean;
  lastSavedAt?: string;
}

interface StageInfo {
  id: LabWorkflowStage;
  labelFa: string;
  stepNumber: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STAGES: StageInfo[] = [
  {
    id: 'start_objective',
    labelFa: 'شروع و هدف',
    stepNumber: 1,
    icon: Target,
    description: 'مشاهده هدف آزمون، مشخصات نمونه و سرپرست'
  },
  {
    id: 'equipment_calibration',
    labelFa: 'تجهیزات و کالیبراسیون',
    stepNumber: 2,
    icon: Cpu,
    description: 'صحت‌سنجی کالیبراسیون و رواداری دستگاه‌ها'
  },
  {
    id: 'reagents_solutions',
    labelFa: 'معرف‌ها و محلول‌ها',
    stepNumber: 3,
    icon: FlaskConical,
    description: 'آماده‌سازی محلول‌ها، شناساگر و ایمنی مواد'
  },
  {
    id: 'sample_preparation',
    labelFa: 'آماده‌سازی نمونه',
    stepNumber: 4,
    icon: Scissors,
    description: 'یکنواخت‌سازی، آسیاب و توزین نمونه غذایی'
  },
  {
    id: 'step_procedure',
    labelFa: 'اجرای گام‌به‌گام',
    stepNumber: 5,
    icon: ListOrdered,
    description: 'ورود زنده داده‌ها، دما، وزن، حجم و زمان'
  },
  {
    id: 'calculation_review',
    labelFa: 'محاسبه و بررسی',
    stepNumber: 6,
    icon: Calculator,
    description: 'محاسبه فرمول KaTeX، انطباق و تکرارپذیری'
  },
  {
    id: 'finalize',
    labelFa: 'نهایی‌سازی',
    stepNumber: 7,
    icon: Award,
    description: 'امضای اپراتور و صدور کارنامه آزمایشگاه'
  }
];

export const LabWorkflowStepper: React.FC<LabWorkflowStepperProps> = ({
  session,
  currentStage,
  onSelectStage,
  onSaveAndContinue,
  isSaving = false,
  lastSavedAt
}) => {
  const currentStageIndex = STAGES.findIndex((s) => s.id === currentStage);

  // Calculate overall workflow progress percentage (0 - 100%)
  const completedStepsCount = session.replicates.reduce((acc, rep) => {
    return acc + Object.values(rep.stepsData).filter((s) => s.isCompleted).length;
  }, 0);
  const totalStepsTarget = (session.steps.length || 1) * (session.replicates.length || 1);
  const procedureProgress = Math.min(100, Math.round((completedStepsCount / totalStepsTarget) * 100));

  // Determine stage completion status
  const isStageCompleted = (stageId: LabWorkflowStage, index: number): boolean => {
    if (index < currentStageIndex) return true;
    if (stageId === 'start_objective') return session.status !== 'draft';
    if (stageId === 'equipment_calibration') {
      const eqTotal = session.requiredEquipment.length;
      const eqChecked = session.requiredEquipment.filter((e) => e.isPrepared).length;
      return eqTotal > 0 ? eqChecked === eqTotal : true;
    }
    if (stageId === 'reagents_solutions') {
      const reagTotal = session.reagentsAndChemicals.length;
      const reagChecked = session.reagentsAndChemicals.filter((r) => r.isPrepared).length;
      return reagTotal > 0 ? reagChecked === reagTotal : true;
    }
    if (stageId === 'sample_preparation') {
      return Boolean(session.samplePrepData?.isPrepared);
    }
    if (stageId === 'step_procedure') {
      return procedureProgress === 100;
    }
    if (stageId === 'calculation_review') {
      return Boolean(session.repeatabilityAnalysis || session.standardConformance);
    }
    if (stageId === 'finalize') {
      return session.status === 'completed';
    }
    return false;
  };

  // Overall workflow progress calculation
  const workflowOverallPercent = Math.round(
    ((currentStageIndex + (currentStage === 'step_procedure' ? procedureProgress / 100 : 0)) /
      (STAGES.length - 1)) *
      100
  );

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 space-y-4">
      {/* Top Banner: Workflow Title, Overall Progress, and Save & Continue */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>جریان کار آزمایشگاهی (Laboratory Workflow)</span>
            </h2>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              مرحله {currentStageIndex + 1} از ۷: {STAGES[currentStageIndex]?.labelFa}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            پروتکل استاندارد {session.standardNumber ? `منطبق بر ${session.standardNumber}` : 'آزمایشگاه کنترل کیفیت'}
          </p>
        </div>

        {/* Action Controls: Save & Continue + Offline Status */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 bg-stone-50 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>آفلاین (IndexedDB)</span>
            {lastSavedAt && (
              <span className="font-mono text-[10px] text-stone-400">· {lastSavedAt}</span>
            )}
          </div>

          <button
            type="button"
            onClick={onSaveAndContinue}
            disabled={isSaving}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            {isSaving ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-emerald-600" />
                <span>ذخیره و ادامه (Save)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Linear Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-600 dark:text-stone-400 font-medium">
            پیشرفت کل اجرای فرآیند آزمون:
          </span>
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
            {workflowOverallPercent}%
          </span>
        </div>
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, workflowOverallPercent)}%` }}
          />
        </div>
      </div>

      {/* Mobile One-Handed Stage Switcher (< sm) */}
      <div className="sm:hidden space-y-3 bg-stone-50 dark:bg-stone-850 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {React.createElement(STAGES[currentStageIndex].icon, {
              className: 'w-5 h-5 text-emerald-600 shrink-0'
            })}
            <div className="min-w-0">
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                {STAGES[currentStageIndex].labelFa}
              </div>
              <div className="text-[10px] text-stone-500 truncate">
                {STAGES[currentStageIndex].description}
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
            {currentStageIndex + 1} / ۷
          </span>
        </div>

        {/* Step dots for quick thumb access */}
        <div className="flex items-center justify-between gap-1 px-1">
          {STAGES.map((s, idx) => {
            const isCurr = s.id === currentStage;
            const isDone = isStageCompleted(s.id, idx);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectStage(s.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all min-h-[36px] flex items-center justify-center ${
                  isCurr
                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                    : isDone
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
                title={s.labelFa}
              >
                {isDone && !isCurr ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </button>
            );
          })}
        </div>

        {/* Previous / Next stage buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              if (currentStageIndex > 0) {
                onSelectStage(STAGES[currentStageIndex - 1].id);
              }
            }}
            disabled={currentStageIndex === 0}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 min-h-[44px]"
          >
            <span>مرحله قبل</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentStageIndex < STAGES.length - 1) {
                onSelectStage(STAGES[currentStageIndex + 1].id);
              }
            }}
            disabled={currentStageIndex === STAGES.length - 1}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 min-h-[44px] shadow-2xs"
          >
            <span>مرحله بعد</span>
          </button>
        </div>
      </div>

      {/* 7-Stage Horizontal Stepper (Desktop / Tablet: sm and above) */}
      <div className="hidden sm:block overflow-x-auto pb-1 pt-1 -mx-2 px-2">
        <div className="flex items-center gap-2 min-w-[700px]">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCurrent = stage.id === currentStage;
            const isDone = isStageCompleted(stage.id, idx);

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage(stage.id)}
                className={`flex-1 p-2.5 rounded-xl text-right transition-all border min-h-[58px] flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-700 ring-2 ring-emerald-500/20 shadow-xs'
                    : isDone
                    ? 'bg-stone-50/60 dark:bg-stone-850/50 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
                    : 'bg-white dark:bg-stone-900 border-stone-200/70 dark:border-stone-800/70 text-stone-400 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center font-mono ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3" /> : stage.stepNumber}
                  </span>

                  <Icon
                    className={`w-4 h-4 ${
                      isCurrent
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : isDone
                        ? 'text-emerald-600'
                        : 'text-stone-400'
                    }`}
                  />
                </div>

                <div>
                  <div
                    className={`text-xs font-bold truncate leading-tight ${
                      isCurrent
                        ? 'text-emerald-950 dark:text-emerald-100'
                        : isDone
                        ? 'text-stone-800 dark:text-stone-200'
                        : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {stage.labelFa}
                  </div>
                  <div className="text-[10px] text-stone-400 dark:text-stone-500 truncate mt-0.5">
                    {stage.id === 'step_procedure'
                      ? `گام‌ها: ${procedureProgress}٪`
                      : stage.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
