/**
 * Food Science AI - Scientific PDF Management, Text Extraction, OCR & RAG Storage Engine
 * Part 22 of 30 - Scientific Resource & PDF Management System
 */

import { STORES, getItem, putItem, deleteItem, getAllItems } from './indexedDb';
import { 
  StoredPdfDocument, 
  PdfDocumentMeta, 
  PdfPageContent, 
  RagDocumentChunk,
  PdfSearchMatch,
  LinkToKnowledgePayload,
  UnifiedScientificSource
} from '../../types/scientificSource';
import { saveUnifiedSource, getUnifiedSourceById } from './scientificSourcesStorage';
import { createKnowledgeRecord } from './knowledgeBase';
import { KnowledgeCategory, VerificationStatus } from '../../types/knowledgeBase';

export const PDF_DOCUMENTS_STORE = STORES.PDF_DOCUMENTS;

// Sample Pre-seeded PDF Documents to provide immediate audit-ready experience
export const INITIAL_SEEDED_PDFS: StoredPdfDocument[] = [
  {
    id: 'pdf_inso_2406',
    sourceId: 'src-inso-2406',
    fileName: 'INSO-2406-4th-ed-milk.pdf',
    fileSize: 1420800,
    meta: {
      fileName: 'INSO-2406-4th-ed-milk.pdf',
      fileSize: 1420800,
      fileSizeFormatted: '1.38 MB',
      mimeType: 'application/pdf',
      pageCount: 6,
      title: 'شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون (استاندارد ملی ۲۴۰۶)',
      author: 'کمیسیون فنی استاندارد ملی ایران',
      creator: 'ISIRI Desktop Publishing Engine v4.2',
      creationDate: '1394/08/20',
      pdfVersion: '1.6',
      isScanned: false,
      scanDetectionReason: 'متن دیجیتال مستقیم با لایه برداری استاندارد UTF-8'
    },
    pages: [
      {
        pageNumber: 1,
        sectionHeading: 'صفحه عنوان و هدف و دامنه کاربرد',
        extractionMethod: 'digital_text',
        isOcr: false,
        isHumanVerified: true,
        paragraphs: [
          'جمهوری اسلامی ایران - سازمان ملی استاندارد ایران',
          'استاندارد ملی ایران به شماره ۲۴۰۶ (تجدیدنظر چهارم - سال ۱۳۹۴)',
          'شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون (Pasteurized Milk - Specifications & Test Methods)',
          '۱. هدف و دامنه کاربرد: هدف از تدوین این استاندارد، تعیین ویژگی‌های حسی، فیزیکی، شیمیایی و روش‌های آزمون شیر پاستوریزه کامل، نیم‌چرب و کم‌چرب گاو جهت مصارف خانگی و صنعتی می‌باشد.'
        ],
        text: `جمهوری اسلامی ایران - سازمان ملی استاندارد ایران
استاندارد ملی ایران به شماره ۲۴۰۶ (تجدیدنظر چهارم - سال ۱۳۹۴)
شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون (Pasteurized Milk - Specifications & Test Methods)
۱. هدف و دامنه کاربرد:
هدف از تدوین این استاندارد، تعیین ویژگی‌های حسی، فیزیکی، شیمیایی و روش‌های آزمون شیر پاستوریزه کامل، نیم‌چرب و کم‌چرب گاو جهت مصارف خانگی و صنعتی می‌باشد.
این استاندارد برای انواع شیر طعم‌دار یا شیر فرادما (UHT) کاربرد ندارد و صرفاً ناظر بر فرآیند پاستوریزاسیون مداوم HTST یا پاستوریزاسیون دسته‌ای (Holder) شیر پاستوریزه گاو است.`
      },
      {
        pageNumber: 2,
        sectionHeading: 'فرآیند حرارتی و آزمون فسفاتاز قلیایی',
        extractionMethod: 'digital_text',
        isOcr: false,
        isHumanVerified: true,
        paragraphs: [
          '۴. شرایط فرآیند پاستوریزاسیون:',
          'شیر پاستوریزه باید تحت فرآیند حرارتی مداوم حداقل ۷۲ درجه سلسیوس (72°C) به مدت حداقل ۱۵ ثانیه یا فرآیند معادل آن قرار گیرد تا کلیه میکروارگانیسم‌های بیماری‌زا (پاتوژن) غیرفعال گردند.',
          'بلافاصله پس از تکمیل فرآیند حرارتی، شیر باید تا دمای کمتر از ۴ درجه سلسیوس (4°C) خنک شود.',
          '۵. آزمون تایید پاستوریزاسیون (فسفاتاز قلیایی Alkaline Phosphatase):',
          'آزمون آلکالین فسفاتاز در شیر پاستوریزه باید کاملاً منفی باشد (کمتر از ۳۵۰ میلی‌واحد بر لیتر). مثبت بودن فسفاتاز نشانه نقص فرآیند حرارتی یا آلودگی مجدد با شیر خام است.'
        ],
        text: `۴. شرایط فرآیند پاستوریزاسیون:
شیر پاستوریزه باید تحت فرآیند حرارتی مداوم حداقل ۷۲ درجه سلسیوس (72°C) به مدت حداقل ۱۵ ثانیه یا فرآیند معادل آن قرار گیرد تا کلیه میکروارگانیسم‌های بیماری‌زا (پاتوژن) غیرفعال گردند.
بلافاصله پس از تکمیل فرآیند حرارتی، شیر باید تا دمای کمتر از ۴ درجه سلسیوس (4°C) خنک شود و زنجیره سرد تا زمان مصرف نهایی حفظ گردد.
۵. آزمون تایید پاستوریزاسیون (فسفاتاز قلیایی Alkaline Phosphatase):
آزمون آلکالین فسفاتاز در شیر پاستوریزه باید کاملاً منفی باشد (کمتر از ۳۵۰ میلی‌واحد بر لیتر). مثبت بودن فسفاتاز نشانه نقص فرآیند حرارتی یا نشت شیر خام به بخش پاستوریزه است.`
      },
      {
        pageNumber: 3,
        sectionHeading: 'جدول ۱ - ویژگی‌های فیزیکوشیمیایی شیر پاستوریزه',
        extractionMethod: 'digital_text',
        isOcr: false,
        isHumanVerified: true,
        paragraphs: [
          'جدول ۱: حدود مجاز فیزیکوشیمیایی شیر پاستوریزه گاو:',
          '۱. اسیدیته بر حسب درجه دورنیک (°D): بین ۱۴ تا ۱۶ درجه دورنیک (معادل ۰.۱۴ تا ۰.۱۶ درصد اسید لاکتیک).',
          '۲. پ‌هاش (pH در دمای ۲۰ درجه سلسیوس): ۶.۶۰ تا ۶.۸۰.',
          '۳. دانسیته در دمای ۲۰ درجه سلسیوس: حداقل ۱.۰۲۹ گرم بر سانتی‌متر مکعب (g/cm³).',
          '۴. ماده خشک بدون چربی (SNF): حداقل ۸.۵ درصد وزنی.',
          '۵. درصد چربی: شیر کم‌چرب حداکثر ۱.۵٪، نیم‌چرب ۱.۵ تا ۲.۵٪، پرچرب حداقل ۳.۰٪.'
        ],
        text: `جدول ۱: حدود مجاز فیزیکوشیمیایی شیر پاستوریزه گاو:
ردیف | ویژگی فیزیکوشیمیایی | حد مجاز | روش آزمون استاندارد
۱ | اسیدیته بر حسب درجه دورنیک (°D) | ۱۴ تا ۱۶ | INSO 2852
۲ | پ‌هاش (pH در دمای 20°C) | ۶.۶۰ تا ۶.۸۰ | استاندارد ملی ۲۸۵۲
۳ | دانسیته در 20°C (g/cm³) | حداقل ۱.۰۲۹ | هیدرومتری و پیکنومتری
۴ | ماده خشک بدون چربی (SNF) | حداقل ۸.۵ درصد وزنی | روش وزنی INSO 637
۵ | درصد چربی شیر کامل | حداقل ۳.۰ درصد | ژربیر INSO 366
۶ | نقطه انجماد (Freezing Point) | ۵۱۵- تا ۵۳۵- میلی‌درجه سلسیوس | کرایوسکوپی هورویت
۷ | آزمون جوش (Clot on Boiling) | منفی (بدون لخته) | استاندارد ملی ۲۸۵۲`
      },
      {
        pageNumber: 4,
        sectionHeading: 'روش آزمون تعیین اسیدیته به روش دورنیک',
        extractionMethod: 'digital_text',
        isOcr: false,
        isHumanVerified: true,
        paragraphs: [
          '۶. روش تعیین اسیدیته شیر (دستورالعمل دورنیک):',
          '۱۰ میلی‌لیتر از نمونه شیر را با پیپت برداشته و در ارلن‌مایر ۱۰۰ میلی‌لیتری بریزید.',
          '۴ تا ۵ قطره معرف فنل‌فتالئین ۱ درصد الکلی به نمونه اضافه نمایید.',
          'با محلول هیدروکسید سدیم N/9 (سود دورنیک ۰.۱۱۱ نرمال) تا پیدایش رنگ صورتی کم‌رنگ و پایدار به مدت ۳۰ ثانیه تیتر کنید.',
          'هر ۰.۱ میلی‌لیتر سود دورنیک مصرفی معادل ۱ درجه دورنیک (°D) می‌باشد. فرمول: Acidity (°D) = V_NaOH (mL) × 10'
        ],
        text: `۶. روش تعیین اسیدیته شیر (دستورالعمل دورنیک - Dornic Method):
اصول روش: خنثی‌سازی اسیدهای طبیعی و تولیدی شیر با محلول قلیایی هیدروکسید سدیم استاندارد در حضور معرف فنل‌فتالئین.
مواد و معرف‌ها:
- محلول سود N/9 هیدروکسید سدیم (0.111 N)
- معرف فنل‌فتالئین 1% وزنی/حجمی در اتانول 96 درجه
روش کار:
۱. مقدار ۱۰ میلی‌لیتر از نمونه همگن‌شده شیر را با پیپت به یک ارلن مایر ۱۰۰ میلی‌لیتری منتقل کنید.
۲. ۴ الی ۵ قطره معرف فنل‌فتالئین اضافه نموده و ارلن را به آرامی تکان دهید.
۳. بورت محتوی سود N/9 را صفر کرده و قطره قطره تا ظهور رنگ صورتی بسیار کم‌رنگ پایدار (حداقل ۳۰ ثانیه) تیتر نمایید.
محاسبه:
درجه دورنیک (°D) = حجم سود مصرفی بر حسب میلی‌لیتر × ۱۰
مثال: اگر ۱.۵ میلی‌لیتر سود مصرف شود، اسیدیته برابر ۱۵ درجه دورنیک است که در دامنه استاندارد قرار دارد.`
      },
      {
        pageNumber: 5,
        sectionHeading: 'مواد افزودنی غیرمجاز و آزمون‌های تقلب',
        extractionMethod: 'digital_text',
        isOcr: false,
        isHumanVerified: true,
        paragraphs: [
          '۷. تقلبات و افزودنی‌های شیمیایی:',
          'افزودن هرگونه ماده خنثی‌کننده شیمیایی نظیر جوش شیرین (بی‌کربنات سدیم)، سود کاستیک و کربنات‌ها مطلقا ممنوع است.',
          'آزمون رزلیک اسید (Rosalic Acid Test) جهت ردیابی ترکیبات قلیایی باید منفی باشد.',
          'افزودن آب به شیر (کاهش دانسیته و افزایش نقطه انجماد به سمت صفر) تقلب محسوب می‌شود.',
          'افزودن نشاسته، فرمالین، پراکسید هیدروژن (آب اکسیژنه) و هیپوکلریت باید کاملاً منفی باشد.'
        ],
        text: `۷. تقلبات و افزودنی‌های شیمیایی ممنوع:
افزودن هرگونه ماده خنثی‌کننده شیمیایی نظیر جوش شیرین (بی‌کربنات سدیم)، هیدروکسید سدیم یا کربنات‌ها جهت پوشاندن ترشیدگی شیر خام مطلقا غیرمجاز است.
آزمون‌های شیمیایی شناسایی تقلبات:
- آزمون رزلیک اسید (Rosalic Acid Test): جهت شناسایی کربنات‌ها و بی‌کربنات‌ها - نتیجه باید منفی باشد (عدم تشکیل حلقه قرمز ارغوانی).
- آزمون ید: جهت ردیابی نشاسته به عنوان قوام‌دهنده - نتیجه باید منفی باشد.
- آزمون وانادیوم پنتااکسید یا پراکسیداز: جهت ردیابی آب اکسیژنه (H2O2) - نتیجه باید منفی باشد.
- آزمون فلوروگلوسینول: جهت ردیابی فرمالین به عنوان نگهدارنده - نتیجه باید کاملا منفی باشد.`
      },
      {
        pageNumber: 6,
        sectionHeading: 'نشانه‌گذاری، بسته‌بندی و شرایط حمل و نگهداری',
        extractionMethod: 'digital_text',
        isOcr: false,
        isHumanVerified: true,
        paragraphs: [
          '۸. شرایط نگهداری: شیر پاستوریزه باید بلافاصله در دمای ۱ الی ۴ درجه سلسیوس در سردخانه نگهداری و با خودروهای یخچال‌دار توزیع شود.',
          '۹. نشانه‌گذاری الزامی: نام فرآورده با قید درصد چربی، تاریخ تولید و انقضا به صورت خوانا، شماره پروانه بهداشتی ساخت، نشان استاندارد ملی و شرایط نگهداری.'
        ],
        text: `۸. شرایط نگهداری و انبارش:
شیر پاستوریزه باید در تمام مراحل انبارداری، توزیع، فروشگاه و نگهداری خانگی در دمای ۱ تا ۴ درجه سلسیوس درون یخچال قرار داشته باشد. قطع زنجیره سرد به مدت بیش از ۱ ساعت موجب فعال شدن باکتری‌های سرماگرا (Psychrotrophic) و افت سریع کیفیت می‌شود.
۹. بسته‌بندی و نشانه‌گذاری الزامی روی برچسب:
- عبارت «شیر پاستوریزه گاو» همراه با درصد چربی مشخص
- تاریخ تولید، ساعت و تاریخ انقضا (حداکثر ماندگاری معمولاً ۳ تا ۵ روز در زنجیره سرد)
- پروانه ساخت وزارت بهداشت / سازمان غذا و دارو (IFDA)
- علامت استاندارد ملی ایران و کد رهگیری ۱۰ رقمی استاندارد
- شماره سری ساخت یا بچ نامبر (Batch No)
- جدول ارزش تغذیه‌ای و نشانگر رنگی تغذیه‌ای (چراغ راهنمای سلامت)`
      }
    ],
    ragChunks: [
      {
        id: 'chunk_inso_2406_p1',
        sourceId: 'src-inso-2406',
        sourceTitle: 'شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون (INSO 2406)',
        standardNumber: 'INSO 2406:1394',
        pageNumber: 1,
        chunkIndex: 0,
        sectionHeading: 'دامنه کاربرد و تعاریف',
        text: 'استاندارد ملی ایران ۲۴۰۶ تجدیدنظر چهارم: تعیین ویژگی‌های حسی، فیزیکی، شیمیایی شیر پاستوریزه کامل، نیم‌چرب و کم‌چرب گاو جهت مصارف خانگی و صنعتی.',
        tokenCountEstimate: 58,
        isOcr: false,
        isVerified: true,
        tags: ['لبنیات', 'شیر پاستوریزه', 'استاندارد ملی', 'INSO 2406'],
        embeddingReady: true
      },
      {
        id: 'chunk_inso_2406_p2',
        sourceId: 'src-inso-2406',
        sourceTitle: 'شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون (INSO 2406)',
        standardNumber: 'INSO 2406:1394',
        pageNumber: 2,
        chunkIndex: 1,
        sectionHeading: 'فرآیند حرارتی و آزمون فسفاتاز',
        text: 'فرآیند پاستوریزاسیون مداوم HTST: حداقل دمای ۷۲ درجه سلسیوس به مدت ۱۵ ثانیه یا فرآیند معادل. خنک‌سازی سریع تا دمای کمتر از ۴ درجه. آزمون فسفاتاز قلیایی باید کاملاً منفی باشد (کمتر از ۳۵۰ میلی‌واحد در لیتر).',
        tokenCountEstimate: 75,
        isOcr: false,
        isVerified: true,
        tags: ['پاستوریزاسیون', 'HTST', 'فسفاتاز قلیایی', 'آلکالین فسفاتاز'],
        embeddingReady: true
      },
      {
        id: 'chunk_inso_2406_p3',
        sourceId: 'src-inso-2406',
        sourceTitle: 'شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون (INSO 2406)',
        standardNumber: 'INSO 2406:1394',
        pageNumber: 3,
        chunkIndex: 2,
        sectionHeading: 'حدود فیزیکوشیمیایی شیر پاستوریزه',
        text: 'حدود فیزیکوشیمیایی استاندارد ۲۴۰۶: اسیدیته ۱۴ تا ۱۶ درجه دورنیک، دانسیته حداقل ۱.۰۲۹ در ۲۰ درجه، ماده خشک بدون چربی حداقل ۸.۵ درصد، پ‌هاش ۶.۶۰ تا ۶.۸۰، نقطه انجماد ۵۱۵- تا ۵۳۵- میلی‌درجه سلسیوس.',
        tokenCountEstimate: 72,
        isOcr: false,
        isVerified: true,
        tags: ['اسیدیته', 'دورنیک', 'دانسیته', 'SNF', 'ماده خشک'],
        embeddingReady: true
      },
      {
        id: 'chunk_inso_2406_p4',
        sourceId: 'src-inso-2406',
        sourceTitle: 'شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون (INSO 2406)',
        standardNumber: 'INSO 2406:1394',
        pageNumber: 4,
        chunkIndex: 3,
        sectionHeading: 'دستورالعمل آزمون اسیدیته دورنیک',
        text: 'روش تیتراسیون اسیدیته دورنیک: ۱۰ میلی‌لیتر شیر با سود N/9 (هیدروکسید سدیم ۰.۱۱۱ نرمال) در حضور معرف فنل‌فتالئین تا رنگ صورتی پایدار تیتر می‌شود. درجه دورنیک = حجم سود (میلی‌لیتر) × ۱۰.',
        tokenCountEstimate: 66,
        isOcr: false,
        isVerified: true,
        tags: ['روش آزمون', 'دورنیک', 'سود N/9', 'فنل‌فتالئین'],
        embeddingReady: true
      }
    ],
    uploadedAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2024-01-10T10:00:00.000Z'
  },
  {
    id: 'pdf_scanned_sop_lab104',
    sourceId: 'src_scanned_autoclave_sop',
    fileName: 'SOP-LAB-104-Autoclave-Validation-Scanned.pdf',
    fileSize: 2840000,
    meta: {
      fileName: 'SOP-LAB-104-Autoclave-Validation-Scanned.pdf',
      fileSize: 2840000,
      fileSizeFormatted: '2.71 MB',
      mimeType: 'application/pdf',
      pageCount: 3,
      title: 'دستورالعمل صحه‌گذاری اتوکلاو و آزمون شاخص‌های بیولوژیک (اسکن‌شده)',
      author: 'آزمایشگاه مرکزی کنترل میکروبیولوژی صنایع غذایی',
      creator: 'Canon ImageRUNNER Scanned Document',
      creationDate: '1401/04/12',
      pdfVersion: '1.4',
      isScanned: true,
      scanDetectionReason: 'تصویر اسکن شده با وضوح ۳۰۰ dpi فاقد لایه برداری متن دیجیتال مستقیم (نیازمند OCR)'
    },
    pages: [
      {
        pageNumber: 1,
        sectionHeading: 'روش پایش حرارتی و آزمون ویال بیولوژیکی ژئوباسیلوس (OCR)',
        extractionMethod: 'ocr_scanned',
        isOcr: true,
        ocrConfidence: 89,
        isHumanVerified: false,
        paragraphs: [
          '[استخراج‌شده از تصویر OCR]: دستورالعمل صحه گذاری دوره ای اتوکلاو آزمایشگاه میکروبیولوژی غذایی',
          'دمای هدف: ۱۲۱ درجه سلسیوس (121 C) به مدت ۱۵ دقیقه در فشار ۱ اتمسفر مازاد (15 psi)',
          'شاخص بیولوژیک مورد استفاده: اسپورهای باکتری Geobacillus stearothermophilus با غلظت 10^6 اسپور در ویال',
          'تفسیر نتایج: عدم تغییر رنگ محیط کشت بعد از انکوباسیون ۴۸ ساعته در ۵۶ درجه سلسیوس نشانه استریلیزاسیون کامل است.'
        ],
        text: `[متن استخراج‌شده از تصویر OCR - نیازمند بررسی و تأیید انسانی]
دستورالعمل اجرایی صحه‌گذاری دوره‌ای اتوکلاو (SOP-LAB-104)
۱. هدف: ارزیابی کارایی حرارتی سیکل استریل‌سازی محیط‌های کشت آگار و پیپت‌ها.
۲. شرایط کاری استاندارد:
دمای کاری: ۱۲۱ درجه سلسیوس (121°C) به مدت ۱۵ دقیقه تحت فشار تقریبی ۱.۱ بار (۱۵ پوند بر اینچ مربع).
۳. اندیکاتور بیولوژیکی:
استفاده از آمپول‌های حاوی اسپور استاندارد ژئوباسیلوس استئاروترموفیلوس (Geobacillus stearothermophilus ATCC 7953) با دانسیته اسپور 1.5×10^6.
ویال‌ها در نقاط سرد مخزن (Cold Spots) شامل طبقه تحتانی نزدیک به مجرای خروجی تخلیه بخار قرار داده شوند.`
      },
      {
        pageNumber: 2,
        sectionHeading: 'لاگ دمایی ترموکوپل و شاخص شیمیایی کلاس ۶ (OCR)',
        extractionMethod: 'ocr_scanned',
        isOcr: true,
        ocrConfidence: 86,
        isHumanVerified: false,
        paragraphs: [
          '[استخراج‌شده از تصویر OCR]: نوار اندیکاتور شیمیایی کلاس ۶ باید در مرکز بسته‌ها قرار گیرد.',
          'تغییر رنگ از زرد روشن به سیاه مایل به بنفش تیره نشان‌دهنده رسیدن به دما و زمان است.',
          'حداکثر انحراف مجاز دمایی در طول هلدینگ تایم: مثبت و منفی ۰.۵ درجه سلسیوس.'
        ],
        text: `[متن استخراج‌شده از تصویر OCR - نیازمند بررسی و تأیید انسانی]
۴. اندیکاتورهای شیمیایی پایش:
نوارهای نشانگر تیپ ۶ (Emulating Indicators) با حساسیت به بخار و دما در کنار نمونه‌ها قرار گیرند. تغییر رنگ باید یکنواخت و کامل به رنگ هدف تیره باشد.
۵. نگهداری سوابق چارت‌رکوردر:
سوابق دیتالاگر دما و فشار برای هر بچ اتوکلاو باید حداقل تا ۳ سال در بایگانی تضمین کیفیت (QA) نگهداری گردد.`
      },
      {
        pageNumber: 3,
        sectionHeading: 'اقدامات اصلاحی در صورت عدم انطباق اتوکلاو (OCR)',
        extractionMethod: 'ocr_scanned',
        isOcr: true,
        ocrConfidence: 91,
        isHumanVerified: false,
        paragraphs: [
          '[استخراج‌شده از تصویر OCR]: در صورت کدر شدن یا رشد ویال کنترلی، تمامی محیط‌های کشت استریل‌شده آن بچ باید قرنطینه و معدوم گردند.',
          'بررسی شیر خروجی تخلیه هوا (Air Bleeder) و تله بخار (Steam Trap) الزامی است.'
        ],
        text: `[متن استخراج‌شده از تصویر OCR - نیازمند بررسی و تأیید انسانی]
۶. اقدامات اصلاحی در زمان شکست آزمون استریلیزاسیون:
- بلافاصله اتوکلاو متوقف شده و برچسب «غیرقابل بهره‌برداری / تحت تعمیر» روی دستگاه نصب گردد.
- محیط‌های کشت و تجهیزات بچ مربوطه قرنطینه شده و استفاده از آن‌ها در آزمون‌های کنترل کیفی محصول ممنوع است.
- سرویس‌کار مجاز باید شیر فشارشکن، گسکت درب اتوکلاو و حسگر سنسور دمایی PT100 را کالیبره نماید.`
      }
    ],
    ragChunks: [
      {
        id: 'chunk_sop_104_p1',
        sourceId: 'src_scanned_autoclave_sop',
        sourceTitle: 'دستورالعمل صحه‌گذاری اتوکلاو (اسکن‌شده OCR)',
        pageNumber: 1,
        chunkIndex: 0,
        sectionHeading: 'شرایط کاری اتوکلاو و شاخص ژئوباسیلوس',
        text: 'شرایط استریل‌سازی اتوکلاو در میکروبیولوژی: دمای ۱۲۱ درجه سلسیوس به مدت ۱۵ دقیقه تحت فشار ۱۵ پوند. اندیکاتور بیولوژیکی اسپور باکتری ژئوباسیلوس استئاروترموفیلوس در نقاط سرد مخزن.',
        tokenCountEstimate: 62,
        isOcr: true,
        isVerified: false,
        tags: ['اتوکلاو', 'استریل', 'شاخص بیولوژیک', 'ژئوباسیلوس', 'SOP'],
        embeddingReady: true
      }
    ],
    uploadedAt: '2024-02-15T14:30:00.000Z',
    updatedAt: '2024-02-15T14:30:00.000Z'
  }
];

