import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { appConfirm } from '../../components/common/DialogProvider';
import { FoodStandardsFilterBar } from '../../components/standards/FoodStandardsFilterBar';
import { FoodStandardCard } from '../../components/standards/FoodStandardCard';
import { FoodStandardDetailModal } from '../../components/standards/FoodStandardDetailModal';
import { FoodStandardFormModal } from '../../components/standards/FoodStandardFormModal';
import { StandardsImportExportModal } from '../../components/standards/StandardsImportExportModal';
import { SourceDetailModal } from '../../components/knowledge/SourceDetailModal';
import { SourceFormModal } from '../../components/knowledge/SourceFormModal';
import {
  FoodStandard,
  FoodStandardSearchFilters,
  StandardJurisdiction
} from '../../types/foodStandard';
import { ScientificSource } from '../../types/knowledgeBase';
import {
  searchStandards,
  deleteStandard,
  getStandardsStatistics
} from '../../lib/storage/standardsStorage';
import { getSourceById, deleteSource } from '../../lib/storage/knowledgeBase';
import {
  ShieldCheck,
  Building,
  Globe,
  Plus,
  Upload,
  BookOpen,
  Database,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Wrench,
  FlaskConical,
  Scale
} from 'lucide-react';

export const StandardsPage: React.FC = () => {
  const [standards, setStandards] = useState<FoodStandard[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    iranian: 0,
    international: 0,
    active: 0,
    underRevision: 0,
    withdrawn: 0,
    withLimits: 0,
    verifiedWithSources: 0
  });

  // Filters State
  const [filters, setFilters] = useState<FoodStandardSearchFilters>({
    query: '',
    jurisdiction: 'all',
    sector: 'all',
    lifecycleStatus: 'all',
    verificationStatus: 'all',
    hasAcceptableLimitsOnly: false,
    offlineOnly: false
  });

  // Modals state
  const [selectedStandard, setSelectedStandard] = useState<FoodStandard | null>(null);
  const [editingStandard, setEditingStandard] = useState<FoodStandard | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  // Source Modals state
  const [selectedSource, setSelectedSource] = useState<ScientificSource | null>(null);
  const [editingSource, setEditingSource] = useState<ScientificSource | null>(null);
  const [isSourceFormOpen, setIsSourceFormOpen] = useState(false);

  // Fetch standards and statistical overview
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [matchedStandards, currentStats] = await Promise.all([
        searchStandards(filters),
        getStandardsStatistics()
      ]);
      setStandards(matchedStandards);
      setStats(currentStats);
    } catch (error) {
      console.error('Failed to load standards data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleDeleteStandard = async (std: FoodStandard) => {
    if (await appConfirm(`آیا از حذف استاندارد «${std.standardNumber || std.titleFa}» اطمینان دارید؟`)) {
      await deleteStandard(std.id);
      loadData();
    }
  };

  const handleOpenSourceDetail = async (sourceId: string) => {
    const src = await getSourceById(sourceId);
    if (src) {
      setSelectedSource(src);
    }
  };

  const handleDeleteSource = async (source: ScientificSource) => {
    if (await appConfirm(`آیا از حذف منبع «${source.title}» اطمینان دارید؟`)) {
      await deleteSource(source.id);
      setSelectedSource(null);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="سامانه جامع مدیریت استانداردهای صنایع غذایی"
        englishTitle="/standards — Food Industry Standards Management System"
        description="سامانه تخصصی مدیریت، جستجو و ارزیابی استانداردهای ملی ایران (INSO) و مراجع بین‌المللی (Codex, ISO, FDA) با قابلیت تفکیک حوزه، روش‌های آزمون، جدول حدود مجاز و اعتبارسنجی منبع"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'استانداردهای صنایع غذایی' }
        ]}
      />

      {/* Overview & Strict Separation Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Iranian Standards Counter */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">استانداردهای ملی ایران (INSO)</span>
            <div className="text-xl font-bold font-mono text-emerald-800 dark:text-emerald-300">
              {stats.iranian} <span className="text-xs font-normal font-sans text-stone-400">استاندارد</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xl">
            🇮🇷
          </div>
        </div>

        {/* International Standards Counter */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">استانداردهای بین‌المللی و خارجی</span>
            <div className="text-xl font-bold font-mono text-indigo-800 dark:text-indigo-300">
              {stats.international} <span className="text-xs font-normal font-sans text-stone-400">استاندارد</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        {/* Verified with Sources */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">دارای استناد و منبع رسمی</span>
            <div className="text-xl font-bold font-mono text-emerald-800 dark:text-emerald-300">
              {stats.verifiedWithSources} <span className="text-xs font-normal font-sans text-stone-400">مورد تأیید</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Acceptable Limits Specs Counter */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">جدول حدود مجاز فیزیکوشیمیایی</span>
            <div className="text-xl font-bold font-mono text-stone-800 dark:text-stone-200">
              {stats.withLimits} <span className="text-xs font-normal font-sans text-stone-400">دارای جدول</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Scientific Integrity Rule Banner */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 flex-wrap">
              <span>ضوابط صیانت علمی و تفکیک حاکمیتی استانداردهای غذایی</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                INSO vs International Strict Rule
              </span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              استانداردهای ملی ایران (INSO) ملزم به درج شماره استاندارد ملی و ویرایش/سال بوده و از استانداردهای خارجی کاملاً تفکیک شده‌اند. همچنین هیچ رکوردی بدون اتصال به منبع علمی معتبر، به‌عنوان استاندارد تأییدشده ذخیره نمی‌شود.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/standards/iran"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>سامانه تخصصی استانداردهای ایران (INSO)</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setEditingSource(null);
              setIsSourceFormOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold inline-flex items-center gap-1 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ثبت منبع جدید</span>
          </button>
        </div>
      </div>

      {/* Multi-Criteria Standards Filter Bar */}
      <FoodStandardsFilterBar
        filters={filters}
        onFilterChange={setFilters}
        totalResults={standards.length}
        iranianCount={stats.iranian}
        internationalCount={stats.international}
        onOpenCreateStandard={() => {
          setEditingStandard(null);
          setIsFormOpen(true);
        }}
        onOpenImportExport={() => setIsImportExportOpen(true)}
      />

      {/* Standards List / Cards Grid */}
      <div>
        {loading ? (
          <div className="text-center py-16 text-xs text-stone-500 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            در حال بازیابی استانداردهای صنایع غذایی از پایگاه داده محلی IndexedDB...
          </div>
        ) : standards.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 p-8 sm:p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                هیچ استانداردی با مشخصات انتخابی یافت نشد
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                به منظور حفظ دقت علمی، هیچ داده آزمایشی یا ساختگی تولید نشده است. می‌توانید با بارگذاری فایل JSON یا ثبت دستی استاندارد با پیوست منبع معتبر، استانداردها را به سامانه اضافه نمایید.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsImportExportOpen(true)}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>ورود داده‌های استاندارد (Import JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingStandard(null);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ثبت استاندارد جدید</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standards.map((standard) => (
              <FoodStandardCard
                key={standard.id}
                standard={standard}
                onViewDetails={(std) => setSelectedStandard(std)}
                onEdit={(std) => {
                  setEditingStandard(std);
                  setIsFormOpen(true);
                }}
                onDelete={handleDeleteStandard}
              />
            ))}
          </div>
        )}
      </div>

      {/* Standard Detail Modal */}
      {selectedStandard && (
        <FoodStandardDetailModal
          standard={selectedStandard}
          onClose={() => setSelectedStandard(null)}
          onSelectSource={(srcId) => handleOpenSourceDetail(srcId)}
          onEdit={(std) => {
            setSelectedStandard(null);
            setEditingStandard(std);
            setIsFormOpen(true);
          }}
        />
      )}

      {/* Standard Form Modal */}
      <FoodStandardFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStandard(null);
        }}
        initialData={editingStandard}
        defaultJurisdiction={filters.jurisdiction !== 'all' ? (filters.jurisdiction as StandardJurisdiction) : 'iranian_national'}
        onSaved={() => {
          loadData();
        }}
        onOpenCreateSource={() => {
          setEditingSource(null);
          setIsSourceFormOpen(true);
        }}
      />

      {/* Source Detail Modal */}
      {selectedSource && (
        <SourceDetailModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
          onSelectRecord={() => {
            setSelectedSource(null);
          }}
          onEdit={(src) => {
            setSelectedSource(null);
            setEditingSource(src);
            setIsSourceFormOpen(true);
          }}
          onDelete={handleDeleteSource}
        />
      )}

      {/* Source Form Modal */}
      <SourceFormModal
        isOpen={isSourceFormOpen}
        onClose={() => {
          setIsSourceFormOpen(false);
          setEditingSource(null);
        }}
        initialData={editingSource}
        onSaved={() => {
          loadData();
        }}
      />

      {/* Import / Export JSON Modal */}
      <StandardsImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImportCompleted={() => {
          loadData();
        }}
      />
    </div>
  );
};

export default StandardsPage;
