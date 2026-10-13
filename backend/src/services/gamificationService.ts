import { Types } from 'mongoose';
import { DailyLog } from '../models/DailyLog';
import { User } from '../models/User';
import { Roadmap } from '../models/Roadmap';
import { RoadmapModule } from '../models/RoadmapModule';
import { RoadmapTopic } from '../models/RoadmapTopic';
import { Badge, IBadge } from '../models/Badge';
import { UserBadge } from '../models/UserBadge';
import { XpEvent } from '../models/XpEvent';
import { computeStreak, roundHours, startOfWeekMonday, toDateKey } from '../utils/stats';
import {
  XP_DAILY_GOAL_BONUS,
  XP_PER_LEVEL,
  XP_PER_TOPIC,
  XP_STREAK_7_BONUS,
  XpSource,
  levelFromXp,
  levelNameFromLevel,
  xpFromHours,
  xpInCurrentLevel,
} from '../utils/xp';
import { seedBadges } from '../utils/seedBadges';

export interface GoalProgress {
  todayGoal: number;
  todayHours: number;
  todayPct: number;
  todayComplete: boolean;
  weeklyGoal: number;
  weeklyHours: number;
  weeklyPct: number;
  weeklyComplete: boolean;
}

export interface BadgeView {
  badgeId: string;
  name: string;
  description: string;
  emoji: string;
  requirementType: string;
  requirementValue: number;
  earned: boolean;
  earnedAt?: Date;
}

export interface GamificationSnapshot {
  xp: number;
  level: number;
  levelName: string;
  xpInLevel: number;
  xpPerLevel: number;
  xpToNext: number;
  streak: number;
  longestStreak: number;
  totalHours: number;
  completedTopics: number;
  goals: GoalProgress;
  badges: BadgeView[];
  breakdown: {
    learningHours: number;
    topics: number;
    dailyGoalBonuses: number;
    streakBonus: number;
  };
  analytics: {
    totalXp: number;
    currentLevel: number;
    daysGoalMet: number;
    activeDays: number;
    dailyGoalCompletionRate: number;
    weeklyGoalCompletionRate: number;
    badgesEarned: number;
  };
}

async function upsertEvent(
  userId: string,
  source: XpSource,
  sourceKey: string,
  amount: number
): Promise<void> {
  await XpEvent.updateOne(
    { user: userId, source, sourceKey },
    { $set: { amount } },
    { upsert: true }
  );
}

function pct(value: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
}

export async function updateUserStats(userId: string): Promise<{
  totalHours: number;
  todayHours: number;
  weeklyHours: number;
  current: number;
  longest: number;
  hoursByDate: Record<string, number>;
}> {
  const logs = await DailyLog.find({ user: userId }, { date: 1, hours: 1 });
  const totalHours = roundHours(logs.reduce((s, l) => s + l.hours, 0));
  const today = toDateKey(new Date());
  const todayHours = roundHours(
    logs.filter((l) => toDateKey(new Date(l.date)) === today).reduce((s, l) => s + l.hours, 0)
  );
  const { current, longest } = computeStreak(logs);

  const monday = startOfWeekMonday();
  const weekKeys = new Set<string>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekKeys.add(toDateKey(d));
  }
  const weeklyHours = roundHours(
    logs
      .filter((l) => weekKeys.has(toDateKey(new Date(l.date))))
      .reduce((s, l) => s + l.hours, 0)
  );

  const hoursByDate: Record<string, number> = {};
  for (const log of logs) {
    const key = toDateKey(new Date(log.date));
    hoursByDate[key] = (hoursByDate[key] || 0) + log.hours;
  }

  await User.findByIdAndUpdate(userId, {
    totalHours,
    todayHours,
    streak: current,
    longestStreak: longest,
  });

  return { totalHours, todayHours, weeklyHours, current, longest, hoursByDate };
}

async function userCompletedTopics(userId: string) {
  const roadmaps = await Roadmap.find({ user: userId }, { _id: 1 });
  const roadmapIds = roadmaps.map((r) => r._id);
  const modules = await RoadmapModule.find({ roadmap: { $in: roadmapIds } }, { _id: 1 });
  const moduleIds = modules.map((m) => m._id);
  const topics = await RoadmapTopic.find({ module: { $in: moduleIds } }, { _id: 1, complete: 1 });
  return topics.filter((t) => t.complete);
}

