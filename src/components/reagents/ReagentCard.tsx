/**
 * Chemical Reagent Card Component
 * Food Science AI Lab Suite - Part 13
 */

import React from 'react';
import {
  ChemicalReagent,
  REAGENT_GRADE_META,
  CHEMICAL_FAMILY_META
} from '../../types/chemicalReagent';
import { GhsBadge } from './GhsBadge';
import {
  Beaker,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Pipette,
  PackageCheck,
  CheckCircle2,
  ExternalLink,
  Edit,
  TestTubes
} from 'lucide-react';

interface ReagentCardProps {
  reagent: ChemicalReagent;
  onSelect: (reagent: ChemicalReagent) => void;
  onPrepareSolution: (reagent: ChemicalReagent) => void;
  onEdit?: (reagent: ChemicalReagent) => void;
}

export const ReagentCard: React.FC<ReagentCardProps> = ({
  reagent,
  onSelect,
  onPrepareSolution,
  onEdit
}) => {
  const gradeMeta = REAGENT_GRADE_META[reagent.grade] || REAGENT_GRADE_META.analytical;
  const familyMeta = CHEMICAL_FAMILY_META[reagent.family] || CHEMICAL_FAMILY_META.salt;

  const isLowStock = reagent.stockQuantity.amount <= reagent.stockQuantity.minAlertLevel;
  const isHazardous = reagent.hazards.ghsPictograms && reagent.hazards.ghsPictograms.length > 0;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200/90 dark:border-stone-800/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Header Bar */}
      <div className="p-4 border-b border-stone-100 dark:border-stone-800/80">
        <div className="flex items-start justify-between gap-2.5 mb-2">
          {/* Family & Grade Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1">
              <Beaker className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              {familyMeta.nameFa}
            </span>

            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                reagent.grade === 'primary_standard'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                  : reagent.grade === 'analytical'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : reagent.grade === 'food_usp'
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              {gradeMeta.nameFa}
            </span>
          </div>

          {/* Purity Assay Badge */}
          <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300 text-xs font-mono font-bold" dir="ltr">
            <span>{reagent.purityPercentage}%</span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-sans">خلوص</span>
          </div>
        </div>

        {/* Chemical Name */}
        <h3
          onClick={() => onSelect(reagent)}
          className="font-bold text-stone-900 dark:text-stone-100 text-base leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
        >
          {reagent.name}
        </h3>

        <div className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5 truncate" dir="ltr">
          {reagent.englishName}
        </div>

        {/* Formula & CAS Bar */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800/60 text-xs font-mono">
          {/* Chemical Formula */}
          <div className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-800/60 px-2.5 py-1 rounded-md border border-stone-200/60 dark:border-stone-700/60">
            <span className="text-[10px] text-stone-400 dark:text-stone-500 font-sans">فرمول:</span>
            <span className="font-bold text-emerald-800 dark:text-emerald-300" dir="ltr">
              {reagent.chemicalFormula}
            </span>
          </div>

          {/* CAS Number */}
          <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60 px-2 py-1 rounded-md border border-stone-200/60 dark:border-stone-700/60" title={`منبع: ${reagent.casSource}`}>
            <span className="text-[10px] text-stone-400 dark:text-stone-500 font-sans">CAS:</span>
            <span className="font-semibold" dir="ltr">{reagent.casNumber}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3 text-xs">
        {/* Physicochemical Props */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-400 bg-stone-50/60 dark:bg-stone-950/40 p-2.5 rounded-lg border border-stone-100 dark:border-stone-800/60">
          <div>
            <span className="text-stone-400 dark:text-stone-500">وزن مولکولی: </span>
            <span className="font-mono font-semibold text-stone-800 dark:text-stone-200" dir="ltr">{reagent.molecularWeight} g/mol</span>
          </div>
          {reagent.density && (
            <div>
              <span className="text-stone-400 dark:text-stone-500">چگالی: </span>
              <span className="font-mono font-semibold text-stone-800 dark:text-stone-200" dir="ltr">{reagent.density} g/mL</span>
            </div>
          )}
          <div>
            <span className="text-stone-400 dark:text-stone-500">حالت: </span>
            <span className="font-medium text-stone-800 dark:text-stone-200">
              {reagent.physicalState === 'solid' ? 'جامد' : reagent.physicalState === 'liquid' ? 'مایع' : reagent.physicalState === 'crystals' ? 'کریستال' : 'پودر'}
            </span>
          </div>
          <div>
            <span className="text-stone-400 dark:text-stone-500">موجودی: </span>
            <span className={`font-mono font-bold ${isLowStock ? 'text-rose-600 dark:text-rose-400' : 'text-stone-800 dark:text-stone-200'}`} dir="ltr">
              {reagent.stockQuantity.amount} {reagent.stockQuantity.unit}
            </span>
          </div>
        </div>

        {/* Hazards Section */}
        {isHazardous ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-stone-400 dark:text-stone-500 ml-1">پیکتوگرام GHS:</span>
            {reagent.hazards.ghsPictograms.map((pic) => (
              <GhsBadge key={pic} code={pic} size="sm" />
            ))}
            {reagent.hazards.signalWord === 'Danger' && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                خطر (Danger)
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 px-2 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>طبق GHS غیرخطرناک در شرایط متعارف</span>
          </div>
        )}

        {/* Associated Experiments */}
        {reagent.associatedExperiments && reagent.associatedExperiments.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400 dark:text-stone-500 mb-1">
              <TestTubes className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>کاربرد در آزمون‌های آزمایشگاهی ({reagent.associatedExperiments.length} مورد):</span>
            </div>
            <div className="space-y-1">
              {reagent.associatedExperiments.slice(0, 2).map((exp, idx) => (
                <div key={idx} className="text-[11px] text-stone-700 dark:text-stone-300 bg-stone-100/70 dark:bg-stone-800/70 px-2 py-1 rounded border border-stone-200/50 dark:border-stone-700/50 truncate" title={`${exp.experimentName} - ${exp.standardCode || ''}`}>
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">[{exp.rolePersian.split(' ')[0]}]: </span>
                  {exp.experimentName}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="p-3 bg-stone-50/80 dark:bg-stone-950/80 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onPrepareSolution(reagent)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-2xs"
        >
          <Pipette className="w-3.5 h-3.5" />
          <span>محلول‌سازی</span>
        </button>

        <button
          onClick={() => onSelect(reagent)}
          className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-medium text-xs transition-colors"
          title="مشاهده پرونده کامل، SDS و ایمنی"
        >
          <FileText className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
          <span>پرونده / SDS</span>
        </button>

        {onEdit && (
          <button
            onClick={() => onEdit(reagent)}
            className="p-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700 transition-colors"
            title="ویرایش ماده شیمیایی"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
