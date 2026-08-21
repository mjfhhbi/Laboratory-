/**
 * Food Science AI - Digital Laboratory Page (/laboratory)
 * 
 * Part 8 of 10: Complete Digital Laboratory workspace with standard selection,
 * prerequisites management, step-by-step verification, live input validation,
 * expected types & units, multi-replicate runs, pause/continue timer,
 * and offline-first IndexedDB persistence.
 */

import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { LabSession, LabStepRunData } from '../../types/laboratory';
import { FoodStandard } from '../../types/foodStandard';
import {
  getAllLabSessions,
  saveLabSession,
  deleteLabSession,
  getActiveLabSession,
  createDefaultStepRunData
} from '../../lib/storage/labStorage';
import { getStandardById } from '../../lib/storage/standardsStorage';
import { validateStepRun, validateParameterValue } from '../../lib/laboratory/validationEngine';
import { LabSessionHeader } from '../../components/laboratory/LabSessionHeader';
import { LabPrerequisitesCard } from '../../components/laboratory/LabPrerequisitesCard';
import { LabStepExecutionCard } from '../../components/laboratory/LabStepExecutionCard';
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
  WifiOff
} from 'lucide-react';

export const LaboratoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [activeSession, setActiveSession] = useState<LabSession | null>(null);
  const [viewMode, setViewMode] = useState<'workspace' | 'history'>('workspace');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'steps' | 'matrix'>('steps');

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [reportSession, setReportSession] = useState<LabSession | null>(null);
  const [inspectedStandard, setInspectedStandard] = useState<FoodStandard | null>(null);

  // Network & Save status
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Load
  useEffect(() => {
    loadSessions();

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

  const loadSessions = async () => {
    try {
      const list = await getAllLabSessions();
      setSessions(list);
      // If there is an active running/paused session, default to it
      const active = list.find((s) => s.status === 'running' || s.status === 'paused');
      if (active && !activeSession) {
        setActiveSession(active);
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
          // Persist to IndexedDB every 5 seconds or immediately
          if (updated.elapsedSeconds % 5 === 0) {
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

  // 3. Helper to update session state & IndexedDB
  const updateActiveSession = async (updater: (prev: LabSession) => LabSession) => {
    if (!activeSession) return;
    const updated = updater(activeSession);
    setActiveSession(updated);
    try {
      await saveLabSession(updated);
      setSessions((prevList) =>
        prevList.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (err) {
      console.error('Failed to auto-save lab session:', err);
    }
  };

  // Handler: Toggle equipment readiness check
  const handleToggleEquipmentCheck = (eqId: string) => {
    updateActiveSession((prev) => ({
      ...prev,
      requiredEquipment: prev.requiredEquipment.map((eq) =>
        eq.id === eqId ? { ...eq, isPrepared: !eq.isPrepared } : eq
      )
    }));
  };

  // Handler: Toggle reagent readiness check
  const handleToggleReagentCheck = (reagId: string) => {
    updateActiveSession((prev) => ({
      ...prev,
      reagentsAndChemicals: prev.reagentsAndChemicals.map((reag) =>
        reag.id === reagId ? { ...reag, isPrepared: !reag.isPrepared } : reag
      )
    }));
  };

  // Handler: Parameter input change
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

  // Handler: Operator Verification Sign-off Toggle
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

  // Handler: Step Notes Change
  const handleNotesChange = (notes: string) => {
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
          stepNotes: notes
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

  // Navigation: Previous Step
  const handlePreviousStep = () => {
    if (!activeSession || activeSession.currentStepNumber <= 1) return;
    updateActiveSession((prev) => ({
      ...prev,
      currentStepNumber: prev.currentStepNumber - 1
    }));
  };

  // Navigation: Next Step (Validated & Verified)
  const handleNextStep = () => {
    if (!activeSession || activeSession.currentStepNumber >= activeSession.steps.length) return;
    const currentStepDef = activeSession.steps.find((s) => s.stepNumber === activeSession.currentStepNumber);
    const currentRep = activeSession.replicates.find((r) => r.replicateNumber === activeSession.currentReplicateNumber);
    const currentStepRun = currentRep?.stepsData[activeSession.currentStepNumber];

    if (currentStepDef) {
      const val = validateStepRun(currentStepDef, currentStepRun, activeSession.standardSnapshot);
      if (!val.canAdvanceToNext) {
        return; // blocked by validation
      }
    }

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

  // Handler: Complete Replicate Run
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

      // If all replicates done, switch view to matrix summary
      setActiveWorkspaceTab('matrix');
      return {
        ...prev,
        replicates
      };
    });
  };

  // Handler: Pause Session
  const handlePauseSession = () => {
    updateActiveSession((prev) => ({
      ...prev,
      status: 'paused',
      pausedAt: new Date().toISOString()
    }));
  };

  // Handler: Resume Session
  const handleResumeSession = () => {
    updateActiveSession((prev) => ({
      ...prev,
      status: 'running',
      resumedAt: new Date().toISOString()
    }));
  };

  // Handler: Complete and Finalize Session
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

  // Handler: Add New Replicate
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

  // Handler: Switch Replicate
  const handleSelectReplicate = (repNum: number) => {
    updateActiveSession((prev) => ({
      ...prev,
      currentReplicateNumber: repNum
    }));
    setActiveWorkspaceTab('steps');
  };

  // Handler: Delete Session
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('آیا از حذف این گزارش آزمایشگاهی اطمینان دارید؟ این عملیات غیرقابل بازگشت است.')) return;
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

  // Handler: Inspect Standard Detail
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
        description="سیستم اجرای مرحله‌به‌مرحله آزمون‌های کنترل کیفیت، اعتبارسنجی ورودی‌ها بر مبنای استاندارد، ثبت تکرارها و تاب‌آوری آفلاین در IndexedDB"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'آزمایشگاه دیجیتال' }
        ]}
      />

      {/* Main View Mode Selector (Workspace vs History) */}
      <div className="flex items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('workspace')}
            disabled={!activeSession}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              viewMode === 'workspace' && activeSession
                ? 'bg-emerald-600 text-white shadow-xs'
                : activeSession
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                : 'opacity-50 cursor-not-allowed bg-stone-100 dark:bg-stone-800 text-stone-400'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            میز کار آزمایش جاری
            {activeSession && (
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              viewMode === 'history'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <History className="w-4 h-4" />
            سوابق و بایگانی آزمایش‌ها ({sessions.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            شروع آزمایش جدید
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: ACTIVE EXPERIMENT WORKSPACE */}
      {viewMode === 'workspace' && activeSession ? (
        <div className="space-y-6">
          {/* Header & Controls */}
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

          {/* Prerequisites Accordion (Equipment, Reagents, Conditions) */}
          <LabPrerequisitesCard
            session={activeSession}
            onToggleEquipmentCheck={handleToggleEquipmentCheck}
            onToggleReagentCheck={handleToggleReagentCheck}
            onViewStandardDetail={handleViewStandardDetail}
          />

          {/* Workspace Tabs: Step Execution vs Matrix Table */}
          <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
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
              اجرای مرحله‌به‌مرحله ({currentReplicate?.title || `تکرار ${activeSession.currentReplicateNumber}`})
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
              ماتریس تکرارها و تحلیل انطباق با استاندارد
            </button>
          </div>

          {/* Tab 1: Step-by-Step Execution */}
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
            />
          )}

          {/* Tab 2: Replicates Matrix & Standard Compliance */}
          {activeWorkspaceTab === 'matrix' && (
            <LabReplicatesOverview
              session={activeSession}
              onSelectReplicate={handleSelectReplicate}
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
            setViewMode('workspace');
          }}
          onViewReport={(s) => setReportSession(s)}
          onDeleteSession={handleDeleteSession}
        />
      )}

      {/* MODAL 1: NEW LAB SESSION */}
      <NewLabSessionModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSessionCreated={(newSession) => {
          setActiveSession(newSession);
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
