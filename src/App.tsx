import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import MyRoadmap from './pages/MyRoadmap';
import DailyLog from './pages/DailyLog';
import AICoach from './pages/AICoach';
import Squad from './pages/Squad';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { MenuIcon } from './components/ui/icons';

function MainLayout() {
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
    <div className="flex h-full overflow-hidden" style={{ background: '#f5f6fc' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
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
          style={{ background: '#ffffff', borderBottom: '2px solid #e2e8f0' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-[8px] cursor-pointer"
            style={{ color: '#475569', background: '#f1f5f9', border: '1px solid #cbd5e1' }}
          >
            <MenuIcon size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[6px] flex items-center justify-center" style={{ background: '#7c3aed', boxShadow: '1.5px 1.5px 0px #475569' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 3h4v4H3V3zm6 0h4v4H9V3zM3 9h4v4H3V9zm6 4l4-4-4-4v8z" fill="white" />
              </svg>
            </div>
            <span className="text-[15px] font-bold tracking-tight font-display" style={{ color: '#0f172a' }}>
              DevTrack
            </span>
          </div>
          <div className="ml-auto text-[12px] font-bold font-display px-2.5 py-1 rounded-[6px]" style={{ color: '#7c3aed', background: '#f3e8ff', border: '1px solid #d8b4fe' }}>
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

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<MainLayout />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
