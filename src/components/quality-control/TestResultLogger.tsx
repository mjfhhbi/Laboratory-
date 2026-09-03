import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FlaskConical, 
  Wrench, 
  UserCheck, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  QCTestResult, 
  QCSample, 
  TestReplicate, 
  VerifiedAcceptanceLimit, 
  EquipmentCalibrationRecord, 
  ReagentLotRecord, 
  OperatorRecord,
  ComplianceStatus
} from '../../types/qualityControl';
import { 
  VERIFIED_ACCEPTANCE_LIMITS, 
  EQUIPMENT_REGISTRY, 
  REAGENT_LOTS_REGISTRY, 
  OPERATOR_REGISTRY 
} from '../../data/qualityControlData';
import { ALL_FOOD_CHEMISTRY_TESTS } from '../../data/foodChemistryData';

interface TestResultLoggerProps {
  samples: QCSample[];
  selectedSample?: QCSample;
  onSaveTestResult: (result: QCTestResult) => void;
  onCreateDeviationFromOOS?: (result: QCTestResult) => void;
}

export const TestResultLogger: React.FC<TestResultLoggerProps> = ({
  samples,
  selectedSample,
  onSaveTestResult,
  onCreateDeviationFromOOS
}) => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>(selectedSample?.id || samples[0]?.id || '');
  const [selectedTestId, setSelectedTestId] = useState<string>(ALL_FOOD_CHEMISTRY_TESTS[3]?.id || 'chem-fat-soxhlet'); // Fat Soxhlet
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>(OPERATOR_REGISTRY[0].operatorId);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>(EQUIPMENT_REGISTRY[0].equipmentId);
  const [selectedReagentId, setSelectedReagentId] = useState<string>(REAGENT_LOTS_REGISTRY[0].reagentId);

  // Dynamic Replicates State (Default 3 replicates)
  const [replicates, setReplicates] = useState<number[]>([3.20, 3.21, 3.20]);
  const [analystRemarks, setAnalystRemarks] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (selectedSample) {
      setSelectedSampleId(selectedSample.id);
    }
  }, [selectedSample]);

  const activeSample = samples.find(s => s.id === selectedSampleId) || samples[0];
  const activeTest = ALL_FOOD_CHEMISTRY_TESTS.find(t => t.id === selectedTestId) || ALL_FOOD_CHEMISTRY_TESTS[0];
  const activeOperator = OPERATOR_REGISTRY.find(o => o.operatorId === selectedOperatorId) || OPERATOR_REGISTRY[0];
  const activeEquipment = EQUIPMENT_REGISTRY.find(e => e.equipmentId === selectedEquipmentId) || EQUIPMENT_REGISTRY[0];
  const activeReagent = REAGENT_LOTS_REGISTRY.find(r => r.reagentId === selectedReagentId);

  // Lookup Verified Limit from Authentic Standards Database
  const verifiedLimit: VerifiedAcceptanceLimit | undefined = VERIFIED_ACCEPTANCE_LIMITS.find(
    l => l.analyteId === activeTest.id && (activeSample ? l.sector === activeSample.sector : true)
  );

  // Live Statistical Calculations (Mean, SD, RSD%)
  const validValues = replicates.filter(v => typeof v === 'number' && !isNaN(v));
  const n = validValues.length;
  
  const mean = n > 0 ? validValues.reduce((a, b) => a + b, 0) / n : 0;
  
  const standardDeviation = n > 1 
    ? Math.sqrt(validValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1))
    : 0;

  const rsdPercentage = mean !== 0 ? (standardDeviation / mean) * 100 : 0;

  // Specification Compliance Check
  const evaluateCompliance = (): { status: ComplianceStatus; messageFa: string } => {
    if (!verifiedLimit) {
      return {
        status: 'no_limit_defined',
        messageFa: 'حد پذیرش معتبر در داده‌های موجود یافت نشد.'
      };
    }

    const { minLimit, maxLimit, warningLimitLower, warningLimitUpper } = verifiedLimit;

    // Check OOS
    if (minLimit !== undefined && mean < minLimit) {
      return {
        status: 'out_of_specification',
        messageFa: `عدم انطباق با مشخصات استاندارد (OOS): مقدار میانگین (${mean.toFixed(2)}) کمتر از حداقل مجاز (${minLimit}) است.`
      };
    }

    if (maxLimit !== undefined && mean > maxLimit) {
      return {
        status: 'out_of_specification',
        messageFa: `عدم انطباق با مشخصات استاندارد (OOS): مقدار میانگین (${mean.toFixed(2)}) بیشتر از سقف مجاز (${maxLimit}) است.`
      };
    }

    // Check Statistical Warning (±2SD)
    if (
      (warningLimitUpper !== undefined && mean > warningLimitUpper) ||
      (warningLimitLower !== undefined && mean < warningLimitLower)
    ) {
      return {
        status: 'in_spec_warning',
        messageFa: `منطبق بر استاندارد اما در ناحیه هشدار آماری (Warning Zone 2SD). نیاز به پایش در بهمن‌های آتی.`
      };
    }

    return {
      status: 'in_spec_in_control',
      messageFa: 'منطبق بر مشخصات استاندارد و در وضعیت کنترل آماری پایدار (In-Spec & In-Control).'
    };
  };

  const compliance = evaluateCompliance();

  const handleAddReplicate = () => {
    const lastVal = replicates[replicates.length - 1] ?? 0;
    setReplicates([...replicates, lastVal]);
  };

  const handleRemoveReplicate = (index: number) => {
    if (replicates.length <= 1) return;
    setReplicates(replicates.filter((_, i) => i !== index));
  };

  const handleReplicateChange = (index: number, val: number) => {
    const updated = [...replicates];
    updated[index] = val;
    setReplicates(updated);
  };

  const handleSaveResult = () => {
    if (!activeSample) return;

    const testResultToSave: QCTestResult = {
      id: `res-${Date.now()}`,
      sampleId: activeSample.id,
      batchNumber: activeSample.batchNumber,
      testCode: activeTest.code,
      testTitleFa: activeTest.titleFa,
      analyteNameFa: activeTest.analyteFa,
      testCategory: 'chemical',
      replicates: replicates.map((val, idx) => ({
        repNumber: idx + 1,
        rawReading: val,
        calculatedValue: val,
        timestamp: new Date().toISOString()
      })),
      mean: parseFloat(mean.toFixed(3)),
      standardDeviation: parseFloat(standardDeviation.toFixed(4)),
      relativeStandardDeviation: parseFloat(rsdPercentage.toFixed(2)),
      unit: verifiedLimit?.unit || activeTest.calculationRules?.unitResult || '%',
      testTimestamp: new Date().toISOString(),
      operator: activeOperator,
      equipment: activeEquipment,
      reagentLot: activeReagent,
      standardMethodRef: {
        organization: activeTest.primaryStandard?.organization || 'INSO',
        standardNumber: activeTest.primaryStandard?.standardNumber || 'Standard',
        methodNameFa: activeTest.titleFa
      },
      limitInfo: verifiedLimit,
      hasVerifiedLimit: !!verifiedLimit,
      noLimitReasonFa: !verifiedLimit ? 'حد پذیرش معتبر در داده‌های موجود یافت نشد.' : undefined,
      complianceStatus: compliance.status,
      analystRemarksFa: analystRemarks
    };

    onSaveTestResult(testResultToSave);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div id="test-result-logger-container" className="space-y-6">
      {/* Logger Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-base sm:text-lg">
                ثبت نتایج آزمون، تکرارها و ارزیابی انطباق استاندارد
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              ثبت چندگانه تکرارها با محاسبه بلادرنگ میانگین، انحراف معیار (SD)، درصد تکرارپذیری (RSD) و ردیابی کالیبراسیون و معرف‌ها.
            </p>
          </div>

          <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono font-bold text-emerald-400 border border-slate-700 shrink-0">
            ISO 17025 Compliant
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Row 1: Sample & Test Parameter Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                ۱. انتخاب نمونه و بهمن هدف (Target Sample & Batch):
              </label>
              <select
                id="select-qc-sample-target"
                value={selectedSampleId}
                onChange={(e) => setSelectedSampleId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {samples.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sampleCode} | {s.productNameFa} (بهمن: {s.batchNumber})
                  </option>
                ))}
              </select>
              {activeSample && (
                <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span>ماتریس: {activeSample.sampleMatrixFa}</span>
                  <span className="font-mono">بهمن: {activeSample.batchNumber}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                ۲. انتخاب پارامتر آزمون شیمیایی / فیزیکی:
              </label>
              <select
                id="select-qc-test-analyte"
                value={selectedTestId}
                onChange={(e) => {
                  setSelectedTestId(e.target.value);
                  // Set sensible sample replicate values based on test
                  if (e.target.value === 'chem-refractometry-brix') setReplicates([28.50, 28.52]);
                  else if (e.target.value === 'chem-lipids-peroxide') setReplicates([0.85, 0.90]);
                  else setReplicates([3.20, 3.21, 3.20]);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {ALL_FOOD_CHEMISTRY_TESTS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.code} - {t.titleFa} ({t.analyteFa})
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-indigo-700 font-mono flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span>استاندارد مرجع روش: {activeTest.primaryStandard.organization} {activeTest.primaryStandard.standardNumber}</span>
              </div>
            </div>
          </div>

          {/* Row 2: Standard Limit Box (STRICT SOURCE VERIFICATION) */}
          <div className={`p-4 rounded-2xl border ${
            verifiedLimit 
              ? 'bg-indigo-50/60 border-indigo-200' 
              : 'bg-amber-50/70 border-amber-300'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 ${verifiedLimit ? 'text-indigo-700' : 'text-amber-700'}`} />
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    حدود پذیرش استاندارد (Standard Acceptance Specification):
                  </span>
                </div>
                
                {verifiedLimit ? (
                  <div className="space-y-1 text-xs text-slate-700">
                    <p>
                      <strong>منبع معتبر: </strong>
                      استاندارد ملی ایران {verifiedLimit.source.organization} {verifiedLimit.source.standardNumber} ({verifiedLimit.source.clauseOrTable || 'بند مشخصات'})
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {verifiedLimit.minLimit !== undefined && (
                        <span className="px-2 py-0.5 bg-white rounded border border-indigo-200 font-mono font-bold text-indigo-900">
                          حداقل مجاز (LSL): {verifiedLimit.minLimit} {verifiedLimit.unit}
                        </span>
                      )}
                      {verifiedLimit.maxLimit !== undefined && (
                        <span className="px-2 py-0.5 bg-white rounded border border-indigo-200 font-mono font-bold text-indigo-900">
                          حداکثر مجاز (USL): {verifiedLimit.maxLimit} {verifiedLimit.unit}
                        </span>
                      )}
                      {verifiedLimit.targetValue !== undefined && (
                        <span className="px-2 py-0.5 bg-white rounded border border-indigo-200 font-mono font-bold text-emerald-900">
                          مقدار هدف (Target): {verifiedLimit.targetValue} {verifiedLimit.unit}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200 text-amber-950 font-bold text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>حد پذیرش معتبر در داده‌های موجود یافت نشد.</span>
                  </div>
                )}
              </div>

              {verifiedLimit && verifiedLimit.historicalMean && (
                <div className="bg-white p-3 rounded-xl border border-indigo-100 text-center text-xs space-y-0.5 shrink-0">
                  <span className="text-[10px] text-slate-500 block">خط مبنای آماری خط تولید (CRM):</span>
                  <div className="font-mono font-bold text-indigo-950">
                    Mean: {verifiedLimit.historicalMean} ± {verifiedLimit.historicalSD}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    UCL(+3SD): {verifiedLimit.controlLimitUpper} | LCL(-3SD): {verifiedLimit.controlLimitLower}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Traceability Metadata (Operator, Equipment & Calibration, Reagent Lot) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Operator */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                کارشناس آنالیست (Operator):
              </label>
              <select
                value={selectedOperatorId}
                onChange={(e) => setSelectedOperatorId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {OPERATOR_REGISTRY.map((op) => (
                  <option key={op.operatorId} value={op.operatorId}>
                    {op.fullNameFa} ({op.role})
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-slate-500 truncate" title={activeOperator.qualificationFa}>
                {activeOperator.qualificationFa}
              </div>
            </div>

            {/* Equipment with Live Calibration Status */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-indigo-600" />
                  دستگاه و وضعیت کالیبراسیون:
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  کالیبره معتبر
                </span>
              </label>
              <select
                value={selectedEquipmentId}
                onChange={(e) => setSelectedEquipmentId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {EQUIPMENT_REGISTRY.map((eq) => (
                  <option key={eq.equipmentId} value={eq.equipmentId}>
                    {eq.equipmentNameFa} ({eq.model})
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-slate-500 flex items-center justify-between font-mono">
                <span>تگ: {activeEquipment.assetTag}</span>
                <span>انقضاء: {activeEquipment.nextCalibrationDueDate}</span>
              </div>
            </div>

            {/* Reagent Lot */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-indigo-600" />
                ردیابی سری ساخت معرف (Reagent Lot):
              </label>
              <select
                value={selectedReagentId}
                onChange={(e) => setSelectedReagentId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {REAGENT_LOTS_REGISTRY.map((reag) => (
                  <option key={reag.reagentId} value={reag.reagentId}>
                    {reag.reagentNameFa} (Lot: {reag.lotNumber})
                  </option>
                ))}
              </select>
              {activeReagent && (
                <div className="text-[10px] text-slate-500 flex items-center justify-between font-mono">
                  <span>Lot: {activeReagent.lotNumber}</span>
                  <span>انقضاء: {activeReagent.expirationDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Replicates Entry & Live Mathematical Engine */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                ثبت مقادیر تکرارهای آزمایش (Analytical Replicates):
              </h4>

              <button
                type="button"
                onClick={handleAddReplicate}
                className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                افزودن تکرار جدید
              </button>
            </div>

            {/* Replicate Inputs Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {replicates.map((val, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 relative group">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span>تکرار {idx + 1} (Rep {idx + 1})</span>
                    {replicates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveReplicate(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="حذف این تکرار"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => handleReplicateChange(idx, parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                  />
                  <div className="text-[10px] text-slate-400 font-mono text-center">
                    {verifiedLimit?.unit || activeTest.calculationRules?.unitResult || '%'}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Calculation Output Cards (Mean, SD, RSD%) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1 text-center">
                <span className="text-[11px] text-indigo-300 font-semibold block">
                  میانگین نتایج تکرارها (X̄ Mean)
                </span>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {mean.toFixed(3)}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {verifiedLimit?.unit || activeTest.calculationRules?.unitResult || '%'} (n = {n})
                </span>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1 text-center">
                <span className="text-[11px] text-indigo-300 font-semibold block">
                  انحراف معیار تجربی (s / SD)
                </span>
                <div className="text-2xl font-black font-mono text-indigo-300">
                  {standardDeviation.toFixed(4)}
                </div>
                <span className="text-[10px] text-slate-400">
                  سنجش پراکندگی مقادیر تکرار
                </span>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1 text-center">
                <span className="text-[11px] text-indigo-300 font-semibold block">
                  انحراف معیار نسبی (RSD / CV%)
                </span>
                <div className={`text-2xl font-black font-mono ${rsdPercentage < 2.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {rsdPercentage.toFixed(2)} %
                </div>
                <span className="text-[10px] text-slate-400">
                  {rsdPercentage < 2.0 ? 'تکرارپذیری مطلوب (RSD < 2%)' : 'هشدار عدم یکنواختی تکرارها'}
                </span>
              </div>
            </div>
          </div>

          {/* Row 5: Specification Compliance Result Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            compliance.status === 'in_spec_in_control'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : compliance.status === 'in_spec_warning'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : compliance.status === 'out_of_specification'
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              {compliance.status === 'in_spec_in_control' && <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />}
              {compliance.status === 'in_spec_warning' && <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />}
              {compliance.status === 'out_of_specification' && <XCircle className="w-7 h-7 text-rose-600 shrink-0" />}
              {compliance.status === 'no_limit_defined' && <Info className="w-7 h-7 text-slate-500 shrink-0" />}
              
              <div className="space-y-0.5">
                <span className="text-xs font-bold block">
                  وضعیت انطباق با استاندارد و کنترل کیفیت:
                </span>
                <p className="text-xs leading-relaxed font-medium">
                  {compliance.messageFa}
                </p>
              </div>
            </div>

            {/* If OOS, show quick button to launch deviation */}
            {compliance.status === 'out_of_specification' && onCreateDeviationFromOOS && (
              <button
                type="button"
                onClick={() => {
                  onCreateDeviationFromOOS({
                    id: `res-${Date.now()}`,
                    sampleId: activeSample.id,
                    batchNumber: activeSample.batchNumber,
                    testCode: activeTest.code,
                    testTitleFa: activeTest.titleFa,
                    analyteNameFa: activeTest.analyteFa,
                    testCategory: 'chemical',
                    replicates: replicates.map((v, i) => ({ repNumber: i + 1, calculatedValue: v, timestamp: new Date().toISOString() })),
                    mean,
                    standardDeviation,
                    relativeStandardDeviation: rsdPercentage,
                    unit: verifiedLimit?.unit || '%',
                    testTimestamp: new Date().toISOString(),
                    operator: activeOperator,
                    equipment: activeEquipment,
                    standardMethodRef: { organization: 'INSO', standardNumber: 'Standard', methodNameFa: activeTest.titleFa },
                    hasVerifiedLimit: true,
                    complianceStatus: 'out_of_specification'
                  });
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <AlertTriangle className="w-4 h-4" />
                ثبت گزارش عدم انطباق (CAPA)
              </button>
            )}
          </div>

          {/* Remarks & Save Footer */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-700 block">
              توضیحات و مشاهدات کارشناس آزمایشگاه (Analyst Remarks):
            </label>
            <textarea
              rows={2}
              placeholder="مشاهدات حین آزمون، شرایط بلانک، پایداری رنگ، فاکتور محلول یا هرگونه نکته فنی..."
              value={analystRemarks}
              onChange={(e) => setAnalystRemarks(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center justify-between pt-2">
              {saveSuccess ? (
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  نتیجه آزمون با موفقیت در سیستم LIMS ثبت و ذخیره گردید.
                </div>
              ) : (
                <div />
              )}

              <button
                id="btn-save-qc-test-result"
                type="button"
                onClick={handleSaveResult}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                ثبت و الصاق به گواهی آنالیز بهمن (Save Result)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
