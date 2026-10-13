import { useState, useEffect, useCallback } from 'react';
import { logsApi } from '../services/api';
import { notifyProgressChanged, onProgressChanged } from '../services/progressEvents';

export interface DailyLogEntry {
  _id: string;
  topic: string;
  subtopic?: string;
  module: string;
  moduleColor: string;
  hours: number;
  notes?: string;
  resources: string[];
  tags: string[];
  mood: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewDailyLogInput {
  topic: string;
  subtopic?: string;
  module: string;
  moduleColor?: string;
  hours: number;
  notes?: string;
  resources?: string | string[];
  tags?: string[];
  mood?: number;
  date?: string;
}

export interface UpdateDailyLogInput {
  topic?: string;
  subtopic?: string;
  module?: string;
  moduleColor?: string;
  hours?: number;
  notes?: string;
  resources?: string | string[];
  tags?: string[];
  mood?: number;
  date?: string;
}

interface UseDailyLogsReturn {
  logs: DailyLogEntry[];
  loading: boolean;
  error: string | null;
  createLog: (input: NewDailyLogInput) => Promise<DailyLogEntry | null>;
  updateLog: (id: string, input: UpdateDailyLogInput) => Promise<DailyLogEntry | null>;
  deleteLog: (id: string) => Promise<boolean>;
  refetch: () => void;
}

export function useDailyLogs(): UseDailyLogsReturn {
  const [logs, setLogs] = useState<DailyLogEntry[]>([]);
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

    logsApi.getAll().then((res) => {
      if (cancelled) return;
      if (res.success && res.data?.logs) {
        setLogs(res.data.logs);
      } else {
        setError(res.error?.message || 'Failed to fetch logs.');
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const createLog = useCallback(async (input: NewDailyLogInput): Promise<DailyLogEntry | null> => {
    const res = await logsApi.create(input);
    if (res.success && res.data?.log) {
      const created: DailyLogEntry = res.data.log;
      setLogs((prev) => [created, ...prev]);
      notifyProgressChanged();
      return created;
    }
    setError(res.error?.message || 'Failed to create log.');
    return null;
  }, []);

  const updateLog = useCallback(
    async (id: string, input: UpdateDailyLogInput): Promise<DailyLogEntry | null> => {
      const res = await logsApi.update(id, input);
      if (res.success && res.data?.log) {
        const updated: DailyLogEntry = res.data.log;
        setLogs((prev) => prev.map((l) => (l._id === id ? updated : l)));
        notifyProgressChanged();
        return updated;
      }
      setError(res.error?.message || 'Failed to update log.');
      return null;
    },
    []
  );

  const deleteLog = useCallback(async (id: string): Promise<boolean> => {
    // Optimistic delete
    const previous = logs;
    setLogs((prev) => prev.filter((l) => l._id !== id));

    const res = await logsApi.remove(id);
    if (res.success) {
      notifyProgressChanged();
      return true;
    }
    // Revert on error
    setLogs(previous);
    setError(res.error?.message || 'Failed to delete log.');
    return false;
  }, [logs]);

  return { logs, loading, error, createLog, updateLog, deleteLog, refetch };
}
