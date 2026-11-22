/**
 * Food Science AI - Smart Pre-Experiment Equipment Verification Engine (Part 35 of 40)
 * 
 * Generates an Equipment Checklist for any selected experiment.
 * Evaluates whether user equipment matches the experiment/standard requirements:
 * - نام (Name)
 * - نوع (Type / Category)
 * - ظرفیت (Capacity)
 * - دقت (Accuracy)
 * - Resolution (تفکیک‌پذیری)
 * - محدوده کاری (Working Range)
 * - وضعیت Calibration (Calibration Status)
 * - شرایط موردنیاز (Required Conditions)
 * - Source (منبع استخراج الزامات)
 * 
 * STRICT COMPLIANCE RULES:
 * 1. Result must be strictly: 'compatible' | 'not_compatible' | 'unknown'
 * 2. If information is insufficient: Output 'unknown'.
 * 3. NEVER certify compatibility based solely on instrument name.
 * 4. Display checklist before starting experiment.
 */

import {
  LaboratoryEquipment,
  EquipmentCategory,
  EquipmentChecklistItem,
  EquipmentCompatibilityVerdict,
  ParameterCompatibilityDetail,
  EQUIPMENT_CATEGORIES,
  CALIBRATION_STATUS_META
} from '../../types/laboratoryEquipment';
import { FoodExperiment, ExperimentEquipmentItem } from '../../types/foodExperiment';
import { detectEquipmentCategory } from './equipmentEngine';
import { BENCHMARK_LAB_EQUIPMENT } from '../storage/equipmentStorage';

/**
 * Normalizes Persian digits to Latin numbers
 */
export function normalizeDigits(str: string): string {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584))
    .replace(/٫/g, '.')
    .replace(/,/g, '.')
    .trim();
}

/**
 * Extracts numeric value and unit for accuracy/uncertainty (e.g. "0.0001 g", "±۰.۱ میلی‌گرم", "0.01 pH")
 */
export function parseToleranceValue(text?: string): { value?: number; unit?: string } {
  if (!text || typeof text !== 'string') return {};
  const normalized = normalizeDigits(text);

  // Look for decimals like 0.0001, 0.001, 0.01, 0.1, 1, 0.05
  const match = normalized.match(/(\d+\.?\d*)\s*(گرم|میلی‌گرم|کیلوگرم|میلی‌لیتر|g|mg|kg|ml|ph|°c|c|درجه)?/i);
  if (!match) return {};

  const num = parseFloat(match[1]);
  if (isNaN(num)) return {};

  let unit = (match[2] || '').toLowerCase();
  let convertedValue = num;

  // Normalize grams/milligrams: convert all mass to grams
  if (unit === 'mg' || unit === 'میلی‌گرم') {
    convertedValue = num / 1000;
    unit = 'g';
  } else if (unit === 'kg' || unit === 'کیلوگرم') {
    convertedValue = num * 1000;
    unit = 'g';
  }

  return { value: convertedValue, unit: unit || undefined };
}

/**
 * Extracts capacity value (e.g. "220 g", "۲۰۰۰ گرم", "25 mL")
 */
export function parseCapacityValue(text?: string): { value?: number; unit?: string } {
  if (!text || typeof text !== 'string') return {};
  const normalized = normalizeDigits(text);

  const match = normalized.match(/(\d+\.?\d*)\s*(گرم|کیلوگرم|میلی‌لیتر|لیتر|g|kg|ml|l)?/i);
  if (!match) return {};

  const num = parseFloat(match[1]);
  if (isNaN(num)) return {};

  let unit = (match[2] || '').toLowerCase();
  let convertedValue = num;

  if (unit === 'kg' || unit === 'کیلوگرم') {
    convertedValue = num * 1000;
    unit = 'g';
  } else if (unit === 'l' || unit === 'لیتر') {
    convertedValue = num * 1000;
    unit = 'ml';
  }

  return { value: convertedValue, unit: unit || undefined };
}

/**
 * Checks if a required temperature or working condition is covered by equipment operating range
 */
