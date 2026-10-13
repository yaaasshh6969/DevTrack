import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../hooks/useRoadmap';
import { useDailyLogs } from '../hooks/useDailyLogs';
import { useStats, HeatmapDay } from '../hooks/useStats';
import { useGamification } from '../hooks/useGamification';
import {
  FlameIcon, ClockIcon, TrendUpIcon, CheckCircleIcon, PlusIcon, ChevronRightIcon,
} from '../components/ui/icons';
import { CompanionCard, SakuraPetals } from '../components/ui/WaifuCompanion';

function getHeatColor(intensity: number): string {
  const colors = ['#f1f5f9', '#e0e7ff', '#c7d2fe', '#818cf8', '#6366f1'];
  return colors[Math.min(intensity, 4)];
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getMonthLabels(weeks: HeatmapDay[][]): { label: string; weekIndex: number }[] {
  const seen = new Set<string>();
  const labels: { label: string; weekIndex: number }[] = [];
  weeks.forEach((week, wi) => {
    if (!week || week.length === 0) return;
    const d = new Date(week[0].date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!seen.has(key)) {
      seen.add(key);
      if (wi > 0) labels.push({ label: d.toLocaleDateString('en-US', { month: 'short' }), weekIndex: wi });
    }
  });
  return labels;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3.5 py-2.5 rounded-[10px] text-[12px] font-bold"
      style={{
        background: '#ffffff',
        border: '2px solid #7c3aed',
        color: '#0f172a',
        boxShadow: '3px 3px 0px #7c3aed',
      }}
    >
      <p style={{ color: '#475569' }}>{label}</p>
      <p className="mt-0.5">
        <span style={{ color: '#7c3aed' }}>{payload[0].value}h</span> learned
      </p>
    </div>
  );
}

interface StatTileProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent?: string;
  progress?: number;
}

