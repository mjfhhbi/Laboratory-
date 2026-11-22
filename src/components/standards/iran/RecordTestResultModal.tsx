import React, { useState } from 'react';
import {
  IranianStandard,
  IranianStandardTestResult,
  IranianTestType,
  IRANIAN_TEST_TYPE_CONFIG
} from '../../../types/iranianStandard';
import { recordTestResultWithSnapshot } from '../../../lib/storage/iranianStandardsStorage';
import {
  X,
  Lock,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Calendar,
  User,
  Hash,
  Package
} from 'lucide-react';

interface RecordTestResultModalProps {
  standard: IranianStandard | null;
  selectedClauseId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedResult: IranianStandardTestResult) => void;
}

export const RecordTestResultModal: React.FC<RecordTestResultModalProps> = ({
  standard,
  selectedClauseId,
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen || !standard) return null;

  const initialClause =
    standard.linkedTests.find((t) => t.id === selectedClauseId) ||
    standard.linkedTests[0];

  const [activeClauseId, setActiveClauseId] = useState<string>(initialClause?.id || '');
  const [sampleCode, setSampleCode] = useState(`SMP-${Date.now().toString().slice(-5)}`);
  const [sampleNameFa, setSampleNameFa] = useState(standard.linkedProducts[0]?.nameFa || standard.titleFa);
  const [batchNumber, setBatchNumber] = useState(`B-${new Date().getFullYear()}-01`);
  const [testDate, setTestDate] = useState(new Date().toLocaleDateString('fa-IR'));
  const [operatorName, setOperatorName] = useState('کارشناس کنترل کیفیت QC');
  const [measuredValue, setMeasuredValue] = useState<string>('');
  const [verdict, setVerdict] = useState<'compliant' | 'non_compliant' | 'borderline'>('compliant');
  const [verdictNotesFa, setVerdictNotesFa] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTest = standard.linkedTests.find((t) => t.id === activeClauseId) || standard.linkedTests[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!measuredValue.trim()) {
      setError('لطفاً مقدار اندازه‌گیری شده را وارد فرمایید.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const saved = await recordTestResultWithSnapshot({
        standard,
        selectedTestClauseId: currentTest?.id,
        sampleCode: sampleCode.trim(),
        sampleNameFa: sampleNameFa.trim(),
        batchNumber: batchNumber.trim(),
        productGroup: standard.productGroup,
        testDate: testDate.trim(),
        operatorName: operatorName.trim(),
        testNameFa: currentTest ? currentTest.testNameFa : 'آزمون عمومی استاندارد',
        testType: currentTest ? currentTest.testType : 'physicochemical',
        measuredValue: isNaN(Number(measuredValue)) ? measuredValue : Number(measuredValue),
        unit: currentTest ? currentTest.unit : '%',
        verdict,
        verdictNotesFa: verdictNotesFa.trim() || `آزمون انطباق با ${standard.standardNumber} انجام شد.`,
        notes: notes.trim()
      });

      onSuccess(saved);
      onClose();
    } catch (err: any) {
      setError(err.message || 'خطا در ثبت نتیجه آزمایش');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                ثبت نتیجه آزمون و قفل اسنپ‌شات استاندارد
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                مبنا: {standard.standardNumber} ({standard.revisionText} - {standard.ratificationYear})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Immutable Snapshot Warning Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-xs">تضمین تغییرناپذیری تاریخی (Historical Immutability):</span>
              <p className="text-[11px] leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">
                این نتیجه به همراه نسخه <strong>{standard.version}</strong> (<strong>{standard.revisionText}</strong> - مصوب {standard.ratificationYear}) قفل و ذخیره خواهد شد. حتی اگر این استاندارد در آینده توسط سازمان ملی استاندارد بازنگری یا منسوخ شود، این نتیجه آزمون بدون تغییر با نسخه زمان اجرای خود در بایگانی آزمایشگاه باقی خواهد ماند.
              </p>
            </div>
          </div>

          {/* Clause Selection */}
          {standard.linkedTests.length > 0 && (
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                بند آزمون استاندارد مورد نظر:
              </label>
              <select
                value={activeClauseId}
                onChange={(e) => setActiveClauseId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {standard.linkedTests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.testNameFa} ({t.standardClause ? `${t.standardClause} - ` : ''}حد: {t.acceptableLimit})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Active Test Limit Info */}
          {currentTest && (
            <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-stone-500">حد مجاز استاندارد: </span>
                <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  {currentTest.acceptableLimit}
                </span>
              </div>
              <div>
                <span className="text-stone-500">یکا: </span>
                <span className="font-mono text-stone-800 dark:text-stone-200">
                  {currentTest.unit}
                </span>
              </div>
            </div>
          )}

          {/* Sample Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                کد رهگیری نمونه:
              </label>
              <input
                type="text"
                value={sampleCode}
                onChange={(e) => setSampleCode(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                شماره بچ / سری ساخت:
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                dir="ltr"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                نام نمونه / محصول:
              </label>
              <input
                type="text"
                value={sampleNameFa}
                onChange={(e) => setSampleNameFa(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                تاریخ انجام آزمون:
              </label>
              <input
                type="text"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                نام کارشناس / اپراتور:
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Measured Value and Verdict */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                مقدار به دست آمده ({currentTest?.unit || 'یکا'}):
              </label>
              <input
                type="text"
                value={measuredValue}
                onChange={(e) => setMeasuredValue(e.target.value)}
                placeholder="مثال: 3.15 یا 14.5..."
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                نتیجه انطباق (Verdict):
              </label>
              <select
                value={verdict}
                onChange={(e) => setVerdict(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="compliant">✅ انطباق کامل (Pass / Compliant)</option>
                <option value="borderline">⚠️ در مرز انطباق (Borderline)</option>
                <option value="non_compliant">❌ عدم انطباق (Fail / Non-compliant)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                یادداشت کارشناسی انطباق / توضیحات ممیزی:
              </label>
              <input
                type="text"
                value={verdictNotesFa}
                onChange={(e) => setVerdictNotesFa(e.target.value)}
                placeholder="توضیحات تکمیلی مسئول کنترل کیفیت..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{submitting ? 'در حال ثبت...' : 'ثبت قطعی با قفل اسنپ‌شات'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