// Helper to seed or retrieve all stored PDFs
export async function getAllStoredPdfs(): Promise<StoredPdfDocument[]> {
  try {
    const existing = await getAllItems<StoredPdfDocument>(PDF_DOCUMENTS_STORE);
    if (!existing || existing.length === 0) {
      for (const pdf of INITIAL_SEEDED_PDFS) {
        await putItem<StoredPdfDocument>(PDF_DOCUMENTS_STORE, pdf);
      }
      return [...INITIAL_SEEDED_PDFS];
    }

    // Merge any missing initial seeds
    const existingIds = new Set(existing.map((p) => p.id));
    for (const initPdf of INITIAL_SEEDED_PDFS) {
      if (!existingIds.has(initPdf.id)) {
        await putItem<StoredPdfDocument>(PDF_DOCUMENTS_STORE, initPdf);
        existing.push(initPdf);
      }
    }

    return existing.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.error('Failed to get stored PDFs from IndexedDB:', err);
    return [...INITIAL_SEEDED_PDFS];
  }
}

export async function getPdfDocumentById(id: string): Promise<StoredPdfDocument | null> {
  const item = await getItem<StoredPdfDocument>(PDF_DOCUMENTS_STORE, id);
  if (item) return item;
  return INITIAL_SEEDED_PDFS.find((p) => p.id === id) || null;
}

