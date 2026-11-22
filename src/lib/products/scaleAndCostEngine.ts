/**
 * Food Science AI - Scale-Up, Costing & Product Economics Engine
 * Part 28 of 30: Rigorous stoichiometric, operational, utilities, packaging,
 * labor, overhead, COGS, unit costing, profit margin and step-by-step trace engine.
 */

import {
  FormulationIngredient,
  FormulationVersion,
  ScaleUnit,
  BatchLossBreakdown,
  PackagingCostItem,
  EnergyUtilityCosts,
  LaborCosts,
  OverheadCosts,
  ProcessingMaintenanceCost,
  UnitPackagingSpec,
  PricingEconomics,
  ProductScalingTraceStep,
  ScaledIngredientItem,
  BatchEconomicSummary,
  ComprehensiveBatchScaleModel
} from '../../types/foodProduct';

export interface BatchCalculationInput {
  ingredients: FormulationIngredient[];
  baseFormulaWeightKg?: number; // وزن فرمول پایه (پیش‌فرض: ۱.۰۰۰ کیلوگرم)
  scaleMode: 'target_output_net' | 'target_input_gross' | 'target_units_count';
  targetValue: number;
  targetUnit: ScaleUnit;
  unitSpec: UnitPackagingSpec;
  lossBreakdown: BatchLossBreakdown;
  packagingItems: PackagingCostItem[];
  utilityCosts: EnergyUtilityCosts;
  laborCosts: LaborCosts;
  overheadCosts: OverheadCosts;
  processingCosts: ProcessingMaintenanceCost;
  pricingSettings: {
    targetProfitMarginPercent: number; // درصد حاشیه سود کارخانه
    distributorMarginPercent: number;  // درصد سود پخش
    retailerMarginPercent: number;     // درصد سود مغازه‌دار
    vatPercent: number;                // درصد مالیات بر ارزش افزوده
  };
}

/**
 * Converts a content measurement (e.g. 250 mL or 900 g) into kilograms considering density
 */
export function convertUnitContentToKg(
  content: number,
  unit: 'g' | 'kg' | 'mL' | 'L',
  densityGperMl: number = 1.0
): number {
  const safeDensity = Math.max(0.01, densityGperMl || 1.0);
  switch (unit) {
    case 'g':
      return content / 1000;
    case 'kg':
      return content;
    case 'mL':
      // mass (g) = volume (mL) * density (g/mL) -> mass (kg) = mass (g) / 1000
      return (content * safeDensity) / 1000;
    case 'L':
      // mass (kg) = volume (L) * density (kg/L)
      return content * safeDensity;
    default:
      return content / 1000;
  }
}

/**
 * Converts any user scale input into base kilograms
 */
export function convertScaleTargetToKg(
  targetValue: number,
  targetUnit: ScaleUnit,
  unitSpec: UnitPackagingSpec
): number {
  const val = Math.max(0, targetValue);
  const density = Math.max(0.01, unitSpec.densityGperMl || 1.0);

  switch (targetUnit) {
    case 'g':
      return val / 1000;
    case 'kg':
      return val;
    case 'mL':
      return (val * density) / 1000;
    case 'L':
      return val * density;
    case 'unit_count': {
      const massPerUnitKg = convertUnitContentToKg(
        unitSpec.unitNetContent,
        unitSpec.unitContentUnit,
        unitSpec.densityGperMl
      );
      return val * massPerUnitKg;
    }
    case 'pack': {
      const massPerUnitKg = convertUnitContentToKg(
        unitSpec.unitNetContent,
        unitSpec.unitContentUnit,
        unitSpec.densityGperMl
      );
      const unitsPerCarton = Math.max(1, unitSpec.unitsPerMasterCarton || 1);
      return val * unitsPerCarton * massPerUnitKg;
    }
    default:
      return val;
  }
}

/**
 * Main calculation engine function for comprehensive scale-up, costing and economic traceability
 */
