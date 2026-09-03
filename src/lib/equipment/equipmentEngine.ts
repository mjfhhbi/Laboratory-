/**
 * Food Science AI - Specialized Laboratory Equipment Engine
 * Handles experiment-equipment requirement resolution, specification validation,
 * and calibration readiness calculations.
 * 
 * STRICT COMPLIANCE RULE:
 * If accuracy, capacity, or specifications are NOT documented in the official source/standard,
 * the engine MUST NOT guess or invent numbers. It marks them explicitly as 'نامشخص در استاندارد'
 * or 'مشخصات عمومی بر مبنای روش'.
 */

import {
  LaboratoryEquipment,
  EquipmentCategory,
  ExperimentEquipmentRequirement,
  EQUIPMENT_CATEGORIES
} from '../../types/laboratoryEquipment';
import { FoodExperiment, ExperimentEquipmentItem } from '../../types/foodExperiment';

/**
 * Keyword-based category detector for laboratory equipment names in Persian and English.
 */
export function detectEquipmentCategory(name: string): EquipmentCategory {
  const normalized = (name || '').toLowerCase().trim();

  if (normalized.includes('ترازو') || normalized.includes('balance') || normalized.includes('scale') || normalized.includes('وزن')) {
    return 'balance';
  }
  if (normalized.includes('آون') || normalized.includes('oven') || normalized.includes('خشک‌کن') || normalized.includes('خشک کن')) {
    return 'oven';
  }
  if (normalized.includes('کوره') || normalized.includes('furnace') || normalized.includes('muffle') || normalized.includes('خاکستر')) {
    return 'muffle_furnace';
  }
  if (normalized.includes('ph') || normalized.includes('پی‌اچ') || normalized.includes('الکترود') || normalized.includes('پتانسیومتر')) {
    return 'ph_meter';
  }
  if (normalized.includes('اسپکتروفتومتر') || normalized.includes('spectrophotometer') || normalized.includes('طیف‌سنج') || normalized.includes('uv-vis') || normalized.includes('جذب سنج')) {
    return 'spectrophotometer';
  }
  if (normalized.includes('سانتریفیوژ') || normalized.includes('centrifuge') || normalized.includes('ژربیر') || normalized.includes('gerber')) {
    return 'centrifuge';
  }
  if (normalized.includes('انکوباتور') || normalized.includes('incubator') || normalized.includes('گرم‌خانه') || normalized.includes('گرم خانه') || normalized.includes('bod')) {
    return 'incubator';
  }
  if (normalized.includes('اتوکلاو') || normalized.includes('autoclave') || normalized.includes('سترون‌ساز') || normalized.includes('استریلایزر')) {
    return 'autoclave';
  }
  if (normalized.includes('بورت') || normalized.includes('burette') || normalized.includes('تیتراسیون') || normalized.includes('دیسپنسر')) {
    return 'burette';
  }
  if (normalized.includes('پیپت') || normalized.includes('pipette') || normalized.includes('سمپلر') || normalized.includes('sampler') || normalized.includes('میکروپیپت')) {
    return 'pipette';
  }
  if (normalized.includes('هود') || normalized.includes('hood') || normalized.includes('لامینار') || normalized.includes('laminar') || normalized.includes('تهویه')) {
    return 'hood';
  }
  if (normalized.includes('دسیکاتور') || normalized.includes('desiccator') || normalized.includes('رطوبت‌گیر') || normalized.includes('سیلیکاژل')) {
    return 'desiccator';
  }
  if (normalized.includes('رفراکتومتر') || normalized.includes('refractometer') || normalized.includes('بریکس') || normalized.includes('brix') || normalized.includes('ضریب شکست')) {
    return 'refractometer';
  }
  if (normalized.includes('ویسکومتر') || normalized.includes('viscometer') || normalized.includes('رئومتر') || normalized.includes('بروکفیلد') || normalized.includes('brookfield')) {
    return 'viscometer';
  }
  if (normalized.includes('بافت‌سنج') || normalized.includes('بافت سنج') || normalized.includes('texture') || normalized.includes('tpa') || normalized.includes('نفوذسنج')) {
    return 'texture_analyzer';
  }
  if (
    normalized.includes('میکروبی') ||
    normalized.includes('میکروسکوپ') ||
    normalized.includes('کلنی') ||
    normalized.includes('استومیکر') ||
    normalized.includes('لوپ') ||
    normalized.includes('پتری') ||
    normalized.includes('بونزن') ||
    normalized.includes('microscop') ||
    normalized.includes('stomacher')
  ) {
    return 'microbiology_equipment';
  }

  return 'general_lab_equipment';
}

/**
 * Extracts and maps equipment requirements from a FoodExperiment protocol.
 * Resolves: آزمایش ← تجهیزات موردنیاز ← مشخصات موردنیاز
 * 
 * Guarantees no fabricated/guessed specifications if missing in the standard.
 */
