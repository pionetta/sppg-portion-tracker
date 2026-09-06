import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useDailyProduction } from '../../hooks/useDailyProduction';
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
    <div className="space-y-4 pb-36 max-w-2xl mx-auto px-4 pt-2">
      {/* Floating Header Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(15,23,42,0.02)] space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-black shadow-[inset_0_1px_2px_#fff,0_2px_6px_rgba(99,102,241,0.1)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full">
            Jadwal Harian
          </span>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Pembagian Porsi Pagi & Siang
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Sesuaikan alokasi porsi tiap sekolah untuk pengantaran pagi dan siang sesuai operasional dapur hari ini.
          </p>
        </div>
      </div>

      {/* Target vs School Allocation Discrepancy Alert */}
      <div
        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all duration-300 ${
          isTargetMatched
            ? 'bg-gradient-to-r from-emerald-500/10 via-white to-emerald-500/5 border-emerald-300/90 text-emerald-950 shadow-[0_8px_20px_-4px_rgba(16,185,129,0.14),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(16,185,129,0.04)]'
            : diff < 0
            ? 'bg-gradient-to-r from-amber-500/10 via-white to-amber-500/5 border-amber-300/90 text-amber-950 shadow-[0_8px_20px_-4px_rgba(245,158,11,0.14),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(245,158,11,0.04)]'
            : 'bg-gradient-to-r from-rose-500/10 via-white to-rose-500/5 border-rose-300/90 text-rose-950 shadow-[0_8px_20px_-4px_rgba(239,68,68,0.14),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(239,68,68,0.04)]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isTargetMatched
                ? 'bg-emerald-500 text-white'
                : diff < 0
                ? 'bg-amber-500 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            {isTargetMatched ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-tight">
              {isTargetMatched
                ? `✓ Target Produksi Sesuai (${dailyData.target_portions} porsi)`
                : diff < 0
                ? `Alokasi Kurang ${Math.abs(diff)} porsi dari Target (${dailyData.target_portions})`
                : `Alokasi Melebihi Target +${diff} porsi (${dailyData.target_portions})`}
            </span>
            <p className="text-[11px] opacity-80 mt-0.5">
              Pagi: <span className="font-bold">{dailyData.morning_allocations}</span> &bull; Siang:{' '}
              <span className="font-bold">{dailyData.afternoon_allocations}</span> &bull; Total:{' '}
              <span className="font-bold">{dailyData.total_school_allocations}</span>
            </p>
          </div>
        </div>

        {!isTargetMatched && (
          <button
            onClick={() => updateTargetPortions(dailyData.total_school_allocations)}
            className="px-3 py-1.5 bg-white font-bold text-xs rounded-xl border border-slate-300 text-indigo-700 shadow-[0_2px_6px_rgba(15,23,42,0.06),inset_0_1.5px_2px_#fff] hover:bg-indigo-50 active:scale-95 cursor-pointer whitespace-nowrap transition-all duration-200"
          >
            Samakan Target
          </button>
        )}
      </div>

      {/* Real-time Summary Cards: Pagi vs Siang vs Total */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Pagi Card */}
        <div
          onClick={() => setFilterPeriod(filterPeriod === 'Pagi' ? 'Semua' : 'Pagi')}
          className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer select-none active:scale-[0.98] ${
            filterPeriod === 'Pagi'
              ? 'bg-gradient-to-b from-amber-50 to-amber-100/80 border-amber-400 shadow-[0_12px_24px_-4px_rgba(245,158,11,0.25),inset_0_2px_3px_#fff,inset_0_-3px_5px_rgba(245,158,11,0.12)] ring-2 ring-amber-400/60 -translate-y-0.5'
              : 'bg-white border-slate-200/90 shadow-[0_8px_20px_-4px_rgba(15,23,42,0.06),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(15,23,42,0.02)] hover:border-amber-300 hover:shadow-[0_10px_22px_-3px_rgba(245,158,11,0.15),inset_0_2px_3px_#fff] hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-amber-800 uppercase tracking-wider">
            <div className="w-5 h-5 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Sunrise className="w-3.5 h-3.5 text-amber-600" />
            </div>
            PAGI
          </div>
          <div className="text-center mt-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight tabular-nums">
              {dailyData.morning_allocations}
            </div>
            <div className="text-[11px] font-bold text-amber-700 mt-0.5">
              {morningSchoolsCount} sekolah
            </div>
          </div>
        </div>

        {/* Siang Card */}
        <div
          onClick={() => setFilterPeriod(filterPeriod === 'Siang' ? 'Semua' : 'Siang')}
          className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer select-none active:scale-[0.98] ${
            filterPeriod === 'Siang'
              ? 'bg-gradient-to-b from-indigo-50 to-indigo-100/80 border-indigo-400 shadow-[0_12px_24px_-4px_rgba(99,102,241,0.25),inset_0_2px_3px_#fff,inset_0_-3px_5px_rgba(99,102,241,0.12)] ring-2 ring-indigo-400/60 -translate-y-0.5'
              : 'bg-white border-slate-200/90 shadow-[0_8px_20px_-4px_rgba(15,23,42,0.06),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(15,23,42,0.02)] hover:border-indigo-300 hover:shadow-[0_10px_22px_-3px_rgba(99,102,241,0.15),inset_0_2px_3px_#fff] hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-indigo-800 uppercase tracking-wider">
            <div className="w-5 h-5 rounded-lg bg-indigo-500/15 flex items-center justify-center">
              <Sun className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            SIANG
          </div>
          <div className="text-center mt-2">
            <div className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight tabular-nums">
              {dailyData.afternoon_allocations}
            </div>
            <div className="text-[11px] font-bold text-indigo-700 mt-0.5">
              {afternoonSchoolsCount} sekolah
            </div>
          </div>
        </div>

        {/* Total Card */}
        <div
          onClick={() => setFilterPeriod('Semua')}
          className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer select-none active:scale-[0.98] ${
            filterPeriod === 'Semua'
              ? 'bg-gradient-to-b from-emerald-50 to-emerald-100/80 border-emerald-400 shadow-[0_12px_24px_-4px_rgba(16,185,129,0.25),inset_0_2px_3px_#fff,inset_0_-3px_5px_rgba(16,185,129,0.12)] ring-2 ring-emerald-400/60 -translate-y-0.5'
              : 'bg-white border-slate-200/90 shadow-[0_8px_20px_-4px_rgba(15,23,42,0.06),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(15,23,42,0.02)] hover:border-emerald-300 hover:shadow-[0_10px_22px_-3px_rgba(16,185,129,0.15),inset_0_2px_3px_#fff] hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-emerald-800 uppercase tracking-wider">
            <div className="w-5 h-5 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            TOTAL
          </div>
          <div className="text-center mt-2">
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight tabular-nums">
              {dailyData.total_school_allocations}
            </div>
            <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
              {dailyData.schools.length} sekolah
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_20px_-3px_rgba(15,23,42,0.06),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(15,23,42,0.02)]">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider mr-1">
              Aksi Cepat:
            </span>
            <button
              onClick={() => handleSetAllPeriod('Pagi')}
              disabled={isBatchUpdating}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-amber-200 bg-amber-50 text-amber-900 shadow-[0_2px_5px_rgba(245,158,11,0.1),inset_0_1.5px_2px_#fff] hover:bg-amber-100 hover:border-amber-300 active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all duration-200"
              title="Atur seluruh sekolah ke 100% Pagi"
            >
              <Sunrise className="w-3.5 h-3.5 text-amber-600" />
              Semua Pagi
            </button>
            <button
              onClick={handleSplitAllEvenly}
              disabled={isBatchUpdating}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 shadow-[0_2px_5px_rgba(16,185,129,0.1),inset_0_1.5px_2px_#fff] hover:bg-emerald-100 hover:border-emerald-300 active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all duration-200"
              title="Bagi rata seluruh sekolah 50% pagi dan 50% siang"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              Bagi 2 (50:50)
            </button>
            <button
              onClick={() => handleSetAllPeriod('Siang')}
              disabled={isBatchUpdating}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-900 shadow-[0_2px_5px_rgba(99,102,241,0.1),inset_0_1.5px_2px_#fff] hover:bg-indigo-100 hover:border-indigo-300 active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all duration-200"
              title="Atur seluruh sekolah ke 100% Siang"
            >
              <Sun className="w-3.5 h-3.5 text-indigo-600" />
              Semua Siang
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyPrevious}
              disabled={isCopying}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 shadow-[0_2px_5px_rgba(15,23,42,0.05),inset_0_1.5px_2px_#fff] hover:bg-slate-50 active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all duration-200"
              title="Salin pembagian dari hari operasional sebelumnya"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-600" />
              Salin Kemarin
            </button>
            <button
              onClick={handleResetToMaster}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer active:scale-90"
              title="Reset ke porsi standar master"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-200/80 shadow-[inset_0_2px_4px_rgba(15,23,42,0.06),inset_0_-1px_2px_rgba(255,255,255,0.8)] backdrop-blur-md">
        <button
          onClick={() => setFilterPeriod('Semua')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
            filterPeriod === 'Semua'
              ? 'bg-slate-900 text-white shadow-[0_4px_12px_-2px_rgba(15,23,42,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.3)]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          Semua ({dailyData.schools.length})
        </button>
        <button
          onClick={() => setFilterPeriod('Pagi')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 active:scale-95 ${
            filterPeriod === 'Pagi'
              ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white shadow-[0_4px_12px_-2px_rgba(245,158,11,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.4)]'
              : 'text-amber-800 hover:bg-amber-100/60'
          }`}
        >
          <Sunrise className="w-3.5 h-3.5" />
          Ada Pagi ({morningSchoolsCount})
        </button>
        <button
          onClick={() => setFilterPeriod('Siang')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 active:scale-95 ${
            filterPeriod === 'Siang'
              ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-[0_4px_12px_-2px_rgba(99,102,241,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.4)]'
              : 'text-indigo-800 hover:bg-indigo-100/60'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          Ada Siang ({afternoonSchoolsCount})
        </button>
        {splitSchoolsCount > 0 && (
          <button
            onClick={() => setFilterPeriod('Keduanya')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 active:scale-95 ${
              filterPeriod === 'Keduanya'
                ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.4)]'
                : 'text-emerald-800 hover:bg-emerald-100/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
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
        <div className="space-y-3.5">
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
              <div
                key={school.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.07),0_2px_6px_rgba(15,23,42,0.04),inset_0_2px_3px_#fff,inset_0_-3px_5px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-4px_rgba(15,23,42,0.1),inset_0_2px_3px_#fff] transition-all duration-300 ease-out"
              >
                <div className="flex flex-col gap-3.5">
                  {/* Row 1: School Name, Level, Total, and Edit Button */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-black text-slate-900 truncate">
                          {school.school_name}
                        </h3>
                        {isSplit ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            Dibagi 2 (Pagi & Siang)
                          </span>
                        ) : isPureMorning ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                            100% Pagi
                          </span>
                        ) : isPureAfternoon ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
                            100% Siang
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                            Libur (0 porsi)
                          </span>
                        )}
                        {school.notes && (
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg">
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
                        <span className="text-xs font-bold text-slate-500 ml-1">porsi</span>
                      </div>
                      <button
                        onClick={() => (isEditing ? setEditingSchoolId(null) : handleStartCustomEdit(school))}
                        className={`p-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                          isEditing
                            ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.4)]'
                            : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                        }`}
                        title={isEditing ? 'Tutup Pengaturan' : 'Atur Pembagian Porsi'}
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Two-tone Morning vs Afternoon Progress/Proportion Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="text-amber-800 flex items-center gap-1">
                        <Sunrise className="w-3.5 h-3.5 text-amber-600" />
                        Pagi: <strong className="tabular-nums font-black">{morning}</strong> porsi ({morningPct}%)
                      </span>
                      <span className="text-indigo-800 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-indigo-600" />
                        Siang: <strong className="tabular-nums font-black">{afternoon}</strong> porsi ({afternoonPct}%)
                      </span>
                    </div>

                    {/* Visual 3D sunken groove proportion bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200/80 shadow-[inset_0_2px_4px_rgba(15,23,42,0.08)]">
                      <div
                        style={{ width: `${morningPct}%` }}
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-l-full transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]"
                        title={`Pagi: ${morning} porsi (${morningPct}%)`}
                      />
                      <div
                        style={{ width: `${afternoonPct}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-r-full transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]"
                        title={`Siang: ${afternoon} porsi (${afternoonPct}%)`}
                      />
                    </div>
                  </div>

                  {/* Row 3: Custom Edit Form (if toggled open) */}
                  {isEditing ? (
                    <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3 mt-1 shadow-[inset_0_2px_5px_rgba(15,23,42,0.05),inset_0_-1px_2px_#fff]">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                          Atur Porsi Pagi & Siang:
                        </span>
                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-bold text-indigo-900 shadow-2xs">
                          <span className="text-slate-500">Target Total:</span>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={editBaseTotal}
                            onChange={(e) => handleBaseTotalChange(e.target.value)}
                            className="w-16 text-center font-black text-indigo-700 bg-slate-50 rounded-lg px-1.5 py-0.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            title="Total porsi sekolah (Pagi + Siang)"
                          />
                          <span className="text-slate-500">porsi</span>
                        </div>
                      </div>

                      {/* Helper Hint */}
                      <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-950 flex items-start gap-1.5 leading-relaxed">
                        <div>
                          <strong>Otomatis & Fleksibel:</strong> Saat Porsi Pagi diubah, Porsi Siang langsung menyesuaikan dari target ({editBaseTotal} porsi). Anda juga tetap bisa menginput/mengubah Porsi Siang secara manual kapan saja.
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Morning portion editor */}
                        <div className="p-3 bg-white rounded-xl border border-amber-300 flex flex-col gap-1.5 shadow-[0_2px_6px_rgba(245,158,11,0.08),inset_0_1.5px_2px_#fff]">
                          <div className="flex items-center justify-between text-xs font-black text-amber-900">
                            <span className="flex items-center gap-1">
                              <Sunrise className="w-3.5 h-3.5 text-amber-600" /> Porsi Pagi
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleAdjustMorning(-10)}
                                className="px-2 py-0.5 text-[10px] font-black bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer active:scale-95 transition-all"
                                title="Kurang 10 porsi pagi"
                              >
                                -10
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAdjustMorning(10)}
                                className="px-2 py-0.5 text-[10px] font-black bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer active:scale-95 transition-all"
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
                            className="w-full px-3 py-1.5 text-lg font-black text-amber-950 bg-amber-50/50 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[inset_0_2px_4px_rgba(15,23,42,0.05)]"
                            placeholder="Porsi Pagi"
                          />
                          <span className="text-[10px] text-amber-700 font-medium">
                            Ubah angka ini untuk otomatis menghitung siang
                          </span>
                        </div>

                        {/* Afternoon portion editor */}
                        <div className="p-3 bg-white rounded-xl border-2 border-indigo-300 flex flex-col gap-1.5 shadow-[0_2px_6px_rgba(99,102,241,0.08),inset_0_1.5px_2px_#fff]">
                          <div className="flex items-center justify-between text-xs font-black text-indigo-900">
                            <span className="flex items-center gap-1">
                              <Sun className="w-3.5 h-3.5 text-indigo-600" /> Porsi Siang
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleAdjustAfternoon(-10)}
                                className="px-2 py-0.5 text-[10px] font-black bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer active:scale-95 transition-all"
                                title="Kurang 10 porsi siang"
                              >
                                -10
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAdjustAfternoon(10)}
                                className="px-2 py-0.5 text-[10px] font-black bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer active:scale-95 transition-all"
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
                            className="w-full px-3 py-1.5 text-lg font-black text-indigo-950 bg-indigo-50/50 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-[inset_0_2px_4px_rgba(15,23,42,0.05)]"
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
                          className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-white rounded-xl border border-slate-300 cursor-pointer active:scale-95 transition-all"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveCustomEdit(school.id, school.school_name)}
                          className="px-4 py-1.5 text-xs font-black text-white bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.4)] cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Simpan Pembagian
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Row 4: 1-Tap Quick Split Buttons */
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        Pilihan Cepat:
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* 100% Pagi */}
                        <button
                          type="button"
                          onClick={() => handleQuickPreset(school, 'pagi')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1 active:scale-95 ${
                            isPureMorning
                              ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-white shadow-[0_4px_12px_rgba(245,158,11,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.15)] ring-2 ring-amber-300'
                              : 'border border-slate-200 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 shadow-[0_2px_4px_rgba(15,23,42,0.04),inset_0_1px_2px_#fff]'
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
                          className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1 active:scale-95 ${
                            isSplit
                              ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[0_4px_12px_rgba(16,185,129,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.15)] ring-2 ring-emerald-300'
                              : 'border border-slate-200 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 shadow-[0_2px_4px_rgba(15,23,42,0.04),inset_0_1px_2px_#fff]'
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
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1 active:scale-95 ${
                            isPureAfternoon
                              ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.15)] ring-2 ring-indigo-300'
                              : 'border border-slate-200 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 shadow-[0_2px_4px_rgba(15,23,42,0.04),inset_0_1px_2px_#fff]'
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
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl border border-slate-200 bg-white cursor-pointer active:scale-95 transition-all shadow-[0_2px_4px_rgba(15,23,42,0.04),inset_0_1px_2px_#fff]"
                          title="Tentukan angka pagi & siang secara kustom"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
