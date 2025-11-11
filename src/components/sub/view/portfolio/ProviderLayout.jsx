import React, { useState, useEffect } from 'react';
import PortfolioHeader from './PortfolioHeader';
import { getUserID } from '@/api/sync/SyncUser';
import { fetchPortfolio } from '@/api/sync/SyncPortfolio';
import { useAuth0 } from '@auth0/auth0-react';
// import PortfolioDetailsContainer from '@/containers/portfolio-details';

const PortfolioLayout = () => {
  const { user, isLoading, getAccessTokenSilently } = useAuth0();
  const [portfolioData, setPortfolioData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!user?.email || isLoading) return; // block until Auth0 ready

      try {
        setIsFetching(true);
        console.log('Fetching portfolio for:', user.email);

        const providerId = await getUserID(getAccessTokenSilently, user.email);
        console.log('Fetched backend user ID:', providerId);

        const data = await fetchPortfolio(providerId);
        console.log('Portfolio fetched:', data);

        setPortfolioData(data);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchPortfolioData();
  }, [user?.email, isLoading]); // trigger only after Auth0 loads

  if (isLoading || isFetching) {
    return <div className="p-4">Loading portfolio...</div>;
  }

  if (!portfolioData) {
    return <div className="p-4 text-muted-foreground">No portfolio found.</div>;
  }

  return (
    <div className="provider-page">
      <PortfolioHeader
        bannerUrl={portfolioData.bannerUrl}
        logoUrl={portfolioData.logoUrl}
        providerName={portfolioData.company || 'Unknown Provider'}
        averageRating={portfolioData.rating}
        reviewCount={portfolioData.completedJobs}
      />

      <main className="provider-page__content">
        {/* <PortfolioDetailsContainer data={portfolioData} /> */}
      </main>

      <footer className="provider-page__footer">
        <small>ProviderPage footer</small>
      </footer>
    </div>
  );
};

export default PortfolioLayout;
