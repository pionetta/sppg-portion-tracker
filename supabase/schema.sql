-- Database Schema for Portion Tracker (SPPG)
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: schools (Master Sekolah)
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  level VARCHAR(50) NOT NULL DEFAULT 'SD',
  default_portions INTEGER NOT NULL DEFAULT 0,
  distribution_period VARCHAR(50) NOT NULL DEFAULT 'Pagi' CHECK (distribution_period IN ('Pagi', 'Siang', 'Keduanya')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: menus (Master Menu)
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Karbohidrat', 'Lauk', 'Sayur', 'Buah', 'Pelengkap', 'Lainnya')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: daily_records (Produksi Harian)
CREATE TABLE IF NOT EXISTS daily_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  target_portions INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: daily_schools (Pencatatan Alokasi Sekolah per Tanggal)
CREATE TABLE IF NOT EXISTS daily_schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_record_id UUID NOT NULL REFERENCES daily_records(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  school_name VARCHAR(255) NOT NULL,
  portions INTEGER NOT NULL DEFAULT 0,
  distribution_period VARCHAR(50) NOT NULL DEFAULT 'Pagi' CHECK (distribution_period IN ('Pagi', 'Siang', 'Keduanya')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: daily_menus (Menu Harian yang diproduksi)
CREATE TABLE IF NOT EXISTS daily_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_record_id UUID NOT NULL REFERENCES daily_records(id) ON DELETE CASCADE,
  menu_id UUID REFERENCES menus(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Karbohidrat', 'Lauk', 'Sayur', 'Buah', 'Pelengkap', 'Lainnya')),
  target_portions INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: portion_containers (Wadah Pemorsian per Menu)
CREATE TABLE IF NOT EXISTS portion_containers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_menu_id UUID NOT NULL REFERENCES daily_menus(id) ON DELETE CASCADE,
  container_number INTEGER NOT NULL,
  cumulative_portions INTEGER NOT NULL DEFAULT 0,
  used_portions INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_container_per_menu UNIQUE (daily_menu_id, container_number)
);

-- Table: temperature_records (Pengukuran Suhu per Wadah)
CREATE TABLE IF NOT EXISTS temperature_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portion_container_id UUID NOT NULL REFERENCES portion_containers(id) ON DELETE CASCADE,
  temperature NUMERIC(4, 1) NOT NULL,
  measured_at VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: sop_settings (Pengaturan SOP Suhu)
CREATE TABLE IF NOT EXISTS sop_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  min_hot_temp NUMERIC(4, 1) NOT NULL DEFAULT 60.0,
  max_hot_temp NUMERIC(4, 1),
  min_cold_temp NUMERIC(4, 1),
  max_cold_temp NUMERIC(4, 1) DEFAULT 10.0,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for high-speed queries
CREATE INDEX IF NOT EXISTS idx_daily_records_date ON daily_records(date);
CREATE INDEX IF NOT EXISTS idx_daily_schools_record_id ON daily_schools(daily_record_id);
CREATE INDEX IF NOT EXISTS idx_daily_menus_record_id ON daily_menus(daily_record_id);
CREATE INDEX IF NOT EXISTS idx_portion_containers_menu_id ON portion_containers(daily_menu_id);
CREATE INDEX IF NOT EXISTS idx_temperature_records_container_id ON temperature_records(portion_container_id);
