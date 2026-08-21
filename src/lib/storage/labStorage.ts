/**
 * Food Science AI - Digital Laboratory Storage Service
 * 
 * Persistent storage of lab runs, drafts, active execution sessions, and replicate data
 * in local IndexedDB. Fully resilient to offline conditions and network loss.
 */

import { executeTx, STORES, getAllItems, getItem, putItem, deleteItem } from './indexedDb';
import {
  LabSession,
  LabStepDefinition,
  LabStepRunData,
  LabReplicateRun,
  LabParameterDefinition
} from '../../types/laboratory';
import { FoodStandard } from '../../types/foodStandard';
import {
  validateStepRun,
  calculateRepeatabilityStatistics,
  evaluateSessionStandardConformance
} from '../laboratory/validationEngine';

/**
 * Creates empty initial run data for a step
 */
export function createDefaultStepRunData(stepDef: LabStepDefinition): LabStepRunData {
  const initialParams: LabStepRunData['parameterValues'] = {};
  
  for (const param of stepDef.parameters) {
    initialParams[param.id] = {
      parameterId: param.id,
      nameFa: param.nameFa,
      value: param.defaultValue !== undefined ? param.defaultValue : '',
      unit: param.expectedUnit,
      recordedAt: new Date().toISOString(),
      isValid: !param.required,
      errors: [],
      warnings: []
    };
  }

  return {
    stepNumber: stepDef.stepNumber,
    isStarted: false,
    isCompleted: false,
    isVerified: false,
    parameterValues: initialParams,
    stepWarnings: [],
    stepErrors: []
  };
}

/**
 * Creates an initial replicate structure
 */
export function createInitialReplicate(
  replicateNumber: number,
  steps: LabStepDefinition[]
): LabReplicateRun {
  const stepsData: Record<number, LabStepRunData> = {};
  for (const step of steps) {
    stepsData[step.stepNumber] = createDefaultStepRunData(step);
  }

  return {
    replicateNumber,
    title: `تکرار ${replicateNumber} (R${replicateNumber})`,
    status: 'pending',
    elapsedSeconds: 0,
    stepsData
  };
}

/**
 * Generates default structured steps if standard doesn't have broken-down steps
 */
