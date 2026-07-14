import { config } from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { migrate } from "drizzle-orm/mysql2/migrator";

config({ path: ".env" });

async function runMigrate() {
  console.log("🔄 Running database migrations...");

  const pool = createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "apotek_nexa",
    waitForConnections: true,
    connectionLimit: 10,
  });

  const db = drizzle(pool);

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigrate().catch(() => process.exit(1));
