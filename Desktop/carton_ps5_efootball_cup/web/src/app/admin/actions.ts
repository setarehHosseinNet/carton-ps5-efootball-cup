"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveResult(formData: FormData) {
  const matchId = Number(formData.get("matchId"));
  const gHome = Number(formData.get("gHome"));
  const gAway = Number(formData.get("gAway"));
  if (!Number.isFinite(matchId) || !Number.isFinite(gHome) || !Number.isFinite(gAway)) {
    return { ok:false, message:"bad input" };
  }
  await prisma.match.update({ where:{ id:matchId }, data:{ gHome, gAway, status:"DONE" }});
  revalidatePath("/admin");
  revalidatePath("/groups");
  return { ok:true };
}