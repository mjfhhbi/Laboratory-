import React from 'react';
import {
  ExperimentDomain,
  EXPERIMENT_DOMAINS,
  ExperimentSearchFilters
} from '../../types/foodExperiment';
import {
  Search,
  RotateCcw,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Globe,
  WifiOff,
  SlidersHorizontal,
  FlaskConical,
  Microscope,
  Activity,
  Eye,
  TestTubes,
  Package,
  Droplets,
  Milk,
  Wheat,
  Beef,
  CupSoda,
  Apple,
  Archive,
  Layers
} from 'lucide-react';

interface ExperimentsFilterBarProps {
  filters: ExperimentSearchFilters;
  onFilterChange: (newFilters: Partial<ExperimentSearchFilters>) => void;
  onResetFilters: () => void;
  domainsCounts?: Record<ExperimentDomain, number>;
  totalCount: number;
}

const DOMAIN_ICONS: Record<ExperimentDomain, React.ElementType> = {
  food_chemistry: FlaskConical,
  microbiology: Microscope,
  food_physics: Activity,
  quality_control: ShieldCheck,
  sensory_evaluation: Eye,
  food_analysis: TestTubes,
  packaging: Package,
  oils_fats: Droplets,
  dairy: Milk,
  cereals: Wheat,
  meat_products: Beef,
  beverages: CupSoda,
  fruits_vegetables: Apple,
  canned_foods: Archive,
  other_food_products: Layers
};

export const ExperimentsFilterBar: React.FC<ExperimentsFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  domainsCounts,
  totalCount
}) => {
  const isFiltered =
    Boolean(filters.query) ||
    filters.domain !== 'all' ||
    filters.standardOrganization !== 'all' ||
    filters.verificationStatus !== 'all' ||
    filters.reliabilityGrade !== 'all' ||
    filters.offlineOnly ||
    filters.verifiedOnly;

  return (
    <div className="space-y-4 mb-6" id="experiments-filter-bar">
      {/* Top Search and Main Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
          <input
            id="exp-search-input"
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange({ query: e.target.value })}
            placeholder="جستجوی عنوان آزمایش، کد، اصل روش، استاندارد مرجع، دستگاه یا معرف..."
            className="w-full pl-4 pr-11 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
          {filters.query && (
            <button
              onClick={() => onFilterChange({ query: '' })}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800"
            >
              پاک کردن
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Standard Org */}
          <select
            id="exp-org-filter"
            value={filters.standardOrganization}
            onChange={(e) => onFilterChange({ standardOrganization: e.target.value as any })}
            className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">همه مراجع استاندارد</option>
            <option value="INSO">استاندارد ملی ایران (INSO)</option>
            <option value="ISO">سازمان بین‌المللی ایزو (ISO)</option>
            <option value="AOAC">روش‌های رسمی AOAC</option>
            <option value="ASTM">استانداردهای ASTM</option>
            <option value="Codex">کدکس بین‌المللی (Codex)</option>
            <option value="AOCS">انجمن شیمیدان‌های روغن (AOCS)</option>
            <option value="IDF">فدراسیون بین‌المللی شیر (IDF)</option>
          </select>

          {/* Verification Status */}
          <select
            id="exp-status-filter"
            value={filters.verificationStatus}
            onChange={(e) => onFilterChange({ verificationStatus: e.target.value as any })}
            className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">همه سطوح اعتبار</option>
            <option value="verified_standard">تاییدشده استاندارد رسمی (Grade A)</option>
            <option value="peer_reviewed">مقاله داوری‌شده علمی</option>
            <option value="academic_textbook">کتاب و هندبوک دانشگاهی</option>
            <option value="unverified_pending_review">پیش‌نویس / در دست بررسی</option>
          </select>

          {/* Toggles */}
          <button
            type="button"
            onClick={() => onFilterChange({ verifiedOnly: !filters.verifiedOnly })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              filters.verifiedOnly
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>فقط پروتکل‌های رسمی</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ offlineOnly: !filters.offlineOnly })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              filters.offlineOnly
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>آفلاین</span>
          </button>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors border border-rose-200 dark:border-rose-800"
              title="بازنشانی فیلترها"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی</span>
            </button>
          )}
        </div>
      </div>

      {/* 15 Domain Filter Pills Horizontal Scroll */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700">
          <button
            id="exp-domain-all"
            type="button"
            onClick={() => onFilterChange({ domain: 'all' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              filters.domain === 'all'
                ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <span>همه حوزه‌ها</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20">
              {totalCount}
            </span>
          </button>

          {(Object.keys(EXPERIMENT_DOMAINS) as ExperimentDomain[]).map((domKey) => {
            const meta = EXPERIMENT_DOMAINS[domKey];
            const isSelected = filters.domain === domKey;
            const count = domainsCounts?.[domKey] ?? 0;
            const Icon = DOMAIN_ICONS[domKey] || FlaskConical;

            return (
              <button
                id={`exp-domain-${domKey}`}
                key={domKey}
                type="button"
                onClick={() => onFilterChange({ domain: domKey })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-stone-500 dark:text-stone-400'}`} />
                <span>{meta.titleFa}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
