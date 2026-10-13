import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useRoadmap, RoadmapModule } from '../hooks/useRoadmap';
import { useStats, HeatmapDay } from '../hooks/useStats';

// ── Custom tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-[7px] text-[12px]"
      style={{ background: '#0f0f28', border: '1px solid rgba(139,71,243,0.2)', color: '#f0ecff' }}
    >
      <p style={{ color: '#6868a8' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? '#8b47f3' }}>
          {p.value}h
        </p>
      ))}
    </div>
  );
}

// ── Heatmap (mini, last 12 weeks) ─────────────────────────────────────────────

const HEAT_COLORS = ['#0d0d22', '#251555', '#4220a0', '#6630d0', '#8b47f3'];

function MiniHeatmap({ heatmap }: { heatmap: HeatmapDay[][] }) {
  const weeks = heatmap.length > 0 ? heatmap.slice(-12) : [];
  if (weeks.length === 0) {
    return (
      <div className="py-4 text-center text-[12px]" style={{ color: '#50508a' }}>
        No activity recorded yet
      </div>
    );
  }

  return (
    <div className="flex gap-1 mt-3">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day, di) => (
            <div
              key={di}
              className="w-3.5 h-3.5 rounded-[3px]"
              style={{ background: HEAT_COLORS[Math.min(day.intensity, 4)] }}
              title={`${day.date} · ${day.hours}h`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── KPI tile ──────────────────────────────────────────────────────────────────

function KpiTile({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="card p-5">
      <p className="text-[10.5px] font-medium uppercase tracking-widest" style={{ color: '#383868' }}>
        {label}
      </p>
      <p className="mt-2 text-[28px] font-semibold font-mono leading-none" style={{ color: accent }}>
        {value}
      </p>
      <p className="mt-1.5 text-[11.5px]" style={{ color: '#50508a' }}>
        {sub}
      </p>
    </div>
  );
}

// ── Module breakdown ──────────────────────────────────────────────────────────

function ModuleBar({ item }: { item: RoadmapModule }) {
  const estimated = item.estimatedHours || 30;
  const pct = Math.min(100, Math.round(((item.hoursSpent || 0) / estimated) * 100));
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(100,70,200,0.06)' }}>
      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
      <span className="w-24 sm:w-28 text-[12px] truncate shrink-0" style={{ color: '#f0ecff' }}>
        {item.name}
      </span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: item.color }} />
      </div>
      <span className="text-[11.5px] font-mono w-10 text-right shrink-0" style={{ color: item.color }}>
        {item.hoursSpent || 0}h
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Analytics() {
  const { user } = useAuth();
  const { roadmap } = useRoadmap();
  const { stats, loading } = useStats();

  const totalHours = stats?.totalHours ?? user?.totalHours ?? 0;
  const currentStreak = stats?.currentStreak ?? user?.streak ?? 0;
  const longestStreak = stats?.longestStreak ?? user?.longestStreak ?? 0;
  const weeklyGoal = user?.weeklyGoal || 15;

  const trendData =
    stats?.monthlyTrend && stats.monthlyTrend.length > 0
      ? stats.monthlyTrend
      : [
          { week: 'W1', hours: 0, goal: weeklyGoal },
          { week: 'W2', hours: 0, goal: weeklyGoal },
          { week: 'W3', hours: 0, goal: weeklyGoal },
          { week: 'W4', hours: 0, goal: weeklyGoal },
        ];

  const trendHoursSum = trendData.reduce((s, d) => s + d.hours, 0);
  const weeklyAvg = +(trendHoursSum / Math.max(1, trendData.length)).toFixed(1);

  const weeklyChartData =
    stats?.weeklyHours && stats.weeklyHours.length === 7
      ? stats.weeklyHours.map((d) => ({ ...d, goal: 3 }))
      : [
          { day: 'Mon', hours: 0, goal: 3 },
          { day: 'Tue', hours: 0, goal: 3 },
          { day: 'Wed', hours: 0, goal: 3 },
          { day: 'Thu', hours: 0, goal: 3 },
          { day: 'Fri', hours: 0, goal: 3 },
          { day: 'Sat', hours: 0, goal: 3 },
          { day: 'Sun', hours: 0, goal: 3 },
        ];

  const thisWeekTotal = weeklyChartData.reduce((s, d) => s + d.hours, 0).toFixed(1);

  // Active days and months
  const activeDays = stats?.activeDays ?? (totalHours > 0 ? 1 : 0);

  // Mood calculations
  const moodDist = stats?.moodDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const totalMoods = (moodDist[1] || 0) + (moodDist[2] || 0) + (moodDist[3] || 0) + (moodDist[4] || 0) + (moodDist[5] || 0);

  const moodRows = [
    { label: 'Amazing', count: moodDist[5] || 0, color: '#8b47f3' },
    { label: 'Good', count: moodDist[4] || 0, color: '#4dd0a1' },
    { label: 'Okay', count: moodDist[3] || 0, color: '#fbbf24' },
    { label: 'Tough', count: (moodDist[1] || 0) + (moodDist[2] || 0), color: '#f87171' },
  ].map((row) => ({
    ...row,
    pct: totalMoods > 0 ? Math.round((row.count / totalMoods) * 100) : 0,
  }));

  const modules = roadmap?.modules || [];
  const activeModules = modules.filter((m) => (m.hoursSpent || 0) > 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight" style={{ color: '#f0ecff' }}>
          Analytics
        </h1>
        <p className="mt-1 text-[13.5px]" style={{ color: '#6868a8' }}>
          Real-time learning statistics synced from your MongoDB account
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiTile label="Total hours" value={`${totalHours.toFixed(1)}h`} sub="all-time study time" accent="#8b47f3" />
        <KpiTile
          label="Current streak"
          value={`${currentStreak}d`}
          sub={`Best: ${longestStreak}d`}
          accent="#fbbf24"
        />
        <KpiTile label="Weekly avg" value={`${weeklyAvg}h`} sub={`Goal: ${weeklyGoal}h`} accent="#22d3ee" />
        <KpiTile
          label="Active days"
          value={`${activeDays}`}
          sub={`${activeDays > 0 ? (totalHours / activeDays).toFixed(1) : '0'}h avg/day`}
          accent="#4dd0a1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Weekly trend */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[13.5px] font-semibold" style={{ color: '#f0ecff' }}>
                  Weekly Learning Trend
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: '#383868' }}>
                  Hours logged per week · last 8 weeks
                </p>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-semibold font-mono" style={{ color: '#8b47f3' }}>
                  {weeklyAvg}h
                </p>
                <p className="text-[10px]" style={{ color: '#383868' }}>
                  avg/week
                </p>
              </div>
            </div>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b47f3" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#8b47f3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(100,70,200,0.07)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#383868' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#383868' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="goal"
                    stroke="rgba(139,71,243,0.15)"
                    strokeWidth={1}
                    strokeDasharray="4 3"
                    fill="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#8b47f3"
                    strokeWidth={2}
                    fill="url(#areaGrad)"
                    dot={{ r: 3, fill: '#8b47f3', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded-full" style={{ background: '#8b47f3' }} />
                <span className="text-[10.5px]" style={{ color: '#383868' }}>
                  Hours logged
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded-full border-dashed" style={{ borderTop: '1px dashed rgba(139,71,243,0.4)' }} />
                <span className="text-[10.5px]" style={{ color: '#383868' }}>
                  Weekly goal ({weeklyGoal}h)
                </span>
              </div>
            </div>
          </div>

          {/* Daily breakdown (this week) */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[13.5px] font-semibold" style={{ color: '#f0ecff' }}>
                  This Week
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: '#383868' }}>
                  Daily hours vs 3h goal
                </p>
              </div>
              <p className="text-[18px] font-semibold font-mono" style={{ color: '#22d3ee' }}>
                {thisWeekTotal}h
              </p>
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
                  <CartesianGrid stroke="rgba(100,70,200,0.07)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#383868' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#383868' }} axisLine={false} tickLine={false} domain={[0, 4]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="goal" fill="rgba(139,71,243,0.08)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="hours" fill="#8b47f3" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Module breakdown */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[13.5px] font-semibold" style={{ color: '#f0ecff' }}>
                  Hours by Module
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: '#383868' }}>
                  Out of estimated total
                </p>
              </div>
            </div>
            <div>
              {activeModules.length > 0 ? (
                activeModules.map((item) => <ModuleBar key={item._id} item={item} />)
              ) : modules.length > 0 ? (
                modules.slice(0, 4).map((item) => <ModuleBar key={item._id} item={item} />)
              ) : (
                <p className="text-[12px] py-4 text-center" style={{ color: '#50508a' }}>
                  No module hours recorded yet
                </p>
              )}
            </div>
          </div>

          {/* Heatmap */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[13.5px] font-semibold" style={{ color: '#f0ecff' }}>
                Activity Heatmap
              </p>
              <p className="text-[11px]" style={{ color: '#383868' }}>
                Last 12 weeks
              </p>
            </div>
            <p className="text-[11px] mb-2" style={{ color: '#383868' }}>
              {currentStreak}-day current streak
            </p>
            <MiniHeatmap heatmap={stats?.heatmap || []} />
            <div className="flex items-center gap-1 mt-3">
              <span className="text-[10px]" style={{ color: '#383868' }}>
                Less
              </span>
              {HEAT_COLORS.map((c) => (
                <div key={c} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: c }} />
              ))}
              <span className="text-[10px]" style={{ color: '#383868' }}>
                More
              </span>
            </div>
          </div>

          {/* Mood distribution */}
          <div className="card p-5">
            <p className="text-[13.5px] font-semibold mb-4" style={{ color: '#f0ecff' }}>
              Session Mood
            </p>
            <div className="space-y-2">
              {moodRows.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="w-16 text-[11.5px] shrink-0" style={{ color: '#6868a8' }}>
                    {row.label}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${row.pct}%`, background: row.color }} />
                  </div>
                  <span className="w-6 text-right text-[11px] font-mono shrink-0" style={{ color: '#383868' }}>
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
