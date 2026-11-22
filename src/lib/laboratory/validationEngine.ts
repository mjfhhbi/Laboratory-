/**
 * Food Science AI - Digital Laboratory Validation Engine
 * 
 * Deterministic validation engine that strictly uses standard-defined acceptable limits,
 * physical bounds, data types, expected units, and repeatability criteria.
 * 
 * DOES NOT USE AI GUESSES OR HALLUCINATED CONSTANTS.
 */

import {
  LabParameterDefinition,
  LabParameterType,
  LabRecordedParameterValue,
  LabStepDefinition,
  LabStepRunData,
  LabReplicateRun,
  LabSession,
  LabRepeatabilityAnalysis,
  LabStandardConformance
} from '../../types/laboratory';
import { AcceptableLimitSpecification, FoodStandard } from '../../types/foodStandard';

export interface ParameterValidationResult {
  isValid: boolean;
  parsedValue: any;
  errors: string[];
  warnings: string[];
}

export interface StepValidationResult {
  isValid: boolean;
  canAdvanceToNext: boolean;
  blockingReasons: string[];
  errors: string[];
  warnings: string[];
}

/**
 * Standard unit definitions and labels for display
 */
export const PARAM_TYPE_LABELS: Record<LabParameterType, { fa: string; defaultUnit: string; icon: string }> = {
  numeric: { fa: 'عدد محاسباتی', defaultUnit: '', icon: 'Hash' },
  temperature: { fa: 'دما', defaultUnit: '°C', icon: 'Thermometer' },
  time_duration: { fa: 'مدت زمان', defaultUnit: 'min', icon: 'Timer' },
  mass_weight: { fa: 'وزن / جرم', defaultUnit: 'g', icon: 'Scale' },
  volume: { fa: 'حجم مایع', defaultUnit: 'mL', icon: 'Pipette' },
  ph_level: { fa: 'سطح pH', defaultUnit: 'pH', icon: 'FlaskConical' },
  refractive_index: { fa: 'بریکس / ضریب شکست', defaultUnit: '°Brix', icon: 'Eye' },
  absorbance: { fa: 'جذب نوری (Abs)', defaultUnit: 'Abs', icon: 'SunMedium' },
  percentage: { fa: 'درصد وزنی/حجمی', defaultUnit: '%', icon: 'Percent' },
  count_cfu: { fa: 'شمارش کلنی میکروبی', defaultUnit: 'CFU/g', icon: 'Binary' },
  boolean_detected: { fa: 'مشاهده / ردیابی کیفی', defaultUnit: 'کیفی', icon: 'CheckSquare' },
  text_observation: { fa: 'مشاهده متنی / توصیفی', defaultUnit: '', icon: 'FileText' }
};

/**
 * Parses numeric limits from standard text (e.g. "حداکثر ۱۰", "حداقل ۳.۲", "۵.۵ الی ۶.۸", "max 15.0")
 */
