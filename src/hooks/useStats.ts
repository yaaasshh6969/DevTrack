import { useState, useEffect, useCallback } from 'react';
import { logsApi } from '../services/api';
import { onProgressChanged } from '../services/progressEvents';

export interface WeeklyHourItem {
  day: string;
  hours: number;
}

export interface MonthlyTrendItem {
  week: string;
  hours: number;
  goal: number;
}

export interface HeatmapDay {
  date: string;
  hours: number;
  intensity: number;
}

export interface TopicDistributionItem {
  name: string;
  hours: number;
  color: string;
}

export interface StatsData {
  totalHours: number;
  todayHours: number;
  currentStreak: number;
  longestStreak: number;
  weeklyHours: WeeklyHourItem[];
  monthlyTrend: MonthlyTrendItem[];
  heatmap: HeatmapDay[][];
  topicDistribution: TopicDistributionItem[];
  moodDistribution: Record<number, number>;
  activeDays: number;
  dailyGoal?: number;
  weeklyGoal?: number;
}

interface UseStatsReturn {
  stats: StatsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<StatsData | null>(null);
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

    logsApi.getStats().then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        setError(res.error?.message || 'Failed to fetch learning stats.');
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { stats, loading, error, refetch };
}
