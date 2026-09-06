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

// Navigation Dock Generator (Only essential icons kept here)
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
      <Frame p={6} px={12} bg="#1E232B" rounded={20} flex="row" gap={5} items="center">
        <Icon name="${tab.icon}" size={15} color="#FFFFFF" />
        <Text size={10} weight="bold" color="#FFFFFF">${tab.label}</Text>
      </Frame>`;
    } else {
      return `
      <Frame p={4} px={8} flex="col" items="center" gap={2}>
        <Icon name="${tab.icon}" size={16} color="#8D95A5" />
        <Text size={9} weight="medium" color="#8D95A5">${tab.label}</Text>
      </Frame>`;
    }
  }).join('\n');

  return `
  <!-- White Claymorphism Floating Navigation Dock -->
  <Frame p={5} px={10} bg="#FFFFFF" rounded={32} stroke="#E4E7EC" strokeWidth={1.5} shadow="0 12px 24px rgba(30,35,43,0.10)" flex="row" justify="between" items="center" w="fill">
    ${items}
  </Frame>
  `;
}

// Minimalist Top Status Bar (iQOO Z10)
const iqooStatusBar = `
<Frame flex="row" justify="between" items="center" w="fill" pt={2} px={4}>
  <Text size={11} weight="bold" color="#1E232B">09:41</Text>
  <!-- Center Punch Hole -->
  <Frame w={10} h={10} rounded={5} bg="#14181F" />
  <Text size={10} weight="medium" color="#6C727F">100%</Text>
</Frame>
`;

// Bottom Android Gesture Indicator Bar
const iqooGestureBar = `
<Frame w="fill" flex="row" justify="center" pt={2}>
  <Frame w={96} h={4} rounded={2} bg="#8D95A5" />
