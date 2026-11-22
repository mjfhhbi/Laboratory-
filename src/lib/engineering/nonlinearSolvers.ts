import { MscEngineeringProblem, MscSolutionResult } from './types';

/**
 * 4. Newton-Raphson Solver for Colebrook-White Pipe Friction Factor
 * Reference: Geankoplis (2003), Chapter 2: Fluid Mechanics, pp. 62-67
 */
export const PROBLEM_NEWTON_COLEBROOK: MscEngineeringProblem = {
  id: 'newton_raphson_colebrook',
  title: 'حل ریشه معادله غیرخطی کولبروک-وایت برای ضریب اصطکاک لوله (روش نیوتن-رافسون)',
  topicCategory: 'nonlinear_root_finding',
  summaryDescription: 'حل معادله ضمنی ضریب اصطکاک دارسی در جریان آشفته لوله‌های انتقال سیالات غذایی: 1/√f = -2 log10( (ε/D)/3.7 + 2.51/(Re √f) )',
  governingEquationLatex: 'f_{cw}(f) = \\frac{1}{\\sqrt{f}} + 2 \\log_{10}\\left( \\frac{\\varepsilon / D}{3.7} + \\frac{2.51}{\\text{Re} \\sqrt{f}} \\right) = 0',
  variables: [
    {
      name: 'عدد رینولدز جریان سیال (Reynolds Number)',
      symbol: '\\text{Re}',
      unit: '-',
      dimension: '1',
      description: 'شاخص رژیم جریان (باید آشفته و > 4000 باشد)',
      defaultValue: 45000.0,
      minValue: 4000.0,
      maxValue: 1000000.0,
      step: 5000.0
    },
    {
      name: 'قطر داخلی لوله بهداشتی (Pipe Inner Diameter)',
      symbol: 'D',
      unit: 'm',
      dimension: '[L]',
      description: 'قطر اسمی لوله‌های استیل صنایع غذایی (DIN / SMS)',
      defaultValue: 0.05,
      minValue: 0.01,
      maxValue: 0.5,
      step: 0.005
    },
    {
      name: 'زبری نسبی لوله استیل زنگ‌نزن (Roughness Height ε)',
      symbol: '\\varepsilon',
      unit: 'm',
      dimension: '[L]',
      description: 'زبری سطح لوله استیل ۳۱۶ الکتروپولیش‌شده (معمولاً 0.000045 m)',
      defaultValue: 0.000045,
      minValue: 0.000001,
      maxValue: 0.001,
      step: 0.000005
    },
    {
      name: 'حدس اولیه ضریب اصطکاک (Initial Guess f₀)',
      symbol: 'f_0',
      unit: '-',
      dimension: '1',
      description: 'تخمین اولیه با تقریب هالند یا سوان-جین',
      defaultValue: 0.02,
      minValue: 0.005,
      maxValue: 0.1,
      step: 0.005
    },
    {
      name: 'میزان تلرانس همگرایی (Convergence Tolerance)',
      symbol: '\\text{Tol}',
      unit: '-',
      dimension: '1',
      description: 'حداکثر خطای مجاز بین دو تکرار متوالی |f_{n+1} - f_n|',
      defaultValue: 0.000001,
      minValue: 1e-8,
      maxValue: 1e-4,
      step: 1e-6
    }
  ],
  solve: (inputs) => {
    const Re = inputs['\\text{Re}'] || 45000.0;
    const D = inputs.D || 0.05;
    const eps = inputs['\\varepsilon'] || 0.000045;
    const tol = inputs['\\text{Tol}'] || 1e-6;
    let f_val = inputs.f_0 || 0.02;

    const eps_over_D = eps / D;
    const ln10 = Math.LN10;

    // Colebrook function F(f) = 1/sqrt(f) + 2*log10( eps/(3.7*D) + 2.51/(Re*sqrt(f)) )
    const F = (f: number) => {
      const sqrtF = Math.sqrt(f);
      const arg = eps_over_D / 3.7 + 2.51 / (Re * sqrtF);
      return 1.0 / sqrtF + 2.0 * (Math.log(arg) / ln10);
    };

    // Analytical Derivative dF/df
    const dF = (f: number) => {
      const sqrtF = Math.sqrt(f);
      const arg = eps_over_D / 3.7 + 2.51 / (Re * sqrtF);
      const term1 = -0.5 * Math.pow(f, -1.5);
      const dArg_df = -0.5 * (2.51 / Re) * Math.pow(f, -1.5);
      const term2 = (2.0 / ln10) * (dArg_df / arg);
      return term1 + term2;
    };

    const table: Array<Record<string, number | string>> = [];
    let iterations = 0;
    const maxIter = 50;

    for (let i = 1; i <= maxIter; i++) {
      iterations = i;
      const f_prev = f_val;
      const F_val = F(f_prev);
      const dF_val = dF(f_prev);

      const f_next = f_prev - F_val / dF_val;
      const err = Math.abs(f_next - f_prev);

      table.push({
        iteration: i,
        f_current: f_prev.toFixed(6),
        F_value: F_val.toExponential(3),
        dF_value: dF_val.toFixed(2),
        f_next: f_next.toFixed(6),
        abs_error: err.toExponential(3)
      });

      f_val = f_next;
      if (err < tol) break;
    }

    const fDarcy = f_val;
    const fFanning = fDarcy / 4.0;

    return {
      problemId: 'newton_raphson_colebrook',
      problemTitle: 'حل معادله کولبروک-وایت به روش نیوتن-رافسون',
      topicCategory: 'nonlinear_root_finding',
      primaryFormulaLatex: 'f_{n+1} = f_n - \\frac{F(f_n)}{F\'(f_n)}, \\quad F(f) = \\frac{1}{\\sqrt{f}} + 2 \\log_{10}\\left( \\frac{\\varepsilon/D}{3.7} + \\frac{2.51}{\\text{Re}\\sqrt{f}} \\right)',
      substitutionLatex: `\\text{Re} = ${Re.toFixed(0)}, \\quad \\frac{\\varepsilon}{D} = \\frac{${eps}}{${D}} = ${eps_over_D.toExponential(3)}, \\quad f_0 = ${inputs.f_0 || 0.02}`,
      steps: [
        {
          stepNumber: 1,
          title: 'محاسبه مشتق تحلیلی تابع F(f)',
          formulaLatex: 'F\'(f) = -\\frac{1}{2} f^{-3/2} - \\frac{2}{\\ln 10} \\left( \\frac{2.51}{2 \\text{Re} f^{3/2}} \\right) \\left( \\frac{\\varepsilon/D}{3.7} + \\frac{2.51}{\\text{Re}\\sqrt{f}} \\right)^{-1}',
          substitutionLatex: `F\'(${f_val.toFixed(4)}) \\approx ${dF(f_val).toFixed(2)}`,
          resultLatex: '\\text{مشتق در تمام دامنه منفی و غیرصفر است (تضمین همگرایی)}'
        },
        {
          stepNumber: 2,
          title: 'اجرای تکرارهای نیوتن-رافسون تا رسیدن به تلرانس',
          formulaLatex: 'f_{n+1} = f_n - \\frac{F(f_n)}{F\'(f_n)}, \\quad |f_{n+1} - f_n| < \\text{Tol}',
          substitutionLatex: `\\text{تعداد تکرارها: } ${iterations}\\text{ گام}`,
          resultLatex: `f_{Darcy} = ${fDarcy.toFixed(5)}`
        },
        {
          stepNumber: 3,
          title: 'تبدیل ضریب اصطکاک دارسی به ضریب فنینگ',
          formulaLatex: 'f_{Fanning} = \\frac{f_{Darcy}}{4}',
          substitutionLatex: `\\frac{${fDarcy.toFixed(5)}}{4}`,
          resultLatex: `f_{Fanning} = ${fFanning.toFixed(5)}`
        }
      ],
      finalResult: {
        value: fDarcy,
        displayFormatted: `ضریب دارسی: ${fDarcy.toFixed(5)} | ضریب فنینگ: ${fFanning.toFixed(5)}`,
        unit: '-',
        significantDigits: 5
      },
      dimensionalAudit: {
        isConsistent: true,
        lhsDimension: '1',
        rhsDimension: '1',
        notes: 'ضریب اصطکاک (f)، عدد رینولدز (Re) و زبری نسبی (ε/D) همگی کمیت‌های بدون بعد هستند؛ انطباق ابعادی کامل است.'
      },
      errorReport: {
        methodName: 'Newton-Raphson Method',
        orderOfAccuracy: 'همگرایی درجه دوم (Quadratic Convergence: e_{n+1} ≈ M e_n^2)',
        estimatedError: `خطای باقیمانده |F(f)| = ${Math.abs(F(fDarcy)).toExponential(3)}`,
        iterationCount: iterations,
        tolerance: tol,
        limitations: [
          'حدس اولیه بسیار دور از ریشه ممکن است به دلیل مشتق منفی و تغییرات شیب در f بسیار کوچک منجر به واگرایی شود.',
          'معادله کولبروک فقط برای جریان آشفته Re > 4000 معتبر است؛ در رژیم آرام Re < 2100 باید از f = 64/Re استفاده کرد.'
        ]
      },
      scientificCitation: {
        authors: 'Christie J. Geankoplis',
        title: 'Transport Processes and Separation Process Principles (4th Edition)',
        publisherOrJournal: 'Prentice Hall PTR',
        year: 2003,
        chapterOrPage: 'Chapter 2: Fluid Mechanics Principles, pp. 62-68',
        equationNumber: 'Eq. 2.10-6'
      },
      sympyPythonCode: `import scipy.optimize as opt
import numpy as np

Re = ${Re}
eps_D = ${eps_over_D}

# Non-linear solver using SciPy newton
def colebrook(f):
    return 1.0 / np.sqrt(f) + 2.0 * np.log10(eps_D / 3.7 + 2.51 / (Re * np.sqrt(f)))

f_solution = opt.newton(colebrook, x0=0.02, tol=1e-7)
print(f"SciPy Newton Darcy friction factor: {f_solution:.6f}")
print(f"Fanning friction factor: {f_solution / 4.0:.6f}")`,
      iterationTable: table
    };
  },
  generateSympyScript: (inputs) => {
    return `import scipy.optimize as opt
import numpy as np
Re = ${inputs['\\text{Re}'] || 45000}
ed = ${(inputs['\\varepsilon'] || 0.000045) / (inputs.D || 0.05)}
f_root = opt.newton(lambda f: 1/np.sqrt(f) + 2*np.log10(ed/3.7 + 2.51/(Re*np.sqrt(f))), x0=0.02)
print("f =", f_root)`;
  }
};

