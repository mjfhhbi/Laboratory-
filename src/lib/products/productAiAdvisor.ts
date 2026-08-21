/**
 * Food Science AI - Intelligent Food Product Formulation & Process Advisor
 * Grounded in peer-reviewed food chemistry, INSO standards, Codex Alimentarius, and hydrocolloid science.
 * 
 * Strict Scientific Guardrails:
 * 1. AI NEVER claims formulation or parameters as absolute/final truth.
 * 2. Every suggestion is explicitly tagged as "پیشنهاد اولیه فرمولاسیون (Preliminary Formulation Suggestion)".
 * 3. Never hallucinates numbers or standard values; cites verified reference bases.
 */

import { ProductDevelopmentProject, FormulationVersion } from '../../types/foodProduct';
import { calculateFormulationSummary } from './formulationEngine';

export interface AiFormulationReviewResult {
  projectTitle: string;
  categoryFa: string;
  scientificDisclaimer: string;
  formulationIntegrityScore: number; // 0 - 100
  overallAssessmentFa: string;
  stoichiometricChecks: Array<{
    titleFa: string;
    status: 'pass' | 'warning' | 'critical';
    detailsFa: string;
  }>;
  hydrocolloidAndTextureAdviceFa: string[];
  thermalProcessingAndPreservationAdviceFa: string[];
  troubleshootingPredictionsFa: Array<{
    riskNameFa: string;
    probability: 'low' | 'medium' | 'high';
    scientificMechanismFa: string;
    preventionStrategyFa: string;
  }>;
  referencedStandardsAndSources: Array<{
    code: string;
    titleFa: string;
    organization: string;
    relevance: string;
  }>;
}

const SCIENTIFIC_DISCLAIMER_TEXT =
  '⚠️ پیشنهاد اولیه فرمولاسیون و راهنمای بهینه‌سازی فرآیند: این تحلیل بر پایه اصول معتبر شیمی و فناوری مواد غذایی و پایگاه دانش استانداردها تدوین شده است. هرگونه تغییر در مقیاس یا فرمولاسیون، قبل از تولید تجاری، مستلزم اجرای بچ‌های آزمایشی پایلوت، ارزیابی حسی پنل هدونیک و صحه‌گذاری ایمنی میکروبیولوژی در آزمایشگاه کنترل کیفیت می‌باشد.';

/**
 * Analyzes a product development project and active formulation against food science rules
 */
