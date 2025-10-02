[System.IO.File]::WriteAllText("$PWD\prisma\seed.ts", @'
import { PrismaClient, MatchStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // گروه A
  const gA = await prisma.group.upsert({
    where: { name: "A" },
    update: {},
    create: { name: "A" },
  });

  // بازیکن‌ها
  const [p1, p2, p3, p4] = await Promise.all([
    prisma.player.upsert({
      where: { id: 1 },
      update: { fullName: "امید امیدیان", groupId: gA.id },
      create: { fullName: "امید امیدیان", groupId: gA.id },
    }),
    prisma.player.upsert({
      where: { id: 2 },
      update: { fullName: "رضا امامی دل", groupId: gA.id },
      create: { fullName: "رضا امامی دل", groupId: gA.id },
    }),
    prisma.player.upsert({
      where: { id: 3 },
      update: { fullName: "احسان شاه منصوری", groupId: gA.id },
      create: { fullName: "احسان شاه منصوری", groupId: gA.id },
    }),
    prisma.player.upsert({
      where: { id: 4 },
      update: { fullName: "وحید ذکی مهر", groupId: gA.id },
      create: { fullName: "وحید ذکی مهر", groupId: gA.id },
    }),
  ]);

  // برنامه‌ی رفت
  await prisma.match.createMany({
    data: [
      { groupId: gA.id, homeId: p1.id, awayId: p2.id, week: 1, status: MatchStatus.SCHEDULED },
      { groupId: gA.id, homeId: p3.id, awayId: p4.id, week: 1, status: MatchStatus.SCHEDULED },
      { groupId: gA.id, homeId: p1.id, awayId: p3.id, week: 2, status: MatchStatus.SCHEDULED },
      { groupId: gA.id, homeId: p2.id, awayId: p4.id, week: 2, status: MatchStatus.SCHEDULED },
    ],
    skipDuplicates: true,
  });
}

main().finally(()=>prisma.$disconnect());
'@, (New-Object System.Text.UTF8Encoding($false)))
