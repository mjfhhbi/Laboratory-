import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Copy, 
  Check, 
  Info, 
  Layers, 
  PieChart, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { FoodChemistryTest } from '../../types/foodChemistry';

interface LiveChemicalCalculatorProps {
  tests: FoodChemistryTest[];
  selectedTestId?: string;
  onSelectTest?: (test: FoodChemistryTest) => void;
}

export const LiveChemicalCalculator: React.FC<LiveChemicalCalculatorProps> = ({
  tests,
  selectedTestId,
  onSelectTest
}) => {
  const [activeTestId, setActiveTestId] = useState<string>(selectedTestId || tests[0]?.id || 'chem-moisture-oven');
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  // Proximate Balance State for Whole Food Calculator
  const [proximateInputs, setProximateInputs] = useState({
    moisture: 12.5,
    ash: 1.2,
    protein: 11.8,
    fat: 3.4,
    fiber: 2.1
  });

  const currentTest = tests.find(t => t.id === activeTestId) || tests[0];

  const handleInputChange = (symbol: string, val: number) => {
    setInputs(prev => ({ ...prev, [symbol]: val }));
  };

  const handleReset = () => {
    setInputs({});
  };

  // Perform Calculation for Selected Test
  const calculateResult = (): { value: number; formatted: string; status: 'ok' | 'warning'; note?: string } => {
    if (!currentTest) return { value: 0, formatted: '0', status: 'ok' };

    const vars: Record<string, number> = {
      ...currentTest.calculationRules.variables.reduce((acc, v) => ({ ...acc, [v.symbol]: v.defaultValue ?? 0 }), {}),
      ...inputs
    };

    let result = 0;

    switch (currentTest.id) {
      case 'chem-moisture-oven': {
        const m1 = vars['m1'];
        const m2 = vars['m2'];
        const m0 = vars['m0'];
        if (m1 - m0 <= 0) return { value: 0, formatted: 'خطای وزن نمونه', status: 'warning' };
        result = ((m1 - m2) / (m1 - m0)) * 100;
        break;
      }
      case 'chem-ash-furnace': {
        const m2 = vars['m2'];
        const m0 = vars['m0'];
        const m1 = vars['m1'];
        if (m1 - m0 <= 0) return { value: 0, formatted: 'خطای وزن نمونه', status: 'warning' };
        result = ((m2 - m0) / (m1 - m0)) * 100;
        break;
      }
      case 'chem-protein-kjeldahl': {
        const Vs = vars['Vs'];
        const Vb = vars['Vb'];
        const N = vars['N'];
        const m = vars['m'];
        const F = vars['F'];
        if (m <= 0) return { value: 0, formatted: 'خطای وزن نمونه', status: 'warning' };
        const nitrogen = ((Vs - Vb) * N * 1.4007) / m;
        result = nitrogen * F;
        break;
      }
      case 'chem-fat-soxhlet': {
        const m2 = vars['m2'];
        const m1 = vars['m1'];
        const m = vars['m'];
        if (m <= 0) return { value: 0, formatted: 'خطای وزن نمونه', status: 'warning' };
        result = ((m2 - m1) / m) * 100;
        break;
      }
      case 'chem-salt-mohr': {
        const V = vars['V'];
        const Vb = vars['Vb'];
        const N = vars['N'];
        const m = vars['m'];
        if (m <= 0) return { value: 0, formatted: 'خطای وزن نمونه', status: 'warning' };
        result = ((V - Vb) * N * 0.05844 * 100) / m;
        break;
      }
      case 'chem-acidity-titration': {
        const V = vars['V'];
        const N = vars['N'];
        const meq = vars['meq'];
        const m = vars['m'];
        if (m <= 0) return { value: 0, formatted: 'خطای وزن نمونه', status: 'warning' };
        result = (V * N * meq * 100) / m;
        break;
      }
      case 'chem-refractometry-brix': {
        const brixObs = vars['Brix_obs'];
        const temp = vars['Temp'];
        const corr = (temp - 20) * 0.07;
        result = brixObs + corr;
        break;
      }
      case 'chem-fiber-tdf': {
        const R = vars['R_avg'];
        const P = vars['P'];
        const A = vars['A'];
        const B = vars['B'];
        const m = vars['m_avg'];
        if (m <= 0) return { value: 0, formatted: 'خطای وزن نمونه', status: 'warning' };
        result = ((R - P - A - B) / m) * 100;
        break;
      }
      case 'chem-sugars-lane-eynon': {
        const F = vars['F'];
        const V1 = vars['V1'];
        const Vtot = vars['V_total'];
        const m = vars['m'];
        if (V1 <= 0 || m <= 0) return { value: 0, formatted: 'خطای حجم تیتراسیون', status: 'warning' };
        result = (F * Vtot * 100) / (V1 * m * 1000);
        break;
      }
      case 'chem-pigments-anthocyanins': {
        const a1 = (vars['A520_pH1'] || 0.852) - (vars['A700_pH1'] || 0.024);
        const a2 = (vars['A520_pH45'] || 0.120) - (vars['A700_pH45'] || 0.022);
        const A = a1 - a2;
        const df = vars['DF'] || 10;
        const mw = vars['MW'] || 449.2;
        const eps = vars['Epsilon'] || 26900;
        result = (A * mw * df * 1000) / (eps * 1);
        break;
      }
      case 'chem-antioxidants-folin': {
        const abs = vars['Abs765'] || 0.485;
        const slope = vars['Slope'] || 0.0095;
        const intercept = vars['Intercept'] || 0.015;
        const conc = (abs - intercept) / slope;
        const vext = vars['V_ext'] || 25;
        const m = vars['m'] || 1.0;
        result = (conc * (vext / 1000)) / m;
        break;
      }
      case 'chem-lipids-peroxide': {
        const vs = vars['Vs'];
        const vb = vars['Vb'];
        const n = vars['NThio'];
        const m = vars['m'];
        if (m <= 0) return { value: 0, formatted: 'خطای وزن روغن', status: 'warning' };
        result = ((vs - vb) * n * 1000) / m;
        break;
      }
      case 'chem-vitamins-ascorbic': {
        const vs = vars['Vs'];
        const vb = vars['Vb'];
        const f = vars['F'];
        const vsample = vars['Vsample'] || 10;
        if (vsample <= 0) return { value: 0, formatted: 'خطای حجم نمونه', status: 'warning' };
        result = ((vs - vb) * f * 100) / vsample;
        break;
      }
      default:
        result = 0;
    }

    const sigFig = currentTest.calculationRules.significantFigures || 2;
    const formatted = `${result.toFixed(sigFig)} ${currentTest.calculationRules.unitResult}`;
    return { value: result, formatted, status: 'ok' };
  };

  const calculated = calculateResult();

  // Proximate Balance Calculations
  const totalDryMatter = 100 - proximateInputs.moisture;
  const carbohydratesByDiff = Math.max(0, 100 - (proximateInputs.moisture + proximateInputs.ash + proximateInputs.protein + proximateInputs.fat + proximateInputs.fiber));
  const totalCaloriesKcal = (proximateInputs.protein * 4) + (proximateInputs.fat * 9) + (carbohydratesByDiff * 4) + (proximateInputs.fiber * 2);

  const handleCopyReport = () => {
    const text = `گزارش محاسبه شیمیایی مواد غذایی:\nآزمون: ${currentTest.titleFa} (${currentTest.code})\nاستاندارد: ${currentTest.primaryStandard.organization} ${currentTest.primaryStandard.standardNumber}\nنتیجه محاسبه: ${calculated.formatted}\nتاریخ: ${new Date().toLocaleDateString('fa-IR')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="live-chemical-calculator-container" className="space-y-8">
      {/* Test Calculator Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg sm:text-xl font-bold">موتور محاسبات استاندارد آزمون‌های شیمیایی</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              محاسبه آنی نتایج آزمون‌های تحلیلی بر اساس فرمول‌های معتبر استانداردهای INSO / AOAC / ISO.
            </p>
          </div>

          {/* Test Selector Dropdown */}
          <div className="w-full md:w-80">
            <label className="text-xs text-slate-400 block mb-1">انتخاب آزمون شیمیایی:</label>
            <select
              id="select-chemical-test-calculator"
              value={activeTestId}
              onChange={(e) => {
                setActiveTestId(e.target.value);
                setInputs({});
              }}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {tests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} - {t.titleFa}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculator Body */}
        <div className="p-6 space-y-6">
          {/* Formula Latex Display */}
          <div className="bg-slate-900 p-4 rounded-xl text-white space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-indigo-300">فرمول رسمی استاندارد ({currentTest.primaryStandard.organization} {currentTest.primaryStandard.standardNumber}):</span>
              <span className="font-mono text-slate-300">{currentTest.calculationRules.unitResult}</span>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg text-center font-mono text-sm sm:text-base text-indigo-200 overflow-x-auto" dir="ltr">
              {currentTest.calculationRules.formulaLatex}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTest.calculationRules.formulaDescriptionFa}
            </p>
          </div>

          {/* Dynamic Variables Inputs Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                مقادیر خام آزمایشگاهی ورودی (Raw Laboratory Data):
              </h3>
              <button
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                بازنشانی مقادیر پیش‌فرض
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentTest.calculationRules.variables.map((v) => {
                const currentVal = inputs[v.symbol] !== undefined ? inputs[v.symbol] : (v.defaultValue ?? 0);

                return (
                  <div key={v.symbol} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span className="font-mono text-indigo-700 text-sm">{v.symbol}</span>
                      <span className="text-[11px] text-slate-500 font-normal">واحد: {v.unit}</span>
                    </label>
                    <p className="text-[11px] text-slate-600 line-clamp-1" title={v.descriptionFa}>
                      {v.descriptionFa}
                    </p>
                    <input
                      type="number"
                      step="any"
                      value={currentVal}
                      onChange={(e) => handleInputChange(v.symbol, parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Calculated Output Result Banner */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 block">
                  نتیجه نهایی محاسبه آزمون ({currentTest.analyteFa}):
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono tracking-tight">
                  {calculated.formatted}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-copy-calc-report"
                onClick={handleCopyReport}
                className="px-3.5 py-2 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'کپی شد!' : 'کپی گزارش آزمون'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Proximate Balance & Calorie Calculator Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              موازنه جامع ترکیبات اصلی (Weende Proximate Balance & Calories)
            </h3>
            <p className="text-xs text-slate-500">
              محاسبه خودکار کربوهیدرات تفاضلی (Carbohydrates by Difference)، درصد ماده خشک (Total Solids) و کالری کل با ضرایب آت‌واتر (Atwater).
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
            Codex / FAO Standard
          </span>
        </div>

        {/* Inputs Grid for 5 Proximate Components */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <label className="text-xs font-bold text-slate-800 block">رطوبت (٪)</label>
            <input
              type="number"
              step="0.1"
              value={proximateInputs.moisture}
              onChange={(e) => setProximateInputs({ ...proximateInputs, moisture: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <label className="text-xs font-bold text-slate-800 block">خاکستر (٪)</label>
            <input
              type="number"
              step="0.1"
              value={proximateInputs.ash}
              onChange={(e) => setProximateInputs({ ...proximateInputs, ash: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <label className="text-xs font-bold text-slate-800 block">پروتئین (٪)</label>
            <input
              type="number"
              step="0.1"
              value={proximateInputs.protein}
              onChange={(e) => setProximateInputs({ ...proximateInputs, protein: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <label className="text-xs font-bold text-slate-800 block">چربی (٪)</label>
            <input
              type="number"
              step="0.1"
              value={proximateInputs.fat}
              onChange={(e) => setProximateInputs({ ...proximateInputs, fat: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <label className="text-xs font-bold text-slate-800 block">فیبر رژیمی (٪)</label>
            <input
              type="number"
              step="0.1"
              value={proximateInputs.fiber}
              onChange={(e) => setProximateInputs({ ...proximateInputs, fiber: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
            />
          </div>
        </div>

        {/* Proximate Output Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center space-y-1">
            <div className="text-xs text-indigo-700 font-semibold">ماده خشک کل (Total Dry Matter)</div>
            <div className="text-2xl font-black text-indigo-950 font-mono">{totalDryMatter.toFixed(2)} %</div>
            <div className="text-[11px] text-indigo-600">۱۰۰ منهای درصد رطوبت</div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center space-y-1">
            <div className="text-xs text-emerald-700 font-semibold">کربوهیدرات تفاضلی (Available CHO)</div>
            <div className="text-2xl font-black text-emerald-950 font-mono">{carbohydratesByDiff.toFixed(2)} %</div>
            <div className="text-[11px] text-emerald-600">۱۰۰ منهای (رطوبت+خاکستر+پروتئین+چربی+فیبر)</div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center space-y-1">
            <div className="text-xs text-amber-700 font-semibold">انرژی کل ماده غذایی (Calories)</div>
            <div className="text-2xl font-black text-amber-950 font-mono">{totalCaloriesKcal.toFixed(1)} kcal/100g</div>
            <div className="text-[11px] text-amber-600">بر اساس ۴-۹-۴-۲ Atwater Factors</div>
          </div>
        </div>
      </div>
    </div>
  );
};
