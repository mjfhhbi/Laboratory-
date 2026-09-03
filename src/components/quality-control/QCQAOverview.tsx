import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Activity, 
  AlertTriangle, 
  FileText, 
  Scale, 
  Compass, 
  Sparkles, 
  ArrowRight,
  Boxes,
  Microscope,
  Award,
  BookOpen
} from 'lucide-react';
import { QC_QA_EDUCATIONAL_GUIDE } from '../../data/qualityControlData';

interface QCQAOverviewProps {
  totalBatchesCount: number;
  totalSamplesCount: number;
  totalTestsCount: number;
  activeDeviationsCount: number;
  onNavigateToTab: (tab: 'samples' | 'results' | 'charts' | 'deviations') => void;
}

export const QCQAOverview: React.FC<QCQAOverviewProps> = ({
  totalBatchesCount,
  totalSamplesCount,
  totalTestsCount,
  activeDeviationsCount,
  onNavigateToTab
}) => {
  return (
    <div id="qc-qa-overview-container" className="space-y-8">
      {/* Top Banner: Core Philosophy of Food Safety & QA/QC */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>سامانه کنترل کیفیت و تضمین کیفیت صنایع غذایی (ISO 17025 / GMP / GLP)</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug">
            مدیریت یکپارچه نمونه‌ها، بهمن‌ها، ردیابی آزمون‌ها و پایش آماری SPC
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {QC_QA_EDUCATIONAL_GUIDE.summaryFa} این سیستم با اعمال الزامات اکید استانداردهای مرجع، مانع از تولید حدود پذیرش ساختگی می‌شود و تمام محاسبات انحراف معیار، تکرارها، و نمودارهای شوهارت را بر پایه منابع موثق اعتبارسنجی می‌کند.
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div 
              onClick={() => onNavigateToTab('samples')}
              className="bg-slate-800/80 hover:bg-slate-800 cursor-pointer p-4 rounded-2xl border border-slate-700/60 transition-all group space-y-1"
            >
              <span className="text-xs text-slate-400 block font-medium">بهمن‌های ثبت‌شده</span>
              <div className="text-2xl font-black font-mono text-emerald-400 group-hover:text-emerald-300">
                {totalBatchesCount}
              </div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 group-hover:text-slate-300">
                مشاهده نمونه‌ها و بهمن <ArrowRight className="w-2.5 h-2.5 rtl:rotate-180" />
              </span>
            </div>

            <div 
              onClick={() => onNavigateToTab('results')}
              className="bg-slate-800/80 hover:bg-slate-800 cursor-pointer p-4 rounded-2xl border border-slate-700/60 transition-all group space-y-1"
            >
              <span className="text-xs text-slate-400 block font-medium">نتایج آزمون و تکرارها</span>
              <div className="text-2xl font-black font-mono text-indigo-400 group-hover:text-indigo-300">
                {totalTestsCount}
              </div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 group-hover:text-slate-300">
                ثبت و محاسبه SD / RSD <ArrowRight className="w-2.5 h-2.5 rtl:rotate-180" />
              </span>
            </div>

            <div 
              onClick={() => onNavigateToTab('charts')}
              className="bg-slate-800/80 hover:bg-slate-800 cursor-pointer p-4 rounded-2xl border border-slate-700/60 transition-all group space-y-1"
            >
              <span className="text-xs text-slate-400 block font-medium">پایش روند و نمودار شوهارت</span>
              <div className="text-2xl font-black font-mono text-amber-400 group-hover:text-amber-300">
                SPC Live
              </div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 group-hover:text-slate-300">
                قوانین وست‌گارد و خطوط کنترل <ArrowRight className="w-2.5 h-2.5 rtl:rotate-180" />
              </span>
            </div>

            <div 
              onClick={() => onNavigateToTab('deviations')}
              className="bg-slate-800/80 hover:bg-slate-800 cursor-pointer p-4 rounded-2xl border border-slate-700/60 transition-all group space-y-1"
            >
              <span className="text-xs text-slate-400 block font-medium">عدم انطباق و CAPA</span>
              <div className={`text-2xl font-black font-mono ${activeDeviationsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {activeDeviationsCount}
              </div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 group-hover:text-slate-300">
                اقدام اصلاحی و پیشگیرانه <ArrowRight className="w-2.5 h-2.5 rtl:rotate-180" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QC vs QA Deep-Dive Comparison Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-600" />
              ماتریس تبیین تمایزات بنیادین کنترل کیفیت (QC) و تضمین کیفیت (QA)
            </h3>
            <p className="text-xs text-slate-500">
              بررسی تطبیقی ۵ محور کلیدی در انطباق با الزامات ISO 17025 و صنایع فرآوری مواد غذایی.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
            راهنمای علمی - کاربردی
          </span>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="py-3 px-4 text-right font-bold text-slate-700 w-1/5">محور مقایسه</th>
                <th className="py-3 px-4 text-right font-bold text-indigo-900 bg-indigo-50/50 w-2/5 border-x border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>تضمین کیفیت (Quality Assurance - QA)</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-right font-bold text-emerald-900 bg-emerald-50/50 w-2/5">
                  <div className="flex items-center gap-1.5">
                    <Microscope className="w-4 h-4 text-emerald-600" />
                    <span>کنترل کیفیت (Quality Control - QC)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {QC_QA_EDUCATIONAL_GUIDE.comparisonPoints.map((pt, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800 bg-slate-50/30">
                    {pt.parameterFa}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 leading-relaxed bg-indigo-50/20 border-x border-slate-200/60">
                    {pt.qaFa}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 leading-relaxed bg-emerald-50/20">
                    {pt.qcFa}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strict Source Verification Principle Card */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 flex items-start gap-4">
        <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-amber-950 text-sm">
            اصل بنیادین اعتبارسنجی حدود پذیرش (Acceptance Limits Policy):
          </h4>
          <p className="text-amber-900 leading-relaxed">
            این سامانه تحت هیچ شرایطی حدود پذیرش (LSL / USL) فرآورده‌ها را بر مبنای حدس، الگوریتم‌های تخمینی یا داده‌های فرضی تولید نمی‌کند. هر حد مشخصات الزاماً باید دارای استناد دقیق به بند، جدول و شماره استاندارد ملی (INSO) یا بین‌المللی معتبر باشد. در صورتی که برای ترکیب یا ماتریسی استاندارد مدونی در پایگاه ثبت نشده باشد، سیستم صراحتاً وضعیت <strong>«حد پذیرش معتبر در داده‌های موجود یافت نشد.»</strong> را نمایش می‌دهد.
          </p>
        </div>
      </div>
    </div>
  );
};
