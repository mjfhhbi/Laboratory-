import {
  FoodGeometryType,
  FreezingProcessInputs,
  FreezingThawingResults,
  DimensionlessNumbers,
  FreezingCalculationStep,
  TemperatureTimePoint,
  SensitivityPoint
} from './types';

/**
 * Air thermophysical properties at typical blast-freezer temperatures (~ -25°C to -35°C)
 */
const AIR_PROPERTIES = {
  density: 1.45,        // kg/m3
  kinematicViscosity: 1.15e-5, // m2/s
  thermalConductivity: 0.0215, // W/(m·K)
  prandtlNumber: 0.725
};

const STEFAN_BOLTZMANN = 5.670374e-8; // W/(m2·K4)

/**
 * Calculate convective and radiative heat transfer coefficients
 */
export function calculateEffectiveH(inputs: FreezingProcessInputs): {
  hConv: number;
  hRad: number;
  hTotal: number;
} {
  let hConv = inputs.heatTransferCoefficientH;

  // If user selected an automated convection mode, compute hConv based on fluid mechanics correlations
  if (inputs.convectionMode === 'air_blast' && inputs.airVelocityMs) {
    const v = Math.max(0.1, inputs.airVelocityMs);
    const L = Math.max(0.01, inputs.thicknessOrDiameterM);
    const Re = (v * L) / AIR_PROPERTIES.kinematicViscosity;
    
    // Industrial cross-flow / flat plate empirical correlation for blast freezers
    // h = (Nu * k_air) / L, where Nu = 0.037 * Re^0.8 * Pr^(1/3) (turbulent boundary layer)
    // or standard food engineering approximation: h ~ 7.3 * v^0.8 / (L^0.2)
    const Nu = 0.037 * Math.pow(Re, 0.8) * Math.pow(AIR_PROPERTIES.prandtlNumber, 0.333);
    hConv = Math.max(15, (Nu * AIR_PROPERTIES.thermalConductivity) / L);
  } else if (inputs.convectionMode === 'still_air') {
    hConv = 8.5; // Natural convection in cold storage room
  } else if (inputs.convectionMode === 'plate_freezer') {
    hConv = 350.0; // High contact conduction between metal plates and product
  } else if (inputs.convectionMode === 'immersion_brine') {
    hConv = 650.0; // Turbulent liquid brine immersion
  } else if (inputs.convectionMode === 'cryogenic_nitrogen') {
    hConv = 1100.0; // Boiling liquid nitrogen / CO2 spray
  }

  // Radiative heat transfer coefficient: h_r = epsilon * sigma * (T_s + T_a) * (T_s^2 + T_a^2)
  let hRad = 0;
  if (inputs.includeRadiation) {
    const eps = inputs.surfaceEmissivity ?? 0.90;
    const TsK = inputs.initialTemperatureTi + 273.15;
    const TaK = inputs.ambientMediumTemperatureTa + 273.15;
    hRad = eps * STEFAN_BOLTZMANN * (TsK + TaK) * (TsK * TsK + TaK * TaK);
  }

  const hTotal = hConv + hRad;

  return {
    hConv: Math.round(hConv * 10) / 10,
    hRad: Math.round(hRad * 10) / 10,
    hTotal: Math.round(hTotal * 10) / 10
  };
}

/**
 * Shape factors for Plank's Equation: P and R
 * Standard classical values for Infinite Slab, Infinite Cylinder, Sphere, and Rectangular Brick.
 */
