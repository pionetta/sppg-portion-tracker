import React, { useState, useEffect } from 'react';
import { sopRepository } from '../../repositories/sopRepository';
import type { SOPSettings } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { ClayButton } from '../common/ClayButton';
import { ClayInput } from '../common/ClayInput';
import { useToast } from '../common/ToastContext';
import { X, ShieldCheck } from 'lucide-react';

interface SOPSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOPSettingsModal: React.FC<SOPSettingsModalProps> = ({ isOpen, onClose }) => {
  const [minHotTemp, setMinHotTemp] = useState<string>('60.0');
  const [maxColdTemp, setMaxColdTemp] = useState<string>('10.0');
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      sopRepository.getSettings().then((sop: SOPSettings) => {
        setMinHotTemp(sop.min_hot_temp.toString());
        setMaxColdTemp((sop.max_cold_temp || 10.0).toString());
        setNotes(sop.notes || '');
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await sopRepository.updateSettings({
        min_hot_temp: parseFloat(minHotTemp) || 60.0,
        max_cold_temp: parseFloat(maxColdTemp) || 10.0,
        notes: notes.trim(),
      });
      showToast('Konfigurasi batas SOP suhu berhasil disimpan', 'success');
      onClose();
    } catch {
      showToast('Gagal menyimpan SOP', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-150">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <ClayCard className="p-5 sm:p-6 relative border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111111]">Konfigurasi SOP Suhu SPPG</h2>
              <p className="text-xs text-[#666666]">
                Batas ambang suhu keamanan pangan saat distribusi
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <ClayInput
                label="Min Suhu Makanan Panas (°C)"
                type="number"
                step="0.5"
                value={minHotTemp}
                onChange={(e) => setMinHotTemp(e.target.value)}
                helperText="Standar SPPG ≥ 60°C"
                required
              />

              <ClayInput
                label="Max Suhu Makanan Dingin (°C)"
                type="number"
                step="0.5"
                value={maxColdTemp}
                onChange={(e) => setMaxColdTemp(e.target.value)}
                helperText="Standar SPPG ≤ 10°C"
                required
              />
            </div>

            <ClayInput
              label="Keterangan / Rujukan SOP"
              placeholder="Contoh: Peraturan Standar Higiene Sanitasi SPPG"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <ClayButton type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
                Tutup
              </ClayButton>
              <ClayButton type="submit" variant="primary" isLoading={isSaving}>
                Simpan Konfigurasi
              </ClayButton>
            </div>
          </form>
        </ClayCard>
      </div>
    </div>
  );
};
