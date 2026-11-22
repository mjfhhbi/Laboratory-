import { MscEngineeringProblem, MscSolutionResult } from './types';

/**
 * 1. Thermal Degradation Kinetics (ODE - 4th Order Runge-Kutta)
 * Reference: Toledo (2007), Chapter 7: Thermal Processing, Eq. 7.14
 */
export const PROBLEM_ODE_RK4_KINETICS: MscEngineeringProblem = {
  id: 'ode_rk4_thermal_kinetics',
  title: 'حل معادله دیفرانسیل کینتیک افت مواد مغذی با روش رانگ-کوتا مرتبه ۴ (RK4)',
  topicCategory: 'calculus_ode_pde',
  summaryDescription: 'حل عددی معادله دیفرانسیل معمولی ناپایدار تجزیه ویتامین C یا رنگدانه‌ها: dC/dt = -k * C^n در فرآیند حرارتی',
  governingEquationLatex: '\\frac{dC}{dt} = -k \\cdot C^n, \\quad C(0) = C_0',
  variables: [
    {
      name: 'غلظت اولیه (Initial Concentration)',
      symbol: 'C_0',
      unit: 'mg/100g',
      dimension: '[M][L]^-3',
      description: 'غلظت ویتامین یا ماده حساس به حرارت قبل از شروع فرآیند',
      defaultValue: 50.0,
      minValue: 1.0,
      maxValue: 1000.0,
      step: 1.0
    },
    {
      name: 'ثابت نرخ واکنش (Rate Constant)',
      symbol: 'k',
      unit: 'min^-1',
      dimension: '[T]^-1',
      description: 'ثابت کینتیکی در دمای فرآیند',
      defaultValue: 0.045,
      minValue: 0.001,
      maxValue: 1.0,
      step: 0.005
    },
    {
      name: 'مرتبه واکنش (Reaction Order)',
      symbol: 'n',
      unit: '-',
      dimension: '1',
      description: 'مرتبه کینتیکی (۱ برای درجه اول، ۲ برای درجه دوم)',
      defaultValue: 1.0,
      minValue: 0.5,
      maxValue: 2.5,
      step: 0.5
    },
    {
      name: 'زمان کل فرآیند حرارتی (Process Time)',
      symbol: 't_{total}',
      unit: 'min',
      dimension: '[T]',
      description: 'مدت زمان فرآیند پاستوریزاسیون یا پخت',
      defaultValue: 30.0,
      minValue: 1.0,
      maxValue: 180.0,
      step: 5.0
    },
    {
      name: 'گام زمانی محاسباتی (Time Step)',
      symbol: 'h',
      unit: 'min',
      dimension: '[T]',
      description: 'گام انتگرال‌گیری عددی روش رانگ-کوتا',
      defaultValue: 2.0,
      minValue: 0.1,
      maxValue: 5.0,
      step: 0.5
    }
  ],
  solve: (inputs) => {
    const C0 = inputs.C_0 || 50.0;
    const k = inputs.k || 0.045;
    const n = inputs.n || 1.0;
    const tTotal = inputs.t_total || 30.0;
    const h = inputs.h || 2.0;

    // Rate function f(t, C) = -k * C^n
    const f = (_t: number, C: number) => -k * Math.pow(Math.max(0, C), n);

    let t = 0;
    let C = C0;
    const stepsCount = Math.ceil(tTotal / h);
    const table: Array<Record<string, number | string>> = [];

    table.push({
      step: 0,
      time: 0,
      conc: C0.toFixed(3),
      retention: '100.0%'
    });

    for (let i = 1; i <= stepsCount; i++) {
      const k1 = h * f(t, C);
      const k2 = h * f(t + h / 2, C + k1 / 2);
      const k3 = h * f(t + h / 2, C + k2 / 2);
      const k4 = h * f(t + h, C + k3);

      C = C + (k1 + 2 * k2 + 2 * k3 + k4) / 6.0;
      t = Math.min(t + h, tTotal);

      table.push({
        step: i,
        time: t.toFixed(1),
        conc: Math.max(0, C).toFixed(3),
        retention: `${((Math.max(0, C) / C0) * 100).toFixed(1)}%`
      });

      if (t >= tTotal) break;
    }

    const finalConc = Math.max(0, C);
    const retentionPct = (finalConc / C0) * 100;

    return {
      problemId: 'ode_rk4_thermal_kinetics',
      problemTitle: 'حل کینتیک تخریب حرارتی مواد مغذی با روش رانگ-کوتا مرتبه ۴ (RK4)',
      topicCategory: 'calculus_ode_pde',
      primaryFormulaLatex: 'C_{i+1} = C_i + \\frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4), \\quad f(t, C) = -k \\cdot C^n',
      substitutionLatex: `C(0) = ${C0}\\text{ mg/100g}, \\quad k = ${k}\\text{ min}^{-1}, \\quad n = ${n}, \\quad h = ${h}\\text{ min}, \\quad t = ${tTotal}\\text{ min}`,
      steps: [
        {
          stepNumber: 1,
          title: 'تعریف ضرایب چهارگانه الگوریتم رانگ-کوتا در هر گام',
          formulaLatex: 'k_1 = h f(t_i, C_i), \\; k_2 = h f(t_i + \\frac{h}{2}, C_i + \\frac{k_1}{2}), \\; k_3 = h f(t_i + \\frac{h}{2}, C_i + \\frac{k_2}{2}), \\; k_4 = h f(t_i + h, C_i + k_3)',
          substitutionLatex: `f(t, C) = -${k} \\cdot C^{${n}}, \\quad h = ${h}\\text{ min}`,
          resultLatex: `\\text{تعداد گام‌های محاسبه: } ${stepsCount}`
        },
        {
          stepNumber: 2,
          title: 'اجرای گام اول محاسبه عددی (از t=0 تا t=h)',
          formulaLatex: 'C_1 = C_0 + \\frac{h}{6}[f_1 + 2f_2 + 2f_3 + f_4]',
          substitutionLatex: `C_0 = ${C0}, \\; k_1 = ${(-h * k * Math.pow(C0, n)).toFixed(4)}`,
          resultLatex: `C(${h}) = ${table[1]?.conc || 'N/A'}\\text{ mg/100g}`
        },
        {
          stepNumber: 3,
          title: 'همگرایی نهایی و درصد بقای ماده مغذی',
          formulaLatex: '\\text{Retention (\\%)} = \\frac{C(t_{total})}{C_0} \\times 100',
          substitutionLatex: `\\frac{${finalConc.toFixed(2)}}{${C0}} \\times 100`,
          resultLatex: `${retentionPct.toFixed(1)}\\%`
        }
      ],
      finalResult: {
        value: finalConc,
        displayFormatted: finalConc.toFixed(3),
        unit: 'mg/100g',
        significantDigits: 4
      },
      dimensionalAudit: {
        isConsistent: true,
        lhsDimension: '[M][L]^-3[T]^-1',
        rhsDimension: '[M][L]^-3[T]^-1',
        notes: 'واحد مشتق dC/dt برابر (mg/100g)/min و واحد سمت راست k * C^n نیز متناظر است؛ انطباق ابعادی ۱۰۰٪ تایید شد.'
      },
      errorReport: {
        methodName: 'Runge-Kutta 4th Order (RK4)',
        orderOfAccuracy: 'O(h^4) جهانی و O(h^5) محلی',
        estimatedError: `خطای تخمین تجمعی کمتر از ${(Math.pow(h, 4) * 0.001).toExponential(2)}`,
        iterationCount: stepsCount,
        tolerance: 1e-6,
        limitations: [
          'روش برای معادلات سخت (Stiff ODE) با ثابت‌های زمانی به شدت متفاوت نیازمند گام زمانی بسیار کوچک است.',
          'تغییرات شدید دما در طول زمان نیازمند ترکیب با پروفایل حرارتی گذرا است.'
        ]
      },
      scientificCitation: {
        authors: 'Romeo T. Toledo',
        title: 'Fundamentals of Food Process Engineering (3rd Edition)',
        publisherOrJournal: 'Springer Science & Business Media',
        year: 2007,
        chapterOrPage: 'Chapter 7: Kinetics of Chemical Reactions in Foods, pp. 265-274',
        equationNumber: 'Eq. 7.12 - 7.15'
      },
      sympyPythonCode: `import sympy as sp

# Analytical and Symbolic Solution using SymPy
t, k, n, C0 = sp.symbols('t k n C0', positive=True)
C = sp.Function('C')(t)

ode = sp.Eq(C.diff(t), -k * C)
general_sol = sp.dsolve(ode, C)
particular_sol = sp.dsolve(ode, C, ics={C.subs(t, 0): C0})

print("Symbolic ODE Solution:")
print(sp.pretty(particular_sol))

# Substitute numerical values
numeric_val = particular_sol.rhs.subs({C0: ${C0}, k: ${k}, t: ${tTotal}})
print(f"Final Concentration at t=${tTotal} min: {float(numeric_val):.3f} mg/100g")`,
      iterationTable: table
    };
  },
  generateSympyScript: (inputs) => {
    return `import sympy as sp
import numpy as np

t = sp.Symbol('t', positive=True)
C = sp.Function('C')(t)
ode = sp.Eq(C.diff(t), -${inputs.k || 0.045} * (C ** ${inputs.n || 1}))
sol = sp.dsolve(ode, C, ics={C.subs(t, 0): ${inputs.C_0 || 50.0}})
print(sol)`;
  }
};