</Frame>
`;

// -------------------------------------------------------------------
// 00. DESIGN SPEC & iQOO Z10 MINIMALIST SHOWCASE
// -------------------------------------------------------------------
const tokensJsx = `
<Frame name="00 - iQOO Z10 Minimalist System (No Noise)" w={1360} h={520} bg="#1E232B" p={30} rounded={32} flex="col" gap={22}>
  <!-- Header Title -->
  <Frame flex="row" justify="between" items="center" w="fill">
    <Frame flex="col" gap={4}>
      <Frame flex="row" gap={10} items="center">
        <Frame p={6} px={12} bg="#F8F9FB" rounded={10}>
          <Text size={10} weight="bold" color="#1E232B">MINIMALIST ESSENTIALS</Text>
        </Frame>
        <Text size={20} weight="bold" color="#F8F9FB">SPPG Portion Tracker — Pure Hierarchy</Text>
      </Frame>
      <Text size={12} color="#9DA4B0">Ultra-simplified top bar, zero decorative icon noise, and high-readability typography</Text>
    </Frame>
    <Frame p={8} px={16} bg="#292E39" rounded={14} stroke="#383F4D" strokeWidth={1}>
      <Text size={12} weight="bold" color="#F8F9FB">v3.1 Pure Edition</Text>
    </Frame>
  </Frame>

  <!-- 3 Columns Architecture -->
  <Frame flex="row" gap={18} w="fill">
    <!-- Col 1: Screen Specs -->
    <Frame flex="col" gap={12} p={18} bg="#292E39" rounded={24} stroke="#383F4D" strokeWidth={1} w="fill">
      <Text size={13} weight="bold" color="#F8F9FB">1. Layar iQOO Z10 (393 × 870)</Text>
      <Frame flex="col" gap={8} p={12} bg="#1E232B" rounded={16}>
        <Text size={11} color="#F8F9FB">Viewport: 393 × 870 pt (20:9)</Text>
        <Text size={11} color="#8D95A5">Top bar ultra-simpel: jam + punch-hole + baterai</Text>
        <Text size={11} color="#8D95A5">Radius layar 40px, bottom gesture bar 96px</Text>
      </Frame>
    </Frame>

    <!-- Col 2: No-Icon Clean Principles -->
    <Frame flex="col" gap={12} p={18} bg="#292E39" rounded={24} stroke="#383F4D" strokeWidth={1} w="fill">
      <Text size={13} weight="bold" color="#F8F9FB">2. Eliminasi Ikon Dekoratif</Text>
      <Frame flex="col" gap={8}>
        <Frame p={10} bg="#1E232B" rounded={14}>
          <Text size={11} color="#F8F9FB">✓ Ikon hanya pada navigasi bawah (wayfinding)</Text>
        </Frame>
        <Frame p={10} bg="#1E232B" rounded={14}>
          <Text size={11} color="#F8F9FB">✓ Hapus ikon pada kartu metrik (fokus angka & label)</Text>
        </Frame>
        <Frame p={10} bg="#1E232B" rounded={14}>
          <Text size={11} color="#F8F9FB">✓ Hapus ikon search/avatar yang membebani visual</Text>
        </Frame>
      </Frame>
    </Frame>

    <!-- Col 3: White Clay Navigation Component -->
    <Frame flex="col" gap={12} p={18} bg="#292E39" rounded={24} stroke="#383F4D" strokeWidth={1} w="fill">
      <Text size={13} weight="bold" color="#F8F9FB">3. Navigasi Bawah Fungsional</Text>
      <Frame p={5} px={10} bg="#FFFFFF" rounded={32} stroke="#E4E7EC" strokeWidth={1.5} shadow="0 12px 24px rgba(30,35,43,0.10)" flex="row" justify="between" items="center" w="fill">
        <Frame p={6} px={12} bg="#1E232B" rounded={20} flex="row" gap={5} items="center">
          <Icon name="lucide:layout-grid" size={15} color="#FFFFFF" />
          <Text size={10} weight="bold" color="#FFFFFF">Dashboard</Text>
        </Frame>
        <Frame p={4} px={8} flex="col" items="center" gap={2}>
          <Icon name="lucide:scale" size={16} color="#8D95A5" />
          <Text size={9} weight="medium" color="#8D95A5">Pemorsian</Text>
        </Frame>
        <Frame p={4} px={8} flex="col" items="center" gap={2}>
          <Icon name="lucide:school" size={16} color="#8D95A5" />
          <Text size={9} weight="medium" color="#8D95A5">Sekolah</Text>
        </Frame>
        <Frame p={4} px={8} flex="col" items="center" gap={2}>
          <Icon name="lucide:clock" size={16} color="#8D95A5" />
          <Text size={9} weight="medium" color="#8D95A5">Riwayat</Text>
        </Frame>
        <Frame p={4} px={8} flex="col" items="center" gap={2}>
          <Icon name="lucide:settings" size={16} color="#8D95A5" />
          <Text size={9} weight="medium" color="#8D95A5">Setelan</Text>
        </Frame>
      </Frame>
      <Text size={10} color="#8D95A5">Satu-satunya area dengan ikon adalah bilah navigasi ini.</Text>
    </Frame>
  </Frame>
