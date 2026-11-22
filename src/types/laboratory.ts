/**
 * Food Science AI - Digital Laboratory Domain Types
 * 
 * Strict schema for digital lab execution, step-by-step testing, parameter validation,
 * unit tracking, multi-replicate runs, offline IndexedDB resilience, and standard-driven compliance.
 */

import { FoodStandard, AcceptableLimitSpecification, FoodStandardSector } from './foodStandard';
import { EquipmentChecklistItem } from './laboratoryEquipment';
import { ExperimentQCItem, LabSessionQCData } from './qualityControl';

/**
 * Supported Lab Parameter Data Types
 */
export type LabParameterType =
  | 'numeric'           // عدد خام
  | 'temperature'       // دما
  | 'time_duration'     // زمان / مدت
  | 'mass_weight'       // وزن / جرم
  | 'volume'            // حجم مایع / تیترانت
  | 'ph_level'          // پی‌اچ
  | 'refractive_index'  // بریکس / ضریب شکست
  | 'absorbance'        // جذب نوری / اسپکتروفتومتری
  | 'percentage'        // درصد وزنی یا حجمی
  | 'count_cfu'         // شمارش کلنی میکروبی (CFU)
  | 'boolean_detected'  // مثبت / منفی یا مشاهده شده / نشده
  | 'text_observation'; // مشاهدات ارگانولپتیک یا متنی

/**
 * Parameter definition inside a step
 */
export interface LabParameterDefinition {
  id: string;
  nameFa: string;
  nameEn?: string;
  paramType: LabParameterType;
  expectedUnit: string;        // e.g. "g", "mL", "°C", "min", "pH", "°Brix", "%", "CFU/g", "Abs"
  allowedUnits?: string[];     // optional alternatives (e.g. ["g", "mg", "kg"])
  required: boolean;
  
  // Validation bounds and standard mapping
  minValue?: number;
  maxValue?: number;
  decimalPrecision?: number;
  standardLimitKey?: string;   // Maps to an AcceptableLimitSpecification in the FoodStandard
  expectedLimitText?: string;  // e.g. "حداکثر ۱۰ mg/kg" or "۵.۵ - ۶.۸"
  
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
}

/**
 * Step definition for a laboratory protocol
 */
export interface LabStepDefinition {
  stepNumber: number;
  titleFa: string;
  titleEn?: string;
  descriptionFa: string;
  instructions: string[];
  
  // Specific requirements for this step
  equipmentUsed: string[];
  reagentsUsed: string[];
  safetyWarnings?: string[];
  environmentalConditions?: {
    targetTemperature?: string;
    targetHumidity?: string;
    targetDurationMinutes?: number;
    notes?: string;
  };
  
  // Parameters to record in this step
  parameters: LabParameterDefinition[];
  
  // Pre-advancement verification requirement
  requiresVerificationBeforeNext: boolean;
  verificationPromptFa?: string;
}

/**
 * Recorded parameter value
 */
export interface LabRecordedParameterValue {
  parameterId: string;
  nameFa: string;
  value: any;                  // number, string, boolean
  unit: string;
  recordedAt: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Workflow Stages for Real Laboratory Execution
 */
export type LabWorkflowStage =
  | 'start_objective'       // ۱. شروع آزمایش و مشاهده هدف
  | 'equipment_calibration' // ۲. بررسی تجهیزات و کالیبراسیون
  | 'reagents_solutions'    // ۳. بررسی معرف‌ها و محلول‌ها
  | 'sample_preparation'    // ۴. آماده‌سازی نمونه
  | 'step_procedure'        // ۵. اجرای گام‌به‌گام و ورود داده
  | 'calculation_review'    // ۶. محاسبه و بررسی نتیجه
  | 'finalize';             // ۷. نهایی‌سازی و صدور کارنامه

export interface LabLoggedError {
  id: string;
  errorText: string;
  severity: 'warning' | 'critical';
  loggedAt: string;
  resolved?: boolean;
}

export interface LabSamplePrepData {
  methodDescription?: string;
  selectedMethodId?: string;
  selectedMethodTitle?: string;
  sampleType?: string;
  sampleWeightGrams?: string | number;
  sampleVolumeMl?: string | number;
  containerUsed?: string;
  appearanceObservation?: string;
  homogenizationTool?: string;
  dilutionFactor?: string | number;
  filtrationUsed?: string;
  extractionUsed?: string;
  storageTemperatureRecorded?: string;
  isPrepared: boolean;
  preparedAt?: string;
  notes?: string;
  stageCompletionStatus?: {
    sample?: boolean;
    sampling?: boolean;
    preparation?: boolean;
    conditioning?: boolean;
    analysis?: boolean;
  };
}

/**
 * Recorded execution data for a single step in a replicate
 */
export interface LabStepRunData {
  stepNumber: number;
  isStarted: boolean;
  isCompleted: boolean;
  isVerified: boolean;         // Verified by operator before advancing
  verifiedAt?: string;
  verifiedNotes?: string;
  
  parameterValues: Record<string, LabRecordedParameterValue>;
  stepNotes?: string;
  stepWarnings: string[];
  stepErrors: string[];
  completedAt?: string;

