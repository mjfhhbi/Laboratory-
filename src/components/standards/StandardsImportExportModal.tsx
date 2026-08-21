import React, { useState, useRef } from 'react';
import {
  exportFoodStandardsBundle,
  importFoodStandardsBundle
} from '../../lib/storage/standardsStorage';
import {
  StandardJurisdiction,
  FoodStandard,
  FoodStandardsBundle
} from '../../types/foodStandard';
import {
  X,
  Upload,
  Download,
  FileCode,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileText,
  Copy,
  Check
} from 'lucide-react';

interface StandardsImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCompleted: () => void;
}

export const StandardsImportExportModal: React.FC<StandardsImportExportModalProps> = ({
  isOpen,
  onClose,
  onImportCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'template'>('export');
  const [jurisdictionExport, setJurisdictionExport] = useState<StandardJurisdiction | 'all'>('all');
  const [importStatus, setImportStatus] = useState<{
    success?: boolean;
    importedStandards?: number;
    importedSources?: number;
    errors?: string[];
  } | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Export
  const handleDownloadExport = async () => {
    try {
      const jsonStr = await exportFoodStandardsBundle(jurisdictionExport);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `food_standards_bundle_${jurisdictionExport}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export standards:', err);
    }
  };

  // Handle File Import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const result = await importFoodStandardsBundle(text);
        setImportStatus(result);
        if (result.success) {
          onImportCompleted();
        }
      };
      reader.readAsText(file);
    } catch (err: any) {
      setImportStatus({
        success: false,
        errors: [err.message || 'خطا در بارگذاری فایل']
      });
    }
  };

  // Raw Standard JSON Template Structure (Zero Fake Data)
  const emptyStandardTemplate = {
    bundleVersion: '1.0',
    exportedAt: new Date().toISOString(),
    application: 'Food Science AI',
    schemaVersion: '2.0.0',
    description: 'Food Industry Standards Template Bundle',
    sources: [
      {
        id: 'src_inso_sample_id',
        title: 'نام رسمی استاندارد یا مقاله مرجع',
        englishTitle: 'Standard or Paper English Title',
        authors: ['نام نویسندگان یا کمیته تدوین'],
        publicationType: 'official_standard_body',
        organizationOrPublisher: 'سازمان ملی استاندارد ایران (INSO)',
        yearOrEdition: '۱۳۹۸',
        codeOrIdentifier: 'INSO 0000',
        reliabilityGrade: 'A_official_standard',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    standards: [
      {
        id: 'std_template_01',
        jurisdiction: 'iranian_national',
        country: 'ایران',
        issuingOrganization: 'سازمان ملی استاندارد ایران (INSO)',
        standardNumber: 'INSO 0000',
        titleFa: 'عنوان استاندارد به فارسی',
        titleEn: 'Standard Title in English',
        revisionAndYear: 'تجدیدنظر اول - ۱۳۹۸',
        lifecycleStatus: 'active',
        sector: 'dairy',
        scopeOfApplication: 'شرح هدف و دامنه کاربرد استاندارد...',
        testMethod: 'شرح روش آزمون مرجع...',
        requiredEquipment: ['دستگاه ۱', 'دستگاه ۲'],
        reagentsAndChemicals: ['محلول یا معرف ۱', 'معرف ۲'],
        testConditions: 'دما، رطوبت و شرایط آزمون...',
        testProcedure: 'مراحل گام‌به‌گام آزمون...',
        calculationsAndFormulas: '$$\\text{Value} = \\frac{A \\times B}{C}$$',
        acceptableLimits: [
          {
            id: 'lim_01',
            parameterNameFa: 'نام ویژگی فیزیکوشیمیایی یا میکروبی',
            parameterNameEn: 'Parameter English Name',
            limitSpecification: 'حداقل ۳.۲',
            unit: 'درصد وزنی',
            tolerance: '±۰.۱',
            testMethodRef: 'بند ۶.۱'
          }
        ],
        errorsAndSafetyWarnings: 'هشدارهای ایمنی و عوامل مداخله‌گر...',
        verificationStatus: 'official_regulatory',
        sources: [
          {
            sourceId: 'src_inso_sample_id',
            sourceTitle: 'نام رسمی استاندارد مرجع',
            sectionOrChapter: 'بند ۴',
            pageNumber: '۱۲'
          }
        ],
        tags: ['لبنیات', 'استاندارد_ملی'],
        offlineAvailable: true
      }
    ]
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(JSON.stringify(emptyStandardTemplate, null, 2));
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleDownloadTemplateFile = () => {
    const jsonStr = JSON.stringify(emptyStandardTemplate, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'food_standards_template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50/70 dark:bg-stone-800/30">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              ورود و صدور داده‌های استانداردهای صنایع غذایی (JSON)
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-3 border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-800/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('export');
              setImportStatus(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'export'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            دریافت خروجی (Export JSON)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('import');
              setImportStatus(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'import'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            بارگذاری فایل استاندارد (Import JSON)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('template');
              setImportStatus(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'template'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            قالب خام ساختار استاندارد (Schema Template)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4">
          {/* TAB 1: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4 text-xs">
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                صدور تمام یا بخشی از استانداردهای ثبت‌شده همراه با جداول مشخصات فیزیکوشیمیایی، مراجع علمی و تنظیمات در قالب یک فایل استاندارد JSON:
              </p>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1.5">
                  محدوده استانداردهای خروجی:
                </label>
                <select
                  value={jurisdictionExport}
                  onChange={(e) => setJurisdictionExport(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium"
                >
                  <option value="all">همه استانداردها (ایران و بین‌المللی)</option>
                  <option value="iranian_national">فقط استانداردهای ملی ایران (INSO)</option>
                  <option value="international_foreign">فقط استانداردهای بین‌المللی و خارجی (Codex / ISO / FDA)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownloadExport}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold inline-flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>دانلود فایل پشتیبان استانداردها (JSON)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-4 text-xs">
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                فایل داده‌های استانداردهای صنایع غذایی خود را بارگذاری کنید. سیستم به صورت خودکار اعتبار داده‌ها، اجباری بودن شماره استاندارد برای ایران و اعتبارسنجی ارجاعات علمی را بررسی و در پایگاه محلی ذخیره می‌کند.
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-500 rounded-3xl p-8 text-center cursor-pointer transition-colors bg-stone-50/50 dark:bg-stone-800/30 space-y-2"
              >
                <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                <div className="font-bold text-stone-800 dark:text-stone-200">
                  برای انتخاب فایل JSON کلیک کنید یا فایل را به اینجا بکشید
                </div>
                <div className="text-[11px] text-stone-400">
                  فرمت‌های مجاز: فایل‌های .json منطبق بر FoodStandardsBundle
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Import status message */}
              {importStatus && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                    importStatus.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {importStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                    <span>{importStatus.success ? 'بارگذاری با موفقیت انجام شد' : 'خطا در بارگذاری داده‌ها'}</span>
                  </div>

                  {importStatus.importedStandards !== undefined && (
                    <div className="text-[11px]">
                      تعداد استانداردهای ثبت‌شده: {importStatus.importedStandards} | تعداد منابع مرجع: {importStatus.importedSources || 0}
                    </div>
                  )}

                  {importStatus.errors && importStatus.errors.length > 0 && (
                    <ul className="list-disc list-inside text-[11px] space-y-0.5 pt-1">
                      {importStatus.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SCHEMA TEMPLATE */}
          {activeTab === 'template' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <p className="text-stone-600 dark:text-stone-300">
                  الگوی ساختار JSON برای آماده‌سازی و وارد کردن داده‌های استانداردهای واقعی:
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg font-bold inline-flex items-center gap-1"
                  >
                    {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>کپی الگو</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTemplateFile}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold inline-flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>دانلود فایل الگو</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-2xl bg-stone-900 text-stone-200 font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed" dir="ltr">
                {JSON.stringify(emptyStandardTemplate, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-900 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
