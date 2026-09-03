import React, { useState } from 'react';
import { 
  Microscope, 
  FlaskConical, 
  Bug, 
  Layers, 
  Calculator, 
  ShieldAlert, 
  Sliders, 
  BookOpen,
  Sparkles,
  ShieldCheck,
  Activity,
  Thermometer,
  Dna
} from 'lucide-react';
import { MicrobiologyTestBank } from '../../components/microbiology/MicrobiologyTestBank';
import { MicroorganismDirectory } from '../../components/microbiology/MicroorganismDirectory';
import { CultureMediaDirectory } from '../../components/microbiology/CultureMediaDirectory';
import { MicrobialCalculationEngine } from '../../components/microbiology/MicrobialCalculationEngine';
import { SamplingAndEquipmentGuide } from '../../components/microbiology/SamplingAndEquipmentGuide';
import { MicrobiologyQCAndTroubleshooting } from '../../components/microbiology/MicrobiologyQCAndTroubleshooting';
import { MICROBIAL_TESTS_DATABASE, MICROORGANISMS_DATABASE, CULTURE_MEDIA_DATABASE } from '../../data/microbiologyData';

type MicrobiologyTab = 
  | 'test_bank' 
  | 'microorganisms' 
  | 'culture_media' 
  | 'calculations' 
  | 'sampling_equipment' 
  | 'troubleshooting';

const TABS: { id: MicrobiologyTab; labelFa: string; icon: any }[] = [
  { id: 'test_bank', labelFa: 'بانک آزمون‌های میکروبی (SOP)', icon: FlaskConical },
  { id: 'microorganisms', labelFa: 'اطلس میکروارگانیسم‌ها', icon: Bug },
  { id: 'culture_media', labelFa: 'محیط‌های کشت و فرمولاسیون', icon: Layers },
  { id: 'calculations', labelFa: 'موتور محاسبات (ISO 7218 & MPN)', icon: Calculator },
  { id: 'sampling_equipment', labelFa: 'نمونه‌برداری و تجهیزات', icon: Sliders },
  { id: 'troubleshooting', labelFa: 'عیب‌یابی و کنترل کیفیت (QC)', icon: ShieldAlert }
];

export const MicrobiologyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MicrobiologyTab>('test_bank');

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-right font-sans">
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <Microscope className="w-3.5 h-3.5" />
                ISO 7218 / INSO 2394 / ISO 6887 Compliant
              </span>
              <span className="text-xs text-stone-300">
                ماژول تخصصی میکروبیولوژی مواد غذایی
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              میکروبیولوژی مواد غذایی (Food Microbiology Suite)
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              بانک جامع آزمون‌های شمارش و شناسایی پاتوژن‌ها، میکروارگانیسم‌های شاخص بهداشتی و عوامل فساد بر اساس استانداردهای ملی و بین‌المللی، موتور محاسبات میانگین موزون ISO 7218 و یکپارچگی کامل با میزکار آزمایشگاه.
            </p>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-3 text-center space-y-0.5">
              <div className="text-base sm:text-lg font-mono font-black text-emerald-400">
                {MICROBIAL_TESTS_DATABASE.length}
              </div>
              <div className="text-[10px] text-stone-300">آزمون استاندارد</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-3 text-center space-y-0.5">
              <div className="text-base sm:text-lg font-mono font-black text-teal-300">
                {MICROORGANISMS_DATABASE.length}
              </div>
              <div className="text-[10px] text-stone-300">سویه و پاتوژن</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-3 text-center space-y-0.5">
              <div className="text-base sm:text-lg font-mono font-black text-emerald-300">
                {CULTURE_MEDIA_DATABASE.length}
              </div>
              <div className="text-[10px] text-stone-300">محیط کشت و بافر</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-x-auto shadow-2xs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[170px] py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-sm border border-stone-200/60 dark:border-stone-700'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400'}`} />
              <span>{tab.labelFa}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="pt-2">
        {activeTab === 'test_bank' && <MicrobiologyTestBank />}
        {activeTab === 'microorganisms' && <MicroorganismDirectory />}
        {activeTab === 'culture_media' && <CultureMediaDirectory />}
        {activeTab === 'calculations' && <MicrobialCalculationEngine />}
        {activeTab === 'sampling_equipment' && <SamplingAndEquipmentGuide />}
        {activeTab === 'troubleshooting' && <MicrobiologyQCAndTroubleshooting />}
      </div>
    </div>
  );
};
