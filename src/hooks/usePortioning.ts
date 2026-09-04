import { useState, useCallback } from 'react';
import { portionRepository } from '../repositories/portionRepository';
import { temperatureRepository } from '../repositories/temperatureRepository';

export function usePortioning(onChanged?: () => void) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addContainer = useCallback(
    async (dailyMenuId: string, cumulativePortions: number, notes?: string, containerCount: 1 | 2 = 1) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const res = await portionRepository.addContainer(dailyMenuId, cumulativePortions, notes, containerCount);
        if (res.validationError) {
          setErrorMessage(res.validationError);
          return { success: false, error: res.validationError };
        }
        if (onChanged) onChanged();
        return { success: true, container: res.container, containers: res.containers };
      } catch (err: any) {
        const msg = err.message || 'Gagal menambahkan wadah';
        setErrorMessage(msg);
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [onChanged]
  );

  const updateContainer = useCallback(
    async (containerId: string, newCumulative: number) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const res = await portionRepository.updateContainerCumulative(containerId, newCumulative);
        if (!res.success) {
          setErrorMessage(res.validationError || 'Gagal memperbarui porsi wadah');
          return { success: false, error: res.validationError };
        }
        if (onChanged) onChanged();
        return { success: true };
      } catch (err: any) {
        const msg = err.message || 'Gagal memperbarui wadah';
        setErrorMessage(msg);
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [onChanged]
  );

  const deleteContainer = useCallback(
    async (containerId: string) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        await portionRepository.deleteContainer(containerId);
        if (onChanged) onChanged();
        return { success: true };
      } catch (err: any) {
        const msg = err.message || 'Gagal menghapus wadah';
        setErrorMessage(msg);
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [onChanged]
  );

  const addTemperature = useCallback(
    async (containerId: string, temp: number, measuredAt: string, notes?: string) => {
      try {
        const created = await temperatureRepository.addTemperature(containerId, temp, measuredAt, notes);
        if (onChanged) onChanged();
        return { success: true, temperature: created };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [onChanged]
  );

  const deleteTemperature = useCallback(
    async (tempId: string) => {
      try {
        await temperatureRepository.deleteTemperature(tempId);
        if (onChanged) onChanged();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [onChanged]
  );

  return {
    loading,
    errorMessage,
    setErrorMessage,
    addContainer,
    updateContainer,
    deleteContainer,
    addTemperature,
    deleteTemperature,
  };
}
