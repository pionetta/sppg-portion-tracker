import React, { useState, useEffect } from 'react';
import type { ContainerWithTemperatures, DailyMenuWithContainers, SOPSettings } from '../../types';
import { sopRepository } from '../../repositories/sopRepository';
import { ClayInput } from '../common/ClayInput';
import { X, Thermometer, Plus, Trash2, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface TemperatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  container: ContainerWithTemperatures | null;
  menu: DailyMenuWithContainers | null;
  onAddTemp: (containerId: string, temp: number, time: string, notes?: string) => Promise<any>;
  onDeleteTemp: (tempId: string) => Promise<any>;
}

export const TemperatureModal: React.FC<TemperatureModalProps> = ({
  isOpen,
  onClose,
  container,
  menu,
  onAddTemp,
  onDeleteTemp,
}) => {
  const [temperature, setTemperature] = useState<string>('72.0');
  const [time, setTime] = useState<string>(() => format(new Date(), 'HH:mm'));
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sop, setSop] = useState<SOPSettings | null>(null);

  useEffect(() => {
    if (isOpen) {
      sopRepository.getSettings().then(setSop);
    }
  }, [isOpen]);

  if (!isOpen || !container || !menu) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tempNum = parseFloat(temperature);
    if (isNaN(tempNum)) {
      setError('Masukkan angka suhu yang valid');
      return;
    }
    if (!time) {
      setError('Waktu pengukuran wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await onAddTemp(container.id, tempNum, time, notes.trim());
    setIsSubmitting(false);

    if (res.success) {
      setNotes('');
    } else {
      setError(res.error || 'Gagal menyimpan suhu');
    }
  };

  const categoryName = menu.category_name || menu.category || '';
  const isColdDish = categoryName.toLowerCase().includes('buah') || categoryName.toLowerCase().includes('dingin');

  const checkCompliance = (tempVal: number) => {
    if (!sop) return true;
    if (isColdDish) {
      return tempVal <= (sop.max_cold_temp || 10.0);
    }
    return tempVal >= sop.min_hot_temp;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-6 relative max-h-[90vh] flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-[0_24px_50px_-12px_rgba(15,23,42,0.25),inset_0_2.5px_4px_#fff,inset_0_-4px_8px_rgba(15,23,42,0.04)]">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-50 text-neutral-400 hover:text-neutral-700 flex items-center justify-center absolute top-5 right-5 border border-slate-200/60 shadow-[inset_0_1px_1px_#fff] active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-[inset_0_1.5px_2px_#fff] shrink-0">
              <Thermometer className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-[#111111] tracking-tight">
                  Suhu Wadah #{container.container_number}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-[inset_0_1px_1.5px_#fff]">
                  {menu.name}
                </span>
              </div>
              <p className="text-xs text-[#666666] font-medium mt-0.5">
                Porsi Wadah Ini: <strong className="text-slate-800">{container.used_portions} porsi</strong> (Kumulatif: {container.cumulative_portions})
              </p>
            </div>
          </div>

          {/* Form to Add New Temperature — Sunken Clay Well */}
          <form onSubmit={handleSubmit} className="mt-4 p-4 bg-[#EDEFF5] rounded-2xl border border-slate-200/90 shadow-[inset_0_2px_4px_rgba(15,23,42,0.06),inset_0_-1px_1px_#fff] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Catat Pengukuran Baru
              </span>
              {/* Quick temp chips */}
              <div className="flex items-center gap-1">
                {[65, 70, 75].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTemperature(`${preset}.0`)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-white text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                  >
                    {preset}°C
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ClayInput
                label="Suhu (°C)"
                type="number"
                step="0.1"
                inputMode="decimal"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="72.0"
                required
              />
              <ClayInput
                label="Jam Pengukuran"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <ClayInput
              label="Keterangan / Catatan Suhu"
              placeholder="Contoh: Suhu saat selesai pemorsian"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_8px_20px_-2px_rgba(99,102,241,0.45),inset_0_2px_3px_rgba(255,255,255,0.35),inset_0_-2.5px_3.5px_rgba(0,0,0,0.18)] active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Simpan Pengukuran Suhu</span>
            </button>
          </form>

          {/* Existing Temperature History */}
          <div className="mt-4 flex-1 overflow-y-auto min-h-[110px] space-y-2">
            <div className="text-xs font-black text-[#666666] uppercase tracking-wider">
              Riwayat Pengukuran Suhu ({container.temperatures.length})
            </div>

            {container.temperatures.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 font-medium">
                Belum ada catatan suhu untuk wadah ini
              </div>
            ) : (
              <div className="space-y-2">
                {container.temperatures.map((temp) => {
                  const isCompliant = checkCompliance(temp.temperature);

                  return (
                    <div
                      key={temp.id}
                      className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_12px_-2px_rgba(15,23,42,0.06),inset_0_1.5px_2px_#fff] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border ${
                            isCompliant
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-[inset_0_1px_1px_#fff]'
                              : 'bg-amber-50 text-amber-900 border-amber-200 shadow-[inset_0_1px_1px_#fff]'
                          }`}
                        >
                          <Thermometer className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{temp.temperature.toFixed(1)}°C</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 flex-wrap">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>{temp.measured_at} WIB</span>
                            {isCompliant ? (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Sesuai SOP
                              </span>
                            ) : (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" /> Di luar batas SOP
                              </span>
                            )}
                          </div>
                          {temp.notes && (
                            <p className="text-[11px] text-[#666666] font-medium mt-0.5">{temp.notes}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteTemp(temp.id)}
                        className="w-7 h-7 rounded-xl bg-slate-50 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border border-slate-200/60 shadow-[inset_0_1px_1px_#fff] active:scale-95 transition-all cursor-pointer"
                        title="Hapus Pengukuran"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl border border-slate-200/90 font-bold text-xs shadow-[0_4px_12px_-2px_rgba(15,23,42,0.06),inset_0_1.5px_2px_#fff,inset_0_-2px_3px_rgba(15,23,42,0.02)] active:scale-95 transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
