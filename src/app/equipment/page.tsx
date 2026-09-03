import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  LaboratoryEquipment,
  EquipmentCategory,
  CalibrationStatus,
  EquipmentFilterQuery,
  EquipmentStatistics,
  EQUIPMENT_CATEGORIES,
  CALIBRATION_STATUS_META
} from '../../types/laboratoryEquipment';
import { FoodExperiment } from '../../types/foodExperiment';
import {
  getAllEquipment,
  filterEquipment,
  saveEquipment,
  deleteEquipment,
  getEquipmentStatistics,
  exportEquipmentToJSON,
  importEquipmentFromJSON,
  resetEquipmentStore
} from '../../lib/storage/equipmentStorage';
import { searchExperiments } from '../../lib/storage/experimentStorage';
import { EquipmentCard } from '../../components/equipment/EquipmentCard';
import { EquipmentFilterBar } from '../../components/equipment/EquipmentFilterBar';
import { EquipmentDetailModal } from '../../components/equipment/EquipmentDetailModal';
import { EquipmentFormModal } from '../../components/equipment/EquipmentFormModal';
import { ExperimentRequirementInspector } from '../../components/equipment/ExperimentRequirementInspector';
import {
  Wrench,
  Plus,
  Download,
  Upload,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  FlaskConical,
  Activity,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Calendar
} from 'lucide-react';

