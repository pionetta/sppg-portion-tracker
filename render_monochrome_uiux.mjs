import { FigmaClient } from 'file:///C:/Users/hp/AppData/Roaming/npm/node_modules/figma-ds-cli/src/figma-client.js';
import { daemonExec } from 'file:///C:/Users/hp/AppData/Roaming/npm/node_modules/figma-ds-cli/src/lib/cli-core.js';

const client = new FigmaClient();

async function renderFrame(name, jsx, x, y) {
  console.log(`🖤 Rendering ${name} at (${x}, ${y})...`);
  const code = await client.parseJSX(jsx, { x, y });
  const result = await daemonExec('eval', { code });
  console.log(`✓ ${name} rendered successfully (ID: ${result?.id})`);
  return result;
}

// Navigation Dock Generator helper for JSX (White Claymorphism with Clean Icons)
function getClayNav(activeTab = 'dashboard') {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'lucide:layout-grid' },
    { id: 'pemorsian', label: 'Pemorsian', icon: 'lucide:scale' },
    { id: 'sekolah', label: 'Sekolah', icon: 'lucide:school' },
    { id: 'riwayat', label: 'Riwayat', icon: 'lucide:clock' },
    { id: 'setelan', label: 'Setelan', icon: 'lucide:settings' },
  ];

  const items = tabs.map(tab => {
    if (tab.id === activeTab) {
      return `
      <Frame p={8} px={14} bg="#1E232B" rounded={22} flex="row" gap={6} items="center">
        <Icon name="${tab.icon}" size={16} color="#FFFFFF" />
        <Text size={11} weight="bold" color="#FFFFFF">${tab.label}</Text>
      </Frame>`;
    } else {
      return `
      <Frame p={6} px={10} flex="col" items="center" gap={3}>
        <Icon name="${tab.icon}" size={18} color="#8D95A5" />
        <Text size={9} weight="medium" color="#8D95A5">${tab.label}</Text>
      </Frame>`;
    }
  }).join('\n');

  return `
  <!-- White Claymorphism Floating Navigation Dock -->
  <Frame p={6} px={12} bg="#FFFFFF" rounded={36} stroke="#E4E7EC" strokeWidth={1.5} shadow="0 14px 28px rgba(30,35,43,0.12)" flex="row" justify="between" items="center" w="fill">
    ${items}
  </Frame>
  `;
}

