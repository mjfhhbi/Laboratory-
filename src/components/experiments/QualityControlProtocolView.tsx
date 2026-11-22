/**
 * Food Science AI - Quality Control (QC) Protocol View
 * 
 * Displays authentic QC specifications for an experiment:
 * Blank, Control Sample, Duplicate, Replicate, Calibration Check, Recovery, Reference Material,
 * and Acceptance Criteria.
 * 
 * Strict compliance rule:
 * Displays acceptance criteria ONLY if specified in the source.
 * If not specified, explicitly outputs "قابل ارزیابی نیست".
 * Never creates or hallucinates acceptance criteria.
 */

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Info,
  Scale,
  FlaskConical,
  Droplet,
  Copy,
  Layers,
  Gauge,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import {
  ExperimentQCItem,
  QC_CONTROL_TYPES_META,
  QCControlType
} from '../../types/qualityControl';

interface QualityControlProtocolViewProps {
  items?: ExperimentQCItem[];
  fallbackItems?: string[];
  standardNumber?: string;
}

export const QualityControlProtocolView: React.FC<QualityControlProtocolViewProps> = ({
  items,
  fallbackItems,
  standardNumber = 'INSO'
}) => {
  // If items are not provided, render fallback items or general GLP guidance
  if (!items || items.length === 0) {
    return (
      <div className="space-y-3" dir="rtl">
        {fallbackItems && fallbackItems.length > 0 ? (
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2">
            <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>چک‌پوینت‌های تضمین صحت و تکرارپذیری:</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-stone-700 dark:text-stone-300 text-xs">
              {fallbackItems.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs text-stone-500">
            کنترل کیفی اختصاصی ثبت نشده است. الزامات عمومی ISO/IEC 17025 رعایت گردد.
          </div>
        )}
      </div>
    );
  }

  const getIcon = (type: QCControlType) => {
    switch (type) {
      case 'blank':
        return <Droplet className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'control_sample':
        return <FlaskConical className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'duplicate':
        return <Copy className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'replicate':
        return <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'calibration_check':
        return <Gauge className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'recovery':
        return <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'reference_material':
        return <Award className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Strict Source Compliance Callout */}
      <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5 text-xs">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-stone-900 dark:text-stone-100 block">
            الزامات تضمین کیفیت و صحه‌گذاری نتایج (ISO/IEC 17025 & GLP):
          </strong>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-[11px]">
            معیارهای پذیرش ذیل منحصراً بر اساس استاندارد مرجع ({standardNumber}) مستند شده‌اند. در مواردی که روش مرجع حد عددی تعیین نکرده، وضعیت با عبارت صریح «قابل ارزیابی نیست» مشخص شده و هیچ حد پذیرش ساختگی ایجاد نمی‌گردد.
          </p>
        </div>
      </div>

      {/* QC Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {items.map((item) => {
          const meta = QC_CONTROL_TYPES_META[item.type];
          const hasCriteria = item.acceptanceCriteria && item.acceptanceCriteria.specified;

          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col justify-between gap-3 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all text-xs"
            >
              {/* Header */}
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${meta.color}15` }}
                    >
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                        {item.titleFa}
                      </h4>
                      {item.titleEn && (
                        <span className="text-[10px] font-mono text-stone-400 block">
                          {item.titleEn}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0"
                    style={{
                      backgroundColor: `${meta.color}20`,
                      color: meta.color
                    }}
                  >
                    {item.type.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed pt-1">
                  {item.descriptionFa}
                </p>
              </div>

              {/* Source Clause Reference */}
              <div className="flex items-center gap-1.5 text-[10px] text-stone-500 pt-1 border-t border-stone-100 dark:border-stone-800">
                <BookOpen className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="font-mono">{item.sourceReference}</span>
              </div>

              {/* Acceptance Criteria Box */}
              <div className="pt-1">
                {hasCriteria ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>معیار پذیرش مصوب (Acceptance Criteria):</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold">
                        معیار رسمی
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-emerald-950 dark:text-emerald-300 leading-relaxed">
                      {item.acceptanceCriteria.descriptionFa}
                    </div>
                    {item.acceptanceCriteria.sourceClause && (
                      <div className="text-[9px] font-mono text-emerald-700/80 dark:text-emerald-400/80">
                        مستند: {item.acceptanceCriteria.sourceClause}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>معیار پذیرش (Acceptance Criteria):</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 font-bold">
                        قابل ارزیابی نیست
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-800/90 dark:text-amber-300 leading-relaxed">
                      حد پذیرش رسمی در روش/منبع مربوطه مشخص نشده است: «قابل ارزیابی نیست». هیچ حد فرضی تولید نمی‌شود.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
