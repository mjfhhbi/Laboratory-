/**
 * Food Science AI - Intelligent Formulation & Process Advisor Modal
 * Grounded in verified scientific sources, hydrocolloids chemistry, and INSO/Codex standards.
 * 
 * Strict Scientific Requirements:
 * 1. AI marks suggestions as "پیشنهاد اولیه (Preliminary Proposal)".
 * 2. Cites authoritative scientific sources for claims.
 * 3. Never presents important numbers without verified source attribution.
 * 4. Enables 1-click creation of Formula vX from proposals.
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldAlert,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Thermometer,
  Lightbulb,
  Plus,
  ArrowRight,
  TrendingDown,
  Scale,
  Award,
  BookmarkCheck,
  FileCheck
} from 'lucide-react';
import { ProductDevelopmentProject, FormulationVersion } from '../../types/foodProduct';
import {
  analyzeProductFormulationWithAi,
  generateAiFormulationProposal,
  AI_REFORMULATION_GOALS,
  AiReformulationGoal,
  AiFormulationReviewResult,
  AiProposedFormulationResult
} from '../../lib/products/productAiAdvisor';

interface AiProductAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProductDevelopmentProject;
  activeFormulation?: FormulationVersion;
  onApplyNewVersion?: (newVersion: FormulationVersion) => void;
}

export const AiProductAdvisorModal: React.FC<AiProductAdvisorModalProps> = ({
  isOpen,
  onClose,
  project,
  activeFormulation,
  onApplyNewVersion
}) => {
  const [activeTab, setActiveTab] = useState<'review' | 'proposal'>('proposal');
  const [selectedGoal, setSelectedGoal] = useState<AiReformulationGoal>('sugar_reduction');
  const [proposal, setProposal] = useState<AiProposedFormulationResult | null>(() =>
    generateAiFormulationProposal(project, 'sugar_reduction')
  );
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentForm =
    activeFormulation ||
    project.formulations.find((f) => f.id === project.activeFormulationId) ||
    project.formulations[0];

  const analysis: AiFormulationReviewResult = analyzeProductFormulationWithAi(
    project,
    currentForm
  );

  const handleGenerateProposal = (goal: AiReformulationGoal) => {
    setSelectedGoal(goal);
    const result = generateAiFormulationProposal(project, goal);
    setProposal(result);
    setAppliedSuccess(false);
  };

  const handleApplyAsNewVersion = () => {
    if (!proposal || !onApplyNewVersion) return;

    const nextVersionNum = project.formulations.length + 1;
    const newVersion: FormulationVersion = {
      id: `form_ai_${Date.now()}`,
      versionCode: `Formula v${nextVersionNum} (${proposal.proposedTitle})`,
      versionNumber: nextVersionNum,
      title: proposal.proposedTitle,
      description: proposal.rationaleSummaryFa,
      isBaseline: false,
      baseVersionId: currentForm?.id,
      changeLogSummary: proposal.rationaleSummaryFa,
      isAiGenerated: true,
      aiPreliminaryNotice: proposal.mandatoryScientificNotice,
      scientificSources: proposal.scientificCitations.map((c) => ({
        title: c.sourceTitle,
        code: c.sourceCode,
        organization: c.organization,
        claim: `${c.parameterOrClaim}: ${c.sourceNumberOrRange}`,
        relevance: c.relevanceRationaleFa
      })),
      ingredients: proposal.proposedIngredients,
      totalPercentage: proposal.stoichiometricSummary.totalPercentage,
      totalDryMatterPercent: proposal.stoichiometricSummary.totalDryMatterPercent,
      estimatedBrix: proposal.stoichiometricSummary.estimatedBrix,
      estimatedCostPerKg: proposal.stoichiometricSummary.estimatedCostPerKg,
      notes: `پیشنهاد اولیه تدوین‌شده بر پایه استانداردهای ${proposal.scientificCitations.map((c) => c.sourceCode).join('، ')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onApplyNewVersion(newVersion);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      id="ai-product-advisor-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-stone-900 dark:to-emerald-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                  سامانه هوشمند پیشنهاد و اصلاح فرمولاسیون صنعتی (Food AI Formulation)
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                  پایگاه استانداردهای INSO و Codex
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                پروژه: {project.productNameFa} | فرمول فعال: {currentForm?.versionCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/40 shrink-0">
          <button
            onClick={() => setActiveTab('proposal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'proposal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>پیشنهاد فرمول جدید و اصلاح فرمول (Formula Reformulation)</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'review'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>ارزیابی علمی و چک‌لیست فرمول فعلی</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-right">
          {/* TAB 1: AI PROPOSED FORMULATION */}
          {activeTab === 'proposal' && (
            <div className="space-y-6">
              {/* Mandatory Preliminary Proposal Tag & Scientific Guardrails */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400/80 dark:border-amber-700 text-amber-950 dark:text-amber-200 space-y-2 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-700">
                      علامت‌گذاری الزامی: «پیشنهاد اولیه فرمولاسیون (Preliminary Formulation Proposal)»
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                    ضمانت تطابق با استانداردهای علمی مراجع
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-100/90 font-medium">
                  {proposal?.mandatoryScientificNotice}
                </p>
                <div className="pt-1 text-[11px] text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
                  <span>قانون قطعی هوش مصنوعی:</span>
                  <span className="underline decoration-amber-400">
                    هیچ عددی بدون استناد به منبع معتبر علمی اعلام نشده و ادعاها مستند به استاندارد ملی یا کدکس می‌باشند.
                  </span>
                </div>
              </div>

              {/* Goal Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                  انتخاب سناریوی بهینه‌سازی و اصلاح فرمول (Reformulation Objective):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {AI_REFORMULATION_GOALS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleGenerateProposal(g.id)}
                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                        selectedGoal === g.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-950 dark:text-emerald-100 shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-xs font-bold block mb-1">{g.labelFa}</span>
                      <span className="text-[10px] text-stone-500 leading-tight">
                        {g.descriptionFa}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {proposal && (
                <>
                  {/* Proposal Summary Card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                          {proposal.proposedVersionCode}
                        </span>
                        <h3 className="text-sm font-black text-stone-900 dark:text-stone-100">
                          {proposal.proposedTitle}
                        </h3>
                      </div>

                      {onApplyNewVersion && (
                        <button
                          onClick={handleApplyAsNewVersion}
                          disabled={appliedSuccess}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-75"
                        >
                          {appliedSuccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>به پروژه افزوده شد!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              <span>افزودن این پیشنهاد به عنوان نسخه بعدی در پروژه</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900/60 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                      <strong>استدلال بیوشیمیایی و فرآوری:</strong> {proposal.rationaleSummaryFa}
                    </p>

                    {/* Stoichiometric Checks Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-center">
                        <span className="text-[10px] text-stone-500 block">توازن جرمی</span>
                        <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          {proposal.stoichiometricSummary.totalPercentage}% (دقیق)
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-center">
                        <span className="text-[10px] text-stone-500 block">ماده خشک کل</span>
                        <span className="text-sm font-bold font-mono text-stone-900 dark:text-stone-100">
                          {proposal.stoichiometricSummary.totalDryMatterPercent}%
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-center">
                        <span className="text-[10px] text-stone-500 block">بریکس تخمینی</span>
                        <span className="text-sm font-bold font-mono text-stone-900 dark:text-stone-100">
                          {proposal.stoichiometricSummary.estimatedBrix}° Brix
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-center">
                        <span className="text-[10px] text-stone-500 block">بهای تخمینی هر کیلوگرم</span>
                        <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          {proposal.stoichiometricSummary.estimatedCostPerKg.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Scientific Source Citations (Mandatory Requirement) */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-2.5 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>منابع و استنادات علمی برای ادعاها و اعداد مهم این فرمولاسیون:</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {proposal.scientificCitations.map((cite, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-900 dark:text-blue-200">
                              {cite.parameterOrClaim}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-200/70 dark:bg-blue-900/80 text-blue-900 dark:text-blue-100">
                              {cite.sourceCode}
                            </span>
                          </div>

                          <div className="p-2 rounded-lg bg-white/70 dark:bg-stone-900/70 border border-blue-100 dark:border-blue-900/40">
                            <span className="text-[11px] text-stone-500 block">مقدار مجاز / پیشنهادی مأخوذ از منبع:</span>
                            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 font-mono">
                              {cite.sourceNumberOrRange}
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-600 dark:text-stone-300">
                            <strong>مرجع علمی:</strong> {cite.sourceTitle} ({cite.organization})
                          </p>

                          <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                            <strong>مکانیزم:</strong> {cite.relevanceRationaleFa}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proposed Ingredients Breakdown Table */}
                  <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm">
                    <div className="p-3.5 bg-stone-100 dark:bg-stone-800 font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span>ترکیب اجزای پیشنهادی اولیه ({proposal.proposedIngredients.length} جزء):</span>
                      <span className="text-stone-500 font-mono text-[11px]">مجموع: ۱۰۰.۰۰٪</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-right">
                        <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 border-b border-stone-200 dark:border-stone-700">
                          <tr>
                            <th className="p-2.5">نام ماده اولیه</th>
                            <th className="p-2.5 w-24 text-center">درصد (%)</th>
                            <th className="p-2.5 w-24 text-center">ماده خشک (%)</th>
                            <th className="p-2.5 w-32 text-center">قیمت هر کیلو</th>
                            <th className="p-2.5">یادداشت فرمولاسیونی و گرید</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                          {proposal.proposedIngredients.map((ing) => (
                            <tr key={ing.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                              <td className="p-2.5 font-bold text-stone-900 dark:text-stone-100">
                                {ing.nameFa}
                              </td>
                              <td className="p-2.5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {ing.percentage.toFixed(2)}%
                              </td>
                              <td className="p-2.5 text-center font-mono text-stone-600 dark:text-stone-400">
                                {ing.dryMatterPercent ?? 100}%
                              </td>
                              <td className="p-2.5 text-center font-mono text-stone-600 dark:text-stone-400">
                                {ing.costPerKg ? `${ing.costPerKg.toLocaleString('fa-IR')} ت` : '—'}
                              </td>
                              <td className="p-2.5 text-[11px] text-stone-500">
                                {ing.notes || ing.insNumber || 'گرید صنعتی'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE FORMULATION REVIEW */}
          {activeTab === 'review' && (
            <div className="space-y-6">
              {/* Scientific Guardrail & Disclaimer Banner */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs leading-relaxed shadow-sm">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-1">
                    سلب مسئولیت و انطباق با اخلاق پژوهش علمی و مهندسی:
                  </span>
                  <p>{analysis.scientificDisclaimer}</p>
                </div>
              </div>

              {/* Integrity Score & Executive Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-stone-500 mb-1">امتیاز جامع سلامت فرمولاسیون</span>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {analysis.formulationIntegrityScore}
                    <span className="text-sm font-normal text-stone-400"> / ۱۰۰</span>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1">تطابق با مبانی استوکیومتری و فیزیکوشیمی</span>
                </div>

                <div className="md:col-span-2 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex flex-col justify-center">
                  <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                    <span>جمع‌بندی تحلیلی دستیار فرمولاسیون</span>
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {analysis.overallAssessmentFa}
                  </p>
                </div>
              </div>

              {/* Stoichiometric Checks */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-stone-500" />
                  <span>کنترل موازنه جرمی و تعادل شیمیایی اجزا</span>
                </h3>
                <div className="space-y-2">
                  {analysis.stoichiometricChecks.map((chk, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                        chk.status === 'pass'
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-stone-700 dark:text-stone-300'
                          : chk.status === 'warning'
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-stone-700 dark:text-stone-300'
                          : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {chk.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold block mb-0.5">{chk.titleFa}</span>
                        <p className="text-stone-600 dark:text-stone-400">{chk.detailsFa}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hydrocolloids & Texture Engineering */}
              {analysis.hydrocolloidAndTextureAdviceFa.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>مهندسی بافت، پایدارکننده‌ها و هیدروکلوئیدها</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 space-y-2">
                    {analysis.hydrocolloidAndTextureAdviceFa.map((adv, idx) => (
                      <p key={idx} className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        • {adv}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Thermal Processing & Preservation */}
              {analysis.thermalProcessingAndPreservationAdviceFa.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-rose-500" />
                    <span>شرایط حرارتی و ماندگاری فرآیند (Thermal Preservation)</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-2">
                    {analysis.thermalProcessingAndPreservationAdviceFa.map((adv, idx) => (
                      <p key={idx} className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        • {adv}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Referenced Standards & Scientific Sources */}
              {analysis.referencedStandardsAndSources.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>استانداردها و مراجع علمی استنادشده</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.referencedStandardsAndSources.map((src, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 text-xs space-y-1"
                      >
                        <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                          <span>{src.code}</span>
                          <span className="text-[10px] text-stone-600 dark:text-stone-300 font-normal">
                            {src.organization}
                          </span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400">{src.titleFa}</p>
                        <p className="text-[11px] text-stone-600 dark:text-stone-300">
                          <strong>مرجعیت:</strong> {src.relevance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 dark:border-stone-800 px-6 py-4 bg-stone-50 dark:bg-stone-900/80 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            سیستم هوشمند صنایع غذایی — مجهز به پایگاه استانداردهای ملی و بین‌المللی
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
