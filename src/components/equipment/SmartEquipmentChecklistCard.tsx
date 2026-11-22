/**
 * Food Science AI - Smart Equipment Checklist Card (Part 35 of 40)
 * 
 * Displays the complete pre-experiment Equipment Checklist:
 * For each equipment:
 * - نام (Name)
 * - نوع (Type)
 * - ظرفیت (Capacity)
 * - دقت (Accuracy)
 * - Resolution
 * - محدوده کاری (Working Range)
 * - وضعیت Calibration
 * - شرایط موردنیاز (Required Conditions)
 * - Source
 * 
 * Side-by-side comparison: Required vs User Equipment
 * Deterministic Verdict: Compatible / Not Compatible / Unknown
 * NEVER certifies compatibility based solely on instrument name.
 */

import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
  Sliders,
  Check
} from 'lucide-react';
import {
  EquipmentChecklistItem,
  EquipmentCompatibilityVerdict,
  LaboratoryEquipment,
  EQUIPMENT_CATEGORIES,
  CALIBRATION_STATUS_META
} from '../../types/laboratoryEquipment';
import { updateChecklistItemWithUserEquipment } from '../../lib/equipment/equipmentChecklistEngine';

interface SmartEquipmentChecklistCardProps {
  checklist: EquipmentChecklistItem[];
  equipmentInventory: LaboratoryEquipment[];
  onUpdateChecklist: (updated: EquipmentChecklistItem[]) => void;
  onProceed?: () => void;
  onBack?: () => void;
  isReadOnly?: boolean;
  title?: string;
  subtitle?: string;
}

