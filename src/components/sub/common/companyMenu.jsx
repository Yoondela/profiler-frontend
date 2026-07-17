import { useState } from 'react';
import { Link } from 'react-router-dom';
import AvatarColors from '@/data/avatar-colors.json';
import { useAuth0 } from '@auth0/auth0-react';
import useProviderPortfolio from '@/hooks/useProviderPortfolio';

import {
  MoreVertical,
  ScanEye,
  Settings2,
  SettingsIcon,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { PiLink } from 'react-icons/pi';

export default function CompanyMenu() {
  const { user } = useAuth0();
  const { portfolio } = useProviderPortfolio();

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const avatarColor = AvatarColors[userInitial] || '#888';
  const providerId =
    portfolio?.portfolio?.id ||
    portfolio?.portfolio?._id ||
    portfolio?.id ||
    portfolio?._id;
  const publicPageUrl = providerId
    ? `${window.location.origin}/providers/${providerId}/public`
    : `${window.location.origin}/`;

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCopyPublicLink = async () => {
    try {
      await navigator.clipboard.writeText(publicPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy public link:', err);
    }
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
              <SettingsIcon size={16} className="mr-2" />
              Settings
            </Link>
            <Link to="/concern-config" onClick={() => setMenuOpen(false)}>
              <Settings2 size={16} className="mr-2" />
              Manage
            </Link>

            {providerId && (
              <Link
                to={`/providers/${providerId}/public`}
                onClick={() => setMenuOpen(false)}
              >
                <ScanEye size={16} className="mr-2" />
                Business Page
              </Link>
            )}

            <button
              type="button"
              onClick={handleCopyPublicLink}
              className="flex items-center w-full"
            >
              <PiLink size={16} className="mr-2" />
              {copied ? 'Copied!' : 'Copy public link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
