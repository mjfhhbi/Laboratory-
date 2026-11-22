import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FoodExperiment,
  ExperimentProcedureStep,
  EXPERIMENT_DOMAINS,
  VERIFICATION_STATUS_META,
  RELIABILITY_GRADES
} from '../../types/foodExperiment';
import { createLabSessionFromExperiment, saveLabSession } from '../../lib/storage/labStorage';
import { ScientificFormulaCard } from '../common/ScientificFormulaCard';
import { StandardExperimentTemplateModal } from './StandardExperimentTemplateModal';
import { EquipmentChecklistModal } from '../equipment/EquipmentChecklistModal';
import { SamplePrepPipelineView } from './SamplePrepPipelineView';
import { QualityControlProtocolView } from './QualityControlProtocolView';
import { extractQCItemsFromExperiment } from '../../lib/qc/experimentQCEngine';
import { buildEquipmentChecklistForExperiment } from '../../lib/equipment/equipmentChecklistEngine';
import { BENCHMARK_LAB_EQUIPMENT } from '../../lib/storage/equipmentStorage';
import { EquipmentChecklistItem } from '../../types/laboratoryEquipment';
import {
  Target,
  FileText,
  Compass,
  Cpu,
  FlaskConical,
  Scissors,
  Droplet,
  ListOrdered,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ClipboardCheck,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  ThermometerSun,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Search,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  Database,
  Package,
  Wrench,
  CheckSquare,
  StickyNote,
  Play
} from 'lucide-react';

interface LaboratoryProcedureViewProps {
  experiment: FoodExperiment;
  onBack?: () => void;
  onEdit?: (experiment: FoodExperiment) => void;
  compact?: boolean;
}

type ProcedureSectionId =
  | 'objective'
  | 'principle'
  | 'scope'
  | 'equipment'
  | 'reagents'
  | 'sample_prep'
  | 'solutions_prep'
  | 'procedure'
  | 'calculations'
  | 'quality_control'
  | 'acceptance_criteria'
  | 'potential_errors'
  | 'troubleshooting'
  | 'safety'
  | 'reporting'
  | 'notes'
  | 'sources';

interface SectionMeta {
  id: ProcedureSectionId;
  titleFa: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const SECTIONS: SectionMeta[] = [
  { id: 'objective', titleFa: '۱. هدف آزمایش (Purpose)', icon: Target },
  { id: 'principle', titleFa: '۲. اصل روش (Principle)', icon: FileText },
  { id: 'scope', titleFa: '۳. دامنه کاربرد (Scope)', icon: Compass },
  { id: 'equipment', titleFa: '۴. تجهیزات و الزامات کالیبراسیون', icon: Cpu },
  { id: 'reagents', titleFa: '۵. مواد و معرف‌ها (Reagents)', icon: FlaskConical },
  { id: 'sample_prep', titleFa: '۶. آماده‌سازی نمونه', icon: Scissors },
  { id: 'solutions_prep', titleFa: '۷. آماده‌سازی محلول‌ها', icon: Droplet },
  { id: 'procedure', titleFa: '۸. روش انجام آزمایش (SOP)', icon: ListOrdered },
  { id: 'calculations', titleFa: '۹. محاسبات و فرمول ریاضی', icon: Calculator },
  { id: 'quality_control', titleFa: '۱۰. کنترل کیفیت آزمایشگاهی', icon: ShieldCheck },
  { id: 'acceptance_criteria', titleFa: '۱۱. حدود پذیرش و الزامات قانونی', icon: CheckSquare },
  { id: 'potential_errors', titleFa: '۱۲. خطاهای رایج آزمون', icon: AlertTriangle },
  { id: 'troubleshooting', titleFa: '۱۳. راهنمای عیب‌یابی و اقدامات اصلاحی', icon: Wrench },
  { id: 'safety', titleFa: '۱۴. ایمنی و بهداشت', icon: Flame },
  { id: 'reporting', titleFa: '۱۵. نتیجه‌گیری و نحوه گزارش', icon: ClipboardCheck },
  { id: 'notes', titleFa: '۱۶. یادداشت‌ها و نکات فنی', icon: StickyNote },
  { id: 'sources', titleFa: '۱۷. استانداردهای مرجع و منابع', icon: BookOpen }
];

export const LaboratoryProcedureView: React.FC<LaboratoryProcedureViewProps> = ({
  experiment,
  onBack,
  onEdit,
  compact = false
}) => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Accordion open/close state - default all open for thorough reading
  const [openSections, setOpenSections] = useState<Record<ProcedureSectionId, boolean>>({
    objective: true,
    principle: true,
    scope: true,
    equipment: true,
    reagents: true,
    sample_prep: true,
    solutions_prep: true,
    procedure: true,
    calculations: true,
    quality_control: true,
    acceptance_criteria: true,
    potential_errors: true,
    troubleshooting: true,
    safety: true,
    reporting: true,
    notes: true,
    sources: true
  });

