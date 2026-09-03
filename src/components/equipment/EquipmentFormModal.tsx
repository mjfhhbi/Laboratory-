import React, { useState, useEffect } from 'react';
import {
  LaboratoryEquipment,
  EquipmentCategory,
  CalibrationStatus,
  EQUIPMENT_CATEGORIES,
  CALIBRATION_STATUS_META
} from '../../types/laboratoryEquipment';
import { validateEquipment } from '../../lib/storage/equipmentStorage';
import {
  X,
  Plus,
  Trash2,
  Save,
  Wrench,
  AlertCircle,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: LaboratoryEquipment) => Promise<void>;
  initialData?: LaboratoryEquipment | null;
}

export const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<LaboratoryEquipment>>({
    nameFa: '',
    nameEn: '',
    code: '',
    category: 'balance',
    model: '',
    manufacturer: '',
    location: '',
    serialNumber: '',
    specifications: {
      capacity: '',
      accuracy: '',
      resolution: '',
      measurementRange: '',
      isSpecifiedInSource: true
    },
    applications: [''],
    limitations: [''],
    performanceVerificationMethod: '',
    calibrationStatus: 'valid',
    lastCalibrationDate: '',
    nextCalibrationDate: '',
    calibrationIntervalMonths: 12,
    calibrationProvider: '',
    commonErrors: [
      {
        title: '',
        symptom: '',
        probableCause: '',
        correctiveAction: ''
      }
    ],
    maintenanceNotes: [''],
    standardOperatingProcedure: '',
    safetyNotes: [''],
    offlineAvailable: true
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [validationWarnings, setValidationWarnings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nameFa: '',
        nameEn: '',
        code: `EQ-${Date.now().toString().slice(-4)}`,
        category: 'balance',
        model: '',
        manufacturer: '',
        location: '',
        serialNumber: '',
        specifications: {
          capacity: '',
          accuracy: '',
          resolution: '',
          measurementRange: '',
          isSpecifiedInSource: true
        },
        applications: [''],
        limitations: [''],
        performanceVerificationMethod: 'کنترل روزانه نقطه صفر و پایش صحت عملکرد طبق دستورالعمل',
        calibrationStatus: 'valid',
        lastCalibrationDate: new Date().toISOString().split('T')[0],
        nextCalibrationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        calibrationIntervalMonths: 12,
        calibrationProvider: 'آزمایشگاه کالیبراسیون همکار ۱۷۰۲۵',
        commonErrors: [
          {
            title: '',
            symptom: '',
            probableCause: '',
            correctiveAction: ''
          }
        ],
        maintenanceNotes: ['تمیزکاری روزانه با دستمال نرم بدون پرز'],
        standardOperatingProcedure: '',
        safetyNotes: ['رعایت اصول ایمنی عمومی کار در آزمایشگاه'],
        offlineAvailable: true
      });
    }
    setValidationErrors({});
    setValidationWarnings({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateEquipment(formData);

    if (!result.isValid) {
      const errMap: Record<string, string> = {};
      result.errors.forEach((err) => {
        errMap[err.field] = err.message;
      });
      setValidationErrors(errMap);
      return;
    }

    const warnMap: Record<string, string> = {};
    result.warnings.forEach((warn) => {
      warnMap[warn.field] = warn.message;
    });
    setValidationWarnings(warnMap);

    setIsSaving(true);
    try {
      // Clean empty items from arrays
      const cleanedData: Partial<LaboratoryEquipment> = {
        ...formData,
        applications: (formData.applications || []).filter((s) => s.trim() !== ''),
        limitations: (formData.limitations || []).filter((s) => s.trim() !== ''),
        maintenanceNotes: (formData.maintenanceNotes || []).filter((s) => s.trim() !== ''),
        safetyNotes: (formData.safetyNotes || []).filter((s) => s.trim() !== ''),
        commonErrors: (formData.commonErrors || []).filter((e) => e.title.trim() !== '')
      };

      await onSave(cleanedData as LaboratoryEquipment);
      onClose();
    } catch (error) {
      console.error('Failed to save equipment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addArrayItem = (field: 'applications' | 'limitations' | 'maintenanceNotes' | 'safetyNotes') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeArrayItem = (field: 'applications' | 'limitations' | 'maintenanceNotes' | 'safetyNotes', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, idx) => idx !== index)
    }));
  };

  const updateArrayItem = (
    field: 'applications' | 'limitations' | 'maintenanceNotes' | 'safetyNotes',
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...(prev[field] || [])];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {initialData ? 'ویرایش شناسنامه تجهیز آزمایشگاهی' : 'ثبت دستگاه یا تجهیز آزمایشگاهی جدید'}
              </h3>
              <p className="text-xs text-stone-500">
                تعریف مشخصات فنی، دقت، حدود اندازه‌گیری، کنترل کالیبراسیون و عیب‌یابی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Section 1: Basic Identifiers */}
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm border-b pb-1.5 flex items-center gap-2">
              <span>۱. مشخصات هویتی و دسته‌بندی دستگاه</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  نام فارسی دستگاه *
                </label>
                <input
                  type="text"
                  value={formData.nameFa || ''}
                  onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                  placeholder="مثال: ترازوی آنالیتیکال ۴ رقمی"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {validationErrors.nameFa && (
                  <span className="text-rose-600 text-[11px] mt-1 block">{validationErrors.nameFa}</span>
                )}
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  نام لاتین (English Title)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.nameEn || ''}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Analytical Balance"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  کد شناسایی دستگاه (Equipment Code) *
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="EQ-BAL-001"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold"
                />
                {validationErrors.code && (
                  <span className="text-rose-600 text-[11px] mt-1 block">{validationErrors.code}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  دسته‌بندی تجهیز (از ۱۷ دسته) *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as EquipmentCategory })}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {Object.entries(EQUIPMENT_CATEGORIES).map(([key, meta]) => (
                    <option key={key} value={key}>
                      {meta.titleFa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  مدل دستگاه
                </label>
                <input
                  type="text"
                  value={formData.model || ''}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="مدل فنی"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  سازنده / برند
                </label>
                <input
                  type="text"
                  value={formData.manufacturer || ''}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="برند یا کمپانی سازنده"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  محل استقرار در آزمایشگاه
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="بخش شیمی / میکروبیولوژی"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Technical Specifications */}
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm border-b pb-1.5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>۲. مشخصات فنی، دقت، Resolution و حدود اندازه‌گیری</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  دقت / عدم قطعیت (Accuracy)
                </label>
                <input
                  type="text"
                  value={formData.specifications?.accuracy || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        accuracy: e.target.value
                      }
                    })
                  }
                  placeholder="مثال: ± ۰.۰۰۰۱ گرم یا ± ۰.۰۱ pH"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium text-emerald-800 dark:text-emerald-300"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  تفکیک‌پذیری (Resolution)
                </label>
                <input
                  type="text"
                  value={formData.specifications?.resolution || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        resolution: e.target.value
                      }
                    })
                  }
                  placeholder="مثال: ۰.۰۰۰۱ گرم / ۰.۱ درجه سلسیوس"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  ظرفیت اسمی (Capacity)
                </label>
                <input
                  type="text"
                  value={formData.specifications?.capacity || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        capacity: e.target.value
                      }
                    })
                  }
                  placeholder="مثال: ۲۲۰ گرم یا ۵۵ لیتر یا ۱۲ لوله"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  محدوده اندازه‌گیری (Measurement Range)
                </label>
                <input
                  type="text"
                  value={formData.specifications?.measurementRange || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        measurementRange: e.target.value
                      }
                    })
                  }
                  placeholder="مثال: ۰ تا ۲۵۰ درجه سلسیوس یا ۰ تا ۱۴ pH"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Calibration & Performance Verification */}
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm border-b pb-1.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>۳. کنترل عملکرد و مدیریت کالیبراسیون</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  وضعیت کالیبراسیون
                </label>
                <select
                  value={formData.calibrationStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, calibrationStatus: e.target.value as CalibrationStatus })
                  }
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.entries(CALIBRATION_STATUS_META).map(([key, meta]) => (
                    <option key={key} value={key}>
                      {meta.labelFa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  تاریخ آخرین کالیبراسیون
                </label>
                <input
                  type="date"
                  value={formData.lastCalibrationDate || ''}
                  onChange={(e) => setFormData({ ...formData, lastCalibrationDate: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  تاریخ کالیبراسیون بعدی
                </label>
                <input
                  type="date"
                  value={formData.nextCalibrationDate || ''}
                  onChange={(e) => setFormData({ ...formData, nextCalibrationDate: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                روش کنترل عملکرد روزانه (Daily Performance Verification Method)
              </label>
              <textarea
                rows={2}
                value={formData.performanceVerificationMethod || ''}
                onChange={(e) => setFormData({ ...formData, performanceVerificationMethod: e.target.value })}
                placeholder="چک‌لیست بررسی نقطه صفر، کالیبراسیون روزانه با بافر یا وزنه کالیبره..."
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Section 4: Applications & Limitations */}
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm border-b pb-1.5">
              ۴. کاربردها در آزمون‌های غذایی و محدودیت‌های استفاده
            </h4>

            {/* Applications list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  کاربردهای اصلی در آزمون‌ها:
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('applications')}
                  className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن کاربرد</span>
                </button>
              </div>
              <div className="space-y-2">
                {(formData.applications || []).map((app, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={app}
                      onChange={(e) => updateArrayItem('applications', idx, e.target.value)}
                      placeholder="عنوان کاربرد در آزمون"
                      className="flex-1 p-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('applications', idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  محدودیت‌های استفاده و شرایط نامعتبر شدن:
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('limitations')}
                  className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن محدودیت</span>
                </button>
              </div>
              <div className="space-y-2">
                {(formData.limitations || []).map((lim, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={lim}
                      onChange={(e) => updateArrayItem('limitations', idx, e.target.value)}
                      placeholder="شرح محدودیت عملیاتی"
                      className="flex-1 p-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('limitations', idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Warnings Display */}
          {Object.keys(validationWarnings).length > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl space-y-1">
              {Object.values(validationWarnings).map((msg, i) => (
                <div key={i} className="text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          )}

          {/* Form Actions */}
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-end gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-100 font-semibold"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره در پایگاه تجهیزات'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
