import React from 'react';
import { appConfirm } from '../common/DialogProvider';
import { 
  Database, 
  Plus, 
  Trash2, 
  Check, 
  FileSpreadsheet, 
  BookOpen, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { StatisticalDataset } from '../../types/statistics';

interface DatasetSelectorProps {
  datasets: StatisticalDataset[];
  selectedDatasetId: string;
  onSelectDataset: (id: string) => void;
  onCreateNew: () => void;
  onDeleteDataset: (id: string) => void;
  onLoadSample: (sampleId: string) => void;
}

export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  datasets,
  selectedDatasetId,
  onSelectDataset,
  onCreateNew,
  onDeleteDataset,
  onLoadSample
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-800">دیتاست‌های فعال و طرح‌های آزمایشی</h2>
          <span className="text-xs text-slate-400">({datasets.length} پروژه)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            تعریف دیتاست جدید
          </button>
        </div>
      </div>

      {/* Dataset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {datasets.map((ds) => {
          const isSelected = ds.id === selectedDatasetId;
          const totalReps = ds.groups.reduce((acc, g) => acc + g.replicates.length, 0);

          return (
            <div
              key={ds.id}
              onClick={() => onSelectDataset(ds.id)}
              className={`p-4 rounded-xl border text-right cursor-pointer transition-all relative group ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-slate-800 line-clamp-1">{ds.title}</span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-1 mb-2.5">
                ماتریس: {ds.foodMatrix}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-100 pt-2">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-sans">
                  {ds.designType === 'crd' ? 'طرح CRD' : ds.designType === 'rcbd' ? 'طرح RCBD' : ds.designType}
                </span>
                <span>{ds.groups.length} تیمار | {totalReps} تکرار</span>
              </div>

              {/* Delete button (if not sample) */}
              {!ds.id.startsWith('sample-') && (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (await appConfirm('آیا از حذف این دیتاست اطمینان دارید؟')) {
                      onDeleteDataset(ds.id);
                    }
                  }}
                  className="absolute top-2 left-2 p-1 text-slate-300 hover:text-rose-600 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  title="حذف دیتاست"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
