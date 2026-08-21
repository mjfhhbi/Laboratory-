import React from 'react';
import {
  Sparkles,
  FlaskConical,
  Flame,
  ShieldCheck,
  Binary,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';

interface ChatEmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

interface CapabilityCard {
  title: string;
  description: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}

const CARDS: CapabilityCard[] = [
  {
    title: 'فرمولاسیون و پایدارسازی امولسیون',
    description: 'طراحی فرمولاسیون سس مایونز کم‌چرب با قوام‌دهنده‌های هیدروکلوئیدی و نشاسته اصلاح‌شده',
    prompt: 'لطفاً فرمولاسیون استاندارد سس مایونز کم‌چرب با استفاده از صمغ زانتان و نشاسته اصلاح‌شده را همراه با درصدهای دقیق و ترتیب اختلاط شرح دهید.',
    icon: FlaskConical,
    badge: 'فرمولاسیون R&D'
  },
  {
    title: 'محاسبات فرآوری حرارتی و پاستوریزاسیون',
    description: 'محاسبه سینتیک مرگ حرارتی (D-Value, z-Value, F0) برای شیر و فرآورده‌های غذایی',
    prompt: 'معادلات محاسبه D-Value، z-Value و ارزش استریلیزاسیون F0 برای فرآیند پاستوریزاسیون مداوم شیر (HTST) را با مثال عددی توضیح دهید.',
    icon: Flame,
    badge: 'مهندسی فرآیند'
  },
  {
    title: 'فعالیت آبی (aw) و ماندگاری محصول',
    description: 'بررسی آستانه رشد میکروارگانیسم‌ها، ایزوترم جذب رطوبت GAB و پیش‌بینی فساد',
    prompt: 'حدود بحرانی فعالیت آبی (aw) برای مهار باکتری‌های پاتوژن و کپک‌های اسموفیل چیست و معادله GAB چگونه رطوبت تعادلی را پیش‌بینی می‌کند؟',
    icon: Binary,
    badge: 'شیمی و ماندگاری'
  },
  {
    title: 'استانداردهای ملی INSO و آزمون‌های QC',
    description: 'ویژگی‌های میکروبیولوژیک، روش‌های تیتراسیون اسیدیته و حدود مجاز فلزات سنگین',
    prompt: 'روش اندازه‌گیری اسیدیته قابل تیتر (TA) بر اساس استاندارد AOAC 942.15 و استانداردهای ملی شیر خام و پاستوریزه چیست؟',
    icon: ShieldCheck,
    badge: 'استاندارد و QC'
  }
];

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-3xl mx-auto my-auto text-center space-y-6">
      {/* Brand & Welcome Hero */}
      <div className="space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md border border-emerald-600">
          <Sparkles className="w-7 h-7 text-emerald-200" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
            دستیار هوشمند مهندسی و علوم صنایع غذایی
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            سیستم تخصصی پاسخ‌گویی به سوالات فرمولاسیون، محاسبات مهندسی، استانداردهای ملی و ارزیابی کیفیت با ذخیره‌سازی دائمی پیام‌ها در IndexedDB
          </p>
        </div>
      </div>

      {/* Suggested Topic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-right">
        {CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(card.prompt)}
              className="p-3.5 bg-white dark:bg-stone-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-emerald-500/80 transition-all text-right group flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 group-hover:text-emerald-800 dark:group-hover:text-emerald-200 transition-colors">
                    {card.badge}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <h4 className="font-bold text-xs text-stone-800 dark:text-stone-200">
                    {card.title}
                  </h4>
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
                  {card.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-center gap-2">
        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
        <span>امکان تحلیل فرمول‌ها، نمایش روابط ریاضی و استانداردهای INSO / Codex</span>
      </div>
    </div>
  );
};
