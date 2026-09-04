import React, { useState } from 'react';
import { useSchools } from '../../hooks/useSchools';
import { School } from '../../types';
import { ClayCard } from '../common/ClayCard';
import { ClayButton } from '../common/ClayButton';
import { ClayInput } from '../common/ClayInput';
import { Badge } from '../common/Badge';
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
    <div className="space-y-4 pb-24 max-w-2xl mx-auto px-4 pt-2">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#111111] tracking-tight">Master Data Sekolah</h2>
          <p className="text-xs text-[#666666]">
            Daftar sekolah penerima & porsi standar. Pengantaran harian dapat diatur pada tab Pengantaran.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ClayButton
            variant="primary"
            onClick={handleOpenAdd}
            leftIcon={<Plus className="w-4 h-4" />}
            size="sm"
          >
            Tambah Sekolah
          </ClayButton>
        </div>
      </div>

      {/* Info Notification Banner */}
      <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-2xl flex items-start gap-2.5 text-xs text-neutral-800">
        <Info className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-bold">Pengantaran Pagi & Siang Berbeda Setiap Hari?</p>
          <p className="text-[11px] text-neutral-600 mt-0.5">
            Buka tab <strong>"Pengantaran Harian"</strong> untuk menentukan jadwal pagi/siang tiap sekolah khusus hari ini hanya dengan 1 kali klik.
          </p>
        </div>
      </div>

      {/* Summary Clay Card */}
      <ClayCard className="bg-[#FFFFFF] border-[#E5E5E5] flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <SchoolIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Porsi Default
            </div>
            <div className="text-xl font-bold text-[#111111] tabular-nums">
              {totalDefaultPortions.toLocaleString('id-ID')}{' '}
              <span className="text-xs font-medium text-neutral-500">porsi / hari</span>
            </div>
          </div>
        </div>
        <Badge variant="neutral" size="md">
          {schools.length} Sekolah
        </Badge>
      </ClayCard>

      {/* Search Input */}
      <div className="relative">
        <ClayInput
          placeholder="Cari nama sekolah, jenjang, atau catatan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftAddon={<Search className="w-4 h-4" />}
          className="bg-white"
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
        <div className="space-y-2.5">
          {schools.map((school) => (
            <ClayCard key={school.id} variant="default" className="p-4 hover:border-neutral-300 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-[#111111] truncate">
                      {school.name}
                    </h3>
                    <Badge variant="neutral" size="sm">
                      {school.level}
                    </Badge>
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
                      className="cursor-pointer transition-transform active:scale-95"
                      title="Klik untuk ubah periode default"
                    >
                      <Badge
                        variant={
                          school.distribution_period === 'Pagi'
                            ? 'warning'
                            : school.distribution_period === 'Siang'
                            ? 'primary'
                            : 'success'
                        }
                        size="sm"
                      >
                        {school.distribution_period === 'Pagi' ? (
                          <Sunrise className="w-3 h-3" />
                        ) : (
                          <Sun className="w-3 h-3" />
                        )}
                        {school.distribution_period}
                      </Badge>
                    </button>
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-indigo-600 tracking-tight">
                      {school.default_portions}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500">porsi default</span>
                  </div>

                  {school.notes && (
                    <p className="mt-1 text-xs text-neutral-500 line-clamp-2 italic">
                      "{school.notes}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(school)}
                    className="p-2 text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100 rounded-xl transition-all"
                    title="Edit Sekolah"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingSchool(school)}
                    className="p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Hapus Sekolah"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </ClayCard>
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
