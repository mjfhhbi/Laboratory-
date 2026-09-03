import { 
  DiagnosedLabError, 
  LabTroubleshootingSession, 
  LabErrorCategory,
  LabTestStage, 
  ConfidenceRating,
  DiagnosticQuestion
} from '../../types/troubleshooting';
import { 
  VERIFIED_LAB_ERRORS_DATABASE, 
  EXPERIMENT_TROUBLESHOOT_TEMPLATES 
} from '../../data/troubleshootingKnowledgeBase';

export interface DiagnosticInput {
  experimentId: string;
  stage: LabTestStage;
  userNarrative: string;
  selectedSymptomIds: string[];
  equipmentList: {
    nameFa: string;
    calibrationStatus?: string;
    notes?: string;
  }[];
  numericalValues: Record<string, number | undefined>;
  answeredQuestions?: Record<string, string>; // questionId -> optionId
}

export interface DiagnosticAnalysisResult {
  rankedErrors: DiagnosedLabError[];
  primaryError: DiagnosedLabError | null;
  detectedNumericalAnomalies: string[];
  matchedSources: {
    standardCode: string;
    titleFa: string;
    organization: string;
    clauseOrPage?: string;
  }[];
  followUpQuestions: DiagnosticQuestion[];
  overallConfidence: ConfidenceRating;
  analysisSummaryFa: string;
}

/**
 * Check numerical values for physical and chemical laboratory anomalies
 */
export function detectLabNumericalAnomalies(
  experimentId: string,
  stage: LabTestStage,
  values: Record<string, number | undefined>
): string[] {
  const anomalies: string[] = [];

  // 1. Moisture Oven Tests
  if (experimentId === 'moisture_oven') {
    const { m0, m1, m2, oven_temp, drying_time } = values;

    if (m0 !== undefined && m1 !== undefined && m1 <= m0) {
      anomalies.push(`ناهنجاری توزین: وزن ظرف + نمونه قبل از آون (${m1}g) کمتر یا مساوی وزن ظرف خالی (${m0}g) است.`);
    }

    if (m1 !== undefined && m2 !== undefined && m2 >= m1) {
      anomalies.push(`ناهنجاری فیزیکی بحرانی (افزایش وزن): وزن پس از آون (${m2}g) بزرگتر یا مساوی وزن قبل از آون (${m1}g) است (نشان‌دهنده جذب رطوبت شدید در دسیکاتور یا خطای تار).`);
    }

    if (oven_temp !== undefined && (oven_temp < 98 || oven_temp > 110)) {
      anomalies.push(`انحراف دمایی استاندارد: دمای ثبت‌شده آون (${oven_temp}°C) خارج از بازه استاندارد ۱۰۲ تا ۱۰۵ درجه است.`);
    }

    if (drying_time !== undefined && drying_time < 2) {
      anomalies.push(`زمان ناکافی فرآیند: مدت آون‌گذاری (${drying_time} ساعت) کمتر از حداقل زمان لازم برای رسیدن به وزن ثابت (Constant Weight) است.`);
    }
  }

  // 2. Kjeldahl Protein Tests
  if (experimentId === 'protein_kjeldahl') {
    const { vs, vb, sample_mass, n_acid } = values;

    if (vs !== undefined && vb !== undefined && vs < vb) {
      anomalies.push(`ناهنجاری تیتراسیون: حجم اسید مصرفی نمونه (${vs} mL) کمتر از آزمون شاهد (${vb} mL) است که منجر به درصد پروتئین منفی می‌شود.`);
    }

    if (vb !== undefined && vb > 0.3) {
      anomalies.push(`هشدار آلودگی شاهد: حجم اسید مصرفی بلانک (${vb} mL) فراتر از حد مجاز استاندارد AOAC (حداکثر ۰.۱۵ mL) است.`);
    }

    if (sample_mass !== undefined && (sample_mass < 0.2 || sample_mass > 5)) {
      anomalies.push(`انحراف وزن نمونه: وزن توزین‌شده (${sample_mass}g) با ظرفیت هضم لوله‌های کجلدال همخوانی ندارد.`);
    }
  }

  // 3. Soxhlet Fat
  if (experimentId === 'fat_soxhlet') {
    const { m1_flask, m2_fat } = values;
    if (m1_flask !== undefined && m2_fat !== undefined && m2_fat <= m1_flask) {
      anomalies.push(`ناهنجاری استخراج: وزن بالن پس از تبخیر حلال (${m2_fat}g) کمتر یا مساوی وزن بالن خالی (${m1_flask}g) است.`);
    }
  }

  // 4. Peroxide Value
  if (experimentId === 'peroxide_value') {
    const { vs, vb } = values;
    if (vs !== undefined && vb !== undefined && vs < vb) {
      anomalies.push(`ناهنجاری تیتراسیون یدومتری: حجم مصرفی نمونه از شاهد کمتر است.`);
    }
    if (vb !== undefined && vb > 0.1) {
      anomalies.push(`هشدار اکسیداسیون شاهد: حجم شاهد (${vb} mL) بیش از ۰.۱ میلی‌لیتر بوده و حاکی از آزادسازی خودبخودی ید است.`);
    }
  }

  // 5. Gerber Fat
  if (experimentId === 'fat_gerber') {
    const { milk_volume, acid_density, centrifuge_temp } = values;
    if (milk_volume !== undefined && Math.abs(milk_volume - 10.75) > 0.1) {
      anomalies.push(`خطای حجم پیپت شیر: حجم پیپت‌شده (${milk_volume} mL) با پیپت استاندارد ۱۰.۷۵ میلی‌لیتر ژربر همخوانی ندارد.`);
    }
    if (acid_density !== undefined && (acid_density < 1.815 || acid_density > 1.830)) {
      anomalies.push(`انحراف چگالی اسید سولفوریک: دانسیته اسید (${acid_density}) خارج از بازه استاندارد ۱.۸۲۰ تا ۱.۸۲۵ است.`);
    }
    if (centrifuge_temp !== undefined && centrifuge_temp < 60) {
      anomalies.push(`افت دمای سانتریفیوژ ژربر: دمای دستگاه (${centrifuge_temp}°C) کمتر از دمای استاندارد ذوب چربی (۶۵°C) است.`);
    }
  }

  // 6. Titratable Acidity
  if (experimentId === 'titratable_acidity') {
    const { v_naoh, n_naoh } = values;
    if (v_naoh !== undefined && v_naoh <= 0) {
      anomalies.push(`ناهنجاری حجم بورت: حجم سود مصرفی صفر یا منفی ثبت شده است.`);
    }
  }

  return anomalies;
}

