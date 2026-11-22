import React, { useState } from 'react';
import { LiteratureReviewItem } from '../../types/research';
import { BookOpen, ShieldCheck, ExternalLink, Plus, Trash2, Edit3, AlertCircle } from 'lucide-react';

interface LiteratureReviewTableProps {
  items: LiteratureReviewItem[];
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
  onOpenAiFinder: () => void;
  readOnly?: boolean;
}

export const LiteratureReviewTable: React.FC<LiteratureReviewTableProps> = ({
  items,
  onAddItem,
  onDeleteItem,
  onOpenAiFinder,
  readOnly = false
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50/50 dark:bg-stone-850/50">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              ماتریس پیشینه پژوهش (Literature Review Matrix)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {items.length} منبع
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            جدول ساختاریافته تحلیل مقالات داوری‌شده و استانداردهای رسمی مرتبط با موضوع پایان‌نامه
          </p>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenAiFinder}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>یافتن منابع مستند (AI)</span>
            </button>
            <button
              onClick={onAddItem}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ثبت دستی منبع</span>
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center">
          <BookOpen className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
          <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
            هنوز مرجعی در ماتریس پیشینه پژوهش ثبت نشده است.
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
            می‌توانید با دکمه «یافتن منابع مستند»، پایگاه استانداردهای ملی و مقالات معتبر سامانه را جستجو نموده و با یک کلیک به جدول پیشینه بیافزایید.
          </p>
          {!readOnly && (
            <button
              onClick={onOpenAiFinder}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              جستجوی منابع معتبر در مخزن
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 font-bold">
                <th className="py-2.5 px-3 w-1/4">عنوان و نویسندگان / استاندارد</th>
                <th className="py-2.5 px-3">سال</th>
                <th className="py-2.5 px-3">ماتریکس غذایی</th>
                <th className="py-2.5 px-3">متدولوژی و روش آزمون</th>
                <th className="py-2.5 px-3">یافته‌های کلیدی</th>
                <th className="py-2.5 px-3">محدودیت‌ها</th>
                <th className="py-2.5 px-3 w-16 text-center">وضعیت</th>
                {!readOnly && <th className="py-2.5 px-3 w-12 text-center">عملیات</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {items.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 align-top font-medium">
                      <div className="text-stone-900 dark:text-stone-100 font-semibold leading-relaxed">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                        {item.authors && item.authors.length > 0 ? item.authors.join('، ') : 'موسسه استاندارد / مرجع'}
                      </div>
                      {item.doiOrStandardNo && (
                        <div className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded" dir="ltr">
                          {item.doiOrStandardNo}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 align-top font-mono text-stone-700 dark:text-stone-300">
                      {item.year}
                    </td>

                    <td className="py-3 px-3 align-top text-stone-800 dark:text-stone-200">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[11px]">
                        {item.foodMatrix || 'عمومی'}
                      </span>
                    </td>

                    <td className="py-3 px-3 align-top text-stone-700 dark:text-stone-300 leading-relaxed">
                      <div className={isExpanded ? '' : 'line-clamp-3'}>
                        {item.methodology || 'روش استاندارد آزمون'}
                      </div>
                    </td>

                    <td className="py-3 px-3 align-top text-stone-700 dark:text-stone-300 leading-relaxed">
                      <div className={isExpanded ? '' : 'line-clamp-3'}>
                        {item.findings || 'یافته‌های کلیدی استخراج‌شده'}
                      </div>
                    </td>

                    <td className="py-3 px-3 align-top text-stone-600 dark:text-stone-400 leading-relaxed">
                      <div className={isExpanded ? '' : 'line-clamp-2'}>
                        {item.limitations || 'نقطه ضعف یا محدودیت قید نشده'}
                      </div>
                      {((item.methodology && item.methodology.length > 100) ||
                        (item.findings && item.findings.length > 100)) && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline mt-1 font-semibold"
                        >
                          {isExpanded ? 'بستن' : 'نمایش کامل'}
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-3 align-top text-center">
                      {item.isVerifiedAuthentic ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          title="مرجع واقعی تاییدشده در رجیستری سامانه"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          مستند
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          title="نیازمند بررسی و صحه‌گذاری توسط کاربر"
                        >
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          دستی
                        </span>
                      )}
                    </td>

                    {!readOnly && (
                      <td className="py-3 px-3 align-top text-center">
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="حذف از جدول"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
