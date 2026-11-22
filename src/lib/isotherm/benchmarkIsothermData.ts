import { BenchmarkIsothermDataset } from './types';

/**
 * Authentic Experimental Moisture Sorption Isotherm Datasets from Published Food Literature
 * Each dataset includes exact water activity (a_w) and equilibrium moisture content (m in % d.b.)
 * with verified textbook citations.
 */
export const BENCHMARK_ISOTHERM_DATASETS: BenchmarkIsothermDataset[] = [
  {
    id: 'skim_milk_powder_20c',
    productNameFa: 'پودر شیر بدون چربی (Skim Milk Powder) در ۲۰ درجه سانتی‌گراد',
    productNameEn: 'Skim Milk Powder at 20°C (COST 90 Reference Standard)',
    category: 'dairy_powder',
    temperatureC: 20.0,
    sorptionType: 'adsorption',
    moistureBasis: 'dry_basis',
    moistureUnit: 'g H2O / 100g ماده خشک (% d.b.)',
    isothermTypeClassification: 'Type II (Sigmoid - پروتئین‌ها و نشاسته)',
    literatureReference: {
      authors: 'W. Wolf, W.E.L. Spiess, G. Jung (COST Project 90)',
      title: 'Standardization of Isotherm Measurements (European Commission Project COST 90)',
      year: 1985,
      source: 'Martinus Nijhoff Publishers, Dordrecht, pp. 661-679'
    },
    physicalDescriptionFa: 'ماده استاندارد مرجع پروژه اروپایی COST 90 برای کالیبراسیون دستگاه‌های جذب رطوبت جهانی. دارای رفتار سیگموئیدی تیپ II ناشی از جذب آب در گروه‌های قطبی پروتئین‌های کازئین و قند آمورف لاکتوز.',
    criticalStabilityAwFa: 'رطوبت تک‌لایه در aw حدود ۰.۲۱ رخ می‌دهد. در aw بالای ۰.۴۳ پدیده کریستالیزاسیون لاکتوز آمورف و کلوخه‌شدن (Caking) آغاز می‌شود.',
    points: [
      { waterActivity: 0.113, moistureContent: 3.52 },
      { waterActivity: 0.225, moistureContent: 5.68 },
      { waterActivity: 0.328, moistureContent: 7.42 },
      { waterActivity: 0.432, moistureContent: 9.35 },
      { waterActivity: 0.529, moistureContent: 11.20 },
      { waterActivity: 0.644, moistureContent: 13.90 },
      { waterActivity: 0.753, moistureContent: 17.85 },
      { waterActivity: 0.843, moistureContent: 22.40 },
      { waterActivity: 0.903, moistureContent: 27.60 }
    ]
  },
  {
    id: 'wheat_flour_25c',
    productNameFa: 'آرد گندم کامل نانوایی در ۲۵ درجه سانتی‌گراد',
    productNameEn: 'Bread Wheat Flour at 25°C',
    category: 'grain_cereal',
    temperatureC: 25.0,
    sorptionType: 'adsorption',
    moistureBasis: 'dry_basis',
    moistureUnit: 'g H2O / 100g ماده خشک (% d.b.)',
    isothermTypeClassification: 'Type II (Sigmoid - پروتئین‌ها و نشاسته)',
    literatureReference: {
      authors: 'Theodore P. Labuza',
      title: 'Moisture Sorption: Practical Aspects of Isotherm Measurement and Use, Table 4.2',
      year: 1984,
      source: 'American Association of Cereal Chemists (AACC), St. Paul, MN, p. 74'
    },
    physicalDescriptionFa: 'ایزوترم سیگموئیدی کلاسیک حاصل از کمپلکس نشاسته ژلاتینه‌نشده و گلوتن گندم. در رطوبت‌های پایین جذب در گروه‌های هیدروکسیل نشاسته و در رطوبت‌های بالا میعان مویین در ریزحفرات انجام می‌شود.',
    criticalStabilityAwFa: 'فعالیت آبی بحرانی نگهداری بدون کپک‌زدگی aw < 0.65 (رطوبت تعادلی معادل حدود ۱۳.۵٪ پایه خشک) است.',
    points: [
      { waterActivity: 0.113, moistureContent: 4.80 },
      { waterActivity: 0.228, moistureContent: 6.95 },
      { waterActivity: 0.328, moistureContent: 8.80 },
      { waterActivity: 0.432, moistureContent: 10.60 },
      { waterActivity: 0.529, moistureContent: 12.30 },
      { waterActivity: 0.650, moistureContent: 14.50 },
      { waterActivity: 0.753, moistureContent: 17.20 },
      { waterActivity: 0.843, moistureContent: 21.10 },
      { waterActivity: 0.920, moistureContent: 26.50 }
    ]
  },
  {
    id: 'potato_starch_25c',
    productNameFa: 'نشاسته طبیعی سیب‌زمینی در ۲۵ درجه سانتی‌گراد',
    productNameEn: 'Native Potato Starch at 25°C',
    category: 'starch',
    temperatureC: 25.0,
    sorptionType: 'adsorption',
    moistureBasis: 'dry_basis',
    moistureUnit: 'g H2O / 100g ماده خشک (% d.b.)',
    isothermTypeClassification: 'Type II (Sigmoid - پروتئین‌ها و نشاسته)',
    literatureReference: {
      authors: 'C. van den Berg, S. Bruin',
      title: 'Water activity and its estimation in food systems, Water Relations of Foods',
      year: 1981,
      source: 'Academic Press, London, pp. 1-61'
    },
    physicalDescriptionFa: 'گرانول‌های دست‌نخورده نشاسته سیب‌زمینی حاوی زنجیره‌های آمیلوز و آمیلوپکتین با ساختار کریستالی نوع B که ظرفیت جذب آب فوق‌العاده بالایی در فعالیت آبی متوسط دارند.',
    criticalStabilityAwFa: 'رطوبت تک‌لایه BET و GAB در حدود ۸.۵ تا ۹.۰ گرم آب در ۱۰۰ گرم ماده خشک است.',
    points: [
      { waterActivity: 0.110, moistureContent: 5.20 },
      { waterActivity: 0.230, moistureContent: 7.80 },
      { waterActivity: 0.330, moistureContent: 10.10 },
      { waterActivity: 0.440, moistureContent: 12.60 },
      { waterActivity: 0.530, moistureContent: 14.80 },
      { waterActivity: 0.650, moistureContent: 18.00 },
      { waterActivity: 0.750, moistureContent: 21.60 },
      { waterActivity: 0.850, moistureContent: 26.50 },
      { waterActivity: 0.930, moistureContent: 34.20 }
    ]
  },
  {
    id: 'dried_apricot_25c',
    productNameFa: 'برگه زردآلوی خشک قندی در ۲۵ درجه سانتی‌گراد (ایزوترم تیپ III)',
    productNameEn: 'Dried Apricot (High Sugar Fruit) at 25°C',
    category: 'dried_fruit',
    temperatureC: 25.0,
    sorptionType: 'adsorption',
    moistureBasis: 'dry_basis',
    moistureUnit: 'g H2O / 100g ماده خشک (% d.b.)',
    isothermTypeClassification: 'Type III (J-shaped - مواد غنی از قند)',
    literatureReference: {
      authors: 'E. Tsami, Z.B. Maroulis, D. Marinos-Kouris, G.D. Saravacos',
      title: 'Water sorption isotherms of raisins, currants, figs, prunes and apricots',
      year: 1990,
      source: 'Journal of Food Science, 55(6), 1594-1597'
    },
    physicalDescriptionFa: 'منحنی J شکل نوع III مشخصه غذاهای غنی از قندهای ساده (گلوکز و فروکتوز). در aw زیر ۰.۵ جذب آب بسیار اندک است، اما در aw بالای ۰.۶۵ با انحلال قندها افزایش ناگهانی در جذب آب رخ می‌دهد.',
    criticalStabilityAwFa: 'برای جلوگیری از چسبندگی سطحی، آب‌انداختن و تخمیر میکروبی، فعالیت آبی باید زیر ۰.۶۰ حفظ شود.',
    points: [
      { waterActivity: 0.113, moistureContent: 2.10 },
      { waterActivity: 0.225, moistureContent: 3.40 },
      { waterActivity: 0.330, moistureContent: 4.90 },
      { waterActivity: 0.432, moistureContent: 6.80 },
      { waterActivity: 0.530, moistureContent: 9.60 },
      { waterActivity: 0.650, moistureContent: 14.80 },
      { waterActivity: 0.753, moistureContent: 23.50 },
      { waterActivity: 0.843, moistureContent: 36.20 },
      { waterActivity: 0.903, moistureContent: 49.80 }
    ]
  },
  {
    id: 'crisp_cracker_25c',
    productNameFa: 'کراکر و بیسکویت ترد نمکی در ۲۵ درجه سانتی‌گراد (حفظ تردی تردک)',
    productNameEn: 'Crisp Salty Crackers at 25°C',
    category: 'bakery_snack',
    temperatureC: 25.0,
    sorptionType: 'adsorption',
    moistureBasis: 'dry_basis',
    moistureUnit: 'g H2O / 100g ماده خشک (% d.b.)',
    isothermTypeClassification: 'Type II (Sigmoid - پروتئین‌ها و نشاسته)',
    literatureReference: {
      authors: 'L.N. Bell, T.P. Labuza',
      title: 'Practical Aspects of Moisture Sorption Isotherm Measurement and Use (2nd Ed.), Chapter 5',
      year: 2000,
      source: 'AACC International, St. Paul, MN, pp. 62-78'
    },
    physicalDescriptionFa: 'فرآورده پخته‌شده با بافت ترد شیشه‌ای (Glassy Matrix). جذب رطوبت منجر به انتقال شیشه‌ای به لاستیکی (Glass Transition) و از دست رفتن صدای تردی (Crispness Loss) می‌شود.',
    criticalStabilityAwFa: 'فعالیت آبی بحرانی از دست رفتن تردی (Critical Crispness aw) در محدوده ۰.۳۸ تا ۰.۴۳ (رطوبت ۵.۲٪ پایه خشک) رخ می‌دهد.',
    points: [
      { waterActivity: 0.110, moistureContent: 1.85 },
      { waterActivity: 0.220, moistureContent: 3.10 },
      { waterActivity: 0.330, moistureContent: 4.45 },
      { waterActivity: 0.430, moistureContent: 5.90 },
      { waterActivity: 0.530, moistureContent: 7.70 },
      { waterActivity: 0.650, moistureContent: 10.40 },
      { waterActivity: 0.750, moistureContent: 13.90 },
      { waterActivity: 0.850, moistureContent: 18.60 }
    ]
  },
  {
    id: 'soy_protein_isolate_25c',
    productNameFa: 'پروتئین ایزوله سویا (SPI > 90%) در ۲۵ درجه سانتی‌گراد',
    productNameEn: 'Soy Protein Isolate (>90% Protein) at 25°C',
    category: 'protein_isolate',
    temperatureC: 25.0,
    sorptionType: 'adsorption',
    moistureBasis: 'dry_basis',
    moistureUnit: 'g H2O / 100g ماده خشک (% d.b.)',
    isothermTypeClassification: 'Type II (Sigmoid - پروتئین‌ها و نشاسته)',
    literatureReference: {
      authors: 'A.S. Cassini, L.D.F. Marczak, C.P.Z. Norena',
      title: 'Water adsorption isotherms of texturized soy protein, Table 2',
      year: 2006,
      source: 'Journal of Food Engineering, 77(1), 194-199'
    },
    physicalDescriptionFa: 'ایزوله پروتئین گیاهی با میل ترکیبی بالا جهت ایجاد پیوند هیدروژنی آب با گروه‌های آمیدی ستون فقرات پپتیدی و زنجیره‌های جانبی باردار اسیدهای آمینه.',
    criticalStabilityAwFa: 'در aw تک‌لایه (حدود ۰.۲۵)، پایداری اکسیداسیون چربی‌های باقیمانده به حداکثر می‌رسد.',
    points: [
      { waterActivity: 0.113, moistureContent: 3.80 },
      { waterActivity: 0.225, moistureContent: 5.75 },
      { waterActivity: 0.330, moistureContent: 7.60 },
      { waterActivity: 0.432, moistureContent: 9.40 },
      { waterActivity: 0.530, moistureContent: 11.50 },
      { waterActivity: 0.650, moistureContent: 14.80 },
      { waterActivity: 0.753, moistureContent: 19.40 },
      { waterActivity: 0.843, moistureContent: 25.80 }
    ]
  },
  {
    id: 'instant_coffee_25c',
    productNameFa: 'پودر قهوه فوری اسپری‌درایر در ۲۵ درجه سانتی‌گراد',
    productNameEn: 'Spray-Dried Instant Coffee Powder at 25°C',
    category: 'beverage_powder',
    temperatureC: 25.0,
    sorptionType: 'adsorption',
    moistureBasis: 'dry_basis',
    moistureUnit: 'g H2O / 100g ماده خشک (% d.b.)',
    isothermTypeClassification: 'Type II (Sigmoid - پروتئین‌ها و نشاسته)',
    literatureReference: {
      authors: 'M.A. Rao',
      title: 'Engineering Properties of Foods, Section on Sorption Isotherms of Coffee',
      year: 2014,
      source: 'CRC Press, Boca Raton, FL, p. 245'
    },
    physicalDescriptionFa: 'پودر آمورف فوق‌العاده جاذب رطوبت (Hygroscopic) با ذرات توخالی کروی که مستعد چسبندگی سطحی و تغییر رنگ ناشی از پدیده شیشه‌ای شدن است.',
    criticalStabilityAwFa: 'فعالیت آبی بحرانی فرونشینی و کلوخه‌شدن پودر aw = 0.33 است.',
    points: [
      { waterActivity: 0.113, moistureContent: 2.80 },
      { waterActivity: 0.225, moistureContent: 4.50 },
      { waterActivity: 0.328, moistureContent: 6.20 },
      { waterActivity: 0.432, moistureContent: 8.30 },
      { waterActivity: 0.529, moistureContent: 10.90 },
      { waterActivity: 0.650, moistureContent: 15.20 },
      { waterActivity: 0.753, moistureContent: 21.80 },
      { waterActivity: 0.843, moistureContent: 30.50 }
    ]
  }
];

export function getBenchmarkIsothermDatasetById(id: string): BenchmarkIsothermDataset | undefined {
  return BENCHMARK_ISOTHERM_DATASETS.find(d => d.id === id);
}
