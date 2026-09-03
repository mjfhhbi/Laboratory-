/**
 * Food Science AI - Quality Control & QA Benchmark Dataset
 * Phase 18 of 20
 * 
 * Authentic standard specifications, equipment calibration records, reagent lot repository,
 * operator profiles, benchmark production batches, QC test results, and historical trend series.
 * 
 * STRICT COMPLIANCE: Every acceptance limit is derived strictly from authentic standards (INSO / ISO / Codex).
 * If no limit exists in the database, the system outputs "حد پذیرش معتبر در داده‌های موجود یافت نشد."
 */

import { 
  VerifiedAcceptanceLimit, 
  EquipmentCalibrationRecord, 
  ReagentLotRecord, 
  OperatorRecord, 
  QCSample, 
  QCProductionBatch, 
  QCTestResult, 
  QCDeviation, 
  QCCAPAAction, 
  QCTrendPoint 
} from '../types/qualityControl';

/**
 * 1. Verified Acceptance Limits Repository (from Authentic Standards)
 */
export const VERIFIED_ACCEPTANCE_LIMITS: VerifiedAcceptanceLimit[] = [
  // --- Dairy: Pasteurized Whole Milk (شیر پاستوریزه کامل) ---
  {
    id: 'limit-milk-fat',
    analyteId: 'chem-fat-soxhlet',
    analyteNameFa: 'درصد چربی کل',
    analyteNameEn: 'Total Fat Content',
    sector: 'dairy',
    matrixFa: 'شیر پاستوریزه پرچرب (Whole Pasteurized Milk)',
    unit: '% w/w',
    minLimit: 3.00,
    maxLimit: 3.60,
    targetValue: 3.20,
    source: {
      organization: 'INSO',
      standardNumber: '2406',
      clauseOrTable: 'جدول ۱ - ویژگی‌های فیزیکوشیمیایی شیر پاستوریزه',
      year: '1398',
      titleFa: 'شیر و فرآورده‌های آن - شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون'
    },
    historicalMean: 3.18,
    historicalSD: 0.035,
    warningLimitUpper: 3.25,
    warningLimitLower: 3.11,
    controlLimitUpper: 3.285,
    controlLimitLower: 3.075
  },
  {
    id: 'limit-milk-acidity',
    analyteId: 'chem-acidity-titration',
    analyteNameFa: 'اسیدیته قابل تیتر (درجه دورنیک)',
    analyteNameEn: 'Titratable Acidity (Dornic)',
    sector: 'dairy',
    matrixFa: 'شیر پاستوریزه (Pasteurized Milk)',
    unit: '°D',
    minLimit: 14.0,
    maxLimit: 16.5,
    targetValue: 15.0,
    source: {
      organization: 'INSO',
      standardNumber: '2406',
      clauseOrTable: 'بند ۵.۳ و جدول ۱',
      year: '1398',
      titleFa: 'شیر و فرآورده‌های آن - شیر پاستوریزه - ویژگی‌ها'
    },
    historicalMean: 15.2,
    historicalSD: 0.35,
    warningLimitUpper: 15.9,
    warningLimitLower: 14.5,
    controlLimitUpper: 16.25,
    controlLimitLower: 14.15
  },
  {
    id: 'limit-milk-protein',
    analyteId: 'chem-protein-kjeldahl',
    analyteNameFa: 'پروتئین خام کل (N × ۶.۳۸)',
    analyteNameEn: 'Total Crude Protein',
    sector: 'dairy',
    matrixFa: 'شیر پاستوریزه (Pasteurized Milk)',
    unit: '% w/w',
    minLimit: 3.00,
    targetValue: 3.25,
    source: {
      organization: 'INSO',
      standardNumber: '2406',
      clauseOrTable: 'جدول ۱ - ردیف ۲',
      year: '1398',
      titleFa: 'شیر پاستوریزه - ویژگی‌های شیمیایی'
    },
    historicalMean: 3.22,
    historicalSD: 0.045,
    warningLimitUpper: 3.31,
    warningLimitLower: 3.13,
    controlLimitUpper: 3.355,
    controlLimitLower: 3.085
  },

  // --- Canning: Tomato Paste (رب گوجه‌فرنگی) ---
  {
    id: 'limit-tomato-brix',
    analyteId: 'chem-refractometry-brix',
    analyteNameFa: 'مواد جامد محلول در آب (بریکس بدون نمک)',
    analyteNameEn: 'Soluble Solids Content (Brix, salt-free)',
    sector: 'canning_preserves',
    matrixFa: 'رب گوجه‌فرنگی غلیظ‌شده (Tomato Paste)',
    unit: '°Brix',
    minLimit: 28.0,
    maxLimit: 30.0,
    targetValue: 28.5,
    source: {
      organization: 'INSO',
      standardNumber: '761',
      clauseOrTable: 'جدول ۱ - مشخصات فیزیکوشیمیایی رب گوجه‌فرنگی',
      year: '1400',
      titleFa: 'کنسرو رب گوجه‌فرنگی - ویژگی‌ها و روش‌های آزمون'
    },
    historicalMean: 28.6,
    historicalSD: 0.22,
    warningLimitUpper: 29.04,
    warningLimitLower: 28.16,
    controlLimitUpper: 29.26,
    controlLimitLower: 27.94
  },
  {
    id: 'limit-tomato-salt',
    analyteId: 'chem-salt-mohr',
    analyteNameFa: 'درصد نمک طعام (NaCl)',
    analyteNameEn: 'Sodium Chloride Content',
    sector: 'canning_preserves',
    matrixFa: 'رب گوجه‌فرنگی قوطی (Canned Tomato Paste)',
    unit: '% w/w',
    minLimit: 0.0,
    maxLimit: 1.50,
    targetValue: 1.00,
    source: {
      organization: 'INSO',
      standardNumber: '761',
      clauseOrTable: 'بند ۵.۴ و جدول ۱',
      year: '1400',
      titleFa: 'رب گوجه‌فرنگی - حد مجاز نمک افزوده'
    },
    historicalMean: 1.05,
    historicalSD: 0.08,
    warningLimitUpper: 1.21,
    warningLimitLower: 0.89,
    controlLimitUpper: 1.29,
    controlLimitLower: 0.81
  },

  // --- Oils & Fats: Edible Frying Oil (روغن مخصوص سرخ‌کردنی) ---
  {
    id: 'limit-oil-peroxide',
    analyteId: 'chem-lipids-peroxide',
    analyteNameFa: 'عدد پراکسید (Peroxide Value)',
    analyteNameEn: 'Peroxide Value (PV)',
    sector: 'oils_fats',
    matrixFa: 'روغن سرخ‌کردنی تصفیه‌شده (Refined Frying Oil)',
    unit: 'meq O2/kg',
    minLimit: 0.0,
    maxLimit: 2.00,
    targetValue: 0.80,
    source: {
      organization: 'INSO',
      standardNumber: '4152',
      clauseOrTable: 'جدول ۲ - ویژگی‌های شیمیایی روغن سرخ‌کردنی در زمان خروج از کارخانه',
      year: '1399',
      titleFa: 'روغن‌ها و چربی‌های خوراکی - روغن سرخ‌کردنی - ویژگی‌ها'
    },
    historicalMean: 0.85,
    historicalSD: 0.18,
    warningLimitUpper: 1.21,
    warningLimitLower: 0.49,
    controlLimitUpper: 1.39,
    controlLimitLower: 0.31
  },
  {
    id: 'limit-oil-moisture',
    analyteId: 'chem-moisture-oven',
    analyteNameFa: 'رطوبت و مواد فرار',
    analyteNameEn: 'Moisture and Volatile Matter',
    sector: 'oils_fats',
    matrixFa: 'روغن‌های خوراکی مایع (Liquid Edible Oils)',
    unit: '% w/w',
    minLimit: 0.0,
    maxLimit: 0.05,
    targetValue: 0.02,
    source: {
      organization: 'INSO',
      standardNumber: '4152',
      clauseOrTable: 'جدول ۲ - ردیف ۴',
      year: '1399',
      titleFa: 'روغن‌های خوراکی - حداکثر رطوبت مجاز'
    },
    historicalMean: 0.022,
    historicalSD: 0.005,
    warningLimitUpper: 0.032,
    warningLimitLower: 0.012,
    controlLimitUpper: 0.037,
    controlLimitLower: 0.007
  },

  // --- Cereals: Star Wheat Flour (آرد گندم ستاره) ---
  {
    id: 'limit-flour-moisture',
    analyteId: 'chem-moisture-oven',
    analyteNameFa: 'درصد رطوبت آرد گندم',
    analyteNameEn: 'Flour Moisture Content',
    sector: 'cereals_bakery',
    matrixFa: 'آرد گندم ستاره فانتزی (Wheat Flour)',
    unit: '% w/w',
    minLimit: 0.0,
    maxLimit: 14.20,
    targetValue: 13.50,
    source: {
      organization: 'INSO',
      standardNumber: '103',
      clauseOrTable: 'جدول ۱ - ویژگی‌های فیزیکی و شیمیایی انواع آرد گندم',
      year: '1396',
      titleFa: 'آرد گندم - ویژگی‌ها و روش‌های آزمون'
    },
    historicalMean: 13.45,
    historicalSD: 0.18,
    warningLimitUpper: 13.81,
    warningLimitLower: 13.09,
    controlLimitUpper: 13.99,
    controlLimitLower: 12.91
  },
  {
    id: 'limit-flour-ash',
    analyteId: 'chem-ash-furnace',
    analyteNameFa: 'درصد خاکستر تام (بر پایه ماده خشک)',
    analyteNameEn: 'Total Ash on Dry Basis',
    sector: 'cereals_bakery',
    matrixFa: 'آرد گندم ستاره (Star Wheat Flour)',
    unit: '% w/w (d.b.)',
    minLimit: 0.0,
    maxLimit: 0.65,
    targetValue: 0.58,
    source: {
      organization: 'INSO',
      standardNumber: '103',
      clauseOrTable: 'جدول ۱ - ردیف ۳ (آرد ستاره)',
      year: '1396',
      titleFa: 'آرد گندم - درصد خاکستر بر مبنای ماده خشک'
    },
    historicalMean: 0.59,
    historicalSD: 0.015,
    warningLimitUpper: 0.62,
    warningLimitLower: 0.56,
    controlLimitUpper: 0.635,
    controlLimitLower: 0.545
  },

  // --- Beverages: Natural Fruit Juice / Apple Juice ---
  {
    id: 'limit-juice-brix',
    analyteId: 'chem-refractometry-brix',
    analyteNameFa: 'بریکس آب سیب طبیعی بازسازی‌شده',
    analyteNameEn: 'Apple Juice Soluble Solids (Brix)',
    sector: 'beverages',
    matrixFa: 'آب سیب طبیعی (Apple Juice from Concentrate)',
    unit: '°Brix',
    minLimit: 11.20,
    maxLimit: 13.50,
    targetValue: 11.50,
    source: {
      organization: 'INSO',
      standardNumber: '2685',
      clauseOrTable: 'جدول ۱ - حداقل بریکس آبمیوه‌ها',
      year: '1397',
      titleFa: 'آبمیوه‌ها - ویژگی‌ها و حداقل بریکس بازسازی‌شده'
    },
    historicalMean: 11.60,
    historicalSD: 0.12,
    warningLimitUpper: 11.84,
    warningLimitLower: 11.36,
    controlLimitUpper: 11.96,
    controlLimitLower: 11.24
  },
  {
    id: 'limit-juice-vitaminc',
    analyteId: 'chem-vitamins-ascorbic',
    analyteNameFa: 'اسید آسکوربیک (ویتامین ث افزوده)',
    analyteNameEn: 'Vitamin C Content',
    sector: 'beverages',
    matrixFa: 'آبمیوه غنی‌شده (Fortified Juice)',
    unit: 'mg/100ml',
    minLimit: 30.0,
    targetValue: 45.0,
    source: {
      organization: 'INSO',
      standardNumber: '5569',
      clauseOrTable: 'بند ۴.۲ - میزان ویتامین ث در فرآورده‌های غنی‌شده',
      year: '1395',
      titleFa: 'فرآورده‌های نوشیدنی - الزام غنی‌سازی با ویتامین ث'
    },
    historicalMean: 43.5,
    historicalSD: 1.8,
    warningLimitUpper: 47.1,
    warningLimitLower: 39.9,
    controlLimitUpper: 48.9,
    controlLimitLower: 38.1
  }
];

