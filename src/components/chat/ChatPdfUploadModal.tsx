import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Check, 
  AlertCircle, 
  Loader2, 
  Layers, 
  Eye, 
  BookOpen, 
  Camera, 
  ShieldCheck, 
  Plus
} from 'lucide-react';
import { AttachedPdfDocument } from '../../lib/pdfAnalysis/types';
import { getAllStoredPdfs, processUploadedPdfFile } from '../../lib/storage/pdfDocumentStorage';
import { StoredPdfDocument } from '../../types/scientificSource';

interface ChatPdfUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachedPdfs: AttachedPdfDocument[];
  onAttachPdfs: (pdfs: AttachedPdfDocument[]) => void;
}

export const ChatPdfUploadModal: React.FC<ChatPdfUploadModalProps> = ({
  isOpen,
  onClose,
  attachedPdfs,
  onAttachPdfs
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [libraryPdfs, setLibraryPdfs] = useState<StoredPdfDocument[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(
    attachedPdfs.map((p) => p.id)
  );
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected doc IDs when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDocIds(attachedPdfs.map((p) => p.id));
      loadStoredPdfs();
    }
  }, [isOpen, attachedPdfs]);

  const loadStoredPdfs = async () => {
    setLoadingLibrary(true);
    try {
      const pdfs = await getAllStoredPdfs();
      setLibraryPdfs(pdfs);
    } catch (err) {
      console.error('Failed to load library PDFs:', err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  if (!isOpen) return null;

  const toggleSelectDoc = (docId: string) => {
    if (selectedDocIds.includes(docId)) {
      setSelectedDocIds(selectedDocIds.filter((id) => id !== docId));
    } else {
      if (selectedDocIds.length >= 2) {
        // Maximum 2 PDFs for comparative analysis
        setSelectedDocIds([selectedDocIds[1], docId]);
      } else {
        setSelectedDocIds([...selectedDocIds, docId]);
      }
    }
  };

  const handleApplySelection = () => {
    const selectedDocs: AttachedPdfDocument[] = [];
    for (const id of selectedDocIds) {
      // Find in library
      const found = libraryPdfs.find((p) => p.id === id);
      if (found) {
        selectedDocs.push({
          id: found.id,
          title: found.meta.title || found.fileName,
          fileName: found.fileName,
          fileSizeFormatted: found.meta.fileSizeFormatted,
          pageCount: found.pages.length,
          isScanned: found.meta.isScanned || false,
          sourceId: found.sourceId,
          authorOrOrg: found.meta.author,
          pages: found.pages.map((p) => ({
            pageNumber: p.pageNumber,
            sectionHeading: p.sectionHeading,
            text: p.text,
            isOcr: p.isOcr
          }))
        });
      } else {
        // Keep previously attached if not in current view
        const existing = attachedPdfs.find((p) => p.id === id);
        if (existing) selectedDocs.push(existing);
      }
    }

    onAttachPdfs(selectedDocs);
    onClose();
  };

  const handleProcessFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('تنها فایل‌های با فرمت PDF پشتیبانی می‌شوند.');
      return;
    }

    setIsProcessingUpload(true);
    setUploadError(null);

    try {
      const { pdfDoc } = await processUploadedPdfFile(file, {
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        authorOrOrganization: 'بارگذاری مستقیم کاربر در چت',
        year: '1402'
      });

      // Map to AttachedPdfDocument
      const newAttached: AttachedPdfDocument = {
        id: pdfDoc.id,
        title: pdfDoc.meta.title || pdfDoc.fileName,
        fileName: pdfDoc.fileName,
        fileSizeFormatted: pdfDoc.meta.fileSizeFormatted,
        pageCount: pdfDoc.pages.length,
        isScanned: pdfDoc.meta.isScanned || false,
        sourceId: pdfDoc.sourceId,
        authorOrOrg: pdfDoc.meta.author,
        pages: pdfDoc.pages.map((p) => ({
          pageNumber: p.pageNumber,
          sectionHeading: p.sectionHeading,
          text: p.text,
          isOcr: p.isOcr
        }))
      };

      // Add to attached docs (max 2)
      let nextList = [...attachedPdfs, newAttached];
      if (nextList.length > 2) {
        nextList = nextList.slice(-2);
      }
      onAttachPdfs(nextList);
      onClose();
    } catch (err: any) {
      console.error('PDF upload error:', err);
      setUploadError(err?.message || 'خطا در پردازش و استخراج لایه‌های متنی فایل PDF.');
    } finally {
      setIsProcessingUpload(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>پیوست سند و مقاله PDF به چت</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  حداکثر ۲ سند
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                جهت استخراج روش آزمایش، خلاصه‌سازی، پارامترها و مقایسه تطبیقی دو مقاله
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 px-5 pt-2 bg-stone-50/30 dark:bg-stone-950/20 text-xs">
          <button
            onClick={() => setActiveTab('library')}
            className={`pb-2.5 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>انتخاب از مخزن اسناد ({libraryPdfs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>بارگذاری فایل جدید PDF</span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {activeTab === 'library' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pb-1">
                <span>اسناد مورد نظر خود را انتخاب نمایید:</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  {selectedDocIds.length} از ۲ سند انتخاب شده
                </span>
              </div>

              {loadingLibrary ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-400">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  <span className="text-xs">در حال بارگذاری مخزن اسناد علمی...</span>
                </div>
              ) : libraryPdfs.length === 0 ? (
                <div className="text-center py-10 text-xs text-stone-500">
                  سندی در مخزن یافت نشد. لطفاً از زبانه بارگذاری، فایل PDF جدید اضافه نمایید.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {libraryPdfs.map((doc) => {
                    const isSelected = selectedDocIds.includes(doc.id);
                    return (
                      <div
                        key={doc.id}
                        onClick={() => toggleSelectDoc(doc.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-right relative ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 ring-1 ring-emerald-500/50'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 line-clamp-2 leading-relaxed">
                              {doc.meta.title || doc.fileName}
                            </h4>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                              {doc.meta.author || 'سازمان ناظر / آزمایشگاه'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[10px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3 text-stone-400" />
                            <span>{doc.pages.length} صفحه</span>
                          </span>

                          <div className="flex items-center gap-1">
                            {doc.meta.isScanned ? (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium">
                                OCR اسکن
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium">
                                متن دیجیتال
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Drag and drop upload zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[0.99]'
                    : 'border-stone-300 dark:border-stone-700 hover:border-emerald-500/80 bg-stone-50/50 dark:bg-stone-950/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleProcessFile(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs">
                  {isProcessingUpload ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {isProcessingUpload ? 'در حال استخراج لایه‌های متنی سند PDF...' : 'فایل PDF مقاله یا استاندارد را بکشید یا کلیک کنید'}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    پشتیبانی از اسناد متنی و اسکن‌شده (با موتور OCR اختصاصی) تا سقف ۲۵ مگابایت
                  </p>
                </div>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/30 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {selectedDocIds.length === 2 && (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                آماده تحلیل تطبیقی و مقایسه دو سند
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              انصراف
            </button>

            {activeTab === 'library' && (
              <button
                onClick={handleApplySelection}
                disabled={selectedDocIds.length === 0}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                  selectedDocIds.length > 0
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer active:scale-98'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>پیوست به چت ({selectedDocIds.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
