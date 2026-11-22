/**
 * Food Science AI - Laboratory Objective & Start Card (Stage 1)
 * Displays test objective, reference standard, sample tracking info, batch, and Start Experiment action.
 */

import React, { useState } from 'react';
import {
  Target,
  Play,
  BookOpen,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Compass,
  ArrowLeft,
  Barcode,
  Wrench,
  XCircle,
  HelpCircle,
  ExternalLink,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import { LabSession } from '../../types/laboratory';
import { EquipmentChecklistItem, LaboratoryEquipment } from '../../types/laboratoryEquipment';
import { EquipmentChecklistModal } from '../equipment/EquipmentChecklistModal';

interface LabObjectiveStartCardProps {
  session: LabSession;
  equipmentInventory?: LaboratoryEquipment[];
  onUpdateChecklist?: (updated: EquipmentChecklistItem[]) => void;
  onStartExperiment: () => void;
  onProceedToCalibration: () => void;
  onViewStandardDetail?: (standardId: string) => void;
}

export const LabObjectiveStartCard: React.FC<LabObjectiveStartCardProps> = ({
  session,
  equipmentInventory = [],
  onUpdateChecklist,
  onStartExperiment,
  onProceedToCalibration,
  onViewStandardDetail
}) => {
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const isStarted = session.status === 'running' || session.status === 'paused' || session.status === 'completed';

  const checklist = session.equipmentChecklist || [];
  const compatibleCount = checklist.filter((i) => i.compatibility === 'compatible').length;
  const notCompatibleCount = checklist.filter((i) => i.compatibility === 'not_compatible').length;
  const unknownCount = checklist.filter((i) => i.compatibility === 'unknown').length;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden mb-6">
      {/* Header */}
      <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              ۱. هدف و شناسنامه پروتکل آزمون (Objective & Sample Identification)
            </h2>
            <p className="text-xs text-stone-500">
              بررسی اهداف علمی و اصالت‌سنجی مشخصات نمونه پیش از آغاز فرآیند آزمایشگاهی
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
          کد نمونه: {session.sampleCode}
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Objective & Scientific Principle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200 font-bold text-xs">
              <Target className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>هدف علمی آزمون (Purpose / Objective):</span>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              {session.notes ||
                (session.standardSnapshot as any)?.descriptionFa ||
                (session.standardSnapshot as any)?.scope ||
                'سنجش کمی و کیفی شاخص‌های استاندارد مواد غذایی جهت کنترل کیفیت، تضمین سلامت مصرف‌کننده و انطباق با ضوابط قانونی.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-xs">
              <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>استاندارد مرجع قانونی (Standard Reference):</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {session.standardNumber || 'INSO Official Standard'}
                </span>
                {session.standardId && onViewStandardDetail && (
                  <button
                    type="button"
                    onClick={() => onViewStandardDetail(session.standardId!)}
                    className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    مشاهده متن استاندارد
                  </button>
                )}
              </div>
              <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                {session.standardTitleFa || session.title}
              </p>
            </div>
          </div>
        </div>

        {/* Sample Metadata Grid */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <Barcode className="w-4 h-4 text-emerald-600" />
            <span>مشخصات نمونه غذایی ارسالی به آزمایشگاه:</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800">
              <span className="text-stone-400 block text-[10px] mb-0.5">نام نمونه:</span>
              <strong className="text-stone-900 dark:text-stone-100">{session.sampleName}</strong>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800">
              <span className="text-stone-400 block text-[10px] mb-0.5">شماره بچ / لات:</span>
              <span className="font-mono text-stone-800 dark:text-stone-200">{session.batchNumber || 'تعیین‌نشده'}</span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800">
              <span className="text-stone-400 block text-[10px] mb-0.5">کارشناس مجری:</span>
              <span className="text-stone-800 dark:text-stone-200 flex items-center gap-1">
                <User className="w-3 h-3 text-stone-400" />
                <span>{session.operatorName}</span>
              </span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800">
              <span className="text-stone-400 block text-[10px] mb-0.5">محل استقرار:</span>
              <span className="text-stone-800 dark:text-stone-200">{session.laboratoryRoom || 'سالن آزمون شیمی/میکروب'}</span>
            </div>
          </div>
        </div>

        {/* PRE-EXPERIMENT EQUIPMENT CHECKLIST SECTION (Part 35 of 40) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-stone-200/70 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>چک‌لیست بررسی تجهیزات قبل از آزمایش (Equipment Checklist)</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  ارزیابی الزامات استاندارد در برابر مشخصات تجهیزات انتخابی (ظرفیت، دقت، رزولوشن، محدوده کاری و کالیبراسیون)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {checklist.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                    {compatibleCount} منطبق
                  </span>
                  {notCompatibleCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold">
                      {notCompatibleCount} نامنطبق
                    </span>
                  )}
                  {unknownCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                      {unknownCount} نامشخص
                    </span>
                  )}
                </div>
              )}

              {checklist.length > 0 && onUpdateChecklist && (
                <button
                  type="button"
                  onClick={() => setIsChecklistModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  <span>بررسی تفصیلی و تغییر دستگاه</span>
                </button>
              )}
            </div>
          </div>

          {/* Checklist Items Preview Table */}
          {checklist.length === 0 ? (
            <div className="p-4 text-center text-xs text-stone-500 bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
              تجهیز الزامی خاصی برای این آزمایش گزارش نشده یا از ابزارهای شیشه‌ای عمومی استفاده می‌شود.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-stone-900">
              <table className="w-full text-xs text-right border-collapse min-w-[620px]">
                <thead className="bg-stone-100/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-stone-700 text-[11px]">
                  <tr>
                    <th className="p-2.5">نام و نوع تجهیز</th>
                    <th className="p-2.5">دقت و ظرفیت موردنیاز (روش)</th>
                    <th className="p-2.5">دستگاه انتخابی آزمایشگاه</th>
                    <th className="p-2.5 text-center">وضعیت کالیبراسیون</th>
                    <th className="p-2.5 text-center">نتیجه انطباق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {checklist.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-850/50 transition-colors">
                      <td className="p-2.5">
                        <div className="font-bold text-stone-900 dark:text-stone-100">{item.equipmentName}</div>
                        <span className="text-[10px] text-stone-500 font-mono">نوع: {item.equipmentTypeTitleFa}</span>
                      </td>
                      <td className="p-2.5 text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                        <div>دقت: <strong className="text-stone-800 dark:text-stone-200">{item.requiredAccuracy || 'تعیین‌نشده در منبع'}</strong></div>
                        {item.requiredCapacity && <div>ظرفیت: {item.requiredCapacity}</div>}
                      </td>
                      <td className="p-2.5">
                        {item.userEquipmentName ? (
                          <div>
                            <div className="font-semibold text-stone-900 dark:text-stone-100 text-[11px]">
                              {item.userEquipmentName}
                            </div>
                            <div className="text-[10px] text-stone-500 font-mono">
                              کد: {item.userEquipmentCode || item.userEquipmentId} | دقت: {item.userAccuracy || 'نامشخص'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-400 text-[11px] italic">دستگاهی متصل نشده است</span>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-medium ${
                          item.userCalibrationStatus === 'valid'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : item.userCalibrationStatus === 'expired'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {item.userCalibrationStatus === 'valid'
                            ? 'معتبر'
                            : item.userCalibrationStatus === 'expired'
                            ? 'منقضی'
                            : item.userCalibrationStatus === 'not_required'
                            ? 'عدم نیاز'
                            : 'نیازمند بررسی'}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                          item.compatibility === 'compatible'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : item.compatibility === 'not_compatible'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        }`}>
                          {item.compatibility === 'compatible' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {item.compatibility === 'not_compatible' && <XCircle className="w-3.5 h-3.5" />}
                          {item.compatibility === 'unknown' && <HelpCircle className="w-3.5 h-3.5" />}
                          <span>
                            {item.compatibility === 'compatible'
                              ? 'Compatible (منطبق)'
                              : item.compatibility === 'not_compatible'
                              ? 'Not Compatible (نامنطبق)'
                              : 'Unknown (نامشخص)'}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Strict compliance anti-guess notification */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>قاعده ضد حدس (Anti-Guess Policy):</strong> سیستم هرگز بر اساس صرف نام یا عنوان دستگاه انطباق آن را تأیید نمی‌کند. در صورتی که دقت، محدوده کاری یا اطلاعات فنی دستگاه یا استاندارد نامشخص باشد، نتیجه الزماً <span className="font-mono font-bold">Unknown</span> ثبت خواهد شد.
            </span>
          </div>
        </div>

        {/* Start / Continue Button Banner */}
        <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-emerald-950 dark:text-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="block font-bold">آماده اجرای آزمون استاندارد</strong>
              <span className="text-stone-600 dark:text-stone-300">
                چک‌لیست تجهیزات را بررسی نموده و برای شروع رسمی روی دکمه زیر کلیک کنید.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {!isStarted ? (
              <button
                type="button"
                onClick={onStartExperiment}
                className="w-full sm:w-auto min-h-[42px] px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>شروع رسمی آزمایش (Start Experiment)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onProceedToCalibration}
                className="w-full sm:w-auto min-h-[42px] px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>ادامه به بررسی تجهیزات و کالیبراسیون</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Equipment Checklist Modal */}
      {isChecklistModalOpen && onUpdateChecklist && (
        <EquipmentChecklistModal
          isOpen={isChecklistModalOpen}
          onClose={() => setIsChecklistModalOpen(false)}
          checklist={checklist}
          equipmentInventory={equipmentInventory}
          onUpdateChecklist={onUpdateChecklist}
          title={`چک‌لیست تجهیزات پیش از آزمون: ${session.title}`}
          subtitle="بررسی تطابق الزامات فنی استاندارد با تجهیزات آزمایشگاه (دقت، ظرفیت، رزولوشن، محدوده کاری و کالیبراسیون)"
        />
      )}
    </div>
  );
};
