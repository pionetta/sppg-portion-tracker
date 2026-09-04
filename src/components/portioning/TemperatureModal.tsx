import React, { useState, useEffect } from 'react';
import type { ContainerWithTemperatures, DailyMenuWithContainers, SOPSettings } from '../../types';
import { sopRepository } from '../../repositories/sopRepository';
import { ClayCard } from '../common/ClayCard';
import { ClayButton } from '../common/ClayButton';
import { ClayInput } from '../common/ClayInput';
import { Badge } from '../common/Badge';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-150">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <ClayCard className="p-5 sm:p-6 relative max-h-[90vh] flex flex-col border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#111111]">
                  Suhu Wadah #{container.container_number}
                </h2>
                <Badge variant="primary" size="sm">
                  {menu.name}
                </Badge>
              </div>
              <p className="text-xs text-[#666666]">
                Porsi Wadah Ini: <strong className="text-neutral-800">{container.used_portions} porsi</strong> (Kumulatif: {container.cumulative_portions})
              </p>
            </div>
          </div>

          {/* Form to Add New Temperature */}
          <form onSubmit={handleSubmit} className="mt-4 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
            <div className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              Catat Pengukuran Baru
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
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <ClayButton
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Plus className="w-4 h-4" />}
              className="w-full"
            >
              Simpan Pengukuran Suhu
            </ClayButton>
          </form>

          {/* Existing Temperature History */}
          <div className="mt-4 flex-1 overflow-y-auto min-h-[120px]">
            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Riwayat Pengukuran Suhu ({container.temperatures.length})
            </div>

            {container.temperatures.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400 bg-white rounded-xl border border-dashed border-neutral-200">
                Belum ada catatan suhu untuk wadah ini
              </div>
            ) : (
              <div className="space-y-2">
                {container.temperatures.map((temp) => {
                  const isCompliant = checkCompliance(temp.temperature);

                  return (
                    <div
                      key={temp.id}
                      className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl text-xs font-black flex items-center gap-1 ${
                            isCompliant
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <Thermometer className="w-3.5 h-3.5" />
                          <span>{temp.temperature.toFixed(1)}°C</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 flex-wrap">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>{temp.measured_at} WIB</span>
                            {isCompliant ? (
                              <Badge variant="success" size="sm">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Sesuai batas konfigurasi
                              </Badge>
                            ) : (
                              <Badge variant="warning" size="sm">
                                <AlertTriangle className="w-2.5 h-2.5" /> Di luar batas konfigurasi
                              </Badge>
                            )}
                          </div>
                          {temp.notes && (
                            <p className="text-[11px] text-neutral-500 mt-0.5">{temp.notes}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteTemp(temp.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Hapus Pengukuran"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end">
            <ClayButton variant="secondary" onClick={onClose} size="sm">
              Tutup
            </ClayButton>
          </div>
        </ClayCard>
      </div>
    </div>
  );
};
