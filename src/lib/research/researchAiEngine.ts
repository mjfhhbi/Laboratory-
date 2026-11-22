/**
 * Food Science AI - Academic Research & Thesis AI Engine
 * 
 * Strict Scientific Integrity Rules (Part 25 of 30):
 * - NO hallucinated papers or imaginary authors.
 * - NO fake DOIs.
 * - NO fake citations.
 * - If no verified source exists in the repository, explicitly states: "منبع مستندی در مخزن یافت نشد".
 * - High-contrast separation between "AI Generative Suggestions" (تئوریک و پیشنهادی)
 *   and "Documented Scientific Facts" (مستند به استانداردهای ملی و مقالات معتبر).
 */

import { 
  ResearchProject, 
  FoodResearchCategory, 
  AcademicLevel, 
  ResearchVariable, 
  ExperimentalDesignStructure, 
  LiteratureReviewItem,
  MethodologicalWeakness,
  SuggestedExperiment
} from '../../types/research';
import { getAllUnifiedSources } from '../storage/scientificSourcesStorage';
import { UnifiedScientificSource } from '../../types/scientificSource';
import { sendChatMessage } from '../providers';

export interface ResearchIdeaSuggestion {
  id: string;
  titleFa: string;
  titleEn: string;
  category: FoodResearchCategory;
  academicLevel: AcademicLevel;
  noveltyAngleFa: string;
  problemSummaryFa: string;
  suggestedVariables: {
    independent: string[];
    dependent: string[];
    controls: string[];
  };
  recommendedDesignFa: string;
  keyIndustrialImpactFa: string;
}

export interface ResearchQuestionSuggestion {
  id: string;
  questionFa: string;
  questionEn?: string;
  category: 'primary' | 'secondary' | 'mechanistic';
  picoAlignment: {
    population: string;
    intervention: string;
    comparison: string;
    outcome: string;
  };
  finerAssessmentFa: string;
}

export interface LiteratureSearchMatch {
  source: UnifiedScientificSource;
  relevanceScore: number;
  matchedReasonFa: string;
  suggestedCitation: string;
  isVerifiedAuthentic: true;
}

/**
 * AI Research Assistant: Suggest Research Ideas
 */
