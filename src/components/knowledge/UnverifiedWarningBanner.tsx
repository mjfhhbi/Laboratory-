import React from 'react';
import { AlertCircle, ShieldAlert, BookOpen } from 'lucide-react';
import { VerificationStatus } from '../../types/knowledgeBase';

interface UnverifiedWarningBannerProps {
  status: VerificationStatus;
  sourcesCount: number;
  className?: string;
  onAddSourceClick?: () => void;
}

export const UnverifiedWarningBanner: React.FC<UnverifiedWarningBannerProps> = ({
  status,
  sourcesCount,
  className = '',
  onAddSourceClick
}) => {
  if (status === 'official_regulatory' || (status === 'verified_with_source' && sourcesCount > 0)) {
    return null;
  }

  return (
    <div
      className={`p-3.5 rounded-xl border bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/70 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3 shadow-2xs ${className}`}
      role="alert"
    >
      <div className="p-1 rounded-lg bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
        <ShieldAlert className="w-4 h-4" />
      </div>

      <div className="flex-1 space-y-1">
        <div className="font-bold text-xs flex items-center gap-1.5">
          <span>عدم احراز استناد قطعی (فاقد منبع مستند تاییدشده)</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/90">
          مطابق اصول علمی و الزامات هوش مصنوعی صنایع غذایی، این رکورد هنوز به منبع رسمی (استاندارد ملی، کدکس، ژورنال داوری‌شده یا کتاب مرجع) متصل نشده است و{' '}
          <strong>نباید به عنوان حقیقت علمی قطعی یا مبنای صدور گواهی کیفی لحاظ گردد.</strong>
        </p>

        {onAddSourceClick && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onAddSourceClick}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition-colors"
            >
              <BookOpen className="w-3 h-3" />
              <span>اتصال و ثبت منبع علمی</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
