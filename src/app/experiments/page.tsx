import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { appConfirm } from '../../components/common/DialogProvider';
import {
  FoodExperiment,
  ExperimentDomain,
  EXPERIMENT_DOMAINS,
  ExperimentSearchFilters,
  ExperimentStatistics
} from '../../types/foodExperiment';
import {
  getAllExperiments,
  searchExperiments,
  saveExperiment,
  deleteExperiment,
  getExperimentStatistics,
  seedInitialVerifiedExperiments,
  exportExperimentsToJSON,
  importExperimentsFromJSON
} from '../../lib/storage/experimentStorage';
import { ExperimentCard } from '../../components/experiments/ExperimentCard';
import { ExperimentsFilterBar } from '../../components/experiments/ExperimentsFilterBar';
import { ExperimentDetailModal } from '../../components/experiments/ExperimentDetailModal';
import { ExperimentFormModal } from '../../components/experiments/ExperimentFormModal';
import { StandardExperimentTemplateModal } from '../../components/experiments/StandardExperimentTemplateModal';
import { createEmptyStandardExperimentTemplate } from '../../lib/experiments/standardExperimentTemplate';
import {
  FlaskConical,
  Plus,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  BookOpen,
  Filter,
  SlidersHorizontal,
  Info
} from 'lucide-react';