export function parseStandardLimitRule(limitText: string): {
  type: 'max' | 'min' | 'range' | 'exact' | 'qualitative';
  min?: number;
  max?: number;
  exact?: number;
  rawText: string;
} {
  if (!limitText || typeof limitText !== 'string') {
    return { type: 'qualitative', rawText: limitText || '' };
  }

  const normalized = limitText
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728)) // Persian to Latin digits
    .replace(/٫/g, '.')
    .replace(/,/g, '.')
    .trim();

  // Range detection: "6.5 - 7.5" or "6.5 تا 7.5" or "between 6.5 and 7.5"
  const rangeMatch = normalized.match(/(-?\d+\.?\d*)\s*(?:-|تا|الی|to)\s*(-?\d+\.?\d*)/i);
  if (rangeMatch) {
    const val1 = parseFloat(rangeMatch[1]);
    const val2 = parseFloat(rangeMatch[2]);
    return {
      type: 'range',
      min: Math.min(val1, val2),
      max: Math.max(val1, val2),
      rawText: limitText
    };
  }

  // Maximum detection: "حداکثر 10" or "max 10" or "<= 10" or "< 10"
  const maxMatch = normalized.match(/(?:حداکثر|بیشینه|max|maximum|<=?)\s*:?\s*(-?\d+\.?\d*)/i);
  if (maxMatch) {
    return {
      type: 'max',
      max: parseFloat(maxMatch[1]),
      rawText: limitText
    };
  }

  // Minimum detection: "حداقل 3.2" or "کمینه" or "min" or ">= 3.2"
  const minMatch = normalized.match(/(?:حداقل|کمینه|min|minimum|>=?)\s*:?\s*(-?\d+\.?\d*)/i);
  if (minMatch) {
    return {
      type: 'min',
      min: parseFloat(minMatch[1]),
      rawText: limitText
    };
  }

  // Pure single numeric value
  const singleNumber = normalized.match(/^[-+]?[0-9]*\.?[0-9]+$/);
  if (singleNumber) {
    return {
      type: 'exact',
      exact: parseFloat(singleNumber[0]),
      rawText: limitText
    };
  }

  return { type: 'qualitative', rawText: limitText };
}

/**
 * Validates a single parameter input value against its definition and standard limit
 */
