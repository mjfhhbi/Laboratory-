import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../lib/routes';
import { IconHelper } from '../common/IconHelper';
import { X, ChevronDown, ChevronLeft, HardDrive, Shield } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { NavItem } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const location = useLocation();

  // Track expanded state for items with sub-menus
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Auto-expand parents when on one of their sub-routes
  useEffect(() => {
    const newExpanded: Record<string, boolean> = { ...expandedItems };
    NAVIGATION_ITEMS.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        const isChildActive = item.subItems.some(
          (sub) => location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`)
        );
        const isParentActive = location.pathname === item.path;
        if (isChildActive || isParentActive) {
          newExpanded[item.id] = true;
        }
      }
    });
    setExpandedItems(newExpanded);
  }, [location.pathname]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-72 bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              FS
            </div>
            <div>
              <div className="font-bold text-stone-900 dark:text-stone-100 text-sm tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                Food Science AI
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                سامانه مهندسی و علوم غذایی
              </div>
            </div>
          </NavLink>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            aria-label="بستن منو"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10 Primary Navigation Items List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            ارکان تخصصی سامانه
          </div>

          {NAVIGATION_ITEMS.map((item) => {
            const hasSub = item.subItems && item.subItems.length > 0;
            const isDirectActive = location.pathname === item.path;
            const isChildActive = hasSub && item.subItems!.some(
              (sub) => location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`)
            );
            const isHighlighted = isDirectActive || (hasSub && isChildActive);
            const isExpanded = !!expandedItems[item.id];

            return (
              <div key={item.id} className="space-y-0.5">
                <div className="flex items-center">
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      if (!hasSub) {
                        onCloseMobile();
                      }
                    }}
                    className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      isHighlighted
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconHelper
                        name={item.iconName}
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isHighlighted
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.englishTitle && (
                        <span
                          className={`text-[10px] font-mono hidden sm:inline ${
                            isHighlighted
                              ? 'text-emerald-700/80 dark:text-emerald-300/80'
                              : 'text-stone-400 dark:text-stone-500'
                          }`}
                          dir="ltr"
                        >
                          {item.englishTitle.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </NavLink>

                  {/* Accordion expand toggle button for items with sub-menus */}
                  {hasSub && (
                    <button
                      onClick={(e) => toggleExpand(item.id, e)}
                      className={`p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0 ${
                        isExpanded ? 'text-stone-700 dark:text-stone-200' : ''
                      }`}
                      aria-label={`تغییر وضعیت زیرمنوی ${item.title}`}
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Sub-items list */}
                {hasSub && isExpanded && (
                  <div className="pr-7 pl-2 py-1 space-y-0.5 border-r border-stone-200 dark:border-stone-800 mr-4">
                    {item.subItems!.map((sub) => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <NavLink
                          key={sub.id}
                          to={sub.path}
                          onClick={onCloseMobile}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                            isSubActive
                              ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/80 dark:hover:bg-stone-800/80 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {sub.iconName && (
                              <IconHelper
                                name={sub.iconName}
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSubActive ? 'text-white' : 'text-stone-400 dark:text-stone-500'
                                }`}
                              />
                            )}
                            <span className="truncate">{sub.title}</span>
                          </div>
                          {isSubActive && (
                            <ChevronLeft className="w-3 h-3 text-white/80 shrink-0" />
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Minimalist Sidebar Footer */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 shrink-0 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 px-1">
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-stone-400" />
              <span>پایگاه محلی IndexedDB</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400" dir="ltr">
              Active
            </span>
          </div>

          <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between sm:hidden">
            <span className="text-xs text-stone-500 dark:text-stone-400">پوسته:</span>
            <ThemeToggle compact={false} />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
