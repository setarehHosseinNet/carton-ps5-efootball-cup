// prisma/seed.ts
/// <reference types="node" />

import { PrismaClient, MatchStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // TODO: اینجا داده‌ی اولیه‌ات را بساز/به‌روزرسانی کن
  // نمونه‌ی بی‌خطر برای تست اتصال:
  await prisma.$queryRaw`SELECT 1`;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
