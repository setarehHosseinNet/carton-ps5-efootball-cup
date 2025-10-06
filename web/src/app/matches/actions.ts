// src/app/matches/actions.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { MatchStatus } from "@prisma/client";

/** عدد معتبر برگردان، اگر خالی/نامعتبر بود undefined */
function numOrUndef(v: FormDataEntryValue | null): number | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

/** تاریخ معتبر برگردان، اگر خالی/نامعتبر بود undefined */
function dateOrUndef(v: FormDataEntryValue | null): Date | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** به‌روزرسانی یک بازی */
export async function updateMatch(id: number, form: FormData) {
  const homeId = Number(form.get("homeId"));
  const awayId = Number(form.get("awayId"));

  // فیلدهای اختیاری: اگر مقدار نداشتند در data نمی‌گذاریم
  const week     = numOrUndef(form.get("week"));
  const hScore   = numOrUndef(form.get("homeScore"));
  const aScore   = numOrUndef(form.get("awayScore"));
  const kickoff  = dateOrUndef(form.get("kickoffAt"));
  const status   = ((form.get("status") as string) || "SCHEDULED") as MatchStatus;

  await prisma.match.update({
    where: { id },
    data: {
      homeId,
      awayId,
      status,
      ...(week    !== undefined ? { week } : {}),
      ...(hScore  !== undefined ? { homeScore: hScore } : {}),
      ...(aScore  !== undefined ? { awayScore: aScore } : {}),
      ...(kickoff !== undefined ? { kickoffAt: kickoff } : {}),
    },
  });

  revalidatePath("/matches", "page");
  redirect("/matches");
}

/** ایجاد بازی جدید */
export async function createMatch(form: FormData) {
  const groupId = Number(form.get("groupId"));
  const homeId  = Number(form.get("homeId"));
  const awayId  = Number(form.get("awayId"));

  const week     = numOrUndef(form.get("week"));
  const hScore   = numOrUndef(form.get("homeScore"));
  const aScore   = numOrUndef(form.get("awayScore"));
  const kickoff  = dateOrUndef(form.get("kickoffAt"));
  const status   = ((form.get("status") as string) || "SCHEDULED") as MatchStatus;

  await prisma.match.create({
    data: {
      groupId,
      homeId,
      awayId,
      status,
      ...(week    !== undefined ? { week } : {}),
      ...(hScore  !== undefined ? { homeScore: hScore } : {}),
      ...(aScore  !== undefined ? { awayScore: aScore } : {}),
      ...(kickoff !== undefined ? { kickoffAt: kickoff } : {}),
    },
  });

  revalidatePath("/matches", "page");
  redirect("/matches");
}
