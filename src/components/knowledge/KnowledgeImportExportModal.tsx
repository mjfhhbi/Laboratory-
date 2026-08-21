import React, { useState, useRef } from 'react';
import {
  exportKnowledgeBundle,
  importKnowledgeBundle
} from '../../lib/storage/knowledgeBase';
import {
  validateKnowledgeBundle,
  generateEmptyKnowledgeTemplate,
  ValidationReport
} from '../../lib/knowledge/schemaValidator';
import {
  X,
  Upload,
  Download,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HardDrive,
  FileCheck,
  RotateCcw
} from 'lucide-react';

interface KnowledgeImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCompleted: () => void;
}

export const KnowledgeImportExportModal: React.FC<KnowledgeImportExportModalProps> = ({
  isOpen,
  onClose,
  onImportCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'template'>('import');
  const [importJsonText, setImportJsonText] = useState('');
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
      handleValidateJson(content);
    };
    reader.readAsText(file);
  };

  const handleValidateJson = (text: string) => {
    setStatusMessage(null);
    try {
      const parsed = JSON.parse(text);
      const report = validateKnowledgeBundle(parsed);
      setValidationReport(report);
    } catch {
      setValidationReport({
        valid: false,
        totalRecords: 0,
        totalSources: 0,
        errors: ['فرمت فایل JSON نامعتبر است (Syntax Error).'],
        warnings: [],
        categoryBreakdown: {}
      });
    }
  };

  const handleExecuteImport = async () => {
    if (!importJsonText.trim()) return;
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const res = await importKnowledgeBundle(importJsonText);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `عملیات بارگذاری با موفقیت انجام شد: ${res.importedRecords} رکورد دانش و ${res.importedSources} منبع علمی وارد پایگاه داده محلی گردید.`
        });
        onImportCompleted();
      } else {
        setStatusMessage({
          type: 'error',
          text: `خطا در واردسازی: ${res.errors.join(' | ')}`
        });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'خطای غیرمنتظره در پردازش: ' + (err as Error).message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = () => {
    const templateContent = generateEmptyKnowledgeTemplate();
    const blob = new Blob([templateContent], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food_science_knowledge_template_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportDatabase = async () => {
    setIsProcessing(true);
    try {
      const json = await exportKnowledgeBundle();
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `food_science_knowledge_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'خطا در صدور داده‌ها: ' + (err as Error).message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                مدیریت ورود و خروج داده‌های پایگاه دانش (JSON)
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                بارگذاری بسته‌های مستند استانداردها، مقالات و پشتیبان‌گیری آفلاین
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900 px-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            ورود داده‌ها (Import)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            استخراج پشتیبان (Export)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('template')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'template'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            دریافت قالب خام (Template)
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-4 flex-1 text-xs">
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 text-rose-900 dark:text-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span className="font-semibold">{statusMessage.text}</span>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-500 bg-stone-50 dark:bg-stone-950/30 text-center cursor-pointer transition-all space-y-2"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-stone-800 dark:text-stone-200">
                  برای انتخاب فایل JSON کلیک کنید یا آن را اینجا بکشید
                </div>
                <div className="text-[11px] text-stone-400">
                  پشتیبانی از قالب رسمی KnowledgeBaseBundle حاوی استنادهای تاییدشده
                </div>
              </div>

              {/* Validation Report */}
              {validationReport && (
                <div
                  className={`p-4 rounded-2xl border ${
                    validationReport.valid
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5">
                      {validationReport.valid ? (
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                      )}
                      <span>گزارش اعتبارسنجی ساختار داده</span>
                    </span>
                    <span className="text-[11px] font-mono">
                      {validationReport.totalRecords} رکورد | {validationReport.totalSources} منبع مرجع
                    </span>
                  </div>

                  {validationReport.errors.length > 0 && (
                    <div className="space-y-1 mb-2">
                      <div className="text-[11px] font-bold text-rose-700 dark:text-rose-400">خطاهای ساختاری:</div>
                      <ul className="list-disc list-inside text-[11px] text-rose-600 dark:text-rose-300 space-y-0.5">
                        {validationReport.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validationReport.warnings.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">هشدارها:</div>
                      <ul className="list-disc list-inside text-[11px] text-amber-600 dark:text-amber-300 space-y-0.5">
                        {validationReport.warnings.map((warn, i) => (
                          <li key={i}>{warn}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Textarea for JSON pasting */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  یا محتوای JSON را مستقیماً اینجا جای‌گذاری کنید:
                </label>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={(e) => {
                    setImportJsonText(e.target.value);
                    if (e.target.value.trim()) {
                      handleValidateJson(e.target.value);
                    } else {
                      setValidationReport(null);
                    }
                  }}
                  placeholder='{"schemaVersion": "2.0.0", "sources": [...], "records": [...]}'
                  className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-[11px] focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  dir="ltr"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={!importJsonText.trim() || isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isProcessing ? 'در حال پردازش...' : 'تأیید و بارگذاری به پایگاه داده'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4 text-center py-4">
              <Download className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  استخراج کامل داده‌های پایگاه دانش
                </h4>
                <p className="text-stone-500 dark:text-stone-400 text-xs max-w-md mx-auto">
                  تمامی رکوردهای دسته‌بندی ده‌گانه، منابع علمی مرجع و تنظیمات در قالب یک فایل استاندارد JSON جهت پشتیبان‌گیری صادر می‌شود.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportDatabase}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{isProcessing ? 'در حال صدور...' : 'دانلود فایل پشتیبان (JSON)'}</span>
              </button>
            </div>
          )}

          {activeTab === 'template' && (
            <div className="space-y-4 text-center py-4">
              <FileCode className="w-12 h-12 text-blue-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  قالب استاندارد خام جهت تدوین و ورود داده‌های علمی
                </h4>
                <p className="text-stone-500 dark:text-stone-400 text-xs max-w-md mx-auto">
                  این قالب فاقد هرگونه مقدار ساختگی است و ساختار دقیق فیلدها، دسته‌بندی‌های ۱۰ گانه و شیوه ارجاع به منبع را در اختیار شما قرار می‌دهد تا داده‌های معتبر را آماده کنید.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>دانلود فایل قالب خالی (JSON Template)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