/**
 * Generate context-aware follow-up clarification questions if there's ambiguity
 */
function generateFollowUpQuestions(
  experimentId: string,
  stage: LabTestStage,
  topErrors: DiagnosedLabError[],
  answeredQuestions: Record<string, string> = {}
): DiagnosticQuestion[] {
  const questions: DiagnosticQuestion[] = [];

  // Question 1: Desiccator & Balance State for Weighing / Moisture / Ash
  if (
    (experimentId === 'moisture_oven' || experimentId === 'ash_muffle' || stage === 'cooling_desiccator' || stage === 'preparation_weighing') &&
    !answeredQuestions['Q_DESICCATOR_COLOR']
  ) {
    questions.push({
      id: 'Q_DESICCATOR_COLOR',
      questionFa: 'وضعیت رنگ دانه‌های سیلیکاژل در کف محفظه دسیکاتور چگونه است؟',
      questionEn: 'What is the color and visual condition of silica gel in the desiccator?',
      contextFa: 'دانه‌های سیلیکاژل آبی در صورت جذب رطوبت به رنگ صورتی و نوع نارنجی به رنگ بی‌رنگ/سبز تغییر می‌یابند.',
      options: [
        {
          id: 'pink_wet',
          labelFa: 'صورتی / بی‌رنگ (اشباع از رطوبت)',
          descriptionFa: 'دانه‌ها رطوبت محیط را جذب کرده و فعال نیستند.',
          suggestedErrorId: 'ERR_MOIST_01_DESICCATOR_SILICA_EXHAUST',
          confidenceBoost: 25
        },
        {
          id: 'blue_dry',
          labelFa: 'آبی تیره / نارنجی براق (کاملاً خشک و تازه)',
          descriptionFa: 'سیلیکاژل فعال است و مشکل از عامل دیگری است.',
          confidenceBoost: 10
        },
        {
          id: 'hot_desiccator',
          labelFa: 'بوته یا پلیت حین انتقال به دسیکاتور بسیار داغ بوده و کمتر از ۲۰ دقیقه مانده است',
          descriptionFa: 'عدم تعادل حرارتی و جریان همرفت روی ترازو.',
          suggestedErrorId: 'ERR_MOIST_03_HOT_WEIGHING_CONVECTION',
          confidenceBoost: 30
        }
      ]
    });
  }

  // Question 2: Digestion Solution Color in Kjeldahl
  if (
    experimentId === 'protein_kjeldahl' &&
    (stage === 'digestion_reaction' || stage === 'distillation_extraction') &&
    !answeredQuestions['Q_KJELDAHL_DIGEST_COLOR']
  ) {
    questions.push({
      id: 'Q_KJELDAHL_DIGEST_COLOR',
      questionFa: 'رنگ و ظاهر محلول داخل لوله کجلدال پس از پایان زمان هضم چه تغییری کرده است؟',
      questionEn: 'What is the color and clarity of the Kjeldahl digest solution?',
      contextFa: 'هضم کامل به رنگ سبز زمردی یا آبی روشن کاملاً شفاف و بدون ذره معلق است.',
      options: [
        {
          id: 'black_charred',
          labelFa: 'سیاه کدر یا قهوه‌ای همراه با ذرات معلق نسوخته',
          descriptionFa: 'هضم ناقص بوده و نیتروژن کاملاً آزاد نشده است.',
          suggestedErrorId: 'ERR_KJEL_02_INCOMPLETE_DIGESTION_BLACK',
          confidenceBoost: 30
        },
        {
          id: 'clear_emerald',
          labelFa: 'سبز روشن یا آبی کاملاً زلال و شفاف',
          descriptionFa: 'هضم کامل بوده؛ احتمال نشتی آمونیاک در تقطیر یا خطای تیتراسیون مطرح است.',
          suggestedErrorId: 'ERR_KJEL_01_AMMONIA_LOSS_DISTILLATION_LEAK',
          confidenceBoost: 20
        },
        {
          id: 'white_salt_crust',
          labelFa: 'خشک شدن اسید و تشکیل نمک سفید متراکم در کف لوله',
          descriptionFa: 'اسید سولفوریک حین هضم فرار کرده و نمونه سوخته است.',
          confidenceBoost: 25
        }
      ]
    });
  }

  // Question 3: Titration endpoint behavior
  if (
    (stage === 'titration_endpoint' || experimentId === 'titratable_acidity') &&
    !answeredQuestions['Q_TITRATION_FADING']
  ) {
    questions.push({
      id: 'Q_TITRATION_FADING',
      questionFa: 'رفتار رنگ صورتی شناساگر فنل‌فتالئین در لحظه رسیدن به نقطه پایانی چگونه بود؟',
      questionEn: 'How did the phenolphthalein pink endpoint behave?',
      contextFa: 'پایداری رنگ صورتی کم‌رنگ حداقل به مدت ۳۰ ثانیه شرط قبولی تیتراسیون است.',
      options: [
        {
          id: 'faded_instant',
          labelFa: 'ظرف ۵ تا ۱۰ ثانیه سریعاً محو و بی‌رنگ شد (جذب CO2)',
          descriptionFa: 'هوای محیط کربناته شده یا آب عاری از دی‌اکسید کربن نبوده است.',
          suggestedErrorId: 'ERR_TITR_01_CO2_ABSORPTION_NAOH_TITER',
          confidenceBoost: 30
        },
        {
          id: 'stable_pink',
          labelFa: 'بیش از ۳۰ ثانیه کاملاً پایدار ماند',
          descriptionFa: 'نقطه پایانی شیمیایی معتبر است.',
          confidenceBoost: 10
        },
        {
          id: 'deep_red_overshot',
          labelFa: 'بلافاصله به رنگ قرمز تیره/ارغوانی تند درآمد (اوورشوت)',
          descriptionFa: 'افزایش بیش از حد تیترانت و عبور از نقطه خنثی.',
          confidenceBoost: 25
        }
      ]
    });
  }

  // Question 4: Microbiology Plating Technique
  if (
    experimentId === 'microbiology_culture' &&
    !answeredQuestions['Q_MICRO_AGAR_TEMP']
  ) {
    questions.push({
      id: 'Q_MICRO_AGAR_TEMP',
      questionFa: 'دمای آگار مذاب در هنگام پورپلیت‌ریزی روی نمونه چند درجه بوده است؟',
      questionEn: 'What was the melted agar temperature when poured into the petri dish?',
      contextFa: 'طبق استاندارد ISO 7218 دمای آگار نباید از ۴۵±۱ درجه بالاتر باشد.',
      options: [
        {
          id: 'too_hot',
          labelFa: 'ارلن داغ بود و مستقیماً از بن‌ماری بالای ۵۰ درجه ریخته شد',
          descriptionFa: 'ایجاد شوک حرارتی شدید و مرگ باکتری‌های حساس.',
          suggestedErrorId: 'ERR_MICRO_01_AGAR_THERMAL_DEATH',
          confidenceBoost: 35
        },
        {
          id: 'tempered_45',
          labelFa: 'ارلن در حمام آب ۴۵ درجه کاملاً همدما شده بود',
          descriptionFa: 'پروتکل دمایی رعایت شده است.',
          confidenceBoost: 10
        },
        {
          id: 'inverted_plates',
          labelFa: 'پلیت‌ها به صورت مستقیم (درب بالا) در انکوباتور قرار گرفتند',
          descriptionFa: 'چکیدن قطرات تقطیر و ایجاد اسپردر.',
          suggestedErrorId: 'ERR_MICRO_02_CONDENSATION_SPREADER',
          confidenceBoost: 30
        }
      ]
    });
  }

  return questions;
}

