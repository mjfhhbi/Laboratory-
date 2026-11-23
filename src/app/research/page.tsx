import React, { useState, useEffect } from 'react';
import { appConfirm } from '../../components/common/DialogProvider';
import { 
  getAllResearchProjects, 
  saveResearchProject, 
  deleteResearchProject, 
  createBlankResearchProject 
} from '../../lib/storage/researchStorage';
import { 
  ResearchProject, 
  FoodResearchCategory, 
  AcademicLevel, 
  LiteratureReviewItem 
} from '../../types/research';
import { 
  GraduationCap, 
  Plus, 
  Sparkles, 
  Search, 
  Filter, 
  BookOpen, 
  ShieldCheck, 
  Columns, 
  Trash2, 
  Calendar, 
  Sliders, 
  Network, 
  ArrowLeft,
  Copy,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ScientificIntegrityBanner } from '../../components/research/ScientificIntegrityBanner';
import { ResearchProjectEditor } from '../../components/research/ResearchProjectEditor';
import { AiIdeaModal } from '../../components/research/AiIdeaModal';
import { AiLiteratureFinderModal } from '../../components/research/AiLiteratureFinderModal';
import { StudyComparisonModal } from '../../components/research/StudyComparisonModal';

const CATEGORY_LABELS: Record<FoodResearchCategory, string> = {
  food_nanotechnology: 'نانوفناوری غذایی',
  dairy: 'صنایع لبنی',
  meat_poultry_fish: 'گوشت و شیلات',
  packaging_shelf_life: 'بسته‌بندی و ماندگاری',
  byproduct_valorization: 'ارزش‌افزایی پسماندها',
  functional_foods: 'غذاهای فراسودمند',
  oils_fats: 'روغن‌ها و چربی‌ها',
  cereal_bakery: 'غلات و صنعت پخت',
  beverage_fermentation: 'نوشیدنی‌ها و تخمیر',
  fruits_vegetables: 'فناوری باغبانی',
  confectionery_sweets: 'شیرینی و شکلات'
};

const LEVEL_LABELS: Record<AcademicLevel, string> = {
  bachelor: 'کارشناسی',
  master: 'کارشناسی ارشد',
  phd: 'دکتری تخصصی',
  industrial_rd: 'R&D صنعتی'
};

