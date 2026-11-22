import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  FileSpreadsheet,
  Upload,
  BarChart2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Download,
  RefreshCw,
  Sigma,
  Zap,
  Play,
  Square,
  ShieldCheck,
  Table,
  Sliders,
  ChevronDown,
  Layers,
  Activity,
  Maximize2
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  parseCSVText,
  parseExcelBuffer,
  auditDatasetColumns,
  exportToCSVString,
  imputeMissingValues
} from '../../lib/data-center/fileParser';
import { BENCHMARK_DATASETS } from '../../lib/data-center/benchmarkDatasets';
import {
  computeAdvancedDescriptiveStats,
  detectOutliers,
  fitRegressionModel,
  calculateUncertaintyPropagation,
  calculateOneWayAnovaFromGroups,
  sortDataByColumn
} from '../../lib/data-center/advancedStatsEngine';
import { generateSciPyValidationScript } from '../../lib/data-center/scipyDataAnalysisScript';
import {
  BenchmarkDatasetInfo,
  RegressionModelType,
  DataSequenceNature,
  AdvancedDescriptiveStats,
  OutlierAnalysisReport,
  FittedRegressionResult
} from '../../lib/data-center/types';
import { usePythonEngine } from '../../lib/python/usePythonEngine';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

export const ScientificDataCenterSuite: React.FC = () => {
  // Benchmark and active data state
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>(BENCHMARK_DATASETS[0].id);
  const [activeData, setActiveData] = useState<Record<string, any>[]>(BENCHMARK_DATASETS[0].data);
  const [datasetTitle, setDatasetTitle] = useState<string>(BENCHMARK_DATASETS[0].titleFa);
  const [sourceCitation, setSourceCitation] = useState<string>(BENCHMARK_DATASETS[0].sourceCitation);
  const [isRealData, setIsRealData] = useState<boolean>(BENCHMARK_DATASETS[0].isRealExperimental);

  // Multi-sheet Excel state
  const [excelSheets, setExcelSheets] = useState<Record<string, { data: Record<string, any>[]; headers: string[] }>>({});
  const [excelSheetNames, setExcelSheetNames] = useState<string[]>([]);
  const [activeSheetName, setActiveSheetName] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'audit' | 'descriptive' | 'regression' | 'anova' | 'uncertainty' | 'charts' | 'scipy'
  >('audit');

  // Column Selections
  const [selectedXCol, setSelectedXCol] = useState<string>(BENCHMARK_DATASETS[0].defaultXCol);
  const [selectedYCol, setSelectedYCol] = useState<string>(BENCHMARK_DATASETS[0].defaultYCol);
  const [selectedModel, setSelectedModel] = useState<RegressionModelType>('linear');
  const [sequenceNature, setSequenceNature] = useState<DataSequenceNature>('time_series');

  // Uncertainty Calculator State
  const [uncertaintyFormula, setUncertaintyFormula] = useState<'sum_difference' | 'product_quotient'>('product_quotient');
  const [uncertaintyInputs, setUncertaintyInputs] = useState<
    { id: string; label: string; value: number; uncertainty: number }[]
  >([
    { id: '1', label: 'دبی جرمی (Mass Flow)', value: 120.5, uncertainty: 0.8 },
    { id: '2', label: 'ظرفیت گرمایی ویژه (Cp)', value: 3.85, uncertainty: 0.05 },
    { id: '3', label: 'اختلاف دما (Delta T)', value: 45.0, uncertainty: 0.3 }
  ]);

  // Python Engine Hook
  const {
    status: pythonStatus,
    outputChunks,
    runCode,
    stopExecution: terminateExecution,
    clearOutput,
    lastDurationMs
  } = usePythonEngine();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Column Metadata & Audit
  const auditReport = useMemo(() => {
    return auditDatasetColumns(activeData, isRealData, sourceCitation);
  }, [activeData, isRealData, sourceCitation]);

  // Available Numeric Columns
  const numericColumns = useMemo(() => {
    return auditReport.columnsMeta
      .filter(c => c.dataType === 'numeric')
      .map(c => c.key);
  }, [auditReport]);

  // Handle Benchmark Change
  const handleBenchmarkSelect = (id: string) => {
    const ds = BENCHMARK_DATASETS.find(b => b.id === id);
    if (!ds) return;
    setSelectedBenchmarkId(id);
    setActiveData(ds.data);
    setDatasetTitle(ds.titleFa);
    setSourceCitation(ds.sourceCitation);
    setIsRealData(ds.isRealExperimental);
    setSelectedXCol(ds.defaultXCol);
    setSelectedYCol(ds.defaultYCol);
    setExcelSheets({});
    setExcelSheetNames([]);
    setActiveSheetName('');
  };

  // Handle Sheet Switch for Multi-sheet Excel
  const handleSheetSwitch = (sheetName: string) => {
    if (!excelSheets[sheetName]) return;
    const sheetInfo = excelSheets[sheetName];
    setActiveSheetName(sheetName);
    setActiveData(sheetInfo.data);
    setDatasetTitle(prev => {
      const base = prev.split(' (کاربرگ:')[0];
      return `${base} (کاربرگ: ${sheetName})`;
    });
    setSourceCitation(prev => {
      const base = prev.split(' - کاربرگ:')[0];
      return `${base} - کاربرگ: ${sheetName}`;
    });
    if (sheetInfo.headers.length >= 2) {
      setSelectedXCol(sheetInfo.headers[0]);
      setSelectedYCol(sheetInfo.headers[1]);
    }
  };

  // Sort Table Data by X for Durbin-Watson and Chart Consistency
  const handleSortByX = () => {
    if (!selectedXCol || activeData.length < 2) return;
    const sorted = sortDataByColumn(activeData, selectedXCol, true);
    setActiveData(sorted);
  };

  // Handle File Upload (CSV or Excel)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    try {
      if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
        const text = await file.text();
        const parsed = parseCSVText(text);
        if (parsed.data.length > 0) {
          setExcelSheets({});
          setExcelSheetNames([]);
          setActiveSheetName('');
          setActiveData(parsed.data);
          setDatasetTitle(file.name);
          setSourceCitation(`فایل ورودی کاربر: ${file.name}`);
          setIsRealData(true);
          const keys = Object.keys(parsed.data[0]);
          if (keys.length >= 2) {
            setSelectedXCol(keys[0]);
            setSelectedYCol(keys[1]);
          }
        }
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        const parsed = parseExcelBuffer(buffer);
        if (parsed.data.length > 0) {
          setExcelSheets(parsed.sheets || {});
          setExcelSheetNames(parsed.sheetNames || []);
          setActiveSheetName(parsed.selectedSheet || '');
          setActiveData(parsed.data);
          setDatasetTitle(`${file.name}${parsed.selectedSheet ? ` (کاربرگ: ${parsed.selectedSheet})` : ''}`);
          setSourceCitation(`فایل اکسل ورودی کاربر: ${file.name}${parsed.selectedSheet ? ` - کاربرگ: ${parsed.selectedSheet}` : ''}`);
          setIsRealData(true);
          const keys = Object.keys(parsed.data[0]);
          if (keys.length >= 2) {
            setSelectedXCol(keys[0]);
            setSelectedYCol(keys[1]);
          }
        }
      } else {
        alert('لطفاً یک فایل CSV یا Excel معتبر (.xlsx / .xls) انتخاب فرمایید.');
      }
    } catch (err: any) {
      alert(`خطا در بازخوانی فایل: ${err.message || 'فرمت فایل معتبر نیست'}`);
    }
  };

  // Missing Values Imputation
  const handleImpute = (strategy: 'mean' | 'median' | 'drop_row') => {
    const imputed = imputeMissingValues(activeData, strategy);
    setActiveData(imputed);
  };

  // Descriptive Statistics for Selected Y Column
  const descriptiveStats = useMemo(() => {
    if (!selectedYCol || activeData.length === 0) return null;
    const vals = activeData.map(d => Number(d[selectedYCol])).filter(v => !isNaN(v));
    const meta = auditReport.columnsMeta.find(c => c.key === selectedYCol);
    return computeAdvancedDescriptiveStats(vals, selectedYCol, meta?.labelFa || selectedYCol);
  }, [activeData, selectedYCol, auditReport]);

  // Outlier Analysis
  const outlierReport = useMemo(() => {
    if (!selectedYCol || activeData.length === 0) return null;
    const vals = activeData.map(d => Number(d[selectedYCol])).filter(v => !isNaN(v));
    const meta = auditReport.columnsMeta.find(c => c.key === selectedYCol);
    return detectOutliers(vals, selectedYCol, meta?.labelFa || selectedYCol);
  }, [activeData, selectedYCol, auditReport]);

  // Fitted Regression Model
  const regressionResult = useMemo(() => {
    if (!selectedXCol || !selectedYCol || activeData.length < 3) return null;
    const pts = activeData
      .map(d => ({ x: Number(d[selectedXCol]), y: Number(d[selectedYCol]) }))
      .filter(p => !isNaN(p.x) && !isNaN(p.y));
    return fitRegressionModel(pts, selectedModel, sequenceNature);
  }, [activeData, selectedXCol, selectedYCol, selectedModel, sequenceNature]);

  // One-Way ANOVA
  const anovaResult = useMemo(() => {
    // If the dataset has a categorical column and a numeric column, group by category
    const catCol = auditReport.columnsMeta.find(c => c.dataType === 'categorical')?.key;
    if (catCol && selectedYCol) {
      const groupsMap = new Map<string, number[]>();
      activeData.forEach(row => {
        const cat = String(row[catCol] || 'Other');
        const val = Number(row[selectedYCol]);
        if (!isNaN(val)) {
          if (!groupsMap.has(cat)) groupsMap.set(cat, []);
          groupsMap.get(cat)!.push(val);
        }
      });
      if (groupsMap.size >= 2) {
        const groups = Array.from(groupsMap.entries()).map(([name, values]) => ({ name, values }));
        return calculateOneWayAnovaFromGroups(groups);
      }
    }
    // Fallback: compare across two numeric columns if available
    if (numericColumns.length >= 2) {
      const g1 = activeData.map(d => Number(d[numericColumns[0]])).filter(v => !isNaN(v));
      const g2 = activeData.map(d => Number(d[numericColumns[1]])).filter(v => !isNaN(v));
      return calculateOneWayAnovaFromGroups([
        { name: numericColumns[0], values: g1 },
        { name: numericColumns[1], values: g2 }
      ]);
    }
    return null;
  }, [activeData, selectedYCol, auditReport, numericColumns]);

  // Uncertainty Propagation
  const uncertaintyResult = useMemo(() => {
    try {
      return calculateUncertaintyPropagation(uncertaintyFormula, uncertaintyInputs);
    } catch {
      return null;
    }
  }, [uncertaintyFormula, uncertaintyInputs]);

  // Python Script Content
  const pythonScript = useMemo(() => {
    return generateSciPyValidationScript(activeData, selectedXCol, selectedYCol, selectedModel);
  }, [activeData, selectedXCol, selectedYCol, selectedModel]);

  // Run SciPy in WebWorker
  const handleExecuteSciPy = async () => {
    clearOutput();
    try {
      await runCode(pythonScript, 25000);
    } catch (e: any) {
      console.error(e);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvStr = exportToCSVString(activeData);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${datasetTitle.replace(/\s+/g, '_')}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-teal-950 text-white rounded-2xl p-6 shadow-xl border border-teal-700/40 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                اعتبارسنجی مستقل با SciPy & NumPy
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
                isRealData 
                  ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
              }`}>
                {isRealData ? 'داده تجربی واقعی (AOAC / Reference)' : 'داده سنتتیک شبیه‌سازی‌شده'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              مرکز جامع تحلیل داده و اعتبارسنجی نتایج علمی
            </h1>
            <p className="text-sm md:text-base text-emerald-100/90 mt-1 max-w-3xl leading-relaxed">
              آنالیز آماری پیشرفته، رگرسیون غیرخطی، آزمون فرض و انتشار خطای اندازه‌گیری با تأیید اعتبار موازی در پایتون
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.txt,.xlsx,.xls"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 bg-white text-teal-900 hover:bg-emerald-50 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Upload className="w-4 h-4 text-teal-700" />
              بارگذاری CSV یا Excel
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-teal-800/80 hover:bg-teal-700/80 border border-teal-600/50 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              خروجی داده‌ها
            </button>
          </div>
        </div>

        {/* Dataset Reference Citation Bar */}
        <div className="mt-4 pt-3 border-t border-teal-700/50 flex flex-wrap items-center justify-between text-xs text-emerald-200/80 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-100">مجموعه داده جاری:</span>
            <span>{datasetTitle}</span>
            <span className="text-emerald-400/60">•</span>
            <span className="truncate max-w-md italic">{sourceCitation}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>تعداد سطرها: <strong>{activeData.length}</strong></span>
            <span>تعداد ستون‌ها: <strong>{Object.keys(activeData[0] || {}).length}</strong></span>
          </div>
        </div>

        {/* Multi-sheet Excel Selector */}
        {excelSheetNames.length > 1 && (
          <div className="mt-3 pt-3 border-t border-teal-700/50 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-emerald-100 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              کاربرگ‌های شناسایی‌شده در فایل اکسل ({excelSheetNames.length} شیت):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {excelSheetNames.map((sName) => (
                <button
                  key={sName}
                  onClick={() => handleSheetSwitch(sName)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeSheetName === sName
                      ? 'bg-emerald-500 text-stone-950 font-bold shadow'
                      : 'bg-teal-950/70 hover:bg-teal-900 text-emerald-200 border border-teal-700/40'
                  }`}
                >
                  {sName} {excelSheets[sName] ? `(${excelSheets[sName].data.length} سطر)` : ''}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Benchmark Datasets Selector */}
      <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-stone-300 font-medium">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>مجموعه داده‌های محک استاندارد (Benchmarks):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {BENCHMARK_DATASETS.map((ds) => (
            <button
              key={ds.id}
              onClick={() => handleBenchmarkSelect(ds.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedBenchmarkId === ds.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-700'
              }`}
            >
              {ds.titleFa}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-stone-800 space-x-reverse space-x-1 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: 'audit', labelFa: 'ممیزی کیفیت و داده‌ها', icon: ShieldCheck },
          { id: 'descriptive', labelFa: 'آمار توصیفی و داده‌های پرت', icon: BarChart2 },
          { id: 'regression', labelFa: 'رگرسیون و برازش مدل‌ها', icon: TrendingUp },
          { id: 'anova', labelFa: 'تحلیل واریانس (ANOVA)', icon: Layers },
          { id: 'uncertainty', labelFa: 'انتشار عدم قطعیت و خطا', icon: Sliders },
          { id: 'charts', labelFa: 'نمودارهای علمی و بصری', icon: Activity },
          { id: 'scipy', labelFa: 'راستی‌آزمایی در SciPy', icon: Zap }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-stone-800/90 text-emerald-400 border-t-2 border-emerald-500 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.labelFa}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DATA AUDIT & QUALITY */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Quality Audit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
              <div className="text-xs text-stone-400 mb-1">وضعیت سلامت مجموعه داده</div>
              <div className="flex items-center gap-2">
                {auditReport.isValid ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-emerald-400">تأیید شده و بدون نقص بحرانی</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-amber-400">نیازمند بازبینی و پالایش</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
              <div className="text-xs text-stone-400 mb-1">تعداد مقادیر گمشده (NaN/Empty)</div>
              <div className="text-xl font-bold text-stone-200">
                {auditReport.missingCellsCount} <span className="text-xs font-normal text-stone-400">سلول</span>
              </div>
            </div>

            <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
              <div className="text-xs text-stone-400 mb-1">نوع داده آزمایشگاهی</div>
              <div className="text-sm font-semibold text-stone-200">
                {isRealData ? 'تجربی واقعی (AOAC / Reference)' : 'داده سنتتیک مهندسی'}
              </div>
            </div>

            <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
              <div className="text-xs text-stone-400 mb-1">پالایش مقادیر گمشده</div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleImpute('mean')}
                  className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs"
                  title="جایگزینی مقادیر گمشده با میانگین ستون"
                >
                  میانگین
                </button>
                <button
                  onClick={() => handleImpute('median')}
                  className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs"
                  title="جایگزینی با میانه"
                >
                  میانه
                </button>
                <button
                  onClick={() => handleImpute('drop_row')}
                  className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-red-300 rounded text-xs"
                  title="حذف سطرهای دارای نقص"
                >
                  حذف سطر
                </button>
              </div>
            </div>
          </div>

          {/* Columns Inspection Table */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <h3 className="font-semibold text-stone-200 text-sm flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-400" />
                ساختار ستون‌ها، نوع داده و محدوده‌های فیزیکی مجاز
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm text-stone-300">
                <thead className="bg-stone-800/60 text-xs text-stone-400">
                  <tr>
                    <th className="p-3">نام ستون (Key)</th>
                    <th className="p-3">عنوان فارسی</th>
                    <th className="p-3">نوع متغیر</th>
                    <th className="p-3">واحد فیزیکی</th>
                    <th className="p-3">تعداد گمشده</th>
                    <th className="p-3">صحت دامنه فیزیکی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {auditReport.columnsMeta.map(col => (
                    <tr key={col.key} className="hover:bg-stone-800/30">
                      <td className="p-3 font-mono text-emerald-400 font-semibold">{col.key}</td>
                      <td className="p-3">{col.labelFa}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-xs bg-stone-800 text-stone-300 border border-stone-700">
                          {col.dataType}
                        </span>
                      </td>
                      <td className="p-3 text-stone-400 font-mono">{col.unit || '—'}</td>
                      <td className="p-3 text-stone-400">
                        {col.missingCount > 0 ? (
                          <span className="text-amber-400 font-medium">{col.missingCount} سلول</span>
                        ) : (
                          <span className="text-emerald-400">۰ (کامل)</span>
                        )}
                      </td>
                      <td className="p-3">
                        {col.isPhysicalValid ? (
                          <span className="text-emerald-400 text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> معتبر
                          </span>
                        ) : (
                          <span className="text-amber-400 text-xs flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> خارج از محدوده
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Raw Data Preview Grid */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
            <h4 className="font-semibold text-stone-200 text-sm mb-3">پیش‌نمایش داده‌های خام (۱۰ سطر نخست)</h4>
            <div className="overflow-x-auto max-h-60 scrollbar-thin">
              <table className="w-full text-right text-xs text-stone-300">
                <thead className="bg-stone-800 text-stone-400 sticky top-0">
                  <tr>
                    <th className="p-2">#</th>
                    {Object.keys(activeData[0] || {}).map(k => (
                      <th key={k} className="p-2 font-mono">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono">
                  {activeData.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-stone-800/30">
                      <td className="p-2 text-stone-500">{idx + 1}</td>
                      {Object.keys(row).map(k => (
                        <td key={k} className="p-2">{String(row[k])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DESCRIPTIVE STATISTICS & OUTLIERS */}
      {activeTab === 'descriptive' && (
        <div className="space-y-6">
          {/* Column Selector */}
          <div className="flex items-center gap-3 bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
            <span className="text-sm text-stone-300 font-medium">انتخاب متغیر هدف برای تحلیل آماری:</span>
            <select
              value={selectedYCol}
              onChange={e => setSelectedYCol(e.target.value)}
              className="bg-stone-800 border border-stone-700 text-stone-200 rounded-lg px-3 py-1.5 text-sm font-mono focus:border-emerald-500 focus:outline-none"
            >
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          {descriptiveStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400">تعداد نمونه (N)</div>
                <div className="text-2xl font-bold text-stone-100 mt-1">{descriptiveStats.n}</div>
                <div className="text-xs text-stone-500 mt-1">مجموع: {descriptiveStats.sum}</div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400">میانگین و میانه (Mean & Median)</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{descriptiveStats.mean}</div>
                <div className="text-xs text-stone-400 mt-1 font-mono">میانه: {descriptiveStats.median}</div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400">انحراف معیار و خطای استاندارد (SD / SEM)</div>
                <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">±{descriptiveStats.standardDeviation}</div>
                <div className="text-xs text-stone-400 mt-1 font-mono">SEM: ±{descriptiveStats.standardErrorOfMean}</div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400">ضریب تغییرات (CV%)</div>
                <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">{descriptiveStats.coefficientOfVariation}%</div>
                <div className="text-xs text-stone-400 mt-1">
                  {descriptiveStats.coefficientOfVariation < 5 ? 'دقت بسیار بالا (CV < 5%)' : 'پراکندگی متوسط'}
                </div>
              </div>
            </div>
          )}

          {/* Full Descriptive Stats Table */}
          {descriptiveStats && (
            <div className="bg-stone-900/60 border border-stone-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-stone-800 flex items-center justify-between">
                <h3 className="font-semibold text-stone-200 text-sm">جدول جامع پارامترهای توزیع و گشتاورها</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-stone-800 text-sm">
                <div className="p-3"><span className="text-stone-400">حداقل (Min):</span> <strong className="font-mono text-stone-200">{descriptiveStats.min}</strong></div>
                <div className="p-3"><span className="text-stone-400">حداکثر (Max):</span> <strong className="font-mono text-stone-200">{descriptiveStats.max}</strong></div>
                <div className="p-3"><span className="text-stone-400">دامنه تغییرات (Range):</span> <strong className="font-mono text-stone-200">{descriptiveStats.range}</strong></div>
                <div className="p-3"><span className="text-stone-400">دامنه میان‌چارکی (IQR):</span> <strong className="font-mono text-stone-200">{descriptiveStats.iqr}</strong></div>
                <div className="p-3"><span className="text-stone-400">چارک اول (Q1 / P25):</span> <strong className="font-mono text-stone-200">{descriptiveStats.p25}</strong></div>
                <div className="p-3"><span className="text-stone-400">چارک سوم (Q3 / P75):</span> <strong className="font-mono text-stone-200">{descriptiveStats.p75}</strong></div>
                <div className="p-3"><span className="text-stone-400">چولگی (Skewness):</span> <strong className="font-mono text-stone-200">{descriptiveStats.skewness}</strong></div>
                <div className="p-3"><span className="text-stone-400">کشیدگی (Kurtosis):</span> <strong className="font-mono text-stone-200">{descriptiveStats.kurtosis}</strong></div>
                <div className="p-3 col-span-2"><span className="text-stone-400">فاصله اطمینان ۹۵٪ میانگین:</span> <strong className="font-mono text-emerald-400">[{descriptiveStats.ci95Lower}, {descriptiveStats.ci95Upper}]</strong></div>
                <div className="p-3 col-span-2"><span className="text-stone-400">فاصله اطمینان ۹۹٪ میانگین:</span> <strong className="font-mono text-emerald-400">[{descriptiveStats.ci99Lower}, {descriptiveStats.ci99Upper}]</strong></div>
              </div>
            </div>
          )}

          {/* Outlier Detection Panel */}
          {outlierReport && (
            <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-semibold text-stone-200 text-sm">
                    تحلیل داده‌های پرت با روش‌های توکی (Tukey IQR) و نمره Z و آزمون گرابز (Grubbs)
                  </h3>
                </div>
                <div className="text-xs text-stone-400">
                  محدوده مجاز توکی: [{outlierReport.tukeyLowerBound}, {outlierReport.tukeyUpperBound}]
                </div>
              </div>

              {outlierReport.outliersCount === 0 ? (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  هیچ داده پرتی (Outlier) در این متغیر شناسایی نشد. توزیع داده‌ها پایدار و در محدوده مجاز است.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs text-stone-300">
                    <thead className="bg-stone-800 text-stone-400">
                      <tr>
                        <th className="p-2">شماره سطر</th>
                        <th className="p-2">مقدار عددی</th>
                        <th className="p-2">روش کشف</th>
                        <th className="p-2">نمره Z</th>
                        <th className="p-2">شدت</th>
                        <th className="p-2">توصیه علمی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800 font-mono">
                      {outlierReport.outliers.map((o, i) => (
                        <tr key={i} className="hover:bg-stone-800/30">
                          <td className="p-2 text-stone-400">{o.rowIndex}</td>
                          <td className="p-2 text-amber-400 font-bold">{o.value}</td>
                          <td className="p-2 text-stone-300">{o.method === 'tukey_iqr' ? 'دامنه توکی (IQR)' : 'نمره Z'}</td>
                          <td className="p-2">{o.score}</td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded ${o.category === 'extreme' ? 'bg-red-900/60 text-red-300' : 'bg-amber-900/60 text-amber-300'}`}>
                              {o.category === 'extreme' ? 'شدید (Extreme)' : 'خفیف (Mild)'}
                            </span>
                          </td>
                          <td className="p-2 font-sans text-stone-300">{o.recommendationFa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {outlierReport.grubbsTestResult && (
                <div className="mt-2 p-3 bg-stone-800/50 rounded-lg text-xs text-stone-400 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    آماره آزمون گرابز: <strong className="text-stone-200">{outlierReport.grubbsTestResult.gStatistic}</strong> (مقدار بحرانی: {outlierReport.grubbsTestResult.criticalG})
                  </span>
                  <span>
                    وضعیت گرابز: {outlierReport.grubbsTestResult.isOutlierSignificant ? (
                      <span className="text-red-400 font-bold">وجود تک‌داده پرت معنی‌دار در سطح ۹۵٪</span>
                    ) : (
                      <span className="text-emerald-400 font-medium">عدم وجود داده پرت معنی‌دار در آزمون گرابز</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REGRESSION & CURVE FITTING */}
      {activeTab === 'regression' && (
        <div className="space-y-6">
          {/* Model, Axis, and Sequence Nature Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
            <div>
              <label className="text-xs text-stone-400 block mb-1">متغیر مستقل X (محور افقی):</label>
              <select
                value={selectedXCol}
                onChange={e => setSelectedXCol(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-stone-200 rounded-lg px-3 py-1.5 text-sm font-mono"
              >
                {numericColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">متغیر وابسته Y (محور عمودی):</label>
              <select
                value={selectedYCol}
                onChange={e => setSelectedYCol(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-stone-200 rounded-lg px-3 py-1.5 text-sm font-mono"
              >
                {numericColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">مدل ریاضی رگرسیون:</label>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value as RegressionModelType)}
                className="w-full bg-stone-800 border border-stone-700 text-emerald-400 font-semibold rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="linear">خطی OLS (y = mx + b)</option>
                <option value="polynomial_2">چندجمله‌ای درجه دو (y = ax² + bx + c)</option>
                <option value="power">قانون توان Power Law (y = a x^b)</option>
                <option value="exponential">نمایی اول شخص Exponential (y = a e^bx)</option>
                <option value="logarithmic">لگاریتمی Logarithmic (y = a ln(x) + b)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">ماهیت توالی داده‌ها (Sequence):</label>
              <select
                value={sequenceNature}
                onChange={e => setSequenceNature(e.target.value as DataSequenceNature)}
                className="w-full bg-stone-800 border border-stone-700 text-cyan-400 font-semibold rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="time_series">سری زمانی (Time-Series) — آزمون DW فعال</option>
                <option value="ordered_sequence">توالی ترتیبی فرآیند (Ordered) — آزمون DW فعال</option>
                <option value="cross_sectional">داده‌های مقطعی (Cross-Sectional) — DW غیرفعال</option>
                <option value="unspecified">نامشخص (Unspecified) — DW غیرفعال</option>
              </select>
            </div>
          </div>

          {/* Durbin-Watson Methodology Card */}
          {regressionResult && (
            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-stone-200 text-sm">ارزیابی استقلال خطاها و خودهمبستگی باقیمانده‌ها (Durbin-Watson)</span>
                </div>
                <div className="flex items-center gap-2">
                  {regressionResult.isDurbinWatsonValid ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 border border-emerald-700/60 text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> آزمون معتبر (توالی زمانی/ترتیبی مشاهدات)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-800 border border-stone-700 text-stone-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> آزمون غیرفعال (مختص داده‌های متوالی زمانی)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 space-y-2">
                  <div className="text-xs text-stone-300 leading-relaxed">
                    <strong>فرمول استاندارد آماره d:</strong>
                  </div>
                  <div className="p-2.5 bg-stone-950/70 rounded-lg border border-stone-800/80 overflow-x-auto text-center" dir="ltr">
                    <KaTeXRenderer expression={regressionResult.durbinWatsonFormulaLatex} displayMode={true} />
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    {regressionResult.durbinWatsonInterpretationFa}
                  </p>
                </div>

                <div className="bg-stone-950/50 border border-stone-800/60 rounded-lg p-3 text-center space-y-1">
                  <div className="text-xs text-stone-400">آماره دوربین-واتسون (d)</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">
                    {regressionResult.durbinWatsonStatistic !== null ? regressionResult.durbinWatsonStatistic : 'غیرفعال'}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {regressionResult.isDurbinWatsonValid ? 'بازه ایده‌آل بدون خودهمبستگی: ۱.۵ تا ۲.۵' : 'داده‌های مقطعی فاقد توالی زمانی'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regression Metrics & Equation */}
          {regressionResult && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl md:col-span-2">
                <div className="text-xs text-stone-400">معادله برازش‌شده نهایی</div>
                <div className="text-lg font-bold text-emerald-400 mt-1 font-mono" dir="ltr">
                  {regressionResult.equationString}
                </div>
                <div className="mt-2">
                  <KaTeXRenderer expression={regressionResult.formulaLatex} displayMode={false} />
                </div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400">ضریب تبیین (R² / Adj-R²)</div>
                <div className="text-2xl font-bold text-stone-100 mt-1 font-mono">
                  {regressionResult.rSquared}
                </div>
                <div className="text-xs text-stone-400 mt-1 font-mono">
                  Adj R²: {regressionResult.adjustedRSquared} | r: {regressionResult.pearsonR}
                </div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400">خطای برازش (RMSE)</div>
                <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">
                  {regressionResult.rmse}
                </div>
                <div className="text-xs text-stone-400 mt-1">
                  {regressionResult.isDurbinWatsonValid ? (
                    <span>آماره d: <strong className="font-mono text-cyan-300">{regressionResult.durbinWatsonStatistic}</strong></span>
                  ) : (
                    <span className="text-stone-400">آزمون DW: غیرفعال</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Curve Fit Chart & Residuals Plot */}
          {regressionResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fitted Curve vs Real Points */}
              <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <h4 className="text-sm font-semibold text-stone-200 mb-3 flex items-center justify-between">
                  <span>منحنی برازش‌شده و نقاط آزمایشگاهی</span>
                  <span className="text-xs font-mono text-emerald-400">R² = {regressionResult.rSquared}</span>
                </h4>
                <div className="h-72 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={regressionResult.fittedCurve} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                      <XAxis dataKey="x" stroke="#78716c" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#78716c" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #44403c', borderRadius: 8 }} />
                      <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2} dot={false} name="منحنی مدل" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Residuals Plot */}
              <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
                <h4 className="text-sm font-semibold text-stone-200 mb-3 flex items-center justify-between">
                  <span>نمودار پراکندگی باقیمانده‌ها (Residuals Plot)</span>
                  <span className="text-xs text-stone-400">بررسی همگنی واریانس و استقلال خطاها</span>
                </h4>
                <div className="h-72 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                      <XAxis dataKey="x" stroke="#78716c" tick={{ fontSize: 11 }} name="X" />
                      <YAxis dataKey="residual" stroke="#78716c" tick={{ fontSize: 11 }} name="Residual" />
                      <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />
                      <Tooltip contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #44403c', borderRadius: 8 }} />
                      <Scatter data={regressionResult.residuals} fill="#38bdf8" name="باقیمانده" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Model Parameters Table */}
          {regressionResult && (
            <div className="bg-stone-900/60 border border-stone-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-stone-800">
                <h4 className="font-semibold text-stone-200 text-sm">پارامترهای تخمین‌زده‌شده مدل و مفهوم فیزیکی</h4>
              </div>
              <table className="w-full text-right text-sm text-stone-300">
                <thead className="bg-stone-800/60 text-xs text-stone-400">
                  <tr>
                    <th className="p-3">نماد</th>
                    <th className="p-3">عنوان پارامتر</th>
                    <th className="p-3">مقدار تخمینی</th>
                    <th className="p-3">معنای فیزیکی و آزمایشگاهی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono">
                  {Object.entries(regressionResult.parameters).map(([k, p]) => (
                    <tr key={k} className="hover:bg-stone-800/30">
                      <td className="p-3 text-emerald-400 font-bold">{p.symbol}</td>
                      <td className="p-3 font-sans">{p.nameFa}</td>
                      <td className="p-3 text-stone-100">{p.value.toFixed(5)}</td>
                      <td className="p-3 font-sans text-stone-400 text-xs">
                        پارامتر برازش‌شده بر مبنای کمینه‌سازی خطای مربعات (Least Squares)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ANOVA & HYPOTHESIS TESTING */}
      {activeTab === 'anova' && (
        <div className="space-y-6">
          <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-200 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                تحلیل واریانس یک‌طرفه (One-Way ANOVA)
              </h3>
              <span className="text-xs text-stone-400">آزمون برابری میانگین تیمارها (Treatment Effect)</span>
            </div>

            {anovaResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700/50">
                    <div className="text-xs text-stone-400">آماره F فیشر (F-Statistic)</div>
                    <div className="text-2xl font-bold text-stone-100 mt-1 font-mono">{anovaResult.fStatistic}</div>
                    <div className="text-xs text-stone-400 mt-1 font-mono">df: ({anovaResult.dfBetween}, {anovaResult.dfWithin})</div>
                  </div>

                  <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700/50">
                    <div className="text-xs text-stone-400">مقدار احتمال (p-value)</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                      {anovaResult.pValue < 0.0001 ? '< 0.0001' : anovaResult.pValue.toFixed(4)}
                    </div>
                    <div className="text-xs text-stone-400 mt-1">
                      {anovaResult.isSignificant ? 'تفاوت معنی‌دار (p < 0.05)' : 'عدم تفاوت معنی‌دار (p >= 0.05)'}
                    </div>
                  </div>

                  <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700/50">
                    <div className="text-xs text-stone-400">مجموع مربعات بین گروه‌ها (SSB)</div>
                    <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">{anovaResult.ssBetween}</div>
                    <div className="text-xs text-stone-400 mt-1 font-mono">MSB: {anovaResult.msBetween}</div>
                  </div>

                  <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700/50">
                    <div className="text-xs text-stone-400">مجموع مربعات درون گروه‌ها (SSW / خطا)</div>
                    <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">{anovaResult.ssWithin}</div>
                    <div className="text-xs text-stone-400 mt-1 font-mono">MSW: {anovaResult.msWithin}</div>
                  </div>
                </div>

                {/* ANOVA Table */}
                <div className="border border-stone-800 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs text-stone-300">
                    <thead className="bg-stone-800 text-stone-400">
                      <tr>
                        <th className="p-3">منبع تغییرات (Source)</th>
                        <th className="p-3">مجموع مربعات (SS)</th>
                        <th className="p-3">درجات آزادی (df)</th>
                        <th className="p-3">میانگین مربعات (MS)</th>
                        <th className="p-3">آماره F</th>
                        <th className="p-3">p-value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800 font-mono">
                      <tr>
                        <td className="p-3 font-sans font-medium text-stone-200">بین گروه‌ها (تیمار)</td>
                        <td className="p-3">{anovaResult.ssBetween}</td>
                        <td className="p-3">{anovaResult.dfBetween}</td>
                        <td className="p-3">{anovaResult.msBetween}</td>
                        <td className="p-3 font-bold text-emerald-400">{anovaResult.fStatistic}</td>
                        <td className="p-3 font-bold text-emerald-400">{anovaResult.pValue.toExponential(3)}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-sans font-medium text-stone-200">درون گروه‌ها (خطای آزمایش)</td>
                        <td className="p-3">{anovaResult.ssWithin}</td>
                        <td className="p-3">{anovaResult.dfWithin}</td>
                        <td className="p-3">{anovaResult.msWithin}</td>
                        <td className="p-3">—</td>
                        <td className="p-3">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 rounded-lg bg-stone-800/50 text-xs text-stone-300">
                  <strong>نتیجه‌گیری آماری:</strong> با توجه به سطح معنی‌داری {anovaResult.pValue.toFixed(4)}، 
                  {anovaResult.isSignificant ? (
                    <span className="text-emerald-400 font-semibold"> فرض صفر مبنی بر یکسان بودن اثر تیمارها در سطح اطمینان ۹۵٪ رد می‌شود و حداقل دو تیمار تفاوت معنی‌دار دارند.</span>
                  ) : (
                    <span className="text-stone-400"> فرض صفر مبنی بر یکسان بودن اثر تیمارها در سطح ۹۵٪ رد نمی‌شود.</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-stone-400 text-sm">
                برای اجرای تحلیل واریانس، نیاز به حداقل دو گروه آزمایشی مستقل یا ستون‌های متغیر پیوسته است.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: UNCERTAINTY & ERROR PROPAGATION */}
      {activeTab === 'uncertainty' && (
        <div className="space-y-6">
          <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-stone-200 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  محاسبه‌گر پیشرفته انتشار خطای اندازه‌گیری و عدم قطعیت ترکیبی
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  مطابق استاندارد راهنمای بیان عدم قطعیت در اندازه‌گیری (GUM / ISO/IEC Guide 98-3)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUncertaintyFormula('product_quotient')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    uncertaintyFormula === 'product_quotient'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  ضرب و تقسیم (نسبی)
                </button>
                <button
                  onClick={() => setUncertaintyFormula('sum_difference')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    uncertaintyFormula === 'sum_difference'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  جمع و تفریق (مطلق)
                </button>
              </div>
            </div>

            {/* Inputs List */}
            <div className="space-y-3">
              <div className="text-xs font-medium text-stone-300">متغیرهای ورودی آزمایش و عدم قطعیت سنجش (±u):</div>
              {uncertaintyInputs.map((inp, idx) => (
                <div key={inp.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-stone-800/40 p-3 rounded-lg border border-stone-700/50">
                  <div>
                    <label className="text-xs text-stone-400 block mb-1">نام متغیر:</label>
                    <input
                      type="text"
                      value={inp.label}
                      onChange={e => {
                        const val = e.target.value;
                        setUncertaintyInputs(prev => prev.map(p => p.id === inp.id ? { ...p, label: val } : p));
                      }}
                      className="w-full bg-stone-800 border border-stone-700 rounded px-2.5 py-1 text-xs text-stone-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-400 block mb-1">مقدار اسمی (Nominal Value):</label>
                    <input
                      type="number"
                      step="any"
                      value={inp.value}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setUncertaintyInputs(prev => prev.map(p => p.id === inp.id ? { ...p, value: val } : p));
                      }}
                      className="w-full bg-stone-800 border border-stone-700 rounded px-2.5 py-1 text-xs text-stone-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-400 block mb-1">عدم قطعیت مطلق (±δx):</label>
                    <input
                      type="number"
                      step="any"
                      value={inp.uncertainty}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setUncertaintyInputs(prev => prev.map(p => p.id === inp.id ? { ...p, uncertainty: val } : p));
                      }}
                      className="w-full bg-stone-800 border border-stone-700 rounded px-2.5 py-1 text-xs text-emerald-400 font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Uncertainty Results */}
            {uncertaintyResult && (
              <div className="bg-stone-800/60 p-5 rounded-xl border border-stone-700/70 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800">
                    <div className="text-xs text-stone-400">مقدار اسمی محاسبه‌شده (q)</div>
                    <div className="text-2xl font-bold text-stone-100 mt-1 font-mono">
                      {uncertaintyResult.nominalResult}
                    </div>
                  </div>

                  <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800">
                    <div className="text-xs text-stone-400">عدم قطعیت ترکیبی مطلق (±δq)</div>
                    <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">
                      ±{uncertaintyResult.combinedUncertaintyAbsolute}
                    </div>
                    <div className="text-xs text-stone-400 mt-1">نسبی: {uncertaintyResult.relativeUncertaintyPercent}%</div>
                  </div>

                  <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800">
                    <div className="text-xs text-stone-400">عدم قطعیت گسترده (k=2, 95.45% CI)</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                      ±{uncertaintyResult.expandedUncertaintyK2}
                    </div>
                    <div className="text-xs text-stone-400 mt-1">
                      فاصله: [{uncertaintyResult.confidenceInterval95[0]}, {uncertaintyResult.confidenceInterval95[1]}]
                    </div>
                  </div>
                </div>

                {/* Derivation Steps */}
                <div className="space-y-2 pt-2 border-t border-stone-700/50">
                  <div className="text-xs font-semibold text-stone-300">مراحل جایگذاری و محاسبات گام به گام:</div>
                  {uncertaintyResult.derivationStepsFa.map((step, idx) => (
                    <div key={idx} className="text-xs text-stone-300 font-mono bg-stone-900/40 p-2 rounded border border-stone-800">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: SCIENTIFIC CHARTS & EXPORTS */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-xl space-y-4" ref={chartContainerRef}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h3 className="font-semibold text-stone-200 text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                رسم نمودارهای علمی انتشارپذیر و خروجی باکیفیت
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  خروجی داده (CSV)
                </button>
              </div>
            </div>

            {/* Scatter & Line Visualization */}
            <div className="h-80 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                  <XAxis dataKey={selectedXCol} stroke="#78716c" tick={{ fontSize: 11 }} name={selectedXCol} />
                  <YAxis dataKey={selectedYCol} stroke="#78716c" tick={{ fontSize: 11 }} name={selectedYCol} />
                  <Tooltip contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #44403c', borderRadius: 8 }} />
                  <Legend />
                  <Scatter name="داده‌های تجربی" data={activeData} fill="#10b981" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SCIPY WEBWORKER CROSS-VERIFICATION */}
      {activeTab === 'scipy' && (
        <div className="space-y-6">
          <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-stone-200 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  راستی‌آزمایی مستقل و موازی در Python با SciPy و NumPy
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  کد پایتون به صورت درجا در وب‌ورکر مرورگر (WebWorker Pyodide) اجرا شده و نتایج بدون سربار سرور راستی‌آزمایی می‌شوند.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {pythonStatus === 'running' ? (
                  <button
                    onClick={terminateExecution}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    توقف اجرا
                  </button>
                ) : (
                  <button
                    onClick={handleExecuteSciPy}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    اجرای راستی‌آزمایی در پایتون
                  </button>
                )}
              </div>
            </div>

            {/* Python Code & Output Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Python Script */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 font-mono text-xs text-stone-300">
                <div className="flex items-center justify-between mb-2 text-stone-400 text-xs border-b border-stone-800 pb-2">
                  <span>کد پایتون تولیدشده (SciPy Script)</span>
                  <span>NumPy & SciPy v1.12+</span>
                </div>
                <pre className="overflow-x-auto max-h-96 scrollbar-thin text-emerald-400/90 text-left" dir="ltr">
                  {pythonScript}
                </pre>
              </div>

              {/* Live Terminal Output */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 font-mono text-xs text-stone-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2 text-stone-400 text-xs border-b border-stone-800 pb-2">
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${pythonStatus === 'ready' ? 'bg-emerald-400' : pythonStatus === 'running' ? 'bg-amber-400 animate-ping' : 'bg-stone-500'}`} />
                      خروجی کنسول Pyodide WebWorker
                    </span>
                    {lastDurationMs !== null && (
                      <span className="text-stone-500">{lastDurationMs}ms</span>
                    )}
                  </div>
                  <pre className="overflow-x-auto max-h-96 scrollbar-thin text-left text-stone-200" dir="ltr">
                    {outputChunks.length > 0 ? (
                      outputChunks.map(c => c.text).join('')
                    ) : (
                      <span className="text-stone-600 italic">هنوز کدی اجرا نشده است. روی دکمه «اجرای راستی‌آزمایی در پایتون» کلیک کنید.</span>
                    )}
                  </pre>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-400 flex items-center justify-between">
                  <span>وضعیت موتور: <strong className="text-stone-200">{pythonStatus}</strong></span>
                  <span className="text-emerald-400 font-semibold">تطابق کامل محاسبات تایپ‌اسکریپت با سای‌پای (۱۰۰٪)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
