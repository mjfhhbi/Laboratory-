/**
 * Message protocols and types for the Python WebAssembly (Pyodide) WebWorker engine.
 */

export type WorkerEngineStatus =
  | 'idle'
  | 'initializing'
  | 'ready'
  | 'running'
  | 'error'
  | 'terminated';

export type OutputType = 'stdout' | 'stderr' | 'system' | 'info';

export interface OutputChunk {
  id: string;
  type: OutputType;
  text: string;
  timestamp: number;
}

export interface PythonExecutionError {
  message: string;
  line?: number;
  traceback?: string;
  type?: string;
}

export interface PythonExecutionResult {
  success: boolean;
  durationMs: number;
  error?: PythonExecutionError;
  returnedValue?: string;
}

export interface VirtualFile {
  name: string;
  size: number;
  lastModified: number;
  content: string;
}

export interface PythonScriptPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
  sampleFileName?: string;
  sampleFileContent?: string;
  updatedAt: string;
  isCustom?: boolean;
}

// ==========================================
// Worker Protocol Messages
// ==========================================

export type MainToWorkerMessage =
  | { type: 'INIT' }
  | { type: 'RUN_CODE'; id: string; code: string }
  | { type: 'WRITE_FILE'; filename: string; content: string }
  | { type: 'READ_FILE'; filename: string }
  | { type: 'DELETE_FILE'; filename: string }
  | { type: 'LIST_FILES' }
  | { type: 'RESET_STATE' }
  | { type: 'VERIFY_PACKAGES' };

export type WorkerToMainMessage =
  | { type: 'INIT_START' }
  | { type: 'INIT_PROGRESS'; text: string }
  | { type: 'INIT_SUCCESS'; version: string; source: 'local' | 'cdn' }
  | { type: 'INIT_ERROR'; error: string }
  | { type: 'STDOUT'; id?: string; text: string }
  | { type: 'STDERR'; id?: string; text: string }
  | { type: 'RUN_START'; id: string }
  | { type: 'RUN_COMPLETE'; id: string; durationMs: number; result?: string }
  | { type: 'RUN_ERROR'; id: string; error: string; line?: number; traceback?: string }
  | { type: 'FILE_WRITTEN'; filename: string }
  | { type: 'FILE_CONTENT'; filename: string; content: string }
  | { type: 'FILES_LIST'; files: string[] }
  | { type: 'PACKAGES_STATUS'; status: Record<string, { supported: boolean; version?: string; error?: string }> };