function StatTile({ label, value, sub, icon, accent = '#7c3aed', progress }: StatTileProps) {
  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span
          className="text-[11px] font-extrabold uppercase tracking-widest font-display"
          style={{ color: '#64748b' }}
        >
          {label}
        </span>
        <span
          className="p-2 rounded-[8px]"
          style={{ background: `${accent}14`, color: accent, border: `1.5px solid ${accent}30` }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p
          className="text-[26px] sm:text-[30px] font-black leading-none font-mono tracking-tight"
          style={{ color: accent }}
        >
          {value}
        </p>
        {progress !== undefined ? (
          <div className="mt-2.5">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, progress)}%`, background: accent }}
              />
            </div>
            <p className="mt-1.5 text-[11.5px] font-semibold" style={{ color: '#64748b' }}>
              {sub}
            </p>
          </div>
        ) : (
          <p className="mt-1.5 text-[11.5px] font-semibold" style={{ color: '#64748b' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

interface Props {
  onNavigate?: (page: string) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roadmap } = useRoadmap();
  const { logs } = useDailyLogs();
  const { stats } = useStats();
  const { data: game, goals, badges: apiBadges } = useGamification();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onNavigate) onNavigate(path);
  };

  // Real stats
  const totalHours = stats?.totalHours ?? user?.totalHours ?? 0;
  const streak = stats?.currentStreak ?? user?.streak ?? 0;
  const longestStreak = stats?.longestStreak ?? user?.longestStreak ?? 0;
  const roadmapCompletion = roadmap?.totalProgress ?? user?.roadmapCompletion ?? 0;
  const todayGoal = goals.todayGoal || user?.todayGoal || 3;
  const weeklyGoal = goals.weeklyGoal || user?.weeklyGoal || 15;

  const todayKey = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter((l) => l.date.split('T')[0] === todayKey);
  const todayHours = goals.todayHours || stats?.todayHours || todayLogs.reduce((s, l) => s + l.hours, 0);
  const todayPct = goals.todayPct || Math.min(100, Math.round((todayHours / todayGoal) * 100));

  const weeklyData = stats?.weeklyHours && stats.weeklyHours.length === 7
    ? stats.weeklyHours
    : [
        { day: 'Mon', hours: 0 },
        { day: 'Tue', hours: 0 },
        { day: 'Wed', hours: 0 },
        { day: 'Thu', hours: 0 },
        { day: 'Fri', hours: 0 },
        { day: 'Sat', hours: 0 },
        { day: 'Sun', hours: 0 },
      ];

  const weekTotal = goals.weeklyHours || weeklyData.reduce((s, d) => s + d.hours, 0);
  const weeklyPct = goals.weeklyPct || Math.min(100, Math.round((weekTotal / weeklyGoal) * 100));
  const bestDayHours = Math.max(...weeklyData.map((d) => d.hours), 0);
  const dailyAvg = weekTotal > 0 ? (weekTotal / 7).toFixed(1) : '0.0';

  const heatmap = stats?.heatmap || [];
  const monthLabels = getMonthLabels(heatmap);

  const modules = roadmap?.modules || [];
  const currentModule =
    modules.find((m) => m.name === user?.currentModule && m.status === 'in-progress') ||
    modules.find((m) => m.status === 'in-progress') ||
    modules[0];

  // Dynamic Gamification
  const xp = game?.xp ?? Math.round(totalHours * 60 + streak * 100);
  const level = game?.level ?? Math.floor(xp / 1000) + 1;
  const xpToNext = game?.xpToNext ?? (1000 - (xp % 1000));
  const levelNames = ['Code Initiate', 'Syntax Apprentice', 'Component Builder', 'Full Stack Warrior', 'Master Architect'];
  const levelName = game?.levelName ?? levelNames[Math.min(level - 1, levelNames.length - 1)];

  const localBadges = [
    { id: 'first-log', name: 'First Step', emoji: '🚀', earned: logs.length > 0, xp: 100 },
    { id: 'streak-7', name: '7 Day Streak', emoji: '🔥', earned: streak >= 7, xp: 200 },
    {
      id: 'html-master',
      name: 'HTML Master',
      emoji: '🌐',
      earned: modules.some((m) => m.name.toLowerCase().includes('html') && m.progress === 100),
      xp: 300,
    },
    {
      id: 'js-explorer',
      name: 'JS Explorer',
      emoji: '⚡',
      earned: modules.some((m) => m.name.toLowerCase().includes('javascript') && m.progress > 0),
      xp: 400,
    },
    {
      id: 'react-padawan',
      name: 'React Padawan',
      emoji: '⚛️',
      earned: modules.some((m) => m.name.toLowerCase().includes('react') && m.progress > 0),
      xp: 500,
    },
    { id: '100-hours', name: '100 Hour Club', emoji: '💎', earned: totalHours >= 100, xp: 600 },
  ];

  const badges = apiBadges && apiBadges.length > 0
    ? apiBadges.map((b) => ({
        id: b.badgeId,
        name: b.name,
        emoji: b.emoji,
        earned: b.earned,
        xp: (b.requirementValue || 10) * 10,
      }))
    : localBadges;

  const firstName = user?.name ? user.name.split(' ')[0] : 'Developer';
  const companionMessage =
    logs.length === 0
      ? `Welcome to DevTrack, ${firstName}! I'm Aria, your AI Learning Architect. Log your first learning session to start your streak!`
      : streak > 1
      ? `Awesome momentum, ${firstName}! You're on a ${streak}-day learning streak. Keep it going!`
      : `Welcome back, ${firstName}! Ready for another great study session today?`;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <SakuraPetals />

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 flex-wrap relative z-10">
        <div>
          <p className="text-[12px] font-bold mb-0.5 uppercase tracking-wide" style={{ color: '#64748b' }}>
            {todayFormatted}
          </p>
          <h1
            className="text-[26px] sm:text-[30px] font-black tracking-tight font-display"
            style={{ color: '#0f172a' }}
          >
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1 text-[14px] font-medium flex items-center gap-2" style={{ color: '#475569' }}>
            <span className="inline-flex items-center gap-1 font-bold streak-flame" style={{ color: '#059669' }}>
              <FlameIcon size={14} />
              {streak}-day streak
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            {currentModule ? `${currentModule.name} in progress` : 'Full-stack path'}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleNavigate('/ai-coach')}
            className="px-4 py-2.5 rounded-[10px] text-[13px] font-extrabold transition-all cursor-pointer shadow-sm hover:shadow-md"
            style={{ background: '#ffe4e6', color: '#e11d48', border: '2px solid #fda4af' }}
          >
            Chat with Aria
          </button>
          <button
            onClick={() => handleNavigate('/daily-log')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13.5px] font-extrabold transition-all cursor-pointer card-pop"
            style={{ background: '#7c3aed', color: 'white', border: '2px solid #6d28d9' }}
          >
            <PlusIcon size={16} />
            Log Learning
          </button>
        </div>
      </div>

      {/* ── Stat Tiles ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <StatTile
          label="Streak"
          value={`${streak}d`}
          sub={`Best: ${longestStreak}d`}
          icon={<FlameIcon size={16} />}
          accent="#059669"
        />
        <StatTile
          label="Today"
          value={`${todayHours.toFixed(1)}h`}
          sub={`${todayPct}% of ${todayGoal}h goal`}
          icon={<CheckCircleIcon size={16} />}
          accent={todayPct >= 100 ? '#059669' : '#7c3aed'}
          progress={todayPct}
        />
        <StatTile
          label="Roadmap"
          value={`${roadmapCompletion}%`}
          sub="HTML → MongoDB"
          icon={<TrendUpIcon size={16} />}
          accent="#0284c7"
          progress={roadmapCompletion}
        />
        <StatTile
          label="Total Hours"
          value={`${Math.floor(totalHours)}`}
          sub={`${weekTotal.toFixed(1)}h this week`}
          icon={<ClockIcon size={16} />}
          accent="#a855f7"
        />
      </div>

      {/* ── Aria Companion + Achievements ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10">
        <div className="lg:col-span-2">
          <CompanionCard
            message={companionMessage}
            xp={xp}
            xpToNext={xpToNext}
            level={level}
            levelName={levelName}
            badges={badges}
          />
        </div>
        {/* Achievements */}
        <div className="card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-extrabold font-display" style={{ color: '#0f172a' }}>
              Achievements
            </h3>
            <span
              className="text-[12px] font-bold font-mono px-2 py-0.5 rounded-[6px]"
              style={{ background: '#f1f5f9', color: '#475569' }}
            >
              {badges.filter((b) => b.earned).length}/{badges.length}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {badges.map((b) => (
              <div
                key={b.id}
                className="flex flex-col items-center gap-1.5 cursor-default p-2 rounded-[10px] transition-all"
                style={{
                  background: b.earned ? '#f3e8ff' : '#f8fafc',
                  border: `1.5px solid ${b.earned ? '#d8b4fe' : '#e2e8f0'}`,
                }}
                title={`${b.name}${b.earned ? ` · +${b.xp} XP` : ' · Locked'}`}
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px]"
                  style={{
                    filter: b.earned ? 'none' : 'grayscale(1) opacity(0.35)',
                  }}
                >
                  {b.emoji}
                </div>
                <span
                  className="text-[10.5px] font-bold text-center leading-tight font-display"
                  style={{ color: b.earned ? '#7c3aed' : '#94a3b8' }}
                >
                  {b.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-3 flex items-center justify-between" style={{ borderTop: '2px solid #f1f5f9' }}>
            <span className="text-[12px] font-bold" style={{ color: '#64748b' }}>
              {badges.filter((b) => b.earned).reduce((s, b) => s + b.xp, 0)} XP earned
            </span>
            <button
              onClick={() => handleNavigate('/analytics')}
              className="text-[12px] font-extrabold flex items-center gap-1 transition-opacity hover:opacity-80 cursor-pointer"
              style={{ color: '#7c3aed' }}
            >
              Stats <ChevronRightIcon size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Weekly Chart + Quick stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-[15px] font-extrabold font-display" style={{ color: '#0f172a' }}>
                This Week
              </h2>
              <p className="text-[12.5px] font-medium mt-0.5" style={{ color: '#64748b' }}>
                {weekTotal.toFixed(1)}h of {weeklyGoal}h goal
              </p>
            </div>
            <span
              className="px-3 py-1 rounded-full text-[11.5px] font-extrabold"
              style={{
                background: weekTotal >= weeklyGoal ? '#d1fae5' : '#f3e8ff',
                color: weekTotal >= weeklyGoal ? '#059669' : '#7c3aed',
                border: `1.5px solid ${weekTotal >= weeklyGoal ? '#6ee7b7' : '#d8b4fe'}`,
              }}
            >
              {Math.round((weekTotal / weeklyGoal) * 100)}% of goal
            </span>
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }}
                  width={26}
                  tickFormatter={(v) => `${v}h`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(124,58,237,0.06)' }} />
                <Bar dataKey="hours" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              label: 'Best day',
              value: `${bestDayHours.toFixed(1)}h`,
              note: bestDayHours > 0 ? 'Peak study session' : 'Ready to start',
              accent: '#7c3aed',
            },
            {
              label: 'Daily avg',
              value: `${dailyAvg}h`,
              note: weekTotal > 0 ? 'This week average' : 'Start logging today',
              accent: '#059669',
            },
            {
              label: 'Sessions',
              value: logs.length.toString(),
              note: 'Total logged',
              accent: '#0284c7',
            },
          ].map((s) => (
            <div key={s.label} className="card p-4 flex-1 flex flex-col justify-between min-h-0">
              <span
                className="text-[10.5px] font-extrabold uppercase tracking-widest font-display"
                style={{ color: '#64748b' }}
              >
                {s.label}
              </span>
              <div>
                <span className="text-[24px] font-black font-mono tracking-tight" style={{ color: s.accent }}>
                  {s.value}
                </span>
                <p className="text-[11.5px] font-semibold mt-0.5" style={{ color: '#64748b' }}>
                  {s.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Heatmap ── */}
      <div className="card p-5 relative z-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-[15px] font-extrabold font-display" style={{ color: '#0f172a' }}>
              Learning Consistency
            </h2>
            <p className="text-[12.5px] font-medium mt-0.5" style={{ color: '#64748b' }}>
              Last 12 months • {totalHours.toFixed(1)}h total
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold" style={{ color: '#64748b' }}>
              Less
            </span>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[11px] h-[11px] rounded-[3px]"
                style={{ background: getHeatColor(i), border: '1px solid #cbd5e1' }}
              />
            ))}
            <span className="text-[11px] font-bold" style={{ color: '#64748b' }}>
              More
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-fit">
            <div className="flex mb-1">
              {heatmap.map((_, wi) => {
                const ml = monthLabels.find((m) => m.weekIndex === wi);
                return (
                  <div key={wi} className="shrink-0" style={{ width: 12, marginRight: 2 }}>
                    {ml && (
                      <span className="text-[9.5px] font-bold whitespace-nowrap" style={{ color: '#64748b' }}>
                        {ml.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-[2px]">
              {heatmap.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className="heatmap-cell w-[11px] h-[11px] rounded-[3px] cursor-default"
                      style={{ background: getHeatColor(day.intensity), border: '1px solid #cbd5e1' }}
                      title={
                        day.hours > 0
                          ? `${formatShortDate(day.date)}: ${day.hours}h`
                          : formatShortDate(day.date)
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Roadmap preview + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 relative z-10">
        {/* Roadmap */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-extrabold font-display" style={{ color: '#0f172a' }}>
              Your Path
            </h2>
            <button
              onClick={() => handleNavigate('/roadmap')}
              className="flex items-center gap-1 text-[12px] font-extrabold transition-opacity hover:opacity-80 cursor-pointer"
              style={{ color: '#7c3aed' }}
            >
              Full roadmap <ChevronRightIcon size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {modules.map((item) => {
              const isLocked = item.status === 'locked';
              const isDone = item.status === 'complete';
              const isCurrent = item.status === 'in-progress';
              return (
                <div key={item._id} style={{ opacity: isLocked ? 0.45 : 1 }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {isDone ? (
                        <CheckCircleIcon size={14} className="text-[#059669]" />
                      ) : (
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            background: isCurrent ? item.color : '#94a3b8',
                            boxShadow: isCurrent ? `0 0 6px ${item.color}` : 'none',
                          }}
                        />
                      )}
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: isDone ? '#64748b' : isCurrent ? '#0f172a' : '#64748b' }}
                      >
                        {item.name}
                      </span>
                      {isCurrent && (
                        <span
                          className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide badge-cartoon"
                          style={{ background: '#f3e8ff', color: '#7c3aed', border: '1px solid #d8b4fe' }}
                        >
                          Now
                        </span>
                      )}
                    </div>
                    <span
                      className="text-[11.5px] font-extrabold font-mono"
                      style={{ color: isDone ? '#059669' : isCurrent ? '#7c3aed' : '#94a3b8' }}
                    >
                      {item.progress}%
                    </span>
                  </div>
                  {!isLocked && (
                    <div className="h-1.5 rounded-full overflow-hidden ml-4" style={{ background: '#e2e8f0' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.progress}%`, background: isDone ? '#059669' : item.color }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '2px solid #f1f5f9' }}>
            <span className="text-[12px] font-bold" style={{ color: '#64748b' }}>
              Overall Path Completion
            </span>
            <span className="text-[13.5px] font-extrabold font-mono" style={{ color: '#7c3aed' }}>
              {roadmapCompletion}%
            </span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-5 lg:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-extrabold font-display" style={{ color: '#0f172a' }}>
                Recent Activity
              </h2>
              <button
                onClick={() => handleNavigate('/daily-log')}
                className="flex items-center gap-1 text-[12px] font-extrabold transition-opacity hover:opacity-80 cursor-pointer"
                style={{ color: '#7c3aed' }}
              >
                View log <ChevronRightIcon size={14} />
              </button>
            </div>
            {logs.length > 0 ? (
              <div className="space-y-2">
                {logs.slice(0, 6).map((entry) => (
                  <div
                    key={entry._id}
                    className="flex items-start gap-3 px-3.5 py-3 rounded-[10px] transition-colors cursor-default"
                    style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
                  >
                    <div
                      className="w-1 self-stretch min-h-[36px] rounded-full shrink-0"
                      style={{ background: entry.moduleColor || '#8b47f3' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-bold truncate" style={{ color: '#0f172a' }}>
                          {entry.topic}
                        </span>
                        <span className="text-[12px] font-extrabold font-mono shrink-0" style={{ color: '#7c3aed' }}>
                          {entry.hours}h
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-[10.5px] font-extrabold px-2 py-0.5 rounded-[4px]"
                          style={{
                            background: `${entry.moduleColor || '#8b47f3'}18`,
                            color: entry.moduleColor || '#8b47f3',
                            border: `1px solid ${entry.moduleColor || '#8b47f3'}30`,
                          }}
                        >
                          {entry.module}
                        </span>
                        {entry.subtopic && (
                          <span className="text-[11.5px] font-semibold truncate" style={{ color: '#64748b' }}>
                            {entry.subtopic}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="p-8 rounded-[12px] text-center"
                style={{ background: '#f8fafc', border: '2px dashed #cbd5e1' }}
              >
                <p className="text-[14px] font-bold" style={{ color: '#475569' }}>
                  No learning sessions logged yet.
                </p>
                <p className="text-[12.5px] font-medium mt-1" style={{ color: '#64748b' }}>
                  Log your first session below to get started!
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-3" style={{ borderTop: '2px solid #f1f5f9' }}>
            <button
              onClick={() => handleNavigate('/daily-log')}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[10px] text-[13px] font-extrabold transition-all cursor-pointer shadow-sm hover:shadow-md"
              style={{ background: '#f3e8ff', color: '#7c3aed', border: '2px solid #d8b4fe' }}
            >
              <PlusIcon size={15} />
              Log today's learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
