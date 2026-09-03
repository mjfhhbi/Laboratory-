import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  BookOpen, 
  FileText, 
  Layers, 
  Sparkles, 
  XCircle,
  HelpCircle,
  Thermometer,
  Microscope,
  ShieldCheck
} from 'lucide-react';
import { COMMON_MICROBIOLOGY_ERRORS } from '../../data/microbiologyData';

export const MicrobiologyQCAndTroubleshooting: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedError, setSelectedError] = useState(COMMON_MICROBIOLOGY_ERRORS[0] || null);

  const filteredErrors = COMMON_MICROBIOLOGY_ERRORS.filter(err => {
    const matchesCat = selectedCategory === 'all' || err.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQ = !q ||
      err.titleFa.toLowerCase().includes(q) ||
      err.symptomFa.toLowerCase().includes(q) ||
      err.rootCauseFa.toLowerCase().includes(q) ||
      err.standardSource.toLowerCase().includes(q);

    return matchesCat && matchesQ;
  });

  return (
    <div className="space-y-6 text-right">
      {/* Top Header info */}
      <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>راهنمای عیب‌یابی و کنترل کیفیت میکروبیولوژی (ISO 7218 / ISO 11133)</span>
          </div>
          <p className="text-stone-600 dark:text-stone-300">
            بررسی جامع خطاهای رایج آزمایشگاهی بر مبنای ۵ اصل: علت احتمالی، نشانه، روش بررسی، اقدام اصلاحی و پیشگیری بر اساس رفرنس معتبر.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در خطاهای میکروبی (شوک حرارتی، کلنی‌های رونده، آلودگی هوا، محیط کشت)..."
            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Errors List */}
        <div className="lg:col-span-5 space-y-2 max-h-[750px] overflow-y-auto pr-1">
          {filteredErrors.map((err) => {
            const isSelected = selectedError?.id === err.id;

            return (
              <div
                key={err.id}
                onClick={() => setSelectedError(err)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right ${
                  isSelected
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                    : 'bg-white dark:bg-stone-900/90 border-stone-200 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                    {err.category}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {err.standardSource}
                  </span>
                </div>

                <div className="mt-1.5">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {err.titleFa}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    نشانه: {err.symptomFa}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: 5-Pillar Detailed Troubleshooting View */}
        <div className="lg:col-span-7">
          {selectedError ? (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-5 shadow-xs text-right">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                    {selectedError.category}
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">
                    {selectedError.titleFa}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-stone-500">
                  مرجع: {selectedError.standardSource}
                </span>
              </div>

              {/* 5 Pillars Cards */}
              <div className="space-y-3 text-xs">
                {/* 1. Root Cause */}
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/70 dark:border-stone-700/70 space-y-1">
                  <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>۱. علت ریشه‌ای احتمالی (Root Cause)</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed pr-5">
                    {selectedError.rootCauseFa}
                  </p>
                </div>

                {/* 2. Symptom */}
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/70 dark:border-stone-700/70 space-y-1">
                  <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                    <Microscope className="w-3.5 h-3.5 shrink-0" />
                    <span>۲. نشانه‌ها و شواهد مشاهده‌شده (Symptoms)</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed pr-5">
                    {selectedError.symptomFa}
                  </p>
                </div>

                {/* 3. Investigation Method */}
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/70 dark:border-stone-700/70 space-y-1">
                  <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                    <Search className="w-3.5 h-3.5 shrink-0" />
                    <span>۳. روش بررسی و تشخیص آزمایشگاهی (Diagnostic Method)</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed pr-5">
                    {selectedError.investigationMethodFa}
                  </p>
                </div>

                {/* 4. Corrective Action */}
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/70 dark:border-stone-700/70 space-y-1">
                  <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>۴. اقدام اصلاحی فوری (Corrective Action)</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed pr-5">
                    {selectedError.correctiveActionFa}
                  </p>
                </div>

                {/* 5. Preventive Action */}
                <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>۵. روش پیشگیری دائمی (Preventive Protocol)</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed pr-5">
                    {selectedError.preventiveActionFa}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <p className="text-xs text-stone-500">لطفاً یک مورد خطا را انتخاب کنید.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
