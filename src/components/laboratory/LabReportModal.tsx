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

          {/* Replicates Results Table */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 border-b border-stone-200 dark:border-stone-800 pb-1">
              ۱. مقادیر اندازه‌گیری‌شده در تکرارهای آزمون
            </h3>
            <table className="w-full text-xs text-right border border-stone-200 dark:border-stone-800 border-collapse">
              <thead>
                <tr className="bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-800">
                  <th className="p-2">پارامتر / شاخص</th>
                  <th className="p-2 text-center">واحد</th>
                  {session.replicates.map((r) => (
                    <th key={r.replicateNumber} className="p-2 text-center">{r.title}</th>
                  ))}
                  <th className="p-2 text-center">میانگین</th>
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
                      <td className="p-2 font-medium">{p.nameFa}</td>
                      <td className="p-2 text-center font-mono text-stone-500">{p.expectedUnit || '-'}</td>
                      {values.map((v, i) => (
                        <td key={i} className="p-2 text-center font-mono">
                          {typeof v === 'boolean' ? (v ? 'مثبت' : 'منفی') : String(v || '-')}
                        </td>
                      ))}
                      <td className="p-2 text-center font-mono font-bold">{mean}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Repeatability and Statistics */}
          {stats && stats.validReplicatesCount > 0 && (
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 border-b border-stone-200 dark:border-stone-800 pb-1">
                ۲. ارزیابی تکرارپذیری و شاخص‌های آماری
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-stone-50 dark:bg-stone-850 rounded-lg border border-stone-200 dark:border-stone-800">
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

          {/* Standard Conformance Box */}
          {conformance && (
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 border-b border-stone-200 dark:border-stone-800 pb-1">
                ۳. انطباق با حدود مجاز استاندارد مرجع
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
                    {conformance.isCompliant ? 'نتیجه نهایی: منطبق با استاندارد مرجع' : 'نتیجه نهایی: عدم انطباق با حدود استاندارد'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mt-1">
                  {conformance.detailsFa}
                </p>
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="border-t border-stone-300 dark:border-stone-700 pt-2">
              <span className="text-stone-500 block mb-1">امضای کارشناس آزمایشگاه:</span>
              <strong className="block font-bold">{session.operatorName}</strong>
            </div>
            <div className="border-t border-stone-300 dark:border-stone-700 pt-2">
              <span className="text-stone-500 block mb-1">تأیید مدیر کنترل کیفیت / مسئول فنی:</span>
              <strong className="block font-bold">{session.supervisorName || 'مسئول آزمایشگاه'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
