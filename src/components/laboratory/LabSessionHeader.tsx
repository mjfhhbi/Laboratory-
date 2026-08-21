/**
 * Food Science AI - Lab Session Header
 * Displays experiment metadata, elapsed timer, pause/continue controls, replicate switcher, and offline indicator.
 */

import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  CheckCircle,
  Plus,
  Wifi,
  WifiOff,
  Database,
  ArrowRight,
  User,
  Tag,
  Clock,
  BookOpen
} from 'lucide-react';
import { LabSession } from '../../types/laboratory';

interface LabSessionHeaderProps {
  session: LabSession;
  onPauseSession: () => void;
  onResumeSession: () => void;
  onCompleteSession: () => void;
  onSelectReplicate: (replicateNumber: number) => void;
  onAddReplicate: () => void;
  onExitSession: () => void;
  onViewStandardDetail?: (standardId: string) => void;
}

export const LabSessionHeader: React.FC<LabSessionHeaderProps> = ({
  session,
  onPauseSession,
  onResumeSession,
  onCompleteSession,
  onSelectReplicate,
  onAddReplicate,
  onExitSession,
  onViewStandardDetail
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Format elapsed seconds as HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const isRunning = session.status === 'running';
  const isPaused = session.status === 'paused';
  const isCompleted = session.status === 'completed';

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs p-5 mb-6">
      {/* Top Bar: Back button, Title & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onExitSession}
            className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors mt-0.5"
            title="بازگشت به فهرست آزمایش‌ها"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <h1 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {session.title}
              </h1>

              {/* Status Badge */}
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5 ${
                  isRunning
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : isPaused
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isRunning ? 'bg-emerald-500 animate-pulse' : isPaused ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                />
                {isRunning ? 'در حال اجرا' : isPaused ? 'متوقف موقت (Paused)' : 'تکمیل‌شده'}
              </span>

              {/* Standard Reference Badge */}
              {session.standardNumber && (
                <button
                  type="button"
                  onClick={() => session.standardId && onViewStandardDetail && onViewStandardDetail(session.standardId)}
                  className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-750 transition-colors flex items-center gap-1"
                  title="مشاهده مشخصات استاندارد مرجع"
                >
                  <BookOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  {session.standardNumber}
                </button>
              )}
            </div>

            {/* Sub details: sample, operator, batch */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1 font-medium text-stone-700 dark:text-stone-300">
                <Tag className="w-3.5 h-3.5 text-stone-400" />
                نمونه: {session.sampleName} ({session.sampleCode})
              </span>
              {session.batchNumber && (
                <span>سری ساخت / بچ: <strong className="font-mono text-stone-700 dark:text-stone-300">{session.batchNumber}</strong></span>
              )}
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                کارشناس: {session.operatorName}
              </span>
            </div>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Offline/IndexedDB indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">IndexedDB:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">ذخیره‌شده</span>
            <span className="text-stone-300 dark:text-stone-700">|</span>
            {isOnline ? (
              <span className="flex items-center gap-1 text-stone-500" title="اتصال اینترنت برقرار است">
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 font-medium" title="حالت آفلاین (بدون اینترنت) - اطلاعات محفوظ است">
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                آفلاین
              </span>
            )}
          </div>

          {/* Digital Timer */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-stone-900 text-stone-100 dark:bg-stone-800 font-mono text-sm font-semibold tracking-wider">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{formatTime(session.elapsedSeconds)}</span>
          </div>

          {/* Action Buttons */}
          {!isCompleted && (
            <div className="flex items-center gap-2">
              {isRunning ? (
                <button
                  type="button"
                  onClick={onPauseSession}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                  title="مکث موقت آزمایش"
                >
                  <Pause className="w-3.5 h-3.5" />
                  مکث (Pause)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onResumeSession}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
                  title="ادامه آزمایش"
                >
                  <Play className="w-3.5 h-3.5" />
                  ادامه (Continue)
                </button>
              )}

              <button
                type="button"
                onClick={onCompleteSession}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                پایان و ثبت نهایی
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Replicates Bar */}
      <div className="flex items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 pl-1 shrink-0">
            تکرارهای آزمون:
          </span>
          {session.replicates.map((rep) => {
            const isCurrent = rep.replicateNumber === session.currentReplicateNumber;
            const isRepCompleted = rep.status === 'completed';

            return (
              <button
                key={rep.replicateNumber}
                type="button"
                onClick={() => onSelectReplicate(rep.replicateNumber)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : isRepCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span>{rep.title}</span>
                {isRepCompleted && <CheckCircle className="w-3 h-3" />}
              </button>
            );
          })}

          {!isCompleted && (
            <button
              type="button"
              onClick={onAddReplicate}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-dashed border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-750 transition-colors flex items-center gap-1 shrink-0"
              title="افزودن تکرار جدید برای افزایش دقت آماری"
            >
              <Plus className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              افزودن تکرار
            </button>
          )}
        </div>

        {/* Progress percent indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-stone-500">
          <span>
            گام {session.currentStepNumber} از {session.steps.length}
          </span>
          <div className="w-24 bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{
                width: `${(session.currentStepNumber / session.steps.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
