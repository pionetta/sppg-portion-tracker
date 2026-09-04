import { db } from './index';
import type { School, Menu, SOPSettings, DailyRecord, DailySchool, DailyMenu, PortionContainer, TemperatureRecord } from '../types';
import { format } from 'date-fns';

export async function seedInitialDataIfNeeded() {
  const schoolCount = await db.schools.count();
  if (schoolCount > 0) return;

  await populateStandardSchoolsAndData();
}

export async function populateStandardSchoolsAndData() {
  const now = new Date().toISOString();
  const todayDate = format(new Date(), 'yyyy-MM-dd');

  // 1. User's 10 Real Schools from SPPG
  const initialSchools: School[] = [
    {
      id: 'sch-1',
      name: '3B',
      level: 'Lainnya',
      default_portions: 303,
      distribution_period: 'Pagi',
      notes: 'Penerima kloter pagi',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sch-2',
      name: 'Pesantren',
      level: 'SD',
      default_portions: 22,
      distribution_period: 'Pagi',
      notes: 'Pesantren',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sch-3',
      name: 'RA Al-Hidayah',
      level: 'PAUD/TK',
      default_portions: 38,
      distribution_period: 'Pagi',
      notes: 'Kloter pagi PAUD/TK',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sch-4',
      name: 'RA Al-Ikhlas',
      level: 'PAUD/TK',
      default_portions: 33,
      distribution_period: 'Pagi',
      notes: 'Kloter pagi PAUD/TK',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sch-5',
      name: 'SD Kalangtubung 1',
      level: 'SD',
      default_portions: 320,
      distribution_period: 'Pagi',
      notes: 'SD Negeri',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sch-6',
      name: 'SD Kalangtubung 2',
      level: 'SD',
      default_portions: 204,
      distribution_period: 'Pagi',
      notes: 'SD Negeri',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sch-7',
      name: 'SD Pajjaiyang',
      level: 'SD',
      default_portions: 259,
      distribution_period: 'Pagi',
      notes: 'SD Negeri',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sch-8',
      name: 'SD Sudiang',
      level: 'SD',
      default_portions: 231,
      distribution_period: 'Pagi',
      notes: 'SD Negeri',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sch-9',
      name: 'SMP 14',
      level: 'SMP',
      default_portions: 986,
      distribution_period: 'Pagi',
      notes: 'SMP Negeri 14',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sch-10',
      name: 'SMP 16',
      level: 'SMP',
      default_portions: 432,
      distribution_period: 'Pagi',
      notes: 'SMP Negeri 16',
      created_at: now,
      updated_at: now,
    },
  ];

  // 2. Initial Master Menus
  const initialMenus: Menu[] = [
    {
      id: 'menu-1',
      name: 'Nasi Putih Pulen',
      category: 'Makanan Pokok',
      category_id: 'cat-1',
      category_name: 'Makanan Pokok',
      notes: 'Beras pulen',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'menu-2',
      name: 'Ayam Goreng Lengkuas',
      category: 'Protein Hewani',
      category_id: 'cat-2',
      category_name: 'Protein Hewani',
      notes: 'Standar SPPG',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'menu-3',
      name: 'Tempe Bacem Gurih',
      category: 'Protein Nabati',
      category_id: 'cat-3',
      category_name: 'Protein Nabati',
      notes: 'Potongan tebal',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'menu-4',
      name: 'Sayur Tumis Kangkung',
      category: 'Sayur',
      category_id: 'cat-4',
      category_name: 'Sayur',
      notes: 'Sayur bumbu bawang',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'menu-5',
      name: 'Pisang Cavendish',
      category: 'Buah',
      category_id: 'cat-5',
      category_name: 'Buah',
      notes: '1 buah per porsi',
      created_at: now,
      updated_at: now,
    },
  ];

  // 3. Initial SOP Settings
  const initialSOP: SOPSettings = {
    id: 'sop-global',
    min_hot_temp: 60.0,
    max_hot_temp: 95.0,
    min_cold_temp: 0.0,
    max_cold_temp: 10.0,
    notes: 'Standar SOP SPPG Nasional',
    updated_at: now,
  };

  const totalDefaultPortions = initialSchools.reduce((acc, s) => acc + s.default_portions, 0); // 2928

  // 4. Initial Daily Record for Today (Total target matches school allocation)
  const todayRecord: DailyRecord = {
    id: 'rec-today',
    date: todayDate,
    target_portions: totalDefaultPortions,
    status: 'in_progress',
    notes: 'Produksi harian SPPG reguler',
    created_at: now,
    updated_at: now,
  };

  const dailySchools: DailySchool[] = initialSchools.map((s, idx) => ({
    id: `dsch-${idx + 1}`,
    daily_record_id: 'rec-today',
    school_id: s.id,
    school_name: s.name,
    portions: s.default_portions,
    distribution_period: s.distribution_period,
    notes: s.notes,
    created_at: now,
    updated_at: now,
  }));

  const dailyMenus: DailyMenu[] = [
    {
      id: 'dmenu-1',
      daily_record_id: 'rec-today',
      menu_id: 'menu-1',
      name: 'Nasi Putih Pulen',
      category: 'Makanan Pokok',
      category_id: 'cat-1',
      category_name: 'Makanan Pokok',
      target_portions: totalDefaultPortions,
      order_index: 0,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'dmenu-2',
      daily_record_id: 'rec-today',
      menu_id: 'menu-2',
      name: 'Ayam Goreng Lengkuas',
      category: 'Protein Hewani',
      category_id: 'cat-2',
      category_name: 'Protein Hewani',
      target_portions: totalDefaultPortions,
      order_index: 1,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'dmenu-3',
      daily_record_id: 'rec-today',
      menu_id: 'menu-3',
      name: 'Tempe Bacem Gurih',
      category: 'Protein Nabati',
      category_id: 'cat-3',
      category_name: 'Protein Nabati',
      target_portions: totalDefaultPortions,
      order_index: 2,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'dmenu-4',
      daily_record_id: 'rec-today',
      menu_id: 'menu-4',
      name: 'Sayur Tumis Kangkung',
      category: 'Sayur',
      category_id: 'cat-4',
      category_name: 'Sayur',
      target_portions: totalDefaultPortions,
      order_index: 3,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'dmenu-5',
      daily_record_id: 'rec-today',
      menu_id: 'menu-5',
      name: 'Pisang Cavendish',
      category: 'Buah',
      category_id: 'cat-5',
      category_name: 'Buah',
      target_portions: totalDefaultPortions,
      order_index: 4,
      created_at: now,
      updated_at: now,
    },
  ];

  // Sample containers
  const containers: PortionContainer[] = [
    {
      id: 'cnt-1',
      daily_menu_id: 'dmenu-1',
      container_number: 1,
      cumulative_portions: 1000,
      used_portions: 1000,
      notes: 'Wadah Kloter Pagi 1',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'cnt-2',
      daily_menu_id: 'dmenu-1',
      container_number: 2,
      cumulative_portions: 2000,
      used_portions: 1000,
      notes: 'Wadah Kloter Pagi 2',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'cnt-3',
      daily_menu_id: 'dmenu-1',
      container_number: 3,
      cumulative_portions: 2928,
      used_portions: 928,
      notes: 'Wadah Kloter Siang',
      created_at: now,
      updated_at: now,
    },
  ];

  const temps: TemperatureRecord[] = [
    {
      id: 'tmp-1',
      portion_container_id: 'cnt-1',
      temperature: 73.5,
      measured_at: '09:45',
      notes: 'Suhu optimal distribusi pagi',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'tmp-2',
      portion_container_id: 'cnt-2',
      temperature: 72.0,
      measured_at: '10:15',
      notes: 'Suhu saat pengisian',
      created_at: now,
      updated_at: now,
    },
  ];

  await db.transaction('rw', [
    db.schools,
    db.menus,
    db.sop_settings,
    db.daily_records,
    db.daily_schools,
    db.daily_menus,
    db.portion_containers,
    db.temperature_records,
  ], async () => {
    await db.schools.clear();
    await db.schools.bulkAdd(initialSchools);

    if ((await db.menus.count()) === 0) {
      await db.menus.bulkAdd(initialMenus);
    }
    if ((await db.sop_settings.count()) === 0) {
      await db.sop_settings.add(initialSOP);
    }

    // Refresh today's record with the real schools
    const existingToday = await db.daily_records.where('date').equals(todayDate).first();
    if (existingToday) {
      await db.daily_schools.where('daily_record_id').equals(existingToday.id).delete();
      const updatedDailySchools = initialSchools.map((s, idx) => ({
        id: `dsch-${idx + 1}`,
        daily_record_id: existingToday.id,
        school_id: s.id,
        school_name: s.name,
        portions: s.default_portions,
        distribution_period: s.distribution_period,
        notes: s.notes,
        created_at: now,
        updated_at: now,
      }));
      await db.daily_schools.bulkAdd(updatedDailySchools);
      await db.daily_records.update(existingToday.id, {
        target_portions: totalDefaultPortions,
        updated_at: now,
      });
    } else {
      await db.daily_records.add(todayRecord);
      await db.daily_schools.bulkAdd(dailySchools);
      await db.daily_menus.bulkAdd(dailyMenus);
      await db.portion_containers.bulkAdd(containers);
      await db.temperature_records.bulkAdd(temps);
    }
  });
}
