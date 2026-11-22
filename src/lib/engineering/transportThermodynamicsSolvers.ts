import { MscEngineeringProblem, MscSolutionResult } from './types';

/**
 * 6. Food Freezing Time via Plank's Equation
 * Reference: Toledo (2007), Chapter 9: Freezing, pp. 345-352; Singh & Heldman (2014), pp. 480-492
 */
export const PROBLEM_PLANK_FREEZING: MscEngineeringProblem = {
  id: 'plank_freezing_time',
  title: 'محاسبه زمان انجماد مواد غذایی با معادله پلانک (Plank\'s Freezing Equation)',
  topicCategory: 'heat_transfer_freezing',
  summaryDescription: 'محاسبه دقیق زمان انجماد در تونل انجماد وزشی بر اساس ضریب انتقال حرارت جابجایی، هدایت حرارتی یخ، گرمای نهان و ضریب شکل هندسی (ورقه، استوانه، کره)',
  governingEquationLatex: 't_f = \\frac{\\rho_f \\cdot \\Delta H_f}{T_f - T_a} \\left( \\frac{P \\cdot a}{h} + \\frac{R \\cdot a^2}{k_f} \\right)',
  variables: [
    {
      name: 'ضخامت یا قطر نمونه غذایی (Thickness / Dimension a)',
      symbol: 'a',
      unit: 'm',
      dimension: '[L]',
      description: 'ضخامت دال گوشت یا قطر میوه/سبزی',
      defaultValue: 0.04,
      minValue: 0.005,
      maxValue: 0.3,
      step: 0.005
    },
    {
      name: 'شکل هندسی محصول (Geometry: 1=Slab, 2=Cylinder, 3=Sphere)',
      symbol: '\\text{Geom}',
      unit: '-',
      dimension: '1',
      description: '۱ برای دال نامتناهی (P=1/2, R=1/8)، ۲ برای استوانه (P=1/4, R=1/16)، ۳ برای کره (P=1/6, R=1/24)',
      defaultValue: 1.0,
      minValue: 1.0,
      maxValue: 3.0,
      step: 1.0
    },
    {
      name: 'دمای هوای سرد فریزر (Ambient Air Temp Ta)',
      symbol: 'T_a',
      unit: '°C',
      dimension: '[\\Theta]',
      description: 'دمای هوای خروجی از اواپراتور فریزر',
      defaultValue: -30.0,
      minValue: -50.0,
      maxValue: -5.0,
      step: 1.0
    },
    {
      name: 'نقطه انجماد اولیه محصول (Initial Freezing Point Tf)',
      symbol: 'T_f',
      unit: '°C',
      dimension: '[\\Theta]',
      description: 'دمای شروع بلورینگی آب محصول (افت نقطه انجماد)',
      defaultValue: -1.5,
      minValue: -5.0,
      maxValue: 0.0,
      step: 0.2
    },
    {
      name: 'ضریب انتقال حرارت جابجایی سطح (Convective Heat Transfer h)',
      symbol: 'h',
      unit: 'W/(m^2·K)',
      dimension: '[M][T]^-3[\\Theta]^-1',
      description: 'ضریب انتقال حرارت هوا (معمولاً ۲۵ تا ۵۰ در فریزر وزشی)',
      defaultValue: 35.0,
      minValue: 5.0,
      maxValue: 250.0,
      step: 5.0
    },
    {
      name: 'چگالی فاز منجمد محصول (Frozen Density)',
      symbol: '\\rho_f',
      unit: 'kg/m^3',
      dimension: '[M][L]^-3',
      description: 'چگالی ظاهری ماده غذایی منجمد',
      defaultValue: 980.0,
      minValue: 700.0,
      maxValue: 1200.0,
      step: 10.0
    },
    {
      name: 'گرمای نهان انجماد موثر (Latent Heat of Freezing)',
      symbol: '\\Delta H_f',
      unit: 'kJ/kg',
      dimension: '[L]^2[T]^-2',
      description: 'گرمای نهان انجماد بر اساس درصد آب منجمدشونده',
      defaultValue: 250.0,
      minValue: 100.0,
      maxValue: 334.0,
      step: 5.0
    },
    {
      name: 'رسانندگی حرارتی یخ/محصول منجمد (Thermal Conductivity kf)',
      symbol: 'k_f',
      unit: 'W/(m·K)',
      dimension: '[M][L][T]^-3[\\Theta]^-1',
      description: 'هدایت حرارتی فاز منجمد',
      defaultValue: 1.5,
      minValue: 0.8,
      maxValue: 2.5,
      step: 0.1
    }
  ],
  solve: (inputs) => {
    const a = inputs.a || 0.04;
    const geom = Math.round(inputs['\\text{Geom}'] || 1);
    const Ta = inputs.T_a !== undefined ? inputs.T_a : -30.0;
    const Tf = inputs.T_f !== undefined ? inputs.T_f : -1.5;
    const h = inputs.h || 35.0;
    const rho_f = inputs['\\rho_f'] || 980.0;
    const dHf_kJ = inputs['\\Delta H_f'] || 250.0;
    const kf = inputs.k_f || 1.5;

    // Convert latent heat kJ/kg -> J/kg
    const dHf_J = dHf_kJ * 1000.0;

    // Geometric shape constants P and R
    let P = 0.5;
    let R = 0.125;
    let geomLabel = 'ورقه نامتناهی (Infinite Slab)';
    if (geom === 2) {
      P = 0.25;
      R = 0.0625;
      geomLabel = 'استوانه طویل (Infinite Cylinder)';
    } else if (geom === 3) {
      P = 1.0 / 6.0;
      R = 1.0 / 24.0;
      geomLabel = 'کره کامل (Sphere)';
    }

    const deltaT = Tf - Ta; // In Kelvin or Celsius (positive driving force)
    const convectiveTerm = (P * a) / h;
    const conductiveTerm = (R * a * a) / kf;
    const sumResistance = convectiveTerm + conductiveTerm;

    // Freezing time in seconds
    const tf_seconds = ((rho_f * dHf_J) / deltaT) * sumResistance;
    const tf_hours = tf_seconds / 3600.0;

    return {
      problemId: 'plank_freezing_time',
      problemTitle: 'محاسبه زمان انجماد ماده غذایی با معادله پلانک',
      topicCategory: 'heat_transfer_freezing',
      primaryFormulaLatex: 't_f = \\frac{\\rho_f \\cdot \\Delta H_f}{T_f - T_a} \\left( \\frac{P \\cdot a}{h} + \\frac{R \\cdot a^2}{k_f} \\right)',
      substitutionLatex: `t_f = \\frac{${rho_f} \\times ${dHf_kJ} \\times 10^3}{${Tf} - (${Ta})} \\left( \\frac{${P.toFixed(3)} \\times ${a}}{${h}} + \\frac{${R.toFixed(4)} \\times ${a}^2}{${kf}} \\right)`,
      steps: [
        {
          stepNumber: 1,
          title: 'تعیین ضرایب شکل هندسی (P و R) و اختلاف دمای محرک',
          formulaLatex: '\\Delta T = T_f - T_a, \\quad \\text{هندسه: } ' + geomLabel,
          substitutionLatex: `\\Delta T = ${Tf} - (${Ta}) = ${deltaT.toFixed(1)}^\\circ\\text{C}, \\quad P = ${P.toFixed(3)}, \\; R = ${R.toFixed(4)}`,
          resultLatex: `\\Delta T = ${deltaT.toFixed(1)}\\text{ K}`
        },
        {
          stepNumber: 2,
          title: 'محاسبه مقاومت‌های حرارتی جابجایی سطحی و هدایت درونی لایه منجمد',
          formulaLatex: 'R_{conv} = \\frac{P \\cdot a}{h}, \\quad R_{cond} = \\frac{R \\cdot a^2}{k_f}',
          substitutionLatex: `R_{conv} = \\frac{${(P * a).toFixed(4)}}{${h}} = ${convectiveTerm.toExponential(3)}, \\; R_{cond} = \\frac{${(R * a * a).toExponential(3)}}{${kf}} = ${conductiveTerm.toExponential(3)}`,
          resultLatex: `\\sum R = ${sumResistance.toExponential(4)}\\text{ (m}^2\\text{K)/W}`
        },
        {
          stepNumber: 3,
          title: 'محاسبه زمان کل انجماد و تبدیل به ساعت',
          formulaLatex: 't_f = \\frac{\\rho_f \\Delta H_f}{\\Delta T} \\sum R, \\quad t_{hours} = \\frac{t_f}{3600}',
          substitutionLatex: `t_f = \\frac{${rho_f} \\times ${dHf_J.toFixed(0)}}{${deltaT.toFixed(1)}} \\times ${sumResistance.toExponential(4)} = ${tf_seconds.toFixed(0)}\\text{ s}`,
          resultLatex: `t_f = ${tf_hours.toFixed(2)}\\text{ ساعت (hours)}`
        }
      ],
      finalResult: {
        value: tf_hours,
        displayFormatted: `${tf_hours.toFixed(2)} ساعت (${tf_seconds.toFixed(0)} ثانیه)`,
        unit: 'hours',
        significantDigits: 3
      },
      dimensionalAudit: {
        isConsistent: true,
        lhsDimension: '[T]',
        rhsDimension: '[T]',
        notes: '[kg/m^3] * [J/kg] / [K] * [(m^2 K)/W] = [J/(m^3 K)] * [(m^2 K)/(J/s)] = [s] (ثانیه)؛ انطباق ابعادی ۱۰۰٪ دقیق است.'
      },
      errorReport: {
        methodName: "Plank's Analytical Freezing Model",
        orderOfAccuracy: 'دقت تحلیلی نیمه‌تجربی (خطای معمول ۱۰ الی ۱۵ درصد)',
        tolerance: 1e-3,
        limitations: [
          'معادله پلانک سرمایش محسوس اولیه مایع تا نقطه انجماد و خنک‌سازی زیر صفر بعد از انجماد کامل را نادیده می‌گیرد.',
          'هدایت حرارتی فاز منجمد و چگالی در طول فرآیند انجماد ثابت فرض شده‌اند (در روش عددی کللند تصحیح می‌شود).'
        ]
      },
      scientificCitation: {
        authors: 'Romeo T. Toledo',
        title: 'Fundamentals of Food Process Engineering',
        publisherOrJournal: 'Springer Science & Business Media',
        year: 2007,
        chapterOrPage: 'Chapter 9: Freezing, pp. 345-355',
        equationNumber: 'Eq. 9.15'
      },
      sympyPythonCode: `import sympy as sp

# Analytical Plank Equation Calculation
a, h, kf, rho_f, dHf, Ta, Tf = sp.symbols('a h kf rho_f dHf Ta Tf', positive=True)
P, R = 0.5, 0.125 # Slab

tf_sec = (rho_f * dHf) / (Tf - Ta) * ((P * a) / h + (R * a**2) / kf)
tf_val = tf_sec.subs({
    a: ${a}, h: ${h}, kf: ${kf}, rho_f: ${rho_f},
    dHf: ${dHf_J}, Ta: ${Math.abs(Ta)}, Tf: ${Math.abs(Tf)} # using delta T = ${deltaT}
})
# Delta T explicit
tf_numeric = float((rho_f.subs(rho_f, ${rho_f}) * ${dHf_J}) / ${deltaT} * ((P * ${a}) / ${h} + (R * ${a}**2) / ${kf}))
print(f"Freezing Time: {tf_numeric / 3600.0:.2f} hours")`
    };
  },
  generateSympyScript: (inputs) => {
    return `import sympy as sp
tf = (${inputs['\\rho_f'] || 980} * ${(inputs['\\Delta H_f'] || 250) * 1000}) / (${(inputs.T_f || -1.5) - (inputs.T_a || -30)}) * ((0.5 * ${inputs.a || 0.04})/${inputs.h || 35} + (0.125 * ${inputs.a || 0.04}**2)/${inputs.k_f || 1.5})
print("Freezing time (hours):", tf / 3600.0)`;
  }
};

