import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MoreHorizontal, User, Calendar, Clock, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth0();
  const [pageMenuOpen, setPageMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const avatarColors = {
    A: '#F44336',
    B: '#E91E63',
    C: '#9C27B0',
    D: '#673AB7',
    E: '#3F51B5',
    F: '#2196F3',
    G: '#03A9F4',
    H: '#00BCD4',
    I: '#009688',
    J: '#4CAF50',
    K: '#8BC34A',
    L: '#CDDC39',
    M: '#FFEB3B',
    N: '#FFC107',
    O: '#FF9800',
    P: '#FF5722',
    Q: '#795548',
    R: '#9E9E9E',
    S: '#607D8B',
    T: '#F44336',
    U: '#E91E63',
    V: '#9C27B0',
    W: '#3F51B5',
    X: '#2196F3',
    Y: '#009688',
    Z: '#4CAF50',
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const avatarColor = avatarColors[userInitial] || '#888';

  const togglePageMenu = () => setPageMenuOpen((prev) => !prev);
  const toggleUserMenu = () => setUserMenuOpen((prev) => !prev);

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

      <div
        className="navbar__avatar"
        style={{ backgroundColor: avatarColor }}
        onClick={toggleUserMenu}
      >
        <p>{userInitial}</p>
      </div>
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
      {userMenuOpen && (
        <div className="navbar__menu">
          <div className="navbar__menu-links">
            <Link to="/user-profile" onClick={() => setUserMenuOpen(false)}>
              <User size={16} style={{ marginRight: '8px' }} />
              Profile
            </Link>

            <Link to="/user-schedule" onClick={() => setUserMenuOpen(false)}>
              <Calendar size={16} style={{ marginRight: '8px' }} />
              Manage Schedule
            </Link>

            <Link to="/" onClick={() => setUserMenuOpen(false)}>
              <Clock size={16} style={{ marginRight: '8px' }} />
              History
            </Link>
          </div>

          <div className="navbar__divider"></div>

          <div
            onClick={() => {
              setUserMenuOpen(false);
              logout({ returnTo: window.location.origin });
            }}
            className="navbar__logout"
          >
            <LogOut size={16} style={{ marginRight: '8px' }} />
            Logout
          </div>
        </div>
      )}
    </nav>
  );
}
