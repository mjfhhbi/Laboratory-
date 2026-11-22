/**
 * Food Science AI - Laboratory Equipment & Calibration Check Card (Stage 2)
 * Rigorously checks equipment readiness, calibration expiration, zeroing/taring, and measurement tolerance.
 */

import React from 'react';
import {
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Info,
  Scale,
  Wrench,
  Check
} from 'lucide-react';
import { LabSession } from '../../types/laboratory';
import { EquipmentChecklistItem, LaboratoryEquipment } from '../../types/laboratoryEquipment';
import { SmartEquipmentChecklistCard } from '../equipment/SmartEquipmentChecklistCard';

interface LabCalibrationCheckCardProps {
  session: LabSession;
  equipmentInventory?: LaboratoryEquipment[];
  onUpdateChecklist?: (updated: EquipmentChecklistItem[]) => void;
  onToggleEquipmentCheck: (eqId: string) => void;
  onMarkAllEquipmentChecked: () => void;
  onProceedToReagents: () => void;
  onBackToObjective: () => void;
}

export const LabCalibrationCheckCard: React.FC<LabCalibrationCheckCardProps> = ({
  session,
  equipmentInventory = [],
  onUpdateChecklist,
  onToggleEquipmentCheck,
  onMarkAllEquipmentChecked,
  onProceedToReagents,
  onBackToObjective
}) => {
  // If the session has the rich smart equipment checklist, render the comprehensive SmartEquipmentChecklistCard
  if (session.equipmentChecklist && session.equipmentChecklist.length > 0 && onUpdateChecklist) {
    return (
      <SmartEquipmentChecklistCard
        checklist={session.equipmentChecklist}
        equipmentInventory={equipmentInventory}
        onUpdateChecklist={onUpdateChecklist}
        onProceed={onProceedToReagents}
        onBack={onBackToObjective}
        title="۲. بررسی هوشمند تجهیزات و صحه‌گذاری کالیبراسیون (Equipment & Calibration)"
        subtitle="بررسی انطباق مشخصات فنی، دقت، ظرفیت، رزولوشن، محدوده کاری و کالیبراسیون تجهیزات با استانداردهای رسمی"
      />
    );
  }

  const totalEquipments = session.requiredEquipment.length;
  const verifiedEquipmentsCount = session.requiredEquipment.filter((e) => e.isPrepared).length;
  const allVerified = totalEquipments > 0 ? verifiedEquipmentsCount === totalEquipments : true;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden mb-6">
      {/* Header */}
      <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              ۲. بررسی تجهیزات و صحه‌گذاری کالیبراسیون (Equipment & Calibration)
            </h2>
            <p className="text-xs text-stone-500">
              بررسی گواهی کالیبراسیون معتبر، صفر کردن ترازوها و اطمینان از سلامت فنی ابزارها
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold ${
              allVerified
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
            }`}
          >
            {verifiedEquipmentsCount} از {totalEquipments} تجهیز آماده
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Verification Guideline Banner */}
        <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 text-xs space-y-1.5 text-sky-950 dark:text-sky-200">
          <div className="font-bold flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>دستورالعمل کالیبراسیون و تضمین کیفیت (GLP / ISO 17025):</span>
          </div>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
            پیش از آغاز هر آزمون، کلیه تجهیزات سنجش (مانند ترازوهای آنالیتیکال، بورت، pH متر، انکوباتور و رفراکتومتر) باید دارای برچسب کالیبراسیون معتبر بوده و از نظر پایداری نقطه صفر و عدم وجود انحراف بررسی گردند.
          </p>
        </div>

        {/* Equipment Check-List Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>فهرست تجهیزات مورد نیاز این پروتکل:</span>
            </h3>

            {totalEquipments > 0 && !allVerified && (
              <button
                type="button"
                onClick={onMarkAllEquipmentChecked}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
              >
                تأیید یکجای کالیبراسیون کلیه تجهیزات
              </button>
            )}
          </div>

          {totalEquipments === 0 ? (
            <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 dark:bg-stone-850 rounded-xl">
              تجهیز ویژه‌ای برای این آزمون ثبت نشده است (تجهیزات عمومی آزمایشگاه).
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {session.requiredEquipment.map((eq) => (
                <div
                  key={eq.id}
                  onClick={() => onToggleEquipmentCheck(eq.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    eq.isPrepared
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={eq.isPrepared}
                    onChange={() => onToggleEquipmentCheck(eq.id)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0 cursor-pointer"
                  />

                  <div className="flex-1 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-stone-900 dark:text-stone-100 font-bold">
                        {eq.name}
                      </strong>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          eq.isPrepared
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {eq.isPrepared ? 'کالیبره و آماده' : 'نیازمند بررسی'}
                      </span>
                    </div>

                    <p className="text-stone-500 dark:text-stone-400 text-[11px] leading-relaxed">
                      {eq.calibrationInfo ||
                        'بررسی تمیزی سطح، تراز بودن حباب تعادل، صفر کردن تار ترازو و تاریخ انقضای برچسب کالیبراسیون.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToObjective}
            className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به هدف آزمون</span>
          </button>

          <button
            type="button"
            onClick={onProceedToReagents}
            className="min-h-[40px] px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>ادامه به بررسی معرف‌ها و محلول‌ها</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
