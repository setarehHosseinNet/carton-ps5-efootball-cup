"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

/** ایجاد بازیکن */
export async function createPlayer(form: FormData) {
  await requireAdmin("/players/new");

  const name = (form.get("name") as string | null)?.trim() ?? "";
  if (!name) return;

  await prisma.player.create({ data: { fullName: name } }); // ← فیلدها را با اسکیما خودت هماهنگ کن
  revalidatePath("/players", "page");
  redirect("/players");
}

/** ویرایش بازیکن */
export async function updatePlayer(id: number, form: FormData) {
  await requireAdmin(`/players/${id}/edit`);

  const name = (form.get("name") as string | null)?.trim() ?? "";
  if (!name) return;

  await prisma.player.update({
    where: { id },
    data: { fullName: name }, // ← فیلدها را با اسکیما خودت هماهنگ کن
  });

  revalidatePath("/players", "page");
  redirect("/players");
}

/** حذف بازیکن */
export async function deletePlayer(id: number) {
  await requireAdmin(`/players/${id}/edit`);
  await prisma.player.delete({ where: { id } });
  revalidatePath("/players", "page");
  redirect("/players");
}
