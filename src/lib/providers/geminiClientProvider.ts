import { ClientAIProvider, ClientChatRequest, ClientChatResponse, ClientStreamChunk } from './types';

/**
 * GeminiServerClientProvider
 * Communicates exclusively with the server-side API endpoints (/api/chat and /api/chat/stream).
 * Ensures that API keys are strictly kept on the server and never bundled in the client.
 */
export class GeminiServerClientProvider implements ClientAIProvider {
  public id = 'gemini-server';
  public name = 'Google Gemini AI (Server-Proxy)';

  /**
   * Non-streaming HTTP POST /api/chat
   */
  public async sendMessage(request: ClientChatRequest, signal?: AbortSignal): Promise<ClientChatResponse> {
    try {
      const response = await fetch('/api/chat', {
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
    try {
      const response = await fetch('/api/chat/stream', {
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
      throw err;
    }
  }
}
