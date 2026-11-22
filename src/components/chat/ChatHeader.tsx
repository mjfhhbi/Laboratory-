import React, { useState, useEffect } from 'react';
import { Conversation } from '../../types';
import { OnlineStatusBadge } from '../common/OnlineStatusBadge';
import { checkServerAIStatus, ServerStatusResponse } from '../../lib/providers';
import {
  Menu,
  Edit2,
  Trash2,
  Check,
  X,
  Copy,
  Plus,
  RotateCcw,
  Sparkles,
  Layers,
  Database,
  Cpu,
  Sliders
} from 'lucide-react';

interface ChatHeaderProps {
  conversation: Conversation | null;
  onToggleMobileSidebar: () => void;
  onRename: (newTitle: string) => void;
  onClearMessages: () => void;
  onNewChat: () => void;
  onOpenRagSettings?: () => void;
  ragEnabled?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onToggleMobileSidebar,
  onRename,
  onClearMessages,
  onNewChat,
  onOpenRagSettings,
  ragEnabled = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [serverInfo, setServerInfo] = useState<ServerStatusResponse | null>(null);

  useEffect(() => {
    checkServerAIStatus().then((info) => {
      if (info) setServerInfo(info);
    });
  }, []);

  const startEditing = () => {
    if (conversation) {
      setTempTitle(conversation.title);
      setIsEditing(true);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempTitle.trim()) {
      onRename(tempTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCopyId = async () => {
    if (!conversation) return;
    try {
      await navigator.clipboard.writeText(conversation.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between gap-3">
      {/* Right side: Mobile Menu toggle & Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Mobile sidebar trigger */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-700 shrink-0"
          aria-label="نمایش لیست گفتگوها"
          title="لیست گفتگوها"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Title / Inline Rename */}
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <form onSubmit={handleSave} className="flex items-center gap-1.5 max-w-md">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                autoFocus
                className="w-full px-2.5 py-1 text-xs sm:text-sm font-bold bg-stone-50 dark:bg-stone-800 border border-emerald-500 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-hidden"
              />
              <button
                type="submit"
                className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shrink-0"
                title="تأیید نام"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 shrink-0"
                title="انصراف"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate">
                {conversation?.title || 'دستیار هوشمند صنایع غذایی'}
              </h2>
              {conversation && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0"
                  title="ویرایش عنوان گفتگو"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Subtitle / ID / Active Model */}
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-400">
            {conversation && (
              <>
                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 hover:text-stone-600 dark:hover:text-stone-300 font-mono"
                  title="کپی شناسه گفتگو"
                >
                  <span>ID: {conversation.id.slice(0, 14)}...</span>
                  {copiedId ? (
                    <Check className="w-2.5 h-2.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-2.5 h-2.5" />
                  )}
                </button>
                <span>•</span>
                <span>{conversation.messageCount} پیام</span>
                <span>•</span>
              </>
            )}

            {serverInfo ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-mono font-medium">
                <Cpu className="w-3 h-3" />
                <span dir="ltr">{serverInfo.modelId}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-stone-400 font-mono">
                <Cpu className="w-3 h-3" />
                <span dir="ltr">Gemini AI</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Left side: Toolbar buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <OnlineStatusBadge />

        {/* RAG Settings Trigger */}
        {onOpenRagSettings && (
          <button
            type="button"
            onClick={onOpenRagSettings}
            className={`p-2 rounded-xl text-xs inline-flex items-center gap-1.5 border transition-all ${
              ragEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/80 shadow-2xs hover:bg-emerald-100'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700 hover:bg-stone-200'
            }`}
            title="تنظیمات و اولویت‌بندی منابع موتور RAG"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline font-medium text-[11px]">
              {ragEnabled ? 'موتور RAG فعال' : 'RAG غیرفعال'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        )}

        {conversation && conversation.messageCount > 0 && (
          <button
            type="button"
            onClick={onClearMessages}
            className="p-2 text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-800 text-xs hidden sm:inline-flex items-center gap-1"
            title="پاکسازی پیام‌های این گفتگو"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px]">پاکسازی</span>
          </button>
        )}

        <button
          type="button"
          onClick={onNewChat}
          className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition-colors border border-emerald-200 dark:border-emerald-800/60 text-xs inline-flex items-center gap-1 font-semibold"
          title="شروع گفتگوی جدید"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">گفتگوی جدید</span>
        </button>
      </div>
    </div>
  );
};
