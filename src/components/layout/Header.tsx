import React from 'react';
import { Menu, Terminal, Calculator, FlaskConical } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { OnlineStatusBadge } from '../common/OnlineStatusBadge';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      {/* Right side: Mobile Menu Trigger & Brand Wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:outline-hidden"
          aria-label="باز کردن منوی ناوبری"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
            FS
          </div>
          <div>
            <span className="font-bold text-sm text-stone-900 dark:text-stone-100 tracking-tight">
              Food Science AI
            </span>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
              سامانه مهندسی و علوم صنایع غذایی
            </p>
          </div>
        </Link>
      </div>

      {/* Center shortcuts (desktop only for quick engineering actions) */}
      <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400">
        <Link
          to="/laboratory"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <FlaskConical className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>آزمایشگاه</span>
        </Link>
        <Link
          to="/calculations"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>محاسبات مهندسی</span>
        </Link>
        <Link
          to="/python"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>محیط Python</span>
        </Link>
      </div>

      {/* Left side: Network status & Theme switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        <OnlineStatusBadge showLabel={true} />

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

export default Header;
