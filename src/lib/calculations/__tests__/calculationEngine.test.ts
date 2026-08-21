import {
  runFormulaCalculation,
  calculateStatistics,
  convertUnit,
  evaluateExpression,
  runCalculationEngineSelfTests
} from '../calculationEngine';

// Lightweight self-contained test helper
function describe(name: string, fn: () => void) {
  fn();
}

function test(name: string, fn: () => void) {
  try {
    fn();
  } catch (err) {
    console.error(`Test failed: ${name}`, err);
    throw err;
  }
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toBeCloseTo(expected: number, precision: number = 2) {
      const diff = Math.abs(actual - expected);
      const tolerance = Math.pow(10, -precision) / 2;
      if (diff > tolerance) {
        throw new Error(`Expected ${actual} to be close to ${expected} (diff: ${diff}, tol: ${tolerance})`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (!(actual > expected)) {
        throw new Error(`Expected ${actual} > ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if (!(actual >= expected)) {
        throw new Error(`Expected ${actual} >= ${expected}`);
      }
    },
    toBeLessThan(expected: number) {
      if (!(actual < expected)) {
        throw new Error(`Expected ${actual} < ${expected}`);
      }
    }
  };
}

describe('Calculation Engine - Food Science & Chemistry Laboratory', () => {
  // 1. Moisture Content
  test('Moisture Content (AOAC 925.10 / INSO 2406) calculation and trace', () => {
    const res = runFormulaCalculation('moisture_oven', {
      m0: 18.5421, // empty dish
      m1: 23.5421, // dish + sample (5.0000g sample)
      m2: 22.8421  // dish + dry sample (0.7000g water loss -> 14.00%)
    }, { decimals: 2 });

    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(14.0, 2);
    expect(res.formattedValue).toBe('14.00');
    expect(res.unit).toBe('%');
    expect(res.isScientificallyValid).toBe(true);
    expect(res.trace.length).toBeGreaterThanOrEqual(4);
    expect(res.errors.length).toBe(0);
  });

  test('Moisture Content detects illogical weight gain (m2 > m1)', () => {
    const res = runFormulaCalculation('moisture_oven', {
      m0: 18.5,
      m1: 23.5,
      m2: 24.0 // heavier after drying!
    });

    expect(res.warnings.length).toBeGreaterThan(0);
    expect(res.warnings.some(w => w.includes('افزایش وزن') || w.includes('بیشتر است'))).toBe(true);
  });

  // 2. Ash Content
  test('Ash Content (AOAC 923.03 / INSO 5626) calculation', () => {
    const res = runFormulaCalculation('ash_furnace', {
      m0: 25.0000,
      m1: 30.0000, // 5g sample
      m2: 25.0650  // 0.0650g ash -> 1.30%
    }, { decimals: 2 });

    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(1.30, 2);
    expect(res.formattedValue).toBe('1.30');
    expect(res.unit).toBe('%');
  });

  // 3. Protein Kjeldahl
  test('Crude Protein (AOAC 991.20 / INSO 639) calculation with Dairy Factor F=6.38', () => {
    const res = runFormulaCalculation('protein_kjeldahl', {
      vs: 15.2,
      vb: 0.1,
      n_acid: 0.1,
      m_sample: 5.0,
      f_factor: 6.38
    }, { decimals: 2 });

    // Net = 15.1 mL * 0.1 * 0.014007 * 100 / 5.0 = 0.42301% N * 6.38 = 2.6988% -> 2.70%
    expect(res.success).toBe(true);
    expect(res.formattedValue).toBe('2.70');
    expect(res.unit).toBe('%');
    expect(res.isScientificallyValid).toBe(true);
  });

  // 4. Fat Soxhlet
  test('Crude Fat (AOAC 920.39 / INSO 1993) calculation', () => {
    const res = runFormulaCalculation('fat_soxhlet', {
      m1: 120.5000,
      m2: 120.8500, // 0.3500g fat
      m_sample: 10.0000 // 10g sample -> 3.50%
    }, { decimals: 2 });

    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(3.50, 2);
    expect(res.formattedValue).toBe('3.50');
  });

  // 5. Dilution Equation C1V1 = C2V2
  test('Dilution Equation correctly calculates required aliquot volume V1', () => {
    const res = runFormulaCalculation('dilution_c1v1', {
      c1: 5.0, // 5M stock
      c2: 0.2, // 0.2M target
      v2: 250  // 250 mL
    }, { decimals: 2 });

    // V1 = (0.2 * 250) / 5 = 10.00 mL
    expect(res.success).toBe(true);
    expect(res.value).toBe(10);
    expect(res.formattedValue).toBe('10.00');
    expect(res.unit).toBe('mL');
  });

  // 6. Statistics Engine
  test('Statistical Summary calculates Mean, StdDev, RSD, and Error %', () => {
    const data = [12.4, 12.6, 12.5, 12.3, 12.7];
    const stats = calculateStatistics(data, 12.5, '%');

    expect(stats.count).toBe(5);
    expect(stats.mean).toBeCloseTo(12.5, 2);
    expect(stats.min).toBe(12.3);
    expect(stats.max).toBe(12.7);
    expect(stats.range).toBeCloseTo(0.4, 2);
    expect(stats.stdDev).toBeGreaterThan(0);
    expect(stats.rsdPercent).toBeLessThan(5);
    expect(stats.errorPercentAgainstRef).toBeCloseTo(0, 2);
  });

  // 7. Dixon Q-Test Outlier Detection
  test('Dixon Q-Test identifies extreme outlier in replicates', () => {
    const data = [5.1, 5.2, 5.15, 9.8]; // 9.8 is obvious outlier
    const stats = calculateStatistics(data);

    expect(stats.outliers.length).toBeGreaterThan(0);
    expect(stats.outliers[0].value).toBe(9.8);
    expect(stats.warnings.length).toBeGreaterThan(0);
  });

  // 8. Unit Converter
  test('Unit Converter performs exact conversions across categories', () => {
    // Mass
    const gToKg = convertUnit(500, 'g', 'kg');
    expect(gToKg.success).toBe(true);
    expect(gToKg.value).toBe(0.5);

    // Temperature (Celsius to Fahrenheit and Kelvin)
    const cToF = convertUnit(100, 'c', 'f');
    expect(cToF.success).toBe(true);
    expect(cToF.value).toBeCloseTo(212, 1);

    const cToK = convertUnit(0, 'c', 'k');
    expect(cToK.success).toBe(true);
    expect(cToK.value).toBeCloseTo(273.15, 2);

    // Volume
    const lToMl = convertUnit(1.5, 'l', 'ml');
    expect(lToMl.success).toBe(true);
    expect(lToMl.value).toBe(1500);

    // Incompatible categories fail gracefully
    const invalid = convertUnit(10, 'g', 'ml');
    expect(invalid.success).toBe(false);
  });

  // 9. Safe Expression Evaluator
  test('Expression Evaluator processes complex formulas without eval()', () => {
    const res = evaluateExpression('((a * 2) + sqrt(b)) / (c - 1)', { a: 5, b: 16, c: 3 });
    // ((5 * 2) + 4) / (3 - 1) = (10 + 4) / 2 = 14 / 2 = 7
    expect(res.result).toBe(7);
  });

  // 10. Self Test Suite
  test('Calculation Engine Self-Test runner reports 100% pass', () => {
    const testSuite = runCalculationEngineSelfTests();
    expect(testSuite.total).toBeGreaterThanOrEqual(10);
    expect(testSuite.failed).toBe(0);
    expect(testSuite.passed).toBe(testSuite.total);
  });
});
