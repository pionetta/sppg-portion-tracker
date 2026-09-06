import React from 'react';
import type { DailyRecordDetail } from '../../types';
import { ClayButton } from '../common/ClayButton';
import {
  X,
  Calendar,
  School,
  Scale,
  Thermometer,
  Sunrise,
  Sun,
  Printer,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface HistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DailyRecordDetail | null;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!isOpen || !record) return null;

  let formattedDateDisplay = '';
  try {
    formattedDateDisplay = format(parseISO(record.date), 'EEEE, dd MMMM yyyy', {
      locale: localeId,
    });
  } catch {
    formattedDateDisplay = record.date;
  }

  const isCompleted = record.progress_percentage >= 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="clay-card-prominent p-5 sm:p-6 relative flex flex-col overflow-hidden max-h-full bg-white/95 backdrop-blur-md border border-white/60">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                  Detail Rekapitulasi Harian
                </h2>
                <span
                  className={`px-2.5 py-0.5 text-[11px] font-extrabold rounded-lg ${
                    record.status === 'completed' || isCompleted
                      ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/80 shadow-[0_2px_6px_rgba(16,185,129,0.2)]'
                      : 'bg-indigo-100/80 text-indigo-800 border border-indigo-200/80 shadow-[0_2px_6px_rgba(99,102,241,0.2)]'
                  }`}
                >
                  {record.status === 'completed' || isCompleted ? '✓ Selesai' : '⏳ Dalam Proses'}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 stroke-[2.2]" />
                <span>{formattedDateDisplay}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handlePrint}
                className="p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl border border-slate-200/70 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_1px_#fff] transition-all cursor-pointer active:scale-95"
                title="Cetak Rekap"
                aria-label="Cetak Rekap"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl border border-slate-200/70 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_1px_#fff] transition-all cursor-pointer active:scale-95"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="p-2 bg-white rounded-xl border border-slate-200/50 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Target</div>
                <div className="text-base font-black text-slate-800 tabular-nums">{record.target_portions.toLocaleString('id-ID')}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200/50 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Aktual</div>
                <div className="text-base font-black text-indigo-600 tabular-nums">{record.total_actual_portions.toLocaleString('id-ID')}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200/50 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Sisa</div>
                <div className="text-base font-black text-slate-700 tabular-nums">{record.remaining_portions.toLocaleString('id-ID')}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200/50 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Progress</div>
                <div className="text-base font-black text-emerald-600 tabular-nums">{record.progress_percentage}%</div>
              </div>
            </div>

            {/* Menu Details & Containers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5 tracking-tight">
                  <Scale className="w-4 h-4 text-indigo-600 stroke-[2.2]" />
                  Rincian Pemorsian Menu ({record.menus.length})
                </h3>
              </div>

              {record.menus.length === 0 ? (
                <div className="text-xs text-slate-400 p-4 bg-slate-50 rounded-2xl text-center border border-slate-200/60">
                  Tidak ada menu dicatat pada tanggal ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {record.menus.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_2px_#fff] space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-800">{m.name}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60">
                            {m.category_name || m.category}
                          </span>
                        </div>
                        <div className="text-xs font-black text-indigo-600 tabular-nums">
                          {m.total_actual_portions} / {m.target_portions} porsi ({m.progress_percentage}%)
                        </div>
                      </div>

                      {/* Containers Table */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Daftar Wadah ({m.containers.length}):
                        </div>
                        {m.containers.length === 0 ? (
                          <div className="text-xs text-slate-400 italic">Belum ada wadah</div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {m.containers.map((c) => (
                              <div
                                key={c.id}
                                className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/70 text-xs flex flex-col justify-between gap-1.5 shadow-[inset_0_1px_2px_#fff]"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-slate-800">
                                    Wadah #{c.container_number}
                                  </span>
                                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                                    Pemakaian: {c.used_portions}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                  <span>Kumulatif: {c.cumulative_portions} porsi</span>
                                  {c.temperatures.length > 0 && (
                                    <span className="font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
                                      <Thermometer className="w-3 h-3 text-amber-600" />
                                      {c.temperatures[c.temperatures.length - 1].temperature}°C
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* School Distribution Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5 tracking-tight">
                <School className="w-4 h-4 text-indigo-600 stroke-[2.2]" />
                Distribusi Sekolah ({record.schools.length} Sekolah)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl text-amber-900 border border-amber-200/70 shadow-xs">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
                    <Sunrise className="w-3.5 h-3.5" /> Pagi
                  </div>
                  <div className="text-base font-black mt-0.5 tabular-nums">{record.morning_allocations.toLocaleString('id-ID')} porsi</div>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl text-indigo-900 border border-indigo-200/70 shadow-xs">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-700">
                    <Sun className="w-3.5 h-3.5" /> Siang
                  </div>
                  <div className="text-base font-black mt-0.5 tabular-nums">{record.afternoon_allocations.toLocaleString('id-ID')} porsi</div>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl text-emerald-900 border border-emerald-200/70 col-span-2 sm:col-span-1 shadow-xs">
                  <div className="text-[11px] font-bold text-emerald-700">Total Alokasi</div>
                  <div className="text-base font-black mt-0.5 tabular-nums">{record.total_school_allocations.toLocaleString('id-ID')} porsi</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                {record.schools.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{s.school_name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-white border border-slate-200 text-slate-600">
                        {s.distribution_period}
                      </span>
                    </div>
                    <span className="font-black text-indigo-600 tabular-nums">{s.portions} porsi</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            <ClayButton variant="secondary" onClick={onClose} size="sm">
              Tutup
            </ClayButton>
          </div>
        </div>
      </div>
    </div>
  );
};
