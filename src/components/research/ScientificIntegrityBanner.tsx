import React from 'react';
import { ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ScientificIntegrityBannerProps {
  className?: string;
  compact?: boolean;
}

export const ScientificIntegrityBanner: React.FC<ScientificIntegrityBannerProps> = ({
  className = '',
  compact = false
}) => {
  if (compact) {
    return (
      <div className={`p-2.5 rounded-lg border border-emerald-300/80 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 text-xs flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>پروتکل صیانت علمی:</strong> مراجع و استانداردهای این سامانه کاملاً واقعی هستند؛ از تولید منابع یا DOI ساختگی اکیداً خودداری می‌گردد.
          </span>
        </div>
        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
          تأیید اصالت مراجع
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs ${className}`}>
      <div className="bg-stone-100 dark:bg-stone-850 px-4 py-2.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
            منشور ممیزی و صحه‌گذاری علمی (Evidence Hub & Anti-Hallucination Guardrails)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
          <span>یکپارچه‌سازی ۳۰ از ۳۰</span>
        </div>
      </div>

      <div className="p-4 space-y-3 text-xs">
        {/* Golden Rule Alert */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>قانون طلایی:</strong> هوش مصنوعی هرگز نباید برای پر کردن جای خالی، شماره استاندارد، فرمول، عدد، دما، زمان، غلظت، حد پذیرش، Citation، DOI یا نتیجه آزمایش را جعل کند.
          </p>
        </div>

        {/* 3 Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/80">
            <div className="font-bold text-emerald-800 dark:text-emerald-300 text-xs mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تأییدشده رسمی (VERIFIED)</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
              اطلاعات مستقیماً توسط Source معتبر (استاندارد ملی، ایزو، AOAC، کدکس یا مرجع رسمی) پشتیبانی می‌شود.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/80">
            <div className="font-bold text-amber-800 dark:text-amber-300 text-xs mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>پشتیبانی‌شده (SUPPORTED)</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
              اطلاعات از منابع موجود پشتیبانی می‌شود اما نیاز به بررسی بیشتر و تطبیق شرایط عملیاتی دارد.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 border border-rose-300/80 dark:border-rose-800/80">
            <div className="font-bold text-rose-800 dark:text-rose-300 text-xs mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>فاقد منبع قطعی (UNVERIFIED)</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
              منبع کافی وجود ندارد و نباید به‌عنوان حقیقت قطعی یا استاندارد قانونی ملاک عمل قرار گیرد.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
