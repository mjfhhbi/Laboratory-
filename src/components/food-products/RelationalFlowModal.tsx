import React, { useState } from 'react';
import { FoodCatalogProduct, ProductTestSpecification, CatalogRelatedStandard, RelationalSource } from '../../types/foodProductsCatalog';
import { Network, FileCheck2, BookOpen, Layers, ShieldCheck, ArrowLeft, X, ExternalLink } from 'lucide-react';

interface RelationalFlowModalProps {
  product: FoodCatalogProduct;
  onClose: () => void;
}

export const RelationalFlowModal: React.FC<RelationalFlowModalProps> = ({ product, onClose }) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(product.tests[0]?.id || '');

  const activeTest = product.tests.find(t => t.id === selectedTestId) || product.tests[0];
  const activeStandard = activeTest 
    ? product.standards.find(s => s.id === activeTest.standardId) 
    : undefined;
  const activeSource = (activeStandard 
    ? product.sources.find(src => src.id === activeStandard.sourceId) 
    : undefined) || (activeTest?.sourceId 
    ? product.sources.find(src => src.id === activeTest.sourceId) 
    : undefined);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">زنجیره رابطه‌ای کنترل کیفیت</h2>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Product ← Tests ← Standards ← Sources
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                تطبیق بلادرنگ محصول با آزمون‌های مربوطه، استانداردهای ملی/بین‌المللی و مستندات مرجع تایید‌شده
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chain Interactive Canvas */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* 1. Product Node */}
            <div className="bg-white p-4 rounded-xl border-2 border-indigo-500/40 shadow-xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  ۱. فرآورده (Product)
                </span>
                <Layers className="w-4 h-4 text-indigo-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 line-clamp-2">{product.nameFa}</h4>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">{product.code}</div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">تعداد آزمون‌ها:</span>
                <span className="font-bold text-slate-700">{product.tests.length} پارامتر</span>
              </div>
            </div>

            {/* Link 1 -> 2 */}
            <div className="hidden md:flex justify-center text-slate-400">
              <div className="flex items-center gap-1 font-mono text-xs text-slate-400 bg-slate-200/60 px-2 py-1 rounded-full">
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>تعریف آزمون</span>
              </div>
            </div>

            {/* 2. Test Node (Active) */}
            <div className="bg-white p-4 rounded-xl border-2 border-emerald-500 shadow-xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ۲. مشخصه و آزمون (Test)
                </span>
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{activeTest?.nameFa}</h4>
              <div className="text-[11px] text-emerald-700 mt-1 font-mono">{activeTest?.code}</div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">حد مجاز:</span>
                <span className="font-bold text-emerald-800">
                  {activeTest?.minLimit !== undefined ? `>= ${activeTest.minLimit}` : ''}
                  {activeTest?.maxLimit !== undefined ? ` <= ${activeTest.maxLimit}` : ''}
                  {activeTest?.textLimitFa || ''} {activeTest?.unit || ''}
                </span>
              </div>
            </div>

            {/* Link 2 -> 3 */}
            <div className="hidden md:flex justify-center text-slate-400">
              <div className="flex items-center gap-1 font-mono text-xs text-slate-400 bg-slate-200/60 px-2 py-1 rounded-full">
                <ArrowLeft className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>الزام استاندارد</span>
              </div>
            </div>

            {/* 3. Standard Node */}
            <div className="bg-white p-4 rounded-xl border-2 border-blue-500/40 shadow-xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  ۳. استاندارد (Standard)
                </span>
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                {activeStandard?.standardNumber || 'استاندارد نامشخص'}
              </h4>
              <div className="text-[11px] text-slate-600 mt-1 line-clamp-1">{activeStandard?.titleFa}</div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">مرجع تدوین:</span>
                <span className="font-bold text-blue-700">{activeStandard?.organization}</span>
              </div>
            </div>

            {/* Link 3 -> 4 */}
            <div className="hidden md:flex justify-center text-slate-400">
              <div className="flex items-center gap-1 font-mono text-xs text-slate-400 bg-slate-200/60 px-2 py-1 rounded-full">
                <ArrowLeft className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>استناد به منبع</span>
              </div>
            </div>

            {/* 4. Source Node */}
            <div className="bg-white p-4 rounded-xl border-2 border-amber-500/40 shadow-xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  ۴. منبع معتبر (Source)
                </span>
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                {activeSource?.citationCode || 'منبع فاقد کد'}
              </h4>
              <div className="text-[11px] text-slate-600 mt-1 line-clamp-1">{activeSource?.issuingBodyOrAuthors}</div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">وضعیت استناد:</span>
                <span className="font-bold text-emerald-700">تایید شده رسمی</span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Selector and Detailed Relational Drilldown */}
        <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tests List for this Product */}
          <div className="lg:col-span-4 border-l border-slate-200 pl-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">انتخاب آزمون جهت ردیابی زنجیره:</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {product.tests.map((test) => {
                const isSelected = test.id === selectedTestId;
                const catBadgeClass = 
                  test.category === 'chemical' ? 'bg-amber-100 text-amber-800' :
                  test.category === 'microbial' ? 'bg-red-100 text-red-800' :
                  test.category === 'physical' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800';

                return (
                  <button
                    key={test.id}
                    onClick={() => setSelectedTestId(test.id)}
                    className={`w-full text-right p-3 rounded-xl border text-xs transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{test.nameFa}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${catBadgeClass}`}>
                        {test.category === 'chemical' ? 'شیمیایی' :
                         test.category === 'microbial' ? 'میکروبی' :
                         test.category === 'physical' ? 'فیزیکی' : 'حسی'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
                      <span>{test.code}</span>
                      <span className="text-emerald-700 font-semibold">{test.parameterAnalyte}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Verification Card */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>بررسی تطبیقی و استناد رسمی پارامتر «{activeTest?.nameFa}»</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                این مشخصه کنترلی به صورت مستقل از استاندارد ملی یا بین‌المللی مرتبط با فرآورده استخراج گردیده و حد پذیرش آن
                دارای استناد قطعی به مدرک مدون می‌باشد.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-slate-700 block border-b pb-1">مشخصات آزمون و پذیرش</span>
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">روش آزمون:</span>
                    <span className="font-semibold text-slate-800 text-left">{activeTest?.methodFa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">تواتر نمونه‌برداری:</span>
                    <span className="font-semibold text-slate-800">
                      {activeTest?.frequency === 'in_line' ? 'پیوسته در خط' :
                       activeTest?.frequency === 'each_batch' ? 'هر بهر (Batch)' :
                       activeTest?.frequency === 'daily' ? 'روزانه' :
                       activeTest?.frequency === 'raw_intake' ? 'ورود محموله' : 'دوره‌ای'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">درجه اهمیت کیفیت:</span>
                    <span className="font-bold text-red-600">
                      {activeTest?.criticality === 'critical_safety' ? 'بحرانی ایمنی (Critical Safety)' :
                       activeTest?.criticality === 'major_quality' ? 'عمده کیفی (Major Quality)' : 'انطباق استاندارد'}
                    </span>
                  </div>
                  {activeTest?.notesFa && (
                    <div className="p-2 bg-amber-50 rounded-lg text-[11px] text-amber-800 mt-2">
                      <strong>نکته تفسیری:</strong> {activeTest.notesFa}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-slate-700 block border-b pb-1">شناسنامه مدرک استاندارد و منبع</span>
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">شماره استاندارد:</span>
                    <span className="font-bold text-blue-700">{activeStandard?.standardNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">عنوان استاندارد:</span>
                    <span className="text-slate-800 font-medium text-left">{activeStandard?.titleFa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">کد ارجاع منبع:</span>
                    <span className="font-mono font-bold text-emerald-700">{activeSource?.citationCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">مرجع صادرکننده:</span>
                    <span className="text-slate-800">{activeSource?.issuingBodyOrAuthors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">سال نشر / تجدیدنظر:</span>
                    <span className="text-slate-800">{activeSource?.publicationYear}</span>
                  </div>
                  {activeSource?.officialReferenceOrUrl && (
                    <div className="pt-2">
                      <a
                        href={activeSource.officialReferenceOrUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        <span>مشاهده استناد در پایگاه رسمی استاندارد</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 px-6 flex items-center justify-between border-t border-slate-200">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>تمامی مشخصات این فرآورده دارای اعتبارسنجی مستقل و ردیابی کامل زنجیره‌ای هستند.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-all"
          >
            بستن پنجره دیاگرام
          </button>
        </div>
      </div>
    </div>
  );
};
