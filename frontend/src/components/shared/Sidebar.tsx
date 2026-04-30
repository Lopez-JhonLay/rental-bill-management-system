import { NavLink } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useAuthActions';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/units', label: 'Units', icon: '🏠' },
  { path: '/settings/rates', label: 'Rate Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div className="flex flex-col h-full w-64 bg-base-200 border-r border-base-300 px-4 py-6">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-primary">🏢 Rental Manager</h1>
        <p className="text-xs text-base-content/50 mt-1">Landlord Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary text-primary-content' : 'text-base-content hover:bg-base-300'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info + Logout */}
      <div className="border-t border-base-300 pt-4 mt-4">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium truncate">{user?.full_name}</p>
          <p className="text-xs text-base-content/50 truncate">{user?.email}</p>
        </div>
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="btn btn-ghost btn-sm w-full justify-start gap-3"
        >
          {logout.isPending ? <span className="loading loading-spinner loading-xs" /> : <span>🚪</span>}
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
