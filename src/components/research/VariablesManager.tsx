import React, { useState } from 'react';
import { ResearchVariable } from '../../types/research';
import { Layers, Plus, Trash2, Sliders, CheckCircle2, ShieldAlert } from 'lucide-react';

interface VariablesManagerProps {
  variables: ResearchVariable[];
  onChange: (updated: ResearchVariable[]) => void;
  readOnly?: boolean;
}

export const VariablesManager: React.FC<VariablesManagerProps> = ({
  variables,
  onChange,
  readOnly = false
}) => {
  const [activeTab, setActiveTab] = useState<'independent' | 'dependent' | 'control'>('independent');
  const [showAddForm, setShowAddForm] = useState(false);

  // New variable form state
  const [newVarName, setNewVarName] = useState('');
  const [newVarUnit, setNewVarUnit] = useState('');
  const [newVarLevels, setNewVarLevels] = useState('');
  const [newVarMethod, setNewVarMethod] = useState('');
  const [newVarDesc, setNewVarDesc] = useState('');

  const indeps = variables.filter((v) => v.type === 'independent');
  const deps = variables.filter((v) => v.type === 'dependent');
  const controls = variables.filter((v) => v.type === 'control');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarName.trim()) return;

    const newVar: ResearchVariable = {
      id: 'var-' + Date.now().toString(36),
      name: newVarName.trim(),
      type: activeTab,
      unit: newVarUnit.trim() || undefined,
      levelsOrRange: newVarLevels.trim() || undefined,
      measurementMethod: newVarMethod.trim() || undefined,
      description: newVarDesc.trim() || undefined
    };

    onChange([...variables, newVar]);
    setNewVarName('');
    setNewVarUnit('');
    setNewVarLevels('');
    setNewVarMethod('');
    setNewVarDesc('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    onChange(variables.filter((v) => v.id !== id));
  };

  const currentList = activeTab === 'independent' ? indeps : activeTab === 'dependent' ? deps : controls;

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              مدیریت متغیرهای پژوهش (Research Variables)
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            تفکیک متغیرهای مستقل، وابسته و کنترل به همراه سطوح آزمون و روش‌های سنجش
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/80 dark:bg-stone-800 rounded-lg text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('independent'); setShowAddForm(false); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'independent'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            مستقل ({indeps.length})
          </button>
          <button
            onClick={() => { setActiveTab('dependent'); setShowAddForm(false); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'dependent'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            وابسته / پاسخ ({deps.length})
          </button>
          <button
            onClick={() => { setActiveTab('control'); setShowAddForm(false); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'control'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            کنترل فرآیند ({controls.length})
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Warning if no controls exist */}
        {activeTab === 'control' && controls.length === 0 && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs flex items-start gap-2 text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>هشدار ممیزی روش‌شناسی:</strong> ثبت نکردن متغیرهای کنترل (مانند دمای محیط، رطوبت نسبی، دور همزن یا نوع نمونه شاهد) یکی از شایع‌ترین علل مردودی پروپوزال و غیرقابل تکرار بودن نتایج است.
            </div>
          </div>
        )}

        {/* List of items in current tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {currentList.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-850/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                    {item.name}
                  </div>
                  {!readOnly && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="حذف متغیر"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {item.unit && (
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1 font-mono">
                    <span>واحد اندازه‌گیری:</span>
                    <span className="font-semibold text-stone-700 dark:text-stone-300" dir="ltr">
                      {item.unit}
                    </span>
                  </div>
                )}

                {item.levelsOrRange && (
                  <div className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">
                    <span className="text-stone-500 dark:text-stone-400">سطوح / دامنه تغییر: </span>
                    <span className="font-medium">{item.levelsOrRange}</span>
                  </div>
                )}

                {item.measurementMethod && (
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1 bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                    <span className="font-semibold">روش سنجش: </span>
                    <span>{item.measurementMethod}</span>
                  </div>
                )}

                {item.description && (
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          ))}

          {currentList.length === 0 && (
            <div className="col-span-full p-6 text-center text-xs text-stone-500 dark:text-stone-400 border border-dashed border-stone-300 dark:border-stone-700 rounded-lg">
              هیچ متغیری در دسته {activeTab === 'independent' ? 'مستقل' : activeTab === 'dependent' ? 'وابسته' : 'کنترل'} ثبت نشده است.
            </div>
          )}
        </div>

        {/* Add form */}
        {!readOnly && (
          <div>
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-dashed border-emerald-300 dark:border-emerald-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>
                  افزودن متغیر {activeTab === 'independent' ? 'مستقل' : activeTab === 'dependent' ? 'وابسته' : 'کنترل'} جدید
                </span>
              </button>
            ) : (
              <form onSubmit={handleAdd} className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-xs space-y-3">
                <div className="font-bold text-stone-800 dark:text-stone-200">
                  ثبت متغیر {activeTab === 'independent' ? 'مستقل' : activeTab === 'dependent' ? 'وابسته' : 'کنترل'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                      نام متغیر *
                    </label>
                    <input
                      type="text"
                      value={newVarName}
                      onChange={(e) => setNewVarName(e.target.value)}
                      placeholder="مثال: غلظت اسانس آویشن شیرازی، عدد پراکسید..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                      واحد اندازه‌گیری (Unit)
                    </label>
                    <input
                      type="text"
                      value={newVarUnit}
                      onChange={(e) => setNewVarUnit(e.target.value)}
                      placeholder="مثال: % w/v, meq O2/kg, °C, log CFU/g"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                      سطوح یا دامنه مقادیر (Levels / Range)
                    </label>
                    <input
                      type="text"
                      value={newVarLevels}
                      onChange={(e) => setNewVarLevels(e.target.value)}
                      placeholder="مثال: ۰، ۰.۵، ۱ و ۱.۵ درصد / ۴ ± ۰.۵ درجه"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                      روش یا استاندارد اندازه‌گیری
                    </label>
                    <input
                      type="text"
                      value={newVarMethod}
                      onChange={(e) => setNewVarMethod(e.target.value)}
                      placeholder="مثال: روش یدومتری AOAC 965.33 یا کشت پورپلیت ISIRI 2408"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    توضیحات تکمیلی
                  </label>
                  <input
                    type="text"
                    value={newVarDesc}
                    onChange={(e) => setNewVarDesc(e.target.value)}
                    placeholder="علت انتخاب، دستگاه و شرایط آماده‌سازی نمونه"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-colors"
                  >
                    افزودن به لیست
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
