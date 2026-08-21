import React from 'react';
import {
  KnowledgeCategory,
  KNOWLEDGE_CATEGORIES_META
} from '../../types/knowledgeBase';
import {
  FlaskConical,
  ShieldCheck,
  Boxes,
  Layers,
  Wrench,
  CheckSquare,
  Calculator,
  AlertTriangle,
  BookMarked,
  BookOpen,
  LayoutGrid
} from 'lucide-react';

interface KnowledgeCategoryTabsProps {
  activeCategory: KnowledgeCategory | 'all';
  onSelectCategory: (cat: KnowledgeCategory | 'all') => void;
  categoryCounts?: Record<KnowledgeCategory, number>;
  totalCount?: number;
}

const CATEGORY_ICONS: Record<KnowledgeCategory | 'all', React.FC<{ className?: string }>> = {
  all: LayoutGrid,
  experiments: FlaskConical,
  standards: ShieldCheck,
  food_products: Boxes,
  raw_materials: Layers,
  equipment: Wrench,
  test_methods: CheckSquare,
  formulas: Calculator,
  common_errors: AlertTriangle,
  scientific_definitions: BookMarked,
  references: BookOpen
};

export const KnowledgeCategoryTabs: React.FC<KnowledgeCategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts = {} as Record<KnowledgeCategory, number>,
  totalCount = 0
}) => {
  const categories = Object.keys(KNOWLEDGE_CATEGORIES_META) as KnowledgeCategory[];

  return (
    <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-x-auto custom-scrollbar">
      <div className="flex items-center gap-1 p-2 min-w-max">
        {/* All Categories Tab */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeCategory === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>همه دسته‌ها</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
              activeCategory === 'all'
                ? 'bg-emerald-800 text-emerald-100'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* 10 Core Food Science Categories */}
        {categories.map((cat) => {
          const meta = KNOWLEDGE_CATEGORIES_META[cat];
          const Icon = CATEGORY_ICONS[cat];
          const isSelected = activeCategory === cat;
          const count = categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900'
              }`}
              title={meta.description}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{meta.titleFa}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isSelected
                    ? 'bg-emerald-800 text-emerald-100'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
