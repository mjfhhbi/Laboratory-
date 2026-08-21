import React, { useState } from 'react';
import { Conversation } from '../../types';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Pin,
  Search,
  HardDrive,
  Clock,
  Sparkles,
  ChevronLeft
} from 'lucide-react';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onTogglePin: (id: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onTogglePin,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const startRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const saveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingTitle.trim()) {
      onRename(id, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditingTitle('');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-2xs transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-stone-50 dark:bg-stone-950 border-l border-stone-200 dark:border-stone-800 flex flex-col h-full transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header with New Chat Button and Close for Mobile */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                تاریخچه گفتگوها
              </h3>
            </div>

            {/* Mobile close button */}
            <div className="flex items-center gap-1">
              <button
                onClick={onNew}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                title="ایجاد گفتگوی جدید"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>جدید</span>
              </button>

              {onCloseMobile && (
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 lg:hidden text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
                  aria-label="بستن منو"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در گفتگوها..."
              className="w-full pl-3 pr-8 py-1.5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Conversations List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <MessageSquare className="w-8 h-8 text-stone-300 dark:text-stone-700 mx-auto" />
              <p className="text-xs text-stone-400">
                {searchQuery ? 'هیچ گفتگویی با این عنوان یافت نشد.' : 'هنوز گفتگویی ایجاد نشده است.'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeId;
              const isEditing = editingId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelect(conv.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`group relative p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-white dark:bg-stone-900 border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/20'
                      : 'bg-transparent border-transparent hover:bg-stone-100/80 dark:hover:bg-stone-900/60 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isEditing ? (
                    /* Inline Rename Form */
                    <form
                      onSubmit={(e) => saveRename(conv.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 w-full"
                    >
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        autoFocus
                        className="flex-1 px-2 py-1 bg-white dark:bg-stone-800 border border-emerald-500 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        title="ذخیره عنوان"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelRename}
                        className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                        title="انصراف"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </form>
                  ) : (
                    /* Normal Conversation View */
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {conv.pinned && (
                            <Pin className="w-3 h-3 text-amber-500 shrink-0 fill-amber-500" />
                          )}
                          <span
                            className={`font-semibold truncate block ${
                              isActive
                                ? 'text-emerald-900 dark:text-emerald-300'
                                : 'text-stone-800 dark:text-stone-200'
                            }`}
                          >
                            {conv.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-1">
                          <span className="font-mono">{conv.messageCount} پیام</span>
                          <span>•</span>
                          <span>{new Date(conv.updatedAt).toLocaleDateString('fa-IR')}</span>
                        </div>
                      </div>

                      {/* Hover action toolbar */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePin(conv.id);
                          }}
                          className={`p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-800 ${
                            conv.pinned ? 'text-amber-500' : 'text-stone-400'
                          }`}
                          title={conv.pinned ? 'برداشتن سنجاق' : 'سنجاق کردن'}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => startRename(conv, e)}
                          className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded hover:bg-stone-200 dark:hover:bg-stone-800"
                          title="تغییر نام گفتگو"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(conv.id);
                          }}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-200 dark:hover:bg-stone-800"
                          title="حذف گفتگو"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer: IndexedDB Sync Badge */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>ذخیره‌سازی محلی دائم</span>
          </div>
          <span className="font-mono text-[10px]">{conversations.length} گفتگو</span>
        </div>
      </aside>
    </>
  );
};
