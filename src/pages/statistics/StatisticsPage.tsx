import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart2, 
  Database, 
  Sigma, 
  Download, 
  ShieldCheck, 
  RefreshCw, 
  FileSpreadsheet, 
  FileText, 
  Plus, 
  Sliders, 
  HelpCircle,
  TrendingUp,
  Table as TableIcon
} from 'lucide-react';
import { 
  StatisticalDataset, 
  DescriptiveStats, 
  AnovaAnalysisResult, 
  AssumptionVerificationReport 
} from '../../types/statistics';
import { 
  getAllDatasets, 
  saveDataset, 
  deleteDataset, 
  SAMPLE_FOOD_DATASETS 
} from '../../lib/storage/statisticsStorage';
import { calculateDescriptiveStats } from '../../lib/statistics/descriptiveStats';
import { auditStatisticalAssumptions } from '../../lib/statistics/assumptions';
import { calculateOneWayAnova } from '../../lib/statistics/hypothesisTesting';
import { 
  exportRawDataToCSV, 
  exportSummaryToCSV, 
  exportScientificPublicationMarkdown, 
  downloadFile 
} from '../../lib/statistics/exportUtils';
import { DatasetSelector } from '../../components/statistics/DatasetSelector';
import { CreateDatasetModal } from '../../components/statistics/CreateDatasetModal';
import { RawDataEditor } from '../../components/statistics/RawDataEditor';
import { AssumptionAuditPanel } from '../../components/statistics/AssumptionAuditPanel';
import { DescriptiveStatsTable } from '../../components/statistics/DescriptiveStatsTable';
import { AnovaSection } from '../../components/statistics/AnovaSection';
import { CorrelationRegressionSection } from '../../components/statistics/CorrelationRegressionSection';
import { ScientificCharts } from '../../components/statistics/ScientificCharts';
import { UnitTestsModal } from '../../components/statistics/UnitTestsModal';

