"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateGroupState = { error?: string; success?: boolean };

export async function createGroupAction(
  _prevState: CreateGroupState,
  formData: FormData
): Promise<CreateGroupState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  if (!name) return { error: "نام گروه الزامی است." };

  try {
    await prisma.group.create({ data: { name } });
    revalidatePath("/admin/groups");
    revalidatePath("/groups");
    return { success: true };
  } catch (e: any) {
    // یونیک بودن name در مدل Group
    if (e?.code === "P2002") return { error: "نام گروه تکراری است." };
    return { error: "خطای غیرمنتظره." };
  }
}
