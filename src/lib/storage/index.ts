/**
 * Food Science AI - Unified Offline Storage Repository
 * Provides clean typed APIs for Settings, Conversations, KnowledgeBase and Sync.
 */

import {
  STORES,
  getItem,
  putItem,
  deleteItem,
  getAllItems,
  getByIndex,
  countItems,
  clearStore
} from './indexedDb';
import {
  UserSettings,
  Conversation,
  ChatMessage,
  KnowledgeItem,
  SyncQueueItem,
  StorageStats,
  ThemeMode
} from '../../types';

const DEFAULT_SETTINGS_KEY = 'current_user_settings';

export const DEFAULT_SETTINGS: UserSettings = {
  id: DEFAULT_SETTINGS_KEY,
  theme: 'system',
  language: 'fa',
  autoSaveHistory: true,
  offlineCacheEnabled: true,
  offlineDataSync: true,
  activeLabPreset: 'standard_qc',
  lastUpdated: new Date().toISOString()
};

// ==========================================
// 1. User Settings Repository
// ==========================================

export async function getUserSettings(): Promise<UserSettings> {
  try {
    const saved = await getItem<UserSettings>(STORES.SETTINGS, DEFAULT_SETTINGS_KEY);
    if (saved) {
      return saved;
    }
    // Seed default settings if empty
    await putItem<UserSettings>(STORES.SETTINGS, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.warn('Failed to load settings from IndexedDB, falling back to defaults:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  const current = await getUserSettings();
  const updated: UserSettings = {
    ...current,
    ...settings,
    id: DEFAULT_SETTINGS_KEY,
    lastUpdated: new Date().toISOString()
  };
  await putItem<UserSettings>(STORES.SETTINGS, updated);
  return updated;
}

// ==========================================
// 2. Conversations Repository
// ==========================================

export async function getAllConversations(): Promise<Conversation[]> {
  try {
    const list = await getAllItems<Conversation>(STORES.CONVERSATIONS);
    // Sort latest updated first, with pinned at the top
    return list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  } catch (error) {
    console.error('Failed to get conversations:', error);
    return [];
  }
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  return getItem<Conversation>(STORES.CONVERSATIONS, id);
}

export async function saveConversation(conv: Conversation): Promise<Conversation> {
  await putItem<Conversation>(STORES.CONVERSATIONS, conv);
  return conv;
}

export async function createConversation(params: {
  title: string;
  category?: Conversation['category'];
  pinned?: boolean;
}): Promise<Conversation> {
  const newConv: Conversation = {
    id: 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: params.title || 'گفتگوی جدید',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pinned: params.pinned || false,
    category: params.category || 'general',
    messageCount: 0,
    tags: []
  };

  await putItem<Conversation>(STORES.CONVERSATIONS, newConv);
  return newConv;
}

export async function deleteConversation(id: string): Promise<void> {
  await deleteItem(STORES.CONVERSATIONS, id);
  // Also delete all related messages
  const messages = await getMessagesByConversation(id);
  for (const msg of messages) {
    await deleteItem(STORES.MESSAGES, msg.id);
  }
}

export async function renameConversation(id: string, newTitle: string): Promise<Conversation | null> {
  const conv = await getConversationById(id);
  if (!conv) return null;
  conv.title = newTitle.trim() || 'گفتگوی بدون نام';
  conv.updatedAt = new Date().toISOString();
  await saveConversation(conv);
  return conv;
}

export async function clearConversationMessages(id: string): Promise<void> {
  const messages = await getMessagesByConversation(id);
  for (const msg of messages) {
    await deleteItem(STORES.MESSAGES, msg.id);
  }
  const conv = await getConversationById(id);
  if (conv) {
    conv.messageCount = 0;
    conv.updatedAt = new Date().toISOString();
    await saveConversation(conv);
  }
}

// ==========================================
// 3. Chat Messages Repository
// ==========================================

export async function getMessagesByConversation(conversationId: string): Promise<ChatMessage[]> {
  try {
    const messages = await getByIndex<ChatMessage>(
      STORES.MESSAGES,
      'conversationId',
      conversationId
    );
    return messages.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  } catch (error) {
    console.error('Failed to get messages:', error);
    return [];
  }
}

export async function addMessage(
  conversationId: string,
  message: Omit<ChatMessage, 'id' | 'conversationId' | 'timestamp'>
): Promise<ChatMessage> {
  const fullMessage: ChatMessage = {
    ...message,
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    conversationId,
    timestamp: new Date().toISOString(),
    status: message.status || 'sent'
  };

  await putItem<ChatMessage>(STORES.MESSAGES, fullMessage);

  // Update conversation message count and updatedAt
  const conv = await getConversationById(conversationId);
  if (conv) {
    conv.messageCount = (conv.messageCount || 0) + 1;
    conv.updatedAt = new Date().toISOString();
    await saveConversation(conv);
  }

  return fullMessage;
}

// ==========================================
// 4. Knowledge Base Repository (Offline Ready)
// ==========================================

export async function getAllKnowledgeItems(): Promise<KnowledgeItem[]> {
  try {
    return await getAllItems<KnowledgeItem>(STORES.KNOWLEDGE_BASE);
  } catch (error) {
    console.error('Failed to get knowledge items:', error);
    return [];
  }
}

export async function getKnowledgeItemsByCategory(
  category: KnowledgeItem['category']
): Promise<KnowledgeItem[]> {
  return getByIndex<KnowledgeItem>(STORES.KNOWLEDGE_BASE, 'category', category);
}

export async function saveKnowledgeItem(item: KnowledgeItem): Promise<KnowledgeItem> {
  await putItem<KnowledgeItem>(STORES.KNOWLEDGE_BASE, item);
  return item;
}

export async function searchOfflineKnowledge(query: string): Promise<KnowledgeItem[]> {
  const all = await getAllKnowledgeItems();
  const q = query.trim().toLowerCase();
  if (!q) return all;

  return all.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      (item.englishTitle && item.englishTitle.toLowerCase().includes(q)) ||
      (item.code && item.code.toLowerCase().includes(q)) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

// Seed initial knowledge base entries if empty (for offline testing)
export async function seedOfflineKnowledgeBaseIfEmpty(): Promise<void> {
  const count = await countItems(STORES.KNOWLEDGE_BASE);
  if (count > 0) return;

  const initialItems: KnowledgeItem[] = [
    {
      id: 'kb_inso_2852',
      category: 'standard',
      code: 'INSO 2852',
      title: 'استاندارد ملی شیر و فرآورده‌های آن - ویژگی‌های میکروبیولوژی',
      englishTitle: 'Milk & Dairy Products - Microbiological Specifications',
      description: 'حدود مجاز بار میکروبی، کلی‌فرم، استافیلوکوکوس و سالمونلا در شیر خام و پاستوریزه',
      content: 'تعیین ویژگی‌های میکروبیولوژیک شیر پاستوریزه، استریلیزه و فرآورده‌های شیری مطابق با الزامات سازمان ملی استاندارد ایران.',
      version: '1401',
      tags: ['لبنیات', 'میکروبیولوژی', 'استاندارد ملی', 'شیر'],
      offlineAvailable: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kb_form_mayo_1',
      category: 'formulation',
      code: 'FORM-MY-01',
      title: 'فرمولاسیون سس مایونز کم‌چرب با قوام‌دهنده هیدروکلوئیدی',
      englishTitle: 'Low-Fat Mayonnaise Formulation using Hydrocolloids',
      description: 'جایگزینی فاز روغنی با نشاسته اصلاح‌شده و صمغ زانتان جهت کاهش کالری و حفظ بافت',
      content: 'نسبت‌های استاندارد فاز آبی، روغن گیاهی، زرده تخم‌مرغ و هیدروکلوئیدها جهت دستیابی به ویسکوزیته و پایداری امولسیون.',
      version: '2.1',
      tags: ['فرمولاسیون', 'امولسیون', 'سس', 'هیدروکلوئید'],
      offlineAvailable: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kb_method_titration_acidity',
      category: 'lab_method',
      code: 'AOAC 942.15',
      title: 'روش استاندارد اندازه‌گیری اسیدیته قابل تیتر (Titratable Acidity)',
      englishTitle: 'Standard Method for Titratable Acidity in Fruit Products',
      description: 'تیتراسیون با سود ۰.۱ نرمال در حضور معرف فنل‌فتالئین برای آبمیوه‌ها و کنسانتره',
      content: 'شرح گام‌به‌گام آماده‌سازی نمونه، تیتراسیون و محاسبه درصد اسید سیتریک بر اساس گرم در ۱۰۰ میلی‌لیتر.',
      version: '19th Ed',
      tags: ['آزمایشگاه', 'اسیدیته', 'کنترل کیفیت', 'AOAC'],
      offlineAvailable: true,
      updatedAt: new Date().toISOString()
    }
  ];

  for (const item of initialItems) {
    await putItem<KnowledgeItem>(STORES.KNOWLEDGE_BASE, item);
  }
}

// ==========================================
// 5. Storage Statistics & Maintenance
// ==========================================

export async function getStorageStatistics(): Promise<StorageStats> {
  const storeEntries = Object.entries(STORES) as Array<[string, typeof STORES[keyof typeof STORES]]>;
  const countPairs = await Promise.all(
    storeEntries.map(async ([, storeName]) => {
      const cnt = await countItems(storeName).catch(() => 0);
      return [storeName, cnt] as const;
    })
  );

  const storeCounts: Record<string, number> = {};
  let totalRecordsCount = 0;
  for (const [storeName, cnt] of countPairs) {
    storeCounts[storeName] = cnt;
    totalRecordsCount += cnt;
  }

  let usageBytes = 0;
  let quotaBytes = 0;
  let isPersisted = false;

  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      usageBytes = estimate.usage || 0;
      quotaBytes = estimate.quota || 0;
    } catch {
      // ignore
    }
  }

  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persisted) {
    try {
      isPersisted = await navigator.storage.persisted();
    } catch {
      // ignore
    }
  }

  const usagePercentage = quotaBytes > 0 ? (usageBytes / quotaBytes) * 100 : 0;

  return {
    usageBytes,
    quotaBytes,
    usagePercentage,
    conversationsCount: storeCounts[STORES.CONVERSATIONS] || 0,
    messagesCount: storeCounts[STORES.MESSAGES] || 0,
    knowledgeItemsCount: storeCounts[STORES.KNOWLEDGE_BASE] || 0,
    knowledgeRecordsCount: storeCounts[STORES.KNOWLEDGE_RECORDS] || 0,
    scientificSourcesCount: storeCounts[STORES.SCIENTIFIC_SOURCES] || 0,
    settingsCount: storeCounts[STORES.SETTINGS] || 0,
    activeStoresCount: storeEntries.length,
    totalRecordsCount,
    storeCounts,
    isPersisted
  };
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    return await navigator.storage.persist();
  }
  return false;
}

