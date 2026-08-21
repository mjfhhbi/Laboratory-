import React, { useState, useEffect } from 'react';
import {
  KnowledgeBaseRecord,
  ScientificSource,
  KnowledgeCategory,
  VerificationStatus,
  SourceCitation,
  ScientificParameter,
  KNOWLEDGE_CATEGORIES_META
} from '../../types/knowledgeBase';
import {
  getAllSources,
  createKnowledgeRecord,
  saveKnowledgeRecord
} from '../../lib/storage/knowledgeBase';
import {
  X,
  Check,
  Plus,
  Trash2,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';

interface KnowledgeRecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (record: KnowledgeBaseRecord) => void;
  initialData?: KnowledgeBaseRecord | null;
  defaultCategory?: KnowledgeCategory;
}

const FOOD_CATEGORY_OPTIONS = [
  'لبنیات و فرآورده‌های شیری',
  'فرآورده‌های گوشتی و شیلات',
  'غلات، آرد و صنعت نان',
  'نوشیدنی‌ها و آبمیوه‌ها',
  'روغن‌ها و چربی‌های خوراکی',
  'کنسروها و غذاهای آماده',
  'شیرینی و شکلات و فرآورده‌های قندی',
  'افزودنی‌ها، اسانس و هیدروکلوئیدها'
];

