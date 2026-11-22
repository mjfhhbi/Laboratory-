import { MscEngineeringProblem, MscTopicCategory } from './types';
import { PROBLEM_ODE_RK4_KINETICS, PROBLEM_SIMPSON_INTEGRATION } from './calculusSolvers';
import { PROBLEM_MATRIX_MASS_BALANCE } from './linearAlgebraSolvers';
import { PROBLEM_NEWTON_COLEBROOK, PROBLEM_BISECTION_WATER_ACTIVITY } from './nonlinearSolvers';
import { PROBLEM_PLANK_FREEZING, PROBLEM_METZNER_REED_FLOW } from './transportThermodynamicsSolvers';
import { PROBLEM_EVAPORATOR_ECONOMY, PROBLEM_PSYCHROMETRICS_DRYING } from './optimizationSolvers';

export {
  PROBLEM_ODE_RK4_KINETICS,
  PROBLEM_SIMPSON_INTEGRATION,
  PROBLEM_MATRIX_MASS_BALANCE,
  PROBLEM_NEWTON_COLEBROOK,
  PROBLEM_BISECTION_WATER_ACTIVITY,
  PROBLEM_PLANK_FREEZING,
  PROBLEM_METZNER_REED_FLOW,
  PROBLEM_EVAPORATOR_ECONOMY,
  PROBLEM_PSYCHROMETRICS_DRYING
};

export interface TopicCategoryMeta {
  id: MscTopicCategory;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
}

export const MSC_TOPIC_CATEGORIES: TopicCategoryMeta[] = [
  {
    id: 'calculus_ode_pde',
    titleFa: 'حساب دیفرانسیل، انتگرال و معادلات دیفرانسیل (ODE/PDE)',
    titleEn: 'Calculus, ODE & PDE Numerical Solvers',
    descriptionFa: 'رانگ-کوتا مرتبه ۴، انتگرال‌گیری عددی سیمپسون، کینتیک حرارتی و مشتق‌گیری عددی'
  },
  {
    id: 'linear_algebra_matrices',
    titleFa: 'جبر خطی، ماتریس‌ها و دستگاه معادلات',
    titleEn: 'Linear Algebra & Matrix Systems',
    descriptionFa: 'حذف گاوسی با پیووتینگ جزیی، دترمینان، عدد شرطی و موازنه جرم چندجزیی'
  },
  {
    id: 'nonlinear_root_finding',
    titleFa: 'حل معادلات غیرخطی (نیوتن-رافسون و دونیم‌سازی)',
    titleEn: 'Non-linear Equations (Newton & Bisection)',
    descriptionFa: 'ریشه‌یابی اصطکاک لوله‌های کولبروک و وارون‌سازی ایزوترم GAB'
  },
  {
    id: 'fluid_mechanics_rheology',
    titleFa: 'مکانیک سیالات پیشرفته و رئولوژی لوله‌ها',
    titleEn: 'Fluid Mechanics & Rheology',
    descriptionFa: 'رینولدز متزنر-رید، سیالات قانون توان، افت فشار خطوط و توان پمپ'
  },
  {
    id: 'heat_transfer_freezing',
    titleFa: 'انتقال حرارت و انجماد مواد غذایی (پلانک)',
    titleEn: 'Heat Transfer & Freezing Modeling',
    descriptionFa: 'معادله پلانک برای هندسه‌های سه‌گانه، مقاومت هدایت و جابجایی'
  },
  {
    id: 'mass_energy_balance',
    titleFa: 'موازنه جرم، انرژی و عملیات واحد اواپراتور',
    titleEn: 'Mass & Energy Balance / Evaporation',
    descriptionFa: 'تغلیظ تحت خلاء، راندمان بخار (Steam Economy) و سطح انتقال حرارت'
  },
  {
    id: 'thermodynamics_drying',
    titleFa: 'ترمودینامیک مهندسی و سایکرومتری خشک‌کن',
    titleEn: 'Thermodynamics & Psychrometrics',
    descriptionFa: 'فشار بخار آنتوان، رطوبت ویژه هوا، آنتالپی و نقطه شبنم فرآیند'
  }
];

export const ALL_MSC_PROBLEMS: MscEngineeringProblem[] = [
  PROBLEM_ODE_RK4_KINETICS,
  PROBLEM_SIMPSON_INTEGRATION,
  PROBLEM_MATRIX_MASS_BALANCE,
  PROBLEM_NEWTON_COLEBROOK,
  PROBLEM_BISECTION_WATER_ACTIVITY,
  PROBLEM_PLANK_FREEZING,
  PROBLEM_METZNER_REED_FLOW,
  PROBLEM_EVAPORATOR_ECONOMY,
  PROBLEM_PSYCHROMETRICS_DRYING
];

export function getMscProblemById(id: string): MscEngineeringProblem | undefined {
  return ALL_MSC_PROBLEMS.find((p) => p.id === id);
}

export function getProblemsByCategory(category: MscTopicCategory): MscEngineeringProblem[] {
  return ALL_MSC_PROBLEMS.filter((p) => p.topicCategory === category);
}
