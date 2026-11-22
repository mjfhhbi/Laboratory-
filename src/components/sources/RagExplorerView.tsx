import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Database, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  Download,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { RagDocumentChunk } from '../../types/scientificSource';
import { searchRagChunks, getAllStoredPdfs } from '../../lib/storage/pdfDocumentStorage';

export const RagExplorerView: React.FC = () => {
  const [query, setQuery] = useState('دمای پاستوریزاسیون شیر و آزمون فسفاتاز');
  const [results, setResults] = useState<Array<{ chunk: RagDocumentChunk; score: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [totalChunksCount, setTotalChunksCount] = useState(0);
  const [copiedChunkId, setCopiedChunkId] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const loadAllChunksCount = async () => {
    const pdfs = await getAllStoredPdfs();
    let count = 0;
    for (const p of pdfs) {
      count += p.ragChunks.length;
    }
    setTotalChunksCount(count);
  };

  const handleSearch = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchRagChunks(q);
      setResults(res);
    } catch (err) {
      console.error('Failed to search RAG chunks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllChunksCount();
    handleSearch(query);
  }, []);

  const handleCopyChunk = (chunk: RagDocumentChunk) => {
    const text = `[منبع: ${chunk.sourceTitle} | صفحه ${chunk.pageNumber} | سرفصل: ${chunk.sectionHeading || '—'}]\n${chunk.text}`;
    navigator.clipboard.writeText(text);
    setCopiedChunkId(chunk.id);
    setTimeout(() => setCopiedChunkId(null), 2000);
  };

  const handleCopyPromptGrounding = () => {
    const context = results
      .slice(0, 4)
      .map(
        (r, i) =>
          `[مستند ${i + 1}]:\nمنبع: ${r.chunk.sourceTitle}\nصفحه: ${r.chunk.pageNumber}\nمحتوا: ${r.chunk.text}`
      )
      .join('\n\n');

    const promptText = `شما یک مشاور ارشد و متخصص علوم و صنایع غذایی و کنترل کیفیت آزمایشگاهی هستید. لطفاً بر اساس مراجع معتبر زیر، به پرسش علمی پاسخ دهید:\n\n### مستندات مرجع (Grounding Context):\n${context}\n\n### پرسش کاربر:\n${query}`;

    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleExportJson = async () => {
    const pdfs = await getAllStoredPdfs();
    const allChunks: RagDocumentChunk[] = [];
    for (const p of pdfs) {
      allChunks.push(...p.ragChunks);
    }
    const jsonStr = JSON.stringify(allChunks, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-science-rag-chunks-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Info */}
      <div className="p-5 rounded-2xl bg-stone-900 text-stone-100 dark:bg-stone-950 border border-stone-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold">
                آمادگی معماری بازیابی دانش (RAG - Retrieval-Augmented Generation)
              </h3>
            </div>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              تمام صفحات اسناد PDF، استانداردها و مقالات به قطعات معنایی (Chunks) همراه با شماره دقیق صفحه و عنوان مأخذ تبدیل شده‌اند. این زیرساخت امکان ارجاع بدون توهم مدل زبانی (LLM Hallucination-free Grounding) را فراهم می‌آورد.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>خروجی JSON برداری</span>
            </button>
            <div className="px-3 py-2 rounded-xl bg-stone-800/80 border border-stone-700 text-center">
              <span className="block text-[10px] text-stone-400">کل چانک‌های آماده</span>
              <span className="font-bold text-emerald-400 font-mono text-xs">{totalChunksCount} قطعه</span>
            </div>
          </div>
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
          پرسش تخصصی یا جستجوی معنایی در منابع علمی و PDFها:
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="مثلاً: دمای پاستوریزاسیون شیر، روش آزمون اسیدیته دورنیک، صحه‌گذاری اتوکلاو..."
              className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden text-stone-900 dark:text-stone-100"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>

          <button
            onClick={() => handleSearch(query)}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors disabled:opacity-50"
          >
            {loading ? 'در حال بازیابی...' : 'بازیابی چانک‌ها'}
          </button>
        </div>

        {/* Preset Query Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-stone-400 text-[10px]">نمونه‌های تست RAG:</span>
          {[
            'دمای پاستوریزاسیون شیر و آزمون فسفاتاز',
            'روش تیتراسیون اسیدیته دورنیک',
            'شرایط استریل‌سازی اتوکلاو با شاخص بیولوژیک ژئوباسیلوس',
            'حدود مجاز اسیدیته و پ‌هاش در استاندارد ۲۴۰۶'
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(preset);
                handleSearch(preset);
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header with Prompt Copy */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
            قطعات متنی بازیابی‌شده (Retrieved Context Chunks)
          </h4>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {results.length} قطعه منطبق
          </span>
        </div>

        {results.length > 0 && (
          <button
            onClick={handleCopyPromptGrounding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">پرامپت استناد کپی شد</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>کپی کانتکست جهت Prompt مهندسی</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Chunks List */}
      <div className="space-y-3">
        {results.length > 0 ? (
          results.map(({ chunk, score }) => (
            <div
              key={chunk.id}
              className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs text-xs space-y-2 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {chunk.sourceTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    صفحه {chunk.pageNumber}
                  </span>
                  {chunk.standardNumber && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                      {chunk.standardNumber}
                    </span>
                  )}
                  {chunk.isOcr ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>{chunk.isVerified ? 'OCR بازبینی‌شده' : 'استخراج تصویر (OCR بازبینی‌نشده)'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>متن معتبر رسمی</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-stone-400">
                    امتیاز: {score} | ~{chunk.tokenCountEstimate} توکن
                  </span>
                  <button
                    onClick={() => handleCopyChunk(chunk)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="کپی متن چانک همراه با مأخذ و شماره صفحه"
                  >
                    {copiedChunkId === chunk.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {chunk.sectionHeading && (
                <span className="block text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  سرفصل: {chunk.sectionHeading}
                </span>
              )}

              <p className="text-stone-800 dark:text-stone-200 leading-relaxed bg-stone-50 dark:bg-stone-800/40 p-3 rounded-xl border border-stone-200/60 dark:border-stone-800">
                {chunk.text}
              </p>

              {chunk.tags && chunk.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {chunk.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.2 bg-stone-100 dark:bg-stone-800 rounded text-[9px] text-stone-500"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs text-stone-400">
            هیچ چانک متنی برای عبارت مورد نظر یافت نشد. می‌توانید از نمونه‌های بالا استفاده نمایید.
          </div>
        )}
      </div>
    </div>
  );
};
