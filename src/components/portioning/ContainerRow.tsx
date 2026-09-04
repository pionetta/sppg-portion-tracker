import React, { useState } from 'react';
import type { ContainerWithTemperatures, DailyMenuWithContainers } from '../../types';
import { Badge } from '../common/Badge';
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
    <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_14px_-2px_rgba(15,23,42,0.06),inset_0_1.5px_2px_#fff,inset_0_-2px_3px_rgba(15,23,42,0.02)] hover:border-indigo-300 transition-all flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Container Title & Notes */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-xs shrink-0">
            W{container.container_number}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-[#111111] flex items-center gap-1.5">
              <span>Wadah {container.container_number}</span>
              {container.notes && (
                <span className="text-xs font-normal text-neutral-500 truncate max-w-[120px]">
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
            onClick={() => onOpenTemperatureModal(container)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all active:scale-95 ${
              container.temperatures.length > 0
                ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
            }`}
            title="Catat / Lihat Suhu Wadah"
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {latestTemp ? `${latestTemp.temperature}°C` : '+ Suhu'}
            </span>
            {container.temperatures.length > 1 && (
              <span className="text-[10px] bg-amber-200/60 px-1 rounded-full">
                {container.temperatures.length}
              </span>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDeleteContainer(container.id)}
            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Hapus Wadah"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cumulative and Used portions calculation display */}
      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-3">
        {/* Cumulative Input / Display */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                inputMode="numeric"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-20 px-2 py-1 text-sm bg-neutral-50 border border-indigo-500 rounded-lg focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-neutral-500 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-neutral-500 font-medium">Porsi Kumulatif:</span>
              <button
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-1 font-bold text-sm text-[#111111] hover:text-indigo-600 underline-offset-2 hover:underline cursor-pointer"
                title="Klik untuk mengubah nilai kumulatif"
              >
                <span className="tabular-nums">{container.cumulative_portions}</span>
                <Edit2 className="w-3 h-3 text-neutral-400 group-hover:text-indigo-600" />
              </button>
            </div>
          )}
        </div>

        {/* Pemakaian Wadah Ini Badge (Calculated) per DESIGN.md Section 39 */}
        <div className="text-right">
          <Badge variant="success" size="md" className="font-semibold tabular-nums">
            Pemakaian Wadah Ini: {container.used_portions}
          </Badge>
        </div>
      </div>

      {inlineError && (
        <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{inlineError}</span>
        </div>
      )}
    </div>
  );
};