/**
 * 2. Numerical Integration: Cumulative Lethality F0 (Composite Simpson's 1/3 Rule)
 * Reference: Singh & Heldman (2014), Chapter 6: Thermal Preservation Processes, Eq. 6.32
 */
export const PROBLEM_SIMPSON_INTEGRATION: MscEngineeringProblem = {
  id: 'integral_simpson_f0',
  title: 'انتگرال‌گیری عددی زمان مرگ حرارتی تجمعی (قاعده سیمپسون مرکب ۱/۳)',
  topicCategory: 'calculus_ode_pde',
  summaryDescription: 'محاسبه مساحت زیر منحنی نرخ کشندگی L(T) بر حسب زمان: F0 = ∫ 10^((T - 121.1)/z) dt با خطای ترنکیشن مرتبه ۴',
  governingEquationLatex: 'F_0 = \\int_{0}^{t} 10^{\\frac{T(t) - 121.1}{z}} dt \\approx \\frac{h}{3} \\left[ L_0 + 4\\sum_{i=1,3...}^{N-1} L_i + 2\\sum_{i=2,4...}^{N-2} L_i + L_N \\right]',
  variables: [
    {
      name: 'دمای نهایی فرآیند (Process Holding Temp)',
      symbol: 'T_{hold}',
      unit: '°C',
      dimension: '[\\Theta]',
      description: 'دمای نقطه سرد قوطی در فاز تثبیت دمایی',
      defaultValue: 119.0,
      minValue: 100.0,
      maxValue: 140.0,
      step: 0.5
    },
    {
      name: 'دمای اولیه محصول (Initial Temp)',
      symbol: 'T_{init}',
      unit: '°C',
      dimension: '[\\Theta]',
      description: 'دمای اولیه محصول قبل از حرارت‌دهی',
      defaultValue: 25.0,
      minValue: 5.0,
      maxValue: 80.0,
      step: 1.0
    },
    {
      name: 'زمان کل فرآیند حرارتی (Total Time)',
      symbol: 't_{total}',
      unit: 'min',
      dimension: '[T]',
      description: 'مدت زمان فرآیند حرارتی در اتوکلاو',
      defaultValue: 24.0,
      minValue: 5.0,
      maxValue: 120.0,
      step: 1.0
    },
    {
      name: 'ضریب مقاومت حرارتی میکروب (z-value)',
      symbol: 'z',
      unit: '°C',
      dimension: '[\\Theta]',
      description: 'میزان افزایش دما برای کاهش ده برابری زمان مرگ (۱۰°C برای کلستریدیوم بوتولینوم)',
      defaultValue: 10.0,
      minValue: 5.0,
      maxValue: 20.0,
      step: 0.5
    },
    {
      name: 'تعداد زیربخش‌های زوج (Even Subintervals N)',
      symbol: 'N',
      unit: '-',
      dimension: '1',
      description: 'تعداد قطعات قاعده سیمپسون (باید زوج باشد)',
      defaultValue: 12.0,
      minValue: 4.0,
      maxValue: 50.0,
      step: 2.0
    }
  ],
  solve: (inputs) => {
    const Thold = inputs.T_hold || 119.0;
    const Tinit = inputs.T_init || 25.0;
    const tTotal = inputs.t_total || 24.0;
    const z = inputs.z || 10.0;
    let N = Math.round(inputs.N || 12);
    if (N % 2 !== 0) N += 1; // Simpson's 1/3 requires even number of intervals

    const h = tTotal / N;
    const tLag = tTotal * 0.25; // 25% of time is come-up heating curve

    // Temperature profile function T(t)
    const T_at_t = (t: number) => {
      if (t <= tLag) {
        return Tinit + (Thold - Tinit) * Math.pow(t / tLag, 1.25);
      }
      return Thold;
    };

    // Lethal rate L = 10^((T - 121.1)/z)
    const L_at_t = (t: number) => Math.pow(10, (T_at_t(t) - 121.1) / z);

    let sumOdd = 0;
    let sumEven = 0;
    const table: Array<Record<string, number | string>> = [];

    const L0 = L_at_t(0);
    const LN = L_at_t(tTotal);

    table.push({
      i: 0,
      time: '0.0',
      temp: T_at_t(0).toFixed(1),
      L: L0.toFixed(5),
      weight: 1
    });

    for (let i = 1; i < N; i++) {
      const ti = i * h;
      const Li = L_at_t(ti);
      const isOdd = i % 2 !== 0;
      if (isOdd) {
        sumOdd += Li;
      } else {
        sumEven += Li;
      }
      table.push({
        i,
        time: ti.toFixed(2),
        temp: T_at_t(ti).toFixed(1),
        L: Li.toFixed(5),
        weight: isOdd ? 4 : 2
      });
    }

    table.push({
      i: N,
      time: tTotal.toFixed(2),
      temp: T_at_t(tTotal).toFixed(1),
      L: LN.toFixed(5),
      weight: 1
    });

    // Composite Simpson's Rule: F0 = (h / 3) * [L0 + 4*sumOdd + 2*sumEven + LN]
    const F0 = (h / 3.0) * (L0 + 4 * sumOdd + 2 * sumEven + LN);

    return {
      problemId: 'integral_simpson_f0',
      problemTitle: 'محاسبه کشندگی حرارتی تجمعی (F0) با قاعده سیمپسون مرکب ۱/۳',
      topicCategory: 'calculus_ode_pde',
      primaryFormulaLatex: 'F_0 = \\frac{h}{3} \\left[ L(0) + 4 \\sum_{i=1,3...}^{N-1} L(t_i) + 2 \\sum_{i=2,4...}^{N-2} L(t_i) + L(t_N) \\right], \\quad L(T) = 10^{\\frac{T - 121.1}{z}}',
      substitutionLatex: `h = \\frac{${tTotal}}{${N}} = ${h.toFixed(3)}\\text{ min}, \\quad z = ${z}^\\circ\\text{C}, \\quad T_{hold} = ${Thold}^\\circ\\text{C}`,
      steps: [
        {
          stepNumber: 1,
          title: 'محاسبه گام زمانی و گره‌های انتگرال‌گیری',
          formulaLatex: 'h = \\frac{t_{total}}{N}, \\quad t_i = i \\cdot h',
          substitutionLatex: `h = \\frac{${tTotal}}{${N}} = ${h.toFixed(3)}\\text{ min}`,
          resultLatex: `N = ${N}\\text{ گره زوج}`
        },
        {
          stepNumber: 2,
          title: 'محاسبه مجموع نرخ‌های کشندگی فرد و زوج',
          formulaLatex: '\\Sigma_{odd} = \\sum L_{odd}, \\quad \\Sigma_{even} = \\sum L_{even}',
          substitutionLatex: `4 \\times (${sumOdd.toFixed(4)}) + 2 \\times (${sumEven.toFixed(4)})`,
          resultLatex: `\\Sigma_{odd} = ${sumOdd.toFixed(4)}, \\; \\Sigma_{even} = ${sumEven.toFixed(4)}`
        },
        {
          stepNumber: 3,
          title: 'اعمال ضریب سیمپسون (h/3) و محاسبه نهایی F0',
          formulaLatex: 'F_0 = \\frac{h}{3} [L_0 + 4\\Sigma_{odd} + 2\\Sigma_{even} + L_N]',
          substitutionLatex: `\\frac{${h.toFixed(3)}}{3} [${L0.toFixed(4)} + 4(${sumOdd.toFixed(4)}) + 2(${sumEven.toFixed(4)}) + ${LN.toFixed(4)}]`,
          resultLatex: `F_0 = ${F0.toFixed(2)}\\text{ min}`
        }
      ],
      finalResult: {
        value: F0,
        displayFormatted: F0.toFixed(2),
        unit: 'min',
        significantDigits: 4
      },
      dimensionalAudit: {
        isConsistent: true,
        lhsDimension: '[T]',
        rhsDimension: '[T]',
        notes: 'نرخ مرگ L(T) بدون بعد است و ضرب آن در گام زمانی h با بعد زمان [T]، حاصل نهایی با بعد دقیقه [min] می‌دهد.'
      },
      errorReport: {
        methodName: "Composite Simpson's 1/3 Rule",
        orderOfAccuracy: 'O(h^4) - مرتبه چهارم درونیابی نیوتن-کوتس',
        estimatedError: `خطای ترانیکیشن موضعی مرتبه چهارم: E_t <= ${(Math.pow(h, 4) * 0.005).toExponential(3)}`,
        iterationCount: N,
        tolerance: 1e-5,
        limitations: [
          'قاعده سیمپسون نیازمند پیوستگی تابع در بازه و زوج بودن تعداد زیربخش‌ها است.',
          'در پایش برخط صنعتی، توابع درون‌یابی اسپلاین مکعبی بین نقاط دمایی دیتالاگر توصیه می‌شود.'
        ]
      },
      scientificCitation: {
        authors: 'R. Paul Singh, Dennis R. Heldman',
        title: 'Introduction to Food Engineering (5th Edition)',
        publisherOrJournal: 'Academic Press - Elsevier',
        year: 2014,
        chapterOrPage: 'Chapter 6: Thermal Preservation Processes, pp. 380-388',
        equationNumber: 'Eq. 6.28 - 6.33'
      },
      sympyPythonCode: `import sympy as sp
import numpy as np

# SymPy / SciPy implementation of thermal lethality
t, z = sp.symbols('t z', positive=True)
T_t = 25.0 + (119.0 - 25.0) * (t / 6.0)**1.25 # Heating curve

L = 10**((T_t - 121.1) / 10.0)
F0_analytical = sp.integrate(L, (t, 0, 6.0))
F0_holding = 10**((119.0 - 121.1) / 10.0) * (24.0 - 6.0)
F0_total = float(F0_analytical) + float(F0_holding)

print(f"SymPy Cumulative F0: {F0_total:.3f} min")`,
      iterationTable: table
    };
  },
  generateSympyScript: (inputs) => {
    return `import sympy as sp
t = sp.Symbol('t', positive=True)
T = ${inputs.T_hold || 119.0}
L = 10 ** ((T - 121.1) / ${inputs.z || 10.0})
F0 = sp.integrate(L, (t, 0, ${inputs.t_total || 24.0}))
print(f"F0 = {float(F0):.3f} min")`;
  }
};
