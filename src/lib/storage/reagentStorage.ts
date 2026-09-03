/**
 * Chemical Reagents & Prepared Solutions Storage Engine
 * Food Science AI Lab Suite - Part 13
 */

import {
  ChemicalReagent,
  PreparedSolution,
  ReagentFilterQuery,
  ReagentStatistics,
  ChemicalFamily,
  ReagentGrade
} from '../../types/chemicalReagent';
import { BENCHMARK_CHEMICAL_REAGENTS } from '../../data/benchmarkReagents';
import { STORES, getAllItems, getItem, putItem, deleteItem, clearStore } from './indexedDb';

/**
 * Initial sample prepared solutions for immediate laboratory demonstration
 */
export const INITIAL_PREPARED_SOLUTIONS: PreparedSolution[] = [
  {
    id: 'sol-naoh-01n-01',
    title: 'محلول سدیم هیدروکسید ۰.۱ نرمال (تیترانت استاندارد اسیدیته)',
    reagentId: 'reagent-naoh-01',
    reagentName: 'سدیم هیدروکسید (سود کاستیک / سود سوزآور)',
    reagentFormula: 'NaOH',
    targetConcentration: 0.1,
    concentrationUnit: 'N',
    actualConcentration: 0.1004,
    standardizationFactor: 1.0040,
    finalVolume: 1000,
    volumeUnit: 'mL',
    solvent: 'آب مقطر دیونیزه جوشیده و سرد شده (عاری از CO2)',
    requiredAmount: 4.04,
    requiredAmountUnit: 'g',
    calculationFormula: 'm = N × V(L) × (MW/n) × (100 / Purity%) = 0.1 × 1 × 39.997 × (100 / 99) = 4.0401 g',
    calculationSteps: [
      {
        stepNumber: 1,
        title: 'توزین پرک‌های سود',
        explanation: 'مقدار ۴.۰۴ گرم سود آزمایشگاهی با خلوص ۹۹٪ روی ترازوی دیجیتال وزن شد.'
      },
      {
        stepNumber: 2,
        title: 'انحلال در آب بدون گاز کربنیک',
        explanation: 'در ۵۰۰ میلی‌لیتر آب مقطر تازه جوشانده شده حل شد و در حمام خنک گردید.'
      },
      {
        stepNumber: 3,
        title: 'رساندن به حجم و فاکتورگیری با KHP',
        explanation: 'در بالن ۱۰۰۰ میلی‌لیتری به حجم رسید و با ۰.۴۰۸۴ گرم KHP در حضور فنل‌فتالئین تیتر شد (F = 1.0040).'
      }
    ],
    safetyWarnings: [
      'خورنده پوست و چشم؛ نگهداری در بطری پلی‌اتیلن متراکم (HDPE) با چوب‌پنبه یا درب پلاستیکی (نه درب شیشه‌ای سنباده‌ای که قفل می‌شود).'
    ],
    preparationDate: '2026-08-20',
    expiryDate: '2026-11-20',
    preparedBy: 'کارشناس کنترل کیفیت - متین جهانبانی',
    standardizedWith: 'پتاسیم هیدروژن فتالات (KHP) خشک شده در ۱۰۵ درجه (NIST SRM 84k)',
    storageLocation: 'قفسه محلول‌های استاندارد فعال آزمایشگاه - ردیف S1',
    status: 'active',
    notes: 'محلول آماده جهت تیتراسیون روزانه اسیدیته شیر، ماست، دوغ و سرکه.',
    createdAt: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 'sol-hcl-01n-02',
    title: 'محلول اسید کلریدریک ۰.۱ نرمال (HCl 0.1 N)',
    reagentId: 'reagent-hcl-02',
    reagentName: 'اسید کلریدریک ۳۷٪',
    reagentFormula: 'HCl',
    targetConcentration: 0.1,
    concentrationUnit: 'N',
    actualConcentration: 0.0998,
    standardizationFactor: 0.9980,
    finalVolume: 1000,
    volumeUnit: 'mL',
    solvent: 'آب مقطر دیونیزه',
    requiredAmount: 8.28,
    requiredAmountUnit: 'mL',
    calculationFormula: 'V = (N × V × MW × 100) / (density × purity% × 1000) = (0.1 × 1000 × 36.46 × 100) / (1.19 × 37 × 1000) = 8.28 mL',
    calculationSteps: [
      {
        stepNumber: 1,
        title: 'برداشت اسید غلیظ در زیر هود',
        explanation: 'مقدار ۸.۳ میلی‌لیتر اسید کلریدریک ۳۷٪ با پیپت مدرج برداشته شد.'
      },
      {
        stepNumber: 2,
        title: 'انتقال به بالن حاوی آب',
        explanation: 'به بالن ۱ لیتری حاوی ۶۰۰ میلی‌لیتر آب مقطر اضافه و سپس به خط نشانه رسانده شد.'
      },
      {
        stepNumber: 3,
        title: 'استانداردسازی با سدیم کربنات',
        explanation: 'با سدیم کربنات بدون آب خالص در حضور شناساگر متیل اورانژ تیتر شد.'
      }
    ],
    safetyWarnings: ['محلول اسیدی خورنده؛ نگهداری در شیشه بوروسیلیکات درب‌دار.'],
    preparationDate: '2026-08-15',
    expiryDate: '2027-02-15',
    preparedBy: 'کارشناس بخش شیمی - آزمایشگاه مرجع',
    standardizedWith: 'سدیم کربنات خالص خشک شده در ۲۷۰ درجه (Na2CO3)',
    storageLocation: 'قفسه محلول‌های حجمی - طبقه A2',
    status: 'active',
    notes: 'محلول تیترانت برای سنجش قلیائیت و تیتراسیون اسید بوریک در کلدال.',
    createdAt: '2026-08-15T08:30:00.000Z'
  },
  {
    id: 'sol-phenolphthalein-1pct-03',
    title: 'محلول شناساگر فنل‌فتالئین ۱٪ در اتانول ۹۵٪',
    reagentId: 'reagent-phenolphthalein-04',
    reagentName: 'شناساگر فنل‌فتالئین',
    reagentFormula: 'C20H14O4',
    targetConcentration: 1.0,
    concentrationUnit: 'w/v%',
    actualConcentration: 1.0,
    finalVolume: 100,
    volumeUnit: 'mL',
    solvent: 'اتانول ۹۵٪ خنثی شده (دارای ۲ تا ۳ قطره سود بسیار رقیق تا حذف اثر اسیدیته حلال)',
    requiredAmount: 1.01,
    requiredAmountUnit: 'g',
    calculationFormula: 'm = (1% × 100 mL) / 99% = 1.010 g',
    calculationSteps: [
      {
        stepNumber: 1,
        title: 'توزین پودر شناساگر',
        explanation: '۱.۰۱ گرم پودر فنل‌فتالئین وزن شد.'
      },
      {
        stepNumber: 2,
        title: 'انحلال در اتانول',
        explanation: 'در ۸۰ میلی‌لیتر اتانول ۹۶٪ حل شد و با افزودن قطره‌ای سود بسیار رقیق تا مرز ظهور صورتی محو خنثی و سپس با الکل به ۱۰۰ میلی‌لیتر رسید.'
      }
    ],
    safetyWarnings: ['محلول الکلی قابل اشتعال؛ نگهداری در شیشه قطره‌چکان کهربایی تیره دور از نور.'],
    preparationDate: '2026-08-01',
    expiryDate: '2027-08-01',
    preparedBy: 'تکنسین آزمایشگاه کنترل کیفی',
    storageLocation: 'میز تیتراسیون اصلی - پایه بورت شماره ۱',
    status: 'active',
    notes: 'شناساگر اصلی سنجش اسیدیته کلیه محصولات غذایی.',
    createdAt: '2026-08-01T09:15:00.000Z'
  }
];

