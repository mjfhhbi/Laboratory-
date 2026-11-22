import React, { useState } from 'react';
import { PythonScriptPreset } from '../../lib/python/types';
import { FOOD_ENGINEERING_TEMPLATES } from '../../lib/python/templates';
import { X, BookOpen, Bookmark, Trash2, Plus, Code2 } from 'lucide-react';

interface PythonScriptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedScripts: PythonScriptPreset[];
  currentCode: string;
  onSelectScript: (script: PythonScriptPreset) => void;
  onSaveCurrentScript: (title: string, category: string, description: string) => void;
  onDeleteScript: (id: string) => void;
}

export const PythonScriptsModal: React.FC<PythonScriptsModalProps> = ({
  isOpen,
  onClose,
  savedScripts,
  currentCode,
  onSelectScript,
  onSaveCurrentScript,
  onDeleteScript
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'saved' | 'save_new'>('templates');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('شخصی');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSaveCurrentScript(title.trim(), category, description.trim());
    setTitle('');
    setDescription('');
    setActiveTab('saved');
  };

  const userCustomScripts = savedScripts.filter((s) => s.isCustom);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              مدیریت اسکریپت‌ها و الگوهای مهندسی صنایع غذایی
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-1 p-2 bg-stone-100/60 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'templates'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>الگوهای استاندارد صنایع غذایی ({FOOD_ENGINEERING_TEMPLATES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'saved'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>اسکریپت‌های ذخیره‌شده من ({userCustomScripts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('save_new')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors mr-auto ${
              activeTab === 'save_new'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ذخیره کد فعلی</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {/* Tab 1: Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-2.5">
              {FOOD_ENGINEERING_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-emerald-500/80 dark:hover:border-emerald-500/60 bg-stone-50/50 dark:bg-stone-950/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {tmpl.category}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                        {tmpl.title}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {tmpl.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectScript(tmpl);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shrink-0"
                  >
                    بارگذاری در ادیتور
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: User Saved Scripts */}
          {activeTab === 'saved' && (
            <div className="space-y-2.5">
              {userCustomScripts.length === 0 ? (
                <div className="text-center py-10 text-stone-500 text-xs">
                  هنوز اسکریپتی ذخیره نکرده‌اید. با کلیک بر روی «ذخیره کد فعلی»، کدهای خود را ذخیره کنید.
                </div>
              ) : (
                userCustomScripts.map((script) => (
                  <div
                    key={script.id}
                    className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                        {script.title}
                      </h4>
                      {script.description && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                          {script.description}
                        </p>
                      )}
                      <span className="text-[10px] font-mono text-stone-400 mt-1 block" dir="ltr">
                        {new Date(script.updatedAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectScript(script);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                      >
                        بارگذاری
                      </button>
                      <button
                        onClick={() => onDeleteScript(script.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Save Current Code */}
          {activeTab === 'save_new' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  عنوان اسکریپت *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: محاسبه تخمیر ماست و بریکس نهایی"
                  className="w-full px-3 py-2 rounded-lg text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  دسته‌بندی
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="فرمولاسیون، کینتیک، کنترل کیفیت..."
                  className="w-full px-3 py-2 rounded-lg text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  توضیحات اختیاری
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="هدف از این کد، فرضیات محاسباتی..."
                  className="w-full px-3 py-2 rounded-lg text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('templates')}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !currentCode.trim()}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-40 shadow-xs"
                >
                  ذخیره در حافظه سیستم
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
