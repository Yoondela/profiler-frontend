import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import UserAvatar from './common/UserAvatar';

export default function Navbar() {
  const [pageMenuOpen, setPageMenuOpen] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } =
    useAuth0();

  const togglePageMenu = () => setPageMenuOpen((prev) => !prev);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gray-300 shadow-md">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="font-bold tracking-wide hover:text-gray-600 transition"
        >
          EXALT
        </Link>

        <MoreHorizontal
          className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800 transition"
          onClick={togglePageMenu}
        />
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
          <div className="flex items-center gap-3">
            <UserAvatar user={user} />
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {pageMenuOpen && (
        <div className="absolute right-6 top-14 flex flex-col bg-white border border-gray-200 shadow-lg rounded-xl p-3 space-y-2 z-50">
          <Link
            to="/"
            onClick={() => setPageMenuOpen(false)}
            className="text-gray-700 hover:text-black transition"
          >
            About
          </Link>
          <Link
            to="/"
            onClick={() => setPageMenuOpen(false)}
            className="text-gray-700 hover:text-black transition"
          >
            Services
          </Link>
          <Link
            to="/"
            onClick={() => setPageMenuOpen(false)}
            className="text-gray-700 hover:text-black transition"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
