import React, { useState } from 'react';
import type { MenuCategory, Menu } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { ClayButton } from '../common/ClayButton';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-150">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <ClayCard className="p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111111]">Tambah Menu Hari Ini</h2>
              <p className="text-xs text-[#666666]">
                Target menu otomatis mewarisi target harian ({defaultTarget} porsi)
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {masterMenus.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#111111] px-0.5">
                  Pilih dari Master Menu
                </label>
                <select
                  value={selectedMasterId}
                  onChange={(e) => handleSelectMaster(e.target.value)}
                  className="clay-input px-3 py-2.5 text-sm bg-[#FAFAFA]"
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
              <label className="text-xs font-semibold text-[#111111] px-0.5">
                Kategori Komponen
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MenuCategory)}
                className="clay-input px-3 py-2.5 text-sm bg-[#FAFAFA]"
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

            <div className="p-3 bg-neutral-100 rounded-xl text-xs text-neutral-600">
              Target porsi menu: <strong>{defaultTarget} porsi</strong> (otomatis diselaraskan dengan target produksi hari ini).
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <ClayButton type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Batal
              </ClayButton>
              <ClayButton type="submit" variant="primary" isLoading={isSubmitting}>
                Tambah ke Menu Hari Ini
              </ClayButton>
            </div>
          </form>
        </ClayCard>
      </div>
    </div>
  );
};