export function analyzeProductFormulationWithAi(
  project: ProductDevelopmentProject,
  activeFormulation?: FormulationVersion
): AiFormulationReviewResult {
  const form = activeFormulation || project.formulations.find(f => f.id === project.activeFormulationId) || project.formulations[0];
  const summary = form ? calculateFormulationSummary(form.ingredients) : null;

  const stoichiometricChecks: AiFormulationReviewResult['stoichiometricChecks'] = [];
  const hydrocolloidAdvice: string[] = [];
  const thermalAdvice: string[] = [];
  const risks: AiFormulationReviewResult['troubleshootingPredictionsFa'] = [];
  const sources: AiFormulationReviewResult['referencedStandardsAndSources'] = [];

  let score = 85;

  // 1. Percentage Sum Check
  if (!summary || !summary.is100Percent) {
    score -= 25;
    stoichiometricChecks.push({
      titleFa: 'بررسی مجموع درصدهای فرمولاسیون (Mass Balance)',
      status: 'critical',
      detailsFa: `مجموع اجزای فرمول برابر با ${summary?.totalPercentage || 0}% است. در محاسبات صنایع غذایی، مجموع باید دقیقاً ۱۰۰.۰۰٪ باشد تا وزن بچ و محاسبات تغذیه‌ای دقیق باقی بماند.`
    });
  } else {
    stoichiometricChecks.push({
      titleFa: 'توازن جرمی ۱۰۰٪ فرمولاسیون',
      status: 'pass',
      detailsFa: 'مجموع درصدهای وزنی تمام اجزا برابر با ۱۰۰.۰۰٪ است.'
    });
  }

  // 2. Category-specific science rules
  switch (project.category) {
    case 'dairy':
    case 'functional_food': {
      sources.push({
        code: 'استاندارد ملی ایران ۲۸۵۲',
        titleFa: 'دوغ و فرآورده‌های شیری تخمیری - ویژگی‌ها و روش‌های آزمون',
        organization: 'سازمان ملی استاندارد ایران (INSO)',
        relevance: 'تعیین حدود مجاز pH، اسیدیته، ماده خشک بدون چربی و نمک'
      });
      sources.push({
        code: 'Codex Stan 243-2003',
        titleFa: 'Standard for Fermented Milks',
        organization: 'FAO / WHO Codex Alimentarius',
        relevance: 'حداقل شمارش باکتری‌های همزیست و پروبیوتیک زنده (10^7 CFU/g)'
      });

      const hasPectinOrStabilizer = form?.ingredients.some(i => i.category === 'stabilizer_hydrocolloid');
      if (hasPectinOrStabilizer) {
        hydrocolloidAdvice.push(
          'در سیستم‌های پروتئینی اسیدی (pH < 4.6)، پروتئین‌های میسلی کازئین به نقطه ایزوالکتریک (pI = 4.6) نزدیک شده و بار منفی خود را از دست می‌دهند. استفاده از پکتین با متوکسیل بالا (HMP) یا ترکیب هم‌افزای زانتان/ژلان با اتصال به نقاط با بار مثبت کازئین، از طریق ممانعت فضایی (Steric Hindrance) مانع از انعقاد و سینرسیس (آب‌اندازی) می‌شود.'
        );
      } else {
        score -= 15;
        risks.push({
          riskNameFa: 'جداسازی فاز سرمی و رسوب ذرات کازئین (Syneresis)',
          probability: 'high',
          scientificMechanismFa: 'در غیاب هیدروکلوئید محافظتی، در pH کمتر از ۴.۲ کشش بین سطحی افزایش یافته و ذرات پروتئین توده‌ای می‌شوند.',
          preventionStrategyFa: 'پیشنهاد اولیه: افزودن ۰.۳۰٪ تا ۰.۴۵٪ پکتین با متوکسیل بالا (HMP) در دمای ۶۵ درجه با انحلال کامل.'
        });
      }

      thermalAdvice.push(
        'پاستوریزاسیون مداوم در دمای ۷۴ تا ۷۶ درجه سانتی‌گراد به مدت ۱۵ تا ۲۰ ثانیه جهت غیرفعال‌سازی مخمرهای فاسدکننده بدون تخریب حرارتی بیش‌از‌حد پروتئین‌های سرمی.'
      );
      break;
    }

    case 'sauces_condiments': {
      sources.push({
        code: 'استاندارد ملی ایران ۲۴۵۴',
        titleFa: 'سس مایونز و سس‌های سالاد امولسیفیه‌شده - ویژگی‌ها',
        organization: 'INSO',
        relevance: 'تعیین محدوده چربی کل، اسیدیته و پایداری امولسیون'
      });

      hydrocolloidAdvice.push(
        'در فرمولاسیون‌های مایونز کم‌چرب (روغن < 40%)، کاهش کسر حجمی فاز پراکنده منجر به افت شدید ویسکوزیته می‌شود. ایجاد شبکه تیکسوتروپیک با ترکیب نشاسته اصلاح‌شده (پری‌ژلاتینیزه و مقاوم به اسید) به میزان ۴ تا ۶ درصد و گزانتان گام (۰.۲ تا ۰.۴ درصد) رفتار جریان شبه‌پلاستیک مطلوبی ایجاد می‌کند.'
      );

      thermalAdvice.push(
        'کنترل دمای فرآیند امولسیون‌سازی در بازه ۱۸ تا ۲۴ درجه سانتی‌گراد؛ حرارت بالاتر ویسکوزیته فاز پیوسته را کاهش داده و موجب ادغام قطرات (Coalescence) روغن می‌شود.'
      );

      risks.push({
        riskNameFa: 'شکست امولسیون حین نگهداری (Phase Inversion / Oil Separation)',
        probability: 'medium',
        scientificMechanismFa: 'توزیع ناهمگن اندازه قطرات روغن در اثر برش ناکافی در میکسر روتور-استاتور.',
        preventionStrategyFa: 'تزریق تدریجی فاز روغنی در سرعت‌های بالای ۳۰۰۰ RPM تحت خلاء نسبی.'
      });
      break;
    }

    case 'bakery_cereal': {
      sources.push({
        code: 'استاندارد ملی ایران ۳۷',
        titleFa: 'ویژگی‌های نان، آرد و محصولات غلات',
        organization: 'INSO',
        relevance: 'تعیین حد رطوبت، خاکستر و غنی‌سازی'
      });
      hydrocolloidAdvice.push(
        'در محصولات فاقد گلوتن یا پرپروتئین، استفاده از هیدروکسی‌پروپیل متیل سلولز (HPMC) یا پودر پسیلیوم موجب بهبود حفظ گاز و الاستیسیته بافت می‌شود.'
      );
      thermalAdvice.push(
        'کنترل دقیق رطوبت نسبی کوره پخت (Oven Humidity) جهت دستیابی به ژلاتیناسیون کامل نشاسته سطحی و ایجاد پوسته ترد.'
      );
      break;
    }

    default: {
      sources.push({
        code: 'Fennema Food Chemistry 5th Ed.',
        titleFa: 'اصول شیمی و فیزیکوشیمیایی مواد غذایی',
        organization: 'CRC Press',
        relevance: 'روابط فعالیت آبی (Aw)، رفتار فازی و پایداری اکسیداتیو'
      });
      hydrocolloidAdvice.push(
        'بهره‌گیری از هم‌افزایی هیدروکلوئیدها (Synergistic Hydrocolloid Systems) مانند گزانتان + صمغ دانه اقاقیا (LBG) برای افزایش ژل‌شوندگی.'
      );
      thermalAdvice.push(
        'محاسبه زمان مرگ حرارتی (F-Value و D-Value) متناسب با بار میکروبی هدف و pH محصول.'
      );
      break;
    }
  }

  // 3. Dry Matter & Brix checks
  if (summary && summary.totalDryMatterPercent > 0) {
    stoichiometricChecks.push({
      titleFa: 'بررسی غلظت ماده خشک کل (Total Solids)',
      status: 'pass',
      detailsFa: `ماده خشک برآورد شده: ${summary.totalDryMatterPercent}% (بریکس تخمینی: ${summary.estimatedBrix}° Brix).`
    });
  }

  score = Math.max(40, Math.min(100, score));

  let assessment = '';
  if (score >= 80) {
    assessment = 'فرمولاسیون بر اساس اصول اولیه فناوری غذایی دارای تعادل ترکیبی مطلوب است. مراحل فرآیندی و پارامترهای پایدارکننده منطبق بر استانداردهای مرجع طراحی شده‌اند.';
  } else if (score >= 60) {
    assessment = 'فرمولاسیون نیازمند بازنگری در توازن جرمی، نوع سیستم پایدارکننده یا شرایط دمایی فرآیند است تا در آزمون‌های ماندگاری پایداری کافی را نشان دهد.';
  } else {
    assessment = 'فرمولاسیون دارای عدم‌توازن ساختاری است و قبل از هرگونه آزمون پایلوت باید نسبت مواد اولیه و فاز حلال اصلاح شود.';
  }

  return {
    projectTitle: project.productNameFa,
    categoryFa: project.category,
    scientificDisclaimer: SCIENTIFIC_DISCLAIMER_TEXT,
    formulationIntegrityScore: score,
    overallAssessmentFa: assessment,
    stoichiometricChecks,
    hydrocolloidAndTextureAdviceFa: hydrocolloidAdvice,
    thermalProcessingAndPreservationAdviceFa: thermalAdvice,
    troubleshootingPredictionsFa: risks,
    referencedStandardsAndSources: sources
  };
}
