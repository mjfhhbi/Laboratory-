import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  Camera, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Eye, 
  BookOpen, 
  FileUp, 
  Hash,
  Clock,
  Layers,
  CheckCircle
} from 'lucide-react';
import { StoredPdfDocument, PdfSearchMatch, UnifiedScientificSource } from '../../types/scientificSource';
import { getAllStoredPdfs, searchAcrossAllPdfs } from '../../lib/storage/pdfDocumentStorage';
import { getAllUnifiedSources } from '../../lib/storage/scientificSourcesStorage';

interface PdfExplorerViewProps {
  onOpenPdfReader: (source: UnifiedScientificSource, pageNumber?: number) => void;
  onAddNewSourceWithPdf: () => void;
}

export const PdfExplorerView: React.FC<PdfExplorerViewProps> = ({
  onOpenPdfReader,
  onAddNewSourceWithPdf
}) => {
  const [pdfs, setPdfs] = useState<StoredPdfDocument[]>([]);
  const [sources, setSources] = useState<UnifiedScientificSource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PdfSearchMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'digital' | 'scanned_ocr'>('all');

  const loadData = async () => {
    const allPdfs = await getAllStoredPdfs();
    const allSources = await getAllUnifiedSources();
    setPdfs(allPdfs);
    setSources(allSources);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const matches = await searchAcrossAllPdfs(q);
      setSearchResults(matches);
    } catch (err) {
      console.error('Failed to search across PDFs:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredPdfs = pdfs.filter((p) => {
    if (activeFilter === 'digital') return !p.meta.isScanned;
    if (activeFilter === 'scanned_ocr') return p.meta.isScanned;
    return true;
  });

  const getSourceForPdf = (sourceId: string): UnifiedScientificSource | undefined => {
    return sources.find((s) => s.id === sourceId);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Bar */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              جستجوی یکپارچه درون‌متنی اسناد PDF و مراجع علمی
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              جستجو در میان تمام صفحات متون دیجیتال و نتایج نویسه‌خوان (OCR)
            </p>
          </div>

          <button
            onClick={onAddNewSourceWithPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
          >
            <FileUp className="w-4 h-4" />
            <span>آپلود و ثبت PDF جدید</span>
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="جستجوی همزمان در کل صفحات PDFها (مثلاً: دورنیک، ۷۲ درجه، آلکالین فسفاتاز، ژئوباسیلوس)..."
            className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden text-stone-900 dark:text-stone-100"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              همه اسناد ({pdfs.length})
            </button>
            <button
              onClick={() => setActiveFilter('digital')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeFilter === 'digital'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              متن دیجیتال ({pdfs.filter((p) => !p.meta.isScanned).length})
            </button>
            <button
              onClick={() => setActiveFilter('scanned_ocr')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeFilter === 'scanned_ocr'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              اسکن‌شده OCR ({pdfs.filter((p) => p.meta.isScanned).length})
            </button>
          </div>

          {searchQuery.trim() && (
            <span className="text-[11px] text-stone-500">
              {searchResults.length} صفحه منطبق با عبارت «{searchQuery}»
            </span>
          )}
        </div>
      </div>

      {/* If search query is active, show search results */}
      {searchQuery.trim() ? (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
            صفحات و پاراگراف‌های حاوی «{searchQuery}»:
          </h4>

          {searchResults.length > 0 ? (
            searchResults.map((match, idx) => {
              const matchedSrc = getSourceForPdf(match.sourceId);
              return (
                <div
                  key={idx}
                  className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs text-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {match.sourceTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        صفحه {match.pageNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 font-medium">
                        {match.matchCount} بار تکرار
                      </span>
                      {match.isOcr && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                          <Camera className="w-3 h-3" />
                          <span>استخراج از تصویر OCR</span>
                        </span>
                      )}
                    </div>

                    {matchedSrc && (
                      <button
                        onClick={() => onOpenPdfReader(matchedSrc, match.pageNumber)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>مشاهده صفحه {match.pageNumber}</span>
                      </button>
                    )}
                  </div>

                  {match.sectionHeading && (
                    <span className="block text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      سرفصل: {match.sectionHeading}
                    </span>
                  )}

                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/40 p-3 rounded-xl border border-stone-200/60 dark:border-stone-800">
                    {match.snippet}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs text-stone-400">
              موردی منطبق با این کلیدواژه در هیچ‌یک از اسناد PDF یافت نشد.
            </div>
          )}
        </div>
      ) : (
        /* PDF Library Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPdfs.map((pdf) => {
            const src = getSourceForPdf(pdf.sourceId);
            return (
              <div
                key={pdf.id}
                className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-900">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                          {pdf.meta.title || pdf.fileName}
                        </h4>
                        <span className="text-[10px] font-mono text-stone-400" dir="ltr">
                          {pdf.fileName}
                        </span>
                      </div>
                    </div>

                    {pdf.meta.isScanned ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800 shrink-0">
                        <Camera className="w-3 h-3" />
                        <span>اسکن تصویری (OCR)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 shrink-0">
                        <CheckCircle className="w-3 h-3" />
                        <span>دیجیتال</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed my-2">
                    {pdf.pages[0]?.text.slice(0, 120)}...
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] my-3 py-2 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/60 dark:border-stone-800 font-mono">
                    <div>
                      <span className="text-stone-400 block">صفحات</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{pdf.meta.pageCount} صفحه</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">حجم فایل</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{pdf.meta.fileSizeFormatted}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">چانک‌های RAG</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{pdf.ragChunks.length} قطعه</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 mt-2">
                  <span className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>آپلود: {pdf.meta.creationDate || '1402/10'}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {src ? (
                      <button
                        onClick={() => onOpenPdfReader(src)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>مطالعه و جستجو</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-stone-400">سند مستقیم</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
