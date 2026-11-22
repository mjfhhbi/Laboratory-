/**
 * Unit Tests for Scale-Up, Costing and Product Economics Engine
 * Part 28 of 30: Scale factor, process loss, unit conversions, BOM weighing,
 * packaging economics, utilities, labor, overhead, COGS, unit costing,
 * profit margins, error guardrails and calculation trace.
 */

import {
  calculateComprehensiveBatchScaleAndCost,
  convertUnitContentToKg,
  convertScaleTargetToKg,
  getDefaultBatchScaleInput
} from '../src/lib/products/scaleAndCostEngine';
import { FormulationIngredient } from '../src/types/foodProduct';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- RUNNING UNIT TESTS FOR SCALE-UP & COSTING ENGINE ---');

// Test 1: Unit Content Conversion with Liquid Density
{
  const kgFromMl = convertUnitContentToKg(250, 'mL', 1.03); // 250 mL of Doogh/Milk (density 1.03)
  // expected: 250 * 1.03 / 1000 = 0.2575 kg
  assert(Math.abs(kgFromMl - 0.2575) < 0.0001, `convertUnitContentToKg 250mL @ 1.03 -> expected 0.2575 kg, got ${kgFromMl}`);

  const kgFromG = convertUnitContentToKg(900, 'g');
  assert(Math.abs(kgFromG - 0.9) < 0.0001, `convertUnitContentToKg 900g -> expected 0.9 kg, got ${kgFromG}`);

  const kgFromL = convertUnitContentToKg(2, 'L', 1.05); // 2 L of juice (density 1.05)
  // expected: 2 * 1.05 = 2.1 kg
  assert(Math.abs(kgFromL - 2.1) < 0.0001, `convertUnitContentToKg 2L @ 1.05 -> expected 2.1 kg, got ${kgFromL}`);
}

// Test 2: Scale Target to Base Kg Conversion
{
  const unitSpec = {
    unitNetContent: 250,
    unitContentUnit: 'mL' as const,
    densityGperMl: 1.03,
    unitsPerMasterCarton: 24
  };

  const kgFromUnitsCount = convertScaleTargetToKg(1000, 'unit_count', unitSpec);
  // 1000 units * 0.2575 kg = 257.5 kg
  assert(Math.abs(kgFromUnitsCount - 257.5) < 0.001, `1000 units target -> expected 257.5 kg, got ${kgFromUnitsCount}`);

  const kgFromCartons = convertScaleTargetToKg(10, 'pack', unitSpec);
  // 10 cartons * 24 * 0.2575 kg = 61.8 kg
  assert(Math.abs(kgFromCartons - 61.8) < 0.001, `10 cartons target -> expected 61.8 kg, got ${kgFromCartons}`);
}

