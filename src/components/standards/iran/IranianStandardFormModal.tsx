import React, { useState } from 'react';
import {
  IranianStandard,
  IranianProductGroup,
  IranianTestType,
  IranianStandardStatus,
  IRANIAN_STANDARD_STATUS_CONFIG,
  IRANIAN_PRODUCT_GROUPS_CONFIG,
  IRANIAN_TEST_TYPE_CONFIG
} from '../../../types/iranianStandard';
import {
  saveIranianStandard,
  createIranianStandard,
  validateIranianStandardData
} from '../../../lib/storage/iranianStandardsStorage';
import {
  X,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  FileText,
  FlaskConical,
  Package,
  Wrench,
  Calculator,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface IranianStandardFormModalProps {
  standardToEdit: IranianStandard | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedStandard: IranianStandard) => void;
}

export const IranianStandardFormModal: React.FC<IranianStandardFormModalProps> = ({
  standardToEdit,
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(standardToEdit);

  // Form State
  const [standardNumber, setStandardNumber] = useState(standardToEdit?.standardNumber || 'INSO ');
  const [titleFa, setTitleFa] = useState(standardToEdit?.titleFa || '');
  const [titleEn, setTitleEn] = useState(standardToEdit?.titleEn || '');
  const [icsCode, setIcsCode] = useState(standardToEdit?.icsCode || '');
  const [status, setStatus] = useState<IranianStandardStatus>(standardToEdit?.status || 'valid');
  const [isMandatory, setIsMandatory] = useState(standardToEdit?.isMandatory ?? true);
  const [productGroup, setProductGroup] = useState<IranianProductGroup>(
    standardToEdit?.productGroup || 'dairy'
  );
  const [primaryTestTypes, setPrimaryTestTypes] = useState<IranianTestType[]>(
    standardToEdit?.primaryTestTypes || ['physicochemical']
  );
  const [scopeFa, setScopeFa] = useState(standardToEdit?.scopeFa || '');
  const [version, setVersion] = useState(standardToEdit?.version || '1.0');
  const [revisionNumber, setRevisionNumber] = useState<number>(standardToEdit?.revisionNumber || 1);
  const [revisionText, setRevisionText] = useState(standardToEdit?.revisionText || 'چاپ اول');
  const [ratificationYear, setRatificationYear] = useState(
    standardToEdit?.ratificationYear || '۱۴۰۲'
  );

  // Replacement info
  const [supersededByNumber, setSupersededByNumber] = useState(
    standardToEdit?.supersededBy?.standardNumber || ''
  );
  const [supersededByReason, setSupersededByReason] = useState(
    standardToEdit?.supersededBy?.reasonFa || ''
  );

  // Linked items
  const [linkedTests, setLinkedTests] = useState(standardToEdit?.linkedTests || []);
  const [linkedProducts, setLinkedProducts] = useState(standardToEdit?.linkedProducts || []);
  const [linkedEquipments, setLinkedEquipments] = useState(standardToEdit?.linkedEquipments || []);
  const [linkedCalculations, setLinkedCalculations] = useState(standardToEdit?.linkedCalculations || []);

  // New item temp inputs
  const [newTestName, setNewTestName] = useState('');
  const [newTestType, setNewTestType] = useState<IranianTestType>('physicochemical');
  const [newTestClause, setNewTestClause] = useState('');
  const [newTestLimit, setNewTestLimit] = useState('');
  const [newTestUnit, setNewTestUnit] = useState('%');

  const [newProductName, setNewProductName] = useState('');
  const [newEquipmentName, setNewEquipmentName] = useState('');

  // Source
  const [sourceCitation, setSourceCitation] = useState(
    standardToEdit?.originalSource?.citationCode || ''
  );
  const [sourcePortalUrl, setSourcePortalUrl] = useState(
    standardToEdit?.originalSource?.portalUrl || 'http://standard.isiri.gov.ir/'
  );

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  // Add test clause
  const handleAddTest = () => {
    if (!newTestName.trim() || !newTestLimit.trim()) return;
    setLinkedTests([
      ...linkedTests,
      {
        id: `test-${Date.now()}`,
        testNameFa: newTestName.trim(),
        testType: newTestType,
        standardClause: newTestClause.trim() || undefined,
        acceptableLimit: newTestLimit.trim(),
        unit: newTestUnit.trim()
      }
    ]);
    setNewTestName('');
    setNewTestClause('');
    setNewTestLimit('');
  };

  const handleRemoveTest = (id: string) => {
    setLinkedTests(linkedTests.filter((t) => t.id !== id));
  };

  // Add product
  const handleAddProduct = () => {
    if (!newProductName.trim()) return;
    setLinkedProducts([
      ...linkedProducts,
      {
        id: `prod-${Date.now()}`,
        nameFa: newProductName.trim(),
        category: productGroup
      }
    ]);
    setNewProductName('');
  };

  const handleRemoveProduct = (id: string) => {
    setLinkedProducts(linkedProducts.filter((p) => p.id !== id));
  };

  // Add equipment
  const handleAddEquipment = () => {
    if (!newEquipmentName.trim()) return;
    setLinkedEquipments([
      ...linkedEquipments,
      {
        id: `eq-${Date.now()}`,
        equipmentNameFa: newEquipmentName.trim(),
        equipmentTypeFa: 'تجهیزات آزمایشگاهی استاندارد',
        isMandatory: true
      }
    ]);
    setNewEquipmentName('');
  };

  const handleRemoveEquipment = (id: string) => {
    setLinkedEquipments(linkedEquipments.filter((e) => e.id !== id));
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setWarnings([]);

    const payloadPartial = {
      standardNumber: standardNumber.trim(),
      titleFa: titleFa.trim(),
      titleEn: titleEn.trim(),
      icsCode: icsCode.trim() || undefined,
      status,
      version: version.trim(),
      revisionNumber: Number(revisionNumber),
      revisionText: revisionText.trim(),
      ratificationYear: ratificationYear.trim(),
      isMandatory,
      productGroup,
      primaryTestTypes,
      scopeFa: scopeFa.trim() || 'تعیین ویژگی‌ها و روش‌های آزمون مصوب سازمان ملی استاندارد ایران.',
      supersededBy:
        status === 'superseded' || status === 'obsolete'
          ? supersededByNumber
            ? {
                standardNumber: supersededByNumber.trim(),
                reasonFa: supersededByReason.trim()
              }
            : undefined
          : undefined,
      linkedProducts,
      linkedTests,
      linkedEquipments,
      linkedCalculations,
      originalSource: {
        sourceId: `src-${Date.now()}`,
        organization: 'سازمان ملی استاندارد ایران (INSO / ISIRI)',
        citationCode: sourceCitation.trim() || `${standardNumber.trim()}:${ratificationYear.trim()}`,
        portalUrl: sourcePortalUrl.trim(),
        confidenceLevel: 'verified' as const,
        ratificationDetails: 'مصوب کمیسیون فنی تدوین استانداردهای صنایع غذایی',
        hasOfficialPdfReference: true
      },
      copyrightNotice:
        'حقوق مادی و معنوی استاندارد متعلق به سازمان ملی استاندارد ایران است.',
      tags: [productGroup, standardNumber.trim()],
      revisionHistory: standardToEdit?.revisionHistory || [
        {
          revisionNumber: Number(revisionNumber),
          revisionText: revisionText.trim(),
          year: ratificationYear.trim(),
          status,
          changeSummaryFa: 'ثبت و تدوین در سامانه استانداردهای ایران.'
        }
      ]
    };

    const validation = validateIranianStandardData(payloadPartial);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    if (validation.warnings.length > 0) {
      setWarnings(validation.warnings);
    }

    try {
      setSubmitting(true);
      let result: IranianStandard;
      if (isEditing && standardToEdit) {
        result = await saveIranianStandard({
          ...standardToEdit,
          ...payloadPartial
        });
      } else {
        result = await createIranianStandard(payloadPartial);
      }
      onSuccess(result);
      onClose();
    } catch (err: any) {
      setErrors([err.message || 'خطا در ذخیره‌سازی استاندارد']);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {isEditing ? `ویرایش استاندارد ملی (${standardToEdit.standardNumber})` : 'ثبت استاندارد ملی جدید (INSO / ISIRI)'}
            </h2>
            <p className="text-xs text-stone-500">
              رعایت کامل ضوابط عدم تخمین شماره، صحت وضعیت جاری/منسوخ و رعایت کپی‌رایت
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Errors / Warnings */}
          {errors.length > 0 && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 space-y-1">
              <span className="font-bold">خطاهای اعتبارسنجی:</span>
              <ul className="list-disc pr-4 space-y-0.5">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 space-y-1">
              <span className="font-bold">هشدارهای راهنما:</span>
              <ul className="list-disc pr-4 space-y-0.5">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                شماره استاندارد ملی (INSO/ISIRI):
              </label>
              <input
                type="text"
                value={standardNumber}
                onChange={(e) => setStandardNumber(e.target.value)}
                placeholder="مثال: INSO 2406"
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                وضعیت حقوقی استاندارد:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="valid">✅ معتبر (جاری و نافذ)</option>
                <option value="superseded">⚠️ جایگزین‌شده (با استاندارد جدیدتر)</option>
                <option value="obsolete">❌ منسوخ (ابطال‌شده)</option>
                <option value="needs_review">❓ نیازمند بررسی (پیش‌نویس / استعلام)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                نوع الزام قانونی:
              </label>
              <select
                value={isMandatory ? 'mandatory' : 'voluntary'}
                onChange={(e) => setIsMandatory(e.target.value === 'mandatory')}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="mandatory">استاندارد ملی اجباری</option>
                <option value="voluntary">استاندارد تشویقی</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                عنوان رسمی فارسی مصوب:
              </label>
              <input
                type="text"
                value={titleFa}
                onChange={(e) => setTitleFa(e.target.value)}
                placeholder="مثال: شیر و فرآورده‌های آن - شیر پاستوریزه - ویژگی‌ها و روش‌های آزمون"
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                کد رده‌بندی بین‌المللی (ICS):
              </label>
              <input
                type="text"
                value={icsCode}
                onChange={(e) => setIcsCode(e.target.value)}
                placeholder="مثال: 67.100.10"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                dir="ltr"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                عنوان انگلیسی مصوب (Title in English):
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Milk and milk products - Pasteurized milk - Specifications and test methods"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                dir="ltr"
              />
            </div>
          </div>

          {/* Replaced Standard Section (If superseded or obsolete) */}
          {(status === 'superseded' || status === 'obsolete') && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                مشخصات استاندارد جایگزین:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1">
                    شماره استاندارد جایگزین:
                  </label>
                  <input
                    type="text"
                    value={supersededByNumber}
                    onChange={(e) => setSupersededByNumber(e.target.value)}
                    placeholder="مثال: INSO 2406"
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-mono text-xs"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 mb-1">
                    دلیل یا تاریخچه جایگزینی:
                  </label>
                  <input
                    type="text"
                    value={supersededByReason}
                    onChange={(e) => setSupersededByReason(e.target.value)}
                    placeholder="ابطال با تصویب نسخه جدید..."
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Revision & Versioning */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
            <span className="font-bold text-stone-800 dark:text-stone-200">
              نگهداری Version و Revision (جهت تضمین سندیت نتایج پیشین):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">
                  نوبت تجدیدنظر (فارسی):
                </label>
                <input
                  type="text"
                  value={revisionText}
                  onChange={(e) => setRevisionText(e.target.value)}
                  placeholder="مثال: تجدیدنظر چهارم"
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">
                  شماره بازنگری (عدد):
                </label>
                <input
                  type="number"
                  value={revisionNumber}
                  onChange={(e) => setRevisionNumber(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">
                  سال تصویب نهایی:
                </label>
                <input
                  type="text"
                  value={ratificationYear}
                  onChange={(e) => setRatificationYear(e.target.value)}
                  placeholder="۱۳۹۴"
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">
                  کد نسخه رقمی (Version):
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="4.0"
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Classification & Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                گروه محصول غذایی:
              </label>
              <select
                value={productGroup}
                onChange={(e) => setProductGroup(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
              >
                {Object.entries(IRANIAN_PRODUCT_GROUPS_CONFIG).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.titleFa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                دامنه آزمون اصلی:
              </label>
              <select
                value={primaryTestTypes[0] || 'physicochemical'}
                onChange={(e) => setPrimaryTestTypes([e.target.value as any])}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
              >
                {Object.entries(IRANIAN_TEST_TYPE_CONFIG).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.labelFa}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                دامنه کاربرد استاندارد (Scope):
              </label>
              <textarea
                value={scopeFa}
                onChange={(e) => setScopeFa(e.target.value)}
                rows={2}
                placeholder="شرح هدف و دامنه کاربرد مصوب سازمان ملی استاندارد..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Linked Tests Management */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                ارتباط با آزمایش‌ها و حدود مجاز ({linkedTests.length})
              </span>
            </div>

            {/* List of existing tests */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {linkedTests.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
                >
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {t.testNameFa}
                    </span>
                    <span className="text-stone-500 mr-2">
                      (حد: {t.acceptableLimit} {t.unit})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTest(t.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new test row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-200 dark:border-stone-700">
              <input
                type="text"
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
                placeholder="عنوان آزمون (مثلا: چربی ژربر)"
                className="px-2.5 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
              />
              <input
                type="text"
                value={newTestClause}
                onChange={(e) => setNewTestClause(e.target.value)}
                placeholder="بند استاندارد (بند ۶.۱)"
                className="px-2.5 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
              />
              <input
                type="text"
                value={newTestLimit}
                onChange={(e) => setNewTestLimit(e.target.value)}
                placeholder="حد مجاز (مثلا: حداقل ۳.۰)"
                className="px-2.5 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
              />
              <button
                type="button"
                onClick={handleAddTest}
                className="px-3 py-1.5 rounded-md bg-stone-800 dark:bg-stone-700 text-white font-bold text-xs flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن آزمون</span>
              </button>
            </div>
          </div>

          {/* Linked Products & Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Products */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
              <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-600" />
                محصولات مرتبط ({linkedProducts.length})
              </span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="نام محصول..."
                  className="flex-1 px-2.5 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="px-2.5 py-1.5 rounded-md bg-stone-800 text-white text-xs"
                >
                  افزودن
                </button>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {linkedProducts.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs"
                  >
                    {p.nameFa}
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(p.id)}
                      className="text-stone-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
              <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-600" />
                تجهیزات الزامی ({linkedEquipments.length})
              </span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newEquipmentName}
                  onChange={(e) => setNewEquipmentName(e.target.value)}
                  placeholder="نام دستگاه/تجهیز..."
                  className="flex-1 px-2.5 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddEquipment}
                  className="px-2.5 py-1.5 rounded-md bg-stone-800 text-white text-xs"
                >
                  افزودن
                </button>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {linkedEquipments.map((eq) => (
                  <span
                    key={eq.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs"
                  >
                    {eq.equipmentNameFa}
                    <button
                      type="button"
                      onClick={() => handleRemoveEquipment(eq.id)}
                      className="text-stone-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Original Source Reference */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              منبع رسمی سازمان ملی استاندارد (INSO Source)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={sourceCitation}
                onChange={(e) => setSourceCitation(e.target.value)}
                placeholder="کد استناد (مثال: INSO 2406:1394)"
                className="px-2.5 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs"
                dir="ltr"
              />
              <input
                type="text"
                value={sourcePortalUrl}
                onChange={(e) => setSourcePortalUrl(e.target.value)}
                placeholder="آدرس پرتال رسمی (http://standard.isiri.gov.ir/...)"
                className="px-2.5 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs"
                dir="ltr"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{submitting ? 'در حال ثبت...' : 'ذخیره استاندارد ملی'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