async function syncLogHourEvents(userId: string): Promise<void> {
  const logs = await DailyLog.find({ user: userId }, { _id: 1, hours: 1 });
  const liveKeys = new Set(logs.map((l) => l._id.toString()));

  for (const log of logs) {
    await upsertEvent(userId, 'log_hours', log._id.toString(), xpFromHours(log.hours));
  }

  const stale = await XpEvent.find({ user: userId, source: 'log_hours' });
  const toDelete = stale.filter((e) => !liveKeys.has(e.sourceKey)).map((e) => e._id);
  if (toDelete.length > 0) {
    await XpEvent.deleteMany({ _id: { $in: toDelete } });
  }
}

async function syncDailyGoalEvents(
  userId: string,
  hoursByDate: Record<string, number>,
  todayGoal: number
): Promise<void> {
  const qualifying = new Set<string>();
  for (const [dateKey, hours] of Object.entries(hoursByDate)) {
    if (hours >= todayGoal && todayGoal > 0) {
      qualifying.add(dateKey);
      await upsertEvent(userId, 'daily_goal', dateKey, XP_DAILY_GOAL_BONUS);
    }
  }

  const existing = await XpEvent.find({ user: userId, source: 'daily_goal' });
  const toDelete = existing.filter((e) => !qualifying.has(e.sourceKey)).map((e) => e._id);
  if (toDelete.length > 0) {
    await XpEvent.deleteMany({ _id: { $in: toDelete } });
  }
}

async function syncStreakEvent(userId: string, currentStreak: number): Promise<void> {
  if (currentStreak >= 7) {
    await upsertEvent(userId, 'streak_7', 'week-warrior', XP_STREAK_7_BONUS);
  } else {
    await XpEvent.deleteMany({ user: userId, source: 'streak_7' });
  }
}

async function syncTopicEvents(userId: string, completedTopics: { _id: Types.ObjectId }[]): Promise<void> {
  const liveKeys = new Set(completedTopics.map((t) => t._id.toString()));
  for (const topic of completedTopics) {
    await upsertEvent(userId, 'topic', topic._id.toString(), XP_PER_TOPIC);
  }

  const existing = await XpEvent.find({ user: userId, source: 'topic' });
  const toDelete = existing.filter((e) => !liveKeys.has(e.sourceKey)).map((e) => e._id);
  if (toDelete.length > 0) {
    await XpEvent.deleteMany({ _id: { $in: toDelete } });
  }
}

async function awardBadges(
  userId: string,
  stats: { logCount: number; totalHours: number; streak: number; completedTopics: number }
): Promise<void> {
  await seedBadges();
  const badges = await Badge.find({});
  const earned = await UserBadge.find({ user: userId });
  const earnedIds = new Set(earned.map((e) => e.badge.toString()));

  const qualifies = (badge: IBadge): boolean => {
    switch (badge.requirementType) {
      case 'logs':
        return stats.logCount >= badge.requirementValue;
      case 'hours':
        return stats.totalHours >= badge.requirementValue;
      case 'streak':
        return stats.streak >= badge.requirementValue;
      case 'topics':
        return stats.completedTopics >= badge.requirementValue;
      default:
        return false;
    }
  };

  for (const badge of badges) {
    if (earnedIds.has(badge._id.toString())) continue;
    if (!qualifies(badge)) continue;
    try {
      await UserBadge.create({ user: userId, badge: badge._id, earnedAt: new Date() });
    } catch (error: any) {
      if (error?.code !== 11000) throw error;
    }
  }
}

export async function buildGoals(userId: string): Promise<GoalProgress | null> {
  const user = await User.findById(userId);
  if (!user) return null;
  const stats = await updateUserStats(userId);
  return {
    todayGoal: user.todayGoal,
    todayHours: stats.todayHours,
    todayPct: pct(stats.todayHours, user.todayGoal),
    todayComplete: stats.todayHours >= user.todayGoal && user.todayGoal > 0,
    weeklyGoal: user.weeklyGoal,
    weeklyHours: stats.weeklyHours,
    weeklyPct: pct(stats.weeklyHours, user.weeklyGoal),
    weeklyComplete: stats.weeklyHours >= user.weeklyGoal && user.weeklyGoal > 0,
  };
}

