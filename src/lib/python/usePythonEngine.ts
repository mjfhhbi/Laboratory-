import { useState, useEffect, useRef, useCallback } from 'react';
import { PythonRunner } from './pythonRunner';
import {
  WorkerEngineStatus,
  OutputChunk,
  PythonExecutionError,
  PythonExecutionResult
} from './types';

export function usePythonEngine() {
  const runnerRef = useRef<PythonRunner | null>(null);
  const [status, setStatus] = useState<WorkerEngineStatus>('idle');
  const [outputChunks, setOutputChunks] = useState<OutputChunk[]>([]);
  const [activeError, setActiveError] = useState<PythonExecutionError | null>(null);
  const [virtualFiles, setVirtualFiles] = useState<string[]>([]);
  const [lastDurationMs, setLastDurationMs] = useState<number | null>(null);
  const [initProgressText, setInitProgressText] = useState<string>('');

  useEffect(() => {
    const runner = new PythonRunner({
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
      },
      onOutput: (chunk) => {
        setOutputChunks((prev) => [...prev, chunk]);
      },
      onError: (err) => {
        setActiveError(err);
      },
      onFilesChange: (files) => {
        setVirtualFiles(files);
      },
      onInitProgress: (text) => {
        setInitProgressText(text);
      }
    });

    runnerRef.current = runner;

    // Auto initialize Pyodide in background
    runner.init().catch(() => {});

    return () => {
      runner.destroy();
      runnerRef.current = null;
    };
  }, []);

  const clearOutput = useCallback(() => {
    setOutputChunks([]);
    setActiveError(null);
  }, []);

  const runCode = useCallback(async (code: string, timeoutMs: number = 20000): Promise<PythonExecutionResult> => {
    if (!runnerRef.current) {
      throw new Error('موتور پایتون بارگذاری نشده است.');
    }
    setActiveError(null);
    try {
      const res = await runnerRef.current.runCode(code, timeoutMs);
      if (res.success) {
        setLastDurationMs(res.durationMs);
      }
      return res;
    } catch (err: any) {
      return {
        success: false,
        durationMs: 0,
        error: { message: err?.message || String(err) }
      };
    }
  }, []);

  const stopExecution = useCallback(() => {
    runnerRef.current?.stopExecution('توقف اضطراری توسط کاربر');
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<void> => {
    if (!runnerRef.current) return;
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        runnerRef.current?.writeVirtualFile(file.name, text);
        resolve();
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }, []);

  const deleteFile = useCallback((filename: string) => {
    runnerRef.current?.deleteVirtualFile(filename);
  }, []);

  const resetNamespace = useCallback(() => {
    runnerRef.current?.resetNamespace();
  }, []);

  const initEngine = useCallback(async () => {
    await runnerRef.current?.init();
  }, []);

  return {
    status,
    outputChunks,
    activeError,
    virtualFiles,
    lastDurationMs,
    initProgressText,
    runCode,
    stopExecution,
    clearOutput,
    uploadFile,
    deleteFile,
    resetNamespace,
    initEngine
  };
}
