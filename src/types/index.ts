export type DistributionPeriod = 'Pagi' | 'Siang' | 'Keduanya';

export type ProductionStatus = 'draft' | 'in_progress' | 'completed';

export type StandardCategoryName =
  | 'Makanan Pokok'
  | 'Protein Hewani'
  | 'Protein Nabati'
  | 'Sayur'
  | 'Buah'
  | 'Pelengkap'
  | 'Lainnya';

export type MenuCategory = StandardCategoryName | string;

export interface MenuCategoryItem {
  id: string;
  name: StandardCategoryName | string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface School {
  id: string;
  name: string;
  level: string; // e.g., 'SD', 'SMP', 'SMA', 'Lainnya'
  default_portions: number;
  distribution_period: DistributionPeriod;
  default_morning_portions?: number;
  default_afternoon_portions?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyRecord {
  id: string;
  date: string; // YYYY-MM-DD
  target_portions: number;
  status: ProductionStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: string;
  name: string;
  category: MenuCategory;
  category_id?: string;
  category_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyMenu {
  id: string;
  daily_record_id: string;
  menu_id?: string;
  name: string;
  category: MenuCategory;
  category_id?: string;
  category_name?: string;
  target_portions: number;
  notes?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface DailySchool {
  id: string;
  daily_record_id: string;
  school_id: string;
  school_name: string;
  portions: number;
  distribution_period: DistributionPeriod;
  morning_portions?: number;
  afternoon_portions?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PortionContainer {
  id: string;
  daily_menu_id: string;
  container_number: number;
  cumulative_portions: number;
  used_portions: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TemperatureRecord {
  id: string;
  portion_container_id: string;
  temperature: number; // in Celsius e.g. 72.5
  measured_at: string; // HH:mm
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SOPSettings {
  id: string;
  min_hot_temp: number; // e.g. 60.0°C
  max_hot_temp?: number;
  min_cold_temp?: number;
  max_cold_temp?: number; // e.g. 10.0°C
  notes?: string;
  updated_at: string;
}

export interface LastActivity {
  date: string;
  menuId: string;
  menuName: string;
  containerNumber?: number;
  cumulativePortions?: number;
  updatedAt: string;
}

// Aggregated View Types
export interface ContainerWithTemperatures extends PortionContainer {
  temperatures: TemperatureRecord[];
}

export type MenuPortionStatus =
  | 'belum_dimulai'
  | 'dalam_proses'
  | 'selesai'
  | 'melebihi_target';

export interface DailyMenuWithContainers extends DailyMenu {
  containers: ContainerWithTemperatures[];
  total_actual_portions: number;
  remaining_portions: number;
  progress_percentage: number;
  is_completed: boolean;
  portion_status: MenuPortionStatus;
  exceeds_target_by: number;
}

export interface DailyRecordDetail extends DailyRecord {
  menus: DailyMenuWithContainers[];
  schools: DailySchool[];
  total_actual_portions: number;
  total_school_allocations: number;
  allocation_difference: number; // school allocations - target_portions
  remaining_portions: number;
  progress_percentage: number;
  morning_allocations: number;
  afternoon_allocations: number;
  both_allocations: number;
  completed_menus_count: number;
  total_menus_count: number;
}

export interface SyncStatus {
  isOnline: boolean;
  pendingSyncCount: number;
  lastSyncedAt?: string;
}
