// web/scripts/mkadmin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = "admin";
  const password = "@dm1n147"; // بعداً عوضش کن

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    console.log("User already exists:", username);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { username, passwordHash, role: "admin" },
  });

  console.log("Admin created:", username, "password:", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
