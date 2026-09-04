# StitchMCP Design System: Minimal Clay Operational

> **Source Project:** `Design System Generator`  
> **Project ID:** `projects/2189175075402321907`  
> **Design Theme:** `Minimal Clay Operational`  
> **Target Application:** SPPG Portion Tracker (Mobile-first PWA)

---

## 1. Ringkasan & Filosofi Desain

Design System **Minimal Clay Operational** dibuat secara khusus untuk operasional pemorsian makanan di SPPG. Sistem ini menggabungkan:
- **Minimal Claymorphism**: Permukaan kartu putih matte (*clean matte-white surfaces*) yang terangkat halus di atas canvas netral `#F5F5F5` / `#F9F9F9`.
- **Soft Ambient Shadows & Hairline Inner Borders**: Memberikan kesan fisik taktil tanpa efek 3D neumorphic yang berlebihan atau mengganggu pandangan.
- **Light Mode Only**: Visibilitas maksimal di area dapur dan meja pemorsian yang terang / silau (*high-glare prep stations*).
- **Tabular Numerics**: Menggunakan font **Inter** dengan fitur OpenType *tabular figures* (`tabular-nums`) agar angka porsi kumulatif dan temperatur tidak bergeser saat diinput.
- **Ergonomi Satu Tangan**: Target sentuh minimum 48px, sticky bottom action bar, dan tata letak vertikal yang mudah dioperasikan operator dapur.

---

## 2. Design Tokens

### 2.1 Color Palette

| Token | Nilai Hex | Penggunaan |
|---|---|---|
| `surface` | `#FFFFFF` | Permukaan kartu utama, modal, dock bar |
| `background` | `#F9F9F9` / `#F5F5F5` | Background canvas aplikasi |
| `primary` | `#4648d4` / `#6366F1` | Tombol CTA utama, tab navigasi aktif, indikator fokus |
| `primary-container` | `#6063ee` | Status hover / active container porsi |
| `text-primary` | `#111111` | Teks judul, angka porsi utama, label penting |
| `text-secondary` | `#666666` | Teks keterangan, riwayat wadah sebelumnya |
| `text-muted` | `#8A8A8A` | Placeholder, satuan porsi, tanggal riwayat |
| `border-neutral` | `#E5E5E5` | Border kartu Level 1 & pemisah seksi |
| `status-success` | `#22C55E` | Porsi tercapai, sinkronisasi selesai, status valid |
| `status-warning` | `#F59E0B` | Porsi kurang dari target, suhu mendekati ambang batas |
| `status-danger` | `#EF4444` | Validasi gagal (angka < wadah sebelumnya), hapus data |

### 2.2 Elevation Levels (Claymorphism)

1. **Level 0 (Flat Base Canvas)**:
   - Surface: `#F5F5F5`
   - Shadow: `none`
2. **Level 1 (Subtle Raised Cards & Wadah)**:
   - Surface: `#FFFFFF`
   - Border: `1px solid #E5E5E5`
   - Shadow: `0 4px 14px -2px rgba(17, 17, 17, 0.05), 0 2px 6px -1px rgba(17, 17, 17, 0.02)`
   - Highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.9)`
3. **Level 2 (Prominent Clay / Floating Bar / Modals)**:
   - Surface: `#FFFFFF`
   - Border: `1px solid #E0E0E0`
   - Shadow: `0 10px 25px -4px rgba(17, 17, 17, 0.07), 0 4px 10px -2px rgba(17, 17, 17, 0.03)`
   - Highlight: `inset 0 1.5px 0 rgba(255, 255, 255, 1)`
4. **Pressed / Active Wells (Active Input & Stepper)**:
   - Surface: `#F9F9F9`
   - Border: `1.5px solid #6366F1`
   - Shadow: `inset 0 2px 4px rgba(0, 0, 0, 0.04)`

### 2.3 Typography

- **Font Family**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Tabular Figures**: `font-variant-numeric: tabular-nums; font-feature-settings: "tnum"`
- **Scale**:
  - `metric-xl`: 36px / 44px, Bold
  - `metric-lg`: 28px / 36px, Bold
  - `tabular-metric`: 22px / 28px, SemiBold
  - `headline-lg`: 26px / 32px, SemiBold
  - `headline-md`: 20px / 28px, SemiBold
  - `headline-sm`: 16px / 24px, SemiBold
  - `body-lg`: 16px / 24px, Regular
  - `body-md`: 14px / 20px, Regular
  - `body-sm`: 12px / 16px, Regular
  - `label-lg`: 14px / 20px, SemiBold
  - `label-md`: 12px / 16px, SemiBold
  - `label-sm`: 11px / 14px, Medium