export function validateParameterValue(
  paramDef: LabParameterDefinition,
  rawValue: any,
  standardLimit?: AcceptableLimitSpecification
): ParameterValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required
  const isEmpty = rawValue === undefined || rawValue === null || (typeof rawValue === 'string' && rawValue.trim() === '');
  if (paramDef.required && isEmpty) {
    errors.push(`فیلد «${paramDef.nameFa}» الزامی است و مقدار آن باید ثبت شود.`);
    return { isValid: false, parsedValue: rawValue, errors, warnings };
  }

  if (isEmpty) {
    return { isValid: true, parsedValue: rawValue, errors: [], warnings: [] };
  }

  let parsedValue: any = rawValue;

  // Type-specific validations
  switch (paramDef.paramType) {
    case 'numeric':
    case 'temperature':
    case 'time_duration':
    case 'mass_weight':
    case 'volume':
    case 'ph_level':
    case 'refractive_index':
    case 'absorbance':
    case 'percentage':
    case 'count_cfu': {
      // Normalize Persian numerals
      let numStr = String(rawValue)
        .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
        .replace(/٫/g, '.')
        .trim();

      const num = Number(numStr);
      if (isNaN(num)) {
        errors.push(`مقدار ورودی برای «${paramDef.nameFa}» باید یک عدد معتبر باشد.`);
        return { isValid: false, parsedValue: rawValue, errors, warnings };
      }
      parsedValue = num;

      // Physical Laws & Domain Boundaries
      if (paramDef.paramType === 'ph_level') {
        if (num < 0 || num > 14) {
          errors.push('دامنه مقیاس pH به لحاظ شیمیایی باید در بازه ۰ تا ۱۴ باشد.');
        } else if (num < 1.0 || num > 13.0) {
          warnings.push('مقدار pH در محدوده بسیار اسیدی یا بازی شدید قرار دارد، کالیبراسیون الکترود را بررسی کنید.');
        }
      }

      if (paramDef.paramType === 'mass_weight') {
        if (num < 0) {
          errors.push('جرم یا وزن نمونه نمی‌تواند منفی باشد.');
        } else if (num === 0 && paramDef.required) {
          warnings.push('وزن ثبت‌شده صفر است؛ از تراز بودن ترازو و توزین صحیح نمونه مطمئن شوید.');
        }
      }

      if (paramDef.paramType === 'volume') {
        if (num < 0) {
          errors.push('حجم مایع یا تیترانت نمی‌تواند عدد منفی باشد.');
        }
      }

      if (paramDef.paramType === 'time_duration') {
        if (num < 0) {
          errors.push('مدت زمان آزمون نمی‌تواند عدد منفی باشد.');
        }
      }

      if (paramDef.paramType === 'percentage') {
        if (num < 0 || num > 100) {
          errors.push('درصد وزنی یا حجمی باید در بازه ۰ تا ۱۰۰ درصد باشد.');
        }
      }

      if (paramDef.paramType === 'temperature') {
        if (num < -273.15) {
          errors.push('دما نمی‌تواند از صفر مطلق (-۲۷۳.۱۵ °C) کمتر باشد.');
        }
      }

      if (paramDef.paramType === 'absorbance') {
        if (num < -0.1) {
          warnings.push('جذب نوری منفی ثبت شده است؛ بلانک دستگاه اسپکتروفتومتر را مجدداً صفر کنید.');
        } else if (num > 3.0) {
          warnings.push('جذب نوری بیش از ۳.۰ است؛ در این محدوده انحراف از قانون بیر-لامبرت رخ می‌دهد و رقیق‌سازی نمونه توصیه می‌شود.');
        }
      }

      // Min / Max bounds from parameter definition
      if (paramDef.minValue !== undefined && num < paramDef.minValue) {
        errors.push(`مقدار «${paramDef.nameFa}» نباید کمتر از ${paramDef.minValue} ${paramDef.expectedUnit} باشد.`);
      }
      if (paramDef.maxValue !== undefined && num > paramDef.maxValue) {
        errors.push(`مقدار «${paramDef.nameFa}» نباید بیشتر از ${paramDef.maxValue} ${paramDef.expectedUnit} باشد.`);
      }

      // Standard-Driven Acceptable Limit evaluation (strictly from Standard, no AI guesses)
      const limitSpec = standardLimit || (paramDef.expectedLimitText ? { limitSpecification: paramDef.expectedLimitText } : undefined);
      if (limitSpec && limitSpec.limitSpecification) {
        const rule = parseStandardLimitRule(limitSpec.limitSpecification);
        if (rule.type === 'max' && rule.max !== undefined && num > rule.max) {
          warnings.push(
            `هشدار استاندارد: مقدار سنجیده‌شده (${num}) از حد مجاز استاندارد (${limitSpec.limitSpecification}) فراتر رفته است.`
          );
        } else if (rule.type === 'min' && rule.min !== undefined && num < rule.min) {
          warnings.push(
            `هشدار استاندارد: مقدار سنجیده‌شده (${num}) از حداقل الزامی استاندارد (${limitSpec.limitSpecification}) کمتر است.`
          );
        } else if (rule.type === 'range' && rule.min !== undefined && rule.max !== undefined) {
          if (num < rule.min || num > rule.max) {
            warnings.push(
              `هشدار استاندارد: مقدار سنجیده‌شده (${num}) خارج از بازه استاندارد (${limitSpec.limitSpecification}) است.`
            );
          }
        }
      }
      break;
    }

    case 'boolean_detected': {
      parsedValue = Boolean(rawValue);
      break;
    }

    case 'text_observation': {
      parsedValue = String(rawValue).trim();
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    parsedValue,
    errors,
    warnings
  };
}

/**
 * Validates an entire step execution in a replicate
 */
