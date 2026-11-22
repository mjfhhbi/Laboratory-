import React from 'react';
import { ProductCategoryKey } from '../../types/foodProductsCatalog';
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_KEYS } from '../../data/products/categoryMeta';

interface ProductCategoryNavProps {
  selectedCategory: ProductCategoryKey | 'all';
  onSelectCategory: (cat: ProductCategoryKey | 'all') => void;
  productCounts: Record<string, number>;
  totalCount: number;
}

export const ProductCategoryNav: React.FC<ProductCategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  productCounts,
  totalCount
}) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-3 shadow-xs mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 px-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-800">دسته‌بندی‌های جامع صنایع غذایی (۱۷ رده استاندارد)</h3>
        </div>
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          همه محصولات ({totalCount})
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-2">
        {PRODUCT_CATEGORY_KEYS.map((key) => {
          const meta = PRODUCT_CATEGORIES[key];
          const isSelected = selectedCategory === key;
          const count = productCounts[key] || 0;

          return (
            <button
              key={key}
              onClick={() => onSelectCategory(key)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-xs ring-2 ring-emerald-400/30'
                  : 'border-slate-100 bg-slate-50/60 text-slate-700 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="text-lg mb-1">{meta.icon}</div>
              <span className="text-xs font-bold truncate max-w-[95%]">{meta.nameFa}</span>
              <span
                className={`text-[10px] mt-1 px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-emerald-200/70 text-emerald-800' : 'bg-slate-200/60 text-slate-500'
                }`}
              >
                {count} فرآورده
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
