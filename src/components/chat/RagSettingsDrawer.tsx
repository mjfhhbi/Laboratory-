/**
 * Food Science AI - RAG Settings & Priority Configuration Drawer
 * Part 23 of 30 - Customizable RAG Engine Parameters
 */

import React, { useState } from 'react';
import {
  RagConfig,
  RagPriorityPreset,
  RagSearchMode,
  RagSourcePriorityWeights
} from '../../lib/rag/types';
import {
  DEFAULT_PRIORITY_WEIGHTS,
  saveRagConfig,
  resetRagConfig
} from '../../lib/rag/ragSettingsStorage';
import {
  Sliders,
  X,
  RotateCcw,
  Check,
  Search,
  Sparkles,
  Layers,
  ShieldCheck,
  FileText,
  BookOpen,
  HelpCircle,
  Filter
} from 'lucide-react';

interface RagSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: RagConfig;
  onConfigChange: (newConfig: RagConfig) => void;
}

const SOURCE_TYPE_LABELS: Array<{ key: keyof RagSourcePriorityWeights; labelFa: string; icon: string }> = [
  { key: 'inso_standard', labelFa: 'استاندارد ملی ایران (INSO)', icon: '🏛️' },
  { key: 'official_regulatory', labelFa: 'مراجع رسمی نظارتی (غذا و دارو / FDA)', icon: '⚖️' },
  { key: 'aoac_method', labelFa: 'روش‌های رسمی آزمون (AOAC)', icon: '🧪' },
  { key: 'iso_standard', labelFa: 'استانداردهای بین‌المللی ISO', icon: '🌐' },
  { key: 'codex_standard', labelFa: 'استانداردهای بین‌المللی کدکس (Codex)', icon: '📜' },
  { key: 'scientific_paper', labelFa: 'مقالات علمی پژوهشی داوری‌شده', icon: '📑' },
  { key: 'reference_book', labelFa: 'کتب مرجع دانشگاهی تخصصی', icon: '📚' },
  { key: 'lab_manual', labelFa: 'دستورالعمل‌ها و SOPهای آزمایشگاهی', icon: '📋' },
  { key: 'lecture_handout', labelFa: 'جزوات آموزشی و پمفلت‌ها', icon: '📄' },
  { key: 'lab_file', labelFa: 'فایل‌ها و گزارش‌های روزانه آزمایشگاه', icon: '📁' },
  { key: 'sds', labelFa: 'برگه‌های اطلاعات ایمنی مواد (SDS)', icon: '⚠️' }
];