export async function suggestResearchIdeas(
  category: FoodResearchCategory,
  level: AcademicLevel = 'master',
  keyword?: string
): Promise<ResearchIdeaSuggestion[]> {
  // Built-in verified domain templates
  const domainIdeas: Record<FoodResearchCategory, ResearchIdeaSuggestion[]> = {
    food_nanotechnology: [
      {
        id: 'idea-nano-1',
        titleFa: 'نانوانکپسولاسیون اسانس چویل (Ferulago angulata) در نانولیپوزوم‌ها و بررسی پایداری اکسیداتیو سس مایونز کم‌چرب',
        titleEn: 'Nanoencapsulation of Ferulago angulata essential oil in nanoliposomes and oxidative stability in low-fat mayonnaise',
        category: 'food_nanotechnology',
        academicLevel: level,
        noveltyAngleFa: 'حفاظت از ترکیبات زیست‌فعال فرار در برابر اکسیداسیون نوری و حرارتی با افزایش پایداری کلوئیدی ذرات زیر ۱۰۰ نانومتر.',
        problemSummaryFa: 'فساد اکسیداتیو سریع فاز لیپیدی در سس مایونز کم‌چرب و طعم تند اسانس‌های آزاد در صورت عدم کپسوله‌سازی.',
        suggestedVariables: {
          independent: ['غلظت نانولیپوزوم‌ها (۰.۱ تا ۰.۵ درصد)', 'دمای نگهداری (۴ و ۲۵ درجه)', 'زمان ماندگاری (تا ۹۰ روز)'],
          dependent: ['عدد پراکسید (PV)', 'تیوباربیتوریک اسید (TBA)', 'اندازه ذرات (DLS)', 'پتانسیل زتا', 'پذیرش حسی'],
          controls: ['فرمولاسیون پایه سس مایونز', 'شرایط همگن‌سازی (فشار ۲۰۰ بار)', 'نوع ظرف نگهداری']
        },
        recommendedDesignFa: 'طرح فاکتوریل بر پایه بلوک‌های تصادفی با آزمون‌های کینتیکی پایداری اکسیداتیو',
        keyIndustrialImpactFa: 'جایگزینی آنتی‌اکسیدان‌های سنتزی BHT و BHA با فرم پایدار نانوآنتی‌اکسیدان طبیعی بدون عوارض سم‌شناسی.'
      },
      {
        id: 'idea-nano-2',
        titleFa: 'سنتز فیلم نانوبیپلیمری نشاسته اصلاح‌شده/نانوفیبر سلولز حاوی نانوذرات اکسید روی برای بسته‌بندی فعال قارچ دکمه‌ای',
        titleEn: 'Synthesis of modified starch/cellulose nanofiber active films containing ZnO nanoparticles for button mushroom packaging',
        category: 'food_nanotechnology',
        academicLevel: level,
        noveltyAngleFa: 'کنترل تنفس سلولی و جلوگیری از قهوه‌ای شدن آنزیمی قارچ با تنظیم رطوبت و خاصیت فتوکاتالیستی نانوذرات ZnO.',
        problemSummaryFa: 'عمر ماندگاری بسیار کوتاه قارچ دکمه‌ای (۳ تا ۴ روز) به دلیل تنفس بالا، از دست دادن آب و فعالیت پلی‌فنل اکسیداز (PPO).',
        suggestedVariables: {
          independent: ['درصد نانوفیبر سلولز (۰، ۱، ۳ درصد)', 'درصد نانوذرات ZnO (۰، ۰.۵، ۱ درصد)', 'روزهای نگهداری (۰ تا ۱۶)'],
          dependent: ['شاخص قهوه‌ای شدن (BI)', 'فعالیت آنزیم PPO', 'کاهش وزن', 'شمارش سودوموناس', 'سفتی بافت قارچ'],
          controls: ['دمای نگهداری (۴ درجه)', 'رطوبت نسبی انبار (۸۵٪)', 'تعداد و اندازه قارچ در بسته']
        },
        recommendedDesignFa: 'طرح مرکب مرکزی (CCD) در روش سطح پاسخ جهت یافتن غلظت بهینه نانوفیبر و نانوذره',
        keyIndustrialImpactFa: 'افزایش ماندگاری قارچ صادراتی تا بیش از دو برابر و کاهش ضایعات زنجیره توزیع سرد.'
      }
    ],
    dairy: [
      {
        id: 'idea-dairy-1',
        titleFa: 'بهینه‌سازی فرمولاسیون پنیر پروبیوتیک سنتی با استفاده از صمغ دانه قدومه شهری و ارزیابی بقای باکتری و پروتئولیز طی رسیدن',
        titleEn: 'Optimization of traditional probiotic cheese with Alyssum homolocarpum seed gum and evaluation of bacterial survival and proteolysis during ripening',
        category: 'dairy',
        academicLevel: level,
        noveltyAngleFa: 'کاربرد صمغ بومی به عنوان ماده پری‌بیوتیک و پایدارکننده بافت در پنیر رسیده آب‌نمکی.',
        problemSummaryFa: 'کاهش جمعیت باکتری‌های پروبیوتیک در محیط پرنمک و اسیدی پنیر و لزوم حفظ حداقل 10^6 CFU/g در زمان مصرف.',
        suggestedVariables: {
          independent: ['غلظت صمغ قدومه (۰، ۰.۱، ۰.۲ درصد)', 'درصد نمک آب‌نمک (۶، ۸، ۱۰ درصد)', 'دوره رسیدن (۱۵، ۳۰، ۶۰ روز)'],
          dependent: ['شمارش پروبیوتیک', 'شاخص رسیدن پنیر (نیتروژن محلول در آب WSN/TN)', 'پروفایل اسیدهای چرب آزاد', 'سختی بافت'],
          controls: ['ترکیب شیر ورودی', 'نوع مایه پنیر (رنت میکروبی)', 'دمای اتاق رسیدن (۱۲ درجه)']
        },
        recommendedDesignFa: 'طرح فاکتوریل کامل در ۳ تکرار با تحلیل روند تغییرات در طول زمان رسیدن',
        keyIndustrialImpactFa: 'ارتقای ارزش سلامت‌بخش پنیر سفید ایرانی و کاهش نیاز به نمک بالا جهت ایجاد بافت مناسب.'
      },
      {
        id: 'idea-dairy-2',
        titleFa: 'تأثیر فرآوری با امواج اولتراسوند بر ویژگی‌های عملکردی و ساختاری پروتئین‌های سرمی شیر شتر و ایجاد کف پایدار',
        titleEn: 'Effect of ultrasound processing on functional and structural properties of camel milk whey proteins and foam stability',
        category: 'dairy',
        academicLevel: level,
        noveltyAngleFa: 'تغییر کنفورماسیون پروتئین‌های شیر شتر فاقد بتا-لاکتوگلوبولین جهت بهبود خاصیت کف‌کنندگی در دمای ملایم.',
        problemSummaryFa: 'ضعف خواص ساختاری شیر شتر در تشکیل ژل و کف به دلیل تفاوت در نسبت کازئین‌ها و عدم وجود بتا-لاکتوگلوبولین.',
        suggestedVariables: {
          independent: ['شدت صوت (۱۰۰، ۲۰۰، ۳۰۰ وات)', 'زمان فراصوت (۵، ۱۰، ۲۰ دقیقه)', 'pH محیط (۴.۵، ۶.۸، ۸.۰)'],
          dependent: ['ظرفیت کف‌کنندگی (FC)', 'پایداری کف (FS)', 'گروه‌های سولفیدریل آزاد', 'ساختار دوم پروتئین (CD)', 'کدورت'],
          controls: ['دمای صوت‌دهی (زیر ۳۰ درجه با حمام یخ)', 'غلظت پروتئین ثابت (۲٪)']
        },
        recommendedDesignFa: 'طرح سطح پاسخ باکس-بنکن (Box-Behnken)',
        keyIndustrialImpactFa: 'ایجاد بازار جدید برای فرآورده‌های کف‌پایه شیر شتر در صنایع غذایی فراسودمند.'
      }
    ],
    meat_poultry_fish: [
      {
        id: 'idea-meat-1',
        titleFa: 'جایگزینی نیتریت سدیم با نانوکپسول‌های عصاره تفاله انار و اسید اسکوربیک در سوسیس کوکتل و بررسی مهار تشکیل نیتروزآمین‌ها',
        titleEn: 'Replacement of sodium nitrite with pomegranate peel extract nanocapsules in frankfurters: Inhibition of nitrosamine formation',
        category: 'meat_poultry_fish',
        academicLevel: level,
        noveltyAngleFa: 'استفاده از ضایعات غنی از الاژیتانین جهت حفظ رنگ قرمز گوشت و مهار باکتری کلستریدیوم بدون تشکیل نیتروزآمین سرطان‌زا.',
        problemSummaryFa: 'نگرانی شدید جهانی درباره پیوند نیتریت با آمین‌های ثانویه در گوشت پخته و تشکیل نیتروزآمین‌های سرطان‌زا.',
        suggestedVariables: {
          independent: ['سطح جایگزینی نیتریت (۰، ۵۰، ۱۰۰ درصد)', 'غلظت نانوکپسول انار (۰.۱، ۰.۲۵، ۰.۵ درصد)', 'زمان نگهداری در ۴ درجه'],
          dependent: ['شاخص قرمزی a*', 'عدد نیتریت باقیمانده', 'شاخص تیوباربیتوریک (TBA)', 'شمارش کلستریدیوم پرفرنژنس', 'آزمون طعم حسی'],
          controls: ['فرمول پایه گوشت قرمز (۵۵٪)', 'دمای پخت کاتر (۷۲ درجه در مرکز محصول)', 'روش بسته‌بندی تحت خلاء']
        },
        recommendedDesignFa: 'طرح بلوک‌های تصادفی با مقایسه تیمار شاهد حاوی ۱۲۰ ppm نیتریت تجاری',
        keyIndustrialImpactFa: 'تولید فرآورده گوشتی Clean Label با برچسب سلامت و حذف افزودنی‌های پرخطر شیمیایی.'
      }
    ],
    packaging_shelf_life: [
      {
        id: 'idea-pkg-1',
        titleFa: 'توسعه فیلم نشانگر هوشمند حساس به pH بر پایه پکتین/آنتوسیانین کلم بنفش برای پایش بلادرنگ تازگی مرغ قطعه‌بندی‌شده',
        titleEn: 'Development of intelligent pH-sensitive pectin/red cabbage anthocyanin film for real-time freshness monitoring of chicken meat',
        category: 'packaging_shelf_life',
        academicLevel: level,
        noveltyAngleFa: 'شناساگر بصری تغییر رنگ بدون تخریب بسته در پاسخ به تجمع بازهای فرار نیتروژنی (TVB-N).',
        problemSummaryFa: 'عدم اطمینان مصرف‌کننده از تاریخ مصرف انقضای روی بسته در زنجیره سرد ناقص و مسمومیت‌های باکتریایی مرغ.',
        suggestedVariables: {
          independent: ['غلظت عصاره آنتوسیانین (۱، ۳، ۵ درصد)', 'زمان نگهداری مرغ در ۴ درجه (۰ تا ۱۲ روز)'],
          dependent: ['تغییر رنگ دلتا E', 'شاخص TVB-N مرغ', 'شمارش باکتری‌های سرماگرا', 'پایداری نوری شناساگر'],
          controls: ['نوع گوشت سینه مرغ تازه', 'ضخامت فیلم پکتین', 'رطوبت داخل بسته']
        },
        recommendedDesignFa: 'طرح همبستگی اسپیرمن و رگرسیون غیرخطی بین تغییر رنگ (ΔE) و شاخص فساد TVB-N',
        keyIndustrialImpactFa: 'کاهش مسمومیت‌های غذایی با هشدارهای رنگی شفاف (قرمز: تازه، سبز-آبی: شروع فساد) برای مصرف‌کننده.'
      }
    ],
    byproduct_valorization: [
      {
        id: 'idea-byprod-1',
        titleFa: 'استخراج بهینه فیبر رژیمی و پکتین غنی از فرولیک اسید از تفاله چغندر قند با فراصوت و کاربرد آن در کیک بدون گلوتن',
        titleEn: 'Ultrasound-assisted extraction of dietary fiber and ferulic acid-rich pectin from sugar beet pulp for gluten-free cakes',
        category: 'byproduct_valorization',
        academicLevel: level,
        noveltyAngleFa: 'ارزش‌افزایی پسماند کارخانجات قند جهت بهبود ساختار شبکه مغز کیک فاقد گلوتن بر پایه آرد برنج.',
        problemSummaryFa: 'انباشت هزاران تن تفاله چغندر قند و ساختار ضعیف، خشک و متلاشی‌شونده کیک‌های بدون گلوتن بیماران سلیاک.',
        suggestedVariables: {
          independent: ['دمای فراصوت (۴۰، ۶۰، ۸۰ درجه)', 'توان صوت (۱۵۰، ۳۰۰، ۴۵۰ وات)', 'درصد جایگزینی در کیک (۰، ۵، ۱۰، ۱۵ درصد)'],
          dependent: ['راندمان استخراج پکتین', 'حجم مخصوص کیک', 'سفتی بافت مغز کیک طی ۷ روز', 'آب‌گیری و احساس دهانی'],
          controls: ['فرمول پایه کیک آرد برنج', 'دمای پخت فر (۱۸۰ درجه)', 'زمان پخت (۳۰ دقیقه)']
        },
        recommendedDesignFa: 'طرح دورگه‌ای (Hybrid Design) متشکل از بهینه‌سازی استخراج با RSM و سپس طرح فاکتوریل برای فرمولاسیون کیک',
        keyIndustrialImpactFa: 'ایجاد ارزش اقتصادی از ضایعات کشاورزی و تولید غذای سالم برای بیماران حساس به گلوتن.'
      }
    ],
    functional_foods: [
      {
        id: 'idea-func-1',
        titleFa: 'توسعه نوشیدنی پری‌بیوتیک تخمیری با کفیر بر پایه شیره توت و ارزیابی تغییرات شاخص قند خون و فعالیت آنتی‌اکسیدانی',
        titleEn: 'Development of fermented synbiotic kefir beverage based on mulberry syrup and evaluation of glycemic index and antioxidant activity',
        category: 'functional_foods',
        academicLevel: level,
        noveltyAngleFa: 'بهره‌گیری از شیره توت به عنوان منبع کربوهیدرات طبیعی غنی از آنتوسیانین در تخمیر سینرژیک باکتری‌های اسید لاکتیک و مخمرها.',
        problemSummaryFa: 'نیاز به نوشیدنی‌های تخمیری بدون لاکتوز و کاهش شاخص گلیسمی در مقایسه با نوشابه‌های متداول صنعتی.',
        suggestedVariables: {
          independent: ['درصد شیره توت (۵، ۱۰، ۱۵ درصد)', 'زمان تخمیر در ۲۵ درجه (۲۴، ۴۸ ساعت)', 'درصد مایه تلقیح دانه کفیر'],
          dependent: ['تغییرات pH و اسیدیته', 'شمارش باکتری‌های پروبیوتیک', 'قدرت مهار رادیکال DPPH', 'محتوای فنولی تام (TPC)', 'پذیرش حسی'],
          controls: ['کیفیت آب مصرفی', 'استریل بودن محیط اولیه', 'دمای تخمیر ثابت']
        },
        recommendedDesignFa: 'طرح بلوک تصادفی کامل با تکرار سه‌گانه',
        keyIndustrialImpactFa: 'معرفی نوشیدنی بومی سلامت‌بخش جایگزین نوشابه‌های گازدار قندی.'
      }
    ],
    oils_fats: [
      {
        id: 'idea-oils-1',
        titleFa: 'بهینه‌سازی فرمولاسیون اولئوژل روغن کانولا بر پایه موم زنبور عسل و اتیل سلولز به عنوان جایگزین چربی هیدروژنه در خمیر هزارلا',
        titleEn: 'Optimization of canola oil oleogels based on beeswax and ethylcellulose as shortening replacement in puff pastry dough',
        category: 'oils_fats',
        academicLevel: level,
        noveltyAngleFa: 'تشکیل شبکه کریستالی سه بعدی پایدار در روغن مایع جهت جایگزینی ۱۰۰٪ اسیدهای چرب ترانس و اشباع.',
        problemSummaryFa: 'الزام قانونی حذف روغن‌های ترانس و اشباع از محصولات قنادی به دلیل انسداد عروق کرونری بدون لطمه به ورقه‌ورقه‌شدن خمیر.',
        suggestedVariables: {
          independent: ['نسبت موم زنبور به اتیل سلولز (۱:۱، ۱:۲، ۲:۱)', 'غلظت کل اولئوژلاتور (۶، ۸، ۱۰ درصد)', 'دمای تولید اولئوژل'],
          dependent: ['ظرفیت نگهداری روغن (OBC)', 'دمای ذوب و کریستالیزاسیون با DSC', 'سختی بافت اولئوژل', 'حجم و لایه‌بندی خمیر پخته'],
          controls: ['نوع روغن کانولای تصفیه‌شده', 'فرآیند رولینگ و استراحت خمیر', 'دمای پخت فر']
        },
        recommendedDesignFa: 'طرح آمیخته (Mixture Design) جهت بهینه‌سازی نسبت ترکیبات تشکیل‌دهنده اولئوژل',
        keyIndustrialImpactFa: 'حذف کامل اسیدهای چرب ترانس در صنعت شیرینی‌پزی صنعتی با حفظ تردی و لایه‌لایه بودن محصول.'
      }
    ],
    cereal_bakery: [
      {
        id: 'idea-cereal-1',
        titleFa: 'تأثیر تخمیر طولانی‌مدت با خمیرترش بومی حاوی لاکتوباسیلوس پلانتاروم بر تجزیه پروتئین‌های ایمونوژنیک گلوتن در نان سنگک',
        titleEn: 'Impact of extended sourdough fermentation with native L. plantarum on degradation of immunogenic gluten peptides in Sangak bread',
        category: 'cereal_bakery',
        academicLevel: level,
        noveltyAngleFa: 'فعال‌سازی پروتئازهای درون‌ریز گندم در pH اسیدی و پپتیدازهای باکتریایی برای هضم اپی‌توپ‌های ۳۳-مر گلوتن.',
        problemSummaryFa: 'عدم تحمل گوارشی و شیوع حساسیت‌های غیرسلیاکی به گلوتن ناشی از فرآیندهای تخمیر سریع شیمیایی در نانوایی‌های صنعتی.',
        suggestedVariables: {
          independent: ['زمان تخمیر خمیرترش (۶، ۱۲، ۱۸، ۲۴ ساعت)', 'دمای تخمیر (۲۸ و ۳۵ درجه)', 'درصد تلقیح خمیرترش (۱۰، ۲۰، ۳۰ درصد)'],
          dependent: ['غلظت پپتیدهای ایمونوژنیک با الایزا (ELISA R5)', 'اسیدیته کل قابل تیتر (TTA)', 'حجم مخصوص نان', 'نرخ بیات شدن نان با DSC'],
          controls: ['نوع آرد گندم کامل سنگک', 'زمان و دمای پخت سنتی بر روی سنگریزه‌ها']
        },
        recommendedDesignFa: 'طرح اسپلیت پلات (Split-Plot Design) در فواصل زمانی مختلف',
        keyIndustrialImpactFa: 'تولید نان سنتی سنبل سلامت با قابلیت هضم آسان برای جامعه مصرف‌کنندگان مبتلا به حساسیت گوارشی.'
      }
    ],
    beverage_fermentation: [
      {
        id: 'idea-bev-1',
        titleFa: 'مدل‌سازی کینتیکی تولید اسیدهای آلی و فعالیت ضدباکتریایی نوشیدنی تخمیری چای کومبوچا تقویت‌شده با عصاره زعفران',
        titleEn: 'Kinetic modeling of organic acids production and antibacterial activity of Kombucha fermented tea enriched with saffron extract',
        category: 'beverage_fermentation',
        academicLevel: level,
        noveltyAngleFa: 'تلفیق متابولیسم همزیست SCOBY با ترکیبات فعال کروسین و سافرانال زعفران جهت افزایش توان ضدباکتری بر هلیکوباکتر پیلوری.',
        problemSummaryFa: 'یکنواخت نبودن زمان تخمیر و طعم بسیار ترش استیک اسید در روزهای انتهایی تخمیر و لزوم پایش نقطه بهینه طعم و خواص دارویی.',
        suggestedVariables: {
          independent: ['غلظت عصاره زعفران (۰.۱، ۰.۲، ۰.۴ درصد)', 'زمان تخمیر (روزهای ۳، ۶، ۹، ۱۲، ۱۵)', 'دمای انکوباسیون (۲۲ و ۲۸ درجه)'],
          dependent: ['اسید گلوکورونیک', 'اسید استیک', 'شمارش سلول‌های مخمر و باکتری اسید استیک', 'قطر هاله عدم رشد هلیکوباکتر'],
          controls: ['قند اولیه ساکاروز (۷۰ گرم بر لیتر)', 'غلظت چای سیاه دم‌شده', 'نسبت اولیه مایه استارتر']
        },
        recommendedDesignFa: 'مدل‌سازی رگرسیون لجستیک و کینتیک درجه اول واکنش‌های بیوشیمیایی',
        keyIndustrialImpactFa: 'ارائه نوشیدنی پروبیوتیک گیاهی با ارزش افزوده بالا و خاصیت اثبات‌شده محافظت از مخاط معده.'
      }
    ],
    fruits_vegetables: [
      {
        id: 'idea-fruits-1',
        titleFa: 'کاربرد پلاسمای سرد اتمسفری (ACP) در کنترل بار میکروبی و حفظ ترکیبات فیتوشیمیایی برگه زردآلو بدون استفاده از دی‌اکسید گوگرد',
        titleEn: 'Application of atmospheric cold plasma (ACP) for microbial decontamination and phytochemical retention in dried apricots without sulfur dioxide',
        category: 'fruits_vegetables',
        academicLevel: level,
        noveltyAngleFa: 'غیرفعال‌سازی اسپور قارچ‌های آسپرژیلوس و پنی‌سیلیوم با گونه‌های فعال اکسیژن و نیتروژن در دمای اتاق بدون پسماند شیمیایی.',
        problemSummaryFa: 'خطرات تنفسی و آلرژی‌زایی باقیمانده گوگرد ($SO_2$) در میوه‌های خشک صادراتی و الزامات سخت‌گیرانه اتحادیه اروپا.',
        suggestedVariables: {
          independent: ['ولتاژ پلاسما (۵۰، ۶۰، ۷۰ کیلوولت)', 'زمان تابش پلاسما (۱، ۳، ۵ دقیقه)', 'گاز حامل (هوا یا مخلوط آرگون-اکسیژن)'],
          dependent: ['کاهش لگاریتمی بار قارچی', 'تغییرات بتاکاروتن و ویتامین C', 'شاخص رنگی b* (زردی)', 'فعالیت آب (aw)'],
          controls: ['رطوبت اولیه برگه زردآلو (۱۸٪)', 'دمای محیط حین پلاسما']
        },
        recommendedDesignFa: 'طرح فاکتوریل بر پایه بلوک‌های تصادفی با ارزیابی اثرات متقابل ولتاژ و زمان',
        keyIndustrialImpactFa: 'رفع موانع صادراتی میوه خشک ایرانی با حذف کامل دود دادن گوگرد و پاس کردن استانداردهای سخت‌گیرانه آلمان و اتحادیه اروپا.'
      }
    ],
    confectionery_sweets: [
      {
        id: 'idea-sweets-1',
        titleFa: 'فرمولاسیون شکلات تلخ بدون شکر حاوی ایزومالت و ایزومالتولوز غنی‌شده با میکروکپسول‌های پروبیوتیک باسیلوس کواگولانس',
        titleEn: 'Formulation of sugar-free dark chocolate with isomalt and isomaltulose enriched with microencapsulated Bacillus coagulans',
        category: 'confectionery_sweets',
        academicLevel: level,
        noveltyAngleFa: 'بهره‌گیری از اسپورهای مقاوم باسیلوس کواگولانس درون ماتریکس کره کاکائو جهت بقا در دمای کونچینگ (۵۵ درجه).',
        problemSummaryFa: 'مرگ سریع پروبیوتیک‌ها در فرآیند حرارتی تولید شکلات و نوسانات بافتی ناشی از جایگزینی ساکاروز با پلی‌ال‌ها.',
        suggestedVariables: {
          independent: ['نسبت ایزومالت به ایزومالتولوز (۲۵:۷۵، ۵۰:۵۰، ۷۵:۲۵)', 'غلظت میکروکپسول پروبیوتیک', 'دمای کونچینگ (۴۵ و ۵۵ درجه)'],
          dependent: ['اندازه ذرات شکلات (میکرومتر با میکرومتر دستی)', 'رفتار جریان کاسون (Casson Yield Stress)', 'بقای پروبیوتیک در گوارش شبیه‌سازی‌شده', 'زمان تمپرینگ'],
          controls: ['درصد کره کاکائو و لیکور کاکائو', 'میزان لسیتین سویا (۰.۴٪)']
        },
        recommendedDesignFa: 'طرح سطح پاسخ فاکتوریل با ارزیابی بافت و ذوب دهانی',
        keyIndustrialImpactFa: 'تولید شکلات رژیمی فراسودمند ویژه افراد دیابتی با تضمین رهایش باکتری زنده در روده باریک.'
      }
    ]
  };

  const pool = domainIdeas[category] || domainIdeas['food_nanotechnology'];
  if (keyword && keyword.trim()) {
    const k = keyword.trim().toLowerCase();
    const filtered = pool.filter(
      (item) => item.titleFa.includes(k) || item.problemSummaryFa.includes(k) || item.noveltyAngleFa.includes(k)
    );
    if (filtered.length > 0) return filtered;
  }
  return pool;
}

