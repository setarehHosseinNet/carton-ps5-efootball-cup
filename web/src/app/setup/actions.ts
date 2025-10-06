// src/app/setup/actions.ts
"use server";

import { prisma } from "@/lib/db";
import { roundRobinPairs } from "@/lib/fixtures";
import { revalidatePath } from "next/cache";
import { MatchStatus } from "@prisma/client";

/** لیست اولیه گروه‌ها و بازیکن‌ها — هر وقت لازم شد ویرایش کن */
const ROSTER: Record<string, string[]> = {
  "1": ["امید امیدیان", "رضا امامی دل", "احسان شاه منصوری", "وحید ذکی مهر"],
  "2": ["بازیکن 2-1", "بازیکن 2-2", "بازیکن 2-3", "بازیکن 2-4"],
  "3": ["بازیکن 3-1", "بازیکن 3-2", "بازیکن 3-3", "بازیکن 3-4"],
  "4": ["بازیکن 4-1", "بازیکن 4-2", "بازیکن 4-3", "بازیکن 4-4"],
  "5": ["بازیکن 5-1", "بازیکن 5-2", "بازیکن 5-3", "بازیکن 5-4"],
  "6": ["بازیکن 6-1", "بازیکن 6-2", "بازیکن 6-3", "بازیکن 6-4"],
  "7": ["بازیکن 7-1", "بازیکن 7-2", "بازیکن 7-3", "بازیکن 7-4"],
  "8": ["بازیکن 8-1", "بازیکن 8-2", "بازیکن 8-3", "بازیکن 8-4"],
};

/** upsert دستی برای بازیکنان یک گروه (بدون unique کامپوزیت در DB) */
async function ensurePlayersForGroup(groupId: number, players: string[]) {
  // نرمال‌سازی و حذف تکراری‌ها
  const normalized = [...new Set(players.map((n) => n.trim()).filter(Boolean))];

  await prisma.$transaction(async (tx) => {
    for (const fullName of normalized) {
      const existing = await tx.player.findFirst({
        where: { fullName, groupId },
        select: { id: true },
      });

      if (existing) {
        // اگر لازم داری چیزی آپدیت شود، اینجا انجام بده
        // await tx.player.update({ where: { id: existing.id }, data: { dept: "..." } });
        continue;
      }

      await tx.player.create({ data: { fullName, groupId } });
    }
  });
}

/** ساخت گروه‌ها + بازیکن‌ها (دمو) */
export async function seedDemo(): Promise<void> {
  for (const [gname, players] of Object.entries(ROSTER)) {
    const group = await prisma.group.upsert({
      where: { name: gname },
      update: {},
      create: { name: gname },
    });

    await ensurePlayersForGroup(group.id, players);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/groups");
}

/** تولید همهٔ فیکسچرها (Round Robin) */
export async function generateAllFixtures(): Promise<void> {
  const groups = await prisma.group.findMany({ include: { players: true } });

  for (const g of groups) {
    if (g.players.length < 2) continue;

    const ids = g.players.map((p) => p.id);
    const rounds = roundRobinPairs(ids); // آرایه‌ای از هفته‌ها

    for (let week = 0; week < rounds.length; week++) {
      for (const p of rounds[week]) {
        // جلوگیری از تکرار؛ چون unique نداریم، دستی چک می‌کنیم
        const exist = await prisma.match.findFirst({
          where: { groupId: g.id, homeId: p.homeId, awayId: p.awayId },
          select: { id: true },
        });

        if (!exist) {
          await prisma.match.create({
            data: {
              groupId: g.id,
              homeId: p.homeId,
              awayId: p.awayId,
              week: week + 1,
              status: MatchStatus.SCHEDULED, // ✅ enum
            },
          });
        }
      }
    }
  }

  revalidatePath("/fixtures");
  revalidatePath("/admin");
}

/** پاک‌سازی کامل داده‌ها (ترتیب رعایت شده) */
export async function wipeAll(): Promise<void> {
  await prisma.$transaction([
    prisma.match.deleteMany({}),
    prisma.player.deleteMany({}),
    prisma.group.deleteMany({}),
  ]);

  revalidatePath("/setup");
  revalidatePath("/admin");
  revalidatePath("/groups");
  revalidatePath("/fixtures");
}
