import React from 'react';
import { Layers, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  moduleTitle: string;
  moduleEnglish: string;
  description: string;
  partNumber?: number;
  plannedFeatures?: string[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  moduleTitle,
  moduleEnglish,
  description,
  plannedFeatures = []
}) => {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-8 shadow-xs">
      <div className="max-w-2xl mx-auto text-center py-6">
        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-800/60">
          <Layers className="w-7 h-7" />
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-full mb-3 border border-stone-200 dark:border-stone-700/60">
          <span>اسکلت ماژولار UI</span>
          <span>•</span>
          <span>قسمت ۲ از ۱۰</span>
        </div>

        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          ماژول {moduleTitle}
        </h2>
        <p className="text-sm font-mono text-stone-500 dark:text-stone-400 mb-4" dir="ltr">
          {moduleEnglish}
        </p>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
          {description}
        </p>

        {plannedFeatures.length > 0 && (
          <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-5 border border-stone-200/80 dark:border-stone-700/60 text-right mb-6">
            <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-3">
              قابلیت‌های برنامه‌ریزی‌شده برای فازهای بعدی:
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-400">
              {plannedFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <span>بازگشت به داشبورد</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
