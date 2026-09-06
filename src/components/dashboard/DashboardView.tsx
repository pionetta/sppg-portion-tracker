import React, { useState, useEffect } from 'react';
import { useDailyProduction } from '../../hooks/useDailyProduction';
import { lastActivityService } from '../../services/lastActivityService';
import type { LastActivity } from '../../types';
import { Badge } from '../common/Badge';
import { LoadingState, EmptyState, ErrorState } from '../common/States';
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ChevronRight,
  ClipboardList,
  School,
  Thermometer,
  ArrowRight,
  AlertTriangle,
  Flame,
  Sparkles,
} from 'lucide-react';
import type { NavTab } from '../layout/BottomNavigation';
import { SOPSettingsModal } from '../settings/SOPSettingsModal';

interface DashboardViewProps {
  currentDate: string;
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ currentDate, onNavigate }) => {
  const { dailyData, loading, error, refresh } = useDailyProduction(currentDate);
  const [isSOPModalOpen, setIsSOPModalOpen] = useState(false);
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null);

  useEffect(() => {
    setLastActivity(lastActivityService.getLastActivity());
  }, []);

  if (loading) return <LoadingState message="Menyiapkan data dashboard hari ini..." />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;
  if (!dailyData) return <EmptyState title="Catatan belum tersedia" onAction={refresh} />;

  const isCompleted = dailyData.status === 'completed' || dailyData.progress_percentage >= 100;
  const isStarted = dailyData.total_actual_portions > 0 || dailyData.status === 'in_progress';

  // Dynamic greeting based on current hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 11
      ? 'Selamat pagi'
      : currentHour < 15
      ? 'Selamat siang'
      : currentHour < 18
      ? 'Selamat sore'
      : 'Selamat malam';

  // Primary CTA label
  const primaryCtaLabel = isCompleted
    ? 'Lihat Rekap Hari Ini'
    : isStarted
    ? 'Lanjutkan Pemorsian'
    : 'Mulai Produksi Hari Ini';

  return (
    <div className="space-y-4 pb-36 max-w-2xl mx-auto px-4 pt-3">
      {/* 1. Greeting & Shift Pill - Full Clay Styling */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
                {greeting}, Petugas
              </h2>
              <span className="hidden sm:inline-flex p-1 bg-amber-100/80 rounded-full shadow-[0_2px_6px_rgba(245,158,11,0.2),inset_0_1px_2px_#fff]">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
              </span>
            </div>
            <p className="text-xs text-[#666666]">
              {isCompleted
                ? 'Seluruh target pemorsian hari ini telah selesai diproses.'
                : isStarted
                ? 'Pencatatan pemorsian harian sedang berlangsung aktif.'
                : 'Belum ada porsi yang dicatat untuk hari ini.'}
            </p>
          </div>

          <Badge
            variant={isCompleted ? 'success' : isStarted ? 'primary' : 'neutral'}
            size="md"
            className="shrink-0 shadow-[0_4px_12px_-2px_rgba(15,23,42,0.08),inset_0_1.5px_2px_#fff]"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
              </>
            ) : isStarted ? (
              <>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" /> Berlangsung
              </>
            ) : (
              'Draft'
            )}
          </Badge>
        </div>

        {/* Operational Shift Banner - Pillowy Clay Capsule */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-3xl bg-white border border-slate-200/90 shadow-[0_6px_18px_-2px_rgba(15,23,42,0.06),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(15,23,42,0.02)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/80 shadow-[inset_0_1.5px_2px_#fff]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#111111] block leading-tight">Shift Operasional SPPG</span>
              <span className="text-[10.5px] text-[#666666]">Distribusi Pagi & Siang</span>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 shadow-[inset_0_1.5px_2px_#fff]">
            Dapur SPPG-01
          </span>
        </div>
      </div>

      {/* 2. Main Daily Target Card — ULTRA FULL CLAYMORPHISM */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-[0_16px_38px_-6px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.05),inset_0_2.5px_4px_#fff,inset_0_-4px_8px_rgba(15,23,42,0.045)] space-y-4 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base sm:text-lg font-black text-[#111111] tracking-tight">
                Target Pemorsian Hari Ini
              </h3>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-xs text-[#666666] mt-0.5">
              {dailyData.completed_menus_count} dari {dailyData.total_menus_count} komponen menu selesai
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1.5 shadow-[0_2px_6px_rgba(99,102,241,0.14),inset_0_1.5px_2px_#fff]">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            {isCompleted ? 'Target Tercapai' : 'Aktif Berjalan'}
          </span>
        </div>

        {/* 3-Column Key Metrics in Sunken Clay Well */}
        <div className="grid grid-cols-3 gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#EDEFF5] border border-slate-200/90 shadow-[inset_0_3px_8px_rgba(15,23,42,0.09),inset_0_1px_2px_rgba(15,23,42,0.05),inset_0_-1px_2px_#fff] text-center items-center">
          <div className="flex flex-col items-center justify-center py-1">
            <span className="text-[11px] font-bold text-[#666666] mb-0.5 uppercase tracking-wider">Target</span>
            <span className="text-2xl sm:text-3xl font-black text-[#111111] tabular-nums tracking-tight">
              {dailyData.target_portions}
            </span>
            <span className="text-[11px] text-[#8A8A8A] font-medium">porsi</span>
          </div>

          {/* Inflated Floating White Clay Pill in Center */}
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl py-2 px-1 shadow-[0_8px_20px_-3px_rgba(99,102,241,0.24),0_2px_6px_rgba(15,23,42,0.06),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(99,102,241,0.08)] border border-indigo-100">
            <span className="text-[11px] font-black text-indigo-600 mb-0.5 uppercase tracking-wider">Aktual</span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 tabular-nums tracking-tight">
              {dailyData.total_actual_portions}
            </span>
            <span className="text-[11px] font-bold text-indigo-600/90">porsi</span>
          </div>

          <div className="flex flex-col items-center justify-center py-1">
            <span className="text-[11px] font-bold text-[#666666] mb-0.5 uppercase tracking-wider">Sisa</span>
            <span className="text-2xl sm:text-3xl font-black text-[#8A8A8A] tabular-nums tracking-tight">
              {dailyData.remaining_portions}
            </span>
            <span className="text-[11px] text-[#8A8A8A] font-medium">porsi</span>
          </div>
        </div>

        {/* Clay Progress Bar: Inset Groove with Inflated Fill */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#666666]">
              {dailyData.total_actual_portions} dari {dailyData.target_portions} porsi selesai diporsi
            </span>
            <span className="font-black text-indigo-600 tabular-nums text-sm">
              {dailyData.progress_percentage}%
            </span>
          </div>
          <div className="w-full h-3.5 rounded-full bg-slate-200/90 p-0.5 border border-slate-300/80 shadow-[inset_0_2px_5px_rgba(0,0,0,0.14),inset_0_-1px_1px_#fff]">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_2px_8px_rgba(34,197,94,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.7),inset_0_-1.5px_2px_rgba(0,0,0,0.2)]'
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_2px_8px_rgba(99,102,241,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.7),inset_0_-1.5px_2px_rgba(0,0,0,0.2)]'
              }`}
              style={{ width: `${Math.min(100, dailyData.progress_percentage)}%` }}
            />
          </div>
        </div>

        {/* Primary CTA Button - Squishy Clay Depth */}
        <div className="space-y-1.5 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('production')}
            className="w-full h-12 sm:h-13 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] select-none bg-gradient-to-b from-indigo-500 via-indigo-600 to-indigo-700 border border-indigo-800 shadow-[0_10px_26px_-4px_rgba(79,70,229,0.52),0_4px_10px_-2px_rgba(79,70,229,0.3),inset_0_2.5px_3px_rgba(255,255,255,0.45),inset_0_-3.5px_6px_rgba(0,0,0,0.3)] hover:brightness-105"
          >
            <span>{primaryCtaLabel}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.6]" />
          </button>
          {lastActivity && (
            <p className="text-[11px] text-center text-[#666666]">
              Aktivitas terakhir: Wadah #{lastActivity.containerNumber || 1} pada {lastActivity.menuName}
            </p>
          )}
        </div>
      </div>

      {/* 3. Menu Progress Section — Full Clay Cards */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.09),inset_0_2px_3px_#fff,inset_0_-3px_6px_rgba(15,23,42,0.035)] space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-[#111111] tracking-tight">Komponen Menu Hari Ini</h3>
            <p className="text-xs text-[#666666]">
              Setiap menu mengikuti target otomatis {dailyData.target_portions} porsi.
            </p>
          </div>
          <button
            onClick={() => onNavigate('production')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200/80 shadow-[inset_0_1px_1.5px_#fff] active:scale-95 transition-all"
          >
            Buka <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {dailyData.menus.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500 bg-[#F4F5FA] rounded-2xl border border-dashed border-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
            Belum ada menu yang didaftarkan untuk tanggal ini.
          </div>
        ) : (
          <div className="space-y-2.5">
            {dailyData.menus.map((m) => {
              const isMenuDone = m.total_actual_portions === m.target_portions && m.target_portions > 0;
              const isOver = m.total_actual_portions > m.target_portions;
              const remaining = Math.max(0, m.target_portions - m.total_actual_portions);

              return (
                <div
                  key={m.id}
                  onClick={() => onNavigate('production')}
                  className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_18px_-2px_rgba(15,23,42,0.07),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(15,23,42,0.025)] flex items-center justify-between gap-3 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-3px_rgba(15,23,42,0.1),inset_0_2px_3px_#fff] active:scale-[0.985]"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-neutral-500 font-semibold">
                      {m.category_name || m.category || 'Komponen'}
                    </div>
                    <div className="text-sm sm:text-base font-black text-[#111111] truncate">{m.name}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {m.containers.length} wadah tercatat
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-black text-[#111111] tabular-nums">
                        {m.total_actual_portions} / {m.target_portions}
                      </div>
                      <div className="text-[11px] font-semibold">
                        {isMenuDone ? (
                          <span className="text-emerald-600">✓ Selesai</span>
                        ) : isOver ? (
                          <span className="text-amber-700">
                            +{m.exceeds_target_by} lebih
                          </span>
                        ) : (
                          <span className="text-neutral-500">Kurang {remaining} porsi</span>
                        )}
                      </div>
                    </div>
                    {isMenuDone ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-[inset_0_1px_2px_#fff]">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.4]" />
                      </div>
                    ) : isOver ? (
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-[inset_0_1px_2px_#fff]">
                        <AlertTriangle className="w-4 h-4 stroke-[2.4]" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shadow-[inset_0_1px_2px_#fff]">
                        <Clock className="w-4 h-4 stroke-[2.4]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Bottom Info: School Allocation & Temperature Summary — Clay Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* School Allocation Summary */}
        <div
          onClick={() => onNavigate('schools')}
          className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_22px_-3px_rgba(15,23,42,0.07),inset_0_2px_3px_#fff,inset_0_-2.5px_4px_rgba(15,23,42,0.03)] hover:border-indigo-300 transition-all cursor-pointer active:scale-[0.985]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
              <School className="w-4 h-4 text-indigo-600" />
              Alokasi Sekolah
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-black text-[#111111] tabular-nums">
                {dailyData.total_school_allocations}
              </span>
              <span className="text-xs text-neutral-500 ml-1">porsi ({dailyData.schools.length} sekolah)</span>
            </div>
            <div className="text-xs text-neutral-500 font-medium">
              Pagi: <span className="font-bold text-neutral-800">{dailyData.morning_allocations}</span> | Siang:{' '}
              <span className="font-bold text-neutral-800">{dailyData.afternoon_allocations}</span>
            </div>
          </div>
        </div>

        {/* Temperature Summary */}
        <div
          onClick={() => onNavigate('production')}
          className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_22px_-3px_rgba(15,23,42,0.07),inset_0_2px_3px_#fff,inset_0_-2.5px_4px_rgba(15,23,42,0.03)] hover:border-amber-300 transition-all cursor-pointer active:scale-[0.985]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-600" />
              Pemeriksaan Suhu
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-600 font-medium">
              Standar SOP Wadah Makanan
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-[inset_0_1px_1.5px_#fff]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Terkonfigurasi
            </span>
          </div>
        </div>
      </div>

      {/* 5. Quick Action Tiles — Clay Buttons */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onNavigate('production')}
          className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_16px_-2px_rgba(15,23,42,0.08),inset_0_2px_3px_#fff,inset_0_-2.5px_4px_rgba(15,23,42,0.03)] flex flex-col items-center justify-center gap-1.5 hover:border-indigo-300 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/70 shadow-[inset_0_1.5px_2px_#fff]">
            <ClipboardList className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#111111]">Produksi</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('schools')}
          className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_16px_-2px_rgba(15,23,42,0.08),inset_0_2px_3px_#fff,inset_0_-2.5px_4px_rgba(15,23,42,0.03)] flex flex-col items-center justify-center gap-1.5 hover:border-amber-300 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/70 shadow-[inset_0_1.5px_2px_#fff]">
            <School className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#111111]">Alokasi</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('history')}
          className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_16px_-2px_rgba(15,23,42,0.08),inset_0_2px_3px_#fff,inset_0_-2.5px_4px_rgba(15,23,42,0.03)] flex flex-col items-center justify-center gap-1.5 hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/70 shadow-[inset_0_1.5px_2px_#fff]">
            <FileSpreadsheet className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#111111]">Laporan</span>
        </button>
      </div>

      {/* SOP Settings Modal */}
      <SOPSettingsModal isOpen={isSOPModalOpen} onClose={() => setIsSOPModalOpen(false)} />
    </div>
  );
};
