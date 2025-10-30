import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, Calendar, Clock, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserAvatar() {
  const { user, logout } = useAuth0();
  const [menuOpen, setMenuOpen] = useState(false);

  // Avatar color map
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

  const toggleMenu = () => setMenuOpen((prev) => !prev);

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

      {menuOpen && (
        <div className="user-menu">
          <div className="user-menu-links">
            <Link to="/user-profile" onClick={() => setMenuOpen(false)}>
              <User size={16} style={{ marginRight: '8px' }} />
              {user?.email}
            </Link>

            <Link to="/help" onClick={() => setMenuOpen(false)}>
              <Clock size={16} style={{ marginRight: '8px' }} />
              Help
            </Link>
          </div>

          <div className="user-menu-divider"></div>

          <div
            onClick={() => {
              setMenuOpen(false);
              logout({ logoutParams: { returnTo: window.location.origin } });
            }}
            className="user-menu-logout"
          >
            <LogOut size={16} style={{ marginRight: '8px' }} />
            <p>Logout</p>
          </div>
        </div>
      )}
    </div>
  );
}
