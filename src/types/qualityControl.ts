/**
 * Food Science AI - Quality Control (QC) & QA Domain Types
 * 
 * Part 37 of 40:
 * Standard-driven Quality Control for laboratory experiments:
 * Blank, Control Sample, Duplicate, Replicate, Calibration Check, Recovery, Reference Material.
 * Strict compliance: Acceptance criteria are populated ONLY if specified by the source/standard.
 * If not specified, outputs "قابل ارزیابی نیست".
 * 
 * Also encompasses production batch QC, sampling logs, SPC trend points, deviations, and CAPAs.
 */

import { FoodStandardSector } from './foodStandard';

// ==========================================
// PART A: EXPERIMENT QUALITY CONTROL (QC)
// ==========================================

export type QCControlType =
  | 'blank'               // آزمون شاهد (Reagent / Method Blank)
  | 'control_sample'      // نمونه کنترل کیفی (QC Check Sample)
  | 'duplicate'           // آزمون تکرار موازی دوگانه (Duplicate Test)
  | 'replicate'           // تکرارهای چندگانه متوالی (Replicate Series)
  | 'calibration_check'   // بررسی کالیبراسیون و استاندارد میانی (Calibration Verification)
  | 'recovery'            // درصد بازیافت و آزمون اسپایک (Spike Recovery)
  | 'reference_material'; // ماده مرجع گواهی‌شده (CRM / SRM)

export interface QCControlTypeMeta {
  type: QCControlType;
  titleFa: string;
  titleEn: string;
  shortDescription: string;
  iconName: string;
  color: string;
}

export const QC_CONTROL_TYPES_META: Record<QCControlType, QCControlTypeMeta> = {
  blank: {
    type: 'blank',
    titleFa: 'آزمون شاهد (Blank)',
    titleEn: 'Reagent / Method Blank',
    shortDescription: 'بررسی عدم حضور آلودگی در حلال‌ها، معرف‌ها و ظروف آزمایشگاهی',
    iconName: 'Droplet',
    color: '#0284c7'
  },
  control_sample: {
    type: 'control_sample',
    titleFa: 'نمونه کنترل کیفیت (Control Sample)',
    titleEn: 'Quality Control Sample',
    shortDescription: 'ارزیابی رفتار آزمون روی نمونه معین با ترکیب شناخته‌شده',
    iconName: 'FlaskConical',
    color: '#0d9488'
  },
  duplicate: {
    type: 'duplicate',
    titleFa: 'تکرار موازی (Duplicate)',
    titleEn: 'Duplicate Analysis',
    shortDescription: 'دو بار اجرای همزمان روی یک نمونه یکنواخت‌شده جهت سنجش تکرارپذیری (r)',
    iconName: 'Copy',
    color: '#d97706'
  },
  replicate: {
    type: 'replicate',
    titleFa: 'تکرارهای چندگانه (Replicate)',
    titleEn: 'Multi-Replicate Series',
    shortDescription: 'اندازه‌گیری چندباره برای محاسبه میانگین، انحراف معیار و %RSD',
    iconName: 'Layers',
    color: '#7c3aed'
  },
  calibration_check: {
    type: 'calibration_check',
    titleFa: 'بررسی کالیبراسیون (Calibration Check)',
    titleEn: 'Calibration Verification',
    shortDescription: 'صحت‌سنجی کالیبراسیون دستگاه و استاندارد میانی قبل و حین آزمون',
    iconName: 'Gauge',
    color: '#2563eb'
  },
  recovery: {
    type: 'recovery',
    titleFa: 'درصد بازیافت (Recovery)',
    titleEn: 'Spike Recovery Rate',
    shortDescription: 'سنجش درصد بازیابی آنالیت افزوده به ماتریس (اسپایک)',
    iconName: 'TrendingUp',
    color: '#059669'
  },
  reference_material: {
    type: 'reference_material',
    titleFa: 'ماده مرجع گواهی‌شده (Reference Material)',
    titleEn: 'Certified Reference Material (CRM)',
    shortDescription: 'انطباق با ماده مرجع استاندارد ملی یا بین‌المللی',
    iconName: 'Award',
    color: '#c026d3'
  }
};

