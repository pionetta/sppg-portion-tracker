import React, { useState, useEffect } from 'react';
import { useDailyProduction } from '../../hooks/useDailyProduction';
import { lastActivityService } from '../../services/lastActivityService';
import type { LastActivity } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { ClayButton } from '../common/ClayButton';
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

  // Primary CTA label & description per DESIGN.md Section 7
  const primaryCtaLabel = isCompleted
    ? 'Lihat Rekap Hari Ini'
    : isStarted
    ? 'Lanjutkan Pemorsian'
    : 'Mulai Produksi Hari Ini';

  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto px-4 pt-3">
      {/* 1. Header: Greeting & Status per Stitch Minimal Clay */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              {greeting}, Petugas
            </h2>
            <p className="text-xs text-[#666666]">
              {isCompleted
                ? 'Seluruh target pemorsian hari ini telah selesai diproses.'
                : isStarted
                ? 'Pencatatan pemorsian harian sedang berlangsung.'
                : 'Belum ada porsi yang dicatat untuk hari ini.'}
            </p>
          </div>

          <Badge
            variant={isCompleted ? 'success' : isStarted ? 'primary' : 'neutral'}
            size="md"
            className="shrink-0"
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

        {/* Operational Shift Banner */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-white clay-card-flat shadow-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-semibold text-[#111111]">Shift Operasional Harian</span>
          </div>
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Dapur SPPG-01
          </span>
        </div>
      </div>

      {/* 2. Main Daily Summary Card (Clay Level 2 Prominent) */}
      <ClayCard variant="prominent" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
              Target Pemorsian Hari Ini
            </h3>
            <p className="text-xs text-[#666666]">
              {dailyData.completed_menus_count} dari {dailyData.total_menus_count} komponen menu selesai
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1.5 shadow-[0_1px_2px_rgba(99,102,241,0.1)]">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            {isCompleted ? 'Target Tercapai' : 'Aktif Berjalan'}
          </span>
        </div>

        {/* 3-Column Key Metrics Inset Well */}
        <div className="grid grid-cols-3 gap-2 clay-well p-2.5 sm:p-3 rounded-2xl text-center">
          <div className="flex flex-col items-center justify-center py-1">
            <span className="text-[11px] font-semibold text-[#666666] mb-0.5">Target</span>
            <span className="text-2xl font-black text-[#111111] tabular-nums tracking-tight">
              {dailyData.target_portions}
            </span>
            <span className="text-[11px] text-[#8A8A8A]">porsi</span>
          </div>

          <div className="flex flex-col items-center justify-center bg-white rounded-xl py-1.5 px-1 shadow-[0_3px_8px_-1px_rgba(15,23,42,0.08),inset_0_1px_1.5px_#fff] border border-slate-200/70">
            <span className="text-[11px] font-bold text-indigo-600 mb-0.5">Aktual</span>
            <span className="text-2xl font-black text-indigo-600 tabular-nums tracking-tight">
              {dailyData.total_actual_portions}
            </span>
            <span className="text-[11px] font-semibold text-indigo-600/80">porsi</span>
          </div>

          <div className="flex flex-col items-center justify-center py-1">
            <span className="text-[11px] font-semibold text-[#666666] mb-0.5">Sisa</span>
            <span className="text-2xl font-black text-[#8A8A8A] tabular-nums tracking-tight">
              {dailyData.remaining_portions}
            </span>
            <span className="text-[11px] text-[#8A8A8A]">porsi</span>
          </div>
        </div>

        {/* Progress Bar with Percentage */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#666666]">
              {dailyData.total_actual_portions} dari {dailyData.target_portions} porsi selesai diporsi
            </span>
            <span className="font-bold text-indigo-600 tabular-nums">
              {dailyData.progress_percentage}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isCompleted ? 'bg-emerald-500' : 'bg-indigo-600 shadow-[0_1px_4px_rgba(99,102,241,0.4)]'
              }`}
              style={{ width: `${Math.min(100, dailyData.progress_percentage)}%` }}
            />
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="space-y-1.5">
          <ClayButton
            variant="primary"
            size="lg"
            onClick={() => onNavigate('production')}
            rightIcon={<ArrowRight className="w-5 h-5 stroke-[2.4]" />}
            className="w-full h-12 text-base font-bold shadow-[0_8px_24px_-3px_rgba(79,70,229,0.46)]"
          >
            {primaryCtaLabel}
          </ClayButton>
          {lastActivity && (
            <p className="text-[11px] text-center text-[#666666]">
              Aktivitas terakhir: Wadah #{lastActivity.containerNumber || 1} pada {lastActivity.menuName}
            </p>
          )}
        </div>
      </ClayCard>

      {/* 4. Menu Progress per DESIGN.md Section 7 */}
      <ClayCard className="p-4 sm:p-5 border-[#E5E5E5]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-bold text-[#111111]">Komponen Menu Hari Ini</h3>
            <p className="text-xs text-[#666666]">
              Setiap menu mengikuti target otomatis {dailyData.target_portions} porsi.
            </p>
          </div>
          <button
            onClick={() => onNavigate('production')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
          >
            Buka Pemorsian <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {dailyData.menus.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-500 bg-neutral-50 rounded-xl border border-dashed border-[#E5E5E5]">
            Belum ada menu yang didaftarkan untuk tanggal ini.
          </div>
        ) : (
          <div className="space-y-2">
            {dailyData.menus.map((m) => {
              const isMenuDone = m.total_actual_portions === m.target_portions && m.target_portions > 0;
              const isOver = m.total_actual_portions > m.target_portions;
              const remaining = Math.max(0, m.target_portions - m.total_actual_portions);

              return (
                <div
                  key={m.id}
                  onClick={() => onNavigate('production')}
                  className="p-3.5 bg-white clay-card-interactive rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-neutral-500 font-medium">
                      {m.category_name || m.category || 'Komponen'}
                    </div>
                    <div className="text-sm font-bold text-[#111111] truncate">{m.name}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {m.containers.length} wadah tercatat
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#111111] tabular-nums">
                        {m.total_actual_portions} / {m.target_portions}
                      </div>
                      <div className="text-[11px] font-medium">
                        {isMenuDone ? (
                          <span className="text-emerald-600 font-semibold">✓ Selesai</span>
                        ) : isOver ? (
                          <span className="text-amber-700 font-semibold">
                            +{m.exceeds_target_by} lebih
                          </span>
                        ) : (
                          <span className="text-neutral-500">Kurang {remaining} porsi</span>
                        )}
                      </div>
                    </div>
                    {isMenuDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : isOver ? (
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-neutral-400 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ClayCard>

      {/* 5. Bottom Info: School Allocation & Temperature Summary per DESIGN.md Section 41 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* School Allocation Summary */}
        <ClayCard
          onClick={() => onNavigate('schools')}
          className="p-3.5 border-[#E5E5E5] hover:border-neutral-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-indigo-600" />
              Alokasi Sekolah
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg font-bold text-[#111111] tabular-nums">
                {dailyData.total_school_allocations}
              </span>
              <span className="text-xs text-neutral-500 ml-1">porsi ({dailyData.schools.length} sekolah)</span>
            </div>
            <div className="text-xs text-neutral-500">
              Pagi: <span className="font-semibold text-neutral-700">{dailyData.morning_allocations}</span> | Siang:{' '}
              <span className="font-semibold text-neutral-700">{dailyData.afternoon_allocations}</span>
            </div>
          </div>
        </ClayCard>

        {/* Temperature Summary */}
        <ClayCard
          onClick={() => onNavigate('production')}
          className="p-3.5 border-[#E5E5E5] hover:border-neutral-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-600" />
              Pemeriksaan Suhu
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-600 font-medium">
              Standar SOP Wadah Makanan
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Terkonfigurasi
            </span>
          </div>
        </ClayCard>
      </div>

      {/* 6. Quick Action Navigation */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <ClayButton
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('production')}
          leftIcon={<ClipboardList className="w-4 h-4 text-indigo-600" />}
          className="flex-col py-2.5 h-auto text-xs"
        >
          <span>Produksi</span>
        </ClayButton>

        <ClayButton
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('schools')}
          leftIcon={<School className="w-4 h-4 text-amber-600" />}
          className="flex-col py-2.5 h-auto text-xs"
        >
          <span>Alokasi</span>
        </ClayButton>

        <ClayButton
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('history')}
          leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
          className="flex-col py-2.5 h-auto text-xs"
        >
          <span>Laporan</span>
        </ClayButton>
      </div>

      {/* SOP Settings Modal */}
      <SOPSettingsModal isOpen={isSOPModalOpen} onClose={() => setIsSOPModalOpen(false)} />
    </div>
  );
};