export const SmartEquipmentChecklistCard: React.FC<SmartEquipmentChecklistCardProps> = ({
  checklist,
  equipmentInventory,
  onUpdateChecklist,
  onProceed,
  onBack,
  isReadOnly = false,
  title = 'چک‌لیست هوشمند بررسی تجهیزات قبل از آزمون (Equipment Checklist)',
  subtitle = 'بررسی انطباق مشخصات فنی، دقت، ظرفیت، رزولوشن، محدوده کاری و کالیبراسیون تجهیزات با استانداردهای رسمی'
}) => {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [inventoryPickerItemId, setInventoryPickerItemId] = useState<string | null>(null);

  const totalCount = checklist.length;
  const compatibleCount = checklist.filter((i) => i.compatibility === 'compatible').length;
  const notCompatibleCount = checklist.filter((i) => i.compatibility === 'not_compatible').length;
  const unknownCount = checklist.filter((i) => i.compatibility === 'unknown').length;
  const verifiedCount = checklist.filter((i) => i.isVerifiedByOperator).length;

  const allVerified = totalCount > 0 ? verifiedCount === totalCount : true;
  const hasIncompatible = notCompatibleCount > 0;

  const handleSelectUserEquipment = (itemId: string, eq: LaboratoryEquipment) => {
    const updated = checklist.map((item) => {
      if (item.id === itemId) {
        return updateChecklistItemWithUserEquipment(item, eq);
      }
      return item;
    });
    onUpdateChecklist(updated);
    setInventoryPickerItemId(null);
  };

  const handleToggleVerified = (itemId: string) => {
    if (isReadOnly) return;
    const updated = checklist.map((item) => {
      if (item.id === itemId) {
        const nextState = !item.isVerifiedByOperator;
        return {
          ...item,
          isVerifiedByOperator: nextState,
          verifiedAt: nextState ? new Date().toISOString() : undefined
        };
      }
      return item;
    });
    onUpdateChecklist(updated);
  };

  const handleMarkAllVerified = () => {
    if (isReadOnly) return;
    const updated = checklist.map((item) => ({
      ...item,
      isVerifiedByOperator: true,
      verifiedAt: new Date().toISOString()
    }));
    onUpdateChecklist(updated);
  };

  const getVerdictBadge = (verdict: EquipmentCompatibilityVerdict) => {
    switch (verdict) {
      case 'compatible':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Compatible (منطبق)</span>
          </span>
        );
      case 'not_compatible':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Not Compatible (عدم انطباق)</span>
          </span>
        );
      case 'unknown':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Unknown (اطلاعات ناکافی)</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden space-y-4">
      {/* Header Bar */}
      <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-400 shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>{title}</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Statistical Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            منطبق: {compatibleCount}
          </span>
          {notCompatibleCount > 0 && (
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              عدم انطباق: {notCompatibleCount}
            </span>
          )}
          {unknownCount > 0 && (
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              نامشخص: {unknownCount}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Anti-Hallucination & Rigorous Engineering Guideline Banner */}
        <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 text-xs space-y-1.5 text-sky-950 dark:text-sky-200">
          <div className="font-bold flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>قاعده عدم تصمیم‌گیری بر اساس نام دستگاه (Anti-Name-Guessing Rule):</span>
          </div>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
            سیستم هوشمند انطباق تجهیزات هرگز فقط بر اساس نام دستگاه آن را تایید نمی‌کند. برای تایید وضعیت «Compatible»، مشخصات فنی (شامل دقت، ظرفیت، رزولوشن، دمای کاری و اعتبار کالیبراسیون) باید با نیازمندی استاندارد مقایسه شود. در صورت فقدان اطلاعات معتبر در شناسنامه تجهیز، نتیجه به صورت «Unknown» اعلام می‌گردد.
          </p>
        </div>

        {/* Global Warning if Incompatible Equipment Exists */}
        {hasIncompatible && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>هشدار عدم انطباق:</strong> یک یا چند دستگاه انتخاب‌شده دارای دقت نامناسب، کالیبراسیون منقضی یا ظرفیت ناکافی هستند. پیش از آغاز رسمی آزمون، دستگاه مناسب را از انبار انتخاب کنید.
            </span>
          </div>
        )}

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
            فهرست تجهیزات موردنیاز آزمون و انطباق سنجی: ({totalCount} مورد)
          </span>

          {!isReadOnly && totalCount > 0 && !allVerified && (
            <button
              type="button"
              onClick={handleMarkAllVerified}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>تأیید یکجای بررسی کلیه تجهیزات</span>
            </button>
          )}
        </div>

        {/* Checklist Items List */}
        {checklist.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 dark:bg-stone-850 rounded-xl">
            هیچ نیازمندی تجهیزاتی برای این پروتکل ثبت نشده است.
          </div>
        ) : (
          <div className="space-y-4">
            {checklist.map((item, idx) => {
              const isExpanded = expandedItemId === item.id;
              const isPickerOpen = inventoryPickerItemId === item.id;
              const categoryMeta = EQUIPMENT_CATEGORIES[item.equipmentType as keyof typeof EQUIPMENT_CATEGORIES] || {
                titleFa: item.equipmentTypeTitleFa,
                color: '#6b7280'
              };

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    item.compatibility === 'compatible'
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : item.compatibility === 'not_compatible'
                      ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
                  }`}
                >
                  {/* Item Main Summary Header */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-start sm:items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                          {idx + 1}
                        </span>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-sm font-bold text-stone-900 dark:text-stone-100">
                              {item.equipmentName}
                            </strong>

                            <span
                              className="text-[10px] px-2 py-0.5 rounded font-semibold"
                              style={{
                                backgroundColor: `${categoryMeta.color}15`,
                                color: categoryMeta.color
                              }}
                            >
                              نوع: {categoryMeta.titleFa}
                            </span>
                          </div>

                          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-2">
                            <span>مرجع روش: {item.source || 'استاندارد ملی'}</span>
                            {item.requiredConditions && (
                              <span>· شرایط: {item.requiredConditions}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Compatibility Verdict Badge & Expand */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {getVerdictBadge(item.compatibility)}

                        <button
                          type="button"
                          onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                          title="نمایش جزئیات مقایسه پارامترها"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Quick Specs Grid (Required vs User Equipment) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      {/* Left: Required Specifications */}
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200 dark:border-stone-800 space-y-1.5">
                        <span className="font-bold text-stone-900 dark:text-stone-100 block border-b border-stone-200 dark:border-stone-800 pb-1 flex items-center gap-1.5 text-[11px]">
                          <Scale className="w-3.5 h-3.5 text-indigo-500" />
                          <span>مشخصات الزامی روش استاندارد (Required):</span>
                        </span>

                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-stone-500">دقت الزامی:</span>
                            <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                              {item.requiredAccuracy || 'تعیین‌نشده در روش'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">ظرفیت الزامی:</span>
                            <span className="font-mono text-stone-800 dark:text-stone-200">
                              {item.requiredCapacity || 'متناسب با نمونه'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">رزولوشن:</span>
                            <span className="font-mono text-stone-800 dark:text-stone-200">
                              {item.requiredResolution || 'متعارف'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">محدوده کاری:</span>
                            <span className="font-mono text-stone-800 dark:text-stone-200">
                              {item.requiredWorkingRange || 'دمای محیط آزمون'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Selected User Equipment */}
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200 dark:border-stone-800 space-y-1.5">
                        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-1">
                          <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 text-[11px]">
                            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                            <span>تجهیز انتخاب‌شده کاربر (User Equipment):</span>
                          </span>

                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={() => setInventoryPickerItemId(isPickerOpen ? null : item.id)}
                              className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                            >
                              <Sliders className="w-3 h-3" />
                              <span>{item.userEquipmentName ? 'تغییر دستگاه' : 'انتخاب دستگاه'}</span>
                            </button>
                          )}
                        </div>

                        {item.userEquipmentName ? (
                          <div className="space-y-1 text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-stone-500">نام دستگاه:</span>
                              <strong className="text-stone-900 dark:text-stone-100 truncate max-w-[180px]">
                                {item.userEquipmentName}
                              </strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">دقت دستگاه:</span>
                              <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                                {item.userAccuracy || 'ثبت‌نشده (Unknown)'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">ظرفیت:</span>
                              <span className="font-mono text-stone-800 dark:text-stone-200">
                                {item.userCapacity || 'ثبت‌نشده'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">وضعیت کالیبراسیون:</span>
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                {item.userCalibrationStatus
                                  ? CALIBRATION_STATUS_META[item.userCalibrationStatus as keyof typeof CALIBRATION_STATUS_META]?.labelFa || item.userCalibrationStatus
                                  : 'نامشخص'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2 text-[11px] text-amber-700 dark:text-amber-400">
                            هنوز دستگاهی از موجودی آزمایشگاه الصاق نشده است.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Compatibility Explanation Summary */}
                    <div className="text-xs p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start gap-2">
                      <span className="font-bold text-stone-800 dark:text-stone-200 shrink-0">
                        نتیجه ارزیابی:
                      </span>
                      <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
                        {item.compatibilitySummary}
                      </p>
                    </div>

                    {/* Inventory Picker Dropdown (Conditional) */}
                    {isPickerOpen && (
                      <div className="p-3 bg-stone-100 dark:bg-stone-850 rounded-xl border border-stone-300 dark:border-stone-700 space-y-2 animate-in fade-in">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                          انتخاب از موجودی تجهیزات آزمایشگاه برای «{item.equipmentName}»:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {equipmentInventory.map((eq) => {
                            const isCurrent = item.userEquipmentId === eq.id;
                            return (
                              <button
                                key={eq.id}
                                type="button"
                                onClick={() => handleSelectUserEquipment(item.id, eq)}
                                className={`p-2 rounded-lg text-right text-xs border transition-all flex items-center justify-between ${
                                  isCurrent
                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-300'
                                }`}
                              >
                                <div className="space-y-0.5 truncate">
                                  <strong className="block truncate">{eq.nameFa}</strong>
                                  <span className="text-[10px] text-stone-500 font-mono block">
                                    دقت: {eq.specifications?.accuracy || 'ثبت‌نشده'} | ظرفیت: {eq.specifications?.capacity || 'ثبت‌نشده'}
                                  </span>
                                </div>
                                {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Detailed Parameter Comparison Breakdown (Expanded) */}
                    {isExpanded && item.parameterDetails && item.parameterDetails.length > 0 && (
                      <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                          تحلیل تفکیکی مشخصات فنی بر اساس قوانین روش استاندارد:
                        </span>

                        <div className="space-y-1.5">
                          {item.parameterDetails.map((param, pIdx) => (
                            <div
                              key={pIdx}
                              className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850/40 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                            >
                              <div className="space-y-0.5 flex-1">
                                <span className="font-bold text-stone-800 dark:text-stone-200">
                                  {param.labelFa}
                                </span>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                  {param.explanation}
                                </p>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <div className="text-[11px] text-left font-mono">
                                  <span className="text-stone-400 block text-[10px]">الزامی: {param.required || '—'}</span>
                                  <span className="text-stone-800 dark:text-stone-200 block font-bold">دستگاه: {param.actual || '—'}</span>
                                </div>
                                {getVerdictBadge(param.verdict)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Operator Checklist Sign-Off for this Item */}
                    <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={item.isVerifiedByOperator}
                          onChange={() => handleToggleVerified(item.id)}
                          disabled={isReadOnly}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          صحت فنی، کالیبراسیون و انطباق این تجهیز مورد تأیید اپراتور است.
                        </span>
                      </label>

                      {item.isVerifiedByOperator && item.verifiedAt && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                          تأیید شد ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>بازگشت به هدف آزمون</span>
            </button>
          ) : (
            <div />
          )}

          {onProceed && (
            <button
              type="button"
              onClick={onProceed}
              disabled={hasIncompatible}
              className={`w-full sm:w-auto min-h-[40px] px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 ${
                hasIncompatible
                  ? 'bg-stone-400 dark:bg-stone-700 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <span>تأیید چک‌لیست تجهیزات و ادامه به بررسی معرف‌ها</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