/**
 * Initializes chemical reagent and prepared solution stores with benchmark data.
 */
export async function initializeReagentStore(): Promise<void> {
  try {
    const existingReagents = await getAllItems<ChemicalReagent>(STORES.CHEMICAL_REAGENTS);
    if (!existingReagents || existingReagents.length === 0) {
      for (const reagent of BENCHMARK_CHEMICAL_REAGENTS) {
        await putItem(STORES.CHEMICAL_REAGENTS, reagent);
      }
    }

    const existingSolutions = await getAllItems<PreparedSolution>(STORES.PREPARED_SOLUTIONS);
    if (!existingSolutions || existingSolutions.length === 0) {
      for (const sol of INITIAL_PREPARED_SOLUTIONS) {
        await putItem(STORES.PREPARED_SOLUTIONS, sol);
      }
    }
  } catch (error) {
    console.error('Error initializing reagent store in IndexedDB:', error);
  }
}

/**
 * Retrieves all chemical reagents from storage.
 */
export async function getAllReagents(): Promise<ChemicalReagent[]> {
  await initializeReagentStore();
  const items = await getAllItems<ChemicalReagent>(STORES.CHEMICAL_REAGENTS);
  return items || [];
}

/**
 * Retrieves a single reagent by its unique ID.
 */