// -------------------------------------------------------------------
// 00. SOFT GRAPHITE & OFF-WHITE DESIGN SYSTEM & TOKENS
// Showcasing White Claymorphism Navigation & Atoms
// -------------------------------------------------------------------
const tokensJsx = `
<Frame name="00 - Soft Monochrome Design System & Tokens" w={1360} h={520} bg="#1E232B" p={30} rounded={32} flex="col" gap={22}>
  <!-- Header Title -->
  <Frame flex="row" justify="between" items="center" w="fill">
    <Frame flex="col" gap={4}>
      <Frame flex="row" gap={10} items="center">
        <Frame p={6} px={12} bg="#F8F9FB" rounded={10}>
          <Text size={10} weight="bold" color="#1E232B">WHITE CLAY NAVIGATION</Text>
        </Frame>
        <Text size={20} weight="bold" color="#F8F9FB">SPPG Portion Tracker — Design Architecture</Text>
      </Frame>
      <Text size={12} color="#9DA4B0">Soft graphite foundation (#1E232B), eye-comfort alabaster (#F8F9FB), & tactile white claymorphism</Text>
    </Frame>
    <Frame p={8} px={16} bg="#292E39" rounded={14} stroke="#383F4D" strokeWidth={1}>
      <Text size={12} weight="bold" color="#F8F9FB">v2.7 Claymorphism Edition</Text>
    </Frame>
  </Frame>

  <!-- 3 Columns Architecture -->
  <Frame flex="row" gap={18} w="fill">
    <!-- Col 1: Palette -->
    <Frame flex="col" gap={12} p={18} bg="#292E39" rounded={24} stroke="#383F4D" strokeWidth={1} w="fill">
      <Text size={13} weight="bold" color="#F8F9FB">1. Soft Monochrome Scale</Text>
      <Frame flex="row" gap={6} w="fill">
        <Frame p={10} bg="#14181F" rounded={12} stroke="#383F4D" strokeWidth={1} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#F8F9FB">Deep Graphite</Text>
          <Text size={9} color="#8D95A5">#14181F</Text>
        </Frame>
        <Frame p={10} bg="#1E232B" rounded={12} stroke="#383F4D" strokeWidth={1} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#F8F9FB">Slate Hero</Text>
          <Text size={9} color="#8D95A5">#1E232B</Text>
        </Frame>
        <Frame p={10} bg="#6C727F" rounded={12} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#F8F9FB">Muted Gray</Text>
          <Text size={9} color="#EBECEF">#6C727F</Text>
        </Frame>
        <Frame p={10} bg="#D8DCE3" rounded={12} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#1E232B">Border Slate</Text>
          <Text size={9} color="#4B5563">#D8DCE3</Text>
        </Frame>
        <Frame p={10} bg="#EBECEF" rounded={12} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#1E232B">Canvas Gray</Text>
          <Text size={9} color="#6B7280">#EBECEF</Text>
        </Frame>
        <Frame p={10} bg="#FFFFFF" rounded={12} flex="col" gap={4} w="fill">
          <Text size={10} weight="bold" color="#1E232B">Pure White</Text>
          <Text size={9} color="#6B7280">Clay Nav</Text>
        </Frame>
      </Frame>

      <!-- Purposeful Accents -->
      <Text size={12} weight="bold" color="#D8DCE3">Purposeful Functional Accents</Text>
      <Frame flex="row" gap={8} w="fill">
        <Frame p={8} px={12} bg="#EBF2FE" rounded={10} stroke="#BFDBFE" strokeWidth={1} flex="row" gap={6} items="center">
          <Frame w={8} h={8} rounded={4} bg="#3B82F6" />
          <Text size={10} weight="bold" color="#1D4ED8">Cobalt (Active/Mode)</Text>
        </Frame>
        <Frame p={8} px={12} bg="#ECFDF5" rounded={10} stroke="#A7F3D0" strokeWidth={1} flex="row" gap={6} items="center">
          <Frame w={8} h={8} rounded={4} bg="#10B981" />
          <Text size={10} weight="bold" color="#047857">Emerald (SOP Safe)</Text>
        </Frame>
        <Frame p={8} px={12} bg="#FFF1F2" rounded={10} stroke="#FECDD3" strokeWidth={1} flex="row" gap={6} items="center">
          <Frame w={8} h={8} rounded={4} bg="#F43F5E" />
          <Text size={10} weight="bold" color="#BE123C">Coral (Critical)</Text>
        </Frame>
      </Frame>
    </Frame>

    <!-- Col 2: White Claymorphism Dock Feature -->
    <Frame flex="col" gap={12} p={18} bg="#292E39" rounded={24} stroke="#383F4D" strokeWidth={1} w="fill">
      <Text size={13} weight="bold" color="#F8F9FB">2. White Claymorphism Dock</Text>
      <Frame p={6} px={12} bg="#FFFFFF" rounded={32} stroke="#E4E7EC" strokeWidth={1.5} shadow="0 14px 28px rgba(30,35,43,0.12)" flex="row" justify="between" items="center" w="fill">
        <Frame p={8} px={14} bg="#1E232B" rounded={20} flex="row" gap={6} items="center">
          <Icon name="lucide:layout-grid" size={16} color="#FFFFFF" />
          <Text size={11} weight="bold" color="#FFFFFF">Dashboard</Text>
        </Frame>
        <Frame p={6} px={10} flex="col" items="center" gap={3}>
          <Icon name="lucide:scale" size={18} color="#8D95A5" />
          <Text size={9} weight="medium" color="#8D95A5">Pemorsian</Text>
        </Frame>
        <Frame p={6} px={10} flex="col" items="center" gap={3}>
          <Icon name="lucide:school" size={18} color="#8D95A5" />
          <Text size={9} weight="medium" color="#8D95A5">Sekolah</Text>
        </Frame>
        <Frame p={6} px={10} flex="col" items="center" gap={3}>
          <Icon name="lucide:clock" size={18} color="#8D95A5" />
          <Text size={9} weight="medium" color="#8D95A5">Riwayat</Text>
        </Frame>
        <Frame p={6} px={10} flex="col" items="center" gap={3}>
          <Icon name="lucide:settings" size={18} color="#8D95A5" />
          <Text size={9} weight="medium" color="#8D95A5">Setelan</Text>
        </Frame>
      </Frame>
      <Text size={10} color="#8D95A5">Pure white clay base with rounded 32px pill, 1.5px structural rim stroke, and tactile charcoal active pill.</Text>
    </Frame>

    <!-- Col 3: Components -->
    <Frame flex="col" gap={12} p={18} bg="#292E39" rounded={24} stroke="#383F4D" strokeWidth={1} w="fill">
      <Text size={13} weight="bold" color="#F8F9FB">3. Component Atoms</Text>
      <!-- Buttons -->
      <Frame flex="row" gap={10}>
        <Frame p={12} px={16} bg="#F8F9FB" rounded={12} flex="row" items="center" justify="center">
          <Text size={11} weight="bold" color="#1E232B">+ Simpan Batch</Text>
        </Frame>
        <Frame p={12} px={16} bg="#383F4D" rounded={12} flex="row" items="center" justify="center">
          <Text size={11} weight="bold" color="#F8F9FB">Batal / Reset</Text>
        </Frame>
      </Frame>
      <!-- Stepper Atom -->
      <Frame flex="row" gap={6} items="center">
        <Frame p={8} px={12} bg="#1E232B" rounded={10} stroke="#383F4D" strokeWidth={1}>
          <Text size={10} weight="bold" color="#F8F9FB">-10</Text>
        </Frame>
        <Frame p={8} px={12} bg="#1E232B" rounded={10} stroke="#383F4D" strokeWidth={1}>
          <Text size={10} weight="bold" color="#F8F9FB">-1</Text>
        </Frame>
        <Frame p={8} px={16} bg="#F8F9FB" rounded={10}>
          <Text size={12} weight="bold" color="#1E232B">240 Porsi</Text>
        </Frame>
        <Frame p={8} px={12} bg="#1E232B" rounded={10} stroke="#383F4D" strokeWidth={1}>
          <Text size={10} weight="bold" color="#F8F9FB">+1</Text>
        </Frame>
        <Frame p={8} px={12} bg="#1E232B" rounded={10} stroke="#383F4D" strokeWidth={1}>
          <Text size={10} weight="bold" color="#F8F9FB">+10</Text>
        </Frame>
      </Frame>
    </Frame>
  </Frame>
</Frame>
`;

