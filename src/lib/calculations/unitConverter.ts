import { UnitCategory, UnitDefinition } from '../../types/calculations';

export const LAB_UNITS: Record<string, UnitDefinition> = {
  // Mass Units (Base: g)
  'g': { code: 'g', symbol: 'g', labelFa: 'گرم', labelEn: 'Gram', category: 'mass', baseRatio: 1, descriptionFa: 'واحد مبنای جرم' },
  'mg': { code: 'mg', symbol: 'mg', labelFa: 'میلی‌گرم', labelEn: 'Milligram', category: 'mass', baseRatio: 0.001, descriptionFa: 'یک‌هزارم گرم' },
  'kg': { code: 'kg', symbol: 'kg', labelFa: 'کیلوگرم', labelEn: 'Kilogram', category: 'mass', baseRatio: 1000, descriptionFa: 'هزار گرم' },
  'ug': { code: 'ug', symbol: 'µg', labelFa: 'میکروگرم', labelEn: 'Microgram', category: 'mass', baseRatio: 0.000001, descriptionFa: 'یک‌میلیونیوم گرم' },
  'ton': { code: 'ton', symbol: 'ton', labelFa: 'تن متریک', labelEn: 'Metric Ton', category: 'mass', baseRatio: 1000000, descriptionFa: 'یک میلیون گرم (۱۰۰۰ کیلوگرم)' },
  'oz': { code: 'oz', symbol: 'oz', labelFa: 'اونس', labelEn: 'Ounce', category: 'mass', baseRatio: 28.349523, descriptionFa: 'اونس آوواردوپوا (۲۸.۳۵ گرم)' },
  'lb': { code: 'lb', symbol: 'lb', labelFa: 'پوند', labelEn: 'Pound', category: 'mass', baseRatio: 453.59237, descriptionFa: 'پوند استاندارد (۴۵۳.۵۹ گرم)' },
  'grain': { code: 'grain', symbol: 'gr', labelFa: 'گرین (Grain)', labelEn: 'Grain', category: 'mass', baseRatio: 0.06479891, descriptionFa: 'واحد گرین داروسازی' },

  // Volume Units (Base: ml)
  'ml': { code: 'ml', symbol: 'mL', labelFa: 'میلی‌لیتر', labelEn: 'Milliliter', category: 'volume', baseRatio: 1, descriptionFa: 'سانتی‌متر مکعب (واحد مبنا)' },
  'cm3': { code: 'cm3', symbol: 'cm³', labelFa: 'سانتی‌متر مکعب (cc)', labelEn: 'Cubic Centimeter', category: 'volume', baseRatio: 1, descriptionFa: 'معادل ۱ میلی‌لیتر' },
  'l': { code: 'l', symbol: 'L', labelFa: 'لیتر', labelEn: 'Liter', category: 'volume', baseRatio: 1000, descriptionFa: 'هزار میلی‌لیتر' },
  'dm3': { code: 'dm3', symbol: 'dm³', labelFa: 'دسی‌متر مکعب', labelEn: 'Cubic Decimeter', category: 'volume', baseRatio: 1000, descriptionFa: 'معادل ۱ لیتر' },
  'ul': { code: 'ul', symbol: 'µL', labelFa: 'میکرولیتر', labelEn: 'Microliter', category: 'volume', baseRatio: 0.001, descriptionFa: 'یک‌هزارم میلی‌لیتر' },
  'm3': { code: 'm3', symbol: 'm³', labelFa: 'متر مکعب', labelEn: 'Cubic Meter', category: 'volume', baseRatio: 1000000, descriptionFa: 'یک میلیون میلی‌لیتر (۱۰۰۰ لیتر)' },
  'floz': { code: 'floz', symbol: 'fl oz', labelFa: 'اونس مایع آمریکایی', labelEn: 'Fluid Ounce (US)', category: 'volume', baseRatio: 29.57352956, descriptionFa: '۲۹.۵۷ میلی‌لیتر' },
  'pt': { code: 'pt', symbol: 'pt', labelFa: 'پینت آمریکایی', labelEn: 'Pint (US)', category: 'volume', baseRatio: 473.176473, descriptionFa: '۴۷۳.۱۸ میلی‌لیتر' },
  'qt': { code: 'qt', symbol: 'qt', labelFa: 'کوارت آمریکایی', labelEn: 'Quart (US)', category: 'volume', baseRatio: 946.352946, descriptionFa: '۹۴۶.۳۵ میلی‌لیتر' },
  'gal': { code: 'gal', symbol: 'gal', labelFa: 'گالن آمریکایی', labelEn: 'Gallon (US)', category: 'volume', baseRatio: 3785.411784, descriptionFa: '۳۷۸۵.۴۱ میلی‌لیتر (۳.۷۸۵ لیتر)' },

  // Temperature Units (Base: °C)
  'c': { code: 'c', symbol: '°C', labelFa: 'سلسیوس (سانتی‌گراد)', labelEn: 'Celsius', category: 'temperature', baseRatio: 1, offset: 0, descriptionFa: 'درجه سانتی‌گراد' },
  'f': { code: 'f', symbol: '°F', labelFa: 'فارنهایت', labelEn: 'Fahrenheit', category: 'temperature', baseRatio: 5 / 9, offset: -32 * (5 / 9), descriptionFa: 'درجه فارنهایت' },
  'k': { code: 'k', symbol: 'K', labelFa: 'کلوین', labelEn: 'Kelvin', category: 'temperature', baseRatio: 1, offset: -273.15, descriptionFa: 'دمای مطلق کلوین' },
  'r': { code: 'r', symbol: '°R', labelFa: 'رانکین', labelEn: 'Rankine', category: 'temperature', baseRatio: 5 / 9, offset: -491.67 * (5 / 9), descriptionFa: 'دمای مطلق رانکین' },

  // Concentration Units (Base: g/L)
  'g_l': { code: 'g_l', symbol: 'g/L', labelFa: 'گرم بر لیتر', labelEn: 'Gram per Liter', category: 'concentration', baseRatio: 1, descriptionFa: 'گرم ماده حل‌شده در ۱ لیتر محلول' },
  'mg_l': { code: 'mg_l', symbol: 'mg/L', labelFa: 'میلی‌گرم بر لیتر (ppm)', labelEn: 'Milligram per Liter (ppm)', category: 'concentration', baseRatio: 0.001, descriptionFa: 'معادل ۱ قسمت در میلیون در آب' },
  'ug_l': { code: 'ug_l', symbol: 'µg/L (ppb)', labelFa: 'میکروگرم بر لیتر (ppb)', labelEn: 'Microgram per Liter (ppb)', category: 'concentration', baseRatio: 0.000001, descriptionFa: 'معادل ۱ قسمت در میلیارد در آب' },
  'ug_ml': { code: 'ug_ml', symbol: 'µg/mL', labelFa: 'میکروگرم بر میلی‌لیتر (ppm)', labelEn: 'Microgram per mL', category: 'concentration', baseRatio: 0.001, descriptionFa: 'معادل ۱ ppm' },
  'pct_w_w': { code: 'pct_w_w', symbol: '% (w/w)', labelFa: 'درصد وزنی/وزنی', labelEn: 'Percent (w/w)', category: 'concentration', baseRatio: 10, descriptionFa: 'گرم ماده در ۱۰۰ گرم محلول (۱۰ g/L با فرض چگالی ۱)' },
  'pct_w_v': { code: 'pct_w_v', symbol: '% (w/v)', labelFa: 'درصد وزنی/حجمی', labelEn: 'Percent (w/v)', category: 'concentration', baseRatio: 10, descriptionFa: 'گرم ماده در ۱۰۰ میلی‌لیتر محلول (۱۰ g/L)' },
  'pct_v_v': { code: 'pct_v_v', symbol: '% (v/v)', labelFa: 'درصد حجمی/حجمی', labelEn: 'Percent (v/v)', category: 'concentration', baseRatio: 10, descriptionFa: 'میلی‌لیتر ماده در ۱۰۰ میلی‌لیتر محلول' },
  'mg_100g': { code: 'mg_100g', symbol: 'mg/100g', labelFa: 'میلی‌گرم در ۱۰۰ گرم', labelEn: 'Milligram per 100g', category: 'concentration', baseRatio: 0.01, descriptionFa: 'غلظت مواد مغذی و ویتامین‌ها' },
  'g_100g': { code: 'g_100g', symbol: 'g/100g', labelFa: 'گرم در ۱۰۰ گرم (% w/w)', labelEn: 'Gram per 100g', category: 'concentration', baseRatio: 10, descriptionFa: 'معادل درصد وزنی' },
  'ppm': { code: 'ppm', symbol: 'ppm', labelFa: 'قسمت در میلیون (ppm)', labelEn: 'Parts per million', category: 'concentration', baseRatio: 0.001, descriptionFa: 'یک میلی‌گرم در کیلوگرم یا لیتر' },
  'ppb': { code: 'ppb', symbol: 'ppb', labelFa: 'قسمت در میلیارد (ppb)', labelEn: 'Parts per billion', category: 'concentration', baseRatio: 0.000001, descriptionFa: 'یک میکروگرم در کیلوگرم یا لیتر' },
  'mol_l': { code: 'mol_l', symbol: 'M (mol/L)', labelFa: 'مولار (M)', labelEn: 'Molar (mol/L)', category: 'concentration', baseRatio: 1, descriptionFa: 'غلظت مولار (مول بر لیتر)' },
  'mmol_l': { code: 'mmol_l', symbol: 'mM (mmol/L)', labelFa: 'میلی‌مولار (mM)', labelEn: 'Millimolar (mmol/L)', category: 'concentration', baseRatio: 0.001, descriptionFa: 'یک‌هزارم مولار' },
  'normality': { code: 'normality', symbol: 'N (eq/L)', labelFa: 'نرمال (N)', labelEn: 'Normal (eq/L)', category: 'concentration', baseRatio: 1, descriptionFa: 'غلظت اکی‌والان در لیتر' },
  'meq_l': { code: 'meq_l', symbol: 'meq/L', labelFa: 'میلی‌اکی‌والان بر لیتر', labelEn: 'Milliequivalent per Liter', category: 'concentration', baseRatio: 0.001, descriptionFa: 'یک‌هزارم نرمال' },

  // Pressure Units (Base: bar)
  'bar': { code: 'bar', symbol: 'bar', labelFa: 'بار', labelEn: 'Bar', category: 'pressure', baseRatio: 1, descriptionFa: '۱۰۰ کیلوپاسکال' },
  'mbar': { code: 'mbar', symbol: 'mbar', labelFa: 'میلی‌بار', labelEn: 'Millibar', category: 'pressure', baseRatio: 0.001, descriptionFa: 'یک‌هزارم بار (معادل ۱ هکتوپاسکال)' },
  'atm': { code: 'atm', symbol: 'atm', labelFa: 'اتمسفر استاندارد', labelEn: 'Standard Atmosphere', category: 'pressure', baseRatio: 1.01325, descriptionFa: '۱۰۱.۳۲۵ کیلوپاسکال (۷۶۰ میلی‌متر جیوه)' },
  'kpa': { code: 'kpa', symbol: 'kPa', labelFa: 'کیلوپاسکال', labelEn: 'Kilopascal', category: 'pressure', baseRatio: 0.01, descriptionFa: '۱۰۰۰ پاسکال' },
  'mpa': { code: 'mpa', symbol: 'MPa', labelFa: 'مگاپاسکال', labelEn: 'Megapascal', category: 'pressure', baseRatio: 10, descriptionFa: 'یک میلیون پاسکال (۱۰ بار)' },
  'pa': { code: 'pa', symbol: 'Pa', labelFa: 'پاسکال', labelEn: 'Pascal', category: 'pressure', baseRatio: 0.00001, descriptionFa: 'نیوتن بر متر مربع' },
  'psi': { code: 'psi', symbol: 'psi', labelFa: 'پوند بر اینچ مربع (PSI)', labelEn: 'PSI', category: 'pressure', baseRatio: 0.0689476, descriptionFa: '۶۸.۹۵ میلی‌بار' },
  'mmhg': { code: 'mmhg', symbol: 'mmHg', labelFa: 'میلی‌متر جیوه', labelEn: 'Millimeter of Mercury', category: 'pressure', baseRatio: 0.00133322, descriptionFa: 'فشار ستون جیوه (Torr)' },
  'torr': { code: 'torr', symbol: 'Torr', labelFa: 'تور (Torr)', labelEn: 'Torr', category: 'pressure', baseRatio: 0.00133322, descriptionFa: 'معادل ۱ میلی‌متر جیوه' },

  // Time Units (Base: s)
  's': { code: 's', symbol: 's', labelFa: 'ثانیه', labelEn: 'Second', category: 'time', baseRatio: 1 },
  'min': { code: 'min', symbol: 'min', labelFa: 'دقیقه', labelEn: 'Minute', category: 'time', baseRatio: 60 },
  'h': { code: 'h', symbol: 'h', labelFa: 'ساعت', labelEn: 'Hour', category: 'time', baseRatio: 3600 },
  'day': { code: 'day', symbol: 'day', labelFa: 'روز', labelEn: 'Day', category: 'time', baseRatio: 86400 },

  // Percent / Dimensionless
  'percent': { code: 'percent', symbol: '%', labelFa: 'درصد', labelEn: 'Percent', category: 'percent', baseRatio: 1 },
  'unitless': { code: 'unitless', symbol: '-', labelFa: 'بدون واحد', labelEn: 'Dimensionless', category: 'dimensionless', baseRatio: 1 }
};

