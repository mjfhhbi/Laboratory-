import React from 'react';
import {
  KnowledgeBaseRecord,
  KNOWLEDGE_CATEGORIES_META
} from '../../types/knowledgeBase';
import {
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  Tag,
  Layers,
  ChevronLeft,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  Sliders
} from 'lucide-react';

interface KnowledgeRecordCardProps {
  record: KnowledgeBaseRecord;
  onViewDetails: (record: KnowledgeBaseRecord) => void;
  onEdit?: (record: KnowledgeBaseRecord) => void;
  onDelete?: (record: KnowledgeBaseRecord) => void;
}

export const KnowledgeRecordCard: React.FC<KnowledgeRecordCardProps> = ({
  record,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const categoryMeta = KNOWLEDGE_CATEGORIES_META[record.category] || {
    id: record.category,
    titleFa: record.category,
    titleEn: record.category,
    accentColor: 'emerald'
  };

  const sourcesCount = record.sources?.length || 0;
  const isVerified =
    record.verificationStatus === 'official_regulatory' ||
    (record.verificationStatus === 'verified_with_source' && sourcesCount > 0);

  return (
    <div
      onClick={() => onViewDetails(record)}
      className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Category Chip */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-[11px] border border-stone-200 dark:border-stone-700">
              {categoryMeta.titleFa}
            </span>

            {record.codeOrIdentifier && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/60" dir="ltr">
                {record.codeOrIdentifier}
              </span>
            )}
          </div>

          {/* Verification Status Badge */}
          <div>
            {record.verificationStatus === 'official_regulatory' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800/60">
                <ShieldCheck className="w-3 h-3 text-amber-600" />
                <span>استاندارد رسمی</span>
              </span>
            ) : isVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/60">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>دارای منبع مستند</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-[10px] font-bold border border-rose-200 dark:border-rose-800/60">
                <ShieldAlert className="w-3 h-3 text-rose-500" />
                <span>در انتظار بازبینی</span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1">
          {record.title}
        </h3>

        {record.englishTitle && (
          <div className="text-[11px] font-mono text-stone-400 dark:text-stone-500 line-clamp-1 mb-2" dir="ltr">
            {record.englishTitle}
          </div>
        )}

        {/* Summary Description */}
        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed mb-3">
          {record.summary}
        </p>

        {/* Parameters snippet if any */}
        {record.parameters && record.parameters.length > 0 && (
          <div className="mb-3 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-[11px] space-y-1">
            <div className="text-stone-400 text-[10px] flex items-center gap-1">
              <Sliders className="w-3 h-3" />
              <span>پارامترهای کلیدی ({record.parameters.length}):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {record.parameters.slice(0, 3).map((p, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-[10px]"
                >
                  <strong className="text-stone-900 dark:text-stone-100">{p.label}:</strong> {p.value} {p.unit || ''}
                </span>
              ))}
              {record.parameters.length > 3 && (
                <span className="text-[10px] text-stone-400 self-center">
                  +{record.parameters.length - 3} بیشتر...
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info: Sources count, Tags & Actions */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between gap-2 text-xs">
        {/* Sources linking info */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
              sourcesCount > 0
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-stone-400'
            }`}
            title={`${sourcesCount} منبع علمی به این رکورد متصل است`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{sourcesCount} منبع مرجع</span>
          </span>

          {record.tags && record.tags.length > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-stone-400 text-[11px]">
              <span>•</span>
              <span className="truncate max-w-[140px]">{record.tags.slice(0, 2).join('، ')}</span>
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(record)}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="ویرایش رکورد"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(record)}
              className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="حذف رکورد"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onViewDetails(record)}
            className="p-1.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
          >
            <span>مشاهده</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
