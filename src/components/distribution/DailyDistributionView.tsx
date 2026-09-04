import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useDailyProduction } from '../../hooks/useDailyProduction';
import { ClayCard } from '../common/ClayCard';
import { Badge } from '../common/Badge';
import { LoadingState, EmptyState, ErrorState } from '../common/States';
import { useToast } from '../common/ToastContext';
import {
  Copy,
  School as SchoolIcon,
  Sunrise,
  Sun,
  Edit2,
  Check,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Calendar,
  Layers,
  Scale,
  Sliders,
} from 'lucide-react';
import type { DistributionPeriod, DailySchool } from '../../types';

interface DailyDistributionViewProps {
  currentDate: string;
}

export const DailyDistributionView: React.FC<DailyDistributionViewProps> = ({ currentDate }) => {
  const {
    dailyData,
    loading,
    error,
    refresh,
    updateDailySchoolSplit,
    setAllDailySchoolsPeriod,
    splitAllDailySchoolsEvenly,
    resetDailySchoolsToMaster,
    updateTargetPortions,
    copyPreviousDay,
  } = useDailyProduction(currentDate);

  const { showToast } = useToast();

  const [isCopying, setIsCopying] = useState(false);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);

  // Custom split modal/inline state
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [editBaseTotal, setEditBaseTotal] = useState<number>(0);
  const [editMorning, setEditMorning] = useState<string>('0');
  const [editAfternoon, setEditAfternoon] = useState<string>('0');

  // Filter state for distribution view: 'Semua' | 'Pagi' | 'Siang' | 'Keduanya'
  const [filterPeriod, setFilterPeriod] = useState<'Semua' | 'Pagi' | 'Siang' | 'Keduanya'>('Semua');

  if (loading) return <LoadingState message="Memuat jadwal pengantaran harian..." />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;
  if (!dailyData) return <EmptyState title="Data tidak ditemukan" onAction={refresh} />;

  const formattedDate = (() => {
    try {
      return format(parseISO(currentDate), 'EEEE, d MMMM yyyy', { locale: id });
    } catch {
      return currentDate;
    }
  })();

  // 1-Tap Preset Split: 100% Pagi, 100% Siang, or 50:50
  const handleQuickPreset = async (school: DailySchool, type: 'pagi' | 'siang' | 'split') => {
    const total = school.portions;
    let morning = 0;
    let afternoon = 0;

    if (type === 'pagi') {
      morning = total;
      afternoon = 0;
    } else if (type === 'siang') {
      morning = 0;
      afternoon = total;
    } else if (type === 'split') {
      morning = Math.ceil(total / 2);
      afternoon = Math.floor(total / 2);
    }

    const res = await updateDailySchoolSplit(school.id, morning, afternoon);
    if (res.success) {
      if (type === 'split') {
        showToast(`${school.school_name}: Dibagi Pagi ${morning} & Siang ${afternoon} porsi`, 'success');
      } else if (type === 'pagi') {
        showToast(`${school.school_name}: 100% Pengantaran Pagi (${morning} porsi)`, 'success');
      } else {
        showToast(`${school.school_name}: 100% Pengantaran Siang (${afternoon} porsi)`, 'success');
      }
    } else {
      showToast('Gagal mengubah jadwal pengantaran', 'error');
    }
  };

  // Start Custom Split Edit
  const handleStartCustomEdit = (school: DailySchool) => {
    setEditingSchoolId(school.id);
    const morning = school.morning_portions ?? (school.distribution_period === 'Siang' ? 0 : school.portions);
    const afternoon = school.afternoon_portions ?? (school.distribution_period === 'Pagi' ? 0 : Math.max(0, school.portions - morning));
    const total = school.portions > 0 ? school.portions : (morning + afternoon > 0 ? morning + afternoon : 100);

    setEditBaseTotal(total);
    setEditMorning(morning.toString());
    setEditAfternoon(afternoon.toString());
  };

  // When user types in Porsi Pagi -> Porsi Siang automatically adjusts to (baseTotal - morning)
  const handleMorningChange = (valStr: string) => {
    setEditMorning(valStr);
    if (valStr === '') return;
    const m = parseInt(valStr);
    if (!isNaN(m) && m >= 0) {
      const autoAfternoon = Math.max(0, editBaseTotal - m);
      setEditAfternoon(autoAfternoon.toString());
    }
  };

  // When user clicks +/- 10 on Porsi Pagi -> adjusts Pagi and auto-adjusts Siang
  const handleAdjustMorning = (delta: number) => {
    const currentM = parseInt(editMorning) || 0;
    const newM = Math.max(0, currentM + delta);
    setEditMorning(newM.toString());
    const autoAfternoon = Math.max(0, editBaseTotal - newM);
    setEditAfternoon(autoAfternoon.toString());
  };

  // When user types in Porsi Siang manually -> accepts manual input & updates base total
  const handleAfternoonChange = (valStr: string) => {
    setEditAfternoon(valStr);
    if (valStr === '') return;
    const a = parseInt(valStr);
    const m = parseInt(editMorning) || 0;
    if (!isNaN(a) && a >= 0) {
      setEditBaseTotal(m + a);
    }
  };

  // When user clicks +/- 10 on Porsi Siang -> adjusts Siang and updates base total
  const handleAdjustAfternoon = (delta: number) => {
    const currentA = parseInt(editAfternoon) || 0;
    const newA = Math.max(0, currentA + delta);
    setEditAfternoon(newA.toString());
    const m = parseInt(editMorning) || 0;
    setEditBaseTotal(m + newA);
  };

  // When user changes the Base Total directly
  const handleBaseTotalChange = (valStr: string) => {
    const newTotal = Math.max(0, parseInt(valStr) || 0);
    setEditBaseTotal(newTotal);
    const m = parseInt(editMorning) || 0;
    const autoAfternoon = Math.max(0, newTotal - m);
    setEditAfternoon(autoAfternoon.toString());
  };

  // Save Custom Split Edit
  const handleSaveCustomEdit = async (schoolId: string, schoolName: string) => {
    const morning = parseInt(editMorning);
    const afternoon = parseInt(editAfternoon);

    if (isNaN(morning) || morning < 0 || isNaN(afternoon) || afternoon < 0) {
      showToast('Porsi tidak boleh bernilai negatif atau kosong', 'error');
      return;
    }

    const res = await updateDailySchoolSplit(schoolId, morning, afternoon);
    if (res.success) {
      showToast(`${schoolName}: Disimpan (Pagi: ${morning}, Siang: ${afternoon})`, 'success');
      setEditingSchoolId(null);
    } else {
      showToast('Gagal menyimpan pembagian porsi', 'error');
    }
  };

  // Batch actions
  const handleSetAllPeriod = async (period: DistributionPeriod) => {
    setIsBatchUpdating(true);
    const res = await setAllDailySchoolsPeriod(period);
    setIsBatchUpdating(false);
    if (res.success) {
      showToast(`Semua sekolah diatur ke 100% ${period}`, 'success');
    } else {
      showToast('Gagal memperbarui semua sekolah', 'error');
    }
  };

  const handleSplitAllEvenly = async () => {
    setIsBatchUpdating(true);
    const res = await splitAllDailySchoolsEvenly();
    setIsBatchUpdating(false);
    if (res.success) {
      showToast('Seluruh sekolah berhasil dibagi rata (50% Pagi : 50% Siang)', 'success');
    } else {
      showToast('Gagal membagi sekolah', 'error');
    }
  };

  const handleCopyPrevious = async () => {
    setIsCopying(true);
    const res = await copyPreviousDay();
    setIsCopying(false);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'warning');
    }
  };

  const handleResetToMaster = async () => {
    if (!confirm('Kembalikan alokasi tanggal ini sesuai porsi standar master sekolah?')) {
      return;
    }
    const res = await resetDailySchoolsToMaster();
    if (res.success) {
      showToast('Alokasi harian direset sesuai data master sekolah', 'success');
    } else {
      showToast('Gagal mereset data', 'error');
    }
  };

  // Calculate live counters
  const morningSchoolsCount = dailyData.schools.filter((s) => (s.morning_portions || 0) > 0).length;
  const afternoonSchoolsCount = dailyData.schools.filter((s) => (s.afternoon_portions || 0) > 0).length;
  const splitSchoolsCount = dailyData.schools.filter(
    (s) => (s.morning_portions || 0) > 0 && (s.afternoon_portions || 0) > 0
  ).length;

  const filteredSchools = dailyData.schools.filter((s) => {
    const morning = s.morning_portions ?? 0;
    const afternoon = s.afternoon_portions ?? 0;

    if (filterPeriod === 'Semua') return true;
    if (filterPeriod === 'Pagi') return morning > 0;
    if (filterPeriod === 'Siang') return afternoon > 0;
    if (filterPeriod === 'Keduanya') return morning > 0 && afternoon > 0;
    return true;
  });

  const diff = dailyData.total_school_allocations - dailyData.target_portions;
  const isTargetMatched = diff === 0;

  return (
    <div className="space-y-4 pb-4 max-w-2xl mx-auto px-4 pt-2">
      {/* Header with Date Badge */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm" className="font-bold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </Badge>
          <span className="text-xs text-neutral-500 font-medium">Pembagian Pengantaran</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
          <div>
            <h2 className="text-xl font-black text-[#111111] tracking-tight">
              Pembagian Porsi Pagi & Siang
            </h2>
            <p className="text-xs text-[#666666]">
              Setiap sekolah dapat dibagi porsinya menjadi pengantaran pagi dan siang sesuai jadwal harian.
            </p>
          </div>
        </div>
      </div>

      {/* Target vs School Allocation Discrepancy Alert */}
      <div
        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
          isTargetMatched
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : diff < 0
            ? 'bg-amber-50/80 border-amber-200 text-amber-900'
            : 'bg-rose-50/80 border-rose-200 text-rose-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isTargetMatched ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
          )}
          <div>
            <span className="font-bold text-xs">
              {isTargetMatched
                ? `✓ Target Produksi Sesuai (${dailyData.target_portions} porsi)`
                : diff < 0
                ? `Alokasi Kurang ${Math.abs(diff)} porsi dari Target (${dailyData.target_portions})`
                : `Alokasi Melebihi Target +${diff} porsi (${dailyData.target_portions})`}
            </span>
            <p className="text-[11px] opacity-85">
              Pagi: <span className="font-bold">{dailyData.morning_allocations}</span> | Siang: <span className="font-bold">{dailyData.afternoon_allocations}</span> | Total: <span className="font-bold">{dailyData.total_school_allocations}</span>
            </p>
          </div>
        </div>

        {!isTargetMatched && (
          <button
            onClick={() => updateTargetPortions(dailyData.total_school_allocations)}
            className="px-3 py-1.5 bg-white font-bold text-xs rounded-xl border border-neutral-300 shadow-2xs hover:bg-neutral-50 active:scale-95 cursor-pointer whitespace-nowrap text-indigo-700"
          >
            Samakan Target
          </button>
        )}
      </div>

      {/* Real-time Summary Cards: Pagi vs Siang vs Total */}
      <div className="grid grid-cols-3 gap-2">
        {/* Pagi Card */}
        <div
          onClick={() => setFilterPeriod(filterPeriod === 'Pagi' ? 'Semua' : 'Pagi')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            filterPeriod === 'Pagi'
              ? 'bg-amber-100/90 border-amber-400 shadow-xs ring-2 ring-amber-300/50'
              : 'bg-amber-50/60 border-amber-200/80 hover:bg-amber-50'
          }`}
        >
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
            <Sunrise className="w-3.5 h-3.5 text-amber-600" />
            PAGI
          </div>
          <div className="text-center mt-1">
            <div className="text-xl font-black text-amber-950 tracking-tight">
              {dailyData.morning_allocations}
            </div>
            <div className="text-[10px] font-medium text-amber-700">
              {morningSchoolsCount} sekolah
            </div>
          </div>
        </div>

        {/* Siang Card */}
        <div
          onClick={() => setFilterPeriod(filterPeriod === 'Siang' ? 'Semua' : 'Siang')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            filterPeriod === 'Siang'
              ? 'bg-indigo-100/90 border-indigo-400 shadow-xs ring-2 ring-indigo-300/50'
              : 'bg-indigo-50/60 border-indigo-200/80 hover:bg-indigo-50'
          }`}
        >
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-indigo-800 uppercase tracking-wider">
            <Sun className="w-3.5 h-3.5 text-indigo-600" />
            SIANG
          </div>
          <div className="text-center mt-1">
            <div className="text-xl font-black text-indigo-950 tracking-tight">
              {dailyData.afternoon_allocations}
            </div>
            <div className="text-[10px] font-medium text-indigo-700">
              {afternoonSchoolsCount} sekolah
            </div>
          </div>
        </div>

        {/* Total Card */}
        <div
          onClick={() => setFilterPeriod('Semua')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            filterPeriod === 'Semua'
              ? 'bg-emerald-100/90 border-emerald-400 shadow-xs ring-2 ring-emerald-300/50'
              : 'bg-emerald-50/60 border-emerald-200/80 hover:bg-emerald-50'
          }`}
        >
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            TOTAL
          </div>
          <div className="text-center mt-1">
            <div className="text-xl font-black text-emerald-950 tracking-tight">
              {dailyData.total_school_allocations}
            </div>
            <div className="text-[10px] font-medium text-emerald-700">
              {dailyData.schools.length} sekolah
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <ClayCard className="p-2.5 bg-white border-neutral-200">
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mr-1">
              Aksi Cepat:
            </span>
            <button
              onClick={() => handleSetAllPeriod('Pagi')}
              disabled={isBatchUpdating}
              className="px-2.5 py-1 text-xs font-bold rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-900 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              title="Atur seluruh sekolah ke 100% Pagi"
            >
              <Sunrise className="w-3 h-3 text-amber-600" />
              Semua Pagi
            </button>
            <button
              onClick={handleSplitAllEvenly}
              disabled={isBatchUpdating}
              className="px-2.5 py-1 text-xs font-bold rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              title="Bagi rata seluruh sekolah 50% pagi dan 50% siang"
            >
              <Scale className="w-3 h-3 text-emerald-600" />
              Bagi 2 Semua (50:50)
            </button>
            <button
              onClick={() => handleSetAllPeriod('Siang')}
              disabled={isBatchUpdating}
              className="px-2.5 py-1 text-xs font-bold rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              title="Atur seluruh sekolah ke 100% Siang"
            >
              <Sun className="w-3 h-3 text-indigo-600" />
              Semua Siang
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyPrevious}
              disabled={isCopying}
              className="px-2.5 py-1 text-xs font-bold rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              title="Salin pembagian dari hari operasional sebelumnya"
            >
              <Copy className="w-3 h-3 text-indigo-600" />
              Salin Kemarin
            </button>
            <button
              onClick={handleResetToMaster}
              className="p-1.5 text-xs text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-all cursor-pointer"
              title="Reset ke porsi standar master"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </ClayCard>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
        <button
          onClick={() => setFilterPeriod('Semua')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            filterPeriod === 'Semua'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Semua ({dailyData.schools.length})
        </button>
        <button
          onClick={() => setFilterPeriod('Pagi')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
            filterPeriod === 'Pagi'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-amber-800 hover:bg-amber-50'
          }`}
        >
          <Sunrise className="w-3 h-3" />
          Ada Pagi ({morningSchoolsCount})
        </button>
        <button
          onClick={() => setFilterPeriod('Siang')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
            filterPeriod === 'Siang'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-indigo-800 hover:bg-indigo-50'
          }`}
        >
          <Sun className="w-3 h-3" />
          Ada Siang ({afternoonSchoolsCount})
        </button>
        {splitSchoolsCount > 0 && (
          <button
            onClick={() => setFilterPeriod('Keduanya')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              filterPeriod === 'Keduanya'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <Scale className="w-3 h-3" />
            Dibagi 2 ({splitSchoolsCount})
          </button>
        )}
      </div>

      {/* Schools Distribution List */}
      {filteredSchools.length === 0 ? (
        <EmptyState
          title="Tidak Ada Sekolah pada Filter Ini"
          description={`Tidak ada sekolah yang memiliki alokasi pada filter ${filterPeriod}.`}
          actionLabel="Tampilkan Semua Sekolah"
          onAction={() => setFilterPeriod('Semua')}
          icon={<SchoolIcon className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-3">
          {filteredSchools.map((school) => {
            const morning = Number(school.morning_portions) || 0;
            const afternoon = Number(school.afternoon_portions) || 0;
            const total = morning + afternoon;

            const morningPct = total > 0 ? Math.round((morning / total) * 100) : 0;
            const afternoonPct = total > 0 ? 100 - morningPct : 0;

            const isPureMorning = morning > 0 && afternoon === 0;
            const isPureAfternoon = morning === 0 && afternoon > 0;
            const isSplit = morning > 0 && afternoon > 0;

            const isEditing = editingSchoolId === school.id;

            return (
              <ClayCard
                key={school.id}
                variant="flat"
                className="p-4 transition-all border border-[#E5E5E5] bg-[#FFFFFF]"
              >
                <div className="flex flex-col gap-3">
                  {/* Row 1: School Name, Level, Total, and Edit Button */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-bold text-[#111111] truncate">
                          {school.school_name}
                        </h3>
                        {isSplit ? (
                          <Badge variant="success" size="sm">
                            Dibagi 2 (Pagi & Siang)
                          </Badge>
                        ) : isPureMorning ? (
                          <Badge variant="warning" size="sm">
                            100% Pagi
                          </Badge>
                        ) : isPureAfternoon ? (
                          <Badge variant="primary" size="sm">
                            100% Siang
                          </Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">
                            Libur (0 porsi)
                          </Badge>
                        )}
                        {school.notes && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-md">
                            {school.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Total Portions display & custom edit toggle */}
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-black text-indigo-700 tracking-tight tabular-nums">
                          {total}
                        </span>
                        <span className="text-xs font-bold text-neutral-500 ml-1">porsi</span>
                      </div>
                      <button
                        onClick={() => (isEditing ? setEditingSchoolId(null) : handleStartCustomEdit(school))}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isEditing
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100'
                        }`}
                        title={isEditing ? 'Tutup Pengaturan' : 'Atur Pembagian Porsi'}
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Two-tone Morning vs Afternoon Progress/Proportion Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-amber-800 flex items-center gap-1">
                        <Sunrise className="w-3.5 h-3.5 text-amber-600" />
                        Pagi: <strong className="tabular-nums">{morning}</strong> porsi ({morningPct}%)
                      </span>
                      <span className="text-indigo-800 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-indigo-600" />
                        Siang: <strong className="tabular-nums">{afternoon}</strong> porsi ({afternoonPct}%)
                      </span>
                    </div>

                    {/* Visual proportion bar */}
                    <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${morningPct}%` }}
                        className="h-full bg-amber-500 transition-all duration-300"
                        title={`Pagi: ${morning} porsi (${morningPct}%)`}
                      />
                      <div
                        style={{ width: `${afternoonPct}%` }}
                        className="h-full bg-indigo-600 transition-all duration-300"
                        title={`Siang: ${afternoon} porsi (${afternoonPct}%)`}
                      />
                    </div>
                  </div>

                  {/* Row 3: Custom Edit Form (if toggled open) */}
                  {isEditing ? (
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-[#E5E5E5] space-y-3 mt-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                          Atur Porsi Pagi & Siang:
                        </span>
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-[#E5E5E5] text-xs font-bold text-indigo-900 shadow-2xs">
                          <span className="text-neutral-500">Target Total:</span>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={editBaseTotal}
                            onChange={(e) => handleBaseTotalChange(e.target.value)}
                            className="w-14 text-center font-bold text-indigo-700 bg-neutral-50 rounded px-1 py-0.5 border border-neutral-300 focus:outline-none"
                            title="Total porsi sekolah (Pagi + Siang)"
                          />
                          <span className="text-neutral-500">porsi</span>
                        </div>
                      </div>

                      {/* Helper Hint */}
                      <div className="p-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-[11px] text-neutral-700 flex items-start gap-1.5">
                        <div>
                          <strong>Otomatis & Fleksibel:</strong> Saat Porsi Pagi diubah, Porsi Siang langsung menyesuaikan dari target ({editBaseTotal} porsi). Anda juga tetap bisa menginput/mengubah Porsi Siang secara manual kapan saja.
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Morning portion editor */}
                        <div className="p-2.5 bg-white rounded-xl border border-amber-300 flex flex-col gap-1.5 shadow-2xs">
                          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                            <span className="flex items-center gap-1">
                              <Sunrise className="w-3.5 h-3.5 text-amber-600" /> Porsi Pagi
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleAdjustMorning(-10)}
                                className="px-1.5 py-0.5 text-[10px] font-bold bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700 cursor-pointer"
                                title="Kurang 10 porsi pagi"
                              >
                                -10
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAdjustMorning(10)}
                                className="px-1.5 py-0.5 text-[10px] font-bold bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700 cursor-pointer"
                                title="Tambah 10 porsi pagi"
                              >
                                +10
                              </button>
                            </div>
                          </div>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={editMorning}
                            onChange={(e) => handleMorningChange(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-base font-black text-amber-950 bg-amber-50/50 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="Porsi Pagi"
                          />
                          <span className="text-[10px] text-amber-700 font-medium">
                            Ubah angka ini untuk otomatis menghitung siang
                          </span>
                        </div>

                        {/* Afternoon portion editor */}
                        <div className="p-2.5 bg-white rounded-xl border-2 border-indigo-300 flex flex-col gap-1.5 shadow-2xs">
                          <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                            <span className="flex items-center gap-1">
                              <Sun className="w-3.5 h-3.5 text-indigo-600" /> Porsi Siang
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleAdjustAfternoon(-10)}
                                className="px-1.5 py-0.5 text-[10px] font-bold bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700 cursor-pointer"
                                title="Kurang 10 porsi siang"
                              >
                                -10
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAdjustAfternoon(10)}
                                className="px-1.5 py-0.5 text-[10px] font-bold bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700 cursor-pointer"
                                title="Tambah 10 porsi siang"
                              >
                                +10
                              </button>
                            </div>
                          </div>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={editAfternoon}
                            onChange={(e) => handleAfternoonChange(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-base font-black text-indigo-950 bg-indigo-50/50 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Porsi Siang"
                          />
                          <span className="text-[10px] text-indigo-700 font-medium">
                            Bisa diketik manual sesuai kebutuhan
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingSchoolId(null)}
                          className="px-3 py-1.5 text-xs font-bold text-neutral-600 hover:bg-white/80 rounded-xl border border-neutral-300 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveCustomEdit(school.id, school.school_name)}
                          className="px-4 py-1.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Simpan Pembagian
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Row 4: 1-Tap Quick Split Buttons */
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                        Pilihan Cepat:
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* 100% Pagi */}
                        <button
                          type="button"
                          onClick={() => handleQuickPreset(school, 'pagi')}
                          className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                            isPureMorning
                              ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                              : 'border border-neutral-200 bg-white hover:bg-amber-50 text-neutral-700 hover:text-amber-800'
                          }`}
                          title="Kirim seluruh porsi di kloter pagi"
                        >
                          <Sunrise className="w-3.5 h-3.5" />
                          100% Pagi
                        </button>

                        {/* 50:50 Bagi Dua */}
                        <button
                          type="button"
                          onClick={() => handleQuickPreset(school, 'split')}
                          className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                            isSplit
                              ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
                              : 'border border-neutral-200 bg-white hover:bg-emerald-50 text-neutral-700 hover:text-emerald-800'
                          }`}
                          title="Bagi porsi rata: 50% pagi dan 50% siang"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          Bagi 2 (50:50)
                        </button>

                        {/* 100% Siang */}
                        <button
                          type="button"
                          onClick={() => handleQuickPreset(school, 'siang')}
                          className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                            isPureAfternoon
                              ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300'
                              : 'border border-neutral-200 bg-white hover:bg-indigo-50 text-neutral-700 hover:text-indigo-800'
                          }`}
                          title="Kirim seluruh porsi di kloter siang"
                        >
                          <Sun className="w-3.5 h-3.5" />
                          100% Siang
                        </button>

                        {/* Custom Edit */}
                        <button
                          type="button"
                          onClick={() => handleStartCustomEdit(school)}
                          className="p-1.5 text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100 rounded-xl border border-neutral-200 bg-white cursor-pointer"
                          title="Tentukan angka pagi & siang secara kustom"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </ClayCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