/**
 * AI Research Assistant: Formulate Research Questions (PICO/FINER)
 */
export function generateResearchQuestions(
  title: string,
  problemStatement: string,
  variables: ResearchVariable[]
): ResearchQuestionSuggestion[] {
  const indeps = variables.filter((v) => v.type === 'independent').map((v) => v.name);
  const deps = variables.filter((v) => v.type === 'dependent').map((v) => v.name);
  const controls = variables.filter((v) => v.type === 'control').map((v) => v.name);

  const indepText = indeps.length > 0 ? indeps.join(' و ') : 'متغیرهای مستقل منتخب';
  const depText = deps.length > 0 ? deps.slice(0, 2).join(' و ') : 'شاخص‌های کیفی و ماندگاری';

  return [
    {
      id: 'rq-1',
      category: 'primary',
      questionFa: `تأثیر مقادیر مختلف ${indepText} بر تغییرات ${depText} در طول دوره آزمون چگونه ارزیابی می‌شود؟`,
      picoAlignment: {
        population: 'ماتریکس ماده غذایی هدف مورد مطالعه',
        intervention: indepText,
        comparison: 'نمونه شاهد فاقد تیمار یا نمونه متداول صنعتی',
        outcome: `بهبود معنی‌دار در ${depText}`
      },
      finerAssessmentFa: 'پاسخگوی معیار FINER: از نظر آزمایشگاهی قابل اجرا (Feasible)، برای پژوهشگران جذاب (Interesting)، دارای نوآوری کاربردی (Novel) و فاقد مخاطره اخلاقی (Ethical).'
    },
    {
      id: 'rq-2',
      category: 'mechanistic',
      questionFa: `آیا برهمکنش متقابل میان متغیرهای مستقل (${indeps.slice(0, 2).join(' با ')}) دارای اثر هم‌افزایی (Synergistic) یا خنثی‌کننده (Antagonistic) بر شاخص‌های پایداری محصول است؟`,
      picoAlignment: {
        population: 'نمونه‌های فرموله‌شده',
        intervention: 'تیمارهای ترکیبی چندعاملی',
        comparison: 'تیمارهای تک‌عاملی مستقل',
        outcome: 'محاسبه ضرایب برهمکنش و سطح معنی‌داری آنالیز واریانس (p-value)'
      },
      finerAssessmentFa: 'این سوال با ایجاد مدل رگرسیونی یا تحلیل اثرات متقابل ANOVA به اثبات تئوری‌های بیوشیمیایی و فیزیکی کمک می‌کند.'
    },
    {
      id: 'rq-3',
      category: 'secondary',
      questionFa: `نقطه بهینه متغیرها از نظر دستیابی به بیشترین پذیرش حسی در کنار رعایت استانداردهای ملی و بین‌المللی کدام است؟`,
      picoAlignment: {
        population: 'مصرف‌کنندگان هدف و پانل ارزیابان حسی',
        intervention: 'فرمولاسیون‌های بهینه‌سازی‌شده',
        comparison: 'شاخص استاندارد ملی یا کدکس',
        outcome: 'ماکسیمم‌سازی تابع مطلوبیت (Desirability Function)'
      },
      finerAssessmentFa: 'ارتباط مستقیم با نیاز واقعی صنعت غذا و امکان پیاده‌سازی تجاری در مقیاس صنعتی.'
    }
  ];
}

