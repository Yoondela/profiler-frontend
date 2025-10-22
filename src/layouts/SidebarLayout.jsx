import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sub/view/Sidebar';

export default function SidebarLayout() {
  return (
    <div className="flex rem">
      <div className="sidebar-side">
        <Sidebar />
      </div>

      <div className="content-side flex-1">
        <Outlet />
      </div>
    </div>
  );
}