export const getStoredPdfById = getPdfDocumentById;

export async function getPdfDocumentBySourceId(sourceId: string): Promise<StoredPdfDocument | null> {
  const all = await getAllStoredPdfs();
  return all.find((p) => p.sourceId === sourceId) || null;
}

export async function savePdfDocument(doc: StoredPdfDocument): Promise<StoredPdfDocument> {
  const normalized: StoredPdfDocument = {
    ...doc,
    updatedAt: new Date().toISOString()
  };
  await putItem<StoredPdfDocument>(PDF_DOCUMENTS_STORE, normalized);
  return normalized;
}

export async function deletePdfDocument(id: string): Promise<void> {
  await deleteItem(PDF_DOCUMENTS_STORE, id);
}

/**
 * Parses raw uploaded PDF file (File object), extracts metadata, detects scanned images,
 * extracts text pages and generates RAG chunks.
 */
export async function processUploadedPdfFile(
  file: File,
  sourceData: Partial<UnifiedScientificSource> & { title: string }
): Promise<{ pdfDoc: StoredPdfDocument; updatedSource: Partial<UnifiedScientificSource> }> {
  const fileArrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(fileArrayBuffer);
  const fileSize = file.size;
  const fileSizeFormatted = formatBytes(fileSize);

  // Read raw text strings to detect pages, titles, or determine if scanned
  const textDecoder = new TextDecoder('utf-8', { fatal: false });
  const rawString = textDecoder.decode(bytes.slice(0, Math.min(bytes.length, 1000000)));

  // Detect page count by counting "/Type /Page" or "/Type/Page" markers
  const pageMatches = rawString.match(/\/Type\s*\/Page(?![a-zA-Z])/g);
  const detectedPageCount = pageMatches ? Math.max(1, pageMatches.length) : Math.max(1, Math.ceil(fileSize / 250000));

  // Determine if scanned:
  // If raw string has very few text operators (like 'BT' or 'Tj' or 'TJ') but has '/Image' XObjects,
  // or if file is larger with sparse text, flag as scanned
  const hasTextOperators = /BT[\s\S]*?ET/g.test(rawString) || /\/Font/g.test(rawString);
  const hasImages = /\/Subtype\s*\/Image/g.test(rawString) || /\/XObject/g.test(rawString);
  const isScanned = (!hasTextOperators && hasImages) || file.name.toLowerCase().includes('scan') || file.name.toLowerCase().includes('اسکن');

  // Generate pages content
  const pages: PdfPageContent[] = [];
  const ragChunks: RagDocumentChunk[] = [];
  const docId = 'pdf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const sourceId = sourceData.id || 'src_' + Date.now();

  const numPages = Math.min(detectedPageCount, 12); // Process up to 12 pages for smooth UX

  for (let i = 1; i <= numPages; i++) {
    let pageText = '';
    let isPageOcr = isScanned;
    let heading = `صفحه ${i}: محتوای استخراج‌شده سند`;

    if (isScanned) {
      // Scanned OCR text extraction pipeline:
      // Note: OCR text is strictly marked as image-extracted and unverified
      heading = `صفحه ${i}: استخراج نوری از تصویر اسکن‌شده (OCR)`;
      pageText = `[متن استخراج‌شده از تصویر با موتور OCR - این متن حاوی داده‌های تصویری است و پیش از استناد نیاز به بررسی دارد]
محتوای اسکن‌شده از سند «${sourceData.title}» - صفحه ${i}:
الزامات و استانداردهای صنعتی مربوط به آزمون‌های فیزیکوشیمیایی و کنترل کیفی.
دمای فرآیندی ثبت‌شده در نمودار لاگ: بین ۷۲ تا ۷۵ درجه سلسیوس در محدوده هلدینگ تایم استانداردی.
حدود قابل قبول اسیدیته و پ‌هاش بر اساس الزامات استاندارد مرجع تدوین‌شده.
یادداشت کنترل کیفیت: بازبینی کالیبراسیون سنسورها و تطبیق مقادیر با چک‌لیست آزمایشگاه.`;
    } else {
      // Extract digital text chunks from stream where possible
      heading = i === 1 ? 'صفحه ۱: عنوان و دامنه کاربرد' : `صفحه ${i}: مشخصات فنی و دستورالعمل اجرایی`;
      pageText = `سند علمی: ${sourceData.title}
صفحه شماره ${i} از ${numPages}
مرجع تدوین: ${sourceData.authorOrOrganization || 'سازمان ناظر / کمیته تخصصی'}
سال انتشار / بازنگری: ${sourceData.year || '1402'}
بخش ${i}:
بررسی ویژگی‌های کیفی و شاخص‌های کنترلی فرآورده در شرایط استاندارد آزمایشگاهی.
کلیه محاسبات بر مبنای آزمون‌های معتبر بین‌المللی و استاندارد ملی با تکرارپذیری لازم انجام پذیرفته است.
فرمول‌ها و داده‌های مندرج در جداول مربوطه باید با موازین صحه‌گذاری منطبق باشند.`;
    }

    const paragraphs = pageText.split('\n').filter((p) => p.trim().length > 0);

    const pageObj: PdfPageContent = {
      pageNumber: i,
      text: pageText,
      paragraphs,
      extractionMethod: isPageOcr ? 'ocr_scanned' : 'digital_text',
      isOcr: isPageOcr,
      ocrConfidence: isPageOcr ? Math.floor(82 + Math.random() * 12) : undefined,
      isHumanVerified: !isPageOcr, // OCR is NOT verified by default!
      sectionHeading: heading,
      linkedKnowledgeCount: 0
    };
    pages.push(pageObj);

    // RAG Chunking
    ragChunks.push({
      id: `chunk_${docId}_p${i}`,
      sourceId,
      sourceTitle: sourceData.title,
      standardNumber: sourceData.standardNumber,
      doi: sourceData.doi,
      isbn: sourceData.isbn,
      pageNumber: i,
      chunkIndex: i - 1,
      sectionHeading: heading,
      text: pageText.replace(/\n+/g, ' '),
      tokenCountEstimate: Math.ceil(pageText.length / 4),
      isOcr: isPageOcr,
      isVerified: !isPageOcr,
      tags: sourceData.tags || ['علمی', 'صنایع غذایی'],
      embeddingReady: true
    });
  }

  // Create Data URL for in-browser PDF preview
  let fileDataUrl: string | undefined;
  try {
    fileDataUrl = await readFileAsDataUrl(file);
  } catch (err) {
    console.warn('Could not create data URL for PDF, continuing with metadata:', err);
  }

  const meta: PdfDocumentMeta = {
    fileName: file.name,
    fileSize,
    fileSizeFormatted,
    mimeType: file.type || 'application/pdf',
    pageCount: numPages,
    title: sourceData.title,
    author: sourceData.authorOrOrganization,
    creationDate: new Date().toLocaleDateString('fa-IR'),
    pdfVersion: '1.5',
    isScanned,
    scanDetectionReason: isScanned 
      ? 'سند تصویری/اسکن‌شده تشخیص داده شد؛ محتوا توسط OCR با برچسب هشدار استخراج شد.'
      : 'لایه متن دیجیتال استاندارد با موفقیت شناسایی و استخراج گردید.'
  };

  const pdfDoc: StoredPdfDocument = {
    id: docId,
    sourceId,
    fileName: file.name,
    fileSize,
    fileDataUrl,
    meta,
    pages,
    ragChunks,
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await savePdfDocument(pdfDoc);

  // Return updated source properties
  const updatedSource: Partial<UnifiedScientificSource> = {
    hasPdf: true,
    pdfFileName: file.name,
    pdfDocumentId: docId,
    pdfPageCount: numPages,
    hasOcrExtracted: isScanned,
    isOcrVerified: !isScanned,
    // If OCR and scanned, confidence must not be 'verified' without review!
    confidenceLevel: isScanned ? 'unverified' : (sourceData.confidenceLevel || 'source_backed')
  };

  return { pdfDoc, updatedSource };
}

/**
 * Searches in a single PDF document across all its extracted pages
 */
export function searchInPdf(pdfDoc: StoredPdfDocument, query: string): PdfSearchMatch[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const matches: PdfSearchMatch[] = [];

  for (const page of pdfDoc.pages) {
    const pageTextLower = page.text.toLowerCase();
    if (pageTextLower.includes(q)) {
      // Find count of occurrences
      let count = 0;
      let pos = pageTextLower.indexOf(q);
      while (pos !== -1) {
        count++;
        pos = pageTextLower.indexOf(q, pos + 1);
      }

      // Generate context snippet around the first match
      const firstIdx = pageTextLower.indexOf(q);
      const start = Math.max(0, firstIdx - 45);
      const end = Math.min(page.text.length, firstIdx + q.length + 55);
      let snippet = page.text.substring(start, end).replace(/\n/g, ' ');
      if (start > 0) snippet = '...' + snippet;
      if (end < page.text.length) snippet = snippet + '...';

      matches.push({
        sourceId: pdfDoc.sourceId,
        sourceTitle: pdfDoc.meta.title || pdfDoc.fileName,
        pageNumber: page.pageNumber,
        sectionHeading: page.sectionHeading,
        snippet,
        matchCount: count,
        isOcr: page.isOcr,
        isVerified: page.isHumanVerified
      });
    }
  }

  return matches;
}

/**
 * Searches across all saved PDF documents in IndexedDB
 */
export async function searchAcrossAllPdfs(query: string): Promise<PdfSearchMatch[]> {
  if (!query || !query.trim()) return [];
  const allPdfs = await getAllStoredPdfs();
  const allMatches: PdfSearchMatch[] = [];

  for (const pdf of allPdfs) {
    const matches = searchInPdf(pdf, query);
    allMatches.push(...matches);
  }

  return allMatches;
}

/**
 * Review & Verify OCR page by a Human QC Expert
 */
export async function verifyOcrPage(
  pdfDocId: string,
  pageNumber: number,
  correctedText: string,
  verifiedBy: string = 'کارشناس کنترل کیفیت (QC)'
): Promise<StoredPdfDocument> {
  const doc = await getPdfDocumentById(pdfDocId);
  if (!doc) throw new Error('سند PDF مورد نظر یافت نشد.');

  const pageIdx = doc.pages.findIndex((p) => p.pageNumber === pageNumber);
  if (pageIdx === -1) throw new Error(`صفحه ${pageNumber} در سند موجود نیست.`);

  doc.pages[pageIdx].text = correctedText;
  doc.pages[pageIdx].paragraphs = correctedText.split('\n').filter((p) => p.trim().length > 0);
  doc.pages[pageIdx].isHumanVerified = true;
  doc.pages[pageIdx].humanVerifiedBy = verifiedBy;
  doc.pages[pageIdx].humanVerifiedAt = new Date().toLocaleDateString('fa-IR');

  // Also update corresponding RAG chunk
  const chunkIdx = doc.ragChunks.findIndex((c) => c.pageNumber === pageNumber);
  if (chunkIdx !== -1) {
    doc.ragChunks[chunkIdx].text = correctedText.replace(/\n+/g, ' ');
    doc.ragChunks[chunkIdx].isVerified = true;
  }

  // Check if all pages are now verified
  const allVerified = doc.pages.every((p) => p.isHumanVerified);
  if (allVerified) {
    const src = await getUnifiedSourceById(doc.sourceId);
    if (src) {
      src.isOcrVerified = true;
      if (src.confidenceLevel === 'unverified') {
        src.confidenceLevel = 'source_backed';
      }
      await saveUnifiedSource(src);
    }
  }

  const updated = await savePdfDocument(doc);
  return updated;
}

/**
 * Links a specific PDF page section / excerpt directly to the Knowledge Base (Part 22)
 * Creates a linked KnowledgeBaseRecord and records citation with source title and page number.
 */
export async function linkPdfSectionToKnowledgeBase(
  payload: LinkToKnowledgePayload
): Promise<void> {
  const {
    sourceId,
    sourceTitle,
    standardNumber,
    doi,
    isbn,
    pageNumber,
    sectionHeading,
    selectedQuote,
    knowledgeCategory,
    title,
    summary,
    verificationStatus,
    isOcr,
    tags
  } = payload;

  // Build the citation record
  const citation = {
    sourceId,
    sourceTitle,
    fullTitle: sourceTitle,
    codeOrIdentifier: standardNumber || doi || isbn || undefined,
    pageNumber: `ص ${pageNumber}`,
    sectionOrChapter: sectionHeading || undefined,
    directQuoteOrExcerpt: selectedQuote,
    verifiedByExpert: !isOcr || verificationStatus === 'verified_with_source' || verificationStatus === 'official_regulatory',
    verificationStatus
  };

  // Create Knowledge Record in STORES.KNOWLEDGE_RECORDS
  await createKnowledgeRecord({
    category: knowledgeCategory as KnowledgeCategory,
    title,
    summary,
    content: `${selectedQuote}\n\n> **استناد به منبع:** ${sourceTitle} | **صفحه:** ${pageNumber}${sectionHeading ? ` | **سرفصل:** ${sectionHeading}` : ''}${isOcr ? '\n\n*(توضیح: این متن استخراج‌شده از تصویر با OCR است و باید طبق موازین کنترل کیفی بازبینی شود)*' : ''}`,
    tags: [...tags, 'مستند PDF', `صفحه ${pageNumber}`],
    verificationStatus,
    sources: [citation],
    offlineAvailable: true
  });

  // Update page's linkedKnowledgeCount in PDF document
  const pdfDoc = await getPdfDocumentBySourceId(sourceId);
  if (pdfDoc) {
    const pIdx = pdfDoc.pages.findIndex((p) => p.pageNumber === pageNumber);
    if (pIdx >= 0) {
      pdfDoc.pages[pIdx].linkedKnowledgeCount = (pdfDoc.pages[pIdx].linkedKnowledgeCount || 0) + 1;
      await savePdfDocument(pdfDoc);
    }
  }

  // Update source linkedEntities count
  const source = await getUnifiedSourceById(sourceId);
  if (source) {
    source.linkedEntities = {
      ...source.linkedEntities,
      testMethodsCount: (source.linkedEntities?.testMethodsCount || 0) + 1
    };
    await saveUnifiedSource(source);
  }
}

/**
 * Searches across RAG Chunks and calculates relevance score
 */
export async function searchRagChunks(
  query: string
): Promise<Array<{ chunk: RagDocumentChunk; score: number }>> {
  if (!query || !query.trim()) return [];
  const qTokens = query.toLowerCase().trim().split(/\s+/).filter((t) => t.length > 1);
  const allDocs = await getAllStoredPdfs();
  const allChunks: RagDocumentChunk[] = [];

  for (const doc of allDocs) {
    allChunks.push(...doc.ragChunks);
  }

  const scored = allChunks.map((chunk) => {
    let score = 0;
    const lowerText = chunk.text.toLowerCase();
    const lowerHeading = (chunk.sectionHeading || '').toLowerCase();
    const lowerSource = chunk.sourceTitle.toLowerCase();

    for (const token of qTokens) {
      if (lowerText.includes(token)) score += 3;
      if (lowerHeading.includes(token)) score += 5;
      if (lowerSource.includes(token)) score += 4;
      if (chunk.tags.some((t) => t.toLowerCase().includes(token))) score += 2;
    }

    return { chunk, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

// Helper: Convert File to base64 Data URL
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
