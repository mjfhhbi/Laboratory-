import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FlaskConical, 
  Microscope, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Thermometer, 
  Play, 
  FileText, 
  Layers, 
  ExternalLink,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
  Info,
  Bug,
  Tag,
  Dna
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MicrobialTest, MicrobialCategory } from '../../types/microbiology';
import { MICROBIAL_TESTS_DATABASE } from '../../data/microbiologyData';
import { createMicrobiologyLabSession } from '../../lib/storage/microbiologyStorage';
import { saveLabSession } from '../../lib/storage/labStorage';

const CATEGORY_TABS: { id: MicrobialCategory | 'all'; labelFa: string; icon: any }[] = [
  { id: 'all', labelFa: 'همه آزمون‌ها', icon: Layers },
  { id: 'indicator', labelFa: 'شاخص‌های بهداشتی (Indicator)', icon: ShieldCheck },
  { id: 'pathogen', labelFa: 'پاتوژن‌ها و بیماری‌زاها (Pathogen)', icon: Bug },
  { id: 'spoilage', labelFa: 'میکروارگانیسم‌های فساد (Spoilage)', icon: AlertTriangle }
];

export const MicrobiologyTestBank: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<MicrobialCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<MicrobialTest | null>(null);
  const [launchingSession, setLaunchingSession] = useState(false);

  const filteredTests = MICROBIAL_TESTS_DATABASE.filter(test => {
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      test.titleFa.toLowerCase().includes(q) ||
      test.titleEn.toLowerCase().includes(q) ||
      test.code.toLowerCase().includes(q) ||
      test.targetOrganism.toLowerCase().includes(q) ||
      test.primaryStandard.standardNumber.toLowerCase().includes(q) ||
      test.tags.some(t => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const handleLaunchInLabEngine = async (test: MicrobialTest) => {
    setLaunchingSession(true);
    try {
      const session = createMicrobiologyLabSession(test);
      await saveLabSession(session);
      navigate(`/laboratory?sessionId=${session.id}`);
    } catch (err) {
      console.error('Error launching microbiology lab session:', err);
      // Fallback navigation
      navigate('/laboratory');
    } finally {
      setLaunchingSession(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در آزمون‌ها (کد استاندارد، نام میکروارگانیسم، محیط کشت، متدولوژی)..."
            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
          />
        </div>

        {/* Categories Tab Pill */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200 dark:border-stone-700 overflow-x-auto">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-xs border border-stone-200/50 dark:border-stone-700'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.labelFa}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Microbial Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTests.map((test) => {
          const isSelected = selectedTest?.id === test.id;
          const isPathogen = test.category === 'pathogen';
          const isIndicator = test.category === 'indicator';

          return (
            <div
              key={test.id}
              onClick={() => setSelectedTest(test)}
              className={`group text-right p-4.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white dark:bg-stone-900/90 hover:shadow-md ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-800'
              }`}
            >
              <div className="space-y-3">
                {/* Header Tags */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    {test.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isPathogen
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        : isIndicator
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}>
                      {test.category === 'pathogen' ? 'پاتوژن بیماری‌زا' : test.category === 'indicator' ? 'شاخص بهداشتی' : 'عامل فساد'}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                      {test.biosafetyLevel}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {test.titleFa}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-0.5 line-clamp-1" dir="ltr">
                    {test.titleEn}
                  </p>
                </div>

                {/* Key Specs */}
                <div className="p-2.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl space-y-1.5 text-xs text-stone-600 dark:text-stone-300 border border-stone-100 dark:border-stone-700/50">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 dark:text-stone-500 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-stone-400" />
                      استاندارد ملی:
                    </span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono">
                      {test.primaryStandard.standardNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 dark:text-stone-500 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-stone-400" />
                      دما / زمان:
                    </span>
                    <span className="font-medium text-stone-800 dark:text-stone-200 font-mono">
                      {test.requiredMedia[0]?.incubationTemp} | {test.requiredMedia[0]?.incubationTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 dark:text-stone-500 flex items-center gap-1">
                      <FlaskConical className="w-3 h-3 text-stone-400" />
                      محیط اصلی:
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                      {test.requiredMedia[0]?.mediaCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTest(test);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  <span>مشاهده SOP کامل</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchInLabEngine(test);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-xs flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>شروع در میزکار</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-2">
          <Microscope className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
          <h4 className="text-sm font-bold text-stone-700 dark:text-stone-300">هیچ آزمون میکروبی مطابق جستجو یافت نشد</h4>
          <p className="text-xs text-stone-500 dark:text-stone-400">لطفاً عبارت دیگری را جستجو کرده یا فیلتر دسته‌بندی را تغییر دهید.</p>
        </div>
      )}

      {/* Detailed Modal / Full SOP Drawer for Selected Test */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
          <div 
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-right font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {selectedTest.code}
                  </span>
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    سطح ایمنی زیستی: {selectedTest.biosafetyLevel}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {selectedTest.titleFa}
                </h2>
                <p className="text-xs text-stone-500 font-mono" dir="ltr">
                  {selectedTest.titleEn}
                </p>
              </div>

              <button
                onClick={() => setSelectedTest(null)}
                className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Standards & Scope Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
                <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>استاندارد ملی و بین‌المللی مرجع</span>
                </div>
                <div className="space-y-1 text-stone-600 dark:text-stone-300">
                  <p><strong className="text-stone-800 dark:text-stone-200">استاندارد ملی اصلی:</strong> {selectedTest.primaryStandard.standardNumber} ({selectedTest.primaryStandard.title})</p>
                  {selectedTest.secondaryStandards && selectedTest.secondaryStandards.map((sec, i) => (
                    <p key={i}><strong className="text-stone-800 dark:text-stone-200">مرجع بین‌المللی ({sec.organization}):</strong> {sec.standardNumber}</p>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 space-y-2 text-xs">
                <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>دامنه کاربرد و اصل روش</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {selectedTest.principleFa}
                </p>
              </div>
            </div>

            {/* Required Equipment & Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Media */}
              <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <h4 className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-teal-600" />
                  <span>محیط‌های کشت و رقیق‌کننده‌های الزامی</span>
                </h4>
                <ul className="space-y-2">
                  {selectedTest.requiredMedia.map((m, i) => (
                    <li key={i} className="p-2 bg-stone-50 dark:bg-stone-800/40 rounded-lg border border-stone-100 dark:border-stone-800">
                      <div className="flex items-center justify-between font-semibold text-stone-800 dark:text-stone-200">
                        <span>{m.nameFa}</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{m.mediaCode}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex flex-wrap gap-2">
                        <span>شرایط: {m.incubationTemp} ({m.incubationTime})</span>
                        {m.pHAt25C && <span>pH: {m.pHAt25C}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Equipment */}
              <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <h4 className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Microscope className="w-4 h-4 text-blue-600" />
                  <span>تجهیزات و ابزار آزمایشگاهی</span>
                </h4>
                <ul className="space-y-1.5">
                  {selectedTest.requiredEquipment.map((eq, i) => (
                    <li key={i} className="p-1.5 rounded-md hover:bg-stone-50 dark:hover:bg-stone-800/40 flex items-start justify-between gap-2">
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{eq.nameFa}</span>
                      <span className="text-[11px] text-stone-400 text-left">{eq.specification}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step-by-Step SOP Procedure */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>مراحل استاندارد انجام آزمون (Standard Operating Procedure)</span>
              </h4>
              <div className="space-y-2">
                {selectedTest.procedureSteps.map((step) => (
                  <div key={step.stepNumber} className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/80 dark:border-stone-700/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-mono">
                          {step.stepNumber}
                        </span>
                        <span>{step.titleFa}</span>
                      </div>
                      {step.criticalTemperature && (
                        <span className="text-[11px] font-mono bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                          {step.criticalTemperature}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed pr-7">
                      {step.descriptionFa}
                    </p>
                    {step.criticalWarning && (
                      <p className="text-rose-700 dark:text-rose-400 text-[11px] font-medium pr-7 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>نکته حیاتی: {step.criticalWarning}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations & Quality Control */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                <div className="font-bold text-stone-900 dark:text-stone-100">فرمول و قوانین محاسباتی (ISO 7218)</div>
                <div className="font-mono text-emerald-800 dark:text-emerald-300 bg-white dark:bg-stone-900 p-2 rounded-lg border border-stone-200 dark:border-stone-800 text-center font-bold text-xs" dir="ltr">
                  {selectedTest.calculationRules.formulaExpression}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  محدوده قابل شمارش: {selectedTest.calculationRules.countingRangeMin} تا {selectedTest.calculationRules.countingRangeMax} کلنی در هر پلیت
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                <div className="font-bold text-stone-900 dark:text-stone-100">سویه‌های مرجع کنترل کیفیت (ATCC / WDCM)</div>
                <p className="text-stone-700 dark:text-stone-300"><strong className="text-emerald-700 dark:text-emerald-400">سویه شاهد مثبت:</strong> {selectedTest.qualityControl.positiveControlStrain}</p>
                {selectedTest.qualityControl.negativeControlStrain && (
                  <p className="text-stone-700 dark:text-stone-300"><strong className="text-rose-700 dark:text-rose-400">سویه شاهد منفی:</strong> {selectedTest.qualityControl.negativeControlStrain}</p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setSelectedTest(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              >
                بستن
              </button>

              <button
                type="button"
                onClick={() => handleLaunchInLabEngine(selectedTest)}
                disabled={launchingSession}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>اجرای گام‌به‌گام در میزکار آزمایشگاه (Laboratory Engine)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
