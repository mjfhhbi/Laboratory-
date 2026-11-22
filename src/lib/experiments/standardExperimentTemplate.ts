/**
 * Food Science AI - Universal Standard Experiment Template Engine
 * 
 * Standard template implementation supporting all 26 required fields:
 * 1. id
 * 2. title
 * 3. category
 * 4. product
 * 5. purpose
 * 6. principle
 * 7. scope
 * 8. standardReferences
 * 9. sourceReferences
 * 10. equipment
 * 11. equipmentRequirements
 * 12. reagents
 * 13. samplePreparation
 * 14. solutionPreparation
 * 15. procedureSteps
 * 16. calculations
 * 17. qualityControl
 * 18. acceptanceCriteria
 * 19. commonErrors
 * 20. troubleshooting
 * 21. safety
 * 22. reporting
 * 23. notes
 * 24. version
 * 25. lastVerified
 * 26. verificationStatus
 * 
 * GOLDEN RULE:
 * Never fabricate citations, standard numbers, formulas, values, or limits.
 * If a field lacks a verified authoritative source, it must remain empty or be explicitly marked as 'Unverified'.
 * Designed to scale to thousands of experiments without schema changes.
 */

import {
  StandardExperimentTemplate,
  FoodExperiment,
  ExperimentDomain,
  ExperimentProcedureStep,
  ExperimentCalculation,
  ExperimentStandardReference,
  ExperimentEquipmentRequirementItem,
  ExperimentTroubleshootingItem,
  ExperimentAcceptanceCriteria,
  ExperimentQualityControl
} from '../../types/foodExperiment';
import { SourceCitation } from '../../types/knowledgeBase';

export interface SchemaFieldMeta {
  key: keyof StandardExperimentTemplate;
  labelFa: string;
  labelEn: string;
  descriptionFa: string;
  isRequired: boolean;
  requiresAuthoritativeSource: boolean;
  exampleValueFa: string;
}

