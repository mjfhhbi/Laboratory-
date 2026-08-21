/**
 * Food Science AI - IndexedDB Core Engine
 * Manages low-level IndexedDB connection, schema versioning, and object stores.
 */

const DB_NAME = 'FoodScienceAI_Storage';
const DB_VERSION = 5;

export const STORES = {
  SETTINGS: 'settings',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  KNOWLEDGE_BASE: 'knowledge_base',
  KNOWLEDGE_RECORDS: 'knowledge_records',
  SCIENTIFIC_SOURCES: 'scientific_sources',
  SYNC_QUEUE: 'sync_queue',
  LAB_SESSIONS: 'lab_sessions',
  LAB_TEMPLATES: 'lab_templates',
  CUSTOM_FORMULAS: 'custom_formulas',
  FOOD_PRODUCTS: 'food_products'
} as const;

export type StoreName = typeof STORES[keyof typeof STORES];

let dbInstance: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Initializes and opens the IndexedDB database instance.
 */
export function getDb(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Settings Store
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
      }

      // 2. Conversations Store
      if (!db.objectStoreNames.contains(STORES.CONVERSATIONS)) {
        const convStore = db.createObjectStore(STORES.CONVERSATIONS, { keyPath: 'id' });
        convStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        convStore.createIndex('pinned', 'pinned', { unique: false });
        convStore.createIndex('category', 'category', { unique: false });
      }

      // 3. Messages Store
      if (!db.objectStoreNames.contains(STORES.MESSAGES)) {
        const msgStore = db.createObjectStore(STORES.MESSAGES, { keyPath: 'id' });
        msgStore.createIndex('conversationId', 'conversationId', { unique: false });
        msgStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 4. Legacy Knowledge Base Store
      if (!db.objectStoreNames.contains(STORES.KNOWLEDGE_BASE)) {
        const kbStore = db.createObjectStore(STORES.KNOWLEDGE_BASE, { keyPath: 'id' });
        kbStore.createIndex('category', 'category', { unique: false });
        kbStore.createIndex('code', 'code', { unique: false });
        kbStore.createIndex('offlineAvailable', 'offlineAvailable', { unique: false });
        kbStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 5. Scientific Sources Store (New Architecture)
      if (!db.objectStoreNames.contains(STORES.SCIENTIFIC_SOURCES)) {
        const sourceStore = db.createObjectStore(STORES.SCIENTIFIC_SOURCES, { keyPath: 'id' });
        sourceStore.createIndex('publicationType', 'publicationType', { unique: false });
        sourceStore.createIndex('reliabilityGrade', 'reliabilityGrade', { unique: false });
        sourceStore.createIndex('organizationOrPublisher', 'organizationOrPublisher', { unique: false });
        sourceStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 6. Comprehensive Knowledge Records Store (10 Categories & Verification)
      if (!db.objectStoreNames.contains(STORES.KNOWLEDGE_RECORDS)) {
        const recordStore = db.createObjectStore(STORES.KNOWLEDGE_RECORDS, { keyPath: 'id' });
        recordStore.createIndex('category', 'category', { unique: false });
        recordStore.createIndex('verificationStatus', 'verificationStatus', { unique: false });
        recordStore.createIndex('codeOrIdentifier', 'codeOrIdentifier', { unique: false });
        recordStore.createIndex('offlineAvailable', 'offlineAvailable', { unique: false });
        recordStore.createIndex('updatedAt', 'metadata.updatedAt', { unique: false });
      }

      // 7. Sync Queue Store (For offline sync reconciliation)
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
        syncStore.createIndex('status', 'status', { unique: false });
        syncStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // 8. Digital Laboratory Sessions Store (Part 8 of 10)
      if (!db.objectStoreNames.contains(STORES.LAB_SESSIONS)) {
        const labStore = db.createObjectStore(STORES.LAB_SESSIONS, { keyPath: 'id' });
        labStore.createIndex('status', 'status', { unique: false });
        labStore.createIndex('standardId', 'standardId', { unique: false });
        labStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        labStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // 9. Digital Laboratory Protocol Templates Store
      if (!db.objectStoreNames.contains(STORES.LAB_TEMPLATES)) {
        const tplStore = db.createObjectStore(STORES.LAB_TEMPLATES, { keyPath: 'id' });
        tplStore.createIndex('standardId', 'standardId', { unique: false });
        tplStore.createIndex('sector', 'sector', { unique: false });
      }

      // 10. Custom Laboratory Formulas Store (Part 9 of 10)
      if (!db.objectStoreNames.contains(STORES.CUSTOM_FORMULAS)) {
        const formulaStore = db.createObjectStore(STORES.CUSTOM_FORMULAS, { keyPath: 'id' });
        formulaStore.createIndex('category', 'category', { unique: false });
        formulaStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 11. Food Products & Formulation Projects Store (Part 10 of 10)
      if (!db.objectStoreNames.contains(STORES.FOOD_PRODUCTS)) {
        const productStore = db.createObjectStore(STORES.FOOD_PRODUCTS, { keyPath: 'id' });
        productStore.createIndex('category', 'category', { unique: false });
        productStore.createIndex('status', 'status', { unique: false });
        productStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        productStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      dbInstance.onversionchange = () => {
        dbInstance?.close();
        dbInstance = null;
        dbPromise = null;
      };
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error;
      dbPromise = null;
      reject(error || new Error('Failed to open IndexedDB database.'));
    };
  });

  return dbPromise;
}

/**
 * Generic helper to execute a transaction on an object store
 */
export async function executeTx<T>(
  storeName: StoreName,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T> {
  const db = await getDb();
  return new Promise<T>((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);

      let req: IDBRequest<T> | void;
      try {
        req = callback(store);
      } catch (err) {
        reject(err);
        return;
      }

      tx.oncomplete = () => {
        if (req && 'result' in req) {
          resolve(req.result);
        } else {
          resolve(undefined as unknown as T);
        }
      };

      tx.onerror = () => {
        reject(tx.error || new Error('IndexedDB transaction failed.'));
      };

      tx.onabort = () => {
        reject(tx.error || new Error('IndexedDB transaction aborted.'));
      };
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Get item by key
 */
export async function getItem<T>(storeName: StoreName, key: IDBValidKey): Promise<T | null> {
  return executeTx<T>(storeName, 'readonly', (store) => store.get(key)).then((result) => result ?? null);
}

/**
 * Put / Save item
 */
export async function putItem<T>(storeName: StoreName, value: T): Promise<IDBValidKey> {
  return executeTx<IDBValidKey>(storeName, 'readwrite', (store) => store.put(value));
}

/**
 * Delete item by key
 */
export async function deleteItem(storeName: StoreName, key: IDBValidKey): Promise<void> {
  return executeTx<void>(storeName, 'readwrite', (store) => {
    store.delete(key);
  });
}

/**
 * Get all items from a store
 */
export async function getAllItems<T>(storeName: StoreName): Promise<T[]> {
  return executeTx<T[]>(storeName, 'readonly', (store) => store.getAll()).then((res) => res || []);
}

/**
 * Count total items in a store
 */
export async function countItems(storeName: StoreName): Promise<number> {
  return executeTx<number>(storeName, 'readonly', (store) => store.count());
}

/**
 * Clear all items in a store
 */
export async function clearStore(storeName: StoreName): Promise<void> {
  return executeTx<void>(storeName, 'readwrite', (store) => {
    store.clear();
  });
}

/**
 * Get items by index matching a key
 */
export async function getByIndex<T>(
  storeName: StoreName,
  indexName: string,
  key: IDBValidKey | IDBKeyRange
): Promise<T[]> {
  const db = await getDb();
  return new Promise<T[]>((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(key);

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error || new Error(`Failed to query index ${indexName}`));
      };
    } catch (err) {
      reject(err);
    }
  });
}