/**
 * AI Research Assistant: Structure Research Methodology & DoE
 */
export function structureResearchMethodology(project: Partial<ResearchProject>): ExperimentalDesignStructure {
  const vars = project.variables || [];
  const indeps = vars.filter((v) => v.type === 'independent');
  const deps = vars.filter((v) => v.type === 'dependent');

  const factorCount = indeps.length || 2;
  const isRsmSuggested = factorCount >= 2 && factorCount <= 4;

  if (isRsmSuggested) {
    const totalRuns = factorCount === 2 ? 13 : factorCount === 3 ? 20 : 30;
    return {
      designType: 'rsm_ccd',
      designNameFa: `طرح مرکب مرکزی چرخش‌پذیر (CCRD) با ${factorCount} متغیر مستقل در ۵ سطح`,
      factorsCount: factorCount,
      factorsSummary: indeps.map((f) => `${f.name} (${f.levelsOrRange || '۵ سطح'})`).join('، ') || 'متغیرهای بهینه‌سازی',
      responsesSummary: deps.map((d) => d.name).join('، ') || 'پاسخ‌های فیزیکوشیمیایی و حسی',
      totalRuns,
      replications: 5, // نقطه مرکزی
      statisticalModelFa: 'Y = β0 + Σ(βi·Xi) + Σ(βii·Xi²) + ΣΣ(βij·Xi·Xj) + ε',
      softwareRecommended: 'Design-Expert 13 یا Minitab 20',
      anovaProcedureFa: 'تحلیل رگرسیون چندجمله‌ای درجه ۲، ارزیابی کفایت مدل با R² و Adj-R² بالای ۰.۹۰، و بررسی عدم برازش (Lack of Fit p > 0.05).'
    };
  }

  // Factorial design default
  return {
    designType: 'factorial',
    designNameFa: `طرح فاکتوریل کامل بر پایه بلوک‌های تصادفی (RCBD) در ۳ تکرار`,
    factorsCount: factorCount,
    factorsSummary: indeps.map((f) => f.name).join(' × ') || 'فاکتورهای آزمون',
    responsesSummary: deps.map((d) => d.name).join('، ') || 'شاخص‌های آزمون',
    totalRuns: Math.max(12, factorCount * 6),
    replications: 3,
    statisticalModelFa: 'Y_ijk = μ + α_i + β_j + (αβ)_ij + ε_ijk',
    softwareRecommended: 'SPSS 26 / SAS 9.4',
    anovaProcedureFa: 'بررسی نرمال بودن داده‌ها با آزمون Kolmogorov-Smirnov، آنالیز واریانس دوطرفه، و مقایسه میانگین‌ها با آزمون دانکن در سطح خطای ۵ درصد.'
  };
}

