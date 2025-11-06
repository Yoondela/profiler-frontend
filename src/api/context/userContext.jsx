import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [appUser_ID, setAppUser_ID] = useState(null);
  const [avatarUrlCtx, setAvatarUrlCtx] = useState(null);
  const [userCtx, setUserCtx] = useState(null);
  const [profileCtx, setProfileCtx] = useState(null);
  const [userAccountCtx, setUserAccountCtx] = useState(null);

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
