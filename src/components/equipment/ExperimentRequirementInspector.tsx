import React, { useState, useEffect } from 'react';
import { FoodExperiment } from '../../types/foodExperiment';
import {
  LaboratoryEquipment,
  ExperimentEquipmentRequirement,
  EQUIPMENT_CATEGORIES
} from '../../types/laboratoryEquipment';
import {
  resolveExperimentEquipmentRequirements,
  checkEquipmentCalibrationReadiness
} from '../../lib/equipment/equipmentEngine';
import {
  FlaskConical,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Scale
} from 'lucide-react';

interface ExperimentRequirementInspectorProps {
  experiments: FoodExperiment[];
  equipmentCatalog: LaboratoryEquipment[];
  initialExperimentId?: string;
  onOpenEquipmentDetail?: (equipment: LaboratoryEquipment) => void;
  onClose?: () => void;
}

export const ExperimentRequirementInspector: React.FC<ExperimentRequirementInspectorProps> = ({
  experiments,
  equipmentCatalog,
  initialExperimentId,
  onOpenEquipmentDetail,
  onClose
}) => {
  const [selectedExperimentId, setSelectedExperimentId] = useState<string>(
    initialExperimentId || (experiments[0]?.id ?? '')
  );
  const [searchFilter, setSearchFilter] = useState('');

  const activeExperiment = experiments.find((e) => e.id === selectedExperimentId) || experiments[0];

  const resolvedRequirements: ExperimentEquipmentRequirement[] = activeExperiment
    ? resolveExperimentEquipmentRequirements(activeExperiment, equipmentCatalog)
    : [];

  const filteredExperiments = experiments.filter((e) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      e.titleFa.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.domain.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg">
              <FlaskConical className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              موتور انطباق تجهیزات و نیازمندی‌های استاندارد
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            تحلیل زنجیره الزامات: <strong>آزمایش ← تجهیزات موردنیاز ← مشخصات فنی استخراج‌شده</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full font-medium">
            تجهیزات منطبق: {resolvedRequirements.length} دستگاه
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 px-3 py-1 rounded border"
            >
              بستن پنل
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: 2 Columns (Experiment Selector & Requirements Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Experiment Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="جستجوی آزمایش موردنظر..."
              className="w-full pl-3 pr-9 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="max-h-[500px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {filteredExperiments.map((exp) => {
              const isSelected = exp.id === activeExperiment?.id;
              const eqCount = exp.equipment?.length || 0;

              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExperimentId(exp.id)}
                  className={`w-full text-right p-3 rounded-xl border transition-all text-xs flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold shadow-sm'
                      : 'bg-stone-50/70 dark:bg-stone-950/40 border-stone-200 dark:border-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-300'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 block">
                      {exp.code}
                    </span>
                    <span className="truncate block font-medium mt-0.5">{exp.titleFa}</span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-mono ${
                      isSelected
                        ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {eqCount} دستگاه
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Breakdown Table / Cards */}
        <div className="lg:col-span-8 space-y-4">
          {activeExperiment ? (
            <div>
              {/* Selected Experiment Header Details */}
              <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded">
                    {activeExperiment.code}
                  </span>
                  <span className="text-xs text-stone-500">
                    مرجع استاندارد: {activeExperiment.sources?.[0]?.sourceTitle || 'استاندارد ملی/بین‌المللی'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {activeExperiment.titleFa}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {activeExperiment.principle}
                </p>
              </div>

              {/* Requirement Items */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تجهیزات و مشخصات فنی الزام‌شده توسط متدولوژی استاندارد:</span>
                </h5>

                {resolvedRequirements.length > 0 ? (
                  resolvedRequirements.map((req, index) => {
                    const matchedEq = req.matchedEquipmentId
                      ? equipmentCatalog.find((e) => e.id === req.matchedEquipmentId)
                      : null;

                    const categoryMeta = req.equipmentCategory
                      ? EQUIPMENT_CATEGORIES[req.equipmentCategory]
                      : null;

                    const readiness = matchedEq
                      ? checkEquipmentCalibrationReadiness(matchedEq)
                      : null;

                    return (
                      <div
                        key={index}
                        className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm space-y-3"
                      >
                        {/* Item Top: Name & Category */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                              {req.equipmentName}
                            </span>
                          </div>

                          {categoryMeta && (
                            <span
                              className="text-[11px] px-2.5 py-0.5 rounded-md font-semibold text-white"
                              style={{ backgroundColor: categoryMeta.color }}
                            >
                              {categoryMeta.titleFa}
                            </span>
                          )}
                        </div>

                        {/* Middle: Required Specifications & Standard Accuracy */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-stone-50 dark:bg-stone-950 p-3 rounded-lg border border-stone-200/60 dark:border-stone-800/60">
                          <div>
                            <strong className="text-stone-500 dark:text-stone-400 block mb-0.5">
                              مشخصات فنی در متن استاندارد:
                            </strong>
                            {req.requiredSpecification ? (
                              <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                                {req.requiredSpecification}
                              </span>
                            ) : (
                              <span className="text-stone-400 italic">
                                مقادیر عمومی طبق استاندارد روش (فاقد تلرانس عددی خاص در متن)
                              </span>
                            )}
                          </div>

                          <div>
                            <strong className="text-stone-500 dark:text-stone-400 block mb-0.5">
                              الزام کالیبراسیون:
                            </strong>
                            <span className="text-stone-800 dark:text-stone-200">
                              {req.calibrationRequirement || 'کنترل کالیبراسیون معتبر طبق ISO 17025'}
                            </span>
                          </div>
                        </div>

                        {/* Bottom: Match in Laboratory Catalog */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          {matchedEq ? (
                            <div className="flex items-center gap-2">
                              <span className="text-stone-500">دستگاه منطبق در آزمایشگاه:</span>
                              <span className="font-bold text-stone-800 dark:text-stone-200">
                                {matchedEq.nameFa} ({matchedEq.code})
                              </span>
                              {readiness && (
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${readiness.badgeColor}`}
                                >
                                  {readiness.statusText}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-stone-400 italic">
                              دستگاه اختصاصی با این نام در پایگاه ثبت نشده است (استفاده از مشخصات استاندارد).
                            </span>
                          )}

                          {matchedEq && onOpenEquipmentDetail && (
                            <button
                              onClick={() => onOpenEquipmentDetail(matchedEq)}
                              className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>شناسنامه فنی</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-stone-50 dark:bg-stone-950 rounded-xl border border-dashed border-stone-300 dark:border-stone-800 text-stone-400 text-xs">
                    تجهیزات خاصی برای این پروتکل تعریف نشده است.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-400 text-sm">
              لطفاً یک آزمایش را از ستون کناری انتخاب نمایید.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
