import React, { useState, useEffect } from 'react';
import { DailyMenuWithContainers } from '../../types';
import { ClayInput } from '../common/ClayInput';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-6 relative bg-white rounded-3xl border border-slate-200/90 shadow-[0_24px_50px_-12px_rgba(15,23,42,0.25),inset_0_2.5px_4px_#fff,inset_0_-4px_8px_rgba(15,23,42,0.04)]">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-50 text-neutral-400 hover:text-neutral-700 flex items-center justify-center absolute top-5 right-5 border border-slate-200/60 shadow-[inset_0_1px_1px_#fff] active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-[inset_0_1.5px_2px_#fff] shrink-0">
              <PackagePlus className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-[#111111] tracking-tight">
                  {containerCount === 2
                    ? `Tambah 2 Wadah (${nextContainerNumber} & ${nextContainerNumber + 1})`
                    : `Tambah Wadah ${nextContainerNumber}`}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-[inset_0_1px_1.5px_#fff]">
                  {menu.name}
                </span>
              </div>
              <p className="text-xs text-[#666666] font-medium mt-0.5">
                Target: <strong>{menu.target_portions} porsi</strong> | Kumulatif sblm: <strong>{lastCumulative} porsi</strong>
              </p>
            </div>
          </div>

          {/* Option for 1 Container vs 2 Containers (Special for Makanan Pokok / Nasi) */}
          {isStapleRice && (
            <div className="mt-4 p-3.5 bg-[#EDEFF5] border border-slate-200/90 rounded-2xl shadow-[inset_0_2px_4px_rgba(15,23,42,0.06),inset_0_-1px_1px_#fff] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-black text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Split className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                  Mode Pemorsian Nasi:
                </span>
                {containerCount === 2 && (
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-900 font-black rounded-full border border-indigo-200/80 shadow-[inset_0_1px_1px_#fff]">
                    Hasil Dibagi 2
                  </span>
                )}
              </div>

              {/* Segmented Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_1.5px_#fff]">
                <button
                  type="button"
                  onClick={() => handleToggleContainerCount(1)}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    containerCount === 1
                      ? 'bg-slate-800 text-white shadow-[0_2px_6px_rgba(15,23,42,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.2)]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  1 Wadah
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleContainerCount(2)}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    containerCount === 2
                      ? 'bg-indigo-600 text-white shadow-[0_4px_10px_-1px_rgba(99,102,241,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.35)]'
                      : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50'
                  }`}
                >
                  <Split className="w-3.5 h-3.5 stroke-[2.5]" />
                  2 Wadah (Bagi 2)
                </button>
              </div>

              {containerCount === 2 && (
                <p className="text-[11px] text-indigo-950/80 font-medium leading-tight">
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
                /* Dual Container Split Preview - Full Clay */
                <div className="p-3.5 bg-[#EDEFF5] border border-slate-200/90 rounded-2xl shadow-[inset_0_2px_4px_rgba(15,23,42,0.06),inset_0_-1px_1px_#fff] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Split className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                      Hasil Pembagian 2 Wadah:
                    </span>
                    <span className="text-xs font-black text-indigo-700 tabular-nums">
                      +{totalIncrement} porsi total
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Container 1 Preview */}
                    <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_-2px_rgba(15,23,42,0.06),inset_0_1.5px_2px_#fff]">
                      <div className="text-[11px] font-black text-slate-700">
                        Wadah {nextContainerNumber} (1/2)
                      </div>
                      <div className="text-lg font-black text-indigo-600 mt-0.5 tabular-nums">
                        +{dualSplit.container1.used_portions} <span className="text-[10px] font-bold text-neutral-500">porsi</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-medium mt-0.5">
                        Kumulatif: {dualSplit.container1.cumulative_portions}
                      </div>
                    </div>

                    {/* Container 2 Preview */}
                    <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_-2px_rgba(15,23,42,0.06),inset_0_1.5px_2px_#fff]">
                      <div className="text-[11px] font-black text-slate-700">
                        Wadah {nextContainerNumber + 1} (2/2)
                      </div>
                      <div className="text-lg font-black text-indigo-600 mt-0.5 tabular-nums">
                        +{dualSplit.container2.used_portions} <span className="text-[10px] font-bold text-neutral-500">porsi</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-medium mt-0.5">
                        Kumulatif: {dualSplit.container2.cumulative_portions}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Single Container Preview */
                <div className="p-3.5 bg-[#EDEFF5] border border-slate-200/90 rounded-2xl shadow-[inset_0_2px_4px_rgba(15,23,42,0.06),inset_0_-1px_1px_#fff] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-slate-800">
                      Pemakaian Wadah {nextContainerNumber}:
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">
                      {lastCumulative} → {numCumulative}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-indigo-600 tabular-nums">
                      +{totalIncrement}
                    </div>
                    <div className="text-[11px] font-black text-indigo-700">porsi terisi</div>
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
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-bold shadow-[inset_0_1px_1px_#fff]">
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
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-[0_8px_20px_-2px_rgba(99,102,241,0.45),inset_0_2px_3px_rgba(255,255,255,0.35),inset_0_-2.5px_3.5px_rgba(0,0,0,0.18)] active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{containerCount === 2 ? 'Simpan 2 Wadah Sekaligus' : 'Simpan Wadah'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
