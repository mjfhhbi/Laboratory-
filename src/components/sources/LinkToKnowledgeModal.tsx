import React, { useState } from 'react';
import { 
  X, 
  Check, 
  BookOpen, 
  Link as LinkIcon, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { LinkToKnowledgePayload } from '../../types/scientificSource';
import { linkPdfSectionToKnowledgeBase } from '../../lib/storage/pdfDocumentStorage';
import { KnowledgeCategory, VerificationStatus } from '../../types/knowledgeBase';

interface LinkToKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payload: Partial<LinkToKnowledgePayload> & {
    sourceId: string;
    sourceTitle: string;
    pageNumber: number;
  };
}

const KNOWLEDGE_CATEGORIES: Array<{ id: KnowledgeCategory; titleFa: string }> = [
  { id: 'standards', titleFa: 'استانداردها و حدود مجاز قانونی' },
  { id: 'experiments', titleFa: 'آزمایش‌ها و آزمون‌های آزمایشگاهی' },
  { id: 'test_methods', titleFa: 'روش‌های استاندارد آزمون (SOP)' },
  { id: 'food_products', titleFa: 'فرآورده‌ها و محصولات غذایی' },
  { id: 'raw_materials', titleFa: 'مواد اولیه، افزودنی‌ها و فرمولاسیون' },
  { id: 'equipment', titleFa: 'تجهیزات و ابزار دقیق آزمایشگاهی' },
  { id: 'formulas', titleFa: 'فرمول‌ها، محاسبات و استوکیومتری' },
  { id: 'common_errors', titleFa: 'خطاهای رایج و عدم انطباق‌های کیفی' },
  { id: 'scientific_definitions', titleFa: 'تعاریف و اصطلاحات علمی' },
  { id: 'references', titleFa: 'مراجع، کتب و مقالات تخصصی' }
];

export const LinkToKnowledgeModal: React.FC<LinkToKnowledgeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  payload
}) => {
  const [title, setTitle] = useState(
    payload.title || `استناد به سند «${payload.sourceTitle}» - صفحه ${payload.pageNumber}`
  );
  const [summary, setSummary] = useState(payload.summary || '');
  const [selectedQuote, setSelectedQuote] = useState(payload.selectedQuote || '');
  const [category, setCategory] = useState<KnowledgeCategory>(
    (payload.knowledgeCategory as KnowledgeCategory) || 'standards'
  );
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    payload.isOcr ? 'unverified_pending_review' : 'verified_with_source'
  );
  const [tagsInput, setTagsInput] = useState('مستند PDF, کنترل کیفیت, استناد علمی');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('عنوان رکورد دانشی الزامی است.');
      return;
    }
    if (!selectedQuote.trim()) {
      setError('متن گزیده یا نقل قول از صفحه الزامی است.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const tags = tagsInput
        .split(/[,،]/)
        .map((t) => t.trim())
        .filter(Boolean);

      await linkPdfSectionToKnowledgeBase({
        sourceId: payload.sourceId,
        sourceTitle: payload.sourceTitle,
        standardNumber: payload.standardNumber,
        doi: payload.doi,
        isbn: payload.isbn,
        pageNumber: payload.pageNumber,
        sectionHeading: payload.sectionHeading,
        selectedQuote: selectedQuote.trim(),
        knowledgeCategory: category,
        title: title.trim(),
        summary: summary.trim() || title.trim(),
        verificationStatus,
        isOcr: Boolean(payload.isOcr),
        tags
      });

      setIsSubmitting(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to link PDF section to Knowledge Base:', err);
      setIsSubmitting(false);
      setError('خطا در اتصال بخش سند به پایگاه دانش.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 my-8 text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              اتصال بخش PDF به پایگاه دانش (Knowledge Base)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source & Page Indicator */}
        <div className="my-4 p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="text-stone-400 block text-[10px] mb-0.5">منبع استناد (Source):</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">
                {payload.sourceTitle}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] mb-0.5">شماره صفحه و سرفصل:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                صفحه {payload.pageNumber} {payload.sectionHeading ? `(${payload.sectionHeading})` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* OCR Caution Banner if applicable */}
        {payload.isOcr && (
          <div className="my-3 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>هشدار هوش علمی:</strong> این بخش از تصویر اسکن‌شده با OCR استخراج شده است. لطفاً پیش از ارتقای وضعیت به «تأییدشده رسمی»، صحت مقادیر، اعداد و واحدهای سنجش را بررسی نمایید.
            </p>
          </div>
        )}

        {error && (
          <div className="my-3 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-900 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-4">
          {/* Title */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
              عنوان رکورد در پایگاه دانش *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium text-stone-900 dark:text-stone-100"
              required
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                دسته‌بندی پایگاه دانش *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium text-stone-900 dark:text-stone-100"
              >
                {KNOWLEDGE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.titleFa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                وضعیت اعتبارسنجی سند
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium text-stone-900 dark:text-stone-100"
              >
                <option value="verified_with_source">دارای استناد قطعی به منبع معتبر</option>
                <option value="official_regulatory">تأییدشده رسمی (قانون و استاندارد ملی)</option>
                <option value="unverified_pending_review">در انتظار بازبینی کارشناس (پیش‌فرض OCR)</option>
              </select>
            </div>
          </div>

          {/* Selected Excerpt / Quote */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
              متن گزیده / نقل قول مستقیم از این صفحه سند (Quote / Excerpt) *
            </label>
            <textarea
              rows={4}
              value={selectedQuote}
              onChange={(e) => setSelectedQuote(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono text-[11px] leading-relaxed text-stone-900 dark:text-stone-100"
              placeholder="متن استخراج‌شده از صفحه که در پایگاه دانش ثبت خواهد شد..."
              required
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
              خلاصه کاربردی و نتیجه‌گیری فنی (اختیاری)
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="مثلاً: حد مجاز اسیدیته شیر پاستوریزه ۱۴ تا ۱۶ دورنیک با روش تیتراسیون سود N/9"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
              برچسب‌های موضوعی (با ویرگول جدا کنید)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-md transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'در حال ثبت اتصال...' : 'ذخیره در پایگاه دانش و ثبت استناد'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
