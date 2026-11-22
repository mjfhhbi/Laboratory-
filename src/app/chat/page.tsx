import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  getAllConversations,
  getMessagesByConversation,
  createConversation,
  addMessage,
  deleteConversation,
  saveConversation,
  renameConversation,
  clearConversationMessages
} from '../../lib/storage';
import { Conversation, ChatMessage } from '../../types';
import { useOnlineStatus } from '../../lib/useOnlineStatus';
import { ChatSidebar } from '../../components/chat/ChatSidebar';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { ChatMessageItem } from '../../components/chat/ChatMessageItem';
import { ChatInput } from '../../components/chat/ChatInput';
import { ChatEmptyState } from '../../components/chat/ChatEmptyState';
import { ChatErrorBanner } from '../../components/chat/ChatErrorBanner';
import { sendChatMessage, ClientStreamChunk } from '../../lib/providers';
import { analyzeScientificResponse } from '../../lib/scientificSourceEngine';
import { runRagPipeline } from '../../lib/rag/ragEngine';
import { loadRagSettings, saveRagSettings, RagConfiguration } from '../../lib/rag/ragSettingsStorage';
import { RagSettingsDrawer } from '../../components/chat/RagSettingsDrawer';
import { Loader2 } from 'lucide-react';
import { 
  AttachedPdfDocument, 
  PdfAnalysisAction, 
  detectPdfActionFromQuery, 
  getPromptForAction, 
  extractStructuredPdfAnalysisResult 
} from '../../lib/pdfAnalysis';
import { ChatPdfUploadModal } from '../../components/chat/ChatPdfUploadModal';
import { AttachedPdfBanner } from '../../components/chat/AttachedPdfBanner';
import { ChatPdfReaderModal } from '../../components/chat/ChatPdfReaderModal';