// -------------------------------------------------------------------
// 01. DASHBOARD
// -------------------------------------------------------------------
const dashboardJsx = `
<Frame name="01 - Dashboard" w={412} h={920} bg="#EBECEF" p={20} flex="col" justify="between">
  <Frame flex="col" gap={16} w="fill">
    <!-- Status Bar -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={12} weight="bold" color="#1E232B">09:41</Text>
      <Frame flex="row" gap={6} items="center">
        <Frame w={8} h={8} rounded={4} bg="#10B981" />
        <Text size={11} weight="medium" color="#6C727F">Synced • Online</Text>
      </Frame>
    </Frame>

    <!-- Header App Bar -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Frame flex="col" gap={2}>
        <Text size={11} color="#6C727F" weight="medium">SPPG PORTION TRACKER</Text>
        <Text size={18} weight="bold" color="#1E232B">Dashboard Operasional</Text>
      </Frame>
      <Frame w={36} h={36} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="row" justify="center" items="center">
        <Text size={12} weight="bold" color="#1E232B">UD</Text>
      </Frame>
    </Frame>

    <!-- Hero Card: Slate Charcoal (#1E232B) -->
    <Frame p={18} bg="#1E232B" rounded={22} flex="col" gap={12} w="fill">
      <Frame flex="row" justify="between" items="center">
        <Text size={11} color="#9DA4B0" weight="medium">TARGET PRODUKSI HARI INI</Text>
        <Frame p={4} px={8} bg="#2A303C" rounded={6}>
          <Text size={9} weight="bold" color="#F8F9FB">SHIFT PAGI</Text>
        </Frame>
      </Frame>
      <Frame flex="row" justify="between" items="end">
        <Frame flex="col" gap={2}>
          <Text size={24} weight="bold" color="#F8F9FB">2,450 <Text size={14} color="#9DA4B0" weight="regular">/ 3,200</Text></Text>
          <Text size={11} color="#9DA4B0">Total Porsi Siap Distribusi</Text>
        </Frame>
        <Frame p={6} px={10} bg="#384050" rounded={8}>
          <Text size={13} weight="bold" color="#F8F9FB">76.5%</Text>
        </Frame>
      </Frame>
      <!-- Progress Bar -->
      <Frame w="fill" h={7} bg="#2A303C" rounded={4}>
        <Frame w={240} h={7} bg="#F8F9FB" rounded={4} />
      </Frame>
    </Frame>

    <!-- 4-Stat Metric Grid in Alabaster (#F8F9FB) -->
    <Frame flex="row" gap={10} w="fill">
      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Text size={10} color="#6C727F">Wadah Terisi</Text>
        <Text size={16} weight="bold" color="#1E232B">48 / 64</Text>
        <Frame p={2} px={6} bg="#EBF2FE" rounded={4} w={56}>
          <Text size={9} weight="bold" color="#1D4ED8">75% Selesai</Text>
        </Frame>
      </Frame>
      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Text size={10} color="#6C727F">Suhu Rata-rata</Text>
        <Text size={16} weight="bold" color="#1E232B">68.2°C</Text>
        <Frame p={2} px={6} bg="#ECFDF5" rounded={4} w={64}>
          <Text size={9} weight="bold" color="#047857">Lolos SOP</Text>
        </Frame>
      </Frame>
    </Frame>

    <Frame flex="row" gap={10} w="fill">
      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Text size={10} color="#6C727F">Sekolah Siap</Text>
        <Text size={16} weight="bold" color="#1E232B">6 / 8</Text>
        <Frame p={2} px={6} bg="#EBECEF" rounded={4} w={64}>
          <Text size={9} weight="medium" color="#4B5563">2 On Delivery</Text>
        </Frame>
      </Frame>
      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Text size={10} color="#6C727F">Timbangan</Text>
        <Text size={16} weight="bold" color="#1E232B">TERKALIBRASI</Text>
        <Frame p={2} px={6} bg="#EBECEF" rounded={4} w={62}>
          <Text size={9} weight="medium" color="#4B5563">Presisi 0.1g</Text>
        </Frame>
      </Frame>
    </Frame>

    <!-- Active Menu Status -->
    <Frame flex="col" gap={8} w="fill">
      <Frame flex="row" justify="between" items="center">
        <Text size={13} weight="bold" color="#1E232B">Menu Aktif Hari Ini</Text>
        <Text size={11} color="#6C727F">Senin, 06 Sept</Text>
      </Frame>
      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="row" justify="between" items="center">
        <Frame flex="col" gap={2}>
          <Text size={13} weight="bold" color="#1E232B">Ayam Goreng Lengkuas</Text>
          <Text size={11} color="#6C727F">Standar: 70g (SD) • 90g (SMP)</Text>
        </Frame>
        <Frame p={6} px={10} bg="#1E232B" rounded={10}>
          <Text size={11} weight="bold" color="#F8F9FB">Mulai Timbang</Text>
        </Frame>
      </Frame>
    </Frame>
  </Frame>

  ${getClayNav('dashboard')}
</Frame>
`;

