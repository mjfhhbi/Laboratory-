import React from 'react';
import { IconHelper } from './IconHelper';

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  iconName: string;
  statusVariant?: 'emerald' | 'blue' | 'amber' | 'stone';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  iconName,
  statusVariant = 'stone'
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50',
    blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/50',
    amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50',
    stone: 'bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-700/60'
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
          {label}
        </span>
        <div className={`p-2 rounded-lg border ${variantStyles[statusVariant]}`}>
          <IconHelper name={iconName} className="w-4 h-4" />
        </div>
      </div>
      <div className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
        {value}
      </div>
      {subtext && (
        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono">
          {subtext}
        </div>
      )}
    </div>
  );
};
