import React, { useState, useEffect, useRef } from 'react';
import { 
  UnifiedScientificSource, 
  ScientificSourceType, 
  ScientificConfidenceLevel 
} from '../../types/scientificSource';
import { 
  createUnifiedSource, 
  saveUnifiedSource 
} from '../../lib/storage/scientificSourcesStorage';
import { processUploadedPdfFile } from '../../lib/storage/pdfDocumentStorage';
import { 
  X, 
  Check, 
  BookOpen, 
  Building, 
  Calendar, 
  Globe, 
  Link as LinkIcon, 
  Hash, 
  FileText, 
  ShieldCheck, 
  FileDown,
  Upload,
  Camera,
  AlertTriangle,
  Loader2,
  FileCheck
} from 'lucide-react';

interface UnifiedSourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (source: UnifiedScientificSource) => void;
  initialData?: UnifiedScientificSource | null;
}

const SOURCE_TYPES: Array<{ value: ScientificSourceType; label: string }> = [
  { value: 'scientific_paper', label: 'مقاله علمی پژوهشی داوری‌شده (Journal Article)' },
  { value: 'reference_book', label: 'کتاب مرجع تخصصی دانشگاهی (Textbook)' },
  { value: 'inso_standard', label: 'استاندارد ملی ایران (INSO / ISIRI)' },
  { value: 'iso_standard', label: 'استاندارد بین‌المللی ایزو (ISO)' },
  { value: 'aoac_method', label: 'روش رسمی آزمون (AOAC Official Method)' },
  { value: 'codex_standard', label: 'استاندارد بین‌المللی کدکس (Codex Alimentarius)' },
  { value: 'lecture_handout', label: 'جزوه آموزشی و پمفلت دانشگاهی (Lecture Handout)' },
  { value: 'lab_file', label: 'فایل، پروتکل یا گزارش آزمایشگاهی (Lab File / Protocol)' },
  { value: 'lab_manual', label: 'راهنمای آزمایشگاهی و SOP رسمی (Lab Manual / SOP)' },
  { value: 'sds', label: 'برگه اطلاعات ایمنی مواد شیمیایی (SDS / MSDS)' },
  { value: 'academic_thesis', label: 'منبع دانشگاهی و رساله پژوهشی (Thesis)' },
  { value: 'official_regulatory', label: 'منبع رسمی سازمانی و نظارتی (IFDA / FDA / EFSA)' }
];

const CONFIDENCE_LEVELS: Array<{ value: ScientificConfidenceLevel; label: string; desc: string }> = [
  {
    value: 'verified',
    label: 'تأییدشده رسمی (Verified)',
    desc: 'استاندارد رسمی مصوب ملی یا بین‌المللی با حدود و روش‌های الزام‌آور'
  },
  {
    value: 'source_backed',
    label: 'دارای منبع معتبر (Source-backed)',
    desc: 'مستند به مقالات پژوهشی ISI یا کتب مرجع دارای شماره شناسایی'
  },
  {
    value: 'partially_supported',
    label: 'پشتیبانی علمی جزئی (Partially supported)',
    desc: 'تایید اصولی بدون ذکر شماره دقیق استاندارد یا نیازمند بازبینی'
  },
  {
    value: 'unverified',
    label: 'فاقد منبع قطعی یا اسکن OCR (Unverified)',
    desc: 'داده‌های اولیه، تجربی یا OCR تصویری که نباید به عنوان فکت آزمایشگاهی تلقی شوند'
  }
];