export function validateStepRun(
  stepDef: LabStepDefinition,
  stepRun: LabStepRunData | undefined,
  standard?: Partial<FoodStandard>
): StepValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const blockingReasons: string[] = [];

  if (!stepRun) {
    return {
      isValid: false,
      canAdvanceToNext: false,
      blockingReasons: ['اطلاعات این مرحله هنوز تکمیل نشده است.'],
      errors: ['اطلاعات مرحله ثبت نشده است.'],
      warnings: []
    };
  }

  // 1. Validate each defined parameter (unless explicitly skipped with documented reason)
  if (stepRun.skippedWithoutGuessing) {
    warnings.push(
      `عدم اندازه‌گیری با ذکر علت: "${stepRun.skipReason || 'طبق صلاحدید فنی بدون نیاز به سنجش عددی'}". عدم اجبار به ورود مقدار حدسی اعمال شد.`
    );
  } else {
    for (const param of stepDef.parameters) {
      const recorded = stepRun.parameterValues[param.id];
      const val = recorded ? recorded.value : undefined;

      // Find linked standard limit if exists
      let matchedLimit: AcceptableLimitSpecification | undefined;
      if (standard && standard.acceptableLimits && param.standardLimitKey) {
        matchedLimit = standard.acceptableLimits.find(
          (l) => l.id === param.standardLimitKey || l.parameterNameFa === param.standardLimitKey
        );
      }

      const paramRes = validateParameterValue(param, val, matchedLimit);
      if (!paramRes.isValid) {
        errors.push(...paramRes.errors);
        blockingReasons.push(...paramRes.errors);
      }
      warnings.push(...paramRes.warnings);
    }
  }

  // 2. Verification requirement check before advancing:
  // "هر مرحله باید قبل از رفتن به مرحله بعد قابل بررسی باشد."
  if (stepDef.requiresVerificationBeforeNext && !stepRun.isVerified) {
    blockingReasons.push(
      stepDef.verificationPromptFa ||
        'تأیید اپراتور و بازبینی صحت اجرای این مرحله الزامی است. لطفاً چک‌باکس تأیید را علامت بزنید.'
    );
  }

  const isValid = errors.length === 0;
  const canAdvanceToNext = isValid && blockingReasons.length === 0;

  return {
    isValid,
    canAdvanceToNext,
    blockingReasons,
    errors,
    warnings
  };
}

/**
 * Computes repeatability and statistical dispersion across replicate values
 */
export function calculateRepeatabilityStatistics(
  replicateValues: number[],
  toleranceString?: string
): LabRepeatabilityAnalysis {
  const validValues = replicateValues.filter((v) => typeof v === 'number' && !isNaN(v));
  const n = validValues.length;

  if (n === 0) {
    return {
      replicateCount: 0,
      validReplicatesCount: 0,
      values: []
    };
  }

  // Mean
  const sum = validValues.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  // Range Diff
  const minVal = Math.min(...validValues);
  const maxVal = Math.max(...validValues);
  const rangeDifference = maxVal - minVal;

  let standardDeviation: number | undefined = undefined;
  let relativeStandardDeviationPercent: number | undefined = undefined;

  if (n > 1) {
    const variance = validValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
    standardDeviation = Math.sqrt(variance);
    if (mean !== 0) {
      relativeStandardDeviationPercent = (standardDeviation / Math.abs(mean)) * 100;
    }
  }

  // Tolerance evaluation
  let isAcceptableRepeatability: boolean | undefined = undefined;
  let assessmentNote: string | undefined = undefined;

  if (toleranceString && n > 1) {
    const rule = parseStandardLimitRule(toleranceString);
    const maxAllowedDiff = rule.max ?? (rule.exact ?? (rule.type === 'exact' ? rule.exact : undefined));
    
    if (maxAllowedDiff !== undefined) {
      isAcceptableRepeatability = rangeDifference <= maxAllowedDiff;
      assessmentNote = isAcceptableRepeatability
        ? `اختلاف تکرارها (${rangeDifference.toFixed(4)}) در محدوده رواداری تکرارپذیری مجاز استاندارد (حداکثر ${maxAllowedDiff}) است.`
        : `اختلاف تکرارها (${rangeDifference.toFixed(4)}) از حد مجاز رواداری استاندارد (${maxAllowedDiff}) بیشتر است؛ آزمون نیازمند تکرار مجدد می‌باشد.`;
    }
  }

  return {
    replicateCount: replicateValues.length,
    validReplicatesCount: n,
    values: validValues,
    mean: Number(mean.toFixed(4)),
    standardDeviation: standardDeviation !== undefined ? Number(standardDeviation.toFixed(4)) : undefined,
    relativeStandardDeviationPercent:
      relativeStandardDeviationPercent !== undefined ? Number(relativeStandardDeviationPercent.toFixed(3)) : undefined,
    rangeDifference: Number(rangeDifference.toFixed(4)),
    isAcceptableRepeatability,
    repeatabilityLimitFromStandard: toleranceString,
    assessmentNote
  };
}