export function getPlankShapeFactors(
  geometry: FoodGeometryType,
  dimensions: { a: number; b?: number; c?: number }
): { P: number; R: number; descriptionFa: string; Lc: number } {
  const a = dimensions.a;

  switch (geometry) {
    case 'slab':
      // Infinite slab of thickness a (heat entering both faces):
      // Lc = a / 2, P = 1/2, R = 1/8
      return {
        P: 0.5,
        R: 0.125,
        descriptionFa: 'تخته نامحدود (Infinite Slab) با ضخامت a. انتقال حرارت یک‌بعدی از دو طرف.',
        Lc: a / 2
      };

    case 'cylinder':
      // Infinite cylinder of diameter a:
      // Lc = a / 4, P = 1/4, R = 1/16
      return {
        P: 0.25,
        R: 0.0625,
        descriptionFa: 'سیلندر نامحدود (Infinite Cylinder) با قطر a. انتقال حرارت شعاعی دو‌بعدی.',
        Lc: a / 4
      };

    case 'sphere':
      // Sphere of diameter a:
      // Lc = a / 6, P = 1/6, R = 1/24
      return {
        P: 1.0 / 6.0,
        R: 1.0 / 24.0,
        descriptionFa: 'کره متقارن (Sphere) با قطر a. انتقال حرارت سه‌بعدی متقارن.',
        Lc: a / 6
      };

    case 'brick':
    default: {
      // Rectangular Brick a x b x c (a <= b <= c)
      const b = dimensions.b && dimensions.b >= a ? dimensions.b : a * 1.5;
      const c = dimensions.c && dimensions.c >= b ? dimensions.c : a * 2.0;
      const beta1 = b / a;
      const beta2 = c / a;

      // Ede (1949) / Cleland geometric approximation:
      // P = 0.5 / (1 + 1/beta1 + 1/beta2)
      // R = 0.125 / (1 + 1/beta1^2 + 1/beta2^2)
      const P = 0.5 / (1.0 + (1.0 / beta1) + (1.0 / beta2));
      const R = 0.125 / (1.0 + (1.0 / (beta1 * beta1)) + (1.0 / (beta2 * beta2)));

      // Characteristic length V / A:
      const volume = a * b * c;
      const area = 2 * (a * b + b * c + a * c);
      const Lc = volume / area;

      return {
        P,
        R,
        descriptionFa: `بلوک مکعب‌مستطیل (${a * 100} × ${b * 100} × ${c * 100} cm) با ضرایب شکل β1=${beta1.toFixed(2)} و β2=${beta2.toFixed(2)}.`,
        Lc
      };
    }
  }
}

/**
 * Main Food Freezing & Thawing Calculation Engine
 */
