import "dotenv/config";
import { Client } from "pg";

const raw = process.env.DATABASE_URL ?? "";
const url = raw.replace(/([?&])sslmode=[^&]*/i, "$1").replace(/[?&]$/, "");
const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 45000,
});

const statements = [
  `DO $$ BEGIN
     ALTER TYPE "Status" ADD VALUE 'Scheduled';
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT;`,
  `CREATE TABLE IF NOT EXISTS "Series" (
     "id" TEXT NOT NULL,
     "ownerId" TEXT NOT NULL,
     "title" TEXT NOT NULL,
     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     CONSTRAINT "Series_pkey" PRIMARY KEY ("id"),
     CONSTRAINT "Series_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
   );`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Series_ownerId_title_key" ON "Series"("ownerId", "title");`,
  `ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "headline" TEXT;`,
  `ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "slug" TEXT;`,
  `ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "description" TEXT;`,
  `ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "coverUrl" TEXT;`,
  `ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "publishAt" TIMESTAMP(3);`,
  `ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "seriesId" TEXT;`,
  `UPDATE "Blog" b
   SET "slug" = b."title" || '-' || left(b."id", 8)
   WHERE b."slug" IS NULL
     AND EXISTS (
       SELECT 1 FROM "Blog" o
       WHERE o."title" = b."title" AND o."id" <> b."id"
     );`,
  `UPDATE "Blog" SET "slug" = "title" WHERE "slug" IS NULL;`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Blog_slug_key" ON "Blog"("slug");`,
  `DO $$ BEGIN
     ALTER TABLE "Blog"
       ADD CONSTRAINT "Blog_seriesId_fkey"
       FOREIGN KEY ("seriesId") REFERENCES "Series"("id")
       ON DELETE SET NULL ON UPDATE CASCADE;
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
];

try {
  await client.connect();
  for (const sql of statements) {
    await client.query(sql);
  }
  console.log("Story features schema ready");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
