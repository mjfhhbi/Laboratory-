import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface StandardMathFormulaProps {
  content: string;
  block?: boolean;
  className?: string;
}

/**
 * Renders LaTeX formulas using KaTeX safely.
 * Supports inline $...$ or block $$...$$ formulas or pure raw LaTeX strings.
 */
export const StandardMathFormula: React.FC<StandardMathFormulaProps> = ({
  content,
  block = false,
  className = ''
}) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // If pure LaTeX string without delimiters and block is set
    if (!content.includes('$')) {
      try {
        return katex.renderToString(content, {
          displayMode: block,
          throwOnError: false,
          output: 'html'
        });
      } catch (err) {
        console.warn('KaTeX render error:', err);
        return content;
      }
    }

    // Process mixed text containing $...$ (inline) and $$...$$ (block)
    const blockRegex = /\$\$([\s\S]*?)\$\$/g;
    const inlineRegex = /\$([^\$\n]+?)\$/g;

    let processed = content.replace(blockRegex, (_, math) => {
      try {
        return `<div class="my-2 overflow-x-auto py-1 text-center font-serif text-stone-900 dark:text-stone-100" dir="ltr">${katex.renderToString(
          math.trim(),
          { displayMode: true, throwOnError: false }
        )}</div>`;
      } catch {
        return `$$${math}$$`;
      }
    });

    processed = processed.replace(inlineRegex, (_, math) => {
      try {
        return `<span class="inline-block px-1 font-serif text-stone-900 dark:text-stone-100" dir="ltr">${katex.renderToString(
          math.trim(),
          { displayMode: false, throwOnError: false }
        )}</span>`;
      } catch {
        return `$${math}$`;
      }
    });

    return processed;
  }, [content, block]);

  return (
    <div
      className={`font-sans leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
