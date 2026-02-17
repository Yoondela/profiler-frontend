import useProviderPortfolio from '@/hooks/useProviderPortfolio';
import StarDisplay from '../common/StartDisplay';
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CompanyRating from './company-rating';
import Spinner from '../sub/LoadingSpinner';

export function CompanyAvatar() {
  const { portfolio, loading, error, refetch } = useProviderPortfolio();

  if (loading)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    );
  if (error)
    return <div className="p-4 text-red-500">Error loading portfolio.</div>;
  if (!portfolio)
    return <div className="p-4 text-muted-foreground">No portfolio found.</div>;

  return (
    <NavLink to="/provider-page">
      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={portfolio.logoUrl} />
          <AvatarFallback className="rounded-lg">Ex</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{portfolio.company.name}</span>
          <div className=" truncate flex items-center gap-1">
            <CompanyRating
              averageRating={portfolio.rating}
              reviewCount={portfolio.completedJobs}
            />
          </div>
        </div>
      </div>
    </NavLink>
  );
}