function weeklyGoalRate(
  hoursByDate: Record<string, number>,
  weeklyGoal: number
): number {
  const monday = startOfWeekMonday();
  let weeksWithLogs = 0;
  let weeksMet = 0;

  for (let w = 7; w >= 0; w--) {
    const weekStart = new Date(monday);
    weekStart.setDate(monday.getDate() - w * 7);
    let hours = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      hours += hoursByDate[toDateKey(d)] || 0;
    }
    if (hours > 0) {
      weeksWithLogs++;
      if (hours >= weeklyGoal) weeksMet++;
    }
  }

  if (weeksWithLogs === 0) return 0;
  return Math.round((weeksMet / weeksWithLogs) * 100);
}

export async function reconcileUserGamification(userId: string): Promise<GamificationSnapshot | null> {
  const user = await User.findById(userId);
  if (!user) return null;

  const logCount = await DailyLog.countDocuments({ user: userId });
  const stats = await updateUserStats(userId);
  const completedTopics = await userCompletedTopics(userId);

  await syncLogHourEvents(userId);
  await syncDailyGoalEvents(userId, stats.hoursByDate, user.todayGoal);
  await syncStreakEvent(userId, stats.current);
  await syncTopicEvents(userId, completedTopics);

  const events = await XpEvent.find({ user: userId });
  const breakdown = {
    learningHours: 0,
    topics: 0,
    dailyGoalBonuses: 0,
    streakBonus: 0,
  };
  let xp = 0;
  for (const event of events) {
    xp += event.amount;
    if (event.source === 'log_hours') breakdown.learningHours += event.amount;
    if (event.source === 'topic') breakdown.topics += event.amount;
    if (event.source === 'daily_goal') breakdown.dailyGoalBonuses += event.amount;
    if (event.source === 'streak_7') breakdown.streakBonus += event.amount;
  }

  const level = levelFromXp(xp);
  const xpInLevel = xpInCurrentLevel(xp);
  const xpToNext = XP_PER_LEVEL - xpInLevel;
  user.xp = xp;
  user.level = level;
  user.totalHours = stats.totalHours;
  user.todayHours = stats.todayHours;
  user.streak = stats.current;
  user.longestStreak = stats.longest;
  await user.save();

  await awardBadges(userId, {
    logCount,
    totalHours: stats.totalHours,
    streak: stats.current,
    completedTopics: completedTopics.length,
  });

  const badges = await listBadgesForUser(userId);
  const activeDays = Object.keys(stats.hoursByDate).length;
  const daysGoalMet = Object.values(stats.hoursByDate).filter((h) => h >= user.todayGoal && user.todayGoal > 0).length;
  const dailyGoalCompletionRate = activeDays === 0 ? 0 : Math.round((daysGoalMet / activeDays) * 100);

  const goals: GoalProgress = {
    todayGoal: user.todayGoal,
    todayHours: stats.todayHours,
    todayPct: pct(stats.todayHours, user.todayGoal),
    todayComplete: stats.todayHours >= user.todayGoal && user.todayGoal > 0,
    weeklyGoal: user.weeklyGoal,
    weeklyHours: stats.weeklyHours,
    weeklyPct: pct(stats.weeklyHours, user.weeklyGoal),
    weeklyComplete: stats.weeklyHours >= user.weeklyGoal && user.weeklyGoal > 0,
  };

  return {
    xp,
    level,
    levelName: levelNameFromLevel(level),
    xpInLevel,
    xpPerLevel: XP_PER_LEVEL,
    xpToNext,
    streak: stats.current,
    longestStreak: stats.longest,
    totalHours: stats.totalHours,
    completedTopics: completedTopics.length,
    goals,
    badges,
    breakdown,
    analytics: {
      totalXp: xp,
      currentLevel: level,
      daysGoalMet,
      activeDays,
      dailyGoalCompletionRate,
      weeklyGoalCompletionRate: weeklyGoalRate(stats.hoursByDate, user.weeklyGoal),
      badgesEarned: badges.filter((b) => b.earned).length,
    },
  };
}

export async function listBadgesForUser(userId: string): Promise<BadgeView[]> {
  await seedBadges();
  const badges = await Badge.find({}).sort({ requirementValue: 1, name: 1 });
  const earned = await UserBadge.find({ user: userId });
  const earnedAtByBadge = new Map(earned.map((row) => [row.badge.toString(), row.earnedAt]));

  return badges.map((badge) => {
    const earnedAt = earnedAtByBadge.get(badge._id.toString());
    return {
      badgeId: badge.badgeId,
      name: badge.name,
      description: badge.description,
      emoji: badge.emoji,
      requirementType: badge.requirementType,
      requirementValue: badge.requirementValue,
      earned: Boolean(earnedAt),
      earnedAt,
    };
  });
}