export function generateDefaultStepsFromStandard(standard?: FoodStandard): LabStepDefinition[] {
  if (!standard) {
    return [
      {
        stepNumber: 1,
        titleFa: 'آماده‌سازی نمونه و شرایط آزمون',
        titleEn: 'Sample Preparation & Environmental Check',
        descriptionFa: 'بررسی دمای محیط، کالیبراسیون تجهیزات و همگن‌سازی نمونه آزمایشی.',
        instructions: [
          'ظروف و تجهیزات آزمایشگاهی را مطابق دستورالعمل تمیز و خشک کنید.',
          'دمای محیط آزمایشگاه و رطوبت نسبی را ثبت نمایید.',
          'نمونه غذایی را کاملاً یکنواخت و همگن کنید.'
        ],
        equipmentUsed: ['دماسنج / رطوبت‌سنج', 'ترازوی آنالیتیکال'],
        reagentsUsed: [],
        parameters: [
          {
            id: 'ambient_temp',
            nameFa: 'دمای محیط آزمایشگاه',
            paramType: 'temperature',
            expectedUnit: '°C',
            required: true,
            minValue: 10,
            maxValue: 40,
            defaultValue: 22,
            placeholder: 'مثلاً ۲۲.۵'
          },
          {
            id: 'sample_mass',
            nameFa: 'وزن اولیه نمونه آزمایشی',
            paramType: 'mass_weight',
            expectedUnit: 'g',
            required: true,
            minValue: 0.001,
            placeholder: 'مثلاً ۵.۰۰۰'
          }
        ],
        requiresVerificationBeforeNext: true,
        verificationPromptFa: 'صحت شرایط محیطی و کالیبراسیون ترازو مورد تأیید است.'
      },
      {
        stepNumber: 2,
        titleFa: 'اجرای آزمون اصلی و اندازه‌گیری',
        titleEn: 'Test Execution & Measurement',
        descriptionFa: 'انجام مراحل تیتراسیون، گرماسنجی، قرائت دستگاهی یا اسپکتروفتومتری.',
        instructions: [
          'محلول‌ها و معرف‌ها را مطابق روش استاندارد به نمونه اضافه نمایید.',
          'قرائت دستگاهی یا تیتراسیون را با دقت انجام دهید.'
        ],
        equipmentUsed: ['دستگاه اصلی اندازه‌گیری'],
        reagentsUsed: ['معرف استاندارد'],
        parameters: [
          {
            id: 'measured_param_1',
            nameFa: 'مقدار اندازه‌گیری‌شده اولیه',
            paramType: 'numeric',
            expectedUnit: '',
            required: true,
            placeholder: 'مقدار خوانده شده'
          }
        ],
        requiresVerificationBeforeNext: true,
        verificationPromptFa: 'قرائت دستگاهی یا حجم تیترانت با دقت ثبت شد.'
      },
      {
        stepNumber: 3,
        titleFa: 'محاسبات و نتیجه نهایی',
        titleEn: 'Calculations & Final Evaluation',
        descriptionFa: 'محاسبه غلظت یا شاخص نهایی و مقایسه با حدود استاندارد.',
        instructions: [
          'فرمول محاسبه استاندارد را اعمال نمایید.',
          'نتیجه را با حدود مجاز استاندارد مقایسه کنید.'
        ],
        equipmentUsed: [],
        reagentsUsed: [],
        parameters: [
          {
            id: 'final_result_value',
            nameFa: 'نتیجه نهایی محاسبه‌شده',
            paramType: 'numeric',
            expectedUnit: '%',
            required: true,
            placeholder: 'نتیجه نهایی'
          }
        ],
        requiresVerificationBeforeNext: true,
        verificationPromptFa: 'محاسبات و واحد نهایی بررسی و تأیید گردید.'
      }
    ];
  }

  // Extract from standard acceptable limits if available
  const paramList: LabParameterDefinition[] = [];
  if (standard.acceptableLimits && standard.acceptableLimits.length > 0) {
    standard.acceptableLimits.forEach((lim, idx) => {
      paramList.push({
        id: `limit_${lim.id || idx}`,
        nameFa: lim.parameterNameFa,
        paramType: 'numeric',
        expectedUnit: lim.unit || '',
        required: true,
        standardLimitKey: lim.id,
        expectedLimitText: lim.limitSpecification,
        helpText: `حد مجاز استاندارد: ${lim.limitSpecification} ${lim.unit || ''}`
      });
    });
  } else {
    paramList.push({
      id: 'main_result',
      nameFa: `نتیجه آزمون ${standard.titleFa}`,
      paramType: 'numeric',
      expectedUnit: '',
      required: true
    });
  }

  return [
    {
      stepNumber: 1,
      titleFa: 'آماده‌سازی تجهیزات و شرایط اولیه آزمون',
      titleEn: 'Equipment & Environmental Setup',
      descriptionFa: `بررسی الزامات استاندارد ${standard.standardNumber} شامل تجهیزات و شرایط محیطی.`,
      instructions: [
        `تجهیزات اعلام‌شده در استاندارد (${standard.requiredEquipment.join('، ') || 'تجهیزات عمومی'}) آماده و کالیبره شوند.`,
        `شرایط محیطی استاندارد (${standard.testConditions || 'دمای معمول آزمایشگاه'}) کنترل شود.`,
        'نمونه را با دقت توزین و آماده‌سازی نمایید.'
      ],
      equipmentUsed: standard.requiredEquipment,
      reagentsUsed: standard.reagentsAndChemicals,
      parameters: [
        {
          id: 'env_temp',
          nameFa: 'دمای محیط آزمون',
          paramType: 'temperature',
          expectedUnit: '°C',
          required: true,
          defaultValue: 20,
          placeholder: 'مثلاً ۲۰.۰'
        },
        {
          id: 'sample_weight',
          nameFa: 'وزن نمونه برداشته‌شده',
          paramType: 'mass_weight',
          expectedUnit: 'g',
          required: true,
          placeholder: 'مثلاً ۱۰.۰۰۰'
        }
      ],
      requiresVerificationBeforeNext: true,
      verificationPromptFa: 'تجهیزات و شرایط محیطی مطابق الزامات استاندارد بررسی و آماده گردید.'
    },
    {
      stepNumber: 2,
      titleFa: 'اجرای دستورالعمل و اندازه‌گیری پارامترها',
      titleEn: 'Standard Procedure & Measurement',
      descriptionFa: standard.testProcedure || 'اجرای مراحل آزمون بر اساس بندهای استاندارد مرجع.',
      instructions: standard.testProcedure
        ? [standard.testProcedure]
        : ['مراحل آزمون را بر اساس دستورالعمل مرجع اجرا نمایید.'],
      equipmentUsed: standard.requiredEquipment,
      reagentsUsed: standard.reagentsAndChemicals,
      safetyWarnings: standard.errorsAndSafetyWarnings ? [standard.errorsAndSafetyWarnings] : undefined,
      parameters: paramList,
      requiresVerificationBeforeNext: true,
      verificationPromptFa: 'تمام پارامترهای آزمون با رعایت نکات ایمنی و دقت اندازه‌گیری و ثبت شدند.'
    },
    {
      stepNumber: 3,
      titleFa: 'ثبت نتیجه نهایی و ارزیابی انطباق با استاندارد',
      titleEn: 'Final Result & Standard Conformance Evaluation',
      descriptionFa: `مقایسه نتایج تکرارها با حدود مجاز استاندارد ملی/بین‌المللی ${standard.standardNumber}.`,
      instructions: [
        'میانگین نتایج تکرارها و انحراف معیار را بررسی نمایید.',
        `فرمول محاسباتی استاندارد: ${standard.calculationsAndFormulas || 'محاسبه مستقیم'}`
      ],
      equipmentUsed: [],
      reagentsUsed: [],
      parameters: [
        {
          id: 'operator_observation',
          nameFa: 'مشاهدات و یادداشت‌های نهایی آنالیزور',
          paramType: 'text_observation',
          expectedUnit: '',
          required: false,
          placeholder: 'توضیحات اختیاری در خصوص رفتار نمونه، رنگ، بو یا انحرافات احتمالی...'
        }
      ],
      requiresVerificationBeforeNext: true,
      verificationPromptFa: 'انطباق نتیجه با حدود مجاز استاندارد بررسی و مورد تأیید است.'
    }
  ];
}

