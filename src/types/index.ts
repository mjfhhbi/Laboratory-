export type ThemeMode = 'light' | 'dark' | 'system';

export interface NavItem {
  id: string;
  title: string;
  englishTitle?: string;
  path: string;
  iconName: string;
  description: string;
  category?: 'core' | 'lab' | 'knowledge' | 'system';
  badge?: string;
  phase?: number;
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
}

export interface QuickAccessItem {
  id: string;
  title: string;
  englishTitle: string;
  path: string;
  iconName: string;
  description: string;
  category: 'core' | 'lab' | 'knowledge' | 'system';
  badge?: string;
  accentColor: string; // e.g. emerald, blue, amber, violet
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  subtext?: string;
  iconName: string;
  statusColor?: 'emerald' | 'blue' | 'amber' | 'stone';
}

// Storage and Offline Architecture Types
export interface UserSettings {
  id?: string;
  theme: ThemeMode;
  language: 'fa' | 'en';
  autoSaveHistory: boolean;
  offlineCacheEnabled: boolean;
  offlineDataSync: boolean;
  activeLabPreset?: string;
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  status?: 'sent' | 'pending' | 'error';
  tags?: string[];
  metadata?: {
    model?: string;
    offlineGenerated?: boolean;
    referenceDocs?: string[];
    calculationResult?: Record<string, unknown>;
  };
}

export interface Conversation {
  id: string;
  title: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  category?: 'general' | 'formulation' | 'quality_control' | 'standard_inquiry' | 'calculation';
  messageCount: number;
  tags?: string[];
}

export interface KnowledgeItem {
  id: string;
  category: 'standard' | 'formulation' | 'lab_method' | 'equipment_spec' | 'scientific_reference';
  code?: string; // e.g. INSO-2852, ISO-22000, Codex-STAN-12
  title: string;
  englishTitle?: string;
  description: string;
  content: string;
  version: string;
  tags: string[];
  offlineAvailable: boolean;
  updatedAt: string;
}

export interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  entity: 'conversation' | 'message' | 'setting' | 'experiment' | 'knowledge';
  payload: Record<string, unknown>;
  createdAt: string;
  attempts: number;
  status: 'pending' | 'failed' | 'synced';
}

export interface StorageStats {
  usageBytes: number;
  quotaBytes: number;
  usagePercentage: number;
  conversationsCount: number;
  messagesCount: number;
  knowledgeItemsCount: number;
  knowledgeRecordsCount?: number;
  scientificSourcesCount?: number;
  settingsCount: number;
  isPersisted: boolean;
}

export * from './knowledgeBase';
export * from './foodStandard';
export * from './laboratory';
export * from './calculations';
export * from './foodProduct';
export * from './foodExperiment';
export * from './laboratoryEquipment';
export * from './troubleshooting';
export * from './microbiology';
export * from './foodChemistry';