export default function ResearchPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // Modals
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showFinderModal, setShowFinderModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const list = await getAllResearchProjects();
      setProjects(list);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    const newProject = createBlankResearchProject();
    await saveResearchProject(newProject);
    setProjects([newProject, ...projects]);
    setSelectedProjectId(newProject.id);
  };

  const handleSaveProject = async (updated: ResearchProject) => {
    await saveResearchProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!(await appConfirm('آیا از حذف این پروژه تحقیقاتی اطمینان دارید؟'))) return;
    await deleteResearchProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    }
  };

  const handleDuplicateProject = async (proj: ResearchProject, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup: ResearchProject = {
      ...proj,
      id: 'proj-' + Date.now().toString(36),
      title: `${proj.title} (نسخه رونوشت)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await saveResearchProject(dup);
    setProjects([dup, ...projects]);
  };

  const handleAdoptIdea = async (newProj: ResearchProject) => {
    await saveResearchProject(newProj);
    setProjects([newProj, ...projects]);
    setSelectedProjectId(newProj.id);
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (levelFilter !== 'all' && p.academicLevel !== levelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q) || (p.englishTitle || '').toLowerCase().includes(q);
      const matchProb = p.problemStatement.toLowerCase().includes(q);
      const matchTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchProb && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Main Header */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-700 text-white shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                    دستیار پژوهش و پایان‌نامه صنایع غذایی (Research & Thesis Assistant)
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    بخش ۲۵ از ۳۰
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
                  سامانه ساختاربندی پروپوزال، طرح‌های آماری (DoE)، ممیزی نقادانه روش تحقیق و ماتریس پیشینه پژوهش بدون توهم منبع یا استناد جعلی
                </p>
              </div>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
              <button
                onClick={() => setShowIdeaModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>ایده‌پردار هوشمند (AI)</span>
              </button>

              <button
                onClick={() => setShowComparisonModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              >
                <Columns className="w-4 h-4" />
                <span>مقایسه مقالات</span>
              </button>

              <button
                onClick={handleCreateNew}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>ساخت پروژه تحقیقاتی جدید</span>
              </button>
            </div>
          </div>
        </div>

        {/* If in Editor Mode */}
        {selectedProject ? (
          <ResearchProjectEditor
            project={selectedProject}
            onSave={handleSaveProject}
            onBack={() => setSelectedProjectId(null)}
            onOpenAiLiteratureFinder={() => setShowFinderModal(true)}
            onOpenStudyComparison={() => setShowComparisonModal(true)}
          />
        ) : (
          /* Projects Dashboard / List View */
          <div className="space-y-4">
            {/* Scientific Integrity Banner */}
            <ScientificIntegrityBanner />

            {/* Filter Bar */}
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute right-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو در عناوین، فرضیات و تگ‌ها..."
                    className="w-full pr-9 pl-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-2.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                  >
                    <option value="all">همه گرایش‌ها ({projects.length})</option>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>

                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="px-2.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                  >
                    <option value="all">همه مقاطع</option>
                    {Object.entries(LEVEL_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-12 text-center shadow-xs">
                <GraduationCap className="w-12 h-12 mx-auto text-stone-300 dark:text-stone-600 mb-3" />
                <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                  هیچ پروژه تحقیقاتی با فیلترهای انتخابی یافت نشد
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
                  می‌توانید یک پروژه خالی ایجاد کنید یا از ایده‌پرداز هوشمند برای پیشنهاد موضوعات نوآورانه پایان‌نامه استفاده نمایید.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setShowIdeaModal(true)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    ایده‌پردار هوشمند (AI)
                  </button>
                  <button
                    onClick={handleCreateNew}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                  >
                    پروژه جدید
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((proj) => {
                  const indepCount = proj.variables.filter((v) => v.type === 'independent').length;
                  const depCount = proj.variables.filter((v) => v.type === 'dependent').length;
                  const ctrlCount = proj.variables.filter((v) => v.type === 'control').length;

                  return (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4.5 hover:border-emerald-500/70 dark:hover:border-emerald-500/70 transition-all cursor-pointer shadow-xs flex flex-col justify-between group space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              {LEVEL_LABELS[proj.academicLevel]}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                              {CATEGORY_LABELS[proj.category]}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={(e) => handleDuplicateProject(proj, e)}
                              className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                              title="تکثیر پروژه"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteProject(proj.id, e)}
                              className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                              title="حذف پروژه"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm mt-2 leading-relaxed group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {proj.title}
                        </h3>
                        {proj.englishTitle && (
                          <div className="font-mono text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1" dir="ltr">
                            {proj.englishTitle}
                          </div>
                        )}

                        <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                          {proj.problemStatement || 'شرح مسئله ثبت نشده است...'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                        {/* Metrics bar */}
                        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1" title="متغیرهای پژوهش">
                              <Sliders className="w-3.5 h-3.5 text-stone-400" />
                              <span>{indepCount} مستقل | {depCount} پاسخ | {ctrlCount} کنترل</span>
                            </span>
                            <span className="flex items-center gap-1" title="مراجع مستند در ماتریس پیشینه">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                                {proj.literatureReview.length} منبع
                              </span>
                            </span>
                          </div>

                          <span className="font-mono text-[10px]">
                            {new Date(proj.updatedAt).toLocaleDateString('fa-IR')}
                          </span>
                        </div>

                        {/* DoE badge */}
                        {proj.experimentalDesignStructure && (
                          <div className="p-1.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[10px] text-indigo-900 dark:text-indigo-300 flex items-center justify-between">
                            <span className="font-medium flex items-center gap-1">
                              <Network className="w-3 h-3 text-indigo-600" />
                              {proj.experimentalDesignStructure.designNameFa}
                            </span>
                            <span className="font-mono font-bold">
                              {proj.experimentalDesignStructure.totalRuns} ران
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Global Modals */}
        <AiIdeaModal
          isOpen={showIdeaModal}
          onClose={() => setShowIdeaModal(false)}
          onAdoptIdea={handleAdoptIdea}
        />

        <AiLiteratureFinderModal
          isOpen={showFinderModal}
          onClose={() => setShowFinderModal(false)}
          category={selectedProject?.category || 'food_nanotechnology'}
          defaultKeywords={selectedProject ? [selectedProject.title, ...selectedProject.variables.map((v) => v.name)] : []}
          onAddLiteratureItem={(item) => {
            if (selectedProject) {
              const updated = {
                ...selectedProject,
                literatureReview: [...selectedProject.literatureReview, item]
              };
              handleSaveProject(updated);
            }
          }}
        />

        <StudyComparisonModal
          isOpen={showComparisonModal}
          onClose={() => setShowComparisonModal(false)}
          availableStudies={selectedProject ? selectedProject.literatureReview : []}
        />
      </div>
    </div>
  );
}