export type QCAcceptanceComparisonType =
  | 'max'                  // کمتر یا مساوی حداکثر مجاز (<= max)
  | 'min'                  // بیشتر یا مساوی حداقل مجاز (>= min)
  | 'range'                // در بازه عددی معین (min <= val <= max)
  | 'max_percent_diff'     // بیشینه اختلاف نسبی مجاز (RPD% یا RSD%)
  | 'exact_zero'           // صفر مطلق (مانند عدم رشد در بلانک میکروبی)
  | 'text_match'           // تطابق متنی (منفی، عدم تغییر رنگ)
  | 'custom_standard_rule';// قانون فنی تشریحی مندرج در متن استاندارد

export interface QCAcceptanceCriteriaSpec {
  specified: boolean;
  descriptionFa: string;
  sourceClause?: string;
  comparisonType?: QCAcceptanceComparisonType;
  targetValue?: number;
  minValue?: number;
  maxValue?: number;
  maxDifference?: number;
  unit?: string;
  expectedText?: string;
}

export interface ExperimentQCItem {
  id: string;
  type: QCControlType;
  titleFa: string;
  titleEn?: string;
  descriptionFa: string;
  sourceReference: string;
  acceptanceCriteria: QCAcceptanceCriteriaSpec;
  isRequired: boolean;
}

export interface ExperimentQualityControlSpec {
  items: ExperimentQCItem[];
  sourceStandardRef?: string;
  generalNotes?: string[];
}

export type QCItemStatus = 'pass' | 'fail' | 'unknown';

export interface LabQCItemExecution {
  itemId: string;
  type: QCControlType;
  recordedValue?: number | string;
  unit?: string;
  notes?: string;
  evaluatedStatus: QCItemStatus;
  evaluationReasonFa: string;
  evaluatedAt?: string;
}

export interface LabSessionQCData {
  items: Record<string, LabQCItemExecution>;
  overallStatus: QCItemStatus;
  summaryFa: string;
  updatedAt: string;
}

// ==========================================
// PART B: FACTORY QC, BATCHES & TRENDS
// ==========================================

export interface VerifiedAcceptanceLimit {
  id: string;
  analyteId: string;
  analyteNameFa: string;
  analyteNameEn: string;
  sector: FoodStandardSector | string;
  matrixFa: string;
  unit: string;
  minLimit?: number;
  maxLimit?: number;
  targetValue?: number;
  source: {
    organization: string;
    standardNumber: string;
    clauseOrTable: string;
    year: string;
    titleFa: string;
  };
  historicalMean: number;
  historicalSD: number;
  warningLimitUpper?: number;
  warningLimitLower?: number;
  controlLimitUpper: number;
  controlLimitLower: number;
}

export interface EquipmentCalibrationRecord {
  equipmentId: string;
  equipmentNameFa: string;
  equipmentNameEn: string;
  model: string;
  serialNumber: string;
  assetTag: string;
  calibrationStatus: 'calibrated' | 'due_soon' | 'expired' | 'out_of_service';
  lastCalibrationDate: string;
  nextCalibrationDueDate: string;
  calibrationCertificateNo: string;
  calibrationProvider: string;
}

export interface ReagentLotRecord {
  reagentId: string;
  reagentNameFa: string;
  reagentNameEn: string;
  manufacturer: string;
  lotNumber: string;
  purityGrade: string;
  expirationDate: string;
  isExpired: boolean;
  preparationOrStandardizationDate?: string;
  standardizedFactorOrTiter?: number;
}

export interface OperatorRecord {
  operatorId: string;
  fullNameFa: string;
  fullNameEn: string;
  qualificationFa: string;
  role: 'chemist' | 'microbiologist' | 'qc_supervisor' | 'qa_manager' | 'technician';
}

export interface QCProductionBatch {
  batchNumber: string;
  productNameFa: string;
  productionDate: string;
  expirationDate: string;
  batchSize: number;
  batchUnit: string;
  productionLine: string;
  shift: 'morning' | 'evening' | 'night';
  status: 'in_quarantine' | 'released' | 'rejected' | 'rework';
  qaReleaseSignoff?: {
    qaManagerName: string;
    decisionDate: string;
    certificateNumber?: string;
    commentsFa?: string;
  };
}

