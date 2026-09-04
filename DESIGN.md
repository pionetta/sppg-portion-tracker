# DESIGN.md — SPPG Portion Tracker

## 1. Design Direction

SPPG Portion Tracker adalah aplikasi operasional mobile-first untuk membantu pencatatan pemorsian makanan di SPPG.

Design language:
- Minimal claymorphism
- Light mode only
- Clean, calm, professional
- Dominant black, white, and neutral gray
- Very limited accent colors
- High information density without looking crowded
- Fast one-handed interaction
- Designed primarily for smartphone use
- Desktop/tablet layouts should remain responsive

The UI should feel like a modern productivity/work utility, not a finance app, social app, or gaming dashboard.

Avoid:
- glassmorphism
- excessive gradients
- colorful illustrations
- neon colors
- excessive shadows
- excessive decorative elements
- oversized hero sections
- unnecessary animations

---

## 2. Visual Identity

### Base Colors

Background:
- #F5F5F5

Surface:
- #FFFFFF

Primary text:
- #111111

Secondary text:
- #666666

Muted text:
- #8A8A8A

Border:
- #E5E5E5

### Accent Colors

Use accents sparingly:

Primary accent:
- #6366F1

Success:
- #22C55E

Warning:
- #F59E0B

Danger:
- #EF4444

Accent colors should communicate state and action, not decorate the entire interface.

Recommended usage:
- Indigo: primary buttons, selected navigation, links
- Green: completed state
- Amber: warning / incomplete / outside configured temperature threshold
- Red: validation error / destructive action
- Black/gray: most UI elements

---

## 3. Claymorphism Style

Use subtle claymorphism rather than exaggerated neumorphism.

Cards:
- White surface
- 16–24px border radius
- Soft outer shadow
- Very subtle inner highlight when appropriate
- Thin neutral border
- Comfortable internal padding

Example visual feeling:

background → soft gray
card → raised white surface
shadow → soft and diffuse
content → strong black typography

Do not make cards look inflated or toy-like.

Buttons should have:
- rounded corners
- subtle depth
- clear pressed state
- strong contrast
- minimum comfortable touch area

---

## 4. Typography

Use a clean modern sans-serif.

Recommended:
- Inter
- Geist
- system-ui

Typography hierarchy:

Page title:
- 24–28px
- semibold/bold

Section title:
- 18–20px
- semibold

Card title:
- 16–18px
- semibold

Body:
- 14–16px

Secondary:
- 12–14px

Large metrics:
- 28–40px
- bold

Numbers used for portions should be visually prominent and easy to scan.

Use tabular/monospaced numeric alignment where useful for quantities.

---

## 5. Layout Principles

Use a mobile-first layout.

Maximum desktop content width:
- approximately 1200px

Mobile horizontal padding:
- 16px

Tablet:
- 20–24px

Desktop:
- 24–32px

Spacing system:
- 4px base unit
- prefer 8, 12, 16, 20, 24, 32px spacing

Avoid excessive empty space on operational screens.

The production page should prioritize useful information above the fold.

---

## 6. Navigation

### Mobile

Use a fixed bottom navigation bar.

Primary navigation:
1. Dashboard
2. Produksi
3. Sekolah
4. Riwayat
5. Pengaturan

Use Lucide icons.

Each navigation item:
- icon
- short Indonesian label
- active state
- minimum comfortable touch target

The active item should use the primary indigo accent subtly.

### Desktop

Use a compact left sidebar or top navigation depending on available width.

Do not change the information architecture between mobile and desktop.

---

# 7. Dashboard

The dashboard is the operational home screen.

### Header

Show:
- greeting
- current date
- connection/sync status

Example:

Selamat pagi
5 September 2026

Synced / Offline indicator

### Main Daily Summary Card

Large card containing:

Target Hari Ini
500 porsi

Actual
350 porsi

Remaining
150 porsi

Progress
70%

Use a clean horizontal progress bar.

Do not use circular gauges unless there is a strong UX reason.

### Menu Progress

Show a list of today's menu components.

Example:

Makanan Pokok
Nasi Putih
500 / 500
✓ Selesai

Protein Hewani
Ayam Goreng
500 / 500
✓ Selesai

Protein Nabati
Tempe
480 / 500
Kurang 20 porsi

Each card should be compact and tappable.

### Primary Action

Large primary button:

Lanjutkan Pemorsian

If no production exists:

Mulai Produksi Hari Ini

If production is complete:

Lihat Rekap Hari Ini

