import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { MoistureIsothermSuite } from '../../../components/calculations/MoistureIsothermSuite';

export const IsothermCalculationsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="ایزوترم‌های جذب و دفع رطوبت مواد غذایی (GAB / BET)"
        englishTitle="/calculations/isotherms — Food Moisture Sorption Isotherms"
        description="برازش غیرخطی مدل‌های استاندارد COST 90 (GAB, BET, Oswin, Smith, Langmuir, Peleg)، محاسبه رطوبت تک‌لایه m0، نقشه پایداری لابوزا، تبدیل پایه خشک و تر و کدهای بهینه‌سازی SciPy"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'محاسبات مهندسی', path: '/calculations' },
          { title: 'ایزوترم‌های رطوبت' }
        ]}
      />

      <MoistureIsothermSuite />
    </div>
  );
};

export default IsothermCalculationsPage;
