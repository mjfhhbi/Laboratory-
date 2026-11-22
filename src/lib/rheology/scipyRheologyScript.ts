import { ShearDataPoint } from './types';

/**
 * Generate executable SciPy & NumPy Python code for fitting all 5 food rheology models
 * with scipy.optimize.curve_fit and computing goodness-of-fit metrics.
 */
export function generateRheologyScipyScript(
  points: ShearDataPoint[],
  productName: string = 'Experimental Food Sample'
): string {
  const shearRatesStr = points.map(p => p.shearRate.toFixed(2)).join(', ');
  const shearStressesStr = points.map(p => p.shearStress.toFixed(2)).join(', ');

  return `"""
========================================================================
FOOD SCIENCE AI - ADVANCED RHEOLOGICAL MODEL FITTING WITH SCIPY
Product: ${productName}
Models: Newtonian, Power Law, Bingham Plastic, Casson, Herschel-Bulkley
References: Steffe (1996) / Rao (2014) / IOCCC Method 46
========================================================================
"""
import numpy as np
from scipy.optimize import curve_fit

# 1. Experimental Rheometer Data Arrays
gamma_dot = np.array([${shearRatesStr}], dtype=float)
tau_actual = np.array([${shearStressesStr}], dtype=float)

# Apparent Viscosity: eta_a = tau / gamma_dot
eta_actual = tau_actual / np.maximum(gamma_dot, 1e-6)

# 2. Model Functional Forms
def model_newtonian(gamma, mu):
    return mu * gamma

def model_power_law(gamma, K, n):
    return K * (gamma ** n)

def model_bingham(gamma, tau0, mu_p):
    return tau0 + mu_p * gamma

def model_casson(gamma, tau0c, mu_c):
    return (np.sqrt(np.maximum(0.0, tau0c)) + np.sqrt(np.maximum(0.0, mu_c)) * np.sqrt(gamma)) ** 2

def model_herschel_bulkley(gamma, tau0, K, n):
    return tau0 + K * (gamma ** n)

# 3. Model Fitting with scipy.optimize.curve_fit
models = {}

# A. Newtonian
try:
    popt_newt, _ = curve_fit(model_newtonian, gamma_dot, tau_actual, p0=[1.0], bounds=(0, np.inf))
    pred_newt = model_newtonian(gamma_dot, *popt_newt)
    r2_newt = 1.0 - np.sum((tau_actual - pred_newt)**2) / np.sum((tau_actual - np.mean(tau_actual))**2)
    rmse_newt = np.sqrt(np.mean((tau_actual - pred_newt)**2))
    models["Newtonian"] = {"params": f"mu = {popt_newt[0]:.4f} Pa.s", "r2": r2_newt, "rmse": rmse_newt}
except Exception as e:
    models["Newtonian"] = {"error": str(e)}

# B. Power Law
try:
    popt_pl, _ = curve_fit(model_power_law, gamma_dot, tau_actual, p0=[5.0, 0.5], bounds=([1e-4, 0.01], [1e4, 2.5]))
    pred_pl = model_power_law(gamma_dot, *popt_pl)
    r2_pl = 1.0 - np.sum((tau_actual - pred_pl)**2) / np.sum((tau_actual - np.mean(tau_actual))**2)
    rmse_pl = np.sqrt(np.mean((tau_actual - pred_pl)**2))
    models["Power Law"] = {"params": f"K = {popt_pl[0]:.4f} Pa.s^n, n = {popt_pl[1]:.4f}", "r2": r2_pl, "rmse": rmse_pl}
except Exception as e:
    models["Power Law"] = {"error": str(e)}

# C. Bingham Plastic
try:
    popt_bing, _ = curve_fit(model_bingham, gamma_dot, tau_actual, p0=[np.min(tau_actual)*0.5, 0.5], bounds=([0, 1e-4], [np.max(tau_actual), 1e4]))
    pred_bing = model_bingham(gamma_dot, *popt_bing)
    r2_bing = 1.0 - np.sum((tau_actual - pred_bing)**2) / np.sum((tau_actual - np.mean(tau_actual))**2)
    rmse_bing = np.sqrt(np.mean((tau_actual - pred_bing)**2))
    models["Bingham Plastic"] = {"params": f"tau0 = {popt_bing[0]:.3f} Pa, mu_p = {popt_bing[1]:.4f} Pa.s", "r2": r2_bing, "rmse": rmse_bing}
except Exception as e:
    models["Bingham Plastic"] = {"error": str(e)}

# D. Casson (Standard for Chocolate & Emulsions)
try:
    popt_cas, _ = curve_fit(model_casson, gamma_dot, tau_actual, p0=[np.min(tau_actual)*0.3, 0.2], bounds=([0, 1e-4], [np.max(tau_actual), 1e4]))
    pred_cas = model_casson(gamma_dot, *popt_cas)
    r2_cas = 1.0 - np.sum((tau_actual - pred_cas)**2) / np.sum((tau_actual - np.mean(tau_actual))**2)
    rmse_cas = np.sqrt(np.mean((tau_actual - pred_cas)**2))
    models["Casson"] = {"params": f"tau0c = {popt_cas[0]:.3f} Pa, mu_c = {popt_cas[1]:.4f} Pa.s", "r2": r2_cas, "rmse": rmse_cas}
except Exception as e:
    models["Casson"] = {"error": str(e)}

# E. Herschel-Bulkley (Comprehensive Yield Stress + Power Law)
try:
    popt_hb, _ = curve_fit(model_herschel_bulkley, gamma_dot, tau_actual, p0=[np.min(tau_actual)*0.5, 2.0, 0.4], bounds=([0, 1e-4, 0.05], [np.max(tau_actual), 1e4, 2.0]))
    pred_hb = model_herschel_bulkley(gamma_dot, *popt_hb)
    r2_hb = 1.0 - np.sum((tau_actual - pred_hb)**2) / np.sum((tau_actual - np.mean(tau_actual))**2)
    rmse_hb = np.sqrt(np.mean((tau_actual - pred_hb)**2))
    models["Herschel-Bulkley"] = {"params": f"tau0 = {popt_hb[0]:.3f} Pa, K = {popt_hb[1]:.4f} Pa.s^n, n = {popt_hb[2]:.4f}", "r2": r2_hb, "rmse": rmse_hb}
except Exception as e:
    models["Herschel-Bulkley"] = {"error": str(e)}

# 4. Print Formatted SciPy Fitting Report
print("=" * 72)
print("  SCIPY FOOD RHEOLOGY MODEL COMPARISON REPORT")
print(f"  Sample: {${JSON.stringify(productName)}} | N = {len(gamma_dot)} experimental points")
print("=" * 72)
print(f"{'Model Name':<18} | {'R^2':<8} | {'RMSE (Pa)':<10} | {'Fitted Parameters'}")
print("-" * 72)

sorted_models = sorted(models.items(), key=lambda item: item[1].get("r2", -1), reverse=True)
for name, res in sorted_models:
    if "error" in res:
        print(f"{name:<18} | FAILED: {res['error']}")
    else:
        print(f"{name:<18} | {res['r2']:<8.4f} | {res['rmse']:<10.4f} | {res['params']}")

print("=" * 72)
best_model_name = sorted_models[0][0]
best_r2 = sorted_models[0][1]['r2']
print(f"BEST FITTING MODEL: {best_model_name} (R^2 = {best_r2:.4f})")
print("=" * 72)
`;
}
