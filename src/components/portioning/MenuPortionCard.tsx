import React, { useState } from 'react';
import type { DailyMenuWithContainers, ContainerWithTemperatures } from '../../types';
import { lastActivityService } from '../../services/lastActivityService';
import { ClayCard } from '../common/ClayCard';
import { ClayButton } from '../common/ClayButton';
import { Badge } from '../common/Badge';
import { ContainerRow } from './ContainerRow';
import { AddContainerModal } from './AddContainerModal';
import { TemperatureModal } from './TemperatureModal';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  Split,
  Layers,
} from 'lucide-react';

interface MenuPortionCardProps {
  menu: DailyMenuWithContainers;
  currentDate?: string;
  isLocked?: boolean;
  onAddContainer: (dailyMenuId: string, cumulative: number, notes?: string, containerCount?: 1 | 2) => Promise<any>;
  onUpdateContainerCumulative: (containerId: string, cumulative: number) => Promise<any>;
  onDeleteContainer: (containerId: string) => Promise<any>;
  onAddTemperature: (containerId: string, temp: number, time: string, notes?: string) => Promise<any>;
  onDeleteTemperature: (tempId: string) => Promise<any>;
  onDeleteMenu: (dailyMenuId: string) => Promise<any>;
}

export const MenuPortionCard: React.FC<MenuPortionCardProps> = ({
  menu,
  currentDate,
  isLocked = false,
  onAddContainer,
  onUpdateContainerCumulative,
  onDeleteContainer,
  onAddTemperature,
  onDeleteTemperature,
  onDeleteMenu,
}) => {
  const [isAddContainerOpen, setIsAddContainerOpen] = useState(false);
  const [activeTempContainer, setActiveTempContainer] = useState<ContainerWithTemperatures | null>(null);
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Detect if menu is staple food / rice
  const isStapleRice = Boolean(
    menu &&
      (menu.category === 'Makanan Pokok' ||
        menu.category_name === 'Makanan Pokok' ||
        menu.name.toLowerCase().includes('nasi'))
  );

  // Persistent containerMode for this menu (1 wadah vs 2 wadah sekaligus)
  const [containerMode, setContainerMode] = useState<1 | 2>(() => {
    try {
      const saved = localStorage.getItem(`portion_mode_${menu.id}`);
      if (saved === '2' || saved === '1') return parseInt(saved) as 1 | 2;
    } catch {}
    return isStapleRice ? 2 : 1;
  });

  const handleModeChange = (mode: 1 | 2) => {
    setContainerMode(mode);
    try {
      localStorage.setItem(`portion_mode_${menu.id}`, mode.toString());
    } catch {}
  };

  const isCompleted = menu.total_actual_portions === menu.target_portions && menu.target_portions > 0;
  const isOverTarget = menu.total_actual_portions > menu.target_portions;
  const exceedsCount = menu.total_actual_portions - menu.target_portions;
  const isStarted = menu.containers.length > 0;

  const handleAddContainerWithActivity = async (
    menuId: string,
    cumulative: number,
    notes?: string,
    containerCount: 1 | 2 = containerMode
  ) => {
    const res = await onAddContainer(menuId, cumulative, notes, containerCount);
    if (res.success) {
      lastActivityService.saveActivity({
        date: currentDate || new Date().toISOString().split('T')[0],
        menuId: menu.id,
        menuName: menu.name,
        containerNumber: menu.containers.length + (containerCount === 2 ? 2 : 1),
        cumulativePortions: cumulative,
      });
    }
    return res;
  };

  const handleUpdateCumulativeWithActivity = async (containerId: string, cumulative: number) => {
    const res = await onUpdateContainerCumulative(containerId, cumulative);
    if (res.success) {
      lastActivityService.saveActivity({
        date: currentDate || new Date().toISOString().split('T')[0],
        menuId: menu.id,
        menuName: menu.name,
        cumulativePortions: cumulative,
      });
    }
    return res;
  };

  const categoryLabel = menu.category_name || menu.category || 'Komponen';

  return (
    <ClayCard className="p-4 sm:p-5 transition-all">
      {/* Menu Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-black text-[#111111] truncate tracking-tight">
              {menu.name}
            </h3>
            <Badge
              variant={
                categoryLabel.includes('Pokok')
                  ? 'primary'
                  : categoryLabel.includes('Hewani')
                  ? 'warning'
                  : categoryLabel.includes('Nabati')
                  ? 'neutral'
                  : categoryLabel.includes('Sayur')
                  ? 'success'
                  : 'neutral'
              }
              size="sm"
            >
              {categoryLabel}
            </Badge>
          </div>
          {menu.notes && <p className="text-xs text-[#666666] mt-0.5">{menu.notes}</p>}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-xl cursor-pointer"
            title={isCollapsed ? 'Buka Detail' : 'Tutup Detail'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!isLocked && (
            <button
              onClick={() => setIsDeleteMenuOpen(true)}
              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
              title="Hapus Menu Ini"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Breakdown Strip */}
      <div className="mt-3.5 grid grid-cols-4 gap-2 clay-well p-3 rounded-2xl text-center">
        <div>
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Target</div>
          <div className="text-sm sm:text-base font-black text-[#111111] tabular-nums">{menu.target_portions}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Aktual</div>
          <div className="text-sm sm:text-base font-black text-indigo-600 tabular-nums">{menu.total_actual_portions}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Sisa</div>
          <div className="text-sm sm:text-base font-black text-[#111111] tabular-nums">{menu.remaining_portions}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Progress</div>
          <div className="text-sm sm:text-base font-black text-emerald-600 tabular-nums">{menu.progress_percentage}%</div>
        </div>
      </div>

      {/* Progress Bar & Status Alert */}
      <div className="mt-3 space-y-1.5">
        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200/50">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? 'bg-emerald-500'
                : isOverTarget
                ? 'bg-amber-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${Math.min(100, menu.progress_percentage)}%` }}
          />
        </div>

        {/* Dynamic Status Text */}
        <div className="flex items-center justify-between text-xs font-semibold">
          {!isStarted ? (
            <span className="text-neutral-400 font-medium">Belum Dimulai</span>
          ) : isCompleted ? (
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              ✓ Pemorsian selesai
            </span>
          ) : isOverTarget ? (
            <span className="flex items-center gap-1 text-amber-700 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              ⚠ Melebihi target sebanyak {exceedsCount} porsi
            </span>
          ) : (
            <span className="flex items-center gap-1 text-neutral-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Dalam Proses (Kurang {menu.remaining_portions} porsi)
            </span>
          )}

          <span className="text-[11px] text-neutral-500 font-medium">
            {menu.containers.length} Wadah
          </span>
        </div>
      </div>

      {/* Containers Section */}
      {!isCollapsed && (
        <div className="mt-4 space-y-3 pt-3 border-t border-neutral-100">
          {menu.containers.length === 0 ? (
            <div className="py-6 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-center">
              <p className="text-xs text-neutral-500">Belum ada wadah dicatat untuk menu ini.</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Klik tombol di bawah untuk memasukkan wadah pertama.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {menu.containers.map((container) => (
                <ContainerRow
                  key={container.id}
                  container={container}
                  menu={menu}
                  onUpdateCumulative={handleUpdateCumulativeWithActivity}
                  onDeleteContainer={onDeleteContainer}
                  onOpenTemperatureModal={setActiveTempContainer}
                />
              ))}
            </div>
          )}

          {/* Mode Selector for Rice / Staple Food */}
          {isStapleRice && (
            <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/90 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-neutral-700">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mode Pemorsian Nasi:</span>
              </div>
              <div className="flex items-center gap-1 p-0.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleModeChange(1)}
                  className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                    containerMode === 1
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  1 Wadah
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange(2)}
                  className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                    containerMode === 2
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-neutral-500 hover:text-indigo-700'
                  }`}
                >
                  <Split className="w-3 h-3" />
                  2 Wadah (Dibagi 2)
                </button>
              </div>
            </div>
          )}

          {/* Add Container Button */}
          {!isLocked && (
            <ClayButton
              variant="secondary"
              onClick={() => setIsAddContainerOpen(true)}
              leftIcon={containerMode === 2 ? <Split className="w-4 h-4 text-indigo-600" /> : <Plus className="w-4 h-4 text-indigo-600" />}
              size="md"
              className="w-full border-dashed border-indigo-200 bg-indigo-50/40 text-indigo-700 hover:bg-indigo-50"
            >
              {containerMode === 2
                ? `+ Tambah 2 Wadah Sekaligus (Wadah ${menu.containers.length + 1} & ${menu.containers.length + 2})`
                : `+ Tambah Wadah ${menu.containers.length + 1}`}
            </ClayButton>
          )}
        </div>
      )}

      {/* Add Container Modal */}
      <AddContainerModal
        isOpen={isAddContainerOpen}
        onClose={() => setIsAddContainerOpen(false)}
        menu={menu}
        initialContainerCount={containerMode}
        onContainerCountChange={handleModeChange}
        onAddContainer={handleAddContainerWithActivity}
      />

      {/* Temperature Modal */}
      <TemperatureModal
        isOpen={Boolean(activeTempContainer)}
        onClose={() => setActiveTempContainer(null)}
        container={activeTempContainer}
        menu={menu}
        onAddTemp={onAddTemperature}
        onDeleteTemp={onDeleteTemperature}
      />

      {/* Delete Menu Confirmation */}
      <ConfirmModal
        isOpen={isDeleteMenuOpen}
        title="Hapus Menu Ini?"
        message={`Apakah Anda yakin ingin menghapus "${menu.name}" beserta seluruh catatan wadah & suhunya?`}
        confirmLabel="Hapus Menu"
        variant="danger"
        onConfirm={async () => {
          await onDeleteMenu(menu.id);
          setIsDeleteMenuOpen(false);
        }}
        onCancel={() => setIsDeleteMenuOpen(false)}
      />
    </ClayCard>
  );
};
