/**
 * Food Rheology & Fluid Mechanics Data Types
 * 
 * References:
 * - Steffe, J.F. (1996). Rheological Methods in Food Process Engineering (2nd Ed.), Freeman Press.
 * - Rao, M.A. (2014). Rheology of Fluid, Semisolid, and Solid Foods: Principles and Applications (3rd Ed.), Springer.
 * - Toledo, R.T. (2007). Fundamentals of Food Process Engineering (3rd Ed.), Chapter 3 & 4.
 * - International Confectionery Association (IOCCC / ICA): Viscosity of Cocoa and Chocolate Products (Casson Model).
 */

export type RheologyModelType = 
  | 'newtonian'
  | 'power_law'
  | 'bingham_plastic'
  | 'herschel_bulkley'
  | 'casson';

export interface ShearDataPoint {
  shearRate: number;      // \dot{\gamma} in s^-1
  shearStress: number;    // \tau in Pa
  apparentViscosity?: number; // \eta_a = \tau / \dot{\gamma} in Pa.s
}

export interface ModelFittingResult {
  modelType: RheologyModelType;
  modelNameFa: string;
  modelNameEn: string;
  equationLatex: string;
  apparentViscosityLatex: string;
  parameters: Record<string, {
    value: number;
    unit: string;
    symbol: string;
    nameFa: string;
  }>;
  rSquared: number;
  rmse: number;           // Root Mean Square Error in Pa
  isConverged: boolean;
  convergenceWarning?: string;
  flowBehaviorCategoryFa: 'نیوتنی (مستقل از نرخ برش)' | 'شبه‌پلاستیک (رقیق‌شونده با برش / Shear-Thinning)' | 'اتساعی (غلیظ‌شونده با برش / Shear-Thickening)' | 'پلاستیک با تنش تسلیم (Bingham / Herschel-Bulkley / Casson)';
  applicationNotesFa: string;
  limitationsFa: string[];
  fittedStressPoints: { shearRate: number; predictedStress: number; predictedViscosity: number }[];
}

export interface BenchmarkRheologyDataset {
  id: string;
  productNameFa: string;
  productNameEn: string;
  category: 'emulsion_sauce' | 'dairy_fluid' | 'chocolate_confectionery' | 'fruit_puree' | 'hydrocolloid_solution' | 'edible_oil';
  testTemperatureC: number;
  measuringGeometry: string; // e.g., Concentric Cylinder, Cone & Plate, Vane
  bestFittingModel: RheologyModelType;
  points: ShearDataPoint[];
  literatureReference: {
    authors: string;
    title: string;
    year: number;
    source: string;
  };
  physicalDescriptionFa: string;
}

export interface PipeFlowInputs {
  pipeDiameterM: number;       // D in meters
  pipeLengthM: number;         // L in meters
  volumetricFlowRateM3h: number; // Q in m^3/h
  densityKgM3: number;         // \rho in kg/m^3
  pipeRoughnessM: number;      // \varepsilon in meters (commercial stainless steel ~ 0.000045 m)
  pumpEfficiencyPercent: number; // e.g. 70%
  staticElevationHeadM: number; // \Delta z in meters
}

export interface PipeFlowResult {
  flowVelocityMs: number;          // v in m/s
  volumetricFlowRateM3s: number;   // Q in m^3/s
  generalizedReynoldsNumber: number; // Re or Re_MR
  flowRegimeFa: 'آرام (Laminar - Re < 2100)' | 'انتقالی (Transition - 2100 <= Re <= 4000)' | 'مغشوش (Turbulent - Re > 4000)';
  fanningFrictionFactor: number;   // f
  darcyFrictionFactor: number;     // f_D = 4f
  wallShearRateS1: number;         // \dot{\gamma}_w in s^-1
  wallShearStressPa: number;       // \tau_w in Pa
  apparentViscosityAtWallPaS: number; // \eta_w in Pa.s
  frictionPressureDropPa: number;  // \Delta P_f in Pa
  frictionPressureDropKPa: number; // \Delta P_f in kPa
  totalDynamicHeadM: number;       // H in meters of fluid column
  hydraulicPowerWatts: number;     // P_hyd in Watts
  brakePowerWatts: number;         // P_brake in Watts
  electricMotorPowerKW: number;    // P_motor in kW (standard motor margin)
  equationTrace: {
    title: string;
    latex: string;
    substitution: string;
    result: string;
  }[];
}