/**
 * 2. Equipment Registry with Active Calibration Status
 */
export const EQUIPMENT_REGISTRY: EquipmentCalibrationRecord[] = [
  {
    equipmentId: 'eq-bal-001',
    equipmentNameFa: 'ترازوی تحلیلی ۴ رقمی آنالیتیکال',
    equipmentNameEn: '4-Decimal Analytical Balance',
    model: 'Mettler Toledo ME204T',
    serialNumber: 'MT-2024-99824',
    assetTag: 'LAB-EQ-BAL-01',
    calibrationStatus: 'calibrated',
    lastCalibrationDate: '2026-01-15',
    nextCalibrationDueDate: '2027-01-15',
    calibrationCertificateNo: 'CAL-2026-NIST-8842',
    calibrationProvider: 'شرکت مرجع کالیبراسیون آزمون سنجش دقیق'
  },
  {
    equipmentId: 'eq-ph-002',
    equipmentNameFa: 'دستگاه pH متر رومیزی دیجیتال کالیبره‌شده',
    equipmentNameEn: 'Benchtop Digital pH Meter',
    model: 'Metrohm 780 pH Meter',
    serialNumber: 'MET-780-55410',
    assetTag: 'LAB-EQ-PH-02',
    calibrationStatus: 'calibrated',
    lastCalibrationDate: '2026-02-01',
    nextCalibrationDueDate: '2026-08-01',
    calibrationCertificateNo: 'CAL-2026-MET-1120',
    calibrationProvider: 'متروم ایران - واحد خدمات کالیبراسیون'
  },
  {
    equipmentId: 'eq-uv-003',
    equipmentNameFa: 'اسپکتروفتومتر دوپرتویی UV-Vis',
    equipmentNameEn: 'Double-Beam UV-Vis Spectrophotometer',
    model: 'Shimadzu UV-1800',
    serialNumber: 'SHIM-1800-4491',
    assetTag: 'LAB-EQ-SPEC-03',
    calibrationStatus: 'calibrated',
    lastCalibrationDate: '2025-11-20',
    nextCalibrationDueDate: '2026-11-20',
    calibrationCertificateNo: 'CAL-2025-OPT-7731',
    calibrationProvider: 'آزمایشگاه همکار سازمان ملی استاندارد'
  },
  {
    equipmentId: 'eq-oven-004',
    equipmentNameFa: 'آون حرارتی دیجیتال سیرکولاسیون هوا (۱۰۵ درجه)',
    equipmentNameEn: 'Forced Convection Drying Oven',
    model: 'Memmert UN55',
    serialNumber: 'MEM-UN55-3381',
    assetTag: 'LAB-EQ-OVN-04',
    calibrationStatus: 'calibrated',
    lastCalibrationDate: '2025-10-10',
    nextCalibrationDueDate: '2026-10-10',
    calibrationCertificateNo: 'CAL-2025-THM-9912',
    calibrationProvider: 'مرکز ملی تایید صلاحیت ایران (NACI)'
  },
  {
    equipmentId: 'eq-furnace-005',
    equipmentNameFa: 'کوره الکتریکی تکلیس خاکستر (۵۵۰ درجه)',
    equipmentNameEn: 'Muffle Ashing Furnace',
    model: 'Nabertherm L9/11',
    serialNumber: 'NAB-L9-1109',
    assetTag: 'LAB-EQ-FUR-05',
    calibrationStatus: 'calibrated',
    lastCalibrationDate: '2025-09-12',
    nextCalibrationDueDate: '2026-09-12',
    calibrationCertificateNo: 'CAL-2025-HT-4410',
    calibrationProvider: 'شرکت کالیبراسیون دما و فشار سنجش'
  },
  {
    equipmentId: 'eq-ref-006',
    equipmentNameFa: 'رفراکتومتر دیجیتال رومیزی با کنترل دما (ATC)',
    equipmentNameEn: 'Digital Benchtop Refractometer (ATC)',
    model: 'Atago RX-5000i',
    serialNumber: 'ATG-5000-8812',
    assetTag: 'LAB-EQ-REF-06',
    calibrationStatus: 'calibrated',
    lastCalibrationDate: '2026-01-20',
    nextCalibrationDueDate: '2027-01-20',
    calibrationCertificateNo: 'CAL-2026-OPT-5509',
    calibrationProvider: 'نمایندگی آتاگو ژاپن - ایران'
  },
  {
    equipmentId: 'eq-kjeldahl-007',
    equipmentNameFa: 'سیستم هضم و تقطیر اتوماتیک کجلدال پروتئین',
    equipmentNameEn: 'Automatic Kjeldahl Distillation Unit',
    model: 'Gerhardt Vapodest 50s',
    serialNumber: 'GER-VAP-7719',
    assetTag: 'LAB-EQ-KJL-07',
    calibrationStatus: 'calibrated',
    lastCalibrationDate: '2025-12-05',
    nextCalibrationDueDate: '2026-12-05',
    calibrationCertificateNo: 'CAL-2025-KJL-3381',
    calibrationProvider: 'شرکت تجهیزات آزمایشگاهی گرهارد'
  },
  {
    equipmentId: 'eq-soxhlet-008',
    equipmentNameFa: 'دستگاه تمام اتوماتیک استخراج چربی سوکسله',
    equipmentNameEn: 'Automated Soxhlet Fat Extraction System',
    model: 'Buchi Fat Extractor E-500',
    serialNumber: 'BCH-E500-2219',
    assetTag: 'LAB-EQ-SOX-08',
    calibrationStatus: 'calibrated',
    lastCalibrationDate: '2026-01-08',
    nextCalibrationDueDate: '2027-01-08',
    calibrationCertificateNo: 'CAL-2026-SOX-1014',
    calibrationProvider: 'بوخی سوئیس - واحد پشتیبانی'
  }
];

