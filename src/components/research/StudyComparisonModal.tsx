import React, { useState } from 'react';
import { Columns, X, Sparkles, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { compareResearchStudies, StudyComparisonResult } from '../../lib/research/researchAiEngine';
import { LiteratureReviewItem } from '../../types/research';

interface StudyComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableStudies: LiteratureReviewItem[];
}

export const StudyComparisonModal: React.FC<StudyComparisonModalProps> = ({
  isOpen,
  onClose,
  availableStudies
}) => {
  const [studyAIndex, setStudyAIndex] = useState<number>(0);
  const [studyBIndex, setStudyBIndex] = useState<number>(availableStudies.length > 1 ? 1 : 0);

  // Manual custom input toggles
  const [useCustom, setUseCustom] = useState(availableStudies.length < 2);
  const [titleA, setTitleA] = useState('');
  const [methodA, setMethodA] = useState('');
  const [findingsA, setFindingsA] = useState('');

  const [titleB, setTitleB] = useState('');
  const [methodB, setMethodB] = useState('');
  const [findingsB, setFindingsB] = useState('');

  const [comparison, setComparison] = useState<StudyComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRunComparison = () => {
    setLoading(true);
    try {
      let dataA: { title: string; methodology: string; findings: string; year?: string };
      let dataB: { title: string; methodology: string; findings: string; year?: string };

      if (!useCustom && availableStudies.length >= 2) {
        const a = availableStudies[studyAIndex] || availableStudies[0];
        const b = availableStudies[studyBIndex] || availableStudies[1];
        dataA = {
          title: a.title,
          methodology: a.methodology,
          findings: a.findings,
          year: a.year?.toString()
        };
        dataB = {
          title: b.title,
          methodology: b.methodology,
          findings: b.findings,
          year: b.year?.toString()
        };
      } else {
        dataA = {
          title: titleA || 'پژوهش اول',
          methodology: methodA || 'روش آزمایشگاهی الف',
          findings: findingsA || 'نتایج اول'
        };
        dataB = {
          title: titleB || 'پژوهش دوم',
          methodology: methodB || 'روش آزمایشگاهی ب',
          findings: findingsB || 'نتایج دوم'
        };
      }

      const res = compareResearchStudies(dataA, dataB);
      setComparison(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  مقایسه تطبیقی دو مقاله یا دو روش آزمایشگاهی (Comparative Synthesis)
                </h3>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                تحلیل وجوه اشتراک، تفاوت‌های متدولوژی، علل تناقض یافته‌ها و پیشنهاد تلفیق بهینه
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selection Area */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs">
          {availableStudies.length >= 2 && (
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setUseCustom(false)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  !useCustom
                    ? 'bg-indigo-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                انتخاب از مراجع ثبت‌شده پروژه ({availableStudies.length})
              </button>
              <button
                onClick={() => setUseCustom(true)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  useCustom
                    ? 'bg-indigo-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                ورود دستی دو مقاله / دو متد
              </button>
            </div>
          )}

          {!useCustom && availableStudies.length >= 2 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  پژوهش اول (مطالعه پایه یا مرجع اول):
                </label>
                <select
                  value={studyAIndex}
                  onChange={(e) => setStudyAIndex(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  {availableStudies.map((s, idx) => (
                    <option key={s.id} value={idx}>
                      {s.title} ({s.year})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  پژوهش دوم (مطالعه مقایسه‌ای یا روش رقیب):
                </label>
                <select
                  value={studyBIndex}
                  onChange={(e) => setStudyBIndex(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  {availableStudies.map((s, idx) => (
                    <option key={s.id} value={idx}>
                      {s.title} ({s.year})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 space-y-2">
                <div className="font-bold text-stone-800 dark:text-stone-200">مشخصات پژوهش یا روش اول</div>
                <input
                  type="text"
                  value={titleA}
                  onChange={(e) => setTitleA(e.target.value)}
                  placeholder="عنوان مقاله یا روش (مثال: نانوپوشش کیتوزان با اولتراسوند)"
                  className="w-full px-2 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
                <textarea
                  value={methodA}
                  onChange={(e) => setMethodA(e.target.value)}
                  placeholder="روش کار، متغیرها و تجهیزات به کار رفته..."
                  rows={2}
                  className="w-full px-2 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 resize-none"
                />
              </div>

              <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 space-y-2">
                <div className="font-bold text-stone-800 dark:text-stone-200">مشخصات پژوهش یا روش دوم</div>
                <input
                  type="text"
                  value={titleB}
                  onChange={(e) => setTitleB(e.target.value)}
                  placeholder="عنوان مقاله یا روش (مثال: پوشش آلژینات با اکستروژن سرد)"
                  className="w-full px-2 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
                <textarea
                  value={methodB}
                  onChange={(e) => setMethodB(e.target.value)}
                  placeholder="روش کار، متغیرها و تجهیزات به کار رفته..."
                  rows={2}
                  className="w-full px-2 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 resize-none"
                />
              </div>
            </div>
          )}

          <div className="mt-3 flex justify-end">
            <button
              onClick={handleRunComparison}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'در حال پردازش...' : 'اجرای مقایسه تطبیقی'}</span>
            </button>
          </div>
        </div>

        {/* Comparison Output */}
        <div className="p-4 overflow-y-auto flex-1 text-xs">
          {!comparison ? (
            <div className="p-8 text-center text-stone-500 dark:text-stone-400">
              <Columns className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
              <p className="font-semibold text-stone-700 dark:text-stone-300">
                دو پژوهش یا متد را انتخاب کرده و روی «اجرای مقایسه تطبیقی» کلیک فرمایید.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table comparison */}
              <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-stone-800">
                      <th className="p-3 w-1/4">محور مقایسه</th>
                      <th className="p-3 w-1/3 bg-indigo-50/40 dark:bg-indigo-950/20">
                        {comparison.studyA.title}
                      </th>
                      <th className="p-3 w-1/3 bg-emerald-50/40 dark:bg-emerald-950/20">
                        {comparison.studyB.title}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    {comparison.matrixComparison.map((row, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                        <td className="p-3 font-semibold text-stone-800 dark:text-stone-200 align-top">
                          <div>{row.aspectTitleFa}</div>
                          <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 font-normal">
                            {row.criticalNotesFa}
                          </div>
                        </td>
                        <td className="p-3 text-stone-700 dark:text-stone-300 leading-relaxed align-top bg-indigo-50/20 dark:bg-indigo-950/10">
                          {row.valueStudyA}
                        </td>
                        <td className="p-3 text-stone-700 dark:text-stone-300 leading-relaxed align-top bg-emerald-50/20 dark:bg-emerald-950/10">
                          {row.valueStudyB}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Synthesis & Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20">
                  <div className="font-bold text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>سنتز و جمع‌بندی تطبیقی (Overall Synthesis):</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {comparison.overallSynthesisFa}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20">
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>پیشنهاد متدولوژیک برای پروژه شما:</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {comparison.methodologicalSuperiorityFa}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
