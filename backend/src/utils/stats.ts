export function toDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function startOfWeekMonday(now = new Date()): Date {
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function computeStreak(logs: { date: Date }[]): { current: number; longest: number } {
  if (logs.length === 0) return { current: 0, longest: 0 };

  const uniqueDays = [...new Set(logs.map((l) => toDateKey(new Date(l.date))))].sort((a, b) =>
    b.localeCompare(a)
  );

  const today = toDateKey(new Date());
  const yesterday = toDateKey(new Date(Date.now() - 86400000));

  let current = 0;
  let longest = 0;
  let streak = 0;
  let prevDate: string | null = null;

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
    current = 0;
  } else {
    for (const day of uniqueDays) {
      if (prevDate === null) {
        streak = 1;
      } else {
        const diff = (new Date(prevDate).getTime() - new Date(day).getTime()) / 86400000;
        if (diff === 1) {
          streak++;
        } else {
          break;
        }
      }
      prevDate = day;
    }
    current = streak;
  }

  prevDate = null;
  streak = 0;
  for (const day of uniqueDays) {
    if (prevDate === null) {
      streak = 1;
    } else {
      const diff = (new Date(prevDate).getTime() - new Date(day).getTime()) / 86400000;
      if (diff === 1) {
        streak++;
      } else {
        if (streak > longest) longest = streak;
        streak = 1;
      }
    }
    prevDate = day;
  }
  if (streak > longest) longest = streak;

  return { current, longest };
}

export function roundHours(value: number): number {
  return Math.round(value * 10) / 10;
}
