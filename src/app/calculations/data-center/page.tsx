import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { ScientificDataCenterSuite } from '../../../components/data-center/ScientificDataCenterSuite';

export const ScientificDataCenterPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="مرکز جامع تحلیل داده و اعتبارسنجی نتایج علمی و مهندسی"
        englishTitle="/calculations/data-center — Scientific Data Analysis, Regression & Quality Audit"
        description="ورود فایل‌های CSV و Excel، آزمون‌های آماری، رگرسیون غیرخطی، انتشار عدم قطعیت (GUM)، کشف داده‌های پرت توکی و گرابز، و راستی‌آزمایی موازی در Pyodide SciPy"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'محاسبات مهندسی', path: '/calculations' },
          { title: 'مرکز تحلیل داده و اعتبارسنجی' }
        ]}
      />

      <ScientificDataCenterSuite />
    </div>
  );
};

export default ScientificDataCenterPage;
