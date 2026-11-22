import React, { useState, useEffect } from 'react';
import {
  IranianStandard,
  IranianStandardTestResult,
  IRANIAN_STANDARD_STATUS_CONFIG,
  IRANIAN_PRODUCT_GROUPS_CONFIG,
  IRANIAN_TEST_TYPE_CONFIG
} from '../../../types/iranianStandard';
import { getTestResultsForStandard } from '../../../lib/storage/iranianStandardsStorage';
import {
  X,
  FileText,
  FlaskConical,
  Package,
  Wrench,
  Calculator,
  ShieldCheck,
  ShieldAlert,
  History,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Calendar,
  Layers,
  ArrowUpRight,
  HelpCircle,
  FileCheck,
  BookOpen
} from 'lucide-react';

interface IranianStandardDetailModalProps {
  standard: IranianStandard | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordTest: (standard: IranianStandard, selectedClauseId?: string) => void;
  onSelectStandardByNumber?: (standardNumber: string) => void;
}

type TabType = 'identity' | 'tests' | 'products' | 'equipment' | 'calculations' | 'source' | 'audit';

export const IranianStandardDetailModal: React.FC<IranianStandardDetailModalProps> = ({
  standard,
  isOpen,
  onClose,
  onRecordTest,
  onSelectStandardByNumber
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [testResults, setTestResults] = useState<IranianStandardTestResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    if (standard && isOpen) {
      setLoadingResults(true);
      getTestResultsForStandard(standard.id)
        .then((res) => setTestResults(res))
        .finally(() => setLoadingResults(false));
    }
  }, [standard, isOpen]);

  if (!isOpen || !standard) return null;

  const statusMeta = IRANIAN_STANDARD_STATUS_CONFIG[standard.status];
  const productGroupMeta = IRANIAN_PRODUCT_GROUPS_CONFIG[standard.productGroup];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg font-mono text-base font-bold bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 tracking-wider">
              {standard.standardNumber}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusMeta.badgeClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`}></span>
                  {statusMeta.labelFa}
                </span>

                {standard.isMandatory ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                    <ShieldAlert className="w-3 h-3" />
                    استاندارد ملی اجباری
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                    استاندارد تشویقی
                  </span>
                )}

                <span className="text-xs text-stone-500 font-mono">
                  {standard.revisionText} ({standard.ratificationYear})
                </span>
              </div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-1 line-clamp-1">
                {standard.titleFa}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRecordTest(standard)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <FileCheck className="w-4 h-4" />
              <span>ثبت نتیجه آزمون</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 overflow-x-auto scrollbar-none py-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'identity'
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>شناسنامه و وضعیت</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'tests'
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>آزمون‌ها و حدود ({standard.linkedTests.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'products'
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>محصولات ({standard.linkedProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('equipment')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'equipment'
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>تجهیزات ({standard.linkedEquipments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calculations')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'calculations'
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>روش محاسبه ({standard.linkedCalculations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('source')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'source'
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>منبع و حق نشر</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'audit'
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>سوابق و اسنپ‌شات نسخه ({testResults.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: IDENTIFICATION & REVISIONS */}
          {activeTab === 'identity' && (
            <div className="space-y-6 text-sm">
              {/* Alert for Superseded or Obsolete */}
              {standard.status === 'superseded' && standard.supersededBy && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold">استاندارد جایگزین‌شده</h4>
                    <p className="text-xs">
                      این استاندارد ملغی گردیده و با استاندارد ملی زیر جایگزین شده است:
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectStandardByNumber?.(standard.supersededBy!.standardNumber)
                        }
                        className="px-3 py-1 rounded-md bg-amber-600 text-white font-mono font-bold text-xs inline-flex items-center gap-1 hover:bg-amber-700"
                      >
                        {standard.supersededBy.standardNumber}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-medium text-xs">
                        {standard.supersededBy.titleFa}
                      </span>
                    </div>
                    {standard.supersededBy.reasonFa && (
                      <p className="text-xs text-amber-800 dark:text-amber-300 pt-1">
                        علت جایگزینی: {standard.supersededBy.reasonFa}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* General Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-3">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    اطلاعات ثبتی و سازمانی
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500">شماره استاندارد:</span>
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                        {standard.standardNumber}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500">کد بین‌المللی (ICS):</span>
                      <span className="font-mono text-stone-900 dark:text-stone-100">
                        {standard.icsCode || 'ندارد'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500">گروه محصول:</span>
                      <span className="font-medium text-stone-900 dark:text-stone-100">
                        {productGroupMeta.titleFa}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500">نوع شمول حقوقی:</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {standard.isMandatory ? 'اجباری (دارای پیگرد قانونی)' : 'تشویقی'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-3">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-600" />
                    نسخه‌بندی و تاریخچه بازنگری (Revision)
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500">نوبت تجدیدنظر جاری:</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {standard.revisionText}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500">سال تصویب نهایی:</span>
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                        {standard.ratificationYear}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500">تاریخ لازم‌الاجرا شدن:</span>
                      <span className="font-mono text-stone-900 dark:text-stone-100">
                        {standard.effectiveDate || 'بلافاصله پس از تصویب'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500">نسخه دیجیتال (Version):</span>
                      <span className="font-mono text-stone-900 dark:text-stone-100">
                        v{standard.version}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope */}
              <div className="p-4 rounded-xl bg-white dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                  هدف و دامنه کاربرد مصوب استاندارد
                </h4>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {standard.scopeFa}
                </p>
              </div>

              {/* Replaces list */}
              {standard.replaces && standard.replaces.length > 0 && (
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                    استانداردهای پیشین که با این استاندارد جایگزین و منسوخ شده‌اند:
                  </h4>
                  <div className="space-y-1.5">
                    {standard.replaces.map((rep, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                        <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                          {rep.standardNumber}
                        </span>
                        <span>: {rep.titleFa}</span>
                        {rep.revision && (
                          <span className="text-stone-400 font-mono text-[11px]">
                            ({rep.revision})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline of Revisions */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-600" />
                  تاریخچه تفصیلی نوبت‌های چاپ و تجدیدنظر
                </h4>
                <div className="relative border-r-2 border-stone-200 dark:border-stone-700 mr-3 space-y-4 py-1">
                  {standard.revisionHistory.map((rev, idx) => (
                    <div key={idx} className="relative pr-6">
                      <span
                        className={`absolute -right-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-stone-900 ${
                          rev.status === 'valid'
                            ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900'
                            : rev.status === 'superseded'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      ></span>
                      <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                            {rev.revisionText} ({rev.year})
                          </span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full border ${
                              IRANIAN_STANDARD_STATUS_CONFIG[rev.status].badgeClass
                            }`}
                          >
                            {IRANIAN_STANDARD_STATUS_CONFIG[rev.status].labelFa}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                          {rev.changeSummaryFa}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TESTS & LIMITS */}
          {activeTab === 'tests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    آزمون‌ها و حدود مجاز مصوب در این استاندارد
                  </h3>
                  <p className="text-xs text-stone-500">
                    برای ثبت مستقیم نتایج هر آزمون روی دکمه «ثبت نتیجه» کلیک فرمایید.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRecordTest(standard)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>ثبت نتیجه جدید</span>
                </button>
              </div>

              {standard.linkedTests.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs">
                  هیچ آزمونی برای این استاندارد ثبت نشده است.
                </div>
              ) : (
                <div className="space-y-3">
                  {standard.linkedTests.map((test) => {
                    const tMeta = IRANIAN_TEST_TYPE_CONFIG[test.testType];
                    return (
                      <div
                        key={test.id}
                        className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${tMeta.badgeClass}`}
                            >
                              {tMeta.labelFa}
                            </span>
                            {test.standardClause && (
                              <span className="text-xs font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300">
                                {test.standardClause}
                              </span>
                            )}
                            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                              {test.testNameFa}
                            </h4>
                          </div>

                          {test.testNameEn && (
                            <p className="text-xs text-stone-400 font-mono" dir="ltr">
                              {test.testNameEn}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                            <div>
                              <span className="text-stone-500">حد مجاز استاندارد: </span>
                              <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                                {test.acceptableLimit}
                              </span>
                            </div>
                            {test.tolerance && (
                              <div>
                                <span className="text-stone-500">میزان رواداری: </span>
                                <span className="font-mono text-stone-700 dark:text-stone-300">
                                  {test.tolerance}
                                </span>
                              </div>
                            )}
                          </div>

                          {test.testMethodReference && (
                            <p className="text-[11px] text-stone-500 dark:text-stone-400">
                              مرجع روش آزمون: {test.testMethodReference}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 flex md:flex-col gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => onRecordTest(standard, test.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-emerald-950/40 text-stone-800 hover:text-emerald-700 dark:text-stone-200 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ثبت این آزمون</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                فرآورده‌ها و محصولات مشمول این استاندارد
              </h3>
              {standard.linkedProducts.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs">
                  هیچ محصولی پیوست نشده است.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {standard.linkedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                          {prod.nameFa}
                        </h4>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          {IRANIAN_PRODUCT_GROUPS_CONFIG[prod.category].titleFa}
                        </span>
                      </div>
                      {prod.nameEn && (
                        <p className="text-xs text-stone-400 font-mono" dir="ltr">
                          {prod.nameEn}
                        </p>
                      )}
                      {prod.applicationNotes && (
                        <p className="text-xs text-stone-600 dark:text-stone-400 pt-1">
                          توضیحات انطباق: {prod.applicationNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EQUIPMENT */}
          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                تجهیزات و ابزار دقیق آزمایشگاهی الزامی استاندارد
              </h3>
              {standard.linkedEquipments.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs">
                  تجهیزاتی برای این استاندارد ثبت نشده است.
                </div>
              ) : (
                <div className="space-y-3">
                  {standard.linkedEquipments.map((eq) => (
                    <div
                      key={eq.id}
                      className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                            {eq.equipmentNameFa}
                          </h4>
                          {eq.isMandatory ? (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                              الزامی
                            </span>
                          ) : (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                              اختیاری / ترجیحی
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">
                          دسته‌بندی تجهیز: {eq.equipmentTypeFa}
                        </p>
                        {eq.specifications && (
                          <p className="text-xs text-stone-600 dark:text-stone-300 pt-1">
                            مشخصات فنی و کالیبراسیون: {eq.specifications}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CALCULATIONS & FORMULAS */}
          {activeTab === 'calculations' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                فرمول‌های محاسباتی و روش‌های تعیین مقادیر
              </h3>
              {standard.linkedCalculations.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs">
                  فرمول محاسباتی برای این استاندارد ثبت نشده است.
                </div>
              ) : (
                <div className="space-y-4">
                  {standard.linkedCalculations.map((calc) => (
                    <div
                      key={calc.id}
                      className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 space-y-3"
                    >
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {calc.titleFa}
                      </h4>

                      {/* Formula box */}
                      <div className="p-3 rounded-lg bg-stone-900 text-emerald-400 font-mono text-sm overflow-x-auto text-center" dir="ltr">
                        {calc.formulaLatexOrText}
                      </div>

                      {/* Variables list */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                          شرح متغیرها و یکاها:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {calc.variables.map((v, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex justify-between"
                            >
                              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                {v.symbol}
                              </span>
                              <span className="text-stone-700 dark:text-stone-300">
                                {v.nameFa} ({v.unit})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Example Calculation */}
                      {calc.exampleCalculationFa && (
                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                          <span className="font-bold">مثال عددی کاربردی: </span>
                          <span>{calc.exampleCalculationFa}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SOURCE & LEGAL COPYRIGHT */}
          {activeTab === 'source' && (
            <div className="space-y-5">
              <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-3">
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  شناسنامه منبع رسمی و حقوقی استاندارد
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500">سازمان تدوین‌کننده و مرجع:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {standard.originalSource.organization}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500">کد استناد رسمی:</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                      {standard.originalSource.citationCode}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500">سطح راستی‌آزمایی علمی:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      تأییدشده و استناد مستقیم به مصوبات کمیته ملی
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500">مشخصات اجلاسیه تصویب:</span>
                    <span className="text-stone-900 dark:text-stone-100">
                      {standard.originalSource.ratificationDetails}
                    </span>
                  </div>
                </div>

                {standard.originalSource.portalUrl && (
                  <div className="pt-2">
                    <a
                      href={standard.originalSource.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      <span>مشاهده در سامانه رسمی سازمان ملی استاندارد ایران (ISIRI Portal)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Copyright Compliance Notice */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1.5 text-xs">
                <h5 className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  رعایت حقوق مالکیت معنوی و کپی‌رایت سازمان ملی استاندارد
                </h5>
                <p className="leading-relaxed">
                  {standard.copyrightNotice ||
                    'حقوق مادی و معنوی متن کامل استانداردها متعلق به سازمان ملی استاندارد ایران است. در این سامانه صرفاً داده‌های کنترلی، حدود مجاز، روش‌های محاسباتی و فراداده‌های لازم جهت تضمین کیفیت و انطباق آزمایشگاهی مطابق با قانون عرضه شده‌اند.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: IMMUTABLE AUDIT TRAIL & TEST RESULTS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  <Lock className="w-4 h-4" />
                  <span>معماری تغییرناپذیری نتایج آزمایش (Immutable Standard Snapshots)</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  هنگامی که نتیجه هر آزمون آزمایشگاهی در سامانه ثبت می‌گردد، شناسه، نسخه، نوبت تجدیدنظر و حدود مجاز استاندارد جاری در آن لحظه قفل شده و به عنوان یک اسنپ‌شات تغییرناپذیر در پایگاه داده ثبت می‌شود. اگر این استاندارد در آینده تغییر یا تجدیدنظر یابد، نتایج پیشین هرگز خراب یا مخدوش نخواهند شد و سندیت حقوقی و آزمایشگاهی آن‌ها در هر ممیزی حفظ می‌گردد.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  سوابق آزمایش‌های انجام‌شده تحت این استاندارد:
                </h4>
                <span className="text-xs text-stone-500 font-mono">
                  {testResults.length} نتیجه ثبت‌شده
                </span>
              </div>

              {loadingResults ? (
                <div className="p-8 text-center text-xs text-stone-400">در حال بارگذاری نتایج...</div>
              ) : testResults.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400 border border-dashed rounded-xl border-stone-200 dark:border-stone-800">
                  تاکنون نتیجه آزمایشی برای این استاندارد ثبت نشده است. روی دکمه «ثبت نتیجه آزمون» کلیک نمایید.
                </div>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-800 dark:text-stone-200">
                            کد نمونه: {result.sampleCode}
                          </span>
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            {result.sampleNameFa}
                          </span>
                          {result.batchNumber && (
                            <span className="text-[11px] text-stone-400 font-mono">
                              (بچ: {result.batchNumber})
                            </span>
                          )}
                        </div>

                        {/* Verdict Badge */}
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            result.verdict === 'compliant'
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : result.verdict === 'borderline'
                              ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {result.verdict === 'compliant'
                            ? '✅ منطبق با استاندارد'
                            : result.verdict === 'borderline'
                            ? '⚠️ در مرز انطباق'
                            : '❌ عدم انطباق'}
                        </span>
                      </div>

                      {/* Test and Value */}
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div>
                          <span className="text-stone-500">عنوان آزمون: </span>
                          <span className="font-medium text-stone-800 dark:text-stone-200">
                            {result.testNameFa}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500">مقدار اندازه‌گیری شده: </span>
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                            {result.measuredValue} {result.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500">تاریخ آزمون: </span>
                          <span className="font-mono text-stone-600 dark:text-stone-400">
                            {result.testDate}
                          </span>
                        </div>
                      </div>

                      {/* IMMUTABLE SNAPSHOT BADGE */}
                      <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 flex items-start gap-2 text-xs">
                        <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300">
                              نسخه استاندارد قفل‌شده در زمان آزمایش:
                            </span>
                            <span className="font-mono font-bold bg-white dark:bg-stone-900 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 text-stone-800 dark:text-stone-200">
                              {result.appliedStandardSnapshot.standardNumber} (
                              {result.appliedStandardSnapshot.revisionText})
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80">
                            حد ملاک آزمون در زمان اجرا: {result.appliedStandardSnapshot.appliedLimit}
                          </p>
                        </div>
                      </div>

                      {result.verdictNotesFa && (
                        <p className="text-xs text-stone-600 dark:text-stone-300">
                          یادداشت مسئول کنترل کیفیت: {result.verdictNotesFa}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-between text-xs text-stone-500">
          <span>کد شناسایی رکورد در سامانه: {standard.id}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