export const EquipmentPage: React.FC = () => {
  // Navigation / View states
  const [activeViewTab, setActiveViewTab] = useState<'catalog' | 'linker_engine' | 'calibration_audit'>('catalog');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Data states
  const [equipmentList, setEquipmentList] = useState<LaboratoryEquipment[]>([]);
  const [filteredList, setFilteredList] = useState<LaboratoryEquipment[]>([]);
  const [experiments, setExperiments] = useState<FoodExperiment[]>([]);
  const [statistics, setStatistics] = useState<EquipmentStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter Query state
  const [filters, setFilters] = useState<EquipmentFilterQuery>({
    query: '',
    category: 'all',
    calibrationStatus: 'all',
    hasSpecificationsOnly: false,
    offlineOnly: false
  });

  // Modal states
  const [selectedEquipment, setSelectedEquipment] = useState<LaboratoryEquipment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<LaboratoryEquipment | null>(null);
  const [preselectedExperimentCode, setPreselectedExperimentCode] = useState<string | undefined>(undefined);

  // Toast / Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load all initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allEq, stats, allExp] = await Promise.all([
        getAllEquipment(),
        getEquipmentStatistics(),
        searchExperiments({
          query: '',
          domain: 'all',
          standardOrganization: 'all',
          verificationStatus: 'all',
          reliabilityGrade: 'all',
          offlineOnly: false,
          verifiedOnly: false
        })
      ]);

      setEquipmentList(allEq);
      setStatistics(stats);
      setExperiments(allExp);
    } catch (error) {
      console.error('Error loading equipment data:', error);
      showNotification('خطا در بارگذاری اطلاعات تجهیزات آزمایشگاه', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter dynamic updates
  useEffect(() => {
    const applyFilter = async () => {
      const results = await filterEquipment(filters);
      setFilteredList(results);
    };
    applyFilter();
  }, [filters, equipmentList]);

  // Handle Save Equipment
  const handleSaveEquipment = async (saved: LaboratoryEquipment) => {
    try {
      await saveEquipment(saved);
      showNotification('تجهیز آزمایشگاهی با موفقیت ذخیره شد.');
      await loadData();
    } catch (error) {
      console.error('Save failed:', error);
      showNotification('خطا در ذخیره‌سازی مشخصات دستگاه', 'error');
    }
  };

  // Handle Delete Equipment
  const handleDeleteEquipment = async (item: LaboratoryEquipment) => {
    if (window.confirm(`آیا از حذف دستگاه "${item.nameFa}" اطمینان دارید؟`)) {
      try {
        await deleteEquipment(item.id);
        showNotification('دستگاه از پایگاه حذف گردید.');
        await loadData();
      } catch (error) {
        console.error('Delete failed:', error);
        showNotification('خطا در حذف دستگاه', 'error');
      }
    }
  };

  // Handle Export JSON
  const handleExportJSON = async () => {
    try {
      const jsonStr = await exportEquipmentToJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `food_science_equipment_catalog_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('فایل JSON تجهیزات با موفقیت صادر شد.');
    } catch (error) {
      console.error('Export failed:', error);
      showNotification('خطا در صدور فایل پشتیبان', 'error');
    }
  };

  // Handle Import JSON
  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const count = await importEquipmentFromJSON(text);
        showNotification(`تعداد ${count} تجهیز جدید با موفقیت وارد پایگاه گردید.`);
        await loadData();
      } catch (error) {
        console.error('Import failed:', error);
        showNotification('فرمت فایل JSON نامعتبر است.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Handle Reset to Benchmark
  const handleResetBenchmark = async () => {
    if (
      window.confirm(
        'آیا مایلید پایگاه تجهیزات به کاتالوگ استاندارد اولیه (۱۷ دسته‌بندی تخصصی) بازنشانی شود؟'
      )
    ) {
      try {
        await resetEquipmentStore();
        showNotification('پایگاه تجهیزات به حالت استاندارد بازنشانی شد.');
        await loadData();
      } catch (error) {
        console.error('Reset failed:', error);
        showNotification('خطا در بازنشانی داده‌ها', 'error');
      }
    }
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      calibrationStatus: 'all',
      hasSpecificationsOnly: false,
      offlineOnly: false
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-xl text-xs font-bold border transition-all animate-in fade-in slide-in-from-top-4 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : 'bg-rose-900 text-rose-100 border-rose-700'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="تجهیزات و دستگاه‌های تخصصی آزمایشگاهی"
        englishTitle="Food Science Specialized Laboratory Equipment & Instrumentation"
        description="سامانه جامع مشخصات فنی، دقت، Resolution، کنترل عملکرد روزانه، کالیبراسیون و انطباق دستگاه‌ها با پروتکل‌های آزمون (قسمت ۱۲ از ۲۰)"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'تجهیزات آزمایشگاهی' }
        ]}
      />

      {/* Statistics Overview Bar */}
      {statistics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>کل تجهیزات فعال</span>
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {statistics.total}
              </span>
              <span className="text-xs text-stone-400">دستگاه</span>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>دسته‌بندی‌های تخصصی</span>
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                ۱۷
              </span>
              <span className="text-xs text-stone-400">دسته استاندارد</span>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>کالیبره و دارای اعتبار</span>
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {statistics.calibratedCount}
              </span>
              <span className="text-xs text-stone-400">دستگاه</span>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>نزدیک به انقضای دوره</span>
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {statistics.expiringCount}
              </span>
              <span className="text-xs text-stone-400">نیازمند تمدید</span>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-blue-600" />
              <span>اتصال با آزمایش‌ها</span>
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {experiments.length}
              </span>
              <span className="text-xs text-stone-400">پروتکل فعال</span>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>ذخیره‌سازی پایدار</span>
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                ۱۰۰٪
              </span>
              <span className="text-xs text-stone-400">آفلاین IndexedDB</span>
            </div>
          </div>
        </div>
      )}

      {/* Main View Mode Tabs */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-2 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            id="tab-view-catalog"
            onClick={() => setActiveViewTab('catalog')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeViewTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>شناسنامه و کاتالوگ تجهیزات</span>
          </button>

          <button
            id="tab-view-linker"
            onClick={() => setActiveViewTab('linker_engine')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeViewTab === 'linker_engine'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>موتور انطباق: آزمایش ← تجهیزات ← مشخصات</span>
          </button>

          <button
            id="tab-view-calibration"
            onClick={() => setActiveViewTab('calibration_audit')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeViewTab === 'calibration_audit'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>جدول پایش کالیبراسیون و نگهداری</span>
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2">
          {activeViewTab === 'catalog' && (
            <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden ml-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}
                title="نمایش شبکه‌ای"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 ${viewMode === 'table' ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}
                title="نمایش جدولی"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setEditingEquipment(null);
              setIsFormModalOpen(true);
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت تجهیز جدید</span>
          </button>

          <button
            onClick={handleExportJSON}
            title="خروجی فایل JSON"
            className="p-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <label
            title="ورودی فایل JSON"
            className="p-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={handleResetBenchmark}
            title="بازنشانی به کاتالوگ استاندارد اولیه"
            className="p-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW 1: CATALOG VIEW */}
      {activeViewTab === 'catalog' && (
        <div className="space-y-4">
          <EquipmentFilterBar
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            totalCount={equipmentList.length}
            filteredCount={filteredList.length}
            categoriesCounts={statistics?.categoriesDistribution || ({} as Record<EquipmentCategory, number>)}
          />

          {isLoading ? (
            <div className="p-16 text-center text-stone-400 text-sm">
              در حال بارگذاری کاتالوگ تجهیزات آزمایشگاه...
            </div>
          ) : filteredList.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredList.map((eq) => (
                  <EquipmentCard
                    key={eq.id}
                    equipment={eq}
                    onViewDetails={(item) => {
                      setSelectedEquipment(item);
                      setIsDetailModalOpen(true);
                    }}
                    onEdit={(item) => {
                      setEditingEquipment(item);
                      setIsFormModalOpen(true);
                    }}
                    onDelete={handleDeleteEquipment}
                    onInspectExperimentLink={(item) => {
                      setSelectedEquipment(item);
                      setActiveViewTab('linker_engine');
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Table View */
              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-semibold">
                      <tr>
                        <th className="p-3.5">کد</th>
                        <th className="p-3.5">نام دستگاه و مشخصات</th>
                        <th className="p-3.5">دسته‌بندی</th>
                        <th className="p-3.5">دقت / عدم قطعیت</th>
                        <th className="p-3.5">ظرفیت</th>
                        <th className="p-3.5">وضعیت کالیبراسیون</th>
                        <th className="p-3.5">کالیبراسیون بعدی</th>
                        <th className="p-3.5 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200/60 dark:divide-stone-800">
                      {filteredList.map((eq) => {
                        const catMeta = EQUIPMENT_CATEGORIES[eq.category];
                        const statMeta = CALIBRATION_STATUS_META[eq.calibrationStatus];
                        return (
                          <tr key={eq.id} className="hover:bg-stone-50 dark:hover:bg-stone-950/60">
                            <td className="p-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                              {eq.code}
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-stone-900 dark:text-stone-100 block">
                                {eq.nameFa}
                              </span>
                              <span className="text-[11px] text-stone-400 font-sans" dir="ltr">
                                {eq.nameEn}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span
                                className="text-[11px] px-2 py-0.5 rounded font-semibold text-white inline-block"
                                style={{ backgroundColor: catMeta?.color || '#78716c' }}
                              >
                                {catMeta?.titleFa || eq.category}
                              </span>
                            </td>
                            <td className="p-3.5 text-emerald-700 dark:text-emerald-400 font-medium">
                              {eq.specifications?.accuracy || 'طبق روش استاندارد'}
                            </td>
                            <td className="p-3.5 text-stone-700 dark:text-stone-300">
                              {eq.specifications?.capacity || '—'}
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded border font-medium ${statMeta?.badgeColor}`}
                              >
                                {statMeta?.labelFa || eq.calibrationStatus}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-stone-600 dark:text-stone-400">
                              {eq.nextCalibrationDate || '—'}
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                onClick={() => {
                                  setSelectedEquipment(eq);
                                  setIsDetailModalOpen(true);
                                }}
                                className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs"
                              >
                                مشاهده
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <div className="p-16 text-center bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-400 text-sm">
              دستگاهی مطابق فیلترهای جستجو یافت نشد.
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: EXPERIMENT LINKER ENGINE */}
      {activeViewTab === 'linker_engine' && (
        <ExperimentRequirementInspector
          experiments={experiments}
          equipmentCatalog={equipmentList}
          initialExperimentId={preselectedExperimentCode}
          onOpenEquipmentDetail={(eq) => {
            setSelectedEquipment(eq);
            setIsDetailModalOpen(true);
          }}
        />
      )}

      {/* VIEW 3: CALIBRATION & MAINTENANCE AUDIT */}
      {activeViewTab === 'calibration_audit' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>ماتریس پایش و انطباق کالیبراسیون تجهیزات (ISO 17025)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                برنامه زمان‌بندی کالیبراسیون دوره‌ای، آزمون‌های صحت روزانه و کنترل وضعیت انقضای گواهینامه‌ها
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-semibold">
                <tr>
                  <th className="p-3.5">کد دستگاه</th>
                  <th className="p-3.5">نام دستگاه و محل استقرار</th>
                  <th className="p-3.5">روش کنترل عملکرد روزانه</th>
                  <th className="p-3.5">وضعیت کالیبراسیون</th>
                  <th className="p-3.5">آخرین کالیبراسیون</th>
                  <th className="p-3.5">کالیبراسیون بعدی</th>
                  <th className="p-3.5">مرجع کالیبراسیون</th>
                  <th className="p-3.5 text-center">شناسنامه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/60 dark:divide-stone-800">
                {equipmentList.map((eq) => {
                  const statMeta = CALIBRATION_STATUS_META[eq.calibrationStatus];
                  return (
                    <tr key={eq.id} className="hover:bg-stone-50 dark:hover:bg-stone-950/60">
                      <td className="p-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {eq.code}
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-stone-900 dark:text-stone-100 block">
                          {eq.nameFa}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {eq.location || 'آزمایشگاه عمومی'}
                        </span>
                      </td>
                      <td className="p-3.5 text-stone-700 dark:text-stone-300 max-w-xs">
                        <p className="line-clamp-2">{eq.performanceVerificationMethod}</p>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded border font-semibold ${statMeta?.badgeColor}`}
                        >
                          {statMeta?.labelFa || eq.calibrationStatus}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-stone-600 dark:text-stone-400">
                        {eq.lastCalibrationDate || '—'}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {eq.nextCalibrationDate || '—'}
                      </td>
                      <td className="p-3.5 text-stone-600 dark:text-stone-400">
                        {eq.calibrationProvider || 'داخلی'}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            setSelectedEquipment(eq);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
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
      <EquipmentDetailModal
        equipment={selectedEquipment}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSelectExperiment={(code) => {
          setPreselectedExperimentCode(code);
          setActiveViewTab('linker_engine');
        }}
      />

      <EquipmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveEquipment}
        initialData={editingEquipment}
      />
    </div>
  );
};

export default EquipmentPage;
