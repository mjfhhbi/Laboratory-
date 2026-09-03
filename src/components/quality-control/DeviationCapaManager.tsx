import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plus, 
  ShieldAlert, 
  Sparkles, 
  Target, 
  UserCheck, 
  Calendar, 
  Layers,
  ChevronDown,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { QCDeviation, QCCAPAAction } from '../../types/qualityControl';

interface DeviationCapaManagerProps {
  deviations: QCDeviation[];
  capas: QCCAPAAction[];
  onAddDeviation: (deviation: QCDeviation) => void;
  onAddCapa: (capa: QCCAPAAction) => void;
  onUpdateDeviationStatus: (id: string, status: QCDeviation['status']) => void;
  onUpdateCapaStatus: (id: string, status: QCCAPAAction['status']) => void;
}

export const DeviationCapaManager: React.FC<DeviationCapaManagerProps> = ({
  deviations,
  capas,
  onAddDeviation,
  onAddCapa,
  onUpdateDeviationStatus,
  onUpdateCapaStatus
}) => {
  const [activeTab, setActiveTab] = useState<'deviations' | 'capas'>('deviations');
  const [isDeviationModalOpen, setIsDeviationModalOpen] = useState(false);
  const [isCapaModalOpen, setIsCapaModalOpen] = useState(false);

  // New Deviation Form State
  const [newDeviation, setNewDeviation] = useState<Partial<QCDeviation>>({
    deviationNumber: `DEV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    dateReported: new Date().toISOString().slice(0, 10),
    severity: 'major',
    sourceType: 'oos_result',
    titleFa: '',
    descriptionFa: '',
    rootCauseAnalysisFa: {
      category: 'machine',
      rootCauseSummaryFa: '',
      fiveWhysSummaryFa: ['', '', '']
    },
    immediateCorrectionFa: '',
    productDisposition: 'quarantine',
    reportedBy: 'مهندس سارا رستمی (آنالیست QC)',
    status: 'open'
  });

  // New CAPA Form State
  const [newCapa, setNewCapa] = useState<Partial<QCCAPAAction>>({
    capaNumber: `CAPA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    deviationId: deviations[0]?.id || '',
    actionType: 'both',
    titleFa: '',
    actionPlanFa: '',
    rootCauseAddressedFa: '',
    assignedTo: 'مهندس علی کاظمی (سوپروایزر QC)',
    targetCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: 'in_progress',
    effectivenessReview: {
      isEffective: true,
      evidenceNotesFa: ''
    }
  });

  const handleCreateDeviationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviation.titleFa || !newDeviation.descriptionFa) return;

    const devToSave: QCDeviation = {
      id: `dev-${Date.now()}`,
      deviationNumber: newDeviation.deviationNumber || `DEV-${Date.now()}`,
      dateReported: newDeviation.dateReported || new Date().toISOString().slice(0, 10),
      severity: newDeviation.severity || 'major',
      sourceType: newDeviation.sourceType || 'oos_result',
      titleFa: newDeviation.titleFa,
      descriptionFa: newDeviation.descriptionFa,
      rootCauseAnalysisFa: {
        category: newDeviation.rootCauseAnalysisFa?.category || 'machine',
        rootCauseSummaryFa: newDeviation.rootCauseAnalysisFa?.rootCauseSummaryFa || 'بررسی اولیه انجام شد.',
        fiveWhysSummaryFa: newDeviation.rootCauseAnalysisFa?.fiveWhysSummaryFa?.filter(Boolean)
      },
      immediateCorrectionFa: newDeviation.immediateCorrectionFa || 'ایزولاسیون و الصاق برچسب قرنطینه بر روی بهمن.',
      productDisposition: newDeviation.productDisposition || 'quarantine',
      reportedBy: newDeviation.reportedBy || 'کارشناس QC',
      status: 'investigating'
    };

    onAddDeviation(devToSave);
    setIsDeviationModalOpen(false);
  };

  const handleCreateCapaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCapa.titleFa || !newCapa.actionPlanFa) return;

    const capaToSave: QCCAPAAction = {
      id: `capa-${Date.now()}`,
      capaNumber: newCapa.capaNumber || `CAPA-${Date.now()}`,
      deviationId: newCapa.deviationId || deviations[0]?.id || '',
      actionType: newCapa.actionType || 'both',
      titleFa: newCapa.titleFa,
      actionPlanFa: newCapa.actionPlanFa,
      rootCauseAddressedFa: newCapa.rootCauseAddressedFa || '',
      assignedTo: newCapa.assignedTo || 'کارشناس تضمین کیفیت',
      targetCompletionDate: newCapa.targetCompletionDate || new Date().toISOString().slice(0, 10),
      status: 'in_progress',
      effectivenessReview: {
        isEffective: false,
        evidenceNotesFa: 'در انتظار اتمام مهلت اقدام و ارزیابی اثربخشی ۳۰ روزه.'
      }
    };

    onAddCapa(capaToSave);
    setIsCapaModalOpen(false);
  };

  const getSeverityBadge = (severity: QCDeviation['severity']) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">بحرانی (Critical)</span>;
      case 'major':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">عمده (Major)</span>;
      case 'minor':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">جزئی (Minor)</span>;
    }
  };

  const getDeviationStatusBadge = (status: QCDeviation['status']) => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">باز (Open)</span>;
      case 'investigating':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">در حال تحلیل ریشه‌ای</span>;
      case 'capa_assigned':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">دارای اقدام اصلاحی (CAPA)</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">مختومه (Closed)</span>;
    }
  };

  const getCapaStatusBadge = (status: QCCAPAAction['status']) => {
    switch (status) {
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">در حال اجرا (In Progress)</span>;
      case 'verified_closed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">اثربخشی تایید و مختومه</span>;
      case 'pending_review':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">در انتظار ارزیابی اثربخشی</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">پیش‌نویس</span>;
    }
  };

  return (
    <div id="deviation-capa-manager-container" className="space-y-6">
      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('deviations')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'deviations'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>ثبت و مدیریت انحرافات (Deviations & OOS)</span>
            <span className="bg-slate-200 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
              {deviations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('capas')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'capas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span>اقدامات اصلاحی و پیشگیرانه (CAPA)</span>
            <span className="bg-slate-200 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
              {capas.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'deviations' ? (
            <button
              onClick={() => setIsDeviationModalOpen(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت عدم انطباق جدید</span>
            </button>
          ) : (
            <button
              onClick={() => setIsCapaModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>ایجاد CAPA جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* DEVIATIONS LIST */}
      {activeTab === 'deviations' && (
        <div className="space-y-4">
          {deviations.map((dev) => (
            <div key={dev.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                    {dev.deviationNumber}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {dev.titleFa}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {getSeverityBadge(dev.severity)}
                  {getDeviationStatusBadge(dev.status)}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 leading-relaxed">
                {dev.descriptionFa}
              </p>

              {/* Root Cause & 5 Whys Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  تحلیل ریشه‌ای (Root Cause Analysis - دسته‌بندی: {
                    dev.rootCauseAnalysisFa.category === 'machine' ? 'تجهیزات و ماشین‌آلات (Machine)' :
                    dev.rootCauseAnalysisFa.category === 'man' ? 'عامل انسانی و اپراتوری (Man)' :
                    dev.rootCauseAnalysisFa.category === 'material' ? 'ماده اولیه و فرمولاسیون (Material)' :
                    dev.rootCauseAnalysisFa.category === 'method' ? 'روش آزمون و استاندارد (Method)' : 'کالیبراسیون و سنجش (Measurement)'
                  }):
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {dev.rootCauseAnalysisFa.rootCauseSummaryFa}
                </p>

                {dev.rootCauseAnalysisFa.fiveWhysSummaryFa && dev.rootCauseAnalysisFa.fiveWhysSummaryFa.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-1">
                    <span className="text-[11px] font-bold text-slate-600 block">گام‌های تحلیل ۵ چرا (5-Whys):</span>
                    {dev.rootCauseAnalysisFa.fiveWhysSummaryFa.map((why, wIdx) => (
                      <div key={wIdx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <span className="font-bold text-indigo-600 shrink-0">{wIdx + 1}.</span>
                        <span>{why}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Immediate Action & Disposition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-950 block">اقدام فوری و قرنطینه (Immediate Containment):</span>
                  <p className="text-amber-900">{dev.immediateCorrectionFa}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">تصمیم‌گیری بهمن:</span>
                    <span className="font-bold text-rose-700 font-mono">
                      {dev.productDisposition === 'quarantine' ? 'قرنطینه کامل' : dev.productDisposition === 'rework' ? 'بازفرآوری (Rework)' : 'ابطال و امحاء'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">گزارش‌دهنده: {dev.reportedBy} | تاریخ: {dev.dateReported}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CAPAS LIST */}
      {activeTab === 'capas' && (
        <div className="space-y-4">
          {capas.map((capa) => (
            <div key={capa.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-lg border border-indigo-200">
                    {capa.capaNumber}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {capa.titleFa}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                    {capa.actionType === 'both' ? 'اصلاحی و پیشگیرانه' : capa.actionType === 'corrective' ? 'اقدام اصلاحی' : 'اقدام پیشگیرانه'}
                  </span>
                  {getCapaStatusBadge(capa.status)}
                </div>
              </div>

              {/* Action Plan */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-800 block">برنامه اقدام مصوب (Action Plan):</span>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-medium">
                  {capa.actionPlanFa}
                </p>
              </div>

              {/* Responsible Person & Deadlines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span><strong>مسئول اجرا:</strong> {capa.assignedTo}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 font-mono">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span><strong>مهلت اقدام:</strong> {capa.targetCompletionDate}</span>
                </div>
              </div>

              {/* Effectiveness Review Card (ISO 17025 Requirement) */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ارزیابی اثربخشی پس از اجرا (Effectiveness Verification):
                  </span>
                  {capa.effectivenessReview.reviewDate && (
                    <span className="font-mono text-emerald-800 text-[11px]">
                      تاریخ ممیزی: {capa.effectivenessReview.reviewDate}
                    </span>
                  )}
                </div>
                <p className="text-emerald-900 leading-relaxed">
                  {capa.effectivenessReview.evidenceNotesFa || 'در انتظار پایان اجرای برنامه و ارزیابی شواهد اثربخشی.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: CREATE NEW DEVIATION */}
      {isDeviationModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                ثبت گزارش عدم انطباق و انحراف فرآیند (Deviation Report)
              </h3>
              <button onClick={() => setIsDeviationModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateDeviationSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">شماره گزارش انحراف</label>
                  <input
                    type="text"
                    required
                    value={newDeviation.deviationNumber}
                    onChange={(e) => setNewDeviation({ ...newDeviation, deviationNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">سطح شدت انحراف</label>
                  <select
                    value={newDeviation.severity}
                    onChange={(e) => setNewDeviation({ ...newDeviation, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="critical">بحرانی (Critical) - توقف فوری خط</option>
                    <option value="major">عمده (Major) - قرنطینه بهمن</option>
                    <option value="minor">جزئی (Minor) - اقدام اصلاحی درون‌واحدی</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان انحراف</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: عدد پراکسید روغن سرخ‌کردنی فراتر از سقف ۲.۰ استاندارد INSO 4152"
                  value={newDeviation.titleFa}
                  onChange={(e) => setNewDeviation({ ...newDeviation, titleFa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">شرح دقیق واقعه و مشاهدات</label>
                <textarea
                  rows={3}
                  required
                  placeholder="شرح شرایط وقوع، شماره بهمن، نتایج آزمون و مشاهدات عینی..."
                  value={newDeviation.descriptionFa}
                  onChange={(e) => setNewDeviation({ ...newDeviation, descriptionFa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تحلیل علت ریشه‌ای اولیه (Root Cause Summary)</label>
                <textarea
                  rows={2}
                  placeholder="تحلیل مهندسی علت بروز ریشه‌ای واقعه..."
                  value={newDeviation.rootCauseAnalysisFa?.rootCauseSummaryFa}
                  onChange={(e) => setNewDeviation({
                    ...newDeviation,
                    rootCauseAnalysisFa: {
                      ...newDeviation.rootCauseAnalysisFa!,
                      rootCauseSummaryFa: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اقدام فوری و مهار واقعه (Immediate Containment)</label>
                <input
                  type="text"
                  placeholder="مثال: الصاق برچسب قرنطینه و مسدودسازی خروج بهمن از انبار"
                  value={newDeviation.immediateCorrectionFa}
                  onChange={(e) => setNewDeviation({ ...newDeviation, immediateCorrectionFa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeviationModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs"
                >
                  ثبت رسمی گزارش عدم انطباق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW CAPA */}
      {isCapaModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                تعریف اقدام اصلاحی و پیشگیرانه (CAPA Plan)
              </h3>
              <button onClick={() => setIsCapaModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateCapaSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">شماره CAPA</label>
                  <input
                    type="text"
                    required
                    value={newCapa.capaNumber}
                    onChange={(e) => setNewCapa({ ...newCapa, capaNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع اقدام</label>
                  <select
                    value={newCapa.actionType}
                    onChange={(e) => setNewCapa({ ...newCapa, actionType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="both">اصلاحی و پیشگیرانه (CAPA)</option>
                    <option value="corrective">صرفاً اقدام اصلاحی (Corrective)</option>
                    <option value="preventive">صرفاً اقدام پیشگیرانه (Preventive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان برنامه اقدام</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: بازطراحی سیستم تزریق نیتروژن و نصب آلارم افت فشار"
                  value={newCapa.titleFa}
                  onChange={(e) => setNewCapa({ ...newCapa, titleFa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">شرح کامل برنامه اجرایی گام‌به‌گام</label>
                <textarea
                  rows={3}
                  required
                  placeholder="۱. تعویض قطعه معیوب\n۲. آموزش مجدد اپراتورها\n۳. اصلاح SOP و چک‌لیست PM"
                  value={newCapa.actionPlanFa}
                  onChange={(e) => setNewCapa({ ...newCapa, actionPlanFa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">مسئول اجرا (Assignee)</label>
                  <input
                    type="text"
                    required
                    placeholder="نام مسئول"
                    value={newCapa.assignedTo}
                    onChange={(e) => setNewCapa({ ...newCapa, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">مهلت تکمیل</label>
                  <input
                    type="date"
                    required
                    value={newCapa.targetCompletionDate}
                    onChange={(e) => setNewCapa({ ...newCapa, targetCompletionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCapaModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
                >
                  تصویب و ابلاغ CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
