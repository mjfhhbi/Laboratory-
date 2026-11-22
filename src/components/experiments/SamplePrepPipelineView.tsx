/**
 * Food Science AI - Sample Preparation Pipeline View
 * 
 * Implements the 5-stage sequential architecture:
 * Sample ↓ Sampling ↓ Preparation ↓ Conditioning ↓ Analysis
 * 
 * Strict boundary enforcement: Sample Preparation is completely separated from the analytical procedure.
 * Supports multiple preparation methods per experiment with independent sources and matrix badges.
 */

import React, { useState, useMemo } from 'react';
import {
  Package,
  Boxes,
  Scissors,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Layers,
  FlaskConical,
  Scale,
  Sparkles,
  ShieldAlert,
  Clock,
  Droplet,
  Filter,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import {
  SamplePrepMethod,
  SamplePrepStageId,
  SAMPLE_PREP_STAGES
} from '../../types/samplePreparation';

interface SamplePrepPipelineViewProps {
  methods?: SamplePrepMethod[];
  fallbackPreparationText?: string;
  experimentTitleFa?: string;
  experimentDomain?: string;
  defaultStandardNumber?: string;
}

export const SamplePrepPipelineView: React.FC<SamplePrepPipelineViewProps> = ({
  methods,
  fallbackPreparationText,
  experimentTitleFa,
  experimentDomain,
  defaultStandardNumber = 'INSO'
}) => {
  // Build fallback method if no structured methods are provided
  const resolvedMethods: SamplePrepMethod[] = useMemo(() => {
    if (methods && methods.length > 0) {
      return methods;
    }

    const text = fallbackPreparationText || 'نمونه‌برداری و یکنواخت‌سازی طبق استاندارد مرجع انجام شود.';

    return [
      {
        id: 'method-default',
        methodTitleFa: 'روش استاندارد آماده‌سازی نمونه (عمومی)',
        methodTitleEn: 'Standard General Sample Preparation Protocol',
        applicableMatrices: ['کلیه ماتریس‌های مشمول استاندارد'],
        isDefault: true,
        source: {
          organization: 'INSO',
          standardNumber: defaultStandardNumber,
          clauseOrSection: 'بند آماده‌سازی آزمایه (Sample Preparation Clause)',
          verificationStatus: 'VERIFIED'
        },
        sample: {
          sampleType: 'ماتریس غذایی یکنواخت‌شده',
          sampleAmount: 'طبق دستورالعمل آزمون (معمولاً ۵ الی ۱۰ گرم یا میلی‌لیتر)',
          tolerance: '± ۰.۰۰۱ گرم با ترازوی آنالیتیکال',
          matrixNotes: 'نمونه باید در دمای محیط (۲۰ الی ۲۵ درجه سلسیوس) به تعادل برسد.'
        },
        sampling: {
          samplingMethod: 'نمونه‌برداری تصادفی بر اساس طرح نمونه‌برداری بهر استاندارد',
          samplingStandardRef: 'استاندارد ملی نمونه‌برداری فرآورده‌های غذایی',
          containers: ['ظروف شیشه‌ای دهان‌گشاد کهربایی یا پلی‌اتیلن استریل هوابند'],
          samplingPrecautions: 'جلوگیری از هرگونه تماس با رطوبت محیطی یا آلودگی خارجی'
        },
        preparation: {
          preliminaryPrep: text,
          homogenization: 'آسیاب آزمایشگاهی برای جامدات / همزن مکانیکی برای مایعات تا حصول یکنواختی کامل',
          dilution: {
            required: false,
            diluent: 'آب مقطر دیونیزه بدون CO2'
          },
          filtration: {
            required: false,
            filterType: 'کاغذ صافی بدون خاکستر واتمن در صورت وجود رسوب'
          },
          extraction: {
            required: false
          }
        },
        conditioning: {
          storageConditions: 'در محیط خشک، دور از تابش مستقیم خورشید یا داخل دسیکاتور',
          storageTime: 'آزمون بلافاصله پس از آماده‌سازی و حداکثر تا ۲ ساعت انجام پذیرد',
          temperature: '۲۰ الی ۲۵ درجه سلسیوس (دمای آزمایشگاه)',
          protectionFromLight: true
        },
        analysis: {
          handoverToProcedureNotes: 'پس از تایید یکنواختی و ثبت جرم/حجم اولیه، آزمایه مستقیماً به گام ۱ روش آزمون (Procedure) منتقل می‌شود.',
          readinessVerificationCriteria: [
            'یکنواختی کامل بافت و عدم وجود ذرات درشت غیرهمگن',
            'رسیدن نمونه به دمای استاندارد آزمون',
            'توزین دقیق آزمایه روی ترازوی کالیبره ۴ رقمی'
          ],
          preservationLimitAfterPrep: 'حداکثر ۲ ساعت در ظرف در بسته'
        },
        warnings: [
          'از اعمال حرارت شدید هنگام آسیاب یا همگن‌سازی که باعث تبخیر رطوبت یا اکسیداسیون چربی شود اکیداً خودداری گردد.',
          'در صورت دو فاز شدن نمونه، اختلاط مجدد پیش از برداشت الزامی است.'
        ]
      }
    ];
  }, [methods, fallbackPreparationText, defaultStandardNumber]);

  const [activeMethodIndex, setActiveMethodIndex] = useState<number>(0);
  const [activeStageTab, setActiveStageTab] = useState<SamplePrepStageId>('sample');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sample: true,
    sampling: true,
    preparation: true,
    conditioning: true,
    analysis: true
  });

  const currentMethod = resolvedMethods[activeMethodIndex] || resolvedMethods[0];

  const toggleSection = (stageId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Boundary Callout - Sample Prep vs SOP Procedure Separation */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/20 dark:border-amber-700/40 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <strong className="block font-bold text-amber-900 dark:text-amber-200">
            تفکیک مرز فرآیند (Process Boundary Enforcement):
          </strong>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
            این بخش منحصراً به آماده‌سازی، یکنواخت‌سازی و پایدارسازی نمونه آزمایه اختصاص دارد. مراحل اجرایی آزمون اصلی (SOP Procedure Steps) به‌صورت کاملاً مجزا و محافظت‌شده در بخش ۸ قرار دارد و متغیرهای تحلیلی با این مرحله مخلوط نمی‌شوند.
          </p>
        </div>
      </div>

      {/* Multiple Methods Tab Switcher */}
      {resolvedMethods.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>روش‌های آماده‌سازی تعریف‌شده برای این آزمایش ({resolvedMethods.length} روش مجزا):</span>
            </span>
            <span className="text-[11px] text-stone-500">
              هر روش دارای منبع و استانداردهای اعتبارسنجی مستقل است
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {resolvedMethods.map((m, idx) => {
              const isSelected = idx === activeMethodIndex;
              return (
                <button
                  key={m.id || idx}
                  type="button"
                  onClick={() => setActiveMethodIndex(idx)}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 min-h-[64px] ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-emerald-300 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                      {m.methodTitleFa}
                    </span>
                    {isSelected && (
                      <span className="shrink-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                        انتخاب‌شده
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-stone-500">
                    <span className="font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                      {m.source.organization} {m.source.standardNumber}
                    </span>
                    {m.source.clauseOrSection && (
                      <span className="line-clamp-1">{m.source.clauseOrSection}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Method Detail Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Method Title & Independent Source Banner */}
        <div className="p-4 sm:p-5 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {currentMethod.methodTitleFa}
              </span>
              {currentMethod.methodTitleEn && (
                <span className="text-[11px] font-mono text-stone-500">
                  {currentMethod.methodTitleEn}
                </span>
              )}
            </div>

            {/* Applicable Matrices */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 pt-1">
              <span className="font-medium text-stone-500 text-[11px]">ماتریس‌های کاربردی:</span>
              {currentMethod.applicableMatrices.map((mat, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[11px] font-medium text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Independent Source Badge */}
          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5 shrink-0 sm:max-w-xs shadow-2xs">
            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                <span>منبع مستقل روش:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {currentMethod.source.organization} {currentMethod.source.standardNumber}
                </span>
              </div>
              <div className="text-[11px] text-stone-500">
                {currentMethod.source.clauseOrSection}
              </div>
              <div className="pt-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>استاندارد مصوب ({currentMethod.source.verificationStatus})</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual 5-Stage Stepper Pipeline Header */}
        <div className="p-4 bg-stone-100/60 dark:bg-stone-850/60 border-b border-stone-200 dark:border-stone-800">
          <div className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>جریان گام‌به‌گام آماده‌سازی نمونه (۵ مرحله متوالی):</span>
            </span>
            <span className="text-[11px] font-mono text-stone-400">
              Sample → Sampling → Preparation → Conditioning → Analysis
            </span>
          </div>

          {/* 5-Step Linear Sequence Indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(SAMPLE_PREP_STAGES) as SamplePrepStageId[]).map((stageKey, idx) => {
              const meta = SAMPLE_PREP_STAGES[stageKey];
              const isActive = activeStageTab === stageKey;
              return (
                <button
                  key={stageKey}
                  type="button"
                  onClick={() => {
                    setActiveStageTab(stageKey);
                    // scroll into that section
                    const el = document.getElementById(`prep-stage-${stageKey}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }}
                  className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 min-h-[50px] ${
                    isActive
                      ? 'bg-white dark:bg-stone-800 border-emerald-500 shadow-2xs ring-2 ring-emerald-500/20'
                      : 'bg-stone-50/70 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 font-mono"
                      style={{ backgroundColor: meta.color }}
                    >
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="text-[11px] font-bold text-stone-900 dark:text-stone-100 truncate">
                        {meta.titleFa.split(' ')[0]}
                      </div>
                      <div className="text-[9px] text-stone-400 font-mono uppercase truncate">
                        {meta.titleEn.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                  {idx < 4 && (
                    <span className="text-stone-300 dark:text-stone-600 text-xs hidden sm:inline">
                      ←
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body: All 5 Stages Detailed Cards */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* STAGE 1: SAMPLE (نوع و مقدار نمونه) */}
          <div
            id="prep-stage-sample"
            className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/30 dark:bg-sky-950/10 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleSection('sample')}
              className="w-full p-4 flex items-center justify-between text-right bg-sky-50/60 dark:bg-sky-950/30 hover:bg-sky-100/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>۱. نوع و مقدار نمونه (Sample Matrix & Amount)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                      مرحله ۱ از ۵
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    تعیین دقیق ماتریس، حالت فیزیکی، مقدار آزمایه و رواداری توزین
                  </p>
                </div>
              </div>
              {expandedSections.sample ? (
                <ChevronUp className="w-4 h-4 text-stone-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {expandedSections.sample && (
              <div className="p-4 sm:p-5 border-t border-sky-100 dark:border-sky-900/40 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-[11px] text-stone-500 font-semibold block">نوع نمونه (Sample Type):</span>
                    <div className="font-bold text-stone-900 dark:text-stone-100">
                      {currentMethod.sample.sampleType}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-[11px] text-stone-500 font-semibold block flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-indigo-500" />
                      <span>مقدار نمونه (Sample Amount):</span>
                    </span>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {currentMethod.sample.sampleAmount}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-[11px] text-stone-500 font-semibold block">رواداری توزین (Tolerance):</span>
                    <div className="font-bold text-stone-800 dark:text-stone-200 font-mono">
                      {currentMethod.sample.tolerance || '± ۰.۰۰۱ گرم'}
                    </div>
                  </div>
                </div>

                {currentMethod.sample.matrixNotes && (
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                    <strong className="text-stone-900 dark:text-stone-100 block mb-0.5 font-bold">
                      راهنمای ماتریس:
                    </strong>
                    <p className="leading-relaxed">{currentMethod.sample.matrixNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STAGE 2: SAMPLING (نحوه نمونه‌برداری و ظروف) */}
          <div
            id="prep-stage-sampling"
            className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/30 dark:bg-teal-950/10 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleSection('sampling')}
              className="w-full p-4 flex items-center justify-between text-right bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-100/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>۲. نحوه نمونه‌برداری و ظروف (Sampling & Containers)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                      مرحله ۲ از ۵
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    پروتکل نمونه‌برداری نماینده، استاندارد مرجع و ظروف مجاز
                  </p>
                </div>
              </div>
              {expandedSections.sampling ? (
                <ChevronUp className="w-4 h-4 text-stone-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {expandedSections.sampling && (
              <div className="p-4 sm:p-5 border-t border-teal-100 dark:border-teal-900/40 space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Sampling Method */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <span className="text-[11px] text-stone-500 font-semibold block">
                      روش نمونه‌برداری (Sampling Protocol):
                    </span>
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                      {currentMethod.sampling.samplingMethod}
                    </p>
                    {currentMethod.sampling.samplingStandardRef && (
                      <div className="text-[11px] text-teal-700 dark:text-teal-400 font-mono pt-1">
                        مرجع استاندارد: {currentMethod.sampling.samplingStandardRef}
                      </div>
                    )}
                  </div>

                  {/* Containers List */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <span className="text-[11px] text-stone-500 font-semibold block">
                      ظروف نمونه‌برداری و آزمایش (Containers):
                    </span>
                    <div className="space-y-1">
                      {currentMethod.sampling.containers.map((cont, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-stone-50 dark:bg-stone-850 text-stone-800 dark:text-stone-200"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                          <span>{cont}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {currentMethod.sampling.samplingPrecautions && (
                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs">
                    <span className="font-bold block mb-0.5">هشدار حین نمونه‌برداری:</span>
                    <span>{currentMethod.sampling.samplingPrecautions}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STAGE 3: PREPARATION (عملیات آماده‌سازی، همگن‌سازی، رقیق‌سازی، فیلتراسیون، استخراج) */}
          <div
            id="prep-stage-preparation"
            className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/10 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleSection('preparation')}
              className="w-full p-4 flex items-center justify-between text-right bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>۳. عملیات آماده‌سازی فیزیکی و شیمیایی (Preparation Steps)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                      مرحله ۳ از ۵
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    آماده‌سازی اولیه، همگن‌سازی، رقیق‌سازی، فیلتراسیون و استخراج
                  </p>
                </div>
              </div>
              {expandedSections.preparation ? (
                <ChevronUp className="w-4 h-4 text-stone-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {expandedSections.preparation && (
              <div className="p-4 sm:p-5 border-t border-amber-100 dark:border-amber-900/40 space-y-4 text-xs">
                {/* 3.1 Preliminary Preparation */}
                {currentMethod.preparation.preliminaryPrep && (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-[11px] text-stone-500 font-semibold block">
                      آماده‌سازی اولیه (Preliminary Preparation):
                    </span>
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                      {currentMethod.preparation.preliminaryPrep}
                    </p>
                  </div>
                )}

                {/* 3.2 Homogenization */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5" />
                      <span>همگن‌سازی و یکنواخت‌سازی (Homogenization):</span>
                    </span>
                    {currentMethod.preparation.sieveMeshSize && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        مش الک: {currentMethod.preparation.sieveMeshSize}
                      </span>
                    )}
                  </div>
                  <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                    {currentMethod.preparation.homogenization}
                  </p>
                  {currentMethod.preparation.homogenizationTimeOrCycles && (
                    <div className="text-[11px] text-stone-500">
                      زمان / دور: {currentMethod.preparation.homogenizationTimeOrCycles}
                    </div>
                  )}
                </div>

                {/* 3.3 Dilution, Filtration, Extraction Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Dilution */}
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                        <Droplet className="w-3.5 h-3.5 text-sky-500" />
                        <span>رقیق‌سازی (Dilution)</span>
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          currentMethod.preparation.dilution?.required
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : 'bg-stone-100 text-stone-500 dark:bg-stone-800'
                        }`}
                      >
                        {currentMethod.preparation.dilution?.required ? 'الزامی' : 'بدون رقت'}
                      </span>
                    </div>
                    {currentMethod.preparation.dilution?.required ? (
                      <div className="space-y-1 text-[11px] text-stone-700 dark:text-stone-300">
                        <div>
                          <strong>حلال:</strong> {currentMethod.preparation.dilution.diluent}
                        </div>
                        <div>
                          <strong>نسبت:</strong> {currentMethod.preparation.dilution.dilutionRatio}
                        </div>
                        {currentMethod.preparation.dilution.procedureNotes && (
                          <div className="text-stone-500 text-[10px]">
                            {currentMethod.preparation.dilution.procedureNotes}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-stone-400">
                        رقیق‌سازی برای این ماتریس نیاز نیست (نمونه مستقیم).
                      </div>
                    )}
                  </div>

                  {/* Filtration */}
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5 text-indigo-500" />
                        <span>فیلتراسیون (Filtration)</span>
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          currentMethod.preparation.filtration?.required
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-stone-100 text-stone-500 dark:bg-stone-800'
                        }`}
                      >
                        {currentMethod.preparation.filtration?.required ? 'الزامی' : 'بدون صاف‌کردن'}
                      </span>
                    </div>
                    {currentMethod.preparation.filtration?.required ? (
                      <div className="space-y-1 text-[11px] text-stone-700 dark:text-stone-300">
                        <div>
                          <strong>نوع صافی:</strong> {currentMethod.preparation.filtration.filterType}
                        </div>
                        {currentMethod.preparation.filtration.poreSize && (
                          <div>
                            <strong>سایز منافذ:</strong> {currentMethod.preparation.filtration.poreSize}
                          </div>
                        )}
                        {currentMethod.preparation.filtration.centrifugationAlternative && (
                          <div className="text-[10px] text-stone-500">
                            جایگزین: {currentMethod.preparation.filtration.centrifugationAlternative}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-stone-400">
                        فیلتراسیون فاز مایع نیاز نمی‌باشد.
                      </div>
                    )}
                  </div>

                  {/* Extraction */}
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                        <FlaskConical className="w-3.5 h-3.5 text-purple-500" />
                        <span>استخراج (Extraction)</span>
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          currentMethod.preparation.extraction?.required
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-stone-100 text-stone-500 dark:bg-stone-800'
                        }`}
                      >
                        {currentMethod.preparation.extraction?.required ? 'الزامی' : 'استخراج مستقیم'}
                      </span>
                    </div>
                    {currentMethod.preparation.extraction?.required ? (
                      <div className="space-y-1 text-[11px] text-stone-700 dark:text-stone-300">
                        <div>
                          <strong>تکنیک:</strong> {currentMethod.preparation.extraction.technique}
                        </div>
                        <div>
                          <strong>حلال:</strong> {currentMethod.preparation.extraction.extractingSolvent}
                        </div>
                        {currentMethod.preparation.extraction.solventVolume && (
                          <div>
                            <strong>حجم:</strong> {currentMethod.preparation.extraction.solventVolume}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-stone-400">
                        فرآیند استخراج حلال در این مرحله اعمال نمی‌شود.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STAGE 4: CONDITIONING (شرایط نگهداری، زمان نگهداری، دما) */}
          <div
            id="prep-stage-conditioning"
            className="rounded-2xl border border-violet-200 dark:border-violet-900/60 bg-violet-50/30 dark:bg-violet-950/10 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleSection('conditioning')}
              className="w-full p-4 flex items-center justify-between text-right bg-violet-50/60 dark:bg-violet-950/30 hover:bg-violet-100/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>۴. شرایط و زمان نگهداری و دما (Conditioning & Storage)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200">
                      مرحله ۴ از ۵
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    شرایط محیطی، بیشینه زمان ماند و دمای پایدارسازی
                  </p>
                </div>
              </div>
              {expandedSections.conditioning ? (
                <ChevronUp className="w-4 h-4 text-stone-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {expandedSections.conditioning && (
              <div className="p-4 sm:p-5 border-t border-violet-100 dark:border-violet-900/40 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Storage Conditions */}
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-[11px] text-stone-500 font-semibold block">
                      شرایط نگهداری (Storage Conditions):
                    </span>
                    <div className="font-bold text-stone-900 dark:text-stone-100">
                      {currentMethod.conditioning.storageConditions}
                    </div>
                  </div>

                  {/* Storage Time */}
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-[11px] text-stone-500 font-semibold block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>زمان نگهداری (Holding Time):</span>
                    </span>
                    <div className="font-bold text-amber-600 dark:text-amber-400">
                      {currentMethod.conditioning.storageTime}
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-[11px] text-stone-500 font-semibold block flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                      <span>دما (Temperature):</span>
                    </span>
                    <div className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                      {currentMethod.conditioning.temperature}
                    </div>
                  </div>
                </div>

                {currentMethod.conditioning.equilibrationInstructions && (
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                    <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">
                      دستورالعمل هم‌دمایی (Equilibration):
                    </span>
                    <span>{currentMethod.conditioning.equilibrationInstructions}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STAGE 5: ANALYSIS HANDOVER (تحویل به آزمون و معیارهای آمادگی) */}
          <div
            id="prep-stage-analysis"
            className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/10 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleSection('analysis')}
              className="w-full p-4 flex items-center justify-between text-right bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>۵. تحویل به آنالیز و معیارهای آمادگی (Analysis Handover)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                      مرحله ۵ از ۵
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    چک‌لیست تایید آمادگی فیزیکی و شیمیایی پیش از ورود به بخش ۸ (Procedure)
                  </p>
                </div>
              </div>
              {expandedSections.analysis ? (
                <ChevronUp className="w-4 h-4 text-stone-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {expandedSections.analysis && (
              <div className="p-4 sm:p-5 border-t border-emerald-100 dark:border-emerald-900/40 space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5">
                  <span className="text-[11px] text-stone-500 font-semibold block">
                    نحوه انتقال به مراحل آزمون اصلی:
                  </span>
                  <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                    {currentMethod.analysis.handoverToProcedureNotes}
                  </p>
                  <div className="text-[11px] text-stone-500 font-medium pt-1">
                    حداکثر زمان پایداری پس از آماده‌سازی:{' '}
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {currentMethod.analysis.preservationLimitAfterPrep}
                    </span>
                  </div>
                </div>

                {/* Readiness Criteria Checklist */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    معیارهای تایید صحت آماده‌سازی (Readiness Checklist):
                  </span>
                  <div className="space-y-1">
                    {currentMethod.analysis.readinessVerificationCriteria.map((crit, crIdx) => (
                      <div
                        key={crIdx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-950 dark:text-emerald-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CRITICAL WARNINGS BOX (هشدارها) */}
          {currentMethod.warnings && currentMethod.warnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>هشدارهای ایمنی و تکنیکال در آماده‌سازی نمونه (Critical Warnings):</span>
              </div>
              <ul className="space-y-1 text-xs text-rose-900 dark:text-rose-200 list-disc list-inside">
                {currentMethod.warnings.map((w, wIdx) => (
                  <li key={wIdx} className="leading-relaxed">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
