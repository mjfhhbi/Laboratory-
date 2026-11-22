import { ReferenceMicroorganism, ThermalPenetrationProfile } from './types';

/**
 * Authentic Benchmark Microorganisms with Published Thermal Resistance Data
 * All D and z values are strictly cited from authoritative peer-reviewed texts:
 * - Toledo (2007)
 * - Stumbo (1973)
 * - Pflug (2003)
 * - ICMSF (1996)
 * - USDA FSIS / FDA BAM
 */
export const BENCHMARK_MICROORGANISMS: ReferenceMicroorganism[] = [
  {
    id: 'c_botulinum',
    nameScientific: 'Clostridium botulinum (Proteolytic Type A & B spores)',
    nameFa: 'کلستریدیوم بوتولینوم (اسپورهای پروتئولیتیک تیپ A و B)',
    targetFoodOrMatrix: 'کنسروهای کم‌اسید (pH > 4.6 و aw > 0.85) نظیر گوشت، تن ماهی، ذرت و نخودفرنگی',
    riskCategory: 'pathogen_spore',
    referenceTemperatureC: 121.1,
    dValueRefMin: 0.10,
    dValueRefMax: 0.25,
    dValueRefNominal: 0.21,
    zValueNominal: 10.0,
    recommendedLogReduction: 12.0, // 12D Botulinum Cook
    citation: {
      authors: 'Romeo T. Toledo / C.R. Stumbo',
      title: 'Fundamentals of Food Process Engineering / Thermobacteriology in Food Processing',
      year: 2007,
      source: 'Springer / Academic Press, Table 7.1 & Chapter 7'
    },
    notesFa: 'مبنای قانونی استاندارد جهانی فرآوری حرارتی کنسروهای کم‌اسید (12D Cook). حداقل کشندگی حرارتی لازم F0 = 12 × 0.21 = 2.52 دقیقه در نقطه سرد قوطی.'
  },
  {
    id: 'g_stearothermophilus',
    nameScientific: 'Geobacillus stearothermophilus (FS 1518 / ATCC 7953)',
    nameFa: 'ژئوباسیلوس استئاروترموفیلوس (عامل فساد ترش مسطح Flat-Sour)',
    targetFoodOrMatrix: 'کنسروهای کم‌اسید نگهداری‌شده در مناطق گرمسیری، فرآیندهای استریلیزاسیون تجاری',
    riskCategory: 'spoilage_thermophile',
    referenceTemperatureC: 121.1,
    dValueRefMin: 3.0,
    dValueRefMax: 5.0,
    dValueRefNominal: 4.0,
    zValueNominal: 10.0,
    recommendedLogReduction: 5.0, // 5D Spoilage Reduction
    citation: {
      authors: 'I.J. Pflug / FDA BAM',
      title: 'Microbiology and Engineering of Sterilization Processes',
      year: 2003,
      source: 'Pflug Publishing / FDA Bacteriological Analytical Manual'
    },
    notesFa: 'مقاوم‌ترین اسپور گرماگرای غیربیماری‌زا؛ شاخص بیولوژیکی ارزیابی کارایی اتوکلاو و خطوط صنعتی استریلیزاسیون.'
  },
  {
    id: 'b_sporothermodurans',
    nameScientific: 'Bacillus sporothermodurans',
    nameFa: 'باسیلوس اسپوروترمودورانس (اسپورهای فوق مقاوم در فرآیند UHT)',
    targetFoodOrMatrix: 'شیر و فرآورده‌های لبنی فرادما (UHT Milk)',
    riskCategory: 'spoilage_thermophile',
    referenceTemperatureC: 121.1,
    dValueRefMin: 0.6,
    dValueRefMax: 1.0,
    dValueRefNominal: 0.8,
    zValueNominal: 13.1,
    recommendedLogReduction: 8.0,
    citation: {
      authors: 'Huemer, I.A., Klijn, N., Vogelsang, H.W., Langeveld, L.P.',
      title: 'Thermal death kinetics of spores of Bacillus sporothermodurans isolated from UHT milk',
      year: 1998,
      source: 'International Dairy Journal, 8(10), 851-855'
    },
    notesFa: 'عامل آلودگی اسپور بدون تولید گاز در شیرهای استریل تجاری؛ دارای z-value بالاتر از حد معمول به علت مقاومت غشایی.'
  },
  {
    id: 'b_cereus',
    nameScientific: 'Bacillus cereus (Mesophilic / Psychrotrophic spores)',
    nameFa: 'باسیلوس سرئوس (اسپورهای مزوفیل بیماری‌زا)',
    targetFoodOrMatrix: 'فرآورده‌های برنج، غلات، سوپ‌ها و شیر پاستوریزه فرآوری‌شده',
    riskCategory: 'pathogen_spore',
    referenceTemperatureC: 100.0,
    dValueRefMin: 2.5,
    dValueRefMax: 3.2,
    dValueRefNominal: 2.8,
    zValueNominal: 9.7,
    recommendedLogReduction: 6.0,
    citation: {
      authors: 'ICMSF',
      title: 'Microorganisms in Foods 5: Characteristics of Microbial Pathogens',
      year: 1996,
      source: 'Blackie Academic & Professional, London, pp. 20-35'
    },
    notesFa: 'در دمای ۱۲۱.۱ درجه سانتی‌گراد D برابر با ۰.۰۳ دقیقه است. پاستوریزاسیون معمولی اسپور آن را از بین نمی‌برد و نگهداری زنجیره سرد الزامی است.'
  },
  {
    id: 'l_monocytogenes',
    nameScientific: 'Listeria monocytogenes (Scott A / EGD)',
    nameFa: 'لیستریا مونوسیتوژنز (سلول رویشی مقاوم به سرما)',
    targetFoodOrMatrix: 'شیر پاستوریزه، پنیرهای نرم، فرآورده‌های گوشتی آماده مصرف (RTE Meats)',
    riskCategory: 'pathogen_vegetative',
    referenceTemperatureC: 60.0,
    dValueRefMin: 4.0,
    dValueRefMax: 5.2,
    dValueRefNominal: 4.5,
    zValueNominal: 6.8,
    recommendedLogReduction: 6.0, // 6D Pasteurization target
    citation: {
      authors: 'Doyle, M.P., Beuchat, L.R., & Montville, T.J.',
      title: 'Food Microbiology: Fundamentals and Frontiers (2nd Ed.)',
      year: 2001,
      source: 'ASM Press, Washington, D.C.'
    },
    notesFa: 'در دمای ۷۱.۷ درجه سانتی‌گراد (پاستوریزاسیون مداوم شیر)، زمان D حدود ۰.۹ تا ۱.۵ ثانیه بوده و فرآیند ۱۵ ثانیه بیش از ۱۰ لگاریتم کاهش می‌دهد.'
  },
  {
    id: 's_enterica',
    nameScientific: 'Salmonella enterica (Serovar Typhimurium & Enteritidis)',
    nameFa: 'سالمونلا انتریکا (پاتوژن روده‌ای رویشی)',
    targetFoodOrMatrix: 'تخم‌مرغ مایع، مرغ و طیور، پودر کاکائو، آبمیوه‌ها',
    riskCategory: 'pathogen_vegetative',
    referenceTemperatureC: 60.0,
    dValueRefMin: 1.2,
    dValueRefMax: 2.4,
    dValueRefNominal: 1.8,
    zValueNominal: 5.6,
    recommendedLogReduction: 7.0, // 7D in USDA FSIS egg pasteurization
    citation: {
      authors: 'USDA Food Safety and Inspection Service (FSIS)',
      title: 'Time-Temperature Tables for Cooking Ready-to-Eat Poultry Products',
      year: 2021,
      source: 'USDA FSIS Guideline on Thermal Processing'
    },
    notesFa: 'مبنای دستورالعمل‌های کنترل پاستوریزاسیون محصولات گوشتی و تخم‌مرغ خوراکی مطابق مقررات USDA.'
  },
  {
    id: 'e_coli_o157',
    nameScientific: 'Escherichia coli O157:H7 (Enterohemorrhagic EHEC)',
    nameFa: 'اشریشیا کلی O157:H7 (پاتوژن تولیدکننده سم شیگا)',
    targetFoodOrMatrix: 'آب سیب، آب مرکبات تازه، گوشت چرخ‌کرده، لبنیات خام',
    riskCategory: 'pathogen_vegetative',
    referenceTemperatureC: 60.0,
    dValueRefMin: 0.40,
    dValueRefMax: 0.60,
    dValueRefNominal: 0.50,
    zValueNominal: 5.0,
    recommendedLogReduction: 5.0, // FDA 5-log rule for fruit juices
    citation: {
      authors: 'US FDA CFSAN',
      title: 'Guidance for Industry: Juice HACCP Hazards and Controls (1st Ed.)',
      year: 2004,
      source: 'FDA Center for Food Safety and Applied Nutrition'
    },
    notesFa: 'مبنای قانون الزام کاهش ۵ لگاریتمی (5-log performance standard) در خطوط آبمیوه صنعتی طبق استاندارد FDA HACCP.'
  },
  {
    id: 'a_acidoterrestris',
    nameScientific: 'Alicyclobacillus acidoterrestris (Spores in acid foods)',
    nameFa: 'آلیسیکلوباسیلوس اسیدوترستریس (اسپورهای مقاوم اسیددوست)',
    targetFoodOrMatrix: 'کنسانتره و آبمیوه‌های اسیدی (pH < 4.0) نظیر سیب، پرتقال و گوجه‌فرنگی',
    riskCategory: 'spoilage_thermophile',
    referenceTemperatureC: 95.0,
    dValueRefMin: 2.4,
    dValueRefMax: 3.8,
    dValueRefNominal: 2.8,
    zValueNominal: 8.5,
    recommendedLogReduction: 5.0,
    citation: {
      authors: 'Silva, F.V.M., Gibbs, P., & Vieira, M.C.',
      title: 'Thermal inactivation of Alicyclobacillus acidoterrestris spores under different conditions',
      year: 2004,
      source: 'International Journal of Food Microbiology, 96(3), 269-277'
    },
    notesFa: 'تولیدکننده ترکیب بدطعم گوایاکول و بروموفنول؛ در دمای پاستوریزاسیون معمولی آبمیوه (۸۵ درجه) زنده می‌ماند و نیازمند تیمار بالای ۹۵ درجه است.'
  },
  {
    id: 'peroxidase_enzyme',
    nameScientific: 'Peroxidase (Armoracia rusticana / Plant Enzyme)',
    nameFa: 'پراکسیداز (آنزیم نشانگر کفایت بلانچینگ سبزیجات)',
    targetFoodOrMatrix: 'سبزیجات کنسروی، سبزیجات منجمد، نخودسبز و ذرت',
    riskCategory: 'enzyme_indicator',
    referenceTemperatureC: 121.1,
    dValueRefMin: 1.5,
    dValueRefMax: 2.2,
    dValueRefNominal: 1.8,
    zValueNominal: 28.0, // High z-value characteristic of enzymes
    recommendedLogReduction: 2.0, // 99% enzyme inactivation
    citation: {
      authors: 'Adams, J.B.',
      title: 'Enzyme inactivation during heat treatment of foods',
      year: 1991,
      source: 'Food Chemistry, 39(1), 1-16'
    },
    notesFa: 'به دلیل مقدار z بالا (۲۸ درجه سانتی‌گراد)، در دماهای پایین مقاوم‌تر از میکروب‌ها بوده اما در دماهای بالا سریع غیرفعال می‌شود.'
  },
  {
    id: 'thiamine_vitamin_b1',
    nameScientific: 'Thiamine (Vitamin B1 Nutrient Degradation)',
    nameFa: 'تیامین (ویتامین B1 - افت ارزش تغذیه‌ای و کیفیت)',
    targetFoodOrMatrix: 'تمامی غذاهای حرارت‌دیده، حبوبات، گوشت و غلات',
    riskCategory: 'quality_nutrient',
    referenceTemperatureC: 121.1,
    dValueRefMin: 120.0,
    dValueRefMax: 180.0,
    dValueRefNominal: 150.0,
    zValueNominal: 28.5,
    recommendedLogReduction: 0.15, // Max acceptable nutrient loss ~30%
    citation: {
      authors: 'Romeo T. Toledo',
      title: 'Fundamentals of Food Process Engineering (3rd Ed.), Table 7.3',
      year: 2007,
      source: 'Springer, New York, pp. 272-276'
    },
    notesFa: 'مبنای محاسبه Cook Value (C0). تفاوت اساسی z میکروبی (۱۰ درجه) و z ویتامینی (۲۸.۵ درجه) توجیه‌کننده علمی فرآیندهای دمای بالا-زمان کوتاه (HTST) است.'
  }
];

