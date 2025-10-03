import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST() {
  await prisma.match.deleteMany({});
  await prisma.player.deleteMany({});
  await prisma.group.deleteMany({});
  revalidatePath("/setup"); revalidatePath("/fixtures"); revalidatePath("/groups"); revalidatePath("/admin");
  return NextResponse.redirect(new URL("/setup", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
}
