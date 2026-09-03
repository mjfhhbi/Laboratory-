/**
 * Chemical Reagent Add / Edit Modal
 * Food Science AI Lab Suite - Part 13
 */

import React, { useState } from 'react';
import {
  ChemicalReagent,
  ChemicalFamily,
  ReagentGrade,
  PhysicalState,
  GhsPictogramCode,
  GHS_PICTOGRAM_META,
  CHEMICAL_FAMILY_META,
  REAGENT_GRADE_META
} from '../../types/chemicalReagent';
import { GhsBadge } from './GhsBadge';
import {
  X,
  Save,
  AlertTriangle,
  Beaker,
  ShieldCheck,
  Plus,
  Trash2,
  Info
} from 'lucide-react';

interface ReagentFormModalProps {
  reagent?: ChemicalReagent | null;
  onClose: () => void;
  onSave: (data: Partial<ChemicalReagent>) => void;
}

export const ReagentFormModal: React.FC<ReagentFormModalProps> = ({
  reagent,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<ChemicalReagent>>({
    name: reagent?.name || '',
    englishName: reagent?.englishName || '',
    scientificName: reagent?.scientificName || '',
    chemicalFormula: reagent?.chemicalFormula || '',
    casNumber: reagent?.casNumber || '',
    casSource: reagent?.casSource || '',
    family: reagent?.family || 'salt',
    molecularWeight: reagent?.molecularWeight || 0,
    density: reagent?.density || undefined,
    valenceOrEquivalents: reagent?.valenceOrEquivalents || 1,
    grade: reagent?.grade || 'analytical',
    purityPercentage: reagent?.purityPercentage || 99.0,
    physicalState: reagent?.physicalState || 'solid',
    lotNumber: reagent?.lotNumber || '',
    preparationDate: reagent?.preparationDate || new Date().toISOString().split('T')[0],
    expiryDate: reagent?.expiryDate || '',
    storageConditions: {
      temperature: reagent?.storageConditions?.temperature || '15-25°C',
      lightSensitive: reagent?.storageConditions?.lightSensitive || false,
      hygroscopic: reagent?.storageConditions?.hygroscopic || false,
      flammableCabinetRequired: reagent?.storageConditions?.flammableCabinetRequired || false,
      desiccatorRequired: reagent?.storageConditions?.desiccatorRequired || false,
      specialNotes: reagent?.storageConditions?.specialNotes || ''
    },
    hazards: {
      ghsPictograms: reagent?.hazards?.ghsPictograms || [],
      signalWord: reagent?.hazards?.signalWord || 'Warning',
      hazardStatements: reagent?.hazards?.hazardStatements || [],
      precautionaryStatements: reagent?.hazards?.precautionaryStatements || [],
      isVerifiedHazard: reagent?.hazards?.isVerifiedHazard ?? true
    },
    safetyNotes: {
      ppeRequired: reagent?.safetyNotes?.ppeRequired || ['دستکش آزمایشگاهی', 'عینک محافظ', 'روپوش'],
      firstAid: {
        eyeContact: reagent?.safetyNotes?.firstAid?.eyeContact || 'شستشو با آب فراوان حداقل ۱۵ دقیقه.',
        skinContact: reagent?.safetyNotes?.firstAid?.skinContact || 'شستشو با آب و صابون.',
        inhalation: reagent?.safetyNotes?.firstAid?.inhalation || 'انتقال به هوای آزاد.',
        ingestion: reagent?.safetyNotes?.firstAid?.ingestion || 'شستشوی دهان و مراجعه به پزشک.'
      },
      handlingPrecautions: reagent?.safetyNotes?.handlingPrecautions || ['استفاده از هود و تجهیزات محافظ'],
      spillResponse: reagent?.safetyNotes?.spillResponse || 'مهار با پد جاذب یا خنثی‌سازی استاندارد',
      incompatibleWith: reagent?.safetyNotes?.incompatibleWith || []
    },
    sdsReference: {
      publisherOrSource: reagent?.sdsReference?.publisherOrSource || '',
      sdsCodeOrNumber: reagent?.sdsReference?.sdsCodeOrNumber || '',
      revisionDate: reagent?.sdsReference?.revisionDate || new Date().toISOString().split('T')[0],
      verified: reagent?.sdsReference?.verified ?? true,
      safetyDisclaimer: reagent?.sdsReference?.safetyDisclaimer || ''
    },
    stockQuantity: {
      amount: reagent?.stockQuantity?.amount || 500,
      unit: reagent?.stockQuantity?.unit || 'g',
      location: reagent?.stockQuantity?.location || 'انبار مواد شیمیایی',
      minAlertLevel: reagent?.stockQuantity?.minAlertLevel || 100
    },
    associatedExperiments: reagent?.associatedExperiments || []
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // New experiment form input
  const [newExpName, setNewExpName] = useState('');
  const [newExpCode, setNewExpCode] = useState('');
  const [newExpRole, setNewExpRole] = useState('');

  const handleToggleGhs = (code: GhsPictogramCode) => {
    const current = formData.hazards?.ghsPictograms || [];
    const updated = current.includes(code)
      ? current.filter(c => c !== code)
      : [...current, code];

    setFormData(prev => ({
      ...prev,
      hazards: {
        ...prev.hazards!,
        ghsPictograms: updated
      }
    }));
  };

  const handleAddExperiment = () => {
    if (!newExpName.trim() || !newExpRole.trim()) return;
    setFormData(prev => ({
      ...prev,
      associatedExperiments: [
        ...(prev.associatedExperiments || []),
        {
          experimentName: newExpName.trim(),
          standardCode: newExpCode.trim() || undefined,
          role: 'titrant',
          rolePersian: newExpRole.trim()
        }
      ]
    }));
    setNewExpName('');
    setNewExpCode('');
    setNewExpRole('');
  };

  const handleRemoveExperiment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      associatedExperiments: (prev.associatedExperiments || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Enforce safety integrity rules
    if (!formData.name?.trim()) {
      setValidationError('نام ماده شیمیایی الزامی است.');
      return;
    }
    if (!formData.chemicalFormula?.trim()) {
      setValidationError('فرمول شیمیایی الزامی است.');
      return;
    }
    if (!formData.molecularWeight || formData.molecularWeight <= 0) {
      setValidationError('وزن مولکولی معتبر وارد نمایید.');
      return;
    }
    if (!formData.casSource?.trim()) {
      setValidationError('قانون ایمنی: جهت اعتبارسنجی ماده، ذکر مرجع/Source شماره CAS یا برگه SDS الزامی است.');
      return;
    }
    if (!formData.sdsReference?.publisherOrSource?.trim()) {
      setValidationError('قانون ایمنی: ناشر یا منبع برگه اطلاعات ایمنی (SDS Publisher/Source) باید مشخص باشد.');
      return;
    }

    setValidationError(null);
    onSave(formData);
  };

  const allGhsCodes: GhsPictogramCode[] = ['GHS01', 'GHS02', 'GHS03', 'GHS04', 'GHS05', 'GHS06', 'GHS07', 'GHS08', 'GHS09'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Beaker className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
              {reagent ? 'ویرایش اطلاعات ماده شیمیایی' : 'ثبت ماده شیمیایی جدید در بانک معرف‌ها'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
          <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
          <span>الزام ایمنی: اطلاعات خطر و ایمنی را حدس نزنید. درج مرجع معتبر برای شماره CAS و منبع SDS الزامی است.</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2">
              <span>۱. مشخصات هویتی و نام‌گذاری ماده</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  نام تجاری / فارسی ماده <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سدیم هیدروکسید (سود سوزآور)"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  نام انگلیسی (English Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sodium Hydroxide"
                  value={formData.englishName || ''}
                  onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  نام علمی IUPAC
                </label>
                <input
                  type="text"
                  placeholder="مثال: Sodium Hydroxide"
                  value={formData.scientificName || ''}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  فرمول شیمیایی <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: NaOH یا H2SO4"
                  value={formData.chemicalFormula || ''}
                  onChange={(e) => setFormData({ ...formData, chemicalFormula: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  دسته شیمیایی (Family)
                </label>
                <select
                  value={formData.family || 'salt'}
                  onChange={(e) => setFormData({ ...formData, family: e.target.value as ChemicalFamily })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.entries(CHEMICAL_FAMILY_META).map(([key, meta]) => (
                    <option key={key} value={key}>{meta.nameFa} ({meta.nameEn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  درجه خلوص و گرید (Grade)
                </label>
                <select
                  value={formData.grade || 'analytical'}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value as ReagentGrade })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.entries(REAGENT_GRADE_META).map(([key, meta]) => (
                    <option key={key} value={key}>{meta.nameFa} ({meta.nameEn})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Physicochemical Constants */}
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2">
              <span>۲. ثابت‌های فیزیکوشیمیایی و محاسباتی</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  وزن مولکولی (g/mol) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="39.997"
                  value={formData.molecularWeight || ''}
                  onChange={(e) => setFormData({ ...formData, molecularWeight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  درصد خلوص (Purity %)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="100"
                  placeholder="99.0"
                  value={formData.purityPercentage || ''}
                  onChange={(e) => setFormData({ ...formData, purityPercentage: parseFloat(e.target.value) || 100 })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  دانسیته (g/mL برای مایعات)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="مثال: 1.19"
                  value={formData.density || ''}
                  onChange={(e) => setFormData({ ...formData, density: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  ظرفیت واکنشی (Valence n)
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  placeholder="1"
                  value={formData.valenceOrEquivalents || 1}
                  onChange={(e) => setFormData({ ...formData, valenceOrEquivalents: parseInt(e.target.value, 10) || 1 })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Section 3: CAS and SDS Verification Rule */}
          <div className="space-y-4 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>۳. رفرنس‌دهی و اعتبارسنجی CAS / SDS (الزام مستندسازی)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  شماره رجیستری CAS
                </label>
                <input
                  type="text"
                  placeholder="مثال: 1310-73-2"
                  value={formData.casNumber || ''}
                  onChange={(e) => setFormData({ ...formData, casNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  مرجع استعلام CAS <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Merck Index / PubChem CID 14798"
                  value={formData.casSource || ''}
                  onChange={(e) => setFormData({ ...formData, casSource: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  ناشر برگه SDS <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Merck KGaA / Sigma-Aldrich"
                  value={formData.sdsReference?.publisherOrSource || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    sdsReference: { ...formData.sdsReference!, publisherOrSource: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  شناسه یا شماره برگه SDS
                </label>
                <input
                  type="text"
                  placeholder="مثال: 1.06498.1000"
                  value={formData.sdsReference?.sdsCodeOrNumber || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    sdsReference: { ...formData.sdsReference!, sdsCodeOrNumber: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Section 4: GHS Hazard Pictograms Selection */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>۴. انتخاب پیکتوگرام‌های خطر GHS</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allGhsCodes.map((code) => {
                const meta = GHS_PICTOGRAM_META[code];
                const isSelected = formData.hazards?.ghsPictograms?.includes(code);
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleToggleGhs(code)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-right transition-all ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-700 ring-2 ring-rose-500/30'
                        : 'bg-white dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <GhsBadge code={code} size="sm" />
                    <div className="text-[11px] leading-tight">
                      <div className="font-bold text-stone-900 dark:text-stone-100">{meta.nameFa}</div>
                      <div className="text-[9px] text-stone-500 font-mono">{code}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Associated Experiments */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2">
              <span>۵. آزمون‌های آزمایشگاهی متصل به این ماده</span>
            </h4>

            {formData.associatedExperiments && formData.associatedExperiments.length > 0 && (
              <div className="space-y-2">
                {formData.associatedExperiments.map((exp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100">{exp.experimentName}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 mr-2">[{exp.rolePersian}]</span>
                      {exp.standardCode && <span className="text-stone-500 mr-2 font-mono" dir="ltr">({exp.standardCode})</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperiment(idx)}
                      className="p-1 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="نام آزمون (مثال: سنجش اسیدیته کل شیر)"
                value={newExpName}
                onChange={(e) => setNewExpName(e.target.value)}
                className="flex-1 min-w-[180px] px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
              />
              <input
                type="text"
                placeholder="کد استاندارد (INSO 2852)"
                value={newExpCode}
                onChange={(e) => setNewExpCode(e.target.value)}
                className="w-32 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-mono"
                dir="ltr"
              />
              <input
                type="text"
                placeholder="نقش در آزمون (تیترانت استاندارد)"
                value={newExpRole}
                onChange={(e) => setNewExpRole(e.target.value)}
                className="w-40 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
              />
              <button
                type="button"
                onClick={handleAddExperiment}
                className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs flex items-center gap-1 hover:bg-stone-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs transition-colors"
            >
              انصراف
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره در بانک مواد شیمیایی</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
