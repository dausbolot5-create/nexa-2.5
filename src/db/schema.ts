import {
  mysqlTable,
  varchar,
  int,
  decimal,
  boolean,
  timestamp,
  text,
  datetime,
  date,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

export const medicines = mysqlTable("medicines", {
  id: varchar("id", { length: 36 }).primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(),
  price: int("price").notNull(),
  cost: int("cost").notNull(),
  stock: int("stock").notNull().default(0),
  minStock: int("min_stock").notNull().default(10),
  expiry: date("expiry").notNull(),
  supplierId: varchar("supplier_id", { length: 36 }).notNull(),
  location: varchar("location", { length: 50 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

export const suppliers = mysqlTable("suppliers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  contact: varchar("contact", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  address: varchar("address", { length: 200 }).notNull(),
  city: varchar("city", { length: 50 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

export const customers = mysqlTable("customers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 100 }),
  points: int("points").notNull().default(0),
  isMember: boolean("is_member").notNull().default(false),
  totalSpent: int("total_spent").notNull().default(0),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

export const sales = mysqlTable("sales", {
  id: varchar("id", { length: 36 }).primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  date: date("date").notNull(),
  cashierId: varchar("cashier_id", { length: 36 }).notNull(),
  customerId: varchar("customer_id", { length: 36 }),
  itemsCount: int("items_count").notNull(),
  total: int("total").notNull(),
  method: varchar("method", { length: 20 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const saleItems = mysqlTable("sale_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  saleId: varchar("sale_id", { length: 36 }).notNull(),
  medicineId: varchar("medicine_id", { length: 36 }).notNull(),
  qty: int("qty").notNull(),
  price: int("price").notNull(),
  subtotal: int("subtotal").notNull(),
});

export const purchases = mysqlTable("purchases", {
  id: varchar("id", { length: 36 }).primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  supplierId: varchar("supplier_id", { length: 36 }).notNull(),
  date: date("date").notNull(),
  itemsCount: int("items_count").notNull(),
  total: int("total").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

export const purchaseItems = mysqlTable("purchase_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  purchaseId: varchar("purchase_id", { length: 36 }).notNull(),
  medicineId: varchar("medicine_id", { length: 36 }).notNull(),
  qty: int("qty").notNull(),
  cost: int("cost").notNull(),
  subtotal: int("subtotal").notNull(),
});

export const prescriptions = mysqlTable("prescriptions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  patientName: varchar("patient_name", { length: 100 }).notNull(),
  doctorName: varchar("doctor_name", { length: 100 }).notNull(),
  date: date("date").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  itemsCount: int("items_count").notNull(),
  total: int("total").notNull(),
  patientId: varchar("patient_id", { length: 36 }),
  doctorId: varchar("doctor_id", { length: 36 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

export const prescriptionItems = mysqlTable("prescription_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  prescriptionId: varchar("prescription_id", { length: 36 }).notNull(),
  medicineId: varchar("medicine_id", { length: 36 }).notNull(),
  qty: int("qty").notNull(),
  dosage: varchar("dosage", { length: 100 }),
  notes: text("notes"),
});

export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  time: varchar("time", { length: 50 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  isRead: boolean("is_read").notNull().default(false),
  userId: varchar("user_id", { length: 36 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  tokenHash: varchar("token_hash", { length: 255 }).notNull(),
  expiresAt: datetime("expires_at").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Medicine = typeof medicines.$inferSelect;
export type NewMedicine = typeof medicines.$inferInsert;
export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Sale = typeof sales.$inferSelect;
export type NewSale = typeof sales.$inferInsert;
export type SaleItem = typeof saleItems.$inferSelect;
export type NewSaleItem = typeof saleItems.$inferInsert;
export type Purchase = typeof purchases.$inferSelect;
export type NewPurchase = typeof purchases.$inferInsert;
export type PurchaseItem = typeof purchaseItems.$inferSelect;
export type NewPurchaseItem = typeof purchaseItems.$inferInsert;
export type Prescription = typeof prescriptions.$inferSelect;
export type NewPrescription = typeof prescriptions.$inferInsert;
export type PrescriptionItem = typeof prescriptionItems.$inferSelect;
export type NewPrescriptionItem = typeof prescriptionItems.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
