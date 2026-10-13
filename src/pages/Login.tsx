import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HanaMiniSVG, SakuraPetals } from '../components/ui/WaifuCompanion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email/username and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  const inputStyle = {
    background: '#090918',
    border: '1px solid rgba(100,70,200,0.14)',
    color: '#f0ecff',
    borderRadius: 8,
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4 relative" style={{ background: '#060610' }}>
      <SakuraPetals />

      <div className="w-full max-w-[420px] relative z-10 space-y-6">
        {/* Header logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center accent-glow"
              style={{ background: 'linear-gradient(135deg, #6418c8 0%, #8b47f3 100%)' }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 5l5-5-5-5v10z" fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-[22px] tracking-tight" style={{ color: '#f0ecff' }}>
              DevTrack
            </span>
          </div>
          <p className="text-[13px]" style={{ color: '#6868a8' }}>
            Collaborative full-stack learning tracker & AI coach
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-6 sm:p-8 space-y-5" style={{ borderColor: 'rgba(139,71,243,0.18)' }}>
          <div className="flex items-center gap-3 pb-2" style={{ borderBottom: '1px solid rgba(100,70,200,0.08)' }}>
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ background: '#120a2a', boxShadow: '0 0 0 1.5px rgba(139,71,243,0.2)' }}>
              <HanaMiniSVG />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold" style={{ color: '#f0ecff' }}>
                Welcome Back
              </h2>
              <p className="text-[11.5px]" style={{ color: '#50508a' }}>
                Sign in to continue your learning streak
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-[8px] text-[12.5px] leading-snug" style={{ background: 'rgba(204,34,85,0.1)', border: '1px solid rgba(204,34,85,0.25)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#383868' }}>
                Email or Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@devtrack.io or alexchen"
                className="w-full px-3.5 py-2.5 text-[13.5px] transition-colors"
                style={inputStyle}
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-widest" style={{ color: '#383868' }}>
                  Password
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-[13.5px] transition-colors"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-[8px] text-[13.5px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              style={{ background: '#8b47f3', color: 'white' }}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-[12.5px]" style={{ color: '#6868a8' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold transition-opacity hover:opacity-80" style={{ color: '#8b47f3' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
