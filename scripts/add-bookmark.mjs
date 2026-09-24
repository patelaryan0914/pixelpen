import "dotenv/config";
import { Client } from "pg";

const raw = process.env.DATABASE_URL ?? "";
const url = raw.replace(/([?&])sslmode=[^&]*/i, "$1").replace(/[?&]$/, "");
const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 45000,
});

const sql = `
CREATE TABLE IF NOT EXISTS "Bookmark" (
  "id" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "blogId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Bookmark_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Bookmark_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Bookmark_ownerId_blogId_key" ON "Bookmark"("ownerId", "blogId");
`;

try {
  await client.connect();
  await client.query(sql);
  console.log("Bookmark table ready");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
