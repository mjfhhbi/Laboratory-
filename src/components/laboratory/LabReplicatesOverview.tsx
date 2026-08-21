/**
 * Food Science AI - Lab Replicates Overview & Repeatability Matrix
 * Evaluates statistics across replicates (Mean, Std Dev, RSD%, Difference)
 * and assesses compliance against Standard Acceptable Limits.
 */

import React from 'react';
import {
  Calculator,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Scale,
  TrendingUp
} from 'lucide-react';
import { LabSession } from '../../types/laboratory';

interface LabReplicatesOverviewProps {
  session: LabSession;
  onSelectReplicate: (replicateNumber: number) => void;
}

export const LabReplicatesOverview: React.FC<LabReplicatesOverviewProps> = ({
  session,
  onSelectReplicate
}) => {
  const stats = session.repeatabilityAnalysis;
  const conformance = session.standardConformance;

  // Extract list of all defined parameters in the session steps
  const allParams = session.steps.flatMap((step) =>
    step.parameters.map((p) => ({ ...p, stepNumber: step.stepNumber }))
  );

  return (
    <div className="space-y-6">
      {/* 1. Replicates Matrix Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-stone-50/80 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              ماتریس مقادیر تکرارهای آزمون ({session.replicates.length} تکرار)
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            مقایسه نتایج تکرارها جهت اعتبارسنجی تکرارپذیری
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400">
                <th className="py-2.5 px-4 font-semibold">شاخص / پارامتر آزمون</th>
                <th className="py-2.5 px-3 font-semibold text-center">واحد</th>
                {session.replicates.map((rep) => (
                  <th key={rep.replicateNumber} className="py-2.5 px-4 font-semibold text-center">
                    <button
                      type="button"
                      onClick={() => onSelectReplicate(rep.replicateNumber)}
                      className={`hover:underline font-bold ${
                        rep.replicateNumber === session.currentReplicateNumber
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {rep.title}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {allParams.map((param) => (
                <tr key={param.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-850/60 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-stone-900 dark:text-stone-100">
                    <div className="flex items-center gap-1.5">
                      <span>{param.nameFa}</span>
                      {param.expectedLimitText && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-stone-100 dark:bg-stone-800 text-stone-500 rounded font-mono">
                          حد: {param.expectedLimitText}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-stone-500">
                    {param.expectedUnit || '-'}
                  </td>
                  {session.replicates.map((rep) => {
                    const stepRun = rep.stepsData[param.stepNumber];
                    const recVal = stepRun?.parameterValues[param.id]?.value;
                    const isSet = recVal !== undefined && recVal !== '';

                    return (
                      <td key={rep.replicateNumber} className="py-2.5 px-4 text-center font-mono font-medium">
                        {isSet ? (
                          typeof recVal === 'boolean' ? (
                            recVal ? (
                              <span className="text-emerald-600 font-bold">مثبت (+)</span>
                            ) : (
                              <span className="text-rose-600 font-bold">منفی (-)</span>
                            )
                          ) : (
                            <span className="text-stone-900 dark:text-stone-100">{String(recVal)}</span>
                          )
                        ) : (
                          <span className="text-stone-300 dark:text-stone-700">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Statistical Repeatability Analysis */}
      {stats && stats.validReplicatesCount > 0 && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              تحلیل آماری و تکرارپذیری (Repeatability Analysis)
            </h3>
            <span className="text-xs text-stone-500 font-mono">
              N = {stats.validReplicatesCount}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">میانگین (Mean x̄)</span>
              <span className="font-mono text-base font-bold text-stone-900 dark:text-stone-100">
                {stats.mean ?? '-'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">انحراف معیار (Std Dev s)</span>
              <span className="font-mono text-base font-bold text-stone-900 dark:text-stone-100">
                {stats.standardDeviation !== undefined ? stats.standardDeviation : '-'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">ضریب تغییرات (%RSD / CV)</span>
              <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                {stats.relativeStandardDeviationPercent !== undefined ? `${stats.relativeStandardDeviationPercent}%` : '-'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">اختلاف تکرارها (Range Δ)</span>
              <span className="font-mono text-base font-bold text-stone-900 dark:text-stone-100">
                {stats.rangeDifference ?? '-'}
              </span>
            </div>
          </div>

          {stats.assessmentNote && (
            <div className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
              stats.isAcceptableRepeatability
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800'
            }`}>
              {stats.isAcceptableRepeatability ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <p className="leading-relaxed">{stats.assessmentNote}</p>
            </div>
          )}
        </div>
      )}

      {/* 3. Standard Conformance Assessment */}
      {conformance && conformance.evaluatedLimits.length > 0 && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                ارزیابی انطباق با استاندارد ({session.standardNumber || 'استاندارد مرجع'})
              </h3>
            </div>

            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
              conformance.isCompliant
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}>
              {conformance.isCompliant ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  منطبق با استاندارد
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  عدم انطباق با استاندارد
                </>
              )}
            </span>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 mb-3 leading-relaxed">
            {conformance.detailsFa}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-850 text-stone-500 border-b border-stone-200 dark:border-stone-800">
                  <th className="py-2 px-3">نام شاخص استاندارد</th>
                  <th className="py-2 px-3 text-center">مقدار اندازه‌گیری‌شده (میانگین)</th>
                  <th className="py-2 px-3 text-center">حد مجاز استاندارد</th>
                  <th className="py-2 px-3 text-center">واحد</th>
                  <th className="py-2 px-3 text-center">وضعیت انطباق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {conformance.evaluatedLimits.map((lim, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-850/50">
                    <td className="py-2.5 px-3 font-medium text-stone-900 dark:text-stone-100">
                      {lim.parameterName}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold">
                      {lim.measuredValue}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-stone-600 dark:text-stone-400">
                      {lim.standardLimit}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-stone-500">
                      {lim.unit || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {lim.passed ? (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
                          منطبق ✓
                        </span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-medium">
                          مغایر ✗
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
