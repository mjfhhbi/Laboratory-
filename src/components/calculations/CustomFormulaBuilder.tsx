import React, { useState, useEffect } from 'react';
import { appAlert } from '../common/DialogProvider';
import { 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Code2, 
  HelpCircle, 
  BookOpen,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  CustomFormulaRecord, 
  FormulaVariable, 
  FormulaCategory, 
  UnitCategory 
} from '../../types/calculations';
import { 
  saveCustomFormula, 
  deleteCustomFormula, 
  loadCustomFormulasFromStorage, 
  validateFormulaExpression 
} from '../../lib/calculations/formulaRegistry';
import { evaluateExpression } from '../../lib/calculations/expressionEvaluator';

export const CustomFormulaBuilder: React.FC = () => {
  const [savedFormulas, setSavedFormulas] = useState<CustomFormulaRecord[]>([]);
  const [nameFa, setNameFa] = useState<string>('');
  const [nameEn, setNameEn] = useState<string>('');
  const [category, setCategory] = useState<FormulaCategory>('custom');
  const [standardReference, setStandardReference] = useState<string>('');
  const [outputUnit, setOutputUnit] = useState<string>('%');
  const [defaultDecimals, setDefaultDecimals] = useState<number>(2);
  const [descriptionFa, setDescriptionFa] = useState<string>('');
  const [expression, setExpression] = useState<string>('');
  
  const [variables, setVariables] = useState<FormulaVariable[]>([
    {
      id: 'v1',
      symbol: 'A',
      nameFa: 'مقدار ورودی اول',
      nameEn: 'Input Value A',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      required: true
    },
    {
      id: 'v2',
      symbol: 'B',
      nameFa: 'مقدار ورودی دوم',
      nameEn: 'Input Value B',
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      required: true
    }
  ]);

  const [testValues, setTestValues] = useState<Record<string, number>>({
    A: 10,
    B: 2
  });

  const [testResult, setTestResult] = useState<{
    success: boolean;
    value?: number;
    error?: string;
  }>({ success: false });

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Load custom formulas on mount
  useEffect(() => {
    loadCustomFormulasFromStorage().then(defs => {
      // Find raw records if any
    });
  }, []);

  const handleAddVariable = () => {
    const nextSymbol = String.fromCharCode(65 + variables.length); // C, D, E...
    const newVar: FormulaVariable = {
      id: `v_${Date.now()}`,
      symbol: nextSymbol,
      nameFa: `متغیر ${nextSymbol}`,
      nameEn: `Variable ${nextSymbol}`,
      category: 'mass',
      defaultUnit: 'g',
      allowedUnits: ['g', 'mg'],
      required: true
    };
    setVariables([...variables, newVar]);
    setTestValues(prev => ({ ...prev, [nextSymbol]: 1 }));
  };

  const handleRemoveVariable = (idx: number) => {
    const symbolToRemove = variables[idx].symbol;
    const updated = variables.filter((_, i) => i !== idx);
    setVariables(updated);
    const updatedTest = { ...testValues };
    delete updatedTest[symbolToRemove];
    setTestValues(updatedTest);
  };

  const handleVariableChange = (index: number, field: keyof FormulaVariable, val: any) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: val };
    setVariables(updated);
  };

  // Test Formula Expression in real-time
  useEffect(() => {
    if (!expression.trim()) {
      setTestResult({ success: false, error: 'عبارت فرمول خالی است.' });
      return;
    }

    const varSymbols = variables.map(v => v.symbol);
    const validation = validateFormulaExpression(expression, varSymbols);

    if (!validation.valid) {
      setTestResult({ success: false, error: validation.error });
      return;
    }

    try {
      const res = evaluateExpression(expression, testValues);
      setTestResult({ success: true, value: res.result });
    } catch (err: unknown) {
      setTestResult({ success: false, error: err instanceof Error ? err.message : String(err) });
    }
  }, [expression, testValues, variables]);

  const handleSaveFormula = async () => {
    if (!nameFa.trim() || !expression.trim()) {
      appAlert('لطفاً عنوان فرمول و عبارت ریاضی آن را تکمیل نمایید.', 'warning');
      return;
    }

    const record: CustomFormulaRecord = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      nameFa,
      nameEn: nameEn || nameFa,
      category,
      standardReference: standardReference.trim(),
      expression,
      variables,
      outputUnit,
      defaultDecimals,
      descriptionFa,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await saveCustomFormula(record);
      setSavedFormulas(prev => [record, ...prev]);
      setSaveStatus('فرمول با موفقیت در حافظه ماندگار IndexedDB ثبت شد.');
      setTimeout(() => setSaveStatus(null), 4000);
      
      // Reset form
      setNameFa('');
      setNameEn('');
      setExpression('');
      setDescriptionFa('');
    } catch (err: unknown) {
      appAlert(`خطا در ذخیره فرمول: ${err instanceof Error ? err.message : String(err)}`, 'error');
    }
  };

  return (
    <div className="space-y-6" id="custom-formula-builder-container">
      {/* Header Info */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
              موتور طراحی فرمول‌های سفارشی بدون دستکاری کد
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              تعریف فرمول‌های محاسباتی جدید، مشخص کردن متغیرها، اعتبارسنجی سینتکس و ارزیابی در محیط Sandboxed
            </p>
          </div>
        </div>

        <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2 mt-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>قاعده اصالت علمی و استانداردها:</strong> سیستم هرگز نباید حدود و ثوابت علمی را حدس بزند. در صورت عدم درج رفرنس استاندارد معتبر، نتیجه فرمول به عنوان نتیجه رسمی آزمایشگاهی تأیید نخواهد شد و هشدار عدم استناد نمایش داده می‌شود.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Formula Meta & Variables */}
        <div className="lg:col-span-7 space-y-5">
          {/* Metadata Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              مشخصات و متادیتای فرمول جدید
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  نام فارسی فرمول: *
                </label>
                <input
                  type="text"
                  value={nameFa}
                  onChange={(e) => setNameFa(e.target.value)}
                  placeholder="مثلاً: درصد حلالیت در آب سرد"
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  نام انگلیسی (اختیاری):
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Cold Water Solubility %"
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-stone-100 font-mono text-left dir-ltr outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  دسته‌بندی:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FormulaCategory)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-2 text-xs text-stone-800 dark:text-stone-200 outline-none"
                >
                  <option value="custom">سفارشی و متفرقه</option>
                  <option value="proximate_analysis">آنالیز تقریب</option>
                  <option value="titration_chemistry">تیتراسیون و شیمیایی</option>
                  <option value="solutions_dilution">رقت و محلول‌سازی</option>
                  <option value="physical_chemical">فیزیکوشیمیایی</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  واحد خروجی:
                </label>
                <input
                  type="text"
                  value={outputUnit}
                  onChange={(e) => setOutputUnit(e.target.value)}
                  placeholder="مثلاً: %، g/100g، mg/L"
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-2 text-xs text-center font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  تعداد اعشار خروجی:
                </label>
                <select
                  value={defaultDecimals}
                  onChange={(e) => setDefaultDecimals(Number(e.target.value))}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-2 text-xs text-stone-800 dark:text-stone-200 outline-none"
                >
                  <option value={1}>۱ رقم اعشار</option>
                  <option value={2}>۲ رقم اعشار</option>
                  <option value={3}>۳ رقم اعشار</option>
                  <option value={4}>۴ رقم اعشار</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                رفرنس استاندارد یا کتاب مرجع:
              </label>
              <input
                type="text"
                value={standardReference}
                onChange={(e) => setStandardReference(e.target.value)}
                placeholder="مثلاً: استاندارد ملی ایران ۲۴۰۶ / AOAC 925.10"
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-stone-100 outline-none"
              />
            </div>
          </div>

          {/* Variables Builder */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                تعریف متغیرهای ورودی فرمول ({variables.length} متغیر)
              </h4>
              <button
                onClick={handleAddVariable}
                className="flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
              >
                <Plus className="w-3.5 h-3.5" />
                افزودن متغیر
              </button>
            </div>

            <div className="space-y-2.5">
              {variables.map((variable, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-10">
                        <label className="text-[10px] text-stone-500 block">نماد</label>
                        <input
                          type="text"
                          value={variable.symbol}
                          onChange={(e) => handleVariableChange(idx, 'symbol', e.target.value.toUpperCase())}
                          className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-1.5 py-1 text-xs font-mono font-bold text-center outline-none"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="text-[10px] text-stone-500 block">عنوان فارسی متغیر</label>
                        <input
                          type="text"
                          value={variable.nameFa}
                          onChange={(e) => handleVariableChange(idx, 'nameFa', e.target.value)}
                          placeholder="مثلاً: وزن ظرف خالی"
                          className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-xs outline-none"
                        />
                      </div>

                      <div className="w-20">
                        <label className="text-[10px] text-stone-500 block">واحد پیش‌فرض</label>
                        <input
                          type="text"
                          value={variable.defaultUnit}
                          onChange={(e) => handleVariableChange(idx, 'defaultUnit', e.target.value)}
                          className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-xs font-mono text-center outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveVariable(idx)}
                      disabled={variables.length <= 1}
                      className="p-1.5 text-stone-400 hover:text-rose-600 disabled:opacity-20 transition-colors mt-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form: Expression Editor & Sandbox Testing */}
        <div className="lg:col-span-5 space-y-5">
          {/* Formula Expression Editor */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-600" />
              عبارت محاسباتی ریاضی (Math Expression)
            </h4>

            <div>
              <label className="text-[11px] text-stone-500 block mb-1">
                فرمول را با استفاده از نمادهای متغیرها ({variables.map(v => v.symbol).join(', ')}) بنویسید:
              </label>
              <textarea
                rows={3}
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="مثلاً: (A - B) / A * 100"
                className="w-full bg-stone-900 text-emerald-300 border border-stone-700 rounded-xl p-3 font-mono text-sm dir-ltr text-left outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Supported Functions Helper */}
            <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-lg text-[11px] text-stone-600 dark:text-stone-400 space-y-1">
              <span className="font-semibold block">عملگرها و توابع مجاز:</span>
              <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                <span className="bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">+ - * /</span>
                <span className="bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">^ (توان)</span>
                <span className="bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">sqrt(x)</span>
                <span className="bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">abs(x)</span>
                <span className="bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">log(x) / ln(x)</span>
                <span className="bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">pow(a, b)</span>
                <span className="bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">min(a, b) / max(a, b)</span>
              </div>
            </div>
          </div>

          {/* Real-time Sandbox Live Tester */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              آزمون زنده در محیط ایزوله (Sandbox Live Evaluation)
            </h4>

            <div className="space-y-2">
              <span className="text-[11px] text-stone-500 block">مقادیر تستی متغیرها:</span>
              <div className="grid grid-cols-2 gap-2">
                {variables.map((v) => (
                  <div key={v.symbol} className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800 p-2 rounded-lg border border-stone-200 dark:border-stone-700">
                    <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-300 w-5">
                      {v.symbol}:
                    </span>
                    <input
                      type="number"
                      value={testValues[v.symbol] ?? 1}
                      onChange={(e) => setTestValues({ ...testValues, [v.symbol]: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-1.5 py-0.5 text-xs font-mono text-left dir-ltr outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Test Result Output Box */}
            <div className={`p-4 rounded-xl border text-center transition-all ${
              testResult.success
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700'
            }`}>
              {testResult.success ? (
                <div>
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block mb-1">
                    نتیجه ارزیابی آزمایشی:
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
                    {testResult.value !== undefined ? testResult.value.toFixed(defaultDecimals) : '-'} {outputUnit}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {testResult.error || 'عبارت فرمول را وارد کنید'}
                </div>
              )}
            </div>

            {saveStatus && (
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveStatus}</span>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveFormula}
              disabled={!testResult.success}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره فرمول در سامانه (IndexedDB)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
