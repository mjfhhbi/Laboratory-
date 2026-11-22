import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Layers,
  Search,
  Sparkles,
  BookOpen,
  Scale,
  FlaskConical,
  TestTube,
  Microscope,
  FileText,
  DollarSign,
  Compass,
  Cpu,
  RefreshCw,
  Award
} from 'lucide-react';
import { CentralModuleType, UnifiedEvidenceReport } from '../../lib/evidence/types';
import { evaluateModuleEvidence } from '../../lib/evidence/centralEvidenceHub';
import { UnifiedEvidenceCard } from '../common/UnifiedEvidenceCard';

interface ModuleOption {
  id: CentralModuleType;
  labelFa: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultQuery: string;
  defaultStd: string;
  defaultNum: { name: string; value: string; unit: string };
}

const MODULE_OPTIONS: ModuleOption[] = [
  {
    id: 'chat',
    labelFa: 'گفتگوی علمی (Chat)',
    icon: Sparkles,
    defaultQuery: 'دمای پاستوریزاسیون شیر و آزمون فسفاتاز قلیایی',
    defaultStd: 'INSO 1629',
    defaultNum: { name: 'دما', value: '72', unit: '°C' }
  },
  {
    id: 'laboratory',
    labelFa: 'آزمایشگاه دیجیتال (Laboratory)',
    icon: FlaskConical,
    defaultQuery: 'روش اندازه‌گیری رطوبت آرد گندم به روش وزنی',
    defaultStd: 'INSO 2705',
    defaultNum: { name: 'حداکثر رطوبت', value: '14.2', unit: '%' }
  },
  {
    id: 'experiments',
    labelFa: 'پروتکل‌های آزمون (Experiments)',
    icon: TestTube,
    defaultQuery: 'سنجش اسیدیته کل بر حسب اسید سیتریک در آبمیوه',
    defaultStd: 'INSO 2685',
    defaultNum: { name: 'اسیدیته تیترپذیر', value: '0.65', unit: 'g/100ml' }
  },
  {
    id: 'microbiology',
    labelFa: 'میکروبیولوژی غذایی (Microbiology)',
    icon: Microscope,
    defaultQuery: 'شمارش کلیفرم‌ها و سالمونلا در فرآورده‌های گوشتی حرارت‌دیده',
    defaultStd: 'INSO 10899',
    defaultNum: { name: 'حد پذیرش سالمونلا', value: 'منفی در 25 گرم', unit: 'CFU/25g' }
  },
  {
    id: 'food_chemistry',
    labelFa: 'شیمی مواد غذایی (Food Chemistry)',
    icon: Layers,
    defaultQuery: 'عدد پراکسید و اسیدیته روغن خوراکی کلزا',
    defaultStd: 'INSO 4179',
    defaultNum: { name: 'عدد پراکسید', value: '1.8', unit: 'meq/kg' }
  },
  {
    id: 'qa_qc',
    labelFa: 'کنترل و تضمین کیفیت (QA/QC)',
    icon: ShieldCheck,
    defaultQuery: 'حد مجاز بنزوات سدیم و سوربات پتاسیم در سس مایونز',
    defaultStd: 'INSO 2454',
    defaultNum: { name: 'مجموع نگهدارنده‌ها', value: '750', unit: 'ppm' }
  },
  {
    id: 'statistics',
    labelFa: 'آمار و اعتبارسنجی تکرارها (Statistics)',
    icon: Scale,
    defaultQuery: 'ضریب تغییرات تکرارپذیری CV% در سنجش بریکس گوجه‌فرنگی',
    defaultStd: 'INSO 761',
    defaultNum: { name: 'CV تکرارپذیری', value: '1.4', unit: '%' }
  },
  {
    id: 'research',
    labelFa: 'پژوهش و متون علمی (Research)',
    icon: BookOpen,
    defaultQuery: 'ریزپوشانی اسانس آویشن شیرازی با نانوذرات کیتوزان در ماندگاری پنیر',
    defaultStd: '',
    defaultNum: { name: 'راندمان کپسوله‌سازی', value: '84.5', unit: '%' }
  },
  {
    id: 'pdf_analysis',
    labelFa: 'تحلیل اسناد و RAG (PDF Analysis)',
    icon: FileText,
    defaultQuery: 'استخراج جدول حدود ویژگی‌های میکروبی از استاندارد اسکن‌شده',
    defaultStd: 'INSO 2394',
    defaultNum: { name: 'تعداد کلنی اشریشیا کلی', value: 'کمتر از 10', unit: 'CFU/g' }
  },
  {
    id: 'product_development',
    labelFa: 'فرمولاسیون و توسعه (Product Dev)',
    icon: Compass,
    defaultQuery: 'فرمولاسیون نوشیدنی پروبیوتیک بر پایه عصاره مالت جو',
    defaultStd: 'INSO 3414',
    defaultNum: { name: 'تعداد باکتری زنده', value: '10^7', unit: 'CFU/ml' }
  },
  {
    id: 'costing',
    labelFa: 'بهای تمام‌شده و فرمولاسیون (Costing)',
    icon: DollarSign,
    defaultQuery: 'محاسبه بهای هر کیلوگرم پنیر پروسس با چربی گیاهی مجاز',
    defaultStd: 'INSO 2344',
    defaultNum: { name: 'درصد چربی در ماده خشک', value: '45', unit: '%' }
  },
  {
    id: 'troubleshooting',
    labelFa: 'عیب‌یابی آزمایشگاهی و خط (Troubleshooting)',
    icon: AlertTriangle,
    defaultQuery: 'علت دوفاز شدن سس سالاد و شکسته شدن امولسیون',
    defaultStd: 'INSO 2454',
    defaultNum: { name: 'دمای نگهداری', value: '4', unit: '°C' }
  },
  {
    id: 'equipment',
    labelFa: 'تجهیزات و کالیبراسیون (Equipment)',
    icon: Cpu,
    defaultQuery: 'کالیبراسیون رفرکتومتر چشمی با محلول استاندارد ساکارز',
    defaultStd: 'INSO 10526',
    defaultNum: { name: 'خطای مجاز قرائت بریکس', value: '0.1', unit: 'Brix' }
  },
  {
    id: 'reagents',
    labelFa: 'معرف‌ها و ایمنی SDS (Reagents)',
    icon: FlaskConical,
    defaultQuery: 'تهیه هیدروکسید سدیم 0.1 نرمال و فاکتورگیری با پتاسیم هیدروژن فتالات',
    defaultStd: 'INSO 10528',
    defaultNum: { name: 'نرمالیته', value: '0.1002', unit: 'N' }
  }
];