export const STANDARD_EXPERIMENT_26_FIELDS: SchemaFieldMeta[] = [
  {
    key: 'id',
    labelFa: 'شناسه یکتا',
    labelEn: 'Unique Identifier',
    descriptionFa: 'شناسه یکتا و استاندارد پروتکل آزمون در پایگاه داده',
    isRequired: true,
    requiresAuthoritativeSource: false,
    exampleValueFa: 'exp_chem_acid_value_01'
  },
  {
    key: 'title',
    labelFa: 'عنوان آزمون',
    labelEn: 'Experiment Title',
    descriptionFa: 'نام رسمی و استاندارد روش آزمون آزمایشگاهی',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'تعیین عدد اسیدی و اسیدیته آزاد در روغن‌ها و چربی‌های خوراکی'
  },
  {
    key: 'category',
    labelFa: 'حوزه تخصصی',
    labelEn: 'Category / Scientific Domain',
    descriptionFa: 'یکی از حوزه‌های ۱۵‌گانه علوم و صنایع غذایی',
    isRequired: true,
    requiresAuthoritativeSource: false,
    exampleValueFa: 'food_chemistry'
  },
  {
    key: 'product',
    labelFa: 'محصول / ماتریس غذایی هدف',
    labelEn: 'Target Food Product / Matrix',
    descriptionFa: 'ماتریس غذایی یا کالای تحت آزمون (مانند شیر خام، روغن زیتون، آرد گندم)',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'روغن‌ها و چربی‌های خوراکی گیاهی و حیوانی'
  },
  {
    key: 'purpose',
    labelFa: 'هدف آزمون',
    labelEn: 'Purpose / Objective',
    descriptionFa: 'هدف علمی و کاربردی از اجرای آزمون و علت سنجش ویژگی',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'ارزیابی هیدرولیز تری‌گلیسریدها و تعیین درجه فساد هیدرولیتیک'
  },
  {
    key: 'principle',
    labelFa: 'اصل روش آزمون',
    labelEn: 'Principle of the Method',
    descriptionFa: 'مبانی بیوشیمیایی، فیزیکوشیمیایی یا میکروبیولوژی حاکم بر روش',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'انحلال در حلال خنثی و تیتراسیون اسیدهای چرب آزاد با هیدروکسید پتاسیم در حضور معرف فنل‌فتالئین'
  },
  {
    key: 'scope',
    labelFa: 'دامنه کاربرد',
    labelEn: 'Scope & Field of Application',
    descriptionFa: 'محدوده شمول، استثناها و ماتریس‌های قابل آزمون',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'کلیه روغن‌های گیاهی خام و تصفیه‌شده خوراکی'
  },
  {
    key: 'standardReferences',
    labelFa: 'استانداردهای مرجع',
    labelEn: 'Standard References',
    descriptionFa: 'شماره و مشخصات استانداردهای ملی و بین‌المللی مصوب (INSO, ISO, AOAC, Codex)',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'INSO 4179 / ISO 660'
  },
  {
    key: 'sourceReferences',
    labelFa: 'منابع علمی و ارجاعات',
    labelEn: 'Scientific Source References',
    descriptionFa: 'استنادات معتبر مقالات داوری‌شده، کتب مرجع دانشگاهی یا بولتن‌های فنی',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'Official Methods of Analysis of AOAC INTERNATIONAL'
  },
  {
    key: 'equipment',
    labelFa: 'فهرست تجهیزات',
    labelEn: 'Equipment & Apparatus',
    descriptionFa: 'فهرست دستگاه‌ها، ابزارآلات و شیشه‌آلات کالیبره‌شده مورد نیاز',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'ترازوی تحلیلی، بورت مدرج کلاس A، ارلن مایر ۲۵۰ میلی‌لیتر'
  },
  {
    key: 'equipmentRequirements',
    labelFa: 'الزامات و کالیبراسیون تجهیزات',
    labelEn: 'Equipment Requirements & Calibration',
    descriptionFa: 'مشخصات فنی دقت، رواداری و دوره کالیبراسیون تجهیزات',
    isRequired: false,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'دقت توزین ±۰.۰۰۰۱ گرم با گواهی کالیبراسیون معتبر دوره‌ای'
  },
  {
    key: 'reagents',
    labelFa: 'مواد و معرف‌های شیمیایی',
    labelEn: 'Reagents & Chemicals',
    descriptionFa: 'مواد شیمیایی، حلال‌ها، معرف‌ها، درجه خلوص و رده خطر',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'KOH با خلوص آنالیتیکال ۰.۱ مولار، اتانول ۹۶٪، دی‌اتیل اتر، فنل‌فتالئین'
  },
  {
    key: 'samplePreparation',
    labelFa: 'آماده‌سازی نمونه',
    labelEn: 'Sample Preparation',
    descriptionFa: 'روش نمونه‌برداری، آسیاب، یکنواخت‌سازی و شرایط نگهداری پیش از آزمون',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'همگن‌سازی کامل نمونه در دمای ۵۰ درجه سلسیوس و صاف کردن در صورت کدورت'
  },
  {
    key: 'solutionPreparation',
    labelFa: 'آماده‌سازی محلول‌ها',
    labelEn: 'Solution & Reagent Preparation',
    descriptionFa: 'دستور ساخت محلول‌های استاندارد، تیتانت، شناساگر و خنثی‌سازی حلال',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'خنثی‌سازی مخلوط اتانول-دی‌اتیل اتر با هیدروکسید پتاسیم تا ظهور صورتی کم‌رنگ'
  },
  {
    key: 'procedureSteps',
    labelFa: 'مراحل روش آزمون (شماره‌دار)',
    labelEn: 'Procedure Steps (Numbered SOP)',
    descriptionFa: 'گام‌های تفکیک‌شده اجرایی شامل مقدار، واحد، دما، زمان، هشدار و نکته',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'گام ۱: وزن‌کردن نمونه ۵ تا ۱۰ گرم؛ گام ۲: انحلال در ۵۰ میلی‌لیتر حلال؛ گام ۳: تیتراسیون'
  },
  {
    key: 'calculations',
    labelFa: 'محاسبات و فرمول ریاضی',
    labelEn: 'Calculations & Formulas',
    descriptionFa: 'فرمول KaTeX ریاضی با تعریف متغیرها، یکاها، جایگذاری و محاسبات',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'AV = (56.1 * V * c) / m'
  },
  {
    key: 'qualityControl',
    labelFa: 'کنترل کیفیت آزمایشگاهی',
    labelEn: 'Quality Control (QC/QA)',
    descriptionFa: 'آزمون‌های شاهد (Blank)، دو تکرار همزمان (Duplicate) و صحه‌گذاری نتایج',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'انجام همزمان آزمون شاهد حلال جهت اصلاح حجم مصرفی تیترانت'
  },
  {
    key: 'acceptanceCriteria',
    labelFa: 'حدود پذیرش و الزامات قانونی',
    labelEn: 'Acceptance Criteria & Limits',
    descriptionFa: 'حدود قانونی استاندارد ملی، حدود تکرارپذیری r و تجدیدپذیری R',
    isRequired: false,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'حداکثر عدد اسیدی روغن آفتابگردان خوراکی ۰.۶ mg KOH/g (INSO 1446)'
  },
  {
    key: 'commonErrors',
    labelFa: 'خطاهای رایج آزمون',
    labelEn: 'Common Analytical Errors',
    descriptionFa: 'اشتباهات متداول اپراتور و آزمایشگاهی که منجر به انحراف نتیجه می‌شود',
    isRequired: false,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'خنثی نکردن حلال قبل از حل نمونه یا عدم محاسبه فاکتور واقعی تیترانت'
  },
  {
    key: 'troubleshooting',
    labelFa: 'راهنمای عیب‌یابی و رفع اشکال',
    labelEn: 'Troubleshooting Guide',
    descriptionFa: 'جدول نشانه‌ها، علت ریشه‌ای و راهکارهای اصلاحی خطاهای تحلیلی',
    isRequired: false,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'پایدار نماندن رنگ صورتی: جذب CO2 هوا -> پوشاندن دهانه ظرف'
  },
  {
    key: 'safety',
    labelFa: 'نکات ایمنی و بهداشت',
    labelEn: 'Safety & Hazard Warnings',
    descriptionFa: 'تجهیزات حفاظت فردی (PPE)، هشدارهای مواد شیمیایی و دفع پسماند',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'دی‌اتیل اتر بسیار اشتعال‌پذیر است؛ حتماً زیر هود ضد جرقه کار شود'
  },
  {
    key: 'reporting',
    labelFa: 'نحوه گزارش نتیجه و ارقام با معنی',
    labelEn: 'Reporting & Precision',
    descriptionFa: 'واحد اندازه‌گیری، دقت اعشار و نحوه بیان گزارش نهایی به کارفرما',
    isRequired: true,
    requiresAuthoritativeSource: true,
    exampleValueFa: 'گزارش بر حسب mg KOH/g با دو رقم اعشار'
  },
  {
    key: 'notes',
    labelFa: 'یادداشت‌ها و نکات فنی',
    labelEn: 'Technical Notes',
    descriptionFa: 'توضیحات تکمیلی، شرایط مداخله‌گر و پایداری نمونه‌ها',
    isRequired: false,
    requiresAuthoritativeSource: false,
    exampleValueFa: 'در روغن‌های بسیار تیره از شناساگر پتانسیومتری به جای فنل‌فتالئین استفاده شود'
  },
  {
    key: 'version',
    labelFa: 'نسخه دستورالعمل (SOP Version)',
    labelEn: 'Protocol Version',
    descriptionFa: 'شماره بازنگری پروتکل آزمایشگاهی (مانند 1.0.0 یا 2024.1)',
    isRequired: true,
    requiresAuthoritativeSource: false,
    exampleValueFa: '1.0.0'
  },
  {
    key: 'lastVerified',
    labelFa: 'تاریخ آخرین صحه‌گذاری',
    labelEn: 'Last Verified Date',
    descriptionFa: 'تاریخ تطبیق با استانداردهای رسمی و منابع علمی',
    isRequired: true,
    requiresAuthoritativeSource: false,
    exampleValueFa: '2024-05-15'
  },
  {
    key: 'verificationStatus',
    labelFa: 'سطح اعتبار منبع',
    labelEn: 'Verification Status (3 Universal Tiers)',
    descriptionFa: 'VERIFIED (دارای رفرنس قطعی)، SUPPORTED (حمایت‌شده)، UNVERIFIED (نیازمند استعلام)',
    isRequired: true,
    requiresAuthoritativeSource: false,
    exampleValueFa: 'VERIFIED'
  }
];

