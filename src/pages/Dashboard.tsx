import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  user, roadmapItems, logEntries, weeklyChartData,
  generateHeatmapData, gamification, hanaMessages,
} from '../data/mockData';
import {
  FlameIcon, ClockIcon, TrendUpIcon, CheckCircleIcon, PlusIcon, ChevronRightIcon,
} from '../components/ui/icons';
import { CompanionCard, SakuraPetals } from '../components/ui/WaifuCompanion';

const heatmapData = generateHeatmapData();

function getHeatColor(intensity: number): string {
  const colors = ['#0d0d22', '#251555', '#4220a0', '#6630d0', '#8b47f3'];
  return colors[Math.min(intensity, 4)];
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getMonthLabels(weeks: typeof heatmapData): { label: string; weekIndex: number }[] {
  const seen = new Set<string>();
  const labels: { label: string; weekIndex: number }[] = [];
  weeks.forEach((week, wi) => {
    const d = week[0].date;
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
    <div className="px-3 py-2 rounded-[8px] text-[12px]" style={{ background: '#101030', border: '1px solid rgba(139,71,243,0.2)', color: '#f0ecff' }}>
      <p style={{ color: '#6868a8' }}>{label}</p>
      <p className="font-semibold mt-0.5"><span style={{ color: '#8b47f3' }}>{payload[0].value}h</span> learned</p>
    </div>
  );
}

// ── Compact stat tile ─────────────────────────────────────────────────────────

interface StatTileProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent?: string;
  progress?: number; // optional inline progress bar 0-100
}

function StatTile({ label, value, sub, icon, accent = '#8b47f3', progress }: StatTileProps) {
  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-widest" style={{ color: '#383868' }}>
          {label}
        </span>
        <span className="p-1.5 rounded-[7px]" style={{ background: `${accent}16`, color: accent }}>
          {icon}
        </span>
      </div>
      <div>
        <p className="text-[26px] sm:text-[28px] font-semibold leading-none font-mono" style={{ color: accent }}>
          {value}
        </p>
        {progress !== undefined ? (
          <div className="mt-2">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, progress)}%`, background: accent }}
              />
            </div>
            <p className="mt-1 text-[11.5px]" style={{ color: '#383868' }}>{sub}</p>
          </div>
        ) : (
          <p className="mt-1.5 text-[11.5px]" style={{ color: '#383868' }}>{sub}</p>
        )}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

interface Props { onNavigate?: (page: string) => void; }

export default function Dashboard({ onNavigate }: Props) {
  const navigate = useNavigate();
  const [_x, setX] = useState(false);
  const monthLabels = getMonthLabels(heatmapData);
  const weekTotal = weeklyChartData.reduce((s, d) => s + d.hours, 0);
  const activeItems = roadmapItems.filter((r) => r.status !== 'locked');
  const todayMessage = hanaMessages[0];
  const todayPct = Math.round((user.todayHours / user.todayGoal) * 100);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
      <SakuraPetals />

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 flex-wrap relative z-10">
        <div>
          <p className="text-[11.5px] font-medium mb-0.5" style={{ color: '#383868' }}>
            Tuesday · September 2, 2026
          </p>
          <h1 className="text-[24px] sm:text-[26px] font-semibold tracking-tight" style={{ color: '#f0ecff' }}>
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="mt-0.5 text-[13.5px] flex items-center gap-2" style={{ color: '#6868a8' }}>
            <span className="inline-flex items-center gap-1 font-semibold streak-flame" style={{ color: '#4dd0a1' }}>
              <FlameIcon size={13} />
              {user.streak}-day streak
            </span>
            <span style={{ color: '#383868' }}>·</span>
            {user.currentModule} in progress
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleNavigate('/ai-coach')}
            className="px-3 py-2 rounded-[8px] text-[12.5px] font-medium transition-opacity hover:opacity-80"
            style={{ background: 'rgba(204,34,85,0.08)', color: '#cc1144', border: '1px solid rgba(204,34,85,0.15)' }}
          >
            Chat with Aria
          </button>
          <button
            onClick={() => { handleNavigate('/daily-log'); setX(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#8b47f3', color: 'white' }}
          >
            <PlusIcon size={15} />
            Log Learning
          </button>
        </div>
      </div>

      {/* ── Stat Tiles ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        <StatTile
          label="Streak"
          value={`${user.streak}d`}
          sub={`Best: ${user.longestStreak}d`}
          icon={<FlameIcon size={15} />}
          accent="#4dd0a1"
        />
        <StatTile
          label="Today"
          value={`${user.todayHours}h`}
          sub={`${todayPct}% of ${user.todayGoal}h goal`}
          icon={<CheckCircleIcon size={15} />}
          accent={todayPct >= 100 ? '#4dd0a1' : '#8b47f3'}
          progress={todayPct}
        />
        <StatTile
          label="Roadmap"
          value={`${user.roadmapCompletion}%`}
          sub="HTML → MongoDB"
          icon={<TrendUpIcon size={15} />}
          accent="#22d3ee"
          progress={user.roadmapCompletion}
        />
        <StatTile
          label="Total Hours"
          value={`${Math.floor(user.totalHours)}`}
          sub={`${weekTotal.toFixed(1)}h this week`}
          icon={<ClockIcon size={15} />}
          accent="#a855f7"
        />
      </div>

      {/* ── Aria Companion + Achievements ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">
        <div className="lg:col-span-2">
          <CompanionCard
            userName={user.name.split(' ')[0]}
            message={todayMessage.text}
            xp={gamification.xp}
            xpToNext={gamification.xpToNext}
            level={gamification.level}
            levelName={gamification.levelName}
            badges={gamification.badges}
          />
        </div>
        {/* Achievements */}
        <div className="card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[13.5px] font-semibold" style={{ color: '#f0ecff' }}>Achievements</h3>
            <span className="text-[11px] font-mono" style={{ color: '#383868' }}>
              {gamification.badges.filter(b => b.earned).length}/{gamification.badges.length}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {gamification.badges.map((b) => (
              <div
                key={b.id}
                className="flex flex-col items-center gap-1.5 cursor-default"
                title={`${b.name}${b.earned ? ` · +${b.xp} XP` : ' · Locked'}`}
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[17px] transition-transform hover:scale-110"
                  style={{
                    background: b.earned ? 'rgba(139,71,243,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${b.earned ? 'rgba(139,71,243,0.2)' : 'rgba(255,255,255,0.04)'}`,
                    filter: b.earned ? 'none' : 'grayscale(1) opacity(0.25)',
                  }}
                >
                  {b.emoji}
                </div>
                <span className="text-[9px] text-center leading-tight" style={{ color: b.earned ? '#6868a8' : '#383868' }}>
                  {b.name.split(' ').slice(0, 2).join('\n')}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(100,70,200,0.07)' }}>
            <span className="text-[11.5px]" style={{ color: '#6868a8' }}>
              {gamification.badges.filter(b => b.earned).reduce((s, b) => s + b.xp, 0)} XP earned
            </span>
            <button
              onClick={() => handleNavigate('/analytics')}
              className="text-[11.5px] font-medium flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: '#8b47f3' }}
            >
              Stats <ChevronRightIcon size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Weekly Chart + Quick stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-[14px] font-semibold" style={{ color: '#f0ecff' }}>This Week</h2>
              <p className="text-[12px] mt-0.5" style={{ color: '#50508a' }}>{weekTotal.toFixed(1)}h of {user.weeklyGoal}h goal</p>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[11.5px] font-medium"
              style={{
                background: weekTotal >= user.weeklyGoal ? 'rgba(77,208,161,0.1)' : 'rgba(139,71,243,0.1)',
                color: weekTotal >= user.weeklyGoal ? '#4dd0a1' : '#8b47f3',
              }}
            >
              {Math.round((weekTotal / user.weeklyGoal) * 100)}% of goal
            </span>
          </div>
          <div style={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,71,243,0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#383868', fontSize: 11, fontFamily: 'Inter' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#383868', fontSize: 11, fontFamily: 'Inter' }} width={26} tickFormatter={(v) => `${v}h`} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(139,71,243,0.04)' }} />
                <Bar dataKey="hours" fill="#8b47f3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { label: 'Best day', value: '3.5h', note: 'Thursday', accent: '#8b47f3' },
            { label: 'Daily avg', value: `${(weekTotal / 7).toFixed(1)}h`, note: '↑ from last week', accent: '#4dd0a1' },
            { label: 'Sessions', value: '12', note: 'This week', accent: '#22d3ee' },
          ].map((s) => (
            <div key={s.label} className="card p-4 flex-1 flex flex-col justify-between min-h-0">
              <span className="text-[10.5px] font-medium uppercase tracking-widest" style={{ color: '#383868' }}>{s.label}</span>
              <div>
                <span className="text-[22px] font-semibold font-mono" style={{ color: s.accent }}>{s.value}</span>
                <p className="text-[11px] mt-0.5" style={{ color: '#383868' }}>{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Heatmap ── */}
      <div className="card p-5 relative z-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-[14px] font-semibold" style={{ color: '#f0ecff' }}>Learning Consistency</h2>
            <p className="text-[12px] mt-0.5" style={{ color: '#50508a' }}>Last 12 months · {user.totalHours}h total</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10.5px]" style={{ color: '#383868' }}>Less</span>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[9px] h-[9px] rounded-[2px]" style={{ background: getHeatColor(i) }} />
            ))}
            <span className="text-[10.5px]" style={{ color: '#383868' }}>More</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-fit">
            <div className="flex mb-1">
              {heatmapData.map((_, wi) => {
                const ml = monthLabels.find((m) => m.weekIndex === wi);
                return (
                  <div key={wi} className="shrink-0" style={{ width: 12, marginRight: 2 }}>
                    {ml && <span className="text-[9.5px] whitespace-nowrap" style={{ color: '#383868' }}>{ml.label}</span>}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-[2px]">
              {heatmapData.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className="heatmap-cell w-[10px] h-[10px] rounded-[2px] cursor-default"
                      style={{ background: getHeatColor(day.intensity) }}
                      title={day.hours > 0 ? `${formatShortDate(day.date)}: ${day.hours}h` : formatShortDate(day.date)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Roadmap preview + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
        {/* Roadmap */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold" style={{ color: '#f0ecff' }}>Your Path</h2>
            <button
              onClick={() => handleNavigate('/roadmap')}
              className="flex items-center gap-1 text-[12px] font-medium transition-opacity hover:opacity-70"
              style={{ color: '#8b47f3' }}
            >
              Full roadmap <ChevronRightIcon size={13} />
            </button>
          </div>
          <div className="space-y-3.5">
            {roadmapItems.map((item) => {
              const isLocked = item.status === 'locked';
              const isDone = item.status === 'complete';
              const isCurrent = item.status === 'in-progress';
              return (
                <div key={item.id} style={{ opacity: isLocked ? 0.38 : 1 }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {isDone ? (
                        <CheckCircleIcon size={12} className="text-[#4dd0a1]" />
                      ) : (
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            background: isCurrent ? item.color : '#383868',
                            boxShadow: isCurrent ? `0 0 5px ${item.color}60` : 'none',
                          }}
                        />
                      )}
                      <span
                        className="text-[12.5px] font-medium"
                        style={{ color: isDone ? '#6868a8' : isCurrent ? '#f0ecff' : '#50508a' }}
                      >
                        {item.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide" style={{ background: 'rgba(139,71,243,0.12)', color: '#8b47f3' }}>
                          Now
                        </span>
                      )}
                    </div>
                    <span className="text-[11.5px] font-mono" style={{ color: isDone ? '#4dd0a1' : isCurrent ? '#8b47f3' : '#383868' }}>
                      {item.progress}%
                    </span>
                  </div>
                  {!isLocked && (
                    <div className="h-1 rounded-full overflow-hidden ml-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.progress}%`, background: isDone ? '#4dd0a1' : item.color }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(100,70,200,0.07)' }}>
            <span className="text-[12px]" style={{ color: '#50508a' }}>Overall</span>
            <span className="text-[13px] font-semibold font-mono" style={{ color: '#8b47f3' }}>{user.roadmapCompletion}%</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold" style={{ color: '#f0ecff' }}>Recent Activity</h2>
            <button
              onClick={() => handleNavigate('/daily-log')}
              className="flex items-center gap-1 text-[12px] font-medium transition-opacity hover:opacity-70"
              style={{ color: '#8b47f3' }}
            >
              View log <ChevronRightIcon size={13} />
            </button>
          </div>
          <div className="space-y-px">
            {logEntries.slice(0, 6).map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 px-3 py-2.5 rounded-[7px] transition-colors cursor-default group"
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(139,71,243,0.04)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
              >
                <div className="w-0.5 self-stretch min-h-[36px] rounded-full mt-0.5 shrink-0" style={{ background: entry.moduleColor }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium truncate" style={{ color: i === 0 ? '#f0ecff' : '#c0bcdc' }}>
                      {entry.topic}
                    </span>
                    <span className="text-[11.5px] font-semibold font-mono shrink-0" style={{ color: '#8b47f3' }}>
                      {entry.hours}h
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded-[3px]" style={{ background: `${entry.moduleColor}12`, color: entry.moduleColor }}>
                      {entry.module}
                    </span>
                    <span className="text-[11px] truncate" style={{ color: '#50508a' }}>{entry.subtopic}</span>
                    <span className="text-[10.5px] ml-auto shrink-0" style={{ color: '#383868' }}>
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(100,70,200,0.07)' }}>
            <button
              onClick={() => handleNavigate('/daily-log')}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-[7px] text-[12.5px] font-medium transition-all hover:opacity-90"
              style={{ background: 'rgba(139,71,243,0.07)', color: '#8b47f3', border: '1px solid rgba(139,71,243,0.1)' }}
            >
              <PlusIcon size={14} />
              Log today's learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
