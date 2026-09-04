import { db } from '../db';
import type { DailyRecord, DailyRecordDetail, DailySchool, DailyMenu, DistributionPeriod } from '../types';
import { portionRepository } from './portionRepository';
import { schoolRepository } from './schoolRepository';
import {
  calculateDailyTotal,
  calculateRemainingPortions,
  calculateProgress,
  calculateSchoolAllocation,
} from '../services/portionCalcService';

export const dailyRecordRepository = {
  async getByDate(dateStr: string): Promise<DailyRecord | undefined> {
    return db.daily_records.where('date').equals(dateStr).first();
  },

  async getAll(): Promise<DailyRecord[]> {
    return db.daily_records.orderBy('date').reverse().toArray();
  },

  async getDetailByDate(dateStr: string): Promise<DailyRecordDetail | null> {
    const record = await this.getByDate(dateStr);
    if (!record) return null;

    const menus = await portionRepository.getDailyMenusWithContainers(record.id);
    const rawSchools = await db.daily_schools.where('daily_record_id').equals(record.id).toArray();

    // Ensure every school has explicit morning_portions and afternoon_portions
    const schools: DailySchool[] = rawSchools.map((s) => {
      if (typeof s.morning_portions !== 'number' || typeof s.afternoon_portions !== 'number') {
        const m =
          s.distribution_period === 'Pagi'
            ? s.portions
            : s.distribution_period === 'Keduanya'
            ? Math.ceil(s.portions / 2)
            : 0;
        const a =
          s.distribution_period === 'Siang'
            ? s.portions
            : s.distribution_period === 'Keduanya'
            ? Math.floor(s.portions / 2)
            : 0;
        return {
          ...s,
          morning_portions: m,
          afternoon_portions: a,
        };
      }
      return s;
    });

    const menuTotals = menus.map((m) => m.total_actual_portions);
    const totalActual = calculateDailyTotal(menuTotals);
    const totalAllocations = calculateSchoolAllocation(schools);
    const remaining = calculateRemainingPortions(record.target_portions, totalActual);
    const progress = calculateProgress(record.target_portions, totalActual);

    const morningAllocations = calculateSchoolAllocation(schools, 'Pagi');
    const afternoonAllocations = calculateSchoolAllocation(schools, 'Siang');
    const bothAllocations = calculateSchoolAllocation(schools, 'Keduanya');

    const completedMenus = menus.filter((m) => m.total_actual_portions >= m.target_portions && m.target_portions > 0);

    return {
      ...record,
      menus,
      schools,
      total_actual_portions: totalActual,
      total_school_allocations: totalAllocations,
      allocation_difference: totalAllocations - record.target_portions,
      remaining_portions: remaining,
      progress_percentage: progress,
      morning_allocations: morningAllocations,
      afternoon_allocations: afternoonAllocations,
      both_allocations: bothAllocations,
      completed_menus_count: completedMenus.length,
      total_menus_count: menus.length,
    };
  },

  async getOrCreateDailyRecord(dateStr: string): Promise<DailyRecordDetail> {
    let record = await this.getByDate(dateStr);
    const now = new Date().toISOString();

    if (!record) {
      // Auto populate schools from master data
      const masterSchools = await schoolRepository.getAll();
      const totalDefaultPortions = masterSchools.reduce((acc, s) => acc + (s.default_portions || 0), 0);

      const newRecordId = crypto.randomUUID ? crypto.randomUUID() : 'rec-' + Date.now();
      const initialTarget = totalDefaultPortions > 0 ? totalDefaultPortions : 500;

      record = {
        id: newRecordId,
        date: dateStr,
        target_portions: initialTarget,
        status: 'draft',
        notes: '',
        created_at: now,
        updated_at: now,
      };

      await db.daily_records.add(record);

      const dailySchools: DailySchool[] = masterSchools.map((s) => {
        const m =
          typeof s.default_morning_portions === 'number'
            ? s.default_morning_portions
            : s.distribution_period === 'Pagi'
            ? s.default_portions
            : s.distribution_period === 'Keduanya'
            ? Math.ceil(s.default_portions / 2)
            : 0;
        const a =
          typeof s.default_afternoon_portions === 'number'
            ? s.default_afternoon_portions
            : s.distribution_period === 'Siang'
            ? s.default_portions
            : s.distribution_period === 'Keduanya'
            ? Math.floor(s.default_portions / 2)
            : 0;

        return {
          id: crypto.randomUUID ? crypto.randomUUID() : 'dsch-' + Math.random().toString(36).substring(2, 9),
          daily_record_id: newRecordId,
          school_id: s.id,
          school_name: s.name,
          portions: s.default_portions,
          distribution_period: s.distribution_period,
          morning_portions: m,
          afternoon_portions: a,
          notes: s.notes,
          created_at: now,
          updated_at: now,
        };
      });

      if (dailySchools.length > 0) {
        await db.daily_schools.bulkAdd(dailySchools);
      }
    }

    const detail = await this.getDetailByDate(dateStr);
    return detail!;
  },

  async updateRecord(id: string, updates: Partial<DailyRecord>): Promise<void> {
    const now = new Date().toISOString();
    await db.transaction('rw', [db.daily_records, db.daily_menus], async () => {
      await db.daily_records.update(id, {
        ...updates,
        updated_at: now,
      });

      // Target cascade: If target_portions is updated, cascade to all daily_menus
      if (typeof updates.target_portions === 'number') {
        const menus = await db.daily_menus.where('daily_record_id').equals(id).toArray();
        for (const m of menus) {
          await db.daily_menus.update(m.id, {
            target_portions: updates.target_portions,
            updated_at: now,
          });
        }
      }
    });
  },

  async updateDailySchoolPortions(dailySchoolId: string, portions: number, period?: any): Promise<void> {
    const school = await db.daily_schools.get(dailySchoolId);
    const resolvedPeriod = period || school?.distribution_period || 'Pagi';
    let morning = school?.morning_portions ?? (resolvedPeriod === 'Pagi' ? portions : 0);
    let afternoon = school?.afternoon_portions ?? (resolvedPeriod === 'Siang' ? portions : 0);

    if (resolvedPeriod === 'Pagi') {
      morning = portions;
      afternoon = 0;
    } else if (resolvedPeriod === 'Siang') {
      morning = 0;
      afternoon = portions;
    }

    const updatePayload: Partial<DailySchool> = {
      portions,
      distribution_period: resolvedPeriod,
      morning_portions: morning,
      afternoon_portions: afternoon,
      updated_at: new Date().toISOString(),
    };
    await db.daily_schools.update(dailySchoolId, updatePayload);
  },

  async updateDailySchoolSplit(
    dailySchoolId: string,
    morningPortions: number,
    afternoonPortions: number
  ): Promise<void> {
    const morning = Math.max(0, morningPortions);
    const afternoon = Math.max(0, afternoonPortions);
    const total = morning + afternoon;
    let period: DistributionPeriod = 'Pagi';
    if (morning > 0 && afternoon > 0) {
      period = 'Keduanya';
    } else if (afternoon > 0) {
      period = 'Siang';
    }

    await db.daily_schools.update(dailySchoolId, {
      morning_portions: morning,
      afternoon_portions: afternoon,
      portions: total,
      distribution_period: period,
      updated_at: new Date().toISOString(),
    });
  },

  async updateDailySchoolPeriod(dailySchoolId: string, period: DistributionPeriod): Promise<void> {
    const school = await db.daily_schools.get(dailySchoolId);
    const currentPortions = school?.portions || 0;
    let morning = 0;
    let afternoon = 0;
    if (period === 'Pagi') {
      morning = currentPortions;
      afternoon = 0;
    } else if (period === 'Siang') {
      morning = 0;
      afternoon = currentPortions;
    } else if (period === 'Keduanya') {
      morning = Math.ceil(currentPortions / 2);
      afternoon = Math.floor(currentPortions / 2);
    }

    await db.daily_schools.update(dailySchoolId, {
      distribution_period: period,
      morning_portions: morning,
      afternoon_portions: afternoon,
      updated_at: new Date().toISOString(),
    });
  },

  async setAllDailySchoolsPeriod(dailyRecordId: string, period: DistributionPeriod): Promise<void> {
    const now = new Date().toISOString();
    await db.transaction('rw', db.daily_schools, async () => {
      const schools = await db.daily_schools.where('daily_record_id').equals(dailyRecordId).toArray();
      for (const s of schools) {
        let morning = 0;
        let afternoon = 0;
        if (period === 'Pagi') {
          morning = s.portions;
          afternoon = 0;
        } else if (period === 'Siang') {
          morning = 0;
          afternoon = s.portions;
        } else if (period === 'Keduanya') {
          morning = Math.ceil(s.portions / 2);
          afternoon = Math.floor(s.portions / 2);
        }
        await db.daily_schools.update(s.id, {
          distribution_period: period,
          morning_portions: morning,
          afternoon_portions: afternoon,
          updated_at: now,
        });
      }
    });
  },

  async splitAllDailySchoolsEvenly(dailyRecordId: string): Promise<void> {
    await this.setAllDailySchoolsPeriod(dailyRecordId, 'Keduanya');
  },

  async resetDailySchoolsToMaster(dailyRecordId: string): Promise<void> {
    const masterSchools = await schoolRepository.getAll();
    const now = new Date().toISOString();
    await db.transaction('rw', db.daily_schools, async () => {
      await db.daily_schools.where('daily_record_id').equals(dailyRecordId).delete();
      const dailySchools: DailySchool[] = masterSchools.map((s) => {
        const m =
          typeof s.default_morning_portions === 'number'
            ? s.default_morning_portions
            : s.distribution_period === 'Pagi'
            ? s.default_portions
            : s.distribution_period === 'Keduanya'
            ? Math.ceil(s.default_portions / 2)
            : 0;
        const a =
          typeof s.default_afternoon_portions === 'number'
            ? s.default_afternoon_portions
            : s.distribution_period === 'Siang'
            ? s.default_portions
            : s.distribution_period === 'Keduanya'
            ? Math.floor(s.default_portions / 2)
            : 0;
        return {
          id: crypto.randomUUID ? crypto.randomUUID() : 'dsch-' + Math.random().toString(36).substring(2, 9),
          daily_record_id: dailyRecordId,
          school_id: s.id,
          school_name: s.name,
          portions: s.default_portions,
          distribution_period: s.distribution_period,
          morning_portions: m,
          afternoon_portions: a,
          notes: s.notes,
          created_at: now,
          updated_at: now,
        };
      });
      if (dailySchools.length > 0) {
        await db.daily_schools.bulkAdd(dailySchools);
      }
    });
  },

  async addDailySchool(
    dailyRecordId: string,
    schoolId: string,
    name: string,
    portions: number,
    period: any
  ): Promise<DailySchool> {
    const now = new Date().toISOString();
    const newDailySchool: DailySchool = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'dsch-' + Date.now(),
      daily_record_id: dailyRecordId,
      school_id: schoolId,
      school_name: name,
      portions,
      distribution_period: period,
      created_at: now,
      updated_at: now,
    };
    await db.daily_schools.add(newDailySchool);
    return newDailySchool;
  },

  async removeDailySchool(dailySchoolId: string): Promise<void> {
    await db.daily_schools.delete(dailySchoolId);
  },

  /**
   * "Salin Pembagian Hari Sebelumnya"
   * Copies school portions and menu configurations from the most recent previous record.
   */
  async copyFromPreviousDay(targetDateStr: string): Promise<{ success: boolean; message: string }> {
    const targetRecord = await this.getByDate(targetDateStr);
    if (!targetRecord) return { success: false, message: 'Data hari ini belum dibuat.' };

    const previousRecords = await db.daily_records
      .filter((r) => r.date < targetDateStr)
      .sortBy('date');

    if (previousRecords.length === 0) {
      return { success: false, message: 'Tidak ditemukan catatan hari sebelumnya untuk disalin.' };
    }

    const latestPrevious = previousRecords[previousRecords.length - 1];
    const prevSchools = await db.daily_schools.where('daily_record_id').equals(latestPrevious.id).toArray();
    const prevMenus = await db.daily_menus.where('daily_record_id').equals(latestPrevious.id).toArray();

    const now = new Date().toISOString();

    await db.transaction('rw', [db.daily_records, db.daily_schools, db.daily_menus], async () => {
      // 1. Update Target Portions
      await db.daily_records.update(targetRecord.id, {
        target_portions: latestPrevious.target_portions,
        updated_at: now,
      });

      // 2. Replace current schools with copied schools
      await db.daily_schools.where('daily_record_id').equals(targetRecord.id).delete();
      const newSchools: DailySchool[] = prevSchools.map((s) => ({
        id: crypto.randomUUID ? crypto.randomUUID() : 'dsch-' + Math.random().toString(36).substring(2, 9),
        daily_record_id: targetRecord.id,
        school_id: s.school_id,
        school_name: s.school_name,
        portions: s.portions,
        distribution_period: s.distribution_period,
        morning_portions: s.morning_portions,
        afternoon_portions: s.afternoon_portions,
        notes: s.notes,
        created_at: now,
        updated_at: now,
      }));
      if (newSchools.length > 0) {
        await db.daily_schools.bulkAdd(newSchools);
      }

      // 3. If target currently has 0 menus, copy the menus with the new target
      const existingMenusCount = await db.daily_menus.where('daily_record_id').equals(targetRecord.id).count();
      if (existingMenusCount === 0 && prevMenus.length > 0) {
        const newMenus: DailyMenu[] = prevMenus.map((m) => ({
          id: crypto.randomUUID ? crypto.randomUUID() : 'dmenu-' + Math.random().toString(36).substring(2, 9),
          daily_record_id: targetRecord.id,
          menu_id: m.menu_id,
          name: m.name,
          category: m.category,
          category_id: m.category_id,
          category_name: m.category_name || m.category,
          target_portions: latestPrevious.target_portions,
          notes: m.notes,
          order_index: m.order_index,
          created_at: now,
          updated_at: now,
        }));
        await db.daily_menus.bulkAdd(newMenus);
      }
    });

    return {
      success: true,
      message: `Berhasil menyalin pembagian dari tanggal ${latestPrevious.date}!`,
    };
  },
};