export interface QCSample {
  id: string;
  sampleCode: string;
  productNameFa: string;
  productNameEn: string;
  sector: FoodStandardSector | string;
  batchNumber: string;
  samplingDateTime: string;
  samplingLocationFa: string;
  samplerNameFa: string;
  sampleMatrixFa: string;
  sampleTemperatureCelsius: number;
  storageConditionFa: string;
  sampleState: 'fresh' | 'under_analysis' | 'approved' | 'rejected' | 'retained' | 'quarantined';
  retainedSampleLocation?: string;
}

export interface TestReplicate {
  repNumber: number;
  rawReading?: number;
  calculatedValue: number;
  timestamp: string;
}

export type ComplianceStatus =
  | 'in_spec_in_control'
  | 'in_spec_warning'
  | 'out_of_control'
  | 'out_of_spec'
  | 'out_of_specification'
  | 'no_limit_defined';

export interface SpcRuleViolation {
  ruleCode: string;
  ruleTitleFa: string;
  descriptionFa: string;
}

export interface QCTestResult {
  id: string;
  sampleId: string;
  batchNumber: string;
  testCode: string;
  testTitleFa: string;
  analyteNameFa: string;
  testCategory: 'chemical' | 'microbiological' | 'physical' | 'sensory';
  replicates: TestReplicate[];
  mean: number;
  standardDeviation: number;
  relativeStandardDeviation: number; // %RSD
  unit: string;
  testTimestamp: string;
  operator: OperatorRecord;
  equipment: EquipmentCalibrationRecord;
  reagentLot?: ReagentLotRecord;
  standardMethodRef: {
    organization: string;
    standardNumber: string;
    methodNameFa: string;
  };
  limitInfo?: VerifiedAcceptanceLimit;
  hasVerifiedLimit: boolean;
  complianceStatus: ComplianceStatus;
  noLimitReasonFa?: string;
  spcEvaluation?: {
    isControlled: boolean;
    violations: SpcRuleViolation[];
    trendStatusFa: string;
  };
  analystRemarksFa?: string;
  supervisorApproval?: {
    approvedBy: string;
    approvalDate: string;
    status: 'approved' | 'rejected' | 'pending';
    commentsFa?: string;
  };
}

export interface QCTrendPoint {
  batchNumber: string;
  sampleCode: string;
  date: string;
  value: number;
  mean: number;
  ucl: number;
  lcl: number;
  uwl: number;
  lwl: number;
  usl: number;
  lsl: number;
  status: ComplianceStatus;
  operator: string;
  equipment: string;
}

export interface QCDeviation {
  id: string;
  deviationNumber: string;
  dateReported: string;
  severity: 'critical' | 'major' | 'minor';
  sourceType: 'oos_result' | 'equipment_calibration' | 'reagent_failure' | 'sampling_error' | 'process_upset';
  batchNumber?: string;
  sampleId?: string;
  testResultId?: string;
  titleFa: string;
  descriptionFa: string;
  rootCauseAnalysisFa: {
    category: 'man' | 'machine' | 'material' | 'method' | 'measurement' | 'environment';
    rootCauseSummaryFa: string;
    fiveWhysSummaryFa?: string[];
  };
  immediateCorrectionFa: string;
  productDisposition: 'scrap' | 'rework' | 'concession_release' | 'return_to_vendor' | 'quarantine';
  reportedBy: string;
  status: 'open' | 'investigating' | 'capa_assigned' | 'closed';
  capaId?: string;
}

export interface QCCAPAAction {
  id: string;
  capaNumber: string;
  deviationId: string;
  actionType: 'corrective' | 'preventive' | 'both';
  titleFa: string;
  actionPlanFa: string;
  rootCauseAddressedFa: string;
  assignedTo: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  effectivenessReview?: {
    reviewDate?: string;
    reviewedBy?: string;
    isEffective: boolean;
    evidenceNotesFa: string;
  };
  status: 'draft' | 'pending_review' | 'in_progress' | 'completed' | 'verified_closed';
}
