import { FigmaClient } from 'file:///C:/Users/hp/AppData/Roaming/npm/node_modules/figma-ds-cli/src/figma-client.js';
import { daemonExec } from 'file:///C:/Users/hp/AppData/Roaming/npm/node_modules/figma-ds-cli/src/lib/cli-core.js';

const client = new FigmaClient();

async function renderFrame(name, jsx, x, y) {
  console.log(`🎨 Rendering ${name} at (${x}, ${y})...`);
  const code = await client.parseJSX(jsx, { x, y });
  const result = await daemonExec('eval', { code });
  console.log(`✓ ${name} rendered successfully (ID: ${result?.id})`);
  return result;
}

// -------------------------------------------------------------
// 00. DESIGN SYSTEM & TOKENS SHOWCASE (ANTIGRAVITY DESIGN EXPERT)
// -------------------------------------------------------------
const designSystemJsx = `
<Frame name="00 - Antigravity Design System & Tokens" w={1360} h={520} bg="#0F172A" p={28} rounded={36} flex="col" gap={20}>
  <!-- Header Title Banner -->
  <Frame flex="row" justify="between" items="center" w="fill">
    <Frame flex="col" gap={4}>
      <Frame flex="row" gap={10} items="center">
        <Frame p={6} px={12} bg="#4F46E5" rounded={12}>
          <Text size={11} weight="bold" color="#FFFFFF">SPATIAL UI / WEIGHTLESS</Text>
        </Frame>
        <Text size={20} weight="bold" color="#FFFFFF">SPPG Portion Tracker — Design System</Text>
      </Frame>
      <Text size={12} color="#94A3B8">Core design tokens, claymorphic elevations, glowing badges, and tactile components</Text>
    </Frame>
    <Frame p={8} px={16} bg="#1E293B" rounded={16} stroke="#334155" strokeWidth={1}>
      <Text size={12} weight="bold" color="#38BDF8">v2.4 Antigravity Edition</Text>
    </Frame>
  </Frame>

  <!-- 3 Columns Grid: Tokens, Typography, Components -->
  <Frame flex="row" gap={18} w="fill">
    <!-- Col 1: Color Palette Tokens -->
    <Frame flex="col" gap={12} p={18} bg="#1E293B" rounded={26} stroke="#334155" strokeWidth={1} w="fill">
      <Text size={13} weight="bold" color="#F8FAFC">1. Color Tokens & Elevation</Text>
      <Frame flex="row" gap={8} w="fill">
        <Frame p={10} bg="#4F46E5" rounded={14} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#FFFFFF">Primary</Text>
          <Text size={9} color="#C7D2FE">#4F46E5</Text>
        </Frame>
        <Frame p={10} bg="#7C3AED" rounded={14} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#FFFFFF">Violet</Text>
          <Text size={9} color="#DDD6FE">#7C3AED</Text>
        </Frame>
        <Frame p={10} bg="#10B981" rounded={14} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#FFFFFF">Success</Text>
          <Text size={9} color="#A7F3D0">#10B981</Text>
        </Frame>
        <Frame p={10} bg="#F59E0B" rounded={14} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#FFFFFF">Warning</Text>
          <Text size={9} color="#FDE68A">#F59E0B</Text>
        </Frame>
        <Frame p={10} bg="#F43F5E" rounded={14} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#FFFFFF">SOP Hot</Text>
          <Text size={9} color="#FECDD3">#F43F5E</Text>
        </Frame>
        <Frame p={10} bg="#0EA5E9" rounded={14} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#FFFFFF">SOP Cold</Text>
          <Text size={9} color="#BAE6FD">#0EA5E9</Text>
        </Frame>
      </Frame>

      <!-- Glass & Surface tokens -->
      <Frame flex="row" gap={8} w="fill">
        <Frame p={10} bg="#FFFFFF" rounded={14} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={2} w="fill">
          <Text size={10} weight="bold" color="#0F172A">Surface Card</Text>
          <Text size={9} color="#64748B">White 95% + Rim Light</Text>
        </Frame>
        <Frame p={10} bg="#F1F5F9" rounded={14} stroke="#CBD5E1" strokeWidth={1} flex="col" gap={2} w="fill">
          <Text size={10} weight="bold" color="#0F172A">Sunken Well</Text>
          <Text size={9} color="#64748B">Slate 100 (Tactile Inset)</Text>
        </Frame>
        <Frame p={10} bg="#334155" rounded={14} stroke="#475569" strokeWidth={1} flex="col" gap={2} w="fill">
          <Text size={10} weight="bold" color="#FFFFFF">Dark Floating Dock</Text>
          <Text size={9} color="#94A3B8">Slate 700 + Blur</Text>
        </Frame>
      </Frame>
    </Frame>

    <!-- Col 2: Typography & Badge Hierarchy -->
    <Frame flex="col" gap={12} p={18} bg="#1E293B" rounded={26} stroke="#334155" strokeWidth={1} w="fill">
      <Text size={13} weight="bold" color="#F8FAFC">2. Typography & Status Badges</Text>
      <Frame flex="col" gap={6} w="fill">
        <Text size={18} weight="bold" color="#FFFFFF">Display / Title (18-22pt Black)</Text>
        <Text size={13} weight="bold" color="#CBD5E1">Section Heading (13-14pt Bold)</Text>
        <Text size={11} weight="medium" color="#94A3B8">Body / Helper Text (11-12pt Medium)</Text>
      </Frame>
      <!-- Badges Sample Row -->
      <Frame flex="row" gap={6} items="center" w="fill" pt={4}>
        <Frame p={4} px={10} bg="#ECFDF5" rounded={10} stroke="#A7F3D0" strokeWidth={1}><Text size={10} weight="bold" color="#059669">● 100% Selesai</Text></Frame>
        <Frame p={4} px={10} bg="#EEF2FF" rounded={10} stroke="#C7D2FE" strokeWidth={1}><Text size={10} weight="bold" color="#4338CA">Mode 2 Wadah</Text></Frame>
        <Frame p={4} px={10} bg="#FEF3C7" rounded={10} stroke="#FDE68A" strokeWidth={1}><Text size={10} weight="bold" color="#B45309">SOP Panas ≥60°C</Text></Frame>
        <Frame p={4} px={10} bg="#F0F9FF" rounded={10} stroke="#BAE6FD" strokeWidth={1}><Text size={10} weight="bold" color="#0369A1">SOP Dingin ≤10°C</Text></Frame>
      </Frame>
    </Frame>

    <!-- Col 3: Tactile Component Atoms -->
    <Frame flex="col" gap={12} p={18} bg="#1E293B" rounded={26} stroke="#334155" strokeWidth={1} w="fill">
      <Text size={13} weight="bold" color="#F8FAFC">3. Interactive Component Atoms</Text>
      <!-- Stepper Atom -->
      <Frame flex="row" justify="between" items="center" p={8} bg="#0F172A" rounded={16} stroke="#334155" strokeWidth={1} w="fill">
        <Frame flex="row" gap={4}>
          <Frame w={28} h={28} bg="#1E293B" rounded={8} items="center" justify="center"><Text size={10} weight="bold" color="#CBD5E1">-10</Text></Frame>
          <Frame w={28} h={28} bg="#1E293B" rounded={8} items="center" justify="center"><Text size={10} weight="bold" color="#CBD5E1">-1</Text></Frame>
        </Frame>
        <Text size={14} weight="bold" color="#38BDF8">450 Porsi</Text>
        <Frame flex="row" gap={4}>
          <Frame w={28} h={28} bg="#1E293B" rounded={8} items="center" justify="center"><Text size={10} weight="bold" color="#CBD5E1">+1</Text></Frame>
          <Frame w={28} h={28} bg="#4F46E5" rounded={8} items="center" justify="center"><Text size={10} weight="bold" color="#FFFFFF">+10</Text></Frame>
        </Frame>
      </Frame>
      <!-- Action Buttons Atom -->
      <Frame flex="row" gap={8} w="fill">
        <Frame p={10} bg="#4F46E5" rounded={14} items="center" justify="center" w="fill">
          <Text size={11} weight="bold" color="#FFFFFF">+ Tambah Wadah</Text>
        </Frame>
        <Frame p={10} bg="#1E293B" rounded={14} stroke="#475569" strokeWidth={1} items="center" justify="center" w="fill">
          <Text size={11} weight="bold" color="#CBD5E1">Simpan Draft</Text>
        </Frame>
      </Frame>
    </Frame>
  </Frame>
</Frame>
`;

