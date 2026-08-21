import React from 'react';
import { Menu, Sparkles, Search } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { OnlineStatusBadge } from '../common/OnlineStatusBadge';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      {/* Right side: Mobile Menu Trigger & Logo / App Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:outline-hidden"
          aria-label="باز کردن منوی ناوبری"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
            <Sparkles className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100 tracking-tight">
                Food Science AI
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800/60">
                UI v2.0
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden md:block">
              سامانه هوشمند علوم، مهندسی و کنترل کیفیت صنایع غذایی
            </p>
          </div>
        </Link>
      </div>

      {/* Left side: Online/Offline status, Theme toggle & actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time Online / Offline status badge */}
        <OnlineStatusBadge showLabel={true} />

        {/* Theme mode switcher (Light / Dark / System) */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        <div className="sm:hidden">
          <ThemeToggle compact={true} />
        </div>
      </div>
    </header>
  );
};
