import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { MscEngineeringSuite } from '../../../components/calculations/MscEngineeringSuite';

export const MscAdvancedCalculationsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="موتور محاسبات ریاضی و مهندسی پیشرفته (سطح کارشناسی ارشد)"
        englishTitle="Advanced M.Sc. Food Engineering & Mathematical Engine"
        description="حل تحلیلی و عددی معادلات دیفرانسیل (ODE/PDE)، رانگ-کوتا، انتگرال سیمپسون، دستگاه معادلات موازنه جرم، ریشه‌یابی نیوتن-رافسون و دونیم‌سازی، انتقال حرارت پلانک، مکانیک سیالات متزنر-رید و سایکرومتری با اعتبارسنجی SymPy و SciPy"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'محاسبات مهندسی', path: '/calculations' },
          { title: 'محاسبات پیشرفته کارشناسی ارشد' }
        ]}
      />

      <MscEngineeringSuite />
    </div>
  );
};

export default MscAdvancedCalculationsPage;
