/**
 * Food Science AI - Product Project Card
 */

import React from 'react';
import { appConfirm } from '../common/DialogProvider';
import {
  FlaskConical,
  Scale,
  Layers,
  ChevronLeft,
  Copy,
  Trash2,
  Tag,
  Clock,
  Sparkles
} from 'lucide-react';
import { ProductDevelopmentProject, ProductCategory } from '../../types/foodProduct';
import { calculateFormulationSummary } from '../../lib/products/formulationEngine';

interface ProductCardProps {
  project: ProductDevelopmentProject;
  onOpen: (project: ProductDevelopmentProject) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_NAMES: Record<ProductCategory, { labelFa: string; color: string }> = {
  dairy: { labelFa: 'لبنیات و بستنی', color: 'blue' },
  beverage: { labelFa: 'نوشیدنی‌ها', color: 'cyan' },
  sauces_condiments: { labelFa: 'سس و چاشنی', color: 'amber' },
  bakery_cereal: { labelFa: 'غلات و نان', color: 'orange' },
  meat_poultry: { labelFa: 'فرآورده گوشتی', color: 'red' },
  confectionery: { labelFa: 'شیرینی و قنادی', color: 'pink' },
  oils_fats: { labelFa: 'روغن و چربی', color: 'yellow' },
  canned_preserved: { labelFa: 'کنسرو و فرآوری', color: 'stone' },
  snacks_extruded: { labelFa: 'تنقلات و اسنک', color: 'purple' },
  functional_food: { labelFa: 'فراسودمند / رژیمی', color: 'emerald' }
};

const STATUS_BADGES: Record<ProductDevelopmentProject['status'], { labelFa: string; classNames: string }> = {
  idea_draft: {
    labelFa: 'ایده‌پردازی اولیه',
    classNames: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
  },
  formulation_design: {
    labelFa: 'طراحی فرمولاسیون',
    classNames: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  pilot_trials: {
    labelFa: 'آزمون پایلوت',
    classNames: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  shelf_life_validation: {
    labelFa: 'صحه‌گذاری و ماندگاری',
    classNames: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  approved_scaled: {
    labelFa: 'تأیید نهایی / صنعتی',
    classNames: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  archived: {
    labelFa: 'آرشیو شده',
    classNames: 'bg-stone-200 dark:bg-stone-800 text-stone-500 border-stone-300'
  }
};

export const ProductCard: React.FC<ProductCardProps> = ({
  project,
  onOpen,
  onDuplicate,
  onDelete
}) => {
  const catMeta = CATEGORY_NAMES[project.category] || { labelFa: project.category, color: 'stone' };
  const statusMeta = STATUS_BADGES[project.status] || { labelFa: project.status, classNames: 'bg-stone-100' };

  // Calculate active formulation summary
  const activeForm = project.formulations.find(f => f.id === project.activeFormulationId) || project.formulations[0];
  const summary = activeForm ? calculateFormulationSummary(activeForm.ingredients) : null;

  return (
    <div
      id={`product-card-${project.id}`}
      className="group relative rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              {catMeta.labelFa}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${statusMeta.classNames}`}>
              {statusMeta.labelFa}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              title="تکثیر پروژه"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(project.id);
              }}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              title="حذف پروژه"
              onClick={async (e) => {
                e.stopPropagation();
                if (await appConfirm(`آیا از حذف پروژه "${project.productNameFa}" اطمینان دارید؟`)) {
                  onDelete(project.id);
                }
              }}
              className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Code */}
        <div className="mb-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {project.productNameFa}
            </h3>
          </div>
          {project.productNameEn && (
            <p className="text-xs text-stone-500 dark:text-stone-400 font-mono tracking-tight line-clamp-1" dir="ltr">
              {project.productNameEn}
            </p>
          )}
          <span className="inline-block mt-1 text-[11px] font-mono font-medium text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
            کد: {project.code}
          </span>
        </div>

        {/* Executive Summary */}
        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-4">
          {project.executiveSummaryFa}
        </p>

        {/* Formulation & Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 mb-4">
          <div className="text-center">
            <span className="block text-[10px] text-stone-600 dark:text-stone-300">نسخه‌های فرمول</span>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
              {project.formulations.length} نسخه
            </span>
          </div>
          <div className="text-center border-x border-stone-200 dark:border-stone-700">
            <span className="block text-[10px] text-stone-600 dark:text-stone-300">ماده خشک کل</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {summary ? `${summary.totalDryMatterPercent}%` : '—'}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-[10px] text-stone-600 dark:text-stone-300">مقیاس پیش‌فرض</span>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
              {project.productionScale === 'lab'
                ? 'آزمایشگاهی'
                : project.productionScale === 'pilot'
                ? 'پایلوت'
                : 'صنعتی'}
            </span>
          </div>
        </div>

        {/* Target Objectives Tags */}
        {project.targetObjectives && project.targetObjectives.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {project.targetObjectives.slice(0, 3).map((obj) => (
              <span
                key={obj}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
              >
                #{obj}
              </span>
            ))}
            {project.targetObjectives.length > 3 && (
              <span className="text-[10px] text-stone-600 dark:text-stone-300">
                +{project.targetObjectives.length - 3} مورد دیگر
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer & Open Action */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
        <div className="text-[11px] text-stone-600 dark:text-stone-300 flex items-center gap-1">
          <span>مسئول:</span>
          <span className="font-semibold text-stone-700 dark:text-stone-300">{project.leadFoodScientist}</span>
        </div>

        <button
          onClick={() => onOpen(project)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
        >
          <span>میز فرمولاسیون و فرآیند</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
