import React, { useState } from 'react';
import { useDailyProduction } from '../../hooks/useDailyProduction';
import { usePortioning } from '../../hooks/usePortioning';
import { useMenus } from '../../hooks/useMenus';
import { MenuPortionCard } from './MenuPortionCard';
import { AddDailyMenuModal } from './AddDailyMenuModal';
import { LoadingState, EmptyState, ErrorState } from '../common/States';
import { useToast } from '../common/ToastContext';
import {
  Plus,
  Scale,
  CheckCircle2,
  Lock,
  Unlock,
  Edit2,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PortioningViewProps {
  currentDate: string;
}

export const PortioningView: React.FC<PortioningViewProps> = ({ currentDate }) => {
  const {
    dailyData,
    loading,
    error,
    refresh,
    addDailyMenu,
    deleteDailyMenu,
    updateTargetPortions,
    updateStatus,
  } = useDailyProduction(currentDate);

  const {
    addContainer,
    updateContainer,
    deleteContainer,
    addTemperature,
    deleteTemperature,
  } = usePortioning(refresh);

  const { menus: masterMenus } = useMenus();
  const { showToast } = useToast();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // Edit target inline state
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState('');
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false);

  if (loading) return <LoadingState message="Memuat data pemorsian produksi..." />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;
  if (!dailyData) return <EmptyState title="Catatan produksi tidak ditemukan" onAction={refresh} />;

  const isLocked = dailyData.status === 'completed';
  const isAllCompleted =
    dailyData.menus.length > 0 &&
    dailyData.menus.every((m) => m.total_actual_portions >= m.target_portions && m.target_portions > 0);

  const handleStartEditTarget = () => {
    setTargetInput(dailyData.target_portions.toString());
    setIsEditingTarget(true);
  };

  const handleSaveTarget = async () => {
    const val = parseInt(targetInput);
    if (isNaN(val) || val <= 0) {
      showToast('Target porsi harus berupa angka positif', 'error');
      return;
    }
    setIsUpdatingTarget(true);
    const res = await updateTargetPortions(val);
    setIsUpdatingTarget(false);
    if (res?.success) {
      showToast(`Target produksi berhasil diubah ke ${val} porsi & berlaku untuk seluruh menu`, 'success');
      setIsEditingTarget(false);
    } else {
      showToast('Gagal mengubah target produksi', 'error');
    }
  };

  const handleCompleteProduction = async () => {
    const res = await updateStatus('completed');
    if (res?.success) {
      showToast('Produksi harian telah ditandai Selesai dan dikunci', 'success');
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const handleReopenProduction = async () => {
    const res = await updateStatus('in_progress');
    if (res?.success) {
      showToast('Produksi dibuka kembali untuk perubahan', 'info');
    }
  };

  const handleAddContainer = async (
    dailyMenuId: string,
    cumulative: number,
    notes?: string,
    containerCount: 1 | 2 = 1
  ) => {
    if (isLocked) {
      showToast('Produksi sedang dikunci. Silakan buka kembali produksi untuk mengedit.', 'warning');
      return { success: false };
    }
    const res = await addContainer(dailyMenuId, cumulative, notes, containerCount);
    if (res.success) {
      if (containerCount === 2) {
        showToast('2 wadah sekaligus berhasil ditambahkan!', 'success');
      } else {
        showToast('Wadah berhasil ditambahkan!', 'success');
      }
      if (dailyData.status === 'draft') {
        await updateStatus('in_progress');
      }
    } else {
      showToast(res.error || 'Gagal menambahkan wadah', 'error');
    }
    return res;
  };

  const handleUpdateCumulative = async (containerId: string, newCumulative: number) => {
    if (isLocked) {
      showToast('Produksi sedang dikunci.', 'warning');
      return { success: false };
    }
    const res = await updateContainer(containerId, newCumulative);
    if (res.success) {
      showToast('Porsi kumulatif & seluruh wadah dihitung ulang', 'success');
    } else {
      showToast(res.error || 'Gagal memperbarui wadah', 'error');
    }
    return res;
  };

  const handleDeleteContainer = async (containerId: string) => {
    if (isLocked) {
      showToast('Produksi sedang dikunci.', 'warning');
      return { success: false };
    }
    const res = await deleteContainer(containerId);
    if (res.success) {
      showToast('Wadah dihapus & urutan dihitung ulang', 'info');
    }
    return res;
  };

  const handleAddTemperature = async (containerId: string, temp: number, time: string, notes?: string) => {
    const res = await addTemperature(containerId, temp, time, notes);
    if (res.success) {
      showToast('Pengukuran suhu tersimpan', 'success');
    }
    return res;
  };

  const handleDeleteTemperature = async (tempId: string) => {
    if (isLocked) {
      showToast('Produksi sedang dikunci.', 'warning');
      return { success: false };
    }
    const res = await deleteTemperature(tempId);
    if (res.success) {
      showToast('Catatan suhu dihapus', 'info');
    }
    return res;
  };

  const handleAddMenuSubmit = async (data: any) => {
    const res = await addDailyMenu(data);
    if (res.success) {
      showToast(`Menu "${data.name}" berhasil ditambahkan dengan target ${dailyData.target_portions} porsi`, 'success');
    }
    return res;
  };

  const handleDeleteMenu = async (dailyMenuId: string) => {
    if (isLocked) {
      showToast('Produksi sedang dikunci.', 'warning');
      return { success: false };
    }
    const res = await deleteDailyMenu(dailyMenuId);
    if (res.success) {
      showToast('Menu berhasil dihapus dari daftar harian', 'info');
    }
    return res;
  };

  return (
    <div className="space-y-4 pb-36 max-w-2xl mx-auto px-4 pt-3">
      {/* Production Lock Banner - Full Clay Pill */}
      {isLocked ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200/90 rounded-3xl flex items-center justify-between gap-3 text-xs text-emerald-950 shadow-[0_6px_18px_-2px_rgba(16,185,129,0.12),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(16,185,129,0.05)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center border border-emerald-300/70 shadow-[inset_0_1.5px_2px_#fff] shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-emerald-900 block">Status: Produksi Selesai & Terkunci</span>
              <p className="text-[11px] text-emerald-700 font-medium">
                Data terlindungi dari perubahan yang tidak disengaja.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReopenProduction}
            className="px-3.5 py-2 bg-white text-emerald-800 rounded-2xl border border-emerald-200 font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_12px_-2px_rgba(16,185,129,0.15),inset_0_1.5px_2px_#fff,inset_0_-2px_3px_rgba(0,0,0,0.04)] hover:bg-emerald-50/50 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Buka Kembali</span>
          </button>
        </div>
      ) : isAllCompleted ? (
        <div className="p-4 bg-indigo-50 border border-indigo-200/90 rounded-3xl flex items-center justify-between gap-3 text-xs text-indigo-950 shadow-[0_6px_18px_-2px_rgba(99,102,241,0.15),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(99,102,241,0.05)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200 shadow-[inset_0_1.5px_2px_#fff] shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-indigo-950 block">Target Porsi Tercapai!</span>
              <p className="text-[11px] text-indigo-700 font-medium">
                Semua menu telah mencapai target pemorsian hari ini.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCompleteProduction}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-[0_6px_18px_-2px_rgba(16,185,129,0.4),inset_0_2px_3px_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.2)] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Selesaikan & Kunci</span>
          </button>
        </div>
      ) : null}

      {/* Sticky Mobile Summary Bar — ULTRA FULL CLAYMORPHISM */}
      <div className="sticky top-14 z-30 p-4 sm:p-5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_16px_38px_-6px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.05),inset_0_2.5px_4px_#fff,inset_0_-4px_8px_rgba(15,23,42,0.045)] space-y-3.5 transition-all">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#111111] uppercase tracking-wider">
              Produksi Hari Ini
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-black bg-slate-100 text-slate-700 border border-slate-200/80 shadow-[inset_0_1px_1.5px_#fff]">
              {dailyData.status === 'completed'
                ? 'Selesai'
                : dailyData.status === 'in_progress'
                ? 'Sedang Berlangsung'
                : 'Draft'}
            </span>
          </div>

          {/* Unified Target Display / Editor */}
          <div className="flex items-center gap-1.5">
            {isEditingTarget ? (
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-indigo-400 shadow-[0_2px_8px_rgba(99,102,241,0.2),inset_0_1.5px_2px_#fff]">
                <input
                  type="number"
                  inputMode="numeric"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-20 px-2 py-1 text-xs font-black bg-slate-50 border border-slate-200 rounded-xl focus:outline-none tabular-nums"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveTarget}
                  disabled={isUpdatingTarget}
                  className="p-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 shadow-[0_2px_6px_rgba(99,102,241,0.3)] cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTarget(false)}
                  className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded-xl active:scale-95 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartEditTarget}
                disabled={isLocked}
                className="flex items-center gap-1.5 text-xs font-black text-indigo-700 bg-white px-3 py-1.5 rounded-2xl hover:bg-indigo-50/50 disabled:opacity-50 cursor-pointer border border-indigo-200/90 shadow-[0_4px_12px_-2px_rgba(99,102,241,0.16),inset_0_1.5px_2px_#fff,inset_0_-2px_3px_rgba(99,102,241,0.05)] active:scale-95 transition-all"
                title="Klik untuk mengubah target porsi harian"
              >
                <span>Target: {dailyData.target_portions} porsi</span>
                {!isLocked && <Edit2 className="w-3 h-3 text-indigo-500 stroke-[2.5]" />}
              </button>
            )}
          </div>
        </div>

        {/* 4-Column Key Metrics in Sunken Clay Well */}
        <div className="grid grid-cols-4 gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#EDEFF5] border border-slate-200/90 shadow-[inset_0_3px_8px_rgba(15,23,42,0.09),inset_0_1px_2px_rgba(15,23,42,0.05),inset_0_-1px_2px_#fff] text-center items-center">
          <div className="py-1">
            <div className="text-[10px] text-[#666666] font-bold uppercase tracking-wider">Target</div>
            <div className="text-base sm:text-lg font-black text-[#111111] tabular-nums mt-0.5">
              {dailyData.target_portions}
            </div>
          </div>
          <div className="bg-white rounded-2xl py-1.5 px-1 shadow-[0_6px_16px_-2px_rgba(99,102,241,0.2),inset_0_2px_2.5px_#fff,inset_0_-2px_3px_rgba(99,102,241,0.06)] border border-indigo-100/90">
            <div className="text-[10px] text-indigo-600 font-black uppercase tracking-wider">Selesai</div>
            <div className="text-base sm:text-lg font-black text-indigo-600 tabular-nums mt-0.5">
              {dailyData.completed_menus_count} / {dailyData.total_menus_count}
            </div>
          </div>
          <div className="py-1">
            <div className="text-[10px] text-[#666666] font-bold uppercase tracking-wider">Sekolah</div>
            <div className="text-base sm:text-lg font-black text-neutral-800 tabular-nums mt-0.5">
              {dailyData.schools.length}
            </div>
          </div>
          <div className="py-1">
            <div className="text-[10px] text-emerald-700 font-black uppercase tracking-wider">Progress</div>
            <div className="text-base sm:text-lg font-black text-emerald-600 tabular-nums mt-0.5">
              {dailyData.progress_percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-lg font-black text-[#111111] tracking-tight">
            Komponen Menu Pemorsian
          </h2>
          <p className="text-xs text-[#666666]">
            Target otomatis <strong>{dailyData.target_portions} porsi</strong> per komponen menu.
          </p>
        </div>
        {!isLocked && (
          <button
            type="button"
            onClick={() => setIsAddMenuOpen(true)}
            className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-[0_8px_20px_-2px_rgba(99,102,241,0.4),inset_0_2px_3px_rgba(255,255,255,0.35),inset_0_-2.5px_3.5px_rgba(0,0,0,0.18)] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Menu</span>
          </button>
        )}
      </div>

      {/* Menus List */}
      {dailyData.menus.length === 0 ? (
        <div className="p-8 bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_25px_-4px_rgba(15,23,42,0.08),inset_0_2px_3px_#fff,inset_0_-3px_5px_rgba(15,23,42,0.03)] text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-200/80 shadow-[inset_0_2px_3px_#fff]">
            <Scale className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#111111]">Belum Ada Menu Hari Ini</h3>
            <p className="text-xs text-[#666666] max-w-sm mx-auto mt-1">
              Tambahkan menu makanan (Nasi, Lauk Hewani, Lauk Nabati, Sayur, Buah) untuk mulai mencatat wadah pemorsian.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddMenuOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs inline-flex items-center gap-1.5 shadow-[0_8px_20px_-2px_rgba(99,102,241,0.4),inset_0_2px_3px_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.15)] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Menu Pertama</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {dailyData.menus.map((menu) => (
            <MenuPortionCard
              key={menu.id}
              menu={menu}
              currentDate={currentDate}
              isLocked={isLocked}
              onAddContainer={handleAddContainer}
              onUpdateContainerCumulative={handleUpdateCumulative}
              onDeleteContainer={handleDeleteContainer}
              onAddTemperature={handleAddTemperature}
              onDeleteTemperature={handleDeleteTemperature}
              onDeleteMenu={handleDeleteMenu}
            />
          ))}
        </div>
      )}

      {/* Add Daily Menu Modal */}
      <AddDailyMenuModal
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        masterMenus={masterMenus}
        defaultTarget={dailyData.target_portions}
        onAddMenu={handleAddMenuSubmit}
      />
    </div>
  );
};
