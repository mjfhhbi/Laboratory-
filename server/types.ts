export interface ChatMessageDto {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ServerRagGroundingContext {
  intentLabelFa?: string;
  intentType?: string;
  evidenceLevel?: string;
  warningNoticeFa?: string;
  augmentedSystemInstruction?: string;
  groundingPromptAugmentation?: string;
  evidenceStrategy?: 'grounded_verified' | 'cautious_partial' | 'unverified_warning' | string;
  evidenceScore?: number;
  citedSources?: Array<{
    id: string;
    title: string;
    standardNumber?: string;
    sourceType: string;
    pageNumber?: number;
    confidenceLevel: string;
  }>;
}

export interface AttachedPdfPageDto {
  pageNumber: number;
  sectionHeading?: string;
  text: string;
  isOcr?: boolean;
}

export interface AttachedPdfDto {
  id: string;
  title: string;
  fileName: string;
  pageCount: number;
  fileSizeFormatted?: string;
  isScanned?: boolean;
  pages: AttachedPdfPageDto[];
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
    ragGrounding?: ServerRagGroundingContext;
    attachedPdfs?: AttachedPdfDto[];
    pdfExtractionAction?:
      | 'summary'
      | 'methodology'
      | 'materials_equipment'
      | 'parameters'
      | 'results'
      | 'tables'
      | 'references'
      | 'comparison'
      | 'qa';
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
