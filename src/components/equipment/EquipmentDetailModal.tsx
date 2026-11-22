import React, { useState } from 'react';
import {
  LaboratoryEquipment,
  EQUIPMENT_CATEGORIES,
  CALIBRATION_STATUS_META
} from '../../types/laboratoryEquipment';
import {
  X,
  Scale,
  Flame,
  FlameKindling,
  Activity,
  Waves,
  RotateCw,
  ThermometerSun,
  ShieldAlert,
  Pipette,
  Wind,
  Box,
  Search,
  Droplet,
  Cpu,
  Microscope,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  AlertOctagon,
  ShieldCheck,
  Check,
  Zap,
  Bookmark
} from 'lucide-react';

interface EquipmentDetailModalProps {
  equipment: LaboratoryEquipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectExperiment?: (experimentCode: string) => void;
}

type TabType = 'specs' | 'applications' | 'calibration' | 'troubleshooting' | 'maintenance' | 'experiments';

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onSelectExperiment
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('specs');

  if (!isOpen || !equipment) return null;

  const categoryMeta = EQUIPMENT_CATEGORIES[equipment.category] || {
    titleFa: equipment.category,
    titleEn: 'Equipment',
    badgeColor: 'bg-stone-100 text-stone-700',
    color: '#78716c',
    iconName: 'Wrench'
  };

  const statusMeta = CALIBRATION_STATUS_META[equipment.calibrationStatus] || {
    labelFa: equipment.calibrationStatus,
    badgeColor: 'bg-stone-100 text-stone-700',
    descriptionFa: ''
  };

  const specs = equipment.specifications || {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 w-full max-w-4xl max-h-[96vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <div
              className="p-3 sm:p-3.5 rounded-xl text-white shadow-md shrink-0"
              style={{ backgroundColor: categoryMeta.color }}
            >
              <Wrench className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className="text-xs px-2.5 py-0.5 rounded-md font-semibold text-white"
                  style={{ backgroundColor: categoryMeta.color }}
                >
                  {categoryMeta.titleFa}
                </span>
                <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded">
                  {equipment.code}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-md font-medium border flex items-center gap-1 ${statusMeta.badgeColor}`}
                >
                  {statusMeta.labelFa}
                </span>
              </div>

              <h2 className="text-base sm:text-xl font-bold text-stone-900 dark:text-stone-100 break-words leading-snug">
                {equipment.nameFa}
              </h2>
              <p className="text-xs text-stone-500 font-sans tracking-wide break-words" dir="ltr">
                {equipment.nameEn}
              </p>

              {(equipment.location || equipment.model || equipment.manufacturer) && (
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-600 dark:text-stone-400">
                  {equipment.location && <span>📍 {equipment.location}</span>}
                  {equipment.model && <span>مدل: <strong className="font-mono text-stone-800 dark:text-stone-200">{equipment.model}</strong></span>}
                  {equipment.manufacturer && <span>سازنده: {equipment.manufacturer}</span>}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            title="بستن"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-3 sm:px-6 border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/80 overflow-x-auto text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-3 sm:px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[44px] ${
              activeTab === 'specs'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>مشخصات فنی و مقادیر نامی</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'applications'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>کاربردها و محدودیت‌های عملیاتی</span>
          </button>

          <button
            onClick={() => setActiveTab('calibration')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'calibration'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>کنترل عملکرد و کالیبراسیون</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'troubleshooting'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>عیب‌یابی و خطاهای رایج ({equipment.commonErrors?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>نگهداری و الزامات ایمنی</span>
          </button>

          <button
            onClick={() => setActiveTab('experiments')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'experiments'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>آزمایش‌های متصل ({equipment.associatedExperimentCodes?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {/* TAB 1: TECHNICAL SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>اصل مشخصات فنی رسمی</span>
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed">
                  {equipment.isSourceVerified
                    ? 'مشخصات فنی و حدود اندازه‌گیری این دستگاه بر مبنای استانداردهای ملی INSO، روش‌های AOAC و الزامات ISO 17025 تدوین شده است.'
                    : 'مشخصات بر مبنای راهنمای عمومی تجهیزات آزمایشگاهی تنظیم گردیده است.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <span className="text-xs text-stone-500 font-semibold block">دقت و عدم قطعیت مجاز (Accuracy / Uncertainty):</span>
                  <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                    {specs.accuracy || (
                      <span className="text-xs text-stone-400 italic font-normal">تعیین‌شده در پروتکل آزمون استاندارد</span>
                    )}
                  </div>
                </div>

                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <span className="text-xs text-stone-500 font-semibold block">تفکیک‌پذیری (Resolution):</span>
                  <div className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {specs.resolution || (
                      <span className="text-xs text-stone-400 italic font-normal">مطابق استاندارد دستگاه</span>
                    )}
                  </div>
                </div>

                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <span className="text-xs text-stone-500 font-semibold block">ظرفیت اسمی (Capacity):</span>
                  <div className="text-base font-medium text-stone-800 dark:text-stone-200">
                    {specs.capacity || (
                      <span className="text-xs text-stone-400 italic font-normal">بسته به نمونه و ظروف آزمایشگاهی</span>
                    )}
                  </div>
                </div>

                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <span className="text-xs text-stone-500 font-semibold block">محدوده اندازه‌گیری (Measurement Range):</span>
                  <div className="text-base font-medium text-stone-800 dark:text-stone-200">
                    {specs.measurementRange || (
                      <span className="text-xs text-stone-400 italic font-normal">پوشش کامل بازه آزمون‌های استاندارد</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Standard operating parameters */}
              <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                  الزامات محیطی و شرایط کاری دستگاه:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-stone-600 dark:text-stone-300">
                  <div>
                    <strong className="text-stone-700 dark:text-stone-200">دمای عملیاتی محیط:</strong> ۲۰ الی ۲۵ درجه سلسیوس (پرهیز از تابش مستقیم خورشید)
                  </div>
                  <div>
                    <strong className="text-stone-700 dark:text-stone-200">رطوبت نسبی مجاز:</strong> زیر ۶۵٪ جهت جلوگیری از خوردگی مدارها و جذب رطوبت
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATIONS & LIMITATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              {/* Applications */}
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>کاربردهای دستگاه در آزمون‌های صنایع غذایی:</span>
                </h4>
                <div className="space-y-2">
                  {equipment.applications && equipment.applications.length > 0 ? (
                    equipment.applications.map((app, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-50 dark:bg-stone-950 p-3 rounded-lg border border-stone-200/80 dark:border-stone-800 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-stone-800 dark:text-stone-200 text-xs leading-relaxed">
                          {app}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-400 italic">کاربردی ثبت نشده است.</p>
                  )}
                </div>
              </div>

              {/* Limitations */}
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-amber-600" />
                  <span>محدودیت‌های استفاده و شرایط نامعتبر شدن آزمون:</span>
                </h4>
                <div className="space-y-2">
                  {equipment.limitations && equipment.limitations.length > 0 ? (
                    equipment.limitations.map((limit, idx) => (
                      <div
                        key={idx}
                        className="bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5"
                      >
                        <span className="text-amber-600 font-bold text-sm mt-0.5">•</span>
                        <p className="text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                          {limit}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-400 italic">محدودیت خاصی ثبت نشده است.</p>
                  )}
                </div>
              </div>

              {/* SOP Summary */}
              {equipment.standardOperatingProcedure && (
                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                    دستورالعمل استاندارد کاربری (SOP Summary):
                  </h4>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                    {equipment.standardOperatingProcedure}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CALIBRATION & VERIFICATION */}
          {activeTab === 'calibration' && (
            <div className="space-y-6">
              <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500">وضعیت اعتبار کالیبراسیون:</span>
                  <span className={`text-xs px-3 py-1 rounded-md font-semibold border ${statusMeta.badgeColor}`}>
                    {statusMeta.labelFa}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {statusMeta.descriptionFa}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-xs text-stone-500 font-semibold block mb-1">تاریخ آخرین کالیبراسیون:</span>
                  <div className="text-sm font-bold font-mono text-stone-800 dark:text-stone-200">
                    {equipment.lastCalibrationDate || 'ثبت نشده'}
                  </div>
                </div>

                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-xs text-stone-500 font-semibold block mb-1">تاریخ کالیبراسیون بعدی (انقضا):</span>
                  <div className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    {equipment.nextCalibrationDate || 'عدم نیاز به انقضای ادواری'}
                  </div>
                </div>
              </div>

              {/* Performance Verification Method */}
              <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>روش کنترل عملکرد روزانه (Daily Performance Verification):</span>
                </h4>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {equipment.performanceVerificationMethod}
                </p>
              </div>

              {equipment.calibrationProvider && (
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  مرجع تایید صلاحیت کالیبراسیون: <strong>{equipment.calibrationProvider}</strong>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TROUBLESHOOTING & ERRORS */}
          {activeTab === 'troubleshooting' && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>خطاهای رایج دستگاه و راهنمای عیب‌یابی:</span>
              </h4>

              {equipment.commonErrors && equipment.commonErrors.length > 0 ? (
                <div className="space-y-3">
                  {equipment.commonErrors.map((err, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                          {err.title}
                        </span>
                        {err.errorCode && (
                          <span className="text-[11px] font-mono bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded">
                            {err.errorCode}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1 border-t border-stone-200/60 dark:border-stone-800/60">
                        <div>
                          <strong className="text-stone-600 dark:text-stone-400 block mb-0.5">نشانه و علامت:</strong>
                          <span className="text-stone-800 dark:text-stone-200">{err.symptom}</span>
                        </div>
                        <div>
                          <strong className="text-amber-700 dark:text-amber-400 block mb-0.5">علت احتمالی:</strong>
                          <span className="text-stone-800 dark:text-stone-200">{err.probableCause}</span>
                        </div>
                        <div>
                          <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">اقدام اصلاحی:</strong>
                          <span className="text-stone-800 dark:text-stone-200">{err.correctiveAction}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic">هیچ خطای متداولی ثبت نشده است.</p>
              )}
            </div>
          )}

          {/* TAB 5: MAINTENANCE & SAFETY */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              {/* Maintenance Notes */}
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-indigo-600" />
                  <span>نکات نگهداری و بازرسی‌های پیشگیرانه (PM):</span>
                </h4>
                <div className="space-y-2">
                  {equipment.maintenanceNotes && equipment.maintenanceNotes.length > 0 ? (
                    equipment.maintenanceNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-50 dark:bg-stone-950 p-3 rounded-lg border border-stone-200/80 dark:border-stone-800 flex items-start gap-2.5 text-xs text-stone-800 dark:text-stone-200"
                      >
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{note}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-400 italic">نکته نگهداری خاصی ثبت نشده است.</p>
                  )}
                </div>
              </div>

              {/* Safety Notes */}
              {equipment.safetyNotes && equipment.safetyNotes.length > 0 && (
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>الزامات ایمنی و حفاظت آزمایشگاهی (HSE):</span>
                  </h4>
                  <div className="space-y-2">
                    {equipment.safetyNotes.map((safe, idx) => (
                      <div
                        key={idx}
                        className="bg-rose-50/60 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200"
                      >
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{safe}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: LINKED EXPERIMENTS */}
          {activeTab === 'experiments' && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-600" />
                <span>آزمایش‌های متصل و نیازمند به این دستگاه:</span>
              </h4>

              {equipment.associatedExperimentCodes && equipment.associatedExperimentCodes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {equipment.associatedExperimentCodes.map((code, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-50 dark:bg-stone-950 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 block">
                          {code}
                        </span>
                        <span className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                          پروتکل آزمایشگاهی مرتبط
                        </span>
                      </div>

                      {onSelectExperiment && (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectExperiment(code);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          مشاهده آزمایش
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic">هیچ آزمایش متصلی تعریف نشده است.</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 flex items-center justify-between text-xs text-stone-500">
          <span>آخرین به‌روزرسانی: {new Date(equipment.updatedAt).toLocaleDateString('fa-IR')}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold rounded-lg transition-colors"
          >
            بستن شناسنامه
          </button>
        </div>
      </div>
    </div>
  );
};
