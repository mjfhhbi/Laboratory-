/**
 * Food Science AI - Specialized Domain Intent Detector
 * Part 23 of 30 - Question Intent & Entity Detection
 */

import { RagIntentResult, RagIntentType } from './types';

// Common Food Products in Iran & Global Standards
const PRODUCT_CATALOG: Array<{ canonicalFa: string; aliases: string[] }> = [
  { canonicalFa: 'شیر پاستوریزه', aliases: ['شیر پاستوریزه', 'شیر', 'milk', 'شیر خام', 'شیر کم چرب', 'شیر پرچرب', 'شیر کامل'] },
  { canonicalFa: 'ماست و دوغ', aliases: ['ماست', 'دوغ', 'doogh', 'yogurt', 'ماست چکیده', 'ماست قالبی', 'ماست ست'] },
  { canonicalFa: 'پنیر', aliases: ['پنیر', 'cheese', 'پنیر فتا', 'پنیر سفید ایرانی', 'پنیر اولترافیلتره', 'پنیر پیتزا', 'موزارلا'] },
  { canonicalFa: 'خامه و کره', aliases: ['خامه', 'کره', 'cream', 'butter', 'کره گیاهی', 'مارگارین'] },
  { canonicalFa: 'روغن‌های خوراکی و سرخ‌کردنی', aliases: ['روغن خوراکی', 'روغن سرخ کردنی', 'روغن زیتون', 'روغن آفتابگردان', 'روغن کلزا', 'روغن مایع', 'edible oil', 'frying oil'] },
  { canonicalFa: 'رب گوجه فرنگی', aliases: ['رب گوجه', 'رب گوجه فرنگی', 'tomato paste', 'کنسانتره گوجه', 'پوره گوجه'] },
  { canonicalFa: 'سس مایونز و سالاد', aliases: ['سس مایونز', 'مایونز', 'mayonnaise', 'سس سالاد', 'سس کچاپ', 'سس گوجه'] },
  { canonicalFa: 'آبمیوه و نوشیدنی', aliases: ['آبمیوه', 'نوشیدنی', 'نکتار', 'شربت', 'کنسانتره میوه', 'juice', 'soft drink', 'ماءالشعیر'] },
  { canonicalFa: 'آرد و غلات', aliases: ['آرد', 'آرد گندم', 'آرد ستاره', 'آرد خبازی', 'گندم', 'flour', 'سبوس', 'غلات'] },
  { canonicalFa: 'نان و بیسکویت', aliases: ['نان', 'بیسکویت', 'کیک', 'ویفر', 'ماکارونی', 'پاستا', 'bread', 'biscuit'] },
  { canonicalFa: 'کنسرو و کمپوت', aliases: ['کنسرو', 'کمپوت', 'کنسرو ماهی', 'تن ماهی', 'کنسرو لوبیا', 'canned food'] },
  { canonicalFa: 'گوشت و فرآورده‌های پروتئینی', aliases: ['گوشت', 'سوسیس', 'کالباس', 'همبرگر', 'فرآورده گوشتی', 'meat', 'sausage'] },
  { canonicalFa: 'عسل و قند', aliases: ['عسل', 'شکر', 'قند', 'گلوکز', 'فروکتوز', 'honey', 'sugar'] },
  { canonicalFa: 'آبلیمو و سرکه', aliases: ['آبلیمو', 'سرکه', 'آبغوره', 'vinegar', 'lemon juice'] }
];

