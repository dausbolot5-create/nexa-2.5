# Bug Report & Fixes - SIPOA Project

**Date:** 2026-07-11  
**Status:** ✅ Fixed

## 1. Type Error di `login.tsx` & Data Type Return

**Problem:** `login.tsx` error karena mencoba mengakses properti `user` dari hasil pemanggilan `login()`, namun `login()` hanya me-return `{ ok: boolean, error?: string }`. Hal ini mencegah role-based redirecting (tidak bisa melempar `pelanggan` ke portalnya).  
**Fix:** Mengubah return type pada `interface AuthState` dan implementasi `login` di `auth.tsx` untuk menyertakan object `user` pada response sukses.

## 2. Inconsistency: Email-based Login Requirement vs Implementation

**Problem:** Memo/requirements mengatur login berbasis email `admin@sipoa.com` tetapi script lama menggunakan `username`, dan dummy account admin memakai email lain.
**Fix:**

- Fungsi login di `auth.tsx` disesuaikan agar menerima baik **username maupun email** (dibuat fleksibel) dari input yang dimasukkan ke form.
- Data seed dummy account admin di `mockData.ts` diperbarui dari `admin@apoteksehat.id` menjadi `admin@sipoa.com`.

## 3. Type Error di `_authed.pengguna.tsx` (Missing Role Pelanggan)

**Problem:** `roleTone[u.role]` pada `_authed.pengguna.tsx` menghasilkan error TS7053 karena objek `roleTone` tidak memetakan tone untuk "pelanggan", hanya admin, apoteker, dan kasir.
**Fix:** Menambahkan `pelanggan: "default"` ke dalam const object `roleTone`.

## 4. Security Vulnerability: Missing Role-Based Route Guards

**Problem:** Meskipun navigasi disembunyikan bagi user yang tidak berhak via `navItems`, user masih bisa memaksa masuk ke page yang dilarang (contoh: pelanggan masuk ke `/kasir`) hanya dengan mengetik path URL secara manual karena tidak ada guard yang memblokir render halamannya.
**Fix:**

- Menambahkan **authorization interceptor** pada `_authed.tsx` di layout component.
- Ketika user merender suatu rute, component layout akan memeriksa role user saat itu juga menggunakan definisi role `navItems.roles`.
- Jika user tak memiliki privilege, secara otomatis di-redirect kembali ke dashboard masing-masing.
- Memastikan bahwa pengguna dengan role "pelanggan" tidak bisa keluar dari ranah `/portal-pelanggan/*` dan pegawai tidak masuk ke portal pelanggan.

---

**Status Akhir:** Build success, dan 0 (nol) TypeScript errors tersisa (`tsc --noEmit` bersih).
