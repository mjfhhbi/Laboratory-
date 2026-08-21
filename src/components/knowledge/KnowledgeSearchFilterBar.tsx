import React from 'react';
import {
  KnowledgeCategory,
  VerificationStatus,
  KnowledgeSearchFilters,
  KNOWLEDGE_CATEGORIES_META
} from '../../types/knowledgeBase';
import {
  Search,
  Filter,
  X,
  ShieldCheck,
  ShieldAlert,
  HardDrive,
  FileCheck2,
  RotateCcw
} from 'lucide-react';

interface KnowledgeSearchFilterBarProps {
  filters: KnowledgeSearchFilters;
  onFilterChange: (newFilters: KnowledgeSearchFilters) => void;
  availableTags?: string[];
  totalResults: number;
  onOpenImportExport?: () => void;
  onOpenCreateRecord?: () => void;
  onOpenCreateSource?: () => void;
}

const FOOD_CATEGORY_OPTIONS = [
  'همه گروه‌ها',
  'لبنیات و فرآورده‌های شیری',
  'فرآورده‌های گوشتی و شیلات',
  'غلات، آرد و صنعت نان',
  'نوشیدنی‌ها و آبمیوه‌ها',
  'روغن‌ها و چربی‌های خوراکی',
  'کنسروها و غذاهای آماده',
  'شیرینی و شکلات و فرآورده‌های قندی',
  'افزودنی‌ها، اسانس و هیدروکلوئیدها'
];

export const KnowledgeSearchFilterBar: React.FC<KnowledgeSearchFilterBarProps> = ({
  filters,
  onFilterChange,
  availableTags = [],
  totalResults,
  onOpenImportExport,
  onOpenCreateRecord,
  onOpenCreateSource
}) => {
  const handleQueryChange = (val: string) => {
    onFilterChange({ ...filters, query: val });
  };

  const handleVerificationChange = (status: VerificationStatus | 'all') => {
    onFilterChange({ ...filters, verificationStatus: status });
  };

  const handleFoodCatChange = (cat: string) => {
    onFilterChange({ ...filters, foodCategory: cat === 'همه گروه‌ها' ? undefined : cat });
  };

  const handleResetFilters = () => {
    onFilterChange({
      query: '',
      category: 'all',
      verificationStatus: 'all',
      foodCategory: undefined,
      tag: undefined,
      offlineOnly: false
    });
  };

  const hasActiveFilters = Boolean(
    filters.query ||
    (filters.category && filters.category !== 'all') ||
    (filters.verificationStatus && filters.verificationStatus !== 'all') ||
    filters.foodCategory ||
    filters.tag ||
    filters.offlineOnly
  );

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3">
      {/* Top Row: Search Input & Action Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.query || ''}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="جستجو در عناوین علمی، کدهای شناسایی، خلاصه، محتوا و پارامترها..."
            className="w-full pl-8 pr-10 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
            dir="auto"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => handleQueryChange('')}
              className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 absolute left-2.5 top-1/2 -translate-y-1/2"
              title="پاکسازی جستجو"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: Import/Export & Create */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenImportExport && (
            <button
              type="button"
              onClick={onOpenImportExport}
              className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              title="بارگذاری فایل‌های استاندارد معتبر یا استخراج پایگاه داده"
            >
              <HardDrive className="w-3.5 h-3.5 text-stone-500" />
              <span>ورود/خروج داده (JSON)</span>
            </button>
          )}

          {onOpenCreateSource && (
            <button
              type="button"
              onClick={onOpenCreateSource}
              className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              title="ثبت منبع علمی یا مرجع استاندارد جدید"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>ثبت منبع جدید</span>
            </button>
          )}

          {onOpenCreateRecord && (
            <button
              type="button"
              onClick={onOpenCreateRecord}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>+ رکورد دانش جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/60 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Verification Status Filter Pills */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleVerificationChange('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                !filters.verificationStatus || filters.verificationStatus === 'all'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              همه وضعیت‌ها
            </button>

            <button
              type="button"
              onClick={() => handleVerificationChange('official_regulatory')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                filters.verificationStatus === 'official_regulatory'
                  ? 'bg-amber-600 text-white shadow-2xs font-bold'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>استاندارد رسمی</span>
            </button>

            <button
              type="button"
              onClick={() => handleVerificationChange('verified_with_source')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                filters.verificationStatus === 'verified_with_source'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>تأییدشده با منبع</span>
            </button>

            <button
              type="button"
              onClick={() => handleVerificationChange('unverified_pending_review')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                filters.verificationStatus === 'unverified_pending_review'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>در انتظار بررسی</span>
            </button>
          </div>

          {/* Food Category Dropdown */}
          <select
            value={filters.foodCategory || 'همه گروه‌ها'}
            onChange={(e) => handleFoodCatChange(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-300 text-[11px] focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
          >
            {FOOD_CATEGORY_OPTIONS.map((fc) => (
              <option key={fc} value={fc}>
                {fc}
              </option>
            ))}
          </select>
        </div>

        {/* Results Counter & Reset Filter */}
        <div className="flex items-center gap-3 text-stone-500 dark:text-stone-400 text-[11px]">
          <span>
            تعداد یافته‌ها: <strong className="text-stone-800 dark:text-stone-200">{totalResults}</strong> رکورد
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>حذف فیلترها</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