export async function clearAllOfflineData(): Promise<void> {
  const storeNames = Object.values(STORES).filter((s) => s !== STORES.SETTINGS);
  await Promise.all(storeNames.map((s) => clearStore(s).catch(() => {})));
  // Reset settings
  await putItem<UserSettings>(STORES.SETTINGS, DEFAULT_SETTINGS);
}

export async function exportOfflineBackup(): Promise<string> {
  const storeEntries = Object.entries(STORES) as Array<[string, typeof STORES[keyof typeof STORES]]>;
  const storesPayload: Record<string, unknown[]> = {};

  await Promise.all(
    storeEntries.map(async ([, storeName]) => {
      storesPayload[storeName] = await getAllItems(storeName).catch(() => []);
    })
  );

  const backupData = {
    version: 3,
    exportDate: new Date().toISOString(),
    app: 'Food Science AI',
    storeCount: storeEntries.length,
    data: {
      settings: storesPayload[STORES.SETTINGS] || [],
      conversations: storesPayload[STORES.CONVERSATIONS] || [],
      messages: storesPayload[STORES.MESSAGES] || [],
      knowledgeBase: storesPayload[STORES.KNOWLEDGE_BASE] || [],
      knowledgeRecords: storesPayload[STORES.KNOWLEDGE_RECORDS] || [],
      scientificSources: storesPayload[STORES.SCIENTIFIC_SOURCES] || []
    },
    stores: storesPayload
  };

  return JSON.stringify(backupData, null, 2);
}

