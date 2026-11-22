/**
 * Authentic Food Packaging Materials Database
 * Verified literature benchmarks from:
 * - Robertson, G.L. (2012). Food Packaging: Principles and Practice (3rd Ed.), CRC Press.
 * - Massey, L.K. (2003). Permeability Properties of Plastics and Elastomers (2nd Ed.), Plastics Design Library.
 * - Yam, K.L. (2009). The Wiley Encyclopedia of Packaging Technology (3rd Ed.), John Wiley & Sons.
 * - ASTM D3985 (Coulometric OTR), ASTM F1249 (Infrared WVTR), ISO 15105, INSO 13740.
 */

import { PackagingMaterialRecord } from './types';

export const BENCHMARK_PACKAGING_MATERIALS: PackagingMaterialRecord[] = [
  // 1. Low Density Polyethylene (LDPE)
  {
    id: 'mat_ldpe',
    nameFa: 'پلی‌اتیلن سبک (LDPE)',
    nameEn: 'Low-Density Polyethylene',
    acronym: 'LDPE',
    category: 'polyolefin',
    densityGPerCm3: 0.92,
    typicalThicknessRangeMicrons: [25, 100],
    oxygenPermeabilityMm: 160.0, // cm³ · mm / (m² · day · atm) at 23°C
    waterVaporPermeabilityMm: 0.45, // g · mm / (m² · day) at 37.8°C, 90% RH
    activationEnergyO2KjPerMol: 42.0,
    activationEnergyH2OKjPerMol: 38.0,
    oxygenBarrierLevel: 'low',
    waterVaporBarrierLevel: 'high',
    testConditionsFa: 'اکسیژن: ۲۳°C و ۰% RH؛ بخار آب: ۳۸°C و ۹۰% RH (ASTM D3985 / ASTM F1249)',
    measurementStandards: ['ASTM D3985', 'ASTM F1249', 'INSO 13740'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, CRC Press, Table 3.2.',
      'Massey, L.K. (2003). Permeability Properties of Plastics and Elastomers, PDL, p. 74.'
    ],
    notesFa: 'مقاومت بسیار خوب در برابر رطوبت، اما نفوذپذیری بالا نسبت به اکسیژن؛ بسیار مناسب برای دوخت حرارتی و لایه داخلی لمینیت‌ها.',
    isFoodContactApproved: true,
    isMultilayer: false
  },

  // 2. High Density Polyethylene (HDPE)
  {
    id: 'mat_hdpe',
    nameFa: 'پلی‌اتیلن سنگین (HDPE)',
    nameEn: 'High-Density Polyethylene',
    acronym: 'HDPE',
    category: 'polyolefin',
    densityGPerCm3: 0.96,
    typicalThicknessRangeMicrons: [20, 150],
    oxygenPermeabilityMm: 45.0,
    waterVaporPermeabilityMm: 0.12,
    activationEnergyO2KjPerMol: 45.0,
    activationEnergyH2OKjPerMol: 40.0,
    oxygenBarrierLevel: 'medium',
    waterVaporBarrierLevel: 'high',
    testConditionsFa: 'اکسیژن: ۲۳°C و ۰% RH؛ بخار آب: ۳۸°C و ۹۰% RH',
    measurementStandards: ['ASTM D3985', 'ASTM F1249', 'ISO 15105'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, CRC Press, p. 68.',
      'Yam, K.L. (2009). The Wiley Encyclopedia of Packaging Technology, Wiley.'
    ],
    notesFa: 'بلورینگی بالاتر نسبت به LDPE که سدبخار آب را حدود ۳ تا ۴ برابر و سد اکسیژن را ۳ برابر بهبود می‌دهد.',
    isFoodContactApproved: true,
    isMultilayer: false
  },

  // 3. Linear Low-Density Polyethylene (LLDPE)
  {
    id: 'mat_lldpe',
    nameFa: 'پلی‌اتیلن خطی سبک (LLDPE)',
    nameEn: 'Linear Low-Density Polyethylene',
    acronym: 'LLDPE',
    category: 'polyolefin',
    densityGPerCm3: 0.925,
    typicalThicknessRangeMicrons: [15, 80],
    oxygenPermeabilityMm: 140.0,
    waterVaporPermeabilityMm: 0.40,
    activationEnergyO2KjPerMol: 43.0,
    activationEnergyH2OKjPerMol: 39.0,
    oxygenBarrierLevel: 'low',
    waterVaporBarrierLevel: 'high',
    testConditionsFa: 'اکسیژن: ۲۳°C و ۰% RH؛ بخار آب: ۳۸°C و ۹۰% RH',
    measurementStandards: ['ASTM D3985', 'ASTM F1249'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, Table 3.2.',
      'Massey, L.K. (2003). Permeability Properties of Plastics and Elastomers, p. 82.'
    ],
    notesFa: 'مقاومت مکانیکی و چقرمگی عالی در برابر سوراخ‌شدگی؛ کاربرد گسترده در فیلم‌های شرینک و استرچ مواد غذایی.',
    isFoodContactApproved: true,
    isMultilayer: false
  },

  // 4. Biaxially Oriented Polypropylene (BOPP)
  {
    id: 'mat_bopp',
    nameFa: 'پلی‌پروپیلن دومحوره (BOPP)',
    nameEn: 'Biaxially Oriented Polypropylene',
    acronym: 'BOPP',
    category: 'polyolefin',
    densityGPerCm3: 0.91,
    typicalThicknessRangeMicrons: [15, 40],
    oxygenPermeabilityMm: 35.0,
    waterVaporPermeabilityMm: 0.15,
    activationEnergyO2KjPerMol: 48.0,
    activationEnergyH2OKjPerMol: 44.0,
    oxygenBarrierLevel: 'medium',
    waterVaporBarrierLevel: 'high',
    testConditionsFa: 'اکسیژن: ۲۳°C و ۰% RH؛ بخار آب: ۳۸°C و ۹۰% RH',
    measurementStandards: ['ASTM D3985', 'ASTM F1249', 'INSO 13740'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, CRC Press, p. 71.',
      'Massey, L.K. (2003). Permeability Properties of Plastics, p. 95.'
    ],
    notesFa: 'شفافیت و براقیت عالی، سد رطوبتی بسیار مناسب؛ استفاده متداول در بسته‌بندی چیپس، اسنک، ماکارونی و بیسکویت.',
    isFoodContactApproved: true,
    isMultilayer: false
  },

  // 5. Polyethylene Terephthalate (BOPET / PET)
  {
    id: 'mat_pet',
    nameFa: 'پلی‌اتیلن ترفتالات (PET / BOPET)',
    nameEn: 'Biaxially Oriented Polyethylene Terephthalate',
    acronym: 'PET',
    category: 'polyester',
    densityGPerCm3: 1.38,
    typicalThicknessRangeMicrons: [12, 36],
    oxygenPermeabilityMm: 1.30,
    waterVaporPermeabilityMm: 0.50,
    activationEnergyO2KjPerMol: 31.0,
    activationEnergyH2OKjPerMol: 29.0,
    oxygenBarrierLevel: 'medium',
    waterVaporBarrierLevel: 'medium',
    testConditionsFa: 'اکسیژن: ۲۳°C و ۰% RH؛ بخار آب: ۳۸°C و ۹۰% RH',
    measurementStandards: ['ASTM D3985', 'ASTM F1249', 'ISO 15105-2'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, CRC Press, Table 3.2.',
      'Yam, K.L. (2009). The Wiley Encyclopedia of Packaging Technology, p. 860.'
    ],
    notesFa: 'استحکام کششی بالا، پایداری حرارتی عالی و سد متوسط اکسیژن و رطوبت؛ لایه بیرونی چاپ‌پذیر در پاکت‌های ایستاده.',
    isFoodContactApproved: true,
    isMultilayer: false
  },

  // 6. Polyamide (Nylon 6 / BOPA)
  {
    id: 'mat_pa',
    nameFa: 'پلی‌آمید / نایلون ۶ (BOPA)',
    nameEn: 'Biaxially Oriented Polyamide (Nylon 6)',
    acronym: 'PA',
    category: 'polyamide',
    densityGPerCm3: 1.14,
    typicalThicknessRangeMicrons: [15, 30],
    oxygenPermeabilityMm: 0.65,
    waterVaporPermeabilityMm: 4.50,
    activationEnergyO2KjPerMol: 50.0,
    activationEnergyH2OKjPerMol: 35.0,
    oxygenBarrierLevel: 'high',
    waterVaporBarrierLevel: 'low',
    testConditionsFa: 'اکسیژن: ۲۳°C و ۰% RH (توجه: در RH بالا نفوذپذیری اکسیژن افزایش می‌یابد)؛ بخار آب: ۳۸°C و ۹۰% RH',
    measurementStandards: ['ASTM D3985', 'ISO 15105-1'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, CRC Press, p. 77.',
      'Massey, L.K. (2003). Permeability Properties of Plastics, p. 112.'
    ],
    notesFa: 'مقاومت مکانیکی و مقاومت سایشی فوق‌العاده؛ سد اکسیژن عالی در حالت خشک اما حساس به رطوبت؛ لایه میانی در وکیوم گوشت و سوسیس.',
    isFoodContactApproved: true,
    isMultilayer: false
  },

  // 7. Ethylene Vinyl Alcohol (EVOH - 32 mol% ethylene)
  {
    id: 'mat_evoh_32',
    nameFa: 'اتیلن وینیل الکل (EVOH - ۳۲ مولار)',
    nameEn: 'Ethylene Vinyl Alcohol (32 mol% ethylene)',
    acronym: 'EVOH-32',
    category: 'vinyl_copolymer',
    densityGPerCm3: 1.20,
    typicalThicknessRangeMicrons: [3, 15],
    oxygenPermeabilityMm: 0.003, // Ultra-high oxygen barrier at 0% RH
    waterVaporPermeabilityMm: 3.80,
    activationEnergyO2KjPerMol: 55.0,
    activationEnergyH2OKjPerMol: 36.0,
    oxygenBarrierLevel: 'ultra_high',
    waterVaporBarrierLevel: 'low',
    testConditionsFa: 'اکسیژن: ۲۳°C و ۰% RH؛ حساسیت شدید به رطوبت (نیازمند احاطه با لایه‌های ضد آب PE/PP)',
    measurementStandards: ['ASTM D3985', 'ISO 15105-2'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, CRC Press, Table 3.2.',
      'Kuraray EVAL Technical Data Sheets (2021).'
    ],
    notesFa: 'سد اکسیژن فوق‌العاده در شرایط خشک؛ در ساختارهای چندلایه همیشه بین دو لایه ضد آب پلی‌الفین قرار داده می‌شود.',
    isFoodContactApproved: true,
    isMultilayer: false
  },

  // 8. Polyvinylidene Chloride (PVDC / Saran)
  {
    id: 'mat_pvdc',
    nameFa: 'پلی‌وینیلیدن کلراید (PVDC / ساران)',
    nameEn: 'Polyvinylidene Chloride',
    acronym: 'PVDC',
    category: 'vinyl_copolymer',
    densityGPerCm3: 1.70,
    typicalThicknessRangeMicrons: [5, 25],
    oxygenPermeabilityMm: 0.04,
    waterVaporPermeabilityMm: 0.05,
    activationEnergyO2KjPerMol: 62.0,
    activationEnergyH2OKjPerMol: 52.0,
    oxygenBarrierLevel: 'ultra_high',
    waterVaporBarrierLevel: 'ultra_high',
    testConditionsFa: 'اکسیژن: ۲۳°C و ۰% تا ۹۰% RH (غیرحساس به رطوبت)؛ بخار آب: ۳۸°C و ۹۰% RH',
    measurementStandards: ['ASTM D3985', 'ASTM F1249'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, p. 81.',
      'Massey, L.K. (2003). Permeability Properties of Plastics, p. 145.'
    ],
    notesFa: 'سد همزمان اکسیژن و بخار آب بدون حساسیت به رطوبت؛ پوشش‌دهی روی فیلم‌های PET و کاغذ و روکش‌های شرینک گوشت.',
    isFoodContactApproved: true,
    isMultilayer: false
  },

  // 9. Rigid Polyvinyl Chloride (PVC)
  {
    id: 'mat_pvc_rigid',
    nameFa: 'پلی‌وینیل کلراید سخت (Rigid PVC)',
    nameEn: 'Rigid Polyvinyl Chloride',
    acronym: 'PVC',
    category: 'vinyl_copolymer',
    densityGPerCm3: 1.38,
    typicalThicknessRangeMicrons: [150, 400],
    oxygenPermeabilityMm: 2.50,
    waterVaporPermeabilityMm: 0.80,
    activationEnergyO2KjPerMol: 46.0,
    activationEnergyH2OKjPerMol: 42.0,
    oxygenBarrierLevel: 'medium',
    waterVaporBarrierLevel: 'medium',
    testConditionsFa: 'اکسیژن: ۲۳°C و ۰% RH؛ بخار آب: ۳۸°C و ۹۰% RH',
    measurementStandards: ['ASTM D3985', 'ASTM F1249'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, p. 74.',
      'Yam, K.L. (2009). The Wiley Encyclopedia of Packaging Technology.'
    ],
    notesFa: 'شکل‌پذیری حرارتی (ترموفرمینگ) عالی؛ کاربرد در ظروف بلیستر شکلات، تخم‌مرغ و ظروف یکبار مصرف سخت.',
    isFoodContactApproved: true,
    isMultilayer: false
  },

  // 10. Aluminum Foil (Alu Foil - 9 µm pinhole-free standard)
  {
    id: 'mat_alu_foil',
    nameFa: 'فویل آلومینیوم (Aluminum Foil ۹ میکرون)',
    nameEn: 'Aluminum Foil (Zero Pinhole)',
    acronym: 'Alu',
    category: 'metallic',
    densityGPerCm3: 2.70,
    typicalThicknessRangeMicrons: [7, 20],
    oxygenPermeabilityMm: 0.00001, // Absolute barrier when intact
    waterVaporPermeabilityMm: 0.00001, // Absolute barrier
    activationEnergyO2KjPerMol: 0.0,
    activationEnergyH2OKjPerMol: 0.0,
    oxygenBarrierLevel: 'ultra_high',
    waterVaporBarrierLevel: 'ultra_high',
    testConditionsFa: 'سد نظری بالا در برابر گاز، رطوبت، نور و بو در حالت بدون پین‌هول و بدون ترک خمشی (ارزیابی پین‌هول فویل ساده طبق ASTM B926 / EN 546-4)',
    measurementStandards: ['ASTM B479', 'ASTM B926 (فویل ساده)', 'EN 546-4 (فویل خام بدون لاک/لمینیت)', 'ASTM F1307 (OTR بسته نهایی)', 'ASTM D3985', 'ASTM F1249'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, CRC Press, p. 153.',
      'ASTM B479 / ASTM B926 / EN 546-4 Aluminum Foil Specifications.'
    ],
    notesFa: 'در صورت سلامت کامل لایه و فقدان پین‌هول و ترک خمشی (ارزیابی خمش با ASTM F392) سد بسیار قوی ایجاد می‌کند؛ با این حال در فویل‌های نازک (< ۱۲ میکرون) احتمال وجود پین‌هول و افت سدگری در خط بسته‌بندی وجود دارد و میزان واقعی باید با آزمون بسته (ASTM F1307) تأیید شود.',
    isFoodContactApproved: true,
    isMultilayer: false
  },

  // 11. Metallized PET (Met-PET - 12 µm with 30-50 nm Al deposit)
  {
    id: 'mat_met_pet',
    nameFa: 'فیلم متالایز (Met-PET ۱۲ میکرون)',
    nameEn: 'Metallized Polyester Film',
    acronym: 'Met-PET',
    category: 'polyester',
    densityGPerCm3: 1.40,
    typicalThicknessRangeMicrons: [12, 23],
    oxygenPermeabilityMm: 0.015,
    waterVaporPermeabilityMm: 0.012,
    activationEnergyO2KjPerMol: 30.0,
    activationEnergyH2OKjPerMol: 28.0,
    oxygenBarrierLevel: 'ultra_high',
    waterVaporBarrierLevel: 'ultra_high',
    testConditionsFa: 'اکسیژن: ۲۳°C و ۰% RH؛ بخار آب: ۳۸°C و ۹۰% RH',
    measurementStandards: ['ASTM D3985', 'ASTM F1249'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, p. 158.',
      'Yam, K.L. (2009). The Wiley Encyclopedia of Packaging Technology.'
    ],
    notesFa: 'لایه نازک آلومینیوم نشانده شده به روش خلاء (OD ~ 2.2)؛ جایگزین ارزان‌تر و انعطاف‌پذیرتر فویل در چیپس و تنقلات.',
    isFoodContactApproved: true,
    isMultilayer: true
  },

  // 12. Multi-layer High Barrier Retort Pouch (PET 12 / Alu 9 / OPA 15 / CPP 70)
  {
    id: 'mat_retort_pouch',
    nameFa: 'لمینیت چهارلایه اتوکلاوی (PET/Alu/PA/CPP)',
    nameEn: 'Four-layer Retort Pouch Laminate',
    acronym: 'PET/Alu/PA/CPP',
    category: 'laminate',
    densityGPerCm3: 1.45,
    typicalThicknessRangeMicrons: [100, 120],
    oxygenPermeabilityMm: 0.0001,
    waterVaporPermeabilityMm: 0.0001,
    activationEnergyO2KjPerMol: 0.0,
    activationEnergyH2OKjPerMol: 0.0,
    oxygenBarrierLevel: 'ultra_high',
    waterVaporBarrierLevel: 'ultra_high',
    testConditionsFa: 'دمای استریلیزاسیون ۱۲۱ تا ۱۳۰ درجه سلسیوس در اتوکلاو با فشار معکوس',
    measurementStandards: ['ASTM F1249', 'ASTM D3985', 'INSO 13740', 'US FDA 21 CFR §177.1390'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, CRC Press, p. 280.',
      'Brody, A.L. (1997). Packaging of Food by Retort Pouch, Technomic Publishing.'
    ],
    notesFa: 'سازه چهارلایه برای ماندگاری بالای ۱ تا ۲ سال غذاهای آماده مصرف کنسروی بدون نیاز به سردخانه.',
    isFoodContactApproved: true,
    isMultilayer: true
  },

  // 13. Aseptic Beverage Carton (Liquid Packaging Board - Paper / PE / Alu)
  {
    id: 'mat_aseptic_carton',
    nameFa: 'کارتن اسپتیک چندلایه تتراپک (Paper / PE / Alu / PE)',
    nameEn: 'Aseptic Liquid Packaging Board',
    acronym: 'LPB-Aseptic',
    category: 'laminate',
    densityGPerCm3: 1.05,
    typicalThicknessRangeMicrons: [300, 450],
    oxygenPermeabilityMm: 0.0005,
    waterVaporPermeabilityMm: 0.0005,
    activationEnergyO2KjPerMol: 0.0,
    activationEnergyH2OKjPerMol: 0.0,
    oxygenBarrierLevel: 'ultra_high',
    waterVaporBarrierLevel: 'ultra_high',
    testConditionsFa: 'شرایط پرکنی اسپتیک برای شیر استریل UHT و آبمیوه‌ها',
    measurementStandards: ['ASTM D3985', 'ISO 15105', 'INSO 3541'],
    literatureCitations: [
      'Robertson, G.L. (2012). Food Packaging: Principles and Practice, p. 175.',
      'Tetra Pak Technical Manual (2018).'
    ],
    notesFa: 'ترکیب ۷۵٪ مقوا برای استحکام مکانیکی، ۲۰٪ پلی‌اتیلن برای دوخت و ضدآب‌سازی، و ۵٪ فویل آلومینیوم برای سد کامل اکسیژن و نور.',
    isFoodContactApproved: true,
    isMultilayer: true
  }
];

export function getPackagingMaterialById(id: string): PackagingMaterialRecord | undefined {
  return BENCHMARK_PACKAGING_MATERIALS.find(m => m.id === id);
}
