import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useProviderPortfolio from '@/hooks/useProviderPortfolio';
import {
  User,
  Calendar,
  Clock,
  LogOut,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserAvatar({ menu }) {
  const { user, logout } = useAuth0();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProviderCtx, setIsProviderCtx] = useState(true);
  const { portfolio, loading, error, refetch } = useProviderPortfolio();

  // Avatar color map
  const avatarColors = {
    A: '#fb7185',
    B: '#f472b6',
    C: '#d946ef',
    D: '#a855f7',
    E: '#6d28d9',
    F: '#6366f1',
    G: '#60a5fa',
    H: '#0284c7',
    I: '#0e7490',
    J: '#67e8f9',
    K: '#0f766e',
    L: '#34d399',
    M: '#4ade80',
    N: '#bef264',
    O: '#a3e635',
    P: '#facc15',
    Q: '#fbbf24',
    R: '#9ca3af',
    S: '#374151',
    T: '#fdba74',
    U: '#fb923c',
    V: '#f87171',
    W: '#cbd5e1',
    X: '#2196F3',
    Y: '#8b5cf6',
    Z: '#4CAF50',
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const avatarColor = avatarColors[userInitial] || '#888';

  const toggleMenu = () => {
    if (menu !== 'false') setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div className="user-avatar-container">
      <div
        className="user-avatar"
        style={{ backgroundColor: avatarColor }}
        onClick={toggleMenu}
      >
        <p>{userInitial}</p>
      </div>

      {menuOpen && (
        <div className="user-menu">
          <div className="user-menu-links">
            <Link to="/user-profile" onClick={() => setMenuOpen(false)}>
              <User size={16} style={{ marginRight: '8px' }} />
              {user?.email}
            </Link>

            {isProviderCtx && (
              <Link to="/provider-page" onClick={() => setMenuOpen(false)}>
                <Building2 size={16} style={{ marginRight: '8px' }} />
                {portfolio.company}
              </Link>
            )}

            <Link to="/help" onClick={() => setMenuOpen(false)}>
              <HelpCircle size={16} style={{ marginRight: '8px' }} />
              Help
            </Link>
          </div>

          <div className="user-menu-divider"></div>

          <div
            onClick={() => {
              setMenuOpen(false);
              logout({ logoutParams: { returnTo: window.location.origin } });
            }}
            className="user-menu-logout"
          >
            <LogOut size={16} style={{ marginRight: '8px' }} />
            <p>Logout</p>
          </div>
        </div>
      )}
    </div>
  );
}