// -------------------------------------------------------------------
// 02. PEMORSIAN (2-CONTAINER MODE)
// -------------------------------------------------------------------
const pemorsianJsx = `
<Frame name="02 - Pemorsian (2-Container Mode)" w={412} h={920} bg="#EBECEF" p={20} flex="col" justify="between">
  <Frame flex="col" gap={14} w="fill">
    <!-- Header -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Frame flex="col" gap={2}>
        <Text size={11} color="#6C727F" weight="medium">PRODUKSI & TIMBANGAN</Text>
        <Text size={18} weight="bold" color="#1E232B">Pemorsian Menu</Text>
      </Frame>
      <!-- Dual Container Mode Active Badge (Cobalt Accent) -->
      <Frame p={6} px={10} bg="#EBF2FE" rounded={10} stroke="#BFDBFE" strokeWidth={1}>
        <Text size={10} weight="bold" color="#1D4ED8">MODE 2 WADAH AKTIF</Text>
      </Frame>
    </Frame>

    <!-- Digital Scale Simulator -->
    <Frame p={16} bg="#1E232B" rounded={22} stroke="#2D333F" strokeWidth={1} flex="col" gap={10} w="fill">
      <Frame flex="row" justify="between" items="center">
        <Text size={11} color="#9DA4B0">DIGITAL SCALE TARE</Text>
        <Frame p={4} px={8} bg="#2A303C" rounded={6}>
          <Text size={9} weight="bold" color="#10B981">STABIL ±0.1g</Text>
        </Frame>
      </Frame>
      <Frame flex="row" justify="between" items="center">
        <Text size={32} weight="bold" color="#F8F9FB">7,240 <Text size={16} color="#9DA4B0">g</Text></Text>
        <Frame flex="col" gap={2} items="end">
          <Text size={10} color="#9DA4B0">Target Netto</Text>
          <Text size={14} weight="bold" color="#F8F9FB">7,200 g (50 Porsi)</Text>
        </Frame>
      </Frame>
      <!-- Scale Precision Indicator -->
      <Frame flex="row" justify="between" items="center" p={8} bg="#252A34" rounded={10}>
        <Text size={10} color="#D8DCE3">Deviasi: +40g (+0.5%)</Text>
        <Text size={10} weight="bold" color="#10B981">Dalam Toleransi SOP</Text>
      </Frame>
    </Frame>

    <!-- Dual Container Split Card (Alabaster #F8F9FB) -->
    <Frame p={16} bg="#F8F9FB" rounded={20} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={12} w="fill">
      <Frame flex="row" justify="between" items="center">
        <Text size={13} weight="bold" color="#1E232B">Distribusi Split Wadah Nasi</Text>
        <Text size={11} color="#6C727F">Total 100 Porsi</Text>
      </Frame>

      <!-- Wadah A -->
      <Frame p={12} bg="#EBECEF" rounded={14} stroke="#D8DCE3" strokeWidth={1} flex="row" justify="between" items="center">
        <Frame flex="col" gap={2}>
          <Text size={12} weight="bold" color="#1E232B">Wadah A (Kiri)</Text>
          <Text size={10} color="#6C727F">Tara: 820g • Netto: 3,620g</Text>
        </Frame>
        <Frame p={4} px={10} bg="#1E232B" rounded={8}>
          <Text size={11} weight="bold" color="#F8F9FB">50 Porsi</Text>
        </Frame>
      </Frame>

      <!-- Wadah B -->
      <Frame p={12} bg="#EBECEF" rounded={14} stroke="#D8DCE3" strokeWidth={1} flex="row" justify="between" items="center">
        <Frame flex="col" gap={2}>
          <Text size={12} weight="bold" color="#1E232B">Wadah B (Kanan)</Text>
          <Text size={10} color="#6C727F">Tara: 815g • Netto: 3,620g</Text>
        </Frame>
        <Frame p={4} px={10} bg="#1E232B" rounded={8}>
          <Text size={11} weight="bold" color="#F8F9FB">50 Porsi</Text>
        </Frame>
      </Frame>
    </Frame>

    <!-- Temperature & Food Safety SOP (Emerald Accent) -->
    <Frame p={14} bg="#ECFDF5" rounded={16} stroke="#A7F3D0" strokeWidth={1} flex="row" justify="between" items="center">
      <Frame flex="col" gap={2}>
        <Text size={10} color="#047857" weight="bold">UJI SUHU PRODUKSI SEBELUM PACKING</Text>
        <Text size={14} weight="bold" color="#047857">68.5°C — Lolos Standar Panas</Text>
      </Frame>
      <Frame p={6} px={10} bg="#047857" rounded={8}>
        <Text size={10} weight="bold" color="#F8F9FB">Input Suhu</Text>
      </Frame>
    </Frame>

    <!-- Action Buttons -->
    <Frame flex="row" gap={10} w="fill">
      <Frame p={14} bg="#1E232B" rounded={14} flex="row" justify="center" items="center" w="fill">
        <Text size={12} weight="bold" color="#F8F9FB">+ Simpan Batch Wadah A & B</Text>
      </Frame>
    </Frame>
  </Frame>

  ${getClayNav('pemorsian')}
</Frame>
`;