/**
 * Main Diagnostic Reasoning Engine for Laboratory Troubleshooting
 */
export function runLaboratoryDiagnosis(input: DiagnosticInput): DiagnosticAnalysisResult {
  const {
    experimentId,
    stage,
    userNarrative,
    selectedSymptomIds,
    equipmentList,
    numericalValues,
    answeredQuestions = {}
  } = input;

  // 1. Detect numerical anomalies
  const detectedNumericalAnomalies = detectLabNumericalAnomalies(experimentId, stage, numericalValues);

  // 2. Score and match errors from verified knowledge base
  const narrativeLower = (userNarrative || '').toLowerCase();

  const scoredErrors: DiagnosedLabError[] = VERIFIED_LAB_ERRORS_DATABASE.map(errorDef => {
    let score = 20; // Base score

    // A. Experiment & Stage alignment
    if (errorDef.stage === stage) {
      score += 25;
    }

    // B. Symptom ID match
    selectedSymptomIds.forEach(symId => {
      if (errorDef.triggerKeywords.includes(symId)) {
        score += 35;
      }
    });

    // C. Keyword search in user's narrative text
    let keywordHits = 0;
    errorDef.triggerKeywords.forEach(kw => {
      if (narrativeLower.includes(kw.toLowerCase())) {
        keywordHits++;
        score += 15;
      }
    });

    // D. Numerical anomaly trigger
    if (detectedNumericalAnomalies.length > 0) {
      if (
        (errorDef.id.includes('DESICCATOR') || errorDef.id.includes('WEIGHING')) &&
        detectedNumericalAnomalies.some(a => a.includes('توزین') || a.includes('افزایش وزن'))
      ) {
        score += 30;
      }
      if (
        (errorDef.id.includes('AMMONIA') || errorDef.id.includes('BLANK')) &&
        detectedNumericalAnomalies.some(a => a.includes('شاهد') || a.includes('پروتئین منفی'))
      ) {
        score += 30;
      }
      if (
        errorDef.id.includes('TEMP') &&
        detectedNumericalAnomalies.some(a => a.includes('دما'))
      ) {
        score += 25;
      }
    }

    // E. Equipment matching & calibration status
    equipmentList.forEach(eq => {
      if (eq.calibrationStatus === 'expired' && errorDef.category === 'calibration_error') {
        score += 20;
      }
      if (eq.calibrationStatus === 'uncalibrated' && errorDef.category === 'equipment_error') {
        score += 15;
      }
    });

    // F. Boost score based on user answered follow-up questions
    Object.entries(answeredQuestions).forEach(([qId, optId]) => {
      if (
        (optId === 'pink_wet' && errorDef.id === 'ERR_MOIST_01_DESICCATOR_SILICA_EXHAUST') ||
        (optId === 'hot_desiccator' && errorDef.id === 'ERR_MOIST_03_HOT_WEIGHING_CONVECTION') ||
        (optId === 'black_charred' && errorDef.id === 'ERR_KJEL_02_INCOMPLETE_DIGESTION_BLACK') ||
        (optId === 'clear_emerald' && errorDef.id === 'ERR_KJEL_01_AMMONIA_LOSS_DISTILLATION_LEAK') ||
        (optId === 'faded_instant' && errorDef.id === 'ERR_TITR_01_CO2_ABSORPTION_NAOH_TITER') ||
        (optId === 'too_hot' && errorDef.id === 'ERR_MICRO_01_AGAR_THERMAL_DEATH') ||
        (optId === 'inverted_plates' && errorDef.id === 'ERR_MICRO_02_CONDENSATION_SPREADER')
      ) {
        score += 40;
      }
    });

    const normalizedScore = Math.min(Math.max(score, 10), 99);

    // Calculate dynamic confidence rating
    let confidenceLevel: 'high' | 'medium' | 'low' = 'low';
    let confidenceLabelFa = 'سطح اطمینان اولیه (نیازمند بررسی تکمیلی)';
    let badgeClass = 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300';
    let rationaleFa = 'تطابق بر اساس نشانه‌های اولیه آزمایشگاه.';

    if (normalizedScore >= 80) {
      confidenceLevel = 'high';
      confidenceLabelFa = 'سطح اطمینان بالا (شواهد قطعی و استاندارد)';
      badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      rationaleFa = `تطابق کامل بین مرحله ${stage}، نشانه‌ها و داده‌های عددی با الزامات استاندارد ${errorDef.source.standardCode}.`;
    } else if (normalizedScore >= 55) {
      confidenceLevel = 'medium';
      confidenceLabelFa = 'سطح اطمینان متوسط (فرضیه محتمل)';
      badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      rationaleFa = 'شواهد موجود با این خطا همپوشانی دارد اما پاسخ به سوالات تکمیلی برای قطعیت الزامی است.';
    }

    return {
      ...errorDef,
      relevanceScore: normalizedScore,
      confidence: {
        level: confidenceLevel,
        percentage: normalizedScore,
        labelFa: confidenceLabelFa,
        badgeClass,
        rationaleFa
      }
    };
  });

  // Sort by relevance score descending
  scoredErrors.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Pick top errors
  const rankedErrors = scoredErrors.slice(0, 5);
  const primaryError = rankedErrors.length > 0 ? rankedErrors[0] : null;

  // Extract unique matched scientific sources
  const matchedSourcesMap = new Map<string, any>();
  rankedErrors.forEach(err => {
    if (err.source && !matchedSourcesMap.has(err.source.standardCode)) {
      matchedSourcesMap.set(err.source.standardCode, {
        standardCode: err.source.standardCode,
        titleFa: err.source.titleFa,
        organization: err.source.organization,
        clauseOrPage: err.source.clauseOrPage
      });
    }
  });

  const matchedSources = Array.from(matchedSourcesMap.values());

  // Generate interactive follow-up questions
  const followUpQuestions = generateFollowUpQuestions(experimentId, stage, rankedErrors, answeredQuestions);

  // Overall Confidence Assessment
  const maxScore = primaryError ? primaryError.relevanceScore : 30;
  const overallConfidence: ConfidenceRating = {
    level: maxScore >= 80 ? 'high' : maxScore >= 55 ? 'medium' : 'low',
    percentage: maxScore,
    labelFa: maxScore >= 80 ? 'عیب‌یابی با استناد استاندارد (قطعیت بالا)' : maxScore >= 55 ? 'ارزیابی نیازمند تفکیک فرضیه‌ها' : 'داده‌های ناکافی (لطفاً جزئیات بیشتری وارد فرمایید)',
    badgeClass: maxScore >= 80 ? 'bg-emerald-500 text-white' : maxScore >= 55 ? 'bg-amber-500 text-white' : 'bg-stone-500 text-white',
    rationaleFa: primaryError
      ? `تحلیل ریشه‌ای بر پایه روش مرجع ${primaryError.source.standardCode} انجام شد.`
      : 'برای رتبه‌بندی دقیق‌تر، مقادیر عددی یا شرح رخداد را تکمیل فرمایید.'
  };

  const analysisSummaryFa = primaryError
    ? `بر اساس تحلیل داده‌های مرحله «${stage}»، مشخصات تجهیزات و ناهنجاری‌های شناسایی‌شده، محتمل‌ترین علت ریشه‌ای «${primaryError.titleFa}» با ضریب تطابق ${primaryError.relevanceScore}٪ تشخیص داده شد. اقدام اصلاحی و منبع استاندارد در جدول زیر گزارش شده است.`
    : 'اطلاعات وارد شده برای شناسایی قطعی خطا کافی نیست.';

  return {
    rankedErrors,
    primaryError,
    detectedNumericalAnomalies,
    matchedSources,
    followUpQuestions,
    overallConfidence,
    analysisSummaryFa
  };
}