export function computeFreezingAndThawing(inputs: FreezingProcessInputs): FreezingThawingResults {
  const { properties, geometry } = inputs;
  const a = Math.max(0.005, inputs.thicknessOrDiameterM);
  const Ti = inputs.initialTemperatureTi;
  const Ta = inputs.ambientMediumTemperatureTa;
  const Tc = inputs.targetCenterTemperatureTc;
  const Tif = properties.initialFreezingPointTif;

  // Validation
  if (Ta >= Tif) {
    throw new Error('دمای محیط انجماد (Ta) باید حتماً کمتر از نقطه انجماد اولیه محصول (Tif) باشد.');
  }
  if (Tc >= Tif) {
    throw new Error('دمای نهایی مرکز محصول (Tc) باید کمتر از نقطه انجماد اولیه (Tif) باشد.');
  }

  const { hConv, hRad, hTotal } = calculateEffectiveH(inputs);
  const h = Math.max(1.0, hTotal);

  const { P, R, descriptionFa: shapeDescFa, Lc } = getPlankShapeFactors(geometry, {
    a,
    b: inputs.widthM,
    c: inputs.lengthM
  });

  const rhoF = properties.densityFrozen;
  const rhoU = properties.densityUnfrozen;
  const kf = properties.thermalConductivityFrozen;
  const ku = properties.thermalConductivityUnfrozen;
  const cpf = properties.specificHeatFrozen;
  const cpu = properties.specificHeatUnfrozen;
  const deltaH = properties.latentHeatDeltaH; // kJ/kg -> convert to J/kg by * 1000

  // ==========================================
  // 1. Classical Plank Equation (Latent plateau only)
  // t_f = [rho_f * DeltaH / (Tif - Ta)] * [ (P * a / h) + (R * a^2 / k_f) ]
  // ==========================================
  const deltaTFreezing = Tif - Ta; // in K or °C
  const plankTimeSeconds = 
    ((rhoF * (deltaH * 1000)) / deltaTFreezing) * 
    ((P * a / h) + (R * a * a / kf));
  const plankFreezingTimeMinutes = Math.max(0.1, plankTimeSeconds / 60.0);

  // ==========================================
  // 2. Dimensionless Numbers
  // ==========================================
  const Bi_f = (h * Lc) / kf;
  const Bi_u = (h * Lc) / ku;
  const Pk = (cpu * Math.max(0, Ti - Tif)) / deltaH;
  const Ste = (cpf * Math.max(0, Tif - Ta)) / deltaH;

  // ==========================================
  // 3. Cleland & Earle Modified Freezing Model
  // Incorporates sensible heat pre-cooling (Pk) and sub-cooling (Ste)
  // ==========================================
  // Modified shape factors for sensible heat
  let P_mod = P * (1.0 + 1.026 * Pk + 0.580 * Ste);
  let R_mod = R * (1.0 + 1.202 * Pk + 0.519 * Ste);

  // Effective latent enthalpy including sensible heat:
  // DeltaH_eff = DeltaH + c_pu * (Ti - Tif) + c_pf * (Tif - Tc) * 0.5
  const deltaH_eff = deltaH + cpu * (Ti - Tif) + 0.5 * cpf * (Tif - Tc);
  const clelandTimeSeconds = 
    ((rhoF * (deltaH_eff * 1000)) / deltaTFreezing) * 
    ((P_mod * a / h) + (R_mod * a * a / kf));
  const clelandEarleFreezingTimeMinutes = Math.max(0.1, clelandTimeSeconds / 60.0);

  // ==========================================
  // 4. Pham's Standard Model (1986, ASHRAE standard)
  // Mean freezing temperature Tm:
  // ==========================================
  const Tm = 1.8 + 0.263 * Tc + 0.105 * Ta;
  const deltaH1 = rhoU * (cpu * 1000) * (Ti - Tif); // J/m3
  const deltaH2 = rhoF * (deltaH * 1000) + rhoF * (cpf * 1000) * (Tif - Tc); // J/m3
  
  // Pham time:
  const phamTimeSeconds = 
    (Lc / (h * (Tm - Ta))) * 
    (deltaH1 * (1.0 + Bi_u / 2.0) + deltaH2 * (1.0 + Bi_f / 2.0));
  const phamFreezingTimeMinutes = Math.max(0.1, phamTimeSeconds / 60.0);

  // Adopt Cleland-Earle as main total freezing time (or weighted average with Pham)
  const totalFreezingTimeMinutes = clelandEarleFreezingTimeMinutes;
  const totalFreezingTimeHours = totalFreezingTimeMinutes / 60.0;

  // Breakdown into 3 physical stages:
  const stage1Fraction = (cpu * (Ti - Tif)) / deltaH_eff;
  const stage2Fraction = deltaH / deltaH_eff;
  const stage3Fraction = (0.5 * cpf * (Tif - Tc)) / deltaH_eff;

  const stage1PrecoolingMinutes = Math.round(totalFreezingTimeMinutes * stage1Fraction * 10) / 10;
  const stage2PhaseChangeMinutes = Math.round(totalFreezingTimeMinutes * stage2Fraction * 10) / 10;
  const stage3SubcoolingMinutes = Math.round(
    (totalFreezingTimeMinutes - stage1PrecoolingMinutes - stage2PhaseChangeMinutes) * 10
  ) / 10;

  // ==========================================
  // 5. Thawing Time Calculation (فرآیند ذوب)
  // Crucial physical difference: outer thawed layer has ku << kf (thermal conductivity inversion)
  // ==========================================
  // Driving temperature difference for thawing: (Ta_thaw - Tif)
  // Assume thawing in ambient air at +15°C or +4°C (refrigerator)
  const Ta_thaw = 15.0; // Standard ambient thawing temperature
  const deltaTThawing = Math.max(1.0, Ta_thaw - Tif);
  
  // For thawing, the conducting outer shell is unfrozen (liquid water), so we use ku instead of kf!
  const thawingTimeSeconds = 
    ((rhoU * (deltaH_eff * 1000)) / deltaTThawing) * 
    ((P_mod * a / h) + (R_mod * a * a / ku));
  const thawingTimeMinutes = Math.max(0.1, thawingTimeSeconds / 60.0);
  const thawingTimeHours = thawingTimeMinutes / 60.0;
  const thawingToFreezingRatio = Math.round((thawingTimeMinutes / totalFreezingTimeMinutes) * 100) / 100;

  const thawingExplanationFa = 
    `زمان ذوب (${thawingTimeMinutes.toFixed(1)} دقیقه) تقریباً ${thawingToFreezingRatio.toFixed(1)} برابر طولانی‌تر از زمان انجماد است. ` +
    `علت فیزیکی این پدیده، وارونگی هدایت حرارتی (Thermal Conductivity Inversion) است: ` +
    `در حین ذوب، لایه بیرونی که انتقال حرارت از آن عبور می‌کند، آب مایع است که هدایت حرارتی آن (ku = ${ku} W/m·K) حدود ۳ تا ۴ برابر کمتر از یخ منجمد (kf = ${kf} W/m·K) است ` +
    `و همانند یک عایق حرارتی در برابر ورود گرما به هسته یخی عمل می‌کند.`;

  // ==========================================
  // 6. Freezing Rate & Crystal Quality Category
  // Freezing rate v_f = (a / 2) / t_f (cm/h)
  // ==========================================
  const halfThicknessCm = (a / 2.0) * 100.0;
  const averageFreezingRateCmPerHour = totalFreezingTimeHours > 0 
    ? Math.round((halfThicknessCm / totalFreezingTimeHours) * 100) / 100 
    : 0;

  let freezingCategoryFa: FreezingThawingResults['freezingCategoryFa'] = 'انجماد سریع صنعتی';
  if (averageFreezingRateCmPerHour >= 5.0) {
    freezingCategoryFa = 'انجماد فوق‌سریع (کریستال‌های ریز درون‌سلولی)';
  } else if (averageFreezingRateCmPerHour < 1.0) {
    freezingCategoryFa = 'انجماد کند (آسیب به بافت سلولی)';
  }

  // Energy extracted:
  const totalHeatExtractedKjPerKg = Math.round(deltaH_eff * 10) / 10;
  const totalHeatExtractedKjPerBatch = Math.round(totalHeatExtractedKjPerKg * 100 * 10) / 10; // for 100 kg batch

  // Fourier number at end of freezing: alpha_f = kf / (rho_f * cpf)
  const alpha_f = kf / (rhoF * (cpf * 1000));
  const fourierNumber = (alpha_f * (totalFreezingTimeMinutes * 60)) / (Lc * Lc);

  // ==========================================
  // 7. Step-by-Step Mathematical Steps for Display
  // ==========================================
  const calculationSteps: FreezingCalculationStep[] = [
    {
      stepNumber: 1,
      titleFa: 'محاسبه ضریب انتقال حرارت جابجایی و تشعشع (h_eff)',
      titleEn: 'Effective Surface Heat Transfer Coefficient',
      formulaLatex: 'h_{eff} = h_{conv} + h_{rad} = h_{conv} + \\epsilon \\sigma (T_s + T_a)(T_s^2 + T_a^2)',
      substitutionFa: `h_{conv} = ${hConv} \\text{ W/(m}^2\\cdot\\text{K)}, \\quad h_{rad} = ${hRad} \\text{ W/(m}^2\\cdot\\text{K)}`,
      resultFa: `h_{eff} = ${hTotal.toFixed(1)} \\text{ W/(m}^2\\cdot\\text{K)}`,
      notesFa: 'در فریزرهای وزشی با افزایش سرعت هوا، ضریب انتقال حرارت جابجایی به صورت تابعی از Re^0.8 افزایش می‌یابد.'
    },
    {
      stepNumber: 2,
      titleFa: 'محاسبه اعداد بدون بعد بیوت (Bi)، پلانک (Pk) و استفان (Ste)',
      titleEn: 'Dimensionless Numbers Evaluation',
      formulaLatex: 'Bi_f = \\frac{h \\cdot L_c}{k_f}, \\quad Pk = \\frac{c_{pu}(T_i - T_{if})}{\\Delta H}, \\quad Ste = \\frac{c_{pf}(T_{if} - T_a)}{\\Delta H}',
      substitutionFa: `Bi_f = \\frac{${hTotal} \\times ${Lc.toFixed(4)}}{${kf}} = ${Bi_f.toFixed(2)}, \\quad Pk = \\frac{${cpu} \\times (${Ti} - (${Tif}))}{${deltaH}} = ${Pk.toFixed(3)}, \\quad Ste = \\frac{${cpf} \\times (${Tif} - (${Ta}))}{${deltaH}} = ${Ste.toFixed(3)}`,
      resultFa: `Bi_f = ${Bi_f.toFixed(2)}, \\quad Pk = ${Pk.toFixed(3)}, \\quad Ste = ${Ste.toFixed(3)}`,
      notesFa: Bi_f > 0.1 
        ? 'به دلیل Bi > 0.1، مقاومت هدایتی درون محصول قالب بوده و توزیع دما در عمق ماده غذایی غیریکنواخت است.' 
        : 'به دلیل Bi < 0.1، مقاومت خارجی انتقال حرارت قالب است (ظرفیت حرارتی فشرده).'
    },
    {
      stepNumber: 3,
      titleFa: 'محاسبه آنتالپی موثر کل انجماد (Sensible + Latent Heat)',
      titleEn: 'Total Effective Enthalpy of Freezing',
      formulaLatex: '\\Delta H_{eff} = \\Delta H + c_{pu}(T_i - T_{if}) + 0.5 \\, c_{pf}(T_{if} - T_c)',
      substitutionFa: `\\Delta H_{eff} = ${deltaH} + [${cpu} \\times (${Ti} - (${Tif}))] + [0.5 \\times ${cpf} \\times (${Tif} - (${Tc}))]`,
      resultFa: `\\Delta H_{eff} = ${deltaH_eff.toFixed(1)} \\text{ kJ/kg}`,
      notesFa: 'شامل گرمای محسوس پیش‌سرمایش، گرمای نهان تغییر فاز مایع به جامد و گرمای محسوس سرد کردن یخ تا دمای نهایی است.'
    },
    {
      stepNumber: 4,
      titleFa: 'محاسبه زمان انجماد کلاسیک پلانک (Plank)',
      titleEn: "Plank's Classical Freezing Time",
      formulaLatex: 't_{Plank} = \\frac{\\rho_f \\cdot \\Delta H}{T_{if} - T_a} \\left( \\frac{P \\cdot a}{h} + \\frac{R \\cdot a^2}{k_f} \\right)',
      substitutionFa: `t_{Plank} = \\frac{${rhoF} \\times (${deltaH} \\times 10^3)}{${Tif} - (${Ta})} \\left( \\frac{${P.toFixed(3)} \\times ${a}}{${hTotal}} + \\frac{${R.toFixed(4)} \\times (${a})^2}{${kf}} \\right)`,
      resultFa: `t_{Plank} = ${plankFreezingTimeMinutes.toFixed(1)} \\text{ min} \\; (${(plankFreezingTimeMinutes / 60).toFixed(2)} \\text{ hr})`,
      notesFa: 'مدل پلانک گرمای محسوس قبل و بعد از انجماد را نادیده می‌گیرد و معمولاً زمان انجماد را کمتر از واقعیت تخمین می‌زند.'
    },
    {
      stepNumber: 5,
      titleFa: 'محاسبه زمان انجماد اصلاح‌شده کللند و ارل (Cleland & Earle)',
      titleEn: 'Cleland & Earle Modified Freezing Time',
      formulaLatex: 't_{Cleland} = \\frac{\\rho_f \\cdot \\Delta H_{eff}}{T_{if} - T_a} \\left( \\frac{P_{mod} \\cdot a}{h} + \\frac{R_{mod} \\cdot a^2}{k_f} \\right)',
      substitutionFa: `P_{mod} = ${P_mod.toFixed(3)}, \\quad R_{mod} = ${R_mod.toFixed(4)}, \\quad \\Delta H_{eff} = ${deltaH_eff.toFixed(1)} \\text{ kJ/kg}`,
      resultFa: `t_{Cleland} = ${clelandEarleFreezingTimeMinutes.toFixed(1)} \\text{ min} \\; (${totalFreezingTimeHours.toFixed(2)} \\text{ hr})`,
      notesFa: 'دقیق‌ترین مدل مهندسی استاندارد با خطای کمتر از ۱۰٪ نسبت به داده‌های تجربی آزمایشگاهی.'
    },
    {
      stepNumber: 6,
      titleFa: 'مقایسه زمان فرآیند ذوب (Thawing Time Analysis)',
      titleEn: 'Food Thawing Time & Conductivity Inversion',
      formulaLatex: 't_{Thaw} = \\frac{\\rho_u \\cdot \\Delta H_{eff}}{T_{a,thaw} - T_{if}} \\left( \\frac{P_{mod} \\cdot a}{h} + \\frac{R_{mod} \\cdot a^2}{k_u} \\right)',
      substitutionFa: `k_u = ${ku} \\text{ W/(m}\\cdot\\text{K)} \\; (\\ll k_f = ${kf}), \\quad T_{a,thaw} = +${Ta_thaw}^\\circ\\text{C}`,
      resultFa: `t_{Thaw} = ${thawingTimeMinutes.toFixed(1)} \\text{ min} \\; (${thawingTimeHours.toFixed(2)} \\text{ hr}) \\implies \\frac{t_{thaw}}{t_{freeze}} = ${thawingToFreezingRatio.toFixed(2)}`,
      notesFa: 'هدایت حرارتی پایین آب مایع روی پوسته ماده غذایی همانند عایق عمل کرده و زمان ذوب را به طور چشمگیری افزایش می‌دهد.'
    }
  ];

  // ==========================================
  // 8. Temperature History Curve Generation (T(t))
  // ==========================================
  const temperatureCurve: TemperatureTimePoint[] = [];
  const totalMinutes = totalFreezingTimeMinutes;
  const numPoints = 25;

  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints;
    const timeMinutes = Math.round(fraction * totalMinutes * 10) / 10;
    let centerT: number;
    let surfaceT: number;
    let stage: TemperatureTimePoint['stageNameFa'];

    if (timeMinutes <= stage1PrecoolingMinutes) {
      // Stage 1: Precooling
      stage = 'پیش‌سرمایش';
      const stageFrac = stage1PrecoolingMinutes > 0 ? timeMinutes / stage1PrecoolingMinutes : 1;
      centerT = Ti - (Ti - Tif) * Math.pow(stageFrac, 1.2);
      surfaceT = Ti - (Ti - (Tif + Ta) / 2) * Math.pow(stageFrac, 0.7);
    } else if (timeMinutes <= stage1PrecoolingMinutes + stage2PhaseChangeMinutes) {
      // Stage 2: Freezing Plateau (latent heat removal)
      stage = 'تغییر فاز و انجماد';
      const phaseTime = timeMinutes - stage1PrecoolingMinutes;
      const phaseFrac = stage2PhaseChangeMinutes > 0 ? phaseTime / stage2PhaseChangeMinutes : 1;
      // Center stays near freezing point with slight cryoscopic depression as solutes concentrate
      centerT = Tif - 0.5 * phaseFrac;
      surfaceT = ((Tif + Ta) / 2) - (((Tif + Ta) / 2) - Ta) * Math.pow(phaseFrac, 0.85);
    } else {
      // Stage 3: Subcooling
      stage = 'فوق‌سرمایش عمیق';
      const subTime = timeMinutes - stage1PrecoolingMinutes - stage2PhaseChangeMinutes;
      const subFrac = stage3SubcoolingMinutes > 0 ? subTime / stage3SubcoolingMinutes : 1;
      centerT = (Tif - 0.5) - ((Tif - 0.5) - Tc) * Math.pow(subFrac, 0.9);
      surfaceT = Ta + (Tc - Ta) * (1 - subFrac);
    }

    temperatureCurve.push({
      timeMinutes,
      centerTemperatureC: Math.round(centerT * 10) / 10,
      surfaceTemperatureC: Math.round(surfaceT * 10) / 10,
      averageTemperatureC: Math.round(((centerT + surfaceT) / 2) * 10) / 10,
      stageNameFa: stage
    });
  }

  // ==========================================
  // 9. Sensitivity Analysis
  // ==========================================
  const sensitivityAnalysis: SensitivityPoint[] = [
    {
      factorNameFa: 'ضخامت یا بعد اصلی محصول (a)',
      factorNameEn: 'Product Thickness / Dimension (a)',
      baselineValue: a * 100, // in cm
      unit: 'cm',
      scenarios: [-30, -15, 0, 15, 30].map(pct => {
        const factor = 1.0 + pct / 100.0;
        const testA = a * factor;
        const testTime = 
          ((rhoF * (deltaH_eff * 1000)) / deltaTFreezing) * 
          ((P_mod * testA / h) + (R_mod * testA * testA / kf)) / 60.0;
        return {
          percentageChange: pct,
          parameterValue: Math.round(testA * 100 * 10) / 10,
          freezingTimeMinutes: Math.round(testTime * 10) / 10,
          differenceMinutes: Math.round((testTime - totalFreezingTimeMinutes) * 10) / 10
        };
      })
    },
    {
      factorNameFa: 'ضریب انتقال حرارت جابجایی (h)',
      factorNameEn: 'Convection Heat Transfer Coefficient (h)',
      baselineValue: h,
      unit: 'W/(m²·K)',
      scenarios: [-30, -15, 0, 15, 30].map(pct => {
        const factor = 1.0 + pct / 100.0;
        const testH = Math.max(1, h * factor);
        const testTime = 
          ((rhoF * (deltaH_eff * 1000)) / deltaTFreezing) * 
          ((P_mod * a / testH) + (R_mod * a * a / kf)) / 60.0;
        return {
          percentageChange: pct,
          parameterValue: Math.round(testH * 10) / 10,
          freezingTimeMinutes: Math.round(testTime * 10) / 10,
          differenceMinutes: Math.round((testTime - totalFreezingTimeMinutes) * 10) / 10
        };
      })
    },
    {
      factorNameFa: 'دمای محیط انجماد (Ta)',
      factorNameEn: 'Ambient Freezer Temperature (Ta)',
      baselineValue: Ta,
      unit: '°C',
      scenarios: [-6, -3, 0, 3, 6].map(diff => {
        const testTa = Ta + diff;
        const testDeltaT = Math.max(1, Tif - testTa);
        const testTime = 
          ((rhoF * (deltaH_eff * 1000)) / testDeltaT) * 
          ((P_mod * a / h) + (R_mod * a * a / kf)) / 60.0;
        return {
          percentageChange: Math.round((diff / Math.abs(Ta)) * 100),
          parameterValue: testTa,
          freezingTimeMinutes: Math.round(testTime * 10) / 10,
          differenceMinutes: Math.round((testTime - totalFreezingTimeMinutes) * 10) / 10
        };
      })
    }
  ];

  return {
    plankFreezingTimeMinutes: Math.round(plankFreezingTimeMinutes * 10) / 10,
    clelandEarleFreezingTimeMinutes: Math.round(clelandEarleFreezingTimeMinutes * 10) / 10,
    phamFreezingTimeMinutes: Math.round(phamFreezingTimeMinutes * 10) / 10,
    stage1PrecoolingMinutes,
    stage2PhaseChangeMinutes,
    stage3SubcoolingMinutes,
    totalFreezingTimeMinutes: Math.round(totalFreezingTimeMinutes * 10) / 10,
    totalFreezingTimeHours: Math.round(totalFreezingTimeHours * 100) / 100,
    thawingTimeMinutes: Math.round(thawingTimeMinutes * 10) / 10,
    thawingTimeHours: Math.round(thawingTimeHours * 100) / 100,
    thawingToFreezingRatio,
    thawingExplanationFa,
    totalHeatExtractedKjPerKg,
    totalHeatExtractedKjPerBatch,
    averageFreezingRateCmPerHour,
    freezingCategoryFa,
    calculatedHConvection: hConv,
    calculatedHRadiation: hRad,
    effectiveTotalH: hTotal,
    dimensionlessNumbers: {
      biotNumberFrozen: Math.round(Bi_f * 100) / 100,
      biotNumberUnfrozen: Math.round(Bi_u * 100) / 100,
      fourierNumber: Math.round(fourierNumber * 100) / 100,
      prandtlNumberAir: AIR_PROPERTIES.prandtlNumber,
      plankNumber: Math.round(Pk * 1000) / 1000,
      stefanNumber: Math.round(Ste * 1000) / 1000,
      characteristicDimensionM: Math.round(Lc * 10000) / 10000
    },
    calculationSteps,
    temperatureCurve,
    sensitivityAnalysis,
    assumptionsFa: [
      'ماده غذایی همگن و ایزوتروپیک با خواص حرارتی یکنواخت در هر فاز فرض شده است.',
      'جبهه انجماد (Freezing Front) با پیشروی شارپ از سطح به سمت مرکز هندسی حرکت می‌کند.',
      'انقباض و تغییرات حجمی در حین انتقال حرارت ناچیز فرض شده است.',
      'دمای محیط انجماد (Ta) و ضریب انتقال حرارت جابجایی (h) در طول کل زمان فرآیند ثابت در نظر گرفته شده‌اند.'
    ],
    limitationsFa: [
      'در مدل کلاسیک پلانک، گرمای محسوس فازهای پیش‌سرمایش و فوق‌سرمایش حذف شده است که باعث کم‌تخمینی زمان انجماد تا ۲۰٪ می‌شود.',
      'مدل‌های تحلیلی پدیده‌های انتقال جرم (مانند تبخیر سطحی آب و افت وزن ناشی از تصعید) را منظور نمی‌کنند.',
      'برای هندسه‌های غیرمتعارف سه‌بعدی پیچیده، استفاده از روش‌های عددی المان محدود (FEM) در پایتون توصیه می‌گردد.'
    ]
  };
}
