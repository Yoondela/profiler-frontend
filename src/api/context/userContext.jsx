import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [appUser_ID, setAppUser_ID] = useState(null);
  const [flackUser_ID, setFlackUser_ID] = useState(null);
  const [avatarUrlCtx, setAvatarUrlCtx] = useState(null);
  const [userCtx, setUserCtx] = useState(null);
  const [profileCtx, setProfileCtx] = useState(null);
  const [userAccountCtx, setUserAccountCtx] = useState(null);
  const [isProviderCtx, setIsProviderCtx] = useState(false);
  const [logoUrlCtx, setLogoUrlCtx] = useState(null);
  const [bannerUrlCtx, setBannerUrlCtx] = useState(null);
  const [bootstrapStatus, setBootstrapStatus] = useState('authenticating');
  const [provisioningError, setProvisioningError] = useState(null);
  const [provisioningAttempt, setProvisioningAttempt] = useState(0);

  const { isAuthenticated, isLoading, user, getAccessTokenSilently } =
    useAuth0();

  useEffect(() => {
    let cancelled = false;

    const clearApplicationUser = () => {
      setAppUser_ID(null);
      setFlackUser_ID(null);
      setAvatarUrlCtx(null);
      setUserCtx(null);
      setProfileCtx(null);
      setUserAccountCtx(null);
      setIsProviderCtx(false);
      setLogoUrlCtx(null);
      setBannerUrlCtx(null);
    };

    if (isLoading) {
      setBootstrapStatus('authenticating');
      setProvisioningError(null);
      return () => {
        cancelled = true;
      };
    }

    if (!isAuthenticated) {
      clearApplicationUser();
      setBootstrapStatus('anonymous');
      setProvisioningError(null);
      return () => {
        cancelled = true;
      };
    }

    const provisionUser = async () => {
      clearApplicationUser();
      setBootstrapStatus('provisioning');
      setProvisioningError(null);

      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });
        const apiUrl =
          import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

        const res = await axios.post(
          `${apiUrl}/users`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          const { newUser, profile } = res.data;

          if (!newUser || !profile) {
            throw new Error('Provisioning response is incomplete.');
          }

          setUserCtx(newUser);
          setAppUser_ID(newUser._id);
          setProfileCtx(profile);
          setUserAccountCtx({ user: newUser, profile });
          setAvatarUrlCtx(profile?.avatarUrl || null);
          setBootstrapStatus('ready');
        }
      } catch (err) {
        console.error('Failed to provision user', err);
        if (!cancelled) {
          const status = err.response?.status || null;
          const code = err.response?.data?.code || null;

          setProvisioningError({ status, code });
          setBootstrapStatus(
            status === 409 || code === 'ACCOUNT_IDENTITY_CONFLICT'
              ? 'conflict'
              : 'failure'
          );
        }
      }
    };

    provisionUser();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    isLoading,
    user?.sub,
    getAccessTokenSilently,
    provisioningAttempt,
  ]);

  console.log('User Context Data__________________:', userCtx);

  useEffect(() => {
    setFlackUser_ID(userCtx?.flackUserId || null);
    setIsProviderCtx(Boolean(userCtx?.roles?.includes('provider')));
  }, [userCtx]);

  return (
    <UserContext.Provider
      value={{
        userAccountCtx,
        setUserAccountCtx,
        appUser_ID,
        setAppUser_ID,
        avatarUrlCtx,
        setAvatarUrlCtx,
        userCtx,
        setUserCtx,
        profileCtx,
        setProfileCtx,
        isProviderCtx,
        setIsProviderCtx,
        logoUrlCtx,
        setLogoUrlCtx,
        bannerUrlCtx,
        setBannerUrlCtx,
        flackUser_ID,
        bootstrapStatus,
        provisioningError,
        retryProvisioning: () => {
          setProvisioningAttempt((attempt) => attempt + 1);
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
