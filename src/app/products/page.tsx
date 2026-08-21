/**
 * Food Science AI - Food Product Development & Formulation Studio (/products)
 * Complete offline-first product development, formulation design, scaling, process engineering, and trial tracking.
 */

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Plus,
  Search,
  Filter,
  Sparkles,
  Layers,
  Scale,
  Sliders,
  CheckCircle2,
  Package,
  Activity,
  RefreshCw,
  WifiOff,
  Database,
  ArrowUpDown
} from 'lucide-react';
import {
  ProductDevelopmentProject,
  ProductCategory,
  ProductTargetObjective
} from '../../types/foodProduct';
import {
  getAllProductProjects,
  saveProductProject,
  deleteProductProject,
  duplicateProductProject
} from '../../lib/storage/productStorage';
import { ProductCard } from '../../components/products/ProductCard';
import { NewProductModal } from '../../components/products/NewProductModal';
import { ProductDetailView } from '../../components/products/ProductDetailView';
import { MultiFormulationCompareModal } from '../../components/products/MultiFormulationCompareModal';
import { AiProductAdvisorModal } from '../../components/products/AiProductAdvisorModal';

export const ProductsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProductDevelopmentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [activeProject, setActiveProject] = useState<ProductDevelopmentProject | null>(null);

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isGlobalCompareOpen, setIsGlobalCompareOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load projects from IndexedDB
  const loadProjects = async () => {
    setLoading(true);
    try {
      const list = await getAllProductProjects();
      setProjects(list);
    } catch (err) {
      console.error('Failed to load food product projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Save Project handler
  const handleSaveProject = async (updatedProject: ProductDevelopmentProject) => {
    try {
      await saveProductProject(updatedProject);
      setProjects((prev) =>
        prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
      if (activeProject && activeProject.id === updatedProject.id) {
        setActiveProject(updatedProject);
      }
    } catch (err) {
      console.error('Failed to save project:', err);
    }
  };

  // Duplicate Project handler
  const handleDuplicate = async (id: string) => {
    try {
      const duplicated = await duplicateProductProject(id);
      if (duplicated) {
        setProjects((prev) => [duplicated, ...prev]);
      }
    } catch (err) {
      console.error('Failed to duplicate project:', err);
    }
  };

  // Delete Project handler
  const handleDelete = async (id: string) => {
    try {
      await deleteProductProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (activeProject && activeProject.id === id) {
        setActiveProject(null);
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      p.productNameFa.toLowerCase().includes(q) ||
      (p.productNameEn && p.productNameEn.toLowerCase().includes(q)) ||
      p.code.toLowerCase().includes(q) ||
      p.leadFoodScientist.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  // KPI calculations
  const totalProjectsCount = projects.length;
  const inDesignCount = projects.filter(
    (p) => p.status === 'formulation_design' || p.status === 'pilot_trials'
  ).length;
  const totalFormulationsCount = projects.reduce(
    (acc, p) => acc + p.formulations.length,
    0
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* If inside active project detail view */}
      {activeProject ? (
        <ProductDetailView
          project={activeProject}
          onBack={() => {
            setActiveProject(null);
            loadProjects();
          }}
          onSave={handleSaveProject}
        />
      ) : (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-stone-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 backdrop-blur-sm">
                  <Database className="w-3.5 h-3.5" />
                  <span>سامانه آفلاین-اول مهندسی و توسعه محصول غذایی</span>
                </span>
                {isOffline && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>حالت آفلاین (ذخیره محلی IndexedDB)</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                طراحی و توسعه محصولات غذایی (Food Product R&D)
              </h1>
              <p className="text-sm text-stone-200 leading-relaxed">
                میزکار جامع مهندسی فرمولاسیون، موازنه جرمی ۱۰۰٪، محاسبات Scale Up/Down، طراحی فرآیند (دما، زمان و تجهیزات)، شرایط بسته‌بندی، کنترل کیفیت و ثبت آزمون‌های پایلوت بر پایه پایگاه دانش استانداردها.
              </p>

              {/* Action Bar */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <button
                  id="create-new-product-project-btn"
                  onClick={() => setIsNewModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-stone-950 flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>ایجاد پروژه محصول جدید</span>
                </button>

                <button
                  id="header-ai-advisor-btn"
                  onClick={() => {
                    if (projects.length > 0) {
                      setIsAiAdvisorOpen(true);
                    } else {
                      setIsNewModalOpen(true);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-2 backdrop-blur-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>مشاور هوشمند فرمولاسیون</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">پروژه‌های فعال</span>
                <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
                  {totalProjectsCount}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">در مرحله طراحی و پایلوت</span>
                <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
                  {inDesignCount}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">کل فرمولاسیون‌های توسعه‌یافته</span>
                <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
                  {totalFormulationsCount} نسخه
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filter & Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-products-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در پروژه‌ها، نام محصول، کد یا کارشناس مسئول..."
                className="w-full pl-3 pr-10 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Category Dropdown Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-500 shrink-0" />
              <select
                id="filter-category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="all">همه دسته‌های محصول ({projects.length})</option>
                <option value="dairy">لبنیات و بستنی</option>
                <option value="beverage">نوشیدنی‌ها و آبمیوه</option>
                <option value="sauces_condiments">سس و چاشنی</option>
                <option value="bakery_cereal">غلات، آرد و نان</option>
                <option value="functional_food">فرآورده فراسودمند</option>
                <option value="meat_poultry">فرآورده گوشتی</option>
                <option value="confectionery">قنادی و شیرینی</option>
                <option value="oils_fats">روغن‌ها و چربی‌ها</option>
              </select>
            </div>
          </div>

          {/* Project Cards Grid */}
          {loading ? (
            <div className="py-16 text-center text-stone-500 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="text-xs">در حال بارگذاری اطلاعات پروژه‌ها از دیتابیس محلی...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                هیچ پروژه‌ای مطابق فیلتر یافت نشد
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                با ایجاد پروژه جدید، فرمولاسیون، درصدهای وزنی، مقیاس تولید و پارامترهای کنترل کیفیت محصول خود را تعریف کنید.
              </p>
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
              >
                ایجاد اولین پروژه محصول
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((proj) => (
                <ProductCard
                  key={proj.id}
                  project={proj}
                  onOpen={(p) => setActiveProject(p)}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Project Modal */}
      {isNewModalOpen && (
        <NewProductModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onCreated={async (newProj) => {
            await saveProductProject(newProj);
            setProjects((prev) => [newProj, ...prev]);
            setActiveProject(newProj);
          }}
        />
      )}

      {/* Standalone AI Advisor Modal */}
      {isAiAdvisorOpen && projects.length > 0 && (
        <AiProductAdvisorModal
          isOpen={isAiAdvisorOpen}
          onClose={() => setIsAiAdvisorOpen(false)}
          project={projects[0]}
        />
      )}
    </div>
  );
};

export default ProductsPage;
