import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import MyRoadmap from './pages/MyRoadmap';
import DailyLog from './pages/DailyLog';
import AICoach from './pages/AICoach';
import Squad from './pages/Squad';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { MenuIcon } from './components/ui/icons';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageLabel: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/roadmap': 'My Roadmap',
    '/daily-log': 'Daily Log',
    '/ai-coach': 'AI Coach',
    '/squad': 'Squad',
    '/analytics': 'Analytics',
    '/settings': 'Settings',
  };

  const currentTitle = pageLabel[location.pathname] ?? 'Dashboard';

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#060610' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ background: '#08081c', borderBottom: '1px solid rgba(139,71,243,0.08)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-[7px] cursor-pointer"
            style={{ color: '#6868a8', background: 'rgba(139,71,243,0.06)' }}
          >
            <MenuIcon size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[6px] flex items-center justify-center" style={{ background: '#8b47f3' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 3h4v4H3V3zm6 0h4v4H9V3zM3 9h4v4H3V9zm6 4l4-4-4-4v8z" fill="white" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight" style={{ color: '#f0ecff' }}>
              DevTrack
            </span>
          </div>
          <div className="ml-auto text-[12px] font-medium" style={{ color: '#50508a' }}>
            {currentTitle}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<MyRoadmap />} />
            <Route path="/daily-log" element={<DailyLog />} />
            <Route path="/ai-coach" element={<AICoach />} />
            <Route path="/squad" element={<Squad />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
