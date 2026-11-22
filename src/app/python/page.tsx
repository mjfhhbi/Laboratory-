import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { usePythonEngine } from '../../lib/python/usePythonEngine';
import { PythonCodeEditor } from '../../components/python/PythonCodeEditor';
import { PythonOutputConsole } from '../../components/python/PythonOutputConsole';
import { PythonToolbar } from '../../components/python/PythonToolbar';
import { PythonFileUploader } from '../../components/python/PythonFileUploader';
import { PythonScriptsModal } from '../../components/python/PythonScriptsModal';
import { FOOD_ENGINEERING_TEMPLATES } from '../../lib/python/templates';
import {
  getAllSavedScripts,
  saveUserScript,
  deleteUserScript,
  downloadPythonScript
} from '../../lib/python/scriptStorage';
import { PythonScriptPreset } from '../../lib/python/types';
import { ShieldCheck, Cpu, HardDrive, Info } from 'lucide-react';

export const PythonPage: React.FC = () => {
  const {
    status,
    outputChunks,
    activeError,
    virtualFiles,
    lastDurationMs,
    runCode,
    stopExecution,
    clearOutput,
    uploadFile,
    deleteFile,
    resetNamespace
  } = usePythonEngine();

  // Active script in editor
  const [currentCode, setCurrentCode] = useState<string>(FOOD_ENGINEERING_TEMPLATES[0].code);
  const [activeScriptName, setActiveScriptName] = useState<string>(FOOD_ENGINEERING_TEMPLATES[0].title);
  const [timeoutSeconds, setTimeoutSeconds] = useState<number>(20);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [savedScripts, setSavedScripts] = useState<PythonScriptPreset[]>([]);

  // Load saved scripts on mount
  useEffect(() => {
    setSavedScripts(getAllSavedScripts());
  }, []);

  const handleRun = async () => {
    await runCode(currentCode, timeoutSeconds * 1000);
  };

  const handleSelectScript = (script: PythonScriptPreset) => {
    setCurrentCode(script.code);
    setActiveScriptName(script.title);
    clearOutput();
  };

  const handleSaveCurrentScript = (title: string, category: string, description: string) => {
    const saved = saveUserScript({
      title,
      category,
      description,
      code: currentCode
    });
    setActiveScriptName(title);
    setSavedScripts(getAllSavedScripts());
  };

  const handleDeleteScript = (id: string) => {
    deleteUserScript(id);
    setSavedScripts(getAllSavedScripts());
  };

  const handleDownload = () => {
    const filename = activeScriptName.replace(/\s+/g, '_').toLowerCase();
    downloadPythonScript(filename, currentCode);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="محیط برنامه‌نویسی و محاسبات مهندسی Python"
        englishTitle="Python Scientific & Engineering Environment"
        description="اجرای کدهای پایتون در نخ پس‌زمینه (Web Worker) با موتور WebAssembly (Pyodide)، پایش زمان اجرا، مدیریت حافظه و تحلیل داده‌های صنایع غذایی"
      />

      {/* Security & Architecture Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs">
          <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-stone-900 dark:text-stone-100 block">پردازش در Web Worker</span>
            <span className="text-[11px] text-stone-500">عدم انسداد رابط کاربری (Non-Blocking UI)</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <span className="font-bold text-stone-900 dark:text-stone-100 block">محیط سندباکس ایزوله</span>
            <span className="text-[11px] text-stone-500">عدم دسترسی به داده‌های خصوصی و کوکی‌ها</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs">
          <HardDrive className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-stone-900 dark:text-stone-100 block">سیستم فایل در حافظه (Virtual FS)</span>
            <span className="text-[11px] text-stone-500">پشتیبانی از خواندن فایل‌های CSV و داده</span>
          </div>
        </div>
      </div>

      {/* Execution Toolbar */}
      <PythonToolbar
        status={status}
        timeoutSeconds={timeoutSeconds}
        onTimeoutChange={setTimeoutSeconds}
        onRun={handleRun}
        onStop={stopExecution}
        onResetNamespace={resetNamespace}
        onOpenTemplates={() => setIsModalOpen(true)}
        onDownload={handleDownload}
      />

      {/* Main Coding & Console Workspace (Split Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[580px]">
        {/* Code Editor Pane (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col min-h-[380px] lg:min-h-[580px]">
          <PythonCodeEditor
            code={currentCode}
            onChange={setCurrentCode}
            onRun={handleRun}
            errorLine={activeError?.line}
            readOnly={status === 'running'}
          />
        </div>

        {/* Console & Output Pane (5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col min-h-[380px] lg:min-h-[580px]">
          <PythonOutputConsole
            outputs={outputChunks}
            error={activeError}
            durationMs={lastDurationMs}
            isRunning={status === 'running'}
            onClear={clearOutput}
          />
        </div>
      </div>

      {/* Virtual Filesystem & Data Loader Card */}
      <PythonFileUploader
        files={virtualFiles}
        onUpload={uploadFile}
        onDelete={deleteFile}
      />

      {/* Templates & Saved Scripts Modal */}
      <PythonScriptsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        savedScripts={savedScripts}
        currentCode={currentCode}
        onSelectScript={handleSelectScript}
        onSaveCurrentScript={handleSaveCurrentScript}
        onDeleteScript={handleDeleteScript}
      />
    </div>
  );
};

export default PythonPage;
