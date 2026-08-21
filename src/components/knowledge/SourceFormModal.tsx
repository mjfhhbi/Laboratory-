import React, { useState, useEffect } from 'react';
import {
  ScientificSource,
  SourcePublicationType,
  SourceReliabilityGrade
} from '../../types/knowledgeBase';
import { createSource, saveSource } from '../../lib/storage/knowledgeBase';
import { X, Check, BookOpen, Building, Calendar, User, Link, Hash, FileText } from 'lucide-react';

interface SourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (source: ScientificSource) => void;
  initialData?: ScientificSource | null;
}

const PUBLICATION_TYPES: Array<{ value: SourcePublicationType; label: string }> = [
  { value: 'official_standard_body', label: 'سازمان ملی یا بین‌المللی استاندارد (INSO / ISO / Codex / FDA)' },
  { value: 'peer_reviewed_journal', label: 'نشریه علمی پژوهشی داوری‌شده (Elsevier, Springer, Wiley, ...)' },
  { value: 'academic_textbook', label: 'کتاب مرجع دانشگاهی معتبر (Fennema, Heldman, ...)' },
  { value: 'official_regulation', label: 'آیین‌نامه و قوانین رسمی نظارتی غذا و دارو' },
  { value: 'technical_handbook', label: 'هندبوک و دستورالعمل فنی معتبر' },
  { value: 'conference_proceedings', label: 'مجموعه مقالات همایش علمی معتبر' }
];

const RELIABILITY_GRADES: Array<{ value: SourceReliabilityGrade; label: string; desc: string }> = [
  {
    value: 'A_official_standard',
    label: 'درجه A — استاندارد رسمی مصوب',
    desc: 'استاندارد ملی یا بین‌المللی با اعتبار قانونی قطعی'
  },
  {
    value: 'B_peer_reviewed_journal',
    label: 'درجه B — مقاله ژورنال علمی معتبر',
    desc: 'مقاله پژوهشی داوری‌شده با شناسه DOI'
  },
  {
    value: 'C_academic_textbook',
    label: 'درجه C — کتاب مرجع دانشگاهی',
    desc: 'کتاب مرجع تخصصی دانشگاهی دارای شابک (ISBN)'
  },
  {
    value: 'D_technical_bulletin',
    label: 'درجه D — بولتن فنی صنعتی',
    desc: 'کاتالوگ و مستندات فنی شرکت‌های معتبر'
  }
];

