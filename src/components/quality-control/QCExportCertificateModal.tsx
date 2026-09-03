import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Layers,
  Sparkles,
  QrCode
} from 'lucide-react';
import { QCTestResult, QCProductionBatch, QCSample } from '../../types/qualityControl';

interface QCExportCertificateModalProps {
  batch: QCProductionBatch;
  sample?: QCSample;
  results: QCTestResult[];
  isOpen: boolean;
  onClose: () => void;
}

export const QCExportCertificateModal: React.FC<QCExportCertificateModalProps> = ({
  batch,
  sample,
  results,
  isOpen,
  onClose
}) => {
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen) return null;

  const certificateNumber = batch.qaReleaseSignoff?.certificateNumber || `COA-${batch.batchNumber}-${Date.now().toString().slice(-4)}`;

  const exportData = {
    certificateNumber,
    issueDate: new Date().toISOString(),
    standardAuthority: 'سازمان ملی استاندارد ایران (INSO) / ISO 17025 Certified Laboratory',
    batchDetails: {
      batchNumber: batch.batchNumber,
      productName: batch.productNameFa,
      productionDate: batch.productionDate,
      expirationDate: batch.expirationDate,
      batchSize: `${batch.batchSize} ${batch.batchUnit}`,
      productionLine: batch.productionLine,
      shift: batch.shift,
      qaReleaseStatus: batch.status
    },
    sampleDetails: sample ? {
      sampleCode: sample.sampleCode,
      samplingDate: sample.samplingDateTime,
      location: sample.samplingLocationFa,
      sampler: sample.samplerNameFa,
      matrix: sample.sampleMatrixFa,
      storage: sample.storageConditionFa
    } : null,
    testResults: results.map(r => ({
      testCode: r.testCode,
      testTitle: r.testTitleFa,
      analyte: r.analyteNameFa,
      replicatesCount: r.replicates.length,
      meanValue: r.mean,
      standardDeviation: r.standardDeviation,
      rsdPercentage: r.relativeStandardDeviation,
      unit: r.unit,
      standardSpecification: r.limitInfo ? {
        standardNumber: `${r.limitInfo.source.organization} ${r.limitInfo.source.standardNumber}`,
        clause: r.limitInfo.source.clauseOrTable,
        min: r.limitInfo.minLimit,
        max: r.limitInfo.maxLimit,
        target: r.limitInfo.targetValue
      } : 'حد پذیرش معتبر در داده‌های موجود یافت نشد.',
      compliance: r.complianceStatus,
      operator: r.operator.fullNameFa,
      equipment: `${r.equipment.equipmentNameFa} (${r.equipment.model})`,
      calibrationCert: r.equipment.calibrationCertificateNo,
      reagentLot: r.reagentLot?.lotNumber || 'N/A'
    })),
    qaSignoff: {
      qaManager: batch.qaReleaseSignoff?.qaManagerName || 'دکتر مریم مهدوی (مدیر تضمین کیفیت)',
      decision: batch.status === 'released' ? 'تایید و ترخیص بهمن (Approved & Released)' : 'در قرنطینه آزمایشگاهی (Quarantine)',
      decisionDate: batch.qaReleaseSignoff?.decisionDate || new Date().toISOString().slice(0, 10),
      comments: batch.qaReleaseSignoff?.commentsFa || 'تمامی آزمون‌های فیزیکوشیمیایی و کنترل کیفیت طبق استاندارد معتبر انجام گردید.'
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `COA_${batch.batchNumber}_QC_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadCsv = () => {
    const csvRows = [
      ['Test Code', 'Test Title', 'Analyte', 'Mean', 'Unit', 'SD', 'RSD %', 'Standard Ref', 'Min Limit', 'Max Limit', 'Compliance', 'Operator', 'Equipment', 'Reagent Lot'].join(','),
      ...results.map(r => [
        `"${r.testCode}"`,
        `"${r.testTitleFa}"`,
        `"${r.analyteNameFa}"`,
        r.mean,
        `"${r.unit}"`,
        r.standardDeviation,
        r.relativeStandardDeviation,
        r.limitInfo ? `"${r.limitInfo.source.organization} ${r.limitInfo.source.standardNumber}"` : '"No Limit Defined"',
        r.limitInfo?.minLimit ?? '',
        r.limitInfo?.maxLimit ?? '',
        `"${r.complianceStatus}"`,
        `"${r.operator.fullNameFa}"`,
        `"${r.equipment.model}"`,
        `"${r.reagentLot?.lotNumber || ''}"`
      ].join(','))
    ];

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvRows.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `COA_${batch.batchNumber}_Results.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base">
              گواهی رسمی آنالیز بهمن و سرتیفیکیت کیفیت (Certificate of Analysis - CoA)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'کپی شد!' : 'کپی JSON'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود JSON</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>دانلود CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>چاپ گواهی (Print)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable / Displayable Certificate Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-50 text-slate-900 text-xs">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Header of CoA */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div className="space-y-1">
                <div className="text-base sm:text-lg font-black text-slate-900">
                  آزمایشگاه تخصصی کنترل کیفیت و صنایع غذایی
                </div>
                <div className="text-xs text-slate-600 font-bold">
                  دارای تاییدیه صلاحیت استاندارد ملی ISO/IEC 17025
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Food Quality Control & Analytical Laboratory
                </div>
              </div>

              <div className="text-left font-mono text-xs space-y-1">
                <div className="font-bold text-indigo-700 text-sm">COA No: {certificateNumber}</div>
                <div className="text-slate-500">Date: {new Date().toISOString().slice(0, 10)}</div>
                <div className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full text-center">
                  CERTIFIED & VALIDATED
                </div>
              </div>
            </div>

            {/* Batch & Product Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">نام فرآورده غذایی:</span>
                <span className="font-bold text-slate-900">{batch.productNameFa}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">شماره بهمن (Batch No):</span>
                <span className="font-mono font-bold text-indigo-900">{batch.batchNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">تاریخ تولید و انقضاء:</span>
                <span className="font-mono text-slate-800">{batch.productionDate} / {batch.expirationDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">اندازه بهمن / خط تولید:</span>
                <span className="font-mono text-slate-800">{batch.batchSize} {batch.batchUnit} ({batch.productionLine})</span>
              </div>
            </div>

            {/* Results Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                نتایج آزمون‌های فیزیکوشیمیایی و کنترل کیفی (Analytical Test Results):
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-y border-slate-300 font-bold text-slate-800">
                      <th className="py-2.5 px-3">عنوان آزمون / آنالیت</th>
                      <th className="py-2.5 px-3">روش و استاندارد مرجع</th>
                      <th className="py-2.5 px-3">تعداد تکرار</th>
                      <th className="py-2.5 px-3 text-center">نتیجه میانگین (X̄)</th>
                      <th className="py-2.5 px-3 text-center">SD / RSD%</th>
                      <th className="py-2.5 px-3 text-center">محدوده مجاز استاندارد</th>
                      <th className="py-2.5 px-3 text-center">وضعیت انطباق</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {results.length > 0 ? (
                      results.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 font-bold text-slate-900">
                            <div>{r.analyteNameFa}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{r.testCode}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                            {r.standardMethodRef.organization} {r.standardMethodRef.standardNumber}
                          </td>
                          <td className="py-3 px-3 font-mono text-center text-slate-700">
                            {r.replicates.length}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-center text-indigo-900 text-sm">
                            {r.mean.toFixed(2)} {r.unit}
                          </td>
                          <td className="py-3 px-3 font-mono text-center text-slate-600 text-[11px]">
                            <div>SD: {r.standardDeviation.toFixed(3)}</div>
                            <div>RSD: {r.relativeStandardDeviation.toFixed(2)}%</div>
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-xs">
                            {r.limitInfo ? (
                              <div>
                                {r.limitInfo.minLimit !== undefined && `Min: ${r.limitInfo.minLimit} `}
                                {r.limitInfo.maxLimit !== undefined && `Max: ${r.limitInfo.maxLimit} `}
                                {r.limitInfo.unit}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[10px] font-sans">
                                حد پذیرش معتبر در داده‌های موجود یافت نشد.
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {r.complianceStatus === 'in_spec_in_control' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                منطبق (Pass)
                              </span>
                            )}
                            {r.complianceStatus === 'in_spec_warning' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                هشدار ۲SD
                              </span>
                            )}
                            {r.complianceStatus === 'out_of_specification' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                مردود (OOS)
                              </span>
                            )}
                            {r.complianceStatus === 'no_limit_defined' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                بدون حد مصوب
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-400">
                          نتیجه آزمونی برای این بهمن ثبت نشده است.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Traceability Footer with Sign-off */}
            <div className="border-t-2 border-slate-200 pt-6 grid grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">تاییدیه کارشناس آنالیست:</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">{results[0]?.operator.fullNameFa || 'مهندس سارا رستمی'}</div>
                  <div className="text-[11px] text-slate-500">{results[0]?.operator.qualificationFa}</div>
                  <div className="text-[10px] font-mono text-slate-400">امضای دیجیتال ثبت‌شده در سامانه</div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">تصویب و ترخیص مدیر تضمین کیفیت (QA Release):</span>
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-950">{batch.qaReleaseSignoff?.qaManagerName || 'دکتر مریم مهدوی'}</div>
                  <div className="text-[11px] text-emerald-900">مدیر تضمین کیفیت و سرممیز ISO 17025</div>
                  <div className="text-[10px] text-emerald-800 leading-relaxed pt-1">
                    {batch.qaReleaseSignoff?.commentsFa || 'کلیه نتایج آزمون در انطباق با استاندارد ملی مربوطه ارزیابی و ترخیص گردید.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