// Common Food Science Laboratory Experiments & Tests
const EXPERIMENT_CATALOG: Array<{ canonicalFa: string; aliases: string[] }> = [
  { canonicalFa: 'اسیدیته و pH', aliases: ['اسیدیته', 'اسیدیته قابل تیتر', 'ph', 'titratable acidity', 'درجه دورنیک', 'dornic', 'اسید لاکتیک'] },
  { canonicalFa: 'درصد چربی', aliases: ['چربی', 'درصد چربی', 'fat', 'ژربیر', 'روش ژربیر', 'روش رز گاتلیب', 'سوکسله', 'babcock', 'gerber'] },
  { canonicalFa: 'ماده خشک و رطوبت', aliases: ['ماده خشک', 'درصد رطوبت', 'رطوبت', 'total solids', 'dry matter', 'moisture'] },
  { canonicalFa: 'بریکس و مواد جامد محلول', aliases: ['بریکس', 'درجه بریکس', 'brix', 'شکست سنج', 'رفراکتومتر'] },
  { canonicalFa: 'عدد پراکسید و پایداری اکسیداتیو', aliases: ['پراکسید', 'عدد پراکسید', 'peroxide value', 'اکسیداسیون', 'رنسیمت', 'ransemat', 'pv'] },
  { canonicalFa: 'اندیس اسیدی و صابونی و ید', aliases: ['اندیس اسیدی', 'اندیس صابونی', 'اندیس ید', 'iodine value', 'acid value'] },
  { canonicalFa: 'نمک و کلرید سدیم', aliases: ['نمک', 'کلرید سدیم', 'روش موهر', 'روش ولارد', 'salt', 'nacl'] },
  { canonicalFa: 'پروتئین کل و ازت', aliases: ['پروتئین', 'روش کجلدال', 'کجلدال', 'protein', 'kjeldahl', 'ازت تام'] },
  { canonicalFa: 'خاکستر کل و قلیائیت', aliases: ['خاکستر', 'خاکستر کل', 'ash', 'کوره الکتریکی'] },
  { canonicalFa: 'آزمون‌های میکروبیولوژی (کلی‌فرم و سالمونلا)', aliases: ['کلی فرم', 'اشرشیا کلی', 'سالمونلا', 'شمارش کلی', 'کپک و مخمر', 'میکروبی', 'coliform', 'e. coli', 'salmonella', 'tpc'] },
  { canonicalFa: 'آفلاتوکسین و سموم قارچی', aliases: ['آفلاتوکسین', 'مایکوتوکسین', 'aflatoxin', 'ochratoxin'] },
  { canonicalFa: 'آنزیم فسفاتاز و پراکسیداز', aliases: ['فسفاتاز', 'پراکسیداز', 'آلکالین فسفاتاز', 'تست کفایت پاستوریزاسیون', 'phosphatase'] },
  { canonicalFa: 'فعالیت آبی (aw)', aliases: ['فعالیت آبی', 'water activity', 'aw', 'ایزوترم رطوبتی'] }
];

// Reagent & Equipment Keywords
const REAGENT_EQUIPMENT_KEYWORDS: string[] = [
  'هیدروکسید سدیم', 'سود', 'فنل فتالئین', 'تیوسولفات سدیم', 'اسید سولفوریک',
  'کلروفرم', 'پتاس الکلی', 'اسید استیک', 'معرف بریکفست', 'معرف نستلر',
  'انکوباتور', 'اتوکلاو', 'رفراکتومتر', 'اسپکتروفتومتر', 'سانتریفیوژ ژربیر',
  'بوتیلومتر', 'کوره الکتریکی', 'دسیکاتور', 'آون', 'ترازوی آنالیتیکال', 'بورت'
];

/**
 * Normalizes Persian text characters for consistent search
 */
export function normalizePersianText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[ك]/g, 'ک')
    .replace(/[ي]/g, 'ی')
    .replace(/[ة]/g, 'ه')
    .replace(/[\u200B-\u200D\uFEFF]/g, ' ') // zero-width to space
    .replace(/[\u064B-\u065F]/g, '')        // remove diacritics
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728)) // persian digits to eng
    .toLowerCase()
    .trim();
}

/**
 * Detects intent and extracts relevant entities from the user's question
 */
