import { Routes, Route, Navigate } from 'react-router-dom';
import AuthCallback from '@/pages/AuthCallsback';
import HomePage from '../pages/home';
import UserProfile from '../components/sub/view/UserProfileView';
import UserSchedule from '../components/sub/view/UserScheduleView';
import SidebarLayout from '../layouts/SidebarLayout';
import ProviderDashboard from '@/components/sub/view/dashboard/ProviderDashboard';
import PortfolioLayout from '@/components/sub/view/portfolio/ProviderLayout';
import GalleryManager from '@/components/sub/view/gallery-manager/GalleryManager';
import ProviderPublicPage from '@/components/public-profile/PublickPage';
import SearchPage from '@/components/intro/SearchPage';
import CompanyConfigurations from '@/components/company-configuration/CompanyConfigurations';

function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />
      <Route path="/providers/:id/public" element={<ProviderPublicPage />} />
      <Route path="/search-app" element={<SearchPage />} />
      <Route path="/concern-config" element={<CompanyConfigurations />} />
      <Route path="/callback" element={<AuthCallback />} />

      {/* All routes that use Sidebar */}
      <Route element={<SidebarLayout />}>
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/provider-page" element={<PortfolioLayout />} />
        <Route path="/user-schedule" element={<UserSchedule />} />
        <Route path="/user-gallery" element={<GalleryManager />} />
      </Route>
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
