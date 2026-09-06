import React, { useState } from 'react';
import type { MenuCategory, Menu } from '../../types';
import { ClayInput } from '../common/ClayInput';
import { X, Utensils } from 'lucide-react';

interface AddDailyMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterMenus: Menu[];
  defaultTarget: number;
  onAddMenu: (data: {
    name: string;
    category: MenuCategory;
    target_portions: number;
    menu_id?: string;
    notes?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export const AddDailyMenuModal: React.FC<AddDailyMenuModalProps> = ({
  isOpen,
  onClose,
  masterMenus,
  defaultTarget,
  onAddMenu,
}) => {
  const [selectedMasterId, setSelectedMasterId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<MenuCategory>('Makanan Pokok');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectMaster = (masterId: string) => {
    setSelectedMasterId(masterId);
    if (masterId) {
      const found = masterMenus.find((m) => m.id === masterId);
      if (found) {
        setName(found.name);
        setCategory(found.category_name || found.category);
        setNotes(found.notes || '');
      }
    } else {
      setName('');
      setCategory('Makanan Pokok');
      setNotes('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama menu wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Menu automatically inherits the daily production target!
    const res = await onAddMenu({
      name: name.trim(),
      category,
      target_portions: defaultTarget,
      menu_id: selectedMasterId || undefined,
      notes: notes.trim(),
    });

    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Gagal menambahkan menu');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-6 relative max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-slate-200/90 shadow-[0_24px_50px_-12px_rgba(15,23,42,0.25),inset_0_2.5px_4px_#fff,inset_0_-4px_8px_rgba(15,23,42,0.04)]">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-50 text-neutral-400 hover:text-neutral-700 flex items-center justify-center absolute top-5 right-5 border border-slate-200/60 shadow-[inset_0_1px_1px_#fff] active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-[inset_0_1.5px_2px_#fff] shrink-0">
              <Utensils className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#111111] tracking-tight">
                Tambah Menu Hari Ini
              </h2>
              <p className="text-xs text-[#666666] font-medium mt-0.5">
                Target otomatis mewarisi target harian (<strong>{defaultTarget} porsi</strong>)
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {masterMenus.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5 uppercase tracking-wider">
                  Pilih dari Master Menu
                </label>
                <select
                  value={selectedMasterId}
                  onChange={(e) => handleSelectMaster(e.target.value)}
                  className="rounded-2xl border border-slate-200/90 bg-[#EDEFF5] px-3.5 py-3 text-sm font-bold text-slate-800 shadow-[inset_0_2px_4px_rgba(15,23,42,0.06),inset_0_-1px_1px_#fff] focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                >
                  <option value="">-- Ketik Menu Baru / Kustom --</option>
                  {masterMenus.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.category_name || m.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <ClayInput
              label="Nama Komponen Makanan"
              placeholder="Contoh: Nasi Putih Pulen / Ayam Goreng"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#111111] px-0.5 uppercase tracking-wider">
                Kategori Komponen
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MenuCategory)}
                className="rounded-2xl border border-slate-200/90 bg-[#EDEFF5] px-3.5 py-3 text-sm font-bold text-slate-800 shadow-[inset_0_2px_4px_rgba(15,23,42,0.06),inset_0_-1px_1px_#fff] focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
              >
                <option value="Makanan Pokok">1. Makanan Pokok</option>
                <option value="Protein Hewani">2. Protein Hewani</option>
                <option value="Protein Nabati">3. Protein Nabati</option>
                <option value="Sayur">4. Sayur</option>
                <option value="Buah">5. Buah</option>
                <option value="Pelengkap">6. Pelengkap</option>
                <option value="Lainnya">7. Lainnya</option>
              </select>
            </div>

            <ClayInput
              label="Catatan Menu (Opsional)"
              placeholder="Contoh: Potongan besar, tanpa kuah"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="p-3.5 bg-[#EDEFF5] rounded-2xl border border-slate-200/90 shadow-[inset_0_2px_4px_rgba(15,23,42,0.06),inset_0_-1px_1px_#fff] text-xs text-slate-700 font-medium">
              Target porsi menu: <strong className="text-indigo-700 font-black">{defaultTarget} porsi</strong> (otomatis diselaraskan dengan target produksi harian).
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-bold">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl border border-slate-200/90 font-bold text-xs shadow-[0_4px_12px_-2px_rgba(15,23,42,0.06),inset_0_1.5px_2px_#fff,inset_0_-2px_3px_rgba(15,23,42,0.02)] active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs shadow-[0_8px_20px_-2px_rgba(99,102,241,0.45),inset_0_2px_3px_rgba(255,255,255,0.35),inset_0_-2.5px_3.5px_rgba(0,0,0,0.18)] active:scale-95 transition-all cursor-pointer"
              >
                Tambah ke Menu Hari Ini
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