/**
 * Authentic Thermal Penetration Profiles from Industrial Retorts and Heat Exchangers
 */
export const BENCHMARK_PENETRATION_PROFILES: ThermalPenetrationProfile[] = [
  {
    id: 'canned_puree_retort',
    titleFa: 'استریلیزاسیون کنسرو پوره نخودفرنگی در اتوکلاو بخار ایستا (Still Retort)',
    processType: 'still_retort',
    containerType: 'قوطی فلزی سایز 303x406 (نفوذ حرارت هدایتی Conduction)',
    productName: 'پوره نخودفرنگی کم‌اسید (pH 5.8)',
    targetOrganismId: 'c_botulinum',
    retortOrMediumTempC: 121.1,
    initialTempC: 38.0,
    descriptionFa: 'داده‌های حسگر ترموکوپل در نقطه سرد هندسی قوطی (فاصله ۱/۳ از کف در خط مرکزی). شامل زمان بالا آمدن بخار (CUT)، نگهداری در دمای ۱۲۱.۱ و سردسازی با آب فشرده.',
    referenceSource: 'Toledo (2007), Chapter 7: Thermal Process Calculations, Example 7.5',
    points: [
      { timeMinutes: 0.0, temperatureC: 38.0 },
      { timeMinutes: 5.0, temperatureC: 45.0 },
      { timeMinutes: 10.0, temperatureC: 62.0 },
      { timeMinutes: 15.0, temperatureC: 84.5 },
      { timeMinutes: 20.0, temperatureC: 101.0 },
      { timeMinutes: 25.0, temperatureC: 111.5 },
      { timeMinutes: 30.0, temperatureC: 116.5 },
      { timeMinutes: 35.0, temperatureC: 118.8 },
      { timeMinutes: 40.0, temperatureC: 120.2 },
      { timeMinutes: 45.0, temperatureC: 120.9 }, // Steam off, water cooling on
      { timeMinutes: 50.0, temperatureC: 119.5 },
      { timeMinutes: 55.0, temperatureC: 105.0 },
      { timeMinutes: 60.0, temperatureC: 78.0 },
      { timeMinutes: 65.0, temperatureC: 48.0 }
    ]
  },
  {
    id: 'milk_htst_plate',
    titleFa: 'پاستوریزاسیون مداوم شیر کامل در مبدل صفحه‌ای (HTST Plate Pasteurizer)',
    processType: 'htst_plate',
    containerType: 'جریان مداوم در لوله نگهدارنده (Holding Tube) با قطر ۲ اینچ',
    productName: 'شیر کامل پاستوریزه ۳.۲٪ چربی',
    targetOrganismId: 'l_monocytogenes',
    retortOrMediumTempC: 73.0,
    initialTempC: 4.0,
    descriptionFa: 'پروفایل حرارتی سریع در مقطع پیش‌گرم‌کن، گرم‌کن نهایی و لوله نگه‌دارنده ۱۵ ثانیه‌ای در ۷۲.۲ درجه سانتی‌گراد مطابق استاندارد PMO آمریکا و استاندارد ملی ایران ۲۴۰۶.',
    referenceSource: 'Singh & Heldman (2014), Introduction to Food Engineering, Example 5.12',
    points: [
      { timeMinutes: 0.0, temperatureC: 4.0 },
      { timeMinutes: 0.1, temperatureC: 35.0 },
      { timeMinutes: 0.2, temperatureC: 58.0 },
      { timeMinutes: 0.25, temperatureC: 72.5 },
      { timeMinutes: 0.35, temperatureC: 72.8 },
      { timeMinutes: 0.50, temperatureC: 72.6 }, // End of holding tube (15s = 0.25 min)
      { timeMinutes: 0.60, temperatureC: 42.0 }, // Regenerative cooling
      { timeMinutes: 0.75, temperatureC: 18.0 },
      { timeMinutes: 0.90, temperatureC: 4.0 }
    ]
  },
  {
    id: 'hot_fill_tomato_sauce',
    titleFa: 'پرکنی داغ سس گوجه‌فرنگی در بطری شیشه‌ای (Hot-Fill-Hold Tomato Purée)',
    processType: 'hot_fill',
    containerType: 'بطری شیشه‌ای ۵۰۰ میلی‌لیتری با درب فلزی (درزبندی در دمای بالا)',
    productName: 'پوره گوجه‌فرنگی اسیدی‌شده (pH 4.1)',
    targetOrganismId: 'b_cereus',
    retortOrMediumTempC: 92.0,
    initialTempC: 90.0,
    descriptionFa: 'فرآیند پرکنی داغ در دمای ۹۰ تا ۹۲ درجه با دوره نگهداری ۲ دقیقه‌ای بطری وارونه جهت استریل‌سازی سطح داخلی درب و هوای بالای سر (Headspace).',
    referenceSource: 'FDA Acidified Foods Processing Guidance (21 CFR Part 114)',
    points: [
      { timeMinutes: 0.0, temperatureC: 91.5 },
      { timeMinutes: 0.5, temperatureC: 91.2 },
      { timeMinutes: 1.0, temperatureC: 90.8 },
      { timeMinutes: 1.5, temperatureC: 90.5 },
      { timeMinutes: 2.0, temperatureC: 90.0 }, // Inverted hold finished, tunnel shower starts
      { timeMinutes: 3.0, temperatureC: 84.0 },
      { timeMinutes: 5.0, temperatureC: 68.0 },
      { timeMinutes: 7.0, temperatureC: 48.0 },
      { timeMinutes: 10.0, temperatureC: 32.0 }
    ]
  },
  {
    id: 'aseptic_uht_dairy',
    titleFa: 'استریلیزاسیون فرادما مستقیم شیر (Direct Steam Injection UHT Sterilization)',
    processType: 'aseptic_uht',
    containerType: 'جریان پیوسته لوله‌ای با تزریق بخار زنده و فلش کولینگ در محفظه خلاء',
    productName: 'شیر فرادما UHT غنی‌شده',
    targetOrganismId: 'b_sporothermodurans',
    retortOrMediumTempC: 140.0,
    initialTempC: 75.0,
    descriptionFa: 'حرارت‌دهی فوق سریع در ۴ ثانیه در دمای ۱۳۸ تا ۱۴۰ درجه سانتی‌گراد جهت حفظ ۹۵٪ طعم طبیعی و ویتامین‌ها همراه با استریلیزاسیون کامل اسپورهای مقاوم.',
    referenceSource: 'Toledo (2007), Chapter 7, Continuous Flow Thermal Sterilization',
    points: [
      { timeMinutes: 0.0, temperatureC: 75.0 },
      { timeMinutes: 0.02, temperatureC: 110.0 },
      { timeMinutes: 0.04, temperatureC: 139.5 },
      { timeMinutes: 0.08, temperatureC: 140.0 }, // 4 seconds holding
      { timeMinutes: 0.10, temperatureC: 139.0 },
      { timeMinutes: 0.12, temperatureC: 78.0 }, // Vacuum flash chamber cooling
      { timeMinutes: 0.20, temperatureC: 22.0 }
    ]
  }
];

export function getMicroorganismById(id: string): ReferenceMicroorganism | undefined {
  return BENCHMARK_MICROORGANISMS.find(m => m.id === id);
}

export function getPenetrationProfileById(id: string): ThermalPenetrationProfile | undefined {
  return BENCHMARK_PENETRATION_PROFILES.find(p => p.id === id);
}
