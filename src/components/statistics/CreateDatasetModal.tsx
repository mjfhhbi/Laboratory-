import React, { useState } from 'react';
import { X, Plus, Trash2, Database, HelpCircle } from 'lucide-react';
import { StatisticalDataset, ExperimentalDesignType } from '../../types/statistics';

interface CreateDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataset: StatisticalDataset) => void;
}

export const CreateDatasetModal: React.FC<CreateDatasetModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [foodMatrix, setFoodMatrix] = useState('');
  const [designType, setDesignType] = useState<ExperimentalDesignType>('crd');
  const [responseName, setResponseName] = useState('');
  const [responseUnit, setResponseUnit] = useState('');
  const [alphaLevel, setAlphaLevel] = useState<number>(0.05);

  const [treatmentNames, setTreatmentNames] = useState<string[]>([
    'تیمار شاهد (Control)',
    'تیمار ۱',
    'تیمار ۲'
  ]);
  const [initialReplicatesCount, setInitialReplicatesCount] = useState<number>(3);

  if (!isOpen) return null;

  const handleAddTreatment = () => {
    setTreatmentNames([...treatmentNames, `تیمار ${treatmentNames.length + 1}`]);
  };

  const handleRemoveTreatment = (index: number) => {
    if (treatmentNames.length <= 2) return;
    setTreatmentNames(treatmentNames.filter((_, i) => i !== index));
  };

  const handleTreatmentChange = (index: number, val: string) => {
    const updated = [...treatmentNames];
    updated[index] = val;
    setTreatmentNames(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !responseName.trim()) return;

    const newDataset: StatisticalDataset = {
      id: `ds-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      foodMatrix: foodMatrix.trim() || 'نمونه آزمایشگاهی',
      designType,
      responseVariable: {
        name: responseName.trim(),
        unit: responseUnit.trim() || undefined
      },
      independentFactors: [
        {
          id: `factor-${Date.now()}`,
          name: 'تیمار آزمایشی',
          levels: treatmentNames
        }
      ],
      alphaLevel,
      userClarifications: {
        independence: 'fully_independent',
        scaleType: 'continuous_ratio'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      groups: treatmentNames.map((name, idx) => ({
        id: `grp-${Date.now()}-${idx}`,
        name: name.trim() || `تیمار ${idx + 1}`,
        treatmentLabel: `T${idx + 1}`,
        replicates: Array.from({ length: initialReplicatesCount }, (_, rIdx) => ({
          id: `rep-${Date.now()}-${idx}-${rIdx}`,
          repNumber: rIdx + 1,
          rawValue: null
        }))
      }))
    };

    onSave(newDataset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">تعریف دیتاست و طراحی آزمایش جدید</h2>
              <p className="text-xs text-slate-500">پیکربندی طرح آزمایشی، گروه‌ها و متغیر پاسخ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                عنوان آزمایش / دیتاست <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: بررسی اثر دمای فرایند حرارتی بر غلظت ویتامین C"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ماتریس ماده غذایی</label>
              <input
                type="text"
                placeholder="مثال: آب پرتقال طبیعی پاستوریزه"
                value={foodMatrix}
                onChange={(e) => setFoodMatrix(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">نوع طرح آزمایشی</label>
              <select
                value={designType}
                onChange={(e) => setDesignType(e.target.value as ExperimentalDesignType)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                <option value="crd">طرح کاملاً تصادفی (CRD - Completely Randomized)</option>
                <option value="rcbd">طرح بلوک‌های کامل تصادفی (RCBD - Randomized Block)</option>
                <option value="factorial_crd">آزمایش فاکتوریل (Factorial)</option>
                <option value="repeated_measures">طرح اندازه‌گیری‌های مکرر (Repeated Measures)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                نام متغیر پاسخ (وابسته) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: اسیدیته کل، بار میکروبی، اندیس پراکسید"
                value={responseName}
                onChange={(e) => setResponseName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">واحد اندازه‌گیری متغیر پاسخ</label>
              <input
                type="text"
                placeholder="مثال: mg/100g, Log CFU/g, %"
                value={responseUnit}
                onChange={(e) => setResponseUnit(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">سطح معنی‌داری (آلفا α)</label>
              <select
                value={alphaLevel}
                onChange={(e) => setAlphaLevel(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                <option value="0.05">α = 0.05 (سطح اطمینان ۹۵٪ - استاندارد)</option>
                <option value="0.01">α = 0.01 (سطح اطمینان ۹۹٪ - سخت‌گیرانه)</option>
                <option value="0.10">α = 0.10 (سطح اطمینان ۹۰٪)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تعداد تکرار اولیه برای هر تیمار</label>
              <input
                type="number"
                min="2"
                max="20"
                value={initialReplicatesCount}
                onChange={(e) => setInitialReplicatesCount(Math.max(2, parseInt(e.target.value) || 3))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">توصیه علمی: حداقل ۳ تکرار برای ارزیابی معتبر خطای آزمایش</p>
            </div>
          </div>

          {/* Treatment Groups Setup */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                گروه‌ها / تیمارهای آزمایشی ({treatmentNames.length} گروه)
              </label>
              <button
                type="button"
                onClick={handleAddTreatment}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                افزودن تیمار جدید
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {treatmentNames.map((name, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-slate-400 w-6 text-center">
                    T{idx + 1}
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleTreatmentChange(idx, e.target.value)}
                    placeholder={`نام تیمار ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {treatmentNames.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTreatment(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="حذف این تیمار"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              ایجاد و شروع ثبت داده
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
