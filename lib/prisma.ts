import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

export const getDb = cache(() => {
  const connectionString = process.env.DATABASE_URL ?? "";
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
});
