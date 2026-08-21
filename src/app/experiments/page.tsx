import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';

export const ExperimentsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="مدیریت آزمایش‌ها"
        englishTitle="/experiments"
        description="سامانه پروتکل‌های آزمایشگاهی، دستورالعمل‌های آزمون و ثبت گزارش‌های تجربی"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'مدیریت آزمایش‌ها' }
        ]}
      />

      <EmptyState
        moduleTitle="مدیریت آزمایش‌ها"
        moduleEnglish="/experiments — Experimental Protocols & Trials"
        description="اسکلت پایه بخش مدیریت آزمایش‌ها آماده شده است تا در مراحل آتی متدولوژی‌های آزمون و طراحی آزمایشات (DoE) به آن متصل شوند."
        plannedFeatures={[
          'مدیریت پروتکل‌های استاندارد آزمون‌های آزمایشگاهی',
          'طراحی آزمایشات (Design of Experiments - DoE)',
          'ردیابی نسخه‌های تست و شرایط محیطی آزمون',
          'صدور گزارش فنی و گواهی آنالیز (COA)'
        ]}
      />
    </div>
  );
};

export default ExperimentsPage;
