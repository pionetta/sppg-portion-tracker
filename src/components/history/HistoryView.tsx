import React, { useState, useEffect } from 'react';
import { dailyRecordRepository } from '../../repositories/dailyRecordRepository';
import type { DailyRecordDetail } from '../../types';
import { LoadingState, EmptyState } from '../common/States';
import { HistoryDetailModal } from './HistoryDetailModal';
import {
  Calendar,
  ChevronRight,
  School,
  Scale,
  History as HistoryIcon,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export const HistoryView: React.FC = () => {
  const [records, setRecords] = useState<DailyRecordDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<DailyRecordDetail | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const basicRecords = await dailyRecordRepository.getAll();
      const detailedList: DailyRecordDetail[] = [];
      for (const r of basicRecords) {
        const detail = await dailyRecordRepository.getDetailByDate(r.date);
        if (detail) detailedList.push(detail);
      }
      setRecords(detailedList);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="space-y-4 pb-36 max-w-3xl mx-auto px-4 pt-2 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Riwayat Pemorsian</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar seluruh catatan produksi harian dan status pemorsian SPPG
          </p>
        </div>
        {records.length > 0 && (
          <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-indigo-100/80 shadow-[inset_0_1px_2px_#fff]">
            {records.length} Hari Tercatat
          </div>
        )}
      </div>

      {loading ? (
        <LoadingState message="Memuat riwayat harian..." />
      ) : records.length === 0 ? (
        <EmptyState
          title="Belum Ada Riwayat Produksi"
          description="Catatan produksi harian yang telah dibuat akan muncul di sini."
          icon={<HistoryIcon className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-3">
          {records.map((r) => {
            let formattedDate = r.date;
            try {
              formattedDate = format(parseISO(r.date), 'EEEE, dd MMMM yyyy', { locale: localeId });
            } catch {}

            const isDone = r.progress_percentage >= 100 || r.status === 'completed';

            return (
              <div
                key={r.id}
                onClick={() => setSelectedRecord(r)}
                className="clay-card p-4 sm:p-5 rounded-3xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-slate-200/80 bg-white/95 shadow-[0_8px_20px_rgba(15,23,42,0.05),inset_0_2px_2px_rgba(255,255,255,0.9)] active:scale-[0.99] group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 font-black text-sm sm:text-base text-slate-800">
                        <Calendar className="w-4 h-4 text-indigo-600 stroke-[2.2]" />
                        <span>{formattedDate}</span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-extrabold rounded-lg ${
                          isDone
                            ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/80 shadow-[0_2px_6px_rgba(16,185,129,0.2)]'
                            : 'bg-indigo-100/80 text-indigo-800 border border-indigo-200/80 shadow-[0_2px_6px_rgba(99,102,241,0.2)]'
                        }`}
                      >
                        {isDone ? '✓ Selesai' : '⏳ Dalam Proses'}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3 sm:gap-4 text-xs text-slate-600 flex-wrap">
                      <div className="flex items-baseline gap-1">
                        <span className="font-black text-indigo-600 text-xl sm:text-2xl tabular-nums">
                          {r.total_actual_portions.toLocaleString('id-ID')}
                        </span>
                        <span className="text-slate-400 font-bold text-xs">/ {r.target_portions.toLocaleString('id-ID')} porsi</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/80 border border-slate-200/60 font-semibold text-slate-600">
                        <Scale className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{r.menus.length} menu</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/80 border border-slate-200/60 font-semibold text-slate-600">
                        <School className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{r.schools.length} sekolah</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-1">
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-black text-emerald-600 tabular-nums">
                        {r.progress_percentage}%
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Tercapai</div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <HistoryDetailModal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </div>
  );
};
