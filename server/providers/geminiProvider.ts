import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { AIProvider, ChatRequestDto, ChatResponseDto, StreamChunkDto } from '../types';

/**
 * GeminiAIProvider
 * Production-ready server-side Gemini AI Provider using modern @google/genai SDK.
 * Handles streaming, conversation history, timeout signals, rate-limiting, and empty response fallbacks.
 */
export class GeminiAIProvider implements AIProvider {
  public name = 'Google Gemini AI';
  private client: GoogleGenAI | null = null;

  public get modelId(): string {
    return process.env.GEMINI_MODEL || 'gemini-3.7-flash';
  }

  private getClient(): GoogleGenAI {
    if (!this.client) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '') {
        throw new Error('کلید دسترسی GEMINI_API_KEY در متغیرهای محیطی سرور یافت نشد.');
      }
      this.client = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
    return this.client;
  }

  private getSystemInstruction(): string {
    return `شما دستیار ارشد هوشمند، متخصص کنترل کیفیت و فرمولاسیون در علوم و مهندسی صنایع غذایی (Food Science AI) هستید.
زبان اصلی پاسخ‌دهی شما فارسی سلیس، دقیق و کاملاً علمی است.

اصول و چارچوب پاسخ‌دهی و اعتبارسنجی علمی:
۱. در تحلیل‌ها به استانداردهای ملی ایران (INSO)، کدکس بین‌المللی (Codex Alimentarius)، روش‌های آزمون AOAC، استاندارد FDA و سیستم‌های ایمنی HACCP / ISO 22000 استناد کنید.
۲. اصل تفکیک داده‌های مستند از تخمین: هرگز اطلاعات، حدود مجاز آزمایشگاهی یا استانداردهای فاقد منبع را به عنوان «حقیقت علمی قطعی» بیان نکنید. اگر برای یک پارامتر یا روش آزمون منبع رسمی مشخص وجود ندارد، صراحتاً قید کنید که نیازمند استعلام از استاندارد مربوطه یا آزمون آزمایشگاهی است و از ساختن داده‌های جعلی (Hallucinated Data) اکیداً خودداری کنید.
۳. برای فرمول‌ها، واکنش‌های شیمیایی و محاسبات ترمودینامیکی/سینتیکی حتماً از ساختار استاندارد LaTeX ($...$ برای درون‌خطی و $$...$$ برای بلوک فرمول) استفاده کنید (نظیر $a_w$, $D$-value, $z$-value, $F_0$, معادلات GAB و BET، قانون استوکس، بریکس و اسیدیته TA).
۴. جداول مشخصات فیزیکوشیمیایی، ویژگی‌های رئولوژیکی، مقادیر مجاز افزودنی‌ها و فرمولاسیون‌ها را در قالب Markdown Tables منظم همراه با ذکر واحد اندازه‌گیری و حدود خطای مجاز ترسیم کنید.
۵. اسکریپت‌ها یا توابع محاسباتی را داخل بلوک کد همراه با نام زبان (\`\`\`python یا \`\`\`typescript) قرار دهید.
۶. پاسخ‌ها را ساختاریافته با عناوین شفاف و بندهای مشخص، همراه با ارجاع به منابع معتبر ارائه دهید.`;
  }

  /**
   * Formats chat history into the structure expected by @google/genai
   */
  private formatContents(request: ChatRequestDto) {
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (request.history && Array.isArray(request.history)) {
      for (const msg of request.history) {
        if (!msg.content || typeof msg.content !== 'string') continue;
        const role = msg.role === 'assistant' ? 'model' : 'user';
        contents.push({
          role,
          parts: [{ text: msg.content }]
        });
      }
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: request.message }]
    });

    return contents;
  }

  /**
   * Translates raw API errors into clean, informative Persian error descriptions
   */
  private formatApiError(error: unknown): Error {
    const rawMsg = error instanceof Error ? error.message : String(error);
    console.error('[GeminiAIProvider Error]:', rawMsg);

    // Rate Limit / Quota Exceeded
    if (rawMsg.includes('429') || rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('Quota')) {
      return new Error('محدودیت تعداد درخواست در دقیقه (Rate Limit) فرا رسیده است. لطفاً چند لحظه تأمل نموده و مجدداً تلاش فرمایید.');
    }

    // Invalid API Key / Auth Error
    if (rawMsg.includes('API_KEY_INVALID') || rawMsg.includes('401') || rawMsg.includes('403') || rawMsg.includes('UNAUTHENTICATED')) {
      return new Error('کلید دسترسی Gemini نامعتبر است یا دسترسی لازم وجود ندارد. لطفاً تنظیمات GEMINI_API_KEY را بررسی نمایید.');
    }

    // Request Timeout
    if (rawMsg.includes('timeout') || rawMsg.includes('ETIMEDOUT') || rawMsg.includes('AbortError')) {
      return new Error('زمان انتظار برای دریافت پاسخ از مدل به پایان رسید (Timeout). لطفاً ارتباط اینترنت را بررسی فرمایید.');
    }

    // Model Not Found or Invalid Model
    if (rawMsg.includes('not found') || rawMsg.includes('NOT_FOUND')) {
      return new Error(`مدل هوش مصنوعی انتخابی (${this.modelId}) در دسترس نمی‌باشد.`);
    }

    return new Error(`خطای ارتباط با سرور Gemini: ${rawMsg}`);
  }

  /**
   * Generates a non-streaming response
   */
  public async generateResponse(request: ChatRequestDto, signal?: AbortSignal): Promise<ChatResponseDto> {
    if (signal?.aborted) {
      throw new Error('درخواست توسط کاربر لغو گردید.');
    }

    try {
      const ai = this.getClient();
      const model = this.modelId;
      const contents = this.formatContents(request);

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: this.getSystemInstruction(),
          temperature: request.context?.temperature ?? 0.4
        }
      });

      const replyText = response.text?.trim();

      // Empty response fallback management
      if (!replyText) {
        return {
          conversationId: request.conversationId,
          reply: 'مدل هوش مصنوعی پاسخی برای این پرسش ارائه نکرد. لطفاً پرسش خود را با جزئیات بیشتر مطرح نمایید.',
          model,
          timestamp: new Date().toISOString(),
          references: ['INSO / Codex Standards']
        };
      }

      return {
        conversationId: request.conversationId,
        reply: replyText,
        model,
        timestamp: new Date().toISOString(),
        references: ['استانداردهای ملی ایران (INSO)', 'کدکس بین‌المللی (Codex Alimentarius)', 'AOAC International']
      };
    } catch (error) {
      throw this.formatApiError(error);
    }
  }

  /**
   * Generates a real-time streaming response
   */
  public async generateStream(
    request: ChatRequestDto,
    onChunk: (chunk: StreamChunkDto) => void,
    signal?: AbortSignal
  ): Promise<ChatResponseDto> {
    if (signal?.aborted) {
      throw new Error('درخواست توسط کاربر لغو گردید.');
    }

    try {
      const ai = this.getClient();
      const model = this.modelId;
      const contents = this.formatContents(request);

      const streamResponse = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: this.getSystemInstruction(),
          temperature: request.context?.temperature ?? 0.4
        }
      });

      let fullAccumulatedText = '';

      for await (const chunk of streamResponse) {
        if (signal?.aborted) {
          throw new Error('درخواست توسط کاربر لغو گردید.');
        }

        const chunkObj = chunk as GenerateContentResponse;
        const textPiece = chunkObj.text || '';
        if (textPiece) {
          fullAccumulatedText += textPiece;
          onChunk({
            conversationId: request.conversationId,
            chunk: textPiece,
            fullText: fullAccumulatedText,
            done: false,
            model
          });
        }
      }

      // Empty response check
      if (!fullAccumulatedText.trim()) {
        fullAccumulatedText = 'مدل هوش مصنوعی پاسخی برای این پرسش ارائه نکرد. لطفاً پرسش خود را بازنویسی فرمایید.';
      }

      const references = ['استانداردهای ملی ایران (INSO)', 'کدکس بین‌المللی (Codex Alimentarius)', 'AOAC International'];

      // Send final completion chunk
      onChunk({
        conversationId: request.conversationId,
        chunk: '',
        fullText: fullAccumulatedText,
        done: true,
        model,
        references
      });

      return {
        conversationId: request.conversationId,
        reply: fullAccumulatedText,
        model,
        timestamp: new Date().toISOString(),
        references
      };
    } catch (error) {
      throw this.formatApiError(error);
    }
  }
}
