import React from 'react';
import { 
  FileText, 
  X, 
  Eye, 
  Sparkles, 
  Plus, 
  Layers, 
  GitCompare, 
  FlaskConical, 
  Microscope, 
  Gauge, 
  TrendingUp, 
  Table, 
  BookMarked,
  HelpCircle
} from 'lucide-react';
import { AttachedPdfDocument, PdfAnalysisAction } from '../../lib/pdfAnalysis/types';

interface AttachedPdfBannerProps {
  attachedPdfs: AttachedPdfDocument[];
  onRemovePdf: (id: string) => void;
  onOpenPdfReader: (pdf: AttachedPdfDocument) => void;
  onOpenUploadModal: () => void;
  onTriggerAction: (action: PdfAnalysisAction) => void;
  disabled?: boolean;
}

export const AttachedPdfBanner: React.FC<AttachedPdfBannerProps> = ({
  attachedPdfs,
  onRemovePdf,
  onOpenPdfReader,
  onOpenUploadModal,
  onTriggerAction,
  disabled
}) => {
  if (attachedPdfs.length === 0) return null;

  const hasTwoPdfs = attachedPdfs.length >= 2;

  return (
    <div className="border-b border-stone-200 dark:border-stone-800 bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5 sm:p-3 space-y-2">
      {/* Attached Files Pill Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 shrink-0">
            <FileText className="w-3.5 h-3.5" />
            <span>اسناد فعال در گفتگو:</span>
          </span>

          {attachedPdfs.map((pdf, idx) => (
            <div
              key={pdf.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800/80 shadow-2xs text-xs max-w-[280px] sm:max-w-[340px]"
            >
              <div className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px] font-mono shrink-0">
                {idx + 1}
              </div>

              <span className="font-bold text-stone-800 dark:text-stone-200 truncate" title={pdf.title}>
                {pdf.title}
              </span>

              <span className="text-[10px] text-stone-400 font-mono shrink-0">
                ({pdf.pageCount} ص)
              </span>

              {pdf.isScanned && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium shrink-0">
                  OCR
                </span>
              )}

              {/* View button */}
              <button
                type="button"
                onClick={() => onOpenPdfReader(pdf)}
                className="p-1 text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0"
                title="مشاهده محتوای صفحات"
              >
                <Eye className="w-3 h-3" />
              </button>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemovePdf(pdf.id)}
                className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors shrink-0"
                title="حذف پیوست"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {attachedPdfs.length === 1 && (
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-dashed border-emerald-400 dark:border-emerald-800 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ افزودن سند دوم جهت مقایسه تطبیقی</span>
            </button>
          )}
        </div>

        <div className="text-[10px] text-emerald-800 dark:text-emerald-400 font-mono">
          استخراج مستقیم از متن صفحات (Grounding)
        </div>
      </div>

      {/* Quick Extraction Action Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar text-xs">
        <span className="text-[11px] text-stone-500 dark:text-stone-400 shrink-0 flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>استخراج ساختاریافته:</span>
        </span>

        {/* 1. Summary */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onTriggerAction('summary')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-200 border border-stone-200 dark:border-stone-800 whitespace-nowrap transition-colors shrink-0 shadow-2xs font-medium"
        >
          <BookMarked className="w-3 h-3 text-emerald-600" />
          <span>خلاصه‌سازی مقاله</span>
        </button>

        {/* 2. Methodology */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onTriggerAction('methodology')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-200 border border-stone-200 dark:border-stone-800 whitespace-nowrap transition-colors shrink-0 shadow-2xs font-medium"
        >
          <FlaskConical className="w-3 h-3 text-cyan-600" />
          <span>استخراج روش آزمایش</span>
        </button>

        {/* 3. Materials & Equipment */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onTriggerAction('materials_equipment')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-200 border border-stone-200 dark:border-stone-800 whitespace-nowrap transition-colors shrink-0 shadow-2xs font-medium"
        >
          <Microscope className="w-3 h-3 text-purple-600" />
          <span>مواد و تجهیزات</span>
        </button>

        {/* 4. Parameters & Limits */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onTriggerAction('parameters')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-200 border border-stone-200 dark:border-stone-800 whitespace-nowrap transition-colors shrink-0 shadow-2xs font-medium"
        >
          <Gauge className="w-3 h-3 text-amber-600" />
          <span>استخراج پارامترها و حدود</span>
        </button>

        {/* 5. Results */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onTriggerAction('results')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-200 border border-stone-200 dark:border-stone-800 whitespace-nowrap transition-colors shrink-0 shadow-2xs font-medium"
        >
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          <span>استخراج نتایج</span>
        </button>

        {/* 6. Tables */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onTriggerAction('tables')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-200 border border-stone-200 dark:border-stone-800 whitespace-nowrap transition-colors shrink-0 shadow-2xs font-medium"
        >
          <Table className="w-3 h-3 text-indigo-600" />
          <span>استخراج جدول‌ها</span>
        </button>

        {/* 7. References */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onTriggerAction('references')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-200 border border-stone-200 dark:border-stone-800 whitespace-nowrap transition-colors shrink-0 shadow-2xs font-medium"
        >
          <BookMarked className="w-3 h-3 text-rose-600" />
          <span>استخراج منابع</span>
        </button>

        {/* 8. Comparison (Highlighted if 2 PDFs) */}
        <button
          type="button"
          disabled={disabled || !hasTwoPdfs}
          onClick={() => onTriggerAction('comparison')}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg whitespace-nowrap transition-colors shrink-0 shadow-2xs font-bold ${
            hasTwoPdfs
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer active:scale-98 animate-pulse'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700 cursor-not-allowed opacity-60'
          }`}
          title={hasTwoPdfs ? 'مقایسه تطبیقی دو مقاله یا استاندارد' : 'نیاز به پیوست ۲ سند جهت مقایسه'}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>مقایسه دو مقاله / دو روش آزمایش</span>
        </button>
      </div>
    </div>
  );
};
