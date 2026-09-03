import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Archive, 
  ShieldCheck, 
  HelpCircle, 
  FlaskConical, 
  Sparkles,
  BookOpen,
  Info
} from 'lucide-react';
import { LabTroubleshootingWizard } from '../../components/troubleshooting/LabTroubleshootingWizard';
import { TroubleshootingHistory } from '../../components/troubleshooting/TroubleshootingHistory';
import { LabTroubleshootingSession } from '../../types/troubleshooting';

export const LabTroubleshootingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wizard' | 'history'>('wizard');
  const [selectedSessionForEditing, setSelectedSessionForEditing] = useState<LabTroubleshootingSession | null>(null);

  const handleSelectSession = (session: LabTroubleshootingSession) => {
    setSelectedSessionForEditing(session);
    setActiveTab('wizard');
  };

  const handleNewSession = () => {
    setSelectedSessionForEditing(null);
    setActiveTab('wizard');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <AlertTriangle className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              عیب‌یابی تخصصی آزمایشگاه (Laboratory Troubleshooting)
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-2xl leading-relaxed">
            سامانه استنتاجی ریشه‌یابی خطاها در آزمون‌های صنایع غذایی بر اساس استانداردهای ملی و بین‌المللی (INSO, AOAC, ISO 17025).
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200 dark:border-stone-700 shrink-0">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'wizard'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-xs border border-stone-200/50 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>میزکار عیب‌یابی و ریشه‌یابی</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-xs border border-stone-200/50 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>سوابق و گزارش‌های CAPA</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'wizard' ? (
        <LabTroubleshootingWizard
          initialSession={selectedSessionForEditing}
          onSessionSaved={() => {}}
        />
      ) : (
        <TroubleshootingHistory
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
        />
      )}
    </div>
  );
};
