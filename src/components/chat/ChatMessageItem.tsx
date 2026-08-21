import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../../types';
import { CodeBlock } from './CodeBlock';
import { FormulaBlock } from './FormulaBlock';
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
  AlertCircle
} from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSelectPrompt?: (prompt: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onSelectPrompt
}) => {
  const [copied, setCopied] = useState(false);
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
        className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs transition-shadow ${
          isUser
            ? 'bg-stone-900 text-stone-100 dark:bg-stone-800 dark:text-stone-100 rounded-tr-xs shadow-xs'
            : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 rounded-tl-xs border border-stone-200/90 dark:border-stone-800 shadow-xs'
        }`}
      >
        {/* Assistant Header Info Bar */}
        {!isUser && (
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">Food Science AI</span>
              {message.metadata?.model && (
                <span className="px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-mono text-stone-600 dark:text-stone-300" dir="ltr">
                  {message.metadata.model}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {message.metadata?.offlineGenerated && (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 px-1.5 py-0.2 bg-amber-50 dark:bg-amber-950/60 rounded border border-amber-200 dark:border-amber-800/60">
                  <HardDrive className="w-2.5 h-2.5" />
                  <span>آفلاین</span>
                </span>
              )}
            </div>
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
                }
              }}
            >
              {message.content}
            </Markdown>
          </div>
        )}

        {/* References list if provided */}
        {message.metadata?.referenceDocs && message.metadata.referenceDocs.length > 0 && (
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
    </div>
  );
};