export interface ConversionResult {
  success: boolean;
  value: number;
  fromUnit: string;
  toUnit: string;
  category: UnitCategory;
  conversionFactor: number;
  explanationFa: string;
  error?: string;
}

export function convertUnit(
  value: number,
  fromUnitCode: string,
  toUnitCode: string
): ConversionResult {
  const normFrom = fromUnitCode.toLowerCase().replace(/[\s\(\)\/]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  const normTo = toUnitCode.toLowerCase().replace(/[\s\(\)\/]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

  const fromDef = LAB_UNITS[fromUnitCode] || LAB_UNITS[normFrom] || Object.values(LAB_UNITS).find(u => u.symbol.toLowerCase() === fromUnitCode.toLowerCase());
  const toDef = LAB_UNITS[toUnitCode] || LAB_UNITS[normTo] || Object.values(LAB_UNITS).find(u => u.symbol.toLowerCase() === toUnitCode.toLowerCase());

  if (!fromDef || !toDef) {
    return {
      success: false,
      value,
      fromUnit: fromUnitCode,
      toUnit: toUnitCode,
      category: 'dimensionless',
      conversionFactor: 1,
      explanationFa: `واحد تعریف نشده: ${!fromDef ? fromUnitCode : toUnitCode}`,
      error: `واحد تعریف نشده است.`
    };
  }

  if (fromDef.category !== toDef.category) {
    return {
      success: false,
      value,
      fromUnit: fromDef.symbol,
      toUnit: toDef.symbol,
      category: fromDef.category,
      conversionFactor: 1,
      explanationFa: `تبدیل ناممکن: واحد مبدا (${fromDef.labelFa}) و مقصد (${toDef.labelFa}) از دسته‌بندی‌های متفاوتی هستند.`,
      error: `دسته‌بندی‌های واحد ناسازگار هستند (${fromDef.category} ≠ ${toDef.category}).`
    };
  }

  if (fromDef.code === toDef.code) {
    return {
      success: true,
      value,
      fromUnit: fromDef.symbol,
      toUnit: toDef.symbol,
      category: fromDef.category,
      conversionFactor: 1,
      explanationFa: `هر دو واحد یکسان هستند (${fromDef.symbol}).`
    };
  }

  // Handle Temperature conversions (affine transformations)
  if (fromDef.category === 'temperature') {
    let tempInCelsius = value;
    if (fromDef.code === 'c') {
      tempInCelsius = value;
    } else if (fromDef.code === 'f') {
      tempInCelsius = (value - 32) * (5 / 9);
    } else if (fromDef.code === 'k') {
      tempInCelsius = value - 273.15;
    } else if (fromDef.code === 'r') {
      tempInCelsius = (value - 491.67) * (5 / 9);
    }

    let targetValue = tempInCelsius;
    if (toDef.code === 'c') {
      targetValue = tempInCelsius;
    } else if (toDef.code === 'f') {
      targetValue = (tempInCelsius * (9 / 5)) + 32;
    } else if (toDef.code === 'k') {
      targetValue = tempInCelsius + 273.15;
    } else if (toDef.code === 'r') {
      targetValue = (tempInCelsius * (9 / 5)) + 491.67;
    }

    return {
      success: true,
      value: targetValue,
      fromUnit: fromDef.symbol,
      toUnit: toDef.symbol,
      category: 'temperature',
      conversionFactor: targetValue / (value || 1),
      explanationFa: `تبدیل دما از ${value} ${fromDef.symbol} به ${targetValue.toFixed(2)} ${toDef.symbol}`
    };
  }

  // Linear conversions
  const valueInBase = value * fromDef.baseRatio;
  const targetValue = valueInBase / toDef.baseRatio;
  const factor = fromDef.baseRatio / toDef.baseRatio;

  return {
    success: true,
    value: targetValue,
    fromUnit: fromDef.symbol,
    toUnit: toDef.symbol,
    category: fromDef.category,
    conversionFactor: factor,
    explanationFa: `${value} ${fromDef.symbol} × (${factor}) = ${targetValue} ${toDef.symbol}`
  };
}

export function getUnitsByCategory(category: UnitCategory): UnitDefinition[] {
  return Object.values(LAB_UNITS).filter(u => u.category === category);
}
