import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: '#060610' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#8b47f3', borderTopColor: 'transparent' }} />
          <span className="text-[13px] font-medium" style={{ color: '#6868a8' }}>Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
