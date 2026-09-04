import React, { useState, useEffect } from 'react';
import { dailyRecordRepository } from '../../repositories/dailyRecordRepository';
import type { DailyRecordDetail } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { Badge } from '../common/Badge';
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
    <div className="space-y-4 pb-28 max-w-2xl mx-auto px-4 pt-2">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Riwayat Pemorsian</h2>
        <p className="text-xs text-[#666666]">
          Daftar seluruh catatan produksi harian dan status pemorsian SPPG
        </p>
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
              <ClayCard
                key={r.id}
                variant="interactive"
                onClick={() => setSelectedRecord(r)}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-[#111111]">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span>{formattedDate}</span>
                      </div>
                      <Badge variant={isDone ? 'success' : 'primary'} size="sm">
                        {isDone ? 'Selesai' : 'Dalam Proses'}
                      </Badge>
                    </div>

                    <div className="mt-2.5 flex items-center gap-4 text-xs text-neutral-600 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="font-extrabold text-[#111111] text-base">
                          {r.total_actual_portions}
                        </span>
                        <span className="text-neutral-500">/ {r.target_portions} porsi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{r.menus.length} menu</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <School className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{r.schools.length} sekolah</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-600">
                        {r.progress_percentage}%
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
              </ClayCard>
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
