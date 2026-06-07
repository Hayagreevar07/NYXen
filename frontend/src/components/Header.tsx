import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu, ChevronDown } from 'lucide-react';
import { useApp } from '../store/appStore';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of all projects and activities' },
  '/analysis': { title: 'Image Analysis', subtitle: 'AI-powered construction image analysis' },
  '/gps': { title: 'GPS Verification', subtitle: 'Validate site coordinates and boundaries' },
  '/registry': { title: 'Land Registry', subtitle: 'Cross-reference land records and surveys' },
  '/mbook': { title: 'MBook Generator', subtitle: 'Measurement book generation and management' },
  '/audit': { title: 'Audit Reports', subtitle: 'Compliance audit and verification reports' },
};

export default function Header() {
  const location = useLocation();
  const { state, dispatch } = useApp();
  const pageInfo = pageTitles[location.pathname] || { title: 'MBook AI', subtitle: '' };

  return (
    <header className="header">
      <div className="header__left">
        <button
          className="header__hamburger"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="header__title">{pageInfo.title}</h1>
          <p className="header__subtitle">{pageInfo.subtitle}</p>
        </div>
      </div>

      <div className="header__right">
        <div className="header__search">
          <Search size={16} className="header__search-icon" />
          <input
            type="text"
            className="header__search-input"
            placeholder="Search projects, surveys..."
          />
        </div>

        <div className="header__notification">
          <Bell size={20} />
          <span className="header__notification-dot" />
        </div>

        <button className="header__user-btn">
          <div className="header__user-avatar">
            {state.user?.name?.charAt(0) || 'R'}
          </div>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
            {state.user?.name?.split(' ')[0] || 'Rajesh'}
          </span>
          <ChevronDown size={14} style={{ color: 'var(--color-text-tertiary)' }} />
        </button>
      </div>
    </header>
  );
}
