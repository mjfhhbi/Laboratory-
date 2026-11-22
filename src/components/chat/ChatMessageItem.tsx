import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../../types';
import { CodeBlock } from './CodeBlock';
import { FormulaBlock } from './FormulaBlock';
import { RagPipelineInspectorModal } from './RagPipelineInspectorModal';
import { PdfEvidenceClaimsCard } from './PdfEvidenceClaimsCard';
import {
  Bot,
  User,
  Clock,
  Copy,
  Check,
  Sparkles,
  HardDrive,
  BookOpen,
  ArrowUpRight,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Shield,
  FileText,
  AlertTriangle,
  Scale,
  ExternalLink,
  Paperclip
} from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSelectPrompt?: (prompt: string) => void;
  onOpenPdfReader?: (docId: string, pageNumber?: number) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onSelectPrompt,
  onOpenPdfReader
}) => {
  const [copied, setCopied] = useState(false);
  const [showConfidenceDetails, setShowConfidenceDetails] = useState(false);
  const [showRagInspector, setShowRagInspector] = useState(false);
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Format time in Persian locale
  const formattedTime = new Date(message.timestamp).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-500 text-[11px] rounded-full border border-stone-200 dark:border-stone-700 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  const confidence = message.metadata?.confidenceLevel;
  const citedSources = message.metadata?.citedSources;
  const discrepancyAlerts = message.metadata?.discrepancyAlerts;
  const ragPipeline = message.metadata?.ragPipeline;

  const renderConfidenceBadge = () => {
    if (!confidence && !ragPipeline) return null;

    let badgeClass = 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
    let label = 'نامشخص';
    let Icon = Shield;

    if (ragPipeline) {
      if (ragPipeline.evidenceLevel === 'sufficient' || ragPipeline.tier === 'VERIFIED') {
        badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
        label = `[VERIFIED] منبع معتبر (${ragPipeline.evidenceScore}٪)`;
        Icon = ShieldCheck;
      } else if (ragPipeline.evidenceLevel === 'partial' || ragPipeline.tier === 'SUPPORTED') {
        badgeClass = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
        label = `[SUPPORTED] شواهد جزئی (${ragPipeline.evidenceScore}٪)`;
        Icon = ShieldAlert;
      } else {
        badgeClass = 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
        label = '[UNVERIFIED] کمبود منبع قطعی';
        Icon = AlertCircle;
      }
    } else {
      if (confidence === 'verified') {
        badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
        label = '[VERIFIED] تأییدشده رسمی';
        Icon = ShieldCheck;
      } else if (confidence === 'source_backed') {
        badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
        label = '[VERIFIED] دارای منبع مستند';
        Icon = ShieldCheck;
      } else if (confidence === 'partially_supported') {
        badgeClass = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
        label = '[SUPPORTED] پشتیبانی با منابع موجود';
        Icon = ShieldAlert;
      } else if (confidence === 'unverified') {
        badgeClass = 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
        label = '[UNVERIFIED] منبع ناکافی';
        Icon = AlertCircle;
      }
    }

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (ragPipeline) {
              setShowRagInspector(true);
            } else {
              setShowConfidenceDetails(!showConfidenceDetails);
            }
          }}
          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border transition-all hover:scale-105 cursor-pointer ${badgeClass}`}
          title={ragPipeline ? 'کلیک جهت ردیابی کامل ۷ مرحله‌ای موتور RAG' : 'مشاهده وضعیت اعتبار علمی و استناد'}
        >
          <Icon className="w-3 h-3 shrink-0" />
          <span>{label}</span>
          {ragPipeline && <Sparkles className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />}
        </button>

        {!ragPipeline && showConfidenceDetails && (
          <div className="absolute top-full right-0 mt-1 z-30 w-64 p-2.5 bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 text-[11px] text-stone-700 dark:text-stone-300">
            <p className="font-semibold mb-1 text-emerald-800 dark:text-emerald-300">
              سطح اعتبار علمی: {label}
            </p>
            <p className="text-[10px] leading-relaxed text-stone-500 dark:text-stone-400">
              {(confidence === 'verified' || confidence === 'source_backed') && 'اطلاعات مستقیماً توسط Source معتبر (استاندارد ملی INSO، روش AOAC، کدکس یا مرجع رسمی) پشتیبانی می‌شود.'}
              {confidence === 'partially_supported' && 'اطلاعات از منابع موجود پشتیبانی می‌شود اما نیاز به بررسی بیشتر و تطبیق شرایط دارد.'}
              {confidence === 'unverified' && 'منبع کافی وجود ندارد و نباید به‌عنوان حقیقت قطعی نمایش داده شود.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex items-start gap-3 w-full my-3 transition-all ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs font-semibold text-xs select-none ${
          isUser
            ? 'bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 border border-stone-700 dark:border-stone-200'
            : 'bg-emerald-700 text-white dark:bg-emerald-600 border border-emerald-600 dark:border-emerald-500'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Card Container */}
      <div
        className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 text-xs transition-shadow ${
          isUser
            ? 'bg-stone-900 text-stone-100 dark:bg-stone-800 dark:text-stone-100 rounded-tr-xs shadow-xs'
            : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 rounded-tl-xs border border-stone-200/90 dark:border-stone-800 shadow-xs'
        }`}
      >
        {/* Assistant Header Info Bar */}
        {!isUser && (
          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 mb-2 border-b border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">Food Science AI</span>
              {message.metadata?.model && (
                <span className="px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-mono text-stone-600 dark:text-stone-300" dir="ltr">
                  {message.metadata.model}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {renderConfidenceBadge()}

              {message.metadata?.offlineGenerated && (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 px-1.5 py-0.2 bg-amber-50 dark:bg-amber-950/60 rounded border border-amber-200 dark:border-amber-800/60">
                  <HardDrive className="w-2.5 h-2.5" />
                  <span>آفلاین</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Attached PDF Pills for user message */}
        {message.metadata?.attachedPdfs && message.metadata.attachedPdfs.length > 0 && (
          <div className="mb-2 flex flex-wrap items-center gap-1.5 pb-2 border-b border-white/20 dark:border-stone-800">
            <span className="text-[10px] opacity-80 flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              <span>اسناد پیوست:</span>
            </span>
            {message.metadata.attachedPdfs.map((pdf) => (
              <button
                key={pdf.id}
                type="button"
                onClick={() => onOpenPdfReader?.(pdf.id, 1)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer ${
                  isUser
                    ? 'bg-emerald-800/80 border-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-400'
                }`}
              >
                <FileText className="w-2.5 h-2.5" />
                <span className="truncate max-w-[150px]">{pdf.title}</span>
                <span className="opacity-75 font-mono">({pdf.pageCount} ص)</span>
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        {isUser ? (
          <div className="whitespace-pre-wrap leading-relaxed text-[13px] font-normal break-words">
            {message.content}
          </div>
        ) : (
          <div className="chat-markdown break-words">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children || '').replace(/\n$/, '');

                  // Check if it's a multiline block or explicitly language tagged
                  if (match || codeString.includes('\n')) {
                    return (
                      <CodeBlock
                        language={match ? match[1] : 'text'}
                        code={codeString}
                      />
                    );
                  }

                  // Inline code
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] border border-stone-200 dark:border-stone-700/60" dir="ltr">
                      {children}
                    </code>
                  );
                },
                // Handle Math/Formula blocks
                p(props) {
                  const text = String(props.children);
                  if (text.startsWith('$$') && text.endsWith('$$')) {
                    return <FormulaBlock formula={text} isBlock={true} />;
                  }
                  return <p {...props} />;
                },
                // Handle Tables with responsive overflow container
                table(props) {
                  return (
                    <div className="overflow-x-auto max-w-full my-2.5 rounded-xl border border-stone-200 dark:border-stone-800 scrollbar-thin">
                      <table className="w-full text-xs text-right border-collapse min-w-[320px]" {...props} />
                    </div>
                  );
                }
              }}
            >
              {message.content}
            </Markdown>
          </div>
        )}

        {/* PDF Structured Analysis & Evidence Claims Card */}
        {!isUser && message.metadata?.pdfAnalysisResult && (
          <PdfEvidenceClaimsCard
            analysisResult={message.metadata.pdfAnalysisResult}
            onOpenPdfReader={onOpenPdfReader}
          />
        )}

        {/* Scientific Discrepancies Alert Banner (اختلاف میان مراجع استاندارد) */}
        {!isUser && discrepancyAlerts && discrepancyAlerts.length > 0 && (
          <div className="mt-3 p-3 bg-amber-50/90 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-1.5 font-bold text-xs mb-1.5 text-amber-800 dark:text-amber-300">
              <Scale className="w-4 h-4 text-amber-600 shrink-0" />
              <span>توجه: وجود اختلاف میان استانداردهای مرجع (Scientific Discrepancy)</span>
            </div>
            {discrepancyAlerts.map((disc, idx) => (
              <div key={idx} className="text-[11px] space-y-1 mt-1 border-t border-amber-200/60 dark:border-amber-800/40 pt-1.5 first:border-0 first:pt-0">
                <div className="font-semibold text-amber-950 dark:text-amber-100">{disc.topicFa}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1 text-[10px]">
                  <div className="p-1.5 bg-white/70 dark:bg-stone-900/60 rounded border border-amber-200 dark:border-amber-900">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">مرجع اول: </span>
                    <span>{disc.primaryStandard}</span>
                  </div>
                  <div className="p-1.5 bg-white/70 dark:bg-stone-900/60 rounded border border-amber-200 dark:border-amber-900">
                    <span className="font-bold text-blue-700 dark:text-blue-400">مرجع متعارض: </span>
                    <span>{disc.conflictingStandard}</span>
                  </div>
                </div>
                <p className="text-[10px] text-stone-700 dark:text-stone-300 leading-relaxed">
                  {disc.summaryFa}
                </p>
                {disc.recommendationFa && (
                  <p className="text-[10px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-1 rounded">
                    <strong>توصیه کاربردی: </strong>{disc.recommendationFa}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* RAG Warning Notice (اعلام کمبود منبع یا شواهد جزئی) */}
        {!isUser && ragPipeline?.warningNoticeFa && (
          <div className={`mt-3 p-3 rounded-xl border text-xs leading-relaxed ${
            ragPipeline.evidenceLevel === 'insufficient'
              ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
          }`}>
            <div className="flex items-center justify-between gap-2 font-bold mb-1">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className={`w-4 h-4 ${ragPipeline.evidenceLevel === 'insufficient' ? 'text-rose-600' : 'text-amber-600'}`} />
                <span>
                  {ragPipeline.evidenceLevel === 'insufficient'
                    ? 'اعلام کمبود منبع رسمی و قطعی (Insufficient Evidence)'
                    : 'شواهد علمی جزئی در پایگاه دانش (Partial Evidence)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowRagInspector(true)}
                className="text-[10px] font-medium underline hover:opacity-80 flex items-center gap-1"
              >
                <span>مشاهده علت</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
            <p className="text-[11px] opacity-90">{ragPipeline.warningNoticeFa}</p>
          </div>
        )}

        {/* Scientific Sources & Verification Linkage */}
        {!isUser && citedSources && citedSources.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>استنادات و مراجع علمی متصل ({citedSources.length} منبع):</span>
              </div>
              {ragPipeline && (
                <button
                  type="button"
                  onClick={() => setShowRagInspector(true)}
                  className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>ردیابی جریان RAG</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {citedSources.map((src, idx) => (
                <a
                  key={idx}
                  href={`/sources?id=${src.id}${src.pdfDocumentId ? `&docId=${src.pdfDocumentId}` : ''}${src.pageNumber ? `&page=${src.pageNumber}` : ''}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 dark:bg-stone-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-700 dark:text-stone-200 rounded-lg text-[10px] border border-stone-200 dark:border-stone-700 hover:border-emerald-300 transition-colors"
                  title={`مشاهده در منابع: ${src.title}`}
                >
                  <FileText className="w-3 h-3 text-emerald-600" />
                  <span className="font-mono font-bold" dir="ltr">{src.standardNumber || src.sourceType}</span>
                  <span className="truncate max-w-[130px]">{src.title}</span>
                  {src.pageNumber && (
                    <span className="text-[9px] bg-stone-200 dark:bg-stone-700 px-1 py-0.2 rounded font-mono">
                      ص {src.pageNumber}
                    </span>
                  )}
                  {src.isOcr && (
                    <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1 py-0.2 rounded">
                      OCR
                    </span>
                  )}
                  {src.hasPdf && (
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-1 py-0.2 rounded font-mono">
                      PDF
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Legacy referenceDocs if no citedSources */}
        {!isUser && (!citedSources || citedSources.length === 0) && message.metadata?.referenceDocs && message.metadata.referenceDocs.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-stone-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-emerald-600" />
              <span>مراجع استاندارد:</span>
            </span>
            {message.metadata.referenceDocs.map((ref, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded font-mono text-[10px] border border-stone-200/80 dark:border-stone-700/60"
                dir="ltr"
              >
                {ref}
              </span>
            ))}
          </div>
        )}

        {/* Unverified Disclaimer if confidence is unverified and no rag warning was shown */}
        {!isUser && confidence === 'unverified' && !ragPipeline?.warningNoticeFa && (
          <div className="mt-2.5 p-2 bg-rose-50/70 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-[10px] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
            <span>توجه: این پاسخ فاقد استناد قطعی به استاندارد ملی است. از مقادیر و روش‌ها بدون تطابق با استاندارد رسمی استفاده نکنید.</span>
          </div>
        )}

        {/* Message Footer Toolbar */}
        <div
          className={`flex items-center justify-between mt-2 pt-1.5 text-[10px] text-stone-400 border-t ${
            isUser
              ? 'border-stone-800/80 dark:border-stone-700/60 text-stone-400'
              : 'border-stone-100 dark:border-stone-800'
          }`}
        >
          <div className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" />
            <span>{formattedTime}</span>
          </div>

          <button
            onClick={handleCopyText}
            className={`p-1 rounded flex items-center gap-1 transition-colors ${
              isUser
                ? 'hover:bg-stone-800 hover:text-white'
                : 'hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
            title="کپی کردن متن پیام"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">کپی شد</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>کپی متن</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RAG Pipeline Inspector Modal */}
      {ragPipeline && (
        <RagPipelineInspectorModal
          isOpen={showRagInspector}
          onClose={() => setShowRagInspector(false)}
          ragMetadata={ragPipeline}
          citedSources={citedSources}
        />
      )}
    </div>
  );
};
