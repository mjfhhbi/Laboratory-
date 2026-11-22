/**
 * Food Science AI - Intelligent Lab Test Analysis & Quality Diagnostics Modal
 * Part 29 of 30: Rigorous, evidence-grounded laboratory test results analysis.
 * 
 * Features:
 * 1. Direct Entry or Upload/Import of Lab Results.
 * 2. Real-time validation of physicochemical rules (impossibilities, stoich, limits).
 * 3. Comparison with Project QC Specifications & Reference Standards (INSO/AOAC/Codex).
 * 4. Multi-batch historical trend analysis & drift detection.
 * 5. Outlier and suspicious data flagging with empirical evidence.
 * 6. 4-Pillar Root Cause Analysis:
 *    - Equipment / Instrument stability & baseline
 *    - Calibration Status (expiration, slope %, due dates)
 *    - Reagent Quality & Titer standardization
 *    - Sample Preparation (temperature, homogenization, dilution)
 * 7. Evidence-grounded probabilistic wording: "بر اساس داده موجود، X یکی از احتمالات است."
 * 8. Comprehensive output sections:
 *    - نتیجه (Result)
 *    - وضعیت (Status)
 *    - داده‌های مشکوک (Suspicious Data)
 *    - خطاهای احتمالی (Potential Errors)
 *    - شواهد (Evidence)
 *    - پیشنهاد بررسی (Review Suggestions)
 *    - منبع و رفرنس استاندارد (Source Standards)
 * 9. Absolute raw data preservation (ISO 17025 compliance).
 */

import React, { useState } from 'react';
import {
  X,
  Microscope,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  FileCheck,
  TrendingUp,
  Sliders,
  Wrench,
  FlaskConical,
  FileText,
  Upload,
  Download,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Sparkles,
  Database,
  HelpCircle,
  BookOpen,
  Save
} from 'lucide-react';
import {
  ProductDevelopmentProject,
  QualityControlSpec,
  TestResultEntry
} from '../../types/foodProduct';
import {
  analyzeIntelligentLabTest,
  IntelligentLabAnalysisReport,
  LabAnalysisInput,
  LabInstrumentAuditInfo,
  LabReagentAuditInfo,
  LabSampleAuditInfo
} from '../../lib/products/labAnalysisEngine';

interface IntelligentLabAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProductDevelopmentProject;
  initialTestResult?: TestResultEntry;
  onSaveAnalysisResult: (updatedResult: TestResultEntry) => void;
}

