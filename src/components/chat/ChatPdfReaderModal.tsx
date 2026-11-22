import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  FileText, 
  Copy, 
  Check, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { getPdfDocumentById } from '../../lib/storage/pdfDocumentStorage';
import { StoredPdfDocument } from '../../types/scientificSource';

interface ChatPdfReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  docId: string | null;
  initialPageNumber?: number;
}

export const ChatPdfReaderModal: React.FC<ChatPdfReaderModalProps> = ({
  isOpen,
  onClose,
  docId,
  initialPageNumber = 1
}) => {
  const [doc, setDoc] = useState<StoredPdfDocument | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPageNumber);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && docId) {
      setLoading(true);
      setCurrentPage(initialPageNumber || 1);
      getPdfDocumentById(docId).then((stored) => {
        setDoc(stored || null);
        setLoading(false);
      });
    }
  }, [isOpen, docId, initialPageNumber]);

  if (!isOpen || !docId) return null;

  const totalPages = doc?.pages.length || 1;
  const activePage = doc?.pages.find((p) => p.pageNumber === currentPage) || doc?.pages[0];

  const handleCopyPage = async () => {
    if (!activePage) return;
    try {
      await navigator.clipboard.writeText(activePage.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                {doc?.meta.title || doc?.fileName || 'مطالعه سند علمی'}
              </h3>
              <p className="text-[11px] text-stone-500 truncate">
                {doc?.meta.author || 'سند مرجع'} | {totalPages} صفحه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyPage}
              className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              title="کپی متن صفحه جاری"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'کپی شد' : 'کپی صفحه'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20 text-xs">
          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-40 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="font-mono text-stone-700 dark:text-stone-300 font-bold px-1">
              صفحه {currentPage} از {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-40 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Section badge */}
          {activePage?.sectionHeading && (
            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 truncate max-w-[280px]">
              {activePage.sectionHeading}
            </div>
          )}

          {/* Status badge */}
          <div className="flex items-center gap-1.5">
            {activePage?.isOcr ? (
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium text-[10px]">
                استخراج با OCR
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium text-[10px]">
                لایه متنی دیجیتال
              </span>
            )}
          </div>
        </div>

        {/* Document Content View */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-stone-900">
          {loading ? (
            <div className="text-center py-20 text-xs text-stone-400">در حال بارگذاری صفحه...</div>
          ) : !activePage ? (
            <div className="text-center py-20 text-xs text-stone-400">محتوایی یافت نشد.</div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800">
                <div className="text-xs text-stone-400 mb-2 font-mono flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-1.5">
                  <span>لایه استخراج‌شده سند (Extracted Text Layer)</span>
                  <span>صفحه {activePage.pageNumber}</span>
                </div>
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-normal select-text">
                  {activePage.text}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/30 flex items-center justify-between text-xs text-stone-500">
          <span>سند در حافظه مرورگر جهت استخراج هوشمند بارگذاری شده است.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