// -------------------------------------------------------------------
// 03. DISTRIBUSI HARIAN
// -------------------------------------------------------------------
const distribusiJsx = `
<Frame name="03 - Distribusi Harian" w={412} h={920} bg="#EBECEF" p={20} flex="col" justify="between">
  <Frame flex="col" gap={14} w="fill">
    <!-- Header -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Frame flex="col" gap={2}>
        <Text size={11} color="#6C727F" weight="medium">ALOKASI & PENGIRIMAN</Text>
        <Text size={18} weight="bold" color="#1E232B">Distribusi Harian</Text>
      </Frame>
      <Frame p={6} px={10} bg="#1E232B" rounded={10}>
        <Text size={10} weight="bold" color="#F8F9FB">Senin, 06 Sept</Text>
      </Frame>
    </Frame>

    <!-- Target Proportion Bar (Alabaster #F8F9FB) -->
    <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={8} w="fill">
      <Frame flex="row" justify="between" items="center">
        <Text size={11} weight="bold" color="#1E232B">Target Distribusi Siswa</Text>
        <Text size={11} color="#6C727F">3,200 Siswa Terdaftar</Text>
      </Frame>
      <Frame flex="row" gap={4} w="fill" h={8} rounded={4}>
        <Frame w={180} h={8} bg="#1E232B" rounded={4} />
        <Frame w={110} h={8} bg="#6C727F" rounded={4} />
        <Frame w={80} h={8} bg="#D8DCE3" rounded={4} />
      </Frame>
      <Frame flex="row" justify="between" items="center">
        <Text size={10} color="#1E232B" weight="medium">SD: 1,800</Text>
        <Text size={10} color="#6C727F" weight="medium">SMP: 1,050</Text>
        <Text size={10} color="#6C727F" weight="medium">SMA: 350</Text>
      </Frame>
    </Frame>

    <!-- Quick Preset Buttons -->
    <Frame flex="row" gap={8} w="fill">
      <Frame p={8} px={12} bg="#1E232B" rounded={10} flex="row" justify="center" items="center">
        <Text size={10} weight="bold" color="#F8F9FB">Default Target</Text>
      </Frame>
      <Frame p={8} px={12} bg="#F8F9FB" rounded={10} stroke="#D8DCE3" strokeWidth={1} flex="row" justify="center" items="center">
        <Text size={10} weight="medium" color="#1E232B">+5% Cadangan</Text>
      </Frame>
      <Frame p={8} px={12} bg="#F8F9FB" rounded={10} stroke="#D8DCE3" strokeWidth={1} flex="row" justify="center" items="center">
        <Text size={10} weight="medium" color="#1E232B">Hanya SD</Text>
      </Frame>
    </Frame>

    <!-- School Stepper List -->
    <Frame flex="col" gap={10} w="fill">
      <!-- School 1 -->
      <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={10} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Frame flex="col" gap={2}>
            <Text size={13} weight="bold" color="#1E232B">SDN Merdeka 01</Text>
            <Text size={10} color="#6C727F">Kec. Lowokwaru • 12 Wadah</Text>
          </Frame>
          <Frame p={4} px={8} bg="#EBECEF" rounded={6}>
            <Text size={10} weight="bold" color="#1E232B">Jenjang SD</Text>
          </Frame>
        </Frame>
        <Frame flex="row" justify="between" items="center" p={8} bg="#EBECEF" rounded={12}>
          <Frame flex="row" gap={6}>
            <Frame p={6} px={10} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
              <Text size={10} weight="bold" color="#1E232B">-10</Text>
            </Frame>
            <Frame p={6} px={8} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
              <Text size={10} weight="bold" color="#1E232B">-1</Text>
            </Frame>
          </Frame>
          <Text size={14} weight="bold" color="#1E232B">450 <Text size={10} color="#6C727F">Porsi</Text></Text>
          <Frame flex="row" gap={6}>
            <Frame p={6} px={8} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
              <Text size={10} weight="bold" color="#1E232B">+1</Text>
            </Frame>
            <Frame p={6} px={10} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
              <Text size={10} weight="bold" color="#1E232B">+10</Text>
            </Frame>
          </Frame>
        </Frame>
      </Frame>

      <!-- School 2 -->
      <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={10} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Frame flex="col" gap={2}>
            <Text size={13} weight="bold" color="#1E232B">SMP Negeri 03</Text>
            <Text size={10} color="#6C727F">Kec. Klojen • 16 Wadah</Text>
          </Frame>
          <Frame p={4} px={8} bg="#EBECEF" rounded={6}>
            <Text size={10} weight="bold" color="#1E232B">Jenjang SMP</Text>
          </Frame>
        </Frame>
        <Frame flex="row" justify="between" items="center" p={8} bg="#EBECEF" rounded={12}>
          <Frame flex="row" gap={6}>
            <Frame p={6} px={10} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
              <Text size={10} weight="bold" color="#1E232B">-10</Text>
            </Frame>
            <Frame p={6} px={8} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
              <Text size={10} weight="bold" color="#1E232B">-1</Text>
            </Frame>
          </Frame>
          <Text size={14} weight="bold" color="#1E232B">520 <Text size={10} color="#6C727F">Porsi</Text></Text>
          <Frame flex="row" gap={6}>
            <Frame p={6} px={8} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
              <Text size={10} weight="bold" color="#1E232B">+1</Text>
            </Frame>
            <Frame p={6} px={10} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
              <Text size={10} weight="bold" color="#1E232B">+10</Text>
            </Frame>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  </Frame>

  ${getClayNav('sekolah')}
</Frame>
`;

