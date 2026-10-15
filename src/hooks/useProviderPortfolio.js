import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserID } from '@/api/sync/SyncUser';
import { fetchPortfolioEdits } from '@/api/sync/SyncPortfolio';
import { fetchGalleryImages } from '@/api/sync/SyncGallery';
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

      const [userId, token] = await Promise.all([
        getUserID(getAccessTokenSilently, user.email),
        getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }),
      ]);
      const [ownedPortfolio, gallery] = await Promise.all([
        fetchPortfolioEdits(userId, token),
        fetchGalleryImages(userId),
      ]);
      const { company: _company, ...portfolio } = ownedPortfolio;
      const data = {
        portfolio: {
          ...portfolio,
          type: 'individual',
          galleryPhotos: gallery.galleryPhotos,
        },
        company: null,
      };

      console.log('useProviderPortfolio: fetched owner portfolio', data);
      setPortfolio(data);
      setPortfolioDataCtx(data);
    } catch (err) {
      console.error('useProviderPortfolio: failed to fetch', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [authLoading, user?.email, getAccessTokenSilently, setPortfolioDataCtx]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { portfolio, loading, error, refetch: fetchData };
}
