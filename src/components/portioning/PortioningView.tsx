import React, { useState } from 'react';
import { useDailyProduction } from '../../hooks/useDailyProduction';
import { usePortioning } from '../../hooks/usePortioning';
import { useMenus } from '../../hooks/useMenus';
import { ClayCard } from '../common/ClayCard';
import { ClayButton } from '../common/ClayButton';
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
    <div className="space-y-4 pb-28 max-w-2xl mx-auto px-4 pt-2">
      {/* Production Lock Banner */}
      {isLocked ? (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Status: Produksi Selesai & Terkunci</span>
              <p className="text-[11px] text-emerald-700">
                Data terlindungi dari perubahan yang tidak disengaja.
              </p>
            </div>
          </div>
          <ClayButton
            variant="secondary"
            size="sm"
            onClick={handleReopenProduction}
            leftIcon={<Unlock className="w-3.5 h-3.5" />}
            className="text-emerald-800 border-emerald-300 bg-white"
          >
            Buka Kembali
          </ClayButton>
        </div>
      ) : isAllCompleted ? (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between gap-2 text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Semua menu telah mencapai target pemorsian.</span>
          </div>
          <ClayButton
            variant="primary"
            size="sm"
            onClick={handleCompleteProduction}
            leftIcon={<FileCheck2 className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Selesaikan & Kunci
          </ClayButton>
        </div>
      ) : null}

      {/* Sticky Mobile Summary Bar with Single Target Editor per DESIGN.md Section 8 */}
      <ClayCard className="sticky top-14 z-30 bg-[#FFFFFF] border-[#E5E5E5] shadow-xs p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Produksi Hari Ini
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-neutral-100 text-neutral-700">
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
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  inputMode="numeric"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-18 px-2 py-1 text-xs font-bold bg-neutral-50 border border-indigo-500 rounded-lg focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveTarget}
                  disabled={isUpdatingTarget}
                  className="p-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setIsEditingTarget(false)}
                  className="p-1 text-neutral-500 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartEditTarget}
                disabled={isLocked}
                className="flex items-center gap-1 text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl hover:bg-indigo-100 disabled:opacity-50 cursor-pointer"
                title="Klik untuk mengubah target harian"
              >
                <span>Target: {dailyData.target_portions} porsi</span>
                {!isLocked && <Edit2 className="w-3 h-3 text-indigo-500" />}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center bg-neutral-50 p-2.5 rounded-xl">
          <div>
            <div className="text-[10px] text-neutral-500 font-semibold">Target</div>
            <div className="text-sm sm:text-base font-black text-neutral-800">
              {dailyData.target_portions}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-semibold">Selesai</div>
            <div className="text-sm sm:text-base font-black text-indigo-600">
              {dailyData.completed_menus_count} / {dailyData.total_menus_count}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-semibold">Sekolah</div>
            <div className="text-sm sm:text-base font-black text-neutral-700">
              {dailyData.schools.length}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-semibold">Progress</div>
            <div className="text-sm sm:text-base font-black text-emerald-600">
              {dailyData.progress_percentage}%
            </div>
          </div>
        </div>
      </ClayCard>

      {/* Action Header */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div>
          <h2 className="text-lg font-black text-[#111111] tracking-tight">
            Komponen Menu Pemorsian
          </h2>
          <p className="text-xs text-[#666666]">
            Setiap menu mempunyai target otomatis <strong>{dailyData.target_portions} porsi</strong>.
          </p>
        </div>
        {!isLocked && (
          <ClayButton
            variant="primary"
            size="sm"
            onClick={() => setIsAddMenuOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Tambah Menu
          </ClayButton>
        )}
      </div>

      {/* Menus List */}
      {dailyData.menus.length === 0 ? (
        <EmptyState
          title="Belum Ada Menu Hari Ini"
          description="Tambahkan menu makanan sesuai kategori untuk mulai mencatat wadah pemorsian."
          actionLabel="Tambah Menu Pertama"
          onAction={() => setIsAddMenuOpen(true)}
          icon={<Scale className="w-8 h-8" />}
        />
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
