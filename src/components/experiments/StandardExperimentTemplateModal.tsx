import React, { useState } from 'react';
import {
  StandardExperimentTemplate,
  FoodExperiment
} from '../../types/foodExperiment';
import {
  STANDARD_EXPERIMENT_26_FIELDS,
  normalizeToStandardExperiment,
  auditExperimentTemplate,
  exportExperimentTemplateToJson
} from '../../lib/experiments/standardExperimentTemplate';
import {
  X,
  Copy,
  Check,
  Download,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Layers,
  FileCode,
  CheckCircle2,
  HelpCircle,
  Database,
  ExternalLink
} from 'lucide-react';

interface StandardExperimentTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiment: FoodExperiment | StandardExperimentTemplate;
}

export const StandardExperimentTemplateModal: React.FC<StandardExperimentTemplateModalProps> = ({
  isOpen,
  onClose,
  experiment
}) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'json' | 'scalability'>('fields');
  const [copiedJson, setCopiedJson] = useState(false);
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  if (!isOpen) return null;

  const standardExp = normalizeToStandardExperiment(experiment);
  const auditReport = auditExperimentTemplate(standardExp);
  const jsonString = exportExperimentTemplateToJson(standardExp);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${standardExp.id || 'experiment'}-standard-template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredFields = STANDARD_EXPERIMENT_26_FIELDS.filter((f) => {
    if (selectedFieldFilter === 'all') return true;
    const isVer = auditReport.verifiedFields.includes(f.key);
    if (selectedFieldFilter === 'verified') return isVer;
    return !isVer;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/80 backdrop-blur-xs overflow-y-auto" dir="rtl">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 bg-stone-50/70 dark:bg-stone-850/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                  قالب استاندارد و کامل آزمایشگاه (Standard 26-Field Template)
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {auditReport.populatedFieldsCount}/26 فیلد
                </span>
              </div>
              <p className="text-xs text-stone-500 line-clamp-1">
                {standardExp.title} ({standardExp.id})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Golden Rule Guarantee Banner */}
        <div className="px-5 py-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>قانون طلایی اعتبارسنجی:</strong> هیچ فیلدی با داده‌های جعلی یا تخمینی پر نمی‌شود. فیلدهای فاقد سند معتبر به عنوان <strong>Unverified</strong> یا خالی نگهداری می‌شوند.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                standardExp.verificationStatus === 'VERIFIED'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : standardExp.verificationStatus === 'SUPPORTED'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
              }`}
            >
              سطح اعتبار کل: {standardExp.verificationStatus}
            </span>
            <span className="text-[11px] text-stone-500 font-mono">
              تکمیل استاندارد: {auditReport.completenessPercentage}٪
            </span>
          </div>
        </div>

        {/* Tab Switcher & Actions */}
        <div className="px-5 pt-3 pb-2 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('fields')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'fields'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              ساختار ۲۶ گانه فیلدها
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>قالب داده JSON Schema</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scalability')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'scalability'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              قابلیت افزودن هزاران آزمایش
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyJson}
              className="min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1.5"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'کپی شد' : 'کپی JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود فایل JSON</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: 26 FIELDS TABLE VIEW */}
          {activeTab === 'fields' && (
            <div className="space-y-3">
              {/* Filter controls */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-stone-500">
                  فهرست کلیه ۲۶ فیلد استاندارد روش‌های آزمایشگاهی (SOP Universal Schema):
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedFieldFilter('all')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium ${
                      selectedFieldFilter === 'all'
                        ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    همه (۲۶)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFieldFilter('verified')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium ${
                      selectedFieldFilter === 'verified'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    مستند / Verified ({auditReport.verifiedFields.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFieldFilter('unverified')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium ${
                      selectedFieldFilter === 'unverified'
                        ? 'bg-amber-700 text-white'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    نیازمند استناد / Unverified ({auditReport.unverifiedFields.length})
                  </button>
                </div>
              </div>

              {/* Fields List */}
              <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
                {filteredFields.map((field, idx) => {
                  const val = (standardExp as any)[field.key];
                  const isVerified = auditReport.verifiedFields.includes(field.key);
                  const isPopulated = Boolean(val && (typeof val !== 'object' || Object.keys(val).length > 0));

                  return (
                    <div
                      key={field.key}
                      className="p-3.5 hover:bg-stone-50/80 dark:hover:bg-stone-850/50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs"
                    >
                      <div className="md:w-1/3 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-stone-400">
                            {idx + 1}. {field.key}
                          </span>
                          {field.isRequired && (
                            <span className="text-[10px] text-rose-500 font-bold">*الزامی</span>
                          )}
                        </div>
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                          {field.labelFa}
                        </h4>
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                          {field.descriptionFa}
                        </p>
                      </div>

                      <div className="md:w-7/12 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-stone-400 font-mono">
                            {field.labelEn}
                          </span>
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Verified (دارای منبع معتبر)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                              <HelpCircle className="w-3 h-3 text-amber-600" />
                              <span>Unverified / نیازمند استعلام</span>
                            </span>
                          )}
                        </div>

                        {/* Render value */}
                        <div className="bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-200/70 dark:border-stone-700/60 text-stone-800 dark:text-stone-200">
                          {isPopulated ? (
                            typeof val === 'string' ? (
                              <p className="leading-relaxed line-clamp-3 font-sans">{val}</p>
                            ) : Array.isArray(val) ? (
                              <div className="space-y-1">
                                <span className="font-mono text-[10px] text-stone-500 block">
                                  آرایه ({val.length} آیتم):
                                </span>
                                <ul className="list-disc list-inside space-y-0.5 font-sans">
                                  {val.slice(0, 3).map((item: any, i: number) => (
                                    <li key={i} className="truncate">
                                      {typeof item === 'string'
                                        ? item
                                        : item.title || item.name || item.standardNumber || item.problem || JSON.stringify(item)}
                                    </li>
                                  ))}
                                  {val.length > 3 && (
                                    <li className="text-[10px] text-stone-400">
                                      و {val.length - 3} مورد دیگر...
                                    </li>
                                  )}
                                </ul>
                              </div>
                            ) : (
                              <pre className="font-mono text-[11px] overflow-x-auto whitespace-pre-wrap max-h-24">
                                {JSON.stringify(val, null, 2)}
                              </pre>
                            )
                          ) : (
                            <span className="text-stone-400 italic text-[11px]">
                              خالی / فاقد داده در منبع مرجع (Unverified)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: RAW JSON SCHEMA */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>نمایش ساختار کامل ۲۶ فیلد در قالب استاندارد JSON:</span>
                <span className="font-mono text-[11px]">اندازه: {new Blob([jsonString]).size} bytes</span>
              </div>

              <div className="relative">
                <pre
                  dir="ltr"
                  className="bg-stone-900 text-stone-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-[500px] border border-stone-800 leading-relaxed"
                >
                  {jsonString}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: SCALABILITY & MASS INTEGRATION */}
          {activeTab === 'scalability' && (
            <div className="space-y-4 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>معماری مقیاس‌پذیر برای هزاران پروتکل آزمایشگاهی (Zero Schema Change)</span>
                </h3>
                <p>
                  این ساختار ۲۶ فیلدی به‌گونه‌ای طراحی شده که پایگاه داده آزمایشگاهی می‌تواند بدون نیاز به هیچ‌گونه تغییر در Schema، هزاران آزمون جدید از سازمان‌های استاندارد ملی ایران (INSO)، ایزو (ISO)، AOAC، کدکس، FDA، USP و IDF را دریافت و در دیتابیس IndexedDB و Storage محلی بارگذاری کند.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تضمین عدم تناقض و جعل داده (Anti-Hallucination)</span>
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 text-[11px]">
                    اگر پروتکلی فیلدهای مشخصی مانند حدود پذیرش یا راهنمای عیب‌یابی را در منبع مکتوب رسمی نداشته باشد، هوش مصنوعی مجاز به ساختگی کردن آن نیست؛ فیلد خالی می‌ماند یا برچسب Unverified به آن الصاق می‌شود تا اعتبار حقوقی نتایج آزمایشگاه مخدوش نگردد.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>پشتیبانی کامل از فرمول‌های KaTeX و محاسبات زنده</span>
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 text-[11px]">
                    فیلد <code>calculations</code> با اتصال به موتور محاسباتی مرکزی، امکان کپی فرمول LaTeX، جایگذاری متغیرها و محاسبه زنده را بدون نیاز به تعریف مجدد توابع فراهم می‌آورد.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50/70 dark:bg-stone-850/60 text-xs">
          <div className="text-stone-500 font-mono text-[11px]">
            Template Version: {standardExp.version} | Last Verified: {standardExp.lastVerified}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[38px] px-4 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-900 text-white dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-white transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
