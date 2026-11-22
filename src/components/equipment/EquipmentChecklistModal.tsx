/**
 * Food Science AI - Equipment Checklist Modal
 * Modal wrapper to inspect and verify pre-experiment equipment checklist
 */

import React from 'react';
import { X, Wrench, Printer } from 'lucide-react';
import { SmartEquipmentChecklistCard } from './SmartEquipmentChecklistCard';
import { EquipmentChecklistItem, LaboratoryEquipment } from '../../types/laboratoryEquipment';

interface EquipmentChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: EquipmentChecklistItem[];
  equipmentInventory: LaboratoryEquipment[];
  onUpdateChecklist: (updated: EquipmentChecklistItem[]) => void;
  title?: string;
  subtitle?: string;
}

export const EquipmentChecklistModal: React.FC<EquipmentChecklistModalProps> = ({
  isOpen,
  onClose,
  checklist,
  equipmentInventory,
  onUpdateChecklist,
  title,
  subtitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                چک‌لیست هوشمند تجهیزات و ارزیابی انطباق استاندارد
              </h2>
              <span className="text-[11px] text-stone-500">
                بررسی صحت دقت، ظرفیت، رزولوشن، محدوده کاری و کالیبراسیون
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>چاپ چک‌لیست</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <SmartEquipmentChecklistCard
            checklist={checklist}
            equipmentInventory={equipmentInventory}
            onUpdateChecklist={onUpdateChecklist}
            onProceed={onClose}
            title={title}
            subtitle={subtitle}
          />
        </div>
      </div>
    </div>
  );
};
