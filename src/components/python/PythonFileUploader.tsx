import React, { useRef } from 'react';
import { appAlert } from '../common/DialogProvider';
import { UploadCloud, FileText, Trash2, Copy, Check, Info } from 'lucide-react';

interface PythonFileUploaderProps {
  files: string[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (filename: string) => void;
}

export const PythonFileUploader: React.FC<PythonFileUploaderProps> = ({
  files,
  onUpload,
  onDelete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedFile, setCopiedFile] = React.useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Check size limit (max 10MB)
    if (selected.size > 10 * 1024 * 1024) {
      appAlert('حداکثر حجم مجاز فایل داده ۱۰ مگابایت است.', 'warning');
      return;
    }

    await onUpload(selected);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyCodeSnippet = (filename: string) => {
    const snippet = filename.endsWith('.csv')
      ? `import csv\nwith open("${filename}", "r", encoding="utf-8") as f:\n    reader = csv.reader(f)\n    for row in reader:\n        print(row)`
      : filename.endsWith('.json')
      ? `import json\nwith open("${filename}", "r", encoding="utf-8") as f:\n    data = json.load(f)\n    print(data)`
      : `with open("${filename}", "r", encoding="utf-8") as f:\n    content = f.read()\n    print(content)`;

    navigator.clipboard.writeText(snippet).then(() => {
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(null), 2000);
    }).catch(() => {});
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 space-y-3.5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
            فایل‌های داده در حافظه مجازی پایتون (Virtual FS)
          </h4>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            بارگذاری فایل‌های CSV، JSON و TXT جهت خواندن با تابع استاندارد open()
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json,.txt,.tsv"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors border border-stone-200 dark:border-stone-700"
          >
            <UploadCloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>بارگذاری فایل داده</span>
          </button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200/60 dark:border-stone-800 text-center text-xs text-stone-500 dark:text-stone-400">
          هیچ فایل داده‌ای در سیستم فایل مجازی بارگذاری نشده است. فایل‌های CSV یا TXT خود را بارگذاری کنید.
        </div>
      ) : (
        <div className="space-y-1.5">
          {files.map((filename) => (
            <div
              key={filename}
              className="flex items-center justify-between p-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-mono text-stone-800 dark:text-stone-200 truncate" dir="ltr">
                  {filename}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopyCodeSnippet(filename)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                  title="کپی قطعه کد خواندن فایل در پایتون"
                >
                  {copiedFile === filename ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>کد باز کردن</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onDelete(filename)}
                  className="p-1 rounded text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="حذف فایل از حافظه مجازی"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