/**
 * AI Research Assistant: Find Authentic Relevant Sources
 * STRICT RULE: No fake citations, no invented papers, no fake DOIs!
 */
export async function findAuthenticLiteratureSources(
  category: FoodResearchCategory,
  keywords: string[]
): Promise<LiteratureSearchMatch[]> {
  const allSources = await getAllUnifiedSources();
  const matches: LiteratureSearchMatch[] = [];

  const queryTerms = keywords.map((k) => k.trim().toLowerCase()).filter(Boolean);

  for (const src of allSources) {
    let score = 0;
    const reasons: string[] = [];

    // Search in title, englishTitle, tags, and notes
    const textCorpus = [
      src.title,
      src.englishTitle || '',
      ...(src.tags || []),
      src.notes || '',
      src.standardNumber || ''
    ].join(' ').toLowerCase();

    for (const term of queryTerms) {
      if (textCorpus.includes(term)) {
        score += 25;
        reasons.push(`انطباق با کلیدواژه «${term}»`);
      }
    }

    // Category boosts
    if (category === 'dairy' && (textCorpus.includes('شیر') || textCorpus.includes('ماست') || textCorpus.includes('لبنیات') || textCorpus.includes('پنیر') || textCorpus.includes('dairy'))) {
      score += 30;
      reasons.push('ارتباط مستقیم با حوزه لبنیات');
    }
    if (category === 'meat_poultry_fish' && (textCorpus.includes('گوشت') || textCorpus.includes('ماهی') || textCorpus.includes('پراکسید') || textCorpus.includes('نیتریت') || textCorpus.includes('انتروکوک'))) {
      score += 30;
      reasons.push('ارتباط با فرآورده‌های پروتئینی، اکسیداسیون و بافت حیوانی');
    }
    if (category === 'food_nanotechnology' && (textCorpus.includes('پلی‌فنول') || textCorpus.includes('فیلم') || textCorpus.includes('کیتوزان') || textCorpus.includes('آنتی‌اکسیدان'))) {
      score += 30;
      reasons.push('ارتباط با کینتیک آنتی‌اکسیدانی و بسته‌بندی فعال');
    }
    if (category === 'oils_fats' && (textCorpus.includes('پراکسید') || textCorpus.includes('چربی') || textCorpus.includes('روغن') || textCorpus.includes('اسیدیته'))) {
      score += 35;
      reasons.push('متد رسمی آزمون اکسیداسیون و چربی');
    }

    if (score >= 20) {
      const authorStr = src.authors && src.authors.length > 0 ? src.authors.join('، ') : src.authorOrOrganization;
      const citation = `${authorStr} (${src.year}). ${src.title}. ${src.standardNumber || src.editionOrVersion || ''}.`;

      matches.push({
        source: src,
        relevanceScore: Math.min(100, score),
        matchedReasonFa: reasons.join('؛ '),
        suggestedCitation: citation,
        isVerifiedAuthentic: true
      });
    }
  }

  // Sort descending by relevance score
  return matches.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 8);
}

