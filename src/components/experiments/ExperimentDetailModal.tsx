import React, { useState } from 'react';
import {
  FoodExperiment,
  EXPERIMENT_DOMAINS,
  VERIFICATION_STATUS_META,
  RELIABILITY_GRADES
} from '../../types/foodExperiment';
import {
  X,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  FlaskConical,
  BookOpen,
  Layers,
  Calculator,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  FileCheck2,
  Flame,
  Scale,
  ThermometerSun,
  Wind
} from 'lucide-react';

interface ExperimentDetailModalProps {
  experiment: FoodExperiment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (experiment: FoodExperiment) => void;
}

export const ExperimentDetailModal: React.FC<ExperimentDetailModalProps> = ({
  experiment,
  isOpen,
  onClose,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'procedure' | 'calc' | 'safety' | 'sources'>('overview');
  const [copied, setCopied] = useState(false);

  // Calculation tester state
  const [calcInputs, setCalcInputs] = useState<Record<string, number>>({});
  const [calcResult, setCalcResult] = useState<number | null>(null);

  if (!isOpen || !experiment) return null;

  const domainMeta = EXPERIMENT_DOMAINS[experiment.domain] || {
    titleFa: experiment.domain,
    titleEn: '',
    color: '#6b7280'
  };

  const statusMeta = VERIFICATION_STATUS_META[experiment.verificationStatus] || {
    labelFa: 'در دست بررسی',
    badgeColor: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
    descriptionFa: ''
  };

  const gradeMeta = RELIABILITY_GRADES[experiment.reliabilityGrade] || {
    labelFa: 'Grade D',
    color: '#9ca3af'
  };

  const isINSO = experiment.standardReference?.jurisdiction === 'iranian_national' ||
    experiment.standardReference?.organization === 'INSO';

  const handleCopyText = () => {
    const text = `
عنوان آزمایش: ${experiment.titleFa}
کد آزمایش: ${experiment.code}
حوزه: ${domainMeta.titleFa}
استاندارد مرجع: ${experiment.standardReference?.organization} ${experiment.standardReference?.standardNumber}
هدف: ${experiment.objective}
اصل روش: ${experiment.principle}
فرمول: ${experiment.calculations.formulaExpression}
واحد گزارش: ${experiment.reporting.unitOfMeasurement}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        id="experiment-detail-modal"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 bg-stone-50/50 dark:bg-stone-950/40">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: `${domainMeta.color}15`,
                color: domainMeta.color
              }}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              {domainMeta.titleFa}
            </span>

            <span className="font-mono text-xs font-bold text-stone-600 dark:text-stone-300 bg-stone-200/80 dark:bg-stone-800 px-2 py-0.5 rounded">
              {experiment.code}
            </span>

            {experiment.isVerifiedProtocol ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{gradeMeta.labelFa} (پروتکل تاییدشده)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>{statusMeta.labelFa}</span>
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyText}
              className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors text-xs flex items-center gap-1"
              title="کپی خلاصه مشخصات آزمایش"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              title="چاپ پروتکل استاندارد"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Experiment Title Banner */}
        <div className="px-6 py-4 bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800">
          <h2 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 mb-1 leading-snug">
            {experiment.titleFa}
          </h2>
          {experiment.titleEn && (
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium italic dir-ltr text-left">
              {experiment.titleEn}
            </p>
          )}

          {/* Standard banner line */}
          {experiment.standardReference && (
            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-stone-500 dark:text-stone-400 font-medium">استاندارد مرجع:</span>
              <span
                className={`font-mono px-2 py-0.5 rounded font-bold ${
                  isINSO
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900'
                    : 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-900'
                }`}
              >
                {experiment.standardReference.organization} {experiment.standardReference.standardNumber}
              </span>
              {experiment.standardReference.titleFa && (
                <span className="text-stone-600 dark:text-stone-300">({experiment.standardReference.titleFa})</span>
              )}
            </div>
          )}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-950/20 overflow-x-auto scrollbar-none flex items-center gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            شناسنامه و اصل روش
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'materials'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            تجهیزات، معرف‌ها و آماده‌سازی
          </button>

          <button
            onClick={() => setActiveTab('procedure')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'procedure'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            مراحل گام‌به‌گام ({experiment.procedureSteps?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('calc')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'calc'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            فرمول‌ها و گزارش‌دهی
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'safety'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            خطاها و نکات ایمنی
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'sources'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            مراجع و اعتبارسنجی
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in-50">
              {/* Objective */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-5 border border-stone-200 dark:border-stone-700">
                <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  هدف آزمایش
                </h4>
                <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  {experiment.objective}
                </p>
              </div>

              {/* Scope */}
              {experiment.scope && (
                <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-5 border border-stone-200 dark:border-stone-700">
                  <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    دامنه کاربرد
                  </h4>
                  <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                    {experiment.scope}
                  </p>
                </div>
              )}

              {/* Principle */}
              <div className="bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-900/50">
                <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  اصل روش علمی / شیمیایی
                </h4>
                <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-serif text-[15px]">
                  {experiment.principle}
                </p>
              </div>

              {/* Tags */}
              {experiment.tags && experiment.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-2">
                    برچسب‌های کلیدی:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {experiment.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MATERIALS & EQUIPMENT */}
          {activeTab === 'materials' && (
            <div className="space-y-6 animate-in fade-in-50">
              {/* Equipment Table */}
              <div>
                <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  تجهیزات، دستگاه‌ها و وسایل شیشه‌ای موردنیاز
                </h4>
                {experiment.equipment && experiment.equipment.length > 0 ? (
                  <div className="border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold border-b border-stone-200 dark:border-stone-700">
                        <tr>
                          <th className="p-3">نام دستگاه / وسیله</th>
                          <th className="p-3">مشخصات فنی و کالیبراسیون</th>
                          <th className="p-3 text-center">الزام استاندارد</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                        {experiment.equipment.map((eq, i) => (
                          <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                            <td className="p-3 font-semibold text-stone-800 dark:text-stone-100">
                              <div>{eq.name}</div>
                              {eq.nameEn && (
                                <div className="text-[10px] text-stone-400 font-mono italic">{eq.nameEn}</div>
                              )}
                            </td>
                            <td className="p-3 text-stone-600 dark:text-stone-300">
                              {eq.specification || 'مطابق الزامات عمومی آزمایشگاه صنایع غذایی'}
                            </td>
                            <td className="p-3 text-center">
                              {eq.isRequired ? (
                                <span className="text-[11px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded font-medium">
                                  اجباری
                                </span>
                              ) : (
                                <span className="text-[11px] px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-500 rounded">
                                  اختیاری
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400">وسیله خاصی درج نشده است.</p>
                )}
              </div>

              {/* Reagents Table */}
              <div>
                <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-emerald-600" />
                  مواد شیمیایی، معرف‌ها و شناساگرها
                </h4>
                {experiment.reagentsAndMaterials && experiment.reagentsAndMaterials.length > 0 ? (
                  <div className="border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold border-b border-stone-200 dark:border-stone-700">
                        <tr>
                          <th className="p-3">ماده / معرف</th>
                          <th className="p-3">درجه خلوص (Grade)</th>
                          <th className="p-3">کلاس خطر / شرایط نگهداری</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                        {experiment.reagentsAndMaterials.map((r, i) => (
                          <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                            <td className="p-3 font-semibold text-stone-800 dark:text-stone-100">
                              <div>{r.name}</div>
                              {r.nameEn && (
                                <div className="text-[10px] text-stone-400 font-mono italic">{r.nameEn}</div>
                              )}
                            </td>
                            <td className="p-3 text-stone-600 dark:text-stone-300 font-mono text-[11px]">
                              {r.grade || 'Analytical Reagent (AR)'}
                            </td>
                            <td className="p-3 text-stone-600 dark:text-stone-300">
                              {r.hazardClass && (
                                <span className="inline-block text-[10px] bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 px-1.5 py-0.5 rounded font-medium ml-1">
                                  {r.hazardClass}
                                </span>
                              )}
                              <span>{r.storageCondition || 'در دمای اتاق'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400">معرف شیمیایی برای این روش ثبت نشده است.</p>
                )}
              </div>

              {/* Sample Prep & Solutions Prep */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <h5 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                    آماده‌سازی نمونه (Sample Prep):
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {experiment.samplePreparation || 'نمونه‌برداری و یکنواخت‌سازی طبق استاندارد مرجع انجام شود.'}
                  </p>
                </div>

                <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <h5 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                    آماده‌سازی محلول‌ها و شاهد (Solutions Prep):
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {experiment.solutionsPreparation || 'محلول‌ها به صورت تازه و طبق ضوابط استاندارد تهیه گردند.'}
                  </p>
                </div>
              </div>

              {/* Environmental Conditions */}
              {experiment.environmentalConditions && (
                <div className="bg-sky-50/50 dark:bg-sky-950/20 p-4 rounded-2xl border border-sky-200 dark:border-sky-900 flex flex-wrap gap-4 text-xs">
                  {experiment.environmentalConditions.temperatureRange && (
                    <div className="flex items-center gap-1.5 text-sky-800 dark:text-sky-300">
                      <ThermometerSun className="w-4 h-4 text-sky-600" />
                      <span>{experiment.environmentalConditions.temperatureRange}</span>
                    </div>
                  )}
                  {experiment.environmentalConditions.ventilationRequirement && (
                    <div className="flex items-center gap-1.5 text-sky-800 dark:text-sky-300">
                      <Wind className="w-4 h-4 text-sky-600" />
                      <span>{experiment.environmentalConditions.ventilationRequirement}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROCEDURE STEPS */}
          {activeTab === 'procedure' && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  دستورالعمل گام‌به‌گام اجرای آزمون:
                </h4>
                <span className="text-xs text-stone-500 font-mono">
                  {experiment.procedureSteps?.length || 0} مرحله استاندارد
                </span>
              </div>

              {experiment.procedureSteps && experiment.procedureSteps.length > 0 ? (
                <div className="space-y-3">
                  {experiment.procedureSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
                            {step.title}
                          </h5>
                          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                            {step.description}
                          </p>

                          {/* Additional attributes */}
                          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px]">
                            {step.duration && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-medium">
                                <Clock className="w-3 h-3 text-stone-500" />
                                <span>مدت: {step.duration}</span>
                              </span>
                            )}
                            {step.temperature && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium">
                                <ThermometerSun className="w-3 h-3 text-amber-500" />
                                <span>دما: {step.temperature}</span>
                              </span>
                            )}
                          </div>

                          {/* Critical Caution */}
                          {step.criticalCaution && (
                            <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              <span className="font-medium">{step.criticalCaution}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400">مراحل برای این پروتکل ثبت نشده است.</p>
              )}
            </div>
          )}

          {/* TAB 4: CALCULATIONS & REPORTING */}
          {activeTab === 'calc' && (
            <div className="space-y-6 animate-in fade-in-50">
              {/* Formula Box */}
              <div className="bg-stone-900 text-white dark:bg-black rounded-2xl p-5 border border-stone-800 shadow-inner">
                <div className="text-xs text-emerald-400 font-bold mb-2">
                  {experiment.calculations?.formulaTitleFa || 'فرمول محاسباتی استاندارد:'}
                </div>
                <div className="font-mono text-base font-bold text-white tracking-wide bg-stone-800/80 p-3 rounded-xl dir-ltr text-center overflow-x-auto">
                  {experiment.calculations?.formulaExpression || 'Direct Measurement / Reading'}
                </div>
                {experiment.calculations?.guidanceText && (
                  <p className="text-xs text-stone-400 mt-3 leading-relaxed">
                    {experiment.calculations.guidanceText}
                  </p>
                )}
              </div>

              {/* Variables Table */}
              {experiment.calculations?.variables && experiment.calculations.variables.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    تعریف متغیرها و نمادهای فرمول:
                  </h4>
                  <div className="border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold border-b border-stone-200 dark:border-stone-700">
                        <tr>
                          <th className="p-3 text-center">نماد</th>
                          <th className="p-3">شرح متغیر</th>
                          <th className="p-3">واحد استاندارد (SI)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                        {experiment.calculations.variables.map((v, i) => (
                          <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                            <td className="p-3 text-center font-mono font-bold text-emerald-700 dark:text-emerald-400">
                              {v.symbol}
                            </td>
                            <td className="p-3 text-stone-800 dark:text-stone-200 font-medium">
                              {v.name}
                            </td>
                            <td className="p-3 text-stone-500 font-mono text-[11px]">
                              {v.unit || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reporting Details */}
              <div className="bg-stone-50 dark:bg-stone-800/60 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
                <h4 className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                  نحوه گزارش نتیجه و خطاهای استاندارد:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-stone-500 font-medium">واحد اندازه‌گیری: </span>
                    <span className="font-bold text-stone-800 dark:text-stone-100">
                      {experiment.reporting?.unitOfMeasurement || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium">تعداد ارقام اعشار مجاز: </span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-100">
                      {experiment.reporting?.decimalPrecision ?? 2}
                    </span>
                  </div>
                  {experiment.reporting?.repeatabilityLimit_r && (
                    <div className="col-span-full">
                      <span className="text-stone-500 font-medium">حد تکرارپذیری (Repeatability r): </span>
                      <span className="text-stone-700 dark:text-stone-300">
                        {experiment.reporting.repeatabilityLimit_r}
                      </span>
                    </div>
                  )}
                  {experiment.reporting?.reproducibilityLimit_R && (
                    <div className="col-span-full">
                      <span className="text-stone-500 font-medium">حد تجدیدپذیری (Reproducibility R): </span>
                      <span className="text-stone-700 dark:text-stone-300">
                        {experiment.reporting.reproducibilityLimit_R}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SAFETY & ERRORS */}
          {activeTab === 'safety' && (
            <div className="space-y-6 animate-in fade-in-50">
              {/* Safety Notes */}
              <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl p-5 border border-rose-200 dark:border-rose-900">
                <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600" />
                  هشدارهای ایمنی و حفاظت فردی (PPE)
                </h4>
                {experiment.safetyNotes && experiment.safetyNotes.length > 0 ? (
                  <ul className="space-y-2 text-xs text-stone-800 dark:text-stone-200">
                    {experiment.safetyNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{note}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-500">رعایت اصول ایمنی عمومی آزمایشگاه شیمی و میکروبیولوژی الزامی است.</p>
                )}
              </div>

              {/* Potential Errors */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-900">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  خطاهای احتمالی، عوامل تداخل‌کننده و انحرافات رایج
                </h4>
                {experiment.potentialErrors && experiment.potentialErrors.length > 0 ? (
                  <ul className="space-y-2 text-xs text-stone-800 dark:text-stone-200">
                    {experiment.potentialErrors.map((err, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{err}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-500">مورد بحرانی خاصی ثبت نشده است.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: STANDARDS & SOURCES */}
          {activeTab === 'sources' && (
            <div className="space-y-6 animate-in fade-in-50">
              {/* Primary Standard Box */}
              <div className="bg-stone-50 dark:bg-stone-800/60 p-5 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    مشخصات استاندارد اصلی
                  </h4>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                    {experiment.standardReference?.organization}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-stone-500">شماره و کد استاندارد: </span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 font-mono">
                      {experiment.standardReference?.standardNumber || 'نامشخص'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500">عنوان استاندارد: </span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      {experiment.standardReference?.titleFa || experiment.titleFa}
                    </span>
                  </div>
                  {experiment.standardReference?.publicationYear && (
                    <div>
                      <span className="text-stone-500">سال انتشار / تجدیدنظر: </span>
                      <span className="font-mono text-stone-700 dark:text-stone-300">
                        {experiment.standardReference.publicationYear}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-stone-500">حوزه صلاحیت: </span>
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      {isINSO ? 'استاندارد ملی جمهوری اسلامی ایران (اجباری/توصیه‌ای)' : 'استاندارد بین‌المللی خارجی'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Citations List */}
              <div>
                <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  استنادات علمی و منابع تایید اعتبار (Sources):
                </h4>
                {experiment.sources && experiment.sources.length > 0 ? (
                  <div className="space-y-2.5">
                    {experiment.sources.map((src, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-stone-900 dark:text-stone-100">
                            {src.citationShort}
                          </div>
                          <div className="text-stone-500 dark:text-stone-400 mt-0.5 text-[11px]">
                            {src.fullTitle}
                          </div>
                        </div>
                        <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {src.verificationGrade?.toUpperCase() || 'GRADE A'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400">استناد جداگانه‌ای درج نشده است.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 flex items-center justify-between">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>پروتکل مستند و بدون حدس و گمان</span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(experiment);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
              >
                ویرایش پروتکل
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
