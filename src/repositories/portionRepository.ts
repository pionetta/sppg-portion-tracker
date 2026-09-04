import { db } from '../db';
import type {
  DailyMenu,
  PortionContainer,
  DailyMenuWithContainers,
  ContainerWithTemperatures,
  MenuPortionStatus,
} from '../types';
import {
  calculateMenuTotal,
  calculateRemainingPortions,
  calculateProgress,
  recalculateContainersList,
  validateContainerSequence,
  calculateDualContainerSplit,
} from '../services/portionCalcService';

export const portionRepository = {
  async getDailyMenusWithContainers(dailyRecordId: string): Promise<DailyMenuWithContainers[]> {
    const dailyMenus = await db.daily_menus
      .where('daily_record_id')
      .equals(dailyRecordId)
      .sortBy('order_index');

    const result: DailyMenuWithContainers[] = [];

    for (const menu of dailyMenus) {
      const containers = await db.portion_containers
        .where('daily_menu_id')
        .equals(menu.id)
        .sortBy('container_number');

      const containersWithTemps: ContainerWithTemperatures[] = [];

      for (const cnt of containers) {
        const temps = await db.temperature_records
          .where('portion_container_id')
          .equals(cnt.id)
          .sortBy('measured_at');
        containersWithTemps.push({
          ...cnt,
          temperatures: temps,
        });
      }

      const totalActual = calculateMenuTotal(containers);
      const remaining = calculateRemainingPortions(menu.target_portions, totalActual);
      const progress = calculateProgress(menu.target_portions, totalActual);
      const isCompleted = totalActual >= menu.target_portions && menu.target_portions > 0;
      const exceedsBy = Math.max(0, totalActual - menu.target_portions);

      let portionStatus: MenuPortionStatus = 'belum_dimulai';
      if (containers.length === 0) {
        portionStatus = 'belum_dimulai';
      } else if (totalActual < menu.target_portions) {
        portionStatus = 'dalam_proses';
      } else if (totalActual === menu.target_portions) {
        portionStatus = 'selesai';
      } else if (totalActual > menu.target_portions) {
        portionStatus = 'melebihi_target';
      }

      result.push({
        ...menu,
        containers: containersWithTemps,
        total_actual_portions: totalActual,
        remaining_portions: remaining,
        progress_percentage: progress,
        is_completed: isCompleted,
        portion_status: portionStatus,
        exceeds_target_by: exceedsBy,
      });
    }

    return result;
  },

  async addContainer(
    dailyMenuId: string,
    cumulativePortions: number,
    notes?: string,
    containerCount: 1 | 2 = 1
  ): Promise<{ container: PortionContainer; containers?: PortionContainer[]; validationError?: string }> {
    const existingContainers = await db.portion_containers
      .where('daily_menu_id')
      .equals(dailyMenuId)
      .sortBy('container_number');

    const nextNumber = existingContainers.length + 1;
    const prevVal = existingContainers.length > 0 ? existingContainers[existingContainers.length - 1].cumulative_portions : 0;

    if (cumulativePortions < prevVal) {
      return {
        container: null as any,
        validationError: 'Jumlah porsi kumulatif tidak boleh lebih kecil dari pencatatan sebelumnya.',
      };
    }

    const totalIncrement = Math.max(0, cumulativePortions - prevVal);
    const now = new Date().toISOString();

    if (containerCount === 2) {
      const split = calculateDualContainerSplit(totalIncrement, prevVal);

      const id1 =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : 'cnt-' + Date.now() + '-1-' + Math.random().toString(36).substring(2, 7);

      const id2 =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : 'cnt-' + Date.now() + '-2-' + Math.random().toString(36).substring(2, 7);

      const container1: PortionContainer = {
        id: id1,
        daily_menu_id: dailyMenuId,
        container_number: nextNumber,
        cumulative_portions: split.container1.cumulative_portions,
        used_portions: split.container1.used_portions,
        notes: notes ? `${notes} (Wadah 1/2)` : 'Wadah 1/2',
        created_at: now,
        updated_at: now,
      };

      const container2: PortionContainer = {
        id: id2,
        daily_menu_id: dailyMenuId,
        container_number: nextNumber + 1,
        cumulative_portions: split.container2.cumulative_portions,
        used_portions: split.container2.used_portions,
        notes: notes ? `${notes} (Wadah 2/2)` : 'Wadah 2/2',
        created_at: now,
        updated_at: now,
      };

      await db.transaction('rw', db.portion_containers, async () => {
        await db.portion_containers.add(container1);
        await db.portion_containers.add(container2);
      });

      return { container: container2, containers: [container1, container2] };
    }

    const singleId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : 'cnt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    const newContainer: PortionContainer = {
      id: singleId,
      daily_menu_id: dailyMenuId,
      container_number: nextNumber,
      cumulative_portions: cumulativePortions,
      used_portions: totalIncrement,
      notes: notes || '',
      created_at: now,
      updated_at: now,
    };

    await db.portion_containers.add(newContainer);
    return { container: newContainer, containers: [newContainer] };
  },

  async updateContainerCumulative(
    containerId: string,
    newCumulative: number
  ): Promise<{ success: boolean; validationError?: string }> {
    const target = await db.portion_containers.get(containerId);
    if (!target) return { success: false, validationError: 'Wadah tidak ditemukan.' };

    const allContainers = await db.portion_containers
      .where('daily_menu_id')
      .equals(target.daily_menu_id)
      .sortBy('container_number');

    const updatedList = allContainers.map((c) =>
      c.id === containerId ? { ...c, cumulative_portions: newCumulative } : c
    );

    const validation = validateContainerSequence(
      updatedList.map((c) => ({ container_number: c.container_number, cumulative_portions: c.cumulative_portions }))
    );

    if (!validation.isValid) {
      return { success: false, validationError: validation.errorMessage };
    }

    const recalculated = recalculateContainersList(updatedList.map((c) => c.cumulative_portions));
    const now = new Date().toISOString();

    await db.transaction('rw', db.portion_containers, async () => {
      for (let i = 0; i < allContainers.length; i++) {
        await db.portion_containers.update(allContainers[i].id, {
          cumulative_portions: recalculated[i].cumulative_portions,
          used_portions: recalculated[i].used_portions,
          updated_at: now,
        });
      }
    });

    return { success: true };
  },

  async deleteContainer(containerId: string): Promise<void> {
    const target = await db.portion_containers.get(containerId);
    if (!target) return;

    const menuId = target.daily_menu_id;
    await db.temperature_records.where('portion_container_id').equals(containerId).delete();
    await db.portion_containers.delete(containerId);

    // Re-index remaining containers and recalculate usage
    const remaining = await db.portion_containers
      .where('daily_menu_id')
      .equals(menuId)
      .sortBy('container_number');

    const recalculated = recalculateContainersList(remaining.map((c) => c.cumulative_portions));
    const now = new Date().toISOString();

    await db.transaction('rw', db.portion_containers, async () => {
      for (let i = 0; i < remaining.length; i++) {
        await db.portion_containers.update(remaining[i].id, {
          container_number: i + 1,
          cumulative_portions: recalculated[i].cumulative_portions,
          used_portions: recalculated[i].used_portions,
          updated_at: now,
        });
      }
    });
  },

  async addDailyMenu(
    dailyRecordId: string,
    menu: { name: string; category: any; target_portions: number; menu_id?: string; notes?: string }
  ): Promise<DailyMenu> {
    const existing = await db.daily_menus.where('daily_record_id').equals(dailyRecordId).count();
    const now = new Date().toISOString();
    const newDailyMenu: DailyMenu = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'dmenu-' + Date.now(),
      daily_record_id: dailyRecordId,
      menu_id: menu.menu_id,
      name: menu.name,
      category: menu.category,
      category_name: menu.category,
      target_portions: menu.target_portions,
      notes: menu.notes || '',
      order_index: existing,
      created_at: now,
      updated_at: now,
    };
    await db.daily_menus.add(newDailyMenu);
    return newDailyMenu;
  },

  async updateDailyMenu(id: string, updates: Partial<DailyMenu>): Promise<void> {
    await db.daily_menus.update(id, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
  },

  async deleteDailyMenu(dailyMenuId: string): Promise<void> {
    const containers = await db.portion_containers.where('daily_menu_id').equals(dailyMenuId).toArray();
    for (const c of containers) {
      await db.temperature_records.where('portion_container_id').equals(c.id).delete();
    }
    await db.portion_containers.where('daily_menu_id').equals(dailyMenuId).delete();
    await db.daily_menus.delete(dailyMenuId);
  },
};
