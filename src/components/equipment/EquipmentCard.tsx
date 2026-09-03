import React from 'react';
import {
  LaboratoryEquipment,
  EQUIPMENT_CATEGORIES,
  CALIBRATION_STATUS_META
} from '../../types/laboratoryEquipment';
import {
  Scale,
  Flame,
  FlameKindling,
  Activity,
  Waves,
  RotateCw,
  ThermometerSun,
  ShieldAlert,
  Pipette,
  Wind,
  Box,
  Search,
  Droplet,
  Cpu,
  Microscope,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  Check
} from 'lucide-react';

interface EquipmentCardProps {
  equipment: LaboratoryEquipment;
  onViewDetails: (equipment: LaboratoryEquipment) => void;
  onEdit?: (equipment: LaboratoryEquipment) => void;
  onDelete?: (equipment: LaboratoryEquipment) => void;
  onInspectExperimentLink?: (equipment: LaboratoryEquipment) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  balance: <Scale className="w-5 h-5" />,
  oven: <Flame className="w-5 h-5" />,
  muffle_furnace: <FlameKindling className="w-5 h-5" />,
  ph_meter: <Activity className="w-5 h-5" />,
  spectrophotometer: <Waves className="w-5 h-5" />,
  centrifuge: <RotateCw className="w-5 h-5" />,
  incubator: <ThermometerSun className="w-5 h-5" />,
  autoclave: <ShieldAlert className="w-5 h-5" />,
  burette: <Pipette className="w-5 h-5" />,
  pipette: <Pipette className="w-5 h-5" />,
  hood: <Wind className="w-5 h-5" />,
  desiccator: <Box className="w-5 h-5" />,
  refractometer: <Search className="w-5 h-5" />,
  viscometer: <Droplet className="w-5 h-5" />,
  texture_analyzer: <Cpu className="w-5 h-5" />,
  microbiology_equipment: <Microscope className="w-5 h-5" />,
  general_lab_equipment: <Wrench className="w-5 h-5" />
};

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  onViewDetails,
  onEdit,
  onDelete,
  onInspectExperimentLink
}) => {
  const categoryMeta = EQUIPMENT_CATEGORIES[equipment.category] || {
    titleFa: equipment.category,
    titleEn: 'Equipment',
    badgeColor: 'bg-stone-100 text-stone-700',
    color: '#78716c',
    iconName: 'Wrench'
  };

  const statusMeta = CALIBRATION_STATUS_META[equipment.calibrationStatus] || {
    labelFa: equipment.calibrationStatus,
    badgeColor: 'bg-stone-100 text-stone-700'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
      case 'calibrated_in_house':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'expiring_soon':
        return <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'expired':
        return <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      default:
        return <Check className="w-3.5 h-3.5 text-stone-500" />;
    }
  };

  const specs = equipment.specifications;
  const hasSpecifics = Boolean(
    specs && (specs.accuracy || specs.capacity || specs.measurementRange || specs.resolution)
  );

  return (
    <div
      id={`equipment-card-${equipment.id}`}
      className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 p-5 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between group"
    >
      <div>
        {/* Top Header: Category & Code */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="p-2 rounded-lg text-white"
              style={{ backgroundColor: categoryMeta.color }}
            >
              {CATEGORY_ICONS[equipment.category] || <Wrench className="w-5 h-5" />}
            </span>
            <div>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block">
                {categoryMeta.titleFa}
              </span>
              <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
                {equipment.code}
              </span>
            </div>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-md font-medium border flex items-center gap-1.5 ${statusMeta.badgeColor}`}
          >
            {getStatusIcon(equipment.calibrationStatus)}
            {statusMeta.labelFa}
          </span>
        </div>

        {/* Title */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {equipment.nameFa}
          </h3>
          <p className="text-xs font-sans text-stone-400 dark:text-stone-500 truncate mt-0.5" dir="ltr">
            {equipment.nameEn}
          </p>
        </div>

        {/* Location & Model */}
        {(equipment.location || equipment.model) && (
          <div className="flex flex-wrap gap-2 mb-3 text-xs text-stone-600 dark:text-stone-400">
            {equipment.location && (
              <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                📍 {equipment.location}
              </span>
            )}
            {equipment.model && (
              <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300 font-mono text-[11px]">
                مدل: {equipment.model}
              </span>
            )}
          </div>
        )}

        {/* Key Specs Box */}
        <div className="bg-stone-50 dark:bg-stone-950/60 rounded-lg p-2.5 mb-3 border border-stone-200/60 dark:border-stone-800/80 text-xs space-y-1.5">
          {hasSpecifics ? (
            <>
              {specs.accuracy && (
                <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                  <span className="text-stone-500 dark:text-stone-400">دقت / عدم قطعیت:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{specs.accuracy}</span>
                </div>
              )}
              {specs.capacity && (
                <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                  <span className="text-stone-500 dark:text-stone-400">ظرفیت:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">{specs.capacity}</span>
                </div>
              )}
              {specs.measurementRange && (
                <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                  <span className="text-stone-500 dark:text-stone-400">محدوده اندازه‌گیری:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">{specs.measurementRange}</span>
                </div>
              )}
              {specs.resolution && (
                <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                  <span className="text-stone-500 dark:text-stone-400">تفکیک‌پذیری:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">{specs.resolution}</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-1 text-stone-400 dark:text-stone-500 italic text-[11px]">
              مشخصات عمومی بر مبنای استاندارد روش آزمون
            </div>
          )}
        </div>

        {/* Applications preview */}
        {equipment.applications && equipment.applications.length > 0 && (
          <div className="mb-3">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block mb-1">
              کاربردها در آزمون:
            </span>
            <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-1">
              {equipment.applications.slice(0, 2).map((app, idx) => (
                <li key={idx} className="line-clamp-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Linked Experiments Tag */}
        {equipment.associatedExperimentCodes && equipment.associatedExperimentCodes.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 mb-3">
            <span>آزمایش‌های متصل:</span>
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              {equipment.associatedExperimentCodes.length} آزمون
            </span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
        <button
          id={`view-details-${equipment.id}`}
          onClick={() => onViewDetails(equipment)}
          className="flex-1 py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>شناسنامه فنی و کاربری</span>
        </button>

        {onInspectExperimentLink && (
          <button
            id={`inspect-link-${equipment.id}`}
            onClick={() => onInspectExperimentLink(equipment)}
            title="انطباق با آزمایش‌ها"
            className="p-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs transition-colors"
          >
            <Activity className="w-4 h-4" />
          </button>
        )}

        {onEdit && (
          <button
            id={`edit-eq-${equipment.id}`}
            onClick={() => onEdit(equipment)}
            title="ویرایش مشخصات"
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-lg text-xs transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}

        {onDelete && (
          <button
            id={`delete-eq-${equipment.id}`}
            onClick={() => onDelete(equipment)}
            title="حذف دستگاه"
            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
