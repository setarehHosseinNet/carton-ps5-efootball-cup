// src/lib/fixtures.ts
export type Pair = { homeId: number; awayId: number };

export function roundRobinPairs(playerIds: number[]): Pair[][] {
  // الگوریتم دایره‌ای برای n بازیکن (n>=2)
  const ids = [...playerIds];
  if (ids.length % 2 === 1) ids.push(-1); // bye
  const n = ids.length;
  const half = n / 2;

  const rounds: Pair[][] = [];
  for (let r = 0; r < n - 1; r++) {
    const round: Pair[] = [];
    for (let i = 0; i < half; i++) {
      const a = ids[i];
      const b = ids[n - 1 - i];
      if (a !== -1 && b !== -1) {
        // رفت: نیمه‌ی اول میزبان/میهمان برعکس می‌شود که عدالت رعایت شود
        round.push(r % 2 === 0 ? { homeId: a, awayId: b } : { homeId: b, awayId: a });
      }
    }
    rounds.push(round);
    // rotate (به جز اولین عنصر)
    ids.splice(1, 0, ids.pop()!);
  }
  return rounds;
}