export const StatisticsPage: React.FC = () => {
  const [datasets, setDatasets] = useState<StatisticalDataset[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUnitTestsModalOpen, setIsUnitTestsModalOpen] = useState<boolean>(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);

  // Post-Hoc Method State
  const [postHocMethod, setPostHocMethod] = useState<'tukey_hsd' | 'duncan' | 'lsd'>('tukey_hsd');

  // Load datasets on mount
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const list = await getAllDatasets();
      setDatasets(list);
      if (list.length > 0) {
        setSelectedId((prev) => (list.some((d) => d.id === prev) ? prev : list[0].id));
      }
    } catch (err) {
      console.error('Error loading datasets:', err);
      setDatasets(SAMPLE_FOOD_DATASETS);
      setSelectedId(SAMPLE_FOOD_DATASETS[0].id);
    } finally {
      setIsLoading(false);
    }
  };

  // Active dataset
  const activeDataset = useMemo(() => {
    return datasets.find((d) => d.id === selectedId) || datasets[0] || null;
  }, [datasets, selectedId]);

  // Real-time Descriptive Statistics
  const statsMap = useMemo<Record<string, DescriptiveStats>>(() => {
    if (!activeDataset) return {};
    const map: Record<string, DescriptiveStats> = {};
    activeDataset.groups.forEach((g) => {
      map[g.id] = calculateDescriptiveStats(g.replicates, g.name);
    });
    return map;
  }, [activeDataset]);

  // Statistical Assumptions Audit (Normality, Homogeneity, Design questions)
  const auditReport = useMemo<AssumptionVerificationReport | null>(() => {
    if (!activeDataset) return null;
    return auditStatisticalAssumptions(activeDataset);
  }, [activeDataset]);

  // ANOVA & Post-Hoc Result
  const anovaResult = useMemo<AnovaAnalysisResult | null>(() => {
    if (!activeDataset) return null;
    return calculateOneWayAnova(activeDataset, postHocMethod);
  }, [activeDataset, postHocMethod]);

  // Handlers
  const handleUpdateDataset = async (updated: StatisticalDataset) => {
    setDatasets((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    try {
      await saveDataset(updated);
    } catch (e) {
      console.error('Error auto-saving dataset:', e);
    }
  };

  const handleCreateDataset = async (newDs: StatisticalDataset) => {
    const updated = [newDs, ...datasets];
    setDatasets(updated);
    setSelectedId(newDs.id);
    await saveDataset(newDs);
  };

  const handleDeleteDataset = async (id: string) => {
    const remaining = datasets.filter((d) => d.id !== id);
    setDatasets(remaining);
    if (selectedId === id && remaining.length > 0) {
      setSelectedId(remaining[0].id);
    }
    await deleteDataset(id);
  };

  // Export actions
  const handleExportCSVRaw = () => {
    if (!activeDataset) return;
    const csv = exportRawDataToCSV(activeDataset);
    downloadFile(csv, `${activeDataset.title}_Raw_Data.csv`);
    setIsExportMenuOpen(false);
  };

  const handleExportCSVSummary = () => {
    if (!activeDataset) return;
    const csv = exportSummaryToCSV(activeDataset, statsMap, anovaResult || undefined);
    downloadFile(csv, `${activeDataset.title}_Statistical_Summary.csv`);
    setIsExportMenuOpen(false);
  };

  const handleExportMarkdownTable = () => {
    if (!activeDataset) return;
    const md = exportScientificPublicationMarkdown(activeDataset, statsMap, anovaResult || undefined);
    downloadFile(md, `${activeDataset.title}_Publication_Table.md`, 'text/markdown;charset=utf-8;');
    setIsExportMenuOpen(false);
  };

  if (isLoading && datasets.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">بارگذاری محیط تحلیل آماری و طرح آزمایش...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-stone-950 text-slate-800 dark:text-stone-100 pb-16 transition-colors" dir="rtl">
      {/* Top Header */}
      <header className="bg-white dark:bg-stone-900 border-b border-slate-200 dark:border-stone-800 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <Sigma className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-stone-100">طراحی آزمایش و تحلیل آماری صنایع غذایی</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  Part 26/30
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-stone-400">
                ANOVA، آزمون‌های تعقیبی، برازش رگرسیون، اعتبارسنجی مفروضات و نمودارهای مقالات علمی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Unit Test Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsUnitTestsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-stone-300 bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 dark:hover:bg-stone-700 rounded-xl transition-colors border border-slate-200 dark:border-stone-700 min-h-[40px]"
              title="مشاهده ۳۲ تست واحد تأییدکننده محاسبات"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>تست محاسبات</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs min-h-[40px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export داده و گزارش</span>
              </button>

              {isExportMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-slate-200 dark:border-stone-800 py-1.5 z-40 text-xs text-slate-700 dark:text-stone-200">
                  <button
                    onClick={handleExportCSVSummary}
                    className="w-full text-right px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-stone-800 flex items-center gap-2 font-medium"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>خلاصه آماری و ANOVA (اکسل CSV)</span>
                  </button>
                  <button
                    onClick={handleExportCSVRaw}
                    className="w-full text-right px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-stone-800 flex items-center gap-2 font-medium"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                    <span>داده‌های خام تکرارها (CSV)</span>
                  </button>
                  <button
                    onClick={handleExportMarkdownTable}
                    className="w-full text-right px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-stone-800 flex items-center gap-2 font-medium border-t border-slate-100 dark:border-stone-800"
                  >
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>جدول آماده مقاله (Markdown / LaTeX)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. Dataset Selector Bar */}
        <DatasetSelector
          datasets={datasets}
          selectedDatasetId={selectedId}
          onSelectDataset={setSelectedId}
          onCreateNew={() => setIsCreateModalOpen(true)}
          onDeleteDataset={handleDeleteDataset}
          onLoadSample={setSelectedId}
        />

        {activeDataset && (
          <>
            {/* 2. Raw Data Entry Table with Outlier Guard */}
            <RawDataEditor
              dataset={activeDataset}
              onChange={handleUpdateDataset}
            />

            {/* 3. Statistical Assumptions Verification Audit */}
            {auditReport && (
              <AssumptionAuditPanel
                dataset={activeDataset}
                auditReport={auditReport}
                onUpdateClarifications={(clarifications) => {
                  handleUpdateDataset({
                    ...activeDataset,
                    userClarifications: clarifications
                  });
                }}
              />
            )}

            {/* 4. Comprehensive Descriptive Statistics Table */}
            <DescriptiveStatsTable
              dataset={activeDataset}
              statsMap={statsMap}
            />

            {/* 5. One-Way ANOVA & Post-Hoc Tests */}
            {anovaResult && auditReport && (
              <AnovaSection
                dataset={activeDataset}
                anovaResult={anovaResult}
                auditReport={auditReport}
                onPostHocMethodChange={setPostHocMethod}
              />
            )}

            {/* 6. Scientific Visualizations & Charts */}
            <ScientificCharts
              dataset={activeDataset}
              statsMap={statsMap}
              anovaResult={anovaResult || undefined}
            />

            {/* 7. Correlation & Linear Regression */}
            <CorrelationRegressionSection
              dataset={activeDataset}
            />
          </>
        )}
      </main>

      {/* Create Dataset Modal */}
      <CreateDatasetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateDataset}
      />

      {/* Unit Tests Modal */}
      <UnitTestsModal
        isOpen={isUnitTestsModalOpen}
        onClose={() => setIsUnitTestsModalOpen(false)}
      />
    </div>
  );
};
