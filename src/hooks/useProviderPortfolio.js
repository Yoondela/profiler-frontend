import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchProviderPage } from '@/api/sync/SyncPortfolio';
import { useUserContext } from '@/api/context/userContext';

export default function useProviderPortfolio() {
  const { isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const { appUser_ID, bootstrapStatus } = useUserContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    if (
      authLoading ||
      bootstrapStatus === 'authenticating' ||
      bootstrapStatus === 'provisioning'
    ) {
      return;
    }

    if (!appUser_ID) {
      setLoading(false);
      setError(new Error('Unable to identify the provider.'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });
      const data = await fetchProviderPage(appUser_ID, token);

      setProfile(data.profile);
    } catch (err) {
      console.error('useProviderPortfolio: failed to fetch', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [appUser_ID, authLoading, bootstrapStatus, getAccessTokenSilently]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { profile, loading, error, refetch: fetchData };
}
