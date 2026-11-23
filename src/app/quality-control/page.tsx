import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  FlaskConical,
  Boxes,
  Activity,
  AlertTriangle,
  Download,
  RotateCcw,
  Trash2,
  Scale
} from 'lucide-react';
import {
  QCProductionBatch,
  QCSample,
  QCTestResult,
  QCDeviation,
  QCCAPAAction
} from '../../types/qualityControl';
import {
  BENCHMARK_PRODUCTION_BATCHES,
  BENCHMARK_QC_SAMPLES,
  BENCHMARK_QC_TEST_RESULTS,
  BENCHMARK_QC_DEVIATIONS,
  BENCHMARK_CAPA_ACTIONS
} from '../../data/qualityControlData';
import {
  loadQCWorkspace,
  saveQCWorkspace,
  getBenchmarkQCWorkspace,
  getEmptyQCWorkspace
} from '../../lib/storage/qcStorage';
import { appAlert, appConfirm } from '../../components/common/DialogProvider';

import { QCQAOverview } from '../../components/quality-control/QCQAOverview';
import { SampleBatchManager } from '../../components/quality-control/SampleBatchManager';
import { TestResultLogger } from '../../components/quality-control/TestResultLogger';
import { ControlChartTrendAnalysis } from '../../components/quality-control/ControlChartTrendAnalysis';
import { DeviationCapaManager } from '../../components/quality-control/DeviationCapaManager';
import { QCExportCertificateModal } from '../../components/quality-control/QCExportCertificateModal';

