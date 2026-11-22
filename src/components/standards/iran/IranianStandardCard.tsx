import React from 'react';
import {
  IranianStandard,
  IRANIAN_STANDARD_STATUS_CONFIG,
  IRANIAN_PRODUCT_GROUPS_CONFIG,
  IRANIAN_TEST_TYPE_CONFIG
} from '../../../types/iranianStandard';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  Package,
  FlaskConical,
  Wrench,
  Calculator,
  ExternalLink,
  History,
  FileCheck
} from 'lucide-react';

interface IranianStandardCardProps {
  standard: IranianStandard;
  onViewDetails: (standard: IranianStandard) => void;
  onRecordTest: (standard: IranianStandard) => void;
  onEdit: (standard: IranianStandard) => void;
  onSelectReplacedStandard?: (standardNumber: string) => void;
}

export const IranianStandardCard: React.FC<IranianStandardCardProps> = ({
  standard,
  onViewDetails,
  onRecordTest,
  onEdit,
  onSelectReplacedStandard
}) => {
  const statusMeta = IRANIAN_STANDARD_STATUS_CONFIG[standard.status];
  const productGroupMeta = IRANIAN_PRODUCT_GROUPS_CONFIG[standard.productGroup];

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md font-mono text-sm font-bold bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 tracking-wider">
              {standard.standardNumber}
            </span>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusMeta.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`}></span>
              {statusMeta.labelFa}
            </span>

            {/* Mandatory / Voluntary */}
            {standard.isMandatory ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                <ShieldAlert className="w-3 h-3" />
                اجباری
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                تشویقی
              </span>
            )}
          </div>

          {/* Revision & Year Tag */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-mono">
            <History className="w-3.5 h-3.5 text-stone-400" />
            <span>{standard.revisionText}</span>
            <span>({standard.ratificationYear})</span>
          </div>
        </div>

        {/* Title in Persian */}
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {standard.titleFa}
        </h3>

        {/* Title in English */}
        {standard.titleEn && (
          <p className="text-xs text-stone-400 dark:text-stone-500 font-mono mb-3 line-clamp-1" dir="ltr">
            {standard.titleEn}
          </p>
        )}

        {/* Superseded Warning Banner if not valid */}
        {standard.status === 'superseded' && standard.supersededBy && (
          <div className="mb-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">جایگزین شده با: </span>
              <button
                type="button"
                onClick={() => onSelectReplacedStandard?.(standard.supersededBy!.standardNumber)}
                className="font-bold underline hover:text-amber-700 dark:hover:text-amber-300 font-mono px-1 inline-flex items-center gap-1"
              >
                {standard.supersededBy.standardNumber}
                <ArrowUpRight className="w-3 h-3" />
              </button>
              {standard.supersededBy.reasonFa && (
                <p className="text-[11px] text-amber-800 dark:text-amber-300/80 mt-0.5">
                  علت: {standard.supersededBy.reasonFa}
                </p>
              )}
            </div>
          </div>
        )}

        {standard.status === 'obsolete' && (
          <div className="mb-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>این استاندارد توسط سازمان ملی استاندارد منسوخ شده و فاقد وجاهت اجرایی جاری است.</span>
          </div>
        )}

        {standard.status === 'needs_review' && (
          <div className="mb-3 p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-300 text-xs flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-stone-500 shrink-0" />
            <span>وضعیت حقوقی یا انطباق این سند در دست استعلام از سامانه تدوین استاندارد است.</span>
          </div>
        )}

        {/* Scope Brief */}
        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mb-3 leading-relaxed">
          {standard.scopeFa}
        </p>

        {/* Badges: Product Group & Test Types */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${productGroupMeta.badgeColor}`}
          >
            {productGroupMeta.titleFa}
          </span>

          {standard.primaryTestTypes.map((type) => {
            const tMeta = IRANIAN_TEST_TYPE_CONFIG[type];
            return (
              <span
                key={type}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${tMeta.badgeClass}`}
              >
                {tMeta.labelFa}
              </span>
            );
          })}
        </div>

        {/* Relationships Counts Grid */}
        <div className="grid grid-cols-4 gap-1.5 py-2 px-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-center mb-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-400 flex items-center gap-1">
              <Package className="w-3 h-3" /> محصولات
            </span>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 font-mono">
              {standard.linkedProducts.length}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-400 flex items-center gap-1">
              <FlaskConical className="w-3 h-3" /> آزمون‌ها
            </span>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 font-mono">
              {standard.linkedTests.length}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-400 flex items-center gap-1">
              <Wrench className="w-3 h-3" /> تجهیزات
            </span>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 font-mono">
              {standard.linkedEquipments.length}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-400 flex items-center gap-1">
              <Calculator className="w-3 h-3" /> فرمول‌ها
            </span>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 font-mono">
              {standard.linkedCalculations.length}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions and Source Info */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2.5">
        {/* Source info */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <span className="truncate max-w-[200px]" title={standard.originalSource.organization}>
            مرجع: {standard.originalSource.citationCode}
          </span>
          {standard.originalSource.portalUrl && (
            <a
              href={standard.originalSource.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center gap-1 shrink-0"
              title="مشاهده در پرتال سازمان ملی استاندارد ایران"
            >
              <span>پرتال استاندارد</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(standard)}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors text-center"
          >
            شناسنامه و ضوابط
          </button>

          <button
            type="button"
            onClick={() => onRecordTest(standard)}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>ثبت آزمون</span>
          </button>
        </div>
      </div>
    </div>
  );
};
