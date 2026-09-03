import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Atom, 
  FlaskConical, 
  Wrench, 
  Pipette, 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  Play
} from 'lucide-react';
import { FoodChemistryTest } from '../../types/foodChemistry';

interface ChemicalTestDetailModalProps {
  test: FoodChemistryTest | null;
  onClose: () => void;
  onLaunchInLabEngine?: (test: FoodChemistryTest) => void;
}

export const ChemicalTestDetailModal: React.FC<ChemicalTestDetailModalProps> = ({
  test,
  onClose,
  onLaunchInLabEngine
}) => {
  const [activeTab, setActiveTab] = useState<'sop' | 'chemistry' | 'standards' | 'calculations' | 'qc_troubleshooting'>('sop');

  // Local interactive calculation state
  const [calcInputs, setCalcInputs] = useState<Record<string, number>>({});
  const [calcResult, setCalcResult] = useState<number | null>(null);

  if (!test) return null;

  // Initialize default values for calculation if not set
  const handleCalculate = () => {
    // Evaluation based on test formula
    try {
      const vars = { ...test.calculationRules.variables.reduce((acc, v) => ({ ...acc, [v.symbol]: v.defaultValue ?? 0 }), {}), ...calcInputs };
      let result = 0;

      if (test.id === 'chem-moisture-oven') {
        const m1 = vars['m1'];
        const m2 = vars['m2'];
        const m0 = vars['m0'];
        result = ((m1 - m2) / (m1 - m0)) * 100;
      } else if (test.id === 'chem-ash-furnace') {
        const m2 = vars['m2'];
        const m0 = vars['m0'];
        const m1 = vars['m1'];
        result = ((m2 - m0) / (m1 - m0)) * 100;
      } else if (test.id === 'chem-protein-kjeldahl') {
        const Vs = vars['Vs'];
        const Vb = vars['Vb'];
        const N = vars['N'];
        const m = vars['m'];
        const F = vars['F'];
        const nitrogen = ((Vs - Vb) * N * 1.4007) / m;
        result = nitrogen * F;
      } else if (test.id === 'chem-fat-soxhlet') {
        const m2 = vars['m2'];
        const m1 = vars['m1'];
        const m = vars['m'];
        result = ((m2 - m1) / m) * 100;
      } else if (test.id === 'chem-salt-mohr') {
        const V = vars['V'];
        const Vb = vars['Vb'];
        const N = vars['N'];
        const m = vars['m'];
        result = ((V - Vb) * N * 0.05844 * 100) / m;
      } else if (test.id === 'chem-acidity-titration') {
        const V = vars['V'];
        const N = vars['N'];
        const meq = vars['meq'];
        const m = vars['m'];
        result = (V * N * meq * 100) / m;
      } else if (test.id === 'chem-refractometry-brix') {
        const brixObs = vars['Brix_obs'];
        const temp = vars['Temp'];
        const corr = (temp - 20) * 0.07;
        result = brixObs + corr;
      } else if (test.id === 'chem-fiber-tdf') {
        const R = vars['R_avg'];
        const P = vars['P'];
        const A = vars['A'];
        const B = vars['B'];
        const m = vars['m_avg'];
        result = ((R - P - A - B) / m) * 100;
      } else if (test.id === 'chem-sugars-lane-eynon') {
        const F = vars['F'];
        const V1 = vars['V1'];
        const Vtot = vars['V_total'];
        const m = vars['m'];
        result = (F * Vtot * 100) / (V1 * m * 1000);
      } else if (test.id === 'chem-pigments-anthocyanins') {
        const a1 = (vars['A520_pH1'] || 0.852) - (vars['A700_pH1'] || 0.024);
        const a2 = (vars['A520_pH45'] || 0.120) - (vars['A700_pH45'] || 0.022);
        const A = a1 - a2;
        const df = vars['DF'] || 10;
        const mw = vars['MW'] || 449.2;
        const eps = vars['Epsilon'] || 26900;
        result = (A * mw * df * 1000) / (eps * 1);
      } else if (test.id === 'chem-antioxidants-folin') {
        const abs = vars['Abs765'] || 0.485;
        const slope = vars['Slope'] || 0.0095;
        const intercept = vars['Intercept'] || 0.015;
        const conc = (abs - intercept) / slope;
        const vext = vars['V_ext'] || 25;
        const m = vars['m'] || 1.0;
        result = (conc * (vext / 1000)) / m;
      } else if (test.id === 'chem-lipids-peroxide') {
        const vs = vars['Vs'];
        const vb = vars['Vb'];
        const n = vars['NThio'];
        const m = vars['m'];
        result = ((vs - vb) * n * 1000) / m;
      } else if (test.id === 'chem-vitamins-ascorbic') {
        const vs = vars['Vs'];
        const vb = vars['Vb'];
        const f = vars['F'];
        const vsample = vars['Vsample'] || 10;
        result = ((vs - vb) * f * 100) / vsample;
      }

      setCalcResult(Number(result.toFixed(test.calculationRules.significantFigures)));
    } catch {
      setCalcResult(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="chemical-test-detail-dialog"
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {test.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {test.primaryStandard.organization} {test.primaryStandard.standardNumber}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              {test.titleFa}
            </h2>
            <p className="text-xs text-slate-400 font-mono" dir="ltr">
              {test.titleEn}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('sop')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'sop'
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            دستورالعمل آزمون (SOP)
          </button>
          <button
            onClick={() => setActiveTab('chemistry')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'chemistry'
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Atom className="w-4 h-4" />
            مبانی و آماده‌سازی نمونه
          </button>
          <button
            onClick={() => setActiveTab('standards')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'standards'
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            مراجع و روش‌های موازی ({test.alternativeMethods?.length ? test.alternativeMethods.length + 1 : 1})
          </button>
          <button
            onClick={() => setActiveTab('calculations')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'calculations'
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            فرمول و محاسبه زنده
          </button>
          <button
            onClick={() => setActiveTab('qc_troubleshooting')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'qc_troubleshooting'
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            کنترل کیفیت و عیب‌یابی
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SOP & PROCEDURE */}
          {activeTab === 'sop' && (
            <div className="space-y-6">
              {/* Objective Box */}
              <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-1">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-600" />
                  هدف از انجام آزمون (Objective):
                </span>
                <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed">
                  {test.objectiveFa}
                </p>
              </div>

              {/* Required Equipment & Reagents 2-Col Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Equipment */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-slate-600" />
                    تجهیزات و دستگاه‌های مورد نیاز:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {test.requiredEquipment.map((eq) => (
                      <li key={eq.id} className="p-2 bg-white rounded-lg border border-slate-200/80">
                        <div className="font-semibold text-slate-900">{eq.nameFa}</div>
                        <div className="text-[11px] text-slate-500 font-mono" dir="ltr">{eq.nameEn}</div>
                        {eq.specification && (
                          <div className="text-[11px] text-indigo-600 mt-0.5">مشخصات: {eq.specification}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reagents */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Pipette className="w-4 h-4 text-slate-600" />
                    معرف‌ها و مواد شیمیایی:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {test.requiredReagents.map((rg) => (
                      <li key={rg.id} className="p-2 bg-white rounded-lg border border-slate-200/80">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{rg.nameFa}</span>
                          {rg.grade && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">
                              {rg.grade}
                            </span>
                          )}
                        </div>
                        {rg.preparationProtocolFa && (
                          <div className="text-[11px] text-slate-600 mt-1 leading-normal">
                            نحوه آماده‌سازی: {rg.preparationProtocolFa}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-Step SOP */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  دستورالعمل اجرایی گام‌به‌گام (Standard Operating Procedure):
                </h4>
                <div className="space-y-3">
                  {test.proceduralSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {step.stepNumber}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="font-bold text-slate-900 text-sm">{step.titleFa}</h5>
                          {step.criticalTimeOrTemp && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                              <Clock className="w-3 h-3" />
                              {step.criticalTimeOrTemp}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {step.instructionFa}
                        </p>
                        {step.safetyPrecautionsFa && (
                          <div className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>هشدار ایمنی: {step.safetyPrecautionsFa}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHEMISTRY PRINCIPLE & SAMPLE PREP */}
          {activeTab === 'chemistry' && (
            <div className="space-y-6">
              {/* Chemical Principle */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Atom className="w-5 h-5 text-indigo-600" />
                  مبنای واکنش‌های شیمیایی (Chemical Principle & Reactions):
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {test.chemicalPrincipleFa}
                </p>
              </div>

              {/* Sample Prep Protocol */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  پروتکل نمونه‌برداری و پیش‌تیمار آزمایشگاهی:
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">همگن‌سازی و آماده‌سازی:</span>
                    <span className="text-slate-600 leading-relaxed">{test.samplePreparation.homogenizationProtocolFa}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">وزن یا حجم نمونه آزمایه:</span>
                    <span className="text-slate-800 font-mono font-bold">{test.samplePreparation.sampleMassOrVolume}</span>
                  </div>
                  {test.samplePreparation.pretreatmentNotesFa && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 sm:col-span-2">
                      <span className="font-bold text-slate-800 block mb-1">پیش‌تیمار و حذف تداخلات:</span>
                      <span className="text-slate-600 leading-relaxed">{test.samplePreparation.pretreatmentNotesFa}</span>
                    </div>
                  )}
                  {test.samplePreparation.storageBeforeAnalysis && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 sm:col-span-2">
                      <span className="font-bold text-slate-800 block mb-1">شرایط نگهداری تا پیش از آزمون:</span>
                      <span className="text-slate-600">{test.samplePreparation.storageBeforeAnalysis}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STANDARDS & ALTERNATIVE METHODS */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              {/* Primary Standard */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    استاندارد ملی مرجع اصلی (Primary Standard):
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded font-mono text-xs font-bold">
                    {test.primaryStandard.organization} {test.primaryStandard.standardNumber}
                  </span>
                </div>
                <div className="text-sm font-bold text-emerald-950">{test.primaryStandard.titleFa}</div>
                <div className="text-xs text-emerald-800 font-mono" dir="ltr">{test.primaryStandard.titleEn}</div>
                <div className="text-xs text-emerald-700 mt-1">
                  دامنه کاربرد و ماتریس: {test.primaryStandard.scopeAndMatrix}
                </div>
              </div>

              {/* Secondary Standards */}
              {test.secondaryStandards && test.secondaryStandards.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">استانداردهای بین‌المللی متناظر (Codex / ISO / AOAC):</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {test.secondaryStandards.map((std, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-indigo-700">{std.organization} {std.standardNumber}</span>
                        </div>
                        <div className="font-semibold text-slate-800 mt-1">{std.titleFa}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5" dir="ltr">{std.titleEn}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternative Parallel Methods */}
              {test.alternativeMethods && test.alternativeMethods.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    روش‌های موازی و استاندارد دیگر برای این آنالیت:
                  </h4>
                  <div className="space-y-3">
                    {test.alternativeMethods.map((alt) => (
                      <div key={alt.methodId} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div>
                            <h5 className="font-bold text-slate-900 text-sm">{alt.methodNameFa}</h5>
                            <p className="text-xs text-slate-500 font-mono" dir="ltr">{alt.methodNameEn}</p>
                          </div>
                          {alt.analysisTime && (
                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              زمان: {alt.analysisTime}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed">
                          <span className="font-semibold text-slate-900">مبنای روش: </span>
                          {alt.principleFa}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                            <span className="font-bold text-emerald-900 block mb-1">مزایا و برتری‌ها:</span>
                            <ul className="list-disc list-inside text-emerald-800 space-y-0.5">
                              {alt.advantagesFa.map((adv, i) => (
                                <li key={i}>{adv}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-100">
                            <span className="font-bold text-rose-900 block mb-1">محدودیت‌ها:</span>
                            <ul className="list-disc list-inside text-rose-800 space-y-0.5">
                              {alt.limitationsFa.map((lim, i) => (
                                <li key={i}>{lim}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border text-center">
                  روش استاندارد فوق، روش مرجع جهانی یگانه برای این آزمون است.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CALCULATIONS & LIVE CALCULATOR */}
          {activeTab === 'calculations' && (
            <div className="space-y-6">
              {/* Formula & Variables */}
              <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-indigo-400 block font-semibold">فرمول ریاضی محاسبه نتیجه:</span>
                <div className="p-3 bg-slate-800 rounded-lg text-center font-mono text-base text-indigo-200 overflow-x-auto" dir="ltr">
                  {test.calculationRules.formulaLatex}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {test.calculationRules.formulaDescriptionFa}
                </p>
                <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                  <span>واحد نتیجه: <strong className="text-white font-mono">{test.calculationRules.unitResult}</strong></span>
                  <span>ارقام با معنی: <strong className="text-white">{test.calculationRules.significantFigures} رقم</strong></span>
                </div>
              </div>

              {/* Interactive Calculation Simulator */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-indigo-600" />
                    شبیه‌ساز و محاسبه‌گر زنده آزمون (Live Calculation):
                  </h4>
                  <button
                    onClick={handleCalculate}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                  >
                    محاسبه نتیجه
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {test.calculationRules.variables.map((v) => (
                    <div key={v.symbol} className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>{v.symbol} ({v.unit})</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{v.descriptionFa}</span>
                      </label>
                      <input
                        type="number"
                        step="any"
                        defaultValue={v.defaultValue ?? 0}
                        onChange={(e) => setCalcInputs({ ...calcInputs, [v.symbol]: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>

                {calcResult !== null && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-emerald-800 font-semibold">نتیجه محاسبه آزمون:</div>
                      <div className="text-xl font-black text-emerald-950 font-mono">
                        {calcResult} {test.calculationRules.unitResult}
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-200 text-emerald-900 font-bold">
                      صحیح و معتبر
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: QC & TROUBLESHOOTING */}
          {activeTab === 'qc_troubleshooting' && (
            <div className="space-y-6">
              {/* Quality Control Requirements */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  الزامات کنترل کیفیت و صحه‌گذاری ISO 17025:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">الزام آزمون شاهد (Blank):</span>
                    <span className="text-slate-600">{test.qualityControl.reagentBlankRequirementFa}</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">دامنه درصد بازیابی (Recovery %):</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {test.qualityControl.expectedRecoveryRangePercent.min}% الی {test.qualityControl.expectedRecoveryRangePercent.max}%
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">حد تکرارپذیری درون‌آزمایشگاهی (r):</span>
                    <span className="text-slate-600">{test.qualityControl.repeatabilityLimit_r}</span>
                  </div>

                  {test.qualityControl.certifiedReferenceMaterialCRM && (
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-1">ماده مرجع گواهی‌شده (CRM):</span>
                      <span className="text-slate-600">{test.qualityControl.certifiedReferenceMaterialCRM}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Troubleshooting & CAPA */}
              {test.troubleshooting && test.troubleshooting.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    عیب‌یابی خطاهای رایج و اقدام اصلاحی (CAPA):
                  </h4>

                  <div className="space-y-3">
                    {test.troubleshooting.map((tb, idx) => (
                      <div key={idx} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                        <div className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                          نشانه و خطا: {tb.symptomFa}
                        </div>
                        <div className="text-amber-900">
                          <strong>علل احتمالی: </strong>
                          {tb.probableCausesFa.join(' / ')}
                        </div>
                        <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200 text-slate-800">
                          <strong className="text-indigo-800">اقدام اصلاحی و پیشگیرانه (CAPA): </strong>
                          {tb.correctiveAndPreventiveActionFa}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            استاندارد مرجع: <strong className="text-slate-700">{test.primaryStandard.organization} {test.primaryStandard.standardNumber}</strong>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onLaunchInLabEngine && (
              <button
                id="btn-modal-launch-lab-engine"
                onClick={() => {
                  onLaunchInLabEngine(test);
                  onClose();
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                اجرا در موتور آزمایشگاه
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
