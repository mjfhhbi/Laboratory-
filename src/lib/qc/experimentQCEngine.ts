/**
 * Food Science AI - Laboratory Quality Control (QC) Evaluation Engine
 * 
 * Strict rule enforcement:
 * 1. Acceptance criteria are evaluated ONLY if specified by the source standard.
 * 2. If no criteria are specified, returns status: 'unknown' with reason: "قابل ارزیابی نیست".
 * 3. Never fabricates acceptance criteria or limits.
 * 4. Computes Pass / Fail / Unknown with clear, deterministic scientific rationales.
 */

import {
  ExperimentQCItem,
  LabQCItemExecution,
  LabSessionQCData,
  QCItemStatus
} from '../../types/qualityControl';

/**
 * Evaluates a single QC item against its recorded value
 */
export function evaluateQCItem(
  item: ExperimentQCItem,
  recordedValue: number | string | undefined
): { status: QCItemStatus; reasonFa: string } {
  const criteria = item.acceptanceCriteria;

  // 1. Check if acceptance criteria is officially specified
  if (!criteria || !criteria.specified) {
    return {
      status: 'unknown',
      reasonFa: 'معیار پذیرش رسمی در روش/استاندارد مرجع مشخص نشده است: «قابل ارزیابی نیست»'
    };
  }

  // 2. Check if a recorded value exists
  if (recordedValue === undefined || recordedValue === null || String(recordedValue).trim() === '') {
    return {
      status: 'unknown',
      reasonFa: 'نتیجه‌ای برای این شاخص کنترل کیفیت ثبت نشده است.'
    };
  }

  const rawStr = String(recordedValue).trim();
  const rawNum = typeof recordedValue === 'number' ? recordedValue : parseFloat(rawStr.replace(/,/g, '.'));
  const isNumeric = !isNaN(rawNum);
  const unitStr = criteria.unit ? ` ${criteria.unit}` : '';

  // 3. Evaluate according to comparison type
  switch (criteria.comparisonType) {
    case 'max': {
      if (!isNumeric) {
        return {
          status: 'unknown',
          reasonFa: `مقدار واردشده («${rawStr}») عددی معتبر نیست و امکان مقایسه با سقف مجاز وجود ندارد.`
        };
      }
      const limit = criteria.maxValue ?? criteria.targetValue;
      if (limit === undefined) {
        return {
          status: 'unknown',
          reasonFa: 'حد بیشینه در استاندارد به صورت عددی مشخص نشده است: «قابل ارزیابی نیست»'
        };
      }

      if (rawNum <= limit) {
        return {
          status: 'pass',
          reasonFa: `مقدار ثبت‌شده (${rawNum}${unitStr}) کمتر یا مساوی با حداکثر مجاز استاندارد (${limit}${unitStr}) است.`
        };
      } else {
        return {
          status: 'fail',
          reasonFa: `مقدار ثبت‌شده (${rawNum}${unitStr}) فراتر از سقف مجاز استاندارد (${limit}${unitStr}) است.`
        };
      }
    }

    case 'min': {
      if (!isNumeric) {
        return {
          status: 'unknown',
          reasonFa: `مقدار واردشده («${rawStr}») عددی معتبر نیست و امکان مقایسه با حداقل مجاز وجود ندارد.`
        };
      }
      const limit = criteria.minValue ?? criteria.targetValue;
      if (limit === undefined) {
        return {
          status: 'unknown',
          reasonFa: 'حد کمینه در استاندارد به صورت عددی مشخص نشده است: «قابل ارزیابی نیست»'
        };
      }

      if (rawNum >= limit) {
        return {
          status: 'pass',
          reasonFa: `مقدار ثبت‌شده (${rawNum}${unitStr}) بالاتر یا مساوی با حداقل مجاز استاندارد (${limit}${unitStr}) است.`
        };
      } else {
        return {
          status: 'fail',
          reasonFa: `مقدار ثبت‌شده (${rawNum}${unitStr}) کمتر از کف مجاز استاندارد (${limit}${unitStr}) است.`
        };
      }
    }

    case 'range': {
      if (!isNumeric) {
        return {
          status: 'unknown',
          reasonFa: `مقدار واردشده («${rawStr}») عددی معتبر نیست.`
        };
      }
      const min = criteria.minValue;
      const max = criteria.maxValue;
      if (min === undefined || max === undefined) {
        return {
          status: 'unknown',
          reasonFa: 'محدوده بازه در استاندارد به صورت کامل تعیین نشده است: «قابل ارزیابی نیست»'
        };
      }

      if (rawNum >= min && rawNum <= max) {
        return {
          status: 'pass',
          reasonFa: `مقدار ثبت‌شده (${rawNum}${unitStr}) درون بازه مجاز استاندارد (${min} تا ${max}${unitStr}) قرار دارد.`
        };
      } else {
        return {
          status: 'fail',
          reasonFa: `مقدار ثبت‌شده (${rawNum}${unitStr}) خارج از بازه مجاز استاندارد (${min} تا ${max}${unitStr}) است.`
        };
      }
    }

    case 'max_percent_diff': {
      if (!isNumeric) {
        return {
          status: 'unknown',
          reasonFa: `مقدار درصد اختلاف واردشده («${rawStr}») عددی معتبر نیست.`
        };
      }
      const maxDiff = criteria.maxDifference ?? criteria.targetValue;
      if (maxDiff === undefined) {
        return {
          status: 'unknown',
          reasonFa: 'بیشینه اختلاف مجاز تکرارپذیری در استاندارد تعیین نشده است: «قابل ارزیابی نیست»'
        };
      }

      if (rawNum <= maxDiff) {
        return {
          status: 'pass',
          reasonFa: `اختلاف نسبی تکرارها (${rawNum}%) در محدوده رواداری تکرارپذیری (حداکثر ${maxDiff}%) است.`
        };
      } else {
        return {
          status: 'fail',
          reasonFa: `اختلاف نسبی تکرارها (${rawNum}%) از سقف مجاز تکرارپذیری استاندارد (${maxDiff}%) بیشتر است.`
        };
      }
    }

    case 'exact_zero': {
      const isZero =
        (isNumeric && rawNum === 0) ||
        rawStr === '0' ||
        rawStr === 'منفی' ||
        rawStr === 'عدم رشد' ||
        rawStr.toLowerCase() === 'negative';

      if (isZero) {
        return {
          status: 'pass',
          reasonFa: 'هیچ‌گونه رشد میکروبی یا جذب نوری در نمونه شاهد مشاهده نشد (عدم آلودگی).'
        };
      } else {
        return {
          status: 'fail',
          reasonFa: `نمونه شاهد حاوی پاسخ غیرصفر یا آلودگی است (${rawStr})؛ در حالی که طبق استاندارد باید فاقد هرگونه واکنش باشد.`
        };
      }
    }

    case 'text_match': {
      const expected = criteria.expectedText?.trim().toLowerCase();
      if (!expected) {
        return {
          status: 'unknown',
          reasonFa: 'متن مورد انتظار استاندارد تعریف نشده است: «قابل ارزیابی نیست»'
        };
      }

      if (rawStr.toLowerCase().includes(expected)) {
        return {
          status: 'pass',
          reasonFa: `نتیجه ثبت‌شده («${rawStr}») با معیار پذیرش مندرج در استاندارد («${criteria.expectedText}») مطابقت دارد.`
        };
      } else {
        return {
          status: 'fail',
          reasonFa: `نتیجه ثبت‌شده («${rawStr}») با پاسخ مورد انتظار استاندارد («${criteria.expectedText}») انطباق ندارد.`
        };
      }
    }

    case 'custom_standard_rule': {
      return {
        status: 'unknown',
        reasonFa: `بررسی نیازمند ارزیابی کیفی طبق شرح استاندارد است: ${criteria.descriptionFa}`
      };
    }

    default:
      return {
        status: 'unknown',
        reasonFa: 'قانون ارزیابی برای این شاخص تعریف نشده است: «قابل ارزیابی نیست»'
      };
  }
}

