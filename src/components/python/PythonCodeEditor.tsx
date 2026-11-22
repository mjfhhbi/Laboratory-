import React, { useRef, useEffect } from 'react';

interface PythonCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  errorLine?: number;
  readOnly?: boolean;
}

export const PythonCodeEditor: React.FC<PythonCodeEditorProps> = ({
  code,
  onChange,
  onRun,
  errorLine,
  readOnly = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Sync scroll between textarea and line numbers rail
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Keyboard enhancements: Tab for indentation, Ctrl+Enter to run
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun?.();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert 4 spaces
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-stone-900 text-stone-100 rounded-xl border border-stone-800 overflow-hidden shadow-xs focus-within:border-emerald-600 transition-colors">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-950/80 border-b border-stone-800 text-[11px] font-mono text-stone-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
          <span className="text-stone-300 font-semibold" dir="ltr">script.py</span>
          <span>·</span>
          <span>{lineCount} خط</span>
        </div>
        <div className="flex items-center gap-2" dir="ltr">
          <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-[10px] text-stone-300">
            Ctrl + Enter
          </kbd>
          <span className="text-[10px] text-stone-500">جهت اجرا</span>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-xs" dir="ltr">
        {/* Line Numbers Rail */}
        <div
          ref={lineNumbersRef}
          className="w-12 py-3 bg-stone-950/60 border-r border-stone-800/80 select-none overflow-hidden text-right pr-2 pl-1 font-mono text-stone-600 text-[11px] leading-6"
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }, (_, i) => {
            const lineNum = i + 1;
            const isError = errorLine === lineNum;
            return (
              <div
                key={lineNum}
                className={`h-6 ${isError ? 'text-rose-400 font-bold bg-rose-950/40' : ''}`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Textarea Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 p-3 bg-transparent text-stone-100 placeholder-stone-600 resize-none focus:outline-hidden leading-6 font-mono text-xs whitespace-pre overflow-auto selection:bg-emerald-900/60 selection:text-white"
          placeholder="# کدهای پایتون را اینجا بنویسید یا یک نمونه مهندسی انتخاب کنید..."
        />
      </div>

      {/* Editor Footer / Quick Specs */}
      <div className="px-4 py-1.5 bg-stone-950/90 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono text-stone-500 select-none">
        <div className="flex items-center gap-3">
          <span>Python 3.12 (Pyodide WebAssembly)</span>
          <span>·</span>
          <span>UTF-8</span>
        </div>
        <div>
          <span>{code.length} کاراکتر</span>
        </div>
      </div>
    </div>
  );
};