/**
 * Normalizes any FoodExperiment or partial template into a pristine 26-field StandardExperimentTemplate.
 * Strictly adheres to the Golden Rule:
 * If a field lacks verified data, it remains empty or is marked as 'Unverified' - never hallucinated.
 */
export function normalizeToStandardExperiment(
  exp: Partial<FoodExperiment> | Partial<StandardExperimentTemplate>
): StandardExperimentTemplate {
  // 1. Identification
  const id = exp.id || `exp_${Date.now()}`;
  const title = (exp as any).title || (exp as any).titleFa || 'آزمایش بدون عنوان';
  const category: ExperimentDomain | string =
    (exp as any).category || (exp as any).domain || 'food_chemistry';
  const product = (exp as any).product || '';

  // 2. Scientific Essence
  const purpose = (exp as any).purpose || (exp as any).objective || '';
  const principle = exp.principle || '';
  const scope = exp.scope || '';

  // 3. Standards & Sources
  let standardReferences: ExperimentStandardReference[] = [];
  if (Array.isArray((exp as any).standardReferences) && (exp as any).standardReferences.length > 0) {
    standardReferences = (exp as any).standardReferences;
  } else if ((exp as any).standardReference) {
    standardReferences = [(exp as any).standardReference];
  }

  let sourceReferences: SourceCitation[] = [];
  if (Array.isArray((exp as any).sourceReferences) && (exp as any).sourceReferences.length > 0) {
    sourceReferences = (exp as any).sourceReferences;
  } else if (Array.isArray((exp as any).sources)) {
    sourceReferences = (exp as any).sources;
  }

  // 4. Equipment & Requirements
  const equipment = exp.equipment || [];
  let equipmentRequirements: (ExperimentEquipmentRequirementItem | string)[] = [];
  if (Array.isArray((exp as any).equipmentRequirements) && (exp as any).equipmentRequirements.length > 0) {
    equipmentRequirements = (exp as any).equipmentRequirements;
  } else if (Array.isArray(equipment) && equipment.length > 0) {
    equipmentRequirements = equipment
      .filter((eq: any) => eq && typeof eq === 'object' && eq.specification)
      .map((eq: any) => `${eq.name}: ${eq.specification}`);
  }

  // 5. Reagents & Materials
  const reagents = (exp as any).reagents || (exp as any).reagentsAndMaterials || [];

  // 6. Preparation
  const samplePreparation = exp.samplePreparation || '';
  const solutionPreparation = (exp as any).solutionPreparation || (exp as any).solutionsPreparation || '';

  // 7. Procedure Steps
  const procedureSteps: ExperimentProcedureStep[] = Array.isArray(exp.procedureSteps)
    ? exp.procedureSteps
    : [];

  // 8. Calculations
  const calculations: ExperimentCalculation = exp.calculations || {
    formulaTitleFa: 'محاسبات استاندارد',
    formulaExpression: '',
    variables: []
  };

  // 9. Quality Control
  let qualityControl: ExperimentQualityControl | string[] = [];
  if ((exp as any).qualityControl) {
    qualityControl = (exp as any).qualityControl;
  }

  // 10. Acceptance Criteria
  let acceptanceCriteria: ExperimentAcceptanceCriteria | string[] = [];
  if ((exp as any).acceptanceCriteria) {
    acceptanceCriteria = (exp as any).acceptanceCriteria;
  }

  // 11. Common Errors & Troubleshooting
  const commonErrors: string[] = (exp as any).commonErrors || (exp as any).potentialErrors || [];
  const troubleshooting: (ExperimentTroubleshootingItem | string)[] = (exp as any).troubleshooting || [];

  // 12. Safety & Reporting
  const safety: string[] = (exp as any).safety || (exp as any).safetyNotes || [];
  const reporting = exp.reporting || {
    unitOfMeasurement: '%',
    decimalPrecision: 2
  };

  // 13. Notes & Metadata
  let notes: string[] = [];
  if (Array.isArray((exp as any).notes)) {
    notes = (exp as any).notes;
  } else if (typeof (exp as any).customNotes === 'string' && (exp as any).customNotes.trim()) {
    notes = [(exp as any).customNotes.trim()];
  }

  const version = (exp as any).version || '1.0.0';
  const lastVerified =
    (exp as any).lastVerified ||
    ((exp as any).updatedAt ? (exp as any).updatedAt.split('T')[0] : new Date().toISOString().split('T')[0]);

  // 14. Verification Status (3 Universal Tiers)
  let verificationStatus: 'VERIFIED' | 'SUPPORTED' | 'UNVERIFIED' = 'UNVERIFIED';
  const rawStatus = (exp as any).verificationStatus;
  if (rawStatus === 'VERIFIED' || rawStatus === 'verified_standard') {
    verificationStatus = 'VERIFIED';
  } else if (rawStatus === 'SUPPORTED' || rawStatus === 'peer_reviewed' || rawStatus === 'academic_textbook') {
    verificationStatus = 'SUPPORTED';
  } else {
    verificationStatus = 'UNVERIFIED';
  }

  return {
    id,
    title,
    category,
    product,
    purpose,
    principle,
    scope,
    standardReferences,
    sourceReferences,
    equipment,
    equipmentRequirements,
    reagents,
    samplePreparation,
    solutionPreparation,
    procedureSteps,
    calculations,
    qualityControl,
    acceptanceCriteria,
    commonErrors,
    troubleshooting,
    safety,
    reporting,
    notes,
    version,
    lastVerified,
    verificationStatus
  };
}

