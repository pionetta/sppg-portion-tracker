import React, { useState, useEffect } from 'react';
import { dailyRecordRepository } from '../../repositories/dailyRecordRepository';
import { schoolRepository } from '../../repositories/schoolRepository';
import { menuRepository } from '../../repositories/menuRepository';
import type { DailyRecordDetail, School, Menu } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { ClayButton } from '../common/ClayButton';
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
    <div className="space-y-4 pb-28 max-w-2xl mx-auto px-4 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h2 className="text-xl font-black text-[#111111] tracking-tight">
            Laporan & Rekapitulasi SPPG
          </h2>
          <p className="text-xs text-[#666666]">
            Filter data pemorsian, distribusi sekolah, suhu, dan ekspor dokumen
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ClayButton
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Cetak / PDF
          </ClayButton>
        </div>
      </div>

      {/* Filter Control Card */}
      <ClayCard className="p-4 space-y-3 no-print">
        <div className="flex items-center gap-2 text-xs font-bold text-[#111111] uppercase tracking-wider">
          <Filter className="w-4 h-4 text-indigo-600" />
          Filter Laporan
        </div>

        <div className="grid grid-cols-2 gap-3">
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

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#111111] px-0.5">Filter Menu</label>
            <select
              value={selectedMenuName}
              onChange={(e) => setSelectedMenuName(e.target.value)}
              className="clay-input px-3 py-2 text-xs bg-[#FAFAFA]"
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
            <label className="text-xs font-semibold text-[#111111] px-0.5">Filter Sekolah</label>
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="clay-input px-3 py-2 text-xs bg-[#FAFAFA]"
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
        <div className="pt-2 flex items-center gap-2.5">
          <ClayButton
            variant="primary"
            size="sm"
            onClick={handleExportExcel}
            leftIcon={<Download className="w-4 h-4" />}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Ekspor Excel (.xlsx)
          </ClayButton>

          <ClayButton
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
            className="flex-1"
          >
            Ekspor CSV
          </ClayButton>
        </div>
      </ClayCard>

      {/* Aggregate Overview Card */}
      <ClayCard className="p-4 border-[#E5E5E5] bg-[#FFFFFF]">
        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
          Ringkasan Periode Terpilih ({totalDays} Hari Produksi)
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
            <div className="text-[10px] text-neutral-500 font-semibold">Total Target</div>
            <div className="text-base font-black text-neutral-800">{totalTargetPlanned}</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
            <div className="text-[10px] text-neutral-500 font-semibold">Total Aktual</div>
            <div className="text-base font-black text-indigo-600">{totalPortionsDistributed}</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
            <div className="text-[10px] text-neutral-500 font-semibold">Pencapaian</div>
            <div className="text-base font-black text-emerald-600">
              {totalTargetPlanned > 0
                ? `${Math.round((totalPortionsDistributed / totalTargetPlanned) * 100)}%`
                : '100%'}
            </div>
          </div>
        </div>
      </ClayCard>

      {/* Printable Report Content */}
      <div className="space-y-4">
        {loading ? (
          <LoadingState message="Menghitung laporan..." />
        ) : filteredRecords.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400 bg-white rounded-2xl border border-dashed border-neutral-200">
            Tidak ada data pemorsian pada rentang filter ini.
          </div>
        ) : (
          filteredRecords.map((r) => (
            <ClayCard key={r.id} className="p-4 sm:p-5 print-break-inside-avoid space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="font-extrabold text-sm sm:text-base text-[#111111]">
                    {r.date}
                  </span>
                </div>
                <div className="text-xs font-bold text-neutral-600">
                  Target: {r.target_portions} | Aktual: {r.total_actual_portions} ({r.progress_percentage}%)
                </div>
              </div>

              {/* Menus and Containers breakdown */}
              <div className="space-y-2">
                {r.menus.map((m) => (
                  <div key={m.id} className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs">
                    <div className="flex items-center justify-between font-bold text-neutral-900 mb-1.5">
                      <span>{m.name} ({m.category})</span>
                      <span className="text-indigo-600">Total: {m.total_actual_portions} porsi</span>
                    </div>

                    {/* Table of containers */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                      {m.containers.map((c) => (
                        <div key={c.id} className="p-1.5 bg-white rounded-lg border border-neutral-200 text-[11px]">
                          <div className="font-bold text-neutral-800">Wadah {c.container_number}</div>
                          <div className="text-emerald-700 font-semibold">Pakai: {c.used_portions}</div>
                          <div className="text-neutral-400">Kum: {c.cumulative_portions}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ClayCard>
          ))
        )}
      </div>
    </div>
  );
};
