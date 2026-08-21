/**
 * Food Science AI - New Product Project Modal
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Target,
  FlaskConical,
  Scale,
  FileText,
  User,
  Check
} from 'lucide-react';
import {
  ProductCategory,
  ProductTargetObjective,
  ProductionScale,
  ProductDevelopmentProject
} from '../../types/foodProduct';
import { createNewProductProject } from '../../lib/storage/productStorage';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (project: ProductDevelopmentProject) => void;
}

const CATEGORIES: Array<{ id: ProductCategory; labelFa: string }> = [
  { id: 'dairy', labelFa: 'لبنیات و بستنی' },
  { id: 'beverage', labelFa: 'نوشیدنی‌ها و آبمیوه‌ها' },
  { id: 'sauces_condiments', labelFa: 'سس‌ها، چاشنی‌ها و درای درسینگ' },
  { id: 'bakery_cereal', labelFa: 'غلات، آرد و نان' },
  { id: 'meat_poultry', labelFa: 'فرآورده‌های گوشتی و پروتئینی' },
  { id: 'confectionery', labelFa: 'قنادی، شکلات و شیرینی' },
  { id: 'oils_fats', labelFa: 'روغن‌ها و چربی‌های خوراکی' },
  { id: 'canned_preserved', labelFa: 'کنسروها و ترشیجات' },
  { id: 'snacks_extruded', labelFa: 'تنقلات و فرآورده‌های اکسترود شده' },
  { id: 'functional_food', labelFa: 'فرآورده‌های فراسودمند و رژیمی' }
];

const OBJECTIVES: Array<{ id: ProductTargetObjective; labelFa: string }> = [
  { id: 'clean_label', labelFa: 'برچسب پاک (Clean Label)' },
  { id: 'low_fat', labelFa: 'کاهش یا حذف چربی (Low Fat)' },
  { id: 'sugar_reduced', labelFa: 'کاهش یا حذف قند (Sugar Reduced)' },
  { id: 'high_protein', labelFa: 'غنی‌شده با پروتئین (High Protein)' },
  { id: 'gluten_free', labelFa: 'بدون گلوتن (Gluten Free)' },
  { id: 'texture_optimized', labelFa: 'بهبود بافت و قوام' },
  { id: 'shelf_life_ext', labelFa: 'افزایش زمان ماندگاری' },
  { id: 'cost_reduction', labelFa: 'کاهش قیمت تمام‌شده' },
  { id: 'novel_formulation', labelFa: 'توسعه محصول نوین' },
  { id: 'standard_matching', labelFa: 'انطباق با استاندارد ملی / رقیب' }
];

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [productNameFa, setProductNameFa] = useState('');
  const [productNameEn, setProductNameEn] = useState('');
  const [category, setCategory] = useState<ProductCategory>('dairy');
  const [selectedObjectives, setSelectedObjectives] = useState<ProductTargetObjective[]>([
    'clean_label',
    'texture_optimized'
  ]);
  const [executiveSummaryFa, setExecutiveSummaryFa] = useState('');
  const [leadFoodScientist, setLeadFoodScientist] = useState('');
  const [productionScale, setProductionScale] = useState<ProductionScale>('lab');
  const [standardBatchSizeKg, setStandardBatchSizeKg] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleObjective = (obj: ProductTargetObjective) => {
    if (selectedObjectives.includes(obj)) {
      setSelectedObjectives(selectedObjectives.filter((o) => o !== obj));
    } else {
      setSelectedObjectives([...selectedObjectives, obj]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productNameFa.trim()) {
      setError('نام فارسی محصول الزامی است.');
      return;
    }
    if (!leadFoodScientist.trim()) {
      setError('نام کارشناس یا سرپرست فرمولاسیون الزامی است.');
      return;
    }

    const project = createNewProductProject({
      productNameFa: productNameFa.trim(),
      productNameEn: productNameEn.trim() || undefined,
      category,
      targetObjectives: selectedObjectives,
      executiveSummaryFa:
        executiveSummaryFa.trim() ||
        `پروژه طراحی و توسعه ${productNameFa.trim()} در مقیاس ${
          productionScale === 'lab' ? 'آزمایشگاهی' : productionScale === 'pilot' ? 'پایلوت' : 'صنعتی'
        }.`,
      leadFoodScientist: leadFoodScientist.trim(),
      productionScale,
      standardBatchSizeKg: Number(standardBatchSizeKg) || 5
    });

    onCreated(project);
    onClose();
  };

  return (
    <div
      id="new-product-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="new-product-modal-container"
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 my-8 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 px-6 py-4 bg-stone-50 dark:bg-stone-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                ایجاد پروژه توسعه محصول غذایی جدید
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                تعریف فرمولاسیون، فرآیند، پارامترهای کنترل کیفیت و ماندگاری
              </p>
            </div>
          </div>
          <button
            id="close-new-product-modal-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 text-sm rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Product Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                نام فارسی محصول *
              </label>
              <input
                id="input-product-name-fa"
                type="text"
                required
                value={productNameFa}
                onChange={(e) => setProductNameFa(e.target.value)}
                placeholder="مثلاً: ماست همزده پروبیوتیک با طعم نعناع"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                نام انگلیسی محصول (اختیاری)
              </label>
              <input
                id="input-product-name-en"
                type="text"
                dir="ltr"
                value={productNameEn}
                onChange={(e) => setProductNameEn(e.target.value)}
                placeholder="e.g. Mint Probiotic Stirred Yogurt"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              دسته محصول غذایی
            </label>
            <select
              id="select-product-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.labelFa}
                </option>
              ))}
            </select>
          </div>

          {/* Target Objectives Multi-select */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
              اهداف توسعه و ویژگی‌های کلیدی محصول (انتخاب چندگانه)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OBJECTIVES.map((obj) => {
                const isSelected = selectedObjectives.includes(obj.id);
                return (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => toggleObjective(obj.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium border transition-all text-right ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                        : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                    }`}
                  >
                    <span>{obj.labelFa}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mr-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scale & Batch Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                مقیاس اولیه توسعه
              </label>
              <select
                id="select-product-scale"
                value={productionScale}
                onChange={(e) => setProductionScale(e.target.value as ProductionScale)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="lab">مقیاس آزمایشگاهی (Lab Scale: ۱۰۰g تا ۵kg)</option>
                <option value="pilot">مقیاس پایلوت (Pilot Scale: ۵kg تا ۱۰۰kg)</option>
                <option value="industrial">مقیاس صنعتی (Industrial: ۱۰۰kg به بالا)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                وزن پیش‌فرض هر بچ (کیلوگرم)
              </label>
              <input
                id="input-batch-size"
                type="number"
                min="0.1"
                step="0.1"
                value={standardBatchSizeKg}
                onChange={(e) => setStandardBatchSizeKg(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Lead Scientist & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                کارشناس مسئول / محقق فرمولاسیون *
              </label>
              <input
                id="input-lead-scientist"
                type="text"
                required
                value={leadFoodScientist}
                onChange={(e) => setLeadFoodScientist(e.target.value)}
                placeholder="مثلاً: مهندس سارا نیک‌پیام"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                هدف و خلاصه اجرایی پروژه (اختیاری)
              </label>
              <textarea
                id="input-executive-summary"
                rows={2}
                value={executiveSummaryFa}
                onChange={(e) => setExecutiveSummaryFa(e.target.value)}
                placeholder="توضیحات کوتاه در مورد ویژگی حسی و نیاز بازار..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              انصراف
            </button>
            <button
              id="submit-create-product-project-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>ایجاد پروژه و ورود به میز طراحی</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
