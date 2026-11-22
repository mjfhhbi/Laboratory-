import React, { useState } from 'react';
import { Copy, Check, FunctionSquare } from 'lucide-react';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface FormulaBlockProps {
  formula: string;
  isBlock?: boolean;
}

export const FormulaBlock: React.FC<FormulaBlockProps> = ({ formula, isBlock = true }) => {
  const [copied, setCopied] = useState(false);

  // Clean formula string from delimiter signs like $$ or $
  const cleanFormula = formula.replace(/^\$\$|\$\$$/g, '').replace(/^\$|\$$/g, '').trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanFormula);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (!isBlock) {
    return (
      <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 font-mono text-[11px]" dir="ltr">
        <KaTeXRenderer expression={cleanFormula} displayMode={false} className="inline" />
      </span>
    );
  }

  return (
    <div className="my-3 p-3 bg-stone-50/90 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 rounded-xl relative group shadow-2xs max-w-full overflow-hidden" dir="ltr">
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-stone-200/60 dark:border-stone-800/80 text-[10px] text-stone-500 dark:text-stone-400 font-sans">
        <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
          <FunctionSquare className="w-3.5 h-3.5" />
          <span>فرمول علمی / رابطه ریاضی (KaTeX)</span>
        </span>
        <button
          onClick={handleCopy}
          className="opacity-90 p-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-all flex items-center gap-1 min-h-[36px]"
          title="کپی فرمول"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] text-emerald-600">کپی شد</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[10px]">کپی</span>
            </>
          )}
        </button>
      </div>

      <div className="py-2 px-1 overflow-x-auto scrollbar-thin text-center text-sm sm:text-base text-stone-900 dark:text-stone-100 max-w-full">
        <KaTeXRenderer expression={cleanFormula} displayMode={true} />
      </div>
    </div>
  );
};
