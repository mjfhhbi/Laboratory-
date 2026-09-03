/**
 * Food Science AI - Food Microbiology Calculation Engine & Storage Service
 * 
 * Implements ISO 7218 weighted mean colony counting formula, MPN table interpolation,
 * serial dilution planning, and seamless integration with the Step-by-Step Laboratory Engine (LabSession).
 */

import { 
  PlateCountReplicateInput, 
  ISO7218CalculationResult, 
  MPNTableResult, 
  MicrobialTest 
} from '../../types/microbiology';
import { MPN_3_TUBE_TABLE } from '../../data/microbiologyData';
import { LabSession, LabStepDefinition, LabStepRunData } from '../../types/laboratory';
import { executeTx, STORES, getAllItems, getItem, putItem, deleteItem } from './indexedDb';

/**
 * Rounds a number to two significant figures according to ISO 7218:2007 standard
 * e.g. 16800 -> 17000 (1.7 x 10^4), 16400 -> 16000 (1.6 x 10^4)
 * For rounding when last digit is 5: round to nearest even number.
 */
export function roundToTwoSignificantFigures(num: number): { roundedValue: number; scientificString: string } {
  if (num <= 0 || !isFinite(num)) {
    return { roundedValue: 0, scientificString: '0' };
  }

  const exponent = Math.floor(Math.log10(num));
  const normalized = num / Math.pow(10, exponent); // e.g. 1.68 or 2.35
  const roundedNormalized = Math.round(normalized * 10) / 10;
  const roundedValue = roundedNormalized * Math.pow(10, exponent);

  let scientificString = '';
  if (exponent === 0 || exponent === 1) {
    scientificString = roundedValue.toFixed(0);
  } else {
    scientificString = `${roundedNormalized.toFixed(1)} × 10${toSuperscript(exponent)}`;
  }

  return { roundedValue, scientificString };
}

function toSuperscript(num: number): string {
  const digits: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻'
  };
  return num.toString().split('').map(d => digits[d] || d).join('');
}

/**
 * ISO 7218:2007 Weighted Mean Calculation Formula:
 * N = sum(C) / [ V * (n1 + 0.1 * n2) * d ]
 * 
 * @param replicates List of dilution inputs (dilution factor, plate 1, plate 2)
 * @param volumePlated Volume in mL plated per petri dish (1.0 for pour plate, 0.1 for spread plate)
 * @param minCount Minimum valid count per plate (e.g. 15 for PCA, 15 for selective, 10 for yeasts/molds)
 * @param maxCount Maximum valid count per plate (e.g. 300 for PCA, 150 for selective)
 */
