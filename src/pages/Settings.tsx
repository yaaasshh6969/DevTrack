import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../services/api';
import { SettingsIcon, CheckCircleIcon, LockIcon } from '../components/ui/icons';

const PRESET_AVATARS = [
  { id: 'hana', name: 'Aria Chibi', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aria&backgroundColor=7c3aed' },
  { id: 'cyber', name: 'Cyber Neon', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberDev&backgroundColor=06b6d4' },
  { id: 'ninja', name: 'Ninja Coder', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NinjaCoder&backgroundColor=10b981' },
  { id: 'samurai', name: 'Samurai', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CodeSamurai&backgroundColor=f59e0b' },
];

export default function Settings() {
  const { user, updateUser, refreshUser } = useAuth();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [learningGoal, setLearningGoal] = useState(user?.learningGoal || '');
  const [todayGoal, setTodayGoal] = useState(user?.todayGoal || 3.0);
  const [weeklyGoal, setWeeklyGoal] = useState(user?.weeklyGoal || 15.0);

  // Profile Save status
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Password fields & status
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Sync state when user updates in AuthContext
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setAvatarUrl(user.avatarUrl || '');
      setBio(user.bio || '');
      setLearningGoal(user.learningGoal || '');
      setTodayGoal(user.todayGoal ?? 3.0);
      setWeeklyGoal(user.weeklyGoal ?? 15.0);
    }
  }, [user]);

  // Check for unsaved changes
  const hasUnsavedChanges =
    user &&
    (name !== (user.name || '') ||
      username !== (user.username || '') ||
      avatarUrl !== (user.avatarUrl || '') ||
      bio !== (user.bio || '') ||
      learningGoal !== (user.learningGoal || '') ||
      todayGoal !== (user.todayGoal ?? 3.0) ||
      weeklyGoal !== (user.weeklyGoal ?? 15.0));

  const handleReset = () => {
    if (!user) return;
    setName(user.name || '');
    setUsername(user.username || '');
    setAvatarUrl(user.avatarUrl || '');
    setBio(user.bio || '');
    setLearningGoal(user.learningGoal || '');
    setTodayGoal(user.todayGoal ?? 3.0);
    setWeeklyGoal(user.weeklyGoal ?? 15.0);
    setSaveError(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const res = await usersApi.updateProfile({
      name: name.trim(),
      username: username.trim(),
      avatarUrl: avatarUrl.trim(),
      bio: bio.trim(),
      learningGoal: learningGoal.trim(),
      todayGoal,
      weeklyGoal,
    });

    setSaving(false);

    if (res.success && res.data?.user) {
      updateUser(res.data.user);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
      await refreshUser();
    } else {
      setSaveError(res.error?.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      setPasswordSaving(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      setPasswordSaving(false);
      return;
    }

    const res = await usersApi.changePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    setPasswordSaving(false);

    if (res.success) {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3500);
    } else {
      setPasswordError(res.error?.message || 'Failed to change password.');
    }
  };

  const inputStyle = {
    background: '#090918',
    border: '1px solid rgba(100,70,200,0.12)',
    color: '#f0ecff',
    borderRadius: 8,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <SettingsIcon size={22} className="text-[#8b47f3]" />
            <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight" style={{ color: '#f0ecff' }}>
              Settings & Profile
            </h1>
          </div>
          <p className="text-[13.5px]" style={{ color: '#6868a8' }}>
            Manage your authenticated developer profile, avatar, goals, and account security
          </p>
        </div>

        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-[12px] font-medium"
            style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}>
            <span>● Unsaved changes</span>
            <button
              onClick={handleReset}
              className="underline hover:text-white ml-1 cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="card p-6 space-y-6">
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(100,70,200,0.07)' }}>
          <div>
            <h2 className="text-[15px] font-semibold" style={{ color: '#f0ecff' }}>
              Developer Profile
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: '#6868a8' }}>
              Your public identity across DevTrack dashboard and roadmaps
            </p>
          </div>
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-[12.5px] font-medium" style={{ color: '#4dd0a1' }}>
              <CheckCircleIcon size={15} />
              Profile updated in MongoDB!
            </div>
          )}
        </div>

        {saveError && (
          <div className="p-3 rounded-[8px] text-[13px]" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
            {saveError}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-5">
          {/* Avatar selection & preview */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: '#6868a8' }}>
              Avatar
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  border: '2px solid #8b47f3',
                  boxShadow: '0 0 12px rgba(139,71,243,0.3)',
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-[18px] font-bold text-white font-mono">
                    {user?.initials || 'DV'}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-[200px] space-y-2">
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Paste image URL (https://...)"
                  className="w-full px-3.5 py-2 text-[13px]"
                  style={inputStyle}
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px]" style={{ color: '#50508a' }}>Quick presets:</span>
                  {PRESET_AVATARS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className="px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer"
                      style={{
                        background: avatarUrl === preset.url ? 'rgba(139,71,243,0.2)' : 'rgba(255,255,255,0.04)',
                        color: avatarUrl === preset.url ? '#8b47f3' : '#6868a8',
                        border: `1px solid ${avatarUrl === preset.url ? '#8b47f3' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-[11px] text-red-400 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#6868a8' }}>
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3.5 py-2.5 text-[13.5px]"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#6868a8' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full px-3.5 py-2.5 text-[13.5px]"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-medium uppercase tracking-widest" style={{ color: '#6868a8' }}>
                Bio & Developer Summary
              </label>
              <span className="text-[11px]" style={{ color: bio.length > 450 ? '#fbbf24' : '#50508a' }}>
                {bio.length} / 500
              </span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other devs about what you are building and learning..."
              rows={3}
              maxLength={500}
              className="w-full px-3.5 py-2.5 text-[13.5px] leading-relaxed resize-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#6868a8' }}>
              Primary Learning Goal
            </label>
            <input
              type="text"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              placeholder="e.g. Master Full-Stack React & Node.js Architecture"
              className="w-full px-3.5 py-2.5 text-[13.5px]"
              style={inputStyle}
            />
          </div>

          <div className="pt-2">
            <h3 className="text-[13.5px] font-semibold mb-3" style={{ color: '#f0ecff' }}>
              Daily & Weekly Learning Targets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#6868a8' }}>
                  Daily Goal (Hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={todayGoal}
                  onChange={(e) => setTodayGoal(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-[13.5px]"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#6868a8' }}>
                  Weekly Goal (Hours)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="168"
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
              disabled={saving}
              className="px-5 py-2.5 rounded-[8px] text-[13px] font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ background: '#8b47f3', color: 'white' }}
            >
              {saving ? 'Saving to MongoDB...' : 'Save Profile Changes'}
            </button>

            {hasUnsavedChanges && (
              <span className="text-[12px]" style={{ color: '#fbbf24' }}>
                You have unsaved changes
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid rgba(100,70,200,0.07)' }}>
          <LockIcon size={16} className="text-[#8b47f3]" />
          <div>
            <h2 className="text-[15px] font-semibold" style={{ color: '#f0ecff' }}>
              Security & Password
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: '#6868a8' }}>
              Update your account password securely using bcrypt encryption
            </p>
          </div>
        </div>

        {passwordError && (
          <div className="p-3 rounded-[8px] text-[13px]" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 rounded-[8px] text-[13px] flex items-center gap-2" style={{ background: 'rgba(77,208,161,0.1)', border: '1px solid rgba(77,208,161,0.25)', color: '#4dd0a1' }}>
            <CheckCircleIcon size={15} />
            Password changed successfully!
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#6868a8' }}>
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-[13.5px]"
              style={inputStyle}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#6868a8' }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2.5 text-[13.5px]"
                style={inputStyle}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#6868a8' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 text-[13.5px]"
                style={inputStyle}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-5 py-2.5 rounded-[8px] text-[13px] font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ background: '#7c3aed', color: 'white' }}
            >
              {passwordSaving ? 'Verifying & Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Account Info & Database Status */}
      <div className="card p-6 space-y-4">
        <h2 className="text-[15px] font-semibold" style={{ color: '#f0ecff' }}>
          Backend & Engine Status
        </h2>
        <div className="p-4 rounded-[8px] space-y-2.5 text-[12.5px]" style={{ background: 'rgba(139,71,243,0.04)', border: '1px solid rgba(139,71,243,0.1)' }}>
          <div className="flex justify-between items-center">
            <span style={{ color: '#6868a8' }}>Database Engine</span>
            <span className="font-mono text-[11.5px]" style={{ color: '#4dd0a1' }}>MongoDB (Live Connected)</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: '#6868a8' }}>Authentication Provider</span>
            <span className="font-mono text-[11.5px]" style={{ color: '#4dd0a1' }}>JWT / Express Auth</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: '#6868a8' }}>User Account ID</span>
            <span className="font-mono text-[11.5px]" style={{ color: '#8b47f3' }}>{user?._id || user?.id || 'Connected'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: '#6868a8' }}>Account Email</span>
            <span className="font-mono text-[11.5px]" style={{ color: '#f0ecff' }}>{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
