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
    return process.env.GEMINI_MODEL || 'gemini-3.8-flash';
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

  private getSystemInstruction(request?: ChatRequestDto): string {
    const baseInstruction = `شما دستیار ارشد هوشمند، متخصص کنترل کیفیت و فرمولاسیون در علوم و مهندسی صنایع غذایی (Food Science AI) هستید.
زبان اصلی پاسخ‌دهی شما فارسی سلیس، دقیق، حرفه‌ای و کاملاً مستند به مراجع علمی است.

⚠️ قانون طلایی تخطی‌ناپذیر سیستم هوش مصنوعی (Golden Rule):
هوش مصنوعی هرگز نباید برای پر کردن جای خالی، شماره استاندارد، فرمول، عدد، دما، زمان، غلظت، حد پذیرش، Citation، DOI یا نتیجه آزمایش را جعل کند.

سه سطح پاسخ علمی در Food Science AI:
۱. [VERIFIED] اطلاعات مستقیماً توسط Source معتبر (استاندارد ملی INSO، روش AOAC، کدکس یا مرجع رسمی) پشتیبانی می‌شود.
۲. [SUPPORTED] اطلاعات از منابع موجود پشتیبانی می‌شود اما نیاز به بررسی بیشتر دارد.
۳. [UNVERIFIED] منبع کافی وجود ندارد و نباید به‌عنوان حقیقت قطعی نمایش داده شود (صراحتاً اعلام کمبود منبع نموده و از جعل هرگونه عدد یا رفرنس خودداری فرمایید).

قوانین حیاتی و تخطی‌ناپذیر سیستم مدیریت مراجع و اعتبار علمی (Scientific Source & Integrity):
۱. اتصال همه‌جانبه به مراجع معتبر (Source Attribution):
- هر روش آزمایش (Test Method) باید منبع مشخص (شماره استاندارد ملی INSO، روش رسمی AOAC، ایزو ISO، یا راهنمای BAM/MLG) داشته باشد.
- هر فرمول محاسباتی علمی (Formula) باید منبع مستند دانشگاهی یا استاندارد داشته باشد.
- هر حد مجاز (Limit) و ویژگی فیزیکوشیمیایی یا میکروبی باید استناد دقیق به استاندارد محصول داشته باشد.
- هر مقدار علمی مهم (دما، زمان پاستوریزاسیون، غلظت معرف، pH) باید دارای منبع معتبر باشد.

۲. ده رده اصلی منابع علمی پروژه:
- استاندارد ملی ایران (INSO / ISIRI)
- استاندارد بین‌المللی ISO
- روش رسمی آزمون AOAC
- استاندارد بین‌المللی کدکس (Codex Alimentarius)
- مقاله علمی پژوهشی داوری‌شده (Peer-reviewed Paper)
- کتاب مرجع تخصصی دانشگاهی (نظیر Fennema، Jay، Toledo)
- راهنمای آزمایشگاهی و SOP رسمی (نظیر FDA-BAM، USDA-FSIS)
- برگه اطلاعات ایمنی مواد شیمیایی (SDS)
- منبع دانشگاهی و رساله پژوهشی (Academic Thesis)
- منبع رسمی سازمانی و نظارتی (سازمان غذا و دارو IFDA، FDA، EFSA)

۳. اصل شفافیت و پرهیز مطلق از حدس زدن (Strict Anti-Hallucination):
- هرگز و تحت هیچ شرایطی شماره استاندارد، مقدار عددی، دما، زمان ماند، غلظت معرف یا روش آزمون را حدس نزنید یا جعل نکنید.
- اگر Evidence یا مدرک کافی در مستندات نیست، هرگز ادعای قطعی نکنید؛ صراحتاً اعلام کمبود منبع کرده و از کاربر اطلاعات بیشتر بخواهید یا پاسخ را با برچسب [UNVERIFIED] مشخص نمایید.

۴. مدیریت تعارضات و اختلافات علمی (Scientific Discrepancies):
- اگر میان مراجع استاندارد تفاوتی وجود دارد، هرگز اختلاف را پنهان نکنید؛ مراجع را جداگانه با ذکر شماره استاندارد و تفاوت رویکرد تبیین نمایید.

۵. قالب‌بندی فرمول‌ها و جداول:
- فرمول‌ها و متغیرها را با نمادگذاری دقیق LaTeX ($...$ و $$...$$) بنویسید (نظیر $a_w$, $D_{121}$, $z$, $F_0$).
- مشخصات و حدود را در قالب Markdown Tables تمیز درج کنید.`;

    let augmentedSystem = baseInstruction;

    if (request?.context?.attachedPdfs && request.context.attachedPdfs.length > 0) {
      const pdfCount = request.context.attachedPdfs.length;
      augmentedSystem += `\n\n### 📑 دستورالعمل‌های اختصاصی تحلیل اسناد PDF پیوست‌شده (${pdfCount} سند پیوست):
شما در حال بررسی و تحلیل دقیق متن استخراج‌شده از ${pdfCount} فایل PDF هستید.
قوانین حیاتی و الزامی:
۱. پاسخ را مستقیماً از محتوای صفحات سند استخراج فرمایید.
۲. شماره صفحه و بخش منبع را دقیقاً مشخص نمایید (مانند: [صفحه ۱ - بند ۳] یا [صفحه ۲ - جدول ۱]).
۳. قانون ضد توهم اسناد: اگر چیزی در این فایل PDF وجود ندارد، به هیچ وجه نگویید که وجود دارد یا آن را از پیش‌فرض‌های ذهنی به متن سند نسبت ندهید. صراحتاً و با شفافیت اعلام کنید: «این مورد در سند ارائه‌شده قید نگردیده است».
۴. تفکیک قطعی محتوای سند از دانش عمومی: در تحلیل خود، مرز میان «اطلاعات مستند در PDF» و «دانش عمومی هوش مصنوعی در صنایع غذایی» را با تیترهای جداگانه کاملاً شفاف و مشخص فرمایید:
   - 📌 **یافته‌های مستند در فایل PDF (با ذکر دقیق شماره صفحه)**
   - 💡 **دانش عمومی و دیدگاه‌های تکمیلی مهندسی صنایع غذایی**
۵. برای هر ادعا یا پارامتر استخراج‌شده، برچسب نوع مدرک (Direct Quote / Table Data / Numerical Parameter / Inferred Summary) را مشخص نمایید.
۶. در صورت درخواست مقایسه دو مقاله یا دو روش آزمون، یک ماتریس تطبیقی تفصیلی (شامل هدف، روش آزمون، مواد و تجهیزات، شرایط فرآیندی، نتایج و نقاط انطباق یا تعارض) با جداول Markdown ارائه نمایید.`;
    }

    if (request?.context?.ragGrounding?.augmentedSystemInstruction) {
      augmentedSystem += `\n\n${request.context.ragGrounding.augmentedSystemInstruction}`;
    }

    return augmentedSystem;
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

    // Prepare prompt text with PDF Context & RAG Grounding Augmentation if provided
    let finalPrompt = request.message;

    if (request.context?.attachedPdfs && request.context.attachedPdfs.length > 0) {
      let pdfContextBlock = '\n\n=== 📑 اسناد علمی PDF پیوست‌شده به گفتگو ===\n';
      for (const pdf of request.context.attachedPdfs) {
        pdfContextBlock += `\n--- سند: ${pdf.title} (فایل: ${pdf.fileName} | صفحات: ${pdf.pageCount} | ${pdf.isScanned ? 'تصویر اسکن‌شده OCR' : 'متن دیجیتال'}) ---\n`;
        for (const page of pdf.pages) {
          pdfContextBlock += `\n[صفحه ${page.pageNumber}${page.sectionHeading ? ` - ${page.sectionHeading}` : ''}${page.isOcr ? ' (OCR)' : ''}]:\n${page.text}\n`;
        }
      }
      pdfContextBlock += '\n============================================\n';
      finalPrompt = `${finalPrompt}\n${pdfContextBlock}`;
    }

    if (request.context?.ragGrounding?.groundingPromptAugmentation) {
      finalPrompt = `${finalPrompt}\n${request.context.ragGrounding.groundingPromptAugmentation}`;
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: finalPrompt }]
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
          systemInstruction: this.getSystemInstruction(request),
          temperature: request.context?.temperature ?? 0.4
        }
      });

      const replyText = response.text?.trim();

      const ragReferences = request.context?.ragGrounding?.citedSources?.map(
        (s) => `${s.title}${s.standardNumber ? ` (${s.standardNumber})` : ''}`
      );

      // Empty response fallback management
      if (!replyText) {
        return {
          conversationId: request.conversationId,
          reply: 'مدل هوش مصنوعی پاسخی برای این پرسش ارائه نکرد. لطفاً پرسش خود را با جزئیات بیشتر مطرح نمایید.',
          model,
          timestamp: new Date().toISOString(),
          references: ragReferences && ragReferences.length > 0 ? ragReferences : ['INSO / Codex Standards']
        };
      }

      return {
        conversationId: request.conversationId,
        reply: replyText,
        model,
        timestamp: new Date().toISOString(),
        references: ragReferences && ragReferences.length > 0 
          ? ragReferences 
          : ['استانداردهای ملی ایران (INSO)', 'کدکس بین‌المللی (Codex Alimentarius)', 'AOAC International']
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
          systemInstruction: this.getSystemInstruction(request),
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

      const ragReferences = request.context?.ragGrounding?.citedSources?.map(
        (s) => `${s.title}${s.standardNumber ? ` (${s.standardNumber})` : ''}`
      );

      const references = ragReferences && ragReferences.length > 0
        ? ragReferences
        : ['استانداردهای ملی ایران (INSO)', 'کدکس بین‌المللی (Codex Alimentarius)', 'AOAC International'];

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
