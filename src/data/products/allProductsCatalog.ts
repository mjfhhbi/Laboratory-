import { FoodCatalogProduct, ProductCategoryKey } from '../../types/foodProductsCatalog';
import { PART1_PRODUCTS } from './part1_dairy_bakery';
import { PART2_PRODUCTS } from './part2_oils_sweets';
import { PART3_PRODUCTS } from './part3_produce_spices';
import { CATALOG_SOURCES_DATABASE } from './catalogSources';

export const ALL_CATALOG_PRODUCTS: FoodCatalogProduct[] = [
  ...PART1_PRODUCTS,
  ...PART2_PRODUCTS,
  ...PART3_PRODUCTS
];

export function getProductById(id: string): FoodCatalogProduct | undefined {
  return ALL_CATALOG_PRODUCTS.find(p => p.id === id);
}

export function getProductsByCategory(category: ProductCategoryKey): FoodCatalogProduct[] {
  return ALL_CATALOG_PRODUCTS.filter(p => p.category === category);
}

export function searchProducts(query: string, categoryFilter?: ProductCategoryKey | 'all'): FoodCatalogProduct[] {
  let list = ALL_CATALOG_PRODUCTS;
  if (categoryFilter && categoryFilter !== 'all') {
    list = list.filter(p => p.category === categoryFilter);
  }
  if (!query || !query.trim()) {
    return list;
  }
  const q = query.trim().toLowerCase();
  return list.filter(p => 
    p.nameFa.toLowerCase().includes(q) ||
    p.nameEn.toLowerCase().includes(q) ||
    p.commercialNameFa.toLowerCase().includes(q) ||
    p.descriptionFa.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    p.standards.some(s => s.standardNumber.toLowerCase().includes(q) || s.titleFa.toLowerCase().includes(q))
  );
}

export { CATALOG_SOURCES_DATABASE };
