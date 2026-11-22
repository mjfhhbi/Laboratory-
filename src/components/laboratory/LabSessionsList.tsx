/**
 * Food Science AI - Lab Sessions List Component
 * Displays past and running laboratory experiment sessions stored in IndexedDB.
 */

import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  FileText,
  Trash2,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Tag,
  Search,
  BookOpen,
  Plus
} from 'lucide-react';
import { LabSession } from '../../types/laboratory';

interface LabSessionsListProps {
  sessions: LabSession[];
  onStartNewSession: () => void;
  onResumeSession: (session: LabSession) => void;
  onViewReport: (session: LabSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onLoadTestMock?: () => void;
  onClearTestMocks?: () => void;
}

export const LabSessionsList: React.FC<LabSessionsListProps> = ({
  sessions,
  onStartNewSession,
  onResumeSession,
  onViewReport,
  onDeleteSession,
  onLoadTestMock,
  onClearTestMocks
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'real' | 'test_mock'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const testMockCount = sessions.filter((s) => s.isDemoOrTest || s.testTag === 'TEST-MOCK' || s.id.startsWith('test_mock_')).length;

  const filteredSessions = sessions.filter((s) => {
    const isMock = !!(s.isDemoOrTest || s.testTag === 'TEST-MOCK' || s.id.startsWith('test_mock_'));
    if (typeFilter === 'real' && isMock) return false;
    if (typeFilter === 'test_mock' && !isMock) return false;

    if (filterStatus === 'active' && !(s.status === 'running' || s.status === 'paused')) {
      return false;
    }
    if (filterStatus === 'completed' && s.status !== 'completed') {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchSample = s.sampleName.toLowerCase().includes(q) || s.sampleCode.toLowerCase().includes(q);
      const matchStd = s.standardNumber ? s.standardNumber.toLowerCase().includes(q) : false;
      const matchOperator = s.operatorName.toLowerCase().includes(q);
      return matchTitle || matchSample || matchStd || matchOperator;
    }
    return true;
  });

  const formatDuration = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hrs} ساعت و ${remainingMins} دقیقه`;
    }
    return `${mins} دقیقه و ${s} ثانیه`;
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col gap-3 bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Tabs */}
            <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                همه ({sessions.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                در حال اجرا ({sessions.filter((s) => s.status === 'running' || s.status === 'paused').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterStatus === 'completed'
                    ? 'bg-white dark:bg-stone-900 text-blue-700 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                تکمیل‌شده ({sessions.filter((s) => s.status === 'completed').length})
              </button>
            </div>

            {/* Real vs Mock Separation Tabs */}
            <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                کل داده‌ها
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('real')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  typeFilter === 'real'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                داده‌های واقعی ({sessions.length - testMockCount})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('test_mock')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  typeFilter === 'test_mock'
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                تست فنی [TEST] ({testMockCount})
              </button>
            </div>
          </div>

          {/* Quick Mock Generator and Clear Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {onLoadTestMock && (
              <button
                type="button"
                onClick={onLoadTestMock}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs"
                title="بارگذاری آزمایش نمونه کامل تستی با برچسب TEST جهت تست فنی زنجیره ۱۲ مرحله‌ای"
              >
                <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                <span>بارگذاری آزمایش نمونه تستی (TEST-MOCK)</span>
              </button>
            )}

            {testMockCount > 0 && onClearTestMocks && (
              <button
                type="button"
                onClick={onClearTestMocks}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="پاک‌سازی صرفاً نمونه‌های تستی بدون لمس داده‌های واقعی"
              >
                پاک‌سازی تست‌ها ({testMockCount})
              </button>
            )}
          </div>
        </div>

        {/* Search & New Session Button */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در نمونه، کد، استاندارد، کارشناس..."
              className="w-full text-xs pr-9 pl-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={onStartNewSession}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            شروع آزمایش جدید واقعی
          </button>
        </div>
      </div>

      {/* Sessions Grid / Empty State */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-200 dark:border-emerald-800">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
            آزمایشی در این دسته‌بندی یافت نشد
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-4">
            می‌توانید یک آزمایش جدید واقعی شروع کنید یا برای بررسی عملکرد کامل سیستم روی «بارگذاری آزمایش نمونه تستی» کلیک کنید.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onStartNewSession}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              شروع آزمایش جدید واقعی
            </button>
            {onLoadTestMock && (
              <button
                type="button"
                onClick={onLoadTestMock}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 transition-colors inline-flex items-center gap-1.5"
              >
                <FlaskConical className="w-4 h-4 text-amber-600" />
                تست کامل زنجیره (TEST-MOCK)
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map((s) => {
            const isRunning = s.status === 'running' || s.status === 'paused';
            const isCompliant = s.standardConformance?.isCompliant;
            const isMock = !!(s.isDemoOrTest || s.testTag === 'TEST-MOCK' || s.id.startsWith('test_mock_'));

            return (
              <div
                key={s.id}
                className={`bg-white dark:bg-stone-900 border rounded-xl shadow-xs p-5 transition-all flex flex-col justify-between ${
                  isMock
                    ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50/10'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div>
                  {/* Card Header: Badges & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                          isRunning
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            s.status === 'running' ? 'bg-emerald-500 animate-pulse' : s.status === 'paused' ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                        />
                        {s.status === 'running' ? 'در حال اجرا' : s.status === 'paused' ? 'متوقف موقت' : 'تکمیل‌شده'}
                      </span>

                      {isMock && (
                        <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          TEST-MOCK
                        </span>
                      )}

                      {s.standardNumber && (
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                          {s.standardNumber}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-stone-400 font-mono">
                      {new Date(s.updatedAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>

                  {/* Title & Sample details */}
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1 line-clamp-1">
                    {s.title}
                  </h3>

                  <div className="space-y-1 text-xs text-stone-600 dark:text-stone-400 mb-3">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-stone-400" />
                      <span>نمونه: <strong>{s.sampleName}</strong> ({s.sampleCode})</span>
                    </div>
                    {s.batchNumber && (
                      <div className="text-[11px]">
                        سری ساخت: <span className="font-mono text-stone-700 dark:text-stone-300">{s.batchNumber}</span>
                      </div>
                    )}
                    <div className="text-[11px]">
                      کارشناس: {s.operatorName} | {s.replicates.length} تکرار ({s.replicates.filter((r) => r.status === 'completed').length} تکمیل‌شده)
                    </div>
                  </div>

                  {/* Conformance tag if evaluated */}
                  {s.standardConformance && s.standardConformance.verdict !== 'not_evaluated' && (
                    <div className={`p-2 rounded-lg text-xs mb-3 flex items-center justify-between border ${
                      isCompliant
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800'
                    }`}>
                      <span className="flex items-center gap-1.5 font-medium text-[11px]">
                        {isCompliant ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        {isCompliant ? 'منطبق با استاندارد' : 'عدم انطباق با حدود استاندارد'}
                      </span>
                      {s.repeatabilityAnalysis?.relativeStandardDeviationPercent !== undefined && (
                        <span className="font-mono text-[10px]">
                          RSD: {s.repeatabilityAnalysis.relativeStandardDeviationPercent}%
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-stone-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDuration(s.elapsedSeconds)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDeleteSession(s.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="حذف نشست آزمایش"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewReport(s)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      گزارش
                    </button>

                    {isRunning ? (
                      <button
                        type="button"
                        onClick={() => onResumeSession(s)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5" />
                        ادامه آزمایش
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onResumeSession(s)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300 transition-colors"
                      >
                        مشاهده / ویرایش
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
