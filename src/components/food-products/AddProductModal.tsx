import React, { useState } from 'react';
import { 
  FoodCatalogProduct, 
  ProductCategoryKey, 
  ProductTestSpecification, 
  CatalogRelatedStandard, 
  RelationalSource,
  TestCategory
} from '../../types/foodProductsCatalog';
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_KEYS } from '../../data/products/categoryMeta';
import { CATALOG_SOURCES_DATABASE } from '../../data/products/catalogSources';
import { X, Plus, AlertCircle, ShieldAlert, Check } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: FoodCatalogProduct) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave }) => {
  const [nameFa, setNameFa] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [commercialNameFa, setCommercialNameFa] = useState('');
  const [category, setCategory] = useState<ProductCategoryKey>('dairy');
  const [descriptionFa, setDescriptionFa] = useState('');
  const [targetMatrix, setTargetMatrix] = useState('');

  // Standard details
  const [stdNumber, setStdNumber] = useState('');
  const [stdOrg, setStdOrg] = useState('INSO');
  const [stdTitleFa, setStdTitleFa] = useState('');
  const [selectedSourceKey, setSelectedSourceKey] = useState<string>('src-inso-2406');

  // Test details
  const [testNameFa, setTestNameFa] = useState('');
  const [testCat, setTestCat] = useState<TestCategory>('chemical');
  const [testAnalyte, setTestAnalyte] = useState('');
  const [testMin, setTestMin] = useState<string>('');
  const [testMax, setTestMax] = useState<string>('');
  const [testUnit, setTestUnit] = useState('%');
  const [testMethod, setTestMethod] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nameFa.trim()) {
      setError('نام فارسی محصول الزامی است.');
      return;
    }
    if (!stdNumber.trim()) {
      setError('شماره استاندارد مرتبط با فرآورده الزامی است.');
      return;
    }
    if (!selectedSourceKey) {
      setError('قانون سیستمی: هیچ مشخصه استانداردی را بدون منبع (Source) معتبر نمی‌توان ثبت کرد.');
      return;
    }
    if (!testNameFa.trim() || !testMethod.trim()) {
      setError('ثبت حداقل یک آزمون کنترل کیفیت همراه با روش آزمون الزامی است.');
      return;
    }

    const sourceObj: RelationalSource = CATALOG_SOURCES_DATABASE[selectedSourceKey] || {
      id: `src-custom-${Date.now()}`,
      titleFa: `مدرک استاندارد ${stdNumber}`,
      titleEn: `Standard Document ${stdNumber}`,
      issuingBodyOrAuthors: stdOrg,
      publicationYear: '1402',
      documentType: 'national_standard',
      citationCode: `${stdOrg} ${stdNumber}`,
      officialReferenceOrUrl: 'https://isiri.gov.ir',
      verificationStatus: 'verified_official'
    };

    const stdId = `std-custom-${Date.now()}`;
    const standardObj: CatalogRelatedStandard = {
      id: stdId,
      standardNumber: stdNumber,
      organization: stdOrg as 'INSO' | 'Codex' | 'ISO' | 'FDA',
      titleFa: stdTitleFa || `استاندارد ویژگی‌های ${nameFa}`,
      titleEn: `Specifications for ${nameEn || nameFa}`,
      publicationYear: '1402',
      status: 'active_mandatory',
      scopeFa: 'تعیین آزمون‌های فیزیکی، شیمیایی و میکروبی',
      sourceId: sourceObj.id,
      coverageType: 'general_specifications'
    };

    const testId = `test-custom-${Date.now()}`;
    const testObj: ProductTestSpecification = {
      id: testId,
      code: `QC-CUS-${Math.floor(100 + Math.random() * 900)}`,
      category: testCat,
      nameFa: testNameFa,
      nameEn: testAnalyte || testNameFa,
      parameterAnalyte: testAnalyte || testNameFa,
      unit: testUnit,
      minLimit: testMin ? parseFloat(testMin) : undefined,
      maxLimit: testMax ? parseFloat(testMax) : undefined,
      methodFa: testMethod,
      frequency: 'each_batch',
      standardId: stdId,
      sourceId: sourceObj.id,
      criticality: 'major_quality'
    };

    const newProd: FoodCatalogProduct = {
      id: `prod-custom-${Date.now()}`,
      code: `PROD-CUS-${Math.floor(1000 + Math.random() * 9000)}`,
      nameFa,
      nameEn: nameEn || nameFa,
      commercialNameFa,
      category,
      descriptionFa: descriptionFa || `فرآورده استاندارد ${nameFa} مطابق با استاندارد ${stdNumber}`,
      commercialFormsFa: ['بسته‌بندی بهداشتی استاندارد'],
      physicalStateFa: 'solid',
      targetMatrix: targetMatrix || 'ماتریکس مواد غذایی استاندارد',
      keyCharacteristicsFa: {
        appearanceColorFa: 'طبیعی و منطبق با استاندارد فرآورده'
      },
      rawMaterials: [
        {
          id: `rm-base-${Date.now()}`,
          nameFa: `ماده اولیه پایه ${nameFa}`,
          nameEn: 'Base Raw Material',
          role: 'ماده اولیه اصلی',
          typicalPercentageRange: '۱۰۰ ٪',
          qualityCriteriaFa: 'مطابق با مشخصات استاندارد وارده',
          isAllergenic: false
        }
      ],
      processSteps: [
        {
          stepNumber: 1,
          nameFa: 'فرآوری و کنترل کیفی اولیه',
          nameEn: 'Intake and Initial Processing',
          criticalParameters: 'کنترل دما و خلوص',
          equipmentFa: 'خط تولید استاندارد',
          ccpOrCqP: 'CP',
          descriptionFa: 'عملیات اولیه آماده‌سازی محصول بر اساس استاندارد'
        }
      ],
      requiredEquipment: [
        {
          id: `eq-custom-${Date.now()}`,
          nameFa: 'دستگاه‌های آزمایشگاه QC',
          nameEn: 'QC Laboratory Instruments',
          roleInProcessOrLab: 'laboratory_qc',
          keySpecificationFa: 'دستگاه‌های منطبق با روش آزمون استاندارد',
          maintenanceAndCalibration: 'کالیبراسیون دوره‌ای سالانه'
        }
      ],
      storageConditions: {
        temperatureRangeFa: 'دمای استاندارد انبارش فرآورده',
        relativeHumidityRangeFa: 'حداکثر ۷۰ درصد',
        lightingProtectionFa: 'عدم تابش مستقیم نور خورشید',
        stackingLimitsFa: 'حداکثر ۵ ردیف پالت',
        specialPrecautionsFa: 'محافظت در برابر آلودگی‌های محیطی و رطوبت بالا'
      },
      packagingSpecs: {
        primaryPackagingMaterialFa: 'بسته‌بندی اولیه بهداشتی گرید غذایی',
        secondaryPackagingMaterialFa: 'کارتن محافظ استاندارد',
        barrierPropertiesFa: 'محافظ در برابر رطوبت و گردوغبار',
        hermeticSealTestFa: 'تست غوطه‌وری در محفظه خلاء بدون حباب‌زایی'
      },
      shelfLifeSpecs: {
        shelfLifeDurationFa: '۱۲ ماه از تاریخ تولید',
        primaryDeteriorationMechanism: 'اکسیداسیون یا تغییرات رطوبتی',
        criticalLimitAtEndOfShelfLife: 'انطباق کامل با حدود استاندارد'
      },
      standards: [standardObj],
      tests: [testObj],
      sources: [sourceObj],
      tags: [category, 'محصول جدید', stdNumber]
    };

    onSave(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">ثبت محصول و اتصال زنجیره استاندارد به بانک جامع</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] leading-relaxed">
            <strong>قاعده سخت‌گیرانه اصالت داده:</strong> بر اساس دستورالعمل سامانه، ثبت هر مشخصه و استاندارد الزاماً
            باید متصل به یک مدرک رسمی منبع (Source) باشد تا از ورود داده‌های بدون پشتوانه جلوگیری شود.
          </div>

          {/* Section 1: Product Basics */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 border-b pb-1">۱. اطلاعات شناسنامه‌ای محصول</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">نام فارسی فرآورده *</label>
                <input
                  type="text"
                  value={nameFa}
                  onChange={(e) => setNameFa(e.target.value)}
                  placeholder="مثلاً: ماست قالبی هموژنیزه"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">نام انگلیسی (En)</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Set Yogurt"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">دسته‌بندی فرآورده *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategoryKey)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden font-semibold"
                >
                  {PRODUCT_CATEGORY_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {PRODUCT_CATEGORIES[k].nameFa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">نام تجاری متعارف</label>
                <input
                  type="text"
                  value={commercialNameFa}
                  onChange={(e) => setCommercialNameFa(e.target.value)}
                  placeholder="مثلاً: ماست کم‌چرب دبه‌ای"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Standard & Verified Source */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 border-b pb-1">۲. استاندارد مرتبط و منبع رسمی (Standards & Sources)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">شماره استاندارد *</label>
                <input
                  type="text"
                  value={stdNumber}
                  onChange={(e) => setStdNumber(e.target.value)}
                  placeholder="مثلاً: INSO 696"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">سازمان مرجع استاندارد</label>
                <select
                  value={stdOrg}
                  onChange={(e) => setStdOrg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden font-bold"
                >
                  <option value="INSO">سازمان ملی استاندارد ایران (INSO)</option>
                  <option value="Codex">کمیسیون بین‌المللی کدکس (Codex)</option>
                  <option value="ISO">سازمان بین‌المللی استانداردسازی (ISO)</option>
                  <option value="FDA">سازمان غذا و دارو (FDA)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1 font-semibold">انتخاب مدرک منبع معتبر (Source) *</label>
                <select
                  value={selectedSourceKey}
                  onChange={(e) => setSelectedSourceKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden font-medium"
                  required
                >
                  {Object.entries(CATALOG_SOURCES_DATABASE).map(([key, src]) => (
                    <option key={key} value={key}>
                      [{src.citationCode}] {src.titleFa} - {src.issuingBodyOrAuthors} ({src.publicationYear})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: QC Test Definition */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 border-b pb-1">۳. تعریف حداقل یک آزمون کنترل کیفیت با حد پذیرش</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">نام آزمون *</label>
                <input
                  type="text"
                  value={testNameFa}
                  onChange={(e) => setTestNameFa(e.target.value)}
                  placeholder="مثلاً: اسیدیته بر حسب اسید لاکتیک"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">رده آزمون</label>
                <select
                  value={testCat}
                  onChange={(e) => setTestCat(e.target.value as TestCategory)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="physical">فیزیکی</option>
                  <option value="chemical">شیمیایی</option>
                  <option value="microbial">میکروبی</option>
                  <option value="sensory">حسی</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">شاخص / آنالیت</label>
                <input
                  type="text"
                  value={testAnalyte}
                  onChange={(e) => setTestAnalyte(e.target.value)}
                  placeholder="e.g. Acidity"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">حداقل مجاز (Min)</label>
                <input
                  type="number"
                  step="any"
                  value={testMin}
                  onChange={(e) => setTestMin(e.target.value)}
                  placeholder="مثلاً: ۰.۷"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">حداکثر مجاز (Max)</label>
                <input
                  type="number"
                  step="any"
                  value={testMax}
                  onChange={(e) => setTestMax(e.target.value)}
                  placeholder="مثلاً: ۱.۵"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">واحد اندازه‌گیری</label>
                <input
                  type="text"
                  value={testUnit}
                  onChange={(e) => setTestUnit(e.target.value)}
                  placeholder="% یا CFU/g"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-600 mb-1 font-semibold">روش آزمون معتبر *</label>
                <input
                  type="text"
                  value={testMethod}
                  onChange={(e) => setTestMethod(e.target.value)}
                  placeholder="مثلاً: تیتراسیون اسید-باز با سود ۰.۱ نرمال در حضور معرف فنل‌فتالئین بر اساس استاندارد ملی"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>ثبت و اتصال زنجیره در بانک جامع</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
