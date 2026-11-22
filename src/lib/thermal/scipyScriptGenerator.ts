import { TimeTemperaturePoint } from './types';

/**
 * Generate executable SciPy & NumPy Python code for thermal process kinetics
 * and numerical integration of time-temperature penetration curves.
 */
export function generateThermalScipyScript(
  points: TimeTemperaturePoint[],
  referenceTempC: number = 121.1,
  zValueC: number = 10.0,
  targetOrganism: string = 'Clostridium botulinum'
): string {
  const timesStr = points.map(p => p.timeMinutes.toFixed(2)).join(', ');
  const tempsStr = points.map(p => p.temperatureC.toFixed(2)).join(', ');

  return `"""
========================================================================
FOOD SCIENCE AI - THERMAL PROCESS INTEGRATION & KINETICS
Target Microorganism: ${targetOrganism}
Reference Temp: ${referenceTempC} °C | z-value: ${zValueC} °C
Scientific Standards: Toledo (2007) / Stumbo (1973) / FDA 21 CFR 113
========================================================================
"""
import numpy as np
import scipy.integrate as integrate

# 1. Product Time-Temperature History Array (Cold Spot Data)
time_min = np.array([${timesStr}], dtype=float)
temp_c = np.array([${tempsStr}], dtype=float)

T_ref = ${referenceTempC.toFixed(1)}
z_val = ${zValueC.toFixed(1)}

# 2. Bigelow Lethal Rate Function: L(T) = 10^((T - T_ref) / z)
lethal_rate = 10.0 ** ((temp_c - T_ref) / z_val)

# 3. High-Order Numerical Integration using SciPy Simpson & Trapezoidal rules
f_simpson = integrate.simpson(y=lethal_rate, x=time_min)
f_trapezoid = integrate.trapezoid(y=lethal_rate, x=time_min)
numerical_diff_pct = abs(f_simpson - f_trapezoid) / max(f_simpson, 1e-9) * 100.0

# 4. Phase Breakdown (Heating CUT, Holding, Cooling)
max_t = np.max(temp_c)
max_idx = np.argmax(temp_c)

# Segment calculations
dt = np.diff(time_min)
avg_L = (lethal_rate[:-1] + lethal_rate[1:]) / 2.0
step_F = avg_L * dt

heating_mask = (time_min[:-1] < time_min[max_idx]) & (temp_c[:-1] < max_t - 1.5)
holding_mask = np.abs(temp_c[:-1] - max_t) <= 1.5
cooling_mask = (time_min[:-1] >= time_min[max_idx]) & (temp_c[:-1] < max_t - 1.5)

f_heating = np.sum(step_F[heating_mask])
f_holding = np.sum(step_F[holding_mask])
f_cooling = np.sum(step_F[cooling_mask])

# 5. Cook Value (C0) for Nutrient Retention (z = 33°C, Tref = 100°C)
z_cook = 33.0
t_ref_cook = 100.0
l_cook = 10.0 ** ((temp_c - t_ref_cook) / z_cook)
c0_cook_value = integrate.simpson(y=l_cook, x=time_min)

# 6. Format and Output Results
print("=" * 65)
print("  THERMAL PROCESS INTEGRATION REPORT (SciPy / NumPy Engine)")
print("=" * 65)
print(f"Target Organism:             ${targetOrganism}")
print(f"Reference Temperature (Tref): {T_ref:.2f} °C")
print(f"Thermal Resistance (z-value):{z_val:.2f} °C")
print(f"Total Process Duration:      {time_min[-1] - time_min[0]:.2f} min")
print(f"Maximum Internal Temp:       {max_t:.2f} °C")
print("-" * 65)
print(f"Cumulative Lethality (F_Simpson):    {f_simpson:.4f} min")
print(f"Cumulative Lethality (F_Trapezoid):  {f_trapezoid:.4f} min")
print(f"Numerical Discrepancy:               {numerical_diff_pct:.3f} %")
print("-" * 65)
print("LETHALITY CONTRIBUTION BY PHASE:")
print(f"  • Heating / Come-Up Time (CUT):   {f_heating:.4f} min ({f_heating/max(f_trapezoid, 1e-9)*100:.1f}%)")
print(f"  • Holding / Sterilization Phase:  {f_holding:.4f} min ({f_holding/max(f_trapezoid, 1e-9)*100:.1f}%)")
print(f"  • Cooling Phase:                  {f_cooling:.4f} min ({f_cooling/max(f_trapezoid, 1e-9)*100:.1f}%)")
print("-" * 65)
print(f"Cook Value C0 (Quality Loss):       {c0_cook_value:.2f} min (Tref=100°C, z=33°C)")
target_f0 = 2.52 if abs(T_ref - 121.1) < 0.5 else 5.0
is_safe = f_simpson >= target_f0
status_str = "SAFE / PASS (Commercial Sterility Achieved)" if is_safe else "INADEQUATE / FAIL (Lethality Below Target)"
print(f"Safety Benchmark Target (12D):      {target_f0:.2f} min")
print(f"Biological Safety Assessment:       {status_str}")
print("=" * 65)
`;
}

/**
 * Generate D & z-value Regression Script in SciPy
 */
export function generateDandZRegressionScript(
  temp1: number,
  d1: number,
  temp2: number,
  d2: number
): string {
  return `"""
========================================================================
SCIPY / NUMPY D-VALUE & Z-VALUE REGRESSION SCRIPT
Fitting Thermal Inactivation Constants
========================================================================
"""
import numpy as np
from scipy import stats

# Data points: (Temperature in °C, D-value in minutes)
temps = np.array([${temp1}, ${temp2}], dtype=float)
d_values = np.array([${d1}, ${d2}], dtype=float)
log_d = np.log10(d_values)

# Linear regression: log10(D) = log10(D0) - (T - T0) / z
# slope = -1 / z  =>  z = -1 / slope
slope, intercept, r_value, p_value, std_err = stats.linregress(temps, log_d)
z_calc = -1.0 / slope

print("=" * 55)
print("  THERMAL RESISTANCE CURVE REGRESSION (SciPy)")
print("=" * 55)
print(f"Temperature 1: {temps[0]:.1f} °C  --> D1: {d_values[0]:.3f} min")
print(f"Temperature 2: {temps[1]:.1f} °C  --> D2: {d_values[1]:.3f} min")
print("-" * 55)
print(f"Regression Slope:      {slope:.5f} [log10(min) / °C]")
print(f"Calculated z-value:    {z_calc:.2f} °C")
print(f"Correlation (R^2):     {(r_value**2):.4f}")
print("=" * 55)
`;
}