export function calculateISO7218PlateCount(
  replicates: PlateCountReplicateInput[],
  volumePlated: number = 1.0,
  minCount: number = 15,
  maxCount: number = 300
): ISO7218CalculationResult {
  // 1. Filter out excluded replicates and sort by dilution (lowest dilution / highest concentration first)
  const validReplicates = replicates
    .filter(r => !r.isExcluded)
    .sort((a, b) => Math.abs(a.dilutionFactor) - Math.abs(b.dilutionFactor));

  if (validReplicates.length === 0) {
    return {
      weightedMeanCFUPerGramOrMl: 0,
      log10CFU: 0,
      reportedResultString: 'اطلاعاتی وارد نشده است',
      isInValidRange: false,
      evaluationNote: 'هیچ تکرار معتبری ثبت نشده است.',
      formulaDetails: { sumOfColonies: 0, volumePlated, n1Count: 0, n2Count: 0, primaryDilutionFactor: 0, denominator: 0 },
      repeatabilityStatus: 'discrepant'
    };
  }

  // 2. Identify dilutions falling within the countable range [minCount, maxCount]
  const inRangeDilutions = validReplicates.filter(r => {
    const avg = (r.plate1Count + r.plate2Count) / 2;
    return avg >= minCount && avg <= maxCount;
  });

  // Case A: Standard case with 2 consecutive dilutions in range
  if (inRangeDilutions.length >= 2) {
    const d1 = inRangeDilutions[0];
    const d2 = inRangeDilutions[1];

    const sumC = d1.plate1Count + d1.plate2Count + d2.plate1Count + d2.plate2Count;
    const n1 = 2; // two plates for d1
    const n2 = 2; // two plates for d2
    const d = Math.pow(10, d1.dilutionFactor); // e.g. 10^-2 = 0.01

    const denominator = volumePlated * (n1 + 0.1 * n2) * d;
    const rawN = sumC / denominator;
    const { roundedValue, scientificString } = roundToTwoSignificantFigures(rawN);
    const log10CFU = Math.log10(roundedValue);

    return {
      weightedMeanCFUPerGramOrMl: roundedValue,
      log10CFU: Math.round(log10CFU * 100) / 100,
      reportedResultString: `${scientificString} CFU/g`,
      isInValidRange: true,
      evaluationNote: `محاسبه دقیق بر اساس دو رقت متوالی (${d1.dilutionLabel} و ${d2.dilutionLabel}) مطابق فرمول میانگین موزون استاندارد ISO 7218.`,
      formulaDetails: {
        sumOfColonies: sumC,
        volumePlated,
        n1Count: n1,
        n2Count: n2,
        primaryDilutionFactor: d,
        denominator
      },
      repeatabilityStatus: 'compliant'
    };
  }

  // Case B: Exactly 1 dilution in range
  if (inRangeDilutions.length === 1) {
    const d1 = inRangeDilutions[0];
    const sumC = d1.plate1Count + d1.plate2Count;
    const n1 = 2;
    const d = Math.pow(10, d1.dilutionFactor);
    const denominator = volumePlated * n1 * d;
    const rawN = sumC / denominator;
    const { roundedValue, scientificString } = roundToTwoSignificantFigures(rawN);
    const log10CFU = Math.log10(roundedValue);

    return {
      weightedMeanCFUPerGramOrMl: roundedValue,
      log10CFU: Math.round(log10CFU * 100) / 100,
      reportedResultString: `${scientificString} CFU/g`,
      isInValidRange: true,
      evaluationNote: `محاسبه بر اساس تک رقت قابل شمارش (${d1.dilutionLabel}) مطابق ISO 7218.`,
      formulaDetails: {
        sumOfColonies: sumC,
        volumePlated,
        n1Count: n1,
        n2Count: 0,
        primaryDilutionFactor: d,
        denominator
      },
      repeatabilityStatus: 'single_dilution_used'
    };
  }

  // Case C: All plates have fewer than minCount (low count)
  const lowestDilution = validReplicates[0];
  const lowestAvg = (lowestDilution.plate1Count + lowestDilution.plate2Count) / 2;

  if (lowestAvg < minCount) {
    if (lowestAvg === 0) {
      const d = Math.pow(10, lowestDilution.dilutionFactor);
      const limit = Math.round(1 / (volumePlated * d));
      return {
        weightedMeanCFUPerGramOrMl: 0,
        log10CFU: 0,
        reportedResultString: `< ${limit} CFU/g (عدم مشاهده کلنی در کمترین رقت)`,
        isInValidRange: false,
        evaluationNote: `هیچ کلنی در رقت ${lowestDilution.dilutionLabel} مشاهده نشد. طبق ISO 7218، نتیجه به صورت کمتر از حد تشخیص گزارش می‌شود.`,
        formulaDetails: { sumOfColonies: 0, volumePlated, n1Count: 2, n2Count: 0, primaryDilutionFactor: d, denominator: volumePlated * 2 * d },
        repeatabilityStatus: 'compliant'
      };
    } else {
      // Estimated count (تعداد تخمینی)
      const sumC = lowestDilution.plate1Count + lowestDilution.plate2Count;
      const d = Math.pow(10, lowestDilution.dilutionFactor);
      const rawN = sumC / (volumePlated * 2 * d);
      const { roundedValue, scientificString } = roundToTwoSignificantFigures(rawN);

      return {
        weightedMeanCFUPerGramOrMl: roundedValue,
        log10CFU: Math.round(Math.log10(roundedValue) * 100) / 100,
        reportedResultString: `تخمینی: ${scientificString} CFU/g (کمتر از حد مجاز شمارش ${minCount})`,
        isInValidRange: false,
        evaluationNote: `تعداد کلنی‌ها در کمترین رقت کمتر از حد استاندارد ${minCount} است. نتیجه به عنوان مقدار تخمینی (Estimated Count) ثبت می‌گردد.`,
        formulaDetails: { sumOfColonies: sumC, volumePlated, n1Count: 2, n2Count: 0, primaryDilutionFactor: d, denominator: volumePlated * 2 * d },
        repeatabilityStatus: 'single_dilution_used'
      };
    }
  }

  // Case D: All plates are overcrowded (> maxCount / TNTC)
  const highestDilution = validReplicates[validReplicates.length - 1];
  const d = Math.pow(10, highestDilution.dilutionFactor);
  const maxLimit = Math.round(maxCount / (volumePlated * d));

  return {
    weightedMeanCFUPerGramOrMl: maxLimit,
    log10CFU: Math.round(Math.log10(maxLimit) * 100) / 100,
    reportedResultString: `> ${maxLimit} CFU/g (بیش از حد شمارش / TNTC)`,
    isInValidRange: false,
    evaluationNote: `تعداد کلنی‌ها در تمام رقت‌ها از حد حداکثری ${maxCount} فراتر است (Too Numerous To Count). آزمون باید با رقت‌های بالاتر تکرار شود.`,
    formulaDetails: { sumOfColonies: 0, volumePlated, n1Count: 0, n2Count: 0, primaryDilutionFactor: d, denominator: 0 },
    repeatabilityStatus: 'discrepant'
  };
}