export function detectRagIntent(userQuery: string): RagIntentResult {
  const normalized = normalizePersianText(userQuery);
  const keywords: string[] = [];

  // 1. Extract Standard Codes via Regex
  let targetStandard: string | undefined;
  const insoMatch = normalized.match(/(inso|isiri|استاندارد ملی|استاندارد شماره|شماره استاندارد)\s*(\d{1,5})/i);
  if (insoMatch) {
    targetStandard = `INSO ${insoMatch[2]}`;
    keywords.push(targetStandard);
  } else {
    const isoMatch = normalized.match(/iso\s*(\d{4,5}(?:-\d+)?)/i);
    if (isoMatch) {
      targetStandard = `ISO ${isoMatch[1]}`;
      keywords.push(targetStandard);
    } else {
      const aoacMatch = normalized.match(/aoac\s*(\d{3}\.\d{2})/i);
      if (aoacMatch) {
        targetStandard = `AOAC ${aoacMatch[1]}`;
        keywords.push(targetStandard);
      } else {
        const codexMatch = normalized.match(/(codex|cxs)\s*(\d{1,4})/i);
        if (codexMatch) {
          targetStandard = `Codex ${codexMatch[2]}`;
          keywords.push(targetStandard);
        }
      }
    }
  }

  // 2. Extract Product
  let targetProduct: string | undefined;
  for (const item of PRODUCT_CATALOG) {
    for (const alias of item.aliases) {
      if (normalized.includes(normalizePersianText(alias))) {
        targetProduct = item.canonicalFa;
        keywords.push(alias);
        break;
      }
    }
    if (targetProduct) break;
  }

  // 3. Extract Experiment / Test
  let targetExperiment: string | undefined;
  for (const item of EXPERIMENT_CATALOG) {
    for (const alias of item.aliases) {
      if (normalized.includes(normalizePersianText(alias))) {
        targetExperiment = item.canonicalFa;
        keywords.push(alias);
        break;
      }
    }
    if (targetExperiment) break;
  }

  // 4. Extract Reagent or Device
  let targetReagentOrDevice: string | undefined;
  for (const eq of REAGENT_EQUIPMENT_KEYWORDS) {
    if (normalized.includes(normalizePersianText(eq))) {
      targetReagentOrDevice = eq;
      keywords.push(eq);
      break;
    }
  }

  // 5. Determine Intent Type based on linguistic markers
  let type: RagIntentType = 'general_query';
  let labelFa = 'پرسش عمومی صنایع غذایی';
  let confidence = 0.65;

  const isComplianceQuery = 
    normalized.includes('استاندارد') ||
    normalized.includes('حد مجاز') ||
    normalized.includes('ویژگی') ||
    normalized.includes('بیشینه') ||
    normalized.includes('کمینه') ||
    normalized.includes('حداکثر') ||
    normalized.includes('حداقل') ||
    normalized.includes('مقررات') ||
    Boolean(targetStandard);

  const isTestMethodQuery =
    normalized.includes('روش آزمون') ||
    normalized.includes('روش اندازه') ||
    normalized.includes('نحوه سنجش') ||
    normalized.includes('پروتکل') ||
    normalized.includes('تیتراسیون') ||
    normalized.includes('فرمولاسیون تست') ||
    normalized.includes('دستور کار') ||
    normalized.includes('sop') ||
    normalized.includes('تجهیزات آزمون') ||
    normalized.includes('معرف');

  const isCalculationQuery =
    normalized.includes('فرمول') ||
    normalized.includes('محاسبه') ||
    normalized.includes('معادله') ||
    normalized.includes('سینتیک') ||
    normalized.includes('زمان ماند') ||
    normalized.includes('ارزش حرارتی') ||
    normalized.includes('f0') ||
    normalized.includes('d-value') ||
    normalized.includes('z-value') ||
    normalized.includes('ضریب') ||
    normalized.includes('استوکیومتری');

  const isTroubleshootingQuery =
    normalized.includes('دلیل') ||
    normalized.includes('علت') ||
    normalized.includes('عیب') ||
    normalized.includes('فساد') ||
    normalized.includes('دوفاز') ||
    normalized.includes('رسوب') ||
    normalized.includes('آب اندازی') ||
    normalized.includes('کپک') ||
    normalized.includes('ترشیدگی') ||
    normalized.includes('طعم نامطلوب') ||
    normalized.includes('عدم انطباق');

  const isProductSpecQuery =
    normalized.includes('تعریف') ||
    normalized.includes('تفاوت') ||
    normalized.includes('فرمولاسیون تولید') ||
    normalized.includes('انواع') ||
    normalized.includes('طبقه‌بندی') ||
    normalized.includes('درصد ماده اولیه') ||
    normalized.includes('هیدروکلوئید');

  if (isComplianceQuery) {
    type = 'standard_compliance';
    labelFa = 'انطباق با استاندارد و حدود قانونی';
    confidence = targetStandard ? 0.95 : 0.85;
  } else if (isTestMethodQuery) {
    type = 'test_method';
    labelFa = 'روش استاندارد آزمون آزمایشگاهی (SOP)';
    confidence = targetExperiment ? 0.92 : 0.82;
  } else if (isCalculationQuery) {
    type = 'formulation_calculation';
    labelFa = 'محاسبات فنی و فرمول‌های مهندسی';
    confidence = 0.88;
  } else if (isTroubleshootingQuery) {
    type = 'troubleshooting_defect';
    labelFa = 'عیب‌یابی، علل فساد و عدم انطباق کیفی';
    confidence = 0.86;
  } else if (isProductSpecQuery) {
    type = 'product_specification';
    labelFa = 'مشخصات فرآورده و مواد تشکیل‌دهنده';
    confidence = targetProduct ? 0.85 : 0.75;
  }

  // Split query into tokens for extra keyword enrichment
  const rawWords = normalized
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  
  const uniqueKeywords = Array.from(new Set([...keywords, ...rawWords.slice(0, 6)]));

  return {
    type,
    labelFa,
    confidence,
    extractedKeywords: uniqueKeywords,
    targetProduct,
    targetExperiment,
    targetStandard,
    targetReagentOrDevice
  };
}
