import { Routes, Route, Navigate } from 'react-router-dom';
import UserProfile from '../components/sub/view/UserProfileView';
import UserSchedule from '../components/sub/view/UserScheduleView';
// import About from '../pages/About';

function SubRoutes() {
  return (
    <Routes>
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/user-schedule" element={<UserSchedule />} />
      {/* <Route path="/about" element={<About />} /> */}

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default SubRoutes;