</Frame>
`;

// -------------------------------------------------------------------
// 01. DASHBOARD (Ultra-Simple Top Bar, No Decorative Icons)
// -------------------------------------------------------------------
const dashboardJsx = `
<Frame name="01 - Dashboard (iQOO Z10)" w={393} h={870} bg="#EBECEF" p={16} rounded={40} flex="col" justify="between" clip="true">
  <Frame flex="col" gap={16} w="fill">
    ${iqooStatusBar}

    <!-- Ultra-Simple Header: Just Title & Date -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={20} weight="bold" color="#1E232B">Dashboard</Text>
      <Text size={11} weight="medium" color="#6C727F">Senin, 06 Sept</Text>
    </Frame>

    <!-- Clean Hero Progress Card -->
    <Frame p={18} bg="#1E232B" rounded={22} flex="col" gap={12} w="fill">
      <Frame flex="row" justify="between" items="center">
        <Text size={11} color="#9DA4B0" weight="medium">PRODUKSI SHIFT PAGI</Text>
        <Text size={12} weight="bold" color="#F8F9FB">76.5%</Text>
      </Frame>
      <Text size={28} weight="bold" color="#F8F9FB">2,450 <Text size={15} color="#9DA4B0" weight="regular">/ 3,200 Porsi</Text></Text>
      <!-- Progress Track -->
      <Frame w="fill" h={6} bg="#2A303C" rounded={3}>
        <Frame w={220} h={6} bg="#F8F9FB" rounded={3} />
      </Frame>
    </Frame>

    <!-- 2 Metric Cards: No Icons, Pure Clean Data -->
    <Frame flex="row" gap={10} w="fill">
      <!-- Card 1 -->
      <Frame p={16} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Text size={11} color="#6C727F">Wadah Terisi</Text>
        <Text size={20} weight="bold" color="#1E232B">48 <Text size={13} color="#6C727F" weight="regular">/ 64</Text></Text>
        <Text size={10} weight="bold" color="#1D4ED8">75% Selesai</Text>
      </Frame>

      <!-- Card 2 -->
      <Frame p={16} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Text size={11} color="#6C727F">Suhu Rata-rata</Text>
        <Text size={20} weight="bold" color="#1E232B">68.2°C</Text>
        <Text size={10} weight="bold" color="#047857">Lolos Standar SOP</Text>
      </Frame>
    </Frame>

    <!-- Active Menu Card: Pure Typography & Single Action -->
    <Frame p={16} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={10} w="fill">
      <Text size={11} color="#6C727F" weight="medium">MENU HARI INI</Text>
      <Text size={16} weight="bold" color="#1E232B">Ayam Goreng Lengkuas</Text>
      <Text size={11} color="#6C727F">Standar Porsi: 70g (SD) • 90g (SMP)</Text>
      <Frame p={12} bg="#1E232B" rounded={12} flex="row" justify="center" items="center" w="fill">
        <Text size={12} weight="bold" color="#F8F9FB">Mulai Penimbangan</Text>
      </Frame>
    </Frame>
  </Frame>

  <Frame flex="col" gap={6} w="fill">
    ${getClayNav('dashboard')}
    ${iqooGestureBar}
  </Frame>
</Frame>
`;

// -------------------------------------------------------------------
// 02. PEMORSIAN (Ultra-Simple Top Bar, No Decorative Icons)
// -------------------------------------------------------------------
const pemorsianJsx = `
<Frame name="02 - Pemorsian (iQOO Z10)" w={393} h={870} bg="#EBECEF" p={16} rounded={40} flex="col" justify="between" clip="true">
  <Frame flex="col" gap={16} w="fill">
    ${iqooStatusBar}

    <!-- Simple Header -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={20} weight="bold" color="#1E232B">Pemorsian</Text>
      <Frame p={4} px={10} bg="#EBF2FE" rounded={8}>
        <Text size={10} weight="bold" color="#1D4ED8">Mode 2 Wadah</Text>
      </Frame>
    </Frame>

    <!-- Digital Scale Display -->
    <Frame p={18} bg="#1E232B" rounded={22} flex="col" gap={8} w="fill">
      <Frame flex="row" justify="between" items="center">
        <Text size={11} color="#9DA4B0">DIGITAL SCALE TARE</Text>
        <Text size={10} weight="bold" color="#10B981">Stabil ±0.1g</Text>
      </Frame>
      <Frame flex="row" justify="between" items="center">
        <Text size={34} weight="bold" color="#F8F9FB">7,240 <Text size={16} color="#9DA4B0">g</Text></Text>
        <Text size={13} weight="bold" color="#F8F9FB">Target: 7,200 g</Text>
      </Frame>
      <Text size={10} color="#10B981">Deviasi +40g (+0.5%) • Toleransi Aman</Text>
    </Frame>

    <!-- Dual Container Split -->
    <Frame flex="col" gap={8} w="fill">
      <Text size={12} weight="bold" color="#1E232B">Alokasi Wadah (Total 100 Porsi)</Text>
      <Frame flex="row" gap={10} w="fill">
        <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
          <Text size={12} weight="bold" color="#1E232B">Wadah A (Kiri)</Text>
          <Text size={16} weight="bold" color="#1E232B">3,620 g</Text>
          <Text size={10} color="#6C727F">50 Porsi</Text>
        </Frame>
        <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
          <Text size={12} weight="bold" color="#1E232B">Wadah B (Kanan)</Text>
          <Text size={16} weight="bold" color="#1E232B">3,620 g</Text>
          <Text size={10} color="#6C727F">50 Porsi</Text>
        </Frame>
      </Frame>
    </Frame>

    <!-- SOP Temperature Banner -->
    <Frame p={12} px={14} bg="#ECFDF5" rounded={14} stroke="#A7F3D0" strokeWidth={1} flex="row" justify="between" items="center">
      <Text size={12} weight="bold" color="#047857">Suhu: 68.5°C (Lolos SOP Panas)</Text>
      <Text size={10} weight="bold" color="#047857">Ubah</Text>
    </Frame>

    <!-- Action Button -->
    <Frame p={14} bg="#1E232B" rounded={14} flex="row" justify="center" items="center" w="fill">
      <Text size={12} weight="bold" color="#F8F9FB">Simpan Batch Wadah A & B</Text>
    </Frame>
  </Frame>

  <Frame flex="col" gap={6} w="fill">
    ${getClayNav('pemorsian')}
    ${iqooGestureBar}
  </Frame>
