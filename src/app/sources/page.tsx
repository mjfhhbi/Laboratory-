import React, { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  ScientificSource,
  KnowledgeBaseRecord,
  SourceReliabilityGrade
} from '../../types/knowledgeBase';
import {
  getAllSources,
  deleteSource,
  getAllKnowledgeRecords
} from '../../lib/storage/knowledgeBase';
import {
  SourceDetailModal
} from '../../components/knowledge/SourceDetailModal';
import {
  SourceFormModal
} from '../../components/knowledge/SourceFormModal';
import {
  KnowledgeRecordDetailModal
} from '../../components/knowledge/KnowledgeRecordDetailModal';
import {
  BookOpen,
  Search,
  Plus,
  ShieldCheck,
  Building,
  Calendar,
  ExternalLink,
  Layers,
  Trash2,
  Edit2,
  FileCheck2,
  GraduationCap
} from 'lucide-react';

const RELIABILITY_BADGES: Record<SourceReliabilityGrade, { label: string; color: string }> = {
  A_official_standard: {
    label: 'درجه A — استاندارد رسمی',
    color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
  },
  B_peer_reviewed_journal: {
    label: 'درجه B — ژورنال علمی معتبر',
    color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
  },
  C_academic_textbook: {
    label: 'درجه C — کتاب مرجع دانشگاهی',
    color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
  },
  D_technical_bulletin: {
    label: 'درجه D — بولتن فنی صنعتی',
    color: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700'
  }
};

export const SourcesPage: React.FC = () => {
  const [sources, setSources] = useState<ScientificSource[]>([]);
  const [allRecords, setAllRecords] = useState<KnowledgeBaseRecord[]>([]);
  const [query, setQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<SourceReliabilityGrade | 'all'>('all');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedSource, setSelectedSource] = useState<ScientificSource | null>(null);
  const [editingSource, setEditingSource] = useState<ScientificSource | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<KnowledgeBaseRecord | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [srcList, recList] = await Promise.all([
        getAllSources(),
        getAllKnowledgeRecords()
      ]);
      setSources(srcList);
      setAllRecords(recList);
    } catch (err) {
      console.error('Failed to load scientific sources:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredSources = sources.filter((s) => {
    if (gradeFilter !== 'all' && s.reliabilityGrade !== gradeFilter) {
      return false;
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchEn = s.englishTitle ? s.englishTitle.toLowerCase().includes(q) : false;
      const matchPub = s.organizationOrPublisher.toLowerCase().includes(q);
      const matchCode = s.codeOrIdentifier ? s.codeOrIdentifier.toLowerCase().includes(q) : false;
      const matchAuthors = s.authors.some((a) => a.toLowerCase().includes(q));
      if (!matchTitle && !matchEn && !matchPub && !matchCode && !matchAuthors) {
        return false;
      }
    }
    return true;
  });

  const getRecordCountForSource = (sourceId: string) => {
    return allRecords.filter((r) => r.sources?.some((s) => s.sourceId === sourceId)).length;
  };

  const handleDelete = async (source: ScientificSource) => {
    if (window.confirm(`آیا از حذف منبع «${source.title}» اطمینان دارید؟`)) {
      await deleteSource(source.id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="منابع و مراجع علمی معتبر"
        englishTitle="/sources — Scientific Sources & Literature"
        description="بانک کتاب‌شناختی مراجع رسمی، استانداردهای ملی و بین‌المللی، مقالات پژوهشی داوری‌شده و کتاب‌های مرجع صنایع غذایی"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'منابع و مقالات' }
        ]}
      />

      {/* Action and Search Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در نام منبع، ناشر، نویسندگان، DOI یا شماره استاندارد..."
              className="w-full pl-4 pr-10 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingSource(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت منبع علمی جدید</span>
          </button>
        </div>

        {/* Grade Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
          <span className="text-stone-400 text-[11px] font-bold ml-1">فیلتر درجه اعتبار:</span>

          <button
            type="button"
            onClick={() => setGradeFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              gradeFilter === 'all'
                ? 'bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 font-bold'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            همه مراجع ({sources.length})
          </button>

          {(Object.keys(RELIABILITY_BADGES) as SourceReliabilityGrade[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGradeFilter(g)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                gradeFilter === g
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700 font-bold'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
              }`}
            >
              {RELIABILITY_BADGES[g].label}
            </button>
          ))}
        </div>
      </div>

      {/* Sources Grid */}
      <div>
        {loading ? (
          <div className="text-center py-16 text-xs text-stone-500 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
            در حال بارگذاری مراجع علمی از پایگاه محلی...
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 p-8 sm:p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              هیچ منبع مرجعی ثبت نشده است
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              برای ثبت ارجاعات دقیق به استانداردهای ملی (INSO)، مقالات ISI و کتب دانشگاهی، دکمه «ثبت منبع علمی جدید» را انتخاب نمایید.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingSource(null);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن اولین منبع علمی</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSources.map((source) => {
              const badge = RELIABILITY_BADGES[source.reliabilityGrade] || RELIABILITY_BADGES.B_peer_reviewed_journal;
              const recordsCount = getRecordCountForSource(source.id);

              return (
                <div
                  key={source.id}
                  onClick={() => setSelectedSource(source)}
                  className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>

                      {source.codeOrIdentifier && (
                        <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-[10px] font-bold" dir="ltr">
                          {source.codeOrIdentifier}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {source.title}
                    </h3>

                    {source.englishTitle && (
                      <div className="text-[11px] font-mono text-stone-400 line-clamp-1" dir="ltr">
                        {source.englishTitle}
                      </div>
                    )}

                    <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2 flex-wrap pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Building className="w-3 h-3 text-stone-400" />
                        <strong>{source.organizationOrPublisher}</strong>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{source.yearOrEdition}</span>
                      </span>
                    </div>

                    {source.authors && source.authors.length > 0 && (
                      <div className="text-[11px] text-stone-500 line-clamp-1">
                        نویسندگان: {source.authors.join('، ')}
                      </div>
                    )}
                  </div>

                  {/* Footer with linked records and actions */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 text-xs mt-3">
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{recordsCount} رکورد متصل</span>
                    </span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSource(source);
                          setIsFormOpen(true);
                        }}
                        className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="ویرایش منبع"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(source)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        title="حذف منبع"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Source Detail Modal */}
      {selectedSource && (
        <SourceDetailModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
          onSelectRecord={(rec) => setSelectedRecord(rec)}
          onEdit={(src) => {
            setSelectedSource(null);
            setEditingSource(src);
            setIsFormOpen(true);
          }}
          onDelete={(src) => {
            handleDelete(src);
            setSelectedSource(null);
          }}
        />
      )}

      {/* Source Form Modal */}
      <SourceFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSource(null);
        }}
        initialData={editingSource}
        onSaved={() => {
          loadData();
        }}
      />

      {/* Knowledge Record Detail Modal (if navigated from source) */}
      {selectedRecord && (
        <KnowledgeRecordDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onSelectSource={(srcId) => {
            const found = sources.find((s) => s.id === srcId);
            if (found) setSelectedSource(found);
          }}
        />
      )}
    </div>
  );
};

export default SourcesPage;
