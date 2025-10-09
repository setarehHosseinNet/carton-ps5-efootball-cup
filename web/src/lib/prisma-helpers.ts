// src/lib/prisma-helpers.ts
export function intOrNull(v: FormDataEntryValue | null) {
  const s = (typeof v === "string") ? v.trim() : "";
  if (!s) return { set: null } as const;
  const n = Number(s);
  return Number.isFinite(n) ? n : { set: null } as const;
}

export function dateOrNull(v: FormDataEntryValue | null) {
  const s = (typeof v === "string") ? v.trim() : "";
  if (!s) return { set: null } as const;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? { set: null } as const : d;
}
