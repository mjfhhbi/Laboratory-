import React, { useState } from 'react';
import { 
  ResearchProject, 
  FoodResearchCategory, 
  AcademicLevel, 
  ResearchVariable, 
  LiteratureReviewItem 
} from '../../types/research';
import { 
  Save, 
  ArrowRight, 
  FileText, 
  HelpCircle, 
  Sliders, 
  Network, 
  FlaskConical, 
  BookOpen, 
  BarChart3, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Plus,
  Trash2,
  Copy,
  Download
} from 'lucide-react';
import { LiteratureReviewTable } from './LiteratureReviewTable';
import { VariablesManager } from './VariablesManager';
import { MethodologyStructureCard } from './MethodologyStructureCard';
import { WeaknessesAuditCard } from './WeaknessesAuditCard';
import { SuggestedExperimentsCard } from './SuggestedExperimentsCard';
import { ScientificIntegrityBanner } from './ScientificIntegrityBanner';
import { 
  generateResearchQuestions, 
  structureResearchMethodology, 
  auditResearchWeaknesses, 
  suggestExperimentsForProject 
} from '../../lib/research/researchAiEngine';

interface ResearchProjectEditorProps {
  project: ResearchProject;
  onSave: (updated: ResearchProject) => void;
  onBack: () => void;
  onOpenAiLiteratureFinder: () => void;
  onOpenStudyComparison: () => void;
}

type EditorTab = 
  | 'overview'
  | 'hypotheses'
  | 'variables'
  | 'methodology'
  | 'experiments'
  | 'literature'
  | 'results_discussion'
  | 'weaknesses';

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

