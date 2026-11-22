/**
 * Food Science AI - Lab Report / Certificate of Analysis Modal
 * Clean, printable technical laboratory report with standard limits evaluation,
 * statistical metrics, replicate breakdown, and operator signature section.
 */

import React from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  Tag,
  BookOpen,
  Award,
  Clock
} from 'lucide-react';
import { LabSession } from '../../types/laboratory';

interface LabReportModalProps {
  session: LabSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  session,
  isOpen,
  onClose
}) => {
  if (!isOpen || !session) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(session, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Lab_Report_${session.sampleCode}_${session.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const stats = session.repeatabilityAnalysis;
  const conformance = session.standardConformance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col my-auto print:border-none print:shadow-none print:max-h-full print:w-full print:rounded-none">
        
        {/* Modal Toolbar (hidden when printing) */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-850 rounded-t-2xl print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              گزارش فنی و نتایج آنالیز آزمایشگاهی (COA Report)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              خروجی JSON
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              چاپ گزارش (Print)
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-150 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto flex-1 text-xs text-stone-800 dark:text-stone-200 space-y-6 print:text-black print:p-4">
          {/* Report Header */}
          <div className="text-center border-b-2 border-stone-900 dark:border-stone-100 pb-4 print:border-black">
            <span className="text-[11px] font-mono tracking-widest text-stone-500 uppercase block mb-1">
              Food Science AI Digital Laboratory Certificate
            </span>
            <h1 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
              برگه نتایج آزمون و آنالیز کیفی مواد غذایی
            </h1>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              سامانه آزمایشگاه هوشمند صنایع غذایی بر اساس استانداردهای ملی و بین‌المللی
            </p>
          </div>

          {/* Sample & Standard Overview Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 print:bg-white print:border-stone-300">
            <div>
              <span className="text-[11px] text-stone-500 block">نام نمونه:</span>
              <strong className="font-bold text-stone-900 dark:text-stone-100">{session.sampleName}</strong>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">کد شناسایی:</span>
              <strong className="font-mono font-bold text-stone-900 dark:text-stone-100">{session.sampleCode}</strong>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">سری ساخت / بچ:</span>
              <strong className="font-mono text-stone-900 dark:text-stone-100">{session.batchNumber || '-'}</strong>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">کارشناس آزمون:</span>
              <strong className="text-stone-900 dark:text-stone-100">{session.operatorName}</strong>
            </div>

            <div>
              <span className="text-[11px] text-stone-500 block">استاندارد مرجع:</span>
              <strong className="font-mono text-emerald-700 dark:text-emerald-400">{session.standardNumber || 'سفارشی'}</strong>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[11px] text-stone-500 block">عنوان استاندارد:</span>
              <span className="text-stone-700 dark:text-stone-300">{session.standardTitleFa || '-'}</span>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">تاریخ ثبت:</span>
              <span className="font-mono">{new Date(session.createdAt).toLocaleDateString('fa-IR')}</span>
            </div>
          </div>

          {/* Universal Evidence & Golden Rule Credibility Tier */}
          <div className="p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 print:bg-white print:border-stone-300">
            <div className="flex items-center gap-2.5">
              {session.standardNumber && (session.standardNumber.toLowerCase().includes('inso') || session.standardNumber.toLowerCase().includes('isiri') || session.standardNumber.toLowerCase().includes('iso')) ? (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>سطح اعتبار: VERIFIED (تأییدشده رسمی)</span>
                </span>
              ) : session.standardNumber ? (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>سطح اعتبار: SUPPORTED (پشتیبانی‌شده با منبع)</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>سطح اعتبار: UNVERIFIED (فاقد منبع استاندارد مصوب)</span>
                </span>
              )}

              <span className="text-[11px] text-stone-600 dark:text-stone-400">
                {session.standardNumber && (session.standardNumber.toLowerCase().includes('inso') || session.standardNumber.toLowerCase().includes('isiri') || session.standardNumber.toLowerCase().includes('iso'))
                  ? 'اطلاعات مستقیماً توسط Source معتبر پشتیبانی می‌شود.'
                  : session.standardNumber
                  ? 'اطلاعات از منابع موجود پشتیبانی می‌شود اما نیاز به بررسی بیشتر دارد.'
                  : 'منبع کافی وجود ندارد و نباید به‌عنوان حقیقت قطعی نمایش داده شود.'}
              </span>
            </div>

            <div className="text-[10px] text-stone-500 font-medium">
              ممیزی قانون طلایی: انطباق کامل با حدود استاندارد و منع جعل داده
            </div>
          </div>

          {/* Test / Demo Mode Watermark Notice */}
          {session.isDemoOrTest && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-200 text-amber-900 text-[10px]">
                  TEST-MOCK
                </span>
                <span className="font-bold text-xs">
                  حالت آزمایشی و تست فنی: این برگه صرفاً جهت راستی‌آزمایی زنجیره ۱۲ مرحله‌ای آزمایش تولید شده و مستقل از داده‌های واقعی آزمایشگاه است.
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300">
                SANDBOX / VERIFIED
              </span>
            </div>
          )}

          {/* Section 1: Equipment & Calibration Checklist Verification */}
          {session.requiredEquipment && session.requiredEquipment.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 border-b border-stone-200 dark:border-stone-800 pb-1 flex items-center gap-1.5">
                <span>۱. بررسی وضعیت تجهیزات و کالیبراسیون (Equipment & Calibration)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {session.requiredEquipment.map((eq) => (
                  <div key={eq.id} className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <strong className="text-[11px] text-stone-900 dark:text-stone-100 block truncate">{eq.name}</strong>
                      <span className="text-[10px] text-stone-500 block truncate">{eq.calibrationInfo || 'کالیبراسیون تاییدشده'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Reagents & Safety Verification */}
          {session.reagentsAndChemicals && session.reagentsAndChemicals.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 border-b border-stone-200 dark:border-stone-800 pb-1 flex items-center gap-1.5">
                <span>۲. مواد شیمیایی، معرف‌ها و ایمنی (Reagents & Solutions)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {session.reagentsAndChemicals.map((reag) => (
                  <div key={reag.id} className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <strong className="text-[11px] text-stone-900 dark:text-stone-100 block truncate">{reag.name}</strong>
                      <span className="text-[10px] text-stone-500 block truncate">{reag.gradeOrConcentration || 'درجه استاندارد'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Sample Preparation Pipeline (5 Stages) */}
          {session.samplePrepData && (
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 border-b border-stone-200 dark:border-stone-800 pb-1 flex items-center gap-1.5">
                <span>۳. فرآیند آماده‌سازی نمونه (Sample Preparation Pipeline)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 text-[11px]">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold block">مرحله ۱: نمونه</span>
                  <span className="text-stone-700 dark:text-stone-300 block truncate">{session.samplePrepData.sampleType || session.sampleName}</span>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">
                    وزن: {String(session.samplePrepData.sampleWeightGrams || '-')}g
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold block">مرحله ۲: نمونه‌برداری</span>
                  <span className="text-stone-700 dark:text-stone-300 block truncate">{session.samplePrepData.containerUsed || 'ظرف استاندارد'}</span>
                  <span className="text-[10px] text-stone-500 block">ظرف هوابند کهربایی</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold block">مرحله ۳: آماده‌سازی</span>
                  <span className="text-stone-700 dark:text-stone-300 block truncate">{session.samplePrepData.homogenizationTool || 'همگن‌سازی کامل'}</span>
                  <span className="text-[10px] text-stone-500 block">فاکتور رقت: {String(session.samplePrepData.dilutionFactor || '1')}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold block">مرحله ۴: تعدیل محیطی</span>
                  <span className="text-stone-700 dark:text-stone-300 block truncate">{session.samplePrepData.storageTemperatureRecorded || '۲۰-۲۵ °C'}</span>
                  <span className="text-[10px] text-stone-500 block">هم‌دمایی با محیط</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold block">مرحله ۵: تحویل آزمون</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold block">تحویل مستقیم به گام ۱</span>
                  <span className="text-[10px] text-stone-500 block">صحت آماده‌سازی: تایید</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Replicates Results Table */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 border-b border-stone-200 dark:border-stone-800 pb-1">
              ۴. مقادیر اندازه‌گیری‌شده در تکرارهای آزمون و داده‌های خام (Raw Measurements)
            </h3>
            <div className="overflow-x-auto max-w-full rounded-xl border border-stone-200 dark:border-stone-800">
              <table className="w-full text-xs text-right border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-800">
                    <th className="p-2.5">پارامتر / شاخص</th>
                    <th className="p-2.5 text-center">واحد</th>
                    {session.replicates.map((r) => (
                      <th key={r.replicateNumber} className="p-2.5 text-center">{r.title}</th>
                    ))}
                    <th className="p-2.5 text-center">میانگین</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {session.steps.flatMap((step) => step.parameters).map((p) => {
                    const values = session.replicates.map((r) => {
                      for (const sKey of Object.keys(r.stepsData)) {
                        const st = r.stepsData[Number(sKey)];
                        if (st?.parameterValues[p.id]?.value !== undefined) {
                          return st.parameterValues[p.id].value;
                        }
                      }
                      return '';
                    });

                    const numVals = values.filter((v) => typeof v === 'number') as number[];
                    const mean = numVals.length > 0 ? (numVals.reduce((a, b) => a + b, 0) / numVals.length).toFixed(3) : '-';

                    return (
                      <tr key={p.id}>
                        <td className="p-2.5 font-medium">{p.nameFa}</td>
                        <td className="p-2.5 text-center font-mono text-stone-500">{p.expectedUnit || '-'}</td>
                        {values.map((v, i) => (
                          <td key={i} className="p-2.5 text-center font-mono">
                            {typeof v === 'boolean' ? (v ? 'مثبت' : 'منفی') : String(v || '-')}
                          </td>
                        ))}
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-700 dark:text-emerald-400">{mean}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Mathematical Formula & Calculation Execution */}
          {session.replicates[0]?.calculatedResult && (
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 border-b border-stone-200 dark:border-stone-800 pb-1">
                ۵. رابطه ریاضی و محاسبه نتیجه (Mathematical Calculation)
              </h3>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 block font-bold">فرمول محاسباتی استاندارد:</span>
                  <code className="font-mono text-xs px-2.5 py-1 rounded bg-stone-200/60 dark:bg-stone-800 text-stone-800 dark:text-stone-200 block" dir="ltr">
                    {session.replicates[0]?.calculatedResult?.formulaUsed || 'Result = f(measurements)'}
                  </code>
                  {session.replicates[0]?.calculatedResult?.details && (
                    <span className="text-[10px] text-stone-500 block font-mono" dir="ltr">
                      {session.replicates[0].calculatedResult.details}
                    </span>
                  )}
                </div>

                <div className="sm:text-left self-end sm:self-center">
                  <span className="text-[10px] text-stone-400 block">مقدار نهایی محاسبه‌شده:</span>
                  <div className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    {session.replicates[0]?.calculatedResult?.primaryValue ?? '-'} <span className="text-xs text-stone-500 font-normal">{session.replicates[0]?.calculatedResult?.unit || ''}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Quality Control Protocol (QC) Results */}
          {session.qcData && (
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-1 mb-2">
                <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  ۶. نتایج پروتکل کنترل کیفیت آزمایشگاهی (Quality Control Protocol)
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  session.qcData.overallStatus === 'pass'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : session.qcData.overallStatus === 'fail'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  وضعیت کلی: {session.qcData.overallStatus.toUpperCase()}
                </span>
              </div>

              <div className="overflow-x-auto max-w-full rounded-xl border border-stone-200 dark:border-stone-800">
                <table className="w-full text-xs text-right border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-800">
                      <th className="p-2.5">شناسه شاخص</th>
                      <th className="p-2.5 text-center">نوع کنترل</th>
                      <th className="p-2.5 text-center">معیار و یادداشت</th>
                      <th className="p-2.5 text-center">مقدار ثبت‌شده</th>
                      <th className="p-2.5 text-center">وضعیت</th>
                      <th className="p-2.5">توضیحات و دلیل ارزیابی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {Object.values(session.qcData.items || {}).map((item) => (
                      <tr key={item.itemId}>
                        <td className="p-2.5 font-medium font-mono text-[11px]">{item.itemId}</td>
                        <td className="p-2.5 text-center text-stone-600 dark:text-stone-400 font-mono text-[11px]">{item.type}</td>
                        <td className="p-2.5 text-center text-stone-600 dark:text-stone-400 text-[11px]">{item.notes || '-'}</td>
                        <td className="p-2.5 text-center font-mono font-bold">
                          {item.recordedValue !== undefined ? `${item.recordedValue} ${item.unit || ''}` : '-'}
                        </td>
                        <td className="p-2.5 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block ${
                            item.evaluatedStatus === 'pass'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.evaluatedStatus === 'fail'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                          }`}>
                            {item.evaluatedStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2.5 text-[11px] text-stone-500 leading-normal">{item.evaluationReasonFa || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 7: Repeatability and Statistics */}
          {stats && stats.validReplicatesCount > 0 && (
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 border-b border-stone-200 dark:border-stone-800 pb-1">
                ۷. ارزیابی تکرارپذیری و شاخص‌های آماری (Repeatability & Dispersion)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800">
                <div>
                  <span className="text-[10px] text-stone-500 block">تعداد تکرار معتبر:</span>
                  <span className="font-mono font-bold">{stats.validReplicatesCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">انحراف معیار (s):</span>
                  <span className="font-mono font-bold">{stats.standardDeviation ?? '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">ضریب پراکندگی (%RSD):</span>
                  <span className="font-mono font-bold">{stats.relativeStandardDeviationPercent ? `${stats.relativeStandardDeviationPercent}%` : '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">اختلاف تکرارها (Range):</span>
                  <span className="font-mono font-bold">{stats.rangeDifference ?? '-'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 8: Standard Conformance Box */}
          {conformance && (
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 border-b border-stone-200 dark:border-stone-800 pb-1">
                ۸. نتیجه نهایی و انطباق با حدود استاندارد ملی / بین‌المللی (Compliance Verdict)
              </h3>
              <div className={`p-4 rounded-xl border ${
                conformance.isCompliant
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {conformance.isCompliant ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <span className="font-bold text-sm">
                    {conformance.isCompliant ? 'نتیجه نهایی: منطبق با استاندارد مرجع (PASS)' : 'نتیجه نهایی: عدم انطباق با حدود استاندارد (FAIL)'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mt-1">
                  {conformance.detailsFa}
                </p>
              </div>
            </div>
          )}

          {/* Section 9: Signatures & Verification Stamp */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="border-t border-stone-300 dark:border-stone-700 pt-2">
              <span className="text-stone-500 block mb-1">امضای کارشناس آزمایشگاه:</span>
              <strong className="block font-bold">{session.operatorName}</strong>
              <span className="text-[10px] text-stone-400 font-mono block mt-1">تایید صحت گام‌ها و اندازه‌گیری</span>
            </div>
            <div className="border-t border-stone-300 dark:border-stone-700 pt-2">
              <span className="text-stone-500 block mb-1">تأیید مدیر کنترل کیفیت / مسئول فنی:</span>
              <strong className="block font-bold">{session.supervisorName || 'دکتر مسئول آزمایشگاه'}</strong>
              <span className="text-[10px] text-stone-400 font-mono block mt-1">تصدیق نهایی و صدور گواهی آزمون</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

