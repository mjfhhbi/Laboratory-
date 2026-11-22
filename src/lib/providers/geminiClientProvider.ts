import { ClientAIProvider, ClientChatRequest, ClientChatResponse, ClientStreamChunk } from './types';
import { isCapacitorNative } from '../pwa';

/**
 * GeminiServerClientProvider
 * Communicates exclusively with the server-side API endpoints (/api/chat and /api/chat/stream).
 * Ensures that API keys are strictly kept on the server and never bundled in the client.
 */
export class GeminiServerClientProvider implements ClientAIProvider {
  public id = 'gemini-server';
  public name = 'Google Gemini AI (Server-Proxy)';

  private static readonly OFFLINE_ERROR_FA =
    'اتصال اینترنت برقرار نیست. ارسال پرسش جدید به دستیار هوش مصنوعی Gemini نیازمند اتصال سرور است؛ اما مشاهده تاریخچه مکالمات، محاسبات مهندسی، آزمایشگاه و محیط Python/SciPy به صورت کامل در حالت آفلاین در دسترس هستند.';

  private static readonly NATIVE_NO_API_BASE_ERROR_FA =
    'در این بسته اندرویدی آفلاین، نشانی سرور هوش مصنوعی (VITE_API_BASE_URL) تنظیم نشده است. تمام محاسبات مهندسی، آزمایشگاه، استانداردها و Python/SciPy به‌صورت کاملاً آفلاین در دسترس هستند؛ برای فعال‌سازی چت آنلاین Gemini در APK باید با تنظیم VITE_API_BASE_URL روی نشانی HTTPS سرور خروجی بگیرید.';

  private static getApiEndpoint(path: string): string {
    const rawBase =
      typeof import.meta !== 'undefined'
        ? (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL
        : undefined;
    const base = rawBase ? rawBase.trim().replace(/\/+$/, '') : '';
    if (!base && isCapacitorNative()) {
      throw new Error(GeminiServerClientProvider.NATIVE_NO_API_BASE_ERROR_FA);
    }
    return base ? `${base}${path}` : path;
  }

  /**
   * Non-streaming HTTP POST /api/chat
   */
  public async sendMessage(request: ClientChatRequest, signal?: AbortSignal): Promise<ClientChatResponse> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error(GeminiServerClientProvider.OFFLINE_ERROR_FA);
    }
    try {
      const response = await fetch(GeminiServerClientProvider.getApiEndpoint('/api/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(request),
        signal
      });

      if (!response.ok) {
        let errorData: { error?: string; code?: string } = {};
        try {
          errorData = await response.json();
        } catch {
          // Response was not JSON
        }

        if (response.status === 429) {
          throw new Error('محدودیت تعداد درخواست در دقیقه (Rate Limit) فرا رسیده است. لطفاً چند لحظه بعد تلاش کنید.');
        }

        if (response.status === 504 || response.status === 408) {
          throw new Error('زمان انتظار برای دریافت پاسخ از سرور به پایان رسید (Timeout).');
        }

        throw new Error(errorData.error || `خطای سرور با کد ${response.status}`);
      }

      const data: ClientChatResponse = await response.json();

      // Empty response fallback
      if (!data.reply || !data.reply.trim()) {
        return {
          ...data,
          reply: 'مدل پاسخی برای این پرسش ارائه نکرد. لطفاً مجدداً سوال خود را مطرح فرمایید.'
        };
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('درخواست توسط کاربر لغو گردید.');
      }
      if (err instanceof TypeError || (typeof navigator !== 'undefined' && !navigator.onLine)) {
        throw new Error(GeminiServerClientProvider.OFFLINE_ERROR_FA);
      }
      throw err;
    }
  }

  /**
   * Streaming HTTP POST /api/chat/stream using Server-Sent Events (SSE)
   */
  public async streamMessage(
    request: ClientChatRequest,
    onChunk: (chunk: ClientStreamChunk) => void,
    signal?: AbortSignal
  ): Promise<ClientChatResponse> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error(GeminiServerClientProvider.OFFLINE_ERROR_FA);
    }
    try {
      const response = await fetch(GeminiServerClientProvider.getApiEndpoint('/api/chat/stream'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(request),
        signal
      });

      if (!response.ok) {
        let errorData: { error?: string } = {};
        try {
          errorData = await response.json();
        } catch {
          // not json
        }

        if (response.status === 429) {
          throw new Error('محدودیت تعداد درخواست (Rate Limit) روی سرور فعال شد. لطفاً کمی بعد تلاش کنید.');
        }

        throw new Error(errorData.error || `خطای سرور با کد ${response.status}`);
      }

      if (!response.body) {
        throw new Error('پاسخ جریانی (Stream) از سرور دریافت نشد.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';
      let detectedModel = 'Google Gemini';
      let detectedReferences: string[] | undefined;
      let detectedSuggestedQuestions: string[] | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete trailing line

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:')) {
            const jsonStr = trimmed.replace(/^data:\s*/, '');
            if (!jsonStr) continue;

            try {
              const chunkData: ClientStreamChunk = JSON.parse(jsonStr);

              if (chunkData.error) {
                throw new Error(chunkData.error);
              }

              if (chunkData.model) detectedModel = chunkData.model;
              if (chunkData.references) detectedReferences = chunkData.references;
              if (chunkData.suggestedQuestions) detectedSuggestedQuestions = chunkData.suggestedQuestions;

              if (chunkData.fullText !== undefined) {
                accumulatedText = chunkData.fullText;
              } else if (chunkData.chunk) {
                accumulatedText += chunkData.chunk;
              }

              onChunk({
                conversationId: request.conversationId,
                chunk: chunkData.chunk || '',
                fullText: accumulatedText,
                done: chunkData.done,
                model: detectedModel,
                references: detectedReferences,
                suggestedQuestions: detectedSuggestedQuestions
              });
            } catch (parseError) {
              if (parseError instanceof Error && !parseError.message.includes('JSON')) {
                throw parseError;
              }
            }
          }
        }
      }

      // Empty response fallback
      if (!accumulatedText.trim()) {
        accumulatedText = 'مدل پاسخی برای این پرسش تولید نکرد. لطفاً مجدداً تلاش فرمایید.';
      }

      return {
        conversationId: request.conversationId,
        reply: accumulatedText,
        model: detectedModel,
        timestamp: new Date().toISOString(),
        references: detectedReferences,
        suggestedQuestions: detectedSuggestedQuestions
      };
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('تولید پاسخ متوقف گردید.');
      }
      if (err instanceof TypeError || (typeof navigator !== 'undefined' && !navigator.onLine)) {
        throw new Error(GeminiServerClientProvider.OFFLINE_ERROR_FA);
      }
      throw err;
    }
  }
}
