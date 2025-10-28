import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/sub/Navbar';
import { CreateUser } from './api/sync/SyncUser';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { UserProvider } from './api/context/userContext';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import './assets/css/animate.css';

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
      <UserProvider>
        <CreateUser />
        <Navbar />
        <AppRoutes />
        <Toaster position="top-right" />
      </UserProvider>
    </div>
  );
}

export default App;
