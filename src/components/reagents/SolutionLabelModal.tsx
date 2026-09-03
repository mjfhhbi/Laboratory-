/**
 * Standard GHS Chemical Container Label Print Modal
 * Food Science AI Lab Suite - Part 13
 */

import React from 'react';
import { PreparedSolution, ChemicalReagent } from '../../types/chemicalReagent';
import { GhsBadge } from './GhsBadge';
import {
  X,
  Printer,
  QrCode,
  Tag,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  User,
  FlaskConical
} from 'lucide-react';

interface SolutionLabelModalProps {
  solution: PreparedSolution | null;
  reagent?: ChemicalReagent | null;
  onClose: () => void;
}

export const SolutionLabelModal: React.FC<SolutionLabelModalProps> = ({
  solution,
  reagent,
  onClose
}) => {
  if (!solution) return null;

  const handlePrint = () => {
    window.print();
  };

  const isExpired = new Date(solution.expiryDate) < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              برچسب استاندارد ظرف محلول آزمایشگاهی (GHS / GLP Container Label)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Label Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-950">
          <div
            id="printable-lab-label"
            className="w-full max-w-lg bg-white text-stone-900 border-2 border-stone-900 rounded-xl p-5 shadow-lg space-y-4 font-sans print:shadow-none print:border-2 print:border-black print:m-0"
          >
            {/* Label Top Bar */}
            <div className="flex items-start justify-between border-b-2 border-stone-900 pb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  FOOD SCIENCE AI - QUALITY CONTROL LAB
                </div>
                <h2 className="text-lg font-black text-stone-950 leading-tight mt-0.5">
                  {solution.title}
                </h2>
                <div className="text-xs font-mono font-bold text-stone-700" dir="ltr">
                  {solution.reagentFormula} • {solution.targetConcentration} {solution.concentrationUnit}
                </div>
              </div>

              {/* QR / Barcode Mockup */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-12 h-12 border border-stone-900 p-1 rounded bg-stone-50 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-stone-900" />
                </div>
                <span className="text-[8px] font-mono mt-0.5">{solution.id.slice(0, 10)}</span>
              </div>
            </div>

            {/* Assay and Factor Metric Box */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-300">
              <div>
                <span className="text-stone-500 font-medium">غلظت واقعی (Actual): </span>
                <span className="font-mono font-bold text-stone-900" dir="ltr">
                  {solution.actualConcentration ?? solution.targetConcentration} {solution.concentrationUnit}
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-medium">فاکتور تیترانت (F): </span>
                <span className="font-mono font-bold text-emerald-800" dir="ltr">
                  {solution.standardizationFactor ? solution.standardizationFactor.toFixed(4) : '1.0000'}
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-medium">حجم محلول: </span>
                <span className="font-mono font-bold text-stone-900" dir="ltr">
                  {solution.finalVolume} {solution.volumeUnit}
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-medium">حلال: </span>
                <span className="font-medium text-stone-800 truncate" title={solution.solvent}>
                  {solution.solvent}
                </span>
              </div>
            </div>

            {/* Dates & Personnel Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-stone-700">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>تاریخ ساخت: <strong className="font-mono" dir="ltr">{solution.preparationDate}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 text-stone-700">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>تاریخ انقضا: <strong className={`font-mono ${isExpired ? 'text-red-600' : ''}`} dir="ltr">{solution.expiryDate}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 text-stone-700">
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span>تهیه‌کننده: <strong>{solution.preparedBy}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 text-stone-700">
                <FlaskConical className="w-3.5 h-3.5 text-stone-500" />
                <span>محل نگهداری: <strong>{solution.storageLocation}</strong></span>
              </div>
            </div>

            {/* Safety & Pictograms Strip */}
            <div className="border-t-2 border-stone-900 pt-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {reagent && reagent.hazards.ghsPictograms.map((code) => (
                  <GhsBadge key={code} code={code} size="sm" />
                ))}
              </div>

              <div className="text-[10px] text-stone-600 font-medium text-left truncate max-w-[260px]">
                {solution.safetyWarnings.length > 0
                  ? solution.safetyWarnings[0]
                  : 'رعایت کلیه اصول ایمنی GLP در کار با محلول'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/80 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            طراحی شده بر اساس الزامات استاندارد ISO 17025 و GLP برای برچسب‌گذاری محلول‌ها
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs transition-colors"
            >
              بستن
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ برچسب ظرف</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
