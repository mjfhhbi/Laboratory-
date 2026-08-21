import React, { useEffect, useState } from 'react';
import {
  ScientificSource,
  KnowledgeBaseRecord,
  SourceReliabilityGrade
} from '../../types/knowledgeBase';
import { getAllKnowledgeRecords } from '../../lib/storage/knowledgeBase';
import {
  X,
  BookOpen,
  ShieldCheck,
  ExternalLink,
  Layers,
  Calendar,
  Building,
  User,
  Hash,
  Link,
  Edit2,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface SourceDetailModalProps {
  source: ScientificSource | null;
  onClose: () => void;
  onSelectRecord?: (record: KnowledgeBaseRecord) => void;
  onEdit?: (source: ScientificSource) => void;
  onDelete?: (source: ScientificSource) => void;
}

const RELIABILITY_GRADE_MAP: Record<
  SourceReliabilityGrade,
  { label: string; desc: string; badgeColor: string }
> = {
  A_official_standard: {
    label: 'درجه A — استاندارد رسمی مصوب',
    desc: 'مستند قانونی صادرشده توسط سازمان ملی استاندارد (INSO)، کدکس (Codex) یا ISO با بالاترین درجه اعتبار حقوقی',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
  },
  B_peer_reviewed_journal: {
    label: 'درجه B — ژورنال علمی داوری‌شده معتبر',
    desc: 'مقاله پژوهشی منتشرشده در نشریات بین‌المللی ISI یا مجلات علمی پژوهشی معتبر صنایع غذایی با فرآیند Peer Review',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
  },
  C_academic_textbook: {
    label: 'درجه C — کتاب مرجع دانشگاهی معتبر',
    desc: 'کتاب مرجع تالیف اساتید برجسته علوم و مهندسی مواد غذایی دارای شابک (ISBN) معتبر بین‌المللی',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
  },
  D_technical_bulletin: {
    label: 'درجه D — بولتن فنی صنعتی معتبر',
    desc: 'دستورالعمل فنی ارائه‌شده توسط شرکت‌های معتبر تولیدکننده مواد اولیه و تجهیزات',
    badgeColor: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700'
  }
};

export const SourceDetailModal: React.FC<SourceDetailModalProps> = ({
  source,
  onClose,
  onSelectRecord,
  onEdit,
  onDelete
}) => {
  const [referencingRecords, setReferencingRecords] = useState<KnowledgeBaseRecord[]>([]);

  useEffect(() => {
    if (!source) return;
    getAllKnowledgeRecords().then((records) => {
      const matching = records.filter((r) => r.sources?.some((s) => s.sourceId === source.id));
      setReferencingRecords(matching);
    });
  }, [source]);

  if (!source) return null;

  const reliability = RELIABILITY_GRADE_MAP[source.reliabilityGrade] || RELIABILITY_GRADE_MAP.B_peer_reviewed_journal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 flex items-start justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${reliability.badgeColor}`}>
                {reliability.label}
              </span>

              {source.codeOrIdentifier && (
                <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono text-xs font-bold" dir="ltr">
                  {source.codeOrIdentifier}
                </span>
              )}
            </div>

            <h2 className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
              {source.title}
            </h2>

            {source.englishTitle && (
              <div className="text-xs font-mono text-stone-400 dark:text-stone-500" dir="ltr">
                {source.englishTitle}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors shrink-0"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {/* Reliability Note */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300">
            <div className="font-bold text-stone-800 dark:text-stone-200 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>دامنه اعتبار علمی منبع:</span>
            </div>
            <p className="text-[11px] leading-relaxed">{reliability.desc}</p>
          </div>

          {/* Bibliographic Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 space-y-1">
              <div className="text-stone-400 text-[10px] font-bold uppercase flex items-center gap-1">
                <Building className="w-3 h-3" />
                <span>سازمان ناظر / ناشر علمی</span>
              </div>
              <div className="font-bold text-stone-900 dark:text-stone-100">
                {source.organizationOrPublisher}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 space-y-1">
              <div className="text-stone-400 text-[10px] font-bold uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>سال انتشار / ویرایش</span>
              </div>
              <div className="font-bold text-stone-900 dark:text-stone-100">
                {source.yearOrEdition}
              </div>
            </div>

            {source.authors && source.authors.length > 0 && (
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 space-y-1 sm:col-span-2">
                <div className="text-stone-400 text-[10px] font-bold uppercase flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>پدیدآورندگان / نویسندگان</span>
                </div>
                <div className="font-semibold text-stone-900 dark:text-stone-100">
                  {source.authors.join('، ')}
                </div>
              </div>
            )}

            {source.urlOrAccessLink && (
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 space-y-1 sm:col-span-2">
                <div className="text-stone-400 text-[10px] font-bold uppercase flex items-center gap-1">
                  <Link className="w-3 h-3" />
                  <span>پیوند دسترسی دیجیتال (URL / DOI)</span>
                </div>
                <a
                  href={source.urlOrAccessLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-emerald-700 dark:text-emerald-400 hover:underline break-all inline-flex items-center gap-1 text-[11px]"
                  dir="ltr"
                >
                  <span>{source.urlOrAccessLink}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          {source.description && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-stone-400 uppercase">توضیحات و دامنه منبع</h4>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed p-3 rounded-xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800">
                {source.description}
              </p>
            </div>
          )}

          {/* Connected Knowledge Records */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-400 uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>رکوردهای علمی متصل به این منبع ({referencingRecords.length})</span>
            </h4>

            {referencingRecords.length > 0 ? (
              <div className="space-y-2">
                {referencingRecords.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      if (onSelectRecord) {
                        onClose();
                        onSelectRecord(rec);
                      }
                    }}
                    className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 bg-stone-50 dark:bg-stone-950/30 hover:bg-white dark:hover:bg-stone-900 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold text-stone-900 dark:text-stone-100 truncate">
                        {rec.title}
                      </div>
                      <div className="text-[11px] text-stone-500 line-clamp-1">
                        {rec.summary}
                      </div>
                    </div>

                    <span className="px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] shrink-0">
                      مشاهده رکورد
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 text-center text-xs text-stone-400">
                هنوز هیچ رکوردی در پایگاه دانش به این منبع ارجاع نداده است.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(source);
                }}
                className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-xs inline-flex items-center gap-1"
                title="حذف منبع"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">حذف</span>
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(source);
                }}
                className="p-2 text-stone-600 hover:text-stone-900 dark:text-stone-300 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-xs inline-flex items-center gap-1 font-medium"
                title="ویرایش منبع"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">ویرایش</span>
              </button>
            )}
          </div>

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
  );
};