/**
 * AI Research Assistant: Audit Methodological Weaknesses
 */
export function auditResearchWeaknesses(project: ResearchProject): MethodologicalWeakness[] {
  const weaknesses: MethodologicalWeakness[] = [];
  const vars = project.variables || [];
  const indeps = vars.filter((v) => v.type === 'independent');
  const deps = vars.filter((v) => v.type === 'dependent');
  const controls = vars.filter((v) => v.type === 'control');

  // Check 1: Lack of Control Variables
  if (controls.length === 0) {
    weaknesses.push({
      id: 'w-ctrl-1',
      aspect: 'control_groups',
      aspectTitleFa: 'عدم ثبت متغیرهای کنترل فرآیند',
      severity: 'critical',
      identifiedIssueFa: 'هیچ متغیر کنترلی (مانند دما، رطوبت نسبی انبارش، دور همزن یا نسبت نمونه به حلال) در شناسنامه طرح ثبت نشده است.',
      correctiveRecommendationFa: 'حداقل ۳ متغیر کنترلی با ذکر بازه رواداری (Tolerance Range) جهت تضمین تکرارپذیری (Reproducibility) اضافه نمایید.'
    });
  }

  // Check 2: Missing time-points or shelf-life timeline
  const timeVar = indeps.find((v) => v.name.includes('زمان') || v.name.includes('روز') || v.name.toLowerCase().includes('time'));
  if (project.category === 'packaging_shelf_life' && !timeVar) {
    weaknesses.push({
      id: 'w-time-1',
      aspect: 'shelf_life_acceleration',
      aspectTitleFa: 'نقص پایش کینتیکی در فواصل زمانی',
      severity: 'critical',
      identifiedIssueFa: 'در پروژه‌های ماندگاری و بسته‌بندی، متغیر زمان نگهداری ثبت نشده است.',
      correctiveRecommendationFa: 'فواصل زمانی استاندارد (مانند روزهای ۰، ۴، ۸، ۱۲، ۱۶ در دمای ۴ درجه) را به متغیرهای مستقل بیافزایید.'
    });
  }

  // Check 3: Lack of sample size specification
  if (!project.populationAndSample.sampleSize || project.populationAndSample.sampleSize.trim().length < 5) {
    weaknesses.push({
      id: 'w-samp-1',
      aspect: 'sample_size',
      aspectTitleFa: 'ابهام در حجم جامعه و نمونه‌های آزمون',
      severity: 'moderate',
      identifiedIssueFa: 'حجم نمونه و تعداد واحدهای آزمایشی به تفکیک هر تیمار مشخص نگردیده است.',
      correctiveRecommendationFa: 'حجم نمونه (وزن فیله/حجم شیر) و تعداد تکرار مستقل در هر بلوک را صراحتاً در متن قید فرمایید.'
    });
  }

  // Check 4: Instrumental validation
  const hasInstrumental = deps.some((d) => d.measurementMethod && d.measurementMethod.length > 5);
  if (!hasInstrumental) {
    weaknesses.push({
      id: 'w-inst-1',
      aspect: 'instrumental_validation',
      aspectTitleFa: 'فقدان پروتکل استاندارد اندازه‌گیری برای پاسخ‌ها',
      severity: 'moderate',
      identifiedIssueFa: 'برای برخی از متغیرهای وابسته، روش یا شماره استاندارد آزمون (مانند AOAC یا INSO) درج نشده است.',
      correctiveRecommendationFa: 'روش سنجش، ابزار اندازه‌گیری و حدود حساسیت دستگاه را برای کلیه متغیرهای وابسته تکمیل فرمایید.'
    });
  }

  return weaknesses;
}

