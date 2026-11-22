import React, { useState } from 'react';
import { 
  Table, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';
import { 
  StatisticalDataset, 
  AnovaAnalysisResult, 
  AssumptionVerificationReport 
} from '../../types/statistics';

interface AnovaSectionProps {
  dataset: StatisticalDataset;
  anovaResult: AnovaAnalysisResult;
  auditReport: AssumptionVerificationReport;
  onPostHocMethodChange: (method: 'tukey_hsd' | 'duncan' | 'lsd') => void;
}

export const AnovaSection: React.FC<AnovaSectionProps> = ({
  dataset,
  anovaResult,
  auditReport,
  onPostHocMethodChange
}) => {
  const [activeTab, setActiveTab] = useState<'anova' | 'posthoc' | 'nonparametric'>('anova');

  const isAssumptionsViolated = auditReport.overallStatus === 'invalid';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
      {/* Top Banner & Tab Controls */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-600" />
            تحلیل واریانس یک‌طرفه (One-Way ANOVA) و آزمون‌های تعقیبی
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            بررسی معنی‌داری اثر فاکتورهای آزمایشی و تفکیک میانگین‌ها به روش‌های استاندارد ژورنال‌های علمی
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('anova')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'anova'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            جدول ANOVA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('posthoc')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'posthoc'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            آزمون تعقیبی (Post-hoc)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nonparametric')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'nonparametric'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            جایگزین ناپارامتریک (Kruskal-Wallis)
          </button>
        </div>
      </div>

      {/* Assumption Safeguard Banner */}
      {isAssumptionsViolated && (
        <div className="mx-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-900">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">هشدار علمی درباره اعتبار نتایج ANOVA:</span>
            <p className="text-rose-800 leading-normal">
              با توجه به نقض پیش‌فرض‌های بنیادین (ناهمگنی واریانس‌ها یا عدم نرمال بودن باقیمانده‌ها)، مقدار F و p-value جدول زیر از نظر متدولوژی دارای اریبی (Bias) است. توصیه اکید می‌شود به تب <strong>«جایگزین ناپارامتریک (Kruskal-Wallis)»</strong> مراجعه فرمایید.
            </p>
          </div>
        </div>
      )}

      {/* TAB 1: ANOVA Table */}
      {activeTab === 'anova' && (
        <div className="px-6 pb-6 space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 font-bold text-slate-700">
                  <th className="py-3 px-4">منبع تغییرات (Source)</th>
                  <th className="py-3 px-3 text-center">مجموع مربعات (SS)</th>
                  <th className="py-3 px-3 text-center">درجات آزادی (df)</th>
                  <th className="py-3 px-3 text-center">میانگین مربعات (MS)</th>
                  <th className="py-3 px-3 text-center bg-indigo-50/50 text-indigo-900">آماره F</th>
                  <th className="py-3 px-3 text-center bg-indigo-50/50 text-indigo-900">مقدار p (P-value)</th>
                  <th className="py-3 px-3 text-center">سطح معنی‌داری</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {anovaResult.table.map((row, idx) => (
                  <tr key={idx} className={idx === 0 ? 'bg-indigo-50/10 font-bold' : ''}>
                    <td className="py-3 px-4 font-sans text-slate-800">
                      <div>{row.sourceFa}</div>
                      <span className="text-[10px] text-slate-400 font-sans">{row.sourceEn}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">{row.ss.toFixed(3)}</td>
                    <td className="py-3 px-3 text-center text-slate-700">{row.df}</td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      {row.ms !== null ? row.ms.toFixed(3) : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-indigo-700">
                      {row.f !== null ? row.f.toFixed(3) : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold">
                      {row.pValue !== null ? (
                        <span
                          className={
                            row.pValue < dataset.alphaLevel
                              ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full'
                              : 'text-slate-600'
                          }
                        >
                          {row.pValue < 0.0001 ? '< 0.0001' : row.pValue.toFixed(4)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-sans">
                      {row.pValue !== null ? (
                        row.pValue < 0.001 ? (
                          <span className="text-emerald-700 font-bold">بسیار معنادار (P &lt; 0.001) ***</span>
                        ) : row.pValue < 0.01 ? (
                          <span className="text-emerald-700 font-bold">معنادار (P &lt; 0.01) **</span>
                        ) : row.pValue < dataset.alphaLevel ? (
                          <span className="text-emerald-700 font-bold">معنادار (P &lt; {dataset.alphaLevel}) *</span>
                        ) : (
                          <span className="text-slate-400">عدم تفاوت معنادار (ns)</span>
                        )
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Model Fit & Effect Size Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[11px] text-slate-500 block">اندازه اثر اتا-اسکوئر (Eta Squared η²):</span>
              <strong className="text-sm font-mono text-slate-800">
                {(anovaResult.etaSquared * 100).toFixed(1)}%
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                سهم واریانس تبیین‌شده توسط تیمارها
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[11px] text-slate-500 block">امگا-اسکوئر (Omega Squared ω²):</span>
              <strong className="text-sm font-mono text-slate-800">
                {(anovaResult.omegaSquared * 100).toFixed(1)}%
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                برآورد نااریب اندازه اثر در جامعه
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[11px] text-slate-500 block">وضعیت آزمون فرضیه صفر (H₀):</span>
              <strong className={anovaResult.isSignificant ? 'text-emerald-700 text-xs' : 'text-slate-700 text-xs'}>
                {anovaResult.isSignificant
                  ? 'فرضیه صفر رد می‌شود (حداقل یک تیمار تفاوت دارد)'
                  : 'فرضیه صفر تأیید می‌شود (تفاوت معنادار نیست)'}
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                سطح آلفا: α = {dataset.alphaLevel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Post-Hoc Tests (Tukey / Duncan / LSD) */}
      {activeTab === 'posthoc' && (
        <div className="px-6 pb-6 space-y-5">
          {/* Method selector bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-700">روش مقایسه میانگین‌ها:</span>
              <select
                value={anovaResult.postHoc.method}
                onChange={(e) => onPostHocMethodChange(e.target.value as any)}
                className="px-3 py-1 text-xs rounded-lg border border-slate-300 bg-white font-sans text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="tukey_hsd">آزمون توکی (Tukey's HSD - استاندارد بین‌المللی)</option>
                <option value="duncan">آزمون دانکن (Duncan's MRT)</option>
                <option value="lsd">حداقل تفاوت معنی‌دار (Fisher's LSD)</option>
              </select>
            </div>

            <span className="text-[11px] text-slate-500">
              سطح آزمون: <strong>α = {dataset.alphaLevel}</strong>
            </span>
          </div>

          {/* Post-Hoc Guardrail Check */}
          {!anovaResult.postHoc.isEligible ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">عدم صلاحیت اجرای آزمون تعقیبی (Post-Hoc Not Eligible):</span>
                <p className="text-amber-800 leading-normal">
                  {anovaResult.postHoc.ineligibleReasonFa}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Compact Letter Display Card */}
              <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-2">
                <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  حروف‌بندی علمی میانگین‌ها (Compact Letter Display):
                </h4>
                <p className="text-[11px] text-slate-600">
                  میانگین‌های دارای حداقل یک حرف مشترک فاقد تفاوت آماری معنادار در سطح ۵ درصد هستند.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {dataset.groups.map((group) => {
                    const letter = anovaResult.postHoc.groupLetters[group.id] || '-';
                    return (
                      <div
                        key={group.id}
                        className="bg-white p-3 rounded-lg border border-indigo-100 flex items-center justify-between shadow-2xs"
                      >
                        <span className="text-xs font-medium text-slate-700 truncate">{group.name}</span>
                        <span className="text-sm font-bold font-mono text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/60">
                          {letter}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pairwise Differences Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-right text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 font-bold text-slate-700">
                      <th className="py-2.5 px-4">مقایسه دوتایی (گروه A در برابر گروه B)</th>
                      <th className="py-2.5 px-3 text-center">میانگین A</th>
                      <th className="py-2.5 px-3 text-center">میانگین B</th>
                      <th className="py-2.5 px-3 text-center">قدر مطلق اختلاف</th>
                      <th className="py-2.5 px-3 text-center">خطای معیار اختلاط (SE)</th>
                      <th className="py-2.5 px-3 text-center">فاصله اطمینان ۹۵٪</th>
                      <th className="py-2.5 px-3 text-center">نتیجه</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {anovaResult.postHoc.comparisons.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-4 font-sans font-medium text-slate-800">
                          {c.groupA} <span className="text-slate-400 font-normal">vs</span> {c.groupB}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{c.meanA.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{c.meanB.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                          {c.difference.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-500">{c.seDiff.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-center text-[11px] text-slate-500 font-sans">
                          [{c.ciLower.toFixed(2)}, {c.ciUpper.toFixed(2)}]
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          {c.significant ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              تفاوت معنادار (P &lt; 0.05)
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">بدون تفاوت معنادار</span>
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
      )}

      {/* TAB 3: Non-Parametric Kruskal-Wallis Alternative */}
      {activeTab === 'nonparametric' && anovaResult.nonParametricKruskalWallis && (
        <div className="px-6 pb-6 space-y-4">
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/70 space-y-2">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              آزمون ناپارامتریک کروسکال-والیس (Kruskal-Wallis One-Way Test)
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              این آزمون هیچ‌گونه فرضی مبنی بر نرمال بودن توزیع یا همگنی واریانس‌ها ندارد و میانگین رتبه‌ها را میان تیمارها مقایسه می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">آماره آزمون (H-Statistic):</span>
              <strong className="text-lg font-mono text-slate-800">
                {anovaResult.nonParametricKruskalWallis.hStatistic}
              </strong>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">درجات آزادی (df = k - 1):</span>
              <strong className="text-lg font-mono text-slate-800">
                {anovaResult.nonParametricKruskalWallis.df}
              </strong>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">مقدار p (P-value کای‌دو):</span>
              <strong
                className={`text-lg font-mono ${
                  anovaResult.nonParametricKruskalWallis.pValue < 0.05
                    ? 'text-emerald-600'
                    : 'text-slate-700'
                }`}
              >
                {anovaResult.nonParametricKruskalWallis.pValue}
              </strong>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <strong>تفسیر آماری:</strong> {anovaResult.nonParametricKruskalWallis.interpretationFa}
          </div>
        </div>
      )}
    </div>
  );
};
