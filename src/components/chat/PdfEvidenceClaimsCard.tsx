import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  GitCompare, 
  Info, 
  ChevronDown, 
  ChevronUp,
  Table,
  Gauge,
  HelpCircle,
  Quote
} from 'lucide-react';
import { PdfAnalysisResult, ExtractedClaimWithEvidence, EvidenceType } from '../../lib/pdfAnalysis/types';

interface PdfEvidenceClaimsCardProps {
  analysisResult: PdfAnalysisResult;
  onOpenPdfReader?: (docId: string, pageNumber?: number) => void;
}

export const PdfEvidenceClaimsCard: React.FC<PdfEvidenceClaimsCardProps> = ({
  analysisResult,
  onOpenPdfReader
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<EvidenceType | 'all'>('all');

  const {
    actionType,
    analyzedDocuments,
    claims,
    parametersFound,
    tablesFound,
    notMentionedInDocument,
    comparativeAspects
  } = analysisResult;

  const filteredClaims = selectedFilter === 'all'
    ? claims
    : claims.filter((c) => c.evidenceType === selectedFilter);

  const getEvidenceTypeBadge = (type: EvidenceType) => {
    switch (type) {
      case 'direct_quote':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 text-[10px] font-medium border border-purple-200 dark:border-purple-800">
            <Quote className="w-2.5 h-2.5" />
            <span>نقل‌قول مستقیم (Direct Quote)</span>
          </span>
        );
      case 'table_data':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-[10px] font-medium border border-blue-200 dark:border-blue-800">
            <Table className="w-2.5 h-2.5" />
            <span>داده جدول (Table Data)</span>
          </span>
        );
      case 'numerical_parameter':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-medium border border-amber-200 dark:border-amber-800">
            <Gauge className="w-2.5 h-2.5" />
            <span>پارامتر عددی (Numerical Parameter)</span>
          </span>
        );
      case 'inferred_summary':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-medium border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>خلاصه‌سازی استنتاجی (Inferred Summary)</span>
          </span>
        );
    }
  };

  return (
    <div className="mt-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10 overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-50/60 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-2xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                شواهد و استنادات استخراج‌شده از سند PDF (Evidence Attribution)
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                {claims.length} گزاره مستند
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              استخراج مستقیم با تفکیک Source، شماره Page و نوع Evidence
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          title={isExpanded ? 'بستن پنل شواهد' : 'گسترش پنل شواهد'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 text-xs">
          {/* Analyzed documents pills */}
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
            <span className="text-stone-500 text-[11px] font-medium">سند مرجع:</span>
            {analyzedDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenPdfReader?.(doc.id, 1)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 cursor-pointer shadow-2xs transition-all text-xs"
                title="کلیک جهت مشاهده و مطالعه متن کامل سند"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-stone-800 dark:text-stone-200">{doc.title}</span>
                <span className="text-[10px] text-stone-400 font-mono">({doc.pageCount} صفحه)</span>
                {doc.isScanned && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    OCR
                  </span>
                )}
                <ExternalLink className="w-3 h-3 text-stone-400 mr-0.5" />
              </div>
            ))}
          </div>

          {/* Not Mentioned in Document Alert Box */}
          {notMentionedInDocument && notMentionedInDocument.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>اصل عدم حدس و صداقت علمی: موارد ناموجود در فایل PDF</span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed pr-5">
                موتور هوش مصنوعی به هیچ وجه داده‌ای فرضی به سند نسبت نداده است. موارد زیر در متن این سند قید نگردیده است:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] pr-5 font-mono text-amber-900 dark:text-amber-200">
                {notMentionedInDocument.map((item, idx) => (
                  <li key={idx} className="line-clamp-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Comparative Matrix (if comparison action was performed) */}
          {comparativeAspects && comparativeAspects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100 text-xs">
                <GitCompare className="w-4 h-4 text-emerald-600" />
                <span>ماتریس تطبیقی مقایسه دو سند / دو روش آزمایش:</span>
              </div>
              <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-stone-700">
                    <tr>
                      <th className="p-2.5">محور مقایسه</th>
                      <th className="p-2.5">{analyzedDocuments[0]?.title || 'سند ۱'}</th>
                      <th className="p-2.5">{analyzedDocuments[1]?.title || 'سند ۲'}</th>
                      <th className="p-2.5">وضعیت تطابق / تفاوت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900">
                    {comparativeAspects.map((asp, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                        <td className="p-2.5 font-bold text-stone-900 dark:text-stone-100">{asp.aspect}</td>
                        <td className="p-2.5 text-stone-700 dark:text-stone-300">{asp.doc1Finding}</td>
                        <td className="p-2.5 text-stone-700 dark:text-stone-300">{asp.doc2Finding}</td>
                        <td className="p-2.5">
                          {asp.agreementStatus === 'discrepancy' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold text-[10px]">
                              ⚠️ اختلاف رویکرد
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                              ✓ انطباق کامل
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Extracted Parameters (if available) */}
          {parametersFound && parametersFound.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-amber-600" />
                <span>پارامترها و حدود عددی استخراج‌شده:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {parametersFound.map((p, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/60 text-xs shadow-2xs"
                  >
                    <span className="font-medium text-stone-600 dark:text-stone-400">{p.name}:</span>
                    <span className="font-bold font-mono text-amber-800 dark:text-amber-300" dir="ltr">
                      {p.value} {p.unit || ''}
                    </span>
                    {p.isLimit && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        حد قانونی
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Filter Tabs */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto custom-scrollbar">
            <span className="text-stone-400 text-[10px] font-medium shrink-0">فیلتر ادعاها:</span>
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              همه ({claims.length})
            </button>
            <button
              onClick={() => setSelectedFilter('direct_quote')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                selectedFilter === 'direct_quote'
                  ? 'bg-purple-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              نقل‌قول مستقیم
            </button>
            <button
              onClick={() => setSelectedFilter('table_data')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                selectedFilter === 'table_data'
                  ? 'bg-blue-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              داده‌های جدول
            </button>
            <button
              onClick={() => setSelectedFilter('numerical_parameter')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                selectedFilter === 'numerical_parameter'
                  ? 'bg-amber-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              پارامترهای عددی
            </button>
          </div>

          {/* List of Claims with Source, Page and Evidence Type */}
          <div className="space-y-2">
            {filteredClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-400 transition-colors shadow-2xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    {/* Source Title */}
                    <span className="font-bold text-[11px] text-stone-800 dark:text-stone-200">
                      {claim.sourceTitle}
                    </span>

                    {/* Page badge */}
                    <button
                      type="button"
                      onClick={() => onOpenPdfReader?.(claim.sourceDocId, claim.pageNumber)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold font-mono text-[10px] hover:bg-emerald-100 transition-colors cursor-pointer"
                      title="مشاهده این صفحه در کتاب‌خوان سند"
                    >
                      <Layers className="w-2.5 h-2.5" />
                      <span>صفحه {claim.pageNumber}</span>
                      {claim.sectionHeading && <span>({claim.sectionHeading})</span>}
                    </button>
                  </div>

                  {/* Evidence Type */}
                  <div>{getEvidenceTypeBadge(claim.evidenceType)}</div>
                </div>

                {/* Claim Statement */}
                <p className="text-stone-700 dark:text-stone-300 text-xs leading-relaxed">
                  {claim.claimText}
                </p>
              </div>
            ))}
          </div>

          {/* Scientific Separation Footer Notice */}
          <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 text-[11px] text-stone-500 dark:text-stone-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>تفکیک علمی استاندارد:</strong> بخش فوق، استخراج داده‌های قطعی از صفحات سند است. هرگونه توضیحات عمومی، مکانیزم‌های واکنشی یا پیشنهادات تکمیلی هوش مصنوعی در بدنه پیام به عنوان «دانش عمومی صنایع غذایی» تفکیک شده است.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
