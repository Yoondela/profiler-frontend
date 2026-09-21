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

  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    let cancelled = false;

    const provisionUser = async () => {
      if (!isAuthenticated || isLoading) return;

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

          setUserCtx(newUser);
          setAppUser_ID(newUser._id);
          setProfileCtx(profile);
          setUserAccountCtx({ user: newUser, profile });
          setAvatarUrlCtx(profile?.avatarUrl || null);
        }
      } catch (err) {
        console.error('Failed to provision user', err);
      }
    };

    provisionUser();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  console.log('User Context Data__________________:', userCtx);

  useEffect(() => {
    setFlackUser_ID(userCtx?.flackUserId || null);
    console.log('Updated flackUser_ID is now:', flackUser_ID);
    if (userCtx?.roles) {
      setIsProviderCtx(userCtx.roles.includes('provider'));
    }
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
