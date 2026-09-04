import React, { useState, useEffect } from 'react';
import { sopRepository } from '../../repositories/sopRepository';
import { useSyncStatus } from '../../hooks/useSyncStatus';
import type { SOPSettings } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { ClayButton } from '../common/ClayButton';
import { ClayInput } from '../common/ClayInput';
import { Badge } from '../common/Badge';
import { useToast } from '../common/ToastContext';
import {
  ShieldCheck,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Info,
  Layers,
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
    <div className="space-y-4 pb-28 max-w-2xl mx-auto px-4 pt-2">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Pengaturan Sistem</h2>
        <p className="text-xs text-[#666666]">
          Konfigurasi SOP suhu, kategori menu, dan status sinkronisasi cloud
        </p>
      </div>

      {/* SOP Suhu Form */}
      <ClayCard className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111111]">Konfigurasi SOP Suhu Distribusi</h3>
            <p className="text-xs text-[#666666]">
              Batas toleransi suhu untuk validasi keamanan pangan SPPG
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSOP} className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <ClayInput
              label="Min Suhu Makanan Panas (°C)"
              type="number"
              step="0.5"
              inputMode="decimal"
              value={minHotTemp}
              onChange={(e) => setMinHotTemp(e.target.value)}
              helperText="Standar SPPG: ≥ 60°C"
              required
            />

            <ClayInput
              label="Max Suhu Makanan Dingin (°C)"
              type="number"
              step="0.5"
              inputMode="decimal"
              value={maxColdTemp}
              onChange={(e) => setMaxColdTemp(e.target.value)}
              helperText="Standar SPPG: ≤ 10°C"
              required
            />
          </div>

          <ClayInput
            label="Keterangan / Rujukan SOP"
            placeholder="Contoh: Standar Operasional Prosedur Distribusi SPPG"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="pt-1 flex justify-end">
            <ClayButton type="submit" variant="primary" size="sm" isLoading={isSaving}>
              Simpan Konfigurasi SOP
            </ClayButton>
          </div>
        </form>
      </ClayCard>

      {/* Standard Menu Categories */}
      <ClayCard className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-neutral-100 text-neutral-800 rounded-2xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111111]">Kategori Komponen Menu</h3>
              <p className="text-xs text-[#666666]">
                Urutan komponen makanan standar SPPG dalam produksi
              </p>
            </div>
          </div>
          <Badge variant="primary" size="sm">
            7 Kategori
          </Badge>
        </div>

        <div className="space-y-2 pt-1">
          {defaultCategories.map((cat) => (
            <div
              key={cat.order}
              className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/70 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-lg bg-white border border-neutral-200 flex items-center justify-center font-bold text-neutral-700 text-[11px]">
                  {cat.order}
                </span>
                <div>
                  <span className="font-bold text-[#111111]">{cat.name}</span>
                  <p className="text-[11px] text-neutral-500">{cat.desc}</p>
                </div>
              </div>
              <Badge variant="neutral" size="sm">
                Urutan {cat.order}
              </Badge>
            </div>
          ))}
        </div>
      </ClayCard>

      {/* Cloud Sync Diagnostics */}
      <ClayCard className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111111]">Database & Sinkronisasi</h3>
              <p className="text-xs text-[#666666]">
                Konektivitas lokal IndexedDB dan cloud Supabase
              </p>
            </div>
          </div>
          <Badge variant={isOnline ? 'success' : 'warning'} size="sm">
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>

        <div className="p-3 bg-neutral-50 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Database Lokal:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> IndexedDB Aktif
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Database Cloud:</span>
            <span className="font-semibold text-neutral-800">
              {cloudConfigured ? 'Supabase PostgreSQL Terhubung' : 'Mode Offline-First Hybrid'}
            </span>
          </div>
          {lastSyncTime && (
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Sinkronisasi Terakhir:</span>
              <span className="font-bold text-neutral-700">{lastSyncTime} WIB</span>
            </div>
          )}
        </div>

        <ClayButton
          variant="secondary"
          size="sm"
          onClick={triggerSync}
          isLoading={isSyncing}
          leftIcon={<RefreshCw className="w-4 h-4 text-indigo-600" />}
          className="w-full"
        >
          Sinkronkan Sekarang
        </ClayButton>
      </ClayCard>

      {/* Operational SOP Guidelines note */}
      <ClayCard className="p-3.5 bg-indigo-50/50 border-indigo-100 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 leading-relaxed">
          <strong>Perhatian SPPG:</strong> Seluruh perhitungan pemorsian hanya menggunakan jumlah porsi
          kumulatif wadah tanpa berat isi. Pemakaian setiap wadah dihitung otomatis oleh sistem.
        </div>
      </ClayCard>
    </div>
  );
};
