import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

function roundRobin(ids: number[]) {
  const arr = [...ids];
  if (arr.length % 2 === 1) arr.push(-1);
  const n = arr.length, half = n/2, rounds: {homeId:number;awayId:number}[][] = [];
  for (let r=0;r<n-1;r++){
    const round=[];
    for (let i=0;i<half;i++){
      const a=arr[i], b=arr[n-1-i];
      if (a!==-1 && b!==-1) round.push(r%2===0?{homeId:a,awayId:b}:{homeId:b,awayId:a});
    }
    rounds.push(round);
    arr.splice(1,0,arr.pop()!);
  }
  return rounds;
}

export async function POST() {
  const groups = await prisma.group.findMany({ include: { players: true }});
  for (const g of groups) {
    if (g.players.length < 2) continue;
    const rounds = roundRobin(g.players.map(p=>p.id));
    for (let w=0; w<rounds.length; w++){
      for (const p of rounds[w]) {
        const exists = await prisma.match.findFirst({ where: { groupId:g.id, homeId:p.homeId, awayId:p.awayId }});
        if (!exists) await prisma.match.create({ data: { groupId:g.id, homeId:p.homeId, awayId:p.awayId, week:w+1, status:"SCHEDULED" }});
      }
    }
  }
  revalidatePath("/fixtures"); revalidatePath("/admin");
  return NextResponse.redirect(new URL("/fixtures", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
}
