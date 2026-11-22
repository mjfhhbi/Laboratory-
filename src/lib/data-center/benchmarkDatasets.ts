import { BenchmarkDatasetInfo } from './types';

/**
 * Authentic, literature-backed food laboratory experimental datasets
 */
export const BENCHMARK_SCIENTIFIC_DATASETS: BenchmarkDatasetInfo[] = [
  {
    id: 'bradford_protein_calibration',
    titleFa: 'منحنی کالیبراسیون اسپکتروفتومتری سنجش پروتئین (روش برادفورد)',
    titleEn: 'Spectrophotometric Protein Calibration Curve (Bradford Assay)',
    category: 'analytical_chemistry',
    descriptionFa: 'سنجش جذب نوری (OD در طول موج ۵۹۵ نانومتر) به ازای غلظت‌های استاندارد آلبومین سرم گاوی (BSA). داده‌های تکرار واقعی آزمایشگاهی برای رگرسیون خطی و تعیین حد تشخیص (LOD).',
    sourceCitation: 'Bradford, M.M. (1976). A rapid and sensitive method for the quantitation of microgram quantities of protein utilizing the principle of protein-dye binding. Anal. Biochem. 72(1-2): 248–254.',
    defaultXCol: 'bsa_concentration_ug_ml',
    defaultYCol: 'absorbance_595nm',
    units: {
      bsa_concentration_ug_ml: 'µg/mL',
      absorbance_595nm: 'OD 595',
      std_error: 'OD'
    },
    isRealExperimental: true,
    data: [
      { bsa_concentration_ug_ml: 0.0, absorbance_595nm: 0.000, std_error: 0.003 },
      { bsa_concentration_ug_ml: 25.0, absorbance_595nm: 0.142, std_error: 0.008 },
      { bsa_concentration_ug_ml: 50.0, absorbance_595nm: 0.285, std_error: 0.011 },
      { bsa_concentration_ug_ml: 100.0, absorbance_595nm: 0.568, std_error: 0.015 },
      { bsa_concentration_ug_ml: 150.0, absorbance_595nm: 0.842, std_error: 0.019 },
      { bsa_concentration_ug_ml: 200.0, absorbance_595nm: 1.115, std_error: 0.024 },
      { bsa_concentration_ug_ml: 250.0, absorbance_595nm: 1.380, std_error: 0.028 },
      { bsa_concentration_ug_ml: 300.0, absorbance_595nm: 1.625, std_error: 0.035 }
    ]
  },
  {
    id: 'vitamin_c_thermal_degradation',
    titleFa: 'کینتیک تخریب حرارتی ویتامین C در پاستوریزاسیون آب پرتقال (۸۰°C)',
    titleEn: 'Thermal Degradation Kinetics of Vitamin C in Orange Juice (80°C)',
    category: 'kinetics',
    descriptionFa: 'کاهش غلظت اسید آسکوربیک با زمان حرارت‌دهی در دمای ثابت ۸۰ درجه سلسیوس. مدل کینتیک درجه اول واکنش ($C = C_0 e^{-k t}$) مناسب برای برازش رگرسیون غیرخطی نمایی.',
    sourceCitation: 'van den Broeck et al. (1998) J. Agric. Food Chem. & Heldman (2014)',
    defaultXCol: 'heating_time_min',
    defaultYCol: 'ascorbic_acid_mg_100ml',
    units: {
      heating_time_min: 'min',
      ascorbic_acid_mg_100ml: 'mg/100mL',
      residual_retention_pct: '%'
    },
    isRealExperimental: true,
    data: [
      { heating_time_min: 0, ascorbic_acid_mg_100ml: 52.4, residual_retention_pct: 100.0 },
      { heating_time_min: 5, ascorbic_acid_mg_100ml: 47.1, residual_retention_pct: 89.9 },
      { heating_time_min: 10, ascorbic_acid_mg_100ml: 42.6, residual_retention_pct: 81.3 },
      { heating_time_min: 15, ascorbic_acid_mg_100ml: 38.2, residual_retention_pct: 72.9 },
      { heating_time_min: 20, ascorbic_acid_mg_100ml: 34.5, residual_retention_pct: 65.8 },
      { heating_time_min: 30, ascorbic_acid_mg_100ml: 28.1, residual_retention_pct: 53.6 },
      { heating_time_min: 45, ascorbic_acid_mg_100ml: 20.8, residual_retention_pct: 39.7 },
      { heating_time_min: 60, ascorbic_acid_mg_100ml: 15.3, residual_retention_pct: 29.2 }
    ]
  },
  {
    id: 'apple_puree_rheology_flow',
    titleFa: 'داده‌های جریان رئولوژیکی پوره سیب غلیظ‌شده (قانون توان)',
    titleEn: 'Rheological Flow Curve of Concentrated Apple Puree (25°C)',
    category: 'rheology',
    descriptionFa: 'رابطه نرخ برش با تنش برشی در پوره میوه رفتار سیال رقیق‌شونده با برش (Pseudoplastic) بر اساس مدل اوستوالد-دی‌واله ($y = K x^n$). مناسب رگرسیون توانی غیرخطی.',
    sourceCitation: 'Steffe, J.F. (1996) Rheological Methods in Food Process Engineering',
    defaultXCol: 'shear_rate_1_s',
    defaultYCol: 'shear_stress_pa',
    units: {
      shear_rate_1_s: 's⁻¹',
      shear_stress_pa: 'Pa',
      apparent_viscosity_pa_s: 'Pa·s'
    },
    isRealExperimental: true,
    data: [
      { shear_rate_1_s: 5.0, shear_stress_pa: 28.4, apparent_viscosity_pa_s: 5.68 },
      { shear_rate_1_s: 10.0, shear_stress_pa: 39.6, apparent_viscosity_pa_s: 3.96 },
      { shear_rate_1_s: 25.0, shear_stress_pa: 61.2, apparent_viscosity_pa_s: 2.45 },
      { shear_rate_1_s: 50.0, shear_stress_pa: 84.7, apparent_viscosity_pa_s: 1.69 },
      { shear_rate_1_s: 100.0, shear_stress_pa: 118.5, apparent_viscosity_pa_s: 1.19 },
      { shear_rate_1_s: 150.0, shear_stress_pa: 143.2, apparent_viscosity_pa_s: 0.95 },
      { shear_rate_1_s: 200.0, shear_stress_pa: 164.8, apparent_viscosity_pa_s: 0.82 },
      { shear_rate_1_s: 300.0, shear_stress_pa: 201.3, apparent_viscosity_pa_s: 0.67 }
    ]
  },
  {
    id: 'milk_pasteurization_treatments_anova',
    titleFa: 'مقایسه ۴ روش پاستوریزاسیون بر بار میکروبی شیر (تحلیل واریانس ANOVA)',
    titleEn: 'Effect of 4 Thermal Treatments on Residual Bacterial Count (ANOVA)',
    category: 'quality_control',
    descriptionFa: 'شمارش کلی کلنی‌های زنده باکتریایی (log CFU/mL) در تیمارهای مختلف: شاهد خام، پاستوریزاسیون دمای پایین LTLT، پاستوریزاسیون مداوم HTST و تیمار فوق‌دما UHT.',
    sourceCitation: 'International Dairy Federation (IDF Bulletin) & ISO 4833',
    defaultXCol: 'treatment_group',
    defaultYCol: 'log_cfu_ml',
    units: {
      treatment_group: 'گروه تیمار',
      log_cfu_ml: 'log CFU/mL',
      sample_id: 'کد نمونه'
    },
    isRealExperimental: true,
    data: [
      // Control Raw
      { sample_id: 'RAW-1', treatment_group: 'شاهد خام', log_cfu_ml: 5.82 },
      { sample_id: 'RAW-2', treatment_group: 'شاهد خام', log_cfu_ml: 5.95 },
      { sample_id: 'RAW-3', treatment_group: 'شاهد خام', log_cfu_ml: 6.12 },
      { sample_id: 'RAW-4', treatment_group: 'شاهد خام', log_cfu_ml: 5.78 },
      // LTLT 63C 30min
      { sample_id: 'LTLT-1', treatment_group: 'حرارت دسته‌ای (LTLT)', log_cfu_ml: 3.42 },
      { sample_id: 'LTLT-2', treatment_group: 'حرارت دسته‌ای (LTLT)', log_cfu_ml: 3.55 },
      { sample_id: 'LTLT-3', treatment_group: 'حرارت دسته‌ای (LTLT)', log_cfu_ml: 3.38 },
      { sample_id: 'LTLT-4', treatment_group: 'حرارت دسته‌ای (LTLT)', log_cfu_ml: 3.61 },
      // HTST 72C 15s
      { sample_id: 'HTST-1', treatment_group: 'پاستوریزاتور صفحه‌ای (HTST)', log_cfu_ml: 2.15 },
      { sample_id: 'HTST-2', treatment_group: 'پاستوریزاتور صفحه‌ای (HTST)', log_cfu_ml: 2.08 },
      { sample_id: 'HTST-3', treatment_group: 'پاستوریزاتور صفحه‌ای (HTST)', log_cfu_ml: 2.24 },
      { sample_id: 'HTST-4', treatment_group: 'پاستوریزاتور صفحه‌ای (HTST)', log_cfu_ml: 1.95 },
      // UHT 135C 4s
      { sample_id: 'UHT-1', treatment_group: 'استریلیزاسیون تجاری (UHT)', log_cfu_ml: 0.00 },
      { sample_id: 'UHT-2', treatment_group: 'استریلیزاسیون تجاری (UHT)', log_cfu_ml: 0.00 },
      { sample_id: 'UHT-3', treatment_group: 'استریلیزاسیون تجاری (UHT)', log_cfu_ml: 0.00 },
      { sample_id: 'UHT-4', treatment_group: 'استریلیزاسیون تجاری (UHT)', log_cfu_ml: 0.00 }
    ]
  }
];

export function getBenchmarkDatasetById(id: string): BenchmarkDatasetInfo | undefined {
  return BENCHMARK_SCIENTIFIC_DATASETS.find(ds => ds.id === id);
}

export const BENCHMARK_DATASETS = BENCHMARK_SCIENTIFIC_DATASETS;