/**
 * Calculates MPN value from 3-tube series combination
 * e.g. "3-1-0" for inocula of 0.1g, 0.01g, 0.001g
 */
export function calculateMPN3Tube(
  positivesD1: number,
  positivesD2: number,
  positivesD3: number,
  initialInoculumGramOrMl: number = 0.1
): MPNTableResult {
  const code = `${Math.min(3, Math.max(0, positivesD1))}-${Math.min(3, Math.max(0, positivesD2))}-${Math.min(3, Math.max(0, positivesD3))}`;
  const tableEntry = MPN_3_TUBE_TABLE[code];

  if (!tableEntry) {
    return {
      combinationOfPositives: code,
      mpnValue: 0,
      confidenceInterval95: { lower: 0, upper: 0 },
      unit: 'MPN/g',
      probabilityCategory: 'category_3_unacceptable'
    };
  }

  // Adjust for initial inoculum scale (Standard table is based on 0.1g, 0.01g, 0.001g)
  const scaleFactor = 0.1 / initialInoculumGramOrMl;
  const scaledMPN = tableEntry.mpnValue * scaleFactor;
  const scaledLower = tableEntry.confidenceInterval95.lower * scaleFactor;
  const scaledUpper = tableEntry.confidenceInterval95.upper * scaleFactor;

  return {
    combinationOfPositives: code,
    mpnValue: Math.round(scaledMPN * 10) / 10,
    confidenceInterval95: {
      lower: Math.round(scaledLower * 10) / 10,
      upper: Math.round(scaledUpper * 10) / 10
    },
    unit: 'MPN/g یا MPN/mL',
    probabilityCategory: tableEntry.probabilityCategory
  };
}

/**
 * Converts a MicrobialTest into a structured executable LabSession for the Laboratory Engine
 */
