import { AIProvider } from '../types';
import { MockAIProvider } from './mockProvider';
import { GeminiAIProvider } from './geminiProvider';

type ProviderFactory = () => AIProvider;

const providerRegistry: Map<string, ProviderFactory> = new Map();

// Register built-in providers
providerRegistry.set('gemini', () => new GeminiAIProvider());
providerRegistry.set('mock', () => new MockAIProvider());

let activeProvider: AIProvider | null = null;

/**
 * Register a custom or third-party AI Provider for future extensibility (e.g. Claude, OpenAI, Local LLM)
 */
export function registerAIProvider(key: string, factory: ProviderFactory): void {
  providerRegistry.set(key.toLowerCase(), factory);
}

/**
 * Lists all registered AI Provider identifiers
 */
export function listAvailableProviders(): string[] {
  return Array.from(providerRegistry.keys());
}

/**
 * Returns the currently active AI Provider instance.
 * Automatically prefers GeminiAIProvider if GEMINI_API_KEY is available and AI_PROVIDER != 'mock'.
 */
export function getAIProvider(): AIProvider {
  if (!activeProvider) {
    const configuredProvider = (process.env.AI_PROVIDER || '').toLowerCase();

    if (configuredProvider && providerRegistry.has(configuredProvider)) {
      if (configuredProvider === 'gemini') {
        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
          activeProvider = providerRegistry.get('gemini')!();
        } else {
          console.warn('[AI Provider Warning] GEMINI_API_KEY is missing. Falling back to MockAIProvider.');
          activeProvider = providerRegistry.get('mock')!();
        }
      } else {
        activeProvider = providerRegistry.get(configuredProvider)!();
      }
    } else {
      // Default strategy: Use Gemini if key is provided, else fallback to Mock
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
        activeProvider = new GeminiAIProvider();
      } else {
        activeProvider = new MockAIProvider();
      }
    }
  }

  return activeProvider;
}

/**
 * Overrides or sets the active AI Provider
 */
export function setAIProvider(provider: AIProvider | null): void {
  activeProvider = provider;
}

export { GeminiAIProvider } from './geminiProvider';
export { MockAIProvider } from './mockProvider';
