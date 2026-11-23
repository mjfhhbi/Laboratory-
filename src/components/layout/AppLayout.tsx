import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ThemeProvider } from '../../lib/theme';
import { OfflineAlertBanner } from '../common/OfflineAlertBanner';

import { SectionSubNav } from './SectionSubNav';
import { DialogHost } from '../common/DialogProvider';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayoutInner: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex transition-colors duration-150" dir="rtl">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-72 transition-all duration-200">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <OfflineAlertBanner />
          <SectionSubNav />
          {children}
        </main>

        <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-4 px-6 text-xs text-stone-500 dark:text-stone-400 transition-colors">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>سامانه Food Science AI &copy; {new Date().getFullYear()} — بستر تخصصی مهندسی، کنترل کیفیت و پژوهش صنایع غذایی</span>
            <span className="font-mono text-stone-400 dark:text-stone-500" dir="ltr">
              PWA & Offline Architecture
            </span>
          </div>
        </footer>
      </div>
      <DialogHost />
    </div>
  );
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </ThemeProvider>
  );
};
