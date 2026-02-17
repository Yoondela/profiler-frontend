import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AvatarColors from '@/data/avatar-colors.json';
import { useAuth0 } from '@auth0/auth0-react';
import useProviderPortfolio from '@/hooks/useProviderPortfolio';

import { MoreVertical, LayersPlus, Settings2 } from 'lucide-react';

// import {
//   MoreVertical,
//   HelpCircle,
// } from 'lucide-react';

export default function CompanyMenu() {
  const { user } = useAuth0();
  const { portfolio, loading, error, refetch } = useProviderPortfolio();

  const [menuOpen, setMenuOpen] = useState(false);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const avatarColor = AvatarColors[userInitial] || '#888';

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div>
      <div>
        <button
          style={{ '--hover-color': avatarColor }}
          className="
            user-menu-company-more
            transition-colors
            hover:bg-[var(--hover-color)]
            hover:text-white
          "
          onClick={toggleMenu}
        >
          <MoreVertical size={15} />
        </button>
      </div>

      {menuOpen && (
        <div className="user-company-menu">
          <div className="user-company-menu-links">
            <Link to="/concern-config" onClick={() => setMenuOpen(false)}>
              <Settings2 size={16} style={{ marginRight: '8px' }} />
              Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
