import { db } from '../db';
import type { SOPSettings } from '../types';

export const sopRepository = {
  async getSettings(): Promise<SOPSettings> {
    const existing = await db.sop_settings.toCollection().first();
    if (existing) return existing;

    const defaultSOP: SOPSettings = {
      id: 'sop-global',
      min_hot_temp: 60.0,
      max_hot_temp: 95.0,
      min_cold_temp: 0.0,
      max_cold_temp: 10.0,
      notes: 'Standar SOP SPPG Nasional',
      updated_at: new Date().toISOString(),
    };
    await db.sop_settings.add(defaultSOP);
    return defaultSOP;
  },

  async updateSettings(updates: Partial<Omit<SOPSettings, 'id'>>): Promise<SOPSettings> {
    const existing = await this.getSettings();
    const updated: SOPSettings = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    await db.sop_settings.put(updated);
    return updated;
  },
};
