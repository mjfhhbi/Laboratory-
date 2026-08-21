import React, { useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, AlertCircle, CornerDownLeft, X, Square } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onStop?: () => void;
  loading: boolean;
  maxLength?: number;
  onSelectPrompt?: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  'فرمولاسیون سس مایونز کم‌چرب با قوام‌دهنده هیدروکلوئیدی',
  'محاسبه ارزش پاستوریزاسیون شیر و مقدار D-Value و F0',
  'بررسی حداقل فعالیت آبی (aw) جهت مهار رشد باکتری‌های بیماری‌زا',
  'حدود مجاز اسیدیته تیترپذیر (TA) و بریکس در کنسانتره میوه'
];

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  loading,
  maxLength = 4000,
  onSelectPrompt
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 44), 160)}px`;
    }
  }, [input]);

  const charCount = input.length;
  const isOverLimit = charCount > maxLength;
  const isNearLimit = charCount > maxLength * 0.85;
  const isSubmittable = input.trim().length > 0 && !isOverLimit && !loading;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends the message, Shift+Enter creates a new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isSubmittable) {
        onSend();
      }
    }
  };

  return (
    <div className="border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs p-3 sm:p-4">
      {/* Quick Prompt Suggestion Chips */}
      {onSelectPrompt && input.length === 0 && !loading && (
        <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
          <span className="text-stone-400 shrink-0 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>پیشنهادها:</span>
          </span>
          {STARTER_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="px-2.5 py-1 bg-stone-50 dark:bg-stone-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-stone-600 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-300 rounded-lg border border-stone-200 dark:border-stone-700/60 whitespace-nowrap transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isSubmittable) onSend();
        }}
        className="space-y-2"
      >
        <div
          className={`relative rounded-2xl border transition-all flex items-end p-2 bg-stone-50 dark:bg-stone-950/50 ${
            isOverLimit
              ? 'border-rose-400 dark:border-rose-600 ring-2 ring-rose-200 dark:ring-rose-950'
              : 'border-stone-300 dark:border-stone-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20'
          }`}
        >
          {/* Multiline Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="پرسش در مورد فرمولاسیون، استانداردهای INSO، فرآوری حرارتی یا روش‌های آزمون... (Enter برای ارسال، Shift+Enter برای خط جدید)"
            className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden resize-none leading-relaxed max-h-[160px] custom-scrollbar"
            dir="auto"
          />

          {/* Action buttons inside input box */}
          <div className="flex items-center gap-1.5 shrink-0 pr-1 pb-1">
            {input.length > 0 && !loading && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
                title="پاکسازی متن"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {loading && onStop ? (
              <button
                type="button"
                onClick={onStop}
                className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs shrink-0 cursor-pointer active:scale-98 animate-pulse"
                title="توقف تولید پاسخ"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">توقف</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isSubmittable}
                className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs shrink-0 ${
                  isSubmittable
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer active:scale-98'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                }`}
                title="ارسال پیام (Enter)"
              >
                <Send className="w-4 h-4 rotate-180" />
                <span className="hidden sm:inline">ارسال</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer info: Character counter & Keyboard hints */}
        <div className="flex items-center justify-between text-[11px] px-1 text-stone-400">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px]">
              <CornerDownLeft className="w-3 h-3" />
              <span>Enter ارسال</span>
              <span>•</span>
              <span>Shift+Enter خط جدید</span>
            </span>
          </div>

          <div
            className={`font-mono text-[11px] transition-colors ${
              isOverLimit
                ? 'text-rose-600 dark:text-rose-400 font-bold'
                : isNearLimit
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-stone-400'
            }`}
            dir="ltr"
          >
            {charCount} / {maxLength} کاراکتر
          </div>
        </div>

        {isOverLimit && (
          <div className="p-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-800 dark:text-rose-300 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>متن پیام بیش از حد مجاز ({maxLength} کاراکتر) است. لطفاً متن را کوتاه‌تر فرمایید.</span>
          </div>
        )}
      </form>
    </div>
  );
};
