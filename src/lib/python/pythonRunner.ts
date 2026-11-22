/**
 * PythonRunner: Main-thread manager for Python Web Worker execution.
 * Handles worker lifecycle, timeouts, stdout/stderr streaming,
 * termination/cancellation, and memory isolation.
 */

import {
  MainToWorkerMessage,
  WorkerToMainMessage,
  WorkerEngineStatus,
  OutputChunk,
  PythonExecutionError,
  PythonExecutionResult
} from './types';

export interface PythonRunnerListeners {
  onStatusChange?: (status: WorkerEngineStatus) => void;
  onOutput?: (chunk: OutputChunk) => void;
  onError?: (error: PythonExecutionError) => void;
  onFilesChange?: (files: string[]) => void;
  onInitProgress?: (text: string) => void;
}

export class PythonRunner {
  private worker: Worker | null = null;
  private status: WorkerEngineStatus = 'idle';
  private listeners: PythonRunnerListeners = {};
  private currentRunId: string | null = null;
  private runTimeoutTimer: any = null;
  private resolveCurrentRun: ((result: PythonExecutionResult) => void) | null = null;
  private resolveVerifyPackages: ((status: Record<string, { supported: boolean; version?: string; error?: string }>) => void) | null = null;
  private virtualFiles: string[] = [];

  constructor(listeners?: PythonRunnerListeners) {
    if (listeners) {
      this.listeners = listeners;
    }
  }

  public setListeners(listeners: PythonRunnerListeners): void {
    this.listeners = { ...this.listeners, ...listeners };
  }

  public getStatus(): WorkerEngineStatus {
    return this.status;
  }

  public getVirtualFiles(): string[] {
    return this.virtualFiles;
  }

  /**
   * Initializes or gets the running Web Worker
   */
  public async init(): Promise<void> {
    if (this.worker && (this.status === 'ready' || this.status === 'running')) {
      return;
    }

    this.setStatus('initializing');

    try {
      this.spawnWorker();
      this.postMessage({ type: 'INIT' });
    } catch (err: any) {
      this.setStatus('error');
      this.emitOutput('stderr', `خطا در ایجاد وب‌ورکر پایتون: ${err?.message || err}`);
    }
  }

  /**
   * Spawns a new clean Web Worker instance
   */
  private spawnWorker(): void {
    if (this.worker) {
      try {
        this.worker.terminate();
      } catch {
        // Ignore termination error
      }
      this.worker = null;
    }

    // Create ES Module Web Worker using Vite standard syntax
    this.worker = new Worker(new URL('./pythonWorker.ts', import.meta.url), {
      type: 'module'
    });

    this.worker.onmessage = (e: MessageEvent<WorkerToMainMessage>) => {
      this.handleWorkerMessage(e.data);
    };

    this.worker.onerror = (e: ErrorEvent) => {
      this.setStatus('error');
      this.emitOutput('stderr', `خطای داخلی وب‌ورکر: ${e.message}`);
    };
  }

  /**
   * Post message to worker safely
   */
  private postMessage(msg: MainToWorkerMessage): void {
    if (!this.worker) {
      this.spawnWorker();
    }
    this.worker?.postMessage(msg);
  }

  /**
   * Dispatches and handles messages coming from the worker
   */
  private handleWorkerMessage(msg: WorkerToMainMessage): void {
    switch (msg.type) {
      case 'INIT_START':
        this.setStatus('initializing');
        break;

      case 'INIT_PROGRESS':
        this.listeners.onInitProgress?.(msg.text);
        this.emitOutput('info', msg.text);
        break;

      case 'INIT_SUCCESS':
        this.setStatus('ready');
        const sourceLabel = msg.source === 'local' ? 'محلی و آفلاین' : 'شبکه/CDN';
        this.emitOutput('system', `موتور پایتون نسخه ${msg.version} (Pyodide WASM - منبع: ${sourceLabel}) با موفقیت آماده شد.`);
        this.postMessage({ type: 'LIST_FILES' });
        break;

      case 'INIT_ERROR':
        this.setStatus('error');
        this.emitOutput('stderr', `خطا در راه‌اندازی پایتون: ${msg.error}`);
        break;

      case 'STDOUT':
        this.emitOutput('stdout', msg.text);
        break;

      case 'STDERR':
        this.emitOutput('stderr', msg.text);
        break;

      case 'RUN_START':
        this.setStatus('running');
        break;

      case 'RUN_COMPLETE':
        this.clearTimeoutTimer();
        this.setStatus('ready');
        this.emitOutput('system', `[پایان اجرای کد در ${msg.durationMs} میلی‌ثانیه]`);
        if (this.resolveCurrentRun && this.currentRunId === msg.id) {
          this.resolveCurrentRun({
            success: true,
            durationMs: msg.durationMs,
            returnedValue: msg.result
          });
          this.resolveCurrentRun = null;
          this.currentRunId = null;
        }
        break;

      case 'RUN_ERROR':
        this.clearTimeoutTimer();
        this.setStatus('ready');
        const errObj: PythonExecutionError = {
          message: msg.error,
          line: msg.line,
          traceback: msg.traceback
        };
        this.listeners.onError?.(errObj);
        this.emitOutput('stderr', `خطای اجرا${msg.line ? ` (خط ${msg.line})` : ''}: ${msg.error}`);
        if (msg.traceback) {
          this.emitOutput('stderr', msg.traceback);
        }
        if (this.resolveCurrentRun && this.currentRunId === msg.id) {
          this.resolveCurrentRun({
            success: false,
            durationMs: 0,
            error: errObj
          });
          this.resolveCurrentRun = null;
          this.currentRunId = null;
        }
        break;

      case 'FILES_LIST':
        this.virtualFiles = msg.files;
        this.listeners.onFilesChange?.(msg.files);
        break;

      case 'FILE_WRITTEN':
        this.emitOutput('info', `فایل داده «${msg.filename}» در حافظه مجازی پایتون بارگذاری شد.`);
        this.postMessage({ type: 'LIST_FILES' });
        break;

      case 'PACKAGES_STATUS':
        this.emitOutput('info', 'وضعیت بسته‌های علمی پایتون: ' + JSON.stringify(msg.status));
        if (this.resolveVerifyPackages) {
          this.resolveVerifyPackages(msg.status);
          this.resolveVerifyPackages = null;
        }
        break;

      default:
        break;
    }
  }

