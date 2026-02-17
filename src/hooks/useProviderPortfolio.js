import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserID } from '@/api/sync/SyncUser';
import { fetchPortfolio } from '@/api/sync/SyncPortfolio';
import { usePortfolioContext } from '@/api/context/portfolioContext';

export default function useProviderPortfolio() {
  const { user, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setPortfolioDataCtx } = usePortfolioContext();

  const fetchData = useCallback(async () => {
    if (authLoading || !user?.email) return;

    try {
      setLoading(true);
      setError(null);

      const userId = await getUserID(getAccessTokenSilently, user.email);
      const data = await fetchPortfolio(userId);

      console.log('useProviderPortfolio: fetched portfolio', data);
      setPortfolio(data);
      setPortfolioDataCtx(data);
    } catch (err) {
      console.error('useProviderPortfolio: failed to fetch', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [authLoading, user?.email, getAccessTokenSilently]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { portfolio, loading, error, refetch: fetchData };
}
