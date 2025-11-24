import "../config/env";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required for the API server");
}

const sslValue = (process.env.DB_SSL ?? "").toLowerCase();
const shouldUseSsl = sslValue === "true" || sslValue === "1";

export const pgPool = new Pool({
  connectionString: databaseUrl,
  ssl: shouldUseSsl
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
});
