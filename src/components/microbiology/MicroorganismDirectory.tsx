import React, { useState } from 'react';
import { 
  Bug, 
  Search, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Dna,
  BookOpen,
  Activity,
  Layers
} from 'lucide-react';
import { MicroorganismProfile, MicrobialCategory } from '../../types/microbiology';
import { MICROORGANISMS_DATABASE } from '../../data/microbiologyData';

export const MicroorganismDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganism, setSelectedOrganism] = useState<MicroorganismProfile | null>(MICROORGANISMS_DATABASE[0] || null);

  const filteredOrganisms = MICROORGANISMS_DATABASE.filter(org => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      org.scientificName.toLowerCase().includes(q) ||
      org.nameFa.toLowerCase().includes(q) ||
      org.family.toLowerCase().includes(q) ||
      org.foodSafetySignificanceFa.toLowerCase().includes(q) ||
      org.commonFoodSources.some(f => f.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی میکروارگانیسم (نام علمی، فارسی، خانواده، ماده غذایی)..."
            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Microorganisms List */}
        <div className="lg:col-span-4 space-y-2 max-h-[750px] overflow-y-auto pr-1">
          {filteredOrganisms.map((org) => {
            const isSelected = selectedOrganism?.id === org.id;
            const isGramPositive = org.gramStain === 'gram_positive';

            return (
              <div
                key={org.id}
                onClick={() => setSelectedOrganism(org)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right ${
                  isSelected
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white dark:bg-stone-900/90 border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    isGramPositive
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  }`}>
                    {isGramPositive ? 'Gram +' : 'Gram -'}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {org.family}
                  </span>
                </div>

                <div className="mt-1.5">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 font-mono italic">
                    {org.scientificName}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-0.5">
                    {org.nameFa}
                  </p>
                </div>

                <div className="mt-2 flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                  <span>دمای بهینه: {org.optimumTemperatureC}°C</span>
                  <span>حداقل aw: {org.minimumAw}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Detailed Profile View */}
        <div className="lg:col-span-8">
          {selectedOrganism ? (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-6 shadow-xs text-right">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-stone-900 dark:text-stone-100 font-mono italic">
                      {selectedOrganism.scientificName}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      ({selectedOrganism.nameFa})
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    خانواده: <span className="font-mono">{selectedOrganism.family}</span> | رده: {selectedOrganism.category === 'pathogen' ? 'پاتوژن بیماری‌زا' : selectedOrganism.category === 'indicator' ? 'شاخص بهداشتی' : 'میکروارگانیسم فساد'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                    selectedOrganism.gramStain === 'gram_positive'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  }`}>
                    رنگ‌آمیزی گرم: {selectedOrganism.gramStain === 'gram_positive' ? 'گرم مثبت' : 'گرم منفی'}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg border border-stone-200 dark:border-stone-700">
                    مرفولوژی: {selectedOrganism.morphology === 'bacillus' ? 'باسیل (میله‌ای)' : selectedOrganism.morphology === 'coccus' ? 'کوکوس (کروی)' : 'قارچی'}
                  </span>
                </div>
              </div>

              {/* Cardinal Growth Limits Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-center space-y-1">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    محدوده دما
                  </div>
                  <div className="font-bold text-xs text-stone-800 dark:text-stone-100 font-mono">
                    {selectedOrganism.temperatureRangeC.min} الی {selectedOrganism.temperatureRangeC.max} °C
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    بهینه: {selectedOrganism.optimumTemperatureC} °C
                  </div>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-center space-y-1">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    فعالیت آبی (aw)
                  </div>
                  <div className="font-bold text-xs text-stone-800 dark:text-stone-100 font-mono">
                    حداقل {selectedOrganism.minimumAw}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400">
                    نیاز آبی رشد
                  </div>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-center space-y-1">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    محدوده pH
                  </div>
                  <div className="font-bold text-xs text-stone-800 dark:text-stone-100 font-mono">
                    {selectedOrganism.phRange.min} الی {selectedOrganism.phRange.max}
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    بهینه: {selectedOrganism.optimumPh}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-center space-y-1">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    تحمل نمک (NaCl)
                  </div>
                  <div className="font-bold text-xs text-stone-800 dark:text-stone-100 font-mono">
                    تا {selectedOrganism.maximumSaltTolerancePercent}٪
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400">
                    حداکثر نمک مجاز
                  </div>
                </div>
              </div>

              {/* Food Safety Significance & Common Foods */}
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/70 dark:border-emerald-800/70 space-y-2 text-xs">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-emerald-700" />
                    <span>اهمیت بهداشتی و مخاطرات ایمنی مواد غذایی</span>
                  </h4>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {selectedOrganism.foodSafetySignificanceFa}
                  </p>
                  {selectedOrganism.spoilageOrIllnessCharacteristics && (
                    <p className="text-stone-600 dark:text-stone-300 mt-1 pt-1 border-t border-emerald-200/40">
                      <strong className="text-stone-800 dark:text-stone-200">علائم بالینی / عوارض مسمومیت:</strong> {selectedOrganism.spoilageOrIllnessCharacteristics} ({selectedOrganism.incubationPeriodAndSymptoms})
                    </p>
                  )}
                  {selectedOrganism.heatResistanceDValue && (
                    <p className="text-stone-600 dark:text-stone-300">
                      <strong className="text-stone-800 dark:text-stone-200">مقاومت حرارتی (D-value):</strong> <span className="font-mono text-emerald-800 dark:text-emerald-300 font-bold">{selectedOrganism.heatResistanceDValue}</span>
                    </p>
                  )}
                </div>

                {/* Common Food Sources Chips */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-stone-800 dark:text-stone-200">منابع غذایی و ماتریس‌های پرخطر:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOrganism.commonFoodSources.map((source, i) => (
                      <span key={i} className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs border border-stone-200 dark:border-stone-700">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Biochemical Identification Matrix */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <Dna className="w-4 h-4 text-purple-600" />
                  <span>پروفایل بیوشیمیایی و آزمون‌های تایید تشخیصی</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {Object.entries(selectedOrganism.biochemicalProfile).map(([key, val]) => {
                    const isPositive = val === 'positive';
                    const isNegative = val === 'negative';
                    return (
                      <div key={key} className="p-2 bg-stone-50 dark:bg-stone-800/40 rounded-lg border border-stone-200/50 dark:border-stone-700 flex items-center justify-between">
                        <span className="font-mono text-[11px] text-stone-600 dark:text-stone-300 uppercase">{key}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isPositive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isNegative
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {isPositive ? 'مثبت (+)' : isNegative ? 'منفی (-)' : 'متغیر'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Standard Limits (INSO 2394) */}
              {selectedOrganism.typicalStandardsLimits && (
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>حدود استاندارد ملی در مواد غذایی (INSO 2394 / استانداردهای فرآورده)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedOrganism.typicalStandardsLimits.map((lim, i) => (
                      <div key={i} className="p-2.5 bg-stone-50 dark:bg-stone-800/30 rounded-xl border border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                        <span className="font-semibold text-stone-800 dark:text-stone-200">{lim.foodCategory}</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{lim.limitDescription}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <p className="text-xs text-stone-500">لطفاً یک میکروارگانیسم را از لیست انتخاب کنید.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
