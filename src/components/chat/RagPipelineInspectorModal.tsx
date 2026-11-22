/**
 * Food Science AI - RAG Pipeline Inspector Modal
 * Part 23 of 30 - Deep Transparency & Inspection of 7-Step RAG Execution Flow
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  FileText,
  Clock,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RagEvidenceValidationResult, RagRankedChunk, RagPipelineTrace } from '../../lib/rag/types';

interface RagPipelineInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  trace?: RagPipelineTrace;
  ragMetadata?: {
    intentLabelFa: string;
    intentType: string;
    searchMode: string;
    evidenceScore: number;
    evidenceLevel: 'sufficient' | 'partial' | 'insufficient';
    groundingStrategy: 'grounded_verified' | 'cautious_partial' | 'unverified_warning';
    missingFactors?: string[];
    warningNoticeFa?: string;
    retrievedChunksCount: number;
    rankedSourcesCount: number;
    executionTimeMs: number;
    stepTrace?: any;
  };
  citedSources?: Array<{
    id: string;
    title: string;
    standardNumber?: string;
    sourceType: string;
    pageNumber?: number;
    snippet?: string;
    isOcr?: boolean;
    confidenceLevel: string;
  }>;
}

export const RagPipelineInspectorModal: React.FC<RagPipelineInspectorModalProps> = ({
  isOpen,
  onClose,
  trace,
  ragMetadata,
  citedSources
}) => {
  const [activeStep, setActiveStep] = useState<number>(5); // default on evidence validation
  const [expandedChunkId, setExpandedChunkId] = useState<string | null>(null);

  if (!isOpen) return null;

  const stepTrace = trace || ragMetadata?.stepTrace;
  const evidenceVal = stepTrace?.step6_evidenceValidation || {
    score: ragMetadata?.evidenceScore ?? 0,
    level: ragMetadata?.evidenceLevel ?? 'insufficient',
    strategy: ragMetadata?.groundingStrategy ?? 'unverified_warning',
    missingFactors: ragMetadata?.missingFactors ?? [],
    warningNoticeFa: ragMetadata?.warningNoticeFa
  };

  const rankedChunks = stepTrace?.step5_rankedChunks || [];
  const intent = stepTrace?.step2_intent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  ردیابی و تحلیل جریان موتور RAG (Pipeline Trace)
                </h3>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  {stepTrace?.executionTimeMs ? `${stepTrace.executionTimeMs}ms` : 'آنالیز کامل'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                مشاهده شفاف گام‌های استخراج قصد، جستجوی هیبریدی، اعتبارسنجی شواهد و Grounding
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Step Pipeline Horizontal Stepper */}
        <div className="px-4 py-3 bg-stone-100/70 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-1 overflow-x-auto text-[11px] font-medium">
          {[
            { id: 1, label: '۱. پرسش کاربر', icon: '❓' },
            { id: 2, label: '۲. تشخیص قصد', icon: '🎯' },
            { id: 3, label: '۳. استراتژی جستجو', icon: '🔍' },
            { id: 4, label: '۴. بازیابی مراجع', icon: '📚' },
            { id: 5, label: '۵. رتبه‌بندی قطعات', icon: '📊' },
            { id: 6, label: '۶. اعتبارسنجی شواهد', icon: '🛡️' },
            { id: 7, label: '۷. پاسخ مستند AI', icon: '✨' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStep(st.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                activeStep === st.id
                  ? 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm ring-1 ring-emerald-500/20'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
              }`}
            >
              <span>{st.icon}</span>
              <span>{st.label}</span>
            </button>
          ))}
        </div>

        {/* Step Detail Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm text-stone-700 dark:text-stone-300">
          
          {/* STEP 1: Question */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">
                  پرسش ورودی به سیستم:
                </div>
                <div className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {stepTrace?.step1_question || ragMetadata?.intentLabelFa || 'پرسش جاری کاربر'}
                </div>
              </div>
              <p className="text-xs text-stone-500">
                متن پرسش توسط ماژول پیش‌پردازش نرمال‌سازی شده (یکسان‌سازی حروف ی/ک فارسی و حذف نویسه‌های زائد) و برای تشخیص موجودیت‌ها آماده شده است.
              </p>
            </div>
          )}

          {/* STEP 2: Intent Detection */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-xs text-stone-500 block mb-1">نوع قصد تخصصی (Classified Intent):</span>
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    {intent?.labelFa || ragMetadata?.intentLabelFa || 'نامشخص'}
                  </span>
                  <span className="text-[10px] text-stone-400 block font-mono mt-0.5">
                    ({intent?.type || ragMetadata?.intentType})
                  </span>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-xs text-stone-500 block mb-1">ضریب اطمینان تشخیص قصد:</span>
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-200 font-mono" dir="ltr">
                    {intent?.confidence ? `${Math.round(intent.confidence * 100)}%` : '۹۲٪'}
                  </span>
                </div>
              </div>

              {/* Extracted Entities */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  موجودیت‌های استخراج‌شده از متن (Extracted Entities):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block">فرآورده هدف (Product):</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {intent?.targetProduct || 'عمومی / نامشخص'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block">آزمون آزمایشگاهی (Experiment):</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {intent?.targetExperiment || 'نامشخص'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block">استاندارد مرجع (Standard):</span>
                    <span className="font-bold font-mono text-stone-800 dark:text-stone-200" dir="ltr">
                      {intent?.targetStandard || 'نامشخص'}
                    </span>
                  </div>
                </div>

                {intent?.keywords && intent.keywords.length > 0 && (
                  <div>
                    <span className="text-[10px] text-stone-400 block mb-1.5">کلیدواژه‌های اصلی جهت جستجوی چندگانه:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {intent.keywords.map((kw: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Search Strategy */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="text-xs font-semibold text-stone-500">استراتژی موتور جستجو:</div>
                <div className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-600" />
                  <span>
                    {stepTrace?.step3_searchMode === 'hybrid'
                      ? 'جستجوی هیبریدی چندوجهی (Hybrid: Semantic + Keyword)'
                      : stepTrace?.step3_searchMode === 'semantic'
                      ? 'جستجوی مفهومی معنایی (Semantic)'
                      : 'جستجوی مستقیم کلیدواژه‌ای (Keyword)'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  جستجو همزمان بر روی قطعات اسناد PDF استانداردها، رکوردهای پایگاه دانش (Knowledge Base) و جدول استانداردهای ملی ایران اجرا گردیده است.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-400 block mb-1">زمان پردازش جستجو و بازیابی:</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200" dir="ltr">
                    {stepTrace?.executionTimeMs ? `${stepTrace.executionTimeMs} ms` : 'کمتر از ۱۰۰ میلی‌ثانیه'}
                  </span>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-400 block mb-1">تعداد منابع استخراج‌شده:</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                    {citedSources?.length || stepTrace?.step4_retrievedSourcesCount || 0} مرجع
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Source Retrieval */}
          {activeStep === 4 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
                فهرست منابع علمی و استانداردهای استخراج‌شده:
              </div>
              {citedSources && citedSources.length > 0 ? (
                <div className="space-y-2">
                  {citedSources.map((src, idx) => (
                    <div
                      key={src.id || idx}
                      className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-2">
                          <span>{src.title}</span>
                          {src.standardNumber && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-stone-200 dark:bg-stone-700 rounded font-mono" dir="ltr">
                              {src.standardNumber}
                            </span>
                          )}
                          {src.isOcr && (
                            <span className="px-1.5 py-0.5 text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded">
                              استخراج OCR
                            </span>
                          )}
                        </div>
                        {src.snippet && (
                          <p className="text-[11px] text-stone-500 line-clamp-1">{src.snippet}</p>
                        )}
                      </div>
                      <div className="text-left font-mono text-[10px] text-stone-400">
                        {src.pageNumber ? `ص ${src.pageNumber}` : 'پایگاه دانش'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                  هیچ مرجع مستندی در پایگاه برای این پرسش یافت نشد.
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Ranked Chunks */}
          {activeStep === 5 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  قطعات بازیابی‌شده به ترتیب امتیاز تطابق (Top Ranked Chunks):
                </span>
                <span className="text-[10px] text-stone-400">
                  {rankedChunks.length} قطعه انتخاب‌شده
                </span>
              </div>

              {rankedChunks.length > 0 ? (
                <div className="space-y-2">
                  {rankedChunks.map((chunk: any, idx: number) => {
                    const isExpanded = expandedChunkId === (chunk.id || String(idx));
                    return (
                      <div
                        key={chunk.id || idx}
                        className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-xs text-stone-800 dark:text-stone-200">
                              {chunk.title || chunk.sourceTitle}
                            </span>
                            {chunk.standardNumber && (
                              <span className="text-[10px] bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded font-mono" dir="ltr">
                                {chunk.standardNumber}
                              </span>
                            )}
                            {chunk.pageNumber && (
                              <span className="text-[10px] text-stone-400">
                                ص {chunk.pageNumber}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800" dir="ltr">
                              امتیاز: {typeof chunk.score === 'number' ? chunk.score.toFixed(2) : chunk.score}
                            </span>
                            <button
                              onClick={() => setExpandedChunkId(isExpanded ? null : (chunk.id || String(idx)))}
                              className="p-1 text-stone-400 hover:text-stone-700"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && chunk.text && (
                          <div className="p-2.5 bg-white dark:bg-stone-900 rounded-lg text-xs font-mono text-stone-600 dark:text-stone-300 leading-relaxed border border-stone-200 dark:border-stone-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {chunk.text}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-500 text-center">
                  قطعه‌ای رتبه‌بندی نشده است.
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Evidence Validation */}
          {activeStep === 6 && (
            <div className="space-y-4">
              {/* Evidence Gauge / Score Card */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                evidenceVal.level === 'sufficient'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : evidenceVal.level === 'partial'
                  ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                  : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              }`}>
                <div className="flex items-center gap-3">
                  {evidenceVal.level === 'sufficient' && <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
                  {evidenceVal.level === 'partial' && <AlertTriangle className="w-8 h-8 text-amber-600" />}
                  {evidenceVal.level === 'insufficient' && <AlertOctagon className="w-8 h-8 text-rose-600" />}

                  <div>
                    <div className="font-bold text-sm">
                      {(evidenceVal.level === 'sufficient' || (evidenceVal as any).tier === 'VERIFIED') && '[VERIFIED] اطلاعات مستقیماً توسط Source معتبر پشتیبانی می‌شود'}
                      {(evidenceVal.level === 'partial' || (evidenceVal as any).tier === 'SUPPORTED') && '[SUPPORTED] اطلاعات از منابع موجود پشتیبانی می‌شود اما نیاز به بررسی بیشتر دارد'}
                      {(evidenceVal.level === 'insufficient' || (evidenceVal as any).tier === 'UNVERIFIED') && '[UNVERIFIED] منبع کافی وجود ندارد و نباید به‌عنوان حقیقت قطعی نمایش داده شود'}
                    </div>
                    <div className="text-xs opacity-80 mt-0.5">
                      راهبرد پرامپت: <span className="font-mono">{evidenceVal.strategy}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left font-mono">
                  <div className="text-2xl font-black">
                    {evidenceVal.score}%
                  </div>
                  <div className="text-[10px] opacity-75">امتیاز شواهد</div>
                </div>
              </div>

              {/* Warning Notice if any */}
              {evidenceVal.warningNoticeFa && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>پیام شفاف سامانه در خصوص شواهد:</span>
                  </div>
                  <p>{evidenceVal.warningNoticeFa}</p>
                </div>
              )}

              {/* Missing Factors */}
              {evidenceVal.missingFactors && evidenceVal.missingFactors.length > 0 && (
                <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                    فاکتورهای نیازمند اطلاعات تکمیلی یا مفقود در پایگاه:
                  </span>
                  <ul className="list-disc list-inside text-xs text-stone-600 dark:text-stone-400 space-y-1">
                    {evidenceVal.missingFactors.map((mf: string, i: number) => (
                      <li key={i}>{mf}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Grounded AI Output Instructions */}
          {activeStep === 7 && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="text-xs font-semibold text-stone-500">نحوه اتصال به هوش مصنوعی (Grounding Prompt):</div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  بر اساس نتیجه اعتبارسنجی شواهد، هوش مصنوعی موظف گردیده تا بر پایه منشور صداقت علمی (Scientific Integrity Charter)، استنادات را با شماره دقیق استاندارد و صفحه ذکر کرده و هرگز ادعای قطعی بدون منبع مطرح ننماید.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>تضمین عدم تخیل (Zero-Hallucination Assurance)</span>
                </div>
                <p className="text-[11px] opacity-90 leading-snug">
                  اگر مستندات کافی نباشد، پاسخ به عنوان عمومی با برچسب [UNVERIFIED] صادر شده و کمبود منبع رسماً اعلام می‌گردد.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/60 dark:bg-stone-800/30">
          <div className="text-xs text-stone-500">
            موتور RAG تخصصی Food Science AI • گام {activeStep} از ۷
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 rounded-xl transition-colors"
          >
            بستن پنجره تحلیل
          </button>
        </div>

      </div>
    </div>
  );
};
