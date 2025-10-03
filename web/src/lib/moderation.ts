// یک لیست اولیه—خودت می‌تونی کامل‌ترش کنی
const badWordsFa = [
  "کلمه‌بد۱", "کلمه‌بد۲", "فحش۱", "فحش۲" // ← خودت لیست واقعی‌ات را جایگزین کن
];

const badWordsEn = [
  "badword1","badword2","insult1","insult2"
];

const wordList = new Set([...badWordsFa, ...badWordsEn].map(w => w.toLowerCase()));

export function containsProfanity(text: string): string[] {
  const normalized = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " "); // حذف علائم

  const hits = new Set<string>();
  for (const token of normalized.split(/\s+/)) {
    if (!token) continue;
    if (wordList.has(token)) hits.add(token);
  }
  return [...hits];
}

export function assertCleanOrThrow(...fields: Array<[string, string]>) {
  const found: Array<{field: string; hits: string[]}> = [];
  for (const [name, val] of fields) {
    const hits = containsProfanity(val || "");
    if (hits.length) found.push({ field: name, hits });
  }
  if (found.length) {
    const msg = found
      .map(f => `${f.field}: ${f.hits.join(", ")}`)
      .join(" | ");
    throw new Error("متن حاوی واژگان نامناسب است: " + msg);
  }
}
