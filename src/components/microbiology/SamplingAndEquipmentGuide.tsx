import React, { useState } from 'react';
import { 
  Layers, 
  FlaskConical, 
  Thermometer, 
  Microscope, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Clock, 
  BookOpen, 
  Sliders,
  FileText,
  Filter
} from 'lucide-react';
import { MICROBIOLOGY_EQUIPMENT_DATABASE } from '../../data/microbiologyData';

export const SamplingAndEquipmentGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sampling_matrix' | 'sampling_plans' | 'equipment_catalog'>('sampling_matrix');

  // Interactive 3-Class Sampling Plan Tester State
  const [planN, setPlanN] = useState<number>(5); // n=5 sample units
  const [planC, setPlanC] = useState<number>(2); // c=2 allowed marginals
  const [planM, setPlanM] = useState<number>(100); // m=100 CFU/g acceptable limit
  const [planCapM, setPlanCapM] = useState<number>(1000); // M=1000 CFU/g max limit
  const [sampleCounts, setSampleCounts] = useState<number[]>([45, 80, 150, 220, 95]);

  // Evaluate Sampling Plan
  const marginalCount = sampleCounts.filter(x => x > planM && x <= planCapM).length;
  const defectiveCount = sampleCounts.filter(x => x > planCapM).length;
  const isPlanAccepted = defectiveCount === 0 && marginalCount <= planC;

  const handleUpdateSample = (index: number, val: number) => {
    setSampleCounts(prev => {
      const updated = [...prev];
      updated[index] = Math.max(0, val);
      return updated;
    });
  };

  return (
    <div className="space-y-6 text-right">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('sampling_matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sampling_matrix'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>آماده‌سازی بر اساس ماتریس غذایی (ISO 6887 Series)</span>
        </button>

        <button
          onClick={() => setActiveTab('sampling_plans')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sampling_plans'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>طرح‌های نمونه‌برداری ۲ و ۳ کلاسه (n, c, m, M - INSO 2394)</span>
        </button>

        <button
          onClick={() => setActiveTab('equipment_catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'equipment_catalog'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Microscope className="w-4 h-4" />
          <span>تجهیزات و اعتبارسنجی بیولوژیک (Equipment & Autoclave QC)</span>
        </button>
      </div>

      {/* ---------------- TAB 1: MATRIX PREPARATION (ISO 6887) ---------------- */}
      {activeTab === 'sampling_matrix' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>پروتکل‌های آماده‌سازی نمونه‌های غذایی بر مبنای استاندارد ISO 6887 / INSO 356</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              روش حل کردن و همگن‌سازی مواد غذایی مختلف با توجه به ساختار فیزیکی، مقدار چربی و اسیدیته جهت حفظ قابلیت زیست باکتری‌ها.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* General Solid Foods */}
            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100">فرآورده‌های عمومی جامد و گوشتی</h4>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">ISO 6887-2</span>
              </div>
              <ul className="space-y-1 text-stone-600 dark:text-stone-300 list-disc list-inside leading-relaxed">
                <li>توزین ۲۵ گرم از نمونه در شرایط کاملاً سترون (آسپتیک) با قیچی یا تیغ سترون.</li>
                <li>افزودن ۲۲۵ میلی‌لیتر آب پپتون بافر (BPW) در کیسه استوماکر فیلتردار.</li>
                <li>همگن‌سازی در دستگاه استوماکر به مدت ۱ الی ۲ دقیقه در دور استاندارد (۲۳۰ rpm).</li>
              </ul>
            </div>

            {/* High Fat / Butter */}
            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100">فرآورده‌های پرچرب، کره و مارگارین</h4>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">ISO 6887-5</span>
              </div>
              <ul className="space-y-1 text-stone-600 dark:text-stone-300 list-disc list-inside leading-relaxed">
                <li>توزین نمونه و افزودن رقیق‌کننده حاوی امولسیفایر (نظیر ۰/۱٪ الی ۱٪ توئین ۸۰ یا لسیتین).</li>
                <li>گرم‌کردن در بن‌ماری در دمای حداکثر ۴۴ الی ۴۵ درجه سانتی‌گراد تا ذوب کامل چربی (حداکثر ۲۰ دقیقه).</li>
                <li>میکس سریع با ورتکس یا استوماکر برای ایجاد امولسیون یکنواخت پیش از رقت‌سازی.</li>
              </ul>
            </div>

            {/* High Acid Foods */}
            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100">فرآورده‌های با اسیدیته بالا (آبمیوه‌ها، ترشیجات)</h4>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">ISO 6887-4</span>
              </div>
              <ul className="space-y-1 text-stone-600 dark:text-stone-300 list-disc list-inside leading-relaxed">
                <li>اسیدیته بالا می‌تواند باکتری‌های آسیب‌دیده را غیرفعال کند.</li>
                <li>تنظیم pH سوسپانسیون اولیه ۱:۱۰ به محدوده ۶/۸ الی ۷/۲ با استفاده از هیدروکسید سدیم سترون (NaOH 1M).</li>
                <li>استفاده از آب پپتون بافر با قدرت بافری دو برابر در صورت افت شدید pH.</li>
              </ul>
            </div>

            {/* Dry Powders & Spices */}
            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100">پودرهای خشک، شیرخشک و ادویه‌جات</h4>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">ISO 6887-4</span>
              </div>
              <ul className="space-y-1 text-stone-600 dark:text-stone-300 list-disc list-inside leading-relaxed">
                <li>مخلوط کردن آرام پودر با رقیق‌کننده ولرم (۲۰ تا ۳۰ درجه) جهت جلوگیری از تشکیل کلوخه.</li>
                <li>استراحت سوسپانسیون به مدت ۵ دقیقه جهت بازجذب آب (Resuscitation) سلول‌های باکتریایی خشک‌شده.</li>
                <li>در ادویه‌های ضدمیکروب (دارچین، میخک، آویشن)، افزایش نسبت رقت به ۱:۵۰ یا ۱:۱۰۰.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: SAMPLING PLANS (2 & 3 CLASS) ---------------- */}
      {activeTab === 'sampling_plans' && (
        <div className="space-y-6">
          <div className="p-4 bg-teal-50/60 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800 space-y-1 text-xs">
            <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>موتور ارزیابی طرح نمونه‌برداری ۳ کلاسه مواد غذایی (Three-Class Sampling Plan)</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300">
              بر اساس استاندارد ملی ایران INSO 2394 و کتاب راهنمای ICMSF: تعداد کل نمونه‌ها (n)، تعداد مجاز بین حد قابل قبول و حداکثر (c)، حد بهینه (m)، و حد بحرانی رد محموله (M).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Parameters Setup */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4 shadow-xs text-xs">
              <h4 className="font-bold text-stone-800 dark:text-stone-200 border-b border-stone-100 dark:border-stone-800 pb-2">
                پارامترهای استاندارد فرآورده
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">تعداد نمونه (n):</label>
                  <input
                    type="number"
                    value={planN}
                    onChange={(e) => setPlanN(Number(e.target.value) || 5)}
                    className="w-full px-2 py-1.5 border border-stone-300 dark:border-stone-700 rounded-lg text-center font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">حد مجاز مرزی (c):</label>
                  <input
                    type="number"
                    value={planC}
                    onChange={(e) => setPlanC(Number(e.target.value) || 2)}
                    className="w-full px-2 py-1.5 border border-stone-300 dark:border-stone-700 rounded-lg text-center font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">حد مطلوب m (CFU/g):</label>
                  <input
                    type="number"
                    value={planM}
                    onChange={(e) => setPlanM(Number(e.target.value) || 100)}
                    className="w-full px-2 py-1.5 border border-stone-300 dark:border-stone-700 rounded-lg text-center font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">حد بحرانی M (CFU/g):</label>
                  <input
                    type="number"
                    value={planCapM}
                    onChange={(e) => setPlanCapM(Number(e.target.value) || 1000)}
                    className="w-full px-2 py-1.5 border border-stone-300 dark:border-stone-700 rounded-lg text-center font-mono font-bold"
                  />
                </div>
              </div>

              {/* Sample Inputs */}
              <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <span className="font-bold text-stone-800 dark:text-stone-200">نتایج شمارش تک‌تک نمونه‌های آزموده شده (CFU/g):</span>
                <div className="grid grid-cols-5 gap-2">
                  {sampleCounts.map((val, idx) => {
                    const isDefective = val > planCapM;
                    const isMarginal = val > planM && val <= planCapM;

                    return (
                      <div key={idx} className="space-y-1 text-center">
                        <span className="text-[10px] text-stone-500 font-mono">نمونه {idx + 1}</span>
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => handleUpdateSample(idx, Number(e.target.value) || 0)}
                          className={`w-full py-1.5 border rounded-lg text-center font-mono font-bold text-xs ${
                            isDefective
                              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-700'
                              : isMarginal
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950 text-amber-800'
                              : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-800'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Decision Status Result */}
            <div className="lg:col-span-5 space-y-4">
              <div className={`rounded-2xl p-6 text-white space-y-4 shadow-lg ${
                isPlanAccepted
                  ? 'bg-gradient-to-br from-emerald-800 to-teal-900'
                  : 'bg-gradient-to-br from-rose-800 to-red-950'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold flex items-center gap-1.5 opacity-90">
                    {isPlanAccepted ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    وضعیت پذیرش محموله (Batch Conformance)
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-md">
                    INSO 2394
                  </span>
                </div>

                <div className="text-2xl font-black">
                  {isPlanAccepted ? '✅ محموله پذیرفته شد (Pass)' : '❌ محموله مردود است (Reject)'}
                </div>

                <div className="p-3 bg-white/10 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span>تعداد نمونه‌های مرزی (بین m و M):</span>
                    <span className="font-mono font-bold">{marginalCount} از {planC} مجاز</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تعداد نمونه‌های بحرانی (بزرگتر از M):</span>
                    <span className="font-mono font-bold">{defectiveCount} مورد (مجاز: ۰)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: EQUIPMENT & BIOSAFETY QC ---------------- */}
      {activeTab === 'equipment_catalog' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MICROBIOLOGY_EQUIPMENT_DATABASE.map((eq) => (
              <div key={eq.id} className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-3 text-xs shadow-2xs">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100">{eq.nameFa}</h4>
                    <p className="text-[11px] text-stone-400 font-mono" dir="ltr">{eq.nameEn}</p>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    پایش: {eq.calibrationAndMonitoring.frequency}
                  </span>
                </div>

                <div className="space-y-1.5 text-stone-600 dark:text-stone-300">
                  <p><strong className="text-stone-800 dark:text-stone-200">پارامترهای بحرانی:</strong> {eq.criticalParameters}</p>
                  <p><strong className="text-stone-800 dark:text-stone-200">دستورالعمل کاربری (SOP):</strong> {eq.standardOperationGuideline}</p>
                  <p><strong className="text-stone-800 dark:text-stone-200">روش کالیبراسیون و پایش:</strong> {eq.calibrationAndMonitoring.methodFa} ({eq.calibrationAndMonitoring.acceptanceCriteria})</p>
                  {eq.calibrationAndMonitoring.biologicalIndicator && (
                    <p><strong className="text-stone-800 dark:text-stone-200">اندیکاتور بیولوژیکی:</strong> <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{eq.calibrationAndMonitoring.biologicalIndicator}</span></p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