/**
 * Convenience helper to compute repeatability directly from a LabSession
 */
export function computeSessionRepeatability(session: LabSession): LabRepeatabilityAnalysis {
  const vals: number[] = [];
  for (const rep of session.replicates) {
    if (rep.calculatedResult?.primaryValue !== undefined) {
      vals.push(rep.calculatedResult.primaryValue);
    } else {
      for (const stepRun of Object.values(rep.stepsData)) {
        for (const pVal of Object.values(stepRun.parameterValues)) {
          if (pVal && typeof pVal.value === 'number' && !isNaN(pVal.value)) {
            vals.push(pVal.value);
            break;
          }
        }
      }
    }
  }
  return calculateRepeatabilityStatistics(vals);
}

export const evaluateStandardConformance = evaluateSessionStandardConformance;

/**
 * Evaluates the full session against the chosen standard acceptable limits
 */
export function evaluateSessionStandardConformance(session: LabSession): LabStandardConformance {
  if (!session.standardSnapshot && !session.standardNumber) {
    return {
      isCompliant: true,
      verdict: 'not_evaluated',
      detailsFa: 'هیچ استاندارد مرجعی برای این آزمون انتخاب نشده است.',
      evaluatedLimits: []
    };
  }

  const limits = session.standardSnapshot?.acceptableLimits || [];
  if (limits.length === 0) {
    return {
      evaluatedStandardNumber: session.standardNumber,
      evaluatedStandardTitle: session.standardTitleFa,
      isCompliant: true,
      verdict: 'indeterminate',
      detailsFa: 'استاندارد مرجع فاقد حدود مجاز عددی قابل ارزیابی در پایگاه دانش است.',
      evaluatedLimits: []
    };
  }

  const evaluatedLimits: LabStandardConformance['evaluatedLimits'] = [];
  let allPassed = true;
  let evaluatedCount = 0;

  // Extract all measured parameters across completed replicates
  const parameterAverages: Record<string, { sum: number; count: number; name: string; unit: string }> = {};

  for (const rep of session.replicates) {
    for (const stepKey of Object.keys(rep.stepsData)) {
      const stepRun = rep.stepsData[Number(stepKey)];
      if (!stepRun) continue;

      for (const [pId, pVal] of Object.entries(stepRun.parameterValues)) {
        if (typeof pVal.value === 'number' && !isNaN(pVal.value)) {
          if (!parameterAverages[pId]) {
            parameterAverages[pId] = { sum: 0, count: 0, name: pVal.nameFa, unit: pVal.unit };
          }
          parameterAverages[pId].sum += pVal.value;
          parameterAverages[pId].count += 1;
        }
      }
    }
  }

  for (const limit of limits) {
    // Look for matching parameter
    const matchedParamKey = Object.keys(parameterAverages).find(
      (k) =>
        k.toLowerCase() === limit.id.toLowerCase() ||
        parameterAverages[k].name.includes(limit.parameterNameFa) ||
        limit.parameterNameFa.includes(parameterAverages[k].name)
    );

    if (matchedParamKey) {
      const avgData = parameterAverages[matchedParamKey];
      const meanVal = avgData.sum / avgData.count;
      const rule = parseStandardLimitRule(limit.limitSpecification);
      let passed = true;

      if (rule.type === 'max' && rule.max !== undefined) {
        passed = meanVal <= rule.max;
      } else if (rule.type === 'min' && rule.min !== undefined) {
        passed = meanVal >= rule.min;
      } else if (rule.type === 'range' && rule.min !== undefined && rule.max !== undefined) {
        passed = meanVal >= rule.min && meanVal <= rule.max;
      }

      if (!passed) {
        allPassed = false;
      }
      evaluatedCount++;

      evaluatedLimits.push({
        parameterName: limit.parameterNameFa,
        measuredValue: meanVal.toFixed(3),
        standardLimit: limit.limitSpecification,
        unit: limit.unit || avgData.unit || '',
        passed,
        notes: limit.notes
      });
    }
  }

  if (evaluatedCount === 0) {
    return {
      evaluatedStandardNumber: session.standardNumber,
      evaluatedStandardTitle: session.standardTitleFa,
      isCompliant: true,
      verdict: 'indeterminate',
      detailsFa: 'پارامترهای ثبت‌شده با عناوین حدود مجاز استاندارد تطابق اسمی مستقیم نداشتند.',
      evaluatedLimits: []
    };
  }

  return {
    evaluatedStandardNumber: session.standardNumber,
    evaluatedStandardTitle: session.standardTitleFa,
    isCompliant: allPassed,
    verdict: allPassed ? 'compliant' : 'non_compliant',
    detailsFa: allPassed
      ? `تمامی ${evaluatedCount} شاخص ارزیابی‌شده در محدوده مجاز استاندارد ${session.standardNumber || ''} قرار دارند.`
      : `یک یا چند شاخص اندازه‌گیری‌شده خارج از حدود مجاز استاندارد ${session.standardNumber || ''} ثبت شده‌اند.`,
    evaluatedLimits
  };
}

