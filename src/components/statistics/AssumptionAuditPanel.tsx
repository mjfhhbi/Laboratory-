import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  ShieldAlert, 
  Activity, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  StatisticalDataset, 
  AssumptionVerificationReport 
} from '../../types/statistics';

interface AssumptionAuditPanelProps {
  dataset: StatisticalDataset;
  auditReport: AssumptionVerificationReport;
  onUpdateClarifications: (clarifications: NonNullable<StatisticalDataset['userClarifications']>) => void;
}

export const AssumptionAuditPanel: React.FC<AssumptionAuditPanelProps> = ({
  dataset,
  auditReport,
  onUpdateClarifications
}) => {
  const currentClarifications = dataset.userClarifications || {};

  const handleSelectClarification = (key: string, value: string) => {
    onUpdateClarifications({
      ...currentClarifications,
      [key]: value
    });
  };

  const statusBadge = {
    valid: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      title: 'مفروضات آماری معتبر است (Assumptions Met)'
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
      title: 'هشدار فرضیات آماری (Caution Advised)'
    },
    invalid: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
      title: 'نقض مفروضات مدل پارامتریک (Assumptions Violated)'
    }
  }[auditReport.overallStatus];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-6 p-6">
      {/* Overall Status Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${statusBadge.bg}`}>
        {statusBadge.icon}
        <div className="space-y-1">
          <h4 className="text-sm font-bold">{statusBadge.title}</h4>
          <p className="text-xs leading-relaxed opacity-90">{auditReport.summaryFa}</p>
        </div>
      </div>

      {/* Primary Mathematical Audits: Normality & Homogeneity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Normality Test (Shapiro-Wilk) */}
        <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              آزمون توزیع نرمال (Shapiro-Wilk)
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                auditReport.normalityOverall.isNormal
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {auditReport.normalityOverall.isNormal ? 'نرمال (تایید)' : 'غیر نرمال (رد فرضیه)'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white p-2.5 rounded-lg border border-slate-200/60">
            <div>
              <span className="text-slate-400 block text-[10px]">آماره شاپیرو W:</span>
              <strong className="text-slate-700">{auditReport.normalityOverall.statistic}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">سطح احتمال p-value:</span>
              <strong className={auditReport.normalityOverall.pValue > 0.05 ? 'text-emerald-600' : 'text-rose-600'}>
                {auditReport.normalityOverall.pValue}
              </strong>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            {auditReport.normalityOverall.interpretationFa}
          </p>
        </div>

        {/* 2. Homogeneity of Variances (Levene) */}
        <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              آزمون همگنی واریانس‌ها (Levene's Test)
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                auditReport.homogeneity.isHomogeneous
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {auditReport.homogeneity.isHomogeneous ? 'واریانس‌های همگن' : 'واریانس‌های ناهمگن'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white p-2.5 rounded-lg border border-slate-200/60">
            <div>
              <span className="text-slate-400 block text-[10px]">آماره F لون:</span>
              <strong className="text-slate-700">{auditReport.homogeneity.statistic}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">سطح احتمال p-value:</span>
              <strong className={auditReport.homogeneity.pValue > 0.05 ? 'text-emerald-600' : 'text-rose-600'}>
                {auditReport.homogeneity.pValue}
              </strong>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            {auditReport.homogeneity.interpretationFa}
          </p>
        </div>
      </div>

      {/* Interactive Clarification Questions (User Input Required) */}
      <div className="border border-indigo-100 rounded-xl bg-indigo-50/30 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              پرسش‌های ارزیابی طرح آزمایش (Experimental Design Questionnaire)
            </h4>
            <p className="text-[11px] text-slate-500">
              پاسخ به این موارد جهت اعتبارسنجی فرضیات استقلال و گزینش دقیق آزمون آماری الزامی است.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {auditReport.clarificationQuestions.map((q) => (
            <div key={q.id} className="bg-white p-4 rounded-xl border border-indigo-100/70 shadow-2xs space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {q.questionFa}
              </label>
              <p className="text-[11px] text-slate-400">{q.helpFa}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {q.options.map((opt) => {
                  const isSelected = currentClarifications[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectClarification(q.id, opt.value)}
                      className={`text-right p-3 rounded-lg border text-xs transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-semibold ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span>{opt.labelFa}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />}
                      </div>
                      <span className="block text-[10px] text-slate-400 mt-1 font-sans">
                        {opt.statisticalImpactFa}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings & Recommendations */}
      {(auditReport.warnings.length > 0 || auditReport.recommendations.length > 0) && (
        <div className="space-y-3 pt-2">
          {auditReport.warnings.length > 0 && (
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                هشدارهای اعتبارسنجی طرح و داده‌ها:
              </h5>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pr-2">
                {auditReport.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {auditReport.recommendations.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                توصیه‌های بهبود آماری و مدل جایگزین:
              </h5>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pr-2">
                {auditReport.recommendations.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