</Frame>
`;

// -------------------------------------------------------------------
// 03. DISTRIBUSI HARIAN (Ultra-Simple Top Bar, No Decorative Icons)
// -------------------------------------------------------------------
const distribusiJsx = `
<Frame name="03 - Distribusi Harian (iQOO Z10)" w={393} h={870} bg="#EBECEF" p={16} rounded={40} flex="col" justify="between" clip="true">
  <Frame flex="col" gap={16} w="fill">
    ${iqooStatusBar}

    <!-- Simple Header -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={20} weight="bold" color="#1E232B">Distribusi Harian</Text>
      <Text size={11} weight="medium" color="#6C727F">Senin, 06 Sept</Text>
    </Frame>

    <!-- Target Proportion Bar -->
    <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={8} w="fill">
      <Frame flex="row" justify="between" items="center">
        <Text size={11} weight="bold" color="#1E232B">Target Distribusi</Text>
        <Text size={11} color="#6C727F">3,200 Siswa</Text>
      </Frame>
      <Frame flex="row" gap={4} w="fill" h={8} rounded={4}>
        <Frame w={160} h={8} bg="#1E232B" rounded={4} />
        <Frame w={100} h={8} bg="#6C727F" rounded={4} />
        <Frame w={60} h={8} bg="#D8DCE3" rounded={4} />
      </Frame>
      <Frame flex="row" justify="between" items="center">
        <Text size={10} color="#1E232B">SD: 1,800</Text>
        <Text size={10} color="#6C727F">SMP: 1,050</Text>
        <Text size={10} color="#6C727F">SMA: 350</Text>
      </Frame>
    </Frame>

    <!-- School List -->
    <Frame flex="col" gap={10} w="fill">
      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="row" justify="between" items="center" w="fill">
        <Frame flex="col" gap={2}>
          <Text size={13} weight="bold" color="#1E232B">SDN Merdeka 01</Text>
          <Text size={10} color="#6C727F">12 Wadah • Lowokwaru</Text>
        </Frame>
        <Frame flex="row" gap={8} items="center">
          <Frame p={6} px={10} bg="#EBECEF" rounded={8}><Text size={12} weight="bold" color="#1E232B">-</Text></Frame>
          <Text size={14} weight="bold" color="#1E232B">450 Porsi</Text>
          <Frame p={6} px={10} bg="#1E232B" rounded={8}><Text size={12} weight="bold" color="#F8F9FB">+</Text></Frame>
        </Frame>
      </Frame>

      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="row" justify="between" items="center" w="fill">
        <Frame flex="col" gap={2}>
          <Text size={13} weight="bold" color="#1E232B">SMP Negeri 03</Text>
          <Text size={10} color="#6C727F">16 Wadah • Klojen</Text>
        </Frame>
        <Frame flex="row" gap={8} items="center">
          <Frame p={6} px={10} bg="#EBECEF" rounded={8}><Text size={12} weight="bold" color="#1E232B">-</Text></Frame>
          <Text size={14} weight="bold" color="#1E232B">520 Porsi</Text>
          <Frame p={6} px={10} bg="#1E232B" rounded={8}><Text size={12} weight="bold" color="#F8F9FB">+</Text></Frame>
        </Frame>
      </Frame>

      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="row" justify="between" items="center" w="fill">
        <Frame flex="col" gap={2}>
          <Text size={13} weight="bold" color="#1E232B">SDN Sukoharjo 02</Text>
          <Text size={10} color="#6C727F">10 Wadah • Klojen</Text>
        </Frame>
        <Frame flex="row" gap={8} items="center">
          <Frame p={6} px={10} bg="#EBECEF" rounded={8}><Text size={12} weight="bold" color="#1E232B">-</Text></Frame>
          <Text size={14} weight="bold" color="#1E232B">380 Porsi</Text>
          <Frame p={6} px={10} bg="#1E232B" rounded={8}><Text size={12} weight="bold" color="#F8F9FB">+</Text></Frame>
        </Frame>
      </Frame>
    </Frame>
  </Frame>

  <Frame flex="col" gap={6} w="fill">
    ${getClayNav('sekolah')}
    ${iqooGestureBar}
  </Frame>
