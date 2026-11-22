export type ThemeMode = 'light' | 'dark' | 'system';

export interface NavSubItem {
  id: string;
  title: string;
  englishTitle?: string;
  path: string;
  iconName?: string;
  description?: string;
  badge?: string;
}

export interface NavItem {
  id: string;
  title: string;
  englishTitle?: string;
  path: string;
  iconName: string;
  description: string;
  category?: 'core' | 'lab' | 'knowledge' | 'system' | 'engineering';
  badge?: string;
  phase?: number;
  subItems?: NavSubItem[];
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
    confidenceLevel?: 'verified' | 'source_backed' | 'partially_supported' | 'unverified';
    citedSources?: Array<{
      id: string;
      title: string;
      standardNumber?: string;
      sourceType: string;
      year?: string;
      authorOrOrganization?: string;
      hasPdf?: boolean;
      pdfDocumentId?: string;
      pageNumber?: number;
      snippet?: string;
      isOcr?: boolean;
      confidenceLevel: 'verified' | 'source_backed' | 'partially_supported' | 'unverified';
    }>;
    ragPipeline?: {
      intentLabelFa: string;
      intentType: string;
      searchMode: string;
      evidenceScore: number;
      evidenceLevel: 'sufficient' | 'partial' | 'insufficient';
      tier?: 'VERIFIED' | 'SUPPORTED' | 'UNVERIFIED';
      groundingStrategy: 'grounded_verified' | 'cautious_partial' | 'unverified_warning';
      missingFactors?: string[];
      warningNoticeFa?: string;
      retrievedChunksCount: number;
      rankedSourcesCount: number;
      executionTimeMs: number;
      stepTrace?: any;
    };
    discrepancyAlerts?: Array<{
      id: string;
      topicFa: string;
      primaryStandard: string;
      conflictingStandard: string;
      summaryFa: string;
      recommendationFa?: string;
    }>;
    attachedPdfs?: Array<{
      id: string;
      title: string;
      fileName: string;
      pageCount: number;
      fileSizeFormatted?: string;
      isScanned?: boolean;
    }>;
    pdfAnalysisResult?: {
      actionType: 'summary' | 'methodology' | 'materials_equipment' | 'parameters' | 'results' | 'tables' | 'references' | 'comparison' | 'qa';
      analyzedDocuments: Array<{
        id: string;
        title: string;
        fileName: string;
        pageCount: number;
        isScanned?: boolean;
      }>;
      claims: Array<{
        id: string;
        claimText: string;
        sourceTitle: string;
        sourceDocId: string;
        pageNumber: number;
        sectionHeading?: string;
        evidenceType: 'direct_quote' | 'table_data' | 'numerical_parameter' | 'inferred_summary';
        quoteExcerpt?: string;
        confidence: 'verified' | 'source_backed' | 'unverified';
      }>;
      parametersFound?: Array<{
        name: string;
        value: string;
        unit?: string;
        pageNumber: number;
        isLimit?: boolean;
      }>;
      tablesFound?: Array<{
        id: string;
        title: string;
        pageNumber: number;
        headers: string[];
        rows: string[][];
      }>;
      notMentionedInDocument?: string[];
      comparativeAspects?: Array<{
        aspect: string;
        doc1Finding: string;
        doc2Finding: string;
        agreementStatus: 'agreed' | 'discrepancy' | 'different_scope';
        details: string;
      }>;
      timestamp?: string;
    };
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
  activeStoresCount: number;
  totalRecordsCount: number;
  storeCounts?: Record<string, number>;
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
export * from './chemicalReagent';
export * from './qualityControl';
export * from './foodProductsCatalog';
export * from './scientificSource';
export * from './research';