/**
 * 3. Reagent Lots Registry (Traceability of Chemicals)
 */
export const REAGENT_LOTS_REGISTRY: ReagentLotRecord[] = [
  {
    reagentId: 'reag-naoh-01',
    reagentNameFa: 'سدیم هیدروکسید ۰.۱ نرمال استانداردشده',
    reagentNameEn: 'Sodium Hydroxide 0.1N Standard Volumetric Solution',
    manufacturer: 'Merck KGaA Germany',
    lotNumber: 'M-NAOH-2026-0881',
    purityGrade: 'Volumetric Standard Solution (NIST Traceable)',
    expirationDate: '2027-06-30',
    isExpired: false,
    preparationOrStandardizationDate: '2026-02-10',
    standardizedFactorOrTiter: 1.0004
  },
  {
    reagentId: 'reag-agno3-02',
    reagentNameFa: 'نقره نیترات ۰.۱ نرمال تیتراسیون موهر',
    reagentNameEn: 'Silver Nitrate 0.1N Titrant',
    manufacturer: 'Merck KGaA Germany',
    lotNumber: 'M-AGNO3-2025-991',
    purityGrade: 'Analytical Grade (AR)',
    expirationDate: '2027-12-31',
    isExpired: false,
    preparationOrStandardizationDate: '2026-01-18',
    standardizedFactorOrTiter: 0.9998
  },
  {
    reagentId: 'reag-hcl-03',
    reagentNameFa: 'هیدروکلریک اسید ۰.۱ نرمال کجلدال',
    reagentNameEn: 'Hydrochloric Acid 0.1N Standard Solution',
    manufacturer: 'Sigma-Aldrich / Honeywell',
    lotNumber: 'SA-HCL-2026-331',
    purityGrade: 'Analytical Grade Reagent',
    expirationDate: '2028-01-15',
    isExpired: false,
    preparationOrStandardizationDate: '2026-02-05',
    standardizedFactorOrTiter: 1.0002
  },
  {
    reagentId: 'reag-thio-04',
    reagentNameFa: 'تیوسولفات سدیم ۰.۰۱ نرمال عدد پراکسید',
    reagentNameEn: 'Sodium Thiosulfate 0.01N Standardized',
    manufacturer: 'Merck KGaA',
    lotNumber: 'M-THIO-2026-442',
    purityGrade: 'Traceable to NIST SRM 136f',
    expirationDate: '2026-11-30',
    isExpired: false,
    preparationOrStandardizationDate: '2026-02-15',
    standardizedFactorOrTiter: 1.0010
  },
  {
    reagentId: 'reag-petether-05',
    reagentNameFa: 'پترولیوم اتر دامنه جوش ۴۰-۶۰ درجه (سوکسله)',
    reagentNameEn: 'Petroleum Ether 40-60°C for Fat Extraction',
    manufacturer: 'Merck KGaA',
    lotNumber: 'M-PET-2025-778',
    purityGrade: 'Residue Analysis Grade',
    expirationDate: '2028-05-20',
    isExpired: false
  },
  {
    reagentId: 'reag-dcpip-06',
    reagentNameFa: 'معرف ۲و۶-دی‌کلروفنل‌ایندوفنل (ویتامین ث)',
    reagentNameEn: '2,6-Dichloroindophenol Sodium Salt Solution',
    manufacturer: 'Fluka / Sigma',
    lotNumber: 'FL-DCPIP-2026-102',
    purityGrade: 'Analytical Indicator Grade',
    expirationDate: '2026-08-30',
    isExpired: false,
    preparationOrStandardizationDate: '2026-02-20',
    standardizedFactorOrTiter: 0.198
  }
];