export async function importOfflineBackup(jsonString: string): Promise<{ restoredRecords: number }> {
  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('فرمت فایل پشتیبان نامعتبر است.');
  }

  let restoredRecords = 0;
  const validStoreNames = new Set<string>(Object.values(STORES));

  // Support both v3 (`stores` map across all 18 stores) and legacy v2 (`data` map)
  const storesMap: Record<string, unknown[]> =
    parsed.stores && typeof parsed.stores === 'object'
      ? parsed.stores
      : {
          [STORES.SETTINGS]: parsed.data?.settings || [],
          [STORES.CONVERSATIONS]: parsed.data?.conversations || [],
          [STORES.MESSAGES]: parsed.data?.messages || [],
          [STORES.KNOWLEDGE_BASE]: parsed.data?.knowledgeBase || [],
          [STORES.KNOWLEDGE_RECORDS]: parsed.data?.knowledgeRecords || [],
          [STORES.SCIENTIFIC_SOURCES]: parsed.data?.scientificSources || []
        };

  for (const [storeName, items] of Object.entries(storesMap)) {
    if (!validStoreNames.has(storeName) || !Array.isArray(items)) continue;
    for (const item of items) {
      if (item && typeof item === 'object') {
        await putItem(storeName as typeof STORES[keyof typeof STORES], item);
        restoredRecords++;
      }
    }
  }

  return { restoredRecords };
}

// Export specialized repositories
export * from './knowledgeBase';
export * from './standardsStorage';
export * from './labStorage';
export * from './productStorage';
export * from './experimentStorage';
export * from './equipmentStorage';
export * from './reagentStorage';
export * from './scientificSourcesStorage';
