import React, { useState, useEffect } from 'react';
import {
  FoodStandard,
  FoodStandardSector,
  FOOD_STANDARD_SECTORS,
  StandardJurisdiction,
  StandardLifecycleStatus,
  AcceptableLimitSpecification
} from '../../types/foodStandard';
import { ScientificSource, SourceCitation, VerificationStatus } from '../../types/knowledgeBase';
import { getAllSources } from '../../lib/storage/knowledgeBase';
import { saveStandard, createStandard, validateStandardData } from '../../lib/storage/standardsStorage';
import { StandardMathFormula } from './StandardMathFormula';
import {
  X,
  Plus,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Building,
  Calendar,
  Layers,
  Wrench,
  FlaskConical,
  BookOpen,
  Calculator,
  ListOrdered,
  Sliders,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Globe,
  Tag
} from 'lucide-react';

interface FoodStandardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FoodStandard | null;
  defaultJurisdiction?: StandardJurisdiction;
  onSaved: (std: FoodStandard) => void;
  onOpenCreateSource?: () => void;
}

export const FoodStandardFormModal: React.FC<FoodStandardFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  defaultJurisdiction = 'iranian_national',
  onSaved,
  onOpenCreateSource
}) => {
  const [jurisdiction, setJurisdiction] = useState<StandardJurisdiction>(defaultJurisdiction);
  const [country, setCountry] = useState('ایران');
  const [issuingOrganization, setIssuingOrganization] = useState('سازمان ملی استاندارد ایران (INSO)');
  const [standardNumber, setStandardNumber] = useState('');
  const [titleFa, setTitleFa] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [revisionAndYear, setRevisionAndYear] = useState('');
  const [lifecycleStatus, setLifecycleStatus] = useState<StandardLifecycleStatus>('active');
  const [sector, setSector] = useState<FoodStandardSector>('dairy');

  // Technical sections
  const [scopeOfApplication, setScopeOfApplication] = useState('');
  const [testMethod, setTestMethod] = useState('');
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);
  const [equipInput, setEquipInput] = useState('');
  const [reagentsAndChemicals, setReagentsAndChemicals] = useState<string[]>([]);
  const [reagentInput, setReagentInput] = useState('');
  const [testConditions, setTestConditions] = useState('');
  const [testProcedure, setTestProcedure] = useState('');
  const [calculationsAndFormulas, setCalculationsAndFormulas] = useState('');
  const [acceptableLimits, setAcceptableLimits] = useState<AcceptableLimitSpecification[]>([]);
  const [errorsAndSafetyWarnings, setErrorsAndSafetyWarnings] = useState('');

  // Sources & Verification
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('unverified_pending_review');
  const [sources, setSources] = useState<SourceCitation[]>([]);
  const [availableSources, setAvailableSources] = useState<ScientificSource[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [citationSection, setCitationSection] = useState('');
  const [citationPage, setCitationPage] = useState('');

  // Tags & Tabs
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'scope_method' | 'equipment_reagents' | 'procedure_calc' | 'limits' | 'warnings_source'>('info');
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load available scientific sources from db
  useEffect(() => {
    async function fetchSources() {
      try {
        const list = await getAllSources();
        setAvailableSources(list);
      } catch (err) {
        console.error('Failed to load sources:', err);
      }
    }
    fetchSources();
  }, [isOpen]);

  // Sync initial data when modal opens
  useEffect(() => {
    if (initialData) {
      setJurisdiction(initialData.jurisdiction);
      setCountry(initialData.country || 'ایران');
      setIssuingOrganization(initialData.issuingOrganization || '');
      setStandardNumber(initialData.standardNumber || '');
      setTitleFa(initialData.titleFa || '');
      setTitleEn(initialData.titleEn || '');
      setRevisionAndYear(initialData.revisionAndYear || '');
      setLifecycleStatus(initialData.lifecycleStatus || 'active');
      setSector(initialData.sector || 'dairy');
      setScopeOfApplication(initialData.scopeOfApplication || '');
      setTestMethod(initialData.testMethod || '');
      setRequiredEquipment(initialData.requiredEquipment || []);
      setReagentsAndChemicals(initialData.reagentsAndChemicals || []);
      setTestConditions(initialData.testConditions || '');
      setTestProcedure(initialData.testProcedure || '');
      setCalculationsAndFormulas(initialData.calculationsAndFormulas || '');
      setAcceptableLimits(initialData.acceptableLimits || []);
      setErrorsAndSafetyWarnings(initialData.errorsAndSafetyWarnings || '');
      setVerificationStatus(initialData.verificationStatus || 'unverified_pending_review');
      setSources(initialData.sources || []);
      setTags(initialData.tags || []);
    } else {
      // Default new standard template
      setJurisdiction(defaultJurisdiction);
      if (defaultJurisdiction === 'iranian_national') {
        setCountry('ایران');
        setIssuingOrganization('سازمان ملی استاندارد ایران (INSO)');
        setStandardNumber('');
        setRevisionAndYear('');
      } else {
        setCountry('بین‌المللی');
        setIssuingOrganization('کمیسیون کدکس غذایی (Codex Alimentarius)');
        setStandardNumber('');
        setRevisionAndYear('');
      }
      setTitleFa('');
      setTitleEn('');
      setLifecycleStatus('active');
      setSector('dairy');
      setScopeOfApplication('');
      setTestMethod('');
      setRequiredEquipment([]);
      setReagentsAndChemicals([]);
      setTestConditions('');
      setTestProcedure('');
      setCalculationsAndFormulas('');
      setAcceptableLimits([]);
      setErrorsAndSafetyWarnings('');
      setVerificationStatus('unverified_pending_review');
      setSources([]);
      setTags([]);
    }
    setFormErrors([]);
    setActiveTab('info');
  }, [initialData, defaultJurisdiction, isOpen]);

  // Handle switching jurisdiction
  const handleJurisdictionChange = (newJur: StandardJurisdiction) => {
    setJurisdiction(newJur);
    if (newJur === 'iranian_national') {
      setCountry('ایران');
      setIssuingOrganization('سازمان ملی استاندارد ایران (INSO)');
    } else {
      if (country === 'ایران') setCountry('بین‌المللی');
      if (issuingOrganization.includes('INSO')) {
        setIssuingOrganization('کمیسیون کدکس غذایی (Codex Alimentarius)');
      }
    }
  };

  // Add Equipment chip
  const handleAddEquipment = () => {
    if (equipInput.trim() && !requiredEquipment.includes(equipInput.trim())) {
      setRequiredEquipment([...requiredEquipment, equipInput.trim()]);
      setEquipInput('');
    }
  };

  // Add Reagent chip
  const handleAddReagent = () => {
    if (reagentInput.trim() && !reagentsAndChemicals.includes(reagentInput.trim())) {
      setReagentsAndChemicals([...reagentsAndChemicals, reagentInput.trim()]);
      setReagentInput('');
    }
  };

  // Add Acceptable Limit Row
  const handleAddLimitRow = () => {
    const newLimit: AcceptableLimitSpecification = {
      id: 'lim_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      parameterNameFa: '',
      parameterNameEn: '',
      limitSpecification: '',
      unit: '',
      tolerance: '',
      testMethodRef: '',
      notes: ''
    };
    setAcceptableLimits([...acceptableLimits, newLimit]);
  };

  const handleUpdateLimitRow = (index: number, field: keyof AcceptableLimitSpecification, val: string) => {
    const updated = [...acceptableLimits];
    updated[index] = { ...updated[index], [field]: val };
    setAcceptableLimits(updated);
  };

  const handleRemoveLimitRow = (index: number) => {
    setAcceptableLimits(acceptableLimits.filter((_, i) => i !== index));
  };

  // Add Source Citation
  const handleAddCitation = () => {
    if (!selectedSourceId) return;
    const found = availableSources.find((s) => s.id === selectedSourceId);
    if (!found) return;

    // Check duplicate
    if (sources.some((s) => s.sourceId === selectedSourceId)) {
      alert('این منبع قبلاً اضافه شده است.');
      return;
    }

    const citation: SourceCitation = {
      sourceId: found.id,
      sourceTitle: found.title,
      codeOrIdentifier: found.codeOrIdentifier,
      sectionOrChapter: citationSection.trim() || undefined,
      pageNumber: citationPage.trim() || undefined,
      verifiedByExpert: true
    };

    setSources([...sources, citation]);
    setSelectedSourceId('');
    setCitationSection('');
    setCitationPage('');

    // If source added, auto promote status to verified if requested
    if (verificationStatus === 'unverified_pending_review') {
      setVerificationStatus(found.publicationType === 'official_standard_body' ? 'official_regulatory' : 'verified_with_source');
    }
  };

  const handleRemoveCitation = (sourceId: string) => {
    const updated = sources.filter((s) => s.sourceId !== sourceId);
    setSources(updated);
    if (updated.length === 0 && (verificationStatus === 'official_regulatory' || verificationStatus === 'verified_with_source')) {
      setVerificationStatus('unverified_pending_review');
    }
  };

  // Add Tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Submit & Validate
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setIsSubmitting(true);

    const standardPayload: Partial<FoodStandard> = {
      jurisdiction,
      country: country.trim(),
      issuingOrganization: issuingOrganization.trim(),
      standardNumber: standardNumber.trim(),
      titleFa: titleFa.trim(),
      titleEn: titleEn.trim() || undefined,
      revisionAndYear: revisionAndYear.trim(),
      lifecycleStatus,
      sector,
      scopeOfApplication: scopeOfApplication.trim(),
      testMethod: testMethod.trim(),
      requiredEquipment,
      reagentsAndChemicals,
      testConditions: testConditions.trim(),
      testProcedure: testProcedure.trim(),
      calculationsAndFormulas: calculationsAndFormulas.trim(),
      acceptableLimits,
      errorsAndSafetyWarnings: errorsAndSafetyWarnings.trim(),
      verificationStatus,
      sources,
      tags,
      offlineAvailable: true
    };

    // Run Domain Validation
    const validation = validateStandardData(standardPayload);

    if (!validation.isValid) {
      setFormErrors(validation.errors.map((err) => err.message));
      setIsSubmitting(false);
      return;
    }

    try {
      let saved: FoodStandard;
      if (initialData) {
        saved = await saveStandard({
          ...initialData,
          ...(standardPayload as FoodStandard)
        });
      } else {
        saved = await createStandard(standardPayload as any);
      }
      onSaved(saved);
      onClose();
    } catch (err: any) {
      setFormErrors([err.message || 'خطا در ذخیره استاندارد.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 bg-stone-50/70 dark:bg-stone-800/30">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <span>{initialData ? 'ویرایش استاندارد صنایع غذایی' : 'ثبت استاندارد جدید در پایگاه دانش'}</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              مدیریت ساختاریافته استانداردهای ملی ایران و مراجع بین‌المللی با اعتبارسنجی منبع
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto p-2 border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-800/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-3 py-2 rounded-xl shrink-0 transition-colors ${
              activeTab === 'info'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            ۱. مشخصات و مرجع
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scope_method')}
            className={`px-3 py-2 rounded-xl shrink-0 transition-colors ${
              activeTab === 'scope_method'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            ۲. دامنه و روش آزمون
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('equipment_reagents')}
            className={`px-3 py-2 rounded-xl shrink-0 transition-colors ${
              activeTab === 'equipment_reagents'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            ۳. تجهیزات و معرف‌ها
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('procedure_calc')}
            className={`px-3 py-2 rounded-xl shrink-0 transition-colors ${
              activeTab === 'procedure_calc'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            ۴. مراحل و فرمول‌ها
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('limits')}
            className={`px-3 py-2 rounded-xl shrink-0 transition-colors ${
              activeTab === 'limits'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            ۵. جدول حدود قابل قبول ({acceptableLimits.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('warnings_source')}
            className={`px-3 py-2 rounded-xl shrink-0 transition-colors ${
              activeTab === 'warnings_source'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            ۶. خطاها و منبع علمی
          </button>
        </div>

        {/* Form Error Banners */}
        {formErrors.length > 0 && (
          <div className="bg-rose-50 dark:bg-rose-950/80 border-b border-rose-200 dark:border-rose-900 p-4 space-y-1 text-xs text-rose-900 dark:text-rose-200">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>لطفاً خطاهای زیر را برطرف نمایید:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] pr-2">
              {formErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* TAB 1: General Info & Jurisdiction */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Jurisdiction Selector: STRICT IRAN VS INTERNATIONAL SEPARATION */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-3">
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                  تفکیک حوزه و مرجع حاکمیتی استاندارد:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleJurisdictionChange('iranian_national')}
                    className={`p-3.5 rounded-xl border text-right transition-all flex items-start gap-3 ${
                      jurisdiction === 'iranian_national'
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-xl">🇮🇷</span>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        استاندارد ملی ایران (INSO / ISIRI)
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        الزام به ورود شماره استاندارد ملی و شماره ویرایش / سال
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleJurisdictionChange('international_foreign')}
                    className={`p-3.5 rounded-xl border text-right transition-all flex items-start gap-3 ${
                      jurisdiction === 'international_foreign'
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <Globe className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        استانداردهای بین‌المللی و خارجی
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        کدکس غذایی، ایزو، سازمان غذا و داروی آمریکا (FDA)، EFSA و...
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Standard Number & Revision */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    شماره / کد استاندارد {jurisdiction === 'iranian_national' && <span className="text-rose-500">* (الزامی برای ایران)</span>}
                  </label>
                  <input
                    type="text"
                    value={standardNumber}
                    onChange={(e) => setStandardNumber(e.target.value)}
                    placeholder={jurisdiction === 'iranian_national' ? 'مثال: INSO 2406 یا استاندارد ملی ۱۶۲۹' : 'مثال: Codex Stan 87-1981 یا ISO 22000:2018'}
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    ویرایش / سال تجدیدنظر {jurisdiction === 'iranian_national' && <span className="text-rose-500">* (الزامی برای ایران)</span>}
                  </label>
                  <input
                    type="text"
                    value={revisionAndYear}
                    onChange={(e) => setRevisionAndYear(e.target.value)}
                    placeholder="مثال: تجدیدنظر دوم - ۱۳۹۸ یا 2022 Revision"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Titles Fa & En */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    عنوان رسمی استاندارد (فارسی) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={titleFa}
                    onChange={(e) => setTitleFa(e.target.value)}
                    placeholder="مثال: شیر و فرآورده‌های آن - شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 font-semibold focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    عنوان لاتین (English Title)
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Milk and milk products - Pasteurized milk - Specifications and test methods"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Organization, Country, Sector, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    سازمان صادرکننده
                  </label>
                  <input
                    type="text"
                    value={issuingOrganization}
                    onChange={(e) => setIssuingOrganization(e.target.value)}
                    placeholder="مثال: سازمان ملی استاندارد ایران (INSO)"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    کشور مرجع
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="مثال: ایران، بین‌المللی، آمریکا"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    حوزه صنایع غذایی
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as FoodStandardSector)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                  >
                    {Object.values(FOOD_STANDARD_SECTORS).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.titleFa}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    وضعیت اعتبار
                  </label>
                  <select
                    value={lifecycleStatus}
                    onChange={(e) => setLifecycleStatus(e.target.value as StandardLifecycleStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 font-semibold"
                  >
                    <option value="active">معتبر و جاری</option>
                    <option value="under_revision">در حال بازنگری</option>
                    <option value="withdrawn">ابطال‌شده</option>
                    <option value="draft">پیش‌نویس</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Scope of Application & Test Method */}
          {activeTab === 'scope_method' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  دامنه کاربرد و هدف استاندارد (Scope of Application)
                </label>
                <textarea
                  value={scopeOfApplication}
                  onChange={(e) => setScopeOfApplication(e.target.value)}
                  rows={4}
                  placeholder="این استاندارد دربرگیرنده ویژگی‌ها، حدود مجاز، بسته‌بندی، نشانه‌گذاری و روش‌های آزمون..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  روش آزمون مرجع (Reference Test Method)
                </label>
                <textarea
                  value={testMethod}
                  onChange={(e) => setTestMethod(e.target.value)}
                  rows={4}
                  placeholder="شرح روش آزمون (تیتراسیون، گازکروماتوگرافی، اسپکتروفتومتری، کشت پلیت و...)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  شرایط محیطی و الزامات آزمون (Test Conditions)
                </label>
                <textarea
                  value={testConditions}
                  onChange={(e) => setTestConditions(e.target.value)}
                  rows={3}
                  placeholder="دما (مثلاً ۲۰±۲ درجه سلسیوس)، رطوبت نسبی، کالیبراسیون و رواداری محیطی..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Equipment & Reagents */}
          {activeTab === 'equipment_reagents' && (
            <div className="space-y-5">
              {/* Equipment */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-3">
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                  تجهیزات و دستگاه‌های موردنیاز (Required Equipment)
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={equipInput}
                    onChange={(e) => setEquipInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEquipment();
                      }
                    }}
                    placeholder="نام دستگاه (مثلاً: ترازوی تحلیلی با دقت ۰.۰۰۰۱ گرم، انکوباتور ۳۷ درجه)..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddEquipment}
                    className="px-3.5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن دستگاه</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {requiredEquipment.map((eq, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200 text-xs flex items-center gap-1.5"
                    >
                      <span>{eq}</span>
                      <button
                        type="button"
                        onClick={() => setRequiredEquipment(requiredEquipment.filter((_, i) => i !== idx))}
                        className="text-cyan-600 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {requiredEquipment.length === 0 && (
                    <span className="text-[11px] text-stone-400">تجهیزاتی اضافه نشده است.</span>
                  )}
                </div>
              </div>

              {/* Reagents */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-3">
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                  مواد، معرف‌ها و محلول‌های شیمیایی (Reagents & Chemicals)
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={reagentInput}
                    onChange={(e) => setReagentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddReagent();
                      }
                    }}
                    placeholder="نام معرف یا محلول استاندارد (مثلاً: محلول هیدروکسید سدیم ۰.۱ نرمال، فنل‌فتالئین)..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddReagent}
                    className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن معرف</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {reagentsAndChemicals.map((rg, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-1.5"
                    >
                      <span>{rg}</span>
                      <button
                        type="button"
                        onClick={() => setReagentsAndChemicals(reagentsAndChemicals.filter((_, i) => i !== idx))}
                        className="text-amber-600 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {reagentsAndChemicals.length === 0 && (
                    <span className="text-[11px] text-stone-400">معرفی اضافه نشده است.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Test Procedure & Calculations */}
          {activeTab === 'procedure_calc' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  مراحل اجرای آزمون (Test Procedure / Protocol)
                </label>
                <textarea
                  value={testProcedure}
                  onChange={(e) => setTestProcedure(e.target.value)}
                  rows={5}
                  placeholder="گام ۱: وزن‌کشی نمونه...&#10;گام ۲: انحلال و تنظیم حجم...&#10;گام ۳: تیتراسیون تا ظهور رنگ صورتی پایدار..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 leading-relaxed font-sans"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    محاسبات و فرمول‌ها (پشتیبانی کامل از LaTeX)
                  </label>
                  <span className="text-[10px] text-stone-400 font-mono">
                    استفاده از $...$ برای فرمول درون‌خطی و $$...$$ برای بلوک فرمول
                  </span>
                </div>
                <textarea
                  value={calculationsAndFormulas}
                  onChange={(e) => setCalculationsAndFormulas(e.target.value)}
                  rows={4}
                  placeholder="درصد اسیدیته بر حسب اسید لاکتیک:&#10;$$\text{Acidity (\%)} = \frac{V \times N \times 0.090}{m} \times 100$$"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-900 dark:text-stone-100 leading-relaxed"
                />

                {calculationsAndFormulas && (
                  <div className="mt-2 p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                    <div className="text-[11px] font-bold text-purple-800 dark:text-purple-300 mb-1">
                      پیش‌نمایش فرمول (Live Math Preview):
                    </div>
                    <StandardMathFormula content={calculationsAndFormulas} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Acceptable Limits Table */}
          {activeTab === 'limits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    جدول ویژگی‌ها و محدوده‌های مجاز (Acceptable Limits & Specs)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    تعیین پارامترهای فیزیکوشیمیایی، میکروبیولوژی و حدود مجاز استاندارد
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddLimitRow}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن ردیف پارامتر</span>
                </button>
              </div>

              {acceptableLimits.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-2xl text-xs text-stone-400 space-y-2">
                  <p>هیچ پارامتری برای این استاندارد ثبت نشده است.</p>
                  <button
                    type="button"
                    onClick={handleAddLimitRow}
                    className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                  >
                    + افزودن اولین پارامتر مجاز
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {acceptableLimits.map((lim, idx) => (
                    <div
                      key={lim.id || idx}
                      className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                          پارامتر شماره #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLimitRow(idx)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
                        <div>
                          <label className="block text-[11px] text-stone-500 mb-1">نام پارامتر (فارسی)</label>
                          <input
                            type="text"
                            value={lim.parameterNameFa}
                            onChange={(e) => handleUpdateLimitRow(idx, 'parameterNameFa', e.target.value)}
                            placeholder="مثلاً: درصد چربی، pH"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-500 mb-1">حد مشخصه / مقدار مجاز</label>
                          <input
                            type="text"
                            value={lim.limitSpecification}
                            onChange={(e) => handleUpdateLimitRow(idx, 'limitSpecification', e.target.value)}
                            placeholder="مثلاً: حداقل ۳.۲، ۶.۶-۶.۸"
                            dir="ltr"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-500 mb-1">واحد اندازه‌گیری</label>
                          <input
                            type="text"
                            value={lim.unit || ''}
                            onChange={(e) => handleUpdateLimitRow(idx, 'unit', e.target.value)}
                            placeholder="درصد، mg/kg، CFU/g"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-500 mb-1">رواداری (Tolerance)</label>
                          <input
                            type="text"
                            value={lim.tolerance || ''}
                            onChange={(e) => handleUpdateLimitRow(idx, 'tolerance', e.target.value)}
                            placeholder="±۰.۱"
                            dir="ltr"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-500 mb-1">روش آزمون مرجع</label>
                          <input
                            type="text"
                            value={lim.testMethodRef || ''}
                            onChange={(e) => handleUpdateLimitRow(idx, 'testMethodRef', e.target.value)}
                            placeholder="بند ۶.۱، AOAC"
                            dir="ltr"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Warnings, Errors & Scientific Source Linking */}
          {activeTab === 'warnings_source' && (
            <div className="space-y-5">
              {/* Errors & Safety Warnings */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  خطاها، عوامل مداخله‌گر و هشدارهای ایمنی (Errors & Safety Precautions)
                </label>
                <textarea
                  value={errorsAndSafetyWarnings}
                  onChange={(e) => setErrorsAndSafetyWarnings(e.target.value)}
                  rows={3}
                  placeholder="نکات ایمنی کار با اسیدها، تداخل ترکیبات آلی، خطاهای ناشی از دمای تیتراسیون و..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 leading-relaxed"
                />
              </div>

              {/* Source Verification Integrity Rules */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>اتصال به منبع علمی معتبر (Scientific Source Citation)</span>
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      بر اساس اصل صیانت علمی، ثبت در وضعیت «تأییدشده» مستلزم انتخاب حداقل یک منبع رسمی است.
                    </p>
                  </div>

                  {onOpenCreateSource && (
                    <button
                      type="button"
                      onClick={onOpenCreateSource}
                      className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 rounded-lg hover:underline"
                    >
                      + ثبت منبع جدید در دیتابیس
                    </button>
                  )}
                </div>

                {/* Source Select Row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                  <div className="sm:col-span-2">
                    <select
                      value={selectedSourceId}
                      onChange={(e) => setSelectedSourceId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                    >
                      <option value="">-- انتخاب منبع علمی از دیتابیس ({availableSources.length} منبع موجود) --</option>
                      {availableSources.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.codeOrIdentifier || s.organizationOrPublisher})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={citationSection}
                      onChange={(e) => setCitationSection(e.target.value)}
                      placeholder="بند / فصل (اختیاری)"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={citationPage}
                      onChange={(e) => setCitationPage(e.target.value)}
                      placeholder="صفحه (اختیاری)"
                      className="w-20 px-2 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 text-center font-mono"
                    />

                    <button
                      type="button"
                      onClick={handleAddCitation}
                      disabled={!selectedSourceId}
                      className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>الصاق منبع</span>
                    </button>
                  </div>
                </div>

                {/* Attached Citations List */}
                <div className="space-y-2 pt-2">
                  {sources.map((c) => (
                    <div
                      key={c.sourceId}
                      className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-stone-900 dark:text-stone-100">
                          {c.sourceTitle || 'منبع علمی'}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2">
                          {c.codeOrIdentifier && <span className="font-mono">{c.codeOrIdentifier}</span>}
                          {c.sectionOrChapter && <span>• بند: {c.sectionOrChapter}</span>}
                          {c.pageNumber && <span>• صفحه: {c.pageNumber}</span>}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCitation(c.sourceId)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {sources.length === 0 && (
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>هیچ منبعی پیوست نشده است. در صورت عدم پیوست منبع، وضعیت رکورد به «پیش‌نویس / در انتظار بررسی» تبدیل خواهد شد.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  برچسب‌های کلیدی (Tags)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="برچسب جدید..."
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold"
                  >
                    افزودن
                  </button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] flex items-center gap-1"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                        className="text-stone-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              انصراف
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'info' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs: Array<'info' | 'scope_method' | 'equipment_reagents' | 'procedure_calc' | 'limits' | 'warnings_source'> = [
                      'info', 'scope_method', 'equipment_reagents', 'procedure_calc', 'limits', 'warnings_source'
                    ];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 transition-colors"
                >
                  مرحله قبل
                </button>
              )}

              {activeTab !== 'warnings_source' ? (
                <button
                  type="button"
                  onClick={() => {
                    const tabs: Array<'info' | 'scope_method' | 'equipment_reagents' | 'procedure_calc' | 'limits' | 'warnings_source'> = [
                      'info', 'scope_method', 'equipment_reagents', 'procedure_calc', 'limits', 'warnings_source'
                    ];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
                  }}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold transition-colors"
                >
                  مرحله بعد
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'در حال اعتبارسنجی و ذخیره...' : 'ذخیره نهایی استاندارد'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
