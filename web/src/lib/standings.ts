import { prisma } from "@/lib/db";

export type Row = {
  playerId:number; name:string;
  pld:number; w:number; d:number; l:number;
  gf:number; ga:number; gd:number; pts:number;
};

export async function groupTable(groupName:string){
  const group = await prisma.group.findUnique({
    where:{ name:groupName }, include:{ players:true, matches:true }
  });
  if(!group) return null;

  const rows: Row[] = group.players.map(p => ({
    playerId:p.id, name:p.fullName,
    pld:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0
  }));
  const map = new Map(rows.map(r => [r.playerId, r]));

  for(const m of group.matches){
    if(m.gHome == null || m.gAway == null) continue;
    const h = map.get(m.homeId)!; const a = map.get(m.awayId)!;
    h.pld++; a.pld++; h.gf+=m.gHome; h.ga+=m.gAway; a.gf+=m.gAway; a.ga+=m.gHome;
    if(m.gHome > m.gAway){ h.w++; a.l++; h.pts+=3; }
    else if(m.gHome < m.gAway){ a.w++; h.l++; a.pts+=3; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
    h.gd = h.gf - h.ga; a.gd = a.gf - a.ga;
  }
  return rows.sort((x,y)=> y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
}