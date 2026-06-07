import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  MapPin,
  FileSearch,
  BookOpen,
  Shield,
  Building2,
  LogOut,
} from 'lucide-react';
import { useApp } from '../store/appStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analysis', label: 'Image Analysis', icon: Camera },
  { path: '/gps', label: 'GPS Verification', icon: MapPin },
  { path: '/registry', label: 'Land Registry', icon: FileSearch },
  { path: '/mbook', label: 'MBook Generator', icon: BookOpen },
  { path: '/audit', label: 'Audit Reports', icon: Shield },
];

export default function Sidebar() {
  const { state, logout, dispatch } = useApp();
  const location = useLocation();

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      dispatch({ type: 'SET_SIDEBAR', payload: false });
    }
  };

  return (
    <>
      {state.sidebarOpen && (
        <div
          className="slide-panel__backdrop slide-panel__backdrop--visible"
          onClick={closeSidebar}
          style={{ zIndex: 99 }}
        />
      )}
      <aside className={`sidebar ${state.sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <Building2 size={22} />
          </div>
          <div>
            <div className="sidebar__brand-name">MBook AI</div>
            <div className="sidebar__brand-sub">Construction Verification</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
                onClick={closeSidebar}
              >
                <Icon size={20} className="sidebar__nav-icon" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">
              {state.user?.name?.charAt(0) || 'R'}
            </div>
            <div style={{ flex: 1 }}>
              <div className="sidebar__user-name">{state.user?.name || 'Rajesh Kumar'}</div>
              <div className="sidebar__user-role">{state.user?.role || 'Senior Auditor'}</div>
            </div>
            <button
              onClick={logout}
              style={{ color: 'var(--color-text-tertiary)', cursor: 'pointer' }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
