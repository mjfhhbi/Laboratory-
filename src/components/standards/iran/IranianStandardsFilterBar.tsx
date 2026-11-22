import React from 'react';
import {
  IranianStandardsSearchFilters,
  IranianProductGroup,
  IranianTestType,
  IranianStandardStatus,
  IRANIAN_STANDARD_STATUS_CONFIG,
  IRANIAN_PRODUCT_GROUPS_CONFIG,
  IRANIAN_TEST_TYPE_CONFIG
} from '../../../types/iranianStandard';
import {
  Search,
  Hash,
  FileText,
  Package,
  FlaskConical,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface IranianStandardsFilterBarProps {
  filters: IranianStandardsSearchFilters;
  onChange: (newFilters: IranianStandardsSearchFilters) => void;
  onReset: () => void;
  totalResults: number;
}

export const IranianStandardsFilterBar: React.FC<IranianStandardsFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalResults
}) => {
  const isFiltered =
    Boolean(filters.query) ||
    Boolean(filters.standardNumberQuery) ||
    Boolean(filters.titleQuery) ||
    Boolean(filters.productQuery) ||
    Boolean(filters.testQuery) ||
    (filters.productGroup && filters.productGroup !== 'all') ||
    (filters.testType && filters.testType !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    filters.mandatoryOnly;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
      {/* Search Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. جستجو بر اساس شماره استاندارد */}
        <div className="relative">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
            شماره استاندارد (INSO / ISIRI)
          </label>
          <div className="relative">
            <Hash className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.standardNumberQuery || ''}
              onChange={(e) => onChange({ ...filters, standardNumberQuery: e.target.value })}
              placeholder="مثال: 2406 یا 2344..."
              className="w-full pl-3 pr-9 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              dir="ltr"
            />
          </div>
        </div>

        {/* 2. جستجو بر اساس عنوان */}
        <div className="relative">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
            عنوان استاندارد (فارسی / لاتین)
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.titleQuery || ''}
              onChange={(e) => onChange({ ...filters, titleQuery: e.target.value })}
              placeholder="مثال: شیر پاستوریزه، روغن زیتون..."
              className="w-full pl-3 pr-9 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* 3. جستجو بر اساس محصول */}
        <div className="relative">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
            محصول غذایی مرتبط
          </label>
          <div className="relative">
            <Package className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.productQuery || ''}
              onChange={(e) => onChange({ ...filters, productQuery: e.target.value })}
              placeholder="مثال: پنیر لاکتیکی، آرد سنگک..."
              className="w-full pl-3 pr-9 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* 4. جستجو بر اساس آزمون */}
        <div className="relative">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
            عنوان یا روش آزمون
          </label>
          <div className="relative">
            <FlaskConical className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.testQuery || ''}
              onChange={(e) => onChange({ ...filters, testQuery: e.target.value })}
              placeholder="مثال: اسیدیته دورنیک، چربی، پراکسید..."
              className="w-full pl-3 pr-9 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
        {/* فیلتر بر اساس گروه محصول */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
            گروه محصول غذایی
          </label>
          <select
            value={filters.productGroup || 'all'}
            onChange={(e) =>
              onChange({ ...filters, productGroup: e.target.value as IranianProductGroup | 'all' })
            }
            className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="all">همه گروه‌های محصول</option>
            {Object.entries(IRANIAN_PRODUCT_GROUPS_CONFIG).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.titleFa}
              </option>
            ))}
          </select>
        </div>

        {/* فیلتر بر اساس نوع آزمون */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
            نوع آزمون آزمایشگاهی
          </label>
          <select
            value={filters.testType || 'all'}
            onChange={(e) =>
              onChange({ ...filters, testType: e.target.value as IranianTestType | 'all' })
            }
            className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="all">همه انواع آزمون</option>
            {Object.entries(IRANIAN_TEST_TYPE_CONFIG).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.labelFa}
              </option>
            ))}
          </select>
        </div>

        {/* فیلتر وضعیت استاندارد */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
            وضعیت استاندارد ملی
          </label>
          <select
            value={filters.status || 'all'}
            onChange={(e) =>
              onChange({ ...filters, status: e.target.value as IranianStandardStatus | 'all' })
            }
            className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="valid">✅ معتبر (جاری و نافذ)</option>
            <option value="obsolete">❌ منسوخ (ابطال‌شده)</option>
            <option value="superseded">⚠️ جایگزین‌شده (با استاندارد جدید)</option>
            <option value="needs_review">❓ نیازمند بررسی (پیش‌نویس / استعلام)</option>
          </select>
        </div>

        {/* چک‌باکس و بازنشانی */}
        <div className="flex items-end justify-between gap-2">
          <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 select-none py-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(filters.mandatoryOnly)}
              onChange={(e) => onChange({ ...filters, mandatoryOnly: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 dark:border-stone-700"
            />
            <span className="font-medium">فقط استانداردهای اجباری</span>
          </label>

          {isFiltered && (
            <button
              onClick={onReset}
              className="px-3 py-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="پاک کردن فیلترها"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Count and Active Filters Summary */}
      <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>تعداد استانداردهای منطبق:</span>
          <span className="font-bold text-stone-900 dark:text-stone-100 font-mono text-sm">
            {totalResults}
          </span>
          <span>مورد</span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-stone-400">راهنما:</span>
          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> معتبر
          </span>
          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> جایگزین‌شده
          </span>
          <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> منسوخ
          </span>
          <span className="inline-flex items-center gap-1 text-stone-600 dark:text-stone-400">
            <span className="w-2 h-2 rounded-full bg-stone-400"></span> نیازمند بررسی
          </span>
        </div>
      </div>
    </div>
  );
};
