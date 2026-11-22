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
import { FoodExperiment } from '../../types/foodExperiment';
import {
  validateStepRun,
  calculateRepeatabilityStatistics,
  evaluateSessionStandardConformance
} from '../laboratory/validationEngine';
import { buildEquipmentChecklistForExperiment } from '../equipment/equipmentChecklistEngine';
import { extractQCItemsFromExperiment } from '../qc/experimentQCEngine';

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

    workflowStage: 'start_objective',
    equipmentChecklist: options.standard
      ? buildEquipmentChecklistForExperiment({
          id: options.standard.id,
          code: options.standard.standardNumber,
          titleFa: options.standard.titleFa,
          domain: 'chemical_analysis',
          product: options.sampleName,
          purpose: options.notes || options.standard.titleFa,
          principle: '',
          scope: '',
          equipment: (options.standard.requiredEquipment || []).map((name) => ({ name, isRequired: true })),
          reagents: (options.standard.reagentsAndChemicals || []).map((name) => ({ name })),
          procedureSteps: [],
          calculations: { formulaExpression: '', descriptionFa: '', variables: [], calculationFunction: () => 0 },
          verificationStatus: 'verified',
          reporting: { unitOfMeasurement: '%' }
        } as any)
      : [],
    calibrationCheckDone: false,
    reagentsCheckDone: false,

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
 * Creates a complete digital laboratory session from a standard FoodExperiment (Part 34 of 40)
 * Bridges verified experiments directly to the real 7-stage digital laboratory workflow.
 */
