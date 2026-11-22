import { IsothermPoint } from './types';

/**
 * Generate executable SciPy & NumPy Python code for fitting all 6 moisture sorption isotherm models
 * with scipy.optimize.curve_fit and computing goodness-of-fit metrics (R^2, RMSE, E%).
 */
export function generateIsothermScipyScript(
  points: IsothermPoint[],
  productName: string = 'Food Moisture Sorption Sample'
): string {
  const awStr = points.map(p => p.waterActivity.toFixed(3)).join(', ');
  const mStr = points.map(p => p.moistureContent.toFixed(2)).join(', ');

  return `"""
========================================================================
FOOD SCIENCE AI - MOISTURE SORPTION ISOTHERMS FITTING (SCIPY / NUMPY)
Product: ${productName}
Models: GAB, BET, Oswin, Smith, Langmuir, Peleg
References: COST 90 (Wolf et al. 1985) / Labuza (1984) / Peleg (1993)
========================================================================
"""
import numpy as np
from scipy.optimize import curve_fit

# 1. Experimental Isotherm Arrays
aw_data = np.array([${awStr}], dtype=float)
m_data = np.array([${mStr}], dtype=float)

# 2. Structural Model Definitions
def model_gab(aw, m0, C, K):
    # GAB: m = (m0 * C * K * aw) / [(1 - K * aw) * (1 - K * aw + C * K * aw)]
    denom = (1.0 - K * aw) * (1.0 - K * aw + C * K * aw)
    return (m0 * C * K * aw) / np.maximum(denom, 1e-7)

def model_bet(aw, m0, C):
    # BET: m = (m0 * C * aw) / [(1 - aw) * (1 - aw + C * aw)]
    denom = (1.0 - aw) * (1.0 - aw + C * aw)
    return (m0 * C * aw) / np.maximum(denom, 1e-7)

def model_oswin(aw, a, b):
    # Oswin: m = a * [aw / (1 - aw)]^b
    ratio = np.maximum(aw / np.maximum(1.0 - aw, 1e-5), 1e-7)
    return a * (ratio ** b)

def model_smith(aw, a, b):
    # Smith: m = a - b * ln(1 - aw)
    return a - b * np.log(np.maximum(1.0 - aw, 1e-5))

def model_langmuir(aw, m0, C):
    # Langmuir: m = (m0 * C * aw) / (1 + C * aw)
    return (m0 * C * aw) / (1.0 + C * aw)

def model_peleg(aw, k1, n1, k2, n2):
    # Peleg (1993): m = k1 * aw^n1 + k2 * aw^n2
    return k1 * (aw ** n1) + k2 * (aw ** n2)

# Helper function to compute R^2, RMSE, and E% (Mean Relative Percentage Deviation)
def evaluate_fit(y_actual, y_pred):
    ss_tot = np.sum((y_actual - np.mean(y_actual)) ** 2)
    ss_res = np.sum((y_actual - y_pred) ** 2)
    r2 = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 1.0
    rmse = np.sqrt(np.mean((y_actual - y_pred) ** 2))
    e_pct = np.mean(np.abs((y_actual - y_pred) / np.maximum(y_actual, 1e-5))) * 100.0
    return r2, rmse, e_pct

results = {}

# A. GAB Model (COST 90 Reference Standard)
try:
    popt_gab, _ = curve_fit(
        model_gab, aw_data, m_data,
        p0=[6.0, 15.0, 0.85],
        bounds=([0.5, 1.0, 0.3], [35.0, 500.0, 1.00])
    )
    pred_gab = model_gab(aw_data, *popt_gab)
    r2, rmse, ep = evaluate_fit(m_data, pred_gab)
    results["GAB (COST 90)"] = {
        "params": f"m0={popt_gab[0]:.2f} % d.b., C={popt_gab[1]:.2f}, K={popt_gab[2]:.4f}",
        "m0": popt_gab[0], "r2": r2, "rmse": rmse, "ep": ep
    }
except Exception as e:
    results["GAB (COST 90)"] = {"error": str(e)}

# B. BET Model (Low-aw Range: aw <= 0.50)
try:
    mask_bet = aw_data <= 0.52
    if np.sum(mask_bet) >= 3:
        popt_bet, _ = curve_fit(
            model_bet, aw_data[mask_bet], m_data[mask_bet],
            p0=[5.0, 10.0],
            bounds=([0.5, 1.0], [30.0, 500.0])
        )
        pred_bet = model_bet(aw_data[mask_bet], *popt_bet)
        r2, rmse, ep = evaluate_fit(m_data[mask_bet], pred_bet)
        results["BET (aw <= 0.5)"] = {
            "params": f"m0={popt_bet[0]:.2f} % d.b., C={popt_bet[1]:.2f}",
            "m0": popt_bet[0], "r2": r2, "rmse": rmse, "ep": ep
        }
    else:
        results["BET (aw <= 0.5)"] = {"error": "Not enough points in aw <= 0.5 range"}
except Exception as e:
    results["BET (aw <= 0.5)"] = {"error": str(e)}

# C. Oswin Model
try:
    popt_oswin, _ = curve_fit(
        model_oswin, aw_data, m_data,
        p0=[10.0, 0.45],
        bounds=([0.1, 0.05], [50.0, 2.0])
    )
    pred_oswin = model_oswin(aw_data, *popt_oswin)
    r2, rmse, ep = evaluate_fit(m_data, pred_oswin)
    results["Oswin"] = {
        "params": f"a={popt_oswin[0]:.2f}, b={popt_oswin[1]:.3f}",
        "r2": r2, "rmse": rmse, "ep": ep
    }
except Exception as e:
    results["Oswin"] = {"error": str(e)}

# D. Smith Model
try:
    popt_smith, _ = curve_fit(
        model_smith, aw_data, m_data,
        p0=[3.0, 12.0],
        bounds=([-20.0, 0.1], [50.0, 50.0])
    )
    pred_smith = model_smith(aw_data, *popt_smith)
    r2, rmse, ep = evaluate_fit(m_data, pred_smith)
    results["Smith"] = {
        "params": f"a={popt_smith[0]:.2f}, b={popt_smith[1]:.2f}",
        "r2": r2, "rmse": rmse, "ep": ep
    }
except Exception as e:
    results["Smith"] = {"error": str(e)}

# E. Langmuir Model
try:
    popt_lang, _ = curve_fit(
        model_langmuir, aw_data, m_data,
        p0=[10.0, 5.0],
        bounds=([0.5, 0.1], [50.0, 100.0])
    )
    pred_lang = model_langmuir(aw_data, *popt_lang)
    r2, rmse, ep = evaluate_fit(m_data, pred_lang)
    results["Langmuir"] = {
        "params": f"m0={popt_lang[0]:.2f} % d.b., C={popt_lang[1]:.2f}",
        "m0": popt_lang[0], "r2": r2, "rmse": rmse, "ep": ep
    }
except Exception as e:
    results["Langmuir"] = {"error": str(e)}

# F. Peleg Model (4 Parameters)
try:
    popt_peleg, _ = curve_fit(
        model_peleg, aw_data, m_data,
        p0=[8.0, 0.45, 15.0, 3.5],
        bounds=([0.1, 0.05, 0.1, 1.05], [50.0, 0.99, 100.0, 10.0])
    )
    pred_peleg = model_peleg(aw_data, *popt_peleg)
    r2, rmse, ep = evaluate_fit(m_data, pred_peleg)
    results["Peleg (4-Param)"] = {
        "params": f"k1={popt_peleg[0]:.2f}, n1={popt_peleg[1]:.3f}, k2={popt_peleg[2]:.2f}, n2={popt_peleg[3]:.2f}",
        "r2": r2, "rmse": rmse, "ep": ep
    }
except Exception as e:
    results["Peleg (4-Param)"] = {"error": str(e)}

# 3. Print Evaluation Report
print("=" * 80)
print("  SCIPY MOISTURE SORPTION ISOTHERM COMPARISON REPORT")
print(f"  Sample: {${JSON.stringify(productName)}} | N = {len(aw_data)} experimental points")
print("=" * 80)
print(f"{'Model Name':<18} | {'R^2':<8} | {'RMSE':<8} | {'E% Modulus':<12} | {'Fitted Parameters'}")
print("-" * 80)

sorted_models = sorted(results.items(), key=lambda item: item[1].get("r2", -1), reverse=True)
for name, data in sorted_models:
    if "error" in data:
        print(f"{name:<18} | FAILED: {data['error']}")
    else:
        ep_eval = "Excellent (<5%)" if data['ep'] < 5.0 else "Acceptable (<10%)" if data['ep'] <= 10.0 else "Poor (>10%)"
        print(f"{name:<18} | {data['r2']:<8.4f} | {data['rmse']:<8.3f} | {data['ep']:<6.2f}% ({ep_eval}) | {data['params']}")

print("=" * 80)
best_model_name = sorted_models[0][0]
best_r2 = sorted_models[0][1]['r2']
print(f"BEST FITTING MODEL: {best_model_name} (R^2 = {best_r2:.4f})")
if "m0" in sorted_models[0][1]:
    print(f"Monolayer Moisture Content (m0): {sorted_models[0][1]['m0']:.2f} g H2O / 100g dry solids")
print("=" * 80)
`;
}
