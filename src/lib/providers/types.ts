export interface ClientChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ClientChatRequest {
  conversationId: string;
  message: string;
  history?: ClientChatMessage[];
  topic?: string;
  context?: {
    labPreset?: string;
    offlineMode?: boolean;
    temperature?: number;
  };
}

export interface ClientChatResponse {
  conversationId: string;
  reply: string;
  model: string;
  timestamp: string;
  suggestedQuestions?: string[];
  calculations?: Record<string, unknown>;
  references?: string[];
}

export interface ClientStreamChunk {
  conversationId: string;
  chunk: string;
  fullText?: string;
  done: boolean;
  model?: string;
  references?: string[];
  suggestedQuestions?: string[];
  error?: string;
}

export interface ServerStatusResponse {
  status: string;
  providerName: string;
  modelId: string;
  streamingSupported: boolean;
  hasApiKey: boolean;
}

export interface ClientAIProvider {
  id: string;
  name: string;
  sendMessage(request: ClientChatRequest, signal?: AbortSignal): Promise<ClientChatResponse>;
  streamMessage(
    request: ClientChatRequest,
    onChunk: (chunk: ClientStreamChunk) => void,
    signal?: AbortSignal
  ): Promise<ClientChatResponse>;
}
