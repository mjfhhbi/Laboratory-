import React, { useState } from 'react';
import { Sparkles, X, Filter, BookOpen, Layers, ArrowLeft, Check, Lightbulb } from 'lucide-react';
import { FoodResearchCategory, AcademicLevel, ResearchProject } from '../../types/research';
import { suggestResearchIdeas, ResearchIdeaSuggestion } from '../../lib/research/researchAiEngine';
import { createBlankResearchProject } from '../../lib/storage/researchStorage';

interface AiIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdoptIdea: (project: ResearchProject) => void;
}

const CATEGORY_LABELS: Record<FoodResearchCategory, string> = {
  food_nanotechnology: 'نانوفناوری و انکپسولاسیون غذایی',
  dairy: 'صنایع شیر و فرآورده‌های لبنی',
  meat_poultry_fish: 'صنایع فرآورده‌های گوشتی، مرغ و شیلات',
  packaging_shelf_life: 'بسته‌بندی زیست‌تخریب‌پذیر و ماندگاری',
  byproduct_valorization: 'ارزش‌افزایی پسماندها و اقتصاد چرخشی',
  functional_foods: 'غذاهای فراسودمند و پروبیوتیک',
  oils_fats: 'روغن‌ها، چربی‌ها و اولئوژل‌ها',
  cereal_bakery: 'غلات، آرد و صنعت پخت',
  beverage_fermentation: 'نوشیدنی‌ها، تخمیر و کومبوچا',
  fruits_vegetables: 'فناوری پس از برداشت و فرآوری میوه',
  confectionery_sweets: 'شکلات، قنادی و شیرینی‌های رژیمی'
};

const LEVEL_LABELS: Record<AcademicLevel, string> = {
  bachelor: 'کارشناسی (پروژه پایانی)',
  master: 'کارشناسی ارشد (پایان‌نامه)',
  phd: 'دکتری تخصصی (رساله جامع)',
  industrial_rd: 'تحقیق و توسعه صنعتی (R&D)'
};