// Test 3: Process Yield, Losses and Scale Factor
{
  const testIngredients: FormulationIngredient[] = [
    { id: '1', nameFa: 'شیر پاستوریزه', category: 'solvent_base', percentage: 95.0, dryMatterPercent: 8.5, costPerKg: 18000 },
    { id: '2', nameFa: 'نمک طعام تصفیه شده', category: 'salt_mineral', percentage: 0.8, dryMatterPercent: 100, costPerKg: 8000 },
    { id: '3', nameFa: 'استارتر کالچر', category: 'fortifier_vitamin', percentage: 0.2, dryMatterPercent: 100, costPerKg: 1200000 },
    { id: '4', nameFa: 'عصاره نعناع', category: 'flavor_aroma', percentage: 4.0, dryMatterPercent: 15, costPerKg: 45000 }
  ];

  const defaultInput = getDefaultBatchScaleInput(testIngredients, 'dairy');
  defaultInput.targetValue = 1000; // 1000 kg net
  defaultInput.targetUnit = 'kg';
  defaultInput.scaleMode = 'target_output_net';
  defaultInput.lossBreakdown = {
    evaporationLossPercent: 1.5,
    equipmentHoldUpPercent: 0.8,
    fillingSpillagePercent: 0.5,
    packagingRejectPercent: 0.2,
    totalLossPercent: 3.0,
    calculatedYieldPercent: 97.0,
    totalLossKg: 0
  };

  const model = calculateComprehensiveBatchScaleAndCost(defaultInput);

  // Total loss should be 3%
  assert(model.lossBreakdown.totalLossPercent === 3.0, `Total loss is 3.0%, got ${model.lossBreakdown.totalLossPercent}`);
  assert(model.lossBreakdown.calculatedYieldPercent === 97.0, `Calculated yield is 97.0%, got ${model.lossBreakdown.calculatedYieldPercent}`);

  // Gross Input Weight should be 1000 / 0.97 = 1030.928 kg
  const expectedGross = 1000 / 0.97;
  assert(Math.abs(model.grossInputWeightKg - expectedGross) < 0.1, `Gross input weight expected ~1030.93 kg, got ${model.grossInputWeightKg}`);

  // Scale factor (base formula is 1.0 kg)
  assert(Math.abs(model.scaleFactor - (expectedGross / 1.0)) < 0.1, `Scale factor expected ~1030.9, got ${model.scaleFactor}`);
}

// Test 4: Finished Units and Packaging Calculations
{
  const testIngredients: FormulationIngredient[] = [
    { id: '1', nameFa: 'آب میوه طبیعی', category: 'solvent_base', percentage: 100.0, dryMatterPercent: 12.0, costPerKg: 25000 }
  ];
  const input = getDefaultBatchScaleInput(testIngredients, 'beverage');
  input.targetValue = 515; // 515 kg net
  input.targetUnit = 'kg';
  input.unitSpec = {
    unitNetContent: 250,
    unitContentUnit: 'mL',
    densityGperMl: 1.03, // 0.2575 kg per bottle
    unitsPerMasterCarton: 24
  };

  const model = calculateComprehensiveBatchScaleAndCost(input);
  // Units = floor(515 / 0.2575) = 2000 bottles
  assert(model.totalFinishedUnits === 2000, `Expected 2000 bottles, got ${model.totalFinishedUnits}`);
  // Cartons = ceil(2000 / 24) = 84 cartons
  assert(model.totalMasterCartons === 84, `Expected 84 master cartons, got ${model.totalMasterCartons}`);
}

