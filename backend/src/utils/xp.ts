export const XP_PER_HOUR = 20;
export const XP_PER_TOPIC = 25;
export const XP_DAILY_GOAL_BONUS = 50;
export const XP_STREAK_7_BONUS = 100;
export const XP_PER_LEVEL = 500;

export type XpSource = 'log_hours' | 'topic' | 'daily_goal' | 'streak_7';

export function xpFromHours(hours: number): number {
  return Math.round(hours * XP_PER_HOUR);
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

export function xpInCurrentLevel(xp: number): number {
  return Math.max(0, xp) % XP_PER_LEVEL;
}

const LEVEL_NAMES = [
  'Code Initiate',
  'Syntax Apprentice',
  'Component Builder',
  'Full Stack Warrior',
  'Master Architect',
];

export function levelNameFromLevel(level: number): string {
  const index = Math.min(Math.max(level, 1) - 1, LEVEL_NAMES.length - 1);
  return LEVEL_NAMES[index];
}
