import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import fs from "fs";
import path from "path";

console.log("DATABASE_URL from env:", process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Read the CA certificate
const ca = fs.readFileSync(path.join(process.cwd(), "ca.pem")).toString();
// ...existing code...

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca,
    rejectUnauthorized: false
  }
});
export const db = drizzle(pool, { schema });