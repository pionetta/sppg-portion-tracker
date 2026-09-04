import { useState, useEffect, useCallback } from 'react';
import { Menu, MenuCategory } from '../types';
import { menuRepository } from '../repositories/menuRepository';

export function useMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMenus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuRepository.getAll();
      setMenus(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data menu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const addMenu = async (data: { name: string; category: MenuCategory; notes?: string }) => {
    try {
      const created = await menuRepository.create(data);
      await loadMenus();
      return { success: true, menu: created };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateMenu = async (id: string, updates: Partial<Omit<Menu, 'id' | 'created_at'>>) => {
    try {
      const updated = await menuRepository.update(id, updates);
      await loadMenus();
      return { success: true, menu: updated };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteMenu = async (id: string) => {
    try {
      await menuRepository.delete(id);
      await loadMenus();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    menus,
    loading,
    error,
    loadMenus,
    addMenu,
    updateMenu,
    deleteMenu,
  };
}
