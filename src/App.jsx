import { use, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
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
import ProvisioningRecovery from '@/components/auth/ProvisioningRecovery';

import './assets/css/animate.css';
import './assets/css/globals.css';

function App() {
  const { isLoading, isAuthenticated, logout } = useAuth0();
  const location = useLocation();
  const {
    bootstrapStatus,
    flackUser_ID,
    provisioningError,
    retryProvisioning,
  } = useUserContext();

  const connect = useFlackStore((s) => s.connect);
  const isCreateAccountPreview =
    location.pathname === '/create-account-preview';

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

  if (
    isLoading ||
    (isAuthenticated &&
      ['authenticating', 'provisioning'].includes(bootstrapStatus))
  ) {
    return <SigningInLoader />;
  }

  if (isAuthenticated && bootstrapStatus !== 'ready') {
    return (
      <ProvisioningRecovery
        bootstrapStatus={bootstrapStatus}
        provisioningError={provisioningError}
        onRetry={retryProvisioning}
        onSignOut={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      />
    );
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
                    {!isCreateAccountPreview && <Navbar />}
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