// -------------------------------------------------------------------
// 04. MASTER SEKOLAH
// -------------------------------------------------------------------
const masterSekolahJsx = `
<Frame name="04 - Master Sekolah" w={412} h={920} bg="#EBECEF" p={20} flex="col" justify="between">
  <Frame flex="col" gap={14} w="fill">
    <!-- Header -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Frame flex="col" gap={2}>
        <Text size={11} color="#6C727F" weight="medium">DATABASE SEKOLAH</Text>
        <Text size={18} weight="bold" color="#1E232B">Master Sekolah</Text>
      </Frame>
      <Frame p={8} px={12} bg="#1E232B" rounded={10}>
        <Text size={11} weight="bold" color="#F8F9FB">+ Tambah</Text>
      </Frame>
    </Frame>

    <!-- Search Input (Alabaster #F8F9FB) -->
    <Frame p={12} px={16} bg="#F8F9FB" rounded={14} stroke="#D8DCE3" strokeWidth={1} flex="row" justify="between" items="center">
      <Text size={12} color="#8D95A5">Cari nama sekolah atau kecamatan...</Text>
      <Frame p={4} px={8} bg="#EBECEF" rounded={6}>
        <Text size={9} weight="bold" color="#6C727F">CARI</Text>
      </Frame>
    </Frame>

    <!-- Jenjang Filters -->
    <Frame flex="row" gap={8} w="fill">
      <Frame p={6} px={12} bg="#1E232B" rounded={8}>
        <Text size={10} weight="bold" color="#F8F9FB">Semua (8)</Text>
      </Frame>
      <Frame p={6} px={12} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
        <Text size={10} weight="medium" color="#1E232B">SD (5)</Text>
      </Frame>
      <Frame p={6} px={12} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
        <Text size={10} weight="medium" color="#1E232B">SMP (2)</Text>
      </Frame>
      <Frame p={6} px={12} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
        <Text size={10} weight="medium" color="#1E232B">SMA (1)</Text>
      </Frame>
    </Frame>

    <!-- School Catalog Cards -->
    <Frame flex="col" gap={10} w="fill">
      <!-- Card 1 -->
      <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={8} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={13} weight="bold" color="#1E232B">SDN Sukoharjo 02</Text>
          <Frame p={3} px={8} bg="#EBF2FE" rounded={6}>
            <Text size={9} weight="bold" color="#1D4ED8">SD</Text>
          </Frame>
        </Frame>
        <Text size={11} color="#6C727F">Jl. Martadinata No. 45, Klojen • Kontak: Ibu Sri</Text>
        <Frame flex="row" justify="between" items="center" p={8} bg="#EBECEF" rounded={10}>
          <Text size={10} color="#1E232B">Porsi Default: 380 Siswa</Text>
          <Frame flex="row" gap={8}>
            <Text size={10} weight="bold" color="#1E232B">Edit</Text>
            <Text size={10} weight="bold" color="#F43F5E">Hapus</Text>
          </Frame>
        </Frame>
      </Frame>

      <!-- Card 2 -->
      <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={8} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={13} weight="bold" color="#1E232B">SMP Negeri 01 Malang</Text>
          <Frame p={3} px={8} bg="#EBF2FE" rounded={6}>
            <Text size={9} weight="bold" color="#1D4ED8">SMP</Text>
          </Frame>
        </Frame>
        <Text size={11} color="#6C727F">Jl. Lawu No. 12, Oro-oro Dowo • Kontak: Pak Budi</Text>
        <Frame flex="row" justify="between" items="center" p={8} bg="#EBECEF" rounded={10}>
          <Text size={10} color="#1E232B">Porsi Default: 620 Siswa</Text>
          <Frame flex="row" gap={8}>
            <Text size={10} weight="bold" color="#1E232B">Edit</Text>
            <Text size={10} weight="bold" color="#F43F5E">Hapus</Text>
          </Frame>
        </Frame>
      </Frame>

      <!-- Card 3 -->
      <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={8} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={13} weight="bold" color="#1E232B">SMA Negeri 03 Malang</Text>
          <Frame p={3} px={8} bg="#EBF2FE" rounded={6}>
            <Text size={9} weight="bold" color="#1D4ED8">SMA</Text>
          </Frame>
        </Frame>
        <Text size={11} color="#6C727F">Jl. Sultan Agung No. 7, Klojen • Kontak: Ibu Ratna</Text>
        <Frame flex="row" justify="between" items="center" p={8} bg="#EBECEF" rounded={10}>
          <Text size={10} color="#1E232B">Porsi Default: 350 Siswa</Text>
          <Frame flex="row" gap={8}>
            <Text size={10} weight="bold" color="#1E232B">Edit</Text>
            <Text size={10} weight="bold" color="#F43F5E">Hapus</Text>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  </Frame>

  ${getClayNav('sekolah')}
</Frame>
`;

