import { PythonScriptPreset } from './types';
import { FOOD_ENGINEERING_TEMPLATES } from './templates';

const STORAGE_KEY = 'fs_python_user_scripts_v1';

export function getAllSavedScripts(): PythonScriptPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return FOOD_ENGINEERING_TEMPLATES;
    }
    const userScripts: PythonScriptPreset[] = JSON.parse(raw);
    // Combine user scripts with default templates, avoiding duplicates by id
    const userIds = new Set(userScripts.map((s) => s.id));
    const merged = [
      ...userScripts,
      ...FOOD_ENGINEERING_TEMPLATES.filter((t) => !userIds.has(t.id))
    ];
    return merged;
  } catch {
    return FOOD_ENGINEERING_TEMPLATES;
  }
}

export function saveUserScript(script: Omit<PythonScriptPreset, 'id' | 'updatedAt'> & { id?: string }): PythonScriptPreset {
  const existing = getAllSavedScripts();
  const id = script.id || `script_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const updatedAt = new Date().toISOString();

  const newScript: PythonScriptPreset = {
    ...script,
    id,
    updatedAt,
    isCustom: true
  };

  const userOnly = existing.filter((s) => s.id !== id && s.isCustom);
  userOnly.unshift(newScript);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userOnly));
  } catch {
    // Local storage quota or disabled
  }

  return newScript;
}

export function deleteUserScript(id: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const scripts: PythonScriptPreset[] = JSON.parse(raw);
    const filtered = scripts.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Ignore
  }
}

export function downloadPythonScript(filename: string, code: string): void {
  const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.py') ? filename : `${filename}.py`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
