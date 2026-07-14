import { createPool } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

const pool = createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "apotek_nexa",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+07:00",
});

export const db = drizzle(pool, { schema, mode: "default" });

export async function closePool() {
  await pool.end();
}

export { schema };

export type DB = typeof db;
