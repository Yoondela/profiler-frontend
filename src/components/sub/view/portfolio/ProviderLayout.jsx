import React, { useState, useEffect } from 'react';
import PortfolioHeader from './PortfolioHeader';
import { getUserID } from '@/api/sync/SyncUser';
import { fetchPortfolio } from '@/api/sync/SyncPortfolio';
import { useAuth0 } from '@auth0/auth0-react';
import PortfolioDetailsContainer from '@/components/sub/view/portfolio';
import useProviderPortfolio from '@/hooks/useProviderPortfolio';

const PortfolioLayout = () => {
  const { portfolio, loading, error, refetch } = useProviderPortfolio();

  if (loading) return <div className="p-4">Loading portfolio...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading portfolio.</div>;
  if (!portfolio)
    return <div className="p-4 text-muted-foreground">No portfolio found.</div>;

  return (
    <div className="provider-page">
      <PortfolioHeader
        bannerUrl={portfolio.bannerUrl}
        logoUrl={portfolio.logoUrl}
        providerName={portfolio.company || 'Unknown Provider'}
        averageRating={portfolio.rating}
        reviewCount={portfolio.completedJobs}
      />

      <main className="provider-page__content">
        <PortfolioDetailsContainer provider={portfolio} />
      </main>
    </div>
  );
};

export default PortfolioLayout;