// Test 5: Cost Consolidation (COGS), Unit Cost and Multi-Tier Pricing
{
  const testIngredients: FormulationIngredient[] = [
    { id: '1', nameFa: 'ماده اصلی', category: 'other', percentage: 100.0, dryMatterPercent: 50.0, costPerKg: 10000 }
  ];
  const input = getDefaultBatchScaleInput(testIngredients, 'dairy');
  input.targetValue = 100; // 100 kg
  input.targetUnit = 'kg';
  input.scaleMode = 'target_input_gross';
  input.lossBreakdown = {
    evaporationLossPercent: 0,
    equipmentHoldUpPercent: 0,
    fillingSpillagePercent: 0,
    packagingRejectPercent: 0,
    totalLossPercent: 0,
    calculatedYieldPercent: 100,
    totalLossKg: 0
  };
  input.unitSpec = {
    unitNetContent: 1,
    unitContentUnit: 'kg',
    densityGperMl: 1.0,
    unitsPerMasterCarton: 10
  };

  // 100 units of 1kg.
  // Raw material: 100kg * 10000 = 1,000,000 تومان
  // Let packaging be 1 item: bottle @ 2000 تومان each with 0% scrap -> 100 * 2000 = 200,000 تومان
  input.packagingItems = [
    {
      id: 'p1',
      nameFa: 'ظرف ۱ کیلوگرمی',
      itemType: 'primary_container',
      unit: 'عدد',
      unitsPerFinishedProduct: 1,
      unitCost: 2000,
      scrapRejectPercent: 0,
      totalQuantityRequired: 0,
      totalCost: 0,
      costPerFinishedUnit: 0
    }
  ];

  // Utilities: 100,000
  input.utilityCosts = {
    electricityKwh: 100,
    electricityRatePerKwh: 1000, // 100,000
    gasCubicMeters: 0,
    gasRatePerCubicMeter: 0,
    steamTons: 0,
    steamRatePerTon: 0,
    waterCubicMeters: 0,
    waterRatePerCubicMeter: 0,
    otherUtilityCost: 0,
    totalUtilityCost: 0
  };

  // Labor: 1 operator * 2 hours * 50,000 = 100,000
  input.laborCosts = {
    operatorCount: 1,
    hoursPerBatch: 2,
    hourlyWageRate: 50000,
    qaTechnicianHours: 0,
    qaHourlyRate: 0,
    totalLaborCost: 0
  };

  // Processing: 0
  input.processingCosts = {
    maintenanceCleaningCipCost: 0,
    lineWearTearCost: 0,
    totalProcessingCost: 0
  };

  // Direct costs sum = 1,000,000 + 200,000 + 100,000 + 100,000 = 1,400,000
  // Overhead: 10% of direct = 140,000
  input.overheadCosts = {
    mode: 'percentage_of_direct',
    overheadRatePercent: 10,
    fixedOverheadAmount: 0,
    totalOverheadCost: 0
  };

  // Pricing:
  // Target profit margin: 20%
  // Ex-factory = UnitCost / (1 - 0.20)
  input.pricingSettings = {
    targetProfitMarginPercent: 20,
    distributorMarginPercent: 10,
    retailerMarginPercent: 15,
    vatPercent: 10
  };

  const model = calculateComprehensiveBatchScaleAndCost(input);

  // Total COGS = 1,400,000 + 140,000 = 1,540,000 تومان
  assert(model.economics.totalCogsBatchCost === 1540000, `Expected total COGS 1,540,000, got ${model.economics.totalCogsBatchCost}`);

  // Cost per finished unit = 1,540,000 / 100 = 15,400 تومان
  assert(model.economics.costPerFinishedUnit === 15400, `Expected unit cost 15,400, got ${model.economics.costPerFinishedUnit}`);

  // Ex-factory price = 15,400 / (1 - 0.20) = 15,400 / 0.8 = 19,250 تومان
  assert(model.pricing.exFactoryPricePerUnit === 19250, `Expected Ex-Factory 19,250, got ${model.pricing.exFactoryPricePerUnit}`);

  // Gross profit per unit = 19,250 - 15,400 = 3,850 تومان
  assert(model.pricing.grossProfitPerUnit === 3850, `Expected gross profit 3,850, got ${model.pricing.grossProfitPerUnit}`);

  // Trace steps should exist and be > 8 steps
  assert(model.calculationTrace.length >= 8, `Calculation trace steps expected >= 8, got ${model.calculationTrace.length}`);
}

// Test 6: Non-100% Formulation Warning & Normalization
{
  const testIngredients: FormulationIngredient[] = [
    { id: '1', nameFa: 'ماده الف', category: 'solvent_base', percentage: 70.0, dryMatterPercent: 10, costPerKg: 1000 },
    { id: '2', nameFa: 'ماده ب', category: 'other', percentage: 20.0, dryMatterPercent: 10, costPerKg: 1000 }
  ];
  // Sum = 90%
  const input = getDefaultBatchScaleInput(testIngredients, 'dairy');
  const model = calculateComprehensiveBatchScaleAndCost(input);

  assert(model.validationWarnings.length > 0, `Expected validation warnings for 90% formulation sum, got ${model.validationWarnings.length}`);
  assert(model.validationWarnings[0].includes('کمتر از ۱۰۰٪') || model.validationWarnings[0].includes('90%'), 'Warning message indicates under 100%');
}

console.log('🎉 ALL UNIT TESTS COMPLETED SUCCESSFULLY WITH ZERO DEFECTS!');
