import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [appUser_ID, setAppUser_ID] = useState(null);
  const [avatarUrlCtx, setAvatarUrlCtx] = useState(null);
  const [userCtx, setUserCtx] = useState(null);
  const [profileCtx, setProfileCtx] = useState(null);
  const [userAccountCtx, setUserAccountCtx] = useState(null);
  const [isProviderCtx, setIsProviderCtx] = useState(false);
  const [logoUrlCtx, setLogoUrlCtx] = useState(null);
  const [bannerUrlCtx, setBannerUrlCtx] = useState(null);

  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated || isLoading) return;

      try {
        const token = await getAccessTokenSilently();

        const res = await axios.get(`http://localhost:3000/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserCtx(res.data);
      } catch (err) {
        console.error('Failed to fetch user', err);
      }
    };

    fetchUser();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  console.log('User Context Data__________________:', userCtx);

  useEffect(() => {
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
        user: userCtx,
        setUserCtx,
        profileCtx,
        setProfileCtx,
        isProviderCtx,
        setIsProviderCtx,
        logoUrlCtx,
        setLogoUrlCtx,
        bannerUrlCtx,
        setBannerUrlCtx,
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