export async function getReagentById(id: string): Promise<ChemicalReagent | null> {
  await initializeReagentStore();
  const item = await getItem<ChemicalReagent>(STORES.CHEMICAL_REAGENTS, id);
  return item || null;
}

/**
 * Saves (creates or updates) a chemical reagent.
 */
export async function saveReagent(data: Partial<ChemicalReagent>): Promise<ChemicalReagent> {
  await initializeReagentStore();

  const id = data.id || `reagent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const reagentRecord: ChemicalReagent = {
    id,
    name: data.name?.trim() || 'ماده شیمیایی جدید',
    englishName: data.englishName?.trim() || 'New Chemical Reagent',
    scientificName: data.scientificName?.trim() || data.name?.trim() || 'Chemical Compound',
    chemicalFormula: data.chemicalFormula?.trim() || 'Unknown',
    casNumber: data.casNumber?.trim() || 'N/A',
    casSource: data.casSource?.trim() || 'ثبت دستی کاربر / بررسی SDS کارخانه سازنده',
    family: data.family || 'salt',
    molecularWeight: data.molecularWeight && data.molecularWeight > 0 ? data.molecularWeight : 100.0,
    density: data.density,
    valenceOrEquivalents: data.valenceOrEquivalents || 1,
    grade: data.grade || 'analytical',
    purityPercentage: data.purityPercentage !== undefined && data.purityPercentage > 0 ? data.purityPercentage : 99.0,
    physicalState: data.physicalState || 'solid',
    storageConditions: data.storageConditions || {
      temperature: '15-25°C (محیط آزمایشگاه)',
      lightSensitive: false,
      hygroscopic: false,
      flammableCabinetRequired: false,
      desiccatorRequired: false,
      specialNotes: 'در شرایط متعارف آزمایشگاهی نگهداری شود.'
    },
    preparationDate: data.preparationDate || now.split('T')[0],
    expiryDate: data.expiryDate,
    lotNumber: data.lotNumber || `LOT-${new Date().getFullYear()}`,
    hazards: data.hazards || {
      ghsPictograms: [],
      signalWord: 'None',
      hazardStatements: ['اطلاعات خطر تکمیلی ثبت نشده است - نیاز به بررسی برگه ایمنی SDS کارخانه سازنده'],
      precautionaryStatements: ['P280: استفاده از تجهیزات حفاظت فردی در آزمایشگاه'],
      isVerifiedHazard: false
    },
    safetyNotes: data.safetyNotes || {
      ppeRequired: ['دستکش آزمایشگاهی', 'عینک محافظ', 'روپوش کار'],
      firstAid: {
        eyeContact: 'شستشو با آب فراوان به مدت حداقل ۱۵ دقیقه.',
        skinContact: 'شستشو با آب و صابون.',
        inhalation: 'هوای تازه و استراحت.',
        ingestion: 'شستشوی دهان و مراجعه به پزشک.'
      },
      handlingPrecautions: ['رعایت مقررات عمومی ایمنی کار در آزمایشگاه شیمی.'],
      spillResponse: 'جمع‌آوری با پد جاذب یا جاروب و دفع بر اساس ضوابط پسماند آزمایشگاه.',
      incompatibleWith: []
    },
    sdsReference: data.sdsReference || {
      publisherOrSource: 'برگه اطلاعات ایمنی کارخانه سازنده (Manufacturer SDS)',
      sdsCodeOrNumber: 'SDS-LOCAL',
      revisionDate: now.split('T')[0],
      verified: false,
      safetyDisclaimer: 'اطلاعات توسط کاربر ثبت شده و باید با برچسب روی ظرف تطبیق داده شود.'
    },
    associatedExperiments: data.associatedExperiments || [],
    stockQuantity: data.stockQuantity || {
      amount: 500,
      unit: 'g',
      location: 'انبار مواد شیمیایی',
      minAlertLevel: 100
    },
    notes: data.notes,
    isBenchmark: data.isBenchmark || false,
    updatedAt: now
  };

  await putItem(STORES.CHEMICAL_REAGENTS, reagentRecord);
  return reagentRecord;
}

/**
 * Deletes a chemical reagent by ID.
 */
export async function deleteReagent(id: string): Promise<boolean> {
  try {
    await deleteItem(STORES.CHEMICAL_REAGENTS, id);
    return true;
  } catch (error) {
    console.error('Error deleting reagent:', error);
    return false;
  }
}

/**
 * Filters and searches chemical reagents.
 */
export async function filterReagents(query: ReagentFilterQuery): Promise<ChemicalReagent[]> {
  const allReagents = await getAllReagents();

  return allReagents.filter((reagent) => {
    // 1. Search term (matches name, englishName, scientificName, formula, CAS, lot, experiments)
    if (query.searchTerm && query.searchTerm.trim() !== '') {
      const term = query.searchTerm.trim().toLowerCase();
      const matchName = reagent.name.toLowerCase().includes(term);
      const matchEn = reagent.englishName.toLowerCase().includes(term);
      const matchSci = reagent.scientificName.toLowerCase().includes(term);
      const matchFormula = reagent.chemicalFormula.toLowerCase().includes(term);
      const matchCas = reagent.casNumber.toLowerCase().includes(term);
      const matchLot = reagent.lotNumber?.toLowerCase().includes(term);
      const matchExp = reagent.associatedExperiments.some(e =>
        e.experimentName.toLowerCase().includes(term) ||
        (e.standardCode && e.standardCode.toLowerCase().includes(term))
      );

      if (!matchName && !matchEn && !matchSci && !matchFormula && !matchCas && !matchLot && !matchExp) {
        return false;
      }
    }

    // 2. Family filter
    if (query.family && query.family !== 'all') {
      if (reagent.family !== query.family) {
        return false;
      }
    }

    // 3. Grade filter
    if (query.grade && query.grade !== 'all') {
      if (reagent.grade !== query.grade) {
        return false;
      }
    }

    // 4. Hazard Pictogram filter
    if (query.hazardPictogram && query.hazardPictogram !== 'all') {
      if (!reagent.hazards.ghsPictograms.includes(query.hazardPictogram)) {
        return false;
      }
    }

    // 5. Stock Status filter
    if (query.stockStatus && query.stockStatus !== 'all') {
      if (query.stockStatus === 'low_stock') {
        if (reagent.stockQuantity.amount > reagent.stockQuantity.minAlertLevel) return false;
      } else if (query.stockStatus === 'in_stock') {
        if (reagent.stockQuantity.amount <= reagent.stockQuantity.minAlertLevel) return false;
      } else if (query.stockStatus === 'expired') {
        if (!reagent.expiryDate) return false;
        const expDate = new Date(reagent.expiryDate);
        if (expDate > new Date()) return false;
      }
    }

    // 6. Associated Experiment filter
    if (query.associatedExperiment && query.associatedExperiment.trim() !== '') {
      const expTerm = query.associatedExperiment.trim().toLowerCase();
      const hasExp = reagent.associatedExperiments.some(e =>
        e.experimentName.toLowerCase().includes(expTerm) ||
        (e.standardCode && e.standardCode.toLowerCase().includes(expTerm))
      );
      if (!hasExp) return false;
    }

    return true;
  }).sort((a, b) => {
    const sortBy = query.sortBy || 'name';
    const sortOrder = query.sortOrder || 'asc';
    let comparison = 0;

    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name, 'fa');
    } else if (sortBy === 'cas') {
      comparison = a.casNumber.localeCompare(b.casNumber);
    } else if (sortBy === 'purity') {
      comparison = a.purityPercentage - b.purityPercentage;
    } else if (sortBy === 'stock') {
      comparison = a.stockQuantity.amount - b.stockQuantity.amount;
    } else if (sortBy === 'updatedAt') {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
}

/**
 * Retrieves all prepared solutions log.
 */
export async function getAllPreparedSolutions(): Promise<PreparedSolution[]> {
  await initializeReagentStore();
  const items = await getAllItems<PreparedSolution>(STORES.PREPARED_SOLUTIONS);
  return (items || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Saves a prepared solution to the lab log.
 */
export async function savePreparedSolution(solution: Partial<PreparedSolution>): Promise<PreparedSolution> {
  await initializeReagentStore();

  const id = solution.id || `sol-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const record: PreparedSolution = {
    id,
    title: solution.title?.trim() || 'محلول آزمایشگاهی جدید',
    reagentId: solution.reagentId || '',
    reagentName: solution.reagentName || 'ماده اولیه',
    reagentFormula: solution.reagentFormula || '',
    targetConcentration: solution.targetConcentration || 0.1,
    concentrationUnit: solution.concentrationUnit || 'M',
    actualConcentration: solution.actualConcentration || solution.targetConcentration || 0.1,
    standardizationFactor: solution.standardizationFactor,
    finalVolume: solution.finalVolume || 500,
    volumeUnit: solution.volumeUnit || 'mL',
    solvent: solution.solvent || 'آب مقطر دیونیزه',
    requiredAmount: solution.requiredAmount || 0,
    requiredAmountUnit: solution.requiredAmountUnit || 'g',
    calculationFormula: solution.calculationFormula || '',
    calculationSteps: solution.calculationSteps || [],
    safetyWarnings: solution.safetyWarnings || [],
    preparationDate: solution.preparationDate || now.split('T')[0],
    expiryDate: solution.expiryDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    preparedBy: solution.preparedBy?.trim() || 'کارشناس کنترل کیفیت',
    standardizedWith: solution.standardizedWith,
    storageLocation: solution.storageLocation || 'قفسه محلول‌های فعال آزمایشگاه',
    status: solution.status || 'active',
    notes: solution.notes,
    createdAt: solution.createdAt || now
  };

  await putItem(STORES.PREPARED_SOLUTIONS, record);
  return record;
}

