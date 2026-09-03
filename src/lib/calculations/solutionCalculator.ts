/**
 * Laboratory Solution Preparation Calculation Engine
 * Food Science AI Lab Suite - Part 13
 */

import {
  ChemicalReagent,
  ConcentrationUnit,
  SolutionCalculationRequest,
  SolutionCalculationResult,
  CalculationStep
} from '../../types/chemicalReagent';

/**
 * Calculates the exact amount of solute required to prepare a target solution.
 * Handles solid reagents, liquid stock solutions, purity corrections, density factors, and normality valences.
 */
export function calculateSolutionPreparation(
  request: SolutionCalculationRequest
): SolutionCalculationResult {
  const {
    reagent,
    targetConcentration,
    concentrationUnit,
    finalVolume,
    volumeUnit,
    solvent = 'آب مقطر دیونیزه (Deionized Water)'
  } = request;

  const purity = request.customPurity !== undefined ? request.customPurity : (reagent.purityPercentage || 100);
  const density = request.customDensity !== undefined ? request.customDensity : (reagent.density || 1.0);
  const valence = request.customValence !== undefined ? request.customValence : (reagent.valenceOrEquivalents || 1);
  const mw = reagent.molecularWeight || 1.0;

  // Convert volume to Liters and Milliliters
  const volumeInLiters = volumeUnit === 'L' ? finalVolume : finalVolume / 1000;
  const volumeInMl = volumeUnit === 'mL' ? finalVolume : finalVolume * 1000;

  let requiredAmount = 0;
  let requiredAmountUnit: 'g' | 'mg' | 'mL' = 'g';
  let molarityEquivalent = 0;
  let normalityEquivalent: number | undefined = undefined;
  let formulaLatex = '';
  let formulaDescription = '';
  const steps: CalculationStep[] = [];
  const safetyAlerts: string[] = [];

  const isLiquid = reagent.physicalState === 'liquid' || (reagent.density && reagent.density > 0 && reagent.physicalState !== 'solid' && reagent.physicalState !== 'powder' && reagent.physicalState !== 'crystals');

  // Add specific safety alerts based on reagent properties
  if (reagent.hazards.ghsPictograms.includes('GHS05')) {
    safetyAlerts.push('ماده به شدت خورنده و تاول‌زاست. استفاده از عینک ایمنی گاگل، دستکش نیتریل/نئوپرن و کار در زیر هود آزمایشگاهی با تهویه فعال الزامی است.');
  }

  if (reagent.chemicalFormula.includes('H2SO4') || reagent.chemicalFormula.includes('HCl') || reagent.chemicalFormula.includes('HNO3')) {
    safetyAlerts.push('قانون حیاتی ایمنی: «اسید به آب اضافه شود نه برعکس! (Acid to Water)». به دلیل گرمادهی بسیار شدید و خطر پاشش قطرات اسید داغ، ابتدا ۲/۳ حجم آب را در ظرف بریزید و اسید را به آرامی به آب بیفزایید.');
  }

  if (reagent.chemicalFormula.includes('NaOH') || reagent.chemicalFormula.includes('KOH')) {
    safetyAlerts.push('انحلال پرک‌های هیدروکسید سدیم/پتاسیم به شدت گرمازا (Exothermic) است. بشر را در حمام آب سرد قرار دهید تا محلول خنک شود.');
  }

  if (reagent.hazards.ghsPictograms.includes('GHS02')) {
    safetyAlerts.push('مایع و بخارات به شدت قابل اشتعال. از هرگونه شعله مستقیم چراغ بونزن، المنت برقی جرقه زن و حرارت بالا دور نگه داشته شود.');
  }

  // Branch calculation based on target concentration unit
  switch (concentrationUnit) {
    case 'M': // Molarity (mol/L)
    case 'mM': {
      const actualMolarity = concentrationUnit === 'mM' ? targetConcentration / 1000 : targetConcentration;
      molarityEquivalent = actualMolarity;
      normalityEquivalent = actualMolarity * valence;

      if (!isLiquid) {
        // Solid Reagent Calculation
        // Mass = M * V(L) * MW * (100 / Purity%)
        const pureMass = actualMolarity * volumeInLiters * mw;
        const rawMass = pureMass * (100 / purity);

        requiredAmount = rawMass;
        requiredAmountUnit = rawMass < 0.1 ? 'mg' : 'g';
        if (requiredAmountUnit === 'mg') {
          requiredAmount = rawMass * 1000;
        }

        formulaLatex = `m = M \\times V_{(L)} \\times MW \\times \\left(\\frac{100}{\\%\\text{Purity}}\\right)`;
        formulaDescription = `جرم مورد نیاز = غلظت مولار (${actualMolarity} M) × حجم بر حسب لیتر (${volumeInLiters} L) × وزن مولکولی (${mw} g/mol) × ضریب تصحیح خلوص (100 / ${purity}%)`;

        steps.push({
          stepNumber: 1,
          title: 'محاسبه مقدار ماده خالص نظری (Theoretical Pure Solute)',
          explanation: `حاصلضرب غلظت مولار هدف در حجم نهایی و وزن مولکولی ماده:\n${actualMolarity} mol/L × ${volumeInLiters} L × ${mw} g/mol = ${pureMass.toFixed(4)} گرم خالص.`,
          formulaSnippet: `m_{pure} = ${actualMolarity} \\times ${volumeInLiters} \\times ${mw} = ${pureMass.toFixed(4)} \\text{ g}`
        });

        steps.push({
          stepNumber: 2,
          title: 'تصحیح بر اساس درصد خلوص واقعی (Purity Assay Correction)',
          explanation: `با توجه به خلوص ${purity}٪ برچسب ماده اولیه، جرم ناخالص محاسبه می‌شود:\n${pureMass.toFixed(4)} g × (100 / ${purity}) = ${rawMass.toFixed(4)} گرم.`,
          formulaSnippet: `m_{actual} = ${pureMass.toFixed(4)} \\times \\frac{100}{${purity}} = ${rawMass.toFixed(4)} \\text{ g}`
        });

        steps.push({
          stepNumber: 3,
          title: 'توزین و انحلال در آزمایشگاه (Dissolution SOP)',
          explanation: `مقدار دقیقا ${rawMass.toFixed(4)} گرم از ماده را روی ترازوی آنالیتیکال وزن کنید. در یک بشر حاوی حدود نیمی از ${solvent} حل نموده و پس از رسیدن به دمای ۲۰ درجه سانتی‌گراد، با قیف به بالن ژوژه ${volumeInMl} میلی‌لیتری منتقل کرده و تا خط نشانه (Meniscus) با ${solvent} به حجم برسانید.`
        });
      } else {
        // Liquid Reagent Calculation
        // Stock Molarity M0 = (Density * 1000 * Purity%) / (100 * MW) = (10 * Density * Purity%) / MW
        const stockMolarity = (10 * density * purity) / mw;
        // Required Volume V1 = (M2 * V2) / M1
        const requiredVolMl = (actualMolarity * volumeInMl) / stockMolarity;

        requiredAmount = requiredVolMl;
        requiredAmountUnit = 'mL';

        formulaLatex = `V_1 = \\frac{M_2 \\times V_2}{M_1} = \\frac{M \\times V_{(mL)} \\times MW \\times 100}{\\rho \\times \\text{Purity}\\% \\times 1000}`;
        formulaDescription = `حجم مایع غلیظ مورد نیاز = (غلظت هدف × حجم نهایی × وزن مولکولی × ۱۰۰) / (چگالی × درصد خلوص × ۱۰۰۰)`;

        steps.push({
          stepNumber: 1,
          title: 'محاسبه غلظت مولار استوک اولیه مایع (Stock Reagent Molarity)',
          explanation: `مولاریته استوک مایع بر اساس چگالی ${density} g/mL، خلوص ${purity}٪ و وزن مولکولی ${mw} g/mol برابر است با:\n(10 × ${density} × ${purity}) / ${mw} = ${stockMolarity.toFixed(4)} مول بر لیتر (M).`,
          formulaSnippet: `M_0 = \\frac{10 \\times ${density} \\times ${purity}}{${mw}} = ${stockMolarity.toFixed(4)} \\text{ M}`
        });

        steps.push({
          stepNumber: 2,
          title: 'محاسبه حجم برداشتی از استوک (Aliquot Volume)',
          explanation: `استفاده از قانون رقت‌سازی C1V1 = C2V2:\n(${actualMolarity} M × ${volumeInMl} mL) / ${stockMolarity.toFixed(4)} M = ${requiredVolMl.toFixed(3)} میلی‌لیتر.`,
          formulaSnippet: `V_{stock} = \\frac{${actualMolarity} \\times ${volumeInMl}}{${stockMolarity.toFixed(4)}} = ${requiredVolMl.toFixed(3)} \\text{ mL}`
        });

        steps.push({
          stepNumber: 3,
          title: 'دستورالعمل رقت‌سازی و به حجم رساندن (Dilution Protocol)',
          explanation: `در بالن ژوژه ${volumeInMl} میلی‌لیتری ابتدا حدود دو سوم حجم ${solvent} بریزید. سپس با پیپت حباب‌دار یا دیسپنسر کالیبره شده دقیقا ${requiredVolMl.toFixed(3)} میلی‌لیتر از اسید/مایع استوک را به آرامی زیر هود بیفزایید. مخلوط کرده و پس از هم‌دما شدن با محیط، تا خط نشانه با ${solvent} به حجم برسانید.`
        });
      }
      break;
    }

    case 'N': { // Normality (eq/L)
      normalityEquivalent = targetConcentration;
      molarityEquivalent = targetConcentration / valence;
      const eqWeight = mw / valence;

      if (!isLiquid) {
        // Mass = N * V(L) * Eq.Weight * (100 / Purity%)
        const pureMass = targetConcentration * volumeInLiters * eqWeight;
        const rawMass = pureMass * (100 / purity);

        requiredAmount = rawMass;
        requiredAmountUnit = rawMass < 0.1 ? 'mg' : 'g';
        if (requiredAmountUnit === 'mg') {
          requiredAmount = rawMass * 1000;
        }

        formulaLatex = `m = N \\times V_{(L)} \\times \\left(\\frac{MW}{n}\\right) \\times \\left(\\frac{100}{\\%\\text{Purity}}\\right)`;
        formulaDescription = `جرم مورد نیاز = نرمالیته هدف (${targetConcentration} N) × حجم (${volumeInLiters} L) × وزن اکی‌والان (${eqWeight.toFixed(3)} g/eq) × ضریب خلوص (100 / ${purity}%)`;

        steps.push({
          stepNumber: 1,
          title: 'محاسبه وزن هم‌ارز / اکی‌والان (Equivalent Weight)',
          explanation: `وزن اکی‌والان = وزن مولکولی تقسیم بر ظرفیت واکنشی (n = ${valence}):\n${mw} g/mol / ${valence} = ${eqWeight.toFixed(4)} گرم بر اکی‌والان.`,
          formulaSnippet: `Eq.Wt = \\frac{${mw}}{${valence}} = ${eqWeight.toFixed(4)} \\text{ g/eq}`
        });

        steps.push({
          stepNumber: 2,
          title: 'محاسبه جرم با لحاظ درصد خلوص',
          explanation: `جرم = ${targetConcentration} N × ${volumeInLiters} L × ${eqWeight.toFixed(4)} g/eq × (100 / ${purity}) = ${rawMass.toFixed(4)} گرم.`,
          formulaSnippet: `m_{actual} = ${targetConcentration} \\times ${volumeInLiters} \\times ${eqWeight.toFixed(4)} \\times \\frac{100}{${purity}} = ${rawMass.toFixed(4)} \\text{ g}`
        });

        steps.push({
          stepNumber: 3,
          title: 'نحوه آماده‌سازی و استانداردسازی (Standardization SOP)',
          explanation: `مقدار ${rawMass.toFixed(4)} گرم را توزین کرده، در ${solvent} حل نموده و در بالن ${volumeInMl} میلی‌لیتری به حجم برسانید. برای تعیین فاکتور تیتر دقیق (F) باید با یک ماده استاندارد اولیه تیتر گردد.`
        });
      } else {
        const stockNormality = (10 * density * purity * valence) / mw;
        const requiredVolMl = (targetConcentration * volumeInMl) / stockNormality;

        requiredAmount = requiredVolMl;
        requiredAmountUnit = 'mL';

        formulaLatex = `V_1 = \\frac{N_2 \\times V_2}{N_1} = \\frac{N \\times V_{(mL)} \\times MW \\times 100}{\\rho \\times \\text{Purity}\\% \\times n \\times 1000}`;
        formulaDescription = `حجم مایع غلیظ = (نرمالیته هدف × حجم نهایی × وزن مولکولی × ۱۰۰) / (چگالی × خلوص × ظرفیت × ۱۰۰۰)`;

        steps.push({
          stepNumber: 1,
          title: 'محاسبه نرمالیته استوک مایع (Stock Normality N0)',
          explanation: `نرمالیته مایع استوک بر مبنای چگالی ${density} g/mL، خلوص ${purity}٪، ظرفیت ${valence} و وزن مولکولی ${mw}:\n(10 × ${density} × ${purity} × ${valence}) / ${mw} = ${stockNormality.toFixed(4)} نرمال (N).`,
          formulaSnippet: `N_0 = \\frac{10 \\times ${density} \\times ${purity} \\times ${valence}}{${mw}} = ${stockNormality.toFixed(4)} \\text{ N}`
        });

        steps.push({
          stepNumber: 2,
          title: 'محاسبه حجم برداشتی از مایع استوک',
          explanation: `(${targetConcentration} N × ${volumeInMl} mL) / ${stockNormality.toFixed(4)} N = ${requiredVolMl.toFixed(3)} میلی‌لیتر.`,
          formulaSnippet: `V_{stock} = \\frac{${targetConcentration} \\times ${volumeInMl}}{${stockNormality.toFixed(4)}} = ${requiredVolMl.toFixed(3)} \\text{ mL}`
        });

        steps.push({
          stepNumber: 3,
          title: 'دستورالعمل رقت‌سازی و انتقال به بالن',
          explanation: `دقیقا ${requiredVolMl.toFixed(3)} میلی‌لیتر از مایع را با پیپت کالیبره به بالن ژوژه حاوی ${solvent} اضافه کنید و به حجم برسانید.`
        });
      }
      break;
    }

    case 'w/v%': { // Weight/Volume % (g per 100 mL)
      // Mass = (%w/v * V(mL) / 100) * (100 / Purity%) = (%w/v * V(mL)) / Purity%
      const pureMass = (targetConcentration * volumeInMl) / 100;
      const rawMass = (pureMass * 100) / purity;

      requiredAmount = rawMass;
      requiredAmountUnit = rawMass < 0.1 ? 'mg' : 'g';
      if (requiredAmountUnit === 'mg') {
        requiredAmount = rawMass * 1000;
      }

      molarityEquivalent = (rawMass * (purity / 100)) / (mw * volumeInLiters);
      normalityEquivalent = molarityEquivalent * valence;

      formulaLatex = `m = \\frac{\\%\\text{w/v} \\times V_{(mL)}}{100} \\times \\left(\\frac{100}{\\%\\text{Purity}}\\right) = \\frac{\\%\\text{w/v} \\times V_{(mL)}}{\\%\\text{Purity}}`;
      formulaDescription = `جرم مورد نیاز = (${targetConcentration}% × ${volumeInMl} mL) / ${purity}% خلوص`;

      steps.push({
        stepNumber: 1,
        title: 'محاسبه جرم ماده حل‌شونده (Solute Mass)',
        explanation: `برای تهیه ${volumeInMl} میلی‌لیتر محلول ${targetConcentration}٪ وزنی/حجمی، نیاز به ${pureMass.toFixed(4)} گرم ماده خالص است.`,
        formulaSnippet: `m_{pure} = \\frac{${targetConcentration} \\times ${volumeInMl}}{100} = ${pureMass.toFixed(4)} \\text{ g}`
      });

      steps.push({
        stepNumber: 2,
        title: 'اعمال ضریب خلوص',
        explanation: `جرم واقعی = ${pureMass.toFixed(4)} g × (100 / ${purity}) = ${rawMass.toFixed(4)} گرم.`,
        formulaSnippet: `m_{actual} = \\frac{${pureMass.toFixed(4)} \\times 100}{${purity}} = ${rawMass.toFixed(4)} \\text{ g}`
      });

      steps.push({
        stepNumber: 3,
        title: 'مراحل آماده‌سازی محلول در آزمایشگاه',
        explanation: `مقدار ${rawMass.toFixed(4)} گرم را وزن نموده، در مقداری از ${solvent} حل نموده و در بالن ژوژه ${volumeInMl} میلی‌لیتری تا خط نشانه به حجم برسانید.`
      });
      break;
    }

    case 'v/v%': { // Volume/Volume % (mL per 100 mL)
      // Volume = (%v/v * V(mL) / 100) * (100 / Purity%)
      const pureVol = (targetConcentration * volumeInMl) / 100;
      const rawVol = (pureVol * 100) / purity;

      requiredAmount = rawVol;
      requiredAmountUnit = 'mL';

      formulaLatex = `V_{solute} = \\frac{\\%\\text{v/v} \\times V_{(mL)}}{100} \\times \\left(\\frac{100}{\\%\\text{Purity}}\\right)`;
      formulaDescription = `حجم مایع مورد نیاز = (${targetConcentration}% v/v × ${volumeInMl} mL) / ${purity}%`;

      steps.push({
        stepNumber: 1,
        title: 'محاسبه حجم مایع حل‌شونده',
        explanation: `حجم مایع خالص = (${targetConcentration} × ${volumeInMl}) / 100 = ${pureVol.toFixed(3)} میلی‌لیتر.\nبا لحاظ خلوص ${purity}٪ = ${rawVol.toFixed(3)} میلی‌لیتر.`,
        formulaSnippet: `V_{actual} = \\frac{${pureVol.toFixed(3)} \\times 100}{${purity}} = ${rawVol.toFixed(3)} \\text{ mL}`
      });

      steps.push({
        stepNumber: 2,
        title: 'افزودن و به حجم رساندن',
        explanation: `دقیقا ${rawVol.toFixed(3)} میلی‌لیتر از مایع را با پیپت یا استوانه مدرج برداشته و در بالن به حجم ${volumeInMl} میلی‌لیتر با ${solvent} برسانید.`
      });
      break;
    }

    case 'ppm':
    case 'mg/L': { // Parts per million (mg / L)
      const targetPpm = targetConcentration;
      const pureMg = targetPpm * volumeInLiters;
      const rawMg = (pureMg * 100) / purity;

      requiredAmount = rawMg;
      requiredAmountUnit = rawMg >= 1000 ? 'g' : 'mg';
      if (requiredAmountUnit === 'g') {
        requiredAmount = rawMg / 1000;
      }

      molarityEquivalent = (rawMg / 1000) / (mw * volumeInLiters);
      normalityEquivalent = molarityEquivalent * valence;

      formulaLatex = `m_{(mg)} = \\text{PPM} \\times V_{(L)} \\times \\left(\\frac{100}{\\%\\text{Purity}}\\right)`;
      formulaDescription = `مقدار میلی‌گرم ماده = ${targetPpm} ppm × ${volumeInLiters} L × (100 / ${purity}%)`;

      steps.push({
        stepNumber: 1,
        title: 'محاسبه مقدار ماده بر حسب میلی‌گرم (ppm Target)',
        explanation: `برای غلظت ${targetPpm} ppm در حجم ${volumeInLiters} لیتر، نیاز به ${pureMg.toFixed(2)} میلی‌گرم ماده خالص است. با خلوص ${purity}٪ مقدار به ${rawMg.toFixed(2)} میلی‌گرم (${(rawMg / 1000).toFixed(4)} گرم) می‌رسد.`,
        formulaSnippet: `m = ${targetPpm} \\times ${volumeInLiters} \\times \\frac{100}{${purity}} = ${rawMg.toFixed(2)} \\text{ mg}`
      });

      if (rawMg < 10) {
        steps.push({
          stepNumber: 2,
          title: 'توصیه تکنیکی: تهیه محلول استوک اولیه (Stock Solution Protocol)',
          explanation: `به دلیل کوچکی مقدار (${rawMg.toFixed(2)} mg)، توزین مستقیم آن خطای بالایی دارد. توصیه می‌شود ابتدا یک محلول استوک ۱۰۰۰ ppm (تهیه ۰.۱ گرم در ۱۰۰ میلی‌لیتر) تهیه کرده و سپس با رقت‌سازی، به غلظت ${targetPpm} ppm برسید.`
        });
      } else {
        steps.push({
          stepNumber: 2,
          title: 'توزین روی ترازوی دقیق',
          explanation: `مقدار ${(rawMg / 1000).toFixed(4)} گرم را وزن کرده و در بالن ${volumeInMl} میلی‌لیتری با ${solvent} حل نمایید.`
        });
      }
      break;
    }

    case 'g/L': {
      const pureGrams = targetConcentration * volumeInLiters;
      const rawGrams = (pureGrams * 100) / purity;

      requiredAmount = rawGrams;
      requiredAmountUnit = 'g';
      molarityEquivalent = (pureGrams) / (mw * volumeInLiters);
      normalityEquivalent = molarityEquivalent * valence;

      formulaLatex = `m_{(g)} = C_{(g/L)} \\times V_{(L)} \\times \\left(\\frac{100}{\\%\\text{Purity}}\\right)`;
      formulaDescription = `جرم = ${targetConcentration} g/L × ${volumeInLiters} L × (100 / ${purity}%)`;

      steps.push({
        stepNumber: 1,
        title: 'محاسبه جرم بر حسب گرم بر لیتر',
        explanation: `جرم خالص = ${targetConcentration} g/L × ${volumeInLiters} L = ${pureGrams.toFixed(4)} گرم.\nبا خلوص ${purity}٪ = ${rawGrams.toFixed(4)} گرم.`,
        formulaSnippet: `m = ${targetConcentration} \\times ${volumeInLiters} \\times \\frac{100}{${purity}} = ${rawGrams.toFixed(4)} \\text{ g}`
      });

      steps.push({
        stepNumber: 2,
        title: 'انحلال و به حجم رساندن',
        explanation: `مقدار ${rawGrams.toFixed(4)} گرم را در بالن ژوژه ${volumeInMl} میلی‌لیتری تا خط نشانه به حجم برسانید.`
      });
      break;
    }

    case 'w/w%': {
      // Weight/Weight percent: grams solute per 100g total solution
      const estimatedDensity = density || 1.0;
      const totalSolutionMass = volumeInMl * estimatedDensity;
      const pureMass = (targetConcentration * totalSolutionMass) / 100;
      const rawMass = (pureMass * 100) / purity;

      requiredAmount = rawMass;
      requiredAmountUnit = 'g';

      formulaLatex = `m = \\frac{\\%\\text{w/w} \\times (V \\times \\rho)}{100} \\times \\frac{100}{\\%\\text{Purity}}`;
      formulaDescription = `جرم ماده = (${targetConcentration}% × (${volumeInMl} mL × ${estimatedDensity} g/mL)) / ${purity}%`;

      steps.push({
        stepNumber: 1,
        title: 'محاسبه جرم کل محلول بر اساس چگالی',
        explanation: `جرم کل محلول = ${volumeInMl} mL × ${estimatedDensity} g/mL = ${totalSolutionMass.toFixed(2)} گرم.`
      });

      steps.push({
        stepNumber: 2,
        title: 'محاسبه مقدار ماده حل شونده',
        explanation: `جرم واقعی = (${targetConcentration} × ${totalSolutionMass.toFixed(2)}) / ${purity} = ${rawMass.toFixed(4)} گرم.`
      });
      break;
    }
  }

  // Generate Standardization details if applicable (e.g. for NaOH, HCl, H2SO4, AgNO3, KMnO4, Na2S2O3)
  let standardizationGuide = undefined;
  if (reagent.chemicalFormula.includes('NaOH')) {
    standardizationGuide = {
      standardPrimarySubstance: 'پتاسیم هیدروژن فتالات (KHP - C8H5KO4, MW=204.22) خشک شده در ۱۰۵ درجه سانتی‌گراد به مدت ۲ ساعت',
      indicator: 'شناساگر فنل‌فتالئین ۱٪ (۲ تا ۳ قطره)',
      equivalentReaction: 'KHC8H4O4 + NaOH → KNaC8H4O4 + H2O',
      calculationEquation: 'N = \\frac{m_{KHP} \\text{ (g)}}{V_{NaOH} \\text{ (mL)} \\times 0.20422}',
      endpointColorChange: 'ظهور رنگ صورتی بسیار کم‌رنگ پایدار به مدت حداقل ۳۰ ثانیه'
    };
  } else if (reagent.chemicalFormula.includes('HCl')) {
    standardizationGuide = {
      standardPrimarySubstance: 'سدیم کربنات بدون آب (Na2CO3, MW=105.99, Eq.Wt=52.99) خشک شده در ۲۷۰ درجه به مدت ۱ ساعت',
      indicator: 'شناساگر متیل اورانژ یا شناساگر مخلوط متیل رد/برموکروزول سبز',
      equivalentReaction: 'Na2CO3 + 2HCl → 2NaCl + H2O + CO2',
      calculationEquation: 'N = \\frac{m_{Na2CO3} \\text{ (g)}}{V_{HCl} \\text{ (mL)} \\times 0.05299}',
      endpointColorChange: 'تغییر رنگ از زرد به صورتی/پیازی (جوشاندن کوتاه برای خروج CO2 توصیه می‌شود)'
    };
  } else if (reagent.chemicalFormula.includes('AgNO3')) {
    standardizationGuide = {
      standardPrimarySubstance: 'سدیم کلرید خالص خشک شده در ۱۱۰ درجه (NaCl, MW=58.44)',
      indicator: 'پتاسیم کرومات ۵٪ (K2CrO4)',
      equivalentReaction: 'NaCl + AgNO3 → AgCl(s) + NaNO3',
      calculationEquation: 'N = \\frac{m_{NaCl} \\text{ (g)}}{V_{AgNO3} \\text{ (mL)} \\times 0.05844}',
      endpointColorChange: 'پدیدار شدن رسوب قرمز آجری پایدار کرومات نقره (Ag2CrO4)'
    };
  } else if (reagent.chemicalFormula.includes('Na2S2O3')) {
    standardizationGuide = {
      standardPrimarySubstance: 'پتاسیم دی‌کرومات خشک شده (K2Cr2O7, MW=294.18, Eq.Wt=49.03) یا پتاسیم یدات (KIO3)',
      indicator: 'شناساگر چسب نشاسته ۱٪ (افزوده شده در نزدیکی نقطه پایانی زمانی که رنگ محلول زرد کاهی شد)',
      equivalentReaction: 'Cr2O7(2-) + 6I(-) + 14H(+) → 2Cr(3+) + 3I2 + 7H2O سپس I2 + 2S2O3(2-) → 2I(-) + S4O6(2-)',
      calculationEquation: 'N = \\frac{m_{K2Cr2O7} \\text{ (g)}}{V_{thio} \\text{ (mL)} \\times 0.04903}',
      endpointColorChange: 'از بین رفتن کامل رنگ آبی تیره کمپلکس نشاسته-ید و ظهور رنگ سبز روشن یون کروم'
    };
  } else if (reagent.chemicalFormula.includes('KMnO4')) {
    standardizationGuide = {
      standardPrimarySubstance: 'سدیم اگزالات خشک شده (Na2C2O4, MW=134.00, Eq.Wt=67.00)',
      indicator: 'خود شناساگر (Auto-indicator) - محلول خود پرمنگنات صورتی/بنفش است',
      equivalentReaction: '2MnO4(-) + 5C2O4(2-) + 16H(+) → 2Mn(2+) + 10CO2 + 8H2O (در دمای ۶۰ تا ۷۰ درجه سانتی‌گراد)',
      calculationEquation: 'N = \\frac{m_{Na2C2O4} \\text{ (g)}}{V_{KMnO4} \\text{ (mL)} \\times 0.06700}',
      endpointColorChange: 'ظهور رنگ صورتی بسیار کم‌رنگ ماندگار'
    };
  }

  return {
    requiredAmount,
    requiredAmountUnit,
    formattedAmount: `${requiredAmount.toFixed(4)} ${requiredAmountUnit}`,
    molarityEquivalent,
    normalityEquivalent,
    formulaLatex,
    formulaDescription,
    formulaUsed: formulaLatex,
    formulaExplanation: formulaDescription,
    isLiquidDilution: isLiquid,
    purityUsed: purity,
    densityUsed: density,
    steps,
    safetyAlerts,
    standardizationGuide: standardizationGuide ? {
      ...standardizationGuide,
      titrantOrPrimaryStandard: standardizationGuide.standardPrimarySubstance,
      methodDescription: standardizationGuide.endpointColorChange,
      formula: standardizationGuide.calculationEquation
    } : undefined
  };
}

