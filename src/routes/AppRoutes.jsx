import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/home';
import UserProfile from '../components/sub/view/UserProfileView';
import UserSchedule from '../components/sub/view/UserScheduleView';
import SidebarLayout from '../layouts/SidebarLayout';

function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* All routes that use Sidebar */}
      <Route element={<SidebarLayout />}>
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/user-schedule" element={<UserSchedule />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
