import React from 'react';
import { 
  UnifiedScientificSource, 
  ScientificSourceType, 
  ScientificConfidenceLevel 
} from '../../types/scientificSource';
import {
  X,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  Shield,
  ExternalLink,
  Calendar,
  Building,
  User,
  Hash,
  Link as LinkIcon,
  Edit2,
  Trash2,
  FileText,
  Globe,
  FileDown,
  Scale,
  CheckCircle,
  AlertCircle,
  Search,
  Eye
} from 'lucide-react';

interface UnifiedSourceDetailModalProps {
  source: UnifiedScientificSource | null;
  onClose: () => void;
  onEdit?: (source: UnifiedScientificSource) => void;
  onDelete?: (source: UnifiedScientificSource) => void;
  onOpenPdfReader?: (source: UnifiedScientificSource) => void;
}

const TYPE_NAMES: Record<ScientificSourceType, { label: string; badge: string }> = {
  inso_standard: { label: 'استاندارد ملی ایران (INSO)', badge: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200' },
  iso_standard: { label: 'استاندارد بین‌المللی ISO', badge: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200' },
  aoac_method: { label: 'روش رسمی آزمون AOAC', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200' },
  codex_standard: { label: 'استاندارد بین‌المللی کدکس (Codex)', badge: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-200' },
  scientific_paper: { label: 'مقاله علمی پژوهشی داوری‌شده', badge: 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-200' },
  reference_book: { label: 'کتاب مرجع دانشگاهی', badge: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200' },
  lecture_handout: { label: 'جزوه آموزشی و پمفلت دانشگاهی', badge: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200' },
  lab_file: { label: 'فایل و گزارش آزمایشگاهی (Log/Protocol)', badge: 'bg-lime-100 text-lime-900 border-lime-300 dark:bg-lime-950 dark:text-lime-200' },
  lab_manual: { label: 'راهنمای آزمایشگاهی و SOP', badge: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950 dark:text-teal-200' },
  sds: { label: 'برگه اطلاعات ایمنی مواد شیمیایی (SDS)', badge: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200' },
  academic_thesis: { label: 'منبع دانشگاهی و رساله', badge: 'bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-950 dark:text-violet-200' },
  official_regulatory: { label: 'منبع رسمی سازمانی و نظارتی', badge: 'bg-stone-100 text-stone-900 border-stone-300 dark:bg-stone-800 dark:text-stone-200' }
};

const CONFIDENCE_BADGES: Record<ScientificConfidenceLevel, { label: string; badge: string; desc: string; icon: typeof ShieldCheck }> = {
  verified: {
    label: 'تأییدشده رسمی (Verified)',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200',
    desc: 'مستند به استانداردهای ملی و بین‌المللی رسمی مصوب با ارزش قانونی و الزام‌آور در کنترل کیفیت صنعتی.',
    icon: ShieldCheck
  },
  source_backed: {
    label: 'دارای منبع معتبر (Source-backed)',
    badge: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200',
    desc: 'مستند به مقالات پژوهشی داوری‌شده (Peer-reviewed) یا کتب مرجع تراز اول دانشگاهی با شابک و DOI معتبر.',
    icon: ShieldCheck
  },
  partially_supported: {
    label: 'پشتیبانی علمی جزئی (Partially supported)',
    badge: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200',
    desc: 'تایید کلی بر اساس اصول مهندسی غذا بدون ذکر ادیشن یا شماره استاندارد تجدیدنظرشده؛ نیازمند استعلام رسمی.',
    icon: ShieldAlert
  },
  unverified: {
    label: 'فاقد منبع قطعی (Unverified)',
    badge: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200',
    desc: 'اطلاعات تخمینی یا تجربی که نباید به عنوان فکت آزمایشگاهی مطلق در نظر گرفته شود.',
    icon: AlertCircle
  }
};

export const UnifiedSourceDetailModal: React.FC<UnifiedSourceDetailModalProps> = ({
  source,
  onClose,
  onEdit,
  onDelete,
  onOpenPdfReader
}) => {
  if (!source) return null;

  const typeConfig = TYPE_NAMES[source.sourceType] || {
    label: source.sourceType,
    badge: 'bg-stone-100 text-stone-800'
  };

  const confConfig = CONFIDENCE_BADGES[source.confidenceLevel] || CONFIDENCE_BADGES.unverified;
  const ConfIcon = confConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 my-8 text-right">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${typeConfig.badge}`}>
                {typeConfig.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${confConfig.badge}`}>
                <ConfIcon className="w-3.5 h-3.5" />
                <span>{confConfig.label}</span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
              {source.title}
            </h2>
            {source.englishTitle && (
              <p className="text-xs text-stone-500 font-mono mt-1" dir="ltr">
                {source.englishTitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confidence Description Banner */}
        <div className="my-4 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs">
          <div className="font-semibold text-stone-800 dark:text-stone-200 mb-1 flex items-center gap-1.5">
            <ConfIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>وضعیت اعتبار علمی: {confConfig.label}</span>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
            {confConfig.desc}
          </p>
        </div>

        {/* Metadata Grid (12 Mandatory Fields) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 text-xs">
          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/80 dark:border-stone-800">
            <span className="text-stone-400 block text-[10px] mb-0.5">شماره استاندارد / شناسه</span>
            <div className="font-bold text-stone-900 dark:text-stone-100 font-mono flex items-center gap-1.5" dir="ltr">
              <Hash className="w-3.5 h-3.5 text-stone-400" />
              <span>{source.standardNumber || '—'}</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/80 dark:border-stone-800">
            <span className="text-stone-400 block text-[10px] mb-0.5">نویسنده یا سازمان صادرکننده</span>
            <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-stone-400" />
              <span>{source.authorOrOrganization}</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/80 dark:border-stone-800">
            <span className="text-stone-400 block text-[10px] mb-0.5">سال و نسخه / ویرایش</span>
            <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>سال {source.year} | {source.editionOrVersion}</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/80 dark:border-stone-800">
            <span className="text-stone-400 block text-[10px] mb-0.5">کشور / حوزه صلاحیت</span>
            <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-stone-400" />
              <span>{source.country}</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/80 dark:border-stone-800">
            <span className="text-stone-400 block text-[10px] mb-0.5">تاریخ آخرین دسترسی / استعلام</span>
            <div className="font-mono text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{source.accessDate}</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/80 dark:border-stone-800">
            <span className="text-stone-400 block text-[10px] mb-0.5">شناسه دیجیتال (DOI) / شابک (ISBN)</span>
            <div className="font-mono text-stone-900 dark:text-stone-100 flex items-center gap-1.5" dir="ltr">
              <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{source.doi ? `DOI: ${source.doi}` : (source.isbn ? `ISBN: ${source.isbn}` : '—')}</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/80 dark:border-stone-800">
            <span className="text-stone-400 block text-[10px] mb-0.5">ناشر / منبع انتشار</span>
            <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{source.publisher || source.organization || '—'}</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/80 dark:border-stone-800 sm:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-stone-400 block text-[10px] mb-0.5">وضعیت فایل و پردازش سند PDF</span>
                <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
                  <FileDown className="w-4 h-4 text-rose-500" />
                  {source.hasPdf ? (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {source.pdfFileName || 'سند PDF پیوست‌شده'}
                      </span>
                      {source.hasOcrExtracted && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 rounded border border-amber-300 dark:border-amber-800">
                          {source.isOcrVerified ? 'تصویر اسکن (OCR تاییدشده)' : 'تصویر اسکن (OCR نیازمند بررسی)'}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-stone-400">فایل ضمیمه ندارد</span>
                  )}
                </div>
              </div>

              {source.hasPdf && onOpenPdfReader && (
                <button
                  type="button"
                  onClick={() => onOpenPdfReader(source)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>مشاهده متن و جستجو در PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* URL Link */}
        {source.url && (
          <div className="my-3 p-2.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">نشانی دسترسی برخط (URL):</span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
              dir="ltr"
            >
              <span className="truncate max-w-[320px]">{source.url}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        )}

        {/* Notes */}
        {source.notes && (
          <div className="my-3 p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
            <span className="text-stone-400 block text-[10px] mb-1 font-semibold">یادداشت‌ها و کاربرد صنعتی (Notes):</span>
            <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
              {source.notes}
            </p>
          </div>
        )}

        {/* System Linkage Statistics */}
        <div className="my-4 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs">
          <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-2">
            اتصال علمی در برنامه (System-wide Entity Links):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
            <div className="bg-white dark:bg-stone-900 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
              <span className="block text-stone-400 text-[10px]">روش‌های آزمون</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                {source.linkedEntities?.testMethodsCount ?? 0}
              </span>
            </div>
            <div className="bg-white dark:bg-stone-900 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
              <span className="block text-stone-400 text-[10px]">فرمول‌های محاسباتی</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                {source.linkedEntities?.formulasCount ?? 0}
              </span>
            </div>
            <div className="bg-white dark:bg-stone-900 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
              <span className="block text-stone-400 text-[10px]">حدود مجاز کیفی</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                {source.linkedEntities?.limitsCount ?? 0}
              </span>
            </div>
            <div className="bg-white dark:bg-stone-900 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
              <span className="block text-stone-400 text-[10px]">محصولات غذایی</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                {source.linkedEntities?.productsCount ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {source.tags && source.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 my-3">
            {source.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px]">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(source)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>ویرایش منبع</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(source)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
