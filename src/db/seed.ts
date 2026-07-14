import { db } from "./index";
import {
  users,
  medicines,
  suppliers,
  customers,
  sales,
  saleItems,
  purchases,
  purchaseItems,
  prescriptions,
  prescriptionItems,
  notifications,
} from "./schema";
import { sql } from "drizzle-orm";
import { hash } from "bcryptjs";

const BCRYPT_COST = 10;

async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_COST);
}

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    await seedUsers();
    await seedSuppliers();
    await seedMedicines();
    await seedCustomers();
    await seedSales();
    await seedPurchases();
    await seedPrescriptions();
    await seedNotifications();

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

async function seedUsers() {
  console.log("  👤 Seeding users...");

  const usersData = [
    {
      id: "U01",
      name: "Dewi Anggraini",
      username: "admin",
      email: "admin@sipoa.com",
      password: "admin123",
      role: "admin",
      phone: "0812-1000-0001",
      active: true,
    },
    {
      id: "U02",
      name: "Rizky Pratama",
      username: "apoteker",
      email: "apoteker@apoteksehat.id",
      password: "apoteker123",
      role: "apoteker",
      phone: "0812-1000-0002",
      active: true,
    },
    {
      id: "U03",
      name: "Siti Nurhaliza",
      username: "kasir",
      email: "kasir@apoteksehat.id",
      password: "kasir123",
      role: "kasir",
      phone: "0812-1000-0003",
      active: true,
    },
    {
      id: "U04",
      name: "Siti Rahmawati",
      username: "pelanggan",
      email: "siti.rahma@email.com",
      password: "pelanggan123",
      role: "pelanggan",
      phone: "0812-1234-5678",
      active: true,
    },
    {
      id: "U05",
      name: "Bagas Wibowo",
      username: "kasir2",
      email: "bagas@apoteksehat.id",
      password: "kasir123",
      role: "kasir",
      phone: "0812-1000-0004",
      active: false,
    },
  ];

  const hashedUsers = await Promise.all(
    usersData.map(async (u) => ({
      ...u,
      passwordHash: await hashPassword(u.password),
    })),
  );

  await db
    .insert(users)
    .values(hashedUsers.map(({ password, ...rest }) => rest))
    .onDuplicateKeyUpdate({
      set: {
        name: sql`VALUES(name)`,
        email: sql`VALUES(email)`,
        passwordHash: sql`VALUES(password_hash)`,
        role: sql`VALUES(role)`,
        phone: sql`VALUES(phone)`,
        active: sql`VALUES(active)`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });

  console.log(`    ✓ Inserted ${usersData.length} users`);
}

async function seedSuppliers() {
  console.log("  🏭 Seeding suppliers...");

  const suppliersData = [
    {
      id: "S01",
      name: "PT Kimia Farma",
      contact: "Andi Saputra",
      phone: "021-5000-111-100",
      email: "sales@kimiafarma.co.id",
      address: "Jl. Industri Farmasi No. 12",
      city: "Jakarta",
    },
    {
      id: "S02",
      name: "PT Kalbe Farma",
      contact: "Maya Sari",
      phone: "021-5111-222-101",
      email: "sales@kalbe.co.id",
      address: "Jl. Industri Farmasi No. 13",
      city: "Bandung",
    },
    {
      id: "S03",
      name: "PT Bio Farma",
      contact: "Budi Hartono",
      phone: "021-5222-333-102",
      email: "sales@biofarma.co.id",
      address: "Jl. Industri Farmasi No. 14",
      city: "Bandung",
    },
    {
      id: "S04",
      name: "PT Sanbe Farma",
      contact: "Lina Wijaya",
      phone: "021-5333-444-103",
      email: "sales@sanbe.co.id",
      address: "Jl. Industri Farmasi No. 15",
      city: "Bandung",
    },
    {
      id: "S05",
      name: "PT Dexa Medica",
      contact: "Fajar Nugroho",
      phone: "021-5444-555-104",
      email: "sales@dexa.co.id",
      address: "Jl. Industri Farmasi No. 16",
      city: "Jakarta",
    },
    {
      id: "S06",
      name: "PT Phapros",
      contact: "Rina Kusuma",
      phone: "021-5555-666-105",
      email: "sales@phapros.co.id",
      address: "Jl. Industri Farmasi No. 17",
      city: "Semarang",
    },
  ];

  await db
    .insert(suppliers)
    .values(suppliersData)
    .onDuplicateKeyUpdate({
      set: {
        name: sql`VALUES(name)`,
        contact: sql`VALUES(contact)`,
        phone: sql`VALUES(phone)`,
        email: sql`VALUES(email)`,
        address: sql`VALUES(address)`,
        city: sql`VALUES(city)`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });

  console.log(`    ✓ Inserted ${suppliersData.length} suppliers`);
}

async function seedMedicines() {
  console.log("  💊 Seeding medicines...");

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

  const supNames = [
    "PT Kimia Farma",
    "PT Kalbe Farma",
    "PT Bio Farma",
    "PT Sanbe Farma",
    "PT Dexa Medica",
    "PT Phapros",
  ];

  const stockData = [
    4, 120, 8, 240, 60, 12, 0, 95, 180, 33, 6, 150, 210, 45, 88, 20, 130, 9, 160, 75,
  ];
  const expiryData = [
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
  ];

  const medicinesData = medNames.map((m, i) => {
    const cost = 2000 + ((i * 1337) % 40) * 500;
    return {
      id: `M${String(i + 1).padStart(2, "0")}`,
      code: `OBT-${String(i + 1).padStart(4, "0")}`,
      name: m[0],
      category: m[1],
      unit: m[2],
      cost,
      price: Math.round(cost * 1.4),
      stock: stockData[i],
      minStock: 15,
      expiry: expiryData[i],
      supplierId: `S${String((i % 6) + 1).padStart(2, "0")}`,
      location: `Rak ${String.fromCharCode(65 + (i % 5))}-${(i % 8) + 1}`,
    };
  });

  await db
    .insert(medicines)
    .values(medicinesData)
    .onDuplicateKeyUpdate({
      set: {
        name: sql`VALUES(name)`,
        category: sql`VALUES(category)`,
        unit: sql`VALUES(unit)`,
        price: sql`VALUES(price)`,
        cost: sql`VALUES(cost)`,
        stock: sql`VALUES(stock)`,
        minStock: sql`VALUES(min_stock)`,
        expiry: sql`VALUES(expiry)`,
        supplierId: sql`VALUES(supplier_id)`,
        location: sql`VALUES(location)`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });

  console.log(`    ✓ Inserted ${medicinesData.length} medicines`);
}

async function seedCustomers() {
  console.log("  👥 Seeding customers...");

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

  const customersData = custNames.map((n, i) => ({
    id: `C${String(i + 1).padStart(2, "0")}`,
    name: n,
    phone: `0813-${2000 + i * 137}-${1000 + i}`,
    email: `${n.split(" ")[0].toLowerCase()}@mail.com`,
    points: (i * 137) % 500,
    isMember: i % 3 !== 0,
    totalSpent: (i + 1) * 185000 + (i % 4) * 42000,
  }));

  // Add Siti Rahmawati explicitly for CRM Dashboard
  customersData.push({
    id: "U04",
    name: "Siti Rahmawati",
    phone: "0812-1234-5678",
    email: "siti.rahma@email.com",
    points: 150,
    isMember: true,
    totalSpent: 450000,
  });

  await db
    .insert(customers)
    .values(customersData)
    .onDuplicateKeyUpdate({
      set: {
        name: sql`VALUES(name)`,
        phone: sql`VALUES(phone)`,
        email: sql`VALUES(email)`,
        points: sql`VALUES(points)`,
        isMember: sql`VALUES(is_member)`,
        totalSpent: sql`VALUES(total_spent)`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });

  console.log(`    ✓ Inserted ${customersData.length} customers`);
}

async function seedSales() {
  console.log("  💰 Seeding sales...");

  const salesData = [
    {
      id: "T01",
      code: "INV-2025100",
      date: "2025-07-01",
      cashierId: "U03",
      customerId: "C01",
      itemsCount: 2,
      total: 50000,
      method: "Tunai",
    },
    {
      id: "T02",
      code: "INV-2025101",
      date: "2025-07-02",
      cashierId: "U05",
      customerId: "C02",
      itemsCount: 3,
      total: 125000,
      method: "QRIS",
    },
    {
      id: "T03",
      code: "INV-2025102",
      date: "2025-07-03",
      cashierId: "U03",
      customerId: null,
      itemsCount: 1,
      total: 75000,
      method: "Tunai",
    },
    {
      id: "T04",
      code: "INV-2025103",
      date: "2025-07-04",
      cashierId: "U05",
      customerId: "C04",
      itemsCount: 4,
      total: 200000,
      method: "Kartu",
    },
    {
      id: "T05",
      code: "INV-2025104",
      date: "2025-07-05",
      cashierId: "U03",
      customerId: "C05",
      itemsCount: 2,
      total: 87500,
      method: "Tunai",
    },
    {
      id: "T06",
      code: "INV-2025105",
      date: "2025-07-06",
      cashierId: "U05",
      customerId: "C06",
      itemsCount: 3,
      total: 150000,
      method: "QRIS",
    },
    {
      id: "T07",
      code: "INV-2025106",
      date: "2025-07-07",
      cashierId: "U03",
      customerId: "C07",
      itemsCount: 1,
      total: 45000,
      method: "Tunai",
    },
    {
      id: "T08",
      code: "INV-2025107",
      date: "2025-07-01",
      cashierId: "U03",
      customerId: "C08",
      itemsCount: 2,
      total: 95000,
      method: "Kartu",
    },
    {
      id: "T09",
      code: "INV-2025108",
      date: "2025-07-02",
      cashierId: "U05",
      customerId: "C09",
      itemsCount: 3,
      total: 180000,
      method: "Tunai",
    },
    {
      id: "T10",
      code: "INV-2025109",
      date: "2025-07-03",
      cashierId: "U03",
      customerId: "C10",
      itemsCount: 1,
      total: 60000,
      method: "QRIS",
    },
    {
      id: "T11",
      code: "INV-2025110",
      date: "2025-07-04",
      cashierId: "U05",
      customerId: null,
      itemsCount: 2,
      total: 110000,
      method: "Tunai",
    },
    {
      id: "T12",
      code: "INV-2025111",
      date: "2025-07-05",
      cashierId: "U03",
      customerId: "C02",
      itemsCount: 4,
      total: 220000,
      method: "Kartu",
    },
  ];

  await db
    .insert(sales)
    .values(salesData)
    .onDuplicateKeyUpdate({
      set: {
        date: sql`VALUES(date)`,
        cashierId: sql`VALUES(cashier_id)`,
        customerId: sql`VALUES(customer_id)`,
        itemsCount: sql`VALUES(items_count)`,
        total: sql`VALUES(total)`,
        method: sql`VALUES(method)`,
      },
    });

  const saleItemsData = [
    { id: "SI01", saleId: "T01", medicineId: "M01", qty: 2, price: 5000, subtotal: 10000 },
    { id: "SI02", saleId: "T01", medicineId: "M03", qty: 1, price: 40000, subtotal: 40000 },
    { id: "SI03", saleId: "T02", medicineId: "M02", qty: 1, price: 75000, subtotal: 75000 },
    { id: "SI04", saleId: "T02", medicineId: "M04", qty: 2, price: 25000, subtotal: 50000 },
    { id: "SI05", saleId: "T03", medicineId: "M05", qty: 1, price: 75000, subtotal: 75000 },
    { id: "SI06", saleId: "T04", medicineId: "M01", qty: 3, price: 5000, subtotal: 15000 },
    { id: "SI07", saleId: "T04", medicineId: "M06", qty: 1, price: 185000, subtotal: 185000 },
    { id: "SI08", saleId: "T05", medicineId: "M07", qty: 1, price: 35000, subtotal: 35000 },
    { id: "SI09", saleId: "T05", medicineId: "M08", qty: 1, price: 52500, subtotal: 52500 },
    { id: "SI10", saleId: "T06", medicineId: "M09", qty: 2, price: 75000, subtotal: 150000 },
    { id: "SI11", saleId: "T07", medicineId: "M10", qty: 1, price: 45000, subtotal: 45000 },
    { id: "SI12", saleId: "T08", medicineId: "M11", qty: 1, price: 40000, subtotal: 40000 },
    { id: "SI13", saleId: "T08", medicineId: "M12", qty: 1, price: 55000, subtotal: 55000 },
    { id: "SI14", saleId: "T09", medicineId: "M13", qty: 2, price: 90000, subtotal: 180000 },
    { id: "SI15", saleId: "T10", medicineId: "M14", qty: 1, price: 60000, subtotal: 60000 },
    { id: "SI16", saleId: "T11", medicineId: "M15", qty: 2, price: 55000, subtotal: 110000 },
    { id: "SI17", saleId: "T12", medicineId: "M16", qty: 1, price: 220000, subtotal: 220000 },
  ];

  await db
    .insert(saleItems)
    .values(saleItemsData)
    .onDuplicateKeyUpdate({
      set: {
        saleId: sql`VALUES(sale_id)`,
        medicineId: sql`VALUES(medicine_id)`,
        qty: sql`VALUES(qty)`,
        price: sql`VALUES(price)`,
        subtotal: sql`VALUES(subtotal)`,
      },
    });

  console.log(`    ✓ Inserted ${salesData.length} sales with ${saleItemsData.length} items`);
}

async function seedPurchases() {
  console.log("  📦 Seeding purchases...");

  const purchasesData = [
    {
      id: "P01",
      code: "PO-2025001",
      supplierId: "S01",
      date: "2025-06-01",
      itemsCount: 4,
      total: 1250000,
      status: "diterima",
    },
    {
      id: "P02",
      code: "PO-2025002",
      supplierId: "S02",
      date: "2025-06-05",
      itemsCount: 5,
      total: 2500000,
      status: "dipesan",
    },
    {
      id: "P03",
      code: "PO-2025003",
      supplierId: "S03",
      date: "2025-06-10",
      itemsCount: 3,
      total: 3750000,
      status: "diterima",
    },
    {
      id: "P04",
      code: "PO-2025004",
      supplierId: "S04",
      date: "2025-06-15",
      itemsCount: 6,
      total: 5000000,
      status: "sebagian",
    },
    {
      id: "P05",
      code: "PO-2025005",
      supplierId: "S05",
      date: "2025-06-20",
      itemsCount: 4,
      total: 6250000,
      status: "diterima",
    },
    {
      id: "P06",
      code: "PO-2025006",
      supplierId: "S06",
      date: "2025-06-25",
      itemsCount: 5,
      total: 7500000,
      status: "dipesan",
    },
    {
      id: "P07",
      code: "PO-2025007",
      supplierId: "S01",
      date: "2025-06-28",
      itemsCount: 3,
      total: 8750000,
      status: "diterima",
    },
    {
      id: "P08",
      code: "PO-2025008",
      supplierId: "S02",
      date: "2025-06-30",
      itemsCount: 4,
      total: 10000000,
      status: "sebagian",
    },
  ];

  await db
    .insert(purchases)
    .values(purchasesData)
    .onDuplicateKeyUpdate({
      set: {
        supplierId: sql`VALUES(supplier_id)`,
        date: sql`VALUES(date)`,
        itemsCount: sql`VALUES(items_count)`,
        total: sql`VALUES(total)`,
        status: sql`VALUES(status)`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });

  const purchaseItemsData = [
    { id: "PI01", purchaseId: "P01", medicineId: "M01", qty: 100, cost: 3500, subtotal: 350000 },
    { id: "PI02", purchaseId: "P01", medicineId: "M03", qty: 50, cost: 28000, subtotal: 1400000 },
    { id: "PI03", purchaseId: "P02", medicineId: "M02", qty: 80, cost: 52000, subtotal: 4160000 },
    { id: "PI04", purchaseId: "P02", medicineId: "M04", qty: 60, cost: 17500, subtotal: 1050000 },
    { id: "PI05", purchaseId: "P03", medicineId: "M05", qty: 100, cost: 52500, subtotal: 5250000 },
    { id: "PI06", purchaseId: "P03", medicineId: "M06", qty: 50, cost: 130000, subtotal: 6500000 },
    { id: "PI07", purchaseId: "P04", medicineId: "M07", qty: 80, cost: 24500, subtotal: 1960000 },
    { id: "PI08", purchaseId: "P04", medicineId: "M08", qty: 70, cost: 36750, subtotal: 2572500 },
    { id: "PI09", purchaseId: "P05", medicineId: "M09", qty: 60, cost: 52500, subtotal: 3150000 },
    { id: "PI10", purchaseId: "P05", medicineId: "M10", qty: 50, cost: 31500, subtotal: 1575000 },
    { id: "PI11", purchaseId: "P06", medicineId: "M11", qty: 90, cost: 28000, subtotal: 2520000 },
    { id: "PI12", purchaseId: "P06", medicineId: "M12", qty: 40, cost: 38500, subtotal: 1540000 },
    { id: "PI13", purchaseId: "P07", medicineId: "M13", qty: 100, cost: 63000, subtotal: 6300000 },
    { id: "PI14", purchaseId: "P07", medicineId: "M14", qty: 80, cost: 42000, subtotal: 3360000 },
    { id: "PI15", purchaseId: "P08", medicineId: "M15", qty: 60, cost: 38500, subtotal: 2310000 },
    { id: "PI16", purchaseId: "P08", medicineId: "M16", qty: 50, cost: 440000, subtotal: 22000000 },
  ];

  await db
    .insert(purchaseItems)
    .values(purchaseItemsData)
    .onDuplicateKeyUpdate({
      set: {
        purchaseId: sql`VALUES(purchase_id)`,
        medicineId: sql`VALUES(medicine_id)`,
        qty: sql`VALUES(qty)`,
        cost: sql`VALUES(cost)`,
        subtotal: sql`VALUES(subtotal)`,
      },
    });

  console.log(
    `    ✓ Inserted ${purchasesData.length} purchases with ${purchaseItemsData.length} items`,
  );
}

async function seedPrescriptions() {
  console.log("  📋 Seeding prescriptions...");

  const prescriptionsData = [
    {
      id: "R01",
      code: "RSP-2024001",
      patientName: "Ahmad Fauzi",
      doctorName: "dr. Wibisono",
      date: "2025-07-01",
      status: "selesai",
      itemsCount: 2,
      total: 45000,
      patientId: "C01",
    },
    {
      id: "R02",
      code: "RSP-2024002",
      patientName: "Ratna Dewi",
      doctorName: "dr. Kartika",
      date: "2025-07-02",
      status: "diproses",
      itemsCount: 3,
      total: 90000,
      patientId: "C02",
    },
    {
      id: "R03",
      code: "RSP-2024003",
      patientName: "Joko Susilo",
      doctorName: "dr. Halim",
      date: "2025-07-03",
      status: "menunggu",
      itemsCount: 1,
      total: 135000,
      patientId: "C03",
    },
    {
      id: "R04",
      code: "RSP-2024004",
      patientName: "Maya Puspita",
      doctorName: "dr. Suryani",
      date: "2025-07-04",
      status: "selesai",
      itemsCount: 4,
      total: 180000,
      patientId: "C04",
    },
    {
      id: "R05",
      code: "RSP-2024005",
      patientName: "Hendra Gunawan",
      doctorName: "dr. Wibisono",
      date: "2025-07-05",
      status: "diproses",
      itemsCount: 2,
      total: 225000,
      patientId: "C05",
    },
    {
      id: "R06",
      code: "RSP-2024006",
      patientName: "Sri Wahyuni",
      doctorName: "dr. Kartika",
      date: "2025-07-06",
      status: "menunggu",
      itemsCount: 3,
      total: 270000,
      patientId: "C06",
    },
    {
      id: "R07",
      code: "RSP-2024007",
      patientName: "Doni Kurniawan",
      doctorName: "dr. Halim",
      date: "2025-07-07",
      status: "selesai",
      itemsCount: 1,
      total: 315000,
      patientId: "C07",
    },
    {
      id: "R08",
      code: "RSP-2024008",
      patientName: "Indah Permata",
      doctorName: "dr. Suryani",
      date: "2025-07-01",
      status: "diproses",
      itemsCount: 2,
      total: 360000,
      patientId: "C08",
    },
  ];

  await db
    .insert(prescriptions)
    .values(prescriptionsData)
    .onDuplicateKeyUpdate({
      set: {
        patientName: sql`VALUES(patient_name)`,
        doctorName: sql`VALUES(doctor_name)`,
        date: sql`VALUES(date)`,
        status: sql`VALUES(status)`,
        itemsCount: sql`VALUES(items_count)`,
        total: sql`VALUES(total)`,
        patientId: sql`VALUES(patient_id)`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });

  const prescriptionItemsData = [
    {
      id: "RSP01",
      prescriptionId: "R01",
      medicineId: "M01",
      qty: 2,
      dosage: "3x1",
      notes: "Setelah makan",
    },
    {
      id: "RSP02",
      prescriptionId: "R01",
      medicineId: "M03",
      qty: 1,
      dosage: "1x1",
      notes: "Sebelum makan",
    },
    {
      id: "RSP03",
      prescriptionId: "R02",
      medicineId: "M02",
      qty: 1,
      dosage: "3x1",
      notes: "Setelah makan",
    },
    {
      id: "RSP04",
      prescriptionId: "R02",
      medicineId: "M04",
      qty: 2,
      dosage: "2x1",
      notes: "Ketika perlu",
    },
    {
      id: "RSP05",
      prescriptionId: "R03",
      medicineId: "M05",
      qty: 1,
      dosage: "1x1",
      notes: "Malam hari",
    },
    {
      id: "RSP06",
      prescriptionId: "R04",
      medicineId: "M01",
      qty: 3,
      dosage: "3x1",
      notes: "Setelah makan",
    },
    {
      id: "RSP07",
      prescriptionId: "R04",
      medicineId: "M06",
      qty: 1,
      dosage: "2x1",
      notes: "Ketika batuk",
    },
    {
      id: "RSP08",
      prescriptionId: "R05",
      medicineId: "M07",
      qty: 1,
      dosage: "3x1",
      notes: "Setelah makan",
    },
    {
      id: "RSP09",
      prescriptionId: "R05",
      medicineId: "M08",
      qty: 1,
      dosage: "1x1",
      notes: "Sebelum tidur",
    },
    {
      id: "RSP10",
      prescriptionId: "R06",
      medicineId: "M09",
      qty: 2,
      dosage: "2x1",
      notes: "Setelah makan",
    },
    {
      id: "RSP11",
      prescriptionId: "R06",
      medicineId: "M10",
      qty: 1,
      dosage: "1x1",
      notes: "Pagi hari",
    },
    {
      id: "RSP12",
      prescriptionId: "R07",
      medicineId: "M11",
      qty: 1,
      dosage: "3x1",
      notes: "Setelah makan",
    },
    {
      id: "RSP13",
      prescriptionId: "R08",
      medicineId: "M12",
      qty: 2,
      dosage: "2x1",
      notes: "Ketika sakit",
    },
  ];

  await db
    .insert(prescriptionItems)
    .values(prescriptionItemsData)
    .onDuplicateKeyUpdate({
      set: {
        prescriptionId: sql`VALUES(prescription_id)`,
        medicineId: sql`VALUES(medicine_id)`,
        qty: sql`VALUES(qty)`,
        dosage: sql`VALUES(dosage)`,
        notes: sql`VALUES(notes)`,
      },
    });

  console.log(
    `    ✓ Inserted ${prescriptionsData.length} prescriptions with ${prescriptionItemsData.length} items`,
  );
}

async function seedNotifications() {
  console.log("  🔔 Seeding notifications...");

  const notificationsData = [
    {
      id: "N1",
      title: "Stok menipis",
      description: "Paracetamol 500mg tersisa 4 tablet",
      time: "5 menit lalu",
      type: "stok",
      read: false,
      userId: "U01",
    },
    {
      id: "N2",
      title: "Obat akan kadaluarsa",
      description: "Betadine 30ml kadaluarsa 25 Jul 2025",
      time: "1 jam lalu",
      type: "kadaluarsa",
      read: false,
      userId: "U01",
    },
    {
      id: "N3",
      title: "Penjualan tercatat",
      description: "INV-2025111 senilai Rp 450.000",
      time: "2 jam lalu",
      type: "penjualan",
      read: false,
      userId: "U01",
    },
    {
      id: "N4",
      title: "Stok habis",
      description: "Ibuprofen 400mg stok 0",
      time: "3 jam lalu",
      type: "stok",
      read: true,
      userId: "U01",
    },
    {
      id: "N5",
      title: "Pembaruan sistem",
      description: "Apotek Nexa berhasil diperbarui",
      time: "Kemarin",
      type: "sistem",
      read: true,
      userId: "U01",
    },
    {
      id: "N6",
      title: "Pesanan diterima",
      description: "PO-2025003 dari PT Bio Farma diterima",
      time: "Kemarin",
      type: "sistem",
      read: true,
      userId: "U01",
    },
  ];

  await db
    .insert(notifications)
    .values(notificationsData)
    .onDuplicateKeyUpdate({
      set: {
        title: sql`VALUES(title)`,
        description: sql`VALUES(description)`,
        time: sql`VALUES(time)`,
        type: sql`VALUES(type)`,
        read: sql`VALUES(read)`,
        userId: sql`VALUES(user_id)`,
      },
    });

  console.log(`    ✓ Inserted ${notificationsData.length} notifications`);
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
