import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/home';
import UserProfile from '../components/sub/view/UserProfileView';
import UserSchedule from '../components/sub/view/UserScheduleView';
import SidebarLayout from '../layouts/SidebarLayout';
import ProviderDashboard from '@/components/sub/view/dashboard/ProviderDashboard';

function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* All routes that use Sidebar */}
      <Route element={<SidebarLayout />}>
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/user-schedule" element={<UserSchedule />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