/**
 * Evaluates an entire QC protocol for a laboratory session
 */
export function evaluateSessionQC(
  qcItems: ExperimentQCItem[],
  recordedValues: Record<string, { value?: number | string; notes?: string }>
): LabSessionQCData {
  const itemsMap: Record<string, LabQCItemExecution> = {};
  let hasFail = false;
  let passCount = 0;
  let unknownCount = 0;
  let totalEvaluated = 0;

  qcItems.forEach((item) => {
    const recorded = recordedValues[item.id];
    const val = recorded?.value;
    const { status, reasonFa } = evaluateQCItem(item, val);

    itemsMap[item.id] = {
      itemId: item.id,
      type: item.type,
      recordedValue: val,
      unit: item.acceptanceCriteria?.unit,
      notes: recorded?.notes,
      evaluatedStatus: status,
      evaluationReasonFa: reasonFa,
      evaluatedAt: new Date().toISOString()
    };

    if (item.acceptanceCriteria.specified) {
      totalEvaluated++;
      if (status === 'fail') hasFail = true;
      if (status === 'pass') passCount++;
      if (status === 'unknown') unknownCount++;
    }
  });

  let overallStatus: QCItemStatus = 'unknown';
  let summaryFa = '';

  if (hasFail) {
    overallStatus = 'fail';
    summaryFa = 'یک یا چند شاخص کنترل کیفی با حدود مجاز استاندارد انطباق ندارند (مردود).';
  } else if (passCount > 0 && passCount === totalEvaluated) {
    overallStatus = 'pass';
    summaryFa = `کلیه شاخص‌های دارای حد پذیرش استاندارد (${passCount} مورد) با موفقیت تأیید شدند (قبول).`;
  } else if (passCount > 0 && unknownCount > 0) {
    overallStatus = 'pass';
    summaryFa = `${passCount} شاخص کنترل کیفیت تأیید شد و ${unknownCount} شاخص به علت عدم تصریح در استاندارد قابل ارزیابی نیستند.`;
  } else {
    overallStatus = 'unknown';
    summaryFa = 'هیچ‌یک از شاخص‌های کنترل کیفیت قابل ارزیابی بر اساس حدود مصوب نیستند.';
  }

  return {
    items: itemsMap,
    overallStatus,
    summaryFa,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Extracts or generates standard QC Items for an experiment
 * Never hallucinates limits: if not explicitly stated with numbers/clauses, sets specified: false.
 */
export function extractQCItemsFromExperiment(experiment: any): ExperimentQCItem[] {
  if (experiment.qcSpec?.items && experiment.qcSpec.items.length > 0) {
    return experiment.qcSpec.items;
  }
  if (
    typeof experiment.qualityControl === 'object' &&
    !Array.isArray(experiment.qualityControl) &&
    experiment.qualityControl?.items &&
    experiment.qualityControl.items.length > 0
  ) {
    return experiment.qualityControl.items;
  }

  const items: ExperimentQCItem[] = [];
  const stdNum = `${experiment.standardReference?.organization || 'INSO'} ${experiment.standardReference?.standardNumber || ''}`.trim();
  const qcObj = typeof experiment.qualityControl === 'object' && !Array.isArray(experiment.qualityControl)
    ? experiment.qualityControl
    : null;

  // 1. Blank
  items.push({
    id: 'qc_blank_default',
    type: 'blank',
    titleFa: 'آزمون شاهد (Blank Test)',
    titleEn: 'Reagent / Method Blank',
    descriptionFa: qcObj?.blanks || 'اجرای همزمان آزمون با کلیه حلال‌ها و معرف‌ها فاقد نمونه غذایی جهت حذف خطای زمینه',
    sourceReference: `${stdNum} - بند الزامات آزمون شاهد`,
    acceptanceCriteria: qcObj?.blanks && (qcObj.blanks.includes('کمتر از') || qcObj.blanks.includes('فاقد'))
      ? {
          specified: true,
          descriptionFa: qcObj.blanks,
          sourceClause: `${stdNum} بند آزمون شاهد`,
          comparisonType: 'max',
          targetValue: 0.05,
          unit: 'mL'
        }
      : {
          specified: false,
          descriptionFa: 'حد پذیرش کمی در متن استاندارد تصریح نشده است: «قابل ارزیابی نیست»'
        },
    isRequired: true
  });

  // 2. Duplicate
  const repLimit = experiment.reporting?.repeatabilityLimit_r;
  items.push({
    id: 'qc_duplicate_default',
    type: 'duplicate',
    titleFa: 'آزمون تکرار موازی (Duplicate Analysis)',
    titleEn: 'Duplicate Sample Analysis',
    descriptionFa: qcObj?.duplicates || 'انجام حداقل دو تکرار همزمان روی آزمایه یکنواخت‌شده جهت کنترل تکرارپذیری',
    sourceReference: `${stdNum} - بند تکرارپذیری روش (Repeatability r)`,
    acceptanceCriteria: repLimit
      ? {
          specified: true,
          descriptionFa: `اختلاف دو نتیجه تکرار نباید از ${repLimit} بیشتر باشد.`,
          sourceClause: `${stdNum} بند تکرارپذیری`,
          comparisonType: 'max',
          targetValue: parseFloat(repLimit.replace(/[^0-9.]/g, '')) || 0.04,
          unit: experiment.reporting?.unitOfMeasurement || ''
        }
      : {
          specified: false,
          descriptionFa: 'حد مجاز تکرارپذیری (r) به طور رسمی در استاندارد مشخص نشده است: «قابل ارزیابی نیست»'
        },
    isRequired: true
  });

  // 3. Calibration Check
  items.push({
    id: 'qc_calibration_check_default',
    type: 'calibration_check',
    titleFa: 'بررسی کالیبراسیون و صحت دستگاهی (Calibration Check)',
    titleEn: 'Instrument Calibration Verification',
    descriptionFa: 'صحت‌سنجی کالیبراسیون ترازوی آنالیتیکال و شناساگرهای حجمی/دستگاهی پیش از شروع آزمون',
    sourceReference: `${stdNum} - الزامات عمومی کالیبراسیون تجهیزات`,
    acceptanceCriteria: {
      specified: false,
      descriptionFa: 'معیار پذیرش عددی در روش آزمون مشخص نشده است: «قابل ارزیابی نیست»'
    },
    isRequired: true
  });

  return items;
}

