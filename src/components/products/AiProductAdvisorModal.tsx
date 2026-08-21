/**
 * Food Science AI - Intelligent Formulation & Process Advisor Modal
 * Grounded in verified scientific sources, hydrocolloids chemistry, and INSO/Codex standards.
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldAlert,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Thermometer,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { ProductDevelopmentProject, FormulationVersion } from '../../types/foodProduct';
import { analyzeProductFormulationWithAi, AiFormulationReviewResult } from '../../lib/products/productAiAdvisor';

interface AiProductAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProductDevelopmentProject;
  activeFormulation?: FormulationVersion;
}

export const AiProductAdvisorModal: React.FC<AiProductAdvisorModalProps> = ({
  isOpen,
  onClose,
  project,
  activeFormulation
}) => {
  if (!isOpen) return null;

  const currentForm =
    activeFormulation ||
    project.formulations.find((f) => f.id === project.activeFormulationId) ||
    project.formulations[0];

  const analysis: AiFormulationReviewResult = analyzeProductFormulationWithAi(
    project,
    currentForm
  );

  return (
    <div
      id="ai-product-advisor-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="w-full max-w-4xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 my-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-stone-900 dark:to-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>مشاور هوشمند توسعه محصول و بهینه‌سازی فرمولاسیون</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-normal">
                  مبتنی بر پایگاه دانش علمی
                </span>
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                بررسی تخصصی فرمول: {currentForm?.versionCode || 'فرمول فعال'} — پروژه: {project.productNameFa}
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-right">
          {/* Strict Scientific Guardrail & Disclaimer Banner */}
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

          {/* Thermal Processing & Preservation Kinetics */}
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

          {/* Risk Prediction & Troubleshooting */}
          {analysis.troubleshootingPredictionsFa.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>پیش‌بینی عیوب احتمالی و راهکارهای اصلاحی</span>
              </h3>
              <div className="space-y-3">
                {analysis.troubleshootingPredictionsFa.map((risk, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {risk.riskNameFa}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                        ریسک: {risk.probability === 'high' ? 'بالا' : risk.probability === 'medium' ? 'متوسط' : 'کم'}
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      <strong>مکانیسم علمی:</strong> {risk.scientificMechanismFa}
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">
                      <strong>راهکار پیشگیرانه:</strong> {risk.preventionStrategyFa}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referenced Standards & Scientific Sources */}
          {analysis.referencedStandardsAndSources.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>استانداردها و منابع علمی استنادشده</span>
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

        {/* Footer */}
        <div className="border-t border-stone-200 dark:border-stone-800 px-6 py-4 bg-stone-50 dark:bg-stone-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            متوجه شدم و بازگشت به فرمولاسیون
          </button>
        </div>
      </div>
    </div>
  );
};
