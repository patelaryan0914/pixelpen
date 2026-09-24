import "dotenv/config";
import { Client } from "pg";

const raw = process.env.DATABASE_URL ?? "";
const url = raw.replace(/([?&])sslmode=[^&]*/i, "$1").replace(/[?&]$/, "");

const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

try {
  await client.connect();
  const res = await client.query(
    "select table_name from information_schema.tables where table_schema = 'public' order by table_name"
  );
  console.log(
    "Tables:",
    res.rows.map((r) => r.table_name).join(", ") || "(none)"
  );
} catch (e) {
  console.error("FAILED:", e.code || "", e.message);
} finally {
  await client.end().catch(() => {});
}
