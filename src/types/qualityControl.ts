/**
 * Food Science AI - Quality Control & Quality Assurance (QA/QC) Domain Schema
 * Phase 18 of 20
 * 
 * Strict schema for Food Industry QA/QC, LIMS Sample Tracking, Batch Management,
 * Analytical Replicates, Traceability (Equipment, Calibration, Reagents, Operator, Method),
 * Verified Source-based Acceptance Limits (NO synthetic/invented limits),
 * Shewhart & Levey-Jennings Control Charts, Statistical Process Control (SPC),
 * Westgard Trend Analysis, Out-of-Specification (OOS), Out-of-Control (OOC),
 * Non-conformance & Deviation Logging, and CAPA Management.
 */

import { FoodChemicalSector } from './foodChemistry';
import { StandardOrganization } from './foodChemistry';

/**
 * Verified Acceptance Limit Specification from Authentic Source
 */
export interface VerifiedAcceptanceLimit {
  id: string;
  analyteId: string;
  analyteNameFa: string;
  analyteNameEn: string;
  sector: FoodChemicalSector;
  matrixFa: string;
  unit: string;
  
  // Specification limits
  minLimit?: number; // LSL
  maxLimit?: number; // USL
  targetValue?: number;
  qualitativeLimitFa?: string; // e.g. "منفی در ۲۵ گرم", "فاقد بو و طعم نامطلوب"
  
  // Mandatory Source Reference
  source: {
    organization: StandardOrganization | 'FDA' | 'Codex' | 'EFSA' | 'ISIRI';
    standardNumber: string;
    clauseOrTable?: string;
    year?: string;
    titleFa: string;
    urlOrDocRef?: string;
  };
  
  // Statistical Historical Baseline for Control Charts (if established by certified CRM or historical validation)
  historicalMean?: number;
  historicalSD?: number;
  warningLimitUpper?: number; // +2SD
  warningLimitLower?: number; // -2SD
  controlLimitUpper?: number; // +3SD
  controlLimitLower?: number; // -3SD
}

/**
 * Replicate Measurement
 */
export interface TestReplicate {
  repNumber: number;
  rawReading?: number;
  calculatedValue: number;
  timestamp: string;
  notes?: string;
}

/**
 * Equipment Calibration Snapshot for Traceability
 */
export interface EquipmentCalibrationRecord {
  equipmentId: string;
  equipmentNameFa: string;
  equipmentNameEn: string;
  model: string;
  serialNumber: string;
  assetTag: string;
  calibrationStatus: 'calibrated' | 'expired' | 'due_soon' | 'not_required';
  lastCalibrationDate: string;
  nextCalibrationDueDate: string;
  calibrationCertificateNo: string;
  calibrationProvider: string;
}

/**
 * Reagent Lot Traceability Snapshot
 */
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

/**
 * Operator / Analyst Information
 */
export interface OperatorRecord {
  operatorId: string;
  fullNameFa: string;
  fullNameEn: string;
  qualificationFa: string;
  role: 'analyst' | 'qc_supervisor' | 'qa_manager' | 'microbiologist' | 'chemist';
  signatureTimestamp?: string;
}

/**
 * Status of Test Result against Specification & Statistical Control
 */
export type ComplianceStatus =
  | 'in_spec_in_control'    // منطبق بر مشخصات و تحت کنترل آماری
  | 'in_spec_warning'       // در محدوده مشخصات اما در ناحیه هشدار آماری (2SD)
  | 'out_of_control'        // خارج از کنترل آماری (نقض قوانین وست‌گارد / 3SD)
  | 'out_of_specification'  // خارج از محدوده مشخصات استاندارد (OOS)
  | 'no_limit_defined';     // حد پذیرش معتبر در داده‌های موجود یافت نشد

/**
 * Westgard / Statistical Process Control Violations
 */
export type SpcRuleViolation =
  | 'rule_1_3s'  // 1 point > 3SD (Random or systematic error)
  | 'rule_2_2s'  // 2 consecutive points > 2SD on same side (Systematic error)
  | 'rule_r_4s'  // Difference between 2 consecutive points > 4SD (Random error)
  | 'rule_4_1s'  // 4 consecutive points > 1SD on same side (Systematic shift)
  | 'rule_10_x'  // 10 consecutive points on one side of mean (Shift in process/calibration)
  | 'rule_trend' // 6 consecutive points steadily increasing or decreasing (Drift/Aging);

export interface SpcEvaluationResult {
  isControlled: boolean;
  violations: {
    rule: SpcRuleViolation;
    ruleNameFa: string;
    descriptionFa: string;
    severity: 'warning' | 'critical';
  }[];
  trendStatusFa: string;
}

/**
 * Complete QC Test Result Entry
 */
