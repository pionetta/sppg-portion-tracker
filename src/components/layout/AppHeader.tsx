import React from 'react';
import { useSyncStatus } from '../../hooks/useSyncStatus';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface AppHeaderProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentDate,
  onDateChange,
}) => {
  const { isOnline, isSyncing, triggerSync } = useSyncStatus();

  let formattedDateDisplay = '';
  try {
    formattedDateDisplay = format(parseISO(currentDate), 'dd MMMM yyyy', { locale: localeId });
  } catch {
    formattedDateDisplay = currentDate;
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 pt-safe">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 h-10">
        {/* Simple Title */}
        <div className="flex items-baseline gap-2 min-w-0">
          <h1 className="text-base font-bold text-[#1E232B] truncate tracking-tight">
            SPPG Tracker
          </h1>
          <span className="text-xs text-[#6C727F] font-medium hidden sm:inline">{formattedDateDisplay}</span>
        </div>

        {/* Right Actions: Clean date & subtle sync dot */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Native Date Input */}
          <div className="relative">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              aria-label="Pilih Tanggal"
            />
            <button
              type="button"
              className="px-2.5 py-1 text-xs font-semibold text-[#1E232B] bg-[#F8F9FB] rounded-lg border border-[#D8DCE3] active:scale-95 transition-all cursor-pointer"
            >
              <span className="sm:hidden">{currentDate}</span>
              <span className="hidden sm:inline">{formattedDateDisplay}</span>
            </button>
          </div>

          {/* Minimal Sync Dot Status */}
          <button
            onClick={triggerSync}
            title={isOnline ? 'Online (Tersinkron)' : 'Offline'}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-[#6C727F] bg-[#F8F9FB] border border-[#D8DCE3] cursor-pointer"
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-neutral-400'} ${isSyncing ? 'animate-ping' : ''}`} />
            <span className="text-[11px] font-semibold text-[#1E232B]">{isOnline ? 'Online' : 'Offline'}</span>
          </button>
        </div>
      </div>

      {/* Offline Calm Bar when offline per DESIGN.md Section 24 */}
      {!isOnline && (
        <div className="mt-2 py-1 px-3 bg-neutral-100 border border-neutral-200 text-neutral-700 text-[11px] font-medium rounded-xl flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-neutral-500 shrink-0" />
            Offline · Data tersimpan di perangkat dan akan disinkronkan saat online
          </span>
        </div>
      )}
    </header>
  );
};