export const CentralEvidenceHubView: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<CentralModuleType>('chat');
  const [query, setQuery] = useState(MODULE_OPTIONS[0].defaultQuery);
  const [standardNumber, setStandardNumber] = useState(MODULE_OPTIONS[0].defaultStd);
  const [paramName, setParamName] = useState(MODULE_OPTIONS[0].defaultNum.name);
  const [paramValue, setParamValue] = useState(MODULE_OPTIONS[0].defaultNum.value);
  const [paramUnit, setParamUnit] = useState(MODULE_OPTIONS[0].defaultNum.unit);
  const [textPayload, setTextPayload] = useState('');

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<UnifiedEvidenceReport | null>(null);

  const activeModuleMeta = MODULE_OPTIONS.find((m) => m.id === selectedModule) || MODULE_OPTIONS[0];

  const handleSelectModule = (mod: ModuleOption) => {
    setSelectedModule(mod.id);
    setQuery(mod.defaultQuery);
    setStandardNumber(mod.defaultStd);
    setParamName(mod.defaultNum.name);
    setParamValue(mod.defaultNum.value);
    setParamUnit(mod.defaultNum.unit);
    setTextPayload('');
  };

  const handleRunEvaluation = async () => {
    setLoading(true);
    try {
      const res = await evaluateModuleEvidence({
        module: selectedModule,
        queryOrTopic: query,
        targetStandardNumber: standardNumber.trim() || undefined,
        textPayload: textPayload.trim() || undefined,
        numericalData: paramName.trim()
          ? [
              {
                name: paramName,
                value: paramValue,
                unit: paramUnit
              }
            ]
          : undefined
      });
      setReport(res);
    } catch (err) {
      console.error('Evidence evaluation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRunEvaluation();
  }, [selectedModule]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Golden Rule Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">
              قانون طلایی سیستم مرکزی اعتبارسنجی (Golden Rule of Scientific Integrity)
            </h4>
            <p className="text-xs leading-relaxed">
              <strong>قانون طلایی:</strong> هوش مصنوعی و کلیه ماژول‌ها هرگز نباید برای پر کردن جای خالی، شماره استاندارد، فرمول، عدد، دما، زمان، غلظت، حد پذیرش، Citation، DOI یا نتیجه آزمایش را جعل کنند.
            </p>
          </div>
        </div>
      </div>

      {/* Communication Architecture Flow Diagram */}
      <div className="p-5 rounded-2xl bg-stone-900 text-stone-100 dark:bg-stone-950 border border-stone-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">
              ساختار ارتباطی نهایی سیستم یکپارچه Food Science AI
            </h3>
          </div>
          <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
            Part 30 of 30 Integrated
          </span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          جریان پردازش داده و تصمیم‌گیری علمی از کاربر تا خروجی صحه‌گذاری‌شده:
        </p>

        {/* Visual Pipeline flow */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold py-2">
          <span className="px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-200">
            کاربر (User)
          </span>
          <ArrowDown className="w-4 h-4 text-emerald-400 rotate-[-90deg] hidden sm:inline" />
          <span className="px-3 py-1.5 rounded-xl bg-indigo-900/60 border border-indigo-700 text-indigo-200">
            Chat / Laboratory / Research / Product
          </span>
          <ArrowDown className="w-4 h-4 text-emerald-400 rotate-[-90deg] hidden sm:inline" />
          <span className="px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-200">
            تشخیص نیت (Intent)
          </span>
          <ArrowDown className="w-4 h-4 text-emerald-400 rotate-[-90deg] hidden sm:inline" />
          <span className="px-3 py-1.5 rounded-xl bg-amber-900/60 border border-amber-700 text-amber-200">
            Knowledge Base
          </span>
          <ArrowDown className="w-4 h-4 text-emerald-400 rotate-[-90deg] hidden sm:inline" />
          <span className="px-3 py-1.5 rounded-xl bg-blue-900/60 border border-blue-700 text-blue-200">
            Sources / Standards
          </span>
          <ArrowDown className="w-4 h-4 text-emerald-400 rotate-[-90deg] hidden sm:inline" />
          <span className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-700 text-purple-200">
            RAG Pipeline
          </span>
          <ArrowDown className="w-4 h-4 text-emerald-400 rotate-[-90deg] hidden sm:inline" />
          <span className="px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-200">
            هوش مصنوعی (AI)
          </span>
          <ArrowDown className="w-4 h-4 text-emerald-400 rotate-[-90deg] hidden sm:inline" />
          <span className="px-3 py-1.5 rounded-xl bg-emerald-900/70 border border-emerald-700 text-emerald-200">
            اعتبارسنجی (Validation)
          </span>
          <ArrowDown className="w-4 h-4 text-emerald-400 rotate-[-90deg] hidden sm:inline" />
          <span className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white shadow-xs">
            پاسخ / محاسبه / توصیه + منبع + اطمینان
          </span>
        </div>
      </div>

      {/* 3 Universal Tiers Description Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-400/80 dark:border-emerald-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>سطح ۱: تأییدشده رسمی (VERIFIED)</span>
          </div>
          <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
            اطلاعات مستقیماً توسط Source معتبر (استاندارد ملی، ایزو، AOAC، کدکس یا مرجع رسمی مصوب) پشتیبانی می‌شود و قابل درج در گواهی‌های رسمی و برگه نتایج است.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border-2 border-amber-400/80 dark:border-amber-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
            <HelpCircle className="w-4 h-4" />
            <span>سطح ۲: پشتیبانی‌شده (SUPPORTED)</span>
          </div>
          <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
            اطلاعات از منابع موجود پشتیبانی می‌شود اما نیاز به بررسی بیشتر، تطبیق فرمول با نوع محصول یا تجدیدنظر سالانه استاندارد دارد.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border-2 border-rose-400/80 dark:border-rose-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>سطح ۳: فاقد منبع قطعی (UNVERIFIED)</span>
          </div>
          <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
            منبع کافی وجود ندارد و نباید به‌عنوان حقیقت قطعی یا استاندارد قانونی ملاک عمل قرار گیرد؛ نیازمند بارگذاری مدرک یا استعلام رسمی است.
          </p>
        </div>
      </div>

      {/* Module Selector Grid */}
      <div className="space-y-3 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800">
        <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>انتخاب ماژول متصل جهت ارزیابی اعتبارسنجی زنده:</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {MODULE_OPTIONS.map((mod) => {
            const Icon = mod.icon;
            const isSelected = selectedModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => handleSelectModule(mod)}
                className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-700 dark:text-stone-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span className="text-[11px] font-semibold block leading-tight">{mod.labelFa}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Evaluation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Form */}
        <div className="lg:col-span-6 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-600" />
              <span>پارامترهای ورودی ماژول: {activeModuleMeta.labelFa}</span>
            </h4>
            <span className="text-[10px] text-stone-400 font-mono">
              Module: {selectedModule}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                موضوع، سوال علمی یا شرح ادعا:
              </label>
              <textarea
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="مثلاً: دمای پاستوریزاسیون شیر و آزمون فسفاتاز قلیایی..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  شماره استاندارد ادعایی:
                </label>
                <input
                  type="text"
                  value={standardNumber}
                  onChange={(e) => setStandardNumber(e.target.value)}
                  placeholder="مثلاً: INSO 1629"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-left focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  نام پارامتر عددی:
                </label>
                <input
                  type="text"
                  value={paramName}
                  onChange={(e) => setParamName(e.target.value)}
                  placeholder="مثلاً: دما / رطوبت / پراکسید"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  مقدار عددی ادعاشده:
                </label>
                <input
                  type="text"
                  value={paramValue}
                  onChange={(e) => setParamValue(e.target.value)}
                  placeholder="مثلاً: 72 یا 14.2"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-left focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  واحد اندازه‌گیری:
                </label>
                <input
                  type="text"
                  value={paramUnit}
                  onChange={(e) => setParamUnit(e.target.value)}
                  placeholder="°C / % / ppm / CFU/g"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-left focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                متن کامل پاسخ یا گزاره جهت ممیزی ضدجعل:
              </label>
              <textarea
                rows={2}
                value={textPayload}
                onChange={(e) => setTextPayload(e.target.value)}
                placeholder="متن کامل پیام یا ادعای هوش مصنوعی را برای بررسی ارجاعات وارد نمایید..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleRunEvaluation}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Award className="w-4 h-4" />
                )}
                <span>اجرای اعتبارسنجی و ممیزی منبع</span>
              </button>

              <span className="text-[11px] text-stone-400">
                بررسی بلادرنگ در مخازن محلی و استانداردهای مصوب
              </span>
            </div>
          </div>
        </div>

        {/* Output Evaluation Report */}
        <div className="lg:col-span-6 space-y-4">
          {report ? (
            <div className="space-y-4">
              <UnifiedEvidenceCard report={report} compact={false} />

              {/* Extra Numerical Audit Table */}
              {report.numericalClaimsAudit.length > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                  <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    <span>ممیزی داده‌های عددی و حدود استاندارد:</span>
                  </h4>
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 text-[11px]">
                        <th className="py-1">پارامتر</th>
                        <th className="py-1">مقدار ادعا</th>
                        <th className="py-1">وضعیت انطباق</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {report.numericalClaimsAudit.map((item, idx) => (
                        <tr key={idx} className="py-1.5">
                          <td className="py-1.5 font-semibold text-stone-800 dark:text-stone-200">
                            {item.parameterName}
                          </td>
                          <td className="py-1.5 font-mono text-stone-700 dark:text-stone-300">
                            {item.claimedValue} {item.unit || ''}
                          </td>
                          <td className="py-1.5">
                            {item.isCompliantWithSource ? (
                              <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {item.standardLimit}
                              </span>
                            ) : (
                              <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {item.standardLimit}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 text-stone-400 text-xs">
              در حال آماده‌سازی گزارش اعتبارسنجی علمی...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
