/**
 * Chemical Safety Guide and GLP Incompatibility Matrix Component
 * Food Science AI Lab Suite - Part 13
 */

import React from 'react';
import { GHS_PICTOGRAM_META, GhsPictogramCode } from '../../types/chemicalReagent';
import { GhsBadge } from './GhsBadge';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  HeartPulse,
  Droplets,
  Layers,
  Sparkles,
  BookOpen,
  Info,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const ChemicalSafetyGuide: React.FC = () => {
  const allGhs: GhsPictogramCode[] = ['GHS01', 'GHS02', 'GHS03', 'GHS04', 'GHS05', 'GHS06', 'GHS07', 'GHS08', 'GHS09'];

  return (
    <div className="space-y-6">
      {/* Golden Rules Banner */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          <span>قوانین طلایی ایمنی و کنترل ریسک در آزمایشگاه شیمی و صنایع غذایی</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-800/80 space-y-1">
            <div className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
              <Droplets className="w-4 h-4" />
              <span>قانون اسید به آب (AAA Rule)</span>
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              <strong>همیشه اسید را به آب اضافه کنید، نه برعکس!</strong> ریختن آب روی اسید غلیظ (به‌ویژه اسید سولفوریک) موجب جوشش موضعی آنی و پرتاب قطرات سوزاننده اسید می‌شود.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-800/80 space-y-1">
            <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>کار الزامی زیر هود شیمیایی (Fume Hood)</span>
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              برداشت کلیه اسیدهای فرار (HCl، اسید نیتریک)، حلال‌های آلی (اتر دوپترول، اتانول، ایزوآمیل الکل) باید زیر هود با مکش فعال انجام گیرد.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-800/80 space-y-1">
            <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>الزام استناد SDS و برچسب‌گذاری</span>
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              هیچ ظرف ماده یا محلولی بدون برچسب کامل، غلظت، فاکتور، تاریخ ساخت و نام کارشناس نباید در آزمایشگاه نگهداری شود.
            </p>
          </div>
        </div>
      </div>

      {/* GHS System Reference Cards */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs p-6 space-y-4">
        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>راهنمای جامع پیکتوگرام‌های بین‌المللی GHS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {allGhs.map((code) => {
            const meta = GHS_PICTOGRAM_META[code];
            return (
              <div key={code} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-start gap-3">
                <GhsBadge code={code} size="lg" />
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-stone-900 dark:text-stone-100">{meta.nameFa}</div>
                  <div className="text-[10px] text-stone-500 font-mono" dir="ltr">{code} • {meta.nameEn}</div>
                  <div className="text-stone-600 dark:text-stone-300 text-[11px] leading-snug">{meta.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chemical Incompatibility Matrix */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs p-6 space-y-4">
        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-600" />
          <span>ماتریس عدم سازگاری مواد شیمیایی (Chemical Incompatibility SOP)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300">
                <th className="p-3 font-bold">گروه شیمیایی ماده</th>
                <th className="p-3 font-bold">مواد به شدت ناسازگار (اجتناب از تماس و نگهداری مشترک)</th>
                <th className="p-3 font-bold">پیامد خطرناک واکنش</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
              <tr>
                <td className="p-3 font-bold text-rose-700 dark:text-rose-400">اسیدهای معدنی قوی (سولفوریک، کلریدریک، نیتریک)</td>
                <td className="p-3">بازهای قوی (سود، پتاس)، فلزات فعال، سیانیدها، سولفیدها، حلال‌های آلی</td>
                <td className="p-3 text-stone-600 dark:text-stone-400">واکنش شدید گرمازا، پاشش، تولید گازهای سمی یا قابل اشتعال</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-700 dark:text-amber-400">اکسیدکننده‌های قوی (پرمنگنات پتاسیم، دی‌کرومات)</td>
                <td className="p-3">حلال‌های آلی (الکل‌ها، اترها)، اسیدهای آلی، گوگرد، مواد احیاکننده</td>
                <td className="p-3 text-stone-600 dark:text-stone-400">آتش‌سوزی آنی، انفجار سریع</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-indigo-700 dark:text-indigo-400">حلال‌های آلی فرار (اتر نفت، اتانول)</td>
                <td className="p-3">اکسیدان‌ها، شعله مستقیم، بارهای الکترواستاتیک، اسید نیتریک</td>
                <td className="p-3 text-stone-600 dark:text-stone-400">اشتعال سریع و ایجاد اتمسفر انفجاری</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">نمک‌های نقره (نیترات نقره)</td>
                <td className="p-3">آمونیاک و بازهای قوی در مجاورت الکل، هالوژن‌ها، نور مستقیم</td>
                <td className="p-3 text-stone-600 dark:text-stone-400">تشکیل رسوبات حساس به شوک (فولمینات نقره) و لکه‌گذاری</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
