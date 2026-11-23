/**
 * Food Science AI - Digital Laboratory Workspace (/laboratory)
 * 
 * Enhanced for Authentic Laboratory Workflow Execution (Part 34 of 40):
 * - Start Experiment & View Objective
 * - Equipment & Calibration Verification
 * - Reagents & Solutions Inspection
 * - Sample Preparation & Weighing
 * - Step-by-Step Procedure with live data logging:
 *   - Time, Temperature, Weight, Volume, Equipment used, Operator notes, Error logging
 * - Anti-guess / No-guess mode with documented reason (no forced hallucinations)
 * - Multi-replicate execution (R1, R2, R3...)
 * - KaTeX Calculations & Replicate Repeatability Review
 * - Standard Conformance Evaluation
 * - Finalize Experiment & Official Certificate (COA)
 * - Pre-advancement validation with clear warnings, errors, and human explanations
 * - Overall linear progress bar
 * - Save & Continue with offline IndexedDB resilience
 */

import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { appConfirm } from '../../components/common/DialogProvider';
import {
  LabSession,
  LabStepRunData,
  LabWorkflowStage,
  LabSamplePrepData
} from '../../types/laboratory';
import { FoodStandard } from '../../types/foodStandard';
import {
  getAllLabSessions,
  saveLabSession,
  deleteLabSession,
  createDefaultStepRunData,
  createTestMockLabSession,
  clearAllTestMockSessions
} from '../../lib/storage/labStorage';
import { getStandardById } from '../../lib/storage/standardsStorage';
import { getAllEquipment, BENCHMARK_LAB_EQUIPMENT } from '../../lib/storage/equipmentStorage';
import { EquipmentChecklistItem, LaboratoryEquipment } from '../../types/laboratoryEquipment';
import {
  validateStepRun,
  validateParameterValue,
  validateWorkflowStage
} from '../../lib/laboratory/validationEngine';

import { LabWorkflowStepper } from '../../components/laboratory/LabWorkflowStepper';
import { LabSessionHeader } from '../../components/laboratory/LabSessionHeader';
import { LabObjectiveStartCard } from '../../components/laboratory/LabObjectiveStartCard';
import { LabCalibrationCheckCard } from '../../components/laboratory/LabCalibrationCheckCard';
import { LabReagentsCheckCard } from '../../components/laboratory/LabReagentsCheckCard';
import { LabSamplePrepCard } from '../../components/laboratory/LabSamplePrepCard';
import { LabStepExecutionCard } from '../../components/laboratory/LabStepExecutionCard';
import { LabCalculationReviewCard } from '../../components/laboratory/LabCalculationReviewCard';
import { LabFinalizeCard } from '../../components/laboratory/LabFinalizeCard';
import { LabReplicatesOverview } from '../../components/laboratory/LabReplicatesOverview';
import { NewLabSessionModal } from '../../components/laboratory/NewLabSessionModal';
import { LabReportModal } from '../../components/laboratory/LabReportModal';
import { LabSessionsList } from '../../components/laboratory/LabSessionsList';
import { FoodStandardDetailModal } from '../../components/standards/FoodStandardDetailModal';

import {
  FlaskConical,
  Layers,
  History,
  Plus,
  BarChart3,
  CheckCircle,
  Database,
  Wifi,
  WifiOff,
  AlertTriangle,
  XCircle,
  Check,
  Save,
  Info,
  X
} from 'lucide-react';