// Mobile Top Status Bar (Weightless look)
function statusBar() {
  return `
    <Frame name="Mobile Status Bar" flex="row" justify="between" items="center" w="fill" pt={2} pb={6} px={4}>
      <Text size={12} weight="bold" color="#0F172A">09:41</Text>
      <Frame flex="row" gap={6} items="center">
        <Text size={10} weight="bold" color="#64748B">5G</Text>
        <Text size={10} weight="bold" color="#64748B">100%</Text>
        <Frame w={20} h={10} rounded={4} stroke="#64748B" strokeWidth={1} p={1}>
          <Frame w={14} h={6} bg="#10B981" rounded={2} />
        </Frame>
      </Frame>
    </Frame>
  `;
}

// Reusable Floating Dock (Tactile Glassmorphism)
function spatialFloatingDock(activeTab) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'portioning', label: 'Pemorsian', icon: '⚖️' },
    { id: 'schools', label: 'Sekolah', icon: '🏫' },
    { id: 'history', label: 'Riwayat', icon: '📋' },
    { id: 'settings', label: 'Pengaturan', icon: '⚙️' },
  ];

  return `
    <!-- Floating Dock Container with Spatial Rim Light -->
    <Frame name="Floating Dock Navigation" w="fill" p={8} bg="#FFFFFF" rounded={30} stroke="#E2E8F0" strokeWidth={1} flex="row" justify="between" items="center">
      ${tabs.map(t => {
        const isActive = t.id === activeTab;
        if (isActive) {
          return `
            <Frame name="Active Tab ${t.label}" p={8} px={14} bg="#4F46E5" rounded={22} stroke="#818CF8" strokeWidth={1} flex="row" gap={6} items="center">
              <Text size={13}>${t.icon}</Text>
              <Text size={11} weight="bold" color="#FFFFFF">${t.label}</Text>
            </Frame>
          `;
        } else {
          return `
            <Frame name="Tab ${t.label}" p={8} px={10} rounded={16} flex="col" gap={2} items="center">
              <Text size={13}>${t.icon}</Text>
              <Text size={9} weight="bold" color="#64748B">${t.label}</Text>
            </Frame>
          `;
        }
      }).join('')}
    </Frame>
  `;
}

