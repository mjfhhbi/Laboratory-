import { ClientAIProvider, ClientChatRequest, ClientChatResponse, ClientStreamChunk, ServerStatusResponse } from './types';
import { GeminiServerClientProvider } from './geminiClientProvider';

// Provider registry for client-side routing
const clientProviders: Map<string, () => ClientAIProvider> = new Map();

// Register default server provider
clientProviders.set('gemini', () => new GeminiServerClientProvider());
clientProviders.set('default', () => new GeminiServerClientProvider());

let activeClientProvider: ClientAIProvider | null = null;

/**
 * Register additional client AI providers (e.g. for custom local LLMs, mock testing, etc.)
 */
export function registerClientAIProvider(key: string, factory: () => ClientAIProvider): void {
  clientProviders.set(key.toLowerCase(), factory);
}

/**
 * Get active client AI provider instance
 */
export function getClientAIProvider(providerKey?: string): ClientAIProvider {
  if (providerKey && clientProviders.has(providerKey.toLowerCase())) {
    return clientProviders.get(providerKey.toLowerCase())!();
  }

  if (!activeClientProvider) {
    activeClientProvider = new GeminiServerClientProvider();
  }
  return activeClientProvider;
}

/**
 * Fetch server-side status (active model, streaming support, and connectivity)
 */
export async function checkServerAIStatus(): Promise<ServerStatusResponse | null> {
  try {
    const res = await fetch('/api/chat/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not retrieve server AI status:', e);
  }
  return null;
}

/**
 * High-level helper: send message with optional streaming
 */
export async function sendChatMessage(
  request: ClientChatRequest,
  options?: {
    useStreaming?: boolean;
    onChunk?: (chunk: ClientStreamChunk) => void;
    signal?: AbortSignal;
  }
): Promise<ClientChatResponse> {
  const provider = getClientAIProvider();

  if (options?.useStreaming && options.onChunk) {
    return await provider.streamMessage(request, options.onChunk, options.signal);
  }

  return await provider.sendMessage(request, options?.signal);
}

export * from './types';
export { GeminiServerClientProvider } from './geminiClientProvider';