---

# 8. Production Page

This is the most important screen in the application.

The user should be able to operate it quickly with one hand.

### Header

Show:
- date
- production status
- target porsi

Example:

Produksi
5 September 2026

Target
500 porsi

Status:
Sedang Berlangsung

### Overall Summary

Sticky summary:

500 target
350 actual
150 remaining

### Menu Sections

Group menus by category.

Example:

## Makanan Pokok

Nasi Putih
500 / 500
✓ Selesai

## Protein Hewani

Ayam Goreng
450 / 500
50 porsi lagi

## Protein Nabati

Tempe
500 / 500
✓ Selesai

## Sayur

Tumis Kangkung
500 / 500
✓ Selesai

## Buah

Pisang
500 / 500
✓ Selesai

Each menu card opens its portion detail.

---

# 9. Portion Detail Page

This screen must be optimized for repeated numeric input.

### Header

Show:

Nasi Putih
Makanan Pokok

Target:
500 porsi

Aktual:
500 porsi

Progress:
100%

### Container List

Each container is displayed as a compact card.

Example:

Wadah 1

Porsi Kumulatif
[ 100 ]

Pemakaian
100 porsi

Previous:
0

---

Wadah 2

Porsi Kumulatif
[ 300 ]

Pemakaian
200 porsi

Previous:
100

---

Wadah 3

Porsi Kumulatif
[ 500 ]

Pemakaian
200 porsi

Previous:
300

Use numeric keyboard on mobile.

Input should be large and easy to tap.

### Add Container

Prominent button:

+ Tambah Wadah

### Sticky Bottom Summary

Target:
500

Aktual:
500

Status:
✓ Selesai

Do not require scrolling back to the top to see progress.

---

# 10. Cumulative Portion Interaction

The UI must make it obvious that the user enters cumulative portions, not used portions.

Input label:

Porsi Kumulatif

Helper text:

"Masukkan total porsi yang sudah tercapai sampai wadah ini."

Never label the input simply "Porsi" because this can cause confusion.

Automatically display:

Pemakaian:
current cumulative - previous cumulative

Example:

Kumulatif 300
Previous 100
Pemakaian 200

If invalid:

"Jumlah porsi kumulatif tidak boleh lebih kecil dari wadah sebelumnya."

Use inline validation immediately.

---

# 11. Menu Creation

Provide a simple form.

Fields:

Kategori
[ Makanan Pokok ▼ ]

Nama Menu
[ Nasi Putih ]

Catatan
[ opsional ]

Button:

Simpan Menu

Do not ask for target portions.

The target is inherited automatically from today's production target.

---

# 12. Menu Categories

Default categories:

- Makanan Pokok
- Protein Hewani
- Protein Nabati
- Sayur
- Buah
- Pelengkap
- Lainnya

Use small category labels/badges.

Category badges should use mostly neutral colors.

Avoid assigning a different bright color to every category.

---

# 13. School Management Page

The school page manages master school data.

Header:

Sekolah

Primary action:

+ Tambah Sekolah

Search input:

Cari sekolah...

Filters:
- Semua
- Pagi
- Siang
- Keduanya

### School Card

Show:

SD Negeri 01
100 porsi
Pagi

Actions:
Edit
Delete

Keep cards compact.

---

# 14. Daily School Allocation

Inside today's production:

Target allocation summary:

Total Alokasi Sekolah
500 porsi

Target Produksi
500 porsi

Status:
✓ Sesuai

If mismatch:

Total Alokasi
480

Target Produksi
500

Warning:
Kekurangan alokasi 20 porsi

Provide:

+ Tambah Sekolah

and:

Salin Pembagian Hari Sebelumnya

### Distribution Group

Group schools:

PAGI
- SD Negeri 01 — 100
- SD Negeri 02 — 150

SIANG
- SD Negeri 03 — 100
- SMP Negeri 01 — 150

Total:
500 porsi

The morning/afternoon grouping is informational and does not require separate portion-container calculations.

---

# 15. Copy Previous Allocation

Make this action easy to find when creating a new production.

Button:

Salin Pembagian Hari Sebelumnya

Before applying:
show a confirmation dialog.

Example:

Salin pembagian dari
4 September 2026?

4 sekolah
500 porsi

[ Batal ] [ Salin ]

After success:

Pembagian sekolah berhasil disalin.

---

# 16. Temperature Recording

Temperature should be accessible directly from the portion/container detail screen.

For each container:

Wadah 1

Porsi:
100