export const AiIdeaModal: React.FC<AiIdeaModalProps> = ({
  isOpen,
  onClose,
  onAdoptIdea
}) => {
  const [category, setCategory] = useState<FoodResearchCategory>('food_nanotechnology');
  const [level, setLevel] = useState<AcademicLevel>('master');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<ResearchIdeaSuggestion[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const results = await suggestResearchIdeas(category, level, keyword);
      setIdeas(results);
      if (results.length > 0) {
        setSelectedIdeaId(results[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = (idea: ResearchIdeaSuggestion) => {
    const blank = createBlankResearchProject(idea.category, idea.academicLevel);
    
    // Populate with AI suggestions
    blank.title = idea.titleFa;
    blank.englishTitle = idea.titleEn;
    blank.problemStatement = idea.problemSummaryFa;
    blank.objectives.mainObjective = `بررسی جامع و ارزیابی آزمایشگاهی ${idea.titleFa}`;
    
    // Variables
    blank.variables = [
      ...idea.suggestedVariables.independent.map((name, idx) => ({
        id: `indep-${idx}`,
        name,
        type: 'independent' as const,
        levelsOrRange: 'مقادیر بهینه‌سازی‌شده در طرح آماری'
      })),
      ...idea.suggestedVariables.dependent.map((name, idx) => ({
        id: `dep-${idx}`,
        name,
        type: 'dependent' as const,
        measurementMethod: 'استاندارد مرجع آزمایشگاهی'
      })),
      ...idea.suggestedVariables.controls.map((name, idx) => ({
        id: `ctrl-${idx}`,
        name,
        type: 'control' as const,
        description: 'تثبیت‌شده در کلیه تیمارها'
      }))
    ];

    blank.researchMethodology = {
      designType: idea.recommendedDesignFa,
      samplingTimeline: 'پایش کینتیکی دوره‌ای بر اساس طرح آزمایش',
      dataAnalysisMethod: 'آنالیز واریانس (ANOVA) و رگرسیون چندمتغیره'
    };

    blank.tags = [CATEGORY_LABELS[idea.category], LEVEL_LABELS[idea.academicLevel], 'ایده_AI'];

    onAdoptIdea(blank);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  ایده‌پرداز هوشمند پایان‌نامه و پروژه‌های تحقیقاتی
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  پیشنهاد هوش مصنوعی (تئوریک)
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                تولید موضوعات پژوهشی کاربردی، بدیع و قابل دفاع در دانشگاه‌ها و مراکز R&D صنایع غذایی
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

        {/* Filter Bar */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              گرایش و حوزه تخصصی
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FoodResearchCategory)}
              className="w-full px-2.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            >
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              مقطع تحصیلی / سطح پژوهش
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as AcademicLevel)}
              className="w-full px-2.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            >
              {Object.entries(LEVEL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              کلیدواژه یا ماده خام هدف (اختیاری)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="مثال: پروبیوتیک، کیتوزان، پکتین..."
                className="w-full px-2.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'در حال تحلیل...' : 'جستجو'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {ideas.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500 dark:text-stone-400">
              <Lightbulb className="w-12 h-12 mx-auto text-amber-500/60 mb-3" />
              <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
                ایده‌ای بارگذاری نشده است
              </p>
              <p className="mt-1 max-w-sm mx-auto">
                گرایش و مقطع خود را انتخاب کنید و روی دکمه «جستجو» کلیک نمایید تا عناوین و متدولوژی‌های پیشنهادی ایجاد شوند.
              </p>
              <button
                onClick={handleGenerate}
                className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                تولید ایده‌های پژوهشی
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea) => {
                const isSelected = selectedIdeaId === idea.id;
                return (
                  <div
                    key={idea.id}
                    onClick={() => setSelectedIdeaId(idea.id)}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-md ring-1 ring-indigo-500/40'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-relaxed">
                          {idea.titleFa}
                        </h4>
                        <div className="font-mono text-[11px] text-stone-500 dark:text-stone-400 mt-0.5" dir="ltr">
                          {idea.titleEn}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdopt(idea);
                        }}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>انتخاب این ایده</span>
                      </button>
                    </div>

                    {/* Innovation Angle */}
                    <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80 mb-2.5">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400">زاویه نوآوری و تمایز: </span>
                      <span className="text-stone-700 dark:text-stone-300">{idea.noveltyAngleFa}</span>
                    </div>

                    {/* Problem Summary */}
                    <div className="text-stone-600 dark:text-stone-300 leading-relaxed mb-2.5">
                      <span className="font-semibold text-stone-800 dark:text-stone-200">بیان مسئله: </span>
                      {idea.problemSummaryFa}
                    </div>

                    {/* Variables */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-lg bg-stone-100/70 dark:bg-stone-800/70 mb-2 text-[11px]">
                      <div>
                        <span className="font-bold text-stone-800 dark:text-stone-200 block mb-0.5">متغیرهای مستقل:</span>
                        <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 space-y-0.5">
                          {idea.suggestedVariables.independent.map((v, i) => (
                            <li key={i}>{v}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold text-stone-800 dark:text-stone-200 block mb-0.5">شاخص‌های پاسخ:</span>
                        <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 space-y-0.5">
                          {idea.suggestedVariables.dependent.map((v, i) => (
                            <li key={i}>{v}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold text-stone-800 dark:text-stone-200 block mb-0.5">متغیرهای کنترل:</span>
                        <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 space-y-0.5">
                          {idea.suggestedVariables.controls.map((v, i) => (
                            <li key={i}>{v}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* DoE and Impact */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                      <span className="text-stone-500 dark:text-stone-400">
                        <strong>طرح آماری:</strong> {idea.recommendedDesignFa}
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                        <strong>اثر صنعتی:</strong> {idea.keyIndustrialImpactFa}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
