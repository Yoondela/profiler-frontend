import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/view/Sidebar';
import UserProfile from './components/view/UserProfileView';
import UserSchedule from './components/view/UserScheduleView';
import CreateUser from './components/sync/CreateNewUser';
import { Toaster } from 'react-hot-toast';
// import Home from "./pages/Home";
// import About from "./pages/About";

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading || !isAuthenticated) return <p>Loading...</p>;

  return (
    <div>
      {/* Runs only once on signup/login */}
      <CreateUser />

      <Navbar />

      <div className="flex">
        <div className="sidebar-side">
          <Sidebar />
        </div>
        <div className="content-side">
          <Routes>
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/user-schedule" element={<UserSchedule />} />
            {/* <Route path="/about" element={<About />} /> */}
            {/* Default redirect if no route matches */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
