// src/app/setup/actions.ts
"use server";

import { prisma } from "@/lib/db";
import { roundRobinPairs } from "@/lib/fixtures";
import { revalidatePath } from "next/cache";

/** لیست اولیه گروه‌ها و بازیکن‌ها — اینجا راحت نام‌ها را مطابق پوستر ویرایش کن */
const ROSTER: Record<string, string[]> = {
  "1": ["امید امیدیان", "رضا امامی دل", "احسان شاه منصوری", "وحید ذکی مهر"],
  "2": ["بازیکن 2-1", "بازیکن 2-2", "بازیکن 2-3", "بازیکن 2-4"],
  "3": ["بازیکن 3-1", "بازیکن 3-2", "بازیکن 3-3", "بازیکن 3-4"],
  "4": ["بازیکن 4-1", "بازیکن 4-2", "بازیکن 4-3", "بازیکن 4-4"],
  "5": ["بازیکن 5-1", "بازیکن 5-2", "بازیکن 5-3", "بازیکن 5-4"],
  "6": ["بازیکن 6-1", "بازیکن 6-2", "بازیکن 6-3", "بازیکن 6-4"],
  "7": ["بازیکن 7-1", "بازیکن 7-2", "بازیکن 7-3", "بازیکن 7-4"],
  "8": ["بازیکن 8-1", "بازیکن 8-2", "بازیکن 8-3", "بازیکن 8-4"]
};

export async function seedDemo() {
  // گروه‌ها و بازیکن‌ها
  for (const [gname, players] of Object.entries(ROSTER)) {
    const g = await prisma.group.upsert({
      where: { name: gname },
      update: {},
      create: { name: gname }
    });
    for (const fullName of players) {
      await prisma.player.upsert({
        where: { fullName_groupId: { fullName, groupId: g.id } }, // نیاز به unique ترکیبی دارد، پایین یادداشت می‌کنم
        update: {},
        create: { fullName, groupId: g.id }
      }).catch(async () => {
        // اگر ایندکس ترکیبی را نداشتی، با find/create جلو برو
        const exist = await prisma.player.findFirst({ where: { fullName, groupId: g.id } });
        if (!exist) await prisma.player.create({ data: { fullName, groupId: g.id } });
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/groups");
  return { ok: true };
}

export async function generateAllFixtures() {
  const groups = await prisma.group.findMany({ include: { players: true } });

  for (const g of groups) {
    if (g.players.length < 2) continue;
    const ids = g.players.map(p => p.id);
    const rounds = roundRobinPairs(ids); // آرایه‌ای از هفته‌ها

    for (let week = 0; week < rounds.length; week++) {
      for (const p of rounds[week]) {
        // اگر همین بازی قبلاً ساخته شده، رد شو
        const exist = await prisma.match.findFirst({
          where: { groupId: g.id, homeId: p.homeId, awayId: p.awayId }
        });
        if (!exist) {
          await prisma.match.create({
            data: {
              groupId: g.id,
              homeId: p.homeId,
              awayId: p.awayId,
              week: week + 1,
              status: "SCHEDULED"
            }
          });
        }
      }
    }
  }

  revalidatePath("/fixtures");
  revalidatePath("/admin");
  return { ok: true };
}

export async function wipeAll() {
  await prisma.match.deleteMany({});
  await prisma.player.deleteMany({});
  await prisma.group.deleteMany({});
  revalidatePath("/setup");
  revalidatePath("/admin");
  revalidatePath("/groups");
  revalidatePath("/fixtures");
  return { ok: true };
}
