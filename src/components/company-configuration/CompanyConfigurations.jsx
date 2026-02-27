import { usePortfolioContext } from '@/api/context/portfolioContext';
import ListCompanySection from './ListCompanySection';
import MembersSection from './MembersSection';
import WorkingHoursSection from './WorkingHoursSection';
import HideServiceSection from './HideServiceSection';

export default function CompanyConfigurations() {
  const { hasCompany } = usePortfolioContext();
  return (
    <div>
      <ListCompanySection />
      <HideServiceSection />
      {hasCompany() && <MembersSection />}
      <WorkingHoursSection />
    </div>
  );
}
