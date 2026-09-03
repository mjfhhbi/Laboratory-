import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  Thermometer, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Tag, 
  Layers,
  FlaskConical,
  Sparkles,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { QCSample, QCProductionBatch } from '../../types/qualityControl';
import { FOOD_STANDARD_SECTORS } from '../../types/foodStandard';

interface SampleBatchManagerProps {
  batches: QCProductionBatch[];
  samples: QCSample[];
  onAddBatch: (batch: QCProductionBatch) => void;
  onAddSample: (sample: QCSample) => void;
  onSelectSampleForTest: (sample: QCSample) => void;
  onUpdateBatchStatus: (batchNumber: string, newStatus: QCProductionBatch['status']) => void;
}

export const SampleBatchManager: React.FC<SampleBatchManagerProps> = ({
  batches,
  samples,
  onAddBatch,
  onAddSample,
  onSelectSampleForTest,
  onUpdateBatchStatus
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'samples' | 'batches'>('samples');
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // New Sample Modal State
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [newSample, setNewSample] = useState<Partial<QCSample>>({
    sampleCode: `SMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    productNameFa: '',
    productNameEn: '',
    sector: 'dairy',
    batchNumber: batches[0]?.batchNumber || '',
    samplingDateTime: new Date().toISOString().slice(0, 16),
    samplingLocationFa: '',
    samplerNameFa: '',
    sampleMatrixFa: '',
    sampleTemperatureCelsius: 4,
    storageConditionFa: 'یخچال ۴ درجه',
    sampleState: 'fresh',
    retainedSampleLocation: 'قفسه آزمایشگاه'
  });

  // New Batch Modal State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [newBatch, setNewBatch] = useState<Partial<QCProductionBatch>>({
    batchNumber: `BATCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    productNameFa: '',
    productionDate: new Date().toISOString().slice(0, 10),
    expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    batchSize: 5000,
    batchUnit: 'liter',
    productionLine: 'خط شماره ۱',
    shift: 'morning',
    status: 'in_quarantine'
  });

  // Filtered Samples
  const filteredSamples = samples.filter((s) => {
    if (sectorFilter !== 'all' && s.sector !== sectorFilter) return false;
    if (statusFilter !== 'all' && s.sampleState !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        s.sampleCode.toLowerCase().includes(term) ||
        s.productNameFa.toLowerCase().includes(term) ||
        s.batchNumber.toLowerCase().includes(term) ||
        s.samplingLocationFa.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Filtered Batches
  const filteredBatches = batches.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        b.batchNumber.toLowerCase().includes(term) ||
        b.productNameFa.toLowerCase().includes(term) ||
        b.productionLine.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleCreateSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSample.productNameFa || !newSample.batchNumber) return;

    const sampleToSave: QCSample = {
      id: `smp-${Date.now()}`,
      sampleCode: newSample.sampleCode || `SMP-${Date.now()}`,
      productNameFa: newSample.productNameFa,
      productNameEn: newSample.productNameEn || '',
      sector: newSample.sector || 'dairy',
      batchNumber: newSample.batchNumber,
      samplingDateTime: newSample.samplingDateTime || new Date().toISOString(),
      samplingLocationFa: newSample.samplingLocationFa || 'خط تولید',
      samplerNameFa: newSample.samplerNameFa || 'کارشناس QC',
      sampleMatrixFa: newSample.sampleMatrixFa || 'مایع غذایی',
      sampleTemperatureCelsius: newSample.sampleTemperatureCelsius,
      storageConditionFa: newSample.storageConditionFa || 'دمای محیط',
      sampleState: newSample.sampleState || 'fresh',
      retainedSampleLocation: newSample.retainedSampleLocation || 'آزمایشگاه'
    };

    onAddSample(sampleToSave);
    setIsSampleModalOpen(false);
  };

  const handleCreateBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.batchNumber || !newBatch.productNameFa) return;

    const batchToSave: QCProductionBatch = {
      batchNumber: newBatch.batchNumber,
      productNameFa: newBatch.productNameFa,
      productionDate: newBatch.productionDate || new Date().toISOString().slice(0, 10),
      expirationDate: newBatch.expirationDate || new Date().toISOString().slice(0, 10),
      batchSize: newBatch.batchSize || 1000,
      batchUnit: newBatch.batchUnit || 'liter',
      productionLine: newBatch.productionLine || 'خط ۱',
      shift: newBatch.shift || 'morning',
      status: newBatch.status || 'in_quarantine'
    };

    onAddBatch(batchToSave);
    setIsBatchModalOpen(false);
  };

  const getBatchStatusBadge = (status: QCProductionBatch['status']) => {
    switch (status) {
      case 'released':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> ترخیص‌شده (Released)</span>;
      case 'in_quarantine':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300"><AlertCircle className="w-3 h-3 text-amber-600" /> در قرنطینه آزمایشگاه</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300"><XCircle className="w-3 h-3 text-rose-600" /> ردشده (Rejected)</span>;
      case 'rework':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300"><Layers className="w-3 h-3 text-purple-600" /> بازفرآوری (Rework)</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">در انتظار</span>;
    }
  };

  const getSampleStateBadge = (state: QCSample['sampleState']) => {
    switch (state) {
      case 'approved':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">تایید نهایی</span>;
      case 'under_analysis':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">در حال آنالیز</span>;
      case 'quarantined':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">قرنطینه</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">مردود</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">تازه دریافت شده</span>;
    }
  };

  return (
    <div id="sample-batch-manager-container" className="space-y-6">
      {/* Top Action & Sub-Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Toggle between Samples and Batches */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            id="tab-sub-samples"
            onClick={() => setActiveSubTab('samples')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'samples'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>مدیریت نمونه‌ها (Samples)</span>
            <span className="bg-slate-200 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
              {samples.length}
            </span>
          </button>

          <button
            id="tab-sub-batches"
            onClick={() => setActiveSubTab('batches')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'batches'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>بهمن‌های تولیدی (Batches)</span>
            <span className="bg-slate-200 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
              {batches.length}
            </span>
          </button>
        </div>

        {/* Action Buttons to open Modals */}
        <div className="flex items-center gap-2">
          <button
            id="btn-open-add-sample-modal"
            onClick={() => setIsSampleModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت نمونه جدید</span>
          </button>

          <button
            id="btn-open-add-batch-modal"
            onClick={() => setIsBatchModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>تعریف بهمن جدید</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="جستجوی کد نمونه، شماره بهمن یا نام محصول..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {activeSubTab === 'samples' && (
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="all">همه بخش‌های صنایع غذایی</option>
            {Object.values(FOOD_STANDARD_SECTORS).map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.titleFa}
              </option>
            ))}
          </select>
        )}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          <option value="all">همه وضعیت‌ها</option>
          {activeSubTab === 'batches' ? (
            <>
              <option value="released">ترخیص‌شده (Released)</option>
              <option value="in_quarantine">در قرنطینه (Quarantine)</option>
              <option value="rejected">ردشده (Rejected)</option>
              <option value="rework">بازفرآوری (Rework)</option>
            </>
          ) : (
            <>
              <option value="fresh">تازه دریافت شده</option>
              <option value="under_analysis">در حال آنالیز</option>
              <option value="approved">تایید نهایی</option>
              <option value="quarantined">قرنطینه</option>
              <option value="rejected">مردود</option>
            </>
          )}
        </select>
      </div>

      {/* SAMPLES TABLE VIEW */}
      {activeSubTab === 'samples' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <th className="py-3 px-4">کد نمونه (Sample ID)</th>
                  <th className="py-3 px-4">نام فرآورده و ماتریس</th>
                  <th className="py-3 px-4">شماره بهمن (Batch)</th>
                  <th className="py-3 px-4">محل و شرایط نمونه‌برداری</th>
                  <th className="py-3 px-4">تاریخ و زمان</th>
                  <th className="py-3 px-4">وضعیت</th>
                  <th className="py-3 px-4 text-center">عملیات آزمایشگاه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSamples.length > 0 ? (
                  filteredSamples.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                        {s.sampleCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{s.productNameFa}</div>
                        <div className="text-[11px] text-slate-500">{s.sampleMatrixFa}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700 font-medium">
                        {s.batchNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{s.samplingLocationFa}</span>
                        </div>
                        {s.sampleTemperatureCelsius !== undefined && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                            <Thermometer className="w-3 h-3 text-slate-400" />
                            <span>دمای نمونه: {s.sampleTemperatureCelsius}°C</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]" dir="ltr">
                        {s.samplingDateTime.replace('T', ' ')}
                      </td>
                      <td className="py-3.5 px-4">
                        {getSampleStateBadge(s.sampleState)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          id={`btn-log-test-${s.id}`}
                          onClick={() => onSelectSampleForTest(s)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs border border-indigo-200 transition-colors inline-flex items-center gap-1 shadow-xs"
                        >
                          <FlaskConical className="w-3.5 h-3.5" />
                          ثبت نتایج آزمون
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      هیچ نمونه‌ای منطبق با فیلتر یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BATCHES TABLE VIEW */}
      {activeSubTab === 'batches' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <th className="py-3 px-4">شماره بهمن (Batch Number)</th>
                  <th className="py-3 px-4">نام محصول</th>
                  <th className="py-3 px-4">حجم / تناژ بهره</th>
                  <th className="py-3 px-4">خط تولید و شیفت</th>
                  <th className="py-3 px-4">تاریخ تولید و انقضاء</th>
                  <th className="py-3 px-4">وضعیت ترخیص QA</th>
                  <th className="py-3 px-4 text-center">تغییر وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBatches.length > 0 ? (
                  filteredBatches.map((b) => (
                    <tr key={b.batchNumber} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {b.batchNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {b.productNameFa}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {b.batchSize.toLocaleString()} {b.batchUnit}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{b.productionLine}</div>
                        <div className="text-[11px] text-slate-400">شیفت {b.shift === 'morning' ? 'صبح' : b.shift === 'evening' ? 'عصر' : 'شب'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        <div>تولید: {b.productionDate}</div>
                        <div>انقضاء: {b.expirationDate}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {getBatchStatusBadge(b.status)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={b.status}
                          onChange={(e) => onUpdateBatchStatus(b.batchNumber, e.target.value as any)}
                          className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="in_quarantine">قرنطینه (Quarantine)</option>
                          <option value="released">ترخیص (Release)</option>
                          <option value="rejected">رد (Reject)</option>
                          <option value="rework">بازفرآوری (Rework)</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      هیچ بهمن تولیدی یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SAMPLE */}
      {isSampleModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-indigo-600" />
                ثبت مشخصات نمونه جدید آزمایشگاه
              </h3>
              <button onClick={() => setIsSampleModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateSampleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">کد یکتای نمونه</label>
                  <input
                    type="text"
                    required
                    value={newSample.sampleCode}
                    onChange={(e) => setNewSample({ ...newSample, sampleCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">بهمن تولیدی مربوطه</label>
                  <select
                    value={newSample.batchNumber}
                    onChange={(e) => {
                      const selBatch = batches.find(b => b.batchNumber === e.target.value);
                      setNewSample({
                        ...newSample,
                        batchNumber: e.target.value,
                        productNameFa: selBatch ? selBatch.productNameFa : newSample.productNameFa
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-medium"
                  >
                    {batches.map(b => (
                      <option key={b.batchNumber} value={b.batchNumber}>
                        {b.batchNumber} ({b.productNameFa})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نام فرآورده غذایی</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شیر پاستوریزه ۳٪ چربی"
                    value={newSample.productNameFa}
                    onChange={(e) => setNewSample({ ...newSample, productNameFa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">بخش صنایع غذایی</label>
                  <select
                    value={newSample.sector}
                    onChange={(e) => setNewSample({ ...newSample, sector: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                  >
                    {Object.values(FOOD_STANDARD_SECTORS).map(sec => (
                      <option key={sec.id} value={sec.id}>{sec.titleFa}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">محل نمونه‌برداری</label>
                  <input
                    type="text"
                    placeholder="مثال: خروجی تانک ذخیره شماره ۳"
                    value={newSample.samplingLocationFa}
                    onChange={(e) => setNewSample({ ...newSample, samplingLocationFa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">نام نمونه‌بردار</label>
                  <input
                    type="text"
                    placeholder="نام کارشناس"
                    value={newSample.samplerNameFa}
                    onChange={(e) => setNewSample({ ...newSample, samplerNameFa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاریخ و ساعت نمونه‌برداری</label>
                  <input
                    type="datetime-local"
                    value={newSample.samplingDateTime}
                    onChange={(e) => setNewSample({ ...newSample, samplingDateTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">دمای نمونه (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSample.sampleTemperatureCelsius}
                    onChange={(e) => setNewSample({ ...newSample, sampleTemperatureCelsius: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSampleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
                >
                  ثبت نمونه در پایگاه داده
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE BATCH */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Boxes className="w-5 h-5 text-indigo-600" />
                تعریف بهمن تولیدی جدید (Production Batch)
              </h3>
              <button onClick={() => setIsBatchModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateBatchSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">شماره بهمن (Batch No)</label>
                  <input
                    type="text"
                    required
                    value={newBatch.batchNumber}
                    onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">نام محصول</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: رب گوجه‌فرنگی بریکس ۲۸"
                    value={newBatch.productNameFa}
                    onChange={(e) => setNewBatch({ ...newBatch, productNameFa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اندازه بهمن</label>
                  <input
                    type="number"
                    value={newBatch.batchSize}
                    onChange={(e) => setNewBatch({ ...newBatch, batchSize: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">واحد اندازه‌گیری</label>
                  <select
                    value={newBatch.batchUnit}
                    onChange={(e) => setNewBatch({ ...newBatch, batchUnit: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="liter">لیتر (Liter)</option>
                    <option value="kg">کیلوگرم (kg)</option>
                    <option value="ton">تن (Ton)</option>
                    <option value="package">بسته / قوطی (Package)</option>
                    <option value="carton">کارتن (Carton)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاریخ تولید</label>
                  <input
                    type="date"
                    value={newBatch.productionDate}
                    onChange={(e) => setNewBatch({ ...newBatch, productionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاریخ انقضاء</label>
                  <input
                    type="date"
                    value={newBatch.expirationDate}
                    onChange={(e) => setNewBatch({ ...newBatch, expirationDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xs"
                >
                  ذخیره بهمن تولیدی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
