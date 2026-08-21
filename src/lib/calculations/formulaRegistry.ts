import { FormulaDefinition, CustomFormulaRecord, CalculationTraceStep } from '../../types/calculations';
import { DEFAULT_FOOD_FORMULAS, formatScientificNumber } from './foodFormulas';
import { evaluateExpression, tokenize, parseToRpn } from './expressionEvaluator';
import { getAllItems, putItem, deleteItem, STORES } from '../storage/indexedDb';

// In-memory cache of dynamically registered custom formulas
let customFormulasCache: Map<string, FormulaDefinition> = new Map();

/**
 * Converts a stored custom formula record into a full runtime FormulaDefinition
 */
export function convertCustomRecordToDefinition(record: CustomFormulaRecord): FormulaDefinition {
  const isScientificallyRef = Boolean(record.standardReference && record.standardReference.trim().length > 3);

  return {
    id: record.id,
    nameFa: record.nameFa,
    nameEn: record.nameEn || record.nameFa,
    category: record.category || 'custom',
    standardReference: record.standardReference || 'فاقد رفرنس استاندارد (فرمول کاربر)',
    expressionLatex: record.expression,
    expressionDisplay: record.expression,
    variables: record.variables || [],
    outputUnit: record.outputUnit || '',
    defaultDecimals: record.defaultDecimals ?? 2,
    scientificNotesFa: record.descriptionFa,
    isCustom: true,
    customExpression: record.expression,
    validateInputs: (inputs) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!isScientificallyRef) {
        warnings.push('هشدار عدم رفرنس علمی: این فرمول فاقد استناد استاندارد معتبر است و نتایج آن صرفاً برآورد ریاضی بوده و نتیجه رسمی آزمایشگاهی محسوب نمی‌شود.');
      }

      for (const v of record.variables) {
        const val = inputs[v.id] ?? inputs[v.symbol];
        if (v.required && (val === undefined || isNaN(val))) {
          errors.push(`ورودی متغیر '${v.nameFa}' (${v.symbol}) الزامی است.`);
          continue;
        }
        if (val !== undefined) {
          if (v.min !== undefined && val < v.min) {
            errors.push(`مقدار '${v.nameFa}' (${val}) از حداقل مجاز (${v.min}) کمتر است.`);
          }
          if (v.max !== undefined && val > v.max) {
            errors.push(`مقدار '${v.nameFa}' (${val}) از حداکثر مجاز (${v.max}) بیشتر است.`);
          }
        }
      }

      return { valid: errors.length === 0, errors, warnings };
    },
    execute: (inputs, options = {}) => {
      const decimals = options.decimals ?? record.defaultDecimals ?? 2;
      const trace: CalculationTraceStep[] = [];
      const warnings: string[] = [];
      const errors: string[] = [];

      if (!isScientificallyRef) {
        warnings.push('فرمول فاقد منبع یا رفرنس استاندارد رسمی است؛ نتیجه به عنوان تأییدیه علمی تلقی نمی‌گردد.');
      }

      // Check required variables
      const varValues: Record<string, number> = {};
      for (const v of record.variables) {
        const val = inputs[v.id] ?? inputs[v.symbol];
        if (val === undefined || isNaN(val)) {
          if (v.required) {
            errors.push(`متغیر '${v.nameFa}' (${v.symbol}) تعریف نشده است.`);
          }
        } else {
          varValues[v.id] = val;
          varValues[v.symbol] = val;
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          value: null,
          formattedValue: '-',
          unit: record.outputUnit || '',
          decimals,
          standardReference: record.standardReference,
          isScientificallyValid: false,
          trace: [],
          warnings,
          errors,
          evaluatedAt: new Date().toISOString()
        };
      }

      try {
        const substitutedStr = record.expression.replace(/[a-zA-Z_\u0600-\u06FF]+/g, (match) => {
          const lower = match.toLowerCase();
          for (const [k, v] of Object.entries(varValues)) {
            if (k.toLowerCase() === lower) return String(v);
          }
          return match;
        });

        const evalResult = evaluateExpression(record.expression, varValues);

        trace.push({
          stepNumber: 1,
          titleFa: 'جایگذاری متغیرها در عبارت محاسباتی',
          expression: record.expression,
          substitutedExpression: substitutedStr,
          intermediateValue: evalResult.result.toFixed(decimals + 2),
          unit: record.outputUnit || '',
          noteFa: 'ارزیابی درخت محاسباتی'
        });

        trace.push({
          stepNumber: 2,
          titleFa: 'گرد کردن نتیجه بر اساس اعشار مشخص‌شده',
          expression: `\\text{Round}(Result, ${decimals})`,
          substitutedExpression: `Round(${evalResult.result.toFixed(4)}, ${decimals})`,
          intermediateValue: formatScientificNumber(evalResult.result, decimals),
          unit: record.outputUnit || '',
          noteFa: `فرمت خروجی با ${decimals} رقم اعشار`
        });

        return {
          success: true,
          value: evalResult.result,
          formattedValue: formatScientificNumber(evalResult.result, decimals),
          unit: record.outputUnit || '',
          decimals,
          standardReference: record.standardReference,
          isScientificallyValid: isScientificallyRef,
          trace,
          warnings,
          errors: [],
          evaluatedAt: new Date().toISOString(),
          metadata: {
            isCustom: true,
            expression: record.expression,
            evaluationSteps: evalResult.evaluationSteps
          }
        };
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        return {
          success: false,
          value: null,
          formattedValue: '-',
          unit: record.outputUnit || '',
          decimals,
          standardReference: record.standardReference,
          isScientificallyValid: false,
          trace: [],
          warnings,
          errors: [`خطا در ارزیابی فرمول سفارشی: ${errMsg}`],
          evaluatedAt: new Date().toISOString()
        };
      }
    }
  };
}

