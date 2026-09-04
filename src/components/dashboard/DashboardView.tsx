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
      {/* 1. Header: Greeting & Status per DESIGN.md Section 7 */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#111111] tracking-tight">
            {greeting}
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
          size="sm"
          className="shrink-0"
        >
          {dailyData.status === 'completed'
            ? '✓ Selesai'
            : dailyData.status === 'in_progress'
            ? 'Sedang Berlangsung'
            : 'Draft'}
        </Badge>
      </div>

      {/* 2. Primary CTA: Lanjutkan Pemorsian per DESIGN.md Section 7 */}
      <ClayCard className="p-4 border-[#E5E5E5] bg-[#FFFFFF] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">
              Aksi Utama
            </span>
            <h3 className="text-base font-bold text-[#111111] truncate">
              {primaryCtaLabel}
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              {lastActivity
                ? `Terakhir pada wadah #${lastActivity.containerNumber || 1} (${lastActivity.menuName})`
                : 'Pencatatan akumulatif wadah per menu.'}
            </p>
          </div>

          <ClayButton
            variant="primary"
            size="md"
            onClick={() => onNavigate('production')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shrink-0 w-full sm:w-auto"
          >
            {primaryCtaLabel}
          </ClayButton>
        </div>
      </ClayCard>

      {/* 3. Main Daily Summary Card per DESIGN.md Section 7 */}
      <ClayCard className="p-4 sm:p-5 border-[#E5E5E5]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Ringkasan Produksi Hari Ini
          </span>
          <span className="text-xs font-semibold text-neutral-600">
            {dailyData.completed_menus_count} dari {dailyData.total_menus_count} Menu Selesai
          </span>
        </div>

        {/* 4 Metric Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-neutral-50 rounded-xl border border-[#E5E5E5]">
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Target Hari Ini
            </div>
            <div className="text-2xl font-bold text-[#111111] mt-0.5 tabular-nums">
              {dailyData.target_portions}
            </div>
            <div className="text-[11px] text-neutral-500">porsi target</div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-[#E5E5E5]">
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Aktual
            </div>
            <div className="text-2xl font-bold text-indigo-600 mt-0.5 tabular-nums">
              {dailyData.total_actual_portions}
            </div>
            <div className="text-[11px] text-neutral-500">porsi tercapai</div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-[#E5E5E5]">
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Sisa
            </div>
            <div className="text-2xl font-bold text-[#111111] mt-0.5 tabular-nums">
              {dailyData.remaining_portions}
            </div>
            <div className="text-[11px] text-neutral-500">porsi lagi</div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-[#E5E5E5]">
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Progress
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5 tabular-nums">
              {dailyData.progress_percentage}%
            </div>
            <div className="text-[11px] text-neutral-500">keseluruhan</div>
          </div>
        </div>

        {/* Clean horizontal progress bar per DESIGN.md Section 7 */}
        <div className="mt-4 space-y-1">
          <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-[#E5E5E5]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, dailyData.progress_percentage)}%` }}
            />
          </div>
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
                  className="p-3 bg-[#FFFFFF] hover:bg-neutral-50 rounded-xl border border-[#E5E5E5] flex items-center justify-between gap-3 cursor-pointer transition-colors"
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