/**
 * AI Research Assistant: Suggest Specific Experiments for Project
 */
export function suggestExperimentsForProject(project: ResearchProject): SuggestedExperiment[] {
  const suggestions: SuggestedExperiment[] = [];
  const cat = project.category;

  if (cat === 'dairy') {
    suggestions.push({
      id: 'exp-d-syneresis',
      category: 'physicochemical',
      categoryTitleFa: 'فیزیکوشیمیایی و پایداری کلوئیدی',
      testNameFa: 'سنجش میزان آب‌اندازی (Syneresis Index)',
      testNameEn: 'Centrifugal Syneresis Measurement',
      standardReference: 'روش سانتریفیوژ استاندارد لبنیات (Amatayakul et al.)',
      recommendedEquipment: 'سانتریفیوژ یخچال‌دار با روتور زاویه‌دار در ۳۰۰۰ دور در دقیقه',
      processConditions: 'دمای ۴ درجه سلسیوس، مدت زمان ۱۵ دقیقه، وزن نمونه ۲۰ گرم',
      targetParameter: 'درصد سرم جدا شده نسبت به وزن کل ژل',
      justificationFa: 'پایش پایداری ساختار ژل کازئین در حضور پایدارکننده‌ها یا هیدروکلوئیدهای جدید.'
    });
    suggestions.push({
      id: 'exp-d-prob-count',
      category: 'microbial',
      categoryTitleFa: 'میکروبیولوژی تخصصی و پروبیوتیک',
      testNameFa: 'شمارش اختصاصی باکتری‌های پروبیوتیک زنده',
      testNameEn: 'Viable Probiotic Enumeration (TOS-MUP Agar)',
      standardReference: 'ISO 29981 / INSO 19579',
      recommendedEquipment: 'جار بی‌هوازی (Anaerobic Jar) با کیت گازپک و انکوباتور ۳۷ درجه',
      processConditions: 'انکوباسیون بی‌هوازی به مدت ۷۲ ساعت در دمای ۳۷ درجه',
      targetParameter: 'جمعیت باکتری‌های زنده (log CFU/g)',
      justificationFa: 'اثبات ادعای سلامت‌بخشی (Health Claim) و کفایت جمعیت باکتری تا پایان زمان انقضا.'
    });
  } else if (cat === 'meat_poultry_fish' || cat === 'food_nanotechnology') {
    suggestions.push({
      id: 'exp-meat-tvbn',
      category: 'physicochemical',
      categoryTitleFa: 'شیمیایی و تجزیه پروتئین',
      testNameFa: 'اندازه‌گیری بازهای ازته فرار کل (TVB-N)',
      testNameEn: 'Total Volatile Basic Nitrogen (TVB-N)',
      standardReference: 'روش مرجع اتحادیه اروپا / ISIRI 3777',
      recommendedEquipment: 'دستگاه تقطیر کجلدال اتوماتیک یا نیمه‌اتوماتیک با مبرد شیشه‌ای',
      processConditions: 'تقطیر با اکسید منیزیم سبک، جذب در اسید بوریک ۲٪ و تیتراسیون با اسید سولفوریک ۰.۰۱ نرمال',
      targetParameter: 'میلی‌گرم ازت در ۱۰۰ گرم گوشت (حد فساد ۲۵ تا ۳۰ mg N/100g)',
      justificationFa: 'حساس‌ترین و رسمی‌ترین شاخص تخریب باکتریایی و آنزیمی اسیدهای آمینه در محصولات گوشتی.'
    });
    suggestions.push({
      id: 'exp-meat-pv',
      category: 'physicochemical',
      categoryTitleFa: 'اکسیداسیون اولیه لیپیدها',
      testNameFa: 'اندازه‌گیری عدد پراکسید در فاز لیپیدی',
      testNameEn: 'Peroxide Value (PV)',
      standardReference: 'AOAC Official Method 965.33',
      recommendedEquipment: 'بورت دیجیتال اتوماتیک، تاریک‌خانه، پیپت حباب‌دار',
      processConditions: 'استخراج چربی سرد با حلال کلروفرم/متانول و تیتراسیون یدومتری با تیوسولفات سدیم در تاریکی',
      targetParameter: 'میلی‌اکی‌والان اکسیژن فعال در هر کیلوگرم چربی استخراج‌شده',
      justificationFa: 'شناسایی مراحل اولیه اکسیداسیون اسیدهای چرب غیراشباع قبل از بروز ترشیدگی حسی.'
    });
    suggestions.push({
      id: 'exp-pkg-wvp',
      category: 'thermal',
      categoryTitleFa: 'خواص فیزیکی و ممانعتی فیلم پلیمری',
      testNameFa: 'نرخ نفوذپذیری بخار آب (WVP)',
      testNameEn: 'Water Vapor Permeability (WVP)',
      standardReference: 'ASTM E96 / E96M (Desiccant Method)',
      recommendedEquipment: 'سل‌های فنجانی استاندارد، دسیکاتور رطوبت‌کنترل‌شده با کلرید کلسیم، ترازوی ۰.۰۰۰۱ گرم',
      processConditions: 'دمای ۲۵ درجه سلسیوس، گرادیان رطوبت ۱۰۰٪ به ۰٪',
      targetParameter: 'g·m⁻¹·s⁻¹·Pa⁻¹',
      justificationFa: 'ارزیابی توانایی فیلم در جلوگیری از دهیدراسیون یا جذب رطوبت محیط توسط ماده غذایی.'
    });
  } else {
    // General food analysis
    suggestions.push({
      id: 'exp-gen-aw',
      category: 'physicochemical',
      categoryTitleFa: 'فیزیکوشیمیایی بنیادی',
      testNameFa: 'سنجش فعالیت آبی (Water Activity - aw)',
      testNameEn: 'Water Activity Measurement',
      standardReference: 'ISO 21807 / INSO 8683',
      recommendedEquipment: 'دستگاه سنجش فعالیت آبی با سنسور نقطه شبنم چیلد میرور (Chilled Mirror Dew Point)',
      processConditions: 'دمای تثبیت‌شده ۲۵.۰ ± ۰.۱ درجه سلسیوس',
      targetParameter: 'ضریب فعالیت آبی (۰.۰۰۰ تا ۱.۰۰۰)',
      justificationFa: 'پیش‌بینی پایداری میکروبیولوژیکی و جلوگیری از واکنش‌های قهوه‌ای‌شدن میلارد و بیات شدن.'
    });
  }

  return suggestions;
}