export function calculateComprehensiveBatchScaleAndCost(
  input: BatchCalculationInput
): ComprehensiveBatchScaleModel {
  const trace: ProductScalingTraceStep[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  let stepCounter = 1;

  // -------------------------------------------------------------
  // Step 1: Base Formulation Verification & Stoichiometry Check
  // -------------------------------------------------------------
  const baseWeightKg = input.baseFormulaWeightKg && input.baseFormulaWeightKg > 0
    ? input.baseFormulaWeightKg
    : 1.0; // پیش‌فرض فرمول پایه: ۱ کیلوگرم (۱۰۰۰ گرم)

  const sumPercentages = input.ingredients.reduce(
    (sum, ing) => sum + (Number(ing.percentage) || 0),
    0
  );
  const roundedSum = Math.round(sumPercentages * 1000) / 1000;
  const is100Percent = Math.abs(roundedSum - 100.0) < 0.001;

  if (input.ingredients.length === 0) {
    errors.push('فرمولاسیون فاقد هرگونه ماده اولیه است.');
  }

  if (!is100Percent) {
    const diff = Math.round((roundedSum - 100) * 1000) / 1000;
    if (diff > 0) {
      warnings.push(`مجموع درصد اجزای فرمول ${roundedSum}% است (${Math.abs(diff)}% بیشتر از ۱۰۰٪). مقادیر در محاسبات با ضریب نرمال‌سازی ${((100 / roundedSum)).toFixed(4)} تعدیل می‌شوند.`);
    } else {
      warnings.push(`مجموع درصد اجزای فرمول ${roundedSum}% است (${Math.abs(diff)}% کمتر از ۱۰۰٪). فرمول باید دقیقاً ۱۰۰٪ باشد؛ مقادیر نرمال‌سازی شدند.`);
    }
  }

  trace.push({
    stepNumber: stepCounter++,
    categoryFa: 'فرمولاسیون پایه',
    titleFa: 'اعتبارسنجی استوکیومتری فرمول آزمایشگاهی',
    formulaDescription: 'مجموع درصد اجزای فرمولاسیون = ∑(Percentage_i)',
    formulaLatex: '\\sum_{i=1}^{n} P_i = 100\\%',
    inputsDescription: `تعداد اجزا: ${input.ingredients.length} قلم | وزن فرمول مبنا: ${baseWeightKg} کیلوگرم`,
    intermediateValues: {
      'جمع جبری درصدها': `${roundedSum}%`,
      'وضعیت بالانس': is100Percent ? 'دقیقاً ۱۰۰٪ (منطبق)' : 'نیازمند نرمال‌سازی'
    },
    resultDescription: is100Percent
      ? 'فرمولاسیون از نظر استوکیومتری متعادل و آماده مقیاس‌گذاری است.'
      : 'فرمولاسیون به صورت نسبی به ۱۰۰٪ نرمال‌سازی گردید.',
    resultValue: `${roundedSum}%`
  });

  // -------------------------------------------------------------
  // Step 2: Loss & Yield Calculations
  // -------------------------------------------------------------
  const evapLoss = Math.max(0, input.lossBreakdown.evaporationLossPercent || 0);
  const holdUpLoss = Math.max(0, input.lossBreakdown.equipmentHoldUpPercent || 0);
  const fillLoss = Math.max(0, input.lossBreakdown.fillingSpillagePercent || 0);
  const pkgReject = Math.max(0, input.lossBreakdown.packagingRejectPercent || 0);

  const totalLossPercent = Math.round((evapLoss + holdUpLoss + fillLoss + pkgReject) * 100) / 100;
  const calculatedYieldPercent = Math.max(0, Math.round((100 - totalLossPercent) * 100) / 100);

  if (totalLossPercent >= 100) {
    errors.push('مجموع درصدهای ضایعات نمی‌تواند مساوی یا بیشتر از ۱۰۰٪ باشد.');
  }

  trace.push({
    stepNumber: stepCounter++,
    categoryFa: 'راندمان و ضایعات',
    titleFa: 'محاسبه درصد افت و راندمان صنعتی فرآیند (Process Yield)',
    formulaDescription: 'جمع ضایعات = ضایعات تبخیر + ماند در خط و تانک + ریزش پرکنی + رد بسته‌بندی | راندمان = ۱۰۰ - جمع ضایعات',
    formulaLatex: 'Yield = 100\\% - (L_{evap} + L_{holdup} + L_{spillage} + L_{reject})',
    inputsDescription: `تبخیر: ${evapLoss}% | ماند مخزن: ${holdUpLoss}% | ریزش پرکنی: ${fillLoss}% | ظروف معیوب: ${pkgReject}%`,
    intermediateValues: {
      'مجموع ضایعات': `${totalLossPercent}%`,
      'راندمان موثر (Yield)': `${calculatedYieldPercent}%`
    },
    resultDescription: `راندمان مفید تولید بچ برابر ${calculatedYieldPercent}% تعیین گردید.`,
    resultValue: `${calculatedYieldPercent}%`
  });

  // -------------------------------------------------------------
  // Step 3: Target Weight Scaling & Conversion (g, kg, mL, L, units)
  // -------------------------------------------------------------
  const unitContentKg = convertUnitContentToKg(
    input.unitSpec.unitNetContent,
    input.unitSpec.unitContentUnit,
    input.unitSpec.densityGperMl
  );

  if (unitContentKg <= 0) {
    errors.push('وزن خالص محتوی هر واحد محصول نمی‌تواند صفر یا منفی باشد.');
  }

  let targetNetKg = 0;
  let targetGrossKg = 0;

  const convertedTargetKg = convertScaleTargetToKg(
    input.targetValue,
    input.targetUnit,
    input.unitSpec
  );

  if (input.scaleMode === 'target_output_net') {
    targetNetKg = convertedTargetKg;
    // Gross Input = Net Output / (Yield / 100)
    const yieldFraction = calculatedYieldPercent > 0 ? calculatedYieldPercent / 100 : 1;
    targetGrossKg = targetNetKg / yieldFraction;
  } else if (input.scaleMode === 'target_input_gross') {
    targetGrossKg = convertedTargetKg;
    targetNetKg = targetGrossKg * (calculatedYieldPercent / 100);
  } else {
    // target_units_count: targetValue is count of finished units
    const unitsCount = Math.max(1, Math.round(input.targetValue));
    targetNetKg = unitsCount * unitContentKg;
    const yieldFraction = calculatedYieldPercent > 0 ? calculatedYieldPercent / 100 : 1;
    targetGrossKg = targetNetKg / yieldFraction;
  }

  // Prevent absurd or negative values
  targetGrossKg = Math.max(0.001, targetGrossKg);
  targetNetKg = Math.max(0.0001, targetNetKg);

  const totalLossKg = Math.max(0, targetGrossKg - targetNetKg);

  // Scale Factor: ratio of Gross Input Weight to Base Formula Weight
  const scaleFactor = Math.round((targetGrossKg / baseWeightKg) * 10000) / 10000;

  trace.push({
    stepNumber: stepCounter++,
    categoryFa: 'مقیاس‌گذاری (Scale-Up)',
    titleFa: 'محاسبه وزن ناخالص ورودی، وزن خالص خروجی و ضریب مقیاس (Scale Factor)',
    formulaDescription: 'ضریب مقیاس = وزن ناخالص ورودی ÷ وزن فرمول پایه | وزن ورودی = وزن خالص ÷ راندمان',
    formulaLatex: 'ScaleFactor = \\frac{W_{gross}}{W_{base}} = \\frac{W_{net} / Yield}{W_{base}}',
    inputsDescription: `ورودی کاربر: ${input.targetValue} ${input.targetUnit} (${input.scaleMode === 'target_output_net' ? 'خالص خروجی' : input.scaleMode === 'target_input_gross' ? 'ناخالص ورودی' : 'تعداد واحد'}) | دانسیته: ${input.unitSpec.densityGperMl} g/mL`,
    intermediateValues: {
      'وزن ناخالص کل مواد ورودی (Gross Input)': `${targetGrossKg.toFixed(3)} kg`,
      'وزن خالص محصول سالم (Net Output)': `${targetNetKg.toFixed(3)} kg`,
      'وزن کل ضایعات و افت فرآیندی': `${totalLossKg.toFixed(3)} kg`,
      'وزن یک واحد بسته‌بندی': `${(unitContentKg * 1000).toFixed(1)} g (${unitContentKg.toFixed(4)} kg)`
    },
    resultDescription: `ضریب مقیاس (Scale Factor) برابر ${scaleFactor.toLocaleString('fa-IR')}X است.`,
    resultValue: `${scaleFactor}x`
  });

  // -------------------------------------------------------------
  // Step 4: Finished Units & Packaging Breakdown
  // -------------------------------------------------------------
  const totalFinishedUnits = unitContentKg > 0
    ? Math.floor(targetNetKg / unitContentKg)
    : 0;

  const unitsPerCarton = Math.max(1, input.unitSpec.unitsPerMasterCarton || 1);
  const totalMasterCartons = totalFinishedUnits > 0
    ? Math.ceil(totalFinishedUnits / unitsPerCarton)
    : 0;

  trace.push({
    stepNumber: stepCounter++,
    categoryFa: 'بسته‌بندی و شمارش',
    titleFa: 'محاسبه تعداد واحدهای محصول نهایی و کارتن‌های مادر',
    formulaDescription: 'تعداد واحد نهایی = جزء صحیح (وزن خالص خروجی ÷ وزن هر واحد) | تعداد کارتن = سقف (تعداد واحد ÷ ظرفیت کارتن)',
    formulaLatex: 'Units = \\lfloor \\frac{W_{net}}{w_{unit}} \\rfloor , \\quad Cartons = \\lceil \\frac{Units}{C_{capacity}} \\rceil',
    inputsDescription: `وزن کل خالص: ${targetNetKg.toFixed(2)} kg | وزن هر بسته: ${unitContentKg.toFixed(4)} kg | ظرفیت کارتن: ${unitsPerCarton} عدد`,
    intermediateValues: {
      'تعداد واحدهای سالم بسته‌بندی‌شده': `${totalFinishedUnits.toLocaleString('fa-IR')} عدد`,
      'تعداد کارتن مادر': `${totalMasterCartons.toLocaleString('fa-IR')} بسته`
    },
    resultDescription: `بچ با موفقیت به ${totalFinishedUnits.toLocaleString('fa-IR')} بسته سالم قابل عرضه تقسیم شد.`,
    resultValue: `${totalFinishedUnits.toLocaleString('fa-IR')} عدد`
  });

  // -------------------------------------------------------------
  // Step 5: Raw Materials Requirements & Costing
  // -------------------------------------------------------------
  let totalRawMaterialCost = 0;
  const divisor = roundedSum > 0 ? roundedSum : 100;

  const scaledIngredients: ScaledIngredientItem[] = input.ingredients.map(ing => {
    const pct = Number(ing.percentage) || 0;
    const normalizedShare = pct / divisor;

    const grossRequiredKg = normalizedShare * targetGrossKg;
    const netRequiredKg = normalizedShare * targetNetKg;

    // Unit formatting logic
    let displayUnit = 'kg';
    let formattedAmount = '';

    if (grossRequiredKg < 0.001) {
      displayUnit = 'mg';
      formattedAmount = (grossRequiredKg * 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 });
    } else if (grossRequiredKg < 1) {
      displayUnit = 'g';
      formattedAmount = (grossRequiredKg * 1000).toLocaleString('fa-IR', { maximumFractionDigits: 2 });
    } else if (grossRequiredKg >= 1000) {
      displayUnit = 'تن (Ton)';
      formattedAmount = (grossRequiredKg / 1000).toLocaleString('fa-IR', { maximumFractionDigits: 3 });
    } else {
      displayUnit = 'kg';
      formattedAmount = grossRequiredKg.toLocaleString('fa-IR', { maximumFractionDigits: 3 });
    }

    const costPerKg = Math.max(0, Number(ing.costPerKg) || 0);
    const itemCost = Math.round(grossRequiredKg * costPerKg);
    totalRawMaterialCost += itemCost;

    return {
      id: ing.id,
      nameFa: ing.nameFa,
      category: ing.category,
      percentage: pct,
      netRequiredKg: Math.round(netRequiredKg * 10000) / 10000,
      grossRequiredKg: Math.round(grossRequiredKg * 10000) / 10000,
      formattedAmount,
      displayUnit,
      costPerKg,
      totalCostInBatch: itemCost,
      costContributionPercent: 0 // Will compute below once total is known
    };
  });

  // Compute cost contribution % for each ingredient
  for (const item of scaledIngredients) {
    item.costContributionPercent = totalRawMaterialCost > 0
      ? Math.round((item.totalCostInBatch / totalRawMaterialCost) * 1000) / 10
      : 0;
  }

  trace.push({
    stepNumber: stepCounter++,
    categoryFa: 'مواد اولیه',
    titleFa: 'دستور توزین و بهای تمام‌شده مواد اولیه (Raw Materials Costing)',
    formulaDescription: 'وزن مورد نیاز هر ماده = (درصد ماده ÷ ۱۰۰) × وزن ناخالص بچ | بهای ماده = وزن ناخالص × بهای هر کیلوگرم',
    formulaLatex: 'W_i = \\frac{P_i}{100} \\times W_{gross}, \\quad Cost_i = W_i \\times UnitCost_i',
    inputsDescription: `${scaledIngredients.length} جزء ماده اولیه در فرمولاسیون`,
    intermediateValues: {
      'مجموع بهای کل مواد اولیه در بچ': `${totalRawMaterialCost.toLocaleString('fa-IR')} تومان`,
      'هزینه مواد اولیه به ازای هر کیلوگرم خروجی خالص': targetNetKg > 0 ? `${Math.round(totalRawMaterialCost / targetNetKg).toLocaleString('fa-IR')} تومان` : '—'
    },
    resultDescription: `هزینه کل مواد اولیه بچ برابر ${totalRawMaterialCost.toLocaleString('fa-IR')} تومان محاسبه شد.`,
    resultValue: `${totalRawMaterialCost.toLocaleString('fa-IR')} تومان`
  });

  // -------------------------------------------------------------
  // Step 6: Packaging Materials Costing
  // -------------------------------------------------------------
  let totalPackagingCost = 0;
  const calculatedPackagingItems: PackagingCostItem[] = (input.packagingItems || []).map(item => {
    const unitsPerProduct = Math.max(0, item.unitsPerFinishedProduct || 1);
    const scrapPct = Math.max(0, item.scrapRejectPercent || 0);
    const unitCost = Math.max(0, item.unitCost || 0);

    // Required items = (Finished units * unitsPerProduct) * (1 + scrap/100)
    const baseRequired = totalFinishedUnits * unitsPerProduct;
    const totalRequired = Math.ceil(baseRequired * (1 + scrapPct / 100));
    const itemTotalCost = Math.round(totalRequired * unitCost);
    const costPerFinishedUnit = totalFinishedUnits > 0
      ? Math.round((itemTotalCost / totalFinishedUnits) * 100) / 100
      : 0;

    totalPackagingCost += itemTotalCost;

    return {
      ...item,
      totalQuantityRequired: totalRequired,
      totalCost: itemTotalCost,
      costPerFinishedUnit
    };
  });

  trace.push({
    stepNumber: stepCounter++,
    categoryFa: 'ملزومات بسته‌بندی',
    titleFa: 'محاسبه هزینه ظروف، لیبل، درب و کارتن مادر (Packaging Costing)',
    formulaDescription: 'تعداد کل مورد نیاز = تعداد محصول سالم × ضریب مصرف × (۱ + درصد ضایعات بسته‌بندی)',
    formulaLatex: 'Qty_{pkg} = Units \\times Rate \\times (1 + Reject\\%) , \\quad Cost_{pkg} = Qty_{pkg} \\times UnitCost',
    inputsDescription: `${calculatedPackagingItems.length} قلم ملزومات بسته‌بندی اولیه و ثانویه`,
    intermediateValues: {
      'مجموع هزینه بسته‌بندی کل بچ': `${totalPackagingCost.toLocaleString('fa-IR')} تومان`,
      'هزینه بسته‌بندی هر واحد محصول': totalFinishedUnits > 0 ? `${(totalPackagingCost / totalFinishedUnits).toFixed(0)} تومان` : '—'
    },
    resultDescription: `هزینه کل ملزومات بسته‌بندی بچ به ${totalPackagingCost.toLocaleString('fa-IR')} تومان رسید.`,
    resultValue: `${totalPackagingCost.toLocaleString('fa-IR')} تومان`
  });

  // -------------------------------------------------------------
  // Step 7: Utilities & Energy Costs
  // -------------------------------------------------------------
  const eleCost = Math.round((input.utilityCosts.electricityKwh || 0) * (input.utilityCosts.electricityRatePerKwh || 0));
  const gasCost = Math.round((input.utilityCosts.gasCubicMeters || 0) * (input.utilityCosts.gasRatePerCubicMeter || 0));
  const steamCost = Math.round((input.utilityCosts.steamTons || 0) * (input.utilityCosts.steamRatePerTon || 0));
  const waterCost = Math.round((input.utilityCosts.waterCubicMeters || 0) * (input.utilityCosts.waterRatePerCubicMeter || 0));
  const otherUtilCost = Math.round(input.utilityCosts.otherUtilityCost || 0);

  const totalUtilityCost = eleCost + gasCost + steamCost + waterCost + otherUtilCost;

  trace.push({
    stepNumber: stepCounter++,
    categoryFa: 'انرژی و تأسیسات',
    titleFa: 'محاسبه هزینه برق، گاز، بخار صنعتی و آب (Utilities & Energy)',
    formulaDescription: 'هزینه انرژی = (برق × تعرفه) + (گاز × تعرفه) + (بخار × تعرفه) + (آب × تعرفه) + سایر',
    formulaLatex: 'Cost_{energy} = (kWh \\times R_{elec}) + (m^3 \\times R_{gas}) + (Ton \\times R_{steam}) + (m^3 \\times R_{water})',
    inputsDescription: `برق: ${input.utilityCosts.electricityKwh} kWh | گاز: ${input.utilityCosts.gasCubicMeters} m³ | بخار: ${input.utilityCosts.steamTons} Ton | آب: ${input.utilityCosts.waterCubicMeters} m³`,
    intermediateValues: {
      'هزینه برق صنعتی': `${eleCost.toLocaleString('fa-IR')} تومان`,
      'هزینه سوخت و گاز': `${gasCost.toLocaleString('fa-IR')} تومان`,
      'هزینه بخار و آب': `${(steamCost + waterCost).toLocaleString('fa-IR')} تومان`,
      'جمع کل هزینه انرژی و یوتیلیتی': `${totalUtilityCost.toLocaleString('fa-IR')} تومان`
    },
    resultDescription: `هزینه کل انرژی مصرفی در این بچ برابر ${totalUtilityCost.toLocaleString('fa-IR')} تومان برآورد شد.`,
    resultValue: `${totalUtilityCost.toLocaleString('fa-IR')} تومان`
  });

  // -------------------------------------------------------------
  // Step 8: Direct & QA Labor Costs
  // -------------------------------------------------------------
  const operatorCost = Math.round(
    (input.laborCosts.operatorCount || 0) *
    (input.laborCosts.hoursPerBatch || 0) *
    (input.laborCosts.hourlyWageRate || 0)
  );
  const qaCost = Math.round(
    (input.laborCosts.qaTechnicianHours || 0) *
    (input.laborCosts.qaHourlyRate || 0)
  );
  const totalLaborCost = operatorCost + qaCost;

  trace.push({
    stepNumber: stepCounter++,
    categoryFa: 'نیروی انسانی',
    titleFa: 'محاسبه هزینه دستمزد مستقیم اپراتورهای خط و تکنسین QC',
    formulaDescription: 'دستمزد = (تعداد اپراتور × ساعات کارکرد × نرخ ساعتی) + (ساعت کار QC × نرخ QC)',
    formulaLatex: 'Cost_{labor} = (N_{op} \\times Hours \\times Wage_{op}) + (Hours_{QC} \\times Wage_{QC})',
    inputsDescription: `اپراتور: ${input.laborCosts.operatorCount} نفر × ${input.laborCosts.hoursPerBatch} ساعت | تکنسین آزمایشگاه: ${input.laborCosts.qaTechnicianHours} ساعت`,
    intermediateValues: {
      'دستمزد مستقیم خط تولید': `${operatorCost.toLocaleString('fa-IR')} تومان`,
      'دستمزد کنترل کیفیت و آزمایشگاه': `${qaCost.toLocaleString('fa-IR')} تومان`,
      'جمع هزینه نیروی انسانی': `${totalLaborCost.toLocaleString('fa-IR')} تومان`
    },
    resultDescription: `هزینه نیروی انسانی مستقیم بچ برابر ${totalLaborCost.toLocaleString('fa-IR')} تومان محاسبه شد.`,
    resultValue: `${totalLaborCost.toLocaleString('fa-IR')} تومان`
  });

  // -------------------------------------------------------------
  // Step 9: Processing & Maintenance Costs
  // -------------------------------------------------------------
  const totalProcessingCost = Math.round(
    (input.processingCosts.maintenanceCleaningCipCost || 0) +
    (input.processingCosts.lineWearTearCost || 0)
  );

  // -------------------------------------------------------------
  // Step 10: Overhead Costs
  // -------------------------------------------------------------
  const directCostsSum = totalRawMaterialCost + totalPackagingCost + totalUtilityCost + totalLaborCost + totalProcessingCost;

  let totalOverheadCost = 0;
  if (input.overheadCosts.mode === 'percentage_of_direct') {
    const rate = Math.max(0, input.overheadCosts.overheadRatePercent || 0);
    totalOverheadCost = Math.round(directCostsSum * (rate / 100));
  } else {
    totalOverheadCost = Math.round(input.overheadCosts.fixedOverheadAmount || 0);
  }

  trace.push({
    stepNumber: stepCounter++,
    categoryFa: 'سربار کارخانه',
    titleFa: 'تخصیص هزینه‌های عمومی و سربار کارخانه (Factory Overhead)',
    formulaDescription: input.overheadCosts.mode === 'percentage_of_direct'
      ? 'هزینه سربار = مجموع هزینه‌های مستقیم × درصد سربار'
      : 'هزینه سربار = مبلغ ثابت تعیین‌شده به ازای بچ',
    formulaLatex: input.overheadCosts.mode === 'percentage_of_direct'
      ? 'Overhead = DirectCosts \\times Rate\\%'
      : 'Overhead = FixedAmount',
    inputsDescription: input.overheadCosts.mode === 'percentage_of_direct'
      ? `نرخ سربار: ${input.overheadCosts.overheadRatePercent}% از هزینه‌های مستقیم (${directCostsSum.toLocaleString('fa-IR')} تومان)`
      : `مبلغ ثابت: ${input.overheadCosts.fixedOverheadAmount.toLocaleString('fa-IR')} تومان`,
    intermediateValues: {
      'جمع کل هزینه‌های مستقیم': `${directCostsSum.toLocaleString('fa-IR')} تومان`,
      'سربار تخصیص‌یافته': `${totalOverheadCost.toLocaleString('fa-IR')} تومان`
    },
    resultDescription: `سربار تخصیصی به این بچ برابر ${totalOverheadCost.toLocaleString('fa-IR')} تومان شد.`,
    resultValue: `${totalOverheadCost.toLocaleString('fa-IR')} تومان`
  });

  // -------------------------------------------------------------
  // Step 11: Total COGS (Cost of Goods Sold) & Unit Costs
  // -------------------------------------------------------------
  const totalCogsBatchCost = directCostsSum + totalOverheadCost;

  const costPerKgNet = targetNetKg > 0
    ? Math.round(totalCogsBatchCost / targetNetKg)
    : 0;

  const costPerFinishedUnit = totalFinishedUnits > 0
    ? Math.round(totalCogsBatchCost / totalFinishedUnits)
    : 0;

  // Cost shares
  const safeTotal = totalCogsBatchCost > 0 ? totalCogsBatchCost : 1;
  const costShares = {
    rawMaterialsPercent: Math.round((totalRawMaterialCost / safeTotal) * 1000) / 10,
    packagingPercent: Math.round((totalPackagingCost / safeTotal) * 1000) / 10,
    energyPercent: Math.round((totalUtilityCost / safeTotal) * 1000) / 10,
    laborPercent: Math.round((totalLaborCost / safeTotal) * 1000) / 10,
    overheadPercent: Math.round((totalOverheadCost / safeTotal) * 1000) / 10,
    processingPercent: Math.round((totalProcessingCost / safeTotal) * 1000) / 10
  };

  trace.push({
    stepNumber: stepCounter++,
    categoryFa: 'بهای تمام‌شده (COGS)',
    titleFa: 'تجمیع بهای تمام‌شده کل بچ و هزینه هر واحد خروجی',
    formulaDescription: 'بهای تمام‌شده کل = مواد اولیه + بسته‌بندی + انرژی + دستمزد + فرآوری + سربار | بهای هر واحد = بهای کل ÷ تعداد واحدهای سالم',
    formulaLatex: 'COGS = Raw + Pkg + Energy + Labor + Process + Overhead , \\quad UnitCost = \\frac{COGS}{Units}',
    inputsDescription: `تعداد واحدهای قابل فروش: ${totalFinishedUnits.toLocaleString('fa-IR')} عدد | وزن خالص: ${targetNetKg.toFixed(2)} kg`,
    intermediateValues: {
      'قیمت تمام‌شده کل بچ': `${totalCogsBatchCost.toLocaleString('fa-IR')} تومان`,
      'هزینه هر کیلوگرم محصول نهایی': `${costPerKgNet.toLocaleString('fa-IR')} تومان/kg`,
      'هزینه تمام‌شده هر بسته محصول': `${costPerFinishedUnit.toLocaleString('fa-IR')} تومان/بسته`,
      'سهم مواد اولیه': `${costShares.rawMaterialsPercent}%`,
      'سهم بسته‌بندی': `${costShares.packagingPercent}%`
    },
    resultDescription: `قیمت تمام‌شده هر بسته محصول برابر ${costPerFinishedUnit.toLocaleString('fa-IR')} تومان محاسبه گردید.`,
    resultValue: `${costPerFinishedUnit.toLocaleString('fa-IR')} تومان/واحد`
  });

  // -------------------------------------------------------------
  // Step 12: Pricing Economics & Margins (Ex-Factory, Retailer, VAT, CRP)
  // -------------------------------------------------------------
  const factoryMarginPct = Math.max(0, Math.min(95, input.pricingSettings.targetProfitMarginPercent || 25));
  const distMarginPct = Math.max(0, Math.min(95, input.pricingSettings.distributorMarginPercent || 10));
  const retMarginPct = Math.max(0, Math.min(95, input.pricingSettings.retailerMarginPercent || 15));
  const vatPct = Math.max(0, input.pricingSettings.vatPercent || 10);

  // Ex-Factory Price = UnitCost / (1 - Margin/100)
  const exFactoryPrice = factoryMarginPct < 100
    ? Math.round(costPerFinishedUnit / (1 - factoryMarginPct / 100))
    : costPerFinishedUnit;

  const grossProfitPerUnit = Math.max(0, exFactoryPrice - costPerFinishedUnit);

  // Distributor delivery price
  const distributorPrice = distMarginPct < 100
    ? Math.round(exFactoryPrice / (1 - distMarginPct / 100))
    : exFactoryPrice;

  // Consumer price pre-VAT
  const consumerPricePreVat = retMarginPct < 100
    ? Math.round(distributorPrice / (1 - retMarginPct / 100))
    : distributorPrice;

  // Final Consumer Retail Price (CRP) with VAT
  const consumerRetailPrice = Math.round(consumerPricePreVat * (1 + vatPct / 100));

  trace.push({
    stepNumber: stepCounter++,
    categoryFa: 'قیمت‌گذاری و اقتصاد بازار',
    titleFa: 'محاسبه حاشیه سود کارخانه، قیمت درب کارخانه، توزیع و قیمت نهایی مصرف‌کننده (CRP)',
    formulaDescription: 'قیمت درب کارخانه = بهای تمام‌شده ÷ (۱ - درصد سود) | قیمت مصرف‌کننده = قیمت مغازه × (۱ + مالیات ارزش افزوده)',
    formulaLatex: 'P_{factory} = \\frac{Cost}{1 - M_{factory}} , \\quad CRP = P_{retail} \\times (1 + VAT)',
    inputsDescription: `مارجین کارخانه: ${factoryMarginPct}% | مارجین پخش: ${distMarginPct}% | مارجین مغازه: ${retMarginPct}% | مالیات: ${vatPct}%`,
    intermediateValues: {
      'سود ناخالص کارخانه به ازای هر واحد': `${grossProfitPerUnit.toLocaleString('fa-IR')} تومان`,
      'قیمت فروش درب کارخانه (عمده‌فروشی)': `${exFactoryPrice.toLocaleString('fa-IR')} تومان`,
      'قیمت تحویل شرکت پخش به سوپرمارکت': `${distributorPrice.toLocaleString('fa-IR')} تومان`,
      'قیمت قبل از مالیات ارزش افزوده': `${consumerPricePreVat.toLocaleString('fa-IR')} تومان`,
      'قیمت نهایی درج‌شده روی جلد مصرف‌کننده (CRP)': `${consumerRetailPrice.toLocaleString('fa-IR')} تومان`
    },
    resultDescription: `قیمت نهایی مصرف‌کننده (با احتساب زنجیره تأمین و مالیات) ${consumerRetailPrice.toLocaleString('fa-IR')} تومان تعیین شد.`,
    resultValue: `${consumerRetailPrice.toLocaleString('fa-IR')} تومان`
  });

  const economics: BatchEconomicSummary = {
    rawMaterialsTotalCost: totalRawMaterialCost,
    packagingTotalCost: totalPackagingCost,
    energyUtilityTotalCost: totalUtilityCost,
    laborTotalCost: totalLaborCost,
    overheadTotalCost: totalOverheadCost,
    processingTotalCost: totalProcessingCost,
    totalCogsBatchCost,
    costPerKgNet,
    costPerFinishedUnit,
    costShares
  };

  const pricing: PricingEconomics = {
    targetProfitMarginPercent: factoryMarginPct,
    grossProfitPerUnit,
    exFactoryPricePerUnit: exFactoryPrice,
    distributorMarginPercent: distMarginPct,
    distributorPricePerUnit: distributorPrice,
    retailerMarginPercent: retMarginPct,
    consumerPricePreVat,
    vatPercent: vatPct,
    consumerRetailPrice
  };

  const lossBreakdownComplete: BatchLossBreakdown = {
    evaporationLossPercent: evapLoss,
    equipmentHoldUpPercent: holdUpLoss,
    fillingSpillagePercent: fillLoss,
    packagingRejectPercent: pkgReject,
    totalLossPercent,
    calculatedYieldPercent,
    totalLossKg: Math.round(totalLossKg * 1000) / 1000
  };

  const updatedUtilityCosts: EnergyUtilityCosts = {
    ...input.utilityCosts,
    totalUtilityCost
  };

  const updatedLaborCosts: LaborCosts = {
    ...input.laborCosts,
    totalLaborCost
  };

  const updatedOverheadCosts: OverheadCosts = {
    ...input.overheadCosts,
    totalOverheadCost
  };

  const updatedProcessingCosts: ProcessingMaintenanceCost = {
    ...input.processingCosts,
    totalProcessingCost
  };

  return {
    baseFormulaWeightKg: baseWeightKg,
    scaleMode: input.scaleMode,
    targetValue: input.targetValue,
    targetUnit: input.targetUnit,
    densityGperMl: input.unitSpec.densityGperMl,
    scaleFactor,
    grossInputWeightKg: Math.round(targetGrossKg * 1000) / 1000,
    netSaleableWeightKg: Math.round(targetNetKg * 1000) / 1000,
    lossBreakdown: lossBreakdownComplete,
    unitSpec: input.unitSpec,
    totalFinishedUnits,
    totalMasterCartons,
    ingredients: scaledIngredients,
    packagingItems: calculatedPackagingItems,
    utilityCosts: updatedUtilityCosts,
    laborCosts: updatedLaborCosts,
    overheadCosts: updatedOverheadCosts,
    processingCosts: updatedProcessingCosts,
    economics,
    pricing,
    validationErrors: errors,
    validationWarnings: warnings,
    calculationTrace: trace
  };
}

