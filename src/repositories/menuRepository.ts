import { db } from '../db';
import { Menu } from '../types';

export const menuRepository = {
  async getAll(): Promise<Menu[]> {
    return db.menus.orderBy('name').toArray();
  },

  async getById(id: string): Promise<Menu | undefined> {
    return db.menus.get(id);
  },

  async create(menuData: Omit<Menu, 'id' | 'created_at' | 'updated_at'>): Promise<Menu> {
    const now = new Date().toISOString();
    const newMenu: Menu = {
      ...menuData,
      id: crypto.randomUUID ? crypto.randomUUID() : 'menu-' + Date.now(),
      created_at: now,
      updated_at: now,
    };
    await db.menus.add(newMenu);
    return newMenu;
  },

  async update(id: string, updates: Partial<Omit<Menu, 'id' | 'created_at'>>): Promise<Menu> {
    const existing = await db.menus.get(id);
    if (!existing) throw new Error(`Menu not found with id: ${id}`);

    const updated: Menu = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    await db.menus.put(updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    await db.menus.delete(id);
  },
};