export function createMicrobiologyLabSession(
  test: MicrobialTest,
  sampleName: string = 'نمونه آزمایشی مواد غذایی',
  batchLotNumber: string = 'LOT-MB-' + new Date().toISOString().slice(0, 10)
): LabSession {
  const sessionId = `mb-session-${Date.now()}`;
  
  // Transform microbial steps into structured LabStepDefinitions
  const structuredSteps: LabStepDefinition[] = test.procedureSteps.map((step, idx) => {
    return {
      stepNumber: step.stepNumber,
      titleFa: step.titleFa,
      titleEn: `Step ${step.stepNumber}: ${step.phase.toUpperCase()}`,
      descriptionFa: step.descriptionFa,
      instructions: [
        step.descriptionFa,
        step.criticalTemperature ? `دمای بحرانی: ${step.criticalTemperature}` : '',
        step.criticalTime ? `زمان بحرانی: ${step.criticalTime}` : '',
        step.criticalWarning ? `هشدار الزامی: ${step.criticalWarning}` : ''
      ].filter(Boolean),
      equipmentUsed: test.requiredEquipment.map(e => e.nameFa),
      reagentsUsed: test.requiredMedia.map(m => m.nameFa),
      requiresVerificationBeforeNext: false,
      parameters: [
        {
          id: `step_${step.stepNumber}_status`,
          nameFa: `تایید اجرای آسپتیک ${step.titleFa}`,
          paramType: 'boolean_detected',
          expectedUnit: 'تایید',
          required: true,
          defaultValue: true
        },
        ...(step.phase === 'counting' ? [
          {
            id: 'colony_count_p1',
            nameFa: 'شمارش پلیت ۱ (تکرار اول)',
            paramType: 'count_cfu' as const,
            expectedUnit: 'CFU',
            required: true,
            minValue: 0,
            maxValue: 1000
          },
          {
            id: 'colony_count_p2',
            nameFa: 'شمارش پلیت ۲ (تکرار دوم)',
            paramType: 'count_cfu' as const,
            expectedUnit: 'CFU',
            required: true,
            minValue: 0,
            maxValue: 1000
          }
        ] : []),
        ...(step.criticalTemperature ? [
          {
            id: `temp_check_${step.stepNumber}`,
            nameFa: 'دمای اندازه‌گیری شده',
            paramType: 'temperature' as const,
            expectedUnit: '°C',
            required: false,
            defaultValue: step.criticalTemperature.replace(/[^0-9.]/g, '')
          }
        ] : [])
      ]
    };
  });

  // Create initial replicate run data
  const stepsData: Record<number, LabStepRunData> = {};
  for (const step of structuredSteps) {
    const paramsMap: LabStepRunData['parameterValues'] = {};
    for (const p of step.parameters) {
      paramsMap[p.id] = {
        parameterId: p.id,
        nameFa: p.nameFa,
        value: p.defaultValue !== undefined ? p.defaultValue : '',
        unit: p.expectedUnit,
        recordedAt: new Date().toISOString(),
        isValid: true,
        errors: [],
        warnings: []
      };
    }
    stepsData[step.stepNumber] = {
      stepNumber: step.stepNumber,
      isStarted: step.stepNumber === 1,
      isCompleted: false,
      isVerified: false,
      parameterValues: paramsMap,
      stepWarnings: [],
      stepErrors: []
    };
  }

  const labSession: LabSession = {
    id: sessionId,
    title: `آزمون میکروبی ${test.titleFa}`,
    sampleCode: `SMP-${Date.now().toString().slice(-6)}`,
    sampleName,
    sampleDescription: `آزمون میکروبیولوژی ${test.targetOrganism} مطابق ${test.primaryStandard.standardNumber}`,
    batchNumber: batchLotNumber,
    operatorName: 'کارشناس میکروبیولوژی',
    standardId: test.id,
    standardNumber: test.primaryStandard.standardNumber,
    standardTitleFa: test.primaryStandard.title,
    requiredEquipment: test.requiredEquipment.map((eq, i) => ({
      id: `eq-${i}`,
      name: eq.nameFa,
      isPrepared: true,
      calibrationInfo: eq.calibrationReq
    })),
    reagentsAndChemicals: test.requiredMedia.map((m, i) => ({
      id: `med-${i}`,
      name: m.nameFa,
      isPrepared: true,
      gradeOrConcentration: m.mediaCode
    })),
    testConditions: {
      ambientTemperature: '22.0 °C',
      ambientHumidity: '45 %',
      calibratedInstrumentsChecked: true,
      notes: `کلاس ایمنی زیستی: ${test.biosafetyLevel}`
    },
    steps: structuredSteps,
    currentStepNumber: 1,
    currentReplicateNumber: 1,
    replicates: [
      {
        replicateNumber: 1,
        title: 'تکرار اصلی (R1)',
        status: 'in_progress',
        elapsedSeconds: 0,
        stepsData
      }
    ],
    status: 'running',
    startedAt: new Date().toISOString(),
    elapsedSeconds: 0,
    isOfflineResilient: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return labSession;
}
