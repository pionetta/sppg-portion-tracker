import React, { useState, useEffect } from 'react';
import { dailyRecordRepository } from '../../repositories/dailyRecordRepository';
import { schoolRepository } from '../../repositories/schoolRepository';
import { menuRepository } from '../../repositories/menuRepository';
import type { DailyRecordDetail, School, Menu } from '../../types';
import { ClayInput } from '../common/ClayInput';
import { LoadingState } from '../common/States';
import { useToast } from '../common/ToastContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const ReportsView: React.FC = () => {
  const [records, setRecords] = useState<DailyRecordDetail[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('all');
  const [selectedMenuName, setSelectedMenuName] = useState<string>('all');

  const { showToast } = useToast();

  const loadAllData = async () => {
    setLoading(true);
    try {
      const basic = await dailyRecordRepository.getAll();
      const detailed: DailyRecordDetail[] = [];
      for (const b of basic) {
        const d = await dailyRecordRepository.getDetailByDate(b.date);
        if (d) detailed.push(d);
      }
      setRecords(detailed);

      const sch = await schoolRepository.getAll();
      setSchools(sch);

      const m = await menuRepository.getAll();
      setMenus(m);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filter records based on selected criteria
  const filteredRecords = records.filter((r) => {
    if (startDate && r.date < startDate) return false;
    if (endDate && r.date > endDate) return false;
    return true;
  });

  // Calculate aggregated totals
  const totalPortionsDistributed = filteredRecords.reduce((acc, r) => acc + r.total_actual_portions, 0);
  const totalTargetPlanned = filteredRecords.reduce((acc, r) => acc + r.target_portions, 0);
  const totalDays = filteredRecords.length;

  const handleExportCSV = () => {
    try {
      const rows: any[] = [];
      filteredRecords.forEach((rec) => {
        rec.menus.forEach((menu) => {
          if (selectedMenuName !== 'all' && menu.name !== selectedMenuName) return;

          menu.containers.forEach((c) => {
            const tempStr = c.temperatures.map((t) => `${t.temperature}°C (${t.measured_at})`).join(', ');
            rows.push({
              Tanggal: rec.date,
              Menu: menu.name,
              Kategori: menu.category,
              Target_Porsi: menu.target_portions,
              Wadah_Ke: c.container_number,
              Porsi_Kumulatif: c.cumulative_portions,
              Pemakaian_Porsi: c.used_portions,
              Catatan_Suhu: tempStr,
              Catatan_Wadah: c.notes || '',
            });
          });
        });
      });

      if (rows.length === 0) {
        showToast('Tidak ada data pemorsian untuk diekspor', 'warning');
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Laporan_Pemorsian_SPPG_${startDate}_sd_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Laporan CSV berhasil diunduh', 'success');
    } catch {
      showToast('Gagal mengekspor CSV', 'error');
    }
  };

  const handleExportExcel = () => {
    try {
      const portionRows: any[] = [];
      const schoolRows: any[] = [];

      filteredRecords.forEach((rec) => {
        // Sheet 1: Portion details
        rec.menus.forEach((menu) => {
          if (selectedMenuName !== 'all' && menu.name !== selectedMenuName) return;

          menu.containers.forEach((c) => {
            const tempStr = c.temperatures.map((t) => `${t.temperature}°C (${t.measured_at})`).join(', ');
            portionRows.push({
              Tanggal: rec.date,
              'Nama Menu': menu.name,
              Kategori: menu.category,
              'Target Menu': menu.target_portions,
              'Nomor Wadah': c.container_number,
              'Porsi Kumulatif': c.cumulative_portions,
              'Pemakaian Porsi': c.used_portions,
              'Catatan Suhu': tempStr,
              Keterangan: c.notes || '',
            });
          });
        });

        // Sheet 2: School distribution
        rec.schools.forEach((s) => {
          if (selectedSchoolId !== 'all' && s.school_id !== selectedSchoolId) return;

          schoolRows.push({
            Tanggal: rec.date,
            'Nama Sekolah': s.school_name,
            'Porsi Alokasi': s.portions,
            'Periode Distribusi': s.distribution_period,
            Catatan: s.notes || '',
          });
        });
      });

      const wb = XLSX.utils.book_new();
      const wsPortions = XLSX.utils.json_to_sheet(portionRows);
      const wsSchools = XLSX.utils.json_to_sheet(schoolRows);

      XLSX.utils.book_append_sheet(wb, wsPortions, 'Pemorsian_Wadah');
      XLSX.utils.book_append_sheet(wb, wsSchools, 'Distribusi_Sekolah');

      XLSX.writeFile(wb, `Rekap_Pemorsian_SPPG_${startDate}_sd_${endDate}.xlsx`);
      showToast('Laporan Excel (.xlsx) berhasil diunduh', 'success');
    } catch {
      showToast('Gagal mengekspor Excel', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-36 max-w-3xl mx-auto px-4 pt-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Laporan & Rekapitulasi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter data pemorsian, distribusi sekolah, dan ekspor dokumen.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_1px_#fff] flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            Cetak / PDF
          </button>
        </div>
      </div>

      {/* Filter Control Card */}
      <div className="clay-card p-5 rounded-3xl space-y-4 no-print border border-slate-200/80 bg-white/95 shadow-[0_8px_20px_rgba(15,23,42,0.05),inset_0_2px_2px_rgba(255,255,255,0.9)]">
        <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Filter className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          Filter Periode & Kriteria
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ClayInput
            label="Dari Tanggal"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <ClayInput
            label="Sampai Tanggal"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 px-0.5">Filter Menu</label>
            <select
              value={selectedMenuName}
              onChange={(e) => setSelectedMenuName(e.target.value)}
              className="clay-input px-3.5 py-2.5 text-xs bg-slate-50 text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-300 outline-none rounded-xl"
            >
              <option value="all">Semua Menu</option>
              {menus.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 px-0.5">Filter Sekolah</label>
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="clay-input px-3.5 py-2.5 text-xs bg-slate-50 text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-300 outline-none rounded-xl"
            >
              <option value="all">Semua Sekolah</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportExcel}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(16,185,129,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            Ekspor Excel (.xlsx)
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(30,41,59,0.25),inset_0_1.5px_2px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
            Ekspor CSV
          </button>
        </div>
      </div>

      {/* Aggregate Overview Card */}
      <div className="clay-card-prominent p-5 rounded-3xl bg-gradient-to-br from-white via-indigo-50/20 to-white">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          Ringkasan Periode Terpilih ({totalDays} Hari Produksi)
        </div>
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 bg-white rounded-2xl border border-slate-200/70 shadow-[0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_1px_#fff]">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Target</div>
            <div className="text-lg sm:text-xl font-black text-slate-800 tabular-nums mt-0.5">{totalTargetPlanned.toLocaleString('id-ID')}</div>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-indigo-100 shadow-[0_2px_6px_rgba(99,102,241,0.08),inset_0_1px_1px_#fff]">
            <div className="text-[10px] text-indigo-500 font-bold uppercase">Total Aktual</div>
            <div className="text-lg sm:text-xl font-black text-indigo-600 tabular-nums mt-0.5">{totalPortionsDistributed.toLocaleString('id-ID')}</div>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-emerald-100 shadow-[0_2px_6px_rgba(16,185,129,0.08),inset_0_1px_1px_#fff]">
            <div className="text-[10px] text-emerald-600 font-bold uppercase">Pencapaian</div>
            <div className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums mt-0.5">
              {totalTargetPlanned > 0
                ? `${Math.round((totalPortionsDistributed / totalTargetPlanned) * 100)}%`
                : '100%'}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Report Content */}
      <div className="space-y-3">
        {loading ? (
          <LoadingState message="Menghitung laporan..." />
        ) : filteredRecords.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 bg-white/80 rounded-3xl border border-dashed border-slate-200 shadow-sm">
            Tidak ada data pemorsian pada rentang filter ini.
          </div>
        ) : (
          filteredRecords.map((r) => (
            <div
              key={r.id}
              className="clay-card p-4 sm:p-5 rounded-3xl print-break-inside-avoid space-y-3 border border-slate-200/80 bg-white/95 shadow-[0_6px_16px_rgba(15,23,42,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.9)]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600 stroke-[2.2]" />
                  <span className="font-black text-sm sm:text-base text-slate-800">
                    {r.date}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-500 tabular-nums">
                  Target: {r.target_portions} | Aktual: <span className="text-indigo-600 font-black">{r.total_actual_portions}</span> ({r.progress_percentage}%)
                </div>
              </div>

              {/* Menus and Containers breakdown */}
              <div className="space-y-2.5">
                {r.menus.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="font-extrabold">{m.name} <span className="text-slate-400 font-normal">({m.category})</span></span>
                      <span className="text-indigo-600 font-black">Total: {m.total_actual_portions} porsi</span>
                    </div>

                    {/* Table of containers */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
                      {m.containers.map((c) => (
                        <div key={c.id} className="p-2 bg-white rounded-xl border border-slate-200/60 text-[11px] shadow-xs">
                          <div className="font-extrabold text-slate-800">Wadah #{c.container_number}</div>
                          <div className="text-emerald-700 font-bold">Pakai: {c.used_portions}</div>
                          <div className="text-slate-400 font-medium">Kum: {c.cumulative_portions}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