---

## 3. Katalog Layar (Screens) dari StitchMCP

Berikut adalah daftar seluruh 18 layar yang telah di-generate dalam project **Design System Generator**:

| No | Nama Layar | Dimensi | Screen ID | Link Screenshot |
|---|---|---|---|---|
| 1 | **Dashboard Utama SPPG Tracker** | 780x3114 (Mobile) | `1001489c57084b188d1c62c12f7a936d` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1WVScxvTBQaABPyL4yT6RlRaKlw7zNWTX5d4Vf-NtXQNTZoKG0-Go-96Ip7K_vqfR03LdC0g4saQObkRZDDeNSHNKG2BQ_-TPiXQPKwzljKb_-3zgwAQrmrh4M22BYE6BO8EqsRUrnT7KmmK6w-twz5nbQGaFqbzAlPXAmq1v1KysCVSz6SQSMt5AChqG0GXc-dtuFpzJ2G-cUR8pyqXlu_pf0SFtguqtktj4JiqB2EuCSuvRalSvYc2w) |
| 2 | **Ringkasan Produksi** | 780x3514 (Mobile) | `3f75ad1701ee4decb9eae22f3d4c25f1` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1XYeuGg-1GArFdsAWn5VmF6xgKwjZpXKmpYIqwk2eEQXpnFFUdLO3_A8qTtR3FCIrv1QEXtFYzR_-noxMg09XsFM9igEFABaudlqg_dSn99rP3Kk8buN4SUZYIwUPu8uh9VyLiZB9yhkgxc69LMVKzHwy1JdJfuwyMZWJzN_BsXKItu-VXVq-uu3x0xrSIBiXNdZbIHJcxuErNiWZFCAdvAapVSYshUCyuc1t2wP4u8Nj0wURISKKIkwfc) |
| 3 | **Dashboard Mode Offline** | 780x3436 (Mobile) | `8152dda349cc4bd69a899de0f7723116` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1V2E3cCRbKygFx0I1Xr8DcfYkQNOam57Lwq3dCMYd0hjqjTyOgd0y-e9cLxVhkVeGBd7Je0mscos2M6GsVuYaeVpar9mDgFX2WHN3JTY-Japu_3m2ajuUugIOKUhhaffDSrQZdhjx8vPUsB1oD4XNxjeqaWbxZ-lobyOtU_nes_zc6wRBa-PuAQ6AmXhO_EZw8nJVdMp5X-bbF64AkbvSA1FXDTo0QoMbYM7wcRNDW3AGU_ebAf4DFTa9o) |
| 4 | **Detail Pemorsian Wadah** | 780x2868 (Mobile) | `b75d26b551b54082bce207c3956e0211` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1U6wwWRZ24Imue50FqDytgHJXG6mCcjut9CG2nGd1Qv4uzkWTR-4bA--Jy0o3YiMPddTgP6BKmfqShlKkyfXR1tcMwuynKS8rvNd7Do6g2QaBDVVVROk58KbG0S2yJb2pN9BN8KST6k2LtxflJijEiofFKB0Quis5fABqI1o6dc0ALSZkOwZm4vPeqSvWRaUhmtGLWwxoHZYszEcK11Rn1eXWgjNDZXx1-1crJHMNaDZIXhmWTdwxSqew) |
| 5 | **Alokasi Sekolah Harian** | 780x3136 (Mobile) | `32ac606e75ae49b3a9515da6b860cd7e` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1VGYwKHTjgb8kVDn39bclUWb-VKoCU5F-V4uZiuRIwh2vpPsHIhUau59yOfoW136zYlTRXhapsGkV2nOQqwJ6PWZ7viJrV_QDdcE9KyhrUTp6clq0gvjG0PFsrauY5UF5hEkTr2vwE0smj57IJpeK4DIQsy1Jqqupq-ZeogIRlbeauzGiGEivaBComzghMj0N1ppRdSVQdO9JiQ7F590hcK_pdRXUQqZsn1ppnW-E1yegB9H8FXOrTX-h8) |
| 6 | **SPPG Logo** | 40x40 (SVG) | `0e9b06bafaa3468ca20c9d23dcce0826` | Tersimpan di `/public/sppg-logo.svg` |
| 7 | **Tambah & Edit Sekolah** | 780x4456 (Mobile) | `ea394f1f080c45cca52e47ed0998b5d5` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1W841RBBwP8sApJOKft5TSDuVLrJ4qAMoizVgr8qNULtDKFMe2YYMjRIBuqj2OiYzCx8-0HFXGaHXsZVAiyZTpgfsRHlAuAZzxEe5AEJsvVIJDK34Tld3KddVbQ1ZxbGPhbvBHxlvaKn8t_oChoWIMIxWQH0xChcySCUQcYnU_GzOLWR3U2zy75_x5mfuI1xlLIBWJcKhIa_3FfzwixRrMNfm1qdq_94LyEFsMxnfboc_pDrW5QpVRzagE) |
| 8 | **Simulasi Simpan & Toast** | 780x4502 (Mobile) | `eceba02d8cdd4cef96b552cc3a354387` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1Ub7deVizbE7sIoz4QIayWNG3B00AGolE_gP0J5433mREAky7sTx-d_fir--WtpAGVSeMLlJMou08vyelQ4yGd2rgN_g6GcxQcvY43SJ7YkJRTtDTePvtBKAx7p0caBtRhG-6E7O_zqj9tXFY1SwC3CmBdytGOUjfAyC_SuxUCQfDgzyo0sQcB9fxcWEmasrofxcwNkcLaMONprOwRWJeIh7U_KEas4YpZ6vjKnK_o3SjbZJGJpQbW2wA) |
| 9 | **Riwayat Harian Produksi** | 780x4570 (Mobile) | `cf066505b5354ca29ee66cf5fd40f8e1` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1XNC5K2DzRK6sdeEvj5qfk81hEAaws-Uhj2fQEG66g4XE7mHeXdl8npXal2jLmS5W769ifZfvc__B5c-wEbLTn6UMsmWhgfIsOovrckg6GB1BWFfJrVCjQclL808w5BY0GZF02qAmb-VHN6JtwzqxM90iotIrCgblLzVAAl_ugf5So_54lCF7Wk7PITu2FtGcwVJky64ngISp4lYeSIdlkn-5708TzuPJZGGy0cOKMGgjB91j0H_t6Tf6A) |
| 10 | **Laporan & Rekapitulasi** | 780x3798 (Mobile) | `0c31a5b5627a42bea69bcaa0f5f449de` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1VX8Fke5fYIuM-0_XltyW8klDopGSx_tYFwao8NHdOnkbVpquvMwxM6ZZCL3EXrkPBOn3WCNfDLuUgzNhpApK3Q3LKcYM4l5aQooOEyPGw8uTBEl6awx8as5-sVQ2Wr8w5Q851Kd6w-UeMdwj9r-L9kvqI2CneKbABrT24dRvi0WnMKqFakZzJkniYTjI8ZAHQQubb-YZDTjv8KPDuc40vM09S82S_hYldAoGgKRxcPzyOrziUACTRNAw) |
| 11 | **Detail Riwayat Harian** | 780x4764 (Mobile) | `f63fa4e538884e32aea209fc7fc21012` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1VChkZdgQEvhmbik5iSzLsuausQyYbvqU-Y-dd-T_zD1gnW8Y-QLER20Cy0LjjNhngI4uGqsNON-_w4y8MR00-uryTCV5opP2UQbUg-Umu8PmRjR7gtfiKvsgJkK6XDT8oFK7dDD48BVzfDOyJ-BM1oOqUfmVJ-yIaJNh10pWyCk-YaeIMp3-wR5DErrth-0YXHCQMxYnEXERS268Aja8R_wkT742yfuMvorpTpEe8r1-b6HQuXJx81eg) |
| 12 | **Master Daftar Sekolah** | 780x3580 (Mobile) | `17107ed0f11e4d859edd45de20dbccda` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1WrHbW0PLcyBsKwZ3rkD2_G4ZDI3rp00W8aKDmwok2YBsbrI594Ap6O-Fds6rjVklDqPVGGAjUP6e6UuXISL5Ojh5wHfTWeNOA7M4rlYzt-U1FhfQdBjppy1Qn2TA0HEx8qbG0xhZpoly2OJscO6uRarOQJvhxUqxkDcBREAO35g7c57kCw4r-XTGWJzrz1LwjGvJOCpj9IKCHzK4--CI1sn2sFitnhES8tpVGNqQH35kWLCtP7QvlV10c) |
| 13 | **Tambah Menu Baru** | 780x2238 (Mobile) | `7bcd9964fc0e470b92473493a3332251` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1VJSPMePQ7E2yB7cIsxehsT3quSBka54XtlFT1Cng20OyzlPbxOJR9Gqvn1RtAt37hHZepEnNe2QPaDJIqkkCcy366sTYtwhyRX0hK-1UV_cULO_uCKZaKlzprJ9SuMiq5yqREpgtXuzCajfHR51CGAgA5VROWYYuRm9LSh09rBFohNeqgB_4sBN2YJGUzLtyiRh0gEclZm1McSRr23HC9wph3M93fUzIPtxnNXP12Ycsa2vIBOfWS63ck) |
| 14 | **Antrean Data Belum Tersinkron** | 780x1768 (Mobile) | `38d8de1b914d4a47a8827c0a49f7d2a2` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1XUhaSMcIkpzu_spKZfnLEgp_9k1hjYLpgSrHsb7-mrWSuHeKpPOZQyZZlz5MydeYSVNBFzoxSZh2UX9buzk41scN8RYvfRESPBtWSvL1EubCNxs_QgJ_9WZ32JK6gEvHP_KZ8NzR10gB8tA3RCEnJo4VncDEeRbDEgUc3KbbzwJm6y9G84JYXvKmUye9V5bkBarx8g52hXOrRK1Afj28SDLLO9o4OUuR868p4dVKuCWX7LDi2HqIf4MQ) |
| 15 | **Pengaturan & Konfigurasi** | 780x4502 (Mobile) | `ad2ad46ee229408a8c63c3f3e7e035c5` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1VxfSOc8hFM0Fqy4OI_TWNLuenmFsTvoMw-vjSXiREND2lI-NpGFv3Ffr6nLozHymQRaX5DE-egKqxRh49yQOaKnkSbCd_lQxZFPDCpgZwVup2Mp6Z9PMGkEsPt7hSXfsCnoUMmrejs2mhx9XScArdUbUZYXW9wvsU_wM9QmJe-ZT04kBItRFV51D8dKtPsBcPIwUNZMTLVbHHGKhLTWAX05o8i3IPTA_VrVel6BM7Fwx6bNcsYqOI8WQ) |
| 16 | **Catat Suhu Wadah** | 780x2880 (Mobile) | `f4c0822f90b842da91753aa883208a08` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1XljxLP4t3AJ60HpnIkF9RL8QBULEW3UMlCWXw1YNjdJa5uimidmzOESbPewROFu8RT5zw5lPO82gn74LYFp0Qk9hfXXmWskqE4zlJpJsKPdG5ctoww7YH6-z73e5fOt3OCBB5Mr6ZeOaGRfCbTd0FcQFKQS6nbUNBn3QmO_2DRUdyCdDMLzNUy1RR_kwzyvoq9HOm1Z6acMxODqpw_jYL_Gtq3k-cUROfD9EcdU15xZsjXAOUYqyquBnc) |
| 17 | **Simulasi Offline & Gagal Simpan** | 780x4832 (Mobile) | `1df272868bc44aeeb6fe72de4a287d11` | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1X6ayZWprLnQ7iCQjRY46Wf2v-2ah4xq-q09UTG673kGQzLuUUe6jiwezZtMCc1IQvj010aCPpUvz8ykux5rRHVOsvoBC0Kd6_18vc0gIfxQpM7BzZDLnGpMDuCPVRqkFDBnVfmkSynPs5_adfHVESKIHsUmq8p6FaPOB7_ZQug-j6JoZInXAU-ZvGDRE1GDq1gIniYTn9RwKpkULWMGtaWQ2Cs2tO7nXQuQXP4ol_rKG64nupSZaHHxX4) |

---

## 4. Aset Visual
- **Logo SPPG**: Diekstrak dari Screen `0e9b06bafaa3468ca20c9d23dcce0826` dan disimpan di [public/sppg-logo.svg](file:///d:/Udi/Aplikasi/Aplikasi%20Perhitungan%20Pemorsian/public/sppg-logo.svg).