export function createLabSessionFromExperiment(
  experiment: FoodExperiment,
  options?: {
    sampleCode?: string;
    sampleName?: string;
    operatorName?: string;
    batchNumber?: string;
    laboratoryRoom?: string;
    replicateCount?: number;
  }
): LabSession {
  const sampleName = options?.sampleName || experiment.product || experiment.titleFa;
  const sampleCode = options?.sampleCode || `SMP-${experiment.code || 'EXP'}-${Math.floor(1000 + Math.random() * 9000)}`;
  const operatorName = options?.operatorName || 'کارشناس کنترل کیفیت';
  const repCount = Math.max(1, options?.replicateCount || 2);

  // Generate structured LabStepDefinition[] from experiment.procedureSteps
  const steps: LabStepDefinition[] = [];
  if (experiment.procedureSteps && experiment.procedureSteps.length > 0) {
    experiment.procedureSteps.forEach((pStep, idx) => {
      const params: LabParameterDefinition[] = [];

      // Check if step defines amount or duration
      if (pStep.amount && pStep.unit) {
        const isMass = pStep.unit.toLowerCase().includes('g') || pStep.unit.includes('گرم');
        const isVolume = pStep.unit.toLowerCase().includes('ml') || pStep.unit.includes('میلی');
        params.push({
          id: `step_${pStep.stepNumber}_amt`,
          nameFa: `مقدار مصرفی (${pStep.title})`,
          paramType: isMass ? 'mass_weight' : isVolume ? 'volume' : 'numeric',
          expectedUnit: pStep.unit,
          required: false,
          defaultValue: typeof pStep.amount === 'number' ? pStep.amount : parseFloat(String(pStep.amount)) || undefined
        });
      }

      if (idx === experiment.procedureSteps.length - 1 && experiment.calculations && experiment.calculations.variables) {
        // Final calculation step: add calculation variables as parameters
        const primaryCalc = experiment.calculations;
        primaryCalc.variables.forEach((v) => {
          params.push({
            id: `calc_var_${v.symbol}`,
            nameFa: `${v.name} (${v.symbol})`,
            paramType: v.unit === '%' ? 'percentage' : v.unit === 'g' ? 'mass_weight' : v.unit === 'mL' ? 'volume' : 'numeric',
            expectedUnit: v.unit,
            required: true,
            placeholder: `مثلاً مقدار ${v.symbol}`
          });
        });

        // Compute limit text safely
        let limitText: string | undefined = undefined;
        if (experiment.acceptanceCriteria) {
          if (typeof experiment.acceptanceCriteria === 'object' && !Array.isArray(experiment.acceptanceCriteria)) {
            const crit = experiment.acceptanceCriteria as any;
            if (crit.legalLimits) {
              limitText = Array.isArray(crit.legalLimits)
                ? crit.legalLimits.map((l: any) => `${l.foodType}: ${l.maxLimit ?? l.limit ?? ''}`).join(' | ')
                : String(crit.legalLimits);
            }
          } else if (Array.isArray(experiment.acceptanceCriteria)) {
            limitText = experiment.acceptanceCriteria.join(' | ');
          }
        }

        // Final result parameter
        params.push({
          id: 'primary_result',
          nameFa: `نتیجه نهایی (${experiment.reporting?.unitOfMeasurement || '%'})`,
          paramType: 'numeric',
          expectedUnit: experiment.reporting?.unitOfMeasurement || '%',
          required: true,
          decimalPrecision: experiment.reporting?.decimalPrecision ?? 2,
          expectedLimitText: limitText
        });
      }

      const stepEquip = (pStep.equipment || []).map((e: any) => (typeof e === 'string' ? e : e.name || ''));

      steps.push({
        stepNumber: pStep.stepNumber,
        titleFa: pStep.title,
        descriptionFa: pStep.description,
        instructions: [pStep.description, pStep.criticalCaution].filter(Boolean) as string[],
        equipmentUsed: stepEquip,
        reagentsUsed: [],
        safetyWarnings: pStep.warning ? [pStep.warning] : undefined,
        parameters: params,
        requiresVerificationBeforeNext: true,
        verificationPromptFa: `صحت اجرای گام ${pStep.stepNumber} («${pStep.title}») مطابق استاندارد مرجع مورد تأیید است.`
      });
    });
  } else {
    // Fallback standard 3-step protocol
    const allEq = (experiment.equipment || []).map((e: any) => (typeof e === 'string' ? e : e.name || ''));
    const allReag = (experiment.reagents || []).map((r: any) => (typeof r === 'string' ? r : r.name || ''));

    steps.push(
      {
        stepNumber: 1,
        titleFa: 'آماده‌سازی نمونه و شرایط محیطی',
        titleEn: 'Sample Prep & Environmental Setup',
        descriptionFa: 'توزین دقیق نمونه و ثبت دمای محیط آزمون',
        instructions: ['نمونه را همگن کرده و به دقت توزین کنید.'],
        equipmentUsed: allEq,
        reagentsUsed: allReag,
        parameters: [
          {
            id: 'sample_mass',
            nameFa: 'وزن دقیق نمونه آزمایشی',
            paramType: 'mass_weight',
            expectedUnit: 'g',
            required: true,
            placeholder: 'مثلاً ۵.۰۰۰'
          }
        ],
        requiresVerificationBeforeNext: true
      },
      {
        stepNumber: 2,
        titleFa: 'اجرای دستورالعمل آزمون و اندازه‌گیری',
        titleEn: 'Procedure Execution & Reading',
        descriptionFa: experiment.purpose || 'اجرای آزمون طبق استاندارد مرجع',
        instructions: ['مراحل واکنش، تیتراسیون یا قرائت دستگاهی را انجام دهید.'],
        equipmentUsed: allEq,
        reagentsUsed: allReag,
        parameters: [
          {
            id: 'measured_reading',
            nameFa: 'قرائت یا حجم مصرفی',
            paramType: 'numeric',
            expectedUnit: experiment.reporting?.unitOfMeasurement || '%',
            required: true
          }
        ],
        requiresVerificationBeforeNext: true
      }
    );
  }

  // Equipment mapping
  const requiredEquipment = (experiment.equipment || []).map((e: any, idx) => ({
    id: `eq_${idx}`,
    name: typeof e === 'string' ? e : e.name || `تجهیز ${idx + 1}`,
    isPrepared: false,
    calibrationInfo: typeof e === 'object' && e.calibrationRequirement
      ? e.calibrationRequirement
      : 'بررسی رواداری، تراز بودن و برچسب کالیبراسیون معتبر'
  }));

  // Reagents mapping
  const rawReagents = experiment.reagents || (experiment as any).reagentsAndMaterials || [];
  const reagentsAndChemicals = rawReagents.map((r: any, idx: number) => ({
    id: `reag_${idx}`,
    name: typeof r === 'string' ? r : r.name || `معرف ${idx + 1}`,
    isPrepared: false,
    gradeOrConcentration: typeof r === 'object' && r.grade ? r.grade : 'درجه آنالیتیکال (AR) یا گرید استاندارد',
    safetyInfo: typeof r === 'object' && r.hazardClass ? `کلاس خطر: ${r.hazardClass}` : 'رعایت برگه ایمنی مواد شیمیایی (MSDS)'
  }));

  // Sample Prep Data (Part 36: 5-stage pipeline & multi-method support)
  const defaultMethod = experiment.samplePrepMethods?.[0];
  const prep = experiment.samplePreparation;
  const isPrepObject = prep !== null && typeof prep === 'object';
  const prepObj: Record<string, any> | undefined = isPrepObject ? (prep as Record<string, any>) : undefined;
  
  const samplePrepData = {
    isPrepared: false,
    selectedMethodId: defaultMethod?.id || 'method-default',
    selectedMethodTitle: defaultMethod?.methodTitleFa || 'روش استاندارد آماده‌سازی',
    sampleType: defaultMethod?.sample?.sampleType || '',
    sampleWeightGrams: defaultMethod?.sample?.sampleAmount || (prepObj ? (prepObj.sampleWeight || '') : ''),
    containerUsed: defaultMethod?.sampling?.containers?.[0] || '',
    appearanceObservation: '',
    homogenizationTool: defaultMethod?.preparation?.homogenization || (prepObj ? (prepObj.homogenizationMethod || 'هموژنایزر / آسیاب آزمایشگاهی') : 'هموژنایزر / آسیاب آزمایشگاهی'),
    dilutionFactor: defaultMethod?.preparation?.dilution?.dilutionFactor ? String(defaultMethod.preparation.dilution.dilutionFactor) : '1',
    storageTemperatureRecorded: defaultMethod?.conditioning?.temperature || '۲۰ الی ۲۵ درجه سلسیوس',
    notes: defaultMethod?.preparation?.preliminaryPrep || (typeof prep === 'string'
      ? prep
      : prepObj ? (prepObj.environmentalConditions || '') : '')
  };

  const replicates: LabReplicateRun[] = [];
  for (let i = 1; i <= repCount; i++) {
    replicates.push(createInitialReplicate(i, steps));
  }
  if (replicates.length > 0) {
    replicates[0].status = 'in_progress';
    replicates[0].startedAt = new Date().toISOString();
  }

  const now = new Date().toISOString();

  const envNotes = typeof experiment.environmentalConditions === 'string'
    ? experiment.environmentalConditions
    : experiment.environmentalConditions?.temperatureRange || 'دمای محیط ۲۰ تا ۲۵ درجه سلسیوس';

  const notesText = Array.isArray(experiment.notes)
    ? experiment.notes.join('\n')
    : experiment.notes || experiment.purpose || '';

  const activeStd = experiment.standardReference || experiment.standardReferences?.[0];

  return {
    id: `lab_session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    title: `آزمایش ${experiment.titleFa} (${activeStd?.organization || 'INSO'} ${activeStd?.standardNumber || ''})`,
    sampleCode,
    sampleName,
    batchNumber: options?.batchNumber || `LOT-${new Date().getFullYear()}-01`,
    operatorName,
    laboratoryRoom: options?.laboratoryRoom || 'سالن کنترل کیفیت شیمیایی',
    notes: notesText,
    
    // Standard linkage
    standardNumber: activeStd?.standardNumber,
    standardTitleFa: activeStd?.titleFa || experiment.titleFa,
    issuingOrganization: activeStd?.organization,
    standardSector: 'general_sampling' as const,

    requiredEquipment,
    reagentsAndChemicals,
    testConditions: {
      ambientTemperature: '22',
      ambientHumidity: '45',
      calibratedInstrumentsChecked: false,
      notes: envNotes
    },

    workflowStage: 'start_objective',
    equipmentChecklist: buildEquipmentChecklistForExperiment(experiment),
    calibrationCheckDone: false,
    reagentsCheckDone: false,
    samplePrepData,

    steps,
    currentStepNumber: 1,
    currentReplicateNumber: 1,
    replicates,
    qcItems: extractQCItemsFromExperiment(experiment),

    status: 'running',
    startedAt: now,
    elapsedSeconds: 0,
    isOfflineResilient: true,
    createdAt: now,
    updatedAt: now
  };
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

/**
 * Creates a comprehensive, fully verified Demo/Test Lab Session with explicit [TEST-MOCK] tags.
 * Demonstrates the 12-link experiment chain without polluting real laboratory data.
 */
export function createTestMockLabSession(): LabSession {
  const now = new Date().toISOString();
  const sessionId = `test_mock_session_${Date.now()}`;

  const steps: LabStepDefinition[] = [
    {
      stepNumber: 1,
      titleFa: 'توزین دقیق نمونه روغنی در ارلن مایر [TEST-MOCK]',
      titleEn: 'Accurate Weighing of Oil Sample into Erlenmeyer',
      descriptionFa: 'توزین دقیق ۵ الی ۱۰ گرم روغن با ترازوی آنالیتیکال ۴ رقمی',
      instructions: [
        'ارلن خشک و تمیز ۲۵۰ میلی‌لیتر را روی کفه ترازو قرار داده و کلید Tare را فشار دهید.',
        'حدود ۵ گرم از نمونه روغن را با پیپت به داخل ارلن اضافه کنید و وزن را با دقت ۰.۰۰۰۱ گرم ثبت نمایید.'
      ],
      equipmentUsed: ['ترازوی آنالیتیکال ۴ رقم اعشار [TEST-MOCK]', 'ارلن مایر ۲۵۰ میلی‌لیتر'],
      reagentsUsed: [],
      requiresVerificationBeforeNext: true,
      parameters: [
        {
          id: 'step1_oil_weight',
          nameFa: 'وزن دقیق نمونه روغن (m)',
          paramType: 'mass_weight',
          expectedUnit: 'g',
          required: true,
          decimalPrecision: 4
        }
      ]
    },
    {
      stepNumber: 2,
      titleFa: 'افزودن مخلوط حلال خنثی و انحلال [TEST-MOCK]',
      titleEn: 'Addition of Neutralized Solvent Mixture and Dissolution',
      descriptionFa: 'افزودن ۵۰ میلی‌لیتر مخلوط اتانول/اتر خنثی‌شده و حل کامل نمونه',
      instructions: [
        '۵۰ میلی‌لیتر مخلوط حلال اتانول ۹۶٪ و دی‌اتیل اتر (۱:۱) که از قبل با KOH خنثی شده است اضافه کنید.',
        'ارلن را به آرامی بچرخانید تا نمونه کاملاً حل شود.'
      ],
      equipmentUsed: ['استوانه مدرج ۵۰ میلی‌لیتر'],
      reagentsUsed: ['مخلوط حلال اتانول/دی‌اتیل اتر خنثی [TEST-MOCK]'],
      requiresVerificationBeforeNext: true,
      parameters: [
        {
          id: 'step2_solvent_vol',
          nameFa: 'حجم حلال افزوده شده',
          paramType: 'volume',
          expectedUnit: 'mL',
          required: true,
          decimalPrecision: 1
        }
      ]
    },
    {
      stepNumber: 3,
      titleFa: 'تیتراسیون با هیدروکسید پتاسیم استاندارد و محاسبه [TEST-MOCK]',
      titleEn: 'Titration with Standard KOH and Calculation',
      descriptionFa: 'تیتراسیون با KOH 0.1 M در حضور معرف فنل‌فتالئین تا رنگ صورتی پایدار',
      instructions: [
        '۳ قطره شناساگر فنل‌فتالئین به محتویات ارلن بیفزایید.',
        'با محلول هیدروکسید پتاسیم استاندارد ۰.۱ مولار با سرعت قطره‌ای تیتر کنید تا رنگ صورتی کم‌رنگ به مدت حداقل ۱۵ ثانیه پایدار بماند.',
        'حجم مصرفی تیترانت (V) و حجم آزمون شاهد (V_blank) را ثبت نمایید.'
      ],
      equipmentUsed: ['بورت مدرج کالیبره دیجیتال [TEST-MOCK]'],
      reagentsUsed: ['هیدروکسید پتاسیم ۰.۱ نرمال [TEST-MOCK]', 'شناساگر فنل‌فتالئین ۱٪ [TEST-MOCK]'],
      requiresVerificationBeforeNext: true,
      parameters: [
        {
          id: 'step3_titrant_vol',
          nameFa: 'حجم مصرفی KOH نمونه (V)',
          paramType: 'volume',
          expectedUnit: 'mL',
          required: true,
          decimalPrecision: 2
        },
        {
          id: 'step3_blank_vol',
          nameFa: 'حجم مصرفی KOH شاهد (V_blank)',
          paramType: 'volume',
          expectedUnit: 'mL',
          required: true,
          decimalPrecision: 2
        },
        {
          id: 'step3_koh_normality',
          nameFa: 'نرمالیته فاکتوردار تیترانت (N)',
          paramType: 'numeric',
          expectedUnit: 'mol/L',
          required: true,
          decimalPrecision: 4
        },
        {
          id: 'step3_final_acid_value',
          nameFa: 'عدد اسیدی محاسبه‌شده (AV)',
          paramType: 'numeric',
          expectedUnit: 'mg KOH/g',
          required: true,
          decimalPrecision: 3,
          expectedLimitText: 'حداکثر ۰.۲۰ mg KOH/g (استاندارد ملی INSO 4179)'
        }
      ]
    }
  ];

  // Replicate 1 Run Data
  const rep1Steps: Record<number, LabStepRunData> = {
    1: {
      stepNumber: 1,
      isStarted: true,
      isCompleted: true,
      isVerified: true,
      verifiedAt: now,
      recordedTime: '10:05',
      recordedTemperature: '22.4',
      recordedWeight: '5.0210',
      recordedEquipment: ['ترازوی آنالیتیکال ۴ رقم اعشار [TEST-MOCK]'],
      operatorNotes: 'وزن آزمایه با ترازوی ۴ رقمی بدون نوسان ثبت شد [TEST-MOCK].',
      stepWarnings: [],
      stepErrors: [],
      parameterValues: {
        step1_oil_weight: {
          parameterId: 'step1_oil_weight',
          nameFa: 'وزن دقیق نمونه روغن (m)',
          value: 5.0210,
          unit: 'g',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        }
      }
    },
    2: {
      stepNumber: 2,
      isStarted: true,
      isCompleted: true,
      isVerified: true,
      verifiedAt: now,
      recordedTime: '10:12',
      recordedVolume: '50.0',
      recordedEquipment: ['استوانه مدرج ۵۰ میلی‌لیتر'],
      operatorNotes: 'حلال خنثی‌شده بدون رنگ اضافه شد و شفافیت محلول کامل بود [TEST-MOCK].',
      stepWarnings: [],
      stepErrors: [],
      parameterValues: {
        step2_solvent_vol: {
          parameterId: 'step2_solvent_vol',
          nameFa: 'حجم حلال افزوده شده',
          value: 50.0,
          unit: 'mL',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        }
      }
    },
    3: {
      stepNumber: 3,
      isStarted: true,
      isCompleted: true,
      isVerified: true,
      verifiedAt: now,
      recordedTime: '10:18',
      recordedVolume: '1.42',
      recordedEquipment: ['بورت مدرج کالیبره دیجیتال [TEST-MOCK]'],
      operatorNotes: 'ظهور رنگ صورتی کم‌رنگ پایدار در حجم ۱.۴۲ میلی‌لیتر تایید گردید [TEST-MOCK].',
      stepWarnings: [],
      stepErrors: [],
      parameterValues: {
        step3_titrant_vol: {
          parameterId: 'step3_titrant_vol',
          nameFa: 'حجم مصرفی KOH نمونه (V)',
          value: 1.42,
          unit: 'mL',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        },
        step3_blank_vol: {
          parameterId: 'step3_blank_vol',
          nameFa: 'حجم مصرفی KOH شاهد (V_blank)',
          value: 0.02,
          unit: 'mL',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        },
        step3_koh_normality: {
          parameterId: 'step3_koh_normality',
          nameFa: 'نرمالیته فاکتوردار تیترانت (N)',
          value: 0.1000,
          unit: 'mol/L',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        },
        step3_final_acid_value: {
          parameterId: 'step3_final_acid_value',
          nameFa: 'عدد اسیدی محاسبه‌شده (AV)',
          value: 0.156,
          unit: 'mg KOH/g',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        }
      }
    }
  };

  // Replicate 2 Run Data
  const rep2Steps: Record<number, LabStepRunData> = {
    1: {
      stepNumber: 1,
      isStarted: true,
      isCompleted: true,
      isVerified: true,
      verifiedAt: now,
      recordedTime: '10:25',
      recordedTemperature: '22.5',
      recordedWeight: '5.0180',
      recordedEquipment: ['ترازوی آنالیتیکال ۴ رقم اعشار [TEST-MOCK]'],
      operatorNotes: 'توزین تکرار دوم انجام شد [TEST-MOCK].',
      stepWarnings: [],
      stepErrors: [],
      parameterValues: {
        step1_oil_weight: {
          parameterId: 'step1_oil_weight',
          nameFa: 'وزن دقیق نمونه روغن (m)',
          value: 5.0180,
          unit: 'g',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        }
      }
    },
    2: {
      stepNumber: 2,
      isStarted: true,
      isCompleted: true,
      isVerified: true,
      verifiedAt: now,
      recordedTime: '10:30',
      recordedVolume: '50.0',
      recordedEquipment: ['استوانه مدرج ۵۰ میلی‌لیتر'],
      operatorNotes: 'حلال افزوده و تکان داده شد [TEST-MOCK].',
      stepWarnings: [],
      stepErrors: [],
      parameterValues: {
        step2_solvent_vol: {
          parameterId: 'step2_solvent_vol',
          nameFa: 'حجم حلال افزوده شده',
          value: 50.0,
          unit: 'mL',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        }
      }
    },
    3: {
      stepNumber: 3,
      isStarted: true,
      isCompleted: true,
      isVerified: true,
      verifiedAt: now,
      recordedTime: '10:36',
      recordedVolume: '1.44',
      recordedEquipment: ['بورت مدرج کالیبره دیجیتال [TEST-MOCK]'],
      operatorNotes: 'تیتراسیون تکرار دوم با مصرف ۱.۴۴ میلی‌لیتر پایان یافت [TEST-MOCK].',
      stepWarnings: [],
      stepErrors: [],
      parameterValues: {
        step3_titrant_vol: {
          parameterId: 'step3_titrant_vol',
          nameFa: 'حجم مصرفی KOH نمونه (V)',
          value: 1.44,
          unit: 'mL',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        },
        step3_blank_vol: {
          parameterId: 'step3_blank_vol',
          nameFa: 'حجم مصرفی KOH شاهد (V_blank)',
          value: 0.02,
          unit: 'mL',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        },
        step3_koh_normality: {
          parameterId: 'step3_koh_normality',
          nameFa: 'نرمالیته فاکتوردار تیترانت (N)',
          value: 0.1000,
          unit: 'mol/L',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        },
        step3_final_acid_value: {
          parameterId: 'step3_final_acid_value',
          nameFa: 'عدد اسیدی محاسبه‌شده (AV)',
          value: 0.159,
          unit: 'mg KOH/g',
          recordedAt: now,
          isValid: true,
          errors: [],
          warnings: []
        }
      }
    }
  };

  const replicates: LabReplicateRun[] = [
    {
      replicateNumber: 1,
      title: 'تکرار ۱ (R1) [TEST-MOCK]',
      status: 'completed',
      startedAt: now,
      completedAt: now,
      elapsedSeconds: 780,
      stepsData: rep1Steps,
      calculatedResult: {
        primaryValue: 0.156,
        unit: 'mg KOH/g',
        formulaUsed: 'AV = (56.1 * (V - V_blank) * N) / m',
        details: 'AV = (56.1 * (1.42 - 0.02) * 0.1000) / 5.0210 = 0.156 mg KOH/g [TEST-MOCK]'
      }
    },
    {
      replicateNumber: 2,
      title: 'تکرار ۲ (R2) [TEST-MOCK]',
      status: 'completed',
      startedAt: now,
      completedAt: now,
      elapsedSeconds: 660,
      stepsData: rep2Steps,
      calculatedResult: {
        primaryValue: 0.159,
        unit: 'mg KOH/g',
        formulaUsed: 'AV = (56.1 * (V - V_blank) * N) / m',
        details: 'AV = (56.1 * (1.44 - 0.02) * 0.1000) / 5.0180 = 0.159 mg KOH/g [TEST-MOCK]'
      }
    }
  ];

  return {
    id: sessionId,
    isDemoOrTest: true,
    testTag: 'TEST-MOCK',
    title: '[TEST-MOCK] تعیین عدد اسیدی روغن آفتابگردان (INSO 4179 / ISO 660)',
    sampleCode: 'TEST-OIL-001',
    sampleName: '[TEST-MOCK] نمونه آزمایشی روغن آفتابگردان تصفیه‌شده',
    sampleDescription: 'نمونه شبیه‌سازی‌شده آزمون آزمایشگاهی جهت راستی‌آزمایی زنجیره ۱۲ مرحله‌ای آزمایش',
    batchNumber: 'LOT-TEST-2026-X',
    productionDate: '2026-03-01',
    expiryDate: '2027-03-01',
    operatorName: 'کارشناس تست کیفیت (TEST-OPERATOR)',
    supervisorName: 'دکتر ناظر کنترل کیفیت (TEST-SUPERVISOR)',
    laboratoryRoom: 'ایستگاه تست و کالیبراسیون ۲ [TEST]',
    notes: 'آزمون شبیه‌سازی‌شده کامل مطابق بند ۶ استاندارد ملی INSO 4179 و ISO 660 جهت صحه‌گذاری فنی سیستم.',

    standardNumber: 'INSO 4179 / ISO 660 [TEST]',
    standardTitleFa: 'روغن‌ها و چربی‌های خوراکی - اندازه‌گیری عدد اسیدی و اسیدیته آزاد',
    issuingOrganization: 'INSO',
    standardSector: 'general_sampling',

    requiredEquipment: [
      { id: 'eq_test_1', name: 'ترازوی تحلیلی ۴ رقم اعشار [TEST-MOCK]', isPrepared: true, calibrationInfo: 'کالیبره معتبر طبق گواهی CAL-TEST-2026' },
      { id: 'eq_test_2', name: 'بورت دیجیتال مدرج کلاس A [TEST-MOCK]', isPrepared: true, calibrationInfo: 'رواداری ±0.01 mL مورد تایید' },
      { id: 'eq_test_3', name: 'ارلن مایر دهان‌گشاد ۲۵۰ میلی‌لیتر', isPrepared: true, calibrationInfo: 'شیشه‌آلات بوروسیلیکات خشک و تمیز' }
    ],

    reagentsAndChemicals: [
      { id: 'reag_test_1', name: 'هیدروکسید پتاسیم ۰.۱ مولار فاکتوردار [TEST-MOCK]', isPrepared: true, gradeOrConcentration: 'Standard Titrant (0.1000 M)', safetyInfo: 'محلول خورنده - استفاده از دستکش و عینک' },
      { id: 'reag_test_2', name: 'مخلوط حلال اتانول/اتر ۱:۱ خنثی‌شده [TEST-MOCK]', isPrepared: true, gradeOrConcentration: 'AR Grade', safetyInfo: 'اشتعال‌پذیر - کار در زیر هود آزمایشگاه' },
      { id: 'reag_test_3', name: 'شناساگر فنل‌فتالئین ۱٪ در اتانول [TEST-MOCK]', isPrepared: true, gradeOrConcentration: 'Analytical Indicator', safetyInfo: 'حفاظت در برابر نور مستقیم' }
    ],

    testConditions: {
      ambientTemperature: '22.5',
      ambientHumidity: '44',
      calibratedInstrumentsChecked: true,
      notes: 'دمای محیط ۲۲.۵ درجه و رطوبت ۴۴٪ پایدار [TEST-MOCK]'
    },

    workflowStage: 'finalize',
    calibrationCheckDone: true,
    reagentsCheckDone: true,

    samplePrepData: {
      isPrepared: true,
      selectedMethodId: 'method_chem_acid_liquid_oils',
      selectedMethodTitle: 'روش استاندارد آماده‌سازی روغن‌های مایع خوراکی [TEST-MOCK]',
      sampleType: 'روغن مایع خوراکی زلال فاقد رسوب',
      sampleWeightGrams: 5.0210,
      sampleVolumeMl: 5.4,
      containerUsed: 'ظرف شیشه‌ای کهربایی درپوش‌دار هوابند [TEST-MOCK]',
      appearanceObservation: 'روغن کاملاً زلال، شفاف، بدون ذرات معلق یا آب آزاد',
      homogenizationTool: 'اختلاط دستی دورانی به مدت ۱ دقیقه',
      dilutionFactor: '1',
      filtrationUsed: 'عدم نیاز به فیلتراسیون (نمونه کاملاً شفاف)',
      extractionUsed: 'عدم نیاز به استخراج فازی',
      storageTemperatureRecorded: '۲۲.۵ درجه سلسیوس',
      notes: 'نمونه ۳۰ دقیقه پیش از توزین در دمای آزمایشگاه هم‌دما شد [TEST-MOCK].',
      stageCompletionStatus: {
        sample: true,
        sampling: true,
        preparation: true,
        conditioning: true,
        analysis: true
      }
    },

    steps,
    currentStepNumber: 3,
    currentReplicateNumber: 2,
    replicates,

    qcData: {
      overallStatus: 'pass',
      summaryFa: 'کلیه شاخص‌های شاهد (Blank)، موازی (Duplicate)، بازیافت (Recovery) و انطباق استاندارد در محدوده مجاز قرار دارند [TEST-MOCK].',
      updatedAt: now,
      items: {
        qc_test_blank: {
          itemId: 'qc_test_blank',
          type: 'blank',
          recordedValue: 0.02,
          unit: 'mL',
          notes: 'حجم مصرفی شاهد V_blank ≤ 0.05 mL',
          evaluatedStatus: 'pass',
          evaluationReasonFa: 'حجم مصرفی ۰.۰۲ میلی‌لیتر کمتر از سقف ۰.۰۵ است (Pass).',
          evaluatedAt: now
        },
        qc_test_duplicate: {
          itemId: 'qc_test_duplicate',
          type: 'duplicate',
          recordedValue: 0.003,
          unit: 'mg KOH/g',
          notes: 'اختلاف دو تکرار ≤ 0.04 mg KOH/g',
          evaluatedStatus: 'pass',
          evaluationReasonFa: 'اختلاف تکرارها ۰.۰۰۳ بوده و در حد مجاز تکرارپذیری r=0.04 قرار دارد (Pass).',
          evaluatedAt: now
        },
        qc_test_recovery: {
          itemId: 'qc_test_recovery',
          type: 'recovery',
          recordedValue: 99.4,
          unit: '%',
          notes: '۹۵.۰٪ الی ۱۰۵.۰٪ بازیافت',
          evaluatedStatus: 'pass',
          evaluationReasonFa: 'بازیافت ۹۹.۴٪ در بازه مجاز ۹۵-۱۰۵٪ است (Pass).',
          evaluatedAt: now
        },
        qc_test_crm: {
          itemId: 'qc_test_crm',
          type: 'reference_material',
          recordedValue: 0.198,
          unit: 'mg KOH/g',
          notes: 'مقدار مرجع: 0.200 ± 0.010 mg KOH/g',
          evaluatedStatus: 'pass',
          evaluationReasonFa: 'نتیجه سنجش ماده مرجع ۰.۱۹۸ در بازه ۰.۱۹۰ تا ۰.۲۱۰ است (Pass).',
          evaluatedAt: now
        }
      }
    },

    repeatabilityAnalysis: {
      replicateCount: 2,
      validReplicatesCount: 2,
      values: [0.156, 0.159],
      mean: 0.1575,
      standardDeviation: 0.0021,
      relativeStandardDeviationPercent: 1.33,
      rangeDifference: 0.003,
      isAcceptableRepeatability: true,
      repeatabilityLimitFromStandard: '0.04 mg KOH/g طبق INSO 4179',
      assessmentNote: 'تکرارپذیری دو آزمون تایید است؛ اختلاف تکرارها (۰.۰۰۳) کمتر از حد r=0.04 است.'
    },

    standardConformance: {
      evaluatedStandardNumber: 'INSO 4179 / ISO 660',
      evaluatedStandardTitle: 'روغن‌ها و چربی‌های خوراکی - اندازه‌گیری عدد اسیدی',
      isCompliant: true,
      verdict: 'compliant',
      detailsFa: 'عدد اسیدی میانگین نمونه (۰.۱۵۸ mg KOH/g) کمتر از حداکثر مجاز استاندارد ملی ایران (۰.۲۰ mg KOH/g) بوده و کاملاً منطبق است.',
      evaluatedLimits: [
        {
          parameterName: 'عدد اسیدی روغن آفتابگردان تصفیه‌شده',
          measuredValue: '0.158',
          standardLimit: 'حداکثر 0.20',
          unit: 'mg KOH/g',
          passed: true,
          notes: 'مطابق بند ۷ استاندارد ملی ۴۱۷۹ [TEST-MOCK]'
        }
      ]
    },

    status: 'completed',
    startedAt: now,
    completedAt: now,
    elapsedSeconds: 1440,
    isOfflineResilient: true,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Clears only Demo/Test sessions from IndexedDB without touching real user laboratory records.
 */
export async function clearAllTestMockSessions(): Promise<number> {
  const sessions = await getAllLabSessions();
  const testSessions = sessions.filter((s) => s.isDemoOrTest || s.testTag === 'TEST-MOCK' || s.id.startsWith('test_mock_'));
  for (const s of testSessions) {
    await deleteItem(STORES.LAB_SESSIONS, s.id);
  }
  return testSessions.length;
}