/**
 * Deletes a prepared solution record.
 */
export async function deletePreparedSolution(id: string): Promise<boolean> {
  try {
    await deleteItem(STORES.PREPARED_SOLUTIONS, id);
    return true;
  } catch (error) {
    console.error('Error deleting prepared solution:', error);
    return false;
  }
}

/**
 * Computes live statistical metrics across reagents and prepared solutions.
 */
export async function getReagentStatistics(): Promise<ReagentStatistics> {
  const reagents = await getAllReagents();
  const solutions = await getAllPreparedSolutions();

  const familyDistribution: Record<ChemicalFamily, number> = {
    acid: 0,
    base: 0,
    salt: 0,
    indicator: 0,
    organic_solvent: 0,
    buffer: 0,
    stain: 0,
    enzyme_biochemical: 0,
    standard_solution: 0
  };

  const gradeDistribution: Record<ReagentGrade, number> = {
    analytical: 0,
    primary_standard: 0,
    hplc: 0,
    food_usp: 0,
    laboratory: 0,
    technical: 0
  };

  let hazardousCount = 0;
  let lowStockCount = 0;

  for (const r of reagents) {
    if (familyDistribution[r.family] !== undefined) {
      familyDistribution[r.family]++;
    }
    if (gradeDistribution[r.grade] !== undefined) {
      gradeDistribution[r.grade]++;
    }
    if (r.hazards.ghsPictograms && r.hazards.ghsPictograms.length > 0) {
      hazardousCount++;
    }
    if (r.stockQuantity.amount <= r.stockQuantity.minAlertLevel) {
      lowStockCount++;
    }
  }

  const now = new Date();
  let activeSolutions = 0;
  let expiredSolutions = 0;

  for (const s of solutions) {
    const isExpired = new Date(s.expiryDate) < now || s.status === 'expired';
    if (isExpired) {
      expiredSolutions++;
    } else {
      activeSolutions++;
    }
  }

  return {
    totalReagents: reagents.length,
    totalPreparedSolutions: solutions.length,
    activeSolutions,
    expiredSolutions,
    familyDistribution,
    gradeDistribution,
    hazardousCount,
    lowStockCount
  };
}