/**
 * 4. Operators / Analysts Registry
 */
export const OPERATOR_REGISTRY: OperatorRecord[] = [
  {
    operatorId: 'op-qc-101',
    fullNameFa: 'مهندس سارا رستمی',
    fullNameEn: 'Eng. Sara Rostami',
    qualificationFa: 'کارشناس ارشد صنایع غذایی - آنالیست شیمی مواد غذایی',
    role: 'chemist'
  },
  {
    operatorId: 'op-qc-102',
    fullNameFa: 'مهندس علی کاظمی',
    fullNameEn: 'Eng. Ali Kazemi',
    qualificationFa: 'کارشناس ارشد کنترل کیفیت و تضمین کیفیت (QA/QC)',
    role: 'qc_supervisor'
  },
  {
    operatorId: 'op-qa-103',
    fullNameFa: 'دکتر مریم مهدوی',
    fullNameEn: 'Dr. Maryam Mahdavi',
    qualificationFa: 'دکترای علوم و صنایع غذایی - مدیر تضمین کیفیت و سرممیز ISO 17025',
    role: 'qa_manager'
  },
  {
    operatorId: 'op-mb-104',
    fullNameFa: 'مهندس نیلوفر احمدی',
    fullNameEn: 'Eng. Niloofar Ahmadi',
    qualificationFa: 'کارشناس ارشد میکروبیولوژی کاربردی صنایع غذایی',
    role: 'microbiologist'
  }
];

/**
 * 5. Production Batches Repository
 */
export const BENCHMARK_PRODUCTION_BATCHES: QCProductionBatch[] = [
  {
    batchNumber: 'BATCH-2026-MILK-104',
    productNameFa: 'شیر پاستوریزه ۳٪ چربی بطری ۱ لیتری',
    productionDate: '2026-08-25',
    expirationDate: '2026-08-30',
    batchSize: 12000,
    batchUnit: 'liter',
    productionLine: 'خط پرکن بطری A - سالن پاستوریزاسیون ۲',
    shift: 'morning',
    status: 'released',
    qaReleaseSignoff: {
      qaManagerName: 'دکتر مریم مهدوی',
      decisionDate: '2026-08-25',
      certificateNumber: 'COA-2026-MILK-104-REL',
      commentsFa: 'کلیه نتایج فیزیکوشیمیایی، چربی، اسیدیته و میکروبی منطبق بر استاندارد ملی INSO 2406 بوده و خروج بهمن بلامانع است.'
    }
  },
  {
    batchNumber: 'BATCH-2026-TOMATO-042',
    productNameFa: 'رب گوجه‌فرنگی قوطی ۸۰۰ گرمی بریکس ۲۸',
    productionDate: '2026-08-26',
    expirationDate: '2028-08-26',
    batchSize: 18000,
    batchUnit: 'package',
    productionLine: 'خط فرآوری و تغلیظ کانتینیوس شماره ۱',
    shift: 'evening',
    status: 'released',
    qaReleaseSignoff: {
      qaManagerName: 'دکتر مریم مهدوی',
      decisionDate: '2026-08-26',
      certificateNumber: 'COA-2026-TOM-042-REL',
      commentsFa: 'بریکس ۲۸.۵ و نمک ۱.۱٪ منطبق بر استاندارد ملی INSO 761. تایید خروج انبار صادر شد.'
    }
  },
  {
    batchNumber: 'BATCH-2026-OIL-091',
    productNameFa: 'روغن سرخ‌کردنی شفاف بطری ۳ لیتری',
    productionDate: '2026-08-27',
    expirationDate: '2027-08-27',
    batchSize: 8500,
    batchUnit: 'liter',
    productionLine: 'خط تصفیه و پرکنی روغن شماره ۲',
    shift: 'morning',
    status: 'in_quarantine',
    qaReleaseSignoff: {
      qaManagerName: 'دکتر مریم مهدوی',
      decisionDate: '2026-08-27',
      commentsFa: 'نمونه در مرحله آزمون عدد پراکسید و پایداری اکسیداتیو (Rancimat) قرار دارد.'
    }
  },
  {
    batchNumber: 'BATCH-2026-FLOUR-312',
    productNameFa: 'آرد گندم ستاره نان فانتزی کیسه ۴۰ کیلویی',
    productionDate: '2026-08-24',
    expirationDate: '2026-11-24',
    batchSize: 25,
    batchUnit: 'ton',
    productionLine: 'بخش آسیابانی والسی و الک‌های بوجاری',
    shift: 'night',
    status: 'released',
    qaReleaseSignoff: {
      qaManagerName: 'دکتر مریم مهدوی',
      decisionDate: '2026-08-25',
      certificateNumber: 'COA-2026-FLR-312-REL',
      commentsFa: 'رطوبت ۱۳.۳٪ و خاکستر ۰.۵۸٪ منطبق بر استاندارد INSO 103.'
    }
  }
];

