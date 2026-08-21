import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'text', code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-stone-800 bg-[#16181d] text-stone-200 text-xs shadow-xs font-mono" dir="ltr">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1f232b] border-b border-stone-800/80 text-[11px] text-stone-400">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-stone-300 lowercase">{language || 'code'}</span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded hover:bg-stone-700/60 text-stone-300 hover:text-white transition-colors"
          title="کپی کردن کد"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-sans">کپی شد</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px] font-sans">کپی</span>
            </>
          )}
        </button>
      </div>

      {/* Code contents */}
      <div className="p-3.5 overflow-x-auto text-[12px] leading-relaxed text-emerald-300/90 selection:bg-emerald-800/60">
        <pre className="m-0 font-mono whitespace-pre">{code}</pre>
      </div>
    </div>
  );
};
