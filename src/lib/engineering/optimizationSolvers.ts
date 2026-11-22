import { MscEngineeringProblem, MscSolutionResult } from './types';

/**
 * 8. Evaporator Mass & Energy Balance and Steam Economy
 * Reference: Geankoplis (2003), Chapter 8: Evaporation, pp. 524-535; Toledo (2007), pp. 410-425
 */
export const PROBLEM_EVAPORATOR_ECONOMY: MscEngineeringProblem = {
  id: 'evaporator_mass_energy_economy',
  title: 'موازنه جرم و انرژی اواپراتور تحت خلاء، راندمان مصرف بخار و سطح تبادل حرارت',
  topicCategory: 'mass_energy_balance',
  summaryDescription: 'محاسبه دبی تبخیر بخار، دبی بخار زنده مورد نیاز (Steam Consumption)، راندمان مصرف بخار (Steam Economy) و سطح لازم انتقال حرارت (Heat Transfer Area) در تغلیظ آبمیوه/رب',
  governingEquationLatex: 'F x_F = L x_L, \\quad V = F - L, \\quad S = \\frac{F c_{pF} (T_1 - T_F) + V \\lambda_1}{\\lambda_S}, \\quad \\text{Economy} = \\frac{V}{S}, \\quad A = \\frac{S \\lambda_S}{U (T_S - T_1)}',
  variables: [
    {
      name: 'دبی خوراک ورودی به اواپراتور (Feed Rate F)',
      symbol: 'F',
      unit: 'kg/h',
      dimension: '[M][T]^-1',
      description: 'دبی جرمی خوراک رقیق ورودی به اواپراتور',
      defaultValue: 10000.0,
      minValue: 500.0,
      maxValue: 100000.0,
      step: 500.0
    },
    {
      name: 'بریکس یا درصد ماده خشک خوراک (Feed Solids xF)',
      symbol: 'x_F',
      unit: '%',
      dimension: '1',
      description: 'درصد جامدات محلول خوراک رقیق',
      defaultValue: 10.0,
      minValue: 2.0,
      maxValue: 40.0,
      step: 0.5
    },
    {
      name: 'بریکس یا درصد ماده خشک محصول نهایی (Product Solids xL)',
      symbol: 'x_L',
      unit: '%',
      dimension: '1',
      description: 'درصد جامدات محلول محصول غلیظ‌شده خروجی',
      defaultValue: 50.0,
      minValue: 20.0,
      maxValue: 75.0,
      step: 1.0
    },
    {
      name: 'دمای خوراک ورودی (Feed Temp TF)',
      symbol: 'T_F',
      unit: '°C',
      dimension: '[\\Theta]',
      description: 'دمای خوراک مایع قبل از ورود به اواپراتور',
      defaultValue: 35.0,
      minValue: 10.0,
      maxValue: 90.0,
      step: 1.0
    },
    {
      name: 'دمای جوشش در اواپراتور تحت خلاء (Boiling Temp T1)',
      symbol: 'T_1',
      unit: '°C',
      dimension: '[\\Theta]',
      description: 'دمای تبخیر مایع در فشار خلاء محفظه',
      defaultValue: 60.0,
      minValue: 45.0,
      maxValue: 95.0,
      step: 1.0
    },
    {
      name: 'دمای بخار زنده گرم‌کننده (Heating Steam Temp TS)',
      symbol: 'T_S',
      unit: '°C',
      dimension: '[\\Theta]',
      description: 'دمای بخار اشباع ورودی به ژاکت یا لوله‌های اواپراتور',
      defaultValue: 110.0,
      minValue: 80.0,
      maxValue: 150.0,
      step: 1.0
    },
    {
      name: 'ضریب کلی انتقال حرارت (Overall Heat Transfer Coeff U)',
      symbol: 'U',
      unit: 'W/(m^2·K)',
      dimension: '[M][T]^-3[\\Theta]^-1',
      description: 'ضریب انتقال حرارت مبدل لوله و پوسته اواپراتور',
      defaultValue: 1800.0,
      minValue: 400.0,
      maxValue: 4000.0,
      step: 100.0
    }
  ],
  solve: (inputs) => {
    const F = inputs.F || 10000.0;
    const xF = (inputs.x_F || 10.0) / 100.0;
    const xL = (inputs.x_L || 50.0) / 100.0;
    const TF = inputs.T_F || 35.0;
    const T1 = inputs.T_1 || 60.0;
    const TS = inputs.T_S || 110.0;
    const U = inputs.U || 1800.0;

    // Component mass balance: F * xF = L * xL  => L = F * (xF / xL)
    const L = F * (xF / xL);
    // Overall mass balance: V = F - L
    const V = F - L;

    // Specific heat of feed (Siebel formula): cp = 4.187 * w + 1.42 * s  where w = 1 - xF
    const cpF = (4.187 * (1.0 - xF) + 1.42 * xF); // kJ/(kg * K)

    // Latent heat of vaporization at T1 and TS (Regnault correlation)
    const lambda_1 = 2501.0 - 2.37 * T1; // kJ/kg for evaporated vapor at T1
    const lambda_S = 2501.0 - 2.37 * TS; // kJ/kg for heating steam at TS

    // Sensible heat needed to raise feed from TF to T1
    const q_sensible_kW = (F * cpF * (T1 - TF)) / 3600.0; // kW

    // Latent heat of vaporization needed
    const q_latent_kW = (V * lambda_1) / 3600.0; // kW
    const q_total_kW = q_sensible_kW + q_latent_kW;
    const q_total_Watts = q_total_kW * 1000.0;

    // Steam consumption S in kg/h
    const S = (q_total_kW * 3600.0) / lambda_S; // kg/h

    // Steam Economy = kg vapor evaporated / kg steam supplied
    const steamEconomy = V / S;

    // Heat transfer area: A = q / (U * deltaT)
    const deltaT = TS - T1;
    const Area_m2 = q_total_Watts / (U * deltaT);

    return {
      problemId: 'evaporator_mass_energy_economy',
      problemTitle: 'موازنه جرم و انرژی اواپراتور تغلیظ و راندمان مصرف بخار',
      topicCategory: 'mass_energy_balance',
      primaryFormulaLatex: 'F x_F = L x_L, \\quad V = F - L, \\quad q = F c_{pF} (T_1 - T_F) + V \\lambda_1 = S \\lambda_S, \\quad A = \\frac{q}{U \\Delta T}',
      substitutionLatex: `F = ${F}\\text{ kg/h}, \\; x_F = ${xF * 100}\\%, \\; x_L = ${xL * 100}\\%, \\; T_1 = ${T1}^\\circ\\text{C}, \\; T_S = ${TS}^\\circ\\text{C}, \\; U = ${U}\\text{ W/(m}^2\\text{K)}`,
      steps: [
        {
          stepNumber: 1,
          title: 'موازنه جرم کل و ماده خشک (تعیین دبی محصول غلیظ و بخار تولیدی)',
          formulaLatex: 'L = F \\left(\\frac{x_F}{x_L}\\right), \\quad V = F - L',
          substitutionLatex: `L = ${F} \\left(\\frac{${(xF * 100).toFixed(0)}}{${(xL * 100).toFixed(0)}}\\right) = ${L.toFixed(1)}\\text{ kg/h}, \\quad V = ${F} - ${L.toFixed(1)}`,
          resultLatex: `L = ${L.toFixed(1)}\\text{ kg/h}, \\quad V = ${V.toFixed(1)}\\text{ kg/h تبخیر}`
        },
        {
          stepNumber: 2,
          title: 'موازنه انرژی و بار حرارتی کل اواپراتور (محسوس + نهان)',
          formulaLatex: 'q_{total} = F c_{pF} (T_1 - T_F) + V \\lambda_1',
          substitutionLatex: `q = \\frac{${F} \\times ${cpF.toFixed(2)} \\times (${T1} - ${TF})}{3600} + \\frac{${V.toFixed(1)} \\times ${lambda_1.toFixed(1)}}{3600} = ${q_sensible_kW.toFixed(1)} + ${q_latent_kW.toFixed(1)}\\text{ kW}`,
          resultLatex: `q_{total} = ${q_total_kW.toFixed(1)}\\text{ kW}`
        },
        {
          stepNumber: 3,
          title: 'محاسبه دبی بخار زنده گرم‌کننده (S) و راندمان مصرف بخار (Steam Economy)',
          formulaLatex: 'S = \\frac{q_{total}}{\\lambda_S}, \\quad \\text{Economy} = \\frac{V}{S}',
          substitutionLatex: `S = \\frac{${q_total_kW.toFixed(1)} \\times 3600}{${lambda_S.toFixed(1)}} = ${S.toFixed(1)}\\text{ kg/h}, \\quad \\text{Economy} = \\frac{${V.toFixed(1)}}{${S.toFixed(1)}}`,
          resultLatex: `S = ${S.toFixed(1)}\\text{ kg/h}, \\quad \\text{Economy} = ${steamEconomy.toFixed(3)}\\text{ kg تبخیر / kg بخار}`
        },
        {
          stepNumber: 4,
          title: 'محاسبه سطح مقطع لازم تبادل حرارت مبدل اواپراتور',
          formulaLatex: 'A = \\frac{q}{U (T_S - T_1)}',
          substitutionLatex: `A = \\frac{${q_total_Watts.toFixed(0)}}{${U} \\times (${TS} - ${T1})}`,
          resultLatex: `A = ${Area_m2.toFixed(1)}\\text{ متر مربع (m}^2\\text{)}`
        }
      ],
      finalResult: {
        value: steamEconomy,
        displayFormatted: `راندمان بخار: ${steamEconomy.toFixed(2)} | مصرف بخار S: ${S.toFixed(0)} kg/h | سطح مبدل A: ${Area_m2.toFixed(1)} m²`,
        unit: 'kg_vap/kg_steam',
        significantDigits: 3
      },
      dimensionalAudit: {
        isConsistent: true,
        lhsDimension: '1',
        rhsDimension: '1',
        notes: 'راندمان مصرف بخار نسبت دو دبی جرمی [kg/h] / [kg/h] و بدون بعد است؛ سطح انتقال حرارت دارای بعد [L]^2 (متر مربع) است.'
      },
      errorReport: {
        methodName: 'Steady-State Lumped Enthalpy Balance',
        orderOfAccuracy: 'دقت تحلیلی موازنه جرم و انرژی ترمودینامیکی',
        tolerance: 1e-4,
        limitations: [
          'افزایش نقطه جوش ناشی از غلظت جامدات (BPR / Dühring Rule) در غلظت‌های بسیار بالا (>65 Brix) باید به دمای T1 اضافه شود.',
          'اتلاف حرارتی جدار اواپراتور به محیط (Heat Loss ~ 2-3%) در این مدل به عنوان اواپراتور عایق‌کاری‌شده صفر فرض شده است.'
        ]
      },
      scientificCitation: {
        authors: 'Christie J. Geankoplis',
        title: 'Transport Processes and Separation Process Principles (4th Edition)',
        publisherOrJournal: 'Prentice Hall',
        year: 2003,
        chapterOrPage: 'Chapter 8: Evaporation, pp. 524-540',
        equationNumber: 'Eq. 8.4-1 - 8.4-8'
      },
      sympyPythonCode: `import sympy as sp

# Analytical Evaporator Model in SymPy
F, xF, xL, TF, T1, TS, U = ${F}, ${xF}, ${xL}, ${TF}, ${T1}, ${TS}, ${U}

L = F * (xF / xL)
V = F - L

cpF = 4.187 * (1 - xF) + 1.42 * xF
lambda_1 = 2501 - 2.37 * T1
lambda_S = 2501 - 2.37 * TS

q_kW = (F * cpF * (T1 - TF) + V * lambda_1) / 3600.0
S = (q_kW * 3600.0) / lambda_S
economy = V / S
A = (q_kW * 1000.0) / (U * (TS - T1))

print(f"Product Rate (L): {L:.1f} kg/h")
print(f"Evaporated (V):    {V:.1f} kg/h")
print(f"Steam Needed (S): {S:.1f} kg/h")
print(f"Steam Economy:    {economy:.3f}")
print(f"Heating Area (A): {A:.1f} m2")`
    };
  },
  generateSympyScript: (inputs) => {
    return `F, xF, xL = ${inputs.F || 10000}, ${(inputs.x_F || 10)/100}, ${(inputs.x_L || 50)/100}
L = F * (xF / xL)
V = F - L
print(f"Vapor = {V} kg/h, Product = {L} kg/h")`;
  }
};

