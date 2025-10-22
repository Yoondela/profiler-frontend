'use client';

import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const CreateUser = () => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });

        const res = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            sub: user.sub,
          }),
        });

        const data = await res.json();
        console.log('User synced:', data);
        setSynced(true);
      } catch (err) {
        console.error('Error syncing user to backend:', err);
      }
    };
    if (user && isAuthenticated && !synced) {
      syncUser();
    }
  }, [user, isAuthenticated, synced, getAccessTokenSilently]);

  return null;
};

export { CreateUser };
