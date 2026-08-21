import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';

export const EquipmentPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="تجهیزات و دستگاه‌ها"
        englishTitle="/equipment"
        description="سامانه مدیریت، راهنمای کاربری و کالیبراسیون تجهیزات آزمایشگاهی و خطوط پایلوت"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'تجهیزات و دستگاه‌ها' }
        ]}
      />

      <EmptyState
        moduleTitle="تجهیزات و دستگاه‌های آزمایشگاهی"
        moduleEnglish="/equipment — Laboratory Equipment & Devices"
        description="اسکلت پایه کاتالوگ تجهیزات آزمایشگاهی پیاده‌سازی شده است. در فازهای بعدی مشخصات فنی، دستورالعمل‌های کالیبراسیون و عیب‌یابی در این بخش قرار می‌گیرد."
        plannedFeatures={[
          'کاتالوگ تجهیزات (رفراکتومتر، pH متر، ویسکومتر، بافت‌سنج، اتوکلاو، اسپکتروفتومتر)',
          'جدول زمان‌بندی کالیبراسیون و نگهداری دوره‌ای (PM)',
          'دستورالعمل‌های استاندارد کار با دستگاه (SOP)',
          'راهنمای خطایابی و عیب‌یابی فنی دستگاه‌ها'
        ]}
      />
    </div>
  );
};

export default EquipmentPage;
