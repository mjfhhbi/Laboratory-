import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { FormulationOptimizerSuite } from '../../../components/calculations/FormulationOptimizerSuite';

export const FormulationOptimizationPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="موتور بهینه‌سازی فرمولاسیون و حداقل‌سازی هزینه تولید (Least-Cost Formulation)"
        englishTitle="/calculations/optimization — Linear Programming & Food Formulation Optimization"
        description="بهینه‌سازی فرمولاسیون با برنامه‌ریزی خطی (LP) و سیمپلکس، موازنه جرم دقیق، رعایت ۱۰۰٪ استانداردهای INSO و کدکس، تحلیل امکان‌پذیری و اجرای کدهای SciPy linprog"
        breadcrumbs={[
          { title: 'صفحه اصلی', path: '/' },
          { title: 'محاسبات مهندسی', path: '/calculations' },
          { title: 'بهینه‌سازی فرمولاسیون (LP)' }
        ]}
      />

      <FormulationOptimizerSuite />
    </div>
  );
};

export default FormulationOptimizationPage;
