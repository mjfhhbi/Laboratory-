import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { 
  Calculator, 
  BarChart3, 
  ArrowRightLeft, 
  Sparkles, 
  ShieldCheck, 
  FlaskConical,
  Sigma
} from 'lucide-react';
import { FoodFormulaCalculator } from '../../components/calculations/FoodFormulaCalculator';
import { StatisticalCalculator } from '../../components/calculations/StatisticalCalculator';
import { UnitConverterTool } from '../../components/calculations/UnitConverterTool';
import { CustomFormulaBuilder } from '../../components/calculations/CustomFormulaBuilder';
import { EngineTestRunner } from '../../components/calculations/EngineTestRunner';
import { MscEngineeringSuite } from '../../components/calculations/MscEngineeringSuite';
import { ThermalProcessingSuite } from '../../components/calculations/ThermalProcessingSuite';
import { RheologyFluidMechanicsSuite } from '../../components/calculations/RheologyFluidMechanicsSuite';
import { MoistureIsothermSuite } from '../../components/calculations/MoistureIsothermSuite';
import { FoodFreezingThawingSuite } from '../../components/calculations/FoodFreezingThawingSuite';
import { FormulationOptimizerSuite } from '../../components/calculations/FormulationOptimizerSuite';
import { Flame, Activity, Droplets, Snowflake, Scale } from 'lucide-react';

type TabType = 'formulation_optimization' | 'freezing_thawing' | 'moisture_isotherms' | 'thermal_processing' | 'rheology_fluids' | 'msc_advanced' | 'food_formulas' | 'statistics' | 'unit_converter' | 'custom_builder' | 'self_tests';

export const CalculationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('formulation_optimization');

  const tabs: { id: TabType; titleFa: string; titleEn: string; icon: React.ReactNode }[] = [
    {
      id: 'formulation_optimization',
      titleFa: 'بهینه‌سازی فرمولاسیون (سیمپلکس و LP)',
      titleEn: 'Least-Cost Formulation LP',
      icon: <Scale className="w-4 h-4 text-emerald-500" />
    },
    {
      id: 'freezing_thawing',
      titleFa: 'انجماد و ذوب (پلانک و کللند)',
      titleEn: 'Freezing, Thawing & Heat Transfer',
      icon: <Snowflake className="w-4 h-4 text-cyan-500" />
    },
    {
      id: 'moisture_isotherms',
      titleFa: 'ایزوترم‌های رطوبت (GAB / BET)',
      titleEn: 'Moisture Sorption Isotherms',
      icon: <Droplets className="w-4 h-4 text-sky-500" />
    },
    {
      id: 'thermal_processing',
      titleFa: 'فرآیندهای حرارتی و کینتیک میکروبی (D, z, F)',
      titleEn: 'Thermal Processing & Microbial Kinetics',
      icon: <Flame className="w-4 h-4 text-rose-500" />
    },
    {
      id: 'rheology_fluids',
      titleFa: 'رئولوژی و مکانیک سیالات لوله',
      titleEn: 'Food Rheology & Pipe Hydraulics',
      icon: <Activity className="w-4 h-4 text-indigo-500" />
    },
    {
      id: 'msc_advanced',
      titleFa: 'محاسبات پیشرفته مهندسی (کارشناسی ارشد)',
      titleEn: 'M.Sc. Advanced Engineering Suite',
      icon: <Sigma className="w-4 h-4" />
    },
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
        title="موتور محاسبات مهندسی و کنترل خطای آزمایشگاهی"
        englishTitle="/calculations — Food Engineering & Mathematical Computation Engine"
        description="موتور محاسبات پیشرفته کارشناسی ارشد (معادلات دیفرانسیل ODE/PDE، ماتریس‌ها، نیوتن-رافسون، پدیده‌های انتقال، راندمان اواپراتور و انجماد پلانک) به همراه محاسبات شیمی تجزیه و موازنه جرم"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'محاسبات مهندسی' }
        ]}
      />

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-1.5 shadow-xs overflow-hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap pb-0.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[44px] ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
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
        {activeTab === 'formulation_optimization' && <FormulationOptimizerSuite />}
        {activeTab === 'freezing_thawing' && <FoodFreezingThawingSuite />}
        {activeTab === 'moisture_isotherms' && <MoistureIsothermSuite />}
        {activeTab === 'thermal_processing' && <ThermalProcessingSuite />}
        {activeTab === 'rheology_fluids' && <RheologyFluidMechanicsSuite />}
        {activeTab === 'msc_advanced' && <MscEngineeringSuite />}
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
