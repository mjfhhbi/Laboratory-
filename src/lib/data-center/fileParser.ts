import * as XLSX from 'xlsx';
import { ColumnDataType, DataColumnMeta, DatasetValidationReport } from './types';

/**
 * Parse CSV text into array of record objects
 */
export function parseCSVText(csvContent: string): {
  data: Record<string, any>[];
  headers: string[];
} {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) {
    return { data: [], headers: [] };
  }

  // Detect delimiter: comma, semicolon, or tab
  const firstLine = lines[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  let delimiter = ',';
  if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';
  else if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';

  // Helper to split line with quote awareness
  const splitLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = splitLine(lines[0]).map(h => h.replace(/^["']|["']$/g, '').trim());
  const data: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;
    
    const row: Record<string, any> = {};
    headers.forEach((h, colIdx) => {
      let rawVal = values[colIdx] ?? '';
      rawVal = rawVal.replace(/^["']|["']$/g, '').trim();

      // Check if missing
      if (rawVal === '' || rawVal.toLowerCase() === 'nan' || rawVal.toLowerCase() === 'na' || rawVal === '-' || rawVal.toLowerCase() === 'null') {
        row[h] = null;
      } else {
        // Try numeric conversion (handle Persian/Arabic numbers or comma decimal if needed)
        const normalized = rawVal.replace(/,/g, '.');
        const num = Number(normalized);
        if (!isNaN(num) && normalized !== '') {
          row[h] = num;
        } else {
          row[h] = rawVal;
        }
      }
    });
    data.push(row);
  }

  return { data, headers };
}

export interface ExcelParsedResult {
  data: Record<string, any>[];
  headers: string[];
  sheetNames: string[];
  selectedSheet: string;
  sheets: Record<string, { data: Record<string, any>[]; headers: string[] }>;
}

/**
 * Parse Excel ArrayBuffer (.xlsx / .xls) using XLSX with full multi-sheet support
 */
export function parseExcelBuffer(arrayBuffer: ArrayBuffer, targetSheetName?: string): ExcelParsedResult {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetNames = workbook.SheetNames || [];
  if (sheetNames.length === 0) {
    return { data: [], headers: [], sheetNames: [], selectedSheet: '', sheets: {} };
  }

  const sheets: Record<string, { data: Record<string, any>[]; headers: string[] }> = {};
  sheetNames.forEach(name => {
    const sheetObj = workbook.Sheets[name];
    if (sheetObj) {
      const sheetJson = XLSX.utils.sheet_to_json<Record<string, any>>(sheetObj, { defval: null });
      const sheetHeaders = sheetJson.length > 0 ? Object.keys(sheetJson[0]) : [];
      sheets[name] = { data: sheetJson, headers: sheetHeaders };
    } else {
      sheets[name] = { data: [], headers: [] };
    }
  });

  const selectedSheet = (targetSheetName && sheetNames.includes(targetSheetName))
    ? targetSheetName
    : sheetNames[0];

  const activeSheet = sheets[selectedSheet] || { data: [], headers: [] };

  return {
    data: activeSheet.data,
    headers: activeSheet.headers,
    sheetNames,
    selectedSheet,
    sheets
  };
}

/**
 * Inspect and validate data columns, detect types and missing counts
 */
export function auditDatasetColumns(
  data: Record<string, any>[],
  headersOrIsReal?: string[] | boolean,
  sourceDescriptionFa?: string
): DatasetValidationReport {
  let headers: string[] = [];
  let isRealExperimentalData = true;

  if (Array.isArray(headersOrIsReal)) {
    headers = headersOrIsReal;
  } else {
    headers = data.length > 0 ? Object.keys(data[0]) : [];
    if (typeof headersOrIsReal === 'boolean') {
      isRealExperimentalData = headersOrIsReal;
    }
  }

  const totalRows = data.length;
  let missingCellsCount = 0;
  const columnsMeta: DataColumnMeta[] = [];

  headers.forEach(h => {
    let missingCount = 0;
    let numericCount = 0;
    let stringCount = 0;

    data.forEach(row => {
      const val = row[h];
      if (val === null || val === undefined || val === '') {
        missingCount++;
        missingCellsCount++;
      } else if (typeof val === 'number') {
        numericCount++;
      } else if (typeof val === 'string') {
        const parsed = Number(val.replace(/,/g, '.'));
        if (!isNaN(parsed)) {
          numericCount++;
        } else {
          stringCount++;
        }
      }
    });

    let dataType: ColumnDataType = 'unknown';
    if (numericCount > stringCount && numericCount > 0) {
      dataType = 'numeric';
    } else if (stringCount > 0) {
      dataType = 'categorical';
    }

    columnsMeta.push({
      key: h,
      labelFa: h,
      labelEn: h,
      dataType,
      missingCount,
      totalCount: totalRows,
      isPhysicalValid: true
    });
  });

  const issues: DatasetValidationReport['issues'] = [];

  // Check missing values
  columnsMeta.forEach(col => {
    if (col.missingCount > 0) {
      issues.push({
        severity: col.missingCount > totalRows * 0.2 ? 'warning' : 'info',
        type: 'missing_values',
        columnKey: col.key,
        messageFa: `ستون "${col.labelFa}" دارای ${col.missingCount} سلول خالی یا گمشده است.`,
        messageEn: `Column "${col.key}" contains ${col.missingCount} missing values`,
        affectedRowIndices: [],
        suggestionFa: 'از روش‌های درون‌یابی میانگین یا حذف سطرهای ناقص استفاده نمایید.'
      });
    }
  });

  // Check sample size
  if (totalRows < 3) {
    issues.push({
      severity: 'error',
      type: 'low_sample_size',
      columnKey: 'all',
      messageFa: 'تعداد سطرهای داده کمتر از ۳ است که برای آزمون‌های آماری کافی نمی‌باشد.',
      messageEn: 'Sample size is less than 3',
      affectedRowIndices: [],
      suggestionFa: 'حداقل ۵ تکرار برای محاسبات رگرسیون و آزمون‌های فرضیه وارد کنید.'
    });
  }

  return {
    isValid: issues.filter(i => i.severity === 'error').length === 0,
    totalRows,
    totalColumns: headers.length,
    missingCellsCount,
    columnsMeta,
    issues,
    isRealExperimentalData,
    sourceDescriptionFa: sourceDescriptionFa || 'داده‌های بارگذاری‌شده کاربر'
  };
}

/**
 * Export data array to CSV format string
 */
export function exportToCSVString(data: Record<string, any>[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const lines: string[] = [headers.join(',')];

  data.forEach(row => {
    const line = headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
      return String(val);
    }).join(',');
    lines.push(line);
  });

  return lines.join('\n');
}

/**
 * Missing values imputation helper (mean, median, drop rows)
 */
export function imputeMissingValues(
  data: Record<string, any>[],
  strategy: 'mean' | 'median' | 'drop_row'
): Record<string, any>[] {
  if (data.length === 0) return [];
  const headers = Object.keys(data[0]);

  if (strategy === 'drop_row') {
    return data.filter(row => {
      return headers.every(h => {
        const val = row[h];
        return val !== null && val !== undefined && val !== '';
      });
    });
  }

  // Calculate mean or median for numeric columns
  const colAverages: Record<string, number> = {};
  headers.forEach(h => {
    const numericVals: number[] = [];
    data.forEach(row => {
      const v = Number(row[h]);
      if (!isNaN(v) && row[h] !== null && row[h] !== '') {
        numericVals.push(v);
      }
    });
    if (numericVals.length > 0) {
      if (strategy === 'mean') {
        colAverages[h] = numericVals.reduce((a, b) => a + b, 0) / numericVals.length;
      } else {
        numericVals.sort((a, b) => a - b);
        const mid = Math.floor(numericVals.length / 2);
        colAverages[h] = numericVals.length % 2 === 0
          ? (numericVals[mid - 1] + numericVals[mid]) / 2
          : numericVals[mid];
      }
    }
  });

  return data.map(row => {
    const newRow = { ...row };
    headers.forEach(h => {
      if (newRow[h] === null || newRow[h] === undefined || newRow[h] === '') {
        if (colAverages[h] !== undefined) {
          newRow[h] = Math.round(colAverages[h] * 1000) / 1000;
        }
      }
    });
    return newRow;
  });
}
