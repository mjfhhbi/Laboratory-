import React, { useState } from 'react';
import { ShieldCheck, X, Search, BookOpen, Plus, Check, AlertTriangle, ExternalLink } from 'lucide-react';
import { FoodResearchCategory, LiteratureReviewItem } from '../../types/research';
import { findAuthenticLiteratureSources, LiteratureSearchMatch } from '../../lib/research/researchAiEngine';

interface AiLiteratureFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: FoodResearchCategory;
  defaultKeywords?: string[];
  onAddLiteratureItem: (item: LiteratureReviewItem) => void;
}

export const AiLiteratureFinderModal: React.FC<AiLiteratureFinderModalProps> = ({
  isOpen,
  onClose,
  category,
  defaultKeywords = [],
  onAddLiteratureItem
}) => {
  const [keywordInput, setKeywordInput] = useState(defaultKeywords.join(' '));
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<LiteratureSearchMatch[]>([]);
  const [searched, setSearched] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const keywords = keywordInput
        .split(/[\s,،]+/)
        .map((k) => k.trim())
        .filter(Boolean);
      const results = await findAuthenticLiteratureSources(category, keywords);
      setMatches(results);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (match: LiteratureSearchMatch) => {
    const s = match.source;
    const reviewItem: LiteratureReviewItem = {
      id: 'lit-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      sourceId: s.id,
      title: s.title,
      authors: s.authors && s.authors.length > 0 ? s.authors : [s.authorOrOrganization],
      year: s.year,
      sourceType: s.sourceType,
      doiOrStandardNo: s.standardNumber || s.doi || undefined,
      foodMatrix: s.tags?.[0] || 'صنایع غذایی',
      methodology: s.notes || s.editionOrVersion || 'روش آزمون استاندارد ثبت‌شده',
      findings: s.notes || 'شاخص‌ها و استانداردهای مصوب آزمون',
      isVerifiedAuthentic: true,
      citationText: match.suggestedCitation
    };

    onAddLiteratureItem(reviewItem);
    setAddedIds((prev) => new Set(prev).add(s.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  موتور بازیابی مقالات و استانداردهای مستند
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  تضمین عدم توهم (No Hallucination)
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                جستجوی مستقیم در مخزن مراجع معتبر سامانه (استانداردهای INSO، ISO، AOAC و کتاب‌های مرجع)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anti-Hallucination Warning Banner */}
        <div className="px-5 py-2.5 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200/80 dark:border-amber-800/80 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>خط‌مشی صداقت علمی:</strong> سیستم تنها اسناد حقیقی ذخیره‌شده در رجیستری را استخراج می‌کند. ساخت استنادات جعلی یا شناسه‌های DOI خیالی توسط هوش مصنوعی در این بخش به طور کامل مسدود شده است.
          </span>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3 top-3 text-stone-400" />
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="کلیدواژه‌ها (مثال: نیتریت، پراکسید، ماست پروبیوتیک، پکتین، کیتوزان)..."
                className="w-full pr-9 pl-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'در حال بازیابی...' : 'بازیابی اسناد'}</span>
            </button>
          </form>
        </div>

        {/* Results list */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {!searched && matches.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-500 dark:text-stone-400">
              <BookOpen className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
              <p className="font-semibold text-stone-700 dark:text-stone-300">
                کلیدواژه‌های مدنظر خود را جستجو نمایید یا دکمه «بازیابی اسناد» را کلیک کنید.
              </p>
            </div>
          )}

          {searched && matches.length === 0 && (
            <div className="p-8 text-center text-xs border border-dashed border-amber-300 dark:border-amber-800/80 rounded-xl bg-amber-50/40 dark:bg-amber-950/20">
              <AlertTriangle className="w-8 h-8 mx-auto text-amber-600 mb-2" />
              <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                منبع مستندی در مخزن برای این کلیدواژه یافت نشد
              </p>
              <p className="text-stone-600 dark:text-stone-400 mt-1 max-w-md mx-auto leading-relaxed">
                طبق پروتکل عدم ساخت منبع جعلی، هیچ مقاله یا DOI ساختگی تولید نمی‌گردد. لطفاً کلیدواژه‌های عمومی‌تری مانند «شیر»، «گوشت»، «روغن»، «پراکسید» یا «میکروبیولوژی» را جستجو فرمایید یا سند جدید را در صفحه کتابخانه مراجع بارگذاری نمایید.
              </p>
            </div>
          )}

          {matches.map((match) => {
            const isAdded = addedIds.has(match.source.id);
            const s = match.source;
            return (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-850/60 text-xs space-y-2.5 transition-all hover:border-emerald-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        سند مستند رسمی
                      </span>
                      <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400 bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                        امتیاز تطابق: {match.relevanceScore}٪
                      </span>
                    </div>

                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mt-1.5 leading-relaxed">
                      {s.title}
                    </h4>
                    {s.englishTitle && (
                      <div className="font-mono text-[11px] text-stone-500 dark:text-stone-400 mt-0.5" dir="ltr">
                        {s.englishTitle}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleAdd(match)}
                    disabled={isAdded}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isAdded
                        ? 'bg-stone-200 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>افزوده شد</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن به پیشینه</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Match reason */}
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  <span className="font-semibold">علت انطباق: </span>
                  {match.matchedReasonFa}
                </div>

                {/* Citation preview */}
                <div className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
                  <span className="font-sans font-bold text-stone-500 dark:text-stone-400 text-[10px] block mb-0.5">
                    فرمت ارجاع‌دهی استاندارد (Citation):
                  </span>
                  {match.suggestedCitation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
