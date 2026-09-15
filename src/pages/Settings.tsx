import { useState } from 'react';
import { user } from '../data/mockData';
import { SettingsIcon, CheckCircleIcon } from '../components/ui/icons';

export default function Settings() {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [todayGoal, setTodayGoal] = useState(user.todayGoal);
  const [weeklyGoal, setWeeklyGoal] = useState(user.weeklyGoal);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = {
    background: '#090918',
    border: '1px solid rgba(100,70,200,0.12)',
    color: '#f0ecff',
    borderRadius: 8,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[800px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <SettingsIcon size={22} className="text-[#8b47f3]" />
          <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight" style={{ color: '#f0ecff' }}>
            Settings
          </h1>
        </div>
        <p className="text-[13.5px]" style={{ color: '#6868a8' }}>
          Manage your account profile, learning goals, and preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="card p-6 space-y-5">
        <h2 className="text-[15px] font-semibold" style={{ color: '#f0ecff' }}>
          Developer Profile
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#383868' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-[13.5px]"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#383868' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 text-[13.5px]"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-[13.5px] font-semibold mb-3" style={{ color: '#f0ecff' }}>
              Learning Targets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#383868' }}>
                  Daily Goal (Hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={todayGoal}
                  onChange={(e) => setTodayGoal(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-[13.5px]"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#383868' }}>
                  Weekly Goal (Hours)
                </label>
                <input
                  type="number"
                  step="1"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-[13.5px]"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(100,70,200,0.07)' }}>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-[8px] text-[13px] font-semibold transition-opacity hover:opacity-90"
              style={{ background: '#8b47f3', color: 'white' }}
            >
              Save Preferences
            </button>

            {saved && (
              <div className="flex items-center gap-1.5 text-[12.5px] font-medium" style={{ color: '#4dd0a1' }}>
                <CheckCircleIcon size={15} />
                Settings saved!
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Account Info Placeholder */}
      <div className="card p-6 space-y-4">
        <h2 className="text-[15px] font-semibold" style={{ color: '#f0ecff' }}>
          Integrations & Backend Status
        </h2>
        <div className="p-4 rounded-[8px] space-y-2 text-[12.5px]" style={{ background: 'rgba(139,71,243,0.04)', border: '1px solid rgba(139,71,243,0.1)' }}>
          <div className="flex justify-between items-center">
            <span style={{ color: '#6868a8' }}>Database Engine</span>
            <span className="font-mono text-[11.5px]" style={{ color: '#fbbf24' }}>Phase 2 (Supabase)</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: '#6868a8' }}>Authentication Provider</span>
            <span className="font-mono text-[11.5px]" style={{ color: '#fbbf24' }}>Phase 3 (Pending)</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: '#6868a8' }}>AI Companion API</span>
            <span className="font-mono text-[11.5px]" style={{ color: '#cc1144' }}>Aria (Simulated Mode)</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: '#6868a8' }}>GitHub Integration</span>
            <span className="font-mono text-[11.5px]" style={{ color: '#fbbf24' }}>Phase 9 (Pending)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
