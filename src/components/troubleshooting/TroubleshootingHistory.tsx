import React, { useState, useEffect } from 'react';
import { 
  Archive, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Eye, 
  Trash2, 
  Printer, 
  ArrowRight,
  ShieldAlert,
  Tag,
  BookOpen
} from 'lucide-react';
import { 
  LabTroubleshootingSession, 
  LAB_ERROR_CATEGORIES, 
  LabErrorCategory 
} from '../../types/troubleshooting';
import { getAllItems, deleteItem, STORES } from '../../lib/storage/indexedDb';

interface Props {
  onSelectSession?: (session: LabTroubleshootingSession) => void;
  onNewSession?: () => void;
}

export const TroubleshootingHistory: React.FC<Props> = ({ onSelectSession, onNewSession }) => {
  const [sessions, setSessions] = useState<LabTroubleshootingSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSessionForView, setSelectedSessionForView] = useState<LabTroubleshootingSession | null>(null);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const records = (await getAllItems(STORES.KNOWLEDGE_BASE)) as any[];
      const parsed: LabTroubleshootingSession[] = records
        .filter(r => r && r.category === 'common_errors' && r.content)
        .map(r => {
          try {
            return JSON.parse(r.content);
          } catch {
            return null;
          }
        })
        .filter((s): s is LabTroubleshootingSession => s !== null && !!s.experimentId);

      // Sort newest first
      parsed.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setSessions(parsed);
    } catch (e) {
      console.error('Failed to load sessions', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('آیا از حذف این پرونده عیب‌یابی اطمینان دارید؟')) return;
    try {
      await deleteItem(STORES.KNOWLEDGE_BASE, id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (selectedSessionForView?.id === id) {
        setSelectedSessionForView(null);
      }
    } catch (err) {
      console.error('Failed to delete session', err);
    }
  };

  const filteredSessions = sessions.filter(s => {
    const matchesSearch =
      (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.experimentNameFa || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.userActionDescription || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.primaryError?.titleFa || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.capaRecord?.ncrNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      s.primaryError?.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100">
              سوابق عیب‌یابی و پرونده‌های عدم انطباق (CAPA Log)
            </h3>
            <p className="text-[11px] text-stone-500">
              {sessions.length} پرونده ثبت‌شده در پایگاه داده محلی آزمایشگاه
            </p>
          </div>
        </div>

        <button
          onClick={onNewSession}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>شروع عیب‌یابی جدید</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجو در آزمون‌ها، نشانه‌ها، شماره NCR یا علل ریشه‌ای..."
            className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl pr-9 pl-3 py-2 text-xs text-stone-800 dark:text-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-800 dark:text-stone-200 outline-none"
          >
            <option value="all">همه دسته‌بندی‌های خطا (۱۱ دسته)</option>
            {Object.values(LAB_ERROR_CATEGORIES).map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nameFa}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-stone-400">در حال بارگذاری پرونده‌ها...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
          <Archive className="w-8 h-8 text-stone-300 mx-auto" />
          <p className="text-xs text-stone-500">هیچ پرونده عیب‌یابی مطابق با جستجو یافت نشد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map(sess => {
            const catMeta = sess.primaryError ? LAB_ERROR_CATEGORIES[sess.primaryError.category] : null;
            return (
              <div
                key={sess.id}
                onClick={() => setSelectedSessionForView(sess)}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/70 p-4 rounded-xl shadow-xs transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                        {sess.experimentNameFa}
                      </span>
                      {sess.capaRecord && (
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                          {sess.capaRecord.ncrNumber}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(sess.updatedAt).toLocaleDateString('fa-IR')}
                      </span>
                      {catMeta && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border ${catMeta.badgeColor}`}>
                          {catMeta.nameFa}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={e => handleDeleteSession(sess.id, e)}
                    className="text-stone-300 hover:text-rose-600 p-1"
                    title="حذف پرونده"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {sess.primaryError && (
                  <div className="bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700/80 text-xs space-y-1">
                    <div className="font-bold text-stone-800 dark:text-stone-200 line-clamp-1">
                      علت: {sess.primaryError.titleFa}
                    </div>
                    <div className="text-[11px] text-stone-500 line-clamp-2">
                      اقدام اصلاحی: {sess.primaryError.correctiveActionFa}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] pt-1 text-stone-400">
                  <span>منبع: {sess.primaryError?.source.standardCode || 'ISO 17025'}</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    مشاهده جزئیات
                    <ArrowRight className="w-3 h-3 rotate-180" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Viewing Full Troubleshooting Record & Printing NCR */}
      {selectedSessionForView && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  برگه رسمی گزارش عدم انطباق آزمایشگاه (ISO 17025 NCR)
                </span>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {selectedSessionForView.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSessionForView(null)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                <div>
                  <span className="text-stone-400">کد آزمون استاندارد:</span>
                  <div className="font-bold text-stone-800 dark:text-stone-200 font-mono">
                    {selectedSessionForView.experimentStandardCode || 'INSO / AOAC'}
                  </div>
                </div>
                <div>
                  <span className="text-stone-400">شماره NCR:</span>
                  <div className="font-bold text-emerald-600 font-mono">
                    {selectedSessionForView.capaRecord?.ncrNumber || 'NCR-PENDING'}
                  </div>
                </div>
              </div>

              {selectedSessionForView.primaryError && (
                <div className="space-y-3 bg-stone-50 dark:bg-stone-800/40 p-4 rounded-xl border border-stone-200 dark:border-stone-700">
                  <div>
                    <span className="font-bold text-rose-800 dark:text-rose-300">علت احتمالی ریشه‌ای:</span>
                    <p className="text-stone-700 dark:text-stone-300 mt-0.5 leading-relaxed">
                      {selectedSessionForView.primaryError.probableCauseFa}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">اقدام اصلاحی فوری:</span>
                    <p className="text-stone-700 dark:text-stone-300 mt-0.5 leading-relaxed">
                      {selectedSessionForView.primaryError.correctiveActionFa}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-indigo-800 dark:text-indigo-300">روش پیشگیری:</span>
                    <p className="text-stone-700 dark:text-stone-300 mt-0.5 leading-relaxed">
                      {selectedSessionForView.primaryError.preventiveActionFa}
                    </p>
                  </div>

                  <div className="border-t border-stone-200 dark:border-stone-700 pt-2 text-[11px] text-stone-500">
                    منبع علمی استاندارد: {selectedSessionForView.primaryError.source.fullCitation}
                  </div>
                </div>
              )}
            </div>

            {/* Print / Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                چاپ برگه عدم انطباق
              </button>
              <button
                onClick={() => setSelectedSessionForView(null)}
                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
