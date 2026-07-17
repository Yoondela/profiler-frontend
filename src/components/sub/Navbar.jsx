import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { MoreHorizontal } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import UserAvatar from './common/UserAvatar';
import CompanyMenu from './common/companyMenu';
import NotificationContainer from '../notifications/notificationContainer';
import { FlackContainer } from '@/modules/chat/flack/FlackContainer';
import { LiteChat } from '@/modules/chat/lite-chat/components/LiteChat';
import { MessageSquareMore, MessageSquareText } from 'lucide-react';
import SearchBar from '../intro/SearchBar';
import CitySelector from '../city/CitySelector';

export default function Navbar() {
  const [pageMenuOpen, setPageMenuOpen] = useState(false);
  const location = useLocation();
  const isFlack = location.pathname.startsWith('/flack');
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } =
    useAuth0();

  return (
    <nav className={`navbar !px-6 ${isFlack ? 'navbar-flack' : ''}`}>
      {/* Left Section */}
      <div className="flex items-center gap-[3.5rem]">
        <Link
          to="/"
          className="font-bold tracking-wide hover:text-gray-600 transition"
        >
          EXALT
        </Link>

        <SearchBar />
        {isAuthenticated && <FlackContainer />}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* If not authenticated, show Login button */}
        {!isAuthenticated && !isLoading && (
          <button
            onClick={() => loginWithRedirect()}
            className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition font-medium"
          >
            Sign in
          </button>
        )}

        {/* If authenticated, show avatar + optional logout */}
        {isAuthenticated && (
          <div className="flex flex-row items-center justify-between gap-20">
            <div className="flex flex-row items-center justify-between gap-7">
              {/* <MessageContainer /> */}

              <LiteChat />

              <NotificationContainer />
            </div>

            <CitySelector />

            <div className="flex flex-row items-center justify-between gap-3">
              <div className="flex items-center mt-[1px]">
                <CompanyMenu />
              </div>
              <div className="flex items-center">
                <UserAvatar user={user} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