// -------------------------------------------------------------
// 01. DASHBOARD SCREEN (SPATIAL OVERVIEW)
// -------------------------------------------------------------
const screen1DashboardJsx = `
<Frame name="01 - Dashboard (Spatial Overview)" w={412} h={900} bg="#F8FAFC" p={18} flex="col" gap={12}>
  ${statusBar()}

  <!-- Floating Header Card -->
  <Frame name="Floating Header" flex="row" justify="between" items="center" w="fill" p={14} bg="#FFFFFF" rounded={26} stroke="#E2E8F0" strokeWidth={1}>
    <Frame flex="row" gap={10} items="center">
      <Frame w={42} h={42} bg="#4F46E5" rounded={18} items="center" justify="center" stroke="#818CF8" strokeWidth={1}>
        <Text size={20}>🍱</Text>
      </Frame>
      <Frame flex="col" gap={2}>
        <Text size={15} weight="bold" color="#0F172A">Portion Tracker SPPG</Text>
        <Text size={10} color="#64748B">Minggu, 6 Sep 2026 • Shift Pagi</Text>
      </Frame>
    </Frame>
    <Frame p={6} px={10} bg="#ECFDF5" rounded={14} stroke="#A7F3D0" strokeWidth={1}>
      <Text size={10} weight="bold" color="#059669">● Online</Text>
    </Frame>
  </Frame>

  <!-- Hero Production Progress (Weightless Glassmorphic Glow) -->
  <Frame name="Hero Production Card" w="fill" p={18} bg="#4338CA" rounded={28} stroke="#6366F1" strokeWidth={1} flex="col" gap={14}>
    <Frame flex="row" justify="between" items="center" w="fill">
      <Frame flex="col" gap={3}>
        <Text size={10} weight="bold" color="#C7D2FE">PROGRES PEMORSIAN HARIAN</Text>
        <Text size={20} weight="bold" color="#FFFFFF">2,580 / 3,450 Porsi</Text>
      </Frame>
      <Frame w={50} h={50} bg="#3730A3" rounded={25} stroke="#818CF8" strokeWidth={1} items="center" justify="center">
        <Text size={14} weight="bold" color="#A5B4FC">75%</Text>
      </Frame>
    </Frame>
    <!-- 3D Progress Bar Track -->
    <Frame w="fill" h={10} bg="#312E81" rounded={8} overflow="hidden">
      <Frame w={270} h={10} bg="#818CF8" rounded={8} />
    </Frame>
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={10} color="#C7D2FE">Target Selesai: 10:30 WIB</Text>
      <Text size={10} weight="bold" color="#E0E7FF">Sisa 870 Porsi Lagi</Text>
    </Frame>
  </Frame>

  <!-- 4-Metrics Tactile Grid (Claymorphic Depth) -->
  <Frame name="Metrics Grid" w="fill" flex="col" gap={8}>
    <Frame flex="row" gap={8} w="fill">
      <Frame flex="col" gap={3} p={12} bg="#FFFFFF" rounded={20} stroke="#E2E8F0" strokeWidth={1} w="fill">
        <Text size={9} weight="bold" color="#64748B">TOTAL PORSI</Text>
        <Text size={17} weight="bold" color="#0F172A">3,450</Text>
        <Frame p={2} px={6} bg="#ECFDF5" rounded={6} w="hug"><Text size={9} weight="bold" color="#059669">↑ 100% Kuota</Text></Frame>
      </Frame>
      <Frame flex="col" gap={3} p={12} bg="#FFFFFF" rounded={20} stroke="#E2E8F0" strokeWidth={1} w="fill">
        <Text size={9} weight="bold" color="#64748B">WADAH TERPAKAI</Text>
        <Text size={17} weight="bold" color="#0F172A">142</Text>
        <Frame p={2} px={6} bg="#EEF2FF" rounded={6} w="hug"><Text size={9} weight="bold" color="#4F46E5">48 Wadah Nasi</Text></Frame>
      </Frame>
    </Frame>
    <Frame flex="row" gap={8} w="fill">
      <Frame flex="col" gap={3} p={12} bg="#FFFFFF" rounded={20} stroke="#E2E8F0" strokeWidth={1} w="fill">
        <Text size={9} weight="bold" color="#64748B">RATA-RATA SUHU</Text>
        <Text size={17} weight="bold" color="#0F172A">68.4°C</Text>
        <Frame p={2} px={6} bg="#ECFDF5" rounded={6} w="hug"><Text size={9} weight="bold" color="#059669">✓ SOP Aman (≥60°C)</Text></Frame>
      </Frame>
      <Frame flex="col" gap={3} p={12} bg="#FFFFFF" rounded={20} stroke="#E2E8F0" strokeWidth={1} w="fill">
        <Text size={9} weight="bold" color="#64748B">EFISIENSI PEMORSIAN</Text>
        <Text size={17} weight="bold" color="#0F172A">98.2%</Text>
        <Frame p={2} px={6} bg="#F0F9FF" rounded={6} w="hug"><Text size={9} weight="bold" color="#0284C7">Toleransi &lt; 2%</Text></Frame>
      </Frame>
    </Frame>
  </Frame>

  <!-- Active Menu Status Card -->
  <Frame name="Active Menu Card" p={14} bg="#FFFFFF" rounded={24} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={10} w="fill">
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={13} weight="bold" color="#0F172A">Komponen Menu Aktif</Text>
      <Text size={10} weight="bold" color="#4F46E5">7 Standar SPPG</Text>
    </Frame>
    
    <Frame flex="row" justify="between" items="center" p={10} bg="#F8FAFC" rounded={16} stroke="#E2E8F0" strokeWidth={1} w="fill">
      <Frame flex="row" gap={10} items="center">
        <Text size={16}>🍚</Text>
        <Frame flex="col" gap={2}>
          <Text size={12} weight="bold" color="#0F172A">Nasi Putih (Makanan Pokok)</Text>
          <Text size={10} color="#64748B">Mode 2 Wadah • 48 Wadah Terisi</Text>
        </Frame>
      </Frame>
      <Frame p={4} px={8} bg="#EEF2FF" rounded={8}><Text size={10} weight="bold" color="#4F46E5">Aktif</Text></Frame>
    </Frame>

    <Frame flex="row" justify="between" items="center" p={10} bg="#F8FAFC" rounded={16} stroke="#E2E8F0" strokeWidth={1} w="fill">
      <Frame flex="row" gap={10} items="center">
        <Text size={16}>🍗</Text>
        <Frame flex="col" gap={2}>
          <Text size={12} weight="bold" color="#0F172A">Ayam Goreng Lengkuas (Protein)</Text>
          <Text size={10} color="#64748B">1,200 Porsi • Suhu 72°C</Text>
        </Frame>
      </Frame>
      <Frame p={4} px={8} bg="#ECFDF5" rounded={8}><Text size={10} weight="bold" color="#059669">Selesai</Text></Frame>
    </Frame>
  </Frame>

  ${spatialFloatingDock('dashboard')}
</Frame>
`;