/**
 * Creates a brand-new laboratory session
 */
export function createNewLabSession(options: {
  title: string;
  sampleCode: string;
  sampleName: string;
  sampleDescription?: string;
  batchNumber?: string;
  operatorName: string;
  supervisorName?: string;
  laboratoryRoom?: string;
  notes?: string;
  standard?: FoodStandard;
  customSteps?: LabStepDefinition[];
  replicateCount?: number;
}): LabSession {
  const steps = options.customSteps || generateDefaultStepsFromStandard(options.standard);
  const repCount = Math.max(1, options.replicateCount || 2);
  const replicates: LabReplicateRun[] = [];

  for (let i = 1; i <= repCount; i++) {
    replicates.push(createInitialReplicate(i, steps));
  }

  // Set first replicate in progress
  if (replicates.length > 0) {
    replicates[0].status = 'in_progress';
    replicates[0].startedAt = new Date().toISOString();
  }

  const requiredEquipment = options.standard?.requiredEquipment
    ? options.standard.requiredEquipment.map((name, idx) => ({
        id: `eq_${idx}`,
        name,
        isPrepared: false
      }))
    : [];

  const reagentsAndChemicals = options.standard?.reagentsAndChemicals
    ? options.standard.reagentsAndChemicals.map((name, idx) => ({
        id: `reag_${idx}`,
        name,
        isPrepared: false
      }))
    : [];

  const now = new Date().toISOString();

  const session: LabSession = {
    id: `lab_session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    title: options.title || `آزمایش ${options.sampleName} (${options.standard?.standardNumber || 'سفارشی'})`,
    sampleCode: options.sampleCode,
    sampleName: options.sampleName,
    sampleDescription: options.sampleDescription,
    batchNumber: options.batchNumber,
    operatorName: options.operatorName,
    supervisorName: options.supervisorName,
    laboratoryRoom: options.laboratoryRoom,
    notes: options.notes,
    
    // Standard link
    standardId: options.standard?.id,
    standardNumber: options.standard?.standardNumber,
    standardTitleFa: options.standard?.titleFa,
    standardSector: options.standard?.sector,
    standardRevision: options.standard?.revisionAndYear,
    issuingOrganization: options.standard?.issuingOrganization,
    standardSnapshot: options.standard,

    // Requirements
    requiredEquipment,
    reagentsAndChemicals,
    testConditions: {
      ambientTemperature: '22',
      ambientHumidity: '45',
      calibratedInstrumentsChecked: false,
      notes: options.standard?.testConditions
    },

    // Steps & Execution
    steps,
    currentStepNumber: 1,
    currentReplicateNumber: 1,
    replicates,

    // State & Timer
    status: 'running',
    startedAt: now,
    elapsedSeconds: 0,
    isOfflineResilient: true,
    createdAt: now,
    updatedAt: now
  };

  return session;
}

/**
 * Gets all saved lab sessions from IndexedDB
 */
export async function getAllLabSessions(): Promise<LabSession[]> {
  try {
    const sessions = await getAllItems<LabSession>(STORES.LAB_SESSIONS);
    return sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.error('Error fetching lab sessions from IndexedDB:', err);
    return [];
  }
}

/**
 * Gets a single lab session by ID
 */
export async function getLabSessionById(id: string): Promise<LabSession | null> {
  try {
    return await getItem<LabSession>(STORES.LAB_SESSIONS, id);
  } catch (err) {
    console.error(`Error fetching lab session ${id}:`, err);
    return null;
  }
}

/**
 * Saves or updates a lab session in IndexedDB (Auto-saved during offline & online)
 */
export async function saveLabSession(session: LabSession): Promise<void> {
  try {
    const updatedSession: LabSession = {
      ...session,
      isOfflineResilient: true,
      updatedAt: new Date().toISOString()
    };

    // Recompute statistical analysis and standard conformance before saving
    const mainParamValues: number[] = [];
    for (const rep of updatedSession.replicates) {
      for (const stepKey of Object.keys(rep.stepsData)) {
        const stepRun = rep.stepsData[Number(stepKey)];
        if (!stepRun) continue;
        for (const pVal of Object.values(stepRun.parameterValues)) {
          if (typeof pVal.value === 'number' && !isNaN(pVal.value)) {
            mainParamValues.push(pVal.value);
            break; // take first primary parameter per step
          }
        }
      }
    }

    updatedSession.repeatabilityAnalysis = calculateRepeatabilityStatistics(
      mainParamValues,
      updatedSession.standardSnapshot?.acceptableLimits?.[0]?.tolerance
    );

    updatedSession.standardConformance = evaluateSessionStandardConformance(updatedSession);

    await putItem(STORES.LAB_SESSIONS, updatedSession);
  } catch (err) {
    console.error('Failed to save lab session in IndexedDB:', err);
    throw err;
  }
}

/**
 * Deletes a lab session from IndexedDB
 */
export async function deleteLabSession(id: string): Promise<void> {
  try {
    await deleteItem(STORES.LAB_SESSIONS, id);
  } catch (err) {
    console.error(`Failed to delete lab session ${id}:`, err);
    throw err;
  }
}

/**
 * Gets the most recently active or paused session
 */
export async function getActiveLabSession(): Promise<LabSession | null> {
  const sessions = await getAllLabSessions();
  return sessions.find((s) => s.status === 'running' || s.status === 'paused') || null;
}
