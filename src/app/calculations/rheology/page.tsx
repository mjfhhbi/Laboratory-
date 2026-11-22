import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { RheologyFluidMechanicsSuite } from '../../../components/calculations/RheologyFluidMechanicsSuite';

export const RheologyCalculationsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="رئولوژی پیشرفته و مکانیک سیالات صنایع غذایی"
        englishTitle="/calculations/rheology — Food Rheology & Pipe Hydraulics Suite"
        description="برازش و مقایسه ۵ مدل ساختاری (Newtonian, Power Law, Bingham, Casson, Herschel-Bulkley)، محاسبه تنش تسلیم و ویسکوزیته ظاهری، عدد رینولدز تعمیم‌یافته متزنر-رید، افت فشار خط لوله و توان پمپ با SciPy و NumPy"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'محاسبات مهندسی', path: '/calculations' },
          { title: 'رئولوژی و مکانیک سیالات' }
        ]}
      />

      <RheologyFluidMechanicsSuite />
    </div>
  );
};

export default RheologyCalculationsPage;
