/**
 * Chemical Reagents, Indicators and Solution Preparation System Page
 * Food Science AI Lab Suite - Part 13
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChemicalReagent,
  PreparedSolution,
  ReagentFilterQuery,
  ReagentStatistics
} from '../../types/chemicalReagent';
import {
  getAllReagents,
  filterReagents,
  saveReagent,
  deleteReagent,
  getAllPreparedSolutions,
  savePreparedSolution,
  deletePreparedSolution,
  getReagentStatistics,
  resetReagentStore,
  exportReagentsJSON
} from '../../lib/storage/reagentStorage';
import { ReagentCard } from '../../components/reagents/ReagentCard';
import { ReagentFilterBar } from '../../components/reagents/ReagentFilterBar';
import { ReagentDetailModal } from '../../components/reagents/ReagentDetailModal';
import { ReagentFormModal } from '../../components/reagents/ReagentFormModal';
import { SolutionCalculatorView } from '../../components/reagents/SolutionCalculatorView';
import { PreparedSolutionsLog } from '../../components/reagents/PreparedSolutionsLog';
import { ChemicalSafetyGuide } from '../../components/reagents/ChemicalSafetyGuide';
import {
  Beaker,
  Pipette,
  Plus,
  RotateCcw,
  Download,
  AlertTriangle,
  FlaskConical,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Layers,
  Sparkles,
  Search
} from 'lucide-react';

export const ReagentsPage: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'bank' | 'calculator' | 'solutions_log' | 'safety_guide'>('bank');

  // State
  const [reagents, setReagents] = useState<ChemicalReagent[]>([]);
  const [filteredReagents, setFilteredReagents] = useState<ChemicalReagent[]>([]);
  const [preparedSolutions, setPreparedSolutions] = useState<PreparedSolution[]>([]);
  const [statistics, setStatistics] = useState<ReagentStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter Query
  const [filterQuery, setFilterQuery] = useState<ReagentFilterQuery>({
    searchTerm: '',
    family: 'all',
    grade: 'all',
    hazardPictogram: 'all',
    stockStatus: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Modal states
  const [selectedDetailReagent, setSelectedDetailReagent] = useState<ChemicalReagent | null>(null);
  const [editingReagent, setEditingReagent] = useState<ChemicalReagent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [activeCalculatorReagent, setActiveCalculatorReagent] = useState<ChemicalReagent | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Load all initial data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const allR = await getAllReagents();
      const allS = await getAllPreparedSolutions();
      const stats = await getReagentStatistics();
      const filtered = await filterReagents(filterQuery);

      setReagents(allR);
      setFilteredReagents(filtered);
      setPreparedSolutions(allS);
      setStatistics(stats);
    } catch (err) {
      console.error('Error loading chemical reagents data:', err);
    } finally {
      setLoading(false);
    }
  }, [filterQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Save Reagent
  const handleSaveReagent = async (data: Partial<ChemicalReagent>) => {
    await saveReagent(data);
    setIsFormOpen(false);
    setEditingReagent(null);
    showNotification('اطلاعات ماده شیمیایی با موفقیت در بانک معرف‌ها ذخیره شد.');
    await loadData();
  };

  // Handle Prepare Solution Click from card
  const handleStartPrepareSolution = (reagent: ChemicalReagent) => {
    setActiveCalculatorReagent(reagent);
    setActiveTab('calculator');
    setSelectedDetailReagent(null);
  };

  // Handle Register Prepared Solution
  const handleRegisterSolution = async (solData: Partial<PreparedSolution>) => {
    await savePreparedSolution(solData);
    showNotification(`محلول «${solData.title}» در دفترچه محلول‌های آزمایشگاه ثبت گردید.`);
    await loadData();
    setActiveTab('solutions_log');
  };

  // Handle Delete Prepared Solution
  const handleDeleteSolution = async (id: string) => {
    if (window.confirm('آیا از حذف این محلول از دفترچه آزمایشگاه اطمینان دارید؟')) {
      await deletePreparedSolution(id);
      showNotification('محلول با موفقیت حذف شد.');
      await loadData();
    }
  };

  // Handle Update Standardization Factor
  const handleUpdateFactor = async (id: string, newFactor: number, newActualConc: number) => {
    const existing = preparedSolutions.find(s => s.id === id);
    if (existing) {
      await savePreparedSolution({
        ...existing,
        standardizationFactor: newFactor,
        actualConcentration: newActualConc
      });
      showNotification(`فاکتور محلول به ${newFactor.toFixed(4)} بروزرسانی شد.`);
      await loadData();
    }
  };

  // Handle Reset to Benchmark
  const handleResetBenchmark = async () => {
    if (window.confirm('آیا مایل به بازنشانی بانک مواد شیمیایی به دیتابیس مرجع و اولیه هستید؟')) {
      await resetReagentStore();
      showNotification('بانک مواد و معرف‌ها با موفقیت به داده‌های مرجع استاندارد بازنشانی شد.');
      await loadData();
    }
  };

  // Handle Export
  const handleExportJSON = async () => {
    const json = await exportReagentsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foodscience-reagents-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-stone-100/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 left-5 z-50 bg-stone-900 dark:bg-emerald-950 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-500/40 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-1">
            <Beaker className="w-4 h-4" />
            <span>بخش ۱۳: سیستم جامع مواد شیمیایی، معرف‌ها و محلول‌سازی</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
            بانک مواد، معرف‌ها و آزمایشگاه محلول‌سازی
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            مدیریت استاندارد مواد شیمیایی، شناسه‌های CAS، برگه‌های SDS، گریدهای کیفی، سیستم محاسباتی محلول‌سازی دقیق، استانداردسازی فاکتور و کنترل ریسک GHS.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setEditingReagent(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت ماده جدید</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs transition-colors"
            title="پشتیبان‌گیری از اطلاعات مواد و محلول‌ها"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>خروجی JSON</span>
          </button>

          <button
            onClick={handleResetBenchmark}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 hover:text-stone-700 text-xs transition-colors"
            title="بازنشانی بانک به مقادیر اولیه و مرجع"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      {statistics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">مجموع معرف‌ها و مواد</div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono mt-0.5" dir="ltr">
                {statistics.totalReagents}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Beaker className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">محلول‌های فعال و استاندارد</div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono mt-0.5" dir="ltr">
                {statistics.activeSolutions}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">مواد با رده خطر GHS</div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5" dir="ltr">
                {statistics.hazardousCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">هشدار کسری موجودی</div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5" dir="ltr">
                {statistics.lowStockCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 overflow-x-auto custom-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('bank')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'bank'
              ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 border border-stone-200 dark:border-stone-800 shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Beaker className="w-4 h-4" />
          <span>بانک مواد و معرف‌ها ({reagents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'calculator'
              ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 border border-stone-200 dark:border-stone-800 shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Pipette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>سیستم محلول‌سازی و محاسبات دقیق</span>
        </button>

        <button
          onClick={() => setActiveTab('solutions_log')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'solutions_log'
              ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 border border-stone-200 dark:border-stone-800 shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>دفترچه محلول‌های آماده آزمایشگاه ({preparedSolutions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('safety_guide')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'safety_guide'
              ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 border border-stone-200 dark:border-stone-800 shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>راهنمای جامع ایمنی و عدم سازگاری مواد</span>
        </button>
      </div>

      {/* Tab Content 1: Reagents Bank */}
      {activeTab === 'bank' && (
        <div className="space-y-6">
          {/* Filter Toolbar */}
          <ReagentFilterBar
            filterQuery={filterQuery}
            onFilterChange={setFilterQuery}
            onResetFilters={() => {
              setFilterQuery({
                searchTerm: '',
                family: 'all',
                grade: 'all',
                hazardPictogram: 'all',
                stockStatus: 'all',
                sortBy: 'name',
                sortOrder: 'asc'
              });
            }}
            totalCount={reagents.length}
            filteredCount={filteredReagents.length}
          />

          {/* Reagents Grid */}
          {filteredReagents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredReagents.map((reagent) => (
                <ReagentCard
                  key={reagent.id}
                  reagent={reagent}
                  onSelect={(r) => setSelectedDetailReagent(r)}
                  onPrepareSolution={(r) => handleStartPrepareSolution(r)}
                  onEdit={(r) => {
                    setEditingReagent(r);
                    setIsFormOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
              ماده شیمیایی منطبق با معیارهای فیلتر یافت نشد.
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Solution Preparation Calculator */}
      {activeTab === 'calculator' && (
        <SolutionCalculatorView
          reagents={reagents}
          initialReagent={activeCalculatorReagent}
          onRegisterSolution={handleRegisterSolution}
        />
      )}

      {/* Tab Content 3: Prepared Solutions Log */}
      {activeTab === 'solutions_log' && (
        <PreparedSolutionsLog
          solutions={preparedSolutions}
          reagents={reagents}
          onDeleteSolution={handleDeleteSolution}
          onUpdateFactor={handleUpdateFactor}
        />
      )}

      {/* Tab Content 4: Chemical Safety Guide */}
      {activeTab === 'safety_guide' && (
        <ChemicalSafetyGuide />
      )}

      {/* Detail & SDS Modal */}
      {selectedDetailReagent && (
        <ReagentDetailModal
          reagent={selectedDetailReagent}
          onClose={() => setSelectedDetailReagent(null)}
          onPrepareSolution={(r) => handleStartPrepareSolution(r)}
        />
      )}

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <ReagentFormModal
          reagent={editingReagent}
          onClose={() => {
            setIsFormOpen(false);
            setEditingReagent(null);
          }}
          onSave={handleSaveReagent}
        />
      )}
    </div>
  );
};