export const KnowledgeRecordFormModal: React.FC<KnowledgeRecordFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialData,
  defaultCategory
}) => {
  const [sourcesList, setSourcesList] = useState<ScientificSource[]>([]);
  const [category, setCategory] = useState<KnowledgeCategory>(defaultCategory || 'standards');
  const [subCategory, setSubCategory] = useState('');
  const [title, setTitle] = useState('');
  const [englishTitle, setEnglishTitle] = useState('');
  const [codeOrIdentifier, setCodeOrIdentifier] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [selectedFoodCategories, setSelectedFoodCategories] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('verified_with_source');
  const [citations, setCitations] = useState<SourceCitation[]>([]);
  const [parameters, setParameters] = useState<ScientificParameter[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllSources().then(setSourcesList);
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setSubCategory(initialData.subCategory || '');
      setTitle(initialData.title);
      setEnglishTitle(initialData.englishTitle || '');
      setCodeOrIdentifier(initialData.codeOrIdentifier || '');
      setSummary(initialData.summary);
      setContent(initialData.content);
      setTagsText((initialData.tags || []).join(', '));
      setSelectedFoodCategories(initialData.applicableFoodCategories || []);
      setVerificationStatus(initialData.verificationStatus);
      setCitations(initialData.sources || []);
      setParameters(initialData.parameters || []);
    } else {
      setCategory(defaultCategory || 'standards');
      setSubCategory('');
      setTitle('');
      setEnglishTitle('');
      setCodeOrIdentifier('');
      setSummary('');
      setContent('');
      setTagsText('');
      setSelectedFoodCategories([]);
      setVerificationStatus('verified_with_source');
      setCitations([]);
      setParameters([]);
    }
    setError(null);
  }, [initialData, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleAddCitation = () => {
    if (sourcesList.length === 0) {
      setError('ابتدا باید حداقل یک منبع علمی در سامانه ثبت شود تا بتوانید آن را به این رکورد متصل کنید.');
      return;
    }
    setCitations((prev) => [
      ...prev,
      {
        sourceId: sourcesList[0].id,
        sourceTitle: sourcesList[0].title,
        codeOrIdentifier: sourcesList[0].codeOrIdentifier,
        sectionOrChapter: '',
        pageNumber: '',
        tableOrFigure: '',
        directQuoteOrExcerpt: ''
      }
    ]);
  };

  const handleUpdateCitation = (index: number, field: keyof SourceCitation, value: string) => {
    setCitations((prev) => {
      const copy = [...prev];
      if (field === 'sourceId') {
        const found = sourcesList.find((s) => s.id === value);
        copy[index] = {
          ...copy[index],
          sourceId: value,
          sourceTitle: found?.title,
          codeOrIdentifier: found?.codeOrIdentifier
        };
      } else {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  const handleRemoveCitation = (index: number) => {
    setCitations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddParameter = () => {
    setParameters((prev) => [
      ...prev,
      {
        key: `param_${Date.now()}`,
        label: '',
        value: '',
        unit: '',
        tolerance: '',
        testMethodRef: ''
      }
    ]);
  };

  const handleUpdateParameter = (index: number, field: keyof ScientificParameter, value: string) => {
    setParameters((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveParameter = (index: number) => {
    setParameters((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleFoodCategory = (fc: string) => {
    setSelectedFoodCategories((prev) =>
      prev.includes(fc) ? prev.filter((c) => c !== fc) : [...prev, fc]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('عنوان رکورد دانش الزامی است.');
      return;
    }
    if (!summary.trim()) {
      setError('خلاصه رکورد الزامی است.');
      return;
    }
    if (!content.trim()) {
      setError('محتوای علمی تفصیلی الزامی است.');
      return;
    }

    // Source validation check
    let finalStatus = verificationStatus;
    if (citations.length === 0 && (finalStatus === 'verified_with_source' || finalStatus === 'official_regulatory')) {
      finalStatus = 'unverified_pending_review';
    }

    const tags = tagsText
      .split(/[,،]/)
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (initialData) {
        const updated = await saveKnowledgeRecord({
          ...initialData,
          category,
          subCategory: subCategory.trim() || undefined,
          title: title.trim(),
          englishTitle: englishTitle.trim() || undefined,
          codeOrIdentifier: codeOrIdentifier.trim() || undefined,
          summary: summary.trim(),
          content: content.trim(),
          tags,
          applicableFoodCategories: selectedFoodCategories,
          verificationStatus: finalStatus,
          sources: citations,
          parameters: parameters.filter((p) => p.label.trim() !== '')
        });
        onSaved(updated);
      } else {
        const created = await createKnowledgeRecord({
          category,
          subCategory: subCategory.trim() || undefined,
          title: title.trim(),
          englishTitle: englishTitle.trim() || undefined,
          codeOrIdentifier: codeOrIdentifier.trim() || undefined,
          summary: summary.trim(),
          content: content.trim(),
          tags,
          applicableFoodCategories: selectedFoodCategories,
          verificationStatus: finalStatus,
          sources: citations,
          parameters: parameters.filter((p) => p.label.trim() !== ''),
          offlineAvailable: true
        });
        onSaved(created);
      }
      onClose();
    } catch (err) {
      setError('خطا در ذخیره‌سازی رکورد دانش: ' + (err as Error).message);
    }
  };

  const categories = Object.keys(KNOWLEDGE_CATEGORIES_META) as KnowledgeCategory[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 flex items-center justify-between gap-3 shrink-0">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
              {initialData ? 'ویرایش رکورد پایگاه دانش' : 'ثبت رکورد جدید در پایگاه دانش تخصصی'}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              تکمیل داده‌های علمی همراه با اتصال اجباری به منبع مرجع جهت اعتباربخشی
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-5 flex-1 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 font-semibold text-xs">
              {error}
            </div>
          )}

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">
                دسته‌بندی اصلی دانش <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {KNOWLEDGE_CATEGORIES_META[cat].titleFa} ({KNOWLEDGE_CATEGORIES_META[cat].titleEn})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">
                وضعیت اعتبارسنجی علمی
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="official_regulatory">استاندارد رسمی و الزامات قانونی مصوب</option>
                <option value="verified_with_source">تأییدشده با استناد به منبع علمی</option>
                <option value="unverified_pending_review">فاقد منبع قطعی (در انتظار بررسی)</option>
              </select>
            </div>
          </div>

          {/* Title Fa & English */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">
                عنوان رکورد (فارسی) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: ویژگی‌های میکروبیولوژی شیر پاستوریزه"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">
                عنوان انگلیسی
              </label>
              <input
                type="text"
                value={englishTitle}
                onChange={(e) => setEnglishTitle(e.target.value)}
                placeholder="e.g. Pasteurized Milk Microbiological Specifications"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                dir="ltr"
              />
            </div>
          </div>

          {/* Code Identifier & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">
                شناسه / کد یکتا (اختیاری)
              </label>
              <input
                type="text"
                value={codeOrIdentifier}
                onChange={(e) => setCodeOrIdentifier(e.target.value)}
                placeholder="مثلاً: INSO-2852 یا SOP-QC-04"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 font-mono"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">
                زیرشاخه تخصصی
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="مثلاً: فرآوری حرارتی / رئولوژی / فرمولاسیون"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">
              خلاصه و اهداف علمی رکورد <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="چکیده کوتاه و اهداف کاربردی این رکورد در صنایع غذایی..."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 resize-none leading-relaxed"
              required
            />
          </div>

          {/* Content Markdown */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">
              متن کامل و الزامات فنی (پشتیبانی از Markdown و فرمول‌ها) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="شرح کامل، روش‌های کار، جداول و معادلات..."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 font-mono text-xs leading-relaxed"
              required
            />
          </div>

          {/* Scientific Sources & Citation Linking (Strict Requirement) */}
          <div className="space-y-2 p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>اتصال به منابع علمی مرجع (Citations)</span>
                </label>
                <p className="text-[11px] text-stone-500">
                  برای احراز اصالت علمی، هر رکورد باید به منبع مشخص با ذکر بند/صفحه متصل باشد.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddCitation}
                className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1 hover:bg-emerald-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن استناد</span>
              </button>
            </div>

            {citations.length === 0 ? (
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  هیچ منبعی متصل نشده است. این رکورد با وضعیت «در انتظار بازبینی» ثبت خواهد شد و هوش مصنوعی آن را به عنوان حقیقت قطعی معرفی نخواهد کرد.
                </span>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {citations.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={c.sourceId}
                        onChange={(e) => handleUpdateCitation(idx, 'sourceId', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-bold text-xs"
                      >
                        {sourcesList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title} ({s.organizationOrPublisher} - {s.yearOrEdition})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveCitation(idx)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="حذف این استناد"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      <input
                        type="text"
                        value={c.sectionOrChapter || ''}
                        onChange={(e) => handleUpdateCitation(idx, 'sectionOrChapter', e.target.value)}
                        placeholder="فصل یا بند (مثلاً: بند ۴-۲)"
                        className="px-2.5 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                      />
                      <input
                        type="text"
                        value={c.pageNumber || ''}
                        onChange={(e) => handleUpdateCitation(idx, 'pageNumber', e.target.value)}
                        placeholder="شماره صفحه (مثلاً: ص ۱۴)"
                        className="px-2.5 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                      />
                      <input
                        type="text"
                        value={c.tableOrFigure || ''}
                        onChange={(e) => handleUpdateCitation(idx, 'tableOrFigure', e.target.value)}
                        placeholder="جدول / شکل (مثلاً: جدول شماره ۳)"
                        className="px-2.5 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                      />
                    </div>

                    <input
                      type="text"
                      value={c.directQuoteOrExcerpt || ''}
                      onChange={(e) => handleUpdateCitation(idx, 'directQuoteOrExcerpt', e.target.value)}
                      placeholder="نقل‌قول مستقیم یا متن بند استاندارد مربوطه (اختیاری)"
                      className="w-full px-2.5 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Parameters Editor */}
          <div className="space-y-2 p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>پارامترهای قابل اندازه‌گیری و حدود مجاز</span>
              </label>

              <button
                type="button"
                onClick={handleAddParameter}
                className="px-2.5 py-1 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن پارامتر</span>
              </button>
            </div>

            {parameters.map((p, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-[11px]"
              >
                <input
                  type="text"
                  value={p.label}
                  onChange={(e) => handleUpdateParameter(idx, 'label', e.target.value)}
                  placeholder="عنوان (مثلاً: اسیدیته)"
                  className="px-2 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                />
                <input
                  type="text"
                  value={String(p.value)}
                  onChange={(e) => handleUpdateParameter(idx, 'value', e.target.value)}
                  placeholder="مقدار (مثلاً: حداکثر ۰.۱۶)"
                  className="px-2 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-mono"
                  dir="ltr"
                />
                <input
                  type="text"
                  value={p.unit || ''}
                  onChange={(e) => handleUpdateParameter(idx, 'unit', e.target.value)}
                  placeholder="واحد (مثلاً: %)"
                  className="px-2 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                />
                <input
                  type="text"
                  value={p.testMethodRef || ''}
                  onChange={(e) => handleUpdateParameter(idx, 'testMethodRef', e.target.value)}
                  placeholder="روش آزمون (مثلاً: AOAC 942.15)"
                  className="px-2 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-mono"
                  dir="ltr"
                />
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveParameter(idx)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Applicable Food Categories */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 dark:text-stone-300">
              گروه‌های غذایی تحت پوشش
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FOOD_CATEGORY_OPTIONS.map((fc) => {
                const selected = selectedFoodCategories.includes(fc);
                return (
                  <button
                    key={fc}
                    type="button"
                    onClick={() => toggleFoodCategory(fc)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                      selected
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700 font-bold'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {fc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">
              برچسب‌ها (کلیدواژه‌ها)
            </label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="برچسب‌ها با ویرگول جدا شوند (مثلاً: پاستوریزاسیون, کنترل کیفیت, شیر)"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold"
            >
              انصراف
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold inline-flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'ذخیره تغییرات' : 'ثبت رکورد دانش'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