// -------------------------------------------------------------
// 02. PEMORSIAN (DUAL-CONTAINER MODE SPEC)
// -------------------------------------------------------------
const screen2PortioningJsx = `
<Frame name="02 - Pemorsian (2-Container Mode)" w={412} h={900} bg="#F8FAFC" p={18} flex="col" gap={12}>
  ${statusBar()}

  <!-- Top Header -->
  <Frame flex="row" justify="between" items="center" w="fill" p={14} bg="#FFFFFF" rounded={26} stroke="#E2E8F0" strokeWidth={1}>
    <Frame flex="col" gap={2}>
      <Text size={16} weight="bold" color="#0F172A">Pemorsian & Timbangan</Text>
      <Text size={10} color="#64748B">SOP Keamanan Pangan: Panas ≥ 60.0°C</Text>
    </Frame>
    <Frame p={6} px={10} bg="#FEF3C7" rounded={12} stroke="#FDE68A" strokeWidth={1}>
      <Text size={10} weight="bold" color="#B45309">Shift Pagi</Text>
    </Frame>
  </Frame>

  <!-- Focused Component Card: Makanan Pokok with Mode 2 Wadah -->
  <Frame name="Dual Container Component Card" p={16} bg="#FFFFFF" rounded={28} stroke="#CBD5E1" strokeWidth={1} flex="col" gap={12} w="fill">
    <Frame flex="row" justify="between" items="center" w="fill">
      <Frame flex="row" gap={8} items="center">
        <Frame w={36} h={36} bg="#EEF2FF" rounded={14} stroke="#C7D2FE" strokeWidth={1} items="center" justify="center">
          <Text size={18}>🍚</Text>
        </Frame>
        <Frame flex="col" gap={2}>
          <Text size={14} weight="bold" color="#0F172A">1. Makanan Pokok - Nasi Putih</Text>
          <Text size={10} color="#64748B">Target Produksi: 1,200 Porsi</Text>
        </Frame>
      </Frame>
      <Frame p={4} px={8} bg="#4F46E5" rounded={10}><Text size={10} weight="bold" color="#FFFFFF">Mode 2 Wadah</Text></Frame>
    </Frame>

    <!-- Dual Container Visual Split Well -->
    <Frame p={10} bg="#EEF2FF" rounded={18} stroke="#C7D2FE" strokeWidth={1} flex="row" gap={10} items="center" w="fill">
      <Text size={18}>⚖️</Text>
      <Frame flex="col" gap={2}>
        <Text size={11} weight="bold" color="#3730A3">Mode Dua Wadah Aktif (Kembar)</Text>
        <Text size={9} color="#4338CA">Setiap penimbangan otomatis membagi porsi rata dan menambah 2 wadah.</Text>
      </Frame>
    </Frame>

    <!-- Container Table Rows (Sunken Wells) -->
    <Frame flex="col" gap={6} w="fill">
      <Frame flex="row" justify="between" items="center" p={10} bg="#F8FAFC" rounded={14} stroke="#E2E8F0" strokeWidth={1} w="fill">
        <Frame flex="row" gap={8} items="center">
          <Frame w={24} h={24} bg="#FFFFFF" rounded={8} stroke="#CBD5E1" strokeWidth={1} items="center" justify="center">
            <Text size={10} weight="bold" color="#0F172A">#1</Text>
          </Frame>
          <Frame flex="col">
            <Text size={11} weight="bold" color="#0F172A">Wadah A1 (Set 1)</Text>
            <Text size={9} color="#64748B">Tara: 800g • Suhu: 68.5°C</Text>
          </Frame>
        </Frame>
        <Frame flex="row" gap={6} items="center">
          <Frame p={2} px={6} bg="#ECFDF5" rounded={6}><Text size={9} weight="bold" color="#059669">SOP OK</Text></Frame>
          <Text size={13} weight="bold" color="#4F46E5">75 Porsi</Text>
        </Frame>
      </Frame>

      <Frame flex="row" justify="between" items="center" p={10} bg="#F8FAFC" rounded={14} stroke="#E2E8F0" strokeWidth={1} w="fill">
        <Frame flex="row" gap={8} items="center">
          <Frame w={24} h={24} bg="#FFFFFF" rounded={8} stroke="#CBD5E1" strokeWidth={1} items="center" justify="center">
            <Text size={10} weight="bold" color="#0F172A">#2</Text>
          </Frame>
          <Frame flex="col">
            <Text size={11} weight="bold" color="#0F172A">Wadah A2 (Set 1)</Text>
            <Text size={9} color="#64748B">Tara: 800g • Suhu: 68.5°C</Text>
          </Frame>
        </Frame>
        <Frame flex="row" gap={6} items="center">
          <Frame p={2} px={6} bg="#ECFDF5" rounded={6}><Text size={9} weight="bold" color="#059669">SOP OK</Text></Frame>
          <Text size={13} weight="bold" color="#4F46E5">75 Porsi</Text>
        </Frame>
      </Frame>

      <Frame flex="row" justify="between" items="center" p={10} bg="#F8FAFC" rounded={14} stroke="#E2E8F0" strokeWidth={1} w="fill">
        <Frame flex="row" gap={8} items="center">
          <Frame w={24} h={24} bg="#FFFFFF" rounded={8} stroke="#CBD5E1" strokeWidth={1} items="center" justify="center">
            <Text size={10} weight="bold" color="#0F172A">#3</Text>
          </Frame>
          <Frame flex="col">
            <Text size={11} weight="bold" color="#0F172A">Wadah B1 (Set 2)</Text>
            <Text size={9} color="#64748B">Tara: 800g • Suhu: 66.0°C</Text>
          </Frame>
        </Frame>
        <Frame flex="row" gap={6} items="center">
          <Frame p={2} px={6} bg="#ECFDF5" rounded={6}><Text size={9} weight="bold" color="#059669">SOP OK</Text></Frame>
          <Text size={13} weight="bold" color="#4F46E5">80 Porsi</Text>
        </Frame>
      </Frame>

      <Frame flex="row" justify="between" items="center" p={10} bg="#F8FAFC" rounded={14} stroke="#E2E8F0" strokeWidth={1} w="fill">
        <Frame flex="row" gap={8} items="center">
          <Frame w={24} h={24} bg="#FFFFFF" rounded={8} stroke="#CBD5E1" strokeWidth={1} items="center" justify="center">
            <Text size={10} weight="bold" color="#0F172A">#4</Text>
          </Frame>
          <Frame flex="col">
            <Text size={11} weight="bold" color="#0F172A">Wadah B2 (Set 2)</Text>
            <Text size={9} color="#64748B">Tara: 800g • Suhu: 66.0°C</Text>
          </Frame>
        </Frame>
        <Frame flex="row" gap={6} items="center">
          <Frame p={2} px={6} bg="#ECFDF5" rounded={6}><Text size={9} weight="bold" color="#059669">SOP OK</Text></Frame>
          <Text size={13} weight="bold" color="#4F46E5">80 Porsi</Text>
        </Frame>
      </Frame>
    </Frame>

    <!-- Action Buttons Row -->
    <Frame flex="row" gap={8} w="fill" pt={4}>
      <Frame p={12} bg="#4F46E5" rounded={16} items="center" justify="center" w="fill">
        <Text size={12} weight="bold" color="#FFFFFF">+ Tambah 2 Wadah Nasi</Text>
      </Frame>
      <Frame p={12} bg="#F1F5F9" rounded={16} stroke="#CBD5E1" strokeWidth={1} items="center" justify="center" px={16}>
        <Text size={12} weight="bold" color="#0F172A">🌡️ Log Suhu</Text>
      </Frame>
    </Frame>
  </Frame>

  <!-- Accumulation Bottom Card -->
  <Frame p={14} bg="#FFFFFF" rounded={22} stroke="#E2E8F0" strokeWidth={1} flex="row" justify="between" items="center" w="fill">
    <Text size={12} weight="bold" color="#64748B">Total Nasi Terisi:</Text>
    <Text size={15} weight="bold" color="#10B981">310 / 1,200 Porsi (25.8%)</Text>
  </Frame>

  ${spatialFloatingDock('portioning')}
</Frame>
`;

