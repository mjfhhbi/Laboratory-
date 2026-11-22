/**
 * Food Science & Engineering - Research & Thesis Domain Types
 * Part 25 of 30: Academic Research & Thesis Assistant
 */

import { ScientificSourceType, ScientificConfidenceLevel } from './scientificSource';

export type AcademicLevel = 'bachelor' | 'master' | 'phd' | 'industrial_rd';

export type FoodResearchCategory =
  | 'dairy'
  | 'meat_poultry_fish'
  | 'packaging_shelf_life'
  | 'beverage_fermentation'
  | 'cereal_bakery'
  | 'functional_foods'
  | 'oils_fats'
  | 'food_nanotechnology'
  | 'byproduct_valorization'
  | 'fruits_vegetables'
  | 'confectionery_sweets';

export interface ResearchVariable {
  id: string;
  name: string;
  type: 'independent' | 'dependent' | 'control';
  unit?: string;
  levelsOrRange?: string;
  measurementMethod?: string;
  samplingInterval?: string;
  description?: string;
}

export interface LiteratureReviewItem {
  id: string;
  title: string;
  authors: string[];
  year: string | number;
  sourceType?: ScientificSourceType | 'scientific_paper';
  doiOrStandardNo?: string;
  foodMatrix: string;
  methodology: string;
  keyVariables?: string;
  findings: string;
  limitations?: string;
  isVerifiedAuthentic: boolean;
  sourceRegistryId?: string;
  sourceId?: string;
  citationText?: string;
}

export interface ExperimentalDesignStructure {
  designType: 'factorial' | 'rsm_ccd' | 'rsm_box_behnken' | 'crbd' | 'crd' | 'split_plot' | 'mixture';
  designNameFa: string;
  factorsCount: number;
  factorsSummary: string;
  responsesSummary: string;
  totalRuns: number;
  replications: number;
  statisticalModelFa: string;
  softwareRecommended: string;
  anovaProcedureFa: string;
}

export interface MethodologicalWeakness {
  id: string;
  aspect: 
    | 'sample_size' 
    | 'control_groups' 
    | 'replication_count' 
    | 'instrumental_validation' 
    | 'temperature_control' 
    | 'kinetic_modeling' 
    | 'sensory_panel_bias' 
    | 'shelf_life_acceleration';
  aspectTitleFa: string;
  severity: 'critical' | 'moderate' | 'minor';
  identifiedIssueFa: string;
  correctiveRecommendationFa: string;
  scientificReference?: string;
}

export interface SuggestedExperiment {
  id: string;
  category: 'physicochemical' | 'microbial' | 'rheological_texture' | 'spectroscopic_chromatography' | 'sensory' | 'thermal';
  categoryTitleFa: string;
  testNameFa: string;
  testNameEn: string;
  standardReference: string;
  recommendedEquipment: string;
  processConditions: string;
  targetParameter: string;
  justificationFa: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  englishTitle?: string;
  academicLevel: AcademicLevel;
  category: FoodResearchCategory;
  createdAt: string;
  updatedAt: string;
  status: 
    | 'draft' 
    | 'proposal_ready' 
    | 'proposal_approved' 
    | 'in_lab_testing' 
    | 'analyzing_data' 
    | 'thesis_defense_ready' 
    | 'in_progress' 
    | 'completed';
  experimentalDesignStructure?: ExperimentalDesignStructure;

  // Core Proposal & Thesis Sections
  problemStatement: string; // بیان مسئله
  researchQuestions: string[]; // Research Questions
  objectives: {
    mainObjective: string; // هدف اصلی
    specificObjectives: string[]; // اهداف فرعی و اختصاصی
  };
  hypotheses: {
    nullHypothesis: string; // فرضیه صفر H0
    alternativeHypothesis: string; // فرضیه پژوهش H1
  };
  variables: ResearchVariable[]; // متغیرهای مستقل، وابسته و کنترل
  populationAndSample: {
    targetMatrix: string; // جامعه / نمونه غذایی
    sampleSize: string; // حجم نمونه
    samplingMethod: string; // روش نمونه‌برداری
    storageConditions: string; // شرایط نگهداری و آماده‌سازی نمونه
  };
  researchMethodology: {
    designType: string; // نوع طرح پژوهش
    experimentalDesign?: ExperimentalDesignStructure; // ساختار DoE
    samplingTimeline: string; // فواصل زمانی آزمون‌ها
    dataAnalysisMethod: string; // روش تحلیل آماری
  };
  experimentalProcedures: string; // روش‌های آزمایش و پروتکل‌های گام به گام
  literatureReview: LiteratureReviewItem[]; // جدول پیشینه پژوهش (Literature Review Matrix)
  results: string; // نتایج و یافته‌ها
  discussion: string; // بحث و تبیین مکانیزم‌ها
  conclusion: string; // نتیجه‌گیری و پیشنهادات

  // AI & Scientific Audit Insights
  weaknessesAndLimitations: MethodologicalWeakness[];
  suggestedExperiments: SuggestedExperiment[];
  tags: string[];
}

export interface AiResearchActionPayload {
  action: 
    | 'suggest_ideas'
    | 'generate_research_questions'
    | 'structure_methodology'
    | 'find_sources'
    | 'build_literature_matrix'
    | 'audit_weaknesses'
    | 'suggest_experiments'
    | 'compare_papers';
  projectId?: string;
  category?: FoodResearchCategory;
  academicLevel?: AcademicLevel;
  keywords?: string;
  userPrompt?: string;
}