export interface SolutionPreset {
  id: string;
  name: string;
  chemicalFormula: string;
  reagentFormula: string;
  reagentId?: string;
  targetConcentration: number;
  concentrationUnit: ConcentrationUnit;
  finalVolume: number;
  volumeUnit: 'mL' | 'L';
  suggestedSolvent?: string;
  applicationFa: string;
  description: string;
}

export const COMMON_SOLUTION_PRESETS: SolutionPreset[] = [
  {
    id: 'naoh-01n',
    name: 'سود ۰.۱ نرمال (سنجش اسیدیته کل)',
    chemicalFormula: 'NaOH',
    reagentFormula: 'NaOH',
    reagentId: 'reagent-naoh-01',
    targetConcentration: 0.1,
    concentrationUnit: 'N',
    finalVolume: 1000,
    volumeUnit: 'mL',
    suggestedSolvent: 'آب مقطر دیونیزه جوشیده و سرد شده (عاری از CO2)',
    applicationFa: 'سنجش اسیدیته کل',
    description: 'تیترانت استاندارد قلیایی برای سنجش اسیدیته کل بر حسب اسید لاکتیک یا اولئیک'
  },
  {
    id: 'hcl-01n',
    name: 'اسید کلریدریک ۰.۱ نرمال (سنجش پروتئین کلدال)',
    chemicalFormula: 'HCl',
    reagentFormula: 'HCl',
    reagentId: 'reagent-hcl-02',
    targetConcentration: 0.1,
    concentrationUnit: 'N',
    finalVolume: 1000,
    volumeUnit: 'mL',
    suggestedSolvent: 'آب مقطر دیونیزه',
    applicationFa: 'پروتئین کلدال',
    description: 'تیترانت اسیدی استاندارد برای سنجش ازت و پروتئین کلدال'
  },
  {
    id: 'agno3-01n',
    name: 'نیترات نقره ۰.۱ نرمال (سنجش نمک مور)',
    chemicalFormula: 'AgNO3',
    reagentFormula: 'AgNO3',
    reagentId: 'reagent-agno3-06',
    targetConcentration: 0.1,
    concentrationUnit: 'N',
    finalVolume: 1000,
    volumeUnit: 'mL',
    suggestedSolvent: 'آب مقطر دیونیزه با هدایت الکتریکی بسیار پایین',
    applicationFa: 'سنجش نمک طعام',
    description: 'تیترانت رسوبی سنجش کلرید و نمک NaCl در پنیر، چیپس و رب'
  },
  {
    id: 'na2s2o3-01n',
    name: 'سدیم تیوسولفات ۰.۱ نرمال (عدد پراکسید و ید)',
    chemicalFormula: 'Na2S2O3.5H2O',
    reagentFormula: 'Na2S2O3.5H2O',
    reagentId: 'reagent-na2s2o3-08',
    targetConcentration: 0.1,
    concentrationUnit: 'N',
    finalVolume: 1000,
    volumeUnit: 'mL',
    suggestedSolvent: 'آب مقطر تازه جوشیده + ۰.۱ گرم کربنات سدیم جهت تثبیت',
    applicationFa: 'عدد پراکسید روغن',
    description: 'تیترانت یدومتری برای اندازه گیری عدد پراکسید روغن‌های خوراکی'
  },
  {
    id: 'kmno4-01n',
    name: 'پتاسیم پرمنگنات ۰.۱ نرمال (اکسیدومتری)',
    chemicalFormula: 'KMnO4',
    reagentFormula: 'KMnO4',
    reagentId: 'reagent-kmno4-09',
    targetConcentration: 0.1,
    concentrationUnit: 'N',
    finalVolume: 1000,
    volumeUnit: 'mL',
    suggestedSolvent: 'آب مقطر دیونیزه جوشانده شده',
    applicationFa: 'اکسیدومتری آب و املاح',
    description: 'تیترانت اکسیداسیون کلسیم و آهن و بار مواد آلی آب'
  },
  {
    id: 'phenolphthalein-1pct',
    name: 'شناساگر فنل‌فتالئین ۱٪ در اتانول',
    chemicalFormula: 'C20H14O4',
    reagentFormula: 'C20H14O4',
    reagentId: 'reagent-phenolphthalein-05',
    targetConcentration: 1.0,
    concentrationUnit: 'w/v%',
    finalVolume: 100,
    volumeUnit: 'mL',
    suggestedSolvent: 'اتانول ۹۶٪ یا اتانول ۵۰٪ در آب',
    applicationFa: 'شناساگر اسید-باز',
    description: 'شناساگر اسید-باز با تغییر رنگ بی‌رنگ به ارغوانی در pH = 8.2 - 10.0'
  }
];
