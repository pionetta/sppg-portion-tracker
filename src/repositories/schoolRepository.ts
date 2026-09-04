import { db } from '../db';
import { School } from '../types';

export const schoolRepository = {
  async getAll(): Promise<School[]> {
    return db.schools.orderBy('name').toArray();
  },

  async getById(id: string): Promise<School | undefined> {
    return db.schools.get(id);
  },

  async create(schoolData: Omit<School, 'id' | 'created_at' | 'updated_at'>): Promise<School> {
    const now = new Date().toISOString();
    const newSchool: School = {
      ...schoolData,
      id: crypto.randomUUID ? crypto.randomUUID() : 'sch-' + Date.now(),
      created_at: now,
      updated_at: now,
    };
    await db.schools.add(newSchool);
    return newSchool;
  },

  async update(id: string, updates: Partial<Omit<School, 'id' | 'created_at'>>): Promise<School> {
    const existing = await db.schools.get(id);
    if (!existing) throw new Error(`School not found with id: ${id}`);
    
    const updated: School = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    await db.schools.put(updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    await db.schools.delete(id);
  },

  async search(query: string): Promise<School[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();
    return db.schools
      .filter((s) => s.name.toLowerCase().includes(q) || s.level.toLowerCase().includes(q) || (s.notes || '').toLowerCase().includes(q))
      .toArray();
  },
};
