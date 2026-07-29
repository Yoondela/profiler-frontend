import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AvatarColors from '@/data/avatar-colors.json';
import UserAvatarMenu from './AvatarMenu';
import { ChevronDown } from 'lucide-react';

export default function UserAvatar({ menu, menuPlacement = 'desktop' }) {
  const { user } = useAuth0();
  const [menuOpen, setMenuOpen] = useState(false);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const avatarColor = AvatarColors[userInitial] || '#888';

  const toggleMenu = () => {
    if (menu !== 'false') setMenuOpen((prev) => !prev);
  };

  const isMenuEnabled = menu !== 'false';
  const isMobilePlacement = menuPlacement === 'mobile';

  return (
    <div
      className={`user-avatar-container ${
        isMobilePlacement ? 'user-avatar-container--mobile' : ''
      }`}
    >
      <button
        type="button"
        className={`user-avatar ${isMobilePlacement ? 'user-avatar--mobile' : ''}`}
        style={{ backgroundColor: avatarColor }}
        onClick={toggleMenu}
      >
        <p>{userInitial}</p>
      </button>

      {isMenuEnabled && isMobilePlacement && (
        <button
          type="button"
          className="user-avatar-toggle md:hidden"
          aria-label="Open avatar menu"
          onClick={toggleMenu}
        >
          <ChevronDown size={18} />
        </button>
      )}

      {menuOpen && isMenuEnabled && (
        <UserAvatarMenu
          placement={menuPlacement}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}