export const UnifiedSourceFormModal: React.FC<UnifiedSourceFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialData
}) => {
  const [title, setTitle] = useState('');
  const [englishTitle, setEnglishTitle] = useState('');
  const [sourceType, setSourceType] = useState<ScientificSourceType>('scientific_paper');
  const [authorOrOrganization, setAuthorOrOrganization] = useState('');
  const [organization, setOrganization] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');
  const [editionOrVersion, setEditionOrVersion] = useState('');
  const [standardNumber, setStandardNumber] = useState('');
  const [doi, setDoi] = useState('');
  const [isbn, setIsbn] = useState('');
  const [country, setCountry] = useState('ایران');
  const [url, setUrl] = useState('');
  const [hasPdf, setHasPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const [accessDate, setAccessDate] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState<ScientificConfidenceLevel>('source_backed');
  const [notes, setNotes] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // PDF Upload & Extraction State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isScannedPdf, setIsScannedPdf] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfProcessingStatus, setPdfProcessingStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setEnglishTitle(initialData.englishTitle || '');
      setSourceType(initialData.sourceType);
      setAuthorOrOrganization(initialData.authorOrOrganization);
      setOrganization(initialData.organization || '');
      setPublisher(initialData.publisher || '');
      setYear(initialData.year);
      setEditionOrVersion(initialData.editionOrVersion || '');
      setStandardNumber(initialData.standardNumber || '');
      setDoi(initialData.doi || '');
      setIsbn(initialData.isbn || '');
      setCountry(initialData.country);
      setUrl(initialData.url || '');
      setHasPdf(Boolean(initialData.hasPdf));
      setPdfFileName(initialData.pdfFileName || '');
      setAccessDate(initialData.accessDate || '');
      setConfidenceLevel(initialData.confidenceLevel);
      setNotes(initialData.notes || '');
      setTagsText((initialData.tags || []).join(', '));
      setIsScannedPdf(Boolean(initialData.hasOcrExtracted));
    } else {
      setTitle('');
      setEnglishTitle('');
      setSourceType('scientific_paper');
      setAuthorOrOrganization('');
      setOrganization('');
      setPublisher('');
      setYear('1402');
      setEditionOrVersion('');
      setStandardNumber('');
      setDoi('');
      setIsbn('');
      setCountry('ایران');
      setUrl('');
      setHasPdf(false);
      setPdfFileName('');
      setAccessDate(new Date().toLocaleDateString('fa-IR'));
      setConfidenceLevel('source_backed');
      setNotes('');
      setTagsText('صنایع غذایی, کنترل کیفیت');
      setIsScannedPdf(false);
    }
    setUploadedFile(null);
    setPdfProcessingStatus(null);
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setHasPdf(true);
      setPdfFileName(file.name);
      // Auto-detect scanned keywords
      if (file.name.toLowerCase().includes('scan') || file.name.toLowerCase().includes('اسکن')) {
        setIsScannedPdf(true);
        setConfidenceLevel('unverified');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('عنوان منبع علمی الزامی است.');
      return;
    }
    if (!authorOrOrganization.trim()) {
      setError('نام نویسنده یا سازمان صادرکننده الزامی است.');
      return;
    }

    const tags = tagsText
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      setIsProcessingPdf(Boolean(uploadedFile));
      if (uploadedFile) {
        setPdfProcessingStatus('در حال پردازش فایل PDF، استخراج متن و ساخت چانک‌های RAG...');
      }

      let sourceRecord: UnifiedScientificSource;

      if (initialData) {
        sourceRecord = {
          ...initialData,
          title: title.trim(),
          englishTitle: englishTitle.trim() || undefined,
          sourceType,
          authorOrOrganization: authorOrOrganization.trim(),
          organization: organization.trim() || undefined,
          publisher: publisher.trim() || undefined,
          year: year.trim(),
          editionOrVersion: editionOrVersion.trim() || undefined,
          standardNumber: standardNumber.trim() || undefined,
          doi: doi.trim() || undefined,
          isbn: isbn.trim() || undefined,
          country: country.trim(),
          url: url.trim() || undefined,
          hasPdf: hasPdf || Boolean(uploadedFile),
          pdfFileName: uploadedFile ? uploadedFile.name : (hasPdf ? (pdfFileName.trim() || `${title.slice(0, 15)}.pdf`) : undefined),
          accessDate: accessDate.trim() || new Date().toLocaleDateString('fa-IR'),
          confidenceLevel: isScannedPdf ? 'unverified' : confidenceLevel,
          notes: notes.trim(),
          tags,
          updatedAt: new Date().toISOString()
        };
      } else {
        sourceRecord = await createUnifiedSource({
          title: title.trim(),
          englishTitle: englishTitle.trim() || undefined,
          sourceType,
          authorOrOrganization: authorOrOrganization.trim(),
          organization: organization.trim() || undefined,
          publisher: publisher.trim() || undefined,
          year: year.trim(),
          editionOrVersion: editionOrVersion.trim() || undefined,
          standardNumber: standardNumber.trim() || undefined,
          doi: doi.trim() || undefined,
          isbn: isbn.trim() || undefined,
          country: country.trim(),
          url: url.trim() || undefined,
          hasPdf: hasPdf || Boolean(uploadedFile),
          pdfFileName: uploadedFile ? uploadedFile.name : (hasPdf ? (pdfFileName.trim() || `${title.slice(0, 15)}.pdf`) : undefined),
          accessDate: accessDate.trim() || new Date().toLocaleDateString('fa-IR'),
          confidenceLevel: isScannedPdf ? 'unverified' : confidenceLevel,
          notes: notes.trim(),
          tags
        });
      }

      // If a real PDF file was selected, process its contents, pages, OCR & RAG
      if (uploadedFile) {
        setPdfProcessingStatus('در حال استخراج لایه‌های متنی و شاخص‌های OCR...');
        const { updatedSource } = await processUploadedPdfFile(uploadedFile, {
          ...sourceRecord,
          isScanned: isScannedPdf
        } as any);

        // Merge updated PDF meta into sourceRecord
        const finalSaved = await saveUnifiedSource({
          ...sourceRecord,
          ...updatedSource
        });
        setIsProcessingPdf(false);
        onSaved(finalSaved);
      } else {
        const finalSaved = await saveUnifiedSource(sourceRecord);
        onSaved(finalSaved);
      }

      onClose();
    } catch (err) {
      console.error('Failed to save scientific source:', err);
      setIsProcessingPdf(false);
      setError('خطا در ذخیره‌سازی منبع علمی یا پردازش PDF.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 my-8 text-right">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {initialData ? 'ویرایش منبع علمی و مستندات' : 'ثبت منبع علمی و فایل PDF (Scientific Resource)'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-900 text-xs">
            {error}
          </div>
        )}

        {isProcessingPdf && (
          <div className="my-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 rounded-xl border border-emerald-300 dark:border-emerald-800 text-xs flex items-center gap-3">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
            <span className="font-semibold">{pdfProcessingStatus || 'در حال پردازش سند PDF...'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 my-4 text-xs">
          {/* Row 1: Title (Fa & En) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                عنوان اصلی منبع (فارسی) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                عنوان لاتین (English Title)
              </label>
              <input
                type="text"
                value={englishTitle}
                onChange={(e) => setEnglishTitle(e.target.value)}
                placeholder="Pasteurized Milk - Specifications and Test Methods"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600 font-mono"
                dir="ltr"
              />
            </div>
          </div>

          {/* Row 2: Source Type (12 Categories) & Confidence Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                دسته‌بندی و نوع منبع (Source Category) *
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as ScientificSourceType)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
              >
                {SOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                وضعیت اعتبار علمی (Confidence Level) *
              </label>
              <select
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(e.target.value as ScientificConfidenceLevel)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
              >
                {CONFIDENCE_LEVELS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Author & Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                نویسنده / تدوین‌کننده *
              </label>
              <input
                type="text"
                required
                value={authorOrOrganization}
                onChange={(e) => setAuthorOrOrganization(e.target.value)}
                placeholder="دکتر فنما / کمیسیون استاندارد / AOAC International"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                سازمان مرتبط (Organization)
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="سازمان ملی استاندارد ایران / دانشگاه تهران / FDA"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Row 4: Year, Edition, Publisher, Standard Number */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                سال انتشار *
              </label>
              <input
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="1402 یا 2023"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                نسخه / ویرایش
              </label>
              <input
                type="text"
                value={editionOrVersion}
                onChange={(e) => setEditionOrVersion(e.target.value)}
                placeholder="ویرایش پنجم"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                ناشر / منبع
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="انتشارات دانشگاه / Elsevier"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                شماره استاندارد (در صورت وجود)
              </label>
              <input
                type="text"
                value={standardNumber}
                onChange={(e) => setStandardNumber(e.target.value)}
                placeholder="INSO 2406 یا ISO 22000"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600 font-mono"
                dir="ltr"
              />
            </div>
          </div>

          {/* Row 5: DOI, ISBN, URL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                شناسه دیجیتال (DOI در صورت وجود)
              </label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="10.1016/j.foodchem.2023..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600 font-mono"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                شابک کتاب (ISBN در صورت وجود)
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-0-8247-9691-4"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600 font-mono"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                نشانی اینترنتی (URL)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://standard.inso.gov.ir/..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600 font-mono"
                dir="ltr"
              />
            </div>
          </div>

          {/* Row 6: PDF Upload Dropzone & OCR Toggle */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <FileDown className="w-4 h-4 text-emerald-600" />
                <span>آپلود و پیوست فایل PDF سند:</span>
              </span>
              <span className="text-[11px] text-stone-500">پشتیبانی از PDF متن‌باز و اسکن‌های تصویری</span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-white dark:bg-stone-900"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {uploadedFile ? (
                <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <FileCheck className="w-5 h-5" />
                  <span>فایل انتخاب شد: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-6 h-6 text-stone-400 mx-auto" />
                  <p className="font-medium text-stone-700 dark:text-stone-300">
                    کلیک کنید یا فایل PDF را به اینجا بکشید و رها کنید
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">
                    فرمت مجاز: PDF با امکان استخراج صفحات و چانک‌بندی RAG
                  </p>
                </div>
              )}
            </div>

            {/* Scanned OCR Toggle */}
            <div className="pt-2 border-t border-stone-200/80 dark:border-stone-700">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isScannedPdf}
                  onChange={(e) => {
                    setIsScannedPdf(e.target.checked);
                    if (e.target.checked) {
                      setConfidenceLevel('unverified');
                    }
                  }}
                  className="rounded text-amber-600 mt-0.5"
                />
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                    <span>این فایل یک سند اسکن‌شده تصویری است (پردازش با OCR)</span>
                  </span>
                  <p className="text-[10px] text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                    متن به عنوان «استخراج‌شده از تصویر» علامت‌گذاری می‌شود و وضعیت اعتبار آن تا زمان بازبینی کارشناس «فاقد منبع قطعی / در انتظار بررسی» تنظیم خواهد شد.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Row 7: Notes & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                یادداشت‌های کاربردی و فنی (Notes)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="توضیحات در مورد حدود مجاز، متدولوژی آزمون و الزامات استانداردی..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                برچسب‌ها (Tags - با ویرگول جدا کنید)
              </label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="لبنیات, میکروبیولوژی, آزمون شیمیایی, اسیدیته"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={isProcessingPdf}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-colors disabled:opacity-50"
            >
              {isProcessingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال پردازش و استخراج...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{initialData ? 'ذخیره تغییرات' : 'ثبت و استخراج اطلاعات سند'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
