import React, { useState } from 'react';
import { useSchools } from '../../hooks/useSchools';
import { School } from '../../types';
import { ClayInput } from '../common/ClayInput';
import { LoadingState, EmptyState, ErrorState } from '../common/States';
import { ConfirmModal } from '../common/ConfirmModal';
import { SchoolFormModal } from './SchoolFormModal';
import { useToast } from '../common/ToastContext';
import { Plus, Search, Edit3, Trash2, School as SchoolIcon, Sun, Sunrise, Info } from 'lucide-react';

export const SchoolListView: React.FC = () => {
  const {
    schools,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    addSchool,
    updateSchool,
    deleteSchool,
    totalDefaultPortions,
    loadSchools,
  } = useSchools();

  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setEditingSchool(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (school: School) => {
    setEditingSchool(school);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingSchool) {
      const res = await updateSchool(editingSchool.id, data);
      if (res.success) {
        showToast('Data sekolah berhasil diperbarui', 'success');
      }
      return res;
    } else {
      const res = await addSchool(data);
      if (res.success) {
        showToast('Sekolah baru berhasil ditambahkan', 'success');
      }
      return res;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSchool) return;
    setIsDeleting(true);
    const res = await deleteSchool(deletingSchool.id);
    setIsDeleting(false);
    if (res.success) {
      showToast('Sekolah berhasil dihapus', 'success');
      setDeletingSchool(null);
    } else {
      showToast(res.error || 'Gagal menghapus sekolah', 'error');
    }
  };

  return (
    <div className="space-y-4 pb-36 max-w-3xl mx-auto px-4 pt-2 animate-in fade-in duration-300">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏫</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Master Data Sekolah</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar sekolah penerima & porsi acuan standar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(99,102,241,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Tambah Sekolah
          </button>
        </div>
      </div>

      {/* Info Notification Banner */}
      <div className="p-3.5 bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/80 border border-indigo-100/90 rounded-2xl flex items-start gap-3 shadow-[0_2px_8px_rgba(99,102,241,0.06),inset_0_1px_2px_#fff]">
        <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="text-xs">
          <p className="font-extrabold text-slate-800">Pengantaran Pagi & Siang Berbeda Setiap Hari?</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Buka sub-tab <strong>"Pengantaran Harian"</strong> di atas untuk mengatur alokasi pagi/siang khusus hari ini hanya dengan 1 kali klik.
          </p>
        </div>
      </div>

      {/* Summary Clay Card */}
      <div className="clay-card-prominent p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-br from-white via-indigo-50/20 to-white">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-[0_6px_16px_rgba(99,102,241,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.4)]">
            <SchoolIcon className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Porsi Acuan Standar
            </div>
            <div className="text-2xl font-black text-slate-800 tabular-nums flex items-baseline gap-1.5">
              {totalDefaultPortions.toLocaleString('id-ID')}{' '}
              <span className="text-xs font-semibold text-slate-500">porsi / hari</span>
            </div>
          </div>
        </div>
        <div className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-indigo-100/80 shadow-[inset_0_1px_2px_#fff]">
          {schools.length} Sekolah Terdaftar
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <ClayInput
          placeholder="Cari nama sekolah, jenjang, atau catatan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftAddon={<Search className="w-4 h-4 text-slate-400" />}
          className="bg-white/90 shadow-[0_2px_6px_rgba(0,0,0,0.03)] focus:bg-white"
        />
      </div>

      {/* Content States */}
      {loading ? (
        <LoadingState message="Memuat daftar sekolah..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadSchools} />
      ) : schools.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada data sekolah'}
          description={
            searchQuery
              ? `Tidak ditemukan sekolah yang cocok dengan "${searchQuery}"`
              : 'Tambahkan sekolah master pertama untuk mulai mengalokasikan pemorsian makanan.'
          }
          actionLabel="Tambah Sekolah Sekarang"
          onAction={handleOpenAdd}
          icon={<SchoolIcon className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-3">
          {schools.map((school) => (
            <div
              key={school.id}
              className="clay-card p-4 sm:p-5 rounded-3xl hover:-translate-y-0.5 transition-all duration-300 relative border border-slate-200/80 bg-white/95 shadow-[0_6px_16px_rgba(15,23,42,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.9)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-slate-800 truncate tracking-tight">
                      {school.name}
                    </h3>
                    <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60 shadow-xs">
                      {school.level}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        const nextPeriod =
                          school.distribution_period === 'Pagi'
                            ? 'Siang'
                            : school.distribution_period === 'Siang'
                            ? 'Keduanya'
                            : 'Pagi';
                        const res = await updateSchool(school.id, { distribution_period: nextPeriod });
                        if (res.success) {
                          showToast(`${school.name}: Default diubah ke ${nextPeriod}`, 'success');
                        }
                      }}
                      className="cursor-pointer transition-all active:scale-95 group"
                      title="Klik untuk ubah periode jadwal default"
                    >
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-extrabold rounded-lg transition-all ${
                          school.distribution_period === 'Pagi'
                            ? 'bg-amber-100/80 text-amber-800 border border-amber-200/80 shadow-[0_2px_6px_rgba(245,158,11,0.2)]'
                            : school.distribution_period === 'Siang'
                            ? 'bg-indigo-100/80 text-indigo-800 border border-indigo-200/80 shadow-[0_2px_6px_rgba(99,102,241,0.2)]'
                            : 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/80 shadow-[0_2px_6px_rgba(16,185,129,0.2)]'
                        }`}
                      >
                        {school.distribution_period === 'Pagi' ? (
                          <Sunrise className="w-3 h-3 stroke-[2.5]" />
                        ) : (
                          <Sun className="w-3 h-3 stroke-[2.5]" />
                        )}
                        {school.distribution_period}
                      </span>
                    </button>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight tabular-nums">
                      {school.default_portions}
                    </span>
                    <span className="text-xs font-bold text-slate-400">porsi acuan</span>
                  </div>

                  {school.notes && (
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                      "{school.notes}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(school)}
                    className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl border border-slate-200/70 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_1px_#fff] transition-all cursor-pointer active:scale-95"
                    title="Edit Sekolah"
                    aria-label="Edit Sekolah"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingSchool(school)}
                    className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl border border-slate-200/70 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_1px_#fff] transition-all cursor-pointer active:scale-95"
                    title="Hapus Sekolah"
                    aria-label="Hapus Sekolah"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <SchoolFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSchool}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingSchool)}
        title="Hapus Sekolah?"
        message={`Apakah Anda yakin ingin menghapus "${deletingSchool?.name}"? Data sekolah ini akan dihapus dari master.`}
        confirmLabel="Hapus Sekarang"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingSchool(null)}
      />
    </div>
  );
};