export function checkRangeCoverage(
  requiredRange?: string,
  userRange?: string
): EquipmentCompatibilityVerdict {
  if (!requiredRange || !userRange) return 'unknown';

  const normReq = normalizeDigits(requiredRange);
  const normUser = normalizeDigits(userRange);

  // Extract numbers from required (e.g. 105 or 550 or 20-25)
  const reqNumbers = normReq.match(/\d+\.?\d*/g)?.map(Number);
  const userNumbers = normUser.match(/\d+\.?\d*/g)?.map(Number);

  if (!reqNumbers || reqNumbers.length === 0 || !userNumbers || userNumbers.length === 0) {
    return 'unknown';
  }

  const reqMax = Math.max(...reqNumbers);
  const reqMin = Math.min(...reqNumbers);

  const userMax = Math.max(...userNumbers);
  const userMin = userNumbers.length > 1 ? Math.min(...userNumbers) : 0;

  if (reqMax > userMax || reqMin < userMin) {
    return 'not_compatible';
  }

  return 'compatible';
}

/**
 * Evaluates all technical parameters for a single equipment checklist item
 * Enforces the rule: NEVER certify based on name alone!
 */
export function evaluateEquipmentCompatibility(
  item: EquipmentChecklistItem,
  userEquipment?: LaboratoryEquipment
): {
  verdict: EquipmentCompatibilityVerdict;
  summary: string;
  details: ParameterCompatibilityDetail[];
} {
  const details: ParameterCompatibilityDetail[] = [];

  // If no user equipment has been selected or linked yet
  if (!userEquipment) {
    return {
      verdict: 'unknown',
      summary: 'دستگاهی از تجهیزات آزمایشگاه الصاق نشده است. اطلاعات برای تصمیم‌گیری کافی نیست (Unknown).',
      details: [
        {
          parameterName: 'accuracy',
          labelFa: 'بررسی دقت',
          verdict: 'unknown',
          required: item.requiredAccuracy,
          actual: undefined,
          explanation: 'دستگاه کاربر انتخاب نشده است؛ امکان مقایسه دقت وجود ندارد.'
        },
        {
          parameterName: 'calibration',
          labelFa: 'بررسی کالیبراسیون',
          verdict: 'unknown',
          required: item.requiredCalibration,
          actual: undefined,
          explanation: 'شناسنامه کالیبراسیون برای دستگاه نامشخص در دسترس نیست.'
        }
      ]
    };
  }

  // 1. Category / Type check
  const reqCategory = item.equipmentType;
  const userCategory = userEquipment.category;
  const categoryMatch = reqCategory === 'general_lab_equipment' || reqCategory === userCategory;

  if (!categoryMatch) {
    return {
      verdict: 'not_compatible',
      summary: `عدم تطابق نوع دستگاه: روش به «${item.equipmentTypeTitleFa}» نیاز دارد در حالی که دستگاه انتخابی از دسته «${EQUIPMENT_CATEGORIES[userCategory]?.titleFa || userCategory}» است.`,
      details: [
        {
          parameterName: 'capacity',
          labelFa: 'نوع دستگاه',
          verdict: 'not_compatible',
          required: item.equipmentTypeTitleFa,
          actual: EQUIPMENT_CATEGORIES[userCategory]?.titleFa || userCategory,
          explanation: 'نوع دستگاه با نیازمندی روش سازگار نیست.'
        }
      ]
    };
  }

  // 2. Accuracy Check (دقت)
  let accuracyVerdict: EquipmentCompatibilityVerdict = 'unknown';
  let accuracyExplanation = '';
  const reqAcc = item.requiredAccuracy;
  const userAcc = userEquipment.specifications?.accuracy;

  if (reqAcc && userAcc) {
    const parsedReq = parseToleranceValue(reqAcc);
    const parsedUser = parseToleranceValue(userAcc);

    if (parsedReq.value !== undefined && parsedUser.value !== undefined) {
      // In measurement, lower uncertainty / tolerance number means higher accuracy
      if (parsedUser.value > parsedReq.value) {
        accuracyVerdict = 'not_compatible';
        accuracyExplanation = `دقت دستگاه انتخاب‌شده (${userAcc}) از دقت الزامی روش (${reqAcc}) ضعیف‌تر است و خطای مجاز را افزایش می‌دهد.`;
      } else {
        accuracyVerdict = 'compatible';
        accuracyExplanation = `دقت دستگاه (${userAcc}) نیازمندی روش آزمون (${reqAcc}) را با موفقیت پوشش می‌دهد.`;
      }
    } else {
      // Numbers could not be reliably parsed
      accuracyVerdict = 'unknown';
      accuracyExplanation = 'مقادیر متنی دقت قابل تبدیل استاندارد نیستند؛ اطلاعات کافی برای تایید قطعی وجود ندارد.';
    }
  } else if (!reqAcc) {
    // Method doesn't require a strict numeric accuracy
    accuracyVerdict = 'compatible';
    accuracyExplanation = 'دقت عددی خاصی در استاندارد برای این تجهیز قید نشده است.';
  } else {
    // Method requires accuracy, but user equipment has undefined accuracy
    accuracyVerdict = 'unknown';
    accuracyExplanation = 'دقت دستگاه در شناسنامه تجهیز ثبت نشده است. صرفاً بر اساس نام دستگاه نمی‌توان انطباق را تأیید کرد (Unknown).';
  }

  details.push({
    parameterName: 'accuracy',
    labelFa: 'دقت دستگاه (Accuracy)',
    verdict: accuracyVerdict,
    required: reqAcc || 'تعریف‌نشده در روش',
    actual: userAcc || 'ثبت‌نشده در شناسنامه دستگاه',
    explanation: accuracyExplanation
  });

  // 3. Resolution Check (Resolution)
  let resolutionVerdict: EquipmentCompatibilityVerdict = 'unknown';
  let resolutionExplanation = '';
  const reqRes = item.requiredResolution;
  const userRes = userEquipment.specifications?.resolution;

  if (reqRes && userRes) {
    const pReq = parseToleranceValue(reqRes);
    const pUser = parseToleranceValue(userRes);

    if (pReq.value !== undefined && pUser.value !== undefined) {
      if (pUser.value > pReq.value) {
        resolutionVerdict = 'not_compatible';
        resolutionExplanation = `تفکیک‌پذیری دستگاه (${userRes}) درشت‌تر از تفکیک‌پذیری الزامی روش (${reqRes}) است.`;
      } else {
        resolutionVerdict = 'compatible';
        resolutionExplanation = `تفکیک‌پذیری (${userRes}) با الزام روش (${reqRes}) مطابقت دارد.`;
      }
    } else {
      resolutionVerdict = 'unknown';
      resolutionExplanation = 'اطلاعات تفکیک‌پذیری نامشخص است.';
    }
  } else if (!reqRes) {
    resolutionVerdict = 'compatible';
    resolutionExplanation = 'تفکیک‌پذیری اختصاصی در روش الزامی نشده است.';
  } else {
    resolutionVerdict = 'unknown';
    resolutionExplanation = 'رزولوشن دستگاه کاربر مشخص نیست (Unknown).';
  }

  details.push({
    parameterName: 'resolution',
    labelFa: 'تفکیک‌پذیری (Resolution)',
    verdict: resolutionVerdict,
    required: reqRes || 'عمومی',
    actual: userRes || 'ثبت‌نشده',
    explanation: resolutionExplanation
  });

  // 4. Capacity Check (ظرفیت)
  let capacityVerdict: EquipmentCompatibilityVerdict = 'unknown';
  let capacityExplanation = '';
  const reqCap = item.requiredCapacity;
  const userCap = userEquipment.specifications?.capacity;

  if (reqCap && userCap) {
    const pReq = parseCapacityValue(reqCap);
    const pUser = parseCapacityValue(userCap);

    if (pReq.value !== undefined && pUser.value !== undefined) {
      if (pUser.value < pReq.value) {
        capacityVerdict = 'not_compatible';
        capacityExplanation = `ظرفیت دستگاه (${userCap}) کمتر از ظرفیت موردنیاز آزمون (${reqCap}) است.`;
      } else {
        capacityVerdict = 'compatible';
        capacityExplanation = `ظرفیت دستگاه (${userCap}) پاسخگوی نیاز آزمون (${reqCap}) است.`;
      }
    } else {
      capacityVerdict = 'unknown';
      capacityExplanation = 'اطلاعات عددی ظرفیت قابل مقایسه قطعی نیست.';
    }
  } else if (!reqCap) {
    capacityVerdict = 'compatible';
    capacityExplanation = 'ظرفیت مشخصی در دستورالعمل آزمون شرط نشده است.';
  } else {
    capacityVerdict = 'unknown';
    capacityExplanation = 'ظرفیت دستگاه در مشخصات قید نشده است.';
  }

  details.push({
    parameterName: 'capacity',
    labelFa: 'ظرفیت تجهیز (Capacity)',
    verdict: capacityVerdict,
    required: reqCap || 'عمومی',
    actual: userCap || 'ثبت‌نشده',
    explanation: capacityExplanation
  });

  // 5. Working Range Check (محدوده کاری)
  let rangeVerdict: EquipmentCompatibilityVerdict = 'unknown';
  let rangeExplanation = '';
  const reqRange = item.requiredWorkingRange;
  const userRange = userEquipment.specifications?.measurementRange || userEquipment.specifications?.operatingTemperature;

  if (reqRange && userRange) {
    rangeVerdict = checkRangeCoverage(reqRange, userRange);
    rangeExplanation = rangeVerdict === 'compatible'
      ? `محدوده کاری دستگاه (${userRange}) شرایط آزمون (${reqRange}) را در بر می‌گیرد.`
      : rangeVerdict === 'not_compatible'
      ? `محدوده کاری دستگاه (${userRange}) پاسخگوی شرایط آزمون (${reqRange}) نیست.`
      : 'اطلاعات کافی برای بررسی محدوده کاری وجود ندارد.';
  } else if (!reqRange) {
    rangeVerdict = 'compatible';
    rangeExplanation = 'محدوده دمایی/کاری ویژه‌ای خارج از دمای متعارف آزمایشگاه تعیین نشده است.';
  } else {
    rangeVerdict = 'unknown';
    rangeExplanation = 'محدوده کاری دستگاه در مشخصات ثبت نشده است (Unknown).';
  }

  details.push({
    parameterName: 'workingRange',
    labelFa: 'محدوده کاری (Working Range)',
    verdict: rangeVerdict,
    required: reqRange || 'دمای معمول آزمایشگاه',
    actual: userRange || 'ثبت‌نشده',
    explanation: rangeExplanation
  });

  // 6. Calibration Check (وضعیت Calibration)
  let calVerdict: EquipmentCompatibilityVerdict = 'unknown';
  let calExplanation = '';
  const calStatus = userEquipment.calibrationStatus;

  if (calStatus === 'expired') {
    calVerdict = 'not_compatible';
    calExplanation = 'گواهی کالیبراسیون دستگاه منقضی شده است. طبق ایزو ۱۷۰۲۵ استفاده از آن مجاز نیست.';
  } else if (calStatus === 'valid' || calStatus === 'calibrated_in_house') {
    calVerdict = 'compatible';
    calExplanation = `وضعیت کالیبراسیون معتبر است (${CALIBRATION_STATUS_META[calStatus]?.labelFa || 'تاییدشده'}).`;
  } else if (calStatus === 'not_required') {
    calVerdict = 'compatible';
    calExplanation = 'این تجهیز به کالیبراسیون دوره‌ای نیاز ندارد.';
  } else if (calStatus === 'expiring_soon') {
    calVerdict = 'compatible';
    calExplanation = 'کالیبراسیون معتبر است اما کمتر از ۳۰ روز تا انقضا باقی مانده است.';
  } else {
    calVerdict = 'unknown';
    calExplanation = 'وضعیت کالیبراسیون دستگاه نامشخص است.';
  }

  details.push({
    parameterName: 'calibration',
    labelFa: 'وضعیت کالیبراسیون (Calibration)',
    verdict: calVerdict,
    required: item.requiredCalibration || 'کالیبره و دارای برچسب معتبر',
    actual: calStatus ? CALIBRATION_STATUS_META[calStatus]?.labelFa : 'نامشخص',
    explanation: calExplanation
  });

  // 7. Overall Verdict Calculation
  // RULE:
  // - If ANY check is 'not_compatible' -> Overall 'not_compatible'
  // - Else if ANY check is 'unknown' -> Overall 'unknown' (never assume!)
  // - Only if ALL are 'compatible' -> Overall 'compatible'
  let overallVerdict: EquipmentCompatibilityVerdict = 'compatible';
  let summary = '';

  const hasNotCompatible = details.some((d) => d.verdict === 'not_compatible');
  const hasUnknown = details.some((d) => d.verdict === 'unknown');

  if (hasNotCompatible) {
    overallVerdict = 'not_compatible';
    const failedDetails = details.filter((d) => d.verdict === 'not_compatible').map((d) => d.explanation);
    summary = `عدم انطباق با استاندارد (Not Compatible): ${failedDetails.join(' | ')}`;
  } else if (hasUnknown) {
    overallVerdict = 'unknown';
    const unknownDetails = details.filter((d) => d.verdict === 'unknown').map((d) => d.labelFa);
    summary = `اطلاعات ناکافی برای تایید تطابق (Unknown): مشخصات [${unknownDetails.join('، ')}] نیازمند تکمیل اطلاعات یا استعلام است؛ صرفاً بر اساس نام دستگاه نمی‌توان صحت را تایید کرد.`;
  } else {
    overallVerdict = 'compatible';
    summary = 'تجهیز انتخابی با کلیه نیازمندی‌ها، دقت، ظرفیت و کالیبراسیون روش آزمون مطابقت کامل دارد (Compatible).';
  }

  return {
    verdict: overallVerdict,
    summary,
    details
  };
}

