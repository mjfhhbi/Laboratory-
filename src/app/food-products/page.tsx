import React, { useState, useMemo, useEffect } from 'react';
import { 
  FoodCatalogProduct, 
  ProductCategoryKey 
} from '../../types/foodProductsCatalog';
import { ALL_CATALOG_PRODUCTS } from '../../data/products/allProductsCatalog';
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_KEYS } from '../../data/products/categoryMeta';
import { 
  getAllProductsCombined, 
  saveCustomProduct 
} from '../../lib/storage/foodProductsCatalogStorage';
import { ProductCategoryNav } from '../../components/food-products/ProductCategoryNav';
import { ProductDetailView } from '../../components/food-products/ProductDetailView';
import { AddProductModal } from '../../components/food-products/AddProductModal';
import { RelationalFlowModal } from '../../components/food-products/RelationalFlowModal';
import { 
  Search, 
  Plus, 
  Layers, 
  ShieldCheck, 
  FileCheck2, 
  Network, 
  BookOpen, 
  ArrowLeft, 
  Filter, 
  Sparkles,
  Database,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const FoodProductsPage: React.FC = () => {
  const [products, setProducts] = useState<FoodCatalogProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [flowModalProduct, setFlowModalProduct] = useState<FoodCatalogProduct | null>(null);

  // Filter states
  const [testTypeFilter, setTestTypeFilter] = useState<'all' | 'physical' | 'chemical' | 'microbial' | 'sensory'>('all');
  const [standardOrgFilter, setStandardOrgFilter] = useState<'all' | 'INSO' | 'Codex'>('all');

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const combined = getAllProductsCombined();
    setProducts(combined);
  };

  const handleSaveNewProduct = (newProduct: FoodCatalogProduct) => {
    saveCustomProduct(newProduct);
    loadProducts();
    setSelectedProductId(newProduct.id);
  };

  // Product Counts per Category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const key of PRODUCT_CATEGORY_KEYS) {
      counts[key] = 0;
    }
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Test type filter
      if (testTypeFilter !== 'all') {
        const hasTestType = p.tests.some(t => t.category === testTypeFilter);
        if (!hasTestType) return false;
      }

      // Standard organization filter
      if (standardOrgFilter !== 'all') {
        const hasOrg = p.standards.some(s => s.organization.toLowerCase() === standardOrgFilter.toLowerCase());
        if (!hasOrg) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matches = 
          p.nameFa.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          (p.commercialNameFa && p.commercialNameFa.toLowerCase().includes(q)) ||
          p.code.toLowerCase().includes(q) ||
          p.descriptionFa.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          p.standards.some(s => s.standardNumber.toLowerCase().includes(q) || s.titleFa.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [products, selectedCategory, testTypeFilter, standardOrgFilter, searchQuery]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    let totalTests = 0;
    let totalStandards = 0;
    const uniqueSources = new Set<string>();

    for (const p of products) {
      totalTests += p.tests.length;
      totalStandards += p.standards.length;
      p.sources.forEach(s => uniqueSources.add(s.citationCode));
    }

    return {
      totalProducts,
      totalTests,
      totalStandards,
      totalSources: uniqueSources.size
    };
  }, [products]);

  const activeProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return products.find(p => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  return (
    <div className="space-y-6 pb-12">
      {/* If a product is selected, render the dedicated Detail View */}
      {activeProduct ? (
        <ProductDetailView
          product={activeProduct}
          onBack={() => setSelectedProductId(null)}
        />
      ) : (
        <>
          {/* Top Page Header */}
          <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 -ml-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 -mr-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <Database className="w-3 h-3" />
                    <span>بانک جامع و مرجع تخصصی صنایع غذایی</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-300 bg-white/10">
                    Product ← Tests ← Standards ← Sources
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  بانک جامع محصولات، استانداردها و آزمون‌ها
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                  مرجع رابطه‌ای کامل محصولات غذایی در ۱۷ دسته‌بندی استاندارد شامل مشخصات محصول، مواد اولیه، فرآیند تولید و CCP،
                  آزمون‌های فیزیکی، شیمیایی، میکروبی و حسی، تجهیزات خط و آزمایشگاه، شرایط نگهداری، بسته‌بندی، ماندگاری و استانداردهای مجزا.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>ثبت محصول و اتصال استاندارد</span>
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-right">
                <span className="text-[11px] text-slate-400 block mb-1">فرآورده‌های مستند</span>
                <span className="text-xl font-black text-white font-mono">{stats.totalProducts}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">در ۱۷ رده تخصصی</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-right">
                <span className="text-[11px] text-slate-400 block mb-1">آزمون‌های کنترل کیفیت</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{stats.totalTests}</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">فیزیکی، شیمیایی، میکروبی، حسی</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-right">
                <span className="text-[11px] text-slate-400 block mb-1">استانداردهای ملی و کدکس</span>
                <span className="text-xl font-black text-blue-400 font-mono">{stats.totalStandards}</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">تفکیک‌شده با شماره ثبت</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-right">
                <span className="text-[11px] text-slate-400 block mb-1">منابع استنادی معتبر</span>
                <span className="text-xl font-black text-amber-400 font-mono">{stats.totalSources}</span>
                <span className="text-[10px] text-emerald-300 block mt-0.5">۱۰۰٪ راستی‌آزمایی شده</span>
              </div>
            </div>
          </div>

          {/* 17 Categories Visual Navigator */}
          <ProductCategoryNav
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            productCounts={productCounts}
            totalCount={products.length}
          />

          {/* Search and Secondary Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو بر اساس نام محصول، کد، استاندارد، ترکیبات یا تگ..."
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              <div className="flex items-center gap-1 text-xs text-slate-500 ml-1">
                <Filter className="w-3.5 h-3.5" />
                <span>فیلتر آزمون:</span>
              </div>
              <select
                value={testTypeFilter}
                onChange={(e) => setTestTypeFilter(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:border-emerald-500"
              >
                <option value="all">همه رده‌های آزمون</option>
                <option value="physical">دارای آزمون فیزیکی</option>
                <option value="chemical">دارای آزمون شیمیایی</option>
                <option value="microbial">دارای آزمون میکروبی</option>
                <option value="sensory">دارای آزمون حسی</option>
              </select>

              <div className="flex items-center gap-1 text-xs text-slate-500 ml-1">
                <span>مرجع:</span>
              </div>
              <select
                value={standardOrgFilter}
                onChange={(e) => setStandardOrgFilter(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:border-emerald-500"
              >
                <option value="all">همه مراجع استاندارد</option>
                <option value="INSO">استاندارد ملی ایران (INSO)</option>
                <option value="Codex">کدکس بین‌المللی (Codex)</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">هیچ محصولی با معیارهای جستجو یافت نشد</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                می‌توانید فیلتر دسته‌بندی را تغییر داده یا محصول جدیدی را با اتصال به زنجیره استاندارد ثبت نمایید.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setTestTypeFilter('all');
                  setStandardOrgFilter('all');
                }}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                پاک‌سازی همه فیلترها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const catMeta = PRODUCT_CATEGORIES[product.category];
                const physicalCount = product.tests.filter(t => t.category === 'physical').length;
                const chemicalCount = product.tests.filter(t => t.category === 'chemical').length;
                const microbialCount = product.tests.filter(t => t.category === 'microbial').length;
                const sensoryCount = product.tests.filter(t => t.category === 'sensory').length;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{catMeta?.icon || '📦'}</span>
                          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {catMeta?.nameFa || product.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          {product.code}
                        </span>
                      </div>

                      {/* Titles */}
                      <h3 className="font-black text-slate-900 text-base group-hover:text-emerald-800 transition-colors">
                        {product.nameFa}
                      </h3>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">{product.nameEn}</p>
                      {product.commercialNameFa && (
                        <p className="text-xs text-amber-700 mt-1 font-medium">نام تجاری: {product.commercialNameFa}</p>
                      )}

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {product.descriptionFa}
                      </p>

                      {/* Standards separate tags */}
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-semibold text-slate-500 block">استانداردهای مرتبط (تفکیک‌شده):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {product.standards.map((std) => (
                            <span
                              key={std.id}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-100 font-mono"
                            >
                              {std.organization} {std.standardNumber}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tests badges summary */}
                      <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px] font-semibold">
                        <div className="bg-blue-50/80 text-blue-800 p-1.5 rounded-lg">
                          <span className="block text-[9px] text-blue-600">فیزیکی</span>
                          <span className="font-bold font-mono">{physicalCount}</span>
                        </div>
                        <div className="bg-amber-50/80 text-amber-800 p-1.5 rounded-lg">
                          <span className="block text-[9px] text-amber-600">شیمیایی</span>
                          <span className="font-bold font-mono">{chemicalCount}</span>
                        </div>
                        <div className="bg-rose-50/80 text-rose-800 p-1.5 rounded-lg">
                          <span className="block text-[9px] text-rose-600">میکروبی</span>
                          <span className="font-bold font-mono">{microbialCount}</span>
                        </div>
                        <div className="bg-purple-50/80 text-purple-800 p-1.5 rounded-lg">
                          <span className="block text-[9px] text-purple-600">حسی</span>
                          <span className="font-bold font-mono">{sensoryCount}</span>
                        </div>
                      </div>

                      {/* Shelf life and storage snippet */}
                      <div className="mt-3 text-[11px] text-slate-600 flex items-center justify-between bg-slate-50 p-2 rounded-xl">
                        <span className="text-slate-500">ماندگاری:</span>
                        <span className="font-bold text-slate-800">{product.shelfLifeSpecs.shelfLifeDurationFa}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProductId(product.id)}
                        className="flex-1 py-2 px-3 bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>شناسنامه فنی کامل</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setFlowModalProduct(product)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 transition-all"
                        title="مشاهده دیاگرام زنجیره رابطه‌ای"
                      >
                        <Network className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewProduct}
      />

      {/* Relational Flow Modal from Card */}
      {flowModalProduct && (
        <RelationalFlowModal
          product={flowModalProduct}
          onClose={() => setFlowModalProduct(null)}
        />
      )}
    </div>
  );
};
export default FoodProductsPage;
