import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { DailyLog } from '../models/DailyLog';
import { User } from '../models/User';
import { computeStreak, startOfWeekMonday, toDateKey } from '../utils/stats';
import { reconcileUserGamification } from '../services/gamificationService';

// ── GET /api/daily-logs ───────────────────────────────────────────────────────

export const getDailyLogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized.' } });
      return;
    }

    const logs = await DailyLog.find({ user: req.userId }).sort({ date: -1, createdAt: -1 });

    res.status(200).json({ success: true, data: { logs } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Failed to fetch logs.' } });
  }
};

// ── POST /api/daily-logs ──────────────────────────────────────────────────────

export const createDailyLog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized.' } });
      return;
    }

    const { topic, subtopic, module, moduleColor, hours, notes, resources, tags, mood, date } = req.body;

    if (!topic || !topic.trim()) {
      res.status(400).json({ success: false, error: { message: 'Topic is required.' } });
      return;
    }
    if (!module || !module.trim()) {
      res.status(400).json({ success: false, error: { message: 'Module is required.' } });
      return;
    }
    if (!hours || hours < 0.1) {
      res.status(400).json({ success: false, error: { message: 'Hours must be at least 0.1.' } });
      return;
    }

    const log = await DailyLog.create({
      user: req.userId,
      topic: topic.trim(),
      subtopic: subtopic?.trim() || '',
      module: module.trim(),
      moduleColor: moduleColor || '#8b47f3',
      hours,
      notes: notes?.trim() || '',
      resources: Array.isArray(resources)
        ? resources
        : resources
        ? resources
            .split(',')
            .map((r: string) => r.trim())
            .filter(Boolean)
        : [],
      tags: Array.isArray(tags) ? tags : [],
      mood: mood || 4,
      date: date ? new Date(date) : new Date(),
    });

    await reconcileUserGamification(req.userId);

    res.status(201).json({ success: true, data: { log } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Failed to create log.' } });
  }
};

// ── PATCH /api/daily-logs/:id ─────────────────────────────────────────────────

export const updateDailyLog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized.' } });
      return;
    }

    const log = await DailyLog.findById(req.params.id);
    if (!log) {
      res.status(404).json({ success: false, error: { message: 'Log not found.' } });
      return;
    }

    if (log.user.toString() !== req.userId) {
      res.status(403).json({ success: false, error: { message: 'Access denied.' } });
      return;
    }

    const { topic, subtopic, module, moduleColor, hours, notes, resources, tags, mood, date } = req.body;

    if (topic !== undefined) log.topic = topic.trim();
    if (subtopic !== undefined) log.subtopic = subtopic.trim();
    if (module !== undefined) log.module = module.trim();
    if (moduleColor !== undefined) log.moduleColor = moduleColor;
    if (hours !== undefined) log.hours = hours;
    if (notes !== undefined) log.notes = notes.trim();
    if (resources !== undefined)
      log.resources = Array.isArray(resources)
        ? resources
        : resources
            .split(',')
            .map((r: string) => r.trim())
            .filter(Boolean);
    if (tags !== undefined) log.tags = Array.isArray(tags) ? tags : [];
    if (mood !== undefined) log.mood = mood;
    if (date !== undefined) log.date = new Date(date);

    await log.save();
    await reconcileUserGamification(req.userId);

    res.status(200).json({ success: true, data: { log } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Failed to update log.' } });
  }
};

// ── DELETE /api/daily-logs/:id ────────────────────────────────────────────────

export const deleteDailyLog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized.' } });
      return;
    }

    const log = await DailyLog.findById(req.params.id);
    if (!log) {
      res.status(404).json({ success: false, error: { message: 'Log not found.' } });
      return;
    }

    if (log.user.toString() !== req.userId) {
      res.status(403).json({ success: false, error: { message: 'Access denied.' } });
      return;
    }

    await log.deleteOne();
    await reconcileUserGamification(req.userId);

    res.status(200).json({ success: true, data: { message: 'Log deleted.' } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Failed to delete log.' } });
  }
};

// ── GET /api/daily-logs/stats ─────────────────────────────────────────────────

