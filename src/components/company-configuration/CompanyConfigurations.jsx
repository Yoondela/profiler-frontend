import { useState } from 'react';
import { Check, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolioContext } from '@/api/context/portfolioContext';
import ListCompanySection from './ListCompanySection';
import MembersSection from './MembersSection';
import WorkingHoursSection from './OfficeHours';
import HideServiceSection from './HideServiceSection';
import RequestModal from '../app-modals/RequestModal';
import CompanyDetailsEditor from './CompanyDetailsEditor';
import PortfolioDetailsEditor from './PortfolioDetailsEditor';
import { useCompanyConfigurationStore } from './companyConfigurationStore';

export default function CompanyConfigurations() {
  const { hasCompany, portfolioDataCtx } = usePortfolioContext();
  const [copied, setCopied] = useState(false);
  const activeEditor = useCompanyConfigurationStore(
    (state) => state.activeEditor
  );
  const setActiveEditor = useCompanyConfigurationStore(
    (state) => state.setActiveEditor
  );
  const isCompany = hasCompany();
  const businessPageId = portfolioDataCtx?.portfolio?.id;

  const copyBusinessPageLink = async () => {
    if (!businessPageId) return;

    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/providers/${businessPageId}/public`
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy business page link:', error);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-3 py-6 md:px-4 md:py-10">
      <aside
        aria-label="Company settings editors"
        className="hidden w-52 shrink-0 self-start md:block"
      >
        <nav className="space-y-1">
          <button
            type="button"
            onClick={() => setActiveEditor('configuration')}
            className={`w-full px-3 py-2 text-left text-sm transition-colors ${
              activeEditor === 'configuration'
                ? 'font-semibold text-gray-950'
                : 'text-gray-500 hover:text-gray-950'
            }`}
          >
            Configuration
          </button>
          <button
            type="button"
            disabled={!isCompany}
            onClick={() => setActiveEditor('details')}
            className={`w-full px-3 py-2 text-left text-sm transition-colors ${
              activeEditor === 'details'
                ? 'font-semibold text-gray-950'
                : 'text-gray-500 hover:text-gray-950'
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Company details
          </button>
          <button
            type="button"
            onClick={() => setActiveEditor('portfolio')}
            className={`w-full px-3 py-2 text-left text-sm transition-colors ${
              activeEditor === 'portfolio'
                ? 'font-semibold text-gray-950'
                : 'text-gray-500 hover:text-gray-950'
            }`}
          >
            Portfolio
          </button>
          <Link
            to="/user-gallery"
            className="block w-full px-3 py-2 text-left text-sm text-gray-500 transition-colors hover:text-gray-950"
          >
            Gallery
          </Link>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        {activeEditor === 'details' && isCompany ? (
          <CompanyDetailsEditor />
        ) : activeEditor === 'portfolio' ? (
          <PortfolioDetailsEditor />
        ) : (
          <>
            <ListCompanySection />
            <HideServiceSection />
            {isCompany && <MembersSection />}
            <WorkingHoursSection />
          </>
        )}
      </div>

      {businessPageId && (
        <aside className="hidden w-56 shrink-0 self-start md:block">
          <p className="px-3 text-sm font-medium text-gray-950">
            Business page
          </p>
          <button
            type="button"
            onClick={copyBusinessPageLink}
            className="mt-2 flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-500 transition-colors hover:text-gray-950"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <LinkIcon className="size-4" />
            )}
            {copied ? 'Copied' : 'Copy business page link'}
          </button>
        </aside>
      )}
    </div>
  );
}
