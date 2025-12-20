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
    <div className="min-h-screen flex flex-col">
      <PortfolioHeader
        bannerUrl={providerData.portfolio.bannerUrl}
        logoUrl={providerData.portfolio.logoUrl}
        providerName={providerData.portfolio.company || 'Unknown Provider'}
        averageRating={providerData.portfolio.rating}
        reviewCount={providerData.portfolio.completedJobs}
      />
      <div className="flex items-start w-full">
        <div className="w-3/4 space-x-6 p-6">
          <div className="">
            <PortfolioDetailsContainer portfolio={providerData.portfolio} />
          </div>
        </div>

        {/* <ResizableHandle withHandle className="bg-gray-400 w-px" /> */}

        <div className="w-1/4 border-s border-gray-200 p-6 sticky top-10">
          <div>
            <PublicProfile provider={providerData} className=" px-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
