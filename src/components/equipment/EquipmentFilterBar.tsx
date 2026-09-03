import React from 'react';
import {
  EquipmentCategory,
  CalibrationStatus,
  EquipmentFilterQuery,
  EQUIPMENT_CATEGORIES,
  CALIBRATION_STATUS_META
} from '../../types/laboratoryEquipment';
import {
  Search,
  Filter,
  X,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';

interface EquipmentFilterBarProps {
  filters: EquipmentFilterQuery;
  onChange: (newFilters: EquipmentFilterQuery) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  categoriesCounts: Record<EquipmentCategory, number>;
}

export const EquipmentFilterBar: React.FC<EquipmentFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
  filteredCount,
  categoriesCounts
}) => {
  const categoryKeys = Object.keys(EQUIPMENT_CATEGORIES) as EquipmentCategory[];

  const isFiltered =
    Boolean(filters.query) ||
    filters.category !== 'all' ||
    filters.calibrationStatus !== 'all' ||
    filters.hasSpecificationsOnly ||
    filters.offlineOnly;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm mb-6 space-y-4">
      {/* Top row: Search and primary dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Query Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="equipment-search-input"
            type="text"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="جستجو در نام دستگاه، کد شناسایی (EQ-...)، کاربردها یا روش کنترل..."
            className="w-full pl-9 pr-10 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {filters.query && (
            <button
              onClick={() => onChange({ ...filters, query: '' })}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-3">
          <select
            id="equipment-category-select"
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value as EquipmentCategory | 'all' })}
            className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">همه ۱۷ دسته‌بندی تجهیزات ({totalCount})</option>
            {categoryKeys.map((catKey) => {
              const meta = EQUIPMENT_CATEGORIES[catKey];
              const count = categoriesCounts[catKey] || 0;
              return (
                <option key={catKey} value={catKey}>
                  {meta.titleFa} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* Calibration Status Dropdown */}
        <div className="md:col-span-3">
          <select
            id="equipment-status-select"
            value={filters.calibrationStatus}
            onChange={(e) =>
              onChange({ ...filters, calibrationStatus: e.target.value as CalibrationStatus | 'all' })
            }
            className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">همه وضعیت‌های کالیبراسیون</option>
            {Object.entries(CALIBRATION_STATUS_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.labelFa}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizontal Scrollable Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        <button
          onClick={() => onChange({ ...filters, category: 'all' })}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            filters.category === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>همه دسته‌ها</span>
          <span className="text-[10px] opacity-80">({totalCount})</span>
        </button>

        {categoryKeys.map((catKey) => {
          const meta = EQUIPMENT_CATEGORIES[catKey];
          const count = categoriesCounts[catKey] || 0;
          const isSelected = filters.category === catKey;

          return (
            <button
              key={catKey}
              onClick={() => onChange({ ...filters, category: catKey })}
              className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <span>{meta.titleFa}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Bar: Toggles, Filter counts, and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-stone-700 dark:text-stone-300 select-none">
            <input
              id="filter-specs-only"
              type="checkbox"
              checked={filters.hasSpecificationsOnly}
              onChange={(e) => onChange({ ...filters, hasSpecificationsOnly: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
            />
            <span>فقط دارای مشخصات فنی تدوین‌شده (دقت / ظرفیت)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-stone-700 dark:text-stone-300 select-none">
            <input
              id="filter-offline-only"
              type="checkbox"
              checked={filters.offlineOnly}
              onChange={(e) => onChange({ ...filters, offlineOnly: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
            />
            <span>فقط تجهیزات آفلاین و پایدار در IndexedDB</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-stone-500 dark:text-stone-400">
            نمایش <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{filteredCount}</strong> از {totalCount} دستگاه
          </span>

          {isFiltered && (
            <button
              id="reset-equipment-filters"
              onClick={onReset}
              className="flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>پاکسازی فیلترها</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
