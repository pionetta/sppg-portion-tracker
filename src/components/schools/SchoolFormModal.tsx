import React, { useState, useEffect } from 'react';
import { School, DistributionPeriod } from '../../types';
import { ClayButton } from '../common/ClayButton';
import { ClayInput } from '../common/ClayInput';
import { X } from 'lucide-react';

interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    level: string;
    default_portions: number;
    distribution_period: DistributionPeriod;
    notes?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  initialData?: School | null;
}

export const SchoolFormModal: React.FC<SchoolFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('SD');
  const [defaultPortions, setDefaultPortions] = useState<number>(100);
  const [period, setPeriod] = useState<DistributionPeriod>('Pagi');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLevel(initialData.level);
      setDefaultPortions(initialData.default_portions);
      setPeriod(initialData.distribution_period);
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setLevel('SD');
      setDefaultPortions(100);
      setPeriod('Pagi');
      setNotes('');
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama sekolah wajib diisi');
      return;
    }
    if (defaultPortions < 0) {
      setError('Jumlah porsi tidak boleh negatif');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await onSubmit({
      name: name.trim(),
      level,
      default_portions: Number(defaultPortions) || 0,
      distribution_period: period,
      notes: notes.trim(),
    });

    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Gagal menyimpan data');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="clay-card-prominent p-6 relative bg-white/95 backdrop-blur-md border border-white/60">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(99,102,241,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.4)]">
              <span className="text-lg font-black">{initialData ? '✏️' : '🏫'}</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight">
                {initialData ? 'Edit Master Sekolah' : 'Tambah Master Sekolah'}
              </h2>
              <p className="text-xs text-slate-500">
                Porsi standar untuk alokasi pengantaran harian.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <ClayInput
              label="Nama Sekolah"
              placeholder="Contoh: SD Negeri 01 Pagi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 px-0.5">Jenjang</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="clay-input px-3 py-2.5 text-sm bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-300 outline-none"
                >
                  <option value="PAUD/TK">PAUD / TK</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA/SMK">SMA / SMK</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 px-0.5">
                  Periode Distribusi
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as DistributionPeriod)}
                  className="clay-input px-3 py-2.5 text-sm bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-300 outline-none"
                >
                  <option value="Pagi">Pagi</option>
                  <option value="Siang">Siang</option>
                  <option value="Keduanya">Keduanya (Pagi & Siang)</option>
                </select>
              </div>
            </div>

            <ClayInput
              label="Jumlah Porsi Default"
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="100"
              value={defaultPortions}
              onChange={(e) => setDefaultPortions(Math.max(0, parseInt(e.target.value) || 0))}
              helperText="Jumlah porsi acuan standar setiap hari kerja."
            />

            <ClayInput
              label="Catatan / Keterangan (Opsional)"
              placeholder="Contoh: Gedung A, Pintu gerbang timur"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl shadow-sm">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <ClayButton type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Batal
              </ClayButton>
              <ClayButton type="submit" variant="primary" isLoading={isSubmitting}>
                {initialData ? 'Simpan Perubahan' : 'Tambah Sekolah'}
              </ClayButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
