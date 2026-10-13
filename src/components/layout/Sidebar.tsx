import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gamification } from '../../data/mockData';
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
  { path: '/squad',     label: 'Squad',      icon: SquadIcon, badge: '0' },
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
  const { user: authUser, logout } = useAuth();
  const xpPct = Math.round((gamification.xp / gamification.xpToNext) * 100);

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    logout();
    navigate('/login');
  };

  const activeName = authUser?.name || 'Developer';
  const activeUsername = authUser?.username || 'developer';


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
        background: '#ffffff',
        borderRight: '2px solid #e2e8f0',
        boxShadow: '4px 0 16px rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center justify-between px-5 h-16 shrink-0 cursor-pointer"
        style={{ borderBottom: '2px solid #f1f5f9' }}
        onClick={() => handleNav('/dashboard')}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 accent-glow"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 5l5-5-5-5v10z" fill="white" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-[16px] tracking-tight font-display" style={{ color: '#0f172a' }}>
              DevTrack
            </span>
            <span className="text-[9.5px] font-bold tracking-widest jp-watermark" style={{ color: '#7c3aed' }}>
              開発者
            </span>
          </div>
        </div>
        <button
          className="lg:hidden p-1 rounded"
          style={{ color: '#64748b' }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <CloseIcon size={18} />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 relative space-y-1">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            const isAICoach = item.path === '/ai-coach';
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-[13.5px] font-bold transition-all duration-150 cursor-pointer"
                style={{
                  background: active
                    ? isAICoach
                      ? '#ffe4e6'
                      : '#f3e8ff'
                    : 'transparent',
                  color: active
                    ? isAICoach ? '#e11d48' : '#7c3aed'
                    : '#475569',
                  border: active
                    ? isAICoach ? '1.5px solid #fda4af' : '1.5px solid #d8b4fe'
                    : '1.5px solid transparent',
                  boxShadow: active ? '2px 2px 0px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <Icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && item.badge !== '0' && (
                  <span
                    className="text-[10.5px] font-extrabold px-2 py-0.5 rounded-full"
                    style={{
                      background: active ? '#7c3aed' : '#f1f5f9',
                      color: active ? '#ffffff' : '#64748b',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {isAICoach && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: active ? '#e11d48' : '#cbd5e1',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="my-3" style={{ borderTop: '2px solid #f1f5f9' }} />

        <button
          onClick={() => handleNav('/settings')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-[13.5px] font-bold transition-all duration-150 cursor-pointer"
          style={{
            background: location.pathname === '/settings' ? '#f3e8ff' : 'transparent',
            color: location.pathname === '/settings' ? '#7c3aed' : '#475569',
            border: location.pathname === '/settings' ? '1.5px solid #d8b4fe' : '1.5px solid transparent',
          }}
        >
          <SettingsIcon size={18} />
          <span>Settings</span>
        </button>

        {/* ── Current module mini progress ── */}
        <div
          className="mt-4 p-3.5 rounded-[12px] cursor-pointer"
          style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', boxShadow: '2px 2px 0px #e2e8f0' }}
          onClick={() => handleNav('/roadmap')}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold" style={{ color: '#475569' }}>HTML & CSS · in progress</span>
            <span className="text-[11px] font-extrabold font-mono" style={{ color: '#0284c7' }}>0%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
            <div className="h-full rounded-full" style={{ width: '0%', background: '#0284c7' }} />
          </div>
          <p className="mt-1 text-[11px] font-medium" style={{ color: '#64748b' }}>Semantic HTML5 & Layouts</p>
        </div>
      </nav>

      {/* ── XP / Level ── */}
      <div
        className="px-3 py-3 shrink-0"
        style={{ borderTop: '2px solid #f1f5f9' }}
      >
        <div className="p-3 rounded-[10px]" style={{ background: '#fdf4ff', border: '1.5px solid #f5d0fe' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-extrabold px-2 py-0.5 rounded badge-cartoon"
                style={{ background: '#7c3aed', color: '#ffffff' }}
              >
                LVL {gamification.level}
              </span>
              <span className="text-[11.5px] font-bold" style={{ color: '#475569' }}>
                {gamification.levelName}
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
            <div className="h-full rounded-full xp-bar-fill" style={{ width: `${xpPct}%` }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10.5px] font-mono font-bold" style={{ color: '#64748b' }}>
              {gamification.xp.toLocaleString()} XP
            </span>
            <span className="text-[10.5px] font-mono font-bold" style={{ color: '#64748b' }}>
              {gamification.xpToNext.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── User Profile Footer ── */}
      <div
        className="px-3 py-3 shrink-0 cursor-pointer"
        style={{ borderTop: '2px solid #f1f5f9' }}
        onClick={() => handleNav('/settings')}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className="w-8 h-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                boxShadow: '0 0 0 2px #d8b4fe',
              }}
              title={activeName}
            >
              {authUser?.avatarUrl ? (
                <img
                  src={authUser.avatarUrl}
                  alt={activeName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <HanaMiniSVG />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold truncate" style={{ color: '#0f172a' }}>
                {activeName}
              </p>
              <p className="text-[11px] font-semibold truncate" style={{ color: '#64748b' }}>
                @{activeUsername}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-[8px] transition-all hover:bg-[#ffe4e6] text-[#64748b] hover:text-[#e11d48] ml-1 shrink-0 cursor-pointer border border-transparent hover:border-[#fda4af]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