export function resolveExperimentEquipmentRequirements(
  experiment: FoodExperiment,
  availableEquipmentCatalog: LaboratoryEquipment[] = []
): ExperimentEquipmentRequirement[] {
  if (!experiment || !experiment.equipment || !Array.isArray(experiment.equipment)) {
    return [];
  }

  return experiment.equipment.map((item: ExperimentEquipmentItem, index: number) => {
    const category = detectEquipmentCategory(item.name);
    
    // Attempt exact or fuzzy match in existing equipment catalog
    const matched = availableEquipmentCatalog.find(eq => {
      if (eq.code && item.id && eq.code === item.id) return true;
      const eqName = eq.nameFa.toLowerCase();
      const reqName = item.name.toLowerCase();
      return eqName.includes(reqName) || reqName.includes(eqName) || (eq.category === category);
    });

    const hasExplicitSpec = Boolean(
      item.specification && 
      item.specification.trim() !== '' && 
      !item.specification.includes('نامشخص')
    );

    return {
      experimentId: experiment.id,
      experimentCode: experiment.code,
      experimentTitleFa: experiment.titleFa,
      equipmentName: item.name,
      equipmentCategory: category,
      matchedEquipmentId: matched?.id,
      requiredSpecification: hasExplicitSpec 
        ? item.specification 
        : undefined, // Do not guess if not provided
      isSpecificationVerifiedInStandard: Boolean(experiment.isVerifiedProtocol && hasExplicitSpec),
      calibrationRequirement: item.calibrationRequirement || (category === 'balance' || category === 'ph_meter' || category === 'spectrophotometer' ? 'نیازمند کالیبراسیون رسمی پیش از آزمون' : undefined),
      isRequired: item.isRequired ?? true
    };
  });
}

/**
 * Find all experiments that require a specific equipment category or item.
 */
export function findExperimentsUsingEquipment(
  equipment: LaboratoryEquipment | EquipmentCategory,
  allExperiments: FoodExperiment[] = []
): Array<{
  experiment: FoodExperiment;
  requiredItem: ExperimentEquipmentItem;
  hasSpecificAccuracy: boolean;
}> {
  const targetCategory: EquipmentCategory = typeof equipment === 'string' 
    ? equipment 
    : equipment.category;

  const targetName = typeof equipment === 'string' ? '' : equipment.nameFa.toLowerCase();

  const results: Array<{
    experiment: FoodExperiment;
    requiredItem: ExperimentEquipmentItem;
    hasSpecificAccuracy: boolean;
  }> = [];

  for (const exp of allExperiments) {
    if (!exp.equipment || !Array.isArray(exp.equipment)) continue;

    for (const item of exp.equipment) {
      const itemCat = detectEquipmentCategory(item.name);
      const isNameMatch = targetName ? item.name.toLowerCase().includes(targetName) : false;

      if (itemCat === targetCategory || isNameMatch) {
        results.push({
          experiment: exp,
          requiredItem: item,
          hasSpecificAccuracy: Boolean(item.specification && item.specification.trim() !== '')
        });
        break; // one match per experiment is sufficient
      }
    }
  }

  return results;
}

/**
 * Validates whether the lab equipment currently meets calibration requirements for an experiment.
 */
export function checkEquipmentCalibrationReadiness(equipment: LaboratoryEquipment): {
  isReady: boolean;
  statusText: string;
  badgeColor: string;
  warning?: string;
} {
  if (!equipment) {
    return {
      isReady: false,
      statusText: 'دستگاه تعریف نشده است',
      badgeColor: 'bg-stone-100 text-stone-700'
    };
  }

  if (equipment.calibrationStatus === 'not_required') {
    return {
      isReady: true,
      statusText: 'عدم نیاز به کالیبراسیون ادواری',
      badgeColor: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
    };
  }

  if (equipment.calibrationStatus === 'expired') {
    return {
      isReady: false,
      statusText: 'کالیبراسیون منقضی شده',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      warning: 'استفاده از این دستگاه در آزمون‌های استانداردهای اجباری مجاز نیست مگر پس از کالیبراسیون مجدد.'
    };
  }

  if (equipment.calibrationStatus === 'expiring_soon') {
    return {
      isReady: true,
      statusText: 'نزدیک به انقضا (کمتر از ۳۰ روز)',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      warning: 'تاریخ کالیبراسیون به زودی به پایان می‌رسد. هماهنگی با آزمایشگاه کالیبراسیون توصیه می‌شود.'
    };
  }

  if (equipment.calibrationStatus === 'calibrated_in_house') {
    return {
      isReady: true,
      statusText: 'صحت‌سنجی داخلی',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
    };
  }

  return {
    isReady: true,
    statusText: 'کالیبره و معتبر',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
  };
}
