import React, { useState } from 'react';
import { 
  FlaskConical, 
  Search, 
  Calculator, 
  Thermometer, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Scale, 
  Layers,
  BookOpen,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CultureMediaItem } from '../../types/microbiology';
import { CULTURE_MEDIA_DATABASE } from '../../data/microbiologyData';

export const CultureMediaDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<CultureMediaItem | null>(CULTURE_MEDIA_DATABASE[0] || null);
  const [batchVolumeMl, setBatchVolumeMl] = useState<number>(500);

  const filteredMedia = CULTURE_MEDIA_DATABASE.filter(media => {
    const q = searchQuery.toLowerCase().trim();
    return !q ||
      media.code.toLowerCase().includes(q) ||
      media.nameFa.toLowerCase().includes(q) ||
      media.nameEn.toLowerCase().includes(q) ||
      media.formulaGPerLiter.some(c => c.ingredientFa.toLowerCase().includes(q) || c.ingredientEn.toLowerCase().includes(q));
  });

  const totalGramsPerLiter = selectedMedia ? selectedMedia.totalGramsPerLiter : 0;
  const calculatedPowderGrams = selectedMedia 
    ? Math.round(((totalGramsPerLiter * batchVolumeMl) / 1000) * 100) / 100
    : 0;
  const estimatedPlates = Math.floor(batchVolumeMl / 18); // ~18mL per petri dish

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
            placeholder="جستجوی محیط کشت (PCA, VRBA, بلاد آگار، بافر پپتون واتر، ترکیبات)..."
            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Media List */}
        <div className="lg:col-span-4 space-y-2 max-h-[750px] overflow-y-auto pr-1">
          {filteredMedia.map((media) => {
            const isSelected = selectedMedia?.id === media.id;
            const isSolid = media.physicalForm === 'ready_to_use_agar' || media.physicalForm === 'dehydrated_powder';

            return (
              <div
                key={media.id}
                onClick={() => setSelectedMedia(media)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right ${
                  isSelected
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white dark:bg-stone-900/90 border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    {media.code}
                  </span>
                  <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800">
                    {media.mediaType === 'selective' ? 'محیط انتخابی' : media.mediaType === 'differential' ? 'افتراقی' : media.mediaType === 'enrichment' ? 'غنی‌کننده' : 'عمومی / مغذی'}
                  </span>
                </div>

                <div className="mt-2">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {media.nameFa}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-0.5 line-clamp-1" dir="ltr">
                    {media.nameEn}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800/80 pt-1.5">
                  <span>pH: {media.finalPhAt25C}</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{media.totalGramsPerLiter} g/L</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Detailed Media Profile + Interactive Batch Calculator */}
        <div className="lg:col-span-8 space-y-6">
          {selectedMedia ? (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-6 shadow-xs text-right">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      {selectedMedia.code}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {selectedMedia.nameFa}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 font-mono" dir="ltr">
                    {selectedMedia.nameEn}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg border border-stone-200 dark:border-stone-700">
                    نوع: {selectedMedia.mediaType}
                  </span>
                </div>
              </div>

              {/* Interactive Media Batch Preparation Calculator */}
              <div className="p-4.5 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-emerald-500/10 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      ماشین حساب توزیع و ساخت بچ محیط کشت
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                    غلظت کل: {totalGramsPerLiter.toFixed(1)} g/L
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-semibold text-stone-700 dark:text-stone-300">
                      حجم مورد نیاز برای ساخت (mL):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="50"
                        max="5000"
                        step="50"
                        value={batchVolumeMl}
                        onChange={(e) => setBatchVolumeMl(Math.max(10, Number(e.target.value) || 0))}
                        className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono font-bold text-stone-900 dark:text-stone-100 text-center"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 text-center space-y-0.5 shadow-2xs">
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-emerald-600" />
                      جرم پودر محیط جهت توزین
                    </div>
                    <div className="text-base font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {calculatedPowderGrams} <span className="text-xs font-normal">گرم</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-center space-y-0.5 shadow-2xs">
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      تعداد تقریبی پلیت استاندارد
                    </div>
                    <div className="text-base font-mono font-bold text-stone-800 dark:text-stone-200">
                      ~ {estimatedPlates} <span className="text-xs font-normal">پلیت (۱۸ mL)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 border-t border-emerald-200/40">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">حجم‌های سریع:</span>
                  {[100, 250, 500, 1000, 2000].map(vol => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setBatchVolumeMl(vol)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-md transition-colors ${
                        batchVolumeMl === vol
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100'
                      }`}
                    >
                      {vol} mL
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulation & Composition Table */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-emerald-600" />
                    فرمولاسیون دقیق ترکیب (g/L در ۱۰۰۰ میلی‌لیتر آب مقطر)
                  </span>
                  <span className="font-mono text-stone-500">pH نهایی در ۲۵ درجه: {selectedMedia.finalPhAt25C}</span>
                </h4>
                <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800">
                      <tr>
                        <th className="py-2 px-3 font-semibold">ماده متشکله (Ingredient)</th>
                        <th className="py-2 px-3 font-semibold text-center w-28">مقدار در ۱ لیتر</th>
                        <th className="py-2 px-3 font-semibold text-center w-32">توزین برای {batchVolumeMl} mL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {selectedMedia.formulaGPerLiter.map((comp, idx) => {
                        const scaledComp = Math.round(((comp.amountGrams * batchVolumeMl) / 1000) * 100) / 100;
                        return (
                          <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                            <td className="py-2 px-3 font-medium text-stone-800 dark:text-stone-200">
                              <span>{comp.ingredientFa}</span>
                              <span className="block text-[10px] text-stone-400 font-mono" dir="ltr">{comp.ingredientEn}</span>
                            </td>
                            <td className="py-2 px-3 font-mono text-center text-stone-600 dark:text-stone-400">
                              {comp.amountGrams} g
                            </td>
                            <td className="py-2 px-3 font-mono text-center font-bold text-emerald-700 dark:text-emerald-400">
                              {scaledComp} g
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Preparation SOP & Autoclave Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-600" />
                    <span>شرایط اتوکلاو و استریلیزاسیون</span>
                  </h4>
                  <div className="space-y-1 text-stone-700 dark:text-stone-300">
                    <p><strong className="text-stone-900 dark:text-stone-100">دمای اتوکلاو:</strong> {selectedMedia.autoclaveParameters.temperatureC} °C به مدت {selectedMedia.autoclaveParameters.timeMinutes} دقیقه ({selectedMedia.autoclaveParameters.pressurePsi} psi)</p>
                    {selectedMedia.autoclaveParameters.specialHeatingNote && (
                      <p className="text-amber-700 dark:text-amber-400 font-semibold"><strong className="text-stone-900 dark:text-stone-100">نکته حرارتی:</strong> {selectedMedia.autoclaveParameters.specialHeatingNote}</p>
                    )}
                    <p><strong className="text-stone-900 dark:text-stone-100">نگهداری محیط آماده:</strong> {selectedMedia.storageConditions.preparedMediaStorage} (ماندگاری: {selectedMedia.storageConditions.shelfLifePreparedPlates})</p>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>دستورالعمل آماده‌سازی (SOP)</span>
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                    {selectedMedia.preparationInstructionsFa}
                  </p>
                </div>
              </div>

              {/* Quality Control Performance (ISO 11133) */}
              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>کنترل کیفیت عملکردی بر اساس ISO 11133</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {selectedMedia.qualityControlStrains.map((qc, i) => (
                    <div key={i} className="p-2 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800 dark:text-stone-200 font-mono">{qc.strainName}</span>
                        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">{qc.strainNumber}</span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300">واکنش مورد انتظار: {qc.expectedReaction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
              <p className="text-xs text-stone-500">لطفاً یک محیط کشت را از لیست انتخاب کنید.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