/**
 * Resets the reagent store to factory benchmark dataset.
 */
export async function resetReagentStore(): Promise<void> {
  await clearStore(STORES.CHEMICAL_REAGENTS);
  await clearStore(STORES.PREPARED_SOLUTIONS);

  for (const r of BENCHMARK_CHEMICAL_REAGENTS) {
    await putItem(STORES.CHEMICAL_REAGENTS, r);
  }

  for (const s of INITIAL_PREPARED_SOLUTIONS) {
    await putItem(STORES.PREPARED_SOLUTIONS, s);
  }
}

/**
 * Exports all reagents and solutions to JSON.
 */
export async function exportReagentsJSON(): Promise<string> {
  const reagents = await getAllReagents();
  const solutions = await getAllPreparedSolutions();
  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    system: 'Food Science AI - Chemicals & Solutions Module',
    reagents,
    solutions
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Imports reagents and solutions from JSON payload.
 */
export async function importReagentsJSON(jsonString: string): Promise<{ importedReagents: number; importedSolutions: number }> {
  const data = JSON.parse(jsonString);
  let importedReagents = 0;
  let importedSolutions = 0;

  if (Array.isArray(data.reagents)) {
    for (const r of data.reagents) {
      if (r.id && r.name) {
        await putItem(STORES.CHEMICAL_REAGENTS, r);
        importedReagents++;
      }
    }
  }

  if (Array.isArray(data.solutions)) {
    for (const s of data.solutions) {
      if (s.id && s.title) {
        await putItem(STORES.PREPARED_SOLUTIONS, s);
        importedSolutions++;
      }
    }
  }

  return { importedReagents, importedSolutions };
}
