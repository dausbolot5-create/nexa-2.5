# Memory Log

Tujuan: Melacak perubahan file, tindakan agent, dan tugas pada proyek SIPOA Apotek Nexa.

## Perubahan Terakhir

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
