import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/sub/Navbar';
import { CreateUser } from './api/sync/SyncUser';
// import { Toaster } from 'react-hot-toast';
import { Toaster } from '@/components/ui/sonner';
import AppRoutes from './routes/AppRoutes';
import { UserProvider } from './api/context/userContext';
import { AOS } from 'aos';
import { SearchContextProvider } from './components/intro/context/context';
import GoogleMapsProvider from './components/app-providers/GoogleMapsProvider';
import { PortfolioProvider } from './api/context/portfolioContext';
import { SocketProvider } from './api/context/socketContext';
import { NotificationProvider } from './api/context/notificationContext';
import { ServiceRequestWSProvider } from './api/context/ServiceRequestSocketContext';
import { useChatStore } from './modules/chat/store/chatStore';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import './assets/css/animate.css';
import './assets/css/globals.css';

function App() {
  const { isLoading, isAuthenticated, user } = useAuth0();

  const connect = useChatStore((s) => s.connect);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      connect(user?.name); // replace with real user later
    }
  }, [isLoading, isAuthenticated, connect]);

  return (
    <div>
      <UserProvider>
        <SocketProvider>
          <NotificationProvider>
            <PortfolioProvider>
              <GoogleMapsProvider>
                <SearchContextProvider>
                  {isAuthenticated && !isLoading && <CreateUser />}
                  <Navbar />
                  <ServiceRequestWSProvider>
                    <AppRoutes />
                  </ServiceRequestWSProvider>
                  <Toaster />
                </SearchContextProvider>
              </GoogleMapsProvider>
            </PortfolioProvider>
          </NotificationProvider>
        </SocketProvider>
      </UserProvider>
    </div>
  );
}

export default App;
