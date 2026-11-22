import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Sparkles,
  FileText
} from 'lucide-react';
import { UnifiedEvidenceReport, UnifiedEvidenceTier } from '../../lib/evidence/types';
import { getEvidenceTierMeta } from '../../lib/evidence/centralEvidenceHub';

interface UnifiedEvidenceCardProps {
  report: UnifiedEvidenceReport;
  compact?: boolean;
  className?: string;
  onExploreSource?: (sourceId: string) => void;
}

export const UnifiedEvidenceCard: React.FC<UnifiedEvidenceCardProps> = ({
  report,
  compact = false,
  className = '',
  onExploreSource
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const meta = getEvidenceTierMeta(report.tier);

  const getTierIcon = (tier: UnifiedEvidenceTier) => {
    switch (tier) {
      case 'VERIFIED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'SUPPORTED':
        return <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
      case 'UNVERIFIED':
      default:
        return <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />;
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all ${meta.borderClass} ${meta.bgSubtle} ${className}`}
      dir="rtl"
    >
      {/* Header Bar */}
      <div className="p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          {getTierIcon(report.tier)}
          <span className={`text-xs font-bold ${meta.textClass}`}>
            سطح اعتبار علمی: {meta.shortLabelFa}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300">
            امتیاز استناد: {report.credibilityScore}٪
          </span>

          {report.antiHallucinationAudit.goldenRuleCompliant ? (
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>قانون طلایی ضدجعل: تأیید</span>
            </span>
          ) : (
            <span className="text-[10px] text-rose-700 dark:text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              <span>هشدار جعل/عدم استناد</span>
            </span>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-lg text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
          title={isExpanded ? 'بستن جزئیات منبع' : 'مشاهده مراجع و شواهد'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-stone-200/40 dark:border-stone-800/40 space-y-3 text-xs">
          <p className="text-stone-700 dark:text-stone-300 text-[11px] leading-relaxed">
            {meta.descriptionFa}
          </p>

          {/* Citations List */}
          {report.citations.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                <span>مراجع و استنادات متصل ({report.citations.length} مأخذ):</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {report.citations.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/70 dark:border-stone-800/70 flex flex-col justify-between gap-1.5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-stone-900 dark:text-stone-100 truncate text-[11px]">
                          {c.title}
                        </span>
                        {c.standardNumber && (
                          <span className="font-mono text-[9px] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-stone-700 dark:text-stone-300 shrink-0">
                            {c.standardNumber}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500 block truncate">
                        {c.authorOrOrg || 'سازمان استاندارد / رفرنس رسمی'}
                      </span>
                    </div>

                    {onExploreSource && (
                      <button
                        onClick={() => onExploreSource(c.id)}
                        className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>مشاهده در پایگاه منابع</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Golden Rule Notice */}
          <div className="p-2 rounded-xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800/50 text-[10px] text-stone-600 dark:text-stone-400">
            <strong>قانون طلایی استناد: </strong>
            هوش مصنوعی هرگز مجاز به جعل شماره استاندارد، فرمول، عدد، دما، زمان، غلظت، حد پذیرش، DOI یا نتیجه آزمایش برای پر کردن جای خالی نیست.
          </div>
        </div>
      )}
    </div>
  );
};
