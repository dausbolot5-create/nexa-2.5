export type Role = "admin" | "apoteker" | "kasir";

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: Role;
  email: string;
  phone: string;
  active: boolean;
}

export interface Medicine {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  expiry: string;
  supplier: string;
  location: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  points: number;
  member: boolean;
  totalSpent: number;
}

export interface Prescription {
  id: string;
  code: string;
  patient: string;
  doctor: string;
  date: string;
  status: "menunggu" | "diproses" | "selesai";
  items: number;
  total: number;
}

export interface Purchase {
  id: string;
  code: string;
  supplier: string;
  date: string;
  items: number;
  total: number;
  status: "diterima" | "dipesan" | "sebagian";
}

export interface Sale {
  id: string;
  code: string;
  date: string;
  cashier: string;
  customer: string;
  items: number;
  total: number;
  method: "Tunai" | "QRIS" | "Kartu";
}

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "stok" | "kadaluarsa" | "penjualan" | "sistem";
  read: boolean;
}

const rupiah = (n: number) => n;

export const users: User[] = [
  {
    id: "U01",
    name: "Dewi Anggraini",
    username: "admin",
    password: "admin123",
    role: "admin",
    email: "admin@apoteksehat.id",
    phone: "0812-1000-0001",
    active: true,
  },
  {
    id: "U02",
    name: "Rizky Pratama",
    username: "apoteker",
    password: "apoteker123",
    role: "apoteker",
    email: "apoteker@apoteksehat.id",
    phone: "0812-1000-0002",
    active: true,
  },
  {
    id: "U03",
    name: "Siti Nurhaliza",
    username: "kasir",
    password: "kasir123",
    role: "kasir",
    email: "kasir@apoteksehat.id",
    phone: "0812-1000-0003",
    active: true,
  },
  {
    id: "U04",
    name: "Bagas Wibowo",
    username: "kasir2",
    password: "kasir123",
    role: "kasir",
    email: "bagas@apoteksehat.id",
    phone: "0812-1000-0004",
    active: false,
  },
];

const cats = [
  "Analgesik",
  "Antibiotik",
  "Vitamin",
  "Antasida",
  "Antihistamin",
  "Batuk & Flu",
  "Suplemen",
  "Salep",
];
const supNames = [
  "PT Kimia Farma",
  "PT Kalbe Farma",
  "PT Bio Farma",
  "PT Sanbe Farma",
  "PT Dexa Medica",
  "PT Phapros",
];

const medNames = [
  ["Paracetamol 500mg", "Analgesik", "Tablet"],
  ["Amoxicillin 500mg", "Antibiotik", "Kapsul"],
  ["Vitamin C 1000mg", "Vitamin", "Tablet"],
  ["Antasida Doen", "Antasida", "Tablet"],
  ["Cetirizine 10mg", "Antihistamin", "Tablet"],
  ["OBH Combi 100ml", "Batuk & Flu", "Botol"],
  ["Ibuprofen 400mg", "Analgesik", "Tablet"],
  ["Cefadroxil 500mg", "Antibiotik", "Kapsul"],
  ["Vitamin B Complex", "Vitamin", "Tablet"],
  ["Omeprazole 20mg", "Antasida", "Kapsul"],
  ["Loratadine 10mg", "Antihistamin", "Tablet"],
  ["Dextromethorphan", "Batuk & Flu", "Tablet"],
  ["Zinc 20mg", "Suplemen", "Tablet"],
  ["Betadine 30ml", "Salep", "Botol"],
  ["Salep 88 15g", "Salep", "Tube"],
  ["Multivitamin Sirup", "Suplemen", "Botol"],
  ["Asam Mefenamat 500mg", "Analgesik", "Tablet"],
  ["Ambroxol 30mg", "Batuk & Flu", "Tablet"],
  ["Ranitidine 150mg", "Antasida", "Tablet"],
  ["Vitamin D3 1000IU", "Vitamin", "Tablet"],
];

export const medicines: Medicine[] = medNames.map((m, i) => {
  const cost = 2000 + ((i * 1337) % 40) * 500;
  const stock = [4, 120, 8, 240, 60, 12, 0, 95, 180, 33, 6, 150, 210, 45, 88, 20, 130, 9, 160, 75][
    i
  ];
  return {
    id: `M${String(i + 1).padStart(2, "0")}`,
    code: `OBT-${String(i + 1).padStart(4, "0")}`,
    name: m[0],
    category: m[1],
    unit: m[2],
    cost,
    price: Math.round(cost * 1.4),
    stock,
    minStock: 15,
    expiry: [
      "2026-03-01",
      "2027-01-15",
      "2025-08-10",
      "2026-11-20",
      "2026-06-30",
      "2025-09-05",
      "2027-04-12",
      "2026-02-28",
      "2027-07-01",
      "2025-12-15",
      "2026-05-22",
      "2027-03-18",
      "2026-10-09",
      "2025-07-25",
      "2026-09-14",
      "2027-02-02",
      "2026-08-08",
      "2025-11-11",
      "2027-05-30",
      "2026-12-01",
    ][i],
    supplier: supNames[i % supNames.length],
    location: `Rak ${String.fromCharCode(65 + (i % 5))}-${(i % 8) + 1}`,
  };
});

