/**
 * Food Science AI - Iranian National Standards Repository (INSO / ISIRI)
 * Storage and Immutable Snapshot Verification Engine
 */

import {
  IranianStandard,
  IranianStandardTestResult,
  IranianStandardsSearchFilters,
  IranianStandardsStatistics,
  IranianStandardStatus
} from '../../types/iranianStandard';
import {
  INITIAL_IRANIAN_STANDARDS,
  INITIAL_IRANIAN_STANDARD_TEST_RESULTS
} from '../../data/iranianStandardsData';

const STORAGE_KEY_STANDARDS = 'food_science_iranian_standards_v1';
const STORAGE_KEY_TEST_RESULTS = 'food_science_iranian_test_results_v1';

/**
 * Initializes local storage with authentic verified benchmark records if empty
 */
function getStoredStandards(): IranianStandard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STANDARDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STANDARDS, JSON.stringify(INITIAL_IRANIAN_STANDARDS));
      return INITIAL_IRANIAN_STANDARDS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse Iranian standards from localStorage:', error);
    return INITIAL_IRANIAN_STANDARDS;
  }
}

function persistStandards(standards: IranianStandard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_STANDARDS, JSON.stringify(standards));
  } catch (error) {
    console.error('Failed to persist Iranian standards:', error);
  }
}

function getStoredTestResults(): IranianStandardTestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEST_RESULTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TEST_RESULTS, JSON.stringify(INITIAL_IRANIAN_STANDARD_TEST_RESULTS));
      return INITIAL_IRANIAN_STANDARD_TEST_RESULTS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse test results from localStorage:', error);
    return INITIAL_IRANIAN_STANDARD_TEST_RESULTS;
  }
}

function persistTestResults(results: IranianStandardTestResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TEST_RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('Failed to persist test results:', error);
  }
}

/**
 * Retrieves all Iranian National Standards
 */
export async function getAllIranianStandards(): Promise<IranianStandard[]> {
  const list = getStoredStandards();
  return list.sort((a, b) => a.standardNumber.localeCompare(b.standardNumber, 'fa'));
}

/**
 * Retrieves a single Iranian standard by ID
 */
export async function getIranianStandardById(id: string): Promise<IranianStandard | null> {
  const all = await getAllIranianStandards();
  return all.find((s) => s.id === id) || null;
}

/**
 * Retrieves an Iranian standard by Standard Number (e.g. "INSO 2406")
 */
export async function getIranianStandardByNumber(standardNumber: string): Promise<IranianStandard | null> {
  const all = await getAllIranianStandards();
  const cleaned = standardNumber.trim().toLowerCase().replace(/\s+/g, ' ');
  return all.find((s) => s.standardNumber.toLowerCase().replace(/\s+/g, ' ') === cleaned) || null;
}

/**
 * Strict Domain Validation
 */
