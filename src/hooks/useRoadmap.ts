import { useState, useEffect, useCallback } from 'react';
import { roadmapApi } from '../services/api';
import { notifyProgressChanged, onProgressChanged } from '../services/progressEvents';

export interface RoadmapTopic {
  _id: string;
  name: string;
  complete: boolean;
  hours?: number;
  order: number;
}

export interface RoadmapModule {
  _id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  badgeColor: string;
  progress: number;
  status: 'complete' | 'in-progress' | 'locked';
  hoursSpent: number;
  estimatedHours: number;
  startDate?: string;
  completedDate?: string;
  currentFocus?: string;
  resources: string[];
  order: number;
  topics: RoadmapTopic[];
}

export interface Roadmap {
  _id: string;
  title: string;
  description: string;
  totalProgress: number;
  completedStages: number;
  totalStages: number;
  modules: RoadmapModule[];
}

interface UseRoadmapReturn {
  roadmap: Roadmap | null;
  loading: boolean;
  error: string | null;
  toggleTopic: (topicId: string, currentComplete: boolean) => Promise<void>;
  refetch: () => void;
}

export function useRoadmap(): UseRoadmapReturn {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
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

    roadmapApi.get().then((res) => {
      if (cancelled) return;
      if (res.success && res.data?.roadmap) {
        setRoadmap(res.data.roadmap);
      } else {
        setError(res.error?.message || 'Failed to load roadmap.');
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [tick]);

  const toggleTopic = useCallback(async (topicId: string, currentComplete: boolean) => {
    const newComplete = !currentComplete;

    // Optimistic update
    setRoadmap((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        modules: prev.modules.map((mod) => ({
          ...mod,
          topics: mod.topics.map((t) =>
            t._id === topicId ? { ...t, complete: newComplete } : t
          ),
        })),
      };
    });

    const res = await roadmapApi.patchTopic(topicId, newComplete);
    if (res.success && res.data) {
      notifyProgressChanged();
      // Reconcile with server-computed progress
      const { module: updatedMod, roadmap: updatedRoadmap } = res.data;
      setRoadmap((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          totalProgress: updatedRoadmap?.totalProgress ?? prev.totalProgress,
          completedStages: updatedRoadmap?.completedStages ?? prev.completedStages,
          modules: prev.modules.map((mod) => {
            if (mod._id === updatedMod?._id?.toString()) {
              return {
                ...mod,
                progress: updatedMod.progress,
                status: updatedMod.status,
              };
            }
            return mod;
          }),
        };
      });
    } else {
      // Revert on error
      setRoadmap((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          modules: prev.modules.map((mod) => ({
            ...mod,
            topics: mod.topics.map((t) =>
              t._id === topicId ? { ...t, complete: currentComplete } : t
            ),
          })),
        };
      });
    }
  }, []);

  return { roadmap, loading, error, toggleTopic, refetch };
}

