"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

/* ——— helpers ——— */
function numOpt(v: FormDataEntryValue | null): number | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  if (s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}
function dateOpt(v: FormDataEntryValue | null): Date | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.valueOf()) ? undefined : d;
}
async function assertLogin(next: string) {
  const u = await getSessionUser();
  if (!u) redirect(`/login?next=${encodeURIComponent(next)}`);
}

/* ——— actions ——— */
export async function updateMatchById(id: number, form: FormData) {
  await assertLogin(`/matches/${id}/edit`);

  // select ها را به رشته گذاشته‌ایم، اینجا Number می‌گیریم
  const groupId = Number(form.get("groupId"));
  const homeId  = Number(form.get("homeId"));
  const awayId  = Number(form.get("awayId"));

  const week      = numOpt(form.get("week"));
  const homeScore = numOpt(form.get("homeScore"));
  const awayScore = numOpt(form.get("awayScore"));
  const kickoffAt = dateOpt(form.get("kickoffAt"));
  const status    = (form.get("status") as string) || "SCHEDULED";

  const data: any = {
    groupId,
    homeId,
    awayId,
    status, // enum MatchStatus
  };
  if (week !== undefined) data.week = week;
  if (homeScore !== undefined) data.homeScore = homeScore;
  if (awayScore !== undefined) data.awayScore = awayScore;
  if (kickoffAt !== undefined) data.kickoffAt = kickoffAt;

  await prisma.match.update({ where: { id }, data });

  revalidatePath("/matches");
  redirect("/matches");
}

export async function deleteMatchById(id: number) {
  await assertLogin(`/matches/${id}/edit`);
  await prisma.match.delete({ where: { id } });
  revalidatePath("/matches");
  redirect("/matches");
}