export interface QCTestResult {
  id: string;
  sampleId: string;
  batchNumber: string;
  testCode: string;
  testTitleFa: string;
  analyteNameFa: string;
  testCategory: 'chemical' | 'microbiological' | 'physical' | 'sensory';
  
  // Replicates and calculated statistics
  replicates: TestReplicate[];
  mean: number;
  standardDeviation: number;
  relativeStandardDeviation: number; // RSD / CV%
  unit: string;
  
  // Traceability & Metadata
  testTimestamp: string;
  operator: OperatorRecord;
  equipment: EquipmentCalibrationRecord;
  reagentLot?: ReagentLotRecord;
  standardMethodRef: {
    organization: StandardOrganization | 'INSO' | 'AOAC' | 'ISO' | 'AOCS';
    standardNumber: string;
    methodNameFa: string;
  };
  
  // Specification Limit Verification
  limitInfo?: VerifiedAcceptanceLimit;
  hasVerifiedLimit: boolean;
  noLimitReasonFa?: string; // "حد پذیرش معتبر در داده‌های موجود یافت نشد."
  
  // Compliance & SPC Evaluation
  complianceStatus: ComplianceStatus;
  spcEvaluation?: SpcEvaluationResult;
  
  // Notes & Sign-off
  analystRemarksFa?: string;
  supervisorApproval?: {
    approvedBy: string;
    approvalDate: string;
    status: 'approved' | 'rejected' | 'retest_required' | 'pending';
    commentsFa?: string;
  };
}

/**
 * Sample Entity
 */
export interface QCSample {
  id: string;
  sampleCode: string;
  productNameFa: string;
  productNameEn: string;
  sector: FoodChemicalSector;
  batchNumber: string;
  samplingDateTime: string;
  samplingLocationFa: string;
  samplerNameFa: string;
  sampleMatrixFa: string;
  sampleTemperatureCelsius?: number;
  storageConditionFa: string;
  sampleState: 'fresh' | 'quarantined' | 'under_analysis' | 'approved' | 'rejected';
  retainedSampleLocation?: string;
}

/**
 * Production Batch Entity
 */
export interface QCProductionBatch {
  batchNumber: string;
  productNameFa: string;
  productionDate: string;
  expirationDate: string;
  batchSize: number;
  batchUnit: 'kg' | 'ton' | 'liter' | 'carton' | 'package';
  productionLine: string;
  shift: 'morning' | 'evening' | 'night';
  status: 'in_quarantine' | 'released' | 'rejected' | 'rework' | 'retest';
  qaReleaseSignoff?: {
    qaManagerName: string;
    decisionDate: string;
    certificateNumber?: string;
    commentsFa?: string;
  };
}

/**
 * Non-Conformance & Deviation Entity
 */
export interface QCDeviation {
  id: string;
  deviationNumber: string; // e.g. DEV-2026-081
  dateReported: string;
  severity: 'critical' | 'major' | 'minor';
  sourceType: 'oos_result' | 'ooc_trend' | 'equipment_calibration' | 'reagent_failure' | 'process_drift' | 'hygiene_violation';
  
  // Linkages
  sampleId?: string;
  batchNumber?: string;
  testResultId?: string;
  
  titleFa: string;
  descriptionFa: string;
  rootCauseAnalysisFa: {
    category: 'man' | 'machine' | 'material' | 'method' | 'measurement' | 'milieu';
    rootCauseSummaryFa: string;
    fiveWhysSummaryFa?: string[];
  };
  
  immediateCorrectionFa: string; // اقدام فوری و ایزولاسیون محصول
  productDisposition: 'quarantine' | 'scrap' | 'rework' | 'concession_release' | 'downgrade';
  reportedBy: string;
  status: 'open' | 'investigating' | 'capa_assigned' | 'closed';
  
  capaId?: string;
}

/**
 * Corrective and Preventive Action (CAPA) Entity
 */
export interface QCCAPAAction {
  id: string;
  capaNumber: string; // e.g. CAPA-2026-042
  deviationId: string;
  actionType: 'corrective' | 'preventive' | 'both';
  titleFa: string;
  actionPlanFa: string;
  rootCauseAddressedFa: string;
  
  assignedTo: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  
  effectivenessReview: {
    reviewDate?: string;
    reviewedBy?: string;
    isEffective?: boolean;
    evidenceNotesFa?: string;
  };
  
  status: 'draft' | 'in_progress' | 'pending_review' | 'verified_closed' | 'extended';
}

/**
 * Historical Data Point for Trend Analysis Chart
 */
export interface QCTrendPoint {
  batchNumber: string;
  sampleCode: string;
  date: string;
  value: number;
  mean: number;
  ucl?: number;
  lcl?: number;
  uwl?: number;
  lwl?: number;
  usl?: number;
  lsl?: number;
  status: ComplianceStatus;
  operator: string;
  equipment: string;
}
