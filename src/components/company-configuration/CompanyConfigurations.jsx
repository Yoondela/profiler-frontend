import { usePortfolioContext } from '@/api/context/portfolioContext';
import ListCompanySection from './ListCompanySection';
import MembersSection from './MembersSection';

export default function CompanyConfigurations() {
  const { hasCompany } = usePortfolioContext();
  return (
    <div>
      <ListCompanySection />
      {hasCompany() && <MembersSection />}
    </div>
  );
}