export const RagSettingsDrawer: React.FC<RagSettingsDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onConfigChange
}) => {
  const [localConfig, setLocalConfig] = useState<RagConfig>(config);
  const [activeTab, setActiveTab] = useState<'strategy' | 'priority' | 'filters'>('strategy');

  if (!isOpen) return null;

  const handleSave = () => {
    saveRagConfig(localConfig);
    onConfigChange(localConfig);
    onClose();
  };

  const handleReset = () => {
    const def = resetRagConfig();
    setLocalConfig(def);
    onConfigChange(def);
  };

  const handlePresetSelect = (preset: RagPriorityPreset) => {
    setLocalConfig({
      ...localConfig,
      priorityPreset: preset,
      priorityWeights: { ...DEFAULT_PRIORITY_WEIGHTS[preset] }
    });
  };

  const handleWeightChange = (key: keyof RagSourcePriorityWeights, value: number) => {
    setLocalConfig({
      ...localConfig,
      priorityPreset: 'custom',
      priorityWeights: {
        ...localConfig.priorityWeights,
        [key]: value
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>تنظیمات موتور RAG تخصصی Food Science</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-mono">v2.3</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                پیکربندی استراتژی جستجو، وزن‌دهی به مراجع، و فیلترهای استخراج دانش
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Toggle */}
        <div className="px-6 py-3 bg-stone-50 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              فعال‌سازی جستجوی پیش‌پاسخ هوش مصنوعی (RAG Engine)
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localConfig.enabled}
              onChange={(e) => setLocalConfig({ ...localConfig, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 px-4 pt-2 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('strategy')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'strategy'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>استراتژی جستجو (Search Mode)</span>
          </button>
          <button
            onClick={() => setActiveTab('priority')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'priority'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>اولویت‌بندی مراجع (Source Priority)</span>
          </button>
          <button
            onClick={() => setActiveTab('filters')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'filters'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>فیلترهای بازیابی (Filtering)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-stone-700 dark:text-stone-300">
          
          {/* TAB 1: Search Strategy */}
          {activeTab === 'strategy' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2">
                  حالت جستجو در پایگاه دانش و اسناد PDF:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'hybrid' as RagSearchMode,
                      title: 'جستجوی هیبریدی (Hybrid)',
                      desc: 'ترکیب معنایی (Semantic) و کلیدواژه‌ای (Keyword)',
                      recommended: true
                    },
                    {
                      id: 'semantic' as RagSearchMode,
                      title: 'جستجوی معنایی (Semantic)',
                      desc: 'تطابق بر پایه مفاهیم و اصطلاحات مهندسی غذا',
                      recommended: false
                    },
                    {
                      id: 'keyword' as RagSearchMode,
                      title: 'جستجوی دقیق واژگان (Keyword)',
                      desc: 'تطابق عین کلمات، شماره استاندارد و کدها',
                      recommended: false
                    }
                  ].map((mode) => (
                    <div
                      key={mode.id}
                      onClick={() => setLocalConfig({ ...localConfig, searchMode: mode.id })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        localConfig.searchMode === mode.id
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 bg-white dark:bg-stone-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">{mode.title}</span>
                        {mode.recommended && (
                          <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                            پیشنهادی
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                        {mode.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {localConfig.searchMode === 'hybrid' && (
                <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium">توازن جستجوی معنایی در برابر کلیدواژه‌ای:</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400" dir="ltr">
                      {Math.round((localConfig.hybridAlpha ?? 0.55) * 100)}% معنایی / {Math.round((1 - (localConfig.hybridAlpha ?? 0.55)) * 100)}% واژگانی
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={localConfig.hybridAlpha ?? 0.55}
                    onChange={(e) => setLocalConfig({ ...localConfig, hybridAlpha: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>۱۰۰٪ تطابق عین کلمات (Keyword)</span>
                    <span>متوازن</span>
                    <span>۱۰۰٪ تحلیل مفهومی (Semantic)</span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium">حداکثر تعداد قطعات مرتبط جهت استخراج (Top-K Chunks):</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400" dir="ltr">
                    {localConfig.topKChunks || 6} قطعه
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="1"
                  value={localConfig.topKChunks || 6}
                  onChange={(e) => setLocalConfig({ ...localConfig, topKChunks: parseInt(e.target.value, 10) })}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium">حداقل آستانه امتیاز شواهد (Min Evidence Score):</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400" dir="ltr">
                    {localConfig.minEvidenceScore || 35}%
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="70"
                  step="5"
                  value={localConfig.minEvidenceScore || 35}
                  onChange={(e) => setLocalConfig({ ...localConfig, minEvidenceScore: parseInt(e.target.value, 10) })}
                  className="w-full accent-emerald-600"
                />
                <p className="text-[10px] text-stone-500 dark:text-stone-400">
                  اگر امتیاز شواهد بازیابی‌شده کمتر از این مقدار باشد، سیستم هشدار «کمبود منبع قطعی» داده و پاسخ را به صورت Unverified علامت‌گذاری می‌کند.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Source Priority */}
          {activeTab === 'priority' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2">
                  الگوی پیش‌فرض اولویت مراجع:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'standards_first' as RagPriorityPreset, label: 'استانداردهای ملی و رسمی', badge: 'پیشنهادی' },
                    { id: 'academic_first' as RagPriorityPreset, label: 'مقالات و کتب مرجع', badge: 'آکادمیک' },
                    { id: 'official_first' as RagPriorityPreset, label: 'مراجع نظارتی و دولتی', badge: 'رگولاتوری' },
                    { id: 'custom' as RagPriorityPreset, label: 'تنظیمات سفارشی', badge: 'دستی' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`p-2.5 rounded-xl border text-right transition-all ${
                        localConfig.priorityPreset === preset.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold'
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/40 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{preset.label}</div>
                      <div className="text-[9px] text-stone-400">{preset.badge}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    ضریب اولویت به تفکیک رده‌های ۱۱گانه منابع:
                  </span>
                  <span className="text-[11px] text-stone-500">ضریب از ۰.۵× تا ۳.۰×</span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {SOURCE_TYPE_LABELS.map((item) => {
                    const val = localConfig.priorityWeights[item.key] ?? 1.0;
                    return (
                      <div
                        key={item.key}
                        className="p-2.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/80 dark:border-stone-700/60 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2 min-w-[200px]">
                          <span className="text-base">{item.icon}</span>
                          <span className="text-xs font-medium text-stone-800 dark:text-stone-200">{item.labelFa}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                          <input
                            type="range"
                            min="0.5"
                            max="3.0"
                            step="0.1"
                            value={val}
                            onChange={(e) => handleWeightChange(item.key, parseFloat(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                          <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 w-10 text-left" dir="ltr">
                            {val.toFixed(1)}×
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Filters */}
          {activeTab === 'filters' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  فیلتر پیش‌فرض فرآورده غذایی (Product Filter):
                </label>
                <input
                  type="text"
                  placeholder="مثال: شیر پاستوریزه، روغن خوراکی، رب گوجه..."
                  value={localConfig.filters.productFilter || ''}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      filters: { ...localConfig.filters, productFilter: e.target.value || undefined }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  در صورت خالی بودن، موتور هوشمند RAG فرآورده را به صورت خودکار از پرسش کاربر تشخیص می‌دهد.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  فیلتر پیش‌فرض آزمون آزمایشگاهی (Experiment Filter):
                </label>
                <input
                  type="text"
                  placeholder="مثال: اسیدیته، درصد چربی، عدد پراکسید، بریکس..."
                  value={localConfig.filters.experimentFilter || ''}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      filters: { ...localConfig.filters, experimentFilter: e.target.value || undefined }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  فیلتر شماره یا پیشوند استاندارد (Standard Filter):
                </label>
                <input
                  type="text"
                  placeholder="مثال: INSO 2406 یا ISO یا AOAC..."
                  value={localConfig.filters.standardFilter || ''}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      filters: { ...localConfig.filters, standardFilter: e.target.value || undefined }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:border-emerald-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.filters.enableVersionAwareness ?? true}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        filters: { ...localConfig.filters, enableVersionAwareness: e.target.checked }
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    سامانه پایش هوشمند نسخه و بازنگری استانداردها (Version Awareness)
                  </span>
                </label>
                <p className="text-[10px] text-stone-400 mt-1 mr-6">
                  کاهش رتبه و هشدار برای استانداردهای منسوخ‌شده/ابطال‌شده و معرفی شماره استاندارد جایگزین جدید.
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.filters.requireHumanVerifiedOcr ?? true}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        filters: { ...localConfig.filters, requireHumanVerifiedOcr: e.target.checked }
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    الزام به تایید انسانی متون استخراج‌شده از تصویر (OCR Guard)
                  </span>
                </label>
                <p className="text-[10px] text-stone-400 mt-1 mr-6">
                  متون OCR که هنوز توسط کارشناس QC تایید نشده‌اند، در پاسخ‌های رسمی و قطعی وارد نخواهند شد.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/30">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی پیش‌فرض</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>ذخیره و اعمال تنظیمات</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
