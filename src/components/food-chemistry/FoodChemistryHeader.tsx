import React from 'react';
import { 
  Atom, 
  Search, 
  ShieldCheck, 
  FlaskConical, 
  Calculator, 
  BookOpen, 
  Layers,
  Sparkles,
  PieChart
} from 'lucide-react';
import { FOOD_INDUSTRY_SECTORS } from '../../data/foodChemistryData';

interface FoodChemistryHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSector: string;
  onSectorChange: (sectorId: string) => void;
  activeTab: 'tests' | 'components' | 'calculator' | 'standards';
  onTabChange: (tab: 'tests' | 'components' | 'calculator' | 'standards') => void;
  totalTestsCount: number;
}

export const FoodChemistryHeader: React.FC<FoodChemistryHeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedSector,
  onSectorChange,
  activeTab,
  onTabChange,
  totalTestsCount
}) => {
  return (
    <div id="food-chemistry-header-section" className="bg-slate-900 border-b border-slate-800 text-white pt-8 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Badges & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Atom className="w-3.5 h-3.5" />
                شیمی و آنالیز دستگاهی مواد غذایی
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                استانداردهای INSO / AOAC / ISO / AOCS
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {totalTestsCount} روش استاندارد صحه‌گذاری‌شده
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              پایگاه جامع آزمون‌های شیمیایی و ترکیبات مواد غذایی
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
              پروتکل‌های معتبر آنالیز تقریبی (Proximate Analysis)، رطوبت، خاکستر، پروتئین، چربی، فیبر، قندها، اسیدیته، نمک، بریکس، رنگدانه‌ها، آنتی‌اکسیدان‌ها و کیفیت چربی منطبق بر مراجع بین‌المللی با موتور محاسباتی زنده.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center shrink-0">
            <div className="px-2 py-1">
              <div className="text-lg sm:text-xl font-bold text-indigo-400">۱۳</div>
              <div className="text-xs text-slate-400">آزمون تحلیلی</div>
            </div>
            <div className="px-2 py-1 border-r border-l border-slate-700">
              <div className="text-lg sm:text-xl font-bold text-emerald-400">۶</div>
              <div className="text-xs text-slate-400">ترکیب بنیادین</div>
            </div>
            <div className="px-2 py-1">
              <div className="text-lg sm:text-xl font-bold text-amber-400">۱۰۰٪</div>
              <div className="text-xs text-slate-400">مستند به رفرنس</div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
          <button
            id="tab-btn-chemical-tests"
            onClick={() => onTabChange('tests')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'tests'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            بانک روش‌های آزمون شیمیایی ({totalTestsCount})
          </button>

          <button
            id="tab-btn-major-components"
            onClick={() => onTabChange('components')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'components'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <PieChart className="w-4 h-4" />
            ترکیبات اصلی مواد غذایی (Proximate)
          </button>

          <button
            id="tab-btn-calculator-engine"
            onClick={() => onTabChange('calculator')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            موتور محاسبات زنده آزمایشگاهی
          </button>

          <button
            id="tab-btn-standards-guide"
            onClick={() => onTabChange('standards')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'standards'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            راهنمای مراجع و روش‌های موازی
          </button>
        </div>

        {/* Search & Sector Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="food-chem-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="جستجو در آزمون‌ها، آنالیت‌ها (پروتئین، رطوبت، پراکسید...)، کدهای استاندارد (INSO, AOAC) و معرف‌ها..."
              className="w-full pl-4 pr-11 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-700"
              >
                پاکسازی
              </button>
            )}
          </div>

          {/* Sectors Horizontal Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap ml-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              صنعت:
            </span>
            {FOOD_INDUSTRY_SECTORS.map((sector) => (
              <button
                key={sector.id}
                id={`sector-pill-${sector.id}`}
                onClick={() => onSectorChange(sector.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedSector === sector.id
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sector.nameFa}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
