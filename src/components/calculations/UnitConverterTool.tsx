import React, { useState, useMemo } from 'react';
import { 
  ArrowRightLeft, 
  Scale, 
  Thermometer, 
  Droplet, 
  Gauge, 
  Clock, 
  Percent, 
  Check, 
  Copy, 
  Info,
  Layers
} from 'lucide-react';
import { 
  convertUnit, 
  getUnitsByCategory, 
  LAB_UNITS, 
  ConversionResult 
} from '../../lib/calculations/unitConverter';
import { UnitCategory, UnitDefinition } from '../../types/calculations';

export const UnitConverterTool: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('mass');
  const [inputValue, setInputValue] = useState<number>(1000);
  const [fromUnit, setFromUnit] = useState<string>('g');
  const [toUnit, setToUnit] = useState<string>('kg');
  const [copied, setCopied] = useState<boolean>(false);

  const availableUnits = useMemo<UnitDefinition[]>(() => {
    return getUnitsByCategory(category);
  }, [category]);

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const units = getUnitsByCategory(newCat);
    if (units.length >= 2) {
      setFromUnit(units[0].code);
      setToUnit(units[1].code);
    } else if (units.length === 1) {
      setFromUnit(units[0].code);
      setToUnit(units[0].code);
    }
  };

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const conversion: ConversionResult = useMemo(() => {
    return convertUnit(inputValue, fromUnit, toUnit);
  }, [inputValue, fromUnit, toUnit]);

  const handleCopyResult = () => {
    const text = `${inputValue} ${conversion.fromUnit} = ${conversion.value} ${conversion.toUnit} (${conversion.explanationFa})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryIcons: Record<UnitCategory, React.ReactNode> = {
    mass: <Scale className="w-4 h-4" />,
    volume: <Droplet className="w-4 h-4" />,
    temperature: <Thermometer className="w-4 h-4" />,
    concentration: <Layers className="w-4 h-4" />,
    pressure: <Gauge className="w-4 h-4" />,
    time: <Clock className="w-4 h-4" />,
    percent: <Percent className="w-4 h-4" />,
    dimensionless: <Info className="w-4 h-4" />
  };

  const categoryLabels: Record<UnitCategory, { fa: string; en: string }> = {
    mass: { fa: 'جرم و وزن', en: 'Mass' },
    volume: { fa: 'حجم مایعات', en: 'Volume' },
    temperature: { fa: 'دما و حرارت', en: 'Temperature' },
    concentration: { fa: 'غلظت محلول‌ها', en: 'Concentration' },
    pressure: { fa: 'فشار و خلاء', en: 'Pressure' },
    time: { fa: 'زمان آزمون', en: 'Time' },
    percent: { fa: 'درصد و کسر', en: 'Percent' },
    dimensionless: { fa: 'بدون بعد', en: 'Dimensionless' }
  };

  return (
    <div className="space-y-6" id="unit-converter-container">
      {/* Category Tabs */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(categoryLabels) as UnitCategory[])
            .filter(c => c !== 'dimensionless')
            .map((catKey) => {
              const isSelected = category === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => handleCategoryChange(catKey)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800/70 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {categoryIcons[catKey]}
                  <span>{categoryLabels[catKey].fa}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Main Interactive Converter Box */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* From Unit Box */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              مقدار و واحد مبدا:
            </label>
            <div className="space-y-2">
              <input
                type="number"
                step="any"
                value={inputValue}
                onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-3 text-lg font-mono font-bold text-stone-900 dark:text-stone-100 text-left dir-ltr outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-800 dark:text-stone-200 font-medium outline-none"
              >
                {availableUnits.map((u) => (
                  <option key={u.code} value={u.code}>
                    {u.symbol} — {u.labelFa} ({u.labelEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2">
            <button
              onClick={handleSwapUnits}
              className="p-3 bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 border border-stone-200 dark:border-stone-700 rounded-full transition-all shadow-xs"
              title="جابجایی واحد مبدا و مقصد"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* To Unit Box (Result) */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              مقدار تبدیل‌شده در واحد مقصد:
            </label>
            <div className="space-y-2">
              <div className="w-full bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-xl px-4 py-3 text-lg font-mono font-extrabold text-emerald-800 dark:text-emerald-200 text-left dir-ltr flex items-center justify-between">
                <span className="truncate">
                  {conversion.success ? (
                    typeof conversion.value === 'number'
                      ? Number.isInteger(conversion.value)
                        ? conversion.value
                        : conversion.value.toFixed(6).replace(/\.?0+$/, '')
                      : '-'
                  ) : (
                    'خطا'
                  )}
                </span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {conversion.toUnit}
                </span>
              </div>

              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-800 dark:text-stone-200 font-medium outline-none"
              >
                {availableUnits.map((u) => (
                  <option key={u.code} value={u.code}>
                    {u.symbol} — {u.labelFa} ({u.labelEn})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Explanation & Copy Result */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-mono">{conversion.explanationFa}</span>
          </div>

          <button
            onClick={handleCopyResult}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg transition-colors font-medium"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'کپی شد' : 'کپی نتیجه تبدیل'}</span>
          </button>
        </div>
      </div>

      {/* Quick Reference Table for All Units in Selected Category */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">
          جدول ضریب تبدیل تمام واحدهای {categoryLabels[category].fa} (نسبت به واحد مبنا)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {availableUnits.map((unit) => {
            const isBase = unit.baseRatio === 1 && !unit.offset;
            const singleConv = convertUnit(inputValue, fromUnit, unit.code);

            return (
              <div
                key={unit.code}
                className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${
                  unit.code === toUnit
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {unit.labelFa}
                  </span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded font-bold">
                    {unit.symbol}
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-stone-500 dark:text-stone-400 font-mono text-[11px] pt-1">
                  <span>معادل:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 dir-ltr text-left">
                    {singleConv.success
                      ? Number.isInteger(singleConv.value)
                        ? singleConv.value
                        : singleConv.value.toFixed(4).replace(/\.?0+$/, '')
                      : '-'} {unit.symbol}
                  </span>
                </div>

                {isBase && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block pt-0.5">
                    ★ واحد مبنای سیستم بین‌المللی
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