/**
 * 9. Psychrometric Calculations for Air Drying of Foods
 * Reference: Toledo (2007), Chapter 10: Dehydration, pp. 385-402
 */
export const PROBLEM_PSYCHROMETRICS_DRYING: MscEngineeringProblem = {
  id: 'psychrometric_drying_properties',
  title: 'سایکرومتری هوای مرطوب، فشار بخار و رطوبت ویژه در خشک‌کن‌های صنعتی',
  topicCategory: 'thermodynamics_drying',
  summaryDescription: 'محاسبه فشار بخار اشباع و نسبی (Antoine)، رطوبت ویژه (Humidity Ratio W)، آنتالپی هوای مرطوب (H) و دمای نقطه شبنم (Dew Point)',
  governingEquationLatex: 'P_{vs}(T) = \\exp\\left(A - \\frac{B}{T + C}\\right), \\quad W = 0.622 \\frac{P_v}{P_{atm} - P_v}, \\quad H = c_{pa} T + W (h_{we} + c_{pw} T)',
  variables: [
    {
      name: 'دمای حباب خشک هوا (Dry-Bulb Temperature Tdb)',
      symbol: 'T_{db}',
      unit: '°C',
      dimension: '[\\Theta]',
      description: 'دمای هوای ورودی یا خروجی خشک‌کن',
      defaultValue: 65.0,
      minValue: 10.0,
      maxValue: 120.0,
      step: 1.0
    },
    {
      name: 'رطوبت نسبی هوا (Relative Humidity RH)',
      symbol: 'RH',
      unit: '%',
      dimension: '1',
      description: 'درصد اشباع رطوبت هوای فرآیند',
      defaultValue: 25.0,
      minValue: 2.0,
      maxValue: 98.0,
      step: 1.0
    },
    {
      name: 'فشار کل اتمسفری (Atmospheric Pressure Patm)',
      symbol: 'P_{atm}',
      unit: 'kPa',
      dimension: '[M][L]^-1[T]^-2',
      description: 'فشار بارومتریک محیط کارخانه (۱۰۱.۳۲۵ در سطح دریا)',
      defaultValue: 101.325,
      minValue: 80.0,
      maxValue: 105.0,
      step: 0.5
    }
  ],
  solve: (inputs) => {
    const T = inputs.T_db || 65.0;
    const RH = (inputs.RH || 25.0) / 100.0;
    const Patm = inputs.P_atm || 101.325; // kPa

    // Antoine equation for water saturation pressure Pvs (in kPa):
    // log10(P_mmHg) = 8.07131 - 1730.63 / (233.426 + T)
    const log10_P_mmHg = 8.07131 - 1730.63 / (233.426 + T);
    const Pvs_mmHg = Math.pow(10, log10_P_mmHg);
    const Pvs_kPa = Pvs_mmHg * 0.133322; // 1 mmHg = 0.133322 kPa

    // Partial pressure of water vapor: Pv = RH * Pvs
    const Pv_kPa = RH * Pvs_kPa;

    // Humidity Ratio W = 0.622 * (Pv / (Patm - Pv))  in kg water / kg dry air
    const W = 0.622 * (Pv_kPa / (Patm - Pv_kPa));
    const W_g = W * 1000.0; // g/kg dry air

    // Specific volume of moist air: v = (Ra * T_K / Patm_Pa) * (1 + 1.608 * W)
    const T_K = T + 273.15;
    const Ra = 287.058; // J / (kg * K)
    const Patm_Pa = Patm * 1000.0;
    const specificVolume = (Ra * T_K / Patm_Pa) * (1.0 + 1.608 * W); // m^3 / kg dry air

    // Enthalpy H (kJ / kg dry air) = 1.006 * T + W * (2501 + 1.86 * T)
    const H = 1.006 * T + W * (2501.0 + 1.86 * T);

    // Dew point temperature Tdp (inverse Antoine for Pv)
    const Pv_mmHg = Pv_kPa / 0.133322;
    const Tdp = (1730.63 / (8.07131 - Math.log10(Pv_mmHg))) - 233.426;

    return {
      problemId: 'psychrometric_drying_properties',
      problemTitle: 'محاسبات سایکرومتری هوای مرطوب در خشک‌کن‌های مواد غذایی',
      topicCategory: 'thermodynamics_drying',
      primaryFormulaLatex: 'P_{vs} = 10^{A - \\frac{B}{T + C}}, \\quad P_v = RH \\cdot P_{vs}, \\quad W = 0.622 \\frac{P_v}{P_{atm} - P_v}, \\quad H = 1.006 T + W (2501 + 1.86 T)',
      substitutionLatex: `T_{db} = ${T}^\\circ\\text{C}, \\; RH = ${(RH * 100).toFixed(0)}\\%, \\; P_{atm} = ${Patm}\\text{ kPa}`,
      steps: [
        {
          stepNumber: 1,
          title: 'محاسبه فشار بخار اشباع و فشار جزیی بخار آب در هوا (Antoine Equation)',
          formulaLatex: '\\log_{10}(P_{vs}) = 8.07131 - \\frac{1730.63}{233.426 + T}, \\quad P_v = RH \\cdot P_{vs}',
          substitutionLatex: `P_{vs}(${T}^\\circ\\text{C}) = ${Pvs_kPa.toFixed(2)}\\text{ kPa}, \\quad P_v = ${RH.toFixed(2)} \\times ${Pvs_kPa.toFixed(2)}`,
          resultLatex: `P_{vs} = ${Pvs_kPa.toFixed(2)}\\text{ kPa}, \\quad P_v = ${Pv_kPa.toFixed(2)}\\text{ kPa}`
        },
        {
          stepNumber: 2,
          title: 'محاسبه رطوبت ویژه هوا (Humidity Ratio W)',
          formulaLatex: 'W = 0.622 \\frac{P_v}{P_{atm} - P_v}',
          substitutionLatex: `W = 0.622 \\left(\\frac{${Pv_kPa.toFixed(2)}}{${Patm} - ${Pv_kPa.toFixed(2)}}\\right) = ${W.toFixed(5)}\\text{ kg/kg}`,
          resultLatex: `W = ${W_g.toFixed(2)}\\text{ گرم آب / کیلوگرم هوای خشک}`
        },
        {
          stepNumber: 3,
          title: 'محاسبه آنتالپی و حجم مخصوص هوای مرطوب',
          formulaLatex: 'H = 1.006 T + W (2501 + 1.86 T), \\quad v = \\frac{R_a T_K}{P_{atm}} (1 + 1.608 W)',
          substitutionLatex: `H = 1.006(${T}) + ${W.toFixed(4)}(2501 + 1.86(${T})) = ${H.toFixed(1)}\\text{ kJ/kg}`,
          resultLatex: `H = ${H.toFixed(1)}\\text{ kJ/kg dry air}, \\quad v = ${specificVolume.toFixed(3)}\\text{ m}^3\\text{/kg}`
        },
        {
          stepNumber: 4,
          title: 'محاسبه دمای نقطه شبنم (Dew Point Temperature)',
          formulaLatex: 'T_{dp} = \\frac{1730.63}{8.07131 - \\log_{10}(P_v / 0.133322)} - 233.426',
          substitutionLatex: `T_{dp}(${Pv_kPa.toFixed(2)}\\text{ kPa}) = ${Tdp.toFixed(1)}^\\circ\\text{C}`,
          resultLatex: `T_{dp} = ${Tdp.toFixed(1)}^\\circ\\text{C}`
        }
      ],
      finalResult: {
        value: W_g,
        displayFormatted: `رطوبت ویژه W: ${W_g.toFixed(2)} g/kg | آنتالپی H: ${H.toFixed(1)} kJ/kg | نقطه شبنم: ${Tdp.toFixed(1)} °C`,
        unit: 'g_H2O/kg_air',
        significantDigits: 4
      },
      dimensionalAudit: {
        isConsistent: true,
        lhsDimension: '1',
        rhsDimension: '1',
        notes: 'رطوبت ویژه نسبت جرم بخار آب به جرم هوای خشک [M]/[M] و بدون بعد است؛ آنتالپی بعد انرژی بر جرم [L]^2[T]^-2 (kJ/kg) دارد.'
      },
      errorReport: {
        methodName: 'ASHRAE / Antoine Psychrometric Formulations',
        orderOfAccuracy: 'دقت معادلات حالتی گاز کامل برای هوای مرطوب (< 0.2% خطا در فشار اتمسفریک)',
        tolerance: 1e-4,
        limitations: [
          'در فشارهای بسیار بالا (>5 bar) انحراف گازهای واقعی از قانون دالتون باید با ضرایب فوگاسیته اصلاح شود.',
          'معادله آنتوان در این فرمولاسیون برای محدوده دمایی ۰ تا ۱۰۰ درجه سلسیوس کالیبره شده است.'
        ]
      },
      scientificCitation: {
        authors: 'Romeo T. Toledo',
        title: 'Fundamentals of Food Process Engineering',
        publisherOrJournal: 'Springer Science',
        year: 2007,
        chapterOrPage: 'Chapter 10: Dehydration, pp. 385-405',
        equationNumber: 'Eq. 10.1 - 10.8'
      },
      sympyPythonCode: `import sympy as sp
import numpy as np

T, RH, Patm = ${T}, ${RH}, ${Patm}

# Antoine Equation
log10_P_mmHg = 8.07131 - 1730.63 / (233.426 + T)
Pvs_kPa = (10**log10_P_mmHg) * 0.133322
Pv_kPa = RH * Pvs_kPa

W = 0.622 * (Pv_kPa / (Patm - Pv_kPa))
H = 1.006 * T + W * (2501.0 + 1.86 * T)

print(f"Saturation Pressure (Pvs): {Pvs_kPa:.3f} kPa")
print(f"Vapor Pressure (Pv):      {Pv_kPa:.3f} kPa")
print(f"Humidity Ratio (W):       {W * 1000.0:.2f} g/kg")
print(f"Moist Air Enthalpy (H):   {H:.1f} kJ/kg")`
    };
  },
  generateSympyScript: (inputs) => {
    return `import numpy as np
T, RH = ${inputs.T_db || 65}, ${(inputs.RH || 25)/100}
Pvs = (10 ** (8.07131 - 1730.63 / (233.426 + T))) * 0.133322
Pv = RH * Pvs
W = 0.622 * (Pv / (${inputs.P_atm || 101.325} - Pv))
print(f"W = {W*1000:.2f} g/kg, Pv = {Pv:.2f} kPa")`;
  }
};
