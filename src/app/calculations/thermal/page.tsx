import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { ThermalProcessingSuite } from '../../../components/calculations/ThermalProcessingSuite';

export const ThermalCalculationsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="محاسبات فرآیندهای حرارتی و کینتیک تخریب میکروبی"
        englishTitle="/calculations/thermal — Thermal Processing & Microbial Death Kinetics"
        description="محاسبه تخصصی D-value، z-value، F-value، زمان مرگ حرارتی (TDT)، انتگرال‌گیری نفوذ حرارت با روش جنرال بیگلو و سیمپسون و مقایسه کینتیک درجه ۱ و ۰ با کدهای SciPy و NumPy"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'محاسبات مهندسی', path: '/calculations' },
          { title: 'فرآیندهای حرارتی و کینتیک میکروبی' }
        ]}
      />

      <ThermalProcessingSuite />
    </div>
  );
};

export default ThermalCalculationsPage;
