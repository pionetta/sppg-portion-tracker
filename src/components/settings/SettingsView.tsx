import React, { useState, useEffect } from 'react';
import { sopRepository } from '../../repositories/sopRepository';
import { useSyncStatus } from '../../hooks/useSyncStatus';
import type { SOPSettings } from '../../types';
import { ClayInput } from '../common/ClayInput';
import { useToast } from '../common/ToastContext';
import {
  ShieldCheck,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Info,
  Layers,
  Sliders,
  Flame,
  Snowflake,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [minHotTemp, setMinHotTemp] = useState<string>('60.0');
  const [maxColdTemp, setMaxColdTemp] = useState<string>('10.0');
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const { isOnline, isSyncing, cloudConfigured, lastSyncTime, triggerSync } = useSyncStatus();
  const { showToast } = useToast();

  useEffect(() => {
    sopRepository.getSettings().then((sop: SOPSettings) => {
      setMinHotTemp(sop.min_hot_temp.toString());
      setMaxColdTemp((sop.max_cold_temp || 10.0).toString());
      setNotes(sop.notes || '');
    });
  }, []);

  const handleSaveSOP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await sopRepository.updateSettings({
        min_hot_temp: parseFloat(minHotTemp) || 60.0,
        max_cold_temp: parseFloat(maxColdTemp) || 10.0,
        notes: notes.trim(),
      });
      showToast('Konfigurasi batas SOP suhu berhasil disimpan', 'success');
    } catch {
      showToast('Gagal menyimpan konfigurasi SOP', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const defaultCategories = [
    { order: 1, name: 'Makanan Pokok', desc: 'Nasi putih, nasi merah, jagung, dll.' },
    { order: 2, name: 'Protein Hewani', desc: 'Ayam, telur, ikan, daging sapi' },
    { order: 3, name: 'Protein Nabati', desc: 'Tempe, tahu, kacang-kacangan' },
    { order: 4, name: 'Sayur', desc: 'Sop, tumis sayur, lodeh, bayam' },
    { order: 5, name: 'Buah', desc: 'Pisang, semangka, pepaya, jeruk' },
    { order: 6, name: 'Pelengkap', desc: 'Susu, kerupuk, sambal' },
    { order: 7, name: 'Lainnya', desc: 'Komponen menu tambahan' },
  ];

  return (
    <div className="space-y-5 pb-36 max-w-3xl mx-auto px-4 pt-2">
      {/* Floating Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-[0_6px_14px_rgba(99,102,241,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.4)]">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Pengaturan Sistem</h2>
            <p className="text-xs text-slate-500 font-medium">
              Konfigurasi SOP suhu, kategori menu standar, dan status sinkronisasi cloud
            </p>
          </div>
        </div>
      </div>

      {/* SOP Suhu Form */}
      <div className="clay-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_8px_20px_rgba(15,23,42,0.05),inset_0_2px_2px_rgba(255,255,255,0.9)] space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(244,63,94,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.4)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">Konfigurasi SOP Suhu Distribusi</h3>
            <p className="text-xs text-slate-500 font-medium">
              Batas toleransi suhu untuk validasi keamanan pangan SPPG
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSOP} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 shadow-[inset_0_1px_3px_rgba(244,63,94,0.04)] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Min Suhu Makanan Panas</span>
              </div>
              <ClayInput
                type="number"
                step="0.5"
                inputMode="decimal"
                value={minHotTemp}
                onChange={(e) => setMinHotTemp(e.target.value)}
                helperText="Standar SPPG: ≥ 60.0°C"
                required
                rightAddon={<span className="text-xs font-bold text-slate-500">°C</span>}
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100 shadow-[inset_0_1px_3px_rgba(14,165,233,0.04)] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700">
                <Snowflake className="w-4 h-4 text-sky-500" />
                <span>Max Suhu Makanan Dingin</span>
              </div>
              <ClayInput
                type="number"
                step="0.5"
                inputMode="decimal"
                value={maxColdTemp}
                onChange={(e) => setMaxColdTemp(e.target.value)}
                helperText="Standar SPPG: ≤ 10.0°C"
                required
                rightAddon={<span className="text-xs font-bold text-slate-500">°C</span>}
              />
            </div>
          </div>

          <ClayInput
            label="Keterangan / Rujukan SOP"
            placeholder="Contoh: Standar Operasional Prosedur Distribusi SPPG 2026"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-sm shadow-[0_4px_12px_rgba(99,102,241,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.4)] hover:from-indigo-500 hover:to-indigo-600 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Simpan Konfigurasi SOP</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Standard Menu Categories */}
      <div className="clay-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_8px_20px_rgba(15,23,42,0.05),inset_0_2px_2px_rgba(255,255,255,0.9)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(245,158,11,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.4)]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight">Kategori Komponen Menu</h3>
              <p className="text-xs text-slate-500 font-medium">
                Urutan komponen makanan standar SPPG dalam produksi
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            7 Kategori
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {defaultCategories.map((cat) => (
            <div
              key={cat.order}
              className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] hover:bg-white hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 shrink-0 rounded-xl bg-gradient-to-br from-white to-slate-100 border border-slate-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center font-black text-slate-700 text-xs">
                  {cat.order}
                </span>
                <div className="truncate">
                  <p className="font-bold text-slate-800 text-xs truncate">{cat.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{cat.desc}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shrink-0 ml-2">
                #{cat.order}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud Sync Diagnostics */}
      <div className="clay-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_8px_20px_rgba(15,23,42,0.05),inset_0_2px_2px_rgba(255,255,255,0.9)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.4)]">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight">Database & Sinkronisasi</h3>
              <p className="text-xs text-slate-500 font-medium">
                Konektivitas lokal IndexedDB dan cloud Supabase
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
              : 'bg-amber-50 text-amber-700 border-amber-200/80'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Database Lokal:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50/90 px-2 py-0.5 rounded-lg border border-emerald-200/60">
              <CheckCircle2 className="w-3.5 h-3.5" /> IndexedDB Aktif
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Database Cloud:</span>
            <span className="font-bold text-slate-700">
              {cloudConfigured ? 'Supabase PostgreSQL Terhubung' : 'Mode Offline-First Hybrid'}
            </span>
          </div>
          {lastSyncTime && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Sinkronisasi Terakhir:</span>
              <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                {lastSyncTime} WIB
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={triggerSync}
          disabled={isSyncing}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200/90 border border-slate-300/80 text-slate-700 font-bold text-sm shadow-[0_4px_10px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.8)] hover:bg-slate-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sedang Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
        </button>
      </div>

      {/* Operational SOP Guidelines note */}
      <div className="p-4 bg-gradient-to-br from-indigo-50/90 to-blue-50/80 rounded-2xl border border-indigo-200/70 shadow-[0_4px_12px_rgba(99,102,241,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-start gap-3">
        <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-xs text-indigo-950 leading-relaxed font-medium">
          <strong className="font-black text-indigo-900 block mb-0.5">Perhatian Prosedur Operasional SPPG:</strong>
          Seluruh perhitungan pemorsian hanya menggunakan jumlah porsi kumulatif wadah tanpa berat isi. Pemakaian setiap wadah dihitung otomatis oleh sistem dan dialokasikan secara presisi ke setiap sekolah penerima manfaat.
        </div>
      </div>
    </div>
  );
};
