import React, { useState } from 'react';
import { 
  PieChart, 
  Droplets, 
  Flame, 
  Dna, 
  Scale, 
  Wheat, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Info,
  Layers
} from 'lucide-react';
import { MAJOR_FOOD_COMPONENTS_DATA } from '../../data/foodChemistryData';
import { MajorFoodComponentProfile } from '../../types/foodChemistry';

interface MajorComponentsViewerProps {
  onSelectComponentForTest?: (componentId: string) => void;
}

export const MajorComponentsViewer: React.FC<MajorComponentsViewerProps> = ({
  onSelectComponentForTest
}) => {
  const [expandedCompId, setExpandedCompId] = useState<string | null>('comp-moisture');

  const getComponentIcon = (id: string) => {
    switch (id) {
      case 'comp-moisture':
        return <Droplets className="w-5 h-5 text-sky-500" />;
      case 'comp-ash':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'comp-protein':
        return <Dna className="w-5 h-5 text-emerald-500" />;
      case 'comp-fat':
        return <Scale className="w-5 h-5 text-yellow-500" />;
      case 'comp-fiber':
        return <Wheat className="w-5 h-5 text-lime-500" />;
      case 'comp-carbohydrates':
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
      default:
        return <PieChart className="w-5 h-5 text-indigo-500" />;
    }
  };

  const getThemeColors = (id: string) => {
    switch (id) {
      case 'comp-moisture':
        return { border: 'border-sky-200', bg: 'bg-sky-50/50', badge: 'bg-sky-100 text-sky-800' };
      case 'comp-ash':
        return { border: 'border-amber-200', bg: 'bg-amber-50/50', badge: 'bg-amber-100 text-amber-800' };
      case 'comp-protein':
        return { border: 'border-emerald-200', bg: 'bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-800' };
      case 'comp-fat':
        return { border: 'border-yellow-200', bg: 'bg-yellow-50/50', badge: 'bg-yellow-100 text-yellow-800' };
      case 'comp-fiber':
        return { border: 'border-lime-200', bg: 'bg-lime-50/50', badge: 'bg-lime-100 text-lime-800' };
      case 'comp-carbohydrates':
        return { border: 'border-indigo-200', bg: 'bg-indigo-50/50', badge: 'bg-indigo-100 text-indigo-800' };
      default:
        return { border: 'border-slate-200', bg: 'bg-slate-50', badge: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div id="major-food-components-container" className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <PieChart className="w-6 h-6 text-indigo-400" />
              آنالیز تقریبی ترکیبات اصلی مواد غذایی (Weende Proximate Analysis)
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              پروفایل ۶ ترکیب ماکرو و ساختاری غذا: رطوبت، خاکستر، پروتئین، چربی، فیبر و کربوهیدرات‌های کل به همراه مبانی بیوشیمیایی، روش‌های تحلیلی استاندارد AOAC/INSO و مقادیر متداول در ماتریس‌های مختلف غذایی.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 text-xs space-y-1 text-indigo-200">
            <div className="font-semibold text-white">فرمول موازنه ماده خشک:</div>
            <div>ماده خشک = ۱۰۰ - درصد رطوبت</div>
            <div>کربوهیدرات = ۱۰۰ - (رطوبت + خاکستر + پروتئین + چربی)</div>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MAJOR_FOOD_COMPONENTS_DATA.map((comp) => {
          const isExpanded = expandedCompId === comp.id;
          const colors = getThemeColors(comp.id);

          return (
            <div
              key={comp.id}
              id={`card-${comp.id}`}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md flex flex-col ${
                isExpanded ? `${colors.border} ring-2 ring-indigo-500/20` : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className={`p-5 ${colors.bg} border-b border-slate-100 flex items-start justify-between gap-3`}>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-100 shrink-0">
                    {getComponentIcon(comp.id)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      {comp.componentFa}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5" dir="ltr">
                      {comp.componentEn}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${colors.badge}`}>
                  {comp.caloricValueKcalPerGram} kcal/g
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {comp.definitionFa}
                  </p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-indigo-500" />
                      نقش تغذیه‌ای و فیزیولوژیک:
                    </span>
                    <p className="text-slate-600 leading-normal">
                      {comp.nutritionalRoleFa}
                    </p>
                  </div>

                  {/* Typical Ranges Preview */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      دامنه‌های معمول در ماتریس‌های غذایی:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {comp.typicalRangesInFoods.slice(0, 4).map((r, i) => (
                        <div key={i} className="bg-slate-50/80 p-1.5 rounded-lg border border-slate-100 flex items-center justify-between">
                          <span className="text-slate-600 text-[11px] truncate">{r.foodCategory}:</span>
                          <span className="font-bold text-slate-800 text-[11px] shrink-0 mr-1">{r.typicalRange}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        روش‌های استاندارد آزمایشگاهی (Standard Methods):
                      </span>
                      <div className="space-y-1 text-xs">
                        {comp.standardAnalyticalMethods.map((m, i) => (
                          <div key={i} className="p-2 bg-indigo-50/40 rounded-lg border border-indigo-100/50">
                            <div className="font-semibold text-slate-800">{m.methodNameFa}</div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                              <span className="font-mono text-indigo-700 font-medium">{m.standardCode}</span>
                              <span className="text-slate-600">{m.speedVsAccuracy}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50 text-xs space-y-1">
                      <span className="font-semibold text-amber-900">شیمی و برهم‌کنش‌ها در فرآوری:</span>
                      <p className="text-amber-800 leading-normal text-[11px]">
                        {comp.chemistryAndInteractionsFa}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-700">شاخص‌های کلیدی کنترل کیفیت (QC):</span>
                      <div className="flex flex-wrap gap-1">
                        {comp.keyQualityFactors.map((factor, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Toggle Details Button */}
                <button
                  id={`btn-toggle-comp-${comp.id}`}
                  onClick={() => setExpandedCompId(isExpanded ? null : comp.id)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      بستن جزئیات تخصصی
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      مشاهده روش‌های استاندارد و مکانیسم شیمیایی
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