/**
 * Parses requirements from text descriptions in standard procedure steps or equipment items
 */
function extractSpecsFromEquipmentItem(
  item: ExperimentEquipmentItem,
  experiment: FoodExperiment
): {
  capacity?: string;
  accuracy?: string;
  resolution?: string;
  workingRange?: string;
  requiredConditions?: string;
  source?: string;
} {
  const specText = item.specification || '';
  const nameText = item.name || '';
  const combined = `${nameText} ${specText}`;

  let accuracy: string | undefined = undefined;
  let capacity: string | undefined = undefined;
  let resolution: string | undefined = undefined;
  let workingRange: string | undefined = undefined;

  // Accuracy extraction
  const accMatch = combined.match(/(?:دقت|خطا|عدم قطعیت|accuracy|precision)\s*(?:±|برابر با|معادل)?\s*([۰-۹\d\.\s]+(?:گرم|میلی‌گرم|g|mg|ph|درجه|°c))/i)
    || combined.match(/(\d+\.?\d*)\s*(?:گرم|g|mg)\s*دقت/i)
    || combined.match(/(۰\.[۰-۹]+|0\.\d+)\s*(?:گرم|g|mg|ph)/i);

  if (accMatch) {
    accuracy = accMatch[0].trim();
  }

  // Capacity extraction
  const capMatch = combined.match(/(?:ظرفیت|حجم|capacity)\s*(?:حداقل|تا|معادل)?\s*([۰-۹\d\.\s]+(?:گرم|کیلوگرم|میلی‌لیتر|g|kg|ml|l))/i)
    || combined.match(/(\d+\.?\d*)\s*(?:میلی‌لیتر|ml|گرم|g)\s*(?:ظرفیت)?/i);

  if (capMatch) {
    capacity = capMatch[0].trim();
  }

  // Range extraction (e.g. temperature in oven/furnace)
  if (experiment.environmentalConditions?.temperatureRange) {
    workingRange = experiment.environmentalConditions.temperatureRange;
  } else {
    const rangeMatch = combined.match(/(\d+\s*(?:تا|الی|-)\s*\d+\s*(?:درجه|°c|ph))/i)
      || combined.match(/(\d+\s*(?:درجه|°c))/i);
    if (rangeMatch) {
      workingRange = rangeMatch[0].trim();
    }
  }

  // Resolution extraction
  const resMatch = combined.match(/(?:تفکیک‌پذیری|resolution|درجه‌بندی)\s*([۰-۹\d\.\s]+(?:گرم|میلی‌لیتر|g|ml|ph)?)/i);
  if (resMatch) {
    resolution = resMatch[1].trim();
  }

  // Required conditions
  const conditions = experiment.environmentalConditions?.ventilationRequirement
    || experiment.environmentalConditions?.specialNotes
    || (combined.includes('کلاس A') ? 'شیشه‌آلات کالیبره کلاس A با رواداری استاندارد' : undefined);

  // Source citation
  const source = (item as any).source
    || (experiment.standardReference
      ? `${experiment.standardReference.organization} ${experiment.standardReference.standardNumber}`
      : 'استاندارد مرجع روش آزمون');

  return {
    capacity,
    accuracy,
    resolution,
    workingRange,
    requiredConditions: conditions,
    source
  };
}

