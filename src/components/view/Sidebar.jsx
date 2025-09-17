import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Calendar,
  History,
  Clock,
  ArrowRightIcon,
  ArrowLeftIcon,
  Home,
} from 'lucide-react';

export default function Sidebar({ children }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(window.innerWidth >= 670);
  const [collapseLocked, setCollapseLocked] = useState(false);

  // Detect screen size and force collapse on small devices
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setCollapseLocked(true); // lock collapsed
        setExpanded(false);
      } else {
        setCollapseLocked(false);
      }
    };

    handleResize(); // run on mount
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExpand = () => {
    if (!collapseLocked) {
      setExpanded(!expanded);
    }
  };

  // Hide sidebar only on home page
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
          <div className="nav-item">
            <History size={20} />
            {expanded && <span>History</span>}
          </div>
          <div className="nav-item">
            <Calendar size={20} />
            {expanded && <span>Calendar</span>}
          </div>
          <div className="nav-item">
            <Clock size={20} />
            {expanded && <span>Upcoming</span>}
          </div>
        </nav>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
