/**
 * Prepared Solutions Log and Inventory Component
 * Food Science AI Lab Suite - Part 13
 */

import React, { useState } from 'react';
import { PreparedSolution, ChemicalReagent } from '../../types/chemicalReagent';
import { SolutionLabelModal } from './SolutionLabelModal';
import {
  FlaskConical,
  Printer,
  Trash2,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Tag,
  ShieldAlert,
  ChevronDown,
  Edit3
} from 'lucide-react';

interface PreparedSolutionsLogProps {
  solutions: PreparedSolution[];
  reagents: ChemicalReagent[];
  onDeleteSolution: (id: string) => void;
  onUpdateFactor: (id: string, newFactor: number, newActualConc: number) => void;
}

export const PreparedSolutionsLog: React.FC<PreparedSolutionsLogProps> = ({
  solutions,
  reagents,
  onDeleteSolution,
  onUpdateFactor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [selectedForLabel, setSelectedForLabel] = useState<PreparedSolution | null>(null);

  // Edit Factor Modal state
  const [editingSolution, setEditingSolution] = useState<PreparedSolution | null>(null);
  const [newFactorInput, setNewFactorInput] = useState<number>(1.0000);

  const filteredSolutions = solutions.filter((sol) => {
    // Status filter
    const isExpired = new Date(sol.expiryDate) < new Date() || sol.status === 'expired';
    if (statusFilter === 'active' && isExpired) return false;
    if (statusFilter === 'expired' && !isExpired) return false;

    // Search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchTitle = sol.title.toLowerCase().includes(term);
      const matchReagent = sol.reagentName.toLowerCase().includes(term);
      const matchFormula = sol.reagentFormula.toLowerCase().includes(term);
      const matchPerson = sol.preparedBy.toLowerCase().includes(term);
      if (!matchTitle && !matchReagent && !matchFormula && !matchPerson) {
        return false;
      }
    }

    return true;
  });

  const handleOpenEditFactor = (sol: PreparedSolution) => {
    setEditingSolution(sol);
    setNewFactorInput(sol.standardizationFactor || 1.0000);
  };

  const handleSaveNewFactor = () => {
    if (!editingSolution) return;
    const actualConc = (editingSolution.targetConcentration * newFactorInput);
    onUpdateFactor(editingSolution.id, newFactorInput, parseFloat(actualConc.toFixed(5)));
    setEditingSolution(null);
  };

  const selectedReagentForLabel = selectedForLabel
    ? reagents.find(r => r.id === selectedForLabel.reagentId) || null
    : null;

  return (
    <div className="space-y-6">
      {/* Control Bar: Search & Status Filter */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجو در محلول‌های آماده (نام، فرمول، تهیه‌کننده)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'all'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            همه ({solutions.length})
          </button>

          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'active'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            فعال و معتبر
          </button>

          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'expired'
                ? 'bg-rose-700 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            منقضی‌شده
          </button>
        </div>
      </div>

      {/* Solutions Cards Grid */}
      {filteredSolutions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSolutions.map((sol) => {
            const isExpired = new Date(sol.expiryDate) < new Date() || sol.status === 'expired';

            return (
              <div
                key={sol.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs p-5 flex flex-col justify-between space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        isExpired
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {isExpired ? 'منقضی شده' : 'آماده مصرف'}
                    </span>

                    <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded" dir="ltr">
                      {sol.reagentFormula} {sol.targetConcentration} {sol.concentrationUnit}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-snug">
                    {sol.title}
                  </h3>
                </div>

                {/* Metrics Box */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 dark:bg-stone-800/40 p-3 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                  <div>
                    <span className="text-stone-500 dark:text-stone-400">غلظت واقعی: </span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-200" dir="ltr">
                      {sol.actualConcentration ?? sol.targetConcentration} {sol.concentrationUnit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">فاکتور F: </span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400" dir="ltr">
                        {sol.standardizationFactor ? sol.standardizationFactor.toFixed(4) : '1.0000'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenEditFactor(sol)}
                      className="text-stone-400 hover:text-emerald-600 p-0.5"
                      title="ویرایش فاکتور استانداردسازی"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <span className="text-stone-500 dark:text-stone-400">حجم تهیه شده: </span>
                    <span className="font-mono font-semibold text-stone-800 dark:text-stone-200" dir="ltr">
                      {sol.finalVolume} {sol.volumeUnit}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 dark:text-stone-400">مقدار مصرفی: </span>
                    <span className="font-mono font-semibold text-stone-800 dark:text-stone-200" dir="ltr">
                      {sol.requiredAmount} {sol.requiredAmountUnit}
                    </span>
                  </div>
                </div>

                {/* Metadata & Dates */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>ساخت: <strong className="font-mono" dir="ltr">{sol.preparationDate}</strong></span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>انقضا: <strong className={`font-mono ${isExpired ? 'text-rose-600' : ''}`} dir="ltr">{sol.expiryDate}</strong></span>
                  </div>

                  <div className="flex items-center gap-1 col-span-2">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>تهیه‌کننده: <strong>{sol.preparedBy}</strong> ({sol.storageLocation})</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedForLabel(sol)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-600" />
                    <span>چاپ برچسب GHS</span>
                  </button>

                  <button
                    onClick={() => onDeleteSolution(sol.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="حذف از دفترچه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
          محلولی با این مشخصات در دفترچه آزمایشگاه یافت نشد.
        </div>
      )}

      {/* Label Print Modal */}
      {selectedForLabel && (
        <SolutionLabelModal
          solution={selectedForLabel}
          reagent={selectedReagentForLabel}
          onClose={() => setSelectedForLabel(null)}
        />
      )}

      {/* Edit Standardization Factor Modal */}
      {editingSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 w-full max-w-md space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              ثبت فاکتور استانداردسازی (F) برای {editingSolution.title}
            </h3>

            <div className="text-xs text-stone-600 dark:text-stone-300">
              غلظت اسمی: <span className="font-mono font-bold">{editingSolution.targetConcentration} {editingSolution.concentrationUnit}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                فاکتور تعیین‌شده در تیتراسیون (Factor F):
              </label>
              <input
                type="number"
                step="0.0001"
                min="0.8000"
                max="1.2000"
                value={newFactorInput}
                onChange={(e) => setNewFactorInput(parseFloat(e.target.value) || 1.0000)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono font-bold"
                dir="ltr"
              />
            </div>

            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg" dir="ltr">
              Actual Conc = {(editingSolution.targetConcentration * newFactorInput).toFixed(5)} {editingSolution.concentrationUnit}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingSolution(null)}
                className="px-3 py-1.5 text-xs rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveNewFactor}
                className="px-4 py-1.5 text-xs rounded-lg bg-emerald-700 text-white font-bold"
              >
                ذخیره فاکتور
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
