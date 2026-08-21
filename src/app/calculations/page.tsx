import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { 
  Calculator, 
  BarChart3, 
  ArrowRightLeft, 
  Sparkles, 
  ShieldCheck, 
  FlaskConical,
  BookOpen
} from 'lucide-react';
import { FoodFormulaCalculator } from '../../components/calculations/FoodFormulaCalculator';
import { StatisticalCalculator } from '../../components/calculations/StatisticalCalculator';
import { UnitConverterTool } from '../../components/calculations/UnitConverterTool';
import { CustomFormulaBuilder } from '../../components/calculations/CustomFormulaBuilder';
import { EngineTestRunner } from '../../components/calculations/EngineTestRunner';

type TabType = 'food_formulas' | 'statistics' | 'unit_converter' | 'custom_builder' | 'self_tests';

export const CalculationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('food_formulas');

  const tabs: { id: TabType; titleFa: string; titleEn: string; icon: React.ReactNode }[] = [
    {
      id: 'food_formulas',
      titleFa: 'فرمول‌های آزمون مواد غذایی',
      titleEn: 'Standard Food Formulas',
      icon: <FlaskConical className="w-4 h-4" />
    },
    {
      id: 'statistics',
      titleFa: 'آمار تکرارها و کنترل خطا',
      titleEn: 'Statistics & Error Control',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'unit_converter',
      titleFa: 'مبدل واحدهای آزمایشگاهی',
      titleEn: 'Lab Unit Converter',
      icon: <ArrowRightLeft className="w-4 h-4" />
    },
    {
      id: 'custom_builder',
      titleFa: 'طراحی فرمول‌های جدید',
      titleEn: 'Custom Formula Builder',
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      id: 'self_tests',
      titleFa: 'تست‌های صحت‌سنجی موتور',
      titleEn: 'Engine Self-Tests',
      icon: <ShieldCheck className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="موتور محاسبات و کنترل خطای آزمایشگاهی"
        englishTitle="/calculations — Food Laboratory Calculation & Error Control Engine"
        description="موتور مستقل محاسبات شیمی تجزیه و کنترل خطای آزمایشگاهی با پشتیبانی از استانداردهای ملی و بین‌المللی، تبدیل واحد، تحلیل آماری تکرارها، و ردپای شفاف محاسباتی (Traceability)."
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'محاسبات و کنترل خطا' }
        ]}
      />

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-1.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                {tab.icon}
                <span>{tab.titleFa}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === 'food_formulas' && <FoodFormulaCalculator />}
        {activeTab === 'statistics' && <StatisticalCalculator />}
        {activeTab === 'unit_converter' && <UnitConverterTool />}
        {activeTab === 'custom_builder' && <CustomFormulaBuilder />}
        {activeTab === 'self_tests' && <EngineTestRunner />}
      </div>
    </div>
  );
};

export default CalculationsPage;