</Frame>
`;

// -------------------------------------------------------------------
// 04. MASTER SEKOLAH (Ultra-Simple Top Bar, No Decorative Icons)
// -------------------------------------------------------------------
const masterSekolahJsx = `
<Frame name="04 - Master Sekolah (iQOO Z10)" w={393} h={870} bg="#EBECEF" p={16} rounded={40} flex="col" justify="between" clip="true">
  <Frame flex="col" gap={16} w="fill">
    ${iqooStatusBar}

    <!-- Simple Header -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={20} weight="bold" color="#1E232B">Master Sekolah</Text>
      <Frame p={6} px={12} bg="#1E232B" rounded={10}>
        <Text size={11} weight="bold" color="#F8F9FB">+ Tambah</Text>
      </Frame>
    </Frame>

    <!-- Search Input (No icon, clean typography) -->
    <Frame p={12} px={14} bg="#F8F9FB" rounded={14} stroke="#D8DCE3" strokeWidth={1} w="fill">
      <Text size={12} color="#8D95A5">Cari sekolah atau kecamatan...</Text>
    </Frame>

    <!-- Filter Pills -->
    <Frame flex="row" gap={8} w="fill">
      <Frame p={6} px={12} bg="#1E232B" rounded={8}><Text size={10} weight="bold" color="#F8F9FB">Semua (8)</Text></Frame>
      <Frame p={6} px={12} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}><Text size={10} weight="medium" color="#1E232B">SD (5)</Text></Frame>
      <Frame p={6} px={12} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}><Text size={10} weight="medium" color="#1E232B">SMP (2)</Text></Frame>
      <Frame p={6} px={12} bg="#F8F9FB" rounded={8} stroke="#D8DCE3" strokeWidth={1}><Text size={10} weight="medium" color="#1E232B">SMA (1)</Text></Frame>
    </Frame>

    <!-- School List -->
    <Frame flex="col" gap={10} w="fill">
      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={13} weight="bold" color="#1E232B">SDN Sukoharjo 02</Text>
          <Text size={11} weight="bold" color="#1D4ED8">380 Porsi</Text>
        </Frame>
        <Text size={11} color="#6C727F">Jl. Martadinata No. 45, Klojen</Text>
      </Frame>

      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={13} weight="bold" color="#1E232B">SMP Negeri 01 Malang</Text>
          <Text size={11} weight="bold" color="#1D4ED8">620 Porsi</Text>
        </Frame>
        <Text size={11} color="#6C727F">Jl. Lawu No. 12, Oro-oro Dowo</Text>
      </Frame>

      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={13} weight="bold" color="#1E232B">SMA Negeri 03 Malang</Text>
          <Text size={11} weight="bold" color="#1D4ED8">350 Porsi</Text>
        </Frame>
        <Text size={11} color="#6C727F">Jl. Sultan Agung No. 7, Klojen</Text>
      </Frame>
    </Frame>
  </Frame>

  <Frame flex="col" gap={6} w="fill">
    ${getClayNav('sekolah')}
    ${iqooGestureBar}
  </Frame>