/**
 * Validates a custom formula expression syntax
 */
export function validateFormulaExpression(expression: string, variables: string[]): { valid: boolean; error?: string } {
  try {
    const tokens = tokenize(expression);
    parseToRpn(tokens);

    // Test with mock values (1 for all variables)
    const mockVars: Record<string, number> = {};
    for (const v of variables) {
      mockVars[v] = 1;
    }
    evaluateExpression(expression, mockVars);
    return { valid: true };
  } catch (err: unknown) {
    return { valid: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Returns a formula definition by its identifier (standard or custom)
 */
export function getFormulaById(id: string): FormulaDefinition | undefined {
  if (DEFAULT_FOOD_FORMULAS[id]) {
    return DEFAULT_FOOD_FORMULAS[id];
  }
  return customFormulasCache.get(id);
}

/**
 * Returns all available formulas (standard and custom)
 */
export function getAllFormulas(): FormulaDefinition[] {
  return [
    ...Object.values(DEFAULT_FOOD_FORMULAS),
    ...Array.from(customFormulasCache.values())
  ];
}

/**
 * Saves a new or updated custom formula in IndexedDB and in-memory cache
 */
export async function saveCustomFormula(record: CustomFormulaRecord): Promise<FormulaDefinition> {
  // Validate expression before persisting
  const varSymbols = (record.variables || []).map(v => v.symbol || v.id);
  const validation = validateFormulaExpression(record.expression, varSymbols);
  if (!validation.valid) {
    throw new Error(`عبارت ریاضی فرمول نامعتبر است: ${validation.error}`);
  }

  const def = convertCustomRecordToDefinition(record);
  customFormulasCache.set(record.id, def);

  try {
    await putItem(STORES.CUSTOM_FORMULAS, record);
  } catch (err) {
    console.warn('Could not persist custom formula to IndexedDB:', err);
  }

  return def;
}

/**
 * Deletes a custom formula
 */
export async function deleteCustomFormula(id: string): Promise<void> {
  customFormulasCache.delete(id);
  try {
    await deleteItem(STORES.CUSTOM_FORMULAS, id);
  } catch (err) {
    console.warn(`Could not delete custom formula ${id} from IndexedDB:`, err);
  }
}

/**
 * Loads all saved custom formulas from IndexedDB on startup
 */
export async function loadCustomFormulasFromStorage(): Promise<FormulaDefinition[]> {
  try {
    const records = await getAllItems<CustomFormulaRecord>(STORES.CUSTOM_FORMULAS);
    for (const rec of records) {
      const def = convertCustomRecordToDefinition(rec);
      customFormulasCache.set(rec.id, def);
    }
    return Array.from(customFormulasCache.values());
  } catch (err) {
    console.warn('Error loading custom formulas from storage:', err);
    return [];
  }
}
