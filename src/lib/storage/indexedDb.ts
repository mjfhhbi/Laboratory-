/**
 * Food Science AI - IndexedDB Core Engine
 * Manages low-level IndexedDB connection, schema versioning, and object stores.
 */

const DB_NAME = 'FoodScienceAI_Storage';
const DB_VERSION = 11;

export const STORES = {
  SETTINGS: 'settings',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  KNOWLEDGE_BASE: 'knowledge_base',
  KNOWLEDGE_RECORDS: 'knowledge_records',
  SCIENTIFIC_SOURCES: 'scientific_sources',
  PDF_DOCUMENTS: 'pdf_documents',
  SYNC_QUEUE: 'sync_queue',
  LAB_SESSIONS: 'lab_sessions',
  LAB_TEMPLATES: 'lab_templates',
  CUSTOM_FORMULAS: 'custom_formulas',
  FOOD_PRODUCTS: 'food_products',
  FOOD_EXPERIMENTS: 'food_experiments',
  LAB_EQUIPMENT: 'lab_equipment',
  CHEMICAL_REAGENTS: 'chemical_reagents',
  PREPARED_SOLUTIONS: 'prepared_solutions',
  RESEARCH_PROJECTS: 'research_projects',
  STATISTICAL_DATASETS: 'statistical_datasets'
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

      // 12. Food Experiments & Laboratory Protocols Store (Part 11 of 20)
      if (!db.objectStoreNames.contains(STORES.FOOD_EXPERIMENTS)) {
        const expStore = db.createObjectStore(STORES.FOOD_EXPERIMENTS, { keyPath: 'id' });
        expStore.createIndex('domain', 'domain', { unique: false });
        expStore.createIndex('code', 'code', { unique: false });
        expStore.createIndex('verificationStatus', 'verificationStatus', { unique: false });
        expStore.createIndex('reliabilityGrade', 'reliabilityGrade', { unique: false });
        expStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        expStore.createIndex('offlineAvailable', 'offlineAvailable', { unique: false });
      }

      // 13. Laboratory Equipment & Instruments Store (Part 12 of 20)
      if (!db.objectStoreNames.contains(STORES.LAB_EQUIPMENT)) {
        const eqStore = db.createObjectStore(STORES.LAB_EQUIPMENT, { keyPath: 'id' });
        eqStore.createIndex('category', 'category', { unique: false });
        eqStore.createIndex('code', 'code', { unique: true });
        eqStore.createIndex('calibrationStatus', 'calibrationStatus', { unique: false });
        eqStore.createIndex('nextCalibrationDate', 'nextCalibrationDate', { unique: false });
        eqStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        eqStore.createIndex('offlineAvailable', 'offlineAvailable', { unique: false });
      }

      // 14. Chemical Reagents & Solutes Store (Part 13 of 20)
      if (!db.objectStoreNames.contains(STORES.CHEMICAL_REAGENTS)) {
        const reagentStore = db.createObjectStore(STORES.CHEMICAL_REAGENTS, { keyPath: 'id' });
        reagentStore.createIndex('family', 'family', { unique: false });
        reagentStore.createIndex('casNumber', 'casNumber', { unique: false });
        reagentStore.createIndex('grade', 'grade', { unique: false });
        reagentStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 15. Prepared Solutions Log Store (Part 13 of 20)
      if (!db.objectStoreNames.contains(STORES.PREPARED_SOLUTIONS)) {
        const solStore = db.createObjectStore(STORES.PREPARED_SOLUTIONS, { keyPath: 'id' });
        solStore.createIndex('reagentId', 'reagentId', { unique: false });
        solStore.createIndex('status', 'status', { unique: false });
        solStore.createIndex('expiryDate', 'expiryDate', { unique: false });
        solStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // 16. Scientific PDF Documents & OCR Text Store (Part 22 of 30)
      if (!db.objectStoreNames.contains(STORES.PDF_DOCUMENTS)) {
        const pdfStore = db.createObjectStore(STORES.PDF_DOCUMENTS, { keyPath: 'id' });
        pdfStore.createIndex('sourceId', 'sourceId', { unique: false });
        pdfStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 17. Research Projects & Thesis Assistant Store (Part 25 of 30)
      if (!db.objectStoreNames.contains(STORES.RESEARCH_PROJECTS)) {
        const researchStore = db.createObjectStore(STORES.RESEARCH_PROJECTS, { keyPath: 'id' });
        researchStore.createIndex('category', 'category', { unique: false });
        researchStore.createIndex('status', 'status', { unique: false });
        researchStore.createIndex('academicLevel', 'academicLevel', { unique: false });
        researchStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 18. Experimental Design & Statistical Datasets Store (Part 26 of 30)
      if (!db.objectStoreNames.contains(STORES.STATISTICAL_DATASETS)) {
        const statsStore = db.createObjectStore(STORES.STATISTICAL_DATASETS, { keyPath: 'id' });
        statsStore.createIndex('designType', 'designType', { unique: false });
        statsStore.createIndex('foodMatrix', 'foodMatrix', { unique: false });
        statsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
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
