import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import UserAvatar from './common/UserAvatar';

export default function Navbar() {
  const [pageMenuOpen, setPageMenuOpen] = useState(false);
  const togglePageMenu = () => setPageMenuOpen((prev) => !prev);

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__logo">
          EXALT
        </Link>
        <MoreHorizontal
          className="navbar__menu-icon"
          onClick={togglePageMenu}
        />
      </div>

      <UserAvatar />

      {pageMenuOpen && (
        <div className="navbar__menu">
          <Link to="/" onClick={() => setPageMenuOpen(false)}>
            About
          </Link>
          <Link to="/" onClick={() => setPageMenuOpen(false)}>
            Services
          </Link>
          <Link to="/" onClick={() => setPageMenuOpen(false)}>
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
