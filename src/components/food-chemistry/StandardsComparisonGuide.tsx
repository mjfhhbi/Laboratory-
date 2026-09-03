import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Info, 
  Scale, 
  FileText,
  Sparkles
} from 'lucide-react';
import { ALL_FOOD_CHEMISTRY_TESTS } from '../../data/foodChemistryData';
import { FoodChemistryTest } from '../../types/foodChemistry';

interface StandardsComparisonGuideProps {
  onSelectTest: (test: FoodChemistryTest) => void;
}

export const StandardsComparisonGuide: React.FC<StandardsComparisonGuideProps> = ({
  onSelectTest
}) => {
  const [selectedAnalyteFilter, setSelectedAnalyteFilter] = useState<string>('all');

  const standardBodies = [
    {
      code: 'INSO',
      nameFa: 'سازمان ملی استاندارد ایران (ISIRI / INSO)',
      nameEn: 'Iranian National Standardization Organization',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      descriptionFa: 'استانداردهای ملی اجباری و تشویقی برای کنترل کیفیت صنایع غذایی، آرد، غلات، لبنیات، کنسرو و نوشیدنی‌ها در ایران.'
    },
    {
      code: 'AOAC',
      nameFa: 'انجمن رسمی شیمیدان‌های تحلیلی (AOAC International)',
      nameEn: 'Association of Official Analytical Collaboration',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      descriptionFa: 'معتبرترین مرجع جهانی در اعتبارسنجی روش‌های آنالیز شیمیایی و میکروبی مواد غذایی (Official Methods of Analysis).'
    },
    {
      code: 'ISO',
      nameFa: 'سازمان بین‌المللی استانداردسازی (ISO)',
      nameEn: 'International Organization for Standardization',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      descriptionFa: 'استانداردهای فنی جهانی برای محصولات غذایی و الزامات آزمایشگاه‌های آزمون و کالیبراسیون (ISO/IEC 17025).'
    },
    {
      code: 'AOCS',
      nameFa: 'انجمن شیمیدان‌های روغن آمریکا (AOCS)',
      nameEn: 'American Oil Chemists\' Society',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      descriptionFa: 'روش‌های رسمی مرجع برای آزمون‌های فیزیکوشیمیایی روغن‌ها، چربی‌ها، لیپیدها، عدد پراکسید و عدد صابونی.'
    }
  ];

  return (
    <div id="standards-comparison-guide-container" className="space-y-8">
      {/* Standards Bodies Intro Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
          <ShieldCheck className="w-6 h-6" />
          مراجع استاندارد ملی و بین‌المللی مورد استناد در آنالیز شیمی مواد غذایی
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          کلیه پروتکل‌ها، مقادیر و روش‌های آزمون در این سامانه منحصراً بر پایه مراجع استاندارد مدون و بدون داده‌های تخمینی تنظیم گردیده‌اند. در صورت وجود روش‌های موازی، ماتریس کاربرد و مزیت هر روش به تفکیک ارائه شده است.
        </p>

        {/* Bodies Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {standardBodies.map((b) => (
            <div key={b.code} className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700/60 space-y-1.5">
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${b.badgeColor}`}>
                {b.code}
              </span>
              <div className="font-bold text-white text-xs mt-1">{b.nameFa}</div>
              <p className="text-[11px] text-slate-400 leading-normal">{b.descriptionFa}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Methods Comparison Tables */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            جدول مقایسه تطبیقی روش‌های مرجع و روش‌های موازی شیمی مواد غذایی
          </h3>
        </div>

        <div className="space-y-6">
          {ALL_FOOD_CHEMISTRY_TESTS.map((test) => {
            const hasAlts = test.alternativeMethods && test.alternativeMethods.length > 0;

            return (
              <div key={test.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {/* Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">{test.titleFa}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {test.code}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono" dir="ltr">{test.titleEn}</span>
                  </div>

                  <button
                    onClick={() => onSelectTest(test)}
                    className="px-3 py-1.5 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition-colors shrink-0 flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    مشاهده پروتکل کامل
                  </button>
                </div>

                {/* Content Table / Grid */}
                <div className="p-4 space-y-4">
                  {/* Primary Method Row */}
                  <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[11px] font-bold">
                          روش مرجع اصلی (Primary Standard)
                        </span>
                        <span className="font-mono font-bold text-emerald-950 text-xs">
                          {test.primaryStandard.organization} {test.primaryStandard.standardNumber} ({test.primaryStandard.year || 'Standard'})
                        </span>
                      </div>
                      <span className="text-xs text-emerald-800 font-medium">
                        دامنه: {test.primaryStandard.scopeAndMatrix}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong>مبنای شیمیایی: </strong>{test.chemicalPrincipleFa}
                    </p>
                  </div>

                  {/* Alternative Methods if available */}
                  {hasAlts && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 block">
                        روش‌های موازی استاندارد (Alternative Valid Methods):
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {test.alternativeMethods!.map((alt) => (
                          <div key={alt.methodId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                            <div className="flex items-center justify-between border-b border-slate-200/70 pb-1.5">
                              <span className="font-bold text-slate-900">{alt.methodNameFa}</span>
                              <span className="font-mono text-indigo-700 font-semibold text-[11px]">
                                {alt.standardReferences[0]?.organization} {alt.standardReferences[0]?.standardNumber}
                              </span>
                            </div>
                            <p className="text-slate-600 leading-normal">
                              <strong>مبنا: </strong>{alt.principleFa}
                            </p>
                            <div className="text-[11px] text-slate-700">
                              <strong>ماتریس‌های کاربرد: </strong>{alt.applicableMatrixes.join('، ')}
                            </div>
                            <div className="pt-1 border-t border-slate-200/70 text-[11px] flex items-center justify-between text-slate-500">
                              <span className="text-emerald-700">مزیت: {alt.advantagesFa[0]}</span>
                              {alt.analysisTime && <span>زمان: {alt.analysisTime}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
