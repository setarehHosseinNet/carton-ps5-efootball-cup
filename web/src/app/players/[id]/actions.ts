"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

/** ویرایش بازیکن بر اساس id */
export async function updatePlayerById(id: number, formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/players/${id}/edit`);

  const fullName = (formData.get("fullName") as string | null)?.trim() || "";
  const dept = (formData.get("dept") as string | null)?.trim() || null;
  const groupIdRaw = formData.get("groupId") as string | null;
  const groupId = groupIdRaw ? Number(groupIdRaw) : null;

  await prisma.player.update({
    where: { id },
    data: {
      fullName,
      dept,
      // اگر گروهی انتخاب نشده بود، ست نکن
      ...(groupId ? { groupId } : {}),
    },
  });

  revalidatePath("/players", "page");
  redirect("/players");
}

/** حذف بازیکن (اگر FK ارور گرفت یعنی به بازی وصل است) */
export async function deletePlayerById(id: number) {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/players/${id}/edit`);

  await prisma.player.delete({
    where: { id },
  });

  revalidatePath("/players", "page");
  redirect("/players");
}