/**
 * Creates an empty, pristine Standard Experiment Template.
 * Fields without sources are clean empty strings or empty arrays (Unverified state).
 * Never populates fake numbers, fake standards, or fake chemistry!
 */
export function createEmptyStandardExperimentTemplate(): StandardExperimentTemplate {
  return {
    id: `exp_std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: '',
    category: 'food_chemistry',
    product: '',
    purpose: '',
    principle: '',
    scope: '',
    standardReferences: [],
    sourceReferences: [],
    equipment: [],
    equipmentRequirements: [],
    reagents: [],
    samplePreparation: '',
    solutionPreparation: '',
    procedureSteps: [
      {
        stepNumber: 1,
        title: 'گام ۱: آماده‌سازی اولیه',
        description: ''
      }
    ],
    calculations: {
      formulaTitleFa: '',
      formulaExpression: '',
      variables: []
    },
    qualityControl: [],
    acceptanceCriteria: [],
    commonErrors: [],
    troubleshooting: [],
    safety: [],
    reporting: {
      unitOfMeasurement: '%',
      decimalPrecision: 2
    },
    notes: [],
    version: '1.0.0',
    lastVerified: new Date().toISOString().split('T')[0],
    verificationStatus: 'UNVERIFIED'
  };
}

/**
 * Evaluates completeness and verification integrity of an experiment template.
 */
export interface TemplateAuditReport {
  completenessPercentage: number;
  totalFieldsCount: number;
  populatedFieldsCount: number;
  verifiedFields: string[];
  unverifiedFields: string[];
  missingMandatoryFields: string[];
  hasStandardCitation: boolean;
  hasScientificCitation: boolean;
  tier: 'VERIFIED' | 'SUPPORTED' | 'UNVERIFIED';
}

export function auditExperimentTemplate(
  template: StandardExperimentTemplate
): TemplateAuditReport {
  const verifiedFields: string[] = [];
  const unverifiedFields: string[] = [];
  const missingMandatoryFields: string[] = [];

  const hasStandardCitation =
    Array.isArray(template.standardReferences) &&
    template.standardReferences.length > 0 &&
    Boolean(template.standardReferences[0]?.standardNumber);

  const hasScientificCitation =
    Array.isArray(template.sourceReferences) &&
    template.sourceReferences.length > 0;

  for (const field of STANDARD_EXPERIMENT_26_FIELDS) {
    const val = (template as any)[field.key];
    const isPopulated = isFieldValuePopulated(val);

    if (field.isRequired && !isPopulated) {
      missingMandatoryFields.push(field.key);
    }

    if (isPopulated) {
      if (field.requiresAuthoritativeSource) {
        if (hasStandardCitation || hasScientificCitation) {
          verifiedFields.push(field.key);
        } else {
          unverifiedFields.push(field.key);
        }
      } else {
        verifiedFields.push(field.key);
      }
    } else {
      unverifiedFields.push(field.key);
    }
  }

  const populatedCount = STANDARD_EXPERIMENT_26_FIELDS.length - missingMandatoryFields.length;
  const completenessPercentage = Math.round(
    (populatedCount / STANDARD_EXPERIMENT_26_FIELDS.length) * 100
  );

  let tier: 'VERIFIED' | 'SUPPORTED' | 'UNVERIFIED' = 'UNVERIFIED';
  if (hasStandardCitation && template.verificationStatus === 'VERIFIED') {
    tier = 'VERIFIED';
  } else if (hasScientificCitation || template.verificationStatus === 'SUPPORTED') {
    tier = 'SUPPORTED';
  }

  return {
    completenessPercentage,
    totalFieldsCount: 26,
    populatedFieldsCount: populatedCount,
    verifiedFields,
    unverifiedFields,
    missingMandatoryFields,
    hasStandardCitation,
    hasScientificCitation,
    tier
  };
}

function isFieldValuePopulated(val: any): boolean {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'object') {
    return Object.values(val).some((v) => isFieldValuePopulated(v));
  }
  return true;
}

/**
 * Serializes standard experiment template to clean JSON for archiving, API exchange, or backup.
 */
export function exportExperimentTemplateToJson(template: StandardExperimentTemplate): string {
  return JSON.stringify(template, null, 2);
}

/**
 * Parses and normalizes incoming JSON string into standard experiment template.
 * Allows importing thousands of experiments without schema adjustments.
 */
export function importExperimentTemplateFromJson(jsonString: string): StandardExperimentTemplate {
  const parsed = JSON.parse(jsonString);
  return normalizeToStandardExperiment(parsed);
}
