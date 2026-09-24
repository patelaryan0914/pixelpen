import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const prismaClientSingleton = () => {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }

  // `pg` treats `sslmode=require` as `verify-full`, which fails on Supabase's
  // pooler cert chain. Strip it and control TLS via `ssl` below.
  // The app uses the transaction pooler (6543). Port 5432 is session mode and
  // drops idle connections, which surfaces as "Connection terminated unexpectedly"
  // when the home feed and sidebar query at the same time. Migrations still use
  // the 5432 URL in .env.
  const connectionString = raw
    .replace(/([?&])sslmode=[^&]*/i, "$1")
    .replace(/[?&]$/, "")
    .replace("pooler.supabase.com:5432", "pooler.supabase.com:6543");

  const adapter = new PrismaPg({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    keepAlive: true,
    connectionTimeoutMillis: 20_000,
    idleTimeoutMillis: 20_000,
  });
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NEXT_ENV !== "production") globalThis.prismaGlobal = prisma;