/**
 * 6. Benchmark Samples Repository
 */
export const BENCHMARK_QC_SAMPLES: QCSample[] = [
  {
    id: 'smp-2026-0810',
    sampleCode: 'SMP-2026-MILK-104-A',
    productNameFa: 'شیر پاستوریزه ۳٪ چربی',
    productNameEn: 'Whole Pasteurized Milk 3% Fat',
    sector: 'dairy',
    batchNumber: 'BATCH-2026-MILK-104',
    samplingDateTime: '2026-08-25T08:30:00',
    samplingLocationFa: 'خروجی پلیت کولر تانک ذخیره شماره ۳',
    samplerNameFa: 'مهندس سارا رستمی',
    sampleMatrixFa: 'مایع همگن شیری',
    sampleTemperatureCelsius: 4.0,
    storageConditionFa: 'یخچال آزمایشگاهی ۴ درجه سلسیوس',
    sampleState: 'approved',
    retainedSampleLocation: 'قفسه شاهد لبنیات R-04'
  },
  {
    id: 'smp-2026-0811',
    sampleCode: 'SMP-2026-TOM-042-C',
    productNameFa: 'رب گوجه‌فرنگی بریکس ۲۸',
    productNameEn: 'Canned Tomato Paste 28 Brix',
    sector: 'canning_preserves',
    batchNumber: 'BATCH-2026-TOMATO-042',
    samplingDateTime: '2026-08-26T16:15:00',
    samplingLocationFa: 'خروجی فیلر اتوماتیک و بسته‌بندی قوطی',
    samplerNameFa: 'مهندس علی کاظمی',
    sampleMatrixFa: 'خمیر غلیظ قرمز',
    sampleTemperatureCelsius: 22.0,
    storageConditionFa: 'محیط خشک و خنک آزمایشگاه',
    sampleState: 'approved',
    retainedSampleLocation: 'انبار نمونه شاهد کنسرو K-12'
  },
  {
    id: 'smp-2026-0812',
    sampleCode: 'SMP-2026-OIL-091-B',
    productNameFa: 'روغن سرخ‌کردنی شفاف',
    productNameEn: 'Frying Oil Refined',
    sector: 'oils_fats',
    batchNumber: 'BATCH-2026-OIL-091',
    samplingDateTime: '2026-08-27T09:00:00',
    samplingLocationFa: 'نازل شماره ۴ پرکن خط مایعات',
    samplerNameFa: 'مهندس سارا رستمی',
    sampleMatrixFa: 'روغن مایع شفاف زرد روشن',
    sampleTemperatureCelsius: 25.0,
    storageConditionFa: 'کابینت تاریک بدون نور',
    sampleState: 'under_analysis',
    retainedSampleLocation: 'قفسه شاهد روغن O-02'
  },
  {
    id: 'smp-2026-0813',
    sampleCode: 'SMP-2026-FLR-312-D',
    productNameFa: 'آرد گندم ستاره نان فانتزی',
    productNameEn: 'Star Wheat Flour',
    sector: 'cereals_bakery',
    batchNumber: 'BATCH-2026-FLOUR-312',
    samplingDateTime: '2026-08-24T23:45:00',
    samplingLocationFa: 'قیف بارگیری کیسه‌پرکن والسی شماره ۲',
    samplerNameFa: 'مهندس علی کاظمی',
    sampleMatrixFa: 'پودر سفید آردی یکنواخت',
    sampleTemperatureCelsius: 21.0,
    storageConditionFa: 'دسیکاتور رطوبت‌بندی آزمایشگاه',
    sampleState: 'approved',
    retainedSampleLocation: 'کابینت نمونه‌های غلات C-08'
  }
];

/**
 * 7. Benchmark QC Test Results with Replicates, Traceability & Calculations
 */
