import React, { useState } from 'react';
import type { ContainerWithTemperatures, DailyMenuWithContainers } from '../../types';
import { Thermometer, Trash2, Edit2, Check, X, AlertCircle } from 'lucide-react';

interface ContainerRowProps {
  container: ContainerWithTemperatures;
  menu: DailyMenuWithContainers;
  onUpdateCumulative: (containerId: string, newCumulative: number) => Promise<{ success: boolean; error?: string }>;
  onDeleteContainer: (containerId: string) => Promise<any>;
  onOpenTemperatureModal: (container: ContainerWithTemperatures) => void;
}

export const ContainerRow: React.FC<ContainerRowProps> = ({
  container,
  onUpdateCumulative,
  onDeleteContainer,
  onOpenTemperatureModal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(container.cumulative_portions.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const latestTemp = container.temperatures.length > 0 ? container.temperatures[container.temperatures.length - 1] : null;

  const handleSave = async () => {
    const val = parseInt(editValue);
    if (isNaN(val) || val < 0) {
      setInlineError('Porsi harus angka positif');
      return;
    }

    setIsSaving(true);
    setInlineError(null);
    const res = await onUpdateCumulative(container.id, val);
    setIsSaving(false);

    if (res.success) {
      setIsEditing(false);
    } else {
      setInlineError(res.error || 'Gagal memperbarui');
    }
  };

  const handleCancel = () => {
    setEditValue(container.cumulative_portions.toString());
    setInlineError(null);
    setIsEditing(false);
  };

  return (
    <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_18px_-2px_rgba(15,23,42,0.06),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(15,23,42,0.02)] hover:border-indigo-300 transition-all flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Container Title & Notes */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black text-xs border border-slate-200/80 shadow-[inset_0_1.5px_2px_#fff] shrink-0">
            W{container.container_number}
          </div>
          <div className="min-w-0">
            <div className="font-black text-sm text-[#111111] flex items-center gap-1.5">
              <span>Wadah {container.container_number}</span>
              {container.notes && (
                <span className="text-xs font-medium text-neutral-500 truncate max-w-[130px]">
                  • {container.notes}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Temperature button */}
          <button
            type="button"
            onClick={() => onOpenTemperatureModal(container)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all active:scale-95 cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_1.5px_#fff] ${
              container.temperatures.length > 0
                ? 'bg-amber-50 text-amber-900 border-amber-200/90 hover:bg-amber-100'
                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
            }`}
            title="Catat / Lihat Suhu Wadah"
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-600 stroke-[2.2]" />
            <span>
              {latestTemp ? `${latestTemp.temperature}°C` : '+ Suhu'}
            </span>
            {container.temperatures.length > 1 && (
              <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.2 rounded-full font-black">
                {container.temperatures.length}
              </span>
            )}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDeleteContainer(container.id)}
            className="w-8 h-8 rounded-xl bg-slate-50 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200/60 shadow-[inset_0_1px_1px_#fff] active:scale-95 transition-all cursor-pointer"
            title="Hapus Wadah"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cumulative and Used portions calculation display */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Cumulative Input / Display */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-indigo-400 shadow-[0_2px_6px_rgba(99,102,241,0.2),inset_0_1px_2px_#fff]">
              <input
                type="number"
                inputMode="numeric"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-20 px-2 py-1 text-xs font-black bg-slate-50 border border-slate-200 rounded-lg focus:outline-none tabular-nums"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="p-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1 text-neutral-500 hover:bg-neutral-100 rounded-lg active:scale-95 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-neutral-500 font-semibold">Porsi Kumulatif:</span>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-1.5 font-black text-sm text-[#111111] hover:text-indigo-600 px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200/70 shadow-[inset_0_1px_1.5px_#fff] cursor-pointer active:scale-95 transition-all"
                title="Klik untuk mengubah nilai kumulatif"
              >
                <span className="tabular-nums">{container.cumulative_portions}</span>
                <Edit2 className="w-3 h-3 text-neutral-400 group-hover:text-indigo-600 stroke-[2.2]" />
              </button>
            </div>
          )}
        </div>

        {/* Pemakaian Wadah Ini Badge (Calculated) per DESIGN.md Section 39 */}
        <div className="text-right">
          <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-[0_2px_6px_rgba(16,185,129,0.1),inset_0_1px_1.5px_#fff] tabular-nums inline-block">
            Pemakaian: {container.used_portions}
          </span>
        </div>
      </div>

      {inlineError && (
        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{inlineError}</span>
        </div>
      )}
    </div>
  );
};