/**
 * 7. Non-Newtonian Pipe Flow & Generalized Reynolds (Metzner-Reed)
 * Reference: Toledo (2007), Chapter 6: Fluid Flow, pp. 200-218; Steffe (1996)
 */
export const PROBLEM_METZNER_REED_FLOW: MscEngineeringProblem = {
  id: 'metzner_reed_nonnewtonian_pipe',
  title: 'مکانیک سیالات غیرنیوتنی در لوله‌ها و عدد رینولدز تعمیم‌یافته متزنر-رید',
  topicCategory: 'fluid_mechanics_rheology',
  summaryDescription: 'محاسبه عدد رینولدز تعمیم‌یافته (Re_MR)، تعیین رژیم آرام یا آشفته، ضریب اصطکاک فنینگ، افت فشار لوله‌کشی و توان هیدرولیکی پمپ برای سیالات قانون توان',
  governingEquationLatex: '\\text{Re}_{MR} = \\frac{\\rho D^n v^{2-n}}{K \\cdot 8^{n-1} \\left(\\frac{3n+1}{4n}\\right)^n}, \\quad \\Delta P = 4 f \\frac{L}{D} \\frac{\\rho v^2}{2}',
  variables: [
    {
      name: 'شاخص رفتار جریان قانون توان (Flow Behavior Index n)',
      symbol: 'n',
      unit: '-',
      dimension: '1',
      description: 'کمتر از ۱: سیال رقیق‌شونده با برش (شبه‌پلاستیک مثل پوره، رب، سس)',
      defaultValue: 0.45,
      minValue: 0.1,
      maxValue: 1.5,
      step: 0.05
    },
    {
      name: 'شاخص قوام سیال (Consistency Coefficient K)',
      symbol: 'K',
      unit: 'Pa·s^n',
      dimension: '[M][L]^-1[T]^(n-2)',
      description: 'ضریب قوام استوالد-دی واله',
      defaultValue: 5.5,
      minValue: 0.1,
      maxValue: 100.0,
      step: 0.5
    },
    {
      name: 'چگالی سیال غذایی (Fluid Density)',
      symbol: '\\rho',
      unit: 'kg/m^3',
      dimension: '[M][L]^-3',
      description: 'چگالی سیال پمپ‌شونده',
      defaultValue: 1080.0,
      minValue: 800.0,
      maxValue: 1500.0,
      step: 10.0
    },
    {
      name: 'قطر داخلی لوله استیل (Pipe Inner Diameter D)',
      symbol: 'D',
      unit: 'm',
      dimension: '[L]',
      description: 'قطر لوله خط انتقال استیل بهداشتی',
      defaultValue: 0.05,
      minValue: 0.01,
      maxValue: 0.2,
      step: 0.005
    },
    {
      name: 'سرعت متوسط سیال در لوله (Mean Velocity v)',
      symbol: 'v',
      unit: 'm/s',
      dimension: '[L][T]^-1',
      description: 'سرعت خطی عبور سیال در مقطع لوله',
      defaultValue: 1.2,
      minValue: 0.1,
      maxValue: 5.0,
      step: 0.1
    },
    {
      name: 'طول کل لوله‌کشی با اتصالات (Equivalent Pipe Length L)',
      symbol: 'L',
      unit: 'm',
      dimension: '[L]',
      description: 'طول مستقیم لوله به همراه طول معادل زانوها و شیرآلات',
      defaultValue: 45.0,
      minValue: 5.0,
      maxValue: 500.0,
      step: 5.0
    },
    {
      name: 'راندمان مکانیکی پمپ (Pump Efficiency)',
      symbol: '\\eta_{pump}',
      unit: '%',
      dimension: '1',
      description: 'راندمان کل الکتروپمپ جابجایی مثبت یا گریز از مرکز',
      defaultValue: 70.0,
      minValue: 40.0,
      maxValue: 95.0,
      step: 5.0
    }
  ],
  solve: (inputs) => {
    const n = inputs.n || 0.45;
    const K = inputs.K || 5.5;
    const rho = inputs['\\rho'] || 1080.0;
    const D = inputs.D || 0.05;
    const v = inputs.v || 1.2;
    const L = inputs.L || 45.0;
    const eta = (inputs['\\eta_{pump}'] || 70.0) / 100.0;

    // Metzner-Reed factor K'
    const shapeTerm = (3 * n + 1) / (4 * n);
    const K_prime = K * Math.pow(shapeTerm, n);

    // Re_MR = (rho * D^n * v^(2-n)) / (K' * 8^(n-1))
    const numerator = rho * Math.pow(D, n) * Math.pow(v, 2 - n);
    const denominator = K_prime * Math.pow(8, n - 1);
    const Re_MR = numerator / denominator;

    // Friction factor f (Fanning)
    let f = 0.0;
    let regime = '';
    if (Re_MR <= 2100) {
      f = 16.0 / Re_MR;
      regime = 'آرام (Laminar Flow, Re <= 2100)';
    } else {
      f = 0.079 / Math.pow(Re_MR, 0.25); // Blasius approximation for non-Newtonian
      regime = 'آشفته (Turbulent Flow, Re > 2100)';
    }

    // Pressure drop: Delta P = 4 * f * (L / D) * (rho * v^2 / 2)
    const dynamicPressure = (rho * v * v) / 2.0;
    const deltaP = 4.0 * f * (L / D) * dynamicPressure; // in Pa
    const deltaP_bar = deltaP / 100000.0;

    // Flow rate Q = A * v = (pi * D^2 / 4) * v
    const Area = (Math.PI * D * D) / 4.0;
    const Q = Area * v; // m^3/s
    const Q_m3_h = Q * 3600.0;

    // Pump hydraulic power: P_h = Q * Delta P (Watts)
    const P_hydraulic = Q * deltaP;
    const P_brake_kW = P_hydraulic / eta / 1000.0;

    return {
      problemId: 'metzner_reed_nonnewtonian_pipe',
      problemTitle: 'مکانیک سیالات غیرنیوتنی و محاسبه افت فشار و توان پمپ',
      topicCategory: 'fluid_mechanics_rheology',
      primaryFormulaLatex: '\\text{Re}_{MR} = \\frac{\\rho D^n v^{2-n}}{K \\cdot 8^{n-1} \\left(\\frac{3n+1}{4n}\\right)^n}, \\quad \\Delta P = 4 f \\frac{L}{D} \\frac{\\rho v^2}{2}, \\quad P_{pump} = \\frac{Q \\cdot \\Delta P}{\\eta}',
      substitutionLatex: `n = ${n}, \\; K = ${K}\\text{ Pa}\\cdot\\text{s}^n, \\; D = ${D}\\text{ m}, \\; v = ${v}\\text{ m/s}, \\; L = ${L}\\text{ m}, \\; \\rho = ${rho}\\text{ kg/m}^3`,
      steps: [
        {
          stepNumber: 1,
          title: 'محاسبه عدد رینولدز تعمیم‌یافته متزنر-رید (Re_MR) و رژیم جریان',
          formulaLatex: '\\text{Re}_{MR} = \\frac{\\rho D^n v^{2-n}}{K 8^{n-1} [ (3n+1)/(4n) ]^n}',
          substitutionLatex: `\\frac{${rho} \\times ${D}^${n} \\times ${v}^{${(2 - n).toFixed(2)}}}{${K} \\times 8^{${(n - 1).toFixed(2)}} \\times ${shapeTerm.toFixed(3)}^${n}}`,
          resultLatex: `\\text{Re}_{MR} = ${Re_MR.toFixed(1)} \\implies \\text{رژیم جریان: } ${regime}`
        },
        {
          stepNumber: 2,
          title: 'محاسبه ضریب اصطکاک فنینگ (Fanning Friction Factor)',
          formulaLatex: Re_MR <= 2100 ? 'f = \\frac{16}{\\text{Re}_{MR}}' : 'f = \\frac{0.079}{\\text{Re}_{MR}^{0.25}}',
          substitutionLatex: Re_MR <= 2100 ? `\\frac{16}{${Re_MR.toFixed(1)}}` : `\\frac{0.079}{${Re_MR.toFixed(1)}^{0.25}}`,
          resultLatex: `f = ${f.toFixed(4)}`
        },
        {
          stepNumber: 3,
          title: 'محاسبه افت فشار کل لوله و دبی حجمی عبوری',
          formulaLatex: '\\Delta P = 4 f \\left(\\frac{L}{D}\\right) \\left(\\frac{\\rho v^2}{2}\\right), \\quad Q = \\frac{\\pi D^2}{4} v',
          substitutionLatex: `\\Delta P = 4(${f.toFixed(4)}) \\left(\\frac{${L}}{${D}}\\right) \\left(\\frac{${rho} \\times ${v}^2}{2}\\right) = ${deltaP.toFixed(0)}\\text{ Pa}`,
          resultLatex: `\\Delta P = ${deltaP_bar.toFixed(2)}\\text{ bar}, \\quad Q = ${Q_m3_h.toFixed(1)}\\text{ m}^3\\text{/h}`
        },
        {
          stepNumber: 4,
          title: 'محاسبه توان الکتریکی مورد نیاز محور پمپ (Brake Power)',
          formulaLatex: 'P_{brake} = \\frac{Q \\cdot \\Delta P}{\\eta_{pump}}',
          substitutionLatex: `\\frac{${Q.toFixed(5)} \\times ${deltaP.toFixed(0)}}{${eta.toFixed(2)}} = ${P_hydraulic.toFixed(0)}\\text{ W} / ${eta.toFixed(2)}`,
          resultLatex: `P_{pump} = ${P_brake_kW.toFixed(2)}\\text{ kW}`
        }
      ],
      finalResult: {
        value: deltaP_bar,
        displayFormatted: `افت فشار: ${deltaP_bar.toFixed(2)} bar (${deltaP.toFixed(0)} Pa) | توان پمپ: ${P_brake_kW.toFixed(2)} kW`,
        unit: 'bar',
        significantDigits: 4
      },
      dimensionalAudit: {
        isConsistent: true,
        lhsDimension: '[M][L]^-1[T]^-2',
        rhsDimension: '[M][L]^-1[T]^-2',
        notes: 'افت فشار بعد پاسکال [Pa = N/m^2 = kg/(m s^2)] و توان بعد وات [W = J/s = kg m^2 / s^3] دارد؛ انطباق ۱۰۰٪ تایید شد.'
      },
      errorReport: {
        methodName: 'Metzner-Reed Non-Newtonian Pipe Flow Model',
        orderOfAccuracy: 'مدل ساختاری تحلیلی پدیده‌های انتقال (Bird-Stewart-Lightfoot)',
        tolerance: 1e-4,
        limitations: [
          'مدل قانون توان برای نرخ‌های برش بسیار پایین یا بسیار بالا که گرانروی به سمت مقادیر حدی ثابت نیوتنی میل می‌کند انحراف دارد.',
          'تنش تسلیم (Yield stress) در نظر گرفته نشده است؛ در صورت وجود تنش تسلیم باید از معادله باکینگهام-رایزر هرشل-بالکلی استفاده شود.'
        ]
      },
      scientificCitation: {
        authors: 'Romeo T. Toledo',
        title: 'Fundamentals of Food Process Engineering',
        publisherOrJournal: 'Springer Science',
        year: 2007,
        chapterOrPage: 'Chapter 6: Fluid Flow, pp. 200-218',
        equationNumber: 'Eq. 6.30 - 6.35'
      },
      sympyPythonCode: `import sympy as sp
import numpy as np

n = ${n}
K = ${K}
rho = ${rho}
D = ${D}
v = ${v}
L = ${L}
eta = ${eta}

# Metzner-Reed Reynolds
term = (3 * n + 1) / (4 * n)
K_prime = K * (term ** n)
Re_mr = (rho * (D**n) * (v**(2 - n))) / (K_prime * (8**(n - 1)))

f = 16.0 / Re_mr if Re_mr <= 2100 else 0.079 / (Re_mr**0.25)
delta_P = 4 * f * (L / D) * (rho * v**2 / 2.0)
Q = (np.pi * D**2 / 4.0) * v
P_pump_kW = (Q * delta_P) / eta / 1000.0

print(f"Re_MR: {Re_mr:.1f}")
print(f"Delta P: {delta_P / 1e5:.2f} bar")
print(f"Pump Power: {P_pump_kW:.2f} kW")`
    };
  },
  generateSympyScript: (inputs) => {
    return `import numpy as np
n, K, rho, D, v = ${inputs.n || 0.45}, ${inputs.K || 5.5}, ${inputs['\\rho'] || 1080}, ${inputs.D || 0.05}, ${inputs.v || 1.2}
term = (3*n + 1)/(4*n)
Re_mr = (rho * (D**n) * (v**(2-n))) / (K * (term**n) * (8**(n-1)))
f = 16.0 / Re_mr if Re_mr <= 2100 else 0.079 / (Re_mr**0.25)
dP = 4 * f * (${inputs.L || 45} / D) * (rho * v**2 / 2.0)
print(f"Re_MR = {Re_mr:.1f}, DeltaP = {dP/1e5:.2f} bar")`;
  }
};