// -------------------------------------------------------------------
// 05. RIWAYAT & LAPORAN
// -------------------------------------------------------------------
const riwayatJsx = `
<Frame name="05 - Riwayat & Laporan" w={412} h={920} bg="#EBECEF" p={20} flex="col" justify="between">
  <Frame flex="col" gap={14} w="fill">
    <!-- Header -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Frame flex="col" gap={2}>
        <Text size={11} color="#6C727F" weight="medium">ARSIP & AUDIT</Text>
        <Text size={18} weight="bold" color="#1E232B">Riwayat & Laporan</Text>
      </Frame>
      <Frame flex="row" gap={6}>
        <Frame p={6} px={10} bg="#1E232B" rounded={8}>
          <Text size={10} weight="bold" color="#F8F9FB">Excel</Text>
        </Frame>
        <Frame p={6} px={10} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}>
          <Text size={10} weight="bold" color="#1E232B">CSV</Text>
        </Frame>
      </Frame>
    </Frame>

    <!-- Summary Box (Slate #1E232B) -->
    <Frame p={16} bg="#1E232B" rounded={20} flex="col" gap={10} w="fill">
      <Text size={11} color="#9DA4B0">TOTAL DISTRIBUSI MINGGU INI</Text>
      <Frame flex="row" justify="between" items="center">
        <Text size={24} weight="bold" color="#F8F9FB">15,840 <Text size={13} color="#9DA4B0">Porsi</Text></Text>
        <Frame p={4} px={8} bg="#2A303C" rounded={6}>
          <Text size={10} weight="bold" color="#10B981">100% On Time</Text>
        </Frame>
      </Frame>
      <Frame flex="row" justify="between" items="center" p={8} bg="#252A34" rounded={10}>
        <Text size={10} color="#D8DCE3">Rata-rata Suhu: 67.8°C</Text>
        <Text size={10} color="#D8DCE3">Deviasi Berat: ±0.3%</Text>
      </Frame>
    </Frame>

    <!-- History Log Items -->
    <Frame flex="col" gap={10} w="fill">
      <!-- Item 1 -->
      <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={6} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={12} weight="bold" color="#1E232B">Jumat, 03 Sept 2026</Text>
          <Frame p={3} px={8} bg="#ECFDF5" rounded={6}>
            <Text size={9} weight="bold" color="#047857">SELESAI 100%</Text>
          </Frame>
        </Frame>
        <Text size={11} color="#6C727F">3,200 Porsi • Menu: Semur Daging & Tumis Buncis</Text>
        <Frame flex="row" justify="between" items="center">
          <Text size={10} color="#1E232B">Suhu Rata-rata: 69.1°C</Text>
          <Text size={10} weight="bold" color="#1D4ED8">Lihat Detail →</Text>
        </Frame>
      </Frame>

      <!-- Item 2 -->
      <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={6} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={12} weight="bold" color="#1E232B">Kamis, 02 Sept 2026</Text>
          <Frame p={3} px={8} bg="#ECFDF5" rounded={6}>
            <Text size={9} weight="bold" color="#047857">SELESAI 100%</Text>
          </Frame>
        </Frame>
        <Text size={11} color="#6C727F">3,180 Porsi • Menu: Ayam Bumbu Bali & Sayur Lodeh</Text>
        <Frame flex="row" justify="between" items="center">
          <Text size={10} color="#1E232B">Suhu Rata-rata: 68.4°C</Text>
          <Text size={10} weight="bold" color="#1D4ED8">Lihat Detail →</Text>
        </Frame>
      </Frame>

      <!-- Item 3 -->
      <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={6} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={12} weight="bold" color="#1E232B">Rabu, 01 Sept 2026</Text>
          <Frame p={3} px={8} bg="#ECFDF5" rounded={6}>
            <Text size={9} weight="bold" color="#047857">SELESAI 100%</Text>
          </Frame>
        </Frame>
        <Text size={11} color="#6C727F">3,150 Porsi • Menu: Ikan Fillet Asam Manis & Capcay</Text>
        <Frame flex="row" justify="between" items="center">
          <Text size={10} color="#1E232B">Suhu Rata-rata: 67.9°C</Text>
          <Text size={10} weight="bold" color="#1D4ED8">Lihat Detail →</Text>
        </Frame>
      </Frame>
    </Frame>
  </Frame>

  ${getClayNav('riwayat')}
</Frame>
`;