// -------------------------------------------------------------
// 03. DISTRIBUSI HARIAN (SCHOOL ALLOCATION STEPPERS)
// -------------------------------------------------------------
const screen3DistributionJsx = `
<Frame name="03 - Distribusi Harian (Allocation)" w={412} h={900} bg="#F8FAFC" p={18} flex="col" gap={12}>
  ${statusBar()}

  <!-- Subtabs Switcher Well -->
  <Frame p={4} bg="#F1F5F9" rounded={20} stroke="#E2E8F0" strokeWidth={1} flex="row" w="fill">
    <Frame p={8} bg="#FFFFFF" rounded={16} stroke="#E2E8F0" strokeWidth={1} items="center" justify="center" w="fill">
      <Text size={11} weight="bold" color="#0F172A">Distribusi Harian</Text>
    </Frame>
    <Frame p={8} rounded={16} items="center" justify="center" w="fill">
      <Text size={11} weight="bold" color="#64748B">Master Sekolah</Text>
    </Frame>
  </Frame>

  <!-- 3D Proportion Bar Card -->
  <Frame p={14} bg="#FFFFFF" rounded={24} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={10} w="fill">
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={12} weight="bold" color="#0F172A">Proporsi Kuota per Jenjang</Text>
      <Text size={11} weight="bold" color="#4F46E5">1,350 Porsi Total</Text>
    </Frame>
    <Frame w="fill" h={12} rounded={8} flex="row" overflow="hidden">
      <Frame w={220} h={12} bg="#4F46E5" />
      <Frame w={95} h={12} bg="#06B6D4" />
      <Frame w={60} h={12} bg="#F59E0B" />
    </Frame>
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={10} weight="bold" color="#4F46E5">● SD: 60% (810 Porsi)</Text>
      <Text size={10} weight="bold" color="#06B6D4">● SMP: 25% (340)</Text>
      <Text size={10} weight="bold" color="#F59E0B">● SMA: 15% (200)</Text>
    </Frame>
  </Frame>

  <!-- Presets Quick Bar -->
  <Frame flex="row" gap={8} w="fill">
    <Frame p={8} bg="#EEF2FF" rounded={14} stroke="#C7D2FE" strokeWidth={1} items="center" justify="center" w="fill">
      <Text size={10} weight="bold" color="#4338CA">Preset 100% Penuh</Text>
    </Frame>
    <Frame p={8} bg="#FFFFFF" rounded={14} stroke="#E2E8F0" strokeWidth={1} items="center" justify="center" w="fill">
      <Text size={10} weight="semibold" color="#64748B">75% Porsi</Text>
    </Frame>
    <Frame p={8} bg="#FFFFFF" rounded={14} stroke="#E2E8F0" strokeWidth={1} items="center" justify="center" w="fill">
      <Text size={10} weight="semibold" color="#64748B">50% Porsi</Text>
    </Frame>
  </Frame>

  <!-- School Allocation Cards List -->
  <Frame flex="col" gap={8} w="fill">
    <Frame p={14} bg="#FFFFFF" rounded={22} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={10} w="fill">
      <Frame flex="row" justify="between" items="center" w="fill">
        <Frame flex="row" gap={8} items="center">
          <Text size={16}>🏫</Text>
          <Frame flex="col">
            <Text size={13} weight="bold" color="#0F172A">SDN 01 Pagi Menteng</Text>
            <Text size={10} color="#64748B">Jenjang SD • Shift Pagi (06:30)</Text>
          </Frame>
        </Frame>
        <Frame p={3} px={8} bg="#ECFDF5" rounded={8}><Text size={9} weight="bold" color="#059669">Lengkap</Text></Frame>
      </Frame>
      <!-- Stepper Controls -->
      <Frame flex="row" justify="between" items="center" w="fill" pt={2}>
        <Frame flex="row" gap={6} items="center">
          <Frame w={30} h={30} bg="#F1F5F9" rounded={10} stroke="#E2E8F0" strokeWidth={1} items="center" justify="center"><Text size={10} weight="bold">-10</Text></Frame>
          <Frame w={30} h={30} bg="#F1F5F9" rounded={10} stroke="#E2E8F0" strokeWidth={1} items="center" justify="center"><Text size={10} weight="bold">-1</Text></Frame>
        </Frame>
        <Text size={17} weight="bold" color="#4F46E5">450 Porsi</Text>
        <Frame flex="row" gap={6} items="center">
          <Frame w={30} h={30} bg="#F1F5F9" rounded={10} stroke="#E2E8F0" strokeWidth={1} items="center" justify="center"><Text size={10} weight="bold">+1</Text></Frame>
          <Frame w={30} h={30} bg="#EEF2FF" rounded={10} stroke="#C7D2FE" strokeWidth={1} items="center" justify="center"><Text size={10} weight="bold" color="#4F46E5">+10</Text></Frame>
        </Frame>
      </Frame>
    </Frame>

    <Frame p={14} bg="#FFFFFF" rounded={22} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={10} w="fill">
      <Frame flex="row" justify="between" items="center" w="fill">
        <Frame flex="row" gap={8} items="center">
          <Text size={16}>🏫</Text>
          <Frame flex="col">
            <Text size={13} weight="bold" color="#0F172A">SMPN 03 Menteng</Text>
            <Text size={10} color="#64748B">Jenjang SMP • Shift Pagi (06:30)</Text>
          </Frame>
        </Frame>
        <Frame p={3} px={8} bg="#FEF3C7" rounded={8}><Text size={9} weight="bold" color="#D97706">Proses</Text></Frame>
      </Frame>
      <!-- Stepper Controls -->
      <Frame flex="row" justify="between" items="center" w="fill" pt={2}>
        <Frame flex="row" gap={6} items="center">
          <Frame w={30} h={30} bg="#F1F5F9" rounded={10} stroke="#E2E8F0" strokeWidth={1} items="center" justify="center"><Text size={10} weight="bold">-10</Text></Frame>
          <Frame w={30} h={30} bg="#F1F5F9" rounded={10} stroke="#E2E8F0" strokeWidth={1} items="center" justify="center"><Text size={10} weight="bold">-1</Text></Frame>
        </Frame>
        <Text size={17} weight="bold" color="#4F46E5">580 Porsi</Text>
        <Frame flex="row" gap={6} items="center">
          <Frame w={30} h={30} bg="#F1F5F9" rounded={10} stroke="#E2E8F0" strokeWidth={1} items="center" justify="center"><Text size={10} weight="bold">+1</Text></Frame>
          <Frame w={30} h={30} bg="#EEF2FF" rounded={10} stroke="#C7D2FE" strokeWidth={1} items="center" justify="center"><Text size={10} weight="bold" color="#4F46E5">+10</Text></Frame>
        </Frame>
      </Frame>
    </Frame>
  </Frame>

  ${spatialFloatingDock('schools')}
</Frame>
`;

