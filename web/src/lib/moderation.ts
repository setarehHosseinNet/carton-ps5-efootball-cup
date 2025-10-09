// یک لیست اولیه—خودت می‌تونی کامل‌ترش کنی
const badWordsFa = [
  "احمق","خر","گاو","بیعرضه","نادان","کودن","بیکله","کثافت","لاشه","پستفطرت","دیوث","حرومزاده","لجند","بیمغز","کیر","کص","کسکش","کونی","جنده","قحبه","اشغال","کیرخر","گائیده","گاییدن","گا","گاید","کاکاسیاه","غربتی","ترکخر","لورفتاده","افغانی","عربپرست","میکشمت","خواهیخورد","گورترو","ننتو","بکنمت","لهت","خاکبرسری","ک س ک ش","ک ی ر","ک ص","گ ا","ا ح م ق","بیعرضه","پستفطرت","لاابالی","احمقی","احمقکه","احمقلا","گایید","گاییدن","گا","گائید","میگاد","گاییدمت"
];

const badWordsEn = [
  "idiot","stupid","moron","retard","dumbass","asshole","bastard","sonofabitch","bitch","douchebag","scumbag","jerk","loser","imbecile","fool","fuck","shit","dick","cock","pussy","cunt","whore","slut","blowjob","motherfucker","bollocks","wanker","nigger","nigga","porn","sex","anal","blowjob","handjob","masturbate","orgasm","penis","vagina","nigger","nigga","chink","spic","kike","gook","raghead","cracker","honky","wetback","fag","faggot","dyke","tranny","kill","die","death","murder","suicide","stab","shoot","attack","fight","hurt","destroy","burn","bomb","terrorist","rape","assault","threat","beat","punch","hit","kick","strangle","hang","damn","hell","crap","bastard","bitch","ass","bullshit","piss","bloody","bugger","screw","freaking","darn","shoot","f u c k","s h i t","a s s","b i t c h", "fuck","fucker","fucking","fucked","motherfucker"
,"shit","shitter","shitting","bullshit"
,"ass","asshole","badass","dumbass","fuk","shyt","bich","azz","fakk","sheeet", "idiot","stupid","moron","retard","dumbass","asshole","bastard",
    "fuck","shit","dick","cock","pussy","cunt","whore","slut",
    "nigger","nigga","chink","spic","kike","faggot","dyke",
    "kill","die","murder","suicide","rape","attack"

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
