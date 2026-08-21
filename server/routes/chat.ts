import { Router, Request, Response } from 'express';
import { getAIProvider } from '../providers';
import { ChatRequestDto, StreamChunkDto } from '../types';

const router = Router();

const MAX_MESSAGE_LENGTH = 4000;
const MIN_MESSAGE_LENGTH = 1;
const DEFAULT_TIMEOUT_MS = 55000; // 55 seconds timeout

/**
 * Validates chat request payload
 */
function validateChatRequest(body: Partial<ChatRequestDto>): { valid: boolean; error?: string; code?: string; payload?: ChatRequestDto } {
  const { conversationId, message, history, topic, context } = body;

  if (!message || typeof message !== 'string') {
    return {
      valid: false,
      error: 'متن پیام الزامی است و باید به صورت رشته متنی ارسال شود.',
      code: 'MISSING_MESSAGE'
    };
  }

  const trimmed = message.trim();

  if (trimmed.length < MIN_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: 'متن پیام نمی‌تواند خالی باشد.',
      code: 'EMPTY_MESSAGE'
    };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `طول پیام ارسالی بیش از حد مجاز است (حداکثر ${MAX_MESSAGE_LENGTH} کاراکتر، ارسال شده: ${trimmed.length} کاراکتر).`,
      code: 'MESSAGE_TOO_LONG'
    };
  }

  const validConvId = conversationId || 'conv_' + Date.now();

  return {
    valid: true,
    payload: {
      conversationId: validConvId,
      message: trimmed,
      history: Array.isArray(history) ? history : [],
      topic,
      context
    }
  };
}

/**
 * GET /api/chat/status
 * Returns operational status and active model information (without sensitive keys)
 */
router.get('/status', (_req: Request, res: Response) => {
  const provider = getAIProvider();
  res.status(200).json({
    status: 'online',
    providerName: provider.name,
    modelId: provider.modelId,
    streamingSupported: true,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '')
  });
});

/**
 * POST /api/chat
 * Standard non-streaming chat endpoint with timeout & validation
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const validation = validateChatRequest(req.body);
  if (!validation.valid || !validation.payload) {
    res.status(400).json({
      error: validation.error,
      code: validation.code
    });
    return;
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, DEFAULT_TIMEOUT_MS);

  req.on('close', () => {
    abortController.abort();
    clearTimeout(timeoutId);
  });

  try {
    const provider = getAIProvider();
    const response = await provider.generateResponse(validation.payload, abortController.signal);
    clearTimeout(timeoutId);
    res.status(200).json(response);
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    console.error('Error in /api/chat endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'خطای نامشخص در پردازش پیام';
    res.status(500).json({
      error: errorMessage,
      code: 'AI_GENERATION_FAILED'
    });
  }
});

/**
 * POST /api/chat/stream
 * Server-Sent Events (SSE) streaming chat endpoint
 */
router.post('/stream', async (req: Request, res: Response): Promise<void> => {
  const validation = validateChatRequest(req.body);
  if (!validation.valid || !validation.payload) {
    res.status(400).json({
      error: validation.error,
      code: validation.code
    });
    return;
  }

  // Setup Server-Sent Events headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, DEFAULT_TIMEOUT_MS);

  let isClosed = false;

  req.on('close', () => {
    isClosed = true;
    abortController.abort();
    clearTimeout(timeoutId);
  });

  const sendEvent = (chunk: StreamChunkDto) => {
    if (!isClosed && !res.writableEnded) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
  };

  try {
    const provider = getAIProvider();
    await provider.generateStream(
      validation.payload,
      (chunk: StreamChunkDto) => {
        sendEvent(chunk);
      },
      abortController.signal
    );

    clearTimeout(timeoutId);
    if (!isClosed && !res.writableEnded) {
      res.end();
    }
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    console.error('Error in /api/chat/stream endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'خطای نامشخص در جریان ارسال پاسخ';
    if (!isClosed && !res.writableEnded) {
      sendEvent({
        conversationId: validation.payload.conversationId,
        chunk: '',
        done: true,
        error: errorMessage
      });
      res.end();
    }
  }
});

export default router;