export const IntelligentLabAnalysisModal: React.FC<IntelligentLabAnalysisModalProps> = ({
  isOpen,
  onClose,
  project,
  initialTestResult,
  onSaveAnalysisResult
}) => {
  if (!isOpen) return null;

  // Active Tab inside modal: 'input_audit' | 'analysis_report' | 'batch_trend'
  const [activeModalTab, setActiveModalTab] = useState<'input_audit' | 'analysis_report'>('input_audit');

  // Input Data State
  const [batchNumber, setBatchNumber] = useState(
    initialTestResult?.batchNumber || `BATCH-${new Date().getFullYear()}-${String(project.testResults.length + 1).padStart(3, '0')}`
  );
  const [trialDate, setTrialDate] = useState(
    initialTestResult?.trialDate || new Date().toISOString().split('T')[0]
  );
  const [batchSizeKg, setBatchSizeKg] = useState<number>(initialTestResult?.batchSizeKg || 10);
  const [operator, setOperator] = useState(initialTestResult?.operatorOrScientist || 'کارشناس کنترل کیفیت');
  const [notes, setNotes] = useState(initialTestResult?.conclusionsAndNextSteps || '');

  // Parameter Values Map
  const [paramValues, setParamValues] = useState<Record<string, { value: number | string; unit?: string }>>(() => {
    const map: Record<string, { value: number | string; unit?: string }> = {};
    project.qcSpecifications.forEach((spec) => {
      const existing = initialTestResult?.measuredParameters?.[spec.parameterNameFa];
      if (existing !== undefined) {
        map[spec.parameterNameFa] = {
          value: existing.value,
          unit: existing.unit || spec.unit
        };
      } else {
        // default to target value if number or empty
        map[spec.parameterNameFa] = {
          value: spec.targetValue || '',
          unit: spec.unit
        };
      }
    });
    return map;
  });

  // 4 Pillars Audit Information
  const [instrumentAudit, setInstrumentAudit] = useState<LabInstrumentAuditInfo[]>(() => {
    if (initialTestResult?.instrumentAudit && initialTestResult.instrumentAudit.length > 0) {
      return initialTestResult.instrumentAudit;
    }
    return [
      {
        instrumentName: 'pH متر دیجیتال آزمایشگاهی رومیزی',
        instrumentModelOrTag: 'METTLER-TOLEDO-S220',
        lastCalibrationDate: '1402/10/12',
        calibrationDueDate: '1403/10/12',
        calibrationStatus: 'valid',
        calibrationSlopeOrFactor: 98.4,
        blankReading: 0.0,
        instrumentNotes: 'الکترود شیشه‌ای با محلول ۳ مولار KCl نگهداری شده است.'
      },
      {
        instrumentName: 'رفرکتومتر چشمی/دیجیتال دمایی',
        instrumentModelOrTag: 'ATAGO-PAL-1',
        lastCalibrationDate: '1402/11/01',
        calibrationDueDate: '1403/11/01',
        calibrationStatus: 'valid',
        calibrationSlopeOrFactor: 1.0,
        blankReading: 0.0,
        instrumentNotes: 'با آب مقطر دو بار تقطیر صفر شده است.'
      },
      {
        instrumentName: 'ترازوی تحلیلی ۴ رقم اعشار',
        instrumentModelOrTag: 'SARTORIUS-SEC-224',
        lastCalibrationDate: '1402/08/15',
        calibrationDueDate: '1403/08/15',
        calibrationStatus: 'valid',
        instrumentNotes: 'تراز حبابی و وزنه کالیبراسیون داخلی تایید شده است.'
      }
    ];
  });

  const [reagentAudit, setReagentAudit] = useState<LabReagentAuditInfo[]>(() => {
    if (initialTestResult?.reagentAudit && initialTestResult.reagentAudit.length > 0) {
      return initialTestResult.reagentAudit;
    }
    return [
      {
        reagentName: 'محلول سود ۰.۱ نرمال استاندارد (NaOH 0.1N)',
        lotOrBatchNumber: 'LOT-NAOH-2026-A',
        preparationDate: '1402/11/10',
        expiryDate: '1403/05/10',
        isExpired: false,
        factorOrTiterValue: 1.0015,
        factorLastStandardizedDate: '1402/12/01',
        storageConditionSatisfied: true,
        reagentNotes: 'در ظرف پلی‌اتیلنی مات در بسته با جذب‌کننده CO2'
      },
      {
        reagentName: 'بافرهای استاندارد کالیبراسیون pH 4.01 و 7.00',
        lotOrBatchNumber: 'BUF-MERCK-994',
        expiryDate: '1403/08/01',
        isExpired: false,
        storageConditionSatisfied: true
      }
    ];
  });

  const [sampleAudit, setSampleAudit] = useState<LabSampleAuditInfo>(() => {
    if (initialTestResult?.sampleAudit) {
      return initialTestResult.sampleAudit;
    }
    return {
      samplingDate: trialDate,
      sampleTemperatureC: 21.5,
      homogenizationMethod: 'هموژنایزر دور بالای آزمایشگاهی (Ultra-Turrax 8000 RPM)',
      sampleAliquotWeightG: 10.0,
      dilutionFactor: 1.0,
      moistureCondition: 'دمای محیط ۲۲ درجه سانتی‌گراد',
      preparationNotes: 'نمونه‌برداری از ۳ نقطه عمق، میانه و سطح ظرف صورت پذیرفته است.'
    };
  });

  // Current Generated Analysis Report State
  const [analysisReport, setAnalysisReport] = useState<IntelligentLabAnalysisReport | null>(
    initialTestResult?.intelligentAnalysis || null
  );

  // Run the Intelligent Analysis
  const handleExecuteAnalysis = () => {
    const input: LabAnalysisInput = {
      batchNumber,
      testDate: trialDate,
      operatorOrScientist: operator,
      measuredParameters: paramValues,
      qcSpecifications: project.qcSpecifications,
      historicalResults: project.testResults,
      instrumentAudit,
      reagentAudit,
      sampleAudit,
      standardReferences: project.standardReferences,
      productCategory: project.category
    };

    const report = analyzeIntelligentLabTest(input);
    setAnalysisReport(report);
    setActiveModalTab('analysis_report');
  };

  // Quick Demo Pre-fill for Error Diagnostic Testing
  const handleLoadDemoScenario = (scenario: 'impossible' | 'calibration_drift' | 'compliant') => {
    if (scenario === 'impossible') {
      setParamValues((prev) => ({
        ...prev,
        [project.qcSpecifications[0]?.parameterNameFa || 'رطوبت']: { value: 115.0, unit: '%' },
        [project.qcSpecifications[1]?.parameterNameFa || 'pH']: { value: 15.5, unit: 'pH' }
      }));
    } else if (scenario === 'calibration_drift') {
      setInstrumentAudit((prev) =>
        prev.map((inst) =>
          inst.instrumentName.includes('pH')
            ? {
                ...inst,
                calibrationStatus: 'expired',
                calibrationDueDate: '1402/10/01 (منقضی شده)',
                calibrationSlopeOrFactor: 88.0,
                blankReading: 0.14
              }
            : inst
        )
      );
      setReagentAudit((prev) =>
        prev.map((rg) =>
          rg.reagentName.includes('سود')
            ? { ...rg, isExpired: true, factorOrTiterValue: 0.88 }
            : rg
        )
      );
    } else {
      // Compliant reset
      const resetMap: Record<string, { value: number | string; unit?: string }> = {};
      project.qcSpecifications.forEach((spec) => {
        let val: number | string = spec.targetValue;
        if (spec.minAcceptableLimit !== undefined && spec.maxAcceptableLimit !== undefined) {
          val = ((Number(spec.minAcceptableLimit) + Number(spec.maxAcceptableLimit)) / 2).toFixed(2);
        }
        resetMap[spec.parameterNameFa] = { value: val, unit: spec.unit };
      });
      setParamValues(resetMap);
      setInstrumentAudit((prev) =>
        prev.map((inst) => ({
          ...inst,
          calibrationStatus: 'valid',
          calibrationSlopeOrFactor: 99.0,
          blankReading: 0.0
        }))
      );
      setReagentAudit((prev) =>
        prev.map((rg) => ({ ...rg, isExpired: false, factorOrTiterValue: 1.001 }))
      );
    }
  };

  // Save the Analyzed Result to the Project
  const handleSaveToProject = () => {
    if (!analysisReport) {
      handleExecuteAnalysis();
      return;
    }

    // Map conforms flag per parameter
    const measuredParametersMap: Record<string, { value: number | string; unit?: string; conforms: boolean }> = {};
    analysisReport.parameterDetails.forEach((p) => {
      measuredParametersMap[p.parameterNameFa] = {
        value: p.measuredValue,
        unit: p.unit,
        conforms: p.isCompliant
      };
    });

    const overallVerdict: 'passed' | 'marginal' | 'failed' | 'needs_reformulation' =
      analysisReport.overallStatus === 'compliant_normal'
        ? 'passed'
        : analysisReport.overallStatus === 'compliant_with_warning'
        ? 'marginal'
        : analysisReport.overallStatus === 'suspect_invalid'
        ? 'needs_reformulation'
        : 'failed';

    const newResult: TestResultEntry = {
      id: initialTestResult?.id || `tr_${Date.now()}`,
      trialDate,
      formulationVersionId: project.activeFormulationId || project.formulations[0]?.id || 'v1',
      batchNumber,
      scale: 'pilot',
      batchSizeKg,
      measuredParameters: measuredParametersMap,
      overallVerdict,
      operatorOrScientist: operator,
      conclusionsAndNextSteps: notes || analysisReport.summaryVerdictFa,
      intelligentAnalysis: analysisReport,
      instrumentAudit,
      reagentAudit,
      sampleAudit
    };

    onSaveAnalysisResult(newResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>سامانه هوشمند اعتبارسنجی و تحلیل نتایج آزمایشگاه (Lab QC Intelligence)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  Part 29 • ISO 17025
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                بررسی خطاهای چهارگانه (تجهیزات، کالیبراسیون، معرف و آماده‌سازی) با استناد به شواهد تجربی و حفظ اصالت داده اولیه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <button
            onClick={() => setActiveModalTab('input_audit')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeModalTab === 'input_audit'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>۱. ورود نتایج و لاگ شرایط ۴ گانه آزمون</span>
          </button>

          <button
            onClick={() => {
              if (!analysisReport) handleExecuteAnalysis();
              setActiveModalTab('analysis_report');
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeModalTab === 'analysis_report'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>۲. گزارش رسمی تحلیل کیفی، روندها و عیب‌یابی</span>
            {analysisReport && (
              <span className={`w-2 h-2 rounded-full ${analysisReport.overallStatus === 'compliant_normal' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            )}
          </button>

          {/* Quick Scenario Buttons */}
          <div className="mr-auto flex items-center gap-1.5 pb-2">
            <span className="text-[11px] text-stone-400 ml-1">سناریوهای شبیه‌سازی:</span>
            <button
              type="button"
              onClick={() => handleLoadDemoScenario('compliant')}
              className="text-[10px] px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
            >
              نرمال و منطبق
            </button>
            <button
              type="button"
              onClick={() => handleLoadDemoScenario('calibration_drift')}
              className="text-[10px] px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
            >
              انقضای کالیبراسیون و معرف
            </button>
            <button
              type="button"
              onClick={() => handleLoadDemoScenario('impossible')}
              className="text-[10px] px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300"
            >
              داده غیرممکن فیزیکی
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right" dir="rtl">
          
          {/* TAB 1: INPUT AND 4-PILLAR AUDIT */}
          {activeModalTab === 'input_audit' && (
            <div className="space-y-6">
              
              {/* Batch Metadata Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    شماره بچ یا لات تولیدی
                  </label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    تاریخ انجام آزمون
                  </label>
                  <input
                    type="date"
                    value={trialDate}
                    onChange={(e) => setTrialDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    وزن بچ تولیدی (کیلوگرم)
                  </label>
                  <input
                    type="number"
                    value={batchSizeKg}
                    onChange={(e) => setBatchSizeKg(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    کارشناس / شیمیدان آزمون‌گر
                  </label>
                  <input
                    type="text"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Measured Parameters Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>ورود مقادیر خوانده‌شده آزمایشگاهی در برابر حدود استاندارد (Measured Test Values)</span>
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    تعداد مشخصات کیفی فعال پروژه: {project.qcSpecifications.length} شاخص
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-stone-100/70 dark:bg-stone-800/70 text-stone-600 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-800">
                      <tr>
                        <th className="p-3">شاخص کیفی (Parameter)</th>
                        <th className="p-3">مقدار هدف / حد مجاز استاندارد</th>
                        <th className="p-3">مقدار اندازه‌گیری‌شده در آزمایشگاه</th>
                        <th className="p-3">واحد</th>
                        <th className="p-3">روش و مرجع استاندارد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900">
                      {project.qcSpecifications.map((spec) => {
                        const current = paramValues[spec.parameterNameFa] || { value: '', unit: spec.unit };
                        const limitText =
                          spec.minAcceptableLimit !== undefined && spec.maxAcceptableLimit !== undefined
                            ? `${spec.minAcceptableLimit} الی ${spec.maxAcceptableLimit}`
                            : spec.minAcceptableLimit !== undefined
                            ? `حداقل ${spec.minAcceptableLimit}`
                            : spec.maxAcceptableLimit !== undefined
                            ? `حداکثر ${spec.maxAcceptableLimit}`
                            : spec.targetValue;

                        return (
                          <tr key={spec.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                            <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                              {spec.parameterNameFa}
                              {spec.isCriticalForSafety && (
                                <span className="mr-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                  بحرانی (Critical)
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-stone-600 dark:text-stone-300 font-mono">
                              {limitText}
                            </td>

                            <td className="p-3">
                              <input
                                type="text"
                                value={current.value}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setParamValues((prev) => ({
                                    ...prev,
                                    [spec.parameterNameFa]: {
                                      ...prev[spec.parameterNameFa],
                                      value: val
                                    }
                                  }));
                                }}
                                placeholder={`مقدار ${spec.parameterNameFa}`}
                                className="w-32 px-2.5 py-1.5 font-mono text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </td>

                            <td className="p-3 text-stone-500 font-mono">
                              {spec.unit}
                            </td>

                            <td className="p-3 text-stone-500 text-[11px]">
                              {spec.standardReference || 'روش داخلی آزمایشگاه'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4 Pillars Lab Quality Verification Audit Checklists */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>چک‌لیست ارکان چهارگانه کیفیت آزمون (The 4 Pillars Audit for Evidence Tracking)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Pillar 1: Equipment */}
                  <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-blue-600" />
                        <span>رکن ۱: سلامت و پایداری دستگاه (Equipment)</span>
                      </span>
                      <span className="text-[10px] text-stone-400">۳ ابزار پایش‌شده</span>
                    </div>

                    <div className="space-y-2">
                      {instrumentAudit.map((inst, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-800 dark:text-stone-200">{inst.instrumentName}</span>
                            <select
                              value={inst.calibrationStatus}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setInstrumentAudit((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, calibrationStatus: val } : item))
                                );
                              }}
                              className="text-[10px] rounded-lg px-2 py-0.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                            >
                              <option value="valid">کالیبره معتبر</option>
                              <option value="due_soon">موعد نزدیک</option>
                              <option value="expired">منقضی شده</option>
                              <option value="not_calibrated">فاقد کالیبراسیون</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-stone-500">
                            {inst.calibrationSlopeOrFactor !== undefined && (
                              <span>شیب الکترود/فاکتور: {inst.calibrationSlopeOrFactor}٪</span>
                            )}
                            {inst.blankReading !== undefined && (
                              <span>خوانش بلانک: {inst.blankReading}</span>
                            )}
                            <span>سررسید: {inst.calibrationDueDate || 'نامشخص'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pillar 2 & 3: Reagents & Blank */}
                  <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <FlaskConical className="w-4 h-4 text-purple-600" />
                        <span>رکن ۲ و ۳: معرف‌ها، انقضا و فاکتور تیترانت (Reagents & Titer)</span>
                      </span>
                      <span className="text-[10px] text-stone-400">کنترل شیمیایی</span>
                    </div>

                    <div className="space-y-2">
                      {reagentAudit.map((rg, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-800 dark:text-stone-200">{rg.reagentName}</span>
                            <label className="flex items-center gap-1 text-[10px] text-stone-600 dark:text-stone-300">
                              <input
                                type="checkbox"
                                checked={rg.isExpired}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setReagentAudit((prev) =>
                                    prev.map((item, i) => (i === idx ? { ...item, isExpired: val } : item))
                                  );
                                }}
                                className="rounded text-red-600"
                              />
                              <span>منقضی شده؟</span>
                            </label>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-stone-500">
                            {rg.factorOrTiterValue !== undefined && (
                              <span>فاکتور نرمال: {rg.factorOrTiterValue}</span>
                            )}
                            <span>انقضا: {rg.expiryDate || 'جاری'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pillar 4: Sample Preparation */}
                  <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3 md:col-span-2">
                    <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-amber-600" />
                        <span>رکن ۴: شرایط نمونه‌برداری، دما و یکنواختی ماتریس (Sample Preparation)</span>
                      </span>
                      <span className="text-[10px] text-stone-400">کنترل فیزیکی</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-stone-600 dark:text-stone-400 mb-1">
                          دمای نمونه حین قرائت (°C)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={sampleAudit.sampleTemperatureC || 20}
                          onChange={(e) =>
                            setSampleAudit((prev) => ({ ...prev, sampleTemperatureC: Number(e.target.value) }))
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-600 dark:text-stone-400 mb-1">
                          روش هموژنیزاسیون
                        </label>
                        <input
                          type="text"
                          value={sampleAudit.homogenizationMethod || ''}
                          onChange={(e) =>
                            setSampleAudit((prev) => ({ ...prev, homogenizationMethod: e.target.value }))
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-600 dark:text-stone-400 mb-1">
                          یادداشت پیش‌آماده‌سازی
                        </label>
                        <input
                          type="text"
                          value={sampleAudit.preparationNotes || ''}
                          onChange={(e) =>
                            setSampleAudit((prev) => ({ ...prev, preparationNotes: e.target.value }))
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  انصراف
                </button>

                <button
                  type="button"
                  onClick={handleExecuteAnalysis}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>اجرای تحلیل هوشمند و اعتبارسنجی داده‌ها</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: COMPREHENSIVE INTELLIGENT ANALYSIS REPORT */}
          {activeModalTab === 'analysis_report' && analysisReport && (
            <div className="space-y-6">
              
              {/* Report Header Card */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  analysisReport.overallStatus === 'compliant_normal'
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : analysisReport.overallStatus === 'suspect_invalid'
                    ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20'
                    : 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        analysisReport.overallStatus === 'compliant_normal'
                          ? 'bg-emerald-600 text-white'
                          : analysisReport.overallStatus === 'suspect_invalid'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {analysisReport.overallStatus === 'compliant_normal' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : analysisReport.overallStatus === 'suspect_invalid' ? (
                        <AlertOctagon className="w-6 h-6" />
                      ) : (
                        <AlertTriangle className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {analysisReport.overallStatusFa}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 font-bold">
                          بچ: {analysisReport.batchNumber}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                        {analysisReport.summaryVerdictFa}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
                      <span className="block text-[10px] text-stone-500">نرخ انطباق مشخصات</span>
                      <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                        {analysisReport.complianceRatePercent}٪
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
                      <span className="block text-[10px] text-stone-500">داده‌های مشکوک</span>
                      <span className={`text-base font-black font-mono ${analysisReport.suspectDataPoints.length > 0 ? 'text-red-600' : 'text-stone-400'}`}>
                        {analysisReport.suspectDataPoints.length} مورد
                      </span>
                    </div>
                  </div>
                </div>

                {/* Non-Destructive Raw Data Preservation Guarantee */}
                <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{analysisReport.integrityGuaranteeStatementFa}</span>
                  </span>
                  <span className="font-mono text-[10px]">حالت: Read-Only Original Tracing</span>
                </div>
              </div>

              {/* 1. SECTION: SUSPECT DATA & ANOMALIES (داده‌های مشکوک) */}
              {analysisReport.suspectDataPoints.length > 0 && (
                <div className="p-5 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-950/10 space-y-3">
                  <h4 className="text-xs font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>داده‌های مشکوک و مغایرت‌های فیزیکوشیمیایی شناسایی‌شده (Suspicious Data Points)</span>
                  </h4>

                  <div className="space-y-2">
                    {analysisReport.suspectDataPoints.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-red-100 dark:border-red-950 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 dark:text-stone-100">{s.parameterNameFa}</span>
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold">
                              مقدار قرائت‌شده: {s.measuredValue} {s.unit}
                            </span>
                          </div>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200">
                            سطح هشدار: {s.severity === 'critical' ? 'بحرانی' : s.severity === 'high' ? 'بالا' : 'متوسط'}
                          </span>
                        </div>

                        <p className="text-stone-700 dark:text-stone-300 text-xs">
                          {s.explanationFa}
                        </p>

                        <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
                          <strong>شواهد تجربی و علمی:</strong> {s.empiricalEvidenceFa}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. SECTION: EVALUATION OF PARAMETERS & TRENDS (محاسبات و مقایسه با استاندارد) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>جدول جامع ارزیابی پارامترها و روند تاریخی بچ‌ها (Parameters & Historical Trends)</span>
                  </h4>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {analysisReport.trendSummaryFa}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-stone-100/70 dark:bg-stone-800/70 text-stone-600 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-800">
                      <tr>
                        <th className="p-3">پارامتر</th>
                        <th className="p-3">مقدار ثبت‌شده</th>
                        <th className="p-3">حد استاندارد</th>
                        <th className="p-3">وضعیت انطباق</th>
                        <th className="p-3">میانگین تاریخی (μ)</th>
                        <th className="p-3">انحراف نسبت به σ</th>
                        <th className="p-3">روند (Trend)</th>
                        <th className="p-3">استاندارد مرجع</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900">
                      {analysisReport.parameterDetails.map((p) => (
                        <tr key={p.parameterKey} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                          <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                            {p.parameterNameFa}
                          </td>

                          <td className="p-3 font-mono font-bold">
                            {p.measuredValue} {p.unit}
                          </td>

                          <td className="p-3 font-mono text-stone-600 dark:text-stone-400">
                            {p.standardLimitText}
                          </td>

                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                p.isCompliant
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              }`}
                            >
                              {p.statusTextFa}
                            </span>
                          </td>

                          <td className="p-3 font-mono text-stone-500">
                            {p.historicalMean !== undefined ? p.historicalMean.toFixed(2) : '-'}
                          </td>

                          <td className="p-3 font-mono text-stone-500">
                            {p.deviationFromMeanSigma !== undefined ? `${p.deviationFromMeanSigma > 0 ? '+' : ''}${p.deviationFromMeanSigma.toFixed(1)}σ` : '-'}
                          </td>

                          <td className="p-3 text-[11px]">
                            {p.historicalTrend === 'increasing' ? (
                              <span className="text-amber-600 dark:text-amber-400 font-bold">روند صعودی ↑</span>
                            ) : p.historicalTrend === 'decreasing' ? (
                              <span className="text-blue-600 dark:text-blue-400 font-bold">روند نزولی ↓</span>
                            ) : p.historicalTrend === 'stable' ? (
                              <span className="text-emerald-600">پایدار</span>
                            ) : (
                              <span className="text-stone-400">داده ناکافی</span>
                            )}
                          </td>

                          <td className="p-3 font-mono text-[10px] text-stone-500">
                            {p.standardsCited.join(', ') || 'مشخصات پروژه'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. SECTION: 4 PILLARS ROOT CAUSE HYPOTHESES & EVIDENCE (خطاهای احتمالی و شواهد) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-600" />
                  <span>تحلیل علل ریشه‌ای مبتنی بر شواهد و فرضیات غیرقطعی (Probable Cause Hypotheses & Evidence)</span>
                </h4>

                {analysisReport.probableErrorHypotheses.length === 0 ? (
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 text-xs text-stone-500 text-center">
                    هیچ نشانه‌ای از خطای سیستماتیک در دستگاه، کالیبراسیون، معرف یا آماده‌سازی نمونه یافت نشد.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysisReport.probableErrorHypotheses.map((hypo, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-2.5"
                      >
                        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            {hypo.pillarTitleFa}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              hypo.probabilityLevel === 'high_possibility'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                                : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                            }`}
                          >
                            احتمال وقوع: {hypo.probabilityLevel === 'high_possibility' ? 'احتمال بالا' : 'احتمال متوسط'}
                          </span>
                        </div>

                        {/* Evidence-Grounded Scientific Language */}
                        <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 text-xs text-purple-900 dark:text-purple-200 font-medium">
                          {hypo.hypothesisStatementFa}
                        </div>

                        {/* Evidences */}
                        <div className="space-y-1">
                          <span className="block text-[11px] font-bold text-stone-700 dark:text-stone-300">
                            شواهد و مستندات کشف‌شده (Evidence):
                          </span>
                          <ul className="list-disc list-inside text-xs text-stone-600 dark:text-stone-400 space-y-0.5">
                            {hypo.evidencesFound.map((ev, eIdx) => (
                              <li key={eIdx}>{ev}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Action */}
                        <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
                          <strong>پیشنهاد اقدام عملی:</strong> {hypo.suggestedActionFa}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. SECTION: SUGGESTIONS & CAPA (پیشنهاد بررسی) */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 space-y-2">
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>پیشنهادات بررسی و اقدامات اصلاحی و پیشگیرانه (CAPA & Review Recommendations)</span>
                </h4>
                <ul className="list-disc list-inside text-xs text-stone-700 dark:text-stone-300 space-y-1">
                  {analysisReport.investigationRecommendationsFa.map((rec, rIdx) => (
                    <li key={rIdx}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* 5. SECTION: SOURCE STANDARDS (منبع و رفرنس استاندارد) */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2">
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>مراجع، استانداردهای ملی و بین‌المللی استنادشده (Cited Source Standards)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {analysisReport.sourceStandards.map((std, sIdx) => (
                    <div key={sIdx} className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 text-xs">
                      <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200">
                        <span>{std.titleFa}</span>
                        <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">{std.standardCode}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">{std.relevanceNotesFa}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setActiveModalTab('input_audit')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>بازگشت به ویرایش داده‌ها</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExecuteAnalysis}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>محاسبه مجدد</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToProject}
                    className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>ذخیره رسمی نتایج در سوابق بچ پروژه</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
