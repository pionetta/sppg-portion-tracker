import { db } from '../db';
import { TemperatureRecord, SOPSettings } from '../types';

export const temperatureRepository = {
  async getByContainerId(containerId: string): Promise<TemperatureRecord[]> {
    return db.temperature_records
      .where('portion_container_id')
      .equals(containerId)
      .sortBy('measured_at');
  },

  async addTemperature(
    containerId: string,
    temperature: number,
    measuredAt: string,
    notes?: string
  ): Promise<TemperatureRecord> {
    const now = new Date().toISOString();
    const newRecord: TemperatureRecord = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'tmp-' + Date.now(),
      portion_container_id: containerId,
      temperature,
      measured_at: measuredAt,
      notes: notes || '',
      created_at: now,
      updated_at: now,
    };
    await db.temperature_records.add(newRecord);
    return newRecord;
  },

  async updateTemperature(
    id: string,
    updates: Partial<Omit<TemperatureRecord, 'id' | 'portion_container_id' | 'created_at'>>
  ): Promise<void> {
    await db.temperature_records.update(id, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
  },

  async deleteTemperature(id: string): Promise<void> {
    await db.temperature_records.delete(id);
  },
};

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
