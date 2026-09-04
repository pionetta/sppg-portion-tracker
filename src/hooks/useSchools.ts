import { useState, useEffect, useCallback } from 'react';
import { School, DistributionPeriod } from '../types';
import { schoolRepository } from '../repositories/schoolRepository';

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const loadSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = searchQuery ? await schoolRepository.search(searchQuery) : await schoolRepository.getAll();
      setSchools(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data sekolah');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  const addSchool = async (data: {
    name: string;
    level: string;
    default_portions: number;
    distribution_period: DistributionPeriod;
    notes?: string;
  }) => {
    try {
      const created = await schoolRepository.create(data);
      await loadSchools();
      return { success: true, school: created };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateSchool = async (
    id: string,
    updates: Partial<Omit<School, 'id' | 'created_at'>>
  ) => {
    try {
      const updated = await schoolRepository.update(id, updates);
      await loadSchools();
      return { success: true, school: updated };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteSchool = async (id: string) => {
    try {
      await schoolRepository.delete(id);
      await loadSchools();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const totalDefaultPortions = schools.reduce((acc, s) => acc + (s.default_portions || 0), 0);

  return {
    schools,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    loadSchools,
    addSchool,
    updateSchool,
    deleteSchool,
    totalDefaultPortions,
  };
}