</Frame>
`;

// -------------------------------------------------------------------
// 05. RIWAYAT & LAPORAN (Ultra-Simple Top Bar, No Decorative Icons)
// -------------------------------------------------------------------
const riwayatJsx = `
<Frame name="05 - Riwayat & Laporan (iQOO Z10)" w={393} h={870} bg="#EBECEF" p={16} rounded={40} flex="col" justify="between" clip="true">
  <Frame flex="col" gap={16} w="fill">
    ${iqooStatusBar}

    <!-- Simple Header -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={20} weight="bold" color="#1E232B">Riwayat & Laporan</Text>
      <Text size={12} weight="bold" color="#1E232B">Ekspor</Text>
    </Frame>

    <!-- Weekly Summary Box -->
    <Frame p={16} bg="#1E232B" rounded={20} flex="col" gap={6} w="fill">
      <Text size={11} color="#9DA4B0">TOTAL DISTRIBUSI MINGGU INI</Text>
      <Text size={26} weight="bold" color="#F8F9FB">15,840 <Text size={14} color="#9DA4B0">Porsi</Text></Text>
      <Text size={10} color="#10B981">100% Selesai Tepat Waktu • Rata-rata 68.2°C</Text>
    </Frame>

    <!-- Daily Log Items -->
    <Frame flex="col" gap={10} w="fill">
      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={12} weight="bold" color="#1E232B">Jumat, 03 Sept 2026</Text>
          <Text size={12} weight="bold" color="#1D4ED8">3,200 Porsi</Text>
        </Frame>
        <Text size={11} color="#6C727F">Ayam Bumbu Semur • Suhu 69.1°C</Text>
      </Frame>

      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={12} weight="bold" color="#1E232B">Kamis, 02 Sept 2026</Text>
          <Text size={12} weight="bold" color="#1D4ED8">3,180 Porsi</Text>
        </Frame>
        <Text size={11} color="#6C727F">Ikan Fillet Asam Manis • Suhu 68.4°C</Text>
      </Frame>

      <Frame p={14} bg="#F8F9FB" rounded={16} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={4} w="fill">
        <Frame flex="row" justify="between" items="center">
          <Text size={12} weight="bold" color="#1E232B">Rabu, 01 Sept 2026</Text>
          <Text size={12} weight="bold" color="#1D4ED8">3,150 Porsi</Text>
        </Frame>
        <Text size={11} color="#6C727F">Ayam Panggang Kecap • Suhu 67.9°C</Text>
      </Frame>
    </Frame>
  </Frame>

  <Frame flex="col" gap={6} w="fill">
    ${getClayNav('riwayat')}
    ${iqooGestureBar}
  </Frame>
