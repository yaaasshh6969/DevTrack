import { useLocation, useNavigate } from 'react-router-dom';
import { user, gamification } from '../../data/mockData';
import { HanaMiniSVG } from '../ui/WaifuCompanion';
import {
  DashboardIcon,
  RoadmapIcon,
  LogIcon,
  SquadIcon,
  AnalyticsIcon,
  AICoachIcon,
  SettingsIcon,
  CloseIcon,
} from '../ui/icons';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard',  icon: DashboardIcon },
  { path: '/roadmap',   label: 'My Roadmap', icon: RoadmapIcon },
  { path: '/daily-log', label: 'Daily Log',  icon: LogIcon },
  { path: '/squad',     label: 'Squad',      icon: SquadIcon, badge: '4' },
  { path: '/analytics', label: 'Analytics',  icon: AnalyticsIcon },
  { path: '/ai-coach',  label: 'AI Coach',   icon: AICoachIcon },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const xpPct = Math.round((gamification.xp / gamification.xpToNext) * 100);

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <aside
      className={[
        'fixed top-0 left-0 h-full z-30 flex flex-col',
        'w-[240px] shrink-0',
        'transition-transform duration-200 ease-out',
        'lg:translate-x-0 lg:static lg:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
      style={{
        background: '#08081c',
        borderRight: '1px solid rgba(100,70,200,0.08)',
      }}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center justify-between px-5 h-16 shrink-0 cursor-pointer"
        style={{ borderBottom: '1px solid rgba(100,70,200,0.07)' }}
        onClick={() => handleNav('/dashboard')}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 accent-glow"
            style={{ background: 'linear-gradient(135deg, #6418c8 0%, #8b47f3 100%)' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 5l5-5-5-5v10z" fill="white" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-semibold text-[15px] tracking-tight" style={{ color: '#f0ecff' }}>
              DevTrack
            </span>
            <span className="text-[9px] tracking-widest jp-watermark" style={{ color: '#38386a' }}>
              開発者
            </span>
          </div>
        </div>
        <button
          className="lg:hidden p-1 rounded"
          style={{ color: '#6868a8' }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <CloseIcon size={18} />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 relative">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            const isAICoach = item.path === '/ai-coach';
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13.5px] font-medium transition-colors duration-100 cursor-pointer"
                style={{
                  background: active
                    ? isAICoach
                      ? 'rgba(204,34,85,0.09)'
                      : 'rgba(139,71,243,0.1)'
                    : 'transparent',
                  color: active
                    ? isAICoach ? '#cc1144' : '#8b47f3'
                    : '#6868a8',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#c0bcdc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = '#6868a8';
                  }
                }}
              >
                <Icon size={17} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span
                    className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: active ? 'rgba(139,71,243,0.18)' : 'rgba(255,255,255,0.05)',
                      color: active ? '#8b47f3' : '#6868a8',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {isAICoach && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background: active ? '#cc1144' : '#404078',
                      opacity: active ? 1 : 0.5,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="my-3" style={{ borderTop: '1px solid rgba(100,70,200,0.06)' }} />

        <button
          onClick={() => handleNav('/settings')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13.5px] font-medium transition-colors duration-100 cursor-pointer"
          style={{
            background: location.pathname === '/settings' ? 'rgba(139,71,243,0.1)' : 'transparent',
            color: location.pathname === '/settings' ? '#8b47f3' : '#6868a8',
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== '/settings') {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
              (e.currentTarget as HTMLButtonElement).style.color = '#c0bcdc';
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== '/settings') {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = '#6868a8';
            }
          }}
        >
          <SettingsIcon size={17} />
          <span>Settings</span>
        </button>

        {/* ── Current module mini progress ── */}
        <div
          className="mt-4 p-3 rounded-[8px] cursor-pointer"
          style={{ background: 'rgba(139,71,243,0.06)', border: '1px solid rgba(139,71,243,0.1)' }}
          onClick={() => handleNav('/roadmap')}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium" style={{ color: '#6868a8' }}>React · in progress</span>
            <span className="text-[11px] font-semibold" style={{ color: '#8b47f3' }}>45%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full" style={{ width: '45%', background: '#8b47f3' }} />
          </div>
          <p className="mt-1 text-[10.5px]" style={{ color: '#38386a' }}>Context API & useReducer</p>
        </div>
      </nav>

      {/* ── XP / Level ── */}
      <div
        className="px-3 py-3 shrink-0"
        style={{ borderTop: '1px solid rgba(100,70,200,0.06)' }}
      >
        <div className="p-3 rounded-[8px]" style={{ background: 'rgba(139,71,243,0.05)', border: '1px solid rgba(139,71,243,0.09)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(139,71,243,0.16)', color: '#8b47f3' }}
              >
                LVL {gamification.level}
              </span>
              <span className="text-[11px]" style={{ color: '#38386a' }}>
                {gamification.levelName}
              </span>
            </div>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full xp-bar-fill" style={{ width: `${xpPct}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] font-mono" style={{ color: '#38386a' }}>
              {gamification.xp.toLocaleString()} XP
            </span>
            <span className="text-[10px] font-mono" style={{ color: '#38386a' }}>
              {gamification.xpToNext.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── User Profile ── */}
      <div
        className="px-3 py-3 shrink-0 cursor-pointer"
        style={{ borderTop: '1px solid rgba(100,70,200,0.06)' }}
        onClick={() => handleNav('/settings')}
      >
        <div className="flex items-center gap-3 px-2">
          {/* Aria mini avatar */}
          <div
            className="w-9 h-9 rounded-full shrink-0 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0a0618 0%, #18083a 100%)',
              boxShadow: '0 0 0 1.5px rgba(139,71,243,0.2)',
            }}
            title="Aria — AI Coach"
          >
            <HanaMiniSVG />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium truncate" style={{ color: '#f0ecff' }}>
              {user.name}
            </p>
            <p className="text-[11px] truncate" style={{ color: '#38386a' }}>
              @{user.username}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
