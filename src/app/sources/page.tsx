import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { 
  UnifiedScientificSource, 
  ScientificSourceType, 
  ScientificConfidenceLevel,
  ScientificDiscrepancy 
} from '../../types/scientificSource';
import { 
  getAllUnifiedSources, 
  deleteUnifiedSource,
  getAllDiscrepancies,
  saveDiscrepancy 
} from '../../lib/storage/scientificSourcesStorage';
import { UnifiedSourceDetailModal } from '../../components/sources/UnifiedSourceDetailModal';
import { UnifiedSourceFormModal } from '../../components/sources/UnifiedSourceFormModal';
import { PdfExplorerView } from '../../components/sources/PdfExplorerView';
import { RagExplorerView } from '../../components/sources/RagExplorerView';
import { PdfReaderModal } from '../../components/sources/PdfReaderModal';
import { CentralEvidenceHubView } from '../../components/sources/CentralEvidenceHubView';
import {
  BookOpen,
  Search,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Building,
  Calendar,
  ExternalLink,
  Trash2,
  Edit2,
  FileCheck2,
  GraduationCap,
  Globe,
  FileText,
  FileDown,
  Scale,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Bookmark,
  Info,
  Eye,
  Sparkles,
  Database,
  Camera
} from 'lucide-react';

const SOURCE_TYPE_FILTER_OPTIONS: Array<{ value: ScientificSourceType | 'all'; label: string }> = [
  { value: 'all', label: 'همه انواع منابع (۱۲ رده)' },
  { value: 'scientific_paper', label: 'مقاله علمی پژوهشی' },
  { value: 'reference_book', label: 'کتاب مرجع دانشگاهی' },
  { value: 'inso_standard', label: 'استاندارد ملی ایران (INSO)' },
  { value: 'iso_standard', label: 'استاندارد بین‌المللی ISO' },
  { value: 'aoac_method', label: 'روش رسمی AOAC' },
  { value: 'codex_standard', label: 'استاندارد کدکس (Codex)' },
  { value: 'lecture_handout', label: 'جزوه آموزشی و پمفلت' },
  { value: 'lab_file', label: 'فایل و گزارش آزمایشگاهی' },
  { value: 'lab_manual', label: 'راهنمای آزمایشگاهی (SOP/BAM)' },
  { value: 'sds', label: 'برگه ایمنی مواد (SDS)' },
  { value: 'academic_thesis', label: 'پایان‌نامه و رساله' },
  { value: 'official_regulatory', label: 'منبع رسمی سازمانی (IFDA/FDA)' }
];

const CONFIDENCE_FILTER_OPTIONS: Array<{ value: ScientificConfidenceLevel | 'all'; label: string }> = [
  { value: 'all', label: 'همه سطوح اعتبار' },
  { value: 'verified', label: 'تأییدشده رسمی (Verified)' },
  { value: 'source_backed', label: 'دارای منبع معتبر (Source-backed)' },
  { value: 'partially_supported', label: 'پشتیبانی جزئی (Partially supported)' },
  { value: 'unverified', label: 'فاقد منبع قطعی (Unverified)' }
];