// -------------------------------------------------------------
// 04. MASTER SEKOLAH (MANAGEMENT & FILTERS)
// -------------------------------------------------------------
const screen4MasterSchoolJsx = `
<Frame name="04 - Master Sekolah (Catalog)" w={412} h={900} bg="#F8FAFC" p={18} flex="col" gap={12}>
  ${statusBar()}

  <!-- Subtabs Switcher Well -->
  <Frame p={4} bg="#F1F5F9" rounded={20} stroke="#E2E8F0" strokeWidth={1} flex="row" w="fill">
    <Frame p={8} rounded={16} items="center" justify="center" w="fill">
      <Text size={11} weight="bold" color="#64748B">Distribusi Harian</Text>
    </Frame>
    <Frame p={8} bg="#FFFFFF" rounded={16} stroke="#E2E8F0" strokeWidth={1} items="center" justify="center" w="fill">
      <Text size={11} weight="bold" color="#0F172A">Master Sekolah</Text>
    </Frame>
  </Frame>

  <!-- Search & Add Button -->
  <Frame flex="row" justify="between" items="center" gap={8} w="fill">
    <Frame p={10} px={14} bg="#FFFFFF" rounded={18} stroke="#CBD5E1" strokeWidth={1} flex="row" gap={8} items="center" w="fill">
      <Text size={12}>🔍</Text>
      <Text size={11} color="#94A3B8">Cari sekolah penerima...</Text>
    </Frame>
    <Frame p={10} px={14} bg="#4F46E5" rounded={18} stroke="#818CF8" strokeWidth={1} items="center" justify="center">
      <Text size={11} weight="bold" color="#FFFFFF">+ Sekolah</Text>
    </Frame>
  </Frame>

  <!-- Jenjang Filter Pills -->
  <Frame flex="row" gap={6} w="fill">
    <Frame p={6} px={14} bg="#4F46E5" rounded={14}><Text size={10} weight="bold" color="#FFFFFF">Semua</Text></Frame>
    <Frame p={6} px={14} bg="#FFFFFF" rounded={14} stroke="#E2E8F0" strokeWidth={1}><Text size={10} weight="semibold" color="#64748B">SD (12)</Text></Frame>
    <Frame p={6} px={14} bg="#FFFFFF" rounded={14} stroke="#E2E8F0" strokeWidth={1}><Text size={10} weight="semibold" color="#64748B">SMP (8)</Text></Frame>
    <Frame p={6} px={14} bg="#FFFFFF" rounded={14} stroke="#E2E8F0" strokeWidth={1}><Text size={10} weight="semibold" color="#64748B">SMA (4)</Text></Frame>
  </Frame>

  <!-- School Cards List -->
  <Frame flex="col" gap={8} w="fill">
    <Frame p={14} bg="#FFFFFF" rounded={22} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={8} w="fill">
      <Frame flex="row" justify="between" items="center" w="fill">
        <Frame flex="row" gap={8} items="center">
          <Text size={16}>🏫</Text>
          <Frame flex="col">
            <Text size={13} weight="bold" color="#0F172A">SDN 01 Pagi Menteng</Text>
            <Text size={10} color="#64748B">Kec. Menteng • Periode Pagi</Text>
          </Frame>
        </Frame>
        <Frame p={3} px={8} bg="#EEF2FF" rounded={8}><Text size={10} weight="bold" color="#4F46E5">SD</Text></Frame>
      </Frame>
      <Frame flex="row" justify="between" items="center" w="fill" pt={4}>
        <Text size={11} color="#64748B">Porsi Standar: <Text weight="bold" color="#0F172A">450 Porsi</Text></Text>
        <Frame flex="row" gap={10}>
          <Text size={12}>✏️ Edit</Text>
          <Text size={12}>🗑️ Hapus</Text>
        </Frame>
      </Frame>
    </Frame>

    <Frame p={14} bg="#FFFFFF" rounded={22} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={8} w="fill">
      <Frame flex="row" justify="between" items="center" w="fill">
        <Frame flex="row" gap={8} items="center">
          <Text size={16}>🏫</Text>
          <Frame flex="col">
            <Text size={13} weight="bold" color="#0F172A">SMPN 03 Menteng</Text>
            <Text size={10} color="#64748B">Kec. Menteng • Periode Pagi</Text>
          </Frame>
        </Frame>
        <Frame p={3} px={8} bg="#ECFEFF" rounded={8}><Text size={10} weight="bold" color="#0891B2">SMP</Text></Frame>
      </Frame>
      <Frame flex="row" justify="between" items="center" w="fill" pt={4}>
        <Text size={11} color="#64748B">Porsi Standar: <Text weight="bold" color="#0F172A">580 Porsi</Text></Text>
        <Frame flex="row" gap={10}>
          <Text size={12}>✏️ Edit</Text>
          <Text size={12}>🗑️ Hapus</Text>
        </Frame>
      </Frame>
    </Frame>

    <Frame p={14} bg="#FFFFFF" rounded={22} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={8} w="fill">
      <Frame flex="row" justify="between" items="center" w="fill">
        <Frame flex="row" gap={8} items="center">
          <Text size={16}>🏫</Text>
          <Frame flex="col">
            <Text size={13} weight="bold" color="#0F172A">SMAN 01 Jakarta</Text>
            <Text size={10} color="#64748B">Kec. Gambir • Periode Siang</Text>
          </Frame>
        </Frame>
        <Frame p={3} px={8} bg="#FFFBEB" rounded={8}><Text size={10} weight="bold" color="#D97706">SMA</Text></Frame>
      </Frame>
      <Frame flex="row" justify="between" items="center" w="fill" pt={4}>
        <Text size={11} color="#64748B">Porsi Standar: <Text weight="bold" color="#0F172A">320 Porsi</Text></Text>
        <Frame flex="row" gap={10}>
          <Text size={12}>✏️ Edit</Text>
          <Text size={12}>🗑️ Hapus</Text>
        </Frame>
      </Frame>
    </Frame>
  </Frame>

  ${spatialFloatingDock('schools')}
</Frame>
`;

