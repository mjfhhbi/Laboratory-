import React, { useState } from 'react';
import { 
  FoodCatalogProduct, 
  ProductTestSpecification, 
  CatalogRelatedStandard, 
  RelationalSource,
  ProcessStep,
  RawMaterialIngredient,
  CatalogEquipmentItem
} from '../../types/foodProductsCatalog';
import { PRODUCT_CATEGORIES } from '../../data/products/categoryMeta';
import { 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  FileCheck, 
  Layers, 
  Thermometer, 
  Package, 
  Clock, 
  Wrench, 
  AlertTriangle, 
  ExternalLink,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Network
} from 'lucide-react';
import { RelationalFlowModal } from './RelationalFlowModal';

interface ProductDetailViewProps {
  product: FoodCatalogProduct;
  onBack: () => void;
}

type TabKey = 
  | 'specs'
  | 'raw_materials'
  | 'process'
  | 'qc_tests'
  | 'equipment'
  | 'storage_packaging'
  | 'standards'
  | 'sources';

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('specs');
  const [qcFilter, setQcFilter] = useState<'all' | 'physical' | 'chemical' | 'microbial' | 'sensory'>('all');
  const [showRelationalModal, setShowRelationalModal] = useState(false);

  const categoryMeta = PRODUCT_CATEGORIES[product.category];

  // Filter QC tests
  const filteredTests = qcFilter === 'all' 
    ? product.tests 
    : product.tests.filter(t => t.category === qcFilter);

  const physicalCount = product.tests.filter(t => t.category === 'physical').length;
  const chemicalCount = product.tests.filter(t => t.category === 'chemical').length;
  const microbialCount = product.tests.filter(t => t.category === 'microbial').length;
  const sensoryCount = product.tests.filter(t => t.category === 'sensory').length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(product, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${product.code}_technical_specification.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-xs"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به فهرست محصولات</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRelationalModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-all"
            >
              <Network className="w-4 h-4" />
              <span>مشاهده دیاگرام رابطه‌ای (Product ← Tests ← Standards ← Sources)</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              title="چاپ شناسنامه فنی"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportJson}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              title="خروجی JSON مشخصات"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xl p-2 rounded-xl bg-white/10 backdrop-blur-xs">
                {categoryMeta?.icon || '📦'}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                دسته‌بندی: {categoryMeta?.nameFa || product.category}
              </span>
              <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                کد سامانه: {product.code}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">{product.nameFa}</h1>
            <p className="text-xs text-slate-300 font-mono mt-1">{product.nameEn}</p>
            {product.commercialNameFa && (
              <p className="text-xs text-amber-300 mt-1">نام تجاری متعارف: {product.commercialNameFa}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            {product.standards.map((std) => (
              <div 
                key={std.id}
                className="bg-white/10 border border-white/15 px-3 py-2 rounded-xl text-right"
              >
                <div className="text-[10px] text-slate-400 font-medium">{std.organization}</div>
                <div className="text-xs font-bold text-white font-mono">{std.standardNumber}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">
                  {std.status === 'active_mandatory' ? 'استاندارد اجباری' : 'توصیه‌شده'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial forms pills */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400">اشکال تجاری و بسته‌بندی عرضه:</span>
          {product.commercialFormsFa.map((form, idx) => (
            <span key={idx} className="bg-white/10 px-2.5 py-0.5 rounded-lg text-slate-200 text-[11px]">
              {form}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('specs')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'specs'
              ? 'border-emerald-600 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>مشخصات و ویژگی‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('raw_materials')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'raw_materials'
              ? 'border-emerald-600 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>مواد اولیه ({product.rawMaterials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('process')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'process'
              ? 'border-emerald-600 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>فرآیند تولید و CCP ({product.processSteps.length} مرحله)</span>
        </button>

        <button
          onClick={() => setActiveTab('qc_tests')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'qc_tests'
              ? 'border-emerald-600 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>آزمون‌های کنترل کیفیت ({product.tests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('equipment')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'equipment'
              ? 'border-emerald-600 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>تجهیزات و آزمایشگاه ({product.requiredEquipment.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('storage_packaging')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'storage_packaging'
              ? 'border-emerald-600 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>نگهداری، بسته‌بندی و ماندگاری</span>
        </button>

        <button
          onClick={() => setActiveTab('standards')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'standards'
              ? 'border-emerald-600 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>استانداردهای مرتبط ({product.standards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'sources'
              ? 'border-emerald-600 text-emerald-800 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>منابع و استنادها ({product.sources.length})</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="p-6">
        {/* TAB 1: Specs */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-2">شرح عمومی فرآورده</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{product.descriptionFa}</p>
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap gap-4 text-xs">
                <div>
                  <span className="text-slate-500">ماتریکس هدف: </span>
                  <span className="font-semibold text-slate-800">{product.targetMatrix}</span>
                </div>
                <div>
                  <span className="text-slate-500">حالت فیزیکی: </span>
                  <span className="font-semibold text-slate-800">
                    {product.physicalStateFa === 'liquid' ? 'مایع' :
                     product.physicalStateFa === 'solid' ? 'جامد' :
                     product.physicalStateFa === 'powder' ? 'پودر' :
                     product.physicalStateFa === 'viscous_paste' ? 'خمیری و چسبناک' :
                     product.physicalStateFa === 'semi_solid' ? 'نیمه‌جامد' : 'گرانول'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ویژگی‌های کلیدی فیزیکوشیمیایی</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {product.keyCharacteristicsFa.phTypical && (
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[11px] text-slate-500 block">دامنه متعارف pH</span>
                    <span className="text-sm font-bold text-slate-800">{product.keyCharacteristicsFa.phTypical}</span>
                  </div>
                )}
                {product.keyCharacteristicsFa.brixTypical && (
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[11px] text-slate-500 block">درجه بریکس (°Brix)</span>
                    <span className="text-sm font-bold text-slate-800">{product.keyCharacteristicsFa.brixTypical}</span>
                  </div>
                )}
                {product.keyCharacteristicsFa.moisturePercent && (
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[11px] text-slate-500 block">درصد رطوبت</span>
                    <span className="text-sm font-bold text-slate-800">{product.keyCharacteristicsFa.moisturePercent}</span>
                  </div>
                )}
                {product.keyCharacteristicsFa.fatPercent && (
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[11px] text-slate-500 block">درصد چربی</span>
                    <span className="text-sm font-bold text-slate-800">{product.keyCharacteristicsFa.fatPercent}</span>
                  </div>
                )}
                {product.keyCharacteristicsFa.proteinPercent && (
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[11px] text-slate-500 block">درصد پروتئین</span>
                    <span className="text-sm font-bold text-slate-800">{product.keyCharacteristicsFa.proteinPercent}</span>
                  </div>
                )}
                {product.keyCharacteristicsFa.ashPercent && (
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[11px] text-slate-500 block">درصد خاکستر کل</span>
                    <span className="text-sm font-bold text-slate-800">{product.keyCharacteristicsFa.ashPercent}</span>
                  </div>
                )}
                {product.keyCharacteristicsFa.saltPercent && (
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[11px] text-slate-500 block">درصد نمک طعام</span>
                    <span className="text-sm font-bold text-slate-800">{product.keyCharacteristicsFa.saltPercent}</span>
                  </div>
                )}
                {product.keyCharacteristicsFa.waterActivityTypical && (
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[11px] text-slate-500 block">فعالیت آبی (aw)</span>
                    <span className="text-sm font-bold text-slate-800">{product.keyCharacteristicsFa.waterActivityTypical}</span>
                  </div>
                )}
              </div>

              {product.keyCharacteristicsFa.appearanceColorFa && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
                  <strong className="text-amber-900 block mb-1">ویژگی‌های ظاهری، رنگ و بافت:</strong>
                  <p className="text-amber-800 leading-relaxed">{product.keyCharacteristicsFa.appearanceColorFa}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-2">برچسب‌ها و واژگان کلیدی</h3>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Raw Materials */}
        {activeTab === 'raw_materials' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">فرمولاسیون و مواد اولیه تشکیل‌دهنده</h3>
              <span className="text-xs text-slate-500">تعداد اجزا: {product.rawMaterials.length} ماده</span>
            </div>

            <div className="space-y-3">
              {product.rawMaterials.map((rm) => (
                <div key={rm.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{rm.nameFa}</h4>
                        {rm.isAllergenic && (
                          <span className="text-[10px] font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            حاوی آلرژن ({rm.allergenType})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{rm.nameEn}</span>
                    </div>
                    <div className="text-right sm:text-left">
                      <span className="text-xs text-slate-500 block">درصد در فرمول:</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono">{rm.typicalPercentageRange}</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5">نقش عملکردی در فرآورده:</span>
                      <p className="text-slate-800">{rm.role}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">معیارهای کیفی پذیرش ماده اولیه:</span>
                      <p className="text-slate-800">{rm.qualityCriteriaFa}</p>
                    </div>
                  </div>

                  {rm.standardReference && (
                    <div className="mt-2 text-[11px] text-blue-700 font-mono">
                      مرجع استاندارد ماده اولیه: {rm.standardReference}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Process Steps & CCP */}
        {activeTab === 'process' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">فرآیند تولید گام‌به‌گام و نقاط کنترل بحرانی (HACCP/CCP)</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold">CCP: بحرانی</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">OPRP: پیش‌نیازی</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">CP: کنترلی</span>
              </div>
            </div>

            <div className="relative border-r-2 border-slate-200 pr-6 mr-3 space-y-6">
              {product.processSteps.map((step) => {
                const badgeColor = 
                  step.ccpOrCqP === 'CCP' ? 'bg-rose-600 text-white' :
                  step.ccpOrCqP === 'OPRP' ? 'bg-amber-500 text-white' :
                  'bg-blue-600 text-white';

                return (
                  <div key={step.stepNumber} className="relative bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className={`absolute -right-9 top-4 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${badgeColor}`}>
                      {step.stepNumber}
                    </span>

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{step.nameFa}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeColor}`}>
                          {step.ccpOrCqP}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{step.nameEn}</span>
                    </div>

                    <p className="text-xs text-slate-700 mb-3">{step.descriptionFa}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <strong className="text-slate-700 block mb-0.5">پارامترهای بحرانی فرآیند:</strong>
                        <span className="text-slate-800 font-semibold">{step.criticalParameters}</span>
                      </div>
                      <div>
                        <strong className="text-slate-700 block mb-0.5">تجهیزات و ماشین‌آلات:</strong>
                        <span className="text-slate-800">{step.equipmentFa}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: QC Tests */}
        {activeTab === 'qc_tests' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-800">
                آزمون‌های جامع کنترل کیفیت (تفکیک شده: فیزیکی، شیمیایی، میکروبی، حسی)
              </h3>
              
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setQcFilter('all')}
                  className={`text-xs px-3 py-1 rounded-xl font-medium transition-all ${
                    qcFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  همه ({product.tests.length})
                </button>
                <button
                  onClick={() => setQcFilter('physical')}
                  className={`text-xs px-3 py-1 rounded-xl font-medium transition-all ${
                    qcFilter === 'physical' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  فیزیکی ({physicalCount})
                </button>
                <button
                  onClick={() => setQcFilter('chemical')}
                  className={`text-xs px-3 py-1 rounded-xl font-medium transition-all ${
                    qcFilter === 'chemical' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  شیمیایی ({chemicalCount})
                </button>
                <button
                  onClick={() => setQcFilter('microbial')}
                  className={`text-xs px-3 py-1 rounded-xl font-medium transition-all ${
                    qcFilter === 'microbial' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  میکروبی ({microbialCount})
                </button>
                <button
                  onClick={() => setQcFilter('sensory')}
                  className={`text-xs px-3 py-1 rounded-xl font-medium transition-all ${
                    qcFilter === 'sensory' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  حسی ({sensoryCount})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3">کد و نام آزمون</th>
                    <th className="p-3">رده آزمون</th>
                    <th className="p-3">شاخص / آنالیت</th>
                    <th className="p-3">محدوده استاندارد و حد پذیرش</th>
                    <th className="p-3">روش آزمون معتبر</th>
                    <th className="p-3">تواتر</th>
                    <th className="p-3">استاندارد و منبع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTests.map((test) => {
                    const std = product.standards.find(s => s.id === test.standardId);
                    const src = product.sources.find(sc => sc.id === test.sourceId || sc.id === std?.sourceId);

                    const categoryBadge = 
                      test.category === 'chemical' ? 'bg-amber-100 text-amber-800' :
                      test.category === 'microbial' ? 'bg-rose-100 text-rose-800' :
                      test.category === 'physical' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800';

                    const categoryNameFa = 
                      test.category === 'chemical' ? 'شیمیایی' :
                      test.category === 'microbial' ? 'میکروبی' :
                      test.category === 'physical' ? 'فیزیکی' : 'حسی';

                    return (
                      <tr key={test.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{test.nameFa}</div>
                          <div className="text-[11px] font-mono text-slate-500">{test.code}</div>
                          {test.notesFa && (
                            <div className="text-[10px] text-amber-700 mt-1 max-w-xs">{test.notesFa}</div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${categoryBadge}`}>
                            {categoryNameFa}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">
                          {test.parameterAnalyte}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-800">
                          {test.minLimit !== undefined && `حداقل: ${test.minLimit} `}
                          {test.maxLimit !== undefined && `حداکثر: ${test.maxLimit} `}
                          {test.textLimitFa && <span>{test.textLimitFa}</span>}
                          {test.unit && <span className="mr-1 text-[11px] font-sans text-slate-600">{test.unit}</span>}
                        </td>
                        <td className="p-3 text-slate-700 max-w-xs">
                          {test.methodFa}
                        </td>
                        <td className="p-3 text-slate-600">
                          {test.frequency === 'in_line' ? 'پیوسته در خط' :
                           test.frequency === 'each_batch' ? 'هر بهر' :
                           test.frequency === 'daily' ? 'روزانه' :
                           test.frequency === 'raw_intake' ? 'ورود محموله' : 'دوره‌ای'}
                        </td>
                        <td className="p-3">
                          <div className="text-blue-700 font-bold font-mono">{std?.standardNumber || '—'}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{src?.citationCode || '—'}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Equipment */}
        {activeTab === 'equipment' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">تجهیزات خط تولید و دستگاه‌های آزمایشگاه کنترل کیفیت</h3>
              <span className="text-xs text-slate-500">تعداد ماشین‌آلات و دستگاه‌ها: {product.requiredEquipment.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.requiredEquipment.map((eq) => (
                <div key={eq.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-slate-900">{eq.nameFa}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      eq.roleInProcessOrLab === 'laboratory_qc'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {eq.roleInProcessOrLab === 'laboratory_qc' ? 'دستگاه آزمایشگاه QC' : 'ماشین‌آلات خط تولید'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 block mb-2">{eq.nameEn}</span>
                  
                  <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100">
                    <div>
                      <strong className="text-slate-600 block">مشخصات کلیدی فنی:</strong>
                      <p className="text-slate-800">{eq.keySpecificationFa}</p>
                    </div>
                    {eq.maintenanceAndCalibration && (
                      <div className="pt-1">
                        <strong className="text-slate-600 block">برنامه کالیبراسیون و نگهداری:</strong>
                        <p className="text-slate-700 text-[11px]">{eq.maintenanceAndCalibration}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Storage, Packaging & Shelf Life */}
        {activeTab === 'storage_packaging' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Storage */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800 pb-2 border-b border-slate-200">
                <Thermometer className="w-4 h-4 text-emerald-600" />
                <span>شرایط نگهداری و انبارش</span>
              </div>
              <div className="text-xs space-y-2">
                <div>
                  <span className="text-slate-500 block">محدوده دمایی:</span>
                  <span className="font-bold text-slate-900">{product.storageConditions.temperatureRangeFa}</span>
                </div>
                {product.storageConditions.relativeHumidityRangeFa && (
                  <div>
                    <span className="text-slate-500 block">رطوبت نسبی:</span>
                    <span className="font-bold text-slate-900">{product.storageConditions.relativeHumidityRangeFa}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block">حفاظت در برابر نور:</span>
                  <p className="text-slate-800">{product.storageConditions.lightingProtectionFa}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">محدودیت چیدمان پالت:</span>
                  <span className="font-semibold text-slate-800">{product.storageConditions.stackingLimitsFa}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">احتیاطات ویژه:</span>
                  <p className="text-slate-800">{product.storageConditions.specialPrecautionsFa}</p>
                </div>
              </div>
            </div>

            {/* Packaging */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800 pb-2 border-b border-slate-200">
                <Package className="w-4 h-4 text-blue-600" />
                <span>مشخصات فنی بسته‌بندی</span>
              </div>
              <div className="text-xs space-y-2">
                <div>
                  <span className="text-slate-500 block">جنس بسته‌بندی اولیه:</span>
                  <p className="font-semibold text-slate-900">{product.packagingSpecs.primaryPackagingMaterialFa}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">بسته‌بندی ثانویه (کارتن/شرینک):</span>
                  <p className="text-slate-800">{product.packagingSpecs.secondaryPackagingMaterialFa}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">خواص ممانعت‌کنندگی (Barrier):</span>
                  <p className="text-slate-800">{product.packagingSpecs.barrierPropertiesFa}</p>
                </div>
                {product.packagingSpecs.hermeticSealTestFa && (
                  <div>
                    <span className="text-slate-500 block">آزمون درزبندی و سیل هرمتیک:</span>
                    <p className="text-slate-800 font-mono text-[11px]">{product.packagingSpecs.hermeticSealTestFa}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shelf Life */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800 pb-2 border-b border-slate-200">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>طول عمر و ماندگاری (Shelf-Life)</span>
              </div>
              <div className="text-xs space-y-2">
                <div>
                  <span className="text-slate-500 block">مدت ماندگاری استاندارد:</span>
                  <span className="font-bold text-emerald-800 text-sm">{product.shelfLifeSpecs.shelfLifeDurationFa}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">مکانیسم اصلی فساد و زوال:</span>
                  <p className="text-slate-800">{product.shelfLifeSpecs.primaryDeteriorationMechanism}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">حد بحرانی پایان عمر ماندگاری:</span>
                  <p className="text-slate-800 font-semibold">{product.shelfLifeSpecs.criticalLimitAtEndOfShelfLife}</p>
                </div>
                {product.shelfLifeSpecs.acceleratedTestingParameters && (
                  <div>
                    <span className="text-slate-500 block">آزمون تسریع‌شده ماندگاری:</span>
                    <p className="text-slate-700 text-[11px]">{product.shelfLifeSpecs.acceleratedTestingParameters}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Related Standards (Shown Separately if multiple!) */}
        {activeTab === 'standards' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900">
              <strong>قاعده تفکیک استانداردها:</strong> چنانچه یک محصول تحت پوشش چندین استاندارد ملی (INSO) یا
              کدکس بین‌المللی (Codex) قرار دارد، هر استاندارد با شماره ثبت، حوزه کاربرد و منبع معتبر آن به صورت
              کاملاً مجزا در کارت زیر نمایش داده شده است.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.standards.map((std) => {
                const src = product.sources.find(s => s.id === std.sourceId);

                return (
                  <div key={std.id} className="p-5 rounded-2xl border-2 border-slate-200 bg-white shadow-2xs hover:border-blue-400 transition-all">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          مرجع: {std.organization}
                        </span>
                        <h4 className="font-bold text-base text-slate-900 font-mono mt-1">{std.standardNumber}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        std.status === 'active_mandatory' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {std.status === 'active_mandatory' ? 'اجباری ملی' : 'توصیه‌شده'}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-slate-800 mb-1">{std.titleFa}</h5>
                    <p className="text-[11px] text-slate-500 font-mono mb-3">{std.titleEn}</p>

                    <div className="text-xs space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-500 block text-[11px]">دامنه شمول و اهداف:</span>
                        <p className="text-slate-800">{std.scopeFa}</p>
                      </div>
                      <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200">
                        <span className="text-slate-500">سال انتشار:</span>
                        <span className="font-bold text-slate-700">{std.publicationYear}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">کد منبع مرتبط:</span>
                        <span className="font-mono font-bold text-emerald-700">{src?.citationCode || std.sourceId}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 8: Sources */}
        {activeTab === 'sources' && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900">
              <strong>تطابق سخت‌گیرانه اصالت داده (Strict Relational Integrity):</strong> هیچ مشخصه‌ای در این سامانه
              بدون اتصال به مدرک و منبع رسمی ثبت نشده است. تمامی منابع زیر دارای هویت مدون، سازمان متولی و ارجاع
              استنادی هستند.
            </div>

            <div className="space-y-3">
              {product.sources.map((src) => (
                <div key={src.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-700 text-sm">{src.citationCode}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          تایید شده رسمی
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 mt-1">{src.titleFa}</h4>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{src.publicationYear}</span>
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">سازمان تدوین‌کننده:</span>
                      <span className="font-semibold text-slate-800">{src.issuingBodyOrAuthors}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">نوع سند:</span>
                      <span className="font-semibold text-slate-800">
                        {src.documentType === 'national_standard' ? 'استاندارد ملی' :
                         src.documentType === 'codex_standard' ? 'استاندارد کدکس' : 'روش آزمون معتبر'}
                      </span>
                    </div>
                    <div>
                      {src.officialReferenceOrUrl && (
                        <a
                          href={src.officialReferenceOrUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline font-medium mt-3 sm:mt-0"
                        >
                          <span>مشاهده در پورتال سازمان استاندارد</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Relational Flow Modal */}
      {showRelationalModal && (
        <RelationalFlowModal
          product={product}
          onClose={() => setShowRelationalModal(false)}
        />
      )}
    </div>
  );
};
