import PortfolioHeader from './PortfolioHeader';
import PortfolioDetailsContainer from '@/components/sub/view/portfolio';
import useProviderPortfolio from '@/hooks/useProviderPortfolio';
import { PageLoadingSpinner } from '@/components/loader/page-loader';

const PortfolioLayout = () => {
  const { profile, loading, error } = useProviderPortfolio();

  if (loading) return <PageLoadingSpinner />;
  if (error)
    return <div className="p-4 text-red-500">Error loading portfolio.</div>;
  if (!profile)
    return <div className="p-4 text-muted-foreground">No portfolio found.</div>;

  return (
    <div className="provider-page pt-1">
      <PortfolioHeader profile={profile} />

      <main className="provider-page__content">
        <PortfolioDetailsContainer profile={profile} />
      </main>
    </div>
  );
};

export default PortfolioLayout;
