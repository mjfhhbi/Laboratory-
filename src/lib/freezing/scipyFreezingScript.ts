import { FreezingProcessInputs } from './types';

/**
 * Generate a complete, standalone Python / SciPy script for Food Freezing and Thawing
 */
export function generateScipyFreezingScript(inputs: FreezingProcessInputs): string {
  const { properties, geometry } = inputs;
  const a = inputs.thicknessOrDiameterM;
  const Ti = inputs.initialTemperatureTi;
  const Ta = inputs.ambientMediumTemperatureTa;
  const Tc = inputs.targetCenterTemperatureTc;
  const Tif = properties.initialFreezingPointTif;
  const h = inputs.heatTransferCoefficientH;

  return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Food Science AI - Heat Transfer, Freezing & Thawing Numerical Engine
References:
- Plank, R. (1913, 1941) Z. Gesamte Kalte-Ind.
- Cleland, A.C., & Earle, R.L. (1977, 1979, 1982) J. Food Sci. & Int. J. Refrig.
- Pham, Q.T. (1986) Simplified method for predicting freezing time of food, Int. J. Refrig.
- ASHRAE Handbook - Refrigeration (2018)
"""

import numpy as np
from scipy.integrate import odeint

# -------------------------------------------------------------
# 1. Product Properties & Operating Conditions
# -------------------------------------------------------------
product_name = "${properties.nameEn}"
geometry = "${geometry}"
a = ${a}              # Characteristic dimension (thickness/diameter) [m]
Ti = ${Ti}             # Initial temperature [°C]
Ta = ${Ta}            # Freezer ambient temperature [°C]
Tc = ${Tc}            # Final center target temperature [°C]
Tif = ${Tif}           # Initial freezing point [°C]
h = ${h}              # Convective heat transfer coefficient [W/(m^2*K)]

# Thermophysical properties
rho_u = ${properties.densityUnfrozen}      # Unfrozen density [kg/m^3]
rho_f = ${properties.densityFrozen}        # Frozen density [kg/m^3]
k_u = ${properties.thermalConductivityUnfrozen}         # Unfrozen thermal conductivity [W/(m*K)]
k_f = ${properties.thermalConductivityFrozen}          # Frozen thermal conductivity [W/(m*K)]
c_pu = ${properties.specificHeatUnfrozen} * 1000.0   # Unfrozen specific heat [J/(kg*K)]
c_pf = ${properties.specificHeatFrozen} * 1000.0    # Frozen specific heat [J/(kg*K)]
delta_H = ${properties.latentHeatDeltaH} * 1000.0   # Latent heat of freezing [J/kg]

print("=================================================================")
print(f"  FOOD FREEZING & THAWING NUMERICAL ANALYSIS: {product_name}")
print("=================================================================")
print(f"Geometry: {geometry.upper()}")
print(f"Dimension a = {a*100:.2f} cm | Initial T = {Ti:.1f} °C | Freezer T = {Ta:.1f} °C | Target T = {Tc:.1f} °C")
print(f"Heat Transfer Coeff h = {h:.1f} W/(m^2*K)")
print("-----------------------------------------------------------------")

# -------------------------------------------------------------
# 2. Geometric Shape Factors (P and R)
# -------------------------------------------------------------
if geometry == "slab":
    P = 0.5
    R = 0.125
    Lc = a / 2.0
elif geometry == "cylinder":
    P = 0.25
    R = 0.0625
    Lc = a / 4.0
elif geometry == "sphere":
    P = 1.0 / 6.0
    R = 1.0 / 24.0
    Lc = a / 6.0
else: # brick
    P = 0.5 / (1.0 + 1.0/1.5 + 1.0/2.0)
    R = 0.125 / (1.0 + 1.0/(1.5**2) + 1.0/(2.0**2))
    Lc = a / 3.0

print(f"Shape Factors: P = {P:.4f}, R = {R:.4f}, Characteristic Length Lc = {Lc*100:.3f} cm")

# -------------------------------------------------------------
# 3. Dimensionless Numbers
# -------------------------------------------------------------
Bi_f = (h * Lc) / k_f
Bi_u = (h * Lc) / k_u
Pk = (c_pu * max(0.0, Ti - Tif)) / delta_H
Ste = (c_pf * max(0.0, Tif - Ta)) / delta_H

print(f"Biot Number (Frozen): Bi_f = {Bi_f:.3f}")
print(f"Plank Number: Pk = {Pk:.4f} (Sensible Pre-cooling / Latent Heat)")
print(f"Stefan Number: Ste = {Ste:.4f} (Sensible Sub-cooling / Latent Heat)")

# -------------------------------------------------------------
# 4. Classical Plank Model
# -------------------------------------------------------------
delta_T_freeze = Tif - Ta
t_plank_sec = ((rho_f * delta_H) / delta_T_freeze) * ((P * a / h) + (R * (a**2) / k_f))
t_plank_min = t_plank_sec / 60.0

print(f"\\n[1] Classical Plank Freezing Time: {t_plank_min:.1f} min ({t_plank_min/60.0:.2f} hr)")

# -------------------------------------------------------------
# 5. Cleland & Earle Modified Freezing Model
# -------------------------------------------------------------
P_mod = P * (1.0 + 1.026 * Pk + 0.580 * Ste)
R_mod = R * (1.0 + 1.202 * Pk + 0.519 * Ste)
delta_H_eff = delta_H + c_pu * (Ti - Tif) + 0.5 * c_pf * (Tif - Tc)

t_cleland_sec = ((rho_f * delta_H_eff) / delta_T_freeze) * ((P_mod * a / h) + (R_mod * (a**2) / k_f))
t_cleland_min = t_cleland_sec / 60.0

print(f"[2] Cleland & Earle Freezing Time: {t_cleland_min:.1f} min ({t_cleland_min/60.0:.2f} hr)")

# -------------------------------------------------------------
# 6. Pham's Standard Model (1986)
# -------------------------------------------------------------
Tm = 1.8 + 0.263 * Tc + 0.105 * Ta
delta_H1 = rho_u * c_pu * (Ti - Tif)
delta_H2 = rho_f * delta_H + rho_f * c_pf * (Tif - Tc)
t_pham_sec = (Lc / (h * (Tm - Ta))) * (delta_H1 * (1.0 + Bi_u / 2.0) + delta_H2 * (1.0 + Bi_f / 2.0))
t_pham_min = t_pham_sec / 60.0

print(f"[3] Pham Standard Freezing Time:  {t_pham_min:.1f} min ({t_pham_min/60.0:.2f} hr)")

# -------------------------------------------------------------
# 7. Thawing Process Analysis (Thermal Conductivity Inversion)
# -------------------------------------------------------------
Ta_thaw = 15.0  # Ambient thawing room temperature [°C]
delta_T_thaw = Ta_thaw - Tif
# During thawing, the outer shell is unfrozen liquid (k_u), which has ~4x lower conductivity than ice!
t_thaw_sec = ((rho_u * delta_H_eff) / delta_T_thaw) * ((P_mod * a / h) + (R_mod * (a**2) / k_u))
t_thaw_min = t_thaw_sec / 60.0
thaw_ratio = t_thaw_min / t_cleland_min

print(f"\\n-------------------------------------------------------------")
print(f"[4] Thawing Time at +{Ta_thaw:.1f} °C:      {t_thaw_min:.1f} min ({t_thaw_min/60.0:.2f} hr)")
print(f"    Thawing / Freezing Ratio:    {thaw_ratio:.2f}x (Thawing is significantly slower!)")
print(f"    Conductivity Inversion:      k_liquid = {k_u} W/(m*K) vs k_ice = {k_f} W/(m*K)")
print("=================================================================")
`;
}
