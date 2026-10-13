import { useCallback, useEffect, useState } from 'react';
import { gamificationApi } from '../services/api';
import { onProgressChanged } from '../services/progressEvents';

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
  earnedAt?: string;
}

export interface GamificationData {
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

const EMPTY_GOALS: GoalProgress = {
  todayGoal: 3,
  todayHours: 0,
  todayPct: 0,
  todayComplete: false,
  weeklyGoal: 15,
  weeklyHours: 0,
  weeklyPct: 0,
  weeklyComplete: false,
};

export function useGamification() {
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    return onProgressChanged(refetch);
  }, [refetch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    gamificationApi.get().then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        setData(res.data as GamificationData);
      } else {
        setError(res.error?.message || 'Failed to load gamification.');
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return {
    data,
    loading,
    error,
    refetch,
    goals: data?.goals ?? EMPTY_GOALS,
    badges: data?.badges ?? [],
  };
}