export const QualityControlPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'samples' | 'results' | 'charts' | 'deviations'>('overview');

  // Persisted Application State (seeded with benchmark data until user customizes or clears)
  const [batches, setBatches] = useState<QCProductionBatch[]>(BENCHMARK_PRODUCTION_BATCHES);
  const [samples, setSamples] = useState<QCSample[]>(BENCHMARK_QC_SAMPLES);
  const [testResults, setTestResults] = useState<QCTestResult[]>(BENCHMARK_QC_TEST_RESULTS);
  const [deviations, setDeviations] = useState<QCDeviation[]>(BENCHMARK_QC_DEVIATIONS);
  const [capas, setCapas] = useState<QCCAPAAction[]>(BENCHMARK_CAPA_ACTIONS);
  const [isBenchmarkData, setIsBenchmarkData] = useState<boolean>(true);
  const [hydrated, setHydrated] = useState<boolean>(false);

  // Selected sample for test logging
  const [selectedSampleForTest, setSelectedSampleForTest] = useState<QCSample | undefined>(BENCHMARK_QC_SAMPLES[0]);

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedBatchForExport, setSelectedBatchForExport] = useState<QCProductionBatch | null>(
    BENCHMARK_PRODUCTION_BATCHES[0] || null
  );

  useEffect(() => {
    let active = true;
    loadQCWorkspace()
      .then((ws) => {
        if (!active) return;
        setBatches(ws.batches);
        setSamples(ws.samples);
        setTestResults(ws.testResults);
        setDeviations(ws.deviations);
        setCapas(ws.capas);
        setIsBenchmarkData(ws.isBenchmarkData);
        setSelectedSampleForTest(ws.samples[0]);
        setSelectedBatchForExport(ws.batches[0] || null);
      })
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const persistState = (next: {
    batches: QCProductionBatch[];
    samples: QCSample[];
    testResults: QCTestResult[];
    deviations: QCDeviation[];
    capas: QCCAPAAction[];
    isBenchmarkData: boolean;
  }) => {
    if (!hydrated) return;
    saveQCWorkspace(next).catch((err) => {
      console.error('Failed to persist QC workspace:', err);
    });
  };

  const handleAddBatch = (newBatch: QCProductionBatch) => {
    const nextBatches = [newBatch, ...batches];
    setBatches(nextBatches);
    setSelectedBatchForExport((prev) => prev || newBatch);
    setIsBenchmarkData(false);
    persistState({
      batches: nextBatches,
      samples,
      testResults,
      deviations,
      capas,
      isBenchmarkData: false
    });
  };

  const handleAddSample = (newSample: QCSample) => {
    const nextSamples = [newSample, ...samples];
    setSamples(nextSamples);
    setSelectedSampleForTest((prev) => prev || newSample);
    setIsBenchmarkData(false);
    persistState({
      batches,
      samples: nextSamples,
      testResults,
      deviations,
      capas,
      isBenchmarkData: false
    });
  };

  const handleUpdateBatchStatus = (batchNumber: string, newStatus: QCProductionBatch['status']) => {
    const nextBatches = batches.map((b) => (b.batchNumber === batchNumber ? { ...b, status: newStatus } : b));
    setBatches(nextBatches);
    setIsBenchmarkData(false);
    persistState({
      batches: nextBatches,
      samples,
      testResults,
      deviations,
      capas,
      isBenchmarkData: false
    });
  };

  const handleSaveTestResult = (result: QCTestResult) => {
    const nextResults = [result, ...testResults];
    const nextSamples = samples.map((s) => {
      if (s.id === result.sampleId) {
        return {
          ...s,
          sampleState: (result.complianceStatus === 'out_of_specification' ? 'quarantined' : 'approved') as QCSample['sampleState']
        };
      }
      return s;
    });
    setTestResults(nextResults);
    setSamples(nextSamples);
    setIsBenchmarkData(false);
    persistState({
      batches,
      samples: nextSamples,
      testResults: nextResults,
      deviations,
      capas,
      isBenchmarkData: false
    });
  };

  const handleSelectSampleForTest = (sample: QCSample) => {
    setSelectedSampleForTest(sample);
    setActiveTab('results');
  };

  const handleCreateDeviationFromOOS = (result: QCTestResult) => {
    const newDev: QCDeviation = {
      id: `dev-${Date.now()}`,
      deviationNumber: `DEV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      dateReported: new Date().toISOString().slice(0, 10),
      severity: 'major',
      sourceType: 'oos_result',
      batchNumber: result.batchNumber,
      sampleId: result.sampleId,
      testResultId: result.id,
      titleFa: `انحراف و خروج از مشخصات استاندارد ${result.analyteNameFa} در بچ ${result.batchNumber}`,
      descriptionFa: `در آزمون ${result.testTitleFa}، مقدار میانگین ${result.mean.toFixed(2)} ${result.unit} با انحراف معیار ${result.standardDeviation.toFixed(3)} ثبت گردید که با حدود مصوب استاندارد مرجع مغایرت دارد.`,
      rootCauseAnalysisFa: {
        category: 'material',
        rootCauseSummaryFa: 'بررسی عدم انطباق پارامترهای فرمولاسیون یا فرآیند حرارتی در خط تولید.'
      },
      immediateCorrectionFa: 'توقف خروج بچ تولیدی، صدور برچسب قرنطینه آزمایشگاهی و ارزیابی بچ‌های متوالی.',
      productDisposition: 'quarantine',
      reportedBy: result.operator.fullNameFa,
      status: 'open'
    };

    const nextDeviations = [newDev, ...deviations];
    setDeviations(nextDeviations);
    setIsBenchmarkData(false);
    persistState({
      batches,
      samples,
      testResults,
      deviations: nextDeviations,
      capas,
      isBenchmarkData: false
    });
    setActiveTab('deviations');
  };

  const handleAddDeviation = (deviation: QCDeviation) => {
    const nextDeviations = [deviation, ...deviations];
    setDeviations(nextDeviations);
    setIsBenchmarkData(false);
    persistState({
      batches,
      samples,
      testResults,
      deviations: nextDeviations,
      capas,
      isBenchmarkData: false
    });
  };

  const handleAddCapa = (capa: QCCAPAAction) => {
    const nextCapas = [capa, ...capas];
    setCapas(nextCapas);
    setIsBenchmarkData(false);
    persistState({
      batches,
      samples,
      testResults,
      deviations,
      capas: nextCapas,
      isBenchmarkData: false
    });
  };

  const handleUpdateDeviationStatus = (id: string, status: QCDeviation['status']) => {
    const nextDeviations = deviations.map((d) => (d.id === id ? { ...d, status } : d));
    setDeviations(nextDeviations);
    setIsBenchmarkData(false);
    persistState({
      batches,
      samples,
      testResults,
      deviations: nextDeviations,
      capas,
      isBenchmarkData: false
    });
  };

  const handleUpdateCapaStatus = (id: string, status: QCCAPAAction['status']) => {
    const nextCapas = capas.map((c) => (c.id === id ? { ...c, status } : c));
    setCapas(nextCapas);
    setIsBenchmarkData(false);
    persistState({
      batches,
      samples,
      testResults,
      deviations,
      capas: nextCapas,
      isBenchmarkData: false
    });
  };

  const openExportForBatch = (b?: QCProductionBatch) => {
    if (!b) {
      appAlert('ابتدا حداقل یک بچ تولیدی برای صدور گواهی آنالیز (CoA) ثبت کنید.', 'warning');
      return;
    }
    setSelectedBatchForExport(b);
    setIsExportModalOpen(true);
  };

  const handleClearQCData = async () => {
    const confirmed = await appConfirm(
      'آیا مایلید تمام بچ‌ها، نمونه‌ها، نتایج آزمون، انحرافات و CAPAهای ثبت‌شده پاک شوند تا محیط کارخانه خودتان را از صفر ثبت کنید؟',
      { title: 'پاک‌سازی محیط کنترل کیفیت', confirmLabel: 'پاک‌سازی کامل', destructive: true }
    );
    if (!confirmed) return;

    const empty = getEmptyQCWorkspace();
    setBatches(empty.batches);
    setSamples(empty.samples);
    setTestResults(empty.testResults);
    setDeviations(empty.deviations);
    setCapas(empty.capas);
    setIsBenchmarkData(false);
    setSelectedSampleForTest(undefined);
    setSelectedBatchForExport(null);
    await saveQCWorkspace(empty);
    appAlert('محیط کنترل کیفیت پاک‌سازی شد و آماده ثبت داده‌های واقعی خط تولید است.', 'success');
  };

  const handleResetBenchmarkData = async () => {
    const confirmed = await appConfirm(
      'آیا می‌خواهید داده‌های مرجع نمونه (INSO 2406 / 4152) دوباره بارگذاری شوند؟',
      { title: 'بازنشانی به داده‌های نمونه', confirmLabel: 'بارگذاری داده‌های نمونه', destructive: false }
    );
    if (!confirmed) return;

    const bench = getBenchmarkQCWorkspace();
    setBatches(bench.batches);
    setSamples(bench.samples);
    setTestResults(bench.testResults);
    setDeviations(bench.deviations);
    setCapas(bench.capas);
    setIsBenchmarkData(true);
    setSelectedSampleForTest(bench.samples[0]);
    setSelectedBatchForExport(bench.batches[0] || null);
    await saveQCWorkspace(bench);
    appAlert('داده‌های مرجع کنترل کیفیت بازنشانی و در IndexedDB ذخیره شدند.', 'success');
  };

  return (
    <div id="quality-control-page-root" className="min-h-screen bg-slate-100/60 pb-16 font-sans antialiased text-right" dir="rtl">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    سیستم کنترل کیفیت و تضمین کیفیت (QA/QC)
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                      isBenchmarkData
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isBenchmarkData ? 'حاوی داده‌های نمونه پایلوت' : 'ذخیره‌سازی دائمی IndexedDB'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ثبت بچ تولیدی و نمونه، تکرارها، انحراف معیار، ردیابی کالیبراسیون و معرف، تحلیل روند SPC و مدیریت CAPA
                </p>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
              <button
                type="button"
                onClick={handleClearQCData}
                className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                title="پاک‌سازی داده‌های نمونه برای ثبت رکوردهای واقعی خط تولید"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>شروع محیط خام</span>
              </button>
              <button
                type="button"
                onClick={handleResetBenchmarkData}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                title="بازنشانی به داده‌های نمونه استاندارد"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>داده‌های نمونه</span>
              </button>
              <button
                id="btn-open-coa-export"
                onClick={() => openExportForBatch(batches[0])}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>صدور گواهی آنالیز (CoA Export)</span>
              </button>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
            <button
              id="tab-btn-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>مفاهیم و تعاریف QC و QA</span>
            </button>

            <button
              id="tab-btn-samples"
              onClick={() => setActiveTab('samples')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
                activeTab === 'samples'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>ثبت نمونه‌ها و بچ‌ها ({samples.length})</span>
            </button>

            <button
              id="tab-btn-results"
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
                activeTab === 'results'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>ثبت نتایج و تکرارها (SD / RSD)</span>
            </button>

            <button
              id="tab-btn-charts"
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
                activeTab === 'charts'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>نمودار شوهارت و تحلیل روند (SPC)</span>
            </button>

            <button
              id="tab-btn-deviations"
              onClick={() => setActiveTab('deviations')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
                activeTab === 'deviations'
                  ? 'border-rose-600 text-rose-700 bg-rose-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>عدم انطباق و اقدامات اصلاحی ({deviations.length})</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && (
          <QCQAOverview
            totalBatchesCount={batches.length}
            totalSamplesCount={samples.length}
            totalTestsCount={testResults.length}
            activeDeviationsCount={deviations.filter((d) => d.status !== 'closed').length}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'samples' && (
          <SampleBatchManager
            batches={batches}
            samples={samples}
            onAddBatch={handleAddBatch}
            onAddSample={handleAddSample}
            onSelectSampleForTest={handleSelectSampleForTest}
            onUpdateBatchStatus={handleUpdateBatchStatus}
          />
        )}

        {activeTab === 'results' && (
          <TestResultLogger
            samples={samples}
            selectedSample={selectedSampleForTest}
            onSaveTestResult={handleSaveTestResult}
            onCreateDeviationFromOOS={handleCreateDeviationFromOOS}
          />
        )}

        {activeTab === 'charts' && <ControlChartTrendAnalysis />}

        {activeTab === 'deviations' && (
          <DeviationCapaManager
            deviations={deviations}
            capas={capas}
            onAddDeviation={handleAddDeviation}
            onAddCapa={handleAddCapa}
            onUpdateDeviationStatus={handleUpdateDeviationStatus}
            onUpdateCapaStatus={handleUpdateCapaStatus}
          />
        )}
      </main>

      {/* Export Modal */}
      {selectedBatchForExport && (
        <QCExportCertificateModal
          batch={selectedBatchForExport}
          sample={samples.find((s) => s.batchNumber === selectedBatchForExport.batchNumber)}
          results={testResults.filter((r) => r.batchNumber === selectedBatchForExport.batchNumber)}
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
};
export default QualityControlPage;
