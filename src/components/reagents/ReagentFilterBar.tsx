/**
 * Chemical Reagents Filter and Search Toolbar
 * Food Science AI Lab Suite - Part 13
 */

import React from 'react';
import {
  ReagentFilterQuery,
  ChemicalFamily,
  ReagentGrade,
  GhsPictogramCode,
  CHEMICAL_FAMILY_META,
  REAGENT_GRADE_META,
  GHS_PICTOGRAM_META
} from '../../types/chemicalReagent';
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  Beaker,
  AlertTriangle
} from 'lucide-react';

interface ReagentFilterBarProps {
  filterQuery: ReagentFilterQuery;
  onFilterChange: (query: ReagentFilterQuery) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export const ReagentFilterBar: React.FC<ReagentFilterBarProps> = ({
  filterQuery,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount
}) => {
  const hasActiveFilters =
    (filterQuery.searchTerm && filterQuery.searchTerm !== '') ||
    (filterQuery.family && filterQuery.family !== 'all') ||
    (filterQuery.grade && filterQuery.grade !== 'all') ||
    (filterQuery.hazardPictogram && filterQuery.hazardPictogram !== 'all') ||
    (filterQuery.stockStatus && filterQuery.stockStatus !== 'all');

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs p-4 space-y-3">
      {/* Primary Search & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجوی هوشمند در بانک مواد (نام فارسی، انگلیسی، فرمول شیمیایی، شماره CAS یا نام آزمون)..."
            value={filterQuery.searchTerm || ''}
            onChange={(e) => onFilterChange({ ...filterQuery, searchTerm: e.target.value })}
            className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-xs text-stone-700 dark:text-stone-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={filterQuery.sortBy || 'name'}
              onChange={(e) => onFilterChange({ ...filterQuery, sortBy: e.target.value as any })}
              className="bg-transparent focus:outline-none text-xs"
            >
              <option value="name">مرتب‌سازی: نام ماده</option>
              <option value="cas">مرتب‌سازی: شماره CAS</option>
              <option value="purity">مرتب‌سازی: درصد خلوص</option>
              <option value="stock">مرتب‌سازی: موجودی انبار</option>
              <option value="updatedAt">مرتب‌سازی: آخرین بروزرسانی</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors shrink-0"
              title="پاک کردن فیلترها"
            >
              <X className="w-3.5 h-3.5" />
              <span>حذف فیلترها</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        {/* Family */}
        <div>
          <select
            value={filterQuery.family || 'all'}
            onChange={(e) => onFilterChange({ ...filterQuery, family: e.target.value as any })}
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">همه دسته‌های شیمیایی</option>
            {Object.entries(CHEMICAL_FAMILY_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.nameFa}</option>
            ))}
          </select>
        </div>

        {/* Grade */}
        <div>
          <select
            value={filterQuery.grade || 'all'}
            onChange={(e) => onFilterChange({ ...filterQuery, grade: e.target.value as any })}
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">همه گریدهای کیفی</option>
            {Object.entries(REAGENT_GRADE_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.nameFa}</option>
            ))}
          </select>
        </div>

        {/* GHS Hazard */}
        <div>
          <select
            value={filterQuery.hazardPictogram || 'all'}
            onChange={(e) => onFilterChange({ ...filterQuery, hazardPictogram: e.target.value as any })}
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">همه خطرات GHS</option>
            {Object.entries(GHS_PICTOGRAM_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.nameFa} ({key})</option>
            ))}
          </select>
        </div>

        {/* Stock Status */}
        <div>
          <select
            value={filterQuery.stockStatus || 'all'}
            onChange={(e) => onFilterChange({ ...filterQuery, stockStatus: e.target.value as any })}
            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">وضعیت موجودی: همه</option>
            <option value="in_stock">موجود در انبار</option>
            <option value="low_stock">کسری / زیر حد هشدار</option>
            <option value="expired">منقضی شده</option>
          </select>
        </div>
      </div>

      {/* Results Count Strip */}
      <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800/80">
        <div>
          نمایش <strong className="text-stone-800 dark:text-stone-200">{filteredCount}</strong> ماده از مجموع <strong className="text-stone-800 dark:text-stone-200">{totalCount}</strong> معرف ثبت‌شده
        </div>
      </div>
    </div>
  );
};
