'use client';

import { useParams } from 'react-router-dom';
import { fetchPublicPage } from '@/api/lookup/publicPageApi';
import { useEffect, useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import PortfolioDetailsContainer from './PublicPortfolio';
import PublicProfile from './PublicProfile';
import PortfolioHeader from '../sub/view/portfolio/PortfolioHeader';

export default function ProviderPublicPage() {
  const { id } = useParams();
  const [providerData, setProviderData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchPublicPage(id);
      setProviderData(data);
    }
    loadData();
  }, [id]);

  if (!providerData) {
    return <div className="p-4">Loading…</div>;
  }

  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={75} className="overflow-auto">
          <PortfolioHeader
            bannerUrl={providerData.portfolio.bannerUrl}
            logoUrl={providerData.portfolio.logoUrl}
            providerName={providerData.portfolio.company || 'Unknown Provider'}
            averageRating={providerData.portfolio.rating}
            reviewCount={providerData.portfolio.completedJobs}
          />
          <div className="h-full overflow-auto">
            <PortfolioDetailsContainer portfolio={providerData.portfolio} />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-gray-400 w-px" />

        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-start justify-center px-6 overflow-auto">
            <PublicProfile provider={providerData} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