// -------------------------------------------------------------------
// 06. PENGATURAN SISTEM
// -------------------------------------------------------------------
const pengaturanJsx = `
<Frame name="06 - Pengaturan Sistem" w={412} h={920} bg="#EBECEF" p={20} flex="col" justify="between">
  <Frame flex="col" gap={14} w="fill">
    <!-- Header -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Frame flex="col" gap={2}>
        <Text size={11} color="#6C727F" weight="medium">STANDAR & KALIBRASI</Text>
        <Text size={18} weight="bold" color="#1E232B">Pengaturan Sistem</Text>
      </Frame>
      <Frame p={6} px={10} bg="#10B981" rounded={8}>
        <Text size={10} weight="bold" color="#F8F9FB">Tersimpan</Text>
      </Frame>
    </Frame>

    <!-- SOP Temperature Thresholds (Alabaster #F8F9FB) -->
    <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={10} w="fill">
      <Text size={13} weight="bold" color="#1E232B">Batas SOP Suhu Keamanan Pangan</Text>
      <Frame flex="row" gap={10} w="fill">
        <Frame p={10} bg="#EBECEF" rounded={12} flex="col" gap={4} w="fill">
          <Text size={10} color="#6C727F">Min Panas (Hot Limit)</Text>
          <Text size={16} weight="bold" color="#1E232B">≥ 60.0°C</Text>
        </Frame>
        <Frame p={10} bg="#EBECEF" rounded={12} flex="col" gap={4} w="fill">
          <Text size={10} color="#6C727F">Maks Dingin (Cold)</Text>
          <Text size={16} weight="bold" color="#1E232B">≤ 5.0°C</Text>
        </Frame>
      </Frame>
    </Frame>

    <!-- Menu Categories (7 Kategori) -->
    <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={8} w="fill">
      <Text size={13} weight="bold" color="#1E232B">Kategori Komponen Menu (7)</Text>
      <Frame flex="row" wrap={true} gap={6}>
        <Frame p={4} px={8} bg="#EBECEF" rounded={6}><Text size={9} weight="bold" color="#1E232B">Karbohidrat</Text></Frame>
        <Frame p={4} px={8} bg="#EBECEF" rounded={6}><Text size={9} weight="bold" color="#1E232B">Lauk Hewani</Text></Frame>
        <Frame p={4} px={8} bg="#EBECEF" rounded={6}><Text size={9} weight="bold" color="#1E232B">Lauk Nabati</Text></Frame>
        <Frame p={4} px={8} bg="#EBECEF" rounded={6}><Text size={9} weight="bold" color="#1E232B">Sayuran</Text></Frame>
        <Frame p={4} px={8} bg="#EBECEF" rounded={6}><Text size={9} weight="bold" color="#1E232B">Buah</Text></Frame>
        <Frame p={4} px={8} bg="#EBECEF" rounded={6}><Text size={9} weight="bold" color="#1E232B">Susu</Text></Frame>
        <Frame p={4} px={8} bg="#EBECEF" rounded={6}><Text size={9} weight="bold" color="#1E232B">Snack Tambahan</Text></Frame>
      </Frame>
    </Frame>

    <!-- Storage & Database Sync Status -->
    <Frame p={14} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={10} w="fill">
      <Text size={13} weight="bold" color="#1E232B">Penyimpanan & Database</Text>
      <Frame flex="row" justify="between" items="center" p={10} bg="#EBECEF" rounded={12}>
        <Frame flex="col" gap={2}>
          <Text size={11} weight="bold" color="#1E232B">IndexedDB Offline Sync</Text>
          <Text size={9} color="#6C727F">240 Entri Tersimpan Lokal</Text>
        </Frame>
        <Frame p={4} px={8} bg="#ECFDF5" rounded={6}>
          <Text size={9} weight="bold" color="#047857">AKTIF</Text>
        </Frame>
      </Frame>
      <Frame flex="row" justify="between" items="center" p={10} bg="#EBECEF" rounded={12}>
        <Frame flex="col" gap={2}>
          <Text size={11} weight="bold" color="#1E232B">Supabase Realtime Cloud</Text>
          <Text size={9} color="#6C727F">Terhubung ke Server Utama</Text>
        </Frame>
        <Frame p={4} px={8} bg="#ECFDF5" rounded={6}>
          <Text size={9} weight="bold" color="#047857">ONLINE</Text>
        </Frame>
      </Frame>
    </Frame>
  </Frame>

  ${getClayNav('setelan')}
</Frame>
`;

async function main() {
  console.log('🚀 [Antigravity Design Expert] Clearing old canvas and rendering White Claymorphism Navigation...');
  
  // Clear old frames
  await daemonExec('eval', { code: 'figma.currentPage.children.forEach(c => c.remove())' });

  // Row 1: Tokens Showcase (1360 x 520)
  await renderFrame('00 - Soft Monochrome Design System & Tokens', tokensJsx, 0, 0);

  // Row 2: 6 Mobile Screens (412 x 920 each, gap = 60)
  const screens = [
    { name: '01 - Dashboard', jsx: dashboardJsx, x: 0 },
    { name: '02 - Pemorsian', jsx: pemorsianJsx, x: 472 },
    { name: '03 - Distribusi Harian', jsx: distribusiJsx, x: 944 },
    { name: '04 - Master Sekolah', jsx: masterSekolahJsx, x: 1416 },
    { name: '05 - Riwayat & Laporan', jsx: riwayatJsx, x: 1888 },
    { name: '06 - Pengaturan Sistem', jsx: pengaturanJsx, x: 2360 },
  ];

  for (const screen of screens) {
    await renderFrame(screen.name, screen.jsx, screen.x, 560);
  }

  // Adjust viewport
  await daemonExec('eval', { code: 'figma.viewport.scrollAndZoomIntoView(figma.currentPage.children)' });
  console.log('✨ [Antigravity Design Expert] All frames with White Claymorphism Navigation rendered & centered successfully on Figma!');
}

main().catch(err => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