export const ExperimentsPage: React.FC = () => {
  const [experiments, setExperiments] = useState<FoodExperiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ExperimentStatistics | null>(null);

  // Filters State
  const [filters, setFilters] = useState<ExperimentSearchFilters>({
    query: '',
    domain: 'all',
    standardOrganization: 'all',
    verificationStatus: 'all',
    reliabilityGrade: 'all',
    offlineOnly: false,
    verifiedOnly: false
  });

  // View state
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [selectedExperiment, setSelectedExperiment] = useState<FoodExperiment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperiment, setEditingExperiment] = useState<FoodExperiment | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Notifications / Alerts
  const [actionAlert, setActionAlert] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // File input ref for JSON import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load experiments on mount & on filter changes
  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await searchExperiments(filters);
      setExperiments(list);
      const computedStats = await getExperimentStatistics();
      setStats(computedStats);
    } catch (err) {
      console.error('Error fetching experiments:', err);
      showAlert('خطا در بارگذاری اطلاعات آزمایش‌ها', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setActionAlert({ message, type });
    setTimeout(() => {
      setActionAlert(null);
    }, 4000);
  };

  // Filter handlers
  const handleFilterChange = (newFilters: Partial<ExperimentSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      domain: 'all',
      standardOrganization: 'all',
      verificationStatus: 'all',
      reliabilityGrade: 'all',
      offlineOnly: false,
      verifiedOnly: false
    });
  };

  // Modal actions
  const handleSelectExperiment = (exp: FoodExperiment) => {
    setSelectedExperiment(exp);
    setIsDetailOpen(true);
  };

  const handleCreateNew = () => {
    setEditingExperiment(null);
    setIsFormOpen(true);
  };

  const handleEditExperiment = (exp: FoodExperiment) => {
    setEditingExperiment(exp);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleSaveExperiment = async (exp: FoodExperiment) => {
    try {
      await saveExperiment(exp);
      showAlert(
        editingExperiment ? 'پروتکل آزمایش با موفقیت به‌روزرسانی شد.' : 'پروتکل جدید آزمایش با موفقیت ثبت گردید.',
        'success'
      );
      setIsFormOpen(false);
      setEditingExperiment(null);
      await loadData();
    } catch (err) {
      console.error('Save failed:', err);
      showAlert('خطا در ذخیره پروتکل آزمایش', 'error');
    }
  };

  const handleDeleteExperiment = async (id: string) => {
    if (!(await appConfirm('آیا از حذف این پروتکل آزمایشگاهی اطمینان دارید؟'))) return;
    try {
      await deleteExperiment(id);
      showAlert('پروتکل آزمایش با موفقیت حذف گردید.', 'info');
      await loadData();
    } catch (err) {
      console.error('Delete failed:', err);
      showAlert('خطا در حذف آزمایش', 'error');
    }
  };

  // Restore Benchmark Seed Data
  const handleRestoreSeedData = async () => {
    if (
      !(await appConfirm('آیا مایلید تمام پروتکل‌های مرجع استاندارد بازنشانی و بارگذاری شوند؟', {
        title: 'بازنشانی پروتکل‌های مرجع',
        confirmLabel: 'بازنشانی',
        destructive: false
      }))
    )
      return;
    setLoading(true);
    try {
      await seedInitialVerifiedExperiments();
      showAlert('مجموعه پروتکل‌های مرجع استاندارد ملی و بین‌المللی با موفقیت بازیابی شدند.', 'success');
      await loadData();
    } catch (err) {
      console.error('Seed restore failed:', err);
      showAlert('خطا در بازنشانی داده‌های مرجع', 'error');
    } finally {
      setLoading(false);
    }
  };

  // JSON Export
  const handleExportJSON = async () => {
    try {
      const jsonStr = await exportExperimentsToJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `food_science_experiments_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showAlert('فایل JSON پروتکل‌ها با موفقیت دانلود شد.', 'success');
    } catch (err) {
      console.error('Export failed:', err);
      showAlert('خطا در خروجی گرفتن فایل', 'error');
    }
  };

  // JSON Import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const count = await importExperimentsFromJSON(text);
        showAlert(`تعداد ${count} پروتکل آزمایش با موفقیت وارد و ذخیره شد.`, 'success');
        await loadData();
      } catch (err: any) {
        console.error('Import failed:', err);
        showAlert(err.message || 'خطا در واردسازی فایل JSON', 'error');
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hidden File Input for JSON Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Page Header */}
      <PageHeader
        title="پروتکل‌های آزمایشگاهی و روش‌های آزمون"
        englishTitle="/experiments — Laboratory Protocols & Testing Standards"
        description="سامانه جامع روش‌های آزمون صنایع غذایی، منطبق بر استانداردهای INSO, ISO, AOAC, ASTM با فرمول‌های محاسباتی و کنترل کیفیت"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'مدیریت آزمایش‌ها' }
        ]}
      />

      {/* Action Notification Alert */}
      {actionAlert && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-medium border flex items-center justify-between shadow-xs animate-in slide-in-from-top-2 ${
            actionAlert.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : actionAlert.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              : 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionAlert.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {actionAlert.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
            {actionAlert.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
            <span>{actionAlert.message}</span>
          </div>
          <button
            onClick={() => setActionAlert(null)}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs px-2 py-0.5"
          >
            بستن
          </button>
        </div>
      )}

      {/* Quick Statistics Banner */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1.5 text-xs">
              <span>کل پروتکل‌های ثبت‌شده</span>
              <FlaskConical className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
              {stats.totalExperiments}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1">
              <span>در ۱۵ حوزه تخصصی غذایی</span>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1.5 text-xs">
              <span>پروتکل‌های تاییدشده (Grade A)</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {stats.verifiedStandardsCount}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
              دارای شماره استاندارد رسمی
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1.5 text-xs">
              <span>استانداردهای ملی ایران (INSO)</span>
              <BookOpen className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
              {stats.insoStandardsCount}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
              روش‌های آزمون ملی مصوب
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1.5 text-xs">
              <span>پوشش آفلاین (IndexedDB)</span>
              <Database className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
              ۱۰۰٪
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
              دسترسی کامل بدون اینترنت
            </div>
          </div>
        </div>
      )}

      {/* Action Toolbar Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCreateNew}
            id="btn-create-new-experiment"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-xs text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت پروتکل آزمایش جدید</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-semibold transition-colors"
            title="خروجی فایل JSON از تمامی آزمایش‌ها"
          >
            <Download className="w-3.5 h-3.5" />
            <span>خروجی JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-semibold transition-colors"
            title="وارد کردن پروتکل‌ها از فایل JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>ورود از JSON</span>
          </button>

          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-semibold transition-colors"
            title="مشاهده ساختار استاندارد ۲۶ فیلد و مقیاس‌پذیری"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>قالب استاندارد ۲۶ فیلد</span>
          </button>

          <button
            onClick={handleRestoreSeedData}
            className="flex items-center gap-1.5 px-3 py-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-xs font-medium transition-colors"
            title="بازیابی پروتکل‌های استاندارد پیش‌فرض"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازیابی مراجع استاندارد</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border border-stone-200 dark:border-stone-700 rounded-xl p-1 bg-stone-50 dark:bg-stone-800 self-end sm:self-auto">
          <button
            onClick={() => setViewLayout('grid')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewLayout === 'grid'
                ? 'bg-white dark:bg-stone-900 text-emerald-600 shadow-xs font-bold'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
            title="نمایش شبکه‌ای (کارت)"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewLayout('list')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewLayout === 'list'
                ? 'bg-white dark:bg-stone-900 text-emerald-600 shadow-xs font-bold'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
            title="نمایش جدولی و فهرستی"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar (15 Food Domains + Standard Authorities + Verification Grades) */}
      <ExperimentsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        domainsCounts={stats?.domainCounts}
        totalCount={experiments.length}
      />

      {/* Experiments Listing Content */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <div className="text-sm font-semibold text-stone-600 dark:text-stone-400">
            در حال بارگذاری پروتکل‌های آزمایشگاهی...
          </div>
        </div>
      ) : experiments.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
            <FlaskConical className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
            هیچ پروتکل آزمایشی مطابق فیلترهای انتخابی یافت نشد
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-6">
            عبارت جستجو یا فیلترهای حوزه و استانداردهای انتخابی را تغییر دهید، یا یک پروتکل آزمایشگاهی جدید اضافه نمایید.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-200"
            >
              پاکسازی فیلترها
            </button>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
            >
              افزودن پروتکل آزمایشی
            </button>
          </div>
        </div>
      ) : viewLayout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {experiments.map((exp) => (
            <ExperimentCard
              key={exp.id}
              experiment={exp}
              onSelect={handleSelectExperiment}
              onEdit={handleEditExperiment}
              onDelete={handleDeleteExperiment}
            />
          ))}
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 font-bold">
                <tr>
                  <th className="p-3.5">کد</th>
                  <th className="p-3.5">عنوان فارسی و انگلیسی آزمایش</th>
                  <th className="p-3.5">حوزه تخصصی</th>
                  <th className="p-3.5">استاندارد مرجع</th>
                  <th className="p-3.5">سطح اعتبار</th>
                  <th className="p-3.5 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                {experiments.map((exp) => {
                  const domainMeta = EXPERIMENT_DOMAINS[exp.domain] || {
                    titleFa: exp.domain,
                    color: '#6b7280'
                  };
                  return (
                    <tr
                      key={exp.id}
                      className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="p-3.5 font-mono font-bold text-stone-600 dark:text-stone-400">
                        {exp.code}
                      </td>
                      <td className="p-3.5">
                        <div
                          onClick={() => handleSelectExperiment(exp)}
                          className="font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-600 cursor-pointer"
                        >
                          {exp.titleFa}
                        </div>
                        {exp.titleEn && (
                          <div className="text-[11px] text-stone-400 italic line-clamp-1 dir-ltr text-left">
                            {exp.titleEn}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold"
                          style={{
                            backgroundColor: `${domainMeta.color}15`,
                            color: domainMeta.color
                          }}
                        >
                          {domainMeta.titleFa}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono">
                        {exp.standardReference?.organization}: {exp.standardReference?.standardNumber || '—'}
                      </td>
                      <td className="p-3.5">
                        {exp.isVerifiedProtocol ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>تاییدشده استاندارد</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>در حال ارزیابی</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleSelectExperiment(exp)}
                            className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold"
                          >
                            مشاهده
                          </button>
                          <button
                            onClick={() => handleEditExperiment(exp)}
                            className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold"
                          >
                            ویرایش
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ExperimentDetailModal
        experiment={selectedExperiment}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedExperiment(null);
        }}
        onEdit={handleEditExperiment}
      />

      <ExperimentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExperiment(null);
        }}
        onSave={handleSaveExperiment}
        initialData={editingExperiment}
      />

      {/* Universal 26-Field Standard Template Modal */}
      {isTemplateModalOpen && (
        <StandardExperimentTemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          experiment={selectedExperiment || experiments[0] || createEmptyStandardExperimentTemplate()}
        />
      )}
    </div>
  );
};

export default ExperimentsPage;

