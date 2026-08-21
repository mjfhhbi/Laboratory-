import React from 'react';
import { Link } from 'react-router-dom';
import { QuickAccessItem } from '../../types';
import { IconHelper } from './IconHelper';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface QuickAccessCardProps {
  item: QuickAccessItem;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ item }) => {
  // Color palette mappings for consistent themes in light and dark mode
  const colorStyles: Record<string, { bg: string; text: string; darkBg: string; darkText: string; borderHover: string }> = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700',
      text: 'text-emerald-700 dark:text-emerald-400',
      darkBg: 'dark:bg-emerald-950/60 dark:text-emerald-300',
      darkText: 'dark:text-emerald-400',
      borderHover: 'hover:border-emerald-500/80 dark:hover:border-emerald-500/60'
    },
    teal: {
      bg: 'bg-teal-50 text-teal-700',
      text: 'text-teal-700 dark:text-teal-400',
      darkBg: 'dark:bg-teal-950/60 dark:text-teal-300',
      darkText: 'dark:text-teal-400',
      borderHover: 'hover:border-teal-500/80 dark:hover:border-teal-500/60'
    },
    cyan: {
      bg: 'bg-cyan-50 text-cyan-700',
      text: 'text-cyan-700 dark:text-cyan-400',
      darkBg: 'dark:bg-cyan-950/60 dark:text-cyan-300',
      darkText: 'dark:text-cyan-400',
      borderHover: 'hover:border-cyan-500/80 dark:hover:border-cyan-500/60'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700',
      text: 'text-amber-700 dark:text-amber-400',
      darkBg: 'dark:bg-amber-950/60 dark:text-amber-300',
      darkText: 'dark:text-amber-400',
      borderHover: 'hover:border-amber-500/80 dark:hover:border-amber-500/60'
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-700',
      text: 'text-indigo-700 dark:text-indigo-400',
      darkBg: 'dark:bg-indigo-950/60 dark:text-indigo-300',
      darkText: 'dark:text-indigo-400',
      borderHover: 'hover:border-indigo-500/80 dark:hover:border-indigo-500/60'
    },
    blue: {
      bg: 'bg-blue-50 text-blue-700',
      text: 'text-blue-700 dark:text-blue-400',
      darkBg: 'dark:bg-blue-950/60 dark:text-blue-300',
      darkText: 'dark:text-blue-400',
      borderHover: 'hover:border-blue-500/80 dark:hover:border-blue-500/60'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-700',
      text: 'text-rose-700 dark:text-rose-400',
      darkBg: 'dark:bg-rose-950/60 dark:text-rose-300',
      darkText: 'dark:text-rose-400',
      borderHover: 'hover:border-rose-500/80 dark:hover:border-rose-500/60'
    },
    violet: {
      bg: 'bg-violet-50 text-violet-700',
      text: 'text-violet-700 dark:text-violet-400',
      darkBg: 'dark:bg-violet-950/60 dark:text-violet-300',
      darkText: 'dark:text-violet-400',
      borderHover: 'hover:border-violet-500/80 dark:hover:border-violet-500/60'
    }
  };

  const currentTheme = colorStyles[item.accentColor] || colorStyles.emerald;

  return (
    <Link
      to={item.path}
      className={`group relative bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs transition-all duration-200 flex flex-col justify-between hover:shadow-md ${currentTheme.borderHover}`}
    >
      <div>
        {/* Top bar with icon and tag */}
        <div className="flex items-center justify-between mb-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${currentTheme.bg} ${currentTheme.darkBg}`}
          >
            <IconHelper name={item.iconName} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {item.badge && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700/60">
                {item.badge}
              </span>
            )}
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="mb-2">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-[11px] font-mono text-stone-400 dark:text-stone-500 mt-0.5" dir="ltr">
            {item.englishTitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Footer link row */}
      <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
        <span className="font-mono text-[11px] text-stone-400 dark:text-stone-500" dir="ltr">
          {item.path}
        </span>
        <div className="flex items-center gap-1">
          <span>ورود به بخش</span>
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
