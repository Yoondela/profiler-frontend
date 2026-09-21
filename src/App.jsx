import { use, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/sub/Navbar';
// import { Toaster } from 'react-hot-toast';
import { Toaster } from '@/components/ui/sonner';
import AppRoutes from './routes/AppRoutes';
import { AOS } from 'aos';
import { SearchContextProvider } from './components/intro/context/context';
import GoogleMapsProvider from './components/app-providers/GoogleMapsProvider';
import { PortfolioProvider } from './api/context/portfolioContext';
import { BookingsProvider } from './api/context/bookingsContext';
import { SocketProvider } from './api/context/socketContext';
import { NotificationProvider } from './api/context/notificationContext';
import { ServiceRequestWSProvider } from './api/context/ServiceRequestSocketContext';
import { ServiceBookingWSProvider } from './api/context/ServiceBookingSocketContext';
import { useFlackStore } from './modules/chat/store/flackStore';
import { useUserContext } from './api/context/userContext';
import { CityProvider } from './components/city/context/cityContext';
import { ServiceBookingProvider } from '@/components/request/contexts/ServiceBookingContext.jsx';
import { SigningInLoader } from '@/components/loader/sign-in-loader';

import './assets/css/animate.css';
import './assets/css/globals.css';

function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  const { bootstrapStatus, flackUser_ID } = useUserContext();

  const connect = useFlackStore((s) => s.connect);

  useEffect(() => {
    console.log('CONNECTING TO CHAT SOCKET... with flackUserId:', flackUser_ID);

    if (
      !isLoading &&
      isAuthenticated &&
      bootstrapStatus === 'ready' &&
      flackUser_ID
    ) {
      if (!flackUser_ID) return;
      connect(flackUser_ID); // replace with real user later
    }
  }, [isLoading, isAuthenticated, bootstrapStatus, connect, flackUser_ID]);

  if (isLoading || (isAuthenticated && bootstrapStatus !== 'ready')) {
    return <SigningInLoader />;
  }

  return (
    <div>
      <CityProvider>
        <SocketProvider>
          <NotificationProvider>
            <PortfolioProvider>
              <BookingsProvider>
                <GoogleMapsProvider>
                  <SearchContextProvider>
                    <Navbar />
                    <ServiceRequestWSProvider>
                      <ServiceBookingWSProvider>
                        <ServiceBookingProvider>
                          <AppRoutes />
                        </ServiceBookingProvider>
                      </ServiceBookingWSProvider>
                    </ServiceRequestWSProvider>
                    <Toaster />
                  </SearchContextProvider>
                </GoogleMapsProvider>
              </BookingsProvider>
            </PortfolioProvider>
          </NotificationProvider>
        </SocketProvider>
      </CityProvider>
    </div>
  );
}

export default App;