export const SourceFormModal: React.FC<SourceFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialData
}) => {
  const [title, setTitle] = useState('');
  const [englishTitle, setEnglishTitle] = useState('');
  const [authorsText, setAuthorsText] = useState('');
  const [publicationType, setPublicationType] = useState<SourcePublicationType>('official_standard_body');
  const [organizationOrPublisher, setOrganizationOrPublisher] = useState('');
  const [yearOrEdition, setYearOrEdition] = useState('');
  const [codeOrIdentifier, setCodeOrIdentifier] = useState('');
  const [urlOrAccessLink, setUrlOrAccessLink] = useState('');
  const [reliabilityGrade, setReliabilityGrade] = useState<SourceReliabilityGrade>('A_official_standard');
  const [description, setDescription] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setEnglishTitle(initialData.englishTitle || '');
      setAuthorsText(initialData.authors.join(', '));
      setPublicationType(initialData.publicationType);
      setOrganizationOrPublisher(initialData.organizationOrPublisher);
      setYearOrEdition(initialData.yearOrEdition);
      setCodeOrIdentifier(initialData.codeOrIdentifier || '');
      setUrlOrAccessLink(initialData.urlOrAccessLink || '');
      setReliabilityGrade(initialData.reliabilityGrade);
      setDescription(initialData.description || '');
      setTagsText((initialData.tags || []).join(', '));
    } else {
      setTitle('');
      setEnglishTitle('');
      setAuthorsText('');
      setPublicationType('official_standard_body');
      setOrganizationOrPublisher('');
      setYearOrEdition('');
      setCodeOrIdentifier('');
      setUrlOrAccessLink('');
      setReliabilityGrade('A_official_standard');
      setDescription('');
      setTagsText('');
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('عنوان منبع علمی الزامی است.');
      return;
    }
    if (!organizationOrPublisher.trim()) {
      setError('نام سازمان ناظر یا ناشر منبع الزامی است.');
      return;
    }
    if (!yearOrEdition.trim()) {
      setError('سال انتشار یا شماره ویرایش الزامی است.');
      return;
    }

    const authors = authorsText
      .split(/[,،]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const tags = tagsText
      .split(/[,،]/)
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (initialData) {
        const updated = await saveSource({
          ...initialData,
          title: title.trim(),
          englishTitle: englishTitle.trim() || undefined,
          authors,
          publicationType,
          organizationOrPublisher: organizationOrPublisher.trim(),
          yearOrEdition: yearOrEdition.trim(),
          codeOrIdentifier: codeOrIdentifier.trim() || undefined,
          urlOrAccessLink: urlOrAccessLink.trim() || undefined,
          reliabilityGrade,
          description: description.trim() || undefined,
          tags
        });
        onSaved(updated);
      } else {
        const created = await createSource({
          title: title.trim(),
          englishTitle: englishTitle.trim() || undefined,
          authors,
          publicationType,
          organizationOrPublisher: organizationOrPublisher.trim(),
          yearOrEdition: yearOrEdition.trim(),
          codeOrIdentifier: codeOrIdentifier.trim() || undefined,
          urlOrAccessLink: urlOrAccessLink.trim() || undefined,
          reliabilityGrade,
          description: description.trim() || undefined,
          tags
        });
        onSaved(created);
      }
      onClose();
    } catch (err) {
      setError('خطا در ذخیره‌سازی منبع: ' + (err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                {initialData ? 'ویرایش منبع علمی مرجع' : 'ثبت منبع علمی / استاندارد مرجع جدید'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                مشخصات کتاب‌شناختی دقیق جهت ارجاع و استناددهی در پایگاه دانش
              </p>
            </div>
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-4 flex-1 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 font-semibold text-xs">
              {error}
            </div>
          )}

          {/* Title Fa */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">
              عنوان رسمی منبع (فارسی) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: استاندارد ملی شیر و فرآورده‌های آن یا کتاب شیمی مواد غذایی فنما"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
              required
            />
          </div>

          {/* English Title */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">
              عنوان انگلیسی منبع (اختیاری)
            </label>
            <input
              type="text"
              value={englishTitle}
              onChange={(e) => setEnglishTitle(e.target.value)}
              placeholder="e.g. Milk and Milk Products - Microbiological Specifications"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
              dir="ltr"
            />
          </div>

          {/* Publication Type & Reliability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">نوع اثر / نشریه</label>
              <select
                value={publicationType}
                onChange={(e) => setPublicationType(e.target.value as SourcePublicationType)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
              >
                {PUBLICATION_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">درجه اعتبار علمی</label>
              <select
                value={reliabilityGrade}
                onChange={(e) => setReliabilityGrade(e.target.value as SourceReliabilityGrade)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
              >
                {RELIABILITY_GRADES.map((rg) => (
                  <option key={rg.value} value={rg.value}>
                    {rg.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Publisher & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">
                سازمان ناظر / ناشر <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={organizationOrPublisher}
                onChange={(e) => setOrganizationOrPublisher(e.target.value)}
                placeholder="سازمان ملی استاندارد / Elsevier / CRC Press"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">
                سال انتشار یا ویرایش <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={yearOrEdition}
                onChange={(e) => setYearOrEdition(e.target.value)}
                placeholder="1402 / 2024 / 5th Edition"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </div>
          </div>

          {/* Authors */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">نویسندگان / پدیدآورندگان</label>
            <input
              type="text"
              value={authorsText}
              onChange={(e) => setAuthorsText(e.target.value)}
              placeholder="اسامی با کاما یا ویرگول جدا شوند (مثلاً: داکسیس، دیمیک، سازمان ملی استاندارد)"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Identifier (INSO / DOI / ISBN) & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">کد رسمی / DOI / شابک</label>
              <input
                type="text"
                value={codeOrIdentifier}
                onChange={(e) => setCodeOrIdentifier(e.target.value)}
                placeholder="مثال: INSO-1629 یا 10.1016/j.foodchem.2023..."
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 font-mono"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300">پیوند اینترنتی (URL)</label>
              <input
                type="url"
                value={urlOrAccessLink}
                onChange={(e) => setUrlOrAccessLink(e.target.value)}
                placeholder="https://isiri.gov.ir/..."
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 font-mono"
                dir="ltr"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">توضیحات و دامنه کاربرد</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات تکمیلی پیرامون حوزه پوشش منبع مرجع..."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 dark:text-stone-300">برچسب‌ها</label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="برچسب‌ها با ویرگول جدا شوند (مثلاً: استاندارد ملی, لبنیات, میکروبیولوژی)"
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
              <span>{initialData ? 'ذخیره تغییرات' : 'ثبت و تایید منبع'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
