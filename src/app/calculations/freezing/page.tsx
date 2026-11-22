import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { FoodFreezingThawingSuite } from '../../../components/calculations/FoodFreezingThawingSuite';

export const FreezingCalculationsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="انتقال حرارت، زمان انجماد و فرآیندهای ذوب مواد غذایی"
        englishTitle="/calculations/freezing — Food Freezing, Thawing & Heat Transfer"
        description="محاسبه زمان انجماد با مدل پلانک، کللند و ارل و فام، تحلیل اعداد بدون بعد بیوت و استفان، وارونگی هدایت حرارتی در ذوب، منحنی دما-زمان و کدهای شبیه‌سازی عددی با SciPy"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'محاسبات مهندسی', path: '/calculations' },
          { title: 'انجماد و ذوب مواد غذایی' }
        ]}
      />

      <FoodFreezingThawingSuite />
    </div>
  );
};

export default FreezingCalculationsPage;