/**
 * Creates sensible default editable inputs for a project so user starts with zero/safe editable values
 */
export function getDefaultBatchScaleInput(
  ingredients: FormulationIngredient[],
  category: string = 'dairy'
): BatchCalculationInput {
  // Density based on category
  let defaultDensity = 1.0;
  if (category === 'dairy') defaultDensity = 1.03;
  else if (category === 'beverage') defaultDensity = 1.05;
  else if (category === 'sauces_condiments') defaultDensity = 1.12;
  else if (category === 'oils_fats') defaultDensity = 0.92;

  return {
    ingredients,
    baseFormulaWeightKg: 1.0, // فرمول مبنا: ۱ کیلوگرم
    scaleMode: 'target_output_net',
    targetValue: 500, // بچ آزمایشی پایلوت پیش‌فرض: ۵۰۰ کیلوگرم
    targetUnit: 'kg',
    unitSpec: {
      unitNetContent: 250,
      unitContentUnit: 'mL',
      densityGperMl: defaultDensity,
      unitsPerMasterCarton: 24
    },
    lossBreakdown: {
      evaporationLossPercent: 1.0,
      equipmentHoldUpPercent: 0.8,
      fillingSpillagePercent: 0.5,
      packagingRejectPercent: 0.7,
      totalLossPercent: 3.0,
      calculatedYieldPercent: 97.0,
      totalLossKg: 0
    },
    packagingItems: [
      {
        id: 'pkg_bottle',
        nameFa: 'بطری اصلی (PET / Glass / Pouch)',
        itemType: 'primary_container',
        unit: 'عدد',
        unitsPerFinishedProduct: 1,
        unitCost: 1800, // کاملاً قابل ویرایش توسط کاربر
        scrapRejectPercent: 1.5,
        totalQuantityRequired: 0,
        totalCost: 0,
        costPerFinishedUnit: 0
      },
      {
        id: 'pkg_cap',
        nameFa: 'درب بند ۲۸ میلی‌متری با واشر سیل',
        itemType: 'closure_cap',
        unit: 'عدد',
        unitsPerFinishedProduct: 1,
        unitCost: 650,
        scrapRejectPercent: 1.0,
        totalQuantityRequired: 0,
        totalCost: 0,
        costPerFinishedUnit: 0
      },
      {
        id: 'pkg_label',
        nameFa: 'لیبل اسلیو حرارتی / برچسب صدفی',
        itemType: 'label',
        unit: 'عدد',
        unitsPerFinishedProduct: 1,
        unitCost: 450,
        scrapRejectPercent: 2.0,
        totalQuantityRequired: 0,
        totalCost: 0,
        costPerFinishedUnit: 0
      },
      {
        id: 'pkg_carton',
        nameFa: 'کارتن مادر ۵ لایه دایکاتی (۲۴ تایی)',
        itemType: 'secondary_carton',
        unit: 'عدد',
        unitsPerFinishedProduct: 1 / 24, // ۱ کارتن به ازای ۲۴ عدد
        unitCost: 9500,
        scrapRejectPercent: 0.5,
        totalQuantityRequired: 0,
        totalCost: 0,
        costPerFinishedUnit: 0
      },
      {
        id: 'pkg_shrink',
        nameFa: 'نایلون شیرینک و استرچ پالت',
        itemType: 'tertiary_shrink',
        unit: 'بسته',
        unitsPerFinishedProduct: 1 / 24,
        unitCost: 1200,
        scrapRejectPercent: 1.0,
        totalQuantityRequired: 0,
        totalCost: 0,
        costPerFinishedUnit: 0
      }
    ],
    utilityCosts: {
      electricityKwh: 350,
      electricityRatePerKwh: 1200, // کاملاً قابل ویرایش
      gasCubicMeters: 45,
      gasRatePerCubicMeter: 3500,
      steamTons: 0.8,
      steamRatePerTon: 450000,
      waterCubicMeters: 3.5,
      waterRatePerCubicMeter: 25000,
      otherUtilityCost: 80000,
      totalUtilityCost: 0
    },
    laborCosts: {
      operatorCount: 3,
      hoursPerBatch: 4,
      hourlyWageRate: 85000, // کاملاً قابل ویرایش
      qaTechnicianHours: 2,
      qaHourlyRate: 110000,
      totalLaborCost: 0
    },
    overheadCosts: {
      mode: 'percentage_of_direct',
      overheadRatePercent: 8, // ۸٪ از کل هزینه‌های مستقیم
      fixedOverheadAmount: 500000,
      totalOverheadCost: 0
    },
    processingCosts: {
      maintenanceCleaningCipCost: 180000,
      lineWearTearCost: 120000,
      totalProcessingCost: 0
    },
    pricingSettings: {
      targetProfitMarginPercent: 25,
      distributorMarginPercent: 12,
      retailerMarginPercent: 15,
      vatPercent: 10
    }
  };
}
