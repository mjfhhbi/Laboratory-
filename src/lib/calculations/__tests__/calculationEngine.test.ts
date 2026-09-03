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

describe('Calculation Engine - Comprehensive Food Science & Chemistry Laboratory', () => {
  // 1. % w/w
  test('Weight Percentage (% w/w) calculation', () => {
    const res = runFormulaCalculation('pct_weight_ww', { m_solute: 5, m_total: 100 }, { decimals: 2 });
    expect(res.success).toBe(true);
    expect(res.value).toBe(5.0);
    expect(res.formattedValue).toBe('5.00');
    expect(res.unit).toBe('% (w/w)');
  });

  // 2. % v/v
  test('Volume Percentage (% v/v) calculation', () => {
    const res = runFormulaCalculation('pct_volume_vv', { v_solute: 70, v_total: 100 }, { decimals: 1 });
    expect(res.success).toBe(true);
    expect(res.value).toBe(70.0);
    expect(res.formattedValue).toBe('70.0');
    expect(res.unit).toBe('% (v/v)');
  });

  // 3. % w/v
  test('Weight/Volume Percentage (% w/v) calculation', () => {
    const res = runFormulaCalculation('pct_weight_volume_wv', { m_solute: 1.0, v_total: 100 }, { decimals: 2 });
    expect(res.success).toBe(true);
    expect(res.value).toBe(1.0);
    expect(res.formattedValue).toBe('1.00');
    expect(res.unit).toBe('% (w/v)');
  });

  // 4. Molarity (M)
  test('Molarity calculation with purity assay', () => {
    // 5.844 g NaCl (MW = 58.44) in 1000 mL at 100% purity -> 0.1000 M
    const res = runFormulaCalculation('molarity_sol', {
      m_substance: 5.844,
      mw: 58.44,
      v_solution: 1000,
      assay: 100
    }, { decimals: 4 });
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(0.1, 4);
    expect(res.formattedValue).toBe('0.1000');
    expect(res.unit).toBe('M');
  });

  // 5. Normality (N)
  test('Normality calculation with valence', () => {
    // 4.904 g H2SO4 (MW = 98.08, n = 2, eq.wt = 49.04) in 1000 mL -> 0.1000 N
    const res = runFormulaCalculation('normality_sol', {
      m_substance: 4.904,
      mw: 98.08,
      valence: 2,
      v_solution: 1000,
      assay: 100
    }, { decimals: 4 });
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(0.1, 4);
    expect(res.formattedValue).toBe('0.1000');
    expect(res.unit).toBe('N');
  });

  // 6. ppm
  test('ppm calculation (mg/kg)', () => {
    const res = runFormulaCalculation('ppm_conc', { m_analyte_mg: 2.5, sample_mass_kg: 1.0 }, { decimals: 2 });
    expect(res.success).toBe(true);
    expect(res.value).toBe(2.5);
    expect(res.formattedValue).toBe('2.50');
    expect(res.unit).toBe('ppm');
  });

  // 7. ppb
  test('ppb calculation (ug/kg)', () => {
    const res = runFormulaCalculation('ppb_conc', { m_analyte_ug: 5.0, sample_mass_kg: 1.0 }, { decimals: 1 });
    expect(res.success).toBe(true);
    expect(res.value).toBe(5.0);
    expect(res.formattedValue).toBe('5.0');
    expect(res.unit).toBe('ppb');
  });

  // 8. Dilution (C1V1 = C2V2)
  test('Dilution equation aliquot V1 and DF', () => {
    const res = runFormulaCalculation('dilution_c1v1', { c1: 1.0, c2: 0.05, v2: 250 }, { decimals: 2 });
    // V1 = (0.05 * 250) / 1.0 = 12.50 mL
    expect(res.success).toBe(true);
    expect(res.value).toBe(12.5);
    expect(res.formattedValue).toBe('12.50');
    expect(res.unit).toBe('mL');
  });

  // 9. Moisture Content
  test('Moisture Content (AOAC 925.10 / INSO 2406)', () => {
    const res = runFormulaCalculation('moisture_oven', {
      m0: 18.5421,
      m1: 23.5421,
      m2: 22.8421
    }, { decimals: 2 });
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(14.0, 2);
    expect(res.formattedValue).toBe('14.00');
    expect(res.unit).toBe('%');
  });

  // 10. Dry Matter
  test('Dry Matter & Total Solids (% DM)', () => {
    const res = runFormulaCalculation('dry_matter_solids', {
      m0: 20.0,
      m1: 25.0,
      m2: 20.75
    }, { decimals: 2 });
    // sample = 5.0g, dry = 0.75g -> 15.00% DM
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(15.0, 2);
    expect(res.formattedValue).toBe('15.00');
  });

  // 11. Ash
  test('Ash Content (AOAC 923.03 / INSO 5626)', () => {
    const res = runFormulaCalculation('ash_furnace', {
      m0: 25.0000,
      m1: 30.0000,
      m2: 25.0650
    }, { decimals: 2 });
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(1.30, 2);
    expect(res.formattedValue).toBe('1.30');
  });

  // 12. Protein Kjeldahl
  test('Crude Protein (AOAC 991.20 / INSO 639)', () => {
    const res = runFormulaCalculation('protein_kjeldahl', {
      vs: 15.2,
      vb: 0.1,
      n_acid: 0.1,
      m_sample: 5.0,
      f_factor: 6.38
    }, { decimals: 2 });
    expect(res.success).toBe(true);
    expect(res.formattedValue).toBe('2.70');
  });

  // 13. Fat Soxhlet
  test('Crude Fat Soxhlet (AOAC 920.39 / INSO 2850)', () => {
    const res = runFormulaCalculation('fat_soxhlet', {
      m1: 100.0,
      m2: 100.45,
      m_sample: 5.0
    }, { decimals: 2 });
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(9.0, 2);
    expect(res.formattedValue).toBe('9.00');
  });

  // 14. Fiber Weende
  test('Crude Fiber Weende (AOAC 962.09 / INSO 3105)', () => {
    const res = runFormulaCalculation('fiber_weende', {
      m1: 31.4250,
      m2: 31.3500,
      m_sample: 2.0000
    }, { decimals: 2 });
    // fiber = 0.0750 / 2 = 3.75%
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(3.75, 2);
    expect(res.formattedValue).toBe('3.75');
  });

  // 15. Carbohydrate & Atwater Energy
  test('Carbohydrate by Difference & Atwater Calories', () => {
    const res = runFormulaCalculation('carbohydrate_energy', {
      moisture: 10.0,
      ash: 2.0,
      protein: 10.0,
      fat: 5.0,
      fiber: 0.0
    }, { decimals: 2 });
    // Total carb = 100 - (10 + 2 + 10 + 5) = 73.00%
    // Calories = (4*10) + (9*5) + (4*73) = 40 + 45 + 292 = 377 kcal
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(73.0, 2);
    expect(res.formattedValue).toBe('73.00');
    expect(res.metadata?.caloriesKcalPer100g).toBeCloseTo(377, 1);
  });

  // 16. Titratable Acidity
  test('Titratable Acidity (Lactic acid in milk / yogurt)', () => {
    const res = runFormulaCalculation('titratable_acidity', {
      v_naoh: 4.2,
      n_naoh: 0.1,
      m_sample: 10.0,
      acid_factor: 0.09008
    }, { decimals: 3 });
    // % Acidity = (4.2 * 0.1 * 0.09008 * 100) / 10 = 0.3783%
    expect(res.success).toBe(true);
    expect(res.formattedValue).toBe('0.378');
    expect(res.unit).toBe('%');
  });

  // 17. pH & Buffer
  test('pH & Henderson-Hasselbalch buffer calculation', () => {
    const res = runFormulaCalculation('ph_ionic_calculations', {
      pka: 4.76,
      conc_base: 0.10,
      conc_acid: 0.10
    }, { decimals: 2 });
    // log10(1) = 0 -> pH = 4.76
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(4.76, 2);
    expect(res.formattedValue).toBe('4.76');
  });

  // 18. Salt Mohr
  test('Salt (% NaCl by Mohr Titration)', () => {
    const res = runFormulaCalculation('salt_mohr', {
      vs: 8.6,
      vb: 0.1,
      n_agno3: 0.1,
      m_sample: 5.00
    }, { decimals: 2 });
    // Net = 8.5 mL * 0.1 * 0.05844 * 100 / 5 = 0.99348% -> 0.99%
    expect(res.success).toBe(true);
    expect(res.formattedValue).toBe('0.99');
    expect(res.unit).toBe('%');
  });

  // 19. Brix & Temp Correction
  test('Brix Refractometry with Temperature Correction', () => {
    const res = runFormulaCalculation('brix_refractometry', {
      brix_obs: 28.0,
      temperature: 20.0,
      dilution_factor: 1.0
    }, { decimals: 2 });
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(28.0, 2);
    expect(res.formattedValue).toBe('28.00');
    expect(res.unit).toBe('°Brix');
  });

  // 20. Yield
  test('Food Processing Recovery & Yield Percentage', () => {
    const res = runFormulaCalculation('process_yield', {
      m_product: 420.0,
      m_raw: 500.0
    }, { decimals: 2 });
    // Yield = (420 / 500) * 100 = 84.00%
    expect(res.success).toBe(true);
    expect(res.value).toBe(84.0);
    expect(res.formattedValue).toBe('84.00');
    expect(res.metadata?.lossPercent).toBe(16.0);
  });

  // 21. Analytical Recovery
  test('Spike Analytical Recovery (% Recovery)', () => {
    const res = runFormulaCalculation('analytical_recovery', {
      c_spiked: 9.6,
      c_unspiked: 0.2,
      c_added: 10.0
    }, { decimals: 2 });
    // Net = 9.4 -> Recovery = (9.4 / 10) * 100 = 94.00%
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(94.0, 2);
    expect(res.formattedValue).toBe('94.00');
  });

  // 22. Pearson Square
  test('Pearson Square mass balance blending', () => {
    // Cream 40% (A), Skim milk 0.1% (B), Target 3.0% (T), Batch 1000 kg
    // Parts A = |3.0 - 0.1| = 2.9, Parts B = |40.0 - 3.0| = 37.0, Total = 39.9
    // Mass A = 1000 * (2.9 / 39.9) = 72.68 kg
    const res = runFormulaCalculation('pearson_square', {
      c_a: 40.0,
      c_b: 0.1,
      c_target: 3.0,
      m_total: 1000.0
    }, { decimals: 2 });
    expect(res.success).toBe(true);
    expect(res.metadata?.massA).toBeCloseTo(72.68, 1);
  });

  // 23. Peroxide Value
  test('Peroxide Value in Fats & Oils', () => {
    const res = runFormulaCalculation('peroxide_value', {
      vs: 2.4,
      vb: 0.05,
      n_thio: 0.01,
      m_fat: 5.00
    }, { decimals: 2 });
    // Net = 2.35 mL * 0.01 * 1000 / 5 = 4.70 meq O2/kg
    expect(res.success).toBe(true);
    expect(res.formattedValue).toBe('4.70');
    expect(res.unit).toBe('meq O₂/kg');
  });

  // 24. Unit Conversions
  test('Unit Converter across Mass, Volume, Temperature, Pressure, Concentration', () => {
    // Mass
    expect(convertUnit(500, 'g', 'kg').value).toBe(0.5);
    expect(convertUnit(1, 'ton', 'kg').value).toBe(1000);

    // Volume
    expect(convertUnit(1.5, 'l', 'ml').value).toBe(1500);
    expect(convertUnit(1000, 'ul', 'ml').value).toBe(1);

    // Temperature (Celsius, Fahrenheit, Kelvin, Rankine)
    expect(convertUnit(100, 'c', 'f').value).toBeCloseTo(212, 1);
    expect(convertUnit(0, 'c', 'k').value).toBeCloseTo(273.15, 2);
    expect(convertUnit(0, 'c', 'r').value).toBeCloseTo(491.67, 2);

    // Pressure
    expect(convertUnit(1, 'bar', 'kpa').value).toBeCloseTo(100, 1);
    expect(convertUnit(1, 'atm', 'mmhg').value).toBeCloseTo(760, 1);

    // Concentration
    expect(convertUnit(1000, 'ppm', 'g_l').value).toBeCloseTo(1, 2);
    expect(convertUnit(1, 'ppm', 'ppb').value).toBeCloseTo(1000, 1);
  });

  // 25. Statistical Engine
  test('Statistical Summary calculates Mean, StdDev, RSD, and Error %', () => {
    const data = [12.4, 12.6, 12.5, 12.3, 12.7];
    const stats = calculateStatistics(data, 12.5, '%');

    expect(stats.count).toBe(5);
    expect(stats.mean).toBeCloseTo(12.5, 2);
    expect(stats.stdDev).toBeGreaterThan(0);
    expect(stats.rsdPercent).toBeLessThan(5);
    expect(stats.errorPercentAgainstRef).toBeCloseTo(0, 2);
  });

  // 26. Dixon Q-Test Outlier Detection
  test('Dixon Q-Test identifies extreme outlier in replicates', () => {
    const data = [5.1, 5.2, 5.15, 9.8];
    const stats = calculateStatistics(data);

    expect(stats.outliers.length).toBeGreaterThan(0);
    expect(stats.outliers[0].value).toBe(9.8);
  });
});