Temperature records:

10:05
72°C

10:30
70°C

11:00
68°C

Button:

+ Catat Suhu

### Temperature Form

Suhu:
[ 72 ] °C

Waktu:
[ 10:05 ]

Catatan:
[ opsional ]

[ Simpan ]

Use numeric/decimal input.

Use the current time as default when appropriate, but allow editing.

---

# 17. Temperature Status

Temperature status must depend on configurable application settings.

Default configuration:

Hot food minimum:
60°C

Cold food maximum:
10°C

Do not hard-code these values permanently.

UI states:

✓ Sesuai batas konfigurasi

⚠ Di luar batas konfigurasi

Avoid the word "aman" as an absolute guarantee.

---

# 18. Temperature History

Provide a compact timeline/table.

Example:

Wadah 1

10:05 — 72°C — Sesuai
10:30 — 70°C — Sesuai
11:00 — 58°C — Di luar batas

Use clear timestamps.

---

# 19. Daily History

History page should focus on scanning dates quickly.

Search/filter:
- date
- date range
- status

Daily card:

5 September 2026
500 porsi
5 menu
5 sekolah

Status:
✓ Selesai

Tap to open full detail.

---

# 20. Daily Detail

Show:

Tanggal
Target
Actual
Status

School allocation
Morning
Afternoon

Menu:

Makanan Pokok
Nasi Putih
500 / 500

Protein Hewani
Ayam Goreng
500 / 500

Protein Nabati
Tempe
480 / 500

Temperature summary

Wadah 1:
latest temperature

Wadah 2:
latest temperature

Wadah 3:
latest temperature

Provide export/print actions.

---

# 21. Reports

Report page should be functional and information-dense.

Filters:
- tanggal
- rentang tanggal
- sekolah
- distribusi
- kategori menu
- menu

Summary cards:
- Total produksi
- Total sekolah
- Total hari
- Menu selesai

Tables:
- daily production
- school allocation
- menu completion
- temperature records

Actions:

Export CSV
Export Excel
Print
PDF

Use tables on tablet/desktop.

On mobile, transform tables into stacked cards where appropriate.

---

# 22. Production Status

Use three statuses:

Draft
Sedang Berlangsung
Selesai

Visual:

Draft → neutral
Sedang Berlangsung → indigo
Selesai → green

If completed:

Show:
✓ Produksi selesai

Provide secondary action:

Buka Kembali Produksi

Use a confirmation dialog before reopening completed production.

---

# 23. Quick Actions

Use a floating action button only when it improves speed.

Possible actions:

+ Produksi Hari Ini
+ Tambah Menu
+ Tambah Sekolah
+ Catat Suhu

Do not let the FAB cover important input controls.

---

# 24. Offline / Sync UI

Always show a small, understandable sync state.

States:

Online — Tersinkron
Offline — Tersimpan di perangkat
Syncing — Menyinkronkan...
Sync error — Menunggu sinkronisasi

Example:

● Tersinkron

or:

○ Offline · Data tersimpan di perangkat

Never use technical database terminology in the main user-facing UI.

The user must feel confident that data is not lost when offline.

---

# 25. Empty States

Use simple illustrations/icons only if helpful.

Example:

Belum ada produksi hari ini.

Mulai pencatatan untuk hari ini.

[ Mulai Produksi ]

For schools:

Belum ada data sekolah.

[ Tambah Sekolah ]

For menus:

Belum ada menu hari ini.

[ Tambah Menu ]

Avoid large decorative empty-state graphics.

---

# 26. Loading States

Use skeleton loaders for lists/cards.

Avoid blocking full-screen loaders for small operations.

For save actions:

Button becomes:

Menyimpan...

Then:

Tersimpan ✓

---

# 27. Toasts

Use short Indonesian messages.

Success:
"Data berhasil disimpan."

"Pembagian sekolah berhasil disalin."

"Catatan suhu berhasil disimpan."

Offline:
"Data tersimpan di perangkat dan akan disinkronkan saat online."

Error:
"Gagal menyimpan data. Silakan coba lagi."

---

# 28. Dialogs

Use dialogs for:

- delete
- copy previous allocation
- complete production
- reopen completed production

Do not use dialogs for every simple action.

---

# 29. Forms

Forms should be short.

Input style:
- white surface
- subtle border
- rounded corners
- clear label
- helper text when necessary
- visible focus state

For numeric inputs:
- large text
- numeric keyboard
- no unnecessary formatting

For dates/times:
- native mobile date/time controls where appropriate.