export interface StageValidationResult {
  stage: string;
  canAdvance: boolean;
  errors: string[];
  warnings: string[];
  explanation: string;
}

/**
 * Validates a workflow stage before advancing to the next stage (Part 34 of 40)
 * Evaluates mandatory prerequisites, calibration checks, reagents, sample preparation,
 * step execution, and repeatability with clear explanations without forcing guessed data.
 */
export function validateWorkflowStage(stage: string, session: LabSession): StageValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let explanation = '';

  switch (stage) {
    case 'start_objective': {
      if (!session.sampleName || session.sampleName.trim() === '') {
        errors.push('نام نمونه غذایی ثبت نشده است.');
      }
      if (!session.sampleCode || session.sampleCode.trim() === '') {
        errors.push('کد ردیابی نمونه در سیستم آزمایشگاه خالی است.');
      }
      if (!session.operatorName || session.operatorName.trim() === '') {
        errors.push('نام کارشناس / آنالیزور آزمایشگاه مشخص نشده است.');
      }
      if (!session.batchNumber) {
        warnings.push('شماره بهر / لات نامشخص است (توصیه می‌شود جهت قابلیت ردیابی وارد گردد).');
      }
      explanation = errors.length > 0
        ? 'برای ثبت رسمی ردپای آزمون (GLP Chain of Custody)، مشخصات شناسنامه نمونه و کارشناس باید کامل باشد.'
        : 'اطلاعات اولیه و هدف علمی آزمون معتبر و مورد تایید است.';
      break;
    }

    case 'equipment_calibration': {
      const totalEq = session.requiredEquipment.length;
      const verifiedEq = session.requiredEquipment.filter((e) => e.isPrepared).length;
      if (totalEq > 0 && verifiedEq < totalEq) {
        warnings.push(
          `تعداد ${totalEq - verifiedEq} قلم از تجهیزات پروتکل هنوز تصدیق کالیبراسیون و رواداری نشده‌اند.`
        );
        explanation = 'طبق بندهای استاندارد ISO 17025، استفاده از تجهیز بدون برچسب کالیبراسیون معتبر یا عدم صفر کردن ترازو می‌تواند سبب خطای سیستماتیک در نتایج شود.';
      } else {
        explanation = 'کلیه ابزارها و تجهیزات آزمون کالیبره و آماده به کار هستند.';
      }
      break;
    }

    case 'reagents_solutions': {
      const totalReag = session.reagentsAndChemicals.length;
      const verifiedReag = session.reagentsAndChemicals.filter((r) => r.isPrepared).length;
      if (totalReag > 0 && verifiedReag < totalReag) {
        warnings.push(
          `تعداد ${totalReag - verifiedReag} معرف یا محلول شیمیایی بررسی و تأیید نشده باقی مانده‌اند.`
        );
        explanation = 'کیفیت و درجه خلوص معرف‌ها (مانند تیترانت‌ها و شناساگرها) در درستی محاسبات استوکیومتری تأثیر مستقیم دارد.';
      } else {
        explanation = 'معرف‌ها، محلول‌های استاندارد و نکات ایمنی مرتبط با مواد شیمیایی تایید شده‌اند.';
      }
      break;
    }

    case 'sample_preparation': {
      if (!session.samplePrepData?.isPrepared) {
        errors.push('فرآیند آماده‌سازی و همگن‌سازی اولیه نمونه غذایی هنوز تایید نشده است.');
        explanation = 'آزمون بر روی نمونه همگن‌نشده به دلیل عدم تجانس فازها، منجر به خطای نمونه‌برداری و رد آزمون در تکرارها می‌گردد.';
      } else {
        explanation = 'نمونه غذایی با موفقیت همگن، توزین و آماده اجرای فرآیند آزمون گردیده است.';
      }
      break;
    }

    case 'step_procedure': {
      const currentRep = session.replicates.find((r) => r.replicateNumber === session.currentReplicateNumber) || session.replicates[0];
      if (currentRep) {
        const incompleteSteps: number[] = [];
        for (const step of session.steps) {
          const stepRun = currentRep.stepsData[step.stepNumber];
          const val = validateStepRun(step, stepRun, session.standardSnapshot);
          if (!val.canAdvanceToNext) {
            incompleteSteps.push(step.stepNumber);
            errors.push(`گام ${step.stepNumber} («${step.titleFa}»): ${val.blockingReasons.join(' | ')}`);
          }
        }
        if (incompleteSteps.length > 0) {
          explanation = 'لطفاً مقادیر گام‌های ناقص را ثبت کنید یا در صورت عدم انجام، گزینه «عدم نیاز به اندازه‌گیری در این مرحله (بدون حدس زدن)» را علامت بزنید.';
        } else {
          explanation = 'تمامی مراحل اجرایی تکرار جاری با موفقیت اعتبارسنجی و ثبت شدند.';
        }
      }
      break;
    }

    case 'calculation_review': {
      const hasAnyValue = session.replicates.some((r) =>
        Object.values(r.stepsData).some((s) =>
          Object.values(s.parameterValues).some((p) => p && p.value !== '' && p.value !== undefined)
        )
      );
      if (!hasAnyValue) {
        errors.push('هیچ داده عددی برای انجام محاسبات و ارزیابی استاندارد در تکرارها یافت نشد.');
        explanation = 'جهت اجرای فرمول‌های استاندارد و تحلیل آماری، حداقل یک مقدار عددی یا تیتراسیون الزامی است.';
      } else {
        if (session.repeatabilityAnalysis && session.repeatabilityAnalysis.relativeStandardDeviationPercent !== undefined) {
          if (session.repeatabilityAnalysis.relativeStandardDeviationPercent > 5) {
            warnings.push(
              `انحراف معیار نسبی تکرارها (${session.repeatabilityAnalysis.relativeStandardDeviationPercent.toFixed(2)}%) بیش از ۵٪ است که ممکن است نشان‌دهنده پراکندگی بیش از حد مجاز باشد.`
            );
          }
        }
        explanation = 'محاسبات استوکیومتری و انطباق با حدود مجاز استاندارد ملی با موفقیت استخراج گردید.';
      }
      break;
    }

    case 'finalize': {
      if (session.status !== 'completed' && session.status !== 'running') {
        warnings.push('وضعیت نشست آزمایش در حالت معلق یا پیش‌نویس است.');
      }
      explanation = 'تمامی مراحل هفت‌گانه آزمون تکمیل شده و آماده صدور کارنامه رسمی و بایگانی است.';
      break;
    }

    default:
      explanation = 'مرحله مورد نظر معتبر است.';
  }

  return {
    stage,
    canAdvance: errors.length === 0,
    errors,
    warnings,
    explanation
  };
}
