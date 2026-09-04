import React from 'react';
import type { DailyRecordDetail } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { ClayButton } from '../common/ClayButton';
import { Badge } from '../common/Badge';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        <ClayCard className="p-5 sm:p-6 relative flex flex-col overflow-hidden max-h-full border-[#E5E5E5]">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#111111] tracking-tight">
                  Detail Rekapitulasi Harian
                </h2>
                <Badge variant={isCompleted ? 'success' : 'primary'} size="sm">
                  {record.status === 'completed' || isCompleted ? 'Selesai' : 'Dalam Proses'}
                </Badge>
              </div>
              <p className="text-xs text-[#666666] flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>{formattedDateDisplay}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handlePrint}
                className="p-2 text-neutral-600 hover:text-indigo-600 hover:bg-neutral-100 rounded-xl"
                title="Cetak Rekap"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-4 gap-2 text-center bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80">
              <div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase">Target</div>
                <div className="text-base font-black text-neutral-900">{record.target_portions}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase">Aktual</div>
                <div className="text-base font-black text-indigo-600">{record.total_actual_portions}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase">Sisa</div>
                <div className="text-base font-black text-neutral-700">{record.remaining_portions}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase">Progress</div>
                <div className="text-base font-black text-emerald-600">{record.progress_percentage}%</div>
              </div>
            </div>

            {/* Menu Details & Containers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-indigo-600" />
                  Rincian Pemorsian Menu ({record.menus.length})
                </h3>
              </div>

              {record.menus.length === 0 ? (
                <div className="text-xs text-neutral-400 p-3 bg-neutral-50 rounded-xl">
                  Tidak ada menu dicatat pada tanggal ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {record.menus.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#111111]">{m.name}</span>
                          <Badge variant="neutral" size="sm">
                            {m.category_name || m.category}
                          </Badge>
                        </div>
                        <div className="text-xs font-bold text-indigo-600">
                          {m.total_actual_portions} / {m.target_portions} porsi ({m.progress_percentage}%)
                        </div>
                      </div>

                      {/* Containers Table */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-neutral-500 uppercase">
                          Daftar Wadah ({m.containers.length}):
                        </div>
                        {m.containers.length === 0 ? (
                          <div className="text-xs text-neutral-400 italic">Belum ada wadah</div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {m.containers.map((c) => (
                              <div
                                key={c.id}
                                className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs flex flex-col justify-between gap-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[#111111]">
                                    Wadah {c.container_number}
                                  </span>
                                  <Badge variant="success" size="sm">
                                    Pemakaian: {c.used_portions}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                                  <span>Kumulatif: {c.cumulative_portions} porsi</span>
                                  {c.temperatures.length > 0 && (
                                    <span className="font-semibold text-amber-700 flex items-center gap-1">
                                      <Thermometer className="w-3 h-3" />
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
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <h3 className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                <School className="w-4 h-4 text-indigo-600" />
                Distribusi Sekolah ({record.schools.length} Sekolah)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-900 border border-amber-100">
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <Sunrise className="w-3 h-3" /> Pagi
                  </div>
                  <div className="text-sm font-black mt-0.5">{record.morning_allocations} porsi</div>
                </div>
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-900 border border-indigo-100">
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <Sun className="w-3 h-3" /> Siang
                  </div>
                  <div className="text-sm font-black mt-0.5">{record.afternoon_allocations} porsi</div>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-900 border border-emerald-100 col-span-2 sm:col-span-1">
                  <div className="text-[11px] font-bold">Total Alokasi</div>
                  <div className="text-sm font-black mt-0.5">{record.total_school_allocations} porsi</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                {record.schools.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 bg-neutral-50 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-800">{s.school_name}</span>
                      <Badge variant="neutral" size="sm">
                        {s.distribution_period}
                      </Badge>
                    </div>
                    <span className="font-black text-indigo-600">{s.portions} porsi</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end">
            <ClayButton variant="secondary" onClick={onClose} size="sm">
              Tutup
            </ClayButton>
          </div>
        </ClayCard>
      </div>
    </div>
  );
};