// -------------------------------------------------------------
// 05. RIWAYAT & LAPORAN (EXPORT & ANALYTICS)
// -------------------------------------------------------------
const screen5HistoryJsx = `
<Frame name="05 - Riwayat & Laporan (Analytics)" w={412} h={900} bg="#F8FAFC" p={18} flex="col" gap={12}>
  ${statusBar()}

  <!-- Subtabs Switcher Well -->
  <Frame p={4} bg="#F1F5F9" rounded={20} stroke="#E2E8F0" strokeWidth={1} flex="row" w="fill">
    <Frame p={8} bg="#FFFFFF" rounded={16} stroke="#E2E8F0" strokeWidth={1} items="center" justify="center" w="fill">
      <Text size={11} weight="bold" color="#0F172A">Riwayat Harian</Text>
    </Frame>
    <Frame p={8} rounded={16} items="center" justify="center" w="fill">
      <Text size={11} weight="bold" color="#64748B">Laporan & Ekspor</Text>
    </Frame>
  </Frame>

  <!-- Export Actions Bar -->
  <Frame flex="row" gap={8} w="fill">
    <Frame p={12} bg="#059669" rounded={18} stroke="#10B981" strokeWidth={1} items="center" justify="center" w="fill" flex="row" gap={6}>
      <Text size={14}>📗</Text>
      <Text size={11} weight="bold" color="#FFFFFF">Ekspor Excel (.xlsx)</Text>
    </Frame>
    <Frame p={12} bg="#334155" rounded={18} stroke="#475569" strokeWidth={1} items="center" justify="center" w="fill" flex="row" gap={6}>
      <Text size={14}>📄</Text>
      <Text size={11} weight="bold" color="#FFFFFF">Ekspor CSV</Text>
    </Frame>
  </Frame>

  <!-- Production History Records -->
  <Frame flex="col" gap={8} w="fill">
    <Frame p={14} bg="#FFFFFF" rounded={22} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={8} w="fill">
      <Frame flex="row" justify="between" items="center" w="fill">
        <Frame flex="col" gap={2}>
          <Text size={13} weight="bold" color="#0F172A">Minggu, 6 Sep 2026</Text>
          <Text size={10} color="#64748B">Shift Pagi • 3,450 Porsi Selesai</Text>
        </Frame>
        <Frame p={4} px={8} bg="#ECFDF5" rounded={8}><Text size={10} weight="bold" color="#059669">100% Selesai</Text></Frame>
      </Frame>
      <Frame flex="row" justify="between" items="center" w="fill" pt={4}>
        <Text size={10} color="#64748B">142 Wadah • Rata-rata Suhu: 68.4°C</Text>
        <Text size={11} weight="bold" color="#4F46E5">Lihat Rekap →</Text>
      </Frame>
    </Frame>

    <Frame p={14} bg="#FFFFFF" rounded={22} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={8} w="fill">
      <Frame flex="row" justify="between" items="center" w="fill">
        <Frame flex="col" gap={2}>
          <Text size={13} weight="bold" color="#0F172A">Sabtu, 5 Sep 2026</Text>
          <Text size={10} color="#64748B">Shift Pagi • 3,420 Porsi Selesai</Text>
        </Frame>
        <Frame p={4} px={8} bg="#ECFDF5" rounded={8}><Text size={10} weight="bold" color="#059669">100% Selesai</Text></Frame>
      </Frame>
      <Frame flex="row" justify="between" items="center" w="fill" pt={4}>
        <Text size={10} color="#64748B">140 Wadah • Rata-rata Suhu: 69.1°C</Text>
        <Text size={11} weight="bold" color="#4F46E5">Lihat Rekap →</Text>
      </Frame>
    </Frame>

    <Frame p={14} bg="#FFFFFF" rounded={22} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={8} w="fill">
      <Frame flex="row" justify="between" items="center" w="fill">
        <Frame flex="col" gap={2}>
          <Text size={13} weight="bold" color="#0F172A">Jumat, 4 Sep 2026</Text>
          <Text size={10} color="#64748B">Shift Pagi • 3,400 Porsi Selesai</Text>
        </Frame>
        <Frame p={4} px={8} bg="#ECFDF5" rounded={8}><Text size={10} weight="bold" color="#059669">100% Selesai</Text></Frame>
      </Frame>
      <Frame flex="row" justify="between" items="center" w="fill" pt={4}>
        <Text size={10} color="#64748B">138 Wadah • Rata-rata Suhu: 67.8°C</Text>
        <Text size={11} weight="bold" color="#4F46E5">Lihat Rekap →</Text>
      </Frame>
    </Frame>
  </Frame>

  ${spatialFloatingDock('history')}
</Frame>
`;

