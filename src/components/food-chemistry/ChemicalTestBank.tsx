import React, { useState } from 'react';
import { 
  FlaskConical, 
  ShieldCheck, 
  Calculator, 
  FileText, 
  Layers, 
  ArrowLeft, 
  Atom, 
  Sparkles, 
  Play, 
  Scale, 
  Droplets, 
  Flame, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { FoodChemistryTest } from '../../types/foodChemistry';
import { FOOD_CHEMISTRY_CATEGORIES } from '../../data/foodChemistryData';

interface ChemicalTestBankProps {
  tests: FoodChemistryTest[];
  searchTerm: string;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onSelectTest: (test: FoodChemistryTest) => void;
  onLaunchInLabEngine: (test: FoodChemistryTest) => void;
}

export const ChemicalTestBank: React.FC<ChemicalTestBankProps> = ({
  tests,
  searchTerm,
  selectedCategory,
  onCategoryChange,
  onSelectTest,
  onLaunchInLabEngine
}) => {
  const filteredTests = tests.filter((test) => {
    // Category match
    if (selectedCategory !== 'all' && test.category !== selectedCategory) {
      return false;
    }
    // Search match
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = test.titleFa.toLowerCase().includes(term) || test.titleEn.toLowerCase().includes(term);
      const matchAnalyte = test.analyteFa.toLowerCase().includes(term) || test.analyteEn.toLowerCase().includes(term);
      const matchStd = test.primaryStandard.standardNumber.toLowerCase().includes(term) || test.primaryStandard.organization.toLowerCase().includes(term);
      const matchReagent = test.requiredReagents.some(r => r.nameFa.toLowerCase().includes(term) || r.nameEn.toLowerCase().includes(term));
      return matchTitle || matchAnalyte || matchStd || matchReagent;
    }
    return true;
  });

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'proximate_moisture':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'proximate_ash':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'proximate_protein':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'proximate_fat':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'proximate_fiber':
        return 'bg-lime-50 text-lime-800 border-lime-200';
      case 'carbohydrates_sugars':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'acidity_ph':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'minerals_salts':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'refractometry_density':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'pigments_colorants':
        return 'bg-pink-50 text-pink-800 border-pink-200';
      case 'antioxidants_phenolics':
        return 'bg-violet-50 text-violet-800 border-violet-200';
      case 'lipids_quality':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'vitamins_preservatives':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div id="chemical-tests-bank-container" className="space-y-6">
      {/* Categories Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-thin">
        {FOOD_CHEMISTRY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            id={`category-pill-${cat.id}`}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{cat.labelFa}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              selectedCategory === cat.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tests Results Count & Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>نمایش <strong>{filteredTests.length}</strong> روش آزمون تحلیلی شیمیایی استاندارد</span>
        {searchTerm && <span>فیلتر شده بر اساس عبارت: «{searchTerm}»</span>}
      </div>

      {/* Test Cards Grid */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const badgeStyle = getCategoryBadgeColor(test.category);

            return (
              <div
                key={test.id}
                id={`test-card-${test.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-indigo-300"
              >
                {/* Top Section */}
                <div className="p-5 space-y-3.5">
                  {/* Category & Standard Code */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeStyle}`}>
                      {test.code}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {test.primaryStandard.organization} {test.primaryStandard.standardNumber}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                      {test.titleFa}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5 line-clamp-1" dir="ltr">
                      {test.titleEn}
                    </p>
                  </div>

                  {/* Analyte & Objective */}
                  <div className="space-y-1 text-xs">
                    <div className="font-semibold text-slate-700">
                      آنالیت هدف: <span className="text-slate-900 font-normal">{test.analyteFa}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">
                      {test.objectiveFa}
                    </p>
                  </div>

                  {/* Quick Specs Box */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">واحد نتیجه:</span>
                      <span className="font-mono font-bold text-slate-800">{test.calculationRules.unitResult}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">ماتریس کاربرد:</span>
                      <span className="text-slate-700 truncate max-w-[170px]" title={test.primaryStandard.scopeAndMatrix}>
                        {test.primaryStandard.scopeAndMatrix}
                      </span>
                    </div>
                    {test.alternativeMethods && test.alternativeMethods.length > 0 && (
                      <div className="flex items-center justify-between text-[11px] text-indigo-700 font-medium pt-1 border-t border-slate-200/60">
                        <span>روش‌های موازی استاندارد:</span>
                        <span>{test.alternativeMethods.length} روش جایگزین</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                  <button
                    id={`btn-view-sop-${test.id}`}
                    onClick={() => onSelectTest(test)}
                    className="flex-1 py-2 px-3 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    مشاهده SOP و جزئیات
                  </button>

                  <button
                    id={`btn-launch-lab-${test.id}`}
                    onClick={() => onLaunchInLabEngine(test)}
                    title="اجرای مستقیم در موتور هوشمند آزمایشگاه"
                    className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    آزمایشگاه
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FlaskConical className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">هیچ آزمون شیمیایی منطبق بر جستجوی شما یافت نشد</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            عبارت دیگری جستجو کنید یا فیلتر دسته‌بندی را روی «همه آزمون‌های شیمیایی» قرار دهید.
          </p>
        </div>
      )}
    </div>
  );
};
