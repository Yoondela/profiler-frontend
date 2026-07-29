import { useAuth0 } from '@auth0/auth0-react';
import useProviderPortfolio from '@/hooks/useProviderPortfolio';
import {
  User,
  LogOut,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserAvatarMenu({ placement = 'desktop', onClose }) {
  const { user, logout } = useAuth0();
  const { portfolio } = useProviderPortfolio();

  const companyName =
    portfolio?.company?.name || user?.name || 'Service Provider';

  return (
    <div className={`user-menu user-menu--${placement}`}>
      <div className="user-menu-links">
        <Link to="/user-profile" onClick={onClose}>
          <User size={16} style={{ marginRight: '8px' }} />
          {user?.email}
        </Link>

        {portfolio && (
          <Link
            to="/provider-page"
            onClick={onClose}
            className="user-menu-company"
          >
            <Building2 size={16} style={{ marginRight: '8px' }} />
            {companyName}
          </Link>
        )}

        <Link to="/actions" onClick={onClose}>
          <HelpCircle size={16} style={{ marginRight: '8px' }} />
          Actions
        </Link>
      </div>

      <div className="user-menu-divider"></div>

      <div
        onClick={() => {
          onClose?.();
          logout({ logoutParams: { returnTo: window.location.origin } });
        }}
        className="user-menu-logout"
      >
        <LogOut size={16} style={{ marginRight: '8px' }} />
        <p>Logout</p>
      </div>
    </div>
  );
}
