import React, { useState, useMemo, useEffect } from 'react';
import {
  FunctionSquare,
  Copy,
  Check,
  Calculator,
  ArrowDown,
  Layers,
  Sparkles,
  Info,
  Scale,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { KaTeXRenderer, formatToLaTeX } from './KaTeXRenderer';
import { evaluateExpression } from '../../lib/calculations/calculationEngine';

export interface FormulaVariableItem {
  symbol: string;
  name: string;
  unit: string;
  defaultValue?: number | string;
  description?: string;
}

export interface ScientificFormulaCardProps {
  title?: string;
  formulaExpression: string; // e.g. "Moisture = ((m1 - m2) / (m1 - m0)) * 100" or LaTeX
  formulaLatex?: string; // Optional direct LaTeX string
  variables?: FormulaVariableItem[];
  defaultValues?: Record<string, number>;
  resultUnit?: string;
  decimalPrecision?: number;
  guidanceText?: string;
  allowInputEdit?: boolean;
  onCalculated?: (result: number | null) => void;
  className?: string;
}

export const ScientificFormulaCard: React.FC<ScientificFormulaCardProps> = ({
  title,
  formulaExpression,
  formulaLatex,
  variables = [],
  defaultValues = {},
  resultUnit = '%',
  decimalPrecision = 2,
  guidanceText,
  allowInputEdit = true,
  onCalculated,
  className = ''
}) => {
  // Initialize input state with provided defaults
  const [inputs, setInputs] = useState<Record<string, number | undefined>>(() => {
    const init: Record<string, number | undefined> = {};
    for (const v of variables) {
      if (defaultValues[v.symbol] !== undefined) {
        init[v.symbol] = defaultValues[v.symbol];
      } else if (v.defaultValue !== undefined && !isNaN(Number(v.defaultValue))) {
        init[v.symbol] = Number(v.defaultValue);
      }
    }
    return init;
  });

  const [copiedFormula, setCopiedFormula] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  // Synchronize if defaultValues change
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      setInputs((prev) => ({ ...prev, ...defaultValues }));
    }
  }, [defaultValues]);

  const handleInputChange = (symbol: string, valueStr: string) => {
    const num = valueStr.trim() === '' ? undefined : parseFloat(valueStr);
    setInputs((prev) => ({
      ...prev,
      [symbol]: num
    }));
  };

  const handleResetInputs = () => {
    const reset: Record<string, number | undefined> = {};
    for (const v of variables) {
      if (v.defaultValue !== undefined && !isNaN(Number(v.defaultValue))) {
        reset[v.symbol] = Number(v.defaultValue);
      }
    }
    setInputs(reset);
  };

  // 1. Formula LaTeX Expression
  const mainFormulaLatex = useMemo(() => {
    if (formulaLatex) return formulaLatex;
    return formatToLaTeX(formulaExpression);
  }, [formulaLatex, formulaExpression]);

  // 2. Substituted Expression in LaTeX
  const substitutedLatex = useMemo(() => {
    let subStr = formulaExpression;
    // Replace symbol with number in formula
    for (const v of variables) {
      const val = inputs[v.symbol];
      const valText = val !== undefined ? String(val) : `[${v.symbol}]`;
      // Word boundary regex replacement
      const regex = new RegExp(`\\b${v.symbol}\\b`, 'g');
      subStr = subStr.replace(regex, valText);
    }
    return formatToLaTeX(subStr);
  }, [formulaExpression, variables, inputs]);

  // 3. Calculation via existing Calculation Engine (evaluateExpression)
  const calculationExecution = useMemo(() => {
    // Check if all variables have numeric inputs
    const allFilled = variables.every((v) => inputs[v.symbol] !== undefined && !isNaN(Number(inputs[v.symbol])));

    // Extract right hand side of formula e.g. "Result = (A * B) / C"
    let exprToEval = formulaExpression;
    if (exprToEval.includes('=')) {
      const parts = exprToEval.split('=');
      exprToEval = parts[1].trim();
    }
    // Also if multiple formulas separated by pipe, take first
    if (exprToEval.includes('|')) {
      exprToEval = exprToEval.split('|')[0].trim();
    }

    if (!allFilled) {
      return {
        value: null,
        formatted: 'نیازمند تکمیل ورودی‌ها',
        trace: 'مقادیر متغیرها را وارد فرمایید.',
        isSuccess: false
      };
    }

    try {
      const scope: Record<string, number> = {};
      for (const v of variables) {
        if (inputs[v.symbol] !== undefined) {
          scope[v.symbol] = Number(inputs[v.symbol]);
        }
      }

      const evalRes = evaluateExpression(exprToEval, scope);
      if (evalRes.result !== null && !isNaN(evalRes.result)) {
        return {
          value: evalRes.result,
          formatted: evalRes.result.toFixed(decimalPrecision),
          trace: evalRes.evaluationSteps?.join(' → ') || `${evalRes.result.toFixed(decimalPrecision)}`,
          isSuccess: true
        };
      }
      return {
        value: null,
        formatted: 'خطا در محاسبه',
        trace: 'فرمول قابل ارزیابی نیست',
        isSuccess: false
      };
    } catch (err: any) {
      return {
        value: null,
        formatted: 'خطای محاسباتی',
        trace: err?.message || 'خطای ارزیابی عبارت',
        isSuccess: false
      };
    }
  }, [formulaExpression, variables, inputs, decimalPrecision]);

  // Trigger callback
  useEffect(() => {
    if (onCalculated) {
      onCalculated(calculationExecution.value);
    }
  }, [calculationExecution.value, onCalculated]);

  const handleCopyFormula = async () => {
    try {
      await navigator.clipboard.writeText(formulaExpression);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyResult = async () => {
    if (calculationExecution.value === null) return;
    try {
      const text = `${calculationExecution.formatted} ${resultUnit}`;
      await navigator.clipboard.writeText(text);
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden ${className}`}
      dir="rtl"
    >
      {/* Header Bar */}
      <div className="p-3.5 sm:p-4 bg-stone-50 dark:bg-stone-850/60 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FunctionSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
            {title || 'فرمول محاسباتی استاندارد (Mathematical Formula)'}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleCopyFormula}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1.5 min-h-[40px]"
            title="کپی فرمول ریاضی"
          >
            {copiedFormula ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFormula ? 'کپی شد' : 'کپی فرمول'}</span>
          </button>

          {calculationExecution.value !== null && (
            <button
              type="button"
              onClick={handleCopyResult}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors flex items-center gap-1.5 min-h-[40px]"
              title="کپی نتیجه عددی"
            >
              {copiedResult ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedResult ? 'کپی شد' : 'کپی نتیجه'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 5-Step Pipeline Structure */}
      <div className="p-4 sm:p-5 space-y-4 text-xs">
        {/* Step 1: فرمول اصلی (Formula) with KaTeX */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
            <span>گام ۱: رابطه ریاضی و فرمول مصوب (Formula)</span>
            <span className="font-mono text-[10px]">KaTeX Rendered</span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-stone-900 text-white dark:bg-black border border-stone-800 shadow-inner flex items-center justify-center overflow-x-auto min-h-[60px]">
            <KaTeXRenderer
              expression={mainFormulaLatex}
              displayMode={true}
              className="text-base sm:text-lg"
            />
          </div>

          {guidanceText && (
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed px-1">
              {guidanceText}
            </p>
          )}
        </div>

        {/* Pipeline Arrow */}
        <div className="flex justify-center text-stone-400">
          <ArrowDown className="w-4 h-4 text-emerald-600 animate-bounce" />
        </div>

        {/* Step 2: تعریف متغیرها + واحد هر متغیر + مقدار واردشده */}
        {variables.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700 dark:text-stone-300">
              <span>گام ۲: تعریف متغیرها، واحدها و مقادیر آزمون (Variables & Units)</span>
              {allowInputEdit && (
                <button
                  type="button"
                  onClick={handleResetInputs}
                  className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>بازنشانی پیش‌فرض</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
              <table className="w-full text-xs text-right border-collapse min-w-[480px]">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold border-b border-stone-200 dark:border-stone-800">
                  <tr>
                    <th className="p-2.5 text-center w-16">نماد</th>
                    <th className="p-2.5">شرح متغیر استاندارد</th>
                    <th className="p-2.5 text-center w-24">واحد</th>
                    <th className="p-2.5 text-center w-40">مقدار واردشده</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {variables.map((v) => {
                    const currentVal = inputs[v.symbol];
                    return (
                      <tr key={v.symbol} className="hover:bg-stone-50 dark:hover:bg-stone-850/50">
                        <td className="p-2.5 text-center">
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            {v.symbol}
                          </span>
                        </td>
                        <td className="p-2.5 text-stone-800 dark:text-stone-200">
                          <div>{v.name}</div>
                          {v.description && (
                            <span className="text-[10px] text-stone-400 block">{v.description}</span>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-mono text-[11px] text-stone-500">
                          {v.unit}
                        </td>
                        <td className="p-2 text-center">
                          {allowInputEdit ? (
                            <input
                              type="number"
                              step="any"
                              value={currentVal !== undefined ? currentVal : ''}
                              onChange={(e) => handleInputChange(v.symbol, e.target.value)}
                              placeholder={v.defaultValue !== undefined ? String(v.defaultValue) : '0.00'}
                              className="w-full px-3 py-2 min-h-[42px] rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs sm:text-sm font-mono text-center focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                            />
                          ) : (
                            <span className="font-mono font-bold text-stone-800 dark:text-stone-100">
                              {currentVal !== undefined ? currentVal : '-'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pipeline Arrow */}
        <div className="flex justify-center text-stone-400">
          <ArrowDown className="w-4 h-4 text-emerald-600 animate-bounce" />
        </div>

        {/* Step 3: جایگذاری اعداد در فرمول (Substitution) */}
        <div className="space-y-1.5">
          <div className="text-[11px] text-stone-500 font-semibold">
            گام ۳: جایگذاری مقادیر عددی در رابطه ریاضی (Substitution)
          </div>

          <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-center overflow-x-auto min-h-[50px]">
            <KaTeXRenderer
              expression={substitutedLatex}
              displayMode={true}
              className="text-sm sm:text-base text-stone-800 dark:text-stone-200 font-medium"
            />
          </div>
        </div>

        {/* Pipeline Arrow */}
        <div className="flex justify-center text-stone-400">
          <ArrowDown className="w-4 h-4 text-emerald-600 animate-bounce" />
        </div>

        {/* Step 4 & 5: محاسبه و نتیجه نهایی (Calculation Engine & Final Result) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Step 4: محاسبه */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-1.5">
            <span className="text-[11px] font-semibold text-stone-500 block">
              گام ۴: فرآیند محاسبه موتور ریاضی (Calculation)
            </span>
            <div className="font-mono text-xs text-stone-800 dark:text-stone-200 break-words leading-relaxed dir-ltr text-right">
              {calculationExecution.trace}
            </div>
          </div>

          {/* Step 5: نتیجه نهایی + واحد نتیجه */}
          <div className="p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/60 border-2 border-emerald-500/40 dark:border-emerald-600/50 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200">
                گام ۵: نتیجه نهایی (Final Result)
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                دقت {decimalPrecision} رقم اعشار
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-800 dark:text-emerald-300">
                {calculationExecution.formatted}
              </span>
              <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200 font-mono">
                {resultUnit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