export const suppliers: Supplier[] = supNames.map((n, i) => ({
  id: `S${String(i + 1).padStart(2, "0")}`,
  name: n,
  contact: [
    "Andi Saputra",
    "Maya Sari",
    "Budi Hartono",
    "Lina Wijaya",
    "Fajar Nugroho",
    "Rina Kusuma",
  ][i],
  phone: `021-${5000 + i * 111}-${100 + i}`,
  email: `sales@${n.split(" ")[1].toLowerCase()}.co.id`,
  address: `Jl. Industri Farmasi No. ${i + 12}`,
  city: ["Jakarta", "Bandung", "Bandung", "Bandung", "Jakarta", "Semarang"][i],
}));

const custNames = [
  "Ahmad Fauzi",
  "Ratna Dewi",
  "Joko Susilo",
  "Maya Puspita",
  "Hendra Gunawan",
  "Sri Wahyuni",
  "Doni Kurniawan",
  "Indah Permata",
  "Agus Salim",
  "Fitri Handayani",
];
export const customers: Customer[] = custNames.map((n, i) => ({
  id: `C${String(i + 1).padStart(2, "0")}`,
  name: n,
  phone: `0813-${2000 + i * 137}-${1000 + i}`,
  email: `${n.split(" ")[0].toLowerCase()}@mail.com`,
  points: (i * 137) % 500,
  member: i % 3 !== 0,
  totalSpent: (i + 1) * 185000 + (i % 4) * 42000,
}));

export const prescriptions: Prescription[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `R${String(i + 1).padStart(2, "0")}`,
  code: `RSP-${2024001 + i}`,
  patient: custNames[i],
  doctor: ["dr. Wibisono", "dr. Kartika", "dr. Halim", "dr. Suryani"][i % 4],
  date: `2025-07-0${(i % 7) + 1}`,
  status: (["selesai", "diproses", "menunggu"] as const)[i % 3],
  items: (i % 4) + 1,
  total: (i + 1) * 45000,
}));

export const purchases: Purchase[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `P${String(i + 1).padStart(2, "0")}`,
  code: `PO-${2025001 + i}`,
  supplier: supNames[i % supNames.length],
  date: `2025-06-${String((i % 27) + 1).padStart(2, "0")}`,
  items: (i % 6) + 3,
  total: (i + 1) * 1250000,
  status: (["diterima", "dipesan", "sebagian"] as const)[i % 3],
}));

export const sales: Sale[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `T${String(i + 1).padStart(2, "0")}`,
  code: `INV-${2025100 + i}`,
  date: `2025-07-0${(i % 7) + 1}`,
  cashier: ["Siti Nurhaliza", "Bagas Wibowo"][i % 2],
  customer: i % 2 === 0 ? custNames[i % custNames.length] : "Umum",
  items: (i % 5) + 1,
  total: (i + 1) * 37500 + (i % 3) * 12000,
  method: (["Tunai", "QRIS", "Kartu"] as const)[i % 3],
}));

export const notifications: AppNotification[] = [
  {
    id: "N1",
    title: "Stok menipis",
    desc: "Paracetamol 500mg tersisa 4 tablet",
    time: "5 menit lalu",
    type: "stok",
    read: false,
  },
  {
    id: "N2",
    title: "Obat akan kadaluarsa",
    desc: "Betadine 30ml kadaluarsa 25 Jul 2025",
    time: "1 jam lalu",
    type: "kadaluarsa",
    read: false,
  },
  {
    id: "N3",
    title: "Penjualan tercatat",
    desc: "INV-2025111 senilai Rp 450.000",
    time: "2 jam lalu",
    type: "penjualan",
    read: false,
  },
  {
    id: "N4",
    title: "Stok habis",
    desc: "Ibuprofen 400mg stok 0",
    time: "3 jam lalu",
    type: "stok",
    read: true,
  },
  {
    id: "N5",
    title: "Pembaruan sistem",
    desc: "Apotek Nexa berhasil diperbarui",
    time: "Kemarin",
    type: "sistem",
    read: true,
  },
  {
    id: "N6",
    title: "Pesanan diterima",
    desc: "PO-2025003 dari PT Bio Farma diterima",
    time: "Kemarin",
    type: "sistem",
    read: true,
  },
];

export const salesTrend = [
  { day: "Sen", penjualan: 4200000, transaksi: 42 },
  { day: "Sel", penjualan: 3800000, transaksi: 38 },
  { day: "Rab", penjualan: 5100000, transaksi: 51 },
  { day: "Kam", penjualan: 4700000, transaksi: 47 },
  { day: "Jum", penjualan: 6300000, transaksi: 63 },
  { day: "Sab", penjualan: 7800000, transaksi: 78 },
  { day: "Min", penjualan: 5400000, transaksi: 54 },
];

export const categorySales = cats.slice(0, 5).map((c, i) => ({
  name: c,
  value: [3200, 2400, 1800, 1200, 900][i],
}));

export const monthlyRevenue = ["Feb", "Mar", "Apr", "Mei", "Jun", "Jul"].map((m, i) => ({
  month: m,
  pendapatan: [82, 91, 88, 104, 118, 132][i] * 1000000,
  pembelian: [54, 61, 58, 66, 72, 79][i] * 1000000,
}));

export const formatRupiah = (n: number) => "Rp " + rupiah(n).toLocaleString("id-ID");

export const roleLabel: Record<Role, string> = {
  admin: "Administrator",
  apoteker: "Apoteker",
  kasir: "Kasir",
};
