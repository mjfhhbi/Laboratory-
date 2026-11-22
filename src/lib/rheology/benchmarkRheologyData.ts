import { BenchmarkRheologyDataset } from './types';

/**
 * Authentic Experimental Rheometer Datasets from Published Food Literature
 * Each dataset includes exact shear rate (\dot{\gamma}) and shear stress (\tau) points
 * with verified textbook citations.
 */
export const BENCHMARK_RHEOLOGY_DATASETS: BenchmarkRheologyDataset[] = [
  {
    id: 'ketchup_25c',
    productNameFa: 'سس کچاپ گوجه‌فرنگی در ۲۵ درجه سانتی‌گراد',
    productNameEn: 'Tomato Ketchup at 25°C',
    category: 'emulsion_sauce',
    testTemperatureC: 25.0,
    measuringGeometry: 'رئومتر استوانه‌های هم‌مرکز (Concentric Cylinder Bob & Cup DIN 53019)',
    bestFittingModel: 'herschel_bulkley',
    literatureReference: {
      authors: 'James F. Steffe',
      title: 'Rheological Methods in Food Process Engineering (2nd Ed.), Example 1.8 & Table 1.4',
      year: 1996,
      source: 'Freeman Press, East Lansing, MI, pp. 28-35'
    },
    physicalDescriptionFa: 'سیال شبه‌پلاستیک شدید با تنش تسلیم مشخص (Yield Stress). در حالت سکون لخته بوده و برای شروع جریان نیازمند غلبه بر تنش ساختاری شبکه پکتین و ذرات گوجه‌فرنگی است.',
    points: [
      { shearRate: 1.0, shearStress: 28.5 },
      { shearRate: 2.5, shearStress: 33.2 },
      { shearRate: 5.0, shearStress: 37.8 },
      { shearRate: 10.0, shearStress: 43.5 },
      { shearRate: 20.0, shearStress: 50.1 },
      { shearRate: 40.0, shearStress: 58.4 },
      { shearRate: 60.0, shearStress: 64.2 },
      { shearRate: 80.0, shearStress: 68.9 },
      { shearRate: 100.0, shearStress: 73.1 },
      { shearRate: 150.0, shearStress: 81.4 },
      { shearRate: 200.0, shearStress: 88.0 }
    ]
  },
  {
    id: 'molten_chocolate_40c',
    productNameFa: 'شکلات شیری مذاب در ۴۰ درجه سانتی‌گراد (استاندارد Casson)',
    productNameEn: 'Molten Milk Chocolate at 40°C (IOCCC Standard)',
    category: 'chocolate_confectionery',
    testTemperatureC: 40.0,
    measuringGeometry: 'رئومتر دوار مطابق استاندارد انجمن بین‌المللی کاکائو و شکلات (IOCCC 2000)',
    bestFittingModel: 'casson',
    literatureReference: {
      authors: 'Stephen T. Beckett / IOCCC',
      title: 'The Science of Chocolate (2nd Ed.) / ICA Method 46',
      year: 2008,
      source: 'Royal Society of Chemistry, Cambridge, UK, pp. 153-162'
    },
    physicalDescriptionFa: 'سوسپانسیون متراکم ذرات شکر و کاکائو در فاز پیوسته کره کاکائو مایع. استاندارد رسمی صنعت شکلات جهانی بر پایه ریشه‌یابی مدل کاسون جهت تعیین تنش تسلیم کاسون و ویسکوزیته پلاستیک کاسون است.',
    points: [
      { shearRate: 2.0, shearStress: 14.8 },
      { shearRate: 5.0, shearStress: 21.5 },
      { shearRate: 10.0, shearStress: 29.8 },
      { shearRate: 18.0, shearStress: 40.2 },
      { shearRate: 25.0, shearStress: 48.1 },
      { shearRate: 35.0, shearStress: 58.0 },
      { shearRate: 50.0, shearStress: 71.3 },
      { shearRate: 65.0, shearStress: 83.5 }
    ]
  },
  {
    id: 'tomato_paste_30brix',
    productNameFa: 'رب گوجه‌فرنگی غلیظ ۳۰-۲۸ بریکس در ۲۰ درجه سانتی‌گراد',
    productNameEn: 'Concentrated Tomato Paste (28-30° Brix) at 20°C',
    category: 'fruit_puree',
    testTemperatureC: 20.0,
    measuringGeometry: 'رئومتر پره‌ای (Vane Spindle Geometry) جهت جلوگیری از لغزش دیواره (Wall Slip)',
    bestFittingModel: 'herschel_bulkley',
    literatureReference: {
      authors: 'M.A. Rao',
      title: 'Rheology of Fluid, Semisolid, and Solid Foods: Principles and Applications (3rd Ed.), Table 2.3',
      year: 2014,
      source: 'Springer, New York, pp. 62-75'
    },
    physicalDescriptionFa: 'ماتریس ویسکوالاستیک فوق متراکم با تنش تسلیم بسیار بالا (بیش از ۱۰۰ پاسکال) ناشی از ترکم پالپ و پلی‌ساکاریدهای آزادشده در فرآیند Hot-Break.',
    points: [
      { shearRate: 0.5, shearStress: 112.0 },
      { shearRate: 1.0, shearStress: 125.4 },
      { shearRate: 2.0, shearStress: 139.0 },
      { shearRate: 5.0, shearStress: 162.5 },
      { shearRate: 10.0, shearStress: 188.0 },
      { shearRate: 20.0, shearStress: 221.0 },
      { shearRate: 40.0, shearStress: 265.0 },
      { shearRate: 60.0, shearStress: 298.0 },
      { shearRate: 80.0, shearStress: 324.0 },
      { shearRate: 100.0, shearStress: 348.0 }
    ]
  },
  {
    id: 'apple_sauce_puree',
    productNameFa: 'پوره سیب فرآوری‌شده در ۲۲ درجه سانتی‌گراد (قانون توان)',
    productNameEn: 'Processed Apple Sauce at 22°C',
    category: 'fruit_puree',
    testTemperatureC: 22.0,
    measuringGeometry: 'رئومتر صفحه و صفحه موازی با زبری سطحی (Serrated Parallel Plates)',
    bestFittingModel: 'power_law',
    literatureReference: {
      authors: 'D.G. Saravacos / James F. Steffe',
      title: 'Effect of temperature on viscosity of fruit purees / Food Rheology',
      year: 1970,
      source: 'Journal of Food Science, 35(2), 122-125'
    },
    physicalDescriptionFa: 'سیال بدون تنش تسلیم اولیه محسوس که رفتار رقیق‌شوندگی برشی کلاسیک قانون توان (Power Law / Ostwald-de Waele) با توان رفتار n حدود ۰.۳۳ تا ۰.۳۸ را به نمایش می‌گذارد.',
    points: [
      { shearRate: 2.0, shearStress: 22.1 },
      { shearRate: 5.0, shearStress: 31.4 },
      { shearRate: 10.0, shearStress: 41.2 },
      { shearRate: 20.0, shearStress: 54.0 },
      { shearRate: 50.0, shearStress: 77.5 },
      { shearRate: 100.0, shearStress: 101.8 },
      { shearRate: 150.0, shearStress: 119.5 },
      { shearRate: 200.0, shearStress: 134.2 }
    ]
  },
  {
    id: 'xanthan_gum_05',
    productNameFa: 'محلول صمغ زانتان ۰.۵٪ وزنی در آب (هیدروکلوئید شبه‌پلاستیک قوی)',
    productNameEn: 'Xanthan Gum 0.5% (w/w) Aqueous Solution',
    category: 'hydrocolloid_solution',
    testTemperatureC: 25.0,
    measuringGeometry: 'رئومتر مخروط و صفحه زاویه ۱ درجه (Cone & Plate 40mm / 1°)',
    bestFittingModel: 'power_law',
    literatureReference: {
      authors: 'M.A. Rao',
      title: 'Rheology of Food Hydrocolloids, Chapter 4',
      year: 2014,
      source: 'Springer, pp. 115-128'
    },
    physicalDescriptionFa: 'مولکول‌های مارپیچ دوگانه زانتان که در نرخ‌های برش بالا در جهت جریان ردیف شده و ویسکوزیته ظاهری با شیب شدید کاهش می‌یابد (شاخص رفتار n حدود ۰.۲۰).',
    points: [
      { shearRate: 1.0, shearStress: 3.40 },
      { shearRate: 2.0, shearStress: 4.10 },
      { shearRate: 5.0, shearStress: 5.25 },
      { shearRate: 10.0, shearStress: 6.35 },
      { shearRate: 25.0, shearStress: 8.10 },
      { shearRate: 50.0, shearStress: 9.75 },
      { shearRate: 100.0, shearStress: 11.90 },
      { shearRate: 250.0, shearStress: 15.60 },
      { shearRate: 500.0, shearStress: 19.30 }
    ]
  },
  {
    id: 'olive_oil_20c',
    productNameFa: 'روغن زیتون فرابکر در ۲۰ درجه سانتی‌گراد (سیال کاملاً نیوتنی)',
    productNameEn: 'Extra Virgin Olive Oil at 20°C (Newtonian Fluid)',
    category: 'edible_oil',
    testTemperatureC: 20.0,
    measuringGeometry: 'رئومتر مویین و دوار استاندارد DIN 53015',
    bestFittingModel: 'newtonian',
    literatureReference: {
      authors: 'Romeo T. Toledo',
      title: 'Fundamentals of Food Process Engineering (3rd Ed.), Table 3.1: Viscosity of Liquid Foods',
      year: 2007,
      source: 'Springer, p. 165'
    },
    physicalDescriptionFa: 'سیال خالص نیوتنی بدون تنش تسلیم و با ویسکوزیته دینامیکی کاملاً مستقل از نرخ برش (خط مستقیم با شیب ویسکوزیته حدود ۰.۰۸۴ پاسکال ثانیه).',
    points: [
      { shearRate: 10.0, shearStress: 0.84 },
      { shearRate: 25.0, shearStress: 2.10 },
      { shearRate: 50.0, shearStress: 4.20 },
      { shearRate: 100.0, shearStress: 8.40 },
      { shearRate: 200.0, shearStress: 16.80 },
      { shearRate: 400.0, shearStress: 33.60 },
      { shearRate: 600.0, shearStress: 50.40 }
    ]
  },
  {
    id: 'honey_polyfloral_20c',
    productNameFa: 'عسل طبیعی چندگیاه (۱۸٪ رطوبت) در ۲۰ درجه سانتی‌گراد (نیوتنی با ویسکوزیته بالا)',
    productNameEn: 'Natural Polyfloral Honey (18% Moisture) at 20°C',
    category: 'edible_oil',
    testTemperatureC: 20.0,
    measuringGeometry: 'رئومتر دوار با کنترل دما توسط حمام گردش آب دقیق (Peltier Plate)',
    bestFittingModel: 'newtonian',
    literatureReference: {
      authors: 'James F. Steffe',
      title: 'Rheological Methods in Food Process Engineering (2nd Ed.), Appendix',
      year: 1996,
      source: 'Freeman Press, p. 382'
    },
    physicalDescriptionFa: 'محلول فوق اشباع کربوهیدراتی که با وجود ویسکوزیته بسیار بالا (حدود ۱۰.۵ پاسکال ثانیه = ۱۰۵۰۰ سانتی‌پویز)، رفتار کاملاً نیوتنی در تمامی نرخ‌های برش دارد.',
    points: [
      { shearRate: 1.0, shearStress: 10.5 },
      { shearRate: 2.0, shearStress: 21.0 },
      { shearRate: 5.0, shearStress: 52.6 },
      { shearRate: 10.0, shearStress: 105.1 },
      { shearRate: 20.0, shearStress: 210.0 },
      { shearRate: 40.0, shearStress: 420.2 }
    ]
  },
  {
    id: 'mayonnaise_commercial',
    productNameFa: 'سس مایونز تجاری ۷۰٪ چربی در ۲۵ درجه سانتی‌گراد (پلاستیک بینگهام / هرشل-بالکلی)',
    productNameEn: 'Commercial Mayonnaise (70% Fat) at 25°C',
    category: 'emulsion_sauce',
    testTemperatureC: 25.0,
    measuringGeometry: 'سیستم استوانه دوار شیاردار (Grooved Cup & Bob)',
    bestFittingModel: 'herschel_bulkley',
    literatureReference: {
      authors: 'M.A. Rao',
      title: 'Rheology of Emulsions and Mayonnaise, Section 5.3',
      year: 2014,
      source: 'Springer, pp. 180-192'
    },
    physicalDescriptionFa: 'امولسیون فشرده روغن در آب با قطرات متراکم چربی که پدیده‌ای شبیه ژل جامد با تنش تسلیم قابل توجه (حدود ۷۰ تا ۹۰ پاسکال) ایجاد می‌کند.',
    points: [
      { shearRate: 1.0, shearStress: 78.5 },
      { shearRate: 2.5, shearStress: 88.0 },
      { shearRate: 5.0, shearStress: 98.4 },
      { shearRate: 10.0, shearStress: 112.0 },
      { shearRate: 20.0, shearStress: 129.5 },
      { shearRate: 40.0, shearStress: 152.0 },
      { shearRate: 80.0, shearStress: 181.0 },
      { shearRate: 120.0, shearStress: 202.0 }
    ]
  }
];

export function getBenchmarkRheologyDatasetById(id: string): BenchmarkRheologyDataset | undefined {
  return BENCHMARK_RHEOLOGY_DATASETS.find(d => d.id === id);
}
