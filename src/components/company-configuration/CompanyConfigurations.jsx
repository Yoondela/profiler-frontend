import { usePortfolioContext } from '@/api/context/portfolioContext';
import ListCompanySection from './ListCompanySection';
import MembersSection from './MembersSection';
import WorkingHoursSection from './OfficeHours';
import HideServiceSection from './HideServiceSection';
import RequestModal from '../app-modals/RequestModal';

export default function CompanyConfigurations() {
  const { hasCompany } = usePortfolioContext();
  return (
    <div>
      {/* <RequestModal open={true} /> */}
      <ListCompanySection />
      <HideServiceSection />
      {hasCompany() && <MembersSection />}
      <WorkingHoursSection />
    </div>
  );
}
