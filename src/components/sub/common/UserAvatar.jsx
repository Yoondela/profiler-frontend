import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useProviderPortfolio from '@/hooks/useProviderPortfolio';
import AvatarColors from '@/data/avatar-colors.json';
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
  const [isProviderCtx] = useState(true);
  const { portfolio, loading, error, refetch } = useProviderPortfolio();

  console.log('UserAvatar: portfolio', portfolio);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const avatarColor = AvatarColors[userInitial] || '#888';
  const companyName =
    portfolio?.company?.name || user?.name || 'Service Provider';

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

            {portfolio && (
              <Link
                to="/provider-page"
                onClick={() => setMenuOpen(false)}
                className="user-menu-company"
              >
                <Building2 size={16} style={{ marginRight: '8px' }} />
                {companyName}
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
