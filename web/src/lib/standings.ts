// src/lib/standings.ts
import { prisma } from "@/lib/db";
import { MatchStatus } from "@prisma/client";

export type Row = {
  playerId: number;
  name: string;
  pld: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
};

export async function groupTable(groupName: string): Promise<Row[] | null> {
  const group = await prisma.group.findUnique({
    where: { name: groupName },
    include: {
      players: { select: { id: true, fullName: true } },
      matches: {
        where: { status: MatchStatus.DONE }, // فقط نتایج ثبت‌شده
        select: {
          homeId: true,
          awayId: true,
          homeScore: true,
          awayScore: true,
        },
        orderBy: [{ /* week ممکنه null باشد */ id: "asc" }],
      },
    },
  });

  if (!group) return null;

  const rows: Row[] = group.players.map((p) => ({
    playerId: p.id,
    name: p.fullName,
    pld: 0,
    w: 0,
    d: 0,
    l: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    pts: 0,
  }));

  const map = new Map<number, Row>(rows.map((r) => [r.playerId, r]));

  for (const m of group.matches) {
    const h = map.get(m.homeId);
    const a = map.get(m.awayId);
    if (!h || !a) continue; // ایمنی؛ نباید رخ دهد

    const hs = m.homeScore ?? 0;
    const as = m.awayScore ?? 0;

    h.pld += 1;
    a.pld += 1;

    h.gf += hs;
    h.ga += as;
    a.gf += as;
    a.ga += hs;

    if (hs > as) {
      h.w += 1;
      a.l += 1;
      h.pts += 3;
    } else if (hs < as) {
      a.w += 1;
      h.l += 1;
      a.pts += 3;
    } else {
      h.d += 1;
      a.d += 1;
      h.pts += 1;
      a.pts += 1;
    }

    h.gd = h.gf - h.ga;
    a.gd = a.gf - a.ga;
  }

  // امتیاز ↓، تفاضل ↓، گل زده ↓، سپس نام ↑ (دلخواه)
  return rows.sort(
    (x, y) =>
      y.pts - x.pts ||
      y.gd - x.gd ||
      y.gf - x.gf ||
      x.name.localeCompare(y.name)
  );
}
