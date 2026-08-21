/**
 * Food Science AI - New Lab Session Modal
 * Wizard to select reference standard, preview equipment/chemicals/conditions,
 * enter sample & operator details, configure replicates, and start execution.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  BookOpen,
  FlaskConical,
  Wrench,
  Gauge,
  Layers,
  Sparkles,
  CheckCircle2,
  FileText,
  User,
  Tag,
  AlertCircle
} from 'lucide-react';
import { FoodStandard } from '../../types/foodStandard';
import { getAllStandards } from '../../lib/storage/standardsStorage';
import { createNewLabSession } from '../../lib/storage/labStorage';
import { LabSession } from '../../types/laboratory';

interface NewLabSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated: (session: LabSession) => void;
}

export const NewLabSessionModal: React.FC<NewLabSessionModalProps> = ({
  isOpen,
  onClose,
  onSessionCreated
}) => {
  const [standards, setStandards] = useState<FoodStandard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<FoodStandard | null>(null);
  const [activeTab, setActiveTab] = useState<'standard' | 'sample_info'>('standard');

  // Form Fields
  const [title, setTitle] = useState('');
  const [sampleName, setSampleName] = useState('');
  const [sampleCode, setSampleCode] = useState(`SMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [batchNumber, setBatchNumber] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [replicateCount, setReplicateCount] = useState<number>(2);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStandards();
      setErrorMsg(null);
    }
  }, [isOpen]);

  const loadStandards = async () => {
    try {
      const all = await getAllStandards();
      setStandards(all);
    } catch (err) {
      console.error('Failed to load standards for lab modal:', err);
    }
  };

  if (!isOpen) return null;

  const filteredStandards = standards.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.standardNumber.toLowerCase().includes(q) ||
      s.titleFa.toLowerCase().includes(q) ||
      (s.titleEn && s.titleEn.toLowerCase().includes(q)) ||
      s.issuingOrganization.toLowerCase().includes(q)
    );
  });

  const handleSelectStandard = (standard: FoodStandard) => {
    setSelectedStandard(standard);
    if (!title) {
      setTitle(`آزمایش ${standard.titleFa} بر اساس ${standard.standardNumber}`);
    }
  };

  const handleStartSession = () => {
    if (!sampleName.trim()) {
      setErrorMsg('لطفاً نام نمونه غذایی را وارد نمایید.');
      setActiveTab('sample_info');
      return;
    }

    if (!sampleCode.trim()) {
      setErrorMsg('لطفاً کد رهگیری نمونه را وارد نمایید.');
      setActiveTab('sample_info');
      return;
    }

    if (!operatorName.trim()) {
      setErrorMsg('لطفاً نام کارشناس / آنالیزور آزمایشگاه را وارد نمایید.');
      setActiveTab('sample_info');
      return;
    }

    try {
      const newSession = createNewLabSession({
        title: title.trim() || `آزمایش ${sampleName} (${selectedStandard?.standardNumber || 'سفارشی'})`,
        sampleCode: sampleCode.trim(),
        sampleName: sampleName.trim(),
        batchNumber: batchNumber.trim() || undefined,
        operatorName: operatorName.trim(),
        notes: notes.trim() || undefined,
        standard: selectedStandard || undefined,
        replicateCount
      });

      onSessionCreated(newSession);
      onClose();
    } catch (err) {
      console.error('Error starting session:', err);
      setErrorMsg('خطایی در ایجاد نشست آزمایشگاهی رخ داد.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-850 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                شروع آزمایش جدید در آزمایشگاه دیجیتال
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                اتصال مستقیم به استاندارد مرجع، کنترل شرایط، ثبت مرحله‌به‌مرحله و تکرارها
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-150 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900 px-6 pt-3 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('standard')}
            className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'standard'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            ۱. انتخاب استاندارد مرجع و پیش‌نیازها
            {selectedStandard && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sample_info')}
            className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'sample_info'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            ۲. مشخصات نمونه، کارشناس و تکرارها
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: STANDARD SELECTION & PREVIEW */}
          {activeTab === 'standard' && (
            <div className="space-y-5">
              {/* Search standard box */}
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی استاندارد مرجع (مثلاً: INSO 2406، شیر، غلات، Codex، pH، رطوبت)..."
                  className="w-full text-xs pr-10 pl-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Standard Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto p-1">
                {/* Option for Custom Experiment without standard */}
                <div
                  onClick={() => setSelectedStandard(null)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedStandard === null
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      پروتکل سفارشی / بدون استاندارد خاص
                    </span>
                    {selectedStandard === null && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2">
                    ایجاد یک آزمون آزمایشگاهی آزاد با مراحل استاندارد عمومی، ثبت دما و وزن.
                  </p>
                </div>

                {filteredStandards.map((std) => {
                  const isSelected = selectedStandard?.id === std.id;
                  return (
                    <div
                      key={std.id}
                      onClick={() => handleSelectStandard(std)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                          : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                            {std.standardNumber}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                            {std.jurisdiction === 'iranian_national' ? 'ملی ایران 🇮🇷' : 'بین‌المللی 🌐'}
                          </span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200 line-clamp-1 mb-1">
                        {std.titleFa}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1">
                        {std.issuingOrganization} — {std.revisionAndYear}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Preview of Selected Standard Prerequisites */}
              {selectedStandard ? (
                <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      پیش‌نمایش الزامات استخراج‌شده از {selectedStandard.standardNumber}:
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {selectedStandard.acceptableLimits?.length || 0} حد مجاز تعریف‌شده
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1 flex items-center gap-1">
                        <Wrench className="w-3.5 h-3.5 text-stone-500" />
                        تجهیزات الزامی ({selectedStandard.requiredEquipment?.length || 0}):
                      </span>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2">
                        {selectedStandard.requiredEquipment?.join('، ') || 'تجهیزات عمومی'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1 flex items-center gap-1">
                        <FlaskConical className="w-3.5 h-3.5 text-stone-500" />
                        معرف‌ها و مواد ({selectedStandard.reagentsAndChemicals?.length || 0}):
                      </span>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2">
                        {selectedStandard.reagentsAndChemicals?.join('، ') || 'بدون معرف اختصاصی'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-stone-500" />
                        شرایط آزمون:
                      </span>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2">
                        {selectedStandard.testConditions || 'شرایط متعارف دمای محیط'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 text-stone-500 text-xs text-center">
                  یک استاندارد انتخاب کنید یا با حالت پروتکل عمومی ادامه دهید.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAMPLE INFO, OPERATOR & REPLICATES */}
          {activeTab === 'sample_info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sample Name */}
                <div>
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1">
                    نام نمونه غذایی <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={sampleName}
                    onChange={(e) => setSampleName(e.target.value)}
                    placeholder="مثلاً: شیر پاستوریزه ۲.۵٪ چربی، رب گوجه فرنگی، آرد گندم"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Sample Code */}
                <div>
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1">
                    کد شناسایی / رهگیری نمونه <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={sampleCode}
                    onChange={(e) => setSampleCode(e.target.value)}
                    placeholder="مثلاً: SMP-2026-489"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                {/* Batch / Lot */}
                <div>
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1">
                    شماره بهر / سری ساخت (Lot / Batch No)
                  </label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="اختیاری: مثلاً LOT-99402"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                {/* Operator Name */}
                <div>
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1">
                    نام کارشناس / آنالیزور آزمایشگاه <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="مثلاً: دکتر متین جهانبانی"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Title & Replicate count */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1">
                    عنوان جلسه آزمایشگاهی
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان آزمایش"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1">
                    تعداد تکرارهای اولیه (Replicates)
                  </label>
                  <select
                    value={replicateCount}
                    onChange={(e) => setReplicateCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  >
                    <option value={1}>۱ تکرار (تک نمونه)</option>
                    <option value={2}>۲ تکرار (Duplicate - استاندارد QC)</option>
                    <option value={3}>۳ تکرار (Triplicate - دقت پژوهشی)</option>
                    <option value={4}>۴ تکرار</option>
                  </select>
                </div>
              </div>

              {/* Initial Notes */}
              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                  یادداشت‌های اولیه یا مشخصات تکمیلی نمونه:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اختیاری: وضعیت ظاهری نمونه هنگام تحویل، شرایط نگهداری، دمای اولیه..."
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 rounded-b-2xl flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            انصراف
          </button>

          <div className="flex items-center gap-2">
            {activeTab === 'standard' ? (
              <button
                type="button"
                onClick={() => setActiveTab('sample_info')}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                ادامه و ثبت مشخصات نمونه →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartSession}
                className="px-6 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <FlaskConical className="w-4 h-4" />
                شروع آزمایش در آزمایشگاه دیجیتال
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