export const ResearchProjectEditor: React.FC<ResearchProjectEditorProps> = ({
  project: initialProject,
  onSave,
  onBack,
  onOpenAiLiteratureFinder,
  onOpenStudyComparison
}) => {
  const [project, setProject] = useState<ResearchProject>(initialProject);
  const [activeTab, setActiveTab] = useState<EditorTab>('overview');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick inputs
  const [newQuestion, setNewQuestion] = useState('');
  const [newSpecificObjective, setNewSpecificObjective] = useState('');

  const handleSave = () => {
    onSave(project);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // AI Actions within editor
  const handleGenerateQuestionsAI = () => {
    const suggestions = generateResearchQuestions(
      project.title,
      project.problemStatement,
      project.variables
    );
    const qTexts = suggestions.map((s) => s.questionFa);
    setProject((prev) => ({
      ...prev,
      researchQuestions: Array.from(new Set([...prev.researchQuestions, ...qTexts]))
    }));
  };

  const handleStructureDoEAI = () => {
    const structure = structureResearchMethodology(project);
    setProject((prev) => ({
      ...prev,
      experimentalDesignStructure: structure,
      researchMethodology: {
        ...prev.researchMethodology,
        designType: structure.designNameFa
      }
    }));
  };

  const handleAuditWeaknessesAI = () => {
    const weaknesses = auditResearchWeaknesses(project);
    setProject((prev) => ({
      ...prev,
      weaknessesAndLimitations: weaknesses
    }));
    setActiveTab('weaknesses');
  };

  const handleSuggestExperimentsAI = () => {
    const suggestions = suggestExperimentsForProject(project);
    setProject((prev) => ({
      ...prev,
      suggestedExperiments: suggestions
    }));
    setActiveTab('experiments');
  };

  const handleExportSummary = () => {
    const text = `
# شناسنامه پروژه تحقیقاتی: ${project.title}
عنوان انگلیسی: ${project.englishTitle || '---'}
مقطع: ${LEVEL_LABELS[project.academicLevel]}
گرایش: ${CATEGORY_LABELS[project.category]}

## ۱. بیان مسئله:
${project.problemStatement || '---'}

## ۲. اهداف پژوهش:
هدف اصلی: ${project.objectives.mainObjective || '---'}
اهداف اختصاصی:
${project.objectives.specificObjectives.map((o) => '- ' + o).join('\n') || '---'}

## ۳. فرضیات:
فرض صفر (H0): ${project.hypotheses.nullHypothesis || '---'}
فرض آزمون (H1): ${project.hypotheses.alternativeHypothesis || '---'}

## ۴. متغیرها:
مستقل: ${project.variables.filter((v) => v.type === 'independent').map((v) => v.name).join('، ') || '---'}
وابسته: ${project.variables.filter((v) => v.type === 'dependent').map((v) => v.name).join('، ') || '---'}
کنترل: ${project.variables.filter((v) => v.type === 'control').map((v) => v.name).join('، ') || '---'}

## ۵. طرح آماری (DoE):
طرح: ${project.experimentalDesignStructure?.designNameFa || project.researchMethodology.designType || '---'}
تعداد ران‌ها: ${project.experimentalDesignStructure?.totalRuns || '---'}
نرم‌افزار: ${project.experimentalDesignStructure?.softwareRecommended || '---'}

## ۶. منابع و پیشینه (${project.literatureReview.length} منبع):
${project.literatureReview.map((lit, i) => `${i + 1}. ${lit.title} (${lit.year}) - ${lit.doiOrStandardNo || ''}`).join('\n')}
    `.trim();

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-proposal-${project.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Top action bar */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
            title="بازگشت به فهرست پروژه‌ها"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                {project.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                {LEVEL_LABELS[project.academicLevel]}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              گرایش: {CATEGORY_LABELS[project.category]} | آخرین به‌روزرسانی: {new Date(project.updatedAt).toLocaleDateString('fa-IR')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportSummary}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            title="دانلود خلاصه پروپوزال"
          >
            <Download className="w-3.5 h-3.5" />
            <span>خروجی Markdown</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'ذخیره شد ✓' : 'ذخیره تغییرات'}</span>
          </button>
        </div>
      </div>

      {/* Scientific Integrity Banner */}
      <ScientificIntegrityBanner compact />

      {/* Tabs navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200 dark:border-stone-800 scrollbar-thin">
        {[
          { id: 'overview', label: 'شناسنامه و مشخصات', icon: FileText },
          { id: 'hypotheses', label: 'بیان مسئله، اهداف و فرضیات', icon: HelpCircle },
          { id: 'variables', label: 'متغیرها و جامعه آماری', icon: Sliders, badge: project.variables.length },
          { id: 'methodology', label: 'روش تحقیق و DoE', icon: Network },
          { id: 'experiments', label: 'پروتکل‌های آزمایش', icon: FlaskConical, badge: project.suggestedExperiments?.length },
          { id: 'literature', label: 'پیشینه و مراجع (مستند)', icon: BookOpen, badge: project.literatureReview.length },
          { id: 'weaknesses', label: 'ممیزی نقادانه روش', icon: AlertTriangle, badge: project.weaknessesAndLimitations?.length },
          { id: 'results_discussion', label: 'نتایج، بحث و نتیجه‌گیری', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as EditorTab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold text-xs transition-colors shrink-0 ${
                isActive
                  ? 'border-b-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-stone-900 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-850'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                عنوان فارسی تحقیق / پایان‌نامه *
              </label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                وضعیت پروژه
              </label>
              <select
                value={project.status}
                onChange={(e) => setProject({ ...project, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="draft">پیش‌نویس اولیه (Draft)</option>
                <option value="proposal_approved">پروپوزال تصویب‌شده</option>
                <option value="in_lab_testing">در حال اجرای آزمایش‌ها</option>
                <option value="analyzing_data">تحلیل آماری و نگارش</option>
                <option value="thesis_defense_ready">آماده دفاع / نهایی</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
              عنوان انگلیسی (English Title)
            </label>
            <input
              type="text"
              value={project.englishTitle || ''}
              onChange={(e) => setProject({ ...project, englishTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-left"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                گرایش تخصصی
              </label>
              <select
                value={project.category}
                onChange={(e) => setProject({ ...project, category: e.target.value as FoodResearchCategory })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                مقطع تحصیلی / سطح علمی
              </label>
              <select
                value={project.academicLevel}
                onChange={(e) => setProject({ ...project, academicLevel: e.target.value as AcademicLevel })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                {Object.entries(LEVEL_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
            <span className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              کلیدواژه‌های موضوعی (Tags):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(project.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-[11px] text-stone-700 dark:text-stone-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hypotheses & Problem Statement */}
      {activeTab === 'hypotheses' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-4">
            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                بیان مسئله و ضرورت انجام تحقیق (Problem Statement) *
              </label>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-1.5">
                توضیح چالش صنعتی، فساد میکروبی/اکسیداتیو، مخاطرات سلامت افزودنی‌های سنتزی، و ضرورت اجرای این پژوهش
              </p>
              <textarea
                value={project.problemStatement}
                onChange={(e) => setProject({ ...project, problemStatement: e.target.value })}
                rows={5}
                className="w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 leading-relaxed"
                placeholder="بیان چالش علمی و کاربردی تحقیق..."
              />
            </div>

            {/* Research Questions with AI */}
            <div className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-indigo-950 dark:text-indigo-200">
                    سوالات تحقیق (Research Questions - معیار FINER)
                  </span>
                </div>

                <button
                  onClick={handleGenerateQuestionsAI}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تولید سوالات استاندارد با AI</span>
                </button>
              </div>

              <div className="space-y-2">
                {project.researchQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-indigo-200/60 dark:border-indigo-800/60 flex items-start justify-between gap-2"
                  >
                    <span className="text-stone-800 dark:text-stone-200 leading-relaxed">
                      <strong>سوال {idx + 1}:</strong> {q}
                    </span>
                    <button
                      onClick={() =>
                        setProject({
                          ...project,
                          researchQuestions: project.researchQuestions.filter((_, i) => i !== idx)
                        })
                      }
                      className="text-stone-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="افزودن سوال تحقیق جدید..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                  />
                  <button
                    onClick={() => {
                      if (!newQuestion.trim()) return;
                      setProject({
                        ...project,
                        researchQuestions: [...project.researchQuestions, newQuestion.trim()]
                      });
                      setNewQuestion('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold shrink-0"
                  >
                    افزودن
                  </button>
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                  هدف اصلی پژوهش (Main Objective)
                </label>
                <input
                  type="text"
                  value={project.objectives.mainObjective}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      objectives: { ...project.objectives, mainObjective: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                  اهداف اختصاصی (Specific Objectives)
                </label>
                <div className="space-y-1.5 mb-2">
                  {project.objectives.specificObjectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2"
                    >
                      <span className="text-stone-800 dark:text-stone-200">{idx + 1}. {obj}</span>
                      <button
                        onClick={() =>
                          setProject({
                            ...project,
                            objectives: {
                              ...project.objectives,
                              specificObjectives: project.objectives.specificObjectives.filter((_, i) => i !== idx)
                            }
                          })
                        }
                        className="text-stone-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpecificObjective}
                    onChange={(e) => setNewSpecificObjective(e.target.value)}
                    placeholder="هدف اختصاصی جدید (مثال: سنجش ویژگی‌های حرارتی با DSC)..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                  <button
                    onClick={() => {
                      if (!newSpecificObjective.trim()) return;
                      setProject({
                        ...project,
                        objectives: {
                          ...project.objectives,
                          specificObjectives: [...project.objectives.specificObjectives, newSpecificObjective.trim()]
                        }
                      });
                      setNewSpecificObjective('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold shrink-0"
                  >
                    افزودن هدف
                  </button>
                </div>
              </div>
            </div>

            {/* Hypotheses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850">
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                  فرض صفر (H0 - Null Hypothesis)
                </label>
                <textarea
                  value={project.hypotheses.nullHypothesis}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      hypotheses: { ...project.hypotheses, nullHypothesis: e.target.value }
                    })
                  }
                  rows={2}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                  placeholder="عدم وجود تفاوت معنی‌دار بین تیمارها و نمونه شاهد..."
                />
              </div>

              <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850">
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                  فرض آزمون (H1 - Alternative Hypothesis)
                </label>
                <textarea
                  value={project.hypotheses.alternativeHypothesis}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      hypotheses: { ...project.hypotheses, alternativeHypothesis: e.target.value }
                    })
                  }
                  rows={2}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                  placeholder="وجود تفاوت معنی‌دار در بهینه‌سازی شاخص‌های کیفی در سطح اطمینان ۹۵٪..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Variables & Population */}
      {activeTab === 'variables' && (
        <div className="space-y-4">
          <VariablesManager
            variables={project.variables}
            onChange={(updated) => setProject({ ...project, variables: updated })}
          />

          {/* Population & Sample */}
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              جامعه آماری، نمونه‌گیری و شرایط نگهداری (Population & Sampling)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  ماتریکس ماده غذایی هدف (Target Matrix)
                </label>
                <input
                  type="text"
                  value={project.populationAndSample.targetMatrix}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      populationAndSample: { ...project.populationAndSample, targetMatrix: e.target.value }
                    })
                  }
                  placeholder="مثال: فیله سینه مرغ تازه، شیر گاو پاستوریزه..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  حجم نمونه و تعداد تکرار (Sample Size)
                </label>
                <input
                  type="text"
                  value={project.populationAndSample.sampleSize}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      populationAndSample: { ...project.populationAndSample, sampleSize: e.target.value }
                    })
                  }
                  placeholder="مثال: ۳ تکرار مستقل، در مجموع ۶۰ واحد آزمایشی..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  روش و پروتکل نمونه‌برداری (Sampling Protocol)
                </label>
                <input
                  type="text"
                  value={project.populationAndSample.samplingMethod || ''}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      populationAndSample: { ...project.populationAndSample, samplingMethod: e.target.value }
                    })
                  }
                  placeholder="نمونه‌برداری تصادفی بر پایه استاندارد ملی..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  شرایط انبارش و نگهداری نمونه‌ها (Storage Conditions)
                </label>
                <input
                  type="text"
                  value={project.populationAndSample.storageConditions || ''}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      populationAndSample: { ...project.populationAndSample, storageConditions: e.target.value }
                    })
                  }
                  placeholder="دمای ۴ ± ۱ درجه در تاریکی، رطوبت نسبی ۸۵٪..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Methodology & DoE */}
      {activeTab === 'methodology' && (
        <div className="space-y-4">
          <MethodologyStructureCard
            structure={project.experimentalDesignStructure}
            onAutoStructureAI={handleStructureDoEAI}
          />

          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              شرح تفصیلی روش تحقیق و آزمون‌های آماری
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  عنوان طرح آزمایشگاهی
                </label>
                <input
                  type="text"
                  value={project.researchMethodology.designType}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      researchMethodology: { ...project.researchMethodology, designType: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  روش تحلیل آماری و نرم‌افزار
                </label>
                <input
                  type="text"
                  value={project.researchMethodology.dataAnalysisMethod}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      researchMethodology: { ...project.researchMethodology, dataAnalysisMethod: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                تایم‌لاین نمونه‌برداری و فواصل زمانی پایش کینتیکی
              </label>
              <input
                type="text"
                value={project.researchMethodology.samplingTimeline}
                onChange={(e) =>
                  setProject({
                    ...project,
                    researchMethodology: { ...project.researchMethodology, samplingTimeline: e.target.value }
                  })
                }
                placeholder="مثال: روزهای ۰، ۳، ۶، ۹، ۱۲ و ۱۵ نگهداری در دمای یخچال"
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Experimental Procedures */}
      {activeTab === 'experiments' && (
        <div className="space-y-4">
          <SuggestedExperimentsCard
            experiments={project.suggestedExperiments || []}
            onAutoSuggestAI={handleSuggestExperimentsAI}
          />

          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              پروتکل‌های آزمایشگاهی و روش اجرای آزمون‌ها (Laboratory Procedures)
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              ثبت مراحل آماده‌سازی نمونه، عصاره‌گیری، کالیبراسیون دستگاه و مراحل گام به گام آزمون
            </p>
            <textarea
              value={project.experimentalProcedures || ''}
              onChange={(e) => setProject({ ...project, experimentalProcedures: e.target.value })}
              rows={6}
              className="w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 leading-relaxed"
              placeholder="شرح متدولوژی آماده‌سازی نمونه، دستگاه‌های مورد استفاده و فرمول‌های محاسباتی..."
            />
          </div>
        </div>
      )}

      {/* Tab 6: Literature Review Matrix */}
      {activeTab === 'literature' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-stone-800 dark:text-stone-200">
                ابزارهای مقایسه و جستجوی مراجع مستند
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenStudyComparison}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
              >
                <span>مقایسه دو مقاله یا دو روش</span>
              </button>
              <button
                onClick={onOpenAiLiteratureFinder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>یافتن منابع مستند در مخزن</span>
              </button>
            </div>
          </div>

          <LiteratureReviewTable
            items={project.literatureReview}
            onAddItem={() => {
              const blankItem: LiteratureReviewItem = {
                id: 'lit-' + Date.now().toString(36),
                title: 'عنوان پژوهش جدید',
                authors: ['نویسنده'],
                year: 2024,
                foodMatrix: 'صنایع غذایی',
                methodology: 'شرح متد',
                findings: 'یافته‌های کلیدی',
                isVerifiedAuthentic: false
              };
              setProject({
                ...project,
                literatureReview: [...project.literatureReview, blankItem]
              });
            }}
            onDeleteItem={(id) => {
              setProject({
                ...project,
                literatureReview: project.literatureReview.filter((l) => l.id !== id)
              });
            }}
            onOpenAiFinder={onOpenAiLiteratureFinder}
          />
        </div>
      )}

      {/* Tab 7: Weaknesses Audit */}
      {activeTab === 'weaknesses' && (
        <div className="space-y-4">
          <WeaknessesAuditCard
            weaknesses={project.weaknessesAndLimitations || []}
            onRunAuditAI={handleAuditWeaknessesAI}
          />
        </div>
      )}

      {/* Tab 8: Results, Discussion & Conclusion */}
      {activeTab === 'results_discussion' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-4">
            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                نتایج و یافته‌های پژوهش (Results)
              </label>
              <textarea
                value={project.results || ''}
                onChange={(e) => setProject({ ...project, results: e.target.value })}
                rows={4}
                className="w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 leading-relaxed"
                placeholder="داده‌های کمی، ضرایب معادله رگرسیون، جداول آنوا و نمودارهای خروجی..."
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                بحث، تفسیر مکانیزم‌ها و مقایسه با سایر محققین (Discussion)
              </label>
              <textarea
                value={project.discussion || ''}
                onChange={(e) => setProject({ ...project, discussion: e.target.value })}
                rows={4}
                className="w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 leading-relaxed"
                placeholder="تفسیر دلایل بیوشیمیایی و ساختاری تغییرات، مقایسه با پژوهش‌های پیشین..."
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                نتیجه‌گیری نهایی و پیشنهادات کاربردی (Conclusion & Future Work)
              </label>
              <textarea
                value={project.conclusion || ''}
                onChange={(e) => setProject({ ...project, conclusion: e.target.value })}
                rows={4}
                className="w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 leading-relaxed"
                placeholder="خلاصه دستاوردها، امکان توسعه در مقیاس صنعتی و پیشنهاد برای محققان بعدی..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
