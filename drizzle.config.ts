import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: "localhost",
    port: 3306,
    user: "root",
    database: "apotek_nexa",
  },
  verbose: true,
  strict: true,
});
