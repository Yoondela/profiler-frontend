import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/sub/Navbar';
import { CreateUser } from './api/sync/SyncUser';
// import { Toaster } from 'react-hot-toast';
import { Toaster } from '@/components/ui/sonner';
import AppRoutes from './routes/AppRoutes';
import { UserProvider } from './api/context/userContext';
import { AOS } from 'aos';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import './assets/css/animate.css';
import './assets/css/globals.css';

function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  // useEffect(() => {
  //   AOS.init({
  //       offset: 80,
  //       duration: 1000,
  //       once: true,
  //       easing: "ease",
  //   });
  //   AOS.refresh();
  // }, []);
  return (
    <div>
      <UserProvider>
        {isAuthenticated && !isLoading && <CreateUser />}
        <Navbar />
        <AppRoutes />
        <Toaster />
      </UserProvider>
    </div>
  );
}

export default App;
