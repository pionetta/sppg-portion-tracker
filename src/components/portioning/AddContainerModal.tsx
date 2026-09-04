import React, { useState, useEffect } from 'react';
import { DailyMenuWithContainers } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { ClayButton } from '../common/ClayButton';
import { ClayInput } from '../common/ClayInput';
import { Badge } from '../common/Badge';
import { calculateDualContainerSplit } from '../../services/portionCalcService';
import { X, Plus, PackagePlus, Split, Layers } from 'lucide-react';

interface AddContainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: DailyMenuWithContainers | null;
  initialContainerCount?: 1 | 2;
  onContainerCountChange?: (count: 1 | 2) => void;
  onAddContainer: (
    dailyMenuId: string,
    cumulative: number,
    notes?: string,
    containerCount?: 1 | 2
  ) => Promise<{ success: boolean; error?: string }>;
}

export const AddContainerModal: React.FC<AddContainerModalProps> = ({
  isOpen,
  onClose,
  menu,
  initialContainerCount = 1,
  onContainerCountChange,
  onAddContainer,
}) => {
  const nextContainerNumber = (menu?.containers.length || 0) + 1;
  const lastCumulative = menu?.total_actual_portions || 0;

  // Detect if menu is staple food / rice
  const isStapleRice = Boolean(
    menu &&
      (menu.category === 'Makanan Pokok' ||
        menu.category_name === 'Makanan Pokok' ||
        menu.name.toLowerCase().includes('nasi'))
  );

  const [containerCount, setContainerCount] = useState<1 | 2>(initialContainerCount);
  const [cumulative, setCumulative] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync containerCount whenever modal opens or initialContainerCount changes
  useEffect(() => {
    if (isOpen) {
      setContainerCount(initialContainerCount);
      setError(null);
    }
  }, [isOpen, initialContainerCount]);

  if (!isOpen || !menu) return null;

  const numCumulative = parseInt(cumulative) || 0;
  const totalIncrement = Math.max(0, numCumulative - lastCumulative);
  const dualSplit = calculateDualContainerSplit(totalIncrement, lastCumulative);

  const handleToggleContainerCount = (count: 1 | 2) => {
    setContainerCount(count);
    onContainerCountChange?.(count);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cumulative || isNaN(numCumulative)) {
      setError('Masukkan angka porsi kumulatif');
      return;
    }

    if (numCumulative < lastCumulative) {
      setError('Jumlah porsi kumulatif tidak boleh lebih kecil dari pencatatan sebelumnya.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await onAddContainer(menu.id, numCumulative, notes.trim(), containerCount);
    setIsSubmitting(false);

    if (res.success) {
      setCumulative('');
      setNotes('');
      // Do not reset containerCount to 1, preserve the user's 2-wadah mode!
      onClose();
    } else {
      setError(res.error || 'Gagal menambahkan wadah');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-150">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <ClayCard className="p-5 sm:p-6 relative border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#111111]">
                  {containerCount === 2
                    ? `Tambah 2 Wadah Sekaligus (${nextContainerNumber} & ${nextContainerNumber + 1})`
                    : `Tambah Wadah ${nextContainerNumber}`}
                </h2>
                <Badge variant="primary" size="sm">
                  {menu.name}
                </Badge>
              </div>
              <p className="text-xs text-[#666666]">
                Target: <strong>{menu.target_portions} porsi</strong> | Kumulatif sebelumnya: <strong>{lastCumulative} porsi</strong>
              </p>
            </div>
          </div>

          {/* Option for 1 Container vs 2 Containers (Special for Makanan Pokok / Nasi) */}
          {isStapleRice && (
            <div className="mt-4 p-3 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Split className="w-3.5 h-3.5 text-amber-600" />
                  Mode Pengisian Nasi / Makanan Pokok:
                </span>
                {containerCount === 2 && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-200/80 text-amber-950 font-bold rounded-full">
                    Hasil Dibagi 2
                  </span>
                )}
              </div>

              {/* Segmented Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-amber-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleToggleContainerCount(1)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    containerCount === 1
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  1 Wadah
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleContainerCount(2)}
                  className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    containerCount === 2
                      ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400/30'
                      : 'text-neutral-600 hover:text-indigo-700 hover:bg-indigo-50/50'
                  }`}
                >
                  <Split className="w-3 h-3" />
                  2 Wadah (Dibagi 2)
                </button>
              </div>

              {containerCount === 2 && (
                <p className="text-[11px] text-amber-900/90 leading-tight">
                  Angka porsi yang dicapai akan <strong>otomatis dibagi dua rata</strong> ke Wadah {nextContainerNumber} dan Wadah {nextContainerNumber + 1}.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <ClayInput
              label={
                containerCount === 2
                  ? `Porsi Kumulatif Setelah Wadah ${nextContainerNumber} & ${nextContainerNumber + 1} Terisi`
                  : `Porsi Kumulatif Sampai Wadah ${nextContainerNumber}`
              }
              type="number"
              inputMode="numeric"
              min={lastCumulative}
              placeholder={`Contoh: ${lastCumulative + (containerCount === 2 ? 600 : 300)}`}
              value={cumulative}
              onChange={(e) => {
                setCumulative(e.target.value);
                setError(null);
              }}
              helperText={
                containerCount === 2
                  ? `Masukkan angka porsi kumulatif total yang sudah tercapai sampai wadah kedua ini (akan otomatis dibagi dua).`
                  : `Masukkan total porsi yang sudah tercapai sampai wadah ini.`
              }
              autoFocus
              required
            />

            {/* Live Calculation Preview Box */}
            {cumulative && !isNaN(numCumulative) && numCumulative >= lastCumulative && (
              containerCount === 2 ? (
                /* Dual Container Split Preview */
                <div className="p-3.5 bg-indigo-50/50 border border-indigo-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                      <Split className="w-3.5 h-3.5 text-indigo-600" />
                      Hasil Pembagian 2 Wadah:
                    </span>
                    <span className="text-xs font-black text-indigo-700">
                      +{totalIncrement} porsi total
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Container 1 Preview */}
                    <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                      <div className="text-[11px] font-bold text-neutral-600">
                        Wadah {nextContainerNumber} (1/2)
                      </div>
                      <div className="text-lg font-black text-indigo-700 mt-0.5 tabular-nums">
                        +{dualSplit.container1.used_portions} <span className="text-[10px] font-semibold text-neutral-500">porsi</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        Kumulatif: {dualSplit.container1.cumulative_portions}
                      </div>
                    </div>

                    {/* Container 2 Preview */}
                    <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                      <div className="text-[11px] font-bold text-neutral-600">
                        Wadah {nextContainerNumber + 1} (2/2)
                      </div>
                      <div className="text-lg font-black text-indigo-700 mt-0.5">
                        +{dualSplit.container2.used_portions} <span className="text-[10px] font-semibold text-neutral-500">porsi</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        Kumulatif: {dualSplit.container2.cumulative_portions}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Single Container Preview */
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-indigo-800">
                      Pemakaian Wadah {nextContainerNumber}:
                    </div>
                    <div className="text-xs text-indigo-600 mt-0.5">
                      {lastCumulative} → {numCumulative}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-indigo-600">
                      +{totalIncrement}
                    </div>
                    <div className="text-[11px] font-semibold text-indigo-700">porsi terisi</div>
                  </div>
                </div>
              )
            )}

            <ClayInput
              label="Catatan Wadah (Opsional)"
              placeholder={containerCount === 2 ? 'Contoh: Nasi Kloter 1 (2 Termos)' : 'Contoh: Termos 1, Kloter pertama'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <ClayButton type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Batal
              </ClayButton>
              <ClayButton
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                {containerCount === 2 ? 'Simpan 2 Wadah Sekaligus' : 'Simpan Wadah'}
              </ClayButton>
            </div>
          </form>
        </ClayCard>
      </div>
    </div>
  );
};