export const BENCHMARK_QC_TEST_RESULTS: QCTestResult[] = [
  {
    id: 'res-milk-fat-104',
    sampleId: 'smp-2026-0810',
    batchNumber: 'BATCH-2026-MILK-104',
    testCode: 'CHEM-FAT-GERBER',
    testTitleFa: 'سنجش چربی شیر پاستوریزه به روش بوتیرومتری ژربر',
    analyteNameFa: 'درصد چربی کل شیر',
    testCategory: 'chemical',
    replicates: [
      { repNumber: 1, rawReading: 3.20, calculatedValue: 3.20, timestamp: '2026-08-25T09:10:00' },
      { repNumber: 2, rawReading: 3.20, calculatedValue: 3.20, timestamp: '2026-08-25T09:15:00' },
      { repNumber: 3, rawReading: 3.21, calculatedValue: 3.21, timestamp: '2026-08-25T09:20:00' }
    ],
    mean: 3.203,
    standardDeviation: 0.0058,
    relativeStandardDeviation: 0.18, // 0.18% RSD
    unit: '% w/w',
    testTimestamp: '2026-08-25T09:25:00',
    operator: OPERATOR_REGISTRY[0], // Eng. Sara Rostami
    equipment: {
      ...EQUIPMENT_REGISTRY[0],
      equipmentNameFa: 'سانتریفیوژ اختصاصی ژربر شیر با هیتر داخلی',
      model: 'Funke Gerber SuperVario-N'
    },
    reagentLot: {
      reagentId: 'reag-h2so4-gerber',
      reagentNameFa: 'اسید سولفوریک ژربر دانسیته ۱.۸۲۰',
      reagentNameEn: 'Sulfuric Acid d=1.820 for Gerber Fat Test',
      manufacturer: 'Merck KGaA',
      lotNumber: 'M-H2SO4-2026-091',
      purityGrade: 'Gerber Analytical Grade',
      expirationDate: '2028-10-01',
      isExpired: false
    },
    standardMethodRef: {
      organization: 'INSO',
      standardNumber: '2406',
      methodNameFa: 'روش استاندارد آزمون چربی ژربر شیر پاستوریزه'
    },
    limitInfo: VERIFIED_ACCEPTANCE_LIMITS[0],
    hasVerifiedLimit: true,
    complianceStatus: 'in_spec_in_control',
    spcEvaluation: {
      isControlled: true,
      violations: [],
      trendStatusFa: 'فرآیند در حالت پایدار آماری (In-Control) و منطبق بر مشخصات استاندارد INSO 2406 قرار دارد.'
    },
    analystRemarksFa: 'نتیجه آزمون در ۳ تکرار همگرایی بسیار بالایی داشته (RSD = 0.18%) و در محدوده مجاز ۳.۰۰ تا ۳.۶۰ درصد استاندارد ملی قرار دارد.',
    supervisorApproval: {
      approvedBy: 'دکتر مریم مهدوی',
      approvalDate: '2026-08-25T11:00:00',
      status: 'approved',
      commentsFa: 'تایید شد. با مقادیر روز گذشته خط تولید همخوانی کامل دارد.'
    }
  },
  {
    id: 'res-tomato-brix-042',
    sampleId: 'smp-2026-0811',
    batchNumber: 'BATCH-2026-TOMATO-042',
    testCode: 'CHEM-BRIX-REF',
    testTitleFa: 'سنجش مواد جامد محلول (بریکس) رب گوجه‌فرنگی با رفرکتومتر دیجیتال ATC',
    analyteNameFa: 'درجه بریکس بدون نمک (Soluble Solids)',
    testCategory: 'physical',
    replicates: [
      { repNumber: 1, rawReading: 28.52, calculatedValue: 28.52, timestamp: '2026-08-26T16:40:00' },
      { repNumber: 2, rawReading: 28.48, calculatedValue: 28.48, timestamp: '2026-08-26T16:42:00' }
    ],
    mean: 28.50,
    standardDeviation: 0.028,
    relativeStandardDeviation: 0.10,
    unit: '°Brix',
    testTimestamp: '2026-08-26T16:45:00',
    operator: OPERATOR_REGISTRY[1], // Eng. Ali Kazemi
    equipment: EQUIPMENT_REGISTRY[5], // Atago Refractometer
    standardMethodRef: {
      organization: 'INSO',
      standardNumber: '761',
      methodNameFa: 'روش رفرکتومتری با تصحیح دمایی ۲۰ درجه'
    },
    limitInfo: VERIFIED_ACCEPTANCE_LIMITS[3],
    hasVerifiedLimit: true,
    complianceStatus: 'in_spec_in_control',
    spcEvaluation: {
      isControlled: true,
      violations: [],
      trendStatusFa: 'میانگین بریکس ۲۸.۵۰ در مرکز دامنه مطلوب ۲۸.۰ تا ۳۰.۰ استاندارد ملی قرار دارد.'
    },
    analystRemarksFa: 'کالیبراسیون رفرکتومتر قبل از آزمون با آب مقطر ۲ بار تقطیر بررسی و صفر دستگاه تایید گردید.',
    supervisorApproval: {
      approvedBy: 'دکتر مریم مهدوی',
      approvalDate: '2026-08-26T17:30:00',
      status: 'approved'
    }
  },
  {
    id: 'res-oil-peroxide-091',
    sampleId: 'smp-2026-0812',
    batchNumber: 'BATCH-2026-OIL-091',
    testCode: 'CHEM-PEROXIDE-TIT',
    testTitleFa: 'سنجش عدد پراکسید روغن سرخ‌کردنی به روش تیتراسیون یدومتری',
    analyteNameFa: 'عدد پراکسید (Peroxide Value)',
    testCategory: 'chemical',
    replicates: [
      { repNumber: 1, rawReading: 0.92, calculatedValue: 0.92, timestamp: '2026-08-27T09:30:00' },
      { repNumber: 2, rawReading: 0.96, calculatedValue: 0.96, timestamp: '2026-08-27T09:35:00' }
    ],
    mean: 0.94,
    standardDeviation: 0.028,
    relativeStandardDeviation: 3.01,
    unit: 'meq O2/kg',
    testTimestamp: '2026-08-27T09:40:00',
    operator: OPERATOR_REGISTRY[0],
    equipment: EQUIPMENT_REGISTRY[0],
    reagentLot: REAGENT_LOTS_REGISTRY[3], // Thiosulfate
    standardMethodRef: {
      organization: 'INSO',
      standardNumber: '4152',
      methodNameFa: 'تیتراسیون یدومتری عدد پراکسید'
    },
    limitInfo: VERIFIED_ACCEPTANCE_LIMITS[5],
    hasVerifiedLimit: true,
    complianceStatus: 'in_spec_in_control',
    spcEvaluation: {
      isControlled: true,
      violations: [],
      trendStatusFa: 'عدد پراکسید ۰.۹۴ meq O2/kg کمتر از سقف مجاز ۲.۰ بوده و فرآورده از کیفیت اکسیداتیو مطلوب برخوردار است.'
    },
    analystRemarksFa: 'آزمون شاهد (بلانک) انجام شد و حجم مصرفی تیوسولفات بلانک از تیتر کسر گردید.'
  }
];

/**
 * 8. 20 Historical Run Points for Shewhart Control Chart & SPC Trend Analysis
 * (Simulating 20 consecutive production batches for Milk Fat % w/w)
 */
