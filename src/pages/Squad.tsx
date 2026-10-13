import { squadMembers, squadActivity, user } from '../data/mockData';
import { FlameIcon } from '../components/ui/icons';

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = 32, online }: { initials: string; color: string; size?: number; online?: boolean }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center text-[11px] font-bold"
        style={{ background: `${color}18`, color, border: `1px solid ${color}28`, fontSize: size < 30 ? 10 : 11 }}
      >
        {initials}
      </div>
      {online !== undefined && (
        <div
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
          style={{ background: online ? '#4dd0a1' : '#252548', border: '2px solid #060610' }}
        />
      )}
    </div>
  );
}

// ── Activity event ────────────────────────────────────────────────────────────

function ActivityEvent({ event }: { event: typeof squadActivity[number] }) {
  const isMe = event.member === user.name;

  const typeStyle = {
    session:   { iconBg: 'rgba(139,71,243,0.1)',  iconColor: '#8b47f3' },
    streak:    { iconBg: 'rgba(251,191,36,0.1)',  iconColor: '#fbbf24' },
    milestone: { iconBg: 'rgba(77,208,161,0.1)',  iconColor: '#4dd0a1' },
    badge:     { iconBg: 'rgba(204,34,85,0.1)',   iconColor: '#cc1144' },
  }[event.type];

  const actionLine = () => {
    if (event.type === 'session') {
      return (
        <>
          logged <span style={{ color: '#f0ecff', fontWeight: 600 }}>{event.hours}h</span> on{' '}
          <span style={{ color: '#f0ecff', fontWeight: 600 }}>{event.topic}</span>
        </>
      );
    }
    if (event.type === 'streak') {
      return (
        <>
          {event.action} <span style={{ color: '#fbbf24', fontWeight: 600 }}>🔥</span>
        </>
      );
    }
    if (event.type === 'milestone') {
      return (
        <>
          completed <span style={{ color: '#4dd0a1', fontWeight: 600 }}>{event.topic}</span>
        </>
      );
    }
    if (event.type === 'badge') {
      return (
        <>
          earned <span style={{ color: '#cc1144', fontWeight: 600 }}>"{event.topic}"</span> badge
        </>
      );
    }
    return null;
  };

  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid rgba(100,70,200,0.06)' }}>
      <Avatar initials={event.initials} color={event.color} size={30} />
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] leading-snug" style={{ color: '#6868a8' }}>
          <span style={{ color: isMe ? '#8b47f3' : '#f0ecff', fontWeight: 600 }}>
            {isMe ? 'You' : event.member.split(' ')[0]}
          </span>{' '}
          {actionLine()}
        </p>
      </div>
      <span className="text-[10.5px] shrink-0 mt-0.5" style={{ color: '#383868' }}>{event.timeAgo}</span>
      {event.type === 'session' && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ background: typeStyle.iconBg }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={typeStyle.iconColor} strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Member card ───────────────────────────────────────────────────────────────

function MemberCard({ member }: { member: typeof squadMembers[number] }) {
  const isMe = member.name === user.name;
  const weekPct = Math.min((member.weeklyHours / user.weeklyGoal) * 100, 100);

  return (
    <div
      className="card p-4"
      style={{ border: isMe ? '1px solid rgba(139,71,243,0.2)' : undefined }}
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar initials={member.initials} color={member.color} size={36} online={member.isOnline} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[13px] font-semibold truncate" style={{ color: '#f0ecff' }}>
              {isMe ? 'You' : member.name}
            </p>
            {isMe && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(139,71,243,0.12)', color: '#8b47f3' }}>
                you
              </span>
            )}
          </div>
          <p className="text-[11px]" style={{ color: '#383868' }}>{member.role}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 justify-end">
            <span style={{ color: '#fbbf24' }}><FlameIcon size={12} /></span>
            <span className="text-[13px] font-semibold font-mono" style={{ color: '#fbbf24' }}>{member.streak}</span>
          </div>
          <p className="text-[10px]" style={{ color: '#383868' }}>day streak</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10.5px]" style={{ color: '#383868' }}>This week</span>
          <span className="text-[11px] font-semibold font-mono" style={{ color: member.color }}>{member.weeklyHours}h</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="h-full rounded-full" style={{ width: `${weekPct}%`, background: member.color }} />
        </div>
      </div>
    </div>
  );
}

// ── Leaderboard row ───────────────────────────────────────────────────────────

type LeaderboardMember = typeof squadMembers[number] & { rank: number };

