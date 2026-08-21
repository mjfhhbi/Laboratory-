/**
 * Food Science AI - Lab Prerequisites Card
 * Displays required equipment, reagents, test conditions, and reference standard info.
 */

import React, { useState } from 'react';
import {
  Wrench,
  FlaskConical,
  Gauge,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { LabSession } from '../../types/laboratory';

interface LabPrerequisitesCardProps {
  session: LabSession;
  onToggleEquipmentCheck: (eqId: string) => void;
  onToggleReagentCheck: (reagId: string) => void;
  onViewStandardDetail?: (standardId: string) => void;
}

export const LabPrerequisitesCard: React.FC<LabPrerequisitesCardProps> = ({
  session,
  onToggleEquipmentCheck,
  onToggleReagentCheck,
  onViewStandardDetail
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'equipment' | 'reagents' | 'conditions' | 'standard'>('equipment');

  const eqCount = session.requiredEquipment.length;
  const eqPreparedCount = session.requiredEquipment.filter((e) => e.isPrepared).length;

  const reagCount = session.reagentsAndChemicals.length;
  const reagPreparedCount = session.reagentsAndChemicals.filter((r) => r.isPrepared).length;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              پیش‌نیازها و تجهیزات آزمون
              {session.standardNumber && (
                <span className="text-xs font-mono px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800">
                  {session.standardNumber}
                </span>
              )}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              تجهیزات، معرف‌ها و شرایط محیطی موردنیاز مطابق استاندارد
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              eqPreparedCount === eqCount && eqCount > 0
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}>
              تجهیزات: {eqPreparedCount} از {eqCount}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              reagPreparedCount === reagCount && reagCount > 0
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}>
              معرف‌ها: {reagPreparedCount} از {reagCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            title={isExpanded ? 'بستن پنل' : 'باز کردن پنل'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div>
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900 px-4 pt-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('equipment')}
              className={`pb-2.5 px-3 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'equipment'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400 font-bold'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              تجهیزات ({eqCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reagents')}
              className={`pb-2.5 px-3 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'reagents'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400 font-bold'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              مواد و معرف‌ها ({reagCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('conditions')}
              className={`pb-2.5 px-3 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'conditions'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400 font-bold'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              شرایط محیطی
            </button>
            {session.standardSnapshot && (
              <button
                type="button"
                onClick={() => setActiveTab('standard')}
                className={`pb-2.5 px-3 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'standard'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400 font-bold'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                استاندارد مرجع
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'equipment' && (
              <div>
                {session.requiredEquipment.length === 0 ? (
                  <p className="text-xs text-stone-500 dark:text-stone-400 italic py-2">
                    تجهیزات خاصی در این آزمون ثبت نشده است (استفاده از ظروف عمومی آزمایشگاهی).
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {session.requiredEquipment.map((eq) => (
                      <label
                        key={eq.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          eq.isPrepared
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                            : 'bg-stone-50/70 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={eq.isPrepared}
                          onChange={() => onToggleEquipmentCheck(eq.id)}
                          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 dark:border-stone-700"
                        />
                        <div className="flex-1">
                          <span className={eq.isPrepared ? 'line-through text-stone-500 dark:text-stone-400' : 'font-medium'}>
                            {eq.name}
                          </span>
                          {eq.calibrationInfo && (
                            <span className="block text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                              {eq.calibrationInfo}
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reagents' && (
              <div>
                {session.reagentsAndChemicals.length === 0 ? (
                  <p className="text-xs text-stone-500 dark:text-stone-400 italic py-2">
                    معرف یا ماده شیمیایی خاصی ثبت نشده است.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {session.reagentsAndChemicals.map((reag) => (
                      <label
                        key={reag.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          reag.isPrepared
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                            : 'bg-stone-50/70 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={reag.isPrepared}
                          onChange={() => onToggleReagentCheck(reag.id)}
                          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 dark:border-stone-700"
                        />
                        <div className="flex-1">
                          <span className={reag.isPrepared ? 'line-through text-stone-500 dark:text-stone-400' : 'font-medium'}>
                            {reag.name}
                          </span>
                          {reag.safetyInfo && (
                            <span className="block text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 inline" />
                              {reag.safetyInfo}
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'conditions' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px]">دمای محیطی هدف</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 mt-0.5 block">
                      {session.testConditions.ambientTemperature || '۲۲'} °C
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px]">رطوبت نسبی محیط</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 mt-0.5 block">
                      {session.testConditions.ambientHumidity || '۴۵'} %
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px]">کنترل کالیبراسیون</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5 block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تجهیزات معتبر
                    </span>
                  </div>
                </div>

                {session.testConditions.notes && (
                  <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-blue-900 dark:text-blue-200">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-0.5">الزامات محیطی استاندارد:</span>
                        <p className="leading-relaxed text-[12px]">{session.testConditions.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'standard' && session.standardSnapshot && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {session.standardSnapshot.titleFa}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded">
                      {session.standardSnapshot.standardNumber}
                    </span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 line-clamp-2 mb-2">
                    {session.standardSnapshot.scopeOfApplication}
                  </p>
                  {session.standardSnapshot.id && onViewStandardDetail && (
                    <button
                      type="button"
                      onClick={() => onViewStandardDetail(session.standardSnapshot!.id)}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      مشاهده متن کامل استاندارد و حدود مجاز
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