</Frame>
`;

// -------------------------------------------------------------------
// 06. PENGATURAN SISTEM (Ultra-Simple Top Bar, No Decorative Icons)
// -------------------------------------------------------------------
const pengaturanJsx = `
<Frame name="06 - Pengaturan Sistem (iQOO Z10)" w={393} h={870} bg="#EBECEF" p={16} rounded={40} flex="col" justify="between" clip="true">
  <Frame flex="col" gap={16} w="fill">
    ${iqooStatusBar}

    <!-- Simple Header -->
    <Frame flex="row" justify="between" items="center" w="fill">
      <Text size={20} weight="bold" color="#1E232B">Pengaturan</Text>
      <Text size={11} weight="bold" color="#047857">Tersimpan</Text>
    </Frame>

    <!-- SOP Temperature -->
    <Frame p={16} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={10} w="fill">
      <Text size={12} weight="bold" color="#1E232B">Batas SOP Suhu Pangan</Text>
      <Frame flex="row" gap={10} w="fill">
        <Frame p={10} bg="#EBECEF" rounded={10} flex="col" gap={2} w="fill">
          <Text size={10} color="#6C727F">Batas Panas (Hot)</Text>
          <Text size={16} weight="bold" color="#1E232B">≥ 60.0°C</Text>
        </Frame>
        <Frame p={10} bg="#EBECEF" rounded={10} flex="col" gap={2} w="fill">
          <Text size={10} color="#6C727F">Batas Dingin (Cold)</Text>
          <Text size={16} weight="bold" color="#1E232B">≤ 5.0°C</Text>
        </Frame>
      </Frame>
    </Frame>

    <!-- Database Status -->
    <Frame p={16} bg="#F8F9FB" rounded={18} stroke="#D8DCE3" strokeWidth={1} flex="col" gap={10} w="fill">
      <Text size={12} weight="bold" color="#1E232B">Status Database</Text>
      <Frame flex="row" justify="between" items="center" p={10} bg="#EBECEF" rounded={10}>
        <Text size={11} weight="bold" color="#1E232B">IndexedDB Offline Sync</Text>
        <Text size={9} weight="bold" color="#047857">AKTIF</Text>
      </Frame>
      <Frame flex="row" justify="between" items="center" p={10} bg="#EBECEF" rounded={10}>
        <Text size={11} weight="bold" color="#1E232B">Supabase Cloud Sync</Text>
        <Text size={9} weight="bold" color="#047857">ONLINE</Text>
      </Frame>
    </Frame>
  </Frame>

  <Frame flex="col" gap={6} w="fill">
    ${getClayNav('setelan')}
    ${iqooGestureBar}
  </Frame>
</Frame>
`;

async function main() {
  console.log('🚀 [Antigravity Design Expert] Clearing canvas and rendering ultra-simplified layout (no icon clutter)...');
  
  // Clear old frames
  await daemonExec('eval', { code: 'figma.currentPage.children.forEach(c => c.remove())' });

  // Row 1: Tokens Showcase (1360 x 520)
  await renderFrame('00 - iQOO Z10 Minimalist System', tokensJsx, 0, 0);

  // Row 2: 6 Mobile Screens for iQOO Z10 (393 x 870 each, gap = 50)
  const screens = [
    { name: '01 - Dashboard (iQOO Z10)', jsx: dashboardJsx, x: 0 },
    { name: '02 - Pemorsian (iQOO Z10)', jsx: pemorsianJsx, x: 443 },
    { name: '03 - Distribusi Harian (iQOO Z10)', jsx: distribusiJsx, x: 886 },
    { name: '04 - Master Sekolah (iQOO Z10)', jsx: masterSekolahJsx, x: 1329 },
    { name: '05 - Riwayat & Laporan (iQOO Z10)', jsx: riwayatJsx, x: 1772 },
    { name: '06 - Pengaturan Sistem (iQOO Z10)', jsx: pengaturanJsx, x: 2215 },
  ];

  for (const screen of screens) {
    await renderFrame(screen.name, screen.jsx, screen.x, 560);
  }

  // Adjust viewport to center on all frames
  await daemonExec('eval', { code: 'figma.viewport.scrollAndZoomIntoView(figma.currentPage.children)' });
  console.log('✨ [Antigravity Design Expert] All clean iQOO Z10 frames rendered successfully on Figma!');
}

main().catch(err => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
