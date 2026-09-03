/**
 * GHS Pictogram and Hazard Badge Component
 * Food Science AI Lab Suite - Part 13
 */

import React from 'react';
import { GhsPictogramCode, GHS_PICTOGRAM_META } from '../../types/chemicalReagent';
import {
  Flame,
  Skull,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Layers,
  Leaf,
  Activity
} from 'lucide-react';

interface GhsBadgeProps {
  code: GhsPictogramCode;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const GhsBadge: React.FC<GhsBadgeProps> = ({
  code,
  size = 'md',
  showLabel = false
}) => {
  const meta = GHS_PICTOGRAM_META[code];
  if (!meta) return null;

  const renderIcon = () => {
    const iconClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';

    switch (code) {
      case 'GHS01': // Explosive
        return <Zap className={`${iconClass} text-orange-600 dark:text-orange-400`} />;
      case 'GHS02': // Flammable
        return <Flame className={`${iconClass} text-red-600 dark:text-red-400`} />;
      case 'GHS03': // Oxidizer
        return <Flame className={`${iconClass} text-amber-600 dark:text-amber-400`} />;
      case 'GHS04': // Compressed Gas
        return <Activity className={`${iconClass} text-sky-600 dark:text-sky-400`} />;
      case 'GHS05': // Corrosive
        return <Layers className={`${iconClass} text-rose-600 dark:text-rose-400`} />;
      case 'GHS06': // Acute Toxic
        return <Skull className={`${iconClass} text-purple-600 dark:text-purple-400`} />;
      case 'GHS07': // Harmful / Irritant
        return <AlertTriangle className={`${iconClass} text-amber-600 dark:text-amber-400`} />;
      case 'GHS08': // Health Hazard
        return <ShieldAlert className={`${iconClass} text-blue-600 dark:text-blue-400`} />;
      case 'GHS09': // Environmental
        return <Leaf className={`${iconClass} text-emerald-600 dark:text-emerald-400`} />;
      default:
        return <AlertTriangle className={`${iconClass} text-stone-600`} />;
    }
  };

  const badgePadding = size === 'sm' ? 'p-1' : size === 'lg' ? 'p-2' : 'p-1.5';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border bg-white dark:bg-stone-900 shadow-2xs border-stone-200 dark:border-stone-800 transition-transform hover:scale-105 ${badgePadding}`}
      title={`${code}: ${meta.nameFa} (${meta.nameEn}) - ${meta.description}`}
    >
      <div className="flex items-center justify-center">
        {renderIcon()}
      </div>
      {showLabel && (
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 leading-tight">
            {meta.nameFa}
          </span>
          <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500">
            {code}
          </span>
        </div>
      )}
    </div>
  );
};
