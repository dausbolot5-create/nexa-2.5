# SIPOA — Sistem Informasi Penjualan Obat Apotek

Aplikasi manajemen apotek berbasis web untuk mengelola penjualan, inventori, pembelian, supplier, dan pengguna.

## Tech Stack

- **Frontend:** React + TanStack Start (SSR/Vite)
- **Backend:** Nitro server functions + Drizzle ORM
- **Database:** MySQL
- **Styling:** Tailwind CSS + shadcn/ui

## Fitur

- 🏪 Dashboard ringkasan penjualan & stok
- 💊 Manajemen inventori obat
- 🛒 Kasir / Point of Sale
- 📦 Pembelian & manajemen supplier
- 📊 Laporan penjualan
- 📜 Riwayat transaksi & cetak struk
- 👤 Manajemen pengguna (RBAC)

## Setup

```bash
npm install
cp .env.example .env   # isi koneksi database
npm run dev
```

## Build

```bash
npm run build
```
