import Filter from "leo-profanity";

/** فقط یکبار دیکشنری را لود کن */
let loaded = false;
function ensureLoaded() {
  if (loaded) return;
  Filter.clearList();
  Filter.loadDictionary(); // en
  // اگر خواستی کلمات فارسی خودت:
  const fa = ["کلمه-بد-مثال1","کلمه-بد-مثال2"];
  Filter.add(fa);
  loaded = true;
}

export function isClean(text: string) {
  ensureLoaded();
  return !Filter.check((text || "").toString());
}

export async function assertCleanOrThrow(fields: Record<string,string>) {
  ensureLoaded();
  for (const [key, val] of Object.entries(fields)) {
    if (!isClean(val || "")) {
      throw new Error(`فیلد «${key}» شامل کلمات نامناسب است.`);
    }
  }
}
