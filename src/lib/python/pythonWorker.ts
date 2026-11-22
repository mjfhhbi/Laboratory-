/**
 * Web Worker for running Python via Pyodide WebAssembly in an isolated background thread.
 * This ensures the main UI thread never blocks, long-running loops can be killed,
 * and user data (DOM, cookies, IndexedDB) cannot be accessed from Python.
 */

import { MainToWorkerMessage, WorkerToMainMessage } from './types';

// Worker global scope helper
const ctx: any = self;

// Pyodide instance reference
let pyodide: any = null;
let isInitializing = false;

/**
 * Extracts line number from Python error traceback
 */
function extractLineNumber(traceback: string): number | undefined {
  if (!traceback) return undefined;
  // Pyodide formats errors like: File "<exec>", line 5, in <module>
  // or: File "<string>", line 12
  const match = traceback.match(/File\s+["'](?:<exec>|<string>|<stdin>)["'],\s+line\s+(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  const genericMatch = traceback.match(/line\s+(\d+)/);
  if (genericMatch && genericMatch[1]) {
    return parseInt(genericMatch[1], 10);
  }
  return undefined;
}

/**
 * Clean system directories from Virtual FS listing
 */
const SYSTEM_DIRS = new Set(['.', '..', 'proc', 'dev', 'home', 'tmp', 'lib', 'etc']);

/**
 * Initialize Pyodide WebAssembly Engine
 * Loads strictly from self-hosted /pyodide/ assets (0.26.4) for 100% offline execution
 * with zero CDN dependency or remote fallback.
 */
async function initPyodide(): Promise<void> {
  if (pyodide) {
    ctx.postMessage({
      type: 'INIT_SUCCESS',
      version: pyodide.version || '0.26.4',
      source: 'local'
    } as WorkerToMainMessage);
    return;
  }

  if (isInitializing) return;
  isInitializing = true;

  ctx.postMessage({ type: 'INIT_START' } as WorkerToMainMessage);
  ctx.postMessage({
    type: 'INIT_PROGRESS',
    text: 'در حال بارگذاری موتور WebAssembly Pyodide (پایتون ۳.۱۲ محلی)...'
  } as WorkerToMainMessage);

  let pyodideModule: any = null;
  const source: 'local' | 'cdn' = 'local';
  let indexURL = '/pyodide/';

  try {
    // Load strictly from local self-hosted assets in /pyodide/ (Zero CDN reliance)
    const localOrigin = typeof self !== 'undefined' && self.location && self.location.origin
      ? self.location.origin
      : '';
    const localPath = localOrigin ? `${localOrigin}/pyodide/pyodide.mjs` : '/pyodide/pyodide.mjs';
    // @ts-ignore
    pyodideModule = await import(/* @vite-ignore */ localPath);
    indexURL = localOrigin ? `${localOrigin}/pyodide/` : '/pyodide/';
    pyodide = await pyodideModule.loadPyodide({
      indexURL,
      lockFileURL: `${indexURL}pyodide-lock.json`,
      stdout: (text: string) => {
        ctx.postMessage({ type: 'STDOUT', text } as WorkerToMainMessage);
      },
      stderr: (text: string) => {
        ctx.postMessage({ type: 'STDERR', text } as WorkerToMainMessage);
      }
    });
    if (pyodide?._api && typeof pyodide._api.setCdnUrl === 'function') {
      pyodide._api.setCdnUrl(indexURL);
    }

    // Configure standard scientific namespace and standard I/O flush
    await pyodide.runPythonAsync(`
import sys
import math
import json
import csv
import io
import os

# Ensure unbuffered flush
sys.stdout.reconfigure(line_buffering=True) if hasattr(sys.stdout, 'reconfigure') else None
sys.stderr.reconfigure(line_buffering=True) if hasattr(sys.stderr, 'reconfigure') else None
`);

    isInitializing = false;
    ctx.postMessage({
      type: 'INIT_SUCCESS',
      version: pyodide.version || '0.26.4',
      source
    } as WorkerToMainMessage);
  } catch (err: any) {
    isInitializing = false;
    const errorMsg =
      err?.message ||
      'خطا در بارگذاری اولیه Pyodide. لطفاً اتصال شبکه یا کش مرورگر را بررسی فرمایید.';
    ctx.postMessage({
      type: 'INIT_ERROR',
      error: errorMsg
    } as WorkerToMainMessage);
  }
}

/**
 * Execute Python code in isolated scope with auto package loading
 */
async function runCode(id: string, code: string): Promise<void> {
  if (!pyodide) {
    await initPyodide();
    if (!pyodide) {
      ctx.postMessage({
        type: 'RUN_ERROR',
        id,
        error: 'موتور پایتون هنوز مقداردهی اولیه نشده است.'
      } as WorkerToMainMessage);
      return;
    }
  }

  ctx.postMessage({ type: 'RUN_START', id } as WorkerToMainMessage);
  const startTime = performance.now();

  try {
    // Automatic package loading via loadPackagesFromImports
    if (typeof pyodide.loadPackagesFromImports === 'function') {
      try {
        await pyodide.loadPackagesFromImports(code, {
          messageCallback: (msg: string) => {
            ctx.postMessage({ type: 'STDOUT', id, text: `[پکیج]: ${msg}` } as WorkerToMainMessage);
          },
          errorCallback: (err: string) => {
            ctx.postMessage({ type: 'STDERR', id, text: `[خطای پکیج]: ${err}` } as WorkerToMainMessage);
          }
        });
      } catch (pkgErr: any) {
        ctx.postMessage({
          type: 'STDERR',
          id,
          text: `[هشدار]: بارگذاری خودکار برخی بسته‌ها با خطا روبرو شد: ${pkgErr?.message || pkgErr}`
        } as WorkerToMainMessage);
      }
    }

    // Execute Python code asynchronously
    const rawResult = await pyodide.runPythonAsync(code);
    const durationMs = Math.round(performance.now() - startTime);

    let resultString: string | undefined = undefined;
    if (rawResult !== undefined && rawResult !== null) {
      try {
        resultString = typeof rawResult === 'string' ? rawResult : String(rawResult);
      } catch {
        resultString = undefined;
      }
    }

    ctx.postMessage({
      type: 'RUN_COMPLETE',
      id,
      durationMs,
      result: resultString
    } as WorkerToMainMessage);
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - startTime);
    const traceback = err?.message || String(err);
    const line = extractLineNumber(traceback);

    // Extract cleaner error message from Python exception (last line of traceback)
    const lines = traceback.trim().split('\n');
    const lastLine = lines[lines.length - 1] || 'خطای اجرای پایتون';

    ctx.postMessage({
      type: 'RUN_ERROR',
      id,
      error: lastLine,
      line,
      traceback
    } as WorkerToMainMessage);
  }
}

/**
 * Verify compatibility of scientific packages (NumPy, SciPy, SymPy, Pandas, Matplotlib)
 */
async function verifyPackages(): Promise<void> {
  if (!pyodide) {
    await initPyodide();
  }
  if (!pyodide) return;

  const targetPackages = ['numpy', 'scipy', 'sympy', 'pandas', 'matplotlib'];
  const statusReport: Record<string, { supported: boolean; version?: string; error?: string }> = {};

  for (const pkg of targetPackages) {
    try {
      if (typeof pyodide.loadPackage === 'function') {
        await pyodide.loadPackage(pkg);
      }
      const testCode = pkg === 'matplotlib'
        ? `import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt; str(matplotlib.__version__)`
        : `import ${pkg}; str(${pkg}.__version__)`;
      const ver = await pyodide.runPythonAsync(testCode);
      statusReport[pkg] = { supported: true, version: String(ver) };
    } catch (err: any) {
      statusReport[pkg] = { supported: false, error: err?.message || String(err) };
    }
  }

  ctx.postMessage({
    type: 'PACKAGES_STATUS',
    status: statusReport
  } as WorkerToMainMessage);
}

/**
 * Handle virtual file operations
 */
function writeFile(filename: string, content: string): void {
  if (!pyodide) return;
  try {
    // Write file to Pyodide in-memory virtual filesystem
    pyodide.FS.writeFile(filename, content, { encoding: 'utf8' });
    ctx.postMessage({ type: 'FILE_WRITTEN', filename } as WorkerToMainMessage);
  } catch (err: any) {
    ctx.postMessage({
      type: 'STDERR',
      text: `خطا در نوشتن فایل ${filename}: ${err?.message || err}`
    } as WorkerToMainMessage);
  }
}

function readFile(filename: string): void {
  if (!pyodide) return;
  try {
    const content = pyodide.FS.readFile(filename, { encoding: 'utf8' });
    ctx.postMessage({ type: 'FILE_CONTENT', filename, content } as WorkerToMainMessage);
  } catch (err: any) {
    ctx.postMessage({
      type: 'STDERR',
      text: `خطا در خواندن فایل ${filename}: ${err?.message || err}`
    } as WorkerToMainMessage);
  }
}

function deleteFile(filename: string): void {
  if (!pyodide) return;
  try {
    pyodide.FS.unlink(filename);
    listFiles();
  } catch (err: any) {
    ctx.postMessage({
      type: 'STDERR',
      text: `خطا در حذف فایل ${filename}: ${err?.message || err}`
    } as WorkerToMainMessage);
  }
}

function listFiles(): void {
  if (!pyodide) {
    ctx.postMessage({ type: 'FILES_LIST', files: [] } as WorkerToMainMessage);
    return;
  }
  try {
    const allFiles: string[] = pyodide.FS.readdir('.');
    const userFiles = allFiles.filter((f) => !SYSTEM_DIRS.has(f) && !f.startsWith('.'));
    ctx.postMessage({ type: 'FILES_LIST', files: userFiles } as WorkerToMainMessage);
  } catch {
    ctx.postMessage({ type: 'FILES_LIST', files: [] } as WorkerToMainMessage);
  }
}

/**
 * Reset virtual globals and clear namespace
 */
async function resetState(): Promise<void> {
  if (!pyodide) return;
  try {
    await pyodide.runPythonAsync(`
import sys
# Clear user created global variables from __main__
to_delete = [k for k in list(globals().keys()) if not k.startswith('_') and k not in ['sys', 'math', 'json', 'csv', 'io', 'os']]
for k in to_delete:
    del globals()[k]
`);
    ctx.postMessage({
      type: 'STDOUT',
      text: '[سیستم]: محیط متغیرهای پایتون پاکسازی و بازنشانی شد.'
    } as WorkerToMainMessage);
  } catch {
    // Ignore reset error
  }
}

/**
 * Worker message router
 */
ctx.onmessage = async (e: MessageEvent<MainToWorkerMessage>) => {
  const msg = e.data;
  switch (msg.type) {
    case 'INIT':
      await initPyodide();
      break;
    case 'RUN_CODE':
      await runCode(msg.id, msg.code);
      break;
    case 'WRITE_FILE':
      writeFile(msg.filename, msg.content);
      listFiles();
      break;
    case 'READ_FILE':
      readFile(msg.filename);
      break;
    case 'DELETE_FILE':
      deleteFile(msg.filename);
      break;
    case 'LIST_FILES':
      listFiles();
      break;
    case 'RESET_STATE':
      await resetState();
      break;
    case 'VERIFY_PACKAGES':
      await verifyPackages();
      break;
    default:
      break;
  }
};
