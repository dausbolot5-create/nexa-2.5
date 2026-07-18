import {
  LayoutDashboard,
  ShoppingCart,
  Pill,
  Truck,
  Users,
  FileText,
  PackagePlus,
  Boxes,
  TriangleAlert,
  ClipboardCheck,
  BarChart3,
  UserCog,
  Settings,
  Bell,
  Heart,
  User,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "./mockData";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
  group: string;
}

export const navItems: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dasbor",
    icon: LayoutDashboard,
    roles: ["admin", "apoteker", "kasir"],
    group: "Utama",
  },
  {
    to: "/portal-pelanggan",
    label: "Beranda Pelanggan",
    icon: LayoutDashboard,
    roles: ["pelanggan"],
    group: "Portal",
  },
  {
    to: "/portal-pelanggan/pesanan",
    label: "Pesanan Saya",
    icon: ShoppingCart,
    roles: ["pelanggan"],
    group: "Portal",
  },

  {
    to: "/portal-pelanggan/obat",
    label: "Obat Rutin",
    icon: Pill,
    roles: ["pelanggan"],
    group: "Portal",
  },
  {
    to: "/portal-pelanggan/kesehatan",
    label: "Riwayat Kesehatan",
    icon: Heart,
    roles: ["pelanggan"],
    group: "Portal",
  },
  {
    to: "/portal-pelanggan/profil",
    label: "Profil",
    icon: User,
    roles: ["pelanggan"],
    group: "Portal",
  },
  {
    to: "/kasir",
    label: "Kasir / POS",
    icon: ShoppingCart,
    roles: ["admin", "kasir"],
    group: "Utama",
  },
  {
    to: "/riwayat",
    label: "Riwayat",
    icon: FileText,
    roles: ["admin", "apoteker", "kasir"],
    group: "Utama",
  },
  {
    to: "/obat",
    label: "Data Obat",
    icon: Pill,
    roles: ["admin", "apoteker", "kasir"],
    group: "Manajemen",
  },
  {
    to: "/supplier",
    label: "Pemasok",
    icon: Truck,
    roles: ["admin", "apoteker"],
    group: "Manajemen",
  },
  {
    to: "/pelanggan",
    label: "Pelanggan",
    icon: Users,
    roles: ["admin", "apoteker", "kasir"],
    group: "Manajemen",
  },

  {
    to: "/pembelian",
    label: "Pembelian",
    icon: PackagePlus,
    roles: ["admin", "apoteker"],
    group: "Manajemen",
  },
  {
    to: "/inventori",
    label: "Inventori",
    icon: Boxes,
    roles: ["admin", "apoteker"],
    group: "Inventori",
  },
  {
    to: "/stok-alert",
    label: "Peringatan Stok",
    icon: TriangleAlert,
    roles: ["admin", "apoteker"],
    group: "Inventori",
  },
  {
    to: "/stok-opname",
    label: "Stok Opname",
    icon: ClipboardCheck,
    roles: ["admin", "apoteker"],
    group: "Inventori",
  },
  {
    to: "/laporan",
    label: "Laporan",
    icon: BarChart3,
    roles: ["admin", "apoteker"],
    group: "Sistem",
  },
  { to: "/pengguna", label: "Pengguna", icon: UserCog, roles: ["admin"], group: "Sistem" },
  {
    to: "/notifikasi",
    label: "Notifikasi",
    icon: Bell,
    roles: ["admin", "apoteker", "kasir"],
    group: "Sistem",
  },
  {
    to: "/pengaturan",
    label: "Pengaturan",
    icon: Settings,
    roles: ["admin", "apoteker", "kasir"],
    group: "Sistem",
  },
];
