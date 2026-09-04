import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
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
  onRefresh,
  isRefreshing,
}) => {
  const { isOnline, isSyncing, triggerSync } = useSyncStatus();

  let formattedDateDisplay = '';
  try {
    formattedDateDisplay = format(parseISO(currentDate), 'dd MMMM yyyy', { locale: localeId });
  } catch {
    formattedDateDisplay = currentDate;
  }

  return (
    <header className="sticky top-0 z-40 clay-header px-4 py-2.5 pt-safe">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 h-11">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/sppg-logo.svg"
            alt="SPPG Logo"
            className="w-9 h-9 rounded-xl shrink-0 shadow-[0_3px_8px_rgba(99,102,241,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)] object-contain"
          />
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-[#111111] truncate tracking-tight leading-tight">
              SPPG Portion Tracker
            </h1>
            <div className="flex items-center gap-1 text-[11px] text-[#666666]">
              <span className="truncate font-medium">{formattedDateDisplay}</span>
            </div>
          </div>
        </div>

        {/* Right Actions: Date picker trigger & Sync indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Native Date Input disguised as tactile button */}
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
              className="clay-card-flat px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_1px_#fff]"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="hidden sm:inline">Pilih Tanggal</span>
            </button>
          </div>

          {/* Sync / Online Status Pill per DESIGN.md Section 24 */}
          <button
            onClick={triggerSync}
            title={isOnline ? 'Online (Klik untuk sinkronkan)' : 'Offline (Tersimpan di perangkat)'}
            className={`clay-badge px-2.5 py-1 text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 ${
              !isOnline
                ? 'bg-neutral-50 text-[#8A8A8A] border-[#E5E5E5]'
                : isSyncing
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {!isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full border border-neutral-400 shrink-0" />
                <span className="hidden sm:inline">Offline</span>
              </>
            ) : isSyncing ? (
              <>
                <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin shrink-0" />
                <span className="hidden sm:inline">Menyinkronkan...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="hidden sm:inline">Tersinkron</span>
              </>
            )}
          </button>

          {/* Manual Refresh */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
              title="Segarkan Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          )}
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
