import { NavLink } from 'react-router';
import { LayoutDashboard, Home, Settings, LogOut, X, Building2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useAuthActions';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/units', label: 'Units', icon: Home },
  { path: '/settings/rates', label: 'Rate Settings', icon: Settings },
];

export type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div
      className={`
        flex flex-col h-full w-64 bg-base-200 border-r border-base-300 px-4 py-6
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo + Close button (mobile) */}
      <div className="mb-8 px-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-primary">Rental Manager</h1>
            <p className="text-xs text-base-content/50 mt-1">Landlord Dashboard</p>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-sm btn-square lg:hidden" aria-label="Close menu">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-primary-content' : 'text-base-content hover:bg-base-300'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
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
          {logout.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