/**
 * Builds the comprehensive Smart Equipment Checklist for any selected experiment.
 * Automatically attempts to pair with available laboratory inventory.
 */
export function buildEquipmentChecklistForExperiment(
  experiment: FoodExperiment,
  inventory: LaboratoryEquipment[] = BENCHMARK_LAB_EQUIPMENT
): EquipmentChecklistItem[] {
  if (!experiment) return [];

  const rawEquipmentList = experiment.equipment || [];
  const checklist: EquipmentChecklistItem[] = [];

  rawEquipmentList.forEach((rawItem: any, idx: number) => {
    const itemObj: ExperimentEquipmentItem = typeof rawItem === 'string'
      ? { name: rawItem, isRequired: true }
      : rawItem;

    const detectedType = detectEquipmentCategory(itemObj.name);
    const typeMeta = EQUIPMENT_CATEGORIES[detectedType] || {
      titleFa: 'تجهیز عمومی آزمایشگاه',
      titleEn: 'General Equipment'
    };

    const extractedSpecs = extractSpecsFromEquipmentItem(itemObj, experiment);

    // Look for best candidate match in inventory
    const matchedUserEq = inventory.find((eq) => {
      if (eq.category === detectedType) return true;
      const eqName = eq.nameFa.toLowerCase();
      const reqName = itemObj.name.toLowerCase();
      return eqName.includes(reqName) || reqName.includes(eqName);
    });

    const checklistItemDraft: EquipmentChecklistItem = {
      id: `chk_${experiment.id}_${idx}_${detectedType}`,
      equipmentName: itemObj.name,
      equipmentType: detectedType,
      equipmentTypeTitleFa: typeMeta.titleFa,
      
      requiredCapacity: extractedSpecs.capacity,
      requiredAccuracy: extractedSpecs.accuracy,
      requiredResolution: extractedSpecs.resolution,
      requiredWorkingRange: extractedSpecs.workingRange,
      requiredCalibration: itemObj.calibrationRequirement || 'گواهی کالیبراسیون معتبر طبق ISO 17025',
      requiredConditions: extractedSpecs.requiredConditions || 'محیط تمیز و استاندارد آزمایشگاهی',
      source: extractedSpecs.source,
      isRequired: itemObj.isRequired ?? true,

      userEquipmentId: matchedUserEq?.id,
      userEquipmentCode: matchedUserEq?.code,
      userEquipmentName: matchedUserEq?.nameFa,
      userEquipmentType: matchedUserEq?.category,
      userCapacity: matchedUserEq?.specifications?.capacity,
      userAccuracy: matchedUserEq?.specifications?.accuracy,
      userResolution: matchedUserEq?.specifications?.resolution,
      userWorkingRange: matchedUserEq?.specifications?.measurementRange || matchedUserEq?.specifications?.operatingTemperature,
      userCalibrationStatus: matchedUserEq?.calibrationStatus,
      userCalibrationProvider: matchedUserEq?.calibrationProvider,
      userLastCalibrationDate: matchedUserEq?.lastCalibrationDate,
      userNextCalibrationDate: matchedUserEq?.nextCalibrationDate,
      userSource: matchedUserEq?.sources?.[0]?.fullTitle || matchedUserEq?.sources?.[0]?.citationShort || 'شناسنامه تجهیزات ثبت‌شده آزمایشگاه',

      compatibility: 'unknown',
      compatibilitySummary: '',
      parameterDetails: [],
      isVerifiedByOperator: false
    };

    // Run deterministic compatibility evaluation
    const evalResult = evaluateEquipmentCompatibility(checklistItemDraft, matchedUserEq);
    checklistItemDraft.compatibility = evalResult.verdict;
    checklistItemDraft.compatibilitySummary = evalResult.summary;
    checklistItemDraft.parameterDetails = evalResult.details;

    checklist.push(checklistItemDraft);
  });

  return checklist;
}