export const getStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized.' } });
      return;
    }

    const user = await User.findById(req.userId);
    const weeklyGoal = user?.weeklyGoal || 15;
    const dailyGoal = user?.todayGoal || 3;

    const logs = await DailyLog.find({ user: req.userId });

    if (logs.length === 0) {
      res.status(200).json({
        success: true,
        data: {
          totalHours: 0,
          todayHours: 0,
          currentStreak: 0,
          longestStreak: 0,
          weeklyHours: [
            { day: 'Mon', hours: 0 },
            { day: 'Tue', hours: 0 },
            { day: 'Wed', hours: 0 },
            { day: 'Thu', hours: 0 },
            { day: 'Fri', hours: 0 },
            { day: 'Sat', hours: 0 },
            { day: 'Sun', hours: 0 },
          ],
          monthlyTrend: [],
          heatmap: [],
          topicDistribution: [],
          moodDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          activeDays: 0,
          dailyGoal,
          weeklyGoal,
        },
      });
      return;
    }

    // ── Total & today hours ───────────────────────────────────────────────────
    const totalHours = Math.round(logs.reduce((s, l) => s + l.hours, 0) * 10) / 10;
    const today = toDateKey(new Date());
    const todayHours = Math.round(
      logs.filter((l) => toDateKey(new Date(l.date)) === today).reduce((s, l) => s + l.hours, 0) * 10
    ) / 10;

    // ── Streak ────────────────────────────────────────────────────────────────
    const { current: currentStreak, longest: longestStreak } = computeStreak(logs);

    // ── This week (Mon-Sun) ───────────────────────────────────────────────────
    const now = new Date();
    const monday = startOfWeekMonday(now);

    const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyMap: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weeklyMap[toDateKey(d)] = 0;
    }
    for (const log of logs) {
      const key = toDateKey(new Date(log.date));
      if (key in weeklyMap) weeklyMap[key] = (weeklyMap[key] || 0) + log.hours;
    }
    const weeklyHours = Object.entries(weeklyMap).map(([, hours], i) => ({
      day: DAY_LABELS[i],
      hours: Math.round(hours * 10) / 10,
    }));

    // ── Last 8 weeks trend ────────────────────────────────────────────────────
    const monthlyTrend: { week: string; hours: number; goal: number }[] = [];
    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(monday);
      weekStart.setDate(monday.getDate() - w * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const weekHours = logs
        .filter((l) => {
          const d = new Date(l.date);
          return d >= weekStart && d < weekEnd;
        })
        .reduce((s, l) => s + l.hours, 0);

      const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      monthlyTrend.push({
        week: label,
        hours: Math.round(weekHours * 10) / 10,
        goal: weeklyGoal,
      });
    }

    // ── Heatmap (last 53 weeks) ───────────────────────────────────────────────
    // Group hours by date string
    const hoursByDate: Record<string, number> = {};
    for (const log of logs) {
      const key = toDateKey(new Date(log.date));
      hoursByDate[key] = (hoursByDate[key] || 0) + log.hours;
    }

    // Build 53-week grid
    const heatmapStart = new Date(now);
    heatmapStart.setDate(now.getDate() - 52 * 7);
    heatmapStart.setDate(heatmapStart.getDate() - heatmapStart.getDay()); // align to Sunday

    const heatmap: { date: string; hours: number; intensity: number }[][] = [];
    for (let w = 0; w < 53; w++) {
      const week: { date: string; hours: number; intensity: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const cell = new Date(heatmapStart);
        cell.setDate(heatmapStart.getDate() + w * 7 + d);
        const key = toDateKey(cell);
        const h = hoursByDate[key] || 0;
        const intensity = h === 0 ? 0 : h < 1 ? 1 : h < 2 ? 2 : h < 4 ? 3 : 4;
        week.push({ date: key, hours: Math.round(h * 10) / 10, intensity });
      }
      heatmap.push(week);
    }

    // ── Topic (module) distribution ───────────────────────────────────────────
    const moduleMap: Record<string, { hours: number; color: string }> = {};
    for (const log of logs) {
      if (!moduleMap[log.module]) {
        moduleMap[log.module] = { hours: 0, color: log.moduleColor };
      }
      moduleMap[log.module].hours = Math.round((moduleMap[log.module].hours + log.hours) * 10) / 10;
    }
    const topicDistribution = Object.entries(moduleMap)
      .map(([name, { hours, color }]) => ({ name, hours, color }))
      .sort((a, b) => b.hours - a.hours);

    // ── Mood distribution ─────────────────────────────────────────────────────
    const moodDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const log of logs) {
      if (log.mood >= 1 && log.mood <= 5) {
        moodDistribution[log.mood]++;
      }
    }

    // ── Active days ───────────────────────────────────────────────────────────
    const activeDays = new Set(logs.map((l) => toDateKey(new Date(l.date)))).size;

    res.status(200).json({
      success: true,
      data: {
        totalHours,
        todayHours,
        currentStreak,
        longestStreak,
        weeklyHours,
        monthlyTrend,
        heatmap,
        topicDistribution,
        moodDistribution,
        activeDays,
        dailyGoal,
        weeklyGoal,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Failed to compute stats.' } });
  }
};
