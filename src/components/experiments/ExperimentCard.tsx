import React from 'react';
import {
  FoodExperiment,
  EXPERIMENT_DOMAINS,
  VERIFICATION_STATUS_META,
  RELIABILITY_GRADES
} from '../../types/foodExperiment';
import {
  FlaskConical,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ChevronLeft,
  BookOpen,
  Wifi,
  WifiOff,
  TestTube2,
  Trash2,
  Edit3
} from 'lucide-react';

interface ExperimentCardProps {
  experiment: FoodExperiment;
  onSelect: (experiment: FoodExperiment) => void;
  onEdit?: (experiment: FoodExperiment) => void;
  onDelete?: (id: string) => void;
}

export const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment,
  onSelect,
  onEdit,
  onDelete
}) => {
  const domainMeta = EXPERIMENT_DOMAINS[experiment.domain] || {
    titleFa: experiment.domain,
    titleEn: '',
    color: '#6b7280'
  };

  const statusMeta = VERIFICATION_STATUS_META[experiment.verificationStatus] || {
    labelFa: 'در دست بررسی',
    badgeColor: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
    descriptionFa: ''
  };

  const gradeMeta = RELIABILITY_GRADES[experiment.reliabilityGrade] || {
    labelFa: 'Grade D',
    color: '#9ca3af'
  };

  const isINSO = experiment.standardReference?.jurisdiction === 'iranian_national' ||
    experiment.standardReference?.organization === 'INSO';

  return (
    <div
      id={`exp-card-${experiment.id}`}
      className="group relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Domain Badge */}
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold"
              style={{
                backgroundColor: `${domainMeta.color}15`,
                color: domainMeta.color
              }}
            >
              <FlaskConical className="w-3 h-3" />
              {domainMeta.titleFa}
            </span>

            {/* Code */}
            <span className="font-mono text-[11px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
              {experiment.code}
            </span>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center gap-1.5">
            {experiment.isVerifiedProtocol ? (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                title="روش معتبر استاندارد ملی یا بین‌المللی"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{gradeMeta.labelFa}</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                title="روش در انتظار استعلام یا پیش‌نویس"
              >
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span>{statusMeta.labelFa}</span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(experiment)}
          className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1.5 leading-snug cursor-pointer group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
        >
          {experiment.titleFa}
        </h3>

        {/* English Subtitle */}
        {experiment.titleEn && (
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mb-3 line-clamp-1 italic dir-ltr text-left">
            {experiment.titleEn}
          </p>
        )}

        {/* Objective Snippet */}
        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed mb-4">
          {experiment.objective}
        </p>

        {/* Key Attributes Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-stone-600 dark:text-stone-400">
          {/* Standard Tag */}
          {experiment.standardReference && experiment.standardReference.standardNumber && (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded border ${
                isINSO
                  ? 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 font-medium'
                  : 'bg-sky-50/60 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900 text-sky-700 dark:text-sky-300 font-medium'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>{experiment.standardReference.organization}: {experiment.standardReference.standardNumber}</span>
            </div>
          )}

          {/* Equipment Count */}
          <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-800/80 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
            <TestTube2 className="w-3 h-3 text-stone-400" />
            <span>{experiment.equipment?.length || 0} تجهیزات</span>
          </div>

          {/* Procedure Steps Count */}
          <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-800/80 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
            <Layers className="w-3 h-3 text-stone-400" />
            <span>{experiment.procedureSteps?.length || 0} مرحله</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {experiment.offlineAvailable ? (
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              <Wifi className="w-3 h-3" />
              <span>آفلاین</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-stone-400">
              <WifiOff className="w-3 h-3" />
              <span>نیازمند شبکه</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(experiment);
              }}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              title="ویرایش پروتکل"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`آیا از حذف پروتکل «${experiment.titleFa}» اطمینان دارید؟`)) {
                  onDelete(experiment.id);
                }
              }}
              className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
              title="حذف آزمایش"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onSelect(experiment)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-xl transition-colors"
          >
            <span>دستورالعمل آزمون (SOP)</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