  /**
   * Executes Python code with automatic timeout enforcement
   */
  public async runCode(code: string, timeoutMs: number = 20000): Promise<PythonExecutionResult> {
    if (this.status === 'running') {
      throw new Error('یک اسکریپت دیگر در حال اجرا است. ابتدا آن را متوقف کنید.');
    }

    if (!this.worker || this.status !== 'ready') {
      await this.init();
    }

    const id = `run_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    this.currentRunId = id;
    this.setStatus('running');

    // Setup execution timeout
    this.clearTimeoutTimer();
    this.runTimeoutTimer = setTimeout(() => {
      this.handleExecutionTimeout(id, timeoutMs);
    }, timeoutMs);

    return new Promise<PythonExecutionResult>((resolve) => {
      this.resolveCurrentRun = resolve;
      this.postMessage({ type: 'RUN_CODE', id, code });
    });
  }

  /**
   * Forcefully terminates execution (User cancellation or infinite loop timeout)
   */
  public stopExecution(reason: string = 'اجرای کد توسط کاربر متوقف شد.'): void {
    if (this.status !== 'running' && !this.currentRunId) {
      return;
    }

    this.clearTimeoutTimer();
    this.emitOutput('stderr', `[توقف اضطراری]: ${reason}`);

    if (this.resolveCurrentRun) {
      this.resolveCurrentRun({
        success: false,
        durationMs: 0,
        error: { message: reason }
      });
      this.resolveCurrentRun = null;
      this.currentRunId = null;
    }

    // Forcefully kill the Web Worker to release memory and break any infinite loops
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    this.setStatus('terminated');
    this.emitOutput('system', 'حافظه وب‌ورکر آزاد شد. در حال بازنشانی خودکار مفسر...');

    // Automatically re-spawn a fresh worker so the next run works without delay
    setTimeout(() => {
      this.init().catch(() => {});
    }, 200);
  }

  /**
   * Handles timeout when a script runs longer than limit
   */
  private handleExecutionTimeout(id: string, timeoutMs: number): void {
    if (this.currentRunId === id && this.status === 'running') {
      this.stopExecution(`زمان اجرای اسکریپت از حد مجاز (${Math.round(timeoutMs / 1000)} ثانیه) فراتر رفت.`);
    }
  }

  /**
   * Mounts a data file into Pyodide virtual filesystem
   */
  public writeVirtualFile(filename: string, content: string): void {
    this.postMessage({
      type: 'WRITE_FILE',
      filename,
      content
    });
  }

  /**
   * Deletes a virtual file
   */
  public deleteVirtualFile(filename: string): void {
    this.postMessage({
      type: 'DELETE_FILE',
      filename
    });
  }

  /**
   * Refreshes virtual files list
   */
  public refreshFiles(): void {
    this.postMessage({ type: 'LIST_FILES' });
  }

  /**
   * Resets global namespace
   */
  public resetNamespace(): void {
    this.postMessage({ type: 'RESET_STATE' });
  }

  /**
   * Verifies that offline scientific packages (NumPy, SciPy, SymPy, Pandas, Matplotlib) load properly
   */
  public async verifyPackages(
    timeoutMs: number = 30000
  ): Promise<Record<string, { supported: boolean; version?: string; error?: string }>> {
    if (!this.worker || this.status !== 'ready') {
      await this.init();
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.resolveVerifyPackages = null;
        reject(new Error('زمان بررسی بسته‌های علمی پایتون به پایان رسید.'));
      }, timeoutMs);

      this.resolveVerifyPackages = (status) => {
        clearTimeout(timer);
        resolve(status);
      };
      this.postMessage({ type: 'VERIFY_PACKAGES' });
    });
  }

  private clearTimeoutTimer(): void {
    if (this.runTimeoutTimer) {
      clearTimeout(this.runTimeoutTimer);
      this.runTimeoutTimer = null;
    }
  }

  private setStatus(status: WorkerEngineStatus): void {
    this.status = status;
    this.listeners.onStatusChange?.(status);
  }

  private emitOutput(type: OutputChunk['type'], text: string): void {
    const chunk: OutputChunk = {
      id: `chunk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      text,
      timestamp: Date.now()
    };
    this.listeners.onOutput?.(chunk);
  }

  public destroy(): void {
    this.clearTimeoutTimer();
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.setStatus('idle');
  }
}
