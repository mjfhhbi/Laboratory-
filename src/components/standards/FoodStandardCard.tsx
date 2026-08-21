import React from 'react';
import {
  FoodStandard,
  FOOD_STANDARD_SECTORS,
  StandardLifecycleStatus
} from '../../types/foodStandard';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Building,
  Calendar,
  Layers,
  Wrench,
  FlaskConical,
  Eye,
  Edit2,
  Trash2,
  Globe,
  Tag,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface FoodStandardCardProps {
  standard: FoodStandard;
  onViewDetails: (std: FoodStandard) => void;
  onEdit: (std: FoodStandard) => void;
  onDelete: (std: FoodStandard) => void;
}

const LIFECYCLE_STATUS_META: Record<StandardLifecycleStatus, { label: string; color: string }> = {
  active: {
    label: 'معتبر و جاری',
    color: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  under_revision: {
    label: 'در حال بازنگری',
    color: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  withdrawn: {
    label: 'ابطال‌شده',
    color: 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  },
  draft: {
    label: 'پیش‌نویس',
    color: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
  }
};

export const FoodStandardCard: React.FC<FoodStandardCardProps> = ({
  standard,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const isIran = standard.jurisdiction === 'iranian_national';
  const sectorMeta = FOOD_STANDARD_SECTORS[standard.sector] || FOOD_STANDARD_SECTORS.other;
  const statusMeta = LIFECYCLE_STATUS_META[standard.lifecycleStatus] || LIFECYCLE_STATUS_META.active;
  const isVerified = (standard.verificationStatus === 'official_regulatory' || standard.verificationStatus === 'verified_with_source') &&
    standard.sources && standard.sources.length > 0;

  return (
    <div
      onClick={() => onViewDetails(standard)}
      className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Top Badges: Jurisdiction, Standard Number, Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Jurisdiction Badge */}
            <span
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 border ${
                isIran
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
              }`}
            >
              {isIran ? (
                <>
                  <span>🇮🇷</span>
                  <span>استاندارد ملی ایران</span>
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3" />
                  <span>استاندارد بین‌المللی / خارجی</span>
                </>
              )}
            </span>

            {/* Sector Pill */}
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${sectorMeta.badgeColor}`}>
              {sectorMeta.titleFa}
            </span>
          </div>

          {/* Standard Status */}
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusMeta.color}`}>
            {statusMeta.label}
          </span>
        </div>

        {/* Standard Number & Title */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700"
              dir="ltr"
            >
              {standard.standardNumber || 'فاقد شماره'}
            </span>

            {standard.revisionAndYear && (
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>{standard.revisionAndYear}</span>
              </span>
            )}
          </div>

          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
            {standard.titleFa}
          </h3>

          {standard.titleEn && (
            <p className="text-[11px] font-mono text-stone-400 line-clamp-1" dir="ltr">
              {standard.titleEn}
            </p>
          )}
        </div>

        {/* Issuing Organization & Country */}
        <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <strong className="text-stone-700 dark:text-stone-300 font-medium">{standard.issuingOrganization}</strong>
          </span>
          <span>•</span>
          <span>{standard.country}</span>
        </div>

        {/* Scope Excerpt */}
        {standard.scopeOfApplication && (
          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed bg-stone-50 dark:bg-stone-800/40 p-2 rounded-xl border border-stone-100 dark:border-stone-800">
            {standard.scopeOfApplication}
          </p>
        )}

        {/* Technical Elements Chips */}
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          {standard.acceptableLimits && standard.acceptableLimits.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{standard.acceptableLimits.length} حد مشخصه</span>
            </span>
          )}

          {standard.requiredEquipment && standard.requiredEquipment.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">
              <Wrench className="w-3 h-3 text-cyan-600" />
              <span>{standard.requiredEquipment.length} دستگاه</span>
            </span>
          )}

          {standard.reagentsAndChemicals && standard.reagentsAndChemicals.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">
              <FlaskConical className="w-3 h-3 text-amber-600" />
              <span>{standard.reagentsAndChemicals.length} معرف</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer: Verification status & Actions */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 mt-3">
        {/* Verification Status */}
        <div className="flex items-center gap-1 text-[11px]">
          {isVerified ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>تأییدشده با منبع مرجع ({standard.sources.length})</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>پیش‌نویس / در انتظار استناد</span>
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onViewDetails(standard)}
            className="p-1.5 text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="مشاهده جزئیات کامل استاندارد"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(standard)}
            className="p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="ویرایش استاندارد"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(standard)}
            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
            title="حذف استاندارد"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
