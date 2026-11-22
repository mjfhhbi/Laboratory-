import React, { useState, useEffect, useMemo } from 'react';
import {
  IranianStandard,
  IranianStandardTestResult,
  IranianStandardsSearchFilters,
  IranianStandardsStatistics,
  IRANIAN_STANDARD_STATUS_CONFIG,
  IRANIAN_PRODUCT_GROUPS_CONFIG
} from '../../../types/iranianStandard';
import {
  getAllIranianStandards,
  searchIranianStandards,
  getIranianStandardsStatistics,
  getAllIranianTestResults,
  getIranianStandardByNumber
} from '../../../lib/storage/iranianStandardsStorage';
import { IranianStandardsFilterBar } from '../../../components/standards/iran/IranianStandardsFilterBar';
import { IranianStandardCard } from '../../../components/standards/iran/IranianStandardCard';
import { IranianStandardDetailModal } from '../../../components/standards/iran/IranianStandardDetailModal';
import { RecordTestResultModal } from '../../../components/standards/iran/RecordTestResultModal';
import { IranianStandardFormModal } from '../../../components/standards/iran/IranianStandardFormModal';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Plus,
  Lock,
  History,
  FileCheck,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  LayoutGrid,
  List,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const IranianStandardsPage: React.FC = () => {
  const [standards, setStandards] = useState<IranianStandard[]>([]);
  const [testResults, setTestResults] = useState<IranianStandardTestResult[]>([]);
  const [stats, setStats] = useState<IranianStandardsStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  // Active view: 'standards' vs 'audit'
  const [activeMainTab, setActiveMainTab] = useState<'standards' | 'audit'>('standards');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [filters, setFilters] = useState<IranianStandardsSearchFilters>({
    query: '',
    standardNumberQuery: '',
    titleQuery: '',
    productQuery: '',
    testQuery: '',
    productGroup: 'all',
    testType: 'all',
    status: 'all',
    mandatoryOnly: false
  });

  // Modals state
  const [selectedStandardForDetail, setSelectedStandardForDetail] = useState<IranianStandard | null>(null);
  const [selectedStandardForTest, setSelectedStandardForTest] = useState<IranianStandard | null>(null);
  const [selectedTestClauseId, setSelectedTestClauseId] = useState<string | undefined>(undefined);
  const [standardToEdit, setStandardToEdit] = useState<IranianStandard | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [allStd, allRes, st] = await Promise.all([
        searchIranianStandards(filters),
        getAllIranianTestResults(),
        getIranianStandardsStatistics()
      ]);
      setStandards(allStd);
      setTestResults(allRes);
      setStats(st);
    } catch (error) {
      console.error('Error loading Iranian standards data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      query: '',
      standardNumberQuery: '',
      titleQuery: '',
      productQuery: '',
      testQuery: '',
      productGroup: 'all',
      testType: 'all',
      status: 'all',
      mandatoryOnly: false
    });
  };

  const handleSelectReplacedStandard = async (standardNumber: string) => {
    const std = await getIranianStandardByNumber(standardNumber);
    if (std) {
      setSelectedStandardForDetail(std);
    } else {
      // Set standard number in filter to search
      setFilters((prev) => ({ ...prev, standardNumberQuery: standardNumber }));
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>سامانه مدیریت استانداردهای ملی ایران (INSO / ISIRI)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                پایگاه استانداردهای صنایع غذایی ایران
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                مدیریت جامع ویژگی‌ها، حدود مجاز، روش‌های آزمون، تجهیزات، فرمول‌های محاسباتی و تضمین تغییرناپذیری تاریخی نتایج آزمایشگاه در بازنگری‌های آینده.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setStandardToEdit(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-stone-950 flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت استاندارد جدید</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-3 border-t border-white/10">
              <div className="p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
                <span className="text-[11px] text-stone-300 block">کل استانداردها</span>
                <span className="text-lg font-bold font-mono text-white">{stats.total}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 backdrop-blur-xs border border-emerald-400/20">
                <span className="text-[11px] text-emerald-300 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> معتبر و جاری
                </span>
                <span className="text-lg font-bold font-mono text-emerald-300">{stats.valid}</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 backdrop-blur-xs border border-amber-400/20">
                <span className="text-[11px] text-amber-300 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> جایگزین‌شده
                </span>
                <span className="text-lg font-bold font-mono text-amber-300">{stats.superseded}</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 backdrop-blur-xs border border-rose-400/20">
                <span className="text-[11px] text-rose-300 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span> منسوخ
                </span>
                <span className="text-lg font-bold font-mono text-rose-300">{stats.obsolete}</span>
              </div>

              <div className="p-3 rounded-xl bg-stone-500/10 backdrop-blur-xs border border-stone-400/20">
                <span className="text-[11px] text-stone-300 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-stone-400"></span> نیازمند بررسی
                </span>
                <span className="text-lg font-bold font-mono text-stone-300">{stats.needsReview}</span>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 backdrop-blur-xs border border-cyan-400/20">
                <span className="text-[11px] text-cyan-300 block flex items-center gap-1">
                  <Lock className="w-3 h-3" /> اسنپ‌شات‌های قفل
                </span>
                <span className="text-lg font-bold font-mono text-cyan-300">
                  {stats.totalTestResultsRecorded}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Tabs Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMainTab('standards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeMainTab === 'standards'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>فهرست و ضوابط استانداردهای ایران ({standards.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeMainTab === 'audit'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>بایگانی تغییرناپذیر نتایج آزمون (Audit Trail - {testResults.length})</span>
          </button>
        </div>

        {activeMainTab === 'standards' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-800 text-emerald-600 shadow-xs'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
              title="نمای کارتی"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-800 text-emerald-600 shadow-xs'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
              title="نمای فشرده جدولی"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: STANDARDS DIRECTORY */}
      {activeMainTab === 'standards' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <IranianStandardsFilterBar
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            totalResults={standards.length}
          />

          {/* Standards Content */}
          {loading ? (
            <div className="py-20 text-center text-stone-400 text-xs flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
              <span>در حال بارگذاری استانداردهای ملی ایران...</span>
            </div>
          ) : standards.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 p-8 space-y-3">
              <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                استانداردی با این مشخصات یافت نشد
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                می‌توانید فیلترهای جستجو را بازنشانی کرده یا استاندارد ملی مد نظر را به سامانه اضافه فرمایید.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-200"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {standards.map((std) => (
                <IranianStandardCard
                  key={std.id}
                  standard={std}
                  onViewDetails={(s) => setSelectedStandardForDetail(s)}
                  onRecordTest={(s) => {
                    setSelectedStandardForTest(s);
                    setSelectedTestClauseId(undefined);
                  }}
                  onEdit={(s) => {
                    setStandardToEdit(s);
                    setIsFormModalOpen(true);
                  }}
                  onSelectReplacedStandard={handleSelectReplacedStandard}
                />
              ))}
            </div>
          ) : (
            /* Compact List View */
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-semibold">
                    <tr>
                      <th className="p-3.5">شماره استاندارد</th>
                      <th className="p-3.5">عنوان رسمی استاندارد</th>
                      <th className="p-3.5">وضعیت</th>
                      <th className="p-3.5">گروه محصول</th>
                      <th className="p-3.5">نوبت تجدیدنظر</th>
                      <th className="p-3.5">سال تصویب</th>
                      <th className="p-3.5 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                    {standards.map((std) => {
                      const statusMeta = IRANIAN_STANDARD_STATUS_CONFIG[std.status];
                      return (
                        <tr
                          key={std.id}
                          className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                        >
                          <td className="p-3.5 font-mono font-bold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                            {std.standardNumber}
                          </td>
                          <td className="p-3.5 font-semibold text-stone-900 dark:text-stone-100">
                            <div>{std.titleFa}</div>
                            {std.status === 'superseded' && std.supersededBy && (
                              <span className="text-[11px] text-amber-600 dark:text-amber-400">
                                جایگزین‌شده با {std.supersededBy.standardNumber}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusMeta.badgeClass}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`}
                              ></span>
                              {statusMeta.labelFa}
                            </span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {IRANIAN_PRODUCT_GROUPS_CONFIG[std.productGroup].titleFa}
                          </td>
                          <td className="p-3.5 font-mono whitespace-nowrap">{std.revisionText}</td>
                          <td className="p-3.5 font-mono whitespace-nowrap">
                            {std.ratificationYear}
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedStandardForDetail(std)}
                                className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-xs font-semibold"
                              >
                                شناسنامه
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStandardForTest(std);
                                  setSelectedTestClauseId(undefined);
                                }}
                                className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                              >
                                ثبت آزمون
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: IMMUTABLE AUDIT TRAIL & HISTORICAL TEST RESULTS */}
      {activeMainTab === 'audit' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <Lock className="w-5 h-5" />
              <span>پایش پایداری و سندیت نتایج آزمایش‌ها در برابر تغییرات استانداردها</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-4xl">
              هر رکورد در این جدول حاوی اسنپ‌شات کاملاً قفل‌شده از نسخه استاندارد در زمان انجام آزمون است. این معماری تضمین می‌کند که اگر استانداردی (مانند INSO 2406 یا INSO 2344) به ویرایش‌های بعدی ارتقا پیدا کند یا حتی منسوخ گردد، نتایج آزمون‌های قدیمی هرگز معیارهای سنجش خود را گم نکرده و سندیت ممیزی آن‌ها خدشه‌ناپذیر باقی خواهد ماند.
            </p>
          </div>

          <div className="space-y-3">
            {testResults.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-stone-900 text-white font-mono font-bold text-xs">
                      {res.sampleCode}
                    </span>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {res.sampleNameFa}
                    </h3>
                    <span className="text-xs text-stone-400 font-mono">
                      بچ: {res.batchNumber}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold border ${
                      res.verdict === 'compliant'
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : res.verdict === 'borderline'
                        ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {res.verdict === 'compliant'
                      ? '✅ تأیید انطباق با استاندارد'
                      : res.verdict === 'borderline'
                      ? '⚠️ در آستانه رواداری'
                      : '❌ عدم انطباق (رد)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg border border-stone-100 dark:border-stone-800">
                  <div>
                    <span className="text-stone-500">عنوان آزمون: </span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {res.testNameFa}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500">مقدار آزمون: </span>
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                      {res.measuredValue} {res.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500">تاریخ و مجری: </span>
                    <span className="text-stone-700 dark:text-stone-300">
                      {res.testDate} ({res.operatorName})
                    </span>
                  </div>
                </div>

                {/* IMMUTABLE SNAPSHOT CONTAINER */}
                <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs">
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300">
                        نسخه استاندارد قفل‌شده در پرونده این آزمون:
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 font-mono font-bold text-stone-900 dark:text-stone-100 border border-emerald-300 dark:border-emerald-800">
                        {res.appliedStandardSnapshot.standardNumber} (
                        {res.appliedStandardSnapshot.revisionText})
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        ورژن: {res.appliedStandardSnapshot.version}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-800 dark:text-emerald-400">
                      <span>حد مجاز ملاک در این نسخه: </span>
                      <span className="font-semibold">
                        {res.appliedStandardSnapshot.appliedLimit}
                      </span>
                    </div>
                  </div>
                </div>

                {res.verdictNotesFa && (
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    شرح انطباق: {res.verdictNotesFa}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* 1. Detail Modal */}
      <IranianStandardDetailModal
        standard={selectedStandardForDetail}
        isOpen={Boolean(selectedStandardForDetail)}
        onClose={() => setSelectedStandardForDetail(null)}
        onRecordTest={(std, clauseId) => {
          setSelectedStandardForDetail(null);
          setSelectedStandardForTest(std);
          setSelectedTestClauseId(clauseId);
        }}
        onSelectStandardByNumber={handleSelectReplacedStandard}
      />

      {/* 2. Record Test Result Modal */}
      <RecordTestResultModal
        standard={selectedStandardForTest}
        selectedClauseId={selectedTestClauseId}
        isOpen={Boolean(selectedStandardForTest)}
        onClose={() => {
          setSelectedStandardForTest(null);
          setSelectedTestClauseId(undefined);
        }}
        onSuccess={(saved) => {
          loadData();
          showToast(`نتیجه آزمون ${saved.sampleCode} با اسنپ‌شات استاندارد با موفقیت قفل و ثبت شد.`);
        }}
      />

      {/* 3. Create / Edit Standard Modal */}
      <IranianStandardFormModal
        standardToEdit={standardToEdit}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setStandardToEdit(null);
        }}
        onSuccess={(saved) => {
          loadData();
          showToast(`استاندارد ملی ${saved.standardNumber} با موفقیت ذخیره شد.`);
        }}
      />
    </div>
  );
};

export default IranianStandardsPage;