export function validateIranianStandardData(data: Partial<IranianStandard>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Standard number validation (Do NOT guess, must follow INSO/ISIRI format)
  if (!data.standardNumber || data.standardNumber.trim() === '') {
    errors.push('شماره استاندارد ملی ایران (مثلاً INSO 2406 یا ISIRI 2344) الزامی است.');
  } else {
    const normalizedNumber = data.standardNumber.toUpperCase().trim();
    if (!normalizedNumber.startsWith('INSO') && !normalizedNumber.startsWith('ISIRI')) {
      warnings.push('شماره استانداردهای ملی ایران باید با پیشوند رسمی INSO یا ISIRI ثبت گردد.');
    }
  }

  // 2. Persian Title
  if (!data.titleFa || data.titleFa.trim() === '') {
    errors.push('عنوان رسمی فارسی مصوب سازمان ملی استاندارد الزامی است.');
  }

  // 3. Status rule: Obsolete standard must NOT be displayed as active
  if (!data.status) {
    data.status = 'needs_review'; // Rule: If indeterminate, mark as needs_review
    warnings.push('وضعیت استاندارد مشخص نبود، بنابراین به صورت پیش‌فرض «نیازمند بررسی» تعیین شد.');
  }

  if (data.status === 'obsolete' || data.status === 'superseded') {
    if (!data.supersededBy && (!data.revisionHistory || data.revisionHistory.length === 0)) {
      warnings.push('برای استاندارد منسوخ یا جایگزین‌شده، توصیه می‌شود استاندارد یا نسخه جایگزین ثبت گردد.');
    }
  }

  // 4. Version and Revision are required for traceability
  if (!data.revisionText || data.revisionText.trim() === '') {
    errors.push('فیلد نوبت تجدیدنظر (مثلاً تجدیدنظر چهارم یا چاپ اول) جهت حفظ سندیت الزامی است.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Saves (creates or updates) an Iranian Standard
 */
export async function saveIranianStandard(standard: IranianStandard): Promise<IranianStandard> {
  const validation = validateIranianStandardData(standard);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(' | '));
  }

  const all = getStoredStandards();
  const existingIdx = all.findIndex((s) => s.id === standard.id);
  const updatedStandard: IranianStandard = {
    ...standard,
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    all[existingIdx] = updatedStandard;
  } else {
    all.push(updatedStandard);
  }

  persistStandards(all);
  return updatedStandard;
}

/**
 * Creates a new Iranian Standard record
 */
export async function createIranianStandard(
  params: Omit<IranianStandard, 'id' | 'createdAt' | 'updatedAt'>
): Promise<IranianStandard> {
  const id = `inso-std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newStd: IranianStandard = {
    ...params,
    id,
    createdAt: now,
    updatedAt: now
  };

  return saveIranianStandard(newStd);
}

/**
 * Deletes an Iranian Standard
 */
export async function deleteIranianStandard(id: string): Promise<void> {
  const all = getStoredStandards();
  const filtered = all.filter((s) => s.id !== id);
  persistStandards(filtered);
}

/**
 * Multi-criteria search and filtering for Iranian Standards
 */
export async function searchIranianStandards(
  filters: IranianStandardsSearchFilters
): Promise<IranianStandard[]> {
  const all = await getAllIranianStandards();
  const q = (filters.query || '').trim().toLowerCase();
  const numQ = (filters.standardNumberQuery || '').trim().toLowerCase();
  const titleQ = (filters.titleQuery || '').trim().toLowerCase();
  const prodQ = (filters.productQuery || '').trim().toLowerCase();
  const testQ = (filters.testQuery || '').trim().toLowerCase();

  return all.filter((std) => {
    // Status Filter
    if (filters.status && filters.status !== 'all') {
      if (std.status !== filters.status) return false;
    }

    // Product Group Filter
    if (filters.productGroup && filters.productGroup !== 'all') {
      if (std.productGroup !== filters.productGroup) return false;
    }

    // Test Type Filter
    if (filters.testType && filters.testType !== 'all') {
      const hasType =
        std.primaryTestTypes.includes(filters.testType) ||
        std.linkedTests.some((t) => t.testType === filters.testType);
      if (!hasType) return false;
    }

    // Mandatory Only
    if (filters.mandatoryOnly && !std.isMandatory) {
      return false;
    }

    // Standard Number Query
    if (numQ) {
      const matchNum = std.standardNumber.toLowerCase().includes(numQ);
      if (!matchNum) return false;
    }

    // Title Query
    if (titleQ) {
      const matchTitleFa = std.titleFa.toLowerCase().includes(titleQ);
      const matchTitleEn = std.titleEn ? std.titleEn.toLowerCase().includes(titleQ) : false;
      if (!matchTitleFa && !matchTitleEn) return false;
    }

    // Product Query
    if (prodQ) {
      const matchProducts = std.linkedProducts.some(
        (p) =>
          p.nameFa.toLowerCase().includes(prodQ) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(prodQ)) ||
          (p.applicationNotes && p.applicationNotes.toLowerCase().includes(prodQ))
      );
      if (!matchProducts) return false;
    }

    // Test Query
    if (testQ) {
      const matchTests = std.linkedTests.some(
        (t) =>
          t.testNameFa.toLowerCase().includes(testQ) ||
          (t.testNameEn && t.testNameEn.toLowerCase().includes(testQ)) ||
          t.acceptableLimit.toLowerCase().includes(testQ) ||
          (t.testMethodReference && t.testMethodReference.toLowerCase().includes(testQ))
      );
      if (!matchTests) return false;
    }

    // Unified Query
    if (q) {
      const matchNum = std.standardNumber.toLowerCase().includes(q);
      const matchTitleFa = std.titleFa.toLowerCase().includes(q);
      const matchTitleEn = std.titleEn ? std.titleEn.toLowerCase().includes(q) : false;
      const matchScope = std.scopeFa.toLowerCase().includes(q);
      const matchProducts = std.linkedProducts.some((p) => p.nameFa.toLowerCase().includes(q));
      const matchTests = std.linkedTests.some(
        (t) => t.testNameFa.toLowerCase().includes(q) || t.acceptableLimit.toLowerCase().includes(q)
      );
      const matchEquip = std.linkedEquipments.some((e) => e.equipmentNameFa.toLowerCase().includes(q));
      const matchCalcs = std.linkedCalculations.some((c) => c.titleFa.toLowerCase().includes(q));
      const matchTags = std.tags.some((t) => t.toLowerCase().includes(q));

      if (
        !matchNum &&
        !matchTitleFa &&
        !matchTitleEn &&
        !matchScope &&
        !matchProducts &&
        !matchTests &&
        !matchEquip &&
        !matchCalcs &&
        !matchTags
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Statistics overview
 */
export async function getIranianStandardsStatistics(): Promise<IranianStandardsStatistics> {
  const standards = await getAllIranianStandards();
  const testResults = getStoredTestResults();

  let validCount = 0;
  let obsoleteCount = 0;
  let supersededCount = 0;
  let needsReviewCount = 0;
  let mandatoryCount = 0;
  let totalLinkedTests = 0;
  let totalLinkedProducts = 0;

  const byProductGroup: Record<string, number> = {};
  const byStatus: Record<string, number> = {
    valid: 0,
    obsolete: 0,
    superseded: 0,
    needs_review: 0
  };

  for (const s of standards) {
    if (s.status === 'valid') validCount++;
    else if (s.status === 'obsolete') obsoleteCount++;
    else if (s.status === 'superseded') supersededCount++;
    else if (s.status === 'needs_review') needsReviewCount++;

    byStatus[s.status] = (byStatus[s.status] || 0) + 1;
    byProductGroup[s.productGroup] = (byProductGroup[s.productGroup] || 0) + 1;

    if (s.isMandatory) mandatoryCount++;
    totalLinkedTests += s.linkedTests.length;
    totalLinkedProducts += s.linkedProducts.length;
  }

  return {
    total: standards.length,
    valid: validCount,
    obsolete: obsoleteCount,
    superseded: supersededCount,
    needsReview: needsReviewCount,
    mandatoryCount,
    totalLinkedTests,
    totalLinkedProducts,
    totalTestResultsRecorded: testResults.length,
    byProductGroup: byProductGroup as any,
    byStatus: byStatus as any
  };
}

// =========================================================================
// IMMUTABLE TEST RESULTS & VERSION SNAPSHOT ENGINE
// =========================================================================

/**
 * Retrieves all stored test results
 */
export async function getAllIranianTestResults(): Promise<IranianStandardTestResult[]> {
  const results = getStoredTestResults();
  return results.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
}

/**
 * Retrieves test results conducted under a specific standard
 */
export async function getTestResultsForStandard(standardIdOrNumber: string): Promise<IranianStandardTestResult[]> {
  const all = await getAllIranianTestResults();
  const cleaned = standardIdOrNumber.trim().toLowerCase().replace(/\s+/g, ' ');
  return all.filter(
    (r) =>
      r.appliedStandardSnapshot.standardId === standardIdOrNumber ||
      r.appliedStandardSnapshot.standardNumber.toLowerCase().replace(/\s+/g, ' ') === cleaned
  );
}

/**
 * Records a new lab test result, locking an immutable snapshot of the standard version.
 * 
 * Strict Architecture Requirement:
 * "ساختار را طوری طراحی کن که اگر یک استاندارد در آینده تغییر کرد، نسخه قدیمی نتایج قبلی را خراب نکند.
 * برای هر نتیجه آزمایش مشخص کن با کدام نسخه استاندارد انجام شده است."
 */
export async function recordTestResultWithSnapshot(
  data: Omit<IranianStandardTestResult, 'id' | 'appliedStandardSnapshot'> & {
    standard: IranianStandard;
    selectedTestClauseId?: string;
  }
): Promise<IranianStandardTestResult> {
  const selectedTest = data.standard.linkedTests.find((t) => t.id === data.selectedTestClauseId);
  const selectedCalc = data.standard.linkedCalculations[0];

  const lockedSnapshot = {
    standardId: data.standard.id,
    standardNumber: data.standard.standardNumber,
    titleFa: data.standard.titleFa,
    version: data.standard.version,
    revisionNumber: data.standard.revisionNumber,
    revisionText: `${data.standard.revisionText} - ${data.standard.ratificationYear}`,
    statusAtExecution: data.standard.status,
    appliedLimit: selectedTest ? `${selectedTest.testNameFa}: ${selectedTest.acceptableLimit}` : 'تعریف شده در استاندارد',
    formulaUsed: selectedCalc ? selectedCalc.formulaLatexOrText : undefined,
    isLocked: true as const,
    snapshotTimestamp: new Date().toISOString()
  };

  const newResult: IranianStandardTestResult = {
    id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sampleCode: data.sampleCode,
    sampleNameFa: data.sampleNameFa,
    batchNumber: data.batchNumber,
    productGroup: data.productGroup,
    testDate: data.testDate || new Date().toLocaleDateString('fa-IR'),
    operatorName: data.operatorName,
    testNameFa: data.testNameFa,
    testType: data.testType,
    measuredValue: data.measuredValue,
    unit: data.unit,
    verdict: data.verdict,
    verdictNotesFa: data.verdictNotesFa,
    appliedStandardSnapshot: lockedSnapshot,
    notes: data.notes
  };

  const all = getStoredTestResults();
  all.unshift(newResult);
  persistTestResults(all);

  return newResult;
}
