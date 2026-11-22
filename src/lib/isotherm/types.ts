/**
 * Moisture Sorption & Desorption Isotherms Types
 * 
 * References:
 * - Brunauer, S., Emmett, P.H., & Teller, E. (1938). Adsorption of gases in multimolecular layers. J. Am. Chem. Soc., 60(2), 309-319.
 * - van den Berg, C., & Bruin, S. (1981). Water activity and its estimation in food systems. In Water Relations of Foods, Academic Press.
 * - Wolf, W., Spiess, W.E.L., & Jung, G. (1985). Standardization of isotherm measurements (COST Project 90). In Properties of Water in Foods, Martinus Nijhoff.
 * - Labuza, T.P. (1984). Moisture Sorption: Practical Aspects of Isotherm Measurement and Use. AACC.
 * - Peleg, M. (1993). Assessment of a semi-empirical four parameter general model for sigmoid moisture sorption isotherms. J. Food Process Eng., 16(1), 21-37.
 * - Bell, L.N., & Labuza, T.P. (2000). Practical Aspects of Moisture Sorption Isotherm Measurement and Use (2nd Ed.), AACC.
 */

export type IsothermModelType = 
  | 'bet'
  | 'gab'
  | 'langmuir'
  | 'oswin'
  | 'smith'
  | 'peleg';

export type MoistureBasis = 'dry_basis' | 'wet_basis';

export type SorptionType = 'adsorption' | 'desorption';

export interface IsothermPoint {
  waterActivity: number;     // a_w in range (0, 1)
  moistureContent: number;   // m in g H2O / 100g dry solids (or % d.b.)
  calculatedMoisture?: number; // predicted by model
}

export interface IsothermModelResult {
  modelType: IsothermModelType;
  modelNameFa: string;
  modelNameEn: string;
  equationLatex: string;
  validAwRange: string;
  parameters: Record<string, {
    value: number;
    unit: string;
    symbol: string;
    nameFa: string;
  }>;
  monolayerMoistureM0?: number; // g H2O / 100g dry solids (for BET, GAB, Langmuir)
  rSquared: number;
  rmse: number;               // in moisture units (g / 100g d.b.)
  meanRelativeErrorPercent: number; // E% (Mean Relative Percentage Deviation Modulus)
  fitQualityCategoryFa: 'عالی (E% < 5%)' | 'قابل قبول (5% <= E% <= 10%)' | 'ضعیف (E% > 10%)';
  isConverged: boolean;
  convergenceWarning?: string;
  applicationNotesFa: string;
  limitationsFa: string[];
  fittedCurvePoints: { aw: number; predictedM: number }[];
}

export interface BenchmarkIsothermDataset {
  id: string;
  productNameFa: string;
  productNameEn: string;
  category: 'dairy_powder' | 'grain_cereal' | 'starch' | 'dried_fruit' | 'bakery_snack' | 'protein_isolate' | 'beverage_powder';
  temperatureC: number;
  sorptionType: SorptionType;
  moistureBasis: MoistureBasis;
  moistureUnit: string; // e.g. "g H2O / 100g dry solids (% d.b.)"
  isothermTypeClassification: 'Type II (Sigmoid - پروتئین‌ها و نشاسته)' | 'Type III (J-shaped - مواد غنی از قند)';
  points: IsothermPoint[];
  literatureReference: {
    authors: string;
    title: string;
    year: number;
    source: string;
  };
  physicalDescriptionFa: string;
  criticalStabilityAwFa: string;
}

export interface StabilityZoneMetrics {
  monolayerMoistureM0: number; // g H2O / 100g d.b.
  monolayerWaterActivity: number; // typical aw corresponding to m0 (usually 0.2 - 0.35)
  zone1BoundAw: number;        // Chemically bound water (0 to ~0.25)
  zone2BoundAw: number;        // Multilayer sorption (0.25 to ~0.75)
  zone3BoundAw: number;        // Free/capillary water (> 0.75)
  lipidOxidationNoteFa: string;
  maillardBrowningNoteFa: string;
  microbialGrowthNoteFa: string;
}
