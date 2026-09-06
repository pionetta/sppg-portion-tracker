import React, { useState } from 'react';
import type { DailyMenuWithContainers, ContainerWithTemperatures } from '../../types';
import { lastActivityService } from '../../services/lastActivityService';
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
    <div className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_30px_-4px_rgba(15,23,42,0.09),0_4px_10px_-2px_rgba(15,23,42,0.03),inset_0_2.5px_4px_#fff,inset_0_-3.5px_7px_rgba(15,23,42,0.035)] transition-all">
      {/* Menu Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-black text-[#111111] truncate tracking-tight">
              {menu.name}
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-black border shadow-[inset_0_1px_1.5px_#fff] ${
                categoryLabel.includes('Pokok')
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80 shadow-[0_2px_6px_rgba(99,102,241,0.1)]'
                  : categoryLabel.includes('Hewani')
                  ? 'bg-amber-50 text-amber-800 border-amber-200/80 shadow-[0_2px_6px_rgba(245,158,11,0.1)]'
                  : categoryLabel.includes('Nabati')
                  ? 'bg-orange-50 text-orange-800 border-orange-200/80'
                  : categoryLabel.includes('Sayur')
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-[0_2px_6px_rgba(16,185,129,0.1)]'
                  : 'bg-slate-100 text-slate-700 border-slate-200/80'
              }`}
            >
              {categoryLabel}
            </span>
          </div>
          {menu.notes && <p className="text-xs text-[#666666] mt-1 font-medium">{menu.notes}</p>}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-xl bg-slate-50 text-neutral-500 hover:text-neutral-800 hover:bg-slate-100 flex items-center justify-center border border-slate-200/70 shadow-[inset_0_1px_1.5px_#fff] active:scale-95 transition-all cursor-pointer"
            title={isCollapsed ? 'Buka Detail' : 'Tutup Detail'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!isLocked && (
            <button
              type="button"
              onClick={() => setIsDeleteMenuOpen(true)}
              className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 hover:text-rose-700 hover:bg-rose-100 flex items-center justify-center border border-rose-200/70 shadow-[inset_0_1px_1.5px_#fff] active:scale-95 transition-all cursor-pointer"
              title="Hapus Menu Ini"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Breakdown Strip — Sunken Clay Well */}
      <div className="mt-3.5 grid grid-cols-4 gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#EDEFF5] border border-slate-200/90 shadow-[inset_0_3px_8px_rgba(15,23,42,0.09),inset_0_1px_2px_rgba(15,23,42,0.05),inset_0_-1px_2px_#fff] text-center items-center">
        <div className="py-1">
          <div className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Target</div>
          <div className="text-base sm:text-lg font-black text-[#111111] tabular-nums mt-0.5">{menu.target_portions}</div>
        </div>
        <div className="bg-white rounded-2xl py-1.5 px-1 shadow-[0_6px_16px_-2px_rgba(99,102,241,0.2),inset_0_2px_2.5px_#fff,inset_0_-2px_3px_rgba(99,102,241,0.06)] border border-indigo-100/90">
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">Aktual</div>
          <div className="text-base sm:text-lg font-black text-indigo-600 tabular-nums mt-0.5">{menu.total_actual_portions}</div>
        </div>
        <div className="py-1">
          <div className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Sisa</div>
          <div className="text-base sm:text-lg font-black text-[#111111] tabular-nums mt-0.5">{menu.remaining_portions}</div>
        </div>
        <div className="py-1">
          <div className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Progress</div>
          <div className="text-base sm:text-lg font-black text-emerald-600 tabular-nums mt-0.5">{menu.progress_percentage}%</div>
        </div>
      </div>

      {/* Progress Bar & Status Alert */}
      <div className="mt-3.5 space-y-2">
        <div className="w-full h-3 rounded-full bg-slate-200/90 p-0.5 border border-slate-300/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.12),inset_0_-1px_1px_#fff]">
          <div
            className={`h-full rounded-full transition-all duration-500 shadow-[0_2px_6px_rgba(99,102,241,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.4)] ${
              isCompleted
                ? 'bg-linear-to-r from-emerald-500 to-emerald-600'
                : isOverTarget
                ? 'bg-linear-to-r from-amber-500 to-amber-600'
                : 'bg-linear-to-r from-indigo-500 to-indigo-600'
            }`}
            style={{ width: `${Math.min(100, menu.progress_percentage)}%` }}
          />
        </div>

        {/* Dynamic Status Text */}
        <div className="flex items-center justify-between text-xs font-semibold">
          {!isStarted ? (
            <span className="text-[#8A8A8A] font-medium">Belum Dimulai</span>
          ) : isCompleted ? (
            <span className="flex items-center gap-1.5 text-emerald-700 font-black px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-[inset_0_1px_1.5px_#fff]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              Pemorsian selesai
            </span>
          ) : isOverTarget ? (
            <span className="flex items-center gap-1.5 text-amber-800 font-black px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 shadow-[inset_0_1px_1.5px_#fff]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              Melebihi target (+{exceedsCount} porsi)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-indigo-900 font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/80 shadow-[inset_0_1px_1.5px_#fff]">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Kurang {menu.remaining_portions} porsi
            </span>
          )}

          <span className="text-[11px] text-[#666666] font-bold px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200/70 shadow-[inset_0_1px_1px_#fff]">
            {menu.containers.length} Wadah
          </span>
        </div>
      </div>

      {/* Containers Section */}
      {!isCollapsed && (
        <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
          {menu.containers.length === 0 ? (
            <div className="py-6 px-4 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-center">
              <p className="text-xs font-semibold text-[#666666]">Belum ada wadah dicatat untuk menu ini.</p>
              <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                Klik tombol di bawah untuk memasukkan wadah pertama.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
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

          {/* Mode Selector for Rice / Staple Food - Clay Pill Design */}
          {isStapleRice && (
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-[#EDEFF5] rounded-2xl border border-slate-200/90 shadow-[inset_0_2px_4px_rgba(15,23,42,0.06),inset_0_-1px_1px_#fff] text-xs">
              <div className="flex items-center gap-2 font-black text-slate-800">
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_1px_#fff]">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <span>Mode Pemorsian:</span>
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_1.5px_#fff]">
                <button
                  type="button"
                  onClick={() => handleModeChange(1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${
                    containerMode === 1
                      ? 'bg-slate-800 text-white shadow-[0_2px_6px_rgba(15,23,42,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.2)]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1 Wadah
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange(2)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                    containerMode === 2
                      ? 'bg-indigo-600 text-white shadow-[0_4px_10px_-1px_rgba(99,102,241,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.35)]'
                      : 'text-slate-600 hover:text-indigo-700'
                  }`}
                >
                  <Split className="w-3 h-3 stroke-[2.5]" />
                  2 Wadah (Bagi 2)
                </button>
              </div>
            </div>
          )}

          {/* Add Container Button — TACTILE CLAY BUTTON */}
          {!isLocked && (
            <button
              type="button"
              onClick={() => setIsAddContainerOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-indigo-50/40 text-indigo-700 font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-2 border-dashed border-indigo-200/90 shadow-[0_6px_18px_-2px_rgba(99,102,241,0.12),inset_0_2px_3px_#fff,inset_0_-2px_3px_rgba(99,102,241,0.04)] active:scale-[0.98] transition-all cursor-pointer"
            >
              {containerMode === 2 ? (
                <Split className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
              ) : (
                <Plus className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
              )}
              <span>
                {containerMode === 2
                  ? `+ Tambah 2 Wadah Sekaligus (Wadah ${menu.containers.length + 1} & ${menu.containers.length + 2})`
                  : `+ Tambah Wadah ${menu.containers.length + 1}`}
              </span>
            </button>
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
    </div>
  );
};