function LeaderboardRow({ m }: { m: LeaderboardMember }) {
  const isMe = m.name === user.name;
  return (
    <div
      className="flex items-center gap-3 py-2.5"
      style={{ borderBottom: '1px solid rgba(100,70,200,0.06)' }}
    >
      <span className="w-5 text-center text-[11px] font-bold font-mono shrink-0"
        style={{ color: m.rank === 1 ? '#fbbf24' : m.rank === 2 ? '#94a3b8' : m.rank === 3 ? '#f97316' : '#383868' }}>
        {m.rank}
      </span>
      <Avatar initials={m.initials} color={m.color} size={28} />
      <span className="flex-1 text-[12.5px]" style={{ color: isMe ? '#8b47f3' : '#f0ecff', fontWeight: isMe ? 600 : 400 }}>
        {isMe ? 'You' : m.name.split(' ')[0]}
      </span>
      <div className="flex items-center gap-1">
        <span style={{ color: '#fbbf24' }}><FlameIcon size={11} /></span>
        <span className="text-[12px] font-mono" style={{ color: '#fbbf24' }}>{m.streak}</span>
      </div>
      <span className="text-[12px] font-mono w-12 text-right" style={{ color: m.color }}>{m.weeklyHours}h</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Squad() {
  const allMembers = [
    { ...user, initials: 'AC', color: '#8b47f3', streak: user.streak, weeklyHours: 8.0, role: 'Full-Stack Focus', isOnline: true },
    ...squadMembers,
  ];

  const leaderboard = [...allMembers]
    .sort((a, b) => b.weeklyHours - a.weeklyHours)
    .map((m, i) => ({ ...m, rank: i + 1 }));

  const totalHoursToday = squadActivity
    .filter((e) => e.type === 'session' && e.timeAgo.includes('h ago'))
    .reduce((s, e) => s + (e.hours ?? 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight" style={{ color: '#f0ecff' }}>Squad</h1>
        <p className="mt-1 text-[13.5px]" style={{ color: '#6868a8' }}>
          5 members · {totalHoursToday.toFixed(1)}h logged today across the squad
        </p>
      </div>

      {/* Squad pulse — motivational stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total squad hours this week', value: `${allMembers.reduce((s, m) => s + m.weeklyHours, 0).toFixed(1)}h`, color: '#8b47f3' },
          { label: 'Average streak', value: `${Math.round(allMembers.reduce((s, m) => s + m.streak, 0) / allMembers.length)}d`, color: '#fbbf24' },
          { label: 'Sessions logged today', value: `${squadActivity.filter((e) => e.type === 'session' && e.timeAgo.includes('h ago')).length}`, color: '#4dd0a1' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-[10.5px] leading-snug" style={{ color: '#383868' }}>{s.label}</p>
            <p className="mt-1.5 text-[22px] font-semibold font-mono" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* Left: Activity feed */}
        <div className="space-y-0">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(100,70,200,0.08)' }}>
              <div>
                <p className="text-[13.5px] font-semibold" style={{ color: '#f0ecff' }}>Activity Feed</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#383868' }}>What your squad is working on</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4dd0a1', boxShadow: '0 0 4px #4dd0a1' }} />
                <span className="text-[10.5px]" style={{ color: '#4dd0a1' }}>Live</span>
              </div>
            </div>
            <div className="px-5">
              {squadActivity.map((event) => (
                <ActivityEvent key={event.id} event={event} />
              ))}
            </div>
            <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(100,70,200,0.06)' }}>
              <p className="text-[11px] text-center" style={{ color: '#383868' }}>
                Activity updates every session · 10 most recent shown
              </p>
            </div>
          </div>
        </div>

        {/* Right: Members + Leaderboard */}
        <div className="space-y-4">
          {/* Members */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(100,70,200,0.08)' }}>
              <p className="text-[13.5px] font-semibold" style={{ color: '#f0ecff' }}>Members</p>
            </div>
            <div className="p-4 space-y-3">
              {allMembers.map((m) => (
                <MemberCard key={m.name} member={m as typeof squadMembers[number]} />
              ))}
            </div>
          </div>

          {/* This week's leaderboard */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(100,70,200,0.08)' }}>
              <p className="text-[13.5px] font-semibold" style={{ color: '#f0ecff' }}>This Week</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#383868' }}>Hours logged · Mon–Sun</p>
            </div>
            <div className="px-5 py-2">
              {leaderboard.map((m) => (
                <LeaderboardRow key={m.name} m={m} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
