import React, { useState, useEffect } from 'react';
import {
  KnowledgeBaseRecord,
  ScientificSource,
  KNOWLEDGE_CATEGORIES_META
} from '../../types/knowledgeBase';
import { getSourceById } from '../../lib/storage/knowledgeBase';
import { UnverifiedWarningBanner } from './UnverifiedWarningBanner';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  Tag,
  ExternalLink,
  Calendar,
  Layers,
  Sliders,
  FileCode,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface KnowledgeRecordDetailModalProps {
  record: KnowledgeBaseRecord | null;
  onClose: () => void;
  onSelectSource?: (sourceId: string) => void;
  onEdit?: (record: KnowledgeBaseRecord) => void;
}

export const KnowledgeRecordDetailModal: React.FC<KnowledgeRecordDetailModalProps> = ({
  record,
  onClose,
  onSelectSource,
  onEdit
}) => {
  const [sourcesMap, setSourcesMap] = useState<Record<string, ScientificSource>>({});
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    if (!record || !record.sources) return;
    const fetchSources = async () => {
      const map: Record<string, ScientificSource> = {};
      for (const citation of record.sources) {
        if (!map[citation.sourceId]) {
          const src = await getSourceById(citation.sourceId);
          if (src) {
            map[citation.sourceId] = src;
          }
        }
      }
      setSourcesMap(map);
    };
    fetchSources();
  }, [record]);

  if (!record) return null;

  const categoryMeta = KNOWLEDGE_CATEGORIES_META[record.category] || {
    id: record.category,
    titleFa: record.category,
    titleEn: record.category,
    accentColor: 'emerald'
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(record, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      // ignore
    }
  };

  const isVerified =
    record.verificationStatus === 'official_regulatory' ||
    (record.verificationStatus === 'verified_with_source' && record.sources?.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 flex items-start justify-between gap-3 shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800/60">
                {categoryMeta.titleFa}
              </span>

              {record.codeOrIdentifier && (
                <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono text-xs font-bold" dir="ltr">
                  {record.codeOrIdentifier}
                </span>
              )}

              {record.verificationStatus === 'official_regulatory' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>استاندارد رسمی</span>
                </span>
              ) : isVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>دارای منبع مستند</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-300 dark:border-rose-800">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>در انتظار بازبینی</span>
                </span>
              )}
            </div>

            <h2 className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
              {record.title}
            </h2>

            {record.englishTitle && (
              <div className="text-xs font-mono text-stone-400 dark:text-stone-500" dir="ltr">
                {record.englishTitle}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyJson}
              className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
              title="کپی ساختار JSON رکورد"
            >
              {copiedJson ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <FileCode className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
              aria-label="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {/* Unverified Warning if applicable */}
          <UnverifiedWarningBanner
            status={record.verificationStatus}
            sourcesCount={record.sources?.length || 0}
          />

          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800">
            <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase mb-1">
              خلاصه و اهداف علمی
            </h4>
            <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
              {record.summary}
            </p>
          </div>

          {/* Main Markdown Detailed Content */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase mb-2">
              متن کامل و الزامات فنی
            </h4>
            <div className="prose prose-stone dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
              <div className="markdown-body">
                <ReactMarkdown>{record.content}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Parameters Table if available */}
          {record.parameters && record.parameters.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>پارامترها و حدود مجاز اندازه‌گیری ({record.parameters.length})</span>
              </h4>

              <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-700">
                    <tr>
                      <th className="p-3">پارامتر</th>
                      <th className="p-3">مقدار / حد مجاز</th>
                      <th className="p-3">واحد</th>
                      <th className="p-3">رواداری (Tolerance)</th>
                      <th className="p-3">روش آزمون مرجع</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {record.parameters.map((param, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                        <td className="p-3 font-medium text-stone-900 dark:text-stone-100">
                          <div>{param.label}</div>
                          {param.englishLabel && (
                            <div className="text-[10px] font-mono text-stone-400" dir="ltr">
                              {param.englishLabel}
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400" dir="ltr">
                          {param.value}
                        </td>
                        <td className="p-3 text-stone-600 dark:text-stone-400">
                          {param.unit || '-'}
                        </td>
                        <td className="p-3 font-mono text-stone-500" dir="ltr">
                          {param.tolerance || '-'}
                        </td>
                        <td className="p-3 text-stone-600 dark:text-stone-300 font-mono text-[11px]">
                          {param.testMethodRef || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Scientific Sources & Citations Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>منابع علمی متصل و ارجاعات مستند ({record.sources?.length || 0})</span>
            </h4>

            {record.sources && record.sources.length > 0 ? (
              <div className="space-y-2.5">
                {record.sources.map((citation, idx) => {
                  const source = sourcesMap[citation.sourceId];

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                            {source ? source.title : citation.sourceTitle || `شناسه منبع: ${citation.sourceId}`}
                          </span>
                          {source?.codeOrIdentifier && (
                            <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-[10px]">
                              {source.codeOrIdentifier}
                            </span>
                          )}
                        </div>

                        {source && (
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2 flex-wrap">
                            <span>ناشر/مرجع: <strong>{source.organizationOrPublisher}</strong></span>
                            <span>•</span>
                            <span>سال: {source.yearOrEdition}</span>
                            {source.authors && source.authors.length > 0 && (
                              <>
                                <span>•</span>
                                <span>نویسندگان: {source.authors.join('، ')}</span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Citation Location details */}
                        <div className="flex items-center gap-2 text-[11px] text-emerald-800 dark:text-emerald-300 pt-1 flex-wrap">
                          {citation.sectionOrChapter && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
                              {citation.sectionOrChapter}
                            </span>
                          )}
                          {citation.pageNumber && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
                              {citation.pageNumber}
                            </span>
                          )}
                          {citation.tableOrFigure && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
                              {citation.tableOrFigure}
                            </span>
                          )}
                        </div>

                        {citation.directQuoteOrExcerpt && (
                          <p className="text-[11px] text-stone-600 dark:text-stone-400 italic pt-1 border-r-2 border-emerald-500 pr-2 mt-1">
                            «{citation.directQuoteOrExcerpt}»
                          </p>
                        )}
                      </div>

                      {onSelectSource && (
                        <button
                          type="button"
                          onClick={() => onSelectSource(citation.sourceId)}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold shrink-0 inline-flex items-center gap-1.5 self-start sm:self-center transition-colors"
                        >
                          <span>مشاهده مشخصات کامل منبع</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 text-center text-xs text-stone-400">
                هیچ منبع علمی برای این رکورد ثبت نشده است.
              </div>
            )}
          </div>

          {/* Tags & Applicable Food Categories */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-stone-100 dark:border-stone-800">
            {record.applicableFoodCategories && record.applicableFoodCategories.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-stone-400 uppercase">گروه‌های غذایی تحت پوشش:</div>
                <div className="flex flex-wrap gap-1.5">
                  {record.applicableFoodCategories.map((fc, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px]">
                      {fc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {record.tags && record.tags.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-stone-400 uppercase">برچسب‌ها:</div>
                <div className="flex flex-wrap gap-1.5">
                  {record.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 flex items-center justify-between gap-3 text-[11px] text-stone-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>تاریخ به‌روزرسانی: {new Date(record.metadata.updatedAt).toLocaleDateString('fa-IR')}</span>
            <span>•</span>
            <span>نسخه شِما: {record.metadata.schemaVersion}</span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(record);
                }}
                className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-semibold"
              >
                ویرایش اطلاعات
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold hover:bg-stone-800 transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