export const LaboratoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [activeSession, setActiveSession] = useState<LabSession | null>(null);
  const [viewMode, setViewMode] = useState<'workspace' | 'history'>('workspace');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'steps' | 'matrix'>('steps');

  // Active Workflow Stage (7-stage sequential lab workflow)
  const [currentStage, setCurrentStage] = useState<LabWorkflowStage>('start_objective');

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [reportSession, setReportSession] = useState<LabSession | null>(null);
  const [inspectedStandard, setInspectedStandard] = useState<FoodStandard | null>(null);

  // Validation Alert Banner
  const [stageAlert, setStageAlert] = useState<{
    type: 'error' | 'warning';
    title: string;
    errors: string[];
    warnings: string[];
    explanation: string;
  } | null>(null);

  // Network & Save status
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const [equipmentInventory, setEquipmentInventory] = useState<LaboratoryEquipment[]>(BENCHMARK_LAB_EQUIPMENT);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Load & Network Listeners
  useEffect(() => {
    loadSessions();

    getAllEquipment()
      .then((items) => {
        if (items && items.length > 0) {
          setEquipmentInventory(items);
        }
      })
      .catch((err) => {
        console.error('Failed to load equipment inventory:', err);
      });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Sync current stage with active session
  useEffect(() => {
    if (activeSession) {
      if (activeSession.workflowStage && activeSession.workflowStage !== currentStage) {
        setCurrentStage(activeSession.workflowStage);
      }
    }
  }, [activeSession?.id]);

  const loadSessions = async () => {
    try {
      const list = await getAllLabSessions();
      setSessions(list);
      // If there is an active running/paused session, default to it
      const active = list.find((s) => s.status === 'running' || s.status === 'paused');
      if (active && !activeSession) {
        setActiveSession(active);
        setCurrentStage(active.workflowStage || 'start_objective');
        setViewMode('workspace');
      } else if (list.length === 0) {
        setViewMode('history');
      }
    } catch (err) {
      console.error('Error loading lab sessions:', err);
    }
  };

  // 2. Real-time Stopwatch Timer
  useEffect(() => {
    if (activeSession && activeSession.status === 'running') {
      timerRef.current = setInterval(() => {
        setActiveSession((prev) => {
          if (!prev || prev.status !== 'running') return prev;
          const updated: LabSession = {
            ...prev,
            elapsedSeconds: prev.elapsedSeconds + 1
          };
          // Persist to IndexedDB every 10 seconds
          if (updated.elapsedSeconds % 10 === 0) {
            saveLabSession(updated).catch(console.error);
          }
          return updated;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession?.status]);

  // Helper to update session state & IndexedDB
  const updateActiveSession = async (updater: (prev: LabSession) => LabSession) => {
    if (!activeSession) return;
    const updated = updater(activeSession);
    setActiveSession(updated);
    try {
      await saveLabSession(updated);
      setSessions((prevList) =>
        prevList.map((s) => (s.id === updated.id ? updated : s))
      );
      setLastSavedAt(new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed to auto-save lab session:', err);
    }
  };

  // Manual Save & Continue
  const handleManualSave = async () => {
    if (!activeSession) return;
    setIsSaving(true);
    try {
      await saveLabSession(activeSession);
      const timeStr = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedAt(timeStr);
      setSaveToast(`اطلاعات آزمایش با موفقیت در پایگاه داده محلی (IndexedDB) ذخیره شد. (${timeStr})`);
      setTimeout(() => setSaveToast(null), 3500);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveToast('خطا در ذخیره‌سازی داده‌ها.');
      setTimeout(() => setSaveToast(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Stage Navigation with Validation
  const handleSelectStage = (targetStage: LabWorkflowStage) => {
    if (!activeSession) return;
    const stagesOrder: LabWorkflowStage[] = [
      'start_objective',
      'equipment_calibration',
      'reagents_solutions',
      'sample_preparation',
      'step_procedure',
      'calculation_review',
      'finalize'
    ];

    const currentIdx = stagesOrder.indexOf(currentStage);
    const targetIdx = stagesOrder.indexOf(targetStage);

    // If advancing forward, validate the current stage first
    if (targetIdx > currentIdx) {
      const validation = validateWorkflowStage(currentStage, activeSession);
      if (!validation.canAdvance) {
        setStageAlert({
          type: 'error',
          title: `امکان عبور از مرحله «${currentStage}» وجود ندارد`,
          errors: validation.errors,
          warnings: validation.warnings,
          explanation: validation.explanation
        });
        return;
      }
    }

    setStageAlert(null);
    setCurrentStage(targetStage);
    updateActiveSession((prev) => ({
      ...prev,
      workflowStage: targetStage
    }));
  };

  // Toggle Equipment check
  const handleToggleEquipmentCheck = (eqId: string) => {
    updateActiveSession((prev) => ({
      ...prev,
      requiredEquipment: prev.requiredEquipment.map((eq) =>
        eq.id === eqId ? { ...eq, isPrepared: !eq.isPrepared } : eq
      )
    }));
  };

  // Mark all equipment checked
  const handleMarkAllEquipmentChecked = () => {
    updateActiveSession((prev) => ({
      ...prev,
      requiredEquipment: prev.requiredEquipment.map((eq) => ({ ...eq, isPrepared: true }))
    }));
  };

  // Update Smart Equipment Checklist (Part 35 of 40)
  const handleUpdateEquipmentChecklist = (updated: EquipmentChecklistItem[]) => {
    updateActiveSession((prev) => ({
      ...prev,
      equipmentChecklist: updated,
      calibrationCheckDone: updated.every((i) => i.isVerifiedByOperator)
    }));
  };

  // Toggle Reagent check
  const handleToggleReagentCheck = (reagId: string) => {
    updateActiveSession((prev) => ({
      ...prev,
      reagentsAndChemicals: prev.reagentsAndChemicals.map((reag) =>
        reag.id === reagId ? { ...reag, isPrepared: !reag.isPrepared } : reag
      )
    }));
  };

  // Mark all reagents checked
  const handleMarkAllReagentsChecked = () => {
    updateActiveSession((prev) => ({
      ...prev,
      reagentsAndChemicals: prev.reagentsAndChemicals.map((reag) => ({ ...reag, isPrepared: true }))
    }));
  };

  // Update Sample Prep Data
  const handleUpdateSamplePrep = (data: Partial<LabSamplePrepData>) => {
    updateActiveSession((prev) => ({
      ...prev,
      samplePrepData: {
        ...(prev.samplePrepData || { isPrepared: false }),
        ...data
      }
    }));
  };

  // Parameter Value Change
  const handleParameterChange = (paramId: string, value: any, unit: string) => {
    if (!activeSession) return;
    const currentRepNum = activeSession.currentReplicateNumber;
    const currentStepNum = activeSession.currentStepNumber;

    const currentStepDef = activeSession.steps.find((s) => s.stepNumber === currentStepNum);
    const currentParamDef = currentStepDef?.parameters.find((p) => p.id === paramId);

    let valRes = { isValid: true, errors: [] as string[], warnings: [] as string[] };
    if (currentParamDef) {
      valRes = validateParameterValue(currentParamDef, value);
    }

    updateActiveSession((prev) => {
      const replicates = prev.replicates.map((rep) => {
        if (rep.replicateNumber !== currentRepNum) return rep;

        const stepsData = { ...rep.stepsData };
        const currentStepRun = stepsData[currentStepNum] || createDefaultStepRunData(currentStepDef!);

        const paramValues = {
          ...currentStepRun.parameterValues,
          [paramId]: {
            parameterId: paramId,
            nameFa: currentParamDef?.nameFa || paramId,
            value,
            unit,
            recordedAt: new Date().toISOString(),
            isValid: valRes.isValid,
            errors: valRes.errors,
            warnings: valRes.warnings
          }
        };

        stepsData[currentStepNum] = {
          ...currentStepRun,
          isStarted: true,
          parameterValues: paramValues
        };

        return {
          ...rep,
          stepsData
        };
      });

      return {
        ...prev,
        replicates
      };
    });
  };

  // Step Field Update (Time, Temp, Weight, Volume, Equipment, Notes, Errors, Anti-guess)
  const handleFieldUpdate = (fieldName: keyof LabStepRunData, value: any) => {
    if (!activeSession) return;
    const currentRepNum = activeSession.currentReplicateNumber;
    const currentStepNum = activeSession.currentStepNumber;
    const currentStepDef = activeSession.steps.find((s) => s.stepNumber === currentStepNum);

    updateActiveSession((prev) => {
      const replicates = prev.replicates.map((rep) => {
        if (rep.replicateNumber !== currentRepNum) return rep;

        const stepsData = { ...rep.stepsData };
        const currentStepRun = stepsData[currentStepNum] || createDefaultStepRunData(currentStepDef!);

        stepsData[currentStepNum] = {
          ...currentStepRun,
          [fieldName]: value
        };

        return {
          ...rep,
          stepsData
        };
      });

      return {
        ...prev,
        replicates
      };
    });
  };

  // Operator Verification Sign-off Toggle
  const handleVerificationToggle = (verified: boolean) => {
    if (!activeSession) return;
    const currentRepNum = activeSession.currentReplicateNumber;
    const currentStepNum = activeSession.currentStepNumber;
    const currentStepDef = activeSession.steps.find((s) => s.stepNumber === currentStepNum);

    updateActiveSession((prev) => {
      const replicates = prev.replicates.map((rep) => {
        if (rep.replicateNumber !== currentRepNum) return rep;

        const stepsData = { ...rep.stepsData };
        const currentStepRun = stepsData[currentStepNum] || createDefaultStepRunData(currentStepDef!);

        stepsData[currentStepNum] = {
          ...currentStepRun,
          isVerified: verified,
          verifiedAt: verified ? new Date().toISOString() : undefined
        };

        return {
          ...rep,
          stepsData
        };
      });

      return {
        ...prev,
        replicates
      };
    });
  };

  // Step Notes Change
  const handleNotesChange = (notes: string) => {
    handleFieldUpdate('stepNotes', notes);
  };

  // Step Navigation
  const handlePreviousStep = () => {
    if (!activeSession || activeSession.currentStepNumber <= 1) return;
    updateActiveSession((prev) => ({
      ...prev,
      currentStepNumber: prev.currentStepNumber - 1
    }));
  };

  const handleNextStep = () => {
    if (!activeSession || activeSession.currentStepNumber >= activeSession.steps.length) return;
    const currentStepDef = activeSession.steps.find((s) => s.stepNumber === activeSession.currentStepNumber);
    const currentRep = activeSession.replicates.find((r) => r.replicateNumber === activeSession.currentReplicateNumber);
    const currentStepRun = currentRep?.stepsData[activeSession.currentStepNumber];

    if (currentStepDef) {
      const val = validateStepRun(currentStepDef, currentStepRun, activeSession.standardSnapshot);
      if (!val.canAdvanceToNext) {
        setStageAlert({
          type: 'error',
          title: `گام ${activeSession.currentStepNumber} تایید نشده است`,
          errors: val.blockingReasons,
          warnings: val.warnings,
          explanation: 'قبل از رفتن به گام بعدی، باید اطلاعات گام فعلی ثبت شده یا دلیل عدم اندازه‌گیری اعلام گردد.'
        });
        return;
      }
    }

    setStageAlert(null);
    updateActiveSession((prev) => {
      const currentStepNum = prev.currentStepNumber;
      const replicates = prev.replicates.map((rep) => {
        if (rep.replicateNumber !== prev.currentReplicateNumber) return rep;
        const stepsData = { ...rep.stepsData };
        const stepRun = stepsData[currentStepNum];
        if (stepRun) {
          stepsData[currentStepNum] = { ...stepRun, isCompleted: true, completedAt: new Date().toISOString() };
        }
        return { ...rep, stepsData };
      });

      return {
        ...prev,
        currentStepNumber: prev.currentStepNumber + 1,
        replicates
      };
    });
  };

  // Replicate Completion & Advance
  const handleCompleteReplicate = () => {
    if (!activeSession) return;
    const currentRepNum = activeSession.currentReplicateNumber;

    updateActiveSession((prev) => {
      const replicates = prev.replicates.map((rep) => {
        if (rep.replicateNumber !== currentRepNum) return rep;
        return {
          ...rep,
          status: 'completed' as const,
          completedAt: new Date().toISOString()
        };
      });

      // If next replicate exists, advance to it
      const nextRep = replicates.find((r) => r.replicateNumber === currentRepNum + 1);
      if (nextRep) {
        nextRep.status = 'in_progress';
        nextRep.startedAt = nextRep.startedAt || new Date().toISOString();
        return {
          ...prev,
          currentReplicateNumber: currentRepNum + 1,
          currentStepNumber: 1,
          replicates
        };
      }

      // If all replicates done, prompt to calculations review
      return {
        ...prev,
        workflowStage: 'calculation_review',
        replicates
      };
    });

    // Check if advancing to calculations
    if (currentRepNum >= activeSession.replicates.length) {
      setCurrentStage('calculation_review');
    }
  };

  // Session Pause / Resume
  const handlePauseSession = () => {
    updateActiveSession((prev) => ({
      ...prev,
      status: 'paused',
      pausedAt: new Date().toISOString()
    }));
  };

  const handleResumeSession = () => {
    updateActiveSession((prev) => ({
      ...prev,
      status: 'running',
      resumedAt: new Date().toISOString()
    }));
  };

  // Finalize Session
  const handleCompleteSession = () => {
    updateActiveSession((prev) => ({
      ...prev,
      status: 'completed',
      completedAt: new Date().toISOString()
    }));
    if (activeSession) {
      setReportSession(activeSession);
    }
  };

  // Add Replicate
  const handleAddReplicate = () => {
    if (!activeSession) return;
    const newRepNum = activeSession.replicates.length + 1;
    const newRep = {
      replicateNumber: newRepNum,
      title: `تکرار ${newRepNum} (R${newRepNum})`,
      status: 'pending' as const,
      elapsedSeconds: 0,
      stepsData: activeSession.steps.reduce((acc, step) => {
        acc[step.stepNumber] = createDefaultStepRunData(step);
        return acc;
      }, {} as Record<number, LabStepRunData>)
    };

    updateActiveSession((prev) => ({
      ...prev,
      replicates: [...prev.replicates, newRep]
    }));
  };

  // Switch Replicate
  const handleSelectReplicate = (repNum: number) => {
    updateActiveSession((prev) => ({
      ...prev,
      currentReplicateNumber: repNum
    }));
    setActiveWorkspaceTab('steps');
  };

  // Delete Session
  const handleDeleteSession = async (sessionId: string) => {
    if (!(await appConfirm('آیا از حذف این گزارش آزمایشگاهی اطمینان دارید؟ این عملیات غیرقابل بازگشت است.'))) return;
    try {
      await deleteLabSession(sessionId);
      if (activeSession?.id === sessionId) {
        setActiveSession(null);
        setViewMode('history');
      }
      loadSessions();
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  // Load Test Mock Lab Session (Technical Demo separated from real data)
  const handleLoadTestMock = async () => {
    try {
      const mock = createTestMockLabSession();
      await saveLabSession(mock);
      setActiveSession(mock);
      setCurrentStage('finalize');
      setViewMode('workspace');
      await loadSessions();
      setSaveToast('آزمایش شبیه‌سازی‌شده کامل با برچسب [TEST-MOCK] در میز کار بارگذاری شد.');
      setTimeout(() => setSaveToast(null), 4000);
    } catch (err) {
      console.error('Failed to load test mock session:', err);
    }
  };

  // Clear Only Test Mock Sessions
  const handleClearTestMocks = async () => {
    if (!(await appConfirm('آیا از حذف کلیه نمونه‌های تستی [TEST-MOCK] اطمینان دارید؟ داده‌های واقعی حفظ خواهند شد.'))) return;
    try {
      const count = await clearAllTestMockSessions();
      if (activeSession && (activeSession.isDemoOrTest || activeSession.testTag === 'TEST-MOCK')) {
        setActiveSession(null);
        setViewMode('history');
      }
      await loadSessions();
      setSaveToast(`${count} نشست تستی با موفقیت حذف گردید.`);
      setTimeout(() => setSaveToast(null), 3000);
    } catch (err) {
      console.error('Failed to clear test mock sessions:', err);
    }
  };

  // Inspect Standard Detail
  const handleViewStandardDetail = async (stdId: string) => {
    try {
      const std = await getStandardById(stdId);
      if (std) {
        setInspectedStandard(std);
      } else if (activeSession?.standardSnapshot) {
        setInspectedStandard(activeSession.standardSnapshot as FoodStandard);
      }
    } catch (err) {
      console.error('Error viewing standard detail:', err);
    }
  };

  // Active step & run data
  const currentStep = activeSession?.steps.find((s) => s.stepNumber === activeSession.currentStepNumber);
  const currentReplicate = activeSession?.replicates.find((r) => r.replicateNumber === activeSession.currentReplicateNumber);
  const currentStepRun = currentReplicate?.stepsData[activeSession?.currentStepNumber || 1];

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <PageHeader
        title="آزمایشگاه دیجیتال و آزمون‌های تخصصی"
        englishTitle="/laboratory — Digital Quality & Standards Lab"
        description="سامانه جامع ۷ مرحله‌ای اجرای واقعی آزمون‌های غذایی: شروع و هدف، کالیبراسیون تجهیزات، معرف‌ها، آماده‌سازی، اجرای گام‌به‌گام با داده‌های زنده، محاسبات و صدور کارنامه"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'آزمایشگاه دیجیتال' }
        ]}
      />

      {/* Save Toast Notification */}
      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveToast}</span>
          </div>
          <button type="button" onClick={() => setSaveToast(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Mode Selector (Workspace vs History) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setViewMode('workspace')}
            disabled={!activeSession}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              viewMode === 'workspace' && activeSession
                ? 'bg-emerald-600 text-white shadow-xs'
                : activeSession
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                : 'opacity-50 cursor-not-allowed bg-stone-100 dark:bg-stone-800 text-stone-400'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>میز کار آزمایش جاری</span>
            {activeSession && (
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              viewMode === 'history'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <History className="w-4 h-4" />
            <span>سوابق و بایگانی آزمایش‌ها ({sessions.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Network Offline Status Badge */}
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="text-[11px] text-stone-600 dark:text-stone-400">
              {isOnline ? 'آنلاین' : 'آفلاین (IndexedDB فعال)'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>شروع آزمایش جدید</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: ACTIVE EXPERIMENT WORKSPACE */}
      {viewMode === 'workspace' && activeSession ? (
        <div className="space-y-6">
          {/* Active Test Mock Banner */}
          {(activeSession.isDemoOrTest || activeSession.testTag === 'TEST-MOCK') && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-200 text-amber-900 text-[10px]">
                  TEST-MOCK
                </span>
                <span className="font-bold">
                  حالت آزمایشی و تست فنی: این نشست حاوی داده‌های شبیه‌سازی‌شده جهت راستی‌آزمایی زنجیره ۱۲ مرحله‌ای آزمایش است.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('history')}
                className="text-amber-800 dark:text-amber-300 underline font-semibold text-[11px] shrink-0"
              >
                بازگشت به فهرست سوابق
              </button>
            </div>
          )}

          {/* Top Session Status Bar */}
          <LabSessionHeader
            session={activeSession}
            onPauseSession={handlePauseSession}
            onResumeSession={handleResumeSession}
            onCompleteSession={handleCompleteSession}
            onSelectReplicate={handleSelectReplicate}
            onAddReplicate={handleAddReplicate}
            onExitSession={() => setViewMode('history')}
            onViewStandardDetail={handleViewStandardDetail}
          />

          {/* 7-Stage Workflow Stepper & Linear Progress Bar */}
          <LabWorkflowStepper
            session={activeSession}
            currentStage={currentStage}
            onSelectStage={handleSelectStage}
            onSaveAndContinue={handleManualSave}
            isSaving={isSaving}
            lastSavedAt={lastSavedAt}
          />

          {/* Validation Error/Warning Alert Box */}
          {stageAlert && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 shadow-xs animate-in slide-in-from-top-2 ${
                stageAlert.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {stageAlert.type === 'error' ? (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                  <span>{stageAlert.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStageAlert(null)}
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {stageAlert.explanation && (
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {stageAlert.explanation}
                </p>
              )}

              {stageAlert.errors && stageAlert.errors.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-rose-200/60 dark:border-rose-900/60">
                  <span className="font-bold block">موارد مسدودکننده (Blocking Errors):</span>
                  <ul className="list-disc list-inside space-y-0.5 pr-2">
                    {stageAlert.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {stageAlert.warnings && stageAlert.warnings.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="font-bold block">هشدارهای استاندارد (Warnings):</span>
                  <ul className="list-disc list-inside space-y-0.5 pr-2">
                    {stageAlert.warnings.map((warn, i) => (
                      <li key={i}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* STAGE 1: START EXPERIMENT & VIEW OBJECTIVE */}
          {currentStage === 'start_objective' && (
            <LabObjectiveStartCard
              session={activeSession}
              equipmentInventory={equipmentInventory}
              onUpdateChecklist={handleUpdateEquipmentChecklist}
              onStartExperiment={() => {
                updateActiveSession((prev) => ({
                  ...prev,
                  status: 'running',
                  startedAt: prev.startedAt || new Date().toISOString()
                }));
                handleSelectStage('equipment_calibration');
              }}
              onProceedToCalibration={() => handleSelectStage('equipment_calibration')}
              onViewStandardDetail={handleViewStandardDetail}
            />
          )}

          {/* STAGE 2: EQUIPMENT & CALIBRATION CHECK */}
          {currentStage === 'equipment_calibration' && (
            <LabCalibrationCheckCard
              session={activeSession}
              equipmentInventory={equipmentInventory}
              onUpdateChecklist={handleUpdateEquipmentChecklist}
              onToggleEquipmentCheck={handleToggleEquipmentCheck}
              onMarkAllEquipmentChecked={handleMarkAllEquipmentChecked}
              onProceedToReagents={() => handleSelectStage('reagents_solutions')}
              onBackToObjective={() => handleSelectStage('start_objective')}
            />
          )}

          {/* STAGE 3: REAGENTS & SOLUTIONS CHECK */}
          {currentStage === 'reagents_solutions' && (
            <LabReagentsCheckCard
              session={activeSession}
              onToggleReagentCheck={handleToggleReagentCheck}
              onMarkAllReagentsChecked={handleMarkAllReagentsChecked}
              onProceedToSamplePrep={() => handleSelectStage('sample_preparation')}
              onBackToCalibration={() => handleSelectStage('equipment_calibration')}
            />
          )}

          {/* STAGE 4: SAMPLE PREPARATION */}
          {currentStage === 'sample_preparation' && (
            <LabSamplePrepCard
              session={activeSession}
              onUpdateSamplePrep={handleUpdateSamplePrep}
              onProceedToProcedure={() => handleSelectStage('step_procedure')}
              onBackToReagents={() => handleSelectStage('reagents_solutions')}
            />
          )}

          {/* STAGE 5: STEP-BY-STEP PROCEDURE & REPLICATE EXECUTION */}
          {currentStage === 'step_procedure' && (
            <div className="space-y-4">
              {/* Workspace Sub-Tabs: Step Execution vs Matrix Table */}
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveWorkspaceTab('steps')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      activeWorkspaceTab === 'steps'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    اجرای گام‌به‌گام ({currentReplicate?.title || `تکرار ${activeSession.currentReplicateNumber}`})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveWorkspaceTab('matrix')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      activeWorkspaceTab === 'matrix'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    ماتریس تکرارها و تحلیل آماری
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectStage('calculation_review')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                  >
                    انتقال به مرحله محاسبه و بررسی نتایج ←
                  </button>
                </div>
              </div>

              {/* Sub-Tab 1: Step Execution Card */}
              {activeWorkspaceTab === 'steps' && currentStep && (
                <LabStepExecutionCard
                  session={activeSession}
                  step={currentStep}
                  stepRunData={currentStepRun}
                  onParameterChange={handleParameterChange}
                  onVerificationToggle={handleVerificationToggle}
                  onNotesChange={handleNotesChange}
                  onPreviousStep={handlePreviousStep}
                  onNextStep={handleNextStep}
                  onCompleteReplicate={handleCompleteReplicate}
                  onFieldUpdate={handleFieldUpdate}
                  onSelectReplicate={handleSelectReplicate}
                  onSaveAndContinue={handleManualSave}
                />
              )}

              {/* Sub-Tab 2: Replicates Matrix Overview */}
              {activeWorkspaceTab === 'matrix' && (
                <LabReplicatesOverview
                  session={activeSession}
                  onSelectReplicate={handleSelectReplicate}
                />
              )}
            </div>
          )}

          {/* STAGE 6: CALCULATION & STANDARD REVIEW */}
          {currentStage === 'calculation_review' && (
            <LabCalculationReviewCard
              session={activeSession}
              onUpdateQCData={(qcData) => {
                updateActiveSession((prev) => ({
                  ...prev,
                  qcData
                }));
              }}
              onProceedToFinalize={() => handleSelectStage('finalize')}
              onBackToProcedure={() => handleSelectStage('step_procedure')}
            />
          )}

          {/* STAGE 7: FINALIZE EXPERIMENT & CERTIFICATE */}
          {currentStage === 'finalize' && (
            <LabFinalizeCard
              session={activeSession}
              onFinalizeExperiment={handleCompleteSession}
              onOpenReportModal={() => setReportSession(activeSession)}
              onBackToCalculation={() => handleSelectStage('calculation_review')}
              onUpdateSessionRemarks={(remarks, supervisor) => {
                updateActiveSession((prev) => ({
                  ...prev,
                  notes: remarks,
                  supervisorName: supervisor
                }));
              }}
            />
          )}
        </div>
      ) : null}

      {/* VIEW MODE 2: SESSIONS HISTORY & MANAGEMENT */}
      {(viewMode === 'history' || !activeSession) && (
        <LabSessionsList
          sessions={sessions}
          onStartNewSession={() => setIsNewModalOpen(true)}
          onResumeSession={(s) => {
            setActiveSession(s);
            setCurrentStage(s.workflowStage || 'start_objective');
            setViewMode('workspace');
          }}
          onViewReport={(s) => setReportSession(s)}
          onDeleteSession={handleDeleteSession}
          onLoadTestMock={handleLoadTestMock}
          onClearTestMocks={handleClearTestMocks}
        />
      )}

      {/* MODAL 1: NEW LAB SESSION */}
      <NewLabSessionModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSessionCreated={(newSession) => {
          setActiveSession(newSession);
          setCurrentStage('start_objective');
          setViewMode('workspace');
          loadSessions();
        }}
      />

      {/* MODAL 2: LAB TECHNICAL REPORT / COA */}
      <LabReportModal
        session={reportSession}
        isOpen={!!reportSession}
        onClose={() => setReportSession(null)}
      />

      {/* MODAL 3: FOOD STANDARD DETAIL VIEW */}
      {inspectedStandard && (
        <FoodStandardDetailModal
          standard={inspectedStandard}
          onClose={() => setInspectedStandard(null)}
        />
      )}
    </div>
  );
};

export default LaboratoryPage;