/**
 * Re-evaluates an item when the user selects a different equipment from inventory or alters inputs
 */
export function updateChecklistItemWithUserEquipment(
  item: EquipmentChecklistItem,
  userEquipment?: LaboratoryEquipment
): EquipmentChecklistItem {
  const updated: EquipmentChecklistItem = {
    ...item,
    userEquipmentId: userEquipment?.id,
    userEquipmentCode: userEquipment?.code,
    userEquipmentName: userEquipment?.nameFa,
    userEquipmentType: userEquipment?.category,
    userCapacity: userEquipment?.specifications?.capacity,
    userAccuracy: userEquipment?.specifications?.accuracy,
    userResolution: userEquipment?.specifications?.resolution,
    userWorkingRange: userEquipment?.specifications?.measurementRange || userEquipment?.specifications?.operatingTemperature,
    userCalibrationStatus: userEquipment?.calibrationStatus,
    userCalibrationProvider: userEquipment?.calibrationProvider,
    userLastCalibrationDate: userEquipment?.lastCalibrationDate,
    userNextCalibrationDate: userEquipment?.nextCalibrationDate,
    userSource: userEquipment?.sources?.[0]?.fullTitle || userEquipment?.sources?.[0]?.citationShort || 'شناسنامه تجهیزات ثبت‌شده آزمایشگاه'
  };

  const evalResult = evaluateEquipmentCompatibility(updated, userEquipment);
  updated.compatibility = evalResult.verdict;
  updated.compatibilitySummary = evalResult.summary;
  updated.parameterDetails = evalResult.details;

  return updated;
}
