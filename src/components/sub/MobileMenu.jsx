import { useState } from 'react';
import { X } from 'lucide-react';
import UserAvatar from './common/UserAvatar';
import { MenuItem } from './MenuItem';
import { PiLink } from 'react-icons/pi';
import useProviderPortfolio from '@/hooks/useProviderPortfolio';

import {
  User,
  SettingsIcon,
  Settings2,
  HelpCircle,
  ScanEye,
  Building2,
  MapPin,
  Bell,
  BriefcaseBusiness,
  MessageCircle,
  Settings,
  LogOut,
} from 'lucide-react';

export default function MobileMenu({ isOpen, onClose, user, children }) {
  const [copied, setCopied] = useState(false);

  const { providerId } = useProviderPortfolio;

  const handleCopyPublicLink = async () => {
    try {
      await navigator.clipboard.writeText(publicPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy public link:', err);
    }
  };

  const accountItems = [
    {
      label: 'Profile',
      icon: User,
      to: '/user-profile',
    },
    {
      label: 'Help',
      icon: HelpCircle,
      to: '/help',
    },
  ];

  const companyItems = [
    {
      label: 'Settings',
      icon: SettingsIcon,
      to: '/concern-config',
    },
    {
      label: 'Manage',
      icon: Settings2,
      to: '/concern-config',
    },
    {
      label: 'Business Page',
      icon: ScanEye,
      // to: `/providers/${providerId}/public`,
      hidden: !providerId,
    },
    {
      label: copied ? 'Copied!' : 'Copy public link',
      icon: PiLink,
      action: handleCopyPublicLink,
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/40 z-40 md:hidden
          transition-opacity duration-300
          ${
            isOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 right-0 h-screen w-[85vw] max-w-80 overflow-y-auto bg-white shadow-xl z-50 md:hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="relative border-b p-6">
          <button onClick={onClose} className="absolute top-4 right-4">
            <X size={22} />
          </button>

          <div className="flex flex-col items-center">
            <UserAvatar user={user} />

            <h2 className="mt-3 font-semibold">{user?.name}</h2>

            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="py-2">
          <div className="border-b py-2">{children}</div>

          <div className="border-b py-2">
            {accountItems
              .filter((item) => !item.hidden)
              .map((item) => (
                <MenuItem key={item.label} item={item} onClose={onClose} />
              ))}
          </div>
          <div className="border-b py-2">
            {companyItems
              .filter((item) => !item.hidden)
              .map((item) => (
                <MenuItem key={item.label} item={item} onClose={onClose} />
              ))}
          </div>
        </div>
      </aside>
    </>
  );
}
