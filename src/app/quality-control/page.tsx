import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FlaskConical, 
  Boxes, 
  Activity, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  Award, 
  Layers, 
  Download, 
  Plus, 
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
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
  BENCHMARK_CAPA_ACTIONS,
  MILK_FAT_HISTORICAL_RUNS
} from '../../data/qualityControlData';

import { QCQAOverview } from '../../components/quality-control/QCQAOverview';
import { SampleBatchManager } from '../../components/quality-control/SampleBatchManager';
import { TestResultLogger } from '../../components/quality-control/TestResultLogger';
import { ControlChartTrendAnalysis } from '../../components/quality-control/ControlChartTrendAnalysis';
import { DeviationCapaManager } from '../../components/quality-control/DeviationCapaManager';
import { QCExportCertificateModal } from '../../components/quality-control/QCExportCertificateModal';

export const QualityControlPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'samples' | 'results' | 'charts' | 'deviations'>('overview');

  // Application State
  const [batches, setBatches] = useState<QCProductionBatch[]>(BENCHMARK_PRODUCTION_BATCHES);
  const [samples, setSamples] = useState<QCSample[]>(BENCHMARK_QC_SAMPLES);
  const [testResults, setTestResults] = useState<QCTestResult[]>(BENCHMARK_QC_TEST_RESULTS);
  const [deviations, setDeviations] = useState<QCDeviation[]>(BENCHMARK_QC_DEVIATIONS);
  const [capas, setCapas] = useState<QCCAPAAction[]>(BENCHMARK_CAPA_ACTIONS);

  // Selected sample for test logging
  const [selectedSampleForTest, setSelectedSampleForTest] = useState<QCSample | undefined>(samples[0]);

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedBatchForExport, setSelectedBatchForExport] = useState<QCProductionBatch>(batches[0]);

  const handleAddBatch = (newBatch: QCProductionBatch) => {
    setBatches([newBatch, ...batches]);
  };

  const handleAddSample = (newSample: QCSample) => {
    setSamples([newSample, ...samples]);
  };

  const handleUpdateBatchStatus = (batchNumber: string, newStatus: QCProductionBatch['status']) => {
    setBatches(batches.map(b => b.batchNumber === batchNumber ? { ...b, status: newStatus } : b));
  };

  const handleSaveTestResult = (result: QCTestResult) => {
    setTestResults([result, ...testResults]);
    // update sample state to approved or under_analysis
    setSamples(samples.map(s => {
      if (s.id === result.sampleId) {
        return {
          ...s,
          sampleState: result.complianceStatus === 'out_of_specification' ? 'quarantined' : 'approved'
        };
      }
      return s;
    }));
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
      titleFa: `انحراف و خروج از مشخصات استاندارد ${result.analyteNameFa} در بهمن ${result.batchNumber}`,
      descriptionFa: `در آزمون ${result.testTitleFa}، مقدار میانگین ${result.mean.toFixed(2)} ${result.unit} با انحراف معیار ${result.standardDeviation.toFixed(3)} ثبت گردید که با حدود مصوب استاندارد مرجع مغایرت دارد.`,
      rootCauseAnalysisFa: {
        category: 'material',
        rootCauseSummaryFa: 'بررسی عدم انطباق پارامترهای فرمولاسیون یا فرآیند حرارتی در خط تولید.'
      },
      immediateCorrectionFa: 'توقف خروج بهمن، صدور برچسب قرنطینه آزمایشگاهی و ارزیابی بهمن‌های متوالی.',
      productDisposition: 'quarantine',
      reportedBy: result.operator.fullNameFa,
      status: 'open'
    };

    setDeviations([newDev, ...deviations]);
    setActiveTab('deviations');
  };

  const handleAddDeviation = (deviation: QCDeviation) => {
    setDeviations([deviation, ...deviations]);
  };

  const handleAddCapa = (capa: QCCAPAAction) => {
    setCapas([capa, ...capas]);
  };

  const handleUpdateDeviationStatus = (id: string, status: QCDeviation['status']) => {
    setDeviations(deviations.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleUpdateCapaStatus = (id: string, status: QCCAPAAction['status']) => {
    setCapas(capas.map(c => c.id === id ? { ...c, status } : c));
  };

  const openExportForBatch = (b: QCProductionBatch) => {
    setSelectedBatchForExport(b);
    setIsExportModalOpen(true);
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
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    سیستم کنترل کیفیت و تضمین کیفیت (QA/QC)
                  </h1>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-black rounded-full">
                    قسمت ۱۸ از ۲۰
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ثبت بهمن و نمونه، تکرارها، انحراف معیار، ردیابی کالیبراسیون و معرف، تحلیل روند SPC و مدیریت CAPA
                </p>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-2.5 self-end md:self-auto">
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
              <span>ثبت نمونه‌ها و بهمن‌ها ({samples.length})</span>
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
            activeDeviationsCount={deviations.filter(d => d.status !== 'closed').length}
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

        {activeTab === 'charts' && (
          <ControlChartTrendAnalysis />
        )}

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
      <QCExportCertificateModal
        batch={selectedBatchForExport}
        sample={samples.find(s => s.batchNumber === selectedBatchForExport.batchNumber)}
        results={testResults.filter(r => r.batchNumber === selectedBatchForExport.batchNumber)}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
export default QualityControlPage;
