import { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import UserAvatar from '../common/UserAvatar';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Calendar,
  History,
  Clock,
  ArrowRightIcon,
  ArrowLeftIcon,
  Home,
  LayoutDashboard,
} from 'lucide-react';

export default function Sidebar({ children }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(window.innerWidth >= 670);
  const [collapseLocked, setCollapseLocked] = useState(false);
  const { user } = useAuth0();

  // Detect screen size and lock collapse under 480px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setCollapseLocked(true);
        setExpanded(false);
      } else {
        setCollapseLocked(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExpand = () => {
    if (!collapseLocked) setExpanded(!expanded);
  };

  // Hide sidebar completely on home page
  if (location.pathname === '/') {
    return children;
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
        <div className="toggle" onClick={handleExpand}>
          {collapseLocked ? (
            <Home />
          ) : expanded ? (
            <ArrowLeftIcon />
          ) : (
            <ArrowRightIcon />
          )}
        </div>

        <nav>
          {/* === Dashboard Link === */}
          <NavLink
            to="/provider-dashboard"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span className="sidebar-title">Dashboard</span>
          </NavLink>

          {/* === Other Links === */}
          <NavLink
            to="/history"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <History size={20} />
            <span>History</span>
          </NavLink>

          <NavLink
            to="/user-schedule"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Calendar size={20} />
            <span>Calendar</span>
          </NavLink>

          <NavLink
            to="/upcoming"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Clock size={20} />
            <span>Upcoming</span>
          </NavLink>
        </nav>
        <div className="sidebar-avatar">
          <UserAvatar className="avatar" />
          {user ? <p className="username">{user.name}</p> : <p>User</p>}
          {/* <p></p> */}
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
