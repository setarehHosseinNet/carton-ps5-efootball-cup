import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/** نام‌ها را با پوستر واقعی جایگزین کن */
const ROSTER: Record<string, string[]> = {
  "1": ["امید امیدیان", "رضا امامی دل", "احسان شاه منصوری", "وحید ذکی مهر"],
  "2": ["محمد سونتی", "علی رحیمی", "کریم شاه آبادی", "هادی پیزان زاده"],
  "3": ["مهرداد تایب", "نیما کیا فُر", "طاها یویه", "محمد آزاد دل"],
  "4": ["سجاد یوسفی", "ابوالفضل زدائی", "مهدی اسحاقی", "محمد مهدی پور اکبری"],
  "5": ["علی فتاحی", "محمد خسروتاج", "حسین چرم بر", "داوود میبن فر"],
  "6": ["دانیا کروبی", "مجتبی پور انصاری", "ابراهیم دبدی", "معین بخشیاری"],
  "7": ["محمدحسین بنی‌نجار", "محمد عابدینی", "هادی سلیمانی", "علی پیش‌بهار"],
  "8": ["مرتضی رحم‌نژاد", "عارف‌رضا بوچه", "مهدی ملیجی", "مرتضی کارساز"]
};

export async function POST() {
  for (const [name, players] of Object.entries(ROSTER)) {
    const g = await prisma.group.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    for (const fullName of players) {
      const exists = await prisma.player.findFirst({ where: { fullName, groupId: g.id }});
      if (!exists) await prisma.player.create({ data: { fullName, groupId: g.id }});
    }
  }
  revalidatePath("/setup"); revalidatePath("/admin"); revalidatePath("/groups");
  return NextResponse.redirect(new URL("/setup", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
}
