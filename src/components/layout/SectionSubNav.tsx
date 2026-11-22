import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../lib/routes';
import { IconHelper } from '../common/IconHelper';

export const SectionSubNav: React.FC = () => {
  const location = useLocation();

  // Find if current path is a sub-item or parent of an item that has sub-items
  const activeParent = NAVIGATION_ITEMS.find((item) => {
    if (!item.subItems || item.subItems.length === 0) return false;
    if (location.pathname === item.path) return true;
    return item.subItems.some(
      (sub) => location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`)
    );
  });

  if (!activeParent || !activeParent.subItems) {
    return null;
  }

  return (
    <div className="mb-6 -mt-2">
      <div className="flex items-center gap-1 p-1 bg-stone-100/90 dark:bg-stone-800/80 rounded-xl border border-stone-200/80 dark:border-stone-700/60 overflow-x-auto no-scrollbar">
        {activeParent.subItems.map((sub) => {
          const isActive = location.pathname === sub.path;
          return (
            <NavLink
              key={sub.id}
              to={sub.path}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-700/50 font-medium'
              }`}
            >
              {sub.iconName && (
                <IconHelper
                  name={sub.iconName}
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-stone-400 dark:text-stone-500'
                  }`}
                />
              )}
              <span>{sub.title}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default SectionSubNav;
