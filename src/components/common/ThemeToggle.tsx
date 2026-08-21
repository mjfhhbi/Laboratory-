import React from 'react';
import { useTheme } from '../../lib/theme';
import { Sun, Moon, Laptop } from 'lucide-react';

interface ThemeToggleProps {
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { theme, setTheme, isDark, toggleTheme } = useTheme();

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        title={isDark ? 'تغییر به حالت روشن (Light Mode)' : 'تغییر به حالت تاریک (Dark Mode)'}
        aria-label="تغییر پوسته"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-stone-700" />
        )}
      </button>
    );
  }

  return (
    <div className="inline-flex items-center p-1 bg-stone-100 dark:bg-stone-800/80 rounded-lg border border-stone-200 dark:border-stone-700/60 text-xs">
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
          theme === 'light'
            ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
        }`}
        title="حالت روشن"
      >
        <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : ''}`} />
        <span className="hidden sm:inline">روشن</span>
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
          theme === 'dark'
            ? 'bg-stone-900 dark:bg-stone-700 text-white dark:text-stone-100 shadow-xs'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
        }`}
        title="حالت تاریک"
      >
        <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-indigo-400' : ''}`} />
        <span className="hidden sm:inline">تاریک</span>
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
          theme === 'system'
            ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
        }`}
        title="پیروی از سیستم عامل"
      >
        <Laptop className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">سیستم</span>
      </button>
    </div>
  );
};
