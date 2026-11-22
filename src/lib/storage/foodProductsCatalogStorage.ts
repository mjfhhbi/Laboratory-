import { FoodCatalogProduct } from '../../types/foodProductsCatalog';
import { ALL_CATALOG_PRODUCTS } from '../../data/products/allProductsCatalog';

const STORAGE_KEY = 'food_products_catalog_user_items_v1';

export function getCustomProducts(): FoodCatalogProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load custom products from storage', err);
    return [];
  }
}

export function saveCustomProduct(product: FoodCatalogProduct): void {
  try {
    const existing = getCustomProducts();
    const idx = existing.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      existing[idx] = product;
    } else {
      existing.unshift(product);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save custom product', err);
  }
}

export function deleteCustomProduct(productId: string): void {
  try {
    const existing = getCustomProducts().filter(p => p.id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to delete custom product', err);
  }
}

export function getAllProductsCombined(): FoodCatalogProduct[] {
  const custom = getCustomProducts();
  const seedIds = new Set(ALL_CATALOG_PRODUCTS.map(p => p.id));
  
  // If user modified a seed product, the custom version takes priority
  const merged: FoodCatalogProduct[] = [];
  
  // Custom items first
  for (const c of custom) {
    merged.push(c);
  }
  
  // Seed items that are not overwritten in custom
  for (const s of ALL_CATALOG_PRODUCTS) {
    if (!custom.some(c => c.id === s.id)) {
      merged.push(s);
    }
  }
  
  return merged;
}