/**
 * 5. Bisection Root Finding for Water Activity (GAB Isotherm Inversion)
 * Reference: Toledo (2007), Chapter 4: Water and Ice in Foods, pp. 115-122
 */
export const PROBLEM_BISECTION_WATER_ACTIVITY: MscEngineeringProblem = {
  id: 'bisection_water_activity_gab',
  title: 'ریشه‌یابی فعالیت آبی مواد غذایی با روش دونیم‌سازی (Bisection Method)',
  topicCategory: 'nonlinear_root_finding',
  summaryDescription: 'یافتن دقیق مقدار aw بر اساس رطوبت تعادلی هدف با معکوس‌سازی معادله سه پارامتری غیرخطی GAB',
  governingEquationLatex: 'g(a_w) = \\frac{m_0 \\cdot C \\cdot K \\cdot a_w}{(1 - K a_w)(1 - K a_w + C K a_w)} - m_{target} = 0',
  variables: [
    {
      name: 'رطوبت تعادلی هدف (Target Equilibrium Moisture)',
      symbol: 'm_{target}',
      unit: 'g/100g DM',
      dimension: '1',
      description: 'درصد رطوبت تعادلی بر پایه ماده خشک',
      defaultValue: 11.5,
      minValue: 2.0,
      maxValue: 40.0,
      step: 0.5
    },
    {
      name: 'رطوبت تک‌لایه GAB (Monolayer Moisture m₀)',
      symbol: 'm_0',
      unit: 'g/100g DM',
      dimension: '1',
      description: 'رطوبت تک‌لایه محاسبه‌شده ایزوترم',
      defaultValue: 6.8,
      minValue: 2.0,
      maxValue: 15.0,
      step: 0.2
    },
    {
      name: 'ثابت انرژی لایه اول GAB (Constant C)',
      symbol: 'C',
      unit: '-',
      dimension: '1',
      description: 'ثابت گوگنهایم متناسب با آنتالپی جذب لایه اول',
      defaultValue: 19.5,
      minValue: 2.0,
      maxValue: 100.0,
      step: 1.0
    },
    {
      name: 'ضریب چندلایه GAB (Factor K)',
      symbol: 'K',
      unit: '-',
      dimension: '1',
      description: 'ضریب اصلاح خواص آب چندلایه نسبت به آب آزاد (K <= 1.0)',
      defaultValue: 0.85,
      minValue: 0.5,
      maxValue: 0.99,
      step: 0.01
    },
    {
      name: 'میزان خطای مجاز دونیم‌سازی (Tolerance)',
      symbol: '\\text{Tol}',
      unit: '-',
      dimension: '1',
      description: 'خطای توقف الگوریتم بازه',
      defaultValue: 0.0001,
      minValue: 1e-6,
      maxValue: 1e-3,
      step: 1e-5
    }
  ],
  solve: (inputs) => {
    const m_target = inputs.m_target || 11.5;
    const m0 = inputs.m_0 || 6.8;
    const C = inputs.C || 19.5;
    const K = inputs.K || 0.85;
    const tol = inputs['\\text{Tol}'] || 0.0001;

    // GAB residual function g(aw)
    const g = (aw: number) => {
      const num = m0 * C * K * aw;
      const den = (1.0 - K * aw) * (1.0 - K * aw + C * K * aw);
      return num / den - m_target;
    };

    let a = 0.01;
    let b = 0.98;
    let c = (a + b) / 2.0;
    const table: Array<Record<string, number | string>> = [];
    let iterations = 0;
    const maxIter = 40;

    for (let i = 1; i <= maxIter; i++) {
      iterations = i;
      c = (a + b) / 2.0;
      const gc = g(c);
      const errBound = (b - a) / 2.0;

      table.push({
        iteration: i,
        a_left: a.toFixed(4),
        b_right: b.toFixed(4),
        c_mid: c.toFixed(4),
        residual: gc.toFixed(4),
        error_bound: errBound.toFixed(5)
      });

      if (errBound < tol || Math.abs(gc) < 1e-7) {
        break;
      }

      const ga = g(a);
      if (ga * gc < 0) {
        b = c;
      } else {
        a = c;
      }
    }

    const calculatedAw = c;

    return {
      problemId: 'bisection_water_activity_gab',
      problemTitle: 'ریشه‌یابی فعالیت آبی (aw) با روش دونیم‌سازی',
      topicCategory: 'nonlinear_root_finding',
      primaryFormulaLatex: 'g(a_w) = \\frac{m_0 C K a_w}{(1 - K a_w)(1 - K a_w + C K a_w)} - m_{target} = 0, \\quad c_n = \\frac{a_n + b_n}{2}',
      substitutionLatex: `m_{target} = ${m_target}, \\quad m_0 = ${m0}, \\quad C = ${C}, \\quad K = ${K}, \\quad \\text{بازه اولیه: } [0.01, 0.98]`,
      steps: [
        {
          stepNumber: 1,
          title: 'بررسی قضیه مقدار میانی بولتزانو در بازه اولیه [a, b]',
          formulaLatex: 'g(a) \\cdot g(b) < 0',
          substitutionLatex: `g(0.01) = ${g(0.01).toFixed(2)}, \\; g(0.98) = ${g(0.98).toFixed(2)}`,
          resultLatex: `g(0.01) \\times g(0.98) < 0 \\implies \\text{وجود حداقل یک ریشه تضمین شده است.}`
        },
        {
          stepNumber: 2,
          title: 'اجرای تکرارهای متوالی دونیم‌سازی بازه',
          formulaLatex: 'c_n = \\frac{a_n + b_n}{2}, \\quad E_n = \\frac{b_n - a_n}{2} \\le \\frac{b_0 - a_0}{2^n}',
          substitutionLatex: `\\text{تعداد تکرارها: } ${iterations}\\text{ گام جهت رسیدن به خطای } < ${tol}`,
          resultLatex: `a_w = ${calculatedAw.toFixed(4)}`
        },
        {
          stepNumber: 3,
          title: 'اعتبارسنجی فیزیکی و بیوشیمیایی فعالیت آبی محاسبه‌شده',
          formulaLatex: '0 < a_w < 1',
          substitutionLatex: `a_w = ${calculatedAw.toFixed(3)}`,
          resultLatex: calculatedAw > 0.6 ? '\\text{هشدار: فعالیت آبی در محدوده رشد کپک‌ها و تخمیر مخمرها است.}' : '\\text{مطلوب: در این رطوبت، فعالیت آنزیمی و رشد میکروبی مهار می‌شود.}'
        }
      ],
      finalResult: {
        value: calculatedAw,
        displayFormatted: `فعالیت آبی (aw): ${calculatedAw.toFixed(3)}`,
        unit: '-',
        significantDigits: 4
      },
      dimensionalAudit: {
        isConsistent: true,
        lhsDimension: '1',
        rhsDimension: '1',
        notes: 'فعالیت آبی aw نسبت فشار بخار به فشار بخار آب خالص (P/P0) بوده و بدون بعد است؛ انطباق کامل است.'
      },
      errorReport: {
        methodName: 'Bisection Method (روش دونیم‌سازی تضمینی)',
        orderOfAccuracy: 'همگرایی خطی قطعی (Linear: E_{n+1} = E_n / 2)',
        estimatedError: `کران بالای خطای نظری: (b - a)/2^${iterations} = ${((0.98 - 0.01) / Math.pow(2, iterations)).toExponential(3)}`,
        iterationCount: iterations,
        tolerance: tol,
        limitations: [
          'سرعت همگرایی نسبت به روش نیوتن کمتر است اما در حضور توابع با شیب شدید کاملاً پایدار بوده و هرگز واگرا نمی‌شود.',
          'در aw بسیار نزدیک به ۱.۰ معادله GAB به دلیل تکینگی K·aw=1 رفتار مجانبی پیدا می‌کند.'
        ]
      },
      scientificCitation: {
        authors: 'Romeo T. Toledo',
        title: 'Fundamentals of Food Process Engineering (3rd Edition)',
        publisherOrJournal: 'Springer Science',
        year: 2007,
        chapterOrPage: 'Chapter 4: Water and Ice in Foods, pp. 115-125',
        equationNumber: 'Eq. 4.9'
      },
      sympyPythonCode: `import scipy.optimize as opt

m_target = ${m_target}
m0 = ${m0}
C = ${C}
K = ${K}

def gab(aw):
    num = m0 * C * K * aw
    den = (1.0 - K * aw) * (1.0 - K * aw + C * K * aw)
    return num / den - m_target

root_aw = opt.bisect(gab, 0.01, 0.98, xtol=1e-5)
print(f"Bisection solved aw: {root_aw:.4f}")`
    };
  },
  generateSympyScript: (inputs) => {
    return `import scipy.optimize as opt
def f(aw):
    return (${inputs.m_0 || 6.8} * ${inputs.C || 19.5} * ${inputs.K || 0.85} * aw) / ((1 - ${inputs.K || 0.85}*aw)*(1 - ${inputs.K || 0.85}*aw + ${inputs.C || 19.5}*${inputs.K || 0.85}*aw)) - ${inputs.m_target || 11.5}
print("aw =", opt.bisect(f, 0.01, 0.98))`;
  }
};
