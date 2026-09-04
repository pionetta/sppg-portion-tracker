import { useState, useEffect, useCallback } from 'react';
import { DailyRecordDetail, DistributionPeriod, MenuCategory } from '../types';
import { dailyRecordRepository } from '../repositories/dailyRecordRepository';
import { portionRepository } from '../repositories/portionRepository';
import { format } from 'date-fns';

export function useDailyProduction(initialDate?: string) {
  const [currentDate, setCurrentDate] = useState<string>(
    initialDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [dailyData, setDailyData] = useState<DailyRecordDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dailyRecordRepository.getOrCreateDailyRecord(currentDate);
      setDailyData(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat catatan produksi harian');
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateTargetPortions = async (target: number) => {
    if (!dailyData) return;
    try {
      await dailyRecordRepository.updateRecord(dailyData.id, { target_portions: target });
      await loadData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateStatus = async (status: 'in_progress' | 'completed') => {
    if (!dailyData) return;
    try {
      await dailyRecordRepository.updateRecord(dailyData.id, { status });
      await loadData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateDailySchoolPortion = async (dailySchoolId: string, portions: number, period?: DistributionPeriod) => {
    try {
      await dailyRecordRepository.updateDailySchoolPortions(dailySchoolId, portions, period);
      await loadData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateDailySchoolPeriod = async (dailySchoolId: string, period: DistributionPeriod) => {
    try {
      await dailyRecordRepository.updateDailySchoolPeriod(dailySchoolId, period);
      await loadData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const setAllDailySchoolsPeriod = async (period: DistributionPeriod) => {
    if (!dailyData) return { success: false, error: 'Tidak ada data harian' };
    try {
      await dailyRecordRepository.setAllDailySchoolsPeriod(dailyData.id, period);
      await loadData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateDailySchoolSplit = async (dailySchoolId: string, morningPortions: number, afternoonPortions: number) => {
    try {
      await dailyRecordRepository.updateDailySchoolSplit(dailySchoolId, morningPortions, afternoonPortions);
      await loadData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const splitAllDailySchoolsEvenly = async () => {
    if (!dailyData) return { success: false, error: 'Tidak ada data harian' };
    try {
      await dailyRecordRepository.splitAllDailySchoolsEvenly(dailyData.id);
      await loadData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const resetDailySchoolsToMaster = async () => {
    if (!dailyData) return { success: false, error: 'Tidak ada data harian' };
    try {
      await dailyRecordRepository.resetDailySchoolsToMaster(dailyData.id);
      await loadData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const copyPreviousDay = async () => {
    try {
      const result = await dailyRecordRepository.copyFromPreviousDay(currentDate);
      if (result.success) {
        await loadData();
      }
      return result;
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal menyalin data hari sebelumnya' };
    }
  };

  const addDailyMenu = async (menuData: {
    name: string;
    category: MenuCategory;
    target_portions: number;
    menu_id?: string;
    notes?: string;
  }) => {
    if (!dailyData) return { success: false, error: 'No daily record' };
    try {
      const created = await portionRepository.addDailyMenu(dailyData.id, menuData);
      await loadData();
      return { success: true, dailyMenu: created };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteDailyMenu = async (dailyMenuId: string) => {
    try {
      await portionRepository.deleteDailyMenu(dailyMenuId);
      await loadData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    currentDate,
    setCurrentDate,
    dailyData,
    loading,
    error,
    refresh: loadData,
    updateTargetPortions,
    updateStatus,
    updateDailySchoolPortion,
    updateDailySchoolPeriod,
    updateDailySchoolSplit,
    setAllDailySchoolsPeriod,
    splitAllDailySchoolsEvenly,
    resetDailySchoolsToMaster,
    copyPreviousDay,
    addDailyMenu,
    deleteDailyMenu,
  };
}