export const MILK_FAT_HISTORICAL_RUNS: QCTrendPoint[] = [
  { batchNumber: 'B-081', sampleCode: 'SMP-081', date: '2026-08-01', value: 3.16, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-082', sampleCode: 'SMP-082', date: '2026-08-02', value: 3.17, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-083', sampleCode: 'SMP-083', date: '2026-08-03', value: 3.19, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-084', sampleCode: 'SMP-084', date: '2026-08-04', value: 3.18, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-085', sampleCode: 'SMP-085', date: '2026-08-05', value: 3.20, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-086', sampleCode: 'SMP-086', date: '2026-08-06', value: 3.17, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-087', sampleCode: 'SMP-087', date: '2026-08-07', value: 3.19, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-088', sampleCode: 'SMP-088', date: '2026-08-08', value: 3.22, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-089', sampleCode: 'SMP-089', date: '2026-08-09', value: 3.21, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-090', sampleCode: 'SMP-090', date: '2026-08-10', value: 3.18, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-091', sampleCode: 'SMP-091', date: '2026-08-11', value: 3.20, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-092', sampleCode: 'SMP-092', date: '2026-08-12', value: 3.23, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-093', sampleCode: 'SMP-093', date: '2026-08-13', value: 3.24, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-094', sampleCode: 'SMP-094', date: '2026-08-14', value: 3.26, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_warning', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' }, // Warning (+2SD)
  { batchNumber: 'B-095', sampleCode: 'SMP-095', date: '2026-08-15', value: 3.22, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-096', sampleCode: 'SMP-096', date: '2026-08-16', value: 3.19, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-097', sampleCode: 'SMP-097', date: '2026-08-17', value: 3.18, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-098', sampleCode: 'SMP-098', date: '2026-08-18', value: 3.20, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'علی کاظمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-099', sampleCode: 'SMP-099', date: '2026-08-19', value: 3.21, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' },
  { batchNumber: 'B-100', sampleCode: 'SMP-100', date: '2026-08-20', value: 3.20, mean: 3.18, ucl: 3.285, lcl: 3.075, uwl: 3.25, lwl: 3.11, usl: 3.60, lsl: 3.00, status: 'in_spec_in_control', operator: 'سارا رستمی', equipment: 'Gerber Centrifuge' }
];

/**
 * 9. Non-Conformance & Deviation Cases
 */
export const BENCHMARK_QC_DEVIATIONS: QCDeviation[] = [
  {
    id: 'dev-2026-014',
    deviationNumber: 'DEV-2026-014',
    dateReported: '2026-08-20',
    severity: 'major',
    sourceType: 'oos_result',
    batchNumber: 'BATCH-2026-OIL-088',
    titleFa: 'انحراف عدد پراکسید روغن سرخ‌کردنی به ۲.۴۵ meq O2/kg (فراتر از سقف ۲.۰ استاندارد INSO 4152)',
    descriptionFa: 'در جریان آزمون کنترل کیفیت خروج بهمن شماره BATCH-2026-OIL-088، عدد پراکسید روغن سرخ‌کردنی ۲.۴۵ میلی‌اکی‌والان بر کیلوگرم ثبت شد که با استاندارد ملی INSO 4152 (حداکثر ۲.۰) مغایرت دارد.',
    rootCauseAnalysisFa: {
      category: 'machine',
      rootCauseSummaryFa: 'خرابی و افت فشار در سامانه تزریق گاز نیتروژن (N2 Sparging) در مخزن ذخیره خنک‌کننده روغن که منجر به هوادهی ناخواسته روغن داغ در دمای ۷۵ درجه شد.',
      fiveWhysSummaryFa: [
        'چرا عدد پراکسید افزایش یافت؟ روغن در تانک ذخیره دچار اکسیداسیون حرارتی اولیه شد.',
        'چرا اکسیداسیون رخ داد؟ گاز نیتروژن خنثی‌کننده روی سطح روغن قطع شده بود.',
        'چرا نیتروژن قطع شد؟ شیر برقی رگلاتور ورودی نیتروژن در وضعیت بسته گیر کرده بود.',
        'چرا گیر کرده بود؟ عدم انجام سرویس دوره‌ای ۳ ماهه سلونوئید ولو.',
        'ریشه نهایی: نقص در برنامه نگهداری و تعمیرات پیشگیرانه (PM) تجهیزات جانبی تانک.'
      ]
    },
    immediateCorrectionFa: 'توقف فوری خط بسته‌بندی، ایزولاسیون و الصاق برچسب قرمز قرنطینه (Quarantine) بر روی مخزن ۸۰۰۰ لیتری بهمن ۰۸۸ جهت جلوگیری از ورود به بازار.',
    productDisposition: 'rework',
    reportedBy: 'مهندس سارا رستمی (آنالیست QC)',
    status: 'capa_assigned',
    capaId: 'capa-2026-009'
  },
  {
    id: 'dev-2026-015',
    deviationNumber: 'DEV-2026-015',
    dateReported: '2026-08-22',
    severity: 'minor',
    sourceType: 'equipment_calibration',
    titleFa: 'انقضای تاریخ کالیبراسیون دوره‌ای پی‌اچ‌متر پرتابل خط تولید پنیر',
    descriptionFa: 'طی پایش دوره‌ای تضمین کیفیت (QA Audit)، مشخص گردید برچسب کالیبراسیون دستگاه pH متر پرتابل سالن فرآوری ۴ روز از موعد انقضاء گذشته است.',
    rootCauseAnalysisFa: {
      category: 'measurement',
      rootCauseSummaryFa: 'عدم ثبت خودکار هشدار انقضای تجهیزات پرتابل در تقویم مدیریت تجهیزات آزمایشگاهی.'
    },
    immediateCorrectionFa: 'خارج کردن فوری دستگاه از خط، کالیبراسیون ۳ نقطه‌ای با بافرهای ۴.۰۱، ۷.۰۰ و ۹.۲۱ و ارسال به آزمایشگاه کالیبراسیون معتمد.',
    productDisposition: 'concession_release',
    reportedBy: 'مهندس علی کاظمی (سوپروایزر QC)',
    status: 'closed',
    capaId: 'capa-2026-010'
  }
];

/**
 * 10. Corrective and Preventive Action (CAPA) Repository
 */
export const BENCHMARK_CAPA_ACTIONS: QCCAPAAction[] = [
  {
    id: 'capa-2026-009',
    capaNumber: 'CAPA-2026-009',
    deviationId: 'dev-2026-014',
    actionType: 'both',
    titleFa: 'اصلاح سامانه نیتروژن‌دهی و بازطراحی برنامه PM شیرهای برقی مخازن روغن',
    actionPlanFa: '۱. تعویض فوری سلونوئید ولو نیتروژن با قطعه جدید استنلس استیل ۳۱۶.\n۲. نصب سنسور آلارم افت فشار گاز نیتروژن با اتصال به اسکادای اتاق کنترل.\n۳. بازبینی چک‌لیست PM و الزام بررسی هفتگی خطوط گاز بی‌اثر.',
    rootCauseAddressedFa: 'جلوگیری از قطع ناخواسته نیتروژن در حین فرآیند خنک‌سازی روغن و حذف کامل ریسک اکسیداسیون اولیه.',
    assignedTo: 'مهندس رضا شریفی (مدیر فنی و نگهداری) و مهندس علی کاظمی (سوپروایزر QC)',
    targetCompletionDate: '2026-09-10',
    effectivenessReview: {
      reviewDate: '2026-09-25',
      reviewedBy: 'دکتر مریم مهدوی (مدیر تضمین کیفیت)',
      isEffective: true,
      evidenceNotesFa: 'در پایش ۱۰ بهمن متوالی پس از نصب سنسور، میانگین عدد پراکسید به ۰.۷۵ meq/kg تثبیت گردید و هیچ‌گونه نوسان اکسیژن رخ نداد.'
    },
    status: 'in_progress'
  },
  {
    id: 'capa-2026-010',
    capaNumber: 'CAPA-2026-010',
    deviationId: 'dev-2026-015',
    actionType: 'preventive',
    titleFa: 'راه‌اندازی سیستم هشدار پیامکی و کارتابلی انقضای کالیبراسیون تجهیزات آزمایشگاه (ISO 17025)',
    actionPlanFa: 'ایجاد ماژول پایش خودکار ۳۰ روز قبل از انقضاء برای کلیه ابزارهای سنجش و الصاق بارکد QR برچسب کالیبراسیون روی بدنه دستگاه‌ها.',
    rootCauseAddressedFa: 'حذف خطای انسانی در فراموشی تاریخ‌های کالیبراسیون دوره‌ای ادوات آزمایشگاهی.',
    assignedTo: 'مهندس سارا رستمی (مسئول کنترل تجهیزات)',
    targetCompletionDate: '2026-08-30',
    actualCompletionDate: '2026-08-28',
    effectivenessReview: {
      reviewDate: '2026-08-28',
      reviewedBy: 'دکتر مریم مهدوی',
      isEffective: true,
      evidenceNotesFa: 'سامانه راه‌اندازی شد و تمام ابزارهای آزمایشگاهی دارای وضعیت سبز فعال گردیدند.'
    },
    status: 'verified_closed'
  }
];

/**
 * 11. Educational Framework: Comprehensive QC vs QA Matrix
 */
export const QC_QA_EDUCATIONAL_GUIDE = {
  titleFa: 'چارچوب جامع مفاهیم و تمایزات کنترل کیفیت (QC) و تضمین کیفیت (QA)',
  summaryFa: 'در صنایع غذایی نوین و الزامات استاندارد ISO 17025، ISO 22000 و GMP، کنترل کیفیت و تضمین کیفیت دو بال مکمل یکدیگر هستند اما از حیث اهداف، سطح اقدام و رویکرد اجرایی تمایزات بنیادین دارند.',
  comparisonPoints: [
    {
      parameterFa: 'ماهیت و هدف اصلی',
      qaFa: 'تضمین کیفیت فرآیندمحور و پیشگیرانه (Preventive) است؛ هدف آن ایجاد اطمینان از این است که فرآیندها به‌گونه‌ای طراحی شده‌اند که محصول نهایی بدون عیب و مطابق استاندارد تولید شود.',
      qcFa: 'کنترل کیفیت محصول‌محور و کشف‌کننده (Detection) است؛ هدف آن اندازه‌گیری، آزمون، بازرسی و مقایسه ویژگی‌های فیزیکوشیمیایی و میکروبی بهمن با حدود استاندارد است.'
    },
    {
      parameterFa: 'زمان و نقطه تمرکز',
      qaFa: 'پیش از تولید و در تمام طول زنجیره تامین (طراحی سیستم، ممیزی‌ها، اعتبارسنجی روش‌ها، آموزش پرسنل، تدوین SOPها و برنامه‌های کالیبراسیون).',
      qcFa: 'در حین تولید و پس از تولید (نمونه‌برداری از مواد اولیه، حین فرآیند، محصول نهایی، کنترل بهمن‌ها و تصمیم‌گیری درباره آزادسازی، قرنطینه یا ریجکت).'
    },
    {
      parameterFa: 'استانداردهای مرجع',
      qaFa: 'ISO 9001 (سیستم مدیریت کیفیت)، ISO 22000 / HACCP (سیستم مدیریت ایمنی غذا)، ISO/IEC 17025 (الزامات عمومی صلاحیت آزمایشگاه‌های آزمون)، cGMP.',
      qcFa: 'استانداردهای ویژگی‌ها و روش‌های آزمون ملی (INSO) و بین‌المللی (AOAC, ISO, AOCS, IDF, ICUMSA, Codex Alimentarius).'
    },
    {
      parameterFa: 'ابزارها و تکنیک‌ها',
      qaFa: 'ممیزی‌های داخلی و خارجی، مدیریت ریسک و FMEA، سیستم مدیریت انحرافات (Deviations) و اقدامات اصلاحی/پیشگیرانه (CAPA)، کنترل مستندات و صحه‌گذاری (Validation).',
      qcFa: 'کالیبراسیون دستگاه‌ها، تیتراسیون، اسپکتروفتومتری، کروماتوگرافی، کشت میکروبی، نمودارهای شوهارت (X-bar/R)، قواعد وست‌گارد (Westgard Rules) و آزمون‌های تکرارپذیری (RSD).'
    },
    {
      parameterFa: 'مسئولیت سازمانی',
      qaFa: 'تعهد تمام ارکان سازمان از مدیریت ارشد تا تیم‌های تولیدی، R&D، نگهداری و تعمیرات و زنجیره تأمین.',
      qcFa: 'تیم کارشناسان و آنالیست‌های آزمایشگاه‌های شیمی، میکروبیولوژی و بازرسان کنترل خط تولید.'
    }
  ]
};