export const ChatPage: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [streamingMetadata, setStreamingMetadata] = useState<{ model?: string; references?: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [ragConfig, setRagConfig] = useState<RagConfiguration>(loadRagSettings);
  const [isRagDrawerOpen, setIsRagDrawerOpen] = useState(false);

  // PDF Analysis in Chat States (Part 24 of 30)
  const [attachedPdfs, setAttachedPdfs] = useState<AttachedPdfDocument[]>([]);
  const [isPdfUploadModalOpen, setIsPdfUploadModalOpen] = useState(false);
  const [readerModalDoc, setReaderModalDoc] = useState<{ docId: string; pageNumber?: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Smooth autoscroll to latest message
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  }, []);

  // Load all conversations from IndexedDB
  const loadConversations = useCallback(async () => {
    try {
      const list = await getAllConversations();
      setConversations(list);

      if (list.length > 0) {
        if (!activeConvId || !list.some((c) => c.id === activeConvId)) {
          setActiveConvId(list[0].id);
        }
      } else {
        // Create initial default welcome conversation
        const initial = await createConversation({
          title: 'تحلیل فرمولاسیون و استانداردهای مواد غذایی',
          category: 'formulation'
        });
        await addMessage(initial.id, {
          role: 'assistant',
          content: `### سلام! به سامانه تخصصی Food Science AI خوش آمدید 🔬

این پلتفرم مجهز به موتور هوش مصنوعی Gemini و مدل‌های مهندسی صنایع غذایی، فرمولاسیون R&D و کنترل کیفیت است.

#### امکانات کلیدی:
* **پاسخ‌دهی جریانی (Streaming Response):** دریافت بلادرنگ و سریع پاسخ‌های طولانی
* **فرمولاسیون و پایدارسازی:** محاسبه مقادیر هیدروکلوئیدها، امولسیفایرها و بالانس فاز چربی/آب
* **محاسبات مهندسی حرارتی:** محاسبه زمان مرگ حرارتی ($D$-value)، ضریب $z$ و ارزش استریلیزاسیون $F_0$
* **شیمی و رئولوژی:** محاسبه فعالیت آبی ($a_w$)، اسیدیته قابل تیتر (TA) و بریکس
* **استانداردها:** ارجاع مستند به استانداردهای ملی ایران (INSO)، کدکس و روش‌های AOAC
* **پایگاه داده آفلاین:** ذخیره‌سازی دائمی تمام گفتگوها در IndexedDB مرورگر

> برای شروع، می‌توانید یکی از پیشنهادهای زیر را انتخاب کرده یا سوال تخصصی خود را مطرح نمایید.`,
          metadata: {
            model: 'Google Gemini 3.7 Flash',
            offlineGenerated: false,
            referenceDocs: ['INSO-Catalog', 'AOAC-19th', 'Codex Alimentarius'],
            confidenceLevel: 'verified',
            citedSources: [
              {
                id: 'src-inso-2406',
                title: 'استاندارد ملی ۲۴۰۶ شیر پاستوریزه',
                standardNumber: 'INSO 2406',
                sourceType: 'inso_standard',
                year: '1394',
                authorOrOrganization: 'سازمان ملی استاندارد ایران',
                hasPdf: true,
                confidenceLevel: 'verified'
              },
              {
                id: 'src-iso-22000',
                title: 'سیستم‌های مدیریت ایمنی غذا ISO 22000:2018',
                standardNumber: 'ISO 22000:2018',
                sourceType: 'iso_standard',
                year: '2018',
                authorOrOrganization: 'ISO',
                hasPdf: true,
                confidenceLevel: 'verified'
              },
              {
                id: 'src-codex-192',
                title: 'استاندارد عمومی کدکس برای افزودنی‌های غذایی',
                standardNumber: 'CODEX STAN 192-1995',
                sourceType: 'codex_standard',
                year: '1995',
                authorOrOrganization: 'Codex Alimentarius',
                hasPdf: true,
                confidenceLevel: 'verified'
              }
            ]
          }
        });
        setConversations([initial]);
        setActiveConvId(initial.id);
      }
    } catch (err) {
      console.error('Failed to load conversations from IndexedDB:', err);
    }
  }, [activeConvId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConvId) {
      setError(null);
      setStreamingText(null);
      getMessagesByConversation(activeConvId).then((msgs) => {
        setMessages(msgs);
        setTimeout(() => scrollToBottom('auto'), 80);
      });
    } else {
      setMessages([]);
    }
  }, [activeConvId, scrollToBottom]);

  // Handle new conversation
  const handleNewChat = async () => {
    try {
      const newConv = await createConversation({
        title: `گفتگوی جدید ${conversations.length + 1}`,
        category: 'general'
      });
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newConv.id);
      setMessages([]);
      setError(null);
      setStreamingText(null);
    } catch (err) {
      console.error('Failed to create new conversation:', err);
    }
  };

  // Handle delete conversation
  const handleDeleteConversation = async (id: string) => {
    if (!window.confirm('آیا از حذف این گفتگو و تمامی پیام‌های آن اطمینان دارید؟')) return;
    try {
      await deleteConversation(id);
      const updated = conversations.filter((c) => c.id !== id);
      setConversations(updated);
      if (activeConvId === id) {
        setActiveConvId(updated.length > 0 ? updated[0].id : null);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  // Handle rename conversation
  const handleRenameConversation = async (id: string, newTitle: string) => {
    try {
      const updated = await renameConversation(id, newTitle);
      if (updated) {
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, title: updated.title, updatedAt: updated.updatedAt } : c))
        );
      }
    } catch (err) {
      console.error('Failed to rename conversation:', err);
    }
  };

  // Handle toggle pin
  const handleTogglePin = async (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (!conv) return;
    const updated: Conversation = { ...conv, pinned: !conv.pinned };
    await saveConversation(updated);
    await loadConversations();
  };

  // Handle clear messages in current conversation
  const handleClearMessages = async () => {
    if (!activeConvId) return;
    if (!window.confirm('آیا از پاکسازی تمام پیام‌های این گفتگو مطمئن هستید؟')) return;
    try {
      await clearConversationMessages(activeConvId);
      setMessages([]);
      setStreamingText(null);
      await loadConversations();
    } catch (err) {
      console.error('Failed to clear messages:', err);
    }
  };

  // Handle Abort / Stop Generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // Handle Trigger Structured PDF Analysis Action (Part 24 of 30)
  const handleTriggerPdfAction = (action: PdfAnalysisAction) => {
    if (attachedPdfs.length === 0 || loading) return;
    const promptText = getPromptForAction(action, attachedPdfs);
    executeSendMessage(promptText, action);
  };

  // Handle Send Message with Streaming
  const executeSendMessage = async (textToSend: string, explicitPdfAction?: PdfAnalysisAction) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    if (!isOnline || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      setLastFailedMessage(trimmed);
      setError(
        'حالت آفلاین فعال است: دستیار هوش مصنوعی Gemini برای پاسخ به پرسش جدید نیازمند اینترنت است. گفتگوهای قبلی شما در همین صفحه قابل مطالعه هستند و ابزارهای محاسبات مهندسی، آزمایشگاه، استانداردها و Python/SciPy کاملاً آفلاین کار می‌کنند.'
      );
      return;
    }

    let targetConvId = activeConvId;

    // Create conversation on the fly if none active
    if (!targetConvId) {
      const newConv = await createConversation({
        title: trimmed.length > 30 ? trimmed.slice(0, 30) + '...' : trimmed,
        category: 'general'
      });
      setConversations((prev) => [newConv, ...prev]);
      targetConvId = newConv.id;
      setActiveConvId(targetConvId);
    }

    // Client-side length validation
    if (trimmed.length > 4000) {
      setError('متن پیام طولانی‌تر از حد مجاز (۴۰۰۰ کاراکتر) است.');
      return;
    }

    setError(null);
    setInputText('');
    setLoading(true);
    setStreamingText('');
    setStreamingMetadata(null);
    setLastFailedMessage(trimmed);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Determine PDF analysis action if PDFs attached
    const determinedPdfAction: PdfAnalysisAction | undefined = explicitPdfAction || (
      attachedPdfs.length > 0 ? detectPdfActionFromQuery(trimmed, attachedPdfs.length) : undefined
    );

    try {
      // 1. Persist user message to IndexedDB immediately (with attached PDF metadata if present)
      const userMsg = await addMessage(targetConvId, {
        role: 'user',
        content: trimmed,
        metadata: attachedPdfs.length > 0 ? {
          attachedPdfs: attachedPdfs.map((p) => ({
            id: p.id,
            title: p.title,
            fileName: p.fileName,
            pageCount: p.pageCount,
            fileSizeFormatted: p.fileSizeFormatted,
            isScanned: p.isScanned
          }))
        } : undefined
      });
      setMessages((prev) => [...prev, userMsg]);
      setTimeout(() => scrollToBottom('smooth'), 50);

      // 2. Update conversation title if it was default
      const currentConv = conversations.find((c) => c.id === targetConvId);
      if (
        currentConv &&
        (currentConv.messageCount <= 1 || currentConv.title.startsWith('گفتگوی جدید'))
      ) {
        const autoTitle = trimmed.length > 35 ? trimmed.slice(0, 35) + '...' : trimmed;
        await renameConversation(targetConvId, autoTitle);
        currentConv.title = autoTitle;
      }

      // 3. Prepare Conversation History payload
      const historyPayload = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      }));

      // 4. Food Science Specialized RAG Pipeline Execution
      let ragResult: Awaited<ReturnType<typeof runRagPipeline>> | null = null;
      if (ragConfig.enabled) {
        try {
          ragResult = await runRagPipeline(trimmed, ragConfig);
        } catch (ragErr) {
          console.warn('Food Science RAG pipeline execution error:', ragErr);
        }
      }

      // 5. Request streaming chat response from AI Provider
      let finalAccumulatedText = '';
      let finalModel = 'Google Gemini';
      let finalReferences: string[] | undefined;

      const chatResponse = await sendChatMessage(
        {
          conversationId: targetConvId,
          message: trimmed,
          history: historyPayload,
          context: {
            ...(attachedPdfs.length > 0 ? {
              attachedPdfs: attachedPdfs.map((p) => ({
                id: p.id,
                title: p.title,
                fileName: p.fileName,
                pageCount: p.pageCount,
                isScanned: p.isScanned,
                pages: p.pages.map((pg) => ({
                  pageNumber: pg.pageNumber,
                  sectionHeading: pg.sectionHeading,
                  text: pg.text,
                  isOcr: pg.isOcr
                }))
              })),
              pdfExtractionAction: determinedPdfAction
            } : {}),
            ...(ragResult ? {
              ragGrounding: {
                intentLabelFa: ragResult.intent.labelFa,
                intentType: ragResult.intent.type,
                evidenceLevel: ragResult.evidenceValidation.level,
                evidenceScore: ragResult.evidenceValidation.score,
                warningNoticeFa: ragResult.evidenceValidation.warningNoticeFa,
                groundingPromptAugmentation: ragResult.groundingPromptAugmentation,
                augmentedSystemInstruction: ragResult.augmentedSystemInstruction,
                citedSources: ragResult.citedSources.map((s) => ({
                  id: s.id,
                  title: s.title,
                  standardNumber: s.standardNumber,
                  sourceType: s.sourceType,
                  year: s.year,
                  authorOrOrganization: s.authorOrOrganization,
                  hasPdf: s.hasPdf,
                  confidenceLevel: s.confidenceLevel,
                  pageNumber: s.pageNumber,
                  pdfDocumentId: s.pdfDocumentId,
                  snippet: s.snippet,
                  isOcr: s.isOcr
                }))
              }
            } : {})
          }
        },
        {
          useStreaming: true,
          signal: controller.signal,
          onChunk: (chunk: ClientStreamChunk) => {
            if (chunk.fullText !== undefined) {
              finalAccumulatedText = chunk.fullText;
              setStreamingText(chunk.fullText);
            }
            if (chunk.model) {
              finalModel = chunk.model;
            }
            if (chunk.references) {
              finalReferences = chunk.references;
            }
            setStreamingMetadata({
              model: finalModel,
              references: finalReferences
            });
            scrollToBottom('smooth');
          }
        }
      );

      const replyContent = chatResponse.reply || finalAccumulatedText || 'پاسخی از مدل دریافت نشد.';

      // Scientific Source & Verification Analysis
      const sciAnalysis = analyzeScientificResponse(replyContent, trimmed);

      // Extract Structured PDF Analysis Results if PDF attached (Part 24 of 30)
      let pdfAnalysisResult = undefined;
      if (attachedPdfs.length > 0) {
        pdfAnalysisResult = extractStructuredPdfAnalysisResult(
          replyContent,
          attachedPdfs,
          determinedPdfAction || 'qa'
        );
      }

      // Merge cited sources: Prioritize high-quality RAG grounded sources, supplemented by extracted sources
      type CitedSourceEntry = NonNullable<NonNullable<ChatMessage['metadata']>['citedSources']>[number];

      const ragSourcesMapped: CitedSourceEntry[] = (ragResult?.citedSources || []).map((s) => ({
        id: s.id,
        title: s.title,
        standardNumber: s.standardNumber,
        sourceType: s.sourceType,
        year: s.year,
        authorOrOrganization: s.authorOrOrganization,
        hasPdf: s.hasPdf,
        confidenceLevel: s.confidenceLevel,
        pageNumber: s.pageNumber,
        pdfDocumentId: s.pdfDocumentId,
        snippet: s.snippet,
        isOcr: s.isOcr
      }));

      // Combine sources without duplicates by standardNumber or id
      const combinedSources: CitedSourceEntry[] = [...ragSourcesMapped];
      for (const sciSrc of sciAnalysis.citedSources) {
        const alreadyExists = combinedSources.some(
          (cs) => cs.id === sciSrc.id || (cs.standardNumber && cs.standardNumber === sciSrc.standardNumber)
        );
        if (!alreadyExists) {
          combinedSources.push(sciSrc as CitedSourceEntry);
        }
      }

      // Determine confidence level: If RAG provides an evidence level, use it to accurately reflect grounding
      let evaluatedConfidence = sciAnalysis.confidenceLevel;
      if (ragResult) {
        if (ragResult.evidenceValidation.level === 'sufficient') {
          evaluatedConfidence = 'verified';
        } else if (ragResult.evidenceValidation.level === 'partial') {
          evaluatedConfidence = 'partially_supported';
        } else if (ragResult.evidenceValidation.level === 'insufficient') {
          evaluatedConfidence = 'unverified';
        }
      }

      // 6. Persist AI assistant response to IndexedDB
      const assistantMsg = await addMessage(targetConvId, {
        role: 'assistant',
        content: replyContent,
        metadata: {
          model: chatResponse.model || finalModel,
          offlineGenerated: !isOnline,
          referenceDocs: chatResponse.references || finalReferences || [],
          confidenceLevel: evaluatedConfidence,
          citedSources: combinedSources,
          discrepancyAlerts: sciAnalysis.discrepancyAlerts,
          attachedPdfs: attachedPdfs.length > 0 ? attachedPdfs.map((p) => ({
            id: p.id,
            title: p.title,
            fileName: p.fileName,
            pageCount: p.pageCount,
            fileSizeFormatted: p.fileSizeFormatted,
            isScanned: p.isScanned
          })) : undefined,
          pdfAnalysisResult,
          ragPipeline: ragResult ? {
            intentLabelFa: ragResult.intent.labelFa,
            intentType: ragResult.intent.type,
            searchMode: ragConfig.searchMode,
            evidenceScore: ragResult.evidenceValidation.score,
            evidenceLevel: ragResult.evidenceValidation.level,
            groundingStrategy: ragResult.evidenceValidation.strategy,
            missingFactors: ragResult.evidenceValidation.missingFactors,
            warningNoticeFa: ragResult.evidenceValidation.warningNoticeFa,
            retrievedChunksCount: ragResult.rankedChunks.length,
            rankedSourcesCount: ragResult.citedSources.length,
            executionTimeMs: ragResult.trace.executionTimeMs,
            stepTrace: ragResult.trace
          } : undefined
        }
      });

      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingText(null);
      setStreamingMetadata(null);
      setLastFailedMessage(null);
      await loadConversations();
    } catch (err: unknown) {
      console.warn('Network / API error in chat:', err);
      const errorMsg = err instanceof Error ? err.message : 'خطای ارتباط با سرویس هوش مصنوعی';
      setError(errorMsg);

      // If text was partially streamed before error/abort, preserve it
      if (streamingText && streamingText.trim().length > 0 && targetConvId) {
        try {
          const partialMsg = await addMessage(targetConvId, {
            role: 'assistant',
            content: streamingText + '\n\n*(تولید پاسخ متوقف شد)*',
            metadata: {
              model: streamingMetadata?.model || 'Google Gemini',
              offlineGenerated: !isOnline,
              referenceDocs: streamingMetadata?.references || []
            }
          });
          setMessages((prev) => [...prev, partialMsg]);
        } catch {
          // ignore
        }
      }
      setStreamingText(null);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
      setTimeout(() => scrollToBottom('smooth'), 100);
    }
  };

  const handleSend = () => {
    executeSendMessage(inputText);
  };

  const handleSelectPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      executeSendMessage(lastFailedMessage);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId) || null;

  return (
    <div className="space-y-4">
      <PageHeader
        title="دستیار هوشمند و مکالمات تخصصی"
        englishTitle="/chat (Gemini Streaming AI)"
        description="سامانه تحلیل فرمولاسیون، محاسبات مهندسی فرآیند، استانداردهای INSO و پاسخ‌دهی جریانی (Streaming) با Google Gemini"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'دستیار چت هوشمند' }
        ]}
      />

      {/* Chat Master Container */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden flex relative h-[calc(100vh-210px)] min-h-[580px]">
        {/* Responsive Sidebar */}
        <ChatSidebar
          conversations={conversations}
          activeId={activeConvId}
          onSelect={(id) => setActiveConvId(id)}
          onNew={handleNewChat}
          onDelete={handleDeleteConversation}
          onRename={handleRenameConversation}
          onTogglePin={handleTogglePin}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Chat Flow */}
        <div className="flex-1 flex flex-col min-w-0 bg-stone-50/30 dark:bg-stone-950/30">
          {/* Header */}
          <ChatHeader
            conversation={activeConv}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
            onRename={(newTitle) => {
              if (activeConvId) handleRenameConversation(activeConvId, newTitle);
            }}
            onClearMessages={handleClearMessages}
            onNewChat={handleNewChat}
            onOpenRagSettings={() => setIsRagDrawerOpen(true)}
            ragEnabled={ragConfig.enabled}
          />

          {/* Error Banner */}
          <ChatErrorBanner
            error={error}
            onRetry={lastFailedMessage ? handleRetry : undefined}
            onDismiss={() => setError(null)}
          />

          {/* Messages Stream */}
          <div className="flex-1 p-3 sm:p-5 overflow-y-auto custom-scrollbar flex flex-col">
            {messages.length === 0 && !streamingText ? (
              <ChatEmptyState onSelectPrompt={handleSelectPrompt} />
            ) : (
              <div className="space-y-1 w-full max-w-4xl mx-auto">
                {messages.map((msg) => (
                  <ChatMessageItem
                    key={msg.id}
                    message={msg}
                    onSelectPrompt={handleSelectPrompt}
                    onOpenPdfReader={(docId, pageNumber) => setReaderModalDoc({ docId, pageNumber })}
                  />
                ))}

                {/* Live Streaming Message Item */}
                {streamingText !== null && (
                  <ChatMessageItem
                    message={{
                      id: 'streaming-active',
                      conversationId: activeConvId || 'stream',
                      role: 'assistant',
                      content: streamingText || '...',
                      timestamp: new Date().toISOString(),
                      metadata: {
                        model: streamingMetadata?.model || 'Google Gemini 3.7 Flash',
                        referenceDocs: streamingMetadata?.references
                      }
                    }}
                    onOpenPdfReader={(docId, pageNumber) => setReaderModalDoc({ docId, pageNumber })}
                  />
                )}

                {/* Initial Loading Spinner before first token */}
                {loading && streamingText === '' && (
                  <div className="flex items-center gap-3 my-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl rounded-tl-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 text-xs shadow-2xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>
                        {attachedPdfs.length > 0
                          ? `تحلیل علمی و استخراج داده‌های مستند از ${attachedPdfs.length} سند PDF پیوست...`
                          : 'اتصال به Google Gemini و تحلیل داده‌های صنایع غذایی...'}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-2" />
              </div>
            )}
          </div>

          {/* Attached PDF Banner & Action Chips (Part 24 of 30) */}
          <div className="w-full max-w-4xl mx-auto shrink-0 px-3 sm:px-0">
            <AttachedPdfBanner
              attachedPdfs={attachedPdfs}
              onRemovePdf={(id) => setAttachedPdfs((prev) => prev.filter((p) => p.id !== id))}
              onOpenPdfReader={(pdf) => setReaderModalDoc({ docId: pdf.id, pageNumber: 1 })}
              onOpenUploadModal={() => setIsPdfUploadModalOpen(true)}
              onTriggerAction={handleTriggerPdfAction}
              disabled={loading}
            />
          </div>

          {/* Multiline Chat Input with Stop button & PDF attachment trigger */}
          <div className="w-full max-w-4xl mx-auto shrink-0">
            <ChatInput
              input={inputText}
              setInput={setInputText}
              onSend={handleSend}
              onStop={loading ? handleStopGeneration : undefined}
              loading={loading}
              maxLength={4000}
              onSelectPrompt={handleSelectPrompt}
              onOpenPdfUploadModal={() => setIsPdfUploadModalOpen(true)}
              attachedPdfCount={attachedPdfs.length}
            />
          </div>
        </div>
      </div>

      {/* Food Science RAG Settings Drawer */}
      <RagSettingsDrawer
        isOpen={isRagDrawerOpen}
        onClose={() => setIsRagDrawerOpen(false)}
        config={ragConfig}
        onConfigChange={(newCfg) => {
          setRagConfig(newCfg);
          saveRagSettings(newCfg);
        }}
      />

      {/* Chat PDF Upload / Library Selection Modal (Part 24 of 30) */}
      <ChatPdfUploadModal
        isOpen={isPdfUploadModalOpen}
        onClose={() => setIsPdfUploadModalOpen(false)}
        attachedPdfs={attachedPdfs}
        onAttachPdfs={setAttachedPdfs}
      />

      {/* Chat In-line PDF Reader Modal for Evidence Verification (Part 24 of 30) */}
      <ChatPdfReaderModal
        isOpen={!!readerModalDoc}
        onClose={() => setReaderModalDoc(null)}
        docId={readerModalDoc?.docId || null}
        initialPageNumber={readerModalDoc?.pageNumber || 1}
      />
    </div>
  );
};

export default ChatPage;
