import React, { useState, useMemo } from 'react';
import {
  Package,
  Droplets,
  Wind,
  Layers,
  Calendar,
  ShieldAlert,
  BarChart3,
  FileText,
  Search,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle2,
  Info,
  Scale,
  Thermometer,
  Percent,
  Maximize2,
  ArrowRightLeft
} from 'lucide-react';
import {
  BENCHMARK_PACKAGING_MATERIALS,
  getPackagingMaterialById
} from '../../lib/packaging/packagingMaterialsData';
import {
  calculateWvtr,
  calculateOtr,
  calculateLaminateBarrier,
  calculateFickianDiffusion,
  calculatePackagingShelfLife,
  calculateMigrationAssessment
} from '../../lib/packaging/packagingEngine';
import {
  PackagingMaterialRecord,
  LaminateLayerInput,
  FoodSimulantType,
  PiringerPolymerMatrix,
  BpaTransitionalCategory
} from '../../lib/packaging/types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

export function PackagingEngineeringSuite() {
  const [activeTab, setActiveTab] = useState<
    'materials' | 'wvtr' | 'otr' | 'fick' | 'shelflife' | 'migration' | 'compare' | 'report'
  >('materials');

  // Search & filter in Materials Database
  const [materialSearch, setMaterialSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<PackagingMaterialRecord>(BENCHMARK_PACKAGING_MATERIALS[0]);

  // WVTR state
  const [wvtrCupMethod, setWvtrCupMethod] = useState<'desiccant_dry_cup' | 'water_wet_cup'>('desiccant_dry_cup');
  const [wvtrAreaM2, setWvtrAreaM2] = useState<number>(0.005); // 50 cm² cup
  const [wvtrThicknessUm, setWvtrThicknessUm] = useState<number>(30);
  const [wvtrTempC, setWvtrTempC] = useState<number>(37.8);
  const [wvtrRhHigh, setWvtrRhHigh] = useState<number>(90);
  const [wvtrRhLow, setWvtrRhLow] = useState<number>(0);
  const [wvtrPoints, setWvtrPoints] = useState<{ timeHours: number; massGrams: number }[]>([
    { timeHours: 0, massGrams: 15.000 },
    { timeHours: 12, massGrams: 15.025 },
    { timeHours: 24, massGrams: 15.051 },
    { timeHours: 36, massGrams: 15.077 },
    { timeHours: 48, massGrams: 15.103 }
  ]);

  // OTR state
  const [otrPermeability, setOtrPermeability] = useState<number>(1.3); // PET
  const [otrThicknessUm, setOtrThicknessUm] = useState<number>(20);
  const [otrAreaM2, setOtrAreaM2] = useState<number>(0.1);
  const [otrTempC, setOtrTempC] = useState<number>(25);
  const [otrActivationEnergy, setOtrActivationEnergy] = useState<number>(35);
  const [otrDeltaPAtm, setOtrDeltaPAtm] = useState<number>(0.21);
  const [otrRhPercent, setOtrRhPercent] = useState<number>(50);
  const [otrIsRhSensitive, setOtrIsRhSensitive] = useState<boolean>(false);

  // Laminate Layers state
  const [laminateLayers, setLaminateLayers] = useState<LaminateLayerInput[]>([
    {
      materialId: 'mat_pet',
      materialNameFa: 'پلی‌استر (PET)',
      thicknessMicrons: 12,
      oxygenPermeabilityMm: 1.3,
      waterVaporPermeabilityMm: 0.5
    },
    {
      materialId: 'mat_alu_foil',
      materialNameFa: 'فویل آلومینیوم (Alu)',
      thicknessMicrons: 9,
      oxygenPermeabilityMm: 0.00001,
      waterVaporPermeabilityMm: 0.00001
    },
    {
      materialId: 'mat_ldpe',
      materialNameFa: 'پلی‌اتیلن دوخت (LDPE)',
      thicknessMicrons: 60,
      oxygenPermeabilityMm: 160.0,
      waterVaporPermeabilityMm: 0.45
    }
  ]);

  // Fickian Diffusion state
  const [fickD, setFickD] = useState<number>(1e-12); // m²/s
  const [fickThicknessUm, setFickThicknessUm] = useState<number>(50);
  const [fickC1, setFickC1] = useState<number>(100);
  const [fickC2, setFickC2] = useState<number>(0);

  // Shelf-Life state
  const [shelfProductMassKg, setShelfProductMassKg] = useState<number>(0.25);
  const [shelfInitialMoisture, setShelfInitialMoisture] = useState<number>(3.5);
  const [shelfCriticalMoisture, setShelfCriticalMoisture] = useState<number>(7.0);
  const [shelfIsothermSlope, setShelfIsothermSlope] = useState<number>(0.12);
  const [shelfPackagingAreaM2, setShelfPackagingAreaM2] = useState<number>(0.06);
  const [shelfEffectiveWvtr, setShelfEffectiveWvtr] = useState<number>(1.2);
  const [shelfEffectiveOtr, setShelfEffectiveOtr] = useState<number>(15.0);
  const [shelfStorageRh, setShelfStorageRh] = useState<number>(65);

  // Migration state (Default: PP + PP Antioxidant FCM 433 [Irganox 1076], EU 10/2011 Annex I Table 1 — avoids PP+Caprolactam mismatch)
  const [migrationSimulant, setMigrationSimulant] = useState<FoodSimulantType>('simulant_B');
  const [migrationPolymer, setMigrationPolymer] = useState<PiringerPolymerMatrix>('PP');
  const [migrationAreaDm2, setMigrationAreaDm2] = useState<number>(6.0);
  const [migrationFoodKg, setMigrationFoodKg] = useState<number>(1.0);
  const [migrationResidueGrams, setMigrationResidueGrams] = useState<number>(0.035); // 35 mg
  const [migrantName, setMigrantName] = useState<string>('اکتادسیل ۳-(۳،۵-دی‌ترت-بوتیل-۴-هیدروکسی‌فنیل) پروپیونات (FCM 433)');
  const [migrantMw, setMigrantMw] = useState<number>(530.86);
  const [migrantInitialConc, setMigrantInitialConc] = useState<number>(200);
  const [migrantSml, setMigrantSml] = useState<number>(6.0);
  const [migrantCas, setMigrantCas] = useState<string>('2082-79-3');
  const [migrantFcm, setMigrantFcm] = useState<string>('433');
  const [migrantSmlGroup, setMigrantSmlGroup] = useState<number | undefined>(undefined);
  const [migrationRegVersion, setMigrationRegVersion] = useState<string>(
    'Regulation (EU) No 10/2011 (با اصلاحات (EU) 2023/1442، (EU) 2025/351 و (EU) 2024/3190 / (EU) 2026/250)'
  );
  const [migrationSourceRef, setMigrationSourceRef] = useState<string>(
    'EU 10/2011 Annex I Table 1 (FCM 433, CAS 2082-79-3, SML = 6.0 mg/kg)'
  );
  const [migrationIsRepeatedUse, setMigrationIsRepeatedUse] = useState<boolean>(false);
  const [migrationIsInfantFood, setMigrationIsInfantFood] = useState<boolean>(false);
  const [isTechnicalSupportAgent, setIsTechnicalSupportAgent] = useState<boolean>(false);
  const [d1FoodNature, setD1FoodNature] = useState<'unspecified' | 'alcoholic_non_fatty_gt20' | 'dairy_or_emulsion_fatty'>('unspecified');
  const [bpaDerogationType, setBpaDerogationType] = useState<
    'none' | 'polysulfone_filtration_membrane' | 'heavy_duty_tank_gt_1000L'
  >('none');
  const [bpaArticleType, setBpaArticleType] = useState<BpaTransitionalCategory>('single_use_general');
  const [firstPlacedDate, setFirstPlacedDate] = useState<string>('');
  const [isArticle4OtherBisphenol, setIsArticle4OtherBisphenol] = useState<boolean>(false);
  const [fcm435AsCaprolactam, setFcm435AsCaprolactam] = useState<number | undefined>(undefined);
  const [fcm212LabMgPerKg, setFcm212LabMgPerKg] = useState<number | undefined>(undefined);
  const [dehpOtherGroup32, setDehpOtherGroup32] = useState<number | undefined>(undefined);

  // Multi-material compare state
  const [compareMatIds, setCompareMatIds] = useState<string[]>([
    'mat_ldpe',
    'mat_bopp',
    'mat_pet',
    'mat_retort_pouch'
  ]);

  // Calculated Results
  const wvtrResult = useMemo(() => {
    try {
      return calculateWvtr({
        massChangeDataPoints: wvtrPoints,
        exposedAreaM2: wvtrAreaM2,
        thicknessMicrons: wvtrThicknessUm,
        testTemperatureC: wvtrTempC,
        relativeHumidityHighSidePercent: wvtrRhHigh,
        relativeHumidityLowSidePercent: wvtrRhLow,
        testCupMethod: wvtrCupMethod
      });
    } catch {
      return null;
    }
  }, [wvtrPoints, wvtrAreaM2, wvtrThicknessUm, wvtrTempC, wvtrRhHigh, wvtrRhLow, wvtrCupMethod]);

  const otrResult = useMemo(() => {
    try {
      return calculateOtr({
        oxygenPermeabilityMm: otrPermeability,
        thicknessMicrons: otrThicknessUm,
        exposedAreaM2: otrAreaM2,
        temperatureC: otrTempC,
        referenceTemperatureC: 23,
        activationEnergyO2KjPerMol: otrActivationEnergy,
        oxygenPartialPressureDiffAtm: otrDeltaPAtm,
        relativeHumidityPercent: otrRhPercent,
        isRhSensitiveMaterial: otrIsRhSensitive
      });
    } catch {
      return null;
    }
  }, [otrPermeability, otrThicknessUm, otrAreaM2, otrTempC, otrActivationEnergy, otrDeltaPAtm, otrRhPercent, otrIsRhSensitive]);

  const laminateResult = useMemo(() => {
    try {
      return calculateLaminateBarrier(laminateLayers);
    } catch {
      return null;
    }
  }, [laminateLayers]);

  const fickResult = useMemo(() => {
    try {
      return calculateFickianDiffusion({
        diffusionCoefficientM2PerSec: fickD,
        solubilityCoefficientCm3PerM3Pa: 1.0,
        thicknessMicrons: fickThicknessUm,
        concentrationHighSideGPerM3: fickC1,
        concentrationLowSideGPerM3: fickC2
      });
    } catch {
      return null;
    }
  }, [fickD, fickThicknessUm, fickC1, fickC2]);

  const shelfLifeResult = useMemo(() => {
    try {
      return calculatePackagingShelfLife({
        productNameFa: 'اسنک اکسترودشده ترد',
        productDryMassKg: shelfProductMassKg,
        initialMoisturePercentWetBasis: shelfInitialMoisture,
        criticalMoisturePercentWetBasis: shelfCriticalMoisture,
        isothermSlopeGWaterPerGProductPerAw: shelfIsothermSlope,
        packagingAreaM2: shelfPackagingAreaM2,
        effectiveWvtrAtTestGPerM2Day: shelfEffectiveWvtr,
        effectiveOtrAtTestCm3PerM2Day: shelfEffectiveOtr,
        storageTempC: 25,
        storageRhPercent: shelfStorageRh,
        headspaceVolumeCm3: 150,
        initialHeadspaceO2Percent: 1.5,
        maxTolerableO2ConsumptionCm3PerKg: 12.0
      });
    } catch {
      return null;
    }
  }, [
    shelfProductMassKg,
    shelfInitialMoisture,
    shelfCriticalMoisture,
    shelfIsothermSlope,
    shelfPackagingAreaM2,
    shelfEffectiveWvtr,
    shelfEffectiveOtr,
    shelfStorageRh
  ]);

  const migrationResult = useMemo(() => {
    try {
      return calculateMigrationAssessment({
        materialTypeFa: `فیلم ${migrationPolymer}`,
        polymerMatrix: migrationPolymer,
        simulant: migrationSimulant,
        testTemperatureC: 40,
        testTimeHours: 240, // 10 days at 40°C
        contactAreaDm2: migrationAreaDm2,
        foodVolumeKg: migrationFoodKg,
        initialSimulantMassGrams: 100,
        evaporatedResidueMassGrams: migrationResidueGrams,
        migrantNameFa: migrantName,
        migrantMolecularWeightGPerMol: migrantMw,
        initialMigrantConcentrationInPolymerMgPerKg: migrantInitialConc,
        smlLimitMgPerKg: migrantSml > 0 ? migrantSml : undefined,
        casNumber: migrantCas,
        fcmNumber: migrantFcm,
        smlGroupLimitMgPerKg: migrantSmlGroup,
        regulationVersionDate: migrationRegVersion,
        officialSourceReference: migrationSourceRef,
        isRepeatedUse: migrationIsRepeatedUse,
        isInfantOrYoungChildFood: migrationIsInfantFood,
        isTechnicalSupportAgent,
        d1FoodNature: migrationSimulant === 'simulant_D1' ? d1FoodNature : undefined,
        bpaDerogationType,
        bpaArticleType,
        firstPlacedOnMarketDate: firstPlacedDate || undefined,
        isArticle4OtherBisphenolContext: isArticle4OtherBisphenol,
        groupCoMigrantsMgPerKg:
          fcm435AsCaprolactam !== undefined || fcm212LabMgPerKg !== undefined || dehpOtherGroup32 !== undefined
            ? {
                fcm212CaprolactamMgPerKg: fcm212LabMgPerKg,
                caprolactamSodiumSaltAsCaprolactamMgPerKg: fcm435AsCaprolactam,
                otherGroup32PlasticisersMgPerKg: dehpOtherGroup32
              }
            : undefined
      });
    } catch {
      return null;
    }
  }, [
    migrationPolymer,
    migrationSimulant,
    migrationAreaDm2,
    migrationFoodKg,
    migrationResidueGrams,
    migrantName,
    migrantMw,
    migrantInitialConc,
    migrantSml,
    migrantCas,
    migrantFcm,
    migrantSmlGroup,
    migrationRegVersion,
    migrationSourceRef,
    migrationIsRepeatedUse,
    migrationIsInfantFood,
    isTechnicalSupportAgent,
    d1FoodNature,
    bpaDerogationType,
    bpaArticleType,
    firstPlacedDate,
    isArticle4OtherBisphenol,
    fcm435AsCaprolactam,
    fcm212LabMgPerKg,
    dehpOtherGroup32
  ]);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return BENCHMARK_PACKAGING_MATERIALS.filter((m) => {
      const matchSearch =
        m.nameFa.includes(materialSearch) ||
        m.nameEn.toLowerCase().includes(materialSearch.toLowerCase()) ||
        m.acronym.toLowerCase().includes(materialSearch.toLowerCase());
      const matchCat = selectedCategory === 'all' || m.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [materialSearch, selectedCategory]);

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-700/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
              <Package className="w-3.5 h-3.5" />
              <span>فاز ششم • قسمت ۵۲ از ۶۰</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              سوئیت مهندسی بسته‌بندی، نفوذپذیری و ماندگاری مواد غذایی
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              تحلیل نفوذپذیری گازها و بخار آب (WVTR و OTR)، مدلسازی نفوذ فیکی در سازه‌های چندلایه،
              پیش‌بینی طول عمر ماندگاری و انطباق آزمون‌های مهاجرت با استانداردهای رسمی INSO 13740 و EU 10/2011.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('report')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-950/40"
            >
              <Download className="w-4 h-4" />
              <span>خروجی گزارش مهندسی</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-700/60 no-scrollbar">
          {[
            { id: 'materials', label: '۱. بانک مواد بسته‌بندی', icon: Package },
            { id: 'wvtr', label: '۲. محاسبه‌گر WVTR', icon: Droplets },
            { id: 'otr', label: '۳. محاسبه‌گر OTR', icon: Wind },
            { id: 'fick', label: '۴. آزمایشگاه نفوذ فیک و چندلایه', icon: Layers },
            { id: 'shelflife', label: '۵. پیش‌بینی ماندگاری', icon: Calendar },
            { id: 'migration', label: '۶. ارزیابی مهاجرت مواد', icon: ShieldAlert },
            { id: 'compare', label: '۷. مقایسه بسته‌بندی‌ها', icon: ArrowRightLeft },
            { id: 'report', label: '۸. گزارش فنی و مراجع', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: MATERIALS DATABASE */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List & Filter Panel */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    placeholder="جستجوی نام یا نماد پلیمر (PE, PET, EVOH)..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                  {[
                    { id: 'all', label: 'همه' },
                    { id: 'polyolefin', label: 'پلی‌الفین' },
                    { id: 'polyester', label: 'پلی‌استر' },
                    { id: 'vinyl_copolymer', label: 'وینیل/کوپلیمر' },
                    { id: 'metallic', label: 'فویل/متالایز' },
                    { id: 'laminate', label: 'چندلایه' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">نام و نماد</th>
                      <th className="p-3">چگالی (g/cm³)</th>
                      <th className="p-3">نفوذ اکسیژن (PO2)</th>
                      <th className="p-3">نفوذ بخار آب (PH2O)</th>
                      <th className="p-3">سد گاز</th>
                      <th className="p-3">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredMaterials.map((mat) => {
                      const isSelected = selectedMaterial.id === mat.id;
                      return (
                        <tr
                          key={mat.id}
                          className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                            isSelected ? 'bg-emerald-950/30 text-white' : ''
                          }`}
                          onClick={() => setSelectedMaterial(mat)}
                        >
                          <td className="p-3 font-semibold text-white">
                            <div>{mat.nameFa}</div>
                            <div className="text-[10px] text-slate-500">{mat.nameEn}</div>
                          </td>
                          <td className="p-3">{mat.densityGPerCm3.toFixed(2)}</td>
                          <td className="p-3">
                            {mat.oxygenPermeabilityMm < 0.001
                              ? mat.oxygenPermeabilityMm.toExponential(2)
                              : mat.oxygenPermeabilityMm.toFixed(2)}
                            <span className="text-[10px] text-slate-500 mr-1">cm³·mm/m²·d·atm</span>
                          </td>
                          <td className="p-3">
                            {mat.waterVaporPermeabilityMm < 0.001
                              ? mat.waterVaporPermeabilityMm.toExponential(2)
                              : mat.waterVaporPermeabilityMm.toFixed(2)}
                            <span className="text-[10px] text-slate-500 mr-1">g·mm/m²·d</span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                mat.oxygenBarrierLevel === 'ultra_high'
                                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800/40'
                                  : mat.oxygenBarrierLevel === 'high'
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                                  : mat.oxygenBarrierLevel === 'medium'
                                  ? 'bg-blue-950/80 text-blue-300 border border-blue-800/40'
                                  : 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                              }`}
                            >
                              {mat.oxygenBarrierLevel === 'ultra_high'
                                ? 'سد فوق‌العاده'
                                : mat.oxygenBarrierLevel === 'high'
                                ? 'سد بالا'
                                : mat.oxygenBarrierLevel === 'medium'
                                ? 'سد متوسط'
                                : 'سد نفوذپذیر'}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMaterial(mat);
                                setOtrPermeability(mat.oxygenPermeabilityMm);
                                setOtrActivationEnergy(mat.activationEnergyO2KjPerMol);
                                setActiveTab('otr');
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors text-[10px]"
                            >
                              انتقال به OTR
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Material Detail Inspector */}
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedMaterial.nameFa}</h3>
                  <p className="text-xs text-slate-400">{selectedMaterial.nameEn}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
                  {selectedMaterial.acronym}
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                  <span className="text-slate-400">چگالی فیزیکی:</span>
                  <span className="font-mono text-white">{selectedMaterial.densityGPerCm3} g/cm³</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                  <span className="text-slate-400">محدوده ضخامت متداول:</span>
                  <span className="font-mono text-white">
                    {selectedMaterial.typicalThicknessRangeMicrons[0]} تا{' '}
                    {selectedMaterial.typicalThicknessRangeMicrons[1]} میکرون
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                  <span className="text-slate-400">نفوذپذیری اکسیژن ($P_{'{O_2}'}$):</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {selectedMaterial.oxygenPermeabilityMm} cm³·mm/(m²·d·atm)
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                  <span className="text-slate-400">نفوذپذیری بخار آب ($P_{'{H_2O}'}$):</span>
                  <span className="font-mono text-teal-400 font-bold">
                    {selectedMaterial.waterVaporPermeabilityMm} g·mm/(m²·d)
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                  <span className="text-slate-400">انرژی فعال‌سازی نفوذ ($E_p$):</span>
                  <span className="font-mono text-white">
                    {selectedMaterial.activationEnergyO2KjPerMol} kJ/mol
                  </span>
                </div>
                <div className="py-2 space-y-1">
                  <div className="text-slate-400">استانداردهای اندازه‌گیری رسمی:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMaterial.measurementStandards.map((std, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                        {std}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="py-2 space-y-1">
                  <div className="text-slate-400">مراجع علمی معتبر:</div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                    {selectedMaterial.literatureCitations.map((cit, i) => (
                      <li key={i}>{cit}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] leading-relaxed text-slate-300">
                  <Info className="w-3.5 h-3.5 inline ml-1 text-emerald-400" />
                  {selectedMaterial.notesFa}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WVTR CALCULATOR */}
      {activeTab === 'wvtr' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Droplets className="w-4 h-4 text-teal-400" />
              <span>داده‌های آزمون وزنی فنجان (ASTM E96 / ISO 2528)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">روش آزمون فنجان وزنی (ASTM E96):</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWvtrCupMethod('desiccant_dry_cup')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      wvtrCupMethod === 'desiccant_dry_cup'
                        ? 'bg-teal-600/30 border-teal-500 text-teal-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    فنجان خشک (افزایش جرم Δm &gt; 0)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWvtrCupMethod('water_wet_cup')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      wvtrCupMethod === 'water_wet_cup'
                        ? 'bg-teal-600/30 border-teal-500 text-teal-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    فنجان تر (کاهش جرم Δm &lt; 0)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">مساحت مؤثر سطح تماس فنجان ($m^2$):</label>
                <input
                  type="number"
                  step="0.0005"
                  value={wvtrAreaM2}
                  onChange={(e) => setWvtrAreaM2(parseFloat(e.target.value) || 0.001)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">ضخامت فیلم ($\mu m$):</label>
                  <input
                    type="number"
                    value={wvtrThicknessUm}
                    onChange={(e) => setWvtrThicknessUm(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">دمای آزمون ($^\circ C$):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={wvtrTempC}
                    onChange={(e) => setWvtrTempC(parseFloat(e.target.value) || 20)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">رطوبت نسبی بالا (% RH):</label>
                  <input
                    type="number"
                    value={wvtrRhHigh}
                    onChange={(e) => setWvtrRhHigh(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">رطوبت نسبی پایین (% RH):</label>
                  <input
                    type="number"
                    value={wvtrRhLow}
                    onChange={(e) => setWvtrRhLow(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Gravimetric Points Table */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">نقاط زمانی و تغییر وزن:</span>
                <button
                  onClick={() => {
                    const lastPt = wvtrPoints[wvtrPoints.length - 1];
                    setWvtrPoints([
                      ...wvtrPoints,
                      { timeHours: lastPt.timeHours + 12, massGrams: lastPt.massGrams + 0.025 }
                    ]);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>افزودن نقطه</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {wvtrPoints.map((pt, i) => (
                  <div key={i} className="flex gap-2 items-center text-xs">
                    <span className="text-slate-500 w-5">{i + 1}.</span>
                    <input
                      type="number"
                      value={pt.timeHours}
                      onChange={(e) => {
                        const newPts = [...wvtrPoints];
                        newPts[i].timeHours = parseFloat(e.target.value) || 0;
                        setWvtrPoints(newPts);
                      }}
                      placeholder="زمان (ساعت)"
                      className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                    />
                    <span className="text-slate-500">ساعت</span>
                    <input
                      type="number"
                      step="0.001"
                      value={pt.massGrams}
                      onChange={(e) => {
                        const newPts = [...wvtrPoints];
                        newPts[i].massGrams = parseFloat(e.target.value) || 0;
                        setWvtrPoints(newPts);
                      }}
                      placeholder="جرم (g)"
                      className="w-28 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                    />
                    <span className="text-slate-500">گرم</span>
                    {wvtrPoints.length > 2 && (
                      <button
                        onClick={() => setWvtrPoints(wvtrPoints.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span>نتایج نرخ انتقال بخار آب و اعتبارسنجی ابعادی</span>
              {wvtrResult && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                  $R^2 = {wvtrResult.rSquared.toFixed(4)}$
                </span>
              )}
            </h3>

            {wvtrResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400">نرخ انتقال بخار آب (WVTR):</span>
                    <div className="text-xl font-bold font-mono text-teal-400">
                      {wvtrResult.wvtrGPerM2Day.toFixed(3)}
                    </div>
                    <span className="text-[10px] text-slate-500">g / (m² · day)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400">واحد مرسوم آمریکا (US):</span>
                    <div className="text-xl font-bold font-mono text-white">
                      {wvtrResult.wvtrGPer100In2Day.toFixed(4)}
                    </div>
                    <span className="text-[10px] text-slate-500">g / (100 in² · day)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400">نفوذپذیری رطوبت ($P_{'{H_2O}'}$):</span>
                    <div className="text-xl font-bold font-mono text-emerald-400">
                      {wvtrResult.permeabilityGMmPerM2DayAtm.toFixed(3)}
                    </div>
                    <span className="text-[10px] text-slate-500">g · mm / (m² · day · atm)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300">فرمول و جایگذاری مقادیر:</h4>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 overflow-x-auto text-xs text-emerald-300">
                    <KaTeXRenderer expression={wvtrResult.formulaLatex} />
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 overflow-x-auto text-xs text-slate-300">
                    <KaTeXRenderer expression={wvtrResult.substitutionLatex} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{wvtrResult.dimensionsAuditFa}</span>
                </div>

                {wvtrResult.outlierWarningFa && (
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div className="space-y-1.5">
                      <div className="font-semibold text-amber-200">
                        هشدار نقاط پرت آماری: {wvtrResult.outlierCount} نقطه پرت از {wvtrResult.totalPointsCount} نقطه (بدون حذف خودکار)
                      </div>
                      <div>{wvtrResult.outlierWarningFa}</div>
                      <div className="text-[10px] text-amber-300/80 border-t border-amber-800/40 pt-1">
                        روش: {wvtrResult.outlierDiagnostics.detectionMethodFa} | آستانه: {wvtrResult.outlierDiagnostics.thresholdRule} —{' '}
                        {wvtrResult.outlierDiagnostics.statisticalLimitationFa}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                خطا در محاسبه؛ لطفاً ورودی‌های جرمی و زمانی را بررسی فرمایید.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: OTR CALCULATOR */}
      {activeTab === 'otr' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Wind className="w-4 h-4 text-blue-400" />
              <span>تنظیمات نرخ انتقال اکسیژن (ASTM D3985)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">
                  نفوذپذیری ذاتی ماده ($P_{'{O_2}'}$ در ۲۳°C):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={otrPermeability}
                  onChange={(e) => setOtrPermeability(parseFloat(e.target.value) || 0.001)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
                <span className="text-[10px] text-slate-500">cm³ · mm / (m² · day · atm)</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">ضخامت فیلم ($\mu m$):</label>
                  <input
                    type="number"
                    value={otrThicknessUm}
                    onChange={(e) => setOtrThicknessUm(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">مساحت بسته ($m^2$):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={otrAreaM2}
                    onChange={(e) => setOtrAreaM2(parseFloat(e.target.value) || 0.01)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">دمای فرآیند/انبار ($^\circ C$):</label>
                  <input
                    type="number"
                    value={otrTempC}
                    onChange={(e) => setOtrTempC(parseFloat(e.target.value) || 20)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">انرژی فعال‌سازی ($E_p$):</label>
                  <input
                    type="number"
                    value={otrActivationEnergy}
                    onChange={(e) => setOtrActivationEnergy(parseFloat(e.target.value) || 30)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                  <span className="text-[10px] text-slate-500">kJ/mol</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  گرادیان فشار جزئی اکسیژن ($\Delta p_{'{O_2}'}$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={otrDeltaPAtm}
                  onChange={(e) => setOtrDeltaPAtm(parseFloat(e.target.value) || 0.21)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
                <span className="text-[10px] text-slate-500">
                  اتمسفر (۰.۲۱ برای هوای بیرون و ۰% در داخل پاکت وکیوم)
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold text-xs">
                    رفتار پلیمر هیدروفیلیک / حساس به رطوبت (EVOH, PA):
                  </label>
                  <input
                    type="checkbox"
                    checked={otrIsRhSensitive}
                    onChange={(e) => setOtrIsRhSensitive(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-blue-500 focus:ring-0"
                  />
                </div>
                {otrIsRhSensitive && (
                  <div>
                    <label className="text-slate-400 block mb-1">رطوبت نسبی محیط آزمون (% RH):</label>
                    <input
                      type="number"
                      step="5"
                      value={otrRhPercent}
                      onChange={(e) => setOtrRhPercent(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                    />
                    <span className="text-[10px] text-amber-400 block mt-1">
                      نفوذ اکسیژن در EVOH در رطوبت‌های بالا به دلیل پلاستیسایزینگ آب شدیداً افزایش می‌یابد.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* OTR Results Panel */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">نتایج نرخ انتقال اکسیژن و وابستگی دمایی آرنیوس</h3>

            {otrResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400">نرخ انتقال اکسیژن (OTR):</span>
                    <div className="text-xl font-bold font-mono text-blue-400">
                      {otrResult.otrCm3PerM2Day.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-slate-500">cm³ / (m² · day)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400">ورود اکسیژن روزانه به کل بسته:</span>
                    <div className="text-xl font-bold font-mono text-emerald-400">
                      {otrResult.dailyOxygenTransmissionTotalCm3.toFixed(3)}
                    </div>
                    <span className="text-[10px] text-slate-500">cm³ O₂ در هر ۲۴ ساعت</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400">شار مولی اکسیژن ($J_{'{mol}'}$):</span>
                    <div className="text-xl font-bold font-mono text-white">
                      {otrResult.oxygenFluxMolPerM2Second.toExponential(3)}
                    </div>
                    <span className="text-[10px] text-slate-500">mol / (m² · s)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300">روابط حاکم و تصحیح دمایی آرنیوس:</h4>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 overflow-x-auto text-xs text-blue-300">
                    <KaTeXRenderer expression={otrResult.formulaLatex} />
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 overflow-x-auto text-xs text-slate-300">
                    <KaTeXRenderer expression={otrResult.arrheniusLatex} />
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 overflow-x-auto text-xs text-emerald-300">
                    <KaTeXRenderer expression={otrResult.substitutionLatex} />
                  </div>
                  {otrResult.fittedRhModelLatex && (
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 overflow-x-auto text-xs text-purple-300">
                      <KaTeXRenderer expression={otrResult.fittedRhModelLatex} />
                    </div>
                  )}
                </div>

                {otrResult.rhModelStatus && otrResult.rhModelStatus !== 'not_applicable' && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
                    <span className="text-slate-300">وضعیت مدل رطوبتی (نیازمند ≥۴ نقطه متمایز، بدون برون‌یابی):</span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        otrResult.rhModelStatus === 'calibrated_data_only'
                          ? 'bg-blue-950 text-blue-300 border border-blue-700/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-700/40'
                      }`}
                    >
                      {otrResult.rhModelStatus === 'calibrated_data_only'
                        ? `دارای داده کالیبراسیون (محدوده ${otrResult.rhValidRangePercent?.[0]}–${otrResult.rhValidRangePercent?.[1]}% RH | فاقد اعتبارسنجی مستقل)`
                        : otrResult.rhModelStatus}
                    </span>
                  </div>
                )}

                {otrResult.rhModelCaveatFa && (
                  <div className="p-3 rounded-xl bg-blue-950/25 border border-blue-800/40 text-[11px] text-blue-200">
                    {otrResult.rhModelCaveatFa}
                  </div>
                )}

                {otrResult.rhWarningFa && (
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div>{otrResult.rhWarningFa}</div>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-800/30 text-xs text-blue-300 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    تمایز مهندسی: نفوذپذیری (Permeability) خاصیت ذاتی ماده مستقل از ضخامت است،
                    در حالی که نفوذدهی (Permeance = P/L) و نرخ انتقال (OTR) تابع ضخامت و اختلاف فشار جزئی هستند.
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 4: FICKIAN DIFFUSION & LAMINATES */}
      {activeTab === 'fick' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Multi-Layer Laminates */}
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>مقاومت متوالی در لمینیت‌های چندلایه</span>
              </h3>
              <button
                onClick={() => {
                  setLaminateLayers([
                    ...laminateLayers,
                    {
                      materialId: 'mat_ldpe',
                      materialNameFa: 'پلی‌اتیلن جدید',
                      thicknessMicrons: 30,
                      oxygenPermeabilityMm: 160,
                      waterVaporPermeabilityMm: 0.45
                    }
                  ]);
                }}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-400 text-xs inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن لایه</span>
              </button>
            </div>

            <div className="space-y-2">
              {laminateLayers.map((layer, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-semibold text-white">
                      لایه {idx + 1}: {layer.materialNameFa}
                    </span>
                    <div className="flex gap-3 text-slate-400 text-[11px]">
                      <span>ضخامت: {layer.thicknessMicrons} µm</span>
                      <span>$P_{'{O_2}'}$: {layer.oxygenPermeabilityMm}</span>
                      <span>$P_{'{H_2O}'}$: {layer.waterVaporPermeabilityMm}</span>
                    </div>
                  </div>
                  {laminateLayers.length > 1 && (
                    <button
                      onClick={() => setLaminateLayers(laminateLayers.filter((_, i) => i !== idx))}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {laminateResult && (
              <div className="space-y-4 pt-3 border-t border-slate-800 text-xs">
                {/* 1. Ideal Theoretical Barrier Card */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-purple-300">
                      ۱. سد ایده‌آل تئوریک (فیلم بدون عیب):
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950/70 text-purple-300 border border-purple-800/40">
                      مقاومت متوالی ۱۰۰٪
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">OTR تئوریک چندلایه:</span>
                      <span className="font-mono text-purple-400 font-bold text-xs">
                        {laminateResult.effectiveOtrCm3PerM2Day.toFixed(4)} cm³/m²·d
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">WVTR تئوریک چندلایه:</span>
                      <span className="font-mono text-teal-400 font-bold text-xs">
                        {laminateResult.effectiveWvtrGPerM2Day.toFixed(4)} g/m²·d
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-slate-400 block text-[11px]">سهم مقاومت نفوذ اکسیژن لایه‌ها:</span>
                    {laminateResult.layerResistanceBreakdown.map((r, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px] py-0.5">
                        <span className="text-slate-300">{r.materialNameFa}:</span>
                        <span className="font-mono text-emerald-400">
                          {r.oxygenResistancePercentage.toFixed(1)}% سهم کل
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Real Package Defect Assessment Card */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-amber-200">
                      ۲. ارزیابی ریسک بسته واقعی (Real Package):
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900/40 text-amber-300 border border-amber-700/50">
                      {laminateResult.realPackageAssessment.status === 'unverified_defect_data_required'
                        ? 'نیازمند داده عیوب تجربی'
                        : 'ارزیابی‌شده'}
                    </span>
                  </div>

                  <div className="text-[11px] text-amber-300 leading-relaxed space-y-1">
                    <div className="p-2 rounded bg-amber-950/40 border border-amber-800/40 text-amber-200">
                      {laminateResult.realPackageAssessment.pinholeRiskNoticeFa}
                    </div>
                    <div className="text-slate-300">
                      {laminateResult.realPackageAssessment.flexCrackNoticeFa}
                    </div>
                    <div className="text-amber-400 font-mono text-[10px] pt-1">
                      {laminateResult.realPackageAssessment.recommendationFa}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fickian Lag Time */}
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>آزمایشگاه نفوذ فیک و زمان تاخیر (Lag Time)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">ضریب نفوذ فیکی ($D$ در $m^2/s$):</label>
                <input
                  type="number"
                  step="1e-13"
                  value={fickD}
                  onChange={(e) => setFickD(parseFloat(e.target.value) || 1e-13)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ضخامت صفحه ($L$ بر حسب میکرون):</label>
                <input
                  type="number"
                  value={fickThicknessUm}
                  onChange={(e) => setFickThicknessUm(parseFloat(e.target.value) || 10)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
            </div>

            {fickResult && (
              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px]">زمان تأخیر نفوذ (Crank Lag Time):</span>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {fickResult.lagTimeHours.toFixed(2)} ساعت
                    <span className="text-slate-500 text-xs mr-2">
                      ({fickResult.lagTimeSeconds.toFixed(1)} ثانیه)
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <KaTeXRenderer expression={fickResult.formulaLatex} />
                </div>

                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400 leading-relaxed">
                  {fickResult.assumptionsFa.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SHELF-LIFE PREDICTION */}
      {activeTab === 'shelflife' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>مشخصات محصول و پارامترهای ماندگاری</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">جرم خالص خشک محصول ($kg$):</label>
                <input
                  type="number"
                  step="0.05"
                  value={shelfProductMassKg}
                  onChange={(e) => setShelfProductMassKg(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">رطوبت اولیه (% w.b):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={shelfInitialMoisture}
                    onChange={(e) => setShelfInitialMoisture(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">رطوبت بحرانی تردی (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={shelfCriticalMoisture}
                    onChange={(e) => setShelfCriticalMoisture(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">WVTR بسته‌بندی ($g/m^2\\cdot d$):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={shelfEffectiveWvtr}
                    onChange={(e) => setShelfEffectiveWvtr(parseFloat(e.target.value) || 0.1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">OTR بسته‌بندی ($cm^3/m^2\\cdot d$):</label>
                  <input
                    type="number"
                    step="1"
                    value={shelfEffectiveOtr}
                    onChange={(e) => setShelfEffectiveOtr(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">مساحت بسته ($m^2$):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={shelfPackagingAreaM2}
                    onChange={(e) => setShelfPackagingAreaM2(parseFloat(e.target.value) || 0.01)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">رطوبت محیط انبار (% RH):</label>
                  <input
                    type="number"
                    value={shelfStorageRh}
                    onChange={(e) => setShelfStorageRh(parseFloat(e.target.value) || 50)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shelf Life Simulation Results */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">شبیه‌سازی دینامیک جذب رطوبت و اکسیژن در طول زمان</h3>

            {shelfLifeResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400">ماندگاری محدودشده با رطوبت:</span>
                    <div className="text-2xl font-bold font-mono text-teal-400">
                      {shelfLifeResult.shelfLifeMoistureLimitedDays} روز
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400">ماندگاری محدودشده با اکسیژن:</span>
                    <div className="text-2xl font-bold font-mono text-blue-400">
                      {shelfLifeResult.shelfLifeOxygenLimitedDays} روز
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-1">
                    <span className="text-[11px] text-amber-300 font-semibold">عامل محدودکننده ماندگاری:</span>
                    <div className="text-lg font-bold text-white">
                      {shelfLifeResult.limitingFactor === 'moisture'
                        ? 'جذب رطوبت (افت تردی)'
                        : 'نفوذ اکسیژن (اکسیداسیون)'}
                    </div>
                    <span className="text-[10px] text-amber-400">
                      حداکثر زمان پیشنهادی: {shelfLifeResult.recommendedShelfLifeDays} روز
                    </span>
                  </div>
                </div>

                {/* Trajectory Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">زمان (روز)</th>
                        <th className="p-2.5">رطوبت محصول (%)</th>
                        <th className="p-2.5">فعالیت آبی ($a_w$)</th>
                        <th className="p-2.5">اکسیژن کل نفوذی ($cm^3$)</th>
                        <th className="p-2.5">اکسیژن هداسپیس (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-slate-300 font-mono text-[11px]">
                      {shelfLifeResult.moistureGainCurve.map((row, idx) => {
                        const o2Row = shelfLifeResult.oxygenIngressCurve[idx] || {
                          cumulativeO2IngressCm3: 0,
                          headspaceO2Percent: 0
                        };
                        return (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="p-2.5 font-bold text-white">{row.day}</td>
                            <td className="p-2.5 text-teal-300">{row.moisturePercent}%</td>
                            <td className="p-2.5">{row.waterActivity}</td>
                            <td className="p-2.5 text-blue-300">{o2Row.cumulativeO2IngressCm3}</td>
                            <td className="p-2.5">{o2Row.headspaceO2Percent}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {shelfLifeResult.oxygenDiagnosticFa && (
                  <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <div>
                      <span className="font-semibold text-rose-200">تشخیص تخصصی اکسیژن: </span>
                      {shelfLifeResult.oxygenDiagnosticFa}
                    </div>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-semibold">محدوده اعتبار مدل ایزوترم خطی:</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 font-mono">
                      {shelfLifeResult.calculationClassification}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {shelfLifeResult.labuzaIntegralNoticeFa}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{shelfLifeResult.scientificDisclaimerFa}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 6: MIGRATION ASSESSMENT */}
      {activeTab === 'migration' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>تنظیمات آزمون مهاجرت (EU 10/2011 & INSO 13740)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-300 block">سناریوهای آموزشی استاندارد:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setMigrationPolymer('PP');
                      setMigrantName('اکتادسیل ۳-(۳،۵-دی‌ترت-بوتیل-۴-هیدروکسی‌فنیل) پروپیونات (FCM 433)');
                      setMigrantMw(530.86);
                      setMigrantSml(6.0);
                      setMigrantCas('2082-79-3');
                      setMigrantFcm('433');
                      setMigrantSmlGroup(undefined);
                      setIsArticle4OtherBisphenol(false);
                      setFcm435AsCaprolactam(undefined);
                      setFcm212LabMgPerKg(undefined);
                      setMigrationSourceRef('EU 10/2011 Annex I Table 1 (FCM 433, CAS 2082-79-3, SML = 6.0 mg/kg)');
                    }}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 text-right"
                  >
                    PP + آنتی‌اکسیدان (FCM 433)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMigrationPolymer('PA6');
                      setMigrantName('کاپرولاکتام (Caprolactam)');
                      setMigrantMw(113.16);
                      setMigrantSml(15.0);
                      setMigrantCas('105-60-2');
                      setMigrantFcm('212');
                      setMigrantSmlGroup(15.0);
                      setIsArticle4OtherBisphenol(false);
                      setMigrationSourceRef('EU 10/2011 Annex I Table 1 & 2 (FCM 212 + FCM 435, Group Restriction No. 4)');
                    }}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 text-right"
                  >
                    PA-6 + کاپرولاکتام (آموزشی)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMigrationPolymer('LDPE');
                      setMigrationSimulant('simulant_A');
                      setMigrantName('دی‌اتیل‌هگزیل فتالات (DEHP)');
                      setMigrantMw(390.56);
                      setMigrantSml(0.6);
                      setMigrantCas('117-81-7');
                      setMigrantFcm('283');
                      setMigrantSmlGroup(0.6);
                      setMigrationIsRepeatedUse(true);
                      setIsTechnicalSupportAgent(false);
                      setIsArticle4OtherBisphenol(false);
                      setMigrationSourceRef('EU 10/2011 Annex I FCM 283 (amended by (EU) 2023/1442, Groups 32 & 36)');
                    }}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-300 text-right"
                  >
                    DEHP (گروه‌های ۳۲ و ۳۶)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMigrationPolymer('PET');
                      setMigrantName('بیسفنول آ (BPA)');
                      setMigrantMw(228.29);
                      setMigrantSml(0);
                      setMigrantCas('80-05-7');
                      setMigrantFcm('151');
                      setMigrantSmlGroup(undefined);
                      setBpaDerogationType('polysulfone_filtration_membrane');
                      setMigrationSourceRef('Regulation (EU) 2024/3190 & (EU) 2026/250 (Art. 3, 9(2)(b), Annex II)');
                    }}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-rose-300 text-right"
                  >
                    BPA (2024/3190 & 2026/250)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ماتریس پلیمری (پارامترهای JRC پیرینگر):</label>
                <select
                  value={migrationPolymer}
                  onChange={(e) => setMigrationPolymer(e.target.value as PiringerPolymerMatrix)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="PP">پلی‌پروپیلن PP هموپلیمر/رندوم (JRC: Ap′=13.1, τ=1577)</option>
                  <option value="LDPE">پلی‌اتیلن سبک LDPE (JRC: Ap′=11.5, τ=0)</option>
                  <option value="LLDPE">پلی‌اتیلن خطی LLDPE (JRC: Ap′=11.5, τ=0)</option>
                  <option value="HDPE">پلی‌اتیلن سنگین HDPE (JRC: Ap′=14.5, τ=1577)</option>
                  <option value="PP_BLOCK">PP کوپلیمر بلوکی (JRC: Ap′=11.5, τ=0)</option>
                  <option value="PET">PET در دمای زیر Tg (EUR 24514: Ap′=3.1, τ=1577)</option>
                  <option value="PS">پلی‌استایرن عمومی PS (EUR 24514: Ap′=-1.0, τ=0)</option>
                  <option value="HIPS">HIPS (EUR 24514: Ap′=1.0, τ=0)</option>
                  <option value="PA6">پلی‌آمید ۶ / PA-6 (ماتریس اصلی کاپرولاکتام — فاقد پارامتر پیرینگر / Unverified)</option>
                  <option value="PVC">PVC / سایر (فاقد پارامتر ثابت یکسان — Unverified)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">شبیه‌ساز ماده غذایی (Food Simulant):</label>
                <select
                  value={migrationSimulant}
                  onChange={(e) => setMigrationSimulant(e.target.value as FoodSimulantType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="simulant_A">شبیه‌ساز A (اتانول ۱۰٪ - غذاهای آبکی)</option>
                  <option value="simulant_B">شبیه‌ساز B (اسید استیک ۳٪ - غذاهای اسیدی pH &lt; 4.5)</option>
                  <option value="simulant_C">شبیه‌ساز C (اتانول ۲۰٪ - نوشیدنی‌های الکلی ملایم)</option>
                  <option value="simulant_D1">شبیه‌ساز D1 (اتانول ۵۰٪ - فرآورده‌های شیری و روغنی)</option>
                  <option value="simulant_D2">شبیه‌ساز D2 (روغن گیاهی / ایزواکتان - غذاهای چرب)</option>
                  <option value="simulant_E">شبیه‌ساز E (تیناکس Tenax - غذاهای خشک و غلات)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">سطح تماس ($dm^2$):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={migrationAreaDm2}
                    onChange={(e) => setMigrationAreaDm2(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">جرم فرآورده ($kg$):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={migrationFoodKg}
                    onChange={(e) => setMigrationFoodKg(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  جرم باقیمانده تبخیر در آزمون مهاجرت کلی ($g$):
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={migrationResidueGrams}
                  onChange={(e) => setMigrationResidueGrams(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
                <span className="text-[10px] text-slate-500">
                  معادل {(migrationResidueGrams * 1000).toFixed(1)} میلی‌گرم
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-slate-300 font-semibold block">پارامترهای مهاجرت اختصاصی (SML) و شناسه قانونی:</span>
                <input
                  type="text"
                  value={migrantName}
                  onChange={(e) => setMigrantName(e.target.value)}
                  placeholder="نام مونومر یا افزودنی"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-white text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block text-[10px]">وزن مولکولی ($g/mol$):</label>
                    <input
                      type="number"
                      value={migrantMw}
                      onChange={(e) => setMigrantMw(parseFloat(e.target.value) || 100)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px]">حد مجاز SML ($mg/kg$):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={migrantSml}
                      onChange={(e) => setMigrantSml(parseFloat(e.target.value) || 0)}
                      placeholder="0 برای نامشخص"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block text-[10px]">شماره CAS:</label>
                    <input
                      type="text"
                      value={migrantCas}
                      onChange={(e) => setMigrantCas(e.target.value)}
                      placeholder="e.g. 105-60-2"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px]">شماره ماده FCM:</label>
                    <input
                      type="text"
                      value={migrantFcm}
                      onChange={(e) => setMigrantFcm(e.target.value)}
                      placeholder="e.g. 212"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block text-[10px]">حد تجمعی گروهی SML(T) ($mg/kg$):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={migrantSmlGroup || ''}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setMigrantSmlGroup(isNaN(v) ? undefined : v);
                    }}
                    placeholder="اختیاری (مثلاً 0.6 برای DEHP طبق EU 2023/1442)"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block text-[10px]">نسخه و اصلاحیه مقررات:</label>
                  <input
                    type="text"
                    value={migrationRegVersion}
                    onChange={(e) => setMigrationRegVersion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block text-[10px]">منبع رسمی ضمیمه/بند مقررات:</label>
                  <input
                    type="text"
                    value={migrationSourceRef}
                    onChange={(e) => setMigrationSourceRef(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[11px]"
                  />
                </div>

                {migrationSimulant === 'simulant_D1' && (
                  <div>
                    <label className="text-slate-400 block text-[10px]">ماهیت غذایی در شبیه‌ساز D1 (تمایز Annex III):</label>
                    <select
                      value={d1FoodNature}
                      onChange={(e) => setD1FoodNature(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[11px]"
                    >
                      <option value="unspecified">نامشخص (Unverified برای شرط غیرچرب DEHP)</option>
                      <option value="alcoholic_non_fatty_gt20">نوشیدنی الکلی &gt;20% غیرچرب</option>
                      <option value="dairy_or_emulsion_fatty">لبنیات / امولسیون روغن-در-آب (چرب)</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                  <label>کاربرد چندبارمصرف (Repeated-use):</label>
                  <input
                    type="checkbox"
                    checked={migrationIsRepeatedUse}
                    onChange={(e) => setMigrationIsRepeatedUse(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <label>کاربرد به‌عنوان کمک‌فرآیند فنی (Technical support agent):</label>
                  <input
                    type="checkbox"
                    checked={isTechnicalSupportAgent}
                    onChange={(e) => setIsTechnicalSupportAgent(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <label>مرتبط با غذای نوزاد/کودک خردسال:</label>
                  <input
                    type="checkbox"
                    checked={migrationIsInfantFood}
                    onChange={(e) => setMigrationIsInfantFood(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block text-[10px]">FCM 435 نمک سدیم کاپرولاکتام (mg/kg):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={fcm435AsCaprolactam ?? ''}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setFcm435AsCaprolactam(isNaN(v) ? undefined : v);
                      }}
                      placeholder="خالی = Unverified"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[11px] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px]">تاریخ نخستین عرضه (YYYY-MM-DD):</label>
                    <input
                      type="text"
                      value={firstPlacedDate}
                      onChange={(e) => setFirstPlacedDate(e.target.value)}
                      placeholder="e.g. 2026-08-01"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[11px] font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 block text-[10px]">وضعیت استثنای Annex II ((EU) 2024/3190 & 2026/250 برای BPA):</label>
                  <select
                    value={bpaDerogationType}
                    onChange={(e) => setBpaDerogationType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[11px]"
                  >
                    <option value="none">بدون استثنا (ممنوعیت مصرف عمدی BPA)</option>
                    <option value="polysulfone_filtration_membrane">غشای فیلتراسیون پلی‌سولفون (شرط ND با LoD = 0.001 mg/kg)</option>
                    <option value="heavy_duty_tank_gt_1000L">پوشش مخزن صنعتی &gt; 1000 لیتر (شرط ND با LoD = 0.001 mg/kg)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block text-[10px]">دسته دوره انتقالی BPA (Art. 11/12):</label>
                    <select
                      value={bpaArticleType}
                      onChange={(e) => setBpaArticleType(e.target.value as BpaTransitionalCategory)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[10px]"
                    >
                      <option value="single_use_general">یک‌بارمصرف عمومی (2026-07-20)</option>
                      <option value="single_use_extended_2028">یک‌بارمصرف تمدیدشده (2028-01-20)</option>
                      <option value="repeat_use_general">چندبارمصرف عمومی (2026-07-20)</option>
                      <option value="repeat_use_prof_equipment_2028">تجهیزات حرفه‌ای (2028-01-20)</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-1.5 text-[10px] text-amber-300">
                      <input
                        type="checkbox"
                        checked={isArticle4OtherBisphenol}
                        onChange={(e) => setIsArticle4OtherBisphenol(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-800"
                      />
                      <span>بستر Article 4 (BADGE / بیسفنول دیگر)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Migration Results Panel */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">تفکیک تخمین محاسباتی پیرینگر و وضعیت انطباق قانونی</h3>

            {migrationResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Overall Migration Card */}
                  <div
                    className={`p-4 rounded-xl border space-y-2 ${
                      migrationResult.isOverallMigrationCompliant
                        ? 'bg-emerald-950/20 border-emerald-800/40'
                        : 'bg-rose-950/30 border-rose-800/40'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-300">مهاجرت کلی (OM):</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          migrationResult.isOverallMigrationCompliant
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {migrationResult.isOverallMigrationCompliant ? 'زیر سقف ۱۰ mg/dm² (آزمون آزمایشگاهی)' : 'فراتر از سقف ۱۰ mg/dm²'}
                      </span>
                    </div>

                    <div className="text-2xl font-bold font-mono text-white">
                      {migrationResult.overallMigrationMgPerDm2.toFixed(2)}{' '}
                      <span className="text-xs text-slate-400">mg/dm²</span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <div>سقف مرجع EU 10/2011: ۱۰.۰ mg/dm² (یا ۶۰.۰ mg/kg غذا)</div>
                      <div>
                        غلظت در غذای فرضی: {migrationResult.overallMigrationMgPerKgFood.toFixed(2)} mg/kg
                      </div>
                    </div>
                  </div>

                  {/* Specific Migration Card */}
                  <div
                    className={`p-4 rounded-xl border space-y-2 ${
                      migrationResult.smlStatus === 'prohibited_intentional_use' ||
                      migrationResult.smlStatus === 'restricted_conditions_violated' ||
                      migrationResult.smlStatus === 'screening_exceeds_sml' ||
                      migrationResult.smlStatus === 'derogated_exceeds_detection_limit'
                        ? 'bg-rose-950/30 border-rose-800/40'
                        : migrationResult.smlStatus === 'screening_below_sml_unverified_lab' ||
                          migrationResult.smlStatus === 'derogated_requires_analytical_nd_verification'
                        ? 'bg-blue-950/20 border-blue-800/40'
                        : 'bg-amber-950/25 border-amber-800/40'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-semibold text-slate-300">
                        تخمین غربالگری ({migrantName}):
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          migrationResult.smlStatus === 'prohibited_intentional_use' ||
                          migrationResult.smlStatus === 'restricted_conditions_violated' ||
                          migrationResult.smlStatus === 'screening_exceeds_sml'
                            ? 'bg-rose-500/20 text-rose-300'
                            : migrationResult.smlStatus === 'screening_below_sml_unverified_lab'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {migrationResult.smlStatus === 'screening_below_sml_unverified_lab'
                          ? 'تخمین زیر سقف (نیازمند EN 1186)'
                          : migrationResult.smlStatus === 'prohibited_intentional_use'
                          ? 'ممنوعیت مصرف عمدی (EU 2024/3190)'
                          : migrationResult.smlStatus === 'restricted_conditions_violated'
                          ? 'مغایرت شرط کاربرد'
                          : migrationResult.smlStatus}
                      </span>
                    </div>

                    <div className="text-2xl font-bold font-mono text-white">
                      {migrationResult.estimatedSpecificMigrationMgPerKg !== undefined
                        ? migrationResult.estimatedSpecificMigrationMgPerKg.toFixed(4)
                        : '—'}{' '}
                      <span className="text-xs text-slate-400">mg/kg</span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-1">
                      <div>
                        وضعیت محاسباتی:{' '}
                        <span className="font-mono text-slate-200">{migrationResult.computationalEstimationStatus}</span>
                      </div>
                      <div>
                        وضعیت انطباق قانونی:{' '}
                        <span className="font-mono text-amber-300">{migrationResult.legalComplianceStatus}</span>
                      </div>
                      {migrationResult.piringerParametersUsed && (
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                          پلیمر: {migrationResult.piringerParametersUsed.polymerKey} | Ap′={' '}
                          {migrationResult.piringerParametersUsed.apPrime ?? 'نامشخص'} | τ={' '}
                          {migrationResult.piringerParametersUsed.tauK ?? 'نامشخص'} ({migrationResult.piringerParametersUsed.parameterSource})
                        </div>
                      )}
                      {migrationResult.smlDetails && (
                        <div className="text-[10px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                          <div>
                            شناسه: CAS {migrationResult.smlDetails.casNumber || '—'} | FCM {migrationResult.smlDetails.fcmNumber || '—'}
                          </div>
                          {migrationResult.smlDetails.smlLimitMgPerKg !== undefined && (
                            <div>
                              حد اختصاصی SML: {migrationResult.smlDetails.smlLimitMgPerKg} mg/kg
                              {migrationResult.smlDetails.smlGroupLimitMgPerKg !== undefined &&
                                ` | حد گروهی SML(T): ${migrationResult.smlDetails.smlGroupLimitMgPerKg} mg/kg`}
                            </div>
                          )}
                          {migrationResult.smlDetails.analyticalLodMgPerKg !== undefined && (
                            <div className="text-amber-300">
                              حد تشخیص تحلیلی (LoD) طبق Article 9(2)(b): {migrationResult.smlDetails.analyticalLodMgPerKg} mg/kg (1 µg/kg) — <span className="underline">SML عمومی نیست</span>
                            </div>
                          )}
                          {migrationResult.smlDetails.group36Status && (
                            <div>
                              گروه ۳۶ (سقف 0.6 mg/kg DEHP-eq): {migrationResult.smlDetails.groupDehpEquivalentMgPerKg?.toFixed(3) ?? '—'} [{migrationResult.smlDetails.group36Status}]
                              {' | '}گروه ۳۲ (سقف 60 mg/kg): {migrationResult.smlDetails.group32TotalPlasticisersMgPerKg?.toFixed(2) ?? '—'} [{migrationResult.smlDetails.group32Status}]
                            </div>
                          )}
                          {migrationResult.smlDetails.group4Status && (
                            <div>
                              گروه ۴ (FCM 212 + FCM 435، سقف 15 mg/kg): {migrationResult.smlDetails.group4SumAsCaprolactamMgPerKg?.toFixed(3) ?? '—'} [{migrationResult.smlDetails.group4Status}]
                            </div>
                          )}
                          <div className="text-emerald-400">{migrationResult.smlDetails.regulatoryVerdictFa}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {migrationResult.smlDetails?.conditionsOfUseWarningsFa && (
                  <div className="p-3.5 rounded-xl bg-rose-950/25 border border-rose-800/40 text-xs text-rose-200 space-y-1">
                    {migrationResult.smlDetails.conditionsOfUseWarningsFa.map((w, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-300 font-semibold">مبنای استاندارد و مرجع حقوقی:</div>
                  <div className="text-xs text-emerald-400 font-mono">
                    {migrationResult.legalStandardReference}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{migrationResult.regulatoryNoticeFa}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 7: COMPARE MATERIALS */}
      {activeTab === 'compare' && (
        <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
            <span>ماتریس مقایسه فنی ساختارهای بسته‌بندی</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">شاخص فنی / ساختار</th>
                  {compareMatIds.map((id) => {
                    const mat = getPackagingMaterialById(id);
                    return (
                      <th key={id} className="p-3 text-white font-bold">
                        {mat?.nameFa} ({mat?.acronym})
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-slate-400">چگالی ($g/cm^3$)</td>
                  {compareMatIds.map((id) => (
                    <td key={id} className="p-3 font-mono">
                      {getPackagingMaterialById(id)?.densityGPerCm3}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400">
                    نفوذپذیری اکسیژن ($cm^3\\cdot mm/m^2\\cdot d\\cdot atm$)
                  </td>
                  {compareMatIds.map((id) => (
                    <td key={id} className="p-3 font-mono text-emerald-400 font-bold">
                      {getPackagingMaterialById(id)?.oxygenPermeabilityMm}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400">
                    نفوذپذیری بخار آب ($g\\cdot mm/m^2\\cdot d$)
                  </td>
                  {compareMatIds.map((id) => (
                    <td key={id} className="p-3 font-mono text-teal-400 font-bold">
                      {getPackagingMaterialById(id)?.waterVaporPermeabilityMm}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400">سدبخار آب</td>
                  {compareMatIds.map((id) => (
                    <td key={id} className="p-3">
                      {getPackagingMaterialById(id)?.waterVaporBarrierLevel}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400">مقاومت در اتوکلاو استریلیزاسیون</td>
                  {compareMatIds.map((id) => (
                    <td key={id} className="p-3">
                      {id === 'mat_retort_pouch' ? (
                        <span className="text-emerald-400 font-bold">بله (تا ۱۳۰°C)</span>
                      ) : (
                        <span className="text-slate-500">خیر</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: TECHNICAL REPORT & EXPORT */}
      {activeTab === 'report' && (
        <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">شناسنامه و گزارش جامع مهندسی بسته‌بندی</h3>
              <p className="text-xs text-slate-400">
                خلاصه محاسبات، روابط فیزیکی، استانداردهای متناظر و اعتبارسنجی
              </p>
            </div>
            <button
              onClick={() => {
                const reportText = `گزارش مهندسی بسته‌بندی مواد غذایی\nتاریخ: ${new Date().toLocaleDateString('fa-IR')}\n\n` +
                  `WVTR محاسبه‌شده: ${wvtrResult?.wvtrGPerM2Day.toFixed(3) || '—'} g/(m²·day)\n` +
                  `OTR محاسبه‌شده: ${otrResult?.otrCm3PerM2Day.toFixed(2) || '—'} cm³/(m²·day)\n` +
                  `ماندگاری پیشنهادی: ${shelfLifeResult?.recommendedShelfLifeDays || '—'} روز\n` +
                  `عامل محدودکننده: ${shelfLifeResult?.limitingFactor || '—'}\n` +
                  `انطباق مهاجرت کلی: ${migrationResult?.isOverallMigrationCompliant ? 'منطبق' : 'عدم انطباق'}\n` +
                  `استانداردها: INSO 13740, ASTM D3985, ASTM F1249, EU 10/2011`;
                const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'packaging-engineering-report.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>دانلود فایل متنی گزارش</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 block">استانداردهای روش آزمون لحاظ شده:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>ASTM D3985: روش کولومتریک نفوذپذیری گاز اکسیژن در فیلم‌های پلاستیکی.</li>
                <li>ASTM F1249: روش حسگر مادون قرمز مدوله برای نفوذپذیری بخار آب (WVTR).</li>
                <li>ISO 15105-1 & 15105-2: تعیین نرخ انتقال گاز در پلاستیک‌ها.</li>
                <li>INSO 13740: استاندارد ملی ایران برای مواد و ظروف پلاستیکی در تماس با غذا.</li>
                <li>Regulation (EU) No 10/2011: آیین‌نامه مهاجرت و سلامت مواد در تماس با غذا.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-teal-400 block">فرضیات و اصول مهندسی سیستم:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>اعمال قانون اول و دوم نفوذ فیک برای انتقال جرم تک‌بعدی در حالت پایدار.</li>
                <li>مدلسازی سازه‌های چندلایه با جمع مقاومت‌های نفوذ سری ($\sum L_i/P_i$).</li>
                <li>تصحیح دمایی نفوذپذیری بر پایه رابطه نمایی انرژی فعال‌سازی آرنیوس.</li>
                <li>محاسبه فشار بخار اشباع با رابطه آنتوان در دماهای مختلف.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
