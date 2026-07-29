import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Menu, X, Search, ArrowLeft } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import UserAvatar from './common/UserAvatar';
import CompanyMenu from './common/companyMenu';
import NotificationContainer from '../notifications/notificationContainer';
import { FlackContainer } from '@/modules/chat/flack/FlackContainer';
import ActionCenter from '../action-center/ActionCenter';
import { LiteChat } from '@/modules/chat/lite-chat/components/LiteChat';
import { MessageSquareMore, MessageSquareText } from 'lucide-react';
import SearchBar from '../intro/SearchBar';
import CitySelector from '../city/CitySelector';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [pageMenuOpen, setPageMenuOpen] = useState(false);

  const location = useLocation();
  const isFlack = location.pathname.startsWith('/flack');
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } =
    useAuth0();

  useEffect(() => {
    document.body.style.overflow = pageMenuOpen ? 'hidden' : '';
  }, [pageMenuOpen]);

  return (
    <nav className={`navbar ${isFlack ? 'navbar-flack' : ''}`}>
      {searchOpen && (
        <div className="flex items-center gap-3 w-full md:hidden">
          <button onClick={() => setSearchOpen(false)}>
            <ArrowLeft size={22} />
          </button>

          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
      )}
      {!searchOpen && (
        <>
          {/* Left Section */}
          <div className="flex items-center gap-3 md:gap-[2rem] lg:gap-[3.5rem]">
            <Link
              to="/"
              className="font-bold tracking-wide hover:text-gray-600 transition"
            >
              EXALT
            </Link>

            <div className="hidden md:block">
              <SearchBar />
            </div>
            <div className="flex items-center gap-3 md:hidden">
              <button onClick={() => setSearchOpen(true)}>
                <Search size={22} />
              </button>
            </div>
            <div className="hidden md:block">
              {isAuthenticated && <FlackContainer />}
            </div>
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
              <div className="flex flex-row items-center justify-between gap-12">
                <div className="flex flex-row-reverse items-center justify-between gap-4">
                  {/* <MessageContainer /> */}
                  <ActionCenter />

                  <LiteChat />

                  <NotificationContainer />
                </div>

                <div className="hidden md:block">
                  <CitySelector />
                </div>

                {/* <div className="md:hidden"> */}
                <button
                  onClick={() => setPageMenuOpen(true)}
                  className="md:hidden"
                >
                  <Menu size={24} />
                </button>
                {/* </div> */}

                <div className="flex flex-row items-center justify-between gap-3 hidden md:flex">
                  <div className="flex items-center mt-[1px]">
                    <CompanyMenu />
                  </div>
                  <div className="flex items-center">
                    <UserAvatar user={user} />
                  </div>
                </div>
                {/* <div className="md:hidden"> */}
                <MobileMenu
                  isOpen={pageMenuOpen}
                  onClose={() => setPageMenuOpen(false)}
                  user={user}
                  className="md:hidden"
                >
                  <p>Menu</p>
                </MobileMenu>
                {/* </div> */}
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
}
