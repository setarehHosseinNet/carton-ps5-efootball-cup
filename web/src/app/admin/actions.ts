"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { MatchStatus } from "@prisma/client";

/** عدد صحیح معتبر از FormData بگیر */
function toInt(value: FormDataEntryValue | null): number {
  if (value == null) return NaN;
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : NaN;
}

export async function saveResult(formData: FormData) {
  const matchId = toInt(formData.get("matchId"));
  // نام فیلدهای فرم هنوز gHome/gAway است، اما در Prisma: homeScore/awayScore
  const home = toInt(formData.get("gHome"));
  const away = toInt(formData.get("gAway"));

  if (!Number.isFinite(matchId) || !Number.isFinite(home) || !Number.isFinite(away)) {
    return { ok: false, message: "bad input" as const };
  }

  try {
    await prisma.match.update({
      where: { id: matchId },
      data: {
        homeScore: home,
        awayScore: away,
        status: MatchStatus.DONE, // به‌جای رشته‌ی "DONE"
      },
    });
  } catch (err) {
    // اگر رکوردی پیدا نشه یا ولیدیشن دیتابیس بخوره، اینجا هندل میشه
    return { ok: false, message: "update failed" as const };
  }

  // صفحات مرتبط را ری‌ولیدیت کن
  revalidatePath("/admin");
  revalidatePath("/groups");

  return { ok: true as const };
}
