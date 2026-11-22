import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Download, 
  Camera, 
  Eye, 
  Edit3, 
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';
import { 
  StoredPdfDocument, 
  PdfPageContent, 
  PdfSearchMatch,
  UnifiedScientificSource
} from '../../types/scientificSource';
import { 
  getPdfDocumentBySourceId, 
  searchInPdf, 
  verifyOcrPage 
} from '../../lib/storage/pdfDocumentStorage';
import { LinkToKnowledgeModal } from './LinkToKnowledgeModal';

interface PdfReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: UnifiedScientificSource;
  onLinkSuccess?: () => void;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({
  isOpen,
  onClose,
  source,
  onLinkSuccess
}) => {
  const [pdfDoc, setPdfDoc] = useState<StoredPdfDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [isEditingOcr, setIsEditingOcr] = useState(false);
  const [editedOcrText, setEditedOcrText] = useState('');
  const [reviewerName, setReviewerName] = useState('کارشناس کنترل کیفیت (QC)');
  const [isSavingVerification, setIsSavingVerification] = useState(false);
  
  // Link to Knowledge Base Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedExcerpt, setSelectedExcerpt] = useState('');

  useEffect(() => {
    if (isOpen && source) {
      setLoading(true);
      getPdfDocumentBySourceId(source.id).then((doc) => {
        setPdfDoc(doc);
        setCurrentPageNum(1);
        setLoading(false);
      });
    }
  }, [isOpen, source]);

  // Current page object
  const currentPage: PdfPageContent | undefined = useMemo(() => {
    if (!pdfDoc || !pdfDoc.pages) return undefined;
    return pdfDoc.pages.find((p) => p.pageNumber === currentPageNum) || pdfDoc.pages[0];
  }, [pdfDoc, currentPageNum]);

  // Set edit text whenever current page changes
  useEffect(() => {
    if (currentPage) {
      setEditedOcrText(currentPage.text);
      setIsEditingOcr(false);
    }
  }, [currentPage]);

  // In-PDF Search Matches
  const searchMatches: PdfSearchMatch[] = useMemo(() => {
    if (!pdfDoc || !searchQuery.trim()) return [];
    return searchInPdf(pdfDoc, searchQuery);
  }, [pdfDoc, searchQuery]);

  const totalMatchesCount = useMemo(() => {
    return searchMatches.reduce((acc, m) => acc + m.matchCount, 0);
  }, [searchMatches]);

  if (!isOpen) return null;

  const handleCopyPageText = () => {
    if (!currentPage) return;
    navigator.clipboard.writeText(currentPage.text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleOpenLinkModal = (excerpt?: string) => {
    setSelectedExcerpt(excerpt || (currentPage ? currentPage.text : ''));
    setIsLinkModalOpen(true);
  };

  const handleConfirmOcrVerification = async () => {
    if (!pdfDoc || !currentPage) return;
    try {
      setIsSavingVerification(true);
      const updatedDoc = await verifyOcrPage(
        pdfDoc.id,
        currentPage.pageNumber,
        editedOcrText,
        reviewerName.trim() || 'کارشناس کنترل کیفیت'
      );
      setPdfDoc(updatedDoc);
      setIsEditingOcr(false);
      setIsSavingVerification(false);
    } catch (err) {
      console.error('Error verifying OCR text:', err);
      setIsSavingVerification(false);
    }
  };

  // Highlight search occurrences inside text
  const renderHighlightedText = (text: string, query: string) => {
    if (!query || !query.trim()) {
      return text;
    }
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-600 text-stone-950 font-bold px-1 rounded-xs">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-6xl h-[92vh] flex flex-col bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 text-right overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                  {source.title}
                </h2>
                {pdfDoc?.meta.isScanned ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                    <Camera className="w-3 h-3" />
                    <span>سند اسکن‌شده تصویری (OCR)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                    <FileText className="w-3 h-3" />
                    <span>متن دیجیتال استاندارد</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                {pdfDoc?.fileName || source.pdfFileName || 'سند علمی PDF'} • {pdfDoc?.meta.fileSizeFormatted || '1.2 MB'} • {pdfDoc?.meta.pageCount || 1} صفحه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pdfDoc?.fileDataUrl && (
              <a
                href={pdfDoc.fileDataUrl}
                download={pdfDoc.fileName}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors"
                title="دانلود فایل PDF اصلی"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود PDF</span>
              </a>
            )}

            <button
              onClick={() => handleOpenLinkModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>اتصال به Knowledge Base</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Layout (Sidebar + Reader Canvas) */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left / Navigation Sidebar: Search & Page Selector */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-l border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex flex-col shrink-0">
            {/* Search within PDF Box */}
            <div className="p-3 border-b border-stone-200 dark:border-stone-800">
              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                جستجو در متن سند PDF:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="کلمه کلیدی (مثلاً دورنیک، فسفاتاز، دمای پاستوریزاسیون)..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden text-stone-900 dark:text-stone-100"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2" />
              </div>

              {searchQuery.trim() && (
                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5 px-1">
                  <span>{totalMatchesCount} مورد در {searchMatches.length} صفحه</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-stone-400 hover:text-stone-600 text-[10px]"
                  >
                    پاک کردن
                  </button>
                </div>
              )}
            </div>

            {/* Matching Pages or Thumbnails List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {searchQuery.trim() ? (
                // Search Results View
                searchMatches.length > 0 ? (
                  searchMatches.map((m) => (
                    <button
                      key={m.pageNumber}
                      onClick={() => setCurrentPageNum(m.pageNumber)}
                      className={`w-full text-right p-2.5 rounded-xl border text-xs transition-all ${
                        currentPageNum === m.pageNumber
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 shadow-xs'
                          : 'bg-white dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-stone-900 dark:text-stone-100">
                          صفحه {m.pageNumber}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                          {m.matchCount} تطابق
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                        {renderHighlightedText(m.snippet, searchQuery)}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-stone-400">
                    موردی با این عبارت در متن سند یافت نشد.
                  </div>
                )
              ) : (
                // Page List / Thumbnails
                pdfDoc?.pages.map((p) => (
                  <button
                    key={p.pageNumber}
                    onClick={() => setCurrentPageNum(p.pageNumber)}
                    className={`w-full text-right p-3 rounded-xl border text-xs transition-all ${
                      currentPageNum === p.pageNumber
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-800 shadow-xs ring-1 ring-emerald-500/20'
                        : 'bg-white dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        صفحه {p.pageNumber}
                      </span>
                      {p.isOcr ? (
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border ${
                          p.isHumanVerified 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {p.isHumanVerified ? 'OCR تاییدشده' : 'OCR بازبینی‌نشده'}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                          دیجیتال
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {p.sectionHeading || p.text.slice(0, 70)}...
                    </p>
                    {Boolean(p.linkedKnowledgeCount) && (
                      <span className="inline-block mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ {p.linkedKnowledgeCount} اتصال به پایگاه دانش
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Pagination Controls Footer */}
            <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between text-xs">
              <button
                disabled={currentPageNum <= 1}
                onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none"
                title="صفحه قبلی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="font-mono text-stone-700 dark:text-stone-300 font-semibold">
                صفحه {currentPageNum} از {pdfDoc?.pages.length || 1}
              </span>

              <button
                disabled={!pdfDoc || currentPageNum >= pdfDoc.pages.length}
                onClick={() => setCurrentPageNum((p) => Math.min(pdfDoc?.pages.length || 1, p + 1))}
                className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none"
                title="صفحه بعدی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right / Main Reading Sheet */}
          <div className="flex-1 flex flex-col min-h-0 bg-stone-100 dark:bg-stone-950 p-4 sm:p-6 overflow-y-auto">
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-xs text-stone-400">
                در حال بارگذاری و بازیابی صفحات سند PDF...
              </div>
            ) : currentPage ? (
              <div className="max-w-3xl mx-auto w-full space-y-4">
                {/* Scientific Rule & OCR Integrity Banner */}
                {currentPage.isOcr && !currentPage.isHumanVerified && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-1">
                            ⚠️ محتوای استخراج‌شده از تصویر با نویسه‌خوان (OCR)
                          </h4>
                          <p className="text-amber-800 dark:text-amber-200 text-[11px] leading-relaxed">
                            اطلاعات استخراج‌شده از تصویر ممکن است حاوی خطای حروف‌نگاری یا تفکیک اعداد باشد. طبق <strong>منشور جامع اعتبارسنجی علمی</strong>، داده‌های OCR تا پیش از بازبینی مستقیم کارشناس نباید به عنوان واقعیت قطعی یا مبنای صدور گواهی استاندارد تلقی گردند.
                          </p>
                          {currentPage.ocrConfidence && (
                            <span className="inline-block mt-2 font-mono text-[10px] px-2 py-0.5 bg-amber-200/60 dark:bg-amber-900/60 rounded text-amber-900 dark:text-amber-200">
                              درصد اطمینان استخراج OCR: {currentPage.ocrConfidence}%
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setIsEditingOcr(!isEditingOcr)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isEditingOcr ? 'انصراف از ویرایش' : 'بازبینی و تصحیح متن'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Human Verified Badge if previously validated */}
                {currentPage.isOcr && currentPage.isHumanVerified && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>متن OCR توسط کارشناس انسانی بازبینی، تصحیح و صحه‌گذاری شده است.</span>
                    </div>
                    {currentPage.humanVerifiedBy && (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                        تأییدکننده: {currentPage.humanVerifiedBy} ({currentPage.humanVerifiedAt})
                      </span>
                    )}
                  </div>
                )}

                {/* Page Card Layout */}
                <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800">
                  {/* Page Sheet Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 dark:border-stone-800">
                    <div>
                      <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                        {source.standardNumber || source.authorOrOrganization} • صفحه {currentPage.pageNumber}
                      </span>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {currentPage.sectionHeading || `محتوای صفحه ${currentPage.pageNumber}`}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyPageText}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="کپی متن کامل صفحه"
                      >
                        {copiedText ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">کپی شد</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-stone-400" />
                            <span>کپی متن</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleOpenLinkModal(currentPage.text)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 transition-colors"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>اتصال به Knowledge Base</span>
                      </button>
                    </div>
                  </div>

                  {/* OCR Correction Form if enabled */}
                  {isEditingOcr ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          ویرایش و صحه‌گذاری متن OCR (کارشناس آزمایشگاه / QC):
                        </span>
                        <input
                          type="text"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="نام و سمت کارشناس بازبین..."
                          className="px-2.5 py-1 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                        />
                      </div>
                      <textarea
                        rows={12}
                        value={editedOcrText}
                        onChange={(e) => setEditedOcrText(e.target.value)}
                        className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono text-xs leading-relaxed text-stone-900 dark:text-stone-100 outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsEditingOcr(false)}
                          className="px-3 py-1.5 rounded-lg text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          انصراف
                        </button>
                        <button
                          disabled={isSavingVerification}
                          onClick={handleConfirmOcrVerification}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs disabled:opacity-50"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{isSavingVerification ? 'در حال ثبت...' : 'تأیید صحت علمی و اتمام بازبینی'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Rendered Text Content with Paragraphs and Selection */
                    <div className="space-y-3 text-xs text-stone-800 dark:text-stone-200 leading-loose select-text font-sans">
                      {currentPage.paragraphs.map((para, idx) => (
                        <div
                          key={idx}
                          className="group relative p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors border border-transparent hover:border-stone-200/60 dark:hover:border-stone-700"
                        >
                          <p className="leading-relaxed">
                            {renderHighlightedText(para, searchQuery)}
                          </p>

                          {/* Action to connect this specific paragraph */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-2 top-2">
                            <button
                              onClick={() => handleOpenLinkModal(para)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-stone-800 shadow-xs border border-stone-200 dark:border-stone-700 text-[10px] text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50"
                              title="اتصال این پاراگراف به پایگاه دانش"
                            >
                              <LinkIcon className="w-3 h-3" />
                              <span>اتصال این بند</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Link to Knowledge Modal */}
      {isLinkModalOpen && currentPage && (
        <LinkToKnowledgeModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          onSuccess={() => {
            onLinkSuccess?.();
            // Refresh current doc
            getPdfDocumentBySourceId(source.id).then((doc) => {
              if (doc) setPdfDoc(doc);
            });
          }}
          payload={{
            sourceId: source.id,
            sourceTitle: source.title,
            standardNumber: source.standardNumber,
            doi: source.doi,
            isbn: source.isbn,
            pageNumber: currentPage.pageNumber,
            sectionHeading: currentPage.sectionHeading,
            selectedQuote: selectedExcerpt,
            isOcr: currentPage.isOcr
          }}
        />
      )}
    </div>
  );
};