---

# 30. Buttons

Primary:
- indigo background
- white text
- rounded

Secondary:
- white/neutral
- black text
- subtle border

Ghost:
- transparent
- black/gray text

Danger:
- red only for destructive actions

Button sizes:
- compact for desktop
- minimum comfortable touch area on mobile

---

# 31. Cards

Card hierarchy:

Primary card:
- important summary
- slightly stronger shadow

Secondary card:
- menu
- school
- container

Compact card:
- history items
- temperature records

Avoid nesting too many cards inside cards.

---

# 32. Tables

Use tables primarily on desktop/tablet.

Columns may include:

Tanggal
Sekolah
Distribusi
Menu
Target
Aktual
Status

For mobile:
convert rows into cards.

---

# 33. Responsive Breakpoints

Mobile:
< 640px

Tablet:
640–1024px

Desktop:
> 1024px

Mobile:
- bottom navigation
- single-column
- sticky summaries
- full-width actions

Tablet:
- two-column sections where useful

Desktop:
- sidebar
- multi-column dashboard
- wider tables
- detail panels

---

# 34. Accessibility

Requirements:

- WCAG-conscious contrast
- visible focus states
- semantic HTML
- labels for all inputs
- keyboard navigation
- screen-reader-friendly labels
- do not rely only on color for status
- touch targets should be comfortably tappable

Status should combine:
icon + text + optional color.

Example:

✓ Selesai

not only a green dot.

---

# 35. Animation

Use minimal animation.

Allowed:
- button press
- card hover
- progress change
- toast appearance
- navigation transition

Keep duration approximately 150–250ms.

Do not animate operational data excessively.

---

# 36. Iconography

Use Lucide React.

Suggested icons:

Dashboard:
LayoutDashboard

Produksi:
Utensils / ClipboardList

Sekolah:
School

Riwayat:
History

Pengaturan:
Settings

Wadah:
Package

Suhu:
Thermometer

Tambah:
Plus

Selesai:
Check

Peringatan:
TriangleAlert

Offline:
CloudOff

Sync:
RefreshCw

Use consistent stroke weight.

---

# 37. Data Density

This is an operational application.

Prefer:
- clear numbers
- compact cards
- visible status
- minimal decorative text

The user should be able to answer immediately:

"Sudah berapa porsi?"
"Berapa sisa?"
"Menu mana yang belum selesai?"
"Wadah terakhir berapa?"
"Suhu terakhir berapa?"
"Berapa total sekolah?"
"Berapa pembagian pagi dan siang?"

---

# 38. Core User Flow

Primary daily workflow:

Dashboard
↓
Mulai / Lanjutkan Produksi
↓
Check school allocation
↓
Select menu
↓
Enter cumulative container portion
↓
Automatic usage calculation
↓
Record temperature
↓
Next container
↓
Next menu
↓
All menus completed
↓
Complete production
↓
Daily summary
↓
History

The interface should minimize navigation during this workflow.

---

# 39. Critical UX Rule

The application must NEVER confuse:

Porsi Kumulatif

with:

Porsi Pemakaian

Always visually distinguish them.

Example:

Porsi Kumulatif
500

Pemakaian Wadah Ini
200

The user enters only:

Porsi Kumulatif

The system calculates:

Pemakaian Wadah Ini

---

# 40. Critical Target Rule

The target is entered only once for the daily production.

Example:

Target Produksi Harian:
500

Automatically:

Nasi:
500

Ayam:
500

Tempe:
500

Sayur:
500

Buah:
500

Do not create separate target inputs for every menu.

---

# 41. Dashboard Information Architecture

Top:
- date
- sync state

Primary:
- daily target
- actual
- remaining
- progress

Middle:
- menu completion

Bottom:
- school allocation summary
- temperature summary
- last activity

Primary CTA:
Lanjutkan Pemorsian

---

# 42. Stitch Generation Guidance

When generating screens in Stitch, maintain one coherent design system across every screen.

Generate these screens:

1. Dashboard
2. Production overview
3. Menu portion detail
4. Add menu
5. School list
6. Add/edit school
7. Daily school allocation
8. Temperature detail
9. Daily history
10. Daily detail
11. Reports
12. Settings

All screens must use the same:
- typography
- spacing
- corner radius
- shadows
- button style
- card style
- icon style
- color palette

Prioritize the Production and Portion Detail screens because these are the primary operational screens.

The final design should look like a polished, production-ready mobile PWA for SPPG staff.
