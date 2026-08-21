/**
 * Food Science AI - Standards Management Repository & Storage Engine
 * 
 * Manages full CRUD operations, multi-criteria filtering, validation rules,
 * Iranian vs International jurisdiction separation, source linking integrity checks,
 * and JSON Bundle Import/Export for Food Industry Standards.
 */

import {
  STORES,
  getItem,
  putItem,
  deleteItem,
  getAllItems,
  getByIndex
} from './indexedDb';
import {
  FoodStandard,
  FoodStandardSearchFilters,
  FoodStandardValidationResult,
  FoodStandardsBundle,
  StandardJurisdiction
} from '../../types/foodStandard';
import { ScientificSource, SourceCitation } from '../../types/knowledgeBase';
import { getAllSources, getSourceById } from './knowledgeBase';

/**
 * Transforms an internal DB record or partial object to a guaranteed FoodStandard schema.
 */
export function normalizeStandardRecord(raw: any): FoodStandard {
  const isIran = raw.jurisdiction === 'iranian_national' ||
    (raw.country === 'ایران' || raw.issuingOrganization?.includes('INSO') || raw.issuingOrganization?.includes('ایران'));

  return {
    id: raw.id || `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    jurisdiction: raw.jurisdiction || (isIran ? 'iranian_national' : 'international_foreign'),
    country: raw.country || (isIran ? 'ایران' : 'بین‌المللی'),
    issuingOrganization: raw.issuingOrganization || (isIran ? 'سازمان ملی استاندارد ایران (INSO)' : 'کمیسیون کدکس غذایی (Codex)'),
    standardNumber: raw.standardNumber || raw.codeOrIdentifier || '',
    titleFa: raw.titleFa || raw.title || '',
    titleEn: raw.titleEn || raw.englishTitle || '',
    revisionAndYear: raw.revisionAndYear || '',
    lifecycleStatus: raw.lifecycleStatus || 'active',
    sector: raw.sector || 'dairy',
    scopeOfApplication: raw.scopeOfApplication || raw.summary || '',
    testMethod: raw.testMethod || '',
    requiredEquipment: Array.isArray(raw.requiredEquipment)
      ? raw.requiredEquipment
      : (raw.requiredEquipment ? [raw.requiredEquipment] : []),
    reagentsAndChemicals: Array.isArray(raw.reagentsAndChemicals)
      ? raw.reagentsAndChemicals
      : (raw.reagentsAndChemicals ? [raw.reagentsAndChemicals] : []),
    testConditions: raw.testConditions || '',
    testProcedure: raw.testProcedure || '',
    calculationsAndFormulas: raw.calculationsAndFormulas || '',
    acceptableLimits: Array.isArray(raw.acceptableLimits) ? raw.acceptableLimits : [],
    errorsAndSafetyWarnings: raw.errorsAndSafetyWarnings || '',
    verificationStatus: raw.verificationStatus || 'unverified_pending_review',
    sources: Array.isArray(raw.sources) ? raw.sources : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    offlineAvailable: raw.offlineAvailable ?? true,
    metadata: {
      createdAt: raw.metadata?.createdAt || new Date().toISOString(),
      updatedAt: raw.metadata?.updatedAt || new Date().toISOString(),
      version: raw.metadata?.version || '1.0.0',
      authorOrImportSource: raw.metadata?.authorOrImportSource || 'Food Science Standards Core',
      schemaVersion: '2.0.0'
    }
  };
}

/**
 * Validates a Food Standard object against domain rules.
 * 
 * Rules:
 * 1. Iranian National Standards MUST have a Standard Number and a Revision / Year.
 * 2. Title in Persian is mandatory.
 * 3. Scope of application is mandatory.
 * 4. Verified Status Rule: If status is 'official_regulatory' or 'verified_with_source',
 *    at least one valid Scientific Source citation is STRICTLY required.
 */
export function validateStandardData(data: Partial<FoodStandard>): FoodStandardValidationResult {
  const errors: Array<{ field: string; message: string }> = [];
  const warnings: Array<{ field: string; message: string }> = [];

  const jurisdiction = data.jurisdiction || 'iranian_national';

  // 1. Check Title
  if (!data.titleFa || data.titleFa.trim() === '') {
    errors.push({ field: 'titleFa', message: 'عنوان فارسی استاندارد الزامی است.' });
  }

  // 2. Strict Rule for Iranian Standards: Standard Number & Revision are MANDATORY
  if (jurisdiction === 'iranian_national') {
    if (!data.standardNumber || data.standardNumber.trim() === '') {
      errors.push({
        field: 'standardNumber',
        message: 'برای استانداردهای ملی ایران، فیلد «شماره استاندارد (Standard Number)» الزامی است.'
      });
    }

    if (!data.revisionAndYear || data.revisionAndYear.trim() === '') {
      errors.push({
        field: 'revisionAndYear',
        message: 'برای استانداردهای ملی ایران، فیلد «ویرایش / سال (Revision & Year)» الزامی است.'
      });
    }
  } else {
    // For foreign standards, standard number is strongly advised
    if (!data.standardNumber || data.standardNumber.trim() === '') {
      warnings.push({
        field: 'standardNumber',
        message: 'پیشنهاد می‌شود شماره یا کد شناسایی استاندارد خارجی (مانند Codex Stan یا ISO) وارد شود.'
      });
    }
  }

  // 3. Check Scope
  if (!data.scopeOfApplication || data.scopeOfApplication.trim() === '') {
    warnings.push({ field: 'scopeOfApplication', message: 'دامنه کاربرد و هدف استاندارد تعیین نشده است.' });
  }

  // 4. Strict Scientific Source Rule:
  // "اگر منبع معتبر وجود ندارد، سیستم اجازه ثبت اطلاعات به‌عنوان استاندارد تأییدشده را ندهد."
  const hasValidSources = data.sources && Array.isArray(data.sources) && data.sources.length > 0;
  const isRequestingVerified = data.verificationStatus === 'official_regulatory' || data.verificationStatus === 'verified_with_source';

  if (isRequestingVerified && !hasValidSources) {
    errors.push({
      field: 'verificationStatus',
      message: 'بر اساس اصل اعتبارسنجی علمی، ثبت استاندارد در وضعیت «تأییدشده» بدون انتساب حداقل یک منبع علمی معتبر مجاز نمی‌باشد. لطفاً منبع مرجع را متصل نمایید یا وضعیت را به «پیش‌نویس / در انتظار بررسی» تغییر دهید.'
    });
  }

  if (!hasValidSources && !isRequestingVerified) {
    warnings.push({
      field: 'sources',
      message: 'این استاندارد فاقد ارجاع به منبع مرجع است و در وضعیت پیش‌نویس (Unverified) نگهداری خواهد شد.'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Retrieves all food standards from storage.
 */
export async function getAllStandards(): Promise<FoodStandard[]> {
  try {
    const allRecords = await getAllItems<any>(STORES.KNOWLEDGE_RECORDS);
    // Filter standards category or records having standardNumber
    const rawStandards = allRecords.filter(
      (r) => r.category === 'standards' || r.standardNumber || r.jurisdiction
    );
    return rawStandards.map(normalizeStandardRecord).sort((a, b) => {
      return new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime();
    });
  } catch (error) {
    console.error('Failed to get standards from IndexedDB:', error);
    return [];
  }
}

/**
 * Retrieves a single standard by ID.
 */
export async function getStandardById(id: string): Promise<FoodStandard | null> {
  try {
    const raw = await getItem<any>(STORES.KNOWLEDGE_RECORDS, id);
    if (!raw) return null;
    return normalizeStandardRecord(raw);
  } catch (error) {
    console.error(`Failed to get standard ${id}:`, error);
    return null;
  }
}

/**
 * Saves (creates or updates) a Food Standard with strict validation enforcement.
 */
export async function saveStandard(standard: FoodStandard): Promise<FoodStandard> {
  const validation = validateStandardData(standard);
  if (!validation.isValid) {
    throw new Error(validation.errors.map((e) => e.message).join(' | '));
  }

  const normalized = normalizeStandardRecord({
    ...standard,
    category: 'standards',
    codeOrIdentifier: standard.standardNumber,
    title: standard.titleFa,
    englishTitle: standard.titleEn,
    summary: standard.scopeOfApplication,
    content: buildStandardMarkdownContent(standard),
    metadata: {
      ...standard.metadata,
      updatedAt: new Date().toISOString()
    }
  });

  await putItem(STORES.KNOWLEDGE_RECORDS, normalized);
  return normalized;
}

/**
 * Creates a new standard record.
 */
export async function createStandard(
  params: Omit<FoodStandard, 'id' | 'metadata'> & { authorOrImportSource?: string }
): Promise<FoodStandard> {
  const validation = validateStandardData(params);
  if (!validation.isValid) {
    throw new Error(validation.errors.map((e) => e.message).join(' | '));
  }

  const id = `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const standard: FoodStandard = {
    ...params,
    id,
    metadata: {
      createdAt: now,
      updatedAt: now,
      version: '1.0.0',
      schemaVersion: '2.0.0',
      authorOrImportSource: params.authorOrImportSource || 'Food Science AI Standards Hub'
    }
  };

  return saveStandard(standard);
}

/**
 * Deletes a standard by ID.
 */
export async function deleteStandard(id: string): Promise<void> {
  await deleteItem(STORES.KNOWLEDGE_RECORDS, id);
}

/**
 * Search and multi-criteria filtering for Food Standards.
 */
export async function searchStandards(filters: FoodStandardSearchFilters): Promise<FoodStandard[]> {
  const all = await getAllStandards();
  const q = (filters.query || '').trim().toLowerCase();

  return all.filter((std) => {
    // 1. Jurisdiction Filter (Iran vs Foreign)
    if (filters.jurisdiction && filters.jurisdiction !== 'all') {
      if (std.jurisdiction !== filters.jurisdiction) {
        return false;
      }
    }

    // 2. Sector Filter
    if (filters.sector && filters.sector !== 'all') {
      if (std.sector !== filters.sector) {
        return false;
      }
    }

    // 3. Organization Filter
    if (filters.issuingOrganization && filters.issuingOrganization !== 'all') {
      if (std.issuingOrganization !== filters.issuingOrganization) {
        return false;
      }
    }

    // 4. Lifecycle Status Filter
    if (filters.lifecycleStatus && filters.lifecycleStatus !== 'all') {
      if (std.lifecycleStatus !== filters.lifecycleStatus) {
        return false;
      }
    }

    // 5. Verification Status Filter
    if (filters.verificationStatus && filters.verificationStatus !== 'all') {
      if (std.verificationStatus !== filters.verificationStatus) {
        return false;
      }
    }

    // 6. Has Acceptable Limits Only
    if (filters.hasAcceptableLimitsOnly && (!std.acceptableLimits || std.acceptableLimits.length === 0)) {
      return false;
    }

    // 7. Offline Only
    if (filters.offlineOnly && !std.offlineAvailable) {
      return false;
    }

    // 8. Full Text Query Matching
    if (q) {
      const matchNumber = std.standardNumber.toLowerCase().includes(q);
      const matchTitleFa = std.titleFa.toLowerCase().includes(q);
      const matchTitleEn = std.titleEn ? std.titleEn.toLowerCase().includes(q) : false;
      const matchOrg = std.issuingOrganization.toLowerCase().includes(q);
      const matchCountry = std.country.toLowerCase().includes(q);
      const matchScope = std.scopeOfApplication.toLowerCase().includes(q);
      const matchMethod = std.testMethod.toLowerCase().includes(q);
      const matchProcedure = std.testProcedure.toLowerCase().includes(q);
      const matchEquip = std.requiredEquipment.some((eq) => eq.toLowerCase().includes(q));
      const matchReagents = std.reagentsAndChemicals.some((rg) => rg.toLowerCase().includes(q));
      const matchLimits = std.acceptableLimits.some(
        (lim) =>
          lim.parameterNameFa.toLowerCase().includes(q) ||
          (lim.parameterNameEn && lim.parameterNameEn.toLowerCase().includes(q)) ||
          lim.limitSpecification.toLowerCase().includes(q)
      );
      const matchErrors = std.errorsAndSafetyWarnings.toLowerCase().includes(q);
      const matchTags = std.tags.some((t) => t.toLowerCase().includes(q));

      if (
        !matchNumber &&
        !matchTitleFa &&
        !matchTitleEn &&
        !matchOrg &&
        !matchCountry &&
        !matchScope &&
        !matchMethod &&
        !matchProcedure &&
        !matchEquip &&
        !matchReagents &&
        !matchLimits &&
        !matchErrors &&
        !matchTags
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Builds rich Markdown synthesis of standard for interoperability
 */
function buildStandardMarkdownContent(std: FoodStandard): string {
  const parts: string[] = [];

  parts.push(`## ${std.standardNumber}: ${std.titleFa}`);
  if (std.titleEn) parts.push(`*${std.titleEn}*`);
  parts.push(`- **مرجع صادرکننده:** ${std.issuingOrganization} (${std.country})`);
  parts.push(`- **ویرایش / سال:** ${std.revisionAndYear || 'نامشخص'}`);
  parts.push(`- **وضعیت اعتبار:** ${std.lifecycleStatus}`);

  if (std.scopeOfApplication) {
    parts.push(`\n### ۱. هدف و دامنه کاربرد\n${std.scopeOfApplication}`);
  }

  if (std.testMethod) {
    parts.push(`\n### ۲. روش آزمون مرجع\n${std.testMethod}`);
  }

  if (std.requiredEquipment && std.requiredEquipment.length > 0) {
    parts.push(`\n### ۳. تجهیزات و دستگاه‌های موردنیاز\n` + std.requiredEquipment.map((eq) => `- ${eq}`).join('\n'));
  }

  if (std.reagentsAndChemicals && std.reagentsAndChemicals.length > 0) {
    parts.push(`\n### ۴. مواد و معرف‌های شیمیایی\n` + std.reagentsAndChemicals.map((rg) => `- ${rg}`).join('\n'));
  }

  if (std.testConditions) {
    parts.push(`\n### ۵. شرایط آزمون\n${std.testConditions}`);
  }

  if (std.testProcedure) {
    parts.push(`\n### ۶. مراحل اجرای آزمون\n${std.testProcedure}`);
  }

  if (std.calculationsAndFormulas) {
    parts.push(`\n### ۷. محاسبات و فرمول‌ها\n${std.calculationsAndFormulas}`);
  }

  if (std.acceptableLimits && std.acceptableLimits.length > 0) {
    parts.push(`\n### ۸. ویژگی‌ها و حدود قابل قبول`);
    parts.push('| ویژگی | حد مجاز | واحد | رواداری | روش آزمون مرجع |');
    parts.push('| :--- | :--- | :--- | :--- | :--- |');
    for (const lim of std.acceptableLimits) {
      parts.push(`| ${lim.parameterNameFa} | ${lim.limitSpecification} | ${lim.unit || '-'} | ${lim.tolerance || '-'} | ${lim.testMethodRef || '-'} |`);
    }
  }

  if (std.errorsAndSafetyWarnings) {
    parts.push(`\n### ۹. خطاها، هشدارهای ایمنی و عوامل مداخله‌گر\n${std.errorsAndSafetyWarnings}`);
  }

  return parts.join('\n\n');
}

export interface FoodStandardsStatistics {
  total: number;
  iranian: number;
  international: number;
  active: number;
  underRevision: number;
  withdrawn: number;
  withLimits: number;
  verifiedWithSources: number;
  bySector: Record<string, number>;
  byStatus: Record<string, number>;
}

/**
 * Standard Statistics overview
 */
export async function getStandardsStatistics(): Promise<FoodStandardsStatistics> {
  const standards = await getAllStandards();

  let iranianCount = 0;
  let internationalCount = 0;
  let verifiedCount = 0;
  let withLimitsCount = 0;
  let activeCount = 0;
  let underRevisionCount = 0;
  let withdrawnCount = 0;

  const bySector: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const std of standards) {
    if (std.jurisdiction === 'iranian_national') {
      iranianCount++;
    } else {
      internationalCount++;
    }

    if (
      (std.verificationStatus === 'official_regulatory' || std.verificationStatus === 'verified_with_source') &&
      std.sources &&
      std.sources.length > 0
    ) {
      verifiedCount++;
    }

    if (std.acceptableLimits && std.acceptableLimits.length > 0) {
      withLimitsCount++;
    }

    if (std.lifecycleStatus === 'active') activeCount++;
    else if (std.lifecycleStatus === 'under_revision') underRevisionCount++;
    else if (std.lifecycleStatus === 'withdrawn') withdrawnCount++;

    bySector[std.sector] = (bySector[std.sector] || 0) + 1;
    byStatus[std.lifecycleStatus] = (byStatus[std.lifecycleStatus] || 0) + 1;
  }

  return {
    total: standards.length,
    iranian: iranianCount,
    international: internationalCount,
    active: activeCount,
    underRevision: underRevisionCount,
    withdrawn: withdrawnCount,
    withLimits: withLimitsCount,
    verifiedWithSources: verifiedCount,
    bySector,
    byStatus
  };
}

/**
 * Exports standards bundle as JSON
 */
export async function exportFoodStandardsBundle(jurisdiction?: StandardJurisdiction | 'all'): Promise<string> {
  const [sources, allStandards] = await Promise.all([
    getAllSources(),
    getAllStandards()
  ]);

  const filtered = jurisdiction && jurisdiction !== 'all'
    ? allStandards.filter((s) => s.jurisdiction === jurisdiction)
    : allStandards;

  const bundle: FoodStandardsBundle = {
    bundleVersion: '1.0',
    exportedAt: new Date().toISOString(),
    application: 'Food Science AI',
    schemaVersion: '2.0.0',
    jurisdictionFilter: jurisdiction || 'all',
    sources,
    standards: filtered
  };

  return JSON.stringify(bundle, null, 2);
}

/**
 * Imports a Food Standards Bundle with validation
 */
export async function importFoodStandardsBundle(jsonString: string): Promise<{
  success: boolean;
  importedStandards: number;
  importedSources: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let parsed: any;

  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { success: false, importedStandards: 0, importedSources: 0, errors: ['فرمت فایل JSON نامعتبر است.'] };
  }

  const standardsList = parsed.standards || (Array.isArray(parsed) ? parsed : []);
  let importedStandards = 0;
  let importedSources = 0;

  // Import sources if present
  if (Array.isArray(parsed.sources)) {
    for (const src of parsed.sources) {
      if (src.id && src.title) {
        try {
          await putItem(STORES.SCIENTIFIC_SOURCES, src);
          importedSources++;
        } catch (err) {
          errors.push(`خطا در ذخیره منبع ${src.id}: ${(err as Error).message}`);
        }
      }
    }
  }

  for (const item of standardsList) {
    try {
      const normalized = normalizeStandardRecord(item);
      const validation = validateStandardData(normalized);
      if (validation.isValid) {
        await saveStandard(normalized);
        importedStandards++;
      } else {
        errors.push(`استاندارد «${item.standardNumber || item.titleFa || 'بدون نام'}» معتبر نیست: ${validation.errors.map(e => e.message).join('، ')}`);
      }
    } catch (e) {
      errors.push(`خطا در پردازش استاندارد: ${(e as Error).message}`);
    }
  }

  return {
    success: errors.length === 0 || importedStandards > 0,
    importedStandards,
    importedSources,
    errors
  };
}
