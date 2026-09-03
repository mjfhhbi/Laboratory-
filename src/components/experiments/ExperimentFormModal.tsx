import React, { useState, useEffect } from 'react';
import {
  FoodExperiment,
  ExperimentDomain,
  EXPERIMENT_DOMAINS,
  ExperimentVerificationStatus,
  ReliabilityGrade,
  VERIFICATION_STATUS_META,
  RELIABILITY_GRADES
} from '../../types/foodExperiment';
import {
  X,
  Plus,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Save,
  FlaskConical,
  BookOpen,
  Info
} from 'lucide-react';
import { validateExperimentData } from '../../lib/storage/experimentStorage';

interface ExperimentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experiment: FoodExperiment) => Promise<void>;
  initialData?: FoodExperiment | null;
}

export const ExperimentFormModal: React.FC<ExperimentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<FoodExperiment>(() => {
    return initialData || {
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      code: 'EXP-NEW-001',
      titleFa: '',
      titleEn: '',
      domain: 'food_chemistry',
      objective: '',
      scope: '',
      principle: '',
      equipment: [],
      reagentsAndMaterials: [],
      samplePreparation: '',
      solutionsPreparation: '',
      environmentalConditions: {
        temperatureRange: '۲۰ الی ۲۵ درجه سلسیوس',
        relativeHumidity: 'زیر ۶۵٪',
        specialNotes: ''
      },
      procedureSteps: [
        {
          stepNumber: 1,
          title: 'گام نخست',
          description: ''
        }
      ],
      calculations: {
        formulaTitleFa: 'فرمول محاسبه',
        formulaExpression: '',
        variables: []
      },
      reporting: {
        unitOfMeasurement: '',
        decimalPrecision: 2
      },
      potentialErrors: [],
      safetyNotes: [],
      standardReference: {
        organization: 'INSO',
        standardNumber: '',
        titleFa: '',
        jurisdiction: 'iranian_national',
        isOfficialAdopted: true
      },
      sources: [],
      verificationStatus: 'verified_standard',
      reliabilityGrade: 'grade_a',
      tags: [],
      offlineAvailable: true,
      isVerifiedProtocol: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'materials' | 'steps' | 'calc' | 'safety' | 'standard'>('basic');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateExperimentData(formData);
    if (!val.isValid) {
      setValidationErrors(val.errors);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to add equipment
  const addEquipment = () => {
    setFormData(prev => ({
      ...prev,
      equipment: [...(prev.equipment || []), { name: '', nameEn: '', specification: '', isRequired: true }]
    }));
  };

  const removeEquipment = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== idx)
    }));
  };

  // Helper to add reagent
  const addReagent = () => {
    setFormData(prev => ({
      ...prev,
      reagentsAndMaterials: [...(prev.reagentsAndMaterials || []), { name: '', grade: 'AR', hazardClass: '', storageCondition: '' }]
    }));
  };

  const removeReagent = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      reagentsAndMaterials: prev.reagentsAndMaterials.filter((_, i) => i !== idx)
    }));
  };

  // Helper to add step
  const addStep = () => {
    const nextNum = (formData.procedureSteps?.length || 0) + 1;
    setFormData(prev => ({
      ...prev,
      procedureSteps: [...(prev.procedureSteps || []), { stepNumber: nextNum, title: `مرحله ${nextNum}`, description: '' }]
    }));
  };

  const removeStep = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      procedureSteps: prev.procedureSteps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepNumber: i + 1 }))
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        id="experiment-form-modal"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/40">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {initialData ? 'ویرایش پروتکل آزمایش' : 'ثبت پروتکل آزمایشگاهی جدید'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Errors Notice */}
        {validationErrors.length > 0 && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-800 dark:text-rose-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>لطفاً خطاهای زیر را برطرف نمایید:</span>
            </div>
            {validationErrors.map((err, i) => (
              <div key={i} className="pr-4">• {err.message}</div>
            ))}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-950/20 overflow-x-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'basic' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-stone-500'
            }`}
          >
            اطلاعات پایه
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'materials' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-stone-500'
            }`}
          >
            تجهیزات و معرف‌ها
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'steps' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-stone-500'
            }`}
          >
            مراحل آزمایش
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calc')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'calc' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-stone-500'
            }`}
          >
            فرمول و گزارش
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('standard')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'standard' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-stone-500'
            }`}
          >
            استاندارد و استناد
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* TAB 1: BASIC */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    عنوان فارسی آزمایش *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleFa}
                    onChange={e => setFormData({ ...formData, titleFa: e.target.value })}
                    placeholder="مثال: تعیین عدد اسیدی روغن‌های خوراکی"
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    کد پروتکل *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    placeholder="EXP-CHM-001"
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    عنوان انگلیسی (Title En)
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn || ''}
                    onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Determination of Acid Value..."
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl dir-ltr text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    حوزه تخصصی صنایع غذایی (۱۵ حوزه) *
                  </label>
                  <select
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value as ExperimentDomain })}
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    {Object.entries(EXPERIMENT_DOMAINS).map(([k, v]) => (
                      <option key={k} value={k}>{v.titleFa}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  هدف آزمایش (Objective) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.objective}
                  onChange={e => setFormData({ ...formData, objective: e.target.value })}
                  placeholder="شرح هدف آزمون و علت انجام آن..."
                  className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  اصل روش علمی / واکنش شیمیایی (Principle) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.principle}
                  onChange={e => setFormData({ ...formData, principle: e.target.value })}
                  placeholder="تشریح دقیق مکانیزم شیمیایی، بیوشیمیایی یا فیزیکی روش..."
                  className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          )}

          {/* TAB 2: MATERIALS */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              {/* Equipment */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-700 dark:text-stone-300">تجهیزات و وسایل شیشه‌ای</span>
                  <button
                    type="button"
                    onClick={addEquipment}
                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> افزودن دستگاه
                  </button>
                </div>
                {formData.equipment?.map((eq, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="نام وسیله (مثال: بورت ۲۵ میلی‌لیتر)"
                      value={eq.name}
                      onChange={e => {
                        const copy = [...(formData.equipment || [])];
                        copy[i].name = e.target.value;
                        setFormData({ ...formData, equipment: copy });
                      }}
                      className="flex-1 p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="مشخصات و کالیبراسیون"
                      value={eq.specification || ''}
                      onChange={e => {
                        const copy = [...(formData.equipment || [])];
                        copy[i].specification = e.target.value;
                        setFormData({ ...formData, equipment: copy });
                      }}
                      className="flex-1 p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeEquipment(i)}
                      className="text-rose-500 hover:text-rose-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Reagents */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-700 dark:text-stone-300">مواد شیمیایی و معرف‌ها</span>
                  <button
                    type="button"
                    onClick={addReagent}
                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> افزودن معرف
                  </button>
                </div>
                {formData.reagentsAndMaterials?.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="نام ماده (مثال: KOH 0.1M)"
                      value={r.name}
                      onChange={e => {
                        const copy = [...(formData.reagentsAndMaterials || [])];
                        copy[i].name = e.target.value;
                        setFormData({ ...formData, reagentsAndMaterials: copy });
                      }}
                      className="flex-1 p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="گرید خلوص (AR / HPLC)"
                      value={r.grade || ''}
                      onChange={e => {
                        const copy = [...(formData.reagentsAndMaterials || [])];
                        copy[i].grade = e.target.value;
                        setFormData({ ...formData, reagentsAndMaterials: copy });
                      }}
                      className="w-28 p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeReagent(i)}
                      className="text-rose-500 hover:text-rose-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STEPS */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-stone-700 dark:text-stone-300">مراحل انجام آزمایش</span>
                <button
                  type="button"
                  onClick={addStep}
                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> افزودن مرحله
                </button>
              </div>
              {formData.procedureSteps?.map((step, i) => (
                <div key={i} className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">گام {step.stepNumber}</span>
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="عنوان مرحله"
                    value={step.title}
                    onChange={e => {
                      const copy = [...(formData.procedureSteps || [])];
                      copy[i].title = e.target.value;
                      setFormData({ ...formData, procedureSteps: copy });
                    }}
                    className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-bold"
                  />
                  <textarea
                    rows={2}
                    placeholder="شرح دقیق دستورالعمل این مرحله..."
                    value={step.description}
                    onChange={e => {
                      const copy = [...(formData.procedureSteps || [])];
                      copy[i].description = e.target.value;
                      setFormData({ ...formData, procedureSteps: copy });
                    }}
                    className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CALC */}
          {activeTab === 'calc' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  فرمول ریاضی محاسبه نتیجه
                </label>
                <input
                  type="text"
                  placeholder="مثال: AV = (56.1 * V * c) / m"
                  value={formData.calculations?.formulaExpression || ''}
                  onChange={e => setFormData({
                    ...formData,
                    calculations: { ...formData.calculations, formulaExpression: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono dir-ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    واحد گزارش نتیجه
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: mg KOH/g یا %"
                    value={formData.reporting?.unitOfMeasurement || ''}
                    onChange={e => setFormData({
                      ...formData,
                      reporting: { ...formData.reporting, unitOfMeasurement: e.target.value }
                    })}
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    دقت اعشار
                  </label>
                  <input
                    type="number"
                    value={formData.reporting?.decimalPrecision ?? 2}
                    onChange={e => setFormData({
                      ...formData,
                      reporting: { ...formData.reporting, decimalPrecision: parseInt(e.target.value) || 2 }
                    })}
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STANDARD & SOURCE */}
          {activeTab === 'standard' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-start gap-2 text-amber-800 dark:text-amber-300 text-xs">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  قانون طلایی: هیچ روشی بدون شماره استاندارد رسمی یا منبع معتبر نمی‌تواند به عنوان «تاییدشده (Verified)» ثبت شود.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    سازمان تدوین‌کننده استاندارد *
                  </label>
                  <select
                    value={formData.standardReference?.organization || 'INSO'}
                    onChange={e => setFormData({
                      ...formData,
                      standardReference: {
                        ...formData.standardReference,
                        organization: e.target.value as any,
                        jurisdiction: e.target.value === 'INSO' ? 'iranian_national' : 'international_foreign'
                      }
                    })}
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
                  >
                    <option value="INSO">استاندارد ملی ایران (INSO)</option>
                    <option value="ISO">سازمان بین‌المللی ایزو (ISO)</option>
                    <option value="AOAC">روش‌های رسمی AOAC</option>
                    <option value="ASTM">استانداردهای ASTM</option>
                    <option value="Codex">کدکس غذایی (Codex)</option>
                    <option value="IDF">فدراسیون بین‌المللی لبنیات (IDF)</option>
                    <option value="AOCS">انجمن شیمیدان‌های روغن (AOCS)</option>
                    <option value="Other">سایر مراجع معتبر</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    شماره استاندارد مرجع *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: INSO 4179 یا ISO 660"
                    value={formData.standardReference?.standardNumber || ''}
                    onChange={e => setFormData({
                      ...formData,
                      standardReference: { ...formData.standardReference, standardNumber: e.target.value }
                    })}
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  سطح اعتبارسنجی (Verification Status)
                </label>
                <select
                  value={formData.verificationStatus}
                  onChange={e => setFormData({
                    ...formData,
                    verificationStatus: e.target.value as ExperimentVerificationStatus,
                    isVerifiedProtocol: e.target.value === 'verified_standard'
                  })}
                  className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
                >
                  <option value="verified_standard">تاییدشده بر اساس استاندارد رسمی (Grade A)</option>
                  <option value="peer_reviewed">مقاله داوری‌شده معتبر (Grade B)</option>
                  <option value="academic_textbook">کتاب مرجع دانشگاهی (Grade C)</option>
                  <option value="unverified_pending_review">پیش‌نویس در حال بررسی (Grade D)</option>
                </select>
              </div>
            </div>
          )}

          {/* Footer Submit Button inside form */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره پروتکل'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