export const SourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registry' | 'pdf_explorer' | 'rag_grounding' | 'discrepancies' | 'evidence_hub' | 'charter'>('registry');
  const [sources, setSources] = useState<UnifiedScientificSource[]>([]);
  const [discrepancies, setDiscrepancies] = useState<ScientificDiscrepancy[]>([]);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ScientificSourceType | 'all'>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<ScientificConfidenceLevel | 'all'>('all');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedSource, setSelectedSource] = useState<UnifiedScientificSource | null>(null);
  const [editingSource, setEditingSource] = useState<UnifiedScientificSource | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activePdfReaderSource, setActivePdfReaderSource] = useState<UnifiedScientificSource | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [srcList, discList] = await Promise.all([
        getAllUnifiedSources(),
        getAllDiscrepancies()
      ]);
      setSources(srcList);
      setDiscrepancies(discList);
    } catch (err) {
      console.error('Failed to load scientific sources:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Statistics calculation
  const stats = useMemo(() => {
    const verifiedCount = sources.filter((s) => s.confidenceLevel === 'verified').length;
    const insoCount = sources.filter((s) => s.sourceType === 'inso_standard').length;
    const internationalCount = sources.filter(
      (s) => s.sourceType === 'iso_standard' || s.sourceType === 'aoac_method' || s.sourceType === 'codex_standard'
    ).length;
    const pdfCount = sources.filter((s) => s.hasPdf).length;

    let totalLinks = 0;
    for (const s of sources) {
      if (s.linkedEntities) {
        totalLinks += (s.linkedEntities.testMethodsCount || 0) +
          (s.linkedEntities.formulasCount || 0) +
          (s.linkedEntities.limitsCount || 0) +
          (s.linkedEntities.productsCount || 0);
      }
    }

    return {
      total: sources.length,
      verified: verifiedCount,
      inso: insoCount,
      international: internationalCount,
      discrepancies: discrepancies.length,
      pdfCount,
      totalLinks
    };
  }, [sources, discrepancies]);

  // Filtered sources
  const filteredSources = useMemo(() => {
    return sources.filter((s) => {
      if (typeFilter !== 'all' && s.sourceType !== typeFilter) return false;
      if (confidenceFilter !== 'all' && s.confidenceLevel !== confidenceFilter) return false;

      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchEn = s.englishTitle ? s.englishTitle.toLowerCase().includes(q) : false;
        const matchOrg = s.authorOrOrganization.toLowerCase().includes(q);
        const matchStd = s.standardNumber ? s.standardNumber.toLowerCase().includes(q) : false;
        const matchTags = s.tags ? s.tags.some((t) => t.toLowerCase().includes(q)) : false;
        const matchNotes = s.notes ? s.notes.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchEn && !matchOrg && !matchStd && !matchTags && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [sources, typeFilter, confidenceFilter, query]);

  const handleDeleteSource = async (src: UnifiedScientificSource) => {
    if (!window.confirm(`آیا از حذف منبع «${src.title}» اطمینان دارید؟`)) return;
    try {
      await deleteUnifiedSource(src.id);
      setSources((prev) => prev.filter((s) => s.id !== src.id));
      if (selectedSource?.id === src.id) setSelectedSource(null);
    } catch (err) {
      console.error('Failed to delete source:', err);
    }
  };

  const handleSavedSource = (saved: UnifiedScientificSource) => {
    setSources((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      }
      return [saved, ...prev];
    });
    setSelectedSource(saved);
  };

  const getSourceTypeBadge = (type: ScientificSourceType) => {
    switch (type) {
      case 'inso_standard':
        return { label: 'استاندارد ملی ایران (INSO)', bg: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200' };
      case 'iso_standard':
        return { label: 'استاندارد بین‌المللی ISO', bg: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/70 dark:text-blue-200' };
      case 'aoac_method':
        return { label: 'روش رسمی AOAC', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200' };
      case 'codex_standard':
        return { label: 'کدکس بین‌المللی (Codex)', bg: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/70 dark:text-purple-200' };
      case 'scientific_paper':
        return { label: 'مقاله علمی پژوهشی', bg: 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950/70 dark:text-cyan-200' };
      case 'reference_book':
        return { label: 'کتاب مرجع دانشگاهی', bg: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-200' };
      case 'lecture_handout':
        return { label: 'جزوه آموزشی و پمفلت', bg: 'bg-lime-100 text-lime-900 border-lime-300 dark:bg-lime-950/70 dark:text-lime-200' };
      case 'lab_file':
        return { label: 'فایل و گزارش آزمایشگاهی', bg: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200' };
      case 'lab_manual':
        return { label: 'راهنمای آزمایشگاهی (SOP)', bg: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/70 dark:text-teal-200' };
      case 'sds':
        return { label: 'برگه اطلاعات ایمنی (SDS)', bg: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/70 dark:text-rose-200' };
      case 'academic_thesis':
        return { label: 'رساله و پایان‌نامه', bg: 'bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-950/70 dark:text-violet-200' };
      case 'official_regulatory':
        return { label: 'سازمان غذا و دارو (IFDA)', bg: 'bg-stone-100 text-stone-900 border-stone-300 dark:bg-stone-800 dark:text-stone-200' };
      default:
        return { label: type, bg: 'bg-stone-100 text-stone-800' };
    }
  };

  const getConfidenceBadge = (level: ScientificConfidenceLevel) => {
    switch (level) {
      case 'verified':
        return { label: 'تأییدشده رسمی (Verified)', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300', icon: ShieldCheck };
      case 'source_backed':
        return { label: 'دارای منبع معتبر (Source-backed)', bg: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/70 dark:text-blue-300', icon: ShieldCheck };
      case 'partially_supported':
        return { label: 'پشتیبانی جزئی (Partially supported)', bg: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300', icon: ShieldAlert };
      case 'unverified':
        return { label: 'فاقد منبع قطعی (Unverified)', bg: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300', icon: AlertTriangle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="سیستم جامع مراجع و اعتبار علمی (Source Management System)"
        description="مخزن مرکزی مستندسازی علمی، استانداردها، روش‌های آزمون AOAC/ایزو، کتب مرجع، SDS و ردیابی تضادهای علمی استانداردی"
        breadcrumbs={[
          { title: 'خانه', path: '/' },
          { title: 'مدیریت مراجع و اعتبار علمی' }
        ]}
        actions={
          <button
            onClick={() => {
              setEditingSource(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن منبع علمی جدید</span>
          </button>
        }
      />

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1 font-medium">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>کل مراجع ثبت‌شده</span>
          </div>
          <span className="text-xl font-bold text-stone-900 dark:text-stone-100 font-mono">
            {stats.total}
          </span>
          <span className="block text-[10px] text-stone-400 mt-0.5">در ۱۰ رده تخصصی</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>تأییدشده رسمی (Verified)</span>
          </div>
          <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">
            {stats.verified}
          </span>
          <span className="block text-[10px] text-stone-400 mt-0.5">استانداردهای مصوب</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1 font-medium">
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span>استاندارد ملی ایران (INSO)</span>
          </div>
          <span className="text-xl font-bold text-amber-700 dark:text-amber-400 font-mono">
            {stats.inso}
          </span>
          <span className="block text-[10px] text-stone-400 mt-0.5">الزامات صنایع داخلی</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1 font-medium">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>ایزو، AOAC و کدکس</span>
          </div>
          <span className="text-xl font-bold text-blue-700 dark:text-blue-400 font-mono">
            {stats.international}
          </span>
          <span className="block text-[10px] text-stone-400 mt-0.5">مراجع بین‌المللی صادرات</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1 font-medium">
            <Scale className="w-4 h-4 text-orange-600" />
            <span>تضادهای ردیابی‌شده</span>
          </div>
          <span className="text-xl font-bold text-orange-700 dark:text-orange-400 font-mono">
            {stats.discrepancies}
          </span>
          <span className="block text-[10px] text-stone-400 mt-0.5">اختلاف میان مراجع</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1 font-medium">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>پیوندهای متصل در سیستم</span>
          </div>
          <span className="text-xl font-bold text-teal-700 dark:text-teal-400 font-mono">
            {stats.totalLinks}
          </span>
          <span className="block text-[10px] text-stone-400 mt-0.5">روش، فرمول، حد و محصول</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('registry')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'registry'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>بانک مراجع و اسناد علمی ({sources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pdf_explorer')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'pdf_explorer'
              ? 'bg-red-700 text-white shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <FileDown className="w-4 h-4" />
          <span>کتابخانه و جستجوی PDF ({stats.pdfCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('rag_grounding')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'rag_grounding'
              ? 'bg-indigo-700 text-white shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>پایگاه برداری و بازیابی RAG</span>
        </button>

        <button
          onClick={() => setActiveTab('discrepancies')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'discrepancies'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>مدیریت تعارضات علمی ({discrepancies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence_hub')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'evidence_hub'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>مرکز شواهد و قانون طلایی (Evidence Hub)</span>
        </button>

        <button
          onClick={() => setActiveTab('charter')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'charter'
              ? 'bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>منشور اعتبارسنجی</span>
        </button>
      </div>

      {/* TAB 1: SCIENTIFIC SOURCES REGISTRY */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          {/* Filters & Search Row */}
          <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در عنوان استاندارد، شماره (مثلا INSO 2406 یا AOAC 925.10)، سازمان یا کلمات کلیدی..."
                  className="w-full pr-10 pl-4 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as ScientificSourceType | 'all')}
                  className="flex-1 sm:w-56 px-3 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
                >
                  {SOURCE_TYPE_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <select
                  value={confidenceFilter}
                  onChange={(e) => setConfidenceFilter(e.target.value as ScientificConfidenceLevel | 'all')}
                  className="flex-1 sm:w-56 px-3 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
                >
                  {CONFIDENCE_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sources List Grid */}
          {loading ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              در حال بارگذاری مراجع علمی...
            </div>
          ) : filteredSources.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 p-8">
              <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                هیچ منبع علمی منطبق با این فیلتر یافت نشد.
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                می‌توانید عبارت جستجو را تغییر دهید یا منبع جدیدی ثبت کنید.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSources.map((source) => {
                const typeInfo = getSourceTypeBadge(source.sourceType);
                const confInfo = getConfidenceBadge(source.confidenceLevel);
                const ConfIcon = confInfo.icon;

                return (
                  <div
                    key={source.id}
                    className="flex flex-col justify-between p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 shadow-2xs hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${typeInfo.bg}`}>
                          {typeInfo.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${confInfo.bg}`}>
                          <ConfIcon className="w-3 h-3" />
                          <span>{confInfo.label.split(' ')[0]}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => setSelectedSource(source)}
                        className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 cursor-pointer line-clamp-2 leading-snug transition-colors"
                      >
                        {source.title}
                      </h3>

                      {source.englishTitle && (
                        <p className="text-[11px] text-stone-400 font-mono mt-0.5 line-clamp-1" dir="ltr">
                          {source.englishTitle}
                        </p>
                      )}

                      {/* Standard Number & Publisher */}
                      <div className="my-2.5 p-2.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl space-y-1 text-xs">
                        {source.standardNumber && (
                          <div className="flex items-center justify-between font-mono text-[11px]" dir="ltr">
                            <span className="text-stone-400 font-sans text-[10px]">شماره استاندارد:</span>
                            <span className="font-bold text-emerald-800 dark:text-emerald-300">{source.standardNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-400 text-[10px]">سازمان / مولف:</span>
                          <span className="font-medium text-stone-700 dark:text-stone-300 truncate max-w-[170px]">{source.authorOrOrganization}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-400 text-[10px]">سال و نسخه:</span>
                          <span className="text-stone-600 dark:text-stone-400">{source.year} ({source.editionOrVersion})</span>
                        </div>
                      </div>

                      {/* Notes snippet */}
                      {source.notes && (
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-2">
                          {source.notes}
                        </p>
                      )}
                    </div>

                    {/* Footer Actions & Linkages */}
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 mt-2 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        {source.hasPdf && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 rounded font-mono text-[9px] border border-red-200 dark:border-red-900">
                            <FileDown className="w-2.5 h-2.5" />
                            <span>PDF</span>
                          </span>
                        )}
                        <span className="text-stone-400 text-[10px]">
                          {source.linkedEntities
                            ? `${(source.linkedEntities.testMethodsCount || 0) + (source.linkedEntities.formulasCount || 0) + (source.linkedEntities.limitsCount || 0)} اتصال`
                            : 'منبع آزاد'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {source.hasPdf && (
                          <button
                            onClick={() => setActivePdfReaderSource(source)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/60 dark:hover:bg-red-900 dark:text-red-300 rounded-lg font-medium text-[10px] inline-flex items-center gap-1 transition-colors"
                            title="مطالعه، جستجو و استخراج از PDF"
                          >
                            <Eye className="w-3 h-3" />
                            <span>مطالعه PDF</span>
                          </button>
                        )}
                        <button
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
                          onClick={() => handleDeleteSource(source)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                          title="حذف منبع"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedSource(source)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 dark:text-emerald-300 rounded-lg font-medium text-[10px] transition-colors"
                        >
                          مشاهده کامل
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PDF EXPLORER & OCR LIBRARY */}
      {activeTab === 'pdf_explorer' && (
        <PdfExplorerView
          onOpenPdfReader={(source, page) => {
            setActivePdfReaderSource(source);
          }}
          onAddNewSourceWithPdf={() => {
            setEditingSource(null);
            setIsFormOpen(true);
          }}
        />
      )}

      {/* TAB 3: RAG GROUNDING & SEMANTIC RETRIEVAL */}
      {activeTab === 'rag_grounding' && (
        <RagExplorerView />
      )}

      {/* TAB 2: SCIENTIFIC DISCREPANCIES (مدیریت تعارضات میان استانداردهای مرجع) */}
      {activeTab === 'discrepancies' && (
        <div className="space-y-4">
          {/* Banner */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-100 flex items-start gap-3">
            <Scale className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm">
                قانون بنیادین: عدم پنهان‌سازی تضادهای علمی میان استانداردها
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                اگر میان استانداردهای ملی ایران (INSO)، استانداردهای بین‌المللی کدکس (Codex)، روش‌های AOAC یا ایزو اختلافی وجود داشته باشد، سیستم نباید تضاد را پنهان یا ادغام کند. هر دو مرجع همراه با دلایل علمی و الزامات حاکم بر بازار هدف باید جداگانه ارائه شوند.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discrepancies.map((disc) => (
              <div
                key={disc.id}
                className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 text-[10px] font-bold">
                      {disc.category}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">
                      {disc.topicFa}
                    </h4>
                    <p className="text-[10px] font-mono text-stone-400" dir="ltr">
                      {disc.topicEn}
                    </p>
                  </div>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900">
                    <span className="block font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                      مرجع اول (استاندارد ملی / ایزو):
                    </span>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">{disc.primarySource.sourceTitle}</p>
                    <div className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 my-1" dir="ltr">
                      {disc.primarySource.limitValue}
                    </div>
                    <p className="text-[10px] text-stone-600 dark:text-stone-400">{disc.primarySource.conditions}</p>
                  </div>

                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900">
                    <span className="block font-bold text-blue-800 dark:text-blue-300 mb-1">
                      مرجع متعارض (کدکس / BAM):
                    </span>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">{disc.conflictingSource.sourceTitle}</p>
                    <div className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 my-1" dir="ltr">
                      {disc.conflictingSource.limitValue}
                    </div>
                    <p className="text-[10px] text-stone-600 dark:text-stone-400">{disc.conflictingSource.conditions}</p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-2.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
                  <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">ریشه و تفسیر علمی تضاد:</span>
                  {disc.scientificExplanationFa}
                </div>

                {/* Action Recommendation */}
                <div className="p-2.5 bg-emerald-50/90 dark:bg-emerald-950/60 rounded-xl text-[11px] text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold block mb-0.5">دستورالعمل اجرایی در کنترل کیفیت (QC):</span>
                  {disc.actionRecommendationFa}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CENTRAL EVIDENCE HUB & GOLDEN RULE AUDITOR */}
      {activeTab === 'evidence_hub' && (
        <CentralEvidenceHubView />
      )}

      {/* TAB 3: SCIENTIFIC INTEGRITY CHARTER (منشور اعتبارسنجی علمی) */}
      {activeTab === 'charter' && (
        <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-6 text-xs leading-relaxed">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>منشور تخطی‌ناپذیر اعتبار علمی سامانه Food Science AI</span>
            </h3>
            <p className="text-stone-500 mt-1">
              مجموعه قواعد قطعی کنترل داده، ارجاع، تفکیک استانداردهای قانونی از تخمین‌های پژوهشی و پیشگیری از خطای داده‌های موهوم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>۱. الزامات اتصال تمام داده‌ها به مراجع رسمی (100% Attribution)</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300 text-[11px]">
                <li><strong>هر روش آزمون (Test Method):</strong> باید شماره استاندارد ملی یا ایزو یا AOAC مشخص داشته باشد.</li>
                <li><strong>هر فرمول محاسباتی (Formula):</strong> باید به کتاب مرجع یا متدولوژی استاندارد متصل باشد.</li>
                <li><strong>هر حد مجاز آزمایشگاهی (Limit):</strong> باید مستند به جدول ویژگی‌های استاندارد محصول باشد.</li>
                <li><strong>هر مقدار علمی کلیدی:</strong> اعم از دما، زمان هلدینگ، غلظت معرف و اسیدیته باید مأخذ داشته باشد.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2">
              <h4 className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>۲. ممنوعیت‌های قطعی حدس و تخمین علمی (Anti-Guessing Rules)</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300 text-[11px]">
                <li><strong>شماره استاندارد را هرگز حدس نزنید:</strong> هیچ شماره یا رفرنس فرضی ساخته نمی‌شود.</li>
                <li><strong>مقدار، دما و زمان را هرگز حدس نزنید:</strong> شرایط پاستوریزاسیون یا حدود میکروبی باید قطعی باشند.</li>
                <li><strong>استانداردها را با مقاله جایگزین نکنید:</strong> مقالات پژوهشی جایگزین الزامات قانونی استاندارد نیستند.</li>
                <li><strong>اطلاعات فاقد منبع فکت نیستند:</strong> اگر منبعی وجود ندارد، به عنوان ادعای قطعی تلقی نمی‌شود.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2">
              <h4 className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>۳. پوشش ۱۰ رده اصلی اسناد علمی در صنایع غذایی</span>
              </h4>
              <p className="text-stone-700 dark:text-stone-300 text-[11px]">
                سامانه به صورت تفکیک‌شده شامل: استاندارد ملی ایران (INSO)، استانداردهای بین‌المللی ISO، روش‌های رسمی AOAC، کدهای بین‌المللی کدکس (Codex)، مقالات داوری‌شده ژورنال‌ها، کتب مرجع دانشگاهی (مانند فنما و جی)، راهنماهای رسمی آزمون (FDA-BAM / USDA)، برگه‌های ایمنی مواد شیمیایی (SDS)، پایان‌نامه‌های معتبر و دستورالعمل‌های سازمان غذا و دارو (IFDA) است.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-2">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>۴. سطوح چهارگانه اعتماد علمی (Scientific Confidence Hierarchy)</span>
              </h4>
              <div className="space-y-1.5 text-[11px]">
                <div><span className="font-bold text-emerald-800 dark:text-emerald-300">Verified: </span>مستند به استانداردهای ملی و بین‌المللی مصوب با الزام قانونی.</div>
                <div><span className="font-bold text-blue-800 dark:text-blue-300">Source-backed: </span>دارای استناد به کتب مرجع دانشگاهی و مقالات داوری‌شده با DOI/ISBN.</div>
                <div><span className="font-bold text-amber-800 dark:text-amber-300">Partially supported: </span>مفاهیم مطابق اصول اما نیازمند استعلام شماره تجدیدنظر استاندارد.</div>
                <div><span className="font-bold text-rose-800 dark:text-rose-300">Unverified: </span>تخمین‌های تئوریک بدون منبع معتبر آزمایشگاهی؛ غیرقابل استفاده در صدور گواهی QC.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedSource && (
        <UnifiedSourceDetailModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
          onEdit={(src) => {
            setSelectedSource(null);
            setEditingSource(src);
            setIsFormOpen(true);
          }}
          onDelete={handleDeleteSource}
          onOpenPdfReader={(src) => {
            setSelectedSource(null);
            setActivePdfReaderSource(src);
          }}
        />
      )}

      {/* PDF Reader & Text Search Modal */}
      {activePdfReaderSource && (
        <PdfReaderModal
          isOpen={Boolean(activePdfReaderSource)}
          source={activePdfReaderSource}
          onClose={() => setActivePdfReaderSource(null)}
          onLinkSuccess={() => {
            loadData();
          }}
        />
      )}

      {isFormOpen && (
        <UnifiedSourceFormModal
          isOpen={isFormOpen}
          initialData={editingSource}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSource(null);
          }}
          onSaved={handleSavedSource}
        />
      )}
    </div>
  );
};