  const [stepSearchQuery, setStepSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [isLaunchingLab, setIsLaunchingLab] = useState(false);
  const [isEquipmentChecklistModalOpen, setIsEquipmentChecklistModalOpen] = useState(false);
  const [equipmentChecklist, setEquipmentChecklist] = useState<EquipmentChecklistItem[]>(() =>
    buildEquipmentChecklistForExperiment(experiment, BENCHMARK_LAB_EQUIPMENT)
  );
  const navigate = useNavigate();

  const handleStartInDigitalLab = async () => {
    setIsLaunchingLab(true);
    try {
      const session = createLabSessionFromExperiment(experiment);
      await saveLabSession(session);
      navigate('/laboratory');
    } catch (err) {
      console.error('Failed to launch digital lab session:', err);
    } finally {
      setIsLaunchingLab(false);
    }
  };

  // Interactive calculation sandbox
  const [calcInputs, setCalcInputs] = useState<Record<string, number>>({});
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const domainMeta = EXPERIMENT_DOMAINS[experiment.domain] || {
    titleFa: experiment.domain,
    titleEn: '',
    color: '#059669'
  };

  const statusMeta = VERIFICATION_STATUS_META[experiment.verificationStatus] || {
    labelFa: 'در دست بررسی',
    badgeColor: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
    descriptionFa: ''
  };

  const toggleSection = (id: ProcedureSectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allOpen: Record<ProcedureSectionId, boolean> = {
      objective: true,
      principle: true,
      scope: true,
      equipment: true,
      reagents: true,
      sample_prep: true,
      solutions_prep: true,
      procedure: true,
      calculations: true,
      quality_control: true,
      acceptance_criteria: true,
      potential_errors: true,
      troubleshooting: true,
      safety: true,
      reporting: true,
      notes: true,
      sources: true
    };
    setOpenSections(allOpen);
  };

  const collapseAll = () => {
    const allClosed: Record<ProcedureSectionId, boolean> = {
      objective: false,
      principle: false,
      scope: false,
      equipment: false,
      reagents: false,
      sample_prep: false,
      solutions_prep: false,
      procedure: true, // keep procedure open as primary
      calculations: false,
      quality_control: false,
      acceptance_criteria: false,
      potential_errors: false,
      troubleshooting: false,
      safety: false,
      reporting: false,
      notes: false,
      sources: false
    };
    setOpenSections(allClosed);
  };

  const handleCopySummary = () => {
    const summary = `
[پروتکل استاندارد آزمایشگاهی - Food Science AI]
عنوان: ${experiment.titleFa} (${experiment.code})
استاندارد مرجع: ${experiment.standardReference?.organization} ${experiment.standardReference?.standardNumber}
هدف: ${experiment.objective}
اصل روش: ${experiment.principle}
فرمول: ${experiment.calculations.formulaExpression}
واحد نتیجه: ${experiment.reporting.unitOfMeasurement}
تعداد مراحل: ${experiment.procedureSteps?.length || 0}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered steps if search is applied
  const filteredSteps = useMemo(() => {
    if (!stepSearchQuery.trim()) return experiment.procedureSteps || [];
    const q = stepSearchQuery.toLowerCase();
    return (experiment.procedureSteps || []).filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.criticalCaution && s.criticalCaution.toLowerCase().includes(q)) ||
        (s.warning && s.warning.toLowerCase().includes(q))
    );
  }, [experiment.procedureSteps, stepSearchQuery]);

  const totalSteps = experiment.procedureSteps?.length || 0;
  const currentStepNum = activeStepIndex !== null ? activeStepIndex + 1 : 1;

  const goToNextStep = () => {
    if (totalSteps === 0) return;
    const nextIdx = activeStepIndex === null ? 0 : Math.min(totalSteps - 1, activeStepIndex + 1);
    setActiveStepIndex(nextIdx);
    const el = document.getElementById(`procedure-step-${nextIdx}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const goToPrevStep = () => {
    if (totalSteps === 0) return;
    const prevIdx = activeStepIndex === null ? 0 : Math.max(0, activeStepIndex - 1);
    setActiveStepIndex(prevIdx);
    const el = document.getElementById(`procedure-step-${prevIdx}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Fallback Quality Control values if not specifically populated
  const qualityControlItems = useMemo(() => {
    if (experiment.qualityControl) {
      if (Array.isArray(experiment.qualityControl)) return experiment.qualityControl;
      const q = experiment.qualityControl;
      const list: string[] = [];
      if (q.blanks) list.push(`آزمون شاهد (Blank Test): ${q.blanks}`);
      if (q.validationCheck) list.push(`صحت‌سنجی روش: ${q.validationCheck}`);
      if (q.limits) list.push(`حدود پذیرش کنترل کیفیت: ${q.limits}`);
      if (q.notes) list.push(q.notes);
      return list;
    }
    // Generated QC protocol based on reporting limits & good laboratory practice
    return [
      `اجرای همزمان آزمون شاهد (Blank) با کلیه معرف‌ها جهت کالیبراسیون صفر و حذف اثر حلال`,
      `انجام حداقل دو تکرار همزمان (Duplicate) بر روی هر نمونه یکنواخت‌شده`,
      experiment.reporting?.repeatabilityLimit_r
        ? `کنترل حد تکرارپذیری: ${experiment.reporting.repeatabilityLimit_r}`
        : 'کنترل ضریب تغییرات تکرارپذیری (CV% کمتر از ۲.۵٪)',
      'تایید فاکتور و نرمالیته معرف‌های تیتراسیون پیش از شروع آزمون'
    ];
  }, [experiment.qualityControl, experiment.reporting]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:max-w-none print:m-0" dir="rtl">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {experiment.code}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {domainMeta.titleFa}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${statusMeta.badgeColor}`}
              >
                {statusMeta.labelFa}
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-black text-stone-900 dark:text-stone-100 leading-snug">
              {experiment.titleFa}
            </h1>

            {experiment.titleEn && (
              <p className="text-xs sm:text-sm text-stone-500 font-mono" dir="ltr">
                {experiment.titleEn}
              </p>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>بازگشت</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleStartInDigitalLab}
              disabled={isLaunchingLab}
              className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4" />
              <span>{isLaunchingLab ? 'در حال راه‌اندازی...' : 'اجرای آزمایش در آزمایشگاه دیجیتال'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEquipmentChecklistModalOpen(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>چک‌لیست بررسی تجهیزات قبل از آزمون</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-colors flex items-center gap-1.5"
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span>قالب استاندارد ۲۶ فیلد</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'کپی شد' : 'کپی خلاصه'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ دستورالعمل (SOP)</span>
            </button>
          </div>
        </div>

        {/* Standard Citation & Integrity Banner */}
        <div className="mt-4 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>استاندارد مرجع:</strong> {experiment.standardReference?.organization}{' '}
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {experiment.standardReference?.standardNumber}
              </span>
              {experiment.standardReference?.titleFa && ` — ${experiment.standardReference.titleFa}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-500 font-mono text-[11px]">
            <span>{experiment.procedureSteps?.length || 0} گام استاندارد</span>
            <span>·</span>
            <span>دقت گزارش: {experiment.reporting?.decimalPrecision ?? 2} رقم اعشار</span>
          </div>
        </div>

        {/* Product Matrix & SOP Version Badges (Universal Schema Metadata) */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {experiment.product ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900 font-semibold">
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>محصول هدف: {experiment.product}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500">
              <Package className="w-3.5 h-3.5 text-stone-400" />
              <span>محصول هدف: عموم فرآورده‌های گروه (Unverified)</span>
            </span>
          )}

          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            SOP Version: {experiment.version || '1.0.0'}
          </span>

          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            آخرین صحه‌گذاری: {experiment.lastVerified || (experiment.updatedAt ? experiment.updatedAt.split('T')[0] : '2024-05-15')}
          </span>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>سطح اعتبار: {experiment.verificationStatus === 'verified_standard' || (experiment as any).verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'SUPPORTED'}</span>
          </span>
        </div>
      </div>

      {/* Main Layout: Sticky Quick-Navigation + 14 Structured Procedure Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Sidebar: Table of Contents & Quick Jumps */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-20 space-y-3">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>فهرست بخش‌های پروتکل</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={expandAll}
                  className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline px-1 py-0.5"
                >
                  باز کردن همه
                </button>
                <span className="text-stone-300">|</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="text-[10px] text-stone-500 hover:underline px-1 py-0.5"
                >
                  بستن
                </button>
              </div>
            </div>

            <nav className="space-y-1 text-xs">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isOpen = openSections[sec.id];
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setOpenSections((prev) => ({ ...prev, [sec.id]: true }));
                      const el = document.getElementById(`section-${sec.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-right transition-all min-h-[38px] ${
                      isOpen
                        ? 'text-stone-900 dark:text-stone-100 font-semibold bg-stone-100/70 dark:bg-stone-800/60'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{sec.titleFa}</span>
                    </div>
                    {sec.id === 'procedure' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {experiment.procedureSteps?.length || 0}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Environment Conditions Pill */}
          {experiment.environmentalConditions && (
            <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 rounded-2xl p-3.5 text-xs space-y-1.5 text-sky-900 dark:text-sky-200">
              <span className="font-bold flex items-center gap-1.5 text-[11px]">
                <ThermometerSun className="w-3.5 h-3.5 text-sky-600" />
                <span>شرایط محیطی آزمون:</span>
              </span>
              <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300">
                {experiment.environmentalConditions.temperatureRange || 'دمای آزمایشگاهی ۲۵-۲۰ درجه'}
              </p>
              {experiment.environmentalConditions.ventilationRequirement && (
                <p className="text-[10px] text-sky-800 dark:text-sky-300 font-medium">
                  تهویه: {experiment.environmentalConditions.ventilationRequirement}
                </p>
              )}
            </div>
          )}
        </aside>

        {/* Main Content Column (Max reading width constrained for optimal legibility) */}
        <main className="lg:col-span-9 space-y-4">
          {/* Mobile Quick Expand / Collapse Bar */}
          <div className="flex lg:hidden items-center justify-between p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs">
            <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>فهرست بخش‌های پروتکل استاندارد (SOP)</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold"
              >
                باز کردن همه
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs"
              >
                بستن همه
              </button>
            </div>
          </div>

          {/* 1. هدف آزمایش (Objective) */}
          <section
            id="section-objective"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('objective')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۱. هدف آزمایش (Objective)
                </h2>
              </div>
              {openSections.objective ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.objective && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 text-sm text-stone-800 dark:text-stone-200 leading-relaxed max-w-prose">
                <p>{experiment.objective || 'هدفی برای این آزمایش تعیین نشده است.'}</p>
              </div>
            )}
          </section>

          {/* 2. اصل روش (Principle) */}
          <section
            id="section-principle"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('principle')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۲. اصل روش (Principle)
                </h2>
              </div>
              {openSections.principle ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.principle && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 text-sm text-stone-800 dark:text-stone-200 leading-relaxed max-w-prose space-y-2">
                <p>{experiment.principle || 'اصل روش برای این پروتکل ثبت نشده است.'}</p>
              </div>
            )}
          </section>

          {/* 3. دامنه کاربرد (Scope) */}
          <section
            id="section-scope"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('scope')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۳. دامنه کاربرد (Scope)
                </h2>
              </div>
              {openSections.scope ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.scope && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 text-sm text-stone-800 dark:text-stone-200 leading-relaxed max-w-prose">
                <p>{experiment.scope || 'دامنه کاربرد کلیه محصولات حوزه مربوطه را شامل می‌شود.'}</p>
              </div>
            )}
          </section>

          {/* 4. تجهیزات موردنیاز (Equipment) */}
          <section
            id="section-equipment"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('equipment')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۴. تجهیزات و ابزارها (Equipment & Instruments)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-mono">
                  {experiment.equipment?.length || 0} مورد
                </span>
                {openSections.equipment ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </div>
            </button>

            {openSections.equipment && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-3">
                {experiment.equipment && experiment.equipment.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
                    <table className="w-full text-xs text-right border-collapse min-w-[500px]">
                      <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold border-b border-stone-200 dark:border-stone-800">
                        <tr>
                          <th className="p-3">نام دستگاه / وسیله</th>
                          <th className="p-3">مشخصات فنی و دقت</th>
                          <th className="p-3 text-center">الزام استاندارد</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {experiment.equipment.map((eq, i) => (
                          <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                            <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                              <div>{eq.name}</div>
                              {eq.nameEn && (
                                <div className="text-[10px] text-stone-400 font-mono">{eq.nameEn}</div>
                              )}
                            </td>
                            <td className="p-3 text-stone-600 dark:text-stone-300">
                              {eq.specification || 'مطابق الزامات عمومی آزمایشگاه صنایع غذایی'}
                            </td>
                            <td className="p-3 text-center">
                              {eq.isRequired ? (
                                <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                                  الزامی
                                </span>
                              ) : (
                                <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                                  اختیاری
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">تجهیزات ویژه‌ای درج نشده است.</p>
                )}

                {/* Smart Equipment Verification Pre-Flight Callout */}
                <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs">
                    <Wrench className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="block text-stone-900 dark:text-stone-100">
                        چک‌لیست هوشمند بررسی تجهیزات قبل از آزمون (Equipment Checklist)
                      </strong>
                      <span className="text-[11px] text-stone-500">
                        ارزیابی ۹ فیلد فنی (دقت، ظرفیت، رزولوشن، محدوده کاری، کالیبراسیون و انطباق سنجی)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEquipmentChecklistModalOpen(true)}
                    className="min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <span>بررسی تطابق و مشاهده چک‌لیست</span>
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 5. مواد و معرف‌ها (Reagents & Materials) */}
          <section
            id="section-reagents"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('reagents')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۵. مواد و معرف‌ها (Reagents & Chemicals)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-mono">
                  {experiment.reagentsAndMaterials?.length || 0} مورد
                </span>
                {openSections.reagents ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </div>
            </button>

            {openSections.reagents && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-3">
                {experiment.reagentsAndMaterials && experiment.reagentsAndMaterials.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
                    <table className="w-full text-xs text-right border-collapse min-w-[500px]">
                      <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold border-b border-stone-200 dark:border-stone-800">
                        <tr>
                          <th className="p-3">نام معرف شیمیایی</th>
                          <th className="p-3">درجه خلوص</th>
                          <th className="p-3">کلاس خطر و نگهداری</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {experiment.reagentsAndMaterials.map((r, i) => (
                          <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                            <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                              <div>{r.name}</div>
                              {r.nameEn && (
                                <div className="text-[10px] text-stone-400 font-mono">{r.nameEn}</div>
                              )}
                            </td>
                            <td className="p-3 font-mono text-[11px] text-stone-600 dark:text-stone-300">
                              {r.grade || 'Analytical Reagent (AR)'}
                            </td>
                            <td className="p-3 text-stone-600 dark:text-stone-300">
                              {r.hazardClass && (
                                <span className="inline-block text-[10px] bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-1.5 py-0.5 rounded font-medium ml-1">
                                  {r.hazardClass}
                                </span>
                              )}
                              <span>{r.storageCondition || 'در دمای اتاق'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">معرف شیمیایی خاصی ثبت نشده است.</p>
                )}
              </div>
            )}
          </section>

          {/* 6. آماده‌سازی نمونه (Sample Preparation) */}
          <section
            id="section-sample_prep"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('sample_prep')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <Scissors className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۶. آماده‌سازی نمونه (Sample Preparation)
                </h2>
              </div>
              {openSections.sample_prep ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.sample_prep && (
              <div className="px-5 pb-5 pt-3 border-t border-stone-100 dark:border-stone-800">
                <SamplePrepPipelineView
                  methods={experiment.samplePrepMethods}
                  fallbackPreparationText={experiment.samplePreparation}
                  experimentTitleFa={experiment.titleFa}
                  experimentDomain={experiment.domain}
                  defaultStandardNumber={`${experiment.standardReference?.organization || 'INSO'} ${experiment.standardReference?.standardNumber || ''}`.trim()}
                />
              </div>
            )}
          </section>

          {/* 7. آماده‌سازی محلول‌ها (Solutions Preparation) */}
          <section
            id="section-solutions_prep"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('solutions_prep')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <Droplet className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۷. آماده‌سازی محلول‌ها و معرف‌ها (Solutions Preparation)
                </h2>
              </div>
              {openSections.solutions_prep ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.solutions_prep && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 text-sm text-stone-800 dark:text-stone-200 leading-relaxed max-w-prose">
                <p>{experiment.solutionsPreparation || 'محلول‌ها به صورت تازه و طبق ضوابط استاندارد تهیه گردند.'}</p>
              </div>
            )}
          </section>

          {/* 8. روش انجام آزمایش (Procedure - Detailed Numbered Steps) */}
          <section
            id="section-procedure"
            className="bg-white dark:bg-stone-900 border-2 border-emerald-500/40 dark:border-emerald-600/40 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-200/60 dark:border-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ListOrdered className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                    ۸. روش انجام آزمایش (Step-by-Step Procedure)
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    مراحل اجرایی تفکیک‌شده استاندارد به همراه مقادیر، دما، زمان و نکات بحرانی
                  </p>
                </div>
              </div>

              {/* Step Search within Procedure */}
              <div className="w-full sm:w-auto relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={stepSearchQuery}
                  onChange={(e) => setStepSearchQuery(e.target.value)}
                  placeholder="جستجو در مراحل..."
                  className="w-full sm:w-48 pl-3 pr-8 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {filteredSteps.length > 0 ? (
                <div className="space-y-4">
                  {filteredSteps.map((step, idx) => {
                    const hasParameters = Boolean(
                      step.amount ||
                      step.unit ||
                      step.temperature ||
                      step.duration ||
                      (step.equipment && step.equipment.length > 0) ||
                      step.source
                    );

                    return (
                      <div
                        id={`procedure-step-${idx}`}
                        key={step.stepNumber || idx}
                        className={`rounded-2xl border transition-all p-4 scroll-mt-24 ${
                          activeStepIndex === idx
                            ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs ring-2 ring-emerald-500/20'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-850'
                        }`}
                        onClick={() => setActiveStepIndex(idx)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Step Number Badge */}
                          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {step.stepNumber}
                          </div>

                          <div className="flex-1 space-y-2.5">
                            {/* Step Title */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                {step.title}
                              </h3>
                              {step.source && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                                  بند استاندارد: {step.source}
                                </span>
                              )}
                            </div>

                            {/* Step Description */}
                            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-prose">
                              {step.description}
                            </p>

                            {/* Parameter Badges: Only render if present in source */}
                            {hasParameters && (
                              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                                {(step.amount !== undefined || step.unit) && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium">
                                    <span className="text-stone-500">مقدار:</span>
                                    <strong className="font-mono">{step.amount || '-'} {step.unit || ''}</strong>
                                  </span>
                                )}

                                {step.temperature && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-medium border border-amber-200/60 dark:border-amber-900">
                                    <ThermometerSun className="w-3.5 h-3.5 text-amber-600" />
                                    <span>دما: {step.temperature}</span>
                                  </span>
                                )}

                                {step.duration && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-medium border border-blue-200/60 dark:border-blue-900">
                                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                                    <span>زمان: {step.duration}</span>
                                  </span>
                                )}

                                {step.equipment && step.equipment.length > 0 && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-300 font-medium border border-indigo-200/60 dark:border-indigo-900">
                                    <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>دستگاه: {step.equipment.join('، ')}</span>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Warning & Important Tips */}
                            {step.warning && (
                              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="block font-bold">هشدار:</strong>
                                  <span>{step.warning}</span>
                                </div>
                              </div>
                            )}

                            {step.criticalCaution && (
                              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="block font-bold">نکته مهم و بحرانی:</strong>
                                  <span>{step.criticalCaution}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 dark:bg-stone-850 rounded-xl">
                  مرحله‌ای با این عبارت جستجو یافت نشد.
                </div>
              )}
            </div>
          </section>

          {/* 9. محاسبات (Calculations) */}
          <section
            id="section-calculations"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('calculations')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۹. محاسبات و فرمول استاندارد (Calculations)
                </h2>
              </div>
              {openSections.calculations ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.calculations && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800">
                <ScientificFormulaCard
                  title={experiment.calculations?.formulaTitleFa || '۹. فرمول محاسباتی استاندارد'}
                  formulaExpression={experiment.calculations?.formulaExpression || ''}
                  variables={experiment.calculations?.variables?.map((v) => ({
                    symbol: v.symbol,
                    name: v.name,
                    unit: v.unit,
                    description: v.description
                  })) || []}
                  resultUnit={experiment.reporting?.unitOfMeasurement || '%'}
                  decimalPrecision={experiment.reporting?.decimalPrecision ?? 2}
                  guidanceText={experiment.calculations?.guidanceText}
                  allowInputEdit={true}
                />
              </div>
            )}
          </section>

          {/* 10. کنترل کیفیت (Quality Control) */}
          <section
            id="section-quality_control"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('quality_control')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۱۰. کنترل کیفیت آزمایشگاهی (Quality Control)
                </h2>
              </div>
              {openSections.quality_control ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.quality_control && (
              <div className="px-5 pb-5 pt-3 border-t border-stone-100 dark:border-stone-800">
                <QualityControlProtocolView
                  items={
                    experiment.qcSpec?.items ||
                    (typeof experiment.qualityControl === 'object' && !Array.isArray(experiment.qualityControl) && experiment.qualityControl?.items) ||
                    extractQCItemsFromExperiment(experiment)
                  }
                  fallbackItems={qualityControlItems}
                  standardNumber={`${experiment.standardReference?.organization || 'INSO'} ${experiment.standardReference?.standardNumber || ''}`.trim()}
                />
              </div>
            )}
          </section>

          {/* 11. خطاهای رایج (Potential & Common Errors) */}
          <section
            id="section-potential_errors"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('potential_errors')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۱۱. خطاهای رایج در آزمون (Common Errors)
                </h2>
              </div>
              {openSections.potential_errors ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.potential_errors && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                {experiment.potentialErrors && experiment.potentialErrors.length > 0 ? (
                  <ul className="space-y-2 text-stone-700 dark:text-stone-300">
                    {experiment.potentialErrors.map((err, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/60"
                      >
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{err}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-stone-500">خطای ویژه‌ای برای این متد گزارش نشده است.</p>
                )}
              </div>
            )}
          </section>

          {/* 11. حدود پذیرش و معیارهای قبولی (Acceptance Criteria & Limits) */}
          <section
            id="section-acceptance_criteria"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('acceptance_criteria')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۱۱. حدود پذیرش و معیارهای قبولی (Acceptance Criteria)
                </h2>
              </div>
              {openSections.acceptance_criteria ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.acceptance_criteria && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                {experiment.acceptanceCriteria ? (
                  Array.isArray(experiment.acceptanceCriteria) ? (
                    <ul className="space-y-2 text-stone-700 dark:text-stone-300">
                      {experiment.acceptanceCriteria.map((crit, i) => (
                        <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/50">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{crit}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-2">
                      {experiment.acceptanceCriteria.legalLimits && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                          <strong className="block text-emerald-900 dark:text-emerald-200 font-bold mb-1">حد قانونی استاندارد:</strong>
                          <span>{experiment.acceptanceCriteria.legalLimits}</span>
                        </div>
                      )}
                      {experiment.acceptanceCriteria.criteriaList && experiment.acceptanceCriteria.criteriaList.length > 0 && (
                        <ul className="space-y-1.5 list-disc list-inside">
                          {experiment.acceptanceCriteria.criteriaList.map((c, i) => (
                            <li key={i} className="text-stone-700 dark:text-stone-300">{c}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                ) : (
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-500 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>حدود پذیرش قانونی در استاندارد ویژگی اختصاصی فرآورده درج شده و در این پروتکل قید نشده است (Unverified).</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 12. خطاهای رایج (Potential & Common Errors) */}
          <section
            id="section-potential_errors"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('potential_errors')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۱۲. خطاهای رایج در آزمون (Common Errors)
                </h2>
              </div>
              {openSections.potential_errors ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.potential_errors && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                {experiment.potentialErrors && experiment.potentialErrors.length > 0 ? (
                  <ul className="space-y-2 text-stone-700 dark:text-stone-300">
                    {experiment.potentialErrors.map((err, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/60"
                      >
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{err}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-stone-500">خطای ویژه‌ای برای این متد گزارش نشده است.</p>
                )}
              </div>
            )}
          </section>

          {/* 13. راهنمای عیب‌یابی و رفع اشکال (Troubleshooting Guide) */}
          <section
            id="section-troubleshooting"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('troubleshooting')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۱۳. راهنمای عیب‌یابی و اقدامات اصلاحی (Troubleshooting)
                </h2>
              </div>
              {openSections.troubleshooting ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.troubleshooting && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                {experiment.troubleshooting && experiment.troubleshooting.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2.5">
                    {experiment.troubleshooting.map((item, i) => {
                      if (typeof item === 'string') {
                        return (
                          <div key={i} className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800">
                            {item}
                          </div>
                        );
                      }
                      return (
                        <div key={i} className="p-3 bg-stone-50/80 dark:bg-stone-850/70 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <strong className="text-rose-700 dark:text-rose-400 font-bold">
                              مشکل: {item.problem}
                            </strong>
                            {item.source && (
                              <span className="text-[10px] text-stone-400 font-mono">{item.source}</span>
                            )}
                          </div>
                          <div className="text-stone-600 dark:text-stone-300">
                            <span className="font-semibold text-stone-700 dark:text-stone-200">علت احتمالی: </span>
                            <span>{item.cause}</span>
                          </div>
                          <div className="text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 p-2 rounded-lg">
                            <span className="font-semibold">اقدام اصلاحی: </span>
                            <span>{item.solution}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-500 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>راهنمای عیب‌یابی اختصاصی در متن استاندارد مرجع درج نشده است (Unverified).</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 14. ایمنی (Safety Notes) */}
          <section
            id="section-safety"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('safety')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۱۴. ایمنی و حفاظت آزمایشگاهی (Safety & SDS)
                </h2>
              </div>
              {openSections.safety ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.safety && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                {experiment.safetyNotes && experiment.safetyNotes.length > 0 ? (
                  <ul className="space-y-2 text-stone-700 dark:text-stone-300">
                    {experiment.safetyNotes.map((note, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/60"
                      >
                        <Shield className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{note}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-stone-500">رعایت اصول ایمنی عمومی آزمایشگاه الزامی است.</p>
                )}
              </div>
            )}
          </section>

          {/* 15. نتیجه‌گیری و گزارش (Conclusion & Reporting) */}
          <section
            id="section-reporting"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('reporting')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۱۵. نحوه نتیجه‌گیری و گزارش نتیجه (Reporting)
                </h2>
              </div>
              {openSections.reporting ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.reporting && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500 block mb-0.5">واحد استاندارد گزارش:</span>
                    <strong className="text-stone-900 dark:text-stone-100 font-mono text-sm">
                      {experiment.reporting?.unitOfMeasurement || '-'}
                    </strong>
                  </div>

                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500 block mb-0.5">تعداد ارقام اعشار مجاز:</span>
                    <strong className="text-stone-900 dark:text-stone-100 font-mono text-sm">
                      {experiment.reporting?.decimalPrecision ?? 2}
                    </strong>
                  </div>
                </div>

                {experiment.reporting?.repeatabilityLimit_r && (
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500 block mb-0.5">حد تکرارپذیری (Repeatability limit r):</span>
                    <span className="text-stone-800 dark:text-stone-200 leading-relaxed">
                      {experiment.reporting.repeatabilityLimit_r}
                    </span>
                  </div>
                )}

                {experiment.reporting?.reproducibilityLimit_R && (
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500 block mb-0.5">حد تجدیدپذیری بین آزمایشگاهی (Reproducibility R):</span>
                    <span className="text-stone-800 dark:text-stone-200 leading-relaxed">
                      {experiment.reporting.reproducibilityLimit_R}
                    </span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 16. یادداشت‌ها و نکات فنی (Technical Notes) */}
          <section
            id="section-notes"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('notes')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <StickyNote className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۱۶. یادداشت‌ها و نکات فنی (Technical Notes)
                </h2>
              </div>
              {openSections.notes ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            {openSections.notes && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                {(experiment.notes && experiment.notes.length > 0) || experiment.customNotes ? (
                  <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 leading-relaxed text-stone-700 dark:text-stone-300">
                    {experiment.notes ? experiment.notes.join('\n') : experiment.customNotes}
                  </div>
                ) : (
                  <p className="text-stone-500">یادداشت فنی ثبت نشده است.</p>
                )}
              </div>
            )}
          </section>

          {/* 17. منابع علمی و مراجع (Sources & Standards) */}
          <section
            id="section-sources"
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => toggleSection('sources')}
              className="w-full p-4 flex items-center justify-between text-right hover:bg-stone-50 dark:hover:bg-stone-850/50 transition-colors min-h-[48px]"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ۱۷. مراجع رسمی و استانداردهای مصوب (Sources & Citations)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-mono">
                  {experiment.sources?.length || 0} مأخذ
                </span>
                {openSections.sources ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </div>
            </button>

            {openSections.sources && (
              <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-3 text-xs">
                {experiment.sources && experiment.sources.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {experiment.sources.map((src, i) => (
                      <div
                        key={i}
                        className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 dark:text-stone-100">
                            {src.citationShort}
                          </span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                            {src.verificationGrade || 'VERIFIED'}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                          {src.fullTitle}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                    مستند به: {experiment.standardReference?.organization} {experiment.standardReference?.standardNumber}
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Mobile One-Handed Procedure Navigator Bar (Part 38) */}
      {totalSteps > 0 && (
        <div className="lg:hidden sticky bottom-3 z-30 mx-auto max-w-md p-2 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl flex items-center justify-between gap-2 transition-all">
          <button
            type="button"
            onClick={goToPrevStep}
            disabled={activeStepIndex === null || activeStepIndex === 0}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700 disabled:opacity-40 disabled:cursor-not-allowed bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center gap-1 min-h-[44px]"
          >
            <span>گام قبلی</span>
          </button>

          <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center shrink-0">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block">روش آزمون</span>
            <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
              گام {currentStepNum} از {totalSteps}
            </span>
          </div>

          <button
            type="button"
            onClick={goToNextStep}
            disabled={activeStepIndex !== null && activeStepIndex >= totalSteps - 1}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 min-h-[44px] shadow-2xs"
          >
            <span>گام بعدی</span>
          </button>
        </div>
      )}

      {/* Universal 26-Field Standard Template Modal */}
      <StandardExperimentTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        experiment={experiment}
      />

      {/* Smart Equipment Checklist Modal (Part 35 of 40) */}
      {isEquipmentChecklistModalOpen && (
        <EquipmentChecklistModal
          isOpen={isEquipmentChecklistModalOpen}
          onClose={() => setIsEquipmentChecklistModalOpen(false)}
          checklist={equipmentChecklist}
          equipmentInventory={BENCHMARK_LAB_EQUIPMENT}
          onUpdateChecklist={setEquipmentChecklist}
          title={`چک‌لیست هوشمند تجهیزات: ${experiment.titleFa}`}
          subtitle="بررسی انطباق ۹ فیلد فنی استاندارد با تجهیزات آزمایشگاه (دقت، ظرفیت، رزولوشن، محدوده کاری و کالیبراسیون)"
        />
      )}
    </div>
  );
};
