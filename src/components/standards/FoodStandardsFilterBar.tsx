import React from 'react';
import {
  FoodStandardSearchFilters,
  StandardJurisdiction,
  FoodStandardSector,
  FOOD_STANDARD_SECTORS,
  StandardLifecycleStatus
} from '../../types/foodStandard';
import {
  Search,
  Plus,
  Upload,
  Filter,
  Layers,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface FoodStandardsFilterBarProps {
  filters: FoodStandardSearchFilters;
  onFilterChange: (filters: FoodStandardSearchFilters) => void;
  totalResults: number;
  iranianCount: number;
  internationalCount: number;
  onOpenCreateStandard: () => void;
  onOpenImportExport: () => void;
}

export const FoodStandardsFilterBar: React.FC<FoodStandardsFilterBarProps> = ({
  filters,
  onFilterChange,
  totalResults,
  iranianCount,
  internationalCount,
  onOpenCreateStandard,
  onOpenImportExport
}) => {
  const handleQueryChange = (val: string) => {
    onFilterChange({ ...filters, query: val });
  };

  const handleJurisdictionChange = (jur: StandardJurisdiction | 'all') => {
    onFilterChange({ ...filters, jurisdiction: jur });
  };

  const handleSectorChange = (sector: FoodStandardSector | 'all') => {
    onFilterChange({ ...filters, sector });
  };

  const handleStatusChange = (status: StandardLifecycleStatus | 'all') => {
    onFilterChange({ ...filters, lifecycleStatus: status });
  };

  const handleReset = () => {
    onFilterChange({
      query: '',
      jurisdiction: 'all',
      sector: 'all',
      lifecycleStatus: 'all',
      verificationStatus: 'all',
      hasAcceptableLimitsOnly: false,
      offlineOnly: false
    });
  };

  const hasActiveFilters =
    Boolean(filters.query) ||
    (filters.jurisdiction && filters.jurisdiction !== 'all') ||
    (filters.sector && filters.sector !== 'all') ||
    (filters.lifecycleStatus && filters.lifecycleStatus !== 'all') ||
    (filters.verificationStatus && filters.verificationStatus !== 'all');

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Bar: Search input & Main Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.query || ''}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="جستجو در شماره استاندارد (INSO / Codex)، عنوان، دامنه کاربرد، تجهیزات، معرف‌ها یا حدود مجاز..."
            className="w-full pl-4 pr-10 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenImportExport}
            className="px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            title="ورود و صدور داده‌های استاندارد (JSON Bundle)"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ورود / صدور داده</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateStandard}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت استاندارد جدید</span>
          </button>
        </div>
      </div>

      {/* Jurisdiction Segregation Tabs: STRICT ISOLATION OF IRAN VS FOREIGN STANDARDS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => handleJurisdictionChange('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              !filters.jurisdiction || filters.jurisdiction === 'all'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            همه استانداردها ({totalResults})
          </button>

          <button
            type="button"
            onClick={() => handleJurisdictionChange('iranian_national')}
            className={`px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 ${
              filters.jurisdiction === 'iranian_national'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <span>🇮🇷</span>
            <span>استانداردهای ملی ایران ({iranianCount})</span>
          </button>

          <button
            type="button"
            onClick={() => handleJurisdictionChange('international_foreign')}
            className={`px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 ${
              filters.jurisdiction === 'international_foreign'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>استانداردهای بین‌المللی و خارجی ({internationalCount})</span>
          </button>
        </div>

        {/* Sector Scope Filter & Lifecycle Dropdown */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Sector Filter */}
          <select
            value={filters.sector || 'all'}
            onChange={(e) => handleSectorChange(e.target.value as FoodStandardSector | 'all')}
            className="px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium"
          >
            <option value="all">همه حوزه‌های غذایی (Sectors)</option>
            {Object.values(FOOD_STANDARD_SECTORS).map((s) => (
              <option key={s.id} value={s.id}>
                {s.titleFa}
              </option>
            ))}
          </select>

          {/* Lifecycle Status Filter */}
          <select
            value={filters.lifecycleStatus || 'all'}
            onChange={(e) => handleStatusChange(e.target.value as StandardLifecycleStatus | 'all')}
            className="px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">معتبر و جاری</option>
            <option value="under_revision">در حال بازنگری</option>
            <option value="withdrawn">ابطال‌شده</option>
            <option value="draft">پیش‌نویس</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="پاک‌کردن فیلترها"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
