import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useProviderPortfolio from '@/hooks/useProviderPortfolio';
import AvatarColors from '@/data/avatar-colors.json';
import UserAvatarMenu from './AvatarMenu';
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

      {menuOpen && <UserAvatarMenu />}
    </div>
  );
}
