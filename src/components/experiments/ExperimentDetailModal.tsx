import React from 'react';
import { FoodExperiment } from '../../types/foodExperiment';
import { LaboratoryProcedureView } from './LaboratoryProcedureView';
import { X, Printer, ShieldCheck } from 'lucide-react';

interface ExperimentDetailModalProps {
  experiment: FoodExperiment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (experiment: FoodExperiment) => void;
}

export const ExperimentDetailModal: React.FC<ExperimentDetailModalProps> = ({
  experiment,
  isOpen,
  onClose,
  onEdit
}) => {
  if (!isOpen || !experiment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div
        id="experiment-detail-modal"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl sm:rounded-3xl w-full max-w-5xl max-h-[96vh] sm:max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto"
        dir="rtl"
      >
        {/* Top Control Bar */}
        <div className="px-3.5 sm:px-5 py-3 sm:py-3.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 bg-stone-50/70 dark:bg-stone-950/50">
          <div className="flex items-center gap-2 text-xs min-w-0 flex-1">
            <span className="font-bold text-stone-800 dark:text-stone-200 truncate">
              دستورالعمل آزمایشگاه <span className="hidden sm:inline font-mono text-[11px] text-stone-500">(Laboratory Procedure)</span>
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold shrink-0">
              {experiment.code}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1.5 min-h-[40px]"
              title="چاپ دستورالعمل"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">چاپ پروتکل</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
              title="بستن"
              aria-label="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body: Render LaboratoryProcedureView */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <LaboratoryProcedureView
            experiment={experiment}
            onBack={onClose}
            onEdit={onEdit}
          />
        </div>
      </div>
    </div>
  );
};
