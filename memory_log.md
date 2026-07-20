# Memory Log

Tujuan: Melacak perubahan file, tindakan agent, dan tugas pada proyek SIPOA Apotek Nexa.

## Perubahan Terakhir

### 2026-07-20: NewFitur.md — 3 Task

**1. Fix bug laporan pendapatan vs pembelian**

- File diubah: `src/routes/_authed.laporan.tsx`
  - Tambah try/catch di `getLaporanData` → fallback ke mockData jika DB mati
  - Fix chart bulanan: sort kronologis (sebelumnya urutan random dari Object.entries)

**2. Stock opname — penjelasan**

- Stock opname = cocokkan stok fisik vs stok sistem. Deteksi selisih (hilang/rusak/expired/salah input). Halaman sudah ada di `_authed.stok-opname.tsx`.

**3. Contributor di README**

- File diubah: `README.md` — tambah section Contributors dengan avatar+link GitHub: dausbolot5-create, FamsGit

### 2026-07-17: NewFitur.md — 4 Fitur Besar

**1. Cetak Struk (Kasir POS)**

- File baru: `src/components/ReceiptDialog.tsx` — dialog struk pembayaran + print via window.open
- File diubah: `src/routes/_authed.kasir.tsx` — checkout sekarang menyimpan sale + sale_items ke DB, menampilkan struk otomatis, tombol cetak struk

**2. Halaman Riwayat**

- File diubah: `src/routes/_authed.riwayat.tsx` — menghapus tab resep karena tidak lagi digunakan.
- File diubah: `src/routes/_authed.dashboard.tsx` — memperbaiki crash Recharts PieChart (menambahkan empty state jika categorySales 0).
- File diubah: `src/routes/_authed.dashboard.tsx`, `src/routes/_authed.riwayat.tsx`, `src/routes/_authed.inventori.tsx` — menambahkan fallback `mockData` pada SSR data loader (`createServerFn`) agar halaman tidak crash dengan pesan "This page didn't load" saat koneksi MySQL gagal / saat bypass.
- File diubah: `src/lib/nav.ts` — menambah menu "Riwayat" di navigasi (group Utama, roles admin/apoteker/kasir)

**3. Menjalankan Semua Sistem Demo → Real DB**

- `src/routes/_authed.supplier.tsx` — data dari DB, tombol "Tambah Pemasok" → dialog form → insert ke DB
- `src/routes/_authed.pengguna.tsx` — data dari DB, tombol "Tambah Pengguna" → dialog form → insert ke DB, toggle aktif → update DB
- `src/routes/_authed.pembelian.tsx` — data dari DB + supplier list, tombol "Buat Pesanan" → dialog form → insert ke DB
- `src/routes/_authed.laporan.tsx` — data chart dari real sales/purchases DB, tombol "Ekspor" → download CSV nyata
- `src/routes/_authed.dashboard.tsx` — semua KPI, chart, transaksi terbaru dari DB (bukan mockData)

**4. Build & Lint**

- Build: ✅ sukses (0 errors)
- Lint: ✅ 0 errors (7 warnings pre-existing, bukan dari perubahan ini)

### 2026-07-10 (17:52 - 17:57): Portal Pelanggan - Menambahkan 3 Halaman Baru

**Fitur Baru:**
✅ Menambahkan halaman **Profil Pelanggan** (`/portal-pelanggan/profil`)

- Data pribadi (nama, email, HP, tanggal lahir)
- Alamat pengiriman
- Info BPJS/Asuransi
- Avatar dengan badge verified

✅ Menambahkan halaman **Obat Rutin** (`/portal-pelanggan/obat`)

- Card grid obat dengan progress bar stok
- Badge "Stok Rendah" untuk obat <30%
- Toggle pengingat per obat
- Button "Pesan Ulang"
- Info jadwal minum obat

✅ Menambahkan halaman **Riwayat Kesehatan** (`/portal-pelanggan/kesehatan`)

- 4 Vital signs cards (Tekanan Darah, Gula Darah, Berat Badan, Detak Jantung)
- Card kondisi medis & alergi
- Timeline riwayat kunjungan dokter

**File yang Dimodifikasi:**

- `src/lib/nav.ts` - Menambahkan 3 menu baru (Obat Rutin, Riwayat Kesehatan, Profil)
- Import icon baru: `Heart`, `User`

**File yang Dibuat:**

- `src/routes/_authed.portal-pelanggan.profil.tsx` (110 lines)
- `src/routes/_authed.portal-pelanggan.obat.tsx` (118 lines)
- `src/routes/_authed.portal-pelanggan.kesehatan.tsx` (127 lines)

**Route Tree:**

- TanStack Router auto-generate 3 route baru
- `src/routeTree.gen.ts` updated otomatis

**Status:**

- ✅ Lint passed (0 errors, 7 warnings pre-existing)
- ✅ Prettier formatted
- ✅ Design mengikuti pattern Apotek Nexa (glass effect, color scheme)
- ✅ Fitur sama dengan Apotek Anda Ceria

**Total Portal Pelanggan sekarang: 6 halaman**

1. Beranda Pelanggan ✅
2. Pesanan Saya ✅
3. Resep Digital ✅
4. Obat Rutin ✅ (BARU)
5. Riwayat Kesehatan ✅ (BARU)
6. Profil ✅ (BARU)

---

### 2026-07-13: Setup Working Directory & Persistent Memory

**Action:** Set `/mnt/d/Projects/Kampus/apotek-nexa-main` as working directory for opencode session

**Context:**

- Project: SIPOA Apotek Nexa (TanStack Start + React 19 + TypeScript)
- Using TanStack Router, Tailwind CSS v4, Radix UI
- Connected to Lovable (avoid rewriting git history)
- Recent completion: Portal Pelanggan - 3 new pages added (Profil, Obat Rutin, Riwayat Kesehatan)
- All bugs fixed as of 2026-07-11 (login type errors, role guards, email/username flexibility)

**Key Files:**

- `memory_log.md` - This persistent memory log
- `AGENTS.md` - Project guidelines (Lovable integration)
- `bug_report_temp.md` - Historical bug fixes

## 2026-07-14\n- Restored real mysql2 connection pool in `src/db/index.ts` (removed dummyDb bypass)\n
