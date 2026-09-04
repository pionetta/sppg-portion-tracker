import Dexie, { type EntityTable } from 'dexie';
import {
  School,
  DailyRecord,
  Menu,
  DailyMenu,
  DailySchool,
  PortionContainer,
  TemperatureRecord,
  SOPSettings,
} from '../types';

export interface SyncQueueItem {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: any;
  created_at: string;
  retry_count: number;
}

export class PortionTrackerDB extends Dexie {
  schools!: EntityTable<School, 'id'>;
  daily_records!: EntityTable<DailyRecord, 'id'>;
  menus!: EntityTable<Menu, 'id'>;
  daily_menus!: EntityTable<DailyMenu, 'id'>;
  daily_schools!: EntityTable<DailySchool, 'id'>;
  portion_containers!: EntityTable<PortionContainer, 'id'>;
  temperature_records!: EntityTable<TemperatureRecord, 'id'>;
  sop_settings!: EntityTable<SOPSettings, 'id'>;
  sync_queue!: EntityTable<SyncQueueItem, 'id'>;

  constructor() {
    super('PortionTrackerDB');
    this.version(1).stores({
      schools: 'id, name, level, distribution_period, updated_at',
      daily_records: 'id, date, status, updated_at',
      menus: 'id, name, category, updated_at',
      daily_menus: 'id, daily_record_id, menu_id, name, category, order_index, updated_at',
      daily_schools: 'id, daily_record_id, school_id, distribution_period, updated_at',
      portion_containers: 'id, daily_menu_id, container_number, updated_at',
      temperature_records: 'id, portion_container_id, measured_at, updated_at',
      sop_settings: 'id, updated_at',
      sync_queue: 'id, table_name, record_id, action, created_at',
    });
  }
}

export const db = new PortionTrackerDB();
