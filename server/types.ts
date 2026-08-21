export interface ChatMessageDto {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatRequestDto {
  conversationId: string;
  message: string;
  history?: ChatMessageDto[];
  topic?: string;
  context?: {
    labPreset?: string;
    offlineMode?: boolean;
    temperature?: number;
  };
}

export interface ChatResponseDto {
  conversationId: string;
  reply: string;
  model: string;
  timestamp: string;
  suggestedQuestions?: string[];
  calculations?: Record<string, unknown>;
  references?: string[];
}

export interface StreamChunkDto {
  conversationId: string;
  chunk: string;
  fullText?: string;
  done: boolean;
  model?: string;
  references?: string[];
  suggestedQuestions?: string[];
  error?: string;
}

export interface AIProvider {
  name: string;
  modelId: string;
  generateResponse(request: ChatRequestDto, signal?: AbortSignal): Promise<ChatResponseDto>;
  generateStream(
    request: ChatRequestDto,
    onChunk: (chunk: StreamChunkDto) => void,
    signal?: AbortSignal
  ): Promise<ChatResponseDto>;
}
