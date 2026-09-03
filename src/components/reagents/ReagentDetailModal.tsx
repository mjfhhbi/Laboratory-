/**
 * Chemical Reagent Detail and Safety Dossier Modal
 * Food Science AI Lab Suite - Part 13
 */

import React, { useState } from 'react';
import {
  ChemicalReagent,
  REAGENT_GRADE_META,
  CHEMICAL_FAMILY_META,
  GHS_PICTOGRAM_META
} from '../../types/chemicalReagent';
import { GhsBadge } from './GhsBadge';
import {
  X,
  Beaker,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Pipette,
  Layers,
  Thermometer,
  Eye,
  Activity,
  HeartPulse,
  Flame,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  TestTubes,
  Info
} from 'lucide-react';

interface ReagentDetailModalProps {
  reagent: ChemicalReagent | null;
  onClose: () => void;
  onPrepareSolution: (reagent: ChemicalReagent) => void;
}

export const ReagentDetailModal: React.FC<ReagentDetailModalProps> = ({
  reagent,
  onClose,
  onPrepareSolution
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'hazards' | 'safety_firstaid' | 'sds_reference' | 'experiments'>('overview');

  if (!reagent) return null;

  const gradeMeta = REAGENT_GRADE_META[reagent.grade] || REAGENT_GRADE_META.analytical;
  const familyMeta = CHEMICAL_FAMILY_META[reagent.family] || CHEMICAL_FAMILY_META.salt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/80 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                {familyMeta.nameFa}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {gradeMeta.nameFa}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300" dir="ltr">
                Assay: {reagent.purityPercentage}%
              </span>
              {reagent.isBenchmark && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ماده مرجع تأییدشده
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {reagent.name}
            </h2>
            <div className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5" dir="ltr">
              {reagent.englishName} • <span className="font-semibold text-stone-700 dark:text-stone-300">{reagent.scientificName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onPrepareSolution(reagent)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-2xs"
            >
              <Pipette className="w-4 h-4" />
              <span>محلول‌سازی</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              aria-label="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors shrink-0 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 border-t-2 border-emerald-600 dark:border-emerald-500 border-x border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Beaker className="w-3.5 h-3.5" />
            <span>مشخصات فیزیکوشیمیایی و انبارش</span>
          </button>

          <button
            onClick={() => setActiveTab('hazards')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors shrink-0 ${
              activeTab === 'hazards'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 border-t-2 border-emerald-600 dark:border-emerald-500 border-x border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>خطرات و سیستم GHS</span>
          </button>

          <button
            onClick={() => setActiveTab('safety_firstaid')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors shrink-0 ${
              activeTab === 'safety_firstaid'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 border-t-2 border-emerald-600 dark:border-emerald-500 border-x border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
            <span>ایمنی، PPE و کمک‌های اولیه</span>
          </button>

          <button
            onClick={() => setActiveTab('sds_reference')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors shrink-0 ${
              activeTab === 'sds_reference'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 border-t-2 border-emerald-600 dark:border-emerald-500 border-x border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>برگه ایمنی SDS و استنادها</span>
          </button>

          <button
            onClick={() => setActiveTab('experiments')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors shrink-0 ${
              activeTab === 'experiments'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 border-t-2 border-emerald-600 dark:border-emerald-500 border-x border-stone-200 dark:border-stone-800'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <TestTubes className="w-3.5 h-3.5 text-emerald-600" />
            <span>آزمایش‌های کاربردی ({reagent.associatedExperiments.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          {/* TAB 1: Overview & Physicochemical */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Chemical Identity Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mb-1">فرمول شیمیایی</div>
                  <div className="font-mono font-bold text-base text-emerald-800 dark:text-emerald-300" dir="ltr">
                    {reagent.chemicalFormula}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mb-1">شماره CAS</div>
                  <div className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100" dir="ltr">
                    {reagent.casNumber}
                  </div>
                  <div className="text-[9px] text-emerald-700 dark:text-emerald-400 truncate mt-0.5" title={reagent.casSource}>
                    {reagent.casSource}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mb-1">وزن مولکولی (MW)</div>
                  <div className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100" dir="ltr">
                    {reagent.molecularWeight} g/mol
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mb-1">چگالی / دانسیته</div>
                  <div className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100" dir="ltr">
                    {reagent.density ? `${reagent.density} g/mL` : 'تعریف نشده (جامد)'}
                  </div>
                </div>
              </div>

              {/* Physicochemical Specs Table */}
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>جدول مشخصات فیزیکی و آزمایشگاهی</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-500 dark:text-stone-400">حالت فیزیکی:</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {reagent.physicalState === 'solid' ? 'جامد' : reagent.physicalState === 'liquid' ? 'مایع' : reagent.physicalState === 'crystals' ? 'کریستال‌های بلوری' : 'پودر ریز'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-500 dark:text-stone-400">ظرفیت واکنشی (Valence/n):</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100" dir="ltr">
                      n = {reagent.valenceOrEquivalents || 1}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-500 dark:text-stone-400">شماره بچ / لات:</span>
                    <span className="font-mono font-semibold text-stone-900 dark:text-stone-100" dir="ltr">
                      {reagent.lotNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-500 dark:text-stone-400">تاریخ انقضا:</span>
                    <span className="font-mono font-semibold text-stone-900 dark:text-stone-100" dir="ltr">
                      {reagent.expiryDate || 'نامحدود (در شرایط استاندارد)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Storage Conditions Card */}
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm mb-2.5 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>شرایط نگهداری و انبارداری استاندارد (Storage SOP)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-amber-800 dark:text-amber-300 font-semibold">دمای نگهداری: </span>
                    <span className="text-stone-800 dark:text-stone-200">{reagent.storageConditions.temperature}</span>
                  </div>
                  <div>
                    <span className="text-amber-800 dark:text-amber-300 font-semibold">محل استقرار در آزمایشگاه: </span>
                    <span className="text-stone-800 dark:text-stone-200">{reagent.stockQuantity.location}</span>
                  </div>
                  <div>
                    <span className="text-amber-800 dark:text-amber-300 font-semibold">حساس به نور: </span>
                    <span className="text-stone-800 dark:text-stone-200">{reagent.storageConditions.lightSensitive ? 'بله (در ظروف کهربایی تیره مات)' : 'خیر'}</span>
                  </div>
                  <div>
                    <span className="text-amber-800 dark:text-amber-300 font-semibold">جاذب رطوبت (Hygroscopic): </span>
                    <span className="text-stone-800 dark:text-stone-200">{reagent.storageConditions.hygroscopic ? 'بله (نیاز به دسیکاتور یا درب‌بندی محکم)' : 'خیر'}</span>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                  <span className="font-bold">نکات ویژه انبارش: </span>
                  {reagent.storageConditions.specialNotes}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Hazards & GHS */}
          {activeTab === 'hazards' && (
            <div className="space-y-6">
              {/* GHS Pictograms Banner */}
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>پیکتوگرام‌ها و رده‌بندی خطرات GHS</span>
                </h4>

                {reagent.hazards.ghsPictograms.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {reagent.hazards.ghsPictograms.map((code) => {
                      const meta = GHS_PICTOGRAM_META[code];
                      return (
                        <div key={code} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-start gap-3">
                          <GhsBadge code={code} size="lg" />
                          <div>
                            <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                              {meta.nameFa}
                            </div>
                            <div className="text-[10px] text-stone-500 dark:text-stone-400 font-mono" dir="ltr">
                              {code} • {meta.nameEn}
                            </div>
                            <div className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 leading-snug">
                              {meta.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>این ترکیب طبق استانداردهای جهانی GHS و OSHA فاقد خطرات حاد شناخته شده در شرایط متعارف آزمایشگاهی است.</span>
                  </div>
                )}
              </div>

              {/* Hazard Statements (H-Statements) */}
              {reagent.hazards.hazardStatements.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
                  <h4 className="font-bold text-rose-900 dark:text-rose-200 text-xs mb-2">
                    بیانیه‌های خطر رسمی (H-Statements):
                  </h4>
                  <ul className="space-y-1.5 text-xs text-rose-950 dark:text-rose-200">
                    {reagent.hazards.hazardStatements.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Precautionary Statements (P-Statements) */}
              {reagent.hazards.precautionaryStatements.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-xs mb-2">
                    بیانیه‌های احتیاطی و پیشگیری (P-Statements):
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
                    {reagent.hazards.precautionaryStatements.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* NFPA 704 Diamond if available */}
              {reagent.hazards.nfpaRating && (
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs mb-3">
                    لوزی استاندارد خطر آتش‌نشانی (NFPA 704 Rating):
                  </h4>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 font-bold border border-blue-300 dark:border-blue-800">
                      سلامت (Blue): {reagent.hazards.nfpaRating.health}
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 font-bold border border-red-300 dark:border-red-800">
                      اشتعال‌پذیری (Red): {reagent.hazards.nfpaRating.flammability}
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800">
                      ناپایداری/انفجار (Yellow): {reagent.hazards.nfpaRating.instability}
                    </div>
                    {reagent.hazards.nfpaRating.special && (
                      <div className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-mono font-bold">
                        هشدار ویژه: {reagent.hazards.nfpaRating.special}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Safety & First Aid */}
          {activeTab === 'safety_firstaid' && (
            <div className="space-y-6">
              {/* PPE Requirements */}
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>تجهیزات حفاظت فردی الزامی (Mandatory PPE)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {reagent.safetyNotes.ppeRequired.map((ppe, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{ppe}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exothermic Alert if applicable */}
              {reagent.safetyNotes.exothermicWarning && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-900 dark:text-red-200">
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-red-800 dark:text-red-300">
                    <Flame className="w-4 h-4" />
                    <span>هشدار واکنش به شدت گرمازا (Exothermic Hazard):</span>
                  </div>
                  <p className="leading-relaxed">{reagent.safetyNotes.exothermicWarning}</p>
                </div>
              )}

              {/* First Aid Protocols */}
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-3 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  <span>دستورالعمل اقدامات کمک‌های اولیه (First Aid SOP)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                    <div className="font-bold text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>تماس چشمی (Eye Contact)</span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {reagent.safetyNotes.firstAid.eyeContact}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                    <div className="font-bold text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      <span>تماس پوستی (Skin Contact)</span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {reagent.safetyNotes.firstAid.skinContact}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                    <div className="font-bold text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      <span>استنشاق بخارات/گردوغبار (Inhalation)</span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {reagent.safetyNotes.firstAid.inhalation}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                    <div className="font-bold text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>بلعیدن و گوارش (Ingestion)</span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {reagent.safetyNotes.firstAid.ingestion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Spill Response & Incompatible Chemicals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                  <h5 className="font-bold text-stone-900 dark:text-stone-100 mb-1">روش مهار و پاکسازی نشت (Spill Protocol):</h5>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{reagent.safetyNotes.spillResponse}</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                  <h5 className="font-bold text-rose-800 dark:text-rose-300 mb-1">مواد ناسازگار (Incompatible Chemicals):</h5>
                  {reagent.safetyNotes.incompatibleWith.length > 0 ? (
                    <ul className="list-disc list-inside text-stone-700 dark:text-stone-300 space-y-0.5">
                      {reagent.safetyNotes.incompatibleWith.map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-stone-500">عدم ناسازگاری حاد در شرایط متعارف.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SDS Reference */}
          {activeTab === 'sds_reference' && (
            <div className="space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/80">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                    <span>برگه اطلاعات ایمنی مواد شیمیایی (Safety Data Sheet Reference)</span>
                  </h4>
                  {reagent.sdsReference.verified && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      منبع معتبر و تأییدشده
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-stone-800 dark:text-stone-200 leading-relaxed">
                  <div>
                    <span className="font-semibold text-indigo-900 dark:text-indigo-300">ناشر و مرجع مستندات: </span>
                    <span>{reagent.sdsReference.publisherOrSource}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-indigo-900 dark:text-indigo-300">کد برگه SDS / شناسه بین‌المللی: </span>
                    <span className="font-mono font-bold" dir="ltr">{reagent.sdsReference.sdsCodeOrNumber}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-indigo-900 dark:text-indigo-300">تاریخ آخرین بازنگری ایمنی: </span>
                    <span className="font-mono" dir="ltr">{reagent.sdsReference.revisionDate}</span>
                  </div>
                  {reagent.sdsReference.safetyDisclaimer && (
                    <div className="mt-3 pt-2.5 border-t border-indigo-200/60 dark:border-indigo-900/40 text-stone-600 dark:text-stone-400">
                      <span className="font-semibold text-stone-800 dark:text-stone-200">توضیحات تکمیلی: </span>
                      {reagent.sdsReference.safetyDisclaimer}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 leading-relaxed">
                <div className="font-bold text-stone-800 dark:text-stone-200 mb-1 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>تعهد رعایت ایمنی و ارجاع استاندارد</span>
                </div>
                مطابق قوانین ایمنی آزمایشگاهی سامانه، اطلاعات خطرناک به صورت حدسی یا تخمینی ارائه نشده و مستقیماً از دیتابیس‌های بین‌المللی (PubChem، مرک KGaA و استانداردهای ISIRI/INSO) استخراج گردیده‌اند.
              </div>
            </div>
          )}

          {/* TAB 5: Associated Experiments */}
          {activeTab === 'experiments' && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
                <TestTubes className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>پروتکل‌های آزمون و استانداردهای متصل به این ماده ({reagent.associatedExperiments.length} آزمون)</span>
              </h4>

              <div className="space-y-3">
                {reagent.associatedExperiments.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/80 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h5 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                        {exp.experimentName}
                      </h5>
                      {exp.standardCode && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0" dir="ltr">
                          {exp.standardCode}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-700 dark:text-stone-300 space-y-1">
                      <div>
                        <span className="text-stone-500 dark:text-stone-400">نقش در آزمون: </span>
                        <span className="font-semibold text-emerald-800 dark:text-emerald-300">{exp.rolePersian}</span>
                      </div>
                      {exp.notes && (
                        <div className="text-stone-600 dark:text-stone-400 text-[11px]">
                          <span className="font-medium text-stone-700 dark:text-stone-300">نکته تکنیکی: </span>
                          {exp.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/80 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            موجودی فعلی: <span className="font-bold text-stone-800 dark:text-stone-200" dir="ltr">{reagent.stockQuantity.amount} {reagent.stockQuantity.unit}</span> در {reagent.stockQuantity.location}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-medium text-xs transition-colors"
            >
              بستن
            </button>

            <button
              onClick={() => onPrepareSolution(reagent)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-2xs"
            >
              <Pipette className="w-4 h-4" />
              <span>شروع محلول‌سازی با این ماده</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