  // Real-time Lab Data Logging Fields (قسمت ۳۴)
  recordedTime?: string;                // ثبت زمان آزمون
  recordedTemperature?: string | number;// ثبت دما (°C)
  recordedWeight?: string | number;     // ثبت وزن (g)
  recordedVolume?: string | number;     // ثبت حجم (mL)
  recordedEquipment?: string[];         // ثبت تجهیزات استفاده‌شده
  operatorNotes?: string;               // ثبت Operator Notes
  loggedErrors?: LabLoggedError[];      // ثبت خطا و انحراف
  skippedWithoutGuessing?: boolean;     // عدم اجبار به حدس زدن
  skipReason?: string;                  // دلیل عدم اندازه‌گیری
}

/**
 * Single replicate (تکرار آزمون - e.g. Replicate 1, Replicate 2, Replicate 3)
 */
export interface LabReplicateRun {
  replicateNumber: number;     // 1, 2, 3...
  title: string;               // e.g. "تکرار ۱ (R1)"
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  elapsedSeconds: number;
  
  stepsData: Record<number, LabStepRunData>; // Step number -> Step run data
  
  calculatedResult?: {
    primaryValue?: number;
    unit?: string;
    formulaUsed?: string;
    details?: string;
  };
}

/**
 * Status of the entire Lab Session
 */
export type LabSessionStatus = 'draft' | 'running' | 'paused' | 'completed' | 'aborted';

/**
 * Repeatability & Statistical Analysis across replicates
 */
export interface LabRepeatabilityAnalysis {
  replicateCount: number;
  validReplicatesCount: number;
  values: number[];
  mean?: number;
  standardDeviation?: number;
  relativeStandardDeviationPercent?: number; // %RSD (Coefficient of Variation CV%)
  rangeDifference?: number;                  // Max - Min
  isAcceptableRepeatability?: boolean;
  repeatabilityLimitFromStandard?: string;
  assessmentNote?: string;
}

/**
 * Overall Standard Conformance Assessment
 */
export interface LabStandardConformance {
  evaluatedStandardNumber?: string;
  evaluatedStandardTitle?: string;
  isCompliant: boolean;
  verdict: 'compliant' | 'non_compliant' | 'indeterminate' | 'not_evaluated';
  detailsFa: string;
  evaluatedLimits: Array<{
    parameterName: string;
    measuredValue: string;
    standardLimit: string;
    unit: string;
    passed: boolean;
    notes?: string;
  }>;
}

/**
 * Digital Laboratory Session (Full persistent model stored in IndexedDB)
 */
export interface LabSession {
  id: string;
  
  // 1. Sample & Metadata
  title: string;
  sampleCode: string;
  sampleName: string;
  sampleDescription?: string;
  batchNumber?: string;
  productionDate?: string;
  expiryDate?: string;
  operatorName: string;
  supervisorName?: string;
  laboratoryRoom?: string;
  notes?: string;
  
  // 2. Reference Standard Linkage
  standardId?: string;
  standardNumber?: string;
  standardTitleFa?: string;
  standardSector?: FoodStandardSector;
  standardRevision?: string;
  issuingOrganization?: string;
  standardSnapshot?: Partial<FoodStandard>; // Snapshot of standard at session start
  
  // 3. Technical Requirements (From Standard or Custom)
  equipmentChecklist?: EquipmentChecklistItem[];
  requiredEquipment: Array<{
    id: string;
    name: string;
    isPrepared: boolean;
    calibrationInfo?: string;
  }>;
  reagentsAndChemicals: Array<{
    id: string;
    name: string;
    isPrepared: boolean;
    gradeOrConcentration?: string;
    safetyInfo?: string;
  }>;
  testConditions: {
    ambientTemperature?: string;
    ambientHumidity?: string;
    calibratedInstrumentsChecked?: boolean;
    notes?: string;
  };
  
  // 4. Protocol Steps & Workflow
  workflowStage?: LabWorkflowStage;
  calibrationCheckDone?: boolean;
  reagentsCheckDone?: boolean;
  samplePrepData?: LabSamplePrepData;
  steps: LabStepDefinition[];
  currentStepNumber: number;
  currentReplicateNumber: number;
  replicates: LabReplicateRun[];
  
  // 5. Execution State & Timer
  status: LabSessionStatus;
  startedAt?: string;
  pausedAt?: string;
  resumedAt?: string;
  completedAt?: string;
  elapsedSeconds: number;      // Total active run time in seconds
  
  // 6. Real-time Analysis, Quality Control (QC) & Standard Validation
  repeatabilityAnalysis?: LabRepeatabilityAnalysis;
  standardConformance?: LabStandardConformance;
  qcItems?: ExperimentQCItem[];
  qcData?: LabSessionQCData;
  
  // 7. System & Persistence
  isOfflineResilient: boolean;
  isDemoOrTest?: boolean;
  testTag?: 'TEST-MOCK' | 'REAL-DATA';
  createdAt: string;
  updatedAt: string;
}

/**
 * Pre-defined Template or Saved Protocol (Without real data hallucination)
 */
export interface LabProtocolTemplate {
  id: string;
  titleFa: string;
  titleEn?: string;
  standardId?: string;
  standardNumber?: string;
  sector: FoodStandardSector;
  descriptionFa: string;
  defaultEquipment: string[];
  defaultReagents: string[];
  defaultConditions: string;
  steps: LabStepDefinition[];
  createdAt: string;
}
