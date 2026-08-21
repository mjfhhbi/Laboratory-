import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../lib/routes';
import { IconHelper } from '../common/IconHelper';
import { X, Sparkles, FolderGit2, Activity, ChevronLeft } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const location = useLocation();

  const coreItems = NAVIGATION_ITEMS.filter((item) => item.category === 'core');
  const labItems = NAVIGATION_ITEMS.filter((item) => item.category === 'lab');
  const knowledgeItems = NAVIGATION_ITEMS.filter((item) => item.category === 'knowledge');
  const systemItems = NAVIGATION_ITEMS.filter((item) => item.category === 'system');

  const renderNavGroup = (title: string, items: typeof NAVIGATION_ITEMS) => (
    <div className="mb-5">
      <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-stone-400 dark:text-stone-500 uppercase">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${
                isActive
                  ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <IconHelper
                  name={item.iconName}
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-stone-500 dark:text-stone-400'
                  }`}
                />
                <span className="truncate">{item.title}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.englishTitle && (
                  <span
                    className={`text-[10px] font-mono ${
                      isActive
                        ? 'text-emerald-100 opacity-90'
                        : 'text-stone-400 dark:text-stone-500'
                    }`}
                    dir="ltr"
                  >
                    {item.englishTitle}
                  </span>
                )}
                {isActive && (
                  <ChevronLeft className="w-3.5 h-3.5 text-white/80" />
                )}
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-72 bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Brand header in sidebar */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <div className="font-bold text-stone-900 dark:text-stone-100 text-sm tracking-tight">Food Science AI</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">سامانه جامع صنایع غذایی</div>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200"
            aria-label="بستن منو"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {renderNavGroup('هسته اصلی و تعامل', coreItems)}
          {renderNavGroup('آزمایشگاه و آزمون‌ها', labItems)}
          {renderNavGroup('استانداردها و مراجع', knowledgeItems)}
          {renderNavGroup('پیکربندی سامانه', systemItems)}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/60 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300 font-semibold">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>معماری ماژولار</span>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              فاز ۲ از ۱۰
            </span>
          </div>

          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
            سیستم رابط کاربری، تم دارک/لایت و کارت‌های دسترسی سریع پیاده‌سازی شدند.
          </p>

          <div className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-800/80 flex items-center justify-between sm:hidden">
            <span className="text-xs text-stone-500 dark:text-stone-400">پوسته سامانه:</span>
            <ThemeToggle compact={false} />
          </div>
        </div>
      </aside>
    </>
  );
};