// -------------------------------------------------------------
// 06. PENGATURAN SISTEM (SOP CONFIGURATION)
// -------------------------------------------------------------
const screen6SettingsJsx = `
<Frame name="06 - Pengaturan Sistem (SOP & Sync)" w={412} h={900} bg="#F8FAFC" p={18} flex="col" gap={12}>
  ${statusBar()}

  <!-- Top Header -->
  <Frame flex="row" justify="between" items="center" w="fill" p={14} bg="#FFFFFF" rounded={26} stroke="#E2E8F0" strokeWidth={1}>
    <Frame flex="col" gap={2}>
      <Text size={16} weight="bold" color="#0F172A">Pengaturan Sistem</Text>
      <Text size={10} color="#64748B">Konfigurasi SOP Suhu & Koneksi Cloud</Text>
    </Frame>
    <Frame p={6} px={10} bg="#EEF2FF" rounded={12}>
      <Text size={10} weight="bold" color="#4F46E5">v2.4 SPPG</Text>
    </Frame>
  </Frame>

  <!-- SOP Suhu Card -->
  <Frame p={16} bg="#FFFFFF" rounded={26} stroke="#CBD5E1" strokeWidth={1} flex="col" gap={12} w="fill">
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={13} weight="bold" color="#0F172A">Batas Toleransi Suhu (SOP SPPG)</Text>
      <Text size={9} weight="bold" color="#10B981">● Wajib Standar</Text>
    </Frame>
    
    <Frame flex="row" gap={8} w="fill">
      <Frame p={10} bg="#FFF1F2" rounded={16} stroke="#FFE4E6" strokeWidth={1} flex="col" gap={3} w="fill">
        <Text size={9} weight="bold" color="#BE123C">MIN SUHU PANAS</Text>
        <Text size={16} weight="bold" color="#9F1239">60.0 °C</Text>
        <Text size={8} color="#E11D48">Validasi Distribusi Panas</Text>
      </Frame>
      <Frame p={10} bg="#F0F9FF" rounded={16} stroke="#E0F2FE" strokeWidth={1} flex="col" gap={3} w="fill">
        <Text size={9} weight="bold" color="#0369A1">MAX SUHU DINGIN</Text>
        <Text size={16} weight="bold" color="#075985">10.0 °C</Text>
        <Text size={8} color="#0284C7">Validasi Buah & Susu</Text>
      </Frame>
    </Frame>

    <Frame p={12} bg="#4F46E5" rounded={16} items="center" justify="center" w="fill">
      <Text size={11} weight="bold" color="#FFFFFF">Simpan Konfigurasi SOP Suhu</Text>
    </Frame>
  </Frame>

  <!-- Database & Sync Status -->
  <Frame p={16} bg="#FFFFFF" rounded={26} stroke="#E2E8F0" strokeWidth={1} flex="col" gap={10} w="fill">
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={13} weight="bold" color="#0F172A">Database & Sinkronisasi</Text>
      <Frame p={3} px={8} bg="#ECFDF5" rounded={8}><Text size={9} weight="bold" color="#059669">Online</Text></Frame>
    </Frame>
    <Frame flex="col" gap={6} p={10} bg="#F8FAFC" rounded={16} w="fill">
      <Frame flex="row" justify="between">
        <Text size={10} color="#64748B">Database Lokal:</Text>
        <Text size={10} weight="bold" color="#059669">IndexedDB (Aktif)</Text>
      </Frame>
      <Frame flex="row" justify="between">
        <Text size={10} color="#64748B">Database Cloud:</Text>
        <Text size={10} weight="bold" color="#0F172A">Supabase PostgreSQL</Text>
      </Frame>
      <Frame flex="row" justify="between">
        <Text size={10} color="#64748B">Sinkronisasi Terakhir:</Text>
        <Text size={10} weight="bold" color="#4F46E5">17:35 WIB</Text>
      </Frame>
    </Frame>
    <Frame p={12} bg="#F1F5F9" rounded={16} stroke="#CBD5E1" strokeWidth={1} items="center" justify="center" w="fill">
      <Text size={11} weight="bold" color="#0F172A">🔄 Sinkronkan Sekarang</Text>
    </Frame>
  </Frame>

  <!-- SOP Guidelines Box -->
  <Frame p={12} bg="#EEF2FF" rounded={20} stroke="#C7D2FE" strokeWidth={1} flex="row" gap={8} w="fill">
    <Text size={16}>ℹ️</Text>
    <Text size={10} color="#3730A3" leading={15}>
      Perhatian: Perhitungan pemorsian menggunakan jumlah porsi kumulatif wadah tanpa berat isi. Pemakaian setiap wadah dihitung otomatis oleh sistem.
    </Text>
  </Frame>

  ${spatialFloatingDock('settings')}
</Frame>
`;

async function main() {
  console.log('🚀 [Antigravity Design Expert] Starting rendering of complete Design System and App Screens in Figma...');

  // 1. Render Design System & Tokens Showcase Frame (Row 1 at y=0)
  await renderFrame('00 - Antigravity Design System & Tokens', designSystemJsx, 0, 0);

  // 2. Render 6 App Screens (Row 2 at y=560)
  const screens = [
    { name: '01 - Dashboard', jsx: screen1DashboardJsx, x: 0 },
    { name: '02 - Pemorsian', jsx: screen2PortioningJsx, x: 472 },
    { name: '03 - Distribusi Harian', jsx: screen3DistributionJsx, x: 944 },
    { name: '04 - Master Sekolah', jsx: screen4MasterSchoolJsx, x: 1416 },
    { name: '05 - Riwayat & Laporan', jsx: screen5HistoryJsx, x: 1888 },
    { name: '06 - Pengaturan Sistem', jsx: screen6SettingsJsx, x: 2360 }
  ];

  for (const s of screens) {
    await renderFrame(s.name, s.jsx, s.x, 560);
  }

  console.log('✨ [Antigravity Design Expert] All frames rendered perfectly on the Figma canvas!');
}

main().catch(console.error);