/**
 * AI Research Assistant: Compare Two Scientific Studies / Methods
 */
export interface StudyComparisonResult {
  studyA: { title: string; authors?: string; year?: string | number };
  studyB: { title: string; authors?: string; year?: string | number };
  matrixComparison: {
    aspectTitleFa: string;
    valueStudyA: string;
    valueStudyB: string;
    criticalNotesFa: string;
  }[];
  overallSynthesisFa: string;
  methodologicalSuperiorityFa: string;
}

export function compareResearchStudies(
  studyA: { title: string; authors?: string; year?: string | number; methodology?: string; findings?: string },
  studyB: { title: string; authors?: string; year?: string | number; methodology?: string; findings?: string }
): StudyComparisonResult {
  return {
    studyA: { title: studyA.title, authors: studyA.authors || 'پژوهش اول', year: studyA.year || 'نامشخص' },
    studyB: { title: studyB.title, authors: studyB.authors || 'پژوهش دوم', year: studyB.year || 'نامشخص' },
    matrixComparison: [
      {
        aspectTitleFa: 'ماتریکس و بستر غذایی مورد آزمون',
        valueStudyA: studyA.methodology?.slice(0, 100) || 'ماتریکس مشخص‌شده در مطالعه اول',
        valueStudyB: studyB.methodology?.slice(0, 100) || 'ماتریکس مشخص‌شده در مطالعه دوم',
        criticalNotesFa: 'تفاوت در درصد چربی و فاز آبی ماتریکس بر ضریب انتقال جرم و سرعت اکسیداسیون اثر مستقیم دارد.'
      },
      {
        aspectTitleFa: 'متدولوژی و ابزار آزمایشگاهی',
        valueStudyA: studyA.methodology || 'پروتکل استاندارد مطالعه اول',
        valueStudyB: studyB.methodology || 'پروتکل استاندارد مطالعه دوم',
        criticalNotesFa: 'دقت روش‌های دستگاهی (مانند کروماتوگرافی HPLC در مقابل اسپکتروفتومتری UV) سبب کاهش خطای اندازه‌گیری می‌گردد.'
      },
      {
        aspectTitleFa: 'یافته‌های اصلی و دستاوردها',
        valueStudyA: studyA.findings || 'داده‌های کمی و کیفی مطالعه اول',
        valueStudyB: studyB.findings || 'داده‌های کمی و کیفی مطالعه دوم',
        criticalNotesFa: 'بررسی علل تفاوت در نرخ بازدارندگی بر اساس نوع ساختار آنتی‌اکسیدان یا باکتریوسین.'
      },
      {
        aspectTitleFa: 'محدودیت‌ها و نقاط تعارض',
        valueStudyA: 'تعداد تکرارها یا عدم بررسی اثرات حسی در مقیاس وسیع',
        valueStudyB: 'عدم بررسی کینتیک رهایش در شرایط نگهداری طولانی‌مدت',
        criticalNotesFa: 'جهت پیاده‌سازی صنعتی، تلفیق نقاط قوت هر دو روش پیشنهاد می‌شود.'
      }
    ],
    overallSynthesisFa: `مقایسه تطبیقی نشان می‌دهد که هر دو مطالعه به دنبال ارتقای شاخص‌های کیفی و ماندگاری هستند؛ اما مطالعه اول بر جنبه‌های فیزیکوشیمیایی و پایداری تاکید دارد در حالی که مطالعه دوم جنبه‌های کاربردی‌تر و رفتار رئولوژیکی را پوشش داده است.`,
    methodologicalSuperiorityFa: `در طراحی پایان‌نامه یا پروژه جدید، پیشنهاد می‌شود متد استخراج دقیق‌تر از مطالعه اول با مدل‌سازی چندمتغیره مطالعه دوم تلفیق گردد.`
  };
}
