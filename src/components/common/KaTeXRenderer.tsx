import React, { useMemo } from 'react';
import katex from 'katex';

interface KaTeXRendererProps {
  expression: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Converts common scientific text formula syntax to valid LaTeX for KaTeX
 */
export function formatToLaTeX(expr: string): string {
  if (!expr) return '';
  let s = expr.trim();

  // If already full LaTeX (contains \frac, \times, etc.), return as is
  if (s.includes('\\frac') || s.includes('\\times') || s.includes('\\sum')) {
    return s;
  }

  // Replace common multiplication symbols * with \times
  s = s.replace(/\s*\*\s*/g, ' \\times ');

  // Handle simple A / B division into \frac{A}{B}
  // e.g., (A) / (B) or (A) / B or A / B
  const divMatch = s.match(/^(.+?)\s*\/\s*(.+)$/);
  if (divMatch && !s.includes('\\frac')) {
    let num = divMatch[1].trim();
    let den = divMatch[2].trim();

    // strip outer parens
    if (num.startsWith('(') && num.endsWith(')')) {
      num = num.slice(1, -1).trim();
    }
    if (den.startsWith('(') && den.endsWith(')')) {
      den = den.slice(1, -1).trim();
    }

    // Convert internal * in num/den
    num = num.replace(/\s*\*\s*/g, ' \\times ');
    den = den.replace(/\s*\*\s*/g, ' \\times ');

    s = `\\frac{${num}}{${den}}`;
  }

  // Handle sub indexes e.g., m0 -> m_0, m1 -> m_1, m2 -> m_2, n1 -> n_1, n2 -> n_2
  s = s.replace(/\b([a-zA-Z])([0-9])\b/g, '$1_{$2}');

  // Handle greek letters
  s = s.replace(/\bmu\b/g, '\\mu ');
  s = s.replace(/\bsigma\b/g, '\\sigma ');
  s = s.replace(/\bDelta\b/g, '\\Delta ');

  return s;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({
  expression,
  displayMode = true,
  className = ''
}) => {
  const html = useMemo(() => {
    try {
      const latex = formatToLaTeX(expression);
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode
      });
    } catch (err) {
      console.warn('KaTeX render error:', err);
      return `<span class="katex-error font-mono">${expression}</span>`;
    }
  }, [expression, displayMode]);

  return (
    <div
      className={`katex-math-wrapper max-w-full w-full overflow-x-auto overflow-y-hidden py-1 px-1 scrollbar-thin text-stone-900 dark:text-stone-100 select-text ${className}`}
      dir="ltr"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
