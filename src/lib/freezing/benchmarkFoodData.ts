import { FoodThermalProperties } from './types';

/**
 * Authentic benchmark thermal properties of food materials.
 * Sourced from ASHRAE Handbook of Refrigeration, Choi & Okos (1986),
 * Singh & Heldman (2014) Introduction to Food Engineering, and Cleland & Earle (1982).
 */
export const BENCHMARK_FOOD_MATERIALS: FoodThermalProperties[] = [
  {
    id: 'lean_beef_patty',
    nameFa: 'گوشت لخم گوساله / برگر (Lean Beef Patty)',
    nameEn: 'Lean Beef Patty (74% Moisture)',
    category: 'meat_poultry',
    moistureFraction: 0.74,
    initialFreezingPointTif: -1.7,
    latentHeatDeltaH: 247.0, // 333.5 * 0.74
    densityUnfrozen: 1050.0,
    densityFrozen: 980.0,
    thermalConductivityUnfrozen: 0.48,
    thermalConductivityFrozen: 1.35,
    specificHeatUnfrozen: 3.52,
    specificHeatFrozen: 1.95,
    literatureSource: 'ASHRAE Handbook - Refrigeration (2018) & Singh & Heldman (2014), Table A.2.2',
    descriptionFa: 'پروتئین بافت ماهیچه‌ای متراکم. به دلیل تشکیل یخ با دانسیته کمتر، حجم محصول در حین انجماد حدود ۹٪ افزایش می‌یابد.'
  },
  {
    id: 'cod_fish_fillet',
    nameFa: 'فیله ماهی کاد سفید (Cod Fish Fillet)',
    nameEn: 'White Cod Fillet (81% Moisture)',
    category: 'fish_seafood',
    moistureFraction: 0.81,
    initialFreezingPointTif: -2.2,
    latentHeatDeltaH: 270.0,
    densityUnfrozen: 1040.0,
    densityFrozen: 970.0,
    thermalConductivityUnfrozen: 0.52,
    thermalConductivityFrozen: 1.55,
    specificHeatUnfrozen: 3.75,
    specificHeatFrozen: 2.05,
    literatureSource: 'Cleland & Earle (1982) Experimental Freezing Datasets & Pham (1986)',
    descriptionFa: 'رطوبت بالا و درصد نمک‌های معدنی باعث افت نقطه انجماد اولیه به ۲.۲- درجه سلسیوس شده است.'
  },
  {
    id: 'green_peas_sphere',
    nameFa: 'نخود فرنگی کامل سبز (Green Peas)',
    nameEn: 'Whole Green Peas (78% Moisture)',
    category: 'fruits_vegetables',
    moistureFraction: 0.78,
    initialFreezingPointTif: -1.1,
    latentHeatDeltaH: 260.0,
    densityUnfrozen: 1020.0,
    densityFrozen: 960.0,
    thermalConductivityUnfrozen: 0.49,
    thermalConductivityFrozen: 1.40,
    specificHeatUnfrozen: 3.60,
    specificHeatFrozen: 1.98,
    literatureSource: 'Singh & Heldman (2014) & ASHRAE Thermal Properties of Foods',
    descriptionFa: 'هندسه کروی ایده‌آل برای مدل‌های انجماد بستر سیال (Fluidized Bed IQF). نرخ انجماد بسیار بالا به دلیل نسبت سطح به حجم بزرگ.'
  },
  {
    id: 'strawberries_whole',
    nameFa: 'توت‌فرنگی کامل تازه (Whole Strawberries)',
    nameEn: 'Fresh Whole Strawberries (91% Moisture)',
    category: 'fruits_vegetables',
    moistureFraction: 0.91,
    initialFreezingPointTif: -0.8,
    latentHeatDeltaH: 303.5,
    densityUnfrozen: 1010.0,
    densityFrozen: 930.0,
    thermalConductivityUnfrozen: 0.57,
    thermalConductivityFrozen: 1.85,
    specificHeatUnfrozen: 3.95,
    specificHeatFrozen: 2.15,
    literatureSource: 'Choi & Okos (1986) Effects of Composition on Food Thermal Properties',
    descriptionFa: 'میوه بسیار حساس به سرعت انجماد؛ انجماد کند منجر به تشکیل بلورهای درشت خارج سلولی و خروج شدید خوناب (Drip Loss) حین ذوب می‌شود.'
  },
  {
    id: 'industrial_bread_dough',
    nameFa: 'خمیر نان صنعتی منجمد (Bread Dough)',
    nameEn: 'Industrial Bread Dough (44% Moisture)',
    category: 'bakery',
    moistureFraction: 0.44,
    initialFreezingPointTif: -4.5,
    latentHeatDeltaH: 146.5,
    densityUnfrozen: 1150.0,
    densityFrozen: 1080.0,
    thermalConductivityUnfrozen: 0.38,
    thermalConductivityFrozen: 0.95,
    specificHeatUnfrozen: 2.70,
    specificHeatFrozen: 1.70,
    literatureSource: 'Miles, van Beek & Veerkamp (1983) Calculation of Thermophysical Properties of Foods',
    descriptionFa: 'درصد رطوبت پایین و حضور نمک و قندها نقطه انجماد را به شدت کاهش داده و هدایت حرارتی کمتری نسبت به گوشت و ماهی دارد.'
  },
  {
    id: 'ice_cream_mix',
    nameFa: 'پایه مخلوط بستنی شیری (Ice Cream Mix)',
    nameEn: 'Dairy Ice Cream Mix (60% Moisture)',
    category: 'dairy',
    moistureFraction: 0.60,
    initialFreezingPointTif: -2.8,
    latentHeatDeltaH: 200.0,
    densityUnfrozen: 1100.0,
    densityFrozen: 1020.0,
    thermalConductivityUnfrozen: 0.43,
    thermalConductivityFrozen: 1.15,
    specificHeatUnfrozen: 3.15,
    specificHeatFrozen: 1.85,
    literatureSource: 'Goff & Hartel (2013) Ice Cream (7th Edition), Springer',
    descriptionFa: 'در بستنی درصد بالایی از آب در دماهای انجماد خانگی غیرمنجمد باقی می‌ماند (حالت شربتی غلیظ).'
  },
  {
    id: 'apple_tissue_block',
    nameFa: 'بافت قطعات سیب درختی (Apple Slices / Blocks)',
    nameEn: 'Fresh Apple Slices (84% Moisture)',
    category: 'fruits_vegetables',
    moistureFraction: 0.84,
    initialFreezingPointTif: -1.5,
    latentHeatDeltaH: 280.0,
    densityUnfrozen: 950.0,
    densityFrozen: 890.0,
    thermalConductivityUnfrozen: 0.51,
    thermalConductivityFrozen: 1.62,
    specificHeatUnfrozen: 3.80,
    specificHeatFrozen: 2.08,
    literatureSource: 'Singh & Heldman (2014) Introduction to Food Engineering, Table A.2.2',
    descriptionFa: 'حاوی ۲۰ تا ۲۵ درصد حفرات هوا درون بافت اسفنجی پارنشیم؛ دانسیته کمتر از آب است.'
  }
];

export function getBenchmarkFoodById(id: string): FoodThermalProperties | undefined {
  return BENCHMARK_FOOD_MATERIALS.find(f => f.id === id);
}
