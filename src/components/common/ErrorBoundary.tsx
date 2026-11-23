import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'خطای غیرمنتظره در رندر صفحه رخ داد.'
    };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Food Science AI ErrorBoundary caught:', error, info);
  }

  private handleRecoverHome = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (typeof window !== 'undefined') {
      window.location.assign('/');
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-[60vh] flex items-center justify-center p-6"
          dir="rtl"
        >
          <div className="max-w-lg w-full bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-800 rounded-2xl p-6 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                بروز خطای غیرمنتظره در نمایش این بخش
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                داده‌های ذخیره‌شده شما در پایگاه محلی IndexedDB ایمن هستند. می‌توانید این بخش را مجدداً بارگذاری کنید یا به صفحه اصلی بازگردید.
              </p>
              {this.state.errorMessage && (
                <pre
                  className="mt-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800 text-[11px] font-mono text-rose-700 dark:text-rose-300 text-left overflow-x-auto"
                  dir="ltr"
                >
                  {this.state.errorMessage}
                </pre>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleRetry}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تلاش مجدد</span>
              </button>
              <button
                type="button"
                onClick={this.handleRecoverHome}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>بازگشت به داشبورد</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
