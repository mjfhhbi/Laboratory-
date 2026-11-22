import React, { useState, useEffect } from 'react';
import {
  FoodStandard,
  FOOD_STANDARD_SECTORS
} from '../../types/foodStandard';
import { ScientificSource } from '../../types/knowledgeBase';
import { getSourceById } from '../../lib/storage/knowledgeBase';
import { StandardMathFormula } from './StandardMathFormula';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Building,
  Calendar,
  Layers,
  Wrench,
  FlaskConical,
  BookOpen,
  Copy,
  Check,
  Printer,
  Edit2,
  FileCheck2,
  Globe,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Calculator,
  ListOrdered,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Tag
} from 'lucide-react';

interface FoodStandardDetailModalProps {
  standard: FoodStandard;
  onClose: () => void;
  onEdit?: (std: FoodStandard) => void;
  onSelectSource?: (sourceId: string) => void;
}

export const FoodStandardDetailModal: React.FC<FoodStandardDetailModalProps> = ({
  standard,
  onClose,
  onEdit,
  onSelectSource
}) => {
  const [copied, setCopied] = useState(false);
  const [sourcesList, setSourcesList] = useState<Array<{ citation: any; source: ScientificSource | null }>>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'method' | 'limits' | 'calculations' | 'sources'>('all');

  const isIran = standard.jurisdiction === 'iranian_national';
  const sectorMeta = FOOD_STANDARD_SECTORS[standard.sector] || FOOD_STANDARD_SECTORS.other;
  const isVerified = (standard.verificationStatus === 'official_regulatory' || standard.verificationStatus === 'verified_with_source') &&
    standard.sources && standard.sources.length > 0;

  // Load referenced sources
  useEffect(() => {
    async function loadSources() {
      if (standard.sources && standard.sources.length > 0) {
        const loaded = await Promise.all(
          standard.sources.map(async (c) => ({
            citation: c,
            source: await getSourceById(c.sourceId)
          }))
        );
        setSourcesList(loaded);
      } else {
        setSourcesList([]);
      }
    }
    loadSources();
  }, [standard.sources]);

  const handleCopyMarkdown = () => {
    const text = `# استاندارد ${standard.standardNumber}: ${standard.titleFa}
سازمان صادرکننده: ${standard.issuingOrganization} (${standard.country})
ویرایش / سال: ${standard.revisionAndYear || 'نامشخص'}
حوزه تخصصی: ${sectorMeta.titleFa}

## ۱. دامنه کاربرد
${standard.scopeOfApplication || '-'}

## ۲. روش آزمون مرجع
${standard.testMethod || '-'}

## ۳. تجهیزات موردنیاز
${standard.requiredEquipment?.map((e) => `- ${e}`).join('\n') || '-'}

## ۴. مواد و معرف‌ها
${standard.reagentsAndChemicals?.map((r) => `- ${r}`).join('\n') || '-'}

## ۵. شرایط آزمون
${standard.testConditions || '-'}

## ۶. مراحل آزمون
${standard.testProcedure || '-'}

## ۷. محاسبات و فرمول‌ها
${standard.calculationsAndFormulas || '-'}

## ۸. هشدارهای ایمنی و خطاها
${standard.errorsAndSafetyWarnings || '-'}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[96vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3 sm:gap-4 bg-stone-50/70 dark:bg-stone-800/30">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Jurisdiction Badge */}
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border ${
                  isIran
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                }`}
              >
                {isIran ? (
                  <>
                    <span>🇮🇷</span>
                    <span>استاندارد ملی ایران</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>استاندارد بین‌المللی / خارجی</span>
                  </>
                )}
              </span>

              {/* Standard Number Pill */}
              <span
                className="px-3 py-1 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-mono font-extrabold text-xs tracking-wider"
                dir="ltr"
              >
                {standard.standardNumber || 'INSO-STANDARD'}
              </span>

              {/* Sector Pill */}
              <span className={`px-2.5 py-1 rounded-xl text-xs font-medium border ${sectorMeta.badgeColor}`}>
                {sectorMeta.titleFa}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
              {standard.titleFa}
            </h2>

            {standard.titleEn && (
              <p className="text-xs font-mono text-stone-500 dark:text-stone-400" dir="ltr">
                {standard.titleEn}
              </p>
            )}

            {/* Meta bar: Org, Revision, Country */}
            <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400 flex-wrap pt-1">
              <span className="inline-flex items-center gap-1 font-semibold text-stone-800 dark:text-stone-200">
                <Building className="w-3.5 h-3.5 text-stone-400" />
                <span>{standard.issuingOrganization}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <span>کشور صادرکننده:</span>
                <strong className="text-stone-700 dark:text-stone-300">{standard.country}</strong>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>ویرایش / سال نشر:</span>
                <strong className="font-mono text-stone-800 dark:text-stone-200">{standard.revisionAndYear || '-'}</strong>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title="کپی متن استاندارد (Markdown)"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(standard)}
                className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                title="ویرایش استاندارد"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
              title="بستن"
              aria-label="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verification Status Warning / Banner */}
        {!isVerified ? (
          <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-900/60 p-3 sm:px-6 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              <strong>استاندارد در وضعیت پیش‌نویس (Unverified):</strong> این رکورد هنوز به یک منبع رسمی (سازمان استاندارد یا ژورنال معتبر) متصل نشده است و استناد قطعی به آن منوط به ارزیابی منبع می‌باشد.
            </span>
          </div>
        ) : (
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/60 p-3 sm:px-6 flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                <strong>استاندارد تأییدشده:</strong> مستند به {standard.sources.length} منبع معتبر رسمی.
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200">
              Verified Scientific Standard
            </span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Section 1: Scope of Application (دامنه کاربرد) */}
          {standard.scopeOfApplication && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>۱. هدف و دامنه کاربرد (Scope of Application)</span>
              </h3>
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                {standard.scopeOfApplication}
              </div>
            </div>
          )}

          {/* Section 2: Reference Test Method (روش آزمون مرجع) */}
          {standard.testMethod && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <span>۲. روش آزمون مرجع (Reference Test Method)</span>
              </h3>
              <div className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                {standard.testMethod}
              </div>
            </div>
          )}

          {/* Section 3: Equipment & Reagents Grid */}
          {((standard.requiredEquipment && standard.requiredEquipment.length > 0) ||
            (standard.reagentsAndChemicals && standard.reagentsAndChemicals.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Required Equipment */}
              {standard.requiredEquipment && standard.requiredEquipment.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-cyan-600" />
                    <span>۳. تجهیزات و دستگاه‌های موردنیاز ({standard.requiredEquipment.length})</span>
                  </h3>
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    {standard.requiredEquipment.map((eq, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-800 dark:text-stone-200">
                        <span className="text-cyan-600 font-mono font-bold">•</span>
                        <span>{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reagents & Chemicals */}
              {standard.reagentsAndChemicals && standard.reagentsAndChemicals.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-amber-600" />
                    <span>۴. مواد، معرف‌ها و محلول‌های شیمیایی ({standard.reagentsAndChemicals.length})</span>
                  </h3>
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-1.5">
                    {standard.reagentsAndChemicals.map((rg, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-800 dark:text-stone-200">
                        <span className="text-amber-600 font-mono font-bold">•</span>
                        <span>{rg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Test Conditions (شرایط آزمون) */}
          {standard.testConditions && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>۵. شرایط محیطی و الزامات آزمون (Test Conditions)</span>
              </h3>
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                {standard.testConditions}
              </div>
            </div>
          )}

          {/* Section 5: Test Procedure (مراحل آزمون) */}
          {standard.testProcedure && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-emerald-600" />
                <span>۶. مراحل اجرای آزمون (Test Procedure / Protocol)</span>
              </h3>
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line font-sans">
                {standard.testProcedure}
              </div>
            </div>
          )}

          {/* Section 6: Calculations & Formulas with KaTeX (محاسبات و فرمول‌ها) */}
          {standard.calculationsAndFormulas && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-purple-600" />
                <span>۷. فرمول‌ها و روابط محاسباتی (Calculations & Equations)</span>
              </h3>
              <div className="p-4 rounded-2xl bg-purple-50/30 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed space-y-2">
                <StandardMathFormula content={standard.calculationsAndFormulas} />
              </div>
            </div>
          )}

          {/* Section 7: Acceptable Limits & Specifications Table (محدوده‌های قابل قبول) */}
          {standard.acceptableLimits && standard.acceptableLimits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>۸. مشخصات و محدوده‌های قابل قبول ({standard.acceptableLimits.length} پارامتر)</span>
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
                <table className="w-full text-xs text-right divide-y divide-stone-200 dark:divide-stone-800 min-w-[500px]">
                  <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">نام ویژگی / پارامتر</th>
                      <th className="py-2.5 px-3">حد مجاز / مشخصه</th>
                      <th className="py-2.5 px-3">واحد اندازه‌گیری</th>
                      <th className="py-2.5 px-3">رواداری</th>
                      <th className="py-2.5 px-3">روش آزمون مرجع</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 bg-white dark:bg-stone-900">
                    {standard.acceptableLimits.map((limit, idx) => (
                      <tr key={limit.id || idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                        <td className="py-2.5 px-3 font-semibold text-stone-900 dark:text-stone-100">
                          <div>{limit.parameterNameFa}</div>
                          {limit.parameterNameEn && (
                            <div className="text-[10px] font-mono text-stone-400" dir="ltr">
                              {limit.parameterNameEn}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400" dir="ltr">
                          {limit.limitSpecification}
                        </td>
                        <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400">
                          {limit.unit || '-'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-stone-600 dark:text-stone-400" dir="ltr">
                          {limit.tolerance || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px]" dir="ltr">
                          {limit.testMethodRef || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 8: Errors & Safety Warnings (خطاها و هشدارهای ایمنی) */}
          {standard.errorsAndSafetyWarnings && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>۹. خطاها، عوامل مداخله‌گر و هشدارهای ایمنی (Errors & Safety Precautions)</span>
              </h3>
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs sm:text-sm text-rose-950 dark:text-rose-200 leading-relaxed whitespace-pre-line">
                {standard.errorsAndSafetyWarnings}
              </div>
            </div>
          )}

          {/* Section 9: Sources & References (منابع و ارجاعات علمی) */}
          <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>۱۰. مراجع و استنادات علمی (Scientific Citations & Literature)</span>
            </h3>

            {sourcesList.length === 0 ? (
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-xs text-stone-500">
                هیچ منبع علمی ثبت‌شده‌ای به این استاندارد پیوست نشده است.
              </div>
            ) : (
              <div className="space-y-2">
                {sourcesList.map(({ citation, source }, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (source && onSelectSource) onSelectSource(source.id);
                    }}
                    className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/80 hover:border-emerald-500/50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {source?.title || citation.sourceTitle || 'منبع علمی'}
                        </span>
                        {source?.codeOrIdentifier && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200" dir="ltr">
                            {source.codeOrIdentifier}
                          </span>
                        )}
                      </div>

                      {source?.organizationOrPublisher && (
                        <div className="text-[11px] text-stone-500 flex items-center gap-2">
                          <span>{source.organizationOrPublisher} ({source.yearOrEdition})</span>
                          {citation.sectionOrChapter && <span>• بند/فصل: {citation.sectionOrChapter}</span>}
                          {citation.pageNumber && <span>• صفحه: {citation.pageNumber}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold shrink-0">
                      <span>مشاهده منبع</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          {standard.tags && standard.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              <span className="text-[11px] text-stone-400 font-bold">برچسب‌ها:</span>
              {standard.tags.map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[11px]"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/30 flex items-center justify-between gap-3 text-xs">
          <span className="text-stone-400 font-mono text-[11px]">
            شناسه داخلی: {standard.id}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
